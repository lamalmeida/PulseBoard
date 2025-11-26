import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EndpointHistoryTable } from "@/components/endpoint-history";
import { EndpointMetrics } from "@/components/endpoint-metrics";
import { Clock, Globe, ShieldAlert, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// This helper function can live in this file or be moved to utils
const calculateStats = (checks: any[]) => {
  if (checks.length === 0) {
    return { uptime: "N/A", avgResponse: "N/A", totalOffline: 0 };
  }
  const successChecks = checks.filter((c) => c.status === "success");
  const uptime = (successChecks.length / checks.length) * 100;
  const avgResponse =
    successChecks.length > 0
      ? successChecks.reduce((sum, c) => sum + c.response_time, 0) /
      successChecks.length
      : 0;
  const totalOffline = checks.length - successChecks.length;

  return {
    uptime: `${uptime.toFixed(1)}%`,
    avgResponse: avgResponse > 0 ? `${Math.round(avgResponse)}ms` : "N/A",
    totalOffline,
  };
};

export default async function EndpointDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ endpointId: string }> | { endpointId: string };
}) {
  // Ensure we have the actual params object, not a Promise
  const params = await Promise.resolve(paramsPromise);

  console.log('EndpointDetailPage params:', params);
  const endpointId = params?.endpointId;
  console.log('endpointId from params:', endpointId);

  if (!endpointId) {
    console.error('No endpointId found in params');
    redirect('/protected/endpoints');
  }

  const supabase = await createClient();

  // 1. Check for authenticated user
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }
  const userId = authData.claims.sub; // Get user ID from subject claim

  // 2. Fetch Endpoint Details
  const { data: endpoint, error: endpointError } = await supabase
    .from("endpoints")
    .select("*")
    .eq("id", params.endpointId)
    .eq("user_id", userId) // Security: ensure user owns this endpoint
    .single();

  // 3. If endpoint not found or not owned, redirect
  if (endpointError) {
    console.error("Error fetching endpoint", endpointError);
    redirect("/protected/endpoints");
  }

  if (!endpoint) {
    console.error("Endpoint not found:", endpointError);
    redirect("/protected/endpoints");
  }

  // 4. Fetch All Checks for this endpoint
  const { data: checks, error: checksError } = await supabase
    .from("checks")
    .select("*")
    .eq("endpoint_id", params.endpointId)
    .order("checked_at", { ascending: false });

  if (checksError) {
    console.error("Error fetching checks:", checksError);
    // Don't redirect, just show an error or empty state
  }

  const stats = calculateStats(checks || []);

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header */}
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4 gap-2">
          <Link href="/protected/endpoints">
            <ArrowLeft className="h-4 w-4" />
            Back to Endpoints
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">{endpoint.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <a
            href={endpoint.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {endpoint.url}
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Uptime (All time)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponse}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outages</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffline}</div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Graph */}
      <EndpointMetrics checks={checks || []} />

      {/* Full History Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Check History</h2>
        <EndpointHistoryTable checks={checks || []} endpointId={endpointId} />
      </div>
    </div>
  );
}