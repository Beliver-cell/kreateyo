const YopayPaymentService = require('../services/yopayPaymentService');
const YopayAccount = require('../models/YopayAccount');
const YopayOnboarding = require('../services/yopayOnboarding');
const YopayOnboardingSession = require('../models/YopayOnboardingSession');
const flutterwaveService = require('../services/flutterwaveService');

// Onboarding
exports.startOnboarding = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { country } = req.body;

    const onboarding = new YopayOnboarding(businessId, country || 'NG');
    const result = await onboarding.startOnboarding();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Start onboarding error:', error);
    res.status(500).json({
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

    const onboarding = new YopayOnboarding(session.business, session.country);
    const result = await onboarding.processStep(sessionId, stepId, answers);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Process step error:', error);
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
    console.error('Get onboarding status error:', error);
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

    res.status(201).json({
      success: true,
      data: yopayAccount
    });
  } catch (error) {
    console.error('Create Yopay account error:', error);
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
    console.error('Get account error:', error);
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
      { new: true }
    );

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
    console.error('Update account error:', error);
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

    const result = await YopayPaymentService.processPayment(paymentData, businessId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed'
    });
  }
};

exports.webhookHandler = async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    
    if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    if (event === 'charge.completed' && data.status === 'successful') {
      await YopayPaymentService.handleSuccessfulPayment(data.tx_ref, data);
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
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
    console.error('Dashboard fetch error:', error);
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

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
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

    const transactions = await Transaction.find({
      business: businessId,
      status: 'successful'
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = transactions.reduce((sum, t) => sum + t.fees.total, 0);
    const netBalance = totalRevenue - totalFees;

    res.json({
      success: true,
      data: {
        available: netBalance,
        pending: 0,
        totalProcessed: totalRevenue
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
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

    const yopayAccount = await YopayAccount.findOne({ business: businessId });
    if (!yopayAccount) {
      return res.status(404).json({
        success: false,
        error: 'Yopay account not found'
      });
    }

    yopayAccount.userTier = newTier;
    await yopayAccount.save();

    res.json({
      success: true,
      data: yopayAccount
    });
  } catch (error) {
    console.error('Update tier error:', error);
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
    console.error('Get banks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch banks'
    });
  }
};

exports.resolveBankAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;

    const result = await flutterwaveService.resolveBankAccount(accountNumber, bankCode);

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Resolve bank account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve bank account'
    });
  }
};
