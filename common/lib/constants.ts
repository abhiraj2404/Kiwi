// Event types
export const EVENT_TYPES = {
  USAGE_TICK: "usage_tick",
  HEARTBEAT: "heartbeat",
  LEAVE: "leave"
} as const;

// Batch statuses
export const BATCH_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  SUCCESS: "success",
  FAILED: "failed"
} as const;

// Queue names
export const QUEUE_NAMES = {
  BATCH_QUEUE: "x402-batch-queue"
};

// Redis key patterns
export const REDIS_KEYS = {
  USER_COUNTER: (userId: string) => `user:${userId}:counter`,
  USER_META: (userId: string) => `user:${userId}:meta`
};

// Configuration
export const CONFIG = {
  FLUSH_INTERVAL_SECONDS: 5,
  MAX_RETRY_ATTEMPTS: 3
};
