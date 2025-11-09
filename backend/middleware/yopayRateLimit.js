const rateLimit = require('express-rate-limit');

// Rate limiter for payment processing endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: {
    success: false,
    error: 'Too many payment requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for webhooks
    return req.path.includes('/webhook');
  }
});

// Stricter rate limiter for onboarding
const onboardingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 onboarding attempts per hour
  message: {
    success: false,
    error: 'Too many onboarding attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Webhook rate limiter (more lenient but still protected)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // 1000 webhook calls per minute
  message: {
    success: false,
    error: 'Webhook rate limit exceeded'
  },
  standardHeaders: false,
  legacyHeaders: false
});

module.exports = {
  paymentLimiter,
  onboardingLimiter,
  webhookLimiter
};
