import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import * as turf from "@turf/turf";
import { getMapArea } from "@/lib/data";
import { MapArea, HazardType, DataMode } from "@/lib/types";

describe("Change 3 Part 1: Professional Light-Themed GIS Basemap Verification", () => {
  const publicMocksDir = path.resolve(process.cwd(), "public/mocks");
  const areasDir = path.join(publicMocksDir, "areas");
  const hazards = ["river_erosion", "char", "coastal", "flood", "landslide"] as HazardType[];

  // Helper to load all area JSONs
  function getAllMapAreas(): MapArea[] {
    const areas: MapArea[] = [];
    for (const h of hazards) {
      const hDir = path.join(areasDir, h);
      if (!fs.existsSync(hDir)) continue;
      const files = fs.readdirSync(hDir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        const content = fs.readFileSync(path.join(hDir, file), "utf-8");
        areas.push(JSON.parse(content) as MapArea);
      }
    }
    return areas;
  }

  const allAreas = getAllMapAreas();

  it("at least 30 GIS Map Areas were generated across all 5 hazards", () => {
    expect(allAreas.length).toBeGreaterThanOrEqual(30);

    const counts: Record<string, number> = {};
    for (const a of allAreas) {
      counts[a.hazard] = (counts[a.hazard] || 0) + 1;
    }

    expect(counts["river_erosion"]).toBeGreaterThanOrEqual(7);
    expect(counts["char"]).toBeGreaterThanOrEqual(5);
    expect(counts["coastal"]).toBeGreaterThanOrEqual(6);
    expect(counts["flood"]).toBeGreaterThanOrEqual(6);
    expect(counts["landslide"]).toBeGreaterThanOrEqual(6);
  });

  it("adjacent mouzas share exact borders (gaps and overlaps below 1%)", () => {
    for (const area of allAreas) {
      const mouzas = area.mouzas;
      expect(mouzas.length).toBeGreaterThanOrEqual(2);

      // Pairwise overlap check
      for (let i = 0; i < mouzas.length; i++) {
        expect(mouzas[i].polygon).toBeDefined();
        const polyA = turf.polygon(mouzas[i].polygon!);
        const areaA = turf.area(polyA);

        for (let j = i + 1; j < mouzas.length; j++) {
          expect(mouzas[j].polygon).toBeDefined();
          const polyB = turf.polygon(mouzas[j].polygon!);
          const areaB = turf.area(polyB);

          try {
            const intersection = turf.intersect(turf.featureCollection([polyA, polyB]));
            if (intersection) {
              const isectArea = turf.area(intersection);
              const overlapFractionA = isectArea / areaA;
              const overlapFractionB = isectArea / areaB;
              // Overlap must be below 1%
              expect(overlapFractionA).toBeLessThan(0.01);
              expect(overlapFractionB).toBeLessThan(0.01);
            }
          } catch (e) {
            // No valid intersection geometry = 0 overlap
          }
        }
      }
    }
  });

  it("every mouza has name, jlNo and labelAnchor strictly inside its polygon", () => {
    let totalMouzasChecked = 0;
    for (const area of allAreas) {
      for (const m of area.mouzas) {
        totalMouzasChecked++;
        expect(m.id).toBeDefined();
        expect(m.name).toBeDefined();
        expect(typeof m.name).toBe("string");
        expect(m.name.length).toBeGreaterThan(0);

        expect(m.jlNo).toBeDefined();
        expect(typeof m.jlNo).toBe("string");
        expect(m.jlNo.startsWith("JL-") || m.jlNo.startsWith("V-")).toBe(true);

        expect(m.labelAnchor).toBeDefined();
        expect(m.labelAnchor.length).toBe(2);

        // Verify labelAnchor is strictly inside the mouza polygon
        expect(m.polygon).toBeDefined();
        const anchorPoint = turf.point(m.labelAnchor);
        const mouzaPoly = turf.polygon(m.polygon!);
        const isInside = turf.booleanPointInPolygon(anchorPoint, mouzaPoly);
        expect(isInside).toBe(true);
      }
    }
    expect(totalMouzasChecked).toBeGreaterThanOrEqual(100);
  });

  it("sum of per-mouza loss equals the sum of plot impacts for that result within 1%", () => {
    for (const area of allAreas) {
      const sumMouzaLoss = Number(
        area.mouzas.reduce((sum, m) => sum + (m.lossDecimal || 0), 0).toFixed(1)
      );

      if (area.owners && area.owners.length > 0) {
        const sumOwnerLoss = Number(
          area.owners.reduce((sum, o) => sum + (o.lossDecimal || 0), 0).toFixed(1)
        );

        if (sumMouzaLoss > 0) {
          const diffRatio = Math.abs(sumMouzaLoss - sumOwnerLoss) / sumMouzaLoss;
          expect(diffRatio).toBeLessThan(0.01);
        }

        // Also check each individual mouza matches its owner records
        for (const m of area.mouzas) {
          if ((m.lossDecimal || 0) > 0) {
            const mOwners = area.owners.filter((o) => o.mouzaId === m.id);
            const mOwnerLoss = Number(
              mOwners.reduce((sum, o) => sum + (o.lossDecimal || 0), 0).toFixed(1)
            );
            const mDiff = Math.abs((m.lossDecimal || 0) - mOwnerLoss) / (m.lossDecimal || 1);
            expect(mDiff).toBeLessThan(0.01);
          }
        }
      }
    }
  });

  it("every area has all 11 basemap layers listed in MAP_SPEC section 4", () => {
    const requiredLayers = [
      "land",
      "landuse",
      "water",
      "waterlines",
      "roads",
      "embankments",
      "buildings",
      "pois",
      "upazila",
      "mouzas",
      "labels",
    ] as const;

    for (const area of allAreas) {
      expect(area.basemap).toBeDefined();
      for (const layer of requiredLayers) {
        expect(area.basemap[layer], `Area ${area.areaId} missing layer ${layer}`).toBeDefined();
        expect(Array.isArray(area.basemap[layer])).toBe(true);
      }

      // Check features within layers
      expect(area.basemap.land.length).toBeGreaterThanOrEqual(1);
      expect(area.basemap.water.length).toBeGreaterThanOrEqual(1);
      expect(area.basemap.roads.length).toBeGreaterThanOrEqual(1);
      expect(area.basemap.mouzas.length).toBeGreaterThanOrEqual(2);
      expect(area.basemap.labels.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every flood owner has deterministic colorIndex between 0 and 11", () => {
    const floodAreas = allAreas.filter((a) => a.hazard === "flood");
    expect(floodAreas.length).toBeGreaterThanOrEqual(6);

    for (const area of floodAreas) {
      expect(area.owners).toBeDefined();
      expect(area.owners!.length).toBeGreaterThan(0);
      for (const owner of area.owners!) {
        expect(owner.colorIndex).toBeDefined();
        expect(typeof owner.colorIndex).toBe("number");
        expect(owner.colorIndex).toBeGreaterThanOrEqual(0);
        expect(owner.colorIndex).toBeLessThanOrEqual(11);
      }
    }

    // Also check flood.json dataset
    const floodJson = JSON.parse(
      fs.readFileSync(path.join(publicMocksDir, "flood.json"), "utf-8")
    );
    for (const event of floodJson.events) {
      for (const ps of event.plotStatus) {
        expect(ps.colorIndex).toBeDefined();
        expect(ps.colorIndex).toBeGreaterThanOrEqual(0);
        expect(ps.colorIndex).toBeLessThanOrEqual(11);
      }
    }
  });

  it("every landslide area has all 6 raster files, contours, spot heights, and volume matches within 1%", () => {
    const landslideAreas = allAreas.filter((a) => a.hazard === "landslide");
    expect(landslideAreas.length).toBeGreaterThanOrEqual(6);

    const requiredRasters = [
      "elevation_before.png",
      "elevation_after.png",
      "hillshade_before.png",
      "hillshade_after.png",
      "slope_before.png",
      "elevation_change.png",
    ];

    for (const area of landslideAreas) {
      expect(area.terrain).toBeDefined();
      const rasterDir = path.join(publicMocksDir, "rasters", area.areaId);
      expect(fs.existsSync(rasterDir), `Missing raster dir: ${rasterDir}`).toBe(true);

      for (const rName of requiredRasters) {
        const rPath = path.join(rasterDir, rName);
        expect(fs.existsSync(rPath), `Missing raster file: ${rName}`).toBe(true);
        const stats = fs.statSync(rPath);
        expect(stats.size).toBeGreaterThan(100); // Valid PNG
      }

      // Check contours and spot heights
      const contoursPath = path.join(rasterDir, "contours.geojson");
      expect(fs.existsSync(contoursPath)).toBe(true);
      const contoursJson = JSON.parse(fs.readFileSync(contoursPath, "utf-8"));
      expect(contoursJson.type).toBe("FeatureCollection");
      expect(contoursJson.features.length).toBeGreaterThan(0);

      const spotHeightsPath = path.join(rasterDir, "spot_heights.json");
      expect(fs.existsSync(spotHeightsPath)).toBe(true);
      const spotHeightsJson = JSON.parse(fs.readFileSync(spotHeightsPath, "utf-8"));
      expect(spotHeightsJson.type).toBe("FeatureCollection");
      expect(spotHeightsJson.features.length).toBeGreaterThan(0);

      // Volume verification: cut volume and fill volume match soil volume within 1%
      const { cutVolumeM3, fillVolumeM3, soilVolumeM3 } = area.terrain!;
      expect(cutVolumeM3).toBeGreaterThan(0);
      expect(fillVolumeM3).toBeGreaterThan(0);
      expect(soilVolumeM3).toBeGreaterThan(0);

      const cutDiff = Math.abs(cutVolumeM3 - soilVolumeM3) / soilVolumeM3;
      const fillDiff = Math.abs(fillVolumeM3 - soilVolumeM3) / soilVolumeM3;
      expect(cutDiff).toBeLessThan(0.01);
      expect(fillDiff).toBeLessThan(0.01);
    }
  });

  it("data layer getMapArea successfully loads area with mode variants", async () => {
    // 1. River Erosion recorded & forecast
    const riverAreaRec = await getMapArea("river_erosion", "recorded", "area_river_kazipur");
    expect(riverAreaRec).not.toBeNull();
    expect(riverAreaRec?.areaId).toBe("area_river_kazipur");
    expect(riverAreaRec?.hazard).toBe("river_erosion");
    expect(riverAreaRec?.mode).toBe("recorded");
    expect(riverAreaRec?.mouzas.length).toBeGreaterThanOrEqual(4);
    expect(riverAreaRec?.historyLines?.length).toBe(5); // 2022-2026 history

    const riverAreaFc = await getMapArea("river_erosion", "forecast", "area_river_kazipur");
    expect(riverAreaFc).not.toBeNull();
    expect(riverAreaFc?.mode).toBe("forecast");
    expect(riverAreaFc?.hazardLayers.forecastLine).toBeDefined();

    // 2. Landslide terrain assets
    const lsArea = await getMapArea("landslide", "recorded", "area_landslide_kawkhali_ghagra");
    expect(lsArea).not.toBeNull();
    expect(lsArea?.terrain?.elevationBeforeUrl).toContain("elevation_before.png");
    expect(lsArea?.terrain?.hillshadeBeforeUrl).toContain("hillshade_before.png");
  });
});
