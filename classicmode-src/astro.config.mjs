// @ts-check
import { defineConfig } from 'astro/config';

import simpleStackQuery from 'simple-stack-query';

// https://astro.build/config
export default defineConfig({
  integrations: [simpleStackQuery()],
site: 'https://www.patcanella.com',
  base: '/classic',          // important for asset & link URLs
  outDir: '../classicmode',    // build *into the repo root/classicmode*
  build: {
    assets: 'classic-assets'     // 👈 NOT '_astro' — no leading underscore
  }
});