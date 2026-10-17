"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
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
import { CharMap } from "@/components/CharMap";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { getHazardResult } from "@/lib/data";
import { HazardResult, DataMode } from "@/lib/types";
import { useSelection } from "@/lib/useSelection";
import {
  getLocalizedLocationLabel,
  getLocalizedPeriodLabel,
  getLocalizedAssessmentTitle,
  getLocalizedMetric,
  formatNumberLocalized,
} from "@/lib/translations";

const DEFAULT_CHAR_SELECTION = {
  d: "sirajganj",
  u: "kazipur",
  r: "jamuna",
  m: "char_kazipur_1",
};

export default function CharDetailPage() {
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
    hazard: "char",
    mode,
    defaultSelection: DEFAULT_CHAR_SELECTION,
  });

  const [focusedPlotNo, setFocusedPlotNo] = useState<string | null>(null);

  // 2. Query Results via TanStack Query
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<HazardResult | null>({
    queryKey: ["hazardResult", "char", mode, { d, u, r, m }],
    queryFn: async () => {
      if (!activeEntityId) return null;
      return getHazardResult("char", mode, activeEntityId);
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
    router.push(`/char/${newMode}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={language === "bn" ? "চর গঠন ও পলিজ বৃদ্ধি" : "Char Island Formation & Accretion"}
        subtitle={
          isForecast
            ? language === "bn"
              ? "ব্রেইডেড নদীখাতে সম্ভাব্য পলিজ চরের বৃদ্ধি, স্থিতিশীলতা সূচক ও সরকারি খাস জমি প্রক্ষেপণ"
              : "Predicted braided river sandbar accretion dynamics, stability indices, and state khas land"
            : language === "bn"
              ? "ব্রেইডেড নদীখাতে পলিজ বালুচরের উত্থান, স্থিতিশীলতা সূচক ও ক্যাডাস্ট্রাল জরিপ রেকর্ড"
              : "Braided river alluvial island emergence, stability index, and cadastral survey records"
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
            <Link href="/char" className="hover:text-ink transition-colors">
              {language === "bn" ? "চর ও নদীদ্বীপ" : "Char Islands"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {isForecast
                ? language === "bn" ? "পূর্বাভাস ডাইনামিক্স" : "Forecast Dynamics"
                : language === "bn" ? "রেকর্ডকৃত ডাইনামিক্স" : "Recorded Dynamics"}
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
              label={language === "bn" ? "মরফোলজিক্যাল মডেল" : "Morphological Model"}
            />
          )}
        </div>

        {/* REBUILD SELECTOR CHAIN */}
        <SelectorChain
          hazard="char"
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
              {language === "bn" ? "চরের তথ্য লোড করতে ব্যর্থ হয়েছে" : "Failed to load char island data"}
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {error instanceof Error
                ? error.message
                : language === "bn"
                  ? "চরের পলিজ বৃদ্ধির তথ্য লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।"
                  : "An unexpected error occurred while loading island accretion data."}
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
            hazard="char"
            title={language === "bn" ? "কোনো চরের তথ্য পাওয়া যায়নি" : "No char island records found."}
            description={
              language === "bn"
                ? "নির্বাচিত ব্রেইডেড নদী এলাকায় বর্তমানে কোনো স্থায়িত্ব অর্জনকারী জেগে ওঠা চর নেই।"
                : "The selected braided river sector currently contains no emergent alluvial sandbars meeting consolidation criteria."
            }
            actionLabel={language === "bn" ? "পাইলট ক্লাস্টারে ফিরুন" : "Reset to Pilot Cluster"}
            onAction={resetToDefault}
          />
        )}

        {!isFinalStepSet && (
          <div className="bhumidorpon-card p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-muted mx-auto" />
            <h3 className="text-sm font-semibold text-ink">
              {language === "bn" ? "একটি চর নির্বাচন করুন" : "Please select a char island"}
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              {language === "bn"
                ? "চরের বৃদ্ধি ও সরকারি খাস জমি দেখতে জেলা, উপজেলা, নদী এবং চর নির্বাচন করুন।"
                : "Select District, Upazila, River, and Char Island to view sandbar emergence and government khas land tracking."}
            </p>
          </div>
        )}

        {/* DETAIL CONTENT */}
        {!isLoading && !isError && result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. SUMMARY STRIP */}
            <div className="bhumidorpon-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-purple-50/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">
                    {getLocalizedLocationLabel(result.locationLabel, language)}
                  </span>
                  {isForecast && (
                    <ConfidenceBadge
                      level={result.confidence?.level || "High"}
                      scorePercent={result.confidence?.scorePercent || 84}
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
                    {language === "bn" ? "পলি জমার হার" : "Accretion Rate"}: {formatArea(result.annualRateDecimal, unit, language)}/{language === "bn" ? "বছর" : "yr"}
                  </span>
                </div>
              </div>

              {/* Accretion, Scour, Net Growth */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                <div>
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "মোট পলি বৃদ্ধি" : "Total Accretion"}
                  </div>
                  <div className="text-xl font-bold text-gain tabular-nums">
                    +{formatArea(result.totalGainDecimal, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "পার্শ্বীয় ক্ষয়" : "Flank Scour"}
                  </div>
                  <div className="text-xl font-bold text-loss tabular-nums">
                    -{formatArea(result.totalLossDecimal, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "নিট বৃদ্ধি" : "Net Growth"}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-gain capitalize">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{formatArea(result.netChangeDecimal, unit, language)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CHAR MAP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "ব্রেইডেড নদীখাত ও চর স্থিতিশীলতা মানচিত্র"
                      : "Braided Channel & Sandbar Consolidation Map"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "পলি বৃদ্ধি কিনারা, উদ্ভিজ্জ একত্রীকরণ (NDVI) এবং সরকারি খাস জমির দাগ চিহ্নিতকরণ"
                      : "Accretion margins, vegetative consolidation (NDVI), and state khas land parcel demarcation"}
                  </p>
                </div>
                <div className="text-xs text-muted">
                  {isForecast
                    ? language === "bn" ? "১ বছরের রূপগত পরিবর্তন" : "1-Year Morphological Shift"
                    : language === "bn" ? "জরিপকৃত পলিজ চরের বিস্তার" : "Surveyed Alluvial Footprint"}
                </div>
              </div>

              <CharMap
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
                  {language === "bn" ? "উত্থান স্থিতিশীলতা" : "Emergence Stability"}
                </span>
                <div className="text-xl font-bold text-purple-700 tabular-nums">
                  {language === "bn" ? "০.৭৮ সূচক" : "0.78 Index"}
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn" ? "পলি সংহতি সূচক ফ্যাক্টর" : "Sediment consolidation factor"}
                </div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn"
                    ? "অধিভুক্তহীন জমি (সরকারি খাস পলিজ চর)"
                    : "Unowned Land (State Khas Alluvial Accretion)"}
                </span>
                <div className="text-xl font-bold text-ink tabular-nums">
                  {formatArea(result.totalGainDecimal * 0.65, unit, language)}
                </div>
                <div className="text-[11px] text-secondary">
                  {language === "bn"
                    ? "অবণ্টিত নতুন জেগে ওঠা সরকারি খাস দাগ (খতিয়ান ১/১)"
                    : "Unallocated emergent state plots (Deed 1/1)"}
                </div>
              </div>

              {result.metrics.slice(0, 1).map((mItem, idx) => {
                const localized = getLocalizedMetric(mItem, language);
                return (
                  <div key={idx} className="bhumidorpon-card p-4 space-y-1">
                    <span className="text-xs font-medium text-muted">{localized.label}</span>
                    <div className="text-xl font-bold text-ink tabular-nums">
                      {localized.value}
                    </div>
                    {localized.sublabel && (
                      <div className="text-[11px] text-secondary">{localized.sublabel}</div>
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
                      ? "চরের জমির মালিকানা ও জেগে ওঠা দাগসমূহ"
                      : "Char Land Ownership & Accretion Parcels"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "চিহ্নিত সরকারি খাস জমি এবং নিবন্ধিত বেসরকারি পুনর্বহালকৃত দাগসমূহ"
                      : "Demarcated state khas land and registered private re-emergent cadastral plots"}
                  </p>
                </div>
                <span className="text-xs text-muted tabular-nums">
                  {language === "bn"
                    ? `${formatNumberLocalized(result.owners.length, language)} টি দাগ রেকর্ডভুক্ত`
                    : `${result.owners.length} parcels recorded`}
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
