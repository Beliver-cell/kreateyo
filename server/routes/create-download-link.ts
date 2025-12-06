import { Router } from 'express';
import { db } from '../db';
import { licenseKeys, digitalProducts, downloadLinks, downloadLogs, piracyAlerts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const createDownloadLinkRoute = Router();

// Generate secure download token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

createDownloadLinkRoute.post('/create-download-link', async (req, res) => {
  try {
    const { licenseKey } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] as string || req.headers['x-real-ip'] as string || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    console.log(`Creating download link for license: ${licenseKey}`);

    // Verify license key and get product details
    const licenses = await db
      .select()
      .from(licenseKeys)
      .leftJoin(digitalProducts, eq(licenseKeys.digitalProductId, digitalProducts.id))
      .where(eq(licenseKeys.licenseKey, licenseKey));

    const licenseData = licenses[0];

    if (!licenseData || !licenseData.license_keys) {
      return res.status(404).json({ error: 'Invalid license key' });
    }

    const license = licenseData.license_keys;
    const product = licenseData.digital_products;

    // Check license validity
    if (license.status !== 'active') {
      return res.status(403).json({ error: `License is ${license.status}` });
    }

    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      await db
        .update(licenseKeys)
        .set({ status: 'expired' })
        .where(eq(licenseKeys.id, license.id));

      return res.status(403).json({ error: 'License has expired' });
    }

    if ((license.downloadCount || 0) >= (license.maxDownloads || 5)) {
      // Create piracy alert
      await db.insert(piracyAlerts).values({
        userId: license.userId,
        digitalProductId: license.digitalProductId,
        licenseKeyId: license.id,
        alertType: 'excessive_downloads',
        severity: 'medium',
        details: { download_count: license.downloadCount, ip_address: ipAddress }
      });

      return res.status(403).json({ error: 'Download limit exceeded' });
    }

    // Check for suspicious activity (multiple IPs)
    const ipAddresses = (license.ipAddresses as string[]) || [];
    if (!ipAddresses.includes(ipAddress)) {
      if (ipAddresses.length >= 3) {
        await db.insert(piracyAlerts).values({
          userId: license.userId,
          digitalProductId: license.digitalProductId,
          licenseKeyId: license.id,
          alertType: 'multiple_ips',
          severity: 'high',
          details: { ip_addresses: [...ipAddresses, ipAddress] }
        });
      }
      ipAddresses.push(ipAddress);
    }

    // Generate secure download token
    const secureToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // For now, use the file URL directly (in production, you'd generate a signed URL)
    const downloadUrl = product?.fileUrl || '';

    // Create download link record
    const newDownloadLink = await db
      .insert(downloadLinks)
      .values({
        licenseKeyId: license.id,
        digitalProductId: license.digitalProductId!,
        secureToken,
        downloadUrl,
        expiresAt,
        ipAddress,
        userAgent
      })
      .returning();

    const downloadLink = newDownloadLink[0];

    // Update license metadata
    await db
      .update(licenseKeys)
      .set({
        downloadCount: (license.downloadCount || 0) + 1,
        lastAccessedAt: new Date(),
        ipAddresses: ipAddresses as any
      })
      .where(eq(licenseKeys.id, license.id));

    // Log the download
    await db.insert(downloadLogs).values({
      licenseKeyId: license.id,
      digitalProductId: license.digitalProductId!,
      customerEmail: license.customerEmail,
      downloadLinkId: downloadLink.id,
      ipAddress,
      userAgent,
      success: true
    });

    res.json({ 
      success: true,
      downloadLink: {
        url: downloadLink.downloadUrl,
        expiresAt: downloadLink.expiresAt,
        productName: product?.name || 'Digital Product'
      },
      license: {
        downloadsRemaining: (license.maxDownloads || 0) - (license.downloadCount || 0) - 1,
        expiresAt: license.expiresAt
      }
    });
  } catch (error) {
    console.error('Create download link error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
