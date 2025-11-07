const ApiKey = require('../models/ApiKey');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all API keys for a business
// @route   GET /api/businesses/:businessId/api-keys
// @access  Private
exports.getApiKeys = async (req, res, next) => {
  try {
    const apiKeys = await ApiKey.find({ 
      business: req.params.businessId 
    }).select('-keyHash').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create API key
// @route   POST /api/businesses/:businessId/api-keys
// @access  Private
exports.createApiKey = async (req, res, next) => {
  try {
    const { name, permissions, rateLimit, expiresAt } = req.body;

    // Generate API key
    const { key, hashedKey, prefix } = ApiKey.generateKey();

    const apiKey = await ApiKey.create({
      business: req.params.businessId,
      name,
      keyHash: hashedKey,
      prefix,
      permissions,
      rateLimit,
      expiresAt
    });

    res.status(201).json({
      success: true,
      data: {
        id: apiKey._id,
        name: apiKey.name,
        key, // Only returned once!
        prefix: apiKey.prefix,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
        message: 'Save this key now - it will not be shown again'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update API key
// @route   PUT /api/businesses/:businessId/api-keys/:id
// @access  Private
exports.updateApiKey = async (req, res, next) => {
  try {
    const { name, permissions, rateLimit, expiresAt, isActive } = req.body;

    const apiKey = await ApiKey.findByIdAndUpdate(
      req.params.id,
      { name, permissions, rateLimit, expiresAt, isActive },
      { new: true, runValidators: true }
    ).select('-keyHash');

    if (!apiKey) {
      return next(new AppError('API key not found', 404));
    }

    res.status(200).json({
      success: true,
      data: apiKey
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete API key
// @route   DELETE /api/businesses/:businessId/api-keys/:id
// @access  Private
exports.deleteApiKey = async (req, res, next) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id);

    if (!apiKey) {
      return next(new AppError('API key not found', 404));
    }

    await apiKey.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
