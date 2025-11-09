const YopayPaymentService = require('../services/yopayPaymentService');
const YopayAccount = require('../models/YopayAccount');
const YopayOnboarding = require('../services/yopayOnboarding');
const YopayOnboardingSession = require('../models/YopayOnboardingSession');
const YopayIntegration = require('../services/yopayIntegration');
const flutterwaveService = require('../services/flutterwaveService');
const yopayLogger = require('../utils/yopayLogger');

// Onboarding
exports.startOnboarding = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { country } = req.body;

    yopayLogger.info('Onboarding started', { businessId, country });

    const onboarding = new YopayOnboarding(businessId, country || 'NG');
    const result = await onboarding.startOnboarding();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    yopayLogger.error('Start onboarding error', { error: error.message, stack: error.stack });
    res.status(error.message.includes('already exists') ? 409 : 500).json({
      success: false,
      error: error.message || 'Failed to start onboarding'
    });
  }
};

exports.processStep = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { stepId, answers } = req.body;

    const session = await YopayOnboardingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    yopayLogger.info('Processing onboarding step', { sessionId, stepId, businessId: session.business });

    const onboarding = new YopayOnboarding(session.business, session.country);
    const result = await onboarding.processStep(sessionId, stepId, answers);

    // If onboarding completed, inject payment integration
    if (result.completed) {
      try {
        yopayLogger.info('Injecting payment integration', { businessId: session.business });
        await YopayIntegration.injectYopayPayments(session.business, result.account);
        yopayLogger.info('Payment integration successful', { businessId: session.business });
      } catch (integrationError) {
        yopayLogger.error('Payment integration error', { 
          error: integrationError.message, 
          businessId: session.business 
        });
        // Don't fail the onboarding, just log the error
      }
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    yopayLogger.error('Process step error', { error: error.message, sessionId: req.params.sessionId });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process step'
    });
  }
};

exports.getOnboardingStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await YopayOnboardingSession.findById(sessionId).populate('yopayAccount');
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: {
        status: session.status,
        progress: session.progress,
        currentStep: session.currentStep,
        completedSteps: session.completedSteps,
        steps: session.steps,
        yopayAccount: session.yopayAccount
      }
    });
  } catch (error) {
    yopayLogger.error('Get onboarding status error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch onboarding status'
    });
  }
};

// Account Management
exports.createYopayAccount = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { bankDetails, userTier } = req.body;

    const existingAccount = await YopayAccount.findOne({ business: businessId });
    if (existingAccount) {
      return res.status(409).json({
        success: false,
        error: 'Yopay account already exists for this business'
      });
    }

    const subaccountId = `SUBACCT_${Date.now()}`;

    const yopayAccount = await YopayAccount.create({
      business: businessId,
      businessType: req.business?.type || 'ecommerce',
      userTier: userTier || 'solo',
      flutterwaveSubaccountId: subaccountId,
      accountNumber: bankDetails.accountNumber,
      bankCode: bankDetails.bankCode,
      bankName: bankDetails.bankName,
      accountName: bankDetails.accountName
    });

    yopayLogger.info('Yopay account created', { businessId, userTier: yopayAccount.userTier });

    res.status(201).json({
      success: true,
      data: yopayAccount
    });
  } catch (error) {
    yopayLogger.error('Create Yopay account error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to create Yopay account'
    });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const { businessId } = req.params;

    const yopayAccount = await YopayAccount.findOne({ business: businessId });
    if (!yopayAccount) {
      return res.status(404).json({
        success: false,
        error: 'Yopay account not found'
      });
    }

    res.json({
      success: true,
      data: yopayAccount
    });
  } catch (error) {
    yopayLogger.error('Get account error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account'
    });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { businessId } = req.params;
    const updates = req.body;

    const yopayAccount = await YopayAccount.findOneAndUpdate(
      { business: businessId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!yopayAccount) {
      return res.status(404).json({
        success: false,
        error: 'Yopay account not found'
      });
    }

    yopayLogger.info('Yopay account updated', { businessId, updates: Object.keys(updates) });

    res.json({
      success: true,
      data: yopayAccount
    });
  } catch (error) {
    yopayLogger.error('Update account error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to update account'
    });
  }
};

// Payment Processing
exports.processPayment = async (req, res) => {
  try {
    const { businessId } = req.params;
    const paymentData = req.body;

    yopayLogger.payment('Payment initiated', {
      businessId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      customerEmail: paymentData.customer_email
    });

    const result = await YopayPaymentService.processPayment(paymentData, businessId);

    yopayLogger.payment('Payment processed', {
      businessId,
      txRef: result.transaction?.txRef,
      status: result.transaction?.status
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    yopayLogger.error('Process payment error', { error: error.message, businessId: req.params.businessId });
    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed'
    });
  }
};

exports.webhookHandler = async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    
    // CRITICAL: Verify webhook signature
    if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      yopayLogger.error('Invalid webhook signature', { 
        signature: signature?.substring(0, 10) + '...',
        ip: req.ip 
      });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    yopayLogger.info('Webhook received', { 
      event, 
      txRef: data.tx_ref,
      status: data.status 
    });

    // Only process Yopay transactions
    if (!data.meta?.yopay_transaction) {
      yopayLogger.info('Non-Yopay transaction, skipping', { txRef: data.tx_ref });
      return res.status(200).json({ status: 'ignored' });
    }

    if (event === 'charge.completed') {
      if (data.status === 'successful') {
        await YopayPaymentService.handleSuccessfulPayment(data.tx_ref, data);
        yopayLogger.payment('Payment successful', { 
          txRef: data.tx_ref, 
          amount: data.amount 
        });
      } else if (data.status === 'failed') {
        await YopayPaymentService.handleFailedPayment(data.tx_ref, data);
        yopayLogger.payment('Payment failed', { 
          txRef: data.tx_ref, 
          reason: data.status 
        });
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    yopayLogger.error('Webhook error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Dashboard & Analytics
exports.getDashboard = async (req, res) => {
  try {
    const { businessId } = req.params;

    const dashboard = await YopayPaymentService.getYopayDashboard(businessId);

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    yopayLogger.error('Dashboard fetch error', { error: error.message, businessId: req.params.businessId });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const Transaction = require('../models/Transaction');

    const query = { business: businessId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        hasMore: skip + transactions.length < total
      }
    });
  } catch (error) {
    yopayLogger.error('Get transactions error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { businessId } = req.params;

    const Transaction = require('../models/Transaction');

    // Use aggregation for performance
    const balance = await Transaction.aggregate([
      {
        $match: {
          business: businessId,
          status: 'successful'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalFees: { $sum: '$fees.total' },
          netBalance: { $sum: '$netAmount' }
        }
      }
    ]);

    const result = balance[0] || { totalRevenue: 0, totalFees: 0, netBalance: 0 };

    res.json({
      success: true,
      data: {
        available: result.netBalance.toFixed(2),
        pending: '0.00',
        totalProcessed: result.totalRevenue.toFixed(2)
      }
    });
  } catch (error) {
    yopayLogger.error('Get balance error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance'
    });
  }
};

// Tier Management
exports.updateTier = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { newTier } = req.body;

    if (!['solo', 'team', 'enterprise'].includes(newTier)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tier. Must be solo, team, or enterprise'
      });
    }

    const result = await YopayPaymentService.updateYopayTier(businessId, newTier);

    yopayLogger.info('Tier updated', { businessId, oldTier: result.oldTier, newTier });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    yopayLogger.error('Update tier error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to update tier'
    });
  }
};

// Utility
exports.getBanks = async (req, res) => {
  try {
    const { country } = req.query;
    const banks = await flutterwaveService.getBanks(country || 'NG');

    res.json({
      success: true,
      data: banks.data
    });
  } catch (error) {
    yopayLogger.error('Get banks error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch banks'
    });
  }
};

exports.resolveBankAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
      return res.status(400).json({
        success: false,
        error: 'Account number and bank code are required'
      });
    }

    const result = await flutterwaveService.resolveBankAccount(accountNumber, bankCode);

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    yopayLogger.error('Resolve bank account error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to resolve bank account'
    });
  }
};
