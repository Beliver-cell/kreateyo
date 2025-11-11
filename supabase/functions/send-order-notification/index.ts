import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  orderId: string;
  customerEmail: string;
  notificationType: 'order_confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'tracking_update';
  trackingNumber?: string;
  carrier?: string;
  orderDetails?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { orderId, customerEmail, notificationType, trackingNumber, carrier, orderDetails }: NotificationRequest = await req.json();

    // Log notification
    const { error: logError } = await supabaseClient
      .from("order_notifications")
      .insert({
        user_id: user.id,
        order_id: orderId,
        notification_type: notificationType,
        customer_email: customerEmail,
        tracking_number: trackingNumber,
        carrier: carrier,
        metadata: orderDetails || {}
      });

    if (logError) {
      console.error("Error logging notification:", logError);
    }

    // Check if Resend API key is configured
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured, notification logged but email not sent");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Notification logged (email service not configured)" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const emailContent = getEmailContent(notificationType, {
      orderId,
      trackingNumber,
      carrier,
      orderDetails
    });

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Orders <orders@resend.dev>",
        to: [customerEmail],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }

    // Update notification status
    await supabaseClient
      .from("order_notifications")
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('order_id', orderId)
      .eq('notification_type', notificationType);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-order-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getEmailContent(type: string, data: any) {
  const templates = {
    order_confirmed: {
      subject: `Order Confirmation - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Confirmed!</h1>
          <p>Thank you for your order. Your order #${data.orderId} has been confirmed and is being processed.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${data.orderId}</p>
          </div>
          <p>We'll send you another email when your order ships.</p>
        </div>
      `
    },
    shipped: {
      subject: `Your Order Has Shipped - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your Order Has Shipped!</h1>
          <p>Great news! Your order #${data.orderId} has been shipped.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Shipping Details</h3>
            <p><strong>Order Number:</strong> ${data.orderId}</p>
            ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
            ${data.carrier ? `<p><strong>Carrier:</strong> ${data.carrier}</p>` : ''}
          </div>
          <p>You can track your package using the tracking number above.</p>
        </div>
      `
    },
    out_for_delivery: {
      subject: `Out for Delivery - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Out for Delivery!</h1>
          <p>Your order #${data.orderId} is out for delivery and will arrive today.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tracking Number:</strong> ${data.trackingNumber || 'N/A'}</p>
          </div>
        </div>
      `
    },
    delivered: {
      subject: `Delivered - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Package Delivered!</h1>
          <p>Your order #${data.orderId} has been delivered.</p>
          <p>We hope you enjoy your purchase!</p>
        </div>
      `
    },
    tracking_update: {
      subject: `Tracking Update - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Tracking Update</h1>
          <p>There's an update on your order #${data.orderId}.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tracking Number:</strong> ${data.trackingNumber || 'N/A'}</p>
            ${data.carrier ? `<p><strong>Carrier:</strong> ${data.carrier}</p>` : ''}
          </div>
        </div>
      `
    }
  };

  return templates[type as keyof typeof templates] || templates.tracking_update;
}