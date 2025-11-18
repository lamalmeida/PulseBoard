"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendFailureNotification } from "@/app/actions/send-failure-notification";

export async function checkEndpoint(endpointId: string) {
  console.log(`🔍 Starting check for endpoint: ${endpointId}`);
  const supabase = await createAdminClient();

  try {
    // Get the endpoint details
    const { data: endpoint, error: fetchError } = await supabase
      .from("endpoints")
      .select("*")
      .eq("id", endpointId)
      .single();

    if (fetchError || !endpoint) {
      console.error(`❌ Endpoint not found: ${endpointId}`, fetchError);
      throw new Error(`Endpoint not found: ${endpointId}`);
    }
    
    console.log(`🔗 Checking endpoint: ${endpoint.name} (${endpoint.url})`);

    // Get the previous check status to detect first failure
    const { data: previousCheck } = await supabase
      .from("checks")
      .select("status")
      .eq("endpoint_id", endpointId)
      .order("checked_at", { ascending: false })
      .limit(1)
      .single();

    const previousStatus = previousCheck?.status;

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
      console.error('❌ Failed to insert check result:', insertError);
      throw insertError;
    }
    
    console.log(`✅ Check completed for ${endpoint.name}: ${status} (${responseTime}ms)`);

    // Send notification if this is the first failure (status changed from success to failure)
    if (status === "failure"){//&& previousStatus === "success") {
      console.log(`🚨 First failure detected for ${endpoint.name}, sending notification...`);
      
      // Get the user's email from auth.users
      const { data: userData } = await supabase.auth.admin.getUserById(
        endpoint.user_id
      );

      if (userData?.user?.email) {
        const notificationResult = await sendFailureNotification(
          endpointId,
          endpoint.name,
          endpoint.url,
          errorMessage || "Unknown error",
          userData.user.email
        );

        if (notificationResult.success && notificationResult.emailSent) {
          console.log(`📧 Notification sent to ${userData.user.email}`);
        } else if (notificationResult.emailSent === false) {
          console.log(`⏭️ ${notificationResult.message}`);
        } else {
          console.error(`❌ Failed to send notification: ${notificationResult.message}`);
        }
      } else {
        console.error(`❌ No email found for user ${endpoint.user_id}`);
      }
    } else if (status === "failure" && previousStatus === "failure") {
      console.log(`⚠️ Endpoint still down, but notification cooldown active`);
    } else if (status === "success" && previousStatus === "failure") {
      console.log(`✅ Endpoint recovered!`);
      // Optional: You could send a recovery notification here
    }

    return {
      success: true,
      check,
    };
  } catch (error: any) {
    console.error(`❌ Error checking endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to check endpoint",
      details: error.details || null,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}