"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Landmark,
  Layers,
  MapPin,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { SegmentedToggle } from "@/components/SegmentedToggle";
import { SelectorChain } from "@/components/SelectorChain";
import { SelectionState, StepKey } from "@/lib/useSelection";
import { EmptyState } from "@/components/EmptyState";
import { ForecastBadge } from "@/components/ForecastBadge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { OwnerTable } from "@/components/OwnerTable";
import { MapCompare } from "@/components/MapCompare";
import { TrendChart } from "@/components/TrendChart";
import { BarChart } from "@/components/BarChart";
import { RankedList } from "@/components/RankedList";

import { useAppStore } from "@/stores/appStore";
import { formatArea, formatCurrencyBDT } from "@/lib/units";
import {
  getDashboardSummary,
  getDistricts,
  getUpazilas,
  getRivers,
  getMouzas,
  getOwners,
} from "@/lib/data";
import {
  District,
  Upazila,
  River,
  Mouza,
  OwnerRecord,
  DashboardSummary,
  DataMode,
  CompensationStatus,
} from "@/lib/types";

export default function ComponentsShowcasePage() {
  const { unit } = useAppStore();

  // Mode Toggle (Recorded vs Forecast)
  const [demoMode, setDemoMode] = useState<DataMode>("recorded");

  // Data states loaded via lib/data.ts
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [rivers, setRivers] = useState<River[]>([]);
  const [mouzas, setMouzas] = useState<Mouza[]>([]);
  const [owners, setOwners] = useState<OwnerRecord[]>([]);

  // Interactive SelectorChain test states
  const [chainSelection, setChainSelection] = useState<SelectionState>({
    d: "sirajganj",
    u: "kazipur",
    r: "jamuna",
    h: null,
    m: "mouza_kazipur_1",
    year: null,
    ev: null,
  });

  // Selected plot for table / map synchronization
  const [focusedPlotNo, setFocusedPlotNo] = useState<string | null>("104");

  // Load initial demo data through typed data layer
  useEffect(() => {
    async function loadData() {
      const [sum, distList, upList, rivList, mouzList, ownList] =
        await Promise.all([
          getDashboardSummary(demoMode),
          getDistricts(),
          getUpazilas("sirajganj"),
          getRivers("kazipur"),
          getMouzas("kazipur", "jamuna"),
          getOwners(),
        ]);

      setSummary(sum);
      setDistricts(distList);
      setUpazilas(upList);
      setRivers(rivList);
      setMouzas(mouzList);
      setOwners(ownList);
    }
    loadData();
  }, [demoMode]);

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* Top App Header with Page Title & Unit Controls */}
      <AppHeader
        title="Design System & Component Library"
        subtitle="Reusable components adhering to the BhumiDorpon minimalistic light mode specification"
      >
        {/* Interactive Mode Switcher */}
        <SegmentedToggle<DataMode>
          options={[
            { id: "recorded", label: "Recorded Data" },
            {
              id: "forecast",
              label: "Forecast Model",
              badge: <Sparkles className="w-3.5 h-3.5 text-[#6A5BD6]" />,
            },
          ]}
          value={demoMode}
          onChange={(newMode) => setDemoMode(newMode)}
          size="sm"
          variant="lime"
        />
      </AppHeader>

      {/* Main Page Showcase Body */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-8 space-y-12">
        {/* ================= SECTION 1: BADGES & CHIPS ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                1. Badges, Chips & Status Indicators
              </h2>
              <p className="text-xs text-muted">
                Dashed forecast badge with disclaimer, confidence meter, and compensation status tags.
              </p>
            </div>
          </div>

          <div className="bhumidorpon-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Forecast Badge Variations */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Forecast Badge (Model Estimate)
              </span>
              <div className="space-y-2">
                <ForecastBadge size="md" showDisclaimerNote={true} />
                <div className="pt-2">
                  <ForecastBadge size="sm" />
                </div>
              </div>
            </div>

            {/* Confidence Badge Variations */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Confidence Badges
              </span>
              <div className="flex flex-col gap-2.5 items-start">
                <ConfidenceBadge level="High" scorePercent={88} />
                <ConfidenceBadge level="Medium" scorePercent={64} />
                <ConfidenceBadge level="Low" scorePercent={35} />
              </div>
            </div>

            {/* Compensation Status Badges */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
                Compensation Status Badges
              </span>
              <div className="flex flex-wrap gap-2">
                {(["paid", "approved", "pending", "not_applied", "not_applicable"] as CompensationStatus[]).map(
                  (status) => (
                    <StatusBadge key={status} status={status} />
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: STAT CARDS (KPIs) ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                2. StatCards (KPI Numbers & Delta Pills)
              </h2>
              <p className="text-xs text-muted">
                Large 32-36px tabular numbers, generous whitespace, coral loss, green gain, and live unit conversion.
              </p>
            </div>
            <span className="text-xs font-mono text-muted bg-surface-alt px-2.5 py-1 rounded-pill border border-border">
              Active Unit: {unit}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Land Loss"
              value={formatArea(summary?.totalLossDecimal ?? 18450.4, unit, { includeUnit: false })}
              unitLabel={unit}
              changePercent={14.2}
              changeDirection="up"
              changeIsGain={false} // Loss increased = bad (coral)
              subtext="vs previous cycle"
              icon={<TrendingDown className="w-4 h-4 text-loss" />}
            />

            <StatCard
              label="New Accretion / Char Gain"
              value={formatArea(summary?.totalGainDecimal ?? 6240.2, unit, { includeUnit: false })}
              unitLabel={unit}
              changePercent={8.6}
              changeDirection="up"
              changeIsGain={true} // Gain increased = good (green)
              subtext="Silt deposition"
              icon={<TrendingUp className="w-4 h-4 text-gain" />}
            />

            <StatCard
              label="Affected Land Owners"
              value={new Intl.NumberFormat("en-US").format(summary?.affectedOwnersCount ?? 1420)}
              unitLabel="Households"
              changePercent={-2.1}
              changeDirection="down"
              changeIsGain={true}
              subtext="Registered claimants"
              icon={<Landmark className="w-4 h-4 text-ink-2" />}
            />

            <StatCard
              label="Estimated Compensation"
              value={formatCurrencyBDT(summary?.totalCompensationBDT ?? 245000000, { compact: true })}
              unitLabel="BDT"
              subtext={demoMode === "forecast" ? "Model projected estimate" : "Paid: ৳11.2 Cr (45.7%)"}
              badge={demoMode === "forecast" ? <ForecastBadge size="sm" /> : undefined}
              icon={<SlidersHorizontal className="w-4 h-4 text-ink-2" />}
            />
          </div>
        </section>

        {/* ================= SECTION 3: SELECTOR CHAIN ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                3. SelectorChain (Cascading Searchable Dropdowns)
              </h2>
              <p className="text-xs text-muted">
                Config-driven numbered steps (1 District › 2 Upazila › 3 River › 4 Mouza). Subordinate steps disabled until previous is chosen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setChainSelection({
                  d: "sirajganj",
                  u: "kazipur",
                  r: "jamuna",
                  h: null,
                  m: "mouza_kazipur_1",
                  year: null,
                  ev: null,
                });
              }}
              className="text-xs font-semibold text-accent-deep hover:underline inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Hierarchy</span>
            </button>
          </div>

          <SelectorChain
            hazard="river_erosion"
            mode={demoMode}
            selection={chainSelection}
            onSelectStep={(stepKey, val) => {
              setChainSelection((prev) => ({ ...prev, [stepKey]: val }));
            }}
            onReset={() => {
              setChainSelection({
                d: "sirajganj",
                u: "kazipur",
                r: "jamuna",
                h: null,
                m: "mouza_kazipur_1",
                year: null,
                ev: null,
              });
            }}
          />

          {/* Selection state summary */}
          <div className="p-3 bg-surface rounded-xl border border-border text-xs flex flex-wrap items-center gap-4 text-muted">
            <span className="font-semibold text-ink">Current Selection:</span>
            <span>District: <strong className="text-ink">{chainSelection.d ?? "None"}</strong></span>
            <span>Upazila: <strong className="text-ink">{chainSelection.u ?? "None"}</strong></span>
            <span>River: <strong className="text-ink">{chainSelection.r ?? "None"}</strong></span>
            <span>Mouza: <strong className="text-ink">{chainSelection.m ?? "None"}</strong></span>
          </div>
        </section>

        {/* ================= SECTION 4: MAP COMPARE ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                4. MapCompare (Side-by-Side Dual Maps with Synchronized Zoom & Basemap Switcher)
              </h2>
              <p className="text-xs text-muted">
                Synchronized dual maps with independent zoom controls (+ / -) and basemap switcher (Light GIS, Satellite, Street).
              </p>
            </div>
          </div>

          <MapCompare
            beforeYear={2019}
            afterYear={demoMode === "forecast" ? 2025 : 2024}
            isForecast={demoMode === "forecast"}
            selectedPlotNo={focusedPlotNo}
            onSelectPlot={(p) => setFocusedPlotNo(p)}
          />
        </section>

        {/* ================= SECTION 5: CHARTS & RANKED LIST ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                5. Charts & Ranked List
              </h2>
              <p className="text-xs text-muted">
                Trend line chart with dark tooltip pill, hazard breakdown bar chart, and ranked district table with arrows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Trend Chart (8 Cols) */}
            <div className="lg:col-span-8">
              <TrendChart
                data={summary?.trendSeries ?? []}
                title={demoMode === "forecast" ? "Recorded & Forecast Land Loss Trend" : "Annual Land Erosion vs Accretion"}
                isForecast={demoMode === "forecast"}
                height={340}
              />
            </div>

            {/* Ranked Districts (4 Cols) */}
            <div className="lg:col-span-4">
              <RankedList
                items={summary?.topDistricts ?? []}
                title="Top Impacted Districts"
                subtitle="Ranked by total net land loss"
              />
            </div>

            {/* Bar Chart (12 Cols) */}
            <div className="lg:col-span-12">
              <BarChart
                data={summary?.hazardBreakdown ?? []}
                title="Hazard-Wise Land Dynamics"
                height={300}
              />
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: OWNER TABLE ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                6. OwnerTable (Search, Sort, CSV Export, Khas Land Row Style)
              </h2>
              <p className="text-xs text-muted">
                Cadastral parcel owners, plot & khatian numbers, compensation amounts in ৳ (BDT), and distinct row styling for unowned government land.
              </p>
            </div>
            {focusedPlotNo && (
              <span className="text-xs bg-accent-soft px-3 py-1 rounded-pill text-ink font-semibold">
                Focused Plot: {focusedPlotNo}
              </span>
            )}
          </div>

          <OwnerTable
            variant={demoMode === "forecast" ? "forecast" : "recorded"}
            owners={owners}
            selectedPlotNo={focusedPlotNo}
            onSelectPlot={(p) => setFocusedPlotNo(p)}
          />
        </section>

        {/* ================= SECTION 7: EMPTY STATES ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-ink">
                7. EmptyStates (Domain-Specific Contexts)
              </h2>
              <p className="text-xs text-muted">
                Line icon, concise message, explanation, and interactive reset button.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EmptyState
              hazard="river_erosion"
              title="No river erosion recorded"
              description="No active bank erosion or cadastral plot losses have been recorded in this mouza."
              actionLabel="Select another upazila"
              onAction={() => alert("Action triggered: Reset selector")}
            />

            <EmptyState
              hazard="landslide"
              title="No landslide risk projected"
              description="Slope stability sensors indicate normal soil cohesion in this hill corridor."
              actionLabel="View high-risk hills"
              onAction={() => alert("Action triggered: Switch hill")}
            />

            <EmptyState
              hazard="char"
              title="No active chars found"
              description="This river section contains no emerging or stable char formations in satellite imagery."
              actionLabel="Explore Jamuna pilot"
              onAction={() => alert("Action triggered: Switch river")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
