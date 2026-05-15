import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, ...props }, ref) => {
    if (icon || suffix) {
      return (
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground/60",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              icon && "pl-10",
              suffix && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 text-muted-foreground">
              {suffix}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 focus-visible:border-brand-500/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
