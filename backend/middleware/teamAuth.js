const Team = require('../models/Team');
const Business = require('../models/Business');
const { AppError } = require('./errorHandler');

// Check if user is part of the team
exports.checkTeamMember = async (req, res, next) => {
  try {
    const businessId = req.params.businessId || req.body.business;

    if (!businessId) {
      return next(new AppError('Business ID is required', 400));
    }

    // Check if business exists and user is owner (solo account)
    const business = await Business.findById(businessId);
    
    if (!business) {
      return next(new AppError('Business not found', 404));
    }

    // If solo account, check if user is owner
    if (business.accountType === 'solo') {
      if (business.owner.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to access this business', 403));
      }
      req.userRole = 'owner';
      return next();
    }

    // If team account, check team membership
    const team = await Team.findOne({ business: businessId });

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    const member = team.members.find(
      m => m.user.toString() === req.user._id.toString() && m.isActive
    );

    if (!member) {
      return next(new AppError('You are not a member of this team', 403));
    }

    req.userRole = member.role;
    req.userPermissions = member.permissions;
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user has specific role
exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return next(
        new AppError(`Role '${req.userRole}' is not authorized to perform this action`, 403)
      );
    }
    next();
  };
};

// Check if user has specific permission
exports.checkPermission = (...permissions) => {
  return (req, res, next) => {
    if (req.userRole === 'owner') {
      return next(); // Owner has all permissions
    }

    const hasPermission = permissions.some(perm => 
      req.userPermissions && req.userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
