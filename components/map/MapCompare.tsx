"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, useId } from "react";
import {
  Layers,
  Sparkles,
  Compass,
  Plus,
  Minus,
  Maximize2,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BasemapType, BASEMAP_PROVIDERS, DEMO_GEOMETRY_DISCLAIMER } from "@/lib/basemapConfig";
import { BasemapSelector } from "./chrome/BasemapSelector";

export type ViewMode = "side-by-side";

export interface MapLayerConfig {
  id: string;
  label: string;
  color?: string;
  visible: boolean;
}

export interface PlotGeometryItem {
  dagNo: string;
  khatianNo: string;
  ownerName?: string;
  areaDecimal?: number;
  floodedAreaDecimal?: number;
  lossDecimal?: number;
  gainDecimal?: number;
  status?: string;
  centroid: [number, number]; // [lon, lat]
  coordinates: [number, number][][];
}

export interface MapCompareProps {
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
  bounds: [number, number, number, number]; // [minLon, minY, maxLon, maxY]
  plots?: PlotGeometryItem[];
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  setupBeforeLayers?: (map: any, L: any, mapId: string) => void;
  setupAfterLayers?: (map: any, L: any, mapId: string) => void;
  className?: string;
}

export function MapCompare({
  title,
  hazardBadge,
  isForecast = false,
  layers,
  onToggleLayer,
  opacity = 0.88,
  onOpacityChange,
  legend,
  beforeLabel = "Surveyed Baseline (Before)",
  afterLabel,
  bounds,
  plots = [],
  selectedPlotNo,
  onSelectPlot,
  setupBeforeLayers,
  setupAfterLayers,
  className,
}: MapCompareProps) {
  const compId = useId().replace(/[:]/g, "_");
  const mapIdBefore = `leaf_before_${compId}`;
  const mapIdAfter = `leaf_after_${compId}`;

  const defaultAfterLabel = isForecast
    ? "Deep Learning Forecast"
    : "Post-Event Assessment (After)";
  const finalAfterLabel = afterLabel || defaultAfterLabel;

  // Basemap switch
  const [basemapType, setBasemapType] = useState<BasemapType>("light-gis");
  const [tileError, setTileError] = useState<string | null>(null);

  // Synchronized Zoom state
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);

  const map1ContainerRef = useRef<HTMLDivElement>(null);
  const map2ContainerRef = useRef<HTMLDivElement>(null);

  const map1InstanceRef = useRef<any>(null);
  const map2InstanceRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const tileLayer1Ref = useRef<any>(null);
  const tileLayer2Ref = useRef<any>(null);

  const plotsLayer1Ref = useRef<any>(null);
  const plotsLayer2Ref = useRef<any>(null);

  // Synchronization guard ref for dual map pan and zoom
  const isSyncingRef = useRef(false);

  // Helper to inject SVG hatch patterns into a Leaflet map container
  const injectSvgDefs = (containerEl: HTMLElement, idPrefix: string) => {
    let svg = containerEl.querySelector("svg");
    if (!svg) {
      setTimeout(() => {
        const delayedSvg = containerEl.querySelector("svg");
        if (delayedSvg && !delayedSvg.querySelector(`#defs-${idPrefix}`)) {
          appendDefs(delayedSvg, idPrefix);
        }
      }, 100);
      return;
    }
    if (!svg.querySelector(`#defs-${idPrefix}`)) {
      appendDefs(svg, idPrefix);
    }
  };

  const appendDefs = (svgEl: SVGElement, idPrefix: string) => {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.id = `defs-${idPrefix}`;
    defs.innerHTML = `
      <pattern id="pattern-loss-${idPrefix}" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#E4604A" stroke-width="2.5" />
      </pattern>
      <pattern id="pattern-khas-${idPrefix}" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#94A3B8" stroke-width="2" />
      </pattern>
      <pattern id="pattern-forecast-${idPrefix}" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="3,1" />
      </pattern>
    `;
    svgEl.prepend(defs);
  };

  // Convert Geo bounds [minLon, minY, maxLon, maxY] to Leaflet LatLngBoundsExpression
  const leafletBounds = useMemo<[[number, number], [number, number]]>(() => {
    const [minLon, minY, maxLon, maxY] = bounds;
    return [
      [minY, minLon],
      [maxY, maxLon],
    ];
  }, [bounds]);

  // Apply basemap tile layer
  const applyBasemapType = useCallback((type: BasemapType) => {
    const L = LRef.current;
    const map1 = map1InstanceRef.current;
    const map2 = map2InstanceRef.current;
    if (!L || !map1 || !map2) return;

    if (tileLayer1Ref.current) {
      try {
        map1.removeLayer(tileLayer1Ref.current);
      } catch {}
      tileLayer1Ref.current = null;
    }
    if (tileLayer2Ref.current) {
      try {
        map2.removeLayer(tileLayer2Ref.current);
      } catch {}
      tileLayer2Ref.current = null;
    }

    const provider = BASEMAP_PROVIDERS[type];

    if (type === "light-gis") {
      setTileError(null);
    } else if (provider.tileUrl) {
      const tileOptions: any = {
        pane: "basemapPane",
        maxZoom: provider.maxZoom,
        minZoom: provider.minZoom,
        attribution: provider.attribution,
      };

      const t1 = L.tileLayer(provider.tileUrl, tileOptions);
      const t2 = L.tileLayer(provider.tileUrl, tileOptions);

      let errCount = 0;
      const handleError = () => {
        errCount++;
        if (errCount > 3) {
          setTileError(`Unable to load ${provider.name} tiles.`);
        }
      };

      t1.on("tileerror", handleError);
      t2.on("tileerror", handleError);

      t1.addTo(map1);
      t2.addTo(map2);

      tileLayer1Ref.current = t1;
      tileLayer2Ref.current = t2;
    }
  }, []);

  const handleSelectBasemap = (type: BasemapType) => {
    setBasemapType(type);
    applyBasemapType(type);
  };

  const handleZoomIn = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      const map1 = map1InstanceRef.current;
      const map2 = map2InstanceRef.current;
      if (!map1 || !map2) return;
      const z = map1.getZoom();
      if (z >= 19) return;
      const nextZ = Math.min(19, Math.round(z + 1));
      const center = map1.getCenter();
      isSyncingRef.current = true;
      map1.setView(center, nextZ, { animate: false });
      map2.setView(center, nextZ, { animate: false });
      isSyncingRef.current = false;
      setCurrentZoom(nextZ);
    },
    []
  );

  const handleZoomOut = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      const map1 = map1InstanceRef.current;
      const map2 = map2InstanceRef.current;
      if (!map1 || !map2) return;
      const z = map1.getZoom();
      if (z <= 10) return;
      const nextZ = Math.max(10, Math.round(z - 1));
      const center = map1.getCenter();
      isSyncingRef.current = true;
      map1.setView(center, nextZ, { animate: false });
      map2.setView(center, nextZ, { animate: false });
      isSyncingRef.current = false;
      setCurrentZoom(nextZ);
    },
    []
  );

  // Initialize both Leaflet maps
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!map1ContainerRef.current || !map2ContainerRef.current) return;
      if (map1InstanceRef.current || map2InstanceRef.current) return;

      const L = (await import("leaflet")).default;
      LRef.current = L;

      if (!isMounted) return;

      const mapOptions: any = {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: true,
        minZoom: 10,
        maxZoom: 19,
      };

      // 1. Initialize Map 1 (Before)
      const map1 = L.map(map1ContainerRef.current, mapOptions);
      map1.fitBounds(leafletBounds, { padding: [24, 24], maxZoom: 16 });

      // Panes
      map1.createPane("basemapPane");
      map1.getPane("basemapPane")!.style.zIndex = "195";
      map1.createPane("waterPane");
      map1.getPane("waterPane")!.style.zIndex = "250";
      map1.createPane("plotsPane");
      map1.getPane("plotsPane")!.style.zIndex = "300";
      map1.createPane("hazardPane");
      map1.getPane("hazardPane")!.style.zIndex = "350";
      map1.createPane("labelsPane");
      map1.getPane("labelsPane")!.style.zIndex = "450";
      map1.getPane("labelsPane")!.style.pointerEvents = "none";
      map1.createPane("markersPane");
      map1.getPane("markersPane")!.style.zIndex = "500";

      // 2. Initialize Map 2 (After)
      const map2 = L.map(map2ContainerRef.current, mapOptions);
      map2.fitBounds(leafletBounds, { padding: [24, 24], maxZoom: 16 });

      map2.createPane("basemapPane");
      map2.getPane("basemapPane")!.style.zIndex = "195";
      map2.createPane("waterPane");
      map2.getPane("waterPane")!.style.zIndex = "250";
      map2.createPane("plotsPane");
      map2.getPane("plotsPane")!.style.zIndex = "300";
      map2.createPane("hazardPane");
      map2.getPane("hazardPane")!.style.zIndex = "350";
      map2.createPane("labelsPane");
      map2.getPane("labelsPane")!.style.zIndex = "450";
      map2.getPane("labelsPane")!.style.pointerEvents = "none";
      map2.createPane("markersPane");
      map2.getPane("markersPane")!.style.zIndex = "500";

      // Dual Map Movement & Zoom Synchronization with Re-entrancy Guard
      const syncFrom1To2 = () => {
        if (isSyncingRef.current || !map2) return;
        isSyncingRef.current = true;
        map2.setView(map1.getCenter(), map1.getZoom(), { animate: false });
        isSyncingRef.current = false;
      };

      const syncFrom2To1 = () => {
        if (isSyncingRef.current || !map1) return;
        isSyncingRef.current = true;
        map1.setView(map2.getCenter(), map2.getZoom(), { animate: false });
        isSyncingRef.current = false;
      };

      map1.on("move", syncFrom1To2);
      map2.on("move", syncFrom2To1);

      const updateZoomState = () => {
        if (isMounted && map1) {
          setCurrentZoom(map1.getZoom());
        }
      };

      map1.on("zoomend", updateZoomState);
      map2.on("zoomend", updateZoomState);

      map1InstanceRef.current = map1;
      map2InstanceRef.current = map2;

      injectSvgDefs(map1ContainerRef.current, mapIdBefore);
      injectSvgDefs(map2ContainerRef.current, mapIdAfter);

      if (setupBeforeLayers) {
        setupBeforeLayers(map1, L, mapIdBefore);
      }
      if (setupAfterLayers) {
        setupAfterLayers(map2, L, mapIdAfter);
      }

      if (basemapType !== "light-gis") {
        applyBasemapType(basemapType);
      }

      setTimeout(() => {
        if (isMounted) {
          map1.invalidateSize();
          map2.invalidateSize();
        }
      }, 150);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (map1InstanceRef.current) {
        map1InstanceRef.current.remove();
        map1InstanceRef.current = null;
      }
      if (map2InstanceRef.current) {
        map2InstanceRef.current.remove();
        map2InstanceRef.current = null;
      }
    };
  }, []);

  // Render cadastral plots layer on both maps
  useEffect(() => {
    const L = LRef.current;
    if (!L || !plots || plots.length === 0) return;

    const renderPlotsOnMap = (map: any, isAfter: boolean) => {
      if (!map) return null;
      const layerGroup = L.layerGroup([], { pane: "plotsPane" });

      plots.forEach((p) => {
        const latLngs = p.coordinates[0].map(([lon, lat]) => [lat, lon]);
        const isSelected = selectedPlotNo === p.dagNo;

        const isFlooded = p.floodedAreaDecimal && p.floodedAreaDecimal > 0;
        const isLoss = p.lossDecimal && p.lossDecimal > 0;

        let fillColor = "#F8FAFC";
        let fillOpacity = 0.25;
        let strokeColor = "#94A3B8";

        if (isAfter) {
          if (isFlooded) {
            fillColor = "#38BDF8";
            fillOpacity = 0.55;
            strokeColor = "#0284C7";
          } else if (isLoss) {
            fillColor = "#FCA5A5";
            fillOpacity = 0.45;
            strokeColor = "#E4604A";
          }
        }

        if (isSelected) {
          strokeColor = "#0F172A";
        }

        const polygon = L.polygon(latLngs as any, {
          pane: "plotsPane",
          color: strokeColor,
          weight: isSelected ? 3.5 : 1.2,
          fillColor: isSelected ? "#C8F23A" : fillColor,
          fillOpacity: isSelected ? 0.75 : fillOpacity,
        });

        polygon.on("click", () => {
          onSelectPlot?.(p.dagNo, p.centroid);
        });

        layerGroup.addLayer(polygon);
      });

      layerGroup.addTo(map);
      return layerGroup;
    };

    if (plotsLayer1Ref.current) {
      map1InstanceRef.current?.removeLayer(plotsLayer1Ref.current);
    }
    if (plotsLayer2Ref.current) {
      map2InstanceRef.current?.removeLayer(plotsLayer2Ref.current);
    }

    const showPlots = layers.find((l) => l.id === "plots")?.visible ?? true;
    if (showPlots) {
      plotsLayer1Ref.current = renderPlotsOnMap(map1InstanceRef.current, false);
      plotsLayer2Ref.current = renderPlotsOnMap(map2InstanceRef.current, true);
    }
  }, [plots, selectedPlotNo, layers, onSelectPlot]);

  const handleFitToArea = () => {
    if (map1InstanceRef.current) {
      map1InstanceRef.current.fitBounds(leafletBounds, { padding: [24, 24] });
    }
    if (map2InstanceRef.current) {
      map2InstanceRef.current.fitBounds(leafletBounds, { padding: [24, 24] });
    }
  };

  return (
    <div className={cn("bhumidorpon-card overflow-hidden flex flex-col relative select-none", className)}>
      {/* 1. Header Toolbar */}
      <div className="p-4 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-water animate-pulse" />
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-secondary">
            {hazardBadge}
          </span>
          {isForecast && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-pill bg-[#ECE9FB] text-[#6A5BD6] border border-dashed border-[#6A5BD6]">
              <Sparkles className="w-3 h-3" />
              <span>Forecast</span>
            </span>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Basemap Selector */}
          <BasemapSelector value={basemapType} onChange={handleSelectBasemap} />

          {/* Layer Menu Toggle Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className={cn(
                "p-2 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1",
                showLayerMenu
                  ? "bg-surface-alt border-water text-water"
                  : "bg-surface border-border text-secondary hover:bg-surface-alt"
              )}
              title="Toggle Layers"
            >
              <Layers className="w-4 h-4" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl bg-surface border border-border shadow-lg z-50 space-y-2 text-xs">
                <div className="font-bold text-ink pb-1 border-b border-border flex items-center justify-between">
                  <span>Cadastral GIS Layers</span>
                  <button
                    type="button"
                    onClick={() => setShowLayerMenu(false)}
                    className="text-muted hover:text-ink"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-1.5">
                  {layers.map((l) => (
                    <label
                      key={l.id}
                      className="flex items-center justify-between p-1.5 rounded-md hover:bg-surface-alt cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {l.color && (
                          <span
                            className="w-3 h-3 rounded-sm border border-black/10"
                            style={{ backgroundColor: l.color }}
                          />
                        )}
                        <span className="text-ink font-medium">{l.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={l.visible}
                        onChange={() => onToggleLayer(l.id)}
                        className="rounded accent-water"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Opacity Slider Button */}
          {onOpacityChange && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOpacitySlider(!showOpacitySlider)}
                className={cn(
                  "p-2 rounded-lg border text-xs font-semibold transition-colors",
                  showOpacitySlider
                    ? "bg-surface-alt border-water text-water"
                    : "bg-surface border-border text-secondary hover:bg-surface-alt"
                )}
                title="Overlay Opacity"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {showOpacitySlider && (
                <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-xl bg-surface border border-border shadow-lg z-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-ink">
                    <span>Overlay Opacity</span>
                    <span className="font-mono text-muted">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                    className="w-full accent-water"
                  />
                </div>
              )}
            </div>
          )}

          {/* Fit to Area Button */}
          <button
            type="button"
            onClick={handleFitToArea}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-alt text-secondary text-xs transition-colors"
            title="Fit to Area Bounds"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Non-Light GIS Disclaimer */}
      {basemapType !== "light-gis" && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-900 px-4 py-1.5 flex items-center justify-between text-xs">
          <span>{DEMO_GEOMETRY_DISCLAIMER}</span>
          <span className="font-semibold text-[11px]">{BASEMAP_PROVIDERS[basemapType].name} mode</span>
        </div>
      )}

      {tileError && (
        <div className="bg-red-500/10 border-b border-red-500/30 text-red-900 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{tileError}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectBasemap("light-gis")}
            className="px-2 py-0.5 bg-ink text-surface rounded text-xs font-bold"
          >
            Switch to Light GIS
          </button>
        </div>
      )}

      {/* 2. Responsive Dual Map Layout: Left Before, Right After */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border bg-[#EEF0E6]">
        {/* LEFT MAP: BEFORE */}
        <div className="relative w-full h-[440px] md:h-[480px] overflow-hidden flex flex-col">
          {/* Top Bar Before */}
          <div className="p-2.5 bg-surface/90 backdrop-blur-md border-b border-border/70 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-ink">{beforeLabel}</span>
            </div>

            {/* Before Zoom Controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-surface border border-border rounded-lg shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={currentZoom >= 19}
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
                  disabled={currentZoom <= 10}
                  className="w-5 h-5 flex items-center justify-center rounded text-ink hover:bg-surface-alt font-bold disabled:opacity-30"
                  title="Zoom out Before map (−)"
                  aria-label="Zoom out Before map"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted tabular-nums">z{currentZoom}</span>
            </div>
          </div>

          <div className="relative flex-1 w-full h-full">
            <div ref={map1ContainerRef} id={mapIdBefore} className="w-full h-full" />
          </div>
        </div>

        {/* RIGHT MAP: AFTER */}
        <div className="relative w-full h-[440px] md:h-[480px] overflow-hidden flex flex-col">
          {/* Top Bar After */}
          <div className="p-2.5 bg-surface/90 backdrop-blur-md border-b border-border/70 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isForecast ? "bg-[#6A5BD6]" : "bg-emerald-500"
                )}
              />
              <span className="text-xs font-bold text-ink">{finalAfterLabel}</span>
            </div>

            {/* After Zoom Controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-surface border border-border rounded-lg shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={currentZoom >= 19}
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
                  disabled={currentZoom <= 10}
                  className="w-5 h-5 flex items-center justify-center rounded text-ink hover:bg-surface-alt font-bold disabled:opacity-30"
                  title="Zoom out After map (−)"
                  aria-label="Zoom out After map"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted tabular-nums">z{currentZoom}</span>
            </div>
          </div>

          <div className="relative flex-1 w-full h-full">
            <div ref={map2ContainerRef} id={mapIdAfter} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar: Attribution, Legend & Statistics Below Maps */}
      <div className="p-3 sm:p-4 bg-surface border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <Compass className="w-3.5 h-3.5 text-ink" />
          <div
            dangerouslySetInnerHTML={{
              __html: BASEMAP_PROVIDERS[basemapType].attribution,
            }}
            className="truncate max-w-[60vw]"
          />
        </div>

        {/* Legend */}
        {legend && <div className="text-xs">{legend}</div>}
      </div>
    </div>
  );
}
