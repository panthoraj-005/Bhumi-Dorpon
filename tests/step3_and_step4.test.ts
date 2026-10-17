import { describe, it, expect } from "vitest";
import {
  getOptions,
  getDashboardSummary,
  getHazardResult,
  listFloods,
  getFlood,
  getFloodOwners,
} from "@/lib/data";
import { getStepsForHazard } from "@/components/SelectorChain";
import { HazardType } from "@/lib/types";

describe("STEP 3: Selector Hierarchy & getOptions Integration", () => {
  it("getStepsForHazard defines precise cascading steps for all five modules", () => {
    const hazards: HazardType[] = ["river_erosion", "flood", "landslide", "char", "coastal"];
    
    for (const h of hazards) {
      const steps = getStepsForHazard(h);
      expect(steps.length).toBeGreaterThanOrEqual(3);
      expect(steps[0].key).toBe("d"); // First step is always district
      expect(steps[1].key).toBe("u"); // Second step is always upazila
    }

    expect(getStepsForHazard("river_erosion").map((s) => s.key)).toEqual(["d", "u", "r", "m"]);
    expect(getStepsForHazard("flood").map((s) => s.key)).toEqual(["d", "u", "m", "year"]);
    expect(getStepsForHazard("landslide").map((s) => s.key)).toEqual(["d", "u", "h", "ev"]);
    expect(getStepsForHazard("char").map((s) => s.key)).toEqual(["d", "u", "r", "m"]);
    expect(getStepsForHazard("coastal").map((s) => s.key)).toEqual(["d", "u", "m"]);
  });

  it("getOptions lists only valid child options for the parent selection", async () => {
    // 1. Kazipur (Sirajganj) has Jamuna river
    const rivers = await getOptions("river_erosion", "recorded", "river", {
      d: "sirajganj",
      u: "kazipur",
    });
    expect(rivers.length).toBeGreaterThan(0);
    expect(rivers.some((r) => r.id === "jamuna")).toBe(true);

    // 2. Kamarkhanda (Sirajganj) has no rivers running through it
    const kamarkhandaRivers = await getOptions("river_erosion", "recorded", "river", {
      d: "sirajganj",
      u: "kamarkhanda",
    });
    expect(kamarkhandaRivers.length).toBe(0);

    // 3. Mouzas for Kazipur + Jamuna list only riverside mouzas in Kazipur
    const mouzas = await getOptions("river_erosion", "recorded", "mouza", {
      d: "sirajganj",
      u: "kazipur",
      r: "jamuna",
    });
    expect(mouzas.length).toBeGreaterThan(0);
    expect(mouzas.every((m) => m.id.includes("kazipur"))).toBe(true);
  });

  it("getOptions marks options that have records with hasRecords = true", async () => {
    const districts = await getOptions("river_erosion", "recorded", "district", {});
    const sirajganj = districts.find((d) => d.id === "sirajganj");
    expect(sirajganj).toBeDefined();
    expect(sirajganj?.hasRecords).toBe(true);

    const mouzas = await getOptions("river_erosion", "recorded", "mouza", {
      d: "sirajganj",
      u: "kazipur",
      r: "jamuna",
    });
    const mouzaWithRecords = mouzas.find((m) => m.hasRecords === true);
    expect(mouzaWithRecords).toBeDefined();
  });

  it("flood year options are dynamically derived from flood events", async () => {
    const years = await getOptions("flood", "recorded", "year", {
      d: "sylhet",
      u: "gowainghat",
      m: "mouza_gowainghat_2",
    });
    expect(years.length).toBeGreaterThan(0);
    expect(years.some((y) => y.id === "2022")).toBe(true);
  });
});

describe("STEP 4: OwnerTable Variants & Rule 5 Invariants", () => {
  it("recorded hazard results have full owner records with Dag No. and Khatian No.", async () => {
    const result = await getHazardResult("river_erosion", "recorded", "mouza_kazipur_1");
    expect(result).not.toBeNull();
    expect(result!.owners.length).toBeGreaterThan(0);

    for (const owner of result!.owners) {
      expect(owner.dagNo).toBeDefined();
      expect(owner.khatianNo).toBeDefined();
      expect(owner.lossDecimal + owner.gainDecimal).toBeGreaterThan(0);
      expect(owner.estimatedCompensationBDT).toBeGreaterThan(0);
      expect(owner.compensationStatus).toBeDefined();
    }
  });

  it("forecast hazard results strictly strip compensationStatus and paidAmountBDT (Rule 5)", async () => {
    const result = await getHazardResult("river_erosion", "forecast", "mouza_kazipur_1");
    expect(result).not.toBeNull();
    expect(result!.owners.length).toBeGreaterThan(0);

    for (const owner of result!.owners) {
      expect(owner.dagNo).toBeDefined();
      expect(owner.khatianNo).toBeDefined();
      expect(owner.estimatedCompensationBDT).toBeGreaterThan(0);
      // Status and paid amounts must NOT exist in forecast mode
      expect((owner as any).compensationStatus).toBeUndefined();
      expect((owner as any).paidAmountBDT).toBeUndefined();
    }
  });

  it("Dashboard summary in forecast mode completely excludes paid, approved, and pending amounts (Rule 5)", async () => {
    const forecastSummary = await getDashboardSummary("forecast");
    expect((forecastSummary as any).paidCompensationBDT).toBeUndefined();
    expect((forecastSummary as any).approvedCompensationBDT).toBeUndefined();
    expect((forecastSummary as any).pendingCompensationBDT).toBeUndefined();
    expect(forecastSummary.totalCompensationBDT).toBeGreaterThan(0);
    expect(forecastSummary.totalLossDecimal).toBeGreaterThan(0);

    const recordedSummary = await getDashboardSummary("recorded");
    expect(recordedSummary.paidCompensationBDT).toBeDefined();
    expect(recordedSummary.approvedCompensationBDT).toBeDefined();
    expect(recordedSummary.pendingCompensationBDT).toBeDefined();
  });

  it("Flood owner records include depthClass, flooded area, Dag No., and Khatian No.", async () => {
    const floods = await listFloods({ mouzaId: "mouza_gowainghat_2" });
    expect(floods.length).toBeGreaterThan(0);
    const flood = await getFlood(floods[0].id);
    expect(flood).not.toBeNull();
    expect(flood!.plotStatus.length).toBeGreaterThan(0);

    const plot = flood!.plotStatus[0];
    expect(plot.dagNo).toBeDefined();
    expect(plot.khatianNo).toBeDefined();
    expect(plot.depthClass).toBeDefined();
    expect(["shallow", "moderate", "deep", "none"]).toContain(plot.depthClass);
  });
});
