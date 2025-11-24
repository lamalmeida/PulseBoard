"use client";

import { useTheme } from "next-themes";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
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
  const { theme } = useTheme();
  const [chartColors, setChartColors] = useState({
    primary: "rgb(0, 0, 0)",
    background: "rgb(255, 255, 255)", // Added to create the 'halo' effect
    border: "rgb(200, 200, 200)",
    popover: "rgb(255, 255, 255)",
    popoverForeground: "rgb(0, 0, 0)",
    mutedForeground: "rgb(100, 100, 100)",
    muted: "rgb(240, 240, 240)",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      const getColor = (varName: string) => {
        const value = computedStyle.getPropertyValue(varName).trim();
        if (!value) return "";
        return `hsl(${value.replaceAll(" ", ",")})`;
      };

      setChartColors({
        primary: getColor("--primary"),
        background: getColor("--background"), // Fetches the card/page background color
        border: getColor("--border"),
        popover: getColor("--popover"),
        popoverForeground: getColor("--popover-foreground"),
        mutedForeground: getColor("--muted-foreground"),
        muted: getColor("--muted"),
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [theme]);

  // Filter checks from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentChecks = checks
    .filter(check => new Date(check.checked_at) >= thirtyDaysAgo)
    .sort(
      (a, b) =>
        new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    );

  const chartData: ChartData<"line"> = {
    labels: recentChecks.map((check) => {
      const date = new Date(check.checked_at);
      // Format based on data density
      if (recentChecks.length > 100) {
        // For many data points, show just date
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (recentChecks.length > 50) {
        // For moderate data points, show date and hour
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
      } else {
        // For fewer data points, show full date and time
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    }),
    datasets: [
      {
        label: "Response Time (ms)",
        data: recentChecks.map((check) => check.response_time),
        borderColor: chartColors.primary,
        // Made solid to hide the line behind
        backgroundColor: chartColors.primary,
        pointBackgroundColor: chartColors.primary,
        // Adds a small background-colored border to the dot for contrast
        pointBorderColor: chartColors.background,
        pointBorderWidth: 2,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y",
        borderDash: [5, 5],
      },
      {
        label: "Status",
        data: recentChecks.map((check) => (check.status === "success" ? 1 : 0)),
        borderColor: "hsl(142.1, 70.6%, 45.3%)",
        // Made solid green
        backgroundColor: "hsl(142.1, 70.6%, 45.3%)",
        pointBackgroundColor: "hsl(142.1, 70.6%, 45.3%)",
        pointBorderColor: chartColors.background,
        pointBorderWidth: 2,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
        borderDash: [5, 5],
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: chartColors.border,
        },
        ticks: {
          color: chartColors.mutedForeground,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: chartColors.border,
        },
        ticks: {
          color: chartColors.mutedForeground,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 0,
        max: 1.1, // Buffer to prevent cutoff
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1,
          color: chartColors.mutedForeground,
          callback: (value) => (value === 1 ? "Up" : "Down"),
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: chartColors.popoverForeground,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: chartColors.popover,
        titleColor: chartColors.popoverForeground,
        bodyColor: chartColors.popoverForeground,
        borderColor: chartColors.border,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (context.datasetIndex === 0) {
              return `${label}: ${value}ms`;
            }
            return `${label}: ${value === 1 ? "Up" : "Down"}`;
          },
          afterBody: (context) => {
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
      <h2 className="text-lg font-semibold mb-4 text-foreground">
        Performance Metrics
      </h2>
      <div className="h-80">
        <Line key={theme} data={chartData} options={options} />
      </div>
    </div>
  );
}