#!/bin/bash

# Development stop script for X402 Streaming Payments

echo "🛑 Stopping X402 Streaming Payments Development Environment..."

# Stop infrastructure services
echo "🐳 Stopping infrastructure services..."
docker-compose -f docker/docker-compose.yml down

echo "✅ Development environment stopped!"
echo ""
echo "To start again, run:"
echo "  ./scripts/dev-start.sh"
