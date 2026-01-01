"use client";

import * as React from "react";
import { Button as RizzuiButton } from "rizzui";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "flat" | "text";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  isLoading?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "solid", size = "md", color = "primary", ...props },
    ref
  ) => {
    return (
      <RizzuiButton
        ref={ref}
        variant={variant}
        size={size}
        color={color}
        className={cn(
          "glass-card backdrop-blur-sm border-border/50",
          "transition-all duration-200",
          "hover:shadow-lg hover:-translate-y-0.5",
          "focus:ring-2 focus:ring-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
