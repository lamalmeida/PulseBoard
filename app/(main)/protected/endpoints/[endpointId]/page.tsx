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
import { WorkerAPI } from "@/lib/api-client";

export default async function EndpointDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ endpointId: string }> | { endpointId: string };
}) {
  const params = await Promise.resolve(paramsPromise);
  const endpointId = params?.endpointId;

  if (!endpointId) {
    redirect('/protected/endpoints');
  }

  const supabase = await createClient();

  // 1. Check for authenticated user
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  try {
    // 2. Fetch Data in Parallel
    const [endpoint, checks, statsData] = await Promise.all([
      WorkerAPI.getEndpoint(endpointId),
      WorkerAPI.getChecks(endpointId, 100), // Fetch last 100 checks for graph/history
      WorkerAPI.getStats(endpointId),
    ]);

    if (!endpoint) {
      redirect("/protected/endpoints");
    }

    const stats = statsData?.data || {
      uptime_24h: 0,
      avg_response_time_24h: 0,
      total_checks_24h: 0,
      successful_checks_24h: 0,
    };

    // Calculate total offline (failed checks) from the fetched checks for the card
    // Note: API stats gives 24h stats. For "Total Outages" we might want all time or 24h.
    // Let's use the count of failed checks in the fetched list (last 100) or calculate from stats if possible.
    // Stats doesn't explicitly have "failure count" but total - successful.
    const failures24h = (stats.total_checks_24h || 0) - (stats.successful_checks_24h || 0);

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
                Uptime (24h)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uptime_24h}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Response (24h)
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avg_response_time_24h > 0 ? `${stats.avg_response_time_24h}ms` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outages (24h)</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{failures24h}</div>
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
  } catch (error: any) {
    console.error("Error loading endpoint details:", error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Endpoint</h1>
        <p className="text-muted-foreground mb-4">{error.message || "Unknown error occurred"}</p>
        <pre className="bg-muted p-4 rounded text-left overflow-auto max-w-2xl mx-auto text-xs">
          {JSON.stringify(error, null, 2)}
        </pre>
        <Button asChild className="mt-8">
          <Link href="/protected/endpoints">Back to List</Link>
        </Button>
      </div>
    );
  }
}