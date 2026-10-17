# Database & Backend Schema Specification — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Database & Data Architecture Specification  
> **System Version:** 1.2 (Enhanced Demonstration Release)  
> **Current Storage Implementation:** Static Relational JSON Store (`public/mocks/` and `mocks/`) + LocalStorage Session Engine  
> **Target Production Database:** PostgreSQL 16 + PostGIS 3.4 Spatial Database  
> **Coordinate Systems:** Storage: EPSG:4326 (WGS 84) | Area Calculations: EPSG:32646 (UTM Zone 46N)  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [System Architecture](ARCHITECTURE.md) | [API Documentation](API_DOCUMENTATION.md) | [UI/UX Design System](UI_UX_DESIGN_SYSTEM.md) | [Testing & QA](TESTING_QA.md)

---

## Table of Contents

- [1. Data Architecture Strategy](#1-data-architecture-strategy)
  - [1.1 Current Implementation: Five-Hazard Information Store](#11-current-implementation-five-hazard-information-store)
  - [1.2 Target Implementation: PostgreSQL 16 + PostGIS 3.4](#12-target-implementation-postgresql-16--postgis-34)
- [2. v1.2 Enhanced Schema Definitions](#2-v12-enhanced-schema-definitions)
  - [2.1 User Accounts & Authentication Schema](#21-user-accounts--authentication-schema)
  - [2.2 Cadastral Plot & 4-Corner Geometry Schema](#22-cadastral-plot--4-corner-geometry-schema)
  - [2.3 Land Information Search & 6-Section Report Schemas](#23-land-information-search--6-section-report-schemas)
  - [2.4 Disaster History & Deep-Learning Risk Prediction Schema](#24-disaster-history--deep-learning-risk-prediction-schema)
  - [2.5 Landslide Mountains and Historical Events Catalog Schema](#25-landslide-mountains-and-historical-events-catalog-schema)
  - [2.6 Standardized Data Status Badges](#26-standardized-data-status-badges)
- [3. Core Administrative & Geographic Schemas](#3-core-administrative--geographic-schemas)
- [4. Proposed Production PostgreSQL / PostGIS DDL](#4-proposed-production-postgresql--postgis-ddl)
  - [4.1 Database Extensions and Custom Enums](#41-database-extensions-and-custom-enums)
  - [4.2 Users, Roles, and Sessions Tables](#42-users-roles-and-sessions-tables)
  - [4.3 Cadastral Parcels, Plots, and Corners Tables](#43-cadastral-parcels-plots-and-corners-tables)
  - [4.4 Ownership, Tax, Legal, and Sale Tables](#44-ownership-tax-legal-and-sale-tables)
  - [4.5 Mountains and Landslide Events Tables](#45-mountains-and-landslide-events-tables)
  - [4.6 Multi-Hazard Risk Predictions Table](#46-multi-hazard-risk-predictions-table)
- [5. Spatial Indexing and Query Performance](#5-spatial-indexing-and-query-performance)
- [6. Geospatial Area Calculations & Projection Transformations](#6-geospatial-area-calculations--projection-transformations)

---

## 1. Data Architecture Strategy

### 1.1 Current Implementation: Five-Hazard Information Store
In the v1.2 demonstration release, BhumiDorpon operates without a live SQL server or database daemon. All application state, geographical boundaries, hazard metrics, and cadastral plot records are persisted as structured, deterministic JSON files:
- **Client Runtime (`public/mocks/*.json`):** Static assets fetched asynchronously via `loadMockJson()` in `lib/data.ts`.
- **Node.js & Testing (`mocks/*.json`):** Synchronous source files read via `fs.readFileSync` in test environments.
- **Client Session Engine (`lib/auth.ts`):** Client-side session and user registration state persisted via `localStorage` under `bhumidorpon_auth_session` and `bhumidorpon_registered_users`.

### 1.2 Target Implementation: PostgreSQL 16 + PostGIS 3.4
For enterprise cloud deployment, the data layer transitions to a production PostgreSQL 16 instance equipped with PostGIS 3.4. The relational schema is engineered to handle millions of cadastral plots across Bangladesh, supporting complex spatial queries (`ST_Intersects`, `ST_Intersection`, `ST_Difference`) and sub-millisecond bounding-box filtering.

---

## 2. v1.2 Enhanced Schema Definitions

### 2.1 User Accounts & Authentication Schema

```typescript
// lib/auth.ts
export type UserRole = "citizen" | "surveyor" | "researcher" | "demo";

export interface AuthUser {
  id: string;               // e.g. "user_officer_01" or "demo_user_001"
  email: string;            // e.g. "surveyor@bhumidorpon.gov.bd"
  username: string;         // e.g. "surveyor"
  fullName: string;         // e.g. "মো: আরিফুল ইসলাম (সার্ভেয়ার)"
  role: UserRole;           // "citizen" | "surveyor" | "researcher" | "demo"
  isDemo: boolean;          // true for unprivileged demo access
  createdAt: string;        // ISO 8601 timestamp
  district?: string;        // Assigned operational district
}

export interface AuthSession {
  user: AuthUser;
  token: string;            // e.g. "auth_token_user_01_1729123456"
  expiresAt: string;        // ISO 8601 expiration timestamp
}
```

### 2.2 Cadastral Plot & 4-Corner Geometry Schema

```typescript
// mocks/plots.json & lib/types.ts
export interface Corner {
  label: "NW" | "NE" | "SE" | "SW";
  lat: number;              // 6 decimal places (e.g. 24.556572)
  lon: number;              // 6 decimal places (e.g. 89.627400)
}

export interface Plot {
  id: string;               // e.g. "plot_101"
  mouzaId: string;          // e.g. "mouza_kazipur_1"
  dagNo: string;            // Strict string preserving leading zeros (e.g. "0101")
  khatianNo: string;        // String identifier (e.g. "RS-475")
  landClass: string;        // "agri" | "homestead" | "pond" | "commercial"
  areaDecimal: number;      // Recorded land area in decimals
  ownerId: string;          // Foreign key to owners.json
  polygon: [number, number][][]; // GeoJSON polygon coordinates [lon, lat]
  corners: [Corner, Corner, Corner, Corner]; // Exact 4 corners
}
```

### 2.3 Land Information Search & 6-Section Report Schemas

```typescript
// lib/landSearch.ts
export interface LandIdentification {
  districtId: string;
  districtName: string;
  upazilaId: string;
  upazilaName: string;
  mouzaId: string;
  mouzaName: string;
  jlNo: string;
  dagNo: string;            // String (preserves leading zeros)
  khatianNo: string;        // String
  plotId: string;
  areaDecimal: number;
  landClass: string;
  physicalStatus: "existing" | "partially_affected" | "historically_lost" | "accreted";
  corners: [Corner, Corner, Corner, Corner];
  coordinates: [number, number]; // [centerLon, centerLat]
  polygon?: [number, number][][];
}

export interface LandOwnership {
  ownerName: string;
  fatherName: string;
  phone: string;
  nidMasked: string;        // e.g. "1985******3156"
  sharePercent: number;     // 100
  recordedDate: string;
  dataSource: string;
  verificationStatus: DataStatusBadge;
}

export interface LandSaleListing {
  isListedForSale: boolean;
  listingStatus: string;
  askingPriceBDT?: number;
  listingDate?: string;
  dataSource: string;
  statusBadge: DataStatusBadge;
}

export interface LandLegalInfo {
  hasPendingDispute: boolean;
  caseStatus: string;
  caseNumber?: string;
  courtName?: string;
  verificationStatus: DataStatusBadge;
  dataSource: string;
}

export interface LandTaxInfo {
  taxStatus: "up_to_date" | "outstanding" | "exempt" | "unknown";
  assessmentYear: string;
  outstandingAmountBDT: number;
  lastPaymentDate?: string;
  receiptNumber?: string;
  statusBadge: DataStatusBadge;
  dataSource: string;
}

export interface LandRegistrationHistory {
  registrationDeedNo: string;
  mutationKhatianNo: string;
  registrationOffice: string;
  registrationYear: number;
  lastLandUse: string;
  soilCondition: string;
  statusBadge: DataStatusBadge;
  dataSource: string;
}
```

### 2.4 Disaster History & Deep-Learning Risk Prediction Schema

```typescript
// lib/landSearch.ts
export interface DisasterHazardHistory {
  eventDate: string;
  disasterType: "river_erosion" | "flood" | "landslide" | "char" | "coastal";
  disasterNameBn: string;
  disasterNameEn: string;
  observationPeriod: string;
  affectedAreaDecimal: number;
  recordedPreviousAreaDecimal: number;
  estimatedLandLossDecimal: number;
  sedimentAccretionDecimal: number;
  physicalImpact: "permanent_loss" | "temporary_inundation" | "active_erosion" | "sediment_deposition";
  dataSource: string;
  observationDate: string;
  isHistoricallySubmerged: boolean;
  historicalCoordinates?: [number, number];
}

export interface FutureRiskPrediction {
  hazardType: "river_erosion" | "flood" | "landslide" | "coastal" | "char";
  hazardNameBn: string;
  hazardNameEn: string;
  probabilityPercent: number; // e.g. 68
  riskCategory: "Low" | "Moderate" | "High" | "Extreme";
  forecastPeriod: string;     // e.g. "2025 – 2027"
  modelName: string;          // e.g. "GeoAI-BD v2.4 (Multitemporal ConvLSTM)"
  confidencePercent: number;  // e.g. 88
  observationDate: string;
  isModelEstimate: boolean;   // true
  explanationBn: string;
  explanationEn: string;
}
```

### 2.5 Landslide Mountains and Historical Events Catalog Schema

```typescript
// mocks/hills.json & lib/landslideEvents.ts
export interface Hill {
  id: string;               // e.g. "ghagra", "furamon", "chimbuk"
  name: string;             // "Ghagra Hill Corridor"
  upazilaId: string;        // "kawkhali"
  slopeAngleDeg: number;    // 42
  soilType: string;         // "Colluvial sandy clay loam"
  riskLevel: string;        // "Extreme"
}

export interface LandslideEventRecord {
  id: string;               // e.g. "ev_ghagra_2024"
  hillId: string;           // Foreign key to Hill.id
  mode: "recorded" | "forecast";
  mountainNameBn: string;
  mountainNameEn: string;
  eventNameBn: string;
  eventNameEn: string;
  eventDate: string;        // e.g. "১৮-২০ জুন ২০২৪"
  year: number;             // 2024
  locationBn: string;
  locationEn: string;
  affectedSlopeAreaDecimal: number; // 117.6
  debrisVolumeM3: number;   // 43200
  slopeGradientDeg: number; // 42
  rainfallMm24h: number;    // 310
  casualtiesAvoidedFamilies: number; // 17
  homesteadsAtRisk: number; // 24
  impactSummaryBn: string;
  impactSummaryEn: string;
  isDemo: boolean;
  modelConfidenceScore?: number; // 90
}
```

### 2.6 Standardized Data Status Badges

```typescript
export type DataStatusBadge =
  | "verified"           // Verified official / surveyed fact
  | "demo"               // Synthetic academic/hackathon prototype data
  | "unverified"         // Unverified external record
  | "unavailable"        // No data found in registry
  | "external_required"; // Requires external live government database connection
```

---

## 3. Core Administrative & Geographic Schemas

- **Districts (`mocks/common.json`):** `id`, `name`, `division`, `isCoastal`, `isHilly`, `hasChars`.
- **Upazilas (`mocks/common.json`):** `id`, `districtId`, `name`, `rivers`, `hasChars`, `hasHills`.
- **Mouzas (`mocks/mouzas.json`):** `id`, `upazilaId`, `districtId`, `name`, `jlNo`, `totalPlots`, `boundary`.

---

## 4. Proposed Production PostgreSQL / PostGIS DDL

```sql
-- PostgreSQL 16 + PostGIS 3.4 Spatial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 4.1 Custom Enumerations
CREATE TYPE user_role AS ENUM ('citizen', 'surveyor', 'researcher', 'demo');
CREATE TYPE hazard_type AS ENUM ('river_erosion', 'flood', 'landslide', 'char', 'coastal');
CREATE TYPE data_mode AS ENUM ('recorded', 'forecast');
CREATE TYPE land_physical_status AS ENUM ('existing', 'partially_affected', 'historically_lost', 'accreted');
CREATE TYPE risk_category AS ENUM ('Low', 'Moderate', 'High', 'Extreme');

-- 4.2 Users and Roles Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'citizen',
    is_demo BOOLEAN DEFAULT FALSE,
    district_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.3 Cadastral Plots Table with PostGIS Polygon Geometry
CREATE TABLE cadastral_plots (
    id VARCHAR(50) PRIMARY KEY,
    mouza_id VARCHAR(50) NOT NULL,
    dag_no VARCHAR(20) NOT NULL,             -- String preserving leading zeros
    khatian_no VARCHAR(50) NOT NULL,
    land_class VARCHAR(50) NOT NULL,
    area_decimal NUMERIC(10, 2) NOT NULL,
    owner_id VARCHAR(50),
    physical_status land_physical_status DEFAULT 'existing',
    geom GEOMETRY(Polygon, 4326) NOT NULL,  -- WGS 84 spatial boundary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cadastral_plots_geom ON cadastral_plots USING GIST(geom);
CREATE INDEX idx_cadastral_plots_dag ON cadastral_plots(dag_no);
CREATE INDEX idx_cadastral_plots_khatian ON cadastral_plots(khatian_no);
CREATE INDEX idx_cadastral_plots_mouza ON cadastral_plots(mouza_id);

-- 4.4 Four Corners GPS Coordinate Table
CREATE TABLE cadastral_corners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id VARCHAR(50) REFERENCES cadastral_plots(id) ON DELETE CASCADE,
    corner_label VARCHAR(2) NOT NULL CHECK (corner_label IN ('NW', 'NE', 'SE', 'SW')),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    point_geom GEOMETRY(Point, 4326) NOT NULL,
    vertex_order INT NOT NULL CHECK (vertex_order BETWEEN 1 AND 4)
);

CREATE INDEX idx_cadastral_corners_point ON cadastral_corners USING GIST(point_geom);

-- 4.5 Mountains and Landslide Events Tables
CREATE TABLE mountains (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    upazila_id VARCHAR(50) NOT NULL,
    slope_angle_deg NUMERIC(4, 1) NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326)
);

CREATE TABLE landslide_events (
    id VARCHAR(50) PRIMARY KEY,
    hill_id VARCHAR(50) REFERENCES mountains(id) ON DELETE CASCADE,
    mode data_mode NOT NULL,
    event_name_bn VARCHAR(255) NOT NULL,
    event_name_en VARCHAR(255) NOT NULL,
    event_date VARCHAR(100) NOT NULL,
    event_year INT NOT NULL,
    affected_slope_area_decimal NUMERIC(10, 2) NOT NULL,
    debris_volume_m3 NUMERIC(12, 2) NOT NULL,
    slope_gradient_deg NUMERIC(4, 1) NOT NULL,
    rainfall_mm_24h NUMERIC(6, 1),
    homesteads_at_risk INT DEFAULT 0,
    impact_summary_bn TEXT,
    impact_summary_en TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    confidence_score INT
);

-- 4.6 Multi-Hazard Deep-Learning Risk Predictions Table
CREATE TABLE hazard_risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id VARCHAR(50) REFERENCES cadastral_plots(id) ON DELETE CASCADE,
    hazard hazard_type NOT NULL,
    probability_percent INT NOT NULL CHECK (probability_percent BETWEEN 0 AND 100),
    risk_category risk_category NOT NULL,
    forecast_period VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    confidence_percent INT NOT NULL,
    observation_date DATE NOT NULL,
    is_model_estimate BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Spatial Indexing and Query Performance

- **PostGIS GiST Indexes:** Applied to `cadastral_plots.geom`, `cadastral_corners.point_geom`, and `mountains.geom` ensuring $< 15\text{ms}$ spatial intersections.
- **B-Tree Indexes:** Applied to `dag_no`, `khatian_no`, `mouza_id`, and `hill_id` guaranteeing instantaneous text lookups without string truncation.

---

## 6. Geospatial Area Calculations & Projection Transformations

- **Storage:** EPSG:4326 (WGS 84 latitude/longitude degrees).
- **Metric Area Transformation:**
  $$\text{Area}_{\text{m}^2} = \text{ST\_Area}(\text{ST\_Transform}(\text{geom}, 32646))$$
- **Decimal Conversion:**
  $$\text{Area}_{\text{Decimal}} = \frac{\text{Area}_{\text{m}^2}}{40.468564224}$$
