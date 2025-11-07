const Domain = require('../models/Domain');
const domainService = require('../utils/domainService');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all domains for a business
// @route   GET /api/businesses/:businessId/domains
// @access  Private
exports.getDomains = async (req, res, next) => {
  try {
    const domains = await Domain.find({ 
      business: req.params.businessId 
    }).sort({ isPrimary: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: domains
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add custom domain
// @route   POST /api/businesses/:businessId/domains
// @access  Private
exports.addDomain = async (req, res, next) => {
  try {
    const { domain } = req.body;

    // Check if domain already exists
    const existingDomain = await Domain.findOne({ domain: domain.toLowerCase() });
    if (existingDomain) {
      return next(new AppError('Domain is already in use', 400));
    }

    const newDomain = await domainService.addCustomDomain(req.params.businessId, domain);

    res.status(201).json({
      success: true,
      data: newDomain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify domain DNS
// @route   POST /api/businesses/:businessId/domains/:id/verify
// @access  Private
exports.verifyDomain = async (req, res, next) => {
  try {
    const result = await domainService.verifyDNS(req.params.id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set primary domain
// @route   PATCH /api/businesses/:businessId/domains/:id/primary
// @access  Private
exports.setPrimaryDomain = async (req, res, next) => {
  try {
    const domain = await domainService.setPrimaryDomain(
      req.params.businessId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: domain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete domain
// @route   DELETE /api/businesses/:businessId/domains/:id
// @access  Private
exports.deleteDomain = async (req, res, next) => {
  try {
    const domain = await Domain.findById(req.params.id);

    if (!domain) {
      return next(new AppError('Domain not found', 404));
    }

    if (!domain.isCustomDomain) {
      return next(new AppError('Cannot delete default subdomain', 400));
    }

    await domain.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
