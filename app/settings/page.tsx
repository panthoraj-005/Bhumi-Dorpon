"use client";

import React from "react";
import Link from "next/link";
import {
  Info,
  Users,
  ArrowRight,
  Settings as SettingsIcon,
  User,
  LogOut,
  Sparkles,
  UserCheck,
  Shield,
  Mail,
  Tag,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAppStore } from "@/stores/appStore";
import { clearSession } from "@/lib/auth";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { language, authSession, setAuthSession, setIsAuthModalOpen } =
    useAppStore();

  const handleSignOut = () => {
    clearSession();
    setAuthSession(null);
    setIsAuthModalOpen(true);
  };

  const getRoleDisplayName = (role: string, isDemo: boolean) => {
    if (isDemo) return language === "bn" ? "ডেমো পরিদর্শক" : "Demo Inspector";
    switch (role) {
      case "surveyor":
        return language === "bn"
          ? "সার্ভেয়ার / ফিল্ড অফিসার"
          : "Surveyor / Field Land Officer";
      case "researcher":
        return language === "bn" ? "গবেষক / নীতি বিশ্লেষক" : "Researcher / Analyst";
      case "citizen":
      default:
        return language === "bn" ? "নাগরিক / জমির মালিক" : "Citizen / Landowner";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg">
      {/* Page Header */}
      <AppHeader
        title={language === "bn" ? "সেটিংস" : "Settings"}
        subtitle={
          language === "bn"
            ? "প্ল্যাটফর্ম সেটিংস, ব্যবহারকারীর প্রোফাইল ও সিস্টেম পরিচিতি"
            : "Platform settings, user profile, and system information"
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Intro notice banner */}
        <div className="p-4 rounded-card bg-surface border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-soft text-accent-deep flex items-center justify-center shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">
              {language === "bn"
                ? "অ্যাপ্লিকেশন সেটিংস ও পরিচিতি"
                : "Application Settings & Information"}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {language === "bn"
                ? "আপনার বর্তমান অ্যাকাউন্ট পরিচালনা করুন অথবা প্রকল্পের যাচাইকৃত বিবরণ ও টিম মেটাডেটা দেখুন।"
                : "Manage your current account or inspect verified project details and development team metadata."}
            </p>
          </div>
        </div>

        {/* ACCOUNT & PROFILE SECTION */}
        <section
          aria-labelledby="account-section-heading"
          className="bhumidorpon-card p-6 sm:p-7 bg-surface border border-border rounded-card space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent-deep flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3
                  id="account-section-heading"
                  className="text-lg sm:text-xl font-display font-bold text-ink"
                >
                  {language === "bn" ? "অ্যাকাউন্ট ও প্রোফাইল" : "Account & Profile"}
                </h3>
                <p className="text-xs text-muted">
                  {language === "bn"
                    ? "বর্তমান লগইনকৃত অ্যাকাউন্টের বিবরণ ও সেশন নিয়ন্ত্রণ"
                    : "Current authenticated account details and session control"}
                </p>
              </div>
            </div>

            {authSession && (
              <span
                className={cn(
                  "px-3 py-1 rounded-pill text-xs font-semibold self-start sm:self-auto inline-flex items-center gap-1.5",
                  authSession.user.isDemo
                    ? "bg-accent/20 border border-accent/40 text-accent-ink"
                    : "bg-gain-soft text-gain border border-gain/20"
                )}
              >
                {authSession.user.isDemo ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-accent-deep" />
                    <span>{t("demoUserBadge", language)}</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t("authenticatedUserBadge", language)}</span>
                  </>
                )}
              </span>
            )}
          </div>

          {authSession ? (
            <div className="space-y-6">
              {/* User details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {/* Full name */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border space-y-1">
                  <span className="text-[11px] text-muted block flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{t("fullName", language)}</span>
                  </span>
                  <span className="font-bold text-sm text-ink block truncate">
                    {authSession.user.fullName || authSession.user.username}
                  </span>
                </div>

                {/* Username */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border space-y-1">
                  <span className="text-[11px] text-muted block flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{t("username", language)}</span>
                  </span>
                  <span className="font-mono font-semibold text-xs text-ink block truncate">
                    @{authSession.user.username}
                  </span>
                </div>

                {/* Email */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border space-y-1">
                  <span className="text-[11px] text-muted block flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{t("emailOrUsername", language)}</span>
                  </span>
                  <span className="font-medium text-xs text-ink block truncate">
                    {authSession.user.email}
                  </span>
                </div>

                {/* Role */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border space-y-1">
                  <span className="text-[11px] text-muted block flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{t("userRole", language)}</span>
                  </span>
                  <span className="font-semibold text-xs text-accent-deep block truncate">
                    {getRoleDisplayName(
                      authSession.user.role,
                      authSession.user.isDemo
                    )}
                  </span>
                </div>
              </div>

              {/* Logout button at bottom of section */}
              <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-muted">
                  {language === "bn"
                    ? "সেশন সমাপ্ত করতে নিচের বোতামে চাপ দিন। আপনি পুনরায় যেকোনো সময় লগইন করতে পারবেন।"
                    : "End your active session by clicking below. You can log back in at any time."}
                </p>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl bg-loss-soft hover:bg-loss text-loss hover:text-white border border-loss/20 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-subtle shrink-0"
                  aria-label={t("logout", language)}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("logout", language)}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-out state */
            <div className="p-6 rounded-xl bg-surface-alt border border-border text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface border border-border mx-auto flex items-center justify-center text-muted">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-ink">
                  {t("noActiveSession", language)}
                </h4>
                <p className="text-xs text-muted max-w-md mx-auto">
                  {t("loginToContinue", language)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-lime px-4 py-2 text-xs font-bold inline-flex items-center gap-2 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t("login", language)}</span>
              </button>
            </div>
          )}
        </section>

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
                  {language === "bn" ? "সারসংক্ষেপ" : "Overview"}
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold text-ink group-hover:text-accent-deep transition-colors">
                {language === "bn" ? "প্রকল্প পরিচিতি" : "About Project"}
              </h3>
              <p className="text-sm text-ink-2 mt-2 leading-relaxed">
                {language === "bn"
                  ? "ভূমিদর্পণের উদ্দেশ্য, ৫টি দুর্যোগ পর্যবেক্ষণ মডিউল, পাশাপাশি মানচিত্র তুলনা ও ডেটা স্বচ্ছতার বিবরণ জানুন।"
                  : "Learn about BhumiDorpon's purpose, five hazard monitoring modules, side-by-side map comparison features, and data transparency disclosures."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-medium text-ink group-hover:text-accent-deep">
              <span>
                {language === "bn"
                  ? "প্রকল্প বিবরণ দেখুন"
                  : "View Project Details"}
              </span>
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
                  {language === "bn" ? "টিম" : "Team"}
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold text-ink group-hover:text-accent-deep transition-colors">
                {language === "bn" ? "টিম পরিচিতি" : "Team Information"}
              </h3>
              <p className="text-sm text-ink-2 mt-2 leading-relaxed">
                {language === "bn"
                  ? "ভূমিদর্পণ প্ল্যাটফর্মের উন্নয়ন টিম, নেতৃত্ব, সদস্যবৃন্দ এবং কপিরাইট সম্পর্কিত আনুষ্ঠানিক তথ্য দেখুন।"
                  : "View official development team credits, leadership, contributors, and copyright information for the BhumiDorpon platform."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-medium text-ink group-hover:text-accent-deep">
              <span>
                {language === "bn" ? "টিম তথ্য দেখুন" : "View Team Info"}
              </span>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent-deep group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
