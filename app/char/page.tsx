"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
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

export default function CharLandingPage() {
  const { unit, language } = useAppStore();

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AppHeader
        title={language === "bn" ? "চর ও নদীদ্বীপ" : "Char Islands"}
        subtitle={
          language === "bn"
            ? "ব্রেইডেড নদীখাতে চরের উত্থান, স্থিতিশীলতা সূচক এবং সরকারি খাস জমি বণ্টন"
            : "Braided channel sandbar emergence, stability index, and state khas land deeds"
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
              {language === "bn" ? "চর ও নদীদ্বীপ" : "Char Islands"}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <span>{language === "bn" ? "সর্বশেষ আপডেট: নভেম্বর ২০২৪" : "Last updated: November 2024"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[11px] font-medium text-secondary">
              {language === "bn" ? "আপডেট সাইকেল: বার্ষিক জরিপ" : "Update cycle: Annual survey"}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bhumidorpon-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-surface to-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-ink">
                {language === "bn"
                  ? "পলিজ বালুচরের উত্থান ও ভূ-প্রাকৃতিক স্থিতিশীলতা"
                  : "Alluvial Island Emergence & Morphological Stability"}
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {language === "bn"
                  ? "স্যাটেলাইট ট্র্যাকিংয়ের মাধ্যমে চরের বৃদ্ধি, উদ্ভিজ্জ একত্রীকরণ ও সরকারি খাস জমি বণ্টন বিশ্লেষণ"
                  : "Multitemporal satellite tracking of sandbar accretion, vegetation consolidation, and state land allocation"}
              </p>
            </div>
          </div>

          <p className="text-sm text-secondary leading-relaxed max-w-3xl">
            {language === "bn"
              ? "বাংলাদেশের সক্রিয় ব্রেইডেড নদীখাতে চরসমূহ ক্রমাগত জেগে ওঠে, সংযুক্ত হয় বা বিলীন হয়। ভূমিদর্পণ উদ্ভিজ্জ ঘনত্ব (NDVI) এবং পলি জমার হার বিশ্লেষণ করে স্থিতিশীলতা সূচক (০.০ থেকে ১.০) গণনা করে এবং স্বচ্ছ প্রশাসনের জন্য নতুন জাগা খাস জমি রেকর্ড করে।"
              : "In Bangladesh's active braided river channels, chars (river islands) constantly emerge, attach, or erode. BhumiDorpon quantifies vegetation density (NDVI) and sediment trapping to compute a Stability Index (0.0 to 1.0) and records newly accreted state khas land for transparent public administration."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "মোট নতুন চর" : "Total New Accretion"}
              </div>
              <div className="text-lg font-bold text-gain tabular-nums mt-0.5">
                {formatArea(420, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "ভাঙনপ্রাপ্ত চরের অংশ" : "Eroded Char Fringe"}
              </div>
              <div className="text-lg font-bold text-loss tabular-nums mt-0.5">
                {formatArea(180, unit, language)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "পর্যবেক্ষণাধীন পাইলট চর" : "Monitored Pilot Chars"}
              </div>
              <div className="text-lg font-bold text-ink tabular-nums mt-0.5">
                {language === "bn" ? "৫টি পাইলট চর" : "5 Pilot Chars"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface border border-border">
              <div className="text-[11px] text-muted">
                {language === "bn" ? "গড় স্থিতিশীলতা সূচক" : "Mean Stability Index"}
              </div>
              <div className="text-lg font-bold text-accent-deep tabular-nums mt-0.5">
                {language === "bn" ? "০.৬৮ / ১.০" : "0.68 / 1.0"}
              </div>
            </div>
          </div>
        </div>

        {/* Option A & Option B */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">
            {language === "bn" ? "বিশ্লেষণ মোড নির্বাচন করুন" : "Choose Analysis Mode"}
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
                    {language === "bn" ? "বর্তমান চর" : "Current Chars"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-ink">
                    {language === "bn" ? "ক. রেকর্ডকৃত তথ্য" : "A. Recorded Data"}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {language === "bn"
                      ? "বিদ্যমান চরের সীমানা, কৃষি বসতি এবং নিবন্ধিত সরকারি খাস খতিয়ান (১/১ দাগ)।"
                      : "Existing char island footprints, agricultural settlements, and registered government khas land (1/1 deeds)."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gain" />
                    <span>
                      {language === "bn"
                        ? "জেগে ওঠা ফসলি জমির দাগ ও উদ্ভিজ্জ স্থিতিশীলতা"
                        : "Accreted farmland parcels and vegetation stability"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                    <span>
                      {language === "bn"
                        ? "সরকারি খাস জমি ট্র্যাকিং ও অদখলকৃত দাগ"
                        : "State khas land tracking and unowned parcels"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-water" />
                    <span>
                      {language === "bn"
                        ? "স্যাটেলাইটের মাধ্যমে পূর্বের ও পরের মানচিত্র তুলনা"
                        : "Satellite before/after morphodynamics map comparison"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/char/recorded"
                  className="btn-lime w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>{language === "bn" ? "বিদ্যমান চরসমূহ দেখুন" : "Explore Existing Chars"}</span>
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
                      ? "পলি প্রবাহ ও হাইড্রোডাইনামিক শিয়ার মডেলের সাহায্যে আগামী বছরের চরের সম্ভাব্য বৃদ্ধি বা ক্ষয় প্রক্ষেপণ।"
                      : "Sediment flux and hydrodynamic shear models projecting next year's sandbar growth or scoured erosion."}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-predicted-soft/80 border border-predicted/20 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-predicted text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "সতর্কতা নোট:" : "Honesty Note:"}</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    {language === "bn"
                      ? "এটি একটি মডেল-ভিত্তিক প্রক্ষেপণ, কোনো সরকারি দাপ্তরিক রেকর্ড নয়। বর্ষায় নদীর গতিপথ অপ্রত্যাশিতভাবে পরিবর্তন হতে পারে।"
                      : "This is a model-based estimate, not an official government record. Upstream monsoon discharge can re-channel braided streams unexpectedly."}
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-muted pt-2 border-t border-border">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-predicted" />
                    <span>
                      {language === "bn"
                        ? "প্রত্যাশিত চরের সংযুক্তি বা ভাটির দিকে স্থানচ্যুতি"
                        : "Projected char attachment or downstream migration"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-deep" />
                    <span>
                      {language === "bn"
                        ? "বনায়ন এবং স্থায়ী বসতির উপযুক্ততা নিরূপণ"
                        : "Afforestation and permanent settlement suitability"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                    <span>
                      {language === "bn"
                        ? "ড্যাশড লাইনে নির্দেশিত সম্ভাব্য চরের সীমানা ম্যাপিং"
                        : "Dashed projected sandbar boundary mapping"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/char/forecast"
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
