# X402 Streaming Payments Prototype

A prototype for L2-style streaming payments using Coinbase x402. This system enables real-time micro-payments while users consume content, with batched settlement to reduce gas/fee overhead.

## Architecture

This project implements a microservices architecture with the following components:

- **API Gateway**: Public-facing API layer with authentication and rate limiting
- **Aggregator Service**: Receives events, updates Redis counters, triggers batch flushes
- **Worker Service**: Processes batches and calls Coinbase x402 for settlement
- **Reconciler Service**: Periodic reconciliation and audit jobs
- **Dashboard**: Admin panel for monitoring and management
- **SDK**: Client library for developers to integrate streaming payments

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Package Manager**: pnpm workspaces
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Queue**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **Monitoring**: Prometheus & Grafana

## Quick Start

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Start infrastructure**:

   ```bash
   pnpm docker:up
   ```

3. **Run database migrations**:

   ```bash
   pnpm run db:migrate
   ```

4. **Start all services**:
   ```bash
   pnpm dev
   ```

## Development

### Services

Each service is located in the `services/` directory and can be developed independently:

- `services/api-gateway/` - Public API endpoints
- `services/aggregator/` - Event aggregation and Redis management
- `services/worker/` - Batch processing and x402 integration
- `services/reconciler/` - Reconciliation jobs
- `services/dashboard/` - Admin dashboard

### SDK

The client SDK is located in the `sdk/` directory and provides a simple interface for developers to integrate streaming payments.

### Common

Shared code and types are in the `common/` directory and used across all services.

## Docker

The project uses Docker Compose for local development. All infrastructure services (Redis, PostgreSQL, RabbitMQ) are defined in `docker/docker-compose.yml`.

## Monitoring

Monitoring configuration is in the `monitoring/` directory with Prometheus and Grafana dashboards for observability.

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables.

## License

Private - All rights reserved
