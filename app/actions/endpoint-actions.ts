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
    await WorkerAPI.createEndpoint(data);

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
    request_head?: Record<string, string>;
    request_body?: string;
    check_interval: number;
    consecutive_failures_threshold?: number;
    notification_cooldown_seconds?: number;
    send_recovery_notifications?: boolean;
    escalation_interval_minutes?: number | null;
  }
) {
  try {
    await WorkerAPI.updateEndpoint(endpointId, {
      ...data,
      name: data.name.trim(),
      url: data.url.trim(),
    });

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