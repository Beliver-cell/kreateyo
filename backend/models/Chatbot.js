const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: String,
    email: String,
    phone: String
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'resolved', 'archived'],
    default: 'active'
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  tags: [{
    type: String,
    trim: true
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const chatbotConfigSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: 'Assistant'
  },
  systemPrompt: {
    type: String,
    default: 'You are a helpful business assistant.'
  },
  temperature: {
    type: Number,
    default: 0.7,
    min: 0,
    max: 2
  },
  knowledgeBase: [{
    question: String,
    answer: String,
    category: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  appearance: {
    color: {
      type: String,
      default: '#000000'
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left'],
      default: 'bottom-right'
    }
  }
}, {
  timestamps: true
});

// Index for queries
conversationSchema.index({ business: 1, status: 1 });
conversationSchema.index({ sessionId: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
const ChatbotConfig = mongoose.model('ChatbotConfig', chatbotConfigSchema);

module.exports = { Conversation, ChatbotConfig };
