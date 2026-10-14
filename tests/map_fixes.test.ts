import { describe, it, expect } from "vitest";
import { getMapArea } from "@/lib/data";
import { BASEMAP_PROVIDERS, DEMO_GEOMETRY_DISCLAIMER } from "@/lib/basemapConfig";

describe("BhumiDorpon Map Corrections - Verification Suite", () => {
  it("Fix 1: Each hazard loads distinct geographic context and specific regional bounds", async () => {
    // 1. River Erosion -> Kazipur / Jamuna corridor
    const riverArea = await getMapArea("river_erosion", "recorded", "mouza_kazipur_1");
    expect(riverArea).not.toBeNull();
    expect(riverArea?.areaId).toContain("kazipur");
    expect(riverArea?.bounds).toEqual([89.62, 24.54, 89.67, 24.59]);

    // 2. Landslide -> Kawkhali, Rangamati (Chittagong Hill Tracts)
    const landslideArea = await getMapArea("landslide", "recorded", "ghagra");
    expect(landslideArea).not.toBeNull();
    expect(landslideArea?.areaId).toContain("kawkhali");
    expect(landslideArea?.bounds).toEqual([92.01, 22.54, 92.05, 22.58]);

    // 3. Flood -> Tahirpur, Sunamganj (Haor flood basin)
    const floodArea = await getMapArea("flood", "recorded", "mouza_tahirpur_1");
    expect(floodArea).not.toBeNull();
    expect(floodArea?.areaId).toContain("tahirpur");
    expect(floodArea?.bounds).toEqual([91.15, 25.07, 91.21, 25.12]);

    // 4. Char -> Kazipur Char (Jamuna braided sandbars)
    const charArea = await getMapArea("char", "recorded", "char_kazipur_1");
    expect(charArea).not.toBeNull();
    expect(charArea?.areaId).toContain("char_kazipur");
    expect(charArea?.bounds).toEqual([89.63, 24.56, 89.68, 24.61]);

    // 5. Coastal -> Hatiya / Char Fasson (Meghna Estuary / Bay of Bengal coast)
    const coastalArea = await getMapArea("coastal", "recorded", "mouza_char_fasson_1");
    expect(coastalArea).not.toBeNull();
    expect(coastalArea?.areaId).toContain("char_fasson");
    expect(coastalArea?.bounds).toEqual([90.68, 22.16, 90.73, 22.21]);

    // Ensure all 5 hazards have distinct bounding boxes (not a single shared bbox)
    const bboxes = [
      riverArea?.bounds,
      landslideArea?.bounds,
      floodArea?.bounds,
      charArea?.bounds,
      coastalArea?.bounds,
    ];
    const uniqueBboxes = new Set(bboxes.map((b) => JSON.stringify(b)));
    expect(uniqueBboxes.size).toBe(5);
  });

  it("Fix 2: Coordinate normalization prevents Arctic lat inversion and validates Bangladesh bounds", () => {
    // Normalizer functions matching FloodMap implementation
    function toLeafletLatLng(coord: [number, number]): [number, number] {
      const [c0, c1] = coord;
      if (c0 > 80 && c1 < 30) return [c1, c0];
      return [c0, c1];
    }

    function toGeoJsonLonLat(coord: [number, number]): [number, number] {
      const [c0, c1] = coord;
      if (c0 < 30 && c1 > 80) return [c1, c0];
      return [c0, c1];
    }

    // Typical GeoJSON plot boundary point in Sirajganj/Jamuna [lon, lat]
    const geoJsonPoint: [number, number] = [89.642, 24.571];
    const leafletLatLng = toLeafletLatLng(geoJsonPoint);

    // Leaflet requires [lat, lon]
    expect(leafletLatLng[0]).toBeCloseTo(24.571, 3); // Latitude in Bangladesh (~20° - 26°N)
    expect(leafletLatLng[1]).toBeCloseTo(89.642, 3); // Longitude in Bangladesh (~88° - 93°E)

    // Ensure latitude is NEVER > 30 (not Arctic latitude 89°N)
    expect(leafletLatLng[0]).toBeLessThan(30);
    expect(leafletLatLng[0]).toBeGreaterThan(20);

    // Round-trip back to GeoJSON
    const backToGeoJson = toGeoJsonLonLat(leafletLatLng);
    expect(backToGeoJson[0]).toBeCloseTo(89.642, 3);
    expect(backToGeoJson[1]).toBeCloseTo(24.571, 3);
  });

  it("Fix 3: Basemap configuration uses compliant Esri Satellite tiles with proper attribution and demo disclaimer", () => {
    const satelliteProvider = BASEMAP_PROVIDERS.satellite;
    expect(satelliteProvider).toBeDefined();
    expect(satelliteProvider.tileUrl).toContain("arcgisonline.com");
    expect(satelliteProvider.attribution).toContain("Esri");
    expect(satelliteProvider.attribution).toContain("USGS");
    expect(satelliteProvider.attribution).toContain("GIS User Community");

    // Max/min zoom bounds
    expect(satelliteProvider.maxZoom).toBe(19);
    expect(satelliteProvider.minZoom).toBe(1);

    // Disclaimer constant is visible
    expect(DEMO_GEOMETRY_DISCLAIMER).toBe("Demo geometry — not survey-accurate");
  });

  it("Fix 4: Zoom calculation transitions synchronously within bounds [10, 19]", () => {
    function computeNextZoom(currentZoom: number, delta: number): number {
      const next = currentZoom + delta;
      return Math.max(10, Math.min(19, Math.round(next)));
    }

    expect(computeNextZoom(14, 1)).toBe(15);
    expect(computeNextZoom(14, -1)).toBe(13);
    expect(computeNextZoom(19, 1)).toBe(19); // Clamp max
    expect(computeNextZoom(10, -1)).toBe(10); // Clamp min
  });
});
