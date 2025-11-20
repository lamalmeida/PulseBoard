import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkEndpoint } from "@/app/actions/check-endpoint";

async function handler() {
  try {
    console.log("🔄 Cron job triggered at:", new Date().toISOString());

    // Log environment info (without sensitive data)
    console.log('Environment:', {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
    });

    // Create Supabase server client
    console.log('Creating Supabase admin client...');
    const supabase = await createAdminClient();

    // Test database connection
    console.log('Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('endpoints')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      return Response.json(
        { error: `Database connection failed: ${testError.message}` },
        { status: 500 }
      );
    }
    console.log('✅ Database connection successful');

    // Fetch all active endpoints
    const { data: endpoints, error: endpointsError } = await supabase
      .from("endpoints")
      .select("id, name, url, check_interval")
      .eq("is_active", true);

    if (endpointsError) {
      console.error("❌ Error fetching endpoints:", endpointsError);
      return Response.json(
        { error: "Failed to fetch endpoints" },
        { status: 500 }
      );
    }

    if (!endpoints || endpoints.length === 0) {
      console.log("ℹ️ No active endpoints to check");
      return Response.json(
        { message: "No active endpoints", checked: 0 },
        { status: 200 }
      );
    }

    console.log(`📊 Found ${endpoints.length} active endpoints`);

    // Determine which endpoints need checking
    const now = Date.now();
    const endpointsToCheck = [];

    for (const endpoint of endpoints) {
      // Fetch the most recent check for this endpoint
      const { data: lastCheck } = await supabase
        .from("checks")
        .select("checked_at")
        .eq("endpoint_id", endpoint.id)
        .order("checked_at", { ascending: false })
        .limit(1)
        .single();

      // Calculate time since last check
      const lastCheckTime = lastCheck
        ? new Date(lastCheck.checked_at).getTime()
        : 0;
      const timeSinceLastCheck = (now - lastCheckTime) / 1000; // in seconds

      // Check if this endpoint is due for a check
      if (timeSinceLastCheck >= (endpoint.check_interval - 10)) {
        endpointsToCheck.push(endpoint);
        console.log(
          `✅ Endpoint "${endpoint.name}" is due for check (${Math.round(
            timeSinceLastCheck
          )}s since last check)`
        );
      } else {
        console.log(
          `⏭️ Skipping "${endpoint.name}" (checked ${Math.round(
            timeSinceLastCheck
          )}s ago, interval: ${endpoint.check_interval}s)`
        );
      }
    }

    if (endpointsToCheck.length === 0) {
      console.log("ℹ️ No endpoints are due for checking at this time");
      return Response.json(
        {
          message: "No endpoints due for checking",
          checked: 0,
          total: endpoints.length,
        },
        { status: 200 }
      );
    }

    console.log(`🚀 Checking ${endpointsToCheck.length} endpoints...`);

    // Perform checks for all due endpoints
    const checkPromises = endpointsToCheck.map(async (endpoint) => {
      try {
        const result = await checkEndpoint(endpoint.id);
        if (result.success) {
          console.log(`✅ Successfully checked: ${endpoint.name}`);
          return { id: endpoint.id, name: endpoint.name, success: true };
        } else {
          console.error(`❌ Failed to check ${endpoint.name}:`, result.error);
          return {
            id: endpoint.id,
            name: endpoint.name,
            success: false,
            error: result.error,
          };
        }
      } catch (error) {
        console.error(`❌ Error checking ${endpoint.name}:`, error);
        return {
          id: endpoint.id,
          name: endpoint.name,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    const results = await Promise.all(checkPromises);
    const successCount = results.filter((r) => r.success).length;

    console.log(
      `✨ Cron job completed: ${successCount}/${endpointsToCheck.length} checks successful`
    );

    return Response.json(
      {
        message: "Cron job completed",
        checked: endpointsToCheck.length,
        successful: successCount,
        failed: endpointsToCheck.length - successCount,
        total_active: endpoints.length,
        timestamp: new Date().toISOString(),
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Cron job error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// For local testing (bypasses signature verification)
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  // In development, bypass authentication for GET requests
  return handler();
}

// For production, use the authenticated POST endpoint
export const POST = process.env.NODE_ENV === "development"
  ? handler
  : verifySignatureAppRouter(handler);