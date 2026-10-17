import {defineConfig,devices} from '@playwright/test';
/** Run after `GITHUB_PAGES=true npm run build` to verify the actual base path. */
export default defineConfig({
 testDir:'./e2e',testMatch:'production.spec.ts',timeout:30000,retries:1,workers:1,
 use:{baseURL:'http://127.0.0.1:4174',...devices['Desktop Chrome'],trace:'retain-on-failure'},
 webServer:{command:'GITHUB_PAGES=true npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
  url:'http://127.0.0.1:4174/Code-Empire/',reuseExistingServer:!process.env.CI,timeout:120000}
});
