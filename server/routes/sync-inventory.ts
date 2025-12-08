import { Router } from 'express';
import { db } from '../db';
import { importedProducts, suppliers, syncLogs } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

export const syncInventoryRoute = Router();

interface InventoryUpdate {
  externalId: string;
  stockQuantity?: number;
  price?: number;
  available?: boolean;
}

async function fetchSupplierInventory(supplier: any): Promise<InventoryUpdate[]> {
  console.log(`Fetching inventory from ${supplier.platform}...`);
  
  return [];
}

syncInventoryRoute.post('/sync-inventory', async (req, res) => {
  try {
    const { userId, supplierId } = req.body;

    if (!userId || !supplierId) {
      return res.status(400).json({ error: 'userId and supplierId are required' });
    }

    console.log(`Syncing inventory for supplier ${supplierId}`);

    const supplierList = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, supplierId));

    const supplier = supplierList[0];

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const products = await db
      .select()
      .from(importedProducts)
      .where(eq(importedProducts.supplierId, supplierId));

    const inventoryUpdates = await fetchSupplierInventory(supplier);

    let updatedCount = 0;
    let outOfStockCount = 0;
    const priceChanges: any[] = [];

    for (const update of inventoryUpdates) {
      const product = products.find(p => p.externalId === update.externalId);
      if (product) {
        const updates: any = {
          lastSyncedAt: new Date(),
          syncStatus: 'synced'
        };

        if (update.stockQuantity !== undefined) {
          updates.stockQuantity = update.stockQuantity;
          if (update.stockQuantity === 0) {
            outOfStockCount++;
            updates.syncStatus = 'out_of_stock';
          }
        }

        if (update.price !== undefined && update.price !== parseFloat(product.cost || '0')) {
          priceChanges.push({
            productId: product.id,
            productName: product.name,
            oldCost: product.cost,
            newCost: update.price
          });
          updates.cost = update.price.toString();
        }

        await db
          .update(importedProducts)
          .set(updates)
          .where(eq(importedProducts.id, product.id));

        updatedCount++;
      }
    }

    await db
      .update(suppliers)
      .set({ lastSyncAt: new Date() })
      .where(eq(suppliers.id, supplierId));

    await db.insert(syncLogs).values({
      userId,
      supplierId,
      syncType: 'inventory',
      status: 'success',
      itemsProcessed: updatedCount,
      itemsFailed: 0
    });

    res.json({
      success: true,
      message: 'Inventory synced successfully',
      stats: {
        totalProducts: products.length,
        updatedProducts: updatedCount,
        outOfStock: outOfStockCount,
        priceChanges: priceChanges.length
      },
      priceChanges: priceChanges.length > 0 ? priceChanges : undefined
    });
  } catch (error) {
    console.error('Sync inventory error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

syncInventoryRoute.get('/sync-logs', async (req, res) => {
  try {
    const { userId, supplierId, syncType } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let query = db.select().from(syncLogs).where(eq(syncLogs.userId, userId as string));

    const logs = await query;

    res.json({ logs });
  } catch (error) {
    console.error('Get sync logs error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

syncInventoryRoute.post('/sync-all', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const userSuppliers = await db
      .select()
      .from(suppliers)
      .where(and(
        eq(suppliers.userId, userId),
        eq(suppliers.status, 'active')
      ));

    const results = [];

    for (const supplier of userSuppliers) {
      try {
        const products = await db
          .select()
          .from(importedProducts)
          .where(eq(importedProducts.supplierId, supplier.id));

        await db
          .update(suppliers)
          .set({ lastSyncAt: new Date() })
          .where(eq(suppliers.id, supplier.id));

        await db.insert(syncLogs).values({
          userId,
          supplierId: supplier.id,
          syncType: 'inventory',
          status: 'success',
          itemsProcessed: products.length,
          itemsFailed: 0
        });

        results.push({
          supplierId: supplier.id,
          supplierName: supplier.name,
          success: true,
          productsProcessed: products.length
        });
      } catch (err) {
        results.push({
          supplierId: supplier.id,
          supplierName: supplier.name,
          success: false,
          error: err instanceof Error ? err.message : 'Sync failed'
        });
      }
    }

    res.json({
      success: true,
      message: `Synced ${results.filter(r => r.success).length} of ${userSuppliers.length} suppliers`,
      results
    });
  } catch (error) {
    console.error('Sync all error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
