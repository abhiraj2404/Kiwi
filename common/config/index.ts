import dotenv from "dotenv";
dotenv.config();

export const config = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "postgres://payments:secret@localhost:5432/payments_db",

  // Redis
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // RabbitMQ
  QUEUE_URL: process.env.QUEUE_URL || "amqp://admin:admin@localhost:5672",

  // API Gateway
  API_PORT: parseInt(process.env.API_PORT || "8080"),
  API_HOST: process.env.API_HOST || "localhost",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",

  // Coinbase
  COINBASE_API_URL: process.env.COINBASE_SANDBOX_URL || "https://api.sandbox.coinbase.com/v2",
  COINBASE_API_KEY: process.env.COINBASE_API_KEY || "",
  COINBASE_API_SECRET: process.env.COINBASE_API_SECRET || "",

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug"
};
