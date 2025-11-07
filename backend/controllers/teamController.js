const Team = require('../models/Team');
const User = require('../models/User');
const crypto = require('crypto');
const { sendTeamInvitation } = require('../utils/emailService');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get team for business
// @route   GET /api/businesses/:businessId/team
// @access  Private
exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({ business: req.params.businessId })
      .populate('members.user', 'name email avatar')
      .populate('invitations.invitedBy', 'name email');

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add team member
// @route   POST /api/businesses/:businessId/team/members
// @access  Private (Owner/Admin only)
exports.addTeamMember = async (req, res, next) => {
  try {
    const team = await Team.findOne({ business: req.params.businessId });

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    // Check if at capacity
    if (team.members.length >= team.maxMembers) {
      return next(new AppError('Team is at maximum capacity', 400));
    }

    const { userId, role, permissions } = req.body;

    // Check if user already in team
    const existingMember = team.members.find(m => m.user.toString() === userId);
    if (existingMember) {
      return next(new AppError('User is already a team member', 400));
    }

    team.members.push({
      user: userId,
      role: role || 'member',
      permissions: permissions || ['read', 'write']
    });

    await team.save();

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/businesses/:businessId/team/members/:memberId
// @access  Private (Owner/Admin only)
exports.updateTeamMember = async (req, res, next) => {
  try {
    const team = await Team.findOne({ business: req.params.businessId });

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    const member = team.members.find(m => m.user.toString() === req.params.memberId);
    
    if (!member) {
      return next(new AppError('Team member not found', 404));
    }

    if (req.body.role) member.role = req.body.role;
    if (req.body.permissions) member.permissions = req.body.permissions;
    if (req.body.isActive !== undefined) member.isActive = req.body.isActive;

    await team.save();

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove team member
// @route   DELETE /api/businesses/:businessId/team/members/:memberId
// @access  Private (Owner/Admin only)
exports.removeTeamMember = async (req, res, next) => {
  try {
    const team = await Team.findOne({ business: req.params.businessId });

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    team.members = team.members.filter(
      m => m.user.toString() !== req.params.memberId
    );

    await team.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send team invitation
// @route   POST /api/businesses/:businessId/team/invitations
// @access  Private (Owner/Admin only)
exports.sendInvitation = async (req, res, next) => {
  try {
    const team = await Team.findOne({ business: req.params.businessId });

    if (!team) {
      return next(new AppError('Team not found', 404));
    }

    const { email, role } = req.body;

    // Check if already invited
    const existingInvitation = team.invitations.find(
      inv => inv.email === email && inv.status === 'pending'
    );

    if (existingInvitation) {
      return next(new AppError('Invitation already sent to this email', 400));
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    team.invitations.push({
      email,
      role: role || 'member',
      invitedBy: req.user._id,
      token
    });

    await team.save();

    // Send invitation email
    await sendTeamInvitation(email, {
      inviterName: req.user.name,
      teamName: team.name,
      invitationLink: `${process.env.FRONTEND_URL}/team/accept-invitation?token=${token}`
    });

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept team invitation
// @route   POST /api/team/invitations/accept
// @access  Public
exports.acceptInvitation = async (req, res, next) => {
  try {
    const { token } = req.body;

    const team = await Team.findOne({
      'invitations.token': token,
      'invitations.status': 'pending'
    });

    if (!team) {
      return next(new AppError('Invalid or expired invitation', 404));
    }

    const invitation = team.invitations.find(inv => inv.token === token);

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await team.save();
      return next(new AppError('Invitation has expired', 400));
    }

    // Add user to team
    team.members.push({
      user: req.user._id,
      role: invitation.role,
      permissions: invitation.role === 'admin' 
        ? ['read', 'write', 'delete', 'manage_team']
        : ['read', 'write']
    });

    invitation.status = 'accepted';
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline team invitation
// @route   POST /api/team/invitations/decline
// @access  Public
exports.declineInvitation = async (req, res, next) => {
  try {
    const { token } = req.body;

    const team = await Team.findOne({
      'invitations.token': token,
      'invitations.status': 'pending'
    });

    if (!team) {
      return next(new AppError('Invalid invitation', 404));
    }

    const invitation = team.invitations.find(inv => inv.token === token);
    invitation.status = 'declined';
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Invitation declined'
    });
  } catch (error) {
    next(error);
  }
};
