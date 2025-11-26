// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // NOTE: For use React Components

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  devToolbar: {
      enabled: false,
  },

  adapter: node({
    mode: 'standalone',
  }),
});