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
| FR-18 | সব ম্যাপ Leaflet দিয়ে |

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
- স্যাটেলাইট বেসম্যাপ: Esri World Imagery (ArcGIS Online REST API, শর্তানুযায়ী উন্মুক্ত ব্যবহার)।
- প্রশাসনিক সীমানা: BBS/ওপেন সোর্স (ডেমোতে সরল করা)।
- মৌজা/দাগ ও মালিকের তথ্য: ডেমোতে কাল্পনিক; বাস্তবে ভূমি মন্ত্রণালয়ের অনুমোদন প্রয়োজন।

## 12. ম্যাপ আর্কিটেকচার ও জিওস্প্যাশিয়াল সংশোধন (Map GIS Implementation Spec)

1. **Dual Leaflet Architecture**:
   - `GisMapCompare.tsx` ও `MapCompare.tsx` ব্যবহার করে যুগপৎ দুটি সমান্তরাল ম্যাপ ইনস্ট্যান্স (Baseline Before ও After/Forecast)।
   - উভয় ম্যাপের মুভমেন্ট ও জুম রিয়েল-টাইমে `isSyncingRef` রি-এন্ট্রান্সি গার্ডের মাধ্যমে সিঙ্ক্রোনাইজড।
   - জুম কন্ট্রোল সরাসরি `map.setView(center, nextZ, { animate: false })` কল করে প্রথম ক্লিকেই তাৎক্ষণিক রেসপন্স প্রদান করে।
2. **স্থানাঙ্ক রূপান্তর ও প্রজেকশন (Coordinate Reference System)**:
   - প্রজেকশন: Web Mercator (`EPSG:3857`)।
   - স্থানাঙ্ক স্বাভাবিকীকরণ: `FloodMap.tsx`-এ GeoJSON `[lon, lat]` এবং Leaflet `[lat, lon]`-এর মধ্যে ইনভার্সন রোধে `toLeafletLatLng` এবং `toGeoJsonLonLat` ফাংশন যুক্ত।
3. **বেসম্যাপ লেয়ারিং ও প্যান স্ট্যাকিং**:
   - `basemap-tiles` (zIndex: 195) প্যানে স্যাটেলাইট বা স্ট্রিট টাইলস লোড হয়।
   - উপরে `plots` (zIndex: 300), `hazard` (zIndex: 350), ও `mouza-labels` (zIndex: 450) ওভারলে অক্ষুণ্ন থাকে।
   - টাইল নেটওয়ার্ক ব্যর্থতায় স্বয়ংক্রিয় Light GIS ফলব্যাক বাটন প্রদর্শিত হয়।
4. **দুর্যোগভিত্তিক আঞ্চলিক বাউন্ডস (Hazard Fallback Bounds)**:
   - River: `[89.62, 24.54, 89.67, 24.59]` (কাজিপুর, সিরাজগঞ্জ)
   - Landslide: `[92.01, 22.54, 92.05, 22.58]` (কাউখালী, রাঙ্গামাটি)
   - Flood: `[91.15, 25.07, 91.21, 25.12]` (তাহিরপুর, সুনামগঞ্জ)
   - Char: `[89.63, 24.56, 89.68, 24.61]` (কাজিপুর চর)
   - Coastal: `[90.68, 22.16, 90.73, 22.21]` (চরফ্যাশন, ভোলা / হাতিয়া)

