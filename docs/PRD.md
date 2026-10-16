# Product Requirements Document (PRD) — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Product Specification  
> **Product Version:** 1.1 (Demonstration Prototype)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Testing & QA](TESTING_QA.md)

---

## Table of Contents

- [1. Document Purpose and Scope](#1-document-purpose-and-scope)
  - [1.1 Document Purpose](#11-document-purpose)
  - [1.2 Product Scope](#12-product-scope)
- [2. Product Overview](#2-product-overview)
  - [2.1 Core Pillars](#21-core-pillars)
  - [2.2 Distinction: Implemented Features vs. Future Capabilities](#22-distinction-implemented-features-vs-future-capabilities)
- [3. Problem Statement](#3-problem-statement)
- [4. Product Goals and Measurable Objectives](#4-product-goals-and-measurable-objectives)
  - [4.1 Product Goals](#41-product-goals)
  - [4.2 Measurable Objectives (Current Prototype)](#42-measurable-objectives-current-prototype)
- [5. Target Users and Use Cases](#5-target-users-and-use-cases)
  - [5.1 User Personas](#51-user-personas)
  - [5.2 Key Use Cases](#52-key-use-cases)
- [6. Functional Requirements (FR)](#6-functional-requirements-fr)
  - [6.1 Core System & Dashboard Requirements](#61-core-system--dashboard-requirements)
  - [6.2 Cascading Selector Requirements](#62-cascading-selector-requirements)
  - [6.3 Mapping & Synchronized Comparison Requirements](#63-mapping--synchronized-comparison-requirements)
  - [6.4 Cadastral & Owner Table Requirements](#64-cadastral--owner-table-requirements)
  - [6.5 Google Earth Parcel Outline Feature](#65-google-earth-parcel-outline-feature)
  - [6.6 Five-Hazard Information Store Requirements](#66-five-hazard-information-store-requirements)
- [7. Non-Functional Requirements (NFR)](#7-non-functional-requirements-nfr)
- [8. Five Hazard Modules and Their Requirements](#8-five-hazard-modules-and-their-requirements)
  - [8.1 Module 1: River Erosion (/river-erosion)](#81-module-1-river-erosion-river-erosion)
  - [8.2 Module 2: Flood Monitoring (/flood)](#82-module-2-flood-monitoring-flood)
  - [8.3 Module 3: Landslides (/landslide)](#83-module-3-landslides-landslide)
  - [8.4 Module 4: Char Islands (/char)](#84-module-4-char-islands-char)
  - [8.5 Module 5: Coastal Changes (/coastal)](#85-module-5-coastal-changes-coastal)
- [9. Map Interaction & Cartography Requirements](#9-map-interaction--cartography-requirements)
- [10. Before/After Comparison Requirements](#10-beforeafter-comparison-requirements)
- [11. UI Navigation and Settings Requirements](#11-ui-navigation-and-settings-requirements)
  - [11.1 Main Navigation Sidebar](#111-main-navigation-sidebar)
  - [11.2 Settings Hub & Sub-Pages](#112-settings-hub--sub-pages)
- [12. Data Transparency & Rule 5 Compliance](#12-data-transparency--rule-5-compliance)
- [13. Accessibility and Responsive Design](#13-accessibility-and-responsive-design)
- [14. Constraints and Dependencies](#14-constraints-and-dependencies)
  - [14.1 Technical Constraints](#141-technical-constraints)
  - [14.2 External Dependencies](#142-external-dependencies)
- [15. Assumptions](#15-assumptions)
- [16. Risks and Mitigations](#16-risks-and-mitigations)
- [17. Acceptance Criteria](#17-acceptance-criteria)
- [18. Out-of-Scope Functionality (Current Release)](#18-out-of-scope-functionality-current-release)
- [19. Future Enhancements & Google Earth Engine Integration](#19-future-enhancements--google-earth-engine-integration)

---

## 1. Document Purpose and Scope

### 1.1 Document Purpose
This Product Requirements Document (PRD) establishes the authoritative functional capabilities, user interaction patterns, cartographic standards, and quality criteria for **BhumiDorpon** (ভূমিদর্পণ — *Mirror of the Earth*). It serves as the single product baseline for hackathon evaluation, academic review, and engineering implementation, maintaining a rigorous distinction between verified, currently implemented features and proposed future enhancements.

### 1.2 Product Scope
The scope of the current release (v1.1 Demonstration Prototype) is a fully interactive, frontend-only web application providing cadastral land-change and multi-hazard geospatial visualization for five pilot regions across Bangladesh. The platform operates on a deterministic, synthetic mock JSON store (`public/mocks/*.json` and `mocks/*.json`) through a single data access layer (`lib/data.ts`) with zero external server, database, or live external geospatial API dependencies. Future production capabilities—including live PostgreSQL/PostGIS spatial databases, Google Earth Engine cloud satellite processing, and live deep-learning inference—are documented as planned future enhancements.

---

## 2. Product Overview

BhumiDorpon is an interactive, map-centric dashboard engineered to monitor, analyze, and compare cadastral land changes caused by major environmental hazards in Bangladesh. The platform connects macro-level natural hazard boundaries directly to micro-level land ownership records (Dag and Khatian numbers), providing citizens, surveyors, and relief coordinators with transparent, verifiable spatial insights.

### 2.1 Core Pillars
1. **Five Hazard Domains:** River Erosion, Flood Monitoring, Landslides, Char Island Dynamics, and Coastal Erosion/Accretion.
2. **Synchronized Dual-Map Comparison:** Side-by-side Before and After Leaflet maps with simultaneous pan and zoom synchronization and re-entrancy locks.
3. **Dual-Basemap Offline Cartography:** Interactive toggle between an authoritative Light GIS vector basemap and high-resolution Esri World Imagery satellite tiles, backed by zero external tile server dependencies for core offline rendering.
4. **Micro-Cadastral Precision:** Granular plot geometry featuring strict 4-corner GPS boundary coordinates (NW, NE, SE, SW to 6 decimal places).
5. **3D Visualization Bridge:** One-click "Open in Google Earth" parcel outline export via pure client-side KML 2.2 generation and automated camera positioning.
6. **Data Transparency & Rule 5 Compliance:** Strict separation of historical recorded facts from predictive forecasts, complete suppression of financial disbursement metrics on forecast views, and prominent synthetic mock data disclosures.

### 2.2 Distinction: Implemented Features vs. Future Capabilities

| Dimension | Implemented & Verified in Prototype | Proposed Future Capability (Planned) |
|---|---|---|
| **Mapping Engine** | Pure Leaflet 1.9 with SVG vector rendering; offline Light GIS basemap; Esri satellite toggle. | Vector tile server (Martin/Tippecanoe); Cloud-Optimized GeoTIFFs (COG). |
| **Data Storage** | Deterministic Five-Hazard Information Store (`public/mocks/*.json` and `mocks/*.json`). | PostgreSQL 16 + PostGIS 3.4 spatial database with spatial indexing. |
| **3D & Earth Integration** | **Google Earth (Client-Side):** KML 2.2 export of 4-corner parcels and direct Google Earth Web URL camera launch. | **Google Earth Engine (GEE):** Cloud pipeline for automated Sentinel-1/2 SAR and optical ingestion. |
| **Cadastral Data** | Deterministic mock plots with Dag No., Khatian No., 4-corner coordinates, and simulated ownership. | Live integration with Directorate of Land Records and Surveys (DLRS) e-Mutation API. |
| **AI / Forecasting** | Pre-computed 1-year predictive hazard envelopes generated deterministically via scripts. | Real-time neural network inference (ConvLSTM / U-Net) executed on GPU workers. |
| **Authentication** | Zero-login public dashboard with unrestricted access. | Role-Based Access Control (RBAC) with NextAuth.js and Land Ministry SSO. |

---

## 3. Problem Statement

Bangladesh is the world's largest and most active delta, shaped by the confluence of the Ganges (Padma), Brahmaputra (Jamuna), and Meghna rivers. Rapid territorial alteration from seasonal flooding, riverbank collapse, coastal storm surges, and hill tract landslides constantly reshapes the land. However, citizens and land administrators encounter four critical informational hurdles:

1. **Spatial Opacity:** Official cadastral records (CS, SA, RS, BS surveys) exist on paper or disconnected tabular portals that do not reflect physical environmental shifts.
2. **Lost Ground Boundaries:** Inundations and bankline collapse wash away ground boundary markers (*ails*), precipitating severe, prolonged land disputes once waters recede.
3. **Macro-Micro Disconnect:** Disaster bulletins from hydrological agencies operate at river-basin or district scales and fail to connect to parcel-level Dag and Khatian numbers.
4. **Vulnerability Opacity:** Landowners and local administrators lack accessible, transparent tools to evaluate localized 1-year predictive hazard envelopes alongside historical baseline surveys.

---

## 4. Product Goals and Measurable Objectives

### 4.1 Product Goals
1. Unify five major environmental hazard domains within a single, consistent geospatial dashboard.
2. Connect macro-level natural hazard boundaries directly to micro-level cadastral plots and landowner records.
3. Deliver intuitive, synchronized side-by-side Before/After visual map comparison without requiring desktop GIS installations.
4. Enable seamless 3D spatial verification by bridging 2D cadastral cards with Google Earth.
5. Uphold strict data integrity by enforcing Rule 5 guardrails and transparent mock data labeling.

### 4.2 Measurable Objectives (Current Prototype)
- **Navigation Efficiency:** A user can navigate from the home dashboard to a specific mouza-level hazard result within **30 seconds**.
- **Page Load Performance:** Initial page load and route transitions complete within **3.0 seconds** (including simulated 200–400ms data loading latency).
- **Selector Integrity:** 100% of valid cascading selector paths produce either a rich hazard result or an informative, contextual empty-state screen—never an unhandled exception or blank screen.
- **Cartographic Responsiveness:** Dual map viewports remain synchronized within **16ms (60 fps)** during drag and zoom interactions on modern desktop browsers.
- **Coordinate Precision:** Cadastral boundary readouts provide exactly 4 distinct corners rounded to **6 decimal places** of GPS latitude and longitude in fixed NW, NE, SE, SW order.
- **Automated Verification:** 100% pass rate across all 10 automated test suites (61/61 unit tests) and zero TypeScript compilation errors.

---

## 5. Target Users and Use Cases

### 5.1 User Personas

| Persona | Role & Organization | Primary Goals & Activities | Current Prototype Status |
|---|---|---|---|
| **Land Administration Official** | Assistant Commissioner of Land (AC Land), Kanungo, Upazila Surveyor | Review mouza-level hazard summaries, identify submerged or eroded Dag/Khatian numbers, and estimate compensation liabilities. | Fully supported by existing mock workflows. |
| **Affected Landowner / Citizen** | Rural farmer, homestead owner, community representative | Verify whether specific family plots are submerged or eroded, inspect compensation status, copy 4-corner GPS coordinates, and view plot outlines in Google Earth. | Fully supported by existing mock workflows. |
| **Disaster Response Coordinator** | Upazila Nirbahi Officer (UNO), Disaster Management Committee (UzDMC) | Assess regional hazard exposure, review affected landowner registries, and evaluate 1-year predictive forecast scenarios. | Fully supported by existing mock workflows. |
| **Geospatial Researcher / Student** | Geography, GIS, or Environmental Engineering student/researcher | Inspect riverbank retreat velocities, analyze synthetic DEM slope profiles, and study char island accretion morphodynamics. | Fully supported by existing mock workflows. |

### 5.2 Key Use Cases
- **UC-01: Explore River Erosion Loss** — User navigates `/river-erosion` &rarr; Sirajganj &rarr; Kazipur &rarr; Jamuna &rarr; Mouza Khanshama &rarr; inspects bankline retreat transects and landowner compensation table.
- **UC-02: Inspect Flood Inundation & Plot Coordinates** — User navigates `/flood` &rarr; Sylhet &rarr; Gowainghat &rarr; Jaflong &rarr; selects 2024 Monsoon Flood &rarr; drills down into individual landowner page &rarr; copies 4-corner coordinates.
- **UC-03: Export Parcel to Google Earth** — On Flood Owner Land Detail page, user clicks "Open in Google Earth" &rarr; downloads `.kml` file &rarr; Google Earth Web opens centered on parcel &rarr; user imports KML to verify 3D parcel geometry.
- **UC-04: Analyze Landslide Susceptibility** — User navigates `/landslide` &rarr; Rangamati &rarr; Kawkhali &rarr; Ghagra hill &rarr; inspects synthetic DEM hillshade, contour isolines, and debris runout risk buffer.
- **UC-05: Evaluate Char Island Accretion** — User navigates `/char` &rarr; Sirajganj &rarr; Kazipur &rarr; Char Girish &rarr; examines green accretion tips vs. coral erosion flanks and reviews unowned state khas land.
- **UC-06: Monitor Coastal Mudflat Accretion** — User navigates `/coastal` &rarr; Bhola &rarr; Monpura &rarr; reviews marine shoreline retreat and unassigned offshore mudflats for state revenue tracking.

---

## 6. Functional Requirements (FR)

### 6.1 Core System & Dashboard Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-001** | **National Summary Dashboard:** Display aggregated KPI cards for total land loss, total new land gained, affected landowners, and compensation liabilities. | High | **Implemented** | Aggregates dynamically across active mock datasets; reflects selected area unit (Decimal/Acre/Ha). |
| **FR-002** | **Recorded vs. Forecast Mode Switch:** Provide a top-level toggle between observed historical data (`Recorded`) and 1-year predictive projections (`Forecast`). | High | **Implemented** | In Forecast mode, compensation disbursement fields (`Paid`, `Approved`, `Pending`) are strictly omitted; disclaimer is enforced. |
| **FR-003** | **Trend & Distribution Charts:** Render multi-year land-change line charts, hazard distribution bar charts, and top-affected district rankings. | Medium | **Implemented** | Interactive Recharts components with accessible hover tooltips and tabular fallbacks. |
| **FR-004** | **Area Unit Conversion:** Provide global unit switcher supporting Decimal (default), Acre, and Hectare. | High | **Implemented** | All figures and table columns convert dynamically based on official standard ratios ($1\text{ Acre} = 100\text{ Decimals}$, $1\text{ Ha} = 247.10538\text{ Decimals}$). |

### 6.2 Cascading Selector Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-005** | **Dependent Selector Chain:** Provide cascading dropdowns (District &rarr; Upazila &rarr; River/Hill/Mouza &rarr; Result). | High | **Implemented** | Child dropdowns remain disabled until parent selection is made; changing parent resets child state. |
| **FR-006** | **Record Indicator Chips:** Mark options that have associated hazard records with visual indicator badges (`hasRecords = true`). | Medium | **Implemented** | Dropdown items indicate whether demo data is available. |
| **FR-007** | **URL State Persistence:** Synchronize active selection parameters (e.g., `?d=&u=&r=`) with URL search parameters. | Medium | **Implemented** | Refreshing the browser preserves the active selection state. |
| **FR-008** | **Deterministic Empty States:** Render contextual empty-state views with clear messaging whenever a selected area has no hazard records. | High | **Implemented** | Never display a blank screen or uncaught JavaScript error. |

### 6.3 Mapping & Synchronized Comparison Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-009** | **Side-by-Side Map Comparison:** Render synchronized Before and After Leaflet maps side-by-side on desktop viewports ($\ge 1024\text{px}$). | High | **Implemented** | Before map is on the left; After map is on the right. Panning or zooming either view immediately updates the other. |
| **FR-010** | **Direct Zoom Controls:** Visible `+` and `−` zoom buttons on map chrome that operate on the very first click. | High | **Implemented** | Directly invokes Leaflet `zoomIn()` / `zoomOut()` without requiring tool activation or second click. |
| **FR-011** | **Basemap Switching:** Provide toggle between `Light GIS` (synthetic vector) and `Satellite` (Esri World Imagery) basemaps. | High | **Implemented** | Switching basemap preserves current zoom, center, bounding box, active overlays, and selected result. |
| **FR-012** | **Demo Geometry Notice:** Display persistent banner *"Demo geometry — not survey-accurate"* whenever Satellite basemap is active. | High | **Implemented** | Notice appears prominently in map chrome without obstructing controls. |
| **FR-013** | **Regional Extent Framing:** Automatically fit map viewport to the authentic geographic bounding box of the selected hazard. | High | **Implemented** | River erosion fits Kazipur corridor; landslides fit Rangamati; floods fit Tahirpur/Jaflong. |

### 6.4 Cadastral & Owner Table Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-014** | **Mandatory Cadastral Identifiers:** Every owner record must display verified Dag No. and Khatian No. identifiers. | High | **Implemented** | Missing Dag or Khatian values are treated as data integrity violations. |
| **FR-015** | **Owner Table Filtering & Sorting:** Support text search by owner name or Dag No., and sorting by area and compensation. | Medium | **Implemented** | Instant client-side search and multi-column sorting. |
| **FR-016** | **CSV Data Export:** Enable single-click CSV export of all affected owner records. | Medium | **Implemented** | Generates standard UTF-8 CSV containing all visible table columns. |
| **FR-017** | **Four-Corner GPS Readout:** Every plot on the Flood Owner Land Detail page displays exactly 4 distinct corners ordered NW, NE, SE, SW to 6 decimal places. | High | **Implemented** | Centroid is suppressed; copy buttons provide single-click clipboard export. |

### 6.5 Google Earth Parcel Outline Feature
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-018** | **Open in Google Earth Button:** Render full-width emerald button with Globe icon on `/flood/[mouzaId]/[floodId]/owner/[ownerId]` directly below the coordinate table. | High | **Implemented** | Clicking button does not toggle or select the parent card (`stopPropagation()` enforced). |
| **FR-019** | **Synchronous KML Download:** Clicking button generates and downloads a valid KML 2.2 file (`<floodId>_dag_<dagNo>_outline.kml`). | High | **Implemented** | KML contains closed 5-point polygon, 4 corner Placemarks, XML-escaped metadata, and demo disclaimers. |
| **FR-020** | **Synchronous Web Launch:** Simultaneously opens Google Earth Web in a new tab centered on parcel coordinates. | High | **Implemented** | URL format: `https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`. Opened synchronously to satisfy browser popup policies. |
| **FR-021** | **On-Screen Import Guidance:** Display persistent toast hint for ~12 seconds instructing user how to load KML in Google Earth. | High | **Implemented** | Reads: *"In Google Earth choose New → Open local KML file and select the downloaded file to display the parcel outline (Earth Pro: double-click the file)"*. |

### 6.6 Five-Hazard Information Store Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-022** | **Deterministic Hazard Store:** Store all data for the 5 hazards in static JSON stores (`public/mocks/*.json` and `mocks/*.json`). | High | **Implemented** | Zero database required; 100% reproducible via `npm run generate:mocks`. |
| **FR-023** | **Unified Data Layer Access:** UI components access all data strictly via `lib/data.ts`; direct raw `fetch()` calls from components are prohibited. | High | **Implemented** | Encapsulates caching, simulated latency, and typed responses. |
| **FR-024** | **Single Source of Truth:** Four-corner parcel coordinates in the hazard store serve as the sole source for UI tables, copy buttons, GeoJSON export, and KML outlines. | High | **Implemented** | Verified by `tests/four_corners_geometry.test.ts` and `tests/google_earth_kml.test.ts`. |

---

## 7. Non-Functional Requirements (NFR)

| ID | Category | Requirement Description | Target Metric | Status |
|---|---|---|---|---|
| **NFR-001** | **Performance** | Client-side query latency and component rendering time. | p95 query latency < 400ms; LCP < 2.5s | **Verified** |
| **NFR-002** | **Responsiveness** | Fluid layout across desktop ($\ge 1280\text{px}$), tablet ($768\text{px} - 1279\text{px}$), and mobile ($< 768\text{px}$). | Zero horizontal scroll; maps stack cleanly on mobile | **Verified** |
| **NFR-003** | **Accessibility** | Color contrast, keyboard focus rings, and screen-reader alternatives. | WCAG 2.1 Level AA compliance; color never sole indicator | **Verified** |
| **NFR-004** | **Reliability** | Fallback behavior when external tile providers are unreachable. | Reverts to Light GIS basemap; non-blocking notification | **Verified** |
| **NFR-005** | **Data Reproducibility** | Deterministic regeneration of mock datasets across test runs. | Seeded script generates identical JSON hashes every run | **Verified** |
| **NFR-006** | **Privacy & Security** | Zero transmission of private landowner credentials or personal identities. | Pure client-side KML export; all identities fictional | **Verified** |

---

## 8. Five Hazard Modules and Their Requirements

### 8.1 Module 1: River Erosion (`/river-erosion`)
- **Route Segments:** `/river-erosion`, `/river-erosion/[mode]`, and `/river-erosion/[mode]/[mouzaId]`
- **Selector Path:** District &rarr; Upazila &rarr; River &rarr; Riverside Mouzas &rarr; Detailed Mouza View.
- **Specific Layers:** Surveyed baseline bankline, current/projected bankline, erosion loss strip polygon (coral hatch `pattern-loss`), transect retreat markers (meters).
- **Summary Panels:** Mouza-wise summary panel, Water Status card (river width, erosion velocity).
- **Owner Table:** Owner Name, Dag No., Khatian No., Lost Area, Estimated Compensation, Status, Paid Amount (Recorded mode only).

### 8.2 Module 2: Flood Monitoring (`/flood`)
- **Route Segments:** `/flood`, `/flood/[mouzaId]/[floodId]`, and `/flood/[mouzaId]/[floodId]/owner/[ownerId]`
- **Selector Path:** District &rarr; Upazila &rarr; Mouza (+ Year chip filter).
- **Specific Layers:** Multi-depth flood contours (Shallow `<0.5m`, Moderate `0.5–1.5m`, Deep `>1.5m`), drainage channels, water bodies (*beels*), submerged parcel boundaries color-coded by owner.
- **Dedicated Owner Land Page:** Displays all owned plots, submersion status, **explicit 4-corner GPS boundary coordinates (NW, NE, SE, SW to 6 decimals)**, one-click copy buttons, GeoJSON export, and **Open in Google Earth** button.

### 8.3 Module 3: Landslides (`/landslide`)
- **Route Segments:** `/landslide`, `/landslide/[mode]`, and `/landslide/[mode]/[eventId]`
- **Selector Path:** District &rarr; Upazila &rarr; Hill Corridor &rarr; Event Selection.
- **Specific Layers:** Synthetic DEM hillshade overlay, 10m contour isolines, spot elevation markers, failure scarp polygons (red), debris runout risk buffers (orange).
- **Specific Metrics:** Displaced soil volume ($m^3$), slope angle ($38^\circ$–$44^\circ$), trigger rainfall (mm/24h), and Terrain Context panel.

### 8.4 Module 4: Char Islands (`/char`)
- **Route Segments:** `/char`, `/char/[mode]`, and `/char/[mode]/[resultId]`
- **Selector Path:** District &rarr; Upazila &rarr; River &rarr; Char Island &rarr; Detailed Result.
- **Specific Layers:** Baseline island boundary, current island boundary, downstream accretion tips (green), flanking erosion zones (coral), river channels.
- **Dedicated Unowned Land Card:** Displays unowned `State Khas Alluvial Accretion` under deed `1/1 (State)` with total accreted area metrics.

### 8.5 Module 5: Coastal Changes (`/coastal`)
- **Route Segments:** `/coastal`, `/coastal/[mode]`, and `/coastal/[mode]/[resultId]`
- **Selector Path:** District &rarr; Upazila &rarr; Mouza (including virtual unassigned entries).
- **Specific Layers:** Historical shoreline, current shoreline, coastal embankment lines, intertidal mudflats, marine depth contours.
- **Dedicated Unassigned Mudflats Card:** Catalogs emerging intertidal land blocks seaward of established mouzas for state land revenue tracking.

---

## 9. Map Interaction & Cartography Requirements

1. **Synchronous Viewports:** Panning or zooming Map A must update Map B within the same animation frame. Listener loops must be guarded by mutual update flags (`isSyncing`).
2. **Immediate Zoom Execution:** Clicks on `+` or `−` buttons must immediately call Leaflet's `zoomIn()` or `zoomOut()`. No intermediate activation state or tool selection is permitted.
3. **Cartographic Chrome:** Each map must feature a visible north arrow, dynamic graphic scale bar (metric), coordinate readout box, and layer control toggle.
4. **Basemap Independence:** Switching between Light GIS, Satellite, or Street basemaps must never reinitialize the viewport, clear thematic overlays, or deselect active features.
5. **Overlay Stacking Order:** Maintain strict Leaflet pane z-indices:
   - Basemap Tiles: `waterPane` ($z = 250$)
   - Secondary GIS Features (roads, water): `plotsPane` ($z = 300$)
   - Hazard Polygons (floods, erosion strips, scars): `hazardPane` ($z = 350$)
   - Labels and Chrome: `labelsPane` ($z = 450$)
   - Markers and Interactive Pins: `markersPane` ($z = 500$)

---

## 10. Before/After Comparison Requirements

- **Primary Layout:** Side-by-side grid (50% / 50% split on desktop viewports $\ge 1024\text{px}$).
- **Mobile Fallback:** Single-column vertical stack (Before on top, After on bottom on viewports $< 1024\text{px}$).
- **Removal of Draggable Divider:** The legacy draggable swipe/divider bar is replaced by default with unhindered, simultaneous side-by-side inspection.
- **Supporting Information Placement:** All context panels, mouza summaries, water status cards, and owner tables must reside strictly **below** the complete map pair.

---

## 11. UI Navigation and Settings Requirements

### 11.1 Main Navigation Sidebar
- Fixed 72px left-hand icon sidebar with accessible tooltips on hover.
- Navigation links:
  - Dashboard (`/`)
  - River Erosion (`/river-erosion`)
  - Flood Monitoring (`/flood`)
  - Landslides (`/landslide`)
  - Char Islands (`/char`)
  - Coastal Changes (`/coastal`)
  - Settings (`/settings`)

### 11.2 Settings Hub & Sub-Pages
- The Settings view (`/settings`) provides access to **exactly two verified sub-pages**:
  1. **About Project (`/settings/about`):** Authoritative explanation of BhumiDorpon's purpose, the five hazard modules, map comparison mechanics, dual basemaps, and data transparency notices.
  2. **Team Information (`/settings/team`):** Official development team metadata:
     - **Team Name:** GeoNeural
     - **Team Leader:** Pantho Raj Biswas
     - **Team Member:** Puja Paul
     - **Copyright:** © 2026 GeoNeural. All rights reserved.
- No other unverified settings options (e.g., billing, theme editors, user accounts) are permitted.

---

## 12. Data Transparency & Rule 5 Compliance

1. **Sticky Demo Banner:** A persistent amber banner must remain visible across the top of all pages: *"Demo data: all names, plots and figures are fictional."*
2. **Forecast Honesty Notice:** All forecast views must conclude with the disclaimer: *"This is a model-based estimate, not an official government record."*
3. **Rule 5 Compliance (Strict Financial Suppression):** In `forecast` mode, all financial disbursement metrics (`paidBDT`, `approvedBDT`, `pendingBDT`) are strictly removed from dashboard cards, summary panels, and owner tables. Only `projectedCompensationBDT` is displayed.
4. **Semantic Metric Formatting:**
   - Losses: Prefix with minus sign (`−`) and format in coral tones (`#EF4444`).
   - Gains: Prefix with plus sign (`+`) and format in green tones (`#10B981`).
   - Projections: Prefix with tilde (`∼`) and render with dashed borders/lines (`#8B5CF6`).
5. **Currency Display:** Monetary compensation figures must use the Bangladeshi Taka symbol (`৳`) with standard South Asian comma groupings (e.g., `৳2,50,000`).

---

## 13. Accessibility and Responsive Design

- **Keyboard Traversal:** All interactive controls, dropdown selectors, table rows, and map buttons must be accessible via `Tab`, `Enter`, `Escape`, and arrow keys.
- **Screen Reader Support:** Complex SVG visualizations and Leaflet maps must provide hidden, collapsible data table alternatives and `aria-live` status announcements.
- **Color Independence:** Visual indicators must never rely solely on color; textual labels, icons, or mathematical signs (`+` / `−`) must accompany all status badges.
- **Responsive Viewport Tiers:**
  - Desktop ($> 1280\text{px}$): Full 12-column dashboard layout with side-by-side maps.
  - Tablet ($768\text{px} - 1279\text{px}$): 2-column stacked metric cards with adapted map heights.
  - Mobile ($< 768\text{px}$): Single-column stacked cards, vertically stacked Before/After maps, and horizontally scrolling data tables.

---

## 14. Constraints and Dependencies

### 14.1 Technical Constraints
- **Client-Side Execution:** The application executes entirely within modern web browsers without requiring local server processes or database daemons.
- **Pure JavaScript Mapping:** Mapping and spatial operations use pure JavaScript/TypeScript libraries (Leaflet, Turf.js) that compile cleanly via Next.js without native C++ addons.
- **Memory Ceiling:** Production builds compile within Node.js memory limits (`--max-old-space-size=1536`).

### 14.2 External Dependencies
- **Esri World Imagery:** Requires public HTTPS internet access to fetch satellite raster tiles when Satellite basemap is toggled.
- **OpenStreetMap:** Optional street basemap tile provider.
- **Google Fonts:** Inter and Space Grotesk typefaces.
- **Google Earth Web:** External browser target for 3D parcel inspection (`https://earth.google.com/web`).

---

## 15. Assumptions

1. Target users possess modern web browsers (Chrome 110+, Firefox 110+, Safari 16+, Edge 110+) with JavaScript and Canvas enabled.
2. Users understand basic administrative hierarchies in Bangladesh (District &rarr; Upazila &rarr; Mouza).
3. The demonstration prototype is intended for academic evaluation, hackathon judging, and architectural validation rather than live operational disaster dispatch.

---

## 16. Risks and Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Privacy Violation of Landowners** | High | Use strictly fictional, synthetically generated names and plot records. |
| **Misinterpretation of Forecasts as Fact** | High | Suppress financial disbursement fields in Forecast mode (Rule 5); enforce persistent disclaimers. |
| **External Tile Service Outage** | Medium | Maintain the synthetic Light GIS basemap as a zero-network default and automatic fallback. |
| **Misalignment of Mock Plots with Imagery** | Medium | Display persistent notice *"Demo geometry — not survey-accurate"* whenever satellite imagery is active. |

---

## 17. Acceptance Criteria

A build of BhumiDorpon meets this PRD's acceptance criteria if and only if:
1. All five hazard modules navigate correctly from selector to detailed map views.
2. Side-by-side maps render Before on left and After on right on desktop, with synchronized pan and zoom.
3. Zoom buttons invoke Leaflet zoom on the very first click.
4. Basemap switching seamlessly toggles between Light GIS and Satellite without resetting viewports or overlays.
5. Flood Owner Land Page renders all owned plots with explicit 4-corner GPS coordinates (NW, NE, SE, SW to 6 decimals).
6. "Open in Google Earth" button downloads valid KML 2.2 and launches Google Earth web centered on parcel.
7. Settings view presents exactly About Project and Team Information pages with exact team metadata.
8. All 10 automated test suites (61 unit tests) pass cleanly (`npm test`).
9. TypeScript typecheck compiles with zero errors (`npx tsc --noEmit`).

---

## 18. Out-of-Scope Functionality (Current Release)

The following capabilities are **explicitly out-of-scope** for the v1.1 demonstration release:
- Live database persistence (PostgreSQL / PostGIS).
- Backend API endpoints or server-side authentication (FastAPI / Express).
- User registration, login, role-based permissions, or password management.
- Live submission or processing of government compensation applications.
- Real-time satellite imagery ingestion or live deep-learning model inference.
- Multi-language localization (the application is English-only).
- Mobile native application wrappers (iOS / Android).

---

## 19. Future Enhancements & Google Earth Engine Integration

1. **Production Spatial Backend:** Transition `lib/data.ts` to a high-performance FastAPI and PostgreSQL 16 + PostGIS spatial backend.
2. **Google Earth Engine (GEE) Ingestion Pipeline:** Integrate automated Sentinel-1 SAR (flood mapping) and Sentinel-2 / Landsat optical (riverbank retreat) cloud pipelines via Google Earth Engine Python API or Copernicus Hub.
3. **Deep Learning Prediction Engine:** Deploy spatiotemporal neural networks (ConvLSTM / U-Net) to generate verified 1-year riverbank retreat forecasts.
4. **Government System Integration:** Connect to official land ministry registries (e-Mutation / e-Porcha) under strict institutional data-sharing agreements.
5. **Bilingual Localization:** Add full Bengali language localization across all UI elements, maps, and reports.
