# Product Requirements Document (PRD) — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Hazard Dashboard**

---

> **Document Status:** Authoritative Product Specification  
> **Product Version:** 1.1 (Demonstration Prototype)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/MAIN-PROJECT-DOCUMENTATION.md) | [TRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/trd.md) | [App Flow & User Flow](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/app-flow-user-flow.md) | [System Architecture](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/system-architecture.md)

---

## 1. Document Purpose and Scope

### 1.1 Document Purpose
This Product Requirements Document (PRD) defines the functional capabilities, technical constraints, user interaction patterns, and quality criteria for **BhumiDorpon**. It establishes the product baseline for evaluating hackathon submissions, academic reviews, and engineering implementations, while clearly delineating between verified, currently implemented features and future enhancements.

### 1.2 Product Scope
The scope of the current release (v1.1 Demo) is an interactive, frontend-only web application providing cadastral land-change and hazard visualization for five pilot regions across Bangladesh. The system operates on deterministic, synthetic demonstration datasets in `/mocks` with no external server or live database dependencies. Future production capabilities (e.g., PostGIS spatial storage, live satellite pipelines, and neural network inference engines) are documented as planned enhancements.

---

## 2. Product Overview

BhumiDorpon is an interactive, map-centric dashboard designed to monitor and compare land changes caused by environmental hazards in Bangladesh. The platform unifies parcel-level cadastral boundary data (Dag and Khatian numbers), historical damage records, and predictive hazard forecasts within an accessible, responsive light-mode user interface.

### 2.1 Core Pillars
1. **Five Hazard Domains:** River Erosion, Flood Monitoring, Landslides, Char Dynamics, and Coastal Changes.
2. **Synchronized Map Comparison:** Side-by-side Before/After Leaflet maps with simultaneous pan and zoom synchronization.
3. **Dual Basemap Cartography:** Toggle between an authoritative Light GIS vector basemap and high-resolution Esri World Imagery satellite tiles.
4. **Micro-Cadastral Resolution:** Detailed plot information including explicit 4-corner GPS boundary coordinates (NW, NE, SE, SW to 6 decimal places).
5. **Absolute Data Transparency:** Strict separation of observed historical facts from predictive forecasts, with clear mock data disclaimers.

---

## 3. Problem Statement

Bangladesh's deltaic landscape undergoes rapid territorial alteration due to monsoon flooding, riverbank collapse, coastal tidal forces, and hilly slope failures. However, citizens, local land administration officers (AC Land, Surveyors), and disaster response planners face critical informational hurdles:
- **Spatial Opacity:** Official cadastral records (CS, SA, RS, BS surveys) exist on paper or disconnected tabular portals that do not reflect physical environmental shifts.
- **Lost Boundaries:** Inundations and floods wash away ground boundary markers (*ails*), creating severe land tenure disputes once waters recede.
- **Fragmented Data:** Disaster warnings from hydrological agencies operate at river-basin levels and fail to connect to cadastral plot numbers.
- **Unverified Projections:** Citizens and administrators lack accessible tools to evaluate localized 1-year predictive vulnerability models alongside historical baseline maps.

---

## 4. Product Goals and Measurable Objectives

### 4.1 Product Goals
1. Provide a single unified platform to explore five major environmental hazards in Bangladesh.
2. Connect macro-level disaster events directly to micro-level cadastral plots and deed identifiers.
3. Deliver intuitive, synchronized side-by-side visual map comparison without requiring complex desktop GIS software.
4. Transparently communicate data provenance, compensation accounting, and forecast uncertainty.

### 4.2 Measurable Objectives (Current Prototype)
- **Navigation Efficiency:** A user can navigate from the home dashboard to a specific mouza-level hazard result within **30 seconds**.
- **Page Load Performance:** Initial page load and navigation transitions complete within **3.0 seconds** (including simulated 200–400ms data loading latency).
- **Selector Integrity:** 100% of valid cascading selector paths produce either a rich hazard result or an explicit, informative empty-state screen—never an unhandled exception or blank screen.
- **Cartographic Responsiveness:** Dual map viewports remain synchronized within **16ms (60 fps)** during drag and zoom interactions on modern desktop browsers.
- **Coordinate Precision:** Cadastral boundary readouts provide exactly 4 distinct corners rounded to **6 decimal places** of GPS latitude and longitude.

---

## 5. Target Users and Use Cases

### 5.1 User Personas
| Persona | Role | Primary Goals | Current Status |
|---|---|---|---|
| **Land Administration Official** | AC Land, Kanungo, Upazila Surveyor | Review mouza-level damage summaries, identify affected Dag/Khatian numbers, and calculate compensation liabilities. | Supported by existing mock workflows. |
| **Affected Landowner / Citizen** | Rural farmer, homestead owner | Verify whether specific plots are submerged or eroded, inspect compensation status, and copy 4-corner GPS boundary coordinates. | Supported by existing mock workflows. |
| **Disaster Response Coordinator** | UNO, Disaster Management Officer | Assess regional vulnerability, review affected owner registries, and evaluate 1-year forecast scenarios. | Supported by existing mock workflows. |
| **Academic Researcher / Student** | Geography, GIS, or Environmental student | Inspect riverbank retreat velocities, analyze DEM slope profiles, and study char morphodynamics. | Supported by existing mock workflows. |

### 5.2 Key Use Cases
- **UC-01: Explore River Erosion Loss** — User navigates `/river-erosion` &rarr; Sirajganj &rarr; Kazipur &rarr; Jamuna &rarr; Mouza Khanshama &rarr; inspects bank retreat transects and owner compensation table.
- **UC-02: Inspect Flood Inundation & Plot Coordinates** — User navigates `/flood` &rarr; Sylhet &rarr; Gowainghat &rarr; Jaflong &rarr; selects 2024 flood event &rarr; drills down into individual owner land page &rarr; copies 4-corner coordinates.
- **UC-03: Analyze Landslide Susceptibility** — User navigates `/landslide` &rarr; Rangamati &rarr; Kawkhali &rarr; Ghagra hill &rarr; inspects synthetic DEM hillshade, contour isolines, and debris runout buffer.
- **UC-04: Evaluate Char Island Accretion** — User navigates `/char` &rarr; Sirajganj &rarr; Kazipur &rarr; Char Girish &rarr; examines green accretion tips vs. coral erosion flanks and reviews state khas land.
- **UC-05: Monitor Coastal Mudflat Accretion** — User navigates `/coastal` &rarr; Bhola &rarr; Monpura &rarr; reviews marine shoreline retreat and unassigned mudflats.

---

## 6. Functional Requirements (FR)

### 6.1 Core System & Dashboard Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-001** | **National Summary Dashboard:** Display aggregated KPI cards for total land loss, total new land gained, affected landowners, and compensation liabilities. | High | **Implemented** | Aggregates dynamically across active mock datasets; reflects selected area unit (Decimal/Acre/Ha). |
| **FR-002** | **Recorded vs. Forecast Mode Switch:** Provide a top-level toggle between observed historical data (`Recorded`) and 1-year predictive projections (`Forecast`). | High | **Implemented** | When in Forecast mode, compensation status fields (`Paid`, `Approved`, `Pending`) are strictly omitted; disclaimer is enforced. |
| **FR-003** | **Trend & Distribution Charts:** Render multi-year land-change line charts, hazard distribution bar charts, and top-affected district rankings. | Medium | **Implemented** | Interactive Recharts components with accessible hover tooltips and tabular fallbacks. |
| **FR-004** | **Area Unit Conversion:** Provide global unit switcher supporting Decimal (default), Acre, and Hectare. | High | **Implemented** | All figures and table columns convert dynamically based on official standard ratios ($1\text{ Acre} = 100\text{ Decimals}$, $1\text{ Ha} = 247.10538\text{ Decimals}$). |

### 6.2 Cascading Selector Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-005** | **Dependent Selector Chain:** Provide cascading dropdowns (District &rarr; Upazila &rarr; River/Hill/Mouza &rarr; Result). | High | **Implemented** | Child dropdowns remain disabled until parent selection is made; changing parent resets child state. |
| **FR-006** | **Record Indicator Chips:** Mark options that have associated hazard records with visual indicator badges (`hasRecords = true`). | Medium | **Implemented** | Dropdown items indicate whether demo data is available. |
| **FR-007** | **URL State Persistence:** Synchronize active selection parameters (e.g., `?d=&u=&r=`) with URL search parameters. | Medium | **Implemented** | Refreshing the browser preserves the active selection state. |
| **FR-008** | **Deterministic Empty States:** Render contextual empty-state views with clear messaging whenever a selected area has no hazard records. | High | **Implemented** | Never display a blank screen or uncaught JavaScript error. |

### 6.3 Mapping & Comparison Requirements
| ID | Requirement Description | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|
| **FR-009** | **Side-by-Side Map Comparison:** Render synchronized Before and After Leaflet maps side-by-side on desktop viewports. | High | **Implemented** | Before map is on the left; After map is on the right. Panning or zooming either view immediately updates the other. |
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

---

## 7. Non-Functional Requirements (NFR)

| ID | Category | Requirement Description | Target Metric | Status |
|---|---|---|---|---|
| **NFR-001** | **Performance** | Simulated API latency and component rendering time. | p95 latency < 500ms; LCP < 3.0s | **Verified** |
| **NFR-002** | **Responsiveness** | Responsive layout across desktop (1440px), tablet (1024px), and mobile (390px). | Zero horizontal overflow; maps stack gracefully on mobile | **Verified** |
| **NFR-003** | **Accessibility** | Color contrast, keyboard focus rings, and screen-reader alternatives. | WCAG 2.1 Level AA compliance; color never sole carrier of meaning | **Verified** |
| **NFR-004** | **Reliability** | Safe fallback when external satellite tile providers are unreachable. | Reverts to Light GIS basemap; displays non-blocking toast warning | **Verified** |
| **NFR-005** | **Data Integrity** | Strict deterministic reproduction of mock datasets across test runs. | Seeded script generates identical JSON hashes every run | **Verified** |
| **NFR-006** | **Security** | Zero hard-coded API secret keys or private landowner credentials. | Public client-safe tile URLs only; all identities fictional | **Verified** |

---

## 8. Five Hazard Modules and Their Requirements

### 8.1 Module 1: River Erosion (`/river-erosion`)
- **Route Structure:** `/river-erosion/[mode]` and `/river-erosion/[mode]/[mouzaId]`
- **Selector Path:** District &rarr; Upazila &rarr; River &rarr; Riverside Mouzas &rarr; Detailed Mouza View.
- **Specific Layers:** Surveyed baseline bankline, current/projected bankline, erosion loss strip polygon, transect distance markers (meters).
- **Summary Panels:** Mouza-wise summary panel, Water Status card (river width, erosion velocity).
- **Owner Table:** Owner Name, Dag No., Khatian No., Lost Area, Estimated Compensation, Status, Paid Amount (Recorded mode only).

### 8.2 Module 2: Flood Monitoring (`/flood`)
- **Route Structure:** `/flood`, `/flood/[mouzaId]/[floodId]`, and `/flood/[mouzaId]/[floodId]/owner/[ownerId]`
- **Selector Path:** District &rarr; Upazila &rarr; Mouza (+ Year chip filter).
- **Specific Layers:** Multi-depth flood contours (Shallow `<0.5m`, Moderate `0.5–1.5m`, Deep `>1.5m`), drainage channels, water bodies (*beels*), submerged parcel boundaries color-coded by owner.
- **Dedicated Owner Page:** Displays all owned plots, submersion status, and **explicit 4-corner boundary coordinates (Corner 1 NW, 2 NE, 3 SE, 4 SW to 6 decimal places)**. Actions include "Copy 4 Corners", "Copy All Coordinates", and "Download GeoJSON".

### 8.3 Module 3: Landslides (`/landslide`)
- **Route Structure:** `/landslide/[mode]` and `/landslide/[mode]/[eventId]`
- **Selector Path:** District &rarr; Upazila &rarr; Hill Corridor &rarr; Event Selection.
- **Specific Layers:** Synthetic DEM hillshade overlay, 10m contour isolines, spot elevation markers, failure scarp polygons (red), debris runout risk buffers (orange).
- **Specific Metrics:** Displaced soil volume ($m^3$), slope angle ($38^\circ$–$44^\circ$), trigger rainfall (mm/24h), and Terrain Context panel.

### 8.4 Module 4: Char Islands (`/char`)
- **Route Structure:** `/char/[mode]` and `/char/[mode]/[resultId]`
- **Selector Path:** District &rarr; Upazila &rarr; River &rarr; Char Island &rarr; Detailed Result.
- **Specific Layers:** Baseline island boundary, current island boundary, downstream accretion tips (green), flanking erosion zones (coral), river channels.
- **Dedicated Unowned Land Card:** Displays unowned `State Khas Alluvial Accretion` under deed `1/1 (State)` with total accreted area metrics.

### 8.5 Module 5: Coastal Erosion & Accretion (`/coastal`)
- **Route Structure:** `/coastal/[mode]` and `/coastal/[mode]/[resultId]`
- **Selector Path:** District &rarr; Upazila &rarr; Mouza (including virtual unassigned entries).
- **Specific Layers:** Historical shoreline, current shoreline, coastal embankment lines, intertidal mudflats, marine depth contours.
- **Dedicated Unassigned Mudflats Card:** Catalogs emerging intertidal land blocks seaward of established mouzas for state land revenue tracking.

---

## 9. Map Interaction Requirements

1. **Synchronous Viewports:** Panning or zooming Map A must update Map B within the same animation frame. Listener loops must be guarded by mutual update flags.
2. **Immediate Zoom Execution:** Clicks on `+` or `−` buttons must immediately call Leaflet's `zoomIn()` or `zoomOut()`. No intermediate activation state or tool selection is permitted.
3. **Cartographic Chrome:** Each map must feature a visible north arrow, dynamic graphic scale bar (metric), coordinate readout box, and layer control toggle.
4. **Basemap Independence:** Switching between Light GIS, Satellite, or Street basemaps must never reinitialize the viewport, clear thematic overlays, or deselect active features.
5. **Overlay Stacking Order:** Maintain strict Leaflet pane z-indexes:
   - Basemap Tiles: `pane-basemap` ($z = 200$)
   - Secondary GIS Features (roads, water): `pane-features` ($z = 300$)
   - Hazard Polygons (floods, erosion strips, scars): `pane-hazards` ($z = 400$)
   - Cadastral Parcels: `pane-plots` ($z = 500$)
   - Labels and Chrome: `pane-labels` ($z = 600$)

---

## 10. Before/After Comparison Requirements

- **Primary Layout:** Side-by-side grid (50% / 50% split on desktop viewports $\ge 1024\text{px}$).
- **Mobile Fallback:** Single-column vertical stack (Before on top, After on bottom on viewports $< 1024\text{px}$).
- **Removal of Draggable Divider:** The legacy draggable swipe/divider bar is completely removed from the default workflow in favor of unhindered, simultaneous side-by-side inspection.
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

## 12. Data Presentation and Labeling Requirements

1. **Sticky Demo Banner:** A persistent amber banner must remain visible across the top of all pages: *"Demo data: all names, plots and figures are fictional."*
2. **Forecast Honesty Notice:** All forecast views must conclude with the disclaimer: *"This is a model-based estimate, not an official government record."*
3. **Semantic Metric Formatting:**
   - Losses: Prefix with minus sign (`−`) and format in coral tones (`#E4604A`).
   - Gains: Prefix with plus sign (`+`) and format in green tones (`#2F9E62`).
   - Projections: Prefix with tilde (`∼`) and render with dashed borders/lines (`#6A5BD6`).
4. **Currency Display:** Monetary compensation figures must use the Bangladeshi Taka symbol (`৳`) with standard comma groupings (e.g., `৳2,50,000`).

---

## 13. Accessibility and Responsive Design Expectations

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
- **Client-Side Execution:** The application must execute entirely within modern web browsers without requiring local server processes or database daemons.
- **No Native Modules:** Mapping and spatial operations must use pure JavaScript/TypeScript libraries (Leaflet, Turf.js) that compile cleanly via Next.js.
- **Memory Ceiling:** Production builds must compile within Node.js memory limits (`--max-old-space-size=1536`).

### 14.2 External Dependencies
- **Esri World Imagery:** Requires public HTTPS internet access to fetch satellite raster tiles.
- **OpenStreetMap:** Optional street basemap tile provider.
- **Google Fonts:** Inter and Space Grotesk typefaces.

---

## 15. Assumptions

1. Target users possess modern web browsers (Chrome 110+, Firefox 110+, Safari 16+, Edge 110+) with JavaScript and WebGL/Canvas enabled.
2. Users understand basic administrative hierarchies in Bangladesh (District &rarr; Upazila &rarr; Mouza).
3. The demonstration prototype is intended for academic evaluation, hackathon judging, and architectural validation rather than live operational disaster dispatch.

---

## 16. Risks and Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Privacy Violation of Landowners** | High | Use strictly fictional, synthetically generated names and plot records. |
| **Misinterpretation of Forecasts as Fact** | High | Suppress financial disbursement fields in Forecast mode; enforce persistent disclaimers and confidence badges. |
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
6. Settings view presents exactly About Project and Team Information pages with exact team metadata.
7. All 54 automated unit tests pass without failure (`npm test`).
8. TypeScript typecheck compiles with zero errors (`npm run lint`).

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

## 19. Future Enhancements (Proposed)

1. **Production Spatial Backend:** Transition `lib/data.ts` to a high-performance FastAPI and PostgreSQL 16 + PostGIS spatial backend.
2. **Operational Earth Observation Pipeline:** Integrate automated Sentinel-1/2 pipelines via Google Earth Engine or Copernicus Hub.
3. **Deep Learning Prediction Engine:** Deploy spatiotemporal neural networks (ConvLSTM / U-Net) to generate verified 1-year riverbank retreat forecasts.
4. **Government System Integration:** Connect to official land ministry registries (e-Mutation / e-Porcha) under strict institutional data-sharing agreements.
5. **Bilingual Localization:** Add full Bengali language localization across all UI elements, maps, and reports.
