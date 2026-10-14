"use client";

import React from "react";
import Link from "next/link";
import {
  Mountain,
  ArrowRight,
  Database,
  Sparkles,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ForecastBadge } from "@/components/ForecastBadge";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";

export default function LandslideLandingPage() {
  const { unit } = useAppStore();

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title="Landslide Hazards"
        subtitle="Hilly slope stability, mass wasting records, and monsoonal rainfall threshold modeling"
      />

      <div className="px-4 sm:px-8 py-6 space-y-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb & Meta strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-2 border-b border-border">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">Landslide Hazards</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>Last updated: June 2024</span>
            </span>
            <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
              Update cycle: Event-based
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bhumidorpon-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-surface to-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-xs">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink">
                Slope Failure Records & Susceptibility Projections
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                Digital Elevation Models (DEM), slope gradient analysis, and precipitation saturation tracking
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            Extreme monsoon downpours and hill-cutting in the Chittagong Hill Tracts trigger catastrophic slope failures and debris flows. BhumiDorpon utilizes interferometric synthetic aperture radar (InSAR), high-resolution elevation models, and soil saturation indices to document past landslides and project high-risk hill slopes for upcoming monsoons.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Recorded Land Loss</div>
              <div className="text-lg font-bold text-[#D97706] tabular-nums mt-0.5">
                {formatArea(1620, unit)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Projected High-Risk Area</div>
              <div className="text-lg font-bold text-predicted tabular-nums mt-0.5">
                {formatArea(2100, unit)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Critical Slope Angle</div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                38° – 44°
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Pilot Cluster</div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                Kawkhali & Rangamati
              </div>
            </div>
          </div>
        </div>

        {/* Option A & Option B */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">
            Choose Analysis Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OPTION A */}
            <div className="bhumidorpon-card p-6 sm:p-7 flex flex-col justify-between hover:border-ink/20 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt text-ink flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <span className="px-2.5 py-1 rounded-pill bg-gain-soft text-gain text-xs font-semibold">
                    Historical Events
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink">
                    A. Recorded Data
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Verified records of past mass-movement events, displaced soil volume, and impacted homestead deeds.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    <span>Displaced debris volume (m³) and slope gradient</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain" />
                    <span>Impacted homesteads and rehabilitation compensation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>Pre- and post-event satellite slope comparison</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/landslide/recorded"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>Explore Recorded Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* OPTION B */}
            <div className="bhumidorpon-card p-6 sm:p-7 flex flex-col justify-between border-predicted/30 hover:border-predicted transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-predicted-soft/50 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-predicted-soft text-predicted flex items-center justify-center font-bold text-sm">
                    B
                  </div>
                  <ForecastBadge label="Deep Learning Model" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <span>B. Forecast (Deep Learning)</span>
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Spatial susceptibility forecasting driven by rainfall thresholds, geotechnical shear, and topographic wetness.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-predicted-soft/80 border border-predicted/20 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-predicted text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Honesty Note:</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    This is a model-based estimate, not an official government record. Heavy unseasonal downpours or seismic events can destabilize slopes rapidly.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-predicted" />
                    <span>Early warning buffer for settlements downslope</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warn" />
                    <span>Projected soil displacement and evacuation priorities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>Dashed hazard zone mapping</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/landslide/forecast"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Forecast Model</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
