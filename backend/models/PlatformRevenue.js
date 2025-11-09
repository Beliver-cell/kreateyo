const mongoose = require('mongoose');

const platformRevenueSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  
  amount: {
    type: Number,
    required: true
  },
  
  userTier: {
    type: String,
    enum: ['solo', 'team', 'enterprise'],
    required: true
  },
  
  businessType: {
    type: String,
    enum: ['blogging', 'ecommerce', 'services'],
    required: true
  },
  
  type: {
    type: String,
    enum: ['platform_fee', 'subscription', 'upgrade'],
    default: 'platform_fee'
  }
}, {
  timestamps: true
});

// Index for analytics queries
platformRevenueSchema.index({ createdAt: -1 });
platformRevenueSchema.index({ userTier: 1 });
platformRevenueSchema.index({ businessType: 1 });

module.exports = mongoose.model('PlatformRevenue', platformRevenueSchema);
