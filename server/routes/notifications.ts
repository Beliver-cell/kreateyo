import { Router } from 'express';
import { db } from '../db';
import { notifications, sessions, users } from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';

export const notificationsRoute = Router();

async function getUserFromToken(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const sessionResult = await db
    .select()
    .from(sessions)
    .leftJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token));

  if (!sessionResult.length || !sessionResult[0].users) {
    return null;
  }

  const { sessions: session, users: user } = sessionResult[0];

  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return null;
  }

  return user;
}

notificationsRoute.get('/notifications', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    res.json({ 
      notifications: userNotifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        category: n.category,
        read: n.read,
        created_at: n.createdAt,
      }))
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

notificationsRoute.patch('/notifications/:id/read', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));

    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

notificationsRoute.post('/notifications/mark-all-read', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, user.id), eq(notifications.read, false)));

    res.json({ success: true });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});
