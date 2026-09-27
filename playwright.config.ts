import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        // The app picks its language from the browser; tests use the English UI
        locale: 'en-US',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
        command: 'npm run dev',
        port: PORT,
        reuseExistingServer: !process.env.CI,
    },
});
