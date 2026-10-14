import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/Code-Empire/' : '/',
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
