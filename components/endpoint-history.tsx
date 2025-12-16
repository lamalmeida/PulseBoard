"use client";

import { Check, X, Clock, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (status === "error") {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
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
      <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
        <div className="px-4 py-12 sm:px-6 flex flex-col items-center justify-center text-center">
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No checks yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-foreground">
          Check History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheckNow}
          disabled={isChecking}
        >
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Activity className="h-4 w-4 mr-2" />
          )}
          Run Check
        </Button>
      </div>
      <div className="border-t border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Response Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {checks.map((check) => (
                <tr key={check.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-5 w-5">
                        {getStatusIcon(check.status)}
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${check.status === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : check.status === 'error'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          }`}
                      >
                        {check.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatDate(check.checked_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {check.response_time}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {check.status_code || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                    {check.error_message || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}