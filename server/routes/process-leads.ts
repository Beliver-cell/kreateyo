import { Router } from 'express';
import { db } from '../db';
import { leads } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const processLeadsRoute = Router();

processLeadsRoute.post('/process-leads', async (req, res) => {
  try {
    const { userId, leadIds, action } = req.body;

    console.log(`Processing leads for user ${userId}, action: ${action}`);

    // Update lead status based on action
    const statusMap: Record<string, string> = {
      qualify: 'qualified',
      disqualify: 'disqualified',
      contact: 'contacted',
      convert: 'converted'
    };

    const newStatus = statusMap[action] || 'processing';

    for (const leadId of leadIds) {
      await db
        .update(leads)
        .set({ 
          status: newStatus,
          updatedAt: new Date()
        })
        .where(eq(leads.id, leadId));
    }

    res.json({
      success: true,
      message: `${leadIds.length} leads processed successfully`,
      processedCount: leadIds.length
    });
  } catch (error) {
    console.error('Process leads error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
