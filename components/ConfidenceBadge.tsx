"use client";

import React from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { ConfidenceLevel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import { formatNumberLocalized } from "@/lib/translations";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  scorePercent: number;
  className?: string;
}

export function ConfidenceBadge({
  level,
  scorePercent,
  className,
}: ConfidenceBadgeProps) {
  const { language } = useAppStore();
  const isBn = language === "bn";

  const colorConfig = {
    High: {
      labelBn: "উচ্চ",
      bg: "bg-[#DFF3E8]",
      text: "text-[#2F9E62]",
      bar: "bg-[#2F9E62]",
      border: "border-[#B2E4CB]",
    },
    Medium: {
      labelBn: "মাঝারি",
      bg: "bg-[#FEF3C7]",
      text: "text-[#D97706]",
      bar: "bg-[#D97706]",
      border: "border-[#FDE68A]",
    },
    Low: {
      labelBn: "নিম্ন",
      bg: "bg-[#FBE5E0]",
      text: "text-[#E4604A]",
      bar: "bg-[#E4604A]",
      border: "border-[#F8C4BB]",
    },
  }[level];

  const levelLabel = isBn ? colorConfig.labelBn : level;
  const confidenceWord = isBn ? "নির্ভরযোগ্যতা" : "Confidence";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-pill border text-xs font-medium tabular-nums",
        colorConfig.bg,
        colorConfig.text,
        colorConfig.border,
        className
      )}
      title={
        isBn
          ? `মডেল নির্ভরযোগ্যতা: ${formatNumberLocalized(scorePercent, language)}%`
          : `Model confidence: ${scorePercent}%`
      }
    >
      {level === "High" ? (
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      <span>
        {levelLabel} {confidenceWord} ({formatNumberLocalized(scorePercent, language)}%)
      </span>
      <div className="w-10 h-1.5 bg-black/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colorConfig.bar)}
          style={{ width: `${Math.min(100, Math.max(0, scorePercent))}%` }}
        />
      </div>
    </div>
  );
}
