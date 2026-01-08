"use client";

import { Check, X, Clock, Activity, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/ui/atoms/button";
import { Badge, type BadgeVariant } from "@/ui/atoms/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/atoms/table";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/ui/atoms/card";
import { triggerCheck } from "@/app/actions/endpoint-actions";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

type Check = {
  id: string;
  status: string;
  response_time: number;
  checked_at: string;
  status_code?: number;
  error_message?: string;
  num_checks?: number;
};

export function EndpointHistoryTable({
  checks,
  endpointId
}: {
  checks: Check[];
  endpointId: string;
}) {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    // Format: Dec 30, 10:42 PM
    return new Date(dateString).toLocaleTimeString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const mapStatusToVariant = (status: string, statusCode?: number): BadgeVariant => {
    if (status === 'success') return 'success';
    if (status === 'error') return 'error';
    if (statusCode && statusCode >= 500) return 'error';
    if (statusCode && statusCode >= 400) return 'warning';
    return 'neutral';
  };

  const handleCheckNow = async () => {
    if (!endpointId) return;

    setIsChecking(true);
    try {
      const result = await triggerCheck(endpointId);

      if (result.success) {
        toast.success("Check completed successfully");
        router.refresh();
      } else {
        toast.error(`Check failed: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Failed to check endpoint");
    } finally {
      setIsChecking(false);
    }
  };

  if (checks.length === 0) {
    return (
      <Card className="border-border-subtle bg-surface-base">
        <CardContent className="px-4 py-12 flex flex-col items-center justify-center text-center">
          <Activity className="h-12 w-12 text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-main mb-2">No checks yet</h3>
          <p className="text-text-muted mb-6 max-w-sm">
            This endpoint hasn't been checked yet. Run a manual check to verify its status.
          </p>
          <Button
            onClick={handleCheckNow}
            disabled={isChecking}
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            Run Check Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border-subtle bg-surface-base">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border-subtle/50 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-text-main">Recent Checks</CardTitle>
          <Badge variant="neutral">{checks.length} Total</Badge>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCheckNow}
          disabled={isChecking}
          className="gap-2"
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-glass border-b border-border-subtle hover:bg-surface-glass">
              <TableHead className="px-6 py-3 text-xs font-medium text-text-dim uppercase tracking-widest">Status</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-text-dim uppercase tracking-widest">Method</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-text-dim uppercase tracking-widest">Latency</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-text-dim uppercase tracking-widest">Code</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-text-dim uppercase tracking-widest">Checks</TableHead>
              <TableHead className="px-6 py-3 text-xs font-medium text-text-dim uppercase tracking-widest">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.map((check) => (
              <TableRow key={check.id} className="group hover:bg-surface-highlight transition-colors border-b border-border-subtle">
                <TableCell className="px-6 py-4">
                  <Badge variant={mapStatusToVariant(check.status, check.status_code)}>
                    {check.status_code || check.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-sm text-text-main font-medium">GET</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-text-muted text-sm">{check.response_time}ms</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-text-dim text-sm">{check.status_code || "-"}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-text-muted text-sm">{check.num_checks || 1}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-text-dim text-sm">{formatDate(check.checked_at)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CardFooter className="pt-4 border-t-0">
        <span className="text-text-muted text-sm">Showing last {checks.length} checks</span>
      </CardFooter>
    </Card>
  );
}