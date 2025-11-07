const Business = require('../models/Business');
const Team = require('../models/Team');
const { AppError } = require('../middleware/errorHandler');

// @desc    Create business
// @route   POST /api/businesses
// @access  Private
exports.createBusiness = async (req, res, next) => {
  try {
    const { name, type, accountType, description } = req.body;

    const business = await Business.create({
      owner: req.user._id,
      name,
      type,
      accountType: accountType || 'solo',
      description
    });

    // If team account, create team
    if (accountType === 'team') {
      await Team.create({
        business: business._id,
        name: `${name} Team`,
        members: [{
          user: req.user._id,
          role: 'owner',
          permissions: ['read', 'write', 'delete', 'manage_team', 'manage_settings']
        }]
      });
    }

    res.status(201).json({
      success: true,
      data: { business }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all businesses for user
// @route   GET /api/businesses
// @access  Private
exports.getBusinesses = async (req, res, next) => {
  try {
    // Get businesses owned by user
    const ownedBusinesses = await Business.find({ owner: req.user._id });

    // Get businesses where user is team member
    const teams = await Team.find({
      'members.user': req.user._id,
      'members.isActive': true
    }).populate('business');

    const teamBusinesses = teams.map(team => team.business).filter(b => b);

    // Combine and deduplicate
    const allBusinesses = [...ownedBusinesses, ...teamBusinesses];
    const uniqueBusinesses = Array.from(
      new Map(allBusinesses.map(b => [b._id.toString(), b])).values()
    );

    res.status(200).json({
      success: true,
      count: uniqueBusinesses.length,
      data: { businesses: uniqueBusinesses }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Private
exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'fullName email');

    if (!business) {
      return next(new AppError('Business not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { business }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private
exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return next(new AppError('Business not found', 404));
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: { business: updatedBusiness }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return next(new AppError('Business not found', 404));
    }

    if (business.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to delete this business', 403));
    }

    await business.deleteOne();

    // Delete associated team if exists
    await Team.findOneAndDelete({ business: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
