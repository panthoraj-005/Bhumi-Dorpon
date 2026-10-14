const { chromium } = require("playwright");
const path = require("path");

const artifactDir = "C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\299a763c-b2fd-4a48-b21b-e93f7ef531dc";

const VIEWS = [
  { name: "dashboard_preview.png", url: "http://localhost:3000/" },
  { name: "river_erosion_recorded.png", url: "http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1" },
  { name: "river_erosion_forecast.png", url: "http://localhost:3000/river-erosion/forecast?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1" },
  { name: "flood_recorded.png", url: "http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025" },
  { name: "landslide_recorded.png", url: "http://localhost:3000/landslide/recorded?d=rangamati&u=kawkhali&h=ghagra" },
  { name: "landslide_forecast.png", url: "http://localhost:3000/landslide/forecast?d=rangamati&u=kawkhali&h=ghagra" },
  { name: "char_recorded.png", url: "http://localhost:3000/char/recorded?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1" },
  { name: "char_forecast.png", url: "http://localhost:3000/char/forecast?d=sirajganj&u=kazipur&r=jamuna&m=char_kazipur_1" },
  { name: "coastal_recorded.png", url: "http://localhost:3000/coastal/recorded?d=bhola&u=char_fasson&m=mouza_char_fasson_1" },
  { name: "coastal_forecast.png", url: "http://localhost:3000/coastal/forecast?d=bhola&u=char_fasson&m=mouza_char_fasson_1" },
  { name: "flood_owner_page.png", url: "http://localhost:3000/flood/mouza_kazipur_1/flood_mouza_kazipur_1_2025/owner/owner_35" },
];

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const item of VIEWS) {
    console.log(`Capturing ${item.name}...`);
    await page.goto(item.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000); // Allow Leaflet to render tiles/vectors
    const targetPath = path.join(artifactDir, item.name);
    await page.screenshot({ path: targetPath, fullPage: false });
    console.log(`Saved ${targetPath}`);
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
