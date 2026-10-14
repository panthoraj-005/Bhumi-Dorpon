"use client";

import React from "react";
import { Waves, AlertTriangle, Clock, Percent, Droplets } from "lucide-react";
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
              Flood Hydrology Status
            </h4>
            <p className="text-[11px] text-muted">Gauge reading & submersion duration</p>
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
          {isAboveDanger ? "Danger Exceeded" : "Within Danger Margin"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60">
        {/* Metric 1: Peak Level vs Danger Level */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Waves className="w-3 h-3 text-water" />
            <span>Peak vs Danger</span>
          </div>
          <div className="text-base font-bold text-loss tabular-nums">
            {peakDiff > 0 ? `+${peakDiff.toFixed(2)}` : peakDiff.toFixed(2)} m
          </div>
          <div className="text-[9px] text-muted">Rel. to threshold</div>
        </div>

        {/* Metric 2: Submersion Duration */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Clock className="w-3 h-3 text-muted" />
            <span>Duration</span>
          </div>
          <div className="text-base font-bold text-ink tabular-nums">
            {duration} Days
          </div>
          <div className="text-[9px] text-muted">Continuous flood</div>
        </div>

        {/* Metric 3: Mouza Flooded Percent */}
        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted mb-1 font-medium">
            <Percent className="w-3 h-3 text-water" />
            <span>Mouza Inundated</span>
          </div>
          <div className="text-base font-bold text-water tabular-nums">
            {pct.toFixed(1)}%
          </div>
          <div className="text-[9px] text-muted">Of total territory</div>
        </div>
      </div>
    </div>
  );
}
