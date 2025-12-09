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
import { toast } from "@/lib/toast";

import { Plus, Trash2 } from "lucide-react";

export function AddEndpointForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState("");
  const [interval, setInterval] = useState("3600"); // 1 hour default
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    url?: string;
    interval?: string;
  }>({});

  const [sensitivity, setSensitivity] = useState("2");
  const [cooldown, setCooldown] = useState("3600");
  const [recovery, setRecovery] = useState(true);
  const [escalation, setEscalation] = useState("0");

  const router = useRouter();
  const supabase = createClient();

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!validateUrl(url)) {
      newErrors.url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsLoading(true);

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
        toast.error(validation.error || "Validation failed");
        setIsLoading(false);
        return;
      }

      // Process headers into a single object
      const headersObject = headers.reduce((acc, header) => {
        if (header.key.trim()) {
          acc[header.key.trim()] = header.value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Insert the endpoint into Supabase
      const { data, error: insertError } = await supabase
        .from("endpoints")
        .insert({
          user_id: user.id,
          name: name.trim(),
          url: url.trim(),
          http_method: httpMethod,
          request_head: headersObject,
          request_body: body,
          check_interval: intervalSeconds,
          is_active: true,
          consecutive_failures_threshold: parseInt(sensitivity),
          notification_cooldown_seconds: parseInt(cooldown),
          send_recovery_notifications: recovery,
          escalation_interval_minutes: parseInt(escalation) > 0 ? parseInt(escalation) : null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("✅ Endpoint created:", data);
      toast.success(`Endpoint "${name}" created successfully!`);

      await updateQStashSchedule();

      // Clear form
      setName("");
      setUrl("");
      setHttpMethod("GET");
      setHeaders([]);
      setBody("");
      setInterval("3600");
      setSensitivity("2");
      setCooldown("3600");
      setRecovery(true);
      setEscalation("0");

      // Redirect to endpoints list
      router.push("/protected/endpoints");

    } catch (err: any) {
      console.error("❌ Error creating endpoint:", err);
      const errorMessage = err.message || "Failed to create endpoint";
      toast.error(errorMessage);
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
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://api.example.com/health"
                  required
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) setErrors({ ...errors, url: undefined });
                  }}
                  disabled={isLoading}
                  className={errors.url ? "border-red-500" : ""}
                />
                {errors.url && (
                  <p className="text-xs text-red-500 mt-1">{errors.url}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="method">Method</Label>
                <Select
                  value={httpMethod}
                  onValueChange={setHttpMethod}
                  disabled={isLoading}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Request Headers (Optional)</Label>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Key (e.g. Content-Type)"
                      value={header.key}
                      onChange={(e) => updateHeader(index, "key", e.target.value)}
                      disabled={isLoading}
                    />
                    <Input
                      placeholder="Value (e.g. application/json)"
                      value={header.value}
                      onChange={(e) => updateHeader(index, "value", e.target.value)}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHeader(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHeader}
                  disabled={isLoading}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Header
                </Button>
              </div>
            </div>

            {(httpMethod === "POST" || httpMethod === "PUT" || httpMethod === "PATCH" || httpMethod === "DELETE") && (
              <div className="grid gap-2">
                <Label htmlFor="body">Request Body (Optional)</Label>
                <textarea
                  id="body"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

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

            <div className="grid gap-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select
                value={httpMethod}
                onValueChange={setHttpMethod}
                disabled={isLoading}
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-4">Notification Settings</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="sensitivity">Sensitivity</Label>
                  <Select
                    value={sensitivity}
                    onValueChange={setSensitivity}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="sensitivity">
                      <SelectValue placeholder="Select sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Immediate (1 failure)</SelectItem>
                      <SelectItem value="2">2 consecutive failures</SelectItem>
                      <SelectItem value="3">3 consecutive failures</SelectItem>
                      <SelectItem value="5">5 consecutive failures</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Failures before sending an alert.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cooldown">Cooldown Period</Label>
                  <Select
                    value={cooldown}
                    onValueChange={setCooldown}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="cooldown">
                      <SelectValue placeholder="Select cooldown" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1800">30 minutes</SelectItem>
                      <SelectItem value="3600">1 hour</SelectItem>
                      <SelectItem value="14400">4 hours</SelectItem>
                      <SelectItem value="86400">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Wait time before repeating alerts.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="escalation">Escalation</Label>
                  <Select
                    value={escalation}
                    onValueChange={setEscalation}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="escalation">
                      <SelectValue placeholder="Select escalation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="3600">After 1 hour</SelectItem>
                      <SelectItem value="14400">After 4 hours</SelectItem>
                      <SelectItem value="86400">After 24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Repeat alert if still down.
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="recovery"
                    checked={recovery}
                    onChange={(e) => setRecovery(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="recovery" className="font-normal">
                    Notify when recovered
                  </Label>
                </div>
              </div>
            </div>




            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Endpoint"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card >
  );
}