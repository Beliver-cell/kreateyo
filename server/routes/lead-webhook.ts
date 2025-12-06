import { Router } from 'express';
import { db } from '../db';
import { leads } from '@shared/schema';

export const leadWebhookRoute = Router();

leadWebhookRoute.post('/lead-webhook', async (req, res) => {
  try {
    const { userId, name, email, phone, platform, source, metadata } = req.body;

    console.log(`Received lead webhook: ${email}`);

    // Create new lead
    const newLead = await db.insert(leads).values({
      userId,
      name,
      email,
      phone,
      platform,
      source,
      status: 'new',
      metadata: metadata || {}
    }).returning();

    res.json({
      success: true,
      message: 'Lead created successfully',
      lead: newLead[0]
    });
  } catch (error) {
    console.error('Lead webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
