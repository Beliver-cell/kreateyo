const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  
  flutterwaveTransactionId: {
    type: String,
    required: true,
    index: true
  },
  
  txRef: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  flutterwaveReference: String,
  
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    required: true,
    default: 'NGN'
  },
  
  customerEmail: {
    type: String,
    required: true
  },
  
  customerName: String,
  customerPhone: String,
  
  description: String,
  
  fees: {
    platform: {
      type: Number,
      required: true
    },
    flutterwave: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  
  netAmount: {
    type: Number,
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  businessType: {
    type: String,
    enum: ['blogging', 'ecommerce', 'services'],
    required: true
  },
  
  userTier: {
    type: String,
    enum: ['solo', 'team', 'enterprise'],
    required: true
  },
  
  processedAt: Date,
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound indexes for common queries at scale
transactionSchema.index({ business: 1, status: 1 });
transactionSchema.index({ business: 1, createdAt: -1 });
transactionSchema.index({ txRef: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
