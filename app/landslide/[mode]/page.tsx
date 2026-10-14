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

  const { unit } = useAppStore();

  // 1. URL is single source of truth via useSelection
  const {
    selection,
    d,
    u,
    h,
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

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title="Landslide Hazards & Slope Stability"
        subtitle={
          isForecast
            ? "Machine learning rainfall threshold & slope rupture susceptibility projection"
            : "Chittagong Hill Tracts monsoonal slope rupture records and affected cadastral homesteads"
        }
      >
        <div className="inline-flex items-center">
          <SegmentedToggle<DataMode>
            options={[
              { id: "recorded", label: "A. Recorded Data" },
              { id: "forecast", label: "B. Forecast (DL)" },
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
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/landslide" className="hover:text-ink transition-colors">
              Landslide
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {isForecast ? "Forecast Mode" : "Recorded Mode"}
            </span>
            {result && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-accent-deep font-semibold">
                  {result.title}
                </span>
              </>
            )}
          </nav>

          {isForecast && <ForecastBadge label="InSAR & Slope Model" />}
        </div>

        {/* REBUILD SELECTOR CHAIN */}
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
                ? "No landslide hazard is projected for this slope."
                : "No historical landslide recorded on this slope."
            }
            description="The selected feature lies outside high-hazard slope angles (>30°) and colluvial displacement zones."
            actionLabel="Reset to Pilot Cluster"
            onAction={resetToDefault}
          />
        )}

        {!isFinalStepSet && (
          <div className="bhumidorpon-card p-12 text-center space-y-3">
            <Info className="w-8 h-8 text-muted mx-auto" />
            <h3 className="text-sm font-semibold text-ink">Please select a hill feature</h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              Select District, Upazila, and Hill Corridor to view topographic elevation contours and slope failure demarcations.
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
                    {result.locationLabel}
                  </span>
                  {isForecast && (
                    <ConfidenceBadge
                      level={result.confidence?.level || "High"}
                      scorePercent={result.confidence?.scorePercent || 86}
                    />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">
                  {result.title}
                </h2>
                <div className="text-xs text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Event: {result.periodLabel}</span>
                  <span>•</span>
                  <span>Displacement Rate: {formatArea(result.annualRateDecimal, unit)}/yr</span>
                </div>
              </div>

              {/* Total Loss, Gain, Risk Level */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                <div>
                  <div className="text-[11px] text-muted">Displaced Land</div>
                  <div className="text-xl font-bold text-loss tabular-nums">
                    {formatArea(result.totalLossDecimal, unit)}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">Total Gain</div>
                  <div className="text-xl font-bold text-ink tabular-nums">
                    0 {unit}
                  </div>
                </div>
                <div className="border-l border-border pl-4">
                  <div className="text-[11px] text-muted">Trend</div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-loss capitalize">
                    {result.trendDirection === "increasing" ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>Increasing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LANDSLIDE MAP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    Slope Topography & InSAR Deformation Map
                  </h3>
                  <p className="text-xs text-muted">
                    Topographic elevation contours, failure scarp, debris runout zone, and settlement risk buffers
                  </p>
                </div>
                <div className="text-xs text-muted">
                  {isForecast ? "Projected Slope Stability Envelope" : "Surveyed Slope Rupture"}
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
                <span className="text-xs font-medium text-muted">Slope Gradient</span>
                <div className="text-xl font-bold text-amber-600 tabular-nums">
                  42° Angle
                </div>
                <div className="text-[11px] text-secondary">High risk monsoonal threshold</div>
              </div>

              <div className="bhumidorpon-card p-4 space-y-1">
                <span className="text-xs font-medium text-muted">Homesteads Inside Buffer</span>
                <div className="text-xl font-bold text-ink tabular-nums">
                  {result.owners.length} Homesteads
                </div>
                <div className="text-[11px] text-secondary">Within 50m runout zone</div>
              </div>

              {result.metrics.slice(0, 1).map((mItem, idx) => (
                <div key={idx} className="bhumidorpon-card p-4 space-y-1">
                  <span className="text-xs font-medium text-muted">{mItem.label}</span>
                  <div className="text-xl font-bold text-ink tabular-nums">
                    {mItem.value}
                  </div>
                  {mItem.sublabel && (
                    <div className="text-[11px] text-secondary">{mItem.sublabel}</div>
                  )}
                </div>
              ))}
            </div>

            {/* 4. OWNER TABLE (STEP 4) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    Affected Slope Parcels & Homesteads
                  </h3>
                  <p className="text-xs text-muted">
                    Cadastral plots situated within the rupture scarp and 50m downslope settlement risk buffer
                  </p>
                </div>
                <span className="text-xs text-muted tabular-nums">
                  {result.owners.length} registered plots
                </span>
              </div>

              <OwnerTable
                variant={isForecast ? "forecast" : "recorded"}
                owners={result.owners}
                selectedPlotNo={focusedPlotNo}
                onSelectPlot={(dagNo) => setFocusedPlotNo(dagNo)}
              />
            </div>

            {/* 5. FORECAST DISCLAIMER (Rule 7) */}
            {isForecast && (
              <div className="p-4 rounded-card bg-predicted-soft border border-predicted/30 text-xs text-secondary flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-predicted shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-ink font-semibold block">
                    Disclaimer:
                  </strong>
                  <p className="leading-relaxed">
                    This is a model-based estimate, not an official government record.
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
