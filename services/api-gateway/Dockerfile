FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY services/api-gateway/package.json ./services/api-gateway/
COPY common/package.json ./common/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/api-gateway/src ./services/api-gateway/src
COPY common ./common

# Build the application
WORKDIR /app/services/api-gateway
RUN pnpm build

# Expose port
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]
