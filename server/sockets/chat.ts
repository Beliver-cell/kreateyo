import { Server, Socket } from 'socket.io';
import { db } from '../db';
import { conversations, messages, conversationParticipants } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';

interface ChatMessage {
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'staff';
  content: string;
  attachments?: string[];
}

interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

const connectedUsers = new Map<string, Set<string>>();

export function setupChatSocket(io: Server) {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket: Socket) => {
    console.log('Chat client connected:', socket.id);

    socket.on('join:business', (businessId: string) => {
      socket.join(`business:${businessId}`);
      console.log(`Socket ${socket.id} joined business:${businessId}`);
    });

    socket.on('join:conversation', async (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation:${conversationId}`);
      
      if (!connectedUsers.has(conversationId)) {
        connectedUsers.set(conversationId, new Set());
      }
      connectedUsers.get(conversationId)?.add(socket.id);
      
      chatNamespace.to(`conversation:${conversationId}`).emit('user:joined', {
        socketId: socket.id,
        onlineCount: connectedUsers.get(conversationId)?.size || 0,
      });
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      connectedUsers.get(conversationId)?.delete(socket.id);
      
      chatNamespace.to(`conversation:${conversationId}`).emit('user:left', {
        socketId: socket.id,
        onlineCount: connectedUsers.get(conversationId)?.size || 0,
      });
    });

    socket.on('message:send', async (data: ChatMessage) => {
      try {
        const [newMessage] = await db.insert(messages).values({
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderType: data.senderType,
          content: data.content,
          attachments: data.attachments || [],
        }).returning();

        await db.update(conversations)
          .set({ 
            lastMessageAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(conversations.id, data.conversationId));

        chatNamespace.to(`conversation:${data.conversationId}`).emit('message:received', newMessage);

        const conversation = await db.query.conversations.findFirst({
          where: eq(conversations.id, data.conversationId),
        });

        if (conversation?.businessId) {
          chatNamespace.to(`business:${conversation.businessId}`).emit('conversation:updated', {
            conversationId: data.conversationId,
            lastMessage: newMessage,
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    socket.on('typing:start', (data: TypingEvent) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:update', {
        userId: data.userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (data: TypingEvent) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:update', {
        userId: data.userId,
        isTyping: false,
      });
    });

    socket.on('message:read', async (data: { conversationId: string; userId: string }) => {
      try {
        await db.update(messages)
          .set({ readAt: new Date() })
          .where(
            and(
              eq(messages.conversationId, data.conversationId),
              eq(messages.readAt, null as any)
            )
          );

        socket.to(`conversation:${data.conversationId}`).emit('messages:marked-read', {
          conversationId: data.conversationId,
          readBy: data.userId,
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Chat client disconnected:', socket.id);
      
      connectedUsers.forEach((users, conversationId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          chatNamespace.to(`conversation:${conversationId}`).emit('user:left', {
            socketId: socket.id,
            onlineCount: users.size,
          });
        }
      });
    });
  });

  console.log('Chat socket namespace initialized');
}
