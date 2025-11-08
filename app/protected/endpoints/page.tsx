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

  // Fetch user's endpoints
  const { data: endpoints, error: fetchError } = await supabase
    .from("endpoints")
    .select("*")
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("Error fetching endpoints:", fetchError);
  }

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

      <EndpointsList endpoints={endpoints || []} />
    </div>
  );
}