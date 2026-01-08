// lib/rate-limits.ts

const MIN_CHECK_INTERVAL_SECONDS = 15; // 15 seconds

export interface RateLimitValidation {
  valid: boolean;
  error?: string;
  current?: number;
  limit?: number;
}

/**
 * Check if check interval is not too frequent (minimum 15 seconds)
 */
export function validateCheckInterval(
  intervalSeconds: number
): RateLimitValidation {
  if (intervalSeconds < MIN_CHECK_INTERVAL_SECONDS) {
    const minText = MIN_CHECK_INTERVAL_SECONDS < 60
      ? `${MIN_CHECK_INTERVAL_SECONDS} seconds`
      : `${Math.ceil(MIN_CHECK_INTERVAL_SECONDS / 60)} minutes`;

    return {
      valid: false,
      error: `Check interval must be at least ${minText}. You provided ${intervalSeconds} seconds.`,
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