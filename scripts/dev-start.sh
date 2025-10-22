#!/bin/bash

# Development startup script for X402 Streaming Payments
# This script starts infrastructure services and backend services for local development

echo "🚀 Starting X402 Streaming Payments Development Environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Start infrastructure services (Redis, PostgreSQL, RabbitMQ)
echo "🐳 Starting infrastructure services..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."

# Check Redis
if ! docker exec x402-redis redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not ready"
    exit 1
fi
echo "✅ Redis is ready"

# Check PostgreSQL
if ! docker exec x402-postgres pg_isready -U payments > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not ready"
    exit 1
fi
echo "✅ PostgreSQL is ready"

# Check RabbitMQ
if ! curl -s http://localhost:15672 > /dev/null 2>&1; then
    echo "❌ RabbitMQ is not ready"
    exit 1
fi
echo "✅ RabbitMQ is ready"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm db:migrate

echo ""
echo "🎉 Infrastructure services are ready!"
echo ""
echo "📋 Available services:"
echo "  • Redis: localhost:6379"
echo "  • PostgreSQL: localhost:5432"
echo "  • RabbitMQ Management: http://localhost:15672 (guest/guest)"
echo ""
echo "🚀 To start backend services, run:"
echo "  pnpm dev:api-gateway    # API Gateway (port 8080)"
echo "  pnpm dev:aggregator    # Aggregator service"
echo "  pnpm dev:worker        # Worker service"
echo "  pnpm dev:reconciler    # Reconciler service"
echo "  pnpm dev:dashboard     # Dashboard (port 3000)"
echo ""
echo "Or start all services at once:"
echo "  pnpm dev"
echo ""
echo "🛑 To stop infrastructure services:"
echo "  pnpm infra:down"
