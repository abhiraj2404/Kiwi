#!/bin/bash

# Cleanup script for X402 Streaming Payments

echo "Cleaning up X402 Streaming Payments project..."

# Stop and remove Docker containers
echo "Stopping Docker containers..."
docker-compose -f docker/docker-compose.yml down

# Remove Docker volumes
echo "Removing Docker volumes..."
docker volume rm x402-streaming-payments_pg_data 2>/dev/null || true

# Clean build artifacts
echo "Cleaning build artifacts..."
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.log" -type f -delete 2>/dev/null || true

# Clean Prisma generated files
echo "Cleaning Prisma files..."
find . -name ".prisma" -type d -exec rm -rf {} + 2>/dev/null || true

# Clean coverage reports
echo "Cleaning coverage reports..."
find . -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".nyc_output" -type d -exec rm -rf {} + 2>/dev/null || true

echo "Cleanup completed!"
