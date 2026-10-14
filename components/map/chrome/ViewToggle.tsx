"use client";

import React from "react";
import { Maximize2, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayerStore, ViewTarget } from "./layerStore";

interface ViewToggleProps {
  onFitReach: () => void;
  onFitMouza: () => void;
  className?: string;
}

export function ViewToggle({ onFitReach, onFitMouza, className }: ViewToggleProps) {
  const { viewTarget, setViewTarget } = useLayerStore();

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
        title="Focus on selected mouza with adjacent mouza context"
      >
        <span>Mouza view</span>
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
        title="View complete reach across all area mouzas"
      >
        <span>Reach view</span>
      </button>

      <div className="h-3 w-px bg-border/60 mx-0.5" />

      <button
        type="button"
        onClick={onFitReach}
        className="p-1 rounded-full text-muted hover:text-ink hover:bg-surface-alt transition-colors"
        title="Fit entire reach to view"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
