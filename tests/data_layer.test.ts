import { describe, it, expect } from "vitest";
import {
  getDashboardSummary,
  getOptions,
  listResults,
  getResult,
  listFloods,
  getFlood,
  getFloodOwners,
  getOwnerPlots,
} from "@/lib/data";

describe("Data Layer Verification (STEP 2)", () => {
  it("getDashboardSummary correctly returns summary aggregated from datasets", async () => {
    const recordedSummary = await getDashboardSummary("recorded");
    expect(recordedSummary).toBeDefined();
    expect(recordedSummary.mode).toBe("recorded");
    expect(recordedSummary.totalLossDecimal).toBeGreaterThan(0);
    expect(recordedSummary.totalCompensationBDT).toBeGreaterThan(0);
    expect(recordedSummary.paidCompensationBDT).toBeDefined();
    expect(recordedSummary.approvedCompensationBDT).toBeDefined();
    expect(recordedSummary.pendingCompensationBDT).toBeDefined();

    // Verify Rule 5: Forecast MUST NOT include paid/approved/pending fields
    const forecastSummary = await getDashboardSummary("forecast");
    expect(forecastSummary).toBeDefined();
    expect(forecastSummary.mode).toBe("forecast");
    expect(forecastSummary.totalCompensationBDT).toBeGreaterThan(0);
    expect(forecastSummary.paidCompensationBDT).toBeUndefined();
    expect(forecastSummary.approvedCompensationBDT).toBeUndefined();
    expect(forecastSummary.pendingCompensationBDT).toBeUndefined();
  });

  it("getOptions provides cascading choices derived from datasets", async () => {
    // 1. Districts for river_erosion
    const districts = await getOptions("river_erosion", "recorded", "district", {});
    expect(districts.length).toBeGreaterThanOrEqual(12);
    expect(districts.some((d) => d.id === "sirajganj")).toBe(true);
    expect(districts.some((d) => d.id === "kurigram")).toBe(true);
    expect(districts.some((d) => d.id === "bhola")).toBe(true);

    // 2. Upazilas for Sirajganj
    const upazilas = await getOptions("river_erosion", "recorded", "upazila", { district: "sirajganj" });
    expect(upazilas.length).toBeGreaterThanOrEqual(3);
    expect(upazilas.some((u) => u.id === "kazipur")).toBe(true);

    // 3. Rivers for Kazipur
    const rivers = await getOptions("river_erosion", "recorded", "river", {
      district: "sirajganj",
      upazila: "kazipur",
    });
    expect(rivers.length).toBeGreaterThanOrEqual(1);

    // 4. Mouzas for Kazipur
    const mouzas = await getOptions("river_erosion", "recorded", "mouza", {
      district: "sirajganj",
      upazila: "kazipur",
    });
    expect(mouzas.length).toBeGreaterThanOrEqual(3);
  });

  it("listResults & getResult return typed hazard results with Dag No. and Khatian No.", async () => {
    const results = await listResults("river_erosion", "recorded", { upazila: "kazipur" });
    expect(results.length).toBeGreaterThan(0);

    const first = results[0];
    expect(first.hazard).toBe("river_erosion");
    expect(first.mode).toBe("recorded");
    expect(first.totalLossDecimal).toBeGreaterThan(0);

    // Verify Rule 4: Dag No. and Khatian No. present on all owner records
    for (const owner of first.owners) {
      expect(owner.dagNo).toBeDefined();
      expect(owner.khatianNo).toBeDefined();
    }

    const fetched = await getResult("river_erosion", "recorded", first.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(first.id);
  });

  it("listFloods, getFlood, getFloodOwners & getOwnerPlots work as specified", async () => {
    const floods = await listFloods({});
    expect(floods.length).toBeGreaterThan(0);

    const firstFlood = floods[0];
    expect(firstFlood.id).toBeDefined();
    expect(firstFlood.floodedAreaDecimal).toBeGreaterThan(0);
    expect(firstFlood.geometry.mouzaBoundary).toBeDefined();

    const singleFlood = await getFlood(firstFlood.id);
    expect(singleFlood).not.toBeNull();
    expect(singleFlood?.id).toBe(firstFlood.id);

    // Flood Owners
    const owners = await getFloodOwners(firstFlood.id);
    expect(owners.length).toBeGreaterThan(0);
    const sampleOwner = owners[0];
    expect(sampleOwner.dagNo).toBeDefined();
    expect(sampleOwner.khatianNo).toBeDefined();
    expect(sampleOwner.depthClass).toBeDefined();
    expect(sampleOwner.centroid).toBeDefined();

    // Query flood owners with filter
    const filteredOwners = await getFloodOwners(firstFlood.id, sampleOwner.ownerName.slice(0, 3));
    expect(filteredOwners.length).toBeGreaterThan(0);

    // Owner Plots
    const ownerPlots = await getOwnerPlots(firstFlood.id, sampleOwner.ownerId);
    expect(ownerPlots.length).toBeGreaterThan(0);
    expect(ownerPlots[0].dagNo).toBe(sampleOwner.dagNo);
    expect(ownerPlots[0].corners).toBeDefined();
    expect(ownerPlots[0].corners.length).toBe(4);
    expect(["NW", "NE", "SE", "SW"]).toContain(ownerPlots[0].corners[0].label);
    expect((ownerPlots[0] as any).centroid).toBeUndefined();
    expect(ownerPlots[0].boundaryCoordinates).toBeDefined();
  });
});
