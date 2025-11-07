const Service = require('../models/Service');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all services for a business
// @route   GET /api/businesses/:businessId/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const query = { business: req.params.businessId };

    if (status) query.status = status;
    if (category) query.category = category;

    const services = await Service.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/businesses/:businessId/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/businesses/:businessId/services
// @access  Private
exports.createService = async (req, res, next) => {
  try {
    req.body.business = req.params.businessId;

    // Generate slug from name
    if (!req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/businesses/:businessId/services/:id
// @access  Private
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    // Update slug if name changed
    if (req.body.name && req.body.name !== service.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/businesses/:businessId/services/:id
// @access  Private
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError('Service not found', 404));
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
