import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export default defineConfig({
  testDir: './development/tests', testMatch: '**/*.spec.ts',
  outputDir: '.validation/test-results', reporter: [['list'], ['json', { outputFile: '.validation/browser-results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4317', viewport: { width: 1280, height: 900 },
    launchOptions: existsSync(edge) ? { executablePath: edge } : {} },
  webServer: { command: 'node development/serve-preview.mjs', url: 'http://127.0.0.1:4317', reuseExistingServer: false },
});
