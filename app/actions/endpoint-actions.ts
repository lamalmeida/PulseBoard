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
      return { success: false, error: "Endpoint not found" };
    }

    // Toggle the status
    const { error: updateError } = await supabase
      .from("endpoints")
      .update({ is_active: !endpoint.is_active })
      .eq("id", endpointId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Update QStash schedule
    await updateQStashSchedule();

    revalidatePath("/protected/endpoints");
    return { success: true, is_active: !endpoint.is_active };
  } catch (error: any) {
    return { success: false, error: error.message };
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
      return { success: false, error: checksError.message };
    }

    // Delete the endpoint
    const { error: endpointError } = await supabase
      .from("endpoints")
      .delete()
      .eq("id", endpointId);

    if (endpointError) {
      return { success: false, error: endpointError.message };
    }

    // Update QStash schedule
    await updateQStashSchedule();

    revalidatePath("/protected/endpoints");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
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
      return { success: false, error: error.message };
    }

    // Update QStash schedule
    await updateQStashSchedule();

    revalidatePath("/protected/endpoints");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}