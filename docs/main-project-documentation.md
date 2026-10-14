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

## 10. Target Users and Use Cases

### 10.1 Persona Profiles

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

## 11. Data Sources, Limitations, and Transparency

### 11.1 Data Sources and Provenance
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

### 11.2 Explicit Data Limitations
1. **No Live Government Connection:** BhumiDorpon does not connect to the Ministry of Land's e-Mutation system, the Directorate of Land Records and Surveys (DLRS), or national identity databases.
2. **Not Legally Binding:** Coordinates, plot boundaries, and compensation amounts cannot be cited in legal disputes, land registration offices, or formal compensation claims.
3. **Unverified Satellite Alignment:** While the application uses genuine Esri satellite imagery at authentic regional coordinates, the synthetic plot polygons are not field-georeferenced against real-world parcel boundaries. The persistent disclaimer *"Demo geometry — not survey-accurate"* must always be respected.
4. **Network Dependencies:** Loading real satellite imagery requires an active internet connection. If the external tile provider is blocked or offline, the system safely falls back to the synthetic Light GIS basemap.

---

## 12. Future Scope

The long-term vision for BhumiDorpon involves transitioning from an architectural demonstration into an operational national spatial decision-support system:

### 12.1 Phase 1: Spatial Backend & Database Integration
- Replace client-side mock JSON files with a production **PostgreSQL 16 + PostGIS** database.
- Implement spatial indexing (`GIST`) on all cadastral plot geometries, mouza boundaries, and river transects.
- Deploy a high-performance **FastAPI** backend exposing RESTful endpoints documented in [API Documentation](file:///d:/SOFTWARE/Project/Antigravity/BhumiDorpon/docs/api-documentation.md).

### 12.2 Phase 2: Live Remote Sensing & Earth Observation Pipelines
- Connect to **Copernicus Open Access Hub (ESA)** and **Google Earth Engine (GEE)** to ingest multitemporal Sentinel-2 (optical) and Sentinel-1 (SAR) imagery.
- Implement automated water extraction indices (MNDWI / AWEI) and SAR backscatter thresholding to delineate flood extents through monsoon cloud cover.
- Ingest high-resolution Digital Elevation Models (ALOS PALSAR 12.5m or airborne LiDAR) for precise slope stability and landslide runout modeling.

### 12.3 Phase 3: Operational Machine Learning Forecasting
- Train deep-learning temporal models (ConvLSTM / Spatiotemporal U-Net) on historical river migration sequences (1990–2025) to generate probabilistic 1-year bankline retreat hazard zones.
- Deploy machine-learning susceptibility classifiers (Random Forest / XGBoost) integrating soil moisture, rainfall intensity (CHIRPS), and slope curvature for real-time landslide warnings.

### 12.4 Phase 4: Institutional Land Governance Integration
- Establish secure, read-only APIs with the Ministry of Land's digital land management systems (e-Porcha, Khatian database) under strict privacy and role-based access control.
- Introduce bilingual localization (full Bengali and English UI toggles).
- Develop mobile-first offline data collection workflows for field surveyors using Progressive Web App (PWA) technologies.

---

## 13. References

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

---

## 14. Team Information and Copyright

- **Team Name:** GeoNeural
- **Team Leader:** Pantho Raj Biswas
- **Team Member:** Puja Paul

**Copyright:** © 2026 GeoNeural. All rights reserved.

*BhumiDorpon is developed and maintained by Team GeoNeural as an advanced geospatial research and demonstration platform for cadastral hazard monitoring in Bangladesh.*
