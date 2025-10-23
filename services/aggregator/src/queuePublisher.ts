import amqp from "amqplib";
import { config } from "@x402/common/config";
import { QUEUE_NAMES } from "@x402/common/lib/constants";
import { BatchMessage } from "@x402/common/lib/types";
import { logger } from "./logger";

let channel: amqp.Channel;

export async function connectQueue() {
  const connection = await amqp.connect(config.QUEUE_URL);
  channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAMES.BATCH_QUEUE, {
    durable: true
  });

  logger.info("Queue connected");
}

export async function publishBatch(batch: BatchMessage): Promise<void> {
  const message = Buffer.from(JSON.stringify(batch));

  channel.sendToQueue(QUEUE_NAMES.BATCH_QUEUE, message, {
    persistent: true
  });

  logger.info(`Published batch ${batch.batch_id} to queue`);
}
