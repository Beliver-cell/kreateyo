import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { sessions, users, profiles } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    profile?: {
      id: string;
      fullName: string;
      businessId: string | null;
      plan: string;
    };
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];

    const sessionData = await db
      .select({
        session: sessions,
        user: users,
        profile: profiles,
      })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.id))
      .where(
        and(
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date())
        )
      );

    if (!sessionData.length || !sessionData[0].user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { user, profile } = sessionData[0];

    req.user = {
      id: user.id,
      email: user.email,
      profile: profile ? {
        id: profile.id,
        fullName: profile.fullName,
        businessId: profile.businessId,
        plan: profile.plan,
      } : undefined,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  return authMiddleware(req, res, next);
}
