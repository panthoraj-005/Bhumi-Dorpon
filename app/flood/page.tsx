"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CloudRain,
  ChevronRight,
  Calendar,
  Layers,
  ArrowRight,
  Droplets,
  Clock,
  Users,
  Waves,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { SelectorChain } from "@/components/SelectorChain";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { listFloods } from "@/lib/data";
import { FloodEvent } from "@/lib/types";
import { useSelection } from "@/lib/useSelection";
import { cn } from "@/lib/utils";
import {
  getLocalizedMouzaName,
  formatNumberLocalized,
  formatDateLocalized,
} from "@/lib/translations";

const DEFAULT_FLOOD_SELECTION = {
  d: "sylhet",
  u: "gowainghat",
  m: "mouza_gowainghat_2",
};

function FloodLandingExplorerContent() {
  const { unit, language } = useAppStore();

  // 1. Selector state in URL query (?d=&u=&m=)
  const {
    selection,
    d,
    u,
    m,
    setStep,
    resetToDefault,
  } = useSelection({
    hazard: "flood",
    mode: "recorded",
    defaultSelection: DEFAULT_FLOOD_SELECTION,
  });

  // Optional Year chip filter
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // 2. Load flood events for current selection via TanStack Query
  const {
    data: floods = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<FloodEvent[]>({
    queryKey: ["floodEventsList", { d, u, m, year: selectedYear }],
    queryFn: async () => {
      return listFloods({
        d: d || "",
        u: u || "",
        m: m || "",
        year: selectedYear === "all" ? "" : selectedYear,
      });
    },
    enabled: Boolean(d),
  });

  // Unique years for chips
  const availableYears = useMemo(() => {
    return ["all", "2025", "2024", "2023", "2022"];
  }, []);

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={
          language === "bn"
            ? "বন্যা পর্যবেক্ষণ ও প্লাবন ম্যাপিং"
            : "Flood Monitoring & Inundation Mapping"
        }
        subtitle={
          language === "bn"
            ? "স্যাটেলাইট সার (SAR) রাডার জলসীমা ম্যাপিং, সর্বোচ্চ প্লাবন বিস্তার এবং জমির সীমানা পুনর্গঠন"
            : "Satellite SAR radar water extent mapping, peak inundation footprints, and landowner plot boundary recovery"
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-1">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              {language === "bn" ? "নীড়পাতা" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {language === "bn" ? "বন্যা পর্যবেক্ষণ" : "Flood Monitoring"}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-pill bg-[#E3F2FD] text-water font-semibold text-xs inline-flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5" />
              <span>
                {language === "bn" ? "বহুবর্ষীয় সার (SAR) সংরক্ষণাগার" : "Multi-Year SAR Archive"}
              </span>
            </span>
          </div>
        </div>

        {/* 1. SELECTOR CHAIN (District > Upazila > Mouza) */}
        <div className="space-y-3">
          <SelectorChain
            hazard="flood"
            mode="recorded"
            selection={selection}
            onSelectStep={setStep}
            onReset={resetToDefault}
            language={language}
          />
        </div>

        {/* Optional Year Chips Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-secondary flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{language === "bn" ? "ঘটনাকালিন বছর অনুযায়ী ফিল্টার:" : "Filter by Event Year:"}</span>
            </span>
            <div className="flex items-center gap-1.5">
              {availableYears.map((yr) => {
                const isActive = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={cn(
                      "px-3 py-1 rounded-pill text-xs font-semibold transition-all",
                      isActive
                        ? "bg-water text-surface shadow-xs"
                        : "bg-surface border border-border text-secondary hover:text-ink hover:bg-surface-alt"
                    )}
                  >
                    {yr === "all" ? (language === "bn" ? "সকল বছর" : "All Years") : formatNumberLocalized(yr, language)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-muted">
            {language === "bn" ? (
              <>
                <span>মোট </span>
                <strong className="text-ink font-semibold tabular-nums">
                  {formatNumberLocalized(floods.length, language)}
                </strong>
                <span> টি রেকর্ডকৃত বন্যার ঘটনা প্রদর্শিত</span>
              </>
            ) : (
              <>
                <span>Showing </span>
                <strong className="text-ink font-semibold tabular-nums">{floods.length}</strong>
                <span> recorded flood event{floods.length === 1 ? "" : "s"}</span>
              </>
            )}
          </div>
        </div>

        {/* 2. FLOOD LIST SECTION */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bhumidorpon-card p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-24 rounded-pill" />
                  <Skeleton className="h-5 w-16 rounded-pill" />
                </div>
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bhumidorpon-card p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-loss-soft text-loss mx-auto flex items-center justify-center font-bold">
              !
            </div>
            <h3 className="font-semibold text-base text-ink">
              {language === "bn" ? "বন্যার তথ্য আনা যায়নি" : "Failed to load flood events"}
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {language === "bn"
                ? "বন্যার রেকর্ড আনার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
                : "An error occurred while loading flood records. Please retry."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-pill bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors"
            >
              {language === "bn" ? "পুনরায় চেষ্টা করুন" : "Try again"}
            </button>
          </div>
        ) : floods.length === 0 ? (
          /* Empty state */
          <div className="bhumidorpon-card p-12 text-center space-y-3 border-dashed">
            <div className="w-12 h-12 rounded-2xl bg-surface-alt text-muted mx-auto flex items-center justify-center">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-ink">
              {language === "bn" ? "এখানে কোনো বন্যার ঘটনা ঘটেনি" : "No flood has occurred here."}
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              {language === "bn"
                ? "নির্বাচিত ভৌগোলিক অবস্থান ও বছরে স্যাটেলাইট এসএআর (SAR) প্লাবনের কোনো তথ্য রেকর্ড করা হয়নি।"
                : "No satellite SAR flood inundation events have been recorded for the selected geographic location and year."}
            </p>
            <button
              type="button"
              onClick={resetToDefault}
              className="px-4 py-2 rounded-pill bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
            >
              {language === "bn" ? "পাইলট ক্লাস্টারে ফিরুন" : "Reset to Pilot Cluster"}
            </button>
          </div>
        ) : (
          /* One card per flood */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {floods.map((ev) => {
              const severityColor =
                ev.severity === "Catastrophic" || ev.severity === "Extreme"
                  ? "bg-loss-soft text-loss border-loss/20"
                  : ev.severity === "Severe"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200";

              const severityLabel =
                language === "bn"
                  ? ev.severity === "Catastrophic"
                    ? "বিপর্যয়কর"
                    : ev.severity === "Extreme"
                      ? "চরম"
                      : ev.severity === "Severe"
                        ? "মারাত্মক"
                        : "মাঝারি"
                  : ev.severity;

              return (
                <Link
                  key={ev.id}
                  href={`/flood/${ev.mouzaId}/${ev.id}`}
                  className="bhumidorpon-card p-6 flex flex-col justify-between gap-5 group hover:border-water/50 hover:shadow-card-hover transition-all relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Top Row: Date & Severity Chip */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                        <Calendar className="w-3.5 h-3.5 text-water" />
                        <span>{formatDateLocalized(ev.date, language)}</span>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-pill text-[11px] font-bold border",
                          severityColor
                        )}
                      >
                        {severityLabel}
                      </span>
                    </div>

                    {/* Card Title & Location */}
                    <div>
                      <h3 className="text-base font-bold text-ink group-hover:text-water transition-colors flex items-center justify-between">
                        <span>{getLocalizedMouzaName(ev.mouzaName || "", language) || (language === "bn" ? "মৌজা বন্যার ঘটনা" : "Mouza Flood Event")}</span>
                        <ArrowRight className="w-4 h-4 text-muted group-hover:text-water group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
                        {language === "bn"
                          ? `বছর ${formatNumberLocalized(ev.year, language)} • বর্ষাকালীন সর্বোচ্চ প্লাবন প্রবাহ`
                          : `Year ${ev.year} • Peak Monsoon Hydrological Surge`}
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface-alt border border-border/50">
                        <div className="text-[10px] text-muted flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-water" />
                          <span>{language === "bn" ? "প্লাবিত এলাকা" : "Flooded Area"}</span>
                        </div>
                        <div className="text-sm font-bold text-ink tabular-nums mt-0.5">
                          {formatArea(ev.floodedAreaDecimal, unit, language)}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-alt border border-border/50">
                        <div className="text-[10px] text-muted flex items-center gap-1">
                          <Waves className="w-3 h-3 text-water" />
                          <span>{language === "bn" ? "সর্বোচ্চ গভীরতা" : "Max Depth"}</span>
                        </div>
                        <div className="text-sm font-bold text-ink tabular-nums mt-0.5">
                          {formatNumberLocalized(ev.maxDepthM, language)} {language === "bn" ? "মিটার" : "m"}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-alt border border-border/50">
                        <div className="text-[10px] text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted" />
                          <span>{language === "bn" ? "স্থায়িত্ব" : "Duration"}</span>
                        </div>
                        <div className="text-sm font-bold text-ink tabular-nums mt-0.5">
                          {formatNumberLocalized(ev.durationDays, language)} {language === "bn" ? "দিন" : "Days"}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-alt border border-border/50">
                        <div className="text-[10px] text-muted flex items-center gap-1">
                          <Users className="w-3 h-3 text-loss" />
                          <span>{language === "bn" ? "ক্ষতিগ্রস্ত মালিক" : "Affected Owners"}</span>
                        </div>
                        <div className="text-sm font-bold text-ink tabular-nums mt-0.5">
                          {formatNumberLocalized(ev.affectedOwnersCount || ev.plotStatus?.length || 0, language)} {language === "bn" ? "জন" : "Owners"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-water group-hover:underline">
                    <span>{language === "bn" ? "প্লাবন ও মালিকদের তথ্য পর্যবেক্ষণ" : "Inspect Inundation & Owners"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FloodLandingExplorerPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
          <Skeleton className="w-48 h-8 mb-4" />
          <Skeleton className="w-96 h-64" />
        </div>
      }
    >
      <FloodLandingExplorerContent />
    </React.Suspense>
  );
}
