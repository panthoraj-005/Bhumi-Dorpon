# Antigravity Frontend Prompts v2: BhumiDorpon (English UI, Demo Data Only)

## ব্যবহারের নিয়ম

1. Antigravity-তে নতুন প্রজেক্ট খুলুন। সব `.md` ফাইল (`PRD.md`, `TRD.md`, `APP_FLOW.md`, `BACKEND_SCHEMA.md`, `ARCHITECTURE.md`, `DESIGN.md`) প্রজেক্টের `/docs` ফোল্ডারে রাখুন।
2. আপনার রেফারেন্স ড্যাশবোর্ড ছবি এজেন্টের চ্যাটে সংযুক্ত করুন (শুধু Prompt 1-এ লাগবে)।
3. **Prompt 1 থেকে Prompt 6 পর্যন্ত একে একে দিন।** একটা শেষ হয়ে ব্রাউজারে দেখে ঠিক মনে হলে পরেরটা দিন। সব একসাথে দেবেন না।
4. পুরোনো প্রজেক্ট থেকে ঠিক করতে চাইলে নতুন প্রজেক্টে শুরু করাই ভালো, কারণ সমস্যাগুলো ডাটা কাঠামো আর সিলেক্টর স্টেটের গোড়ার ব্যাপার।

**আগের সমস্যাগুলো কীভাবে সমাধান হচ্ছে:**
| সমস্যা | সমাধান |
|---|---|
| ড্রপডাউন মাঝে মাঝে কাজ করে না, নিজের ইচ্ছেমতো বাছলে ফলাফল আসে না | Prompt 1: URL-ভিত্তিক controlled সিলেক্টর। Prompt 2: ড্রপডাউনের অপশন ও ফলাফল একই রিলেশনাল ডাটাসেট থেকে আসে, প্রচুর কভারেজ। Prompt 6: প্রতিটি সমন্বয় স্বয়ংক্রিয় টেস্টে যাচাই |
| Forecast-এ শুধু আনুমানিক ক্ষতিপূরণ | Rule 5 ও OwnerTable `variant` |
| বন্যা: তালিকা, তারপর মালিকের নামে ক্লিকে সব জমির কোঅর্ডিনেট | Prompt 5 |
| প্রতি দুর্যোগের নিজস্ব ম্যাপ, দেখতে ভালো | Prompt 4 ও 5 |
| ডাইনামিক ওয়েবসাইট | Rule 3 |
| সব দুর্যোগে দাগ ও খতিয়ান নম্বর | Rule 4 |

---

## Prompt 1: Rules, Setup, Design System, App Shell, Selector

```
You are a senior frontend engineer and product designer. Build a DEMO web app called "BhumiDorpon": a Bangladesh land-change records dashboard covering five hazards: River Erosion, Flood, Landslide, Char (river island) Formation & Erosion, and Coastal Erosion & Land Accretion.

STEP 0. SAVE THE RULES
Create /docs/BUILD_RULES.md containing the rules below VERBATIM. Re-read it at the start of every later task. If anything in /docs/PRD.md, TRD.md, APP_FLOW.md, DESIGN.md or BACKEND_SCHEMA.md conflicts with these rules, THESE RULES WIN. Those docs are partly in Bengali and partly describe a future backend, which you must ignore.

RULES
1. ENGLISH ONLY. Every label, button, message and tooltip is English. No Bengali text, no language toggle, no i18n library.
2. DEMO DATA ONLY. No backend, no database, no ML, no external data API. All data, including "Forecast" data, is pre-generated static mock data in /mocks, read through one typed data layer (/lib/data.ts) with a 200-400ms artificial delay so skeletons are visible. Mode is "recorded" | "forecast".
3. FULLY DYNAMIC. Every dropdown choice must really filter the mock dataset and drive what is shown. Nothing is hardcoded per screen. Dropdown options are derived from the dataset (never hand-typed lists). A valid selection never shows a blank screen: it shows either results or the specific empty state from /docs/APP_FLOW.md section 5.
4. DAG NO. AND KHATIAN NO. EVERYWHERE. Every table that lists affected owners, in every hazard and mode, has columns "Dag No." and "Khatian No.".
5. FORECAST VIEWS SHOW ONLY ESTIMATED COMPENSATION. Recorded views: Est. compensation, Status (Paid / Approved / Pending / Not applied) and Paid (৳). Forecast views: only "Projected compensation" (and projected area). No Status, no Paid, no paid/not-paid wording anywhere in forecast views, including the dashboard.
6. EACH HAZARD HAS ITS OWN MAP DESIGN. River erosion, flood, landslide, char and coastal each get their own map component, layers, styling and legend. Never reuse one generic before/after map for all hazards.
7. Every page shows a thin banner: "Demo data: all names, plots and figures are fictional." Every forecast view shows a "Forecast" badge and the note "This is a model-based estimate, not an official government record."
8. Never say a task is done without verifying it in the running app in the browser. Take screenshots of what you built and check them against the requirements.

DESIGN DIRECTION (MINIMALISTIC LIGHT MODE ONLY)
The attached image is a LAYOUT reference only: left icon sidebar, rounded card grid, big KPI numbers, line chart with dark tooltip pill, bar chart, ranked list with chevrons, lime pill button, right-hand stats panel. Do NOT copy its dark theme.
- Background #F6F7F2, cards #FFFFFF with 1px #E4E7DC border, radius 20px, almost no shadow.
- Ink #14170F, secondary #4A5043, muted #7B8274.
- One accent: lime #C8F23A (primary buttons, active nav). Text on lime is #14170F. For lime-green text or thin lines on white use #4D7A0A.
- Data colors: loss #E4604A, gain #2F9E62, forecast #6A5BD6 (dashed strokes or hatching plus the "Forecast" badge), water #2F7FB8.
- Fonts via next/font: Inter (body, numbers, tabular-nums) and Space Grotesk (page titles). Currency "৳1,25,000" using Intl.NumberFormat("en-BD") with English digits.
- Put tokens in globals.css as CSS variables and map them in tailwind.config.

STACK
Next.js 14+ (App Router), TypeScript, Tailwind, shadcn/ui, lucide-react, Recharts, Leaflet (react-leaflet), TanStack Query, Zustand (only for UI-only state; selection state lives in the URL).

TASKS FOR THIS PROMPT
1. Scaffold the project: /app, /components, /components/map, /lib, /mocks, /scripts, /stores.
2. Tokens and shadcn theme overrides.
3. App shell: 72px icon-only sidebar (Home, River Erosion, Flood, Landslide, Char, Coastal, Settings) with tooltips and lime-soft active state; top bar with large page title, period filter ("Last 1 year") and unit toggle (Decimal | Acre | Hectare; 1 decimal = 40.4686 m2, 100 decimal = 1 acre, 1 acre = 0.404686 ha); the demo banner.
4. SelectorChain, built to be RELIABLE:
   - A controlled combobox (shadcn Popover + Command/cmdk, searchable). Note cmdk lowercases item values, so select by item ID through a closure, never by comparing labels.
   - Selection state lives in the URL query string (?d=&u=&r=&h=&m=&year=) through one hook (useSelection). The URL is the single source of truth; components read from it. Refresh, back button and shared links must restore the exact state.
   - Step n is enabled as soon as step n-1 has a value; it can never get stuck disabled. Changing a step clears only later steps.
   - Options come from getOptions(hazard, mode, step, selectionSoFar) in the data layer, so they list only valid children (only rivers of that upazila, only mouzas of that river, etc.).
   - A small "●" marks options that have records for the current hazard and mode.
   - When the last step is set, results load via TanStack Query with the full selection in the query key; show a skeleton, then results or the correct empty state. Wrap in an error boundary with a "Try again" button.
5. Other reusable components with a demo page at /dev/components: StatCard, SegmentedToggle, EmptyState (64px icon, message, helper line, "Choose another area" button), ForecastBadge, ConfidenceBadge, StatusBadge, OwnerTable (props: variant = "recorded" | "forecast" | "flood"; search, sort, CSV export; columns per rule 4 and 5; unowned-land row style), TrendChart, BarChart, RankedList.

Do not build module pages yet. Run the app, check /dev/components in the browser with screenshots, and summarise.
```

---

## Prompt 2: Data Model, Mock Data Generator, Data Layer

```
Re-read /docs/BUILD_RULES.md. This step creates the dataset that makes the whole site dynamic. It is the most important step: do it carefully.

GOAL
A deterministic generator script (/scripts/generate-mocks.ts, seeded RNG, `npm run generate:mocks`) that writes relational JSON/GeoJSON into /public/mocks (lazy-loaded per hazard; do not bundle everything into the main JS). /lib/data.ts reads it and exposes typed, async functions. Every dropdown and every result in the app comes from here.

TYPES (put in /lib/types.ts)
Hazard = "river-erosion" | "flood" | "landslide" | "char" | "coastal"; Mode = "recorded" | "forecast".
District {id, name, isCoastal, isHilly, centre}; Upazila {id, districtId, name, centre}; River {id, name, upazilaIds}; Hill {id, upazilaId, name}; Mouza {id, upazilaId, name, jlNo, riverIds, kind: "registered" | "unassigned"}; Owner {id, name, fatherName}; Plot {id, mouzaId, dagNo, khatianNo, landClass, areaDecimal, ownerId | null, polygon}; PlotImpact {plotId, kind: "loss" | "gain", areaDecimal, estCompensationBdt, status?, paidBdt?} (status and paidBdt exist ONLY on recorded results); HazardResult {id, hazard, mode, upazilaId, mouzaId?, riverId?, hillId?, label, period, totals {lossDecimal, gainDecimal, unownedDecimal}, trend, confidence? (forecast only), metrics (hazard specific), geometry (hazard specific layers, see below), impacts: PlotImpact[]}. FloodEvent {id, mouzaId, date, year, severity, floodedAreaDecimal, maxDepthM, durationDays, geometry, plotStatus: [{plotId, floodedDecimal, maxDepthM, depthClass}]}.

COVERAGE (use REAL district, upazila and river names; mouza names, Dag/Khatian numbers and owners are FICTIONAL; owner names are invented English transliterations like "Abdul Karim", "Rahima Begum", "Md. Shafiqul Islam")
- River erosion + Char: Sirajganj (Kazipur, Sirajganj Sadar, Belkuchi; Jamuna), Kurigram (Chilmari, Rowmari, Ulipur; Brahmaputra), Shariatpur (Naria, Zajira, Bhedarganj; Padma), Chandpur (Haimchar, Chandpur Sadar, Matlab Dakshin; Meghna), Bhola (Char Fasson, Bhola Sadar; Meghna).
- Flood: Sunamganj (Sunamganj Sadar, Derai, Tahirpur, Jamalganj), Sylhet (Companiganj, Gowainghat, Beanibazar), Kurigram (Ulipur, Chilmari), Sirajganj (Kazipur, Belkuchi).
- Landslide: Rangamati (Rangamati Sadar, Kawkhali, Baghaichhari), Bandarban (Bandarban Sadar, Lama, Rowangchhari), Cox's Bazar (Cox's Bazar Sadar, Teknaf, Ukhia).
- Coastal: Bhola (Char Fasson, Monpura), Noakhali (Hatiya, Subarnachar), Khulna (Koyra, Dacope), Cox's Bazar (Maheshkhali, Teknaf).
- Every hazard's selector lists ALL these districts (so users can also reach empty states), but at least 70% of the district/upazila combinations a user can pick for a hazard must have results. In each hazard and mode, leave 2-3 upazilas deliberately WITHOUT events to exercise the empty states.
- Per upazila with data: at least 2 rivers (or hills), at least 3 mouzas. Per mouza: 25-45 plots, 15-40 owners (some owners hold several plots), mixed land classes, compensation statuses mixed across Paid / Approved / Pending / Not applied.
- Events: each riverside mouza gets one recorded and one forecast river-erosion result; each flood mouza gets 1-3 floods on different dates/years (2022-2025); each hill gets 1-3 recorded landslides and 1-2 forecast zones; each river reach gets 1-3 chars with both modes; coastal mouzas (including 2-3 "Unassigned new land" virtual mouzas per upazila) get both modes.
- Compensation = affected decimals x rate per land class (fictional rates, agri < homestead < commercial). Forecast impacts have estCompensationBdt only.

GEOMETRY (real-world lon/lat near each upazila centre; use turf.js for clipping/intersections; all of it synthetic but shaped realistically). Plots are irregular jittered quadrilaterals tiling the mouza land area (with Dag No. and Khatian No.), and plot impacts must come from real intersections of plot polygons with the hazard polygons, so numbers on screen match the map.
- River erosion: mouza polygon about 1.5 km x 1 km; meandering river centerline (sum of sines plus seeded noise); bank line BEFORE; bank line AFTER retreated 20-120 m (more on outer bends); loss polygon = the strip between them; 3 transect lines with retreat distances. Forecast: next-year bank line retreating further plus an uncertainty band polygon.
- Char: braided channel with 1-3 island polygons; year-1 shape, current shape, accretion polygons (upstream/downstream tips) and erosion polygons (one side); some accreted land intersects no plot, which becomes "Unowned land". Forecast: next-year shape.
- Coastal: coastline with bays; shoreline BEFORE and AFTER; accretion strip seaward (gain), erosion strip landward (loss); tidal flat polygon; sea depth bands (shallow/deep); embankment line; mangrove patch; new land with no mouza = unassigned.
- Flood: floodplain mouza with river, canals and beels (normal water bodies, "before"); inundation extent for each flood as three nested depth polygons (shallow < 0.5 m, moderate 0.5-1.5 m, deep > 1.5 m), covering 30-85% of the mouza; per-plot flooded decimals and depth class from intersections.
- Landslide: synthetic DEM from a few Gaussian hills; contour lines (turf isolines) at a fixed interval; a hillshade PNG rendered from the DEM into /public/mocks (pngjs or sharp); scar polygon (elongated teardrop along steepest descent), debris runout polygon below it, a stream and a road. Forecast: susceptibility zones (Moderate/High/Very high) plus a predicted scar outline; owners' plots overlapping the zone.

DATA LAYER (/lib/data.ts), all async with the artificial delay
getDashboardSummary(mode), getOptions(hazard, mode, step, selectionSoFar), listResults(hazard, mode, selection), getResult(hazard, mode, id), listFloods(selection), getFlood(id), getFloodOwners(floodId, q?), getOwnerPlots(floodId, ownerId) (returns each plot with dagNo, khatianNo, landClass, areaDecimal, centroid [lat, lon], boundary coordinates, flood status).
Dashboard numbers MUST be aggregated from the same dataset so they match the module pages.

SANITY CHECKS (write them as a Vitest suite and run it)
- Every option returned by getOptions leads to a non-error result in listResults (results or an explicit empty list).
- Forecast results never contain status or paidBdt.
- Every impacted plot has dagNo and khatianNo.
- Sum of plot impacts + unowned equals the hazard polygon area within 1%.
- Dataset is deterministic: running the generator twice gives identical output.

Report the dataset size and the coverage numbers (districts, upazilas, mouzas, plots, owners, events per hazard and mode).
```

---

## Prompt 3: Home Dashboard and Module Landing Pages

```
Re-read /docs/BUILD_RULES.md. Build the home dashboard and module landing pages using the data layer only. Follow /docs/DESIGN.md section 6 and the layout of the attached reference image.

HOME (/)
- SegmentedToggle "Recorded | Forecast". Forecast switches all charts to dashed lines, shows the ForecastBadge and loads forecast data.
- Row 1: trend card (label "Total land affected", big number, loss vs gain by year line chart, dark tooltip pill on hover) spanning 8 columns; compensation card (4 columns).
  - Recorded: "Estimated compensation" total + three progress bars Paid / Approved / Pending.
  - Forecast: ONLY "Projected compensation" total. No progress bars, no paid or status wording (rule 5).
- Row 2: "Land affected by hazard" bar chart (4 columns); "Top affected districts" numbered ranked list with small bars and chevrons (8 columns). Clicking a district navigates to the most relevant module with that district preselected in the URL.
- Right column (>= 1280px): "Affected owners" panel with big number, sparkline, district percentage bars; below it a small map preview card of the most affected area (draw it with the real hazard map component later; for now a static preview).
- Bottom: five module cards (icon, name, "Last updated", update cycle such as "Updated yearly", one key number from the dataset, lime "Explore" button).
- Numbers respect the unit toggle. Everything is computed from the dataset.

MODULE LANDING (/river-erosion, /landslide, /char, /coastal)
- Short description, last update, update cycle.
- Two option cards: "A. Recorded Data" and "B. Deep Learning Forecast" (card B carries the ForecastBadge and "Model-based estimate (demo)").
- /flood has no A/B; it goes straight to the selector.

Responsive: >= 1280 full layout; 768-1279 right column moves below; < 768 single column with a bottom tab bar. Respect prefers-reduced-motion; text contrast >= 4.5:1. Verify at 1440, 1024 and 390 px with screenshots and fix problems before finishing.
```

---

## Prompt 4: Selector Pages, Result Pages and Hazard Maps for River Erosion, Char, Coastal

```
Re-read /docs/BUILD_RULES.md and /docs/APP_FLOW.md. Implement the selector + result list + result detail flows for River Erosion, Char and Coastal in both modes (recorded and forecast), plus their MAPS.

SELECTOR + LIST (one page per module and mode, using SelectorChain from Prompt 1)
- River Erosion: District > Upazila > River, then the list of riverside mouzas.
- Char: District > Upazila > River, then the list of chars ("No char exists here." if none).
- Coastal: District > Upazila, then the list of mouzas including "Unassigned new land" entries.
Test as you build: pick every district and upazila at random in the browser; each one must show results or the right empty state. If anything shows a blank area, fix it before moving on.

RESULT DETAIL (top to bottom): summary strip; the hazard's own map; info cards (percentage change, average yearly rate, trend, confidence in forecast); OwnerTable (variant "recorded" or "forecast" per rule 4 and 5, with Dag No. and Khatian No.); for Char and Coastal a separate "Unowned land" card. Forecast pages end with the disclaimer.

MAP INFRASTRUCTURE (/components/map)
- MapCompare: two synchronised Leaflet maps ("Before" left, "After" or "Forecast" right) with a draggable swipe divider (also arrow-key accessible) and a view switch: Swipe | Side by side | Toggle.
- No external tiles. Render a custom cartographic style from the mock GeoJSON: land #EEF0E6, water #BFD9EC with a #2F7FB8 outline, plots with a light grey outline, mouza boundary dark grey. Dag numbers at zoom >= 15 (use HTML markers so labels never depend on a glyph server).
- Controls: zoom, fit to area, scale bar, north arrow, legend, layer toggles, opacity slider.
- Hover plot tooltip (Dag No., Khatian No., Owner, affected area). Click a plot to highlight its table row; click a table row to zoom the map to that plot.
- Create hatch patterns with canvas (map.addImage) for loss (coral), unowned land (grey) and forecast (purple, dashed outlines).
- Card with 20px radius, height 480-560px, a small "Synthetic demo geometry" note. Fit bounds on load with padding; smooth fly on selection.

THREE DIFFERENT MAP COMPONENTS (separate files, separate layer and style config, separate legends)
1. RiverErosionMap: BEFORE = river with last year's bank line (dark blue). AFTER = current bank line and the lost strip as coral hatch, with three transect labels such as "42 m". Forecast = dashed purple projected bank line plus an uncertainty band.
2. CharMap: BEFORE = last year's island shapes in sand colour #EADFC0. AFTER = current shapes with accretion in green and erosion in coral, last year's outline as a dashed line, unowned (khas) land as grey hatch. Forecast = next-year shape dashed.
3. CoastalMap: BEFORE = shoreline as a dashed line, sea shaded by depth bands, tidal flats, embankment (dark dashed line), mangrove patch. AFTER = current shoreline, new land seaward in green, erosion landward in coral, unassigned land labelled "No mouza". Forecast = next-year shoreline dashed.
The three maps must look clearly different from each other, not recolours of one map. Open each in the browser, screenshot all three in both modes, and check they are good looking: clean legend, readable labels, no overlapping clutter, sensible zoom.

Verify both modes of all three modules end to end, including empty states, the unit toggle, and that forecast pages have no Status or Paid anywhere.
```

---

## Prompt 5: Flood (with Owner Land Page) and Landslide

```
Re-read /docs/BUILD_RULES.md and /docs/APP_FLOW.md (sections S2, S3, S4, S5). Implement Flood and Landslide, each with its own map.

FLOOD (single path, no A/B)
1. Selector: District > Upazila > Mouza (+ optional Year chips). Then the FLOOD LIST: one card per flood with Date, Severity chip (Moderate / Severe / Extreme), Flooded area, Max depth, Duration, Affected owners. No flood: "No flood has occurred here."
2. Click a flood to open /flood/[mouzaId]/[floodId]:
   - Summary strip: date, severity, flooded area, % of mouza, max depth, duration.
   - FloodMap (own component): BEFORE = normal water bodies (river, canals, beels). AFTER = inundation in three depth bands (Shallow / Moderate / Deep from light to dark blue) over the mouza, with plots shaded by flooded fraction (none, partial, full); depth legend; plot hover tooltip.
   - Affected owners table with search: Owner name (a link), Dag No., Khatian No., Flooded area, Depth class. One row per owner-plot. Search miss: "No owner found with this name."
3. Click an OWNER NAME to open /flood/[mouzaId]/[floodId]/owner/[ownerId] (Owner Land Page):
   - Header: owner name, father's name (fictional), summary (number of plots, total area, total flooded), "Back to flood" link.
   - Map: only this owner's plots highlighted with numbered markers, all other plots dimmed.
   - Table of ALL this owner's plots in the mouza: Dag No., Khatian No., Land class, Area, Centroid (lat, lon with 6 decimals), Flood status (Not flooded / Partial / Full + depth). Expanding a row lists the boundary corner coordinates. Row click zooms the map to that plot.
   - Buttons: "Copy coordinates" and "Download GeoJSON".

LANDSLIDE (A. Recorded and B. Forecast)
1. Selector: District > Upazila > Hill, then the list of landslide events (recorded: date, soil volume, affected area; forecast: predicted zone with probability). Empty: "No landslide has occurred here." / "No landslide is predicted here."
2. Detail page: summary strip; LandslideMap (own component): hillshade image plus contour lines with labels, stream and road. BEFORE = intact vegetated slope. AFTER = scar polygon (earth-brown coral) and debris runout (hatched), downslope arrow. FORECAST = susceptibility zones (Moderate / High / Very high) with a dashed predicted scar outline. Info cards: soil volume (m3), scar area, slope angle, trigger rainfall (recorded); probability and projected soil volume (forecast).
3. OwnerTable with Dag No. and Khatian No. (recorded variant with Status and Paid; forecast variant with Projected compensation only).

Use the shared MapCompare infrastructure from Prompt 4 but FloodMap and LandslideMap must have their own layers, styles and legends, visually distinct from the three maps from Prompt 4.

Verify in the browser with screenshots: a flood with its owner page, a landslide in both modes, every empty state, and random district and upazila picks in both modules (no blank screens).
```

---

## Prompt 6: Tests, Polish, Final Audit

```
Re-read /docs/BUILD_RULES.md. Final pass.

1. DYNAMIC-ALL-COMBINATIONS TEST (Playwright). Read the dataset and, for EVERY hazard, mode and every district/upazila/river/hill/mouza combination offered by the dropdowns, open the page through the real UI (or the equivalent URL), and assert that it shows either a results list or the exact empty-state message, never a blank panel and never a console error. Also open every result detail page and (for floods) every owner page. Fix every failure.
2. Rule checks (automated where possible): no Bengali characters in rendered text; no language toggle; no network request for data to any outside host; every owner table has "Dag No." and "Khatian No." headers; no "Paid" or "Status" text in any forecast view or in the dashboard Forecast tab; banner on every page; forecast disclaimer on every forecast page.
3. Map review: screenshot all five hazard maps in recorded and forecast modes at 1440 and 390 px width. Fix label clutter, wrong legends, unreadable colours, bad initial zoom. Confirm the five maps are visibly different designs.
4. Selector robustness: test refresh, browser back/forward, a pasted deep link, switching A/B while keeping the selection, changing district after picking everything, keyboard-only use. Fix every issue.
5. Accessibility: visible focus ring, keyboard access to the swipe divider (arrow keys), aria labels, a text summary and data-table alternative for each chart and map, colour is never the only indicator.
6. Performance: lazy-load Leaflet, Recharts and per-hazard mock JSON; LCP under 3s.
7. Unit tests: unit conversion, compensation calculation, the dataset sanity checks from Prompt 2.
8. README: how to run (`npm run generate:mocks`, `npm run dev`, `npm test`), architecture of the mock data layer, and a clear note that all data is fictional and the app has no backend.

Run lint, type-check and all tests. Walk through every module once more in the browser. Finish with a short summary and a list of known gaps. Do not claim anything works unless you ran it.
```

---

## ঐচ্ছিক: দ্রুত ফিক্স প্রম্পট

```
Compare the current UI to /docs/DESIGN.md and the reference layout. List the 10 biggest visual or layout deviations (spacing, colours, typography, card structure), then fix them. Keep light mode only.
```

```
Some dropdown combinations show no result or a blank area. Write a script that tries every combination offered by the dropdowns for every hazard and mode, lists each one that does not show results or the correct empty state, then fix the root causes (data coverage, state handling or query keys), not the symptoms.
```

```
The map for <hazard> looks plain or cluttered. Improve it: clearer legend, better label placement, better colours and hatching, smoother initial framing. Keep it visibly different from the other four hazard maps.
```
