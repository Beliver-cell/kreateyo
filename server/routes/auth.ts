import { Router } from 'express';
import { db } from '../db';
import { users, sessions, profiles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { z } from 'zod';
import { validateBody } from '../validators';

export const authRoute = Router();

const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

authRoute.post('/auth/signup', validateBody(signUpSchema), async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        emailVerified: false,
      })
      .returning();

    const user = newUser[0];

    await db.insert(profiles).values({
      id: user.id,
      fullName,
      plan: 'free',
    });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName,
      },
      token,
      expiresAt,
    });
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

authRoute.post('/auth/signin', validateBody(signInSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await db
      .select()
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.id))
      .where(eq(users.email, email.toLowerCase()));

    if (!userResult.length) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { users: user, profiles: profile } = userResult[0];
    const passwordHash = hashPassword(password);

    if (user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await db
      .update(users)
      .set({ lastSignInAt: new Date() })
      .where(eq(users.id, user.id));

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.fullName || '',
        plan: profile?.plan || 'free',
      },
      token,
      expiresAt,
    });
  } catch (error) {
    console.error('Signin error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

authRoute.post('/auth/signout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await db.delete(sessions).where(eq(sessions.token, token));
    }

    res.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Signout failed' });
  }
});

authRoute.get('/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const sessionResult = await db
      .select()
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.id))
      .where(eq(sessions.token, token));

    if (!sessionResult.length || !sessionResult[0].users) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { sessions: session, users: user, profiles: profile } = sessionResult[0];

    if (new Date(session.expiresAt) < new Date()) {
      await db.delete(sessions).where(eq(sessions.id, session.id));
      return res.status(401).json({ error: 'Token expired' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.fullName || '',
        avatarUrl: profile?.avatarUrl,
        businessId: profile?.businessId,
        plan: profile?.plan || 'free',
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Auth check failed' });
  }
});

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

authRoute.patch('/auth/profile', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { full_name, avatar_url, business_id, plan } = req.body;

    const updateData: any = {};
    if (full_name !== undefined) updateData.fullName = full_name;
    if (avatar_url !== undefined) updateData.avatarUrl = avatar_url;
    if (business_id !== undefined) updateData.businessId = business_id;
    if (plan !== undefined) updateData.plan = plan;

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      await db.update(profiles).set(updateData).where(eq(profiles.id, user.id));
    }

    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});
