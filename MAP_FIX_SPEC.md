# BhumiDorpon — Corrective Map Fix Specification

## Goal
Fix the existing map implementation without changing the overall website layout or visual design. The existing layout is approved; this task is limited to geographic context, basemap alignment, map extent, and first-click zoom behavior.

## Required fixes

### 1. Hazard-specific geographic context
Do not display the same hard-coded satellite screenshot/image for every hazard. Use the actual configured geographic tile layer, viewed at the location and extent belonging to the selected hazard and region.

Expected context when supported by existing data:
- River Erosion: selected river corridor and adjacent banks.
- Landslide: selected hilly or mountainous region.
- Char: selected river island, sandbar, or char region.
- Flood: selected flood-affected region.
- Coastal: selected coastal/estuarine region.

These must be geographic maps, not decorative stock photos. Derive region and bounds from existing project data. Do not fabricate coordinates or claim mock coordinates are accurate. If data does not provide reliable coordinates, retain the demo-geometry warning and report the limitation instead of faking a match.

### 2. Show only the selected area
When a user selects a region, fit the map to that region's existing feature bounds/bounding box with suitable padding. Do not show an unnecessarily huge country-wide area for a small selected region. Do not use another hazard's bounds or imagery as a fallback. If the selection has no valid bounds, use an explicit documented demo fallback and label it honestly.

### 3. Light GIS and Satellite must show the same place
The two map types must be different basemaps for the same geography:
- Same CRS, center, zoom, geographic bounds, and map container aspect ratio.
- Switching map type changes only the basemap layer.
- Existing hazard overlays, boundaries, selected feature, legend, region selection, and Before/After comparison state remain unchanged.
- Do not stretch or crop a static image to imitate a map.
- Satellite imagery must be genuine geographic tiles from a permitted provider, with attribution. If a compliant source is not configured, report the exact configuration needed and retain Light GIS; never fake satellite imagery.

### 4. Before/After synchronization
Both comparison maps must show the same geographic extent and stay synchronized when either map is panned or zoomed. Avoid synchronization loops. Changing the basemap on either map should update both maps while preserving the viewport.

### 5. Fix zoom buttons so the first click works
The `+` and `−` buttons must directly call the real map zoom API on the first click. Remove any extra activation/tool-selection state. Check that click handlers are not being swallowed by map overlays, propagation handlers, or an invisible element. Zooming either map should zoom both.

### 6. Preserve existing UI
The existing page layout and overall UI design are already approved. Do not redesign the site, change typography/colors/spacing outside the map fix, remove existing features, change route structure, or replace the map library. Keep all five hazards, owner map, dashboard preview, layers, legends, and supporting information.

### 7. Verification
Run the project's actual available checks. Test at least:
- Each hazard/region opens to its own selected geographic bounds.
- Satellite and Light GIS show the same location and scale.
- Basemap switching does not move overlays or selected region.
- Before/After maps remain synchronized.
- `+` and `−` work on the first click.
- Tile errors do not break Light GIS.
- Existing features and responsive layout still work.

Report actual commands and results. Do not claim alignment is accurate if the underlying demo coordinates are synthetic or unverified.
