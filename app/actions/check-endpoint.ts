"use server";

import { WorkerAPI } from "@/lib/api-client";

export async function checkEndpoint(endpointId: string) {
  try {
    const result = await WorkerAPI.triggerCheck(endpointId);
    return {
      success: result.success,
      check: null, // We don't get the check immediately from this async call usually, but endpoints return success message
      message: result.message
    };
  } catch (error: any) {
    console.error(`❌ Error triggering check for endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: {
        message: error.message || "Failed to trigger check",
        code: error.code || 'CHECK_FAILED',
        details: error.details || null
      }
    };
  }
}