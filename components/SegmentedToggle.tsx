import React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface SegmentedToggleProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "lime" | "ink";
}

export function SegmentedToggle<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  variant = "lime",
}: SegmentedToggleProps<T>) {
  const sizeClasses = {
    sm: "p-0.5 text-xs h-8",
    md: "p-1 text-sm h-10",
    lg: "p-1.5 text-base h-12",
  }[size];

  const itemPadding = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1.5",
    lg: "px-4 py-2",
  }[size];

  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center bg-[#F0F2EA] border border-border rounded-pill select-none",
        sizeClasses,
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded-pill font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink",
              itemPadding,
              isSelected
                ? variant === "lime"
                  ? "bg-accent text-accent-ink shadow-sm font-semibold"
                  : "bg-surface text-ink shadow-sm font-semibold"
                : "text-ink-2 hover:text-ink hover:bg-black/5"
            )}
          >
            {option.icon && (
              <span className="flex items-center justify-center flex-shrink-0">
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
            {option.badge && <span className="ml-1">{option.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
