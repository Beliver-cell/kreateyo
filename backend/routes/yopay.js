const express = require('express');
const router = express.Router({ mergeParams: true });
const yopayController = require('../controllers/yopayController');
const { protect } = require('../middleware/auth');

// Onboarding routes
router.post('/:businessId/onboarding/start', protect, yopayController.startOnboarding);
router.post('/onboarding/:sessionId/step', protect, yopayController.processStep);
router.get('/onboarding/:sessionId/status', protect, yopayController.getOnboardingStatus);

// Account management
router.post('/:businessId/account', protect, yopayController.createYopayAccount);
router.get('/:businessId/account', protect, yopayController.getAccount);
router.put('/:businessId/account', protect, yopayController.updateAccount);

// Payment processing
router.post('/:businessId/payment', protect, yopayController.processPayment);

// Dashboard & Analytics
router.get('/:businessId/dashboard', protect, yopayController.getDashboard);
router.get('/:businessId/transactions', protect, yopayController.getTransactions);
router.get('/:businessId/balance', protect, yopayController.getBalance);

// Tier management
router.put('/:businessId/tier', protect, yopayController.updateTier);

// Utility endpoints
router.get('/banks', protect, yopayController.getBanks);
router.post('/resolve-account', protect, yopayController.resolveBankAccount);

// Webhook (no auth required)
router.post('/webhook', yopayController.webhookHandler);

module.exports = router;
