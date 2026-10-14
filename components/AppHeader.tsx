"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, Check, Coins } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { AreaUnit, TimePeriod } from "@/lib/types";
import { SegmentedToggle } from "./SegmentedToggle";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PERIOD_OPTIONS: { id: TimePeriod; label: string }[] = [
  { id: "1y", label: "Last 1 year" },
  { id: "3y", label: "Last 3 years" },
  { id: "5y", label: "Last 5 years" },
  { id: "all", label: "All time" },
];

const UNIT_OPTIONS: { id: AreaUnit; label: string }[] = [
  { id: "decimal", label: "Decimal" },
  { id: "acre", label: "Acre" },
  { id: "hectare", label: "Hectare" },
];

export function AppHeader({
  title = "Overview",
  subtitle,
  children,
}: AppHeaderProps) {
  const { unit, setUnit, period, setPeriod } = useAppStore();
  const [periodOpen, setPeriodOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close period dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setPeriodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.id === period)?.label || "Last 1 year";

  return (
    <header className="w-full bg-bg border-b border-border/80 px-4 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Page Title with Space Grotesk */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Action Controls Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {children}

        {/* Currency Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface border border-border text-xs font-medium text-ink tabular-nums">
          <Coins className="w-3.5 h-3.5 text-muted" />
          <span>৳ (BDT)</span>
        </div>

        {/* Period Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setPeriodOpen(!periodOpen)}
            className="h-10 px-3.5 rounded-pill bg-surface border border-border hover:border-ink/30 text-ink text-xs sm:text-sm font-medium inline-flex items-center gap-2 shadow-subtle transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-muted" />
            <span>{currentPeriodLabel}</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted transition-transform",
                periodOpen && "rotate-180 text-ink"
              )}
            />
          </button>

          {periodOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-40 bg-surface rounded-card border border-border shadow-popover z-50 p-1.5 animate-in fade-in-50 zoom-in-95 duration-150">
              {PERIOD_OPTIONS.map((opt) => {
                const isSelected = opt.id === period;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPeriod(opt.id);
                      setPeriodOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors",
                      isSelected
                        ? "bg-accent-soft text-ink font-semibold"
                        : "text-ink hover:bg-surface-alt"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-accent-deep" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Unit Toggle (Decimal | Acre | Hectare) */}
        <SegmentedToggle<AreaUnit>
          options={UNIT_OPTIONS}
          value={unit}
          onChange={(newUnit) => setUnit(newUnit)}
          size="sm"
          variant="lime"
        />
      </div>
    </header>
  );
}
