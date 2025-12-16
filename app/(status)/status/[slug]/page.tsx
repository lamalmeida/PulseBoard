import { WorkerAPI } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function StatusPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Fetch Status Page (Public) via Worker API
    let statusPageData;
    try {
        statusPageData = await WorkerAPI.getPublicStatusPage(slug);
    } catch (error) {
        console.error("Error fetching status page:", error);
        notFound();
    }

    if (!statusPageData) {
        notFound();
    }

    const { endpoints, ...statusPage } = statusPageData;
    const endpointsWithChecks = endpoints || [];

    // 2. Handle empty status page
    if (endpointsWithChecks.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{statusPage.title}</h1>
                    <p className="text-muted-foreground mt-2">No endpoints configured for this status page.</p>
                </div>
            </div>
        );
    }

    // 3. Calculate Overall Status
    const anyDown = endpointsWithChecks.some((e: any) => e.latestCheck?.status === "error");
    const isSystemOperational = !anyDown;

    return (
        <div className="min-h-screen bg-background pb-12">
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

            <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">

                {/* Status Banner */}
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className={`p-4 rounded-full ${isSystemOperational ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {isSystemOperational ? (
                            <CheckCircle2 className="w-12 h-12" />
                        ) : (
                            anyDown ? <XCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />
                        )}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">{statusPage.title}</h1>

                    {statusPage.description && (
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            {statusPage.description}
                        </p>
                    )}

                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${isSystemOperational
                        ? 'bg-green-500/5 text-green-600 border-green-500/20'
                        : 'bg-red-500/5 text-red-600 border-red-500/20'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${isSystemOperational ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        {isSystemOperational ? 'All Systems Operational' : 'Active Incidents Reported'}
                    </div>
                </div>

                {/* Endpoints List */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">System Metrics</h2>
                    {endpointsWithChecks.map((endpoint: any) => {
                        const totalChecks = endpoint.checks.length;
                        const successCount = endpoint.checks.filter((c: any) => c.status === "success").length;
                        const uptime = totalChecks > 0 ? ((successCount / totalChecks) * 100).toFixed(1) : "100";
                        const isUp = endpoint.latestCheck?.status === "success" || !endpoint.latestCheck;

                        return (
                            <Card key={endpoint.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium flex items-center gap-2">
                                            {isUp ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                            {endpoint.name}
                                        </CardTitle>
                                        <span className={`text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                                            {uptime}% Uptime
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end gap-[2px] h-12 w-full">
                                        {endpoint.checks.map((check: any) => {
                                            let colorClass = "bg-muted";
                                            if (check.status === "success") colorClass = "bg-green-500";
                                            if (check.status === "error") colorClass = "bg-red-500";

                                            return (
                                                <div
                                                    key={check.id}
                                                    title={`${new Date(check.checked_at).toLocaleString()} - ${check.response_time}ms`}
                                                    className={`flex-1 rounded-[1px] ${colorClass}`}
                                                    style={{ height: '100%', opacity: 0.8 }}
                                                />
                                            );
                                        })}
                                        {Array.from({ length: Math.max(0, 90 - endpoint.checks.length) }).map((_, i) => (
                                            <div
                                                key={`empty-${i}`}
                                                className="flex-1 bg-muted/20 rounded-[1px] h-full"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>90 checks ago</span>
                                        <span>Today</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
