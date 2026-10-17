"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  MapPin,
  User,
  FileText,
  Landmark,
  Scale,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Waves,
  CloudRain,
  Mountain,
  Compass,
  Anchor,
  Info,
  CheckCircle,
  HelpCircle,
  Building2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAppStore } from "@/stores/appStore";
import {
  t,
  Language,
  formatNumberLocalized,
  getLocalizedDistrictName,
  getLocalizedUpazilaName,
  getLocalizedMouzaName,
  getLocalizedOwnerName,
  getLocalizedFatherName,
  getLocalizedLandClass,
  getLocalizedRiskLevel,
  getLocalizedCornerLabel,
  getLocalizedBankName,
  getLocalizedLoanStatus,
} from "@/lib/translations";
import { formatArea, formatCurrencyBDT } from "@/lib/units";
import {
  searchLandInformation,
  LandInformationReport,
  DataStatusBadge,
  LandLoanMortgageInfo,
} from "@/lib/landSearch";
import { getDistricts, getUpazilas, getMouzas } from "@/lib/data";
import { District, Upazila, Mouza } from "@/lib/types";

export default function LandInformationPage() {
  const { unit, language } = useAppStore();

  // Search filter states
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [mouzas, setMouzas] = useState<Mouza[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>("sirajganj");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("kazipur");
  const [selectedMouza, setSelectedMouza] = useState<string>("mouza_kazipur_1");
  const [dagNo, setDagNo] = useState<string>("101");
  const [khatianNo, setKhatianNo] = useState<string>("RS-475");

  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(true);
  const [report, setReport] = useState<LandInformationReport | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 1. Initial Reference Data Loading
  useEffect(() => {
    let active = true;
    getDistricts().then((dists) => {
      if (active) setDistricts(dists);
    });
    return () => {
      active = false;
    };
  }, []);

  // 2. Cascade Upazilas on District change
  useEffect(() => {
    let active = true;
    if (selectedDistrict) {
      getUpazilas(selectedDistrict).then((ups) => {
        if (active) {
          setUpazilas(ups);
          // If current upazila is not in the new district, reset it
          if (!ups.some((u) => u.id === selectedUpazila)) {
            setSelectedUpazila(ups[0]?.id || "");
          }
        }
      });
    } else {
      setUpazilas([]);
      setSelectedUpazila("");
    }
    return () => {
      active = false;
    };
  }, [selectedDistrict]);

  // 3. Cascade Mouzas on Upazila change
  useEffect(() => {
    let active = true;
    if (selectedUpazila) {
      getMouzas(selectedUpazila).then((mzs) => {
        if (active) {
          setMouzas(mzs);
          if (!mzs.some((m) => m.id === selectedMouza)) {
            setSelectedMouza(mzs[0]?.id || "");
          }
        }
      });
    } else {
      setMouzas([]);
      setSelectedMouza("");
    }
    return () => {
      active = false;
    };
  }, [selectedUpazila]);

  // Execute initial search on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    if (!selectedDistrict || !selectedUpazila) {
      setValidationError(t("searchValidationRequired", language));
      return;
    }

    setLoading(true);
    setSearched(true);

    const result = await searchLandInformation({
      districtId: selectedDistrict,
      upazilaId: selectedUpazila,
      mouzaId: selectedMouza || undefined,
      dagNo: dagNo || undefined,
      khatianNo: khatianNo || undefined,
    });

    setReport(result);
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedDistrict("sirajganj");
    setSelectedUpazila("kazipur");
    setSelectedMouza("");
    setDagNo("");
    setKhatianNo("");
    setValidationError(null);
    setReport(null);
    setSearched(false);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: DataStatusBadge) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-gain-soft text-gain text-[11px] font-bold">
            <CheckCircle className="w-3 h-3" />
            <span>{t("badgeVerified", language)}</span>
          </span>
        );
      case "demo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-accent-soft text-accent-deep text-[11px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>{t("badgeDemo", language)}</span>
          </span>
        );
      case "unverified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-warn-soft text-warn text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>{t("badgeUnverified", language)}</span>
          </span>
        );
      case "external_required":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-surface-alt border border-border text-secondary text-[11px] font-medium">
            <ExternalLink className="w-3 h-3 text-muted" />
            <span>{t("badgeExternalRequired", language)}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-surface-alt text-muted text-[11px] font-medium">
            <HelpCircle className="w-3 h-3" />
            <span>{t("badgeUnavailable", language)}</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* Top Header */}
      <AppHeader
        title={t("landInfoSearchTitle", language)}
        subtitle={t("landInfoSearchSubtitle", language)}
      />

      <div className="px-4 sm:px-8 py-6 space-y-8 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb Strip */}
        <div className="flex items-center gap-1.5 text-xs text-muted pb-1 border-b border-border">
          <Link href="/" className="hover:text-ink transition-colors">
            {t("navHome", language)}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-semibold">
            {t("navLandInfo", language)}
          </span>
        </div>

        {/* 1. SEARCH FORM CARD */}
        <div className="bhumidorpon-card p-6 sm:p-7 space-y-5 bg-gradient-to-br from-surface to-surface-alt/40 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent text-accent-ink flex items-center justify-center font-bold shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-ink">
                  {language === "bn" ? "ক্যাডাস্ট্রাল প্লট ও খতিয়ান অনুসন্ধান" : "Cadastral Plot & Khatian Search"}
                </h2>
                <p className="text-xs text-muted">
                  {language === "bn"
                    ? "অনুগ্রহ করে জেলা ও উপজেলা নির্বাচন করুন। দাগ বা খতিয়ান নম্বর দিলে নির্দিষ্ট পার্সেল প্রদর্শিত হবে।"
                    : "Select District & Upazila. Provide Dag or Khatian numbers to retrieve parcel records."}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-pill bg-surface border border-border text-[11px] font-medium text-secondary">
              {language === "bn" ? "৫ স্তরের ক্যাডাস্ট্রাল ফিল্টার" : "5-Tier Cadastral Filter"}
            </span>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Field 1: District */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  ১. {t("districtLabel", language)} *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle"
                >
                  <option value="">{t("selectDistrictPlaceholder", language)}</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {getLocalizedDistrictName(d.id, d.name, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Upazila */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  ২. {t("upazilaLabel", language)} *
                </label>
                <select
                  value={selectedUpazila}
                  onChange={(e) => setSelectedUpazila(e.target.value)}
                  disabled={!selectedDistrict || upazilas.length === 0}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-ink disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle"
                >
                  <option value="">{t("selectUpazilaPlaceholder", language)}</option>
                  {upazilas.map((u) => (
                    <option key={u.id} value={u.id}>
                      {getLocalizedUpazilaName(u.id, u.name, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Mouza */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  ৩. {t("mouzaLabel", language)}
                </label>
                <select
                  value={selectedMouza}
                  onChange={(e) => setSelectedMouza(e.target.value)}
                  disabled={!selectedUpazila || mouzas.length === 0}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-ink disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle"
                >
                  <option value="">{t("selectMouzaPlaceholder", language)}</option>
                  {mouzas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {getLocalizedMouzaName(m.id, m.name, language)} ({formatNumberLocalized(m.jlNo, language)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 4: Dag Number (Text, preserves leading zeros!) */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  ৪. {t("dagNoLabel", language)}
                </label>
                <input
                  type="text"
                  value={dagNo}
                  onChange={(e) => setDagNo(e.target.value)}
                  placeholder={t("enterDagPlaceholder", language)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle"
                />
              </div>

              {/* Field 5: Khatian Number */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  ৫. {t("khatianNoLabel", language)}
                </label>
                <input
                  type="text"
                  value={khatianNo}
                  onChange={(e) => setKhatianNo(e.target.value)}
                  placeholder={t("enterKhatianPlaceholder", language)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle"
                />
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-loss-soft border border-loss/20 text-loss text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-muted">
                {language === "bn"
                  ? "দাগ বা খতিয়ানে শূন্য বা বিশেষ ক্যারেক্টার (যেমন ০১০১ বা RS-475) অপরিবর্তিত থাকে।"
                  : "Input preserves leading zeros and alphanumeric prefixes (e.g. 0101 or RS-475)."}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-10 px-4 rounded-xl bg-surface hover:bg-surface-alt border border-border text-xs font-semibold text-ink inline-flex items-center gap-1.5 transition-all shadow-subtle"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-muted" />
                  <span>{t("resetBtn", language)}</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-lime h-10 px-6 text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? (language === "bn" ? "তথ্য আনা হচ্ছে..." : "Searching...") : t("searchBtn", language)}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 2. LOADING STATE */}
        {loading && (
          <div className="bhumidorpon-card p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-ink">
              {language === "bn" ? "ক্যাডাস্ট্রাল তথ্যাদি আনা হচ্ছে..." : "Retrieving cadastral land records..."}
            </h3>
            <p className="text-xs text-muted">
              {language === "bn"
                ? "মৌজা ম্যাপ, মালিকানা খতিয়ান ও ঐতিহাসিক উপগ্রহ পর্যবেক্ষণ আনা হচ্ছে"
                : "Cross-referencing mouza GIS geometry, deed registries, and historical satellite logs"}
            </p>
          </div>
        )}

        {/* 3. NO RESULTS FOUND STATE */}
        {!loading && searched && !report && (
          <div className="bhumidorpon-card p-10 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-surface-alt border border-border mx-auto flex items-center justify-center text-muted">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink">
                {t("noRecordFoundTitle", language)}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {t("noRecordFoundDesc", language)}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn-lime px-5 py-2.5 text-xs font-bold shadow-sm"
              >
                {language === "bn" ? "পুনরায় অনুসন্ধান করুন" : "Search Again"}
              </button>
            </div>
          </div>
        )}

        {/* 4. RESULTS REPORT: 6 SECTIONS + HAZARD RISK ANALYSIS */}
        {!loading && report && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Report Header Strip */}
            <div className="bhumidorpon-card p-5 sm:p-6 bg-gradient-to-r from-surface via-surface to-accent/10 border-accent/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-muted">
                    {getLocalizedDistrictName(report.identification.districtId, report.identification.districtName, language)} • {getLocalizedUpazilaName(report.identification.upazilaId, report.identification.upazilaName, language)} • {getLocalizedMouzaName(report.identification.mouzaId, report.identification.mouzaName, language)}
                  </span>
                  <span className="px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-[10px] font-bold">
                    {formatNumberLocalized(report.identification.jlNo, language)}
                  </span>
                  {renderStatusBadge("demo")}
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-bold text-ink flex flex-wrap items-center gap-3">
                  <span>
                    {language === "bn" ? "দাগ নম্বর:" : "Dag No:"}{" "}
                    <span className="text-accent-deep underline decoration-accent underline-offset-4">
                      {formatNumberLocalized(report.identification.dagNo, language)}
                    </span>
                  </span>
                  <span className="text-border">•</span>
                  <span>
                    {language === "bn" ? "খতিয়ান নম্বর:" : "Khatian No:"}{" "}
                    <span className="text-ink">
                      {formatNumberLocalized(report.identification.khatianNo, language)}
                    </span>
                  </span>
                </h2>

                <div className="text-xs text-muted flex items-center gap-3">
                  <span>
                    {language === "bn" ? "রেকর্ডকৃত আয়তন:" : "Recorded Area:"}{" "}
                    <strong className="text-ink font-bold">
                      {formatArea(report.identification.areaDecimal, unit, language)}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    {language === "bn" ? "মালিক:" : "Owner:"}{" "}
                    <strong className="text-ink font-semibold">
                      {getLocalizedOwnerName(report.ownership.ownerName, language)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Physical Status Pill */}
              <div className="border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6 space-y-1">
                <div className="text-[11px] text-muted">{t("physicalStatus", language)}</div>
                <div>
                  {report.identification.physicalStatus === "historically_lost" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-loss-soft text-loss text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t("statusHistoricallyLost", language)}</span>
                    </span>
                  ) : report.identification.physicalStatus === "partially_affected" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-warn-soft text-warn text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t("statusPartiallyAffected", language)}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-gain-soft text-gain text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t("statusExisting", language)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SECTIONS A, B, C, D, E, F GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* SECTION A: LAND IDENTIFICATION */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secLandId", language)}
                      </h3>
                    </div>
                    {renderStatusBadge("verified")}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("districtLabel", language)}</span>
                      <span className="font-semibold text-ink">{getLocalizedDistrictName(report.identification.districtId, report.identification.districtName, language)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("upazilaLabel", language)}</span>
                      <span className="font-semibold text-ink">{getLocalizedUpazilaName(report.identification.upazilaId, report.identification.upazilaName, language)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("mouzaLabel", language)}</span>
                      <span className="font-semibold text-ink">{getLocalizedMouzaName(report.identification.mouzaId, report.identification.mouzaName, language)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("dagNoLabel", language)}</span>
                      <span className="font-mono font-bold text-ink">
                        {formatNumberLocalized(report.identification.dagNo, language)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("khatianNoLabel", language)}</span>
                      <span className="font-mono font-bold text-ink">
                        {formatNumberLocalized(report.identification.khatianNo, language)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("plotArea", language)}</span>
                      <span className="font-bold text-ink tabular-nums">
                        {formatArea(report.identification.areaDecimal, unit, language)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted">{t("landClass", language)}</span>
                      <span className="font-medium text-ink">{getLocalizedLandClass(report.identification.landClass, language)}</span>
                    </div>
                  </div>
                </div>

                {/* 4 Corners Coordinates Preview */}
                <div className="p-3 rounded-xl bg-surface-alt border border-border space-y-1.5">
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                    {language === "bn" ? "৪ কোণ স্থানাঙ্ক" : "4 Corners Coordinates"}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-muted">
                    <div>{getLocalizedCornerLabel("NW", language)}: {formatNumberLocalized(report.identification.corners[0].lat, language)}, {formatNumberLocalized(report.identification.corners[0].lon, language)}</div>
                    <div>{getLocalizedCornerLabel("NE", language)}: {formatNumberLocalized(report.identification.corners[1].lat, language)}, {formatNumberLocalized(report.identification.corners[1].lon, language)}</div>
                    <div>{getLocalizedCornerLabel("SE", language)}: {formatNumberLocalized(report.identification.corners[2].lat, language)}, {formatNumberLocalized(report.identification.corners[2].lon, language)}</div>
                    <div>{getLocalizedCornerLabel("SW", language)}: {formatNumberLocalized(report.identification.corners[3].lat, language)}, {formatNumberLocalized(report.identification.corners[3].lon, language)}</div>
                  </div>
                </div>
              </div>

              {/* SECTION B: OWNERSHIP INFORMATION */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secOwnership", language)}
                      </h3>
                    </div>
                    {renderStatusBadge(report.ownership.verificationStatus)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("ownerName", language)}</span>
                      <span className="font-semibold text-ink">{getLocalizedOwnerName(report.ownership.ownerName, language)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("fatherName", language)}</span>
                      <span className="font-medium text-ink">{getLocalizedFatherName(report.ownership.fatherName, language)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("ownershipShare", language)}</span>
                      <span className="font-bold text-gain">
                        {language === "bn" ? "১০০% (একক স্বত্বাধীকারী)" : "100% (Sole Proprietor)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "এনআইডি নম্বর (সুরক্ষিত)" : "NID Number (Masked)"}
                      </span>
                      <span className="font-mono text-ink">{report.ownership.nidMasked}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted">
                        {language === "bn" ? "রেকর্ডের তারিখ" : "Record Date"}
                      </span>
                      <span className="text-ink">{report.ownership.recordedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-alt border border-border text-[11px] text-muted space-y-0.5">
                  <div className="font-semibold text-secondary">
                    {language === "bn" ? "উৎস সূত্র:" : "Data Source:"}
                  </div>
                  <div className="leading-snug">{report.ownership.dataSource}</div>
                </div>
              </div>

              {/* SECTION C: SALE & TRANSACTION */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secSale", language)}
                      </h3>
                    </div>
                    {renderStatusBadge(report.sale.statusBadge)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="py-1 border-b border-border/50 space-y-1">
                      <span className="text-muted block">{t("saleListingStatus", language)}</span>
                      <span className="font-semibold text-ink block">
                        {report.sale.listingStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "বিক্রির আবেদন" : "Sale Application"}
                      </span>
                      <span className="text-secondary font-medium">
                        {language === "bn" ? "না (তালিকাভুক্ত নয়)" : "No (Not Listed)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted">
                        {language === "bn" ? "বায়নামা রেকর্ড" : "Earnest Money (Bayanama)"}
                      </span>
                      <span className="text-secondary font-medium">
                        {language === "bn" ? "পাওয়া যায়নি" : "Not Found"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-alt border border-border text-[11px] text-muted space-y-0.5">
                  <div className="font-semibold text-secondary">
                    {language === "bn" ? "উৎস সূত্র:" : "Data Source:"}
                  </div>
                  <div className="leading-snug">{report.sale.dataSource}</div>
                </div>
              </div>

              {/* SECTION D: LEGAL INFORMATION & DISPUTES */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secLegal", language)}
                      </h3>
                    </div>
                    {renderStatusBadge(report.legal.verificationStatus)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="py-1 border-b border-border/50 space-y-1">
                      <span className="text-muted block">{t("courtCaseStatus", language)}</span>
                      <span className="font-semibold text-ink block">
                        {report.legal.caseStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "১৪৪/১৪৫ ধারা জারি" : "Section 144/145 Issued"}
                      </span>
                      <span className="text-secondary font-medium">
                        {language === "bn" ? "নেই" : "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted">
                        {language === "bn" ? "অর্পিত/খাস সম্পত্তি বিরোধ" : "Vested/Khas Property Dispute"}
                      </span>
                      <span className="text-secondary font-medium">
                        {language === "bn" ? "নাই (ব্যক্তিগত জোত)" : "None (Private Holding)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-alt border border-border text-[11px] text-muted space-y-0.5">
                  <div className="font-semibold text-secondary">
                    {language === "bn" ? "উৎস সূত্র:" : "Data Source:"}
                  </div>
                  <div className="leading-snug">{report.legal.dataSource}</div>
                </div>
              </div>

              {/* SECTION E: LAND DEVELOPMENT TAX */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secTax", language)}
                      </h3>
                    </div>
                    {renderStatusBadge(report.tax.statusBadge)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("taxStatus", language)}</span>
                      <span className="font-bold text-gain">{t("taxClear", language)}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "কর নির্ধারণ বছর" : "Assessment Year"}
                      </span>
                      <span className="font-medium text-ink">{report.tax.assessmentYear}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "বকেয়া করের পরিমাণ" : "Outstanding Tax"}
                      </span>
                      <span className="font-mono font-bold text-ink">{language === "bn" ? "৳ ০.০০" : "৳ 0.00"}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted">
                        {language === "bn" ? "সর্বশেষ দাখিলা রসিদ" : "Latest Receipt No."}
                      </span>
                      <span className="font-mono text-ink">{report.tax.receiptNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-alt border border-border text-[11px] text-muted space-y-0.5">
                  <div className="font-semibold text-secondary">
                    {language === "bn" ? "উৎস সূত্র:" : "Data Source:"}
                  </div>
                  <div className="leading-snug">{report.tax.dataSource}</div>
                </div>
              </div>

              {/* SECTION F: REGISTRATION HISTORY & USE */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secHistory", language)}
                      </h3>
                    </div>
                    {renderStatusBadge(report.history.statusBadge)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "মূল দলিল নম্বর" : "Original Deed No."}
                      </span>
                      <span className="font-mono font-bold text-ink">{report.history.registrationDeedNo}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "নামজারি জমাভাগ খতিয়ান" : "Mutation Khatian No."}
                      </span>
                      <span className="font-mono font-semibold text-ink">{report.history.mutationKhatianNo}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">
                        {language === "bn" ? "নিবন্ধন অফিস" : "Registry Office"}
                      </span>
                      <span className="font-medium text-ink">{report.history.registrationOffice}</span>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <span className="text-muted block">
                        {language === "bn" ? "বর্তমান ভূমির ব্যবহার" : "Current Land Use"}
                      </span>
                      <span className="text-ink font-medium block">{report.history.lastLandUse}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-alt border border-border text-[11px] text-muted space-y-0.5">
                  <div className="font-semibold text-secondary">
                    {language === "bn" ? "মাটির বৈশিষ্ট্য:" : "Soil Condition:"}
                  </div>
                  <div className="leading-snug">{report.history.soilCondition}</div>
                </div>
              </div>

              {/* SECTION G: LAND MORTGAGE & BANK LOAN INFORMATION (SECTION 7) */}
              <div className="bhumidorpon-card p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-accent-deep" />
                      <h3 className="text-sm font-bold text-ink">
                        {t("secMortgage", language)}
                      </h3>
                    </div>
                    {renderStatusBadge(
                      report.loanMortgageInfo?.statusBadge || "external_required"
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* 1. Mortgage or Loan Status */}
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("mortgageStatusLabel", language)}</span>
                      <span
                        className={`font-semibold ${
                          report.loanMortgageInfo?.hasMortgageOrLoanCharge === true
                            ? "text-warn"
                            : report.loanMortgageInfo?.loanStatus === "released"
                            ? "text-gain"
                            : "text-secondary"
                        }`}
                      >
                        {getLocalizedLoanStatus(
                          report.loanMortgageInfo?.loanStatus,
                          report.loanMortgageInfo?.hasMortgageOrLoanCharge,
                          language
                        )}
                      </span>
                    </div>

                    {/* 2. Bank or Financial Institution */}
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("bankNameLabel", language)}</span>
                      <span className="font-semibold text-ink text-right">
                        {report.loanMortgageInfo?.bankName
                          ? getLocalizedBankName(report.loanMortgageInfo.bankName, language)
                          : t("bankNameNotAvailable", language)}
                      </span>
                    </div>

                    {/* 3. Masked Loan / Mortgage Reference */}
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("loanRefLabel", language)}</span>
                      <span className="font-mono text-ink">
                        {report.loanMortgageInfo?.loanReferenceMasked || t("loanRefNotAvailable", language)}
                      </span>
                    </div>

                    {/* 4. Mortgage Deed No. */}
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("mortgageDeedLabel", language)}</span>
                      <span className="font-mono text-ink">
                        {report.loanMortgageInfo?.mortgageDeedNo || (language === "bn" ? "প্রযোজ্য নয়" : "N/A")}
                      </span>
                    </div>

                    {/* 5. Record / Update Date */}
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <span className="text-muted">{t("mortgageRecordDateLabel", language)}</span>
                      <span className="text-ink">
                        {report.loanMortgageInfo?.recordDate || t("bankNameNotAvailable", language)}
                      </span>
                    </div>

                    {/* 6. Release & Clearance Info */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted">{t("releaseInfoLabel", language)}</span>
                      <span className="text-secondary font-medium">
                        {report.loanMortgageInfo?.releaseDate
                          ? `${language === "bn" ? "অবমুক্ত: " : "Released: "}${report.loanMortgageInfo.releaseDate}`
                          : report.loanMortgageInfo?.loanStatus === "active"
                          ? t("releaseInfoActive", language)
                          : report.loanMortgageInfo?.loanStatus === "released"
                          ? t("releaseInfoReleased", language)
                          : t("releaseInfoUnavailable", language)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data Source & Integrity Notes */}
                <div className="p-3 rounded-xl bg-surface-alt border border-border text-[11px] text-muted space-y-1">
                  <div className="font-semibold text-secondary">
                    {language === "bn" ? "উৎস সূত্র:" : "Data Source:"}
                  </div>
                  <div className="leading-snug">
                    {report.loanMortgageInfo?.dataSource ||
                      (language === "bn"
                        ? "জাতীয় বন্ধক নিবন্ধন ও সিআইবি নেটওয়ার্ক (অসংযুক্ত)"
                        : "National Mortgage Registry & CIB Network (Disconnected)")}
                  </div>
                  {(report.loanMortgageInfo?.notesBn || report.loanMortgageInfo?.notesEn) && (
                    <div className="pt-1 border-t border-border/60 text-[10px] text-secondary">
                      {language === "bn"
                        ? report.loanMortgageInfo.notesBn
                        : report.loanMortgageInfo.notesEn}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 5: DISASTER CHANGE & DEEP-LEARNING RISK ANALYSIS */}
            <div className="space-y-6 pt-4">
              <div className="bhumidorpon-card p-6 sm:p-7 border-predicted/30 space-y-6 bg-gradient-to-br from-surface via-surface to-predicted-soft/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-predicted" />
                      <h3 className="text-lg sm:text-xl font-display font-bold text-ink">
                        {t("secDisasterAnalysis", language)}
                      </h3>
                    </div>
                    <p className="text-xs text-muted">
                      {language === "bn"
                        ? "নদীভাঙন, প্লাবন, ভূমিধস ও উপকূলীয় পরিবর্তনের ঐতিহাসিক বিশ্লেষণ ও ডিপ-লার্নিং ঝুঁকি প্রক্ষেপণ"
                        : "Historical geospatial change quantification and deep-learning loss probability forecasting"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-pill bg-predicted-soft border border-predicted/40 text-predicted font-bold text-xs">
                      GeoAI-BD v2.4
                    </span>
                  </div>
                </div>

                {/* 5.1 HISTORICAL LAND LOSS & ENVIRONMENTAL CHANGE */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                      <Layers className="w-4 h-4 text-loss" />
                      <span>{t("historicalLandLossTitle", language)}</span>
                    </h4>
                    <span className="text-xs text-muted">
                      {language === "bn" ? "রিমোট-সেন্সিং সত্যতা" : "Remote Sensing Ground Truth"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {report.disasterHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-surface-alt border border-border space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-ink">
                              {language === "bn" ? item.disasterNameBn : item.disasterNameEn}
                            </span>
                            <div className="text-[11px] text-muted flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              <span>{item.eventDate}</span>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-pill text-[10px] font-bold ${
                              item.physicalImpact === "permanent_loss"
                                ? "bg-loss-soft text-loss"
                                : "bg-water/20 text-water"
                            }`}
                          >
                            {item.physicalImpact === "permanent_loss"
                              ? (language === "bn" ? "স্থায়ী নদীগর্ভে বিলীন" : "Permanently Submerged")
                              : (language === "bn" ? "অস্থায়ী প্লাবন" : "Temporary Flood")}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs">
                          <div>
                            <span className="text-[10px] text-muted block">
                              {language === "bn" ? "ক্ষতিগ্রস্ত আয়তন" : "Affected Area"}
                            </span>
                            <span className="font-bold text-loss tabular-nums">
                              {formatArea(item.affectedAreaDecimal, unit, language)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted block">
                              {language === "bn" ? "পরিমাপিত ক্ষতি" : "Estimated Loss"}
                            </span>
                            <span className="font-bold text-ink tabular-nums">
                              {formatArea(item.estimatedLandLossDecimal, unit, language)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted block">
                              {language === "bn" ? "পলি সঞ্চয়ন" : "Accretion"}
                            </span>
                            <span className="font-bold text-gain tabular-nums">
                              {formatArea(item.sedimentAccretionDecimal, unit, language)}
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-muted flex items-center gap-1 pt-1">
                          <Info className="w-3 h-3 shrink-0" />
                          <span>
                            {language === "bn" ? "উৎস:" : "Source:"} {item.dataSource} ({language === "bn" ? "পর্যবেক্ষণ:" : "Obs:"} {item.observationDate})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5.2 FUTURE DEEP-LEARNING RISK PREDICTIONS */}
                <div className="space-y-4 pt-3 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-predicted" />
                      <span>{t("futureRiskTitle", language)}</span>
                    </h4>
                    <span className="text-[11px] text-secondary">
                      {language === "bn" ? "পূর্বাভাস দিগন্ত: ২০২৫ – ২০২৭ মৌসুম" : "Forecast Horizon: 2025 – 2027 Season"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {report.futurePredictions.map((pred, pIdx) => {
                      const isHigh = pred.probabilityPercent >= 60;
                      const isMod = pred.probabilityPercent >= 30 && pred.probabilityPercent < 60;

                      return (
                        <div
                          key={pIdx}
                          className="p-4 rounded-xl bg-surface border border-border space-y-3 flex flex-col justify-between hover:border-predicted/50 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-ink">
                                {language === "bn" ? pred.hazardNameBn : pred.hazardNameEn}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isHigh
                                    ? "bg-loss-soft text-loss"
                                    : isMod
                                    ? "bg-warn-soft text-warn"
                                    : "bg-surface-alt text-muted"
                                }`}
                              >
                                {getLocalizedRiskLevel(pred.riskCategory, language)}
                              </span>
                            </div>

                            <div>
                              <div className="text-2xl font-display font-bold tabular-nums text-ink">
                                {formatNumberLocalized(pred.probabilityPercent, language)}%
                              </div>
                              <div className="w-full h-2 rounded-full bg-surface-alt overflow-hidden mt-1.5">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    isHigh ? "bg-loss" : isMod ? "bg-warn" : "bg-gain"
                                  }`}
                                  style={{ width: `${pred.probabilityPercent}%` }}
                                />
                              </div>
                            </div>

                            <p className="text-[11px] text-secondary leading-relaxed pt-1">
                              {language === "bn" ? pred.explanationBn : pred.explanationEn}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/60 text-[10px] text-muted space-y-0.5">
                            <div>{language === "bn" ? "মডেল:" : "Model:"} {pred.modelName}</div>
                            <div>{language === "bn" ? "নির্ভরযোগ্যতা স্কোর:" : "Confidence Score:"} {formatNumberLocalized(pred.confidencePercent, language)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Honesty & Disclaimer Banner */}
                  <div className="p-3.5 rounded-xl bg-predicted-soft/80 border border-predicted/30 text-xs text-secondary flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-predicted shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <strong className="text-ink font-semibold block">
                        {language === "bn"
                          ? "মডেল পূর্বাভাসের সীমাবদ্ধতা ও সত্যতা নোটিশ (Integrity Note):"
                          : "Model Forecast Integrity & Limitation Notice:"}
                      </strong>
                      <p className="text-[11px] leading-relaxed">
                        {language === "bn"
                          ? "প্রদর্শিত ঝুঁকি স্কোরগুলো GeoAI-BD কনভল্যুশনাল এলএসটিএম উপগ্রহ মডেল প্রক্ষেপণ। এগুলো কোনো সরকারি আইনি স্বত্ব নির্ধারণ বা বাধ্যতামূলক উচ্ছেদ নির্দেশ নয়। প্রকৃত ভূমির ব্যবহার পরিবর্তনের জন্য উপজেলা সহকারী কমিশনার (ভূমি) এর সরেজমিন জরিপ চূড়ান্ত।"
                          : "Risk scores are generated by GeoAI-BD satellite ConvLSTM models. These do not constitute official land registration deeds or eviction orders. Field surveys by the Assistant Commissioner (Land) remain authoritative."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5.3 COMPLETELY LOST OR DISAPPEARED LAND SECTION */}
                {report.identification.physicalStatus === "historically_lost" && (
                  <div className="p-4 rounded-xl bg-loss-soft/70 border border-loss/30 space-y-2 text-xs text-loss">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        {language === "bn"
                          ? "ঐতিহাসিকভাবে বিলীন বা জলমগ্ন ভূমির বিবরণ"
                          : "Permanently Submerged Cadastral Record"}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink leading-relaxed">
                      {language === "bn"
                        ? `এই দাগটি (দাগ নং ${formatNumberLocalized(report.identification.dagNo, language)}) ঐতিহাসিক নদীভাঙনের ফলে বর্তমানে যমুনা নদীগর্ভে বিলীন। তবে ক্যাডাস্ট্রাল আইনের ধারা মোতাবেক ভূমির ঐতিহাসিক পরিচয় ও সাবেক মালিকানা সংরক্ষিত রয়েছে। ভবিষ্যতে পয়স্তি (নতুন চর গঠন) হলে রাষ্ট্রীয় খাস জমি বা সাবেক মালিকানা দাবি মূল্যায়নে এই রেকর্ড ব্যবহার্য।`
                        : `This plot (Plot No. ${report.identification.dagNo}) has been submerged into the Jamuna river due to historical river erosion. Under cadastral law, the historical identity and previous deed ownership are preserved. In the event of alluvion/char re-emergence, these records assist in verifying khas and restitution rights.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
