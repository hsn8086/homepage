// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://hsn8086.com",
  vite: {
      plugins: [tailwindcss()],
    },

  integrations: [vue(), sitemap()],
});