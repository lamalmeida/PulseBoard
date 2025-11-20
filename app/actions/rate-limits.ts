"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { validateCheckInterval, type RateLimitValidation } from "@/lib/rate-limits";

const ENDPOINTS_PER_USER_LIMIT = 10;

/**
 * Check if user has exceeded the endpoint limit (10 max)
 */
export async function validateEndpointLimit(
  userId: string
): Promise<RateLimitValidation> {
  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("endpoints")
      .select("id", { count: "exact" })
      .eq("user_id", userId);

    if (error) {
      console.error("Error checking endpoint count:", error);
      return {
        valid: false,
        error: "Failed to validate endpoint limit",
      };
    }

    const currentCount = data?.length || 0;

    if (currentCount >= ENDPOINTS_PER_USER_LIMIT) {
      return {
        valid: false,
        error: `You have reached the maximum limit of ${ENDPOINTS_PER_USER_LIMIT} endpoints. Please delete an existing endpoint to add a new one.`,
        current: currentCount,
        limit: ENDPOINTS_PER_USER_LIMIT,
      };
    }

    return {
      valid: true,
      current: currentCount,
      limit: ENDPOINTS_PER_USER_LIMIT,
    };
  } catch (error) {
    console.error("Error in validateEndpointLimit:", error);
    return {
      valid: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Comprehensive validation for adding/updating an endpoint
 */
export async function validateEndpointCreation(
  userId: string,
  checkIntervalSeconds: number
): Promise<RateLimitValidation> {
  // First check interval
  const intervalValidation = validateCheckInterval(checkIntervalSeconds);
  if (!intervalValidation.valid) {
    return intervalValidation;
  }

  // Then check endpoint limit
  return await validateEndpointLimit(userId);
}
