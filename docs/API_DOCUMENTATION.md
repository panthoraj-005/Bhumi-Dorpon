# API Documentation — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Interface & Integration Specification  
> **Internal Backend API Status:** **IN-MEMORY TYPED ASYNCHRONOUS CLIENT ARCHITECTURE (v1.2 Release)**  
> **Client Interfaces:**  
> - Typed Data Access Layer ([`lib/data.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/data.ts))  
> - Authentication & Demo Access Service ([`lib/auth.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/auth.ts))  
> - Land Information Cascading Search & Report Service ([`lib/landSearch.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/landSearch.ts))  
> - Mountain & Historical Landslide Events Service ([`lib/landslideEvents.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/landslideEvents.ts))  
> - Bilingual Localization Engine ([`lib/translations.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/translations.ts))  
> **Export Interface:** Pure Client-Side KML 2.2 Serializer ([`lib/googleEarth.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/googleEarth.ts))  
> **External Network Integrations:** Public Raster Basemap XYZ Tile Services & Google Earth Web URL  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Testing & QA](TESTING_QA.md)

---

## Table of Contents

- [1. API Architecture Overview](#1-api-architecture-overview)
- [2. Verified In-Memory Client Data Interfaces (lib/data.ts)](#2-verified-in-memory-client-data-interfaces-libdatats)
  - [2.1 getDashboardSummary(mode)](#21-getdashboardsummarymode)
  - [2.2 getOptions(hazard, mode, step, selectionSoFar)](#22-getoptionshazard-mode-step-selectionsofar)
  - [2.3 listResults(hazard, mode, selection)](#23-listresultshazard-mode-selection)
  - [2.4 getResult(hazard, id)](#24-getresulthazard-id)
  - [2.5 listFloods(mouzaId)](#25-listfloodsmouzaid)
  - [2.6 getFlood(mouzaId, floodId)](#26-getfloodmouzaid-floodid)
  - [2.7 getFloodOwners(floodId, query)](#27-getfloodownersfloodid-query)
  - [2.8 getOwnerProfile(ownerId)](#28-getownerprofileownerid)
  - [2.9 getOwnerPlots(floodId, ownerId)](#29-getownerplotsfloodid-ownerid)
  - [2.10 getMapArea(hazard, areaId, mode)](#210-getmapareahazard-areaid-mode)
- [3. Authentication & Demo Access Service Interface (lib/auth.ts)](#3-authentication--demo-access-service-interface-libauthts)
  - [3.1 login(credentials)](#31-logincredentials)
  - [3.2 register(registrationData)](#32-registerregistrationdata)
  - [3.3 createDemoSession()](#33-createdemosession)
  - [3.4 getCurrentUser() and logout()](#34-getcurrentuser-and-logout)
  - [3.5 canPerformAdministrativeAction(user)](#35-canperformadministrativeactionuser)
- [4. Land Information Cascading Search Service Interface (lib/landSearch.ts)](#4-land-information-cascading-search-service-interface-liblandsearchts)
  - [4.1 getSearchDistricts()](#41-getsearchdistricts)
  - [4.2 getSearchUpazilas(districtId)](#42-getsearchupazilasdistrictid)
  - [4.3 getSearchMouzas(districtId, upazilaId)](#43-getsearchmouzasdistrictid-upazilaid)
  - [4.4 searchLandRecords(params)](#44-searchlandrecordsparams)
  - [4.5 Leading Zero Preservation Guarantee](#45-leading-zero-preservation-guarantee)
- [5. Mountain & Historical Landslide Events Interface (lib/landslideEvents.ts)](#5-mountain--historical-landslide-events-interface-liblandslideeventsts)
  - [5.1 getAvailableMountains()](#51-getavailablemountains)
  - [5.2 getMountainById(mountainId)](#52-getmountainbyidmountainid)
  - [5.3 getLandslideEventsForMountain(mountainId)](#53-getlandslideeventsformountainmountainid)
  - [5.4 getLandslideEventById(mountainId, eventId)](#54-getlandslideeventbyidmountainid-eventid)
- [6. Bilingual Localization Engine (lib/translations.ts)](#6-bilingual-localization-engine-libtranslationsts)
  - [6.1 t(key, lang)](#61-tkey-lang)
  - [6.2 formatNumberLocalized(num, lang)](#62-formatnumberlocalizednum-lang)
- [7. Client-Side Export & 3D Earth Interface (lib/googleEarth.ts)](#7-client-side-export--3d-earth-interface-libgoogleearthts)
  - [7.1 openParcelInGoogleEarth(plot)](#71-openparcelingoogleearthplot)
  - [7.2 buildParcelKml(plot)](#72-buildparcelkmlplot)
  - [7.3 buildEarthCameraUrl(corners)](#73-buildearthcameraurlcorners)
  - [7.4 buildKmlFileName(floodId, dagNo)](#74-buildkmlfilenamefloodid-dagno)
- [8. External Network Tile Integrations](#8-external-network-tile-integrations)
  - [8.1 Esri World Imagery (Satellite Tiles)](#81-esri-world-imagery-satellite-tiles)
  - [8.2 OpenStreetMap (Standard Street Tiles)](#82-openstreetmap-standard-street-tiles)
- [9. Proposed Future Server REST API Specification](#9-proposed-future-server-rest-api-specification)
  - [9.1 Authentication & Session Endpoints](#91-authentication--session-endpoints)
  - [9.2 Land Information & Parcel Search Endpoints](#92-land-information--parcel-search-endpoints)
  - [9.3 Multi-Hazard DL Risk Prediction Endpoints](#93-multi-hazard-dl-risk-prediction-endpoints)
  - [9.4 Landslide Mountains & Historical Events Endpoints](#94-landslide-mountains--historical-events-endpoints)
  - [9.5 Administrative, Hazard & Cadastral Endpoints](#95-administrative-hazard--cadastral-endpoints)
  - [9.6 Spatial GeoJSON & KML Endpoints](#96-spatial-geojson--kml-endpoints)
  - [9.7 Error Handling Standards (RFC 7807)](#97-error-handling-standards-rfc-7807)

---

## 1. API Architecture Overview

> [!IMPORTANT]
> **NO INTERNAL REST OR GRAPHQL SERVER ENDPOINTS EXIST IN THE CURRENT CODEBASE.**
> The application functions as a client-side architecture where UI components query typed asynchronous TypeScript services (`lib/data.ts`, `lib/auth.ts`, `lib/landSearch.ts`, `lib/landslideEvents.ts`) backed by curated mock registries (`mocks/`) and local browser storage.
> Outbound network requests are strictly confined to external XYZ raster map tiles (Esri, OSM) and client-directed Google Earth navigation.

---

## 2. Verified In-Memory Client Data Interfaces (`lib/data.ts`)

`lib/data.ts` exposes a typed asynchronous API mirroring production RESTful microservices.

### 2.1 `getDashboardSummary(mode)`
- **Parameters:** `mode: "recorded" | "forecast"`
- **Response Format:**
  ```typescript
  export interface DashboardSummary {
    mode: "recorded" | "forecast";
    totalLossDecimal: number;
    totalGainDecimal: number;
    totalNetChangeDecimal: number;
    affectedOwnersCount: number;
    compensation: {
      estimatedBDT: number;
      paidBDT?: number;      // STRICTLY OMITTED in forecast mode (Rule 5)
      approvedBDT?: number;  // STRICTLY OMITTED in forecast mode (Rule 5)
      pendingBDT?: number;   // STRICTLY OMITTED in forecast mode (Rule 5)
    };
    trends: { year: number; lossDecimal: number; gainDecimal: number }[];
    hazardBreakdown: { hazard: HazardType; lossDecimal: number; gainDecimal: number }[];
    topDistricts: { districtId: string; districtName: string; lossDecimal: number }[];
  }
  ```

### 2.2 `getOptions(hazard, mode, step, selectionSoFar)`
- **Parameters:**
  - `hazard: HazardType` (`"river_erosion"` | `"flood"` | `"landslide"` | `"char"` | `"coastal"`)
  - `mode: "recorded" | "forecast"`
  - `step: "district" | "upazila" | "river" | "hill" | "mouza"`
  - `selectionSoFar: Record<string, string>`
- **Response Format:** Array of `SelectorOption` (`{ id: string; label: string; hasRecords: boolean }`).

### 2.3 `listResults(hazard, mode, selection)`
- **Parameters:** `hazard: HazardType`, `mode: "recorded" | "forecast"`, `selection: Record<string, string>`
- **Response Format:** Array of typed hazard summaries (`HazardResultItem[]`).

### 2.4 `getResult(hazard, id)`
- **Parameters:** `hazard: HazardType`, `id: string` (e.g., `"res-khanshama-2024"`)

### 2.5 `listFloods(mouzaId)`
- **Parameters:** `mouzaId: string` (e.g., `"mouza-jaflong"`)
- **Response Format:** Array of `FloodEventSummary` items.

### 2.6 `getFlood(mouzaId, floodId)`
- **Parameters:** `mouzaId: string`, `floodId: string` (e.g., `"flood-jaflong-2024"`)

### 2.7 `getFloodOwners(floodId, query)`
- **Parameters:** `floodId: string`, `query?: string`
- **Response Format:** Array of `FloodOwnerListItem` records.

### 2.8 `getOwnerProfile(ownerId)`
- **Parameters:** `ownerId: string`
- **Response Format:** `OwnerProfile` object.

### 2.9 `getOwnerPlots(floodId, ownerId)`
- **Parameters:** `floodId: string`, `ownerId: string`
- **Response Format:** Array of `OwnerPlotDetail` objects with 4-corner GPS coordinates (`NW`, `NE`, `SE`, `SW`).

### 2.10 `getMapArea(hazard, areaId, mode)`
- **Parameters:** `hazard: HazardType`, `areaId: string`, `mode: "recorded" | "forecast"`
- **Response Format:** `MapAreaPackage` object loaded via `areas_index.json`.

---

## 3. Authentication & Demo Access Service Interface (`lib/auth.ts`)

Provides client-side session management, account registration, role validation, and isolated demonstration access.

### 3.1 `login(credentials)`
- **Signature:** `login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }>`
- **Input:**
  ```typescript
  export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
  }
  ```
- **Validation:** Minimum 1 character per field; matches case-insensitive username/email against seeded (`surveyor`, `citizen`, `admin`) and registered accounts.
- **Side Effect:** Persists `bhumidorpon_session` to storage on success.

### 3.2 `register(registrationData)`
- **Signature:** `register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }>`
- **Input:**
  ```typescript
  export interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: UserRole;
  }
  ```
- **Validation:** Name >= 2 chars, username >= 3 chars, valid email format, password >= 6 chars, `password === confirmPassword`, duplicate check on username and email.

### 3.3 `createDemoSession()`
- **Signature:** `createDemoSession(): User`
- **Output:** Returns an ephemeral `User` object:
  ```typescript
  {
    id: "usr_demo",
    name: "Demo Evaluator / ডেমো ব্যবহারকারী",
    username: "demo_guest",
    email: "demo@bhumidorpon.gov.bd",
    role: "citizen",
    isDemo: true
  }
  ```
- **Security:** Bypasses login requirement while strictly locking administrative capabilities.

### 3.4 `getCurrentUser()` and `logout()`
- **`getCurrentUser(): User | null`**: Returns the active session object or `null`.
- **`logout(): void`**: Clears `bhumidorpon_session` from storage and emits window state event.

### 3.5 `canPerformAdministrativeAction(user)`
- **Signature:** `canPerformAdministrativeAction(user: User | null): boolean`
- **Contract:** Returns `false` if `user === null` or `user.isDemo === true`. Returns `true` only for `surveyor_acland` or `sys_admin`.

---

## 4. Land Information Cascading Search Service Interface (`lib/landSearch.ts`)

Provides cascading administrative lookups, parcel searching across 5 fields, and report generation including Section 5 multi-hazard risk analysis.

### 4.1 `getSearchDistricts()`
- **Signature:** `getSearchDistricts(): { id: string; nameEn: string; nameBn: string }[]`
- **Output:** Returns list of districts present in cadastral registry (e.g., Sirajganj, Sylhet, Rangpur, Cox's Bazar, Bhola, Chittagong).

### 4.2 `getSearchUpazilas(districtId)`
- **Signature:** `getSearchUpazilas(districtId: string): { id: string; nameEn: string; nameBn: string; districtId: string }[]`
- **Filter:** Cascades based on selected parent district.

### 4.3 `getSearchMouzas(districtId, upazilaId)`
- **Signature:** `getSearchMouzas(districtId: string, upazilaId: string): { id: string; nameEn: string; nameBn: string; upazilaId: string; jlNo?: string }[]`
- **Filter:** Cascades based on selected parent upazila.

### 4.4 `searchLandRecords(params)`
- **Signature:** `searchLandRecords(params: LandSearchParams): Promise<LandSearchResult>`
- **Input:**
  ```typescript
  export interface LandSearchParams {
    districtId: string;
    upazilaId?: string;
    mouzaId?: string;
    dagNo?: string;     // Accepts alphanumeric or numeric strings (e.g., "0101", "2271")
    khatianNo?: string; // Accepts string identifiers (e.g., "RS-475", "0089")
  }
  ```
- **Output:** Returns complete `LandSearchResult`:
  - `success: boolean`
  - `record?: LandParcelRecord` (Categories A through F: Land ID, Ownership, Sale, Legal, Tax, Registration History)
  - `disasterHistory?: DisasterChangeHistory` (Historical land loss, deposition, physical status: Existing vs Completely Submerged)
  - `riskPredictions?: HazardRiskPrediction[]` (4 DL model forecasts: ConvLSTM, HydroSAR, InSAR SlopeNet, CoastWatch)
  - `messageEn?: string`, `messageBn?: string`

### 4.5 Leading Zero Preservation Guarantee
- Dag and Khatian numbers are typed and parsed strictly as string tokens (`dagNo.trim()`).
- Numerical string comparison does NOT cast to integer (`"0101"` !== `101`), preserving official cadastral designations verbatim.

---

## 5. Mountain & Historical Landslide Events Interface (`lib/landslideEvents.ts`)

Provides the data service for the two-step Mountain and Historical Event Selector on `/landslide` and `/landslide/[mode]`.

### 5.1 `getAvailableMountains()`
- **Signature:** `getAvailableMountains(): Mountain[]`
- **Output:** Returns list of recorded mountains with location, elevation, and historical event counts:
  - `mnt-batali`: Batali Hill (বাটালি হিল), Chittagong
  - `mnt-tiger-pass`: Tiger Pass Hill (টাইগার পাস), Chittagong
  - `mnt-motijhorna`: Moti Jhorna Hill (মতিঝর্ণা), Chittagong
  - `mnt-rangamati-sadar`: Rangamati Sadar Ridge (রাঙ্গামাটি সদর রিজ), Rangamati
  - `mnt-kaptai`: Kaptai Lakeside Slopes (কাপ্তাই হিল স্লোপ), Rangamati
  - `mnt-bandarban-nilachal`: Nilachal Ridge (নীলাচল রিজ), Bandarban

### 5.2 `getMountainById(mountainId)`
- **Signature:** `getMountainById(id: string): Mountain | undefined`

### 5.3 `getLandslideEventsForMountain(mountainId)`
- **Signature:** `getLandslideEventsForMountain(mountainId: string): LandslideEvent[]`
- **Filter:** Returns historical events linked to the specified mountain, sorted chronologically descending.

### 5.4 `getLandslideEventById(mountainId, eventId)`
- **Signature:** `getLandslideEventById(mountainId: string, eventId: string): LandslideEvent | undefined`
- **Attributes Returned:** Event ID, mountain ID, date, name (EN/BN), affected area (sq m & decimal), recorded impact, rainfall trigger (mm/24h), casualties, coordinate centroid, and verification status.

---

## 6. Bilingual Localization Engine (`lib/translations.ts`)

### 6.1 `t(key, lang)`
- **Signature:** `t(key: string, lang: Language): string`
- **Contract:** Resolves translation token for specified language (`"bn"` | `"en"`). Falls back to English if Bengali key is missing, or returns the key string if unknown.

### 6.2 `formatNumberLocalized(num, lang)`
- **Signature:** `formatNumberLocalized(num: number | string, lang: Language): string`
- **Contract:** Converts Arabic digits (`0-9`) to Bengali Eastern Nagari numerals (`০-৯`) when `lang === "bn"`. Preserves decimal points, commas, and negative signs.

---

## 7. Client-Side Export & 3D Earth Interface (`lib/googleEarth.ts`)

### 7.1 `openParcelInGoogleEarth(plot)`
- **Parameters:** `plot: OwnerPlotDetail`
- **Execution:** Opens Google Earth Web centered at parcel bounding box and initiates `.kml` file download.

### 7.2 `buildParcelKml(plot)`
- **Output:** Valid OGC KML 2.2 XML with 4-corner boundary polygon and placemarks.

### 7.3 `buildEarthCameraUrl(corners)`
- **Output:** Formatted Google Earth Web camera URL.

### 7.4 `buildKmlFileName(floodId, dagNo)`
- **Output:** `<floodId>_dag_<dagNo>_outline.kml`

---

## 8. External Network Tile Integrations

### 8.1 Esri World Imagery (Satellite Tiles)
- **Endpoint:** `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- **Protocol:** HTTPS GET (256x256 JPEG)

### 8.2 OpenStreetMap (Standard Street Tiles)
- **Endpoint:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Protocol:** HTTPS GET (256x256 PNG)

---

## 9. Proposed Future Server REST API Specification

When transitioning from client mock services to an enterprise FastAPI / PostGIS backend:

### 9.1 Authentication & Session Endpoints
- `POST /api/v1/auth/login`: Authenticates username/email and password; issues HTTP-only JWT.
- `POST /api/v1/auth/register`: Validates user registration data; creates pending citizen account.
- `POST /api/v1/auth/demo`: Issues short-lived, unprivileged demo bearer token (`isDemo: true`).
- `POST /api/v1/auth/logout`: Invalidates session refresh token.
- `GET /api/v1/auth/me`: Returns current authenticated user profile and permissions.

### 9.2 Land Information & Parcel Search Endpoints
- `GET /api/v1/land/districts`: Returns administrative districts with cadastral coverage.
- `GET /api/v1/land/districts/{id}/upazilas`: Returns upazilas in district.
- `GET /api/v1/land/upazilas/{id}/mouzas`: Returns mouzas with JL numbers.
- `GET /api/v1/land/search?district={d}&upazila={u}&mouza={m}&dag={dag}&khatian={k}`: Executes cadastral search preserving string formatting.
- `GET /api/v1/land/parcels/{id}`: Full parcel report including Ownership, Tax, and Legal sections.

### 9.3 Multi-Hazard DL Risk Prediction Endpoints
- `GET /api/v1/predictions/disaster-risk?parcel_id={id}`: Runs or retrieves cached deep-learning multi-hazard risk inference (ConvLSTM, HydroSAR, InSAR SlopeNet, CoastWatch).
- `GET /api/v1/predictions/models`: Returns metadata for active deep learning models (version, architecture, training observation window).

### 9.4 Landslide Mountains & Historical Events Endpoints
- `GET /api/v1/hazards/landslide/mountains`: Returns list of monitored mountains/hills.
- `GET /api/v1/hazards/landslide/mountains/{id}/events`: Returns historical landslide events for selected mountain.
- `GET /api/v1/hazards/landslide/events/{id}`: Detailed telemetry, rainfall records, and spatial footprint for a landslide event.

### 9.5 Administrative, Hazard & Cadastral Endpoints
- `GET /api/v1/hazards/{hazard}/summary?mode={recorded|predicted}`: National KPI aggregations.
- `GET /api/v1/floods?mouza_id={id}`: Archived flood events.
- `GET /api/v1/floods/{id}/owners?q={search}`: Paginated affected landowner list.
- `GET /api/v1/owners/{id}/plots?flood_id={id}`: Cadastral plot details with 4-corner GPS coordinates.

### 9.6 Spatial GeoJSON & KML Endpoints
- `GET /api/v1/geojson/plots/{id}`: RFC 7946 GeoJSON Feature for a cadastral parcel.
- `GET /api/v1/kml/plots/{id}`: Server-side KML 2.2 export endpoint.

### 9.7 Error Handling Standards (RFC 7807)
All production endpoints will return standard RFC 7807 Problem Details:

```json
{
  "type": "https://api.bhumidorpon.gov.bd/errors/not-found",
  "title": "Land Record Not Found",
  "status": 404,
  "detail": "No cadastral record found matching Dag No '0101' in Mouza 'mouza-kazipur'",
  "instance": "/api/v1/land/search?dag=0101"
}
```
