# AfriVue Info — website

Multilingual news & analysis site for **AfriVue Info** (Chad · Sahel · Africa), built to the *AfriVue Info Brand Identity Guide v1.0*.

**Languages:** English · Français · Türkçe · العربية (full RTL layout with Cairo font)

## Run

```bash
cd afrivue-info
npm install
npm run dev       # http://localhost:3001
npm run build     # static site in dist/ — upload to any host (Netlify, GitHub Pages, cPanel…)
```

## What's inside

| Page | URL |
|---|---|
| Home — lead story, top stories, "Latest from Africa" grid with region filter, most read, analysis band, regions, videos, newsletter | `#/en/` |
| Chad / Sahel / Africa sections (filter news / analysis) | `#/fr/chad` |
| Analysis (long-form, filter by region) | `#/tr/analysis` |
| Videos (modal player, YouTube embed) | `#/ar/videos` |
| Article — reading progress bar, text-size control, share (X, Facebook, WhatsApp, Telegram, copy link), related stories | `#/en/article/<slug>` |
| About — mission, values, editorial desks, validated contact form | `#/en/about` |

UX features: language switcher in the top utility bar (choice is remembered, the browser language is detected on first visit, and switching keeps you on the same page), dark mode, search overlay (press `/`), sticky nav, live ticker, mobile drawer menu, back-to-top, skip link, keyboard and screen-reader support, `prefers-reduced-motion` support.

## Brand

**Logo:** an interlocking **AV** mark (navy A, emerald V `#03A677`) next to the "AfriVue" wordmark, with "INFO" letter-spaced underneath. It is built as a vector (`LogoMark` / `Logo` in `src/components/ui.tsx`). On dark backgrounds the navy parts turn white. Logo files are in `public/`: `logo-primary.svg`, `logo-reversed.svg`, `logo-mark.svg` and `favicon.svg`.

**Palette:** Deep Navy `#0B2545`, Sahel Gold `#C89B3C`, Terracotta `#B5502D`, Paper `#F7F4EF`, Ink `#1C1C1C`, Verified Green `#2F6D4F`. **Fonts:** Poppins, with Cairo for Arabic. These tokens are in `src/index.css`.

## Editing content

- **Articles & videos:** `src/data.ts`. Each item holds all 4 languages. To embed a real video, set `youtubeId`.
- **Interface text:** `src/i18n.tsx`.
- **Contact email & social links:** `SITE` in `src/data.ts` (placeholders for now).
- The article and video content in this repo is **sample placeholder content**. Replace it before going live.
- The cover images are generated in brand colours (`Cover` in `src/components/ui.tsx`). You can swap them for real photos.
- The newsletter and contact forms only validate in the browser for now. Connect them to a service such as Formspree, Mailchimp or Netlify Forms (see the `TODO` in `src/pages/Pages.tsx`).
