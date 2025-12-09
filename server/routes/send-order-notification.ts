import { Router } from 'express';
import { db } from '../db';
import { orderNotifications } from '@shared/schema';
import { Resend } from 'resend';
import { eq } from 'drizzle-orm';

export const sendOrderNotificationRoute = Router();

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

const FROM_EMAIL = process.env.EMAIL_FROM || 'Kreateyo <noreply@kreateyo.com>';

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  notificationType: 'order_confirmation' | 'shipping_update' | 'delivery_confirmation' | 'refund' | 'cancellation';
  trackingNumber?: string;
  carrier?: string;
  orderTotal?: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
  businessName?: string;
}

function getEmailSubject(notificationType: string, orderId: string, businessName?: string): string {
  const subjects: Record<string, string> = {
    order_confirmation: `Order Confirmed - #${orderId}`,
    shipping_update: `Your Order Has Shipped - #${orderId}`,
    delivery_confirmation: `Your Order Has Been Delivered - #${orderId}`,
    refund: `Refund Processed - #${orderId}`,
    cancellation: `Order Cancelled - #${orderId}`
  };
  
  const subject = subjects[notificationType] || `Order Update - #${orderId}`;
  return businessName ? `${subject} | ${businessName}` : subject;
}

function generateOrderEmailHtml(data: OrderEmailData): string {
  const { notificationType, orderId, customerName, trackingNumber, carrier, orderTotal, items, businessName } = data;
  
  let content = '';
  
  switch (notificationType) {
    case 'order_confirmation':
      content = `
        <h1 style="color: #333; margin-bottom: 20px;">Order Confirmed!</h1>
        <p>Hi ${customerName || 'there'},</p>
        <p>Thank you for your order! We've received your order and are getting it ready.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order #:</strong> ${orderId}</p>
          ${orderTotal ? `<p><strong>Total:</strong> $${orderTotal.toFixed(2)}</p>` : ''}
        </div>
        ${items && items.length > 0 ? `
          <h3 style="margin-top: 20px;">Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0;">${item.name}</td>
                <td style="padding: 10px 0; text-align: center;">x${item.quantity}</td>
                <td style="padding: 10px 0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
        ` : ''}
        <p style="margin-top: 20px;">We'll send you another email when your order ships.</p>
      `;
      break;
      
    case 'shipping_update':
      content = `
        <h1 style="color: #333; margin-bottom: 20px;">Your Order Has Shipped!</h1>
        <p>Hi ${customerName || 'there'},</p>
        <p>Great news! Your order is on its way.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order #:</strong> ${orderId}</p>
          ${carrier ? `<p><strong>Carrier:</strong> ${carrier}</p>` : ''}
          ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
        </div>
        <p>Track your package using the tracking number above on the carrier's website.</p>
      `;
      break;
      
    case 'delivery_confirmation':
      content = `
        <h1 style="color: #333; margin-bottom: 20px;">Your Order Has Been Delivered!</h1>
        <p>Hi ${customerName || 'there'},</p>
        <p>Your order #${orderId} has been delivered. We hope you love it!</p>
        <p>If you have any questions or concerns about your order, please don't hesitate to contact us.</p>
      `;
      break;
      
    case 'refund':
      content = `
        <h1 style="color: #333; margin-bottom: 20px;">Refund Processed</h1>
        <p>Hi ${customerName || 'there'},</p>
        <p>We've processed your refund for order #${orderId}.</p>
        ${orderTotal ? `<p>Refund amount: <strong>$${orderTotal.toFixed(2)}</strong></p>` : ''}
        <p>Please allow 5-10 business days for the refund to appear in your account.</p>
      `;
      break;
      
    case 'cancellation':
      content = `
        <h1 style="color: #333; margin-bottom: 20px;">Order Cancelled</h1>
        <p>Hi ${customerName || 'there'},</p>
        <p>Your order #${orderId} has been cancelled as requested.</p>
        <p>If you didn't request this cancellation or have any questions, please contact us immediately.</p>
      `;
      break;
      
    default:
      content = `
        <h1 style="color: #333; margin-bottom: 20px;">Order Update</h1>
        <p>Hi ${customerName || 'there'},</p>
        <p>There's an update for your order #${orderId}.</p>
      `;
  }
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Thank you for shopping with ${businessName || 'us'}!
      </p>
    </div>
  `;
}

async function sendOrderEmail(data: OrderEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResend();
  
  if (!resend) {
    console.log(`[EMAIL MOCK] Would send ${data.notificationType} to ${data.customerEmail} for order ${data.orderId}`);
    return { success: true, messageId: 'mock-email-id' };
  }
  
  try {
    const subject = getEmailSubject(data.notificationType, data.orderId, data.businessName);
    const html = generateOrderEmailHtml(data);
    
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.customerEmail],
      subject,
      html
    });
    
    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Order notification email sent:', emailData?.id);
    return { success: true, messageId: emailData?.id };
  } catch (error) {
    console.error('Send order email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

sendOrderNotificationRoute.post('/send-order-notification', async (req, res) => {
  try {
    const { 
      userId, 
      orderId, 
      notificationType, 
      customerEmail, 
      customerName,
      trackingNumber, 
      carrier,
      orderTotal,
      items,
      businessName
    } = req.body;

    if (!userId || !orderId || !notificationType || !customerEmail) {
      return res.status(400).json({ 
        error: 'userId, orderId, notificationType, and customerEmail are required' 
      });
    }

    console.log(`Sending order notification: ${notificationType} for order ${orderId}`);

    const emailResult = await sendOrderEmail({
      orderId,
      customerEmail,
      customerName,
      notificationType,
      trackingNumber,
      carrier,
      orderTotal,
      items,
      businessName
    });

    await db.insert(orderNotifications).values({
      userId,
      orderId,
      notificationType,
      customerEmail,
      trackingNumber,
      carrier,
      status: emailResult.success ? 'sent' : 'failed',
      sentAt: emailResult.success ? new Date() : null,
      errorMessage: emailResult.error || null
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send order notification',
        error: emailResult.error
      });
    }

    res.json({
      success: true,
      message: 'Order notification sent successfully',
      messageId: emailResult.messageId
    });
  } catch (error) {
    console.error('Send order notification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

sendOrderNotificationRoute.get('/order-notifications', async (req, res) => {
  try {
    const { userId, orderId, status } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const notifications = await db
      .select()
      .from(orderNotifications)
      .where(eq(orderNotifications.userId, userId as string));

    res.json({ notifications });
  } catch (error) {
    console.error('Get order notifications error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});
