import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
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

    // TODO: Query Redis for pending amount
    // TODO: Query database for last batch info

    // Mock response for now
    return res.json({
      user_id: userId,
      pending_amount: "0.000",
      last_batch_id: null,
      last_flush_ts: null
    });
  } catch (error) {
    logger.error("Error fetching status", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

export default router;
