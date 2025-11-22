require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { subdomainHandler } = require('./middleware/subdomain');

// Initialize Express app
const app = express();

// Trust proxy (for accurate IP behind load balancer)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Production logging format
  app.use(morgan('combined'));
}

// Apply subdomain middleware globally (resolves tenant from host)
app.use(subdomainHandler);

// Health Check Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kreateyo API is running',
    timestamp: new Date().toISOString(),
    version: 'v1.0.0'
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API v1 Routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, require('./routes/auth'));
app.use(`${API_PREFIX}/businesses`, require('./routes/businesses'));
app.use(`${API_PREFIX}/ai`, require('./routes/ai'));
app.use(`${API_PREFIX}/notifications`, require('./routes/notifications'));

// Business nested routes
app.use(`${API_PREFIX}/businesses/:businessId/blog-posts`, require('./routes/blogPosts'));
app.use(`${API_PREFIX}/businesses/:businessId/products`, require('./routes/products'));
app.use(`${API_PREFIX}/businesses/:businessId/services`, require('./routes/services'));
app.use(`${API_PREFIX}/businesses/:businessId/customers`, require('./routes/customers'));
app.use(`${API_PREFIX}/businesses/:businessId/orders`, require('./routes/orders'));
app.use(`${API_PREFIX}/businesses/:businessId/appointments`, require('./routes/appointments'));
app.use(`${API_PREFIX}/businesses/:businessId/files`, require('./routes/files'));
app.use(`${API_PREFIX}/businesses/:businessId/analytics`, require('./routes/analytics'));
app.use(`${API_PREFIX}/businesses/:businessId/team`, require('./routes/team'));
app.use(`${API_PREFIX}/businesses/:businessId/api-keys`, require('./routes/apiKeys'));
app.use(`${API_PREFIX}/businesses/:businessId/domains`, require('./routes/domains'));
app.use(`${API_PREFIX}/businesses/:businessId/yopay`, require('./routes/yopay'));

// Customer-facing routes (for user sites)
app.use('/customer/auth', require('./routes/customerAuth'));
app.use('/customer/dashboard', require('./routes/customerDashboard'));

// Public user sites routes (for subdomain-accessed sites)
app.use('/api/user-sites', require('./routes/userSites'));

// Backwards compatibility - redirect old routes to v1
app.use('/api/auth', (req, res) => res.redirect(308, `${API_PREFIX}/auth${req.url}`));
app.use('/api/businesses', (req, res) => res.redirect(308, `${API_PREFIX}/businesses${req.url}`));

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}${API_PREFIX}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🛑 Received shutdown signal, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  gracefulShutdown();
});

// Handle SIGTERM and SIGINT for graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
