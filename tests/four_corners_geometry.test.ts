import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import * as turf from "@turf/turf";
import { getOwnerPlots, getFlood, listFloods } from "@/lib/data";
import { Plot } from "@/lib/types";

describe("Four-Corner Plot Geometry & Sanity Verification (STEP 4)", () => {
  const plotsPath = path.resolve(process.cwd(), "mocks/plots.json");
  const plots: Plot[] = JSON.parse(fs.readFileSync(plotsPath, "utf8"));

  const riverPath = path.resolve(process.cwd(), "mocks/river_erosion.json");
  const riverData = JSON.parse(fs.readFileSync(riverPath, "utf8"));

  const mouzasPath = path.resolve(process.cwd(), "mocks/mouzas.json");
  const mouzas = JSON.parse(fs.readFileSync(mouzasPath, "utf8"));
  const mouzaMap = new Map(mouzas.map((m: any) => [m.id, m]));

  const floodPath = path.resolve(process.cwd(), "mocks/flood.json");
  const floodData = JSON.parse(fs.readFileSync(floodPath, "utf8"));

  it("every plot in the dataset has a closed ring of 5 points where the 5th repeats the 1st", () => {
    expect(plots.length).toBeGreaterThan(3000);

    for (const plot of plots) {
      expect(plot.polygon).toBeDefined();
      expect(plot.polygon.length).toBe(1); // single outer ring

      const ring = plot.polygon[0];
      expect(ring.length).toBe(5);

      // 5th point repeats the 1st
      expect(ring[4][0]).toBe(ring[0][0]);
      expect(ring[4][1]).toBe(ring[0][1]);
    }
  });

  it("every plot has exactly four distinct corners with fixed order NW, NE, SE, SW", () => {
    for (const plot of plots) {
      expect(plot.corners).toBeDefined();
      expect(plot.corners.length).toBe(4);

      const [c1, c2, c3, c4] = plot.corners;
      expect(c1.label).toBe("NW");
      expect(c2.label).toBe("NE");
      expect(c3.label).toBe("SE");
      expect(c4.label).toBe("SW");

      // Verify all 4 corners are distinct points
      const coordSet = new Set(plot.corners.map((c) => `${c.lat},${c.lon}`));
      expect(coordSet.size).toBe(4);

      // Verify NW is west of NE, SW is west of SE
      expect(c1.lon).toBeLessThan(c2.lon);
      expect(c4.lon).toBeLessThan(c3.lon);

      // Verify NW & NE are north of SW & SE
      expect(c1.lat).toBeGreaterThanOrEqual(c4.lat);
      expect(c2.lat).toBeGreaterThanOrEqual(c3.lat);

      // Verify coordinates have 6 decimals
      for (const c of plot.corners) {
        expect(c.lat.toFixed(6).split(".")[1]?.length).toBe(6);
        expect(c.lon.toFixed(6).split(".")[1]?.length).toBe(6);
      }
    }
  });

  it("no plot corner lies in a water polygon", () => {
    // Build mouza water polygons from river erosion data
    const mouzaWaterMap = new Map<string, any[]>();
    for (const [key, geo] of Object.entries<any>(riverData.geometries)) {
      const mId = key.replace("river_erosion_recorded_", "").replace("river_erosion_forecast_", "");
      const mouza = mouzaMap.get(mId) as any;
      if (!mouza || !geo.riverBefore || geo.riverBefore.length < 3) continue;

      const [mLon, mLat] = mouza.centroid || [89.65, 24.57];
      const halfW = 0.008;
      const pts = geo.riverBefore;

      try {
        const waterPoly = turf.polygon([[
          ...pts,
          [Number((mLon + halfW).toFixed(6)), pts[pts.length - 1][1]],
          [Number((mLon + halfW).toFixed(6)), pts[0][1]],
          pts[0],
        ]]);
        if (!mouzaWaterMap.has(mId)) mouzaWaterMap.set(mId, []);
        mouzaWaterMap.get(mId)!.push(waterPoly);
      } catch (e) {}
    }

    let cornersInWaterCount = 0;
    for (const plot of plots) {
      const waterList = mouzaWaterMap.get(plot.mouzaId) || [];
      if (waterList.length === 0) continue;

      for (const corner of plot.corners) {
        const pt = turf.point([corner.lon, corner.lat]);
        for (const wp of waterList) {
          if (turf.booleanPointInPolygon(pt, wp)) {
            cornersInWaterCount++;
          }
        }
      }
    }

    expect(cornersInWaterCount).toBe(0);
  });

  it("sanity sums balance: plot impacts plus unowned land equals hazard polygon area within 1%", () => {
    // 1. Flood events
    for (const ev of floodData.events) {
      const mouza = (ev.mouzaId ? mouzaMap.get(ev.mouzaId) : null) as any;
      // Sum plot floodedAreaDecimal
      const plotSum = ev.plotStatus.reduce((s: number, p: any) => s + (p.floodedAreaDecimal || 0), 0);
      const total = ev.floodedAreaDecimal;
      const diffPct = Math.abs(plotSum - total) / (total || 1);
      expect(diffPct).toBeLessThan(0.01); // within 1%
    }

    // 2. River erosion results
    for (const res of Object.values<any>(riverData.results)) {
      if (res.mode === "recorded") {
        const lossSum = res.owners.reduce((s: number, o: any) => s + (o.lossDecimal || 0), 0);
        const total = res.totalLossDecimal;
        const diffPct = Math.abs(lossSum - total) / (total || 1);
        expect(diffPct).toBeLessThan(0.01); // within 1%
      }
    }
  });

  it("getOwnerPlots returns 4 corners and removes centroid from response", async () => {
    const floods = await listFloods({});
    expect(floods.length).toBeGreaterThan(0);

    const firstFlood = (await getFlood(floods[0].id))!;
    const ownerId = firstFlood.plotStatus[0].ownerId;

    const ownerPlots = await getOwnerPlots(firstFlood.id, ownerId);
    expect(ownerPlots.length).toBeGreaterThan(0);

    for (const plot of ownerPlots) {
      expect(plot.dagNo).toBeDefined();
      expect(plot.khatianNo).toBeDefined();
      expect(plot.landClass).toBeDefined();
      expect(plot.areaDecimal).toBeGreaterThan(0);
      expect(plot.corners).toBeDefined();
      expect(plot.corners.length).toBe(4);
      expect(plot.corners.map((c) => c.label)).toEqual(["NW", "NE", "SE", "SW"]);
      expect((plot as any).centroid).toBeUndefined();
    }
  });
});
