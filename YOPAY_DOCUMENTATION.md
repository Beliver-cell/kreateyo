# Yopay - Universal Payment System

## Overview

Yopay is Kreateyo's integrated payment solution that works seamlessly across all business types: Blogging, E-commerce, and Services. Built on Flutterwave's payment infrastructure, Yopay provides a tiered fee structure that scales with your business.

## Tiered Fee Structure

### Solo Plan (3.5%)
- Perfect for individual creators and small businesses
- 3.5% platform fee on all transactions
- Plus standard Flutterwave fee (1.4%)
- Total: 4.9% per transaction

### Team Plan (2.0%)
- Designed for growing businesses with teams
- 2.0% platform fee on all transactions
- Plus standard Flutterwave fee (1.4%)
- Total: 3.4% per transaction
- **Save 1.5% compared to Solo**

### Enterprise Plan (0.5%)
- Built for high-volume businesses
- 0.5% platform fee on all transactions
- Plus standard Flutterwave fee (1.4%)
- Total: 1.9% per transaction
- **Save 3% compared to Solo**

## How It Works

### 1. Account Setup
```javascript
// Create Yopay account for a business
POST /api/businesses/:businessId/yopay/account
{
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankCode": "058",
    "bankName": "GTBank",
    "accountName": "John Doe"
  },
  "userTier": "solo" // or "team" or "enterprise"
}
```

### 2. Payment Processing Flow

1. **Customer initiates payment** on user's website
2. **Flutterwave checkout** modal opens with business branding
3. **Customer completes payment** using card, bank transfer, USSD, or mobile money
4. **Flutterwave deducts their fee** (1.4%)
5. **Platform deducts tiered fee** (0.5% - 3.5% based on plan)
6. **Business receives net amount** in their bank account

### 3. Fee Calculation

```javascript
// Example: ₦10,000 payment on Solo plan
Original Amount: ₦10,000
Flutterwave Fee (1.4%): -₦140
Platform Fee (3.5%): -₦350
Total Fees: -₦490
Business Receives: ₦9,510

// Same payment on Enterprise plan
Original Amount: ₦10,000
Flutterwave Fee (1.4%): -₦140
Platform Fee (0.5%): -₦50
Total Fees: -₦190
Business Receives: ₦9,810

Savings: ₦300 (60% less in fees!)
```

## Business-Type Specific Features

### Blogging Payments
```javascript
// Pay for premium article
Yopay.payForArticle({
  price: 1000,
  title: "Ultimate Guide to SEO"
}, {
  email: "customer@example.com",
  name: "Customer Name"
});

// Pay for subscription
Yopay.payForSubscription({
  name: "Premium Monthly",
  price: 5000
}, customer);

// Accept donation
Yopay.acceptDonation(2000, customer);
```

### E-commerce Payments
```javascript
// Pay for single product
Yopay.payForProduct({
  name: "Wireless Headphones",
  price: 15000
}, customer);

// Pay for cart
Yopay.payForCart({
  items: [
    { name: "Item 1", price: 5000, quantity: 2 },
    { name: "Item 2", price: 3000, quantity: 1 }
  ]
}, customer);
```

### Services Payments
```javascript
// Pay for service booking
Yopay.payForService({
  name: "60-Min Consultation",
  price: 20000
}, {
  date: "2024-03-15"
}, customer);

// Pay deposit
Yopay.payDeposit({
  name: "Website Design"
}, 10000, customer);
```

## Dashboard Features

### Revenue Overview
- **Total Revenue**: All payments received
- **Platform Fees**: Fees based on your tier
- **Flutterwave Fees**: Payment processing fees
- **Net Revenue**: Amount after all fees
- **Success Rate**: Payment completion rate

### Transaction Details
Each transaction shows:
- Customer information
- Payment amount
- Fee breakdown (Flutterwave + Platform)
- Net amount received
- Payment status
- Timestamp

### Fee Transparency
Every transaction displays:
```
Transaction Amount: ₦10,000
- Flutterwave Fee (1.4%): -₦140
- Platform Fee (3.5%): -₦350
= You Receive: ₦9,510
```

## Integration Guide

### Backend Setup

1. **Install dependencies**
```bash
npm install axios
```

2. **Configure environment variables**
```env
FLUTTERWAVE_PUBLIC_KEY=your-public-key
FLUTTERWAVE_SECRET_KEY=your-secret-key
FLUTTERWAVE_WEBHOOK_SECRET=your-webhook-secret
```

3. **Add Yopay routes to server**
```javascript
app.use('/api/businesses/:businessId/yopay', require('./routes/yopay'));
```

### Frontend Integration

1. **Add Yopay to your routes**
```javascript
import { YopayDashboard } from '@/components/yopay/YopayDashboard';

<Route path="/payments" element={<YopayDashboard />} />
```

2. **Use Yopay components**
```jsx
<YopayDashboard 
  businessId={businessId} 
  userTier={userTier} 
/>
```

### Website Integration

Add this script to customer-facing websites:
```html
<script src="https://checkout.flutterwave.com/v3.js"></script>
<script>
  // Yopay universal payment object will be injected automatically
  // when business sets up their website
</script>
```

## Webhook Handling

Set up webhook endpoint for payment notifications:
```javascript
POST /api/businesses/:businessId/yopay/webhook

// Verifies signature and processes payment status updates
```

## Supported Countries & Currencies

| Country | Currency | Code |
|---------|----------|------|
| Nigeria | Naira | NGN |
| Ghana | Cedis | GHS |
| Kenya | Shilling | KES |
| South Africa | Rand | ZAR |
| Uganda | Shilling | UGX |
| Tanzania | Shilling | TZS |

## Security Features

- **PCI DSS Compliant**: Flutterwave handles all payment data securely
- **Webhook Verification**: All webhook requests are verified with signature
- **Bank-Level Encryption**: All sensitive data encrypted in transit and at rest
- **Fraud Detection**: Built-in fraud detection by Flutterwave
- **Secure Subaccount System**: Automatic fund splitting and routing

## Upgrade Path

### From Solo to Team
```javascript
PUT /api/businesses/:businessId/yopay/tier
{
  "newTier": "team"
}
```

**Benefits:**
- Reduce fees from 3.5% to 2%
- Save ₦150 on every ₦10,000 transaction
- At ₦1,000,000 monthly revenue: Save ₦15,000/month

### From Team to Enterprise
```javascript
PUT /api/businesses/:businessId/yopay/tier
{
  "newTier": "enterprise"
}
```

**Benefits:**
- Reduce fees from 2% to 0.5%
- Save ₦150 on every ₦10,000 transaction
- At ₦10,000,000 monthly revenue: Save ₦150,000/month

## Testing

### Test Cards (Flutterwave)
```
Successful Payment:
Card: 5531 8866 5214 2950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345

Insufficient Funds:
Card: 5339 0800 0000 4058
CVV: 883
Expiry: 01/31
```

### Test API Calls
```bash
# Create test Yopay account
curl -X POST http://localhost:5000/api/businesses/123/yopay/account \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankDetails": {
      "accountNumber": "0690000031",
      "bankCode": "044",
      "bankName": "Access Bank"
    },
    "userTier": "solo"
  }'

# Test payment
curl -X POST http://localhost:5000/api/businesses/123/yopay/payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency": "NGN",
    "customer_email": "test@example.com",
    "customer_name": "Test Customer",
    "description": "Test Payment"
  }'
```

## Support

For Yopay-related issues:
1. Check transaction status in dashboard
2. Review webhook logs for failed payments
3. Verify bank account details are correct
4. Contact support: yopay-support@kreateyo.com

## Roadmap

### Coming Soon
- ✅ Recurring payments for subscriptions
- ✅ Split payments for marketplaces
- ✅ Pay later / Installments
- ✅ Multi-currency support expansion
- ✅ Advanced analytics and reporting
- ✅ Custom payout schedules

---

**Yopay by Kreateyo** - Simplifying payments for African businesses
