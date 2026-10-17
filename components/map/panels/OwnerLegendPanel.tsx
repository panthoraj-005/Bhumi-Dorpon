"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye, EyeOff, UserCheck, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatArea } from "@/lib/units";
import { useAppStore } from "@/stores/appStore";
import {
  getLocalizedOwnerName,
  getLocalizedFatherName,
  formatNumberLocalized,
} from "@/lib/translations";

export const FLOOD_OWNER_COLORS = [
  "#E0A100",
  "#C2557A",
  "#5E8C31",
  "#8A5A44",
  "#3C8D93",
  "#B8722C",
  "#7B6FB5",
  "#A0A83A",
  "#D4698B",
  "#4F7CA3",
  "#7A8A4B",
  "#B35A3C",
];

export function getOwnerColorStyle(colorIndex: number = 0) {
  const color = FLOOD_OWNER_COLORS[colorIndex % FLOOD_OWNER_COLORS.length];
  const cycle = Math.floor(colorIndex / FLOOD_OWNER_COLORS.length);
  const borderStyle = cycle === 1 ? "dashed" : cycle >= 2 ? "dotted" : "solid";
  return { color, borderStyle };
}

export interface OwnerLegendItem {
  ownerId: string;
  name: string;
  fatherName?: string;
  colorIndex: number;
  plotCount: number;
  floodedAreaDecimal: number;
  mouzaId?: string;
  floodId?: string;
}

interface OwnerLegendPanelProps {
  owners: OwnerLegendItem[];
  isolatedOwnerId?: string | null;
  onToggleIsolateOwner: (ownerId: string | null) => void;
  onHoverOwner?: (ownerId: string | null) => void;
  className?: string;
}

export function OwnerLegendPanel({
  owners,
  isolatedOwnerId,
  onToggleIsolateOwner,
  onHoverOwner,
  className,
}: OwnerLegendPanelProps) {
  const { unit, language } = useAppStore();
  const [search, setSearch] = useState("");

  const filteredOwners = useMemo(() => {
    if (!search.trim()) return owners;
    const q = search.trim().toLowerCase();
    return owners.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        getLocalizedOwnerName(o.name, "bn").toLowerCase().includes(q) ||
        (o.fatherName &&
          (o.fatherName.toLowerCase().includes(q) ||
            getLocalizedFatherName(o.fatherName, "bn").toLowerCase().includes(q))) ||
        o.ownerId.toLowerCase().includes(q)
    );
  }, [owners, search]);

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border shadow-xs flex flex-col overflow-hidden text-ink",
        className
      )}
      aria-label="Flood affected owner color legend panel"
    >
      {/* Header */}
      <div className="p-3 border-b border-border/70 bg-[#F8FAFC] space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <span>{language === "bn" ? "মালিকানা দাগ লেজেন্ড" : "Owner Parcel Legend"}</span>
              <span className="text-[10px] font-normal text-muted lowercase">
                ({formatNumberLocalized(owners.length, language)} {language === "bn" ? "জন মালিক" : "owners"})
              </span>
            </h4>
            <p className="text-[11px] text-muted">
              {language === "bn"
                ? "মানচিত্রে দাগ আলাদা করতে মালিকের নামে ক্লিক করুন"
                : "Click an owner to isolate their plots on the map"}
            </p>
          </div>
          {isolatedOwnerId && (
            <button
              type="button"
              onClick={() => onToggleIsolateOwner(null)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-ink text-surface hover:bg-ink/80 transition-colors shadow-2xs"
            >
              <X className="w-3 h-3" />
              <span>{language === "bn" ? "ফিল্টার মুছুন" : "Clear Filter"}</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "bn" ? "মালিকের নাম দিয়ে খুঁজুন..." : "Search by owner name..."}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Owner Items List */}
      <div className="overflow-y-auto max-h-[380px] divide-y divide-border/50 text-[11px]">
        {filteredOwners.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted">
            {language === "bn" ? `"${search}" দিয়ে কোনো মালিক পাওয়া যায়নি` : `No owners match "${search}"`}
          </div>
        ) : (
          filteredOwners.map((owner) => {
            const isIsolated = isolatedOwnerId === owner.ownerId;
            const isOtherDimmed = Boolean(isolatedOwnerId && !isIsolated);
            const { color, borderStyle } = getOwnerColorStyle(owner.colorIndex);

            return (
              <div
                key={owner.ownerId}
                data-owner-id={owner.ownerId}
                data-isolated={isIsolated ? "true" : "false"}
                onMouseEnter={() => onHoverOwner?.(owner.ownerId)}
                onMouseLeave={() => onHoverOwner?.(null)}
                className={cn(
                  "p-2.5 flex items-center justify-between gap-2 transition-all cursor-pointer",
                  isIsolated
                    ? "bg-primary-soft/50 font-semibold"
                    : isOtherDimmed
                    ? "opacity-45 hover:opacity-100 hover:bg-[#F8FAFC]"
                    : "hover:bg-[#F8FAFC]"
                )}
                onClick={() => {
                  onToggleIsolateOwner(isIsolated ? null : owner.ownerId);
                }}
              >
                {/* Left: Color Swatch + Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-4 h-4 rounded shrink-0 shadow-2xs flex items-center justify-center text-[8px] font-bold text-white"
                    style={{
                      backgroundColor: color,
                      border: `2px ${borderStyle} ${color}`,
                    }}
                    title={`Color index: ${owner.colorIndex}`}
                  >
                    {owner.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-ink truncate flex items-center gap-1">
                      <span>{getLocalizedOwnerName(owner.name, language)}</span>
                      {isIsolated && (
                        <span className="text-[9px] px-1 bg-ink text-surface rounded uppercase font-bold">
                          {language === "bn" ? "নির্দিষ্ট" : "Isolated"}
                        </span>
                      )}
                    </div>
                    {owner.fatherName && (
                      <div className="text-[10px] text-muted truncate">
                        {language === "bn"
                          ? `পিতা: ${getLocalizedFatherName(owner.fatherName, language)}`
                          : `s/o ${owner.fatherName}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Stats & Owner Page Link */}
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div className="font-bold text-ink tabular-nums">
                      {formatArea(owner.floodedAreaDecimal, unit, language)}
                    </div>
                    <div className="text-[10px] text-muted">
                      {formatNumberLocalized(owner.plotCount, language)} {language === "bn" ? "টি দাগ" : owner.plotCount !== 1 ? "plots" : "plot"}
                    </div>
                  </div>

                  {owner.mouzaId && owner.floodId && (
                    <Link
                      href={`/flood/${owner.mouzaId}/${owner.floodId}/owner/${owner.ownerId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded text-muted hover:text-ink hover:bg-slate-200 transition-colors"
                      title={language === "bn" ? "মালিকের জমির পাতা দেখুন" : "View owner plot dossier"}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Legend Note */}
      <div className="p-2.5 bg-[#F8FAFC] border-t border-border/70 text-[10px] text-muted flex items-center justify-between">
        <span>{language === "bn" ? "ধূসর দাগ: মালিকানাহীন / খাস জমি" : "Grey plots: Unowned / Khas"}</span>
        <span>{language === "bn" ? "ঢেউ দাগ: ১০০% নিমজ্জিত" : "Wave hatch: 100% Submerged"}</span>
      </div>
    </div>
  );
}
