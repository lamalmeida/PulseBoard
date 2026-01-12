import { WorkerAPI } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/atoms/button";
import Image from "next/image";
import { parseStatusPageDescription } from "@/lib/status-page-utils";
import { StatusPageList } from "@/ui/organisms/status-page-list";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let statusPageData;
    try {
        statusPageData = await WorkerAPI.getPublicStatusPage(slug);
    } catch {
        return { title: "PulseBoard Status" };
    }

    if (!statusPageData) return { title: "PulseBoard Status" };

    const { description } = parseStatusPageDescription(statusPageData.description);
    const { logoUrl } = parseStatusPageDescription(statusPageData.description);

    return {
        title: `${statusPageData.title} | Status`,
        description: description || `Status page for ${statusPageData.title}`,
        icons: logoUrl ? [{ rel: "icon", url: logoUrl }] : [{ rel: "icon", url: "/logo-transparent.png" }],
    };
}

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

    // Parse Description and Groups
    const { description: cleanDescription, groups, logoUrl } = parseStatusPageDescription(statusPage.description);

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
        <div className="min-h-screen pb-24 font-sans selection:bg-brand/20">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                                <Image
                                    src={logoUrl || "/logo-transparent.png"}
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tighter uppercase leading-none">{statusPage.title}</span>
                                <span className="text-[10px] text-text-muted font-mono tracking-tight leading-none pt-1">Powered by PulseBoard</span>
                            </div>
                        </Link>
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs font-mono uppercase tracking-widest border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5" asChild>
                        <Link href="https://pulseboard.lamas-co.com">
                            Get PulseBoard
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-32 space-y-16">

                {/* Status Hero */}
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                    <div className={`p-6 rounded-full relative ${isSystemOperational ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${isSystemOperational ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isSystemOperational ? (
                            <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
                        ) : (
                            anyDown ? <XCircle className="w-16 h-16 text-red-500 relative z-10" /> : <AlertTriangle className="w-16 h-16 text-yellow-500 relative z-10" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mix-blend-difference text-black dark:text-white">
                            {isSystemOperational ? 'All Systems Operational' : 'Active Incidents Reported'}
                        </h1>
                        {cleanDescription && (
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light">
                                {cleanDescription}
                            </p>
                        )}
                    </div>

                    <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground opacity-60">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>

                {/* Endpoints List */}
                <div className="space-y-8">
                    <StatusPageList endpoints={endpointsWithChecks} groups={groups} />
                </div>
            </main>
        </div>
    );
}
