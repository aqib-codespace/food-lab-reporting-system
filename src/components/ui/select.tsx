"use client";

import ReactSelect, {
  Props as ReactSelectProps,
  StylesConfig,
} from "react-select";
import { cn } from "@/lib/utils";
import React from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps
  extends Omit<ReactSelectProps<SelectOption, false>, "value" | "onChange"> {
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
}

export function Select({
  value,
  onChange,
  options,
  className,
  placeholder,
  ...props
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const isDarkPreferred = () =>
      typeof window !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches));

    setIsDark(isDarkPreferred());

    const mq =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const handler = (e: MediaQueryListEvent) =>
      setIsDark(document.documentElement.classList.contains("dark") || e.matches);

    if (mq) {
      if ((mq as MediaQueryList).addEventListener) (mq as MediaQueryList).addEventListener("change", handler);
      else (mq as MediaQueryList).addListener(handler);
    }

    return () => {
      if (mq) {
        if ((mq as MediaQueryList).removeEventListener) (mq as MediaQueryList).removeEventListener("change", handler);
        else (mq as MediaQueryList).removeListener(handler);
      }
    };
  }, []);

  const customStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      backgroundColor: isDark ? "#1D2737" : "rgba(255, 255, 255, 0.9)",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      transition: "all 0.2s",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? isDark
          ? "#4b5563"
          : "#e0f2fe"
        : isDark
        ? "#374151"
        : "white",
      color: state.isSelected ? "white" : isDark ? "#f9fafb" : "#111827",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#3b82f6",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
      backgroundColor: isDark ? "#374151" : undefined,
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#f9fafb" : "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#d1d5db" : "#9ca3af",
    }),
    input: (base) => ({
      ...base,
      color: isDark ? "#f9fafb" : "#111827",
    }),
  };

  return (
    <ReactSelect
      value={selectedOption}
      onChange={(newValue) => {
        if (newValue && onChange) {
          onChange(newValue.value);
        }
      }}
      options={options}
      styles={customStyles}
      className={cn("react-select-container", className)}
      classNamePrefix="react-select"
      placeholder={placeholder || "Select..."}
      {...props}
    />
  );
}
