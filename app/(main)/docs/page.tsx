
import { Button } from "@/ui/atoms/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/atoms/card";

export default function DocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">PulseBoard Documentation</h1>
                <p className="text-xl text-text-muted leading-relaxed">
                    Welcome to the PulseBoard documentation. Learn how to monitor your endpoints, configure alerts, and manage status pages efficiently.
                </p>
            </div>

            <div className="aspect-video w-full rounded-xl border border-border-subtle bg-surface-base flex items-center justify-center text-text-muted animate-pulse">
                [PLACEHOLDER: Dashboard Overview Screenshot]
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <Card className="hover:border-brand/30 transition-colors">
                    <CardHeader>
                        <CardTitle>Quick Start</CardTitle>
                        <CardDescription>Get your first monitor up and running in less than 2 minutes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/docs/quick-start" className="text-brand font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            Start Guide <ArrowRight size={16} />
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-brand/30 transition-colors">
                    <CardHeader>
                        <CardTitle>Configure Alerts</CardTitle>
                        <CardDescription>Set up email notifications and fine-tune sensitivity thresholds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/docs/alerts" className="text-brand font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            Alerts Guide <ArrowRight size={16} />
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-brand/30 transition-colors">
                    <CardHeader>
                        <CardTitle>Status Pages</CardTitle>
                        <CardDescription>Create public status pages to keep your users informed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/docs/status-pages" className="text-brand font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            Status Pages Guide <ArrowRight size={16} />
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-brand/30 transition-colors">
                    <CardHeader>
                        <CardTitle>API Monitoring</CardTitle>
                        <CardDescription>Learn about supported HTTP methods, headers, and body payloads.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/docs/monitoring" className="text-brand font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            Monitoring Guide <ArrowRight size={16} />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
