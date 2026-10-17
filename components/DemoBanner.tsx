"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

export function DemoBanner() {
  const language = useAppStore((s) => s.language);
  return (
    <div
      role="banner"
      className="w-full bg-[#FEF3C7] border-b border-[#FDE68A] text-[#92400E] text-[11px] sm:text-xs py-1.5 px-4 text-center flex items-center justify-center gap-1.5 font-medium select-none z-50 sticky top-0"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-[#D97706]" />
      <span>{language === "bn" ? "ডেমো তথ্য: সকল নাম, দাগ ও তথ্য কাল্পনিক।" : "Demo data: all names, plots and figures are fictional."}</span>
    </div>
  );
}
