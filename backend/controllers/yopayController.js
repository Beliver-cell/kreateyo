const YopayPaymentService = require('../services/yopayPaymentService');
const YopayAccount = require('../models/YopayAccount');

exports.createYopayAccount = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { bankDetails, userTier } = req.body;

    // Check if account already exists
    const existingAccount = await YopayAccount.findOne({ business: businessId });
    if (existingAccount) {
      return res.status(409).json({
        success: false,
        error: 'Yopay account already exists for this business'
      });
    }

    // Create Flutterwave subaccount (placeholder - implement actual Flutterwave API call)
    const subaccountId = `SUBACCT_${Date.now()}`;

    const yopayAccount = await YopayAccount.create({
      business: businessId,
      businessType: req.business.type,
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

exports.webhookHandler = async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    
    // Verify webhook signature (implement proper verification)
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
