import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", timeout: 60000, workers: 1,
  use: { baseURL: "http://localhost:3100", browserName: "chromium", headless: true, ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) },
  webServer: { command: "npm run start -- --port 3100", url: "http://localhost:3100", reuseExistingServer: !process.env.CI, timeout: 120000 },
});
