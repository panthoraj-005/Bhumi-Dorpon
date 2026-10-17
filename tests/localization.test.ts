import { describe, it, expect } from "vitest";
import { t, formatNumberLocalized, TRANSLATIONS } from "../lib/translations";

describe("Centralized Localization System", () => {
  it("defaults to Bangla strings and properly retrieves English counterparts", () => {
    expect(t("appName", "bn")).toBe("ভূমিদর্পণ");
    expect(t("appName", "en")).toBe("BhumiDorpon");

    expect(t("demoAccessButton", "bn")).toBe("ডেমো হিসেবে প্রবেশ করুন");
    expect(t("demoAccessButton", "en")).toBe("Enter as Demo");

    expect(t("navLandInfo", "bn")).toBe("ভূমির তথ্য");
    expect(t("navLandInfo", "en")).toBe("Land Information");

    expect(t("exploreDisastersBtn", "bn")).toBe("দুর্যোগসমূহ দেখুন");
    expect(t("exploreDisastersBtn", "en")).toBe("Explore Disasters");
  });

  it("properly converts ASCII digits to Bengali numerals for 'bn' language", () => {
    expect(formatNumberLocalized(101, "bn")).toBe("১০১");
    expect(formatNumberLocalized("0101", "bn")).toBe("০১০১");
    expect(formatNumberLocalized("2024", "bn")).toBe("২০২৪");
    expect(formatNumberLocalized(8420.5, "bn")).toBe("৮৪২০.৫");
  });

  it("preserves original numbers for 'en' language", () => {
    expect(formatNumberLocalized(101, "en")).toBe("101");
    expect(formatNumberLocalized("0101", "en")).toBe("0101");
  });

  it("contains all required translation keys across navigation, search, and badges", () => {
    const requiredKeys = [
      "appName",
      "demoAccessButton",
      "navLandInfo",
      "exploreDisastersBtn",
      "secLandId",
      "secOwnership",
      "secSale",
      "secLegal",
      "secTax",
      "secHistory",
      "secDisasterAnalysis",
      "badgeVerified",
      "badgeDemo",
      "badgeUnverified",
      "badgeUnavailable",
      "badgeExternalRequired",
      "mountainLabel",
      "eventLabel",
    ] as const;

    for (const k of requiredKeys) {
      expect(TRANSLATIONS[k]).toBeDefined();
      expect(TRANSLATIONS[k].bn).toBeTruthy();
      expect(TRANSLATIONS[k].en).toBeTruthy();
    }
  });
});
