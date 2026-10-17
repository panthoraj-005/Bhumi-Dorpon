"use client";

import React from "react";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Database,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  ChevronRight,
  AlertCircle,
  Compass,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ForecastBadge } from "@/components/ForecastBadge";
import { useAppStore } from "@/stores/appStore";
import { formatArea } from "@/lib/units";

export default function CoastalLandingPage() {
  const { unit, language } = useAppStore();

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={language === "bn" ? "উপকূলীয় ভাঙন ও চর গঠন" : "Coastal Shoreline & Accretion"}
        subtitle={
          language === "bn"
            ? "ভোলা, মনপুরা এবং মেঘনা মোহনায় জোয়ারভাটা জনিত উপকূল ক্ষয় ও নতুন জেগে ওঠা জমি"
            : "Bhola, Monpura, and Meghna estuary tidal shoreline migration, erosion, and newly emerged unassigned land"
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb & Meta strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted pb-2 border-b border-border">
          <nav className="flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-ink transition-colors">
              {language === "bn" ? "নীড়পাতা" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-semibold">
              {language === "bn" ? "উপকূলীয় ভাঙন ও চর গঠন" : "Coastal Shoreline & Accretion"}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{language === "bn" ? "সর্বশেষ আপডেট: ডিসেম্বর ২০২৪" : "Last updated: December 2024"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
              {language === "bn" ? "আপডেট সাইকেল: বার্ষিক" : "Update cycle: Annual"}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bhumidorpon-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-surface to-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gain-soft text-gain flex items-center justify-center shadow-xs">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink">
                {language === "bn"
                  ? "উপকূলীয় রেখার স্থানান্তর ও অনথিভুক্ত কাদাচর"
                  : "Shoreline Migration & Unassigned Mudflats"}
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {language === "bn"
                  ? "জোয়ারভাটা উপকূলীয় রেখা পর্যবেক্ষণ, মোহনা স্যাটেলাইট চিত্র এবং ভার্চুয়াল ক্যাডাস্ট্রাল ব্লক"
                  : "Tidal shoreline tracking, estuarine satellite albums, and virtual cadastral accretion blocks"}
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {language === "bn"
              ? "মেঘনা মোহনা এবং দক্ষিণ বঙ্গোপসাগর উপকূলে তীব্র জোয়ারের কারণে বাইরের তীরবর্তী অঞ্চলে তীব্র ভাঙন হয় এবং একই সাথে শত শত একর নতুন পলিময় কাদাচর জেগে ওঠে। এই নতুন ভূমিগুলো সনাতন মৌজা সীমানার বাইরে থাকে। ভূমিদর্পণ সরকারি রেকর্ডের জন্য ক্ষয়ক্ষতি ও নতুন জাগা জমি উভয়ই সংরক্ষণ করে।"
              : "In the Meghna estuary and southern Bay of Bengal coastline, high tidal energy causes severe outer bank erosion while simultaneously depositing hundreds of acres of intertidal mudflats seaward. These newly emerged areas often fall outside traditional mouza boundaries. BhumiDorpon documents both loss and unassigned accretion land for state cadastral recordkeeping."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "রেকর্ডকৃত জেগে ওঠা জমি" : "Recorded Accretion Land"}
              </div>
              <div className="text-lg font-bold text-gain tabular-nums mt-0.5">
                {formatArea(380, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "উপকূলীয় জমি ক্ষয়" : "Coastal Shoreline Loss"}
              </div>
              <div className="text-lg font-bold text-loss tabular-nums mt-0.5">
                {formatArea(512, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "অনথিভুক্ত কাদাচর" : "Unassigned Mudflats"}
              </div>
              <div className="text-lg font-bold text-accent-deep tabular-nums mt-0.5">
                {formatArea(240, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "গড় লবণাক্ততা সূচক" : "Mean Salinity Index"}
              </div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                12.4 dS/m
              </div>
            </div>
          </div>
        </div>

        {/* Option A & Option B */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">
            {language === "bn" ? "অনুসন্ধান মোড নির্বাচন করুন" : "Select Exploration Mode"}
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
                    {language === "bn" ? "বর্তমান রেকর্ড" : "Current Records"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink">
                    {language === "bn" ? "ক. রেকর্ডকৃত তথ্য (ঐতিহাসিক উপকূলীয় রেখা)" : "A. Recorded Data (Historical Shoreline)"}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {language === "bn"
                      ? "ভোলা, মনপুরা ও চরফ্যাশনের উপকূল ভাঙনের সাথে নতুন জেগে ওঠা কাদাচরের মৌজা দাগ।"
                      : "Bhola, Monpura, and Char Fasson shoreline erosion alongside newly emerged unassigned mudflat parcels."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-loss" />
                    <span>
                      {language === "bn"
                        ? "পশ্চিম তীরের ভাঙনজনিত দাগের ক্ষতিপূরণ ও ক্ষয়ক্ষতি রেজিস্টার"
                        : "West bank erosion plot compensation and loss registers"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain" />
                    <span>
                      {language === "bn"
                        ? "সমুদ্রাভিমুখী পলি জমা এবং ভার্চুয়াল অনথিভুক্ত মৌজা ব্লক"
                        : "Seaward accretion and virtual unassigned mouza blocks"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-water" />
                    <span>
                      {language === "bn"
                        ? "জোয়ারের বিস্তার ও মোহনার লবণাক্ততা পরিমাপ"
                        : "Tidal amplitude and estuarine salinity tracking"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/coastal/recorded"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>{language === "bn" ? "রেকর্ডকৃত উপকূলীয় রেখা দেখুন" : "View Recorded Shoreline"}</span>
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
                      ? "সমুদ্রপৃষ্ঠের গতিবিধি, জোয়ারভাটার টান এবং পলি জমার মডেলের সাহায্যে ১ বছরের উপকূলীয় রেখার পরিবর্তন প্রক্ষেপণ।"
                      : "Sea-level dynamics, tidal shear, and estuarine sedimentation models projecting 1-year coastal shoreline change."}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-predicted-soft/80 border border-predicted/20 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-predicted text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "বৈজ্ঞানিক সতর্কবার্তা:" : "Scientific Disclaimer:"}</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {language === "bn"
                      ? "এটি একটি মডেল-ভিত্তিক প্রক্ষেপণ, কোনো সরকারি দাপ্তরিক রেকর্ড নয়। সামুদ্রিক জলোচ্ছ্বাস ও ঘূর্ণিঝড়ের কারণে কাদাচর অপ্রত্যাশিতভাবে পরিবর্তিত হতে পারে।"
                      : "This is a model-based estimate, not an official government record. Storm surges and cyclone events can shift mudflats unpredictably."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-predicted" />
                    <span>
                      {language === "bn"
                        ? "সমুদ্রাভিমুখী কাদাচরের সম্ভাব্য সম্প্রসারণ ও বৃদ্ধি"
                        : "Projected seaward mudflat expansion and accretion"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-loss" />
                    <span>
                      {language === "bn"
                        ? "ঝুঁকিপূর্ণ উপকূলীয় বাঁধ ও ম্যানগ্রোভ প্রান্তসীমা"
                        : "Vulnerable coastal embankment and mangrove margins"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>
                      {language === "bn"
                        ? "আগামী ১ বছরের প্রত্যাশিত উপকূল রেখার ড্যাশড লাইন প্রক্ষেপণ"
                        : "Dashed line projections of expected 1-year shoreline"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/coastal/forecast"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === "bn" ? "পূর্বাভাসকৃত উপকূলীয় রেখা দেখুন" : "View Forecast Shoreline"}</span>
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
