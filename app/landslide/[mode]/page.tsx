"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Mountain,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
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
import { LandslideMap } from "@/components/LandslideMap";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { getHazardResult } from "@/lib/data";
import { HazardResult, DataMode } from "@/lib/types";
import { useSelection } from "@/lib/useSelection";
import {
  LandslideEventRecord,
  getEventsForMountain,
  getLandslideEventById,
} from "@/lib/landslideEvents";
import {
  t,
  formatNumberLocalized,
  getLocalizedLocationLabel,
  getLocalizedPeriodLabel,
  getLocalizedAssessmentTitle,
  getLocalizedMetric,
} from "@/lib/translations";

const DEFAULT_LANDSLIDE_SELECTION = {
  d: "rangamati",
  u: "kawkhali",
  h: "ghagra",
};

export default function LandslideDetailPage() {
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
    h,
    ev,
    setStep,
    resetToDefault,
    isFinalStepSet,
    activeEntityId,
  } = useSelection({
    hazard: "landslide",
    mode,
    defaultSelection: DEFAULT_LANDSLIDE_SELECTION,
  });

  const [focusedPlotNo, setFocusedPlotNo] = useState<string | null>(null);

  const hillEvents = React.useMemo(() => {
    return h ? getEventsForMountain(h, mode) : [];
  }, [h, mode]);

  const activeEvent: LandslideEventRecord | null = React.useMemo(() => {
    if (ev) {
      const found = getLandslideEventById(ev);
      if (found && (!h || found.hillId === h) && found.mode === mode) return found;
    }
    if (hillEvents.length > 0) {
      return [...hillEvents].sort((a, b) => b.year - a.year)[0];
    }
    return null;
  }, [ev, h, mode, hillEvents]);

  // 2. Load Results via TanStack Query
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<HazardResult | null>({
    queryKey: ["hazardResult", "landslide", mode, { d, u, h }],
    queryFn: async () => {
      if (!activeEntityId) return null;
      return getHazardResult("landslide", mode, activeEntityId);
    },
    enabled: isFinalStepSet,
  });

  const handleModeSwitch = (newMode: DataMode) => {
    const qs = new URLSearchParams();
    if (d) qs.set("d", d);
    if (u) qs.set("u", u);
    if (h) qs.set("h", h);
    const queryString = qs.toString();
    router.push(`/landslide/${newMode}${queryString ? `?${queryString}` : ""}`);
  };

  // Event-augmented values
  const displayTitle = activeEvent
    ? language === "bn"
      ? activeEvent.eventNameBn
      : activeEvent.eventNameEn
    : getLocalizedAssessmentTitle(result?.title || "Landslide Hazard", language);

  const displayPeriod = activeEvent
    ? activeEvent.eventDate
    : getLocalizedPeriodLabel(result?.periodLabel || "2024 Event", language);

  const displayLoss = activeEvent
    ? activeEvent.affectedSlopeAreaDecimal
    : result?.totalLossDecimal || 117.6;

  const displayDebrisVolume = activeEvent
    ? `${formatNumberLocalized(activeEvent.debrisVolumeM3.toLocaleString(), language)} ${language === "bn" ? "ঘনমিটার" : "m³"}`
    : language === "bn" ? "৪৩,২০১ ঘনমিটার" : "43,201 m³";

  const displaySlopeAngle = activeEvent
    ? `${formatNumberLocalized(activeEvent.slopeGradientDeg, language)}° ${language === "bn" ? "কোণ" : "Angle"}`
    : language === "bn" ? "৪২° কোণ" : "42° Angle";

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={
          language === "bn"
            ? "ভূমিধস ঝুঁকি ও ঢাল স্থিতিশীলতা"
            : "Landslide Hazards & Slope Stability"
        }
        subtitle={
          isForecast
            ? language === "bn"
              ? "মেশিন লার্নিং বৃষ্টিপাত থ্রেশহোল্ড ও ঢাল ফাটল প্রক্ষেপণ"
              : "Machine learning rainfall threshold & slope rupture susceptibility projection"
            : language === "bn"
              ? "পার্বত্য চট্টগ্রামের মৌসুমী ঢাল ধসের রেকর্ড এবং ক্ষতিগ্রস্ত ক্যাডাস্ট্রাল বসতবাড়ি"
              : "Chittagong Hill Tracts monsoonal slope rupture records and affected cadastral homesteads"
        }
      >
        <div className="inline-flex items-center">
          <SegmentedToggle<DataMode>
            options={[
              { id: "recorded", label: language === "bn" ? "ক. রেকর্ডকৃত তথ্য" : "A. Recorded Data" },
              { id: "forecast", label: language === "bn" ? "খ. পূর্বাভাস (মডেল)" : "B. Forecast (DL)" },
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
              {t("navHome", language)}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/landslide" className="hover:text-ink transition-colors">
              {t("navLandslide", language)}
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
                  {displayTitle}
                </span>
              </>
            )}
          </nav>

          {isForecast && <ForecastBadge label="InSAR & Slope Model" />}
        </div>

        {/* SINGLE SELECTOR CHAIN (DISTRICT -> UPAZILA -> HILL -> EVENT) */}
        <SelectorChain
          hazard="landslide"
          mode={mode}
          selection={selection}
          onSelectStep={setStep}
          onReset={resetToDefault}
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
            <h3 className="font-semibold text-base text-ink">Failed to load landslide data</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              {error instanceof Error ? error.message : "An unexpected error occurred while loading slope stability records."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-pill bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && isFinalStepSet && !result && (
          <EmptyState
            hazard="landslide"
            title={
              isForecast
                ? language === "bn"
                  ? "এই ঢালে ভূমিধসের কোনো পূর্বাভাস নেই।"
                  : "No landslide hazard is projected for this slope."
                : language === "bn"
                  ? "এই ঢালে কোনো ঐতিহাসিক ভূমিধসের রেকর্ড নেই।"
                  : "No historical landslide recorded on this slope."
            }
            description={
              language === "bn"
                ? "নির্বাচিত এলাকাটি উচ্চ ঝুঁকিপূর্ণ ঢাল কোণ (>৩০°) ও মাটি স্থানচ্যুতি অঞ্চলের বাইরে অবস্থিত।"
                : "The selected feature lies outside high-hazard slope angles (>30°) and colluvial displacement zones."
            }
            actionLabel={language === "bn" ? "পাইলট ক্লাস্টারে ফিরুন" : "Reset to Pilot Cluster"}
            onAction={resetToDefault}
          />
        )}

        {!isFinalStepSet && (
          <div className="bhumidorpon-card p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-muted mx-auto" />
            <h3 className="text-sm font-semibold text-ink">
              {language === "bn" ? "অনুগ্রহ করে একটি পাহাড়ি এলাকা নির্বাচন করুন" : "Please select a hill feature"}
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              {language === "bn"
                ? "টপোগ্রাফিক উচ্চতার কনট্যুর এবং ঢাল ধসের সীমানা দেখতে জেলা, উপজেলা এবং পাহাড়ি করিডোর নির্বাচন করুন।"
                : "Select District, Upazila, and Hill Corridor to view topographic elevation contours and slope failure demarcations."}
            </p>
          </div>
        )}

        {/* DETAIL CONTENT */}
        {!isLoading && !isError && result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. SUMMARY STRIP */}
            <div className="bhumidorpon-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-amber-50/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">
                    {getLocalizedLocationLabel(result.locationLabel, language)}
                  </span>
                  {isForecast && (
                    <ConfidenceBadge
                      level={result.confidence?.level || "High"}
                      scorePercent={activeEvent?.modelConfidenceScore || result.confidence?.scorePercent || 86}
                    />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">
                  {displayTitle}
                </h2>
                <div className="text-xs text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "ঘটনা:" : "Event:"} {displayPeriod}</span>
                  <span>•</span>
                  <span>
                    {language === "bn" ? "স্থানচ্যুতির বার্ষিক হার:" : "Displacement Rate:"}{" "}
                    {formatArea(result.annualRateDecimal, unit, language)}/{language === "bn" ? "বছর" : "yr"}
                  </span>
                </div>
              </div>

              {/* Total Loss, Gain, Risk Level */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                <div>
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "স্থানান্তরিত পাহাড়ি জমি" : "Displaced Land"}
                  </div>
                  <div className="text-xl font-bold text-loss tabular-nums">
                    {formatArea(displayLoss, unit, language)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">
                    {language === "bn" ? "মোট বৃদ্ধি" : "Total Gain"}
                  </div>
                  <div className="text-xl font-bold text-ink tabular-nums">
                    {formatArea(0, unit, language)}
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
                    <span>{language === "bn" ? "ক্রমবর্ধমান" : "Increasing"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LANDSLIDE MAP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "ঢালের ভূসংস্থান ও InSAR বিকৃতি মানচিত্র"
                      : "Slope Topography & InSAR Deformation Map"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "টপোগ্রাফিক এলিভেশন কনট্যুর, ধসের ক্ষত, ধ্বংসাবশেষ প্রবাহ এবং বসতি সংবেদনশীল বাফার"
                      : "Topographic elevation contours, failure scarp, debris runout zone, and settlement risk buffers"}
                  </p>
                </div>
                <div className="text-xs text-muted">
                  {isForecast
                    ? language === "bn"
                      ? "প্রক্ষেপিত ঢাল স্থিতিশীলতা পরিসীমা"
                      : "Projected Slope Stability Envelope"
                    : language === "bn"
                    ? "জরিপকৃত ঢাল স্খলন"
                    : "Surveyed Slope Rupture"}
                </div>
              </div>

              <LandslideMap
                geometry={result.geometry}
                owners={result.owners}
                isForecast={isForecast}
                selectedPlotNo={focusedPlotNo}
                onSelectPlot={(dagNo) => setFocusedPlotNo(dagNo)}
                selectedMouzaId={h || activeEntityId}
                onSelectMouza={(mId) => setStep("h", mId)}
              />
            </div>

            {/* 3. INFO METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "ঢাল নতিমাত্রা" : "Slope Gradient"}
                </span>
                <div className="text-xl font-bold text-amber-600 tabular-nums">
                  {displaySlopeAngle}
                </div>
                <div className="text-[11px] text-secondary">
                  {activeEvent
                    ? language === "bn"
                      ? `বৃষ্টিপাত: ${formatNumberLocalized(activeEvent.rainfallMm24h, language)} মিমি/২৪ ঘণ্টা`
                      : `Rainfall: ${activeEvent.rainfallMm24h} mm/24h`
                    : language === "bn"
                    ? "মৌসুমী অতিবৃষ্টির থ্রেশহোল্ড"
                    : "High risk monsoonal threshold"}
                </div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "স্থানান্তরিত ধ্বংসাবশেষ" : "Debris Volume Displaced"}
                </span>
                <div className="text-xl font-bold text-ink tabular-nums">
                  {displayDebrisVolume}
                </div>
                <div className="text-[11px] text-secondary">
                  {activeEvent
                    ? language === "bn"
                      ? (activeEvent.impactSummaryBn || activeEvent.impactSummaryEn).slice(0, 40) + "..."
                      : activeEvent.impactSummaryEn.slice(0, 40) + "..."
                    : language === "bn"
                    ? "পাহাড়ের মাটি স্খলন"
                    : "Colluvial soil collapse"}
                </div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">
                  {language === "bn" ? "বাফারের ভেতরে ঝুঁকিপূর্ণ বসতি" : "Homesteads Inside Buffer"}
                </span>
                <div className="text-xl font-bold text-ink tabular-nums">
                  {activeEvent
                    ? `${formatNumberLocalized(activeEvent.homesteadsAtRisk, language)} ${language === "bn" ? "টি বসতবাড়ি" : "Homesteads"}`
                    : `${formatNumberLocalized(result.owners.length, language)} ${language === "bn" ? "টি বসতবাড়ি" : "Homesteads"}`}
                </div>
                <div className="text-[11px] text-secondary">
                  {activeEvent
                    ? language === "bn"
                      ? `পূর্ব সতর্কবার্তা: ${formatNumberLocalized(activeEvent.casualtiesAvoidedFamilies, language)}টি পরিবার`
                      : `Early warning: ${activeEvent.casualtiesAvoidedFamilies} families`
                    : language === "bn"
                    ? "৫০ মিটার ধ্বংসাবশেষ প্রবাহ বাফারে"
                    : "Within 50m runout zone"}
                </div>
              </div>
            </div>

            {/* IMPACT SUMMARY BANNER */}
            {activeEvent && (
              <div className="bhumidorpon-card p-4 bg-surface-alt/60 border border-border flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold text-ink">
                    {language === "bn" ? "প্রভাব ও ক্ষয়ক্ষতির সারসংক্ষেপ:" : "Impact & Damage Summary:"}
                  </span>
                  <p className="text-secondary leading-relaxed">
                    {language === "bn" ? activeEvent.impactSummaryBn : activeEvent.impactSummaryEn}
                  </p>
                </div>
              </div>
            )}

            {/* 4. OWNER TABLE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    {language === "bn"
                      ? "ক্ষতিগ্রস্ত পাহাড়ি দাগ ও বসতবাড়ির তালিকা"
                      : "Affected Slope Parcels & Homesteads"}
                  </h3>
                  <p className="text-xs text-muted">
                    {language === "bn"
                      ? "ধসের ক্ষত ও ৫০ মিটার নিম্নাঞ্চলীয় বাফারে অবস্থিত ক্যাডাস্ট্রাল দাগ"
                      : "Cadastral plots situated within the rupture scarp and 50m downslope settlement risk buffer"}
                  </p>
                </div>
                <span className="text-xs text-muted tabular-nums">
                  {language === "bn"
                    ? `${formatNumberLocalized(result.owners.length, language)}টি নিবন্ধিত দাগ`
                    : `${result.owners.length} registered plots`}
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
                    {t("disclaimerNote", language)}
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

