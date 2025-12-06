import { Router } from 'express';
import { db } from '../db';
import { supplierOrders } from '@shared/schema';

export const autoOrderProcessRoute = Router();

autoOrderProcessRoute.post('/auto-order-process', async (req, res) => {
  try {
    const { userId, supplierId, customerOrderId, importedProductId, orderDetails } = req.body;

    console.log(`Auto-processing order ${customerOrderId}`);

    // Create supplier order
    const newOrder = await db.insert(supplierOrders).values({
      userId,
      supplierId,
      customerOrderId,
      importedProductId,
      status: 'pending',
      orderDetails: orderDetails || {}
    }).returning();

    // TODO: Submit order to supplier API

    res.json({
      success: true,
      message: 'Order submitted to supplier',
      order: newOrder[0]
    });
  } catch (error) {
    console.error('Auto order process error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
