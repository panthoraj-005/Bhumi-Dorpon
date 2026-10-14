import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        launchOptions: {
          args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--no-sandbox",
          ],
        },
      },
    },
  ],
});
