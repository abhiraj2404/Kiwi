FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY services/aggregator/package.json ./services/aggregator/
COPY common/package.json ./common/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/aggregator/src ./services/aggregator/src
COPY common ./common

# Build the application
WORKDIR /app/services/aggregator
RUN pnpm build

# Start the application
CMD ["pnpm", "start"]
