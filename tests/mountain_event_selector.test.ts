import { describe, it, expect } from "vitest";
import {
  getEventsForMountain,
  getLandslideEventById,
  getDefaultEventForMountain,
  LANDSLIDE_EVENTS,
} from "../lib/landslideEvents";
import { getHills, getOptions } from "../lib/data";
import fs from "fs";
import path from "path";

describe("Landslide 4-Step Dependent Chain & Event Integration (Change 4 Section A)", () => {
  it("loads hills catalog and provides mountains for selection", async () => {
    const hills = await getHills();
    expect(hills.length).toBeGreaterThan(0);
    const ghagra = hills.find((h) => h.id === "ghagra");
    expect(ghagra).toBeDefined();
    expect(ghagra?.slopeAngleDeg).toBe(42);
  });

  it("retrieves recorded historical landslide events associated with selected mountain", () => {
    const recordedEvents = getEventsForMountain("ghagra", "recorded");
    expect(recordedEvents.length).toBeGreaterThan(0);
    const ev2024 = recordedEvents.find((e) => e.year === 2024);
    expect(ev2024).toBeDefined();
    expect(ev2024?.affectedSlopeAreaDecimal).toBe(117.6);
    expect(ev2024?.debrisVolumeM3).toBe(43200);
    expect(ev2024?.slopeGradientDeg).toBe(42);
    expect(ev2024?.impactSummaryBn).toBeTruthy();
  });

  it("retrieves deep-learning forecast scenarios for selected mountain in forecast mode", () => {
    const forecastEvents = getEventsForMountain("ghagra", "forecast");
    expect(forecastEvents.length).toBeGreaterThan(0);
    const fc = forecastEvents[0];
    expect(fc.mode).toBe("forecast");
    expect(fc.affectedSlopeAreaDecimal).toBe(146.1);
    expect(fc.modelConfidenceScore).toBe(90);
  });

  it("resets/updates event list when mountain changes", () => {
    const ghagraEvents = getEventsForMountain("ghagra", "recorded");
    const furamonEvents = getEventsForMountain("furamon", "recorded");
    expect(ghagraEvents).not.toEqual(furamonEvents);

    const defaultGhagra = getDefaultEventForMountain("ghagra", "recorded");
    expect(defaultGhagra?.hillId).toBe("ghagra");

    const defaultFuramon = getDefaultEventForMountain("furamon", "recorded");
    expect(defaultFuramon?.hillId).toBe("furamon");
  });

  it("retrieves event by unique event ID", () => {
    const event = getLandslideEventById("ev_ghagra_2024");
    expect(event).toBeDefined();
    expect(event?.year).toBe(2024);
    expect(event?.locationBn).toContain("কাউখালী");
  });

  it("getOptions returns landslide event options sorted newest first for step 'event'", async () => {
    const recordedOpts = await getOptions("landslide", "recorded", "event", { h: "ghagra" });
    expect(recordedOpts.length).toBe(2);
    // Ghagra recorded events: 2024, 2017 (newest first)
    expect(recordedOpts[0].id).toBe("ev_ghagra_2024");
    expect(recordedOpts[1].id).toBe("ev_ghagra_2017");
    expect(recordedOpts[0].sublabel).toBe("১৮-২০ জুন ২০২৪");

    const forecastOpts = await getOptions("landslide", "forecast", "event", { h: "ghagra" });
    expect(forecastOpts.length).toBe(1);
    expect(forecastOpts[0].id).toBe("ev_ghagra_fc_2025");
  });

  it("returns empty options array for hills without recorded events", async () => {
    const noEventHills = ["mirinja", "keokradong", "teknaf_ridge", "inani_range", "jaflong_hill"];
    for (const hillId of noEventHills) {
      const recorded = getEventsForMountain(hillId, "recorded");
      expect(recorded.length).toBe(0);

      const opts = await getOptions("landslide", "recorded", "event", { h: hillId });
      expect(opts).toEqual([]);
    }
  });

  it("confirms landslide detail page has exactly one selector chain and no MountainEventSelector duplicate", () => {
    const detailPagePath = path.resolve(process.cwd(), "app/landslide/[mode]/page.tsx");
    const pageContent = fs.readFileSync(detailPagePath, "utf-8");

    // Must NOT contain MountainEventSelector import or element
    expect(pageContent).not.toContain("MountainEventSelector");

    // Must contain SelectorChain
    expect(pageContent).toContain("<SelectorChain");

    // Only 1 SelectorChain occurrence
    const selectorMatches = pageContent.match(/<SelectorChain/g);
    expect(selectorMatches?.length).toBe(1);
  });

  it("verifies 4-step chain configuration in SelectorChain", () => {
    const chainPath = path.resolve(process.cwd(), "components/SelectorChain.tsx");
    const chainContent = fs.readFileSync(chainPath, "utf-8");

    // Contains landslide 4-step chain with stepName "event"
    expect(chainContent).toContain('stepName: "event"');
    expect(chainContent).toContain("ভূমিধসের ঘটনা");
    expect(chainContent).toContain("ঘটনা নির্বাচন করুন");
    expect(chainContent).toContain("এই পাহাড়ে কোনো ভূমিধসের ঘটনা রেকর্ড নেই");
  });

  it("verifies landing page app/landslide/page.tsx has no MountainEventSelector duplicate", () => {
    const landingPagePath = path.resolve(process.cwd(), "app/landslide/page.tsx");
    const landingContent = fs.readFileSync(landingPagePath, "utf-8");

    expect(landingContent).not.toContain("MountainEventSelector");
  });

  it("verifies other hazard selector chains remain untouched with their standard steps", () => {
    const chainPath = path.resolve(process.cwd(), "components/SelectorChain.tsx");
    const chainContent = fs.readFileSync(chainPath, "utf-8");

    // River erosion, flood, char, and coastal configurations
    expect(chainContent).toContain('case "river_erosion":');
    expect(chainContent).toContain('case "flood":');
    expect(chainContent).toContain('case "char":');
    expect(chainContent).toContain('case "coastal":');
    expect(chainContent).toContain('case "landslide":');
  });

  it("verifies cascading clearance of event in useSelection when changing d, u, or h", () => {
    const useSelectionPath = path.resolve(process.cwd(), "lib/useSelection.ts");
    const code = fs.readFileSync(useSelectionPath, "utf-8");

    // Check that setting 'd' deletes 'ev'
    expect(code).toContain('params.delete("ev");');
    // Check auto-selection of newest event
    expect(code).toContain("newestEventId = sorted[0].id");
    // Check empty-state ev deletion for hills with 0 events
    expect(code).toContain('params.delete("ev");');
  });
});
