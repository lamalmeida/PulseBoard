"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/atoms/card";
import { Activity } from "lucide-react";
import { getEndpointChecks } from "@/app/actions/endpoint-actions";

type Check = {
  id: string;
  status: string;
  response_time: number;
  checked_at: string;
  status_code?: number;
};

type TimeRange = '1h' | '1d' | '1w' | '1m' | '1q' | '1y';

export function EndpointMetrics({ checks: initialChecks, endpointId }: { checks: Check[], endpointId: string }) {
  const { theme } = useTheme();

  // State for time range and checks
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  const [checks, setChecks] = useState<Check[]>(initialChecks);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to determine fetch limit based on range
  const getLimitForRange = (range: TimeRange): number => {
    switch (range) {
      case '1h': return 120; // 60 mins approx
      case '1d': return 500;  // 1 day at 1min = 1440. Usually 5-10m intervals, so 500 plenty.
      case '1w': return 2500; // 7 days * 24h * 12 checks/h = 2016. Safety margin.
      case '1m': return 10000; // 30d * 24h * 12 = 8640.
      case '1q': return 30000; // 90d * ....
      case '1y': return 120000; // A lot. Server might need optimization but for now simple limit.
      default: return 2500;
    }
  };

  useEffect(() => {
    // If range is '1w' or '1d', we might just use initialChecks if they cover it?
    // But initialChecks fetching in page.tsx was 2000.
    // If user switches ranges, we might need to fetch more data.

    // Simple logic: Always re-filter or fetch on range change.
    // Optimization: If range is '1d' or '1w' and we have initial checks, we avoid fetch if successful.
    // Actually, simple is robust: Fetch if needed.
    // Since page loads with 2000 checks, '1w' is likely covered. 

    // Let's implement fetch-on-change for ranges > 1w or explicit refresh.
    // But for simplicity and correctness (in case '1w' needs fresher or more than 2000), let's just fetch if range is large,
    // OR just use client filtering on the big dataset if we had one.
    // Given the task, let's fetch on demand to be safe.

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Optimization: If going to 1d/1w and we likely have data, we could skip. 
        // But the requirement implies handling these ranges robustly. 
        // Let's check locally first if we have data deep enough? No, let's just fetch.
        const limit = getLimitForRange(timeRange);
        // Don't re-fetch if we are just initialized and range is default (1w) and checks are present?
        // Actually, initial render has '1w' and `initialChecks`.
        if (timeRange === '1w' && checks === initialChecks) {
          setIsLoading(false);
          return;
        }

        const newChecks = await getEndpointChecks(endpointId, limit);
        setChecks(newChecks);
      } catch (err) {
        console.error("Failed to fetch range data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, endpointId]);

  // Determine cutoff date based on range
  const now = new Date();
  const getCutoff = (range: TimeRange) => {
    const d = new Date();
    switch (range) {
      case '1h': d.setHours(d.getHours() - 1); break;
      case '1d': d.setDate(d.getDate() - 1); break;
      case '1w': d.setDate(d.getDate() - 7); break;
      case '1m': d.setMonth(d.getMonth() - 1); break;
      case '1q': d.setMonth(d.getMonth() - 3); break;
      case '1y': d.setFullYear(d.getFullYear() - 1); break;
    }
    return d;
  }

  const cutOffDate = getCutoff(timeRange);

  const recentChecks = checks
    .filter(check => new Date(check.checked_at) >= cutOffDate)
    .sort(
      (a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    );

  const data = recentChecks.map(check => ({
    timestamp: new Date(check.checked_at).getTime(),
    time: new Date(check.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullDate: new Date(check.checked_at).toLocaleString(),
    latency: check.response_time,
    status: check.status,
    statusCode: check.status_code
  }));

  // Axis Formatter
  const formatXAxis = (unixTime: number) => {
    const date = new Date(unixTime);
    if (timeRange === '1h') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeRange === '1d') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (timeRange === '1w') return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  /**
   * Helper component for the range buttons
   */
  const RangeButton = ({ range, label }: { range: TimeRange, label: string }) => (
    <button
      onClick={() => setTimeRange(range)}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === range
        ? "bg-brand text-white shadow-sm"
        : "text-text-muted hover:text-text-main hover:bg-surface-elevated"
        }`}
      disabled={isLoading}
    >
      {label}
    </button>
  );

  if (data.length === 0 && !isLoading) {
    return (
      <Card className="border-border-subtle bg-surface-base/50 h-full">
        <CardHeader className="border-b border-border-subtle/50 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-text-main font-semibold">Response Time</CardTitle>
            <p className="text-text-muted text-xs mt-1">Average latency over time</p>
          </div>
          <div className="flex items-center gap-1 bg-surface-base border border-border-subtle rounded-lg p-1">
            <RangeButton range="1h" label="1H" />
            <RangeButton range="1d" label="1D" />
            <RangeButton range="1w" label="1W" />
            <RangeButton range="1m" label="1M" />
            <RangeButton range="1q" label="3M" />
            <RangeButton range="1y" label="1Y" />
          </div>
        </CardHeader>
        <CardContent className="px-4 py-12 flex flex-col items-center justify-center text-center h-[350px]">
          <Activity className="h-12 w-12 text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-main mb-2">No data available</h3>
          <p className="text-text-muted mb-6 max-w-sm">
            There is no performance data available for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full border-border-subtle bg-surface-base/50">
      <CardHeader className="border-b border-border-subtle/50 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-text-main font-semibold">Response Time</CardTitle>
          <p className="text-text-muted text-xs mt-1">Average latency over time</p>
        </div>
        <div className="flex items-center gap-1 bg-surface-base border border-border-subtle rounded-lg p-1">
          <RangeButton range="1h" label="1H" />
          <RangeButton range="1d" label="1D" />
          <RangeButton range="1w" label="1W" />
          <RangeButton range="1m" label="1M" />
          <RangeButton range="1q" label="3M" />
          <RangeButton range="1y" label="1Y" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--brand))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--brand))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={false}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))', opacity: 0.2 }}
              dy={10}
              minTickGap={30}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}ms`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--popover-foreground))',
                borderRadius: '12px',
                borderWidth: '1px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '5 5' }}
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: any) => [`${value}ms`, 'Latency']}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="hsl(var(--brand))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLatency)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}