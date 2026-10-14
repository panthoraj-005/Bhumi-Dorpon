# Antigravity — BhumiDorpon Existing Project Map UX + Basemap Update (Single Complete Task)

You are continuing the EXISTING BhumiDorpon Next.js demo. Do not start a new project, scaffold a replacement, regenerate the whole application, or discard completed work. Treat the existing source code and `/docs` as authoritative. First inspect the repository and read `/docs/PRD.md`, `/docs/TRD.md`, `/docs/APP_FLOW.md`, `/docs/DESIGN.md`, `/docs/BACKEND_SCHEMA.md`, `/docs/ARCHITECTURE.md`, `/docs/MAP_SPEC.md`, `/docs/BUILD_RULES.md`, and `/docs/CHANGE_LOG.md` when present. The updated documents supplied with this prompt define the new requested map behavior. `MAP_SPEC.md` remains authoritative for the existing Light GIS layer styling and hazard-specific map layers; this prompt supersedes the old swipe-bar requirement and the old “no external tile layers” rule only for the new optional real-world base-map switch.

## Project boundaries — must preserve
- Existing Next.js App Router + TypeScript, Tailwind CSS + shadcn/ui, Leaflet/react-leaflet, current route names, component patterns, design tokens, data types, mock data, hazard layers, selection flows, and generated assets.
- Demo remains English-only and mock-data-only. Do not add a backend, database, ML inference, or live data API.
- Keep all five hazards: River Erosion, Flood, Landslide, Char, and Coastal; preserve the dashboard preview, owner page, Recorded/Forecast modes, selectors, legends, tables, context cards, four-corner plot coordinate requirements, and existing empty states.
- No MapLibre and no replacement map library.
- Do not claim a feature or test passes unless verified by running it.

## Required implementation

### A. Replace the default swipe comparison with side-by-side maps
1. Update the existing `MapCompare` and related styles; do not replace the entire map system.
2. On desktop, show two clear, equal-weight map panels in one row: **Before on the left**, **After on the right**. The default/primary comparison must have no draggable swipe bar and must not require dragging to compare.
3. Keep each map's title and controls attached to the corresponding map. Put the complete supporting information area BELOW both maps: statistics, legends, context cards, mouza-wise summaries, affected-owner tables, and explanatory information. Do not leave one map's information wedged between the two map panels.
4. Initialize both maps to the same bounds and zoom. Keep pan and zoom synchronized so users compare the same location. Implement event synchronization with loop protection and clean listener teardown.
5. Preserve Recorded/Forecast semantics: Recorded displays the actual before/after event states; Forecast shows current/before on the left and projected state on the right. Keep existing hazard overlays and mode labels correct.
6. On mobile, stack Before first, After second, and all supporting information after both. At intermediate widths, use two columns only if each map remains usable.

### B. Add dedicated visible zoom buttons
1. Add separate, visible `+` and `−` buttons on every relevant map, positioned in the map chrome beside/inside each map without obscuring critical labels, legend, or layer controls.
2. Buttons must work immediately on the first click. Do not require clicking an “activate zoom” button, selecting a tool, or focusing the map first.
3. Connect buttons to actual Leaflet map references and `zoomIn()` / `zoomOut()` (or an equivalent correct API). In paired maps, zooming either map updates both.
4. Give buttons accessible names (`Zoom in`, `Zoom out`), keyboard focus styles, keyboard activation, and touch-friendly hit areas. Preserve normal Leaflet drag, wheel, pinch, and other current interactions.
5. Ensure controls do not accidentally trigger map drags or block layer-switcher interaction.

### C. Add a map-type switch: Light GIS and real Satellite
1. Put a clear, compact **Map type** switch on every applicable map, including hazard detail maps, flood owner map, and dashboard preview when interactive.
2. Options:
   - **Light GIS**: existing synthetic Light GIS Basemap; default and reliable fallback.
   - **Satellite**: real satellite imagery from a reputable provider, with required visible attribution.
   - **Street**: optional only if a compliant real-world street-map provider is available and configured.
3. Inspect existing project configuration first. Centralize provider configuration, attribution, zoom limits, and URLs/templates in one typed module or existing config convention. Never commit secret API keys.
4. Before enabling a tile source, verify its current usage terms, attribution requirements, and zoom restrictions. Do not remove attribution, bypass rate limits, scrape tiles, or assume a source is free for every production use. If no compliant satellite source can be configured without credentials, keep the UI architecture ready and document the exact missing configuration; do not fake satellite imagery or silently substitute a street map for satellite.
5. Keep Light GIS available even if network tiles fail. Satellite tile errors must not crash the page; show a compact non-blocking message and allow the user to switch back to Light GIS.
6. Switching base layers must preserve map extent/zoom, hazard and plot overlays, visible layers, selected mouza/owner, selected result, Recorded/Forecast mode, legends, and the synchronized view between Before and After.
7. Keep all hazard layers above the base layer using existing `MAP_SPEC.md` pane/z-index rules. Preserve hatches, owner colours, flood-depth colours, terrain, boundaries, labels, and selection behavior. Add satellite-mode contrast styling only as needed; do not change the semantic meaning of colors or redesign the site.
8. Existing demo plot/event geometries and basemap features may be synthetic and may not match real-world satellite geography. Do not move or fabricate coordinates just to make them look aligned. Whenever Satellite or Street is active and geometry has not been verified against real geography, show a visible, unobtrusive notice: **“Demo geometry — not survey-accurate”**. Only remove this notice for a dataset whose alignment is actually verified and documented.

### D. Apply consistently without regressions
- Apply the shared comparison, zoom, and map-type behavior to all five hazard maps, the flood owner-page map, and dashboard map preview wherever applicable.
- Preserve the Light GIS layers specified by `/docs/MAP_SPEC.md`, including mouza labels and boundaries, graticule, scale, north arrow, locator inset, layer panel, roads/water/embankments, owner-coloured flood plots, landslide terrain rasters/contours, legends, and context cards.
- Do not remove existing data, table columns, route behavior, dependent selectors, copy/download features, or coordinate details.
- Do not add unrelated features, redesign non-map pages, change brand styling, or replace mock data with invented live data.
- Respect the existing folder structure. Reuse or extend components where practical. Add a new component only when it fits the current architecture.
- Keep map comparison layout, controls, and data panels readable at 1440px, 1024px, and 390px widths.

### E. Tests and final verification
Inspect `package.json` before choosing commands. Run the available lint, type-check, unit tests, mock-data checks, and Playwright/E2E or browser checks. Add focused tests for:
- Before-left / After-right order and supporting information below the pair.
- No draggable swipe bar in the default comparison UI.
- Zoom controls work immediately and synchronize both maps.
- Pan/zoom sync has no infinite event loop.
- Base-map switch preserves viewport, overlays, mode, and selections.
- Attribution and synthetic-geometry warning appear in real tile mode.
- Tile failure keeps Light GIS usable.
- Five hazard maps, owner page, and dashboard preview retain their behavior.
- Responsive layouts at 1440px, 1024px, and 390px.
- Existing selector-combination, four-corner plot, totals, and Forecast rules still pass.

Actually run the checks. Fix regressions and rerun. If a check cannot run because a dependency, browser, API key, tile configuration, or source file is missing, state the exact blocker; do not invent a PASS. Append a concise change record to `/docs/CHANGE_LOG.md` (create only if missing) with files changed, tests run, observed results, and unresolved issues. Do not split this work into multiple prompt parts; execute it as one coherent task and finish with a factual implementation report.

## Completion report format
1. Files changed.
2. Behavior implemented (comparison layout, zoom controls, map-type switch).
3. Tile provider used and attribution/terms status; if not enabled, state the exact reason.
4. Tests/commands actually run with PASS/FAIL and evidence.
5. Known limitations or missing configuration.
6. Confirm that existing project structure and non-map features were preserved, with evidence.
