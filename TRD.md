# TRD — ভূমিদর্পণ (BhumiDorpon)
**Technical Requirements Document | সংস্করণ 1.1 (Demo)**

---

> **ডেমো সংস্করণের নোট:** ডেমোতে কোনো backend, ডাটাবেস, ML বা বাইরের ডাটা API নেই। নিচের Backend/DB/ML অংশ ভবিষ্যৎ প্রোডাকশন পরিকল্পনা। ডেমোতে API তালিকা `lib/data.ts`-এর টাইপড ফাংশনের কাঠামো হিসেবে কাজ করবে এবং সব ডাটা `/mocks` থেকে আসবে। UI শুধু ইংরেজি। পরিভাষা: ডাটাবেসের `predicted` = UI/কোডের `forecast`।

## 1. প্রযুক্তি স্ট্যাক

| স্তর | প্রযুক্তি | কারণ |
|---|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript | SSR, ফাইল-ভিত্তিক রাউটিং |
| UI | Tailwind CSS + shadcn/ui | মিনিমাল লাইট থিম সহজে বানানো যায় |
| ম্যাপ | **Leaflet** + react-leaflet (React সংস্করণ অনুযায়ী মিল রেখে) | হালকা, GeoJSON ভেক্টর ও SVG হ্যাচ ভালো চলে |
| ম্যাপ তুলনা | দুটি সিঙ্ক করা Leaflet ম্যাপ + CSS clip-path swipe (কাস্টম) | Before/After |
| চার্ট | Recharts (বা ECharts) | ড্যাশবোর্ড ট্রেন্ড/বার/ডোনাট |
| State/Data | TanStack Query, Zustand | ক্যাশ ও ফিল্টার স্টেট |
| Backend API | FastAPI (Python 3.11) | ML ইকোসিস্টেমের সাথে মেলে |
| ডাটাবেস | PostgreSQL 16 + PostGIS | জিওস্প্যাশিয়াল কোয়েরি |
| Cache | Redis (ঐচ্ছিক, ডেমোতে বাদ দেওয়া যায়) | হট কোয়েরি |
| Tile/Raster | TiTiler (COG) বা প্রি-রেন্ডার করা XYZ টাইল | স্যাটেলাইট ইমেজ সার্ভ |
| ML | PyTorch, rasterio, geopandas | সেগমেন্টেশন ও পূর্বাভাস |
| স্যাটেলাইট ডাটা | Sentinel-2 (অপটিক্যাল), Sentinel-1 (SAR), Landsat | Google Earth Engine / Copernicus |
| ডিপ্লয় | Docker Compose (ডেমো); Vercel + Fly.io/VPS | সহজ ডেমো হোস্টিং |

## 2. ডেমো মোড

ডেমোতে একটিই মোড: **mock**। `/mocks`-এর JSON/GeoJSON (একটি seeded জেনারেটর স্ক্রিপ্ট দিয়ে বানানো) থেকে একটি টাইপড ডাটা লেয়ার (`lib/data.ts`) সব ফলাফল ফিল্টার করে দেয়। ড্রপডাউনের তালিকাও ওই ডাটাসেট থেকে আসে, তাই যা বাছা যায় তার ফলাফল বা empty state সবসময় থাকে। Forecast ডাটাও আগে থেকে বানানো mock।

প্রোডাকশনে `lib/data.ts`-এর ফাংশনগুলো FastAPI + PostGIS-এর কলে বদলানো যাবে, UI বদলাতে হবে না।

## 3. ফাংশনাল রিকোয়ারমেন্ট (FR)

| ID | রিকোয়ারমেন্ট |
|---|---|
| FR-01 | হোম ড্যাশবোর্ড সারাদেশের KPI, ট্রেন্ড ও প্রেডিক্টেড ডাটা দেখাবে |
| FR-02 | ৫টি মডিউলের নেভিগেশন ও Option A/B নির্বাচন |
| FR-03 | Cascading selector: জেলা → উপজেলা → নদী/পাহাড়/মৌজা |
| FR-04 | মৌজা পর্যায়ে ম্যাপ তুলনা (আগে বনাম পরে) |
| FR-05 | মালিকভিত্তিক ক্ষতি/বৃদ্ধি টেবিল |
| FR-06 | ক্ষতিপূরণ হিসাব ও অবস্থা (প্রদত্ত/বকেয়া) |
| FR-07 | মালিক অনুসন্ধান ও দাগ কোঅর্ডিনেটের তালিকা (বন্যা) |
| FR-08 | মালিকানাহীন জমির পরিমাণ প্রদর্শন |
| FR-09 | Empty state বার্তা (ডেটা না থাকলে) |
| FR-10 | CSV এক্সপোর্ট ও একক টগল (Decimal/Acre/Hectare); UI শুধু ইংরেজি |
| FR-11 | প্রতিটি Forecast-এ confidence ও disclaimer |
| FR-12 | নির্বাচন (district/upazila/…) URL query-তে থাকবে; যেকোনো বৈধ সমন্বয়ে ফলাফল বা empty state |
| FR-13 | প্রতি দুর্যোগের নিজস্ব ম্যাপ ডিজাইন (নদী, বন্যা, ভূমিধস, চর, উপকূল) |
| FR-14 | সব মালিক টেবিলে Dag No. ও Khatian No. বাধ্যতামূলক |
| FR-15 | Forecast মোডে শুধু Projected compensation; Status/Paid নেই |
| FR-16 | বন্যা: তালিকা → বিস্তারিত → মালিকের নামে ক্লিকে প্রতিটি দাগের **চারটি কোনার কোঅর্ডিনেট** (Corner 1 NW, 2 NE, 3 SE, 4 SW), একটি centroid নয় |
| FR-17 | প্রতিটি দাগ ঠিক চার কোনার বহুভুজ; কখনো clip করা হয় না |
| FR-18 | সব ম্যাপ Leaflet দিয়ে; MapLibre/Mapbox নয় |
| FR-19 | সব ম্যাপে Light-Themed GIS Basemap (MAP_SPEC.md), মৌজার নাম, graticule, স্কেল, north arrow, locator inset, layer panel |
| FR-20 | নদী ভাঙ্গন, চর, উপকূল: মৌজাভিত্তিক ক্ষতি/বৃদ্ধি ব্যাজ, Mouza-wise summary প্যানেল, Water status কার্ড |
| FR-21 | বন্যা: মালিকভিত্তিক রঙ ও Owner legend প্যানেল |
| FR-22 | ভূমিধস: hillshade, elevation tint, কনটুর, spot height, slope ও elevation-change লেয়ার |

## 4. নন-ফাংশনাল রিকোয়ারমেন্ট (NFR)

- **পারফরম্যান্স:** API p95 < 500 ms (seed), পেজ LCP < 3 s।
- **রেসপনসিভ:** ডেস্কটপ প্রথম, ট্যাবলেট ও মোবাইল সমর্থিত।
- **অ্যাক্সেসিবিলিটি:** WCAG AA কনট্রাস্ট, কিবোর্ড নেভিগেশন।
- **নিরাপত্তা:** মালিকের নাম ও ক্ষতিপূরণের তথ্য ডেমোতে কাল্পনিক। প্রোডাকশনে role-based access, অডিট লগ, HTTPS।
- **ডাটা ফ্রেশনেস:** নদী ভাঙ্গন ও চর বছরে একবার; বন্যা ও ভূমিধস ঘটনাভিত্তিক; উপকূলীয় বছরে একবার।
- **ফন্ট:** Inter ও Space Grotesk।

## 5. ML পাইপলাইন

### 5.1 ইনপুট
- Sentinel-2 (NDWI/MNDWI) ও Sentinel-1 (SAR backscatter) বছরভিত্তিক কম্পোজিট।
- DEM (SRTM/ALOS) ও ঢাল (slope), বৃষ্টিপাত (CHIRPS), মাটির ধরন।
- মৌজা ও দাগের জ্যামিতি (cadastral)।

### 5.2 মডেল (প্রস্তাবিত)

| কাজ | মডেল | আউটপুট |
|---|---|---|
| পানি/স্থল সেগমেন্টেশন | U-Net / DeepLabV3+ | বার্ষিক water mask |
| নদীর তীররেখা পরিবর্তন | mask-diff + তীররেখা এক্সট্র্যাকশন | erosion/accretion পলিগন |
| তীররেখা পূর্বাভাস | ConvLSTM বা Temporal U-Net (গত ৫–১০ বছরের ক্রম) | পরবর্তী বছরের water mask + সম্ভাব্যতা |
| ভূমিধস সংবেদনশীলতা | U-Net/Random Forest (ঢাল, বৃষ্টি, NDVI, পূর্ববর্তী ধস) | সম্ভাব্যতা ম্যাপ |
| বন্যা প্লাবন ম্যাপ | SAR থ্রেশহোল্ড/U-Net | flood extent |

### 5.3 পোস্ট-প্রসেসিং
1. পূর্বাভাসিত পলিগনকে মৌজা ও দাগ লেয়ারের সাথে `ST_Intersection` করে দাগভিত্তিক ক্ষতি বের করা।
2. দাগ → মালিক (ownerships) জয়েন করে মালিকভিত্তিক ক্ষতি।
3. ক্ষতিপূরণ হিসাব (নিচে)।

### 5.4 মূল্যায়ন মেট্রিক
IoU, F1 (সেগমেন্টেশন); তীররেখার গড় বিচ্যুতি (মিটার); পূর্বাভাসের জন্য hold-out বছরে তুলনা। ডেমোতে প্রদর্শিত মেট্রিক সৎভাবে "ডেমো ডাটা" লেবেলসহ দেখাতে হবে।

> সততার নোট: নদীর এক বছর আগাম দাগ-পর্যায়ের পূর্বাভাস স্বভাবতই অনিশ্চিত। UI-তে সব পূর্বাভাস "সম্ভাব্য" হিসেবে ও uncertainty-সহ দেখাতে হবে, নিশ্চিত ফলাফল হিসেবে নয়।

## 6. ক্ষতিপূরণ হিসাব (কনফিগারযোগ্য)

```
আনুমানিক ক্ষতিপূরণ = ক্ষতিগ্রস্ত_জমি_শতাংশ × হার[জমির_শ্রেণি][এলাকা] × (১ + কাঠামো_ও_ফসল_গুণক)
```

- `হার` টেবিল `compensation_rates` থেকে আসবে (শ্রেণি: কৃষি, বসতভিটা, পুকুর, বাণিজ্যিক ইত্যাদি)।
- ডেমোতে হার কাল্পনিক। বাস্তবায়নে সরকারি নীতিমালা ও মৌজা মূল্যহার ব্যবহার করতে হবে।
- ক্ষতিপূরণ অবস্থা: `not_applied | pending | approved | paid`।

## 7. API ডিজাইন (সারসংক্ষেপ)

Base: `/api/v1`। সব রেসপন্স JSON/GeoJSON। বিস্তারিত স্কিমা `BACKEND_SCHEMA.md`-তে।

| Method | Path | কাজ |
|---|---|---|
| GET | `/dashboard/summary?mode=current\|predicted&year=` | KPI ও ট্রেন্ড |
| GET | `/geo/districts` | জেলা তালিকা |
| GET | `/geo/districts/{id}/upazilas` | উপজেলা তালিকা |
| GET | `/geo/upazilas/{id}/rivers` | নদী তালিকা |
| GET | `/geo/upazilas/{id}/hills` | পাহাড় তালিকা |
| GET | `/geo/upazilas/{id}/mouzas` | মৌজা তালিকা |
| GET | `/rivers/{id}/mouzas` | নদীতীরের মৌজা |
| GET | `/erosion/mouzas/{id}?mode=current\|predicted&year=` | নদী ভাঙ্গনের ফলাফল |
| GET | `/erosion/mouzas/{id}/owners?mode=` | মালিকভিত্তিক ক্ষতি |
| GET | `/floods?mouza_id=&year=` | বন্যার ঘটনা |
| GET | `/floods/{id}/owners?q=` | বন্যায় ক্ষতিগ্রস্ত মালিক (দাগ ও খতিয়ানসহ), নামে সার্চ |
| GET | `/floods/{id}/owners/{ownerId}/plots` | মালিকের সব দাগ, প্রতিটির **চার কোনার কোঅর্ডিনেট** (corners[4]) |
| GET | `/landslides?hill_id=&mode=` | ভূমিধসের তালিকা |
| GET | `/landslides/{id}?mode=` | বিস্তারিত ও ক্ষতিগ্রস্ত মালিক |
| GET | `/chars?river_id=&mode=` | চরের তালিকা |
| GET | `/chars/{id}?mode=` | বিস্তারিত ও মালিকভিত্তিক পরিবর্তন |
| GET | `/coastal/mouzas?upazila_id=` | উপকূলীয় মৌজা ও মৌজাবিহীন জমির তালিকা |
| GET | `/coastal/{id}?mode=` | বিস্তারিত ও মালিকভিত্তিক পরিবর্তন |
| GET | `/imagery/{asset_id}/tiles/{z}/{x}/{y}` | স্যাটেলাইট টাইল |

সাধারণ query প্যারামিটার: `mode` (`current` = রেকর্ডকৃত, `predicted` = ML), `unit` (`decimal|acre|hectare`), `lang`।

### রেসপন্সের সাধারণ আকার (উদাহরণ)
```json
{
  "mouza": {"id": "m_101", "name_bn": "উদাহরণ মৌজা", "jl_no": "42"},
  "period": {"from": "2025-10-01", "to": "2026-10-01"},
  "maps": {"before_asset": "img_a1", "after_asset": "img_a2", "boundary_geojson": "..."},
  "summary": {"lost_decimal": 842.5, "gained_decimal": 0, "affected_owners": 37},
  "owners": [
    {"owner_name": "কাল্পনিক নাম", "plot_no": "১২৩৪", "khatian_no": "৫৬",
     "lost_decimal": 12.5, "est_compensation_bdt": 250000,
     "compensation_status": "pending", "paid_bdt": 0}
  ],
  "confidence": null
}
```
`predicted` (UI-তে Forecast) মোডে `confidence` (০–১) ও `model_version` থাকবে এবং মালিকের সারিতে `compensation_status`/`paid_bdt` থাকবে না, শুধু `est_compensation_bdt`। প্রতিটি মালিক সারিতে `plot_no` ও `khatian_no` বাধ্যতামূলক।

## 8. ফ্রন্টএন্ড কাঠামো

```
/app
  page.tsx                                   # হোম ড্যাশবোর্ড
  /river-erosion/page.tsx                    # Option A/B নির্বাচন
  /river-erosion/[mode]/page.tsx             # selector + মৌজার তালিকা (?d=&u=&r=)
  /river-erosion/[mode]/[mouzaId]/page.tsx   # বিস্তারিত
  /flood/page.tsx                            # selector + বন্যার তালিকা (?d=&u=&m=&year=)
  /flood/[mouzaId]/[floodId]/page.tsx        # বন্যার বিস্তারিত
  /flood/[mouzaId]/[floodId]/owner/[ownerId]/page.tsx   # মালিকের সব দাগের কোঅর্ডিনেট
  /landslide/[mode]/page.tsx  /landslide/[mode]/[eventId]/page.tsx
  /char/[mode]/page.tsx       /char/[mode]/[resultId]/page.tsx
  /coastal/[mode]/page.tsx    /coastal/[mode]/[resultId]/page.tsx
/components  (ui, charts, selectors, tables, empty-states)
/components/map  (MapCompare + river, flood, landslide, char, coastal স্তর)
/lib         (data.ts, selection.ts, units.ts, format.ts)
/mocks       (জেনারেটেড JSON/GeoJSON)
/scripts     (generate-mocks.ts)
```

mode = `recorded` | `forecast`।

## 9. টেস্টিং

- Unit: Vitest/Jest (ফর্ম্যাটার, একক রূপান্তর, ক্ষতিপূরণ হিসাব)।
- API: pytest + httpx।
- E2E: Playwright, ১০টি মূল ফ্লো ও সব empty state।
- ভিজ্যুয়াল: Storybook/Chromatic (ঐচ্ছিক)।

## 10. রান ও কনফিগারেশন (ডেমো)

```
npm run generate:mocks   # mock ডাটা বানায় (seeded, একই ফলাফল প্রতিবার)
npm run dev
```
কোনো `.env` লাগবে না। ডেমোতে `docker compose`ও লাগবে না।

## 11. ডাটা সোর্স ও লাইসেন্স

- Sentinel-1/2: Copernicus ওপেন ডাটা (ESA নীতিমালা)।
- ম্যাপ বেস: OpenStreetMap (ODbL, অ্যাট্রিবিউশন আবশ্যক)।
- প্রশাসনিক সীমানা: BBS/ওপেন সোর্স (ডেমোতে সরল করা)।
- মৌজা/দাগ ও মালিকের তথ্য: ডেমোতে কাল্পনিক; বাস্তবে ভূমি মন্ত্রণালয়ের অনুমোদন প্রয়োজন।

## 12. Light GIS Basemap ডাটা (ডেমো)

`npm run generate:mocks` এখন নিচের জিনিসও বানাবে (বিস্তারিত MAP_SPEC.md §4, §9, §10):
- প্রতি map area-র জন্য `basemap` (land, landuse, water, waterlines, roads, embankments, buildings, pois, upazila, mouzas, labels)। পাশাপাশি ৪–৭ মৌজা, সীমানা মেলানো।
- প্রতি result-এ মৌজাভিত্তিক `lossDecimal`, `gainDecimal`, `areaDecimal` এবং `context` (Water status / Flood context / Terrain context)।
- ভূমিধস: DEM থেকে `elevation`, `hillshade`, `slope`, `elevation_change` PNG, কনটুর ও spot height GeoJSON।
- বন্যা: প্রতি মালিকে `colorIndex`।
- ইমেজ ও বড় GeoJSON per-area lazy-load হবে; মূল JS-এ ঢোকানো যাবে না।

---

## 13. Map Comparison, Zoom, and Basemap Switching Requirements

This section amends the demo implementation requirements. Preserve the current Next.js App Router, TypeScript, Tailwind/shadcn, Leaflet/react-leaflet, typed data layer, mock-data architecture, and existing component patterns. Do not rebuild the application.

### 13.1 Side-by-side MapCompare
- Update the existing `MapCompare` component rather than replacing the map system.
- Default layout: two map panels in a responsive grid, Before on the left and After on the right. Remove/hide the draggable swipe divider from the primary comparison UI.
- Put map titles and compact map controls within each map panel. Put supporting data panels and tables beneath the complete map pair.
- Initialize both maps with the same bounds and zoom. Synchronize move/zoom events using Leaflet events with loop guards to avoid feedback loops. Clean up listeners on unmount.
- Preserve the existing comparison modes and hazard-specific layer factories only where they do not conflict with this amendment; the side-by-side view is the default. Do not remove existing data or legend information.

### 13.2 Explicit zoom controls
- Add reusable controls such as `MapZoomControls` in the existing map component structure, or extend existing chrome if already present.
- Use Leaflet's actual `zoomIn()` and `zoomOut()` methods through a safe map reference. Buttons must work on first click, support keyboard focus, have accessible names, and remain usable on mobile.
- When maps are synchronized, a zoom from either map updates both. Avoid recursive event loops and stale map references.
- Preserve native Leaflet zoom interactions unless existing product requirements explicitly disable them.

### 13.3 Basemap layer switch
- Add a reusable `MapTypeSwitcher` with **Light GIS** and **Satellite** options. Optionally include **Street** if a compliant provider is available.
- Keep the existing synthetic Light GIS basemap as the no-network fallback and default for demo geometry.
- Implement satellite/street imagery as configurable Leaflet tile layers, not hard-coded provider assumptions. Keep provider URL/configuration in one central module or environment/config file, with no secrets committed.
- Verify provider terms, attribution requirements, zoom limits, and intended deployment use before enabling a source. Do not claim a tile provider is production-safe without verification.
- Use Leaflet layer control or an equivalent controlled switch. Switching the base layer must preserve thematic overlays and the current viewport.
- Tile failures must not crash the page. Keep Light GIS selectable and display a non-blocking fallback notice.
- Because existing mock geometries may not match real-world geography, show a clear demo-geometry disclaimer when real tiles are active unless alignment has been verified from project data.

### 13.4 Data and rendering integrity
- The map-type switch changes only the base layer; it must not alter mock data, hazard layers, owner colours, plot polygons, terrain rasters, selection, or Recorded/Forecast state.
- Keep thematic layers above the base layer using the existing Leaflet panes/z-index conventions in `MAP_SPEC.md`.
- On satellite imagery, adjust polygon outlines, labels, hatches, and selected features for adequate contrast without changing their semantic meanings or documented tokens.
- Preserve lazy loading of large GeoJSON and raster assets; do not put large assets into the main JavaScript bundle.

### 13.5 Verification
Run the project's actual available scripts and report their real results. Add or update tests for:
- Before-left / After-right order and supporting information below the map pair.
- No draggable swipe bar in the default comparison view.
- Zoom buttons invoke Leaflet zoom and synchronize both maps.
- Map-type switching changes only the base layer and preserves viewport, overlays, selection, and mode.
- Attribution and demo-geometry notice are visible in Satellite mode.
- Tile failure falls back safely to Light GIS.
- Responsive layout at 1440px, 1024px, and 390px.
- All five hazards, the owner page, and dashboard preview remain functional.
Never report tests or visual checks as passing unless they were actually run.

## 14. Corrective Technical Requirements — Geographic Context and Immediate Zoom

### 14.1 Hazard-aware satellite rendering
- Do not reuse a single static satellite image or one fixed screenshot for every hazard.
- Use the configured real geographic tile layer, with its viewport driven by the selected hazard/region's existing coordinates or bounding box.
- Reuse the application's existing hazard/region records to determine the map extent. Do not invent coordinates or substitute stock imagery.
- On hazard or region changes, update the map to the selected feature/region bounds with suitable padding and maximum zoom. Do not default to a country-wide extent when a local region is selected.
- Keep Light GIS and Satellite geospatially aligned: same CRS, center, zoom, bounds, and container aspect ratio. Switching basemap must not alter overlays or selected geography.
- For paired Before/After maps, synchronize center, zoom, and bounds. Basemap changes on either map should update the shared basemap preference without resetting the view.
- If mock coordinates are synthetic, preserve the disclaimer and avoid claiming that imagery is geographically matched. Do not manipulate coordinates just to visually line up synthetic polygons with real imagery.
- If the tile provider cannot show the selected geographic area or has no valid configuration, show a non-blocking error and preserve the Light GIS fallback.

### 14.2 Fix the first-click zoom defect
- Inspect the current zoom button handlers and any zoom-tool/activation state.
- The `+` or `−` button must call Leaflet's `zoomIn()` / `zoomOut()` (or equivalent) immediately from the click handler.
- Remove any two-step “activate zoom, then choose zoom” behavior.
- Ensure overlay controls are not intercepted by the map click/drag handlers. Use appropriate event propagation handling on the controls while keeping button clicks functional.
- Confirm both maps zoom on the first click and do not create recursive synchronization events.

---

<!-- addendum:google-earth-and-hazard-store -->
## Addendum — Google Earth Parcel Outline & Five-Hazard Information Store

### A. Google Earth Parcel Outline — Technical Specification
On the Flood Owner Land Detail page, every parcel card now shows an **Open in Google Earth** button directly beneath its Four Corner Coordinates table. One click (1) builds a KML file of the parcel outline in the browser and downloads it, and (2) opens Google Earth (web) centered on the parcel in a new tab. Google Earth cannot load a polygon from a URL, so the outline appears after the user loads the downloaded KML (Earth web: **New → Open local KML file**; Earth Pro: double-click the file). A short on-page hint explains this.

- **Route / file:** `/flood/[mouzaId]/[floodId]/owner/[ownerId]` → `app/flood/[mouzaId]/[floodId]/owner/[ownerId]/page.tsx`.
- **Helper module:** `lib/googleEarth.ts` (pure functions, no DOM except `openParcelInGoogleEarth`): `buildParcelKml`, `parcelRingToKmlCoordinates`, `getParcelCenter`, `getCameraRangeMeters`, `buildEarthCameraUrl`, `buildKmlFileName`, `escapeXml`, `openParcelInGoogleEarth`.
- **Input:** the parcel's existing four corners (`OwnerPlotDetail.corners`, order NW, NE, SE, SW, WGS84, 6 decimals). No new data is stored or fetched.
- **KML:** one `Polygon` (`clampToGround`, closed ring, coordinates written `lon,lat,0`), orange outline with translucent fill, four numbered corner `Placemark`s (`1 (NW)` … `4 (SW)`), and a description (owner, mouza, Dag No., Khatian No., land class, area, flood status, demo-data disclaimer). All text is XML-escaped.
- **Earth URL:** `https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`; `<lat>,<lon>` is the bounding-box center and `<range>` is about three times the larger parcel extent (minimum 20 m extent). Opened with `noopener,noreferrer`.
- **File name:** `<floodId>_dag_<dagNo>_outline.kml`.
- **Event handling:** the button calls `stopPropagation()` so the card is not selected/zoomed; the Earth tab is opened synchronously inside the click handler so pop-up blockers allow it.
- **Limitation (by design):** Google Earth web has no documented URL parameter for loading a KML, so the outline is shown after the user imports the downloaded file. A fully automatic outline would require a hosted KML/KMZ URL plus the Google Earth import flow or the Google Maps Platform Photorealistic 3D Tiles / Maps JavaScript API (future work, needs an API key).
- **No new dependency, backend, database, API key, or network call from the app.**

**Verification:** `tests/google_earth_kml.test.ts` (7 tests) covers coordinate order and ring closure, KML structure, XML escaping, rejection of non-four-corner input, camera URL, file name, and real mock parcels. `npm run lint` and `npm test` (10 files, 61 tests) pass.

### B. Five-Hazard Information Store — Technical Specification
All information for the five hazard categories (river erosion, flood, landslide, char formation/erosion, coastal erosion/land formation) is saved as static, deterministic, mock/synthetic JSON files. There is no backend or database. Each hazard has one flat JSON file, a set of per-area map packages and, for landslides, terrain rasters. The same files are written to `mocks/` (server and tests) and `public/mocks/` (browser), and every read goes through `loadMockJson()` in `lib/data.ts`.

| Store | Location | Content | Read by |
|---|---|---|---|
| Runtime copy (browser) | `public/mocks/*.json`, served at `/mocks/*` | Flat per-hazard files: `river_erosion.json`, `flood.json`, `landslide.json`, `char.json`, `coastal.json`, plus `common.json`, `chars.json`, `hills.json`, `rivers.json`, `districts.json`, `upazilas.json`, `mouzas.json`, `owners.json`, `plots.json`, `summary.json`, `areas_index.json` | `loadMockJson()` in `lib/data.ts` (client `fetch('/mocks/<file>')`) |
| Source copy (Node / tests) | `mocks/*.json` | Same flat files | `loadMockJson()` on the server side (`fs.readFileSync` from `mocks/`) and Vitest |
| Per-area map packages | `mocks/areas/<hazard>/area_*.json` and `public/mocks/areas/<hazard>/area_*.json` | One package per map area: `areaId`, `hazard`, `mode`, `bounds`, `basemap`, `mouzas`, `hazardLayers`, `context`, `owners` (river_erosion 7, flood 6, landslide 6, char 5, coastal 6) | `lib/data.ts` via `areas_index.json` (maps a hazard / mode / mouza key to an `area_*` file) |
| Landslide terrain rasters | `public/mocks/rasters/<area>/`, `public/mocks/hillshades/` | `elevation_before/after.png`, `hillshade_*.png`, `slope_before.png`, `elevation_change.png`, `contours.geojson`, `spot_heights.json` | Landslide map layers |
| Reserved per-mouza hazard results | `mocks/hazards/<hazard>.json`, `mocks/common/*.json` | Larger per-mouza keyed result sets and a copy of the shared reference tables | Present in `mocks/` only; **not read by the current runtime loader** |
| Generator | `scripts/generate-mocks.ts`, `scripts/generate-map-areas.ts` | Deterministic, seeded generation; writes to both `mocks/` and `public/mocks/` | `npm run generate:mocks` |

**Rules:** (1) the browser reads only `public/mocks/` through `fetch('/mocks/<file>')`; (2) Node and Vitest read `mocks/`; (3) both folders are written together by the generator, so they must not be edited by hand independently; (4) results are cached in module-level variables after the first read.

