"use client";

import React, { useMemo, useCallback } from "react";
import { CharGeometry, OwnerRecord, MapArea } from "@/lib/types";
import { GisMapCompare, PlotGeometryItem } from "./GisMapCompare";
import { useLayerStore } from "./chrome/layerStore";

interface CharMapProps {
  geometry?: CharGeometry | null;
  owners?: OwnerRecord[];
  isForecast?: boolean;
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  className?: string;
}

export function CharMap({
  geometry,
  owners = [],
  isForecast = false,
  selectedPlotNo,
  onSelectPlot,
  selectedMouzaId,
  onSelectMouza,
  className,
}: CharMapProps) {
  const layerStore = useLayerStore();

  // Convert owner records into plot geometry items
  const plotGeometryItems = useMemo<PlotGeometryItem[]>(() => {
    if (!owners || owners.length === 0) return [];
    return owners.map((o) => {
      const [lon, lat] = o.coordinates || [89.65, 24.58];
      const delta = 0.001;
      return {
        dagNo: o.dagNo,
        khatianNo: o.khatianNo,
        ownerName: o.name,
        areaDecimal: o.gainDecimal || o.lossDecimal || 30,
        gainDecimal: o.gainDecimal,
        lossDecimal: o.lossDecimal,
        status: o.compensationStatus,
        centroid: [lon, lat],
        coordinates: [
          [
            [lon - delta, lat - delta],
            [lon + delta, lat - delta],
            [lon + delta, lat + delta],
            [lon - delta, lat + delta],
            [lon - delta, lat - delta],
          ],
        ],
      };
    });
  }, [owners]);

  // Setup Leaflet Layers on Map 1 (Before - Baseline Sand Islands & Braided Channels)
  const setupBeforeHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      const g = geometry || (area.hazardLayers as CharGeometry);
      if (!g) return;

      // 1. Braided River Channels (if present in hazard layer)
      if (g.riverChannel && g.riverChannel.length > 0) {
        g.riverChannel.forEach((ch) => {
          const latLngs = ch.map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#9DC1DA",
            weight: 1.25,
            fillColor: "#CFE3F0",
            fillOpacity: 0.9,
            pane: "water",
          }).addTo(map);
        });
      }

      // 2. Baseline Islands in Sand Colour (#EADFC0)
      const islands = g.islandsBaseline || g.islandsCurrent || area.hazardLayers?.islands;
      if (islands && islands.length > 0) {
        islands.forEach((island: any) => {
          const rawCoords = island[0] && Array.isArray(island[0][0]) ? island[0] : island;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#D4C5A2",
            weight: 2,
            fillColor: "#EADFC0",
            fillOpacity: 0.92,
            pane: "hazard",
          }).addTo(map);
        });
      }
    },
    [geometry]
  );

  // Setup Leaflet Layers on Map 2 (After - Current, Accretion, Erosion, Khas hatch, Forecast)
  const setupAfterHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      const g = geometry || (area.hazardLayers as CharGeometry);
      if (!g) return;

      // 1. Last year's baseline shape as dashed reference line
      const baseline = g.islandsBaseline || area.hazardLayers?.islands;
      if (baseline && baseline.length > 0) {
        baseline.forEach((island: any) => {
          const rawCoords = island[0] && Array.isArray(island[0][0]) ? island[0] : island;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polyline(latLngs, {
            color: "#A8A29E",
            weight: 1.75,
            dashArray: "4, 3",
            pane: "hazard",
          }).addTo(map);
        });
      }

      // 2. Current Stable Island Core
      const currentIslands = g.islandsCurrent || area.hazardLayers?.islands;
      if (currentIslands && currentIslands.length > 0) {
        currentIslands.forEach((island: any) => {
          const rawCoords = island[0] && Array.isArray(island[0][0]) ? island[0] : island;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#D4C5A2",
            weight: 2,
            fillColor: "#EADFC0",
            fillOpacity: 0.88,
            pane: "hazard",
          }).addTo(map);
        });
      }

      // 3. Accretion Tips (Green Gain #2F9E62)
      const accretion = g.accretionTips || area.hazardLayers?.accretionTips;
      if (accretion && accretion.length > 0) {
        accretion.forEach((tip: any) => {
          const rawCoords = tip[0] && Array.isArray(tip[0][0]) ? tip[0] : tip;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#23814F",
            weight: 1.5,
            fillColor: "#2F9E62",
            fillOpacity: 0.82,
            pane: "hazard",
          }).addTo(map);
        });
      }

      // 4. Erosion Flanks (Coral Loss #E4604A)
      const erosion = g.erosionFlanks || area.hazardLayers?.erosionFlanks;
      if (erosion && erosion.length > 0) {
        erosion.forEach((flank: any) => {
          const rawCoords = flank[0] && Array.isArray(flank[0][0]) ? flank[0] : flank;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#C84934",
            weight: 1.5,
            fillColor: "#E4604A",
            fillOpacity: 0.8,
            pane: "hazard",
          }).addTo(map);
        });
      }

      // 5. Unowned Khas Land (Grey Hatch #9AA091)
      const khas = g.unownedKhasLand || area.hazardLayers?.unownedKhasLand;
      if (khas && khas.length > 0) {
        khas.forEach((kl: any) => {
          const rawCoords = kl[0] && Array.isArray(kl[0][0]) ? kl[0] : kl;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#64748B",
            weight: 1.5,
            dashArray: "3, 2",
            fillColor: `url(#pattern-khas-${mapId})`,
            fillOpacity: 0.9,
            pane: "hazard",
          }).addTo(map);
        });
      }

      // 6. Forecast Island Outline (Purple dashed #6A5BD6)
      if (isForecast) {
        const forecastIslands = g.forecastIslands || area.hazardLayers?.forecastIslands;
        if (forecastIslands && forecastIslands.length > 0) {
          forecastIslands.forEach((fIsland: any) => {
            const rawCoords = fIsland[0] && Array.isArray(fIsland[0][0]) ? fIsland[0] : fIsland;
            const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
            L.polygon(latLngs, {
              color: "#6A5BD6",
              weight: 2.5,
              dashArray: "6, 4",
              fillColor: `url(#pattern-forecast-${mapId})`,
              fillOpacity: 0.65,
              pane: "hazard",
            }).addTo(map);
          });
        }
      }

      // 7. Unassigned Label if area has no mouza assigned to the char
      const hasAssignedMouza = area.mouzas && area.mouzas.length > 0;
      if (!hasAssignedMouza && area.bounds) {
        const centerLat = (area.bounds[1] + area.bounds[3]) / 2;
        const centerLon = (area.bounds[0] + area.bounds[2]) / 2;
        const unassignedIcon = L.divIcon({
          className: "gis-unassigned-char-badge",
          html: `
            <div class="px-2 py-0.5 rounded border border-dashed border-slate-500 bg-white/95 text-[10px] font-bold text-slate-800 shadow-2xs whitespace-nowrap">
              Unassigned Char
            </div>
          `,
          iconSize: [84, 20],
          iconAnchor: [42, 10],
        });
        L.marker([centerLat, centerLon], {
          icon: unassignedIcon,
          pane: "mouza-labels",
          interactive: false,
        }).addTo(map);
      }
    },
    [geometry, isForecast]
  );

  return (
    <GisMapCompare
      title={isForecast ? "Predictive Alluvial Consolidation Model" : "Char Formation & Alluvial Accretion Survey"}
      hazard="char"
      mode={isForecast ? "forecast" : "recorded"}
      selectedMouzaId={selectedMouzaId}
      onSelectMouza={onSelectMouza}
      selectedPlotNo={selectedPlotNo}
      onSelectPlot={onSelectPlot}
      plots={plotGeometryItems}
      setupBeforeHazard={setupBeforeHazard}
      setupAfterHazard={setupAfterHazard}
      beforeLabel="Baseline Char Survey (Before)"
      afterLabel={isForecast ? "1-Year Morphological Projection" : "Current Accretion State (After)"}
      className={className}
    />
  );
}
