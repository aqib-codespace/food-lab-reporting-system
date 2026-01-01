import * as React from "react";
import { Badge as RizzuiBadge } from "rizzui";
import { cn } from "@/lib/utils";

type BadgeVariant = "solid" | "flat" | "outline";
type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: "sm" | "md" | "lg" | "full" | "none";
}

function Badge({
  className,
  variant = "solid",
  color = "primary",
  size = "md",
  rounded = "full",
  children,
  ...props
}: BadgeProps) {
  return (
    <RizzuiBadge
      variant={variant}
      color={color}
      size={size}
      className={cn(
        "glass-card backdrop-blur-sm font-medium transition-all duration-200",
        "hover:shadow-md hover:scale-105",
        className
      )}
      {...props}
    >
      {children}
    </RizzuiBadge>
  );
}

export { Badge };
