import { EVENT_TYPES, BATCH_STATUS } from "./constants";

// Event types from client
export interface UsageEvent {
  user_id: string;
  type: EventType;
  seconds?: number;
  rate_per_second?: number;
  ts: number;
}

// Batch message for queue
export interface BatchMessage {
  batch_id: string;
  user_id: string;
  interval_start: number;
  interval_end: number;
  amount: string;
  rate_per_second: number;
  idempotency_key: string;
}

// API responses
export interface StatusResponse {
  user_id: string;
  pending_amount: string;
  last_batch_id?: string;
  last_flush_ts?: number;
}

export interface EventResponse {
  success: boolean;
  message: string;
}

// Type aliases derived from constants
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
export type BatchStatus = (typeof BATCH_STATUS)[keyof typeof BATCH_STATUS];
