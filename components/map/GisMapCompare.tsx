"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo, useId } from "react";
import {
  Layers,
  Plus,
  Minus,
  AlertTriangle,
  ListOrdered,
  Waves,
  Mountain,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MouzaSummary, MapArea, HazardType, DataMode } from "@/lib/types";
import { getMapArea } from "@/lib/data";
import { BasemapType, BASEMAP_PROVIDERS, DEMO_GEOMETRY_DISCLAIMER } from "@/lib/basemapConfig";
import { setupLeafletPanes } from "./basemap/paneSetup";
import { injectMapSvgDefs } from "./basemap/svgDefs";
import { createBasemapLayers, BasemapController } from "./basemap/basemapFactory";
import { createMouzaLabelsLayer } from "./labels/MouzaLabelsLayer";
import { createGraticuleLayer } from "./chrome/GraticuleLayer";
import { CoordinateReadout } from "./chrome/CoordinateReadout";
import { NorthArrow } from "./chrome/NorthArrow";
import { LocatorInset } from "./chrome/LocatorInset";
import { ViewToggle } from "./chrome/ViewToggle";
import { LayerControlPanel } from "./chrome/LayerControlPanel";
import { BasemapSelector } from "./chrome/BasemapSelector";
import { MapLegend } from "./chrome/MapLegend";
import { MouzaSummaryPanel } from "./panels/MouzaSummaryPanel";
import { WaterStatusCard } from "./panels/WaterStatusCard";
import { TerrainContextCard } from "./panels/TerrainContextCard";
import { useLayerStore } from "./chrome/layerStore";
import { useAppStore } from "@/stores/appStore";
import { getLocalizedHazardName } from "@/lib/translations";

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

const DEFAULT_HAZARD_BOUNDS: Record<HazardType, [number, number, number, number]> = {
  river_erosion: [89.62, 24.54, 89.67, 24.59], // Kazipur, Sirajganj (Jamuna River corridor)
  landslide: [92.01, 22.54, 92.05, 22.58],     // Kawkhali, Rangamati (Chittagong Hill Tracts)
  flood: [91.15, 25.07, 91.21, 25.12],         // Tahirpur, Sunamganj (Haor flood basin)
  char: [89.63, 24.56, 89.68, 24.61],          // Kazipur Char, Jamuna sandbars
  coastal: [90.68, 22.16, 90.73, 22.21],       // Hatiya, Meghna Estuary / Bay of Bengal coast
};

export interface GisMapCompareProps {
  title: string;
  hazard: HazardType;
  mode: DataMode;
  initialArea?: MapArea | null;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  plots?: PlotGeometryItem[];
  setupBeforeHazard?: (map: any, L: any, mapId: string, area: MapArea) => void;
  setupAfterHazard?: (map: any, L: any, mapId: string, area: MapArea) => void;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function GisMapCompare({
  title,
  hazard,
  mode,
  initialArea,
  selectedMouzaId,
  onSelectMouza,
  selectedPlotNo,
  onSelectPlot,
  plots = [],
  setupBeforeHazard,
  setupAfterHazard,
  beforeLabel = "Surveyed Baseline (Before)",
  afterLabel,
  className,
}: GisMapCompareProps) {
  const compId = useId().replace(/[:]/g, "_");
  const mapIdBefore = `leaf_before_${compId}`;
  const mapIdAfter = `leaf_after_${compId}`;

  const isForecast = mode === "forecast";
  const finalAfterLabel =
    afterLabel || (isForecast ? "Projected Status (Forecast)" : "Current Status (After)");

  const { unit, language } = useAppStore();
  const layerStore = useLayerStore();

  const [mapArea, setMapArea] = useState<MapArea | null>(initialArea || null);
  const [loadingArea, setLoadingArea] = useState(!initialArea);

  // Basemap switch state
  const [basemapType, setBasemapType] = useState<BasemapType>("light-gis");
  const [tileError, setTileError] = useState<string | null>(null);

  // Current synchronized zoom level state
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  // Mobile bottom tab drawer state
  const [activeMobileTab, setActiveMobileTab] = useState<"none" | "layers" | "mouzas" | "water">("none");

  const map1ContainerRef = useRef<HTMLDivElement>(null);
  const map2ContainerRef = useRef<HTMLDivElement>(null);

  const map1InstanceRef = useRef<any>(null);
  const map2InstanceRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const tileLayer1Ref = useRef<any>(null);
  const tileLayer2Ref = useRef<any>(null);

  const basemap1CtrlRef = useRef<BasemapController | null>(null);
  const basemap2CtrlRef = useRef<BasemapController | null>(null);
  const labels1CtrlRef = useRef<any>(null);
  const labels2CtrlRef = useRef<any>(null);

  // Synchronization guard ref for dual map pan and zoom
  const isSyncingRef = useRef(false);

  // Load MapArea if not provided
  useEffect(() => {
    let active = true;
    if (initialArea) {
      setMapArea(initialArea);
      setLoadingArea(false);
      return;
    }

    async function fetchArea() {
      setLoadingArea(true);
      try {
        const area = await getMapArea(hazard, mode, selectedMouzaId || "default");
        if (active && area) {
          setMapArea(area);
        }
      } catch (e) {
        console.error("Failed to load map area:", e);
      } finally {
        if (active) setLoadingArea(false);
      }
    }

    fetchArea();
    return () => {
      active = false;
    };
  }, [hazard, mode, selectedMouzaId, initialArea]);

  // Derived bounds with hazard-specific fallback
  const areaBounds = useMemo<[number, number, number, number]>(() => {
    if (mapArea?.bounds) return mapArea.bounds;
    return DEFAULT_HAZARD_BOUNDS[hazard] || [89.62, 24.54, 89.67, 24.59];
  }, [mapArea, hazard]);

  const leafletAreaBounds = useMemo<[[number, number], [number, number]]>(() => {
    const [minLon, minLat, maxLon, maxLat] = areaBounds;
    return [
      [minLat, minLon],
      [maxLat, maxLon],
    ];
  }, [areaBounds]);

  // Fit to Reach view
  const fitReach = useCallback(() => {
    if (!map1InstanceRef.current || !map2InstanceRef.current) return;
    map1InstanceRef.current.fitBounds(leafletAreaBounds, { padding: [32, 32], maxZoom: 16, animate: true });
    map2InstanceRef.current.fitBounds(leafletAreaBounds, { padding: [32, 32], maxZoom: 16, animate: true });
  }, [leafletAreaBounds]);

  // Fit to Mouza view
  const fitMouza = useCallback(() => {
    if (!map1InstanceRef.current || !map2InstanceRef.current || !mapArea?.mouzas) return;
    const targetMouza =
      mapArea.mouzas.find((m) => m.id === selectedMouzaId) || mapArea.mouzas[0];

    if (targetMouza?.polygon?.[0]) {
      const latLngs = targetMouza.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
      const L = LRef.current;
      if (L) {
        const polyBounds = L.latLngBounds(latLngs);
        map1InstanceRef.current.fitBounds(polyBounds, { padding: [48, 48], maxZoom: 16, animate: true });
        map2InstanceRef.current.fitBounds(polyBounds, { padding: [48, 48], maxZoom: 16, animate: true });
      }
    } else {
      fitReach();
    }
  }, [mapArea, selectedMouzaId, fitReach]);

  // Sync layer store changes to Leaflet layer groups
  useEffect(() => {
    if (!basemap1CtrlRef.current || !basemap2CtrlRef.current) return;

    const b1 = basemap1CtrlRef.current;
    const b2 = basemap2CtrlRef.current;

    b1.setGroupVisibility("landuse", layerStore.landuse);
    b2.setGroupVisibility("landuse", layerStore.landuse);

    b1.setGroupVisibility("roads", layerStore.roads);
    b2.setGroupVisibility("roads", layerStore.roads);

    b1.setGroupVisibility("buildings", layerStore.buildings);
    b2.setGroupVisibility("buildings", layerStore.buildings);

    b1.setGroupVisibility("water", layerStore.water);
    b2.setGroupVisibility("water", layerStore.water);

    b1.setGroupVisibility("waterLabels", layerStore.waterLabels);
    b2.setGroupVisibility("waterLabels", layerStore.waterLabels);

    b1.setGroupVisibility("admin", layerStore.mouzaBoundaries);
    b2.setGroupVisibility("admin", layerStore.mouzaBoundaries);

    b1.setSelectedMouza(selectedMouzaId || null);
    b2.setSelectedMouza(selectedMouzaId || null);

    labels1CtrlRef.current?.update(selectedMouzaId || null);
    labels2CtrlRef.current?.update(selectedMouzaId || null);
  }, [layerStore, selectedMouzaId]);

  // Highlight hovered mouza
  useEffect(() => {
    basemap1CtrlRef.current?.highlightMouza(layerStore.hoveredMouzaId);
    basemap2CtrlRef.current?.highlightMouza(layerStore.hoveredMouzaId);
  }, [layerStore.hoveredMouzaId]);

  // Apply Basemap type (Light GIS / Satellite / Street)
  const applyBasemapType = useCallback(
    (type: BasemapType) => {
      const L = LRef.current;
      const map1 = map1InstanceRef.current;
      const map2 = map2InstanceRef.current;
      if (!L || !map1 || !map2) return;

      const b1 = basemap1CtrlRef.current;
      const b2 = basemap2CtrlRef.current;

      // 1. Remove existing tile layers if present
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
        // Restore synthetic Light GIS layers
        b1?.setSyntheticBasemapVisible(true);
        b2?.setSyntheticBasemapVisible(true);
        setTileError(null);
      } else if (provider.tileUrl) {
        // Hide synthetic vector background, keep admin boundaries & thematic overlays
        b1?.setSyntheticBasemapVisible(false);
        b2?.setSyntheticBasemapVisible(false);

        const tileOptions: any = {
          pane: "basemap-tiles",
          maxZoom: provider.maxZoom,
          minZoom: provider.minZoom,
          attribution: provider.attribution,
        };

        const t1 = L.tileLayer(provider.tileUrl, tileOptions);
        const t2 = L.tileLayer(provider.tileUrl, tileOptions);

        let errorCount = 0;
        const onTileError = () => {
          errorCount++;
          if (errorCount > 3) {
            setTileError(
              `Unable to load ${provider.name} tiles. Check network connectivity or provider key.`
            );
          }
        };

        t1.on("tileerror", onTileError);
        t2.on("tileerror", onTileError);

        t1.addTo(map1);
        t2.addTo(map2);

        tileLayer1Ref.current = t1;
        tileLayer2Ref.current = t2;
      }
    },
    []
  );

  // Basemap switch handler
  const handleSelectBasemap = (type: BasemapType) => {
    setBasemapType(type);
    applyBasemapType(type);
  };

  // Zoom control handlers for Map 1 and Map 2: synchronous dual zoom on single click
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

  // Initialize dual Leaflet map instances with side-by-side synchronization
  useEffect(() => {
    let isMounted = true;

    async function initMaps() {
      if (!map1ContainerRef.current || !map2ContainerRef.current) return;
      if (!mapArea) return;

      const L = (await import("leaflet")).default;
      LRef.current = L;

      if (!isMounted) return;

      // Clean up existing instances if re-initializing
      if (map1InstanceRef.current) {
        map1InstanceRef.current.remove();
        map1InstanceRef.current = null;
      }
      if (map2InstanceRef.current) {
        map2InstanceRef.current.remove();
        map2InstanceRef.current = null;
      }

      const mapOptions: any = {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: true,
        minZoom: 10,
        maxZoom: 19,
      };

      // 1. Map 1 (Before)
      const map1 = L.map(map1ContainerRef.current, mapOptions);
      setupLeafletPanes(map1);
      L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map1);

      // 2. Map 2 (After / Forecast)
      const map2 = L.map(map2ContainerRef.current, mapOptions);
      setupLeafletPanes(map2);
      L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map2);

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

      // Inject SVG Pattern Defs
      injectMapSvgDefs(map1ContainerRef.current, mapIdBefore);
      injectMapSvgDefs(map2ContainerRef.current, mapIdAfter);

      // Initial Viewport Fit (Default: Mouza view with maxZoom safeguard)
      const targetMouza =
        mapArea.mouzas.find((m) => m.id === selectedMouzaId) || mapArea.mouzas[0];

      if (targetMouza?.polygon?.[0]) {
        const latLngs = targetMouza.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon] as [number, number]);
        const polyBounds = L.latLngBounds(latLngs as any);
        map1.fitBounds(polyBounds, { padding: [48, 48], maxZoom: 16 });
        map2.fitBounds(polyBounds, { padding: [48, 48], maxZoom: 16 });
      } else {
        map1.fitBounds(leafletAreaBounds, { padding: [32, 32], maxZoom: 16 });
        map2.fitBounds(leafletAreaBounds, { padding: [32, 32], maxZoom: 16 });
      }

      setCurrentZoom(map1.getZoom());

      // Build Light GIS Basemaps on both maps
      const b1 = createBasemapLayers(map1, L, mapArea.basemap, mapArea.mouzas, {
        mapIdPrefix: mapIdBefore,
        selectedMouzaId,
        onSelectMouza,
        onHoverMouza: (mId) => layerStore.setHoveredMouzaId(mId),
      });

      const b2 = createBasemapLayers(map2, L, mapArea.basemap, mapArea.mouzas, {
        mapIdPrefix: mapIdAfter,
        selectedMouzaId,
        onSelectMouza,
        onHoverMouza: (mId) => layerStore.setHoveredMouzaId(mId),
      });

      basemap1CtrlRef.current = b1;
      basemap2CtrlRef.current = b2;

      // Apply initial basemap if not light-gis
      if (basemapType !== "light-gis") {
        applyBasemapType(basemapType);
      }

      // Mount Mouza Labels on both maps
      const l1 = createMouzaLabelsLayer(map1, L, mapArea.mouzas, {
        selectedMouzaId,
        hazard,
        mode,
        unit,
        onSelectMouza,
      });

      const l2 = createMouzaLabelsLayer(map2, L, mapArea.mouzas, {
        selectedMouzaId,
        hazard,
        mode,
        unit,
        onSelectMouza,
      });

      labels1CtrlRef.current = l1;
      labels2CtrlRef.current = l2;

      // Mount Graticule Layer on both maps
      createGraticuleLayer(map1, L);
      createGraticuleLayer(map2, L);

      // Mount Hazard Overlays
      if (setupBeforeHazard) {
        setupBeforeHazard(map1, L, mapIdBefore, mapArea);
      }
      if (setupAfterHazard) {
        setupAfterHazard(map2, L, mapIdAfter, mapArea);
      }

      // Plots Layer
      if (plots && plots.length > 0) {
        const plotsGroup1 = L.layerGroup();
        const plotsGroup2 = L.layerGroup();

        for (const plot of plots) {
          if (!plot.coordinates?.[0]) continue;
          const latLngs = plot.coordinates[0].map(([lon, lat]: [number, number]) => [lat, lon]);
          const isSelected = selectedPlotNo === plot.dagNo;

          const pStyle = {
            pane: "plots",
            fillColor: isSelected ? "#3B82F6" : "#E2E8F0",
            fillOpacity: isSelected ? 0.75 : 0.45,
            color: isSelected ? "#1E40AF" : "#94A3B8",
            weight: isSelected ? 2 : 1,
          };

          const p1 = L.polygon(latLngs as any, pStyle);
          const p2 = L.polygon(latLngs as any, pStyle);

          p1.on("click", () => onSelectPlot?.(plot.dagNo, plot.centroid));
          p2.on("click", () => onSelectPlot?.(plot.dagNo, plot.centroid));

          plotsGroup1.addLayer(p1);
          plotsGroup2.addLayer(p2);
        }

        plotsGroup1.addTo(map1);
        plotsGroup2.addTo(map2);
      }

      setTimeout(() => {
        if (isMounted) {
          map1.invalidateSize();
          map2.invalidateSize();
        }
      }, 100);
    }

    initMaps();

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
  }, [mapArea, mode, hazard]);

  // Dynamic Viewport Adjustment when selected mouza or plot changes
  useEffect(() => {
    const map1 = map1InstanceRef.current;
    const map2 = map2InstanceRef.current;
    const L = LRef.current;
    if (!map1 || !map2 || !L) return;

    if (selectedPlotNo && plots.length > 0) {
      const targetPlot = plots.find((p) => p.dagNo === selectedPlotNo);
      if (targetPlot) {
        if (targetPlot.coordinates?.[0]?.length > 0) {
          const latLngs = targetPlot.coordinates[0].map(([lon, lat]: [number, number]) => [lat, lon]);
          const bounds = L.latLngBounds(latLngs as any);
          isSyncingRef.current = true;
          map1.fitBounds(bounds, { padding: [50, 50], maxZoom: 17, animate: true });
          map2.fitBounds(bounds, { padding: [50, 50], maxZoom: 17, animate: true });
          isSyncingRef.current = false;
          return;
        } else if (targetPlot.centroid) {
          const [lon, lat] = targetPlot.centroid;
          isSyncingRef.current = true;
          map1.setView([lat, lon], 17, { animate: true });
          map2.setView([lat, lon], 17, { animate: true });
          isSyncingRef.current = false;
          return;
        }
      }
    }

    if (selectedMouzaId && mapArea?.mouzas) {
      const targetMouza = mapArea.mouzas.find((m) => m.id === selectedMouzaId);
      if (targetMouza?.polygon?.[0]) {
        const latLngs = targetMouza.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
        const polyBounds = L.latLngBounds(latLngs as any);
        isSyncingRef.current = true;
        map1.fitBounds(polyBounds, { padding: [40, 40], maxZoom: 16, animate: true });
        map2.fitBounds(polyBounds, { padding: [40, 40], maxZoom: 16, animate: true });
        isSyncingRef.current = false;
      }
    }
  }, [selectedMouzaId, selectedPlotNo, mapArea, plots]);

  // Window resize observer to ensure Leaflet maps adjust size properly
  useEffect(() => {
    const handleResize = () => {
      map1InstanceRef.current?.invalidateSize();
      map2InstanceRef.current?.invalidateSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* 1. TOP HEADER & COMPARISON CONTROLS */}
      <div className="bg-surface border border-border rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Title, Hazard & Mode Badge */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-water animate-pulse" />
          <span className="text-sm font-bold text-ink">{title}</span>
          <span className="text-muted text-xs">•</span>
          <span className="text-xs font-semibold text-secondary">{getLocalizedHazardName(hazard, language)}</span>
          {isForecast ? (
            <span className="px-2 py-0.5 rounded-pill bg-[#6A5BD6]/10 text-[#6A5BD6] font-bold text-[10px] border border-[#6A5BD6]/20">
              {language === "bn" ? "পূর্বাভাস" : "Forecast"}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-pill bg-emerald-500/10 text-emerald-700 font-bold text-[10px] border border-emerald-500/20">
              {language === "bn" ? "রেকর্ডকৃত" : "Recorded"}
            </span>
          )}
        </div>

        {/* View Tools: Reach/Mouza View + Basemap Selector + Layer Panel */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reach vs Mouza View Switcher */}
          <ViewToggle onFitReach={fitReach} onFitMouza={fitMouza} className="hidden sm:flex" />

          {/* Basemap Switcher (Light GIS | Satellite | Street) */}
          <BasemapSelector value={basemapType} onChange={handleSelectBasemap} />

          {/* Collapsible Layer Control Panel */}
          <LayerControlPanel
            hasTerrain={hazard === "landslide"}
            hazardName={hazard.replace("_", " ")}
            className="hidden sm:block"
          />
        </div>
      </div>

      {/* 2. DISCLAIMER BANNER (When Satellite or Street is active) */}
      {basemapType !== "light-gis" && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs font-medium animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-bold">{DEMO_GEOMETRY_DISCLAIMER}</span>
            <span className="text-amber-800/80 hidden md:inline">— Plot overlays and boundaries represent synthetic demonstration geometries.</span>
          </div>
          <span className="text-[11px] text-amber-800 font-semibold px-2 py-0.5 bg-amber-500/15 rounded-md">
            {BASEMAP_PROVIDERS[basemapType].name} Imagery
          </span>
        </div>
      )}

      {/* TILE ERROR / FALLBACK NOTIFICATION */}
      {tileError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-900 rounded-xl p-3 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{tileError}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectBasemap("light-gis")}
            className="px-2.5 py-1 bg-ink text-surface rounded-lg text-xs font-bold hover:bg-ink/90 transition-colors"
          >
            Switch to Light GIS
          </button>
        </div>
      )}

      {/* 3. SIDE-BY-SIDE DUAL MAP COMPARISON (RESPONSIVE: 2 COLS ON DESKTOP, STACKED ON MOBILE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT MAP CARD: BEFORE */}
        <div className="relative rounded-2xl border border-border bg-[#F8FAFC] shadow-card overflow-hidden flex flex-col h-[480px] md:h-[530px] select-none">
          {/* Top Bar for Before Map */}
          <div className="p-3 border-b border-border/80 bg-surface/90 backdrop-blur-md flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-2xs" />
              <span className="text-xs font-bold text-ink">{beforeLabel}</span>
              <span className="text-[10px] font-semibold text-muted bg-surface-alt px-1.5 py-0.5 rounded border border-border/60">
                {language === "bn" ? "ভিত্তিরেখা" : "Baseline"}
              </span>
            </div>

            {/* Before Map Zoom Controls (+ / -) */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-surface border border-border rounded-lg shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={currentZoom >= 19}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded text-ink hover:bg-surface-alt transition-colors font-bold",
                    currentZoom >= 19 && "opacity-30 cursor-not-allowed"
                  )}
                  title="Zoom in Before map (+)"
                  aria-label="Zoom in Before map"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-border mx-0.5" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={currentZoom <= 10}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded text-ink hover:bg-surface-alt transition-colors font-bold",
                    currentZoom <= 10 && "opacity-30 cursor-not-allowed"
                  )}
                  title="Zoom out Before map (−)"
                  aria-label="Zoom out Before map"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted tabular-nums hidden sm:inline">z{currentZoom}</span>
            </div>
          </div>

          {/* Map Canvas 1 */}
          <div className="relative flex-1 w-full h-full">
            <div id={mapIdBefore} ref={map1ContainerRef} className="w-full h-full" />

            {/* Inset locator on desktop */}
            {mapArea && (
              <div className="absolute top-3 right-3 z-[1000] hidden lg:block">
                <LocatorInset
                  mapInstance={map1InstanceRef.current}
                  basemap={mapArea.basemap}
                  areaBounds={areaBounds}
                />
              </div>
            )}

            {/* Coordinate Readout */}
            <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
              <div className="pointer-events-auto">
                <CoordinateReadout mapInstance={map1InstanceRef.current} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT MAP CARD: AFTER */}
        <div className="relative rounded-2xl border border-border bg-[#F8FAFC] shadow-card overflow-hidden flex flex-col h-[480px] md:h-[530px] select-none">
          {/* Top Bar for After Map */}
          <div className="p-3 border-b border-border/80 bg-surface/90 backdrop-blur-md flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full shadow-2xs",
                  isForecast ? "bg-[#6A5BD6]" : "bg-emerald-500"
                )}
              />
              <span className="text-xs font-bold text-ink">{finalAfterLabel}</span>
              <span
                className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                  isForecast
                    ? "bg-[#6A5BD6]/10 text-[#6A5BD6] border-[#6A5BD6]/20"
                    : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                )}
              >
                {isForecast
                  ? language === "bn" ? "পূর্বাভাস" : "Forecast"
                  : language === "bn" ? "মূল্যায়ন" : "Assessment"}
              </span>
            </div>

            {/* After Map Zoom Controls (+ / -) */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-surface border border-border rounded-lg shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={currentZoom >= 19}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded text-ink hover:bg-surface-alt transition-colors font-bold",
                    currentZoom >= 19 && "opacity-30 cursor-not-allowed"
                  )}
                  title="Zoom in After map (+)"
                  aria-label="Zoom in After map"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-border mx-0.5" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  disabled={currentZoom <= 10}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded text-ink hover:bg-surface-alt transition-colors font-bold",
                    currentZoom <= 10 && "opacity-30 cursor-not-allowed"
                  )}
                  title="Zoom out After map (−)"
                  aria-label="Zoom out After map"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] font-mono text-muted tabular-nums hidden sm:inline">z{currentZoom}</span>
            </div>
          </div>

          {/* Map Canvas 2 */}
          <div className="relative flex-1 w-full h-full">
            <div id={mapIdAfter} ref={map2ContainerRef} className="w-full h-full" />

            {/* Bottom Chrome: Coordinate Readout + North Arrow */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-end justify-between pointer-events-none">
              <div className="pointer-events-auto">
                <CoordinateReadout mapInstance={map2InstanceRef.current} />
              </div>
              <div className="pointer-events-auto flex items-center gap-2">
                <NorthArrow />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BASEMAP ATTRIBUTION & SYNCHRONIZATION STATUS */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-muted px-2 py-0.5 gap-2">
        <div
          dangerouslySetInnerHTML={{
            __html: BASEMAP_PROVIDERS[basemapType].attribution,
          }}
          className="truncate max-w-[70%]"
        />
        <div className="shrink-0 flex items-center gap-2 font-mono text-[10px]">
          <span>{language === "bn" ? "সিঙ্ক্রোনাইজড ডুয়াল লিফলেট" : "Synchronized dual Leaflet"}</span>
          <span>•</span>
          <span>z{currentZoom}</span>
        </div>
      </div>

      {/* 5. MOBILE BOTTOM TABS (<768px) */}
      <div className="sm:hidden flex items-center justify-around bg-surface border border-border rounded-xl p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveMobileTab(activeMobileTab === "layers" ? "none" : "layers")}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5",
            activeMobileTab === "layers" ? "bg-ink text-surface" : "text-ink hover:bg-surface-alt"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "লেয়ার" : "Layers"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab(activeMobileTab === "mouzas" ? "none" : "mouzas")}
          className={cn(
            "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5",
            activeMobileTab === "mouzas" ? "bg-ink text-surface" : "text-ink hover:bg-surface-alt"
          )}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "মৌজা" : "Mouzas"}</span>
        </button>

        {mapArea?.context && (
          <button
            type="button"
            onClick={() => setActiveMobileTab(activeMobileTab === "water" ? "none" : "water")}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5",
              activeMobileTab === "water" ? "bg-ink text-surface" : "text-ink hover:bg-surface-alt"
            )}
          >
            {hazard === "landslide" ? (
              <>
                <Mountain className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "ভূসংস্থান" : "Terrain"}</span>
              </>
            ) : (
              <>
                <Waves className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "পানি" : "Water"}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* MOBILE SHEET / DRAWER */}
      {activeMobileTab !== "none" && (
        <div className="sm:hidden bg-surface border border-border rounded-xl p-3 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-border/50 mb-3">
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              {activeMobileTab === "layers"
                ? language === "bn" ? "লেয়ার নিয়ন্ত্রণ" : "Layer Controls"
                : activeMobileTab === "mouzas"
                ? language === "bn" ? "মৌজার সারসংক্ষেপ" : "Mouza Summary"
                : hazard === "landslide"
                ? language === "bn" ? "ভূসংস্থান বিশ্লেষণ" : "Terrain Morphometry"
                : language === "bn" ? "পানির অবস্থা" : "Water Status"}
            </span>
            <button type="button" onClick={() => setActiveMobileTab("none")} className="p-1 text-muted hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeMobileTab === "layers" && (
            <LayerControlPanel
              hasTerrain={hazard === "landslide"}
              hazardName={hazard.replace("_", " ")}
              className="block w-full"
            />
          )}

          {activeMobileTab === "mouzas" && mapArea?.mouzas && (
            <MouzaSummaryPanel
              mouzas={mapArea.mouzas}
              selectedMouzaId={selectedMouzaId}
              onSelectMouza={(mId) => {
                onSelectMouza?.(mId);
                setActiveMobileTab("none");
              }}
              hazard={hazard}
              mode={mode}
            />
          )}

          {activeMobileTab === "water" && mapArea?.context && (
            hazard === "landslide" ? (
              <TerrainContextCard context={mapArea.context} />
            ) : (
              <WaterStatusCard context={mapArea.context} hazard={hazard} mode={mode} />
            )
          )}
        </div>
      )}

      {/* 6. SUPPORTING INFORMATION & SUMMARY BELOW THE TWO MAPS */}
      <div className="space-y-4 pt-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Map Legend & Context Card (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bhumidorpon-card p-4">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>{language === "bn" ? "মানচিত্র সংকেত" : "Map Legend"}</span>
                <span className="text-[10px] text-muted font-normal">{getLocalizedHazardName(hazard, language)}</span>
              </h3>
              <MapLegend hazard={hazard} isForecast={isForecast} />
            </div>

            {/* Water or Terrain Status Card */}
            {mapArea?.context && (
              hazard === "landslide" ? (
                <TerrainContextCard context={mapArea.context} />
              ) : (
                <WaterStatusCard context={mapArea.context} hazard={hazard} mode={mode} />
              )
            )}
          </div>

          {/* Mouza Summary Panel (8 cols on desktop - generous space, not squeezed!) */}
          <div className="lg:col-span-8">
            {mapArea?.mouzas && (
              <MouzaSummaryPanel
                mouzas={mapArea.mouzas}
                selectedMouzaId={selectedMouzaId}
                onSelectMouza={onSelectMouza}
                onHoverMouza={(mId) => layerStore.setHoveredMouzaId(mId)}
                hazard={hazard}
                mode={mode}
                className="h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
