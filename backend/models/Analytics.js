const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    pageViews: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    orders: {
      type: Number,
      default: 0
    },
    appointments: {
      type: Number,
      default: 0
    },
    newCustomers: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    avgSessionDuration: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  trafficSources: {
    direct: {
      type: Number,
      default: 0
    },
    organic: {
      type: Number,
      default: 0
    },
    social: {
      type: Number,
      default: 0
    },
    referral: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    }
  },
  topPages: [{
    path: String,
    views: Number,
    uniqueViews: Number
  }],
  devices: {
    desktop: {
      type: Number,
      default: 0
    },
    mobile: {
      type: Number,
      default: 0
    },
    tablet: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Compound index for business + date
analyticsSchema.index({ business: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
