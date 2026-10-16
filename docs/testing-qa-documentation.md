# Testing & Quality Assurance Documentation — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Hazard Dashboard**

---

> **Document Status:** Authoritative Testing & QA Verification Report  
> **Testing Frameworks:** Vitest 4.1.11 (Unit/Integration) | Playwright (E2E)  
> **Observed Verification Status:** **ALL 9 TEST SUITES & 54 TESTS PASSED** (0 Failures)  
> **Type Check Status:** **tsc --noEmit PASSED** (0 Errors)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [TRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/trd.md) | [PRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/prd.md) | [App Flow & User Flow](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/app-flow-user-flow.md)

---

## 1. Existing Testing Framework and Tools

The testing infrastructure utilizes modern, high-speed test harnesses configured in the workspace root:

| Testing Domain | Framework / Tool | Verified Version | Configuration File |
|---|---|---|---|
| **Unit & Integration** | Vitest | `^4.1.11` | [`vitest.config.mjs`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/vitest.config.mjs) |
| **End-to-End (E2E)** | Playwright | `@playwright/test` | [`playwright.config.mjs`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/playwright.config.mjs) |
| **Static Type Checking** | TypeScript Compiler (`tsc`) | `^5.6.2` | [`tsconfig.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tsconfig.json) |
| **Spatial Assertions** | Turf.js (`@turf/turf`) | `^7.4.0` | Geospatial polygon & bounding box validations |

---

## 2. Verified Test Suites Found in Repository

The test files reside in [`tests/`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests) and [`e2e/`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/e2e):

### 2.1 Unit & Integration Test Suites (`tests/`)
1. [`tests/data_layer.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/data_layer.test.ts) (4 tests): Tests aggregation functions, cascading choices, result filtering, and flood owner queries.
2. [`tests/step5_flood_flow.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/step5_flood_flow.test.ts) (6 tests): Validates flood events, plotStatus Dag/Khatian invariants, owner search, and 4-corner GPS readouts.
3. [`tests/step3_and_step4.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/step3_and_step4.test.ts) (8 tests): Validates parent-child selector filtering, `hasRecords` flags, and forecast disbursement suppression.
4. [`tests/four_corners_geometry.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/four_corners_geometry.test.ts) (5 tests): Enforces that every cadastral parcel possesses exactly 4 distinct corners in NW, NE, SE, SW order.
5. [`tests/change3_part1_gis_basemap.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/change3_part1_gis_basemap.test.ts) (8 tests): Validates landslide DEM rasters, contour GeoJSONs, spot heights, and map area mode variants.
6. [`tests/map_fixes.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/map_fixes.test.ts) (4 tests): Verifies that each of the 5 hazards loads distinct regional bounding boxes and geographic extents.
7. [`tests/units_and_compensation.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/units_and_compensation.test.ts) (12 tests): Verifies land area conversion ratios (Decimal, Acre, Ha), BDT currency formatters, and compensation logic.
8. [`tests/settings_information.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/settings_information.test.ts) (4 tests): Verifies that the Settings hub presents exactly About Project and Team Information with exact team metadata.
9. [`tests/map_comparison_side_by_side.test.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tests/map_comparison_side_by_side.test.ts) (3 tests): Validates side-by-side Before/After layout and removal of the legacy swipe divider.

### 2.2 End-to-End Test Suites (`e2e/`)
- `e2e/capture_screenshots.spec.ts`: Automated visual capture of dashboard and hazard modules.
- `e2e/flood_owner_four_corners.spec.ts`: End-to-end browser verification of owner land page, 4-corner coordinates, and copy actions.
- `e2e/flows_and_empty_states.spec.ts`: Verification of cascading selectors, empty-state screens, and mode toggles.
- `e2e/leaflet_maps_verification.spec.ts`: Verification of Leaflet DOM mounting, tiles, and sync listeners.
- `e2e/part2_gis_maps_verification.spec.ts`: Verification of basemap switching and overlay persistence.

---

## 3. Verified Test Execution Commands & Observed Results

### 3.1 Unit Test Execution (`npm test`)
Executed in project root on October 15, 2026:

```text
> bhumidorpon@0.1.0 test
> node --max-old-space-size=1536 ./node_modules/vitest/vitest.mjs run

 RUN  v4.1.11 D:/SOFTWARE/Project/Antigravity/BhumiDorpon

 ✓ tests/data_layer.test.ts (4 tests) 3605ms
 ✓ tests/step5_flood_flow.test.ts (6 tests) 3537ms
 ✓ tests/step3_and_step4.test.ts (8 tests) 2890ms
 ✓ tests/four_corners_geometry.test.ts (5 tests) 2080ms
 ✓ tests/change3_part1_gis_basemap.test.ts (8 tests) 1145ms
 ✓ tests/map_fixes.test.ts (4 tests) 748ms
 ✓ tests/units_and_compensation.test.ts (12 tests) 83ms
 ✓ tests/settings_information.test.ts (4 tests) 10ms
 ✓ tests/map_comparison_side_by_side.test.ts (3 tests) 7ms

 Test Files  9 passed (9)
      Tests  54 passed (54)
   Duration  30.44s
```
**Result: 100% PASSED (54/54 tests passed).**

### 3.2 TypeScript Compilation & Linting (`npm run lint`)
Executed in project root on October 15, 2026:

```text
> bhumidorpon@0.1.0 lint
> node --max-old-space-size=1536 ./node_modules/typescript/bin/tsc --noEmit
```
**Result: 100% PASSED (Exit code 0, 0 compiler errors).**

---

## 4. Key Test Cases and Observed Status

| Test ID | Test Suite | Description / Precondition | Test Steps | Expected Result | Status |
|---|---|---|---|---|---|
| **TC-UNIT-01** | `units_and_compensation` | 1 Decimal = $40.4686\text{ m}^2$ standard | Convert 100 Decimals to Acre | Returns exactly `1` Acre ($4,046.86\text{ m}^2$) | **PASSED** |
| **TC-UNIT-02** | `units_and_compensation` | Hectare ratio | Convert $247.10538$ Decimals to Ha | Returns `1.0` Hectare ($10,000\text{ m}^2$) | **PASSED** |
| **TC-UNIT-03** | `units_and_compensation` | Currency formatting | Format $500,000$ BDT | Returns `৳500,000` | **PASSED** |
| **TC-GEOM-01** | `four_corners_geometry` | Cadastral plots in `plots.json` | Inspect corner array of all parcels | Every plot has exactly 4 distinct corners with labels NW, NE, SE, SW | **PASSED** |
| **TC-GEOM-02** | `four_corners_geometry` | GPS coordinate precision | Inspect latitude & longitude | Coordinates formatted to 6 decimal places | **PASSED** |
| **TC-DATA-01** | `step3_and_step4` | Forecast mode rule enforcement | Query dashboard summary with `mode=forecast` | Suppresses `paidBDT`, `approvedBDT`, and `pendingBDT` fields | **PASSED** |
| **TC-DATA-02** | `step3_and_step4` | Cascading dropdown options | Query options for selected district | Returns only valid child upazilas; flags records with `hasRecords=true` | **PASSED** |
| **TC-MAP-01** | `map_fixes` | Regional extent isolation | Inspect default bounds for all 5 hazards | Each hazard loads distinct coordinates (e.g. Kazipur for river, Rangamati for landslide) | **PASSED** |
| **TC-MAP-02** | `map_comparison` | Side-by-side comparison layout | Inspect map compare container | Renders Before on left, After on right; swipe divider absent | **PASSED** |
| **TC-SET-01** | `settings_information` | Settings sub-pages | Query `/settings` navigation options | Exactly 2 options: About Project & Team Information | **PASSED** |
| **TC-SET-02** | `settings_information` | Development team credits | Inspect team information view | Displays Team Name: GeoNeural, Leader: Pantho Raj Biswas, Member: Puja Paul, © 2026 GeoNeural | **PASSED** |

---

## 5. End-to-End & UI Verification Strategy

The Playwright test suite (`e2e/`) verifies core browser workflows headlessly:
1. **Flow Verification (`flows_and_empty_states.spec.ts`):** Navigates through all cascading selectors; confirms that valid selections render maps and invalid selections render `EmptyState` cards.
2. **Four Corners Drill-Down (`flood_owner_four_corners.spec.ts`):** Navigates from `/flood` to the owner land page; verifies that the four corner coordinates table renders visibly and that the "Copy 4 Corners" button copies text to the navigator clipboard.
3. **Leaflet Map Synchronization (`leaflet_maps_verification.spec.ts`):** Panning the left map triggers a corresponding movement on the right map; switching basemaps retains active GeoJSON overlays.

---

## 6. Accessibility and Responsive QA Checks

- **Color Independence:** Verified that all losses have minus (`−`) indicators and coral tones, gains have plus (`+`) indicators and green tones, and forecasts have dashed borders.
- **Keyboard Navigation:** Verified that all dropdowns can be traversed via `ArrowUp` / `ArrowDown` and selected with `Enter`.
- **Viewport Testing:** Tested at $1440\text{px}$ (side-by-side desktop), $1024\text{px}$ (tablet), and $390\text{px}$ (vertically stacked mobile).

---

## 7. Bug Reporting Format

When defects or inconsistencies are identified, they must be recorded using the following standardized template:

```markdown
### Bug Report: [Short Title]
- **Issue ID:** BUG-XXX
- **Severity:** Critical / Major / Minor / Trivial
- **Module Affected:** River Erosion / Flood / Landslide / Char / Coastal / MapCompare / Settings
- **Preconditions:** (e.g., Browser width 390px, Satellite basemap active)
- **Steps to Reproduce:**
  1. Navigate to `/river-erosion/recorded/m_kazipur_01`
  2. Click Zoom In button
- **Observed Behavior:** (e.g., Map pan fails to synchronize)
- **Expected Behavior:** (e.g., Paired map updates zoom level immediately)
- **Root Cause / Code Reference:** (e.g., `components/map/GisMapCompare.tsx:L142`)
- **Fix Verification:** (Unit test added or E2E spec updated)
```

---

## 8. Known QA Limitations & Recommended Future Coverage

1. **Synthetic vs. Real Ground Truth:** Automated tests currently validate schema conformity against `/mocks`. They cannot validate whether coordinates align with physical ground-truth satellite features.
2. **Visual Regression Testing:** Storybook/Chromatic visual regression testing is not yet automated in CI/CD.
3. **Cross-Browser Headless Limitations:** Automated E2E runs use Chromium; scheduled nightly runs on WebKit (Safari) and Gecko (Firefox) are recommended.

---

<!-- addendum:google-earth-and-hazard-store -->
## 9. Addendum — Google Earth Parcel Outline & Five-Hazard Information Store QA

### 9.1 Vitest Unit & Integration Suite (`tests/google_earth_kml.test.ts`)
A dedicated Vitest test suite (`tests/google_earth_kml.test.ts`, 7 tests) validates the client-side Google Earth and KML generation engine:

| Test Case | Scope & Invariants Verified | Result |
|---|---|---|
| **1. Coordinate Ring Formatting** | Validates that `parcelRingToKmlCoordinates` returns 5 space-separated points in strict `lon,lat,0` order where point 5 repeats point 1 (`NW → NE → SE → SW → NW`). | PASSED |
| **2. KML 2.2 Structure & Disclaimer** | Verifies standard KML header (`xmlns="http://www.opengis.net/kml/2.2"`), single `Polygon` with `clampToGround` and `tessellate=1`, orange outline (`ff0088ff`), translucent fill (`440088ff`), four corner Placemark Points (`1 (NW)`, `2 (NE)`, `3 (SE)`, `4 (SW)`), owner metadata, and the required disclaimer text: *"BhumiDorpon demo (mock / synthetic data, not a legal survey)"*. | PASSED |
| **3. XML Escaping** | Asserts that `escapeXml` and `buildParcelKml` escape `&`, `<`, `>`, `"`, `'` characters, preventing XML syntax corruption when landowner names or notes contain special characters. | PASSED |
| **4. Non-4-Corner Rejection** | Ensures that `parcelRingToKmlCoordinates` and `buildParcelKml` throw explicit errors when passed empty, 3-point, or multi-vertex non-quadrilateral arrays. | PASSED |
| **5. Earth Camera URL Generation** | Verifies `getParcelCenter` computes bounding-box midpoint `(min + max) / 2`, `getCameraRangeMeters` enforces a minimum 20m extent with ~3x range scaling, and `buildEarthCameraUrl` adheres to `https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`. | PASSED |
| **6. Sanitized Filenames** | Verifies `buildKmlFileName` produces clean lowercase names matching `<floodId>_dag_<dagNo>_outline.kml` and sanitizes illegal characters. | PASSED |
| **7. Real Mock Parcels Integration** | Asynchronously loads flood events via `listFloods()` and owner parcels via `getOwnerPlots()`, generating and validating KML and Earth camera URLs across real mock plots. | PASSED |

### 9.2 Full Test Suite & Build Verification
- **Total Test Files:** 10 passed (`tests/google_earth_kml.test.ts`, `tests/step5_flood_flow.test.ts`, `tests/data_layer.test.ts`, `tests/step3_and_step4.test.ts`, `tests/four_corners_geometry.test.ts`, `tests/change3_part1_gis_basemap.test.ts`, `tests/map_fixes.test.ts`, `tests/units_and_compensation.test.ts`, `tests/settings_information.test.ts`, `tests/map_comparison_side_by_side.test.ts`).
- **Total Tests:** 61 passed out of 61.
- **Linter:** `npm run lint` (`tsc --noEmit`) passes with zero errors.
- **Production Build:** `npm run build` compiles all static and dynamic App Router routes successfully.

