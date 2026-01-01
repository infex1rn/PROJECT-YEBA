# DeepFold Backend API

Backend API for the DeepFold Design Marketplace built with Express.js, TypeScript, and Prisma.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator, Zod
- **Security**: helmet, cors, bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (or npm/yarn)

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/yeba_db"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   The API will be available at `http://localhost:5000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/                # SQL migration files (legacy)
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.ts    # Prisma client setup
│   │   └── index.ts       # App configuration
│   ├── controllers/       # Request handlers (future)
│   ├── middleware/        # Express middleware
│   │   └── auth.ts        # Authentication & authorization
│   ├── models/            # Database models (future)
│   ├── routes/            # API routes
│   │   ├── auth.ts        # Authentication routes
│   │   ├── designs.ts     # Design management routes
│   │   └── users.ts       # User management routes
│   ├── utils/             # Utility functions
│   │   └── auth.ts        # Auth helpers (hash, JWT)
│   └── index.ts           # Application entry point
├── .env.example           # Environment variables template
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register/buyer` - Register a new buyer
- `POST /api/auth/register/designer` - Register a new designer
- `POST /api/auth/login` - Login user

### Designs

- `GET /api/designs` - Get all designs (with filters, pagination)
- `GET /api/designs/:id` - Get single design
- `POST /api/designs` - Create design (designers only)
- `PUT /api/designs/:id` - Update design (designers only)
- `DELETE /api/designs/:id` - Delete design (designers only)

### Users

- `GET /api/users/:id` - Get user profile (authenticated)
- `GET /api/users/designers/:id` - Get designer profile (public)

### Health Check

- `GET /health` - API health check

For detailed API documentation, see `/API-CALLS.md` in the project root.

## Database Schema

The database uses Prisma ORM with PostgreSQL. Main tables:

- **users** - Base user authentication
- **designers** - Designer profiles
- **buyers** - Buyer profiles
- **designs** - Design listings
- **transactions** - Purchase records
- **reviews** - Designer ratings
- **messages** - User messaging
- **withdrawals** - Payout requests

Run `npx prisma studio` to open Prisma Studio GUI for database management.

## Development

### Commands

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server

# Database
npx prisma generate   # Generate Prisma Client
npx prisma migrate dev # Create and apply migrations
npx prisma studio     # Open Prisma Studio GUI
npx prisma db push    # Push schema changes (development)

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

### Adding New Routes

1. Create route file in `src/routes/`
2. Import in `src/index.ts`
3. Add route: `app.use('/api/path', routeHandler)`

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations in production
npx prisma migrate deploy
```

## Security Features

- **Helmet**: HTTP header security
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevents abuse (100 requests per 15 minutes)
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with cost factor 12
- **Input Validation**: express-validator for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRES_IN` | Token expiration time | 24h |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `UPLOAD_DIR` | File upload directory | ./uploads |
| `MAX_FILE_SIZE` | Max upload size in bytes | 524288000 (500MB) |

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Validation Error:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Future Enhancements

- [ ] File upload handling (multer/S3)
- [ ] Payment gateway integration (Stripe, PayPal, Paystack)
- [ ] Email notifications
- [ ] Real-time messaging (Socket.io)
- [ ] Caching layer (Redis)
- [ ] Advanced search (Elasticsearch)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Testing (Jest, Supertest)

## License

Private - All rights reserved

---

**Built with ❤️ using Express.js, Prisma, and TypeScript**
