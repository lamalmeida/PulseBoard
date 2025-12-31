import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "border border-black/10 dark:border-white/10 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
