const mongoose = require('mongoose');

const ecommerceCustomerSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  addresses: [{
    label: {
      type: String,
      default: 'Home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'paypal']
    },
    last4: String,
    brand: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  preferences: {
    notifications: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Index for queries
ecommerceCustomerSchema.index({ customer: 1 });
ecommerceCustomerSchema.index({ business: 1 });

module.exports = mongoose.model('EcommerceCustomer', ecommerceCustomerSchema);
