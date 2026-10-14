# Technical Requirements Document (TRD) — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Hazard Dashboard**

---

> **Document Status:** Authoritative Technical Specification  
> **System Version:** 1.1 (Demonstration Release)  
> **Target Runtime:** Node.js 18+ / 20+ | Modern Web Browsers  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/main-project-documentation.md) | [PRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/prd.md) | [System Architecture](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/system-architecture.md) | [UI/UX Design System](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/ui-ux-design-system.md)

---

## 1. Technology Stack and Verified Versions

The technology stack is verified directly against [`package.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/package.json) and project configuration files:

| Layer / Subsystem | Package / Technology | Verified Version | Purpose & Rationale |
|---|---|---|---|
| **Core Framework** | Next.js | `^14.2.15` | App Router architecture, static generation, file-based routing, and React Server/Client Component model. |
| **Runtime Language** | TypeScript | `^5.6.2` | Static type safety, strict interface definition, and robust compile-time contract enforcement. |
| **UI Library** | React & React DOM | `^18.3.1` | Component-based interactive UI rendering. |
| **CSS & Design System** | Tailwind CSS | `^3.4.13` | Utility-first styling framework integrated with custom design tokens in `globals.css`. |
| **PostCSS Processor** | PostCSS / Autoprefixer | `^8.4.47` / `^10.4.20` | CSS preprocessing and automated vendor prefixing. |
| **Class Utilities** | clsx & tailwind-merge | `^2.1.1` / `^2.5.3` | Conflict-free conditional class concatenation. |
| **Component Primitives**| Radix UI Primitives | Dialog (`^1.1.2`), Dropdown (`^2.1.2`), Popover (`^1.2.0`), Slider (`^1.2.1`), Tabs (`^1.1.1`), Tooltip (`^1.1.3`) | Unstyled, fully accessible WAI-ARIA compliant interactive primitives. |
| **Command Palette** | cmdk | `^1.1.1` | Fast, keyboard-accessible command menu. |
| **Iconography** | Lucide React | `^0.447.0` | Consistent, lightweight SVG iconography. |
| **Mapping Engine** | Leaflet & react-leaflet | `^1.9.4` / `^4.2.1` | Lightweight, mobile-friendly interactive mapping, vector polygon rendering, and SVG pattern injection. |
| **Spatial Analysis** | Turf.js (`@turf/turf`) | `^7.4.0` | Client-side geospatial polygon intersections, area calculations, and boundary bounding box calculations. |
| **Data Visualization** | Recharts | `^2.12.7` | Declarative SVG charting for multi-year trends, distributions, and KPI metrics. |
| **Client State** | Zustand | `^4.5.5` | Lightweight global state store for active units, selections, and layer visibility. |
| **Data Fetching/Cache** | TanStack React Query | `^5.59.0` | Asynchronous query management, caching, and state synchronization with simulated network latency. |
| **Unit Testing** | Vitest | `^4.1.11` | High-speed unit testing for formatters, unit conversions, and mock data logic (54 tests passing). |
| **E2E Testing** | Playwright | Configured (`e2e/`) | End-to-end browser verification of map viewports, cascades, and corner coordinates. |

---

## 2. Framework and Programming Languages

- **Programming Language:** TypeScript 5.6.2 configured in strict mode (`"strict": true` in [`tsconfig.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tsconfig.json)).
- **Module Resolution:** Bundler mode (`"moduleResolution": "bundler"`) with ES2020 target and custom path aliases (`@/*` pointing to project root).
- **Framework Strategy:** Next.js 14 App Router. Client components use the `"use client"` directive to enable Leaflet browser-side DOM rendering and React hooks.

---

## 3. Project Structure

The project conforms to the following verified directory layout:

```text
BhumiDorpon/
├── app/                                 # Next.js App Router route segments
│   ├── layout.tsx                       # Root HTML/body shell and QueryProvider wrapper
│   ├── page.tsx                         # National Summary Dashboard
│   ├── globals.css                      # Design tokens, CSS variables, and Leaflet overrides
│   ├── river-erosion/                   # River erosion hazard routes
│   │   ├── page.tsx                     # Top-level selector / mode dispatcher
│   │   └── [mode]/                      # Mode-specific route (`recorded` | `forecast`)
│   │       ├── page.tsx                 # Selector view and mouza results list
│   │       └── [mouzaId]/page.tsx       # Detailed side-by-side mouza map view
│   ├── flood/                           # Flood monitoring hazard routes
│   │   ├── page.tsx                     # Flood archive event list
│   │   └── [mouzaId]/[floodId]/         # Detailed flood inundation map view
│   │       ├── page.tsx                 # Flood map and parcel submersion table
│   │       └── owner/[ownerId]/page.tsx # Owner land page with 4-corner GPS coordinates
│   ├── landslide/                       # Landslide hazard routes
│   │   └── [mode]/                      # Recorded / Forecast routes
│   │       ├── page.tsx                 # Hill selector and event list
│   │       └── [eventId]/page.tsx       # Detailed DEM hillshade and debris map view
│   ├── char/                            # Char island hazard routes
│   │   └── [mode]/                      # Recorded / Forecast routes
│   │       ├── page.tsx                 # River & char island selector
│   │       └── [resultId]/page.tsx      # Detailed accretion/erosion map view
│   ├── coastal/                         # Coastal shoreline hazard routes
│   │   └── [mode]/                      # Recorded / Forecast routes
│   │       ├── page.tsx                 # Coastal mouza selector
│   │       └── [resultId]/page.tsx      # Detailed coastal retreat map view
│   ├── settings/                        # Platform settings hub
│   │   ├── page.tsx                     # Settings menu (About & Team)
│   │   ├── about/page.tsx               # About Project details
│   │   └── team/page.tsx                # Team Information and copyright
│   └── dev/                             # Developer showcase routes
│       └── components/page.tsx          # Component library testing harness
├── components/                          # Shared UI and visualization components
│   ├── AppHeader.tsx                    # Top application header with title and unit toggle
│   ├── AppSidebar.tsx                   # Fixed 72px left-hand icon navigation bar
│   ├── DemoBanner.tsx                   # Sticky mock data disclaimer banner
│   ├── EmptyState.tsx                   # Standardized zero-result empty state component
│   ├── ErrorState.tsx                   # Non-blocking error and retry component
│   ├── StatCard.tsx                     # Summary KPI statistic card
│   ├── TrendChart.tsx                   # Multi-year historical land-change line chart
│   ├── BarChart.tsx                     # Hazard breakdown distribution bar chart
│   ├── RankedList.tsx                   # Top-impacted district ranking widget
│   ├── OwnerTable.tsx                   # Searchable, sortable affected landowner table
│   ├── SelectorChain.tsx                # Dynamic cascading dropdown selector
│   ├── SegmentedToggle.tsx              # Pill-style toggle control
│   └── map/                             # Cartographic mapping subsystem
│       ├── GisMapCompare.tsx            # Authoritative synchronized side-by-side map engine
│       ├── RiverErosionMap.tsx          # River erosion specific map layer wrapper
│       ├── FloodMap.tsx                 # Multi-depth flood inundation map wrapper
│       ├── LandslideMap.tsx             # Landslide DEM and contour map wrapper
│       ├── CharMap.tsx                  # Char island accretion map wrapper
│       ├── CoastalMap.tsx               # Coastal shoreline map wrapper
│       ├── OwnerPlotsLeafletMap.tsx     # Single-owner parcel boundary map with 1–4 markers
│       ├── basemap/                     # Basemap layer factories and pane setup
│       ├── chrome/                      # Map controls (zoom, basemap selector, scale, graticule)
│       ├── labels/                      # Dynamic mouza and JL number label layer
│       └── panels/                      # Context cards (Water status, Mouza summary, Terrain)
├── lib/                                 # Core utility and business logic modules
│   ├── basemapConfig.ts                 # Central basemap provider definitions and URLs
│   ├── data.ts                          # Typed mock data layer with simulated latency
│   ├── types.ts                         # Complete TypeScript domain type definitions
│   ├── units.ts                         # Land area and currency conversion utilities
│   ├── useSelection.ts                  # Cascading dropdown selection hook
│   └── utils.ts                         # General helper routines (cn class merger)
├── mocks/                               # Deterministic relational mock JSON datasets
│   ├── summary.json                     # National dashboard aggregate records
│   ├── districts.json                   # Bangladesh administrative districts
│   ├── upazilas.json                    # Upazila administrative boundaries
│   ├── mouzas.json                      # Cadastral mouza units with JL numbers
│   ├── river_erosion.json               # Riverbank migration and transect records
│   ├── flood.json                       # Multi-depth flood inundation events and geometry
│   ├── landslide.json                   # Landslide events, scars, and synthetic DEMs
│   ├── char.json                        # Char island morphodynamics and state khas lands
│   ├── coastal.json                     # Coastal shoreline changes and unassigned mudflats
│   ├── plots.json                       # Cadastral plot polygons with 4-corner coordinates
│   ├── owners.json                      # Fictional landowner profiles and deeds
│   └── rasters/                         # Synthetic DEM hillshade and slope PNG assets
├── scripts/                             # Utility and generation scripts
│   └── generate-mocks.ts                # Deterministic seeded mock data generator
├── stores/                              # Zustand global state stores
│   └── appStore.ts                      # Area unit preference and global UI state
├── tests/                               # Vitest unit test suites (54 passing tests)
└── e2e/                                 # Playwright end-to-end test specifications
```

---

## 4. Routing Strategy

Next.js 14 App Router handles client-side routing. Route parameters dictate the active hazard, mode, and geographic identifier:

| URL Pattern | Page Component | Data Access Hook | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | `getDashboardSummary(mode)` | National overview dashboard with KPI cards and trend charts. |
| `/river-erosion/[mode]` | `app/river-erosion/[mode]/page.tsx` | `getOptions(...)`, `listResults(...)` | Cascading selector and riverside mouza result list. |
| `/river-erosion/[mode]/[mouzaId]` | `app/river-erosion/[mode]/[mouzaId]/page.tsx` | `getResult("river_erosion", ...)` | Side-by-side river erosion comparison map and compensation table. |
| `/flood` | `app/flood/page.tsx` | `listFloods(selection)` | Cascading selector and historical flood archive list. |
| `/flood/[mouzaId]/[floodId]` | `app/flood/[mouzaId]/[floodId]/page.tsx` | `getFlood(id)` | Detailed multi-depth flood map and affected owner table. |
| `/flood/.../owner/[ownerId]` | `app/flood/.../owner/[ownerId]/page.tsx` | `getOwnerPlots(floodId, ownerId)` | Individual landowner parcel page detailing 4-corner GPS coordinates. |
| `/landslide/[mode]/[eventId]` | `app/landslide/[mode]/[eventId]/page.tsx` | `getResult("landslide", ...)` | Side-by-side landslide DEM hillshade and debris runout map. |
| `/char/[mode]/[resultId]` | `app/char/[mode]/[resultId]/page.tsx` | `getResult("char", ...)` | Side-by-side char accretion/erosion map and state khas card. |
| `/coastal/[mode]/[resultId]` | `app/coastal/[mode]/[resultId]/page.tsx` | `getResult("coastal", ...)` | Side-by-side coastal shoreline retreat and mudflat accretion map. |
| `/settings` | `app/settings/page.tsx` | Static UI | Settings navigation hub. |
| `/settings/about` | `app/settings/about/page.tsx` | Static UI | Platform overview and hazard scope documentation. |
| `/settings/team` | `app/settings/team/page.tsx` | Static UI | Official team structure (GeoNeural) and copyright metadata. |

---

## 5. UI Component Libraries

1. **Radix UI Primitives:** Headless, accessible primitives used for tooltips, modal dialogs, popovers, and tab bars.
2. **Lucide React (`0.447.0`):** Semantic vector icons (e.g., `Waves` for River Erosion, `CloudRain` for Flood, `Mountain` for Landslides, `Compass` for Chars, `Anchor` for Coastal).
3. **Recharts (`2.12.7`):** Responsive charting library rendering SVG paths for:
   - Line charts: Historical land loss vs. gain ($2020 - 2025$).
   - Bar charts: Distribution of affected areas across the five hazards.

---

## 6. Mapping Libraries and Map Providers

### 6.1 Mapping Engine
The mapping engine is built upon **Leaflet 1.9.4** wrapped in React components via **react-leaflet 4.2.1** and custom imperative Leaflet controllers. Leaflet was selected over MapLibre/Mapbox for its minimal bundle footprint, zero proprietary API key requirements, and superior support for custom SVG hatch patterns and multi-pane z-index layering.

### 6.2 Basemap Providers and Configurations
Configured in [`lib/basemapConfig.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/lib/basemapConfig.ts):

| Basemap ID | Display Name | Source / URL Template | Attribution Notice | Characteristics |
|---|---|---|---|---|
| `light-gis` | **Light GIS** (Default) | In-memory synthetic SVG/Canvas vector layers | `BhumiDorpon Light GIS Basemap • Synthetic Demo Cartography` | Zero network dependency; authoritative high-contrast vector cartography depicting mouzas, roads, water, and graticules. |
| `satellite` | **Satellite** | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | `Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community` | Genuine high-resolution satellite imagery from Esri World Imagery (ArcGIS Online). Requires internet connectivity. Configurable via `NEXT_PUBLIC_SATELLITE_TILE_URL`. |
| `street` | **Street** (Optional) | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | `© OpenStreetMap contributors` | Standard OpenStreetMap cartographic tile layer. Configurable via `NEXT_PUBLIC_STREET_TILE_URL`. |

### 6.3 Authentic Regional Bounding Boxes
Configured in [`components/map/GisMapCompare.tsx`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/components/map/GisMapCompare.tsx):
- **River Erosion:** `[89.62, 24.54, 89.67, 24.59]` (Kazipur, Sirajganj — Jamuna River corridor)
- **Landslides:** `[92.01, 22.54, 92.05, 22.58]` (Kawkhali, Rangamati — Chittagong Hill Tracts)
- **Floods:** `[91.15, 25.07, 91.21, 25.12]` (Tahirpur / Jaflong — Haor floodplain basin)
- **Char Islands:** `[89.63, 24.56, 89.68, 24.61]` (Kazipur Char — Jamuna sandbars)
- **Coastal:** `[90.68, 22.16, 90.73, 22.21]` (Hatiya / Monpura — Bay of Bengal estuary)

---

## 7. Styling System and Design Tokens

The application implements a minimalist light-mode design system declared in [`app/globals.css`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/app/globals.css):

```css
:root {
  /* Surface Tokens */
  --bg: #F6F7F2;          /* Soft sage/gray page background */
  --surface: #FFFFFF;     /* Pure white card backgrounds */
  --surface-alt: #F0F2EA; /* Muted container background */
  --border: #E4E7DC;      /* Delicate neutral card border */

  /* Text & Ink Tokens */
  --ink: #14170F;         /* Primary deep ink text */
  --ink-2: #4A5043;       /* Secondary neutral text */
  --muted: #7B8274;       /* Muted labels and table headers */

  /* Primary Accent Tokens (Lime) */
  --accent: #C8F23A;      /* Vivid lime accent fill */
  --accent-ink: #14170F;  /* High-contrast ink text over lime */
  --accent-deep: #4D7A0A; /* Dark olive-lime for readable links */
  --accent-soft: #EEF8C8; /* Soft lime container tint */

  /* Semantic Data Tokens */
  --loss: #E4604A;        /* Coral tone for land erosion/loss */
  --loss-soft: #FBE5E0;   /* Light coral tint */
  --gain: #2F9E62;        /* Forest green tone for accretion/gain */
  --gain-soft: #DFF3E8;   /* Light green tint */
  --predicted: #6A5BD6;   /* Purple tone for forecasts & models */
  --predicted-soft: #ECE9FB;
  --water: #2F7FB8;       /* Riverine & marine water blue */
  --warn: #E5A200;        /* Amber warning & demo banner */
}
```

---

## 8. State Management Architecture

State is cleanly partitioned between local React state, server/query cache, and global client stores:

1. **Zustand (`stores/appStore.ts`):** Manages user preferences:
   - `unit: AreaUnit` (`decimal` | `acre` | `hectare`)
   - `setUnit: (unit: AreaUnit) => void`
   - `basemap: BasemapType` (`light-gis` | `satellite` | `street`)
2. **Zustand (`components/map/chrome/layerStore.ts`):** Manages interactive map layer visibility:
   - Cadastral plot boundaries, mouza labels, contour lines, graticule, and water status.
3. **TanStack React Query (`@tanstack/react-query`):** Manages asynchronous data requests to `lib/data.ts`:
   - Enforces 5-minute stale times (`staleTime: 5 * 60 * 1000`) for mock query results.
   - Provides deterministic query keys: `["dashboardSummary", mode]`, `["options", hazard, mode, step, selection]`, `["result", hazard, mode, id]`.

---

## 9. Data Loading and Processing

All data operations are coordinated through [`lib/data.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/lib/data.ts):
- **Simulated Network Latency:** Functions inject an artificial delay of 200–400ms (`delay(200, 400)`) to ensure UI loading skeletons and transitions render realistically.
- **Dynamic Aggregation:**
  - `getDashboardSummary(mode)`: Computes national totals across active hazard records. In `mode === "forecast"`, disbursement figures (`paid`, `approved`, `pending`) are strictly excluded.
  - `getOptions(hazard, mode, step, selectionSoFar)`: Filters geographic children and annotates active records with `hasRecords = true`.
  - `listResults(hazard, mode, selection)`: Retrieves filtered results with polygon intersection data.
  - `getOwnerPlots(floodId, ownerId)`: Extracts all parcels owned by an individual, calculating depth class and explicit 4-corner GPS boundary coordinates.

---

## 10. Current Backend & Mock Data Architecture

### 10.1 Mock Data Strategy
BhumiDorpon currently operates **without a backend server, database daemon, or live API**. All data originates from deterministic JSON files generated by [`scripts/generate-mocks.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/scripts/generate-mocks.ts).
- Seeded pseudo-random generation ensures identical output hashes across all developer machines and test environments.
- Re-generation command: `npm run generate:mocks`.

### 10.2 Cadastral Four-Corner Geometry Rule
Every plot in [`mocks/plots.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/mocks/plots.json) is guaranteed to possess exactly four distinct boundary vertices structured in fixed clockwise order:
1. `Corner 1: NW` (North-West)
2. `Corner 2: NE` (North-East)
3. `Corner 3: SE` (South-East)
4. `Corner 4: SW` (South-West)

Coordinates are stored as standard WGS84 decimal latitude and longitude rounded to 6 decimal places (approximately 11 cm precision on the ground).

---

## 11. Environment Variables and Configuration

No private environment variables or secrets are required to run the application. Optional public environment variables can be configured in `.env.local`:

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SATELLITE_TILE_URL` | No | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | Custom XYZ satellite tile server template. |
| `NEXT_PUBLIC_STREET_TILE_URL` | No | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | Custom XYZ street tile server template. |

---

## 12. External Dependencies and Licenses

- **OpenStreetMap Tiles:** ODbL License (requires attribution `© OpenStreetMap contributors`).
- **Esri World Imagery:** Esri Master License Agreement (free for non-commercial evaluation; requires attribution).
- **Turf.js:** MIT License.
- **Leaflet & react-leaflet:** BSD-2-Clause / MIT License.
- **Radix UI Primitives:** MIT License.
- **Lucide Icons:** ISC License.

---

## 13. Verified Build and Development Commands

Verified against [`package.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/package.json):

```bash
# Install required dependencies
npm install

# Regenerate static relational mock datasets (deterministic)
npm run generate:mocks

# Start Next.js development server (with 1.5GB memory allocation)
npm run dev

# Run TypeScript compile-time lint / type-check
npm run lint

# Execute Vitest automated unit test suite (54 tests)
npm test

# Run Playwright end-to-end browser tests
npm run test:e2e

# Compile production bundle
npm run build

# Start production server
npm run start
```

---

## 14. Performance and Responsiveness Requirements

- **Lighthouse Performance Target:** $\ge 85$ on desktop.
- **Largest Contentful Paint (LCP):** $< 3.0$ seconds.
- **Cumulative Layout Shift (CLS):** $< 0.05$ (guaranteed by explicit map container heights).
- **Map Synchronization Latency:** $< 16\text{ms}$ between paired Leaflet instances.
- **Responsive Breakpoints:**
  - Mobile: $390\text{px} - 767\text{px}$ (single-column, vertically stacked maps)
  - Tablet: $768\text{px} - 1023\text{px}$ (adaptive 2-column cards)
  - Desktop: $\ge 1024\text{px}$ (side-by-side 50/50 map comparison grid)

---

## 15. Browser Compatibility

Tested and supported on all modern Evergreen browsers:
- Google Chrome: v110+
- Mozilla Firefox: v110+
- Apple Safari: v16+
- Microsoft Edge: v110+

---

## 16. Technical Limitations of Current Architecture

1. **Client-Side Scalability:** Loading large numbers of complex GeoJSON plot polygons into browser memory can degrade rendering performance on low-end mobile devices.
2. **Synthetic Boundary Alignment:** While satellite tiles represent real ground imagery, the synthetic mock parcel boundaries do not match real-world legal cadastral surveys.
3. **Absence of Server Authentication:** No user accounts, sessions, or role-based access control are implemented in the current prototype.
4. **Offline Satellite Limitations:** Satellite tiles require active internet access; when offline, only the synthetic Light GIS basemap operates.

---

## 17. Troubleshooting and Maintenance Notes

- **Map Container Zero-Height Bug:** If a Leaflet map renders blank or grey, ensure the parent container defines an explicit height (`h-[450px]` or `min-h-[400px]`) and triggers `map.invalidateSize()`.
- **Synchronization Recursion:** If panning causes an infinite event loop between paired maps, verify that event handlers check `map._isSyncing` flags before propagating `move` or `zoom` events.
- **Memory Consumption during Build:** Next.js build scripts are configured with `--max-old-space-size=1536` to prevent Node.js heap exhaustion on resource-constrained environments.

---

## 18. Proposed Technical Improvements (Future Roadmap)

1. **FastAPI & PostGIS Backend:** Transition data queries to an external FastAPI service backed by PostgreSQL 16 + PostGIS.
2. **Vector Tile Generation (MVT):** Implement Tippecanoe / Martin to serve cadastral plots as lightweight Mapbox Vector Tiles (`.pbf`) instead of raw GeoJSON.
3. **Cloud-Optimized GeoTIFFs (COG):** Serve satellite imagery via TiTiler dynamic tile endpoints.
4. **Progressive Web App (PWA):** Implement service workers to cache cadastral sheets and allow offline field survey data collection.
