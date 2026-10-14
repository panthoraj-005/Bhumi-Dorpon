"use client";

import React, { useMemo } from "react";
import { MouzaSummary, HazardType, DataMode } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { cn } from "@/lib/utils";
import { Pin, ArrowUpRight } from "lucide-react";

interface MouzaSummaryPanelProps {
  mouzas: MouzaSummary[];
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  onHoverMouza?: (mouzaId: string | null) => void;
  hazard?: HazardType;
  mode?: DataMode;
  className?: string;
}

export function MouzaSummaryPanel({
  mouzas,
  selectedMouzaId,
  onSelectMouza,
  onHoverMouza,
  hazard = "river_erosion",
  mode = "recorded",
  className,
}: MouzaSummaryPanelProps) {
  const { unit } = useAppStore();
  const isForecast = mode === "forecast";

  // Sort mouzas: selected pinned at top, then loss descending
  const { sortedMouzas, totals, maxLoss } = useMemo(() => {
    let totLoss = 0;
    let totGain = 0;
    let totArea = 0;
    let maxL = 1;

    for (const m of mouzas) {
      const l = m.lossDecimal || 0;
      const g = m.gainDecimal || 0;
      totLoss += l;
      totGain += g;
      totArea += m.areaDecimal || 0;
      if (l > maxL) maxL = l;
    }

    const normalizeId = (id: string | null | undefined) => {
      if (!id) return "";
      return id.replace(/^char_/, "mouza_");
    };

    const unpinned = [...mouzas].sort((a, b) => (b.lossDecimal || 0) - (a.lossDecimal || 0));
    let pinned: MouzaSummary | null = null;

    if (selectedMouzaId) {
      const targetNorm = normalizeId(selectedMouzaId);
      const idx = unpinned.findIndex((m) => m.id === selectedMouzaId || normalizeId(m.id) === targetNorm);
      if (idx !== -1) {
        pinned = unpinned.splice(idx, 1)[0];
      } else if (unpinned.length > 0) {
        pinned = unpinned.splice(0, 1)[0];
      }
    }

    const resultList = pinned ? [pinned, ...unpinned] : unpinned;

    return {
      sortedMouzas: resultList,
      totals: {
        loss: Number(totLoss.toFixed(1)),
        gain: Number(totGain.toFixed(1)),
        area: Number(totArea.toFixed(1)),
      },
      maxLoss: maxL,
    };
  }, [mouzas, selectedMouzaId]);

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-xs flex flex-col overflow-hidden text-ink",
        className
      )}
      aria-label="Mouza-wise area impact summary table"
    >
      {/* Panel Header */}
      <div className="p-3 border-b border-border/70 bg-[#F8FAFC] flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <span>Mouza-Wise Summary</span>
            <span className="text-[10px] font-normal text-muted lowercase">
              ({mouzas.length} mouzas in reach)
            </span>
          </h4>
          <p className="text-[11px] text-muted">
            {isForecast ? "Projected land impact" : "Recorded cadastral impact"} across adjacent reach
          </p>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto flex-1 max-h-[360px] overflow-y-auto divide-y divide-border/50 text-[11px]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-[#F1F5F9]/60 text-[10px] font-bold text-muted uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th className="py-2 px-3">Mouza</th>
              <th className="py-2 px-2 text-right">Loss</th>
              <th className="py-2 px-2 text-right">Gain</th>
              <th className="py-2 px-2 text-right">% Area</th>
              <th className="py-2 px-3 text-right">Impact Bar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sortedMouzas.map((m, idx) => {
              const isSelected =
                m.id === selectedMouzaId ||
                (selectedMouzaId
                  ? m.id.replace(/^char_/, "mouza_") === selectedMouzaId.replace(/^char_/, "mouza_") ||
                    idx === 0
                  : false);
              const lossVal = m.lossDecimal || 0;
              const gainVal = m.gainDecimal || 0;
              const lossBarPct = Math.min(100, Math.round((lossVal / maxLoss) * 100));

              return (
                <tr
                  key={m.id}
                  data-mouza-id={m.id}
                  data-selected={isSelected ? "true" : "false"}
                  onClick={() => onSelectMouza?.(m.id)}
                  onMouseEnter={() => onHoverMouza?.(m.id)}
                  onMouseLeave={() => onHoverMouza?.(null)}
                  className={cn(
                    "cursor-pointer transition-colors group",
                    isSelected
                      ? "bg-primary-soft/45 font-semibold text-ink"
                      : "hover:bg-[#F8FAFC]"
                  )}
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/15 text-primary text-[9px] font-bold uppercase tracking-wider rounded border border-primary/20 shrink-0">
                          <Pin className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                          PINNED
                        </span>
                      )}
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          <span>{m.name}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-muted transition-opacity" />
                        </div>
                        <div className="text-[10px] text-muted font-normal">{m.jlNo}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-2 text-right tabular-nums font-semibold text-loss">
                    {lossVal > 0 ? `-${formatArea(lossVal, unit)}` : "—"}
                  </td>

                  <td className="py-2 px-2 text-right tabular-nums text-gain font-semibold">
                    {gainVal > 0 ? `+${formatArea(gainVal, unit)}` : "—"}
                  </td>

                  <td className="py-2 px-2 text-right tabular-nums text-muted font-medium">
                    {m.percent ? `${m.percent}%` : "—"}
                  </td>

                  <td className="py-2 px-3 text-right">
                    <div className="w-16 h-2 bg-border/40 rounded-full overflow-hidden ml-auto">
                      <div
                        className={cn("h-full rounded-full", isForecast ? "bg-[#6A5BD6]" : "bg-loss")}
                        style={{ width: `${lossBarPct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals Row */}
          <tfoot className="bg-[#F8FAFC] font-bold border-t border-border text-[11px] sticky bottom-0">
            <tr>
              <td className="py-2.5 px-3">Reach Total</td>
              <td className="py-2.5 px-2 text-right tabular-nums text-loss">
                {totals.loss > 0 ? `-${formatArea(totals.loss, unit)}` : "0"}
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums text-gain">
                {totals.gain > 0 ? `+${formatArea(totals.gain, unit)}` : "0"}
              </td>
              <td className="py-2.5 px-2 text-right tabular-nums text-muted">
                {totals.area > 0 ? `${((totals.loss / totals.area) * 100).toFixed(1)}%` : "—"}
              </td>
              <td className="py-2.5 px-3 text-right text-[10px] font-normal text-muted">
                {formatArea(totals.area, unit)} reach
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
