"use client";

import { useState } from "react";
import { updateEndpoint, toggleEndpointStatus, deleteEndpoint } from "@/app/actions/endpoint-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pause, Play, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { validateCheckInterval } from "@/lib/rate-limits";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type EditEndpointFormProps = {
    endpoint: {
        id: string;
        name: string;
        url: string;
        check_interval: number;
        is_active: boolean;
        consecutive_failures_threshold?: number;
        notification_cooldown_seconds?: number;
        send_recovery_notifications?: boolean;
        escalation_interval_minutes?: number;
    };
};

export function EditEndpointForm({ endpoint }: EditEndpointFormProps) {
    const [name, setName] = useState(endpoint.name);
    const [url, setUrl] = useState(endpoint.url);
    const [interval, setInterval] = useState(endpoint.check_interval.toString());
    const [sensitivity, setSensitivity] = useState((endpoint.consecutive_failures_threshold || 2).toString());
    const [cooldown, setCooldown] = useState((endpoint.notification_cooldown_seconds || 3600).toString());
    const [recovery, setRecovery] = useState(endpoint.send_recovery_notifications ?? true);
    const [escalation, setEscalation] = useState((endpoint.escalation_interval_minutes || 0).toString());
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
                consecutive_failures_threshold: parseInt(sensitivity),
                notification_cooldown_seconds: parseInt(cooldown),
                send_recovery_notifications: recovery,
                escalation_interval_minutes: parseInt(escalation) > 0 ? parseInt(escalation) : null,
            });

            if (result.success) {
                toast.success("Endpoint updated successfully");
                router.push("/protected/endpoints");
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
                router.push("/protected/endpoints");
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/protected/endpoints">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-2xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
                        placeholder="Endpoint Name"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Update your endpoint settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
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

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-4">Notification Settings</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="sensitivity">Sensitivity</Label>
                                        <Select
                                            value={sensitivity}
                                            onValueChange={setSensitivity}
                                            disabled={isLoading || !!actionLoading}
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
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cooldown">Cooldown Period</Label>
                                        <Select
                                            value={cooldown}
                                            onValueChange={setCooldown}
                                            disabled={isLoading || !!actionLoading}
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
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="escalation">Escalation</Label>
                                        <Select
                                            value={escalation}
                                            onValueChange={setEscalation}
                                            disabled={isLoading || !!actionLoading}
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
                                    </div>

                                    <div className="flex items-center space-x-2 pt-8">
                                        <input
                                            type="checkbox"
                                            id="recovery"
                                            checked={recovery}
                                            onChange={(e) => setRecovery(e.target.checked)}
                                            disabled={isLoading || !!actionLoading}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor="recovery" className="font-normal">
                                            Notify when recovered
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                        <CardDescription>Manage endpoint lifecycle</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
