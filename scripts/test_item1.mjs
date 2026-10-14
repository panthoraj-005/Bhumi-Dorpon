import { chromium } from "playwright";

async function test() {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--no-first-run",
      "--no-default-browser-check"
    ],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on("console", msg => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));

  await page.goto("http://localhost:3000/river-erosion/recorded?d=sirajganj&u=kazipur&r=jamuna&m=mouza_kazipur_1", {
    waitUntil: "networkidle",
  });
  
  console.log("Current URL:", page.url());
  const title = await page.title();
  console.log("Title:", title);
  
  const html = await page.content();
  console.log("HTML snippet:", html.slice(0, 500));
  
  const loading = await page.locator("text=Loading").count();
  console.log("Loading count:", loading);
  
  const errorText = await page.locator("text=Error").allInnerTexts();
  console.log("Error texts:", errorText);

  await browser.close();
}

test().catch(console.error);
