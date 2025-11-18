"use server";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotificationResult {
  success: boolean;
  message: string;
  emailSent?: boolean;
}

export async function sendFailureNotification(
  endpointId: string,
  endpointName: string,
  endpointUrl: string,
  errorMessage: string,
  recipientEmail: string
): Promise<NotificationResult> {
  const supabase = await createAdminClient();

  try {
    // Check if we've already sent a notification for this endpoint today
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const { data: recentNotifications, error: checkError } = await supabase
      .from("notifications")
      .select("id, sent_at")
      .eq("endpoint_id", endpointId)
      .eq("notification_type", "failure")
      .gte("sent_at", twentyFourHoursAgo.toISOString())
      .order("sent_at", { ascending: false })
      .limit(1);

    if (checkError) {
      console.error("Error checking recent notifications:", checkError);
      return {
        success: false,
        message: `Failed to check notification history: ${checkError.message}`,
      };
    }

    // If a notification was sent in the last 24 hours, skip
    if (recentNotifications && recentNotifications.length > 0) {
      console.log(
        `⏭️ Skipping notification for ${endpointName} - already sent within 24h`
      );
      return {
        success: true,
        message: "Notification already sent within 24 hours",
        emailSent: false,
      };
    }

    // Send the email notification
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "notifications@yourdomain.com",
      to: recipientEmail,
      subject: `🚨 Endpoint Down: ${endpointName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Endpoint Failure Alert</h2>
          <p>Your endpoint <strong>${endpointName}</strong> has failed a health check.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #991b1b;">Details</h3>
            <p><strong>Endpoint:</strong> ${endpointName}</p>
            <p><strong>URL:</strong> <code>${endpointUrl}</code></p>
            <p><strong>Error:</strong> ${errorMessage}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>Please investigate this issue as soon as possible.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated notification from PulseBoard. 
            You will not receive another notification for this endpoint for the next 24 hours.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return {
        success: false,
        message: `Failed to send email: ${emailError.message}`,
      };
    }

    console.log("✅ Email sent successfully:", emailData);

    // Record the notification in the database
    const { error: insertError } = await supabase
      .from("notifications")
      .insert({
        endpoint_id: endpointId,
        notification_type: "failure",
        recipient_email: recipientEmail,
      });

    if (insertError) {
      console.error("Error recording notification:", insertError);
      // Email was sent, but we couldn't record it
      return {
        success: true,
        message: "Email sent but failed to record notification",
        emailSent: true,
      };
    }

    console.log(`📧 Failure notification sent for ${endpointName}`);

    return {
      success: true,
      message: "Notification sent successfully",
      emailSent: true,
    };
  } catch (error: any) {
    console.error("Error in sendFailureNotification:", error);
    return {
      success: false,
      message: error.message || "Unknown error occurred",
    };
  }
}