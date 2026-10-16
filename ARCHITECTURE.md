# ARCHITECTURE — ভূমিদর্পণ (BhumiDorpon)

**Status:** Continuity document created from the supplied PRD, TRD, MAP_SPEC, DESIGN, BACKEND_SCHEMA, and CHANGE_PROMPT_3. This file was not present in the supplied documentation set. Validate all paths against the actual repository before editing.

## 1. Architectural boundaries

### Demo (current documented scope)
- Next.js 14+ App Router and TypeScript.
- Tailwind CSS and shadcn/ui.
- Leaflet/react-leaflet for all maps.
- Existing typed data layer in `lib/data.ts`.
- Seeded generated mock JSON/GeoJSON in `/mocks`.
- Mock generation script at `/scripts/generate-mocks.ts`.
- No backend, database, ML inference, or live external data API in the demo.

### Future production (not part of this change)
FastAPI, PostgreSQL/PostGIS, optional Redis, raster services, and ML/satellite-data pipelines are future architecture. Do not implement these as part of the requested map UI update.

## 2. Existing logical areas to preserve

Use the existing repository structure rather than generating a replacement:
- `app/`: existing App Router pages and route segments.
- `components/`: shared UI, charts, selectors, tables, empty states.
- `components/map/`: existing `MapCompare` and hazard-specific map layers.
- `lib/`: data access, selection, units, formatting, types, and map configuration as already present.
- `mocks/`: generated JSON/GeoJSON and raster/image assets.
- `scripts/`: deterministic mock generator.
- `docs/`: Exactly 12 consolidated specifications (`PRD.md`, `TRD.md`, `APP_FLOW.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `API_DOCUMENTATION.md`, `UI_UX_DESIGN_SYSTEM.md`, `AUTH_SPECIFICATION.md`, `TESTING_QA.md`, `SECURITY_SPECIFICATION.md`, `PROJECT_ROADMAP.md`, `MAIN_PROJECT_DOCUMENTATION.md`).

The exact file list is not verified because source code was not included with the documentation.

## 3. Map rendering model

Each hazard map should keep the existing Leaflet instance and existing hazard-specific overlay/layer logic. The base map is a separate layer beneath thematic layers.

Logical layers:
1. Base layer: `Light GIS` (synthetic default/fallback), `Satellite` (real imagery), optional `Street`.
2. Shared map chrome: zoom controls, scale, north arrow, graticule, locator inset, layer panel, map-type switch, attribution.
3. Existing geographic context: mouzas, boundaries, roads, water, embankments, labels, as provided by the current data.
4. Hazard overlays: loss/gain, flood depth, landslide terrain/scar/debris, owner plots, and other existing hazard layers.
5. Interaction state: selected result/mode, selected mouza/owner, layer visibility, base-map type, synchronized viewport.

Keep the layer order and pane/z-index values defined in `MAP_SPEC.md`. The base-map switch must not recreate or discard hazard overlays.

## 4. Before/After synchronization

- Render two separate Leaflet maps for Before and After, reusing the existing MapCompare/layer components where practical.
- Desktop layout places Before left and After right.
- Initialize both views from the same bounds/zoom.
- Synchronize `moveend`/zoom changes with loop prevention and proper listener cleanup.
- Zoom buttons invoke the actual Leaflet map API and work immediately.
- Avoid a draggable swipe bar in the default comparison workflow.
- Place context cards, summaries, legends, and tables below the map pair.
- Mobile uses a single-column stack: Before, After, supporting information.

## 5. Real-world base layers and integrity

- Add a central, typed base-layer configuration for provider name, URL/template, attribution, and zoom limits.
- Do not hard-code API secrets. Verify provider terms and attribution requirements before enabling satellite/street tiles.
- Keep Light GIS available without network access and as a fallback for tile errors.
- Do not claim synthetic mock plots or boundaries align with real imagery. If geometry is not verified, display `Demo geometry — not survey-accurate` when Satellite/Street is selected.
- Preserve all current overlays and viewport when changing base layers.

## 6. Performance and resilience

- Preserve lazy-loading for large per-area GeoJSON and terrain images.
- Do not bundle large raster or GeoJSON assets into the main JavaScript chunk.
- Avoid duplicate Leaflet event subscriptions and stale map references.
- Keep map switching failures non-fatal; the local Light GIS layer must remain usable.
- Avoid a new mapping library. Leaflet remains authoritative.

## 7. Change strategy

1. Inspect repository and read `BUILD_RULES.md`, `MAP_SPEC.md`, and `CHANGE_LOG.md` if present.
2. Record existing component behavior before edits.
3. Patch existing map components and CSS; do not rebuild unrelated pages.
4. Add or update tests and run actual project scripts.
5. Record changed files, test commands, real results, and known limitations in the existing change log.

## 8. Hazard-aware map viewport and basemap alignment

- Derive the initial viewport from the currently selected hazard/region's existing geometry or bounds. Do not use one fixed global extent for every hazard.
- Satellite mode must be a real tile layer at geographic coordinates, not a single static satellite image reused for all hazards.
- The same center, zoom, bounds, coordinate reference system, and map aspect ratio must be retained when toggling between Light GIS and Satellite.
- Keep a single shared view state or a loop-safe map synchronization mechanism for the Before/After pair.
- On hazard/region selection changes, fit to the selected region's bounds. On a basemap-only change, preserve the current view.
- Never “correct” synthetic data by making up coordinates. Keep the geometry provenance warning when alignment is unverified.

## 9. Immediate zoom-button behavior

- Zoom buttons call the map API directly from their click handlers; no activation state or second click is allowed.
- Keep event propagation handling local to the controls so clicks do not become map clicks/drags.
- Test that the first click changes zoom on both synchronized maps.

---

<!-- addendum:google-earth-and-hazard-store -->
## Addendum — Google Earth Parcel Outline & Five-Hazard Information Store

### A. Google Earth Integration (Client-Side Only)
```
Owner Land Detail page (client component)
   └─ "Open in Google Earth" button  (per parcel card)
        └─ lib/googleEarth.ts
             ├─ buildParcelKml(corners, meta)  → KML string (in memory)
             ├─ Blob + <a download>            → file saved on the user's device
             └─ window.open(earth.google.com/web/@lat,lon,0a,<range>d,…)  → Google Earth tab
```
On the Flood Owner Land Detail page, every parcel card now shows an **Open in Google Earth** button directly beneath its Four Corner Coordinates table. One click (1) builds a KML file of the parcel outline in the browser and downloads it, and (2) opens Google Earth (web) centered on the parcel in a new tab. Google Earth cannot load a polygon from a URL, so the outline appears after the user loads the downloaded KML (Earth web: **New → Open local KML file**; Earth Pro: double-click the file). A short on-page hint explains this.

- Layer: presentation + a pure helper in `lib/`; no server route, no persistence, no API key.
- Data crossing the trust boundary: only the camera center (lat, lon) and zoom distance in the Earth URL. Owner names, Dag/Khatian numbers, and the KML stay on the device.
- Google Earth is an external third-party service the user opens in a new tab; the app never calls its API.

### B. Five-Hazard Information Store (Data Layer)
All information for the five hazard categories (river erosion, flood, landslide, char formation/erosion, coastal erosion/land formation) is saved as static, deterministic, mock/synthetic JSON files. There is no backend or database. Each hazard has one flat JSON file, a set of per-area map packages and, for landslides, terrain rasters. The same files are written to `mocks/` (server and tests) and `public/mocks/` (browser), and every read goes through `loadMockJson()` in `lib/data.ts`.

| Store | Location | Content | Read by |
|---|---|---|---|
| Runtime copy (browser) | `public/mocks/*.json`, served at `/mocks/*` | Flat per-hazard files: `river_erosion.json`, `flood.json`, `landslide.json`, `char.json`, `coastal.json`, plus `common.json`, `chars.json`, `hills.json`, `rivers.json`, `districts.json`, `upazilas.json`, `mouzas.json`, `owners.json`, `plots.json`, `summary.json`, `areas_index.json` | `loadMockJson()` in `lib/data.ts` (client `fetch('/mocks/<file>')`) |
| Source copy (Node / tests) | `mocks/*.json` | Same flat files | `loadMockJson()` on the server side (`fs.readFileSync` from `mocks/`) and Vitest |
| Per-area map packages | `mocks/areas/<hazard>/area_*.json` and `public/mocks/areas/<hazard>/area_*.json` | One package per map area: `areaId`, `hazard`, `mode`, `bounds`, `basemap`, `mouzas`, `hazardLayers`, `context`, `owners` (river_erosion 7, flood 6, landslide 6, char 5, coastal 6) | `lib/data.ts` via `areas_index.json` (maps a hazard / mode / mouza key to an `area_*` file) |
| Landslide terrain rasters | `public/mocks/rasters/<area>/`, `public/mocks/hillshades/` | `elevation_before/after.png`, `hillshade_*.png`, `slope_before.png`, `elevation_change.png`, `contours.geojson`, `spot_heights.json` | Landslide map layers |
| Reserved per-mouza hazard results | `mocks/hazards/<hazard>.json`, `mocks/common/*.json` | Larger per-mouza keyed result sets and a copy of the shared reference tables | Present in `mocks/` only; **not read by the current runtime loader** |
| Generator | `scripts/generate-mocks.ts`, `scripts/generate-map-areas.ts` | Deterministic, seeded generation; writes to both `mocks/` and `public/mocks/` | `npm run generate:mocks` |

```
UI (pages / maps / tables) → lib/data.ts (single access layer, cached) → loadMockJson()
                                   ├─ browser: fetch('/mocks/<file>')  → public/mocks/
                                   └─ server/tests: fs.readFileSync   → mocks/
scripts/generate-mocks.ts + generate-map-areas.ts  → write both folders
```

