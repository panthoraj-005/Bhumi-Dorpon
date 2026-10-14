# Antigravity — BhumiDorpon Map Corrections (One Complete Prompt)

You are continuing the EXISTING BhumiDorpon project. The overall page layout and UI design are already approved and must be preserved. Do not rebuild, scaffold, redesign, or replace the existing map library. First inspect the source code, `package.json`, existing map components, mock data, and available documentation. Read `/docs/MAP_FIX_SPEC.md` and the existing `MAP_SPEC.md` (if present), plus PRD, TRD, APP_FLOW, BACKEND_SCHEMA, ARCHITECTURE, DESIGN, BUILD_RULES, and CHANGE_LOG.

The immediate problems to fix are:
1. The same satellite image/map context is being reused for all hazard types.
2. The map shows too large an area instead of focusing on the selected region.
3. Satellite and Light GIS do not look geographically aligned as two basemaps of the same place.
4. The zoom controls need an extra click/activation before zooming.

## A. Preserve the approved UI and all existing features
- Preserve the current overall layout, typography, colors, design tokens, routes, navigation, and component patterns.
- Keep all five hazard modules: River Erosion, Flood, Landslide, Char, and Coastal.
- Keep existing Before/After side-by-side maps, supporting information below the pair, dashboard preview, flood owner map/page, legends, filters, tables, selectors, Recorded/Forecast behavior, overlays, and other existing working features.
- Keep the current mapping library and architecture (Leaflet/react-leaflet where already used). Do not introduce MapLibre or replace the map stack.
- Demo remains mock-data-only. Do not add a backend, database, ML inference, or live hazard-data API.
- Do not modify unrelated UI elements. This is a targeted map correction only.

## B. Fix hazard-specific geographic context
Do not use one hard-coded satellite screenshot, one static image, or a generic background image for every hazard. Satellite mode must be a real geographic tile layer, rendered at the current selected hazard/region's geographic location.

Use the existing hazard and region selection, coordinates, geometries, and bounds to choose the correct viewport. When supported by the existing data, the context should correspond to:
- River Erosion: selected river corridor and banks.
- Landslide: selected hilly/mountainous terrain.
- Char: selected river island/sandbar/char.
- Flood: selected flood-affected region.
- Coastal: selected coastal/estuarine region.

These are actual geographic map views, not decorative stock photos. Do not hard-code the same image or bounds for every hazard. Do not invent coordinates, change geometry arbitrarily, or falsely imply that synthetic mock polygons match real-world imagery.

On hazard/region selection, fit the map to the selected feature's actual existing bounds or bounding box with suitable padding and a sensible maximum zoom. Show only the selected region at a useful scale; do not zoom out to a country-wide extent when the selection is local. Do not use a different hazard's bounds as a fallback. If the selected region has no valid geographic bounds, show the project's explicit demo fallback and explain the limitation rather than faking a match.

## C. Align Light GIS and Satellite
Light GIS and Satellite must be two basemaps for the SAME geographic place:
- Keep the same coordinate reference system, map center, zoom, bounds, and container aspect ratio.
- Switching basemap changes only the background tile layer; it must not reset or shift the map.
- Preserve all hazard overlays, plot boundaries, mouza labels/borders, selection, layers, legends, owner colors, and Recorded/Forecast state.
- The Before and After maps must remain synchronized in center and zoom.
- If the user changes the map type on either map, apply the same basemap to both comparison maps without changing their extent.
- Do not stretch, crop, or position a static image to imitate a map.
- Use real satellite tiles only from a provider whose terms and attribution requirements permit the project's use. Keep attribution visible and do not hard-code secret API keys.
- If no compliant provider/configuration is available, retain Light GIS as the working default, clearly state the exact missing provider/key/configuration, and do not pretend satellite mode works.
- If the mock geometry is synthetic or unverified, keep a visible `Demo geometry — not survey-accurate` notice. Do not claim the overlays line up accurately with real-world imagery unless verified from the data.

## D. Fix zoom controls — first click must work
Inspect the current zoom control implementation and remove any extra zoom-mode activation step.
- Clicking `+` must immediately call the actual map's `zoomIn()` or equivalent.
- Clicking `−` must immediately call `zoomOut()` or equivalent.
- Do not require a first click to activate/focus a zoom tool and a second click to perform zooming.
- Check for overlay elements, event handlers, propagation logic, disabled states, and pointer-events/CSS that may swallow the first click.
- Controls should be visibly clickable, accessible, keyboard-operable, and touch-friendly.
- Zooming either Before/After map must synchronize both maps without recursive event loops. Normal map pan, wheel, and touch interactions must continue to work.

## E. Map extent and state rules
- Initial view: derive bounds from the currently selected hazard/region's existing data.
- Hazard/region changes: fit to the newly selected region.
- Basemap-only changes: preserve current center, zoom, extent, selection, and overlays.
- Pan/zoom in Before or After: synchronize the other map.
- Keep the current design and supporting-information placement.
- Tile loading errors must not crash the page; Light GIS must remain available as fallback.

## F. Documentation
Update the existing PRD.md, TRD.md, APP_FLOW.md, BACKEND_SCHEMA.md, ARCHITECTURE.md, and DESIGN.md to record the corrections, without deleting unrelated content. Keep `MAP_SPEC.md` authoritative for existing Light GIS styling. Create or update `MAP_FIX_SPEC.md` and append an accurate entry to `CHANGE_LOG.md` if the project uses it. Do not invent a backend or new schema tables for this UI correction.

## G. Test and report
Inspect the actual scripts in `package.json`. Run available lint, type-check, build, and relevant tests. Verify:
1. Each hazard uses its own selected region/extent rather than one shared hard-coded image.
2. Selected local regions fill the map appropriately without excessive empty space.
3. Light GIS and Satellite show the same geographic place and scale.
4. Basemap changes preserve the view and all overlays.
5. Before/After pan and zoom remain synchronized.
6. `+` and `−` zoom on the first click.
7. Tile failure does not break Light GIS.
8. All existing hazard modules, owner page, dashboard preview, selectors, legends, and responsive behavior remain intact.

Do not claim a test passed unless it was actually run. If the project uses synthetic or inaccurate coordinates, report that honestly and do not fake alignment. Finish the implementation in this single task rather than returning only a plan.

## Final report
List files changed, summarize the fixes, state which tile provider is configured and its attribution/configuration status, list actual test commands/results, and disclose any unresolved geographic-data or provider limitations.
