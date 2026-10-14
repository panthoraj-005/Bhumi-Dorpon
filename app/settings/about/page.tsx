"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Info,
  Waves,
  CloudRain,
  Mountain,
  Compass,
  Anchor,
  Layers,
  Map,
  Sliders,
  LayoutGrid,
  Calendar,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export default function AboutProjectPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <AppHeader
        title="About Project"
        subtitle="BhumiDorpon platform purpose, hazard modules, and verified features"
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb / Return to Settings */}
        <div className="flex items-center justify-between">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-surface border border-border hover:border-ink/30 text-ink text-xs sm:text-sm font-medium transition-all shadow-subtle group"
          >
            <ArrowLeft className="w-4 h-4 text-muted group-hover:text-ink group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Settings</span>
          </Link>
          <span className="text-xs text-muted font-medium">
            Settings / About Project
          </span>
        </div>

        {/* 1. Project Overview */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Project Overview
              </h2>
              <span className="text-xs text-muted">Core Mission & Scope</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
            <strong className="text-ink font-semibold">BhumiDorpon</strong> is a land-change and natural-hazard visualization demo focused on viewing and comparing areas affected by natural hazards across Bangladesh. The platform brings together parcel-level cadastral boundaries, historical land loss/gain records, and predictive modeling in an interactive visual interface.
          </p>
        </section>

        {/* 2. Hazard Modules */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Hazard Modules
              </h2>
              <span className="text-xs text-muted">Five Covered Natural Hazards</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* River Erosion */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-water flex items-center justify-center shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">River Erosion</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  Active riverbank migration, boundary retreat, and cadastral plot loss along major river systems such as the Jamuna, Padma, and Meghna.
                </p>
              </div>
            </div>

            {/* Flood */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-water flex items-center justify-center shrink-0">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Flood</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  Mouza-level inundation monitoring, flood progression events, affected land parcel tracking, water depth classification, and owner compensation impact.
                </p>
              </div>
            </div>

            {/* Landslide */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-loss flex items-center justify-center shrink-0">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Landslide</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  Hilly terrain hazard zones, elevation profiles, slope analysis, contours, and spot heights in southeastern Bangladesh (e.g., Bandarban, Rangamati).
                </p>
              </div>
            </div>

            {/* Char Formation and Erosion */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-gain flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Char Formation and Erosion</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  Dynamic sandbar island accretion, new land emergence, erosion patterns, and temporal vegetation dynamics in active riverbeds.
                </p>
              </div>
            </div>

            {/* Coastal Erosion and Land Formation */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5 md:col-span-2">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-accent-deep flex items-center justify-center shrink-0">
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Coastal Erosion and Land Formation</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  Marine coastline retreat, tidal surge exposure, deltaic sediment accumulation, and coastal embankment shifts across the Bay of Bengal coastline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Map Comparison */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Map Comparison
              </h2>
              <span className="text-xs text-muted">Side-by-Side Visual Verification</span>
            </div>
          </div>
          <p className="text-sm text-ink-2 leading-relaxed">
            Before and After maps are displayed side by side on desktop layouts for direct visual comparison of territorial changes over time. Users can simultaneously observe baseline land status against post-hazard or projected changes for the exact same geographic extent. On mobile viewports, the layout responsively stacks the Before map first and After map second while preserving identical controls.
          </p>
        </section>

        {/* 4. Map Controls and Basemaps */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Map Controls and Basemaps
              </h2>
              <span className="text-xs text-muted">Cartographic Engine & Synchronization</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <p>
              The map interface incorporates dual basemap choices to inspect hazard phenomena across distinct cartographic representations:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                <strong className="text-ink">Light GIS Basemap:</strong> Clean, high-legibility vector rendering prioritizing parcel outlines, administrative mouza borders, and thematic hazard zones.
              </li>
              <li>
                <strong className="text-ink">Satellite Basemap:</strong> High-resolution aerial and satellite imagery allowing real terrain visualization behind cadastral boundaries.
              </li>
              <li>
                <strong className="text-ink">Geographic Synchronization:</strong> Interactive zoom and pan controls operate in real-time synchronicity; moving or zooming either comparison map automatically updates the paired map.
              </li>
              <li>
                <strong className="text-ink">Direct Controls:</strong> Immediate single-click zoom-in (<code className="text-xs bg-surface-alt px-1.5 py-0.5 rounded border border-border">+</code>) and zoom-out (<code className="text-xs bg-surface-alt px-1.5 py-0.5 rounded border border-border">−</code>) controls with auto-fit viewport bounds.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Map Layers and Information */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Map Layers and Information
              </h2>
              <span className="text-xs text-muted">Overlays, Legends, and Cadastral Data</span>
            </div>
          </div>
          <p className="text-sm text-ink-2 leading-relaxed">
            Every map view integrates thematic hazard overlays, color-coded status badges, interactive legends, and cadastral parcel data. Individual land plots feature verified Dag No. and Khatian No. identifiers, owner names, land classifications, and area calculations. Context panels below the maps display mouza-wise summaries, affected owner registries, and compensation breakdowns.
          </p>
        </section>

        {/* 6. Dashboard and Other Pages */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Dashboard and Other Pages
              </h2>
              <span className="text-xs text-muted">Application Navigation & Views</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <p>
              In addition to the hazard comparison modules, the application includes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                <strong className="text-ink">Home Dashboard:</strong> Comprehensive national overview presenting aggregated land loss/gain statistics, affected owner totals, compensation summaries, multi-year trend charts, and distribution rankings.
              </li>
              <li>
                <strong className="text-ink">Owner Map & Detail Page:</strong> Cadastral landowner portfolio page detailing individual parcel polygons, verified four-corner boundary coordinates (NW, NE, SE, SW), flooded areas, and compensation payment statuses.
              </li>
              <li>
                <strong className="text-ink">Component Showcase:</strong> A developer reference catalog at <code className="text-xs bg-surface-alt px-1.5 py-0.5 rounded border border-border">/dev/components</code> illustrating all UI components, badges, charts, and toggle states.
              </li>
            </ul>
          </div>
        </section>

        {/* 7. Recorded and Forecast */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Recorded and Forecast
              </h2>
              <span className="text-xs text-muted">Dual Analysis Modes</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <p>
              The platform clearly differentiates between historical records and forward-looking projections:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                <strong className="text-ink">Recorded View:</strong> Represents historical and observed land changes based on documented ground events and cadastral surveys. Includes actual compensation disbursement records (Paid, Approved, Pending).
              </li>
              <li>
                <strong className="text-ink">Forecast View:</strong> Represents modeled projections predicting potential future hazard exposure and land vulnerability over a one-year horizon. Forecast views display only projected budget amounts and strictly exclude disbursed or paid compensation figures.
              </li>
            </ul>
          </div>
        </section>

        {/* 8. Data Transparency */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border-2 border-warn/30 bg-warn-soft/20 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warn-soft text-warn flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                Data Transparency
              </h2>
              <span className="text-xs text-muted">Demonstration Data Disclosures</span>
            </div>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-ink-2 leading-relaxed">
            <p>
              <strong className="text-ink font-semibold">Important Limitation Notice:</strong> BhumiDorpon currently operates as a technology and user-experience demonstration. All geographic polygons, cadastral plot numbers, flood depths, erosion rates, landowner profiles, and financial values are generated from <strong className="text-ink">mock and synthetic demo datasets</strong>.
            </p>
            <p>
              This demo does not connect to live government land registry systems or real-time environmental sensors. It does not provide live monitoring, real-time predictions, operational early warning alerts, field-verified engineering measurements, or legally certified land survey records.
            </p>
          </div>
        </section>

        {/* Bottom Return Button */}
        <div className="pt-4 flex justify-center">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-accent text-accent-ink hover:bg-[#BBE825] font-semibold text-sm transition-all shadow-subtle group"
          >
            <ArrowLeft className="w-4 h-4 text-accent-ink group-hover:-translate-x-1 transition-transform" />
            <span>Return to Settings</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
