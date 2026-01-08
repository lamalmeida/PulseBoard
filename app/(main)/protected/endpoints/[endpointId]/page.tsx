import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
} from "@/ui/atoms/card";
import { EndpointHistoryTable } from "@/ui/molecules/endpoint-history";
import { EndpointMetrics } from "@/ui/molecules/endpoint-metrics";
import { StatCard } from "@/ui/molecules/stat-card";
import { ConfigCard } from "@/ui/organisms/config-card";
import { Clock, Globe, ShieldAlert, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/atoms/button";
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
      WorkerAPI.getChecks(endpointId, 2000), // Fetch last 2000 checks (approx 1 week at 5m intervals)
      WorkerAPI.getStats(endpointId),
    ]);

    if (!endpoint) {
      redirect("/protected/endpoints");
    }

    // Calculate stats from the fetched checks (handling aggregated checks)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const checks24h = (checks || []).filter((check: any) => new Date(check.checked_at) > oneDayAgo);

    let totalChecks24h = 0;
    let successfulChecks24h = 0;
    let totalLatency24h = 0;

    checks24h.forEach((check: any) => {
      const numChecks = check.num_checks || 1;
      totalChecks24h += numChecks;

      // Count successful checks
      // Note: We're assuming if an aggregated check is 'success', all contained checks were success
      // or that the status represents the majority/aggregate state.
      if (check.status === 'success') {
        successfulChecks24h += numChecks;
      }

      // Weighted latency
      totalLatency24h += (check.response_time || 0) * numChecks;
    });

    const uptime24h = totalChecks24h > 0
      ? ((successfulChecks24h / totalChecks24h) * 100).toFixed(2)
      : "0.00";

    const avgLatency24h = totalChecks24h > 0
      ? Math.round(totalLatency24h / totalChecks24h)
      : 0;

    const failures24h = totalChecks24h - successfulChecks24h;
    const errorRate = totalChecks24h > 0
      ? ((failures24h / totalChecks24h) * 100).toFixed(2)
      : "0.00";

    const stats = {
      uptime_24h: uptime24h,
      avg_response_time_24h: avgLatency24h,
      total_checks_24h: totalChecks24h,
      successful_checks_24h: successfulChecks24h
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between pl-12 lg:pl-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link href="/protected/endpoints">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-text-main">{endpoint.name || 'Unnamed Endpoint'}</h1>
                <span className={`flex h-2.5 w-2.5 rounded-full ${endpoint.status === 'operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Globe className="h-3.5 w-3.5" />
                <a href={endpoint.url} target="_blank" rel="noopener noreferrer" className="font-mono hover:text-brand transition-colors">
                  {endpoint.url}
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" asChild>
              <Link href={`/protected/endpoints/${endpointId}/edit`}>
                Edit Endpoint
              </Link>
            </Button>
            <Button variant="default">
              Check Now
            </Button>
          </div>
        </div>

        {/* Stats Cards Row (Full Width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Uptime (24h)"
            value={`${stats.uptime_24h}%`}
            icon={TrendingUp}
            // change="+0.01%" // Placeholder for now, real data needed
            positive={true}
          />
          <StatCard
            label="Avg Latency (24h)"
            value={`${stats.avg_response_time_24h}ms`}
            icon={Clock}
            // change="-12ms" // Placeholder for now, real data needed
            positive={true}
          />
          <StatCard
            label="Error Rate (24h)"
            value={`${errorRate}%`}
            icon={ShieldAlert}
            // change="+0%" // Placeholder
            positive={parseFloat(errorRate) === 0}
          />
          <StatCard
            label="Total Checks (24h)"
            value={stats.total_checks_24h}
            icon={Activity}
            // change="+12%" // Placeholder for now, real data needed
            positive={true}
          />
        </div>

        {/* Middle Section: Graph + Config */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          {/* Main Graph Column */}
          <div className="lg:col-span-5 h-full min-h-[300px]">
            <div className="h-full w-full">
              <EndpointMetrics checks={checks || []} endpointId={endpointId} />
            </div>
          </div>

          {/* Config Side Pane */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <ConfigCard endpoint={endpoint} />
            </div>
          </div>
        </div>

        {/* Full History Table Row */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-text-main">Often Checks</h3>
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