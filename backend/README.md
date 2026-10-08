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
- pnpm 9.15.0

### Installation

Run commands from the workspace root with pnpm 9.15.0:

```bash
pnpm install --frozen-lockfile
cp backend/.env.example backend/.env
openssl rand -base64 48
```

Set `DATABASE_URL` to your PostgreSQL database and put the generated random value in
`JWT_SECRET`. The server rejects missing, short, low-diversity and known example keys
in every environment. `JWT_EXPIRES_IN` accepts an explicit duration from `1s` to `24h`.
Replace any previously used default key before starting the server; doing so invalidates
all tokens signed with that key. Account state, role and token version are checked on
every authenticated request. Logout revokes all sessions for the account.

For a fresh database:

```bash
pnpm --dir backend db:generate
pnpm --dir backend db:migrate
pnpm --dir backend dev
```

For an existing database matching the original Prisma schema, back up the database,
compare its structure to `prisma/migrations/20261008000100_baseline/migration.sql`,
and mark that baseline applied **only after confirming it matches**:

```bash
pnpm --dir backend exec prisma migrate resolve --applied 20261008000100_baseline
pnpm --dir backend db:migrate
pnpm --dir backend db:generate
```

`prisma/schema.prisma` and the committed migrations are canonical. The historical
SQL files under `scripts/` use incompatible relationships and lowercase states;
do not run them or their sample-data script for application setup. A database created
from those files requires a separately reviewed data conversion after inspecting its
actual contents; it must not be marked as this Prisma baseline.

There is no sample production seed. Provision administrator accounts through a controlled
operator process using bcrypt hashes; public registration creates only buyers/designers.
The API base is `http://localhost:5000/api` during local development.

### Build for Production

```bash
pnpm --dir backend build
pnpm --dir backend start
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
- `POST /api/auth/login` - Login active user
- `GET /api/auth/me` - Current server-validated account
- `POST /api/auth/logout` - Revoke all account sessions

### Designs

- `GET /api/designs` - Get all designs (with filters, pagination)
- `GET /api/designs/:id` - Public approved, unarchived design from an active account
- `GET /api/designs/:id/preview` - Authenticated owner/admin preview, excluding paid file URLs
- `POST /api/designs` - Create design (designers only)
- `PUT /api/designs/:id` - Update design (designers only)
- `DELETE /api/designs/:id` - Archive an owned design; retain purchase history

### Users

- `GET /api/users/:id` - Private profile, owner or administrator only
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

## Verification

`pnpm --dir backend test` runs JWT regression tests without a database.
The HTTP integration test requires a disposable PostgreSQL database on 127.0.0.1 named
`yeba_audit`, with committed migrations applied. It refuses other database targets:

```bash
pnpm --dir backend exec tsx --test tests/auth.integration.ts
```

Refund and payout approval return HTTP 503 until a real payment provider is configured
and integrated. No money movement is reported from a database status change. Pending
withdrawal rejection is persisted using an atomic conditional update.

## Persisted administration

Administrators manage actual database records through `/api/admin`. User verification
is an operator flag, not email verification or an authorization grant. User deletion
bans the account and increments its token version; design deletion archives the listing.
Transaction buyer/design and withdrawal designer references prohibit cascading deletion.
Transaction title and preview snapshots preserve historical purchase descriptions; the
migration backfills snapshots from existing designs. Paid download delivery is not yet implemented.

Authenticated users submit reports with `POST /api/reports` using `type`, `subjectId`,
`reason` and `description`. Message reports require participation; unpublished design
reports require ownership. Moderation includes `expectedStatus` and a resolution;
concurrent decisions return 409. Report creation is not automatically retried.

`GET /api/settings` supplies configured categories. Administrator settings updates
require the current `version`; stale writes return 409. Maintenance mode, registration
and submission approval are enforced by the API. Maintenance permits administrator
access and authentication needed to restore service. Settings contain no provider secrets.

Cloudflare R2 and Paystack credentials are unavailable. Refunds and payout approval
remain unavailable without mutating balances or claiming a provider succeeded.
