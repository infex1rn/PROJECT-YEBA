# PROJECT YEBA - DeepFold Design Marketplace

## 🎨 Overview

DeepFold is a comprehensive design marketplace platform built with Next.js 15, React 19, and TypeScript. It connects designers with buyers, enabling the sale and purchase of digital design assets including logos, posters, social media templates, business cards, and more.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Documentation](#documentation)
- [Contributing](#contributing)

## ✨ Features

### For Buyers
- **Browse Marketplace**: Explore thousands of premium designs across multiple categories
- **Advanced Search & Filtering**: Search by keywords, filter by category, price, and ratings
- **Design Preview**: View watermarked previews before purchasing
- **Shopping Cart**: Add multiple designs to cart for batch purchases
- **Secure Payments**: Multiple payment methods (Stripe, PayPal, Paystack)
- **Download Purchased Designs**: Access full resolution files after purchase
- **Review System**: Rate and review designers

### For Designers
- **Designer Registration**: Create professional designer profile with portfolio
- **Design Upload**: Upload designs with watermarked previews and full resolution files
- **Pricing Control**: Set custom prices for each design
- **Earnings Dashboard**: Track sales, downloads, and revenue
- **Withdrawal System**: Request payouts with multiple withdrawal methods
- **Profile Management**: Update bio, portfolio links, and specialties
- **Analytics**: View design performance metrics

### For Admins
- **Dashboard Overview**: Real-time statistics and analytics
- **User Management**: Manage buyers and designers, verify accounts
- **Design Moderation**: Approve, reject, or flag designs
- **Transaction Monitoring**: Track all platform transactions and payments
- **Withdrawal Management**: Approve or reject designer payout requests
- **Reports System**: Handle copyright violations and content reports
- **Settings Management**: Configure platform settings

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theming**: next-themes (dark/light mode)

### Backend (Planned)
- **Database**: PostgreSQL (schema defined)
- **Payment Processing**: Stripe, PayPal, Paystack
- **File Storage**: Cloud storage for design files
- **Authentication**: JWT-based auth system

## 📁 Project Structure

```
PROJECT-YEBA/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── marketplace/             # Marketplace pages
│   ├── designer-signup/         # Designer registration
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   └── admin/                   # Admin dashboard
│       ├── dashboard/           # Overview dashboard
│       ├── users/               # User management
│       ├── designs/             # Design moderation
│       ├── transactions/        # Payment tracking
│       ├── reports/             # Content reports
│       └── settings/            # Platform settings
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── header.tsx               # Main navigation
│   ├── footer.tsx               # Footer component
│   ├── marketplace.tsx          # Marketplace view
│   ├── designer-auth.tsx        # Designer auth forms
│   ├── admin-header.tsx         # Admin navigation
│   └── admin-sidebar.tsx        # Admin sidebar
├── lib/                         # Utility functions
├── hooks/                       # Custom React hooks
├── styles/                      # Global styles
├── scripts/                     # Database migration scripts
│   ├── 001_create_users_table.sql
│   ├── 002_create_designers_table.sql
│   ├── 003_create_buyers_table.sql
│   ├── 004_create_designs_table.sql
│   ├── 005_create_transactions_table.sql
│   ├── 006_create_reviews_table.sql
│   ├── 007_create_messages_table.sql
│   ├── 008_create_withdrawals_table.sql
│   ├── 009_create_triggers_and_functions.sql
│   └── 010_seed_sample_data.sql
├── public/                      # Static assets
└── DATABASE_SCHEMA.md           # Database documentation

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/infex1rn/PROJECT-YEBA.git
   cd PROJECT-YEBA
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/yeba_db
   
   # Authentication
   JWT_SECRET=your-secret-key-here
   
   # Payment Gateways
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   PAYPAL_CLIENT_ID=your-paypal-client-id
   PAYSTACK_SECRET_KEY=sk_test_...
   
   # File Storage
   CLOUDINARY_URL=cloudinary://...
   # or
   AWS_S3_BUCKET=your-bucket-name
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   ```

4. **Set up the database**
   ```bash
   # Run migration scripts in order
   psql -U postgres -d yeba_db -f scripts/001_create_users_table.sql
   psql -U postgres -d yeba_db -f scripts/002_create_designers_table.sql
   # ... run all scripts in order
   psql -U postgres -d yeba_db -f scripts/010_seed_sample_data.sql
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🗄 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: Base authentication and user management (buyers, designers, admins)
- **designers**: Extended profile for design sellers
- **buyers**: Extended profile for design purchasers
- **designs**: Marketplace products/listings
- **transactions**: Purchase records and payment tracking
- **reviews**: Designer ratings and feedback
- **messages**: User-to-user communication
- **withdrawals**: Designer earnings withdrawal requests

For detailed schema information, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## 👥 User Roles

### Buyer
- Browse and search designs
- Purchase designs
- Download purchased files
- Review designers
- Message designers

### Designer
- Create and manage profile
- Upload and price designs
- Track sales and earnings
- Request withdrawals
- Respond to messages

### Admin
- Manage all users
- Moderate designs
- Monitor transactions
- Handle reports
- Configure platform settings
- Approve withdrawals

## 📚 Documentation

- [API Calls & Endpoints](./API-CALLS.md) - API integration patterns and endpoints
- [Application Routes](./ROUTES.md) - Complete route structure and navigation
- [Features List](./FEATURES.md) - Detailed feature documentation
- [New Feature Suggestions](./NEW-FEATURES.md) - Proposed improvements and additions
- [Upgrade Recommendations](./UPGRADE-RECOMMENDATIONS.md) - Technical improvements
- [Database Schema](./DATABASE_SCHEMA.md) - Database structure and relationships

## 🎯 Key Features in Development

Currently, the frontend is fully implemented with:
- Complete UI/UX for all user roles
- Responsive design for mobile and desktop
- Dark/light theme support
- Form validation and error handling
- Mock data for development and testing

**Next Steps**:
- API endpoint implementation
- Database integration
- Payment gateway integration
- File upload and storage
- Authentication system
- Real-time messaging
- Email notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is currently private. All rights reserved.

## 👨‍💻 Development Team

- **Project**: PROJECT-YEBA
- **Platform**: DeepFold Design Marketplace
- **Repository**: infex1rn/PROJECT-YEBA

## 🔗 Links

- **Live Demo**: Coming soon
- **Documentation**: See `/docs` directory
- **Issue Tracker**: GitHub Issues

## 💡 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, React, and TypeScript**
