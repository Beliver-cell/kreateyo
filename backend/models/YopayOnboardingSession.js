const mongoose = require('mongoose');

const onboardingStepSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  required: Boolean,
  completed: { type: Boolean, default: false }
});

const yopayOnboardingSessionSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'failed', 'abandoned'],
    default: 'in_progress'
  },
  country: {
    type: String,
    required: true,
    default: 'NG'
  },
  steps: [onboardingStepSchema],
  currentStep: String,
  completedSteps: [String],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  yopayAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YopayAccount'
  },
  error: String,
  completedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
}, {
  timestamps: true
});

// Auto-expire sessions
yopayOnboardingSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('YopayOnboardingSession', yopayOnboardingSessionSchema);
