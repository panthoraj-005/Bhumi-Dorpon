"use client";

import React from "react";
import Link from "next/link";
import {
  Waves,
  ArrowRight,
  Database,
  Sparkles,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ForecastBadge } from "@/components/ForecastBadge";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";
import { t, formatNumberLocalized } from "@/lib/translations";

export default function RiverErosionLandingPage() {
  const { unit, language } = useAppStore();
  const isBn = language === "bn";

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={isBn ? "নদীভাঙন পর্যবেক্ষণ ও রেকর্ড" : "River Erosion"}
        subtitle={
          isBn
            ? "সক্রিয় নদী তীররেখা ভাঙন, ক্যাডাস্ট্রাল দাগের ক্ষতি এবং হাইড্রোর্ডাইনামিক পূর্বাভাস মডেল"
            : "Active channel bank retreat, plot loss records, and hydrodynamic forecast models"
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
              {t("navRiverErosion", language)}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{isBn ? "সর্বশেষ আপডেট: অক্টোবর ২০২৪" : "Last updated: October 2024"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
              {isBn ? "আপডেট সাইকেল: বার্ষিক জরিপ" : "Update cycle: Annual survey"}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bhumidorpon-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-surface to-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-loss-soft text-loss flex items-center justify-center shadow-xs">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink">
                {isBn
                  ? "নদীভাঙন রেকর্ড ও ডিপ লার্নিং ঝুঁকি প্রক্ষেপণ"
                  : "Riverbank Erosion Records & Deep Learning Projections"}
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {isBn
                  ? "উপগ্রহ এসএআর চিত্র, ডিজিটাল ক্যাডাস্ট্রাল সীমানা এবং স্প্যাশিয়াল হাইড্রোডাইনামিক মডেলিং"
                  : "Satellite SAR imagery, digital cadastral boundary overlay, and spatial hydrodynamic modeling"}
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {isBn
              ? "যমুনা, পদ্মা ও মেঘনা নদীর তীব্র স্রোত ও মৌসুমী বর্ষায় প্রতিনিয়ত নদীভাঙনে ক্যাডাস্ট্রাল দাগের সীমানা বিলীন হচ্ছে। ভূমিদর্পণ সেন্টিনেল-১ এসএআর ও সেন্টিনেল-২ উপগ্রহ চিত্রের সাথে সরকারি আরএস/বিএস ক্যাডাস্ট্রাল মানচিত্র মিলিয়ে দাগভিত্তিক ভূমিক্ষয় নথিভুক্ত করে এবং ভবিষ্যৎ তীররেখা ভাঙনের পূর্বাভাস দেয়।"
              : "Intense seasonal monsoonal currents along the Jamuna, Padma, and Meghna rivers trigger continuous bank scouring and cadastral boundary displacement. BhumiDorpon fuses Sentinel-1 SAR and Sentinel-2 multi-spectral composites with official RS/BS cadastral maps to track plot-level land loss and forecast bank retreat vulnerability."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {isBn ? "মোট রেকর্ডকৃত ক্ষয়" : "Recorded Total Loss"}
              </div>
              <div className="text-lg font-bold text-loss tabular-nums mt-0.5">
                {formatArea(8420, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {isBn ? "প্রত্যাশিত ১ বছরের ঝুঁকি" : "Projected 1-Year Risk"}
              </div>
              <div className="text-lg font-bold text-predicted tabular-nums mt-0.5">
                {formatArea(11200, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {isBn ? "ক্ষতিগ্রস্ত পরিবার" : "Impacted Families"}
              </div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                {formatNumberLocalized(890, language)} {isBn ? "পরিবার" : "Families"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {isBn ? "নজরদারিকৃত নদীসমূহ" : "Monitored Rivers"}
              </div>
              <div className="text-lg font-bold text-water tabular-nums mt-0.5">
                {isBn ? "যমুনা, মেঘনা, পদ্মা" : "Jamuna, Meghna, Padma"}
              </div>
            </div>
          </div>
        </div>

        {/* Option A & Option B Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">
            {isBn ? "বিশ্লেষণ মোড বেছে নিন" : "Choose Analysis Mode"}
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
                    {isBn ? "যাচাইকৃত রেকর্ড" : "Verified Records"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink">
                    {isBn ? "ক. রেকর্ডকৃত তথ্য" : "A. Recorded Data"}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {isBn
                      ? "উপগ্রহ পর্যবেক্ষণ এবং সরকারি ক্যাডাস্ট্রাল মৌজা রেকর্ডের ভিত্তিতে যাচাইকৃত ঐতিহাসিক নদীভাঙনের তথ্য।"
                      : "Historical satellite observation and verified cadastral mouza deeds reflecting recorded riverbank erosion."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-loss" />
                    <span>{isBn ? "দাগভিত্তিক ক্ষতির পরিমাপ, খতিয়ান দলিল ও দাগ নম্বর" : "Plot-by-plot loss measurements, khatian deeds, and dag numbers"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain" />
                    <span>{isBn ? "সরকারি ক্ষতিপূরণ প্রদান ও অনুমোদন অবস্থা" : "Official compensation disbursement status"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-water" />
                    <span>{isBn ? "ইন্টারেক্টিভ পাশাপাশি পূর্ব ও পরবর্তী মানচিত্র তুলনা" : "Interactive before vs after side-by-side map comparison"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/river-erosion/recorded"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>{isBn ? "রেকর্ডকৃত তথ্য অন্বেষণ করুন" : "Explore Recorded Data"}</span>
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
                  <ForecastBadge label={isBn ? "ডিপ লার্নিং মডেল" : "Deep Learning Model"} />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <span>{isBn ? "খ. পূর্বাভাস (ডিপ লার্নিং)" : "B. Forecast (Deep Learning)"}</span>
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {isBn
                      ? "মাল্টি-টেম্পোরাল স্যাটেলাইট সিকোয়েন্স বিশ্লেষণ ও কনভোলিউশনাল এলএসটিএম দ্বারা পরবর্তী মৌসুমের তীরভাঙন ঝুঁকি প্রক্ষেপণ।"
                      : "Multitemporal satellite sequence analysis and Convolutional LSTM forecasting next season's bank retreat risk."}
                  </p>
                </div>

                {/* Honesty note */}
                <div className="p-3 rounded-lg bg-predicted-soft/80 border border-predicted/20 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-predicted text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? "সতর্কতা নোট:" : "Honesty Note:"}</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {t("disclaimerNote", language)}{" "}
                    {isBn
                      ? "প্রাকৃতিক হাইড্রোডাইনামিক পরিবর্তনের কারণে নদীর গতিপথ অপ্রত্যাশিতভাবে পরিবর্তিত হতে পারে।"
                      : "Natural hydraulic variations may alter channel morphology unexpectedly."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-predicted" />
                    <span>{isBn ? "উচ্চ ঝুঁকিপূর্ণ তীররেখা বাফার এলাকার অন্তর্ভুক্ত দাগ" : "Plots within high vulnerability retreat buffer"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warn" />
                    <span>{isBn ? "প্রত্যাশিত ক্ষতিপূরণ বাজেট প্রাক্কলন" : "Projected compensation budget estimation"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>{isBn ? "ড্যাশযুক্ত সম্ভাব্য তীররেখা সীমারেখা" : "Dashed projected bank line outlines"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/river-erosion/forecast"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isBn ? "পূর্বাভাস মডেল অন্বেষণ করুন" : "Explore Forecast Model"}</span>
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
