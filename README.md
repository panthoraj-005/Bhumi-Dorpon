# BhumiDorpon

> **Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**  
> *Developed for the LandTech Innovation Hackathon 2026*

---

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.13-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Turf.js](https://img.shields.io/badge/Turf.js-7.4.0-darkgreen?style=flat)](https://turfjs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.11-yellow?style=flat&logo=vitest)](https://vitest.dev/)
[![Team](https://img.shields.io/badge/Team-GeoNeural-indigo?style=flat)](#16-team-information-credits-and-acknowledgements)

---

> [!IMPORTANT]
> **DEMO DATA DISCLAIMER & ARCHITECTURAL DISCLOSURE**
> - **Strictly Synthetic / Dummy Data:** All individual landowner names (e.g., *"Abdul Karim"*, *"Rahima Begum"*), cadastral plot numbers (*Dag No.*), record-of-rights deed numbers (*Khatian No.*), boundary coordinate readouts, and compensation figures in this project are strictly fictional mock records created solely for academic evaluation and hackathon demonstration.
> - **No Government Service or Legal Title:** This application is an educational prototype. It does not connect to live government databases, does not provide certified legal land records, and cannot be used for legal land titling or disaster dispatch.
> - **Client-Side Prototype:** The current application has **no backend server or external database**. All cascading selectors, side-by-side map synchronization, Turf.js spatial intersection calculations, and tabular filters execute entirely client-side using deterministic mock datasets located in `/mocks` and `/public/mocks`.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement and Objectives](#2-problem-statement-and-objectives)
- [3. Key Features and Hazard Modules](#3-key-features-and-hazard-modules)
- [4. Google Earth Parcel Outline Feature](#4-google-earth-parcel-outline-feature)
- [5. System Architecture and Data Store](#5-system-architecture-and-data-store)
- [6. Technology Stack](#6-technology-stack)
- [7. Installation and Quick Start](#7-installation-and-quick-start)
- [8. Troubleshooting](#8-troubleshooting)
- [9. How to Use the Application](#9-how-to-use-the-application)
- [10. Data Sources, Ethical Guardrails & Scope Reality](#10-data-sources-ethical-guardrails--scope-reality)
- [11. Testing and Verification](#11-testing-and-verification)
- [12. Known Limitations and Future Improvements](#12-known-limitations-and-future-improvements)
- [13. Project Structure and Documentation Index](#13-project-structure-and-documentation-index)
- [14. AI Tools Used](#14-ai-tools-used)
- [15. Project Update History](#15-project-update-history)
- [16. Team Information, Credits, and Acknowledgements](#16-team-information-credits-and-acknowledgements)
- [17. License and Repository Links](#17-license-and-repository-links)

---

## 1. Project Overview

**BhumiDorpon (Mirror of the Land)** is a responsive, client-side web application designed to demonstrate how satellite remote-sensing observations and cadastral land records can be synthesized into an accessible, interactive map dashboard. Built specifically for the geographic and administrative context of Bangladesh, BhumiDorpon enables users to explore, visualize, and analyze land-surface changes caused by natural hazards across five core categories: **River Erosion**, **Flooding**, **Landslides**, **Char Island Formation**, and **Coastal Erosion & Accretion**.

In Bangladesh, millions of citizens live along active river corridors, flood-prone haors (wetland basins), hilly tertiary escarpments, and dynamic coastal deltas. When physical land shifts, earthen boundary markers (*ail*) disappear, creating severe land ownership disputes, displacement, and delays in government compensation disbursement. BhumiDorpon bridges this gap by coupling parcel-level cadastral plots (*Dag No.* [cadastral plot] and *Khatian No.* [record-of-rights deed]) with spatial hazard envelopes on synchronized before/after maps.

The platform also demonstrates a GeoAI forecasting workflow, where a proposed deep learning pipeline (Sentinel-1/2 &rarr; ConvLSTM / Spatiotemporal U-Net &rarr; 1-year hazard envelope &rarr; cadastral plot intersection) estimates which parcels may be affected next. In this prototype, all forecasts are pre-computed mock scenarios designed to demonstrate early disaster preparedness and recovery workflows.

---

## 2. Problem Statement and Objectives

### 2.1 Problem Statement
Bangladesh is one of the most hydro-morphologically dynamic deltaic nations in the world, facing recurring tenure and humanitarian challenges:
1. **Erosion of Cadastral Boundaries:** Braided rivers such as the Jamuna and Padma erode thousands of hectares of farmland annually, obliterating physical earthen markers (*ail*) and dislocating farming communities.
2. **Post-Flood Inundation & Siltation:** Monsoon inundation in wetland haors (e.g., Sylhet, Sunamganj) submerges parcels beneath up to 2.5 meters of water, depositing silt layers that spark tenure disputes after floodwaters recede.
3. **Slope Instability in Hilly Terrains:** In the Chittagong Hill Tracts (CHT), intense rainfall triggers destructive landslides on steep slopes (38°–44°), displacing topsoil and threatening settlements.
4. **Char Accretion & Tenure Ambiguities:** Emerging river sandbars (*chars*) generate friction between private re-emergence claims (*payosti*) and unassigned state reserve lands (*Khas* land under Deed 1/1).
5. **Lack of Transparent Compensation Tracking:** Displaced landholders often lack an accessible means to verify whether their lost land has been surveyed, categorized, or marked as *Paid*, *Approved*, or *Pending*.

### 2.2 Objectives
- **Centralized Multi-Hazard Dashboard:** Provide an accessible interface for inspecting 5 distinct hazard categories across representative pilot districts.
- **Synchronized Visual Comparison:** Enable side-by-side comparison of baseline (*Before*) and post-hazard (*After/Forecast*) conditions with synchronized panning and zooming.
- **Cadastral Plot Coupling:** Connect discrete parcel records (*Dag No.*, *Khatian No.*, 4-corner GPS coordinates) with continuous hazard footprints using client-side computational geometry.
- **Dual Basemap Flexibility:** Offer both an offline-ready vector **Light GIS** basemap and high-resolution **Satellite** imagery (Esri World Imagery).
- **Ethical AI Guardrails:** Enforce strict compliance with Hackathon Rule 5 by suppressing all financial disbursement figures on predictive forecast views.

---

## 3. Key Features and Hazard Modules

### 3.1 Implemented Core Features

| Feature | Description | Interaction | Benefit |
|---|---|---|---|
| **Side-by-Side Synced Compare** | Displays two synchronized Leaflet viewports: *Before* on the left and *After* (or *Forecast*) on the right. | Pan or zoom either viewport; event listeners automatically synchronize the paired map. | Immediate visual verification of land loss, shoreline retreat, or flood inundation over time. |
| **Dual Basemap Engine** | Switches map canvas between a custom offline vector **Light GIS** basemap and high-resolution **Satellite** imagery. | Toggle basemaps in the map chrome bar. | Light GIS maximizes boundary legibility; Satellite imagery provides real-world physical ground context. |
| **Cascading Selectors** | Guides users through a hierarchical administrative selection: `District → Upazila → River/Hill/Mouza → Hazard Event`. | Click dropdowns in sequence; child dropdowns dynamically populate only options relevant to parent selection. | Eliminates clutter, guides non-technical users, and prevents invalid geographic queries. |
| **Active Record Indicators** | Flags administrative units with green badges (`hasRecords = true`) where pre-computed hazard data is available. | Look for visual badges in the cascading dropdown lists. | Directs evaluators and users immediately to populated pilot clusters without dead ends. |
| **Cadastral Plot Overlays** | Renders 4-corner cadastral plot polygons over the map with color-coded damage classifications. | Hover over or click individual parcels to display plot-specific metadata cards. | Enables granular parcel-by-parcel damage inspection rather than vague regional summaries. |
| **Four-Corner GPS Readouts** | Calculates exact latitude/longitude coordinates (NW, NE, SE, SW to 6 decimal places) for every parcel corner. | Open any parcel in the Flood Owner Land page and click **"Copy 4 Corners"** or expand the corners card. | Allows landholders and surveyors to recover lost physical plot boundary markers on the ground. |
| **Google Earth KML Export** | Generates client-side KML 2.2 polygon files and launches Google Earth Web centered on the parcel. | Click **"Open in Google Earth"** on the Flood Owner Land Detail page. | Enables 3D satellite inspection and boundary recovery without third-party GIS software. |
| **GeoAI Forecast Mode (Demo)** | Demonstrates 1-year forward predictive hazard envelopes with Rule 5 financial suppression guardrails. | Toggle **Recorded / Forecast** in the header navigation bar. | Supports anticipatory disaster planning while preventing speculative estimates from being mistaken for approved aid. |
| **Owner Compensation Ledger** | Displays tabular accounting of affected landowners with Dag No., Khatian No., lost area, and compensation status. | Sort table columns or filter by status badges: `Paid`, `Approved`, or `Pending`. Filter by name or Dag. | Transparent, auditable tracking of disaster assistance liabilities. |
| **Multi-Unit Area Conversion** | Recalculates all area figures across Decimals, Acres, and Hectares using precise conversion ratios. | Toggle the unit selector button in the navigation bar. | Accommodates both traditional local land units (*Decimals*, *Acres*) and international metric units (*Hectares*). |
| **GeoJSON & CSV Export** | Generates client-side downloadable GeoJSON feature collections and formatted CSV tables for selected records. | Click **"Export CSV"** or **"Download GeoJSON"** buttons on detail and owner pages. | Enables seamless integration with desktop GIS software (QGIS, ArcGIS) and external reporting workflows. |
| **Settings Hub** | Provides verified project specifications, architecture disclosures, and official team attribution. | Click **Settings** in the sidebar to view **About Project** (`/settings/about`) and **Team Information** (`/settings/team`). | Transparent access to project purpose, architectural disclosures, and team credentials. |

### 3.2 The Five Hazard Modules

| Hazard Module | Route | Pilot Geographic Cluster | Thematic Map Layers & Features |
|---|---|---|---|
| **1. River Erosion** | `/river-erosion` | Sirajganj (Kazipur, Jamuna River) | Active braided channel, historical vs. current banklines, retreat vectors, mouza loss/gain badges. |
| **2. Flood Monitoring** | `/flood` | Sylhet (Gowainghat, Jaflong) | Multi-depth inundation contours (`<0.5m`, `0.5–1.5m`, `>1.5m`), owner-colored parcels, owner detail page, 4-corner GPS readouts. |
| **3. Landslide Hazards** | `/landslide` | Rangamati (Kawkhali, Ghagra Hill) | Synthetic DEM hillshade rasters, 10m contour isolines, slope angle classes (38°–44°), failure scarps, debris runout. |
| **4. Char Islands** | `/char` | Sirajganj (Kazipur, Char Girish) | Mid-channel sandbar morphology, accretion tips, erosion flanks, unowned state Khas card (Deed 1/1). |
| **5. Coastal Shoreline** | `/coastal` | Bhola (Monpura & Char Fasson) | Estuarine coastline migration, intertidal mudflats, bathymetry contours, coastal embankment structures. |

---

## 4. Google Earth Parcel Outline Feature

On the dedicated Flood Owner Land Detail route (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`), directly below the Four Corner Coordinates table, an **Open in Google Earth** button allows landowners and relief officers to export parcel boundaries to 3D satellite visualization:

1. **One-Click Workflow:** Clicking the button synchronously:
   - Opens Google Earth Web in a new browser tab centered on the parcel's bounding-box center with calculated camera range:  
     `https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`
   - Triggers an instant browser download of `<floodId>_dag_<dagNo>_outline.kml`.
   - Displays an on-screen guidance hint for ~12 seconds: *"In Google Earth choose New → Open local KML file and select the downloaded file to display the parcel outline (Earth Pro: double-click the file)"*.
2. **KML 2.2 Payload Structure:** Formatted XML payload containing:
   - A single `Polygon` (`clampToGround`, closed 5-point coordinate ring written `lon,lat,0`) styled with an orange outline (`ff0088ff`) and translucent fill (`440088ff`).
   - Four numbered corner `Point` Placemarks (`1 (NW)`, `2 (NE)`, `3 (SE)`, `4 (SW)`).
   - Rich parcel metadata (owner name, mouza, Dag No., Khatian No., land class, area in decimals, flood status) and synthetic demo disclaimer.
3. **Client-Side Privacy Posture:** Pure client-side generation implemented in `lib/googleEarth.ts` using `Blob` and `URL.createObjectURL`. Zero backend, zero external API keys, and zero telemetry. PII (owner names, deeds, boundary coordinates) remains strictly on the client machine.
4. **Distinction from Google Earth Engine (GEE):** Google Earth is used strictly for client-side 3D visualization and KML export. The current prototype does **not** connect to Google Earth Engine; automated GEE satellite data ingestion is planned for future Phase 3 development. *(Detailed technical specifications in [`docs/TRD.md`](docs/TRD.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).*

---

## 5. System Architecture and Data Store

### 5.1 System Architecture Overview
BhumiDorpon is engineered as a zero-backend, client-side web application:

- **Frontend Core:** Next.js 14 App Router, React 18, and TypeScript delivering responsive, accessible single-page navigation.
- **Cartography Engine:** Leaflet `1.9.4` with custom SVG vector rendering for the Light GIS basemap, hazard overlays, and ESRI satellite tile streaming.
- **Spatial Geometry Engine:** Turf.js `7.4.0` executing client-side polygon clipping, 4-corner coordinate extraction, and parcel-hazard intersections.
- **Client State Management:** Zustand stores managing application mode, active units, and map layer toggles (`stores/appStore.ts` and `components/map/chrome/layerStore.ts`).
- **Data Caching:** TanStack React Query `5.59.0` managing asynchronous mock data resolution with simulated 200–400ms loading states.

*(For detailed architecture diagrams and component interactions, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).*

### 5.2 Deterministic Five-Hazard Information Store
All data across the five hazard domains is managed by a static, deterministic relational JSON store requiring **no external database server**:
- **Runtime Store (`public/mocks/*.json`):** Served at `/mocks/*` and fetched by client browser components via `lib/data.ts`. Flat relational datasets: `river_erosion.json`, `flood.json`, `landslide.json`, `char.json`, `coastal.json`, `plots.json`, and `owners.json`.
- **Server / Test Store (`mocks/*.json`):** Mirrored copy read synchronously via `fs.readFileSync` in Node.js and Vitest test environments.
- **Per-Area Map Packages (`public/mocks/areas/<hazard>/`):** Modular spatial GeoJSON packages (`areaId`, `bounds`, `hazardLayers`, `context`) resolved via `areas_index.json`.
- **Single Source of Truth:** Four-corner parcel coordinates stored in this relational JSON model serve as the single source for the cadastral table, copy buttons, CSV export, GeoJSON download, and Google Earth KML outlines.

*(For complete entity schemas and proposed PostgreSQL 16 / PostGIS 3.4 DDL, see [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md)).*

---

## 6. Technology Stack

| Category | Technology | Version | Purpose in BhumiDorpon |
|---|---|---|---|
| **Framework** | Next.js | `^14.2.15` | Core React framework using App Router for client routing and layout management. |
| **Language** | TypeScript | `^5.6.2` | Strong static type checking across all data layers, cadastral models, and UI props. |
| **UI Library** | React | `^18.3.1` | Component-based interactive user interface rendering. |
| **Styling** | Tailwind CSS | `^3.4.13` | Utility-first CSS framework for clean, high-contrast, accessible layouts. |
| **Mapping Engine** | Leaflet | `^1.9.4` | Open-source mobile-friendly interactive mapping engine. |
| **React Map Wrapper** | react-leaflet | `^4.2.1` | React bindings for Leaflet map elements and vector layers. |
| **Spatial Analysis** | Turf.js (`@turf/turf`) | `^7.4.0` | In-browser computational geometry: polygon intersections, area calculation, centroid derivation. |
| **Async Data Caching** | TanStack React Query | `^5.59.0` | Asynchronous data fetching, query caching, and loading state management. |
| **State Management** | Zustand | `^4.5.5` | Lightweight client state stores for global app state and map layer toggles. |
| **UI Primitives** | Radix UI | Various | Accessible, unstyled UI primitives (Dialog, Dropdown, Popover, Slider, Tabs, Tooltip). |
| **Icons** | Lucide React | `^0.447.0` | Clean, accessible vector icons for navigation and status indicators. |
| **Charts** | Recharts | `^2.12.7` | Accessible SVG data visualizations for national hazard trends and compensation breakdowns. |
| **Testing** | Vitest | `^4.1.11` | Modern unit test runner executing 10 comprehensive test suites (61 tests). |
| **E2E Testing** | Playwright | Configured | Headless browser testing framework for end-to-end user flow verification. |

---

## 7. Installation and Quick Start

### 7.1 Prerequisites
- **Node.js:** Version `18.x` or higher (tested and verified on Node.js `20.x`).
- **Package Manager:** `npm` (v9 or v10) or `pnpm`.
- **Git:** Git version control system installed.
- **Browser:** Modern browser supporting WebGL and Canvas (Chrome, Firefox, Edge, Safari).
- *No database (PostgreSQL, MongoDB), Python environment, or external GIS desktop software is required.*

### 7.2 Launch Locally
```bash
# 1. Clone the repository
git clone https://github.com/panthoraj-005/Bhumi-Dorpon.git
cd Bhumi-Dorpon

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 7.3 Optional Helper Commands
```bash
# Deterministically regenerate all mock datasets (in /mocks and /public/mocks)
npm run generate:mocks

# Build production bundle
npm run build

# Run production server
npm run start

# Execute automated test suites
npm test

# Run TypeScript type validation
npx tsc --noEmit
```

> [!TIP]
> **Zero Environment Configuration:** BhumiDorpon requires **no `.env` file** or third-party API credentials to run in development or production. All datasets and satellite tile layers operate out-of-the-box.

---

## 8. Troubleshooting

| Issue / Symptom | Probable Cause | Recommended Resolution |
|---|---|---|
| **Node.js Version Incompatibility** | Running Node.js version below `18.x`. | Verify version with `node -v`. Switch to Node 20 using `nvm use 20` or install via `nvm install 20`. |
| **Port 3000 In Use** | Another process is bound to port 3000. | Run on an alternate port: `npm run dev -- -p 3001` and open `http://localhost:3001`. |
| **Satellite Basemap Tiles Blank Offline** | Esri Satellite tiles require live internet. | Switch to the **Light GIS** basemap option in the map chrome bar. Light GIS renders from local vector data and operates 100% offline. |
| **NPM Peer Dependency Conflict** | Strict peer dependency checks on some npm releases. | Run package installation with legacy flag: `npm install --legacy-peer-deps`. |
| **Mock Generation Script Error** | Node runtime mismatch or restricted folder permissions. | Ensure Node `18+` is active and execute via: `node ./node_modules/tsx/dist/cli.mjs scripts/generate-mocks.ts`. |

---

## 9. How to Use the Application

### 9.1 National Overview Dashboard (`/`)
- Open [http://localhost:3000](http://localhost:3000) to inspect national aggregate statistics across Bangladesh: total surveyed land area, recorded land loss, accreted land gain, and compensation liabilities.
- Toggle between **Recorded** (historical verified events) and **Forecast** (model-based 1-year projections) modes using the mode toggle.
- Switch measurement units between **Decimals**, **Acres**, and **Hectares** via the unit toggle in the header.

### 9.2 Exploring a Hazard Module (e.g., `/river-erosion`)
1. Click **River Erosion** in the navigation sidebar or dashboard cards.
2. Use the **Cascading Selector Chain**:
   - **Step 1:** Select District (e.g., *Sirajganj* — marked with green active badge).
   - **Step 2:** Select Upazila (sub-district, e.g., *Kazipur*).
   - **Step 3:** Select River (e.g., *Jamuna River*).
   - **Step 4:** Select Riverside Mouza (revenue village, e.g., *Khanshama* or *Meghai*).
3. The page loads the **Side-by-Side Map Comparison**:
   - **Left Map:** Baseline historical condition (*Before*).
   - **Right Map:** Post-erosion surveyed condition (*After*).
   - Panning or zooming either map keeps the paired viewport synchronized.
4. Toggle basemaps between **Light GIS** and **Satellite** via the basemap selector in the map chrome.
5. Inspect the **Mouza Summary Panel** adjacent to the map for per-mouza land loss percentages and net change figures.
6. Scroll down to review the **Owner Compensation Table**, showing affected plot numbers (*Dag No.*), deed records (*Khatian No.*), and payment status (*Paid*, *Approved*, *Pending*).

### 9.3 Drilling Down into Flood & Owner Land Records (`/flood`)
1. Navigate to **Flood Monitoring** (`/flood`).
2. Select District (*Sylhet*) &rarr; Upazila (*Gowainghat*) &rarr; Mouza (*Jaflong*) &rarr; Event (*2024 Monsoon Flood*).
3. The map renders multi-depth flood inundation contours and colors cadastral parcels by landowner.
4. In the affected landowners table, click an owner's name (e.g., *"Rahim Uddin"*) to open the dedicated **Owner Land Detail Page** (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`).
5. Inspect the parcel's **Four-Corner GPS Coordinates**:
   - View exact latitude and longitude readouts for the **NW**, **NE**, **SE**, and **SW** parcel corners.
   - Click **"Copy 4 Corners"** to copy formatted coordinates to clipboard for local surveyor reference.
   - Click **"Download GeoJSON"** to save the parcel boundary as a standard GIS file.
   - Click **"Open in Google Earth"** to download the KML 2.2 polygon outline and open Google Earth Web.

### 9.4 Viewing Project & Team Information (`/settings`)
- Click **Settings** in the sidebar.
- Select **About Project** (`/settings/about`) for a factual breakdown of system features, basemap mechanics, and data disclaimers.
- Select **Team Information** (`/settings/team`) to review verified development team credentials and copyright details.

---

## 10. Data Sources, Ethical Guardrails & Scope Reality

### 10.1 Strict Compliance with Hackathon Rule Book
In accordance with the **LandTech Innovation Hackathon Rule Book, Version 1.2**:
- **No Real Personal Identifiable Information (PII):** The project uses **zero real human names, National ID (NID) numbers, phone numbers, email addresses, or private financial records**.
- **No Real Private Cadastral Titles:** No real land titles, registered land disputes, or authentic deed records have been extracted from government land registration offices.
- **No Web Scraping:** No automated scraping, bulk data harvesting, or denial-of-service queries were performed against any government portal (*eporcha.gov.bd*, *minland.gov.bd*, or *land.gov.bd*).

### 10.2 Data Classification Summary

| Dataset / Asset | Data Classification | Origin / Method | Purpose in Application |
|---|---|---|---|
| **Administrative Units** | Synthetic / Sample | Modeled after BBS codes and JL numbers with synthetic bounding coordinates. | Powers cascading geographic selectors and administrative containment. |
| **Cadastral Plots & Dags** | Synthetic / Dummy | Procedurally generated 4-corner closed polygons with fictional Dag Nos. (101–145). | Demonstrates parcel-level spatial hazard intersections and boundary recovery. |
| **Landowner Deeds & Khatians** | Synthetic / Dummy | Fictional landowner names (*Abdul Karim*, *Rahima Begum*) and simulated Khatian deed numbers (*12/A*). | Populates compensation tables and owner boundary detail views. |
| **Hazard Geometries** | Synthetic / Dummy | Algorithmic vector polygons generated via Turf.js mathematical functions. | Renders spatial hazard overlays on before/after maps. |
| **Forecast Scenarios** | Synthetic / Dummy | Deterministically computed forecast polygons generated via `scripts/generate-map-areas.ts`. | Powers GeoAI Forecast Mode concept demo with Rule 5 guardrails. |
| **Landslide DEM Rasters** | Synthetic Rasters | Procedural 2D Gaussian elevation fields rendered into PNG hypsometric tints and hillshades. | Demonstrates topographic terrain shading and elevation profile visualization. |
| **Satellite Basemap** | Public External Tiles | **Esri World Imagery** public WMTS tile service (`server.arcgisonline.com`). | Provides high-resolution global satellite context beneath vector overlays. |

### 10.3 Ethical Guardrails (Hackathon Rule 5 Compliance)
To prevent speculative AI projections from being misinterpreted as approved disaster assistance:
- All forecast views enforce an amber **"Model-Based Estimate (Demo)"** banner.
- Financial compensation figures (`Paid`, `Approved`, `Pending`) are **strictly stripped and suppressed** from all forecast tables and summary metrics in `lib/data.ts`.
- The UI displays explicit disclaimer notices: *"This is a model-based estimate, not an official government record."*

### 10.4 Accurate Scope & Deep Learning Reality
To maintain rigorous scientific and technical integrity, the role of Deep Learning in BhumiDorpon is disclosed as follows:
- **No Live In-Browser Neural Networks:** Inspection of `package.json` confirms that the current prototype contains **no deep-learning runtimes** (such as TensorFlow.js, ONNX Runtime Web, or PyTorch bindings).
- **Concept Demonstration:** The application's *Forecast* mode demonstrates the user workflow of a proposed spatiotemporal Earth Observation pipeline (Sentinel-1 SAR / Sentinel-2 optical &rarr; ConvLSTM / Spatiotemporal U-Net &rarr; 1-year hazard envelope &rarr; cadastral plot intersection). All predictive scenarios rendered in the prototype are **pre-computed, deterministic mock datasets**.

---

## 11. Testing and Verification

BhumiDorpon includes an automated unit test suite implemented with **Vitest**. All 10 test suites and 61 individual unit tests pass cleanly:

```bash
npm test
```

### 11.1 Test Suite Breakdown

| Test Suite File | Tests | Primary Verification Domain |
|---|---|---|
| `tests/step5_flood_flow.test.ts` | 6 passed | Flood event retrieval, landowner filtering, 4-corner GPS readouts (6 decimals), and centroid exclusion. |
| `tests/four_corners_geometry.test.ts` | 5 passed | Validates closed 5-point coordinate ring, strict NW &rarr; NE &rarr; SE &rarr; SW vertex ordering, and centroid suppression. |
| `tests/data_layer.test.ts` | 4 passed | Dynamic dashboard summary aggregation, cascading options derivation, and typed hazard results. |
| `tests/step3_and_step4.test.ts` | 8 passed | Cascading selector hierarchy, active record flags (`hasRecords = true`), and Rule 5 financial suppression in forecast mode. |
| `tests/change3_part1_gis_basemap.test.ts` | 8 passed | Light GIS basemap geometry loading, mouza boundary rendering, and mode variant loading. |
| `tests/map_fixes.test.ts` | 4 passed | Geographic bounds configuration per hazard (Kazipur, Sunamganj, Cox's Bazar, Bhashan Char, Kuakata). |
| `tests/settings_information.test.ts` | 4 passed | About Project disclosures, Team Information rendering, and attribution integrity. |
| `tests/units_and_compensation.test.ts` | 12 passed | Exact mathematical land unit conversions (Decimals, Acres, Hectares) and compensation formulas. |
| `tests/map_comparison_side_by_side.test.ts` | 3 passed | Dual map synchronization event listeners, re-entrancy locks, and zoom controls. |
| `tests/google_earth_kml.test.ts` | 7 passed | KML 2.2 coordinate formatting, closed ring polygon, XML escaping, corner placemarks, camera math, and client privacy. |
| **Total** | **61 passed** | **10 test files executed in ~20s** |

### 11.2 TypeScript Static Typecheck
```bash
npx tsc --noEmit
# Exit code: 0 (0 diagnostic errors)
```

*(For detailed testing procedures, Playwright E2E suites, and QA acceptance matrices, see [`docs/TESTING_QA.md`](docs/TESTING_QA.md)).*

---

## 12. Known Limitations and Future Improvements

### 12.1 Current Limitations
1. **Client-Side Simulation:** The platform operates purely as a client-side prototype. It does not persist user edits to an external database.
2. **Deterministic Synthetic Data:** All cadastral parcels, landowner identities, and hazard boundaries are synthetic. Coordinates cannot be used for legal land titling or boundary demarcation on the ground.
3. **No Live In-Browser Neural Networks:** Forecast scenarios represent model-assisted concepts and are rendered from pre-computed mock datasets.
4. **Static Satellite Basemap:** While the Esri World Imagery basemap provides high-resolution context, it is a static snapshot and does not update dynamically with real-time satellite passes.
5. **Simulated Latency:** The mock data layer includes an intentional 200–400ms delay to demonstrate loading skeletons and async UI states.

### 12.2 Future Roadmap (Phased Improvements)
- [ ] **Phase 2: Operational PostGIS / FastAPI Backend:** Migrate static JSON files to an enterprise PostgreSQL 16 / PostGIS 3.4 database with vector tile caching (MVT).
- [ ] **Phase 3: Automated Satellite Ingestion Pipeline:** Integrate Google Earth Engine (GEE) or Sentinel Hub APIs to automatically download, calibrate, and vectorize Sentinel-1 SAR and Sentinel-2 images after major hazard events.
- [ ] **Phase 4: Live GeoAI Inference Service:** Deploy a containerized FastAPI / PyTorch microservice running fine-tuned Spatiotemporal U-Net models for real-time bankline migration prediction.
- [ ] **Government Portal Integration:** Build secure authenticated connectors to the Bangladesh Ministry of Land's e-Mutation and Digital Khatian deed services.
- [ ] **Bilingual Localization (Bangla & English):** Implement full bilingual support across all interface labels, tooltips, and downloadable PDF reports.

*(For the complete milestone timeline and execution plan, see [`docs/PROJECT_ROADMAP.md`](docs/PROJECT_ROADMAP.md)).*

---

## 13. Project Structure and Documentation Index

### 13.1 Repository Structure
```
BhumiDorpon/
├── app/                              # Next.js 14 App Router routes
│   ├── char/                         # Char island module pages
│   ├── coastal/                      # Coastal erosion & accretion module pages
│   ├── flood/                        # Flood monitoring & drill-down pages
│   │   └── [mouzaId]/[floodId]/owner/[ownerId]/  # Dedicated Owner Land Detail page
│   ├── landslide/                    # Landslide hazards module pages
│   ├── river-erosion/                # River erosion module pages
│   ├── settings/                     # Settings hub (About Project & Team Information)
│   ├── globals.css                   # Global styles & Tailwind directives
│   ├── layout.tsx                    # Root application layout
│   └── page.tsx                      # National Overview Dashboard
├── components/                       # Modular React UI components
│   ├── AppHeader.tsx                 # Top navigation bar with unit & mode toggles
│   ├── AppSidebar.tsx                # Collapsible hazard navigation sidebar
│   ├── DemoBanner.tsx                # Sticky synthetic data disclaimer banner
│   ├── OwnerTable.tsx                # Landowner compensation & plot status table
│   ├── SelectorChain.tsx             # Cascading geographic dropdown selectors
│   └── map/                          # Cartographic mapping components
│       ├── basemap/                  # Light GIS SVG vector basemap factory
│       ├── chrome/                   # Map chrome (Graticule, Inset, Legends, BasemapSelector)
│       ├── panels/                   # MouzaSummaryPanel, WaterStatusCard, OwnerLegendPanel
│       ├── GisMapCompare.tsx         # Synchronized side-by-side comparison engine
│       ├── FloodMap.tsx              # Multi-depth inundation map overlay
│       ├── LandslideMap.tsx          # DEM hillshade & contour slope map
│       ├── RiverErosionMap.tsx       # Jamuna bankline retreat map
│       ├── CharMap.tsx               # Char island sandbar accretion map
│       ├── CoastalMap.tsx            # Estuarine shoreline migration map
│       └── OwnerPlotsLeafletMap.tsx  # 4-corner GPS plot boundary viewer
├── docs/                             # Exactly 12 consolidated technical specifications
├── lib/                              # Business logic, helpers, and data layer
│   ├── basemapConfig.ts              # Basemap layer definitions & colors
│   ├── data.ts                       # Typed asynchronous mock data layer
│   ├── googleEarth.ts                # Pure KML generator & Google Earth browser launcher
│   ├── types.ts                      # TypeScript interfaces (Plots, Owners, Hazards)
│   ├── units.ts                      # Land unit conversion utilities & compensation math
│   └── useSelection.ts               # Custom hook for cascading geographic selection
├── mocks/                            # Deterministic relational mock JSON datasets
├── public/                           # Static assets, rasters, and area GeoJSON
│   └── mocks/                        # Runtime mock datasets, DEM rasters, and spatial areas
├── scripts/                          # Automated generation & audit scripts
│   ├── generate-mocks.ts             # Deterministic relational mock dataset generator
│   └── generate-map-areas.ts         # Spatial area and forecast scenario generator
├── stores/                           # Zustand client state management (appStore.ts)
├── tests/                            # Automated test suite (10 test files, 61 unit tests)
├── next.config.js                    # Next.js build configuration & redirects
├── package.json                      # Project dependencies & npm scripts
├── playwright.config.mjs             # Playwright E2E configuration
├── tailwind.config.ts                # Tailwind CSS design system configuration
├── tsconfig.json                     # TypeScript compiler configuration
└── vitest.config.mjs                 # Vitest test configuration
```

### 13.2 Consolidated Documentation Index (`docs/`)

The `docs/` directory has been audited, translated into professional English, and consolidated into **exactly 12 authoritative Markdown specifications**:

| Document | Primary System Scope & Core Technical Coverage |
|---|---|
| [**`docs/PRD.md`**](docs/PRD.md) | **Product Requirements Document:** Problem statement, functional requirements (FR-001 to FR-021), Google Earth 3D parcel outline export, non-functional performance/accessibility mandates, and verification criteria. |
| [**`docs/TRD.md`**](docs/TRD.md) | **Technical Requirements Document:** Architecture stack, pure Leaflet offline SVG cartography, coordinate projection systems, mathematical area conversions, compensation formulas, KML 2.2 serializer, and GEE distinctions. |
| [**`docs/APP_FLOW.md`**](docs/APP_FLOW.md) | **App Flow / User Flow:** Route hierarchies, screen-by-screen state flows (S0 to S6), cascading selector logic, Rule 5 forecast view modes, and Google Earth one-click export interaction sequence. |
| [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md) | **System Architecture:** Layered client-side architecture, proposed cloud infrastructure (FastAPI / PostGIS), boundary matrix separating client Google Earth from future GEE ingest pipelines, and Mermaid diagrams. |
| [**`docs/DATABASE_SCHEMA.md`**](docs/DATABASE_SCHEMA.md) | **Database & Backend Schema:** Active deterministic Five-Hazard JSON Store (`public/mocks/` & `mocks/`) schemas and complete production PostgreSQL 16 + PostGIS 3.4 DDL (SRID 4326/32646) with SQL conversion functions. |
| [**`docs/API_DOCUMENTATION.md`**](docs/API_DOCUMENTATION.md) | **API Documentation:** Typed client data layer (`lib/data.ts`), Google Earth KML generator (`lib/googleEarth.ts`), external tile endpoints, and proposed future RESTful FastAPI endpoints. |
| [**`docs/UI_UX_DESIGN_SYSTEM.md`**](docs/UI_UX_DESIGN_SYSTEM.md) | **UI/UX Design System:** Minimalist Light GIS design tokens, Leaflet custom map panes, SVG hatch patterns, cartographic map chrome, 4-corner coordinate readout cards, and mobile breakpoints. |
| [**`docs/AUTH_SPECIFICATION.md`**](docs/AUTH_SPECIFICATION.md) | **Authentication & Authorization Specification:** Current zero-auth prototype status, proposed production RBAC model (Citizen, Surveyor, AC Land, Admin), Bangladesh National ID SSO integration, and audit logging. |
| [**`docs/TESTING_QA.md`**](docs/TESTING_QA.md) | **Testing & QA Documentation:** Complete audit of all 10 test suites and 61 unit tests, test commands (`npm test`, `npx tsc --noEmit`), Playwright E2E suites, regression matrices, and manual QA checklist. |
| [**`docs/SECURITY_SPECIFICATION.md`**](docs/SECURITY_SPECIFICATION.md) | **Security Specification:** Current zero-backend security posture, pure client-side Google Earth privacy, XSS/XML escaping, proposed production CSP, SQL injection defenses, and PII protection. |
| [**`docs/PROJECT_ROADMAP.md`**](docs/PROJECT_ROADMAP.md) | **Project Roadmap:** Detailed status of completed Phase 1 prototype milestones, Phase 2 (FastAPI/PostGIS/Bangla UI), Phase 3 (GEE automated ingest), and Phase 4 (Deep Learning GeoAI inference). |
| [**`docs/MAIN_PROJECT_DOCUMENTATION.md`**](docs/MAIN_PROJECT_DOCUMENTATION.md) | **Main Project Documentation:** Master technical compendium synthesizing architectural decisions, 5 hazard domains, 4-corner geometry, Google Earth feature, academic citations, and 15-milestone update history. |

---

## 14. AI Tools Used

In compliance with the LandTech Innovation Hackathon Rule Book, the following AI tools and environments were utilized during the project workflow:

### 14.1 Acknowledged AI Tools

1. **Claude (Anthropic)**  
   - **Role:** AI assistance used during the project workflow for conceptual architecture design, requirements structuring, documentation drafting, and reviewing geometric calculation logic.
2. **ChatGPT (OpenAI)**  
   - **Role:** AI assistance used during the project workflow for domain exploration, drafting problem statements relevant to Bangladesh riverine geography, and refining user-flow scenarios.
3. **Antigravity (Google / Gemini)**  
   - **Role:** AI-assisted development environment and agentic coding assistant used during the project workflow to execute terminal tasks, inspect codebases, refactor components, and write automated test suites.

### 14.2 Team Accountability & Explanation Statement
- **AI as an Accelerator, Not a Substitute:** AI tools served strictly as development and authoring assistants. They do not replace the team’s responsibility for understanding, reviewing, testing, verifying, and explaining the submitted codebase.
- **Judge Presentation Readiness:** The GeoNeural team has independently reviewed, verified, and debugged all submitted code and architecture. **Every member of the team is fully prepared to explain, defend, and walk through all submitted code, data structures, and algorithms during hackathon judging.**

---

## 15. Project Update History

In accordance with hackathon documentation specifications, the 15-milestone project evolution of BhumiDorpon is documented below:

| Milestone / Version | Date | Key Enhancements & Modifications |
|---|---|---|
| **Initial Submission** | Oct 2026 | Initial prototype establishing the 5 core hazard modules (River Erosion, Flood, Landslide, Char Formation, Coastal Erosion), baseline side-by-side Before/After map comparison, and preliminary mock data models. |
| **Data Architecture Refactoring & Deterministic Mock Engine** | Oct 2026 | Rebuilt core data architecture with deterministic mock generator (`scripts/generate-mocks.ts`), resolving empty cascading dropdowns and producing synchronized relational JSON stores across administrative hierarchies (Division, District, Upazila, Mouza) in `public/mocks/` and `mocks/`. |
| **SelectorChain Cascading & Rule 5 Forecast Guardrails** | Oct 2026 | Refactored `SelectorChain` cascading dropdown hierarchy (`lib/data.ts`); implemented strict compliance with Rule 5 by suppressing all financial disbursement metrics (paid, approved, pending) on predictive forecast views, retaining only projected compensation metrics (`tests/step3_and_step4.test.ts`). |
| **Flood Multi-Owner Flow & Landslide Terrain Overhaul** | Oct 2026 | Implemented flood event views with individual landowner plot color-coding and search by owner name / Dag number (`tests/step5_flood_flow.test.ts`); built landslide terrain engine with togglable elevation tints, hillshade rasters, index contour labels, and slope change metrics (`components/map/LandslideMap.tsx`). |
| **Cadastral 4-Corner Boundary Readout & Owner Detail Page** | Oct 2026 | Standardized all cadastral parcels into strict 4-corner quadrilaterals with fixed NW, NE, SE, SW vertex ordering and 6-decimal GPS coordinate readouts (`tests/four_corners_geometry.test.ts`); launched dedicated Flood Owner Land Detail route (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`) with one-click clipboard copying and centroid suppression. |
| **Leaflet Migration & Offline Cartography (Zero External Tiles)** | Oct 2026 | Removed all external tile server dependencies and MapLibre/Mapbox imports in full adherence to hackathon competition rules; migrated the complete mapping engine across all hazard views and previews to pure Leaflet with client-rendered SVG vector geometry (`components/map/`). |
| **Light-Themed GIS Basemap & Cartographic Chrome Upgrade** | Oct 2026 | Engineered custom high-contrast Light GIS basemap (`components/map/basemap/`), cartographic map chrome (graticules, dynamic scale bar, north arrow, locator inset mini-map in `components/map/chrome/`), mouza loss/gain badges, and `MouzaSummaryPanel` for river erosion, char, and coastal maps (`tests/change3_part1_gis_basemap.test.ts`). |
| **Side-by-Side Dual Map Viewer, Dedicated Zoom & Basemap Switcher** | Oct 2026 | Upgraded Before/After comparison to simultaneous dual-panel synchronized layout (`components/map/HazardMapContainer.tsx`); introduced dedicated in-map zoom controls (+/-) and an interactive basemap switcher (Light GIS vs. Satellite Remote Sensing) (`tests/map_comparison_side_by_side.test.ts`). |
| **Geographic Extent Bounds & Instant Dual-Zoom Synchronicity** | Oct 2026 | Configured regional bounding boxes per hazard (Kazipur, Sunamganj, Cox's Bazar, Bhashan Char, Kuakata in `tests/map_fixes.test.ts`); aligned geographic coordinate systems and implemented single-click simultaneous dual-map zoom synchronicity with active re-entrancy locks (`components/map/GisMapCompare.tsx`). |
| **Settings Navigation Hub & Verified Team Attribution** | Oct 2026 | Added dedicated Settings Hub (`/settings`) featuring verified **About Project** (`/settings/about`) detailing project capabilities and mock disclosures, and **Team Information** (`/settings/team`) displaying official team attribution (Team GeoNeural: Pantho Raj Biswas, Puja Paul) (`tests/settings_information.test.ts`). |
| **Comprehensive Technical Documentation Suite** | Oct 2026 | Published exhaustive engineering and specification suite in `/docs` (PRD, TRD, System Architecture, Database Schema, Security Specification, QA Testing Documentation, UI/UX Design System, API Documentation, and Roadmap). |
| **GeoAI Forecast Highlighting & Technical Readme Enhancement** | Oct 2026 | Enhanced README with comprehensive GeoAI 1-year predictive forecast hazard envelope highlight, operational troubleshooting guide, and transparent disclosures that all predictive data is pre-computed mock/synthetic datasets generated via scripts rather than live neural network outputs. |
| **Google Earth Parcel Outline Feature & Five-Hazard Information Store** | Oct 2026 | Implemented full-width "Open in Google Earth" button on Flood Owner Land Detail pages (`app/flood/[mouzaId]/[floodId]/owner/[ownerId]/page.tsx`) with pure client-side KML 2.2 serializer (`lib/googleEarth.ts`), synchronous Google Earth web launch, KML file download, on-screen guidance hint, and 7 automated tests (`tests/google_earth_kml.test.ts`, bringing suite to 61/61 passing tests); documented the deterministic Five-Hazard Information Store architecture. |
| **Documentation Alignment & History Synchronization** | Oct 2026 | Re-audited and updated complete 14-milestone project update history in `README.md` and `docs/MAIN_PROJECT_DOCUMENTATION.md`; synchronized test counts across documentation to 10 test suites (61/61 passing unit tests); ensured Section 15 is a terminal section with valid anchor links. |
| **Documentation Consolidation, Standardization & English Translation** | Oct 2026 | Audited entire documentation suite; consolidated 25 historical, prompt, and specification documents into exactly 12 authoritative Markdown specifications in `/docs`; translated all Bengali prose into professional English; clearly separated Google Earth client KML export from planned GEE pipelines; codified deterministic Five-Hazard Information Store architecture; verified all internal cross-references and zero regressions across 10 test suites (61/61 passing unit tests). |

*(For the complete chronological changelog with technical notes, see [`docs/MAIN_PROJECT_DOCUMENTATION.md`](docs/MAIN_PROJECT_DOCUMENTATION.md) Section 12).*

---

## 16. Team Information, Credits, and Acknowledgements

### 16.1 Team Information
**Team Name:** GeoNeural  
**Hackathon:** LandTech Innovation Hackathon 2026  

| Role | Name | Focus Areas |
|---|---|---|
| **Team Leader** | **Pantho Raj Biswas** | System Architecture, Geospatial Modeling, Leaflet Engine, Data Layer |
| **Team Member** | **Puja Paul** | Frontend Development, UI/UX Design System, Accessibility, Documentation |

**Copyright:** © 2026 GeoNeural. All rights reserved.

### 16.2 Credits and Acknowledgements
The GeoNeural team gratefully acknowledges the open-source community, tools, and resources that made BhumiDorpon possible:
- **Next.js & React Teams:** For the robust web framework and modern App Router foundation.
- **Leaflet & Vladimir Agafonkin:** For the lightweight, flexible mapping library powering all spatial visualizations.
- **Turf.js Community:** For comprehensive client-side geospatial computational geometry tools.
- **Esri:** For providing open access to the World Imagery satellite tile service.
- **Radix UI & Lucide Icons:** For accessible UI primitives and crisp icon assets.
- **Vitest & Playwright Teams:** For high-performance testing frameworks that ensure codebase reliability.
- **LandTech Innovation Hackathon Organizers & Mentors:** For framing the vital challenges of land tenure, climate vulnerability, and digital governance in Bangladesh.

---

## 17. License and Repository Links

### 17.1 License
<!-- TODO: choose license (MIT / Apache-2.0 / all rights reserved) -->
The license for this repository has **not yet been specified**.  
All rights to the source code, design assets, and documentation are reserved by the development team:  
**© 2026 GeoNeural. All rights reserved.**

### 17.2 Repository and Demonstration Links
- **GitHub Repository:** [https://github.com/panthoraj-005/Bhumi-Dorpon.git](https://github.com/panthoraj-005/Bhumi-Dorpon.git)
- **Local Demonstration URL:** `http://localhost:3000` (after running `npm run dev`)
- **Live Production Deployment URL:** *Pending deployment / to be provided upon public cloud hosting.*
<!-- TODO: add live deployment URL before submission -->

---

*This document was prepared with the utmost technical integrity, adhering to the LandTech Innovation Hackathon 2026 Rule Book, Version 1.2.*  
*For questions, academic review, or judging inquiries, please contact Team GeoNeural via the official repository.*
