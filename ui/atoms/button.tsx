import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 border disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 hover:scale-[1.02] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand text-text-inverse border-transparent shadow-cosmic-button hover:bg-brand-hover hover:shadow-cosmic-button-hover",

        secondary:
          "bg-surface-glass text-text-main border-border-subtle backdrop-blur-sm hover:bg-surface-highlight hover:border-brand/50 hover:text-brand",

        ghost:
          "bg-transparent text-text-muted border-transparent hover:text-text-main hover:bg-surface-highlight",

        destructive:
          "bg-error-bg text-error border-error-bg hover:bg-error-bg/20",

        outline:
          "border-border-subtle bg-transparent hover:bg-surface-highlight hover:text-text-main",

        link:
          "border-transparent bg-transparent text-brand underline-offset-4 hover:underline",
      },

      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-5 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-9 w-9 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
