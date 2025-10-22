FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY services/worker/package.json ./services/worker/
COPY common/package.json ./common/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/worker/src ./services/worker/src
COPY services/worker/prisma ./services/worker/prisma
COPY common ./common

# Generate Prisma client
WORKDIR /app/services/worker
RUN pnpm db:generate

# Build the application
RUN pnpm build

# Start the application
CMD ["pnpm", "start"]
