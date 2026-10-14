# BUILD RULES — BhumiDorpon

If any documentation conflicts with these rules, these rules win.

## RULES

1. ENGLISH ONLY UI. No Bengali text, no language toggle, no i18n library.
2. DEMO DATA ONLY. No backend, no database, no ML, no outside data API. All data, including Forecast, is pre-generated static mock data under /mocks (or /public/mocks) and read through one typed data layer (/lib/data.ts). Mode is "recorded" | "forecast".
3. FULLY DYNAMIC. Every dropdown choice must really filter the mock dataset and drive what is shown. Nothing hardcoded per screen. Dropdown options are derived from the dataset. A valid selection never shows a blank screen: it shows results or the correct empty state.
4. DAG NO. AND KHATIAN NO. EVERYWHERE. Every table that lists affected owners, in every hazard and mode, has "Dag No." and "Khatian No." columns.
5. FORECAST SHOWS ONLY ESTIMATED COMPENSATION. Recorded: Est. compensation, Status (Paid / Approved / Pending / Not applied), Paid (৳). Forecast: only "Projected compensation" and projected area. No Status, no Paid, no paid/not-paid wording anywhere in forecast views, including the dashboard Forecast tab.
6. EACH HAZARD HAS ITS OWN MAP DESIGN (own component, layers, styling, legend). Never reuse one generic before/after map for all hazards.
7. Banner on every page: "Demo data: all names, plots and figures are fictional." Every forecast view: "Forecast" badge plus "This is a model-based estimate, not an official government record."
8. Never claim something works without running it in the browser and checking it. Take screenshots.
9. ALL MAPS USE LEAFLET (leaflet + react-leaflet), including every Before/After map. No MapLibre, Mapbox or react-map-gl anywhere in the project.
10. EVERY PLOT HAS FOUR CORNERS. Wherever a plot's location is shown (flood owner page, exports), show ALL FOUR corner coordinates (lat, lon, 6 decimals). Never show a single point or centroid as a plot's coordinate.
11. EVERY MAP USES THE LIGHT GIS BASEMAP defined in /docs/MAP_SPEC.md (synthetic, generated from mock data): land, land use, water, roads, buildings, embankments, upazila and mouza boundaries, graticule, scale bar, north arrow, locator inset, layer panel.
12. MOUZA NAMES ON EVERY MAP. On river-erosion, char and coastal maps each mouza label also carries its loss/gain badge (Forecast: projected), and a Mouza-wise summary panel sits beside the map.
13. FLOOD MAPS COLOUR EACH OWNER'S PLOTS SEPARATELY (with an owner legend panel); LANDSLIDE MAPS HAVE TERRAIN: elevation tint, hillshade, contours, slope and elevation change.
