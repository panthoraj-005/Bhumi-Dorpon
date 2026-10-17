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
import { formatNumberLocalized, t, getLocalizedOwnerName, getLocalizedCompensationStatus } from "@/lib/translations";

export type OwnerTableVariant = "recorded" | "forecast" | "flood";

interface OwnerTableProps {
  variant?: OwnerTableVariant;
  owners: OwnerRecord[];
  onSelectPlot?: (dagNo: string, coordinates?: [number, number]) => void;
  onSelectOwner?: (owner: OwnerRecord) => void;
  selectedPlotNo?: string | null;
  className?: string;
  language?: import("@/lib/translations").Language;
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
  language: propLanguage,
}: OwnerTableProps) {
  const storeLanguage = useAppStore().language;
  const language = propLanguage || storeLanguage;
  const { unit } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("lossDecimal");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered and sorted owners
  const processedOwners = useMemo(() => {
    let list = [...owners];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((o) => {
        const localizedName = getLocalizedOwnerName(o.name, "bn").toLowerCase();
        return (
          o.name.toLowerCase().includes(q) ||
          localizedName.includes(q) ||
          (o.dagNo && o.dagNo.toLowerCase().includes(q)) ||
          (o.plotNo && o.plotNo.toLowerCase().includes(q)) ||
          (o.khatianNo && o.khatianNo.toLowerCase().includes(q))
        );
      });
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
        [language === "bn" ? "মালিকের নাম" : "Owner Name"]:
          language === "bn" ? getLocalizedOwnerName(o.name, language) : o.name,
        [language === "bn" ? "দাগ নং" : "Dag No."]: o.dagNo || o.plotNo,
        [language === "bn" ? "খতিয়ান নং" : "Khatian No."]: o.khatianNo,
        [language === "bn" ? `ক্ষতিগ্রস্ত এলাকা (${unit})` : `Area Lost (${unit})`]: formatArea(o.lossDecimal, unit, { includeUnit: false, language }),
        [language === "bn" ? `পয়স্তি এলাকা (${unit})` : `Area Gained (${unit})`]: formatArea(o.gainDecimal, unit, { includeUnit: false, language }),
        [language === "bn" ? "প্রাক্কলিত ক্ষতিপূরণ (৳)" : "Est. Compensation (BDT)"]: o.estimatedCompensationBDT,
        [language === "bn" ? "অবস্থা" : "Status"]: language === "bn" ? getLocalizedCompensationStatus(o.compensationStatus || "pending", language) : o.compensationStatus || "pending",
        [language === "bn" ? "পরিশোধিত (৳)" : "Paid (BDT)"]: o.paidAmountBDT || 0,
        [language === "bn" ? "সরকারি জমি" : "Is State Land"]: o.isUnownedOrKhas ? (language === "bn" ? "হ্যাঁ" : "Yes") : (language === "bn" ? "না" : "No"),
      }));
    } else if (variant === "forecast") {
      exportData = processedOwners.map((o) => ({
        [language === "bn" ? "মালিকের নাম" : "Owner Name"]:
          language === "bn" ? getLocalizedOwnerName(o.name, language) : o.name,
        [language === "bn" ? "দাগ নং" : "Dag No."]: o.dagNo || o.plotNo,
        [language === "bn" ? "খতিয়ান নং" : "Khatian No."]: o.khatianNo,
        [language === "bn" ? `প্রত্যাশিত এলাকা (${unit})` : `Projected Area (${unit})`]: formatArea(o.lossDecimal, unit, { includeUnit: false, language }),
        [language === "bn" ? "প্রত্যাশিত ক্ষতিপূরণ (৳)" : "Projected Compensation (BDT)"]: o.estimatedCompensationBDT,
        [language === "bn" ? "সরকারি জমি" : "Is State Land"]: o.isUnownedOrKhas ? (language === "bn" ? "হ্যাঁ" : "Yes") : (language === "bn" ? "না" : "No"),
      }));
    } else if (variant === "flood") {
      exportData = processedOwners.map((o) => ({
        [language === "bn" ? "মালিকের নাম" : "Owner Name"]:
          language === "bn" ? getLocalizedOwnerName(o.name, language) : o.name,
        [language === "bn" ? "দাগ নং" : "Dag No."]: o.dagNo || o.plotNo,
        [language === "bn" ? "খতিয়ান নং" : "Khatian No."]: o.khatianNo,
        [language === "bn" ? `প্লাবিত এলাকা (${unit})` : `Flooded Area (${unit})`]: formatArea(o.lossDecimal, unit, { includeUnit: false, language }),
        [language === "bn" ? "প্লাবনের গভীরতা" : "Depth Class"]: o.depthClass || "moderate",
        [language === "bn" ? "সরকারি জমি" : "Is State Land"]: o.isUnownedOrKhas ? (language === "bn" ? "হ্যাঁ" : "Yes") : (language === "bn" ? "না" : "No"),
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

  const unitLabel = t(
    unit === "decimal" ? "unitDecimal" : unit === "acre" ? "unitAcre" : "unitHectare",
    language
  );

  return (
    <div className={cn("bhumidorpon-card overflow-hidden", className)}>
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "মালিকের নাম, দাগ বা খতিয়ান নম্বর দিয়ে খুঁজুন..."
                : "Search by owner name, Dag or Khatian no..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm bg-surface-alt border border-border rounded-input text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-all"
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-muted tabular-nums">
            {language === "bn"
              ? `মোট ${formatNumberLocalized(owners.length, language)} টির মধ্যে ${formatNumberLocalized(processedOwners.length, language)} টি রেকর্ড দেখানো হচ্ছে`
              : `Showing ${processedOwners.length} of ${owners.length} records`}
          </span>
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-3.5 rounded-pill border border-border bg-surface hover:bg-surface-alt text-ink text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span>{t("exportCsv", language)}</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-surface-alt/70 border-b border-border">
              {/* Col 1: Owner */}
              <th className="py-3 px-4">
                {renderSortHeader(language === "bn" ? "মালিকের নাম" : "Owner", "name")}
              </th>

              {/* Col 2: Dag No. */}
              <th className="py-3 px-4">
                {renderSortHeader(language === "bn" ? "দাগ নং" : "Dag No.", "dagNo")}
              </th>

              {/* Col 3: Khatian No. */}
              <th className="py-3 px-4">
                {renderSortHeader(language === "bn" ? "খতিয়ান নং" : "Khatian No.", "khatianNo")}
              </th>

              {/* Variant-specific columns */}
              {variant === "recorded" && (
                <>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(
                      language === "bn"
                        ? `ক্ষতিগ্রস্ত/পয়স্তি (${unitLabel})`
                        : `Area (Lost/Gained) (${unit})`,
                      "lossDecimal"
                    )}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(
                      language === "bn" ? "প্রাক্কলিত ক্ষতিপূরণ (৳)" : "Est. compensation (৳)",
                      "estimatedCompensationBDT"
                    )}
                  </th>
                  <th className="py-3 px-4">
                    {renderSortHeader(language === "bn" ? "অবস্থা" : "Status", "compensationStatus")}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(language === "bn" ? "পরিশোধিত (৳)" : "Paid (৳)", "paidAmountBDT")}
                  </th>
                </>
              )}

              {variant === "forecast" && (
                <>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(
                      language === "bn" ? `প্রত্যাশিত এলাকা (${unitLabel})` : `Projected area (${unit})`,
                      "lossDecimal"
                    )}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(
                      language === "bn" ? "প্রত্যাশিত ক্ষতিপূরণ (৳)" : "Projected compensation (৳)",
                      "estimatedCompensationBDT"
                    )}
                  </th>
                </>
              )}

              {variant === "flood" && (
                <>
                  <th className="py-3 px-4 text-right">
                    {renderSortHeader(
                      language === "bn" ? `প্লাবিত এলাকা (${unitLabel})` : `Flooded area (${unit})`,
                      "lossDecimal"
                    )}
                  </th>
                  <th className="py-3 px-4">
                    {renderSortHeader(language === "bn" ? "প্লাবনের গভীরতা" : "Depth class", "depthClass")}
                  </th>
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
                const displayName = getLocalizedOwnerName(owner.name, language);

                return (
                  <tr
                    key={owner.id}
                    onClick={() => {
                      onSelectPlot?.(currentDag, owner.coordinates);
                      if (onSelectOwner) onSelectOwner(owner);
                    }}
                    className={cn(
                      "hover:bg-surface-alt/60 cursor-pointer transition-colors",
                      isSelected && "bg-accent/15 border-l-4 border-l-ink font-medium"
                    )}
                  >
                    {/* Owner column */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-ink flex items-center gap-1.5">
                          {isKhas ? (
                            <>
                              <Building2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                              <span>{displayName}</span>
                            </>
                          ) : (
                            <span>{displayName}</span>
                          )}
                        </span>
                        {isKhas && (
                          <span className="text-[10px] text-muted">
                            {language === "bn" ? "খাস / সরকারি জমি" : "State Khas Land"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Dag No. */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-ink">
                      {formatNumberLocalized(currentDag, language)}
                    </td>

                    {/* Khatian No. */}
                    <td className="py-3.5 px-4 font-mono text-xs text-muted">
                      {formatNumberLocalized(owner.khatianNo, language)}
                    </td>

                    {/* Variant Columns */}
                    {variant === "recorded" && (
                      <>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <div className="flex flex-col items-end">
                            {owner.lossDecimal > 0 && (
                              <span className="text-loss font-semibold">
                                -{formatArea(owner.lossDecimal, unit, language)}
                              </span>
                            )}
                            {owner.gainDecimal && owner.gainDecimal > 0 && (
                              <span className="text-gain font-semibold">
                                +{formatArea(owner.gainDecimal, unit, language)}
                              </span>
                            )}
                            {!owner.lossDecimal && !owner.gainDecimal && (
                              <span className="text-muted">{language === "bn" ? "০.০" : "0.0"}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-ink">
                          {isKhas
                            ? language === "bn" ? "প্রযোজ্য নয়" : "N/A"
                            : formatCurrencyBDT(owner.estimatedCompensationBDT, { compact: true, language })}
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge
                            status={isKhas ? "not_applicable" : owner.compensationStatus || "pending"}
                          />
                        </td>

                        <td className="py-3.5 px-4 text-right tabular-nums font-medium text-muted">
                          {isKhas || !owner.paidAmountBDT
                            ? "—"
                            : formatCurrencyBDT(owner.paidAmountBDT, { compact: true, language })}
                        </td>
                      </>
                    )}

                    {variant === "forecast" && (
                      <>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <span className="text-predicted font-semibold">
                            {formatArea(owner.lossDecimal, unit, language)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-ink">
                          {isKhas
                            ? language === "bn" ? "প্রযোজ্য নয়" : "N/A"
                            : formatCurrencyBDT(owner.estimatedCompensationBDT, { compact: true, language })}
                        </td>
                      </>
                    )}

                    {variant === "flood" && (
                      <>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <span className="text-water font-semibold">
                            {formatArea(owner.lossDecimal, unit, language)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <FloodDepthBadge depthClass={owner.depthClass} language={language} />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={variant === "recorded" ? 7 : variant === "flood" ? 5 : 5}
                  className="py-12 px-4 text-center text-muted"
                >
                  <p className="text-sm font-medium">
                    {language === "bn" ? "কোনো ভূমির রেকর্ড পাওয়া যায়নি" : "No land records found"}
                  </p>
                  <p className="text-xs text-muted/70 mt-1">
                    {language === "bn"
                      ? "দাগ বা খতিয়ান নম্বর পরিবর্তন করে আবার চেষ্টা করুন অথবা অন্য এলাকা বেছে নিন।"
                      : "Try adjusting your search query or selecting a different location."}
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

function FloodDepthBadge({
  depthClass,
  language = "bn",
}: {
  depthClass?: string;
  language?: "bn" | "en";
}) {
  const norm = (depthClass || "moderate").toLowerCase();

  if (norm === "deep") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
        {language === "bn" ? "গভীর (>১.৫ মি.)" : "Deep (>1.5m)"}
      </span>
    );
  }
  if (norm === "shallow") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
        {language === "bn" ? "অগভীর (<০.৫ মি.)" : "Shallow (<0.5m)"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-pill text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
      {language === "bn" ? "মাঝারি (০.৫–১.৫ মি.)" : "Moderate (0.5–1.5m)"}
    </span>
  );
}
