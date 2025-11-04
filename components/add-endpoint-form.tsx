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

export function AddEndpointForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState("300"); // 5 minutes default
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

      // Insert the endpoint into Supabase
      const { data, error: insertError } = await supabase
        .from("endpoints")
        .insert({
          user_id: user.id,
          name: name.trim(),
          url: url.trim(),
          check_interval: parseInt(interval),
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("✅ Endpoint created:", data);

      // Show success and clear form
      setSuccess(true);
      setName("");
      setUrl("");
      setInterval("300");

      // Optional: Redirect to endpoints list after 1.5 seconds
      setTimeout(() => {
        router.push("/protected/endpoints/add");
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
          Add a new endpoint to monitor its health status
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
              <Label htmlFor="interval">Check Interval</Label>
              <Select 
                value={interval} 
                onValueChange={setInterval}
                disabled={isLoading}
              >
                <SelectTrigger id="interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">Every 1 minute</SelectItem>
                  <SelectItem value="300">Every 5 minutes</SelectItem>
                  <SelectItem value="900">Every 15 minutes</SelectItem>
                  <SelectItem value="3600">Every 1 hour</SelectItem>
                </SelectContent>
              </Select>
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