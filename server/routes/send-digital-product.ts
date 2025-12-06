import { Router } from 'express';
import { db } from '../db';

export const sendDigitalProductRoute = Router();

sendDigitalProductRoute.post('/send-digital-product', async (req, res) => {
  try {
    const { customerEmail, licenseKey, productName } = req.body;

    console.log(`Sending digital product to ${customerEmail}`);

    // TODO: Integrate with email service (e.g., Resend)
    // For now, return success
    res.json({
      success: true,
      message: 'Digital product email sent successfully'
    });
  } catch (error) {
    console.error('Send digital product error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
