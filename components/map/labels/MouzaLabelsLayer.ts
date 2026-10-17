import { MouzaSummary, HazardType, DataMode } from "@/lib/types";
import { Language, formatNumberLocalized, getLocalizedMouzaName } from "@/lib/translations";

export interface MouzaLabelsOptions {
  selectedMouzaId?: string | null;
  hazard?: HazardType;
  mode?: DataMode;
  unit?: string;
  formatAreaText?: (decimal: number) => string;
  onSelectMouza?: (mouzaId: string) => void;
  language?: Language;
}

export function createMouzaLabelsLayer(
  map: any,
  L: any,
  mouzas: MouzaSummary[],
  options: MouzaLabelsOptions
): { update: (newSelectedId?: string | null) => void; destroy: () => void } {
  const labelGroup = L.layerGroup().addTo(map);
  let currentSelectedId = options.selectedMouzaId;

  function renderLabels() {
    labelGroup.clearLayers();
    if (!map) return;

    const isForecast = options.mode === "forecast";
    const isBn = options.language === "bn";
    const formatArea = options.formatAreaText || ((d: number) => (isBn ? `${formatNumberLocalized(d, "bn")} শতাংশ` : `${d} dec`));

    // 1. Calculate screen size & bounding boxes
    const candidateMouzas: Array<{
      mouza: MouzaSummary;
      anchorScreen: { x: number; y: number };
      pixelWidth: number;
      priority: number;
      bbox: { x1: number; y1: number; x2: number; y2: number };
    }> = [];

    for (const m of mouzas) {
      if (!m.polygon?.[0] || !m.labelAnchor) continue;

      let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
      for (const [lon, lat] of m.polygon[0]) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }

      const p1 = map.latLngToContainerPoint([maxLat, minLon]);
      const p2 = map.latLngToContainerPoint([minLat, maxLon]);
      const pixelWidth = Math.abs(p2.x - p1.x);

      const isSelected = m.id === currentSelectedId;

      // Declutter rule: hide when on-screen width is below about 90px unless selected
      if (pixelWidth < 90 && !isSelected) {
        continue;
      }

      const anchorScreen = map.latLngToContainerPoint([m.labelAnchor[1], m.labelAnchor[0]]);
      const labelW = isSelected ? 130 : 110;
      const labelH = 38;

      const bbox = {
        x1: anchorScreen.x - labelW / 2,
        y1: anchorScreen.y - labelH / 2,
        x2: anchorScreen.x + labelW / 2,
        y2: anchorScreen.y + labelH / 2,
      };

      const priority = isSelected ? 1000000 : (m.lossDecimal || 0) * 10 + (m.areaDecimal || 0);

      candidateMouzas.push({
        mouza: m,
        anchorScreen,
        pixelWidth,
        priority,
        bbox,
      });
    }

    // Sort candidates by priority descending
    candidateMouzas.sort((a, b) => b.priority - a.priority);

    // Overlap collision detection
    const placedBBoxes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    for (const cand of candidateMouzas) {
      const isSelected = cand.mouza.id === currentSelectedId;

      // Check collision with already placed labels
      let collides = false;
      if (!isSelected) {
        for (const pb of placedBBoxes) {
          const overlap = !(
            cand.bbox.x2 < pb.x1 ||
            cand.bbox.x1 > pb.x2 ||
            cand.bbox.y2 < pb.y1 ||
            cand.bbox.y1 > pb.y2
          );
          if (overlap) {
            collides = true;
            break;
          }
        }
      }

      if (collides) continue;

      placedBBoxes.push(cand.bbox);

      // Build label HTML
      const m = cand.mouza;
      const lossVal = m.lossDecimal || 0;
      const gainVal = m.gainDecimal || 0;

      let badgeHtml = "";
      if (lossVal > 0) {
        const lossText = `−${formatArea(lossVal)}${isForecast ? (isBn ? " অনুমান" : " proj.") : ""}`;
        badgeHtml += `
          <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
            isForecast ? "bg-[#6A5BD6] text-white" : "bg-[#E4604A] text-white"
          } shadow-2xs">
            ${lossText}
          </span>
        `;
      }
      if (gainVal > 0) {
        const gainText = `+${formatArea(gainVal)}${isForecast ? (isBn ? " অনুমান" : " proj.") : ""}`;
        badgeHtml += `
          <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#2F9E62] text-white shadow-2xs">
            ${gainText}
          </span>
        `;
      }

      const mouzaNameStr = isBn ? getLocalizedMouzaName(m.id, m.name, "bn") : m.name;
      const jlNoStr = isBn ? formatNumberLocalized(m.jlNo, "bn") : m.jlNo;

      const iconHtml = `
        <div class="pointer-events-auto cursor-pointer select-none text-center transform -translate-x-1/2 -translate-y-1/2">
          <div class="inline-flex flex-col items-center">
            <!-- Mouza Name & JL -->
            <div class="${
              isSelected
                ? "bg-surface/95 px-2 py-0.5 rounded-md border border-ink shadow-sm"
                : ""
            }">
              <span class="${
                isSelected ? "text-[12px] font-extrabold text-ink" : "text-[11px] font-bold text-[#3E4339]"
              }" style="text-shadow: 0 0 4px #FFFFFF, 0 0 2px #FFFFFF, 1px 1px 0 #FFFFFF, -1px -1px 0 #FFFFFF;">
                ${mouzaNameStr}
              </span>
              <span class="text-[9px] font-medium text-muted/90 ml-1" style="text-shadow: 0 0 3px #FFFFFF;">
                ${jlNoStr}
              </span>
            </div>

            <!-- Loss/Gain Badge -->
            ${badgeHtml ? `<div class="mt-0.5 flex items-center justify-center gap-1">${badgeHtml}</div>` : ""}
          </div>
        </div>
      `;

      const divIcon = L.divIcon({
        className: "gis-mouza-label-marker",
        html: iconHtml,
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      const marker = L.marker([m.labelAnchor[1], m.labelAnchor[0]], {
        pane: "mouza-labels",
        icon: divIcon,
        interactive: true,
      });

      marker.on("click", () => {
        options.onSelectMouza?.(m.id);
      });

      labelGroup.addLayer(marker);
    }
  }

  renderLabels();
  map.on("zoomend", renderLabels);
  map.on("moveend", renderLabels);

  return {
    update: (newSelectedId?: string | null) => {
      if (newSelectedId !== undefined) {
        currentSelectedId = newSelectedId;
      }
      renderLabels();
    },
    destroy: () => {
      map.off("zoomend", renderLabels);
      map.off("moveend", renderLabels);
      map.removeLayer(labelGroup);
    },
  };
}
