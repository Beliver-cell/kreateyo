import { Router } from 'express';
import { db } from '../db';
import { orderNotifications } from '@shared/schema';

export const sendOrderNotificationRoute = Router();

sendOrderNotificationRoute.post('/send-order-notification', async (req, res) => {
  try {
    const { userId, orderId, notificationType, customerEmail, trackingNumber, carrier } = req.body;

    console.log(`Sending order notification: ${notificationType} for order ${orderId}`);

    // Create notification record
    await db.insert(orderNotifications).values({
      userId,
      orderId,
      notificationType,
      customerEmail,
      trackingNumber,
      carrier,
      status: 'sent',
      sentAt: new Date()
    });

    // TODO: Integrate with email service (e.g., Resend)
    res.json({
      success: true,
      message: 'Order notification sent successfully'
    });
  } catch (error) {
    console.error('Send order notification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
