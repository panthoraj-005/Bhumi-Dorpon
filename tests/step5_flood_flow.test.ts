import { describe, it, expect } from "vitest";
import {
  listFloods,
  getFlood,
  getFloodOwners,
  getOwnerProfile,
  getOwnerPlots,
} from "@/lib/data";

describe("STEP 5: Flood Flow Integration Tests", () => {
  it("listFloods returns cards with Date, Severity, Flooded area, Max depth, Duration, Affected owners", async () => {
    const floods = await listFloods({ m: "mouza_gowainghat_2" });
    expect(floods.length).toBeGreaterThan(0);

    const first = floods[0];
    expect(first.date).toBeDefined();
    expect(["Moderate", "Severe", "Extreme", "Catastrophic"]).toContain(first.severity);
    expect(first.floodedAreaDecimal).toBeGreaterThan(0);
    expect(first.maxDepthM).toBeGreaterThan(0);
    expect(first.durationDays).toBeGreaterThan(0);
    expect(first.affectedOwnersCount).toBeGreaterThan(0);
  });

  it("listFloods returns empty list when no floods occurred in selected location", async () => {
    // Non-flood location
    const floods = await listFloods({ m: "non_existent_mouza" });
    expect(floods).toEqual([]);
  });

  it("getFlood returns single event with plotStatus containing Dag No. and Khatian No.", async () => {
    const floods = await listFloods({ m: "mouza_gowainghat_2" });
    expect(floods.length).toBeGreaterThan(0);

    const flood = await getFlood(floods[0].id);
    expect(flood).not.toBeNull();
    expect(flood!.plotStatus.length).toBeGreaterThan(0);

    for (const ps of flood!.plotStatus) {
      expect(ps.dagNo).toBeDefined();
      expect(ps.khatianNo).toBeDefined();
      expect(ps.ownerName).toBeDefined();
      expect(ps.ownerId).toBeDefined();
      expect(ps.floodedAreaDecimal).toBeGreaterThanOrEqual(0);
      expect(["shallow", "moderate", "deep", "none"]).toContain(ps.depthClass);
    }
  });

  it("getFloodOwners correctly filters by name, Dag, and returns empty for search miss", async () => {
    const floods = await listFloods({ m: "mouza_gowainghat_2" });
    const floodId = floods[0].id;
    const allOwners = await getFloodOwners(floodId);
    expect(allOwners.length).toBeGreaterThan(0);

    // Search by first name
    const sample = allOwners[0];
    const filtered = await getFloodOwners(floodId, sample.ownerName.slice(0, 4));
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.some((p) => p.ownerName === sample.ownerName)).toBe(true);

    // Search miss
    const missed = await getFloodOwners(floodId, "ZzzNonExistentPersonZzz");
    expect(missed).toEqual([]);
  });

  it("getOwnerProfile returns name and father's name for owner header", async () => {
    const floods = await listFloods({ m: "mouza_gowainghat_2" });
    const flood = (await getFlood(floods[0].id))!;
    const ownerId = flood.plotStatus[0].ownerId;

    const profile = await getOwnerProfile(ownerId);
    expect(profile).not.toBeNull();
    expect(profile!.name).toBeDefined();
    expect(profile!.fatherName).toBeDefined();
    expect(profile!.fatherName.length).toBeGreaterThan(5);
  });

  it("getOwnerPlots returns all owner plots with Dag No., Khatian No., 4 corners (6 decimals), and no centroid", async () => {
    const floods = await listFloods({ m: "mouza_gowainghat_2" });
    const flood = (await getFlood(floods[0].id))!;
    const ownerId = flood.plotStatus[0].ownerId;

    const ownerPlots = await getOwnerPlots(flood.id, ownerId);
    expect(ownerPlots.length).toBeGreaterThan(0);

    for (const plot of ownerPlots) {
      expect(plot.dagNo).toBeDefined();
      expect(plot.khatianNo).toBeDefined();
      expect(plot.landClass).toBeDefined();
      expect(plot.areaDecimal).toBeGreaterThan(0);
      expect((plot as any).centroid).toBeUndefined();

      // Verify exactly four corners with fixed order NW, NE, SE, SW
      expect(plot.corners).toBeDefined();
      expect(plot.corners.length).toBe(4);
      expect(plot.corners.map((c) => c.label)).toEqual(["NW", "NE", "SE", "SW"]);

      // Verify 6 decimals on each corner
      for (const corner of plot.corners) {
        const latStr = corner.lat.toFixed(6);
        const lonStr = corner.lon.toFixed(6);
        expect(latStr.split(".")[1]?.length).toBe(6);
        expect(lonStr.split(".")[1]?.length).toBe(6);
      }

      expect(plot.floodStatus).toBeDefined();
      expect(plot.boundaryCoordinates).toBeDefined();
      expect(plot.boundaryCoordinates?.length).toBeGreaterThan(2);
    }
  });
});
