const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isCustomDomain: {
    type: Boolean,
    default: false
  },
  isPrimary: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'active', 'failed'],
    default: 'pending'
  },
  sslStatus: {
    type: String,
    enum: ['pending', 'issued', 'failed'],
    default: 'pending'
  },
  dnsRecords: {
    cname: {
      host: String,
      value: String,
      verified: { type: Boolean, default: false }
    },
    aRecord: {
      host: String,
      value: String,
      verified: { type: Boolean, default: false }
    }
  },
  lastVerifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for queries
domainSchema.index({ business: 1 });
domainSchema.index({ subdomain: 1 });
domainSchema.index({ domain: 1 });

module.exports = mongoose.model('Domain', domainSchema);
