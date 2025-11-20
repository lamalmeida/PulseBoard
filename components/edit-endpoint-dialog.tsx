// components/edit-endpoint-dialog.tsx
"use client";

import { useState, type ReactElement } from "react";
import { updateEndpoint } from "@/app/actions/endpoint-actions";
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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { validateCheckInterval } from "@/lib/rate-limits";

type EditEndpointDialogProps = {
  endpoint: {
    id: string;
    name: string;
    url: string;
    check_interval: number;
  };
  trigger?: ReactElement;
};

export function EditEndpointDialog({ endpoint, trigger }: EditEndpointDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(endpoint.name);
  const [url, setUrl] = useState(endpoint.url);
  const [interval, setInterval] = useState(endpoint.check_interval.toString());
  const [isLoading, setIsLoading] = useState(false);
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
        setError(validation.error || "Validation failed");
        setIsLoading(false);
        return;
      }

      const result = await updateEndpoint(endpoint.id, {
        name,
        url,
        check_interval: intervalSeconds,
      });

      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to update endpoint");
      }
    } finally {
      setIsLoading(false);
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
            Make changes to your endpoint settings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="e.g., My API"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-interval">Check Interval (minimum 1 hour)</Label>
            <Select
              value={interval}
              onValueChange={setInterval}
              disabled={isLoading}
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

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}