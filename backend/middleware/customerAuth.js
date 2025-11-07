const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const { AppError } = require('./errorHandler');

// Generate customer JWT token
const generateCustomerToken = (customerId) => {
  return jwt.sign(
    { id: customerId, type: 'customer' },
    process.env.JWT_CUSTOMER_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.CUSTOMER_TOKEN_EXPIRES || '30d' }
  );
};

// Protect customer routes
const protectCustomer = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.customerToken) {
      token = req.cookies.customerToken;
    }

    if (!token) {
      return next(new AppError('Please log in to access this resource', 401));
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_CUSTOMER_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== 'customer') {
      return next(new AppError('Invalid token type', 401));
    }

    // Check if customer exists
    const customer = await Customer.findById(decoded.id).select('+password');
    
    if (!customer) {
      return next(new AppError('Customer not found', 401));
    }

    if (customer.status !== 'active') {
      return next(new AppError('Customer account is inactive', 401));
    }

    req.customer = customer;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(error);
  }
};

module.exports = { generateCustomerToken, protectCustomer };
