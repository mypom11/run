"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface SegmentedProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
  size = "md",
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "glass inline-flex items-center gap-1 rounded-[var(--radius-pill)] p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[var(--radius-pill)] font-medium transition-all duration-200",
              size === "sm" ? "px-3 h-7 text-xs" : "px-4 h-9 text-sm",
              active
                ? "bg-[var(--accent)] text-white shadow-[0_4px_20px_-4px_var(--accent-glow)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
