"use client";

import React from "react";
import { Waves, TrendingDown, TrendingUp, Navigation, Compass, AlertCircle } from "lucide-react";
import { ContextCard, HazardType, DataMode } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { formatNumberLocalized } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface WaterStatusCardProps {
  context?: ContextCard | null;
  hazard: HazardType;
  mode?: DataMode;
  className?: string;
}

export function WaterStatusCard({ context, hazard, mode = "recorded", className }: WaterStatusCardProps) {
  const { unit, language } = useAppStore();
  const isForecast = mode === "forecast" || Boolean((context as any)?.isProjected);
  const isBn = language === "bn";

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
            <h4 className="text-xs font-bold text-ink">
              {isBn ? "নদী ও জলের গতিপ্রকৃতি" : "Water Status"}
            </h4>
            <p className="text-[10px] text-muted">
              {hazard === "river_erosion"
                ? isBn ? "সক্রিয় নদীর গতিপ্রকৃতি ও ট্রান্সসেক্ট" : "Active channel dynamics & transects"
                : hazard === "char"
                ? isBn ? "পলি সঞ্চয়ন ও সক্রিয় চ্যানেল" : "Alluvial braiding & active channel"
                : isBn ? "মোহনা তীররেখার পরিবর্তন" : "Estuarine shoreline dynamics"}
            </p>
          </div>
        </div>

        {isForecast && (
          <span className="px-2 py-0.5 rounded-pill bg-[#6A5BD6]/10 text-[#6A5BD6] font-bold text-[10px] border border-[#6A5BD6]/20">
            {isBn ? "প্রক্ষেপিত" : "Projected"}
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
                {isBn ? "চ্যানেলের প্রস্থ (৩টি ট্রান্সসেক্ট)" : "Channel Widths (3 Transects)"}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {context.transects.map((t, idx) => (
                  <div key={idx} className="bg-surface p-2 rounded-lg border border-border/60">
                    <div className="text-[10px] text-muted font-semibold">
                      {isBn ? `ট্রান্সসেক্ট ${formatNumberLocalized(idx + 1, language)}` : t.label}
                    </div>
                    <div className="text-xs font-bold text-ink tabular-nums mt-0.5">
                      {formatNumberLocalized(t.widthM.toLocaleString(), language)} {isBn ? "মি." : "m"}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] tabular-nums font-semibold mt-0.5",
                        t.changeM < 0 ? "text-loss" : "text-gain"
                      )}
                    >
                      {t.changeM > 0
                        ? `+${formatNumberLocalized(t.changeM, language)} ${isBn ? "মি." : "m"}`
                        : `${formatNumberLocalized(t.changeM, language)} ${isBn ? "মি." : "m"}`}{" "}
                      {isBn ? "পূর্বে তুলনায়" : "vs prior"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thalweg shift & Mean Migration */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted font-medium">
                {isBn ? "গভীরতম প্রবাহরেখার (Thalweg) পরিবর্তন" : "Thalweg (Deep Flow) Shift"}
              </span>
              <div className="text-sm font-bold text-ink tabular-nums">
                {formatNumberLocalized(context.thalwegShiftM || 68, language)} {isBn ? "মিটার" : "m"}{" "}
                {isForecast ? (isBn ? "(অনুমান)" : "(est.)") : (isBn ? "(পার্শ্বীয়)" : "lateral")}
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted font-medium">
                {isBn ? "গড় তীরভাঙন / সরণ হার" : "Mean Bank Migration"}
              </span>
              <div className="text-sm font-bold text-loss tabular-nums">
                {formatNumberLocalized(context.meanMigrationRateMYr ?? (context as any).meanBankMigrationMYr ?? 32.5, language)} {isBn ? "মি./বছর" : "m/yr"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAR CONTEXT */}
      {context.type === "char" && (
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "সক্রিয় চ্যানেলের প্রস্থ" : "Active Channel Width"}
            </span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {formatNumberLocalized((context.activeChannelWidthM || 2150).toLocaleString(), language)} {isBn ? "মিটার" : "m"}
            </div>
            <div className="text-[10px] text-muted">{isBn ? "শাখানদীর বিস্তার" : "Braided reach span"}</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "বর্তমান চরের আয়তন" : "Current Char Footprint"}
            </span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {formatArea(context.charAreaCurrentDec || 420.5, unit, language)}
            </div>
            <div className="text-[10px] text-muted">
              {isBn ? "পূর্বে:" : "Prior:"} {formatArea(context.charAreaPreviousDec || 388.2, unit, language)}
            </div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "নিট ভূমির পরিবর্তন" : "Net Land Change"}
            </span>
            <div
              className={cn(
                "text-sm font-bold tabular-nums",
                (context.netChangeDec || 0) >= 0 ? "text-gain" : "text-loss"
              )}
            >
              {(context.netChangeDec || 0) >= 0
                ? `+${formatArea(context.netChangeDec || 0, unit, language)}`
                : `-${formatArea(Math.abs(context.netChangeDec || 0), unit, language)}`}
            </div>
            <div className="text-[10px] text-secondary">{isBn ? "পয়স্তির ভারসাম্য" : "Accretion balance"}</div>
          </div>
        </div>
      )}

      {/* COASTAL CONTEXT */}
      {context.type === "coastal" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "তীররেখা পরিবর্তনের হার" : "Shoreline Change Rate"}
            </span>
            <div
              className={cn(
                "text-sm font-bold tabular-nums",
                (context.shorelineChangeMYr || 0) < 0 ? "text-loss" : "text-gain"
              )}
            >
              {(context.shorelineChangeMYr || -34.5) > 0
                ? `+${formatNumberLocalized(context.shorelineChangeMYr || 0, language)}`
                : formatNumberLocalized(context.shorelineChangeMYr || -34.5, language)}{" "}
              {isBn ? "মি./বছর" : "m/yr"}
            </div>
            <div className="text-[10px] text-muted">{isBn ? "তীর অপসারণের দিক" : "Transgression vector"}</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "জোয়ার-ভাটা প্লাবিত এলাকা" : "Tidal Flat Area"}
            </span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {formatArea(context.tidalFlatAreaDec || 840.5, unit, language)}
            </div>
            <div className="text-[10px] text-muted">{isBn ? "উপকূলীয় পলিময় কাদাভূমি" : "Intertidal mudflat"}</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "ভরা কটালের জোয়ারের বিস্তার" : "Spring Tidal Range"}
            </span>
            <div className="text-sm font-bold text-ink tabular-nums">
              {formatNumberLocalized(context.tidalRangeM || 3.2, language)} {isBn ? "মিটার" : "m"}
            </div>
            <div className="text-[10px] text-muted">{isBn ? "অর্ধ-দৈনিক চক্র" : "Semi-diurnal cycle"}</div>
          </div>

          <div className="bg-surface p-2 rounded-lg border border-border/60 space-y-0.5">
            <span className="text-[10px] text-muted font-semibold">
              {isBn ? "নিট ভূমির পরিবর্তন" : "Net Land Change"}
            </span>
            <div
              className={cn(
                "text-sm font-bold tabular-nums",
                (context.netLandChangeDec || 0) >= 0 ? "text-gain" : "text-loss"
              )}
            >
              {(context.netLandChangeDec || 125.4) >= 0
                ? `+${formatArea(context.netLandChangeDec || 125.4, unit, language)}`
                : `-${formatArea(Math.abs(context.netLandChangeDec || 125.4), unit, language)}`}
            </div>
            <div className="text-[10px] text-secondary">{isBn ? "পলিমাটি পয়স্তি" : "Sediment accretion"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
