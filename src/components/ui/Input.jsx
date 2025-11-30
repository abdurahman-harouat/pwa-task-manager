import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  ({ className, type = "text", disabled = false, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
