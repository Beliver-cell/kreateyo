import { Router } from 'express';
import { db } from '../db';
import { affiliateLinks, affiliateCommissions, affiliatePayouts, sessions, users, businesses } from '@shared/schema';
import { eq, desc, and, sql, sum } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const affiliatesRoute = Router();

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

affiliatesRoute.get('/affiliates', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const links = await db
      .select({
        id: affiliateLinks.id,
        affiliateId: affiliateLinks.affiliateId,
        code: affiliateLinks.code,
        targetUrl: affiliateLinks.targetUrl,
        clicks: affiliateLinks.clicks,
        conversions: affiliateLinks.conversions,
        revenueGenerated: affiliateLinks.revenueGenerated,
        isActive: affiliateLinks.isActive,
        metadata: affiliateLinks.metadata,
        createdAt: affiliateLinks.createdAt,
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, user.id))
      .orderBy(desc(affiliateLinks.createdAt));

    const affiliatesWithStats = await Promise.all(
      links.map(async (link) => {
        const commissions = await db
          .select({
            totalEarnings: sql<string>`COALESCE(SUM(${affiliateCommissions.commissionAmount}), 0)`,
            salesCount: sql<number>`COUNT(*)`,
            avgRate: sql<string>`COALESCE(AVG(${affiliateCommissions.commissionRate}), 0.10)`,
          })
          .from(affiliateCommissions)
          .where(eq(affiliateCommissions.affiliateLinkId, link.id));

        const stats = commissions[0] || { totalEarnings: '0', salesCount: 0, avgRate: '0.10' };

        return {
          id: link.id,
          affiliateId: link.affiliateId,
          code: link.code,
          targetUrl: link.targetUrl,
          clicks: link.clicks,
          conversions: link.conversions,
          revenueGenerated: link.revenueGenerated,
          isActive: link.isActive,
          metadata: link.metadata,
          createdAt: link.createdAt,
          salesCount: Number(stats.salesCount),
          earnings: stats.totalEarnings,
          commissionRate: stats.avgRate,
        };
      })
    );

    res.json({ affiliates: affiliatesWithStats });
  } catch (error) {
    console.error('Fetch affiliates error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliates' });
  }
});

affiliatesRoute.post('/affiliates/invite', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { email, name, targetUrl, commissionRate = 0.15 } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const code = `AFF-${randomUUID().slice(0, 8).toUpperCase()}`;
    const affiliateId = randomUUID();

    const [newLink] = await db
      .insert(affiliateLinks)
      .values({
        userId: user.id,
        affiliateId,
        code,
        targetUrl: targetUrl || null,
        clicks: 0,
        conversions: 0,
        revenueGenerated: '0',
        isActive: true,
        metadata: { email, name, commissionRate, invitedAt: new Date().toISOString() },
      })
      .returning();

    res.status(201).json({ 
      success: true, 
      affiliate: {
        ...newLink,
        email,
        name,
      }
    });
  } catch (error) {
    console.error('Invite affiliate error:', error);
    res.status(500).json({ error: 'Failed to invite affiliate' });
  }
});

affiliatesRoute.get('/affiliates/stats', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const affiliateCount = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${affiliateLinks.affiliateId})` })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, user.id));

    const links = await db
      .select({ id: affiliateLinks.id })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, user.id));

    const linkIds = links.map(l => l.id);

    let totalSales = '0';
    let commissionsOwed = '0';
    
    if (linkIds.length > 0) {
      const salesStats = await db
        .select({
          totalSales: sql<string>`COALESCE(SUM(${affiliateCommissions.orderAmount}), 0)`,
          pendingCommissions: sql<string>`COALESCE(SUM(CASE WHEN ${affiliateCommissions.status} = 'pending' THEN ${affiliateCommissions.commissionAmount} ELSE 0 END), 0)`,
        })
        .from(affiliateCommissions)
        .where(sql`${affiliateCommissions.affiliateLinkId} = ANY(${linkIds})`);

      totalSales = salesStats[0]?.totalSales || '0';
      commissionsOwed = salesStats[0]?.pendingCommissions || '0';
    }

    const clickStats = await db
      .select({
        totalClicks: sql<number>`COALESCE(SUM(${affiliateLinks.clicks}), 0)`,
        totalConversions: sql<number>`COALESCE(SUM(${affiliateLinks.conversions}), 0)`,
      })
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, user.id));

    const clicks = Number(clickStats[0]?.totalClicks) || 0;
    const conversions = Number(clickStats[0]?.totalConversions) || 0;
    const clickThroughRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0';

    res.json({
      totalAffiliates: Number(affiliateCount[0]?.count) || 0,
      totalSales,
      commissionsOwed,
      clickThroughRate: `${clickThroughRate}%`,
    });
  } catch (error) {
    console.error('Fetch affiliate stats error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate stats' });
  }
});

affiliatesRoute.get('/affiliates/settings', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, user.id))
      .limit(1);

    const settings = (business[0]?.settings as Record<string, any>) || {};
    const affiliateSettings = settings.affiliateProgram || {};

    res.json({
      defaultRate: affiliateSettings.defaultRate || 15,
      cookieDuration: affiliateSettings.cookieDuration || 30,
      tiers: affiliateSettings.tiers || [
        { name: 'Bronze', minSales: 0, maxSales: 50, rate: 15 },
        { name: 'Silver', minSales: 51, maxSales: 100, rate: 20 },
        { name: 'Gold', minSales: 101, maxSales: null, rate: 25 },
      ],
    });
  } catch (error) {
    console.error('Fetch affiliate settings error:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate settings' });
  }
});

affiliatesRoute.put('/affiliates/settings', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { defaultRate, cookieDuration, tiers } = req.body;

    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, user.id))
      .limit(1);

    if (!business.length) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const existingSettings = (business[0].settings as Record<string, any>) || {};
    const updatedSettings = {
      ...existingSettings,
      affiliateProgram: {
        defaultRate: defaultRate ?? existingSettings.affiliateProgram?.defaultRate ?? 15,
        cookieDuration: cookieDuration ?? existingSettings.affiliateProgram?.cookieDuration ?? 30,
        tiers: tiers ?? existingSettings.affiliateProgram?.tiers,
      },
    };

    await db
      .update(businesses)
      .set({ settings: updatedSettings, updatedAt: new Date() })
      .where(eq(businesses.id, business[0].id));

    res.json({ success: true, settings: updatedSettings.affiliateProgram });
  } catch (error) {
    console.error('Update affiliate settings error:', error);
    res.status(500).json({ error: 'Failed to update affiliate settings' });
  }
});

affiliatesRoute.post('/affiliates/:id/payout', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const { payoutMethod, payoutDetails } = req.body;

    const link = await db
      .select()
      .from(affiliateLinks)
      .where(and(eq(affiliateLinks.id, id), eq(affiliateLinks.userId, user.id)))
      .limit(1);

    if (!link.length) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    const pendingCommissions = await db
      .select({
        total: sql<string>`COALESCE(SUM(${affiliateCommissions.commissionAmount}), 0)`,
        ids: sql<string[]>`ARRAY_AGG(${affiliateCommissions.id})`,
      })
      .from(affiliateCommissions)
      .where(and(
        eq(affiliateCommissions.affiliateLinkId, id),
        eq(affiliateCommissions.status, 'pending')
      ));

    const amount = pendingCommissions[0]?.total || '0';
    const commissionIds = pendingCommissions[0]?.ids || [];

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'No pending commissions to pay' });
    }

    const [payout] = await db
      .insert(affiliatePayouts)
      .values({
        affiliateId: link[0].affiliateId,
        amount,
        status: 'processed',
        payoutMethod: payoutMethod || 'bank_transfer',
        payoutDetails: payoutDetails || {},
        processedAt: new Date(),
        referenceId: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
      })
      .returning();

    if (commissionIds.length > 0) {
      await db
        .update(affiliateCommissions)
        .set({ status: 'paid', paidAt: new Date() })
        .where(sql`${affiliateCommissions.id} = ANY(${commissionIds})`);
    }

    res.json({ success: true, payout });
  } catch (error) {
    console.error('Process payout error:', error);
    res.status(500).json({ error: 'Failed to process payout' });
  }
});

affiliatesRoute.post('/affiliates/payout-all', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { payoutMethod } = req.body;

    const links = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.userId, user.id));

    const linkIds = links.map(l => l.id);

    if (linkIds.length === 0) {
      return res.status(400).json({ error: 'No affiliates found' });
    }

    const pendingByAffiliate = await db
      .select({
        affiliateId: affiliateCommissions.affiliateId,
        affiliateLinkId: affiliateCommissions.affiliateLinkId,
        total: sql<string>`SUM(${affiliateCommissions.commissionAmount})`,
      })
      .from(affiliateCommissions)
      .where(and(
        sql`${affiliateCommissions.affiliateLinkId} = ANY(${linkIds})`,
        eq(affiliateCommissions.status, 'pending')
      ))
      .groupBy(affiliateCommissions.affiliateId, affiliateCommissions.affiliateLinkId);

    if (pendingByAffiliate.length === 0) {
      return res.status(400).json({ error: 'No pending commissions to pay' });
    }

    const payouts = [];
    for (const pending of pendingByAffiliate) {
      if (parseFloat(pending.total) <= 0) continue;

      const [payout] = await db
        .insert(affiliatePayouts)
        .values({
          affiliateId: pending.affiliateId,
          amount: pending.total,
          status: 'processed',
          payoutMethod: payoutMethod || 'bank_transfer',
          payoutDetails: {},
          processedAt: new Date(),
          referenceId: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
        })
        .returning();

      payouts.push(payout);

      await db
        .update(affiliateCommissions)
        .set({ status: 'paid', paidAt: new Date() })
        .where(and(
          eq(affiliateCommissions.affiliateLinkId, pending.affiliateLinkId),
          eq(affiliateCommissions.status, 'pending')
        ));
    }

    res.json({ 
      success: true, 
      payoutsProcessed: payouts.length,
      totalAmount: payouts.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2),
      payouts,
    });
  } catch (error) {
    console.error('Process all payouts error:', error);
    res.status(500).json({ error: 'Failed to process payouts' });
  }
});
