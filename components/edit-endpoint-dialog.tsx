// components/edit-endpoint-dialog.tsx
"use client";

import { useState, type ReactElement } from "react";
import { updateEndpoint, toggleEndpointStatus, deleteEndpoint } from "@/app/actions/endpoint-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Pause, Play, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { validateCheckInterval } from "@/lib/rate-limits";
import { toast } from "@/lib/toast";

type EditEndpointDialogProps = {
  endpoint: {
    id: string;
    name: string;
    url: string;
    check_interval: number;
    is_active: boolean;
  };
  trigger?: ReactElement;
};

export function EditEndpointDialog({ endpoint, trigger }: EditEndpointDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(endpoint.name);
  const [url, setUrl] = useState(endpoint.url);
  const [interval, setInterval] = useState(endpoint.check_interval.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"toggle" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate check interval
      const intervalSeconds = parseInt(interval);
      const validation = validateCheckInterval(intervalSeconds);

      if (!validation.valid) {
        const errorMsg = validation.error || "Validation failed";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      const result = await updateEndpoint(endpoint.id, {
        name,
        url,
        check_interval: intervalSeconds,
      });

      if (result.success) {
        toast.success("Endpoint updated successfully");
        setOpen(false);
        router.refresh();
      } else {
        const errorMsg = result.error?.message || "Failed to update endpoint";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update endpoint";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    setActionLoading("toggle");
    try {
      const result = await toggleEndpointStatus(endpoint.id);
      if (result.success) {
        const action = result.is_active ? "resumed" : "paused";
        toast.success(`Endpoint ${action} successfully`);
        setOpen(false);
        router.refresh();
      } else {
        const errorMsg = result.error?.message || "Failed to update status";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Failed to update status";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${endpoint.name}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading("delete");
    try {
      const result = await deleteEndpoint(endpoint.id);
      if (result.success) {
        toast.success("Endpoint deleted successfully");
        setOpen(false);
        router.refresh();
      } else {
        const errorMsg = result.error?.message || "Failed to delete endpoint";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Failed to delete endpoint";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Endpoint</DialogTitle>
          <DialogDescription>
            Manage your endpoint settings and status
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="e.g., My API"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || !!actionLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                type="url"
                placeholder="https://api.example.com/health"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading || !!actionLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-interval">Check Interval (minimum 1 hour)</Label>
              <Select
                value={interval}
                onValueChange={setInterval}
                disabled={isLoading || !!actionLoading}
              >
                <SelectTrigger id="edit-interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3600">Every 1 hour</SelectItem>
                  <SelectItem value="7200">Every 2 hours</SelectItem>
                  <SelectItem value="14400">Every 4 hours</SelectItem>
                  <SelectItem value="86400">Every 24 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Minimum check frequency is 1 hour to ensure fair resource usage.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading || !!actionLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !!actionLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>

        <div className="border-t pt-4 mt-2">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Danger Zone</h4>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={handleToggle}
              disabled={isLoading || !!actionLoading}
            >
              {actionLoading === "toggle" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : endpoint.is_active ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {actionLoading === "toggle"
                ? "Updating..."
                : endpoint.is_active
                  ? "Pause Monitoring"
                  : "Resume Monitoring"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="w-full justify-start"
              onClick={handleDelete}
              disabled={isLoading || !!actionLoading}
            >
              {actionLoading === "delete" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {actionLoading === "delete" ? "Deleting..." : "Delete Endpoint"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}