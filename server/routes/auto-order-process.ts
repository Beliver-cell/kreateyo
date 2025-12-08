import { Router } from 'express';
import { db } from '../db';
import { supplierOrders, importedProducts, suppliers } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export const autoOrderProcessRoute = Router();

interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface OrderItem {
  importedProductId: string;
  quantity: number;
  variantId?: string;
}

async function submitOrderToSupplier(
  supplier: any, 
  product: any, 
  orderDetails: any
): Promise<{ success: boolean; supplierOrderId?: string; trackingNumber?: string; error?: string }> {
  console.log(`Submitting order to ${supplier.platform}...`);
  
  const mockOrderId = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    success: true,
    supplierOrderId: mockOrderId,
    trackingNumber: undefined
  };
}

autoOrderProcessRoute.post('/auto-order-process', async (req, res) => {
  try {
    const { userId, customerOrderId, items, shippingAddress } = req.body;

    if (!userId || !customerOrderId) {
      return res.status(400).json({ error: 'userId and customerOrderId are required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'shippingAddress is required' });
    }

    console.log(`Auto-processing order ${customerOrderId} with ${items.length} items`);

    const processedOrders = [];
    const failedOrders = [];

    for (const item of items as OrderItem[]) {
      try {
        const products = await db
          .select()
          .from(importedProducts)
          .where(eq(importedProducts.id, item.importedProductId));

        const product = products[0];

        if (!product) {
          failedOrders.push({
            importedProductId: item.importedProductId,
            error: 'Product not found'
          });
          continue;
        }

        const supplierList = await db
          .select()
          .from(suppliers)
          .where(eq(suppliers.id, product.supplierId!));

        const supplier = supplierList[0];

        if (!supplier) {
          failedOrders.push({
            importedProductId: item.importedProductId,
            error: 'Supplier not found'
          });
          continue;
        }

        if (supplier.status !== 'active') {
          failedOrders.push({
            importedProductId: item.importedProductId,
            error: 'Supplier is not active'
          });
          continue;
        }

        const orderDetails = {
          quantity: item.quantity,
          variantId: item.variantId,
          shippingAddress,
          productExternalId: product.externalId
        };

        const supplierResult = await submitOrderToSupplier(supplier, product, orderDetails);

        const newOrder = await db.insert(supplierOrders).values({
          userId,
          supplierId: supplier.id,
          customerOrderId,
          importedProductId: item.importedProductId,
          status: supplierResult.success ? 'submitted' : 'failed',
          externalOrderId: supplierResult.supplierOrderId,
          trackingNumber: supplierResult.trackingNumber,
          orderDetails: {
            ...orderDetails,
            supplierResponse: supplierResult
          }
        }).returning();

        if (supplierResult.success) {
          processedOrders.push({
            supplierOrderId: newOrder[0].id,
            productName: product.name,
            supplierName: supplier.name,
            externalOrderId: supplierResult.supplierOrderId
          });
        } else {
          failedOrders.push({
            importedProductId: item.importedProductId,
            productName: product.name,
            error: supplierResult.error || 'Supplier order failed'
          });
        }
      } catch (err) {
        failedOrders.push({
          importedProductId: item.importedProductId,
          error: err instanceof Error ? err.message : 'Processing failed'
        });
      }
    }

    res.json({
      success: failedOrders.length === 0,
      message: `Processed ${processedOrders.length} of ${items.length} items`,
      customerOrderId,
      processedOrders,
      failedOrders: failedOrders.length > 0 ? failedOrders : undefined
    });
  } catch (error) {
    console.error('Auto order process error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

autoOrderProcessRoute.get('/supplier-orders', async (req, res) => {
  try {
    const { userId, customerOrderId, status } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let query = db.select().from(supplierOrders).where(eq(supplierOrders.userId, userId as string));

    const orders = await query;

    res.json({ orders });
  } catch (error) {
    console.error('Get supplier orders error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

autoOrderProcessRoute.put('/supplier-orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, shippingCarrier } = req.body;

    const updates: any = { updatedAt: new Date() };

    if (status) updates.status = status;
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (shippingCarrier) updates.shippingCarrier = shippingCarrier;

    const updated = await db
      .update(supplierOrders)
      .set(updates)
      .where(eq(supplierOrders.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order: updated[0]
    });
  } catch (error) {
    console.error('Update supplier order error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

autoOrderProcessRoute.post('/supplier-orders/:id/retry', async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await db
      .select()
      .from(supplierOrders)
      .where(eq(supplierOrders.id, id));

    const order = orders[0];

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'failed') {
      return res.status(400).json({ error: 'Only failed orders can be retried' });
    }

    const products = await db
      .select()
      .from(importedProducts)
      .where(eq(importedProducts.id, order.importedProductId!));

    const product = products[0];

    const supplierList = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, order.supplierId!));

    const supplier = supplierList[0];

    if (!supplier || !product) {
      return res.status(400).json({ error: 'Supplier or product not found' });
    }

    const result = await submitOrderToSupplier(supplier, product, order.orderDetails);

    await db
      .update(supplierOrders)
      .set({
        status: result.success ? 'submitted' : 'failed',
        externalOrderId: result.supplierOrderId,
        updatedAt: new Date()
      })
      .where(eq(supplierOrders.id, id));

    res.json({
      success: result.success,
      message: result.success ? 'Order resubmitted successfully' : 'Retry failed',
      supplierOrderId: result.supplierOrderId,
      error: result.error
    });
  } catch (error) {
    console.error('Retry order error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
