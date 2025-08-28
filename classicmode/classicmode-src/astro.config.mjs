// @ts-check
import { defineConfig } from 'astro/config';

import simpleStackQuery from 'simple-stack-query';

// https://astro.build/config
export default defineConfig({
  integrations: [simpleStackQuery()],
  site: 'https://pcanella.github.io',
  base: '/classicmode',          // important for asset & link URLs
  trailingSlash: 'always',       // optional but safe on GitHub Pages
  outDir: '../classicmode',    // build *into the repo root/classicmode*
  build: {
    assets: 'classic-assets'     // 👈 NOT '_astro' — no leading underscore
  }
});