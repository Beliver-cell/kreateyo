const mongoose = require('mongoose');

const serviceCustomerSchema = new mongoose.Schema({
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
  zoomConnected: {
    type: Boolean,
    default: false
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      appointmentReminders: { type: Boolean, default: true }
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  stats: {
    totalAppointments: { type: Number, default: 0 },
    completedAppointments: { type: Number, default: 0 },
    cancelledAppointments: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for queries
serviceCustomerSchema.index({ customer: 1 });
serviceCustomerSchema.index({ business: 1 });

module.exports = mongoose.model('ServiceCustomer', serviceCustomerSchema);
