import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { logger } from "./utils/logger";
import eventsRouter from "./routes/events.route";
import statusRouter from "./routes/status.route";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/v1/events", eventsRouter);
app.use("/v1/status", statusRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(config.PORT, () => {
  logger.info(`API Gateway listening on ${config.HOST}:${config.PORT}`);
});
