# Antigravity Change Prompt 2: Leaflet ম্যাপ ও বন্যায় চার কোনার কোঅর্ডিনেট

এটা আপনার **বানানো থাকা প্রজেক্টের** জন্য। দুটি পরিবর্তন:
1. সব Before/After ম্যাপ (পাঁচ দুর্যোগের সব ম্যাপ) MapLibre থেকে **Leaflet**-এ যাবে।
2. বন্যার মালিক-পেজে প্রতিটি জমির **চারটি কোনার কোঅর্ডিনেট** দেখাবে, একটি নয়।

## ব্যবহারের নিয়ম

1. আপডেট করা `.md` ফাইলগুলো (`PRD`, `TRD`, `APP_FLOW`, `BACKEND_SCHEMA`, `ARCHITECTURE`, `DESIGN`, `architecture.svg`) প্রজেক্টের `/docs` ফোল্ডারে আগেরগুলোর জায়গায় বসান।
2. **Part 1** পেস্ট করুন, শেষ হলে ব্রাউজারে বন্যার মালিক-পেজ দেখে নিন। তারপর **Part 2** দিন। ক্রম বদলাবেন না, কারণ Part 2-এর ম্যাপ Part 1-এর নতুন ডাটার উপর দাঁড়ায়।
3. সবশেষে **চেক প্রম্পট** দিন।
4. মাঝপথে থামলে একই Part আবার পেস্ট করুন, শুরুতে `Continue where you stopped; do not redo finished work.` যোগ করে।

---

## Part 1: দাগ চার কোনার করা ও বন্যার মালিক-পেজে চার কোনার কোঅর্ডিনেট

```
You are working on the existing "BhumiDorpon" Next.js demo (English-only UI, mock data only, no backend). Two changes are needed. This is PART 1 of 2: make every plot a four-corner polygon and show all four corner coordinates on the flood owner page. Part 2 (Leaflet) comes in a later message; do not touch the map library now.

STEP 0. DOCS AND RULES
The files in /docs were just updated (PRD.md, APP_FLOW.md, DESIGN.md, TRD.md, BACKEND_SCHEMA.md, ARCHITECTURE.md). Read PRD section 5.3, APP_FLOW S4/S5 and DESIGN section 7 (owner land page). Then append these two rules to /docs/BUILD_RULES.md (create the file if it does not exist, keeping any existing rules) and re-read the file before each later task. If a doc conflicts with these rules, the rules win.
9. ALL MAPS USE LEAFLET (leaflet + react-leaflet), including every Before/After map. No MapLibre, Mapbox or react-map-gl anywhere in the project.
10. EVERY PLOT HAS FOUR CORNERS. Wherever a plot's location is shown (flood owner page, exports), show ALL FOUR corner coordinates (lat, lon, 6 decimals). Never show a single point or centroid as a plot's coordinate.
Also start /docs/CHANGE_LOG.md (or append to it) with a section "Change 2".

STEP 1. AUDIT (no code changes yet)
Open the flood owner page in the running app and note in CHANGE_LOG.md what it shows today (it currently shows one coordinate per plot). Find where plots are generated (/scripts/generate-mocks.ts or equivalent) and check how many vertices each plot polygon has; clipped plots usually end up with 5, 6 or more.

STEP 2. FIX THE PLOT GEOMETRY IN THE GENERATOR
- Every plot polygon must be an irregular quadrilateral with EXACTLY FOUR corners (a closed ring of 5 points where the 5th repeats the 1st).
- Never clip a plot to the land, mouza or river boundary. Generate only grid cells that lie fully on land: skip, or shift/shrink, any cell that has a corner in water or outside the mouza.
- Hazard impacts are still computed by intersecting the plot with the hazard polygon (turf), without changing the plot itself.
- Corner order is fixed: 1 = NW, 2 = NE, 3 = SE, 4 = SW (derive it from the four points: the two northern points sorted west to east, then the two southern points sorted east to west).
- Add to /lib/types.ts: Corner = { label: "NW" | "NE" | "SE" | "SW"; lat: number; lon: number } and Plot.corners: [Corner, Corner, Corner, Corner]. Note GeoJSON stores [lon, lat]; the UI always shows latitude first.
- getOwnerPlots(floodId, ownerId) must return, per plot: dagNo, khatianNo, landClass, areaDecimal, corners (exactly four), flood status. Remove centroid from this response.
- Re-run `npm run generate:mocks` (keep the seed deterministic). Because plots changed, check that sums still match: plot impacts plus unowned land should equal the hazard polygon area within 1%. Fix any hazard whose numbers drifted.

STEP 3. FLOOD OWNER PAGE: /flood/[mouzaId]/[floodId]/owner/[ownerId]
- Header: owner name, father's name, plots count, total area, total flooded, "Back to flood".
- Map: only this owner's plots highlighted and numbered, others dimmed, and each plot's FOUR corners marked 1-4 on the map (small numbered markers).
- Below or beside the map, a card for EACH of this owner's plots in the mouza, showing Dag No., Khatian No., Land class, Area, Flood status (Not flooded / Partial / Full + depth), AND ALL FOUR CORNER COORDINATES, always visible, not hidden behind an expander: a small nested table "Corner | Latitude | Longitude" with rows 1 (NW), 2 (NE), 3 (SE), 4 (SW), 6 decimals, latitude first. Do not show a centroid.
- Clicking a plot card zooms the map to that plot. Per plot: button "Copy 4 corners" (copies four "lat, lon" lines). On the page: "Copy all coordinates", "Download CSV" (columns dag_no, khatian_no, c1_lat, c1_lon, c2_lat, c2_lon, c3_lat, c3_lon, c4_lat, c4_lon) and "Download GeoJSON".
- The affected-owners table on the flood detail page keeps one row per owner-plot (Owner link, Dag No., Khatian No., Flooded area, Depth class); the owner name still opens this page.

STEP 4. VERIFY
- Unit tests: every plot in the dataset has exactly four distinct corners and a closed ring of 5 points; corner order is NW, NE, SE, SW; no plot corner lies in a water polygon; the sanity sums from the earlier dataset tests still pass.
- Playwright: for every flood, for every owner listed, open the owner page and assert that the number of coordinate pairs shown equals 4 x (number of that owner's plots), with latitude and longitude both having 6 decimals; assert "Copy 4 corners" exists per plot; assert the CSV download has 4 coordinate pairs per row.
- Check one owner page in the browser with a screenshot.
Append what you changed and the results to /docs/CHANGE_LOG.md. Do not claim anything works unless you ran it.
```

---

## Part 2: সব ম্যাপ MapLibre থেকে Leaflet-এ

```
Re-read /docs/BUILD_RULES.md and /docs/CHANGE_LOG.md before starting.

This is PART 2 of 2 for the existing "BhumiDorpon" demo. Replace the map library everywhere: ALL maps, including every Before/After map and the owner-page map, must use LEAFLET. No MapLibre, Mapbox or react-map-gl may remain. Keep the five hazard map designs, their legends and the data layer exactly as they are; only the rendering library changes.

STEP 1. AUDIT
List every file that imports maplibre-gl, react-map-gl, maplibre-gl-compare or their CSS, and every map usage: the five hazard maps (RiverErosionMap, FloodMap, LandslideMap, CharMap, CoastalMap), the shared MapCompare, the flood owner page map, and the dashboard map preview card. Write the list into /docs/CHANGE_LOG.md.

STEP 2. SWAP THE DEPENDENCIES
Install leaflet, react-leaflet and @types/leaflet (use the react-leaflet version that matches the project's React version: v4 for React 18, v5 for React 19). Uninstall maplibre-gl, react-map-gl and any maplibre plugin. Remove their imports and CSS. Load Leaflet client-side only (next/dynamic with ssr:false) and import leaflet/dist/leaflet.css once. Use divIcon or circleMarker, never Leaflet's default marker image.

STEP 3. REBUILD THE SHARED MAP LAYER (/components/map)
- MapCompare: two synchronised Leaflet maps ("Before" and "After"/"Forecast") stacked in one card. The "After" map sits on top and is revealed with a draggable divider (CSS clip-path; role="slider" with aria-valuenow; arrow keys move it). View switch: Swipe | Side by side | Toggle. Keep both maps in sync on move and zoom in both directions with a re-entrancy guard (setView with animate:false). Both maps must receive the same bounds, zoom and options.
- No outside tile layers. Set the container background to the land colour #EEF0E6 and draw everything from the mock GeoJSON with L.geoJSON on the SVG renderer: water #BFD9EC with a #2F7FB8 outline, plots with a light grey outline, mouza boundary dark grey. Use separate map panes for z-order (water, plots, hazard overlay, labels, markers).
- Hatch patterns for loss (coral), unowned land (grey) and forecast (purple, dashed outlines): inject SVG <pattern> defs into each map's SVG renderer and use fillColor 'url(#id)', or use the leaflet.pattern plugin. Each of the two maps needs its own defs.
- Labels: Dag numbers as permanent tooltips or divIcon labels once plots are large enough to read (about zoom >= 16); transect labels, "No mouza" label and similar as divIcon.
- Controls: L.control.zoom, a fit-to-area button (map.fitBounds with padding [24,24]), L.control.scale (metric only), a north-arrow control, a legend control, layer toggles (L.layerGroup), an opacity slider.
- Interaction: plot hover tooltip via bindTooltip (sticky) with Dag No., Khatian No., Owner, affected area; plot click highlights its table row; table row click zooms the map to the plot (flyToBounds).
- Hillshade (landslide) via L.imageOverlay with the DEM-derived PNG and the correct bounds.
- Card: 20px radius, 480-560px high, small "Synthetic demo geometry" note.

STEP 4. REBUILD THE FIVE HAZARD MAPS ON THE NEW LAYER (same designs as before, still clearly different from each other)
1. RiverErosionMap: BEFORE last year's bank line (dark blue). AFTER current bank line plus the lost strip as coral hatch and three transect labels such as "42 m". Forecast: dashed purple projected bank line plus an uncertainty band.
2. FloodMap: BEFORE normal water bodies. AFTER inundation in three blue depth bands (Shallow, Moderate, Deep) plus plots shaded by flooded fraction (none/partial/full); depth legend.
3. LandslideMap: hillshade (L.imageOverlay) plus labelled contour lines, stream, road. BEFORE intact vegetated slope. AFTER earth-brown scar plus hatched debris runout and a downslope arrow. Forecast: susceptibility zones (Moderate/High/Very high) plus a dashed predicted scar outline.
4. CharMap: BEFORE last year's islands in sand colour #EADFC0. AFTER current shapes with green accretion, coral erosion, last year's outline dashed, grey hatch for unowned land. Forecast: next-year shape dashed.
5. CoastalMap: BEFORE dashed shoreline, sea depth bands, tidal flats, embankment, mangrove patch. AFTER current shoreline, green new land seaward, coral erosion landward, "No mouza" label on unassigned land. Forecast: next-year shoreline dashed.
Also move the flood OWNER-PAGE map (owner's plots highlighted and numbered, others dimmed, four corners 1-4 per plot) and the dashboard map preview card (non-interactive: dragging, zoom and scroll disabled) to Leaflet.

STEP 5. VERIFY
1. `grep -ri "maplibre\|react-map-gl\|mapbox" .` (excluding node_modules, lockfile and /docs) must return nothing; package.json must contain no MapLibre or Mapbox package.
2. Open every one of the five maps in recorded and forecast modes plus the owner page and the dashboard preview; take screenshots. For each, check that it looks as good as before or better: legend readable, labels not cluttered, sensible initial zoom, hatch patterns visible in BOTH maps of the swipe pair, both maps stay aligned when panning and zooming, swipe works by mouse drag, touch and arrow keys.
3. Playwright: for every hazard detail page (recorded and forecast), assert two .leaflet-container elements exist, no `maplibregl` classes exist, no console errors, and the swipe divider changes the visible split when moved with the keyboard. Also re-run the all-combinations test from before and make sure everything still passes.
4. Run lint, type-check and all tests.
Append what you changed and the results to /docs/CHANGE_LOG.md and finish with a short summary and known gaps. Do not claim anything works unless you ran it.
```

---

## চেক প্রম্পট (সব শেষে দিন)

```
Do a final acceptance check against /docs/BUILD_RULES.md for these changes. State PASS or FAIL with evidence (test output or screenshot path) for each: (1) every map, including every Before/After map, the owner-page map and the dashboard preview, is a Leaflet map and no MapLibre/Mapbox code or dependency remains; (2) the five hazard maps still look clearly different from each other and are good looking; (3) swipe, side-by-side and toggle views work and the two maps stay in sync; (4) every plot has exactly four corners; (5) on the flood owner page every plot shows all four corner coordinates (latitude first, 6 decimals) without clicking anything, and no single centroid is shown; (6) "Copy 4 corners", "Copy all coordinates", CSV and GeoJSON downloads work and contain four corners per plot; (7) all earlier rules (dynamic dropdowns, Dag No. and Khatian No. in every owner table, forecast shows only projected compensation) still pass. Fix every FAIL and re-run until all pass.
```
