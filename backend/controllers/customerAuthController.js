const Customer = require('../models/Customer');
const ServiceCustomer = require('../models/ServiceCustomer');
const EcommerceCustomer = require('../models/EcommerceCustomer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateCustomerToken } = require('../middleware/customerAuth');
const { AppError } = require('../middleware/errorHandler');
const emailService = require('../utils/emailService');

// @desc    Customer signup
// @route   POST /customer/auth/signup
// @access  Public
exports.customerSignup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, businessId, businessType } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email, business: businessId });
    if (existingCustomer) {
      return next(new AppError('Customer already exists with this email', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create customer
    const customer = await Customer.create({
      business: businessId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      hasPortalAccess: true,
      emailVerified: false,
      verificationToken,
      businessType
    });

    // Create type-specific customer profile
    if (businessType === 'services') {
      await ServiceCustomer.create({
        customer: customer._id,
        business: businessId
      });
    } else if (businessType === 'ecommerce') {
      await EcommerceCustomer.create({
        customer: customer._id,
        business: businessId
      });
    }

    // Send verification email
    await emailService.sendCustomerVerificationEmail(customer, verificationToken);

    // Generate token
    const token = generateCustomerToken(customer._id);

    res.status(201).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        businessType: customer.businessType
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer login
// @route   POST /customer/auth/login
// @access  Public
exports.customerLogin = async (req, res, next) => {
  try {
    const { email, password, businessId } = req.body;

    // Check if customer exists
    const customer = await Customer.findOne({ 
      email, 
      business: businessId 
    }).select('+password');

    if (!customer) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (customer.status !== 'active') {
      return next(new AppError('Account is inactive', 401));
    }

    // Generate token
    const token = generateCustomerToken(customer._id);

    res.status(200).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        businessType: customer.businessType,
        emailVerified: customer.emailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify customer email
// @route   POST /customer/auth/verify-email
// @access  Public
exports.verifyCustomerEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const customer = await Customer.findOne({
      verificationToken: token
    });

    if (!customer) {
      return next(new AppError('Invalid verification token', 400));
    }

    customer.emailVerified = true;
    customer.verificationToken = undefined;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer forgot password
// @route   POST /customer/auth/forgot-password
// @access  Public
exports.customerForgotPassword = async (req, res, next) => {
  try {
    const { email, businessId } = req.body;

    const customer = await Customer.findOne({ email, business: businessId });
    if (!customer) {
      return next(new AppError('No customer found with this email', 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    customer.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    customer.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

    await customer.save();

    // Send reset email
    await emailService.sendCustomerPasswordResetEmail(customer, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer reset password
// @route   POST /customer/auth/reset-password
// @access  Public
exports.customerResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const customer = await Customer.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!customer) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    // Set new password
    customer.password = await bcrypt.hash(password, 12);
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpires = undefined;
    await customer.save();

    const authToken = generateCustomerToken(customer._id);

    res.status(200).json({
      success: true,
      token: authToken,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer profile
// @route   GET /customer/auth/me
// @access  Private (Customer)
exports.getCustomerProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer._id);

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};
