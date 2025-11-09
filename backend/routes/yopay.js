const express = require('express');
const router = express.Router({ mergeParams: true });
const yopayController = require('../controllers/yopayController');
const { protect } = require('../middleware/auth');
const { paymentLimiter, onboardingLimiter, webhookLimiter } = require('../middleware/yopayRateLimit');

// Onboarding routes (with rate limiting)
router.post('/:businessId/onboarding/start', protect, onboardingLimiter, yopayController.startOnboarding);
router.post('/onboarding/:sessionId/step', protect, onboardingLimiter, yopayController.processStep);
router.get('/onboarding/:sessionId/status', protect, yopayController.getOnboardingStatus);

// Account management
router.post('/:businessId/account', protect, yopayController.createYopayAccount);
router.get('/:businessId/account', protect, yopayController.getAccount);
router.put('/:businessId/account', protect, yopayController.updateAccount);

// Payment processing (with rate limiting)
router.post('/:businessId/payment', protect, paymentLimiter, yopayController.processPayment);

// Dashboard & Analytics
router.get('/:businessId/dashboard', protect, yopayController.getDashboard);
router.get('/:businessId/transactions', protect, yopayController.getTransactions);
router.get('/:businessId/balance', protect, yopayController.getBalance);

// Tier management
router.put('/:businessId/tier', protect, yopayController.updateTier);

// Utility endpoints
router.get('/banks', protect, yopayController.getBanks);
router.post('/resolve-account', protect, yopayController.resolveBankAccount);

// Webhook (no auth, but rate limited)
router.post('/webhook', webhookLimiter, yopayController.webhookHandler);

module.exports = router;
