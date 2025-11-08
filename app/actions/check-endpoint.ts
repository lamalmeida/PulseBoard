"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkEndpoint(endpointId: string) {
  const supabase = await createClient();

  try {
    // Get the endpoint details
    const { data: endpoint, error: fetchError } = await supabase
      .from("endpoints")
      .select("*")
      .eq("id", endpointId)
      .single();

    if (fetchError || !endpoint) {
      throw new Error("Endpoint not found");
    }

    // Perform the health check
    const startTime = Date.now();
    let status = "failure";
    let statusCode: number | null = null;
    let errorMessage: string | null = null;

    try {
      const response = await fetch(endpoint.url, {
        method: "GET",
        headers: {
          "User-Agent": "PulseBoard-Monitor/1.0",
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      statusCode = response.status;
      
      // Consider 2xx and 3xx as success
      if (response.ok || (statusCode >= 200 && statusCode < 400)) {
        status = "success";
      } else {
        status = "failure";
        errorMessage = `HTTP ${statusCode}: ${response.statusText}`;
      }
    } catch (error: any) {
      status = "failure";
      errorMessage = error.message || "Request failed";
      
      // Handle common errors
      if (error.name === "AbortError" || error.name === "TimeoutError") {
        errorMessage = "Request timeout (30s)";
      } else if (error.code === "ENOTFOUND") {
        errorMessage = "Domain not found";
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "Connection refused";
      }
    }

    const responseTime = Date.now() - startTime;

    // Insert the check result into the database
    const { data: check, error: insertError } = await supabase
      .from("checks")
      .insert({
        endpoint_id: endpointId,
        status,
        response_time: responseTime,
        status_code: statusCode,
        error_message: errorMessage,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      check,
    };
  } catch (error: any) {
    console.error("Error checking endpoint:", error);
    return {
      success: false,
      error: error.message || "Failed to check endpoint",
    };
  }
}