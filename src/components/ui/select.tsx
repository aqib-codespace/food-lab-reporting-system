"use client";

import ReactSelect, {
  Props as ReactSelectProps,
  StylesConfig,
} from "react-select";
import { cn } from "@/lib/utils";

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

  const customStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
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
        ? "#e0f2fe"
        : "white",
      color: state.isSelected ? "white" : "#111827",
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
      border: "1px solid #e5e7eb",
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
    input: (base) => ({
      ...base,
      color: "#111827",
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
