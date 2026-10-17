"use client";

import React, { useState } from "react";
import { Layers, Sliders, ChevronDown, ChevronUp, Eye, EyeOff, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayerStore, LayerPreset } from "./layerStore";
import { useAppStore } from "@/stores/appStore";
import { formatNumberLocalized } from "@/lib/translations";

interface LayerControlPanelProps {
  hasTerrain?: boolean;
  hazardName?: string;
  className?: string;
}

export function LayerControlPanel({ hasTerrain = false, hazardName = "Hazard", className }: LayerControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const store = useLayerStore();
  const { language } = useAppStore();
  const isBn = language === "bn";

  const presets: { id: LayerPreset; label: string; desc: string }[] = [
    {
      id: "survey",
      label: isBn ? "জরিপ" : "Survey",
      desc: isBn ? "ক্যাডাস্ট্রাল দাগ ও পূর্ণাঙ্গ বেইসম্যাপ" : "Cadastral focus + full basemap",
    },
    {
      id: "analysis",
      label: isBn ? "বিশ্লেষণ" : "Analysis",
      desc: isBn ? "দুর্যোগের তীব্রতা ও হালকা মানচিত্র" : "Hazard highlighted + subtle basemap",
    },
    {
      id: "clean",
      label: isBn ? "সাধারণ" : "Clean",
      desc: isBn ? "ন্যূনতম বেইসম্যাপ, স্পষ্ট পর্যালোচনা" : "Minimal basemap, pure hazard overview",
    },
  ];

  const presetLabelsBn: Record<LayerPreset, string> = {
    survey: "জরিপ",
    analysis: "বিশ্লেষণ",
    clean: "সাধারণ",
  };

  return (
    <div className={cn("relative z-[1010] select-none", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-1.5 rounded-pill border text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all",
          isOpen
            ? "bg-ink text-surface border-ink"
            : "bg-surface/90 backdrop-blur-md text-ink border-border hover:bg-surface"
        )}
      >
        <Layers className="w-3.5 h-3.5 text-secondary" />
        <span>{isBn ? "লেয়ার" : "Layers"}</span>
        <span className="text-[10px] font-semibold text-muted">
          ({isBn ? presetLabelsBn[store.preset] : store.preset})
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Floating Collapsible Panel */}
      {isOpen && (
        <div className="absolute right-0 top-9 z-[1020] w-72 max-h-[460px] overflow-y-auto bg-surface/95 backdrop-blur-xl border border-border shadow-xl rounded-xl p-3.5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header & Presets */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="text-xs font-bold text-ink">
                {isBn ? "জিআইএস লেয়ার নিয়ন্ত্রণ" : "GIS Layer Controls"}
              </span>
              <button
                type="button"
                onClick={store.resetLayers}
                className="text-[10px] text-muted hover:text-ink font-semibold"
              >
                {isBn ? "রিসেট করুন" : "Reset All"}
              </button>
            </div>

            {/* Presets Row */}
            <div className="mt-2.5">
              <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                {isBn ? "প্রদর্শন প্রিসেট" : "Display Presets"}
              </div>
              <div className="grid grid-cols-3 gap-1 bg-[#F1F5F9]/80 p-1 rounded-lg">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => store.applyPreset(p.id)}
                    className={cn(
                      "py-1 px-1.5 rounded text-[11px] font-semibold transition-all text-center",
                      store.preset === p.id
                        ? "bg-surface text-ink shadow-xs"
                        : "text-muted hover:text-ink"
                    )}
                    title={p.desc}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5 bg-[#F8FAFC] p-2 rounded-lg border border-border/50">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-ink flex items-center gap-1">
                <Sliders className="w-3 h-3 text-secondary" />
                <span>{isBn ? "দুর্যোগ স্তরের অস্বচ্ছতা" : "Hazard Opacity"}</span>
              </span>
              <span className="font-mono text-muted text-[10px]">
                {formatNumberLocalized(Math.round(store.hazardOpacity * 100), language)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={store.hazardOpacity}
              onChange={(e) => store.setHazardOpacity(parseFloat(e.target.value))}
              className="w-full accent-ink h-1.5 bg-border/60 rounded cursor-pointer"
            />
          </div>

          {/* 1. Basemap Group */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {isBn ? "বেইসম্যাপ উপাদান" : "Basemap Elements"}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <LayerCheckbox label={isBn ? "ভূমির ব্যবহার" : "Land Use"} checked={store.landuse} onChange={() => store.toggleLayer("landuse")} />
              <LayerCheckbox label={isBn ? "সড়ক নেটওয়ার্ক" : "Roads"} checked={store.roads} onChange={() => store.toggleLayer("roads")} />
              <LayerCheckbox label={isBn ? "ভবন ও স্থাপনা" : "Buildings & POI"} checked={store.buildings} onChange={() => store.toggleLayer("buildings")} />
              <LayerCheckbox label={isBn ? "বাঁধ / প্রতিরোধক" : "Embankments"} checked={store.embankments} onChange={() => store.toggleLayer("embankments")} />
              <LayerCheckbox label={isBn ? "গ্র্যাটিকুল গ্রিড" : "Graticule Grid"} checked={store.graticule} onChange={() => store.toggleLayer("graticule")} />
            </div>
          </div>

          {/* 2. Administrative Group */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {isBn ? "প্রশাসনিক ও মৌজা" : "Administrative & Mouzas"}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <LayerCheckbox label={isBn ? "উপজেলা সীমানা" : "Upazila Line"} checked={store.upazila} onChange={() => store.toggleLayer("upazila")} />
              <LayerCheckbox label={isBn ? "মৌজা বর্ডার" : "Mouza Borders"} checked={store.mouzaBoundaries} onChange={() => store.toggleLayer("mouzaBoundaries")} />
              <LayerCheckbox label={isBn ? "মৌজার নামফলক" : "Mouza Labels"} checked={store.mouzaLabels} onChange={() => store.toggleLayer("mouzaLabels")} />
              <LayerCheckbox label={isBn ? "মৌজা কালার টিন্ট" : "Mouza Tints"} checked={store.mouzaTint} onChange={() => store.toggleLayer("mouzaTint")} />
            </div>
          </div>

          {/* 3. Hydrography Group */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {isBn ? "নদী ও জলাশয়" : "Hydrography"}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <LayerCheckbox label={isBn ? "জলাশয় প্রবাহ" : "Waterbodies"} checked={store.water} onChange={() => store.toggleLayer("water")} />
              <LayerCheckbox label={isBn ? "নদীর নামফলক" : "River Labels"} checked={store.waterLabels} onChange={() => store.toggleLayer("waterLabels")} />
            </div>
          </div>

          {/* 4. Parcels Group */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {isBn ? "ক্যাডাস্ট্রাল দাগ" : "Cadastral Parcels"}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <LayerCheckbox label={isBn ? "দাগ বহুভুজ" : "Plot Polygons"} checked={store.plots} onChange={() => store.toggleLayer("plots")} />
              <LayerCheckbox label={isBn ? "দাগ নম্বর" : "Dag Numbers"} checked={store.dagLabels} onChange={() => store.toggleLayer("dagLabels")} />
              <LayerCheckbox label={isBn ? "মালিকানার রঙ" : "Owner Colors"} checked={store.ownerColours} onChange={() => store.toggleLayer("ownerColours")} />
            </div>
          </div>

          {/* 5. Hazard Layers */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
              {hazardName} {isBn ? "থিমেটিক স্তর" : "Thematics"}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <LayerCheckbox label={isBn ? "দুর্যোগ ওভারলে" : "Hazard Overlays"} checked={store.hazardLayers} onChange={() => store.toggleLayer("hazardLayers")} />
              <LayerCheckbox label={isBn ? "ভাঙন ইতিহাস রেখা" : "Retreat History"} checked={store.historyLines} onChange={() => store.toggleLayer("historyLines")} />
            </div>
          </div>

          {/* 6. Terrain Group (Optional) */}
          {hasTerrain && (
            <div className="space-y-1 pt-1 border-t border-border/50">
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {isBn ? "ডিজিটাল এলিভেশন মডেল (DEM)" : "Digital Elevation Model"}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <LayerCheckbox label={isBn ? "উচ্চতা স্তর রঙ" : "Elevation Tint"} checked={store.elevationTint} onChange={() => store.toggleLayer("elevationTint")} />
                <LayerCheckbox label={isBn ? "হিলশেড ছায়া" : "Hillshade"} checked={store.hillshade} onChange={() => store.toggleLayer("hillshade")} />
                <LayerCheckbox label={isBn ? "কন্ট্যুর রেখা" : "Contours"} checked={store.contours} onChange={() => store.toggleLayer("contours")} />
                <LayerCheckbox label={isBn ? "ঢাল শ্রেণি" : "Slope Classes"} checked={store.slope} onChange={() => store.toggleLayer("slope")} />
                <LayerCheckbox label={isBn ? "মাটি ভরাট / কাটা" : "Cut / Fill"} checked={store.elevationChange} onChange={() => store.toggleLayer("elevationChange")} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LayerCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-1.5 p-1 rounded hover:bg-surface-alt/70 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded text-ink accent-ink focus:ring-0 cursor-pointer"
      />
      <span className={cn("text-[11px] truncate", checked ? "text-ink font-medium" : "text-muted")}>
        {label}
      </span>
    </label>
  );
}
