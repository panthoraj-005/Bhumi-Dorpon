"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FloodEvent, FloodPlotStatus, MapArea } from "@/lib/types";
import { GisMapCompare, PlotGeometryItem } from "./GisMapCompare";
import { OwnerLegendPanel, OwnerLegendItem, getOwnerColorStyle, FLOOD_OWNER_COLORS } from "./panels/OwnerLegendPanel";
import { FloodContextCard } from "./panels/FloodContextCard";
import { useLayerStore } from "./chrome/layerStore";

interface FloodMapProps {
  floodEvent?: FloodEvent | null;
  plots?: FloodPlotStatus[];
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  isolatedOwnerId?: string | null;
  onToggleIsolateOwner?: (ownerId: string | null) => void;
  className?: string;
  isForecast?: boolean;
}

function toLeafletLatLng(coord: [number, number]): [number, number] {
  const [a, b] = coord;
  if (a > 50 && b < 35) return [b, a];
  return [a, b];
}

function toGeoJsonLonLat(coord: [number, number]): [number, number] {
  const [a, b] = coord;
  if (a < 35 && b > 50) return [b, a];
  return [a, b];
}

export function FloodMap({
  floodEvent,
  plots = [],
  selectedPlotNo,
  onSelectPlot,
  selectedMouzaId,
  onSelectMouza,
  isolatedOwnerId: externalIsolatedOwnerId,
  onToggleIsolateOwner: externalOnToggleIsolateOwner,
  className,
  isForecast = false,
}: FloodMapProps) {
  const [internalIsolatedOwnerId, setInternalIsolatedOwnerId] = useState<string | null>(null);
  const [hoveredOwnerId, setHoveredOwnerId] = useState<string | null>(null);

  const isolatedOwnerId = externalIsolatedOwnerId !== undefined
    ? externalIsolatedOwnerId
    : internalIsolatedOwnerId;

  const handleToggleIsolateOwner = useCallback(
    (ownerId: string | null) => {
      if (externalOnToggleIsolateOwner) {
        externalOnToggleIsolateOwner(ownerId);
      } else {
        setInternalIsolatedOwnerId(ownerId);
      }
    },
    [externalOnToggleIsolateOwner]
  );

  const effectivePlots = useMemo(() => {
    return plots.length > 0 ? plots : floodEvent?.plotStatus || [];
  }, [plots, floodEvent]);

  // Derived Owner Legend Items
  const ownerLegendItems = useMemo<OwnerLegendItem[]>(() => {
    if (!effectivePlots || effectivePlots.length === 0) return [];

    const ownerMap = new Map<string, OwnerLegendItem>();

    effectivePlots.forEach((ps, idx) => {
      const ownerId = ps.ownerId || `owner_${idx + 1}`;
      const colorIndex = ps.colorIndex ?? (idx % 12);

      if (!ownerMap.has(ownerId)) {
        ownerMap.set(ownerId, {
          ownerId,
          name: ps.ownerName || "Cadastral Owner",
          colorIndex,
          plotCount: 0,
          floodedAreaDecimal: 0,
          mouzaId: floodEvent?.mouzaId,
          floodId: floodEvent?.id,
        });
      }

      const item = ownerMap.get(ownerId)!;
      item.plotCount += 1;
      item.floodedAreaDecimal += ps.floodedAreaDecimal || 0;
    });

    return Array.from(ownerMap.values()).sort(
      (a, b) => b.floodedAreaDecimal - a.floodedAreaDecimal
    );
  }, [effectivePlots, floodEvent]);

  // Plot geometry items for inspection
  const plotGeometryItems = useMemo<PlotGeometryItem[]>(() => {
    return effectivePlots.map((ps) => {
      const [lat, lon] = ps.centroid || [25.15, 92.00];
      const delta = 0.0012;
      const coords =
        ps.boundary && ps.boundary.length > 2
          ? [ps.boundary.map((pt) => toGeoJsonLonLat(pt as [number, number]))]
          : [
              [
                [lon - delta, lat - delta],
                [lon + delta, lat - delta],
                [lon + delta, lat + delta],
                [lon - delta, lat + delta],
                [lon - delta, lat - delta],
              ],
            ];

      return {
        dagNo: ps.dagNo,
        khatianNo: ps.khatianNo,
        ownerName: ps.ownerName,
        areaDecimal: ps.totalAreaDecimal,
        floodedAreaDecimal: ps.floodedAreaDecimal,
        status: ps.status,
        centroid: [lon, lat],
        coordinates: coords as [number, number][][],
      };
    });
  }, [effectivePlots]);

  // Setup Leaflet Map 1 (Before - Normal water bodies + Every owner's plots in their own color)
  const setupBeforeHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      if (!effectivePlots || effectivePlots.length === 0) return;

      effectivePlots.forEach((ps, idx) => {
        const isUnowned = !ps.ownerName || ps.ownerName.toLowerCase().includes("khas") || ps.ownerName.toLowerCase().includes("unowned");
        const colorIdx = ps.colorIndex ?? (idx % 12);
        const { color: ownerColor, borderStyle } = isUnowned
          ? { color: "#9AA091", borderStyle: "solid" }
          : getOwnerColorStyle(colorIdx);

        const isOwnerIsolated = isolatedOwnerId && ps.ownerId === isolatedOwnerId;
        const isDimmed = isolatedOwnerId && ps.ownerId !== isolatedOwnerId;
        const isHovered = hoveredOwnerId && ps.ownerId === hoveredOwnerId;

        const [lat, lon] = ps.centroid || [25.15, 92.00];
        const delta = 0.0011;
        const rawCoords: [number, number][] =
          ps.boundary && ps.boundary.length > 2
            ? ps.boundary
            : [
                [lat - delta, lon - delta],
                [lat - delta, lon + delta],
                [lat + delta, lon + delta],
                [lat + delta, lon - delta],
                [lat - delta, lon - delta],
              ];

        const latLngs = rawCoords.map((c) => toLeafletLatLng(c as [number, number]));

        const polygon = L.polygon(latLngs, {
          color: ownerColor,
          weight: isOwnerIsolated || isHovered ? 3 : 2,
          dashArray: borderStyle === "dashed" ? "4, 3" : borderStyle === "dotted" ? "2, 2" : undefined,
          fillColor: ownerColor,
          fillOpacity: isDimmed ? 0.12 : isOwnerIsolated || isHovered ? 0.85 : 0.65,
          pane: "plots",
        }).addTo(map);

        polygon.bindTooltip(
          `
          <div class="text-xs p-1">
            <div class="font-bold text-slate-900">${ps.ownerName || "Unowned"}</div>
            <div class="text-slate-600">Dag No. ${ps.dagNo} · Khatian ${ps.khatianNo}</div>
            <div class="text-slate-500">Area: ${ps.totalAreaDecimal} dec</div>
          </div>
          `,
          { sticky: true, opacity: 0.95 }
        );

        // Dag Number Label
        const center = polygon.getBounds().getCenter();
        const labelIcon = L.divIcon({
          className: "gis-plot-dag-label",
          html: `
            <div class="px-1 py-0.2 rounded bg-white/90 text-[9px] font-bold text-slate-800 shadow-2xs border border-slate-300 leading-tight">
              ${ps.dagNo}
            </div>
          `,
          iconSize: [32, 14],
          iconAnchor: [16, 7],
        });
        L.marker(center, { icon: labelIcon, pane: "markers", interactive: false }).addTo(map);
      });
    },
    [effectivePlots, isolatedOwnerId, hoveredOwnerId]
  );

  // Setup Leaflet Map 2 (After - 3 Depth Bands in flood pane BELOW plots, 45% plots with blue show-through, wave hatch)
  const setupAfterHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      // 1. Render 3 Flood Inundation Depth Bands in 'flood' pane (z-index 225, below 'plots' pane 240)
      if (area.bounds) {
        const [minLon, minLat, maxLon, maxLat] = area.bounds;
        const latSpan = maxLat - minLat;
        const lonSpan = maxLon - minLon;

        // Band 1: Shallow (<0.5m, #CFE3F0)
        const shallowPoly: [number, number][] = [
          [minLat + latSpan * 0.1, minLon + lonSpan * 0.05],
          [maxLat - latSpan * 0.1, minLon + lonSpan * 0.1],
          [maxLat - latSpan * 0.05, maxLon - lonSpan * 0.05],
          [minLat + latSpan * 0.05, maxLon - lonSpan * 0.1],
          [minLat + latSpan * 0.1, minLon + lonSpan * 0.05],
        ];
        L.polygon(shallowPoly, {
          color: "#9CC3DE",
          weight: 1,
          fillColor: "#CFE3F0",
          fillOpacity: 0.75,
          pane: "flood",
        }).addTo(map);

        // Band 2: Moderate (0.5-1.5m, #9CC3DE)
        const modPoly: [number, number][] = [
          [minLat + latSpan * 0.22, minLon + lonSpan * 0.18],
          [maxLat - latSpan * 0.2, minLon + lonSpan * 0.22],
          [maxLat - latSpan * 0.18, maxLon - lonSpan * 0.2],
          [minLat + latSpan * 0.18, maxLon - lonSpan * 0.22],
          [minLat + latSpan * 0.22, minLon + lonSpan * 0.18],
        ];
        L.polygon(modPoly, {
          color: "#5B9BC8",
          weight: 1.25,
          fillColor: "#9CC3DE",
          fillOpacity: 0.82,
          pane: "flood",
        }).addTo(map);

        // Band 3: Deep (>1.5m, #5B9BC8)
        const deepPoly: [number, number][] = [
          [minLat + latSpan * 0.35, minLon + lonSpan * 0.32],
          [maxLat - latSpan * 0.35, minLon + lonSpan * 0.35],
          [maxLat - latSpan * 0.32, maxLon - lonSpan * 0.35],
          [minLat + latSpan * 0.32, maxLon - lonSpan * 0.38],
          [minLat + latSpan * 0.35, minLon + lonSpan * 0.32],
        ];
        L.polygon(deepPoly, {
          color: "#2F7FB8",
          weight: 1.5,
          fillColor: "#5B9BC8",
          fillOpacity: 0.9,
          pane: "flood",
        }).addTo(map);
      }

      // 2. Render Plots in 'plots' pane at 45% opacity with 2px border so blue depths show through
      if (!effectivePlots || effectivePlots.length === 0) return;

      effectivePlots.forEach((ps, idx) => {
        const isUnowned = !ps.ownerName || ps.ownerName.toLowerCase().includes("khas") || ps.ownerName.toLowerCase().includes("unowned");
        const colorIdx = ps.colorIndex ?? (idx % 12);
        const { color: ownerColor, borderStyle } = isUnowned
          ? { color: "#9AA091", borderStyle: "solid" }
          : getOwnerColorStyle(colorIdx);

        const isOwnerIsolated = isolatedOwnerId && ps.ownerId === isolatedOwnerId;
        const isDimmed = isolatedOwnerId && ps.ownerId !== isolatedOwnerId;
        const isHovered = hoveredOwnerId && ps.ownerId === hoveredOwnerId;

        const [lat, lon] = ps.centroid || [25.15, 92.00];
        const delta = 0.0011;
        const rawCoords: [number, number][] =
          ps.boundary && ps.boundary.length > 2
            ? ps.boundary
            : [
                [lat - delta, lon - delta],
                [lat - delta, lon + delta],
                [lat + delta, lon + delta],
                [lat + delta, lon - delta],
                [lat - delta, lon - delta],
              ];

        const latLngs = rawCoords.map((c) => toLeafletLatLng(c as [number, number]));

        // Base owner plot at 45% fill opacity with 2px owner border
        const polygon = L.polygon(latLngs, {
          color: ownerColor,
          weight: isOwnerIsolated || isHovered ? 3 : 2,
          dashArray: borderStyle === "dashed" ? "4, 3" : borderStyle === "dotted" ? "2, 2" : undefined,
          fillColor: ownerColor,
          fillOpacity: isDimmed ? 0.12 : isOwnerIsolated || isHovered ? 0.65 : 0.45,
          pane: "plots",
        }).addTo(map);

        // Submerged plots overlay with blue wave-line hatch (MAP_SPEC §7.4)
        const isFullyFlooded = ps.status === "Submerged" || ps.depthClass === "deep" || (ps.floodedAreaDecimal >= (ps.totalAreaDecimal * 0.8));
        if (isFullyFlooded) {
          L.polygon(latLngs, {
            color: "transparent",
            weight: 0,
            fillColor: `url(#pattern-flood-waves-${mapId})`,
            fillOpacity: isDimmed ? 0.15 : 0.85,
            pane: "plots",
            interactive: false,
          }).addTo(map);
        }

        polygon.bindTooltip(
          `
          <div class="text-xs p-1">
            <div class="font-bold text-slate-900">${ps.ownerName || "Unowned"}</div>
            <div class="text-slate-600">Dag No. ${ps.dagNo} · Khatian ${ps.khatianNo}</div>
            <div class="text-slate-500">Submerged: ${ps.floodedAreaDecimal} dec (${ps.depthClass || "Moderate"})</div>
          </div>
          `,
          { sticky: true, opacity: 0.95 }
        );

        // Dag Number Label
        const center = polygon.getBounds().getCenter();
        const labelIcon = L.divIcon({
          className: "gis-plot-dag-label",
          html: `
            <div class="px-1 py-0.2 rounded bg-white/90 text-[9px] font-bold text-slate-800 shadow-2xs border border-slate-300 leading-tight">
              ${ps.dagNo}
            </div>
          `,
          iconSize: [32, 14],
          iconAnchor: [16, 7],
        });
        L.marker(center, { icon: labelIcon, pane: "markers", interactive: false }).addTo(map);
      });
    },
    [effectivePlots, isolatedOwnerId, hoveredOwnerId]
  );

  return (
    <div className="space-y-4">
      <GisMapCompare
        title="Flood Inundation & Plot Submersion Map"
        hazard="flood"
        mode={isForecast ? "forecast" : "recorded"}
        selectedMouzaId={selectedMouzaId || floodEvent?.mouzaId}
        onSelectMouza={onSelectMouza}
        selectedPlotNo={selectedPlotNo}
        onSelectPlot={onSelectPlot}
        plots={plotGeometryItems}
        setupBeforeHazard={setupBeforeHazard}
        setupAfterHazard={setupAfterHazard}
        beforeLabel="Normal Waterbodies & Cadastre (Before)"
        afterLabel={isForecast ? "Projected Flood Inundation" : "Inundation Extent & Depth Bands (After)"}
        className={className}
      />

      {/* FLOOD OWNER LEGEND PANEL & FLOOD CONTEXT CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8">
          <FloodContextCard
            peakWaterLevelM={floodEvent?.maxDepthM ? floodEvent.maxDepthM + 12.5 : 14.85}
            dangerLevelDiffM={floodEvent?.maxDepthM ? floodEvent.maxDepthM * 0.6 : 1.42}
            durationDays={floodEvent?.durationDays}
            percentFlooded={floodEvent?.floodedAreaDecimal ? 68.4 : 64.5}
          />
        </div>
        <div className="lg:col-span-4">
          <OwnerLegendPanel
            owners={ownerLegendItems}
            isolatedOwnerId={isolatedOwnerId}
            onToggleIsolateOwner={handleToggleIsolateOwner}
            onHoverOwner={(oId) => setHoveredOwnerId(oId)}
          />
        </div>
      </div>
    </div>
  );
}
