"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming cn utility exists, usually does in these projects. If not, I'll drop it.

interface DocsImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function DocsImage({ src, alt, className }: DocsImageProps) {
    const [hasError, setHasError] = useState(false);

    return (
        <div className={cn(
            "w-full rounded-xl border border-border-subtle bg-surface-base overflow-hidden relative group",
            className
        )}>
            {!hasError ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="w-full aspect-video flex items-center justify-center text-text-muted bg-black/5 dark:bg-white/5 animate-pulse text-sm">
                    [Image: public{src}]
                </div>
            )}
        </div>
    );
}
