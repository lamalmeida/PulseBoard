// components/add-endpoint-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/ui/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/atoms/card";
import { Input } from "@/ui/atoms/input";
import { Label } from "@/ui/atoms/label";
import { Slider } from "@/ui/atoms/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/atoms/select";
import { createEndpoint } from "@/app/actions/endpoint-actions";
import { toast } from "@/lib/toast";
import { validateCheckInterval } from "@/lib/rate-limits";

import { Plus, Trash2 } from "lucide-react";

export function AddEndpointForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState("");
  const [interval, setInterval] = useState<number[]>([300]); // Default 5 mins
  const [timeout, setTimeout] = useState<number[]>([10]); // Default 10s
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

  const toLog = (seconds: number) => {
    const min = 15;
    const max = 86400;
    if (seconds <= min) return 0;
    if (seconds >= max) return 100;
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    return (Math.log(seconds) - minLog) / (maxLog - minLog) * 100;
  };

  const fromLog = (value: number) => {
    const min = 15;
    const max = 86400;
    if (value <= 0) return min;
    if (value >= 100) return max;
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    const raw = Math.exp(value / 100 * (maxLog - minLog) + minLog);

    if (raw < 60) return Math.round(raw / 5) * 5;     // 5s steps
    if (raw < 3600) return Math.round(raw / 60) * 60; // 1m steps
    if (raw < 43200) return Math.round(raw / 300) * 300; // 5m steps up to 12h
    return Math.round(raw / 3600) * 3600;             // 1h steps
  };

  const formatInterval = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0
        ? `${hours}h ${minutes}m`
        : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${seconds} seconds`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    const validation = validateCheckInterval(interval[0]);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid check interval");
      return;
    }

    setIsLoading(true);

    try {
      // Process headers into a single object
      const headersObject = headers.reduce((acc, header) => {
        if (header.key.trim()) {
          acc[header.key.trim()] = header.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const endpointData = {
        name: name.trim(),
        url: url.trim(),
        http_method: httpMethod,
        request_headers: headersObject,
        request_body: body,
        check_interval: interval[0],
        timeout_sec: timeout[0],
        is_active: true,
        consecutive_failures_threshold: parseInt(sensitivity),
        notification_cooldown_seconds: parseInt(cooldown),
        send_recovery_notifications: recovery,
        escalation_interval_minutes: parseInt(escalation) > 0 ? parseInt(escalation) : null,
      };

      const result = await createEndpoint(endpointData);

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to create endpoint");
      }

      console.log("✅ Endpoint created");
      toast.success(`Endpoint "${name}" created successfully!`);

      // Clear form
      setName("");
      setUrl("");
      setHttpMethod("GET");
      setHeaders([]);
      setBody("");
      setInterval([300]);
      setTimeout([10]);
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

            <div className="grid grid-cols-1 gap-8">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="interval">Check Interval</Label>
                  <span className="text-sm font-medium text-text-main">{formatInterval(interval[0])}</span>
                </div>
                <Slider
                  value={[toLog(interval[0])]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={(vals) => setInterval([fromLog(vals[0])])}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  How often to check endpoint health (15s - 24h).
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="timeout">Alert Threshold</Label>
                  <span className="text-sm font-medium text-text-main">{timeout[0] * 1000}ms</span>
                </div>
                <Slider
                  value={timeout}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={setTimeout}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Latency above this value triggers an alert.
                </p>
              </div>
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