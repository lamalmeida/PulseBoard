"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Get the total count of active endpoints across all users
 * This is used for public stats on the landing page
 */
export async function getEndpointCount(): Promise<number> {
    try {
        const supabase = createAdminClient();

        const { count, error } = await supabase
            .from("endpoints")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        if (error) {
            console.error("Error fetching endpoint count:", error);
            return 0;
        }

        return count ?? 0;
    } catch (error) {
        console.error("Error in getEndpointCount:", error);
        return 0;
    }
}

/**
 * Get total number of checks performed across all endpoints
 * This can be used for public stats on the landing page
 */
export async function getTotalChecksCount(): Promise<number> {
    try {
        const supabase = createAdminClient();

        const { count, error } = await supabase
            .from("checks")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error fetching checks count:", error);
            return 0;
        }

        return count ?? 0;
    } catch (error) {
        console.error("Error in getTotalChecksCount:", error);
        return 0;
    }
}

/**
 * Get aggregated stats for the landing page
 */
export async function getPublicStats(): Promise<{
    activeEndpoints: number;
    totalChecks: number;
    uptime: number;
}> {
    try {
        const supabase = createAdminClient();

        // Get active endpoint count
        const { count: endpointCount } = await supabase
            .from("endpoints")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

        // Get total checks count
        const { count: checksCount } = await supabase
            .from("checks")
            .select("*", { count: "exact", head: true });

        // Calculate average uptime from recent checks (last 24 hours)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { data: recentChecks } = await supabase
            .from("checks")
            .select("status")
            .gte("checked_at", twentyFourHoursAgo.toISOString());

        let uptime = 99.9; // Default uptime
        if (recentChecks && recentChecks.length > 0) {
            const successfulChecks = recentChecks.filter(
                (check) => check.status === "success"
            ).length;
            uptime = (successfulChecks / recentChecks.length) * 100;
        }

        return {
            activeEndpoints: endpointCount ?? 0,
            totalChecks: checksCount ?? 0,
            uptime: Number(uptime.toFixed(1)),
        };
    } catch (error) {
        console.error("Error in getPublicStats:", error);
        return {
            activeEndpoints: 0,
            totalChecks: 0,
            uptime: 99.9,
        };
    }
}
