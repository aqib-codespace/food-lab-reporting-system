"use client";

import * as React from "react";
import { Switch as RizzuiSwitch } from "rizzui";
import { cn } from "@/lib/utils";

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, ...props }, ref) => (
    <RizzuiSwitch
      ref={ref}
      label={label}
      className={cn(
        "glass-card [&>div]:backdrop-blur-sm",
        "[&>div]:transition-all [&>div]:duration-200",
        "[&>div:hover]:shadow-md",
        className
      )}
      {...props}
    />
  )
);
Switch.displayName = "Switch";

export { Switch };
