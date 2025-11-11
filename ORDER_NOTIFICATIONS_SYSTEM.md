# Order Notifications System

Automated customer notification system for shipping updates, tracking numbers, and delivery confirmations for both physical products and dropshipping orders.

## Features

### 1. Automated Email Notifications
- **Order Confirmed**: Sent immediately after order placement
- **Shipped**: Triggered when order status changes to 'shipped'
- **Out for Delivery**: Notification when package is out for delivery
- **Delivered**: Confirmation when package is delivered
- **Tracking Update**: General tracking updates

### 2. Notification Tracking
- All notifications are logged in `order_notifications` table
- Status tracking (pending, sent, failed)
- Failure error messages stored for debugging
- Timestamp tracking for sent notifications

### 3. Edge Function

**File**: `supabase/functions/send-order-notification/index.ts`

**Endpoint**: `/functions/v1/send-order-notification`

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "orderId": "string",
  "customerEmail": "string",
  "notificationType": "order_confirmed|shipped|out_for_delivery|delivered|tracking_update",
  "trackingNumber": "string (optional)",
  "carrier": "string (optional)",
  "orderDetails": {} // optional metadata
}
```

**Response**:
```json
{
  "success": true,
  "message": "Notification sent successfully"
}
```

### 4. Email Configuration

The system requires a `RESEND_API_KEY` to be configured in Supabase secrets for sending emails.

**Setup Steps**:
1. Create account at https://resend.com
2. Verify your email domain at https://resend.com/domains
3. Create API key at https://resend.com/api-keys
4. Add `RESEND_API_KEY` to Supabase secrets

### 5. Integration Examples

#### Trigger notification after order creation:
```typescript
import { supabase } from "@/integrations/supabase/client";

// After creating an order
const { data, error } = await supabase.functions.invoke('send-order-notification', {
  body: {
    orderId: order.id,
    customerEmail: customer.email,
    notificationType: 'order_confirmed',
    orderDetails: {
      items: order.items,
      total: order.total
    }
  }
});
```

#### Trigger notification after shipping:
```typescript
const { data, error } = await supabase.functions.invoke('send-order-notification', {
  body: {
    orderId: order.id,
    customerEmail: customer.email,
    notificationType: 'shipped',
    trackingNumber: 'TRACK123456',
    carrier: 'FedEx'
  }
});
```

### 6. Database Schema

**Table**: `order_notifications`

```sql
CREATE TABLE public.order_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_id TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### 7. Email Templates

Each notification type has a customized HTML email template:
- Professional styling with inline CSS
- Order details displayed in cards
- Tracking information highlighted
- Responsive design for all devices

## Usage Flow

1. **Order Placement**: 
   - Customer places order
   - System creates order in database
   - Automatically trigger `order_confirmed` notification

2. **Order Processing**:
   - When seller marks order as shipped
   - Update order status to 'shipped'
   - Trigger `shipped` notification with tracking info

3. **Tracking Updates**:
   - Monitor carrier tracking updates
   - Send `tracking_update` or `out_for_delivery` notifications
   - Final `delivered` notification when complete

## Benefits

- **Improved Customer Experience**: Keep customers informed at every step
- **Reduced Support Tickets**: Automated updates reduce "where is my order?" inquiries
- **Professional Communication**: Branded, professional email notifications
- **Complete Audit Trail**: All notifications logged with status tracking
- **Flexible Integration**: Easy to integrate with any order management system

## Future Enhancements

- SMS notifications via Twilio
- Push notifications
- Customizable email templates per business
- Multi-language support
- Notification preferences per customer
- Webhook support for carrier tracking APIs
