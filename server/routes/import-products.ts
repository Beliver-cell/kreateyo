import { Router } from 'express';
import { db } from '../db';
import { importedProducts } from '@shared/schema';

export const importProductsRoute = Router();

importProductsRoute.post('/import-products', async (req, res) => {
  try {
    const { userId, supplierId, products } = req.body;

    console.log(`Importing ${products.length} products from supplier ${supplierId}`);

    const imported = [];
    for (const product of products) {
      const newProduct = await db.insert(importedProducts).values({
        userId,
        supplierId,
        externalId: product.externalId,
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        images: product.images || [],
        variants: product.variants || [],
        syncStatus: 'synced'
      }).returning();
      
      imported.push(newProduct[0]);
    }

    res.json({
      success: true,
      message: `${imported.length} products imported successfully`,
      products: imported
    });
  } catch (error) {
    console.error('Import products error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
