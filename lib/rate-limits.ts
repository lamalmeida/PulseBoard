// lib/rate-limits.ts

const MIN_CHECK_INTERVAL_SECONDS = 3600; // 1 hour

export interface RateLimitValidation {
  valid: boolean;
  error?: string;
  current?: number;
  limit?: number;
}

/**
 * Check if check interval is not too frequent (minimum 1 hour)
 */
export function validateCheckInterval(
  intervalSeconds: number
): RateLimitValidation {
  if (intervalSeconds < MIN_CHECK_INTERVAL_SECONDS) {
    return {
      valid: false,
      error: `Check interval must be at least ${MIN_CHECK_INTERVAL_SECONDS / 60} minutes. You provided ${intervalSeconds} seconds.`,
      current: intervalSeconds,
      limit: MIN_CHECK_INTERVAL_SECONDS,
    };
  }

  return {
    valid: true,
    current: intervalSeconds,
    limit: MIN_CHECK_INTERVAL_SECONDS,
  };
}