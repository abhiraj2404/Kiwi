import { redis } from "./redisClient";
import { REDIS_KEYS, CONFIG } from "@x402/common/lib/constants";
import { UsageEvent } from "@x402/common/lib/types";
import { calculateAmount } from "@x402/common/lib/utils";
import { logger } from "./logger";

export class AggregatorService {
  // Increment user counter
  async incrementCounter(userId: string, seconds: number, ratePerSecond: number): Promise<void> {
    const key = REDIS_KEYS.USER_COUNTER(userId);
    const amount = calculateAmount(seconds, ratePerSecond);

    // Use Lua script for atomic increment
    await redis.eval(
      `
      local key = KEYS[1]
      local amount = tonumber(ARGV[1])
      local timestamp = tonumber(ARGV[2])
      local rate = tonumber(ARGV[3])
      
      local current = redis.call('HGET', key, 'amount')
      local newAmount = (current and tonumber(current) or 0) + amount
      
      redis.call('HMSET', key, 
        'amount', newAmount,
        'last_update', timestamp,
        'rate_per_second', rate
      )
      
      return newAmount
    ` as string,
      {
        keys: [key],
        arguments: [String(amount), String(Date.now()), String(ratePerSecond)]
      }
    );

    await redis.expire(key, 3600); // 1 hour TTL
    logger.debug(`Incremented counter for user ${userId} by ${seconds}s (${amount} USD)`);
  }

  // Process usage event
  async processEvent(event: UsageEvent): Promise<void> {
    switch (event.type) {
      case "usage_tick":
        if (event.seconds && event.rate_per_second) {
          await this.incrementCounter(event.user_id, event.seconds, event.rate_per_second);
        }
        break;

      case "heartbeat":
        // Just keep connection alive, no counter update
        logger.debug(`Heartbeat from user ${event.user_id}`);
        break;

      case "leave":
        // Flush immediately
        await this.flushUser(event.user_id);
        break;
    }
  }

  // Flush user counter (atomic read-delete)
  async flushUser(userId: string): Promise<{ amount: string; ratePerSecond: number } | null> {
    const key = REDIS_KEYS.USER_COUNTER(userId);
    const result = await redis.hmGet(key, ["amount", "rate_per_second"]);

    if (result[0]) {
      await redis.del(key);
      const amount = result[0];
      const ratePerSecond = parseFloat(result[1] || "0.001");
      logger.info(`Flushed ${amount} USD for user ${userId}`);
      return { amount, ratePerSecond };
    }

    return null;
  }

  // Get all active user keys for periodic flush
  async getActiveUsers(): Promise<string[]> {
    const keys = await redis.keys("user:*:counter");
    return keys.map((key) => key.split(":")[1]);
  }

  // Get user status (for API Gateway)
  async getUserStatus(userId: string): Promise<{
    pendingAmount: string;
    lastFlushTs: number | null;
  }> {
    const key = REDIS_KEYS.USER_COUNTER(userId);
    const result = await redis.hmGet(key, ["amount", "last_update"]);

    if (result[0]) {
      return {
        pendingAmount: result[0],
        lastFlushTs: parseInt(result[1] || "0")
      };
    }

    return {
      pendingAmount: "0.000",
      lastFlushTs: null
    };
  }
}
