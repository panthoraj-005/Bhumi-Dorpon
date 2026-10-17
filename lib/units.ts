import { AreaUnit } from "./types";
import { formatNumberLocalized, Language } from "./translations";

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

export type FormatAreaOptions = {
  maximumFractionDigits?: number;
  includeUnit?: boolean;
  language?: Language;
  useBnDigits?: boolean;
};

export function formatArea(
  valueInDecimal: number,
  unit: AreaUnit,
  optionsOrLang?: Language | FormatAreaOptions
): string {
  const converted = convertArea(valueInDecimal, unit);

  const options: FormatAreaOptions =
    typeof optionsOrLang === "string"
      ? { language: optionsOrLang }
      : optionsOrLang || {};

  const lang = options.language || "en";
  const maxDigits =
    options.maximumFractionDigits ??
    (unit === "decimal" ? 1 : unit === "acre" ? 2 : 2);

  const formattedNum = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  }).format(converted);

  const displayNum =
    options.useBnDigits && lang === "bn"
      ? formatNumberLocalized(formattedNum, "bn")
      : formattedNum;

  if (options.includeUnit === false) {
    return displayNum;
  }

  const unitLabelsBn: Record<AreaUnit, string> = {
    decimal: "শতাংশ",
    acre: "একর",
    hectare: "হেক্টর",
  };

  const unitLabelsEn: Record<AreaUnit, string> = {
    decimal: "dec",
    acre: "acres",
    hectare: "ha",
  };

  const unitLabels = lang === "bn" ? unitLabelsBn : unitLabelsEn;

  return `${displayNum} ${unitLabels[unit]}`;
}

export function formatCurrencyBDT(
  amount: number,
  options?: { compact?: boolean; language?: Language; useBnDigits?: boolean }
): string {
  const lang = options?.language || "en";

  if (options?.compact) {
    if (amount >= 10000000) {
      const val = (amount / 10000000).toFixed(2);
      const displayVal =
        options?.useBnDigits && lang === "bn"
          ? formatNumberLocalized(val, "bn")
          : val;
      return lang === "bn" ? `৳${displayVal} কোটি` : `৳${val} Cr`;
    }
    if (amount >= 100000) {
      const val = (amount / 100000).toFixed(1);
      const displayVal =
        options?.useBnDigits && lang === "bn"
          ? formatNumberLocalized(val, "bn")
          : val;
      return lang === "bn" ? `৳${displayVal} লাখ` : `৳${val} Lakh`;
    }
    if (amount >= 1000) {
      const val = (amount / 1000).toFixed(1);
      const displayVal =
        options?.useBnDigits && lang === "bn"
          ? formatNumberLocalized(val, "bn")
          : val;
      return lang === "bn" ? `৳${displayVal} হাজার` : `৳${val}k`;
    }
  }

  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);

  const displayFormatted =
    options?.useBnDigits && lang === "bn"
      ? formatNumberLocalized(formatted, "bn")
      : formatted;

  return `৳${displayFormatted}`;
}

export function formatPercentage(
  percent: number,
  options?: { includeSign?: boolean; language?: Language }
): string {
  const lang = options?.language || "en";
  const prefix = options?.includeSign && percent > 0 ? "+" : "";
  const formatted = `${prefix}${percent.toFixed(1)}%`;
  return lang === "bn" ? formatNumberLocalized(formatted, "bn") : formatted;
}

