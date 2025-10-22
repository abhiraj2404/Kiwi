FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY services/dashboard/package.json ./services/dashboard/
COPY common/package.json ./common/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/dashboard/src ./services/dashboard/src
COPY common ./common

# Build the application
WORKDIR /app/services/dashboard
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
