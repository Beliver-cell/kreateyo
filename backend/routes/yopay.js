const express = require('express');
const router = express.Router({ mergeParams: true });
const yopayController = require('../controllers/yopayController');
const { protect } = require('../middleware/auth');

// Protected routes
router.use(protect);

router.post('/account', yopayController.createYopayAccount);
router.get('/dashboard', yopayController.getDashboard);
router.post('/payment', yopayController.processPayment);
router.put('/tier', yopayController.updateTier);

// Webhook (no auth required)
router.post('/webhook', yopayController.webhookHandler);

module.exports = router;
