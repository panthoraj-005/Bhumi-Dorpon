# BhumiDorpon

> **Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**  
> *Developed by Team GeoNeural for the LandTech Innovation Hackathon 2026*

---

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.13-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Turf.js](https://img.shields.io/badge/Turf.js-7.4.0-darkgreen?style=flat)](https://turfjs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.11-yellow?style=flat&logo=vitest)](https://vitest.dev/)
[![Tests](https://img.shields.io/badge/Tests-92%20passed%20(16%20suites)-brightgreen?style=flat)](tests/)
[![Team](https://img.shields.io/badge/Team-GeoNeural-indigo?style=flat)](#21-team-information-credits-and-acknowledgements)

---

> [!IMPORTANT]
> **DEMO DATA DISCLAIMER & ARCHITECTURAL DISCLOSURE**
> - **Strictly Synthetic / Dummy Data:** All individual landowner names (e.g., *"Abdul Karim"*, *"Rahima Begum"*), cadastral plot numbers (*Dag No.*), record-of-rights deed numbers (*Khatian No.*), boundary coordinate readouts, and compensation figures in this project are strictly fictional mock records created solely for academic evaluation and hackathon demonstration.
> - **No Government Service or Legal Title:** This application is an educational prototype. It does not connect to live government databases, does not provide certified legal land records, and cannot be used for legal land titling or disaster dispatch.
> - **Client-Side Prototype with Isolated Demo Access:** The current application operates client-side with deterministic mock datasets in `/mocks` and `/public/mocks`. Demo access provides immediate exploration of all visual features while strictly isolating administrative operations.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Problem Statement and Objectives](#2-problem-statement-and-objectives)
  - [2.1 Disaster-Related Land Change Problem](#21-disaster-related-land-change-problem)
  - [2.2 Scattered Land Information and Pre-Purchase Risk](#22-scattered-land-information-and-pre-purchase-risk)
  - [2.3 Objectives](#23-objectives)
- [3. Key Features: Disaster Monitoring and Land Information Systems](#3-key-features-disaster-monitoring-and-land-information-systems)
  - [3.1 Most Important Feature: Land Information Search](#31-most-important-feature-land-information-search)
  - [3.2 The Five Disaster Modules](#32-the-five-disaster-modules)
  - [3.3 Land Information Search and Verification System](#33-land-information-search-and-verification-system)
- [4. Global Bangla Default & English Localization](#4-global-bangla-default--english-localization)
- [5. Entry Authentication, Registration & Demo Access](#5-entry-authentication-registration--demo-access)
- [6. Global Land Information Cascading Search & Report Engine](#6-global-land-information-cascading-search--report-engine)
- [7. Section 5: Disaster Change & Deep-Learning Risk Analysis](#7-section-5-disaster-change--deep-learning-risk-analysis)
- [8. Four-Step Landslide Hierarchy & Event Selector](#8-four-step-landslide-hierarchy--event-selector)
- [9. Google Earth Parcel Outline Feature](#9-google-earth-parcel-outline-feature)
- [10. System Architecture and Data Store](#10-system-architecture-and-data-store)
  - [10.1 System Architecture Overview](#101-system-architecture-overview)
  - [10.2 Deterministic Five-Hazard Information Store](#102-deterministic-five-hazard-information-store)
  - [10.3 Land Information Search Data](#103-land-information-search-data)
- [11. Technology Stack](#11-technology-stack)
- [12. Installation and Quick Start](#12-installation-and-quick-start)
  - [12.1 Prerequisites](#121-prerequisites)
  - [12.2 Installation Steps](#122-installation-steps)
- [13. Troubleshooting](#13-troubleshooting)
- [14. How to Use the Application](#14-how-to-use-the-application)
- [15. Data Sources, Ethical Guardrails & Scope Reality](#15-data-sources-ethical-guardrails--scope-reality)
- [16. Testing and Verification](#16-testing-and-verification)
- [17. Known Limitations and Future Improvements](#17-known-limitations-and-future-improvements)
- [18. Project Structure and Documentation Index](#18-project-structure-and-documentation-index)
  - [18.1 Repository Structure](#181-repository-structure)
  - [18.2 Consolidated Documentation Index (`docs/`)](#182-consolidated-documentation-index-docs)
- [19. AI Tools Used](#19-ai-tools-used)
- [20. Project Update History](#20-project-update-history)
- [21. Team Information, Credits, and Acknowledgements](#21-team-information-credits-and-acknowledgements)
  - [21.1 Team Information](#211-team-information)
  - [21.2 Credits and Acknowledgements](#212-credits-and-acknowledgements)
- [22. License and Repository Links](#22-license-and-repository-links)
  - [22.1 License](#221-license)
  - [22.2 Repository and Demonstration Links](#222-repository-and-demonstration-links)

---

## 1. Project Overview

**BhumiDorpon (Mirror of the Land / ভূমিদর্পণ)** is an interactive geospatial web application designed to demonstrate how satellite remote-sensing observations, cadastral land records, and deep-learning risk predictions can be synthesized into an accessible, bilingual map dashboard. Built specifically for the geographic and administrative context of Bangladesh, BhumiDorpon combines two distinct but connected systems: (1) disaster-related land-change monitoring across five core categories and (2) a land-information search and verification interface for reviewing available parcel and transaction records. The disaster system enables users to explore, visualize, and analyze land-surface changes caused by natural hazards across five core categories: **River Erosion**, **Flooding**, **Landslides**, **Char Island Formation**, and **Coastal Erosion & Accretion**.

In Bangladesh, millions of citizens live along active river corridors, flood-prone haors (wetland basins), hilly tertiary escarpments, and dynamic coastal deltas. When physical land shifts, earthen boundary markers (*ail*) disappear, creating severe land ownership disputes, displacement, and delays in government compensation disbursement. BhumiDorpon bridges this gap by coupling parcel-level cadastral plots (*Dag No.* [cadastral plot] and *Khatian No.* [record-of-rights deed]) with spatial hazard envelopes on synchronized before/after maps.

Separately, the `/land-information` search system organizes available parcel identification, ownership, sale status, legal disputes, tax, loan/mortgage indicators, and registration/mutation history into a structured report. This helps users review available information before buying land, while clearly distinguishing demo data from verified records.

The disaster platform also demonstrates a multi-hazard deep learning prediction workflow, where specialized neural network pipelines (Sentinel-1/2 &rarr; ConvLSTM / HydroSAR / InSAR SlopeNet / CoastWatch &rarr; hazard probability scores &rarr; cadastral plot intersection) estimate which parcels face future disaster risks.

---

## 2. Problem Statement and Objectives

### 2.1 Disaster-Related Land Change Problem
Bangladesh is one of the most hydro-morphologically dynamic deltaic nations in the world, facing recurring tenure and humanitarian challenges:
1. **Erosion of Cadastral Boundaries:** Braided rivers such as the Jamuna and Padma erode thousands of hectares of farmland annually, obliterating physical earthen markers (*ail*) and dislocating farming communities.
2. **Post-Flood Inundation & Siltation:** Monsoon inundation in wetland haors (e.g., Sylhet, Sunamganj) submerges parcels beneath up to 2.5 meters of water, depositing silt layers that spark tenure disputes after floodwaters recede.
3. **Slope Instability in Hilly Terrains:** In the Chittagong Hill Tracts (CHT), intense rainfall triggers destructive landslides on steep slopes (38°–44°), displacing topsoil and threatening settlements.
4. **Char Accretion & Tenure Ambiguities:** Emerging river sandbars (*chars*) generate friction between private re-emergence claims (*payosti*) and unassigned state reserve lands (*Khas* land under Deed 1/1).
5. **Lack of Transparent Compensation Tracking:** Displaced landholders often lack an accessible means to verify whether their lost land has been surveyed, categorized, or marked as *Paid*, *Approved*, or *Pending*.

### 2.2 Scattered Land Information and Pre-Purchase Risk

- **Scattered Land Records:** Land-related information is often spread across separate deeds, ownership records, mutation history, land development tax records, sale information, mortgage or loan records, and court-dispute information.
- **Difficulty in Verification:** Buyers may struggle to assemble and cross-check these details before a transaction.
- **Possible Delays and Disputes:** Missing or disconnected information can create delays and disputes during the purchase process.
- **Post-Disaster Land Changes:** Fraud or a land parcel's physical disappearance after a disaster may only become apparent after purchase, while older records may remain unchanged.
- **BhumiDorpon's Solution:** The land-information search brings available parcel details together in one structured view so users can review them before making a purchase.
- **Prototype Limitation:** The prototype uses synthetic demo records and is not a substitute for certified government verification or legal advice.

### 2.3 Objectives
- **Centralized Multi-Hazard Dashboard:** Provide an accessible interface for inspecting 5 distinct hazard categories across representative pilot districts.
- **Bilingual Accessibility:** Enable seamless switching between Bengali (Bangla default) and English without page reloads.
- **Initial Auth & Demo Access:** Provide an intuitive entry screen with registration, login, and isolated demo exploration.
- **Pre-Purchase Land Verification:** Bring available ownership, sale status, disputes, land development tax, mortgage/loan indicators, and registration/mutation history into one searchable parcel report, while preserving Dag and Khatian identifiers as text.
- **Synchronized Visual Comparison:** Enable side-by-side comparison of baseline (*Before*) and post-hazard (*After/Forecast*) conditions with synchronized panning and zooming.
- **Cadastral Plot Coupling:** Connect discrete parcel records (*Dag No.*, *Khatian No.*, 4-corner GPS coordinates) with continuous hazard footprints.
- **Dual Basemap Flexibility:** Offer both an offline-ready vector **Light GIS** basemap and high-resolution **Satellite** imagery (Esri World Imagery).
- **Ethical AI Guardrails:** Enforce strict compliance with Hackathon Rule 5 by suppressing all financial disbursement figures on predictive forecast views.

---

## 3. Key Features: Disaster Monitoring and Land Information Systems

### 3.1 Most Important Feature: Land Information Search

| Feature | Description | Interaction | Benefit |
|---|---|---|---|
| **Primary: Land Information Search** | Dedicated `/land-information` system searches District, Upazila, Mouza, Dag No., and Khatian No. and gathers available parcel, ownership, sale, dispute, tax, loan/mortgage, and registration/mutation details into one structured report. | Click **"Land Information / ভূমির তথ্য"** in the header and follow the cascading search fields. | Helps users review available land information before purchase instead of manually collecting scattered records. The prototype does not certify legal title or replace official verification. |
| **Bangla Default & English Switch** | Bilingual UI engine defaulting to Bangla on first visit with zero-layout-shift English toggle. | Click `বাংলা \| English` in top header bar. | Immediate accessibility for rural citizens and official land surveyors. |
| **Auth Entry & Isolated Demo** | Glassmorphic auth modal on first visit and `/login` route with one-click Demo access. | Click **"Demo / ডেমো হিসেবে প্রবেশ করুন"** on login modal. | Immediate exploration for evaluators while isolating administrative actions. |
| **Disaster Change & DL Risk Analysis** | Section 5 of land report detailing historical loss/deposition and 4 deep-learning risk forecasts. | Search any parcel in `/land-information` and inspect Section 5. | Transparent hazard risk accounting separating physical loss from legal title. |
| **Four-Step Landslide Chain Selector** | Four-step dependent selector (District &rarr; Upazila &rarr; Hill &rarr; Landslide Event) embedded in `SelectorChain.tsx` with URL synchronization (`?d&u&h&ev`), newest-first sorting, auto-selection, and honest empty states. | Select District &rarr; Upazila &rarr; Hill &rarr; Event on `/landslide/[mode]`. | Seamless hierarchical exploration connecting hills directly to historical disaster records and forecast scenarios without duplicate controls. |
| **Right-Aligned Header Toolbar** | Responsive header toolbar layout right-aligning action controls on desktop (`md:justify-end`) with multi-line overflow wrapping directly below the language toggle, maintaining left-alignment on mobile. | Resize viewport between mobile (<768px) and desktop (&ge;768px). | Keeps top controls visually anchored under the language toggle, preventing awkward floating or centering on wide viewports. |
| **Complete Table & Data Localization** | Full localization of all tabular data, headers, cells, status badges, sublabels, chart `aria-label`s, and data-derived strings (hill names, risk zone suffixes like *High Risk Slope Zone*, plot IDs, survey types, dates, Eastern Nagari numbers), while strictly preserving allowlisted technical acronyms (GIS, InSAR, KML, GeoJSON, CSV, BDT/৳, DL, m, mm, km). | Switch language toggle to `বাংলা` on any hazard table, flood owner ledger, or land report. | Eliminates untranslated English text in tables for complete Bengali linguistic immersion. |
| **Top-Level Scroll to Disasters** | Direct smooth-scroll navigation button on homepage hero. | Click **"Explore Disasters / দুর্যোগসমূহ দেখুন"** on homepage. | Fast, accessible navigation to `#disaster-options` with header offset. |
| **Side-by-Side Synced Compare** | Synchronized Leaflet viewports: *Before* on left and *After* (or *Forecast*) on right. | Pan or zoom either viewport; event listeners synchronize the paired map. | Immediate visual verification of land loss, shoreline retreat, or flood inundation over time. |
| **Dual Basemap Engine** | Switches canvas between offline vector **Light GIS** basemap and **Satellite** imagery. | Toggle basemaps in the map chrome bar. | Light GIS maximizes boundary legibility; Satellite imagery provides real-world physical ground context. |
| **Four-Corner GPS Readouts** | Calculates exact latitude/longitude coordinates (NW, NE, SE, SW to 6 decimal places). | Open any parcel in Flood Owner Land page and click **"Copy 4 Corners"**. | Allows landholders and surveyors to recover lost physical plot boundary markers on the ground. |
| **Google Earth KML Export** | Generates client-side KML 2.2 polygon files and launches Google Earth Web. | Click **"Open in Google Earth"** on Flood Owner Land Detail page. | Enables 3D satellite inspection and boundary recovery without third-party GIS software. |
| **GeoAI Forecast Mode (Demo)** | Demonstrates 1-year forward predictive hazard envelopes with Rule 5 financial suppression. | Toggle **Recorded / Forecast** in header navigation bar. | Supports anticipatory disaster planning while preventing speculative estimates from being mistaken for approved aid. |
| **Owner Compensation Ledger** | Displays tabular accounting of affected landowners with Dag No., Khatian No., lost area, and status. | Filter table columns by status badges: `Paid`, `Approved`, or `Pending`. | Transparent, auditable tracking of disaster assistance liabilities. |
| **Multi-Unit Area Conversion** | Recalculates area figures across Decimals, Acres, and Hectares using precise ratios. | Toggle unit selector button in navigation bar. | Accommodates both traditional local land units (*Decimals*, *Acres*) and international metric units (*Hectares*). |
| **Settings Hub** | Provides verified project specifications, architecture disclosures, and official team attribution. | Click **Settings** in sidebar to view **About Project** and **Team Information**. | Transparent access to project purpose, architectural disclosures, and team credentials. |

### 3.2 The Five Disaster Modules

| Hazard Module | Route | Pilot Geographic Cluster | Thematic Map Layers & Features |
|---|---|---|---|
| **1. River Erosion** | `/river-erosion` | Sirajganj (Kazipur, Jamuna River) | Active braided channel, historical vs. current banklines, retreat vectors, mouza loss/gain badges. |
| **2. Flood Monitoring** | `/flood` | Sylhet (Gowainghat, Jaflong) | Multi-depth inundation contours (`<0.5m`, `0.5–1.5m`, `>1.5m`), owner-colored parcels, owner detail page, 4-corner GPS readouts. |
| **3. Landslide Hazards** | `/landslide` | Chittagong & Rangamati (Batali Hill, Ghagra) | Two-step mountain/event selector, synthetic DEM hillshades, 10m contour isolines, slope angles (38°–44°), debris runout. |
| **4. Char Islands** | `/char` | Sirajganj (Kazipur, Char Girish) | Mid-channel sandbar morphology, accretion tips, erosion flanks, unowned state Khas card (Deed 1/1). |
| **5. Coastal Shoreline** | `/coastal` | Bhola (Monpura & Char Fasson) | Estuarine coastline migration, intertidal mudflats, bathymetry contours, coastal embankment structures. |

---


### 3.3 Land Information Search and Verification System

The dedicated `/land-information` system addresses a different problem from disaster monitoring: land documents and transaction-related information can be scattered across multiple records, making it difficult for a buyer to check a parcel before purchase. The search interface brings the available information into one structured report so users can review key details before proceeding.

| Capability | Description | User Value |
|---|---|---|
| **Five-Level Parcel Search** | Search by District → Upazila → Mouza → Dag No. → Khatian No.; Dag and Khatian identifiers retain leading zeros. | Helps users locate the intended parcel without losing the original record identifiers. |
| **Ownership and Parcel Identity** | Shows parcel identifiers, recorded owner details, ownership shares, land area, classification, and available boundary coordinates. | Makes it easier to compare the parcel being offered with the available record. |
| **Sale and Legal Status** | Presents available sale/listing status and recorded dispute or court-case information. | Helps buyers identify details that require further checking before purchase. |
| **Tax, Loan/Mortgage and Record History** | Brings available land development tax, loan/mortgage indicators, registration, and mutation history into the same report. | Reduces the need to search separate information sources manually. |
| **Data Availability Labels** | Distinguishes demo data, verified records, unavailable information, and records requiring an external connection. | Makes the limits and status of the displayed information visible. |
| **Disaster Context Kept Separate** | Disaster-related land change and risk analysis appears in its own report section, separate from ownership and transaction information. | Prevents disaster findings from being mixed with legal/transaction records. |

**Important scope note:** The current application is a client-side prototype using synthetic demo data. It does not independently certify ownership, prove that a deed is genuine, or connect to live government databases. Buyers must verify records with the relevant official authorities before a transaction.

## 4. Global Bangla Default & English Localization

BhumiDorpon is engineered with a centralized translation architecture in `lib/translations.ts`:
- **Default Language:** Bangla (`bn`) is active on initial visit.
- **Persistent Switcher:** The top header includes a toggle button (`বাংলা | English`) that switches the entire interface without page reload or filter loss.
- **Bengali Numeral Localization:** Converts Arabic digits (`0-9`) into Eastern Nagari numerals (`০-৯`) using `formatNumberLocalized(num, lang)`.
- **Comprehensive Coverage:** Covers navigation, modals, search forms, reports, tables, tooltips, units, and empty states.

---

## 5. Entry Authentication, Registration & Demo Access

The authentication subsystem in `lib/auth.ts` provides a secure, client-side session management model:
- **First-Visit Modal:** Displays `components/auth/AuthModal.tsx` over the application for unauthenticated visitors.
- **Dedicated Login Route:** Standalone page at `/login` with Login and Registration forms.
- **Form Validation:** Validates required fields, 6-character password minimum, password confirmation matching, and duplicate usernames.
- **Isolated Demo Access:** Prominent button **"Demo / ডেমো হিসেবে প্রবেশ করুন"** creates an ephemeral session (`isDemo: true`) with citizen read-only permissions, strictly blocking administrative operations via `canPerformAdministrativeAction(user)`.
- **Top Demo Banner:** Displays a persistent bar (`DemoBanner.tsx`) reminding visitors of demo mode with a quick login link.

---

## 6. Global Land Information Cascading Search & Report Engine

Located at `/land-information`, the search engine resolves parcels across 5 hierarchical fields:
1. **District (জেলা):** Sirajganj, Sylhet, Rangpur, Cox's Bazar, Bhola, Chittagong.
2. **Upazila (উপজেলা):** Filtered by selected District.
3. **Mouza (মৌজা):** Filtered by selected Upazila with JL Numbers.
4. **Dag Number (দাগ নম্বর):** Accepts alphanumeric or numeric strings (e.g., `0101`, `2271`).
5. **Khatian Number (খতিয়ান নম্বর):** Accepts cadastral survey strings (e.g., `RS-475`).

**Leading Zero Preservation:** Dag and Khatian numbers are processed strictly as string tokens, ensuring leading zeros (e.g., `"0101"`) are never stripped.

**Structured Six-Section Report:**
- **Section A: Land Identification:** District, Upazila, Mouza, JL No, Dag No, Khatian No, Area (Decimal & Acre), Land Classification, 4-Corner GPS coordinates.
- **Section B: Ownership Information:** Recorded owners, ownership shares, father's name, verification timestamp.
- **Section C: Sale & Listing Status:** Active sale status, listing price, source attribution.
- **Section D: Legal Disputes & Court Cases:** Civil suit reference numbers, dispute status, court jurisdiction.
- **Section E: Land Development Tax (LD Tax):** Assessment period, outstanding balance, last payment date.
- **Section F: Registration & Ownership History:** Transfer chain, mutation record dates, deed volumes.

---

## 7. Section 5: Disaster Change & Deep-Learning Risk Analysis

Directly below the cadastral report, a specialized section titled **"দুর্যোগজনিত ভূমির পরিবর্তন ও ঝুঁকি বিশ্লেষণ" / "Disaster-Related Land Change and Risk Analysis"** displays:
- **Historical Land Loss & Accretion:** Measured land changes, observation dates, and disaster event types.
- **Submerged Land Preservation:** Parcels swallowed by rivers (e.g., Dag `0101` in Kazipur) are designated **"Completely Submerged / নদীগর্ভে বিলীন"** while preserving historical ownership records to safeguard re-emergence rights under Section 86 of the State Acquisition and Tenancy Act.
- **Deep-Learning Risk Predictions:** Displays multi-hazard risk predictions across 4 neural network models:
  1. River Erosion: ConvLSTM Spatiotemporal Sequence Model (1-year forecast).
  2. Flood Inundation: HydroSAR Inundation Depth Network (Monsoon season forecast).
  3. Landslide Risk: InSAR SlopeNet Displacement Predictor (Rainfall trigger forecast).
  4. Coastal Surge & Erosion: CoastWatch Estuarine Retreat Model (1-year shoreline model).

---

## 8. Four-Step Landslide Hierarchy & Event Selector

Integrated directly into `components/SelectorChain.tsx` for both Recorded and Forecast modes on `/landslide` and `/landslide/[mode]`:
- **Four-Step Dependent Chain:**
  1. **District (জেলা):** Chittagong, Rangamati, Bandarban, Cox's Bazar.
  2. **Upazila (উপজেলা):** Filtered by selected District.
  3. **Hill / Mountain (পাহাড়):** Monitored hills within the Upazila (e.g., Ghagra, Furamon, Vedvedi, Chimbuk, Himchari, Nilgiri, Sajek Ridge).
  4. **Landslide Event (ভূমিধসের ঘটনা):** Fourth dependent step (Badge ④) listing all recorded landslide disasters (Recorded mode) or simulation scenarios (Forecast mode) for the selected hill, sorted newest first with event dates.
- **Auto-Selection & Clearing Rules:** When a hill is selected, the newest available event is automatically selected if `ev` is empty. Changing District, Upazila, or Hill immediately clears the downstream event parameter `ev`. Reset-to-default also clears `ev`.
- **Honest Empty State:** Hills without recorded disaster events (e.g., Mirinja, Keokradong, Teknaf Ridge, Inani Range, Jaflong Hill) render a disabled combobox with the honest message: *"এই পাহাড়ে কোনো ভূমিধসের ঘটনা রেকর্ড নেই"* / *"No landslide events recorded for this hill"*, without inventing fictitious events.
- **Dynamic Detail Telemetry:** The chosen event drives 8 critical metrics on the landslide detail view: event title, date, 24-hour rainfall, debris volume, slope gradient, affected slope area, homesteads at risk, and impact summary banner.
- **Unified Single-Selector Architecture:** The redundant standalone `MountainEventSelector` card was eliminated from `/landslide/[mode]`, establishing `SelectorChain` as the sole authoritative selector driven by URL state (`?d&u&h&ev`).

---

## 9. Google Earth Parcel Outline Feature

On the Flood Owner Land Detail route (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`), directly below the Four Corner Coordinates table, an **Open in Google Earth** button allows landowners and relief officers to export parcel boundaries to 3D satellite visualization:
- Opens Google Earth Web in a new browser tab centered on the parcel centroid: `https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`.
- Triggers an instant browser download of `<floodId>_dag_<dagNo>_outline.kml`.
- Generates valid KML 2.2 XML with a closed 5-point coordinate ring and 4 numbered corner pins (`1 NW` to `4 SW`).
- Pure client-side generation in `lib/googleEarth.ts` with zero backend transmission of sensitive owner data.

---

## 10. System Architecture and Data Store

### 10.1 System Architecture Overview
BhumiDorpon is engineered as a client-side web application:
- **Frontend Core:** Next.js 14 App Router, React 18, and TypeScript.
- **Cartography Engine:** Leaflet `1.9.4` with custom SVG vector rendering for the Light GIS basemap, hazard overlays, and ESRI satellite tile streaming.
- **Spatial Geometry Engine:** Turf.js `7.4.0` executing client-side polygon clipping and 4-corner coordinate extraction.
- **Client State Management:** Zustand stores managing application mode, active units, and map layer toggles (`stores/appStore.ts`).
- **Data Caching:** TanStack React Query `5.59.0` managing asynchronous mock data resolution.

### 10.2 Deterministic Five-Hazard Information Store
- **Runtime Store (`public/mocks/*.json`):** Static assets served at `/mocks/*` and fetched by client components via `lib/data.ts`.
- **Server / Test Store (`mocks/*.json`):** Mirrored copy read synchronously via `fs.readFileSync` in Node.js and Vitest test environments.
- **Per-Area Map Packages (`public/mocks/areas/<hazard>/`):** Modular spatial GeoJSON packages resolved via `areas_index.json`.

---

### 10.3 Land Information Search Data

The `/land-information` route uses the parcel search and report engine to retrieve records through District, Upazila, Mouza, Dag No., and Khatian No. The report groups land identity, ownership, sale status, disputes, tax, and registration/mutation history. This is separate from the five hazard modules; disaster-related changes and risk analysis are presented in their own report section. Current records are synthetic demo data unless explicitly identified otherwise.

## 11. Technology Stack

- **Framework:** Next.js `14.2.15` (App Router)
- **UI Library:** React `18.3.1`
- **Language:** TypeScript `5.6.2` (Strict mode)
- **Styling:** Tailwind CSS `3.4.13`
- **Mapping:** Leaflet `1.9.4`, `react-leaflet` `4.2.1`
- **Spatial Analytics:** Turf.js `7.4.0`
- **State Store:** Zustand `4.5.5`
- **Data Caching:** TanStack React Query `5.59.0`
- **Icons:** Lucide React `0.447.0`
- **Unit Testing:** Vitest `4.1.11` (14 test suites, 78 unit tests)

---

## 12. Installation and Quick Start

### 12.1 Prerequisites
- **Node.js:** v18.17.0 or higher (v20 LTS recommended)
- **npm:** v9.0.0 or higher
- **Git**

### 12.2 Installation Steps
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

---

## 13. Troubleshooting

- **Port in Use (3000):** Run `npm run dev -- -p 3001` or terminate the existing Node process.
- **Leaflet Window Undefined in SSR:** All Leaflet maps are dynamically imported with `ssr: false`.
- **Node vs. Browser Storage in Tests:** `lib/auth.ts` includes an in-memory fallback (`nodeMemoryUsers`) ensuring tests execute deterministically in Vitest.

---

## 14. How to Use the Application

1. **Initial Entry:** Upon opening the site, click **"Demo / ডেমো হিসেবে প্রবেশ করুন"** to bypass login and explore the platform immediately.
2. **Language Toggle:** Click `বাংলা | English` in the header to switch languages at any time.
3. **Scroll to Disasters:** Click **"Explore Disasters / দুর্যোগসমূহ দেখুন"** to smoothly jump to the hazard modules.
4. **Land Information Search:** Click **"Land Information / ভূমির তথ্য"** in the top navigation and select District → Upazila → Mouza → Dag No. → Khatian No. Review the land identity, ownership, sale status, legal disputes, tax, loan/mortgage indicators, and registration/mutation history.
5. **Disaster Analysis:** Within the parcel report, inspect the separate disaster-related land-change and risk section for recorded loss/gain and forecast information; do not treat this as a legal ownership verification.
6. **Landslide Exploration:** Navigate to Landslides, pick a mountain (e.g., Batali Hill), and select a historical landslide event to inspect the disaster footprint.
7. **4-Corner GPS Recovery:** On Flood Owner pages, view the 4-corner GPS table and click **"Open in Google Earth"** to download the KML boundary.

---

## 15. Data Sources, Ethical Guardrails & Scope Reality

- **Synthetic Mock Datasets:** All landowner names, plot numbers, deed records, and figures are deterministic synthetic mock datasets.
- **Rule 5 Compliance:** All financial payout figures (`Paid`, `Approved`, `Pending`) are strictly suppressed on Forecast views.
- **Model Disclaimers:** Deep-learning risk estimates are exploratory predictions, never official legal determinations.

---

## 16. Testing and Verification

BhumiDorpon includes an automated Vitest test suite executing **14 test suites and 78 unit tests**:

```bash
# Run all 14 test suites
npm test

# Run TypeScript type check
npm run lint

# Run production static build
npm run build
```

Verification Results:
- **`npm test`:** 14 passed (14), 78 passed (78), Duration: ~24s
- **`npm run lint` (`tsc --noEmit`):** 0 errors
- **`npm run build`:** Successfully generated all 15 static routes

---

## 17. Known Limitations and Future Improvements

- **Phase 2 (Planned):** FastAPI backend and PostgreSQL 16 + PostGIS 3.4 database deployment.
- **Phase 3 (Planned):** Automated Sentinel-1/2 satellite ingestion via Google Earth Engine (GEE).
- **Phase 4 (Planned):** Live GPU inference clusters and official e-Porcha / DLR&S government API integration.

---

## 18. Project Structure and Documentation Index

### 18.1 Repository Structure
```
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
│   ├── MountainEventSelector.tsx     # Two-step mountain and landslide event selector
│   ├── auth/                         # Authentication components (AuthModal, DemoBanner)
│   ├── land-information/             # Land search form and 6-section report cards
│   ├── OwnerTable.tsx                # Landowner compensation & plot status table
│   ├── SelectorChain.tsx             # Cascading geographic dropdown selectors
│   └── map/                          # Cartographic mapping components
├── docs/                             # Authoritative technical specifications
├── lib/                              # Business logic, helpers, and data layer
│   ├── auth.ts                       # Authentication and demo access service
│   ├── landSearch.ts                 # Cascading search & 6-section report builder
│   ├── landslideEvents.ts            # Mountain and historical landslide catalog
│   ├── translations.ts               # Bilingual localization dictionary & numeral formatter
│   ├── data.ts                       # Typed asynchronous mock data layer
│   ├── googleEarth.ts                # Pure KML generator & Google Earth launcher
│   ├── types.ts                      # TypeScript interfaces (Plots, Owners, Hazards)
│   └── units.ts                      # Land unit conversion utilities & compensation math
├── mocks/                            # Deterministic relational mock JSON datasets
├── public/                           # Static assets, rasters, and area GeoJSON
├── tests/                            # Automated test suite (16 test files, 92 unit tests)
├── package.json                      # Project dependencies & npm scripts
├── tailwind.config.ts                # Tailwind CSS design system configuration
└── tsconfig.json                     # TypeScript compiler configuration
```

### 18.2 Consolidated Documentation Index (`docs/`)

The `docs/` directory contains 10 authoritative Markdown specifications:

| Document | Primary System Scope & Core Technical Coverage |
|---|---|
| [**`docs/PRD.md`**](docs/PRD.md) | **Product Requirements Document:** Problem statement, functional requirements (FR-001 to FR-028), localization, auth, land search, landslide selectors, and non-functional requirements. |
| [**`docs/TRD.md`**](docs/TRD.md) | **Technical Requirements Document:** Architecture stack, Leaflet cartography, math conversions, KML serializer, auth session model, and search workflows. |
| [**`docs/APP_FLOW.md`**](docs/APP_FLOW.md) | **App Flow / User Flow:** Complete screen flows (S0 to S7), login gate, demo access, language toggle, 5-field land search, and landslide selectors. |
| [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md) | **System Architecture:** Layered client architecture, auth and search data adapters, pure Leaflet engine, and future cloud roadmap. |
| [**`docs/DATABASE_SCHEMA.md`**](docs/DATABASE_SCHEMA.md) | **Database & Backend Schema:** Five-Hazard JSON Store schemas, land search entities, auth user models, and production PostgreSQL 16 + PostGIS DDL. |
| [**`docs/UI_UX_DESIGN_SYSTEM.md`**](docs/UI_UX_DESIGN_SYSTEM.md) | **UI/UX Design System:** Minimalist Light GIS design tokens, typography, badges, color palettes, responsive layouts, and accessibility. |
| [**`docs/AUTH_SPECIFICATION.md`**](docs/AUTH_SPECIFICATION.md) | **Authentication & Authorization Specification:** Client prototype auth, isolated demo access, role matrix, and government SSO roadmap. |
| [**`docs/SECURITY_SPECIFICATION.md`**](docs/SECURITY_SPECIFICATION.md) | **Security Specification:** Zero-backend security posture, demo privilege isolation, input sanitization, and PII protection. |
| [**`docs/MAIN_PROJECT_DOCUMENTATION.md`**](docs/MAIN_PROJECT_DOCUMENTATION.md) | **Main Project Documentation:** Master compendium synthesizing all project capabilities, academic citations, and milestone history. |

---

## 19. AI Tools Used

In compliance with the LandTech Innovation Hackathon Rule Book:
1. **Claude (Anthropic):** Conceptual architecture, requirements structuring, documentation drafting.
2. **ChatGPT (OpenAI):** Domain exploration, problem statements relevant to Bangladesh riverine geography.
3. **Antigravity (Google / Gemini):** AI-assisted development environment and agentic coding assistant for terminal tasks, component implementation, and automated test suite creation.

**Team Accountability:** The GeoNeural team has independently reviewed, verified, and tested all submitted code and architecture. Every team member is prepared to explain and defend all submitted code during hackathon judging.

---

## 20. Project Update History

| Milestone / Version | Date | Key Enhancements & Modifications |
|---|---|---|
| **Initial Submission** | Oct 2026 | Initial prototype establishing 5 hazard modules, baseline map comparison, and preliminary mock data models. |
| **Data Architecture Refactoring** | Oct 2026 | Rebuilt core data architecture with deterministic mock generator (`scripts/generate-mocks.ts`), producing synchronized relational JSON stores in `public/mocks/` and `mocks/`. |
| **Rule 5 Forecast Guardrails** | Oct 2026 | Refactored `SelectorChain` cascading dropdown hierarchy; implemented strict suppression of financial disbursement metrics on forecast views. |
| **Flood Multi-Owner Flow & Landslides** | Oct 2026 | Implemented flood event views with individual landowner plot color-coding and search; built landslide terrain engine with hillshades and contours. |
| **Cadastral 4-Corner Readouts** | Oct 2026 | Standardized parcels into 4-corner quadrilaterals with fixed NW, NE, SE, SW vertex ordering and 6-decimal GPS coordinate readouts; launched `/flood/.../owner/...` route. |
| **Leaflet Migration & Offline Cartography** | Oct 2026 | Removed external tile server dependencies and Mapbox imports; migrated mapping engine to pure Leaflet with SVG vector geometry. |
| **Light GIS Basemap & Chrome Upgrade** | Oct 2026 | Engineered custom high-contrast Light GIS basemap, cartographic map chrome, mouza loss/gain badges, and `MouzaSummaryPanel`. |
| **Side-by-Side Dual Map Viewer** | Oct 2026 | Upgraded comparison to simultaneous dual-panel synchronized layout; introduced dedicated in-map zoom controls (+/-) and basemap switcher. |
| **Geographic Extent Bounds Alignment** | Oct 2026 | Configured regional bounding boxes per hazard; implemented single-click simultaneous dual-map zoom synchronicity with active re-entrancy locks. |
| **Settings Navigation Hub** | Oct 2026 | Added Settings Hub (`/settings`) with verified About Project and Team Information views displaying official team attribution (Team GeoNeural). |
| **Technical Documentation Suite** | Oct 2026 | Published engineering and specification suite in `/docs`. |
| **GeoAI Forecast Highlighting** | Oct 2026 | Enhanced README with GeoAI forecast highlight, operational troubleshooting guide, and mock data disclosures. |
| **Google Earth Parcel Outline Feature** | Oct 2026 | Implemented "Open in Google Earth" with client-side KML 2.2 serializer, camera URL calculation, and automated tests. |
| **Documentation Alignment** | Oct 2026 | Synchronized project history and test counts to 10 test suites (61/61 passing unit tests). |
| **Documentation Standardization** | Oct 2026 | Consolidated historical documents into 10 authoritative Markdown specifications in `/docs`; translated prose to English. |
| **v1 Release: Auth, Localization, Land Search & Landslide Selectors** | Oct 2026 | Implemented global Bangla default with English toggle (`lib/translations.ts`); entry auth modal and isolated demo access (`lib/auth.ts`); cascading Land Information search across 5 fields with leading zero preservation (`lib/landSearch.ts`); Section 5 multi-hazard DL predictions and submerged parcel preservation; two-step mountain and landslide historical event selector (`lib/landslideEvents.ts`); top-level scroll-to-disasters button; expanded automated test suite to 14 test suites and 78 unit tests (100% passing). |
| **Documentation Audit & Synchronization** | Oct 2026 | Comprehensive audit of all 10 documentation specifications in `/docs`; synchronized duplicate README and Master Documentation copies; aligned route signatures and verified 14 test suites (78/78 passing unit tests). |
| **Change 4: Landslide Event Step, Header Toolbar & Bangla Table Localization** | Oct 2026 | Added 4th dependent step (Landslide Event) to `SelectorChain.tsx` with URL param `ev`, newest-first sorting, auto-selection, and honest empty states; right-aligned header toolbar on `md+` with wrapping under language toggle and Bengali heading line-height fix; comprehensive Bangla table and data localization across all tables and charts; expanded test suite to 16 suites and 92 passing unit tests. |

---

## 21. Team Information, Credits, and Acknowledgements

### 21.1 Team Information
**Team Name:** GeoNeural  
**Hackathon:** LandTech Innovation Hackathon 2026  

| Role | Name | Focus Areas |
|---|---|---|
| **Team Leader** | **Pantho Raj Biswas** | System Architecture, Geospatial Modeling, Leaflet Engine, Data Layer |
| **Team Member** | **Puja Paul** | Frontend Development, UI/UX Design System, Accessibility, Documentation |

**Copyright:** © 2026 GeoNeural. All rights reserved.

### 21.2 Credits and Acknowledgements
The GeoNeural team gratefully acknowledges the open-source community, tools, and resources that made BhumiDorpon possible:
- **Next.js & React Teams:** For the robust web framework and modern App Router foundation.
- **Leaflet & Vladimir Agafonkin:** For the lightweight, flexible mapping library powering all spatial visualizations.
- **Turf.js Community:** For comprehensive client-side geospatial computational geometry tools.
- **Esri:** For providing open access to the World Imagery satellite tile service.
- **Radix UI & Lucide Icons:** For accessible UI primitives and crisp icon assets.
- **Vitest & Playwright Teams:** For high-performance testing frameworks that ensure codebase reliability.
- **LandTech Innovation Hackathon Organizers & Mentors:** For framing the vital challenges of land tenure, climate vulnerability, and digital governance in Bangladesh.

---

## 22. License and Repository Links

### 22.1 License
All rights to the source code, design assets, and documentation are reserved by the development team:  
**© 2026 GeoNeural. All rights reserved.**

### 22.2 Repository and Demonstration Links
- **GitHub Repository:** [https://github.com/panthoraj-005/Bhumi-Dorpon.git](https://github.com/panthoraj-005/Bhumi-Dorpon.git)
- **Local Demonstration URL:** `http://localhost:3000` (after running `npm run dev`)
- **Live Production Deployment URL:** *Pending deployment / to be provided upon public cloud hosting.*

---

*This document was prepared with the utmost technical integrity, adhering to the LandTech Innovation Hackathon 2026 Rule Book, Version 1.*  
*For questions, academic review, or judging inquiries, please contact Team GeoNeural via the official repository.*
