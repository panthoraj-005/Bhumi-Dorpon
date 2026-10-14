"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Layers,
  Sparkles,
  MoveHorizontal,
  Compass,
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Eye,
  EyeOff,
  Columns,
  SplitSquareVertical,
  ToggleLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "swipe" | "side-by-side" | "toggle";

export interface MapLayerConfig {
  id: string;
  label: string;
  color?: string;
  visible: boolean;
}

export interface PlotTooltipInfo {
  dagNo: string;
  khatianNo: string;
  ownerName?: string;
  areaDecimal?: number;
  floodedAreaDecimal?: number;
  lossDecimal?: number;
  gainDecimal?: number;
  status?: string;
}

export interface MapCompareBaseProps {
  title: string;
  hazardBadge: string;
  isForecast?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  legend: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string) => void;
  childrenBefore: (zoom: number, isSideBySide: boolean) => React.ReactNode;
  childrenAfter: (zoom: number, isSideBySide: boolean) => React.ReactNode;
  className?: string;
}

export function MapCompareBase({
  title,
  hazardBadge,
  isForecast = false,
  viewMode: controlledViewMode,
  onViewModeChange,
  layers,
  onToggleLayer,
  opacity = 0.85,
  onOpacityChange,
  legend,
  beforeLabel = "Surveyed Baseline (Before)",
  afterLabel,
  selectedPlotNo,
  onSelectPlot,
  childrenBefore,
  childrenAfter,
  className,
}: MapCompareBaseProps) {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>("side-by-side");
  const viewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = onViewModeChange ?? setInternalViewMode;

  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const [activeToggleSide, setActiveToggleSide] = useState<"before" | "after">(
    isForecast ? "after" : "after"
  );
  const [zoomLevel, setZoomLevel] = useState(14);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedAfterLabel = afterLabel || (isForecast ? "DL Model Projection (Forecast)" : "Current Status (After)");

  // Dragging slider logic
  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const pct = Math.round((x / rect.width) * 100);
      setSliderPos(pct);
    },
    [isDragging]
  );

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, []);

  // Arrow key navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(18, z + 1));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(12, z - 1));
  const handleResetZoom = () => setZoomLevel(14);

  return (
    <div
      className={cn(
        "relative rounded-[20px] border border-border bg-[#F8FAFC] shadow-card overflow-hidden flex flex-col h-[520px] select-none",
        className
      )}
    >
      {/* 1. TOP CONTROL BAR */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title & Badge */}
        <div className="pointer-events-auto bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-pill border border-border/80 shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-water animate-pulse" />
          <span className="text-xs font-bold text-ink">{title}</span>
          <span className="text-muted text-[11px]">•</span>
          <span className="text-[11px] font-semibold text-secondary">{hazardBadge}</span>
          {isForecast && (
            <span className="px-2 py-0.5 rounded-pill bg-predicted-soft text-predicted font-bold text-[10px]">
              Forecast
            </span>
          )}
        </div>

        {/* View Mode Switcher: Swipe | Side by side | Toggle */}
        <div className="pointer-events-auto bg-surface/90 backdrop-blur-md p-1 rounded-pill border border-border/80 shadow-xs flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("swipe")}
            className={cn(
              "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
              viewMode === "swipe"
                ? "bg-ink text-surface shadow-xs"
                : "text-muted hover:text-ink"
            )}
            title="Draggable Swipe Split Screen"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Swipe</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={cn(
              "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
              viewMode === "side-by-side"
                ? "bg-ink text-surface shadow-xs"
                : "text-muted hover:text-ink"
            )}
            title="Side by Side Split Screen"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by side</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("toggle")}
            className={cn(
              "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
              viewMode === "toggle"
                ? "bg-ink text-surface shadow-xs"
                : "text-muted hover:text-ink"
            )}
            title="Instant Before/After Toggle"
          >
            <ToggleLeft className="w-3.5 h-3.5" />
            <span>Toggle</span>
          </button>
        </div>
      </div>

      {/* 2. MAP CANVAS WRAPPER */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative flex-1 w-full h-full overflow-hidden"
      >
        {/* SWIPE VIEW MODE */}
        {viewMode === "swipe" && (
          <div className="relative w-full h-full">
            {/* Left Layer: "Before" Baseline */}
            <div className="absolute inset-0 w-full h-full">
              {childrenBefore(zoomLevel, false)}
            </div>

            {/* Right Layer: "After" / "Forecast" with CSS clipPath */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
                opacity,
              }}
            >
              {childrenAfter(zoomLevel, false)}
            </div>

            {/* Draggable & Arrow-key accessible Swipe Divider Bar */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Swipe comparison slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={sliderPos}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center -ml-3 w-6 group focus:outline-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical Divider Line */}
              <div className="w-[3px] h-full bg-surface shadow-md group-hover:bg-water transition-colors" />

              {/* Central Draggable Thumb Pill */}
              <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface border-2 border-ink text-ink shadow-lg flex items-center justify-center group-hover:scale-110 group-focus:scale-110 group-focus:ring-2 group-focus:ring-water transition-transform">
                <MoveHorizontal className="w-4 h-4" />
              </div>

              {/* Side Floating Labels */}
              <div className="absolute -top-1 left-2 pointer-events-none whitespace-nowrap bg-surface/90 px-2 py-0.5 rounded text-[10px] font-bold text-secondary shadow-xs">
                {beforeLabel}
              </div>
              <div className="absolute -top-1 right-2 pointer-events-none whitespace-nowrap bg-surface/90 px-2 py-0.5 rounded text-[10px] font-bold text-water shadow-xs">
                {resolvedAfterLabel}
              </div>
            </div>
          </div>
        )}

        {/* SIDE BY SIDE VIEW MODE */}
        {viewMode === "side-by-side" && (
          <div className="relative w-full h-full flex divide-x-2 divide-border">
            {/* Left 50% Before */}
            <div className="relative w-1/2 h-full overflow-hidden">
              <div className="absolute top-12 left-3 z-10 bg-surface/85 px-2.5 py-1 rounded-md text-[10px] font-bold text-secondary shadow-xs border border-border">
                {beforeLabel}
              </div>
              {childrenBefore(zoomLevel, true)}
            </div>

            {/* Right 50% After */}
            <div className="relative w-1/2 h-full overflow-hidden" style={{ opacity }}>
              <div className="absolute top-12 left-3 z-10 bg-surface/85 px-2.5 py-1 rounded-md text-[10px] font-bold text-water shadow-xs border border-border">
                {resolvedAfterLabel}
              </div>
              {childrenAfter(zoomLevel, true)}
            </div>
          </div>
        )}

        {/* TOGGLE VIEW MODE */}
        {viewMode === "toggle" && (
          <div className="relative w-full h-full">
            {activeToggleSide === "before" ? (
              <div className="absolute inset-0 w-full h-full">
                {childrenBefore(zoomLevel, false)}
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full" style={{ opacity }}>
                {childrenAfter(zoomLevel, false)}
              </div>
            )}

            {/* Toggle Switcher Floating Button */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 bg-surface/95 backdrop-blur-md px-1.5 py-1 rounded-pill border border-border shadow-lg flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveToggleSide("before")}
                className={cn(
                  "px-3 py-1 rounded-pill text-xs font-bold transition-all",
                  activeToggleSide === "before"
                    ? "bg-ink text-surface shadow-xs"
                    : "text-muted hover:text-ink"
                )}
              >
                {beforeLabel}
              </button>
              <button
                type="button"
                onClick={() => setActiveToggleSide("after")}
                className={cn(
                  "px-3 py-1 rounded-pill text-xs font-bold transition-all",
                  activeToggleSide === "after"
                    ? "bg-water text-surface shadow-xs"
                    : "text-muted hover:text-ink"
                )}
              >
                {resolvedAfterLabel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. MAP CONTROLS & FLOATING PANELS */}
      {/* Zoom, Fit to Area, Compass, Opacity Controls (Top Right) */}
      <div className="absolute top-14 right-3 z-20 flex flex-col items-center gap-1.5">
        {/* Zoom Controls */}
        <div className="bg-surface/95 backdrop-blur-md rounded-xl border border-border shadow-xs flex flex-col p-0.5">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface-alt rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="h-[1px] bg-border mx-1" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface-alt rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fit to Area / Reset */}
        <button
          type="button"
          onClick={handleResetZoom}
          className="w-8 h-8 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-xs flex items-center justify-center text-ink hover:bg-surface-alt transition-colors"
          title="Fit bounds with padding"
        >
          <Maximize2 className="w-3.5 h-3.5 text-secondary" />
        </button>

        {/* North Arrow Compass */}
        <div
          className="w-8 h-8 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-xs flex flex-col items-center justify-center text-[10px] font-bold text-ink"
          title="North orientation"
        >
          <Compass className="w-3.5 h-3.5 text-loss mb-[-2px]" />
          <span className="text-[9px] font-mono leading-none">N</span>
        </div>

        {/* Opacity Slider Toggle */}
        {onOpacityChange && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOpacitySlider(!showOpacitySlider)}
              className={cn(
                "w-8 h-8 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-xs flex items-center justify-center text-secondary hover:text-ink transition-colors",
                showOpacitySlider && "bg-surface-alt text-ink border-water"
              )}
              title="Overlay opacity slider"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {showOpacitySlider && (
              <div className="absolute right-10 top-0 bg-surface/95 backdrop-blur-md p-2.5 rounded-xl border border-border shadow-lg flex flex-col gap-1 w-36 z-30">
                <div className="flex justify-between text-[10px] font-semibold text-muted">
                  <span>Overlay Opacity</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                  className="w-full accent-water h-1.5 cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* Layers Drawer Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={cn(
              "w-8 h-8 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-xs flex items-center justify-center text-secondary hover:text-ink transition-colors",
              showLayerMenu && "bg-surface-alt text-ink border-water"
            )}
            title="Layer visibility toggles"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-10 top-0 bg-surface/95 backdrop-blur-md p-3 rounded-xl border border-border shadow-lg flex flex-col gap-2 w-48 z-30 animate-in fade-in duration-150">
              <span className="text-[11px] font-bold text-ink">Layer Visibility</span>
              <div className="space-y-1.5">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => onToggleLayer(layer.id)}
                    className="w-full flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-surface-alt transition-colors text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      {layer.color && (
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: layer.color }}
                        />
                      )}
                      <span className="text-secondary font-medium">{layer.label}</span>
                    </span>
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5 text-gain" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-muted" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM LEGEND & WATERMARK */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
        {/* Dynamic Legend Component */}
        <div className="pointer-events-auto bg-surface/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border/80 shadow-md">
          {legend}
        </div>

        {/* Scale Bar & Fictional Geometry Note */}
        <div className="pointer-events-auto bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border text-[10px] text-muted flex items-center gap-3">
          {/* Scale bar indicator */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-ink font-semibold">200 m</span>
            <div className="w-12 h-1 bg-ink flex justify-between border-x border-ink" />
          </div>
          <span>•</span>
          <span>Zoom: {zoomLevel}x</span>
          <span>•</span>
          <span className="italic text-secondary">Synthetic demo geometry</span>
        </div>
      </div>
    </div>
  );
}
