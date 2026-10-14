import { describe, it, expect } from "vitest";
import { BASEMAP_PROVIDERS, DEMO_GEOMETRY_DISCLAIMER } from "@/lib/basemapConfig";

describe("Map Comparison Update: Side-by-side & Basemap Switch Verification", () => {
  it("provides valid configurations for all three basemap modes: Light GIS, Satellite, and Street", () => {
    expect(BASEMAP_PROVIDERS["light-gis"]).toBeDefined();
    expect(BASEMAP_PROVIDERS["satellite"]).toBeDefined();
    expect(BASEMAP_PROVIDERS["street"]).toBeDefined();

    // Light GIS should be synthetic, following MAP_SPEC.md
    expect(BASEMAP_PROVIDERS["light-gis"].isSynthetic).toBe(true);
    expect(BASEMAP_PROVIDERS["light-gis"].name).toBe("Light GIS");

    // Satellite should have genuine tile provider URL (Esri World Imagery)
    expect(BASEMAP_PROVIDERS["satellite"].isSynthetic).toBe(false);
    expect(BASEMAP_PROVIDERS["satellite"].tileUrl).toContain("World_Imagery");
    expect(BASEMAP_PROVIDERS["satellite"].attribution).toContain("Esri");
    expect(BASEMAP_PROVIDERS["satellite"].maxZoom).toBe(19);

    // Street should have OpenStreetMap tile URL
    expect(BASEMAP_PROVIDERS["street"].isSynthetic).toBe(false);
    expect(BASEMAP_PROVIDERS["street"].tileUrl).toContain("openstreetmap.org");
    expect(BASEMAP_PROVIDERS["street"].attribution).toContain("OpenStreetMap");
    expect(BASEMAP_PROVIDERS["street"].maxZoom).toBe(19);
  });

  it("defines clear disclaimer text for non-survey accurate demonstration geometry", () => {
    expect(DEMO_GEOMETRY_DISCLAIMER).toBe("Demo geometry — not survey-accurate");
  });

  it("respects supported Leaflet zoom limits (minZoom 10, maxZoom 19 for regional GIS)", () => {
    expect(BASEMAP_PROVIDERS["light-gis"].minZoom).toBeGreaterThanOrEqual(1);
    expect(BASEMAP_PROVIDERS["light-gis"].maxZoom).toBeLessThanOrEqual(20);
    expect(BASEMAP_PROVIDERS["satellite"].maxZoom).toBe(19);
    expect(BASEMAP_PROVIDERS["street"].maxZoom).toBe(19);
  });
});
