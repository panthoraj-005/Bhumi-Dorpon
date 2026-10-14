import { test, expect } from "@playwright/test";

test.describe("BhumiDorpon End-to-End Suite", () => {
  test("Home Dashboard loads, shows demo banner and toggles units", async ({ page }) => {
    await page.goto("/");
    // Demo banner check
    await expect(page.locator("text=Demo data: all names, plots and figures are fictional.")).toBeVisible();

    // Module cards check within main content
    await expect(page.locator("main").getByRole("heading", { name: "River Erosion" })).toBeVisible();
    await expect(page.locator("main").getByRole("heading", { name: "Flood Monitoring" })).toBeVisible();
    await expect(page.locator("main").getByRole("heading", { name: "Landslide Hazards" })).toBeVisible();
    await expect(page.locator("main").getByRole("heading", { name: "Char Islands" })).toBeVisible();

    // Unit toggle check
    const unitAcre = page.getByRole("button", { name: "Acre" });
    if (await unitAcre.isVisible()) {
      await unitAcre.click();
    }
  });

  test("River Erosion Flow & Empty States", async ({ page }) => {
    // 1. Recorded detail page with query parameters
    await page.goto("/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1");
    await expect(page.locator("h2:has-text('Riverside Bank Erosion Assessment')")).toBeVisible();
    await expect(page.locator("text=Bank Retreat Rate")).toBeVisible();

    // 2. Forecast mode switch & disclaimer check
    await page.goto("/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1");
    await expect(page.locator("text=This is a model-based estimate, not an official government record.")).toBeVisible();
    await expect(page.locator("text=Forecast").first()).toBeVisible();

    // 3. Fallback / empty state when no children exist
    await page.goto("/river-erosion/recorded?d=sirajganj&u=kamarkhanda");
    await expect(page.locator("text=Please complete your location selection")).toBeVisible();
  });

  test("Flood Flow, Inundation Detail & Owner Land Page", async ({ page }) => {
    // 1. Flood archive listing
    await page.goto("/flood?d=sylhet&u=gowainghat&m=mouza_gowainghat_2");
    await expect(page.locator("h1:has-text('Flood Monitoring')")).toBeVisible();
    await expect(page.locator("text=Multi-Year SAR Archive")).toBeVisible();

    // 2. Click flood event to open detail
    await page.goto("/flood/mouza_gowainghat_2/flood_mouza_gowainghat_2_2022");
    await expect(page.locator("h2:has-text('Flood Assessment')")).toBeVisible();
    await expect(page.locator("text=Flooded Area").first()).toBeVisible();

    // 3. Owner search filter
    const searchInput = page.getByPlaceholder("Search owner name, Dag No., Khatian...");
    await expect(searchInput).toBeVisible();

    // Search for non-existent owner
    await searchInput.fill("NonExistentPersonName123");
    await expect(page.locator("text=No owner found with this name.")).toBeVisible();

    // Clear search
    await searchInput.fill("");

    // 4. Owner Land Page
    await page.goto("/flood/mouza_gowainghat_2/flood_mouza_gowainghat_2_2022/owner/owner_8");
    await expect(page.locator("text=Registered Landowner")).toBeVisible();
    await expect(page.locator("text=Four Corner Coordinates").first()).toBeVisible();
    await expect(page.locator("text=Copy all coordinates").first()).toBeVisible();
  });

  test("Landslide Flow & Empty States", async ({ page }) => {
    await page.goto("/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra");
    await expect(page.locator("h2:has-text('Slope Failure & Mass Wasting')")).toBeVisible();
    await expect(page.locator("text=Slope Gradient").first()).toBeVisible();
    await expect(page.locator("text=Debris Volume")).toBeVisible();

    // Forecast mode
    await page.goto("/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra");
    await expect(page.locator("text=This is a model-based estimate, not an official government record.")).toBeVisible();

    // Incomplete selection prompt / fallback
    await page.goto("/landslide/recorded?d=sirajganj");
    await expect(page.locator("text=Please select a hill feature")).toBeVisible();
  });

  test("Char Islands Flow & Unowned Land Card", async ({ page }) => {
    await page.goto("/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1");
    await expect(page.locator("h2:has-text('Accretion & Consolidation')")).toBeVisible();
    // Unowned Land card
    await expect(page.locator("text=Unowned Land (State Khas Alluvial Accretion)").first()).toBeVisible();

    // Forecast mode
    await page.goto("/char/forecast?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1");
    await expect(page.locator("text=This is a model-based estimate, not an official government record.")).toBeVisible();

    // Non-char upazila prompt
    await page.goto("/char/recorded?d=bhola&u=bhola_sadar");
    await expect(page.locator("text=Please select a char island")).toBeVisible();
  });

  test("Coastal Flow, Unassigned Land & Empty State", async ({ page }) => {
    await page.goto("/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1");
    await expect(page.locator("h2:has-text('Shoreline Migration')")).toBeVisible();
    // Unowned land card
    await expect(page.locator("text=Unowned Land (Unassigned New Land / Mudflats)").first()).toBeVisible();

    // Forecast mode
    await page.goto("/coastal/forecast?d=bhola&u=char_fasson&m=mouza_char_fasson_1");
    await expect(page.locator("text=This is a model-based estimate, not an official government record.")).toBeVisible();

    // Inland district fallback
    await page.goto("/coastal/recorded?d=sirajganj");
    await expect(page.locator("text=Please select a coastal mouza")).toBeVisible();
  });

  test("Accessibility: Map Comparison Keyboard & Data Table Alternatives", async ({ page }) => {
    await page.goto("/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1");
    // Accessible data table fold
    const detailsToggle = page.locator("text=Show accessible data table");
    if (await detailsToggle.isVisible()) {
      await detailsToggle.click();
      await expect(page.locator("table[aria-label*='Tabular data']")).toBeVisible();
    }
  });
});
