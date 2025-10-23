import { connectRedis } from "./redisClient";
import { connectQueue } from "./queuePublisher";
import { AggregatorService } from "./aggregator.service";
import { aggregator } from "./serviceInstance";
import { generateBatchId, generateIdempotencyKey } from "@x402/common/lib/utils";
import { BatchMessage } from "@x402/common/lib/types";
import { CONFIG } from "@x402/common/lib/constants";
import { publishBatch } from "./queuePublisher";
import { logger } from "./logger";

async function main() {
  try {
    await connectRedis();
    await connectQueue();

    logger.info("Aggregator service started");

    // Periodic flush every 5 seconds
    setInterval(async () => {
      try {
        logger.info("Running periodic flush...");

        const activeUsers = await aggregator.getActiveUsers();

        for (const userId of activeUsers) {
          const flushResult = await aggregator.flushUser(userId);

          if (flushResult && parseFloat(flushResult.amount) > 0) {
            const now = Date.now();
            const batch: BatchMessage = {
              batch_id: generateBatchId(),
              user_id: userId,
              interval_start: now - CONFIG.FLUSH_INTERVAL_SECONDS * 1000,
              interval_end: now,
              amount: flushResult.amount,
              rate_per_second: flushResult.ratePerSecond,
              idempotency_key: generateIdempotencyKey(userId, now - CONFIG.FLUSH_INTERVAL_SECONDS * 1000)
            };

            await publishBatch(batch);
          }
        }

        logger.info(`Periodic flush completed for ${activeUsers.length} users`);
      } catch (error) {
        logger.error("Error during periodic flush", error);
      }
    }, CONFIG.FLUSH_INTERVAL_SECONDS * 1000);

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("Shutting down...");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start aggregator", error);
    process.exit(1);
  }
}

main();

export { AggregatorService, aggregator };
