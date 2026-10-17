"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Anchor,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
  Building2,
  Layers,
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
import { CoastalMap } from "@/components/CoastalMap";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import {
  formatNumberLocalized,
  getLocalizedLocationLabel,
  getLocalizedPeriodLabel,
  getLocalizedAssessmentTitle,
} from "@/lib/translations";
import { getHazardResult } from "@/lib/data";
import { HazardResult, DataMode } from "@/lib/types";
import { useSelection } from "@/lib/useSelection";

const DEFAULT_COASTAL_SELECTION = {
  d: "bhola",
  u: "char_fasson",
  m: "mouza_char_fasson_1",
};

export default function CoastalDetailPage() {
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
    m,
    setStep,
    resetToDefault,
    isFinalStepSet,
    activeEntityId,
  } = useSelection({
    hazard: "coastal",
    mode,
    defaultSelection: DEFAULT_COASTAL_SELECTION,
  });

  const [focusedPlotNo, setFocusedPlotNo] = useState<string | null>(null);

  // 2. Load Results via TanStack Query with full selection in query key
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<HazardResult | null>({
    queryKey: ["hazardResult", "coastal", mode, { d, u, m }],
    queryFn: async () => {
      if (!activeEntityId) return null;
      return getHazardResult("coastal", mode, activeEntityId);
    },
    enabled: isFinalStepSet,
  });

  const handleModeSwitch = (newMode: DataMode) => {
    const qs = new URLSearchParams();
    if (d) qs.set("d", d);
    if (u) qs.set("u", u);
    if (m) qs.set("m", m);
    const queryString = qs.toString();
    router.push(`/coastal/${newMode}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={
          language === "bn"
            ? "উপকূলীয় রেখার পরিবর্তন ও কাদাচর"
            : "Coastal Shoreline Shifts & Mudflats"
        }
        subtitle={
          isForecast
            ? language === "bn"
              ? "ডিপ লার্নিং মোহনা উপকূল রেখা পশ্চাদপসরণ ও পলি বৃদ্ধি প্রক্ষেপণ এবং ভার্চুয়াল ক্যাডাস্ট্রাল ব্লক"
              : "Deep learning estuarine shoreline retreat & accretion forecasting with virtual cadastral blocks"
            : language === "bn"
            ? "বঙ্গোপসাগরের জোয়ারভাটা উপকূলীয় রেখা পরিবর্তন, ম্যানগ্রোভ বাফার এলাকা এবং উপকূলীয় কাদাচর গঠন"
            : "Bay of Bengal tidal shoreline migration, mangrove buffer strips, and intertidal mudflat formation"
        }
      >
        <div className="inline-flex items-center">
          <SegmentedToggle<DataMode>
            options={[
              {
                id: "recorded",
                label: language === "bn" ? "ক. রেকর্ডকৃত তথ্য" : "A. Recorded Data",
              },
              {
                id: "forecast",
                label: language === "bn" ? "খ. পূর্বাভাস (DL)" : "B. Forecast (DL)",
              },
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
              {language === "bn" ? "নীড়" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/coastal" className="hover:text-ink transition-colors">
              {language === "bn" ? "উপকূলীয়" : "Coastal"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {isForecast
                ? language === "bn"
                  ? "পূর্বাভাস মোড"
                  : "Forecast Mode"
                : language === "bn"
                ? "রেকর্ডকৃত মোড"
                : "Recorded Mode"}
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
              label={
                language === "bn"
                  ? "ডেল্টা এআই উপকূল রেখা মডেল"
                  : "Delta AI Shoreline Model"
              }
            />
          )}
        </div>

        {/* SELECTOR CHAIN (STEP 3) */}
        <SelectorChain
          hazard="coastal"
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
              {language === "bn"
                ? "উপকূলীয় রেখার তথ্য লোড করতে ব্যর্থ হয়েছে"
                : "Failed to load coastal shoreline data"}
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {error instanceof Error
                ? error.message
                : language === "bn"
                ? "উপকূলীয় গতিশীলতার তথ্য লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।"
                : "An unexpected error occurred while loading coastal dynamics data."}
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
            hazard="coastal"
            title={
              language === "bn"
                ? "কোনো উপকূলীয় তথ্য পাওয়া যায়নি।"
                : "No coastal records found."
            }
            description={
              language === "bn"
                ? "নির্বাচিত জেলা বা উপজেলায় বঙ্গোপসাগর বরাবর কোনো সামুদ্রিক উপকূলরেখা বা জোয়ারভাটার মোহনা এলাকা নেই।"
                : "The selected district or upazila has no marine coastline or tidal estuarine frontage along the Bay of Bengal."
            }
            actionLabel={
              language === "bn" ? "পাইলট ক্লাস্টারে ফিরে যান" : "Reset to Pilot Cluster"
            }
            onAction={resetToDefault}
          />
        )}

        {!isFinalStepSet && (
          <div className="bhumidorpon-card p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-muted mx-auto" />
            <h3 className="text-sm font-semibold text-ink">
              {language === "bn"
                ? "দয়া করে একটি উপকূলীয় মৌজা নির্বাচন করুন"
                : "Please select a coastal mouza"}
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              {language === "bn"
                ? "কাদাচরের পলি বৃদ্ধি ও সামুদ্রিক উপকূলীয় ভাঙন পর্যালোচনা করতে উপরে জেলা, উপজেলা এবং উপকূলীয় মৌজা / ভার্চুয়াল ব্লক নির্বাচন করুন।"
                : "Choose District, Upazila, and Coastal Mouza / Virtual Block above to inspect mudflat accretion and marine shoreline retreat."}
            </p>
          </div>
        )}

        {/* RESULT DETAIL SECTION */}
        {!isLoading && !isError && result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. SUMMARY STRIP */}
            <div className="bhumidorpon-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-[#E0F2FE]/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">
                    {getLocalizedLocationLabel(result.locationLabel, language)}
                  </span>
                  {isForecast && (
                    <ConfidenceBadge
                      level={result.confidence?.level || "Medium"}
                      scorePercent={result.confidence?.scorePercent || 81}
                    />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">
                  {getLocalizedAssessmentTitle(result.title, language)}
                </h2>
                <div className="text-xs text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {language === "bn" ? "সময়কাল:" : "Period:"} {getLocalizedPeriodLabel(result.periodLabel, language)}
                  </span>
                  <span>•</span>
                  <span>
                    {language === "bn" ? "পলি বৃদ্ধি / ক্ষয়ের বার্ষিক হার:" : "Accretion / Erosion Rate:"}{" "}
                    {formatArea(result.annualRateDecimal, unit, language)}/
                    {language === "bn" ? "বছর" : "yr"}
                  </span>
                </div>
              </div>

              {/* Total Loss, Total Gain, Trend */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                <div>
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "কাদাচর বৃদ্ধি" : "Intertidal Gain"}
                  </div>
                  <div className="text-xl font-bold text-gain tabular-nums">
                    +{formatArea(result.totalGainDecimal, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "উপকূলীয় ভাঙন" : "Marine Erosion"}
                  </div>
                  <div className="text-xl font-bold text-loss tabular-nums">
                    −{formatArea(result.totalLossDecimal, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "নিট পরিবর্তন" : "Net Change"}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-gain capitalize">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{formatArea(result.netChangeDecimal, unit, language)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DEDICATED COASTAL MAP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "উপকূলীয় রেখার গতিশীলতা মানচিত্র"
                      : "Coastal Shoreline Dynamics Map"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "মোহনার ক্ষয় রেখা, উপকূলীয় কাদাচর, ম্যানগ্রোভ প্রতিরক্ষামূলক সবুজ বেষ্টনী এবং ভার্চুয়াল ক্যাডাস্ট্রাল মৌজা ব্লক"
                      : "Estuarine retreat line, intertidal mudflats, mangrove protective greenbelts, and virtual cadastral mouza blocks"}
                  </p>
                </div>
                <div className="text-xs text-muted">
                  {isForecast
                    ? language === "bn"
                      ? "প্রক্ষেপিত উপকূল ভাঙন রেখা"
                      : "Projected Shoreline Retreat"
                    : language === "bn"
                    ? "জরিপকৃত উপকূলীয় বেসলাইন"
                    : "Surveyed Coastal Baseline"}
                </div>
              </div>

              <CoastalMap
                geometry={result.geometry}
                owners={result.owners}
                isForecast={isForecast}
                selectedPlotNo={focusedPlotNo}
                onSelectPlot={(dagNo) => setFocusedPlotNo(dagNo)}
                selectedMouzaId={m}
                onSelectMouza={(mId) => setStep("m", mId)}
              />
            </div>

            {/* 3. INFO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn"
                    ? "মালিকানাহীন খাস জমি (নতুন ভূমি / কাদাচর)"
                    : "Unowned Land (Unassigned New Land / Mudflats)"}
                </span>
                <div className="text-xl font-bold text-gain tabular-nums">
                  +{formatArea(result.annualRateDecimal, unit, language)}/
                  {language === "bn" ? "বছর" : "yr"}
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn"
                    ? "মোহনা বদ্বীপ পলি জমা (মৌজা বহির্ভূত)"
                    : "Estuarine delta sedimentation (No mouza)"}
                </div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "ম্যানগ্রোভ সবুজ বেষ্টনী" : "Mangrove Greenbelt"}
                </span>
                <div className="text-base font-bold text-ink">
                  {language === "bn" ? "৩৪০ মি. বাফার বেষ্টনী" : "340m Protective Buffer"}
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn"
                    ? "ঢেউ প্রশমনকারী ম্যানগ্রোভ বেষ্টনী"
                    : "Wave attenuation mangrove strip"}
                </div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "স্বত্বাধিকারের ধরণ" : "Tenure Designation"}
                </span>
                <div className="text-base font-bold text-secondary flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-ink" />
                  <span>
                    {language === "bn" ? "ভার্চুয়াল মৌজা খাস জমি" : "Virtual Mouza Khas"}
                  </span>
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn"
                    ? "জরিপবিহীন নবগঠিত মোহনা বদ্বীপ"
                    : "Unsurveyed emergent intertidal delta"}
                </div>
              </div>
            </div>

            {/* 4. OWNER & VIRTUALLY ASSIGNED TABLE (STEP 4) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "উপকূলীয় ভূমির মালিক ও ভার্চুয়াল কাদাচর রেজিস্টার"
                      : "Coastal Landowner & Virtual Mudflat Register"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "জরিপকৃত ক্যাডাস্ট্রাল দাগ এবং নবগঠিত ভার্চুয়াল মৌজা ব্লক"
                      : "Surveyed cadastral parcels and newly accreted virtual mouza blocks"}
                  </p>
                </div>
                <span className="text-xs text-muted tabular-nums">
                  {language === "bn"
                    ? `${formatNumberLocalized(result.owners.length, language)}টি নিবন্ধিত দাগ`
                    : `${result.owners.length} registered parcels`}
                </span>
              </div>

              <OwnerTable
                variant={isForecast ? "forecast" : "recorded"}
                owners={result.owners}
                selectedPlotNo={focusedPlotNo}
                onSelectPlot={(dagNo) => setFocusedPlotNo(dagNo)}
                language={language}
              />
            </div>

            {/* 5. FORECAST DISCLAIMER (Rule 7) */}
            {isForecast && (
              <div className="p-4 rounded-card bg-predicted-soft border border-predicted/30 text-xs text-secondary flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-predicted shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-ink font-semibold block">
                    {language === "bn" ? "সতর্কবার্তা:" : "Disclaimer:"}
                  </strong>
                  <p className="leading-relaxed">
                    {language === "bn"
                      ? "এটি একটি মডেল-ভিত্তিক প্রক্ষেপণ, কোনো সরকারি দাপ্তরিক রেকর্ড নয়।"
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
