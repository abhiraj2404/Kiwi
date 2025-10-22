import crypto from "crypto";

// Generate idempotency key
export function generateIdempotencyKey(userId: string, intervalStart: number): string {
  const nonce = crypto.randomBytes(8).toString("hex");
  return `${userId}::${intervalStart}::${nonce}`;
}

// Generate batch ID
export function generateBatchId(): string {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const random = crypto.randomBytes(4).toString("hex");
  return `b_${date}_${random}`;
}

// Validate usage event
export function validateUsageEvent(event: any): boolean {
  if (!event.user_id || !event.type || !event.ts) return false;
  if (event.type === "usage_tick" && !event.seconds) return false;
  if (event.type === "usage_tick" && !event.rate_per_second) return false;
  return true;
}

// Calculate amount from seconds
export function calculateAmount(seconds: number, ratePerSecond: number): string {
  return (seconds * ratePerSecond).toFixed(8);
}
