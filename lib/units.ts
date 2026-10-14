import { AreaUnit } from "./types";

/**
 * Standard Bangladesh land conversion ratios:
 * 1 Decimal = 435.6 sq ft = 40.4686 sq m
 * 1 Acre = 100 Decimals = 4,046.86 sq m
 * 1 Hectare = 2.47105 Acres = 247.105 Decimals = 10,000 sq m
 */

export function convertArea(
  valueInDecimal: number,
  targetUnit: AreaUnit
): number {
  if (targetUnit === "acre") {
    return valueInDecimal / 100;
  }
  if (targetUnit === "hectare") {
    return valueInDecimal / 247.10538;
  }
  return valueInDecimal;
}

export function formatArea(
  valueInDecimal: number,
  unit: AreaUnit,
  options?: { maximumFractionDigits?: number; includeUnit?: boolean }
): string {
  const converted = convertArea(valueInDecimal, unit);
  const maxDigits =
    options?.maximumFractionDigits ??
    (unit === "decimal" ? 1 : unit === "acre" ? 2 : 2);

  const formattedNum = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  }).format(converted);

  if (options?.includeUnit === false) {
    return formattedNum;
  }

  const unitLabels: Record<AreaUnit, string> = {
    decimal: "dec",
    acre: "acres",
    hectare: "ha",
  };

  return `${formattedNum} ${unitLabels[unit]}`;
}

export function formatCurrencyBDT(
  amount: number,
  options?: { compact?: boolean }
): string {
  if (options?.compact) {
    if (amount >= 10000000) {
      return `৳${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `৳${(amount / 100000).toFixed(1)} Lakh`;
    }
    if (amount >= 1000) {
      return `৳${(amount / 1000).toFixed(1)}k`;
    }
  }

  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `৳${formatted}`;
}

export function formatPercentage(
  percent: number,
  options?: { includeSign?: boolean }
): string {
  const prefix = options?.includeSign && percent > 0 ? "+" : "";
  return `${prefix}${percent.toFixed(1)}%`;
}
