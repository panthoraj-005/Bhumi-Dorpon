# Security Specification — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Hazard Dashboard**

---

> **Document Status:** Authoritative Security & Privacy Posture Specification  
> **Security Audit Status:** **INTERNAL SOURCE REVIEW (No Formal External Audit Performed)**  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [TRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/trd.md) | [System Architecture](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/system-architecture.md) | [Authentication & Authorization](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/authentication-authorization-specification.md)

---

## 1. Security Scope

This specification documents the current security, data privacy, and vulnerability posture of the **BhumiDorpon** web application. Because BhumiDorpon currently operates as a client-side demonstration prototype without a backend server, database, or authenticated user accounts, its attack surface is inherently different from a multi-tenant enterprise cloud service.

---

## 2. Application Assets and Sensitive Data

| Asset Category | Description in Current Prototype | Sensitivity Classification |
|---|---|---|
| **Cadastral Plot Geometries** | Synthetic polygons representing land parcels in `/mocks/plots.json`. | **Public / Non-Sensitive** (Fictional demonstration data). |
| **Landowner Identities** | Invented names (e.g., *Abdul Karim*, *Rahima Begum*) in `/mocks/owners.json`. | **Public / Non-Sensitive** (Fictional mock data). |
| **Financial Compensation Sums**| Illustrative compensation figures calculated via standard formulas. | **Public / Non-Sensitive** (Fictional demonstration data). |
| **Source Code & Configurations**| Next.js, React, and Leaflet application code. | **Proprietary / Public Repo** (No committed secrets). |
| **User Personal Data** | **None.** The application does not collect names, emails, IP logs, or passwords. | **N/A** |

---

## 3. Trust Boundaries

```mermaid
graph TD
    subgraph UntrustedZone ["Untrusted Zone (Public Internet)"]
        UserBrowser["User Web Browser"]
    end

    subgraph ClientBoundary ["Client Trust Boundary (Browser Sandbox)"]
        ReactApp["BhumiDorpon Next.js Client App"]
        DOM["Browser Document Object Model (DOM)"]
        LocalMemory["In-Memory Mock Datasets"]
    end

    subgraph ExternalServicesZone ["External Third-Party Zone (HTTPS)"]
        EsriTiles["Esri ArcGIS Tile Servers"]
        OSMTiles["OpenStreetMap Tile Servers"]
    end

    UntrustedZone -->|Loads Assets| ClientBoundary
    ReactApp -->|Renders UI into| DOM
    ReactApp -->|Queries (Read-Only)| LocalMemory
    ReactApp -.->|Outbound Tile Requests (No User Data)| ExternalServicesZone
```

### Trust Boundary Analysis:
- The entire application runtime executes inside the **Browser Sandbox Trust Boundary**.
- No private data or server credentials cross this boundary.
- Outbound network calls are restricted to public, anonymous `HTTPS GET` requests to fetch map imagery tiles from Esri and OpenStreetMap.

---

## 4. External Dependencies and Network Connections

1. **Outbound HTTPS Network Requests:**
   - `https://server.arcgisonline.com/...` (Esri World Imagery raster tiles)
   - `https://tile.openstreetmap.org/...` (OpenStreetMap cartographic tiles)
2. **Third-Party Package Dependencies:**
   - 17 production dependencies managed via npm (e.g., `next`, `react`, `leaflet`, `recharts`, `lucide-react`, `zustand`, `@tanstack/react-query`).
   - All packages are installed with pinned semantic version ranges in [`package.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/package.json).

---

## 5. Environment Variable & Secret Management

- **Committed Secrets Inspection:** Verification of the repository confirms that **no API keys, private passwords, cryptographic secrets, or database credentials are committed**.
- **Public Environment Variables:** Only optional public tile server URLs (`NEXT_PUBLIC_SATELLITE_TILE_URL` and `NEXT_PUBLIC_STREET_TILE_URL`) are supported in `.env.local`.
- **Zero-Secret Architecture:** The prototype requires zero credentials to build, test, and deploy.

---

## 6. Input Validation & Injection Risks

1. **Cross-Site Scripting (XSS):**
   - React 18 automatically escapes dynamic values rendered in JSX, neutralizing standard HTML injection attacks.
   - The application does **not** employ `dangerouslySetInnerHTML` for rendering user inputs.
   - Text inputs (e.g., table search queries in `OwnerTable.tsx`) operate purely as in-memory filter criteria against static JSON strings; they are not evaluated or passed to `eval()`.
2. **SQL Injection:**
   - **N/A.** There is no SQL database engine or backend query builder running in the system.
3. **Server-Side Request Forgery (SSRF):**
   - **N/A.** The application does not proxy external HTTP requests through a backend server.

---

## 7. Authentication & Authorization Status

- **Status:** **NOT IMPLEMENTED.**
- The application enforces zero authentication barriers. All routes and views are public.
- In production, integrating role-based access control (RBAC) and national identity verification (*Porichoy* SSO) will be required to protect real cadastral land records.

---

## 8. Supply Chain & Dependency Vulnerability Risks

- **Risk:** Vulnerabilities in third-party npm packages (e.g., transitive dependencies in Next.js or Leaflet).
- **Current Posture:** Packages are tracked in [`package-lock.json`](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/package-lock.json). Regular execution of `npm audit` is recommended during CI/CD runs.
- **Node.js Memory Ceilings:** Build commands explicitly configure `--max-old-space-size=1536` to prevent memory denial-of-service during packaging.

---

## 9. Map Provider & Third-Party Service Considerations

- **Tile Scraping & Usage Policies:** Outbound requests to OpenStreetMap conform to standard tile usage policies (identifiable user agents, cached requests).
- **Content Security Policy (CSP):** When deploying to production web servers (e.g., Nginx, Vercel), a strict CSP header must be configured to restrict image loading:
  ```text
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://server.arcgisonline.com https://tile.openstreetmap.org; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
  ```

---

## 10. Data Privacy & GDPR/Bangladesh Cyber Security Considerations

1. **Fictional Demonstration Data:** All individual landowner profiles, plot records, and financial figures are completely synthetic. No real individuals' personal data, phone numbers, or NID cards are contained in `/mocks`.
2. **Zero Telemetry / Zero Tracking:** The application embeds zero third-party tracking scripts, analytics cookies, advertising SDKs, or invasive telemetry.
3. **Client-Side Processing:** Coordinate calculations and GeoJSON exports execute locally on the user’s device without telemetry logging.

---

## 11. Error Handling and Logging Practices

- Client-side exceptions are handled via localized React error boundaries (`ErrorState.tsx`).
- No sensitive stack traces, file system paths, or internal server configurations are exposed to users in the browser console during production builds.

---

## 12. Security Risks and Mitigations

| Identified Risk | Risk Level | Real-World Impact | Implemented Mitigation |
|---|---|---|---|
| **Public Disclosure of Real Land Assets** | Critical | Exposure of real citizens' private land holdings and wealth. | Strict use of synthetic, fictional mock data in `/mocks`. No live connection to land ministry databases. |
| **Misinterpretation of Forecasts** | High | Citizen distress or land speculation based on predictive hazard models. | Mandatory forecast disclaimers, confidence badges, and complete suppression of compensation disbursement fields in Forecast mode. |
| **External Tile Spoofing / Man-in-the-Middle** | Medium | Malicious tampering with satellite imagery tiles. | Mandatory HTTPS protocol enforcement on all external tile endpoints. |
| **Denial of Service via Heavy GeoJSON** | Low | Browser tab crash when rendering thousands of complex polygon vertices. | Boundary simplification and bounding-box spatial clipping via Turf.js. |

---

## 13. Recommended Future Security Controls (Production Roadmap)

When BhumiDorpon evolves into an operational national platform, the following controls must be implemented:
1. **OpenID Connect (OIDC) Authentication:** Require multi-factor authentication (MFA) via the Bangladesh National Identity Platform (*Porichoy*) for accessing non-public cadastral sheets.
2. **Role-Based Access Control (RBAC):** Restrict compensation adjustments and ground-survey submissions to authenticated Assistant Commissioners of Land (AC Land) and Kanungos.
3. **Database Security:** Enforce PostGIS connection pooling over TLS, with Row-Level Security (RLS) ensuring that field surveyors only access records within their assigned upazila.
4. **Comprehensive Audit Logging:** Maintain immutable append-only audit logs recording every cadastral plot query, coordinate export, and compensation modification.
5. **Formal Penetration Testing:** Commission independent third-party penetration testing and vulnerability assessments prior to production launch.

---

<!-- addendum:google-earth-and-hazard-store -->
## 7. Addendum — Google Earth & Five-Hazard Store Privacy and Security Analysis

### 7.1 Google Earth Integration Privacy Boundaries
The "Open in Google Earth" feature on the Flood Owner Land Detail page was engineered under strict privacy-preserving zero-leakage principles:
- **Trust Boundary Analysis:**
  - **Data crossing to Google:** ONLY the parcel bounding-box centroid (`<lat>,<lon>`) and camera range (`<range>d`) pass through the URL query string: `https://earth.google.com/web/@<lat>,<lon>,0a,<range>d,35y,0h,0t,0r`.
  - **Data staying strictly on device:** Landowner names, father's names, NID details, contact numbers, Dag numbers, Khatian numbers, financial compensation amounts, and full cadastral boundary coordinates NEVER cross external network boundaries.
  - **KML In-Memory Generation:** The `.kml` file is compiled purely in client JavaScript memory via `new Blob()` and served via an ephemeral `URL.createObjectURL()` anchor click, which is revoked immediately. No backend server stores, hosts, logs, or inspects the generated KML.
- **Relief from Third-Party Tracking:** No Google Earth Engine SDK, Google Maps JavaScript API, or Google Analytics tracking scripts are embedded in the application.

### 7.2 Five-Hazard Information Store Security Posture
- **Zero Attack Surface:** All hazard datasets (flood, river erosion, landslide, char dynamics, coastal erosion) are served as immutable, static JSON files via `public/mocks/` and `mocks/`. There is no SQL database engine, no connection string, no server-side execution environment, and no attack surface for SQL injection, ORM vulnerabilities, or authentication bypass.
- **Read-Only Determinism:** Datasets cannot be mutated via HTTP requests.
- **Data Integrity & Disclaimers:** All datasets carry explicit disclaimers (*"BhumiDorpon demo (mock / synthetic data, not a legal survey)"*) to prevent accidental reliance on synthetic demo boundaries for legal conveyancing.

