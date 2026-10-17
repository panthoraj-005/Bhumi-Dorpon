"use client";

import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { HazardType, DataMode } from "@/lib/types";
import { getOptions, SelectorOption } from "@/lib/data";
import { SelectionState, StepKey } from "@/lib/useSelection";
import { useAppStore } from "@/stores/appStore";
import {
  Language,
  formatNumberLocalized,
  getLocalizedDistrictName,
  getLocalizedUpazilaName,
  getLocalizedMouzaName,
  getLocalizedRiverName,
  getLocalizedHillName,
  DISTRICTS_BN,
} from "@/lib/translations";

function getLocalizedOptionText(stepName: string, label: string, language: Language): string {
  if (language !== "bn" || !label) return label;
  switch (stepName) {
    case "district":
      return getLocalizedDistrictName(label, language);
    case "upazila":
      return getLocalizedUpazilaName(label, language);
    case "mouza":
    case "char":
      return getLocalizedMouzaName(label, language);
    case "river":
      return getLocalizedRiverName(label, language);
    case "hill":
      return getLocalizedHillName(label, language);
    case "year":
      return formatNumberLocalized(label, language);
    default:
      return label;
  }
}

function getLocalizedOptionSublabel(sublabel: string | undefined, language: Language): string | undefined {
  if (!sublabel || language !== "bn") return sublabel;
  let res = sublabel;
  res = res.replace(/JL[-–\s]*(\d+)/gi, (_, n) => `জেএল-${formatNumberLocalized(n, "bn")}`);
  res = res.replace(/Division/gi, "বিভাগ");
  res = res.replace(/Coastal Zone/gi, "উপকূলীয় অঞ্চল");
  res = res.replace(/Hill Tracts/gi, "পার্বত্য অঞ্চল");
  res = res.replace(/Char Island/gi, "চর এলাকা");
  for (const [en, bn] of Object.entries(DISTRICTS_BN)) {
    res = res.replace(new RegExp(`\\b${en}\\b`, "gi"), bn);
  }
  return formatNumberLocalized(res, "bn");
}

export interface SelectorChainStepDef {
  key: StepKey;
  stepName: string;
  label: string;
  placeholder: string;
}

interface SelectorChainProps {
  hazard: HazardType;
  mode: DataMode;
  selection: SelectionState;
  onSelectStep: (stepKey: StepKey, val: string | null) => void;
  onReset?: () => void;
  className?: string;
  language?: Language;
}

export function getStepsForHazard(hazard: HazardType, language: Language = "bn"): SelectorChainStepDef[] {
  const isBn = language === "bn";
  switch (hazard) {
    case "river_erosion":
      return [
        { key: "d", stepName: "district", label: isBn ? "জেলা" : "District", placeholder: isBn ? "জেলা নির্বাচন করুন" : "Select District" },
        { key: "u", stepName: "upazila", label: isBn ? "উপজেলা" : "Upazila", placeholder: isBn ? "উপজেলা নির্বাচন করুন" : "Select Upazila" },
        { key: "r", stepName: "river", label: isBn ? "নদী" : "River", placeholder: isBn ? "নদী নির্বাচন করুন" : "Select River" },
        { key: "m", stepName: "mouza", label: isBn ? "নদী তীরবর্তী মৌজা" : "Riverside Mouza", placeholder: isBn ? "মৌজা নির্বাচন করুন" : "Select Mouza" },
      ];
    case "flood":
      return [
        { key: "d", stepName: "district", label: isBn ? "জেলা" : "District", placeholder: isBn ? "জেলা নির্বাচন করুন" : "Select District" },
        { key: "u", stepName: "upazila", label: isBn ? "উপজেলা" : "Upazila", placeholder: isBn ? "উপজেলা নির্বাচন করুন" : "Select Upazila" },
        { key: "m", stepName: "mouza", label: isBn ? "মৌজা" : "Mouza", placeholder: isBn ? "মৌজা নির্বাচন করুন" : "Select Mouza" },
        { key: "year", stepName: "year", label: isBn ? "বন্যা বছর" : "Flood Event Year", placeholder: isBn ? "বছর নির্বাচন করুন" : "Select Year" },
      ];
    case "landslide":
      return [
        { key: "d", stepName: "district", label: isBn ? "জেলা" : "District", placeholder: isBn ? "জেলা নির্বাচন করুন" : "Select District" },
        { key: "u", stepName: "upazila", label: isBn ? "উপজেলা" : "Upazila", placeholder: isBn ? "উপজেলা নির্বাচন করুন" : "Select Upazila" },
        { key: "h", stepName: "hill", label: isBn ? "পাহাড়" : "Hill Feature", placeholder: isBn ? "পাহাড় নির্বাচন করুন" : "Select Hill Slope" },
      ];
    case "char":
      return [
        { key: "d", stepName: "district", label: isBn ? "জেলা" : "District", placeholder: isBn ? "জেলা নির্বাচন করুন" : "Select District" },
        { key: "u", stepName: "upazila", label: isBn ? "উপজেলা" : "Upazila", placeholder: isBn ? "উপজেলা নির্বাচন করুন" : "Select Upazila" },
        { key: "r", stepName: "river", label: isBn ? "নদী ব্যবস্থা" : "River System", placeholder: isBn ? "নদী নির্বাচন করুন" : "Select River" },
        { key: "m", stepName: "char", label: isBn ? "চর এলাকা" : "Char Island", placeholder: isBn ? "চর নির্বাচন করুন" : "Select Char Island" },
      ];
    case "coastal":
      return [
        { key: "d", stepName: "district", label: isBn ? "জেলা" : "District", placeholder: isBn ? "জেলা নির্বাচন করুন" : "Select District" },
        { key: "u", stepName: "upazila", label: isBn ? "উপজেলা" : "Upazila", placeholder: isBn ? "উপজেলা নির্বাচন করুন" : "Select Upazila" },
        { key: "m", stepName: "mouza", label: isBn ? "উপকূলীয় মৌজা" : "Coastal Mouza / Strip", placeholder: isBn ? "মৌজা নির্বাচন করুন" : "Select Coastal Mouza" },
      ];
    default:
      return [
        { key: "d", stepName: "district", label: isBn ? "জেলা" : "District", placeholder: isBn ? "জেলা নির্বাচন করুন" : "Select District" },
        { key: "u", stepName: "upazila", label: isBn ? "উপজেলা" : "Upazila", placeholder: isBn ? "উপজেলা নির্বাচন করুন" : "Select Upazila" },
      ];
  }
}

export function SelectorChain({
  hazard,
  mode,
  selection,
  onSelectStep,
  onReset,
  className,
  language: propLanguage,
}: SelectorChainProps) {
  const storeLanguage = useAppStore().language;
  const language = propLanguage || storeLanguage;
  const steps = getStepsForHazard(hazard, language);
  const [openStep, setOpenStep] = useState<StepKey | null>(null);

  return (
    <div className={cn("bhumidorpon-card p-4 sm:p-5 flex flex-col gap-3 relative", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="text-xs font-semibold text-secondary flex items-center gap-2">
          <span>{language === "bn" ? "এলাকা নির্বাচন" : "Location Selector"}</span>
          <span className="text-[11px] text-muted font-normal">
            ({steps.map((s) => s.label).join(" > ")})
          </span>
        </div>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink font-medium px-2.5 py-1 rounded-pill hover:bg-surface-alt transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "প্রাথমিক এলাকায় ফিরুন" : "Reset to Pilot Cluster"}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 w-full">
        {steps.map((step, idx) => {
          // Rule: Step n is enabled as soon as step n-1 has a value and can never get stuck disabled
          const isEnabled = idx === 0 || Boolean(selection[steps[idx - 1].key]);
          const selectedValue = selection[step.key];

          return (
            <SelectorStepCombobox
              key={step.key}
              step={step}
              index={idx}
              hazard={hazard}
              mode={mode}
              selection={selection}
              isEnabled={isEnabled}
              selectedValue={selectedValue}
              isOpen={openStep === step.key}
              onOpenChange={(open) => setOpenStep(open ? step.key : null)}
              onSelect={(val) => onSelectStep(step.key, val)}
              language={language}
            />
          );
        })}
      </div>
    </div>
  );
}

interface SelectorStepComboboxProps {
  step: SelectorChainStepDef;
  index: number;
  hazard: HazardType;
  mode: DataMode;
  selection: SelectionState;
  isEnabled: boolean;
  selectedValue: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (val: string | null) => void;
  language: Language;
}

function SelectorStepCombobox({
  step,
  index,
  hazard,
  mode,
  selection,
  isEnabled,
  selectedValue,
  isOpen,
  onOpenChange,
  onSelect,
  language,
}: SelectorStepComboboxProps) {
  // Query options dynamically via TanStack Query
  const { data: options = [], isLoading } = useQuery<SelectorOption[]>({
    queryKey: [
      "selectorOptions",
      hazard,
      mode,
      step.stepName,
      {
        d: selection.d,
        u: selection.u,
        r: selection.r,
        h: selection.h,
        m: selection.m,
      },
    ],
    queryFn: () =>
      getOptions(hazard, mode, step.stepName, {
        d: selection.d || "",
        u: selection.u || "",
        r: selection.r || "",
        h: selection.h || "",
        m: selection.m || "",
        year: selection.year || "",
      }),
    enabled: isEnabled,
  });

  const selectedOption = options.find((opt) => opt.id === selectedValue);

  return (
    <div className="flex-1 min-w-[170px] space-y-1">
      <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-surface-alt border border-border text-[10px] font-bold text-muted inline-flex items-center justify-center">
          {formatNumberLocalized(index + 1, language)}
        </span>
        <span>{step.label}</span>
      </label>

      <Popover.Root open={isOpen && isEnabled} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={!isEnabled}
            className={cn(
              "w-full h-11 px-3.5 rounded-input flex items-center justify-between text-left text-sm transition-all border",
              !isEnabled
                ? "bg-[#F4F5EE] border-[#E8EBDD] text-muted/60 cursor-not-allowed opacity-60"
                : isOpen
                ? "bg-surface border-ink ring-2 ring-ink/10 text-ink shadow-sm"
                : "bg-surface-alt hover:bg-[#E8EBDD] border-border text-ink"
            )}
          >
            <div className="flex items-center gap-2 truncate pr-1">
              {selectedOption ? (
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={cn(
                      "text-xs flex-shrink-0",
                      selectedOption.hasRecords ? "text-[#2F9E62] font-bold" : "text-muted/40"
                    )}
                    title={
                      selectedOption.hasRecords
                        ? language === "bn" ? "তথ্য সংরক্ষিত আছে" : "Records available for current hazard and mode"
                        : language === "bn" ? "কোনো তথ্য নেই" : "No records"
                    }
                  >
                    ●
                  </span>
                  <span className="font-semibold text-ink truncate">
                    {getLocalizedOptionText(step.stepName, selectedOption.label, language)}
                  </span>
                </div>
              ) : (
                <span className="text-muted text-xs truncate">
                  {!isEnabled
                    ? language === "bn" ? "আগের ধাপটি নির্বাচন করুন" : "Select previous step first"
                    : isLoading
                    ? language === "bn" ? "লোড হচ্ছে..." : "Loading options..."
                    : options.length === 0
                    ? language === "bn" ? "কোনো তথ্য পাওয়া যায়নি" : `No ${step.label.toLowerCase()} available`
                    : step.placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 text-muted">
              {selectedOption && isEnabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(null);
                  }}
                  className="p-1 hover:text-ink rounded-full hover:bg-black/5"
                  title={language === "bn" ? "নির্বাচন মুছুন" : "Clear selection"}
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-150",
                  isOpen && "rotate-180 text-ink"
                )}
              />
            </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-50 w-[300px] bg-surface rounded-card border border-border shadow-elevated p-0 overflow-hidden text-ink animate-in fade-in-50 zoom-in-95"
          >
            <Command className="flex flex-col w-full h-full">
              <div className="flex items-center px-3 border-b border-border bg-surface-alt/40">
                <Search className="w-3.5 h-3.5 text-muted mr-2 flex-shrink-0" />
                <Command.Input
                  placeholder={language === "bn" ? `${step.label} খুঁজুন...` : `Search ${step.label.toLowerCase()}...`}
                  className="w-full h-9 text-xs bg-transparent border-0 outline-none placeholder:text-muted"
                />
              </div>
              <Command.List className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 text-xs">
                <Command.Empty className="p-3 text-center text-xs text-muted">
                  {language === "bn" ? "কোনো মিল পাওয়া যায়নি" : `No matching ${step.label.toLowerCase()} found.`}
                </Command.Empty>
                {options.map((opt) => (
                  <Command.Item
                    key={opt.id}
                    value={`${opt.label} ${getLocalizedOptionText(step.stepName, opt.label, language)} ${opt.sublabel || ""} ${opt.id}`}
                    onSelect={() => {
                      onSelect(opt.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors",
                      selectedValue === opt.id
                        ? "bg-accent-soft text-accent-deep font-semibold"
                        : "hover:bg-surface-alt text-ink"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className={cn(
                          "text-xs flex-shrink-0",
                          opt.hasRecords ? "text-[#2F9E62] font-bold" : "text-muted/40"
                        )}
                        title={
                          opt.hasRecords
                            ? language === "bn" ? "তথ্য সংরক্ষিত আছে" : "Records available for current hazard and mode"
                            : language === "bn" ? "কোনো তথ্য নেই" : "No records"
                        }
                      >
                        ●
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="truncate">{getLocalizedOptionText(step.stepName, opt.label, language)}</span>
                        {opt.sublabel && (
                          <span className="text-[10px] text-muted truncate">
                            {getLocalizedOptionSublabel(opt.sublabel, language)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px]">
                      {opt.hasRecords ? (
                        <span className="px-1.5 py-0.5 rounded bg-[#DFF3E8] text-[#2F9E62] font-semibold">
                          {language === "bn" ? "রেকর্ড বিদ্যমান" : "Records"}
                        </span>
                      ) : (
                        <span className="text-muted/60">
                          {language === "bn" ? "তথ্য নেই" : "Empty"}
                        </span>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
