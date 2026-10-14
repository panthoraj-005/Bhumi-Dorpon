"use client";

import React from "react";
import { ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { RankedDistrictItem } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { cn } from "@/lib/utils";

interface RankedListProps {
  items: RankedDistrictItem[];
  title?: string;
  subtitle?: string;
  onSelectItem?: (districtId: string) => void;
  selectedId?: string | null;
  className?: string;
}

export function RankedList({
  items,
  title = "Top Impacted Districts",
  subtitle = "Ranked by net land erosion area",
  onSelectItem,
  selectedId,
  className,
}: RankedListProps) {
  const { unit } = useAppStore();

  const maxLoss = Math.max(...items.map((i) => i.lossDecimal), 1);

  return (
    <div className={cn("bhumidorpon-card p-5 sm:p-6 flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => {
          const isSelected = selectedId === item.districtId;
          const barWidthPercent = (item.lossDecimal / maxLoss) * 100;

          return (
            <div
              key={item.districtId}
              onClick={() => onSelectItem?.(item.districtId)}
              className={cn(
                "py-3.5 px-3 -mx-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 group",
                isSelected
                  ? "bg-accent-soft"
                  : "hover:bg-surface-alt/70"
              )}
            >
              {/* Rank + Name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold tabular-nums flex-shrink-0",
                    item.rank === 1
                      ? "bg-accent text-accent-ink"
                      : "bg-surface-alt text-ink border border-border"
                  )}
                >
                  {item.rank}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-ink group-hover:text-ink truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-medium text-ink tabular-nums">
                      {formatArea(item.lossDecimal, unit)}
                    </span>
                  </div>

                  {/* Relative bar track */}
                  <div className="w-full h-1.5 bg-[#E8EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-loss rounded-full transition-all duration-300"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Delta Chip & Chevron */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-pill text-xs font-medium tabular-nums",
                    item.isIncrease
                      ? "bg-[#FBE5E0] text-[#E4604A]"
                      : "bg-[#DFF3E8] text-[#2F9E62]"
                  )}
                >
                  {item.isIncrease ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{Math.abs(item.changeRate).toFixed(1)}%</span>
                </span>

                <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
