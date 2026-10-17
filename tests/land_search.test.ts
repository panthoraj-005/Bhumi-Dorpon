import { describe, it, expect } from "vitest";
import { searchLandInformation } from "../lib/landSearch";

describe("Land Information Search Service", () => {
  it("searches cadastral land record by district, upazila, mouza, dag, and khatian", async () => {
    const report = await searchLandInformation({
      districtId: "sirajganj",
      upazilaId: "kazipur",
      mouzaId: "mouza_kazipur_1",
      dagNo: "101",
      khatianNo: "RS-475",
    });

    expect(report).toBeDefined();
    expect(report?.isFound).toBe(true);
    expect(report?.identification.dagNo).toBe("101");
    expect(report?.identification.khatianNo).toBe("RS-475");
    expect(report?.identification.districtId).toBe("sirajganj");
    expect(report?.identification.upazilaId).toBe("kazipur");
    expect(report?.identification.mouzaId).toBe("mouza_kazipur_1");

    // Check 4 corners geometry
    expect(report?.identification.corners.length).toBe(4);
    expect(report?.identification.corners[0].label).toBe("NW");
    expect(report?.identification.corners[1].label).toBe("NE");
    expect(report?.identification.corners[2].label).toBe("SE");
    expect(report?.identification.corners[3].label).toBe("SW");
  });

  it("preserves leading zeros in dag number without string truncation", async () => {
    // If dag is "101" and we query "101"
    const report = await searchLandInformation({
      districtId: "sirajganj",
      upazilaId: "kazipur",
      dagNo: "101",
    });
    expect(report).toBeDefined();
    expect(typeof report?.identification.dagNo).toBe("string");
    expect(report?.identification.dagNo).toBe("101");
  });

  it("returns structured sections: Ownership, Sale, Legal, Tax, Registration History", async () => {
    const report = await searchLandInformation({
      districtId: "sirajganj",
      upazilaId: "kazipur",
      dagNo: "101",
    });

    expect(report?.ownership.ownerName).toBeTruthy();
    expect(report?.ownership.fatherName).toBeTruthy();
    expect(report?.ownership.verificationStatus).toBe("demo");

    expect(report?.sale.isListedForSale).toBe(false);
    expect(report?.sale.statusBadge).toBe("external_required");

    expect(report?.legal.hasPendingDispute).toBe(false);
    expect(report?.legal.verificationStatus).toBe("external_required");

    expect(report?.tax.taxStatus).toBe("up_to_date");
    expect(report?.tax.outstandingAmountBDT).toBe(0);

    expect(report?.history.registrationDeedNo).toBeTruthy();
    expect(report?.history.mutationKhatianNo).toBeTruthy();
  });

  it("returns Section 5 Disaster Analysis with genuine DL risk predictions and historical land change", async () => {
    const report = await searchLandInformation({
      districtId: "sirajganj",
      upazilaId: "kazipur",
      dagNo: "101",
    });

    // 5.1 Historical land loss records
    expect(report?.disasterHistory.length).toBeGreaterThan(0);
    const erosionEvent = report?.disasterHistory.find((d) => d.disasterType === "river_erosion");
    expect(erosionEvent).toBeDefined();
    expect(erosionEvent?.affectedAreaDecimal).toBeGreaterThan(0);

    // 5.2 Deep learning risk predictions
    expect(report?.futurePredictions.length).toBe(4);
    const riverPred = report?.futurePredictions.find((p) => p.hazardType === "river_erosion");
    expect(riverPred).toBeDefined();
    expect(riverPred?.probabilityPercent).toBeGreaterThan(0);
    expect(riverPred?.modelName).toContain("GeoAI-BD");
    expect(riverPred?.isModelEstimate).toBe(true);

    // 5.3 Completely submerged parcel handling
    expect(report?.identification.physicalStatus).toBe("historically_lost");
    expect(erosionEvent?.isHistoricallySubmerged).toBe(true);
  });
});
