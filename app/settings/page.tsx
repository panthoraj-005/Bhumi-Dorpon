"use client";

import React from "react";
import Link from "next/link";
import { Info, Users, ArrowRight, Settings as SettingsIcon } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <AppHeader
        title="Settings"
        subtitle="System information and platform details"
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {/* Intro notice banner */}
        <div className="mb-8 p-4 rounded-card bg-surface border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-soft text-accent-deep flex items-center justify-center shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">
              Application Settings & Information
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Select an option below to view verified project details or development team metadata.
            </p>
          </div>
        </div>

        {/* Options Grid: Exactly 2 options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: About Project */}
          <Link
            href="/settings/about"
            className="bhumidorpon-card p-6 sm:p-7 flex flex-col justify-between hover:border-ink/30 hover:shadow-popover transition-all duration-200 group bg-surface border border-border rounded-card"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent-deep flex items-center justify-center transition-transform group-hover:scale-105">
                  <Info className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-surface-alt text-ink-2 border border-border">
                  Overview
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold text-ink group-hover:text-accent-deep transition-colors">
                About Project
              </h3>
              <p className="text-sm text-ink-2 mt-2 leading-relaxed">
                Learn about BhumiDorpon&apos;s purpose, five hazard monitoring modules, side-by-side map comparison features, and data transparency disclosures.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-medium text-ink group-hover:text-accent-deep">
              <span>View Project Details</span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent-deep group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Option 2: Team Information */}
          <Link
            href="/settings/team"
            className="bhumidorpon-card p-6 sm:p-7 flex flex-col justify-between hover:border-ink/30 hover:shadow-popover transition-all duration-200 group bg-surface border border-border rounded-card"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-alt text-ink flex items-center justify-center transition-transform group-hover:scale-105">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-surface-alt text-ink-2 border border-border">
                  Team
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold text-ink group-hover:text-accent-deep transition-colors">
                Team Information
              </h3>
              <p className="text-sm text-ink-2 mt-2 leading-relaxed">
                View official development team credits, leadership, contributors, and copyright information for the BhumiDorpon platform.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-medium text-ink group-hover:text-accent-deep">
              <span>View Team Info</span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent-deep group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
