"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { updateQStashSchedule } from "./update-qstash-schedule";

export async function toggleEndpointStatus(endpointId: string) {
  const supabase = await createClient();

  try {
    // Get current endpoint status
    const { data: endpoint, error: fetchError } = await supabase
      .from("endpoints")
      .select("is_active")
      .eq("id", endpointId)
      .single();

    if (fetchError || !endpoint) {
      return {
        success: false,
        error: {
          message: "Endpoint not found",
          code: 'ENDPOINT_NOT_FOUND'
        }
      };
    }

    // Toggle the status
    const { error: updateError } = await supabase
      .from("endpoints")
      .update({ is_active: !endpoint.is_active })
      .eq("id", endpointId);

    if (updateError) {
      return {
        success: false,
        error: {
          message: updateError.message,
          code: 'UPDATE_FAILED'
        }
      };
    }

    // Update QStash schedule
    await updateQStashSchedule();

    revalidatePath("/protected/endpoints");
    return { success: true, is_active: !endpoint.is_active };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: 'ENDPOINT_UPDATE_FAILED'
      }
    };
  }
}

export async function deleteEndpoint(endpointId: string) {
  const supabase = await createClient();

  try {
    // Delete associated checks first
    const { error: checksError } = await supabase
      .from("checks")
      .delete()
      .eq("endpoint_id", endpointId);

    if (checksError) {
      return {
        success: false,
        error: {
          message: checksError.message,
          code: 'DELETE_CHECKS_FAILED'
        }
      };
    }

    // Delete the endpoint
    const { error: endpointError } = await supabase
      .from("endpoints")
      .delete()
      .eq("id", endpointId);

    if (endpointError) {
      return {
        success: false,
        error: {
          message: endpointError.message,
          code: 'DELETE_ENDPOINT_FAILED'
        }
      };
    }

    // Update QStash schedule
    await updateQStashSchedule();

    revalidatePath("/protected/endpoints");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: 'ENDPOINT_DELETE_FAILED'
      }
    };
  }
}

export async function updateEndpoint(
  endpointId: string,
  data: {
    name: string;
    url: string;
    check_interval: number;
  }
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("endpoints")
      .update({
        name: data.name.trim(),
        url: data.url.trim(),
        check_interval: data.check_interval,
      })
      .eq("id", endpointId);

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'UPDATE_FAILED'
        }
      };
    }

    // Update QStash schedule
    await updateQStashSchedule();

    revalidatePath("/protected/endpoints");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "Operation failed",
        code: 'ENDPOINT_UPDATE_FAILED'
      }
    };
  }
}