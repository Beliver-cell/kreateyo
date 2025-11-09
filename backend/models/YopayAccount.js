const mongoose = require('mongoose');
const YopayConfig = require('../config/yopay');

const yopayAccountSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    unique: true
  },
  
  // Business type for universal support
  businessType: {
    type: String,
    required: true,
    enum: ['blogging', 'ecommerce', 'services']
  },
  
  // User tier for fee calculation
  userTier: {
    type: String,
    required: true,
    enum: ['solo', 'team', 'enterprise'],
    default: 'solo'
  },
  
  // Flutterwave integration
  flutterwaveSubaccountId: {
    type: String,
    required: true
  },
  accountNumber: String,
  bankCode: String,
  bankName: String,
  accountName: String,
  
  // Fee configuration
  fees: {
    platformPercentage: Number, // Dynamic based on user tier
    flutterwavePercentage: {
      type: Number,
      default: 1.4
    },
    totalFeePercentage: Number // platform + flutterwave
  },
  
  // Payment settings for different business types
  paymentSettings: {
    // Universal settings
    currency: {
      type: String,
      default: 'NGN'
    },
    acceptedMethods: {
      type: [String],
      default: ['card', 'banktransfer', 'ussd', 'mobile_money']
    },
    
    // Business-type specific settings
    blogging: {
      donationEnabled: { type: Boolean, default: true },
      subscriptionEnabled: { type: Boolean, default: true },
      paywallEnabled: { type: Boolean, default: false }
    },
    ecommerce: {
      productPayments: { type: Boolean, default: true },
      cartEnabled: { type: Boolean, default: true },
      installmentEnabled: { type: Boolean, default: false }
    },
    services: {
      bookingPayments: { type: Boolean, default: true },
      depositEnabled: { type: Boolean, default: true },
      milestonePayments: { type: Boolean, default: false }
    }
  },
  
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'pending', 'suspended']
  }
}, {
  timestamps: true
});

// Calculate fees based on user tier
yopayAccountSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('userTier')) {
    this.fees.platformPercentage = YopayConfig.tieredFees[this.userTier];
    this.fees.totalFeePercentage = this.fees.platformPercentage + this.fees.flutterwavePercentage;
  }
  next();
});

module.exports = mongoose.model('YopayAccount', yopayAccountSchema);
