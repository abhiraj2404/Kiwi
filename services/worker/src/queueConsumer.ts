// queue consumer for batch processing
import amqp from "amqplib";
import { config } from "@x402/common/config";
import { QUEUE_NAMES } from "@x402/common/lib/constants";
import { BatchMessage } from "@x402/common/lib/types";
import { logger } from "./logger";
import { processBatch } from "./paymentProcessor";

let channel: amqp.Channel;

export async function startConsumer() {
  const connection = await amqp.connect(config.QUEUE_URL);
  channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAMES.BATCH_QUEUE, {
    durable: true
  });

  channel.prefetch(1); // Process one at a time

  channel.consume(QUEUE_NAMES.BATCH_QUEUE, async (msg) => {
    if (msg) {
      try {
        const batch: BatchMessage = JSON.parse(msg.content.toString());
        logger.info(`Processing batch ${batch.batch_id}`);

        await processBatch(batch);

        channel.ack(msg);
        logger.info(`Batch ${batch.batch_id} processed successfully`);
      } catch (error) {
        logger.error("Error processing batch", error);
        channel.nack(msg, false, true); // Requeue
      }
    }
  });

  logger.info("Worker consumer started");
}
