"use client";

import React from "react";
import {
  FileQuestion,
  SearchX,
  Compass,
  RotateCcw,
  Waves,
  Mountain,
  CloudRain,
  MapPinOff,
} from "lucide-react";
import { HazardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";

interface EmptyStateProps {
  title?: string;
  description?: string;
  hazard?: HazardType;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  hazard,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const { language } = useAppStore();
  const isBn = language === "bn";

  const displayTitle = title || (isBn ? "কোনো তথ্য পাওয়া যায়নি" : "No data available for this selection");
  const displayDescription =
    description ||
    (isBn
      ? "নথিভুক্ত ভূমির পরিবর্তন দেখতে অন্য কোনো জেলা, উপজেলা বা মৌজা নির্বাচন করুন।"
      : "Try selecting another district, upazila, or mouza to view recorded land change records.");
  const displayActionLabel = actionLabel || (isBn ? "অন্য এলাকা নির্বাচন করুন" : "Choose another area");

  const getDefaultIcon = () => {
    if (icon) return icon;
    const iconClass = "w-16 h-16 text-muted stroke-[1.25]";
    switch (hazard) {
      case "river_erosion":
        return <Waves className={iconClass} />;
      case "flood":
        return <CloudRain className={iconClass} />;
      case "landslide":
        return <Mountain className={iconClass} />;
      case "char":
        return <Compass className={iconClass} />;
      case "coastal":
        return <MapPinOff className={iconClass} />;
      default:
        return <SearchX className={iconClass} />;
    }
  };

  return (
    <div
      className={cn(
        "bhumidorpon-card p-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-6 border-dashed",
        className
      )}
    >
      <div className="mb-4 text-muted flex items-center justify-center">
        {getDefaultIcon()}
      </div>

      <h3 className="text-lg font-semibold text-ink mb-1.5">{displayTitle}</h3>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
        {displayDescription}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-lime px-5 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{displayActionLabel}</span>
        </button>
      )}
    </div>
  );
}
