const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// Send verification email
exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"NexusCreate" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email - NexusCreate',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Verify Your Email</h1>
        <p>Thank you for signing up with NexusCreate! Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"NexusCreate" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset - NexusCreate',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Reset Your Password</h1>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send team invitation email
exports.sendTeamInvitationEmail = async (email, inviterName, teamName, token) => {
  const invitationUrl = `${process.env.FRONTEND_URL}/team-invitation?token=${token}`;

  const mailOptions = {
    from: `"NexusCreate" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `You're invited to join ${teamName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Team Invitation</h1>
        <p>${inviterName} has invited you to join <strong>${teamName}</strong> on NexusCreate.</p>
        <a href="${invitationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Accept Invitation
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${invitationUrl}</p>
        <p>This invitation will expire in 7 days.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Team invitation email sent to:', email);
  } catch (error) {
    console.error('Error sending team invitation email:', error);
    throw new Error('Failed to send team invitation email');
  }
};

// Send notification email
exports.sendNotificationEmail = async (email, subject, message) => {
  const mailOptions = {
    from: `"NexusCreate" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <p>${message}</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated message from NexusCreate. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent to:', email);
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw new Error('Failed to send notification email');
  }
};

// Send customer verification email
exports.sendCustomerVerificationEmail = async (customer, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/customer/verify?token=${token}`;
  
  const mailOptions = {
    from: `"NexusCreate" <${process.env.EMAIL_FROM}>`,
    to: customer.email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Email Verification</h1>
        <p>Hi ${customer.firstName},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Customer verification email sent to:', customer.email);
  } catch (error) {
    console.error('Error sending customer verification email:', error);
    throw new Error('Failed to send customer verification email');
  }
};

// Send customer password reset
exports.sendCustomerPasswordResetEmail = async (customer, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/customer/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"NexusCreate" <${process.env.EMAIL_FROM}>`,
    to: customer.email,
    subject: 'Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset</h1>
        <p>Hi ${customer.firstName},</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link expires in 30 minutes.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Customer password reset email sent to:', customer.email);
  } catch (error) {
    console.error('Error sending customer password reset email:', error);
    throw new Error('Failed to send customer password reset email');
  }
};

// Send appointment confirmation with Zoom details
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

  const mailOptions = {
    from: `"${business.name}" <${process.env.EMAIL_FROM}>`,
    to: customer.email,
    subject: `Appointment Confirmed - ${business.name}`,
    html: `
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
          <p><strong>Duration:</strong> ${service.duration.value} ${service.duration.unit}</p>
        </div>
        
        ${zoomInfo}
        
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          If you need to reschedule or cancel, please log in to your account.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation sent to:', customer.email);
  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    throw new Error('Failed to send appointment confirmation');
  }
};
