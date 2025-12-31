import { cn } from "@/lib/utils";

interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function PageShell({ children, className, ...props }: PageShellProps) {
    return (
        <div
            className={cn(
                "min-h-screen bg-[#F4F4F0] dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-brand selection:text-white transition-colors duration-500",
                className
            )}
            {...props}
        >
            {/* Grid Background Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)",
                    backgroundSize: "4rem 4rem",
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
