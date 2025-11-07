const File = require('../models/File');
const cloudinary = require('../config/cloudinary');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all files for a business
// @route   GET /api/businesses/:businessId/files
// @access  Private
exports.getFiles = async (req, res, next) => {
  try {
    const { folder, limit = 50, page = 1 } = req.query;
    const query = { business: req.params.businessId };

    if (folder) query.folder = folder;

    const files = await File.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await File.countDocuments(query);

    res.status(200).json({
      success: true,
      data: files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single file
// @route   GET /api/businesses/:businessId/files/:id
// @access  Private
exports.getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload file
// @route   POST /api/businesses/:businessId/files
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    const fileData = {
      business: req.params.businessId,
      uploadedBy: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: req.file.path,
      cloudinaryId: req.file.filename,
      folder: req.body.folder || 'uploads',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      isPublic: req.body.isPublic === 'true'
    };

    const file = await File.create(fileData);

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update file
// @route   PUT /api/businesses/:businessId/files/:id
// @access  Private
exports.updateFile = async (req, res, next) => {
  try {
    const allowedUpdates = ['folder', 'tags', 'isPublic'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const file = await File.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/businesses/:businessId/files/:id
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    // Delete from Cloudinary
    if (file.cloudinaryId) {
      await cloudinary.uploader.destroy(file.cloudinaryId);
    }

    await file.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
