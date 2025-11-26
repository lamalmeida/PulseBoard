import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";

async function handler() {
    try {
        console.log("🧹 Cleanup cron job triggered at:", new Date().toISOString());

        const supabase = await createAdminClient();

        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const threshold = thirtyDaysAgo.toISOString();

        console.log(`Deleting checks older than: ${threshold}`);

        const { count, error } = await supabase
            .from("checks")
            .delete({ count: "exact" })
            .lt("checked_at", threshold);

        if (error) {
            console.error("❌ Failed to delete old checks:", error);
            return Response.json(
                { error: `Failed to delete old checks: ${error.message}` },
                { status: 500 }
            );
        }

        console.log(`✅ Deleted ${count} old checks.`);

        return Response.json(
            {
                message: "Cleanup completed",
                deleted_count: count,
                threshold: threshold,
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Cleanup cron job error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export const POST = verifySignatureAppRouter(handler);
