"use client";

import React, { useMemo, useCallback } from "react";
import { RiverErosionGeometry, OwnerRecord, MapArea } from "@/lib/types";
import { GisMapCompare, PlotGeometryItem } from "./GisMapCompare";
import { useLayerStore } from "./chrome/layerStore";
import { useAppStore } from "@/stores/appStore";

interface RiverErosionMapProps {
  geometry?: RiverErosionGeometry | null;
  owners?: OwnerRecord[];
  beforeYear?: number;
  afterYear?: number;
  isForecast?: boolean;
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  className?: string;
}

export function RiverErosionMap({
  geometry,
  owners = [],
  beforeYear = 2019,
  afterYear = 2024,
  isForecast = false,
  selectedPlotNo,
  onSelectPlot,
  selectedMouzaId,
  onSelectMouza,
  className,
}: RiverErosionMapProps) {
  const layerStore = useLayerStore();
  const { language } = useAppStore();

  // Convert owner records into plot geometry items for interactive inspection
  const plotGeometryItems = useMemo<PlotGeometryItem[]>(() => {
    if (!owners || owners.length === 0) return [];
    return owners.map((o) => {
      const [lon, lat] = o.coordinates || [89.64, 24.56];
      const delta = 0.0011;
      return {
        dagNo: o.dagNo,
        khatianNo: o.khatianNo,
        ownerName: o.name,
        areaDecimal: o.lossDecimal || 25,
        lossDecimal: o.lossDecimal,
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

  // Map 1 (Before) Hazard Setup
  // In Forecast mode: MAP_SPEC 7.1 specifies Before map shows current river state
  const setupBeforeHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      const g = geometry || (area.hazardLayers as RiverErosionGeometry);
      if (!g) return;

      const riverCoords = isForecast
        ? (g.riverAfter && g.riverAfter.length > 0 ? g.riverAfter : g.riverBefore)
        : g.riverBefore;

      if (riverCoords && riverCoords.length > 0) {
        // Baseline Bankline (Dark Blue #1E3A8A)
        const bankLineCoords = riverCoords.map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polyline(bankLineCoords, {
          color: isForecast ? "#DC2626" : "#1E3A8A",
          weight: 3,
          pane: "hazard",
        }).addTo(map);
      }

      // History lines if toggled
      if (area.historyLines && area.historyLines.length > 0) {
        area.historyLines.forEach((hl) => {
          const latLngs = hl.line.map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polyline(latLngs, {
            color: "#64748B",
            weight: 1,
            dashArray: "3, 3",
            opacity: 0.65,
            pane: "hazard",
          }).addTo(map);
        });
      }
    },
    [geometry, isForecast]
  );

  // Map 2 (After) Hazard Setup
  // In Recorded mode: Current bankline, eroded lost strip, 3 transects with badges
  // In Forecast mode: Projected retreat line (purple dash), uncertainty band (purple hatch), transects
  const setupAfterHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      const g = geometry || (area.hazardLayers as RiverErosionGeometry);
      if (!g) return;

      // 1. Current Bankline (Coral #DC2626)
      if (g.riverAfter && g.riverAfter.length > 0) {
        const afterBankCoords = g.riverAfter.map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polyline(afterBankCoords, {
          color: "#DC2626",
          weight: 2.5,
          pane: "hazard",
        }).addTo(map);
      }

      // 2. Lost Strip as Coral Hatch
      const lossStrip = g.lossStrip || (area.hazardLayers?.lossStrip);
      if (lossStrip?.[0]) {
        const stripLatLngs = lossStrip[0].map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polygon(stripLatLngs, {
          color: "#E4604A",
          weight: 1.5,
          fillColor: `url(#pattern-loss-${mapId})`,
          fillOpacity: 0.95,
          pane: "hazard",
        }).addTo(map);
      }

      // 3. Transects & Displacement Badges (e.g. "42 m")
      const transects = g.transects || area.hazardLayers?.transects;
      if (transects && transects.length > 0) {
        transects.forEach((t) => {
          const lineLatLngs = [
            [t.start[1], t.start[0]],
            [t.end[1], t.end[0]],
          ];
          L.polyline(lineLatLngs, {
            color: "#D97706",
            weight: 2,
            dashArray: "4, 3",
            pane: "hazard",
          }).addTo(map);

          const midLat = (t.start[1] + t.end[1]) / 2;
          const midLon = (t.start[0] + t.end[0]) / 2;

          const labelIcon = L.divIcon({
            className: "gis-transect-badge",
            html: `
              <div class="bg-amber-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs border border-white whitespace-nowrap select-none">
                ${t.retreatDistanceM} m
              </div>
            `,
            iconSize: [42, 18],
            iconAnchor: [21, 9],
          });

          L.marker([midLat, midLon], {
            icon: labelIcon,
            pane: "mouza-labels",
            interactive: false,
          }).addTo(map);
        });
      }

      // 4. Forecast Layers (Uncertainty Band & Projected Retreat Line)
      if (isForecast) {
        const uncertaintyBand = g.uncertaintyBand || area.hazardLayers?.uncertaintyBand;
        if (uncertaintyBand?.[0]) {
          const bandLatLngs = uncertaintyBand[0].map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(bandLatLngs, {
            color: "#6A5BD6",
            weight: 1.5,
            dashArray: "4, 2",
            fillColor: `url(#pattern-forecast-${mapId})`,
            fillOpacity: 0.8,
            pane: "hazard",
          }).addTo(map);
        }

        const forecastLine = g.forecastRetreatLine || area.hazardLayers?.forecastRetreatLine;
        if (forecastLine && forecastLine.length > 0) {
          const fCoords = forecastLine.map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polyline(fCoords, {
            color: "#6A5BD6",
            weight: 3,
            dashArray: "6, 4",
            pane: "hazard",
          }).addTo(map);
        }
      }
    },
    [geometry, isForecast]
  );

  const beforeTitle = isForecast
    ? language === "bn"
      ? "বর্তমান জরিপকৃত তীররেখা (ভিত্তিরেখা)"
      : "Current Surveyed Bankline (Baseline)"
    : language === "bn"
      ? `${beforeYear.toLocaleString("bn-BD")} জরিপকৃত তীররেখা`
      : `${beforeYear} Surveyed Bankline`;
  const afterTitle = isForecast
    ? language === "bn"
      ? `${afterYear.toLocaleString("bn-BD")} এমএল প্রক্ষেপিত তীররেখা`
      : `${afterYear} ML Projected Bankline`
    : language === "bn"
      ? `${afterYear.toLocaleString("bn-BD")} উপগ্রহ তীররেখা`
      : `${afterYear} Satellite Bankline`;

  return (
    <GisMapCompare
      title={
        isForecast
          ? language === "bn"
            ? "প্রক্ষেপিত নদীভাঙন মডেল"
            : "Projected Bankline Retreat Model"
          : language === "bn"
            ? "নদীভাঙন ও তীররেখা পরিবর্তন মূল্যায়ন"
            : "Riverside Bank Erosion Assessment"
      }
      hazard="river_erosion"
      mode={isForecast ? "forecast" : "recorded"}
      selectedMouzaId={selectedMouzaId}
      onSelectMouza={onSelectMouza}
      selectedPlotNo={selectedPlotNo}
      onSelectPlot={onSelectPlot}
      plots={plotGeometryItems}
      setupBeforeHazard={setupBeforeHazard}
      setupAfterHazard={setupAfterHazard}
      beforeLabel={beforeTitle}
      afterLabel={afterTitle}
      className={className}
    />
  );
}
