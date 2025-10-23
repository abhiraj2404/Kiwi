// idempotency check
// to ensure that the same batch is not processed multiple times
import prisma from "./dbClient";
import { logger } from "./logger";

export async function isIdempotent(idempotencyKey: string): Promise<boolean> {
  const existing = await prisma.batch.findUnique({
    where: { idempotencyKey }
  });

  if (existing) {
    logger.warn(`Duplicate batch detected: ${idempotencyKey}`);
    return false;
  }

  return true;
}
