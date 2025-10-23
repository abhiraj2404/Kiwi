// payment processor for x402 integration
import axios from "axios";
import { config } from "@x402/common/config";
import { BatchMessage } from "@x402/common/lib/types";
import { BATCH_STATUS } from "@x402/common/lib/constants";
import prisma from "./dbClient";
import { isIdempotent } from "./idempotency";
import { logger } from "./logger";

export async function processBatch(batch: BatchMessage): Promise<void> {
  // Check idempotency
  if (!(await isIdempotent(batch.idempotency_key))) {
    logger.info(`Skipping duplicate batch ${batch.batch_id}`);
    return;
  }

  // Create batch record
  await prisma.batch.create({
    data: {
      batchId: batch.batch_id,
      userId: batch.user_id,
      intervalStart: BigInt(batch.interval_start),
      intervalEnd: BigInt(batch.interval_end),
      amountDecimal: batch.amount,
      status: BATCH_STATUS.PENDING,
      idempotencyKey: batch.idempotency_key,
      attempts: 0
    }
  });

  // Call Coinbase x402 (with retries)
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;

      // Call x402 API
      const response = await callCoinbaseX402(batch);

      // Update batch as success
      await prisma.batch.update({
        where: { batchId: batch.batch_id },
        data: {
          status: BATCH_STATUS.SUCCESS,
          x402Id: response.payment_id,
          attempts
        }
      });

      logger.info(`Batch ${batch.batch_id} completed successfully`);
      return;
    } catch (error: any) {
      logger.error(`Attempt ${attempts} failed for batch ${batch.batch_id}`, error);

      if (attempts >= maxAttempts) {
        // Mark as failed
        await prisma.batch.update({
          where: { batchId: batch.batch_id },
          data: {
            status: BATCH_STATUS.FAILED,
            lastError: error.message,
            attempts
          }
        });
        throw error;
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }
}

async function callCoinbaseX402(batch: BatchMessage): Promise<any> {
  // For MVP, mock the response


  if (config.NODE_ENV === "development") {
    // add delay to the mock response
    await new Promise((resolve) => setTimeout(resolve, 1000));
    logger.info(`[MOCK] Processing payment for ${batch.amount}`);
    return {
      payment_id: `mock_${Date.now()}`,
      status: "completed"
    };
  }

  // Real Coinbase API call
  const response = await axios.post(
    `${config.COINBASE_API_URL}/payments`,
    {
      amount: batch.amount,
      currency: "USD",
      metadata: {
        batch_id: batch.batch_id,
        user_id: batch.user_id
      }
    },
    {
      headers: {
        Authorization: `Bearer ${config.COINBASE_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}
