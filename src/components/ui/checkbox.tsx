"use client";

import * as React from "react";
import { Checkbox as RizzuiCheckbox } from "rizzui";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => (
    <RizzuiCheckbox
      ref={ref}
      label={label}
      className={cn(
        "glass-card [&>div]:bg-white/50 [&>div]:dark:bg-card/50 [&>div]:backdrop-blur-sm",
        "[&>div]:border-border/50 [&>div]:transition-all [&>div]:duration-200",
        "[&>div:hover]:border-primary [&>div:hover]:shadow-md",
        className
      )}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
