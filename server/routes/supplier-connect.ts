import { Router } from 'express';
import { db } from '../db';
import { suppliers } from '@shared/schema';

export const supplierConnectRoute = Router();

supplierConnectRoute.post('/supplier-connect', async (req, res) => {
  try {
    const { userId, name, platform, apiKey, apiSecret, storeUrl, settings } = req.body;

    console.log(`Connecting to supplier: ${name} on platform ${platform}`);

    // Create supplier connection
    const newSupplier = await db.insert(suppliers).values({
      userId,
      name,
      platform,
      apiKey,
      apiSecret,
      storeUrl,
      settings: settings || {},
      status: 'active'
    }).returning();

    res.json({
      success: true,
      message: 'Supplier connected successfully',
      supplier: newSupplier[0]
    });
  } catch (error) {
    console.error('Supplier connect error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
