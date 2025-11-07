const ApiKey = require('../models/ApiKey');
const { AppError } = require('./errorHandler');

// API Key authentication middleware
const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return next(new AppError('API key is required', 401));
    }

    // Get prefix from key
    const prefix = apiKey.substring(0, 13);
    
    // Find API key by prefix
    const apiKeyDoc = await ApiKey.findOne({ 
      prefix,
      isActive: true 
    }).populate('business');

    if (!apiKeyDoc) {
      return next(new AppError('Invalid API key', 401));
    }

    // Check if key is expired
    if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
      return next(new AppError('API key has expired', 401));
    }

    // Verify key
    const isValid = apiKeyDoc.verifyKey(apiKey);
    if (!isValid) {
      return next(new AppError('Invalid API key', 401));
    }

    // Update last used
    apiKeyDoc.lastUsedAt = new Date();
    await apiKeyDoc.save();

    // Attach business and API key to request
    req.business = apiKeyDoc.business;
    req.apiKey = apiKeyDoc;
    req.apiKeyPermissions = apiKeyDoc.permissions;

    next();
  } catch (error) {
    next(error);
  }
};

// Check API key permissions
const checkApiPermission = (resource, action) => {
  return (req, res, next) => {
    const permissions = req.apiKeyPermissions;
    
    const resourcePermission = permissions.find(p => p.resource === resource);
    
    if (!resourcePermission || !resourcePermission.access.includes(action)) {
      return next(new AppError(`Insufficient permissions for ${action} on ${resource}`, 403));
    }

    next();
  };
};

module.exports = { apiKeyAuth, checkApiPermission };
