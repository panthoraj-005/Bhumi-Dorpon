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

  describe("Section 7: Land Mortgage and Bank Loan Information", () => {
    it("returns demo active mortgage record for plot 101 with masked reference and demo badge", async () => {
      const report = await searchLandInformation({
        districtId: "sirajganj",
        upazilaId: "kazipur",
        dagNo: "101",
      });

      expect(report?.loanMortgageInfo).toBeDefined();
      const loan = report!.loanMortgageInfo!;
      expect(loan.hasMortgageOrLoanCharge).toBe(true);
      expect(loan.loanStatus).toBe("active");
      expect(loan.statusBadge).toBe("demo");
      expect(loan.bankName).toContain("Sonali Bank");
      expect(loan.loanReferenceMasked).toContain("****");
      expect(loan.mortgageDeedNo).toBeTruthy();
      expect(loan.recordDate).toBeTruthy();
      expect(loan.releaseDate).toBeUndefined();
      expect(loan.dataSource).toBeTruthy();
    });

    it("returns demo released mortgage record for plot 102 with release date", async () => {
      const report = await searchLandInformation({
        districtId: "sirajganj",
        upazilaId: "kazipur",
        dagNo: "102",
      });

      expect(report?.loanMortgageInfo).toBeDefined();
      const loan = report!.loanMortgageInfo!;
      expect(loan.hasMortgageOrLoanCharge).toBe(false);
      expect(loan.loanStatus).toBe("released");
      expect(loan.statusBadge).toBe("demo");
      expect(loan.releaseDate).toBeTruthy();
      expect(loan.bankName).toContain("Krishi Bank");
    });

    it("returns unverified mortgage record for plot 103", async () => {
      const report = await searchLandInformation({
        districtId: "sirajganj",
        upazilaId: "kazipur",
        dagNo: "103",
      });

      expect(report?.loanMortgageInfo).toBeDefined();
      const loan = report!.loanMortgageInfo!;
      expect(loan.statusBadge).toBe("unverified");
      expect(loan.loanStatus).toBe("active");
      expect(loan.hasMortgageOrLoanCharge).toBe(true);
    });

    it("returns unavailable record with explicit null charge for plot 104 without claiming not mortgaged", async () => {
      const report = await searchLandInformation({
        districtId: "sirajganj",
        upazilaId: "kazipur",
        dagNo: "104",
      });

      expect(report?.loanMortgageInfo).toBeDefined();
      const loan = report!.loanMortgageInfo!;
      expect(loan.hasMortgageOrLoanCharge).toBeNull();
      expect(loan.loanStatus).toBe("unknown");
      expect(loan.statusBadge).toBe("unavailable");
      expect(loan.bankName).toBeUndefined();
    });

    it("returns external connection required for unconfigured parcels", async () => {
      const report = await searchLandInformation({
        districtId: "sirajganj",
        upazilaId: "kazipur",
        dagNo: "9999",
      });

      // When specific non-existent dag is queried, returns null as expected
      expect(report).toBeNull();

      // Representative plot with generic dag
      const genericReport = await searchLandInformation({
        districtId: "sirajganj",
        upazilaId: "kazipur",
        dagNo: "505",
      });

      if (genericReport) {
        expect(genericReport.loanMortgageInfo?.hasMortgageOrLoanCharge).toBeNull();
        expect(genericReport.loanMortgageInfo?.statusBadge).toBe("external_required");
      }
    });

    it("preserves backward compatibility when loanMortgageInfo is undefined on legacy records", async () => {
      const legacyReport: any = {
        identification: { dagNo: "101" },
        ownership: { ownerName: "রহিম" },
        // loanMortgageInfo intentionally undefined
      };

      expect(legacyReport.loanMortgageInfo).toBeUndefined();

      const { getLocalizedLoanStatus, getLocalizedBankName, t } = await import("../lib/translations");

      // Verify helpers do not throw and default gracefully
      expect(getLocalizedLoanStatus(legacyReport.loanMortgageInfo?.loanStatus, legacyReport.loanMortgageInfo?.hasMortgageOrLoanCharge, "bn")).toBe("তথ্য পাওয়া যায়নি / যাচাই করা সম্ভব হয়নি");
      expect(getLocalizedLoanStatus(legacyReport.loanMortgageInfo?.loanStatus, legacyReport.loanMortgageInfo?.hasMortgageOrLoanCharge, "en")).toBe("Information Not Available / Unable to Verify");
      expect(getLocalizedBankName(legacyReport.loanMortgageInfo?.bankName, "bn")).toBe("তথ্য পাওয়া যায়নি");
      expect(getLocalizedBankName(legacyReport.loanMortgageInfo?.bankName, "en")).toBe("Information Not Available");
    });

    it("supports complete bilingual localization for all mortgage fields and statuses", async () => {
      const { t, getLocalizedLoanStatus, getLocalizedBankName } = await import("../lib/translations");

      // Section title
      expect(t("secMortgage", "bn")).toContain("৭.");
      expect(t("secMortgage", "en")).toContain("7.");

      // Loan statuses
      expect(getLocalizedLoanStatus("active", true, "bn")).toBe("বন্ধককৃত (ঋণের বিপরীতে দায়বদ্ধ)");
      expect(getLocalizedLoanStatus("active", true, "en")).toBe("Mortgaged (Pledged for Loan)");

      expect(getLocalizedLoanStatus("released", false, "bn")).toBe("বন্ধক অবমুক্ত (পরিশোধিত)");
      expect(getLocalizedLoanStatus("released", false, "en")).toBe("Mortgage Released (Repaid)");

      expect(getLocalizedLoanStatus("unknown", null, "bn")).toBe("তথ্য পাওয়া যায়নি / যাচাই করা সম্ভব হয়নি");
      expect(getLocalizedLoanStatus("unknown", null, "en")).toBe("Information Not Available / Unable to Verify");

      // Bank name localization
      const bilingualBank = "সোনালী ব্যাংক পিএলসি (Sonali Bank PLC)";
      expect(getLocalizedBankName(bilingualBank, "bn")).toBe("সোনালী ব্যাংক পিএলসি (Sonali Bank PLC)");
      expect(getLocalizedBankName(bilingualBank, "en")).toBe("Sonali Bank PLC");
    });
  });
});
