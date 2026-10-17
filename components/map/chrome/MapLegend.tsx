"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HazardType } from "@/lib/types";
import { useAppStore } from "@/stores/appStore";

interface MapLegendProps {
  hazard: HazardType;
  isForecast?: boolean;
}

export function MapLegend({ hazard, isForecast = false }: MapLegendProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { language } = useAppStore();
  const isBn = language === "bn";

  return (
    <div className="bg-surface/90 backdrop-blur-md rounded-lg border border-border/80 shadow-md p-2.5 max-w-[210px] select-none text-[11px] space-y-1.5 pointer-events-auto">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between font-bold text-ink cursor-pointer text-xs pb-1 border-b border-border/50"
      >
        <span>{isBn ? "নির্দেশিকা (Legend)" : "Legend"}</span>
        {collapsed ? <ChevronDown className="w-3 h-3 text-muted" /> : <ChevronUp className="w-3 h-3 text-muted" />}
      </div>

      {!collapsed && (
        <div className="space-y-1.5 pt-0.5">
          {/* RIVER EROSION */}
          {hazard === "river_erosion" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#BFD9EC] border border-[#9DC1DA]" />}
                label={isBn ? "নদী প্রবাহ" : "River Channel"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-0.5 bg-[#1E3A8A]" />}
                label={isBn ? "জরিপকৃত তীররেখা" : "Surveyed Bankline"}
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
                label={isBn ? "বিলীন জমি (ভাঙন)" : "Lost Land (Erosion)"}
              />
              <LegendItem
                icon={<span className="w-3 h-1 bg-[#D97706]" />}
                label={isBn ? "ট্রান্সেক্ট সরণ" : "Transect Displacement"}
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
                  label={isBn ? "প্রত্যাশিত তীররেখা" : "Projected Retreat"}
                />
              )}
            </>
          )}

          {/* CHAR FORMATION & EROSION */}
          {hazard === "char" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#EADFC0] border border-[#D5CAA7]" />}
                label={isBn ? "ভিত্তিরেখা বালুচর" : "Baseline Sandbar"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#2F9E62] border border-[#23814F]" />}
                label={isBn ? "পয়স্তি (+বৃদ্ধি)" : "Accretion (+Gain)"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#E4604A] border border-[#C84934]" />}
                label={isBn ? "শিকস্তি (−ক্ষয়)" : "Scoured Flank (−Loss)"}
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
                label={isBn ? "খাস জমি (সরকারি)" : "Unowned (State Khas)"}
              />
              {isForecast && (
                <LegendItem
                  icon={<span className="w-3.5 h-0.5 border-b border-dashed border-[#6A5BD6]" />}
                  label={isBn ? "প্রত্যাশিত চরের রূপান্তর" : "Projected Sandbar Shift"}
                />
              )}
            </>
          )}

          {/* COASTAL DYNAMICS */}
          {hazard === "coastal" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-0.5 bg-[#0284C7]" />}
                label={isBn ? "সক্রিয় উপকূলরেখা" : "Active Coastline"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#2F9E62]" />}
                label={isBn ? "নবগঠিত ভূমি (+পয়স্তি)" : "Accreted Land (+Gain)"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#E4604A]" />}
                label={isBn ? "উপকূলীয় ক্ষয় (−ক্ষতি)" : "Marine Erosion (−Loss)"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#E8E4D2] border border-[#C8C0AA]" />}
                label={isBn ? "জোয়ার-ভাটার কাদাভূমি" : "Tidal Mudflat"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#5E8C31]" />}
                label={isBn ? "ম্যানগ্রোভ সবুজ বেষ্টনী" : "Mangrove Greenbelt"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-0.5 border-b border-dashed border-[#6B6F66]" />}
                label={isBn ? "পোল্ডার বাঁধ" : "Polder Embankment"}
              />
            </>
          )}

          {/* FLOOD MODULE */}
          {hazard === "flood" && (
            <>
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#CFE3F0] border border-[#9DC1DA]" />}
                label={isBn ? "অগভীর (<০.৫ মি.)" : "Shallow (<0.5m)"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#9CC3DE] border border-[#7BA9CA]" />}
                label={isBn ? "মাঝারি (০.৫–১.৫ মি.)" : "Moderate (0.5–1.5m)"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#5B9BC8] border border-[#3E82B2]" />}
                label={isBn ? "গভীর (>১.৫ মি.)" : "Deep (>1.5m)"}
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
                label={isBn ? "জলমগ্ন দাগ" : "Submerged Parcel"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#9AA091] border border-[#7D8473]" />}
                label={isBn ? "খাস জমি (সরকারি)" : "Unowned (State Khas)"}
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
                label={isBn ? "ভূ-উচ্চতা রিলিফ" : "Elevation Relief"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#78350F] border border-[#451A03]" />}
                label={isBn ? "ধসের মূল দাগ" : "Failure Scar"}
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
                label={isBn ? "ধ্বংসাবশেষ প্রবাহ" : "Debris Runout"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#15803D] border border-[#14532D]" />}
                label={isBn ? "স্থিতিশীল ঢাল" : "Intact Slope"}
              />
              <LegendItem
                icon={<span className="w-3.5 h-0.5 border-b border-dashed border-[#475569]" />}
                label={isBn ? "উচ্চতা রেখা (১০ মি.)" : "Contours (10m)"}
              />
              <LegendItem
                icon={<span className="text-[10px] text-amber-600 font-bold leading-none">▲</span>}
                label={isBn ? "শৃঙ্গ বিন্দু" : "Spot Height Peak"}
              />
              {isForecast && (
                <>
                  <LegendItem
                    icon={<span className="w-3.5 h-2.5 rounded-xs bg-[#EF4444] border border-[#B91C1C]" />}
                    label={isBn ? "উচ্চ ধস ঝুঁকি" : "High Susceptibility"}
                  />
                  <LegendItem
                    icon={<span className="w-3.5 h-0.5 border-b-2 border-dashed border-[#DC2626]" />}
                    label={isBn ? "পূর্বাভাসিত ধস ক্ষেত্র" : "Predicted Scar"}
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
