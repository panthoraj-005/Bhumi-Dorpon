import { PANE_CONFIGS } from "./constants";

/**
 * Initializes the full Light GIS Basemap pane hierarchy on a Leaflet map.
 * Ensures strict z-index stacking according to MAP_SPEC section 3.
 */
export function setupLeafletPanes(map: any): void {
  for (const cfg of PANE_CONFIGS) {
    if (!map.getPane(cfg.name)) {
      const pane = map.createPane(cfg.name);
      pane.style.zIndex = cfg.zIndex.toString();
      if (cfg.pointerEvents) {
        pane.style.pointerEvents = cfg.pointerEvents;
      }
    }
  }
}
