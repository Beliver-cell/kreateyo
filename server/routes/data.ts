import { Router } from 'express';
import { db } from '../db';
import { 
  digitalProducts, licenseKeys, downloadLinks, downloadLogs, piracyAlerts,
  leads, leadCampaigns, aiConversations, automationLogs,
  suppliers, importedProducts, supplierOrders, syncLogs,
  sessions, users
} from '@shared/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export const dataRoute = Router();

const tableMap: Record<string, any> = {
  digital_products: digitalProducts,
  license_keys: licenseKeys,
  download_links: downloadLinks,
  download_logs: downloadLogs,
  piracy_alerts: piracyAlerts,
  leads: leads,
  lead_campaigns: leadCampaigns,
  ai_conversations: aiConversations,
  automation_logs: automationLogs,
  suppliers: suppliers,
  imported_products: importedProducts,
  supplier_orders: supplierOrders,
  sync_logs: syncLogs,
};

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

dataRoute.get('/data/:table', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { table } = req.params;
    const tableRef = tableMap[table];
    
    if (!tableRef) {
      return res.status(400).json({ error: 'Invalid table' });
    }

    const limit = parseInt(req.query.limit as string) || 100;
    
    let query = db.select().from(tableRef);
    
    if ('userId' in tableRef) {
      query = query.where(eq(tableRef.userId, user.id));
    }
    
    const data = await query.limit(limit);
    res.json({ data });
  } catch (error) {
    console.error('Data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

dataRoute.post('/data/:table', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { table } = req.params;
    const tableRef = tableMap[table];
    
    if (!tableRef) {
      return res.status(400).json({ error: 'Invalid table' });
    }

    const insertData = { ...req.body, userId: user.id };
    
    const result = await db.insert(tableRef).values(insertData).returning();
    res.json({ data: result[0] });
  } catch (error) {
    console.error('Data insert error:', error);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

dataRoute.patch('/data/:table/:id', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { table, id } = req.params;
    const tableRef = tableMap[table];
    
    if (!tableRef) {
      return res.status(400).json({ error: 'Invalid table' });
    }

    await db.update(tableRef)
      .set(req.body)
      .where(and(eq(tableRef.id, id), eq(tableRef.userId, user.id)));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Data update error:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

dataRoute.delete('/data/:table/:id', async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { table, id } = req.params;
    const tableRef = tableMap[table];
    
    if (!tableRef) {
      return res.status(400).json({ error: 'Invalid table' });
    }

    await db.delete(tableRef)
      .where(and(eq(tableRef.id, id), eq(tableRef.userId, user.id)));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Data delete error:', error);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});
