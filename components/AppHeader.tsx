"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Calendar,
  Check,
  Search,
  Coins,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { AreaUnit, TimePeriod } from "@/lib/types";
import { SegmentedToggle } from "./SegmentedToggle";
import { cn } from "@/lib/utils";
import { t, Language } from "@/lib/translations";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function AppHeader({
  title = "Overview",
  subtitle,
  children,
}: AppHeaderProps) {
  const {
    unit,
    setUnit,
    period,
    setPeriod,
    language,
    setLanguage,
  } = useAppStore();

  const [periodOpen, setPeriodOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
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

  const PERIOD_OPTIONS: { id: TimePeriod; label: string }[] = [
    { id: "1y", label: t("period1y", language) },
    { id: "3y", label: t("period3y", language) },
    { id: "5y", label: t("period5y", language) },
    { id: "all", label: t("periodAll", language) },
  ];

  const UNIT_OPTIONS: { id: AreaUnit; label: string }[] = [
    { id: "decimal", label: t("unitDecimal", language) },
    { id: "acre", label: t("unitAcre", language) },
    { id: "hectare", label: t("unitHectare", language) },
  ];

  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.id === period)?.label || PERIOD_OPTIONS[0].label;

  return (
    <header className="w-full bg-bg border-b border-border/80 px-4 sm:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Page Title with Space Grotesk */}
      <div className="min-w-0 shrink">
        <h1
          className={cn(
            "text-2xl sm:text-3xl font-display font-semibold tracking-tight text-ink",
            language === "bn" ? "leading-snug sm:leading-normal" : "leading-tight"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted mt-1 sm:mt-1.5 leading-normal">{subtitle}</p>
        )}
      </div>

      {/* Action Controls Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 justify-start md:justify-end md:flex-1 md:ml-auto">
        {/* Unit Toggle (শতাংশ | একর | হেক্টর) - Aligned to Far Left of toolbar */}
        <div className="inline-flex items-center shrink-0">
          <SegmentedToggle<AreaUnit>
            options={UNIT_OPTIONS}
            value={unit}
            onChange={(newUnit) => setUnit(newUnit)}
            size="sm"
            variant="lime"
          />
        </div>

        {children}

        {/* PROMINENT "LAND INFORMATION / ভূমির তথ্য" SEARCH BUTTON */}
        <Link
          href="/land-information"
          className="h-10 px-3.5 rounded-pill bg-surface hover:bg-surface-alt border border-border hover:border-ink/30 text-ink text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-subtle transition-all group"
          title={t("landInfoSearchTitle", language)}
        >
          <Search className="w-3.5 h-3.5 text-accent-deep group-hover:scale-110 transition-transform" />
          <span>{t("navLandInfo", language)}</span>
          <span className="hidden xl:inline text-[10px] text-muted font-normal">
            ({language === "bn" ? "দাগ ও খতিয়ান" : "Dag & Khatian"})
          </span>
        </Link>

        {/* GLOBAL BANGLA / ENGLISH LANGUAGE SWITCH */}
        <div className="inline-flex items-center rounded-pill bg-surface border border-border p-1 shadow-subtle">
          <button
            type="button"
            onClick={() => setLanguage("bn")}
            className={cn(
              "px-2.5 py-1 rounded-pill text-xs font-semibold transition-all",
              language === "bn"
                ? "bg-accent text-accent-ink shadow-xs"
                : "text-muted hover:text-ink"
            )}
            title="বাংলা ইন্টারফেস"
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={cn(
              "px-2.5 py-1 rounded-pill text-xs font-semibold transition-all",
              language === "en"
                ? "bg-accent text-accent-ink shadow-xs"
                : "text-muted hover:text-ink"
            )}
            title="English interface"
          >
            English
          </button>
        </div>

        {/* Currency Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface border border-border text-xs font-medium text-ink tabular-nums">
          <Coins className="w-3.5 h-3.5 text-muted" />
          <span>{language === "bn" ? "৳ (টাকা)" : "৳ (BDT)"}</span>
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
      </div>
    </header>
  );
}
