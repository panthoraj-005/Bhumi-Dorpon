"use client";

import React from "react";
import { Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import { t } from "@/lib/translations";

interface ForecastBadgeProps {
  label?: string;
  showDisclaimerNote?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function ForecastBadge({
  label,
  showDisclaimerNote = false,
  className,
  size = "md",
}: ForecastBadgeProps) {
  const { language } = useAppStore();
  const displayLabel = label || (language === "bn" ? "পূর্বাভাস" : "Forecast");

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-pill border border-dashed border-[#6A5BD6] bg-[#ECE9FB] text-[#6A5BD6] tracking-wide",
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"
        )}
      >
        <Sparkles className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span>{displayLabel}</span>
      </div>

      {showDisclaimerNote && (
        <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
          <Info className="w-3 h-3 text-[#6A5BD6] flex-shrink-0" />
          <span>{t("disclaimerNote", language)}</span>
        </p>
      )}
    </div>
  );
}
