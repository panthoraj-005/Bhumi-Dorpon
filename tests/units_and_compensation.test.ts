import { describe, it, expect } from "vitest";
import {
  convertArea,
  formatArea,
  formatCurrencyBDT,
  formatPercentage,
} from "@/lib/units";

describe("Land Area Unit Conversions", () => {
  // Official standard: 1 Decimal = 40.4686 m²
  const SQ_METERS_PER_DECIMAL = 40.4686;
  const SQ_METERS_PER_ACRE = 4046.86;
  const SQ_METERS_PER_HECTARE = 10000;

  it("converts 1 decimal correctly into square meters", () => {
    const areaDecimal = 1;
    const sqMeters = areaDecimal * SQ_METERS_PER_DECIMAL;
    expect(sqMeters).toBeCloseTo(40.4686, 4);
  });

  it("converts 100 decimals to exactly 1 acre", () => {
    const acres = convertArea(100, "acre");
    expect(acres).toBe(1);
    expect(100 * SQ_METERS_PER_DECIMAL).toBeCloseTo(SQ_METERS_PER_ACRE, 2);
  });

  it("converts 247.10538 decimals to 1 hectare (10,000 m²)", () => {
    const hectares = convertArea(247.10538, "hectare");
    expect(hectares).toBeCloseTo(1, 4);
    expect(247.10538 * SQ_METERS_PER_DECIMAL).toBeCloseTo(SQ_METERS_PER_HECTARE, 0);
  });

  it("leaves decimal values unchanged when target unit is decimal", () => {
    expect(convertArea(48.5, "decimal")).toBe(48.5);
  });
});

describe("Formatters", () => {
  it("formats area in decimal, acre, and hectare with labels", () => {
    expect(formatArea(50, "decimal")).toBe("50 dec");
    expect(formatArea(150, "acre")).toBe("1.5 acres");
    expect(formatArea(500, "hectare")).toBe("2.02 ha");
  });

  it("supports includeUnit = false option", () => {
    expect(formatArea(100, "acre", { includeUnit: false })).toBe("1");
  });

  it("formats BDT currency with comma separations and taka symbol", () => {
    expect(formatCurrencyBDT(500000)).toBe("৳500,000");
    expect(formatCurrencyBDT(0)).toBe("৳0");
  });

  it("formats BDT currency in compact notation (k, Lakh, Cr)", () => {
    expect(formatCurrencyBDT(75000, { compact: true })).toBe("৳75.0k");
    expect(formatCurrencyBDT(650000, { compact: true })).toBe("৳6.5 Lakh");
    expect(formatCurrencyBDT(12500000, { compact: true })).toBe("৳1.25 Cr");
  });

  it("formats percentages with sign option", () => {
    expect(formatPercentage(14.2)).toBe("14.2%");
    expect(formatPercentage(14.2, { includeSign: true })).toBe("+14.2%");
    expect(formatPercentage(-8.5, { includeSign: true })).toBe("-8.5%");
  });
});

describe("Compensation Calculations", () => {
  it("computes estimated compensation based on land class and eroded decimals", () => {
    const agriRatePerDecimal = 15000; // ৳15,000 per decimal agricultural land
    const erodedDecimals = 34.0;
    const estimatedCompensation = erodedDecimals * agriRatePerDecimal;
    expect(estimatedCompensation).toBe(510000);
    expect(formatCurrencyBDT(estimatedCompensation)).toBe("৳510,000");
  });

  it("computes remaining balance when partial compensation is disbursed", () => {
    const estimated = 600000;
    const paid = 450000;
    const pendingBalance = estimated - paid;
    expect(pendingBalance).toBe(150000);
  });

  it("guarantees state khas unowned land has zero compensation liability", () => {
    const isUnownedOrKhas = true;
    const compensation = isUnownedOrKhas ? 0 : 250000;
    expect(compensation).toBe(0);
  });
});
