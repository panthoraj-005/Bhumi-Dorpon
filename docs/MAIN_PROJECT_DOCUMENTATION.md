# BhumiDorpon — Main Project Documentation

> **Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**  
> *Developed by Team GeoNeural for the LandTech Innovation Hackathon 2026*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.13-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Turf.js](https://img.shields.io/badge/Turf.js-7.4.0-darkgreen?style=flat)](https://turfjs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.11-yellow?style=flat&logo=vitest)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-92%20passed%20(16%20suites)-brightgreen?style=flat)](../tests/)
[![Team](https://img.shields.io/badge/Team-GeoNeural-indigo?style=flat)](#26-settings-hub-team-information-and-credits)

> **Document Status:** Comprehensive Master System Reference (merged README + Main Project Documentation)  
> **Product Version:** v1  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Target Audience:** Hackathon Evaluators, Academic Researchers, Land Surveyors, Engineering Teams  
> **Documentation Suite:** [PRD](PRD.md) | [TRD](TRD.md) | [App Flow](APP_FLOW.md) | [Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Auth Specification](AUTH_SPECIFICATION.md) | [Security Specification](SECURITY_SPECIFICATION.md)

> [!IMPORTANT]
> **DEMO DATA DISCLAIMER AND ARCHITECTURAL DISCLOSURE**
> - **Strictly Synthetic / Dummy Data:** All landowner names (e.g., *"Abdul Karim"*, *"Rahima Begum"*), cadastral plot numbers (*Dag No.*), record-of-rights deed numbers (*Khatian No.*), boundary coordinate readouts, and compensation figures are fictional mock records created solely for academic evaluation and hackathon demonstration.
> - **No Government Service or Legal Title:** This is an educational prototype. It does not connect to live government databases, does not provide certified legal land records, and cannot be used for legal land titling or disaster dispatch.
> - **Client-Side Prototype with Isolated Demo Access:** The application runs client-side with deterministic mock datasets in `/mocks` and `/public/mocks`. Demo access allows exploration of all visual features while strictly isolating administrative operations.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement and Context](#2-problem-statement-and-context)
- [3. Objectives](#3-objectives)
- [4. Key Features](#4-key-features)
- [5. Disaster Monitoring Modules](#5-disaster-monitoring-modules)
- [6. Land Information Search and Report Engine](#6-land-information-search-and-report-engine)
- [7. Disaster-Related Land Change and Deep-Learning Risk Analysis](#7-disaster-related-land-change-and-deep-learning-risk-analysis)
- [8. Four-Step Landslide Hierarchy and Event Selector](#8-four-step-landslide-hierarchy-and-event-selector)
- [9. Bangla Default and English Localization](#9-bangla-default-and-english-localization)
- [10. Authentication, Registration and Demo Access](#10-authentication-registration-and-demo-access)
- [11. Top-Level Scroll to Disasters](#11-top-level-scroll-to-disasters)
- [12. Pure Leaflet Cartography and Dual-Map Synchronizer](#12-pure-leaflet-cartography-and-dual-map-synchronizer)
- [13. Cadastral Four-Corner GPS Boundary Readouts](#13-cadastral-four-corner-gps-boundary-readouts)
- [14. Google Earth Parcel Outline Feature](#14-google-earth-parcel-outline-feature)
- [15. GeoAI Forecasting, Rule 5 Compliance and Data Guardrails](#15-geoai-forecasting-rule-5-compliance-and-data-guardrails)
- [16. System Architecture, Data Store and Technology Stack](#16-system-architecture-data-store-and-technology-stack)
- [17. Installation, Quick Start and Troubleshooting](#17-installation-quick-start-and-troubleshooting)
- [18. How to Use the Application](#18-how-to-use-the-application)
- [19. Testing and Verification](#19-testing-and-verification)
- [20. Known Limitations and Future Roadmap](#20-known-limitations-and-future-roadmap)
- [21. Project Structure](#21-project-structure)
- [22. Documentation Suite Index](#22-documentation-suite-index)
- [23. AI Tools Used](#23-ai-tools-used)
- [24. Project Update History](#24-project-update-history)
- [25. Academic References and Citations](#25-academic-references-and-citations)
- [26. Settings Hub, Team Information and Credits](#26-settings-hub-team-information-and-credits)
- [27. License and Repository Links](#27-license-and-repository-links)

---

## 1. Project Overview

**BhumiDorpon** (Bengali: ভূমিদর্পণ — *"Mirror of the Land / Mirror of the Earth"*) is an interactive, map-centric geospatial web platform that demonstrates how satellite remote-sensing observations, cadastral land records, and deep-learning risk predictions can be combined into an accessible, bilingual dashboard. Built for the geographic and administrative context of Bangladesh, it brings together parcel-level cadastral boundaries (*Dag No.* [cadastral plot] and *Khatian No.* [record-of-rights deed]), historical environmental losses and accretion gains, forward-looking hazard projections, and cadastral intelligence in one responsive interface.

The platform consists of **two distinct but connected systems**:

1. **Disaster monitoring system:** Explores, visualizes, and analyzes land-surface changes caused by natural hazards across five categories: **River Erosion**, **Flooding**, **Landslides**, **Char Island Formation**, and **Coastal Erosion & Accretion**.
2. **Land information system:** A search-and-report interface (`/land-information`) that organizes available parcel identification, ownership, sale status, legal disputes, tax, loan/mortgage indicators, and registration/mutation history into a structured report, so users can review available information before buying land. It clearly distinguishes demo data from verified records.

The two systems are kept separate so that environmental change information is never confused with legal or transaction records.

**Map-centered exploration.** Land administration and disaster reporting have traditionally operated in disconnected silos. Official land records (cadastral sheets, khatians, mouza maps) exist as paper sheets or semi-digitized tabular portals that do not reflect ground realities, while flood bulletins and disaster warnings are high-level summaries that do not link to parcel boundaries. BhumiDorpon bridges this divide by placing synchronized interactive maps at the center of the experience. Users navigate administrative hierarchies (Division → District → Upazila → River/Hill/Mouza) and inspect how hazards intersect with cadastral plots, homesteads, agricultural parcels, and community infrastructure.

The disaster platform also demonstrates a **multi-hazard deep-learning prediction workflow**: Sentinel-1/2 → ConvLSTM / HydroSAR / InSAR SlopeNet / CoastWatch → hazard probability scores → cadastral plot intersection, estimating which parcels face future disaster risk.

---

## 2. Problem Statement and Context

### 2.1 Geographical and Social Context

Bangladesh lies at the downstream confluence of three Himalayan river systems — the **Ganges (Padma)**, the **Brahmaputra (Jamuna)**, and the **Meghna** — forming the world's largest and most active delta. Over 80% of the country consists of low-lying alluvial floodplains rarely rising more than 10 meters above mean sea level. This produces extreme territorial volatility:

- High monsoon discharges and unstable alluvial sediment cause rapid riverbank collapse, consuming thousands of hectares of arable land annually.
- Monsoon downpours and transboundary upstream runoff inundate haor and floodplain depressions.
- Coastal storm surges, cyclones, and tides erode marine coastlines while depositing ephemeral mid-channel sandbars (*chars*).
- Intense monsoon rainfall in the southeastern tertiary hills triggers deadly debris slides on deforested slopes.

With a population density above 1,100 people per square kilometer, land is the basis of livelihood, food security, social dignity, and intergenerational survival.

### 2.2 Disaster-Related Land Change Problem

1. **Erosion of Cadastral Boundaries:** Braided rivers such as the Jamuna and Padma erode thousands of hectares of farmland annually, obliterating earthen boundary markers (*ail*) and dislocating farming communities.
2. **Post-Flood Inundation and Siltation:** Monsoon inundation in wetland haors (e.g., Sylhet, Sunamganj) submerges parcels beneath up to 2.5 meters of water, depositing silt layers that spark tenure disputes after floodwaters recede.
3. **Slope Instability in Hilly Terrain:** In the Chittagong Hill Tracts (CHT), intense rainfall (> 200 mm/24h) triggers destructive landslides on steep slopes (38°–44°), displacing topsoil and threatening settlements.
4. **Char Accretion and Tenure Ambiguity:** Emerging river sandbars (*chars*) generate friction between private re-emergence claims (*payosti*) and unassigned state reserve lands (*Khas* land under Deed 1/1).
5. **Lack of Transparent Compensation Tracking:** Displaced landholders often cannot verify whether their lost land has been surveyed, categorized, or marked *Paid*, *Approved*, or *Pending*.
6. **Tenure Disruption:** When boundary markers vanish, owners lose physical possession of ancestral plots; when water recedes or new chars emerge, violent disputes erupt between displaced owners and land grabbers because verifiable spatial boundary coordinates are absent.

**The macro-micro information gap.** After a hazard, citizens cannot verify which Dag numbers were lost or submerged; Assistant Commissioners of Land (AC Land) and Upazila Surveyors lack spatial tools to rapidly compute aggregate loss areas for relief compensation; and disaster planners lack an integrated portal connecting macro-level hazard envelopes to micro-level landownership deeds.

### 2.3 Scattered Land Information and Pre-Purchase Risk

- **Scattered Land Records:** Deeds, ownership details, sale information, mutation history, land development tax, mortgage/loan indicators, and court-dispute information may be maintained in different places.
- **Difficulty in Verification:** Buyers may struggle to collect and cross-check these details, risking delays, disputes, or discovering problems only after purchase.
- **Post-Disaster Land Changes:** Disasters may physically alter or erase land while older records continue to describe its previous condition. Fraud or a parcel's physical disappearance may only become apparent after purchase.
- **BhumiDorpon's Approach:** The land-information search brings available parcel details into one structured view for review before purchase, while disaster monitoring separately describes physical land change.
- **Prototype Limitation:** The prototype uses synthetic demo records and does not certify land records or replace official verification or legal advice.

---

## 3. Objectives

- **Centralized Multi-Hazard Dashboard:** An accessible interface for inspecting 5 hazard categories across representative pilot districts.
- **Bilingual Accessibility:** Seamless switching between Bengali (default) and English without page reloads.
- **Initial Auth and Demo Access:** An intuitive entry screen with registration, login, and isolated demo exploration.
- **Pre-Purchase Land Verification:** One searchable parcel report covering ownership, sale status, disputes, land development tax, mortgage/loan indicators, and registration/mutation history, preserving Dag and Khatian identifiers as text.
- **Synchronized Visual Comparison:** Side-by-side *Before* and *After/Forecast* maps with synchronized panning and zooming.
- **Cadastral Plot Coupling:** Connect discrete parcel records (*Dag No.*, *Khatian No.*, 4-corner GPS coordinates) with continuous hazard footprints.
- **Dual Basemap Flexibility:** An offline-ready vector **Light GIS** basemap and high-resolution **Satellite** imagery (Esri World Imagery).
- **Ethical AI Guardrails:** Strict compliance with Hackathon Rule 5 by suppressing all financial disbursement figures on predictive forecast views.

---

## 4. Key Features

| Feature | Description | Interaction | Benefit |
|---|---|---|---|
| **Land Information Search (primary)** | Dedicated `/land-information` system searching District, Upazila, Mouza, Dag No., and Khatian No., gathering parcel, ownership, sale, dispute, tax, loan/mortgage, and registration/mutation details into one report. | Click **"Land Information / ভূমির তথ্য"** in the header and follow the cascading fields. | Lets users review available land information before purchase instead of collecting scattered records. Does not certify legal title or replace official verification. |
| **Bangla Default and English Switch** | Bilingual UI defaulting to Bangla on first visit with a zero-layout-shift English toggle. | Click `বাংলা \| English` in the top header bar. | Immediate accessibility for rural citizens and land surveyors. |
| **Auth Entry and Isolated Demo** | Glassmorphic auth modal on first visit and a `/login` route with one-click Demo access. | Click **"Demo / ডেমো হিসেবে প্রবেশ করুন"**. | Immediate exploration for evaluators while isolating administrative actions. |
| **Disaster Change and DL Risk Analysis** | Dedicated section of the land report detailing historical loss/deposition and 4 deep-learning risk forecasts. | Search any parcel in `/land-information` and inspect the disaster section. | Separates physical loss from legal title. |
| **Four-Step Landslide Chain Selector** | District → Upazila → Hill → Landslide Event selector in `SelectorChain.tsx` with URL sync (`?d&u&h&ev`), newest-first sorting, auto-selection, and honest empty states. | Select District → Upazila → Hill → Event on `/landslide/[mode]`. | Connects hills directly to historical disaster records and forecast scenarios without duplicate controls. |
| **Right-Aligned Header Toolbar** | Action controls right-aligned on desktop (`md:justify-end`) with overflow wrapping directly below the language toggle; left-aligned on mobile. | Resize between mobile (<768px) and desktop (≥768px). | Keeps top controls anchored under the language toggle on wide viewports. |
| **Complete Table and Data Localization** | Full Bengali localization of tables, headers, cells, status badges, sublabels, chart `aria-label`s, and data-derived strings, preserving allowlisted acronyms (GIS, InSAR, KML, GeoJSON, CSV, BDT/৳, DL, m, mm, km). | Switch the toggle to `বাংলা` on any hazard table, flood owner ledger, or land report. | Eliminates untranslated English in tables. |
| **Scroll to Disasters** | Smooth-scroll button on the homepage hero. | Click **"Explore Disasters / দুর্যোগসমূহ দেখুন"**. | Fast navigation to `#disaster-options` with header offset. |
| **Side-by-Side Synced Compare** | Synchronized Leaflet viewports: *Before* left, *After* (or *Forecast*) right. | Pan or zoom either viewport. | Immediate visual verification of land loss, shoreline retreat, or flood inundation. |
| **Dual Basemap Engine** | Switches between offline vector **Light GIS** and **Satellite** imagery. | Toggle basemaps in the map chrome bar. | Light GIS maximizes boundary legibility; Satellite gives real-world context. |
| **Four-Corner GPS Readouts** | Exact latitude/longitude for NW, NE, SE, SW corners to 6 decimal places. | Open a parcel on the Flood Owner Land page and click **"Copy 4 Corners"**. | Lets landholders and surveyors recover lost plot boundary markers on the ground. |
| **Google Earth KML Export** | Client-side KML 2.2 polygon generation and Google Earth Web launch. | Click **"Open in Google Earth"** on the Flood Owner Land Detail page. | 3D satellite inspection and boundary recovery without third-party GIS software. |
| **GeoAI Forecast Mode (Demo)** | 1-year forward predictive hazard envelopes with Rule 5 financial suppression. | Toggle **Recorded / Forecast** in the header navigation bar. | Supports anticipatory planning while preventing speculative estimates being mistaken for approved aid. |
| **Owner Compensation Ledger** | Tabular accounting of affected landowners with Dag No., Khatian No., lost area, and status. | Filter by status badges: `Paid`, `Approved`, `Pending`. | Transparent, auditable tracking of disaster assistance liabilities. |
| **Multi-Unit Area Conversion** | Recalculates areas across Decimals, Acres, and Hectares. | Toggle the unit selector in the navigation bar. | Supports both traditional local units and international metric units. |
| **Settings Hub** | Verified project specifications, architecture disclosures, and team attribution. | Click **Settings** in the sidebar (**About Project**, **Team Information**). | Transparent access to project purpose and team credentials. |

**Additional v1 highlights**

- **Two-System Design:** The five-module disaster monitoring system is separated from the land-information search system.
- **Structured Six-Section Cadastral Report:** Land ID (with 4-corner GPS), Ownership, Sale Status, Legal Disputes, Tax and Payment Records, and Registration History.
- **Pure Leaflet Cartography:** Side-by-side synchronized Before/After maps with an offline vector basemap and no external vector tile servers.
- **Rule 5 Compliance and Data Transparency:** Financial payout fields are suppressed on forecast views, with transparent badging for demo data and unverified external records.

---

## 5. Disaster Monitoring Modules

The disaster monitoring system covers five hazard modules and focuses on physical land change, loss/gain, and hazard exposure.

| Module | Route | Pilot Geographic Cluster |
|---|---|---|
| **1. River Erosion** | `/river-erosion` | Sirajganj (Kazipur, Jamuna River) |
| **2. Flood Monitoring** | `/flood` | Sylhet (Gowainghat, Jaflong); Sunamganj (Tahirpur) |
| **3. Landslide Hazards** | `/landslide` | Chittagong and Rangamati (Batali Hill, Ghagra) |
| **4. Char Islands** | `/char` | Sirajganj (Kazipur, Char Girish) |
| **5. Coastal Shoreline** | `/coastal` | Bhola (Monpura, Char Fasson); Noakhali (Hatiya) |

### 5.1 River Erosion (`/river-erosion`)

- **Physical Dynamics:** Braided channels of the Jamuna migrate hundreds of meters during monsoon surges, collapsing sand-silt banks and swallowing entire mouzas.
- **Cartography:** Active braided channel; dark blue surveyed baseline bankline vs. light blue current bankline; eroded loss strips with coral diagonal hatch (`pattern-loss`); transect retreat vectors (e.g., `42 m`, `38 m`); mouza loss/gain badges.
- **Data Outputs:** Mouza Summary Panel, Water Status Card (river width, erosion velocity), and Landowner Compensation Table.

### 5.2 Flood Monitoring (`/flood`)

- **Physical Dynamics:** Seasonal monsoon flooding and upstream flash runoff submerging haors, agricultural plains, and rural homesteads.
- **Cartography:** Multi-depth inundation contours (Shallow `<0.5m`, Moderate `0.5–1.5m`, Deep `>1.5m`); submerged cadastral parcels color-coded by individual landowner.
- **Cadastral Detail Flow:** Drill-down to Flood Owner Land Detail pages with 4-corner GPS coordinates, copy buttons, GeoJSON export, and Google Earth KML export (see Articles 13 and 14).

### 5.3 Landslide Hazards (`/landslide`)

- **Physical Dynamics:** Saturated tertiary shale-sandstone slopes failing under intense monsoon downpours (> 200 mm/24h).
- **Cartography:** Synthetic DEM hillshade overlays, 10-meter index contour isolines, spot elevation tags, slope angles (38°–44°), failure scarp polygons (red), and debris runout buffers (orange).
- **Selector:** Four-step dependent selector (see Article 8).

### 5.4 Char Island Dynamics (`/char`)

- **Physical Dynamics:** Mid-channel sandbars (*chars*) emerging, migrating, and eroding through alluvial deposition and monsoon floods.
- **Cartography:** Baseline char perimeter vs. current shape; green accretion tips (new land) vs. coral erosion flanks; river channel corridors.
- **Tenure Protection:** A dedicated card catalogs unowned `State Khas Alluvial Accretion` under deed `1/1 (State)` to prevent illegal land grabbing.

### 5.5 Coastal Shoreline (`/coastal`)

- **Physical Dynamics:** Estuarine tides, storm surges, and marine erosion interacting with deltaic mudflat accretion in the Bay of Bengal.
- **Cartography:** Historical vs. current shoreline (coastline migration); coastal embankment defense lines; intertidal mudflats; bathymetry/marine depth contours.
- **Revenue Protection:** A dedicated card tracks unassigned offshore mudflats for state revenue administration.

---

## 6. Land Information Search and Report Engine

Located at `/land-information`, this system addresses a different problem from disaster monitoring: land documents and transaction information can be scattered across multiple records, making it hard for a buyer to check a parcel before purchase. It gathers the available information into one structured report so users can identify issues requiring official follow-up before paying or completing a transaction.

### 6.1 Five-Tier Cascading Search

The selected administrative area filters the next field:

1. **District (জেলা):** Sirajganj, Sylhet, Rangpur, Cox's Bazar, Bhola, Chittagong.
2. **Upazila (উপজেলা):** Filtered by selected District.
3. **Mouza (মৌজা):** Filtered by selected Upazila, with JL Numbers.
4. **Dag Number (দাগ নম্বর):** Alphanumeric or numeric strings (e.g., `0101`, `2271`).
5. **Khatian Number (খতিয়ান নম্বর):** Cadastral survey strings (e.g., `RS-475`, `SA-112`).

**Leading-zero preservation:** Dag and Khatian identifiers are stored and filtered strictly as string tokens (`dagNo.trim()`), never converted to integers, so values such as `"0101"` and `"0042"` keep their leading zeros.

### 6.2 Capabilities

| Capability | Description | User Value |
|---|---|---|
| **Five-Level Parcel Search** | District → Upazila → Mouza → Dag No. → Khatian No. | Locates the intended parcel without losing original identifiers. |
| **Ownership and Parcel Identity** | Parcel identifiers, recorded owners, ownership shares, area, classification, boundary coordinates. | Compare the offered parcel with the available record. |
| **Sale and Legal Status** | Sale/listing status and recorded dispute or court-case information. | Flags details needing further checking before purchase. |
| **Tax, Loan/Mortgage and Record History** | Land development tax, loan/mortgage indicators (where the dataset provides them), registration, and mutation history. | Reduces manual searching across separate sources. |
| **Data Availability Labels** | Distinguishes demo data, verified records, unavailable information, and records needing an external connection. | Makes the limits of the displayed information visible. |
| **Disaster Context Kept Separate** | Disaster land change and risk analysis appear in their own section. | Prevents disaster findings from mixing with legal/transaction records. |

### 6.3 Structured Six-Section Report

- **Section A: Land Identification:** District, Upazila, Mouza, JL No, Dag No, Khatian No, Area (Decimal and Acre), Land Classification, 4-Corner GPS coordinates.
- **Section B: Ownership Information:** Recorded owners, ownership shares, father's name, verification timestamp.
- **Section C: Sale and Listing Status:** Active sale status, listing price, source attribution.
- **Section D: Legal Disputes and Court Cases:** Civil suit reference numbers, dispute status, court jurisdiction.
- **Section E: Land Development Tax (LD Tax):** Assessment period, outstanding balance, last payment date.
- **Section F: Registration and Ownership History:** Transfer chain, mutation record dates, deed volumes.

### 6.4 Data Availability and Attribution Badges

Every section carries one of these badges:

- `যাচাই করা` (Verified Record)
- `ডেমো ডেটা` (Demo Data)
- `তথ্য পাওয়া যায়নি` (No Record Found)
- `বাহ্যিক ডেটা সংযোগ প্রয়োজন` (External Connection Required)

### 6.5 Data and Legal Scope

The current application is a client-side prototype using synthetic demo data. It does not independently certify ownership, prove a deed is genuine, verify mortgage status, or connect to live government databases. Buyers must verify records with the relevant official authorities before a transaction. Search records use parcel identifiers and structured mock records and are distinct from the five hazard-specific map packages (see Article 16).

---

## 7. Disaster-Related Land Change and Deep-Learning Risk Analysis

Directly below the cadastral report (referred to as **Section 5** of the land report), a specialized section titled **"দুর্যোগজনিত ভূমির পরিবর্তন ও ঝুঁকি বিশ্লেষণ" / "Disaster-Related Land Change and Risk Analysis"** is displayed.

### 7.1 Historical Land Change and Loss-Gain Accounting

- Event type (River Erosion, Flash Flood, Landslide, Coastal Surge).
- Observation date and affected area (decimals / sq meters).
- Measured net loss or sediment accretion.

### 7.2 Submerged Land Cadastral Preservation

When a parcel has been swallowed by a river (e.g., Dag `0101` in Kazipur), it is designated **"Completely Submerged / নদীগর্ভে বিলীন"**. Physical loss is separated from legal tenure: the historical cadastral identity, deed, and ownership record are preserved to protect citizen re-emergence rights under Section 86 of the State Acquisition and Tenancy Act.

### 7.3 Deep-Learning Multi-Hazard Risk Prediction

For existing plots, risk predictions come from 4 specialized models:

| Hazard | Model | Forecast Basis | Confidence |
|---|---|---|---|
| River Erosion | ConvLSTM Spatiotemporal Sequence Model | 1-year forecast | 82% |
| Flood Inundation | HydroSAR Inundation Depth Network | Monsoon season forecast | 88% |
| Landslide Risk | InSAR SlopeNet Displacement Predictor | Rainfall trigger forecast | 79% |
| Coastal Surge and Erosion | CoastWatch Estuarine Retreat Model | 1-year shoreline model | 75% |

These are exploratory predictions, never official legal determinations.

---

## 8. Four-Step Landslide Hierarchy and Event Selector

Integrated into `components/SelectorChain.tsx` for both Recorded and Forecast modes on `/landslide` and `/landslide/[mode]`.

### 8.1 Four-Step Dependent Selection

1. **District (জেলা):** Chittagong, Rangamati, Bandarban, Cox's Bazar.
2. **Upazila (উপজেলা):** Filtered by selected District.
3. **Hill / Mountain (পাহাড়):** Monitored hills within the Upazila (e.g., Ghagra, Furamon, Vedvedi, Chimbuk, Himchari, Nilgiri, Sajek Ridge).
4. **Landslide Event (ভূমিধসের ঘটনা):** Fourth dependent step (Badge ④) listing all recorded landslide disasters (Recorded mode) or simulation scenarios (Forecast mode) for the selected hill, sorted newest first with event dates.

### 8.2 Behavior Rules

- **URL State:** The selector is driven by URL parameters `?d&u&h&ev`.
- **Auto-Selection and Clearing:** Selecting a hill auto-selects the newest event if `ev` is empty. Changing District, Upazila, or Hill clears `ev`. Reset-to-default also clears `ev`.
- **Honest Empty State:** Hills without recorded events (e.g., Mirinja, Keokradong, Teknaf Ridge, Inani Range, Jaflong Hill) show a disabled combobox with *"এই পাহাড়ে কোনো ভূমিধসের ঘটনা রেকর্ড নেই"* / *"No landslide events recorded for this hill"*; no fictitious events are invented.
- **Dual-Mode Integration:** Selecting an event immediately updates map bounds, contour vectors, and telemetry cards. Switching between Recorded and Forecast retains `d`, `u`, and `h` while resolving the event list for that mode.
- **Dynamic Detail Telemetry:** The chosen event drives 8 metrics: event title, date, 24-hour rainfall, debris volume, slope gradient, affected slope area, homesteads at risk, and impact summary banner.
- **Unified Single-Selector Architecture:** The redundant standalone `MountainEventSelector` card was removed from `/landslide/[mode]`; `SelectorChain` is the sole authoritative selector.

---

## 9. Bangla Default and English Localization

BhumiDorpon uses a centralized translation dictionary in `lib/translations.ts` instead of scattered hardcoded language checks.

- **Default Language:** Bangla (`bn`) on first visit; the preference is stored in `localStorage` under `bhumidorpon_lang`.
- **Translation Lookup:** All keys resolve via `t(key, lang)`.
- **Persistent Zero-Layout-Shift Switcher:** The header button (`বাংলা | English`) switches the entire interface instantly, with no page reload, no reset of map pan/zoom, and no loss of cascading search filters.
- **Bengali Numerals:** `formatNumberLocalized(num, lang)` converts Arabic digits (`0-9`) to Eastern Nagari numerals (`০-৯`) when `lang === "bn"`, formatting commas and decimals appropriately.
- **Comprehensive Coverage:** Navigation, modals, search forms, reports, tables, tooltips, units, empty states, table headers and cells, badges, chart `aria-label`s, and data-derived strings (hill names, risk zone suffixes, plot/owner IDs, survey types, land classes, dates) all pass through centralized localizers.
- **Header Layout:** The toolbar is right-aligned on tablet and desktop (`md:justify-end md:flex-1 md:ml-auto`), wrapping overflow rows beneath the language toggle, and heading line-heights are calibrated so Eastern Nagari ascenders and descenders are not clipped.

---

## 10. Authentication, Registration and Demo Access

The authentication subsystem in `lib/auth.ts` provides a client-side session management model.

- **First-Visit Modal:** `components/auth/AuthModal.tsx` intercepts the view for unauthenticated visitors with a frosted glassmorphic card.
- **Dedicated Login Route:** A standalone `/login` page with Login and Registration forms.
- **Login:** Username/Email and Password.
- **Registration:** Full Name, Username, Email, Password, Password Confirmation, and Intended Role.
- **Seeded Test Credentials:**
  - `surveyor` / `password123` (Surveyor Role)
  - `citizen` / `citizen123` (Citizen Role)
  - `admin` / `admin123` (Admin Role)
- **Validation:** Required fields, 6-character password minimum, real-time password confirmation matching, duplicate username detection, bilingual error messages, and Eye / EyeOff password visibility toggles.
- **Isolated Demo Access:** The **"Demo / ডেমো হিসেবে প্রবেশ করুন"** button creates an ephemeral session (`isDemo: true`) with citizen read-only permissions; `canPerformAdministrativeAction(user)` always evaluates to `false`.
- **Demo Banner:** `DemoBanner.tsx` shows a persistent top bar reminding visitors of demo mode, with a quick login link.

---

## 11. Top-Level Scroll to Disasters

A prominent hero button on the Home Dashboard:

- **Labels:** **"দুর্যোগসমূহ দেখুন"** / **"Explore Disasters"**.
- **Behavior:** Smooth browser scrolling (`behavior: "smooth"`) to the `#disaster-options` container.
- **Offset:** `scroll-mt-24` ensures the sticky header and demo banner never conceal the section heading.

---

## 12. Pure Leaflet Cartography and Dual-Map Synchronizer

### 12.1 Basemaps

- **Engine:** Pure **Leaflet 1.9.4** across all 5 hazard modules (no MapLibre/Mapbox).
- **Light GIS Basemap:** Renders fully offline from client-side SVG vector paths (`components/map/basemap/LightGisBasemap.tsx`) on a high-contrast neutral `#EEF0E6` background, with no external vector tile servers.
- **Satellite Basemap:** Optional high-resolution Esri World Imagery tile streaming, switched via the map chrome bar.

### 12.2 Bidirectional Dual-Map Synchronization

*Before* and *After* maps are displayed side-by-side. Panning or zooming either map mirrors the viewport to its pair, guarded by a re-entrancy lock (`isSyncing`) that prevents recursive loop stutter. Regional bounding boxes are configured per hazard.

### 12.3 Cartographic Chrome and SVG Hatch Patterns

- Graticules, dynamic metric scale bar, north arrow, and locator inset mini-map.
- Dynamic `<pattern>` definitions injected into the Leaflet SVG renderer: `pattern-loss` (coral diagonal stripes), `pattern-khas` (slate cross-hatch), `pattern-forecast` (purple dashed stripes).

### 12.4 In-Map Zoom Controls

High-visibility `+` and `−` buttons on the map chrome with immediate first-click execution.

---

## 13. Cadastral Four-Corner GPS Boundary Readouts

- **Quadrilateral Standardization:** Parcels are standardized into 4-corner quadrilaterals sorted clockwise: NW (`1`), NE (`2`), SE (`3`), SW (`4`), as a closed ring of 5 coordinate tuples where the 5th repeats the 1st.
- **Six-Decimal Precision:** Corner coordinates are formatted to 6 decimal places (~0.11 m ground accuracy). Centroid coordinates are intentionally suppressed to avoid geometric confusion.
- **Flood Owner Land Detail Page:** Located at `/flood/[mouzaId]/[floodId]/owner/[ownerId]`, showing the landowner profile header, 4-corner GPS table, one-click **Copy 4 Corners** buttons, GeoJSON download, and Google Earth KML export.

---

## 14. Google Earth Parcel Outline Feature

On the Flood Owner Land Detail page, directly below the Four Corner Coordinates table, an **Open in Google Earth** button lets landowners and relief officers export parcel boundaries to 3D satellite visualization.

- **Workflow:** One click opens Google Earth Web in a new tab centered on the parcel centroid and triggers an immediate download of `<floodId>_dag_<dagNo>_outline.kml`.
- **KML Serializer (`lib/googleEarth.ts`):** Pure client-side generation of valid OGC KML 2.2 XML with a closed 5-point coordinate ring, 4 numbered corner pins (`1 NW` to `4 SW`), and full XML escaping.
- **Camera URL:**

  ```text
  https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r
  ```

- **Privacy:** Only the numeric centroid and camera range are transmitted via URL; landowner identity and deed details stay on the local device, with zero backend transmission.

### Google Earth vs. Google Earth Engine

| Dimension | Google Earth (Implemented) | Google Earth Engine (Proposed) |
|---|---|---|
| **Role and Purpose** | Client-side 3D geographic visualizer for parcel inspection. | Cloud-scale planetary geospatial computing platform for satellite data analysis. |
| **Operational Status** | **Operational and verified** in the v1 release. | **Proposed future enhancement** (Phase 3 roadmap). |
| **Execution Environment** | User's web browser (`earth.google.com/web`). | Google Cloud / Earth Engine compute infrastructure. |
| **Data Ingestion** | Reads client-downloaded KML 2.2 files locally. | Automates Sentinel-1 SAR and Sentinel-2 optical image ETL. |

---

## 15. GeoAI Forecasting, Rule 5 Compliance and Data Guardrails

- **GeoAI Forecast Mode (Demo):** Toggling **Recorded / Forecast** shows 1-year forward predictive hazard envelopes, supporting anticipatory planning.
- **Rule 5 Compliance:** In Forecast mode, all compensation disbursement fields (`Paid`, `Approved`, `Pending`) are strictly suppressed; only projected metrics are shown, so speculative estimates cannot be mistaken for approved aid.
- **Synthetic Data Provenance:** All landowner names, plot numbers, deed records, and figures are deterministic synthetic mock datasets. Persistent disclaimers separate model estimates from certified surveys.
- **Model Disclaimers:** Deep-learning risk estimates are exploratory predictions, never official legal determinations.

---

## 16. System Architecture, Data Store and Technology Stack

### 16.1 Architecture Overview

BhumiDorpon is a client-side web application:

- **Frontend Core:** Next.js 14 App Router, React 18, TypeScript.
- **Cartography Engine:** Leaflet with custom SVG vector rendering for the Light GIS basemap and hazard overlays, plus ESRI satellite tile streaming. All Leaflet maps are dynamically imported with `ssr: false`.
- **Spatial Geometry Engine:** Turf.js executing client-side polygon clipping and 4-corner coordinate extraction.
- **Client State:** Zustand stores for application mode, active units, and map layer toggles (`stores/appStore.ts`).
- **Data Caching:** TanStack React Query managing asynchronous mock data resolution.

### 16.2 Combined Disaster and Land Information Data Store

- **Runtime Store (`public/mocks/*.json`):** Static assets served at `/mocks/*` and fetched by client components via `loadMockJson()` in `lib/data.ts`.
- **Source / Test Store (`mocks/*.json`):** Mirrored copy read synchronously via `fs.readFileSync` in Node.js and Vitest.
- **Per-Area Map Packages (`mocks/areas/<hazard>/` and `public/mocks/areas/<hazard>/`):** Modular spatial GeoJSON bundles resolved via `areas_index.json`.
- **Land Information Records:** The `/land-information` engine uses parcel identifiers and structured mock records (ownership, sale status, disputes, tax, registration/mutation history, and loan/mortgage indicators where supported). This domain is distinct from the five hazard map packages. Mock data is generated deterministically by `scripts/generate-mocks.ts`.

### 16.3 Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js `14.2.15` (App Router) |
| UI Library | React `18.3.1` |
| Language | TypeScript `5.6.2` (Strict mode) |
| Styling | Tailwind CSS `3.4.13` with custom design tokens |
| Mapping | Leaflet `1.9.4`, `react-leaflet` `4.2.1` |
| Spatial Analytics | Turf.js `7.4.0` |
| State Store | Zustand `4.5.5` |
| Data Caching | TanStack React Query `5.59.0` |
| Icons | Lucide React `0.447.0` |
| Unit Testing | Vitest `4.1.11` (16 test suites, 92 unit tests) |

---

## 17. Installation, Quick Start and Troubleshooting

### 17.1 Prerequisites

- **Node.js:** v18.17.0 or higher (v20 LTS recommended)
- **npm:** v9.0.0 or higher
- **Git**

### 17.2 Installation Steps

```bash
# Clone the repository
git clone https://github.com/panthoraj-005/Bhumi-Dorpon.git

# Navigate into the project directory
cd Bhumi-Dorpon

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 17.3 Troubleshooting

- **Port in Use (3000):** Run `npm run dev -- -p 3001` or terminate the existing Node process.
- **Leaflet `window` Undefined in SSR:** All Leaflet maps are dynamically imported with `ssr: false`.
- **Node vs. Browser Storage in Tests:** `lib/auth.ts` includes an in-memory fallback (`nodeMemoryUsers`) so tests execute deterministically in Vitest.

---

## 18. How to Use the Application

1. **Initial Entry:** Click **"Demo / ডেমো হিসেবে প্রবেশ করুন"** to bypass login and explore immediately.
2. **Language Toggle:** Click `বাংলা | English` in the header at any time.
3. **Scroll to Disasters:** Click **"Explore Disasters / দুর্যোগসমূহ দেখুন"** to jump to the hazard modules.
4. **Land Information Search:** Click **"Land Information / ভূমির তথ্য"** in the top navigation and select District → Upazila → Mouza → Dag No. → Khatian No. Review land identity, ownership, sale status, legal disputes, tax, loan/mortgage indicators, and registration/mutation history.
5. **Disaster Analysis:** Within the parcel report, inspect the separate disaster land-change and risk section for recorded loss/gain and forecast information; do not treat it as legal ownership verification.
6. **Landslide Exploration:** Open Landslides, pick a mountain (e.g., Batali Hill), and select a historical event to inspect its footprint.
7. **4-Corner GPS Recovery:** On Flood Owner pages, view the 4-corner GPS table and click **"Open in Google Earth"** to download the KML boundary.

---

## 19. Testing and Verification

BhumiDorpon includes an automated Vitest suite of **16 test suites and 92 unit tests**:

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

**Commands**

```bash
npm test         # Run Vitest across all 16 suites
npm run lint     # Strict TypeScript check (tsc --noEmit)
npm run build    # Static production build
```

**Verification results:** `npm test` — 16 suites / 92 tests passed; `npm run lint` (`tsc --noEmit`) — 0 errors; `npm run build` — all 15 static routes generated with 0 errors.

---

## 20. Known Limitations and Future Roadmap

- **Current Scope:** A client-side prototype using synthetic demo data; no live government database connection and no certified legal land records.
- **Phase 2 (Planned):** FastAPI backend and PostgreSQL 16 + PostGIS 3.4 database deployment.
- **Phase 3 (Planned):** Automated Sentinel-1/2 satellite ingestion via Google Earth Engine (GEE).
- **Phase 4 (Planned):** Live GPU inference clusters and official e-Porcha / DLR&S government API integration.

---

## 21. Project Structure

```text
BhumiDorpon/
├── app/                              # Next.js 14 App Router routes
│   ├── char/                         # Char island module pages
│   ├── coastal/                      # Coastal erosion & accretion module pages
│   ├── flood/                        # Flood monitoring & drill-down pages
│   ├── land-information/             # Global Land Information search & report
│   ├── landslide/                    # Landslide hazards module pages
│   ├── login/                        # Dedicated authentication entry page
│   ├── river-erosion/                # River erosion module pages
│   ├── settings/                     # Settings hub (About Project & Team Information)
│   ├── globals.css                   # Global styles & Tailwind directives
│   ├── layout.tsx                    # Root application layout with AuthModal
│   └── page.tsx                      # National Overview Dashboard
├── components/                       # Modular React UI components
│   ├── AppHeader.tsx                 # Top navigation bar with language & search buttons
│   ├── AppSidebar.tsx                # Collapsible hazard navigation sidebar
│   ├── MountainEventSelector.tsx     # Legacy two-step selector (superseded by SelectorChain on /landslide/[mode])
│   ├── auth/                         # Authentication components (AuthModal, DemoBanner)
│   ├── land-information/             # Land search form and 6-section report cards
│   ├── OwnerTable.tsx                # Landowner compensation & plot status table
│   ├── SelectorChain.tsx             # Cascading geographic selectors (4-step landslide chain)
│   └── map/                          # Cartographic mapping components (incl. basemap/LightGisBasemap.tsx)
├── docs/                             # Authoritative technical specifications
├── lib/                              # Business logic, helpers, and data layer
│   ├── auth.ts                       # Authentication and demo access service
│   ├── landSearch.ts                 # Cascading search & 6-section report builder
│   ├── landslideEvents.ts            # Mountain and historical landslide catalog
│   ├── translations.ts               # Bilingual dictionary & numeral formatter
│   ├── data.ts                       # Typed asynchronous mock data layer
│   ├── googleEarth.ts                # Pure KML generator & Google Earth launcher
│   ├── types.ts                      # TypeScript interfaces (Plots, Owners, Hazards)
│   └── units.ts                      # Land unit conversion utilities & compensation math
├── mocks/                            # Deterministic relational mock JSON datasets
├── public/                           # Static assets, rasters, and area GeoJSON (public/mocks/)
├── scripts/                          # Mock data generator (generate-mocks.ts)
├── stores/                           # Zustand stores (appStore.ts)
├── tests/                            # Automated test suite (16 test files, 92 unit tests)
├── package.json                      # Project dependencies & npm scripts
├── tailwind.config.ts                # Tailwind CSS design system configuration
└── tsconfig.json                     # TypeScript compiler configuration
```

---

## 22. Documentation Suite Index

The `docs/` directory is organized into **10 authoritative Markdown documents** (links are relative to the `docs/` folder):

| # | Document | Primary System Scope and Core Technical Coverage |
|---|---|---|
| 1 | [**PRD.md**](PRD.md) | **Product Requirements Document:** problem statement, functional requirements (FR-001 to FR-028), localization, auth, land search, landslide selectors, non-functional requirements. |
| 2 | [**TRD.md**](TRD.md) | **Technical Requirements Document:** architecture stack, Leaflet cartography, math conversions, KML serializer, auth session model, search workflows. |
| 3 | [**APP_FLOW.md**](APP_FLOW.md) | **App Flow / User Flow:** screen flows (S0 to S7), login gate, demo access, language toggle, 5-field land search, landslide selectors. |
| 4 | [**ARCHITECTURE.md**](ARCHITECTURE.md) | **System Architecture:** layered client architecture, auth and search data adapters, pure Leaflet engine, future cloud roadmap. |
| 5 | [**DATABASE_SCHEMA.md**](DATABASE_SCHEMA.md) | **Database and Backend Schema:** five-hazard JSON store schemas, land search entities, auth user models, production PostgreSQL 16 + PostGIS DDL. |
| 6 | [**UI_UX_DESIGN_SYSTEM.md**](UI_UX_DESIGN_SYSTEM.md) | **UI/UX Design System:** minimalist Light GIS design tokens, typography, badges, color palettes, responsive layouts, accessibility. |
| 7 | [**AUTH_SPECIFICATION.md**](AUTH_SPECIFICATION.md) | **Authentication and Authorization Specification:** client prototype auth, isolated demo access, role matrix, government SSO roadmap. |
| 8 | [**SECURITY_SPECIFICATION.md**](SECURITY_SPECIFICATION.md) | **Security Specification:** zero-backend security posture, demo privilege isolation, input sanitization, PII protection. |
| 9 | [**MAIN_PROJECT_DOCUMENTATION.md**](MAIN_PROJECT_DOCUMENTATION.md) | **Main Project Documentation:** master compendium of all project capabilities, academic citations, and milestone history. |
| 10 | [**README.md**](../README.md) | **System Overview and Developer Quickstart Guide.** |

---

## 23. AI Tools Used

In compliance with the LandTech Innovation Hackathon Rule Book:

1. **Claude (Anthropic):** Conceptual architecture, requirements structuring, documentation drafting.
2. **ChatGPT (OpenAI):** Domain exploration, problem statements relevant to Bangladesh riverine geography.
3. **Antigravity (Google / Gemini):** AI-assisted development environment and agentic coding assistant for terminal tasks, component implementation, and automated test suite creation.

**Team Accountability:** The GeoNeural team has independently reviewed, verified, and tested all submitted code and architecture. Every team member is prepared to explain and defend all submitted code during hackathon judging.

---

## 24. Project Update History

| Milestone / Version | Date | Key Enhancements and Modifications |
|---|---|---|
| **Initial Submission** | Oct 2026 | Initial prototype establishing the 5 core hazard modules, baseline side-by-side map comparison, and preliminary mock data models. |
| **Data Architecture Refactoring** | Oct 2026 | Rebuilt core data architecture with deterministic mock generator (`scripts/generate-mocks.ts`), producing synchronized relational JSON stores in `public/mocks/` and `mocks/`. |
| **Rule 5 Forecast Guardrails** | Oct 2026 | Refactored `SelectorChain` cascading dropdown hierarchy; implemented strict suppression of financial disbursement metrics on forecast views. |
| **Flood Multi-Owner Flow & Landslides** | Oct 2026 | Implemented flood event views with individual landowner plot color-coding and search; built landslide terrain engine with hillshades and contours. |
| **Cadastral 4-Corner Readouts** | Oct 2026 | Standardized parcels into 4-corner quadrilaterals with fixed NW, NE, SE, SW vertex ordering and 6-decimal GPS coordinate readouts; launched `/flood/.../owner/...` route. |
| **Leaflet Migration & Offline Cartography** | Oct 2026 | Removed all external tile server dependencies and Mapbox imports; migrated the complete mapping engine across all hazard views to pure Leaflet with SVG vector geometry. |
| **Light GIS Basemap & Chrome Upgrade** | Oct 2026 | Engineered custom high-contrast Light GIS basemap, cartographic map chrome, mouza loss/gain badges, and `MouzaSummaryPanel`. |
| **Side-by-Side Dual Map Viewer** | Oct 2026 | Upgraded comparison to simultaneous dual-panel synchronized layout; introduced in-map zoom controls (+/-) and basemap switcher. |
| **Geographic Extent Bounds Alignment** | Oct 2026 | Configured regional bounding boxes per hazard; implemented single-click simultaneous dual-map zoom synchronicity with active re-entrancy locks. |
| **Settings Navigation Hub** | Oct 2026 | Added Settings Hub (`/settings`) with verified About Project and Team Information views displaying official team attribution (Team GeoNeural). |
| **Technical Documentation Suite** | Oct 2026 | Published engineering and specification suite in `/docs`. |
| **GeoAI Forecast Highlighting** | Oct 2026 | Enhanced README with GeoAI forecast highlight, operational troubleshooting guide, and mock data disclosures. |
| **Google Earth Parcel Outline Feature** | Oct 2026 | Implemented "Open in Google Earth" with client-side KML 2.2 serializer, camera URL calculation, and automated tests. |
| **Documentation Alignment** | Oct 2026 | Synchronized project history and test counts to 10 test suites (61/61 passing unit tests). |
| **Documentation Standardization** | Oct 2026 | Consolidated historical documents into 10 authoritative Markdown specifications in `/docs`; translated prose to English. |
| **v1 Release: Auth, Localization, Land Search & Landslide Selectors** | Oct 2026 | Implemented global Bangla default with English toggle (`lib/translations.ts`); entry auth modal and isolated demo access (`lib/auth.ts`); cascading Land Information search across 5 fields with leading zero preservation (`lib/landSearch.ts`); Section 5 multi-hazard DL predictions and submerged parcel preservation; two-step mountain and landslide historical event selector (`lib/landslideEvents.ts`); top-level scroll-to-disasters button; expanded test suite to 14 suites and 78 unit tests (100% passing). |
| **Documentation Audit & Synchronization** | Oct 2026 | Comprehensive audit of all 10 documentation specifications in `/docs`; synchronized duplicate README and Master Documentation copies; aligned route signatures and verified 14 test suites (78/78 passing unit tests). |
| **Change 4: Landslide Event Step, Header Toolbar & Bangla Table Localization** | Oct 2026 | Added 4th dependent step (Landslide Event) to `SelectorChain.tsx` with URL param `ev`, newest-first sorting, auto-selection, and honest empty states; right-aligned header toolbar on `md+` with wrapping under the language toggle and Bengali heading line-height fix; comprehensive Bangla table and data localization across all tables and charts; expanded test suite to 16 suites and 92 passing unit tests. |

---

## 25. Academic References and Citations

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

## 26. Settings Hub, Team Information and Credits

### 26.1 Settings Hub

- **About Project (`/settings/about`):** Architectural overview, hazard explanations, offline cartography notes, and mock data disclosures.
- **Team Information (`/settings/team`):** Official team attribution cards.

### 26.2 Team Information

**Team Name:** GeoNeural  
**Hackathon:** LandTech Innovation Hackathon 2026

| Role | Name | Focus Areas |
|---|---|---|
| **Team Leader** | **Pantho Raj Biswas** | System Architecture, Geospatial Modeling, Leaflet Engine, Data Layer |
| **Team Member** | **Puja Paul** | Frontend Development, UI/UX Design System, Accessibility, Documentation |

**Copyright:** © 2026 GeoNeural. All rights reserved.

BhumiDorpon is developed and maintained by Team GeoNeural as a geospatial research and demonstration platform combining disaster-related land-change monitoring with land-information search for pre-purchase review in Bangladesh. For questions, academic review, or judging inquiries, contact Team GeoNeural via the official repository.

### 26.3 Credits and Acknowledgements

- **Next.js and React Teams:** For the robust web framework and modern App Router foundation.
- **Leaflet and Vladimir Agafonkin:** For the lightweight, flexible mapping library powering all spatial visualizations.
- **Turf.js Community:** For client-side geospatial computational geometry tools.
- **Esri:** For open access to the World Imagery satellite tile service.
- **Radix UI and Lucide Icons:** For accessible UI primitives and crisp icon assets.
- **Vitest and Playwright Teams:** For high-performance testing frameworks that ensure codebase reliability.
- **LandTech Innovation Hackathon Organizers and Mentors:** For framing the challenges of land tenure, climate vulnerability, and digital governance in Bangladesh.

---

## 27. License and Repository Links

### 27.1 License

All rights to the source code, design assets, and documentation are reserved by the development team: **© 2026 GeoNeural. All rights reserved.**

### 27.2 Repository and Demonstration Links

- **GitHub Repository:** [https://github.com/panthoraj-005/Bhumi-Dorpon.git](https://github.com/panthoraj-005/Bhumi-Dorpon.git)
- **Local Demonstration URL:** `http://localhost:3000` (after running `npm run dev`)
- **Live Production Deployment URL:** *Pending deployment / to be provided upon public cloud hosting.*
