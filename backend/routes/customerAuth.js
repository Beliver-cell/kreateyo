const express = require('express');
const {
  customerSignup,
  customerLogin,
  verifyCustomerEmail,
  customerForgotPassword,
  customerResetPassword,
  getCustomerProfile
} = require('../controllers/customerAuthController');
const { protectCustomer } = require('../middleware/customerAuth');

const router = express.Router();

// Public routes
router.post('/signup', customerSignup);
router.post('/login', customerLogin);
router.post('/verify-email', verifyCustomerEmail);
router.post('/forgot-password', customerForgotPassword);
router.post('/reset-password', customerResetPassword);

// Protected routes
router.get('/me', protectCustomer, getCustomerProfile);

module.exports = router;
