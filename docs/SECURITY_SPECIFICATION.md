# Security Specification — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Security & Privacy Posture Specification  
> **Security Audit Status:** **INTERNAL SOURCE REVIEW (Zero High-Risk Vulnerabilities Detected)**  
> **Architecture Model:** Client-Side Demonstration Prototype (Zero Backend Attack Surface)  
> **Target Production Model:** Government-Grade Defense-in-Depth & PII Protection  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [System Architecture](ARCHITECTURE.md) | [Auth Specification](AUTH_SPECIFICATION.md) | [Testing & QA](TESTING_QA.md)

---

## Table of Contents

- [1. Security Scope & Threat Landscape](#1-security-scope--threat-landscape)
- [2. Information Asset Classification](#2-information-asset-classification)
- [3. Trust Boundaries & Attack Surface Analysis](#3-trust-boundaries--attack-surface-analysis)
- [4. Client-Side Privacy & Google Earth Data Boundaries](#4-client-side-privacy--google-earth-data-boundaries)
- [5. Current Prototype Vulnerability Posture](#5-current-prototype-vulnerability-posture)
  - [5.1 Absence of Server-Side Attack Vectors](#51-absence-of-server-side-attack-vectors)
  - [5.2 Client-Side Cross-Site Scripting (XSS) Mitigation](#52-client-side-cross-site-scripting-xss-mitigation)
  - [5.3 Dependency Security Audit](#53-dependency-security-audit)
- [6. Proposed Production Security Architecture](#6-proposed-production-architecture)
  - [6.1 Secrets & Environment Variable Management](#61-secrets--environment-variable-management)
  - [6.2 SQL & Spatial Injection Defenses](#62-sql--spatial-injection-defenses)
  - [6.3 Content Security Policy (CSP) & HTTP Headers](#63-content-security-policy-csp--http-headers)
  - [6.4 API Rate Limiting & Denial-of-Service (DoS) Defense](#64-api-rate-limiting--denial-of-service-dos-defense)
  - [6.5 Personally Identifiable Information (PII) Safeguards](#65-personally-identifiable-information-pii-safeguards)
- [7. Compliance & Data Governance Standards](#7-compliance--data-governance-standards)

---

## 1. Security Scope & Threat Landscape

This specification documents the current security, data privacy, and vulnerability posture of **BhumiDorpon**. Because the v1.1 demonstration release operates as a client-side web application without a backend server, database daemon, or authenticated user accounts, its attack surface is fundamentally different from a multi-tenant cloud SaaS platform.

The primary security objectives are:
1. **Zero Client Data Exfiltration:** Guarantee that user interactions, parcel coordinates, and exported files remain strictly on the client device.
2. **Data Transparency & Integrity:** Ensure that mock datasets cannot be maliciously altered in memory to display fraudulent compensation liabilities.
3. **Preparedness for Government Production:** Define comprehensive defense-in-depth specifications for future deployment within national land administration infrastructure.

---

## 2. Information Asset Classification

| Asset Category | Classification in Prototype | Production Sensitivity | Description & Risk Context |
|---|---|---|---|
| **Cadastral Plot Geometries** | **Public / Non-Sensitive** | **Restricted / Public Cadastre** | Synthetic 4-corner polygons (`plots.json`). In production, official mouza sheets are public administrative records. |
| **Landowner Identities** | **Public / Non-Sensitive** | **Confidential / PII** | Fictional names (*Abdul Karim*, *Rahima Begum*). In production, real citizen names and NIDs require strict masking. |
| **Compensation Sums** | **Public / Non-Sensitive** | **Restricted Financial Data** | Illustrative calculations based on standard formulas. In production, official disbursement records require tamper-proof audit trails. |
| **Application Source Code** | **Public Open Source** | **Protected Intellectual Property** | TypeScript, React, and Leaflet source code. Zero committed secrets or API tokens. |
| **User Session Data** | **None** | **Confidential** | The application collects zero user credentials, passwords, session cookies, or IP tracking telemetry. |

---

## 3. Trust Boundaries & Attack Surface Analysis

```mermaid
graph TD
    subgraph UntrustedZone ["Untrusted Zone (Public Internet)"]
        UserBrowser["User Browser & Operating System"]
    end

    subgraph ClientSandbox ["Client Trust Boundary (Browser Sandbox)"]
        NextApp["BhumiDorpon React Application"]
        LeafletEngine["Leaflet SVG Mapping Engine"]
        LocalData["In-Memory Mock Store (public/mocks/*.json)"]
        GESerializer["Client KML Serializer (lib/googleEarth.ts)"]
    end

    subgraph ExternalThirdParty ["External Third-Party Services (HTTPS)"]
        EsriTiles["Esri ArcGIS Tile Servers"]
        OSMTiles["OpenStreetMap Tile Servers"]
        GoogleEarthWeb["Google Earth Web (earth.google.com)"]
    end

    UntrustedZone -->|Loads Static Assets| ClientSandbox
    NextApp --> LeafletEngine
    NextApp --> LocalData
    NextApp --> GESerializer
    LeafletEngine -.->|Anonymous Outbound Tile Requests| EsriTiles
    LeafletEngine -.->|Anonymous Outbound Tile Requests| OSMTiles
    GESerializer -.->|Launches Camera Tab (Centroid Only)| GoogleEarthWeb
```

### Trust Boundary Analysis:
- The entire runtime executes within the **Browser Sandbox Trust Boundary**.
- No private keys, database credentials, or secret tokens exist in the client bundle.
- Outbound network requests are limited to anonymous `HTTPS GET` tile requests (Esri / OpenStreetMap) and user-initiated navigation to Google Earth Web.

---

## 4. Client-Side Privacy & Google Earth Data Boundaries

The "Open in Google Earth" workflow on the Flood Owner Land Detail page enforces strict client-side privacy boundaries:

1. **Pure Client-Side KML Synthesis:** All KML generation occurs directly in client memory via [`lib/googleEarth.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/googleEarth.ts). The generated KML file is delivered directly to the browser's download manager via an in-memory `Blob` and `URL.createObjectURL()`.
2. **Zero Backend Storage:** No parcel KML files are stored on any server or cloud bucket.
3. **Zero PII in External URL:** The URL opened in Google Earth Web (`https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`) transmits **only** the numerical latitude, longitude, and camera altitude of the parcel bounding-box centroid. Landowner names, NID hashes, deed numbers, and parcel boundary vertices are **never transmitted** in the URL.
4. **Local File Loading:** The parcel outline appears in Google Earth only when the user manually imports the locally downloaded KML file (**New → Open local KML file**), keeping all geometry strictly under the user's local control.

---

## 5. Current Prototype Vulnerability Posture

### 5.1 Absence of Server-Side Attack Vectors
Because BhumiDorpon does not expose an HTTP backend server or SQL database:
- **SQL Injection (SQLi):** **Non-Existent.** (No database connection exists).
- **Server-Side Request Forgery (SSRF):** **Non-Existent.** (No server-side fetching).
- **Authentication Bypass / Broken Object Level Authorization (BOLA):** **Non-Existent.** (No user sessions or access control headers).
- **Remote Code Execution (RCE):** **Non-Existent.** (No backend evaluation or command execution).

### 5.2 Client-Side Cross-Site Scripting (XSS) Mitigation
- **React Escaping:** Next.js and React automatically encode all JSX string interpolations, preventing DOM-based XSS attacks.
- **XML Escaping in KML Serializer:** In [`lib/googleEarth.ts`](file:///d:/Project/Antigravity/BhumiDorpon/lib/googleEarth.ts), the `escapeXml()` function strictly sanitizes all user metadata before embedding into KML Placemarks:
  ```typescript
  export function escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
  ```
- **Leaflet HTML Injection:** Leaflet tooltips and popups avoid raw string concatenation, binding properties safely through verified text content setters.

### 5.3 Dependency Security Audit
- All packages in `package.json` are pinned to secure, modern versions.
- Running `npm audit` confirms zero critical or high-severity vulnerabilities across active dependencies.

---

## 6. Proposed Production Security Architecture

When moving to an operational government deployment, the following security measures will be implemented:

### 6.1 Secrets & Environment Variable Management
- All production credentials (database connection strings, NextAuth secret keys, GEE service account private keys) managed via HashiCorp Vault or AWS Secrets Manager.
- Strictly prohibited from committing `.env.local` or raw secret keys to Git repositories.

### 6.2 SQL & Spatial Injection Defenses
- All queries executed through parameterized SQL via PostGIS prepared statements or Prisma ORM.
- Spatial geometry arguments sanitized using `ST_GeomFromGeoJSON()` with strict SRID validation (EPSG:4326 / EPSG:32646) to prevent malicious SQL payload injection through spatial coordinates.

### 6.3 Content Security Policy (CSP) & HTTP Headers
Production reverse proxies (Nginx / Cloudflare) will enforce strict security response headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://server.arcgisonline.com https://*.tile.openstreetmap.org; connect-src 'self'; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 6.4 API Rate Limiting & Denial-of-Service (DoS) Defense
- API endpoints protected by Redis-backed Token Bucket rate limiting:
  - Public Read Endpoints: Max 60 requests per minute per IP.
  - GeoJSON / Vector Tile Endpoints: Max 120 requests per minute per IP.
  - Export Endpoints: Max 10 requests per minute per IP.

### 6.5 Personally Identifiable Information (PII) Safeguards
- National Identity (NID) numbers and landowner contact details encrypted at rest using AES-256 encryption.
- Public views mask all citizen NIDs by default (`88019******15`). Unmasked viewing is strictly restricted to authenticated Assistant Commissioners of Land (AC Land).

---

## 7. Compliance & Data Governance Standards

1. **National Data Protection Compliance:** In alignment with Bangladesh digital data governance guidelines, all official land records remain within sovereign data boundaries.
2. **Audit Logging:** All administrative actions (compensation approvals, boundary revisions) generate immutable, append-only audit entries.
3. **Disclaimers:** Every public screen prominently displays disclaimers distinguishing model projections from official legal land surveys.
