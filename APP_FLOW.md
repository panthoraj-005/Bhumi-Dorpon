# APP_FLOW — ভূমিদর্পণ (BhumiDorpon)

**Status:** Continuity document created from the uploaded PRD, TRD, MAP_SPEC, DESIGN, BACKEND_SCHEMA, and CHANGE_PROMPT_3. This file was not present in the supplied documentation set.

## 1. Product scope

BhumiDorpon is an English-only demo for exploring land changes in Bangladesh. It uses seeded mock data and synthetic demo geometry. The demo has no live backend, database, ML service, or external data API.

The five hazard modules are River Erosion, Char, Coastal, Flood, and Landslide. Keep the existing project naming and routes; inspect the repository before changing any route or component.

## 2. Shared selection flow

1. User enters the dashboard.
2. User selects a hazard module.
3. User selects the geographic context using the existing dependent selectors (District → Upazila → hazard-specific geography such as River, Hill, or Mouza).
4. User chooses an available recorded event/result or switches between `Recorded` and `Forecast` modes.
5. The detail page loads the relevant mock result, map layers, context, and supporting tables.
6. User compares Before and After in two side-by-side maps.
7. User inspects the data below the maps and may navigate to relevant detail pages, including a flood owner page where applicable.

Do not invent unavailable selections or replace existing selector behavior. Follow the existing PRD and current source code where the exact route differs.

## 3. Before/After map flow

- Before is always the left map on desktop; After is always the right map.
- Both maps start at the same geographic bounds and zoom.
- The default comparison does not use a draggable swipe bar.
- Map information, context cards, legends, mouza summaries, and related tables appear below the complete pair of maps.
- Zoom-in and zoom-out buttons are visibly available without requiring activation of another tool. Zoom/pan synchronization keeps the two views comparable.
- On small screens, stack Before first and After second, then render the supporting information.

## 4. Map type flow

Each applicable map exposes a map-type switch:
- **Light GIS:** existing synthetic Light GIS Basemap; this is the default/fallback.
- **Satellite:** real satellite imagery from a provider whose terms and attribution requirements have been checked.
- **Street:** optional, only when a compliant street tile source is configured.

Changing the base map must preserve the selected hazard, result, mode, viewport, overlays, and selections. It must not change recorded/forecast data. Display tile attribution and, when geometry is not verified against real geography, the notice `Demo geometry — not survey-accurate`.

## 5. Hazard-specific information

- **River Erosion, Char, Coastal:** retain hazard layers, mouza labels, loss/gain badges, mouza-wise summary, water-status context, legends, and existing tables.
- **Flood:** retain flood depth classes, per-owner plot colours, owner legend/isolation interactions, flood context, affected-owner table, and owner-page navigation.
- **Landslide:** retain elevation tint, hillshade, contours, spot heights, slope, elevation change, susceptibility zones, scar/debris layers, terrain context, and existing legends.
- **Owner page:** preserve Dag No., Khatian No., land class, area, flood status, and the four corner coordinates where specified by the PRD.
- **Dashboard preview:** use the shared map-type/zoom conventions if interactive; do not let preview interactions break the full detail map.

## 6. Error and fallback states

- If real-world tiles fail, keep Light GIS usable and show a non-blocking message.
- If a result has no event data, use the existing documented empty state.
- Never present mock or synthetic geometry as verified official survey data.
- Keep all existing empty states and selector combinations working.

## 7. Flow acceptance checklist

- Existing routes and selection flows remain unchanged.
- Before-left / After-right is consistent on desktop.
- All map-related information is below the pair.
- Zoom controls work immediately and synchronize the pair.
- Base-map switching preserves overlays, selection, mode, and viewport.
- Attribution and synthetic-geometry notice are visible when applicable.
- Mobile layout remains usable.

## 8. Corrective flow: hazard-specific map extent and basemap alignment

1. The user selects a hazard and region using the existing selectors.
2. The map reads that selection's existing geometry or bounding box and fits the view to that region, with suitable padding.
3. The selected hazard should show its own geographic context: river corridor, hilly terrain, char/island, flood area, or coastal area as supported by the existing region data.
4. The user switches between Light GIS and Satellite. Only the base layer changes; center, zoom, extent, selected region, and hazard overlays remain unchanged.
5. The Before and After maps remain on the same geographic extent and keep pan/zoom synchronized.
6. If region coordinates are missing or synthetic, the UI shows the appropriate fallback/disclaimer rather than reusing another hazard's imagery or inventing coordinates.

The `+` and `−` controls must zoom immediately on the first click; there is no activation step.

## 9. Settings Flow

1. User clicks the `Settings` icon at the bottom of the navigation sidebar.
2. The Settings hub (`/settings`) displays exactly two options:
   - **About Project**: opens the factual project overview (`/settings/about`).
   - **Team Information**: opens the team details and copyright line (`/settings/team`).
3. Selecting either option opens its respective view.
4. From each view, the user can return to Settings using the "Back to Settings" navigation control.
5. No other settings options or choices are displayed.

---

<!-- addendum:google-earth-and-hazard-store -->
## Addendum — Google Earth Parcel Outline & Five-Hazard Information Store

### A. Flow — Open a Parcel in Google Earth
1. Open **Flood Monitoring** (`/flood`), choose District → Upazila → Mouza → flood event.
2. In the affected-owner table click an owner to open `/flood/[mouzaId]/[floodId]/owner/[ownerId]`.
3. Each parcel card shows its **Four Corner Coordinates** table (1 NW, 2 NE, 3 SE, 4 SW; latitude first; 6 decimals).
4. Click **Open in Google Earth** under the table.
5. A KML file `<floodId>_dag_<dagNo>_outline.kml` downloads and Google Earth (web) opens in a new tab at the parcel.
6. An on-page hint appears (about 12 s): in Google Earth choose **New → Open local KML file** and select the downloaded file (Earth Pro: double-click the file).
7. Google Earth draws the parcel outline with four numbered corner markers.

**Edge cases:** pop-up blocked → allow pop-ups for the site and click again; downloads blocked → allow downloads; clicking the button does not select or zoom the card; the page works offline except for Google Earth itself.

### B. Flow — Where Hazard Information Comes From
Select a hazard module → cascading selectors call `getOptions()` → selecting a mouza / event calls `getHazardResult()` / `getFlood()` / `getMapArea()` in `lib/data.ts` → `loadMockJson()` fetches `/mocks/<file>` (or reads `mocks/<file>` on the server) → the result is cached and rendered by the map and tables. Each hazard reads its own file, so no module shows another hazard's data.

| Store | Location | Content | Read by |
|---|---|---|---|
| Runtime copy (browser) | `public/mocks/*.json`, served at `/mocks/*` | Flat per-hazard files: `river_erosion.json`, `flood.json`, `landslide.json`, `char.json`, `coastal.json`, plus `common.json`, `chars.json`, `hills.json`, `rivers.json`, `districts.json`, `upazilas.json`, `mouzas.json`, `owners.json`, `plots.json`, `summary.json`, `areas_index.json` | `loadMockJson()` in `lib/data.ts` (client `fetch('/mocks/<file>')`) |
| Source copy (Node / tests) | `mocks/*.json` | Same flat files | `loadMockJson()` on the server side (`fs.readFileSync` from `mocks/`) and Vitest |
| Per-area map packages | `mocks/areas/<hazard>/area_*.json` and `public/mocks/areas/<hazard>/area_*.json` | One package per map area: `areaId`, `hazard`, `mode`, `bounds`, `basemap`, `mouzas`, `hazardLayers`, `context`, `owners` (river_erosion 7, flood 6, landslide 6, char 5, coastal 6) | `lib/data.ts` via `areas_index.json` (maps a hazard / mode / mouza key to an `area_*` file) |
| Landslide terrain rasters | `public/mocks/rasters/<area>/`, `public/mocks/hillshades/` | `elevation_before/after.png`, `hillshade_*.png`, `slope_before.png`, `elevation_change.png`, `contours.geojson`, `spot_heights.json` | Landslide map layers |
| Reserved per-mouza hazard results | `mocks/hazards/<hazard>.json`, `mocks/common/*.json` | Larger per-mouza keyed result sets and a copy of the shared reference tables | Present in `mocks/` only; **not read by the current runtime loader** |
| Generator | `scripts/generate-mocks.ts`, `scripts/generate-map-areas.ts` | Deterministic, seeded generation; writes to both `mocks/` and `public/mocks/` | `npm run generate:mocks` |

