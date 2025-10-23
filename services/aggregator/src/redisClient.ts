import { createClient, RedisClientType } from "redis";
import { config } from "@x402/common/config";
import { logger } from "./logger";

export const redisClient: RedisClientType = createClient({
  url: config.REDIS_URL
});

redisClient.on("error", (err) => logger.error("Redis error", err));
redisClient.on("connect", () => logger.info("Redis connected"));

// Lua script for atomic flush (read and delete)
const FLUSH_SCRIPT = `
  local value = redis.call('GET', KEYS[1])
  if value then
    redis.call('DEL', KEYS[1])
    return value
  end
  return nil
`;

export async function connectRedis() {
  if (!redisClient.isOpen) {
    logger.info("Establishing new Redis connection...");
    await redisClient.connect();
    logger.info("Redis connection established successfully");
  } else {
    logger.debug("Redis client is already connected, skipping connection");
  }
}

export { redisClient as redis };

// Helper to run the flush Lua script (atomic GET + DEL)
export async function atomicGetAndDelete(key: string): Promise<string | null> {
  const result = await redisClient.eval(FLUSH_SCRIPT, { keys: [key], arguments: [] });
  return (result as string) ?? null;
}
