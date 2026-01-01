# Application Routes Documentation

## Overview

This document provides a comprehensive mapping of all routes in the DeepFold Design Marketplace application, including public pages, protected routes, and admin areas.

## Table of Contents

- [Public Routes](#public-routes)
- [Authentication Routes](#authentication-routes)
- [Buyer Routes](#buyer-routes)
- [Designer Routes](#designer-routes)
- [Admin Routes](#admin-routes)
- [API Routes](#api-routes)
- [Route Protection](#route-protection)

---

## Public Routes

These routes are accessible to all visitors without authentication.

### Home & Marketing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page with featured designs, categories, and top designers |
| `/about` | `app/about/page.tsx` | About DeepFold platform |
| `/contact` | `app/contact/page.tsx` | Contact form and support information |
| `/marketplace` | `app/marketplace/page.tsx` | Browse all available designs with search and filters |

**Key Features**:
- **Home Page** (`/`):
  - Hero section with CTA buttons
  - Browse by category (Logos, Posters, T-Shirts, Social Media, Business Cards)
  - Featured designs showcase
  - Top designers section
  - Call-to-action for joining platform

- **Marketplace** (`/marketplace`):
  - Advanced search functionality
  - Category filters (All, Logos, Templates, Print, UI/UX, Icons, Illustrations)
  - Sort options (Most Popular, Newest, Price: Low to High, Price: High to Low, Highest Rated)
  - Design cards with preview, price, designer info, and ratings
  - Add to favorites and cart functionality
  - Pagination support

- **About** (`/about`):
  - Platform mission and vision
  - Team information
  - Platform statistics

- **Contact** (`/contact`):
  - Contact form (Name, Email, Message)
  - Support information
  - Form validation and submission

---

## Authentication Routes

Routes for user registration and login.

### General Authentication

| Route | Component | Description |
|-------|-----------|-------------|
| `/designer-signup` | `app/designer-signup/page.tsx` | Designer registration and login |
| `/buyer-signup` | Future | Buyer registration (can use general signup) |
| `/login` | Future | General user login |
| `/forgot-password` | Future | Password recovery |
| `/reset-password/:token` | Future | Password reset with token |

**Designer Signup** (`/designer-signup`):
- Toggle between Sign In and Sign Up modes
- **Sign Up Fields**:
  - First Name & Last Name
  - Profile Image upload (optional)
  - Email
  - Password & Confirm Password
  - Bio (500 character limit)
  - Portfolio URL (optional)
  - Design Specialties (multi-select):
    - Logo Design
    - Web Design
    - Print Design
    - Illustration
    - Typography
    - Branding
    - UI/UX Design
    - Social Media Graphics
    - Packaging Design
    - T-Shirt Design
    - Poster Design
    - Icon Design
  - Terms of Service agreement
- **Sign In Fields**:
  - Email
  - Password
  - Forgot password link
- Form validation with error messages
- Loading states during submission

### Admin Authentication

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/login` | `app/admin/login/page.tsx` | Admin-specific login page |

---

## Buyer Routes

Protected routes for authenticated buyers.

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/buyer/dashboard` | Future | Buyer dashboard with purchased designs | Planned |
| `/buyer/profile` | Future | Edit buyer profile | Planned |
| `/buyer/purchases` | Future | View purchase history | Planned |
| `/buyer/favorites` | Future | Saved/favorited designs | Planned |
| `/buyer/cart` | Future | Shopping cart | Planned |
| `/buyer/checkout` | Future | Checkout process | Planned |
| `/buyer/downloads` | Future | Access downloaded files | Planned |
| `/buyer/messages` | Future | Message inbox with designers | Planned |

**Planned Features**:
- Dashboard with recent purchases
- Quick access to downloads
- Favorites/wishlist management
- Order history with receipts
- Designer messaging system
- Profile settings

---

## Designer Routes

Protected routes for authenticated designers.

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/designer/dashboard` | Future | Designer dashboard with analytics | Planned |
| `/designer/designs` | Future | Manage uploaded designs | Planned |
| `/designer/designs/new` | Future | Upload new design | Planned |
| `/designer/designs/:id/edit` | Future | Edit existing design | Planned |
| `/designer/earnings` | Future | View earnings and analytics | Planned |
| `/designer/withdrawals` | Future | Request and manage withdrawals | Planned |
| `/designer/profile` | Future | Edit designer profile | Planned |
| `/designer/reviews` | Future | View received reviews | Planned |
| `/designer/messages` | Future | Message inbox with buyers | Planned |

**Planned Features**:
- Dashboard with:
  - Total earnings
  - Total designs
  - Total downloads
  - Average rating
  - Recent sales chart
  - Top performing designs
- Design management:
  - Upload with drag & drop
  - Edit title, description, price, tags
  - View status (pending, approved, rejected)
  - Delete designs
- Analytics:
  - Sales trends
  - Download statistics
  - Revenue breakdown
- Withdrawal system:
  - Request payout
  - View withdrawal history
  - Multiple payment methods

---

## Admin Routes

Protected routes for admin users with special permissions.

### Admin Layout

All admin routes share a common layout with sidebar navigation and header.

**Layout Component**: `app/admin/layout.tsx`
- Admin header with user info
- Sidebar navigation
- Main content area
- Theme toggle

### Admin Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Admin dashboard overview |
| `/admin/users` | `app/admin/users/page.tsx` | User management |
| `/admin/designs` | `app/admin/designs/page.tsx` | Design moderation |
| `/admin/transactions` | `app/admin/transactions/page.tsx` | Transaction monitoring |
| `/admin/reports` | `app/admin/reports/page.tsx` | Content reports |
| `/admin/settings` | `app/admin/settings/page.tsx` | Platform settings |

#### Admin Dashboard (`/admin/dashboard`)

**Features**:
- Statistics cards:
  - Total Users (+12% from last month)
  - Total Designs (+8% from last month)
  - Total Revenue (+15% from last month)
  - Pending Withdrawals (count and amount)
- Charts:
  - Monthly New Users (line chart, 6 months)
  - Monthly Sales (bar chart, 6 months)
- Quick alerts:
  - Latest Reports (copyright violations, inappropriate content)
  - Flagged Designs (pending moderation)
  - Pending Approvals (designer verification, withdrawal requests)

#### User Management (`/admin/users`)

**Features**:
- User statistics cards:
  - Total Users
  - Total Designers
  - Total Buyers
  - Suspended/Banned users
- Search and filters:
  - Search by name or email
  - Filter by role (All, Designer, Buyer)
  - Filter by status (All, Active, Suspended, Banned, Pending)
- User table columns:
  - User (name and email)
  - Role (Designer/Buyer badge)
  - Status (Active/Suspended/Banned/Pending)
  - Date Joined
  - Verified (checkmark icon)
  - Activity (earnings or spending)
  - Actions dropdown
- User actions:
  - View Profile
  - Verify Designer
  - Suspend Account
  - Reactivate Account
  - Ban User
- User profile dialog:
  - Detailed user information
  - Admin notes section
  - Quick actions

#### Design Management (`/admin/designs`)

**Features**:
- Design statistics cards:
  - Total Designs
  - Approved
  - Pending
  - Flagged
  - Rejected
- Search and filters:
  - Search by title or designer
  - Filter by category
  - Filter by status (All, Approved, Pending, Flagged, Rejected)
- Design table columns:
  - Design (thumbnail, title, ID)
  - Category badge
  - Price
  - Designer name
  - Status badge
  - Date Uploaded
  - Performance (downloads and revenue)
  - Actions dropdown
- Design actions:
  - View Details
  - Download Files
  - Approve
  - Reject
  - Flag Design
  - Remove Design
- Design details dialog:
  - Large preview image
  - Design metadata
  - Admin notes
  - Quick moderation actions

#### Transactions (`/admin/transactions`)

**Features**:
- Two tabs: Transactions and Withdrawals
- Transaction statistics:
  - Total Revenue
  - Platform Commission
  - Pending Withdrawals
  - Failed Transactions
- **Transactions Tab**:
  - Search by buyer, designer, design, or transaction ID
  - Filter by status
  - Export to CSV option
  - Transaction table columns:
    - Transaction ID
    - Buyer
    - Designer
    - Design
    - Amount
    - Commission
    - Status
    - Date
    - Actions
  - Transaction details dialog
- **Withdrawals Tab**:
  - Withdrawal table columns:
    - Request ID
    - Designer
    - Amount
    - Method
    - Transactions count
    - Status
    - Request Date
    - Actions
  - Quick approval/rejection actions
  - Mark as completed

#### Reports (`/admin/reports`)

**Features** (Planned):
- Report types:
  - Copyright violations
  - Inappropriate content
  - Spam
  - Other issues
- Report status management
- Quick actions to handle reports
- Link to reported content

#### Settings (`/admin/settings`)

**Features** (Planned):
- Platform configuration:
  - Commission rate
  - Minimum withdrawal amount
  - Payment gateway settings
  - Email notification settings
  - Category management
  - Featured designs management

---

## API Routes

RESTful API endpoints for backend operations.

### Planned API Structure

All API routes will be under `/api/` prefix.

```
/api/
  /auth/
    /register/buyer
    /register/designer
    /login
    /logout
    /refresh
  /users/
    /:userId
    /:userId/transactions
  /designers/
    /:designerId
    /:designerId/designs
    /:designerId/reviews
    /:designerId/withdrawals
  /designs/
    /
    /:designId
  /transactions/
    /
    /:transactionId/download
  /reviews/
    /
  /messages/
    /
    /conversations
    /:userId
  /withdrawals/
    /
  /admin/
    /dashboard/stats
    /users
    /users/:userId/status
    /designs/:designId/moderate
    /withdrawals/:withdrawalId
    /reports
  /upload/
    /design
    /preview
    /profile
  /payment/
    /stripe/create-intent
    /paypal/create-order
    /paypal/capture-order
    /paystack/initialize
  /webhooks/
    /stripe
    /paystack
```

For detailed API documentation, see [API-CALLS.md](./API-CALLS.md)

---

## Route Protection

### Authentication Middleware

Routes are protected using middleware that checks for valid JWT tokens.

**Public Routes** (no authentication required):
- `/`
- `/about`
- `/contact`
- `/marketplace`
- `/designer-signup`
- `/admin/login`

**Protected Routes** (authentication required):
- All `/buyer/*` routes - require `role: buyer`
- All `/designer/*` routes - require `role: designer`
- All `/admin/*` routes (except `/admin/login`) - require `role: admin`

### Route Guards

**Implementation Pattern**:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  // Check if route requires authentication
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token || !verifyAdminRole(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (pathname.startsWith('/designer')) {
    if (!token || !verifyDesignerRole(token)) {
      return NextResponse.redirect(new URL('/designer-signup', request.url))
    }
  }

  if (pathname.startsWith('/buyer')) {
    if (!token || !verifyBuyerRole(token)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}
```

### Role-Based Access Control (RBAC)

| Role | Access Level | Routes |
|------|--------------|--------|
| **Guest** | Public only | `/`, `/about`, `/contact`, `/marketplace`, `/designer-signup` |
| **Buyer** | Buyer + Public | All guest routes + `/buyer/*` |
| **Designer** | Designer + Public | All guest routes + `/designer/*` |
| **Admin** | Full access | All routes including `/admin/*` |

---

## Navigation Structure

### Main Header Navigation

**For Guests**:
- Home (`/`)
- Marketplace (`/marketplace`)
- About (`/about`)
- Contact (`/contact`)
- Log In (→ `/admin/login` or `/designer-signup`)

**For Authenticated Buyers**:
- Home (`/`)
- Marketplace (`/marketplace`)
- Dashboard (`/buyer/dashboard`)
- Purchases (`/buyer/purchases`)
- Cart (`/buyer/cart`)
- Profile (dropdown)

**For Authenticated Designers**:
- Home (`/`)
- Marketplace (`/marketplace`)
- Dashboard (`/designer/dashboard`)
- My Designs (`/designer/designs`)
- Earnings (`/designer/earnings`)
- Profile (dropdown)

### Admin Sidebar Navigation

**Categories**:
- Dashboard (`/admin/dashboard`)
- Users (`/admin/users`)
- Designs (`/admin/designs`)
- Transactions (`/admin/transactions`)
- Reports (`/admin/reports`)
- Settings (`/admin/settings`)

---

## Dynamic Routes

### Parameterized Routes (Planned)

| Route Pattern | Example | Description |
|---------------|---------|-------------|
| `/designs/:id` | `/designs/123` | View single design details |
| `/designers/:id` | `/designers/456` | View designer profile |
| `/buyer/purchases/:id` | `/buyer/purchases/789` | View specific purchase |
| `/designer/designs/:id/edit` | `/designer/designs/123/edit` | Edit specific design |

---

## Redirects

### Automatic Redirects

- Authenticated users visiting `/admin/login` → `/admin/dashboard`
- Authenticated designers visiting `/designer-signup` → `/designer/dashboard`
- Unauthenticated users visiting protected routes → Login page

---

## 404 & Error Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `*` (catch-all) | Future | 404 Not Found page |
| `/error` | Future | General error page |
| `/403` | Future | Forbidden access page |

---

## Breadcrumb Navigation

**Planned Implementation**:

```
Home > Marketplace > Logos > Modern Logo Collection
Home > Admin > Users > John Doe
Home > Designer > Designs > Edit Design
```

---

## Deep Linking

Support for deep links to specific content:

- Share design: `deepfold.com/designs/123`
- Share designer profile: `deepfold.com/designers/456`
- Direct to category: `deepfold.com/marketplace?category=Logos`
- Direct to search: `deepfold.com/marketplace?search=minimalist`

---

## Route State Management

Routes can accept state parameters for improved UX:

```typescript
// Navigate with state
router.push('/buyer/checkout', { 
  state: { designIds: [1, 2, 3] } 
})

// Navigate with query parameters
router.push('/marketplace?category=Logos&sort=popular&page=2')
```

---

## SEO-Friendly URLs

All routes are designed to be SEO-friendly:

- Descriptive paths: `/marketplace` instead of `/m`
- Semantic structure: `/designer/dashboard` instead of `/d/123`
- Clean URLs without unnecessary parameters
- Support for meta tags and Open Graph tags

---

**Note**: Routes marked as "Future" or "Planned" are part of the development roadmap and will be implemented in upcoming iterations.
