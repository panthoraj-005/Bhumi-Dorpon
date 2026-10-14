"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";
import { OwnerRecord } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea, formatCurrencyBDT } from "@/lib/units";
import { exportToCSV, cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

export type OwnerTableVariant = "recorded" | "forecast" | "flood";

interface OwnerTableProps {
  variant?: OwnerTableVariant;
  owners: OwnerRecord[];
  onSelectPlot?: (dagNo: string, coordinates?: [number, number]) => void;
  onSelectOwner?: (owner: OwnerRecord) => void;
  selectedPlotNo?: string | null;
  className?: string;
}

type SortField =
  | "name"
  | "dagNo"
  | "khatianNo"
  | "lossDecimal"
  | "estimatedCompensationBDT"
  | "compensationStatus"
  | "paidAmountBDT"
  | "depthClass";

export function OwnerTable({
  variant = "recorded",
  owners = [],
  onSelectPlot,
  onSelectOwner,
  selectedPlotNo,
  className,
}: OwnerTableProps) {
  const { unit } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("lossDecimal");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered and sorted owners
  const processedOwners = useMemo(() => {
    let list = [...owners];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          (o.dagNo && o.dagNo.toLowerCase().includes(q)) ||
          (o.plotNo && o.plotNo.toLowerCase().includes(q)) ||
          (o.khatianNo && o.khatianNo.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      let valA: any = a[sortField as keyof OwnerRecord] ?? (sortField === "dagNo" ? a.plotNo : "");
      let valB: any = b[sortField as keyof OwnerRecord] ?? (sortField === "dagNo" ? b.plotNo : "");

      if (typeof valA === "string") {
        return sortAsc
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA);
      }

      const numA = Number(valA || 0);
      const numB = Number(valB || 0);
      return sortAsc ? numA - numB : numB - numA;
    });

    return list;
  }, [owners, searchTerm, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numeric fields
    }
  };

  const handleExportCSV = () => {
    let exportData: Record<string, any>[] = [];

    if (variant === "recorded") {
      exportData = processedOwners.map((o) => ({
        "Owner Name": o.name,
        "Dag No.": o.dagNo || o.plotNo,
        "Khatian No.": o.khatianNo,
        [`Area Lost (${unit})`]: formatArea(o.lossDecimal, unit, { includeUnit: false }),
        [`Area Gained (${unit})`]: formatArea(o.gainDecimal, unit, { includeUnit: false }),
        "Est. Compensation (BDT)": o.estimatedCompensationBDT,
        "Status": o.compensationStatus || "pending",
        "Paid (BDT)": o.paidAmountBDT || 0,
        "Is State Land": o.isUnownedOrKhas ? "Yes" : "No",
      }));
    } else if (variant === "forecast") {
      exportData = processedOwners.map((o) => ({
        "Owner Name": o.name,
        "Dag No.": o.dagNo || o.plotNo,
        "Khatian No.": o.khatianNo,
        [`Projected Area (${unit})`]: formatArea(o.lossDecimal, unit, { includeUnit: false }),
        "Projected Compensation (BDT)": o.estimatedCompensationBDT,
        "Is State Land": o.isUnownedOrKhas ? "Yes" : "No",
      }));
    } else if (variant === "flood") {
      exportData = processedOwners.map((o) => ({
        "Owner Name": o.name,
        "Dag No.": o.dagNo || o.plotNo,
        "Khatian No.": o.khatianNo,
        [`Flooded Area (${unit})`]: formatArea(o.lossDecimal, unit, { includeUnit: false }),
        "Depth Class": o.depthClass || "moderate",
        "Is State Land": o.isUnownedOrKhas ? "Yes" : "No",
      }));
    }

    exportToCSV(`bhumidorpon_${variant}_records_${Date.now()}`, exportData);
  };

  const renderSortHeader = (label: string, field: SortField) => {
    const isActive = sortField === field;
    return (
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-ink transition-colors uppercase tracking-wider"
      >
        <span>{label}</span>
        {isActive ? (
          sortAsc ? (
            <ArrowUp className="w-3.5 h-3.5 text-ink" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-ink" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-muted/50" />
        )}
      </button>
    );
  };

  return (
    <div className={cn("bhumidorpon-card overflow-hidden", className)}>
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by owner name, Dag or Khatian no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-surface-alt border border-border rounded-input text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-all"
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-muted tabular-nums">
            Showing {processedOwners.length} of {owners.length} records
          </span>
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-pill border border-border bg-surface hover:bg-surface-alt text-ink text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-surface-alt/70 border-b border-border">
              {/* Col 1: Owner */}
              <th className="py-3 px-4">{renderSortHeader("Owner", "name")}</th>

              {/* Col 2: Dag No. (Rule 4) */}
              <th className="py-3 px-4">{renderSortHeader("Dag No.", "dagNo")}</th>

              {/* Col 3: Khatian No. (Rule 4) */}
              <th className="py-3 px-4">{renderSortHeader("Khatian No.", "khatianNo")}</th>

              {/* Variant-specific columns */}
              {variant === "recorded" && (
                <>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(`Area (Lost/Gained) (${unit})`, "lossDecimal")}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader("Est. compensation (৳)", "estimatedCompensationBDT")}
                  </th>
                  <th className="py-3 px-4">{renderSortHeader("Status", "compensationStatus")}</th>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader("Paid (৳)", "paidAmountBDT")}
                  </th>
                </>
              )}

              {variant === "forecast" && (
                <>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(`Projected area (${unit})`, "lossDecimal")}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader("Projected compensation (৳)", "estimatedCompensationBDT")}
                  </th>
                </>
              )}

              {variant === "flood" && (
                <>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(`Flooded area (${unit})`, "lossDecimal")}
                  </th>
                  <th className="py-3 px-4">{renderSortHeader("Depth class", "depthClass")}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {processedOwners.length > 0 ? (
              processedOwners.map((owner) => {
                const currentDag = owner.dagNo || owner.plotNo;
                const isSelected = selectedPlotNo === currentDag;
                const isKhas = owner.isUnownedOrKhas;

                return (
                  <tr
                    key={owner.id}
                    onClick={() => {
                      onSelectPlot?.(currentDag, owner.coordinates);
                      if (onSelectOwner) onSelectOwner(owner);
                    }}
                    className={cn(
                      "transition-colors cursor-pointer group",
                      isSelected
                        ? "bg-accent-soft/70 ring-1 ring-inset ring-accent-deep"
                        : isKhas
                        ? "bg-[#FAFBF7] border-l-4 border-l-[#7B8274]"
                        : "hover:bg-surface-alt/50"
                    )}
                  >
                    {/* 1. Owner */}
                    <td className="py-3.5 px-4">
                      {isKhas ? (
                        <div className="flex items-center gap-1.5 text-muted italic">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="font-medium text-ink-2">{owner.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-dashed border-border uppercase font-mono not-italic text-secondary">
                            Unowned
                          </span>
                        </div>
                      ) : variant === "flood" ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectOwner) onSelectOwner(owner);
                            onSelectPlot?.(currentDag, owner.coordinates);
                          }}
                          className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-accent-deep underline decoration-border hover:decoration-accent-deep transition-colors"
                        >
                          <span>{owner.name}</span>
                          <ExternalLink className="w-3 h-3 text-muted" />
                        </button>
                      ) : (
                        <span className="font-medium text-ink">{owner.name}</span>
                      )}
                    </td>

                    {/* 2. Dag No. (Rule 4) */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-ink whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted group-hover:text-ink" />
                        <span>{currentDag}</span>
                      </div>
                    </td>

                    {/* 3. Khatian No. (Rule 4) */}
                    <td className="py-3.5 px-4 font-mono text-muted whitespace-nowrap">
                      {owner.khatianNo}
                    </td>

                    {/* Variant === "recorded" columns */}
                    {variant === "recorded" && (
                      <>
                        <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                          {owner.changeKind === "loss" ? (
                            <span className="inline-flex items-center gap-1 text-[#E4604A] font-semibold bg-[#FBE5E0]/70 px-2 py-0.5 rounded-pill text-xs">
                              -{formatArea(owner.lossDecimal, unit)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#2F9E62] font-semibold bg-[#DFF3E8]/70 px-2 py-0.5 rounded-pill text-xs">
                              +{formatArea(owner.gainDecimal, unit)}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-ink tabular-nums whitespace-nowrap">
                          {formatCurrencyBDT(owner.estimatedCompensationBDT)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={owner.compensationStatus || "pending"} />
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-secondary tabular-nums whitespace-nowrap">
                          {formatCurrencyBDT(owner.paidAmountBDT || 0)}
                        </td>
                      </>
                    )}

                    {/* Variant === "forecast" columns (Rule 5: NO Status, NO Paid) */}
                    {variant === "forecast" && (
                      <>
                        <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-predicted font-semibold bg-predicted-soft px-2 py-0.5 rounded-pill text-xs">
                            {formatArea(owner.lossDecimal, unit)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-ink tabular-nums whitespace-nowrap">
                          {formatCurrencyBDT(owner.estimatedCompensationBDT)}
                        </td>
                      </>
                    )}

                    {/* Variant === "flood" columns */}
                    {variant === "flood" && (
                      <>
                        <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-pill text-xs">
                            {formatArea(owner.lossDecimal, unit)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <FloodDepthBadge depthClass={owner.depthClass} />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={variant === "recorded" ? 7 : 5}
                  className="py-12 px-4 text-center text-muted"
                >
                  <p className="text-sm font-medium">No land records found</p>
                  <p className="text-xs text-muted/70 mt-1">
                    Try adjusting your search query or selecting a different location.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FloodDepthBadge({ depthClass }: { depthClass?: string }) {
  const norm = (depthClass || "moderate").toLowerCase();

  if (norm === "deep") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
        Deep (&gt;1.5m)
      </span>
    );
  }
  if (norm === "shallow") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
        Shallow (&lt;0.5m)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
      Moderate (0.5–1.5m)
    </span>
  );
}
