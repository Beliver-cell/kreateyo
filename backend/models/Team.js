const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member', 'viewer'],
    default: 'member'
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'manage_team', 'manage_settings']
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const teamInvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'viewer'],
    default: 'member'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}, { _id: false });

const teamSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: [teamMemberSchema],
  invitations: [teamInvitationSchema],
  maxMembers: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

// Index for team queries
teamSchema.index({ business: 1 });
teamSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Team', teamSchema);
