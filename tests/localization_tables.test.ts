import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  getLocalizedHillName,
  getLocalizedLocationLabel,
  getLocalizedPeriodLabel,
  getLocalizedAssessmentTitle,
  getLocalizedOwnerId,
  getLocalizedOwnerName,
  getLocalizedLandClass,
  getLocalizedDepthClass,
  getLocalizedCompensationStatus,
  formatNumberLocalized,
  formatDateLocalized,
  HILLS_BN,
} from "../lib/translations";
import { LANDSLIDE_EVENTS } from "../lib/landslideEvents";

const ALLOWLIST = new Set([
  "GIS",
  "INSAR",
  "KML",
  "GEOJSON",
  "CSV",
  "BDT",
  "DL",
  "M",
  "MM",
  "KM",
  "NW",
  "NE",
  "SE",
  "SW",
  "RS",
  "CS",
  "SA",
]);

describe("Bangla Table & Data Localization Regression Tests (Change 4 Section C)", () => {
  it("resolves every hill in hills.json to Bangla using both ID and English display name", () => {
    const hillsPath = path.resolve(process.cwd(), "public/mocks/hills.json");
    const hills = JSON.parse(fs.readFileSync(hillsPath, "utf-8"));

    expect(hills.length).toBeGreaterThan(0);

    for (const hill of hills) {
      // 1. Lookup by ID
      const byId = getLocalizedHillName(hill.id, "bn");
      expect(byId).toBeTruthy();
      expect(byId).not.toBe(hill.name); // Must be translated to Bangla, not original English name
      expect(/[\u0980-\u09FF]/.test(byId)).toBe(true); // Must contain Bengali glyphs

      // 2. Lookup by English display name
      const byName = getLocalizedHillName(hill.name, "bn");
      expect(byName).toBeTruthy();
      expect(byName).toBe(byId);
      expect(/[\u0980-\u09FF]/.test(byName)).toBe(true);
    }
  });

  it("resolves every landslide event in LANDSLIDE_EVENTS to a valid Bangla event name and impact summary", () => {
    expect(LANDSLIDE_EVENTS.length).toBe(13);

    for (const event of LANDSLIDE_EVENTS) {
      expect(event.eventNameBn).toBeTruthy();
      expect(/[\u0980-\u09FF]/.test(event.eventNameBn)).toBe(true);

      expect(event.impactSummaryBn).toBeTruthy();
      expect(/[\u0980-\u09FF]/.test(event.impactSummaryBn)).toBe(true);

      expect(event.locationBn).toBeTruthy();
      expect(/[\u0980-\u09FF]/.test(event.locationBn)).toBe(true);
    }
  });

  it("resolves all locationLabel strings in all mock JSON files to Bangla without English risk suffixes", () => {
    const mocksDir = path.resolve(process.cwd(), "public/mocks");
    const files = fs.readdirSync(mocksDir).filter((f) => f.endsWith(".json"));

    const distinctLabels = new Set<string>();

    for (const file of files) {
      const content = fs.readFileSync(path.join(mocksDir, file), "utf-8");
      try {
        const data = JSON.parse(content);
        const searchLabels = (obj: any) => {
          if (!obj || typeof obj !== "object") return;
          if (typeof obj.locationLabel === "string") {
            distinctLabels.add(obj.locationLabel);
          }
          for (const k of Object.keys(obj)) {
            searchLabels(obj[k]);
          }
        };
        searchLabels(data);
      } catch {
        // ignore non-json or malformed
      }
    }

    expect(distinctLabels.size).toBeGreaterThan(0);

    Array.from(distinctLabels).forEach((label) => {
      const localized = getLocalizedLocationLabel(label, "bn");
      expect(localized).toBeTruthy();
      // Should not contain untranslated English risk suffixes like "| High Risk Slope Zone"
      expect(localized).not.toContain("High Risk Slope Zone");
      expect(localized).not.toContain("Estuary Projection");
      expect(localized).not.toContain("Active Channel");
      expect(localized).not.toContain("Flood Channel");
      expect(localized).not.toContain("Bay of Bengal Estuary");
      expect(localized).not.toContain("Hill Tracts Corridor");
    });
  });

  it("properly localizes technical owner IDs to human-readable Bangla format", () => {
    expect(getLocalizedOwnerId("owner_35", "bn")).toBe("মালিক নং ৩৫");
    expect(getLocalizedOwnerId("owner_101", "bn")).toBe("মালিক নং ১০১");
    expect(getLocalizedOwnerId("owner_35", "en")).toBe("Owner #35");
  });

  it("properly localizes depth classes, land classes, and compensation statuses", () => {
    expect(getLocalizedDepthClass("deep", "bn")).toBe("গভীর (>১.৫ মি.)");
    expect(getLocalizedDepthClass("shallow", "bn")).toBe("অগভীর (<০.৫ মি.)");
    expect(getLocalizedDepthClass("moderate", "bn")).toBe("মাঝারি (০.৫–১.৫ মি.)");

    expect(getLocalizedLandClass("nal", "bn")).toBe("নাল (কৃষি জমি)");
    expect(getLocalizedLandClass("bhiti", "bn")).toBe("ভিটি (উঁচু জমি)");

    expect(getLocalizedCompensationStatus("paid", "bn")).toBe("পরিশোধিত");
    expect(getLocalizedCompensationStatus("approved", "bn")).toBe("অনুমোদিত");
    expect(["প্রক্রিয়াধীন", "বিচারাধীন"]).toContain(getLocalizedCompensationStatus("pending", "bn"));
  });

  it("correctly localizes dates into Bengali day, month name, and year", () => {
    expect(formatDateLocalized("2024-06-18", "bn")).toBe("১৮ জুন ২০২৪");
    expect(formatDateLocalized("2020-07-25", "bn")).toBe("২৫ জুলাই ২০২০");
    expect(formatDateLocalized("2024-06-18", "en")).toBe("2024-06-18");
  });
});
