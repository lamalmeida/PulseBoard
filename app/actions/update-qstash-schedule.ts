"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { Client } from "@upstash/qstash";
import { revalidatePath } from "next/cache";

// This name must be unique and consistent for the upsert to work
const QSTASH_SCHEDULE_NAME = "pulseboard-cron-schedule";

export async function updateQStashSchedule() {
  try {
    // 1. Check for required environment variables
    if (!process.env.QSTASH_TOKEN) {
      throw new Error("QSTASH_TOKEN is not set in environment variables.");
    }
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;
    if (!appUrl) {
      throw new Error(
        "Application URL is not configured. Set NEXT_PUBLIC_APP_URL or VERCEL_URL."
      );
    }

    // 2. Initialize clients
    const qstash = new Client({ token: process.env.QSTASH_TOKEN });
    const supabase = await createSupabaseClient();

    // 3. Find the minimum check_interval from all active endpoints
    const { data: minIntervalData, error: minIntervalError } = await supabase
      .from("endpoints")
      .select("check_interval")
      .eq("is_active", true) // Only consider active endpoints
      .order("check_interval", { ascending: true })
      .limit(1)
      .maybeSingle(); // Use maybeSingle to handle null gracefully

    if (minIntervalError) {
      throw new Error(
        `Failed to query min interval: ${minIntervalError.message}`
      );
    }

    const minInterval = minIntervalData?.check_interval; // e.g., 60 (seconds)
    const targetUrl = new URL("/api/cron", appUrl).toString();

    if (minInterval) {
      // 4. If active endpoints exist, UPSERT the schedule
      // Convert interval in seconds to cron expression (minute-level granularity)
      // QStash cron format: "minute hour day month weekday"
      const intervalInMinutes = Math.max(1, Math.floor(minInterval / 60));
      const cronExpression = `*/${intervalInMinutes} * * * *`;

      // QStash v2 doesn't have upsert, so we use create with scheduleId
      // If schedule exists, create with same scheduleId updates it; otherwise creates new
      try {
        await qstash.schedules.create({
          scheduleId: QSTASH_SCHEDULE_NAME,
          destination: targetUrl,
          cron: cronExpression,
        });
        console.log(
          `QStash schedule "${QSTASH_SCHEDULE_NAME}" upserted to run every ${minInterval}s (cron: ${cronExpression}).`
        );
      } catch (createError: any) {
        // If schedule already exists, create should update it
        // Re-throw if it's a different error
        throw new Error(
          `Failed to create/update schedule: ${createError.message}`
        );
      }
    } else {
      // 5. If NO active endpoints exist, DELETE the schedule
      try {
        await qstash.schedules.delete(QSTASH_SCHEDULE_NAME);
        console.log(
          `QStash schedule "${QSTASH_SCHEDULE_NAME}" deleted as no active endpoints were found.`
        );
      } catch (deleteError: any) {
        // QStash client throws an error if the schedule is not found, which is fine.
        if (deleteError.message.includes("Schedule not found")) {
          console.log(
            `QStash schedule "${QSTASH_SCHEDULE_NAME}" not found. Nothing to delete.`
          );
        } else {
          throw deleteError; // Re-throw other errors
        }
      }
    }

    // 6. Revalidate paths that show endpoint data
    revalidatePath("/protected/endpoints");

  } catch (error) {
    console.error("Failed to update QStash schedule:", error);
    // Return error message but don't throw, to avoid breaking the UI
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}