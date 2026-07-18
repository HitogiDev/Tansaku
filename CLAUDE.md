# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Tansaku is the marketing/landing website for a manga and anime-merch shop operating in San Pedro de Macorís and La Romana, Dominican Republic. It's a single-page Astro site, in Spanish, that sells merch (llaveros, pines, stickers) via WhatsApp ordering links, previews an upcoming physical-manga catalog, and collects email/WhatsApp signups through a Formspree form so people can vote on which manga series to stock next.

## Commands

```sh
npm install       # install dependencies
npm run dev       # dev server at localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview the production build locally
npm run astro ... # run Astro CLI commands (e.g. `npm run astro check`)
```

There is no test suite and no lint script configured. `npm run astro check` is the closest thing to a correctness check (type/template checking via `astro/tsconfigs/strict`).

Node >= 22.12.0 is required (see `engines` in `package.json`).

## Architecture

- **Astro 6** (static output) + **Tailwind CSS v4**, wired in via the `@tailwindcss/vite` plugin in `astro.config.mjs` (not the older Astro Tailwind integration). `src/styles/global.css` is just `@import "tailwindcss";`.
- **The entire site is one file: `src/pages/index.astro`.** It's a full standalone HTML document (own `<html>`/`<head>`/`<body>`, not composed from a layout) containing every section — hero, merch (with a "cómo comprar" steps strip), catalog, about, FAQ (`<details>` accordions, no JS), contact — plus a floating WhatsApp button and a large scoped `<style>` block (most of the file) and an inline `<script is:inline>` at the bottom for the dark/light theme toggle and the catalog-card shuffle. When editing styles or the theme/shuffle behavior, they live here, not in separate files.
- **`src/layouts/Layout.astro` and `src/components/Welcome.astro` are unused leftovers from `astro create`'s starter template.** Nothing imports them. Don't wire new pages through `Layout.astro` without checking whether `index.astro`'s inline document structure should be reused instead — the two approaches aren't currently consistent.
- **Manga catalog images are data-driven from the filesystem.** Drop a cover image into `src/assets/covers/` (`jpg`/`jpeg`/`png`/`webp`/`avif`) and it's automatically picked up via `import.meta.glob` in `index.astro` — no manual registration needed to make it appear. However, the human-readable title and genre come from the `mangaMetaBySlug` lookup object in `index.astro`, keyed by the lowercased filename (without extension). If a new cover's filename isn't in that map, it falls back to a title-cased version of the slug and a generic "Manga / Interés" genre — so add an entry there when adding a cover if you want a real title/genre. The catalog also client-side shuffles and shows a random 6 covers as "active" on each load (see the inline script).
- **WhatsApp is the checkout mechanism.** Merch "buy" buttons and the contact CTA are `wa.me/8098795559?text=...` links with pre-filled messages, not an actual cart/checkout flow. There's no backend.
- **The signup form posts to Formspree** (`https://formspree.io/f/xkoqvawb`) via plain HTML form POST — no client-side handling.
- **Theme toggle** is persisted to `localStorage` under the key `tansaku-theme` and applied via a `data-theme` attribute on `<html>`, set by the inline script (runs before hydration concerns apply since there's no framework runtime involved — this is a static/vanilla-JS site, no React/Vue/etc.).

## Deployment

- GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to **GitHub Pages** on every push to `main` or `master`, or via manual dispatch. It runs `npm ci && npm run build` and publishes `./dist`.
- Custom domain is `tansaku.site`, configured via `public/CNAME` and `site` in `astro.config.mjs` — keep these in sync if the domain ever changes.
