"use client";

import React, { useMemo, useCallback } from "react";
import { LandslideGeometry, OwnerRecord, MapArea } from "@/lib/types";
import { GisMapCompare, PlotGeometryItem } from "./GisMapCompare";
import { useLayerStore } from "./chrome/layerStore";

interface LandslideMapProps {
  geometry?: LandslideGeometry | null;
  owners?: OwnerRecord[];
  isForecast?: boolean;
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  className?: string;
}

export function LandslideMap({
  geometry,
  owners = [],
  isForecast = false,
  selectedPlotNo,
  onSelectPlot,
  selectedMouzaId,
  onSelectMouza,
  className,
}: LandslideMapProps) {
  const layerStore = useLayerStore();

  // Convert owner records into plot geometry items
  const plotGeometryItems = useMemo<PlotGeometryItem[]>(() => {
    if (!owners || owners.length === 0) return [];
    return owners.map((o) => {
      const [lon, lat] = o.coordinates || [92.03, 22.55];
      const delta = 0.001;
      return {
        dagNo: o.dagNo,
        khatianNo: o.khatianNo,
        ownerName: o.name,
        areaDecimal: o.lossDecimal || 18,
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

  // Setup Leaflet Layers on Map 1 (Before - Intact Slope & Pre-Failure DEM Terrain)
  const setupBeforeHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      // 1. Terrain layers from area rasters
      if (area.terrain) {
        const bounds = area.terrain.rasterBounds;

        // Elevation Tint (Before)
        if (area.terrain.elevationBeforeUrl) {
          L.imageOverlay(area.terrain.elevationBeforeUrl, bounds, {
            opacity: layerStore.hazardOpacity ?? 0.85,
            pane: "terrain",
          }).addTo(map);
        }

        // Hillshade (Before)
        if (area.terrain.hillshadeBeforeUrl) {
          L.imageOverlay(area.terrain.hillshadeBeforeUrl, bounds, {
            opacity: 0.6,
            pane: "terrain",
          }).addTo(map);
        }

        // Contours (10m interval, index contours every 50m / 5th thicker + labelled)
        if (area.terrain.contoursGeoJson?.features) {
          area.terrain.contoursGeoJson.features.forEach((feat: any) => {
            const elev = feat.properties?.elevation ?? 0;
            const isIndex = feat.properties?.isIndex || elev % 50 === 0;
            const coords = feat.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);

            L.polyline(coords, {
              color: isIndex ? "#475569" : "#94A3B8",
              weight: isIndex ? 1.75 : 1,
              opacity: isIndex ? 0.85 : 0.6,
              pane: "terrain",
            }).addTo(map);

            if (isIndex && coords.length > 6) {
              const midCoord = coords[Math.floor(coords.length / 2)];
              const elevIcon = L.divIcon({
                className: "gis-contour-label",
                html: `<span class="text-[9px] font-bold text-slate-700 bg-white/85 px-1 py-0.5 rounded shadow-2xs border border-slate-300">${elev} m</span>`,
                iconSize: [38, 14],
                iconAnchor: [19, 7],
              });
              L.marker(midCoord, { icon: elevIcon, pane: "terrain", interactive: false }).addTo(map);
            }
          });
        }

        // Spot Heights (Peak markers)
        if (area.terrain.spotHeightsGeoJson?.features) {
          area.terrain.spotHeightsGeoJson.features.forEach((feat: any) => {
            const [lon, lat] = feat.geometry.coordinates;
            const elev = feat.properties?.elevation;
            const peakIcon = L.divIcon({
              className: "gis-spot-height-label",
              html: `<div class="flex items-center gap-0.5 text-[9px] font-bold text-slate-800 bg-white/90 px-1 rounded shadow-2xs border border-slate-300">
                <span class="text-amber-600">▲</span><span>${elev}m</span>
              </div>`,
              iconSize: [44, 16],
              iconAnchor: [22, 8],
            });
            L.marker([lat, lon], { icon: peakIcon, pane: "terrain", interactive: false }).addTo(map);
          });
        }
      }

      const g = geometry || (area.hazardLayers as LandslideGeometry);
      if (!g) return;

      // 2. Stream & Road Corridor
      if (g.stream && g.stream.length > 0) {
        const streamCoords = Array.isArray(g.stream[0])
          ? (g.stream as unknown as [number, number][]).map(([lon, lat]) => [lat, lon])
          : [];
        if (streamCoords.length > 0) {
          L.polyline(streamCoords, {
            color: "#0284C7",
            weight: 2,
            pane: "water",
          }).addTo(map);
        }
      }
      if (g.road && g.road.length > 0) {
        const roadCoords = Array.isArray(g.road[0])
          ? (g.road as unknown as [number, number][]).map(([lon, lat]) => [lat, lon])
          : [];
        if (roadCoords.length > 0) {
          L.polyline(roadCoords, {
            color: "#475569",
            weight: 2.5,
            dashArray: "4, 2",
            pane: "roads",
          }).addTo(map);
        }
      }

      // 3. Intact Vegetated Slope (Green polygon)
      if (g.scar?.[0]) {
        const latLngs = g.scar[0].map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polygon(latLngs, {
          color: "#15803D",
          weight: 2,
          fillColor: "#15803D",
          fillOpacity: 0.45,
          pane: "hazard",
        }).addTo(map);
      }
    },
    [geometry, layerStore.hazardOpacity]
  );

  // Setup Leaflet Layers on Map 2 (After - Failure Scar, Debris Runout, Cut/Fill & Forecast)
  const setupAfterHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      // 1. Terrain layers from area rasters
      if (area.terrain) {
        const bounds = area.terrain.rasterBounds;

        // Elevation Tint (After - post-rupture modified DEM)
        if (area.terrain.elevationAfterUrl) {
          L.imageOverlay(area.terrain.elevationAfterUrl, bounds, {
            opacity: layerStore.hazardOpacity ?? 0.85,
            pane: "terrain",
          }).addTo(map);
        }

        // Hillshade (After)
        if (area.terrain.hillshadeAfterUrl) {
          L.imageOverlay(area.terrain.hillshadeAfterUrl, bounds, {
            opacity: 0.6,
            pane: "terrain",
          }).addTo(map);
        }

        // Slope overlay if toggled
        if (layerStore.slope && area.terrain.slopeBeforeUrl) {
          L.imageOverlay(area.terrain.slopeBeforeUrl, bounds, {
            opacity: 0.75,
            pane: "terrain",
          }).addTo(map);
        }

        // Elevation change overlay (Cut/Fill) if toggled
        if (layerStore.elevationChange && area.terrain.elevationChangeUrl) {
          L.imageOverlay(area.terrain.elevationChangeUrl, bounds, {
            opacity: 0.85,
            pane: "terrain",
          }).addTo(map);
        }

        // Contours
        if (area.terrain.contoursGeoJson?.features) {
          area.terrain.contoursGeoJson.features.forEach((feat: any) => {
            const elev = feat.properties?.elevation ?? 0;
            const isIndex = feat.properties?.isIndex || elev % 50 === 0;
            const coords = feat.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);

            L.polyline(coords, {
              color: isIndex ? "#475569" : "#94A3B8",
              weight: isIndex ? 1.75 : 1,
              opacity: isIndex ? 0.85 : 0.6,
              pane: "terrain",
            }).addTo(map);
          });
        }

        // Spot Heights
        if (area.terrain.spotHeightsGeoJson?.features) {
          area.terrain.spotHeightsGeoJson.features.forEach((feat: any) => {
            const [lon, lat] = feat.geometry.coordinates;
            const elev = feat.properties?.elevation;
            const peakIcon = L.divIcon({
              className: "gis-spot-height-label",
              html: `<div class="flex items-center gap-0.5 text-[9px] font-bold text-slate-800 bg-white/90 px-1 rounded shadow-2xs border border-slate-300">
                <span class="text-amber-600">▲</span><span>${elev}m</span>
              </div>`,
              iconSize: [44, 16],
              iconAnchor: [22, 8],
            });
            L.marker([lat, lon], { icon: peakIcon, pane: "terrain", interactive: false }).addTo(map);
          });
        }
      }

      const g = geometry || (area.hazardLayers as LandslideGeometry);
      if (!g) return;

      // 2. Stream & Road
      if (g.stream && g.stream.length > 0) {
        const streamCoords = Array.isArray(g.stream[0])
          ? (g.stream as unknown as [number, number][]).map(([lon, lat]) => [lat, lon])
          : [];
        if (streamCoords.length > 0) {
          L.polyline(streamCoords, {
            color: "#0284C7",
            weight: 2,
            pane: "water",
          }).addTo(map);
        }
      }
      if (g.road && g.road.length > 0) {
        const roadCoords = Array.isArray(g.road[0])
          ? (g.road as unknown as [number, number][]).map(([lon, lat]) => [lat, lon])
          : [];
        if (roadCoords.length > 0) {
          L.polyline(roadCoords, {
            color: "#475569",
            weight: 2.5,
            dashArray: "4, 2",
            pane: "roads",
          }).addTo(map);
        }
      }

      // 3. Hazard Thematics (Recorded vs Forecast)
      if (isForecast) {
        // Susceptibility Zones
        if (g.susceptibilityZones) {
          const zoneColors: Record<string, string> = {
            moderate: "#FDE047",
            high: "#FB923C",
            "very high": "#EF4444",
          };
          g.susceptibilityZones.forEach((z) => {
            if (!z.polygon?.[0]) return;
            const latLngs = z.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
            const lvlKey = z.level.toLowerCase();
            L.polygon(latLngs, {
              color: zoneColors[lvlKey] || "#FB923C",
              weight: 1.5,
              fillColor: zoneColors[lvlKey] || "#FB923C",
              fillOpacity: lvlKey === "very high" ? 0.65 : lvlKey === "high" ? 0.5 : 0.35,
              pane: "hazard",
            }).addTo(map);
          });
        }

        // Predicted Rupture Scar Outline (Red Dashed)
        if (g.predictedScar?.[0]) {
          const latLngs = g.predictedScar[0].map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#DC2626",
            weight: 2.5,
            dashArray: "6, 4",
            fillColor: "#DC2626",
            fillOpacity: 0.3,
            pane: "hazard",
          }).addTo(map);
        }
      } else {
        // Recorded: Earth-Brown Failure Scar
        if (g.scar?.[0]) {
          const latLngs = g.scar[0].map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#78350F",
            weight: 2.5,
            fillColor: "#78350F",
            fillOpacity: 0.85,
            pane: "hazard",
          }).addTo(map);
        }

        // Debris Runout Zone (Loss Coral Hatch)
        if (g.debrisRunout?.[0]) {
          const latLngs = g.debrisRunout[0].map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#92400E",
            weight: 1.5,
            fillColor: `url(#${mapId}-loss-hatch)`,
            fillOpacity: 0.8,
            pane: "hazard",
          }).addTo(map);

          // Downslope Arrow Marker placed at center of debris runout
          const pts = g.debrisRunout[0];
          const dLat = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
          const dLon = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
          const arrowIcon = L.divIcon({
            className: "bg-transparent border-0",
            html: `<div class="text-red-600 font-extrabold text-xl select-none filter drop-shadow">⬇</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          L.marker([dLat, dLon], { icon: arrowIcon, pane: "markers" }).addTo(map);
        }
      }
    },
    [geometry, isForecast, layerStore.hazardOpacity, layerStore.slope, layerStore.elevationChange]
  );

  return (
    <GisMapCompare
      title="Landslide Slope Failure & Debris Runout"
      hazard="landslide"
      mode={isForecast ? "forecast" : "recorded"}
      beforeLabel="Pre-Failure Terrain (Before)"
      afterLabel={isForecast ? "Susceptibility Projection (Forecast)" : "Failure Scarp & Debris Runout (After)"}
      selectedPlotNo={selectedPlotNo}
      onSelectPlot={onSelectPlot}
      selectedMouzaId={selectedMouzaId}
      onSelectMouza={onSelectMouza}
      plots={plotGeometryItems}
      setupBeforeHazard={setupBeforeHazard}
      setupAfterHazard={setupAfterHazard}
      className={className}
    />
  );
}
