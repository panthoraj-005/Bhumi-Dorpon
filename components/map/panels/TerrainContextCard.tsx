"use client";

import React from "react";
import { Mountain, CloudRain, Activity, Layers, Compass } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { formatNumberLocalized } from "@/lib/translations";
import { ContextCard, LandslideContextCard } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TerrainContextCardProps {
  context?: ContextCard | null;
  minElevationM?: number;
  maxElevationM?: number;
  meanSlopeDeg?: number;
  scarMeanSlopeDeg?: number;
  soilVolumeM3?: number;
  triggerRainfallMm?: number;
  className?: string;
}

export function TerrainContextCard({
  context,
  minElevationM,
  maxElevationM,
  meanSlopeDeg,
  scarMeanSlopeDeg,
  soilVolumeM3,
  triggerRainfallMm,
  className,
}: TerrainContextCardProps) {
  const { language } = useAppStore();
  const isBn = language === "bn";
  const tc = context && "minElevationM" in context ? (context as LandslideContextCard) : null;

  const minElev = minElevationM ?? tc?.minElevationM ?? 120;
  const maxElev = maxElevationM ?? tc?.maxElevationM ?? 380;
  const slope = meanSlopeDeg ?? tc?.meanSlopeDeg ?? 26.5;
  const scarSlope = scarMeanSlopeDeg ?? tc?.scarMeanSlopeDeg ?? 39.2;
  const volume = soilVolumeM3 ?? tc?.soilVolumeM3 ?? 142000;
  const rainfall = triggerRainfallMm ?? tc?.triggerRainfallMm ?? 285;

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-xs p-4 flex flex-col gap-3 text-ink",
        className
      )}
      aria-label="Landslide terrain morphometry and geotechnical indicators"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-loss/10 flex items-center justify-center text-loss">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              {isBn ? "ভূ-প্রাকৃতিক পরিমাপ ও ভূতাত্ত্বিক তথ্য" : "Terrain Morphometry & Geotechnics"}
            </h4>
            <p className="text-[11px] text-muted">
              {isBn ? "উচ্চতামিতিক রূপরেখা ও স্থানান্তরিত মাটির আয়তন" : "Hypsometric relief & displacement volume"}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
          {isBn ? "খাড়া পাহাড়ি ঢাল" : "Steep Escarpment"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/60">
        {/* Metric 1: Elevation Relief */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Layers className="w-3 h-3 text-muted" />
            <span>{isBn ? "উচ্চতার পরিসর" : "Elevation Relief"}</span>
          </div>
          <div className="text-sm font-bold text-ink tabular-nums">
            {formatNumberLocalized(minElev, language)} – {formatNumberLocalized(maxElev, language)} {isBn ? "মি." : "m"}
          </div>
          <div className="text-[9px] text-muted">{isBn ? "ডিজিটাল এলিভেশন মডেল" : "DEM Hypsometry"}</div>
        </div>

        {/* Metric 2: Mean & Scar Slope */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Compass className="w-3 h-3 text-loss" />
            <span>{isBn ? "ধসের ক্ষত ঢাল" : "Scar Slope"}</span>
          </div>
          <div className="text-sm font-bold text-loss tabular-nums">
            {formatNumberLocalized(scarSlope.toFixed(1), language)}°
          </div>
          <div className="text-[9px] text-muted">
            {isBn ? `গড় ঢাল: ${formatNumberLocalized(slope.toFixed(1), language)}°` : `Slope avg: ${slope.toFixed(1)}°`}
          </div>
        </div>

        {/* Metric 3: Soil Volume */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Activity className="w-3 h-3 text-muted" />
            <span>{isBn ? "স্থানান্তরিত ধ্বংসাবশেষ" : "Debris Volume"}</span>
          </div>
          <div className="text-sm font-bold text-ink tabular-nums">
            {formatNumberLocalized(volume.toLocaleString(), language)} m³
          </div>
          <div className="text-[9px] text-muted">{isBn ? "কাট/ফিল যাচাইকৃত" : "Cut/Fill verified"}</div>
        </div>

        {/* Metric 4: Trigger Rainfall */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <CloudRain className="w-3 h-3 text-water" />
            <span>{isBn ? "ধস-উদ্বুদ্ধকারী বৃষ্টিপাত" : "Trigger Rainfall"}</span>
          </div>
          <div className="text-sm font-bold text-water tabular-nums">
            {formatNumberLocalized(rainfall, language)} mm
          </div>
          <div className="text-[9px] text-muted">{isBn ? "২৪ ঘণ্টার মোট বৃষ্টি" : "24h Cumulative"}</div>
        </div>
      </div>
    </div>
  );
}
