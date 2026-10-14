# BhumiDorpon — Main Project Documentation
**Bangladesh Cadastral Land-Change Records & Hazard Dashboard**

---

> **Document Status:** Comprehensive System Reference  
> **Team:** GeoNeural  
> **Version:** 1.1 (Demonstration Release)  
> **Last Updated:** October 2026  
> **Cross-References:** [PRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/prd.md) | [TRD](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/trd.md) | [App Flow & User Flow](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/app-flow-user-flow.md) | [System Architecture](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/system-architecture.md) | [UI/UX Design System](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/ui-ux-design-system.md)

---

## 1. Project Overview

### 1.1 What is BhumiDorpon?
**BhumiDorpon** (Bengali: ভূমিদর্পণ — literally *"Mirror of the Earth"*) is a specialized, map-centric web application engineered to monitor, analyze, and visualize cadastral land changes, physical environmental hazards, and tenure displacement across Bangladesh. Built with modern web GIS technologies, it brings together parcel-level cadastral boundaries (Dag and Khatian numbers), historical environmental losses and accretion gains, and forward-looking hazard projections within an accessible, interactive interface.

The application addresses one of the most critical vulnerabilities in Bangladesh: the continuous, dynamic reshaping of the country's land surface by natural phenomena, and the resulting socioeconomic disruption experienced by rural landowners, tenant farmers, and administrative authorities.

### 1.2 Map-Centered Land and Hazard Exploration
In Bangladesh, land administration and disaster reporting have traditionally operated in disconnected silos. Official land records (cadastral sheets, khatians, and mouza maps) are stored as physical or semi-digitized cadastral archives, while disaster warnings and flood bulletins are published as high-level meteorological forecasts or river-basin water level charts. 

BhumiDorpon bridges this divide through **map-centered exploration**. Instead of presenting abstract statistical tables, the platform places interactive, geographically synchronized maps at the center of the user experience. Users navigate through administrative hierarchies (Division &rarr; District &rarr; Upazila &rarr; River/Hill/Mouza) and visually inspect how specific physical hazards intersect with cadastral plots, homesteads, agricultural parcels, and community infrastructure.

### 1.3 Geographical and Social Context of Bangladesh
Bangladesh lies at the downstream confluence of three mighty Himalayan river systems—the **Ganges (Padma)**, the **Brahmaputra (Jamuna)**, and the **Meghna**—forming the world’s largest and most active delta. Over 80% of the country’s territory consists of low-lying alluvial floodplains, rarely rising more than 10 meters above mean sea level. 

This unique geography produces extreme territorial volatility:
- High monsoon river discharges and unstable alluvial sediment cause rapid riverbank collapse, consuming thousands of hectares of arable land annually.
- Seasonal monsoon downpours and upstream transboundary runoff inundate vast haor and floodplain depressions.
- Coastal storm surges, tropical cyclones, and tidal dynamics continually erode marine coastlines while depositing ephemeral mudflats (*chars*).
- Intense localized monsoon rainfall in the southeastern tertiary hills triggers deadly debris slides on deforested slopes.

In a country with a population density exceeding 1,100 people per square kilometer, land is not merely an asset; it is the fundamental foundation of livelihood, food security, social dignity, and intergenerational survival. When a river swallows a plot of land, families lose their homes, ancestral inheritance, and means of subsistence overnight.

### 1.4 The Five Hazard Categories Covered
BhumiDorpon unites five distinct yet geographically interconnected hazard modules:
1. **River Erosion** (`/river-erosion`): Monitoring active riverbank retreat, bankline migration rates, collapsed homestead counts, and affected cadastral parcels along braided and meandering river corridors (pilot: *Kazipur, Sirajganj along the Jamuna River*).
2. **Flood Monitoring** (`/flood`): Tracking mouza-scale seasonal and flash inundation events, water depth categorization (Shallow, Moderate, Deep), submerged cadastral plots, and individual parcel corner coordinates (pilot: *Gowainghat and Jaflong, Sylhet / Tahirpur, Sunamganj*).
3. **Landslides** (`/landslide`): Examining slope instability, rainfall triggers, failure scars, synthetic digital elevation models (DEM), hillshade profiles, and debris runout risk buffers in the southeastern hill tracts (pilot: *Kawkhali, Rangamati*).
4. **Char Formation and Erosion** (`/char`): Cataloging the emergence, morphological migration, and erosion of mid-channel sandbars (*chars*), tracking net territorial shifts, and isolating unowned state khas alluvial accretions (pilot: *Char Girish, Kazipur, Sirajganj*).
5. **Coastal Erosion and Land Formation** (`/coastal`): Visualizing marine shoreline retreat, tidal mudflat accretion, deltaic sedimentation, and newly formed unassigned offshore land blocks in the Bay of Bengal estuary (pilot: *Monpura and Char Fasson, Bhola / Hatiya*).

### 1.5 Target Problem and Intended Users
The core problem is the **information gap between macro-level disaster events and micro-level cadastral ownership**. When hazards occur, affected citizens struggle to ascertain which exact plots were submerged or washed away; local land revenue officials (Assistant Commissioners of Land, Kanungos, and Surveyors) lack immediate spatial tools to calculate affected land areas for relief allocation; and researchers lack an integrated platform to correlate hazard extents with cadastral boundaries.

BhumiDorpon is designed for:
- **Landowners and Citizens:** To look up specific plots, verify submersion or erosion impact, and inspect boundary coordinates.
- **Land Administration Officials (AC Land, Surveyors):** To review mouza-level damage summaries, identify affected Dag and Khatian deeds, and estimate compensation requirements.
- **Disaster Response & Humanitarian Coordinators:** To assess localized vulnerability and prioritize assistance.
- **Students, Researchers, and Reviewers:** To study deltaic morphodynamics, explore simulated hazard projections, and evaluate web-based spatial data visualization methods.

### 1.6 Current Implementation Capabilities vs. Future Potential
- **Current Capabilities (Implemented):** BhumiDorpon is currently implemented as a fully interactive, responsive web-based prototype built with Next.js 14, TypeScript, Tailwind CSS, and Leaflet. It features side-by-side synchronized Before/After maps, dual basemap switching (Light GIS and Esri World Imagery Satellite), multi-depth flood inundation overlays, 4-corner GPS boundary readouts (Corner 1 NW, 2 NE, 3 SE, 4 SW to 6 decimal places), GeoJSON/CSV exports, and unit toggling (Decimal, Acre, Hectare).
- **Current Data Status:** All records, plot numbers (Dag No.), deeds (Khatian No.), landowner identities, and financial compensation amounts are **deterministic, synthetic mock datasets** generated client-side from structured JSON files in `/mocks`.
- **Future Potential (Proposed):** Connecting the frontend architecture to a live PostgreSQL/PostGIS spatial database, integrating real-time optical/SAR satellite imagery feeds (Copernicus Sentinel-1/2), running operational deep-learning prediction models (U-Net, ConvLSTM), and interfacing with official government land registries (e-Mutation / Khatian records) under appropriate regulatory frameworks.

---

## 2. Background and Problem Statement

### 2.1 Why Hazard-Related Geographic Information Matters
In Bangladesh, environmental hazards are not rare anomalies; they are recurring, systemic phenomena that dictate the rhythm of national life. According to the Center for Environmental and Geographic Information Services (CEGIS) and the Bangladesh Water Development Board (BWDB), riverbank erosion alone has displaced millions of citizens over recent decades, destroying roads, health clinics, educational institutions, and entire riverine villages (*mouzas*).

Despite this reality, geographic hazard information is rarely accessible at the level of detail that matters most to an individual citizen: **the cadastral plot**. A meteorological bulletin warning that *"the Jamuna River is flowing 45 cm above danger level at Kazipur point"* conveys critical hydrological information, but it does not answer the fundamental human questions:
- *“Has the bankline reached Dag No. 412 in Mouza Khanshama?”*
- *“Is my homestead plot completely eroded, or partially submerged?”*
- *“What are the exact GPS coordinates of my plot corners so I can re-establish my boundary after the floodwaters recede?”*

### 2.2 The Information Access and Visualization Problem
The core challenge is not a complete absence of data, but severe fragmentation, lack of geographic interface, and technical complexity:
1. **Scattered Information:** Hydrological data resides with the BWDB; meteorological alerts belong to the Bangladesh Meteorological Department (BMD); cadastral maps belong to the Directorate of Land Records and Surveys (DLRS); disaster damage assessments are compiled in static PDF circulars by the Ministry of Disaster Management and Relief (MoDMR).
2. **Absence of Geographic Interactivity:** Most public reports are static text summaries or non-spatial tables. Users cannot zoom into an affected upazila, compare pre-disaster and post-disaster satellite imagery, or inspect boundary lines.
3. **Difficulty in Temporal Comparison:** Understanding land loss requires visual, spatial comparison across time. Ordinary citizens and local surveyors cannot easily overlay last year's satellite survey against today's riverbank to gauge erosion velocity.

### 2.3 Physical Disaster vs. Information Visualization Problem
It is essential to clarify the boundary of this project:
- **The Physical Problem:** Flooding, riverbank collapse, and landslides are colossal geophysical processes driven by monsoon hydrology, tectonic activity, sediment flux, and global climate change. A software application cannot stop a riverbank from collapsing, nor can it physically alter the course of floodwaters.
- **The Information Visualization Problem:** What BhumiDorpon **can** solve is the problem of opacity, delayed assessment, and spatial confusion. By visualizing exactly where changes occurred, which cadastral parcels are affected, and what the historical and projected trends indicate, the platform empowers decision-makers and citizens with transparent, actionable spatial intelligence.

---

## 3. Problems Faced by People in Bangladesh

```
                                 ┌─────────────────────────────────────────────────────────────┐
                                 │       Geophysical Hazards in the Bangladesh Delta          │
                                 └──────────────────────────────┬──────────────────────────────┘
                                                                │
         ┌───────────────────────┬──────────────────────────────┼──────────────────────────────┬─────────────────────────┐
         ▼                       ▼                              ▼                              ▼                         ▼
┌──────────────────┐    ┌──────────────────┐          ┌───────────────────┐          ┌──────────────────┐      ┌──────────────────┐
│  River Erosion   │    │  Monsoon Flood   │          │    Landslides     │          │  Char Accretion  │      │ Coastal Erosion  │
│ (Active braided  │    │ (Haor & riverine │          │ (Tertiary hilly   │          │ (Dynamic river   │      │ (Marine shoreline│
│  bankline loss)  │    │  inundations)    │          │  slope failure)   │          │  sandbar shifts) │      │  & surge delta)  │
└────────┬─────────┘    └────────┬─────────┘          └─────────┬─────────┘          └────────┬─────────┘      └────────┬─────────┘
         │                       │                              │                             │                         │
         ▼                       ▼                              ▼                             ▼                         ▼
┌──────────────────┐    ┌──────────────────┐          ┌───────────────────┐          ┌──────────────────┐      ┌──────────────────┐
│ Loss of homestead│    │ Waterlogging,    │          │ Structural burial,│          │ Land disputes,   │      │ Embankment breach│
│ & farmland into  │    │ crop ruin, lost  │          │ road severance,   │          │ unstable tenure, │      │ saline intrusion,│
│ deep water       │    │ boundary markers │          │ loss of life      │          │ khas allocations │      │ coastal retreat  │
└──────────────────┘    └──────────────────┘          └───────────────────┘          └──────────────────┘      └──────────────────┘
```

### 3.1 River Erosion
- **Real-World Impact:** In districts like Sirajganj, Kurigram, Shariatpur, and Chandpur along the Jamuna, Padma, and Lower Meghna rivers, bankline collapse is sudden and catastrophic. Entire villages, schools, and markets vanish into the riverbed during monsoon discharge peaks. Displaced families become landless climate migrants (*poribashito*), often forced to relocate to urban slums or temporary embankment shelters.
- **Geographic Significance:** River erosion is highly localized and directional. Understanding erosion requires inspecting the active river channel, tracking historical bankline retreat vectors, and observing the exact transect distances (in meters) by which the river has advanced inland.

### 3.2 Flooding
- **Real-World Impact:** Bangladesh experiences both seasonal monsoon riverine flooding and flash floods (especially in the northeastern haor basin including Sylhet, Sunamganj, and Netrokona). Inundations submerge homesteads, contaminate drinking water tubewells, destroy Standing Aman and Boro paddy crops, and paralyze transportation networks.
- **Geographic Significance:** Flood vulnerability is strictly determined by micro-topography. A difference of half a meter in surface elevation dictates whether a family's courtyard stays dry or experiences catastrophic flooding. Once waters recede, boundary markers (*ails*) are frequently washed away or covered under silt, igniting bitter land disputes among neighbors.

### 3.3 Landslides
- **Real-World Impact:** In the hilly terrain of southeastern Bangladesh (Chittagong, Rangamati, Bandarban, and Cox's Bazar), intense monsoon downpours saturate deforested hillside soils, triggering devastating slope failures and mudflows. Major events (such as the deadly 2017 landslides in Rangamati) have buried settlements, severed highway lifelines, and caused tragic loss of life among vulnerable hillside communities.
- **Geographic Significance:** Landslides occur in steep tertiary hill corridors (slopes often exceeding 35°–45°). A landslide visualization tool must reflect terrain elevation, slope gradients, digital elevation model (DEM) hillshades, contour isolines, failure scarps, and debris runout accumulation zones—rather than displaying flat, generic plains.

### 3.4 Char Formation and Erosion
- **Real-World Impact:** The colossal sediment load carried by the Brahmaputra-Jamuna river system (estimated at over 1 billion tons annually) results in continuous sediment deposition, giving rise to mid-channel sandbars and islands known as *chars*. As old chars erode, new chars emerge. Desperate, landless families migrate to these newly formed lands to farm fertile silt deposits.
- **Geographic Significance:** Chars represent an extremely volatile tenure environment. Boundaries are fluid, vegetation cover takes years to stabilize, and newly accreted lands are legally categorized as state-owned (*khas*) land under the Bengal Alluvion and Diluvion Regulation (Regulation XI of 1825). Tracking char morphodynamics requires monitoring accretion tips (land gain) versus erosion flanks (land loss) and distinguishing private surveyed plots from state khas accretions.

### 3.5 Coastal Erosion and Land Formation
- **Real-World Impact:** Along the Bay of Bengal coastline (Bhola, Hatiya, Noakhali, Patuakhali, and Cox's Bazar), land is subjected to marine wave action, semi-diurnal tidal regimes, and destructive cyclone storm surges. Shorelines retreat rapidly in exposed outer islands, destroying coastal embankments (*polders*) and causing saline intrusion in agricultural soil. Concurrently, estuarine sedimentation creates intertidal mudflats seaward of existing mouzas.
- **Geographic Significance:** Coastal environments involve distinct marine and estuarine dynamics, including tidal channels, cyclone surge vulnerabilities, and newly emerging virtual mouzas. Visualizations must accurately represent coastal mangrove buffers, mudflat boundaries, and seaward accretion blocks rather than confusing them with riverine bankline collapse.

### 3.6 The Common Problem: Spatial Fragmentation and Tenure Insecurity
Connecting all five hazards is a single, pervasive institutional challenge: **the disconnect between physical land alterations and official cadastral tenure records**. When the earth physically shifts, administrative records fail to update in lockstep. The resulting uncertainty leads to prolonged litigation, delayed government compensation, inequitable relief distribution, and profound human suffering. A unified, hazard-focused cadastral map interface provides the common spatial framework necessary to visualize these disparate realities coherently.

---

## 4. Project Objectives

BhumiDorpon was conceived with clear, realistic objectives calibrated to its current implementation status and future trajectory:

1. **Unify Five Distinct Hazard Domains in One Interface:** Provide a single, standardized web application where users can explore river erosion, flooding, landslides, char dynamics, and coastal changes without jumping between fragmented tools. *(Status: Implemented)*
2. **Deliver Map-Centered Cadastral Exploration:** Anchor all data queries to interactive, synchronized cartographic views supporting panning, zooming, and cadastral parcel inspection. *(Status: Implemented)*
3. **Provide Dual-Basemap Exploration:** Allow users to toggle between a clean, vector-style Light GIS Basemap and genuine high-resolution satellite imagery (Esri World Imagery) to inspect physical terrain behind administrative boundaries. *(Status: Implemented)*
4. **Implement Side-by-Side Temporal Comparison:** Display baseline (Before) and post-event/projected (After) conditions in synchronized side-by-side viewports to enable direct visual inspection of territorial changes. *(Status: Implemented)*
5. **Preserve Hazard-Specific Geographic Contexts:** Ensure that each hazard module renders at its authentic geographic location (e.g., Jamuna river corridor for river erosion, Rangamati hill tracts for landslides, Sunamganj haor basin for floods) rather than displaying a generic country-wide map. *(Status: Implemented)*
6. **Support Micro-Scale Cadastral Resolution:** Detail individual land plots with verified Dag No., Khatian No., landowner identities, land classifications, and explicit 4-corner GPS coordinates (NW, NE, SE, SW to 6 decimal places). *(Status: Implemented)*
7. **Transparently Distinguish Historical Records from Forward Projections:** Maintain strict separation between observed historical facts (`Recorded` mode) and forward-looking hazard models (`Forecast` mode), removing compensation payout records from predictive projections. *(Status: Implemented)*
8. **Enforce Complete Data Transparency:** Explicitly state the mock/synthetic provenance of all demonstration records and display persistent disclaimers (*"Demo geometry — not survey-accurate"*) whenever unverified geometry is viewed over real-world satellite imagery. *(Status: Implemented)*
9. **Serve as an Architectural Foundation for Real Spatial Integration:** Structure the frontend data access layer (`lib/data.ts`) with typed asynchronous interfaces that can cleanly transition to an enterprise PostGIS backend and live satellite pipeline in the future. *(Status: Implemented as architectural foundation; Backend implementation: Proposed)*

---

## Main Chapter A — Problems in Bangladesh and Why BhumiDorpon Was Created

### A1. The Core Problem
Bangladesh is one of the most disaster-prone and climate-vulnerable nations on earth. Its deltaic geomorphology makes land an inherently impermanent commodity. However, the systems used by citizens, civil servants, and humanitarian agencies to track land ownership, hazard impact, and relief eligibility are fundamentally static:
- A paper cadastral map drawn during the British colonial Cadastral Survey (CS), Pakistan-era State Acquisition (SA) survey, or Bangladesh Survey (BS) depicts permanent boundaries on immutable paper sheets.
- In reality, the Jamuna or Meghna river may have migrated two kilometers westward since that survey was completed, leaving the surveyed plot buried beneath ten meters of swirling water.
- Conversely, a farmer whose land resurfaces as an alluvial char island five years later has no accessible, authoritative way to map their ancestral plot boundary onto the newly deposited silt, sparking fierce territorial clashes with local land grabbers (*lathials*).

The core problem is therefore **a profound temporal and spatial mismatch**: the physical land moves continuously, while the records and public visibility of that land remain static, inaccessible, and disconnected from geographic reality.

### A2. Why the Five Hazards Matter
The five hazards addressed by BhumiDorpon represent the complete spectrum of territorial destabilization in Bangladesh:
- **River Erosion** represents permanent or long-term destruction of prime agricultural land and homesteads along the country's primary economic river arteries.
- **Flooding** represents recurring seasonal inundation that paralyses livelihoods, obscures boundary markers, and creates urgent need for agricultural compensation and relief.
- **Landslides** represent localized, acute disasters in hilly topographies where unstable soil mechanics directly threaten human settlements and regional infrastructure.
- **Char Formation and Erosion** represents the dynamic creation and destruction of deltaic land, governing the livelihoods of millions of the country's poorest citizens and presenting unique challenges for state land governance.
- **Coastal Erosion and Land Formation** represents the frontier between land and sea, where sea-level rise, storm surges, and deltaic accretion directly shape Bangladesh's national territorial baseline.

Each hazard operates under distinct physical laws, affects different geographic regions, and requires tailored cartographic overlays. Treating all hazards as a single generic "disaster" obscures the vital nuances required for effective spatial understanding.

### A3. Why We Created BhumiDorpon
The development team—**GeoNeural**—created BhumiDorpon to demonstrate how modern, accessible web technologies can democratize geographic land information in Bangladesh. 

Rather than building another abstract statistical dashboard filled with static pie charts, the team set out to answer a clear design challenge:
> *Can we build an intuitive, map-centered application where an ordinary citizen or local revenue officer can navigate directly to their upazila, view side-by-side satellite and cadastral maps, inspect affected plot numbers, review estimated compensation, and extract exact four-corner GPS coordinates?*

The motivation was grounded in a commitment to **informational empowerment, cartographic legibility, and absolute transparency**. By creating an open demonstration prototype, the team seeks to provide a compelling architectural benchmark for how future public land administration and disaster platforms in Bangladesh ought to be designed.

### A4. Problem-to-Project Relationship
The following table demonstrates how BhumiDorpon’s specific capabilities address real-world information challenges:

| Problem or Information Need | BhumiDorpon's Relevant Capability | How It May Help | Evidence or Limitation |
|---|---|---|---|
| **Scattered, fragmented disaster records** | Single unified dashboard organizing five distinct hazard modules (`/river-erosion`, `/flood`, `/landslide`, `/char`, `/coastal`). | Users explore all five hazard categories through a single, consistent interface and selector workflow. | **Implemented in prototype.** Limited to pilot regions; currently driven by seeded mock datasets. |
| **Inability to visualize pre- vs. post-hazard land changes** | Side-by-side synchronized Before/After `MapCompare` viewports with dual basemap switching (Light GIS & Satellite). | Users directly inspect physical bankline retreat, flood spread, slope collapse, or char growth across time. | **Implemented in prototype.** Visual comparison reflects mock scenario geometries; real-world tile alignment is unverified. |
| **Loss of physical plot boundary markers (*ails*) after floods** | Dedicated Flood Owner Land Page (`/flood/.../owner/...`) detailing exact 4-corner GPS coordinates (NW, NE, SE, SW to 6 decimal places). | Landowners can copy coordinates or export GeoJSON to verify plot boundaries on ground with handheld GPS/smartphones. | **Implemented in prototype.** Coordinates are synthetically generated for demonstration and are not legal survey records. |
| **Lack of parcel-level cadastral detail during disasters** | Mandatory inclusion of Dag No. and Khatian No. in all owner compensation and impact tables. | Bridges macro-level hazard extent with official cadastral deed identifiers familiar to local revenue officers. | **Implemented in prototype.** Synthetic plot/khatian records demonstrate the data model; no live government API exists. |
| **Confusion between past events and future hazard risks** | Explicit dual-mode separation: `Recorded` mode vs. `Forecast` mode with confidence badges and disclaimer banners. | Prevents users from misinterpreting modeled 1-year predictive projections as finalized historical facts. | **Implemented in prototype.** Forecast data is pre-computed synthetic data; no live ML inference engine is running. |
| **Inequitable or opaque compensation accounting** | Dynamic compensation calculations broken down by land classification (agri, homestead, pond, commercial) and payment status. | Clarifies disbursed, approved, and pending financial liabilities for affected citizens and administrators. | **Implemented in prototype.** Formulas follow documented rates; all monetary figures and owner names are fictional. |
| **Uncertain status of newly accreted islands and mudflats** | Dedicated Unowned Land cards for Char (`State Khas Alluvial Accretion`) and Coastal (`Unassigned Mudflats`). | Explicitly distinguishes private deeded lands from unassigned state-owned alluvial land blocks under Regulation XI of 1825. | **Implemented in prototype.** Accretion geometry is synthetic demonstration data. |

---

## Main Chapter B — How BhumiDorpon Helps People in Bangladesh

### B1. One Place to Explore Five Hazard Categories
BhumiDorpon eliminates the need to navigate multiple obscure portals. The application establishes a standardized **Cascading Selector Flow**:
$$\text{District} \longrightarrow \text{Upazila} \longrightarrow \text{River / Hill / Mouza} \longrightarrow \text{Event / Result Selection}$$

Whether a user is investigating riverbank collapse in Sirajganj, haor flooding in Sylhet, slope vulnerability in Rangamati, char evolution in the Jamuna riverbed, or coastal accretion in Bhola, the application responds with the same predictable, accessible, keyboard-navigable interaction model.

### B2. Map-Based Geographic Understanding
Maps are intuitive where tables are opaque. By rendering spatial features on a map:
- Users grasp the spatial extent of a disaster in seconds.
- A farmer can see that while their northern boundary was spared, their southern agricultural parcels were submerged under 1.8 meters of water.
- Administrative officials can immediately observe whether an active erosion strip is moving toward a public hospital, school, or regional embankment.

### B3. Hazard-Specific Exploration
A critical achievement of BhumiDorpon is that it rejects generic, one-size-fits-all cartography. Each hazard module renders tailored cartographic layers and authentic geographic extents:
- **River Erosion:** Displays active river channels, historical banklines, retreat vectors, and measured transect distances (e.g., *72m retreat*).
- **Flood Monitoring:** Displays multi-depth inundation contours (Shallow `<0.5m` in light blue, Moderate `0.5–1.5m` in medium blue, Deep `>1.5m` in dark navy) and color-codes plots by individual landowner.
- **Landslides:** Displays synthetic digital elevation models (DEM), hillshades, contour isolines, spot elevations, failure scarps (red outline), and debris runout accumulation buffers (orange hatch).
- **Char Islands:** Renders mid-channel sandbars with accretion tips highlighted in green, erosion flanks in coral, and unowned state khas land clearly delineated.
- **Coastal Erosion & Accretion:** Shows marine shorelines, tidal mudflats, and offshore accretion blocks seaward of established mouzas.

### B4. Comparison and Map Navigation
The primary comparison experience uses **Side-by-Side Map Synchronization**:
- **Desktop Layout:** The **Before** map is pinned on the left; the **After** (or **Forecast**) map is pinned on the right.
- **Geographic Synchronization:** Moving or zooming either map immediately synchronizes the paired map using Leaflet event listeners equipped with loop-prevention guards.
- **Basemap Switching:** Users can switch between **Light GIS** (clean vector theme with clear administrative labels) and **Satellite** (Esri World Imagery) without losing their active zoom, selected mouza, or thematic overlays.
- **Responsive Stacking:** On mobile viewports (e.g., 390px), the maps gracefully stack vertically (Before first, After second), while preserving full functionality and placing all supporting tables below the map pair.

### B5. Target Users and Practical Use Cases
- **Use Case 1: Displaced Citizen Checking Flood Impact**
  - *Actor:* Rahim Uddin, landowner in Jaflong, Sylhet.
  - *Goal:* Verify whether Dag No. 104 was submerged during the 2024 monsoon flood and obtain corner coordinates for boundary reconstruction.
  - *Steps in App:* Navigate to `/flood` &rarr; Select Sylhet &rarr; Gowainghat &rarr; Jaflong &rarr; Choose 2024 Flood Event &rarr; Locate Rahim Uddin in Owner Table &rarr; Click name to open `/flood/.../owner/...` &rarr; Inspect 4-corner GPS readout &rarr; Click "Copy 4 Corners".
  - *Result:* Rahim obtains the exact latitude/longitude coordinates (NW, NE, SE, SW) to provide to his local surveyor.
- **Use Case 2: Upazila Nirbahi Officer (UNO) Reviewing Erosion Compensation**
  - *Actor:* AC Land / UNO in Kazipur, Sirajganj.
  - *Goal:* Determine total pending compensation liabilities for citizens who lost homesteads along the Jamuna River.
  - *Steps in App:* Navigate to `/river-erosion` &rarr; Select Recorded mode &rarr; Sirajganj &rarr; Kazipur &rarr; Jamuna River &rarr; Mouza Khanshama &rarr; Review Mouza Summary Panel and Owner Compensation Table.
  - *Result:* Officer reviews total eroded area (in Decimals/Acres), number of displaced families, approved compensation sums, and pending disbursement balances.
- **Use Case 3: University Geography Student Studying Char Morphodynamics**
  - *Actor:* Environmental science undergraduate at a public university in Bangladesh.
  - *Goal:* Compare accretion versus erosion rates on Char Girish between baseline survey and current year.
  - *Steps in App:* Navigate to `/char` &rarr; Select Sirajganj &rarr; Kazipur &rarr; Jamuna &rarr; Char Girish &rarr; Toggle between Light GIS and Satellite basemap &rarr; Inspect net change metric (+14.2% accretion) &rarr; Review Unowned Khas Land card.
  - *Result:* Student visualizes how sandbar tips accumulate sediment downstream while western flanks erode under braided river currents.

### B6. Expected Benefits and Limitations
- **Expected Benefits:** Dramatically accelerates spatial understanding, reduces public confusion regarding disaster impact, provides an educational reference for deltaic processes, and models best practices for transparent public data presentation.
- **Explicit Limitations:** 
  - *The application does not prevent disasters or modify physical terrain.*
  - *It does not connect to live government databases or provide legally certified land records.*
  - *All demonstration data is fictional; coordinate readouts cannot be used for legal land titling without ground-truth cadastral surveying.*
  - *Visual comparison between synthetic polygons and real satellite tiles is illustrative and does not represent survey-accurate geospatial alignment.*

### B7. Problem-to-Feature-to-Benefit Table

| User Problem | Existing Project Feature | How the Feature Works | Expected Benefit | Limitations & Required Evidence |
|---|---|---|---|---|
| **Cannot see how riverbanks moved over time** | Side-by-side Before/After `GisMapCompare` | Synchronized Leaflet maps render baseline bankline on left and current bankline on right. | Direct, intuitive visual verification of riverbank encroachment without complex GIS software. | Synthetic demo bankline data; requires real multitemporal satellite vectorization in production. |
| **Lost boundary markers after haor flooding** | Flood Owner Land Page (`/flood/.../owner/...`) | Displays dedicated plot table with 4 distinct corner coordinates (NW, NE, SE, SW to 6 decimal places). | Landowners have unambiguous spatial reference points to locate plot corners on the ground. | Synthetic coordinates; requires official cadastral georeferencing to be legally binding. |
| **Uncertainty regarding compensation status** | Owner Compensation Table with Status Badges | Categorizes each affected owner with Dag No., Khatian No., lost area, estimated amount, and status (`Paid`, `Approved`, `Pending`). | Transparent accounting of compensation liabilities and disbursement progress. | Mock financial figures and fictional identities; real implementation requires land ministry integration. |
| **Confusing predictive models with historical facts** | Dual-mode toggle (`Recorded` vs. `Forecast`) with confidence indicators | In Forecast mode, disbursement fields (`Paid`, `Approved`, `Pending`) are strictly omitted; disclaimer banner is enforced. | Prevents misinformation; users clearly understand that forecast figures are tentative planning estimates. | Forecasts in demo are pre-computed mock records, not live deep-learning inference. |
| **Difficulty interpreting complex contour maps** | Landslide DEM Hillshade & Profile Overlays | Renders synthetic elevation hillshades, contour isolines, slope angles (38°–44°), and failure scarps. | Hilly terrain hazards are immediately legible to non-specialists through natural shadow and contour styling. | Synthetic DEM raster; production requires high-resolution LiDAR or ALOS PALSAR 12.5m DEM. |
| **Ambiguity over newly formed char ownership** | Dedicated Unowned Land (State Khas) Card | Isolates newly accreted sandbar land under deed `1/1 (State)` with explicit area metrics. | Clarifies that new alluvial accretions legally belong to the government before formal cadastral settlement. | Demo geometry; requires official settlement survey records (*Diara Survey*). |

---

## Main Chapter C — What Makes BhumiDorpon Different?

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          BhumiDorpon Architectural Differentiation                     │
├──────────────────────────────┬─────────────────────────────┬───────────────────────────┤
│    Standard Disaster Portals │   Official Land Records     │   BhumiDorpon Platform    │
├──────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ • Macro-scale bulletins      │ • Static paper/PDF records  │ • Micro-scale parcel maps │
│ • Abstract water level charts│ • No hazard intersection    │ • Hazard-cadastral overlay│
│ • No cadastral plot linkage  │ • No satellite visualization│ • Side-by-side comparison │
│ • Static aggregate numbers   │ • No temporal comparison    │ • 4-corner GPS readouts   │
│ • Generic country-wide maps  │ • Complex bureaucratic flow │ • Honest data provenance  │
└──────────────────────────────┴─────────────────────────────┴───────────────────────────┘
```

### C1. Unified Five-Hazard Focus
Most disaster monitoring tools in Bangladesh focus on a single domain: the Flood Forecasting and Warning Centre (FFWC) monitors flood levels; academic landslide portals monitor southeastern hill rainfall; erosion monitoring is published intermittently in technical reports by CEGIS. BhumiDorpon is unique in uniting all five land-altering hazards—**river erosion, floods, landslides, chars, and coastal changes**—under a single, standardized cartographic framework.

### C2. Hazard-Specific Geographic Context
Unlike generic dashboards that display a static, country-wide base map regardless of the query, BhumiDorpon enforces strict geographic relevance:
- Selecting **River Erosion** automatically bounds the viewport to the Jamuna River corridor in Kazipur, Sirajganj.
- Selecting **Landslides** centers the viewport over the tertiary hill slopes of Kawkhali, Rangamati.
- Selecting **Floods** frames the haor floodplain depression of Tahirpur / Jaflong.
- Selecting **Chars** targets dynamic mid-channel sandbars.
- Selecting **Coastal** targets the estuarine islands of the Bay of Bengal.

This ensures that the cartographic representation authentically reflects the physical environment under examination.

### C3. Map-Centered Cadastral Exploration
BhumiDorpon does not treat maps as decorative background illustrations. The map is the primary analytical instrument:
- Users inspect mouza boundaries, plot polygons, and hazard contours directly.
- The interface enforces high-contrast, light-mode cartography designed according to strict cartographic rules (scale bars, north arrows, graticules, locator insets, and mouza labels).
- Every visual feature on the map connects directly to the tabular data below it.

### C4. Comparison-Oriented Workflow
Temporal comparison is baked into the architecture. Rather than forcing users to flip between tabs or drag awkward swipe handles, the platform provides clean, **Side-by-Side Synchronized Maps**:
- Baseline (Before) and Post-Event/Projected (After) are visible simultaneously.
- Zooming into a specific plot on the Before map immediately zooms into that exact plot on the After map.
- Users can toggle basemaps between Light GIS and Satellite imagery while preserving their geographic location and active overlays.

### C5. Transparency and Limitations as Core Strengths
In an era where software presentations frequently exaggerate their capabilities, BhumiDorpon distinguishes itself through **radical honesty**:
- Every page prominently displays a sticky amber banner: *"Demo data: all names, plots and figures are fictional."*
- When real-world satellite tiles are active behind synthetic polygons, the map displays a persistent warning: *"Demo geometry — not survey-accurate."*
- Forecast views explicitly state: *"This is a model-based estimate, not an official government record."*
- Disbursement fields (`Paid`, `Approved`, `Pending`) are strictly suppressed in Forecast mode to prevent premature financial assumptions.

### C6. Comparison with Other Solutions
The following table provides an objective comparison between BhumiDorpon and existing public and institutional systems in Bangladesh:

| Evaluation Criteria | Flood Forecasting & Warning Centre (FFWC) | National Land Record Portals (e-Porcha / DLRS) | CEGIS Morphological Reports | BhumiDorpon (Current Prototype) |
|---|---|---|---|---|
| **Hazard Coverage** | Riverine and flash flooding only. | None (static cadastral records only). | River erosion and char morphodynamics (specialized studies). | **Five hazards unified** (River erosion, flood, landslide, char, coastal). |
| **Cadastral Plot Linkage** | None. Reports station water levels. | Yes, displays khatian and plot search. | Minimal. Aggregates mouza-level statistics. | **Direct parcel overlay** (Dag No., Khatian No., 4-corner GPS readouts). |
| **Interactive Map Comparison** | Static GIS maps and hydrographs. | Static cadastral sheet images (*porcha*). | Technical GIS maps in PDF format. | **Synchronized side-by-side Before/After maps.** |
| **Basemap Switching** | Fixed static base layers. | None (scanned raster sheets). | Fixed satellite composite figures. | **Interactive Light GIS and Satellite (Esri) switcher.** |
| **Forward Projections** | 1–5 day hydrological water level forecasts. | None. | Annual erosion vulnerability forecasts. | **1-year simulated spatial projections with uncertainty bands.** |
| **Four-Corner GPS Coordinates** | None. | None (requires physical chain survey). | None. | **Implemented for individual owner plots (6 decimal places).** |
| **Current Data Provenance** | Official real-time telemetry stations. | Official government land archives. | Official satellite imagery and hydrographic surveys. | **Deterministic, synthetic mock data for demonstration.** |
| **System Maturity** | Operational government system. | Operational government system. | Operational research consultancy. | **Academic / hackathon demonstration web application.** |

---

## 8. Key Features and Hazard Modules

### 8.1 Home Dashboard (`/`)
- **National Overview KPI Cards:** Dynamically aggregates total land loss (in Decimals/Acres/Hectares), total new land gained, affected landowner counts, and compensation liabilities.
- **Dual-Mode Filtering:** Top-level toggle between `Recorded` and `Forecast` modes. In Forecast mode, all disbursed/paid compensation metrics are dynamically stripped in compliance with platform rules.
- **Trend and Distribution Visualizations:** Multi-year line chart displaying historical erosion losses versus accretion gains; target hazard breakdown bar charts; ranked list of most severely impacted districts.
- **Quick-Access Hazard Cards:** Direct navigation cards for all five hazard modules.

### 8.2 River Erosion Module (`/river-erosion`)
- **Cascading Selector:** District &rarr; Upazila &rarr; River &rarr; Riverside Mouzas &rarr; Detailed Mouza View.
- **Cartographic Overlays:** Surveyed baseline bankline (cyan/dark slate), current bankline (coral), bank retreat loss strip, river transects showing exact retreat distance in meters, and mouza boundary borders.
- **Context & Summaries:** Mouza-wise loss summary panel, Water Status card (river width, erosion velocity, discharge tendency), and affected owner compensation registry.

### 8.3 Flood Monitoring Module (`/flood`)
- **Single Archive Flow:** District &rarr; Upazila &rarr; Mouza (+ optional Year chip filters: 2022–2025).
- **Archive Event List:** Displays historical flood events categorized by severity (`Moderate`, `Severe`, `Extreme`), flooded area, maximum water depth, and duration.
- **Multi-Depth Flood Detail Map:** Renders inundation extents categorized into three distinct depth tiers: Shallow (`<0.5m`), Moderate (`0.5–1.5m`), and Deep (`>1.5m`), alongside drainage channels and water bodies (*beels*).
- **Owner Land Page (`/flood/[mouzaId]/[floodId]/owner/[ownerId]`):** Dedicated individual landowner profile spotlighting all owned plots, submersion status, depth class, and **explicit 4-corner boundary coordinates (Corner 1 NW, 2 NE, 3 SE, 4 SW to 6 decimal places)** with instant "Copy 4 Corners", "Copy All Coordinates", and "Download GeoJSON" actions.

### 8.4 Landslide Hazards Module (`/landslide`)
- **Cascading Selector:** District &rarr; Upazila &rarr; Hill Corridor &rarr; Recorded Event / Forecast Event.
- **Cartographic Overlays:** Synthetic DEM elevation shading, 10-meter contour isolines, spot elevation heights, failure scarp polygons (red), debris runout accumulation buffers (orange), vulnerable road corridors, and mountain streams.
- **Geotechnical Metrics:** Slope angle readouts (38°–44°), displaced soil volume calculation ($45,200\text{ m}^3$ recorded / $62,800\text{ m}^3$ forecast), trigger rainfall metrics (mm/24h), and Terrain Context panel.

### 8.5 Char Islands Module (`/char`)
- **Cascading Selector:** District &rarr; Upazila &rarr; River &rarr; Char Island &rarr; Detailed Result.
- **Cartographic Overlays:** Baseline island shape vs. current island shape, downstream accretion tips (green), flanking erosion zones (coral), and river channel corridors.
- **Dedicated Unowned Land Card:** Special card highlighting `State Khas Alluvial Accretion` under deed `1/1 (State)` with total unassigned land area metrics.

### 8.6 Coastal Erosion & Accretion Module (`/coastal`)
- **Cascading Selector:** District &rarr; Upazila &rarr; Mouzas including "Unassigned new land" entries.
- **Cartographic Overlays:** Historical marine shoreline, current shoreline, coastal embankment lines, intertidal mudflats, and marine depth contours.
- **Dedicated Unassigned Mudflats Card:** Catalogs emerging intertidal land blocks seaward of established mouzas for future administrative settlement.

### 8.7 Settings and Platform Information (`/settings`)
- **Settings Hub (`/settings`):** Minimalist settings dashboard presenting exactly two verified options:
  1. **About Project (`/settings/about`):** Detailed factual explanation of the platform's purpose, hazard modules, side-by-side map comparison mechanics, dual basemaps, and data transparency disclosures.
  2. **Team Information (`/settings/team`):** Official development team metadata:
     - **Team Name:** GeoNeural
     - **Team Leader:** Pantho Raj Biswas
     - **Team Member:** Puja Paul
     - **Copyright:** © 2026 GeoNeural. All rights reserved.

---

## 9. How the System Works

### 9.1 High-Level Technical Architecture
BhumiDorpon is architected as a modern, client-side rendered Single Page Application (SPA) built upon **Next.js 14 App Router**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Web Browser (Client)                       │
├────────────────────────────────────────────────────────────────────────┤
│ • Next.js App Router Pages (`/app/...`)                                │
│ • React UI Components (Radix UI, Lucide Icons, Recharts)               │
│ • Interactive Mapping Engine (Leaflet 1.9.4 + react-leaflet 4.2.1)     │
│ • State Management (Zustand: `appStore`, `useLayerStore`)              │
│ • Data Caching & Asynchronous Loading (TanStack React Query 5.59)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Typed Mock Data Layer (`lib/data.ts`)               │
├────────────────────────────────────────────────────────────────────────┤
│ • Simulated Network Latency (200–400ms delay for loading skeletons)   │
│ • Dynamic In-Memory Filtering & Aggregation Functions                  │
│ • Turf.js Polygon Intersection & Coordinate Calculations               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Static Relational JSON Datasets (`/mocks`)           │
├────────────────────────────────────────────────────────────────────────┤
│ • `summary.json`, `districts.json`, `upazilas.json`, `mouzas.json`     │
│ • `river_erosion.json`, `flood.json`, `landslide.json`                 │
│ • `char.json`, `coastal.json`, `plots.json`, `owners.json`             │
│ • Deterministically regenerated via `npm run generate:mocks`          │
└────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Data Flow from Interaction to Rendered View
1. **Selection:** The user selects an administrative tier (e.g., District = *Sirajganj*).
2. **Query:** `useSelection` hook triggers a query through TanStack React Query to `lib/data.ts:getOptions(...)`.
3. **Filtering:** The mock data layer filters `upazilas.json` for records matching `districtId === "dist_sirajganj"`, returning valid child options with `hasRecords = true` indicators.
4. **Result Fetching:** When the final mouza or event is selected, `lib/data.ts:getResult(...)` or `getFlood(...)` loads the corresponding hazard geometry, cadastral plot records, and owner compensation figures.
5. **Map Initialization:** `GisMapCompare` mounts two synchronized Leaflet map instances (Before and After), sets viewports to the hazard's predefined bounding box, creates dedicated Leaflet panes, and injects SVG patterns.
6. **Overlay Rendering:** Vector GeoJSON layers (mouza borders, riverlines, inundation polygons, plot boundaries) are rendered over the selected base layer (Light GIS or Esri World Imagery).
7. **Table Presentation:** Tabular data (owner registries, coordinates, compensation amounts) renders beneath the map pair with search, sorting, and CSV/GeoJSON export controls.


---

## 10. Deep Learning Component and Model-Assisted Analysis

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        BhumiDorpon Deep Learning & Model-Assisted Architecture                         │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Earth Observation Inputs       2. Spatiotemporal DL Models            3. Cadastral Spatial Coupling │
│ ┌──────────────────────────────┐  ┌───────────────────────────────────┐  ┌───────────────────────────┐ │
│ │ • Sentinel-2 Multi-Spectral  │  │ • Multitemporal ConvLSTM          │  │ • 4-Corner Plot Polygons  │ │
│ │ • Sentinel-1 SAR (Radar)     │─►│ • Spatiotemporal U-Net            │─►│ • Dag & Khatian Registers │ │
│ │ • ALOS PALSAR 12.5m DEM      │  │ • Topographic Slope GNNs          │  │ • Turf.js Intersections   │ │
│ │ • CHIRPS Daily Precipitation │  │ • Morphological Stability Index   │  │ • Projected Losses (Dec)  │ │
│ └──────────────────────────────┘  └───────────────────────────────────┘  └─────────────┬─────────────┘ │
│                                                                                        │               │
│                                                                                        ▼               │
│ 4. Verification & Guardrails      5. Domain-Specific Symbology           6. Responsible Delivery       │
│ ┌──────────────────────────────┐  ┌───────────────────────────────────┐  ┌───────────────────────────┐ │
│ │ • Suppression of Paid/Status │  │ • Dashed Projected Banklines      │  │ • Web Dashboard & Leaflet │ │
│ │ • "Forecast" Disclaimer Badge│◄─│ • Uncertainty Prediction Bands    │◄─│ • CSV / GeoJSON Exports   │ │
│ │ • Deterministic Mock Harness │  │ • Geotechnical Runout Buffers     │  │ • Planning Advisory Use   │ │
│ └──────────────────────────────┘  └───────────────────────────────────┘  └───────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 10.1 Conceptual Definition: What Deep Learning Means in BhumiDorpon

In the context of BhumiDorpon, **Deep Learning (DL)** does not refer to generative text completion, conversational chatbots, or synthetic artistic imagery. Rather, it represents a specialized branch of **applied geospatial artificial intelligence (GeoAI) and spatiotemporal sequence modeling** engineered to analyze multitemporal Earth Observation (EO) satellite imagery, digital elevation rasters, and hydrological time series to forecast physical land-surface changes across Bangladesh.

Fundamentally, Deep Learning in BhumiDorpon bridges two historically disconnected data paradigms:
1. **Macro-Level Geomorphological Dynamics:** Continuous, fluid spatial processes—such as riverbank migration along braided rivers, slope instability in tertiary hills, and mudflat accretion in coastal estuaries—captured by satellite remote sensing.
2. **Micro-Level Cadastral Land Tenure:** Discrete, human-defined cadastral plots designated by legal deed numbers (*Dag No.* and *Khatian No.*), four-corner GPS coordinates, and registered private or state ownership.

Mathematically, the deep learning component can be formulated as a spatio-temporal predictive function $f_\theta$ parameterized by learnable network weights $\theta$:

$$\widehat{\mathbf{Y}}_{t+1} = f_\theta\left(\mathbf{X}_{t-k}, \mathbf{X}_{t-k+1}, \dots, \mathbf{X}_t \,;\, \mathbf{Z}_{\text{static}}\right)$$

Where:
- $\mathbf{X}_\tau \in \mathbb{R}^{H \times W \times C}$ represents multispectral or synthetic aperture radar (SAR) feature rasters at historical time step $\tau \in \{t-k, \dots, t\}$.
- $\mathbf{Z}_{\text{static}} \in \mathbb{R}^{H \times W \times M}$ represents static terrain covariates, including Digital Elevation Models (DEM), slope gradients, plan/profile curvature, and long-term river bathymetry.
- $\widehat{\mathbf{Y}}_{t+1}$ denotes the predicted binary or multi-class hazard probability envelope at forward time horizon $t+1$ (e.g., 1-year forward shoreline position, landslide rupture footprint, or flood depth mask).

Once the hazard probability envelope $\widehat{\mathbf{Y}}_{t+1}$ is vectorized into spatial polygons $\mathcal{H}_{\text{forecast}}$, it is coupled directly to the cadastral cadastral plot layer $\mathcal{P} = \{P_1, P_2, \dots, P_n\}$ via spatial computational geometry:

$$\Delta \text{Area}_i = \text{Area}\left(P_i \cap \mathcal{H}_{\text{forecast}}\right)$$

$$\text{Compensation}_i^{\text{projected}} = \Delta \text{Area}_i \times \text{Rate}\left(\text{LandClass}_i\right)$$

This mathematical coupling allows BhumiDorpon to transform high-dimensional satellite imagery into **actionable, plot-by-plot risk assessments** that directly inform vulnerable citizens and land revenue administrators.

---

### 10.2 Technical Relevance: Why Deep Learning is Essential for the Bengal Delta

The Bengal Delta is one of the most hydro-morphologically dynamic and complex environments on Earth. Traditional spatial analysis methods—such as static cartographic overlay, manual visual interpretation, or simple linear extrapolation of historical banklines—consistently fail to capture the reality of land change in Bangladesh due to several fundamental characteristics:

1. **Severe Non-Linearity and Morphological Inertia:** Riverbank retreat along braided river systems like the Jamuna or Lower Meghna is not a linear function of time. A river reach may remain relatively stable for three consecutive dry seasons, only to migrate 200 meters westward during a single high-discharge monsoon flood pulse due to upstream thalweg avulsion, turbulent eddy scouring, and bar chute cut-offs. Deep learning architectures (specifically convolutional recurrent networks) are capable of modeling such non-linear threshold behaviors and temporal lags that conventional linear models miss.
2. **High-Dimensional Multimodal Remote Sensing:** Satellite Earth Observation produces vast quantities of heterogeneous data, including optical multispectral bands (Sentinel-2, Landsat), all-weather Synthetic Aperture Radar backscatter (Sentinel-1 SAR C-band), digital surface elevation models (ALOS PALSAR 12.5m, SRTM), and gridded rainfall estimates (CHIRPS). Handcrafted heuristics cannot scale across these multi-sensor streams. Deep convolutional encoders automatically extract hierarchical spatial patterns—such as sandbar texture, moisture saturation gradients, and structural slope fracture lineaments—without manual feature engineering.
3. **Pervasive Monsoon Cloud Cover:** During the peak monsoon season (June to September)—precisely when river erosion, flash floods, and landslides occur—optical satellite imagery is obscured by persistent cloud cover (>85% cloud obstruction). Traditional optical vegetation/water indices (NDVI, NDWI) become useless. Deep learning models trained on co-registered SAR radar backscatter ($VV/VH$ polarization amplitude and interferometric coherence) can penetrate cloud cover and rainstorms, reconstructing surface inundation and shoreline boundaries regardless of atmospheric conditions.
4. **Transition from Retrospective Reporting to Anticipatory Preparedness:** Traditional land administration in Bangladesh is entirely retrospective: damage is surveyed months after an embankment collapses, when fields are already submerged beneath meters of water. Deep learning provides a computational mechanism to generate probabilistic 1-year forward hazard projections, enabling anticipatory evacuation, targeted geo-bag fortification, and proactive compensation budgeting.

---

### 10.3 Verifiable Implementation Analysis: How the Current Prototype Actually Works

To maintain absolute technical integrity, it is essential to distinguish between the **conceptual architecture** of BhumiDorpon and what is **verifiably implemented in the current v1.1 demonstration codebase**:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           BhumiDorpon v1.1 Prototype Implementation Reality                           │
├───────────────────────────────────────────┬───────────────────────────────────────────────────────────┤
│ Concept / UI Presentation                 │ Verified Codebase Implementation                          │
├───────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ • Model Banner: "GeoAI-BD v2.4 •          │ • Deterministic, pre-generated JSON mock files in /mocks  │
│   Multitemporal ConvLSTM"                 │ • Seeded pseudo-random generation in generate-mocks.ts    │
│ • "Deep Learning Model" Forecast Badges   │ • In-memory asynchronous data loaders in lib/data.ts      │
│ • 1-Year Projected Riverbank Retreat      │ • Turf.js computational geometry polygon intersections    │
│ • Topographic DEM Slope Rupture Zones     │ • Synchronized Leaflet 1.9.4 map compare viewports        │
│ • Projected Compensation Liabilities      │ • Zero external ML dependencies (no PyTorch/TF in package)│
└───────────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```

#### 1. Codebase Dependency Inspection
Inspection of `package.json` confirms that the current application is a client-side web application built with **Next.js 14.2, React 18.3, Leaflet 1.9.4, react-leaflet 4.2.1, TanStack React Query 5.59, and Turf.js 7.4**. 

There are **no active neural network runtimes** (such as TensorFlow.js, ONNX Runtime Web, PyTorch C++ bindings, or scikit-learn backend microservices) executing live inference in the demonstration build. All computational resources on the client are dedicated to UI state management, cartographic rendering, and vector geometry calculations.

#### 2. Deterministic Mock Generation (`scripts/generate-mocks.ts`)
The forecast hazard scenarios displayed in the application are generated deterministically offline using computational geometry algorithms implemented in `scripts/generate-mocks.ts`:
- **Riverbank Retreat Line:** Generated using sinusoidal mathematical functions with localized noise offsets (`lonForecast = lonAfter - retreatLon * 0.7`), forming a dashed vector line representing projected shoreline migration.
- **Uncertainty Band:** Constructed by closing the polygon between the current bankline (`riverAfterCoords`) and the projected retreat line (`riverForecastCoords`), producing an uncertainty polygon buffer (`uncertaintyBandCoords`).
- **Cadastral Plot Intersections:** Generated using Turf.js spatial operations:
  ```typescript
  // scripts/generate-mocks.ts (Lines 816-823)
  const plotFeature = turf.polygon(plot.polygon);
  const intersection = turf.intersect(
    turf.featureCollection([plotFeature, forecastLossPolygonFeature])
  );
  if (intersection) {
    const areaSqM = turf.area(intersection);
    const areaDec = Number((areaSqM / 40.4686).toFixed(1));
    // Calculate projected compensation without disbursement status
  }
  ```
- **Landslide Topography:** Synthesized from 2D Gaussian elevation distributions to generate synthetic DEM rasters, contour lines, teardrop failure scarps, and 50m settlement runout risk buffers.
- **Char & Coastal Accretion:** Synthesized through coordinate offsets simulating downstream sand deposition and intertidal mudflat formation seaward of registered mouzas.

#### 3. Strict Architectural Data Isolation
A core architectural principle of BhumiDorpon is the strict separation between historical ground-truth records and model-based forward forecasts. In accordance with project build rules:
- In `Recorded` mode, owner tables display historical metrics: `Est. compensation (৳)`, `Status` (`Paid`, `Approved`, `Pending`), and `Paid (৳)`.
- In `Forecast` mode, all payment status flags, progress bars, and disbursement figures are **strictly eliminated** from both UI components and data payloads in `lib/data.ts`. The interface displays exclusively `Projected compensation (৳)` and `Projected area (Dec)`.
- Every forecast view is visually anchored by the `ForecastBadge` (`components/ForecastBadge.tsx`) and a mandatory sticky disclaimer banner: *"This is a model-based estimate, not an official government record. Model: GeoAI-BD v2.4 • Multitemporal ConvLSTM."*

---

### 10.4 Hazard-Specific Model-Assisted Analysis Across the Five Domains

BhumiDorpon structures model-assisted analysis across five distinct environmental hazards, each governed by different physical mechanisms and requiring tailored machine learning paradigms:

```
                                  ┌─────────────────────────────────────────────────────────────┐
                                  │      Spatiotemporal Model Applications by Hazard Domain     │
                                  └──────────────────────────────┬──────────────────────────────┘
                                                                 │
          ┌───────────────────────┬──────────────────────────────┼──────────────────────────────┬─────────────────────────┐
          ▼                       ▼                              ▼                              ▼                         ▼
┌──────────────────┐    ┌──────────────────┐          ┌───────────────────┐          ┌──────────────────┐      ┌──────────────────┐
│  River Erosion   │    │ Flood Inundation │          │  Landslide Slope  │          │  Char Accretion  │      │ Coastal Shoreline│
├──────────────────┤    ├──────────────────┤          ├───────────────────┤          ├──────────────────┤      ├──────────────────┤
│ ConvLSTM /       │    │ Multitemporal    │          │ Topographic GNN / │          │ Recurrent U-Net  │      │ Estuarine Wave   │
│ PredRNN          │    │ SAR Segmentation │          │ Gradient Boosted  │          │ NDVI / MNDWI     │      │ & Tidal Dynamics │
├──────────────────┤    ├──────────────────┤          ├───────────────────┤          ├──────────────────┤      ├──────────────────┤
│ 1-Year bankline  │    │ Depth classes    │          │ Rupture scarp     │          │ Silt emergence & │      │ Shoreline retreat│
│ retreat vector & │    │ (<0.5m, 0.5-1.5m,│          │ & 50m settlement  │          │ vegetative sand  │      │ & unassigned     │
│ uncertainty cone │    │ >1.5m) + runoff  │          │ runout buffer     │          │ stabilization    │      │ mudflat growth   │
└──────────────────┘    └──────────────────┘          └───────────────────┘          └──────────────────┘      └──────────────────┘
```

#### 10.4.1 River Erosion (`/river-erosion`)
- **Physical Process:** Lateral riverbank collapse driven by alluvial sediment liquefaction, thalweg migration, and outer meander bend hydraulic scouring along braided channels (Jamuna, Padma, Meghna).
- **Target Deep Learning Architecture:** Spatiotemporal Convolutional Recurrent Neural Networks (such as **ConvLSTM** or **PredRNN**) trained on 30-year multitemporal satellite time series (Landsat 5/7/8/9 and Sentinel-2) from 1990 to 2025.
- **Input Feature Covariates:** Historical bankline coordinates, river curvature index, daily upstream discharge ($Q_{\text{max}}$ at Bahadurabad / Hardinge Bridge), channel bathymetry rasters, and sediment shear stress.
- **Model Output:** A predicted 1-year forward riverbank retreat vector with an associated probabilistic uncertainty band (e.g., 85% confidence interval).
- **Current Prototype Status:** Fully modeled in the frontend via pre-computed synthetic geometries; Leaflet maps render baseline banklines, current retreated shorelines (coral hatch), transect retreat markers (e.g., `72 m`), and dashed projected retreat envelopes with uncertainty buffers.

#### 10.4.2 Flood Monitoring (`/flood`)
- **Physical Process:** Rapid monsoon riverine inundation and transboundary flash flooding across northeastern haor depressions (Sylhet, Sunamganj) and central floodplains, resulting in prolonged agricultural submersion.
- **Target Deep Learning Architecture:** Fully Convolutional Segmentation Networks (**Spatiotemporal U-Net** or **HRNet**) processing dual-polarization Sentinel-1 Synthetic Aperture Radar (SAR) Ground Range Detected (GRD) imagery.
- **Input Feature Covariates:** SAR backscatter coefficients ($\sigma_{VV}^0, \sigma_{VH}^0$), interferometric coherence, high-resolution Digital Elevation Models (DEM), river stage telemetry from BWDB stations, and 72-hour antecedent rainfall.
- **Model Output:** Pixel-level water depth classification categorized into three distinct tiers: Shallow (`<0.5m`), Moderate (`0.5–1.5m`), and Deep (`>1.5m`), along with flood recession velocity projections.
- **Current Prototype Status:** Implemented as a comprehensive historical archive (2022–2025 events) detailing mouza-scale multi-depth inundation and **explicit 4-corner GPS coordinates (NW, NE, SE, SW to 6 decimal places)** for individual owner plots. Forward real-time flood prediction represents planned operational scope.

#### 10.4.3 Landslides (`/landslide`)
- **Physical Process:** Sudden slope failure, rotational slips, and mudflows triggered by intense monsoonal downpours saturating deforested tertiary hill soils in southeastern Bangladesh (Rangamati, Bandarban, Cox's Bazar).
- **Target Deep Learning Architecture:** **Graph Neural Networks (GNNs)** combined with **Spatial Random Forests / XGBoost** operating on topological terrain mesh networks and convolutional slope feature extractors.
- **Input Feature Covariates:** Synthetic and LiDAR Digital Elevation Models (DEM), slope angle ($38^\circ\text{–}44^\circ$), aspect, plan curvature, soil profile texture, road cuts, and real-time CHIRPS precipitation intensity (mm/24h).
- **Model Output:** Slope rupture scarp demarcation, mass displacement volume calculations ($m^3$), and dynamic debris runout settlement risk buffers (e.g., 50-meter human settlement hazard zones).
- **Current Prototype Status:** Fully interactive in prototype; renders DEM hillshades, 10m contour isolines, failure scarp polygons (red outline), debris runout accumulation buffers (orange hatch), and geotechnical risk cards.

#### 10.4.4 Char Formation and Erosion (`/char`)
- **Physical Process:** The dynamic accretion, mid-channel emergence, morphological migration, and eventual dissolution of alluvial sandbars (*chars*) in active braided river systems under extreme sediment flux (>1 billion tons/year).
- **Target Deep Learning Architecture:** **Recurrent U-Net Semantic Segmentation** coupled with multitemporal vegetative index autoencoders.
- **Input Feature Covariates:** Multi-spectral Sentinel-2 bands, Normalized Difference Vegetation Index (NDVI) time-series, Modified Normalized Difference Water Index (MNDWI), sediment concentration plumes, and seasonal dry-season composite mosaics.
- **Model Output:** Char classification delineating active accretion tips (land gain), eroded flanking channels (land loss), vegetation colonization stability scores, and isolation of newly accreted state-owned *khas* land.
- **Current Prototype Status:** Implemented with side-by-side synchronized Leaflet maps displaying baseline vs current/forecasted sandbar shapes, green accretion tips, coral erosion zones, and dedicated `Unowned Land (State Khas Alluvial Accretion)` deed cards (`1/1 State`).

#### 10.4.5 Coastal Erosion and Land Formation (`/coastal`)
- **Physical Process:** Marine shoreline retreat, cyclone storm surge inundation, tidal channel migration, and estuarine intertidal mudflat accretion along the Bay of Bengal coastline (Bhola, Hatiya, Noakhali, Cox's Bazar).
- **Target Deep Learning Architecture:** Multi-Scale Convolutional LSTM networks coupled with **Estuarine Hydrodynamic Wave-Tide Surrogates**.
- **Input Feature Covariates:** Multi-decadal tidal gauge sequences, sea-surface temperature anomalies, bathymetric gradient profiles, coastal polder embankment locations, mangrove greenbelt buffer indices, and marine sediment plumes.
- **Model Output:** 1-to-5 year coastal shoreline migration vectors, storm surge vulnerability envelopes, and demarcation of unassigned offshore intertidal mudflats.
- **Current Prototype Status:** Implemented with side-by-side Before/After coastal viewports, shoreline retreat overlays, mangrove buffer strips, and dedicated `Unassigned Mudflats` cards cataloging emerging virtual cadastral blocks seaward of established mouzas.

---

### 10.5 Synthesis Table: Deep Learning Model Architecture by Hazard

The following comparative table synthesizes the deep learning characteristics across all five hazard categories, clearly delineating between proposed production architectures and verified prototype capabilities:

| Hazard Category | Physical Trigger Mechanism | Proposed Deep Learning Architecture | Input Remote Sensing Covariates | Generated Hazard Output | Current Prototype Implementation Status |
|---|---|---|---|---|---|
| **River Erosion** (`/river-erosion`) | Hydraulic shear scour, thalweg migration, alluvial bank collapse | **Multitemporal ConvLSTM / PredRNN** | Landsat/Sentinel-2 time series (1990–2025), river curvature, BWDB discharge | Projected 1-year retreat vector + uncertainty prediction cone | **Verified in Prototype:** Leaflet Before/After map, dashed retreat line, Turf.js plot intersections, projected compensation |
| **Flood Monitoring** (`/flood`) | Transboundary river discharge, extreme monsoon downpour, haor ponding | **Spatiotemporal U-Net / HRNet** | Sentinel-1 SAR ($VV/VH$), DEM elevation, river telemetry, CHIRPS rainfall | Inundation depth masks (<0.5m, 0.5–1.5m, >1.5m), drainage channels | **Verified in Prototype:** Multi-depth flood detail map, historical 2022–2025 archive, 4-corner GPS plot boundary readouts |
| **Landslides** (`/landslide`) | Soil pore-water saturation on steep deforested tertiary slopes | **Topographic GNN + Gradient Boosted Trees** | ALOS PALSAR 12.5m DEM, slope angle ($38^\circ\text{–}44^\circ$), 72h rainfall | Rupture scarp boundaries, soil displacement volume ($m^3$), 50m runout buffer | **Verified in Prototype:** Synthetic DEM hillshade overlay, contour lines, scarp polygons, debris runout buffers, geotechnical cards |
| **Char Islands** (`/char`) | Fluvial sediment deposition, braided bar chute cut-offs, bank erosion | **Recurrent Semantic U-Net** | Sentinel-2 multispectral, NDVI vegetation time-series, MNDWI water index | Sandbar accretion tips, erosion flanks, vegetation stabilization index | **Verified in Prototype:** Synchronized baseline vs current island shapes, green accretion tips, unowned khas deed cards |
| **Coastal Shifts** (`/coastal`) | Semi-diurnal tides, cyclone surge waves, estuarine sediment plumes | **Estuarine Hydrodynamic ConvLSTM** | Tidal harmonics, wave vectors, bathymetric slope, coastal polder vectors | Marine shoreline retreat, polder breach risk, emerging intertidal mudflats | **Verified in Prototype:** Coastal Leaflet map, shoreline migration vectors, mangrove buffers, unassigned new mudflat cards |

---

### 10.6 Human Impact: Why Predictive Spatial Intelligence Matters in Bangladesh

In Bangladesh, land is not merely a financial asset—it is the indispensable foundation of human survival, household identity, social dignity, and intergenerational security. In a delta supporting over 1,100 citizens per square kilometer, the sudden loss of a homestead or agricultural plot plunges an entire family into catastrophic landlessness and permanent poverty.

Model-assisted deep learning analysis fundamentally alters the human reality of environmental hazards by transforming disaster response from **reactive post-disaster compensation** into **proactive anticipatory resilience**:

```
Traditional Reactive Disaster Relief              BhumiDorpon Anticipatory Spatial Intelligence
┌──────────────────────────────────────────┐      ┌──────────────────────────────────────────┐
│ • Riverbank collapses unexpectedly       │      │ • Model projects 1-year retreat envelope │
│ • Homestead swallowed into riverbed      │      │ • Landowner alerted 6 months in advance  │
│ • Assets destroyed; family displaced     │ ───► │ • Family dismantles house & salvages tin │
│ • Bitter disputes over washed-away ails  │      │ • Plots georeferenced by 4-corner GPS    │
│ • Delayed relief surveyed after months   │      │ • AC Land pre-allocates khas safety land │
└──────────────────────────────────────────┘      └──────────────────────────────────────────┘
```

1. **Advance Asset Salvage and House Dismantling:** In rural Bangladesh, homestead structures are constructed from corrugated iron sheets (*tin*), timber beams, and masonry plinths. When riverbank collapse is predicted 6 to 12 months in advance, families can systematically dismantle their homes, salvage expensive building materials, relocate livestock, and preserve household wealth before the land collapses.
2. **Agricultural Investment Protection:** Tenant farmers often invest their entire seasonal savings into fertilizer, seed paddy (Boro/Aman), and irrigation diesel. Knowing whether a char island or riverbank parcel faces an 85% probability of severe monsoon scouring enables farmers to adjust crop cycles, avoid debt traps, and lease safer inland plots.
3. **Mitigating Land Tenure Conflict (*Ail* Disputes):** When floodwaters recede or rivers deposit new silt, physical boundary markers (*ails*) are obliterated. By establishing verified, plot-specific four-corner GPS coordinates (Corner 1 NW, 2 NE, 3 SE, 4 SW to 6 decimal places), model-assisted cadastral systems provide objective spatial reference points that prevent violent boundary clashes with local land grabbers (*lathials*).

---

### 10.7 Stakeholder-Specific Benefits and Practical Value

Model-assisted spatial analysis generates distinct, high-value outcomes for each key stakeholder group operating across Bangladesh’s land and disaster ecosystem:

#### 1. Vulnerable Homestead Owners & Rural Citizens
- **Pre-Disaster Awareness:** Visual inspection of whether their specific ancestral plot (by Dag No.) lies within an active erosion cone or landslide debris runout buffer.
- **Accurate Boundary Recovery:** Access to unambiguous four-corner GPS coordinates to physically re-stake plot corners after floodwaters recede.
- **Financial Clarity:** Transparent understanding of estimated rehabilitation compensation rates based on official land classification schedules.

#### 2. Tenant Farmers & Agricultural Communities
- **Seasonal Risk Assessment:** Insight into projected inundation depth classes (Shallow vs Deep) and char sandbar stability before making seasonal farming commitments.
- **Soil Siltation Estimates:** Understanding whether receding floodwaters will leave fertile alluvial topsoil (*poli mati*) or sterile sand splays (*balu mati*).

#### 3. Local Land Administration (Assistant Commissioners of Land, Kanungos, Surveyors)
- **Proactive Compensation Budgeting:** Deriving aggregate upazila compensation liabilities prior to disaster onset, facilitating timely budget requisitions to the Ministry of Land.
- **State Khas Land Demarcation:** Automatic identification of newly accreted alluvial islands and unassigned coastal mudflats under Regulation XI of 1825, preventing illegal private encroachment.
- **Dispute Resolution Evidence:** Providing objective, multitemporal cartographic evidence during land settlement hearings and boundary rectification arbitrations.

#### 4. Disaster Risk Reduction (DRR) Specialists & Humanitarian Coordinators
- **Targeted Fortification:** Prioritizing emergency geo-bag deployment, structural revetments, and polder repairs at exact transect points exhibiting maximum predicted erosion velocity.
- **Shelter Siting:** Ensuring cyclone and flood shelters are constructed outside projected 5-year hazard vulnerability zones.

#### 5. Academic Geomorphologists & Remote Sensing Researchers
- **Deltaic Process Evaluation:** Evaluating theoretical bedload and sediment transport equations against empirical, satellite-derived morphological changes.
- **Algorithm Benchmarking:** Comparing machine learning architectures against ground-truth field surveys in hyper-dynamic fluvial environments.

---

### 10.8 Ordinary Map Visualization vs. Model-Assisted Analysis

To appreciate the architectural significance of BhumiDorpon, one must understand how **model-assisted analysis** differs fundamentally from **ordinary map visualization**:

| Analytical Dimension | Ordinary Map Visualization (Static Web GIS) | Model-Assisted Analysis (BhumiDorpon Vision) |
|---|---|---|
| **Temporal Horizon** | Strictly retrospective: Displays what happened in the past or what exists at the exact moment of survey. | Forward-looking and inferential: Projects hazard boundaries and land changes 1 to 5 years into the future. |
| **Analytical Depth** | Purely descriptive: Renders visual vector layers and raster tiles without modeling causal dynamics. | Quantitative and diagnostic: Computes velocities, displacement volumes, slope shear thresholds, and depth bands. |
| **Cadastral Coupling** | Disconnected: Hazard maps show general administrative boundaries; cadastral sheets remain separate paper archives. | Deeply integrated: Hazard prediction polygons intersect directly with 4-corner parcel boundaries (Dag/Khatian). |
| **Uncertainty Representation** | Absent: Features are rendered with sharp, misleading binary boundaries implying total certainty. | Explicit: Highlights uncertainty prediction cones, confidence levels (e.g., 88%), and model disclaimer badges. |
| **Decision Support** | Passive: Requires human experts to manually interpret satellite pixels and calculate affected acreage. | Automated & Actionable: Instantly derives affected parcel counts, loss areas in Decimals, and compensation estimates. |
| **Sensor Fusion** | Single-sensor display: Shows either an optical base map or an administrative vector layer. | Multimodal fusion: Integrates optical imagery, SAR radar backscatter, DEM elevation, and hydro-meteorological feeds. |
| **Institutional Governance** | Confined to specialized GIS departments: Results are locked in inaccessible desktop software (ArcGIS/QGIS). | Democratized web access: Transparent, responsive web interface accessible to local surveyors and rural citizens alike. |
| **Data Integrity Safeguards** | None: Often mixes historical facts with planning estimates, leading to administrative confusion. | Strict mode separation: Enforces strict data isolation, stripping historical payment fields in predictive views. |

---

### 10.9 Limitations, Reliability Considerations, and Responsible Use

The integration of artificial intelligence and deep learning into land administration involves profound ethical, legal, and operational responsibilities. BhumiDorpon explicitly recognizes the following fundamental constraints:

#### 1. Sensor Resolution Limits vs. Cadastral Precision
Public Earth Observation satellites operate at spatial resolutions of **10 meters** (Sentinel-2 multispectral and Sentinel-1 SAR) or **30 meters** (Landsat). In Bangladesh, however, a typical rural agricultural parcel may measure only 10 to 30 decimals ($400\text{--}1,200\text{ m}^2$), with boundary markers (*ails*) measuring less than 30 centimeters in width. 

A single satellite pixel can span an entire family plot. Consequently, **satellite-derived deep learning predictions can never substitute for legal cadastral boundary surveys conducted by certified land surveyors (*amin*) using total stations, DGPS, or traditional chain surveys**.

#### 2. The "Black Box" Problem in Public Land Administration
Deep neural networks operate through millions of non-linear parameter weights, making their internal decision pathways difficult to explain to an aggrieved farmer or a judicial land tribunal. In public land administration, decisions involving compensation disbursement or resettlement cannot be executed based solely on an unexplainable model prediction. BhumiDorpon mandates that all model predictions serve exclusively as **advisory decision-support tools** subject to human verification.

#### 3. Climate Non-Stationarity and Extreme Anomalies
Deep learning models are trained on historical statistical distributions. However, global climate change is intensifying precipitation extremes, altering Himalayan snowmelt patterns, and increasing cyclone surge intensities. An unprecedented transboundary flash flood (such as the catastrophic 2022 Sylhet deluge) or an unpredicted upstream barrage release may fall completely outside the training distribution, causing model accuracy to degrade.

#### 4. Ethical Safeguards and Responsible Use Guidelines
To prevent misuse, BhumiDorpon establishes four non-negotiable operational rules:
1. **Never Legally Binding:** Model predictions must never be cited as legal proof of ownership, boundary delimitation, or land loss in civil courts.
2. **No Forced Displacement:** Forecast hazard envelopes must never be weaponized by administrative authorities or private developers to justify the involuntary eviction of vulnerable riverine communities.
3. **Mandatory Transparency:** Every rendered map and tabular report displaying modeled projections must carry the `ForecastBadge` and persistent advisory disclaimers.
4. **Strict Financial Sanitization:** Predictive forecast views must never display historical disbursement progress bars (`Paid`, `Approved`, `Pending`) to prevent citizens or revenue officers from mistaking projected liabilities for approved government payouts.

---

### 10.10 Technical Implementation Status Matrix

To ensure absolute clarity regarding the current state of BhumiDorpon, the following matrix categorizes every system capability into its verified operational status:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              BhumiDorpon Technical Capability Verification                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [CURRENTLY IMPLEMENTED]     [SIMULATED PROTOTYPE]          [PROPOSED / ROADMAP]        [NOT VERIFIED]  │
│ • Next.js 14 Web GIS SPA    • Deterministic Mock Geometries• PostGIS Production DB     • Ground-truth  │
│ • Synchronized Dual Leaflet • "GeoAI-BD v2.4" Banner Model • Live Copernicus Pipeline  │   accuracy of │
│ • 4-Corner Plot Coordinates • Pre-computed Hazard Forecasts• PyTorch Inference Service │   real DL in  │
│ • Turf.js Intersection Math • Seeded Mock Compensation     • Real-time SAR Flood Model │   Bangladesh  │
│ • Strict Mode Separation    • Synthetic DEM Hillshades     • Ministry Land Registry API│   field conditions│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| System Capability | Implementation Status | Technical Verification Evidence in Codebase |
|---|---|---|
| **Interactive Map Interface** | **Currently Implemented** | Leaflet 1.9.4 dual-viewport comparison (`MapCompare.tsx`), synchronized pan/zoom with re-entrancy guards, Light GIS and Satellite basemap switching. |
| **Cadastral Plot Resolution** | **Currently Implemented** | Quadrilateral plot polygons with 4 distinct corner coordinates (NW, NE, SE, SW to 6 decimal places), Dag No., Khatian No., and GeoJSON/CSV exports. |
| **Five Hazard Modules** | **Currently Implemented** | Dedicated modules for River Erosion, Flooding, Landslides, Chars, and Coastal shifts with tailored cartographic layers. |
| **Recorded vs. Forecast Mode** | **Currently Implemented** | Top-level mode toggle in `appStore`; strict data sanitization removing disbursement fields in Forecast mode. |
| **Cadastral Plot Intersections** | **Currently Implemented** | Client/generator calculation using Turf.js (`turf.intersect`, `turf.area`) to derive affected area in Decimals. |
| **Deep Learning Forecast Data** | **Simulated / Prototype** | Pre-generated, deterministic relational JSON files in `/mocks`; generated offline via `scripts/generate-mocks.ts`. |
| **"GeoAI-BD v2.4" Model Identity** | **Simulated / Prototype** | UI conceptual demonstration banner; no actual PyTorch/TensorFlow weights exist in repository. |
| **Synthetic DEM & Hillshades** | **Simulated / Prototype** | Topographic elevation contours and PNG hillshade overlays synthesized from 2D Gaussian distributions. |
| **Live Remote Sensing Pipeline** | **Proposed / Future Work** | Automated ingestion of Sentinel-1/2 imagery via Copernicus Open Access Hub or Google Earth Engine API. |
| **Operational Spatiotemporal DL** | **Proposed / Future Work** | Hosting real-time ConvLSTM and Spatiotemporal U-Net models on GPU inference microservices (FastAPI). |
| **National Land Registry Integration** | **Proposed / Future Work** | Interfacing with Ministry of Land e-Mutation and digital Khatian databases under official data governance protocols. |
| **Real-World Empirical Accuracy** | **Not Verified** | No empirical validation against ground-truth field surveys has been conducted; demo geometries are purely illustrative. |

---

## 11. Target Users and Use Cases

### 11.1 Persona Profiles

#### Persona 1: Local Land Administration Officer (AC Land / Surveyor)
- **Name:** Md. Enamul Haque
- **Role:** Assistant Commissioner of Land (AC Land), Kazipur Upazila, Sirajganj.
- **Technical Competence:** Moderate; comfortable with desktop computers, web browsers, and administrative spreadsheets.
- **Core Need:** Needs to know exactly which mouzas and cadastral Dag numbers were swallowed by the Jamuna River during the current monsoon season to update local revenue records and submit relief compensation estimates to the Deputy Commissioner’s (DC) office.
- **Workflow in BhumiDorpon:** Opens `/river-erosion` &rarr; Selects Sirajganj / Kazipur / Jamuna / Mouza Khanshama &rarr; Reviews total eroded land area in Decimals &rarr; Sorts the Owner Table by `Lost Area` &rarr; Downloads the CSV report to integrate with local administrative files.

#### Persona 2: Affected Landowner / Citizen
- **Name:** Abdul Karim
- **Role:** Farmer and head of household, Jaflong, Gowainghat, Sylhet.
- **Technical Competence:** Basic; accesses the internet primarily via a 4G smartphone.
- **Core Need:** Following severe haor flooding, Karim needs to verify whether his ancestral land plots (Dag No. 101 and 102) were classified as submerged, check his approved compensation status, and find his exact plot corner coordinates because physical boundary markers were washed away.
- **Workflow in BhumiDorpon:** Navigates on mobile browser to `/flood` &rarr; Selects Sylhet / Gowainghat / Jaflong / 2024 Flood &rarr; Searches "Karim" in the affected owner table &rarr; Clicks his name to open `/flood/.../owner/...` &rarr; Views his plots highlighted on the map &rarr; Clicks "Copy 4 Corners" to save the GPS coordinates for his village surveyor.

#### Persona 3: Disaster Risk Reduction (DRR) Specialist / Researcher
- **Name:** Farhana Yasmin
- **Role:** Spatial Analyst at a disaster management NGO in Dhaka.
- **Technical Competence:** High; skilled in GIS, remote sensing, and environmental modeling.
- **Core Need:** Investigating the correlation between tertiary hill slope angles and landslide debris runout volumes in the Chittagong Hill Tracts to model settlement vulnerability.
- **Workflow in BhumiDorpon:** Navigates to `/landslide` &rarr; Toggles between `Recorded` and `Forecast` modes for Kawkhali, Rangamati &rarr; Switches to Satellite basemap to inspect real terrain cover &rarr; Analyzes slope angle ($41.5^\circ$), contour lines, and debris runout risk buffers &rarr; Exports GeoJSON boundaries for further spatial analysis.

---

## 12. Data Sources, Limitations, and Transparency

### 12.1 Data Sources and Provenance
| Data Layer / Asset | Current Implementation Status | Provenance & Source Details |
|---|---|---|
| **Cadastral Plots & Boundaries** | Fictional Mock Data | Synthetically generated 4-corner polygons created by `/scripts/generate-mocks.ts`. Not official government survey sheets. |
| **Landowner Records & Names** | Fictional Mock Data | Common Bangladeshi names (e.g., Abdul Karim, Rahima Begum) invented for demonstration purposes only. |
| **Dag & Khatian Deed Numbers** | Fictional Mock Data | Randomly assigned cadastral deed numbers adhering to standard Bangladesh land record formats. |
| **Compensation Figures & Status** | Fictional Mock Data | Calculated using standard agricultural and homestead valuation formulas; financial figures are purely illustrative. |
| **Light GIS Basemap** | Synthetic Vector Cartography | Custom Leaflet SVG/Canvas vector layers (roads, water, mouza outlines, graticules) following specifications in `MAP_SPEC.md`. |
| **Satellite Imagery Basemap** | Real-World Remote Sensing Tiles | Esri World Imagery (ArcGIS Online) tile service: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`. |
| **Street Basemap** | Real-World Cartography | OpenStreetMap standard cartographic tile service: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. |
| **Forecast Projections** | Pre-Computed Synthetic Modeling | Simulated 1-year forward-looking scenarios generated deterministically; no live neural network inference is running. |

### 12.2 Explicit Data Limitations
1. **No Live Government Connection:** BhumiDorpon does not connect to the Ministry of Land's e-Mutation system, the Directorate of Land Records and Surveys (DLRS), or national identity databases.
2. **Not Legally Binding:** Coordinates, plot boundaries, and compensation amounts cannot be cited in legal disputes, land registration offices, or formal compensation claims.
3. **Unverified Satellite Alignment:** While the application uses genuine Esri satellite imagery at authentic regional coordinates, the synthetic plot polygons are not field-georeferenced against real-world parcel boundaries. The persistent disclaimer *"Demo geometry — not survey-accurate"* must always be respected.
4. **Network Dependencies:** Loading real satellite imagery requires an active internet connection. If the external tile provider is blocked or offline, the system safely falls back to the synthetic Light GIS basemap.

---

## 13. Future Scope

The long-term vision for BhumiDorpon involves transitioning from an architectural demonstration into an operational national spatial decision-support system:

### 13.1 Phase 1: Spatial Backend & Database Integration
- Replace client-side mock JSON files with a production **PostgreSQL 16 + PostGIS** database.
- Implement spatial indexing (`GIST`) on all cadastral plot geometries, mouza boundaries, and river transects.
- Deploy a high-performance **FastAPI** backend exposing RESTful endpoints documented in [API Documentation](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/api-documentation.md).

### 13.2 Phase 2: Live Remote Sensing & Earth Observation Pipelines
- Connect to **Copernicus Open Access Hub (ESA)** and **Google Earth Engine (GEE)** to ingest multitemporal Sentinel-2 (optical) and Sentinel-1 (SAR) imagery.
- Implement automated water extraction indices (MNDWI / AWEI) and SAR backscatter thresholding to delineate flood extents through monsoon cloud cover.
- Ingest high-resolution Digital Elevation Models (ALOS PALSAR 12.5m or airborne LiDAR) for precise slope stability and landslide runout modeling.

### 13.3 Phase 3: Operational Machine Learning Forecasting
- Train deep-learning temporal models (ConvLSTM / Spatiotemporal U-Net) on historical river migration sequences (1990–2025) to generate probabilistic 1-year bankline retreat hazard zones.
- Deploy machine-learning susceptibility classifiers (Random Forest / XGBoost) integrating soil moisture, rainfall intensity (CHIRPS), and slope curvature for real-time landslide warnings.

### 13.4 Phase 4: Institutional Land Governance Integration
- Establish secure, read-only APIs with the Ministry of Land's digital land management systems (e-Porcha, Khatian database) under strict privacy and role-based access control.
- Introduce bilingual localization (full Bengali and English UI toggles).
- Develop mobile-first offline data collection workflows for field surveyors using Progressive Web App (PWA) technologies.

---

## 14. References

1. **Center for Environmental and Geographic Information Services (CEGIS):** *Monitoring of River Morphological Changes and Riverbank Erosion Forecasting in Bangladesh*, Annual Technical Reports, Dhaka, Bangladesh. [https://www.cegisbd.com](https://www.cegisbd.com)
2. **Bangladesh Water Development Board (BWDB) & Flood Forecasting and Warning Centre (FFWC):** *Annual Flood Report and Hydrological Bulletins*, Ministry of Water Resources, Government of the People's Republic of Bangladesh. [http://www.ffwc.gov.bd](http://www.ffwc.gov.bd)
3. **Directorate of Land Records and Surveys (DLRS):** *Manual of Cadastral Surveying and Mouza Map Preparation*, Ministry of Land, Government of the People's Republic of Bangladesh. [https://www.dlrs.gov.bd](https://www.dlrs.gov.bd)
4. **Ministry of Disaster Management and Relief (MoDMR):** *National Plan for Disaster Management (NPDM 2021–2025)*, Disaster Management and Relief Division, Dhaka, Bangladesh. [https://modmr.gov.bd](https://modmr.gov.bd)
5. **Bangladesh Bureau of Statistics (BBS):** *Bangladesh Population and Housing Census & Statistical Yearbook of Bangladesh*, Ministry of Planning, Government of the People's Republic of Bangladesh. [https://www.bbs.gov.bd](https://www.bbs.gov.bd)
6. **Brammer, H. (2012):** *The Physical Geography of Bangladesh*, The University Press Limited (UPL), Dhaka, ISBN: 978-984-506-056-1.
7. **European Space Agency (ESA):** *Copernicus Sentinel-1 SAR and Sentinel-2 Multi-Spectral Earth Observation Technical Guidelines*. [https://sentinels.copernicus.eu](https://sentinels.copernicus.eu)
8. **Esri:** *ArcGIS Online World Imagery Basemap Services and Documentation*. [https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9)
9. **OpenStreetMap Foundation:** *OpenStreetMap Tile Server Terms of Use and Licensing (ODbL)*. [https://operations.osmfoundation.org/policies/tiles/](https://operations.osmfoundation.org/policies/tiles/)
10. **Leaflet Open-Source Project:** *Leaflet JavaScript Library for Mobile-Friendly Interactive Maps (v1.9.4)*. [https://leafletjs.com](https://leafletjs.com)
11. **Shi, X., Chen, Z., Wang, H., Yeung, D. Y., Wong, W. K., & Woo, W. C. (2015):** *Convolutional LSTM Network: A Machine Learning Approach for Precipitation Nowcasting*, Advances in Neural Information Processing Systems (NeurIPS 2015), 28, 802–810.
12. **Ronneberger, O., Fischer, P., & Brox, T. (2015):** *U-Net: Convolutional Networks for Biomedical Image Segmentation*, Medical Image Computing and Computer-Assisted Intervention (MICCAI), Springer, LNCS 9351, 234–241.
13. **Zhu, X. X., Tuia, D., Mou, L., Xia, G. S., Zhang, L., Xu, F., & Fraundorfer, F. (2017):** *Deep Learning in Remote Sensing: A Comprehensive Review and List of Resources*, IEEE Geoscience and Remote Sensing Magazine, 5(4), 8–36.

---

## 15. Team Information and Copyright

- **Team Name:** GeoNeural
- **Team Leader:** Pantho Raj Biswas
- **Team Member:** Puja Paul

**Copyright:** © 2026 GeoNeural. All rights reserved.

*BhumiDorpon is developed and maintained by Team GeoNeural as an advanced geospatial research and demonstration platform for cadastral hazard monitoring in Bangladesh.*

