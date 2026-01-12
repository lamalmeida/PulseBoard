"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronRight, Activity } from "lucide-react";
import { GroupConfig } from "@/lib/status-page-utils";
import { Card } from "@/ui/atoms/card";

type Check = {
    id: string;
    status: "success" | "error";
    response_time: number;
    checked_at: string;
};

type EndpointWithChecks = {
    id: string;
    name: string;
    url: string;
    checks: Check[];
    latestCheck?: Check;
};

interface StatusPageListProps {
    endpoints: EndpointWithChecks[];
    groups: GroupConfig[];
}

export function StatusPageList({ endpoints, groups }: StatusPageListProps) {
    // Determine which endpoints are in groups
    const groupedEndpointIds = new Set(groups.flatMap(g => g.endpoint_ids));
    const ungroupedEndpoints = endpoints.filter(e => !groupedEndpointIds.has(e.id));

    return (
        <div className="space-y-8">
            {/* Render Groups */}
            {groups.map(group => {
                const groupEndpoints = endpoints.filter(e => group.endpoint_ids.includes(e.id));
                if (groupEndpoints.length === 0) return null;

                return (
                    <EndpointGroup
                        key={group.id}
                        groupName={group.name}
                        endpoints={groupEndpoints}
                    />
                );
            })}

            {/* Render Ungrouped Endpoints */}
            {ungroupedEndpoints.length > 0 && (
                <div className="space-y-4">
                    {groups.length > 0 && (
                        <div className="flex items-center justify-between border-b border-border-subtle pb-4 pt-4">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <span className="w-1 h-6 bg-brand rounded-full" />
                                Other Services
                            </h2>
                        </div>
                    )}
                    <div className="grid gap-4">
                        {ungroupedEndpoints.map(endpoint => (
                            <EndpointCard key={endpoint.id} endpoint={endpoint} />
                        ))}
                    </div>
                </div>
            )}

            {endpoints.length === 0 && (
                <div className="text-center py-24 opacity-60">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No endpoints monitored</p>
                </div>
            )}
        </div>
    );
}

function EndpointGroup({ groupName, endpoints }: { groupName: string, endpoints: EndpointWithChecks[] }) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Calculate Group Stats
    const totalChecks = endpoints.reduce((acc, e) => acc + e.checks.length, 0);
    const totalSuccess = endpoints.reduce((acc, e) => acc + e.checks.filter(c => c.status === "success").length, 0);
    const uptime = totalChecks > 0 ? ((totalSuccess / totalChecks) * 100).toFixed(1) : "100";

    // Check if any endpoint in group is down
    const isGroupOperational = !endpoints.some(e => e.latestCheck?.status === "error");

    return (
        <div className="space-y-4">
            <div
                className="flex items-center justify-between p-4 rounded-xl bg-surface-glass border border-black/5 dark:border-white/5 cursor-pointer hover:bg-surface-highlight transition-all"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{groupName}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
                            {endpoints.length} services • {isGroupOperational ? "Operational" : "Issues Detected"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className={`text-xl font-bold tracking-tighter ${isGroupOperational ? 'text-green-500' : 'text-red-500'}`}>
                            {uptime}%
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider opacity-60">Avg Uptime</div>
                    </div>
                    <div className={`p-2 rounded-full ${isGroupOperational ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {isGroupOperational ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="grid gap-3 pl-4 sm:pl-8 border-l-2 border-dashed border-border-subtle ml-4 sm:ml-6 relative">
                    {endpoints.map(endpoint => (
                        <EndpointCard key={endpoint.id} endpoint={endpoint} isCompact />
                    ))}
                </div>
            )}
        </div>
    );
}

function EndpointCard({ endpoint, isCompact = false }: { endpoint: EndpointWithChecks, isCompact?: boolean }) {
    const totalChecks = endpoint.checks.length;
    const successCount = endpoint.checks.filter(c => c.status === "success").length;
    const uptime = totalChecks > 0 ? ((successCount / totalChecks) * 100).toFixed(1) : "100";
    const isUp = endpoint.latestCheck?.status === "success" || !endpoint.latestCheck;

    return (
        <div className={`group relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-surface-glass backdrop-blur-sm hover:bg-surface-highlight transition-all duration-300 ${isCompact ? 'p-4' : 'p-6 space-y-6'}`}>
            <div className={`${isCompact ? 'flex flex-col gap-4' : 'space-y-6'}`}>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className={`font-semibold tracking-tight ${isCompact ? 'text-base' : 'text-lg'}`}>{endpoint.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-medium border ${isUp
                                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                                }`}>
                                {isUp ? 'Operational' : 'Downtime'}
                            </span>
                        </div>
                        {!isCompact && (
                            <p className="text-sm text-muted-foreground font-mono opacity-60">{endpoint.url.replace(/^https?:\/\//, '')}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <div className={`font-bold tracking-tighter ${isCompact ? 'text-lg' : 'text-2xl'} ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                            {uptime}%
                        </div>
                        {!isCompact && <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider opacity-60">Uptime (24h)</div>}
                    </div>
                </div>

                {/* Uptime Bar (90 Days) */}
                <div className="space-y-2">
                    <div className={`flex items-end gap-[1px] w-full opacity-80 group-hover:opacity-100 transition-opacity ${isCompact ? 'h-6' : 'h-8'}`}>
                        {Array.from({ length: 90 }).map((_, i) => {
                            // index 0 = 89 days ago, index 89 = today
                            const date = new Date();
                            date.setDate(date.getDate() - (89 - i));
                            // Normalize to YYYY-MM-DD for comparison
                            const targetDateStr = date.toISOString().split("T")[0];

                            const dailyChecks = endpoint.checks.filter(c => {
                                try {
                                    // Handle both ISO strings and other formats if necessary. 
                                    // Assuming checked_at is stored as UTC ISO string in DB.
                                    const checkDate = new Date(c.checked_at);
                                    const checkDateStr = checkDate.toISOString().split("T")[0];
                                    return checkDateStr === targetDateStr;
                                } catch (e) {
                                    return false;
                                }
                            });

                            let tooltip = `${date.toLocaleDateString()}: No Data`;
                            let colorClass = "bg-muted dark:bg-muted/20"; // Default Grey (Empty)

                            if (dailyChecks.length > 0) {
                                // Sort checks by time to ensure accurate start/end
                                dailyChecks.sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime());

                                const hasError = dailyChecks.some(c => c.status === "error");
                                if (hasError) {
                                    colorClass = "bg-red-500";

                                    // Calculate Outage Details
                                    const errorChecks = dailyChecks.filter(c => c.status === "error");
                                    if (errorChecks.length > 0) {
                                        const firstError = new Date(errorChecks[0].checked_at);
                                        const lastError = new Date(errorChecks[errorChecks.length - 1].checked_at);

                                        // Duration in minutes
                                        const durationMs = lastError.getTime() - firstError.getTime();
                                        // Add 1 minute to account for the check interval itself (approx)
                                        const durationMins = Math.max(1, Math.round(durationMs / 60000) + 1);

                                        const startTime = firstError.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const endTime = lastError.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                        tooltip = `${date.toLocaleDateString()}\nOutage Detected\nDuration: ${durationMins} mins\nTime: ${startTime} - ${endTime}`;
                                    } else {
                                        tooltip = `${date.toLocaleDateString()}: Issues Detected`;
                                    }
                                } else {
                                    colorClass = "bg-green-400 dark:bg-green-500";
                                    tooltip = `${date.toLocaleDateString()}: Operational`;

                                    // Optional: Check latencies
                                    const avgLatency = dailyChecks.reduce((a, b) => a + b.response_time, 0) / dailyChecks.length;
                                    if (avgLatency > 500) colorClass = "bg-yellow-400 dark:bg-yellow-600";
                                }
                            }

                            return (
                                <div
                                    key={`day-${i}`}
                                    className={`flex-1 rounded-[1px] hover:scale-y-125 hover:z-10 transition-all duration-200 ${colorClass}`}
                                    style={{ height: '100%' }}
                                    title={tooltip}
                                />
                            );
                        })}
                    </div>
                    {!isCompact && (
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-wider opacity-50">
                            <span>90 days ago</span>
                            <span>Today</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
