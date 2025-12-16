"use server";

import { revalidatePath } from "next/cache";
import { WorkerAPI, handleApiError } from "@/lib/api-client";

export async function createEndpoint(data: any) {
  try {
    // 1. Validate limits
    const existing = await WorkerAPI.getEndpoints();
    if (existing.length >= 10) {
      return {
        success: false,
        error: {
          message: "You have reached the maximum limit of 10 endpoints.",
          code: "LIMIT_REACHED"
        }
      };
    }

    // 2. Create endpoint
    // Map minutes (which are actually seconds from form) to seconds column
    const { escalation_interval_minutes, ...rest } = data;
    const payload = {
      ...rest,
      escalation_interval_seconds: escalation_interval_minutes,
    };

    await WorkerAPI.createEndpoint(payload);

    revalidatePath("/protected/endpoints");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: error.code || 'ENDPOINT_CREATE_FAILED'
      }
    };
  }
}

export async function toggleEndpointStatus(endpointId: string) {

  try {
    // Get current endpoint status
    const endpoint = await WorkerAPI.getEndpoint(endpointId);

    // Toggle the status
    const updatedEndpoint = await WorkerAPI.updateEndpoint(endpointId, {
      is_active: !endpoint.is_active,
    });

    revalidatePath("/protected/endpoints");
    return { success: true, is_active: updatedEndpoint.is_active };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: error.code || 'ENDPOINT_UPDATE_FAILED'
      }
    };
  }
}

export async function deleteEndpoint(endpointId: string) {
  try {
    const result = await WorkerAPI.deleteEndpoint(endpointId);

    if (result.success) {
      revalidatePath("/protected/endpoints");
      return { success: true };
    }

    // Fallback if success isn't explicit but no error thrown
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: error.code || 'ENDPOINT_DELETE_FAILED'
      }
    };
  }
}

export async function updateEndpoint(
  endpointId: string,
  data: {
    name: string;
    url: string;
    http_method?: string;
    request_headers?: Record<string, string>;
    request_body?: string;
    check_interval: number;
    consecutive_failures_threshold?: number;
    notification_cooldown_seconds?: number;
    send_recovery_notifications?: boolean;
    escalation_interval_minutes?: number | null;
  }
) {
  try {
    const { escalation_interval_minutes, ...rest } = data;

    const payload = {
      ...rest,
      name: data.name.trim(),
      url: data.url.trim(),
      escalation_interval_seconds: escalation_interval_minutes
    };

    await WorkerAPI.updateEndpoint(endpointId, payload);

    revalidatePath("/protected/endpoints");
    revalidatePath(`/protected/endpoints/${endpointId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: error.code || 'ENDPOINT_UPDATE_FAILED'
      }
    };
  }
}

export async function getEndpointCount() {
  try {
    const stats = await WorkerAPI.getGlobalStats();
    return stats.active_endpoints;
  } catch (error) {
    console.error("Failed to fetch endpoint count:", error);
    return 0;
  }
}

export async function triggerCheck(endpointId: string) {
  try {
    await WorkerAPI.triggerCheck(endpointId);
    revalidatePath("/protected/endpoints");
    revalidatePath(`/protected/endpoints/${endpointId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: error.code || 'ENDPOINT_CHECK_FAILED'
      }
    };
  }
}