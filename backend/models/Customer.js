const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  // Customer portal access
  hasPortalAccess: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  businessType: {
    type: String,
    enum: ['services', 'ecommerce', 'blogging']
  }
}, {
  timestamps: true
});

// Compound index for business + email uniqueness
customerSchema.index({ business: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);
