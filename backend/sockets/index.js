const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:8080',
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user._id}`);

    // Join business room
    socket.on('join-business', (businessId) => {
      socket.join(`business:${businessId}`);
      console.log(`User ${socket.user._id} joined business ${businessId}`);
    });

    // Leave business room
    socket.on('leave-business', (businessId) => {
      socket.leave(`business:${businessId}`);
      console.log(`User ${socket.user._id} left business ${businessId}`);
    });

    // Chatbot typing indicator
    socket.on('chatbot-typing', (data) => {
      socket.to(`business:${data.businessId}`).emit('chatbot-typing', {
        sessionId: data.sessionId,
        isTyping: data.isTyping
      });
    });

    // Real-time notifications
    socket.on('mark-notification-read', (notificationId) => {
      socket.to(`user:${socket.user._id}`).emit('notification-read', notificationId);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user._id}`);
    });
  });

  return io;
};

// Emit notification to specific user
const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('new-notification', notification);
  }
};

// Emit event to business room
const emitToBusinesschannel = (businessId, event, data) => {
  if (io) {
    io.to(`business:${businessId}`).emit(event, data);
  }
};

// Emit chatbot message
const emitChatbotMessage = (businessId, sessionId, message) => {
  if (io) {
    io.to(`business:${businessId}`).emit('chatbot-message', {
      sessionId,
      message
    });
  }
};

module.exports = {
  initializeSocket,
  emitNotification,
  emitToBusinesschannel,
  emitChatbotMessage
};
