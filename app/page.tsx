"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Waves,
  CloudRain,
  Mountain,
  Compass,
  Anchor,
  ArrowRight,
  TrendingDown,
  Layers,
  MapPin,
  AlertTriangle,
  Radio,
  Landmark,
  Info,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { AppHeader } from "@/components/AppHeader";
import { SegmentedToggle } from "@/components/SegmentedToggle";
import { ForecastBadge } from "@/components/ForecastBadge";
import { RankedList } from "@/components/RankedList";
import { Skeleton } from "@/components/Skeleton";

const TrendChart = dynamic(
  () => import("@/components/TrendChart").then((mod) => mod.TrendChart),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[320px] rounded-card" />,
  }
);

const BarChart = dynamic(
  () => import("@/components/BarChart").then((mod) => mod.BarChart),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[320px] rounded-card" />,
  }
);

const DashboardMapPreview = dynamic(
  () => import("@/components/map/DashboardMapPreview").then((mod) => mod.DashboardMapPreview),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-44" />,
  }
);
import { useAppStore } from "@/stores/appStore";
import { formatArea, formatCurrencyBDT } from "@/lib/units";
import { getDashboardSummary } from "@/lib/data";
import { DashboardSummary, DataMode } from "@/lib/types";
import { t, formatNumberLocalized } from "@/lib/translations";

const MODULE_CARDS = [
  {
    id: "river_erosion",
    nameBn: "নদীভাঙন",
    nameEn: "River Erosion",
    sublabelBn: "সক্রিয় নদী তীররেখা ভাঙন ও সীমানা পরিবর্তন",
    sublabelEn: "Active riverbank migration & boundary retreat",
    href: "/river-erosion",
    icon: Waves,
    accentColor: "text-loss",
    bgSoft: "bg-loss-soft",
    updateCycleBn: "বার্ষিক জরিপ",
    updateCycleEn: "Annual survey",
    lastUpdatedBn: "অক্টোবর ২০২৪",
    lastUpdatedEn: "October 2024",
    descriptionBn: "যমুনা, পদ্মা ও মেঘনা নদীর সক্রিয় ভাঙনে নিবন্ধিত ক্যাডাস্ট্রাল মৌজার জমি বিলীন হওয়ার রেকর্ড।",
    descriptionEn: "Jamuna, Padma, and Meghna active channel bank retreat across registered cadastral mouzas.",
    lossDecimal: 8420,
    forecastLossDecimal: 11200,
  },
  {
    id: "flood",
    nameBn: "বন্যা পর্যবেক্ষণ",
    nameEn: "Flood Monitoring",
    sublabelBn: "আকস্মিক প্লাবন ও পলি সঞ্চয়ন ম্যাপিং",
    sublabelEn: "Flash flood inundation & silt sedimentation",
    href: "/flood",
    icon: CloudRain,
    accentColor: "text-water",
    bgSoft: "bg-[#E3F2FD]",
    updateCycleBn: "ঘটনা-ভিত্তিক",
    updateCycleEn: "Event-based",
    lastUpdatedBn: "বর্ষা ২০২৪",
    lastUpdatedEn: "Monsoon 2024",
    descriptionBn: "উপগ্রহ এসএআর রাডার দ্বারা প্লাবিত এলাকা ম্যাপিং, পলির গভীরতা ও প্লটের সীমানা পুনরুদ্ধার।",
    descriptionEn: "Satellite SAR water extent mapping, topsoil siltation depth, and owner plot boundary recovery.",
    lossDecimal: 4150,
    forecastLossDecimal: 5200,
  },
  {
    id: "landslide",
    nameBn: "ভূমিধস ঝুঁকি",
    nameEn: "Landslide Hazards",
    sublabelBn: "পাহাড়ের ঢাল ধস ও ধ্বংসাবশেষ প্রবাহ",
    sublabelEn: "Hilly slope mass wasting & debris runout",
    href: "/landslide",
    icon: Mountain,
    accentColor: "text-[#D97706]",
    bgSoft: "bg-[#FEF3C7]",
    updateCycleBn: "ঘটনা-ভিত্তিক",
    updateCycleEn: "Event-based",
    lastUpdatedBn: "জুন ২০২৪",
    lastUpdatedEn: "June 2024",
    descriptionBn: "পার্বত্য চট্টগ্রামের ঢাল নতিমাত্রা বিশ্লেষণ, মাটির আয়তন প্রতিস্থাপন এবং ঝুঁকিপূর্ণ বসতি বাফার।",
    descriptionEn: "Chittagong Hill Tracts slope angle analysis, soil volume displacement, and settlement risk buffers.",
    lossDecimal: 1620,
    forecastLossDecimal: 2100,
  },
  {
    id: "char",
    nameBn: "চর ও দ্বীপাঞ্চল",
    nameEn: "Char Islands",
    sublabelBn: "পলি সঞ্চয়ন ও নতুন চরের স্থায়িত্ব সূচক",
    sublabelEn: "Braided channel accretion & sandbar consolidation",
    href: "/char",
    icon: Compass,
    accentColor: "text-[#8B5CF6]",
    bgSoft: "bg-[#EDE9FE]",
    updateCycleBn: "বার্ষিক জরিপ",
    updateCycleEn: "Annual survey",
    lastUpdatedBn: "নভেম্বর ২০২৪",
    lastUpdatedEn: "November 2024",
    descriptionBn: "নবগঠিত পলিচরের স্থায়িত্ব সূচক, উদ্ভিজ্জ আবরণ (NDVI) এবং সরকারি খাস জমি ট্র্যাকিং।",
    descriptionEn: "Emergent alluvial island stability index, vegetation coverage (NDVI), and state khas land tracking.",
    lossDecimal: 980,
    forecastLossDecimal: 1000,
  },
  {
    id: "coastal",
    nameBn: "উপকূলীয় পরিবর্তন",
    nameEn: "Coastal Shifts",
    sublabelBn: "উপকূলরেখা ভাঙন ও নতুন ভূমি গঠন",
    sublabelEn: "Estuarine erosion & seaward accretion mudflats",
    href: "/coastal",
    icon: Anchor,
    accentColor: "text-gain",
    bgSoft: "bg-gain-soft",
    updateCycleBn: "বার্ষিক জরিপ",
    updateCycleEn: "Annual survey",
    lastUpdatedBn: "ডিসেম্বর ২০২৪",
    lastUpdatedEn: "December 2024",
    descriptionBn: "মেঘনা মোহনার জোয়ার-ভাটার গতিপ্রকৃতি, লবণাক্ততা বিস্তার ও নবগঠিত পলিময় এলাকা।",
    descriptionEn: "Meghna estuary tidal shoreline retreat, salinity progression, and unassigned virtual mouza blocks.",
    lossDecimal: 3280,
    forecastLossDecimal: 3900,
  },
];

export default function HomeDashboardPage() {
  const { unit, language } = useAppStore();
  const [mode, setMode] = useState<DataMode>("recorded");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isBn = language === "bn";

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getDashboardSummary(mode).then((data) => {
      if (isMounted) {
        setSummary(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [mode]);

  const isForecast = mode === "forecast";

  const handleScrollToDisasters = () => {
    const el = document.getElementById("disaster-options");
    if (el) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  // Compensation percentages
  const totalComp = summary?.totalCompensationBDT || 1;
  const paidPct = Math.round(((summary?.paidCompensationBDT || 0) / totalComp) * 100);
  const approvedPct = Math.round(
    ((summary?.approvedCompensationBDT || 0) / totalComp) * 100
  );
  const pendingPct = Math.max(0, 100 - paidPct - approvedPct);

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* Top Header */}
      <AppHeader
        title={t("overviewTitle", language)}
        subtitle={t("overviewSubtitle", language)}
      >
        {/* Explore Disasters Scroll Button */}
        <button
          type="button"
          onClick={handleScrollToDisasters}
          className="h-10 px-3.5 rounded-pill bg-surface hover:bg-surface-alt border border-border hover:border-ink/30 text-ink text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-subtle transition-all cursor-pointer"
          title={t("exploreDisastersBtn", language)}
        >
          <Waves className="w-3.5 h-3.5 text-accent-deep" />
          <span>{t("exploreDisastersBtn", language)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted" />
        </button>

        {/* Segmented Mode Switcher */}
        <div className="inline-flex items-center">
          <SegmentedToggle<DataMode>
            options={[
              { id: "recorded", label: t("recordedData", language) },
              { id: "forecast", label: t("forecastData", language) },
            ]}
            value={mode}
            onChange={(m) => setMode(m)}
            variant="lime"
            size="md"
          />
        </div>
      </AppHeader>

      {/* Main Dashboard Grid */}
      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1440px] mx-auto w-full">
        {/* Forecast Disclaimer Banner */}
        {isForecast && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-card bg-predicted-soft border border-predicted/30 text-ink text-xs sm:text-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <ForecastBadge label={isBn ? "ডিপ লার্নিং মডেল প্রক্ষেপণ" : "Deep Learning Model Projection"} />
              <span className="font-medium text-secondary">
                {t("disclaimerNote", language)}
              </span>
            </div>
            <div className="text-[11px] text-muted whitespace-nowrap">
              {isBn ? "মডেল: GeoAI-BD v2.4 • মাল্টি-টেম্পোরাল ConvLSTM" : "Model: GeoAI-BD v2.4 • Multitemporal ConvLSTM"}
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Grid: Row 1 & Row 2 */}
          <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
            {/* ROW 1: Hero Trend Card (8 cols) + Compensation Card (4 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Hero Trend Card: 8 Columns */}
              <div className="md:col-span-8 bhumidorpon-card p-6 flex flex-col justify-between">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted">
                        {isForecast ? (isBn ? "প্রত্যাশিত মোট ভূমিক্ষয়" : "Projected Total Land Loss") : (isBn ? "মোট ভূমিক্ষয় / ক্ষতি" : "Total Land Loss")}
                      </span>
                      {isForecast ? (
                        <ForecastBadge />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-loss-soft text-loss text-[11px] font-semibold">
                          <TrendingDown className="w-3 h-3" />
                          <span>{isBn ? "বিলীন / জলমগ্ন" : "Eroded / Inundated"}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink tabular-nums">
                      {formatArea(summary?.totalLossDecimal || 0, unit, language)}
                    </div>
                    <div className="text-xs text-secondary flex items-center gap-3 pt-0.5">
                      <span>
                        {isBn ? "নতুন ভূমি গঠন (পয়স্তি):" : "Land Accretion:"}{" "}
                        <strong className="text-gain font-semibold">
                          {formatArea(summary?.totalGainDecimal || 0, unit, language)}
                        </strong>
                      </span>
                      <span className="text-border">•</span>
                      <span>
                        {isBn ? "নিট পরিবর্তন:" : "Net Balance:"}{" "}
                        <strong className="text-loss font-semibold">
                          {formatArea(summary?.netChangeDecimal || 0, unit, language)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Period Filter Chip */}
                  <div className="px-2.5 py-1 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
                    {isForecast ? (isBn ? "২০২২ – ২০২৭ প্রক্ষেপিত" : "2022 – 2027 Projected") : (isBn ? "২০১৯ – ২০২৪ রেকর্ডকৃত" : "2019 – 2024 Recorded")}
                  </div>
                </div>

                {/* Hero Trend Chart */}
                <div className="pt-2">
                  <TrendChart
                    data={summary?.trendSeries || []}
                    isForecast={isForecast}
                    height={250}
                  />
                </div>
              </div>

              {/* Compensation Card: 4 Columns */}
              <div className="md:col-span-4 bhumidorpon-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">
                      {isForecast ? (isBn ? "প্রত্যাশিত ক্ষতিপূরণ বাজেট" : "Projected Compensation") : (isBn ? "মোট প্রাক্কলিত ক্ষতিপূরণ" : "Total Estimated Compensation")}
                    </span>
                    <Landmark className="w-4 h-4 text-muted" />
                  </div>

                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-ink tabular-nums">
                      {formatCurrencyBDT(summary?.totalCompensationBDT || 0, { compact: true, language })}
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">
                      {isForecast
                        ? isBn ? "পুনর্বাসন নীতিমালা অনুযায়ী মডেল-প্রাক্কলিত বাজেট" : "Model-estimated budget requirement under land rehabilitation policies"
                        : isBn ? "অনুমোদিত সরকারি বাজেট ও প্রদান অগ্রগতি" : "Approved government budget and disbursement progress"}
                    </p>
                  </div>

                  {isForecast ? (
                    /* Forecast Mode: ONLY Projected Compensation and projected area metrics (Rule 5) */
                    <div className="mt-6 space-y-4">
                      <div className="p-3.5 rounded-card bg-predicted-soft/60 border border-predicted/20 space-y-2">
                        <div className="text-xs font-semibold text-predicted flex items-center gap-1.5">
                          <ForecastBadge size="sm" />
                          <span>{isBn ? "প্রত্যাশিত ঝুঁকি প্রাক্কলন" : "Projected Risk Assessment"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div>
                            <div className="text-[10px] text-muted">{isBn ? "প্রত্যাশিত এলাকা" : "Projected Area"}</div>
                            <div className="font-semibold text-ink tabular-nums">
                              {formatArea(summary?.totalLossDecimal || 0, unit, language)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted">{isBn ? "অনুমানকৃত ক্ষতিগ্রস্ত দাগ" : "Estimated Parcels"}</div>
                            <div className="font-semibold text-ink tabular-nums">
                              {formatNumberLocalized(summary?.affectedOwnersCount || 1420, language)} {isBn ? "টি দাগ" : "Plots"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted flex items-start gap-1.5 pt-1">
                        <Info className="w-3.5 h-3.5 text-predicted flex-shrink-0 mt-0.5" />
                        <span>
                          {isBn
                            ? "প্রত্যাশিত ভূমিক্ষতির প্রতি শতকে সরকারি পুনর্বাসন মানদণ্ডে প্রাক্কলিত। এটি একটি মডেল-ভিত্তিক অনুমান, কোনো সরকারি রেকর্ড নয়।"
                            : "Calculated at standard government rehabilitation unit value per decimal of projected land loss. This is a model-based estimate, not an official government record."}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Recorded Mode: 3 Progress Bars (Disbursed, Approved, Pending) */
                    <div className="mt-6 space-y-4">
                      {/* Disbursed */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-ink flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-gain" />
                            <span>{isBn ? "পরিশোধিত" : "Disbursed (Paid)"}</span>
                          </span>
                          <span className="tabular-nums font-semibold text-gain">
                            {formatNumberLocalized(paidPct, language)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-gain rounded-full transition-all duration-500"
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted tabular-nums text-right">
                          {formatCurrencyBDT(summary?.paidCompensationBDT || 0, { compact: true, language })}
                        </div>
                      </div>

                      {/* Approved */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-ink flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-water" />
                            <span>{isBn ? "অনুমোদিত" : "Approved"}</span>
                          </span>
                          <span className="tabular-nums font-semibold text-water">
                            {formatNumberLocalized(approvedPct, language)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-water rounded-full transition-all duration-500"
                            style={{ width: `${approvedPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted tabular-nums text-right">
                          {formatCurrencyBDT(summary?.approvedCompensationBDT || 0, { compact: true, language })}
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-ink flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-warn" />
                            <span>{isBn ? "বিচারাধীন / প্রক্রিয়াধীন" : "Pending"}</span>
                          </span>
                          <span className="tabular-nums font-semibold text-warn">
                            {formatNumberLocalized(pendingPct, language)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-warn rounded-full transition-all duration-500"
                            style={{ width: `${pendingPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted tabular-nums text-right">
                          {formatCurrencyBDT(summary?.pendingCompensationBDT || 0, { compact: true, language })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted">
                  {isForecast
                    ? isBn ? "* এটি একটি মডেল-ভিত্তিক অনুমান, কোনো সরকারি রেকর্ড নয়।" : "* This is a model-based estimate, not an official government record."
                    : isBn ? "* জেলা প্রশাসন ও ভূমি ব্যবস্থাপনা রেকর্ড দ্বারা যাচাইকৃত।" : "* Verified via District Land Administration Records."}
                </div>
              </div>
            </div>

            {/* ROW 2: Hazard Breakdown Bar Chart (5 cols) + Ranked Districts (7 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Hazard Breakdown: 5 Columns */}
              <div className="md:col-span-5 bhumidorpon-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold text-ink">
                      {isBn ? "দুর্যোগভিত্তিক প্রভাব বিশ্লেষণ" : "Hazard Impact Breakdown"}
                    </h2>
                    <span className="text-[11px] text-muted">{isBn ? "শ্রেণি অনুযায়ী" : "By Category"}</span>
                  </div>
                  <p className="text-xs text-muted mb-4">
                    {isBn
                      ? "বিভিন্ন দুর্যোগে ভূমির ক্ষয় ও পয়স্তির তুলনামূলক চিত্র"
                      : "Comparative distribution of land loss and accretion across hazards"}
                  </p>

                  <div className="pt-2">
                    <BarChart
                      data={summary?.hazardBreakdown || []}
                      isForecast={isForecast}
                      height={240}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border text-[11px] text-secondary">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-loss" />
                    <span>{isBn ? "নদীভাঙন: সর্বোচ্চ ক্ষতি" : "River Erosion: Highest Loss"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gain" />
                    <span>{isBn ? "উপকূল ও চর: পয়স্তি" : "Coastal & Chars: Accretion"}</span>
                  </div>
                </div>
              </div>

              {/* Ranked Top Districts: 7 Columns */}
              <div className="md:col-span-7 bhumidorpon-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold text-ink">
                      {isBn ? "সর্বাধিক ক্ষতিগ্রস্ত জেলাসমূহ" : "Top Impacted Districts"}
                    </h2>
                    <span className="text-[11px] text-muted">
                      {isBn ? "ক্ষতির আয়তন অনুযায়ী ক্রম" : "Ranked by Loss Area"}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-4">
                    {isBn
                      ? "জাতীয় ভূমিক্ষয়ে অবদান ও বার্ষিক পরিবর্তনের হার"
                      : "Proportion of national land loss and annual rate of change"}
                  </p>

                  <RankedList items={summary?.topDistricts || []} />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span>{isBn ? "সিরাজগঞ্জ ও ভোলা প্রধান অগ্রাধিকার এলাকা" : "Sirajganj and Bhola represent key priority clusters"}</span>
                  <Link
                    href="/river-erosion"
                    className="text-accent-deep hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{isBn ? "এলাকাসমূহ দেখুন" : "Explore Clusters"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: "Now" Live Panel & Area Preview */}
          <div className="xl:col-span-4 2xl:col-span-3 space-y-6">
            {/* "Now" Live Panel */}
            <div className="bhumidorpon-card p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-loss opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-loss"></span>
                  </span>
                  <h2 className="text-sm font-semibold text-ink">
                    {isBn ? "বর্তমান পরিস্থিতি (লাইভ অবস্থা)" : "Now (Live Status)"}
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-pill bg-accent-soft text-accent-deep text-[10px] font-bold">
                  {isBn ? "সক্রিয়" : "ACTIVE"}
                </span>
              </div>

              {/* Big KPI: Affected Owners */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted">
                  {isBn ? "ক্ষতিগ্রস্ত জমির মালিক" : "Affected Landowners"}
                </span>
                <div className="text-3xl font-display font-bold text-ink tabular-nums">
                  {formatNumberLocalized(summary?.affectedOwnersCount || 1420, language)}
                  <span className="text-sm font-normal text-muted ml-1.5">{isBn ? "পরিবার" : "families"}</span>
                </div>
                <p className="text-[11px] text-secondary">
                  {isBn
                    ? "ক্যাডাস্ট্রাল দাগের দলিল ও মালিকানা খতিয়ানের সমন্বয়ে যাচাইকৃত"
                    : "Cross-referenced cadastral plot deeds and ownership khatians"}
                </p>
              </div>

              {/* Live Indicators */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-loss" />
                    <div>
                      <div className="text-xs font-medium text-ink">
                        {isBn ? "সক্রিয় ভাঙন পয়েন্ট" : "Active Erosion Points"}
                      </div>
                      <div className="text-[10px] text-muted">
                        {isBn ? "এসএআর রাডার দ্বারা চিহ্নিত" : "Detected via SAR radar"}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-ink tabular-nums">
                    {formatNumberLocalized(summary?.nowLiveStats?.activeErosionPoints || 18, language)} {isBn ? "টি পয়েন্ট" : "pts"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-water" />
                    <div>
                      <div className="text-xs font-medium text-ink">
                        {isBn ? "নজরদারিকৃত মৌজা" : "Monitored Mouzas"}
                      </div>
                      <div className="text-[10px] text-muted">
                        {isBn ? "ডিজিটাল ক্যাডাস্ট্রাল জিআইএস" : "Digital cadastral GIS"}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-ink tabular-nums">
                    {formatNumberLocalized(summary?.nowLiveStats?.sensorLiveMouzas || 94, language)} {isBn ? "টি মৌজা" : "mouzas"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-warn" />
                    <div>
                      <div className="text-xs font-medium text-ink">
                        {isBn ? "সর্বোচ্চ ঝুঁকিপূর্ণ এলাকা" : "Highest Vulnerability"}
                      </div>
                      <div className="text-[10px] text-muted">
                        {isBn ? "কাজীপুর, সিরাজগঞ্জ" : "Kazipur, Sirajganj"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-loss">
                    {isBn ? "জরুরি ঝুঁকি" : "Critical"}
                  </span>
                </div>
              </div>

              {/* Emergency Alert Pill */}
              <div className="p-3 rounded-lg bg-loss-soft border border-loss/20 text-loss text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    {formatNumberLocalized(summary?.nowLiveStats?.criticalAlertsCount || 4, language)} {isBn ? "টি মৌজায় বাঁধ ভাঙনের তাৎক্ষণিক ঝুঁকি বিদ্যমান" : "mouzas show imminent embankment breach risk"}
                  </span>
                </div>
              </div>
            </div>

            {/* Small Map Preview Card */}
            <div className="bhumidorpon-card overflow-hidden">
              <div className="relative h-44 bg-[#EEF0E6] overflow-hidden">
                <DashboardMapPreview />

                <div className="absolute top-3 left-3 z-1000 px-2 py-1 rounded-md bg-surface/90 backdrop-blur-sm border border-border text-[11px] font-semibold text-ink flex items-center gap-1.5 shadow-xs">
                  <MapPin className="w-3 h-3 text-loss" />
                  <span>{isBn ? "মেঘাই মৌজা (কাজীপুর, সিরাজগঞ্জ)" : "Meghai Mouza (Kazipur, Sirajganj)"}</span>
                </div>

                <div className="absolute bottom-3 right-3 z-1000 px-2 py-0.5 rounded-full bg-ink/80 text-surface text-[10px] font-medium pointer-events-none">
                  Leaflet Preview
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">
                    {isBn ? "সর্বাধিক ক্ষতিগ্রস্ত ক্লাস্টার" : "Most Impacted Cluster"}
                  </span>
                  <span className="text-muted tabular-nums font-medium">
                    {isBn ? "যমুনা নদী" : "Jamuna River"}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  {isBn
                    ? "মেঘাই ও নাটুয়ারপাড়া নদী তীরবর্তী সেক্টরের ক্যাডাস্ট্রাল দাগ ও স্যাটেলাইট ওভারলে।"
                    : "Cadastral plot and satellite overlay for Meghai and Natuarpara riverside sectors."}
                </p>
                <Link
                  href="/river-erosion/recorded"
                  className="btn-lime w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{t("viewOnMap", language)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Five Module Cards */}
        <div id="disaster-options" className="space-y-4 pt-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                {t("hazardModules", language)}
              </h2>
              <p className="text-xs text-muted">
                {t("hazardModulesSubtitle", language)}
              </p>
            </div>
            <span className="text-xs text-muted">
              {isBn ? "৫টি সক্রিয় মডিউল" : "5 Active Modules"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {MODULE_CARDS.map((mod) => {
              const Icon = mod.icon;
              const displayLoss = isForecast
                ? mod.forecastLossDecimal
                : mod.lossDecimal;

              return (
                <div
                  key={mod.id}
                  className="bhumidorpon-card p-5 flex flex-col justify-between hover:border-ink/20 transition-all hover:-translate-y-0.5 duration-200 group"
                >
                  <div className="space-y-3">
                    {/* Top Icon and Cycle badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-2xl ${mod.bgSoft} ${mod.accentColor} flex items-center justify-center shadow-xs`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-alt text-muted">
                        {isBn ? mod.updateCycleBn : mod.updateCycleEn}
                      </span>
                    </div>

                    {/* Name & Subtitle */}
                    <div>
                      <h3 className="text-sm font-semibold text-ink group-hover:text-accent-deep transition-colors">
                        {isBn ? mod.nameBn : mod.nameEn}
                      </h3>
                      <div className="text-[11px] text-muted">
                        {isBn ? mod.sublabelBn : mod.sublabelEn}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                      {isBn ? mod.descriptionBn : mod.descriptionEn}
                    </p>

                    {/* Metric */}
                    <div className="p-2.5 rounded-xl bg-surface-alt space-y-0.5">
                      <div className="text-[10px] text-muted flex items-center justify-between">
                        <span>{isForecast ? (isBn ? "প্রত্যাশিত ক্ষয়" : "Projected Loss") : (isBn ? "রেকর্ডকৃত ক্ষয়" : "Recorded Loss")}</span>
                        <span className="text-[9px] text-muted">{isBn ? mod.lastUpdatedBn : mod.lastUpdatedEn}</span>
                      </div>
                      <div className="text-sm font-bold text-ink tabular-nums">
                        {formatArea(displayLoss, unit, language)}
                      </div>
                    </div>
                  </div>

                  {/* Lime CTA Button */}
                  <div className="pt-4">
                    <Link
                      href={mod.href}
                      className="btn-lime w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>{t("explore", language)}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
