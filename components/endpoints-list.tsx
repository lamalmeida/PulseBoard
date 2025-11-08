"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Loader2 } from "lucide-react";
import { checkEndpoint } from "@/app/actions/check-endpoint";
import { useRouter } from "next/navigation";

type Endpoint = {
  id: string;
  name: string;
  url: string;
  check_interval: number;
  is_active: boolean;
  created_at: string;
};

type EndpointWithStatus = Endpoint & {
  lastCheck?: {
    status: string;
    response_time: number;
    checked_at: string;
  } | null;
};

export function EndpointsList({ endpoints }: { endpoints: EndpointWithStatus[] }) {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkResults, setCheckResults] = useState<Record<string, any>>({});
  const router = useRouter();

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground mb-4">
          No endpoints yet. Add your first endpoint to start monitoring!
        </p>
      </div>
    );
  }

  const handleCheckNow = async (endpointId: string) => {
    setCheckingId(endpointId);

    try {
      const result = await checkEndpoint(endpointId);

      if (result.success && result.check) {
        // Update local state with the new check result
        setCheckResults((prev) => ({
          ...prev,
          [endpointId]: result.check,
        }));

        // Refresh the page data
        router.refresh();
      } else {
        console.error("Check failed:", result.error);
        alert(`Check failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error checking endpoint:", error);
      alert("Failed to check endpoint");
    } finally {
      setCheckingId(null);
    }
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${seconds / 60}m`;
    return `${seconds / 3600}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (endpoint: EndpointWithStatus) => {
    // Check if we have a local check result
    const localCheck = checkResults[endpoint.id];
    const check = localCheck || endpoint.lastCheck;

    if (!check) {
      return (
        <Badge variant="secondary" className="gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          Unknown
        </Badge>
      );
    }

    if (check.status === "success") {
      return (
        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 border-green-500/20">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Online
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="gap-1 bg-red-500/10 text-red-600 border-red-500/20">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Offline
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Time</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => {
            const localCheck = checkResults[endpoint.id];
            const check = localCheck || endpoint.lastCheck;
            const isChecking = checkingId === endpoint.id;

            return (
              <TableRow key={endpoint.id}>
                <TableCell className="font-medium">{endpoint.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-md truncate">
                  {endpoint.url}
                </TableCell>
                <TableCell>{getStatusBadge(endpoint)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {check?.response_time ? `${check.response_time}ms` : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatInterval(endpoint.check_interval)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(endpoint.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCheckNow(endpoint.id)}
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Check Now
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}