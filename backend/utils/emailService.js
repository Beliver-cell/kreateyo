const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'Kreateyo <noreply@kreateyo.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000';

const sendEmail = async (to, subject, html) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL MOCK] Would send to ${to}: ${subject}`);
    return { id: 'mock-email-id', success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log('Email sent successfully:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Verify Your Email</h1>
      <p>Thank you for signing up with Kreateyo! Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail(email, 'Verify Your Email - Kreateyo', html);
};

exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Reset Your Password</h1>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail(email, 'Password Reset - Kreateyo', html);
};

exports.sendTeamInvitationEmail = async (email, inviterName, teamName, token) => {
  const invitationUrl = `${FRONTEND_URL}/team-invitation?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Team Invitation</h1>
      <p>${inviterName} has invited you to join <strong>${teamName}</strong> on Kreateyo.</p>
      <a href="${invitationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Accept Invitation
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${invitationUrl}</p>
      <p>This invitation will expire in 7 days.</p>
    </div>
  `;

  return sendEmail(email, `You're invited to join ${teamName}`, html);
};

exports.sendNotificationEmail = async (email, subject, message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${subject}</h2>
      <p>${message}</p>
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        This is an automated message from Kreateyo. Please do not reply to this email.
      </p>
    </div>
  `;

  return sendEmail(email, subject, html);
};

exports.sendCustomerVerificationEmail = async (customer, token) => {
  const verificationUrl = `${FRONTEND_URL}/customer/verify?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Email Verification</h1>
      <p>Hi ${customer.firstName},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
    </div>
  `;

  return sendEmail(customer.email, 'Verify Your Email', html);
};

exports.sendCustomerPasswordResetEmail = async (customer, token) => {
  const resetUrl = `${FRONTEND_URL}/customer/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Password Reset</h1>
      <p>Hi ${customer.firstName},</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p style="color: #666; word-break: break-all;">${resetUrl}</p>
      <p>This link expires in 30 minutes.</p>
    </div>
  `;

  return sendEmail(customer.email, 'Password Reset', html);
};

exports.sendAppointmentConfirmation = async (appointment, customer, service, business) => {
  const zoomInfo = appointment.zoomJoinUrl ? `
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Video Call Details</h3>
      <p><strong>Join URL:</strong> <a href="${appointment.zoomJoinUrl}" style="color: #0066cc;">Click to join meeting</a></p>
      <p><strong>Meeting ID:</strong> ${appointment.zoomMeetingId}</p>
      ${appointment.zoomPassword ? `<p><strong>Password:</strong> ${appointment.zoomPassword}</p>` : ''}
      <p style="font-size: 12px; color: #666;">You can join the meeting 15 minutes before the scheduled time.</p>
    </div>
  ` : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Appointment Confirmation</h1>
      <p>Hi ${customer.firstName},</p>
      <p>Your appointment has been confirmed.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Appointment Details</h3>
        <p><strong>Service:</strong> ${service.name}</p>
        <p><strong>Date:</strong> ${new Date(appointment.startTime).toLocaleDateString('en-US', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        })}</p>
        <p><strong>Time:</strong> ${new Date(appointment.startTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', minute: '2-digit' 
        })}</p>
        <p><strong>Duration:</strong> ${service.duration?.value || 30} ${service.duration?.unit || 'minutes'}</p>
      </div>
      
      ${zoomInfo}
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        If you need to reschedule or cancel, please log in to your account.
      </p>
    </div>
  `;

  return sendEmail(customer.email, `Appointment Confirmed - ${business.name}`, html);
};

exports.sendOrderConfirmation = async (order, customer, business) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Order Confirmation</h1>
      <p>Hi ${customer.firstName || 'Customer'},</p>
      <p>Thank you for your order! Here's a summary:</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order #:</strong> ${order.orderNumber || order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #eee;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>$${order.total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <p>We'll send you another email when your order ships.</p>
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Thank you for shopping with ${business.name}!
      </p>
    </div>
  `;

  return sendEmail(customer.email, `Order Confirmation - ${business.name}`, html);
};

exports.sendDigitalProductDelivery = async (customer, product, downloadUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Your Digital Product</h1>
      <p>Hi ${customer.firstName || 'Customer'},</p>
      <p>Thank you for your purchase! Your digital product is ready for download.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${product.name}</h3>
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

  return sendEmail(customer.email, `Your Digital Product: ${product.name}`, html);
};

exports.sendShippingUpdate = async (customer, order, trackingNumber, carrier) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Your Order Has Shipped!</h1>
      <p>Hi ${customer.firstName || 'Customer'},</p>
      <p>Great news! Your order is on its way.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order #:</strong> ${order.orderNumber || order.id}</p>
        <p><strong>Carrier:</strong> ${carrier}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      </div>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Track your package using the tracking number above on the carrier's website.
      </p>
    </div>
  `;

  return sendEmail(customer.email, 'Your Order Has Shipped!', html);
};
