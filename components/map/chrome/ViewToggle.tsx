"use client";

import React from "react";
import { Maximize2, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayerStore, ViewTarget } from "./layerStore";
import { useAppStore } from "@/stores/appStore";

interface ViewToggleProps {
  onFitReach: () => void;
  onFitMouza: () => void;
  className?: string;
}

export function ViewToggle({ onFitReach, onFitMouza, className }: ViewToggleProps) {
  const { viewTarget, setViewTarget } = useLayerStore();
  const { language } = useAppStore();
  const isBn = language === "bn";

  const handleSelect = (target: ViewTarget) => {
    setViewTarget(target);
    if (target === "reach") {
      onFitReach();
    } else {
      onFitMouza();
    }
  };

  return (
    <div
      className={cn(
        "bg-surface/90 backdrop-blur-md p-1 rounded-pill border border-border/80 shadow-xs flex items-center gap-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => handleSelect("mouza")}
        className={cn(
          "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
          viewTarget === "mouza"
            ? "bg-ink text-surface shadow-xs"
            : "text-muted hover:text-ink"
        )}
        title={isBn ? "নির্বাচিত মৌজায় ফোকাস করুন" : "Focus on selected mouza with adjacent mouza context"}
      >
        <span>{isBn ? "মৌজা দৃশ্য" : "Mouza view"}</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect("reach")}
        className={cn(
          "px-2.5 py-1 rounded-pill text-[11px] font-bold flex items-center gap-1 transition-all",
          viewTarget === "reach"
            ? "bg-ink text-surface shadow-xs"
            : "text-muted hover:text-ink"
        )}
        title={isBn ? "সমগ্র এলাকার মৌজাগুলো দেখুন" : "View complete reach across all area mouzas"}
      >
        <span>{isBn ? "এলাকা দৃশ্য" : "Reach view"}</span>
      </button>
    </div>
  );
}
