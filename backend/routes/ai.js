const express = require('express');
const {
  sendMessage,
  getConversation,
  getBusinessConversations,
  updateConfig,
  generateContent
} = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');
const { checkTeamMember } = require('../middleware/teamAuth');
const { aiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Public routes (chatbot)
router.post('/chat', aiLimiter, sendMessage);
router.get('/conversations/:sessionId', optionalAuth, getConversation);

// Protected routes
router.use(protect);

router.get('/conversations/business/:businessId', checkTeamMember, getBusinessConversations);
router.put('/config/:businessId', checkTeamMember, updateConfig);
router.post('/generate', aiLimiter, generateContent);

module.exports = router;
