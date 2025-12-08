import { Router } from 'express';
import { db } from '../db';
import { importedProducts, suppliers, syncLogs } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export const importProductsRoute = Router();

interface ProductToImport {
  externalId: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  images?: string[];
  variants?: any[];
  category?: string;
  sku?: string;
}

function calculateSellingPrice(
  cost: number, 
  profitMarginPercent: number = 30,
  platformFeePercent: number = 3.5,
  shippingCost: number = 0
): number {
  const costWithShipping = cost + shippingCost;
  const marginMultiplier = 1 + (profitMarginPercent / 100);
  const feeMultiplier = 1 + (platformFeePercent / 100);
  return Math.ceil(costWithShipping * marginMultiplier * feeMultiplier * 100) / 100;
}

importProductsRoute.post('/import-products', async (req, res) => {
  try {
    const { userId, supplierId, products, profitMarginPercent = 30 } = req.body;

    if (!userId || !supplierId) {
      return res.status(400).json({ error: 'userId and supplierId are required' });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'products array is required' });
    }

    console.log(`Importing ${products.length} products from supplier ${supplierId}`);

    const supplierList = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, supplierId));

    if (supplierList.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const imported: any[] = [];
    const errors: any[] = [];

    for (const product of products as ProductToImport[]) {
      try {
        const sellingPrice = calculateSellingPrice(product.cost, profitMarginPercent);
        const profitAmount = sellingPrice - product.cost;

        const newProduct = await db.insert(importedProducts).values({
          userId,
          supplierId,
          externalId: product.externalId,
          name: product.name,
          description: product.description || '',
          price: sellingPrice.toString(),
          cost: product.cost.toString(),
          profitMargin: profitMarginPercent.toString(),
          images: product.images || [],
          variants: product.variants || [],
          syncStatus: 'synced',
          lastSyncedAt: new Date()
        }).returning();
        
        imported.push({
          ...newProduct[0],
          calculatedProfit: profitAmount
        });
      } catch (err) {
        errors.push({
          externalId: product.externalId,
          name: product.name,
          error: err instanceof Error ? err.message : 'Import failed'
        });
      }
    }

    await db.insert(syncLogs).values({
      userId,
      supplierId,
      syncType: 'import',
      status: errors.length === 0 ? 'success' : 'partial',
      itemsProcessed: imported.length,
      itemsFailed: errors.length,
      errorDetails: errors.length > 0 ? { errors } : null
    });

    res.json({
      success: true,
      message: `${imported.length} products imported successfully`,
      products: imported,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Import products error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

importProductsRoute.get('/imported-products', async (req, res) => {
  try {
    const { userId, supplierId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let query = db.select().from(importedProducts).where(eq(importedProducts.userId, userId as string));

    if (supplierId) {
      query = db.select().from(importedProducts).where(eq(importedProducts.supplierId, supplierId as string));
    }

    const products = await query;

    res.json({ products });
  } catch (error) {
    console.error('Get imported products error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

importProductsRoute.put('/imported-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, variants, syncStatus } = req.body;

    const updated = await db
      .update(importedProducts)
      .set({
        name,
        description,
        price: price?.toString(),
        images,
        variants,
        syncStatus,
        updatedAt: new Date()
      })
      .where(eq(importedProducts.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product: updated[0]
    });
  } catch (error) {
    console.error('Update imported product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

importProductsRoute.delete('/imported-products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .update(importedProducts)
      .set({ syncStatus: 'deleted' })
      .where(eq(importedProducts.id, id));

    res.json({
      success: true,
      message: 'Product removed from imported list'
    });
  } catch (error) {
    console.error('Delete imported product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
