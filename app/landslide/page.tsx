"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mountain,
  ArrowRight,
  Database,
  Sparkles,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ForecastBadge } from "@/components/ForecastBadge";
import { MountainEventSelector } from "@/components/MountainEventSelector";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { t, formatNumberLocalized } from "@/lib/translations";
import { getHills } from "@/lib/data";
import { Hill } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LandslideEventRecord } from "@/lib/landslideEvents";

export default function LandslideLandingPage() {
  const router = useRouter();
  const { unit, language } = useAppStore();
  const [selectedHillId, setSelectedHillId] = useState<string>("ghagra");

  const { data: hills = [] } = useQuery<Hill[]>({
    queryKey: ["hills"],
    queryFn: () => getHills(),
  });

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={
          language === "bn"
            ? "ভূমিধস ঝুঁকি ও ঢাল পর্যবেক্ষণ"
            : "Landslide Hazards & Slope Stability"
        }
        subtitle={
          language === "bn"
            ? "পার্বত্য চট্টগ্রামের ঢাল স্থিতিশীলতা, অতীতের ভূমিধসের রেকর্ড এবং মৌসুমী বৃষ্টিপাত থ্রেশহোল্ড মডেলিং"
            : "Hilly slope stability, mass wasting records, and monsoonal rainfall threshold modeling"
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb & Meta strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-2 border-b border-border">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              {t("navHome", language)}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {t("navLandslide", language)}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{language === "bn" ? "সর্বশেষ আপডেট: জুন ২০২৪" : "Last updated: June 2024"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
              {language === "bn" ? "আপডেট সাইকেল: ঘটনা-ভিত্তিক" : "Update cycle: Event-based"}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bhumidorpon-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-surface to-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-xs">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink">
                {language === "bn"
                  ? "ঢাল স্খলন রেকর্ড ও সংবেদনশীলতা প্রক্ষেপণ"
                  : "Slope Failure Records & Susceptibility Projections"}
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {language === "bn"
                  ? "ডিজিটাল এলিভেশন মডেল (DEM), ঢাল নতিমাত্রা ও বৃষ্টিপাত স্যাচুরেশন ট্র্যাকিং"
                  : "Digital Elevation Models (DEM), slope gradient analysis, and precipitation saturation tracking"}
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {language === "bn"
              ? "পার্বত্য চট্টগ্রামে অতিবৃষ্টি ও পাহাড় কাটার কারণে পাহাড়ধসের ঘটনা ঘটে থাকে। ভূমিদর্পণ উপগ্রহ ইন্টারফেরোমেট্রিক এসএআর (InSAR) ও ভূ-উচ্চতা মডেল ব্যবহার করে অতীতে ঘটে যাওয়া ভূমিধস রেকর্ড এবং ভবিষ্যৎ মৌসুমের উচ্চ ঝুঁকিপূর্ণ ঢাল শনাক্ত করে।"
              : "Extreme monsoon downpours and hill-cutting in the Chittagong Hill Tracts trigger catastrophic slope failures and debris flows. BhumiDorpon utilizes InSAR satellite radar, elevation models, and soil saturation indices to document past landslides and forecast high-risk hill slopes."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "রেকর্ডকৃত ভূমিক্ষয়" : "Recorded Land Loss"}
              </div>
              <div className="text-lg font-bold text-[#D97706] tabular-nums mt-0.5">
                {formatArea(1620, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "প্রত্যাশিত ঝুঁকিপূর্ণ এলাকা" : "Projected High-Risk Area"}
              </div>
              <div className="text-lg font-bold text-predicted tabular-nums mt-0.5">
                {formatArea(2100, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "ক্রিটিক্যাল ঢাল কোণ" : "Critical Slope Angle"}
              </div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                ৩৮° – ৪৪°
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "পাইলট ক্লাস্টার" : "Pilot Cluster"}
              </div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                কাউখালী ও রাঙ্গামাটি
              </div>
            </div>
          </div>
        </div>

        {/* TWO-STEP MOUNTAIN & EVENT SELECTOR PREVIEW */}
        <div className="space-y-3">
          <MountainEventSelector
            mode="recorded"
            hills={hills}
            selectedHillId={selectedHillId}
            onSelectMountain={(id) => setSelectedHillId(id)}
            onSelectEvent={(ev) => {
              // Can navigate to detail if clicked
            }}
          />
        </div>

        {/* Option A & Option B */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">
            {language === "bn" ? "বিশ্লেষণ মোড বেছে নিন" : "Choose Analysis Mode"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OPTION A */}
            <div className="bhumidorpon-card p-6 sm:p-7 flex flex-col justify-between hover:border-ink/20 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt text-ink flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <span className="px-2.5 py-1 rounded-pill bg-gain-soft text-gain text-xs font-semibold">
                    {language === "bn" ? "ঐতিহাসিক ঘটনা" : "Historical Events"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink">
                    {language === "bn" ? "ক. রেকর্ডকৃত তথ্য" : "A. Recorded Data"}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {language === "bn"
                      ? "অতীতে ঘটে যাওয়া পাহাড়ধস, স্থানান্তরিত মাটির আয়তন এবং ক্ষতিগ্রস্ত বসতবাড়ির ক্যাডাস্ট্রাল রেকর্ড।"
                      : "Verified records of past mass-movement events, displaced soil volume, and impacted homestead deeds."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                    <span>স্থানান্তরিত ধ্বংসাবশেষের আয়তন (m³) ও ঢাল কোণ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain" />
                    <span>ক্ষতিগ্রস্ত বসতবাড়ি ও পুনর্বাসন প্রাক্কলন</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>ঘটনার পূর্ববর্তী ও পরবর্তী স্যাটেলাইট ঢাল তুলনা</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/landslide/recorded"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>{language === "bn" ? "রেকর্ডকৃত ঘটনা দেখুন" : "Explore Recorded Events"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* OPTION B */}
            <div className="bhumidorpon-card p-6 sm:p-7 flex flex-col justify-between border-predicted/30 hover:border-predicted transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-predicted-soft/50 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-predicted-soft text-predicted flex items-center justify-center font-bold text-sm">
                    B
                  </div>
                  <ForecastBadge label={language === "bn" ? "ডিপ লার্নিং মডেল" : "Deep Learning Model"} />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <span>{language === "bn" ? "খ. পূর্বাভাস (ডিপ লার্নিং)" : "B. Forecast (Deep Learning)"}</span>
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {language === "bn"
                      ? "বৃষ্টিপাত থ্রেশহোল্ড, শিলার ধারণক্ষমতা ও ঢাল বিশ্লেষণের মাধ্যমে ভবিষ্যৎ ভূমিধস ঝুঁকি পূর্বাভাস।"
                      : "Spatial susceptibility forecasting driven by rainfall thresholds, geotechnical shear, and topographic wetness."}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-predicted-soft/80 border border-predicted/20 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-predicted text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "সতর্কতা নোট:" : "Honesty Note:"}</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {language === "bn"
                      ? "এটি একটি মডেল-ভিত্তিক অনুমান, কোনো সরকারি রেকর্ড নয়। চরম আকস্মিক অতিবৃষ্টিতে ঢাল দ্রুত পরিবর্তনশীল হতে পারে।"
                      : "This is a model-based estimate, not an official government record. Heavy unseasonal downpours or seismic events can destabilize slopes rapidly."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-predicted" />
                    <span>ঢালের পাদদেশে বসতির জন্য আগাম সতর্কতা বাফার</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warn" />
                    <span>প্রত্যাশিত স্থানান্তরিত মাটির আয়তন ও সরিয়ে নেওয়ার অগ্রাধিকার</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>ড্যাশড ঝুঁকি মানচিত্রের বাফার সীমানা</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/landslide/forecast"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === "bn" ? "পূর্বাভাস মডেল দেখুন" : "Explore Forecast Model"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
