import { AggregatorService } from "./aggregator.service";
import { connectRedis, redis } from "./redisClient";
import { logger } from "./logger";

// Create a single shared instance of AggregatorService
// This instance is used by both the aggregator service itself and the API Gateway
export const aggregator = new AggregatorService();

// Ensure Redis is connected when the aggregator is used
let redisConnected = false;
export async function ensureRedisConnection(): Promise<void> {
  // Check both our flag and the actual Redis client status
  if (!redisConnected || !redis.isOpen) {
    try {
      await connectRedis();
      redisConnected = true;
      logger.info("Redis connection established for aggregator service");
    } catch (error) {
      logger.error("Failed to connect to Redis", error);
      redisConnected = false; // Reset flag on error
      throw error;
    }
  }
}
