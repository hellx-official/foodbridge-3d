import { defineConfig } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: externalBaseURL ?? "http://127.0.0.1:3100",
    browserName: "chromium",
    launchOptions: {
      executablePath,
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run dev -- --hostname 0.0.0.0 --port 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
