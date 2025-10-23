import { startConsumer } from "./queueConsumer";
import { logger } from "./logger";

async function main() {
  try {
    await startConsumer();

    logger.info("Worker service started");

    process.on("SIGTERM", async () => {
      logger.info("Shutting down...");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start worker", error);
    process.exit(1);
  }
}

main();
