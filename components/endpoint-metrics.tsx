"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Check = {
  id: string;
  status: string;
  response_time: number;
  checked_at: string;
  status_code?: number;
};

export function EndpointMetrics({ checks }: { checks: Check[] }) {
  // Get last 24 hours of data, or all data if less than 24 data points
  const recentChecks = checks
    .sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime())
    .slice(-24); // Last 24 checks

  const chartData = {
    labels: recentChecks.map(check => 
        new Date(check.checked_at).toLocaleTimeString()
    ),
    datasets: [
        {
        label: "Response Time (ms)",
        data: recentChecks.map(check => check.response_time),
        borderColor: "hsl(var(--primary))", // Use primary color from theme
        backgroundColor: "hsl(var(--primary) / 0.1)", // Semi-transparent primary
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y",
        },
        {
        label: "Status",
        data: recentChecks.map(check => check.status === "success" ? 1 : 0),
        borderColor: "hsl(142.1, 70.6%, 45.3%)",  // Success color
        backgroundColor: "hsl(142.1, 70.6%, 45.3% / 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
        borderDash: [5, 5],  // Make the status line dashed
        },
    ],
    };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: "index" as const,
        intersect: false,
    },
    scales: {
        x: {
        grid: {
            color: "hsl(var(--border))",
        },
        ticks: {
            color: "hsl(var(--muted-foreground))",
        },
        },
        y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
            color: "hsl(var(--border))",
        },
        ticks: {
            color: "hsl(var(--muted-foreground))",
        },
        },
        y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        min: 0,
        max: 1,
        grid: {
            drawOnChartArea: false,
        },
        ticks: {
            stepSize: 1,
            color: "hsl(var(--muted-foreground))",
            callback: (value: number) => (value === 1 ? "Up" : "Down"),
        },
        },
    },
    plugins: {
        legend: {
        labels: {
            color: "hsl(var(--foreground))",
            padding: 20,
        },
        },
        tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        callbacks: {
            label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.datasetIndex === 0) {
                return `${label}: ${value}ms`;
            }
            return `${label}: ${value === 1 ? 'Up' : 'Down'}`;
            },
            afterBody: (context: any) => {
            const index = context[0].dataIndex;
            const check = recentChecks[index];
            return [
                `Status: ${check.status.toUpperCase()}`,
                `Status Code: ${check.status_code || "N/A"}`,
                `Time: ${new Date(check.checked_at).toLocaleString()}`,
            ];
            },
        },
        },
    },
    };

  return (
    <div className="p-6 bg-card rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Performance Metrics</h2>
        <div className="h-80">
        <Line 
            options={{
            ...options,
            plugins: {
                ...options.plugins,
                legend: {
                labels: {
                    color: 'hsl(var(--foreground))',
                }
                }
            },
            scales: {
                ...options.scales,
                x: {
                ...options.scales.x,
                ticks: {
                    color: 'hsl(var(--muted-foreground))',
                },
                grid: {
                    color: 'hsl(var(--muted))',
                }
                },
                y: {
                ...options.scales.y,
                ticks: {
                    color: 'hsl(var(--muted-foreground))',
                },
                grid: {
                    color: 'hsl(var(--muted))',
                }
                },
                y1: {
                ...options.scales.y1,
                ticks: {
                    color: 'hsl(var(--muted-foreground))',
                    stepSize: 1,
                    callback: (value: string | number) => {
                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                        return numValue === 1 ? "Up" : "Down";
                    }
                }
                }
            }
            }} 
            data={chartData} 
        />
        </div>
    </div>
    );
}