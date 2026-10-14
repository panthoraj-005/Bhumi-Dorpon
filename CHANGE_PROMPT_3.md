# Antigravity Change Prompt 3: Light-Themed GIS Basemap (সব ম্যাপ আরও উন্নত)

এটা আপনার **চলমান প্রজেক্টের** জন্য। ম্যাপগুলো আগের মতোই কী কী দেখায় তা থাকবে, কিন্তু সব ম্যাপ একটি Light-Themed GIS Basemap-এ আসবে, সাথে মৌজার নাম ও মৌজাভিত্তিক ক্ষতি, মালিকের আলাদা রঙ (বন্যা), terrain shading ও elevation layer (ভূমিধস) এবং আরও কিছু উন্নতি।

## ব্যবহারের নিয়ম

1. নতুন ফাইল `MAP_SPEC.md` প্রজেক্টের `/docs` ফোল্ডারে রাখুন। সাথে আপডেট হওয়া `PRD`, `APP_FLOW`, `DESIGN`, `TRD`, `BACKEND_SCHEMA`, `ARCHITECTURE` আগেরগুলোর জায়গায় বসান।
2. **Part 1 → Part 2 → Part 3** এই ক্রমে একটার পর একটা দিন। প্রতিটি শেষ হলে ব্রাউজারে দেখে নিন। সবশেষে **চেক প্রম্পট**।
3. মাঝপথে থামলে একই Part আবার দিন, শুরুতে `Continue where you stopped; do not redo finished work.` যোগ করে।
4. আগের প্রম্পট ফাইলগুলোর ম্যাপ-স্টাইল নির্দেশ (সমতল `#EEF0E6` ব্যাকগ্রাউন্ড ইত্যাদি) এখন পুরোনো। ম্যাপের ব্যাপারে এই ফাইল ও `MAP_SPEC.md` চূড়ান্ত, এটা প্রম্পটেই লেখা আছে।

| Part | কাজ |
|---|---|
| 1 | নিয়ম সেভ, অডিট, জেনারেটর বাড়ানো: বেসম্যাপ স্তর, পাশাপাশি মৌজা, মৌজাভিত্তিক সংখ্যা, context তথ্য, DEM ও terrain ছবি, মালিকের রঙ-নম্বর |
| 2 | LightGisBasemap, ম্যাপ ক্রোম (graticule, রিডআউট, locator, লেয়ার প্যানেল), মৌজা লেবেল, Mouza-wise প্যানেল, Water status কার্ড; নদী ভাঙ্গন, চর, উপকূল ম্যাপ |
| 3 | বন্যা (মালিকভিত্তিক রঙ) ও ভূমিধস (terrain), মালিক-পেজ ও ড্যাশবোর্ড প্রিভিউ ম্যাপ, যাচাই |

---

## Part 1: নিয়ম, অডিট ও ডাটা বাড়ানো

```
You are working on the existing "BhumiDorpon" Next.js demo (English-only UI, mock data only, no backend, all maps already on Leaflet, every plot a four-corner polygon). We are upgrading ALL maps to a professional Light-Themed GIS Basemap. This is PART 1 of 3: rules, audit, and extending the mock-data generator. Do not change map components yet.

STEP 0. DOCS AND RULES
New and updated files are in /docs: MAP_SPEC.md (new, the authority for every map), PRD.md, APP_FLOW.md, DESIGN.md, TRD.md, BACKEND_SCHEMA.md, ARCHITECTURE.md. Read MAP_SPEC.md completely, then PRD section 5.7, TRD section 12. Append these rules to /docs/BUILD_RULES.md (keeping all existing rules) and re-read the file before each later task. MAP_SPEC.md wins over any earlier map-styling instruction (for example the plain #EEF0E6 container background, or "no outside tile layers" wording); there are still NO outside tile layers.
11. EVERY MAP USES THE LIGHT GIS BASEMAP defined in /docs/MAP_SPEC.md (synthetic, generated from mock data): land, land use, water, roads, buildings, embankments, upazila and mouza boundaries, graticule, scale bar, north arrow, locator inset, layer panel.
12. MOUZA NAMES ON EVERY MAP. On river-erosion, char and coastal maps each mouza label also carries its loss/gain badge (Forecast: projected), and a Mouza-wise summary panel sits beside the map.
13. FLOOD MAPS COLOUR EACH OWNER'S PLOTS SEPARATELY (with an owner legend panel); LANDSLIDE MAPS HAVE TERRAIN: elevation tint, hillshade, contours, slope and elevation change.
Start a new section "Change 3" in /docs/CHANGE_LOG.md.

STEP 1. AUDIT (no code changes yet)
In CHANGE_LOG.md, list for each of the five hazard maps, the owner-page map and the dashboard preview: which layers it has today, whether mouza names are shown, whether neighbouring mouzas exist, and for landslide whether any terrain/DEM exists. Also record how mouzas are currently generated (separate rectangles per mouza vs shared borders).

STEP 2. EXTEND THE GENERATOR (/scripts/generate-mocks.ts; seeded and deterministic; run `npm run generate:mocks`)
Follow MAP_SPEC.md sections 4, 7, 8, 9 and 10 exactly. In summary:
a) MAP AREAS. For each hazard, generate an area (a reach along a river, a stretch of coast, a char area, a floodplain, a hill area) FIRST: river centreline and bank lines, shoreline, island shapes, flood channels, DEM. Then split the land into 4-7 ADJACENT MOUZAS by cutting perpendicular to the river or shoreline, so neighbouring mouzas share exact borders (no gaps, no overlaps above 1%). Each mouza has name (fictional), jlNo, areaDecimal and a labelAnchor from turf polylabel. Keep 25-45 four-corner plots per mouza as before.
b) BASEMAP per area: land, landuse (farmland, vegetation, settlement patches), water (rivers, sea, beels, tidal flats), waterlines (canals), roads (major and minor), embankments (coast and floodplain), buildings (small clusters), pois (school, mosque, market, health centre), upazila polygon, and label anchors with bearing for river and sea names.
c) PER-MOUZA RESULTS. For river erosion, char and coastal (recorded and forecast) compute lossDecimal, gainDecimal, areaDecimal and percent for EVERY mouza in the area (not only the selected one) from real intersections, so the Mouza-wise summary and the map badges use the same numbers as the owner tables.
d) CONTEXT objects per result: river erosion Water status (channel width at 3 transects with change since last year, thalweg shift in m, mean bank migration m/yr; forecast: projected values); char Water status (active channel width, char area now and last year, net change); coastal Water status (shoreline change m/yr, tidal flat area, tidal range in m, net land change); flood context (peak water level vs danger level in m, duration, % of mouza flooded); landslide terrain context (min/max elevation, mean slope, scar mean slope, soil volume, trigger rainfall). Where possible COMPUTE from the geometry instead of inventing.
e) FLOOD: every owner gets a deterministic colorIndex (0-11, see palette in MAP_SPEC section 8); the flood area includes canals, beels, an embankment, a road and settlement blocks.
f) LANDSLIDE TERRAIN per hill area: DEM grid about 256x256 from a few Gaussian hills plus seeded noise; scar and debris polygons along steepest descent; DEM_after = DEM_before - scar depth + debris deposit; cut volume and fill volume must match the stored soil volume within 1%. Render PNGs with bounds into the area's folder: elevation_before, elevation_after (hypsometric tint, stops from MAP_SPEC section 2), hillshade_before, hillshade_after (multi-directional, azimuth 315, altitude 45, vertical exaggeration 2), slope_before (4 classes), elevation_change (diverging coral for cut, blue for fill, white at zero). Also write contours (10 m interval, every 5th is an index contour with its elevation) and spot heights (peaks with elevation) as GeoJSON, and legend metadata (min/max elevation, colour stops). Hill areas contain 2-3 mouzas with names and borders; forecast results get susceptibility zones (Moderate/High/Very high) and a predicted scar outline.
g) OPTIONAL STRETCH (only if everything else passes): bank-line history for river erosion and coastal (2022-2026, one line per year).
h) Output layout: /public/mocks/areas/<hazard>/<areaId>.json (bounds, basemap, mouzas with loss/gain, context) plus /public/mocks/rasters/<areaId>/*.png, contours and spot heights. Lazy-load per area; never bundle into the main JS.

STEP 3. TYPES AND DATA LAYER
Add types for MapArea, Basemap, MouzaSummary, ContextCard and TerrainAssets in /lib/types.ts. Add getMapArea(hazard, mode, resultId) returning { bounds, basemap, mouzas (with lossDecimal, gainDecimal, areaDecimal, percent, labelAnchor), hazardLayers, context, terrain? , owners? (with colorIndex) }. Keep all existing data-layer functions working.

STEP 4. TESTS (Vitest) AND REPORT
- Adjacent mouzas share borders (gaps and overlaps below 1%); every mouza has name, jlNo and labelAnchor inside its polygon.
- Sum of per-mouza loss equals the sum of plot impacts for that result within 1%.
- Every area has all basemap layers listed in MAP_SPEC section 4; every flood owner has colorIndex 0-11; every landslide area has all raster files, contours and spot heights; cut volume and fill volume match soil volume within 1%.
- Existing tests (four-corner plots, dataset sums, forecast has no status/paid) still pass.
Report the counts (areas, mouzas, features per layer, rasters) and append what you changed to /docs/CHANGE_LOG.md. Do not claim anything works unless you ran it.
```

---

## Part 2: বেসম্যাপ, ম্যাপ ক্রোম ও নদী ভাঙ্গন, চর, উপকূল ম্যাপ

```
Re-read /docs/BUILD_RULES.md, /docs/MAP_SPEC.md and /docs/CHANGE_LOG.md before starting.

PART 2 of 3. Build the Light GIS Basemap and the shared map chrome, then rebuild the River Erosion, Char and Coastal maps on it. Keep Leaflet, the existing MapCompare swipe (Swipe | Side by side | Toggle, synced maps) and the existing data layer; extend them. All map-styling instructions from earlier prompts are superseded by MAP_SPEC.md. No outside tile layers.

STEP 1. LightGisBasemap (/components/map/basemap)
- A layer factory that builds, from area.basemap and area.mouzas, every layer in MAP_SPEC sections 3 and 4 on the specified Leaflet panes (z-indexes from the table), using the colours from section 2, on the SVG renderer. The same factory builds the layers for both maps of the swipe pair (separate instances and separate SVG pattern defs). Hatch patterns (loss coral, unowned grey, forecast purple) are injected into each map's SVG defs.
- Mouza tint: six faint tints rotating across mouzas so neighbours are distinguishable; mouza boundaries 1.25px; upazila boundary dash-dot 2px; roads with casing (white fill on grey casing); embankment dashed with ticks; tidal flats with a faint dot pattern; buildings and POIs very light so the hazard layers stay dominant.
- Water labels (river and sea names): italic #5B87A6 divIcons rotated to the bearing from the label anchors.

STEP 2. MAP CHROME (/components/map/chrome), used by every map
- Graticule with zoom-dependent step (0.01, 0.005, 0.002, 0.001 degrees), edge labels, soft colours.
- Coordinate readout bottom-left: "Lat 24.512345 · Lon 89.712345 · z16", updating on mouse move.
- L.control.scale (metric) and a north arrow.
- Locator inset top-right (about 140x110px, non-interactive): upazila outline, the area rectangle, and the live view rectangle.
- Layer panel (collapsible, grouped exactly as in MAP_SPEC section 5) with opacity sliders and presets Survey | Analysis | Clean. Toggles apply to BOTH maps of the swipe pair. Keep panel state in a small Zustand store.
- View toggle Reach view | Mouza view (default Mouza view: fit to the selected mouza with neighbouring mouza borders and labels visible; Reach view fits all mouzas of the area). Fit-to-area button.
- Legend (per hazard), bottom-right.
- Mobile (<768px): panels move into bottom tabs: Layers, Mouzas, Water.

STEP 3. MOUZA LABELS
- Label = mouza name (bold) + small "JL 42", at labelAnchor, white halo for legibility, rendered as divIcons in the mouza-labels pane.
- River erosion, char and coastal: a badge under the label with the mouza's loss and gain, for example "-842 dec" (coral) and "+120 dec" (green); Forecast uses purple with "proj."; values follow the unit toggle.
- Selected mouza: bold border and larger label. Declutter: hide a mouza's label when its on-screen width is below about 90px; priority = selected mouza, then larger loss; hide lower-priority labels that overlap higher ones. Recompute on zoom and move.
- Hover tooltip on each mouza: name, JL no, total area, loss, gain, affected owners.

STEP 4. PANELS
- MouzaSummaryPanel: for every mouza in the area: Mouza | Loss | Gain | % of mouza | small bar; sorted by loss; selected mouza pinned on top; totals row. Hover highlights the mouza on both maps; click flies to it (on mouza-list pages click opens that mouza's detail). It doubles as the accessible text alternative of the map.
- WaterStatusCard: renders the area's context object for river erosion, char and coastal exactly as MAP_SPEC section 7 lists (with change vs last year; Forecast shows projected values and the Forecast badge).

STEP 5. REBUILD THE THREE MAPS (keep what each showed before, now on the new basemap)
1. RiverErosionMap per MAP_SPEC 7.1.
2. CharMap per MAP_SPEC 7.2 (char mouzas or "Unassigned" labelled).
3. CoastalMap per MAP_SPEC 7.3 (sea depth bands, tidal flats, embankment, mangrove, "No mouza" label on unassigned new land).
Each keeps its own component, layers and legend. Recorded and Forecast modes both work; in Forecast mode the Before map shows the current state and the After map the projected state.

STEP 6. VERIFY
- Screenshots of all three maps in recorded and forecast modes at 1440, 1024 and 390px. Check against MAP_SPEC section 11: basemap layers visible, mouza names readable, badges correct, summary panel numbers equal map badges and owner-table totals, Water status card numbers plausible, both swipe maps stay in sync, hatch visible in both maps, no label clutter.
- Playwright: for every river-erosion, char and coastal detail page in both modes assert: two Leaflet containers; at least one mouza label; the summary panel row count equals the number of mouzas in the area; the selected mouza is pinned; the Water status card is present; no console errors.
- Run lint, type-check and the whole test suite (including the all-combinations dropdown test).
Append results to /docs/CHANGE_LOG.md. Do not claim anything works unless you ran it.
```

---

## Part 3: বন্যা, ভূমিধস, মালিক-পেজ ও ড্যাশবোর্ড প্রিভিউ

```
Re-read /docs/BUILD_RULES.md, /docs/MAP_SPEC.md and /docs/CHANGE_LOG.md before starting.

PART 3 of 3. Rebuild the Flood and Landslide maps on the Light GIS Basemap and chrome from Part 2, then update the flood owner-page map and the dashboard preview. No outside tile layers.

STEP 1. FLOOD MAP (MAP_SPEC 7.4 and 8)
- Same basemap and chrome as Part 2 (mouza names, graticule, scale, north arrow, locator inset, layer panel, view toggle). Include embankment, roads and settlement blocks.
- Before map: normal water bodies plus EVERY OWNER'S PLOTS IN THEIR OWN COLOUR (palette from MAP_SPEC section 8, using each owner's colorIndex; same owner = same colour on every page). After map: flood extent in three depth bands (Shallow #CFE3F0, Moderate #9CC3DE, Deep #5B9BC8) in the flood pane BELOW the plots; plots drawn at 45% opacity in the owner colour with a 2px owner-coloured border so the blue shows through; fully flooded plots get a blue wave-line hatch overlay. Dag numbers as labels; unowned plots grey.
- More than 12 owners: reuse colours but vary the border style (dash/dot) and show the owner's initials in the plot label. Colour is never the only indicator: tooltips (Dag No., Khatian No., Owner, flooded area, depth) and legend names carry the same information.
- OwnerLegendPanel: scrollable list with colour swatch, owner name, number of plots, flooded area; search box; clicking an owner isolates that owner's plots (others dimmed) and clicking again clears it; "View owner page" link; hover highlights on both maps. Keep it in sync with the affected-owners table below the map.
- FloodContextCard: peak water level vs danger level, duration, % of the mouza flooded (from the area's context object).
- Optional layer "Low-lying ground": very faint elevation tint.

STEP 2. LANDSLIDE MAP (MAP_SPEC 7.5 and 9)
- Same basemap and chrome (mouza names and borders for the 2-3 mouzas of the hill area, stream, roads).
- Terrain layers from the area's rasters via L.imageOverlay in the terrain pane: Elevation tint (hypsometric), Hillshade (multiply-style over the tint, about 55-65% opacity), Slope angle (4 classes), Elevation change (cut coral, fill blue). Contours at 10m with index contours every 5th (thicker, labelled "320 m"), spot heights (peak triangle plus elevation), and an Elevation legend (colour bar with min-max metres).
- Before map uses elevation_before and hillshade_before; After map uses elevation_after, hillshade_after with the scar and the hatched debris runout and a downslope arrow; the two terrain images must look visibly different. Elevation change toggle shows cut and fill.
- Forecast mode: current terrain on the left, susceptibility zones (Moderate/High/Very high) and the dashed predicted scar outline on the right.
- Layer panel group "Terrain" with Elevation tint, Hillshade, Contours, Slope, Elevation change, and an opacity slider for the terrain.
- TerrainContextCard: min/max elevation, mean slope, scar mean slope, soil volume, trigger rainfall.
- Make sure hillshade and tint rasters align exactly with the vector layers (same bounds); test by overlaying the scar polygon on the elevation change raster.

STEP 3. OTHER MAPS
- Flood owner page (/flood/[mouzaId]/[floodId]/owner/[ownerId]): same basemap and chrome, the owner's plots in the owner's colour (identical to the flood map), other plots dimmed, mouza names visible, each plot's four corners marked 1-4. All earlier owner-page features (four-corner tables, copy buttons, CSV, GeoJSON) stay.
- Dashboard map preview card: a small non-interactive version of the same basemap with the most affected mouza highlighted and its name shown.

STEP 4. VERIFY
- Screenshots of the flood map (before, after, owner isolated), the landslide map (elevation tint, hillshade, contours, slope, elevation change, before, after, forecast), the owner-page map and the dashboard preview, at 1440, 1024 and 390px. Check against MAP_SPEC section 11.
- Playwright: for every flood detail page assert the legend lists every owner of that flood with a distinct colour (or distinct border style beyond 12), and isolate/clear works; for every landslide detail page assert all terrain layers can be toggled, two images are different (compare the Before and After raster URLs), contours and spot-height labels render, no console errors; for the owner page assert the owner's plots use the same colour as in the flood map.
- Run lint, type-check and the whole test suite including the all-combinations dropdown test.
- Grep that no map uses outside tile layers (no tile URL templates in the code) and no MapLibre/Mapbox code remains.
Append results to /docs/CHANGE_LOG.md, then finish with a short summary and known gaps. Do not claim anything works unless you ran it.
```

---

## চেক প্রম্পট (সব শেষে)

```
Do a final acceptance check of ALL maps against /docs/MAP_SPEC.md section 11 and /docs/BUILD_RULES.md rules 9-13. For every checklist item, state PASS or FAIL with evidence (test output or screenshot path), for each of the five hazards in Recorded and Forecast modes plus the flood owner page and the dashboard preview. Especially: (1) one consistent Light GIS basemap with graticule, scale, north arrow, locator inset, layer panel and presets; (2) mouza names visible on every map, and loss/gain badges plus the Mouza-wise summary panel on river erosion, char and coastal; (3) Water status cards on river, char and coastal maps with numbers consistent with the geometry; (4) flood plots in per-owner colours with a working legend panel, isolation and the same colours on the owner page; (5) landslide terrain: elevation tint, hillshade, contours with index labels, spot heights, slope and elevation change, with visibly different Before and After terrain; (6) Forecast maps for all five hazards; (7) both swipe maps stay in sync and show hatches; (8) the maps remain readable at 1440, 1024 and 390px; (9) Leaflet only, no outside tile layers, no MapLibre; (10) all earlier rules still pass (dynamic dropdowns, Dag No. and Khatian No. in owner tables, four plot corners everywhere, forecast shows only projected compensation). Fix every FAIL and re-run until all pass.
```

---

## ঐচ্ছিক উন্নতি (সব পাস হওয়ার পর আলাদা প্রম্পটে)

```
Re-read /docs/BUILD_RULES.md and /docs/MAP_SPEC.md. Implement the optional stretch items for the map system, one at a time, verifying each in the browser: (1) bank-line history for river erosion and coastal: a Years control (2022-2026 plus the forecast year) that shows one line per year with a legend and the yearly retreat per transect; (2) "Download map PNG" that exports the current map view (both maps in Side by side mode) with legend, scale bar and title using html-to-image; (3) a measure tool (distance and area, metric, in km and decimal) that works on the SVG map without tile layers. Keep the existing tests green and add Playwright checks for each item.
```
