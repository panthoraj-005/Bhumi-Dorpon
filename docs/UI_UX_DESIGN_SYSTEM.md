# UI/UX Design System — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Visual Design & Cartographic Chrome Specification  
> **Design Philosophy:** Minimalistic Light GIS | High-Contrast Readability | Governmental Credibility  
> **Theme:** Light Mode Only (Zero Neon/Dark Clutter)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Testing & QA](TESTING_QA.md)

---

## Table of Contents

- [1. Design Philosophy & Aesthetic Core](#1-design-philosophy--aesthetic-core)
- [2. Color Palette and Design Tokens](#2-color-palette-and-design-tokens)
  - [2.1 Base Neutrals & Surfaces](#21-base-neutrals--surfaces)
  - [2.2 Hazard Category Accents](#22-hazard-category-accents)
  - [2.3 Semantic Status & Alert Colors](#23-semantic-status--alert-colors)
- [3. Typography System](#3-typography-system)
  - [3.1 Font Families](#31-font-families)
  - [3.2 Type Scale and Hierarchy](#32-type-scale-and-hierarchy)
- [4. Layout Primitives, Spacing, and Elevation](#4-layout-primitives-spacing-and-elevation)
  - [4.1 Spacing Scale](#41-spacing-scale)
  - [4.2 Border Radii & Elevation](#42-border-radii--elevation)
- [5. Cartographic & Mapping Design System](#5-cartographic--mapping-design-system)
  - [5.1 Synchronized Dual-Map Container](#51-synchronized-dual-map-container)
  - [5.2 Leaflet Custom Panes & Z-Order](#52-leaflet-custom-panes--z-order)
  - [5.3 SVG Hatch Pattern Injection](#53-svg-hatch-pattern-injection)
  - [5.4 Professional Cartographic Chrome](#54-professional-cartographic-chrome)
  - [5.5 Direct-Click Zoom Controls](#55-direct-click-zoom-controls)
  - [5.6 Basemap Switcher & Imagery Disclaimer](#56-basemap-switcher--imagery-disclaimer)
- [6. Cadastral UI Components](#6-cadastral-ui-components)
  - [6.1 Four-Corner Coordinate Cards](#61-four-corner-coordinate-cards)
  - [6.2 "Open in Google Earth" Action Button](#62-open-in-google-earth-action-button)
  - [6.3 Landowner Compensation Table](#63-landowner-compensation-table)
- [7. Navigation Shell & Settings Hub](#7-navigation-shell--settings-hub)
  - [7.1 Left-Hand Icon Navigation Bar](#71-left-hand-icon-navigation-bar)
  - [7.2 Persistent Demo Banner](#72-persistent-demo-banner)
  - [7.3 Settings Hub & Verified Sub-Pages](#73-settings-hub--verified-sub-pages)
- [8. Accessibility & Responsiveness Guidelines](#8-accessibility--responsiveness-guidelines)

---

## 1. Design Philosophy & Aesthetic Core

BhumiDorpon adopts a **Minimalistic Light GIS** design aesthetic engineered specifically for high-stakes governmental land administration, academic research, and citizen transparency:
- **Calm & Uncluttered:** Uses crisp white surface cards (`#FFFFFF`) on a soft grayish-green canvas (`#EEF0E6`), subtle borders (`#E2E8F0`), and virtually zero heavy drop shadows.
- **High-Contrast Readability:** Prioritizes maximum legibility for cadastral numbers (Dag and Khatian IDs) and 6-decimal GPS boundary coordinates.
- **Color Independence:** Color is never the sole communicator of information. Every colored badge is paired with explicit text, arithmetic signs (`+` / `−`), or distinct SVG hatch patterns.
- **English-Only Interface:** All UI text, navigation, buttons, and map chrome are strictly rendered in English to maintain consistent international evaluation standards.

---

## 2. Color Palette and Design Tokens

### 2.1 Base Neutrals & Surfaces

| Token | Hex Value | CSS Variable | Usage |
|---|---|---|---|
| **Canvas Background** | `#EEF0E6` | `--background` | Global application background; default Leaflet map container fill. |
| **Card Surface** | `#FFFFFF` | `--card` | Elevated card surfaces, data tables, and modal dialogs. |
| **Surface Muted** | `#F8FAFC` | `--muted` | Table headers, secondary button backgrounds, input fills. |
| **Border Subtle** | `#E2E8F0` | `--border` | 1px card borders, table dividers, selector separators. |
| **Border Strong** | `#CBD5E1` | `--border-strong`| Map container perimeter, active input focus rings. |
| **Text Primary** | `#0F172A` | `--foreground` | Main page titles, metric numbers, table data cells. |
| **Text Secondary** | `#475569` | `--muted-foreground` | Subtitles, table headers, breadcrumbs, unit labels. |
| **Text Tertiary** | `#94A3B8` | `--foreground-tertiary` | Inactive placeholders, watermark text, graticule labels. |

### 2.2 Hazard Category Accents

| Hazard Category | Accent Color | Hex Value | Cartographic Fill / Stroke |
|---|---|---|---|
| **River Erosion** | Ocean Blue | `#0284C7` | Transect lines, eroded banklines, active channel polygons. |
| **Flood Monitoring** | Cobalt Blue | `#2563EB` | Shallow (`#93C5FD`), Moderate (`#3B82F6`), Deep (`#1D4ED8`) flood extents. |
| **Landslides** | Terracotta Amber | `#D97706` | Hill contours, scarp polygons (`#EF4444`), runout buffer (`#F59E0B`). |
| **Char Islands** | Emerald Green | `#059669` | Downstream accretion tips, stable vegetation cover. |
| **Coastal Changes**| Marine Teal | `#0D9488` | Marine retreat vectors, tidal mudflat accretion blocks. |

### 2.3 Semantic Status & Alert Colors

| Status / Domain | Accent Color | Hex Value | Usage |
|---|---|---|---|
| **Territorial Loss** | Crimson Red | `#EF4444` | Negative area changes (`−42.5 Decimals`), erosion hatching. |
| **Territorial Gain** | Forest Green | `#10B981` | Positive accretions (`+18.2 Decimals`), char accretion tips. |
| **AI / Forecast** | Royal Violet | `#8B5CF6` | 1-Year predictive hazard envelopes, model forecast badges. |
| **Demo Disclaimer** | Amber Gold | `#F59E0B` | Sticky top banner, synthetic data notices. |

---

## 3. Typography System

### 3.1 Font Families
- **Primary Body & UI Font:** `Inter`, system-ui, sans-serif — Clean, neutral grotesque typeface optimized for user interface controls and readability.
- **Technical & Coordinate Font:** `Space Grotesk`, `ui-monospace`, monospace — Fixed-width, tabular figures (`font-variant-numeric: tabular-nums`) ensuring that GPS latitude/longitude numbers align cleanly in data tables.

### 3.2 Type Scale and Hierarchy

| Hierarchy Level | Font Size | Line Height | Weight | Tailwind Class |
|---|---|---|---|---|
| **Display H1** | `24px (1.5rem)` | `32px` | Bold (`700`) | `text-2xl font-bold tracking-tight text-slate-900` |
| **Section H2** | `18px (1.125rem)`| `24px` | Semibold (`600`)| `text-lg font-semibold text-slate-800` |
| **Subheading H3**| `15px (0.9375rem)`| `20px`| Medium (`500`) | `text-sm font-medium text-slate-700` |
| **Body Regular** | `14px (0.875rem)` | `20px` | Regular (`400`)| `text-sm font-normal text-slate-700` |
| **Caption / Meta**| `12px (0.75rem)` | `16px` | Medium (`500`) | `text-xs font-medium text-slate-500` |
| **Coordinates** | `13px (0.8125rem)`| `18px`| Monospace (`500`)| `text-xs font-mono tabular-nums text-slate-800` |

---

## 4. Layout Primitives, Spacing, and Elevation

### 4.1 Spacing Scale
Layouts adhere to an 8-point harmonic grid:
- `p-2` (8px): Button padding, badge margins.
- `p-4` (16px): Compact metric cards, dropdown items.
- `p-6` (24px): Standard card container padding, section dividers.
- `gap-4` (16px) / `gap-6` (24px): Grid spacing between paired maps and metric tiles.

### 4.2 Border Radii & Elevation
- **Cards & Panels:** `rounded-xl` (12px) with `border border-slate-200 bg-white shadow-sm`.
- **Map Viewport Containers:** `rounded-2xl` (20px) with `border border-slate-300 overflow-hidden`.
- **Buttons & Action Pills:** `rounded-lg` (8px) with accessible hover and focus rings.
- **Status Badges:** `rounded-full` (9999px) with `px-2.5 py-0.5 text-xs font-medium`.

---

## 5. Cartographic & Mapping Design System

### 5.1 Synchronized Dual-Map Container
- **Desktop Layout ($\ge 1024\text{px}$):** Side-by-side grid split (50% / 50%). Left viewport displays Before baseline survey; Right viewport displays After observation or 1-Year Forecast.
- **Mobile Layout ($< 1024\text{px}$):** Vertically stacked layout (Before on top, After on bottom).
- **Default Height:** Fixed 480px–520px height (`min-h-[480px]`) guaranteeing consistent map aspect ratios across devices.

### 5.2 Leaflet Custom Panes & Z-Order
Map layers are assigned to custom Leaflet panes to prevent visual collision:
1. `waterPane` ($z = 250$): Riverbeds, water bodies (*beels*), marine basins.
2. `plotsPane` ($z = 300$): Cadastral plot boundary outlines.
3. `hazardPane` ($z = 350$): Flood depth layers, erosion strips, landslide scars.
4. `labelsPane` ($z = 450$): Transect distance tags, spot heights, graticule text.
5. `markersPane` ($z = 500$): Interactive pins, 4-corner boundary points.

### 5.3 SVG Hatch Pattern Injection
Injected dynamically into each Leaflet SVG renderer instance:
- `pattern-loss`: 45-degree diagonal red stripes (`stroke="#EF4444" strokeWidth="2"`) for permanent land loss.
- `pattern-khas`: 45-degree slate cross-hatch (`stroke="#64748B" strokeWidth="1.5"`) for unowned state alluvial land.
- `pattern-forecast`: 45-degree dashed purple stripes (`stroke="#8B5CF6" strokeDasharray="3,3"`) for 1-year predictive vulnerability.

### 5.4 Professional Cartographic Chrome
Every map container includes integrated, non-intrusive cartographic chrome:
- **Graticules:** Thin geographic coordinate lines (`stroke="#CBD5E1" strokeWidth="0.5"`) with edge labels (e.g., `25.12° N`, `91.87° E`).
- **Dynamic Scale Bar:** Native Leaflet metric scale bar (`L.control.scale({ imperial: false, metric: true })`) positioned in the bottom-left corner.
- **North Arrow Compass:** Crisp SVG north arrow positioned in the upper-right corner.
- **Locator Inset Mini-Map:** 100x100px overview map showing regional context within Bangladesh.
- **Mouza Loss/Gain Badges:** Prominent metric chips displayed on the map header summarizing net shifts.

### 5.5 Direct-Click Zoom Controls
- Prominent `+` and `−` zoom buttons mounted on the upper-left map chrome.
- **First-Click Execution:** Directly calls `map.zoomIn()` / `map.zoomOut()` without requiring tool selection or secondary click activations.

### 5.6 Basemap Switcher & Imagery Disclaimer
- **Toggle Switch:** Top-right pill switcher allowing instant toggle between `Light GIS` and `Satellite`.
- **Persistent Disclaimer:** Whenever `Satellite` (Esri World Imagery) is active, a persistent notice banner appears:
  ```text
  Demo geometry — not survey-accurate
  ```

---

## 6. Cadastral UI Components

### 6.1 Four-Corner Coordinate Cards
On the Flood Owner Land Detail page, cadastral plots render a 4-card grid:

```text
┌─────────────────────────┐  ┌─────────────────────────┐
│ Corner 1 (NW)           │  │ Corner 2 (NE)           │
│ 25.123456, 91.876543    │  │ 25.123489, 91.877012    │
└─────────────────────────┘  └─────────────────────────┘
┌─────────────────────────┐  ┌─────────────────────────┐
│ Corner 4 (SW)           │  │ Corner 3 (SE)           │
│ 25.122954, 91.876578    │  │ 25.122987, 91.877045    │
└─────────────────────────┘  └─────────────────────────┘
```

- Each card displays coordinate values in fixed-width font (`font-mono`).
- Includes a dedicated "Copy 4 Corners" button that copies formatted coordinates with instant tooltip feedback ("Copied to clipboard!").

### 6.2 "Open in Google Earth" Action Button
Positioned directly beneath the Four Corner Coordinates table:
- **Styling:** Full-width emerald button (`bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg py-2.5 px-4 shadow-sm transition-colors`).
- **Icon:** Lucide React `Globe` icon on the left.
- **Label:** `Open in Google Earth`.
- **Guidance Toast:** Triggered upon click, an amber/emerald toast appears for ~12 seconds:
  ```text
  In Google Earth choose New → Open local KML file and select the downloaded file to display the parcel outline (Earth Pro: double-click the file)
  ```

### 6.3 Landowner Compensation Table
- Compact table displaying Dag No., Khatian No., Landowner Name, Total Area, Submersion Status, and Estimated Compensation.
- Fully filterable via instant client-side search input (searches by Name or Dag No.).
- Includes single-click "Export CSV" button.

---

## 7. Navigation Shell & Settings Hub

### 7.1 Left-Hand Icon Navigation Bar
- Fixed 72px left-hand sidebar (`w-[72px] bg-slate-900 border-r border-slate-800`).
- Navigation icons:
  - Dashboard (`Home`)
  - River Erosion (`Waves`)
  - Flood Monitoring (`CloudRain`)
  - Landslides (`Mountain`)
  - Char Islands (`Compass`)
  - Coastal Changes (`Anchor`)
  - Settings (`Settings`)
- Active item indicator: Emerald pill indicator on the left edge with bright icon highlight.

### 7.2 Persistent Demo Banner
Mounted at the very top of the application viewport:
- **Styling:** Amber banner (`bg-amber-500 text-slate-950 font-medium py-1 px-4 text-xs text-center flex items-center justify-center gap-2`).
- **Text:** *"Demo data: all names, plots and figures are fictional."*

### 7.3 Settings Hub & Verified Sub-Pages
The Settings route (`/settings`) presents two verified navigation cards:
1. **About Project (`/settings/about`):** Detailed cards explaining system architecture, offline Leaflet cartography, five hazard modules, and mock data transparency.
2. **Team Information (`/settings/team`):** Official team attribution cards displaying:
   - Team Name: `GeoNeural`
   - Team Leader: `Pantho Raj Biswas`
   - Team Member: `Puja Paul`
   - Copyright Notice: `© 2026 GeoNeural. All rights reserved.`

---

## 8. Accessibility & Responsiveness Guidelines

1. **Color Contrast:** All text meets WCAG 2.1 Level AA minimum contrast ratio of **4.5:1** against backgrounds (large headings meet **3:1**).
2. **Focus Visibility:** Interactive elements feature explicit keyboard focus outlines (`focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`).
3. **Screen Readers:** Complex map visuals provide hidden collapsible data table alternatives and `aria-live="polite"` status announcements.
4. **Touch Targets:** All mobile interactive targets maintain minimum touch dimensions of **44x44px**.
