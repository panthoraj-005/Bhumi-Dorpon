# Authentication & Authorization Specification — BhumiDorpon
**Bangladesh Cadastral Land-Change Records & Multi-Hazard Geospatial Dashboard**

---

> **Document Status:** Authoritative Security & Access Control Specification  
> **Current Authentication Status:** **NOT IMPLEMENTED (Public Demonstration Prototype)**  
> **Current Access Model:** Unrestricted Public Access (Zero Authentication / Zero Authorization)  
> **Target Production Model:** Role-Based Access Control (RBAC) with Government SSO Integration  
> **Team:** GeoNeural  
> **Last Updated:** October 2026  
> **Cross-References:** [Main Documentation](MAIN_PROJECT_DOCUMENTATION.md) | [PRD](PRD.md) | [TRD](TRD.md) | [Security Specification](SECURITY_SPECIFICATION.md) | [System Architecture](ARCHITECTURE.md) | [Database Schema](DATABASE_SCHEMA.md) | [Testing & QA](TESTING_QA.md)

---

## Table of Contents

- [1. Current Authentication Status (v1.1 Prototype)](#1-current-authentication-status-v11-prototype)
- [2. Existing Route and Access Posture](#2-existing-route-and-access-posture)
- [3. Identity Provider and User Registry Status](#3-identity-provider-and-user-registry-status)
- [4. Proposed Production Authentication Architecture](#4-proposed-production-authentication-architecture)
  - [4.1 Identity Provider Strategy](#41-identity-provider-strategy)
  - [4.2 Government Single Sign-On (SSO) Integration](#42-government-single-sign-on-sso-integration)
- [5. Proposed Role-Based Access Control (RBAC)](#5-proposed-role-based-access-control-rbac)
  - [5.1 User Role Definitions](#51-user-role-definitions)
  - [5.2 Role-Based Permission Matrix](#52-role-based-permission-matrix)
- [6. Session Management and Route Protection Strategy](#6-session-management-and-route-protection-strategy)
  - [6.1 JWT Session Tokens & Cookie Security](#61-jwt-session-tokens--cookie-security)
  - [6.2 Next.js Middleware Route Guards](#62-nextjs-middleware-route-guards)
- [7. Audit Logging & Compliance Standards](#7-audit-logging--compliance-standards)

---

## 1. Current Authentication Status (v1.1 Prototype)

> [!IMPORTANT]
> **NO AUTHENTICATION OR AUTHORIZATION SYSTEM IS CURRENTLY IMPLEMENTED IN THE PROTOTYPE.**
> An exhaustive inspection of the BhumiDorpon codebase confirms that the current release does not implement user login, account registration, session tokens, passwords, multi-factor authentication, OAuth integrations, identity providers, or role-based access control (RBAC).

All routes, national dashboard KPI metrics, cascading selectors, side-by-side synchronized Leaflet maps, landowner compensation tables, 4-corner GPS coordinate readouts, and Google Earth KML exports are **fully accessible to any user without authentication**.

---

## 2. Existing Route and Access Posture

- **Login / Logout Routes:** **None.** There are no `/login`, `/logout`, `/register`, or `/auth` routes in the codebase.
- **UI Elements:** The user interface features zero sign-in buttons, user profile avatars, or credential modals.
- **Protected Middleware:** No Next.js middleware file (`middleware.ts`) is present. All URL routes under `/app` are public and render immediately upon browser navigation.
- **Fictional Data Context:** Landowner identities (e.g., *Abdul Karim*, *Rahima Begum*) displayed on the Flood Owner Land Detail pages are **purely fictional mock records** embedded in static JSON files (`mocks/owners.json`), not authenticated user profiles.

---

## 3. Identity Provider and User Registry Status

- **Identity Provider (IdP):** **None.** (Zero integration with NextAuth.js, Auth0, Firebase Auth, Clerk, Keycloak, or Supabase Auth).
- **User Database:** **None.** No database tables, JSON user registries, or browser local storage records exist to store user accounts, emails, hashed passwords, or session tokens.
- **Credential Storage:** Zero user passwords, payment tokens, or biometric records are handled or stored by the application.

---

## 4. Proposed Production Authentication Architecture

When migrating BhumiDorpon from an open demonstration prototype to an operational government land administration portal, a secure, standards-compliant authentication subsystem will be deployed.

```mermaid
graph TD
    User["User Accesses BhumiDorpon"] --> RouteCheck{"Route Access Check"}
    RouteCheck -->|Public Routes (/ & Hazard Views)| PublicAccess["Allow Anonymous Access"]
    RouteCheck -->|Restricted Administrative Routes| AuthCheck{"Authenticated Session?"}
    
    AuthCheck -->|No| LoginRedirect["Redirect to /auth/login"]
    LoginRedirect --> IdPOptions{"Authentication Provider"}
    
    IdPOptions -->|Citizens / Researchers| OIDC["Citizen Digital ID / OIDC"]
    IdPOptions -->|Land Officials / Surveyors| GovtSSO["National Land Ministry SSO (DLR&S / e-Porcha)"]
    
    OIDC --> IssueJWT["Issue Secure HTTP-Only JWT Session Token"]
    GovtSSO --> IssueJWT
    IssueJWT --> AuthCheck
    AuthCheck -->|Yes| RBACCheck{"Verify Role Permissions (RBAC)"}
    RBACCheck -->|Authorized| GrantAccess["Render Protected View / Action"]
    RBACCheck -->|Unauthorized| DenyAccess["Display 403 Forbidden Error"]
```

### 4.1 Identity Provider Strategy
- **Framework:** **NextAuth.js (Auth.js v5)** integrated with Next.js App Router.
- **Session Mechanism:** Stateless JSON Web Tokens (JWT) signed using RS256 asymmetric encryption with rotating key pairs.
- **Cookie Security:** Strict flags applied to session cookies (`HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`).

### 4.2 Government Single Sign-On (SSO) Integration
In coordination with the Ministry of Land and the Directorate of Land Records and Surveys (DLR&S):
- Integration with Bangladesh National Digital Identity / MyGov OpenID Connect (OIDC) gateway.
- Integration with Land Ministry internal LDAP / Active Directory for Assistant Commissioners of Land (AC Land) and Upazila Surveyors.

---

## 5. Proposed Role-Based Access Control (RBAC)

### 5.1 User Role Definitions

1. **Anonymous Citizen / Public User (`role: citizen`):**
   - General public, affected landowners, journalists, and students.
   - Access: Read-only access to all public hazard dashboards, side-by-side maps, 4-corner GPS boundary readouts, and individual parcel KML exports.
2. **Field Relief Officer (`role: relief_officer`):**
   - Union Parishad representatives, Disaster Management Officers (DMO), Red Crescent coordinators.
   - Access: Everything in Citizen role + access to aggregated village damage rosters, field verification checklists, and offline relief disbursement reports.
3. **Land Administration Official (`role: surveyor_acland`):**
   - Kanungos, Upazila Surveyors, and Assistant Commissioners of Land (AC Land).
   - Access: Everything in Relief Officer role + authority to review formal compensation claims, submit post-disaster boundary re-survey adjustments, and flag disputed plots.
4. **System Administrator (`role: sys_admin`):**
   - Technical operators and geospatial system managers.
   - Access: Complete administrative access, dataset ingestion pipeline management, user role assignment, and audit log inspection.

### 5.2 Role-Based Permission Matrix

| Route / Resource / Action | Citizen (Public) | Field Relief Officer | Land Administration (AC Land) | System Administrator |
|---|---|---|---|---|
| **View Dashboard & Hazard Maps** | Permitted | Permitted | Permitted | Permitted |
| **Inspect 4-Corner Plot Coordinates** | Permitted | Permitted | Permitted | Permitted |
| **Export Parcel to Google Earth (KML)**| Permitted | Permitted | Permitted | Permitted |
| **Download Aggregated Mouza CSV** | Permitted | Permitted | Permitted | Permitted |
| **Access Unmasked Landowner NID Data**| Denied | Permitted | Permitted | Permitted |
| **Submit Field Verification Survey** | Denied | Permitted | Permitted | Permitted |
| **Approve Compensation Disbursement** | Denied | Denied | Permitted | Permitted |
| **Trigger GEE Satellite ETL Ingest** | Denied | Denied | Denied | Permitted |
| **Manage User Roles & View Audit Logs**| Denied | Denied | Denied | Permitted |

---

## 6. Session Management and Route Protection Strategy

### 6.1 JWT Session Tokens & Cookie Security
- **Token Expiry:** Access tokens expire after 15 minutes; refresh tokens stored in secure database table with 7-day expiry and sliding expiration.
- **Payload Schema:**
  ```json
  {
    "sub": "usr_991823746",
    "name": "Pantho Raj Biswas",
    "email": "panthoraj@gov.bd",
    "role": "surveyor_acland",
    "jurisdiction": {
      "district_id": "dist-sirajganj",
      "upazila_id": "upz-kazipur"
    },
    "exp": 1792083600
  }
  ```

### 6.2 Next.js Middleware Route Guards
Protected administrative routes will be guarded by a unified Edge middleware (`middleware.ts`):

```typescript
// Proposed Next.js Middleware Implementation
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Protect administrative routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/surveys/approve")) {
    if (!token || !["surveyor_acland", "sys_admin"].includes(token.role as string)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/surveys/approve/:path*", "/api/v1/admin/:path*"]
};
```

---

## 7. Audit Logging & Compliance Standards

To satisfy national land tenure compliance and administrative accountability:
1. **Immutable Audit Trails:** Every administrative status modification (e.g., approving a compensation liability or modifying a boundary coordinate) generates an append-only audit log entry storing:
   - Timestamp (UTC ISO 8601).
   - User ID and authenticated role.
   - Client IP address and User-Agent.
   - Action type and affected entity (e.g., `APPROVE_COMPENSATION`, `plot_id: 101`).
   - Before and after state values.
2. **PII Safeguards:** Citizen personal identification numbers (NID) and mobile numbers are masked by default (`88019******15`) and only visible to authorized land revenue officers.
