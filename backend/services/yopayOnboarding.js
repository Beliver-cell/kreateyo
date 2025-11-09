const YopayOnboardingSession = require('../models/YopayOnboardingSession');
const YopayAccount = require('../models/YopayAccount');
const Business = require('../models/Business');
const flutterwaveService = require('./flutterwaveService');
const YopayConfig = require('../config/yopay');

class YopayOnboarding {
  constructor(businessId, country = 'NG') {
    this.businessId = businessId;
    this.country = country;
  }

  async startOnboarding() {
    try {
      const business = await Business.findById(this.businessId).populate('owner');
      if (!business) {
        throw new Error('Business not found');
      }

      // Check if already has Yopay account
      const existingAccount = await YopayAccount.findOne({ business: this.businessId });
      if (existingAccount) {
        throw new Error('Yopay account already exists');
      }

      // Check for existing in-progress session
      let session = await YopayOnboardingSession.findOne({
        business: this.businessId,
        status: 'in_progress'
      });

      if (!session) {
        session = await YopayOnboardingSession.create({
          business: this.businessId,
          country: this.country,
          steps: this.generateOnboardingSteps(),
          currentStep: 'business_verification'
        });
      }

      return {
        success: true,
        sessionId: session._id,
        currentStep: session.currentStep,
        steps: session.steps,
        progress: session.progress,
        estimatedTime: '10-15 minutes'
      };
    } catch (error) {
      console.error('Yopay onboarding start error:', error);
      throw error;
    }
  }

  generateOnboardingSteps() {
    const steps = [
      {
        id: 'business_verification',
        title: 'Business Information',
        description: 'Verify your business details',
        required: true,
        completed: false
      },
      {
        id: 'bank_account',
        title: 'Bank Account',
        description: 'Connect your payout bank account',
        required: true,
        completed: false
      },
      {
        id: 'kyc_verification',
        title: 'Identity Verification',
        description: 'Verify your identity',
        required: true,
        completed: false
      }
    ];

    if (this.country === 'NG') {
      steps.splice(1, 0, {
        id: 'bvn_verification',
        title: 'BVN Verification',
        description: 'Bank Verification Number required',
        required: true,
        completed: false
      });
    }

    return steps;
  }

  async processStep(sessionId, stepId, answers) {
    try {
      const session = await YopayOnboardingSession.findById(sessionId);
      if (!session) {
        throw new Error('Onboarding session not found');
      }

      if (session.status !== 'in_progress') {
        throw new Error('Session is not in progress');
      }

      // Validate step data
      await this.validateStepData(stepId, answers);

      // Store answers
      Object.keys(answers).forEach(key => {
        session.answers.set(key, answers[key]);
      });

      // Process step-specific logic
      await this.processStepLogic(stepId, answers, session);

      // Mark step as completed
      if (!session.completedSteps.includes(stepId)) {
        session.completedSteps.push(stepId);
      }

      // Update step status
      const stepIndex = session.steps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        session.steps[stepIndex].completed = true;
      }

      // Calculate progress
      session.progress = Math.round((session.completedSteps.length / session.steps.length) * 100);

      // Determine next step
      const nextStep = this.getNextStep(session);
      session.currentStep = nextStep;

      await session.save();

      // Check if onboarding is complete
      if (!nextStep || session.progress === 100) {
        return await this.completeOnboarding(session);
      }

      return {
        success: true,
        sessionId: session._id,
        currentStep: nextStep,
        progress: session.progress,
        completedSteps: session.completedSteps
      };
    } catch (error) {
      console.error('Yopay step processing error:', error);
      throw error;
    }
  }

  getNextStep(session) {
    const incompleteStep = session.steps.find(s => !s.completed);
    return incompleteStep ? incompleteStep.id : null;
  }

  async validateStepData(stepId, answers) {
    switch (stepId) {
      case 'business_verification':
        if (!answers.business_name || !answers.business_email) {
          throw new Error('Business name and email are required');
        }
        break;
      case 'bvn_verification':
        if (!answers.bvn || answers.bvn.length !== 11) {
          throw new Error('Valid BVN (11 digits) is required');
        }
        break;
      case 'bank_account':
        if (!answers.account_number || !answers.bank_code) {
          throw new Error('Account number and bank code are required');
        }
        break;
      case 'kyc_verification':
        if (!answers.id_type || !answers.id_number) {
          throw new Error('ID type and number are required');
        }
        break;
    }
  }

  async processStepLogic(stepId, answers, session) {
    switch (stepId) {
      case 'bank_account':
        // Resolve bank account with Flutterwave
        try {
          const resolution = await flutterwaveService.resolveBankAccount(
            answers.account_number,
            answers.bank_code
          );
          if (resolution.status === 'success') {
            session.answers.set('account_name', resolution.data.account_name);
          }
        } catch (error) {
          console.error('Bank account resolution error:', error);
        }
        break;
    }
  }

  async completeOnboarding(session) {
    try {
      const business = await Business.findById(session.business).populate('owner');

      // Create Flutterwave subaccount
      const subaccountData = {
        account_bank: session.answers.get('bank_code'),
        account_number: session.answers.get('account_number'),
        business_name: session.answers.get('business_name') || business.name,
        business_email: business.owner.email,
        business_contact: session.answers.get('contact_name') || business.owner.name,
        business_mobile: session.answers.get('business_phone') || business.owner.phone,
        country: session.country,
        split_type: 'percentage',
        split_value: YopayConfig.tieredFees.solo, // Default to solo tier
        meta: [
          {
            meta_name: 'created_via',
            meta_value: 'yopay_kreateyo'
          },
          {
            meta_name: 'yopay_business_id',
            meta_value: business._id.toString()
          }
        ]
      };

      const subaccount = await flutterwaveService.createSubAccount(subaccountData);

      // Create Yopay account
      const yopayAccount = await YopayAccount.create({
        business: session.business,
        businessType: business.type || 'ecommerce',
        userTier: 'solo',
        flutterwaveSubaccountId: subaccount.data.subaccount_id,
        accountNumber: session.answers.get('account_number'),
        bankCode: session.answers.get('bank_code'),
        bankName: session.answers.get('bank_name'),
        accountName: session.answers.get('account_name'),
        country: session.country,
        currency: YopayConfig.currencies[session.country],
        status: 'active'
      });

      // Update session
      session.status = 'completed';
      session.completedAt = new Date();
      session.yopayAccount = yopayAccount._id;
      await session.save();

      // Update business
      await Business.findByIdAndUpdate(session.business, {
        'paymentSettings.provider': 'yopay',
        'paymentSettings.status': 'active',
        'paymentSettings.activatedAt': new Date()
      });

      return {
        success: true,
        completed: true,
        message: 'Yopay activated successfully!',
        account: yopayAccount,
        nextSteps: [
          'Payments are now live on your website',
          'Manage payouts in your Yopay dashboard',
          'View transactions and analytics'
        ]
      };
    } catch (error) {
      console.error('Yopay onboarding completion error:', error);
      session.status = 'failed';
      session.error = error.message;
      await session.save();
      throw error;
    }
  }
}

module.exports = YopayOnboarding;
