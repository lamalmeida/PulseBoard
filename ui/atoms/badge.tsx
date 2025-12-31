import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "bg-surface-highlight text-text-muted border-border-subtle",

        success:
          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",

        warning:
          "bg-amber-500/10 text-amber-500 border-amber-500/20",

        error:
          "bg-rose-500/10 text-rose-500 border-rose-500/20",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export type BadgeVariant = "neutral" | "success" | "warning" | "error";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
