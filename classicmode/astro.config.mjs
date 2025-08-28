// @ts-check
import { defineConfig } from 'astro/config';

import simpleStackQuery from 'simple-stack-query';

// https://astro.build/config
export default defineConfig({
  integrations: [simpleStackQuery()]
});