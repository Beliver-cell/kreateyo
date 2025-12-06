import { Router } from 'express';
import { db } from '../db';
import { licenseKeys, digitalProducts, piracyAlerts } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export const validateLicenseRoute = Router();

validateLicenseRoute.post('/validate-license', async (req, res) => {
  try {
    const { licenseKey, deviceFingerprint } = req.body;

    console.log(`Validating license: ${licenseKey}`);

    // Get license details with product info
    const licenses = await db
      .select()
      .from(licenseKeys)
      .leftJoin(digitalProducts, eq(licenseKeys.digitalProductId, digitalProducts.id))
      .where(eq(licenseKeys.licenseKey, licenseKey));

    const licenseData = licenses[0];

    if (!licenseData || !licenseData.license_keys) {
      return res.json({
        valid: false,
        error: 'Invalid license key'
      });
    }

    const license = licenseData.license_keys;
    const product = licenseData.digital_products;

    const validationResult: any = {
      valid: false,
      license: {
        status: license.status,
        productName: product?.name || 'Unknown Product',
        expiresAt: license.expiresAt,
        downloadsRemaining: (license.maxDownloads || 0) - (license.downloadCount || 0),
        activationsRemaining: (license.maxActivations || 0) - (license.activationCount || 0),
      }
    };

    // Check if license is active
    if (license.status !== 'active') {
      validationResult.error = `License is ${license.status}`;
      return res.json(validationResult);
    }

    // Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      await db
        .update(licenseKeys)
        .set({ status: 'expired' })
        .where(eq(licenseKeys.id, license.id));

      validationResult.error = 'License has expired';
      return res.json(validationResult);
    }

    // Check activation limit
    if (product?.requiresActivation && deviceFingerprint) {
      const deviceFingerprints = (license.deviceFingerprints as string[]) || [];
      
      if (!deviceFingerprints.includes(deviceFingerprint)) {
        if ((license.activationCount || 0) >= (license.maxActivations || 1)) {
          // Create piracy alert
          await db.insert(piracyAlerts).values({
            userId: license.userId,
            digitalProductId: license.digitalProductId,
            licenseKeyId: license.id,
            alertType: 'key_sharing',
            severity: 'high',
            details: { 
              activation_count: license.activationCount,
              device_fingerprint: deviceFingerprint 
            }
          });

          validationResult.error = 'Activation limit exceeded';
          return res.json(validationResult);
        }

        // Register new activation
        deviceFingerprints.push(deviceFingerprint);
        await db
          .update(licenseKeys)
          .set({
            activationCount: (license.activationCount || 0) + 1,
            deviceFingerprints: deviceFingerprints as any,
            lastAccessedAt: new Date()
          })
          .where(eq(licenseKeys.id, license.id));

        validationResult.license.activationsRemaining = (license.maxActivations || 0) - (license.activationCount || 0) - 1;
      }
    }

    // License is valid
    validationResult.valid = true;
    validationResult.message = 'License is valid and active';

    res.json(validationResult);
  } catch (error) {
    console.error('Validate license error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ valid: false, error: errorMessage });
  }
});
