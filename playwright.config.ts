import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const executablePath = existsSync(localChrome) ? localChrome : undefined
const portfolioKey = 'portfolio-e2e-1234567890abcdef'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3101',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  webServer: {
    command: 'pnpm build && pnpm start --hostname 127.0.0.1 --port 3101',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      PRIVATE_PORTFOLIO_SLUG: portfolioKey,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
