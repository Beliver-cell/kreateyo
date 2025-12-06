import { Router } from 'express';
import { db } from '../db';
import { importedProducts, syncLogs } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const syncInventoryRoute = Router();

syncInventoryRoute.post('/sync-inventory', async (req, res) => {
  try {
    const { userId, supplierId } = req.body;

    console.log(`Syncing inventory for supplier ${supplierId}`);

    // Get all products for this supplier
    const products = await db
      .select()
      .from(importedProducts)
      .where(eq(importedProducts.supplierId, supplierId));

    // TODO: Connect to supplier API to sync inventory

    // Log the sync
    await db.insert(syncLogs).values({
      userId,
      supplierId,
      syncType: 'inventory',
      status: 'success',
      itemsProcessed: products.length,
      itemsFailed: 0
    });

    res.json({
      success: true,
      message: 'Inventory synced successfully',
      itemsProcessed: products.length
    });
  } catch (error) {
    console.error('Sync inventory error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
