# Kreateyo API Documentation v1.0

## Base URL
```
Production: https://api.kreateyo.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication

All authenticated endpoints require a JWT access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Token Lifecycle
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

---

## Core Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "isEmailVerified": false
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### POST /auth/refresh
Obtain new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

#### POST /auth/logout
Invalidate refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe",
      "avatar": "https://...",
      "isEmailVerified": true
    }
  }
}
```

---

### OAuth

#### GET /oauth/google
Initiate Google OAuth flow. Redirects to Google consent screen.

#### GET /oauth/google/callback
Google OAuth callback. Handles authentication and redirects to frontend with tokens.

---

### Businesses (Tenants)

#### POST /businesses
Create a new business/store.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "My Store",
  "type": "ecommerce",
  "accountType": "solo"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "business_id",
      "name": "My Store",
      "type": "ecommerce",
      "owner": "user_id",
      "subdomain": "mystore",
      "status": "active"
    }
  }
}
```

#### GET /businesses
List all businesses for authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "businesses": [...]
  }
}
```

#### GET /businesses/:id
Get specific business details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "business": { ... }
  }
}
```

---

### Products

#### GET /businesses/:businessId/products
List products for a business.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `search` (string): Search by name or description
- `category` (string): Filter by category
- `status` (string): Filter by status (active, draft, archived)
- `sort` (string): Sort field (default: -createdAt)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### POST /businesses/:businessId/products
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "inventory": 100,
  "images": ["url1", "url2"]
}
```

---

### Orders

#### GET /businesses/:businessId/orders
List orders for a business.

**Query Parameters:**
- `page`, `limit`, `status`, `sort` (same as products)
- `customer` (string): Filter by customer ID
- `startDate`, `endDate` (ISO date): Date range filter

#### POST /businesses/:businessId/orders
Create a new order.

#### PATCH /businesses/:businessId/orders/:orderId/status
Update order status.

---

### YoPay (Payments)

#### POST /businesses/:businessId/yopay/payment
Initiate a payment.

**Request Body:**
```json
{
  "amount": 10000,
  "currency": "NGN",
  "customerEmail": "customer@example.com",
  "customerName": "Jane Doe",
  "metadata": {
    "orderId": "order_123"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentLink": "https://checkout.flutterwave.com/...",
    "reference": "tx_ref_123"
  }
}
```

#### POST /yopay/webhook
Receive payment webhook from Flutterwave (public endpoint with signature verification).

#### GET /businesses/:businessId/yopay/transactions
List payment transactions.

#### GET /businesses/:businessId/yopay/balance
Get payout balance.

---

### Analytics

#### GET /businesses/:businessId/analytics
Get business analytics.

**Query Parameters:**
- `startDate`, `endDate` (ISO date): Date range
- `metrics` (string): Comma-separated metrics (revenue, orders, customers, conversion)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 50000,
      "trend": "+12%"
    },
    "orders": {
      "total": 150,
      "trend": "+8%"
    },
    "customers": {
      "total": 75,
      "new": 15
    }
  }
}
```

---

## Rate Limiting

- **Default**: 200 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Payment endpoints**: 100 requests per 15 minutes per IP

**Rate limit headers:**
```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 199
X-RateLimit-Reset: 1634567890
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `400` Bad Request - Invalid input
- `401` Unauthorized - Missing or invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `409` Conflict - Resource already exists
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

---

## Webhooks

### Webhook Security

All webhooks include a signature header for verification:
```
X-Webhook-Signature: sha256_signature
```

Verify using HMAC SHA256 with your webhook secret.

### Webhook Events

- `payment.success` - Payment completed
- `payment.failed` - Payment failed
- `order.created` - New order created
- `order.updated` - Order status changed

---

## Multitenancy / Subdomains

Tenant resolution happens via subdomain or custom domain:

**Subdomain access:**
```
https://mystore.kreateyo.com/api/user-sites/products
```

**Custom domain access:**
```
https://www.mystore.com/api/user-sites/products
```

The backend automatically resolves the tenant (business) from the host header and attaches it to `req.userSite`.

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store refresh tokens securely** (httpOnly cookies or secure storage)
3. **Implement token refresh** before access token expires
4. **Handle rate limits** with exponential backoff
5. **Verify webhook signatures** before processing
6. **Use idempotency keys** for payment requests
7. **Log all payment operations** for audit trails

---

## Support

For API support: support@kreateyo.com
