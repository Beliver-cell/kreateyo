const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const apiKeySchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  keyHash: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  permissions: [{
    resource: {
      type: String,
      enum: ['products', 'orders', 'customers', 'appointments', 'services', 'blog-posts', 'analytics']
    },
    access: [{
      type: String,
      enum: ['read', 'write', 'delete']
    }]
  }],
  rateLimit: {
    type: Number,
    default: 1000 // requests per hour
  },
  lastUsedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate API key
apiKeySchema.statics.generateKey = function() {
  const key = 'nexus_' + crypto.randomBytes(32).toString('hex');
  const prefix = key.substring(0, 13); // "nexus_" + first 8 chars
  const hashedKey = bcrypt.hashSync(key, 10);
  return { key, hashedKey, prefix };
};

// Verify API key
apiKeySchema.methods.verifyKey = function(key) {
  return bcrypt.compareSync(key, this.keyHash);
};

// Index for queries
apiKeySchema.index({ business: 1, isActive: 1 });
apiKeySchema.index({ prefix: 1 });

module.exports = mongoose.model('ApiKey', apiKeySchema);
