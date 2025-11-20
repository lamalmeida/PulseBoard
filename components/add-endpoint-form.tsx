// components/add-endpoint-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateQStashSchedule } from "@/app/actions/update-qstash-schedule";
import { validateEndpointCreation } from "@/app/actions/rate-limits";

export function AddEndpointForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState("3600"); // 1 hour default (changed from 5 min)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to add an endpoint");
      }

      // Validate endpoint limit and check interval
      const intervalSeconds = parseInt(interval);
      const validation = await validateEndpointCreation(user.id, intervalSeconds);

      if (!validation.valid) {
        setError(validation.error || "Validation failed");
        setIsLoading(false);
        return;
      }

      // Insert the endpoint into Supabase
      const { data, error: insertError } = await supabase
        .from("endpoints")
        .insert({
          user_id: user.id,
          name: name.trim(),
          url: url.trim(),
          check_interval: intervalSeconds,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("✅ Endpoint created:", data);

      await updateQStashSchedule();

      // Show success and clear form
      setSuccess(true);
      setName("");
      setUrl("");
      setInterval("3600");

      // Optional: Redirect to endpoints list after 1.5 seconds
      setTimeout(() => {
        router.push("/protected/endpoints");
      }, 1500);

    } catch (err: any) {
      console.error("❌ Error creating endpoint:", err);
      setError(err.message || "Failed to create endpoint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoint Details</CardTitle>
        <CardDescription>
          Add a new endpoint to monitor its health status. You can add up to 10 endpoints.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name / Label</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., My API, Production Server"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://api.example.com/health"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="interval">Check Interval (minimum 1 hour)</Label>
              <Select
                value={interval}
                onValueChange={setInterval}
                disabled={isLoading}
              >
                <SelectTrigger id="interval">
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

            {success && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 text-sm">
                ✅ Endpoint added successfully! Redirecting...
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Endpoint"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}