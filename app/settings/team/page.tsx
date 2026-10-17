"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, UserCheck, Shield } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAppStore } from "@/stores/appStore";

export default function TeamInformationPage() {
  const { language } = useAppStore();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <AppHeader
        title={
          language === "bn"
            ? "টিম পরিচিতি (Team Information)"
            : "Team Information"
        }
        subtitle={
          language === "bn"
            ? "প্রকল্প ডেভেলপার দল ও কপিরাইট"
            : "Project development team and copyright"
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb / Return to Settings */}
        <div className="flex items-center justify-between">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-surface border border-border hover:border-ink/30 text-ink text-xs sm:text-sm font-medium transition-all shadow-subtle group"
          >
            <ArrowLeft className="w-4 h-4 text-muted group-hover:text-ink group-hover:-translate-x-0.5 transition-transform" />
            <span>
              {language === "bn"
                ? "সেটিংসে ফিরে যান (Back to Settings)"
                : "Back to Settings"}
            </span>
          </Link>
          <span className="text-xs text-muted font-medium">
            {language === "bn"
              ? "সেটিংস / টিম পরিচিতি (Settings / Team Information)"
              : "Settings / Team Information"}
          </span>
        </div>

        {/* Team Details Card */}
        <div className="bhumidorpon-card p-6 sm:p-10 bg-surface border border-border rounded-card">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent-deep flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-accent-deep tracking-wider uppercase">
                {language === "bn" ? "প্রকল্প টিম" : "Project Team"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink mt-0.5">
                GeoNeural
              </h2>
            </div>
          </div>

          {/* Team Members List */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-bg border border-border">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent-deep flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-muted font-medium block">
                    {language === "bn" ? "টিম লিডার" : "Team Leader"}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-ink">
                    {language === "bn" ? "পান্থ রাজ বিশ্বাস" : "Pantho Raj Biswas"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-pill bg-accent-soft text-accent-deep border border-accent/30">
                {language === "bn" ? "নেতৃত্ব" : "Lead"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-bg border border-border">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface-alt text-ink flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-muted font-medium block">
                    {language === "bn" ? "টিম সদস্য" : "Team Member"}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-ink">
                    {language === "bn" ? "পূজা পাল" : "Puja Paul"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-pill bg-surface-alt text-ink-2 border border-border">
                {language === "bn" ? "সদস্য" : "Member"}
              </span>
            </div>
          </div>

          {/* Exact Information Summary Box */}
          <div className="mt-8 p-5 rounded-xl bg-surface-alt border border-border space-y-2">
            <p className="text-xs sm:text-sm text-ink-2 font-medium">
              {language === "bn" ? "টিমের নাম: GeoNeural" : "Team Name: GeoNeural"}
            </p>
            <p className="text-xs sm:text-sm text-ink-2 font-medium">
              {language === "bn" ? "টিম লিডার: পান্থ রাজ বিশ্বাস (Pantho Raj Biswas)" : "Team Leader: Pantho Raj Biswas"}
            </p>
            <p className="text-xs sm:text-sm text-ink-2 font-medium">
              {language === "bn" ? "টিম সদস্য: পূজা পাল (Puja Paul)" : "Team Member: Puja Paul"}
            </p>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-6 border-t border-border flex items-center gap-3 text-xs sm:text-sm text-muted">
            <Shield className="w-4 h-4 text-muted shrink-0" />
            <p className="font-medium text-ink-2">
              {language === "bn" ? "© ২০২৬ GeoNeural। সর্বস্বত্ব সংরক্ষিত।" : "© 2026 GeoNeural. All rights reserved."}
            </p>
          </div>
        </div>

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
