"use client";

import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  Compass,
  Plus,
  Minus,
  Map,
  Globe,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BasemapType, BASEMAP_PROVIDERS, DEMO_GEOMETRY_DISCLAIMER } from "@/lib/basemapConfig";

interface MapCompareProps {
  beforeYear?: number;
  afterYear?: number;
  isForecast?: boolean;
  selectedPlotNo?: string | null;
  onSelectPlot?: (plotNo: string) => void;
  className?: string;
}

export function MapCompare({
  beforeYear = 2019,
  afterYear = 2024,
  isForecast = false,
  selectedPlotNo,
  onSelectPlot,
  className,
}: MapCompareProps) {
  // Synchronized zoom level between Before and After
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Basemap switch
  const [basemapType, setBasemapType] = useState<BasemapType>("light-gis");

  // Layer toggles
  const [layers, setLayers] = useState({
    boundary: true,
    plots: true,
    loss: true,
    gain: true,
    forecast: isForecast,
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setZoomLevel((z) => Math.min(19, z + 1));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setZoomLevel((z) => Math.max(10, z - 1));
  };

  return (
    <div
      className={cn(
        "bhumidorpon-card overflow-hidden flex flex-col relative select-none",
        className
      )}
    >
      {/* Top Header / Badges */}
      <div className="p-4 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Cadastral Change Comparison
          </span>
          {isForecast && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-pill bg-[#ECE9FB] text-[#6A5BD6] border border-dashed border-[#6A5BD6]">
              <Sparkles className="w-3 h-3" />
              <span>Forecast Mode</span>
            </span>
          )}
        </div>

        {/* Basemap Switcher & Year Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          {/* Basemap Selector */}
          <div className="bg-surface-alt p-1 rounded-pill border border-border flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBasemapType("light-gis")}
              className={cn(
                "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
                basemapType === "light-gis" ? "bg-ink text-surface shadow-xs" : "text-muted hover:text-ink"
              )}
            >
              <Map className="w-3 h-3" />
              <span>Light GIS</span>
            </button>
            <button
              type="button"
              onClick={() => setBasemapType("satellite")}
              className={cn(
                "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
                basemapType === "satellite" ? "bg-ink text-surface shadow-xs" : "text-muted hover:text-ink"
              )}
            >
              <Globe className="w-3 h-3" />
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => setBasemapType("street")}
              className={cn(
                "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
                basemapType === "street" ? "bg-ink text-surface shadow-xs" : "text-muted hover:text-ink"
              )}
            >
              <Navigation className="w-3 h-3" />
              <span>Street</span>
            </button>
          </div>
        </div>
      </div>

      {/* Non-Light GIS Disclaimer */}
      {basemapType !== "light-gis" && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-900 px-4 py-1.5 flex items-center justify-between text-xs">
          <span>{DEMO_GEOMETRY_DISCLAIMER}</span>
          <span className="font-semibold text-[11px]">{BASEMAP_PROVIDERS[basemapType].name} mode</span>
        </div>
      )}

      {/* Main Responsive Dual Map Display: Left Before, Right After */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border bg-[#E8EBDD]">
        {/* ================= LEFT MAP: BEFORE ================= */}
        <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden flex flex-col">
          {/* Top Bar for Before Map */}
          <div className="p-2.5 bg-surface/90 backdrop-blur-md border-b border-border/70 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-ink">Baseline ({beforeYear})</span>
            </div>

            {/* Before Map Zoom Controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-surface border border-border rounded-lg shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={zoomLevel >= 19}
                  className="w-5 h-5 flex items-center justify-center rounded text-ink hover:bg-surface-alt font-bold disabled:opacity-30"
                  title="Zoom in Before map (+)"
                  aria-label="Zoom in Before map"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <div className="w-px h-3 bg-border mx-0.5" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={zoomLevel <= 10}
                  className="w-5 h-5 flex items-center justify-center rounded text-ink hover:bg-surface-alt font-bold disabled:opacity-30"
                  title="Zoom out Before map (−)"
                  aria-label="Zoom out Before map"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted tabular-nums">z{zoomLevel}</span>
            </div>
          </div>

          {/* SVG Canvas Before */}
          <div className="relative flex-1 w-full h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
              style={{
                filter:
                  basemapType === "satellite"
                    ? "contrast(1.15) brightness(0.85) saturate(0.9)"
                    : basemapType === "street"
                    ? "saturate(1.2)"
                    : "none",
              }}
            >
              <defs>
                <pattern id="gridBefore" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D7DACF" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Base Landmass (Pre-erosion) */}
              <rect
                width="100%"
                height="100%"
                fill={basemapType === "satellite" ? "#1B2A1E" : basemapType === "street" ? "#F2EFE9" : "#EBF0DE"}
              />
              {basemapType === "light-gis" && <rect width="100%" height="100%" fill="url(#gridBefore)" />}

              {/* Jamuna River Channel (Before) */}
              <path
                d="M 620,0 C 600,150 580,280 610,500 L 800,500 L 800,0 Z"
                fill={basemapType === "satellite" ? "#0F283E" : "#94C5E8"}
                opacity="0.9"
              />
              <path
                d="M 660,40 C 640,180 630,280 650,460"
                fill="none"
                stroke="#6CA8D4"
                strokeWidth="2"
                strokeDasharray="12 8"
              />

              {/* Mouza Boundary */}
              {layers.boundary && (
                <path
                  d="M 80,40 L 590,30 L 580,460 L 90,470 Z"
                  fill="none"
                  stroke="#4A5043"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}

              {/* Cadastral Plots (Before) */}
              {layers.plots && (
                <g stroke="#A6AE9B" strokeWidth="1.2" fill={basemapType === "satellite" ? "#2D4029" : "#F4F7EB"}>
                  <polygon points="120,60 260,55 250,180 110,175" />
                  <polygon points="260,55 420,50 410,180 250,180" />
                  <polygon points="420,50 580,45 565,180 410,180" />

                  <polygon points="110,175 250,180 240,320 100,315" />
                  <polygon points="250,180 410,180 395,320 240,320" />
                  <polygon points="410,180 565,180 545,320 395,320" />

                  <polygon points="100,315 240,320 230,450 90,440" />
                  <polygon points="240,320 395,320 380,450 230,450" />
                  <polygon points="395,320 545,320 525,450 380,450" />
                </g>
              )}

              <text x="140" y="90" fontSize="11" fill="#4A5043" fontWeight="bold">Plot 101</text>
              <text x="300" y="90" fontSize="11" fill="#4A5043" fontWeight="bold">Plot 104</text>
              <text x="460" y="90" fontSize="11" fill="#4A5043" fontWeight="bold">Plot 108 (Intact)</text>
              <text x="440" y="220" fontSize="11" fill="#4A5043" fontWeight="bold">Plot 112</text>
              <text x="660" y="120" fontSize="13" fill="#1C537C" fontWeight="bold">Jamuna River</text>
            </svg>

            {/* Bottom Scale */}
            <div className="absolute bottom-2.5 left-2.5 bg-surface/85 backdrop-blur-sm px-2 py-0.5 rounded border border-border text-[10px] text-muted flex items-center gap-1.5 font-mono">
              <Compass className="w-3 h-3 text-ink" />
              <span>Scale: 1:3,500</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT MAP: AFTER ================= */}
        <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden flex flex-col">
          {/* Top Bar for After Map */}
          <div className="p-2.5 bg-surface/90 backdrop-blur-md border-b border-border/70 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isForecast ? "bg-[#6A5BD6]" : "bg-emerald-500"
                )}
              />
              <span className="text-xs font-bold text-ink">
                {isForecast ? `Forecast (${afterYear})` : `Recorded (${afterYear})`}
              </span>
            </div>

            {/* After Map Zoom Controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-surface border border-border rounded-lg shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={zoomLevel >= 19}
                  className="w-5 h-5 flex items-center justify-center rounded text-ink hover:bg-surface-alt font-bold disabled:opacity-30"
                  title="Zoom in After map (+)"
                  aria-label="Zoom in After map"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <div className="w-px h-3 bg-border mx-0.5" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={zoomLevel <= 10}
                  className="w-5 h-5 flex items-center justify-center rounded text-ink hover:bg-surface-alt font-bold disabled:opacity-30"
                  title="Zoom out After map (−)"
                  aria-label="Zoom out After map"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted tabular-nums">z{zoomLevel}</span>
            </div>
          </div>

          {/* SVG Canvas After */}
          <div className="relative flex-1 w-full h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
              style={{
                filter:
                  basemapType === "satellite"
                    ? "contrast(1.15) brightness(0.85) saturate(0.9)"
                    : basemapType === "street"
                    ? "saturate(1.2)"
                    : "none",
              }}
            >
              <defs>
                <pattern id="gridAfter" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D7DACF" strokeWidth="0.8" />
                </pattern>
                <pattern id="forecastHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#6A5BD6" strokeWidth="2.5" />
                </pattern>
              </defs>

              {/* Base Landmass */}
              <rect
                width="100%"
                height="100%"
                fill={basemapType === "satellite" ? "#1B2A1E" : basemapType === "street" ? "#F2EFE9" : "#EBF0DE"}
              />
              {basemapType === "light-gis" && <rect width="100%" height="100%" fill="url(#gridAfter)" />}

              {/* Shifted Jamuna River Channel */}
              <path
                d="M 420,0 C 390,140 370,260 410,500 L 800,500 L 800,0 Z"
                fill={basemapType === "satellite" ? "#0F283E" : "#94C5E8"}
                opacity="0.9"
              />

              {/* Mouza Boundary */}
              {layers.boundary && (
                <path
                  d="M 80,40 L 590,30 L 580,460 L 90,470 Z"
                  fill="none"
                  stroke="#4A5043"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}

              {/* Loss Area (Red/Coral) */}
              {layers.loss && (
                <path
                  d="M 620,0 C 600,150 580,280 610,500 L 410,500 C 370,260 390,140 420,0 Z"
                  fill="#E4604A"
                  fillOpacity="0.45"
                  stroke="#E4604A"
                  strokeWidth="2"
                />
              )}

              {/* Cadastral Plots */}
              {layers.plots && (
                <g stroke="#A6AE9B" strokeWidth="1.2" fill={basemapType === "satellite" ? "#2D4029" : "#F4F7EB"}>
                  <polygon points="120,60 260,55 250,180 110,175" />
                  <polygon points="260,55 420,50 410,180 250,180" />
                  <polygon points="110,175 250,180 240,320 100,315" />
                  <polygon points="250,180 410,180 395,320 240,320" />
                  <polygon points="100,315 240,320 230,450 90,440" />
                  <polygon points="240,320 395,320 380,450 230,450" />
                </g>
              )}

              <text x="140" y="90" fontSize="11" fill="#4A5043" fontWeight="bold">Plot 101</text>
              <text x="300" y="90" fontSize="11" fill="#4A5043" fontWeight="bold">Plot 104</text>
              <text x="460" y="90" fontSize="11" fill="#E4604A" fontWeight="bold">Plot 108 (Lost)</text>
              <text x="440" y="220" fontSize="11" fill="#E4604A" fontWeight="bold">Plot 112 (Lost)</text>
              <text x="660" y="120" fontSize="13" fill="#1C537C" fontWeight="bold">Jamuna River</text>
            </svg>

            {/* Bottom Scale */}
            <div className="absolute bottom-2.5 left-2.5 bg-surface/85 backdrop-blur-sm px-2 py-0.5 rounded border border-border text-[10px] text-muted flex items-center gap-1.5 font-mono">
              <Compass className="w-3 h-3 text-ink" />
              <span>Scale: 1:3,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Toggle Chips & Legend Toolbar Below the Maps */}
      <div className="p-3 sm:p-4 bg-surface border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted font-medium mr-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Overlays:</span>
          </div>

          <button
            type="button"
            onClick={() => toggleLayer("boundary")}
            className={cn(
              "px-3 py-1 rounded-pill text-xs font-medium border transition-colors",
              layers.boundary ? "bg-surface-alt border-ink text-ink font-semibold" : "bg-surface border-border text-muted"
            )}
          >
            Mouza boundary
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("plots")}
            className={cn(
              "px-3 py-1 rounded-pill text-xs font-medium border transition-colors",
              layers.plots ? "bg-surface-alt border-ink text-ink font-semibold" : "bg-surface border-border text-muted"
            )}
          >
            Plots
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("loss")}
            className={cn(
              "px-3 py-1 rounded-pill text-xs font-medium border transition-colors inline-flex items-center gap-1.5",
              layers.loss ? "bg-[#FBE5E0] border-[#E4604A] text-[#E4604A] font-semibold" : "bg-surface border-border text-muted"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-[#E4604A]" />
            <span>Loss</span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("gain")}
            className={cn(
              "px-3 py-1 rounded-pill text-xs font-medium border transition-colors inline-flex items-center gap-1.5",
              layers.gain ? "bg-[#DFF3E8] border-[#2F9E62] text-[#2F9E62] font-semibold" : "bg-surface border-border text-muted"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-[#2F9E62]" />
            <span>Gain</span>
          </button>

          {isForecast && (
            <button
              type="button"
              onClick={() => toggleLayer("forecast")}
              className={cn(
                "px-3 py-1 rounded-pill text-xs font-medium border transition-colors inline-flex items-center gap-1.5",
                layers.forecast ? "bg-[#ECE9FB] border-[#6A5BD6] text-[#6A5BD6] font-semibold" : "bg-surface border-border text-muted"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-[#6A5BD6]" />
              <span>Projected</span>
            </button>
          )}
        </div>

        {/* Attribution & Status */}
        <div className="text-[11px] text-muted flex items-center gap-2">
          <span>{BASEMAP_PROVIDERS[basemapType].attribution.replace(/<[^>]+>/g, "").replace(/&copy;/g, "©").replace(/&bull;/g, "•").replace(/&mdash;/g, "—")}</span>
        </div>
      </div>
    </div>
  );
}
