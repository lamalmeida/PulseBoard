import React from 'react';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import { Card, CardContent } from "@/ui/atoms/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    change?: string;
    positive?: boolean;
    className?: string;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    change,
    positive = true,
    className
}: StatCardProps) {
    return (
        <Card className={cn("bg-surface-glass border-border-subtle", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                        {label}
                    </span>
                    <Icon size={18} className="text-text-main" />
                </div>
                <div className="flex items-end gap-3">
                    <span className="text-foreground font-semibold text-3xl">
                        {value}
                    </span>
                    {change && (
                        <span
                            className={cn(
                                "text-xs font-bold mb-1.5 flex items-center",
                                positive ? "text-emerald-500" : "text-rose-500"
                            )}
                        >
                            {change}
                            <ArrowUpRight
                                size={12}
                                className={cn(positive ? "" : "rotate-180")}
                            />
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
