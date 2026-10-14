# UI/UX Design System — BhumiDorpon
**Minimalistic Light Mode Cadastral Cartography Specification**

---

> **Document Status:** Authoritative Design System Specification  
> **Aesthetic Archetype:** Minimalist High-Contrast Light Dashboard  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/MAIN-PROJECT-DOCUMENTATION.md) | [PRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/prd.md) | [TRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/trd.md) | [App Flow & User Flow](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/app-flow-user-flow.md)

---

## 1. Visual Design Principles

BhumiDorpon adheres to a strict **Minimalistic Light Mode** visual philosophy inspired by modern editorial cartography and Swiss data visualization principles:

1. **Quiet, High-Contrast Surfaces:** Pure white cards (`#FFFFFF`) set against an organic, very light sage-tinted page background (`#F6F7F2`), bound by delicate 1px borders (`#E4E7DC`) and virtually zero drop-shadows.
2. **Data-First Hierarchy:** Key Performance Indicators (KPIs) feature oversized tabular numbers ($32\text{px} - 36\text{px}$) with compact, muted category descriptors, prioritizing immediate cognitive absorption over decorative ornament.
3. **Singular Accent Signature (Lime):** High-energy electric lime (`#C8F23A`) is reserved exclusively for primary interactive calls-to-action, active navigation pills, and focused selections.
4. **Semantic Color Independence:** Colors are paired with non-color indicators (mathematical signs `+` / `−`, icons, and textual status badges) to ensure clarity for color-blind users:
   - **Loss / Erosion:** Coral (`#E4604A`) + Minus (`−`)
   - **Gain / Accretion:** Forest Green (`#2F9E62`) + Plus (`+`)
   - **Forecast / Modeled:** Soft Purple (`#6A5BD6`) + Tilde (`∼`) / Dashed pattern
   - **Water Layer:** Riverine Blue (`#2F7FB8`)
   - **Warning / Demo Notice:** Amber (`#D97706`)

---

## 2. Color Palette & Verified Design Tokens

Verified directly against [`app/globals.css`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/app/globals.css) and [`tailwind.config.ts`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/tailwind.config.ts):

### 2.1 Surfaces and Neutrals
| Token Name | CSS Custom Property | Hex Value | Usage / Description |
|---|---|---|---|
| `bg` | `--bg` | `#F6F7F2` | Global application page background (soft sage-tinted neutral). |
| `surface` | `--surface` | `#FFFFFF` | Primary white card and dialog container background. |
| `surface-alt`| `--surface-alt` | `#F0F2EA` | Secondary container fill, input backgrounds, and inactive pills. |
| `border` | `--border` | `#E4E7DC` | 1px delicate structural card and table border. |

### 2.2 Text and Typography Ink
| Token Name | CSS Custom Property | Hex Value | Usage / Description |
|---|---|---|---|
| `ink` | `--ink` | `#14170F` | Primary high-contrast text for headings, numbers, and active labels. |
| `ink-2` | `--ink-2` | `#4A5043` | Secondary text for descriptions, subheadings, and table body cells. |
| `muted` | `--muted` | `#7B8274` | Muted labels, table header titles, and empty-state hints. |

### 2.3 Brand Accent (Lime)
| Token Name | CSS Custom Property | Hex Value | Usage / Description |
|---|---|---|---|
| `accent` | `--accent` | `#C8F23A` | Vivid lime primary action fill (buttons, active pills). |
| `accent-ink`| `--accent-ink` | `#14170F` | High-contrast dark ink text rendered over lime backgrounds. |
| `accent-deep`| `--accent-deep` | `#4D7A0A` | Deep olive-lime for links and icons on white ($>4.5:1$ contrast). |
| `accent-soft`| `--accent-soft` | `#EEF8C8` | Subtle lime tint for active navigation backgrounds and hovers. |

### 2.4 Semantic Data Colors
| Token Name | CSS Custom Property | Hex Value | Usage / Description |
|---|---|---|---|
| `loss` | `--loss` | `#E4604A` | Coral red for riverbank erosion, plot loss, and scars. |
| `loss-soft` | `--loss-soft` | `#FBE5E0` | Soft coral background for loss badges. |
| `gain` | `--gain` | `#2F9E62` | Rich green for alluvial char accretion and coastal mudflat gain. |
| `gain-soft` | `--gain-soft` | `#DFF3E8` | Soft green background for gain badges. |
| `forecast` | `--forecast` | `#6A5BD6` | Purple for 1-year predictive forecasts and uncertainty bands. |
| `forecast-soft`| `--forecast-soft`| `#ECE9FB` | Soft purple background for forecast badges. |
| `water` | `--water` | `#2F7FB8` | Medium riverine blue for river channels and flood inundation zones. |
| `warn` | `--warn` | `#D97706` | Amber tone for demo banners, pending status, and disclaimers. |
| `warn-soft` | `--warn-soft` | `#FEF3C7` | Soft amber tint for banner backgrounds. |

---

## 3. Typography System

The typography scale utilizes **Inter** for user interface elements, tables, and tabular data, paired with **Space Grotesk** for prominent headings:

| Level / Role | Font Family | Size (px) | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| **Page Title** | Space Grotesk (`font-display`) | 28px (`text-2xl` / `text-3xl`) | 600 SemiBold | 1.2 | `-0.02em` |
| **Card Heading**| Space Grotesk (`font-display`) | 20px (`text-xl`) | 600 SemiBold | 1.3 | `-0.01em` |
| **KPI Stat Numbers** | Inter (`tabular-nums`) | 32px–36px (`text-3xl` / `text-4xl`) | 600 SemiBold | 1.1 | Normal |
| **Section Title** | Inter (`font-sans`) | 16px (`text-base`) | 600 SemiBold | 1.4 | Normal |
| **Body Text** | Inter (`font-sans`) | 14px (`text-sm`) | 400 Regular / 500 Medium | 1.5 | Normal |
| **Labels & Badges** | Inter (`font-sans`) | 12px (`text-xs`) | 500 Medium / 600 SemiBold | 1.4 | `+0.02em` |
| **Table Headers** | Inter (`font-sans`) | 11px–12px (`text-xs`) | 600 SemiBold | 1.4 | `+0.04em` Uppercase |

---

## 4. Spacing, Borders, and Radii

- **Spacing Scale:** Standard 4px base grid (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`).
- **Border Radii:**
  - Cards: `rounded-card` = `20px` (`--radius-card`)
  - Form Inputs & Dropdowns: `rounded-input` = `12px` (`--radius-input`)
  - Buttons & Badges: `rounded-pill` = `9999px`
- **Box Shadows:**
  - `shadow-subtle`: `0 1px 2px rgba(20, 23, 15, 0.04)`
  - `shadow-card`: `0 1px 3px rgba(20, 23, 15, 0.03)`
  - `shadow-popover`: `0 4px 16px rgba(20, 23, 15, 0.08)`

---

## 5. Application Layout and Grid System

```
┌────────┬──────────────────────────────────────────────────────────────┐
│        │ Sticky Top Header: Page Title | Mode Toggle | Unit Switcher   │
│ 72px   ├──────────────────────────────────────────────────────────────┤
│ Fixed  │ Sticky Amber Demo Banner: "Demo data: all names fictional"   │
│ Left   ├──────────────────────────────────────────────────────────────┤
│ Sidebar│ Main Content Container (Max width: 1440px):                   │
│        │  - Cascading Selector Bar                                    │
│        │  - Side-by-Side Map Grid (50% / 50% Desktop Split)           │
│        │  - Context Panels (Mouza Summary, Water Status)              │
│        │  - Tabular Owner & Plot Data Section                         │
└────────┴──────────────────────────────────────────────────────────────┘
```

- **Container Constraints:** Centered layout with maximum width of `1440px` (`max-w-7xl mx-auto`).
- **Dashboard Grid:** 12-column responsive layout:
  - Trend Chart Card: Span 8 columns.
  - Compensation Liability Card: Span 4 columns.
  - Hazard Breakdown: Span 4 columns.
  - Ranked District List: Span 8 columns.

---

## 6. Responsive Breakpoints

Configured according to standard Tailwind specifications:
- **Mobile (`< 768px`):** 1-column layout. Before and After maps stack vertically (Before first, After second). Tables enable horizontal scrolling.
- **Tablet (`768px - 1023px`):** 2-column metric cards. Map comparison switches to full width with stacked controls.
- **Desktop (`1024px - 1439px`):** Standard 50/50 side-by-side synchronized map comparison.
- **Wide Desktop (`>= 1440px`):** Centered max-width viewports with generous padding.

---

## 7. Button and Interactive Control Hierarchy

1. **Primary Button (`btn-lime`):**
   - Background: `var(--accent)` (`#C8F23A`)
   - Text: `var(--accent-ink)` (`#14170F`)
   - Radius: `rounded-pill` (`9999px`)
   - Hover: `#BBE825` with `-1px` vertical lift.
2. **Secondary Outline Button:**
   - Background: `var(--surface)` (`#FFFFFF`)
   - Border: `1px solid var(--border)`
   - Hover: Border shifts to `#14170F/30` with subtle shadow.
3. **Pill Selector (`SegmentedToggle.tsx`):**
   - Container: `rounded-pill bg-surface-alt p-1 border border-border`
   - Active Option: `rounded-pill bg-surface text-ink font-semibold shadow-subtle`
   - Inactive Option: `text-muted hover:text-ink`

---

## 8. Map UI Chrome and Controls

1. **Direct Zoom Controls (`+` / `−`):**
   - Placed in top-left or top-right map chrome.
   - White rounded buttons (`w-8 h-8 rounded-lg bg-surface border border-border`).
   - Directly triggers Leaflet `zoomIn()` / `zoomOut()` on the very first click.
2. **Basemap Selector Pill:**
   - Positioned in upper map header.
   - Allows instant switching between `Light GIS`, `Satellite`, and `Street`.
3. **Cartographic Accents:**
   - **Scale Bar:** Bottom-left metric scale bar with white semi-opaque backing.
   - **North Arrow:** Stylized SVG compass rose.
   - **Coordinate Readout:** Monospace floating badge showing live cursor latitude/longitude.

---

## 9. Cadastral Table Design System

- **Container:** `bhumidorpon-card overflow-hidden`
- **Header:** Sticky `bg-surface-alt border-b border-border text-xs font-semibold text-muted tracking-wider uppercase`
- **Row Styling:** `border-b border-border hover:bg-surface-alt/50 transition-colors`
- **Cell Content:**
  - Owner Name: Clickable text in `font-medium text-ink hover:text-accent-deep`.
  - Dag No. & Khatian No.: Monospace badge in `bg-surface-alt px-2 py-0.5 rounded border border-border`.
  - Compensation Status Badges:
    - `Paid`: Green pill (`bg-gain-soft text-gain border border-gain/20`)
    - `Approved`: Blue pill (`bg-water/10 text-water border border-water/20`)
    - `Pending`: Amber pill (`bg-warn-soft text-warn border border-warn/20`)

---

## 10. Empty, Loading, and State Patterns

1. **Skeleton Loading:** Pulse-animated rounded rectangles (`bg-border/60 animate-pulse rounded-card`) matching target card geometries.
2. **Empty State (`EmptyState.tsx`):**
   - Centered card with rounded icon container (`w-12 h-12 rounded-2xl bg-surface-alt text-muted`).
   - Clear explanatory heading (e.g., *"No Hazard Records Found"*).
   - Descriptive paragraph explaining that the selected mouza experienced no recorded events.
3. **Demo Geometry Disclaimer:** Floating amber badge pinned to bottom-left of Satellite map viewports:
   - Icon: `AlertTriangle`
   - Text: *"Demo geometry — not survey-accurate"*

---

## 11. Accessibility (WCAG 2.1 AA) Compliance

- **Contrast Ratios:**
  - Primary text (`#14170F`) on background (`#F6F7F2`): Contrast ratio $> 14:1$ (exceeds AAA).
  - Deep accent (`#4D7A0A`) on white (`#FFFFFF`): Contrast ratio $> 4.6:1$ (passes AA).
  - Text on lime (`#14170F` on `#C8F23A`): Contrast ratio $> 11:1$ (exceeds AAA).
- **Keyboard Traversal:** All dropdowns, table rows, and zoom buttons feature visible focus rings (`ring-2 ring-ink ring-offset-2`).
- **Screen Reader Tables:** All charts and maps provide hidden or collapsible `<table aria-label="...">` alternatives.

---

## 12. Existing UX Limitations & Future Improvements

1. **Language Restriction:** Currently English-only; adding full Bengali typography (using Google Font *Noto Sans Bengali*) is a top roadmap priority.
2. **Dense Data Tables on Mobile:** 8-column owner tables require horizontal scrolling on narrow smartphones; introducing a dedicated card-view toggle for mobile screens will enhance usability.
