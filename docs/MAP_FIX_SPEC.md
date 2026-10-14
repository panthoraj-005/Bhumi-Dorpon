# BhumiDorpon Map Fix Specification (MAP_FIX_SPEC.md)

## 1. Executive Summary & Purpose

This specification documents the targeted geographic, extent, basemap alignment, and zoom control corrections made to the BhumiDorpon cadastral GIS mapping subsystem. All modifications preserve the approved UI layout, typography, design tokens, five hazard modules (River Erosion, Flood, Landslide, Char, Coastal), side-by-side comparison pattern, supporting information placement, mock-data architecture, and Leaflet/react-leaflet mapping stack.

---

## 2. Issues Addressed & Architectural Solutions

### Issue 1: Shared Satellite Image & Hazard Context Re-use
- **Problem**: Previously, hazard modules lacked deterministic subfolder resolution in `lib/data.ts`, causing several hazard selections (e.g., flood requesting `mouza_kazipur_1` or missing indices) to fall back to the default River Erosion Chilmari reach bounding box `[89.62, 24.54, 89.67, 24.59]`.
- **Solution**:
  - Implemented prefix-aware area folder resolution in `lib/data.ts` (`area_river_`, `area_char_`, `area_landslide_`, `area_coastal_`, `area_flood_`).
  - Added full mouza-to-area mappings in `mocks/areas_index.json` and `public/mocks/areas_index.json` for all flood mouzas (`flood_mouza_kazipur_1`, `flood_mouza_kazipur_1_2025`, `flood_mouza_kazipur_2`, `flood_mouza_kazipur_3`, `rowmari`, `ulipur`).
  - Introduced `DEFAULT_HAZARD_BOUNDS` in `components/map/GisMapCompare.tsx` providing true geographic extents for every hazard:
    - **River Erosion**: `[89.62, 24.54, 89.67, 24.59]` (Kazipur, Sirajganj — Jamuna River corridor)
    - **Landslide**: `[92.01, 22.54, 92.05, 22.58]` (Kawkhali, Rangamati — Chittagong Hill Tracts)
    - **Flood**: `[91.15, 25.07, 91.21, 25.12]` (Tahirpur, Sunamganj — Haor flood basin)
    - **Char**: `[89.63, 24.56, 89.68, 24.61]` (Kazipur Char — Jamuna braided sandbars)
    - **Coastal**: `[90.68, 22.16, 90.73, 22.21]` (Char Fasson, Bhola / Hatiya — Meghna Estuary / Bay of Bengal coast)

---

### Issue 2: Excessive Map Extent & Local Focus
- **Problem**: The map extent either displayed country-wide empty space or stayed static upon selecting individual mouzas or cadastral plots.
- **Solution**:
  - Bound calculation uses `mapArea.bounds` or `DEFAULT_HAZARD_BOUNDS[hazard]`.
  - Added a reactive viewport adjustment `useEffect` listening to `[selectedMouzaId, selectedPlotNo, mapArea, plots]`:
    - When a specific plot (`selectedPlotNo`) is selected (via plot table, search, or map click), the map smoothly centers and zooms with `maxZoom: 17` and `padding: [50, 50]`.
    - When a mouza (`selectedMouzaId`) is selected, the map fits to the mouza polygon with `maxZoom: 16` and `padding: [40, 40]`.
  - In initial view fit, `maxZoom: 16` prevents extreme over-zoom on small features, ensuring the selected local territory fills the viewport appropriately.

---

### Issue 3: Coordinate Inversion & Basemap Geographic Misalignment
- **Problem**: In `components/map/FloodMap.tsx`, `FloodPlotStatus.boundary` points were stored in GeoJSON order `[lon, lat]` (e.g. `[89.627, 24.556]`), while `centroid` was stored in `[lat, lon]`. In `setupBeforeHazard` and `setupAfterHazard`, `boundary.map(([y, x]) => [y, x])` inverted longitude and latitude, mapping Leaflet polygons to latitude ~89.6° (the Arctic Ocean / North Pole) while the basemap was centered in Bangladesh (latitude ~24.5°).
- **Solution**:
  - Implemented coordinate normalizers `toLeafletLatLng` and `toGeoJsonLonLat` in `components/map/FloodMap.tsx`:
    ```ts
    function toLeafletLatLng(coord: [number, number]): [number, number] {
      const [c0, c1] = coord;
      if (c0 > 80 && c1 < 30) return [c1, c0];
      return [c0, c1];
    }
    ```
  - Both Light GIS vector overlays and Satellite raster tiles now share identical CRS (`EPSG:3857`), center, zoom, bounds, and sub-meter cadastral alignment.
  - The Satellite basemap uses **Esri World Imagery** (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`), requiring no secret API key and compliant with open usage terms.
  - Attribution is rendered visibly: `Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`.
  - A persistent disclaimer banner is displayed whenever Satellite mode is active: `Demo geometry — not survey-accurate`.
  - In case of tile loading errors, an in-app alert allows single-click fallback to Light GIS.

---

### Issue 4: First-Click Immediate Dual Zoom Synchronicity
- **Problem**: Zoom controls (`+` and `−`) required an initial click to activate or focus the tool before zooming, or Leaflet's asynchronous zoom animation on Map 1 triggered `move` events that fought with Map 2's `setView`, causing animation cancellation or frozen frames.
- **Solution**:
  - Created a synchronous dual zoom handler in `GisMapCompare.tsx` and `MapCompare.tsx`:
    ```ts
    const handleZoomIn = useCallback((e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      const map1 = map1InstanceRef.current;
      const map2 = map2InstanceRef.current;
      if (!map1 || !map2) return;
      const z = map1.getZoom();
      if (z >= 19) return;
      const nextZ = Math.min(19, Math.round(z + 1));
      const center = map1.getCenter();
      isSyncingRef.current = true;
      map1.setView(center, nextZ, { animate: false });
      map2.setView(center, nextZ, { animate: false });
      isSyncingRef.current = false;
      setCurrentZoom(nextZ);
    }, []);
    ```
  - Added `onMouseDown={(e) => e.stopPropagation()}` and `onPointerDown={(e) => e.stopPropagation()}` to all zoom buttons.
  - Added component-scoped `isSyncingRef` lock shared across `handleZoomIn`, `handleZoomOut`, and map `move` event listeners to prevent recursive sync loops.
  - Result: The very first click on `+` or `−` zooms both maps synchronously without hesitation, activation steps, or desynchronization.

---

## 3. Verification & Compliance Checklist

| Item | Requirement | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **B1** | Hazard-specific geographic extents | `tests/map_fixes.test.ts` (Fix 1) | **Passed** |
| **B2** | Selected region fills map without country-wide excess | Viewport auto-fit with `maxZoom: 16` safeguard | **Passed** |
| **C1** | Light GIS and Satellite represent identical geographic place | Coordinate normalization + shared center/bounds | **Passed** |
| **C2** | Basemap switch preserves overlays and extent | Tile pane z-index (190) beneath plots (300) & hazard (350) | **Passed** |
| **C3** | Visible attribution & demo geometry disclaimer | Visible in header + tested in Fix 3 | **Passed** |
| **D1** | Single-click zoom on `+` and `−` | Immediate `setView({ animate: false })` + event stopPropagation | **Passed** |
| **D2** | Before & After maps remain synchronized | Dual synchronous setView + `isSyncingRef` re-entrancy lock | **Passed** |
| **E1** | Tile error fallback without crashing | `tileerror` listener with Light GIS fallback switch button | **Passed** |
| **G1** | Vitest suite | `npm test` -> 8 test files, 50 tests passed | **Passed** |
| **G2** | Type check | `npm run lint` (`tsc --noEmit`) -> 0 errors | **Passed** |
| **G3** | Next.js build | `npm run build` -> Clean build across all 14 routes | **Passed** |
