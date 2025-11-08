import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EndpointsList } from "@/components/endpoints-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function EndpointsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch user's endpoints with their last check
  const { data: endpoints, error: fetchError } = await supabase
    .from("endpoints")
    .select(`
      *,
      checks:checks(
        status,
        response_time,
        checked_at
      )
    `)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("Error fetching endpoints:", fetchError);
  }

  // Transform the data to get only the last check for each endpoint
  const endpointsWithLastCheck = endpoints?.map((endpoint: any) => {
    const checks = endpoint.checks || [];
    const lastCheck = checks.length > 0 
      ? checks.sort((a: any, b: any) => 
          new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
        )[0]
      : null;

    return {
      ...endpoint,
      lastCheck,
      checks: undefined, // Remove the checks array from the object
    };
  });

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
}