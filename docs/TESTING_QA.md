# Testing & Quality Assurance Documentation — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Testing & QA Verification Report  
> **Testing Frameworks:** Vitest 4.1.11 (Unit/Integration) | Playwright (E2E) | TypeScript Compiler (`tsc`)  
> **Observed Verification Status:** **ALL 10 TEST SUITES & 61 UNIT TESTS PASSED (0 Failures)**  
> **Type Check Status:** **`npx tsc --noEmit` PASSED (0 Errors)**  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Security Specification](SECURITY_SPECIFICATION.md)

---

## Table of Contents

- [1. Testing Strategy and Tooling](#1-testing-strategy-and-tooling)
- [2. Verified Test Suites Catalog (10 Suites / 61 Tests)](#2-verified-test-suites-catalog-10-suites--61-tests)
  - [2.1 tests/four_corners_geometry.test.ts (5 tests)](#21-testsfour_corners_geometrytestts-5-tests)
  - [2.2 tests/step5_flood_flow.test.ts (6 tests)](#22-testsstep5_flood_flowtestts-6-tests)
  - [2.3 tests/data_layer.test.ts (4 tests)](#23-testsdata_layertestts-4-tests)
  - [2.4 tests/step3_and_step4.test.ts (8 tests)](#24-testsstep3_and_step4testts-8-tests)
  - [2.5 tests/google_earth_kml.test.ts (7 tests)](#25-testsgoogle_earth_kmltestts-7-tests)
  - [2.6 tests/change3_part1_gis_basemap.test.ts (8 tests)](#26-testschange3_part1_gis_basemaptestts-8-tests)
  - [2.7 tests/map_fixes.test.ts (4 tests)](#27-testsmap_fixestestts-4-tests)
  - [2.8 tests/units_and_compensation.test.ts (12 tests)](#28-testsunits_and_compensationtestts-12-tests)
  - [2.9 tests/settings_information.test.ts (4 tests)](#29-testssettings_informationtestts-4-tests)
  - [2.10 tests/map_comparison_side_by_side.test.ts (3 tests)](#210-testsmap_comparison_side_by_sidetestts-3-tests)
- [3. End-to-End (E2E) Browser Test Suites](#3-end-to-end-e2e-browser-test-suites)
- [4. Execution Commands and Observed Verification Logs](#4-execution-commands-and-observed-verification-logs)
  - [4.1 Vitest Unit Test Run (npm test)](#41-vitest-unit-test-run-npm-test)
  - [4.2 Static Type Checking (npx tsc --noEmit)](#42-static-type-checking-npx-tsc---noemit)
- [5. Manual QA Verification Checklist](#5-manual-qa-verification-checklist)
- [6. Continuous Integration & Quality Gate Policies](#6-continuous-integration--quality-gate-policies)

---

## 1. Testing Strategy and Tooling

BhumiDorpon enforces a comprehensive testing regime combining static type checking, fast unit/integration testing, geospatial geometric invariant verification, and end-to-end browser validation:

| Domain | Tool / Framework | Version | Purpose & Scope |
|---|---|---|---|
| **Unit & Integration** | Vitest | `^4.1.11` | High-speed testing of data access, unit math, geometry invariants, and KML serializers. |
| **Static Type Check** | TypeScript (`tsc`) | `^5.6.2` | Compile-time validation of TypeScript interfaces, null safety, and component contracts. |
| **End-to-End (E2E)** | Playwright | `@playwright/test` | Headless browser execution testing viewport synchronization, zoom controls, and clipboard actions. |
| **Spatial Validation** | Turf.js (`@turf/turf`)| `^7.4.0` | Topological closure, bounding-box validity, and centroid assertions. |

---

## 2. Verified Test Suites Catalog (10 Suites / 61 Tests)

All 10 test suites reside in [`tests/`](file:///d:/Project/Antigravity/BhumiDorpon/tests) and execute synchronously against the local source store (`mocks/*.json`):

### 2.1 `tests/four_corners_geometry.test.ts` (5 tests)
- **Topological Ring Closure:** Enforces that every cadastral plot polygon in the dataset forms a closed ring of 5 coordinate tuples where the 5th point strictly repeats the 1st.
- **Fixed Four-Corner Invariant:** Enforces that every plot has exactly four distinct boundary corners sorted in clockwise order: NW (`1`), NE (`2`), SE (`3`), SW (`4`).
- **Centroid Suppression:** Asserts that `getOwnerPlots()` intentionally strips centroid coordinates to eliminate ambiguity between boundary corners and geometric centroids.

### 2.2 `tests/step5_flood_flow.test.ts` (6 tests)
- **Flood Event Retrieval:** Validates that `getFlood()` returns single flood events containing `plotStatus` with verified Dag No. and Khatian No. identifiers.
- **Owner Filtering:** Asserts that `getFloodOwners()` filters correctly by landowner name and Dag No., returning an empty list for search misses.
- **Owner Profile Integrity:** Asserts that `getOwnerProfile()` provides the owner's legal name and father's name for profile headers.
- **Plot Readout Completeness:** Verifies that all plots returned by `getOwnerPlots()` possess 6-decimal GPS coordinates.

### 2.3 `tests/data_layer.test.ts` (4 tests)
- **Dynamic Aggregation:** Validates that `getDashboardSummary()` aggregates loss and gain figures accurately from the underlying mock JSON datasets.
- **Cascading Choices:** Validates that `getOptions()` correctly derives dependent selector choices from relational files.
- **Typed Hazard Results:** Asserts that `listResults()` and `getResult()` return typed objects with mandatory Dag and Khatian numbers.
- **Flood Query Methods:** Verifies that `listFloods()`, `getFlood()`, `getFloodOwners()`, and `getOwnerPlots()` satisfy interface contracts.

### 2.4 `tests/step3_and_step4.test.ts` (8 tests)
- **Cascading Child Validity:** Asserts that `getOptions()` lists only valid child entities belonging to the selected parent (e.g., only Kazipur mouzas appear under Upazila Kazipur).
- **Record Indicator Badging:** Validates that `getOptions()` marks options that have demo data with `hasRecords = true`.
- **Rule 5 Compliance (Forecast Disbursement Suppression):** Enforces strict compliance with Rule 5 by verifying that `getDashboardSummary("forecast")` completely strips `paidBDT`, `approvedBDT`, and `pendingBDT` fields.
- **Flood Depth Classification:** Verifies that flood owner records contain depthClass (`Shallow`, `Moderate`, `Deep`), flooded area, Dag No., and Khatian No.

### 2.5 `tests/google_earth_kml.test.ts` (7 tests)
- **Coordinate Formatting & Ring Closure:** Validates that `buildParcelKml()` serializes coordinates as `lon,lat,0` in a closed 5-point ring.
- **Corner Point Placemarks:** Verifies that four distinct numbered `<Point>` placemarks (`1 (NW)` to `4 (SW)`) are included.
- **XML Escaping:** Verifies that special XML characters (`&`, `<`, `>`, `"`, `'`) in owner names, mouza names, or notes are escaped cleanly.
- **Non-Quadrilateral Rejection:** Asserts that non-4-corner inputs throw descriptive validation errors.
- **Camera URL Math:** Verifies that `buildEarthCameraUrl()` accurately computes the bounding-box center and clamps camera range.
- **Sanitized Filenames:** Asserts that `buildKmlFileName()` generates clean filenames matching `<floodId>_dag_<dagNo>_outline.kml`.
- **Mock Parcel Validation:** Validates KML synthesis across real mock parcels from `public/mocks/flood.json`.

### 2.6 `tests/change3_part1_gis_basemap.test.ts` (8 tests)
- **Landslide Terrain Assets:** Enforces that every landslide area has all 6 raster files, contour GeoJSONs, spot height JSONs, and volume matches within 1%.
- **Map Area Loading:** Validates that `getMapArea()` loads modular spatial packages with mode variants via `areas_index.json`.
- **Light GIS Basemap Integrity:** Verifies client-rendered SVG vector geometries for offline basemap operation.

### 2.7 `tests/map_fixes.test.ts` (4 tests)
- **Regional Bounding Boxes:** Verifies that each hazard loads distinct geographic contexts and specific regional bounds (Kazipur corridor for River Erosion, Sunamganj/Jaflong for Floods, Rangamati for Landslides, Jamuna Chars for Char Islands, and Bhola/Kuakata for Coastal Changes).

### 2.8 `tests/units_and_compensation.test.ts` (12 tests)
- **Land Unit Ratios:** Validates mathematical conversions between Decimals, Acres ($1:100$), Bighas ($1:33$), Kathas ($1:1.65$), and Hectares ($1:247.10538$).
- **Currency Formatters:** Validates Bangladeshi Taka currency formatting with commas (e.g., `৳2,50,000`).
- **Compensation Formula:** Validates area, land class multiplier, and hazard severity weight calculations.

### 2.9 `tests/settings_information.test.ts` (4 tests)
- **Settings Navigation:** Verifies that the Settings hub provides access to exactly About Project and Team Information.
- **Team Attribution Verification:** Asserts that `/settings/team` displays the verified official team metadata (Team GeoNeural: Pantho Raj Biswas, Puja Paul).

### 2.10 `tests/map_comparison_side_by_side.test.ts` (3 tests)
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

 Test Files  10 passed (10)
      Tests  61 passed (61)
   Duration  22.14s
```

### 4.2 Static Type Checking (`npx tsc --noEmit`)

```text
$ npx tsc --noEmit
# Compiles with 0 errors across all routes, components, and libraries.
```

---

## 5. Manual QA Verification Checklist

| Test Item | Verification Procedure | Expected Result | Observed Status |
|---|---|---|---|
| **Cascading Dropdowns** | Select District &rarr; Upazila &rarr; River. | Child options filter correctly; changing parent resets child. | **PASS** |
| **Side-by-Side Dual Maps** | Pan or zoom left map viewport. | Right map immediately mirrors pan and zoom without stutter. | **PASS** |
| **In-Map Direct Zoom** | Click `+` or `−` zoom buttons on map chrome. | Both maps zoom immediately on first click. | **PASS** |
| **Basemap Toggle** | Toggle between Light GIS and Satellite. | Basemap switches without clearing hazard overlays or resetting zoom. | **PASS** |
| **Google Earth Parcel Export** | Click "Open in Google Earth" on Flood Owner Page. | `.kml` file downloads; Google Earth web tab opens; guidance toast appears. | **PASS** |
| **Rule 5 Compliance** | Switch dashboard or module to Forecast mode. | All `Paid`, `Approved`, and `Pending` fields disappear immediately. | **PASS** |
| **Unit Switcher** | Toggle Decimal &rarr; Acre &rarr; Hectare. | All table columns and KPI numbers convert accurately. | **PASS** |

---

## 6. Continuous Integration & Quality Gate Policies

Every pull request or release tag must pass the following quality gates:
1. `npm test`: All 10 test suites and 61 tests must pass (100% pass rate).
2. `npx tsc --noEmit`: Strict TypeScript compilation must produce 0 errors.
3. `npm run lint`: Next.js ESLint rules must pass with 0 warnings or errors.
4. **Zero Live Dependency Policy:** Build and test pipelines must execute cleanly without internet access or live database connections.
