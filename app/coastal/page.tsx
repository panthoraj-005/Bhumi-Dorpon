"use client";

import React from "react";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Database,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  ChevronRight,
  AlertCircle,
  Compass,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ForecastBadge } from "@/components/ForecastBadge";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";

export default function CoastalLandingPage() {
  const { unit } = useAppStore();

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title="Coastal Shoreline & Accretion"
        subtitle="Bhola, Monpura, and Meghna estuary tidal shoreline migration, erosion, and newly emerged unassigned land"
      />

      <div className="px-4 sm:px-8 py-6 space-y-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb & Meta strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-2 border-b border-border">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">Coastal Shoreline & Accretion</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>Last updated: December 2024</span>
            </span>
            <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
              Update cycle: Annual
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bhumidorpon-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-surface to-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gain-soft text-gain flex items-center justify-center shadow-xs">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink">
                Shoreline Migration & Unassigned Mudflats
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                Tidal shoreline tracking, estuarine satellite albums, and virtual cadastral accretion blocks
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            In the Meghna estuary and southern Bay of Bengal coastline, high tidal energy causes severe outer bank erosion while simultaneously depositing hundreds of acres of intertidal mudflats seaward. These newly emerged areas often fall outside traditional mouza boundaries. BhumiDorpon documents both loss and unassigned accretion land for state cadastral recordkeeping.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Recorded Accretion Land</div>
              <div className="text-lg font-bold text-gain tabular-nums mt-0.5">
                {formatArea(380, unit)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Coastal Shoreline Loss</div>
              <div className="text-lg font-bold text-loss tabular-nums mt-0.5">
                {formatArea(512, unit)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Unassigned Mudflats</div>
              <div className="text-lg font-bold text-accent-deep tabular-nums mt-0.5">
                {formatArea(240, unit)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">Mean Salinity Index</div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                12.4 dS/m
              </div>
            </div>
          </div>
        </div>

        {/* Option A & Option B */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">
            Select Exploration Mode
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
                    Current Records
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink">
                    A. Recorded Data (Historical Shoreline)
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    Bhola, Monpura, and Char Fasson shoreline erosion alongside newly emerged unassigned mudflat parcels.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-loss" />
                    <span>West bank erosion plot compensation and loss registers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain" />
                    <span>Seaward accretion and virtual unassigned mouza blocks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-water" />
                    <span>Tidal amplitude and estuarine salinity tracking</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/coastal/recorded"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>View Recorded Shoreline</span>
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
                    Sea-level dynamics, tidal shear, and estuarine sedimentation models projecting 1-year coastal shoreline change.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-predicted-soft/80 border border-predicted/20 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-predicted text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Scientific Disclaimer:</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    This is a model-based estimate, not an official government record. Storm surges and cyclone events can shift mudflats unpredictably.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-predicted" />
                    <span>Projected seaward mudflat expansion and accretion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-loss" />
                    <span>Vulnerable coastal embankment and mangrove margins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>Dashed line projections of expected 1-year shoreline</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/coastal/forecast"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Forecast Shoreline</span>
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
