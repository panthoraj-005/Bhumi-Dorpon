# Testing & Quality Assurance Documentation — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Testing & QA Verification Report  
> **Testing Frameworks:** Vitest 4.1.11 (Unit/Integration) | Playwright (E2E) | TypeScript Compiler (`tsc`)  
> **Observed Verification Status:** **ALL 14 TEST SUITES & 78 UNIT TESTS PASSED (100% Pass Rate / 0 Failures)**  
> **Type Check Status:** **`npx tsc --noEmit` PASSED (0 Errors)**  
> **Production Build Status:** **`npm run build` PASSED (15 Static Routes Generated)**  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Security Specification](SECURITY_SPECIFICATION.md)

---

## Table of Contents

- [1. Testing Strategy and Tooling](#1-testing-strategy-and-tooling)
- [2. Verified Test Suites Catalog (14 Suites / 78 Tests)](#2-verified-test-suites-catalog-14-suites--78-tests)
  - [2.1 tests/localization.test.ts (4 tests) — NEW (v1.2)](#21-testslocalizationtestts-4-tests--new-v12)
  - [2.2 tests/auth_demo_access.test.ts (4 tests) — NEW (v1.2)](#22-testsauth_demo_accesstestts-4-tests--new-v12)
  - [2.3 tests/land_search.test.ts (4 tests) — NEW (v1.2)](#23-testsland_searchtestts-4-tests--new-v12)
  - [2.4 tests/mountain_event_selector.test.ts (5 tests) — NEW (v1.2)](#24-testsmountain_event_selectortestts-5-tests--new-v12)
  - [2.5 tests/four_corners_geometry.test.ts (5 tests)](#25-testsfour_corners_geometrytestts-5-tests)
  - [2.6 tests/step5_flood_flow.test.ts (6 tests)](#26-testsstep5_flood_flowtestts-6-tests)
  - [2.7 tests/data_layer.test.ts (4 tests)](#27-testsdata_layertestts-4-tests)
  - [2.8 tests/step3_and_step4.test.ts (8 tests)](#28-testsstep3_and_step4testts-8-tests)
  - [2.9 tests/google_earth_kml.test.ts (7 tests)](#29-testsgoogle_earth_kmltestts-7-tests)
  - [2.10 tests/change3_part1_gis_basemap.test.ts (8 tests)](#210-testschange3_part1_gis_basemaptestts-8-tests)
  - [2.11 tests/map_fixes.test.ts (4 tests)](#211-testsmap_fixestestts-4-tests)
  - [2.12 tests/units_and_compensation.test.ts (12 tests)](#212-testsunits_and_compensationtestts-12-tests)
  - [2.13 tests/settings_information.test.ts (4 tests)](#213-testssettings_informationtestts-4-tests)
  - [2.14 tests/map_comparison_side_by_side.test.ts (3 tests)](#214-testsmap_comparison_side_by_sidetestts-3-tests)
- [3. End-to-End (E2E) Browser Test Suites](#3-end-to-end-e2e-browser-test-suites)
- [4. Execution Commands and Observed Verification Logs](#4-execution-commands-and-observed-verification-logs)
  - [4.1 Vitest Unit Test Run (npm test)](#41-vitest-unit-test-run-npm-test)
  - [4.2 Static Type Checking (npm run lint / npx tsc --noEmit)](#42-static-type-checking-npm-run-lint--npx-tsc---noemit)
  - [4.3 Production Static Export Build (npm run build)](#43-production-static-export-build-npm-run-build)
- [5. Manual QA Verification Checklist](#5-manual-qa-verification-checklist)
- [6. Continuous Integration & Quality Gate Policies](#6-continuous-integration--quality-gate-policies)

---

## 1. Testing Strategy and Tooling

BhumiDorpon enforces a comprehensive testing regime combining static type checking, fast unit/integration testing, geospatial geometric invariant verification, and end-to-end browser validation:

| Domain | Tool / Framework | Version | Purpose & Scope |
|---|---|---|---|
| **Unit & Integration** | Vitest | `^4.1.11` | High-speed testing of data access, unit math, geometry invariants, auth, localization, and search. |
| **Static Type Check** | TypeScript (`tsc`) | `^5.6.2` | Compile-time validation of TypeScript interfaces, null safety, and component contracts. |
| **Production Build** | Next.js Build Pipeline | `14.2.15` | Static generation of all 15 routes, bundle verification, and dead-code detection. |
| **End-to-End (E2E)** | Playwright | `@playwright/test` | Headless browser execution testing viewport synchronization, zoom controls, and clipboard actions. |
| **Spatial Validation** | Turf.js (`@turf/turf`)| `^7.4.0` | Topological closure, bounding-box validity, and centroid assertions. |

---

## 2. Verified Test Suites Catalog (14 Suites / 78 Tests)

All 14 test suites reside in [`tests/`](file:///d:/Project/Antigravity/BhumiDorpon/tests) and execute synchronously against the local source store:

### 2.1 `tests/localization.test.ts` (4 tests) — NEW (v1.2)
- **Bangla Default Key Resolution:** Asserts that default lookups in `t(key, "bn")` return verified Bengali strings (e.g., `appTitle` &rarr; `"ভূমি-দর্পণ"`).
- **English Toggle Key Resolution:** Asserts that switching to `lang = "en"` resolves English labels without modifying key signatures (e.g., `appTitle` &rarr; `"Bhumi-Dorpon"`).
- **Bengali Numeral Formatting:** Asserts that `formatNumberLocalized(12345, "bn")` strictly produces `"১২৩৪৫"` and converts decimal points and commas correctly.
- **Fallback Resilience:** Confirms that missing or unknown translation tokens gracefully fall back to the key string without throwing runtime exceptions.

### 2.2 `tests/auth_demo_access.test.ts` (4 tests) — NEW (v1.2)
- **Seeded Credential Login:** Validates successful authentication of pre-seeded accounts (`surveyor` / `password123`, `citizen` / `citizen123`, `admin` / `admin123`).
- **Invalid Credential Rejection:** Asserts that incorrect passwords or nonexistent usernames return `{ success: false }` with localized error messages.
- **Registration Validation:** Asserts password length requirements (>=6 chars), email format validation, and rejects mismatched password confirmations.
- **Isolated Demo Access:** Asserts that `createDemoSession()` returns `isDemo: true` and verifies that `canPerformAdministrativeAction(demoUser)` strictly evaluates to `false`.

### 2.3 `tests/land_search.test.ts` (4 tests) — NEW (v1.2)
- **Cascading Dropdowns (District &rarr; Upazila &rarr; Mouza):** Validates dependent filtering across all 5 tiers (District, Upazila, Mouza, Dag No., Khatian No.).
- **Leading Zero Preservation:** Asserts that searching for Dag No. `"101"` matches string representations verbatim without integer truncation.
- **Structured 6-Section Report:** Verifies that successful searches produce complete data for Land ID (with 4 corners), Ownership, Sale, Legal, Tax, and Registration History.
- **Section 5 Multi-Hazard DL Predictions:** Asserts that deep-learning hazard risk forecasts and historical land changes return valid probability and damage metrics.

### 2.4 `tests/mountain_event_selector.test.ts` (5 tests) — NEW (v1.2)
- **Hills Catalog Loading:** Asserts `getHills()` loads the mountain catalog and provides slopes and properties for selection.
- **Historical Recorded Landslide Events:** Asserts `getEventsForMountain()` retrieves recorded historical events with affected slope area and debris volume.
- **Deep-Learning Forecast Scenarios:** Asserts `getEventsForMountain(..., "forecast")` returns forward-looking prediction scenarios with confidence scores.
- **Mountain Selection Reset:** Asserts that changing the mountain updates the available event list and defaults.
- **Unique Event Retrieval:** Asserts `getLandslideEventById()` retrieves specific landslide events by identifier.

### 2.5 `tests/four_corners_geometry.test.ts` (5 tests)
- **Topological Ring Closure:** Enforces that every cadastral plot polygon in the dataset forms a closed ring of 5 coordinate tuples where the 5th point strictly repeats the 1st.
- **Fixed Four-Corner Invariant:** Enforces that every plot has exactly four distinct boundary corners sorted in clockwise order: NW (`1`), NE (`2`), SE (`3`), SW (`4`).
- **Centroid Suppression:** Asserts that `getOwnerPlots()` intentionally strips centroid coordinates to eliminate ambiguity between boundary corners and geometric centroids.

### 2.6 `tests/step5_flood_flow.test.ts` (6 tests)
- **Flood Event Retrieval:** Validates that `getFlood()` returns single flood events containing `plotStatus` with verified Dag No. and Khatian No. identifiers.
- **Owner Filtering:** Asserts that `getFloodOwners()` filters correctly by landowner name and Dag No., returning an empty list for search misses.
- **Owner Profile Integrity:** Asserts that `getOwnerProfile()` provides the owner's legal name and father's name for profile headers.
- **Plot Readout Completeness:** Verifies that all plots returned by `getOwnerPlots()` possess 6-decimal GPS coordinates.

### 2.7 `tests/data_layer.test.ts` (4 tests)
- **Dynamic Aggregation:** Validates that `getDashboardSummary()` aggregates loss and gain figures accurately from the underlying mock JSON datasets.
- **Cascading Choices:** Validates that `getOptions()` derives dependent selector choices from relational files.
- **Typed Hazard Results:** Asserts that `listResults()` and `getResult()` return typed objects with mandatory Dag and Khatian numbers.
- **Flood Query Methods:** Verifies that `listFloods()`, `getFlood()`, `getFloodOwners()`, and `getOwnerPlots()` satisfy interface contracts.

### 2.8 `tests/step3_and_step4.test.ts` (8 tests)
- **Cascading Child Validity:** Asserts that `getOptions()` lists only valid child entities belonging to the selected parent (e.g., only Kazipur mouzas appear under Upazila Kazipur).
- **Record Indicator Badging:** Validates that `getOptions()` marks options that have demo data with `hasRecords = true`.
- **Rule 5 Compliance (Forecast Disbursement Suppression):** Enforces strict compliance with Rule 5 by verifying that `getDashboardSummary("forecast")` completely strips `paidBDT`, `approvedBDT`, and `pendingBDT` fields.
- **Flood Depth Classification:** Verifies that flood owner records contain depthClass (`Shallow`, `Moderate`, `Deep`), flooded area, Dag No., and Khatian No.

### 2.9 `tests/google_earth_kml.test.ts` (7 tests)
- **Coordinate Formatting & Ring Closure:** Validates that `buildParcelKml()` serializes coordinates as `lon,lat,0` in a closed 5-point ring.
- **Corner Point Placemarks:** Verifies that four distinct numbered `<Point>` placemarks (`1 (NW)` to `4 (SW)`) are included.
- **XML Escaping:** Verifies that special XML characters (`&`, `<`, `>`, `"`, `'`) in owner names, mouza names, or notes are escaped cleanly.
- **Non-Quadrilateral Rejection:** Asserts that non-4-corner inputs throw descriptive validation errors.
- **Camera URL Math:** Verifies that `buildEarthCameraUrl()` accurately computes the bounding-box center and clamps camera range.
- **Sanitized Filenames:** Asserts that `buildKmlFileName()` generates clean filenames matching `<floodId>_dag_<dagNo>_outline.kml`.
- **Mock Parcel Validation:** Validates KML synthesis across real mock parcels from `public/mocks/flood.json`.

### 2.10 `tests/change3_part1_gis_basemap.test.ts` (8 tests)
- **Landslide Terrain Assets:** Enforces that every landslide area has all 6 raster files, contour GeoJSONs, spot height JSONs, and volume matches within 1%.
- **Map Area Loading:** Validates that `getMapArea()` loads modular spatial packages with mode variants via `areas_index.json`.
- **Light GIS Basemap Integrity:** Verifies client-rendered SVG vector geometries for offline basemap operation.

### 2.11 `tests/map_fixes.test.ts` (4 tests)
- **Regional Bounding Boxes:** Verifies that each hazard loads distinct geographic contexts and specific regional bounds (Kazipur corridor for River Erosion, Sunamganj/Jaflong for Floods, Rangamati for Landslides, Jamuna Chars for Char Islands, and Bhola/Kuakata for Coastal Changes).

### 2.12 `tests/units_and_compensation.test.ts` (12 tests)
- **Land Unit Ratios:** Validates mathematical conversions between Decimals, Acres ($1:100$), Bighas ($1:33$), Kathas ($1:1.65$), and Hectares ($1:247.10538$).
- **Currency Formatters:** Validates Bangladeshi Taka currency formatting with commas (e.g., `৳2,50,000`).
- **Compensation Formula:** Validates area, land class multiplier, and hazard severity weight calculations.

### 2.13 `tests/settings_information.test.ts` (4 tests)
- **Settings Navigation:** Verifies that the Settings hub provides access to exactly About Project and Team Information.
- **Team Attribution Verification:** Asserts that `/settings/team` displays the verified official team metadata (Team GeoNeural: Pantho Raj Biswas, Puja Paul).

### 2.14 `tests/map_comparison_side_by_side.test.ts` (3 tests)
- **Dual Map Layout:** Asserts that Before and After maps render side-by-side simultaneously.
- **Re-Entrancy Guard:** Validates that bidirectional pan/zoom synchronization is guarded by `isSyncing` flags.
- **Divider Removal:** Confirms the removal of the legacy swipe divider in favor of direct side-by-side inspection.

---

## 3. End-to-End (E2E) Browser Test Suites

Configured in `e2e/` using Playwright:
- `e2e/capture_screenshots.spec.ts`: Automated visual capture of dashboard and hazard modules across viewports.
- `e2e/flood_owner_four_corners.spec.ts`: Headless browser test navigating to Flood Owner Land Detail page, verifying 4-corner table rendering, and testing clipboard copy buttons.
- `e2e/flows_and_empty_states.spec.ts`: Verifies cascading dropdown resets, empty-state messaging, and mode switches.
- `e2e/leaflet_maps_verification.spec.ts`: Verifies Leaflet DOM canvas mounting and sync listener binding.

---

## 4. Execution Commands and Observed Verification Logs

### 4.1 Vitest Unit Test Run (`npm test`)

```text
> bhumidorpon@0.1.0 test
> node --max-old-space-size=1536 ./node_modules/vitest/vitest.mjs run

 RUN  v4.1.11 D:/Project/Antigravity/BhumiDorpon

 ✓ tests/localization.test.ts (4 tests)
 ✓ tests/auth_demo_access.test.ts (4 tests)
 ✓ tests/land_search.test.ts (4 tests)
 ✓ tests/mountain_event_selector.test.ts (5 tests)
 ✓ tests/four_corners_geometry.test.ts (5 tests)
 ✓ tests/step5_flood_flow.test.ts (6 tests)
 ✓ tests/data_layer.test.ts (4 tests)
 ✓ tests/step3_and_step4.test.ts (8 tests)
 ✓ tests/google_earth_kml.test.ts (7 tests)
 ✓ tests/change3_part1_gis_basemap.test.ts (8 tests)
 ✓ tests/map_fixes.test.ts (4 tests)
 ✓ tests/units_and_compensation.test.ts (12 tests)
 ✓ tests/settings_information.test.ts (4 tests)
 ✓ tests/map_comparison_side_by_side.test.ts (3 tests)

 Test Files  14 passed (14)
      Tests  78 passed (78)
   Duration  24.32s
```

### 4.2 Static Type Checking (`npm run lint` / `npx tsc --noEmit`)

```text
$ npm run lint
> bhumidorpon@0.1.0 lint
> tsc --noEmit

# Output: 0 errors. TypeScript compilation passed cleanly.
```

### 4.3 Production Static Export Build (`npm run build`)

```text
$ npm run build
> bhumidorpon@0.1.0 build
> next build

   ▲ Next.js 14.2.35
   - Experiments: cpus, workerThreads

   Creating an optimized production build ...
 ✓ Compiled successfully
   Collecting page data ...
   Generating static pages (15/15)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                     Size     First Load JS
┌ ○ /                                           8.86 kB         128 kB
├ ○ /_not-found                                 880 B          88.6 kB
├ ○ /char                                       3.44 kB         118 kB
├ ƒ /char/[mode]                                5.83 kB         189 kB
├ ○ /coastal                                    3.42 kB         118 kB
├ ƒ /coastal/[mode]                             5.96 kB         189 kB
├ ○ /dev/components                             112 kB          278 kB
├ ○ /flood                                      3.82 kB         163 kB
├ ƒ /flood/[mouzaId]/[floodId]                  10.5 kB         156 kB
├ ƒ /flood/[mouzaId]/[floodId]/owner/[ownerId]  8.03 kB         136 kB
├ ○ /land-information                           11.5 kB         130 kB
├ ○ /landslide                                  4.45 kB         139 kB
├ ƒ /landslide/[mode]                           7.23 kB         197 kB
├ ○ /login                                      3.32 kB         101 kB
├ ○ /river-erosion                              3.47 kB         118 kB
├ ƒ /river-erosion/[mode]                       5.95 kB         189 kB
├ ○ /settings                                   4.59 kB         116 kB
├ ○ /settings/about                             7.86 kB         119 kB
└ ○ /settings/team                              4.4 kB          116 kB
+ First Load JS shared by all                   87.7 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 5. Manual QA Verification Checklist

| Test Item | Verification Procedure | Expected Result | Observed Status |
|---|---|---|---|
| **Entry Auth & Demo Bypass** | Open website with cleared storage. | AuthModal displays; clicking "Demo" grants immediate unprivileged access. | **PASS** |
| **Bangla / English Switch** | Click `বাংলা \| English` in header. | UI labels and numerals translate without route change or filter resets. | **PASS** |
| **Land Info 5-Field Search** | Select District &rarr; Upazila &rarr; Mouza &rarr; Dag `0101`. | Generates 6-section cadastral report and Section 5 DL predictions. | **PASS** |
| **Leading Zero Preservation** | Query Dag `"0101"` or Khatian `"RS-475"`. | Matches verbatim; leading zeros are never stripped or converted to `101`. | **PASS** |
| **Submerged Parcel Flag** | Search Dag `0101` in Kazipur. | Displays `"Completely Submerged / নদীগর্ভে বিলীন"` while retaining historical record. | **PASS** |
| **Mountain & Landslide Selector** | Select Batali Hill &rarr; Event June 2007. | Landslide map and telemetry update to Batali Hill event footprint. | **PASS** |
| **Mountain Reset Guard** | Switch from Batali Hill to Nilachal Ridge. | Selected event resets immediately if not associated with Nilachal. | **PASS** |
| **Scroll to Disasters** | Click "Explore Disasters" on homepage. | Viewport smoothly scrolls to `#disaster-options` accounting for sticky header offset. | **PASS** |
| **Cascading Dropdowns** | Select District &rarr; Upazila &rarr; River. | Child options filter correctly; changing parent resets child. | **PASS** |
| **Side-by-Side Dual Maps** | Pan or zoom left map viewport. | Right map immediately mirrors pan and zoom without stutter. | **PASS** |
| **Basemap Toggle** | Toggle between Light GIS and Satellite. | Basemap switches without clearing hazard overlays or resetting zoom. | **PASS** |
| **Rule 5 Compliance** | Switch dashboard or module to Forecast mode. | All `Paid`, `Approved`, and `Pending` fields disappear immediately. | **PASS** |

---

## 6. Continuous Integration & Quality Gate Policies

Every pull request or release tag must pass the following quality gates:
1. `npm test`: All 14 test suites and 78 tests must pass (100% pass rate).
2. `npx tsc --noEmit`: Strict TypeScript compilation must produce 0 errors.
3. `npm run build`: Production static build must generate all 15 routes with 0 errors.
4. **Zero Live Dependency Policy:** Build and test pipelines must execute cleanly without internet access or live database connections.
