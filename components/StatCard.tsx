"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import { formatNumberLocalized } from "@/lib/translations";

interface StatCardProps {
  label: string;
  value: string | number;
  unitLabel?: string;
  subtext?: string;
  changePercent?: number;
  changeDirection?: "up" | "down" | "neutral";
  changeIsGain?: boolean; // For land: gain is green, loss is coral
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  unitLabel,
  subtext,
  changePercent,
  changeDirection,
  changeIsGain,
  icon,
  badge,
  className,
}: StatCardProps) {
  const { language } = useAppStore();
  // Determine color of change pill
  // If changeIsGain is explicitly set: true = green gain, false = red/coral loss
  const isPositiveGain = changeIsGain ?? (changePercent ? changePercent > 0 : false);

  return (
    <div
      className={cn(
        "bhumidorpon-card p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-[#D0D4C5]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs sm:text-sm font-medium text-muted">{label}</span>
        <div className="flex items-center gap-2">
          {badge}
          {icon && (
            <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-ink-2">
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 my-1">
        <span className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-ink tracking-tight tabular-nums">
          {value}
        </span>
        {unitLabel && (
          <span className="text-sm font-medium text-muted">{unitLabel}</span>
        )}
      </div>

      {(changePercent !== undefined || subtext) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#F0F2EA] text-xs">
          {changePercent !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-pill font-medium tabular-nums",
                isPositiveGain
                  ? "bg-[#DFF3E8] text-[#2F9E62]"
                  : "bg-[#FBE5E0] text-[#E4604A]"
              )}
            >
              {changeDirection === "up" || (changePercent > 0 && !changeDirection) ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : changeDirection === "down" || (changePercent < 0 && !changeDirection) ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              <span>{formatNumberLocalized(Math.abs(changePercent).toFixed(1), language)}%</span>
            </span>
          )}
          {subtext && <span className="text-muted truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
