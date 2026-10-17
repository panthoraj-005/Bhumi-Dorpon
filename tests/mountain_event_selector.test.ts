import { describe, it, expect } from "vitest";
import {
  getEventsForMountain,
  getLandslideEventById,
  getDefaultEventForMountain,
  LANDSLIDE_EVENTS,
} from "../lib/landslideEvents";
import { getHills } from "../lib/data";

describe("Landslide Mountain & Historical Event Selector Module", () => {
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
});
