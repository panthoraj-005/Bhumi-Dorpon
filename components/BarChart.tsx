"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { HazardBreakdownItem } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { cn } from "@/lib/utils";
import { t, getLocalizedHazardName } from "@/lib/translations";

interface BarChartProps {
  data: HazardBreakdownItem[];
  title?: string;
  isForecast?: boolean;
  className?: string;
  height?: number;
}

export function BarChart({
  data,
  title,
  isForecast = false,
  className,
  height = 320,
}: BarChartProps) {
  const { unit, language } = useAppStore();
  const defaultTitle = language === "bn" ? "দুর্যোগভিত্তিক প্রভাব বিস্তার" : "Hazard Impact Distribution";
  const displayTitle = title || defaultTitle;

  const localizedData = React.useMemo(() => {
    return data.map((d) => ({
      ...d,
      label: getLocalizedHazardName(d.label || d.hazard, language),
    }));
  }, [data, language]);

  const unitLabel =
    unit === "decimal"
      ? language === "bn"
        ? "শতাংশ"
        : "dec"
      : unit === "acre"
      ? language === "bn"
        ? "একর"
        : "acres"
      : language === "bn"
      ? "হেক্টর"
      : "ha";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#14170F] text-white px-3.5 py-2.5 rounded-pill shadow-xl text-xs flex items-center gap-3 border border-white/10 select-none">
          <span className="font-semibold text-white/90">{label}:</span>
          <div className="flex items-center gap-2.5">
            {payload.map((entry: any, index: number) => (
              <div key={`entry-${index}`} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/70">{entry.name}:</span>
                <span className="font-semibold text-white tabular-nums">
                  {formatArea(entry.value, unit, language)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("bhumidorpon-card p-5 sm:p-6 flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-ink">{displayTitle}</h3>
          <p className="text-xs text-muted mt-0.5">
            {language === "bn"
              ? `দুর্যোগভিত্তিক ভাঙন বনাম বৃদ্ধির তুলনামূলক চিত্র (${unitLabel} এককে)`
              : `Comparative erosion vs accretion by hazard (${unit} units)`}
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={localizedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#E4E7DC"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#7B8274"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E4E7DC" }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#7B8274"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatArea(val, unit, { includeUnit: false, language })}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
            />
            <Bar
              dataKey="lossDecimal"
              name={language === "bn" ? "ক্ষতি (ভাঙন)" : "Loss"}
              fill="#E4604A"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="gainDecimal"
              name={language === "bn" ? "বৃদ্ধি (পয়স্তি)" : "Gain"}
              fill="#2F9E62"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Screen Reader Text Summary */}
      <div className="sr-only" aria-live="polite">
        {language === "bn"
          ? `${displayTitle}-এর বিবরণ: দুর্যোগভেদে ভাঙন ও পয়স্তির পরিমাণ (${unitLabel} এককে)`
          : `Text summary for ${displayTitle}: Compares loss and accretion across hazards in ${unit} units.`}
      </div>

      {/* Accessible Data Table Alternative */}
      <details className="mt-4 pt-3 border-t border-border/80 text-xs text-muted group">
        <summary className="cursor-pointer font-medium hover:text-ink select-none inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 rounded px-1 -mx-1">
          <span>{t("showAccessibleTable", language)}</span>
        </summary>
        <div className="mt-2.5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs" aria-label={`Tabular data for ${displayTitle}`}>
            <thead className="bg-surface-alt text-ink font-semibold border-b border-border">
              <tr>
                <th scope="col" className="py-2 px-3">{t("tableHazardCategory", language)}</th>
                <th scope="col" className="py-2 px-3 text-right">{t("tableErosionLoss", language)} (− {unitLabel})</th>
                <th scope="col" className="py-2 px-3 text-right">{t("tableAccretionGain", language)} (+ {unitLabel})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {localizedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-alt/40">
                  <td className="py-1.5 px-3 font-medium text-ink">{row.label}</td>
                  <td className="py-1.5 px-3 text-right text-loss tabular-nums">−{formatArea(row.lossDecimal, unit, language)}</td>
                  <td className="py-1.5 px-3 text-right text-gain tabular-nums">+{formatArea(row.gainDecimal, unit, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
