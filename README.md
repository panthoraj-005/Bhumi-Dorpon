# BhumiDorpon
> **Bangladesh Cadastral Land-Change Records & Hazard Dashboard**

---

> [!IMPORTANT]
> **DEMO DATA DISCLAIMER & ARCHITECTURAL NOTE**
> **All data in this project is strictly fictional mock data.** Every person's name (e.g. *"Abdul Karim"*, *"Rahima Begum"*), plot number (dag), khatian deed number, and compensation status is invented for demonstration purposes only.
> **This application has NO backend server or external database.** All flows, cascading filters, before/after maps, and calculations run entirely client-side using local mock datasets located in `/mocks`. Mock datasets can be deterministically re-generated with `npm run generate:mocks`.

---

## Overview

BhumiDorpon is a modern, responsive web application for monitoring cadastral land changes, erosion losses, accretion gains, and projected environmental hazard impacts across Bangladesh. It adheres to the minimalistic light design language specified in `/docs/DESIGN.md`, prioritizing high-contrast legibility, accessible data tables, and keyboard navigation.

### The Five Core Modules

1. **River Erosion** (`/river-erosion`):
   - **Selector Flow**: District &rarr; Upazila &rarr; River &rarr; Riverside Mouzas &rarr; Pick one.
   - **Pilot Cluster**: Sirajganj (Kazipur, Jamuna River).
   - **Metrics**: Bank retreat velocity, eroded homestead counts, before/after satellite comparison slider, owner compensation table.

2. **Flood Monitoring** (`/flood`):
   - **Selector Flow**: District &rarr; Upazila &rarr; Mouza (+ optional Year chip filters: 2022–2025).
   - **Pilot Cluster**: Sylhet (Gowainghat, Jaflong, Sari-Goyain River).
   - **Features**: Single-path flood archive list with severity, inundation, duration, max depth, affected owner count &rarr; Drill-down detail page with multi-depth `FloodMap` (Shallow <0.5m, Moderate 0.5–1.5m, Deep >1.5m) and parcel submersion table &rarr; Dedicated **Owner Land Page** (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`) spotlighting individual owner parcels, 6-decimal GPS centroid coordinates, expandable parcel boundary corners, "Copy Coordinates", and "Download GeoJSON".

3. **Landslide Hazards** (`/landslide`):
   - **Selector Flow**: District &rarr; Upazila &rarr; Hill &rarr; Recorded Event / Forecast Event &rarr; Pick one.
   - **Pilot Cluster**: Rangamati (Kawkhali, Ghagra hill corridor).
   - **Metrics**: Slope angle (38°–44°), displaced soil volume (`45,200 m³` recorded / `62,800 m³` forecast), synthetic DEM hillshade, contour isolines, failure scarp, and debris runout risk buffer.

4. **Char Islands** (`/char`):
   - **Selector Flow**: District &rarr; Upazila &rarr; River &rarr; Char Island &rarr; Pick one.
   - **Pilot Cluster**: Sirajganj (Kazipur, Jamuna River, Char Girish).
   - **Extras**: Dedicated **Unowned Land (State Khas Alluvial Accretion)** card with area under deed `1/1 (State)`.

5. **Coastal Shoreline & Accretion** (`/coastal`):
   - **Selector Flow**: District &rarr; Upazila &rarr; Mouzas including "Unassigned new land" entries &rarr; Pick one.
   - **Pilot Cluster**: Bhola (Monpura & Char Fasson).
   - **Extras**: Dedicated **Unowned Land (Unassigned Mudflats)** card cataloging virtual cadastral accretion blocks seaward of established mouzas.

---

## Mock Data Layer Architecture (`/lib/data.ts`)

All application views read from a typed, async mock data layer with an intentional 200–400ms simulated latency to display loading skeletons:
- **`getDashboardSummary(mode)`**: Dynamically aggregates metrics across active hazard records. In `mode === "forecast"`, paid, approved, and pending metrics are strictly stripped (Rule 5).
- **`getOptions(hazard, mode, step, selectionSoFar)`**: Cascades valid geographic children and flags active records with `hasRecords = true`.
- **`listResults(hazard, mode, selection)`**: Retrieves filtered hazard results with genuine Turf.js polygon intersection impacts.
- **`listFloods(selection)`**: Queries multi-year flood event archives by mouza and optional year.
- **`getFlood(id)`**: Fetches relational flood event with inundation depth contours and cadastral plot statuses.
- **`getOwnerPlots(floodId, ownerId)`**: Fetches all cadastral parcels owned by a specific landowner with boundary coordinates and depth classifications.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 20+)
- npm or pnpm

### Installation

```bash
# Clone the repository and enter the directory
git clone https://github.com/example/bhumidorpon.git
cd bhumidorpon

# Install dependencies
npm install

# Generate static relational mock datasets (deterministic)
npm run generate:mocks

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## Testing

```bash
# Run Vitest unit tests (formatters, conversion ratios, compensation logic)
npm test

# Run Playwright end-to-end tests
npx playwright test
```

### Land Unit Conversions Tested
- **1 Decimal** = `40.4686 m²` (`435.6 sq ft`)
- **1 Acre** = `100 Decimals` = `4,046.86 m²`
- **1 Hectare** = `247.10538 Decimals` = `10,000 m²`

---

## Accessibility & Design Standards

- **Full Keyboard Navigation**: All dropdowns, table rows, and the MapCompare slider can be operated via keyboard (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
- **Data Table Alternatives**: Every SVG chart and map comparison fold provides a collapsible, screen-reader accessible data table alternative and an ARIA live text summary.
- **Color Independence**: Color is never the sole carrier of meaning—loss items use minus (`−`) indicators and coral tones; gain items use plus (`+`) indicators and green tones; forecast items use dashed patterns (`∼`).
- **Demo Banner**: Sticky amber banner across every view: *"Demo data: all names, plots and figures are fictional."*
- **Forecast Honesty Disclaimer**: All forecast views conclude with: *"This is a model-based estimate, not an official government record."*
