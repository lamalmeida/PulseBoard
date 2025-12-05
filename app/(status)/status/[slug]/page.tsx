import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StatusPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: endpoint } = await supabase
        .from("endpoints")
        .select("*")
        .eq("slug", slug)
        .eq("is_public", true)
        .single();

    if (!endpoint) {
        notFound();
    }

    // Fetch checks (reverse order to get latest first, then we reverse back for display)
    const { data: checks } = await supabase
        .from("checks")
        .select("id, status, response_time, checked_at")
        .eq("endpoint_id", endpoint.id)
        .order("checked_at", { ascending: false })
        .limit(90);

    const checksHistory = checks ? [...checks].reverse() : [];
    const latestCheck = checks?.[0];
    const isOnline = latestCheck?.status === "success";

    // Calculate uptime percentage (simple based on fetched checks)
    const successCount = checks?.filter(c => c.status === "success").length || 0;
    const totalCount = checks?.length || 0;
    const uptimePercentage = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : "100";

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="PulseBoard Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="font-bold text-lg hidden sm:inline-block">PulseBoard</span>
                        </Link>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="https://pulseboard.lamas-co.com">
                            Powered by PulseBoard
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">

                {/* Status Banner */}
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${isOnline ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {isOnline ? (
                            <CheckCircle2 className="w-12 h-12" />
                        ) : (
                            <XCircle className="w-12 h-12" />
                        )}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">{endpoint.public_title || endpoint.name}</h1>

                    {endpoint.public_description && (
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            {endpoint.public_description}
                        </p>
                    )}

                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${isOnline
                            ? 'bg-green-500/5 text-green-600 border-green-500/20'
                            : 'bg-red-500/5 text-red-600 border-red-500/20'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        {isOnline ? 'Operational' : 'Service Disruption'}
                    </div>
                </div>

                {/* Uptime Visualization */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-base font-medium">Uptime History (Last 90 Checks)</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {uptimePercentage}% Uptime
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-[1px] h-16 w-full">
                            {checksHistory.map((check) => {
                                let colorClass = "bg-gray-200 dark:bg-gray-800";
                                if (check.status === "success") colorClass = "bg-green-500";
                                if (check.status === "error") colorClass = "bg-red-500";

                                // Tooltip logic can be complex in server components without client logic
                                // Using simple title attribute for now
                                return (
                                    <div
                                        key={check.id}
                                        title={`${new Date(check.checked_at).toLocaleString()} - ${check.response_time}ms`}
                                        className={`flex-1 rounded-sm transition-all hover:opacity-80 ${colorClass}`}
                                        style={{
                                            height: '100%',
                                            opacity: 0.8
                                        }}
                                    />
                                );
                            })}
                            {/* Fill remaining slots if less than 90? */}
                            {Array.from({ length: Math.max(0, 90 - checksHistory.length) }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="flex-1 bg-muted/30 rounded-sm h-full"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>90 checks ago</span>
                            <span>Today</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Latest Checks List (Optional) */}
                {/* <Card>
           ...
        </Card> */}

            </main>
        </div>
    );
}
