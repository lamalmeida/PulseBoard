import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../atoms/card';
import { Badge } from '../atoms/badge';
import { Button } from '../atoms/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConfigCardProps {
    endpoint: any; // Using any for now as types are not strictly defined yet
    className?: string;
}

export function ConfigCard({ endpoint, className }: ConfigCardProps) {
    return (
        <Card className={cn("w-full h-full bg-surface-base backdrop-blur-md", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-text-main font-semibold text-lg">Configuration</h3>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div>
                    <label className="block mb-2 text-xs font-medium text-text-dim uppercase tracking-widest">Endpoint URL</label>
                    <div className="flex items-center w-full rounded-lg bg-surface-input border border-border-subtle p-2.5">
                        <code className="font-mono text-text-muted text-xs truncate select-all">{endpoint.url}</code>
                    </div>
                </div>

                <div className="border-t border-border-subtle my-2"></div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-text-muted text-sm">Method</span>
                        <Badge variant="neutral" className="font-mono">{endpoint.method || 'GET'}</Badge>
                    </div>
                    {/* Placeholder values since these might not be in the basic endpoint object yet */}
                    <div className="flex items-center justify-between">
                        <span className="text-text-muted text-sm">Check Interval</span>
                        <span className="font-mono text-text-main font-medium">
                            {endpoint.check_interval < 60
                                ? `${endpoint.check_interval}s`
                                : endpoint.check_interval < 3600
                                    ? `${Math.floor(endpoint.check_interval / 60)}m`
                                    : `${Math.floor(endpoint.check_interval / 3600)}h`
                            }
                        </span>
                    </div>
                </div>

                <div className="border-t border-border-subtle my-2"></div>

                <div>
                    <label className="block mb-2 text-xs font-medium text-text-dim uppercase tracking-widest">Alert Thresholds</label>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-text-muted">Latency {'>'} {(endpoint.timeout_sec || 10) * 1000}ms</span>
                                <span className="text-text-main">Alert</span>
                            </div>
                            <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-brand/50"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Button variant="secondary" className="w-full justify-center" asChild>
                    <Link href={`/protected/endpoints/${endpoint.id}/edit`}>
                        Edit Configuration
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
