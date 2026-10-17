# BhumiDorpon — Main Project Documentation
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Comprehensive Master System Reference  
> **Product Version:** 1.2 (Enhanced Multi-Hazard Release)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Target Audience:** Hackathon Evaluators, Academic Researchers, Land Surveyors, Engineering Teams  
> **Documentation Suite Navigation:**  
> [PRD](PRD.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Auth Specification](AUTH_SPECIFICATION.md) | [Security Specification](SECURITY_SPECIFICATION.md)

---

## Table of Contents

- [1. Executive Summary & Project Identity](#1-executive-summary--project-identity)
  - [1.1 What is BhumiDorpon?](#11-what-is-bhumidorpon)
  - [1.2 Map-Centered Cadastral Exploration](#12-map-centered-cadastral-exploration)
  - [1.3 Core Product Innovations (v1.2 Release)](#13-core-product-innovations-v12-release)
- [2. Geographical and Social Context of Bangladesh](#2-geographical-and-social-context-of-bangladesh)
  - [2.1 The Deltaic Reality](#21-the-deltaic-reality)
  - [2.2 Land Tenure Disruption & Boundary Loss](#22-land-tenure-disruption--boundary-loss)
  - [2.3 The Macro-Micro Information Gap](#23-the-macro-micro-information-gap)
- [3. The Five Core Hazard Domains in Depth](#3-the-five-core-hazard-domains-in-depth)
  - [3.1 Module 1: River Erosion (/river-erosion)](#31-module-1-river-erosion-river-erosion)
  - [3.2 Module 2: Flood Monitoring (/flood)](#32-module-2-flood-monitoring-flood)
  - [3.3 Module 3: Landslides (/landslide)](#33-module-3-landslides-landslide)
  - [3.4 Module 4: Char Island Dynamics (/char)](#34-module-4-char-island-dynamics-char)
  - [3.5 Module 5: Coastal Changes (/coastal)](#35-module-5-coastal-changes-coastal)
- [4. Global Bangla Default & English Localization Engine](#4-global-bangla-default--english-localization-engine)
  - [4.1 Centralized Translation Architecture (lib/translations.ts)](#41-centralized-translation-architecture-libtranslationsts)
  - [4.2 Bengali Numeral Localization](#42-bengali-numeral-localization)
  - [4.3 Persistent Zero-Layout-Shift Language Switcher](#43-persistent-zero-layout-shift-language-switcher)
- [5. Entry Authentication, Registration & Demo Access Subsystem](#5-entry-authentication-registration--demo-access-subsystem)
  - [5.1 Initial Entry Interceptor (AuthModal.tsx & /login)](#51-initial-entry-interceptor-authmodaltsx--login)
  - [5.2 Form Validation & Password Controls](#52-form-validation--password-controls)
  - [5.3 Isolated Demo Access Bypass](#53-isolated-demo-access-bypass)
- [6. Global Land Information Cascading Search & Report Engine](#6-global-land-information-cascading-search--report-engine)
  - [6.1 Five-Tier Cascading Identifier Model](#61-five-tier-cascading-identifier-model)
  - [6.2 Leading Zero String Token Preservation](#62-leading-zero-string-token-preservation)
  - [6.3 Structured Six-Section Land Report](#63-structured-six-section-land-report)
  - [6.4 Standardized Data Availability & Attribution Badging](#64-standardized-data-availability--attribution-badging)
- [7. Section 5: Disaster-Related Land Change & Deep-Learning Risk Analysis](#7-section-5-disaster-related-land-change--deep-learning-risk-analysis)
  - [7.1 Historical Land Change & Loss-Gain Accounting](#71-historical-land-change--loss-gain-accounting)
  - [7.2 Submerged Land Cadastral Preservation](#72-submerged-land-cadastral-preservation)
  - [7.3 Deep-Learning Multi-Hazard Risk Prediction Pipeline](#73-deep-learning-multi-hazard-risk-prediction-pipeline)
- [8. Four-Step Landslide Hierarchy & Event Selector](#8-four-step-landslide-hierarchy--event-selector)
  - [8.1 Four-Step Dependent Selection Workflow](#81-four-step-dependent-selection-workflow)
  - [8.2 Dual-Mode Integration (Recorded vs. Forecast)](#82-dual-mode-integration-recorded-vs-forecast)
- [9. Top-Level Scroll to Disasters Feature](#9-top-level-scroll-to-disasters-feature)
- [10. Pure Leaflet Cartography & Dual-Map Synchronizer Subsystem](#10-pure-leaflet-cartography--dual-map-synchronizer-subsystem)
  - [10.1 Offline Vector Basemap Architecture (Zero External Tiles)](#101-offline-vector-basemap-architecture-zero-external-tiles)
  - [10.2 Bidirectional Dual-Map Synchronization](#102-bidirectional-dual-map-synchronization)
  - [10.3 Cartographic Chrome & SVG Hatch Pattern Textures](#103-cartographic-chrome--svg-hatch-pattern-textures)
  - [10.4 Dedicated In-Map Direct Zoom Controls](#104-dedicated-in-map-direct-zoom-controls)
- [11. Cadastral Four-Corner GPS Boundary Readout Engine](#11-cadastral-four-corner-gps-boundary-readout-engine)
  - [11.1 Micro-Cadastral Quadrilateral Standardization](#111-micro-cadastral-quadrilateral-standardization)
  - [11.2 Six-Decimal Precision & Centroid Suppression](#112-six-decimal-precision--centroid-suppression)
  - [11.3 Dedicated Flood Owner Land Detail Page](#113-dedicated-flood-owner-land-detail-page)
- [12. Google Earth Parcel Outline Feature](#12-google-earth-parcel-outline-feature)
  - [12.1 3D Spatial Bridge Workflow](#121-3d-spatial-bridge-workflow)
  - [12.2 Client-Side KML 2.2 Serializer (lib/googleEarth.ts)](#122-client-side-kml-22-serializer-libgoogleearthts)
  - [12.3 External Camera URL Formulation](#123-external-camera-url-formulation)
  - [12.4 Zero-Backend Privacy Boundaries](#124-zero-backend-privacy-boundaries)
- [13. Distinction: Google Earth vs. Google Earth Engine](#13-distinction-google-earth-vs-google-earth-engine)
- [14. Five-Hazard Information Store Architecture](#14-five-hazard-information-store-architecture)
- [15. GeoAI Forecasting & Rule 5 Compliance Disclosures](#15-geoai-forecasting--rule-5-compliance-disclosures)
- [16. Platform Settings Hub & Team Attribution](#16-platform-settings-hub--team-attribution)
- [17. Technical Architecture & Technology Stack](#17-technical-architecture--technology-stack)
- [18. Chronological Project Evolution & Update History](#18-chronological-project-evolution--update-history)
- [19. Testing and Quality Assurance Verification](#19-testing-and-quality-assurance-verification)
- [20. Complete Documentation Suite Index](#20-complete-documentation-suite-index)
- [21. Academic References & Citations](#21-academic-references--citations)
- [22. Team Information and Copyright](#22-team-information-and-copyright)

---

## 1. Executive Summary & Project Identity

### 1.1 What is BhumiDorpon?
**BhumiDorpon** (Bengali: ভূমিদর্পণ — literally *"Mirror of the Earth"*) is a specialized, map-centric geospatial web platform engineered to monitor, analyze, and visualize cadastral land changes, physical environmental hazards, tenure displacement, and deep-learning disaster risks across Bangladesh. Built with modern web GIS technologies, it brings together parcel-level cadastral boundaries (Dag and Khatian numbers), historical environmental losses and accretion gains, forward-looking hazard projections, and cadastral intelligence within an accessible, responsive, bilingual user interface.

### 1.2 Map-Centered Cadastral Exploration
In Bangladesh, land administration and disaster reporting have traditionally operated in disconnected silos:
- Official land records (cadastral sheets, khatians, and mouza maps) are stored as physical paper sheets or semi-digitized tabular portals that do not reflect ground environmental realities.
- Disaster warnings and flood bulletins are published as high-level meteorological summaries or river-basin water level charts that fail to link to parcel boundaries.

BhumiDorpon bridges this divide through **map-centered exploration**. Instead of presenting abstract statistical tables, the platform places interactive, geographically synchronized maps at the center of the user experience. Users navigate through administrative hierarchies (Division &rarr; District &rarr; Upazila &rarr; River/Hill/Mouza) and visually inspect how specific physical hazards intersect with cadastral plots, homesteads, agricultural parcels, and community infrastructure.

### 1.3 Core Product Innovations (v1.2 Release)
1. **Global Bangla Default & English Localization:** Full bilingual experience with Bangla as the first-visit default, zero-layout-shift language toggle in the header, and Eastern Nagari numeral localization (`০-৯`).
2. **First-Visit Authentication & Demo Access:** Entry gatekeeper with login, registration, password confirmation, validation, and a prominent **"Demo / ডেমো হিসেবে প্রবেশ করুন"** bypass button with strictly isolated permissions.
3. **Global Land Information Search:** Dedicated top-level search route (`/land-information`) supporting 5 cascading fields (District, Upazila, Mouza, Dag No., Khatian No.) with leading zero string preservation.
4. **Structured Six-Section Cadastral Report:** Comprehensive report covering Land ID (with 4-corner GPS coordinates), Ownership, Sale Status, Legal Disputes, Tax & Payment Records, and Registration History.
5. **Section 5: Disaster-Related Land Change and Deep-Learning Risk Analysis:** Parcel-level historical loss-gain quantification, physical status preservation for submerged parcels (`Completely Submerged / নদীগর্ভে বিলীন`), and 4 deep-learning risk prediction models (ConvLSTM, HydroSAR, InSAR SlopeNet, CoastWatch).
6. **Four-Step Landslide Hierarchy & Event Selector:** Four-step cascading selector (District &rarr; Upazila &rarr; Hill &rarr; Landslide Event) embedded in `SelectorChain.tsx` with URL state synchronization (`?d&u&h&ev`), newest-first sorting, automatic default event selection, and honest empty states for hills without events.
7. **Top-Level Scroll to Disasters Button:** Direct smooth-scroll navigation button on the homepage hero targeting `#disaster-options`.
8. **Pure Leaflet Cartography & Dual-Map Synchronizer:** Side-by-side synchronized Before/After maps operating 100% offline without external vector tile servers.
9. **Cadastral 4-Corner Boundary Readouts & Google Earth KML:** Individual parcel coordinates formatted to 6 decimal places with one-click Google Earth 3D export.
10. **Rule 5 Compliance & Data Transparency:** Complete suppression of financial payout fields on forecast views, with transparent badging for demo data and unverified external records.
11. **Right-Aligned Header Toolbar:** Responsive header toolbar layout right-aligning action controls on desktop (`md:justify-end`) with multi-line overflow wrapping directly below the language toggle, maintaining left-alignment on mobile, with non-overlapping Bengali heading line-height.
12. **Complete Table & Data Localization:** Comprehensive Bengali localization of all tabular data, headers, cells, status badges, sublabels, chart `aria-label`s, and data-derived strings (hill names, risk zone suffixes like *High Risk Slope Zone*, plot IDs, survey types, dates, Eastern Nagari numbers), while strictly preserving allowlisted technical acronyms (GIS, InSAR, KML, GeoJSON, CSV, BDT/৳, DL, m, mm, km).

---

## 2. Geographical and Social Context of Bangladesh

### 2.1 The Deltaic Reality
Bangladesh lies at the downstream confluence of three mighty Himalayan river systems—the **Ganges (Padma)**, the **Brahmaputra (Jamuna)**, and the **Meghna**—forming the world’s largest and most active delta. Over 80% of the country consists of low-lying alluvial floodplains rarely rising more than 10 meters above mean sea level.

This unique deltaic geology produces extreme territorial volatility:
- High monsoon river discharges and unstable alluvial sediment cause rapid riverbank collapse, consuming thousands of hectares of arable land annually.
- Seasonal monsoon downpours and transboundary upstream runoff inundate vast haor and floodplain depressions.
- Coastal storm surges, tropical cyclones, and tidal dynamics continually erode marine coastlines while depositing ephemeral mid-channel sandbars (*chars*).
- Intense localized monsoon rainfall in the southeastern tertiary hills triggers deadly debris slides on deforested slopes.

### 2.2 Land Tenure Disruption & Boundary Loss
In a country with a population density exceeding 1,100 people per square kilometer, land is the fundamental basis of livelihood, food security, social dignity, and intergenerational survival. When a river swallows a plot of land or floodwaters submerge a mouza:
- Ground boundary markers (*ails*) are completely obliterated.
- Landowners lose physical possession of their ancestral plots.
- When water recedes or new char islands emerge, violent land disputes erupt between displaced original owners and land grabbers due to the absence of verifiable spatial boundary coordinates.

### 2.3 The Macro-Micro Information Gap
When environmental hazards strike, affected citizens and local administration officials face a critical information void:
- Citizens cannot verify which specific Dag numbers were lost or submerged.
- Assistant Commissioners of Land (AC Land) and Upazila Surveyors lack spatial tools to rapidly compute aggregate loss areas for disaster relief compensation.
- Disaster planners lack an integrated portal connecting macro-level hazard envelopes to micro-level landownership deeds.

---

## 3. The Five Core Hazard Domains in Depth

### 3.1 Module 1: River Erosion (`/river-erosion`)
- **Geographic Pilot:** Kazipur Upazila, Sirajganj District along the braided Jamuna River corridor.
- **Physical Dynamics:** Braided river channels migrate hundreds of meters during monsoon flood surges, collapsing sand-silt riverbanks and swallowing entire mouzas.
- **Visual Cartography:** Dark blue surveyed baseline bankline vs. light blue current bankline; eroded loss strips filled with coral diagonal hatch (`pattern-loss`); dynamic transect retreat markers measuring bankline migration (e.g., `42 m`, `38 m`).
- **Data Outputs:** Mouza Summary Panel, Water Status Card (river width, erosion velocity), and Landowner Compensation Table.

### 3.2 Module 2: Flood Monitoring (`/flood`)
- **Geographic Pilot:** Gowainghat and Jaflong, Sylhet District / Tahirpur, Sunamganj District.
- **Physical Dynamics:** Seasonal monsoon flooding and upstream transboundary flash runoff submerging haors, agricultural plains, and rural homesteads.
- **Visual Cartography:** Multi-depth flood inundation contours (Shallow `<0.5m`, Moderate `0.5–1.5m`, Deep `>1.5m`); submerged cadastral parcels color-coded by individual landowner.
- **Cadastral Detail Flow:** Direct drill-down to individual Flood Owner Land Detail pages displaying 4-corner GPS coordinates, one-click copy buttons, GeoJSON export, and Google Earth KML export.

### 3.3 Module 3: Landslides (`/landslide`)
- **Geographic Pilot:** Chittagong and Rangamati District in the Chittagong Hill Tracts.
- **Physical Dynamics:** Saturated tertiary shale-sandstone slopes failing under intense localized monsoon downpours ($> 200\text{ mm}/24\text{h}$).
- **Visual Cartography:** Synthetic DEM hillshade overlays, 10-meter index contour isolines, spot elevation tags, failure scarp polygons (red), and debris runout risk buffers (orange).
- **Four-Step Dependent Selector:** Cascading geographic selection (District &rarr; Upazila &rarr; Hill &rarr; Landslide Event) embedded in `SelectorChain.tsx` with URL synchronization (`?d&u&h&ev`), newest-first sorting, auto-selection, and honest empty states.

### 3.4 Module 4: Char Island Dynamics (`/char`)
- **Geographic Pilot:** Char Girish, Kazipur, Sirajganj along the Jamuna River.
- **Physical Dynamics:** Dynamic mid-channel sandbars (*chars*) emerging, migrating, and eroding through alluvial sediment deposition and monsoon floods.
- **Visual Cartography:** Baseline char perimeter vs. current shape; green accretion tips (newly deposited land) vs. coral erosion flanks; river channel corridors.
- **Tenure Protection:** Dedicated card cataloging unowned `State Khas Alluvial Accretion` under deed `1/1 (State)` to prevent illegal land grabbing.

### 3.5 Module 5: Coastal Changes (`/coastal`)
- **Geographic Pilot:** Monpura and Char Fasson, Bhola District / Hatiya, Noakhali District.
- **Physical Dynamics:** Estuarine tidal dynamics, storm surges, and marine shoreline erosion interacting with active deltaic mudflat accretion in the Bay of Bengal.
- **Visual Cartography:** Historical shoreline vs. current shoreline; coastal embankment defense lines; intertidal mudflats; marine depth contours.
- **Revenue Protection:** Dedicated card tracking unassigned offshore mudflats for state revenue administration.

---

## 4. Global Bangla Default & English Localization Engine

### 4.1 Centralized Translation Architecture (`lib/translations.ts`)
To eliminate scattered, hardcoded language checks, BhumiDorpon deploys a centralized dictionary:
- Primary default language is set to **Bangla (`bn`)** on first visit.
- Stored in `localStorage` under `bhumidorpon_lang` to remember user preference.
- All translation keys are resolved via `t(key, lang)`.
- All table headers, cells, badges, tooltips, chart `aria-label`s, and data-derived strings (hill names, risk zone suffixes, owner IDs, land classes, dates) pass through centralized localizers in `lib/translations.ts`, ensuring 100% Bengali linguistic immersion.
- The header toolbar is right-aligned on tablet and desktop (`md:justify-end md:flex-1 md:ml-auto`), wrapping overflow rows directly beneath the language toggle without drifting into the header center, and heading line-heights are calibrated to prevent clipping of Eastern Nagari ascenders and descenders.

### 4.2 Bengali Numeral Localization
The engine provides `formatNumberLocalized(num, lang)` which converts Arabic digits (`0-9`) into Eastern Nagari Bengali numerals (`০-৯`) when `lang === "bn"`, while formatting commas and decimal places appropriately.

### 4.3 Persistent Zero-Layout-Shift Language Switcher
The header mounts a button (`বাংলা | English`) that toggles language instantaneously without triggering page reloads, without disrupting map pan/zoom coordinates, and without resetting active cascading search filters.

---

## 5. Entry Authentication, Registration & Demo Access Subsystem

### 5.1 Initial Entry Interceptor (`AuthModal.tsx` & `/login`)
When an unauthenticated visitor enters the platform, `AuthModal.tsx` intercepts the view with a frosted glassmorphic card:
- Supports Login with Username/Email and Password.
- Supports Registration with Full Name, Username, Email, Password, Password Confirmation, and Intended Role.
- Seeded test credentials:
  - `surveyor` / `password123` (Surveyor Role)
  - `citizen` / `citizen123` (Citizen Role)
  - `admin` / `admin123` (Admin Role)

### 5.2 Form Validation & Password Controls
- Minimum 6 characters for passwords.
- Real-time password confirmation matching.
- Eye / EyeOff icon toggles for password visibility.
- Bilingual error messaging on invalid credentials or duplicate usernames.

### 5.3 Isolated Demo Access Bypass
A prominent button **"Demo / ডেমো হিসেবে প্রবেশ করুন"** allows evaluators to explore all dashboard and cadastral visualization features immediately:
- Generates an ephemeral session with `isDemo: true`.
- Enforces strict read-only containment: `canPerformAdministrativeAction(user)` strictly evaluates to `false`.
- A persistent top banner (`DemoBanner.tsx`) reminds users that they are in demo mode.

---

## 6. Global Land Information Cascading Search & Report Engine

### 6.1 Five-Tier Cascading Identifier Model
Located at `/land-information`, the search engine resolves parcels across 5 hierarchical fields:
1. **District (জেলা):** Sirajganj, Sylhet, Rangpur, Cox's Bazar, Bhola, Chittagong.
2. **Upazila (উপজেলা):** Filtered by selected District.
3. **Mouza (মৌজা):** Filtered by selected Upazila with JL Numbers.
4. **Dag Number (দাগ নম্বর):** Accepts alphanumeric or numeric strings.
5. **Khatian Number (খতিয়ান নম্বর):** Accepts cadastral survey strings (e.g., `RS-475`, `SA-112`).

### 6.2 Leading Zero String Token Preservation
Cadastral parcel identifiers are stored and filtered strictly as string tokens (`dagNo.trim()`). Leading zeros (e.g., `"0101"`, `"0042"`) are never converted to numeric integers, ensuring complete cadastral authenticity.

### 6.3 Structured Six-Section Land Report
A successful search produces a comprehensive cadastral intelligence report:
- **Section A: Land Identification:** District, Upazila, Mouza, JL No, Dag No, Khatian No, Area (Decimal & Acre), Land Classification, and 4-Corner GPS coordinates.
- **Section B: Ownership Information:** Recorded owners, ownership shares, father's name, verification timestamp.
- **Section C: Sale & Listing Status:** Active sale status, listing price, source attribution.
- **Section D: Legal Disputes & Court Cases:** Civil suit reference numbers, dispute status, court jurisdiction.
- **Section E: Land Development Tax (LD Tax):** Assessment period, outstanding balance, last payment date.
- **Section F: Registration & Ownership History:** Transfer chain, mutation record dates, deed volumes.

### 6.4 Standardized Data Availability & Attribution Badging
Every section is marked with authoritative badges:
- `যাচাই করা` (Verified Record)
- `ডেমো ডেটা` (Demo Data)
- `তথ্য পাওয়া যায়নি` (No Record Found)
- `বাহ্যিক ডেটা সংযোগ প্রয়োজন` (External Connection Required)

---

## 7. Section 5: Disaster-Related Land Change & Deep-Learning Risk Analysis

Directly beneath general land information, a specialized analysis section is rendered:
**"দুর্যোগজনিত ভূমির পরিবর্তন ও ঝুঁকি বিশ্লেষণ" / "Disaster-Related Land Change and Risk Analysis"**

### 7.1 Historical Land Change & Loss-Gain Accounting
Displays chronological disaster impacts:
- Event type (River Erosion, Flash Flood, Landslide, Coastal Surge).
- Observation date and affected area (decimals / sq meters).
- Measured net loss or sediment accretion.

### 7.2 Submerged Land Cadastral Preservation
When a parcel has been physically swallowed by a river (e.g., Dag `0101` in Kazipur):
- The parcel is clearly designated as **"Completely Submerged / নদীগর্ভে বিলীন"**.
- Physical loss is separated from legal tenure: the historical cadastral identity, deed, and ownership record are preserved to protect citizen re-emergence claims under national alluvial land laws (Section 86 of the State Acquisition and Tenancy Act).

### 7.3 Deep-Learning Multi-Hazard Risk Prediction Pipeline
For existing plots, the engine displays multi-hazard risk predictions across 4 specialized deep-learning models:
1. **River Erosion:** ConvLSTM Spatiotemporal Sequence Model (1-year forecast, 82% confidence).
2. **Flood Inundation:** HydroSAR Inundation Depth Network (Monsoon season forecast, 88% confidence).
3. **Landslide Risk:** InSAR SlopeNet Displacement Predictor (Rainfall trigger forecast, 79% confidence).
4. **Coastal Surge & Erosion:** CoastWatch Estuarine Retreat Model (1-year shoreline model, 75% confidence).

---

## 8. Four-Step Landslide Hierarchy & Event Selector

### 8.1 Four-Step Dependent Selection Workflow
Integrated directly into `components/SelectorChain.tsx` for both Recorded and Forecast modes on `/landslide` and `/landslide/[mode]`:
1. **District (জেলা):** Chittagong, Rangamati, Bandarban, Cox's Bazar.
2. **Upazila (উপজেলা):** Filtered by selected District.
3. **Hill / Mountain (পাহাড়):** Monitored hills within the Upazila (e.g., Ghagra, Furamon, Vedvedi, Chimbuk, Himchari, Nilgiri, Sajek Ridge).
4. **Landslide Event (ভূমিধসের ঘটনা):** Fourth dependent step (Badge ④) listing all recorded landslide disasters (Recorded mode) or simulation scenarios (Forecast mode) for the selected hill, sorted newest first with event dates.

- **Auto-Selection & Clearing Rules:** When a hill is selected, the newest available event is automatically selected if `ev` is empty. Changing District, Upazila, or Hill immediately clears the downstream event parameter `ev`. Reset-to-default also clears `ev`.
- **Honest Empty State:** Hills without recorded disaster events (e.g., Mirinja, Keokradong, Teknaf Ridge, Inani Range, Jaflong Hill) render a disabled combobox with the honest message: *"এই পাহাড়ে কোনো ভূমিধসের ঘটনা রেকর্ড নেই"* / *"No landslide events recorded for this hill"*, without inventing fictitious events.
- **Dynamic Detail Telemetry:** The chosen event drives 8 critical metrics on the landslide detail view: event title, date, 24-hour rainfall, debris volume, slope gradient, affected slope area, homesteads at risk, and impact summary banner.
- **Unified Single-Selector Architecture:** The redundant standalone `MountainEventSelector` card was eliminated from `/landslide/[mode]`, establishing `SelectorChain` as the sole authoritative selector driven by URL state (`?d&u&h&ev`).

### 8.2 Dual-Mode Integration (Recorded vs. Forecast)
- Selecting an event immediately updates map bounds, contour vectors, and telemetry cards.
- Changing the hill or district automatically clears `ev` and re-resolves the newest event for the newly chosen hill.
- Switching between Recorded and Forecast modes retains `d`, `u`, and `h` while resolving the corresponding event list for that mode.

---

## 9. Top-Level Scroll to Disasters Feature

A prominent button is mounted near the top of the Home Dashboard:
- Bangla label: **"দুর্যোগসমূহ দেখুন"**
- English label: **"Explore Disasters"**
- Executes smooth browser scrolling (`behavior: "smooth"`) directly targeting the `#disaster-options` container.
- Includes `scroll-mt-24` offset to ensure that the sticky header and demo banner never conceal the section heading.

---

## 10. Pure Leaflet Cartography & Dual-Map Synchronizer Subsystem

### 10.1 Offline Vector Basemap Architecture (Zero External Tiles)
- Pure **Leaflet 1.9.4** across all 5 hazard modules.
- Custom **Light GIS Basemap** renders completely offline using client-rendered SVG vector paths (`components/map/basemap/LightGisBasemap.tsx`).
- Background canvas styled in high-contrast neutral `#EEF0E6`.

### 10.2 Bidirectional Dual-Map Synchronization
Before and After maps are displayed side-by-side in simultaneous viewports:
- Panning or zooming either map immediately mirrors the viewport coordinates to the paired map.
- Guarded by an active re-entrancy lock (`isSyncing` flag) to prevent recursive loop stutter.

### 10.3 Cartographic Chrome & SVG Hatch Pattern Textures
- **Graticules, Dynamic Metric Scale Bar, North Arrow, Locator Inset Mini-Map**.
- **SVG Hatch Pattern Injection:** Dynamic `<pattern>` definitions injected into the Leaflet SVG renderer (`pattern-loss` coral diagonal stripes, `pattern-khas` slate cross-hatch, `pattern-forecast` purple dashed stripes).

### 10.4 Dedicated In-Map Direct Zoom Controls
- High-visibility `+` and `−` zoom buttons mounted on the map chrome with immediate first-click execution.

---

## 11. Cadastral Four-Corner GPS Boundary Readout Engine

### 11.1 Micro-Cadastral Quadrilateral Standardization
- Standardizes cadastral parcels into strict 4-corner quadrilaterals sorted clockwise: NW (`1`), NE (`2`), SE (`3`), SW (`4`).
- Defined by a closed ring of 5 coordinate tuples where the 5th point repeats the 1st.

### 11.2 Six-Decimal Precision & Centroid Suppression
- All corner coordinates formatted to 6 decimal places ($\sim 0.11\text{m}$ ground accuracy).
- Centroid coordinates intentionally suppressed to eliminate geometric confusion.

### 11.3 Dedicated Flood Owner Land Detail Page
- Located at `/flood/[mouzaId]/[floodId]/owner/[ownerId]`.
- Displays landowner profile header, 4-corner GPS table, one-click copy buttons, GeoJSON download, and Google Earth KML export.

---

## 12. Google Earth Parcel Outline Feature

### 12.1 3D Spatial Bridge Workflow
One-click "Open in Google Earth" button launches Google Earth Web centered at parcel bounding box and initiates automatic `.kml` download.

### 12.2 Client-Side KML 2.2 Serializer (`lib/googleEarth.ts`)
Generates valid OGC KML 2.2 XML strings with closed polygon geometry, 4 numbered corner pins, and comprehensive XML escaping.

### 12.3 External Camera URL Formulation
$$\text{URL} = \text{https://earth.google.com/web/@}\langle\text{lat}\rangle,\langle\text{lon}\rangle,0\text{a},\langle\text{range}\rangle\text{d},35\text{y},0\text{h},0\text{t},0\text{r}$$

### 12.4 Zero-Backend Privacy Boundaries
Only numeric centroid and camera range are transmitted via URL. Landowner identity and deed details remain strictly on the local device.

---

## 13. Distinction: Google Earth vs. Google Earth Engine

| Dimension | Google Earth (Implemented Feature) | Google Earth Engine (Proposed Future Pipeline) |
|---|---|---|
| **Role & Purpose** | Client-side 3D geographic visualizer for parcel inspection. | Cloud-scale planetary geospatial computing platform for satellite data analysis. |
| **Operational Status** | **Operational & Verified** in current v1.2 release. | **Proposed Future Enhancement** (Phase 3 Roadmap). |
| **Execution Environment**| User's web browser (`earth.google.com/web`). | Google Cloud / Earth Engine compute infrastructure. |
| **Data Ingestion** | Reads client-downloaded KML 2.2 files locally. | Automates Sentinel-1 SAR and Sentinel-2 optical image ETL. |

---

## 14. Five-Hazard Information Store Architecture

- **Runtime Store (`public/mocks/*.json`):** Static assets served at `/mocks/*` and fetched by client components via `loadMockJson()` in `lib/data.ts`.
- **Source / Test Store (`mocks/*.json`):** Synchronous copy read by Node.js and Vitest test environments using `fs.readFileSync`.
- **Per-Area Map Packages (`mocks/areas/<hazard>/` & `public/mocks/areas/<hazard>/`):** Modular spatial bundles resolved via `areas_index.json`.

---

## 15. GeoAI Forecasting & Rule 5 Compliance Disclosures

- **Rule 5 Guardrail Compliance:** In Forecast mode, all compensation disbursement fields (`Paid`, `Approved`, `Pending`) are strictly omitted, displaying only projected compensation metrics.
- **Synthetic Mock Data Provenance:** All names, plot numbers, deed records, and figures are deterministic synthetic mock datasets. Persistent disclaimers separate model estimates from certified surveys.

---

## 16. Platform Settings Hub & Team Attribution

- **About Project (`/settings/about`):** Detailed architectural overview, hazard explanations, offline cartography notes, and mock disclosures.
- **Team Information (`/settings/team`):** Official team attribution cards:
  - **Team Name:** GeoNeural
  - **Team Leader:** Pantho Raj Biswas
  - **Team Member:** Puja Paul
  - **Copyright:** © 2026 GeoNeural. All rights reserved.

---

## 17. Technical Architecture & Technology Stack

- **Core Framework:** Next.js `14.2.15` (App Router).
- **Language:** TypeScript `5.6.2` (Strict mode).
- **Styling:** Tailwind CSS `3.4.13` with custom design tokens.
- **Mapping:** Leaflet `1.9.4` and `react-leaflet` `4.2.1` (Zero MapLibre/Mapbox).
- **Spatial Analysis:** Turf.js `7.4.0`.
- **State Store:** Zustand `4.5.5`.
- **Data Caching:** TanStack React Query `5.59.0`.
- **Unit Testing:** Vitest `4.1.11` (16 test suites, 92 unit tests).

---

## 18. Chronological Project Evolution & Update History

| Milestone / Version | Date | Key Enhancements & Modifications |
|---|---|---|
| **Initial Submission** | Oct 2026 | Initial prototype establishing the 5 core hazard modules, baseline side-by-side map comparison, and preliminary mock data models. |
| **Data Architecture Refactoring** | Oct 2026 | Rebuilt core data architecture with deterministic mock generator (`scripts/generate-mocks.ts`), producing synchronized relational JSON stores in `public/mocks/` and `mocks/`. |
| **Rule 5 Forecast Guardrails** | Oct 2026 | Refactored `SelectorChain` cascading dropdown hierarchy; implemented strict suppression of financial disbursement metrics on forecast views. |
| **Flood Multi-Owner Flow & Landslides** | Oct 2026 | Implemented flood event views with individual landowner plot color-coding and search; built landslide terrain engine with hillshades and contours. |
| **Cadastral 4-Corner Readouts** | Oct 2026 | Standardized parcels into 4-corner quadrilaterals with fixed NW, NE, SE, SW vertex ordering and 6-decimal GPS coordinate readouts; launched `/flood/.../owner/...` route. |
| **Leaflet Migration & Offline Cartography** | Oct 2026 | Removed all external tile server dependencies and Mapbox imports; migrated complete mapping engine across all hazard views to pure Leaflet with SVG vector geometry. |
| **Light GIS Basemap & Chrome Upgrade** | Oct 2026 | Engineered custom high-contrast Light GIS basemap, cartographic map chrome, mouza loss/gain badges, and `MouzaSummaryPanel`. |
| **Side-by-Side Dual Map Viewer** | Oct 2026 | Upgraded comparison to simultaneous dual-panel synchronized layout; introduced dedicated in-map zoom controls (+/-) and basemap switcher. |
| **Geographic Extent Bounds Alignment** | Oct 2026 | Configured regional bounding boxes per hazard; implemented single-click simultaneous dual-map zoom synchronicity with active re-entrancy locks. |
| **Settings Navigation Hub** | Oct 2026 | Added Settings Hub (`/settings`) with verified About Project and Team Information views displaying official team attribution (Team GeoNeural). |
| **Technical Documentation Suite** | Oct 2026 | Published engineering and specification suite in `/docs`. |
| **GeoAI Forecast Highlighting** | Oct 2026 | Enhanced README with GeoAI forecast highlight, operational troubleshooting guide, and mock data disclosures. |
| **Google Earth Parcel Outline Feature** | Oct 2026 | Implemented "Open in Google Earth" with client-side KML 2.2 serializer, camera URL calculation, and automated tests. |
| **Documentation Alignment** | Oct 2026 | Synchronized project history and test counts to 10 test suites (61/61 passing unit tests). |
| **Documentation Standardization** | Oct 2026 | Consolidated historical documents into 10 authoritative Markdown specifications in `/docs`; translated prose to English. |
| **v1.2 Release: Auth, Localization, Land Search & Landslide Selectors** | Oct 2026 | Implemented global Bangla default with English toggle (`lib/translations.ts`); entry auth modal and isolated demo access (`lib/auth.ts`); cascading Land Information search across 5 fields with leading zero preservation (`lib/landSearch.ts`); Section 5 multi-hazard DL predictions and submerged parcel preservation; two-step mountain and landslide historical event selector (`lib/landslideEvents.ts`); top-level scroll-to-disasters button; expanded automated test suite to 14 test suites and 78 unit tests (100% passing). |
| **Documentation Audit & Synchronization** | Oct 2026 | Comprehensive audit of all 10 documentation specifications in `/docs`; synchronized duplicate README and Master Documentation copies; aligned route signatures and verified 14 test suites (78/78 passing unit tests). |
| **Change 4: Landslide Event Step, Header Toolbar & Bangla Table Localization** | Oct 2026 | Added 4th dependent step (Landslide Event) to `SelectorChain.tsx` with URL param `ev`, newest-first sorting, auto-selection, and honest empty states; right-aligned header toolbar on `md+` with wrapping under language toggle and Bengali heading line-height fix; comprehensive Bangla table and data localization across all tables and charts; expanded test suite to 16 suites and 92 passing unit tests. |

---

## 19. Testing and Quality Assurance Verification

BhumiDorpon includes an automated Vitest test suite executing **16 test suites and 92 unit tests**:

```text
 ✓ tests/step5_flood_flow.test.ts (6 tests)
 ✓ tests/data_layer.test.ts (4 tests)
 ✓ tests/step3_and_step4.test.ts (8 tests)
 ✓ tests/four_corners_geometry.test.ts (5 tests)
 ✓ tests/google_earth_kml.test.ts (7 tests)
 ✓ tests/mountain_event_selector.test.ts (9 tests)
 ✓ tests/auth_demo_access.test.ts (4 tests)
 ✓ tests/land_search.test.ts (4 tests)
 ✓ tests/change3_part1_gis_basemap.test.ts (8 tests)
 ✓ tests/map_fixes.test.ts (4 tests)
 ✓ tests/localization_tables.test.ts (6 tests)
 ✓ tests/units_and_compensation.test.ts (12 tests)
 ✓ tests/settings_information.test.ts (4 tests)
 ✓ tests/localization.test.ts (4 tests)
 ✓ tests/map_comparison_side_by_side.test.ts (3 tests)
 ✓ tests/app_header_toolbar.test.ts (4 tests)

 Test Files  16 passed (16)
      Tests  92 passed (92)
```

Execution Commands:
- `npm test`: Runs Vitest test runner across all 16 suites.
- `npm run lint` / `npx tsc --noEmit`: Strict TypeScript compiler verification (0 errors).
- `npm run build`: Static production compilation of all 15 routes (0 errors).

---

## 20. Complete Documentation Suite Index

The `/docs` directory is organized into **10 authoritative Markdown documents**:

1. [`docs/PRD.md`](PRD.md) — Product Requirements Document
2. [`docs/TRD.md`](TRD.md) — Technical Requirements Document
3. [`docs/APP_FLOW.md`](APP_FLOW.md) — App Flow & User Flow
4. [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — System Architecture Documentation
5. [`docs/DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — Database & Backend Schema Specification
6. [`docs/UI_UX_DESIGN_SYSTEM.md`](UI_UX_DESIGN_SYSTEM.md) — UI/UX Design System
7. [`docs/AUTH_SPECIFICATION.md`](AUTH_SPECIFICATION.md) — Authentication & Authorization Specification
8. [`docs/SECURITY_SPECIFICATION.md`](SECURITY_SPECIFICATION.md) — Security Specification
9. [`docs/MAIN_PROJECT_DOCUMENTATION.md`](MAIN_PROJECT_DOCUMENTATION.md) — Main Project Documentation
10. [`README.md`](../README.md) — System Overview & Developer Quickstart Guide

---

## 21. Academic References & Citations

1. **Center for Environmental and Geographic Information Services (CEGIS):** *Monitoring of River Morphological Changes and Riverbank Erosion Forecasting in Bangladesh*, Annual Technical Reports, Dhaka, Bangladesh. [https://www.cegisbd.com](https://www.cegisbd.com)
2. **Bangladesh Water Development Board (BWDB) & Flood Forecasting and Warning Centre (FFWC):** *Annual Flood Report and Hydrological Bulletins*, Ministry of Water Resources, Government of the People's Republic of Bangladesh. [http://www.ffwc.gov.bd](http://www.ffwc.gov.bd)
3. **Directorate of Land Records and Surveys (DLRS):** *Manual of Cadastral Surveying and Mouza Map Preparation*, Ministry of Land, Government of the People's Republic of Bangladesh. [https://www.dlrs.gov.bd](https://www.dlrs.gov.bd)
4. **Ministry of Disaster Management and Relief (MoDMR):** *National Plan for Disaster Management (NPDM 2021–2025)*, Disaster Management and Relief Division, Dhaka, Bangladesh. [https://modmr.gov.bd](https://modmr.gov.bd)
5. **Bangladesh Bureau of Statistics (BBS):** *Statistical Yearbook of Bangladesh*, Ministry of Planning, Government of the People's Republic of Bangladesh. [https://www.bbs.gov.bd](https://www.bbs.gov.bd)
6. **Brammer, H. (2012):** *The Physical Geography of Bangladesh*, The University Press Limited (UPL), Dhaka, ISBN: 978-984-506-056-1.
7. **European Space Agency (ESA):** *Copernicus Sentinel-1 SAR and Sentinel-2 Multi-Spectral Earth Observation Technical Guidelines*. [https://sentinels.copernicus.eu](https://sentinels.copernicus.eu)
8. **Esri:** *ArcGIS Online World Imagery Basemap Services and Documentation*. [https://www.arcgis.com](https://www.arcgis.com)
9. **Leaflet Open-Source Project:** *Leaflet JavaScript Library for Mobile-Friendly Interactive Maps (v1.9.4)*. [https://leafletjs.com](https://leafletjs.com)
10. **Shi, X., Chen, Z., Wang, H., Yeung, D. Y., Wong, W. K., & Woo, W. C. (2015):** *Convolutional LSTM Network: A Machine Learning Approach for Precipitation Nowcasting*, Advances in Neural Information Processing Systems (NeurIPS 2015), 28, 802–810.
11. **Ronneberger, O., Fischer, P., & Brox, T. (2015):** *U-Net: Convolutional Networks for Biomedical Image Segmentation*, Medical Image Computing and Computer-Assisted Intervention (MICCAI), Springer, LNCS 9351, 234–241.

---

## 22. Team Information and Copyright

- **Team Name:** GeoNeural
- **Team Leader:** Pantho Raj Biswas
- **Team Member:** Puja Paul

**Copyright:** © 2026 GeoNeural. All rights reserved.  
*BhumiDorpon is developed and maintained by Team GeoNeural as an advanced geospatial research and demonstration platform for cadastral hazard monitoring in Bangladesh.*
