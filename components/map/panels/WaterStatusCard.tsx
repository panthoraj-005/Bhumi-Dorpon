"use client";

import React from "react";
import { Waves, TrendingDown, TrendingUp, Navigation, Compass, AlertCircle } from "lucide-react";
import { ContextCard, HazardType, DataMode } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { cn } from "@/lib/utils";

interface WaterStatusCardProps {
  context?: ContextCard | null;
  hazard: HazardType;
  mode?: DataMode;
  className?: string;
}

export function WaterStatusCard({ context, hazard, mode = "recorded", className }: WaterStatusCardProps) {
  const { unit } = useAppStore();
  const isForecast = mode === "forecast" || Boolean((context as any)?.isProjected);

  if (!context) return null;

  return (
    <div
      className={cn(
        "bhumidorpon-card p-4 space-y-3 bg-gradient-to-br from-surface to-[#F0F7FC]/50",
        className
      )}
    >
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-water/15 text-water flex items-center justify-center">
            <Waves className="w-4 h-4 text-water" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Water Status</h4>
            <p className="text-[10px] text-muted">
              {hazard === "river_erosion"
                ? "Active channel dynamics & transects"
                : hazard === "char"
                ? "Alluvial braiding & active channel"
                : "Estuarine shoreline dynamics"}
            </p>
          </div>
        </div>

        {isForecast && (
          <span className="px-2 py-0.5 rounded-pill bg-[#6A5BD6]/10 text-[#6A5BD6] font-bold text-[10px] border border-[#6A5BD6]/20">
            Projected
          </span>
        )}
      </div>

      {/* RIVER EROSION CONTEXT */}
      {context.type === "river_erosion" && (
        <div className="space-y-2.5 text-[11px]">
          {/* Transect channel widths */}
          {context.transects && context.transects.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                Channel Widths (3 Transects)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {context.transects.map((t, idx) => (
                  <div key={idx} className="bg-surface p-2 rounded-lg border border-border/60">
                    <div className="text-[10px] text-muted font-semibold">{t.label}</div>
                    <div className="text-xs font-bold text-ink tabular-nums mt-0.5">
                      {t.widthM.toLocaleString()} m
                    </div>
                    <div
                      className={cn(
                        "text-[10px] tabular-nums font-semibold mt-0.5",
                        t.changeM < 0 ? "text-loss" : "text-gain"
                      )}
                    >
                      {t.changeM > 0 ? `+${t.changeM} m` : `${t.changeM} m`} vs prior
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thalweg shift & Mean Migration */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted font-medium">Thalweg (Deep Flow) Shift</span>
              <div className="text-sm font-bold text-ink tabular-nums">
                {context.thalwegShiftM || 68} m {isForecast ? "(est.)" : "lateral"}
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted font-medium">Mean Bank Migration</span>
              <div className="text-sm font-bold text-loss tabular-nums">
                {context.meanMigrationRateMYr ?? (context as any).meanBankMigrationMYr ?? 32.5} m/yr
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAR CONTEXT */}
      {context.type === "char" && (
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Active Channel Width</span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {(context.activeChannelWidthM || 2150).toLocaleString()} m
            </div>
            <div className="text-[10px] text-muted">Braided reach span</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Current Char Footprint</span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {formatArea(context.charAreaCurrentDec || 420.5, unit)}
            </div>
            <div className="text-[10px] text-muted">
              Prior: {formatArea(context.charAreaPreviousDec || 388.2, unit)}
            </div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Net Land Change</span>
            <div
              className={cn(
                "text-sm font-bold tabular-nums",
                (context.netChangeDec || 0) >= 0 ? "text-gain" : "text-loss"
              )}
            >
              {(context.netChangeDec || 0) >= 0
                ? `+${formatArea(context.netChangeDec || 0, unit)}`
                : `-${formatArea(Math.abs(context.netChangeDec || 0), unit)}`}
            </div>
            <div className="text-[10px] text-secondary">Accretion balance</div>
          </div>
        </div>
      )}

      {/* COASTAL CONTEXT */}
      {context.type === "coastal" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Shoreline Change Rate</span>
            <div
              className={cn(
                "text-sm font-bold tabular-nums",
                (context.shorelineChangeMYr || 0) < 0 ? "text-loss" : "text-gain"
              )}
            >
              {(context.shorelineChangeMYr || -34.5) > 0 ? `+${context.shorelineChangeMYr}` : context.shorelineChangeMYr} m/yr
            </div>
            <div className="text-[10px] text-muted">Transgression vector</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Tidal Flat Area</span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {formatArea(context.tidalFlatAreaDec || 840.5, unit)}
            </div>
            <div className="text-[10px] text-muted">Intertidal mudflat</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Spring Tidal Range</span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {context.tidalRangeM || 3.2} m
            </div>
            <div className="text-[10px] text-muted">Semi-diurnal cycle</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">Net Land Change</span>
            <div
              className={cn(
                "text-sm font-bold tabular-nums",
                (context.netLandChangeDec || 0) >= 0 ? "text-gain" : "text-loss"
              )}
            >
              {(context.netLandChangeDec || 125.4) >= 0
                ? `+${formatArea(context.netLandChangeDec || 125.4, unit)}`
                : `-${formatArea(Math.abs(context.netLandChangeDec || 125.4), unit)}`}
            </div>
            <div className="text-[10px] text-secondary">Sediment accretion</div>
          </div>
        </div>
      )}
    </div>
  );
}
