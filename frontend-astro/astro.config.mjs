// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // NOTE: For use React Components

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
});
