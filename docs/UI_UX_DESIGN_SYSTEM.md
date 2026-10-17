# UI/UX Design System Specification — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Design System Specification  
> **System Version:** 1.2 (Enhanced Demonstration Release)  
> **Core Theme:** Modern Delta Cartographic (Light GIS & High-Resolution Satellite)  
> **Primary Accent:** Cyber Lime (`#D4F239`) with Deep Ink (`#1A1A1A`)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [App Flow & User Flow](APP_FLOW.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md)

---

## Table of Contents

- [1. Visual Identity & Design Philosophy](#1-visual-identity--design-philosophy)
- [2. Color Palette & Semantic Token Architecture](#2-color-palette--semantic-token-architecture)
  - [2.1 Core Neutral Palette](#21-core-neutral-palette)
  - [2.2 Brand & Interaction Accents](#22-brand--interaction-accents)
  - [2.3 Multi-Hazard Domain Palette](#23-multi-hazard-domain-palette)
  - [2.4 Data Status Badge Tokens](#24-data-status-badge-tokens)
- [3. Typography Hierarchy & Bilingual Font Stacks](#3-typography-hierarchy--bilingual-font-stacks)
- [4. Layout Shell, Header, and Sidebar System](#4-layout-shell-header-and-sidebar-system)
  - [4.1 Global Header (AppHeader.tsx)](#41-global-header-appheadertsx)
  - [4.2 Fixed 72px Sidebar (AppSidebar.tsx)](#42-fixed-72px-sidebar-appsidebartsx)
  - [4.3 Persistent Demo Banner (DemoBanner.tsx)](#43-persistent-demo-banner-demobannertsx)
- [5. Authentication & Demo Access Entry Modal (AuthModal.tsx)](#5-authentication--demo-access-entry-modal-authmodaltsx)
- [6. Global "Land Information" Search UI Design](#6-global-land-information-search-ui-design)
  - [6.1 5-Level Cascading Search Form](#61-5-level-cascading-search-form)
  - [6.2 6-Section Structured Cadastral Report Cards](#62-6-section-structured-cadastral-report-cards)
  - [6.3 Disaster Change & Deep-Learning Risk Section Design](#63-disaster-change--deep-learning-risk-section-design)
- [7. Landslide Mountain & Historical Event Selector (SelectorChain.tsx)](#7-landslide-mountain--historical-event-selector-selectorchaintsx)
- [8. Top-Level "Explore Disasters" Scroll Button](#8-top-level-explore-disasters-scroll-button)
- [9. Data Transparency & Rule 5 Visual Suppression](#9-data-transparency--rule-5-visual-suppression)
- [10. Responsive Breakpoints & Mobile Adaptation](#10-responsive-breakpoints--mobile-adaptation)

---

## 1. Visual Identity & Design Philosophy

BhumiDorpon pairs **modern, minimalist administrative software** with **high-precision geospatial cartography**. It departs from cluttered legacy GIS portals by using:
1. **Calm, High-Contrast Canvases:** Off-white background (`#F7F8F0`) with warm paper-white surfaces (`#FFFFFF`).
2. **Vibrant Signal Accents:** Electric Lime (`#D4F239`) draws immediate visual focus to primary actions without visual fatigue.
3. **Rigorous Visual Consistency:** All new features (Authentication, Language Switch, Land Search, Landslide Event Selector, and Disaster Scroll) maintain identical border radiuses, shadows, pill buttons, and font weightings.
4. **Zero Layout Distortion on Language Toggle:** Toggling between Bangla and English preserves spacing, card heights, and grid ratios.

---

## 2. Color Palette & Semantic Token Architecture

### 2.1 Core Neutral Palette
- **Canvas Background (`--bg`):** `#F7F8F0` (Soft Delta sand off-white).
- **Surface Card (`--surface`):** `#FFFFFF` (Pure crisp white).
- **Surface Alt / Muted (`--surface-alt`):** `#F0F2E6` (Warm neutral backing for table rows and input backgrounds).
- **Ink / Primary Text (`--ink`):** `#1A1A1A` (Deep charcoal obsidian).
- **Secondary Text (`--secondary`):** `#4A4A4A` (Medium neutral for body text).
- **Muted Text (`--muted`):** `#7A7A7A` (Desaturated slate for captions and helper labels).
- **Border / Divider (`--border`):** `#E2E4D8` (Subtle 1px boundary line).

### 2.2 Brand & Interaction Accents
- **Cyber Lime Accent (`--accent`):** `#D4F239` (Primary action button fill).
- **Accent Soft (`--accent-soft`):** `#F4FBD0` (Active navigation and pill background).
- **Accent Deep (`--accent-deep`):** `#4D5C00` (High-contrast text and active state icon color).
- **Accent Ink (`--accent-ink`):** `#1A1A1A` (Dark text label on lime buttons).

### 2.3 Multi-Hazard Domain Palette
- **River Erosion (Loss):** `#EF4444` (Coral red).
- **Accretion / Alluvion (Gain):** `#10B981` (Emerald green).
- **Flood Water / Inundation:** `#0284C7` (Sky blue).
- **Landslides / Warning:** `#D97706` (Amber gold).
- **Char Islands (Vegetation):** `#8B5CF6` (Violet).
- **Deep-Learning Forecast Projections:** `#8B5CF6` (Royal purple dashed contours and forecast badge).

### 2.4 Data Status Badge Tokens
- **Verified (`verified`):** Background `#ECFDF5`, Text `#059669`, Icon `CheckCircle`.
- **Demo Data (`demo`):** Background `#F4FBD0`, Text `#4D5C00`, Icon `Sparkles`.
- **Unverified (`unverified`):** Background `#FEF3C7`, Text `#D97706`, Icon `AlertTriangle`.
- **Unavailable (`unavailable`):** Background `#F3F4F6`, Text `#6B7280`, Icon `HelpCircle`.
- **External Connection Required (`external_required`):** Background `#F0F2E6`, Text `#4A4A4A`, Icon `ExternalLink`.

---

## 3. Typography Hierarchy & Bilingual Font Stacks

### Font Family Declarations
```css
font-family: var(--font-space-grotesk), var(--font-inter), 'Noto Sans Bengali', 'SolaimanLipi', sans-serif;
```
- **Display Headings:** Space Grotesk (`--font-space-grotesk`), weights 600 (Semibold) and 700 (Bold).
- **Interface & Readouts:** Inter (`--font-inter`), weights 400 (Regular), 500 (Medium), and 600 (Semibold).
- **Bengali Fallback:** High-legibility Bengali fonts ensuring zero text truncation when toggled to Bangla (`'bn'`).

### Typographic Scales
- **Display Hero:** `text-3xl sm:text-4xl` ($30\text{px} - 36\text{px}$, font-bold, tracking-tight).
- **Page Titles:** `text-2xl sm:text-3xl` ($24\text{px} - 30\text{px}$, font-semibold).
- **Card Headings:** `text-base sm:text-lg` ($16\text{px} - 18\text{px}$, font-semibold).
- **Section Titles:** `text-sm sm:text-base` ($14\text{px} - 16\text{px}$, font-bold).
- **Body Text:** `text-xs sm:text-sm` ($12\text{px} - 14\text{px}$, leading-relaxed).
- **Micro Labels & Captions:** `text-[10px] sm:text-[11px]` ($10\text{px} - 11\text{px}$, tabular-nums).
- **Bangla Heading Line-Height:** Bangla page titles use a taller line-height (e.g., `leading-[1.35]`) so Bengali glyphs and the subtitle never overlap when a title wraps to two lines.

---

## 4. Layout Shell, Header, and Sidebar System

### 4.1 Global Header (`AppHeader.tsx`)
- **Title Block:** Page title and localized subtitle.
- **Action Controls Toolbar:**
  1. **Land Information Search Button:** Pill button with `Search` icon and text `Land Information / ভূমির তথ্য`.
  2. **Global Language Switcher:** Segmented control toggling `বাংলা` (default) and `English`.
  3. **Explore Disasters Scroll Button:** Pill button with `Waves` icon linking to `#disaster-options`.
  4. **Currency Indicator:** Badge `৳ (BDT)`.
  5. **Period Dropdown:** 1y, 3y, 5y, All time with localized labels.
  6. **Unit Segmented Control:** Decimal, Acre, Hectare.
  7. **User Profile Badge:** Displays "ডেমো ব্যবহারকারী" or authenticated user name with Sign Out popover.
- **Toolbar Wrapping Rule:** On `md` and wider the toolbar is right-aligned. When controls overflow, the second row (e.g., `৳ (BDT)` badge and period dropdown) stays right-aligned directly under the বাংলা | English toggle with the same gap as the first row. Mobile keeps the left-aligned wrapping.

### 4.2 Fixed 72px Sidebar (`AppSidebar.tsx`)
- Fixed left positioning with $72\text{px}$ width.
- BD brand icon leading to `/`.
- Icon navigation items for Dashboard, Land Information, River Erosion, Flood, Landslides, Char, and Coastal.
- Tooltip popover on hover with localized labels.

### 4.3 Persistent Demo Banner (`DemoBanner.tsx`)
- Top banner with amber accent disclosing: *"ডেমো ডাটাবেজ: প্রদর্শিত সব মালিকানার নাম, দাগ, খতিয়ান ও ক্ষতিপূরণের তথ্য একাডেমিক ও হ্যাকাথন মূল্যায়নের জন্য কৃত্রিমভাবে তৈরি।"*

---

## 5. Authentication & Demo Access Entry Modal (`AuthModal.tsx`)

- **Container:** Centered modal with glassmorphic backdrop (`bg-ink/70 backdrop-blur-sm`).
- **Brand Ribbon:** Displays BD icon, app title, version pill, and tagline.
- **Prominent Demo Access Banner:** Cyber lime banner with button **"Demo / ডেমো হিসেবে প্রবেশ করুন"** enabling 1-click exploration.
- **Tabs:** Pill segmented control for `লগইন (Login)` and `নিবন্ধন (Sign Up)`.
- **Inputs:** Clean rounded-xl inputs with icons (Mail, Lock, User) and password visibility toggles (`Eye` / `EyeOff`).
- **Alerts:** Distinct loss-red error banners and gain-green success notifications.

---

## 6. Global "Land Information" Search UI Design

### 6.1 5-Level Cascading Search Form
- Layout: 5 responsive columns for District, Upazila, Mouza, Dag No., and Khatian No.
- Form controls: Dropdown arrows, focus ring with lime highlight (`focus:ring-accent`), and text fields preserving leading zeros.
- Action row: Reset button and lime Search Land button (`Search Land / অনুসন্ধান করুন`).

### 6.2 6-Section Structured Cadastral Report Cards
Structured 3-column responsive grid featuring:
- **Card 1: জমির পরিচয় ও পরিমাপ (Land Identification):** Area, 4-corner GPS coordinates, physical status badge.
- **Card 2: মালিকানা সংক্রান্ত তথ্য (Ownership):** Owner name, father's name, masked NID (`1985******3156`), 100% share.
- **Card 3: বিক্রি ও হস্তান্তর সংক্রান্ত তথ্য (Sale & Listing):** Listing status and data source.
- **Card 4: আইনি তথ্য ও বিরোধ (Legal Disputes):** Case status and injunctions.
- **Card 5: ভূমি উন্নয়ন কর (Tax & Khajna):** Payment status, assessment year, receipt number.
- **Card 6: নিবন্ধন ও জমির ব্যবহার ইতিহাস (Registration History):** Deed number, sub-registry office, soil condition.

### 6.3 Disaster Change & Deep-Learning Risk Section Design
- Full-width card with purple forecast border (`border-predicted/30`).
- **5.1 Historical Land Loss:** 2-column cards detailing past disaster events, observation periods, and affected areas.
- **5.2 Future Deep Learning Risk:** 4-column probability cards with animated progress bars (Loss red for high risk, amber for moderate, emerald for low).
- **5.3 Submerged Parcel Notice:** Coral-tinted alert box preserving cadastral identity for permanently lost plots.

---

## 7. Landslide Mountain & Historical Event Selector (`SelectorChain.tsx`)

- Four-step cascading chain in the standard combobox style (`h-11`, rounded input, bordered, searchable popover): **① District → ② Upazila → ③ Hill → ④ Landslide Event**. The breadcrumb reads "এলাকা নির্বাচন (জেলা > উপজেলা > পাহাড় > ঘটনা)".
- **Event box (④):** label *ভূমিধসের ঘটনা* / *Landslide Event*, placeholder *ঘটনা নির্বাচন করুন* / *Select Event*. Each option shows the event name (semibold) with the date as a muted sublabel on a second line, newest first. The newest event is pre-selected.
- Disabled until a hill is chosen. If the hill has no events it stays disabled with the muted honest text *"এই পাহাড়ে কোনো ভূমিধসের ঘটনা রেকর্ড নেই"*.
- Layout: four equal-width boxes in one row where space allows; two per row on tablet; one per row on mobile.
- Event Details Card: Displays date, location, affected slope area, displaced debris volume ($m^3$), 24h rainfall (mm), and downslope homesteads count for the selected event.
- The former separate two-dropdown card is removed from the detail page to avoid duplicate District/Hill controls.

---

## 8. Top-Level "Explore Disasters" Scroll Button

- Pill button in `AppHeader` featuring `Waves` icon, chevron down indicator, and subtle hover transition.
- Smoothly scrolls to `<div id="disaster-options" className="space-y-4 pt-6 scroll-mt-24">`.

---

## 9. Data Transparency & Rule 5 Visual Suppression

- **Rule 5 Compliance:** When `dataMode === 'forecast'`, all paid, approved, and pending financial progress bars and figures are hidden. Only projected compensation budget is shown.
- **Visual Disclaimers:** All forecast screens render the purple ForecastBadge and disclaimer: *"This is a model-based estimate, not an official government record."*

---

## 10. Responsive Breakpoints & Mobile Adaptation

- **Desktop ($> 1280\text{px}$):** 12-column layout, side-by-side synchronized maps, 5-column search form.
- **Tablet ($768\text{px} - 1279\text{px}$):** 2-column report cards, stacked dual maps, 2-column search form.
- **Mobile ($< 768\text{px}$):** 1-column stacked cards, vertically stacked maps, touch-optimized button targets ($\ge 44\text{px}$).
- **Header Toolbar:** right-aligned with a right-aligned overflow row on tablet and desktop; left-aligned wrapping on mobile.
- **Bangla Tables:** Same layout and column widths as English; longer Bangla labels must not clip or cause horizontal overflow; digits are Bengali; no Latin words except allowed acronyms.

---

## Addendum v1.3 — Seven Primary Land Information Cards

Keep the existing visual system, responsive behavior, colors, typography and status badges. Update the report area to display these seven primary cards in this exact order:
1. **জমির পরিচয় ও পরিমাণ** — area, location, land class, coordinates and physical status.
2. **মালিকানা সংক্রান্ত তথ্য** — owner and available ownership details.
3. **বিক্রি ও হস্তান্তর সংক্রান্ত তথ্য** — sale/listing and available transfer details.
4. **আইনি তথ্য** — disputes, cases and injunction information.
5. **ভূমি উন্নয়ন কর** — assessment, payment and receipt details.
6. **নিবন্ধন ও ভূমির ইতিহাস** — deed, mutation, registration office/year and land-use history.
7. **এই জমি বন্ধক রেখে ব্যাংক ঋণ নেওয়ার তথ্য** — recorded mortgage/loan charge, bank name, masked reference, record/status/release dates, source and verification badge where available.

Use a bank/building or shield icon consistent with the existing icon set for card 7. On desktop, retain the existing 3-column responsive card grid; let the seventh card wrap naturally. On narrow screens, stack cards without horizontal overflow. Keep all labels and table values bilingual through the central translation dictionary. Provide clear empty/unavailable states and do not display a green “no loan” result unless the underlying data actually verifies it.

After these seven cards, show the existing disaster-change history, deep-learning risk predictions, submerged-parcel notice and other supplementary information in their current style.

