"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendFailureNotification } from "@/app/actions/send-failure-notification";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}

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

    // Get notification settings with defaults
    const consecutiveFailuresThreshold = endpoint.consecutive_failures_threshold || 2;
    const cooldownSeconds = endpoint.notification_cooldown_seconds || 3600;
    const sendRecoveryNotifications = endpoint.send_recovery_notifications ?? true;
    const escalationIntervalMinutes = endpoint.escalation_interval_minutes || null;

    // Get recent checks to count consecutive failures
    const { data: recentChecks } = await supabase
      .from("checks")
      .select("status")
      .eq("endpoint_id", endpointId)
      .order("checked_at", { ascending: false })
      .limit(consecutiveFailuresThreshold + 1);

    const previousChecks = recentChecks || [];
    const previousStatus = previousChecks[0]?.status;

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
        signal: AbortSignal.timeout(5000), // 5 second timeout
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
        errorMessage = "Request timeout (5s)";
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

    // Get user email for notifications
    const { data: userData } = await supabase.auth.admin.getUserById(
      endpoint.user_id
    );
    const userEmail = userData?.user?.email;

    if (status === "failure") {
      // Count consecutive failures (including the current one we just inserted)
      const failureCount = 1 + previousChecks.filter((c, i) => {
        // Only count consecutive failures from the start
        for (let j = 0; j <= i; j++) {
          if (previousChecks[j]?.status !== "failure") return false;
        }
        return c.status === "failure";
      }).length;

      console.log(`📊 Consecutive failures: ${failureCount} / ${consecutiveFailuresThreshold} threshold`);

      if (failureCount >= consecutiveFailuresThreshold) {
        // We've hit the threshold, try to send notification
        console.log(`🚨 Failure threshold reached for ${endpoint.name}, attempting notification...`);

        if (userEmail) {
          const notificationResult = await sendFailureNotification(
            endpointId,
            endpoint.name,
            endpoint.url,
            errorMessage || "Unknown error",
            userEmail,
            cooldownSeconds
          );

          if (notificationResult.success && notificationResult.emailSent) {
            console.log(`📧 Notification sent to ${userEmail}`);
          } else if (notificationResult.emailSent === false) {
            console.log(`⏭️ ${notificationResult.message}`);

            // Check for escalation if enabled
            if (escalationIntervalMinutes) {
              await handleEscalation(
                supabase,
                endpointId,
                endpoint.name,
                endpoint.url,
                errorMessage || "Unknown error",
                userEmail,
                escalationIntervalMinutes
              );
            }
          } else {
            console.error(`❌ Failed to send notification: ${notificationResult.message}`);
          }
        } else {
          console.error(`❌ No email found for user ${endpoint.user_id}`);
        }
      } else {
        console.log(`⚠️ Failure count (${failureCount}) below threshold (${consecutiveFailuresThreshold}), waiting...`);
      }
    } else if (status === "success" && previousStatus === "failure") {
      // Endpoint recovered!
      console.log(`✅ Endpoint ${endpoint.name} recovered!`);

      if (sendRecoveryNotifications && userEmail) {
        await sendRecoveryNotification(
          supabase,
          endpointId,
          endpoint.name,
          endpoint.url,
          userEmail
        );
      }
    }

    return {
      success: true,
      check,
    };
  } catch (error: any) {
    console.error(`❌ Error checking endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: {
        message: error.message || "Failed to check endpoint",
        code: error.code || 'CHECK_FAILED',
        details: error.details || null
      }
    };
  }
}

// Handle escalation notifications for sustained outages
async function handleEscalation(
  supabase: any,
  endpointId: string,
  endpointName: string,
  endpointUrl: string,
  errorMessage: string,
  userEmail: string,
  escalationIntervalMinutes: number
) {
  try {
    // Check if we need to send an escalation
    const escalationTime = new Date();
    escalationTime.setMinutes(escalationTime.getMinutes() - escalationIntervalMinutes);

    const { data: recentNotifications } = await supabase
      .from("notifications")
      .select("id, escalation_count, sent_at")
      .eq("endpoint_id", endpointId)
      .in("notification_type", ["failure", "escalation"])
      .order("sent_at", { ascending: false })
      .limit(1);

    const lastNotification = recentNotifications?.[0];

    if (!lastNotification) return;

    const lastSentAt = new Date(lastNotification.sent_at);
    const currentEscalationCount = lastNotification.escalation_count || 0;

    // Check if enough time has passed and we haven't hit max escalations
    if (lastSentAt < escalationTime && currentEscalationCount < 4) {
      console.log(`📢 Sending escalation notification (level ${currentEscalationCount + 1}/4)`);

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "notifications@yourdomain.com",
        to: userEmail,
        subject: `🔴 ESCALATION (${currentEscalationCount + 1}/4): ${endpointName} Still Down`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #991b1b;">⚠️ Escalation Alert - Level ${currentEscalationCount + 1}</h2>
            <p>Your endpoint <strong>${endpointName}</strong> has been down for an extended period.</p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #991b1b; padding: 16px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #7f1d1d;">Details</h3>
              <p><strong>Endpoint:</strong> ${endpointName}</p>
              <p><strong>URL:</strong> <code>${endpointUrl}</code></p>
              <p><strong>Error:</strong> ${errorMessage}</p>
              <p><strong>Escalation Level:</strong> ${currentEscalationCount + 1} of 4</p>
            </div>

            <p style="color: #dc2626; font-weight: bold;">This requires immediate attention!</p>
          </div>
        `,
      });

      // Record the escalation
      await supabase
        .from("notifications")
        .insert({
          endpoint_id: endpointId,
          notification_type: "escalation",
          recipient_email: userEmail,
          escalation_count: currentEscalationCount + 1,
          incident_id: lastNotification.incident_id,
        });

      console.log(`📧 Escalation notification sent (level ${currentEscalationCount + 1})`);
    }
  } catch (error) {
    console.error("Error handling escalation:", error);
  }
}

// Send recovery notification when endpoint comes back up
async function sendRecoveryNotification(
  supabase: any,
  endpointId: string,
  endpointName: string,
  endpointUrl: string,
  userEmail: string
) {
  try {
    console.log(`💚 Sending recovery notification for ${endpointName}`);

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "notifications@yourdomain.com",
      to: userEmail,
      subject: `✅ Endpoint Recovered: ${endpointName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Endpoint Recovery Alert</h2>
          <p>Great news! Your endpoint <strong>${endpointName}</strong> is back online.</p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Details</h3>
            <p><strong>Endpoint:</strong> ${endpointName}</p>
            <p><strong>URL:</strong> <code>${endpointUrl}</code></p>
            <p><strong>Recovered at:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>Your monitoring continues as normal.</p>
        </div>
      `,
    });

    // Record the recovery notification
    await supabase
      .from("notifications")
      .insert({
        endpoint_id: endpointId,
        notification_type: "recovery",
        recipient_email: userEmail,
      });

    console.log(`📧 Recovery notification sent for ${endpointName}`);
  } catch (error) {
    console.error("Error sending recovery notification:", error);
  }
}