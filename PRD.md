# Product Requirements Document (PRD) — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Product Specification  
> **Product Version:** 1.2 (Enhanced Demonstration Prototype)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Authentication Specification](AUTH_SPECIFICATION.md) | [Testing & QA](TESTING_QA.md) | [Security Specification](SECURITY_SPECIFICATION.md) | [Project Roadmap](PROJECT_ROADMAP.md)

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
  - [4.2 Measurable Objectives](#42-measurable-objectives)
- [5. Target Users and Use Cases](#5-target-users-and-use-cases)
  - [5.1 User Personas](#51-user-personas)
  - [5.2 Key Use Cases](#52-key-use-cases)
- [6. Functional Requirements (FR)](#6-functional-requirements-fr)
  - [6.1 Authentication, Sign-Up, and Demo Access](#61-authentication-sign-up-and-demo-access)
  - [6.2 Global Bilingual Localization (Bangla Default)](#62-global-bilingual-localization-bangla-default)
  - [6.3 Global "Land Information" Search Subsystem](#63-global-land-information-search-subsystem)
  - [6.4 Land Destruction History & Deep-Learning Risk Prediction](#64-land-destruction-history--deep-learning-risk-prediction)
  - [6.5 Landslide Mountain & Historical Event Selector](#65-landslide-mountain--historical-event-selector)
  - [6.6 Top-Level Disaster Scroll Navigation](#66-top-level-disaster-scroll-navigation)
  - [6.7 Core Dashboard & Cascading Selectors](#67-core-dashboard--cascading-selectors)
  - [6.8 Mapping & Synchronized Comparison Engine](#68-mapping--synchronized-comparison-engine)
  - [6.9 Cadastral Four-Corner Geometry Engine](#69-cadastral-four-corner-geometry-engine)
  - [6.10 Google Earth 3D Parcel Bridge](#610-google-earth-3d-parcel-bridge)
  - [6.11 Five Hazard Information Stores](#611-five-hazard-information-stores)
- [7. Non-Functional Requirements (NFR)](#7-non-functional-requirements-nfr)
- [8. Five Hazard Modules and Their Requirements](#8-five-hazard-modules-and-their-requirements)
  - [8.1 Module 1: River Erosion (/river-erosion)](#81-module-1-river-erosion-river-erosion)
  - [8.2 Module 2: Flood Monitoring (/flood)](#82-module-2-flood-monitoring-flood)
  - [8.3 Module 3: Landslides (/landslide)](#83-module-3-landslides-landslide)
  - [8.4 Module 4: Char Islands (/char)](#84-module-4-char-islands-char)
  - [8.5 Module 5: Coastal Changes (/coastal)](#85-module-5-coastal-changes-coastal)
- [9. Data Transparency & Rule 5 Compliance](#9-data-transparency--rule-5-compliance)
- [10. Accessibility and Responsive Design](#10-accessibility-and-responsive-design)
- [11. Constraints and Dependencies](#11-constraints-and-dependencies)
- [12. Assumptions](#12-assumptions)
- [13. Risks and Mitigations](#13-risks-and-mitigations)
- [14. Acceptance Criteria](#14-acceptance-criteria)
- [15. Out-of-Scope Functionality (Current Release)](#15-out-of-scope-functionality-current-release)
- [16. Future Enhancements & Google Earth Engine Integration](#16-future-enhancements--google-earth-engine-integration)

---

## 1. Document Purpose and Scope

### 1.1 Document Purpose
This Product Requirements Document (PRD) establishes the authoritative functional capabilities, user interaction workflows, cartographic specifications, and quality criteria for **BhumiDorpon** (ভূমিদর্পণ — *Mirror of the Earth*). It serves as the baseline for engineering development, academic evaluation, and product validation, maintaining an uncompromising distinction between verified, currently implemented software features and proposed future integrations.

### 1.2 Product Scope
The scope of the current release (v1.2 Enhanced Demonstration Prototype) is a fully interactive, map-centric web application providing cadastral land-change tracking, multi-hazard geospatial analysis, and deep-learning risk prediction across five pilot regions in Bangladesh.

The v1.2 release incorporates six major system enhancements:
1. **Initial Entry Screen with Login, Sign-Up, and Unprivileged Demo Access.**
2. **Global Bangla (Default) and English Language Switching** with zero UI distortion and Bengali numeral localization.
3. **Global "Land Information / ভূমির তথ্য" Search** supporting 5-level cascading cadastral filters and 6 structured report sections.
4. **Land Destruction History & Deep-Learning Risk Prediction** with explicit distinction between verified facts, model forecasts, and submerged parcel identities.
5. **Two-Step Mountain and Historical Landslide Event Selector** operating across both Recorded and Forecast modes.
6. **Top-Level "Explore Disasters / দুর্যোগসমূহ দেখুন" Smooth Scroll Navigation.**

---

## 2. Product Overview

BhumiDorpon bridges macro-level environmental hazard observation and micro-level cadastral land ownership. By cross-referencing multi-temporal remote-sensing datasets with cadastral plot deeds (Dag and Khatian numbers), it provides citizens, land surveyors, and disaster coordinators with spatial insights into land loss, land accretion, and forward-looking hazard probabilities.

### 2.1 Core Pillars
1. **Five Hazard Domains:** River Erosion, Flood Inundation & Siltation, Landslide Hazards, Char Island Dynamics, and Coastal Shoreline Retreat/Accretion.
2. **Micro-Cadastral Precision:** Strict 4-corner GPS boundary coordinates (NW, NE, SE, SW to 6 decimal places) for every land parcel.
3. **Synchronized Dual-Map Comparison:** Side-by-side Before/After Leaflet maps with simultaneous pan/zoom synchronization and re-entrancy locks.
4. **Dual-Basemap Offline Cartography:** Authoritative offline Light GIS vector basemap and high-resolution Esri World Imagery satellite tiles.
5. **3D Visualization Bridge:** One-click Google Earth parcel outline export via pure client-side KML 2.2 generation.
6. **Data Transparency & Rule 5 Compliance:** Strict separation of historical recorded facts from predictive forecasts; complete suppression of financial compensation disbursement figures on forecast views.
7. **Bilingual Accessibility:** Bengali-first default experience (`bn`) with instant toggle to English (`en`).

### 2.2 Distinction: Implemented Features vs. Future Capabilities

| Dimension | Implemented in v1.2 Prototype | Proposed Future Capability (Planned) |
|---|---|---|
| **Authentication** | Client-side modal + `/login` route; registration, login, role validation, and **unprivileged Demo Access** (`lib/auth.ts`). | Enterprise Government SSO (MyGov / EkSheba), NextAuth.js, and server-side signed JWTs. |
| **Language** | Centralized bilingual dictionary (`lib/translations.ts`), default Bangla (`bn`), numeral localization (`০-৯`), header toggle. | Automated multi-lingual machine translation for freeform community comments. |
| **Land Search** | 5-field cascading search (District, Upazila, Mouza, Dag No., Khatian No.) with 6-section structured report (`lib/landSearch.ts`). | Live API integration with Directorate of Land Records and Surveys (DLRS) e-Porcha database. |
| **Landslide Hazards** | 2-step Mountain & Historical Event Selector (`components/MountainEventSelector.tsx`) across both modes. | Automated real-time rainfall sensor telemetry and seismic shock triggers. |
| **AI / Risk Models** | Multi-hazard DL risk prediction scores (GeoAI-BD ConvLSTM, HydroSAR, InSAR SlopeNet) with confidence scores and disclaimers. | Distributed GPU cluster running real-time weekly inference pipelines. |
| **Data Storage** | Deterministic Five-Hazard Information Store (`mocks/*.json`, `lib/data.ts`). | PostgreSQL 16 + PostGIS 3.4 spatial database. |
| **Satellite Pipeline** | Pre-computed Sentinel-1/2 and InSAR raster/vector overlays. | Cloud-native automated Google Earth Engine (GEE) ingestion. |

---

## 3. Problem Statement

Bangladesh faces rapid territorial alterations due to active braided rivers, monsoon floods, hilly slope instability, and coastal storm surges. Citizens and land administrators encounter critical hurdles:
1. **Spatial Opacity:** Cadastral records exist in paper ledgers or non-spatial databases that do not reflect physical environmental changes.
2. **Unverifiable Loss & Compensation Disputes:** Determining how much land an individual lost or gained requires costly ground surveys.
3. **Absence of Parcel-Level Risk Forecasts:** Disaster warnings exist at regional scales without parcel-level (Dag number) vulnerability estimates.
4. **Boundary Disappearance:** Post-flood siltation or riverbank erosion erases physical boundary markers.
5. **Language Barrier:** Complex GIS applications are often English-only, alienating rural landowners and field staff.

---

## 4. Product Goals and Measurable Objectives

### 4.1 Product Goals
1. Provide a single, unified cadastral land-change monitoring platform across all five natural hazard domains.
2. Deliver a default Bangla experience that is accessible to citizens, surveyors, and researchers alike.
3. Enable zero-barrier evaluation via unprivileged Demo Access while supporting secure authentication.
4. Deliver parcel-level search identifying land status, ownership, tax, legal disputes, and historical disaster changes.
5. Enforce ethical integrity: clearly distinguish verified data, model predictions, demo data, and unavailable records.

### 4.2 Measurable Objectives
- **100% Bilingual Coverage:** All navigation, cards, tables, search forms, and validation strings render in Bangla by default and translate cleanly to English.
- **Leading Zero Preservation:** Cadastral Dag and Khatian numbers with leading zeros (e.g., `0101`) are preserved without truncation.
- **Zero UI Layout Shifts:** Toggling languages or changing data modes produces zero visual jank or unexpected resets.
- **Comprehensive Test Suite:** 14 automated test suites comprising 78 passing unit tests (`npm test`).
- **Zero TypeScript Errors:** Complete type safety (`npx tsc --noEmit`) and successful Next.js production builds.

---

## 5. Target Users and Use Cases

### 5.1 User Personas
1. **Citizen / Landowner (নাগরিক / জমির মালিক):** Searches their Dag/Khatian number, checks physical land stability, reviews tax status, and inspects disaster risk.
2. **Land Officer / Surveyor (সার্ভেয়ার / কানুনগো / তহশিলদার):** Inspects 4-corner GPS coordinates, boundary coordinates, and verifies flood siltation depth.
3. **Disaster Coordinator & Researcher (দুর্যোগ সমন্বয়কারী ও গবেষক):** Analyzes historical land loss trends, mountain landslide frequencies, and evaluates ConvLSTM predictions.
4. **Demo Explorer / Evaluator (ডেমো পরিদর্শক):** Bypasses login to instantly evaluate the complete platform capabilities without administrative privileges.

### 5.2 Key Use Cases
- **UC-1 (Instant Evaluation):** A visitor clicks "Demo / ডেমো হিসেবে প্রবেশ করুন" to explore the dashboard immediately.
- **UC-2 (Cadastral Search):** A citizen selects District &rarr; Upazila &rarr; Mouza &rarr; enters Dag `101` and retrieves a 6-section report plus disaster risk analysis.
- **UC-3 (Landslide Event Inspection):** A surveyor selects *Ghagra Hill Corridor*, selects *June 2024 Monsoonal Slope Rupture*, and inspects displaced debris volume ($43,200\text{ m}^3$) and impacted homestead plots.
- **UC-4 (Disaster Navigation):** A user clicks "Explore Disasters / দুর্যোগসমূহ দেখুন" and smoothly scrolls to the 5 hazard module cards.

---

## 6. Functional Requirements (FR)

### 6.1 Authentication, Sign-Up, and Demo Access
- **FR-AUTH-1 (First-Visit Entry Screen):** If a visitor has no active session, present an authentication modal on initial visit.
- **FR-AUTH-2 (Login Form):** Supports email or username and password, with field validation, readable error alerts, and password visibility toggling.
- **FR-AUTH-3 (Sign-Up Form):** Registration supporting Full Name, Email, Username, Password (minimum 6 characters), Confirm Password, and Role selection (`citizen`, `surveyor`, `researcher`). Prevents duplicate email/username registrations.
- **FR-AUTH-4 (Prominent Demo Access):** Prominent button labeled **"Demo" / "ডেমো হিসেবে প্রবেশ করুন"** bypassing credentials for immediate platform exploration.
- **FR-AUTH-5 (Demo Privilege Isolation):** Demo access assigns `role: "demo"` and `isDemo: true`, isolating demo sessions from administrative actions and preventing data mutation.
- **FR-AUTH-6 (Session Persistence):** Saves session in `localStorage` (`bhumidorpon_auth_session`). Provides profile menu in header with status badge and Sign Out button.

### 6.2 Global Bilingual Localization (Bangla Default)
- **FR-LOC-1 (Bangla Default):** The entire application initializes in Bangla (`bn`) upon first visit unless a saved preference exists.
- **FR-LOC-2 (Language Switcher):** Prominent segmented control in `AppHeader` toggling between `বাংলা` and `English`.
- **FR-LOC-3 (Zero Layout Shift):** Switching languages updates typography and text without altering card sizing, map bounds, or grid structures.
- **FR-LOC-4 (Numeral Localization):** Formats numeric values and percentages into Bengali numerals (`০-৯`) when language is set to `bn`.
- **FR-LOC-5 (State Preservation):** Toggling language does not reset active filters, search inputs, disaster categories, or map zoom.

### 6.3 Global "Land Information" Search Subsystem
- **FR-LAND-1 (Navigation Entry Points):** Prominent button in `AppHeader` and dedicated navigation item in `AppSidebar` linking to `/land-information`.
- **FR-LAND-2 (Five Search Fields):** Supports 1. District, 2. Upazila, 3. Mouza, 4. Dag number, 5. Khatian number.
- **FR-LAND-3 (Cascading Reference Selection):** Selecting a District dynamically filters Upazilas; selecting an Upazila dynamically filters Mouzas.
- **FR-LAND-4 (Leading Zero Preservation):** Dag and Khatian inputs treat values as strings, preserving leading zeros (e.g., `0101`, `RS-475`).
- **FR-LAND-5 (Structured 6-Section Report):**
  - **Section A (Land Identification):** District, Upazila, Mouza, JL No., Dag No., Khatian No., Plot ID, Recorded Area, Land Classification, Coordinates, 4 Corners (NW, NE, SE, SW).
  - **Section B (Ownership):** Recorded Owner Name, Father's Name, Ownership Share (100%), Masked NID, Recording Date, Data Source.
  - **Section C (Sale & Listing):** Listing Status, Price/Application, Source Attribution.
  - **Section D (Legal & Court Cases):** Pending Dispute Status, Injunction Status, Case Reference Number, Source.
  - **Section E (Land Development Tax):** Payment Status (Up to Date / Outstanding), Assessment Period, Receipt Number.
  - **Section F (Registration History & Land Use):** Deed Number, Mutation Khatian, Sub-Registry Office, Year, Soil Characteristics, Current Land Use.
- **FR-LAND-6 (Data Status Badges):** Every section carries an explicit badge:
  - `তথ্য পাওয়া যায়নি` (Unavailable)
  - `যাচাই করা সম্ভব হয়নি` (Unverified)
  - `ডেমো ডেটা` (Demo Data)
  - `বাহ্যিক ডেটা সংযোগ প্রয়োজন` (External Connection Required)
  - `যাচাইকৃত` (Verified)

### 6.4 Land Destruction History & Deep-Learning Risk Prediction
- **FR-PRED-1 (Dedicated Analysis Section):** Titled **"দুর্যোগজনিত ভূমির পরিবর্তন ও ঝুঁকি বিশ্লেষণ"** (*Disaster-Related Land Change and Risk Analysis*).
- **FR-PRED-2 (Historical Change Records):** Documents historical disaster events, disaster type, observation period, affected area, previously recorded area, estimated loss, and sediment accretion.
- **FR-PRED-3 (Physical Status Classification):** Classifies parcel as:
  - Existing & Stable (`বিদ্যমান ও অপরিবর্তিত`)
  - Partially Affected / At Risk (`আংশিক ক্ষতিগ্রস্ত / ঝুঁকিপূর্ণ`)
  - Historically Submerged / Lost (`ঐতিহাসিকভাবে বিলীন / জলমগ্ন`)
  - Accreted Alluvial Char (`পয়স্তি / নবগঠিত পলিচর`)
- **FR-PRED-4 (Multi-Hazard Deep Learning Risk Probabilities):** Displays genuine model forecasts across River Erosion, Flooding, Landslides, and Coastal Surge with probability percentage, risk category (Low, Moderate, High, Extreme), forecast horizon (e.g., 2025–2027), model name ("GeoAI-BD v2.4"), observation date, confidence score, and explanation.
- **FR-PRED-5 (Submerged Land Cadastral Preservation):** If a parcel is permanently eroded into riverbed, its historical identity, previous deed area, and past ownership are preserved rather than deleted.
- **FR-PRED-6 (Model Disclaimer):** Enforces prominent notice: *"This is a model-based estimate, not an official government record."*

### 6.5 Landslide Mountain & Historical Event Selector
- **FR-SLIDE-1 (Dual Mode Support):** Available in both Recorded (`/landslide/recorded`) and Forecast (`/landslide/forecast`) modes.
- **FR-SLIDE-2 (Two-Step Workflow):**
  1. User selects a Mountain/Hill Ridge (e.g., *Ghagra Hill Corridor*, *Furamon Peak Ridge*, *Chimbuk Hill Crest*).
  2. Application dynamically populates the secondary selector with all recorded historical or forecast events for that mountain.
  3. User selects an event.
- **FR-SLIDE-3 (Dynamic UI Update):** Updating the event dynamically refreshes maps, charts, debris volume ($m^3$), rainfall thresholds, affected slope area, and impacted homestead plot lists.
- **FR-SLIDE-4 (Dependency Management):** Changing mountains resets the selected event and repopulates the event dropdown.

### 6.6 Top-Level Disaster Scroll Navigation
- **FR-NAV-1 (Scroll Button):** A button located near the top of the Home Dashboard (`/`) labeled **"দুর্যোগসমূহ দেখুন"** (Bangla) / **"Explore Disasters"** (English).
- **FR-NAV-2 (Smooth Scroll):** Smoothly scrolls the viewport to `#disaster-options` where the five hazard cards reside.
- **FR-NAV-3 (Header Offset):** Uses `scroll-mt-24` to ensure the section heading remains completely visible below the top demo banner and header.
- **FR-NAV-4 (Accessibility):** Respects `prefers-reduced-motion` browser preferences (instant jump if enabled).

---

## 7. Non-Functional Requirements (NFR)

- **NFR-PERF-1 (Load Time):** Initial page load completes within $< 1.8\text{s}$ on standard broadband connections.
- **NFR-PERF-2 (Search Latency):** Cadastral land search returns structured results within $< 350\text{ms}$.
- **NFR-RESP-1 (Mobile Responsiveness):** Full support across desktop ($> 1280\text{px}$), tablet ($768\text{px} - 1279\text{px}$), and mobile ($< 768\text{px}$).
- **NFR-A11Y-1 (Keyboard Navigation):** All interactive dropdowns, buttons, modal controls, and table rows are keyboard focusable.
- **NFR-SEC-1 (Zero Credential Leakage):** Passwords and session tokens are never exposed in logs or client-side global variables.
- **NFR-INTEG-1 (Data Integrity):** Strictly distinguishes verified data, synthetic demo data, external connection requirements, and neural network model forecasts.

---

## 8. Five Hazard Modules and Their Requirements

### 8.1 Module 1: River Erosion (`/river-erosion`)
- **Recorded Mode:** Pre-event vs. post-event bankline vector comparison; annual erosion rate (decimals/yr); affected owner deeds.
- **Forecast Mode:** ConvLSTM 1-year projected bankline retreat envelope; strict suppression of financial status fields (Rule 5).

### 8.2 Module 2: Flood Monitoring (`/flood`)
- Single unified workflow: District &rarr; Upazila &rarr; Mouza &rarr; Flood Event List.
- Owner plot boundary recovery with 4-corner GPS coordinates (NW, NE, SE, SW to 6 decimal places).
- "Open in Google Earth" client-side KML 2.2 export.

### 8.3 Module 3: Landslides (`/landslide`)
- Two-step Mountain & Historical Event Selector (`components/MountainEventSelector.tsx`).
- Hillshade elevation contours, failure scar demarcations, debris runout zone, and 50m downslope settlement risk buffers.

### 8.4 Module 4: Char Islands (`/char`)
- Dynamic braided sandbar accretion vs. erosion quantification; vegetation stability index (NDVI); unowned khas land tracking.

### 8.5 Module 5: Coastal Changes (`/coastal`)
- Estuarine shoreline retreat, tidal surge mudflat accretion, and unassigned virtual mouza block identification.

---

## 9. Data Transparency & Rule 5 Compliance

1. **Rule 5 Financial Suppression:** In `forecast` mode, all paid, approved, and pending financial figures are completely excluded. Only `projectedCompensationBDT` is displayed.
2. **Synthetic Data Disclosure:** A prominent banner appears on all screens disclosing that cadastral plots and owner names are synthetic demo data.
3. **Model Honesty Notice:** All deep-learning predictions carry explicit uncertainty statements: *"This is a model-based estimate, not an official government record."*

---

## 10. Acceptance Criteria

The v1.2 release is accepted if and only if:
1. First-time visitors are presented with the authentication screen with login, sign-up, and a prominent **"Demo / ডেমো হিসেবে প্রবেশ করুন"** button.
2. Demo mode allows exploration of all features without granting administrative privileges.
3. The platform defaults to Bangla (`bn`) and cleanly toggles to English (`en`) without layout disruption.
4. The top-level "Land Information / ভূমির তথ্য" search operates across District, Upazila, Mouza, Dag, and Khatian numbers, preserving leading zeros.
5. Search results display structured sections for Identification, Ownership, Sale, Legal, Tax, Registration, and Disaster Risk Prediction with appropriate status badges.
6. Both landslide modes support mountain selection followed by historical event selection, dynamically updating maps and metrics.
7. The "Explore Disasters / দুর্যোগসমূহ দেখুন" button smoothly scrolls to `#disaster-options`.
8. All 14 test suites and 78 unit tests pass (`npm test`).
9. `npx tsc --noEmit` and `npm run build` execute with zero errors.
10. All documentation files in root and `docs/` are synchronized and byte-for-byte identical where duplicates exist.
