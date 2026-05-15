import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-500/20 text-brand-300 hover:bg-brand-500/30",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline: "border-border text-foreground",
        success: "border-transparent bg-emerald-500/20 text-emerald-400",
        warning: "border-transparent bg-yellow-500/20 text-yellow-400",
        info: "border-transparent bg-blue-500/20 text-blue-400",
        premium: "border-brand-500/40 bg-gradient-to-r from-brand-500/20 to-brand-600/20 text-brand-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
