"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendDataPoint } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  isForecast?: boolean;
  className?: string;
  height?: number;
}

export function TrendChart({
  data,
  title = "Land Loss vs Gain Over Time",
  isForecast = false,
  className,
  height = 320,
}: TrendChartProps) {
  const { unit } = useAppStore();

  // Custom Dark Pill Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#14170F] text-white px-3.5 py-2.5 rounded-pill shadow-xl text-xs flex items-center gap-3 border border-white/10 select-none">
          <span className="font-semibold text-white/90">{label}:</span>
          <div className="flex items-center gap-2.5">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/70">{entry.name}:</span>
                <span className="font-semibold text-white tabular-nums">
                  {formatArea(entry.value, unit)}
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
          <h3 className="text-sm sm:text-base font-semibold text-ink">{title}</h3>
          <p className="text-xs text-muted mt-0.5">
            Annual land change progression ({unit} units)
          </p>
        </div>

        {isForecast && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-pill bg-[#ECE9FB] text-[#6A5BD6] border border-dashed border-[#6A5BD6]">
            Dashed = Projections
          </span>
        )}
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#E4E7DC"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="#7B8274"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E4E7DC" }}
              dy={6}
            />
            <YAxis
              stroke="#7B8274"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatArea(val, unit, { includeUnit: false })}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
            />

            {/* Loss (Solid Coral in recorded, Dashed Coral in forecast) */}
            <Line
              type="monotone"
              dataKey="loss"
              name="Loss"
              stroke="#E4604A"
              strokeWidth={2.5}
              strokeDasharray={isForecast ? "6 4" : undefined}
              dot={{ r: 3.5, fill: "#E4604A" }}
              activeDot={{ r: 6, fill: "#E4604A", stroke: "#FFFFFF", strokeWidth: 2 }}
            />

            {/* Gain (Solid Green in recorded, Dashed Green in forecast) */}
            <Line
              type="monotone"
              dataKey="gain"
              name="Gain"
              stroke="#2F9E62"
              strokeWidth={2.5}
              strokeDasharray={isForecast ? "6 4" : undefined}
              dot={{ r: 3.5, fill: "#2F9E62" }}
              activeDot={{ r: 6, fill: "#2F9E62", stroke: "#FFFFFF", strokeWidth: 2 }}
            />

            {/* Forecast Line if available (Dashed Purple) */}
            {isForecast && (
              <Line
                type="monotone"
                dataKey="forecastLoss"
                name="Projected Trend"
                stroke="#6A5BD6"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: "#6A5BD6" }}
                activeDot={{ r: 6, fill: "#6A5BD6", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Screen Reader Text Summary */}
      <div className="sr-only" aria-live="polite">
        Text summary for {title}: Historical trend data across {data.length} intervals.
        Latest recorded values: Loss {data[data.length - 1]?.loss} {unit}, Gain {data[data.length - 1]?.gain} {unit}.
      </div>

      {/* Accessible Data Table Alternative */}
      <details className="mt-4 pt-3 border-t border-border/80 text-xs text-muted group">
        <summary className="cursor-pointer font-medium hover:text-ink select-none inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 rounded px-1 -mx-1">
          <span>Show accessible data table</span>
        </summary>
        <div className="mt-2.5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs" aria-label={`Tabular data for ${title}`}>
            <thead className="bg-surface-alt text-ink font-semibold border-b border-border">
              <tr>
                <th scope="col" className="py-2 px-3">Year / Period</th>
                <th scope="col" className="py-2 px-3 text-right">Loss (− {unit})</th>
                <th scope="col" className="py-2 px-3 text-right">Gain (+ {unit})</th>
                {isForecast && <th scope="col" className="py-2 px-3 text-right">Projected (∼ {unit})</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-alt/40">
                  <td className="py-1.5 px-3 font-medium text-ink">{row.year}</td>
                  <td className="py-1.5 px-3 text-right text-loss tabular-nums">−{formatArea(row.loss, unit)}</td>
                  <td className="py-1.5 px-3 text-right text-gain tabular-nums">+{formatArea(row.gain, unit)}</td>
                  {isForecast && (
                    <td className="py-1.5 px-3 text-right text-predicted tabular-nums">
                      {row.forecastLoss !== undefined ? `∼${formatArea(row.forecastLoss, unit)}` : "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
