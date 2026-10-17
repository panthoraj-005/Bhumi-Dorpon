"use client";

import React from "react";
import { Waves, AlertTriangle, Clock, Percent, Droplets } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { formatNumberLocalized } from "@/lib/translations";
import { ContextCard, FloodContextCard as FloodContextCardType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FloodContextCardProps {
  context?: ContextCard | null;
  peakWaterLevelM?: number;
  dangerLevelDiffM?: number;
  durationDays?: number;
  percentFlooded?: number;
  className?: string;
}

export function FloodContextCard({
  context,
  peakWaterLevelM,
  dangerLevelDiffM,
  durationDays,
  percentFlooded,
  className,
}: FloodContextCardProps) {
  const { language } = useAppStore();
  const isBn = language === "bn";
  const fc = context && "peakWaterLevelDiffM" in context ? (context as FloodContextCardType) : null;

  const peakDiff =
    dangerLevelDiffM ??
    fc?.peakWaterLevelDiffM ??
    1.42;

  const duration =
    durationDays ??
    fc?.durationDays ??
    14;

  const pct =
    percentFlooded ??
    fc?.percentFlooded ??
    68.4;

  const isAboveDanger = peakDiff > 0;

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-xs p-4 flex flex-col gap-3 text-ink",
        className
      )}
      aria-label="Flood contextual indicator card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-water/10 flex items-center justify-center text-water">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              {isBn ? "বন্যা ও হাইড্রোলজি অবস্থা" : "Flood Hydrology Status"}
            </h4>
            <p className="text-[11px] text-muted">
              {isBn ? "গেজ রিডিং ও প্লাবনের স্থায়িত্বকাল" : "Gauge reading & submersion duration"}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "px-2 py-0.5 rounded-pill text-[10px] font-bold border",
            isAboveDanger
              ? "bg-red-50 text-loss border-red-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {isAboveDanger
            ? isBn ? "বিপদসীমার উপরে" : "Danger Exceeded"
            : isBn ? "বিপদসীমার নিচে" : "Within Danger Margin"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60">
        {/* Metric 1: Peak Level vs Danger Level */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Waves className="w-3 h-3 text-water" />
            <span>{isBn ? "বিপদসীমার সাথে তুলনা" : "Peak vs Danger"}</span>
          </div>
          <div className="text-base font-bold text-loss tabular-nums">
            {peakDiff > 0 ? `+${formatNumberLocalized(peakDiff.toFixed(2), language)}` : formatNumberLocalized(peakDiff.toFixed(2), language)} {isBn ? "মি." : "m"}
          </div>
          <div className="text-[9px] text-muted">{isBn ? "বিপদসীমার সাপেক্ষে" : "Rel. to threshold"}</div>
        </div>

        {/* Metric 2: Submersion Duration */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Clock className="w-3 h-3 text-muted" />
            <span>{isBn ? "প্লাবনের মেয়াদ" : "Duration"}</span>
          </div>
          <div className="text-base font-bold text-ink tabular-nums">
            {formatNumberLocalized(duration, language)} {isBn ? "দিন" : "Days"}
          </div>
          <div className="text-[9px] text-muted">{isBn ? "টানা প্লাবন" : "Continuous flood"}</div>
        </div>

        {/* Metric 3: Mouza Flooded Percent */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Percent className="w-3 h-3 text-water" />
            <span>{isBn ? "মৌজা প্লাবিত" : "Mouza Inundated"}</span>
          </div>
          <div className="text-base font-bold text-water tabular-nums">
            {formatNumberLocalized(pct.toFixed(1), language)}%
          </div>
          <div className="text-[9px] text-muted">{isBn ? "মোট মৌজার আয়তনের" : "Of total territory"}</div>
        </div>
      </div>
    </div>
  );
}
