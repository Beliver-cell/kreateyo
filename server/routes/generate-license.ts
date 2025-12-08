import { Router } from 'express';
import { db } from '../db';
import { licenseKeys, digitalProducts } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

export const generateLicenseRoute = Router();

// Generate a secure license key
function generateLicenseKey(prefix = 'DL'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 4;
  const segmentLength = 4;
  
  const parts: string[] = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(segment);
  }
  
  return `${prefix}-${parts.join('-')}`;
}

generateLicenseRoute.post('/generate-license', async (req, res) => {
  try {
    const { 
      userId,
      digitalProductId, 
      customerEmail, 
      customerOrderId,
      customSettings 
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    console.log(`Generating license for product ${digitalProductId}, customer ${customerEmail}`);

    // Get digital product details
    const products = await db
      .select()
      .from(digitalProducts)
      .where(and(
        eq(digitalProducts.id, digitalProductId),
        eq(digitalProducts.userId, userId)
      ));

    const product = products[0];

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Generate unique license key
    let licenseKey = generateLicenseKey();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure uniqueness
    while (attempts < maxAttempts) {
      const existing = await db
        .select()
        .from(licenseKeys)
        .where(eq(licenseKeys.licenseKey, licenseKey));

      if (existing.length === 0) break;
      licenseKey = generateLicenseKey();
      attempts++;
    }

    // Calculate expiration date
    const expiresAt = product.accessDurationDays 
      ? new Date(Date.now() + product.accessDurationDays * 24 * 60 * 60 * 1000)
      : null;

    // Create license key record
    const newLicense = await db
      .insert(licenseKeys)
      .values({
        userId,
        digitalProductId,
        customerEmail,
        customerOrderId,
        licenseKey,
        maxDownloads: customSettings?.maxDownloads || product.downloadLimit || 5,
        maxActivations: customSettings?.maxActivations || (product.licenseType === 'unlimited' ? 999 : 1),
        expiresAt
      })
      .returning();

    const license = newLicense[0];

    console.log(`License created successfully: ${licenseKey}`);

    res.json({ 
      success: true,
      license,
      message: 'License generated successfully'
    });
  } catch (error) {
    console.error('Generate license error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
