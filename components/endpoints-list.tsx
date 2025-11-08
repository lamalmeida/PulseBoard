"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Endpoint = {
  id: string;
  name: string;
  url: string;
  check_interval: number;
  is_active: boolean;
  created_at: string;
};

export function EndpointsList({ endpoints }: { endpoints: Endpoint[] }) {
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground mb-4">
          No endpoints yet. Add your first endpoint to start monitoring!
        </p>
      </div>
    );
  }

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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell className="font-medium">{endpoint.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-md truncate">
                {endpoint.url}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  Unknown
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatInterval(endpoint.check_interval)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(endpoint.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}