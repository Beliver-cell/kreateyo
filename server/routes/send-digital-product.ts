import { Router } from 'express';
import { db } from '../db';
import { licenseKeys, digitalProducts } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

export const sendDigitalProductRoute = Router();

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

async function sendDigitalProductEmail(
  customerEmail: string, 
  productName: string, 
  downloadUrl: string
) {
  const FROM_EMAIL = process.env.EMAIL_FROM || 'Kreateyo <noreply@kreateyo.com>';
  const resend = getResend();

  if (!resend) {
    console.log(`[EMAIL MOCK] Would send digital product to ${customerEmail}: ${productName}`);
    return { id: 'mock-email-id', success: true };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Your Digital Product</h1>
      <p>Hi there,</p>
      <p>Thank you for your purchase! Your digital product is ready for download.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${productName}</h3>
        <a href="${downloadUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; margin: 10px 0;">
          Download Now
        </a>
        <p style="font-size: 12px; color: #666; margin-top: 15px;">
          This download link will expire in 24 hours.
        </p>
      </div>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        If you have any issues with your download, please contact support.
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      subject: `Your Digital Product: ${productName}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log('Digital product email sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending digital product email:', error);
    throw new Error('Failed to send email');
  }
}

sendDigitalProductRoute.post('/send-digital-product', async (req, res) => {
  try {
    const { licenseKeyId, customerEmail, productName, downloadUrl } = req.body;

    if (licenseKeyId) {
      const licenses = await db
        .select()
        .from(licenseKeys)
        .leftJoin(digitalProducts, eq(licenseKeys.digitalProductId, digitalProducts.id))
        .where(eq(licenseKeys.id, licenseKeyId));

      const licenseData = licenses[0];

      if (!licenseData || !licenseData.license_keys) {
        return res.status(404).json({ error: 'License not found' });
      }

      const license = licenseData.license_keys;
      const product = licenseData.digital_products;

      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'http://localhost:5000';
      
      const downloadLink = `${baseUrl}/download?license=${license.licenseKey}`;

      await sendDigitalProductEmail(
        license.customerEmail,
        product?.name || 'Digital Product',
        downloadLink
      );

      console.log(`Digital product email sent to ${license.customerEmail}`);

      return res.json({
        success: true,
        message: 'Digital product email sent successfully',
        email: license.customerEmail
      });
    }

    if (customerEmail && productName && downloadUrl) {
      await sendDigitalProductEmail(customerEmail, productName, downloadUrl);

      return res.json({
        success: true,
        message: 'Digital product email sent successfully',
        email: customerEmail
      });
    }

    return res.status(400).json({ 
      error: 'Either licenseKeyId or (customerEmail, productName, downloadUrl) required' 
    });
  } catch (error) {
    console.error('Send digital product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

sendDigitalProductRoute.get('/digital-products', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const products = await db
      .select()
      .from(digitalProducts)
      .where(eq(digitalProducts.userId, userId as string));

    res.json({ products });
  } catch (error) {
    console.error('Get digital products error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

sendDigitalProductRoute.post('/digital-products', async (req, res) => {
  try {
    const { 
      userId, 
      name, 
      description, 
      price, 
      fileUrl, 
      fileType,
      fileSize,
      downloadLimit,
      accessDurationDays,
      licenseType,
      requiresActivation
    } = req.body;

    if (!userId || !name || !price || !fileUrl) {
      return res.status(400).json({ error: 'userId, name, price, and fileUrl are required' });
    }

    const newProduct = await db
      .insert(digitalProducts)
      .values({
        userId,
        name,
        description,
        price: price.toString(),
        fileUrl,
        fileType,
        fileSize,
        downloadLimit: downloadLimit || 5,
        accessDurationDays: accessDurationDays || 365,
        licenseType: licenseType || 'single',
        requiresActivation: requiresActivation || false
      })
      .returning();

    res.json({ 
      success: true, 
      product: newProduct[0] 
    });
  } catch (error) {
    console.error('Create digital product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

sendDigitalProductRoute.get('/licenses', async (req, res) => {
  try {
    const { userId, digitalProductId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const licenses = digitalProductId 
      ? await db.select().from(licenseKeys).where(eq(licenseKeys.digitalProductId, digitalProductId as string))
      : await db.select().from(licenseKeys).where(eq(licenseKeys.userId, userId as string));

    res.json({ licenses });
  } catch (error) {
    console.error('Get licenses error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
