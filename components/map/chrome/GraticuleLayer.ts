import { GIS_COLORS } from "../basemap/constants";

/**
 * Creates and manages a dynamic zoom-dependent GIS Graticule layer on Leaflet.
 * Steps: zoom <= 13: 0.01 deg; 14-15: 0.005 deg; 16: 0.002 deg; >= 17: 0.001 deg.
 */
export function createGraticuleLayer(map: any, L: any): { update: () => void; destroy: () => void } {
  const graticuleGroup = L.layerGroup().addTo(map);

  function getStep(zoom: number): number {
    if (zoom <= 13) return 0.01;
    if (zoom <= 15) return 0.005;
    if (zoom <= 16) return 0.002;
    return 0.001;
  }

  function formatCoord(val: number, isLat: boolean): string {
    const dir = isLat ? (val >= 0 ? "N" : "S") : val >= 0 ? "E" : "W";
    return `${Math.abs(val).toFixed(3)}°${dir}`;
  }

  function redraw() {
    graticuleGroup.clearLayers();
    if (!map) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const step = getStep(zoom);

    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    const latStart = Math.floor(south / step) * step;
    const latEnd = Math.ceil(north / step) * step;
    const lonStart = Math.floor(west / step) * step;
    const lonEnd = Math.ceil(east / step) * step;

    // 1. Latitude parallels (horizontal)
    for (let lat = latStart; lat <= latEnd; lat += step) {
      const line = L.polyline(
        [
          [lat, west - 0.02],
          [lat, east + 0.02],
        ],
        {
          pane: "graticule",
          color: GIS_COLORS.graticuleLine,
          weight: 0.5,
          opacity: 0.75,
          interactive: false,
        }
      );
      graticuleGroup.addLayer(line);

      // Edge label at west edge
      const labelIcon = L.divIcon({
        className: "gis-graticule-label",
        html: `<span style="color: ${GIS_COLORS.graticuleLabel}; font-size: 9px; font-family: monospace; background: rgba(248, 250, 252, 0.7); padding: 0 2px; border-radius: 2px;">${formatCoord(lat, true)}</span>`,
        iconSize: [60, 14],
        iconAnchor: [-4, 7],
      });
      const marker = L.marker([lat, west], {
        pane: "graticule",
        icon: labelIcon,
        interactive: false,
      });
      graticuleGroup.addLayer(marker);
    }

    // 2. Longitude meridians (vertical)
    for (let lon = lonStart; lon <= lonEnd; lon += step) {
      const line = L.polyline(
        [
          [south - 0.02, lon],
          [north + 0.02, lon],
        ],
        {
          pane: "graticule",
          color: GIS_COLORS.graticuleLine,
          weight: 0.5,
          opacity: 0.75,
          interactive: false,
        }
      );
      graticuleGroup.addLayer(line);

      // Edge label at south edge
      const labelIcon = L.divIcon({
        className: "gis-graticule-label",
        html: `<span style="color: ${GIS_COLORS.graticuleLabel}; font-size: 9px; font-family: monospace; background: rgba(248, 250, 252, 0.7); padding: 0 2px; border-radius: 2px;">${formatCoord(lon, false)}</span>`,
        iconSize: [60, 14],
        iconAnchor: [30, -2],
      });
      const marker = L.marker([south, lon], {
        pane: "graticule",
        icon: labelIcon,
        interactive: false,
      });
      graticuleGroup.addLayer(marker);
    }
  }

  redraw();
  map.on("moveend", redraw);
  map.on("zoomend", redraw);

  return {
    update: redraw,
    destroy: () => {
      map.off("moveend", redraw);
      map.off("zoomend", redraw);
      map.removeLayer(graticuleGroup);
    },
  };
}
