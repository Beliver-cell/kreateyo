const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String
  },
  // Zoom integration
  zoomMeetingId: {
    type: String
  },
  zoomJoinUrl: {
    type: String
  },
  zoomStartUrl: {
    type: String
  },
  zoomPassword: {
    type: String
  },
  videoCallEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for queries
appointmentSchema.index({ business: 1, startTime: 1 });
appointmentSchema.index({ customer: 1 });
appointmentSchema.index({ service: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
