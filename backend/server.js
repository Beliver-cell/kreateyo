require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NexusCreate API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/notifications', require('./routes/notifications'));

// Business nested routes
app.use('/api/businesses/:businessId/blog-posts', require('./routes/blogPosts'));
app.use('/api/businesses/:businessId/products', require('./routes/products'));
app.use('/api/businesses/:businessId/services', require('./routes/services'));
app.use('/api/businesses/:businessId/customers', require('./routes/customers'));
app.use('/api/businesses/:businessId/orders', require('./routes/orders'));
app.use('/api/businesses/:businessId/appointments', require('./routes/appointments'));
app.use('/api/businesses/:businessId/files', require('./routes/files'));
app.use('/api/businesses/:businessId/analytics', require('./routes/analytics'));
app.use('/api/businesses/:businessId/team', require('./routes/team'));
app.use('/api/businesses/:businessId/api-keys', require('./routes/apiKeys'));
app.use('/api/businesses/:businessId/domains', require('./routes/domains'));

// Customer-facing routes (for user sites)
app.use('/customer/auth', require('./routes/customerAuth'));
app.use('/customer/dashboard', require('./routes/customerDashboard'));

// Error Handler Middleware (add this after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
