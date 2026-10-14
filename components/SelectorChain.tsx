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
}

export function getStepsForHazard(hazard: HazardType): SelectorChainStepDef[] {
  switch (hazard) {
    case "river_erosion":
      return [
        { key: "d", stepName: "district", label: "District", placeholder: "Select District" },
        { key: "u", stepName: "upazila", label: "Upazila", placeholder: "Select Upazila" },
        { key: "r", stepName: "river", label: "River", placeholder: "Select River" },
        { key: "m", stepName: "mouza", label: "Riverside Mouza", placeholder: "Select Mouza" },
      ];
    case "flood":
      return [
        { key: "d", stepName: "district", label: "District", placeholder: "Select District" },
        { key: "u", stepName: "upazila", label: "Upazila", placeholder: "Select Upazila" },
        { key: "m", stepName: "mouza", label: "Mouza", placeholder: "Select Mouza" },
        { key: "year", stepName: "year", label: "Flood Event Year", placeholder: "Select Year" },
      ];
    case "landslide":
      return [
        { key: "d", stepName: "district", label: "District", placeholder: "Select District" },
        { key: "u", stepName: "upazila", label: "Upazila", placeholder: "Select Upazila" },
        { key: "h", stepName: "hill", label: "Hill Feature", placeholder: "Select Hill Slope" },
      ];
    case "char":
      return [
        { key: "d", stepName: "district", label: "District", placeholder: "Select District" },
        { key: "u", stepName: "upazila", label: "Upazila", placeholder: "Select Upazila" },
        { key: "r", stepName: "river", label: "River System", placeholder: "Select River" },
        { key: "m", stepName: "char", label: "Char Island", placeholder: "Select Char Island" },
      ];
    case "coastal":
      return [
        { key: "d", stepName: "district", label: "District", placeholder: "Select District" },
        { key: "u", stepName: "upazila", label: "Upazila", placeholder: "Select Upazila" },
        { key: "m", stepName: "mouza", label: "Coastal Mouza / Strip", placeholder: "Select Coastal Mouza" },
      ];
    default:
      return [
        { key: "d", stepName: "district", label: "District", placeholder: "Select District" },
        { key: "u", stepName: "upazila", label: "Upazila", placeholder: "Select Upazila" },
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
}: SelectorChainProps) {
  const steps = getStepsForHazard(hazard);
  const [openStep, setOpenStep] = useState<StepKey | null>(null);

  return (
    <div className={cn("bhumidorpon-card p-4 sm:p-5 flex flex-col gap-3 relative", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="text-xs font-semibold text-secondary flex items-center gap-2">
          <span>Location Selector</span>
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
            <span>Reset to Pilot Cluster</span>
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
    staleTime: 60 * 1000,
  });

  const selectedOption = options.find((o) => o.id === selectedValue);

  return (
    <div className="relative flex-1 min-w-[200px]">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1 flex items-center gap-1.5">
        <span
          className={cn(
            "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold tabular-nums",
            selectedValue
              ? "bg-accent text-ink"
              : !isEnabled
              ? "bg-border text-muted"
              : "bg-surface-alt text-ink border border-border"
          )}
        >
          {index + 1}
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
                        ? "Records available for current hazard and mode"
                        : "No records"
                    }
                  >
                    ●
                  </span>
                  <span className="font-semibold text-ink truncate">
                    {selectedOption.label}
                  </span>
                </div>
              ) : (
                <span className="text-muted text-xs truncate">
                  {!isEnabled
                    ? `Select previous step first`
                    : isLoading
                    ? "Loading options..."
                    : options.length === 0
                    ? `No ${step.label.toLowerCase()} available`
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
                  title="Clear selection"
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
                  placeholder={`Search ${step.label.toLowerCase()}...`}
                  className="w-full h-9 text-xs bg-transparent border-0 outline-none placeholder:text-muted"
                />
              </div>
              <Command.List className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 text-xs">
                <Command.Empty className="p-3 text-center text-xs text-muted">
                  No matching {step.label.toLowerCase()} found.
                </Command.Empty>
                {options.map((opt) => (
                  <Command.Item
                    key={opt.id}
                    value={`${opt.label} ${opt.sublabel || ""} ${opt.id}`}
                    onSelect={() => {
                      // CRITICAL RULE: cmdk lowercases item values, so select by item ID through a closure, never by comparing labels!
                      onSelect(opt.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "px-2.5 py-2 rounded-input flex items-center justify-between cursor-pointer transition-colors",
                      opt.id === selectedValue
                        ? "bg-accent-soft text-ink font-semibold"
                        : "hover:bg-surface-alt text-ink"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className={cn(
                          "text-xs flex-shrink-0",
                          opt.hasRecords ? "text-[#2F9E62] font-bold" : "text-muted/30"
                        )}
                        title={
                          opt.hasRecords
                            ? "Records available for current hazard and mode"
                            : "No direct records"
                        }
                      >
                        ●
                      </span>
                      <div className="truncate">
                        <div className="font-medium truncate text-ink">{opt.label}</div>
                        {opt.sublabel && (
                          <div className="text-[10px] text-muted truncate">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>
                    {opt.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-alt border border-border text-secondary flex-shrink-0 font-medium">
                        {opt.badge}
                      </span>
                    )}
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
