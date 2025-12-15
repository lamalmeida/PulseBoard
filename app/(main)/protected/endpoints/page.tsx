import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EndpointsList } from "@/components/endpoints-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkerAPI } from "@/lib/api-client";

export default async function EndpointsPage() {
  const supabase = await createClient();

  // Check if user is authenticated (using supabase client for auth check only)
  // WorkerAPI also checks auth, but we want to redirect if not logged in
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  try {
    // Fetch user's endpoints
    const endpoints = await WorkerAPI.getEndpoints();

    // Fetch last check for each endpoint to populate status
    // We run these in parallel
    const endpointsWithLastCheck = await Promise.all(
      endpoints.map(async (endpoint: any) => {
        try {
          const checks = await WorkerAPI.getChecks(endpoint.id, 1);
          return {
            ...endpoint,
            lastCheck: checks && checks.length > 0 ? checks[0] : null,
          };
        } catch (err) {
          console.error(`Failed to fetch checks for ${endpoint.id}`, err);
          return {
            ...endpoint,
            lastCheck: null,
          };
        }
      })
    );

    return (
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Endpoints</h1>
            <p className="text-muted-foreground">
              Monitor and manage your API endpoints
            </p>
          </div>
          <Button asChild>
            <Link href="/protected/endpoints/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Endpoint
            </Link>
          </Button>
        </div>

        <EndpointsList endpoints={endpointsWithLastCheck || []} />
      </div>
    );
  } catch (error: any) {
    console.error("Error loading endpoints:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
        <div className="text-destructive font-semibold">Failed to load endpoints</div>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }
}