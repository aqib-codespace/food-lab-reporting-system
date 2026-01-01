"use client";

import * as React from "react";
import { Textarea as RizzuiTextarea } from "rizzui";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  textareaClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, textareaClassName, ...props },
    ref
  ) => {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <RizzuiTextarea
          ref={ref}
          error={error}
          helperText={helperText}
          textareaClassName={cn(
            "glass-card !bg-white/50 dark:!bg-card/50 backdrop-blur-sm border-border/50",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200 min-h-[100px]",
            textareaClassName
          )}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
