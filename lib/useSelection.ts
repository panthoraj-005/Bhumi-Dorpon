"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useEffect, useRef } from "react";
import { HazardType, DataMode } from "@/lib/types";
import { getEventsForMountain } from "@/lib/landslideEvents";

export interface SelectionState {
  d: string | null;     // District
  u: string | null;     // Upazila
  r: string | null;     // River
  h: string | null;     // Hill
  m: string | null;     // Mouza / Char
  year: string | null;  // Flood Event Year
  ev: string | null;    // Landslide Event
}

export type StepKey = "d" | "u" | "r" | "h" | "m" | "year" | "ev";

export interface UseSelectionOptions {
  hazard: HazardType;
  mode: DataMode;
  defaultSelection?: Partial<SelectionState>;
}

export function useSelection({
  hazard,
  mode,
  defaultSelection,
}: UseSelectionOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialDefaultAppliedRef = useRef(false);

  // 1. URL is the single source of truth
  const d = searchParams.get("d");
  const u = searchParams.get("u");
  const r = searchParams.get("r");
  const h = searchParams.get("h");
  const m = searchParams.get("m");
  const year = searchParams.get("year");
  const ev = searchParams.get("ev");

  const selection: SelectionState = useMemo(
    () => ({ d, u, r, h, m, year, ev }),
    [d, u, r, h, m, year, ev]
  );

  // 2. Initialize default selection if URL has NO selection query params
  useEffect(() => {
    if (initialDefaultAppliedRef.current) return;
    const hasAnyParam = Boolean(
      searchParams.get("d") ||
      searchParams.get("u") ||
      searchParams.get("r") ||
      searchParams.get("h") ||
      searchParams.get("m") ||
      searchParams.get("year") ||
      searchParams.get("ev")
    );

    if (!hasAnyParam && defaultSelection && defaultSelection.d) {
      initialDefaultAppliedRef.current = true;
      const params = new URLSearchParams();
      if (defaultSelection.d) params.set("d", defaultSelection.d);
      if (defaultSelection.u) params.set("u", defaultSelection.u);
      if (defaultSelection.r) params.set("r", defaultSelection.r);
      if (defaultSelection.h) params.set("h", defaultSelection.h);
      if (defaultSelection.m) params.set("m", defaultSelection.m);
      if (defaultSelection.year) params.set("year", defaultSelection.year);
      if (defaultSelection.ev) params.set("ev", defaultSelection.ev);

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [searchParams, defaultSelection, pathname, router]);

  // Auto-select newest event for landslide when hill is selected and ev is empty
  useEffect(() => {
    if (hazard !== "landslide" || !h) return;
    const events = getEventsForMountain(h, mode);
    if (events.length > 0) {
      const validEventIds = new Set(events.map((e) => e.id));
      if (!ev || !validEventIds.has(ev)) {
        const sorted = [...events].sort((a, b) => b.year - a.year);
        const newestEventId = sorted[0].id;
        const params = new URLSearchParams(searchParams.toString());
        params.set("ev", newestEventId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else if (ev) {
      // If the hill has no events, clear any stale ev param
      const params = new URLSearchParams(searchParams.toString());
      params.delete("ev");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [hazard, h, ev, mode, searchParams, pathname, router]);

  // 3. Step update logic: changing step n clears only later steps
  const setStep = useCallback(
    (key: StepKey, val: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (key === "d") {
        if (val) params.set("d", val);
        else params.delete("d");
        params.delete("u");
        params.delete("r");
        params.delete("h");
        params.delete("m");
        params.delete("year");
        params.delete("ev");
      } else if (key === "u") {
        if (val) params.set("u", val);
        else params.delete("u");
        params.delete("r");
        params.delete("h");
        params.delete("m");
        params.delete("year");
        params.delete("ev");
      } else if (key === "r") {
        if (val) params.set("r", val);
        else params.delete("r");
        params.delete("m");
        params.delete("year");
      } else if (key === "h") {
        if (val) params.set("h", val);
        else params.delete("h");
        params.delete("m");
        params.delete("year");
        params.delete("ev");
      } else if (key === "m") {
        if (val) params.set("m", val);
        else params.delete("m");
        params.delete("year");
      } else if (key === "year") {
        if (val) params.set("year", val);
        else params.delete("year");
      } else if (key === "ev") {
        if (val) params.set("ev", val);
        else params.delete("ev");
      }

      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // 4. Reset to pilot cluster default
  const resetToDefault = useCallback(() => {
    const params = new URLSearchParams();
    if (defaultSelection) {
      if (defaultSelection.d) params.set("d", defaultSelection.d);
      if (defaultSelection.u) params.set("u", defaultSelection.u);
      if (defaultSelection.r) params.set("r", defaultSelection.r);
      if (defaultSelection.h) params.set("h", defaultSelection.h);
      if (defaultSelection.m) params.set("m", defaultSelection.m);
      if (defaultSelection.year) params.set("year", defaultSelection.year);
      if (defaultSelection.ev) params.set("ev", defaultSelection.ev);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [defaultSelection, pathname, router]);

  // 5. Final step determination per hazard
  const isFinalStepSet = useMemo(() => {
    if (hazard === "river_erosion") return Boolean(d && u && r && m);
    if (hazard === "flood") return Boolean(d && u && m && year);
    if (hazard === "landslide") return Boolean(d && u && h);
    if (hazard === "char") return Boolean(d && u && r && m);
    if (hazard === "coastal") return Boolean(d && u && m);
    return false;
  }, [hazard, d, u, r, h, m, year]);

  // 6. Active Entity ID for data layer queries
  const activeEntityId = useMemo(() => {
    if (hazard === "landslide") return h;
    return m;
  }, [hazard, h, m]);

  return {
    selection,
    d,
    u,
    r,
    h,
    m,
    year,
    ev,
    setStep,
    resetToDefault,
    isFinalStepSet,
    activeEntityId,
  };
}
