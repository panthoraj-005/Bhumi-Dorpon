# Technical Requirements Document (TRD) — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Technical Specification  
> **System Version:** 1.2 (Enhanced Demonstration Release)  
> **Target Runtime:** Node.js 18+ / 20+ | Modern Web Browsers  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [API Documentation](API_DOCUMENTATION.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Authentication Specification](AUTH_SPECIFICATION.md) | [Testing & QA](TESTING_QA.md) | [Security Specification](SECURITY_SPECIFICATION.md) | [Project Roadmap](PROJECT_ROADMAP.md)

---

## Table of Contents

- [1. Technology Stack and Verified Package Versions](#1-technology-stack-and-verified-package-versions)
- [2. Framework, Languages, and Architectural Paradigms](#2-framework-languages-and-architectural-paradigms)
- [3. Complete Project Directory Structure](#3-complete-project-directory-structure)
- [4. Authentication and Demo Session Engine](#4-authentication-and-demo-session-engine)
  - [4.1 Client-Side Session Architecture (lib/auth.ts)](#41-client-side-session-architecture-libauthts)
  - [4.2 Unprivileged Demo Mode Isolation](#42-unprivileged-demo-mode-isolation)
  - [4.3 Registration, Validation, and Password Security](#43-registration-validation-and-password-security)
- [5. Centralized Bilingual Localization Engine](#5-centralized-bilingual-localization-engine)
  - [5.1 Translation Dictionary (lib/translations.ts)](#51-translation-dictionary-libtranslationsts)
  - [5.2 Bangla-First Default Initialization](#52-bangla-first-default-initialization)
  - [5.3 Bengali Numeral Localization (formatNumberLocalized)](#53-bengali-numeral-localization-formatnumberlocalized)
- [6. Global "Land Information" Search Subsystem](#6-global-land-information-search-subsystem)
  - [6.1 Cascading Search Engine (lib/landSearch.ts)](#61-cascading-search-engine-liblandsearchts)
  - [6.2 Preserving Leading Zeros in Dag and Khatian Numbers](#62-preserving-leading-zeros-in-dag-and-khatian-numbers)
  - [6.3 Structured 6-Section Cadastral Report Assembly](#63-structured-6-section-cadastral-report-assembly)
  - [6.4 Standardized Data Status Badges](#64-standardized-data-status-badges)
- [7. Land Destruction History & Deep-Learning Risk Prediction](#7-land-destruction-history--deep-learning-risk-prediction)
  - [7.1 Historical Land Loss Quantification](#71-historical-land-loss-quantification)
  - [7.2 Deep-Learning Hazard Probability Pipeline](#72-deep-learning-hazard-probability-pipeline)
  - [7.3 Permanent Submergence vs. Temporary Inundation](#73-permanent-submergence-vs-temporary-inundation)
  - [7.4 Cadastral Identity Preservation for Submerged Plots](#74-cadastral-identity-preservation-for-submerged-plots)
- [8. Landslide Mountain & Historical Event Selector](#8-landslide-mountain--historical-event-selector)
  - [8.1 Mountain-to-Event Catalog (lib/landslideEvents.ts)](#81-mountain-to-event-catalog-liblandslideeventsts)
  - [8.2 Two-Step Dependent Component (MountainEventSelector.tsx)](#82-two-step-dependent-component-mountaineventselectortsx)
  - [8.3 Dynamic Interface Updating in Recorded and Forecast Modes](#83-dynamic-interface-updating-in-recorded-and-forecast-modes)
- [9. Top-Level Smooth Scroll Navigation](#9-top-level-smooth-scroll-navigation)
- [10. Five-Hazard Information Store Architecture](#10-five-hazard-information-store-architecture)
  - [10.1 Dual JSON Storage Model](#101-dual-json-storage-model)
  - [10.2 Data Access Layer (lib/data.ts)](#102-data-access-layer-libdatats)
- [11. Mathematical Specifications and Unit Conversions](#11-mathematical-specifications-and-unit-conversions)
  - [11.1 Land Area Conversion Ratios](#111-land-area-conversion-ratios)
  - [11.2 Financial Compensation Formulas](#112-financial-compensation-formulas)
- [12. Cadastral Four-Corner Geometry Engine](#12-cadastral-four-corner-geometry-engine)
- [13. Google Earth Client-Side KML Export](#13-google-earth-client-side-kml-export)
- [14. Cartography & Dual-Map Synchronization Engine](#14-cartography--dual-map-synchronization-engine)
- [15. State Management & Data Fetching Architecture](#15-state-management--data-fetching-architecture)
- [16. Quality Assurance, Linting, and Test Specifications](#16-quality-assurance-linting-and-test-specifications)
- [17. Production Build, Performance, and Compatibility](#17-production-build-performance-and-compatibility)

---

## 1. Technology Stack and Verified Package Versions

The technology stack is verified directly against [`package.json`](file:///d:/Project/Antigravity/BhumiDorpon/package.json):

| Layer / Subsystem | Package / Technology | Verified Version | Purpose & Technical Rationale |
|---|---|---|---|
| **Core Framework** | Next.js | `^14.2.15` | App Router architecture, React Server/Client Components, file-based routing. |
| **Language Runtime** | TypeScript | `^5.6.2` | Strict compile-time type safety across all models, stores, and components. |
| **UI Library** | React / React DOM | `^18.3.1` | Concurrent rendering, stateful client hooks, modular UI hierarchy. |
| **Global State** | Zustand | `^4.5.5` | Centralized, performant store (`stores/appStore.ts`) managing language, unit, and auth. |
| **Server State / Cache** | TanStack React Query | `^5.59.0` | Asynchronous query caching, automatic deduplication, and loading/error states. |
| **Mapping Engine** | Leaflet | `^1.9.4` | Offline-first, lightweight interactive web mapping with SVG vector rendering. |
| **React Map Binding** | React-Leaflet | `^4.2.1` | Declarative React wrapper around Leaflet maps and layer controls. |
| **Spatial Geometry** | Turf.js (`@turf/turf`) | `^7.4.0` | Client-side bounding box computation, polygon centroiding, and area math. |
| **Data Visualization** | Recharts | `^2.12.7` | Responsive SVG area, bar, and trend charts for multi-year hazard metrics. |
| **Styling & Design** | Tailwind CSS | `^3.4.13` | Modern utility-first CSS design system with curated lime/ink palette. |
| **CSS Utilities** | `clsx` & `tailwind-merge` | `^2.1.1` / `^2.5.3` | Conflict-free dynamic className generation (`lib/utils.ts`). |
| **Vector Icons** | Lucide React | `^0.447.0` | Modern SVG iconography with zero runtime overhead. |
| **Test Framework** | Vitest | `^4.1.11` | Blazing-fast unit test execution across 14 test suites and 78 tests. |

---

## 2. Framework, Languages, and Architectural Paradigms

1. **Next.js 14 App Router:** Every route is managed under the `app/` directory with explicit dynamic segments (e.g., `app/landslide/[mode]/page.tsx`, `app/land-information/page.tsx`).
2. **Client Components with SSR Isolation:** Mapping and chart components utilizing browser APIs (`window`, `localStorage`, `canvas`, Leaflet) are declared with `"use client"` and dynamically imported with `{ ssr: false }`.
3. **Zustand Reactive Store:** Global user preferences (Language `'bn' | 'en'`, Area Unit `'decimal' | 'acre' | 'hectare'`, Period `'1y' | '3y' | '5y' | 'all'`, Auth Session) are decoupled from component hierarchies.
4. **Deterministic Mock Layer:** Fully independent of live external databases or server processes, enabling instantaneous offline deployment.

---

## 3. Complete Project Directory Structure

```text
BhumiDorpon/
├── app/
│   ├── char/
│   │   ├── [mode]/page.tsx         # Char Island Detailed View (Recorded & Forecast)
│   │   └── page.tsx                # Char Landing Page
│   ├── coastal/
│   │   ├── [mode]/page.tsx         # Coastal Detailed View (Recorded & Forecast)
│   │   └── page.tsx                # Coastal Landing Page
│   ├── dev/components/page.tsx     # UI Design System Component Showcase
│   ├── flood/
│   │   ├── [mouzaId]/[floodId]/
│   │   │   ├── owner/[ownerId]/page.tsx # Owner 4-Corner Land Inspection
│   │   │   └── page.tsx            # Flood Detailed Inundation View
│   │   └── page.tsx                # Flood Landing Page
│   ├── land-information/
│   │   └── page.tsx                # Global 5-Field Land Information Search & Report
│   ├── landslide/
│   │   ├── [mode]/page.tsx         # Landslide Detailed View with MountainEventSelector
│   │   └── page.tsx                # Landslide Landing Page with MountainEventSelector
│   ├── login/
│   │   └── page.tsx                # Standalone Authentication Page
│   ├── river-erosion/
│   │   ├── [mode]/page.tsx         # River Erosion Detailed View (Recorded & Forecast)
│   │   └── page.tsx                # River Erosion Landing Page
│   ├── settings/
│   │   ├── about/page.tsx          # About Project Documentation
│   │   ├── team/page.tsx           # Team GeoNeural Roster
│   │   └── page.tsx                # Settings Hub
│   ├── globals.css                 # Global CSS Tokens and Tailwind Directives
│   ├── layout.tsx                  # Root Layout with AuthModal, DemoBanner, AppSidebar
│   └── page.tsx                    # Home Dashboard with "Explore Disasters" Button
├── components/
│   ├── auth/
│   │   └── AuthModal.tsx           # Initial Entry Login, Sign-Up & Demo Access Modal
│   ├── map/
│   │   ├── DashboardMapPreview.tsx # Home Dashboard Small Leaflet Map Preview
│   │   ├── DualMapContainer.tsx    # Synchronized Side-by-Side Dual Map Engine
│   │   ├── GisBasemap.tsx          # Pure SVG Vector Light GIS Basemap
│   │   └── MapControls.tsx         # Zoom and Basemap Switcher Controls
│   ├── AppHeader.tsx               # Header with Language Switch, Land Info, Auth Badge
│   ├── AppSidebar.tsx              # Fixed 72px Navigation Sidebar with Localized Tooltips
│   ├── MountainEventSelector.tsx   # Two-Step Mountain & Historical Event Selector
│   ├── OwnerTable.tsx              # Cadastral Deed & Compensation Table (Rule 5 Compliant)
│   ├── SegmentedToggle.tsx         # Pill-Style Toggle Control
│   └── TrendChart.tsx              # Recharts Multi-Year Metric Visualization
├── docs/                           # Authoritative Documentation Suite (Synchronized)
│   ├── API_DOCUMENTATION.md
│   ├── APP_FLOW.md
│   ├── ARCHITECTURE.md
│   ├── AUTH_SPECIFICATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── MAIN_PROJECT_DOCUMENTATION.md
│   ├── PRD.md
│   ├── PROJECT_ROADMAP.md
│   ├── README.md
│   ├── SECURITY_SPECIFICATION.md
│   ├── TESTING_QA.md
│   ├── TRD.md
│   └── UI_UX_DESIGN_SYSTEM.md
├── lib/
│   ├── auth.ts                     # Authentication & Demo Session Logic
│   ├── data.ts                     # Unified Data Access Layer
│   ├── googleEarth.ts              # Client-Side KML 2.2 Serializer
│   ├── landSearch.ts               # Land Search Engine & Risk Prediction Model
│   ├── landslideEvents.ts          # Mountain & Historical Event Catalog
│   ├── translations.ts             # Centralized Bilingual Dictionary & Numeral Math
│   ├── types.ts                    # TypeScript Interface Definitions
│   └── units.ts                    # Decimal, Acre, Hectare, Currency Converters
├── mocks/                          # Deterministic Synthetic Information Store
│   ├── common.json                 # Districts, Upazilas, Rivers, Hills
│   ├── hills.json                  # Mountain Elevations, Slopes, and Risk Tiers
│   ├── landslide.json              # Landslide Geometry, Contours, and Scars
│   ├── mouzas.json                 # Cadastral Mouza Polygons & Metadata
│   ├── owners.json                 # Fictional Landowner Profiles
│   └── plots.json                  # Cadastral Plots with 4-Corner Geometry
├── stores/
│   └── appStore.ts                 # Zustand Global Store (Language, Auth, Cascade)
└── tests/                          # Automated Vitest Test Suite (14 Suites, 78 Tests)
```

---

## 4. Authentication and Demo Session Engine

### 4.1 Client-Side Session Architecture (`lib/auth.ts`)
The authentication subsystem provides client-side authentication, session validation, and unprivileged Demo Access:
- **`AuthUser` Interface:** `id`, `email`, `username`, `fullName`, `role` (`citizen` | `surveyor` | `researcher` | `demo`), `isDemo`, `createdAt`, `district`.
- **`AuthSession` Interface:** `user: AuthUser`, `token: string`, `expiresAt: string`.
- **LocalStorage Storage Keys:** `bhumidorpon_auth_session` and `bhumidorpon_registered_users`.

### 4.2 Unprivileged Demo Mode Isolation
Clicking **"Demo / ডেমো হিসেবে প্রবেশ করুন"** invokes `createDemoSession()`:
```typescript
export function createDemoSession(): AuthSession {
  const session: AuthSession = {
    user: DEMO_USER, // role: 'demo', isDemo: true
    token: `demo_token_${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  saveSession(session);
  return session;
}
```
**Security Isolation:** The `demo` role grants read-only browsing rights. It prevents administrative operations, data alteration, and is explicitly badged throughout the UI.

### 4.3 Registration, Validation, and Password Security
- Passwords must be $\ge 6$ characters.
- Strict confirmation match check: `password === confirmPassword`.
- Email/username duplication detection against existing users.
- Plaintext passwords are not exposed in client state or logs.

---

## 5. Centralized Bilingual Localization Engine

### 5.1 Translation Dictionary (`lib/translations.ts`)
Localization is centralized in `TRANSLATIONS` covering every domain: Brand, Navigation, Auth, Search, Reports, Badges, Hazards, and Units.
- Lookup helper: `t(key: TranslationKey, lang: Language): string`.
- Guarantees complete fallback to Bangla if any key is missing.

### 5.2 Bangla-First Default Initialization
On first visit, `useAppStore` initializes `language: "bn"`. It persists in `localStorage` under `bhumidorpon_language`. The header segmented control switches between `বাংলা` and `English` without reloading the page or resetting filters.

### 5.3 Bengali Numeral Localization (`formatNumberLocalized`)
```typescript
export function formatNumberLocalized(num: number | string, lang: Language): string {
  const str = String(num);
  if (lang !== "bn") return str;
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[0-9]/g, (match) => bengaliDigits[parseInt(match, 10)]);
}
```
Ensures numbers, years, percentages, and plot IDs render in Bengali script (e.g., `১০১`, `২০২৪`, `৮৪২০.৫`).

---

## 6. Global "Land Information" Search Subsystem

### 6.1 Cascading Search Engine (`lib/landSearch.ts`)
Implements `searchLandInformation(criteria)` connecting:
1. District selection
2. Upazila selection (filtered by District)
3. Mouza selection (filtered by Upazila)
4. Dag Number (text query)
5. Khatian Number (text query)

### 6.2 Preserving Leading Zeros in Dag and Khatian Numbers
Dag numbers such as `"0101"` or `"2271"` and Khatian numbers such as `"RS-475"` are stored and queried strictly as strings:
```typescript
if (cleanDag && p.dagNo !== cleanDag) return false;
if (cleanKhatian && p.khatianNo.toLowerCase() !== cleanKhatian.toLowerCase()) return false;
```
This prevents JavaScript number casting from truncating leading zeros.

### 6.3 Structured 6-Section Cadastral Report Assembly
The report returns:
- **Identification:** Geometry, Area, 4 Corners (NW, NE, SE, SW), Land Class.
- **Ownership:** Name, Father's Name, Masked NID, Recording Date.
- **Sale Status:** Official listing verification.
- **Legal Status:** Civil disputes, Section 144/145 injunctions.
- **Tax Status:** Land Development Tax payment record, receipt number.
- **Registration History:** Deed number, mutation khatian, sub-registry office.

### 6.4 Standardized Data Status Badges
- `verified` &rarr; `যাচাইকৃত` (Gain tone, checkmark)
- `demo` &rarr; `ডেমো ডেটা` (Accent tone, sparkle icon)
- `unverified` &rarr; `যাচাই করা সম্ভব হয়নি` (Warn tone, alert triangle)
- `unavailable` &rarr; `তথ্য পাওয়া যায়নি` (Muted tone, help circle)
- `external_required` &rarr; `বাহ্যিক ডেটা সংযোগ প্রয়োজন` (Secondary tone, link icon)

---

## 7. Land Destruction History & Deep-Learning Risk Prediction

### 7.1 Historical Land Loss Quantification
Provides verified multi-temporal records of permanent loss, erosion, inundation, and sediment accretion.

### 7.2 Deep-Learning Hazard Probability Pipeline
Returns model forecasts across:
- **River Erosion:** GeoAI-BD v2.4 (Multitemporal ConvLSTM)
- **Flood Inundation:** HydroSAR-FloodNet v1.8
- **Landslides:** InSAR SlopeNet v2.1
- **Coastal Shifts:** CoastWatch-Delta v1.2

Each result includes probability percentage, risk category (Low, Moderate, High, Extreme), forecast horizon, observation date, and confidence percentage.

### 7.3 Permanent Submergence vs. Temporary Inundation
Distinguishes physically disappeared land from temporarily flooded land.

### 7.4 Cadastral Identity Preservation for Submerged Plots
Plots eroded into the riverbed are not deleted from the record. Their physical status is marked as `historically_lost` (`ঐতিহাসিকভাবে বিলীন`), preserving their deed area and former ownership for future alluvion/khas claims.

---

## 8. Landslide Mountain & Historical Event Selector

### 8.1 Mountain-to-Event Catalog (`lib/landslideEvents.ts`)
Maps 12 major Chittagong Hill Tracts mountains (Ghagra, Furamon, Vedvedi, Sajek, Chimbuk, Nilgiri, Mirinja, Keokradong, Himchari, Teknaf, Inani, Jaflong) to historical slope failures and forecast models.

### 8.2 Two-Step Dependent Component (`MountainEventSelector.tsx`)
1. User selects a mountain.
2. The event list updates dynamically to show events for that mountain.
3. User selects an event.
4. Interface updates metrics: debris volume ($m^3$), slope angle, rainfall threshold, affected slope area, and impacted plot count.

---

## 9. Top-Level Smooth Scroll Navigation

Button labeled **"দুর্যোগসমূহ দেখুন" / "Explore Disasters"** in `AppHeader` invokes:
```typescript
const handleScrollToDisasters = () => {
  const el = document.getElementById("disaster-options");
  if (el) {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }
};
```
The target `<div id="disaster-options" className="space-y-4 pt-6 scroll-mt-24">` ensures sticky headers do not occlude the heading.

---

## 10. Quality Assurance, Linting, and Test Specifications

### Verified Test Suite (14 Test Suites, 78 Unit Tests)
Execution command: `npm test`
- `tests/localization.test.ts` (4 tests) — Default Bangla, English toggle, Bengali numerals, dictionary completeness.
- `tests/auth_demo_access.test.ts` (4 tests) — Demo access bypass, credential validation, role enforcement, password matching.
- `tests/land_search.test.ts` (4 tests) — 5-field cascading search, leading zero preservation, 6 report sections, DL risk prediction.
- `tests/mountain_event_selector.test.ts` (5 tests) — Hills catalog, recorded events, forecast events, mountain dependency resets.
- `tests/step5_flood_flow.test.ts` (6 tests) — Flood events, plot statuses, owner profiles, 4-corner GPS geometry.
- `tests/data_layer.test.ts` (4 tests) — Dashboard aggregation, cascading options, hazard result types.
- `tests/step3_and_step4.test.ts` (8 tests) — Parent-child validation, Rule 5 financial suppression in forecast mode.
- `tests/google_earth_kml.test.ts` (7 tests) — KML 2.2 serialization, camera altitude math, Earth URL generation.
- `tests/four_corners_geometry.test.ts` (5 tests) — NW, NE, SE, SW vertex ordering, 6 decimal precision.
- `tests/change3_part1_gis_basemap.test.ts` (8 tests) — Vector GIS basemap rendering, mode variants.
- `tests/map_fixes.test.ts` (4 tests) — Regional coordinate bounds, hazard context loading.
- `tests/units_and_compensation.test.ts` (12 tests) — Unit conversion ratios, Taka currency formatting.
- `tests/settings_information.test.ts` (4 tests) — Settings routing, about project, team roster.
- `tests/map_comparison_side_by_side.test.ts` (3 tests) — Synchronized dual Leaflet maps, re-entrancy protection.

**Type Checking:** `npm run lint` (`tsc --noEmit`) passes with 0 errors.  
**Production Build:** `npm run build` compiles 15 static routes with 0 errors.
