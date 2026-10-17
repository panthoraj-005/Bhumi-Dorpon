"use client";

import React from "react";
import { Map, Globe, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { BasemapType } from "@/lib/basemapConfig";
import { useAppStore } from "@/stores/appStore";

interface BasemapSelectorProps {
  value: BasemapType;
  onChange: (type: BasemapType) => void;
  className?: string;
}

export function BasemapSelector({
  value,
  onChange,
  className,
}: BasemapSelectorProps) {
  const { language } = useAppStore();
  const isBn = language === "bn";

  const options: { type: BasemapType; label: string; icon: React.ReactNode; title: string }[] = [
    {
      type: "light-gis",
      label: isBn ? "জিআইএস" : "Light GIS",
      icon: <Map className="w-3.5 h-3.5" />,
      title: isBn ? "প্রামাণ্য জিআইএস বেইসম্যাপ" : "Authoritative Light-Themed GIS Basemap (MAP_SPEC.md)",
    },
    {
      type: "satellite",
      label: isBn ? "উপগ্রহ" : "Satellite",
      icon: <Globe className="w-3.5 h-3.5" />,
      title: isBn ? "প্রকৃত উপগ্রহ চিত্র (Esri World Imagery)" : "Genuine Satellite Imagery (Esri World Imagery)",
    },
    {
      type: "street",
      label: isBn ? "সড়ক" : "Street",
      icon: <Navigation className="w-3.5 h-3.5" />,
      title: isBn ? "মানসম্মত সড়ক মানচিত্র (OpenStreetMap)" : "Standard Street Basemap (OpenStreetMap)",
    },
  ];

  return (
    <div
      role="group"
      aria-label={isBn ? "বেইসম্যাপ নির্বাচক" : "Basemap type selector"}
      className={cn(
        "bg-surface/90 backdrop-blur-md p-1 rounded-pill border border-border/80 shadow-xs flex items-center gap-1",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = value === opt.type;
        return (
          <button
            key={opt.type}
            type="button"
            onClick={() => onChange(opt.type)}
            className={cn(
              "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-1 focus:ring-primary",
              isActive
                ? "bg-ink text-surface shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface-alt/70"
            )}
            title={opt.title}
            aria-pressed={isActive}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
