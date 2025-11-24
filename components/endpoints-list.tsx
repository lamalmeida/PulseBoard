"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  Loader2,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Clock,
  MoreVertical,
  Pause,
  Play,
  Pencil,
  Trash2,
} from "lucide-react";
import { checkEndpoint } from "@/app/actions/check-endpoint";
import {
  deleteEndpoint,
  toggleEndpointStatus,
} from "@/app/actions/endpoint-actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import React from "react";
import { EditEndpointDialog } from "@/components/edit-endpoint-dialog";

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

type HistoricalCheck = {
  id: string;
  status: string;
  response_time: number;
  checked_at: string;
  status_code: number | null;
};

export function EndpointsList({
  endpoints,
}: {
  endpoints: EndpointWithStatus[];
}) {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkResults, setCheckResults] = useState<Record<string, any>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<
    Record<string, HistoricalCheck[]>
  >({});
  const [totalChecks, setTotalChecks] = useState<Record<string, number>>({});
  const [loadingHistory, setLoadingHistory] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<
    Record<string, "toggle" | "delete" | undefined>
  >({});
  const router = useRouter();
  const supabase = createClient();

  // Fetch historical data for an endpoint
  const fetchHistoricalData = async (endpointId: string) => {
    if (!endpointId || endpointId === "undefined") return;
    if (historicalData[endpointId]) return; // Already loaded

    setLoadingHistory(endpointId);
    try {
      // Fetch limited history for display
      const { data, error } = await supabase
        .from("checks")
        .select("id, status, response_time, checked_at, status_code")
        .eq("endpoint_id", endpointId)
        .order("checked_at", { ascending: false })
        .limit(10);

      // Fetch total count
      const { count, error: countError } = await supabase
        .from("checks")
        .select("*", { count: "exact", head: true })
        .eq("endpoint_id", endpointId);

      if (!error && data) {
        setHistoricalData((prev) => ({
          ...prev,
          [endpointId]: data,
        }));
      }

      if (!countError && count !== null) {
        setTotalChecks((prev) => ({
          ...prev,
          [endpointId]: count,
        }));
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoadingHistory(null);
    }
  };

  const handleToggleEndpoint = async (endpointId: string) => {
    if (!endpointId || endpointId === "undefined") {
      alert("Invalid endpoint ID.");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [endpointId]: "toggle" }));
    try {
      const result = await toggleEndpointStatus(endpointId);

      if (!result.success) {
        console.error("Toggle failed:", result.error);
        alert(`Failed to update endpoint: ${result.error}`);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling endpoint:", error);
      alert("Failed to update endpoint status");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[endpointId];
        return next;
      });
    }
  };

  const handleDeleteEndpoint = async (
    endpointId: string,
    endpointName: string
  ) => {
    if (!endpointId || endpointId === "undefined") {
      alert("Invalid endpoint ID.");
      return;
    }

    const confirmed = window.confirm(
      `Remove \"${endpointName}\"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setActionLoading((prev) => ({ ...prev, [endpointId]: "delete" }));
    try {
      const result = await deleteEndpoint(endpointId);

      if (!result.success) {
        console.error("Delete failed:", result.error);
        alert(`Failed to delete endpoint: ${result.error}`);
        return;
      }

      setExpandedId((prev) => (prev === endpointId ? null : prev));
      router.refresh();
    } catch (error) {
      console.error("Error deleting endpoint:", error);
      alert("Failed to delete endpoint");
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[endpointId];
        return next;
      });
    }
  };

  const handleRowClick = (endpointId: string) => {
    if (!endpointId || endpointId === "undefined") return;

    if (expandedId === endpointId) {
      setExpandedId(null);
    } else {
      setExpandedId(endpointId);
      fetchHistoricalData(endpointId);
    }
  };

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground mb-4">
          No endpoints yet. Add your first endpoint to start monitoring!
        </p>
      </div>
    );
  }

  const handleCheckNow = async (
    endpointId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent row expansion
    if (!endpointId || endpointId === "undefined") {
      alert("Invalid endpoint ID.");
      return;
    }

    setCheckingId(endpointId);
    try {
      const result = await checkEndpoint(endpointId);

      if (result.success && result.check) {
        setCheckResults((prev) => ({
          ...prev,
          [endpointId]: result.check,
        }));
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

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusBadge = (endpoint: EndpointWithStatus) => {
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
        <Badge
          variant="secondary"
          className="gap-1 bg-green-500/10 text-green-600 border-green-500/20"
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Online
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-red-500/10 text-red-600 border-red-500/20"
      >
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Offline
      </Badge>
    );
  };

  const calculateUptime = (checks: HistoricalCheck[]) => {
    if (checks.length === 0) return "N/A";
    const successCount = checks.filter((c) => c.status === "success").length;
    const percentage = (successCount / checks.length) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const calculateAvgResponseTime = (checks: HistoricalCheck[]) => {
    if (checks.length === 0) return "N/A";
    const successChecks = checks.filter((c) => c.status === "success");
    if (successChecks.length === 0) return "N/A";
    const avg =
      successChecks.reduce((sum, c) => sum + c.response_time, 0) /
      successChecks.length;
    return `${Math.round(avg)}ms`;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {endpoints.map((endpoint) => {
              if (!endpoint?.id || endpoint.id === "undefined") return null;

              const localCheck = checkResults[endpoint.id];
              const check = localCheck || endpoint.lastCheck;
              const isChecking = checkingId === endpoint.id;
              const isExpanded = expandedId === endpoint.id;
              const history = historicalData[endpoint.id] || [];
              const isLoadingHistory = loadingHistory === endpoint.id;
              const currentAction = actionLoading[endpoint.id];
              const isToggling = currentAction === "toggle";
              const isDeleting = currentAction === "delete";

              return (
                <React.Fragment key={endpoint.id}>
                  <tr
                    className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(endpoint.id)}
                  >
                    <td className="p-2 align-middle">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-2 align-middle font-medium">
                      {endpoint.name}
                    </td>
                    <td className="p-2 align-middle text-muted-foreground max-w-md truncate">
                      {endpoint.url}
                    </td>
                    <td className="p-2 align-middle">
                      {getStatusBadge(endpoint)}
                    </td>
                    <td className="p-2 align-middle text-muted-foreground">
                      {check?.response_time ? `${check.response_time}ms` : "-"}
                    </td>
                    <td className="p-2 align-middle text-muted-foreground">
                      {formatInterval(endpoint.check_interval)}
                    </td>
                    {/* <td className="p-2 align-middle text-muted-foreground">
                      {formatDate(endpoint.created_at)}
                    </td> */}
                    <td
                      className="p-2 align-middle text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleCheckNow(endpoint.id, e)}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <EditEndpointDialog
                              endpoint={{
                                id: endpoint.id,
                                name: endpoint.name,
                                url: endpoint.url,
                                check_interval: endpoint.check_interval,
                              }}
                              trigger={
                                <DropdownMenuItem className="gap-2" onSelect={(e) => e.preventDefault()}>
                                  <Pencil className="h-4 w-4" />
                                  Edit endpoint
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuItem
                              className="gap-2"
                              disabled={isToggling}
                              onSelect={() => {
                                void handleToggleEndpoint(endpoint.id);
                              }}
                            >
                              {endpoint.is_active ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              {isToggling
                                ? "Updating..."
                                : endpoint.is_active
                                  ? "Pause monitoring"
                                  : "Resume monitoring"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-destructive focus:text-destructive"
                              disabled={isDeleting}
                              onSelect={() => {
                                void handleDeleteEndpoint(
                                  endpoint.id,
                                  endpoint.name
                                );
                              }}
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              {isDeleting ? "Removing..." : "Remove endpoint"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${endpoint.id}-expanded`}>
                      <td colSpan={8} className="bg-muted/30 p-6">
                        {isLoadingHistory ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">
                              Loading history...
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="border rounded-lg p-4 bg-background">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                  <TrendingUp className="h-4 w-4" />
                                  Uptime (Last 10 checks)
                                </div>
                                <div className="text-2xl font-bold">
                                  {calculateUptime(history)}
                                </div>
                              </div>
                              <div className="border rounded-lg p-4 bg-background">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                  <Clock className="h-4 w-4" />
                                  Avg Response Time
                                </div>
                                <div className="text-2xl font-bold">
                                  {calculateAvgResponseTime(history)}
                                </div>
                              </div>
                              <div className="border rounded-lg p-4 bg-background">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                  <Activity className="h-4 w-4" />
                                  Total Checks
                                </div>
                                <div className="text-2xl font-bold">
                                  {totalChecks[endpoint.id] ?? 0}
                                </div>
                              </div>
                            </div>

                            {/* History */}
                            <div>
                              <h3 className="text-sm font-semibold mb-3">
                                Recent Check History
                              </h3>
                              <div className="space-y-2">
                                {history.length === 0 ? (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    No check history available yet
                                  </p>
                                ) : (
                                  history
                                    .slice(0, 5)
                                    .map((historyCheck) => (
                                      <div
                                        key={historyCheck.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-background"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Badge
                                            variant="secondary"
                                            className={
                                              historyCheck.status === "success"
                                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                : "bg-red-500/10 text-red-600 border-red-500/20"
                                            }
                                          >
                                            {historyCheck.status === "success"
                                              ? "Online"
                                              : "Offline"}
                                          </Badge>
                                          <span className="text-sm text-muted-foreground">
                                            {formatRelativeTime(
                                              historyCheck.checked_at
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                          {historyCheck.status === "success" && (
                                            <span className="text-muted-foreground">
                                              {historyCheck.response_time}ms
                                            </span>
                                          )}
                                          {historyCheck.status_code && (
                                            <Badge variant="outline">
                                              {historyCheck.status_code}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                )}
                              </div>
                            </div>

                            {/* See More Button */}
                            <div className="flex justify-center pt-2">
                              {endpoint?.id && endpoint.id !== "undefined" ? (
                                <Button asChild variant="outline">
                                  <Link
                                    href={`/protected/endpoints/${endpoint.id}`}
                                  >
                                    See Full Details & History
                                  </Link>
                                </Button>
                              ) : (
                                <Button variant="outline" disabled>
                                  Invalid Endpoint
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
