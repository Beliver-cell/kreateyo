import { Router } from 'express';
import { db } from '../db';
import { suppliers } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

export const supplierConnectRoute = Router();

type SupplierPlatform = 'aliexpress' | 'oberlo' | 'spocket' | 'cjdropshipping' | 'printful' | 'other';

interface SupplierCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
}

async function validateSupplierCredentials(
  platform: SupplierPlatform, 
  credentials: SupplierCredentials
): Promise<{ valid: boolean; message: string }> {
  switch (platform) {
    case 'aliexpress':
      if (!credentials.apiKey || !credentials.apiSecret) {
        return { valid: false, message: 'AliExpress requires API key and secret' };
      }
      return { valid: true, message: 'AliExpress credentials accepted' };

    case 'oberlo':
      if (!credentials.accessToken) {
        return { valid: false, message: 'Oberlo requires access token' };
      }
      return { valid: true, message: 'Oberlo credentials accepted' };

    case 'spocket':
      if (!credentials.apiKey) {
        return { valid: false, message: 'Spocket requires API key' };
      }
      return { valid: true, message: 'Spocket credentials accepted' };

    case 'cjdropshipping':
      if (!credentials.apiKey) {
        return { valid: false, message: 'CJ Dropshipping requires API key' };
      }
      return { valid: true, message: 'CJ Dropshipping credentials accepted' };

    case 'printful':
      if (!credentials.apiKey) {
        return { valid: false, message: 'Printful requires API key' };
      }
      return { valid: true, message: 'Printful credentials accepted' };

    default:
      return { valid: true, message: 'Custom supplier added' };
  }
}

supplierConnectRoute.post('/supplier-connect', async (req, res) => {
  try {
    const { userId, name, platform, apiKey, apiSecret, storeUrl, settings } = req.body;

    if (!userId || !name || !platform) {
      return res.status(400).json({ error: 'userId, name, and platform are required' });
    }

    console.log(`Connecting to supplier: ${name} on platform ${platform}`);

    const validation = await validateSupplierCredentials(platform, { apiKey, apiSecret });
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const newSupplier = await db.insert(suppliers).values({
      userId,
      name,
      platform,
      apiKey,
      apiSecret,
      storeUrl,
      settings: settings || {},
      status: 'active',
      lastSyncAt: new Date()
    }).returning();

    res.json({
      success: true,
      message: validation.message,
      supplier: newSupplier[0]
    });
  } catch (error) {
    console.error('Supplier connect error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

supplierConnectRoute.get('/suppliers', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const userSuppliers = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.userId, userId as string));

    res.json({ suppliers: userSuppliers });
  } catch (error) {
    console.error('Get suppliers error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

supplierConnectRoute.put('/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, apiKey, apiSecret, storeUrl, settings, status } = req.body;

    const updated = await db
      .update(suppliers)
      .set({
        name,
        apiKey,
        apiSecret,
        storeUrl,
        settings,
        status,
        updatedAt: new Date()
      })
      .where(eq(suppliers.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({
      success: true,
      message: 'Supplier updated',
      supplier: updated[0]
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

supplierConnectRoute.delete('/suppliers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .update(suppliers)
      .set({ status: 'disconnected' })
      .where(eq(suppliers.id, id));

    res.json({
      success: true,
      message: 'Supplier disconnected'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

supplierConnectRoute.post('/suppliers/:id/test', async (req, res) => {
  try {
    const { id } = req.params;

    const supplierList = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id));

    const supplier = supplierList[0];

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const validation = await validateSupplierCredentials(
      supplier.platform as SupplierPlatform, 
      { apiKey: supplier.apiKey || undefined, apiSecret: supplier.apiSecret || undefined }
    );

    res.json({
      success: validation.valid,
      message: validation.message,
      platform: supplier.platform
    });
  } catch (error) {
    console.error('Test supplier error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
