"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Info,
  Waves,
  CloudRain,
  Mountain,
  Compass,
  Anchor,
  Layers,
  Map,
  Sliders,
  LayoutGrid,
  Calendar,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAppStore } from "@/stores/appStore";

export default function AboutProjectPage() {
  const { language } = useAppStore();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <AppHeader
        title={
          language === "bn"
            ? "প্রকল্প পরিচিতি"
            : "About Project"
        }
        subtitle={
          language === "bn"
            ? "ভূমি-দর্পণ প্ল্যাটফর্মের উদ্দেশ্য, প্রাকৃতিক দুর্যোগের মডিউল এবং পরীক্ষিত সুবিধাসমূহ"
            : "BhumiDorpon platform purpose, hazard modules, and verified features"
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb / Return to Settings */}
        <div className="flex items-center justify-between">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-surface border border-border hover:border-ink/30 text-ink text-xs sm:text-sm font-medium transition-all shadow-subtle group"
          >
            <ArrowLeft className="w-4 h-4 text-muted group-hover:text-ink group-hover:-translate-x-0.5 transition-transform" />
            <span>
              {language === "bn"
                ? "সেটিংসে ফিরে যান"
                : "Back to Settings"}
            </span>
          </Link>
          <span className="text-xs text-muted font-medium">
            {language === "bn"
              ? "সেটিংস / প্রকল্প পরিচিতি"
              : "Settings / About Project"}
          </span>
        </div>

        {/* 1. Project Overview */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "প্রকল্প পরিচিতি" : "Project Overview"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "মূল উদ্দেশ্য ও পরিধি" : "Core Mission & Scope"}
              </span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
            {language === "bn" ? (
              <>
                <strong className="text-ink font-semibold">ভূমি-দর্পণ</strong> হলো বাংলাদেশের প্রাকৃতিক দুর্যোগে ভূমির রূপগত পরিবর্তন ও ক্ষয়ক্ষতি পর্যবেক্ষণ ও তুলনামূলক পর্যালোচনার একটি উন্নত প্ল্যাটফর্ম। এতে ক্যাডাস্ট্রাল দাগভিত্তিক সীমানা, ঐতিহাসিক ক্ষয়ক্ষতি ও বৃদ্ধির তথ্য এবং ডিপ লার্নিং ভিত্তিক পূর্বাভাস একীভূত করা হয়েছে।
              </>
            ) : (
              <>
                <strong className="text-ink font-semibold">BhumiDorpon</strong> is a land-change and natural-hazard visualization demo focused on viewing and comparing areas affected by natural hazards across Bangladesh. The platform brings together parcel-level cadastral boundaries, historical land loss/gain records, and predictive modeling in an interactive visual interface.
              </>
            )}
          </p>
        </section>

        {/* 2. Hazard Modules */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "দুর্যোগের মডিউলসমূহ" : "Hazard Modules"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "পাঁচটি প্রাকৃতিক দুর্যোগ বিশ্লেষণ" : "Five Covered Natural Hazards"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* River Erosion */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-water flex items-center justify-center shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  {language === "bn" ? "নদীভাঙন" : "River Erosion"}
                </h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {language === "bn"
                    ? "যমুনা, পদ্মা ও মেঘনার মতো প্রধান নদীগুলোতে সক্রিয় তীরভাঙন, সীমানা বিলীন এবং ক্যাডাস্ট্রাল দাগের ক্ষতি বিশ্লেষণ।"
                    : "Active riverbank migration, boundary retreat, and cadastral plot loss along major river systems such as the Jamuna, Padma, and Meghna."}
                </p>
              </div>
            </div>

            {/* Flood */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-water flex items-center justify-center shrink-0">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  {language === "bn" ? "বন্যা" : "Flood"}
                </h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {language === "bn"
                    ? "মৌজাভিত্তিক প্লাবন পর্যবেক্ষণ, সর্বোচ্চ বিস্তার, ক্ষতিগ্রস্ত দাগ ট্র্যাকিং, গভীরতা শ্রেণি ও ক্ষতিপূরণ ব্যবস্থাপনা।"
                    : "Mouza-level inundation monitoring, flood progression events, affected land parcel tracking, water depth classification, and owner compensation impact."}
                </p>
              </div>
            </div>

            {/* Landslide */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-loss flex items-center justify-center shrink-0">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  {language === "bn" ? "পাহাড়ধস" : "Landslide"}
                </h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {language === "bn"
                    ? "বান্দরবান ও রাঙ্গামাটির মতো পার্বত্য অঞ্চলে ঢালের তীব্রতা, কনট্যুর, উচ্চতা ও ধস ঝুঁকি অঞ্চল ম্যাপিং।"
                    : "Hilly terrain hazard zones, elevation profiles, slope analysis, contours, and spot heights in southeastern Bangladesh (e.g., Bandarban, Rangamati)."}
                </p>
              </div>
            </div>

            {/* Char Formation and Erosion */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-gain flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  {language === "bn" ? "চর গঠন ও পলিজ বৃদ্ধি" : "Char Formation and Erosion"}
                </h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {language === "bn"
                    ? "সক্রিয় নদীখাতে নতুন বালুচর জেগে ওঠা, উদ্ভিজ্জ স্থায়িত্ব সূচক (NDVI) এবং সরকারি খাস জমি বণ্টন ট্র্যাকিং।"
                    : "Dynamic sandbar island accretion, new land emergence, erosion patterns, and temporal vegetation dynamics in active riverbeds."}
                </p>
              </div>
            </div>

            {/* Coastal Erosion and Land Formation */}
            <div className="p-4 rounded-xl bg-bg border border-border flex items-start gap-3.5 md:col-span-2">
              <div className="w-9 h-9 rounded-lg bg-surface border border-border text-accent-deep flex items-center justify-center shrink-0">
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  {language === "bn" ? "উপকূলীয় পরিবর্তন ও পলিজ বৃদ্ধি" : "Coastal Erosion and Land Formation"}
                </h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {language === "bn"
                    ? "বঙ্গোপসাগর উপকূলরেখার ভাঙন, সামুদ্রিক জোয়ারের প্রভাব এবং বদ্বীপ অঞ্চলে নতুন ভূমি গঠন ও বাঁধের অবস্থা।"
                    : "Marine coastline retreat, tidal surge exposure, deltaic sediment accumulation, and coastal embankment shifts across the Bay of Bengal coastline."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Map Comparison */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "মানচিত্রের তুলনামূলক পর্যালোচনা" : "Map Comparison"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "পাশাপাশি সরাসরি পরিবর্তন যাচাই" : "Side-by-Side Visual Verification"}
              </span>
            </div>
          </div>
          <p className="text-sm text-ink-2 leading-relaxed">
            {language === "bn"
              ? "ডেস্কটপ লেআউটে পূর্বের ও পরের মানচিত্র পাশাপাশি প্রদর্শিত হয়, যা একই এলাকার সময়ের ব্যবধানে পরিবর্তন সরাসরি তুলনা করতে সাহায্য করে। ব্যবহারকারীরা একই ভৌগোলিক সীমানায় দুর্যোগের আগের ভূমির অবস্থা ও পরের রূপগত পরিবর্তন একসাথে দেখতে পারেন। মোবাইল স্ক্রিনে ব্যবহারকারীর সুবিধার জন্য পূর্বের মানচিত্র উপরে এবং পরের মানচিত্র নিচে চমৎকারভাবে সজ্জিত থাকে।"
              : "Before and After maps are displayed side by side on desktop layouts for direct visual comparison of territorial changes over time. Users can simultaneously observe baseline land status against post-hazard or projected changes for the exact same geographic extent. On mobile viewports, the layout responsively stacks the Before map first and After map second while preserving identical controls."}
          </p>
        </section>

        {/* 4. Map Controls and Basemaps */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "মানচিত্র নিয়ন্ত্রণ ও বেইসম্যাপ" : "Map Controls and Basemaps"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "কার্টোগ্রাফিক ইঞ্জিন ও সিঙ্ক্রোনাইজেশন" : "Cartographic Engine & Synchronization"}
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <p>
              {language === "bn"
                ? "মানচিত্র ইন্টারফেসে বিভিন্ন কার্টোগ্রাফিক দৃষ্টিকোণ থেকে দুর্যোগের প্রভাব পর্যবেক্ষণে দ্বৈত বেইসম্যাপের সুবিধা রয়েছে:"
                : "The map interface incorporates dual basemap choices to inspect hazard phenomena across distinct cartographic representations:"}
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                <strong className="text-ink">{language === "bn" ? "জিআইএস বেইসম্যাপ:" : "Light GIS Basemap:"}</strong>{" "}
                {language === "bn"
                  ? "উচ্চ স্পষ্টতার ভেক্টর মানচিত্র যা জমির দাগ, প্রশাসনিক মৌজা সীমানা ও থিম্যাটিক দুর্যোগ অঞ্চলকে প্রাধান্য দেয়।"
                  : "Clean, high-legibility vector rendering prioritizing parcel outlines, administrative mouza borders, and thematic hazard zones."}
              </li>
              <li>
                <strong className="text-ink">{language === "bn" ? "উপগ্রহ বেইসম্যাপ:" : "Satellite Basemap:"}</strong>{" "}
                {language === "bn"
                  ? "উচ্চ রেজ্যুলেশনের উপগ্রহ চিত্র যা ক্যাডাস্ট্রাল সীমানার পেছনের বাস্তব ভূপ্রকৃতি ও নদীপ্রবাহ অবলোকন করতে দেয়।"
                  : "High-resolution aerial and satellite imagery allowing real terrain visualization behind cadastral boundaries."}
              </li>
              <li>
                <strong className="text-ink">{language === "bn" ? "ভৌগোলিক সিঙ্ক্রোনাইজেশন:" : "Geographic Synchronization:"}</strong>{" "}
                {language === "bn"
                  ? "ইন্টারেক্টিভ জুম ও প্যান নিয়ন্ত্রণ রিয়েল-টাইমে একসাথে কাজ করে; যেকোনো একটি মানচিত্র সরালে অন্যটিও স্বয়ংক্রিয়ভাবে সিঙ্ক হয়।"
                  : "Interactive zoom and pan controls operate in real-time synchronicity; moving or zooming either comparison map automatically updates the paired map."}
              </li>
              <li>
                <strong className="text-ink">{language === "bn" ? "সরাসরি নিয়ন্ত্রণ:" : "Direct Controls:"}</strong>{" "}
                {language === "bn"
                  ? "সহজে জুম-ইন (+) এবং জুম-আউট (−) বোতাম ও স্বয়ংক্রিয় সীমানা ফিট করার সুবিধা।"
                  : "Immediate single-click zoom-in (+) and zoom-out (−) controls with auto-fit viewport bounds."}
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Map Layers and Information */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "মানচিত্রের লেয়ার ও তথ্য" : "Map Layers and Information"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "ওভারলে, নির্দেশিকা ও ক্যাডাস্ট্রাল তথ্য" : "Overlays, Legends, and Cadastral Data"}
              </span>
            </div>
          </div>
          <p className="text-sm text-ink-2 leading-relaxed">
            {language === "bn"
              ? "প্রতিটি মানচিত্রে দুর্যোগের ওভারলে, স্ট্যাটাস ব্যাজ, ইন্টারঅ্যাক্টিভ নির্দেশিকা এবং জমির দাগভিত্তিক তথ্য সংহত রয়েছে। প্রতিটি দাগে যাচাইকৃত দাগ নম্বর, খতিয়ান নম্বর, মালিকের নাম, জমির শ্রেণি এবং সুনির্দিষ্ট পরিমাপ পাওয়া যায়। মানচিত্রের নিচের প্যানেলে মৌজার সারসংক্ষেপ, ক্ষতিগ্রস্ত মালিকদের তালিকা ও ক্ষতিপূরণের বিবরণ প্রদর্শিত হয়।"
              : "Every map view integrates thematic hazard overlays, color-coded status badges, interactive legends, and cadastral parcel data. Individual land plots feature verified Dag No. and Khatian No. identifiers, owner names, land classifications, and area calculations. Context panels below the maps display mouza-wise summaries, affected owner registries, and compensation breakdowns."}
          </p>
        </section>

        {/* 6. Dashboard and Other Pages */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "ড্যাশবোর্ড ও অন্যান্য পেজ" : "Dashboard and Other Pages"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "অ্যাপ্লিকেশন নেভিগেশন ও পর্যবেক্ষণ" : "Application Navigation & Views"}
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <p>
              {language === "bn"
                ? "দুর্যোগ তুলনা মডিউলগুলোর পাশাপাশি প্ল্যাটফর্মে আরও অন্তর্ভুক্ত রয়েছে:"
                : "In addition to the hazard comparison modules, the application includes:"}
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                <strong className="text-ink">{language === "bn" ? "হোম ড্যাশবোর্ড:" : "Home Dashboard:"}</strong>{" "}
                {language === "bn"
                  ? "সারাদেশের সামগ্রিক চিত্র, মোট জমি হ্রাস/বৃদ্ধির পরিসংখ্যান, ক্ষতিগ্রস্ত মালিকের সংখ্যা, ক্ষতিপূরণের সারসংক্ষেপ ও বহুবর্ষীয় ট্রেন্ড চার্ট।"
                  : "Comprehensive national overview presenting aggregated land loss/gain statistics, affected owner totals, compensation summaries, multi-year trend charts, and distribution rankings."}
              </li>
              <li>
                <strong className="text-ink">{language === "bn" ? "মালিকের তথ্য ও বিস্তারিত পেজ:" : "Owner Map & Detail Page:"}</strong>{" "}
                {language === "bn"
                  ? "মালিকের ব্যক্তিগত জমির খতিয়ান, প্লট বহুভুজ, যাচাইকৃত চার কোণার স্থানাঙ্ক (উত্তর-পশ্চিম, উত্তর-পূর্ব, দক্ষিণ-পূর্ব, দক্ষিণ-পশ্চিম) এবং ক্ষতিপূরণ স্ট্যাটাস।"
                  : "Cadastral landowner portfolio page detailing individual parcel polygons, verified four-corner boundary coordinates (NW, NE, SE, SW), flooded areas, and compensation payment statuses."}
              </li>
              <li>
                <strong className="text-ink">{language === "bn" ? "কম্পোনেন্ট শোকেস:" : "Component Showcase:"}</strong>{" "}
                {language === "bn"
                  ? "/dev/components রুটে সকল ইউআই কম্পোনেন্ট, ব্যাজ, চার্ট ও টগল স্টেটের ডেভেলপার রেফারেন্স ক্যাটালগ।"
                  : "A developer reference catalog at /dev/components illustrating all UI components, badges, charts, and toggle states."}
              </li>
            </ul>
          </div>
        </section>

        {/* 7. Recorded and Forecast */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "রেকর্ডকৃত বনাম পূর্বাভাস মোড" : "Recorded and Forecast"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "দ্বৈত বিশ্লেষণ মোড" : "Dual Analysis Modes"}
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-ink-2 leading-relaxed">
            <p>
              {language === "bn"
                ? "প্ল্যাটফর্মটি ঐতিহাসিক নথিপত্র এবং ভবিষ্যতমুখী অনুমানের মধ্যে স্পষ্টভাবে পার্থক্য বজায় রাখে:"
                : "The platform clearly differentiates between historical records and forward-looking projections:"}
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                <strong className="text-ink">{language === "bn" ? "রেকর্ডকৃত তথ্য (ক):" : "Recorded View:"}</strong>{" "}
                {language === "bn"
                  ? "বাস্তব ঘটনা ও ক্যাডাস্ট্রাল জরিপের ওপর ভিত্তি করে ঐতিহাসিক জমির পরিবর্তন। এতে প্রকৃত ক্ষতিপূরণ বিতরণের স্ট্যাটাস (প্রদত্ত, অনুমোদিত, প্রক্রিয়াধীন) অন্তর্ভুক্ত।"
                  : "Represents historical and observed land changes based on documented ground events and cadastral surveys. Includes actual compensation disbursement records (Paid, Approved, Pending)."}
              </li>
              <li>
                <strong className="text-ink">{language === "bn" ? "পূর্বাভাস (খ):" : "Forecast View:"}</strong>{" "}
                {language === "bn"
                  ? "ডিপ লার্নিং ও হাইড্রোডাইনামিক মডেলের সাহায্যে আগামী এক বছরের সম্ভাব্য দুর্যোগ ঝুঁকি প্রক্ষেপণ। পূর্বাভাসে কেবল প্রক্ষেপিত বাজেট প্রদর্শিত হয়, কোনো বিতরণকৃত ক্ষতিপূরণ দেখানো হয় না।"
                  : "Represents modeled projections predicting potential future hazard exposure and land vulnerability over a one-year horizon. Forecast views display only projected budget amounts and strictly exclude disbursed or paid compensation figures."}
              </li>
            </ul>
          </div>
        </section>

        {/* 8. Data Transparency */}
        <section className="bhumidorpon-card p-6 sm:p-8 bg-surface border-2 border-warn/30 bg-warn-soft/20 rounded-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warn-soft text-warn flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-ink">
                {language === "bn" ? "তথ্যের স্বচ্ছতা ও সীমাবদ্ধতা" : "Data Transparency"}
              </h2>
              <span className="text-xs text-muted">
                {language === "bn" ? "ডেমো ডাটা সম্পর্কিত স্পষ্টীকরণ" : "Demonstration Data Disclosures"}
              </span>
            </div>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-ink-2 leading-relaxed">
            <p>
              {language === "bn" ? (
                <>
                  <strong className="text-ink font-semibold">গুরুত্বপূর্ণ সীমাবদ্ধতা বিজ্ঞপ্তি:</strong> ভূমি-দর্পণ বর্তমানে একটি প্রযুক্তিগত সক্ষমতা ও ব্যবহারকারী অভিজ্ঞতার প্রদর্শনী (ডেমো)। এতে প্রদর্শিত ভৌগোলিক বহুভুজ, ক্যাডাস্ট্রাল দাগ নম্বর, বন্যার গভীরতা, নদীভাঙনের হার, মালিকের নাম এবং আর্থিক পরিমাপগুলো <strong className="text-ink">পরীক্ষামূলক ও সিন্থেটিক ডেমো ডাটাবেজ</strong> থেকে প্রস্তুতকৃত।
                </>
              ) : (
                <>
                  <strong className="text-ink font-semibold">Important Limitation Notice:</strong> BhumiDorpon currently operates as a technology and user-experience demonstration. All geographic polygons, cadastral plot numbers, flood depths, erosion rates, landowner profiles, and financial values are generated from <strong className="text-ink">mock and synthetic demo datasets</strong>.
                </>
              )}
            </p>
            <p>
              {language === "bn"
                ? "এই ডেমোটি কোনো লাইভ সরকারি ভূমি রেকর্ড সিস্টেম বা পরিবেশগত সেন্সরের সাথে সরাসরি সংযুক্ত নয়। এটি বাস্তবকালীন সেন্সর মনিটরিং, আইনি জরিপ বা সরকারি ক্ষতিপূরণের প্রাতিষ্ঠানিক বিকল্প নয়।"
                : "This demo does not connect to live government land registry systems or real-time environmental sensors. It does not provide live monitoring, real-time predictions, operational early warning alerts, field-verified engineering measurements, or legally certified land survey records."}
            </p>
          </div>
        </section>

        {/* Bottom Return Button */}
        <div className="pt-4 flex justify-center">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-accent text-accent-ink hover:bg-[#BBE825] font-semibold text-sm transition-all shadow-subtle group"
          >
            <ArrowLeft className="w-4 h-4 text-accent-ink group-hover:-translate-x-1 transition-transform" />
            <span>{language === "bn" ? "সেটিংসে ফিরে যান" : "Return to Settings"}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
