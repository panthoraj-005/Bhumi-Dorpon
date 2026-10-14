import { test, expect } from "@playwright/test";

const PART2_TEST_PAGES = [
  {
    hazard: "river_erosion",
    mode: "recorded",
    name: "River Erosion Recorded",
    url: "/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1",
    selectedMouzaName: "Kazipur",
  },
  {
    hazard: "river_erosion",
    mode: "forecast",
    name: "River Erosion Forecast",
    url: "/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1",
    selectedMouzaName: "Kazipur",
  },
  {
    hazard: "char",
    mode: "recorded",
    name: "Char Recorded",
    url: "/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1",
    selectedMouzaName: "Kazipur",
  },
  {
    hazard: "char",
    mode: "forecast",
    name: "Char Forecast",
    url: "/char/forecast?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1",
    selectedMouzaName: "Kazipur",
  },
  {
    hazard: "coastal",
    mode: "recorded",
    name: "Coastal Recorded",
    url: "/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1",
    selectedMouzaName: "Char Fasson",
  },
  {
    hazard: "coastal",
    mode: "forecast",
    name: "Coastal Forecast",
    url: "/coastal/forecast?d=bhola&u=char_fasson&m=mouza_char_fasson_1",
    selectedMouzaName: "Char Fasson",
  },
];

test.describe("PART 2: Light GIS Basemap and Rebuilt Maps Verification", () => {
  for (const pageConfig of PART2_TEST_PAGES) {
    test(`Detail page ${pageConfig.name} renders dual Leaflet containers, mouza labels, summary panel, and water status card`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(pageConfig.url, { waitUntil: "domcontentloaded" });

      // 1. Assert exactly two .leaflet-container elements exist
      const leafletContainers = page.locator(".leaflet-container");
      await expect(leafletContainers.first()).toBeVisible({ timeout: 15000 });
      const containerCount = await leafletContainers.count();
      expect(containerCount).toBe(2);

      // 2. Assert at least one mouza label exists
      const mouzaLabels = page.locator(".gis-mouza-label-marker");
      await expect(mouzaLabels.first()).toBeVisible({ timeout: 10000 });
      const labelCount = await mouzaLabels.count();
      expect(labelCount).toBeGreaterThanOrEqual(1);

      // 3. Assert the Mouza Summary Panel is present
      const summaryRows = page.locator("[data-mouza-id]");
      await expect(summaryRows.first()).toBeVisible({ timeout: 10000 });
      const rowCount = await summaryRows.count();
      expect(rowCount).toBeGreaterThanOrEqual(2);

      // 4. Assert the selected mouza is pinned on top (has pinned badge or is first row)
      const firstRow = summaryRows.first();
      await expect(firstRow).toBeVisible();
      const firstRowText = await firstRow.textContent();
      expect(firstRowText).toContain("PINNED");

      // 5. Assert the Water Status card is present
      const waterStatusCard = page.locator("text=Water Status");
      await expect(waterStatusCard.first()).toBeVisible();

      // In Forecast mode, assert the Projected badge is visible
      if (pageConfig.mode === "forecast") {
        const forecastBadge = page.locator("text=Projected").first();
        await expect(forecastBadge).toBeVisible();
      }

      // 6. Assert Swipe divider works and moves
      const slider = page.locator('[role="slider"][aria-label="Swipe comparison slider"]');
      await expect(slider).toBeVisible();
      const valInitial = Number(await slider.getAttribute("aria-valuenow"));
      expect(valInitial).toBe(50);

      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(100);
      const valNext = Number(await slider.getAttribute("aria-valuenow"));
      expect(valNext).toBe(55);

      // 7. Assert zero critical console errors
      const criticalErrors = consoleErrors.filter(
        (err) =>
          !err.includes("favicon") &&
          !err.includes("hydrat") &&
          !err.includes("status of 404")
      );
      expect(criticalErrors).toHaveLength(0);
    });
  }
});
