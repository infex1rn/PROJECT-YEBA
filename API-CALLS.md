# API Calls & Endpoints Documentation

## Overview

This document outlines all API endpoints, their purposes, request/response formats, and integration patterns for the DeepFold Design Marketplace platform.

## Table of Contents

- [Authentication APIs](#authentication-apis)
- [User Management APIs](#user-management-apis)
- [Design APIs](#design-apis)
- [Transaction APIs](#transaction-apis)
- [Review APIs](#review-apis)
- [Message APIs](#message-apis)
- [Withdrawal APIs](#withdrawal-apis)
- [Admin APIs](#admin-apis)
- [File Upload APIs](#file-upload-apis)
- [Payment Gateway Integration](#payment-gateway-integration)

---

## Authentication APIs

### 1. User Registration (Buyer)

**Endpoint**: `POST /api/auth/register/buyer`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "jwt_token_here"
}
```

### 2. Designer Registration

**Endpoint**: `POST /api/auth/register/designer`

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "bio": "Professional graphic designer with 5 years experience",
  "portfolioUrl": "https://portfolio.com",
  "specialties": ["Logo Design", "Branding", "UI/UX Design"],
  "profileImage": "base64_or_url"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "designer"
  },
  "designer": {
    "bio": "Professional graphic designer...",
    "portfolioLink": "https://portfolio.com",
    "rating": 0,
    "earnings": 0
  },
  "token": "jwt_token_here"
}
```

### 3. User Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "jwt_token_here"
}
```

### 4. Admin Login

**Endpoint**: `POST /api/auth/admin/login`

**Request Body**:
```json
{
  "email": "admin@deepfold.com",
  "password": "admin_password"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@deepfold.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

### 5. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 6. Refresh Token

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response**:
```json
{
  "success": true,
  "token": "new_jwt_token_here"
}
```

---

## User Management APIs

### 1. Get User Profile

**Endpoint**: `GET /api/users/:userId`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Update User Profile

**Endpoint**: `PUT /api/users/:userId`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### 3. Get Designer Profile

**Endpoint**: `GET /api/designers/:designerId`

**Response**:
```json
{
  "success": true,
  "designer": {
    "id": 2,
    "name": "Jane Smith",
    "bio": "Professional graphic designer...",
    "portfolioLink": "https://portfolio.com",
    "rating": 4.8,
    "totalDesigns": 45,
    "totalSales": 234,
    "earnings": 5430.50,
    "specialties": ["Logo Design", "Branding"],
    "memberSince": "2024-01-08"
  }
}
```

### 4. Update Designer Profile

**Endpoint**: `PUT /api/designers/:designerId`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "bio": "Updated bio text",
  "portfolioLink": "https://newportfolio.com",
  "specialties": ["Logo Design", "UI/UX", "Illustration"]
}
```

---

## Design APIs

### 1. Get All Designs (Marketplace)

**Endpoint**: `GET /api/designs`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `search`: Search query
- `sortBy`: Sort field (popular, newest, price-low, price-high, rating)

**Example**: `GET /api/designs?category=Logos&sortBy=popular&page=1&limit=20`

**Response**:
```json
{
  "success": true,
  "designs": [
    {
      "id": 1,
      "title": "Modern Logo Collection",
      "description": "A collection of 10 modern minimalist logos",
      "category": "Logos",
      "price": 25.00,
      "designer": {
        "id": 2,
        "name": "Jane Smith",
        "rating": 4.8
      },
      "watermarkedPreviewUrl": "https://storage.com/previews/design1.jpg",
      "downloads": 156,
      "rating": 4.8,
      "tags": ["modern", "minimalist", "logo"],
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  }
}
```

### 2. Get Single Design

**Endpoint**: `GET /api/designs/:designId`

**Response**:
```json
{
  "success": true,
  "design": {
    "id": 1,
    "title": "Modern Logo Collection",
    "description": "A collection of 10 modern minimalist logos",
    "category": "Logos",
    "price": 25.00,
    "designer": {
      "id": 2,
      "name": "Jane Smith",
      "rating": 4.8,
      "bio": "Professional designer..."
    },
    "watermarkedPreviewUrl": "https://storage.com/previews/design1.jpg",
    "downloads": 156,
    "rating": 4.8,
    "reviews": 23,
    "tags": ["modern", "minimalist", "logo"],
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

### 3. Upload Design

**Endpoint**: `POST /api/designs`

**Headers**: `Authorization: Bearer {token}`

**Content-Type**: `multipart/form-data`

**Request Body**:
```json
{
  "title": "Modern Logo Collection",
  "description": "A collection of 10 modern minimalist logos",
  "category": "Logos",
  "price": 25.00,
  "tags": ["modern", "minimalist", "logo"],
  "designFile": "file_upload",
  "previewImage": "file_upload"
}
```

**Response**:
```json
{
  "success": true,
  "design": {
    "id": 45,
    "title": "Modern Logo Collection",
    "status": "pending",
    "fileUrl": "https://storage.com/designs/design45.zip",
    "watermarkedPreviewUrl": "https://storage.com/previews/design45.jpg"
  }
}
```

### 4. Update Design

**Endpoint**: `PUT /api/designs/:designId`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 30.00,
  "tags": ["updated", "tags"]
}
```

### 5. Delete Design

**Endpoint**: `DELETE /api/designs/:designId`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "message": "Design deleted successfully"
}
```

### 6. Get Designer's Designs

**Endpoint**: `GET /api/designers/:designerId/designs`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "designs": [
    {
      "id": 1,
      "title": "Modern Logo Collection",
      "status": "approved",
      "price": 25.00,
      "downloads": 156,
      "revenue": 3900.00,
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ]
}
```

---

## Transaction APIs

### 1. Create Transaction (Purchase)

**Endpoint**: `POST /api/transactions`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "designId": 1,
  "paymentMethod": "stripe",
  "paymentToken": "tok_visa_token_here"
}
```

**Response**:
```json
{
  "success": true,
  "transaction": {
    "id": 123,
    "designId": 1,
    "amount": 25.00,
    "status": "completed",
    "downloadUrl": "https://storage.com/designs/design1.zip",
    "createdAt": "2024-03-20T15:30:00Z"
  }
}
```

### 2. Get User Transactions

**Endpoint**: `GET /api/users/:userId/transactions`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "id": 123,
      "design": {
        "id": 1,
        "title": "Modern Logo Collection"
      },
      "amount": 25.00,
      "status": "completed",
      "downloadUrl": "https://storage.com/designs/design1.zip",
      "purchaseDate": "2024-03-20T15:30:00Z"
    }
  ]
}
```

### 3. Download Purchased Design

**Endpoint**: `GET /api/transactions/:transactionId/download`

**Headers**: `Authorization: Bearer {token}`

**Response**: Binary file download or redirect to signed URL

---

## Review APIs

### 1. Submit Review

**Endpoint**: `POST /api/reviews`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "designerId": 2,
  "rating": 5,
  "comment": "Excellent work! Very professional and responsive."
}
```

**Response**:
```json
{
  "success": true,
  "review": {
    "id": 45,
    "designerId": 2,
    "rating": 5,
    "comment": "Excellent work!...",
    "createdAt": "2024-03-20T16:00:00Z"
  }
}
```

### 2. Get Designer Reviews

**Endpoint**: `GET /api/designers/:designerId/reviews`

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page

**Response**:
```json
{
  "success": true,
  "reviews": [
    {
      "id": 45,
      "buyer": {
        "id": 1,
        "name": "John Doe"
      },
      "rating": 5,
      "comment": "Excellent work!...",
      "createdAt": "2024-03-20T16:00:00Z"
    }
  ],
  "averageRating": 4.8,
  "totalReviews": 23
}
```

---

## Message APIs

### 1. Send Message

**Endpoint**: `POST /api/messages`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "receiverId": 2,
  "message": "Hello, I'm interested in your design services."
}
```

**Response**:
```json
{
  "success": true,
  "message": {
    "id": 78,
    "senderId": 1,
    "receiverId": 2,
    "message": "Hello, I'm interested...",
    "timestamp": "2024-03-20T17:00:00Z"
  }
}
```

### 2. Get Conversations

**Endpoint**: `GET /api/messages/conversations`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "conversations": [
    {
      "userId": 2,
      "userName": "Jane Smith",
      "lastMessage": "Thank you for your interest!",
      "lastMessageTime": "2024-03-20T17:05:00Z",
      "unreadCount": 2
    }
  ]
}
```

### 3. Get Messages with User

**Endpoint**: `GET /api/messages/:userId`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "messages": [
    {
      "id": 78,
      "senderId": 1,
      "receiverId": 2,
      "message": "Hello, I'm interested...",
      "timestamp": "2024-03-20T17:00:00Z"
    },
    {
      "id": 79,
      "senderId": 2,
      "receiverId": 1,
      "message": "Thank you for your interest!",
      "timestamp": "2024-03-20T17:05:00Z"
    }
  ]
}
```

---

## Withdrawal APIs

### 1. Request Withdrawal

**Endpoint**: `POST /api/withdrawals`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "amount": 450.00,
  "method": "bank_transfer",
  "accountDetails": {
    "bankName": "Bank of America",
    "accountNumber": "****1234",
    "routingNumber": "****5678"
  }
}
```

**Response**:
```json
{
  "success": true,
  "withdrawal": {
    "id": 12,
    "amount": 450.00,
    "status": "pending",
    "method": "bank_transfer",
    "requestDate": "2024-03-20T18:00:00Z"
  }
}
```

### 2. Get Withdrawal History

**Endpoint**: `GET /api/designers/:designerId/withdrawals`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "success": true,
  "withdrawals": [
    {
      "id": 12,
      "amount": 450.00,
      "status": "pending",
      "method": "bank_transfer",
      "requestDate": "2024-03-20T18:00:00Z"
    }
  ],
  "availableBalance": 320.50,
  "pendingWithdrawals": 450.00
}
```

---

## Admin APIs

### 1. Get Dashboard Stats

**Endpoint**: `GET /api/admin/dashboard/stats`

**Headers**: `Authorization: Bearer {token}` (Admin only)

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1234,
    "totalDesigners": 456,
    "totalBuyers": 778,
    "totalDesigns": 5678,
    "totalRevenue": 45231.50,
    "pendingWithdrawals": 8450.00,
    "pendingDesigns": 23,
    "flaggedDesigns": 5
  }
}
```

### 2. Get All Users (Admin)

**Endpoint**: `GET /api/admin/users`

**Headers**: `Authorization: Bearer {token}` (Admin only)

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `role`: Filter by role (buyer/designer)
- `status`: Filter by status (active/suspended/banned)

**Response**:
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer",
      "status": "active",
      "verified": true,
      "dateJoined": "2024-01-15",
      "totalSpent": 890.00
    }
  ]
}
```

### 3. Update User Status (Admin)

**Endpoint**: `PUT /api/admin/users/:userId/status`

**Headers**: `Authorization: Bearer {token}` (Admin only)

**Request Body**:
```json
{
  "status": "suspended",
  "reason": "Violation of terms of service"
}
```

### 4. Moderate Design (Admin)

**Endpoint**: `PUT /api/admin/designs/:designId/moderate`

**Headers**: `Authorization: Bearer {token}` (Admin only)

**Request Body**:
```json
{
  "action": "approve",
  "notes": "Design meets quality standards"
}
```

**Actions**: `approve`, `reject`, `flag`, `remove`

### 5. Approve/Reject Withdrawal (Admin)

**Endpoint**: `PUT /api/admin/withdrawals/:withdrawalId`

**Headers**: `Authorization: Bearer {token}` (Admin only)

**Request Body**:
```json
{
  "action": "approve",
  "notes": "Withdrawal approved and processed"
}
```

**Actions**: `approve`, `reject`, `complete`

### 6. Get Reports (Admin)

**Endpoint**: `GET /api/admin/reports`

**Headers**: `Authorization: Bearer {token}` (Admin only)

**Response**:
```json
{
  "success": true,
  "reports": [
    {
      "id": 1,
      "type": "copyright",
      "targetType": "design",
      "targetId": 1234,
      "reportedBy": {
        "id": 5,
        "name": "Reporter Name"
      },
      "reason": "Copyright violation",
      "status": "pending",
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

---

## File Upload APIs

### 1. Upload Design Files

**Endpoint**: `POST /api/upload/design`

**Headers**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request**: Form data with file

**Response**:
```json
{
  "success": true,
  "fileUrl": "https://storage.com/designs/design123.zip",
  "fileSize": 2048576,
  "fileName": "design123.zip"
}
```

### 2. Upload Preview Image

**Endpoint**: `POST /api/upload/preview`

**Headers**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Response**:
```json
{
  "success": true,
  "imageUrl": "https://storage.com/previews/preview123.jpg",
  "watermarkedUrl": "https://storage.com/previews/watermarked123.jpg"
}
```

### 3. Upload Profile Image

**Endpoint**: `POST /api/upload/profile`

**Headers**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Response**:
```json
{
  "success": true,
  "imageUrl": "https://storage.com/profiles/user123.jpg"
}
```

---

## Payment Gateway Integration

### Stripe Integration

**Client-Side**: Create payment intent
```javascript
// Frontend code
const response = await fetch('/api/payment/stripe/create-intent', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    designId: 1,
    amount: 2500 // in cents
  })
});

const { clientSecret } = await response.json();

// Use Stripe.js to confirm payment
const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: 'John Doe' }
  }
});
```

**Webhook Endpoint**: `POST /api/webhooks/stripe`

Handles payment confirmation and updates transaction status.

### PayPal Integration

**Endpoint**: `POST /api/payment/paypal/create-order`

**Request**:
```json
{
  "designId": 1,
  "amount": 25.00
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "paypal_order_id",
  "approvalUrl": "https://paypal.com/checkoutnow?token=..."
}
```

**Capture Payment**: `POST /api/payment/paypal/capture-order`

### Paystack Integration

**Endpoint**: `POST /api/payment/paystack/initialize`

**Request**:
```json
{
  "designId": 1,
  "email": "buyer@example.com",
  "amount": 2500000 // in kobo (25,000 NGN)
}
```

**Response**:
```json
{
  "success": true,
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "access_code_here",
  "reference": "ref_123456"
}
```

**Webhook Endpoint**: `POST /api/webhooks/paystack`

---

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "DESIGN_NOT_FOUND",
    "message": "The requested design could not be found",
    "statusCode": 404
  }
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Rate Limiting

API rate limits:
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour
- **File uploads**: 50 uploads per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1710950400
```

---

## Authentication

Most endpoints require JWT authentication via Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expiration: 24 hours (can be refreshed using refresh token)

---

## API Versioning

Current API version: `v1`

All endpoints are prefixed with `/api/v1/` for future versioning support.

Example: `https://api.deepfold.com/api/v1/designs`

---

**Note**: This documentation represents the planned API structure. Implementation is in progress.
