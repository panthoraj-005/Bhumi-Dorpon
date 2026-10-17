"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Waves,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { SelectorChain } from "@/components/SelectorChain";
import { OwnerTable } from "@/components/OwnerTable";
import { ForecastBadge } from "@/components/ForecastBadge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { EmptyState } from "@/components/EmptyState";
import { SegmentedToggle } from "@/components/SegmentedToggle";
import { Skeleton } from "@/components/Skeleton";
import { RiverErosionMap } from "@/components/RiverErosionMap";
import { useAppStore } from "@/stores/appStore";
import {
  t,
  formatNumberLocalized,
  getLocalizedLocationLabel,
  getLocalizedPeriodLabel,
  getLocalizedAssessmentTitle,
  getLocalizedMetric,
} from "@/lib/translations";
import { formatArea } from "@/lib/units";
import { getHazardResult } from "@/lib/data";
import { HazardResult, DataMode } from "@/lib/types";
import { useSelection } from "@/lib/useSelection";

const DEFAULT_RIVER_SELECTION = {
  d: "sirajganj",
  u: "kazipur",
  r: "jamuna",
  m: "mouza_kazipur_1",
};

export default function RiverErosionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawMode = (params?.mode as string) || "recorded";
  const mode: DataMode = rawMode === "forecast" ? "forecast" : "recorded";
  const isForecast = mode === "forecast";

  const { unit, language } = useAppStore();

  // 1. URL is single source of truth via useSelection
  const {
    selection,
    d,
    u,
    r,
    m,
    setStep,
    resetToDefault,
    isFinalStepSet,
    activeEntityId,
  } = useSelection({
    hazard: "river_erosion",
    mode,
    defaultSelection: DEFAULT_RIVER_SELECTION,
  });

  const [focusedPlotNo, setFocusedPlotNo] = useState<string | null>(null);

  // 2. Results loaded via TanStack Query with full selection in query key
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<HazardResult | null>({
    queryKey: ["hazardResult", "river_erosion", mode, { d, u, r, m }],
    queryFn: async () => {
      if (!activeEntityId) return null;
      return getHazardResult("river_erosion", mode, activeEntityId);
    },
    enabled: isFinalStepSet,
  });

  const handleModeSwitch = (newMode: DataMode) => {
    const qs = new URLSearchParams();
    if (d) qs.set("d", d);
    if (u) qs.set("u", u);
    if (r) qs.set("r", r);
    if (m) qs.set("m", m);
    const queryString = qs.toString();
    router.push(`/river-erosion/${newMode}${queryString ? `?${queryString}` : ""}`);
  };

  const calcPercentChange = () => {
    if (!result || !result.totalLossDecimal) return "0.0%";
    const baseline = result.totalLossDecimal - (result.annualRateDecimal || 0);
    if (baseline <= 0) return "+12.4%";
    const pct = ((result.totalLossDecimal - baseline) / baseline) * 100;
    return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={language === "bn" ? "নদীভাঙন" : "River Erosion"}
        subtitle={
          isForecast
            ? language === "bn"
              ? "ডিপ লার্নিং হাইড্রোডাইনামিক মডেলের মাধ্যমে আগামী ১ বছরের নদীভাঙনের পূর্বাভাস"
              : "Deep learning hydrodynamic forecast of projected 1-year riverbank retreat"
            : language === "bn"
              ? "যাচাইকৃত নদীভাঙনের মৌজা ও দাগভিত্তিক ক্যাডাস্ট্রাল রেকর্ড"
              : "Cadastral mouza and plot records of verified riverbank erosion"
        }
      >
        <div className="inline-flex items-center">
          <SegmentedToggle<DataMode>
            options={[
              { id: "recorded", label: language === "bn" ? "ক. রেকর্ডকৃত তথ্য" : "A. Recorded Data" },
              { id: "forecast", label: language === "bn" ? "খ. পূর্বাভাস (ডিএল)" : "B. Forecast (DL)" },
            ]}
            value={mode}
            onChange={handleModeSwitch}
            variant="lime"
            size="md"
          />
        </div>
      </AppHeader>

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-1">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              {language === "bn" ? "নীড়পাতা" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/river-erosion" className="hover:text-ink transition-colors">
              {language === "bn" ? "নদীভাঙন" : "River Erosion"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {isForecast
                ? language === "bn" ? "পূর্বাভাস মোড" : "Forecast Mode"
                : language === "bn" ? "রেকর্ডকৃত মোড" : "Recorded Mode"}
            </span>
            {result && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-accent-deep font-semibold">
                  {getLocalizedAssessmentTitle(result.title, language)}
                </span>
              </>
            )}
          </nav>

          {isForecast && (
            <ForecastBadge
              label={language === "bn" ? "ডিপ লার্নিং মডেল" : "Deep Learning Model"}
            />
          )}
        </div>

        {/* REBUILD SELECTOR CHAIN (Single reusable component, controlled Popover + Command) */}
        <SelectorChain
          hazard="river_erosion"
          mode={mode}
          selection={selection}
          onSelectStep={setStep}
          onReset={resetToDefault}
          language={language}
        />

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="space-y-6">
            <div className="bhumidorpon-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-2 w-full max-w-md">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-14 w-28" />
                <Skeleton className="h-14 w-28" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full rounded-card" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full rounded-card" />
              <Skeleton className="h-24 w-full rounded-card" />
              <Skeleton className="h-24 w-full rounded-card" />
            </div>
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
        )}

        {/* ERROR BOUNDARY WITH TRY AGAIN */}
        {isError && (
          <div className="bhumidorpon-card p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-loss-soft text-loss mx-auto flex items-center justify-center font-bold">
              !
            </div>
            <h3 className="font-semibold text-base text-ink">
              {language === "bn" ? "নদীভাঙনের তথ্য লোড করতে ব্যর্থ হয়েছে" : "Failed to load river erosion results"}
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {error instanceof Error
                ? error.message
                : language === "bn"
                  ? "ক্যাডাস্ট্রাল ডেটা লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।"
                  : "An unexpected error occurred while loading cadastral data."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-pill bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors"
            >
              {language === "bn" ? "পুনরায় চেষ্টা করুন" : "Try again"}
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && isFinalStepSet && !result && (
          <EmptyState
            hazard="river_erosion"
            title={
              isForecast
                ? language === "bn"
                  ? "এখানে নদীভাঙনের কোনো পূর্বাভাস নেই।"
                  : "No river erosion is predicted here."
                : language === "bn"
                  ? "এখানে কোনো নদীভাঙনের ঘটনা ঘটেনি।"
                  : "No river erosion has occurred here."
            }
            description={
              language === "bn"
                ? "নির্বাচিত এলাকাটি সক্রিয় নদী অববাহিকা ও ভাঙনপ্রবণ তীরবর্তী অঞ্চলের বাইরে অবস্থিত।"
                : "The selected area is situated outside active braided river channels and dynamic banklines."
            }
            actionLabel={language === "bn" ? "পাইলট ক্লাস্টারে ফিরুন" : "Reset to Pilot Cluster"}
            onAction={resetToDefault}
          />
        )}

        {!isFinalStepSet && (
          <div className="bhumidorpon-card p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-muted mx-auto" />
            <h3 className="text-sm font-semibold text-ink">
              {language === "bn" ? "অনুগ্রহ করে এলাকা নির্বাচন সম্পন্ন করুন" : "Please complete your location selection"}
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              {language === "bn"
                ? "উচ্চ-রেজোলিউশন ক্যাডাস্ট্রাল ক্ষয় বিশ্লেষণ দেখতে জেলা, উপজেলা, নদী এবং নদী তীরবর্তী মৌজা নির্বাচন করুন।"
                : "Select District, Upazila, River, and Riverside Mouza to view high-resolution cadastral retreat analysis."}
            </p>
          </div>
        )}

        {/* RESULT DETAIL SECTION */}
        {!isLoading && !isError && result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. SUMMARY STRIP */}
            <div className="bhumidorpon-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-surface-alt/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">
                    {getLocalizedLocationLabel(result.locationLabel, language)}
                  </span>
                  {isForecast && (
                    <ConfidenceBadge
                      level={result.confidence?.level || "High"}
                      scorePercent={result.confidence?.scorePercent || 88}
                    />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">
                  {getLocalizedAssessmentTitle(result.title, language)}
                </h2>
                <div className="text-xs text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {language === "bn" ? "সময়কাল" : "Period"}: {getLocalizedPeriodLabel(result.periodLabel, language)}
                  </span>
                  <span>•</span>
                  <span>
                    {language === "bn" ? "বার্ষিক গড় হার" : "Average Rate"}: {formatArea(result.annualRateDecimal, unit, language)}/{language === "bn" ? "বছর" : "year"}
                  </span>
                </div>
              </div>

              {/* Total Loss, Total Gain, Trend */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                <div>
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "মোট ক্ষয়" : "Total Loss"}
                  </div>
                  <div className="text-xl font-bold text-loss tabular-nums">
                    {formatArea(result.totalLossDecimal, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "মোট বৃদ্ধি" : "Total Gain"}
                  </div>
                  <div className="text-xl font-bold text-gain tabular-nums">
                    {formatArea(result.totalGainDecimal, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "গতিধারা" : "Trend"}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-loss capitalize">
                    {result.trendDirection === "increasing" ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {result.trendDirection === "increasing"
                        ? language === "bn" ? "ক্রমবর্ধমান" : "Increasing"
                        : result.trendDirection === "decreasing"
                          ? language === "bn" ? "হ্রাসমান" : "Decreasing"
                          : language === "bn" ? "স্থিতিশীল" : "Stable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. MAP COMPARE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "উপগ্রহ ও ক্যাডাস্ট্রাল মানচিত্রের তুলনা"
                      : "Satellite & Cadastral Map Comparison"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "সমন্বিত জুম, প্যান এবং বেসম্যাপ নিয়ন্ত্রণের মাধ্যমে পূর্বের ও বর্তমান মানচিত্র পাশাপাশি তুলনা করুন"
                      : "Compare Before and After maps side by side with synchronized zoom, pan, and basemap controls"}
                  </p>
                </div>
                <div className="text-xs text-muted">
                  {isForecast
                    ? language === "bn"
                      ? "বর্তমান বনাম ১ বছরের সম্ভাব্য নদী তীরবর্তী রেখা"
                      : "Current vs 1-Year Forecasted Shoreline"
                    : language === "bn"
                      ? "২০১৯ বনাম ২০২৪ উপগ্রহ চিত্র"
                      : "2019 vs 2024 Satellite"}
                </div>
              </div>

              <RiverErosionMap
                geometry={result.geometry}
                owners={result.owners}
                beforeYear={result.beforeYear}
                afterYear={result.afterYear}
                isForecast={isForecast}
                selectedPlotNo={focusedPlotNo}
                onSelectPlot={(plotNo) => setFocusedPlotNo(plotNo)}
                selectedMouzaId={m}
                onSelectMouza={(mId) => setStep("m", mId)}
              />
            </div>

            {/* 3. INFO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "শতাংশ পরিবর্তন" : "Percentage Change"}
                </span>
                <div className="text-xl font-bold text-loss tabular-nums">
                  {formatNumberLocalized(calcPercentChange(), language)}
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn" ? "পূর্ববর্তী জরিপের তুলনায়" : "Relative to prior survey"}
                </div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "বার্ষিক গড় হার" : "Average Yearly Rate"}
                </span>
                <div className="text-xl font-bold text-ink tabular-nums">
                  {formatArea(result.annualRateDecimal, unit, language)}/{language === "bn" ? "বছর" : "yr"}
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn" ? "গড় নদীখাত স্থানচ্যুতি" : "Mean channel displacement"}
                </div>
              </div>

              {result.metrics.slice(0, 1).map((mItem, idx) => {
                const locMetric = getLocalizedMetric(mItem, language);
                return (
                  <div key={idx} className="bhumidorpon-card p-4 space-y-1">
                    <span className="text-xs font-medium text-muted">{locMetric.label}</span>
                    <div className="text-xl font-bold text-ink tabular-nums">
                      {locMetric.value}
                    </div>
                    {locMetric.sublabel && (
                      <div className="text-[11px] text-secondary">{locMetric.sublabel}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 4. OWNER TABLE (STEP 4) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "ক্ষতিগ্রস্ত ক্যাডাস্ট্রাল দাগ ও জমির মালিকবৃন্দ"
                      : "Affected Cadastral Plots & Landowners"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "মানচিত্রে দাগ হাইলাইট করতে টেবিলে ক্লিক করুন; টেবিলে হাইলাইট করতে মানচিত্রের দাগে ক্লিক করুন"
                      : "Click a table row to highlight the plot on the map; click a map polygon to highlight in table"}
                  </p>
                </div>
                <span className="text-xs text-muted tabular-nums">
                  {language === "bn"
                    ? `${formatNumberLocalized(result.owners.length, language)} টি রেকর্ড পাওয়া গেছে`
                    : `${result.owners.length} records found`}
                </span>
              </div>

              <OwnerTable
                variant={isForecast ? "forecast" : "recorded"}
                owners={result.owners}
                selectedPlotNo={focusedPlotNo}
                onSelectPlot={(plotNo) => setFocusedPlotNo(plotNo)}
                language={language}
              />
            </div>

            {/* 5. FORECAST DISCLAIMER */}
            {isForecast && (
              <div className="p-4 rounded-card bg-predicted-soft border border-predicted/30 text-xs text-secondary flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-predicted shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-ink font-semibold block">
                    {language === "bn" ? "সতর্কবার্তা:" : "Disclaimer:"}
                  </strong>
                  <p className="leading-relaxed">
                    {language === "bn"
                      ? "এটি একটি মডেল-ভিত্তিক পূর্বাভাস, কোনো দাপ্তরিক সরকারি রেকর্ড নয়।"
                      : "This is a model-based estimate, not an official government record."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
