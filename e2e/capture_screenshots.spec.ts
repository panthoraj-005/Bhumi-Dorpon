import { test } from "@playwright/test";
import path from "path";

const artifactDir = "C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\299a763c-b2fd-4a48-b21b-e93f7ef531dc";

const VIEWS = [
  { name: "dashboard_preview.png", url: "/" },
  { name: "river_erosion_recorded.png", url: "/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1" },
  { name: "river_erosion_forecast.png", url: "/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1" },
  { name: "flood_recorded.png", url: "/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025" },
  { name: "landslide_recorded.png", url: "/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra" },
  { name: "landslide_forecast.png", url: "/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra" },
  { name: "char_recorded.png", url: "/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1" },
  { name: "char_forecast.png", url: "/char/forecast?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1" },
  { name: "coastal_recorded.png", url: "/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1" },
  { name: "coastal_forecast.png", url: "/coastal/forecast?d=bhola&u=char_fasson&m=mouza_char_fasson_1" },
  { name: "flood_owner_page.png", url: "/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_35" },
];

test("Capture all verification screenshots", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const item of VIEWS) {
    await page.goto(item.url);
    await page.waitForTimeout(1200); // Allow Leaflet SVGs to settle
    const savePath = path.join(artifactDir, item.name);
    await page.screenshot({ path: savePath, fullPage: false });
    console.log(`Saved screenshot: ${item.name}`);
  }
});
