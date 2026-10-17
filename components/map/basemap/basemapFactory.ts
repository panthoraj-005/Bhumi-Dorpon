import { Basemap, MouzaSummary } from "@/lib/types";
import { GIS_COLORS } from "./constants";
import { Language, formatNumberLocalized, getLocalizedMouzaName } from "@/lib/translations";

export interface BasemapOptions {
  mapIdPrefix: string;
  selectedMouzaId?: string | null;
  onSelectMouza?: (mouzaId: string) => void;
  onHoverMouza?: (mouzaId: string | null) => void;
  formatAreaText?: (decimal: number) => string;
  language?: Language;
}

export interface BasemapController {
  setGroupVisibility: (groupKey: string, visible: boolean) => void;
  setSyntheticBasemapVisible: (visible: boolean) => void;
  setSelectedMouza: (mouzaId: string | null) => void;
  highlightMouza: (mouzaId: string | null) => void;
  destroy: () => void;
}

/**
 * Builds the complete Light GIS Basemap layers on a Leaflet map.
 */
export function createBasemapLayers(
  map: any,
  L: any,
  basemap: Basemap,
  mouzas: MouzaSummary[],
  options: BasemapOptions
): BasemapController {
  const { mapIdPrefix, selectedMouzaId, onSelectMouza, onHoverMouza, formatAreaText } = options;

  // Groups of layers
  const layerGroups: Record<string, any> = {
    land: L.layerGroup().addTo(map),
    landuse: L.layerGroup().addTo(map),
    water: L.layerGroup().addTo(map),
    roads: L.layerGroup().addTo(map),
    buildings: L.layerGroup().addTo(map),
    admin: L.layerGroup().addTo(map),
    waterLabels: L.layerGroup().addTo(map),
  };

  const mouzaPolygonLayers = new Map<string, any>();
  const mouzaBoundaryLayers = new Map<string, any>();

  // 1. LAND BASE
  if (basemap.land) {
    for (const ring of basemap.land) {
      const latLngs = ring.map(([lon, lat]: [number, number]) => [lat, lon]);
      L.polygon(latLngs, {
        pane: "land",
        fillColor: GIS_COLORS.landBase,
        fillOpacity: 1,
        stroke: false,
        interactive: false,
      }).addTo(layerGroups.land);
    }
  }

  // 2. MOUZA TINTS (6 rotating faint tints + interactive hover/click)
  for (let i = 0; i < mouzas.length; i++) {
    const m = mouzas[i];
    if (!m.polygon?.[0]) continue;

    const latLngs = m.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
    const tintColor = GIS_COLORS.mouzaTints[i % GIS_COLORS.mouzaTints.length];
    const isSelected = selectedMouzaId === m.id;

    const polyLayer = L.polygon(latLngs, {
      pane: "land",
      fillColor: tintColor,
      fillOpacity: isSelected ? 0.95 : 0.85,
      stroke: false,
      interactive: true,
    });

    // Accessible Tooltip
    const isBn = options.language === "bn";
    const totalAreaStr = formatAreaText
      ? formatAreaText(m.areaDecimal)
      : isBn
      ? `${formatNumberLocalized(m.areaDecimal, "bn")} শতাংশ`
      : `${m.areaDecimal} dec`;
    const lossStr = m.lossDecimal
      ? formatAreaText
        ? formatAreaText(m.lossDecimal)
        : isBn
        ? `${formatNumberLocalized(m.lossDecimal, "bn")} শতাংশ`
        : `${m.lossDecimal} dec`
      : isBn
      ? "০ শতাংশ"
      : "0 dec";
    const gainStr = m.gainDecimal
      ? formatAreaText
        ? formatAreaText(m.gainDecimal)
        : isBn
        ? `${formatNumberLocalized(m.gainDecimal, "bn")} শতাংশ`
        : `${m.gainDecimal} dec`
      : isBn
      ? "০ শতাংশ"
      : "0 dec";

    const mouzaTitle = isBn ? getLocalizedMouzaName(m.id, m.name, "bn") : m.name;
    const jlText = isBn ? formatNumberLocalized(m.jlNo, "bn") : m.jlNo;
    const pctText = isBn ? formatNumberLocalized(m.percent || 0, "bn") : `${m.percent || 0}`;
    const ownersText = isBn
      ? `${formatNumberLocalized(m.affectedOwnersCount, "bn")} জন মালিক`
      : `${m.affectedOwnersCount} owners`;

    const tooltipHtml = `
      <div class="px-2 py-1.5 text-xs font-sans text-ink leading-tight">
        <div class="font-bold flex items-center justify-between gap-3 text-[13px]">
          <span>${mouzaTitle}</span>
          <span class="text-secondary text-[11px] font-normal">${jlText}</span>
        </div>
        <div class="mt-1 text-[11px] text-muted space-y-0.5">
          <div>${isBn ? "জমির পরিমাণ:" : "Area:"} <span class="font-semibold text-ink">${totalAreaStr}</span> (${pctText}%)</div>
          ${m.lossDecimal ? `<div>${isBn ? "ভাঙন/ক্ষতি:" : "Loss:"} <span class="font-bold text-loss">-${lossStr}</span></div>` : ""}
          ${m.gainDecimal ? `<div>${isBn ? "পয়স্তি/বৃদ্ধি:" : "Gain:"} <span class="font-bold text-gain">+${gainStr}</span></div>` : ""}
          ${m.affectedOwnersCount ? `<div>${isBn ? "ক্ষতিগ্রস্ত:" : "Affected:"} <span class="font-semibold text-ink">${ownersText}</span></div>` : ""}
        </div>
      </div>
    `;

    polyLayer.bindTooltip(tooltipHtml, {
      sticky: true,
      direction: "top",
      className: "bhumidorpon-gis-tooltip",
    });

    polyLayer.on("mouseover", () => {
      polyLayer.setStyle({ fillOpacity: 0.98 });
      onHoverMouza?.(m.id);
    });

    polyLayer.on("mouseout", () => {
      polyLayer.setStyle({ fillOpacity: selectedMouzaId === m.id ? 0.95 : 0.85 });
      onHoverMouza?.(null);
    });

    polyLayer.on("click", () => {
      onSelectMouza?.(m.id);
    });

    polyLayer.addTo(layerGroups.land);
    mouzaPolygonLayers.set(m.id, polyLayer);
  }

  // 3. LANDUSE PATCHES
  if (basemap.landuse) {
    for (const patch of basemap.landuse) {
      if (!patch.polygon?.[0]) continue;
      const latLngs = patch.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
      let fillColor = GIS_COLORS.farmland;
      if (patch.type === "vegetation") fillColor = GIS_COLORS.vegetation;
      if (patch.type === "settlement") fillColor = GIS_COLORS.settlement;

      L.polygon(latLngs, {
        pane: "landuse",
        fillColor,
        fillOpacity: 0.85,
        stroke: false,
        interactive: false,
      }).addTo(layerGroups.landuse);
    }
  }

  // 4. WATER (River / Sea / Beel / Tidal Flat)
  if (basemap.water) {
    for (const w of basemap.water) {
      if (!w.polygon?.[0]) continue;
      const latLngs = w.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);

      if (w.type === "tidal_flat") {
        L.polygon(latLngs, {
          pane: "water",
          fillColor: GIS_COLORS.tidalFlat,
          fillOpacity: 0.88,
          color: "#BFB8A4",
          weight: 1,
          dashArray: "2, 3",
          interactive: false,
        }).addTo(layerGroups.water);
      } else if (w.type === "sea") {
        L.polygon(latLngs, {
          pane: "water",
          fillColor: GIS_COLORS.seaDeep,
          fillOpacity: 0.9,
          color: GIS_COLORS.waterOutline,
          weight: 1,
          interactive: false,
        }).addTo(layerGroups.water);
      } else {
        // Main river or beel
        L.polygon(latLngs, {
          pane: "water",
          fillColor: GIS_COLORS.waterFill,
          fillOpacity: 0.95,
          color: GIS_COLORS.waterOutline,
          weight: 1.25,
          interactive: false,
        }).addTo(layerGroups.water);
      }
    }
  }

  // 5. WATERLINES (Drainage Canals)
  if (basemap.waterlines) {
    for (const wl of basemap.waterlines) {
      const latLngs = wl.line.map(([lon, lat]: [number, number]) => [lat, lon]);
      L.polyline(latLngs, {
        pane: "water",
        color: GIS_COLORS.canal,
        weight: 1.75,
        opacity: 0.9,
        interactive: false,
      }).addTo(layerGroups.water);
    }
  }

  // 6. ROADS WITH CASING
  if (basemap.roads) {
    for (const rd of basemap.roads) {
      const latLngs = rd.line.map(([lon, lat]: [number, number]) => [lat, lon]);
      const isMajor = rd.type === "major";

      // Casing line (underneath)
      L.polyline(latLngs, {
        pane: "roads",
        color: isMajor ? GIS_COLORS.roadMajorCasing : GIS_COLORS.roadMinorCasing,
        weight: isMajor ? 4.5 : 3.2,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(layerGroups.roads);

      // Inner fill line (on top)
      L.polyline(latLngs, {
        pane: "roads",
        color: isMajor ? GIS_COLORS.roadMajorFill : GIS_COLORS.roadMinorFill,
        weight: isMajor ? 2.5 : 1.6,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(layerGroups.roads);
    }
  }

  // 7. EMBANKMENTS (Dashed with ticks)
  if (basemap.embankments) {
    for (const eb of basemap.embankments) {
      const latLngs = eb.line.map(([lon, lat]: [number, number]) => [lat, lon]);
      L.polyline(latLngs, {
        pane: "roads",
        color: GIS_COLORS.embankment,
        weight: 2.2,
        dashArray: "7, 5",
        opacity: 0.95,
        interactive: false,
      }).addTo(layerGroups.roads);
    }
  }

  // 8. BUILDINGS (Lightweight footprints)
  if (basemap.buildings) {
    for (const bld of basemap.buildings) {
      if (!bld.polygon?.[0]) continue;
      const latLngs = bld.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
      L.polygon(latLngs, {
        pane: "buildings",
        fillColor: GIS_COLORS.buildingFill,
        fillOpacity: 0.85,
        color: GIS_COLORS.buildingOutline,
        weight: 0.75,
        interactive: false,
      }).addTo(layerGroups.buildings);
    }
  }

  // 9. POIs (School, Mosque, Market, Health Center)
  if (basemap.pois) {
    for (const poi of basemap.pois) {
      const [pLon, pLat] = poi.coordinates;
      const poiIcon = L.divIcon({
        className: "gis-poi-icon",
        html: `
          <div class="flex items-center justify-center w-4 h-4 rounded-full bg-surface/90 border border-border shadow-2xs" title="${poi.name}">
            <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([pLat, pLon], {
        pane: "buildings",
        icon: poiIcon,
        interactive: true,
      })
        .bindTooltip(`<div class="px-1.5 py-0.5 text-[11px] font-medium text-ink">${poi.name}</div>`, {
          direction: "top",
          className: "bhumidorpon-gis-tooltip",
        })
        .addTo(layerGroups.buildings);
    }
  }

  // 10. UPAZILA BOUNDARY (Dash-dot 2px)
  if (basemap.upazila?.[0]) {
    const latLngs = basemap.upazila[0].map(([lon, lat]: [number, number]) => [lat, lon]);
    L.polygon(latLngs, {
      pane: "admin",
      fill: false,
      color: GIS_COLORS.upazilaBoundary,
      weight: 2,
      dashArray: "8, 4, 2, 4",
      interactive: false,
    }).addTo(layerGroups.admin);
  }

  // 11. MOUZA BOUNDARIES (Solid 1.25px, Selected 2.5px)
  for (const m of mouzas) {
    if (!m.polygon?.[0]) continue;
    const latLngs = m.polygon[0].map(([lon, lat]: [number, number]) => [lat, lon]);
    const isSelected = selectedMouzaId === m.id;

    const bLayer = L.polygon(latLngs, {
      pane: "admin",
      fill: false,
      color: isSelected ? GIS_COLORS.mouzaBoundarySelected : GIS_COLORS.mouzaBoundary,
      weight: isSelected ? 2.5 : 1.25,
      interactive: false,
    }).addTo(layerGroups.admin);

    mouzaBoundaryLayers.set(m.id, bLayer);
  }

  // 12. WATER LABELS (Rotated River/Sea text)
  if (basemap.labels) {
    for (const lb of basemap.labels) {
      const [lLon, lLat] = lb.coordinates;
      const bearing = lb.bearing || 0;

      const labelIcon = L.divIcon({
        className: "gis-water-label",
        html: `
          <div style="transform: rotate(${bearing}deg); transform-origin: center center;" class="pointer-events-none select-none">
            <span class="text-[13px] font-serif italic font-bold tracking-wider text-[#5B87A6] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              ${lb.text}
            </span>
          </div>
        `,
        iconSize: [200, 30],
        iconAnchor: [100, 15],
      });

      L.marker([lLat, lLon], {
        pane: "water-labels",
        icon: labelIcon,
        interactive: false,
      }).addTo(layerGroups.waterLabels);
    }
  }

  return {
    setGroupVisibility: (groupKey: string, visible: boolean) => {
      const group = layerGroups[groupKey];
      if (!group) return;
      if (visible && !map.hasLayer(group)) {
        map.addLayer(group);
      } else if (!visible && map.hasLayer(group)) {
        map.removeLayer(group);
      }
    },

    setSyntheticBasemapVisible: (visible: boolean) => {
      const syntheticGroups = ["land", "landuse", "water", "roads", "buildings"];
      syntheticGroups.forEach((key) => {
        const group = layerGroups[key];
        if (!group) return;
        if (visible && !map.hasLayer(group)) {
          map.addLayer(group);
        } else if (!visible && map.hasLayer(group)) {
          map.removeLayer(group);
        }
      });
    },

    setSelectedMouza: (mouzaId: string | null) => {
      mouzaBoundaryLayers.forEach((bLayer, mId) => {
        const isSel = mId === mouzaId;
        bLayer.setStyle({
          color: isSel ? GIS_COLORS.mouzaBoundarySelected : GIS_COLORS.mouzaBoundary,
          weight: isSel ? 2.5 : 1.25,
        });
      });
      mouzaPolygonLayers.forEach((pLayer, mId) => {
        const isSel = mId === mouzaId;
        pLayer.setStyle({
          fillOpacity: isSel ? 0.95 : 0.85,
        });
      });
    },

    highlightMouza: (mouzaId: string | null) => {
      if (!mouzaId) {
        // Reset to selected state
        mouzaBoundaryLayers.forEach((bLayer, mId) => {
          const isSel = mId === selectedMouzaId;
          bLayer.setStyle({
            color: isSel ? GIS_COLORS.mouzaBoundarySelected : GIS_COLORS.mouzaBoundary,
            weight: isSel ? 2.5 : 1.25,
          });
        });
        return;
      }

      mouzaBoundaryLayers.forEach((bLayer, mId) => {
        if (mId === mouzaId) {
          bLayer.setStyle({
            color: GIS_COLORS.mouzaBoundaryHover,
            weight: 3,
          });
          bLayer.bringToFront();
        } else {
          const isSel = mId === selectedMouzaId;
          bLayer.setStyle({
            color: isSel ? GIS_COLORS.mouzaBoundarySelected : GIS_COLORS.mouzaBoundary,
            weight: isSel ? 2.5 : 1.25,
          });
        }
      });
    },

    destroy: () => {
      for (const group of Object.values(layerGroups)) {
        map.removeLayer(group);
      }
      mouzaPolygonLayers.clear();
      mouzaBoundaryLayers.clear();
    },
  };
}
