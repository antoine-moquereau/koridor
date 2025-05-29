// @ts-check
import { defineConfig as defineE2EConfig, devices } from '@playwright/test';
import { defineConfig as defineCTConfig } from '@playwright/experimental-ct-svelte';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const e2eConfig = defineE2EConfig({
  testDir: './tests/e2e', // Directory for E2E tests
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-e2e',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox-e2e',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit-e2e',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Increase timeout for server start
  },
});

const ctConfig = defineCTConfig({
  testDir: './src', // Adjusted for component testing, assuming tests are co-located or within src
  /* Glob patterns or regular expressions that match test files. */
  testMatch: /.*\.ct\.(js|ts|svelte)$/,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,
    // Vite config for Svelte component testing
    ctViteConfig: {
      // You can specify custom Vite config here if needed
    }
  },
  projects: [
    {
      name: 'chromium-ct',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox-ct',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit-ct',
    //   use: { ...devices['Desktop Safari'] },
    // }
  ],
});

// Combine configs - typically you might run E2E and CT separately
// For this example, we'll merge them, but this might need adjustment based on how tests are run.
// A common practice is to have separate playwright.config.e2e.js and playwright.config.ct.js files.
// Or, use different project names and filter them in the test command.

// For simplicity, we'll export the E2E config by default.
// You can switch to ctConfig or a merged version as needed.
// To run component tests, you might use a command like: `npx playwright test -c playwright.config.js --project=chromium-ct`
// Or have two separate config files.

// This is a simplified merge. Proper merging might require deeper logic
// or separate config files.
export default {
  ...e2eConfig,
  // Override testDir for component tests if a specific project is not chosen
  // This part is tricky if not using separate configs or CLI project selection.
  // For now, let's assume CLI project selection will distinguish.
  // projects: [...(e2eConfig.projects || []), ...(ctConfig.projects || [])],
  // If you want to run both types of tests with one command without filtering,
  // you need to ensure testDirs/testMatches don't overlap or are correctly set per project.

  // For now, let's just export the E2E config and rely on CLI for choosing CT projects
  // or using a separate config file for CT if that's preferred.
  // If we want both in one config, we need to be careful about testDir / testMatch at the top level vs project level.

  // Let's adjust to have a single config file that can run both,
  // using project names to differentiate.
  // The top-level testDir will be for E2E. Component tests will use their own testMatch.
  testDir: e2eConfig.testDir, // E2E test directory
  projects: [
    ...(e2eConfig.projects || []),
    // Define component test project
    {
      name: 'svelte-component-tests',
      testDir: ctConfig.testDir, // Source directory for CT
      testMatch: ctConfig.testMatch, // Pattern for CT files
      use: { // Specific settings for CT project
        ...ctConfig.use,
        ctViteConfig: {
          // Ensure svelte specific vite plugins are loaded if not handled by ctSvelteVersion
        }
      },
      // If your Svelte components need specific setup for testing, like a test harness or global mocks,
      // you can configure it here or in a test setup file.
    }
  ],
  webServer: e2eConfig.webServer, // webServer is for E2E
  // Other shared settings from e2eConfig
  fullyParallel: e2eConfig.fullyParallel,
  forbidOnly: e2eConfig.forbidOnly,
  retries: e2eConfig.retries,
  workers: e2eConfig.workers,
  reporter: e2eConfig.reporter,
  use: e2eConfig.use, // Global use, ct project will override as needed
};
