# @x402/db

Shared database package for X402 streaming payments platform. This package provides a centralized Prisma client and schema for all services.

## Usage

```typescript
import { prisma } from "@x402/db";

// Use the Prisma client
const users = await prisma.user.findMany();
```

## Scripts

- `pnpm generate` - Generate Prisma Client
- `pnpm migrate` - Run migrations in development
- `pnpm migrate:deploy` - Deploy migrations in production
- `pnpm studio` - Open Prisma Studio
- `pnpm push` - Push schema changes to database
- `pnpm seed` - Seed the database

## Environment Variables

Required environment variable:
- `DATABASE_URL` - PostgreSQL connection string

