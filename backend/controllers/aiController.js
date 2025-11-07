const { Conversation, ChatbotConfig } = require('../models/Chatbot');
const { AppError } = require('../middleware/errorHandler');
const aiService = require('../utils/aiService');

// @desc    Send message to chatbot
// @route   POST /api/ai/chat
// @access  Public
exports.sendMessage = async (req, res, next) => {
  try {
    const { businessId, sessionId, message, customerInfo } = req.body;

    // Get chatbot config
    const config = await ChatbotConfig.findOne({ business: businessId, isActive: true });
    
    if (!config) {
      return next(new AppError('Chatbot not configured for this business', 400));
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      conversation = await Conversation.create({
        business: businessId,
        sessionId,
        customer: customerInfo,
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Get AI response
    const aiResponse = await aiService.generateResponse({
      messages: conversation.messages,
      systemPrompt: config.systemPrompt,
      temperature: config.temperature,
      knowledgeBase: config.knowledgeBase
    });

    // Add assistant message
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    conversation.lastActivity = Date.now();
    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        sessionId: conversation.sessionId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation history
// @route   GET /api/ai/conversations/:sessionId
// @access  Public
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      sessionId: req.params.sessionId
    });

    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { conversation }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for business
// @route   GET /api/ai/conversations/business/:businessId
// @access  Private
exports.getBusinessConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      business: req.params.businessId
    }).sort({ lastActivity: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chatbot config
// @route   PUT /api/ai/config/:businessId
// @access  Private
exports.updateConfig = async (req, res, next) => {
  try {
    let config = await ChatbotConfig.findOne({ business: req.params.businessId });

    if (!config) {
      config = await ChatbotConfig.create({
        business: req.params.businessId,
        ...req.body
      });
    } else {
      config = await ChatbotConfig.findOneAndUpdate(
        { business: req.params.businessId },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      data: { config }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate content with AI
// @route   POST /api/ai/generate
// @access  Private
exports.generateContent = async (req, res, next) => {
  try {
    const { type, prompt, context } = req.body;

    const content = await aiService.generateContent({
      type,
      prompt,
      context
    });

    res.status(200).json({
      success: true,
      data: { content }
    });
  } catch (error) {
    next(error);
  }
};
