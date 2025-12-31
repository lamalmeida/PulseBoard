"use client";

import { useTheme } from "next-themes";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/atoms/card";
import { Activity } from "lucide-react";

type Check = {
  id: string;
  status: string;
  response_time: number;
  checked_at: string;
  status_code?: number;
};

export function EndpointMetrics({ checks }: { checks: Check[] }) {
  const { theme } = useTheme();

  // Filter checks from the last 30 days and sort by date
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentChecks = checks
    .filter(check => new Date(check.checked_at) >= thirtyDaysAgo)
    .sort(
      (a, b) =>
        new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    );

  const data = recentChecks.map(check => ({
    timestamp: new Date(check.checked_at).getTime(), // Unique key for XAxis
    time: new Date(check.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullDate: new Date(check.checked_at).toLocaleString(),
    latency: check.response_time,
    status: check.status,
    statusCode: check.status_code
  }));

  if (data.length === 0) {
    return (
      <Card className="border-border-subtle bg-surface-base/50">
        <CardContent className="px-4 py-12 flex flex-col items-center justify-center text-center">
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
      <CardHeader className="border-b border-border-subtle/50 pb-4">
        <div>
          <CardTitle className="text-text-main font-semibold">Response Time</CardTitle>
          <p className="text-text-muted text-xs mt-1">Average latency over time</p>
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
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' })}
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