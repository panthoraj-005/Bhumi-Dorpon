"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  CloudRain,
  ChevronRight,
  Calendar,
  Waves,
  Droplets,
  Clock,
  Users,
  Search,
  ArrowLeft,
  Download,
  Check,
  Building2,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { FloodMap } from "@/components/FloodMap";
import { ForecastBadge } from "@/components/ForecastBadge";
import { SegmentedToggle } from "@/components/SegmentedToggle";
import { Skeleton } from "@/components/Skeleton";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { getFlood } from "@/lib/data";
import { FloodEvent, FloodPlotStatus, DataMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FloodEventDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mouzaId = (params?.mouzaId as string) || "";
  const floodId = (params?.floodId as string) || "";
  const modeParam = searchParams?.get("mode");
  const mode: DataMode = modeParam === "forecast" ? "forecast" : "recorded";
  const isForecast = mode === "forecast";

  const { unit } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedDagNo, setFocusedDagNo] = useState<string | null>(null);

  // Load Flood Event Data via TanStack Query
  const {
    data: flood,
    isLoading,
    isError,
    refetch,
  } = useQuery<FloodEvent | null>({
    queryKey: ["floodEventDetail", floodId],
    queryFn: async () => {
      if (!floodId) return null;
      return getFlood(floodId);
    },
    enabled: Boolean(floodId),
  });

  // Filter affected owner plots based on search query
  const filteredPlots = useMemo(() => {
    if (!flood?.plotStatus) return [];
    if (!searchQuery.trim()) return flood.plotStatus;
    const q = searchQuery.trim().toLowerCase();
    return flood.plotStatus.filter(
      (ps) =>
        ps.ownerName.toLowerCase().includes(q) ||
        ps.dagNo.toLowerCase().includes(q) ||
        ps.khatianNo.toLowerCase().includes(q)
    );
  }, [flood, searchQuery]);

  // Export filtered plots as CSV
  const handleExportCSV = () => {
    if (!filteredPlots.length) return;
    const headers = [
      "Owner",
      "Owner ID",
      "Dag No.",
      "Khatian No.",
      "Land Class",
      `Flooded Area (${unit})`,
      "Depth Class",
      "Flood Status",
      "Est. Compensation (BDT)",
    ];
    const rows = filteredPlots.map((ps) => [
      `"${ps.ownerName}"`,
      `"${ps.ownerId}"`,
      `"${ps.dagNo}"`,
      `"${ps.khatianNo}"`,
      `"${ps.landClass}"`,
      formatArea(ps.floodedAreaDecimal, unit),
      `"${ps.depthClass}"`,
      `"${ps.status}"`,
      ps.estCompensationBdt,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flood_${floodId}_affected_owners.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getDepthBadge = (depthClass: string) => {
    switch (depthClass) {
      case "deep":
        return (
          <span className="px-2.5 py-0.5 rounded-pill text-[11px] font-bold bg-[#1E3A8A]/15 text-[#1E3A8A] border border-[#1E3A8A]/30">
            Deep (&gt;1.5m)
          </span>
        );
      case "moderate":
        return (
          <span className="px-2.5 py-0.5 rounded-pill text-[11px] font-bold bg-[#0284C7]/15 text-[#0284C7] border border-[#0284C7]/30">
            Moderate (0.5–1.5m)
          </span>
        );
      case "shallow":
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-pill text-[11px] font-bold bg-[#38BDF8]/15 text-[#0369A1] border border-[#38BDF8]/30">
            Shallow (&lt;0.5m)
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={flood?.mouzaName || "Flood Inundation Detail"}
        subtitle={`Satellite SAR radar peak inundation survey • Event ID: ${floodId}`}
      >
        <Link
          href={`/flood?m=${mouzaId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Floods in Mouza</span>
        </Link>
      </AppHeader>

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-1">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/flood" className="hover:text-ink transition-colors">
              Flood Monitoring
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {flood?.mouzaName || mouzaId}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-water font-semibold">{flood?.date || floodId}</span>
          </nav>

          {flood && (
            <span className="px-2.5 py-0.5 rounded-pill text-xs font-bold bg-water/10 text-water border border-water/20">
              {flood.severity} Severity Flood
            </span>
          )}
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-28 w-full rounded-card" />
            <Skeleton className="h-[460px] w-full rounded-card" />
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="bhumidorpon-card p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-loss-soft text-loss mx-auto flex items-center justify-center font-bold">
              !
            </div>
            <h3 className="font-semibold text-base text-ink">Failed to load flood event</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Could not load the flood survey record for ID: {floodId}.
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

        {/* CONTENT */}
        {!isLoading && !isError && flood && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. SUMMARY STRIP */}
            <div className="bhumidorpon-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface to-[#E0F2FE]/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">
                    Mouza JL No. • Cadastral Survey Inundation
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-pill text-[10px] font-bold border",
                      flood.severity === "Catastrophic" || flood.severity === "Extreme"
                        ? "bg-loss-soft text-loss border-loss/20"
                        : flood.severity === "Severe"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {flood.severity}
                  </span>
                  {isForecast && <ForecastBadge />}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">
                  {flood.mouzaName} {isForecast ? "Flood Inundation Projection" : "Flood Assessment"}
                </h2>
                <div className="text-xs text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-water" />
                  <span>Event Date: {flood.date}</span>
                  <span>•</span>
                  <span>Year: {flood.year}</span>
                </div>
              </div>

              {/* Flooded Area, Max Depth, Duration, Mode Switcher */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[11px] text-muted">{isForecast ? "Projected Area" : "Flooded Area"}</div>
                    <div className="text-xl font-bold text-water tabular-nums">
                      {formatArea(flood.floodedAreaDecimal, unit)}
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[11px] text-muted">Max Depth</div>
                    <div className="text-xl font-bold text-ink tabular-nums">
                      {flood.maxDepthM} m
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[11px] text-muted">Duration</div>
                    <div className="text-xl font-bold text-ink tabular-nums">
                      {flood.durationDays} Days
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <div className="text-[11px] text-muted">Parcels</div>
                    <div className="text-xl font-bold text-loss tabular-nums">
                      {flood.plotStatus?.length || 0}
                    </div>
                  </div>
                </div>

                <div className="sm:border-l sm:border-border sm:pl-4 pt-2 sm:pt-0">
                  <SegmentedToggle<DataMode>
                    options={[
                      { id: "recorded", label: "Recorded" },
                      { id: "forecast", label: "Forecast" },
                    ]}
                    value={mode}
                    size="sm"
                    onChange={(newMode) => {
                      const qs = new URLSearchParams(searchParams ? searchParams.toString() : "");
                      qs.set("mode", newMode);
                      router.push(`/flood/${mouzaId}/${floodId}?${qs.toString()}`);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2. DEDICATED FLOOD MAP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    Flood Inundation & Plot Submersion Map
                  </h3>
                  <p className="text-xs text-muted">
                    Color-coded depth contours (&gt;1.5m deep, 0.5–1.5m moderate, &lt;0.5m shallow), canals, and cadastral plots
                  </p>
                </div>
                {focusedDagNo && (
                  <span className="text-xs bg-water/10 text-water font-semibold px-2.5 py-1 rounded-pill">
                    Focused Dag No. {focusedDagNo}
                  </span>
                )}
              </div>

              <FloodMap
                floodEvent={flood}
                plots={flood.plotStatus}
                selectedPlotNo={focusedDagNo}
                onSelectPlot={(dagNo) => setFocusedDagNo(dagNo)}
                isForecast={isForecast}
                selectedMouzaId={mouzaId}
              />
            </div>

            {/* 3. AFFECTED OWNERS TABLE (STEP 5, Item 2) */}
            <div className="bhumidorpon-card overflow-hidden space-y-4 p-5 sm:p-6">
              {/* Header + Search Bar + CSV Export */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-ink">
                    Affected Landowners & Submerged Parcels
                  </h3>
                  <p className="text-xs text-muted">
                    Click an owner's name to view their dedicated parcel portfolio and GPS boundary coordinates
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
                  {/* Search input */}
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Search owner name, Dag No., Khatian..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-water"
                    />
                  </div>

                  {/* CSV Export Button */}
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink transition-colors whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-muted" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* TABLE OR SEARCH MISS */}
              {filteredPlots.length === 0 ? (
                /* Search Miss exact text: "No owner found with this name." */
                <div className="p-12 text-center space-y-2 border border-dashed border-border rounded-xl">
                  <Search className="w-6 h-6 text-muted mx-auto" />
                  <p className="text-sm font-semibold text-ink">
                    No owner found with this name.
                  </p>
                  <p className="text-xs text-muted">
                    No matching cadastral parcel or landowner matched &ldquo;{searchQuery}&rdquo;. Try another name or Dag number.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold text-water hover:underline pt-1"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-alt border-b border-border text-[11px] font-semibold text-muted uppercase tracking-wider">
                        <th className="py-3 px-4">Owner</th>
                        <th className="py-3 px-4">Dag No.</th>
                        <th className="py-3 px-4">Khatian No.</th>
                        <th className="py-3 px-4">Flooded Area</th>
                        <th className="py-3 px-4">Depth Class</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredPlots.map((ps) => {
                        const isFocused = focusedDagNo === ps.dagNo;
                        return (
                          <tr
                            key={ps.plotId}
                            onClick={() => setFocusedDagNo(ps.dagNo)}
                            className={cn(
                              "cursor-pointer transition-colors",
                              isFocused
                                ? "bg-water/10 hover:bg-water/15 font-semibold"
                                : "hover:bg-surface-alt/70"
                            )}
                          >
                            {/* Owner name as a link */}
                            <td className="py-3.5 px-4 font-medium text-ink">
                              <Link
                                href={`/flood/${mouzaId}/${floodId}/owner/${ps.ownerId}`}
                                className="text-water hover:underline inline-flex items-center gap-1.5 font-semibold"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>{ps.ownerName}</span>
                                <ExternalLink className="w-3 h-3 text-water/70" />
                              </Link>
                              <div className="text-[10px] text-muted">{ps.ownerId}</div>
                            </td>

                            {/* Dag No. */}
                            <td className="py-3.5 px-4 font-mono text-ink">
                              {ps.dagNo}
                            </td>

                            {/* Khatian No. */}
                            <td className="py-3.5 px-4 font-mono text-secondary">
                              {ps.khatianNo}
                            </td>

                            {/* Flooded Area */}
                            <td className="py-3.5 px-4 font-bold text-water tabular-nums">
                              {formatArea(ps.floodedAreaDecimal, unit)}
                              <span className="text-[10px] font-normal text-muted ml-1">
                                ({Math.round((ps.floodedAreaDecimal / (ps.totalAreaDecimal || 1)) * 100)}%)
                              </span>
                            </td>

                            {/* Depth Class */}
                            <td className="py-3.5 px-4">
                              {getDepthBadge(ps.depthClass)}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <Link
                                href={`/flood/${mouzaId}/${floodId}/owner/${ps.ownerId}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs text-water hover:underline font-semibold"
                              >
                                <span>Owner Land Page</span>
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
