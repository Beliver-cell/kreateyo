const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['blogging', 'ecommerce', 'services'],
    required: true
  },
  accountType: {
    type: String,
    enum: ['solo', 'team'],
    default: 'solo'
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  website: {
    type: String
  },
  settings: {
    theme: {
      type: String,
      default: 'light'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
businessSchema.index({ owner: 1, type: 1 });

module.exports = mongoose.model('Business', businessSchema);
