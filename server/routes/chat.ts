import { Router, Request, Response } from 'express';
import { db } from '../db';
import { conversations, messages, conversationParticipants, businesses } from '../../shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

const router = Router();

router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const businessId = req.query.businessId as string;
    
    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const allConversations = await db.select()
      .from(conversations)
      .where(eq(conversations.businessId, businessId))
      .orderBy(desc(conversations.lastMessageAt));

    res.json(allConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.get('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await db.select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (conversation.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation[0]);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

router.post('/conversations', async (req: Request, res: Response) => {
  try {
    const { businessId, customerId, customerEmail, customerName, subject } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'businessId is required' });
    }

    const [newConversation] = await db.insert(conversations).values({
      businessId,
      customerId,
      customerEmail,
      customerName,
      subject,
      status: 'active',
    }).returning();

    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

router.patch('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, subject } = req.body;

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (subject) updateData.subject = subject;

    const [updated] = await db.update(conversations)
      .set(updateData)
      .where(eq(conversations.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const allMessages = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    res.json(allMessages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { senderId, senderType, content, attachments } = req.body;

    if (!senderId || !senderType || !content) {
      return res.status(400).json({ error: 'senderId, senderType, and content are required' });
    }

    const [newMessage] = await db.insert(messages).values({
      conversationId: id,
      senderId,
      senderType,
      content,
      attachments: attachments || [],
    }).returning();

    await db.update(conversations)
      .set({ 
        lastMessageAt: new Date(),
        updatedAt: new Date(),
        unreadCount: sql`${conversations.unreadCount} + 1`,
      })
      .where(eq(conversations.id, id));

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.post('/conversations/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.update(messages)
      .set({ readAt: new Date() })
      .where(and(
        eq(messages.conversationId, id),
        sql`${messages.readAt} IS NULL`
      ));

    await db.update(conversations)
      .set({ unreadCount: 0, updatedAt: new Date() })
      .where(eq(conversations.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

router.delete('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.delete(conversations).where(eq(conversations.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export const chatRoute = router;
