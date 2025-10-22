FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY services/reconciler/package.json ./services/reconciler/
COPY common/package.json ./common/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/reconciler/src ./services/reconciler/src
COPY common ./common

# Build the application
WORKDIR /app/services/reconciler
RUN pnpm build

# Start the application
CMD ["pnpm", "start"]
