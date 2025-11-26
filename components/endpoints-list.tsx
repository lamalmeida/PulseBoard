"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  ExternalLink,
  Pencil,
  Search,
} from "lucide-react";
import { checkEndpoint } from "@/app/actions/check-endpoint";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { EditEndpointDialog } from "@/components/edit-endpoint-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";

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

type SortConfig = {
  key: "name" | "status" | "last_check" | "next_check";
  direction: "asc" | "desc";
};

type FilterStatus = "all" | "online" | "offline" | "unknown";

export function EndpointsList({
  endpoints,
}: {
  endpoints: EndpointWithStatus[];
}) {
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkResults, setCheckResults] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleCheckNow = async (
    endpointId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!endpointId || endpointId === "undefined") {
      toast.error("Invalid endpoint ID");
      return;
    }

    setCheckingId(endpointId);
    try {
      const result = await checkEndpoint(endpointId);

      if (result.success && result.check) {
        toast.success(`Check completed for ${result.check.endpoint_id ? 'endpoint' : 'endpoint'}`);
        setCheckResults((prev) => ({
          ...prev,
          [endpointId]: result.check,
        }));
        router.refresh();
      } else {
        console.error("Check failed:", result.error);
        toast.error(`Check failed: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error checking endpoint:", error);
      const message = error instanceof Error ? error.message : "Failed to check endpoint";
      toast.error(message);
    } finally {
      setCheckingId(null);
    }
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

  const getNextCheckTime = (lastCheckDate: string | undefined, intervalSeconds: number) => {
    if (!lastCheckDate) return "Pending";

    const lastCheck = new Date(lastCheckDate);
    const nextCheck = new Date(lastCheck.getTime() + intervalSeconds * 1000);
    const now = new Date();

    const diffMs = nextCheck.getTime() - now.getTime();

    if (diffMs < 0) return "Due now";

    const diffMins = Math.ceil(diffMs / 60000);
    if (diffMins < 60) return `in ${diffMins}m`;

    const diffHours = Math.ceil(diffMs / 3600000);
    return `in ${diffHours}h`;
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

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedAndFilteredEndpoints = useMemo(() => {
    let filtered = [...endpoints];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (endpoint) =>
          endpoint.name.toLowerCase().includes(query) ||
          endpoint.url.toLowerCase().includes(query)
      );
    }

    // Filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((endpoint) => {
        const localCheck = checkResults[endpoint.id];
        const check = localCheck || endpoint.lastCheck;

        if (filterStatus === "unknown") return !check;
        if (filterStatus === "online") return check?.status === "success";
        if (filterStatus === "offline") return check?.status === "error";
        return true;
      });
    }

    // Sort
    return filtered.sort((a, b) => {
      const direction = sortConfig.direction === "asc" ? 1 : -1;

      if (sortConfig.key === "name") {
        return a.name.localeCompare(b.name) * direction;
      }

      if (sortConfig.key === "status") {
        const getStatusPriority = (e: EndpointWithStatus) => {
          const localCheck = checkResults[e.id];
          const check = localCheck || e.lastCheck;
          if (!check) return 0; // Unknown
          if (check.status === "error") return 2; // Offline (high priority)
          return 1; // Online
        };
        return (getStatusPriority(a) - getStatusPriority(b)) * direction;
      }

      if (sortConfig.key === "last_check") {
        const getCheckTime = (e: EndpointWithStatus) => {
          const localCheck = checkResults[e.id];
          const check = localCheck || e.lastCheck;
          return check?.checked_at ? new Date(check.checked_at).getTime() : 0;
        };
        return (getCheckTime(a) - getCheckTime(b)) * direction;
      }

      if (sortConfig.key === "next_check") {
        const getNextTime = (e: EndpointWithStatus) => {
          const localCheck = checkResults[e.id];
          const check = localCheck || e.lastCheck;
          if (!check?.checked_at) return 0;
          return new Date(check.checked_at).getTime() + e.check_interval * 1000;
        };
        return (getNextTime(a) - getNextTime(b)) * direction;
      }

      return 0;
    });
  }, [endpoints, filterStatus, sortConfig, checkResults, searchQuery]);

  const SortIcon = ({ columnKey }: { columnKey: SortConfig["key"] }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-1 items-center gap-2 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as FilterStatus)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        <SortIcon columnKey="name" />
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Endpoint
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <SortIcon columnKey="status" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                      onClick={() => handleSort("last_check")}
                    >
                      <div className="flex items-center">
                        Last Check
                        <SortIcon columnKey="last_check" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                      onClick={() => handleSort("next_check")}
                    >
                      <div className="flex items-center">
                        Next Check
                        <SortIcon columnKey="next_check" />
                      </div>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {sortedAndFilteredEndpoints.length === 0 && !searchQuery && filterStatus === 'all' && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        No endpoints found. Add your first endpoint to get started!
                      </td>
                    </tr>
                  )}

                  {sortedAndFilteredEndpoints.length === 0 && (searchQuery || filterStatus !== 'all') && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        No endpoints match your filters
                      </td>
                    </tr>
                  )}

                  {sortedAndFilteredEndpoints.map((endpoint) => {
                    if (!endpoint?.id || endpoint.id === "undefined") return null;

                    const localCheck = checkResults[endpoint.id];
                    const check = localCheck || endpoint.lastCheck;
                    const isChecking = checkingId === endpoint.id;

                    return (
                      <tr key={endpoint.id} className="even:bg-gray-50 dark:even:bg-gray-800/50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                          {endpoint.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {endpoint.url}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {getStatusBadge(endpoint)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {check?.checked_at ? formatRelativeTime(check.checked_at) : "Never"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {endpoint.is_active ? (
                            getNextCheckTime(check?.checked_at, endpoint.check_interval)
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Paused
                            </Badge>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <span className="isolate inline-flex rounded-md shadow-sm">
                            <Button
                              variant="outline"
                              size="sm"
                              className="relative inline-flex items-center rounded-l-md rounded-r-none border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                              onClick={(e) => handleCheckNow(endpoint.id, e)}
                              disabled={isChecking}
                            >
                              {isChecking ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Activity className="h-4 w-4" />
                              )}
                              <span className="ml-2 hidden sm:inline">Check</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="relative -ml-px inline-flex items-center rounded-none border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                              <Link href={`/protected/endpoints/${endpoint.id}`}>
                                <ExternalLink className="h-4 w-4" />
                                <span className="ml-2 hidden sm:inline">Details</span>
                              </Link>
                            </Button>
                            <EditEndpointDialog
                              endpoint={{
                                id: endpoint.id,
                                name: endpoint.name,
                                url: endpoint.url,
                                check_interval: endpoint.check_interval,
                                is_active: endpoint.is_active,
                              }}
                              trigger={
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="relative -ml-px inline-flex items-center rounded-r-md rounded-l-none border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="ml-2 hidden sm:inline">Edit</span>
                                </Button>
                              }
                            />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
