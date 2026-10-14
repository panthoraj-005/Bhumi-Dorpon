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

const MODULE_CARDS = [
  {
    id: "river_erosion",
    name: "River Erosion",
    sublabel: "Active riverbank migration & boundary retreat",
    href: "/river-erosion",
    icon: Waves,
    accentColor: "text-loss",
    bgSoft: "bg-loss-soft",
    updateCycle: "Annual survey",
    lastUpdated: "October 2024",
    description: "Jamuna, Padma, and Meghna active channel bank retreat across registered cadastral mouzas.",
    lossDecimal: 8420,
    forecastLossDecimal: 11200,
  },
  {
    id: "flood",
    name: "Flood Monitoring",
    sublabel: "Flash flood inundation & silt sedimentation",
    href: "/flood",
    icon: CloudRain,
    accentColor: "text-water",
    bgSoft: "bg-[#E3F2FD]",
    updateCycle: "Event-based",
    lastUpdated: "Monsoon 2024",
    description: "Satellite SAR water extent mapping, topsoil siltation depth, and owner plot boundary recovery.",
    lossDecimal: 4150,
    forecastLossDecimal: 5200,
  },
  {
    id: "landslide",
    name: "Landslide Hazards",
    sublabel: "Hilly slope mass wasting & debris runout",
    href: "/landslide",
    icon: Mountain,
    accentColor: "text-[#D97706]",
    bgSoft: "bg-[#FEF3C7]",
    updateCycle: "Event-based",
    lastUpdated: "June 2024",
    description: "Chittagong Hill Tracts slope angle analysis, soil volume displacement, and settlement risk buffers.",
    lossDecimal: 1620,
    forecastLossDecimal: 2100,
  },
  {
    id: "char",
    name: "Char Islands",
    sublabel: "Braided channel accretion & sandbar consolidation",
    href: "/char",
    icon: Compass,
    accentColor: "text-[#8B5CF6]",
    bgSoft: "bg-[#EDE9FE]",
    updateCycle: "Annual survey",
    lastUpdated: "November 2024",
    description: "Emergent alluvial island stability index, vegetation coverage (NDVI), and state khas land tracking.",
    lossDecimal: 980,
    forecastLossDecimal: 1000,
  },
  {
    id: "coastal",
    name: "Coastal Shifts",
    sublabel: "Estuarine erosion & seaward accretion mudflats",
    href: "/coastal",
    icon: Anchor,
    accentColor: "text-gain",
    bgSoft: "bg-gain-soft",
    updateCycle: "Annual survey",
    lastUpdated: "December 2024",
    description: "Meghna estuary tidal shoreline retreat, salinity progression, and unassigned virtual mouza blocks.",
    lossDecimal: 3280,
    forecastLossDecimal: 3900,
  },
];

export default function HomeDashboardPage() {
  const { unit } = useAppStore();
  const [mode, setMode] = useState<DataMode>("recorded");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        title="National Land Change Overview"
        subtitle="Multi-hazard cadastral mouza records & satellite remote-sensing dashboard"
      >
        {/* Segmented Mode Switcher */}
        <div className="inline-flex items-center">
          <SegmentedToggle<DataMode>
            options={[
              { id: "recorded", label: "Recorded Data" },
              { id: "forecast", label: "Forecast (DL Model)" },
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
              <ForecastBadge label="Deep Learning Model Projection" />
              <span className="font-medium text-secondary">
                This is a model-based estimate, not an official government record.
              </span>
            </div>
            <div className="text-[11px] text-muted whitespace-nowrap">
              Model: GeoAI-BD v2.4 • Multitemporal ConvLSTM
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
                        {isForecast ? "Projected Total Land Loss" : "Total Land Loss"}
                      </span>
                      {isForecast ? (
                        <ForecastBadge />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-loss-soft text-loss text-[11px] font-semibold">
                          <TrendingDown className="w-3 h-3" />
                          <span>Eroded / Inundated</span>
                        </span>
                      )}
                    </div>
                    <div className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink tabular-nums">
                      {formatArea(summary?.totalLossDecimal || 0, unit)}
                    </div>
                    <div className="text-xs text-secondary flex items-center gap-3 pt-0.5">
                      <span>
                        Land Accretion:{" "}
                        <strong className="text-gain font-semibold">
                          {formatArea(summary?.totalGainDecimal || 0, unit)}
                        </strong>
                      </span>
                      <span className="text-border">•</span>
                      <span>
                        Net Balance:{" "}
                        <strong className="text-loss font-semibold">
                          {formatArea(summary?.netChangeDecimal || 0, unit)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Period Filter Chip */}
                  <div className="px-2.5 py-1 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
                    {isForecast ? "2022 – 2027 Projected" : "2019 – 2024 Recorded"}
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
                      {isForecast ? "Projected Compensation" : "Total Estimated Compensation"}
                    </span>
                    <Landmark className="w-4 h-4 text-muted" />
                  </div>

                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-ink tabular-nums">
                      {formatCurrencyBDT(summary?.totalCompensationBDT || 0, { compact: true })}
                    </div>
                    <p className="text-[11px] text-muted mt-0.5">
                      {isForecast
                        ? "Model-estimated budget requirement under land rehabilitation policies"
                        : "Approved government budget and disbursement progress"}
                    </p>
                  </div>

                  {isForecast ? (
                    /* Forecast Mode: ONLY Projected Compensation and projected area metrics (Rule 5) */
                    <div className="mt-6 space-y-4">
                      <div className="p-3.5 rounded-card bg-predicted-soft/60 border border-predicted/20 space-y-2">
                        <div className="text-xs font-semibold text-predicted flex items-center gap-1.5">
                          <ForecastBadge size="sm" />
                          <span>Projected Risk Assessment</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div>
                            <div className="text-[10px] text-muted">Projected Area</div>
                            <div className="font-semibold text-ink tabular-nums">
                              {formatArea(summary?.totalLossDecimal || 0, unit)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted">Estimated Parcels</div>
                            <div className="font-semibold text-ink tabular-nums">
                              {summary?.affectedOwnersCount ? summary.affectedOwnersCount.toLocaleString() : "1,420"} Plots
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted flex items-start gap-1.5 pt-1">
                        <Info className="w-3.5 h-3.5 text-predicted flex-shrink-0 mt-0.5" />
                        <span>Calculated at standard government rehabilitation unit value per decimal of projected land loss. This is a model-based estimate, not an official government record.</span>
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
                            <span>Disbursed (Paid)</span>
                          </span>
                          <span className="tabular-nums font-semibold text-gain">
                            {paidPct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-gain rounded-full transition-all duration-500"
                            style={{ width: `${paidPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted tabular-nums text-right">
                          {formatCurrencyBDT(summary?.paidCompensationBDT || 0, { compact: true })}
                        </div>
                      </div>

                      {/* Approved */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-ink flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-water" />
                            <span>Approved</span>
                          </span>
                          <span className="tabular-nums font-semibold text-water">
                            {approvedPct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-water rounded-full transition-all duration-500"
                            style={{ width: `${approvedPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted tabular-nums text-right">
                          {formatCurrencyBDT(summary?.approvedCompensationBDT || 0, { compact: true })}
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-ink flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-warn" />
                            <span>Pending</span>
                          </span>
                          <span className="tabular-nums font-semibold text-warn">
                            {pendingPct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-warn rounded-full transition-all duration-500"
                            style={{ width: `${pendingPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted tabular-nums text-right">
                          {formatCurrencyBDT(summary?.pendingCompensationBDT || 0, { compact: true })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border mt-4 text-[11px] text-muted">
                  {isForecast
                    ? "* This is a model-based estimate, not an official government record."
                    : "* Verified via District Land Administration Records."}
                </div>
              </div>
            </div>

            {/* ROW 2: Hazard Breakdown Bar Chart (5 cols) + Ranked Districts (7 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Hazard Breakdown: 5 Columns */}
              <div className="md:col-span-5 bhumidorpon-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold text-ink">Hazard Impact Breakdown</h2>
                    <span className="text-[11px] text-muted">By Category</span>
                  </div>
                  <p className="text-xs text-muted mb-4">
                    Comparative distribution of land loss and accretion across hazards
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
                    <span>River Erosion: Highest Loss</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gain" />
                    <span>Coastal & Chars: Accretion</span>
                  </div>
                </div>
              </div>

              {/* Ranked Top Districts: 7 Columns */}
              <div className="md:col-span-7 bhumidorpon-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-semibold text-ink">Top Impacted Districts</h2>
                    <span className="text-[11px] text-muted">Ranked by Loss Area</span>
                  </div>
                  <p className="text-xs text-muted mb-4">
                    Proportion of national land loss and annual rate of change
                  </p>

                  <RankedList items={summary?.topDistricts || []} />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span>Sirajganj and Bhola represent key priority clusters</span>
                  <Link
                    href="/river-erosion"
                    className="text-accent-deep hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Explore Clusters</span>
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
                  <h2 className="text-sm font-semibold text-ink">Now (Live Status)</h2>
                </div>
                <span className="px-2 py-0.5 rounded-pill bg-accent-soft text-accent-deep text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Big KPI: Affected Owners */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted">Affected Landowners</span>
                <div className="text-3xl font-display font-bold text-ink tabular-nums">
                  {new Intl.NumberFormat("en-US").format(summary?.affectedOwnersCount || 1420)}
                  <span className="text-sm font-normal text-muted ml-1.5">families</span>
                </div>
                <p className="text-[11px] text-secondary">
                  Cross-referenced cadastral plot deeds and ownership khatians
                </p>
              </div>

              {/* Live Indicators */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-loss" />
                    <div>
                      <div className="text-xs font-medium text-ink">Active Erosion Points</div>
                      <div className="text-[10px] text-muted">Detected via SAR radar</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-ink tabular-nums">
                    {summary?.nowLiveStats?.activeErosionPoints || 18} pts
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-water" />
                    <div>
                      <div className="text-xs font-medium text-ink">Monitored Mouzas</div>
                      <div className="text-[10px] text-muted">Digital cadastral GIS</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-ink tabular-nums">
                    {summary?.nowLiveStats?.sensorLiveMouzas || 94} mouzas
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-warn" />
                    <div>
                      <div className="text-xs font-medium text-ink">Highest Vulnerability</div>
                      <div className="text-[10px] text-muted">Kazipur, Sirajganj</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-loss">Critical</span>
                </div>
              </div>

              {/* Emergency Alert Pill */}
              <div className="p-3 rounded-lg bg-loss-soft border border-loss/20 text-loss text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    {summary?.nowLiveStats?.criticalAlertsCount || 4} mouzas show imminent embankment breach risk
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
                  <span>Meghai Mouza (Kazipur, Sirajganj)</span>
                </div>

                <div className="absolute bottom-3 right-3 z-1000 px-2 py-0.5 rounded-full bg-ink/80 text-surface text-[10px] font-medium pointer-events-none">
                  Leaflet Preview
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">Most Impacted Cluster</span>
                  <span className="text-muted tabular-nums font-medium">Jamuna River</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Cadastral plot and satellite overlay for Meghai and Natuarpara riverside sectors.
                </p>
                <Link
                  href="/river-erosion/recorded"
                  className="btn-lime w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Five Module Cards */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                Hazard Modules
              </h2>
              <p className="text-xs text-muted">
                Dedicated records, cascading selectors, and before/after comparisons for all 5 hazards
              </p>
            </div>
            <span className="text-xs text-muted">5 Active Modules</span>
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
                        {mod.updateCycle}
                      </span>
                    </div>

                    {/* Name & Subtitle */}
                    <div>
                      <h3 className="text-sm font-semibold text-ink group-hover:text-accent-deep transition-colors">
                        {mod.name}
                      </h3>
                      <div className="text-[11px] text-muted">{mod.sublabel}</div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Metric */}
                    <div className="p-2.5 rounded-xl bg-surface-alt space-y-0.5">
                      <div className="text-[10px] text-muted flex items-center justify-between">
                        <span>{isForecast ? "Projected Loss" : "Recorded Loss"}</span>
                        <span className="text-[9px] text-muted">{mod.lastUpdated}</span>
                      </div>
                      <div className="text-sm font-bold text-ink tabular-nums">
                        {formatArea(displayLoss, unit)}
                      </div>
                    </div>
                  </div>

                  {/* Lime CTA Button */}
                  <div className="pt-4">
                    <Link
                      href={mod.href}
                      className="btn-lime w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Explore</span>
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
