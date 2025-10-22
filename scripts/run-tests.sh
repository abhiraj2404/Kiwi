#!/bin/bash

# Run tests for all services
echo "Running tests for X402 Streaming Payments..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Run tests for each service
echo "Running API Gateway tests..."
cd services/api-gateway && pnpm test && cd ../..

echo "Running Aggregator tests..."
cd services/aggregator && pnpm test && cd ../..

echo "Running Worker tests..."
cd services/worker && pnpm test && cd ../..

echo "Running Reconciler tests..."
cd services/reconciler && pnpm test && cd ../..

echo "Running Dashboard tests..."
cd services/dashboard && pnpm test && cd ../..

echo "Running SDK tests..."
cd sdk && pnpm test && cd ..

echo "Running Common tests..."
cd common && pnpm test && cd ..

echo "All tests completed!"
