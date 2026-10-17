"use client";

import React from "react";
import { useAppStore } from "@/stores/appStore";

export function NorthArrow() {
  const { language } = useAppStore();
  return (
    <div
      className="bg-surface/85 backdrop-blur-md p-1.5 rounded-md border border-border/70 shadow-xs flex items-center justify-center pointer-events-none select-none"
      title={language === "bn" ? "উত্তর দিক" : "True North"}
    >
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Star / Compass Needle */}
        <path d="M10 2L13 13L10 11L7 13L10 2Z" fill="#1E293B" />
        <path d="M10 11L13 13L10 20L7 13L10 11Z" fill="#94A3B8" />
        {/* N / উ Label */}
        <text x="10" y="23" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#0F172A" fontFamily="sans-serif">
          {language === "bn" ? "উ" : "N"}
        </text>
      </svg>
    </div>
  );
}
