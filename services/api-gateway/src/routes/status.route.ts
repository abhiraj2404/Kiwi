import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { aggregator, ensureRedisConnection } from "../../../aggregator/dist/serviceInstance";
import { prisma } from "@x402/db";
import { logger } from "../utils/logger";

const router: Router = Router();

router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.query.user_id as string;

    if (!userId) {
      return res.status(400).json({
        error: "user_id query parameter required"
      });
    }

    // Get user status from aggregator service
    let pendingAmount = "0.000";
    let lastFlushTs: number | null = null;

    // Ensure Redis connection before processing
    await ensureRedisConnection();
    const status = await aggregator.getUserStatus(userId);
    console.log("status in status route =", status);
    pendingAmount = status.pendingAmount;
    lastFlushTs = status.lastFlushTs;

    // Query database for last batch info
    let lastBatchId: string | null = null;
    try {
      const lastBatch = await prisma.batch.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { batchId: true }
      });
      lastBatchId = lastBatch?.batchId || null;
    } catch (error) {
      logger.error("Error fetching last batch from database", error);
      // Continue without lastBatchId rather than failing the entire request
    }

    return res.json({
      user_id: userId,
      pending_amount: pendingAmount,
      last_batch_id: lastBatchId,
      last_flush_ts: lastFlushTs
    });
  } catch (error) {
    logger.error("Error fetching status", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

export default router;
