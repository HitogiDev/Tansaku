// @ts-check
// Build config for the admin panel (admin.tansaku.site).
// It's a separate static site from the public one: `npm run build:admin`
// outputs to ./dist-admin, which is deployed on its own (see ADMIN.md).
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://admin.tansaku.site',
  srcDir: './admin/src',
  publicDir: './admin/public',
  outDir: './dist-admin',
  vite: {
    plugins: [tailwindcss()],
  },
});
