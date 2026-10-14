# Antigravity Change Prompt: আগে থেকে বানানো BhumiDorpon প্রজেক্ট ঠিক করার জন্য

## ব্যবহারের নিয়ম

1. আপডেট করা `.md` ফাইলগুলো (`PRD`, `TRD`, `APP_FLOW`, `BACKEND_SCHEMA`, `ARCHITECTURE`, `DESIGN`) আপনার প্রজেক্টের `/docs` ফোল্ডারে আগেরগুলোর জায়গায় বসান।
2. নিচের **Main Change Prompt** পুরোটা এজেন্টে পেস্ট করুন।
3. এজেন্ট একসাথে সব করতে গিয়ে আটকে গেলে বা মাঝপথে থেমে গেলে নিচের **ধাপে ধাপে ভাগ** অংশ থেকে এক এক ধাপ দিন।
4. শেষে **চেক প্রম্পট** দিয়ে যাচাই করিয়ে নিন।

---

## Main Change Prompt

```
You are working on an EXISTING Next.js project called "BhumiDorpon" (a Bangladesh land-change demo dashboard: River Erosion, Flood, Landslide, Char Formation & Erosion, Coastal Erosion & Land Accretion). The UI is English only and all data is demo (mock) data with no backend. The app currently has six problems. Fix them all properly, at the root cause, not with patches.

STEP 0. UPDATE DOCS AND SAVE RULES
The files in /docs were just updated (PRD.md, APP_FLOW.md, DESIGN.md, TRD.md, BACKEND_SCHEMA.md, ARCHITECTURE.md). Read PRD.md section 5, APP_FLOW.md and DESIGN.md sections 6-7 first. They are partly in Bengali and partly describe a future backend (ignore the backend). Then create /docs/BUILD_RULES.md with the rules below verbatim. If any doc conflicts with these rules, the rules win.

RULES
1. ENGLISH ONLY UI. No Bengali text, no language toggle, no i18n library.
2. DEMO DATA ONLY. No backend, no database, no ML, no outside data API. All data, including Forecast, is pre-generated static mock data under /mocks (or /public/mocks) and read through one typed data layer (/lib/data.ts). Mode is "recorded" | "forecast".
3. FULLY DYNAMIC. Every dropdown choice must really filter the mock dataset and drive what is shown. Nothing hardcoded per screen. Dropdown options are derived from the dataset. A valid selection never shows a blank screen: it shows results or the correct empty state.
4. DAG NO. AND KHATIAN NO. EVERYWHERE. Every table that lists affected owners, in every hazard and mode, has "Dag No." and "Khatian No." columns.
5. FORECAST SHOWS ONLY ESTIMATED COMPENSATION. Recorded: Est. compensation, Status (Paid / Approved / Pending / Not applied), Paid (৳). Forecast: only "Projected compensation" and projected area. No Status, no Paid, no paid/not-paid wording anywhere in forecast views, including the dashboard Forecast tab.
6. EACH HAZARD HAS ITS OWN MAP DESIGN (own component, layers, styling, legend). Never reuse one generic before/after map for all hazards.
7. Banner on every page: "Demo data: all names, plots and figures are fictional." Every forecast view: "Forecast" badge plus "This is a model-based estimate, not an official government record."
8. Never claim something works without running it in the browser and checking it. Take screenshots.
9. ALL MAPS USE LEAFLET (leaflet + react-leaflet), including every Before/After map. No MapLibre, Mapbox or react-map-gl anywhere in the project.
10. EVERY PLOT HAS FOUR CORNERS. Wherever a plot's location is shown (flood owner page, exports), show ALL FOUR corner coordinates (lat, lon, 6 decimals). Never show a single point or centroid as a plot's coordinate.

STEP 1. AUDIT FIRST (do not change code yet)
Run the app. Reproduce and write down, in /docs/CHANGE_LOG.md, what is currently wrong:
- Which dropdown combinations fail to open or show no result (try many random district/upazila/river/hill/mouza picks in every module and both modes). Find the root causes: state handling, disabled-state logic, query keys, data coverage, cmdk/Select value handling.
- Where forecast views still show paid/status information.
- How flood currently works versus the spec below.
- Which map component each hazard uses (they currently all share one before/after map).
- Which owner tables lack Dag No. or Khatian No.
Then continue with the steps below and update CHANGE_LOG.md with what you changed.

STEP 2. FIX THE DATA FIRST (this is the root of problems 1 and 5)
Replace the hand-made or thin mock data with a deterministic generator (/scripts/generate-mocks.ts, seeded RNG, `npm run generate:mocks`) that writes relational JSON/GeoJSON. Keep route paths and component names where possible so the rest of the app keeps working.
Types: District, Upazila, River, Hill, Mouza (kind registered | unassigned), Owner, Plot {dagNo, khatianNo, landClass, areaDecimal, ownerId, polygon}, PlotImpact {plotId, kind loss|gain, areaDecimal, estCompensationBdt, status? and paidBdt? ONLY on recorded results}, HazardResult, FloodEvent {id, mouzaId, date, year, severity, floodedAreaDecimal, maxDepthM, durationDays, geometry, plotStatus[]}.
Coverage (REAL district, upazila and river names; mouza names, Dag/Khatian numbers and owners are FICTIONAL; owners are invented English names):
- River erosion + Char: Sirajganj (Kazipur, Sirajganj Sadar, Belkuchi; Jamuna), Kurigram (Chilmari, Rowmari, Ulipur; Brahmaputra), Shariatpur (Naria, Zajira, Bhedarganj; Padma), Chandpur (Haimchar, Chandpur Sadar, Matlab Dakshin; Meghna), Bhola (Char Fasson, Bhola Sadar; Meghna).
- Flood: Sunamganj (Sunamganj Sadar, Derai, Tahirpur, Jamalganj), Sylhet (Companiganj, Gowainghat, Beanibazar), Kurigram (Ulipur, Chilmari), Sirajganj (Kazipur, Belkuchi).
- Landslide: Rangamati (Rangamati Sadar, Kawkhali, Baghaichhari), Bandarban (Bandarban Sadar, Lama, Rowangchhari), Cox's Bazar (Cox's Bazar Sadar, Teknaf, Ukhia).
- Coastal: Bhola (Char Fasson, Monpura), Noakhali (Hatiya, Subarnachar), Khulna (Koyra, Dacope), Cox's Bazar (Maheshkhali, Teknaf).
- Every hazard's selector lists ALL these districts, but at least 70% of the district/upazila combinations must have results. In each hazard and mode leave 2-3 upazilas deliberately empty to exercise empty states.
- Per upazila with data: at least 2 rivers (or hills), at least 3 mouzas. Per mouza: 25-45 plots, 15-40 owners (some own several plots), mixed land classes, mixed compensation statuses.
- Events: each riverside mouza gets one recorded and one forecast river-erosion result; each flood mouza gets 1-3 floods (2022-2025); each hill gets 1-3 recorded landslides and 1-2 forecast zones; each river reach gets 1-3 chars (both modes); coastal mouzas incl. 2-3 "Unassigned new land" entries per upazila (both modes).
- Compensation = affected decimals x fictional rate per land class. Forecast impacts carry estCompensationBdt only.
Geometry (real lon/lat near each upazila centre, built with turf.js; plot impacts come from real intersections so on-screen numbers match the map):
- PLOTS: every plot polygon is an irregular quadrilateral with EXACTLY FOUR corners (a closed ring of 5 points). Never clip a plot to the land, mouza or river boundary. Generate only cells that lie fully on land (skip or shift any cell with a corner in water). Hazard impacts are computed by intersecting the plot with hazard polygons, without changing the plot itself.
- River erosion: ~1.5 x 1 km mouza, meandering river (sums of sines + noise), bank line BEFORE, bank line AFTER retreated 20-120 m (more on outer bends), loss strip, 3 transects with retreat distances. Forecast: next-year bank line plus uncertainty band.
- Char: braided channel, 1-3 islands; year-1 shape, current shape, accretion tips and erosion side; accreted land touching no plot = Unowned land. Forecast: next-year shape.
- Coastal: coastline, shoreline BEFORE/AFTER, seaward accretion (gain), landward erosion (loss), tidal flat, sea depth bands, embankment, mangrove patch; new land without mouza = unassigned.
- Flood: floodplain mouza with river, canals, beels (BEFORE); inundation as three nested depth polygons (Shallow < 0.5 m, Moderate 0.5-1.5 m, Deep > 1.5 m) covering 30-85% of the mouza; per-plot flooded decimals and depth class.
- Landslide: synthetic DEM from Gaussian hills, contour lines, a hillshade PNG rendered from the DEM, scar polygon (teardrop along steepest descent), debris runout, stream, road. Forecast: susceptibility zones (Moderate/High/Very high) plus predicted scar outline.
Data layer functions (async, 200-400ms delay): getDashboardSummary(mode), getOptions(hazard, mode, step, selectionSoFar), listResults(hazard, mode, selection), getResult(hazard, mode, id), listFloods(selection), getFlood(id), getFloodOwners(floodId, q?), getOwnerPlots(floodId, ownerId) (each plot: dagNo, khatianNo, landClass, areaDecimal, corners (exactly four {label: NW|NE|SE|SW, lat, lon}), flood status). Dashboard numbers must be aggregated from the same dataset.
Lazy-load per-hazard JSON; do not bundle everything into the main JS.

STEP 3. REBUILD THE SELECTOR (problem 1)
- One reusable SelectorChain with a controlled combobox (shadcn Popover + Command/cmdk, searchable). cmdk lowercases item values, so select by item ID through a closure, never by comparing labels.
- Selection state lives in the URL query (?d=&u=&r=&h=&m=&year=) via one hook (useSelection). The URL is the single source of truth. Refresh, back button, shared links must restore the exact state.
- Step n is enabled as soon as step n-1 has a value and can never get stuck disabled. Changing a step clears only later steps.
- Options come from getOptions(...) and list only valid children (only that upazila's rivers, that river's mouzas, etc.). A small "●" marks options that have records for the current hazard and mode.
- When the final step is set, results load via TanStack Query with the full selection in the query key: skeleton, then results or the correct empty state. Error boundary with "Try again".
- Use this one SelectorChain in all five modules. Remove old per-module selector code.

STEP 4. FIX OWNER TABLES AND COMPENSATION (problems 2 and 6)
- One OwnerTable with variant = "recorded" | "forecast" | "flood".
  - recorded: Owner | Dag No. | Khatian No. | Area (Lost/Gained) | Est. compensation (৳) | Status | Paid (৳)
  - forecast: Owner | Dag No. | Khatian No. | Projected area | Projected compensation (৳). NO Status, NO Paid.
  - flood: Owner (link) | Dag No. | Khatian No. | Flooded area | Depth class
- Search, sort, CSV export; "Unowned" row style; use it in every module.
- Dashboard Forecast tab: the compensation card shows only "Projected compensation"; remove progress bars and paid wording.

STEP 5. FLOOD FLOW (problem 3)
1. Selector: District > Upazila > Mouza (+ optional Year chips). Then the FLOOD LIST: one card per flood with Date, Severity chip (Moderate / Severe / Extreme), Flooded area, Max depth, Duration, Affected owners. None: "No flood has occurred here."
2. Click a flood: /flood/[mouzaId]/[floodId] with summary strip, FloodMap and the affected owners table (search; Owner name as a link, Dag No., Khatian No., Flooded area, Depth class; one row per owner-plot). Search miss: "No owner found with this name."
3. Click an owner name: /flood/[mouzaId]/[floodId]/owner/[ownerId] (Owner Land Page): header (name, father's name, plots count, total area, total flooded, "Back to flood"); Leaflet map with only this owner's plots highlighted and numbered, others dimmed, and each plot's FOUR corners marked 1-4 on the map; then a card for EACH of this owner's plots in the mouza showing Dag No., Khatian No., Land class, Area, Flood status AND ALL FOUR CORNER COORDINATES, always visible (not hidden behind an expander): a small nested table "Corner | Latitude | Longitude" with rows 1 (NW), 2 (NE), 3 (SE), 4 (SW), 6 decimals, latitude first. Do NOT show a single centroid as the plot's coordinate. Card click zooms the map to that plot; per-plot button "Copy 4 corners"; page buttons "Copy all coordinates", "Download CSV" (columns dag_no, khatian_no, c1_lat, c1_lon, c2_lat, c2_lon, c3_lat, c3_lon, c4_lat, c4_lon) and "Download GeoJSON".

STEP 6. FIVE SEPARATE MAPS (problem 4)
Build or rebuild the map layer in /components/map:
- Shared MapCompare infrastructure, built with LEAFLET (install leaflet, react-leaflet and @types/leaflet; use the react-leaflet version that matches the project's React version; uninstall maplibre-gl, react-map-gl and any maplibre plugins and delete their imports and CSS). Two synchronised Leaflet maps ("Before" and "After"/"Forecast") stacked in one card: the "After" map sits on top and is revealed with a draggable, arrow-key accessible swipe divider (CSS clip-path; role="slider"), plus a view switch Swipe | Side by side | Toggle. Sync both maps on move and zoom in both directions with a re-entrancy guard (setView with animate:false). Load Leaflet client-side only (next/dynamic with ssr:false) and import leaflet/dist/leaflet.css. Use divIcon or circleMarker, never the default marker image.
- No outside tile layers. Give the map container the land colour #EEF0E6 as its background and draw everything from the mock GeoJSON with L.geoJSON on the SVG renderer: water #BFD9EC with a #2F7FB8 outline, plots with a light grey outline, mouza boundary dark grey. Use separate map panes for z-order. Show Dag numbers as permanent tooltips or divIcon labels once plots are large enough to read (about zoom >= 16).
- Controls: L.control.zoom, a fit-to-area button (map.fitBounds with padding), L.control.scale (metric), a north-arrow control, a legend control, layer toggles (L.layerGroup), and an opacity slider. Plot hover tooltip via bindTooltip (sticky) with Dag No., Khatian No., Owner, affected area. Plot click highlights its table row; row click zooms to the plot (flyToBounds). Hatch patterns for loss (coral), unowned (grey) and forecast (purple, dashed outlines): inject SVG <pattern> defs into each map's SVG renderer and use fillColor 'url(#id)' (or use the leaflet.pattern plugin); remember both maps need their own defs. Hillshade images via L.imageOverlay. Card 20px radius, 480-560px high, small "Synthetic demo geometry" note.
- FIVE separate components with their own layer config and legend, clearly different designs (not recolours):
  1. RiverErosionMap: BEFORE last year's bank line (dark blue); AFTER current bank line plus the lost strip as coral hatch and three transect labels like "42 m"; Forecast dashed purple projected bank line plus uncertainty band.
  2. FloodMap: BEFORE normal water bodies; AFTER inundation in three blue depth bands plus plots shaded by flooded fraction (none/partial/full); depth legend.
  3. LandslideMap: hillshade image (L.imageOverlay) plus labelled contour lines, stream, road; BEFORE intact vegetated slope; AFTER earth-brown scar plus hatched debris runout and downslope arrow; Forecast susceptibility zones plus dashed predicted scar outline.
  4. CharMap: BEFORE last year's islands in sand colour #EADFC0; AFTER current shapes with green accretion, coral erosion, last year's outline dashed, grey hatch for unowned land; Forecast next-year shape dashed.
  5. CoastalMap: BEFORE dashed shoreline, sea depth bands, tidal flats, embankment, mangrove; AFTER current shoreline, green new land seaward, coral erosion landward, "No mouza" label on unassigned land; Forecast next-year shoreline dashed.
Open every map in the browser, take screenshots in both modes, and make them genuinely good looking: clean legend, readable labels, no clutter, sensible zoom. Improve until they are.

STEP 7. VERIFY (problem 5 and everything else)
1. Write a Playwright test that reads the dataset and, for EVERY hazard, mode and every dropdown combination, opens the page through the real UI and asserts it shows a results list or the exact empty-state message, never a blank panel, never a console error. Also open every result detail page and every flood owner page. Fix all failures.
2. Automated rule checks: no Bengali characters in rendered text, no language toggle, no data requests to outside hosts, every owner table has "Dag No." and "Khatian No." headers, no "Paid"/"Status" in forecast views or the dashboard Forecast tab, banner on every page, forecast disclaimer on every forecast page; Leaflet is the only map library (no maplibre-gl or react-map-gl in package.json or code); every plot has exactly four corners and every flood owner page shows four coordinate pairs per plot.
3. Test refresh, back/forward, a pasted deep link, switching Recorded/Forecast with a selection kept, changing district after everything is picked, keyboard-only use.
4. Run lint, type-check and all tests.
Finish with a short summary: what was broken, what you changed, test results, and known gaps. Do not claim anything works unless you ran it.
```

---

## ধাপে ধাপে ভাগ (এজেন্ট একসাথে সব না পারলে)

Main Change Prompt-এর **STEP 0 ও STEP 1** সবসময় প্রথমে দিন। তারপর:

| ধাপ | কোন অংশ দেবেন | কেন |
|---|---|---|
| ক | STEP 0, 1, 2 | আগে ডাটা ঠিক করুন, কারণ ড্রপডাউনের সমস্যার মূল এখানে |
| খ | "Re-read /docs/BUILD_RULES.md" + STEP 3, 4 | সিলেক্টর ও মালিক টেবিল |
| গ | "Re-read /docs/BUILD_RULES.md" + STEP 5, 6 | বন্যা ও পাঁচটি ম্যাপ |
| ঘ | "Re-read /docs/BUILD_RULES.md" + STEP 7 | টেস্ট ও যাচাই |

প্রতিটি ধাপের শুরুতে এই লাইন যোগ করুন: `Re-read /docs/BUILD_RULES.md and /docs/CHANGE_LOG.md before starting.`

---

## চেক প্রম্পট (সব শেষে দিন)

```
Do a final acceptance check against /docs/BUILD_RULES.md. For each of the 10 rules and each of these 8 items, state PASS or FAIL with evidence (test output or screenshot path): (1) every dropdown combination shows results or the right empty state, (2) forecast views show only projected compensation, (3) flood list -> flood detail -> owner land page with all plot coordinates, (4) five visibly different hazard maps, (5) results change when dropdown choices change, (6) Dag No. and Khatian No. in every owner table, (7) every map, including every Before/After map, is a Leaflet map and no MapLibre code or dependency remains, (8) every plot has exactly four corners and the flood owner page shows all four corner coordinates for every plot. Fix every FAIL and re-run until all pass.
```
