import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
    return (
        <div className={cn("group border border-black/10 dark:border-white/10 -ml-px -mt-px relative hover:z-10 p-8 md:p-12 bg-[#F4F4F0]/75 dark:bg-[#050505]/75 backdrop-blur-md backdrop-saturate-150 backdrop-contrast-125 transition-all duration-300 hover:scale-[1.02] min-h-[300px] flex flex-col justify-between", className)}>
            <div>
                <div className="text-brand mb-4">{icon}</div>
                <h3 className="text-2xl font-bold leading-tight mb-4">{title}</h3>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
