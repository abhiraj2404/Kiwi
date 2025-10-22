import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { validateUsageEvent } from "@x402/common/lib/utils";
import { UsageEvent } from "@x402/common/lib/types";
import { logger } from "../utils/logger";

const router: Router = Router();

router.post("/", async (req: AuthRequest, res) => {
  try {
    const event: UsageEvent = req.body;

    // Validate event structure
    if (!validateUsageEvent(event)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event format"
      });
    }

    // Log the received event
    logger.info("Received usage event", {
      event,
      userId: req.userId
    });

    // TODO: Forward to aggregator service
    // For now, just acknowledge receipt

    return res.json({
      success: true,
      message: "Event received successfully"
    });
  } catch (error) {
    logger.error("Error processing event", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;
