import { Router, Request, Response } from 'express';
import { db } from '../db';
import { fomoSettings, fomoActivityLog, fomoAnalytics } from '../../shared/schema';
import { eq, and, desc, gte, sql } from 'drizzle-orm';

const router = Router();

router.get('/settings/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const settings = await db.select()
      .from(fomoSettings)
      .where(eq(fomoSettings.businessId, businessId))
      .limit(1);

    if (settings.length === 0) {
      const defaultSettings = await db.insert(fomoSettings)
        .values({ businessId })
        .returning();
      return res.json(defaultSettings[0]);
    }

    res.json(settings[0]);
  } catch (error) {
    console.error('Error fetching FOMO settings:', error);
    res.status(500).json({ error: 'Failed to fetch FOMO settings' });
  }
});

router.put('/settings/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const updates = req.body;

    const existing = await db.select()
      .from(fomoSettings)
      .where(eq(fomoSettings.businessId, businessId))
      .limit(1);

    if (existing.length === 0) {
      const newSettings = await db.insert(fomoSettings)
        .values({ businessId, ...updates })
        .returning();
      return res.json(newSettings[0]);
    }

    const updated = await db.update(fomoSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fomoSettings.businessId, businessId))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating FOMO settings:', error);
    res.status(500).json({ error: 'Failed to update FOMO settings' });
  }
});

router.get('/activity/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const hours = parseInt(req.query.hours as string) || 24;

    const since = new Date();
    since.setHours(since.getHours() - hours);

    const activities = await db.select()
      .from(fomoActivityLog)
      .where(and(
        eq(fomoActivityLog.businessId, businessId),
        gte(fomoActivityLog.createdAt, since)
      ))
      .orderBy(desc(fomoActivityLog.createdAt))
      .limit(100);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching FOMO activity:', error);
    res.status(500).json({ error: 'Failed to fetch FOMO activity' });
  }
});

router.post('/activity/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { activityType, productId, productName, customerName, customerLocation, quantity } = req.body;

    const activity = await db.insert(fomoActivityLog)
      .values({
        businessId,
        activityType,
        productId,
        productName,
        customerName,
        customerLocation,
        quantity: quantity || 1,
      })
      .returning();

    res.json(activity[0]);
  } catch (error) {
    console.error('Error logging FOMO activity:', error);
    res.status(500).json({ error: 'Failed to log FOMO activity' });
  }
});

router.get('/analytics/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const days = parseInt(req.query.days as string) || 7;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const analytics = await db.select()
      .from(fomoAnalytics)
      .where(and(
        eq(fomoAnalytics.businessId, businessId),
        gte(fomoAnalytics.date, since)
      ))
      .orderBy(desc(fomoAnalytics.date));

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching FOMO analytics:', error);
    res.status(500).json({ error: 'Failed to fetch FOMO analytics' });
  }
});

router.post('/analytics/:businessId/track', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { widgetType, eventType } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await db.select()
      .from(fomoAnalytics)
      .where(and(
        eq(fomoAnalytics.businessId, businessId),
        eq(fomoAnalytics.widgetType, widgetType),
        gte(fomoAnalytics.date, today)
      ))
      .limit(1);

    if (existing.length === 0) {
      const newAnalytics: any = {
        businessId,
        widgetType,
        date: today,
        impressions: eventType === 'impression' ? 1 : 0,
        clicks: eventType === 'click' ? 1 : 0,
        conversions: eventType === 'conversion' ? 1 : 0,
      };
      await db.insert(fomoAnalytics).values(newAnalytics);
    } else {
      const updateField = eventType === 'impression' ? 'impressions' : 
                         eventType === 'click' ? 'clicks' : 'conversions';
      await db.execute(sql`
        UPDATE fomo_analytics 
        SET ${sql.identifier(updateField)} = ${sql.identifier(updateField)} + 1
        WHERE id = ${existing[0].id}
      `);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking FOMO analytics:', error);
    res.status(500).json({ error: 'Failed to track FOMO analytics' });
  }
});

router.get('/sold-count/:businessId/:productId', async (req: Request, res: Response) => {
  try {
    const { businessId, productId } = req.params;
    const hours = parseInt(req.query.hours as string) || 24;

    const since = new Date();
    since.setHours(since.getHours() - hours);

    const result = await db.select({
      count: sql<number>`COALESCE(SUM(${fomoActivityLog.quantity}), 0)`,
    })
      .from(fomoActivityLog)
      .where(and(
        eq(fomoActivityLog.businessId, businessId),
        eq(fomoActivityLog.productId, productId),
        eq(fomoActivityLog.activityType, 'purchase'),
        gte(fomoActivityLog.createdAt, since)
      ));

    res.json({ count: Number(result[0]?.count) || 0, hours });
  } catch (error) {
    console.error('Error fetching sold count:', error);
    res.status(500).json({ error: 'Failed to fetch sold count' });
  }
});

router.get('/recent-purchases/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const purchases = await db.select()
      .from(fomoActivityLog)
      .where(and(
        eq(fomoActivityLog.businessId, businessId),
        eq(fomoActivityLog.activityType, 'purchase')
      ))
      .orderBy(desc(fomoActivityLog.createdAt))
      .limit(limit);

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching recent purchases:', error);
    res.status(500).json({ error: 'Failed to fetch recent purchases' });
  }
});

export const fomoRoute = router;
