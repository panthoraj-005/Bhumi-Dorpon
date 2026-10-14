"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HazardType } from "@/lib/types";

interface MapLegendProps {
  hazard: HazardType;
  isForecast?: boolean;
}

export function MapLegend({ hazard, isForecast = false }: MapLegendProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-surface/90 backdrop-blur-md rounded-lg border border-border/80 shadow-md p-2.5 max-w-[210px] select-none text-[11px] space-y-1.5 pointer-events-auto">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between font-bold text-ink cursor-pointer text-xs pb-1 border-b border-border/50"
      >
        <span>Legend</span>
        {collapsed ? <ChevronDown className="w-3 h-3 text-muted" /> : <ChevronUp className="w-3 h-3 text-muted" />}
      </div>

      {!collapsed && (
        <div className="space-y-1.5 pt-0.5">
          {/* RIVER EROSION */}
          {hazard === "river_erosion" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#BFD9EC] border border-[#9DC1DA]" />}
                label="River Channel"
              />
              <LegendItem
                icon={<span className="w-3.5 h-0.5 bg-[#1E3A8A]" />}
                label="Surveyed Bankline"
              />
              <LegendItem
                icon={
                  <span
                    className="w-3.5 h-2.5 rounded-xs border border-[#E4604A]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #E4604A, #E4604A 1.5px, transparent 1.5px, transparent 4px)",
                    }}
                  />
                }
                label="Lost Land (Erosion)"
              />
              <LegendItem
                icon={<span className="w-3 h-1 bg-[#D97706]" />}
                label="Transect Displacement"
              />
              {isForecast && (
                <LegendItem
                  icon={
                    <span
                      className="w-3.5 h-0.5"
                      style={{
                        backgroundImage: "repeating-linear-gradient(90deg, #6A5BD6, #6A5BD6 3px, transparent 3px, transparent 6px)",
                      }}
                    />
                  }
                  label="Projected Retreat"
                />
              )}
            </>
          )}

          {/* CHAR FORMATION & EROSION */}
          {hazard === "char" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#EADFC0] border border-[#D5CAA7]" />}
                label="Baseline Sandbar"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#2F9E62] border border-[#23814F]" />}
                label="Accretion (+Gain)"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#E4604A] border border-[#C84934]" />}
                label="Scoured Flank (−Loss)"
              />
              <LegendItem
                icon={
                  <span
                    className="w-3.5 h-2.5 rounded-xs border border-[#9AA091]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #9AA091, #9AA091 1.5px, transparent 1.5px, transparent 4px)",
                    }}
                  />
                }
                label="Unowned (State Khas)"
              />
              {isForecast && (
                <LegendItem
                  icon={<span className="w-3.5 h-0.5 border-b border-dashed border-[#6A5BD6]" />}
                  label="Projected Sandbar Shift"
                />
              )}
            </>
          )}

          {/* COASTAL DYNAMICS */}
          {hazard === "coastal" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-0.5 bg-[#0284C7]" />}
                label="Active Coastline"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#2F9E62]" />}
                label="Accreted Land (+Gain)"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#E4604A]" />}
                label="Marine Erosion (−Loss)"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#E8E4D2] border border-[#C8C0AA]" />}
                label="Tidal Mudflat"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#5E8C31]" />}
                label="Mangrove Greenbelt"
              />
              <LegendItem
                icon={<span className="w-3.5 h-0.5 border-b border-dashed border-[#6B6F66]" />}
                label="Polder Embankment"
              />
            </>
          )}

          {/* FLOOD MODULE */}
          {hazard === "flood" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#CFE3F0] border border-[#9DC1DA]" />}
                label="Shallow (<0.5m)"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#9CC3DE] border border-[#7BA9CA]" />}
                label="Moderate (0.5–1.5m)"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#5B9BC8] border border-[#3E82B2]" />}
                label="Deep (>1.5m)"
              />
              <LegendItem
                icon={
                  <span
                    className="w-3.5 h-2.5 rounded-xs border border-[#3E82B2]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #3E82B2, #3E82B2 1.5px, transparent 1.5px, transparent 4px)",
                    }}
                  />
                }
                label="Submerged Parcel"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#9AA091] border border-[#7D8473]" />}
                label="Unowned (State Khas)"
              />
            </>
          )}

          {/* LANDSLIDE MODULE */}
          {hazard === "landslide" && (
            <>
              <LegendItem
                icon={
                  <span
                    className="w-3.5 h-2.5 rounded-xs border border-[#8C9086]"
                    style={{
                      background: "linear-gradient(to right, #DDEBD3, #D1B8A0)",
                    }}
                  />
                }
                label="Elevation Relief"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#78350F] border border-[#451A03]" />}
                label="Failure Scar"
              />
              <LegendItem
                icon={
                  <span
                    className="w-3.5 h-2.5 rounded-xs border border-[#92400E]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #92400E, #92400E 1.5px, transparent 1.5px, transparent 4px)",
                    }}
                  />
                }
                label="Debris Runout"
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#15803D] border border-[#14532D]" />}
                label="Intact Slope"
              />
              <LegendItem
                icon={<span className="w-3.5 h-0.5 border-b border-dashed border-[#475569]" />}
                label="Contours (10m)"
              />
              <LegendItem
                icon={<span className="text-[10px] text-amber-600 font-bold leading-none">▲</span>}
                label="Spot Height Peak"
              />
              {isForecast && (
                <>
                  <LegendItem
                    icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#EF4444] border border-[#B91C1C]" />}
                    label="High Susceptibility"
                  />
                  <LegendItem
                    icon={<span className="w-3.5 h-0.5 border-b-2 border-dashed border-[#DC2626]" />}
                    label="Predicted Scar"
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LegendItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink/80 text-[11px] leading-none">
      <div className="flex items-center justify-center w-4 h-3 shrink-0">{icon}</div>
      <span className="truncate">{label}</span>
    </div>
  );
}
