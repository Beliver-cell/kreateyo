const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String
  },
  folder: {
    type: String,
    default: 'uploads'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for queries
fileSchema.index({ business: 1, uploadedBy: 1 });
fileSchema.index({ folder: 1 });

module.exports = mongoose.model('File', fileSchema);
