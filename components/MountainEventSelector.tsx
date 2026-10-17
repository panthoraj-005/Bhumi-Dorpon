"use client";

import React, { useState, useEffect } from "react";
import {
  Mountain,
  Calendar,
  AlertTriangle,
  MapPin,
  ChevronDown,
  Info,
  CheckCircle,
  Layers,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { DataMode, Hill } from "@/lib/types";
import {
  t,
  formatNumberLocalized,
  getLocalizedHillName,
  getLocalizedRiskLevel,
  getLocalizedSoilType,
} from "@/lib/translations";
import { formatArea } from "@/lib/units";
import {
  LandslideEventRecord,
  getEventsForMountain,
} from "@/lib/landslideEvents";
import { cn } from "@/lib/utils";

interface MountainEventSelectorProps {
  mode: DataMode;
  hills: Hill[];
  selectedHillId: string;
  selectedEventId?: string;
  onSelectMountain: (hillId: string) => void;
  onSelectEvent: (event: LandslideEventRecord | null) => void;
  className?: string;
}

export function MountainEventSelector({
  mode,
  hills,
  selectedHillId,
  selectedEventId,
  onSelectMountain,
  onSelectEvent,
  className = "",
}: MountainEventSelectorProps) {
  const { language, unit } = useAppStore();

  const isForecast = mode === "forecast";
  const [events, setEvents] = useState<LandslideEventRecord[]>([]);
  const [activeEvent, setActiveEvent] = useState<LandslideEventRecord | null>(null);

  // When mountain or mode changes, refresh event list and reset selection
  useEffect(() => {
    if (!selectedHillId) {
      setEvents([]);
      setActiveEvent(null);
      onSelectEvent(null);
      return;
    }

    const availableEvents = getEventsForMountain(selectedHillId, mode);
    setEvents(availableEvents);

    // If an explicit selectedEventId belongs to the new mountain
    if (selectedEventId && availableEvents.some((e) => e.id === selectedEventId)) {
      const match = availableEvents.find((e) => e.id === selectedEventId)!;
      setActiveEvent(match);
      onSelectEvent(match);
    } else if (availableEvents.length > 0) {
      // Default to the first available event of the newly selected mountain
      setActiveEvent(availableEvents[0]);
      onSelectEvent(availableEvents[0]);
    } else {
      // Honest empty state: no events for this mountain
      setActiveEvent(null);
      onSelectEvent(null);
    }
  }, [selectedHillId, mode]);

  const handleMountainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHillId = e.target.value;
    onSelectMountain(newHillId);
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEventId = e.target.value;
    if (!newEventId) {
      setActiveEvent(null);
      onSelectEvent(null);
      return;
    }
    const found = events.find((ev) => ev.id === newEventId) || null;
    setActiveEvent(found);
    onSelectEvent(found);
  };

  const currentHill = hills.find((h) => h.id === selectedHillId);

  return (
    <div
      className={cn(
        "bhumidorpon-card p-5 sm:p-6 space-y-5 bg-gradient-to-br from-surface to-surface-alt/40 border-border shadow-sm",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold shadow-xs shrink-0">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-display font-bold text-ink">
              {language === "bn"
                ? "পাহাড় ও ভূমিধসের ঘটনার তালিকা নির্বাচক"
                : "Mountain & Landslide Event Selector"}
            </h3>
            <p className="text-xs text-muted">
              {language === "bn"
                ? "নির্দিষ্ট পাহাড় নির্বাচন করুন এবং সংশ্লিষ্ট ভূমিধসের ঘটনা বা মডেল প্রক্ষেপণ লোড করুন"
                : "Select a mountain to load recorded landslide events or forecast models"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isForecast ? (
            <span className="px-2.5 py-0.5 rounded-pill bg-predicted-soft border border-predicted/30 text-predicted text-[11px] font-bold">
              {language === "bn" ? "মডেল প্রক্ষেপণ মোড" : "DL Forecast Mode"}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-pill bg-gain-soft text-gain text-[11px] font-bold">
              {language === "bn" ? "রেকর্ডকৃত ঘটনা মোড" : "Recorded Events Mode"}
            </span>
          )}
        </div>
      </div>

      {/* TWO SEPARATE SELECTION BOXES (Side-by-side on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* BOX 1: MOUNTAIN SELECTOR */}
        <div className="p-4 rounded-xl bg-surface border border-border space-y-2 flex flex-col justify-between shadow-subtle">
          <div>
            <label
              htmlFor="landslide-mountain-select"
              className="block text-xs sm:text-sm font-bold text-ink mb-1.5 flex items-center gap-1.5"
            >
              <Mountain className="w-4 h-4 text-[#D97706]" />
              <span>{language === "bn" ? "পাহাড় নির্বাচন" : "Select Mountain"}</span>
            </label>
            <div className="relative">
              <select
                id="landslide-mountain-select"
                value={selectedHillId}
                onChange={handleMountainChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle appearance-none pr-9 cursor-pointer"
              >
                <option value="">
                  {language === "bn" ? "পাহাড় নির্বাচন করুন..." : "Select Mountain..."}
                </option>
                {hills.map((h) => {
                  const hillName = getLocalizedHillName(h.id, language) || h.name;
                  const riskLevel = getLocalizedRiskLevel(h.riskLevel, language);
                  return (
                    <option key={h.id} value={h.id}>
                      {hillName} ({formatNumberLocalized(h.slopeAngleDeg, language)}° {language === "bn" ? "ঢাল" : "slope"} • {riskLevel})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {currentHill ? (
            <div className="text-[11px] text-muted flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
              <span>{language === "bn" ? "মাটির ধরন:" : "Soil Type:"} <strong className="text-ink">{getLocalizedSoilType(currentHill.soilType, language)}</strong></span>
              <span>•</span>
              <span>{language === "bn" ? "ঝুঁকি:" : "Risk:"} <strong className="text-amber-600">{getLocalizedRiskLevel(currentHill.riskLevel, language)}</strong></span>
            </div>
          ) : (
            <p className="text-[11px] text-muted pt-1 border-t border-border/60">
              {language === "bn" ? "তালিকা থেকে যেকোনো পাহাড় নির্বাচন করুন" : "Select any mountain from the list"}
            </p>
          )}
        </div>

        {/* BOX 2: SEPARATE LANDSLIDE EVENT SELECTOR */}
        <div className="p-4 rounded-xl bg-surface border border-border space-y-2 flex flex-col justify-between shadow-subtle">
          <div>
            <label
              htmlFor="landslide-event-select"
              className="block text-xs sm:text-sm font-bold text-ink mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-accent-deep" />
              <span>{language === "bn" ? "ভূমিধসের ঘটনার তালিকা" : "Landslide Events"}</span>
            </label>

            <div className="relative">
              <select
                id="landslide-event-select"
                value={activeEvent?.id || ""}
                onChange={handleEventChange}
                disabled={!selectedHillId || events.length === 0}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs sm:text-sm font-medium text-ink disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-subtle appearance-none pr-9 cursor-pointer"
              >
                {!selectedHillId ? (
                  <option value="">
                    {language === "bn" ? "প্রথমে পাহাড় নির্বাচন করুন" : "Select a mountain first"}
                  </option>
                ) : events.length === 0 ? (
                  <option value="">
                    {language === "bn"
                      ? "এই পাহাড়ের কোনো ভূমিধসের তথ্য পাওয়া যায়নি।"
                      : "No landslide records found for this mountain"}
                  </option>
                ) : (
                  <>
                    <option value="">
                      {language === "bn" ? "কোনো ঘটনা নির্বাচন করুন" : "Select an Event"}
                    </option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {formatNumberLocalized(ev.year, language)} • {language === "bn" ? ev.eventNameBn : ev.eventNameEn}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Helper caption below event box */}
          <div className="text-[11px] pt-1 border-t border-border/60">
            {!selectedHillId ? (
              <span className="text-muted">
                {language === "bn" ? "পাহাড় নির্বাচন করলে ঘটনার তালিকা সক্রিয় হবে" : "Events list will activate upon selecting a mountain"}
              </span>
            ) : events.length > 0 ? (
              <span className="text-secondary font-medium">
                {formatNumberLocalized(events.length, language)} {language === "bn" ? "টি ঘটনা উপলব্ধ" : "events recorded for this mountain"}
              </span>
            ) : (
              <span className="text-loss font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>
                  {language === "bn"
                    ? "এই পাহাড়ের কোনো ভূমিধসের তথ্য পাওয়া যায়নি।"
                    : "No landslide records found for this mountain"}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SELECTED EVENT DETAILS CARD */}
      {activeEvent ? (
        <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border space-y-4 animate-in fade-in duration-200 shadow-subtle">
          {/* Header of event details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/70 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent-soft text-accent-deep">
                  {language === "bn" ? activeEvent.mountainNameBn : activeEvent.mountainNameEn}
                </span>
                <span className="text-xs font-mono font-medium text-muted">
                  #{activeEvent.id}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-ink">
                {language === "bn" ? activeEvent.eventNameBn : activeEvent.eventNameEn}
              </h4>
              <div className="text-xs text-muted flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-accent-deep" />
                  <span><strong>{language === "bn" ? "ঘটনার তারিখ:" : "Event Date:"}</strong> {formatNumberLocalized(activeEvent.eventDate, language)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-loss" />
                  <span><strong>{language === "bn" ? "রেকর্ডকৃত অবস্থান:" : "Recorded Location:"}</strong> {language === "bn" ? activeEvent.locationBn : activeEvent.locationEn}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {activeEvent.isDemo ? (
                <span className="px-2.5 py-1 rounded-pill bg-accent-soft text-accent-deep text-[11px] font-bold">
                  {t("badgeDemo", language)}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-pill bg-gain-soft text-gain text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{t("badgeVerified", language)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface-alt border border-border/60">
              <span className="text-[11px] text-muted block mb-0.5">
                {language === "bn" ? "ক্ষতিগ্রস্ত ঢাল এলাকা" : "Affected Slope Area"}
              </span>
              <span className="font-bold text-loss tabular-nums text-sm sm:text-base">
                {formatArea(activeEvent.affectedSlopeAreaDecimal, unit, language)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-alt border border-border/60">
              <span className="text-[11px] text-muted block mb-0.5">
                {language === "bn" ? "স্থানান্তরিত ধ্বংসাবশেষ" : "Debris Volume"}
              </span>
              <span className="font-bold text-ink tabular-nums text-sm sm:text-base">
                {formatNumberLocalized(activeEvent.debrisVolumeM3, language)} {language === "bn" ? "ঘনমিটার" : "m³"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-alt border border-border/60">
              <span className="text-[11px] text-muted block mb-0.5">
                {language === "bn" ? "২৪ ঘণ্টার বৃষ্টিপাত" : "24h Rainfall"}
              </span>
              <span className="font-bold text-water tabular-nums text-sm sm:text-base">
                {formatNumberLocalized(activeEvent.rainfallMm24h, language)} {language === "bn" ? "মি.মি." : "mm"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-alt border border-border/60">
              <span className="text-[11px] text-muted block mb-0.5">
                {language === "bn" ? "ঝুঁকিপূর্ণ বসতি" : "Homesteads at Risk"}
              </span>
              <span className="font-bold text-amber-600 tabular-nums text-sm sm:text-base">
                {formatNumberLocalized(activeEvent.homesteadsAtRisk, language)} {language === "bn" ? "টি প্লট" : "plots"}
              </span>
            </div>
          </div>

          {/* Event Details / Description */}
          <div className="p-3.5 rounded-lg bg-surface-alt/70 border border-border text-xs text-secondary leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink block mb-0.5">
                {language === "bn" ? "ঘটনার বিবরণ:" : "Event Details:"}
              </strong>
              <span>
                {language === "bn" ? activeEvent.impactSummaryBn : activeEvent.impactSummaryEn}
              </span>
            </div>
          </div>
        </div>
      ) : selectedHillId && events.length === 0 ? (
        /* Honest empty state when mountain has no recorded events */
        <div className="p-6 rounded-xl bg-surface border border-border text-center space-y-2 animate-in fade-in duration-200">
          <div className="w-10 h-10 rounded-full bg-surface-alt border border-border mx-auto flex items-center justify-center text-muted">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h4 className="text-sm font-bold text-ink">
            {language === "bn"
              ? "এই পাহাড়ের কোনো ভূমিধসের তথ্য পাওয়া যায়নি।"
              : "No landslide records found for this mountain"}
          </h4>
          <p className="text-xs text-muted max-w-md mx-auto">
            {language === "bn"
              ? "এই পাহাড় বা শৈলশিরার জন্য কোনো ঐতিহাসিক বা প্রক্ষেপিত ভূমিধসের নথি এই মুহূর্তে সিস্টেমে অন্তর্ভুক্ত নেই। অন্য একটি পাহাড় নির্বাচন করে দেখুন।"
              : "No historical or projected landslide events are recorded for this mountain in the current catalog. Please select another mountain to explore."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
