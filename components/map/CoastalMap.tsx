"use client";

import React, { useMemo, useCallback } from "react";
import { CoastalGeometry, OwnerRecord, MapArea } from "@/lib/types";
import { GisMapCompare, PlotGeometryItem } from "./GisMapCompare";
import { useLayerStore } from "./chrome/layerStore";

interface CoastalMapProps {
  geometry?: CoastalGeometry | null;
  owners?: OwnerRecord[];
  isForecast?: boolean;
  selectedPlotNo?: string | null;
  onSelectPlot?: (dagNo: string, coords?: [number, number]) => void;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  className?: string;
}

export function CoastalMap({
  geometry,
  owners = [],
  isForecast = false,
  selectedPlotNo,
  onSelectPlot,
  selectedMouzaId,
  onSelectMouza,
  className,
}: CoastalMapProps) {
  const layerStore = useLayerStore();

  // Convert owner records into plot geometry items
  const plotGeometryItems = useMemo<PlotGeometryItem[]>(() => {
    if (!owners || owners.length === 0) return [];
    return owners.map((o) => {
      const [lon, lat] = o.coordinates || [90.69, 22.18];
      const delta = 0.001;
      return {
        dagNo: o.dagNo,
        khatianNo: o.khatianNo,
        ownerName: o.name,
        areaDecimal: o.gainDecimal || o.lossDecimal || 35,
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

  // Setup Leaflet Layers on Map 1 (Before - Baseline Shoreline, Bathymetry, Tidal Flats, Embankment, Mangrove)
  const setupBeforeHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      const g = geometry || (area.hazardLayers as CoastalGeometry);
      if (!g) return;

      // 1. Sea Depth Bands (Bathymetry)
      const bathymetry = g.bathymetryBands || area.hazardLayers?.bathymetryBands;
      if (bathymetry && bathymetry.length > 0) {
        bathymetry.forEach((band: any) => {
          const latLngs = band.polygon.map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#9DC1DA",
            weight: 1,
            fillColor: "#BCD6E8",
            fillOpacity: 0.8,
            pane: "water",
          }).addTo(map);
        });
      }

      // 2. Tidal Mudflats
      const mudflats = g.tidalFlats || area.hazardLayers?.mudflats;
      if (mudflats && mudflats.length > 0) {
        mudflats.forEach((tf: any) => {
          const rawCoords = tf[0] && Array.isArray(tf[0][0]) ? tf[0] : tf;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#A7ABA0",
            weight: 1,
            fillColor: "#E8E4D2",
            fillOpacity: 0.7,
            pane: "water",
          }).addTo(map);
        });
      }

      // 3. Mangrove Belt
      const mangrove = g.mangrovePatch || area.hazardLayers?.mangrove;
      if (mangrove && mangrove.length > 0) {
        mangrove.forEach((mp: any) => {
          const rawCoords = mp[0] && Array.isArray(mp[0][0]) ? mp[0] : mp;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#3F6E20",
            weight: 1,
            fillColor: "#5E8C31",
            fillOpacity: 0.8,
            pane: "landuse",
          }).addTo(map);
        });
      }

      // 4. Polder Embankment Line
      const embankment = g.embankment || area.basemap?.embankments?.[0]?.line;
      if (embankment && embankment.length > 0) {
        const latLngs = embankment.map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polyline(latLngs, {
          color: "#6B6F66",
          weight: 2.75,
          dashArray: "6, 4",
          pane: "hazard",
        }).addTo(map);
      }

      // 5. Baseline Coastline Dashed
      const coastlineBefore = g.coastlineBefore || area.hazardLayers?.shoreline;
      if (coastlineBefore && coastlineBefore.length > 0) {
        const latLngs = coastlineBefore.map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polyline(latLngs, {
          color: "#0369A1",
          weight: 2.5,
          dashArray: "5, 4",
          pane: "hazard",
        }).addTo(map);
      }
    },
    [geometry]
  );

  // Setup Leaflet Layers on Map 2 (After - Current Shoreline, Accretion, Erosion, 'No mouza' label, Forecast)
  const setupAfterHazard = useCallback(
    (map: any, L: any, mapId: string, area: MapArea) => {
      const g = geometry || (area.hazardLayers as CoastalGeometry);
      if (!g) return;

      // 1. Sea Depth Bands (Bathymetry)
      const bathymetry = g.bathymetryBands || area.hazardLayers?.bathymetryBands;
      if (bathymetry && bathymetry.length > 0) {
        bathymetry.forEach((band: any) => {
          const latLngs = band.polygon.map(([lon, lat]: [number, number]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#9DC1DA",
            weight: 1,
            fillColor: "#BCD6E8",
            fillOpacity: 0.8,
            pane: "water",
          }).addTo(map);
        });
      }

      // 2. Seaward Accretion Land (+Gain Green)
      let accretionCenter: [number, number] | null = null;
      const accretion = g.accretionMudflats || area.hazardLayers?.accretionMudflats;
      if (accretion && accretion.length > 0) {
        let totalLat = 0;
        let totalLon = 0;
        let count = 0;

        accretion.forEach((am: any) => {
          const rawCoords = am[0] && Array.isArray(am[0][0]) ? am[0] : am;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => {
            totalLat += lat;
            totalLon += lon;
            count++;
            return [lat, lon];
          });
          L.polygon(latLngs, {
            color: "#166534",
            weight: 1.5,
            fillColor: "#2F9E62",
            fillOpacity: 0.85,
            pane: "hazard",
          }).addTo(map);
        });

        if (count > 0) {
          accretionCenter = [totalLat / count, totalLon / count];
        }
      }

      // 3. Landward Erosion (-Loss Coral Hatch)
      const erosion = g.erosionZone || area.hazardLayers?.erosionZone;
      if (erosion && erosion.length > 0) {
        erosion.forEach((ez: any) => {
          const rawCoords = ez[0] && Array.isArray(ez[0][0]) ? ez[0] : ez;
          const latLngs = (rawCoords as [number, number][]).map(([lon, lat]) => [lat, lon]);
          L.polygon(latLngs, {
            color: "#E4604A",
            weight: 1.5,
            fillColor: `url(#pattern-loss-${mapId})`,
            fillOpacity: 0.9,
            pane: "hazard",
          }).addTo(map);
        });
      }

      // 4. Current Shoreline (Solid Blue)
      const coastlineAfter = g.coastlineAfter || area.hazardLayers?.shoreline;
      if (coastlineAfter && coastlineAfter.length > 0) {
        const latLngs = coastlineAfter.map(([lon, lat]: [number, number]) => [lat, lon]);
        L.polyline(latLngs, {
          color: "#0284C7",
          weight: 2.5,
          pane: "hazard",
        }).addTo(map);
      }

      // 5. Unassigned New Land Hatch & "No mouza" Label
      const centerPos: [number, number] = accretionCenter || (area.bounds
        ? [(area.bounds[1] + area.bounds[3]) / 2, (area.bounds[0] + area.bounds[2]) / 2]
        : [22.18, 90.69]);

      const noMouzaIcon = L.divIcon({
        className: "gis-no-mouza-badge",
        html: `
          <div class="px-2 py-0.5 rounded border border-dashed border-slate-500 bg-white/95 text-[10px] font-bold text-slate-800 shadow-2xs whitespace-nowrap">
            No mouza
          </div>
        `,
        iconSize: [68, 20],
        iconAnchor: [34, 10],
      });

      L.marker(centerPos, {
        icon: noMouzaIcon,
        pane: "mouza-labels",
        interactive: false,
      }).addTo(map);

      // 6. Forecast Shoreline Retreat (Dashed Purple #6A5BD6)
      if (isForecast && coastlineAfter && coastlineAfter.length > 0) {
        const forecastShoreline = coastlineAfter.map(
          ([lon, lat]: [number, number]) => [lat, lon + 0.002] as [number, number]
        );
        L.polyline(forecastShoreline, {
          color: "#6A5BD6",
          weight: 2.5,
          dashArray: "5, 4",
          pane: "hazard",
        }).addTo(map);
      }
    },
    [geometry, isForecast]
  );

  return (
    <GisMapCompare
      title={isForecast ? "Predictive Coastal Shoreline Retreat" : "Coastal Shoreline & Accretion Dynamics"}
      hazard="coastal"
      mode={isForecast ? "forecast" : "recorded"}
      selectedMouzaId={selectedMouzaId}
      onSelectMouza={onSelectMouza}
      selectedPlotNo={selectedPlotNo}
      onSelectPlot={onSelectPlot}
      plots={plotGeometryItems}
      setupBeforeHazard={setupBeforeHazard}
      setupAfterHazard={setupAfterHazard}
      beforeLabel="Baseline Shoreline Survey (Before)"
      afterLabel={isForecast ? "Forecast Shoreline Retreat" : "Current Shoreline & Accretion (After)"}
      className={className}
    />
  );
}
