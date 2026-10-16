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
[![Team](https://img.shields.io/badge/Team-GeoNeural-indigo?style=flat)](#19-team-information)

---

> [!IMPORTANT]
> **DEMO DATA DISCLAIMER & ARCHITECTURAL DISCLOSURE**
> - **Strictly Synthetic / Dummy Data:** All individual landowner names (e.g., *"Abdul Karim"*, *"Rahima Begum"*), cadastral plot numbers (*Dag No.*), record-of-rights deed numbers (*Khatian No.*), boundary coordinate readouts, and compensation figures in this project are strictly fictional mock records created solely for academic evaluation and hackathon demonstration.
> - **No Government Service or Legal Title:** This application is an educational prototype. It does not connect to live government databases, does not provide certified legal land records, and cannot be used for legal land titling or disaster dispatch.
> - **Client-Side Prototype:** The current application has **no backend server or external database**. All cascading selectors, side-by-side map synchronization, Turf.js spatial intersection calculations, and tabular filters execute entirely client-side using deterministic mock datasets located in `/mocks`.

---

## Quick Start

### Prerequisites
- **Node.js:** Version `18.x` or higher (tested and verified on Node.js `20.x`).
- **Package Manager:** `npm` (v9 or v10) or `pnpm`.
- **Git:** Installed on your local machine.

### Launch BhumiDorpon Locally
```bash
git clone https://github.com/panthoraj-005/Bhumi-Dorpon.git
cd Bhumi-Dorpon
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### At a Glance
1. All data is synthetic, stored locally in `/mocks` and `/public/mocks`; the only external asset is streaming Esri World Imagery satellite tiles (see [Data Sources and Data Usage](#13-data-sources-and-data-usage)).
2. AI tools used: Claude, ChatGPT, and Antigravity assisted architecture, documentation, and development workflows (see [AI Tools Used](#14-ai-tools-used)).
3. Headline feature: **GeoAI Forecast Mode (Concept Demo)** showcases a proposed deep learning pipeline predicting 1-year hazard envelopes and intersecting them with cadastral plots (see [Key Features](#5-key-features) and [Deep Learning and AI](#7-deep-learning-and-ai)).
4. Zero backend required: Fully client-side interactive prototype with no database or cloud server setup needed (see [System Architecture and Technology Stack](#8-system-architecture-and-technology-stack)).

---

## Table of Contents

- [1. Project Title](#1-project-title)
- [2. Project Overview](#2-project-overview)
- [3. Problem Statement](#3-problem-statement)
- [4. Objectives](#4-objectives)
- [5. Key Features](#5-key-features)
- [6. Hazard Modules and Map Functionality](#6-hazard-modules-and-map-functionality)
- [7. Deep Learning and AI](#7-deep-learning-and-ai)
- [8. System Architecture and Technology Stack](#8-system-architecture-and-technology-stack)
- [9. Prerequisites](#9-prerequisites)
- [10. Installation and Setup](#10-installation-and-setup)
- [11. Troubleshooting](#11-troubleshooting)
- [12. How to Use the Application](#12-how-to-use-the-application)
- [13. Data Sources and Data Usage](#13-data-sources-and-data-usage)
- [14. AI Tools Used](#14-ai-tools-used)
- [15. Testing and Verification](#15-testing-and-verification)
- [16. Limitations](#16-limitations)
- [17. Future Improvements](#17-future-improvements)
- [18. Project Structure](#18-project-structure)
- [19. Team Information](#19-team-information)
- [20. Credits and Acknowledgements](#20-credits-and-acknowledgements)
- [21. License](#21-license)
- [22. Repository and Demo Links](#22-repository-and-demo-links)
- [23. Google Earth Parcel Outline Feature](#23-google-earth-parcel-outline-feature)
- [24. Project Update History](#24-project-update-history)

---

## 1. Project Title

**BhumiDorpon**  
*Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard*

---

## 2. Project Overview

**BhumiDorpon (Mirror of the Land)** is a responsive, client-side web application designed to demonstrate how satellite remote-sensing observations and cadastral land records can be synthesized into an accessible, interactive map dashboard. Built specifically for the geographic and administrative context of Bangladesh, BhumiDorpon enables users to explore, visualize, and analyze land-surface changes caused by natural hazards across five core categories: **River Erosion**, **Flooding**, **Landslides**, **Char Island Formation**, and **Coastal Erosion & Accretion**.

In Bangladesh, millions of citizens live along active river corridors, flood-prone haors (wetland basins), hilly tertiary escarpments, and dynamic coastal deltas. When physical land shifts, boundary markers (ail / field boundary markers) disappear, creating severe land ownership disputes, displacement, and delays in government compensation disbursement. BhumiDorpon bridges this gap by coupling parcel-level cadastral plots (*Dag No.* [cadastral plot] and *Khatian No.* [record-of-rights deed]) with spatial hazard envelopes on synchronized before/after maps.

BhumiDorpon also demonstrates a GeoAI forecasting workflow, where a proposed deep learning pipeline (Sentinel-1/2 -> ConvLSTM / Spatiotemporal U-Net -> 1-year hazard envelope -> cadastral plot intersection) would estimate which parcels may be affected next. In this prototype the forecasts are pre-computed mock scenarios.

The prototype adheres to a minimalist light-themed design language prioritizing high contrast, keyboard navigation, accessible tabular alternatives, and transparent separation between historical recorded data and predictive modeling.

---

## 3. Problem Statement

Bangladesh is one of the most hydro-morphologically dynamic deltaic nations in the world. Each year, communities face severe land tenure and humanitarian challenges driven by natural hazards:

1. **Erosion of Cadastral Boundaries:** Braided rivers such as the Jamuna, Padma, and Lower Meghna erode thousands of hectares of fertile farmland annually. When riverbanks collapse, physical boundary markers (ail / field boundary markers) are washed away, leaving dislocated farmers without visible proof of their parcel boundaries.
2. **Post-Flood Inundation and Topsoil Siltation:** Monsoon floods in wetland basins (haor regions such as Sylhet and Sunamganj) submerge parcels beneath up to 2.5 meters of water, depositing layers of silt that obliterate demarcations and trigger prolonged land disputes once waters recede.
3. **Slope Instability in Hilly Terrains:** In the Chittagong Hill Tracts (CHT, including Rangamati and Bandarban), monsoon rainfall triggers destructive landslides across steep tertiary slopes (38°–44°), displacing tens of thousands of cubic meters of topsoil and burying settlements.
4. **Alluvial Char Accretion Disputes:** As rivers deposit sand bars (chars / river sandbar islands), determining whether emerging land constitutes private re-emerged parcels (payosti / re-emerged alluvial land) or unowned government reserve (Khas land / state-owned land under deed 1/1) often sparks civil friction due to lack of transparent spatial records.
5. **Lack of Transparent Compensation Tracking:** Displaced landholders often lack accessible means to verify whether their lost land has been surveyed, categorized for government assistance, or marked as *Paid*, *Approved*, or *Pending*.
6. **Inaccessible Spatial Tools:** Traditional Geographic Information Systems (GIS) software requires specialized technical training, high-end hardware, and complex desktop installations that are inaccessible to grassroots citizens and local revenue staff.

BhumiDorpon addresses these challenges by delivering an intuitive, web-based platform where complex spatial intersections are translated into simple, readable maps, four-corner boundary coordinate readouts, and transparent compensation ledgers.

---

## 4. Objectives

### 4.1 Implemented Prototype Objectives
- **Centralized Multi-Hazard Dashboard:** Provide a unified interface for inspecting 5 distinct hazard categories across representative pilot districts in Bangladesh.
- **Synchronized Visual Comparison:** Enable side-by-side comparison of baseline (*Before*) and post-hazard (*After/Forecast*) conditions with synchronized panning and zooming.
- **Cadastral Plot Coupling:** Connect discrete parcel records (*Dag No.*, *Khatian No.*, 4-corner GPS coordinates) with continuous hazard footprints using client-side computational geometry.
- **Dual Basemap Flexibility:** Offer both a vector-rendered **Light GIS** theme (emphasizing mouza [revenue village] boundaries, roads, waterlines, and infrastructure) and high-resolution **Satellite** imagery (Esri World Imagery).
- **Transparent Guardrails:** Enforce strict ethical data standards by clearly labeling synthetic demo data and completely suppressing financial compensation fields on predictive *Forecast* views.
- **Accessibility & Screen-Reader Support:** Ensure all map visualizations have screen-reader accessible data table counterparts and keyboard-friendly controls.

### 4.2 Future Objectives (Beyond Current Prototype)
- Ingest live multitemporal satellite imagery (Sentinel-1 SAR and Sentinel-2 optical) via an automated Earth Observation processing pipeline.
- Deploy trained GeoAI deep-learning inference microservices for automated bankline detection, flood depth mapping, and slope failure prediction.
- Integrate directly with the Bangladesh Ministry of Land digital records (e-Mutation and Digital Khatian deed systems) via secure APIs.
- Provide a bilingual (Bangla and English) progressive web app (PWA) with offline support for field surveys by Upazila Land Offices (Assistant Commissioner of Land / AC Land).

---

## 5. Key Features

The table below summarizes the 12 core features implemented in the BhumiDorpon application:

| Feature | What It Does | How to Interact | Why It Is Useful |
|---|---|---|---|
| **GeoAI Forecast Mode (Concept Demo)** | Shows 1-year forecast hazard envelopes (riverbank migration, flood inundation) and intersects them with cadastral plots to estimate parcel-level area at risk. Demonstrates the workflow of a proposed ConvLSTM / U-Net GeoAI pipeline. Forecasts are pre-computed mock data, not live model output. | Toggle Recorded / Forecast in the header; the right-hand map switches from After to Forecast; the amber "Model-based estimate, not an official government record" banner appears. | Lets landholders and Upazila land offices see which parcels may be at risk before the next monsoon, supports early planning and early documentation of boundaries, while financial figures stay suppressed to respect Rule 5. |
| **Side-by-Side Synced Map Compare** | Displays two Leaflet map viewports side by side: *Before* (baseline) on the left and *After* (or *Forecast*) on the right. | Pan or zoom either viewport; event listeners automatically synchronize the paired map. On mobile screens (<768px), maps gracefully stack vertically. | Provides immediate visual verification of land loss, shoreline retreat, or flood inundation over time. |
| **Dual Basemap Engine** | Switches map background between a custom vector **Light GIS** basemap and high-resolution **Satellite** imagery. | Select the basemap toggle located in the map chrome bar. | Light GIS maximizes boundary legibility; Satellite imagery offers real-world physical ground context. |
| **Cascading Geographic Selectors** | Guides users through a hierarchical administrative selection: `District → Upazila → River/Hill/Mouza → Hazard Event`. | Click dropdowns in sequence; child dropdowns dynamically populate only options relevant to the parent selection. | Eliminates clutter, guides non-technical users, and prevents invalid geographic queries. |
| **Active Record Indicators** | Flags administrative units with green badges (`hasRecords = true`) indicating pre-computed hazard data is available. | Look for the visual badges in the cascading dropdown lists. | Directs users and judges immediately to populated pilot clusters without frustrating dead ends. |
| **Cadastral Plot Boundary Overlays** | Renders 4-corner cadastral plot polygons over the map with color-coded damage classifications. | Hover over or click individual parcels to display plot-specific metadata cards. | Enables granular parcel-by-parcel damage inspection rather than vague regional summaries. |
| **Four-Corner GPS Readouts** | Calculates exact latitude/longitude coordinates (NW, NE, SE, SW to 6 decimal places) for every parcel corner. | Open any parcel in the Flood Owner Land page and click **"Copy 4 Corners"** or expand the corners accordion. | Allows landholders and surveyors to recover lost physical plot boundary markers on the ground. |
| **Owner Compensation Table** | Displays tabular accounting of affected landowners with Dag No., Khatian No., lost area, and compensation status. | Sort table columns or filter by status badges: `Paid`, `Approved`, or `Pending`. Filter by landowner name or Dag No. | Provides transparent, auditable tracking of disaster assistance liabilities. |
| **Multi-Unit Area Conversion** | Dynamically recalculates all area figures across Decimals, Acres, and Hectares using precise conversion ratios. | Toggle the unit selector button in the navigation bar. | Accommodates both traditional local land units (*Decimals*, *Acres*) and scientific/international units (*Hectares*). |
| **GeoJSON & CSV Export** | Generates client-side downloadable GeoJSON feature collections and formatted CSV tables for selected records. | Click the **"Export CSV"** or **"Download GeoJSON"** buttons on detail and owner pages. | Enables integration with desktop GIS software (QGIS, ArcGIS) and external reporting workflows. |
| **Strict Forecast Guardrails** | Suppresses financial disbursement figures (`Paid`, `Approved`, `Pending`) in predictive *Forecast* mode. | Switch to *Forecast* mode; observe the amber banner: *"Model-based estimate, not an official government record."* | Complies with ethical AI standards (Rule 5) to prevent speculative estimates from being mistaken for approved aid. |
| **Settings Hub** | Provides a dedicated settings interface with verified project information and team attribution. | Click **Settings** in the sidebar to view **About Project** (`/settings/about`) and **Team Information** (`/settings/team`). | Provides judges and users with immediate access to project purpose, architecture disclosures, and team credentials. |

### 5.1 How GeoAI Forecasting Helps People
- **Farmers / landholders:** see if their Dag No. may be affected next season and save 4-corner coordinates in advance (vision enabled by the proposed pipeline; prototype shows mock forecasts).
- **Upazila Land Offices (AC Land):** prioritise field surveys on high-risk mouzas (vision enabled by the proposed pipeline; prototype shows mock forecasts).
- **Disaster managers:** identify likely affected areas before floods or erosion events (vision enabled by the proposed pipeline; prototype shows mock forecasts).
- **Researchers / planners:** study how satellite-based deep learning could connect with cadastral records (vision enabled by the proposed pipeline; prototype shows mock forecasts).

---

## 6. Hazard Modules and Map Functionality

BhumiDorpon implements five distinct hazard modules tailored to Bangladesh’s regional geomorphology. Each module loads specific geographic pilot bounds, contextual parameters, and thematic vector layers:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE FIVE HAZARD MODULES                                │
├───────────────────────┬──────────────────────────┬─────────────────────────────────────┤
│ Hazard Module         │ Pilot Geographic Cluster │ Thematic Map Layers & Features      │
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 1. River Erosion      │ Sirajganj (Kazipur,      │ • Active Jamuna braided channel     │
│    `/river-erosion`   │ Jamuna River reach)      │ • Historical vs. current banklines  │
│                       │                          │ • Bank retreat vectors & transects  │
│                       │                          │ • Mouza loss/gain badges & summaries│
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 2. Flood Monitoring   │ Sylhet (Gowainghat,      │ • Multi-depth inundation contours   │
│    `/flood`           │ Jaflong, Sari-Goyain)    │   (Shallow <0.5m, Mod, Deep >1.5m)  │
│                       │                          │ • Owner-colored cadastral parcels   │
│                       │                          │ • Dedicated Owner Land Detail page  │
│                       │                          │ • 4-corner GPS boundary readouts    │
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 3. Landslide Hazards  │ Rangamati (Kawkhali,     │ • Synthetic DEM hillshade rasters   │
│    `/landslide`       │ Ghagra Hill corridor)    │ • 10m contour isolines & spots      │
│                       │                          │ • Slope angle classes (38°–44°)     │
│                       │                          │ • Failure scarp & debris runout zone│
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 4. Char Islands       │ Sirajganj (Kazipur,      │ • Mid-channel sandbar morphology    │
│    `/char`            │ Char Girish reach)       │ • Accretion tips & erosion flanks   │
│                       │                          │ • Dedicated Unowned State Khas card │
│                       │                          │   (Deed 1/1 State Khas land)        │
├───────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│ 5. Coastal Shoreline  │ Bhola (Monpura &         │ • Estuarine coastline migration     │
│    `/coastal`         │ Char Fasson)             │ • Intertidal mudflats & bathymetry  │
│                       │                          │ • Coastal embankment structures     │
│                       │                          │ • Unassigned mudflat accretion card │
└───────────────────────┴──────────────────────────┴─────────────────────────────────────┘
```

### 6.1 Map Layer & Data Disclosure
- **Basemap Tiles:** The **Satellite** basemap streams publicly accessible tile layers from **Esri World Imagery** (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`).
- **Vector Overlays:** All administrative boundaries (Upazila, Mouza), river centerlines, bank retreat lines, flood inundation contours, landslide scarps, and cadastral parcel geometries are **synthetic mock layers** generated deterministically via Turf.js algorithms in `scripts/generate-mocks.ts` and `scripts/generate-map-areas.ts`. They simulate realistic geographic coordinates in Bangladesh but are **not survey-grade legal boundaries**.
- **DEM Rasters:** The landslide terrain rasters (elevation hypsometric tints and multi-directional hillshades) are procedurally generated synthetic rasters (`/public/mocks/rasters/area_landslide_*/*.png`) produced from 2D Gaussian elevation fields, not official Shuttle Radar Topography Mission (SRTM) or LiDAR datasets.

---

## 7. Deep Learning and AI

### 7.1 Proposed GeoAI Forecasting Pipeline
BhumiDorpon demonstrates the conceptual workflow of an end-to-end GeoAI deep learning pipeline designed to bridge Earth Observation satellite imagery with parcel-level cadastral registers:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                             PROPOSED GEOAI FORECASTING PIPELINE                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│   [ Satellite Remote Sensing Data Sources ]                                                  │
│   • Sentinel-1 SAR (all-weather C-band radar)                                                │
│   • Sentinel-2 Multispectral optical imagery                                                 │
│                                  │                                                           │
│                                  ▼                                                           │
│   [ Preprocessing & Feature Extraction ]                                                     │
│   • Radiometric calibration, speckle filtering & cloud masking                               │
│   • Surface water index calculation (NDWI / MNDWI)                                           │
│                                  │                                                           │
│                                  ▼                                                           │
│   [ Deep Learning Spatiotemporal Forecasting ]                                              │
│   • ConvLSTM / Spatiotemporal U-Net network architecture                                     │
│   • Forecasts 1-year forward bankline retreat & flood extent                                 │
│                                  │                                                           │
│                                  ▼                                                           │
│   [ 1-Year Hazard Forecast Envelope ]                                                        │
│   • Projected hazard boundary polygon (H_forecast)                                           │
│   • Incorporates spatiotemporal morphological uncertainty band                               │
│                                  │                                                           │
│                                  ▼                                                           │
│   [ Cadastral Spatial Coupling (Turf.js) ]                                                   │
│   • Polygon intersection: Delta Area_i = Area(P_i ∩ H_forecast)                              │
│   • Evaluated against 4-corner cadastral parcel polygons (P_i)                               │
│                                  │                                                           │
│                                  ▼                                                           │
│   [ Forecast Mode Dashboard & Affected Parcel Table ]                                        │
│   • Displays parcel-level area at risk with amber disclaimer banner                          │
│   • Rule 5 Guardrail: Financial columns strictly suppressed                                  │
│     (Paid, Approved, and Pending figures omitted from forecast)                              │
│                                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Implemented Now vs. Proposed Future

| Implemented Now (Current Prototype) | Proposed Future (Full Production System) |
|---|---|
| Forecast UI mode switch (Recorded vs. Forecast) with synchronized map views | Automated satellite data ingestion pipeline (Sentinel-1 SAR and Sentinel-2 optical via GEE / Sentinel Hub) |
| Pre-computed deterministic mock forecast geometries generated via `scripts/generate-mocks.ts` and `scripts/generate-map-areas.ts` | Trained ConvLSTM and Spatiotemporal U-Net deep learning models for bankline retreat and inundation forecasting |
| Client-side Turf.js polygon clipping and parcel intersection calculations | Containerized FastAPI / PyTorch inference microservice serving real-time model predictions |
| Hackathon Rule 5 guardrails (financial compensation columns strictly stripped and suppressed) | Empirical validation against real-world multitemporal ground-truth banklines and RTK GNSS surveys |
| Amber disclaimer banner ("Model-based estimate, not an official government record") | Integration with Bangladesh Ministry of Land digital portals (e-Mutation, Digital Khatian) |

### 7.3 Accurate Scope & Codebase Reality
To maintain rigorous technical and scientific honesty, the role of Deep Learning and AI in BhumiDorpon is disclosed as follows:

1. **No Live Neural Network Runtimes in the Browser:** Inspection of `package.json` confirms that the current web prototype contains **no deep-learning runtimes** (such as TensorFlow.js, ONNX Runtime Web, PyTorch C++ bindings, or active Python microservices). All computation executed in the user's browser is dedicated to client-side UI rendering, state management, Leaflet cartography, and Turf.js computational geometry.
2. **Conceptual GeoAI Architecture:** The application's *Forecast* mode models the workflow of a proposed spatiotemporal Earth Observation pipeline:
   - **Satellite Remote Sensing Inputs:** Multitemporal Sentinel-1 SAR (penetrating cloud cover during monsoon) and Sentinel-2 multispectral imagery.
   - **Proposed Predictive Models:** Multitemporal Convolutional Long Short-Term Memory (ConvLSTM) networks and Spatiotemporal U-Nets to forecast 1-year forward riverbank migration and flood inundation envelopes:

     $$\hat{Y}_{t+1}$$

   - **Cadastral Spatial Coupling:** Intersecting the predicted hazard envelope with four-corner cadastral plot polygons using Turf.js computational geometry:

     $$\Delta\text{Area}_i = \text{Area}\left(P_i \cap \mathcal{H}_{\text{forecast}}\right)$$

3. **Current Prototype Implementation:** In the existing prototype, all forecast scenarios are **pre-computed, deterministic mock datasets** generated offline via `scripts/generate-mocks.ts` and `scripts/generate-map-areas.ts` using sinusoidal offset functions and Turf.js polygon intersections.
4. **Ethical Guardrails (Hackathon Rule 5 Compliance):** To prevent speculative AI projections from being misinterpreted as approved disaster compensation:
   - All forecast views enforce an amber **"Model-Based Estimate (Demo)"** banner.
   - Financial compensation columns (`Paid`, `Approved`, `Pending`) are **strictly stripped and suppressed** from all forecast tables and summary metrics.
   - The UI displays explicit disclaimer notices: *"This is a model-based estimate, not an official government record."*

---

## 8. System Architecture and Technology Stack

### 8.1 System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     USER WEB BROWSER (CLIENT)                                      │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                    │
│  ┌────────────────────────────┐   ┌────────────────────────────┐   ┌────────────────────────────┐  │
│  │   Next.js 14 App Router    │   │   Mapping & Cartography    │   │      State & Caching       │  │
│  │ • / Dashboard              │   │ • Leaflet 1.9.4            │   │ • Zustand Client Stores    │  │
│  │ • /river-erosion           │   │ • react-leaflet 4.2.1      │   │   - appStore.ts (Global)   │  │
│  │ • /flood & /owner/...      │   │ • GisMapCompare (Synced)   │   │   - layerStore.ts (Layers) │  │
│  │ • /landslide               │   │ • Light GIS Vector Basemap │   │ • TanStack React Query     │  │
│  │ • /char & /coastal         │   │ • Esri Satellite Imagery   │   │   - Version 5.59.0         │  │
│  │ • /settings (About & Team) │   │ • Turf.js Spatial Geometry │   │   - Async Latency Cache    │  │
│  └──────────────┬─────────────┘   └──────────────┬─────────────┘   └──────────────┬─────────────┘  │
│                 │                                │                                │                │
│                 └────────────────────────────────┼────────────────────────────────┘                │
│                                                  │                                                 │
│                                                  ▼                                                 │
│                                ┌───────────────────────────────────┐                               │
│                                │ Typed Mock Data Layer (lib/data)  │                               │
│                                │ • Simulated Latency (200-400ms)   │                               │
│                                │ • Cascading Hierarchy Resolvers   │                               │
│                                │ • Turf.js Area & Intersections    │                               │
│                                └─────────────────┬─────────────────┘                               │
│                                                  │                                                 │
└──────────────────────────────────────────────────┼─────────────────────────────────────────────────┘
                                                   │ (Reads local JSON)
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            STATIC RELATIONAL MOCK REPOSITORY (/mocks)                              │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ • Hierarchy: districts.json, upazilas.json, mouzas.json, rivers.json, hills.json, chars.json       │
│ • Hazard Envelopes: river_erosion.json, flood.json, landslide.json, char.json, coastal.json        │
│ • Cadastral & Ownership: plots.json (4-corner plots), owners.json (deed registers)                 │
│ • Areas & Rasters: /public/mocks/areas/**/*.json, /public/mocks/rasters/**/*.png                   │
│ • Generators: scripts/generate-mocks.ts & generate-map-areas.ts (via npm run generate:mocks)       │
│                                                                                                    │
│ [NOTE: Zero external database or backend server required. Runs 100% locally and offline]           │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Technology Stack Table

| Category | Technology | Version | Purpose in BhumiDorpon |
|---|---|---|---|
| **Framework** | Next.js | `^14.2.15` | Core React framework using the App Router architecture for client routing and layout management. |
| **Language** | TypeScript | `^5.6.2` | Strong static type checking across all data layers, cadastral models, and UI props. |
| **UI Library** | React | `^18.3.1` | Component-based interactive user interface rendering. |
| **Styling** | Tailwind CSS | `^3.4.13` | Utility-first CSS framework for clean, high-contrast, accessible layouts. |
| **Mapping Engine** | Leaflet | `^1.9.4` | Open-source mobile-friendly interactive mapping engine. |
| **React Map Wrapper** | react-leaflet | `^4.2.1` | React bindings for Leaflet map elements and layers. |
| **Spatial Analysis** | Turf.js (`@turf/turf`) | `^7.4.0` | In-browser computational geometry: polygon intersections, area calculation, centroid derivation. |
| **Async Data Caching** | TanStack React Query | `^5.59.0` | Asynchronous data fetching, query caching, and loading state management. |
| **State Management** | Zustand | `^4.5.5` | Lightweight client state stores (`stores/appStore.ts` for app state, `components/map/chrome/layerStore.ts` for map layers). |
| **UI Primitives** | Radix UI | Various | Accessible, unstyled UI primitives (Dialog, Dropdown, Popover, Slider, Tabs, Tooltip). |
| **Icons** | Lucide React | `^0.447.0` | Clean, accessible vector icons for navigation and status indicators. |
| **Charts** | Recharts | `^2.12.7` | Accessible SVG data visualizations for national hazard trends and compensation breakdowns. |
| **Testing** | Vitest | `^4.1.11` | Fast, modern unit test runner executing 10 comprehensive test suites (61 tests). |
| **E2E Testing** | Playwright | Configured | Headless browser testing framework for end-to-end user flow verification. |

---

## 9. Prerequisites

To run BhumiDorpon locally, ensure your environment meets the following requirements:

- **Node.js:** Version `18.x` or higher (tested and verified on Node.js `20.x`).
- **Package Manager:** `npm` (v9 or v10) or `pnpm`.
- **Operating System:** Windows 10/11, macOS, or modern Linux distribution.
- **Web Browser:** Modern web browser supporting WebGL and Canvas (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari).
- **Git:** Git version control system.

> [!NOTE]
> No database engine (PostgreSQL, MongoDB), Python environment, or external GIS desktop software (QGIS) is required to run this project.

---

## 10. Installation and Setup

Follow these step-by-step instructions to clone, configure, and launch BhumiDorpon locally:

### 10.1 Step 1: Clone the Repository
```bash
git clone https://github.com/panthoraj-005/Bhumi-Dorpon.git
cd Bhumi-Dorpon
```

### 10.2 Step 2: Install Dependencies
Install all required Node.js packages using `npm`:
```bash
npm install
```

### 10.3 Step 3: Verify / Re-Generate Mock Datasets (Optional)
The project comes with pre-generated mock datasets located in `/mocks` and `/public/mocks`. You can deterministically regenerate them at any time:
```bash
npm run generate:mocks
```
*(This command runs `scripts/generate-mocks.ts`, which generates all relational datasets in `/mocks` and invokes `scripts/generate-map-areas.ts` to generate spatial map areas and forecast scenarios in `/public/mocks/areas`.)*

### 10.4 Step 4: Start the Development Server
Launch the Next.js development server:
```bash
npm run dev
```

### 10.5 Step 5: Open the Application
Once the server indicates it is ready, open your web browser and navigate to:
```
http://localhost:3000
```

### 10.6 Building for Production (Optional)
To validate the production bundle or run in production mode:
```bash
# Build the production bundle
npm run build

# Start the production server
npm run start
```

> [!TIP]
> **Environment Configuration:** BhumiDorpon requires **no `.env` file** or third-party API keys to run in development or production. All datasets and satellite tile layers operate out-of-the-box.

---

## 11. Troubleshooting

The following solutions address common environment and configuration issues encountered during local setup:

### 11.1 Node.js Version Incompatibility
- **Symptom:** Build errors, syntax failures, or package compilation issues during `npm install` or `npm run dev`.
- **Cause:** Running an outdated Node.js runtime (version below 18.x).
- **Resolution:** Verify your current version with `node -v`. BhumiDorpon requires Node.js `18.x` or higher (tested and verified on Node.js `20.x`). If you use Node Version Manager (`nvm`), switch to or install Node 20:
  ```bash
  nvm use 20
  # or
  nvm install 20 && nvm use 20
  ```

### 11.2 Port 3000 Already in Use
- **Symptom:** `Error: listen EADDRINUSE: address already in use :::3000` when running `npm run dev`.
- **Cause:** Another process or development server is already bound to port 3000.
- **Resolution:** Launch the development server specifying an alternative port:
  ```bash
  npm run dev -- -p 3001
  ```
  Then open `http://localhost:3001` in your web browser.

### 11.3 Satellite Basemap Tiles Not Loading Offline
- **Symptom:** A blank tile canvas or missing imagery occurs when switching to the **Satellite** basemap in an offline environment.
- **Cause:** The Satellite basemap streams high-resolution satellite imagery tiles live from Esri World Imagery (`server.arcgisonline.com`), which requires an active internet connection.
- **Resolution:** When working offline or in air-gapped settings, switch to the **Light GIS** basemap option in the map chrome bar. The Light GIS basemap renders entirely from local synthetic vector datasets and operates 100% offline.

### 11.4 NPM Dependency Installation or Peer Dependency Conflicts
- **Symptom:** `npm ERR! ERESOLVE unable to resolve dependency tree` appears during package installation.
- **Cause:** Strict peer dependency resolution behaviors in certain npm package manager releases.
- **Resolution:** Install packages using the legacy peer dependencies flag:
  ```bash
  npm install --legacy-peer-deps
  ```

### 11.5 Mock Generation Script Failure
- **Symptom:** `npm run generate:mocks` terminates with compilation errors or file write permission faults.
- **Cause:** Node runtime mismatch or restricted write permissions in the `/mocks` and `/public/mocks` directories.
- **Resolution:** Ensure Node.js `18+` is active, confirm write permissions for the project folder, and run via the package script or local CLI runner:
  ```bash
  npm run generate:mocks
  # or run directly with Node using the local tsx runner:
  node ./node_modules/tsx/dist/cli.mjs scripts/generate-mocks.ts
  ```

---

## 12. How to Use the Application

### 12.1 National Overview Dashboard (`/`)
- When you open `http://localhost:3000`, the **National Land Change Overview** displays aggregate statistics across Bangladesh: total surveyed land area, recorded land loss, accreted land gain, and total compensation liabilities.
- Toggle between **Recorded** (historical verified events) and **Forecast** (model-based 1-year projections) modes using the mode toggle.
- Switch measurement units between **Decimals**, **Acres**, and **Hectares** via the unit toggle in the header.

### 12.2 Exploring a Hazard Module (e.g., `/river-erosion`)
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

### 12.3 Drilling Down into Flood & Owner Land Records (`/flood`)
1. Navigate to **Flood Monitoring** (`/flood`).
2. Select District (*Sylhet*) &rarr; Upazila (*Gowainghat*) &rarr; Mouza (*Jaflong*).
3. Select an archived flood event (e.g., *2024 Monsoon Flood*).
4. The map renders multi-depth flood inundation contours (`<0.5m` shallow, `0.5–1.5m` moderate, `>1.5m` deep) and colors cadastral parcels by landowner.
5. In the affected landowners table, click an owner's name (e.g., *"Rahim Uddin"*) to open the dedicated **Owner Land Detail Page** (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`).
6. Inspect the parcel's **Four-Corner GPS Coordinates**:
   - View exact latitude and longitude readouts for the **North-West (NW)**, **North-East (NE)**, **South-East (SE)**, and **South-West (SW)** parcel corners.
   - Click **"Copy 4 Corners"** to copy formatted coordinates to your clipboard for local surveyor reference.
   - Click **"Download GeoJSON"** to save the parcel boundary as a standard GIS file.

### 12.4 Viewing Project & Team Information (`/settings`)
- Click **Settings** in the sidebar.
- Select **About Project** (`/settings/about`) for a factual breakdown of system features, basemap mechanics, and data disclaimers.
- Select **Team Information** (`/settings/team`) to review verified development team credentials and copyright details.

---

## 13. Data Sources and Data Usage

### 13.1 Strict Compliance with Hackathon Rule Book
In accordance with the **LandTech Innovation Hackathon Rule Book, Version 1.2**:
- **No Real Personal Identifiable Information (PII):** The project uses **zero real human names, National ID (NID) numbers, phone numbers, email addresses, or private financial records**.
- **No Real Private Cadastral Titles:** No real land titles, registered land disputes, or authentic deed records have been extracted from government land registration offices.
- **No Web Scraping:** No automated scraping, bulk data harvesting, or denial-of-service queries were performed against any government portal (such as *eporcha.gov.bd*, *minland.gov.bd*, or *land.gov.bd*).

### 13.2 Detailed Data Classification Table

| Dataset / Asset | Data Type | Origin / Generation Method | Purpose in BhumiDorpon | Verification Status |
|---|---|---|---|---|
| **Administrative Hierarchy** (`districts.json`, `upazilas.json`, `mouzas.json`, `rivers.json`, `hills.json`, `chars.json`) | Synthetic / Sample | Modeled after official administrative naming conventions in Bangladesh (BBS codes, JL numbers) with synthetic bounding coordinates. | Powers cascading geographic selectors and administrative containment logic. | Verified Synthetic |
| **Cadastral Plots & Dag Numbers** (`plots.json`) | Synthetic / Dummy | Procedurally generated 4-corner closed polygons (5 coordinate pairs where point 5 repeats point 1) with fictional Dag Nos. (101–145). | Demonstrates parcel-level spatial hazard intersections and boundary recovery. | Verified Synthetic |
| **Landowner Deeds & Khatians** (`owners.json`) | Synthetic / Dummy | Fictional landowner names (*Abdul Karim*, *Rahima Begum*, *Fatema Begum*) and simulated Khatian deed numbers (*Khatian 12/A*). | Populates compensation tables and owner boundary detail views. | Verified Synthetic |
| **Hazard Geometries** (`river_erosion.json`, `flood.json`, `landslide.json`, `char.json`, `coastal.json`) | Synthetic / Dummy | Algorithmic vector polygons generated via Turf.js mathematical functions simulating bank retreat, flood extents, and hillscarps. | Renders spatial hazard overlays on before/after maps. | Verified Synthetic |
| **Pre-Computed Forecast Scenarios** (`/public/mocks/areas/**/*.json`) | Synthetic / Dummy | Deterministically computed forecast polygons and parcel intersection metrics generated via `scripts/generate-mocks.ts` and `scripts/generate-map-areas.ts`. | Powers GeoAI Forecast Mode concept demo with Rule 5 guardrails. | Verified Synthetic |
| **Landslide DEM Rasters** (`/public/mocks/rasters/**/*.png`) | Synthetic Rasters | Procedural 2D Gaussian elevation fields rendered into PNG hypsometric tints and hillshades via node canvas scripts. | Demonstrates topographic terrain shading and elevation profile visualization. | Verified Synthetic |
| **Satellite Imagery Basemap** | Public External Tiles | **Esri World Imagery** public WMTS tile service (`server.arcgisonline.com`). | Provides high-resolution global satellite context beneath vector overlays. | Verified Public External |

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

## 15. Testing and Verification

### 15.1 Automated Test Suite (Vitest)
BhumiDorpon includes an extensive automated unit test suite implemented with **Vitest**. All 10 test suites and 61 individual unit tests pass cleanly:

```bash
npm test
```

### 15.2 Verified Test Suites Summary

```
 RUN  v4.1.11 D:/Project/Antigravity/BhumiDorpon

 ✓ tests/step5_flood_flow.test.ts (6 tests)
     • Verifies flood event retrieval with Dag and Khatian numbers
     • Verifies landowner name and Dag filtering
     • Verifies 4-corner GPS readouts (6 decimals) and centroid exclusion
 ✓ tests/four_corners_geometry.test.ts (5 tests)
     • Verifies every plot has a closed ring of 5 coordinate points
     • Verifies exactly 4 distinct corners ordered: NW, NE, SE, SW
 ✓ tests/data_layer.test.ts (4 tests)
     • Verifies getDashboardSummary dynamic aggregation
     • Verifies cascading options derived from mock datasets
     • Verifies typed hazard results with Dag and Khatian metadata
 ✓ tests/step3_and_step4.test.ts (8 tests)
     • Verifies cascading child options validity
     • Verifies hasRecords = true flagging
     • Rule 5 Guardrail: Verifies forecast mode strictly excludes paid/approved/pending amounts
 ✓ tests/change3_part1_gis_basemap.test.ts (8 tests)
     • Verifies getMapArea basemap and mouza geometry loading
 ✓ tests/map_fixes.test.ts (4 tests)
     • Verifies distinct geographic bounds per hazard
 ✓ tests/settings_information.test.ts (4 tests)
     • Verifies About Project and Team Information rendering
 ✓ tests/units_and_compensation.test.ts (12 tests)
     • Verifies exact mathematical land unit conversions and compensation math
 ✓ tests/map_comparison_side_by_side.test.ts (3 tests)
     • Verifies dual map synchronization event guards
 ✓ tests/google_earth_kml.test.ts (7 tests)
     • Verifies KML 2.2 coordinate formatting, closed ring polygon, and XML escaping
     • Verifies four corner point placemarks and Google Earth web camera URL generation
     • Verifies strict client-side privacy, sanitized filenames, and mock parcel validation

 Test Files  10 passed (10)
      Tests  61 passed (61)
```

### 15.3 Verified Land Unit Conversion Ratios
All conversions implemented in `lib/units.ts` are mathematically verified by automated tests:
- **1 Decimal** = `40.4686 m²` (`435.6 sq ft`)
- **1 Acre** = `100 Decimals` = `4,046.86 m²`
- **1 Hectare** = `247.10538 Decimals` = `10,000 m²`

### 15.4 End-to-End (E2E) Testing (Playwright)
Playwright E2E test suites are configured in `playwright.config.mjs` to test full browser workflows:
```bash
npm run test:e2e
```

### 15.5 Status of Verification
- **Verified:** All unit tests, data layer functions, Turf.js calculations, coordinate precision (6 decimals), and Next.js 14 client compilation.
- **Remaining for Future Work:** Field GPS validation with real handheld RTK GNSS receivers; full production server load testing under concurrent user traffic.

---

## 16. Limitations

To ensure transparency, evaluators should take note of the following limitations in the current prototype:

1. **Client-Side Simulation:** The platform operates purely as a client-side prototype. It does not persist user changes to an external PostgreSQL or MongoDB database.
2. **Deterministic Synthetic Data:** All cadastral parcels, landowner identities, and hazard boundaries are synthetic. Coordinates cannot be used for legal dispute resolution or boundary demarcation on the ground.
3. **No In-Browser Deep Learning Inference:** As documented in [Section 7 (Deep Learning and AI)](#7-deep-learning-and-ai), predictive forecast scenarios represent model-assisted concepts and are rendered from pre-computed mock datasets, not active client-side neural networks.
4. **GeoAI Forecast Mode as a Concept Demo:** As documented in [Section 7 (Deep Learning and AI)](#7-deep-learning-and-ai), predictive forecast scenarios (riverbank retreat, inundation envelopes) represent a conceptual demonstration of a proposed ConvLSTM / U-Net Earth Observation pipeline. All forecast layers are deterministic, pre-computed mock datasets generated by `scripts/generate-mocks.ts` and `scripts/generate-map-areas.ts`, not live model inference. Financial compensation data is strictly suppressed in forecast mode to respect Hackathon Rule 5.
5. **Static Satellite Basemap:** While the Esri World Imagery basemap provides high-resolution context, it is a static snapshot and does not update dynamically with real-time satellite passes.
6. **Simulated Latency:** The mock data layer includes an intentional 200–400ms delay to demonstrate loading skeletons and async UI states.

---

## 17. Future Improvements

The following features represent realistic potential enhancements planned for future iterations:

- [ ] **Operational PostGIS / GeoServer Backend:** Migrate static JSON files to an enterprise PostgreSQL / PostGIS database with vector tile caching (Mapbox Vector Tiles / OGC API Features).
- [ ] **Automated Satellite Ingestion Pipeline:** Integrate Google Earth Engine (GEE) or Sentinel Hub APIs to automatically download, calibrate, and vectorize Sentinel-1 SAR and Sentinel-2 images after major flood and erosion events.
- [ ] **Live GeoAI Inference Service:** Deploy a containerized FastAPI / PyTorch microservice running fine-tuned Spatiotemporal U-Net models for real-time bankline migration prediction.
- [ ] **Government Portal Integration:** Build secure authenticated connectors to the Ministry of Land's e-Mutation and Digital Khatian deed services.
- [ ] **Bilingual Localization (Bangla & English):** Implement full bilingual support across all interface labels, tooltips, and downloadable PDF reports.
- [ ] **Citizen Mobile App & PWA:** Package the frontend as an offline-first Progressive Web App with GPS location tracking for field verification by affected landholders.

---

## 18. Project Structure

The actual file tree of the BhumiDorpon repository is organized as follows:

```
BhumiDorpon/
├── app/                              # Next.js 14 App Router routes
│   ├── char/                         # Char island module pages
│   ├── coastal/                      # Coastal erosion & accretion module pages
│   ├── flood/                        # Flood monitoring & drill-down pages
│   │   └── [mouzaId]/[floodId]/owner/[ownerId]/  # Dedicated Owner Land Detail page
│   ├── landslide/                    # Landslide hazards module pages
│   ├── river-erosion/                # River erosion module pages
│   ├── settings/                     # Settings hub
│   │   ├── about/                    # About Project view
│   │   └── team/                     # Team Information view
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
│       │   ├── BasemapSelector.tsx   # Basemap selection dropdown
│       │   ├── CoordinateReadout.tsx # Real-time cursor coordinates
│       │   ├── GraticuleLayer.ts     # Latitude/longitude graticule lines
│       │   ├── LayerControlPanel.tsx # Layer visibility preset panel
│       │   ├── LocatorInset.tsx      # Regional context inset map
│       │   ├── MapLegend.tsx         # Thematic hazard map legends
│       │   ├── NorthArrow.tsx        # Cartographic north indicator
│       │   ├── ViewToggle.tsx        # Viewport target switcher
│       │   └── layerStore.ts         # Zustand store for map layer toggles & presets
│       ├── panels/                   # MouzaSummaryPanel, WaterStatusCard, OwnerLegendPanel
│       ├── GisMapCompare.tsx         # Synchronized side-by-side comparison engine
│       ├── FloodMap.tsx              # Multi-depth inundation map overlay
│       ├── LandslideMap.tsx          # DEM hillshade & contour slope map
│       ├── RiverErosionMap.tsx       # Jamuna bankline retreat map
│       ├── CharMap.tsx               # Char island sandbar accretion map
│       ├── CoastalMap.tsx            # Estuarine shoreline migration map
│       └── OwnerPlotsLeafletMap.tsx  # 4-corner GPS plot boundary viewer
├── docs/                             # Technical specifications & documentation
│   ├── api-documentation.md          # REST & GIS data layer API specifications
│   ├── app-flow-user-flow.md         # End-to-end user navigation flows
│   ├── APP_FLOW.md                   # Application flow definitions
│   ├── ARCHITECTURE.md               # System architecture documentation
│   ├── architecture.svg              # System architecture diagram asset
│   ├── authentication-authorization-specification.md # Auth & role specs
│   ├── BACKEND_SCHEMA.md             # Production relational database schemas
│   ├── BUILD_RULES.md                # Development constraints & styling rules
│   ├── CHANGE_LOG.md                 # Development changelog
│   ├── CHANGE_PROMPT.md              # Feature change prompts
│   ├── CHANGE_PROMPT_2.md            # Secondary feature prompts
│   ├── database-backend-schema.md    # Database schema specifications
│   ├── DESIGN.md                     # UI/UX design system & token definitions
│   ├── FRONTEND_PROMPT.md            # Frontend implementation prompts
│   ├── MAIN-PROJECT-DOCUMENTATION.md # Comprehensive technical report
│   ├── MAP_FIX_SPEC.md               # Cartographic fix specifications
│   ├── MAP_SPEC.md                   # Basemap and vector layer specifications
│   ├── prd.md                        # Product Requirements Document
│   ├── project-roadmap.md            # Milestone roadmap
│   ├── security-specification.md     # Security & privacy compliance specifications
│   ├── STEPWISE_PROMPTS.md           # Stepwise task prompts
│   ├── system-architecture.md        # Technical architecture specifications
│   ├── testing-qa-documentation.md   # Quality assurance & testing guide
│   ├── trd.md                        # Technical Requirements Document
│   └── ui-ux-design-system.md        # Design token and theme definitions
├── lib/                              # Business logic, helpers, and data layer
│   ├── basemapConfig.ts              # Basemap layer definitions & colors
│   ├── data.ts                       # Typed asynchronous mock data layer
│   ├── googleEarth.ts                # Pure KML generator & Google Earth browser launcher
│   ├── types.ts                      # TypeScript interfaces (Plots, Owners, Hazards)
│   ├── units.ts                      # Land unit conversion utilities & compensation math
│   └── useSelection.ts               # Custom hook for cascading geographic selection
├── mocks/                            # Deterministic relational mock JSON datasets
│   ├── areas_index.json              # Spatial area lookup index
│   ├── char.json                     # Char island hazard geometries
│   ├── chars.json                    # Char island geographic index
│   ├── coastal.json                  # Coastal hazard records & transects
│   ├── common.json                   # Common administrative boundaries
│   ├── districts.json                # Pilot districts
│   ├── flood.json                    # Flood inundation records
│   ├── hazardResults.json            # Hazard result metadata index
│   ├── hills.json                    # Hill geographic index
│   ├── landslide.json                # Landslide hazard records
│   ├── mouzas.json                   # Cadastral mouzas
│   ├── owners.json                   # Landowner names & deed numbers
│   ├── plots.json                    # 4-corner cadastral plot geometries
│   ├── river_erosion.json            # River erosion hazard records
│   ├── rivers.json                   # River geographic index
│   ├── summary.json                  # National aggregate statistics
│   └── upazilas.json                 # Pilot upazilas
├── public/                           # Static assets, rasters, and area GeoJSON
│   └── mocks/                        # Static area JSONs and DEM raster hillshades
│       ├── areas/                    # Pre-computed area JSONs (char, coastal, flood, landslide, river)
│       └── rasters/                  # Synthetic DEM hillshades and slope PNGs
├── scripts/                          # Automated generation & audit scripts
│   ├── generate-mocks.ts             # Deterministic relational mock dataset generator
│   ├── generate-map-areas.ts         # Spatial area and forecast scenario generator
│   ├── final_acceptance_check_change3.mjs  # Acceptance audit test script
│   └── full_audit_prompt6.mjs        # Full UI flow audit script
├── stores/                           # Zustand client state management
│   └── appStore.ts                   # Active unit, mode, hazard, and cascading selection
├── tests/                            # Automated test suite (Vitest)
│   ├── change3_part1_gis_basemap.test.ts
│   ├── data_layer.test.ts
│   ├── four_corners_geometry.test.ts
│   ├── google_earth_kml.test.ts
│   ├── map_comparison_side_by_side.test.ts
│   ├── map_fixes.test.ts
│   ├── settings_information.test.ts
│   ├── step3_and_step4.test.ts
│   ├── step5_flood_flow.test.ts
│   └── units_and_compensation.test.ts
├── next.config.js                    # Next.js build configuration & redirects
├── package.json                      # Project dependencies & npm scripts
├── playwright.config.mjs             # Playwright E2E configuration
├── tailwind.config.ts                # Tailwind CSS design system configuration
├── tsconfig.json                     # TypeScript compiler configuration
└── vitest.config.mjs                 # Vitest test configuration
```

---

## 19. Team Information

**Team Name:** GeoNeural  
**Hackathon:** LandTech Innovation Hackathon 2026  

| Role | Name | Focus Areas |
|---|---|---|
| **Team Leader** | **Pantho Raj Biswas** | System Architecture, Geospatial Modeling, Leaflet Engine, Data Layer |
| **Team Member** | **Puja Paul** | Frontend Development, UI/UX Design System, Accessibility, Documentation |

**Copyright:** © 2026 GeoNeural. All rights reserved.

---

## 20. Credits and Acknowledgements

The GeoNeural team gratefully acknowledges the open-source community, tools, and resources that made BhumiDorpon possible:

- **Next.js & React Teams:** For the robust web framework and modern App Router foundation.
- **Leaflet & Vladimir Agafonkin:** For the lightweight, flexible mapping library powering all spatial visualizations.
- **Turf.js Community:** For the comprehensive client-side geospatial computational geometry tools.
- **Esri:** For providing open access to the World Imagery satellite tile service.
- **Radix UI & Lucide Icons:** For accessible UI primitives and crisp icon assets.
- **Vitest & Playwright Teams:** For high-performance testing frameworks that ensure codebase reliability.
- **LandTech Innovation Hackathon Organizers & Mentors:** For framing the vital challenges of land management, climate vulnerability, and digital governance in Bangladesh.

---

## 21. License

<!-- TODO: choose license (MIT / Apache-2.0 / all rights reserved) -->
The license for this repository has **not yet been specified**.  
All rights to the source code, design assets, and documentation are reserved by the development team:  
**© 2026 GeoNeural. All rights reserved.**

---

## 22. Repository and Demo Links

- **GitHub Repository:** [https://github.com/panthoraj-005/Bhumi-Dorpon.git](https://github.com/panthoraj-005/Bhumi-Dorpon.git)
- **Local Demonstration URL:** `http://localhost:3000` (after running `npm run dev`)
- **Live Production Deployment URL:** *Pending deployment / to be provided upon public cloud hosting.*
<!-- TODO: add live deployment URL before submission -->

---

## 23. Google Earth Parcel Outline Feature

### 23.1 Google Earth Parcel Outline Integration (Flood Owner Land Detail)
- **Feature:** On `/flood/[mouzaId]/[floodId]/owner/[ownerId]`, directly below the Four Corner Coordinates table, an **Open in Google Earth** button (Globe icon) allows landowners and relief officers to export parcel boundaries to 3D satellite visualization.
- **Workflow:** One click (1) synchronously opens Google Earth (web) in a new tab centered on the parcel (`https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`), (2) triggers browser download of `<floodId>_dag_<dagNo>_outline.kml`, and (3) displays an on-screen status hint for ~12 seconds: *"In Google Earth choose New → Open local KML file and select the downloaded file to display the parcel outline (Earth Pro: double-click the file)"*.
- **KML Contents:** KML 2.2 format containing a single `Polygon` (`clampToGround`, closed 5-point ring with coordinates written `lon,lat,0`), orange outline (`ff0088ff`) with translucent fill (`440088ff`), four numbered corner `Point` Placemarks (`1 (NW)`, `2 (NE)`, `3 (SE)`, `4 (SW)`), and comprehensive metadata (owner name, mouza name, Dag No., Khatian No., land class, area in decimal, flood status) alongside the mandatory disclaimer: *"BhumiDorpon demo (mock / synthetic data, not a legal survey)"*.
- **Zero Backend / Strict Privacy:** Pure client-side generation (`lib/googleEarth.ts`); no backend, database, external API key, or analytics. Only the bounding-box center and camera range pass via the public Earth URL; landowner names, deeds, and geometry remain strictly local to the user's device.
- **Tested & Verified:** Comprehensive unit test suite (`tests/google_earth_kml.test.ts`, 7 tests) verifying coordinate formatting, ring closure, XML escaping, non-4-corner rejection, camera math, sanitized filenames, and validation across real mock parcels.

### 23.2 Five-Hazard Information Store Architecture
All data for the five hazard categories (river erosion, flood, landslide, char formation/erosion, and coastal erosion/land formation) is saved as static, deterministic, mock/synthetic JSON files without any database:
1. **Runtime Store (`public/mocks/*.json`):** Served at `/mocks/*` and fetched by client browser components through `loadMockJson()` in `lib/data.ts`. Flat hazard datasets: `river_erosion.json`, `flood.json`, `landslide.json`, `char.json`, `coastal.json`, plus administrative indices and summary stats.
2. **Server / Test Store (`mocks/*.json`):** Mirrored copy read synchronously via `fs.readFileSync` in Node.js and Vitest test environments.
3. **Per-Area Map Packages (`mocks/areas/<hazard>/` & `public/mocks/areas/<hazard>/`):** Modular spatial packages (`areaId`, `bounds`, `basemap`, `hazardLayers`, `context`) resolved via `areas_index.json`.
4. **Terrain Rasters (`public/mocks/rasters/`, `public/mocks/hillshades/`):** DEM slope and elevation assets for landslide terrain modeling.
5. **Single Source of Truth:** Four-corner parcel coordinates stored in this relational JSON model serve as the single source for the cadastral table, copy buttons, CSV export, GeoJSON download, and Google Earth KML outlines.

---

## 24. Project Update History

In accordance with the LandTech Innovation Hackathon Rule Book requirements for documenting project improvements after Round 1:

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
| **Comprehensive 25-File Technical Documentation Suite** | Oct 2026 | Published exhaustive 25-file engineering and specification suite in `/docs` (PRD, TRD, System Architecture, Database Schema, Security Specification, QA Testing Documentation, UI/UX Design System, API Documentation, and Roadmap). |
| **GeoAI Forecast Highlighting & Technical Readme Enhancement** | Oct 2026 | Enhanced README with comprehensive GeoAI 1-year predictive forecast hazard envelope highlight, operational troubleshooting guide, and transparent disclosures that all predictive data is pre-computed mock/synthetic datasets generated via scripts rather than live neural network outputs. |
| **Google Earth Parcel Outline Feature & Five-Hazard Information Store** | Oct 2026 | Implemented full-width "Open in Google Earth" button on Flood Owner Land Detail pages (`app/flood/[mouzaId]/[floodId]/owner/[ownerId]/page.tsx`) with pure client-side KML 2.2 serializer (`lib/googleEarth.ts`), synchronous Google Earth web launch, KML file download, on-screen guidance hint, and 7 automated tests (`tests/google_earth_kml.test.ts`, bringing suite to 61/61 passing tests); documented the deterministic Five-Hazard Information Store architecture. |
| **Documentation Alignment & History Synchronization** | Oct 2026 | Re-audited and updated complete 14-milestone project update history in `README.md` and `docs/CHANGE_LOG.md`; synchronized test counts across documentation to 10 test suites (61/61 passing unit tests); ensured Section 24 is terminal section with valid anchor links. |

---

*This document was prepared with the utmost technical integrity, adhering to the LandTech Innovation Hackathon 2026 Rule Book, Version 1.2.*  
*For questions, academic review, or judging inquiries, please contact Team GeoNeural via the official repository.*
