# AfriVue Info — website

*Many voices. One wider perspective.*

An independent, Africa-centred news platform covering Chad, the Sahel and the continent.
Available in **العربية (full RTL) · English · Français · Türkçe**.

> **Demonstration edition.** Every story, quote, chart and contributor profile here is **sample content**, and is labelled as such on the site. None of it is published reporting. Replace it before launch, and set `SITE.demo = false` in `src/data.ts` to remove the notices.

## Run

```bash
cd afrivue-info
npm install
npm run dev       # http://localhost:3001
npm run build     # static site in dist/ — deploy to any static host
```

## Structure

| Area | Route | Highlights |
|---|---|---|
| Home | `#/en/` | Lead story; secondary stories; numbered **The latest** column with timestamps; **Chad Now** (filtered by topic); **Analysis & Opinion** on navy with contributor portraits; **Africa Today** (regional filter); **Special Reports**; **Watch & Listen** (video, interview, podcast, photo); topic blocks; reserved social-embed slots |
| Chad | `#/en/chad` | Topic filter |
| Africa | `#/en/africa`, `#/en/africa/sahel` | North / West / Sahel / Central / East / Southern |
| Topics | `#/en/politics` … `/technology` | Chad / Africa scope filter |
| Analysis | `#/en/analysis` | Analysis · Opinion · Explainer · Background, contributor strip |
| In Depth | `#/en/in-depth` | Long-form special reports |
| Video | `#/en/video` | Media modal (YouTube embed when `youtubeId` is set) |
| Article | `#/en/article/<slug>` | Breadcrumb, kicker, headline, sub-headline, author portrait, published and updated dates, reading time, progress bar, captioned lead image with credit, sticky share rail (X, Facebook, WhatsApp, LinkedIn, copy link), table of contents, pull quotes, inline figures and charts, **Why this matters**, author bio, Read next, Related |
| Author | `#/en/author/<id>` | Bio and articles |
| About | `#/en/about` (`#team`, `#contact`) | Mission, principles, team, contact form |
| Policies | `#/en/page/corrections` · `privacy` · `terms` | Templates to review before launch |

Global elements:
- **Utility bar:** demo notice, social links (X, Facebook, Instagram, YouTube, LinkedIn), newsletter link, **AR / EN / FR / TR**, and dark mode.
- **Masthead:** tagline and date on the left, logo centred, search and Subscribe on the right.
- **Navigation:** a sticky 12-item bar.
- **Breaking ticker:** calm, one headline at a time, with pause, previous and next controls.
- **Search:** press `/`.
- **Mobile:** a drawer menu that opens from the right in Arabic.
- **Newsletter:** "Africa, seen closer."
- **Footer:** a navy footer.

Switching language keeps the reader on the same page. Old URLs `#/…/sahel` and `#/…/videos` redirect automatically.

## Design system

- **Colours:** Deep Navy `#0B2545` for authority. Emerald `#03A677` for accents, active states and the logo V; it darkens to `#027A57` for text on light backgrounds. Terracotta is used only for the breaking label. The background is warm off-white `#F8F6F1`.
- **Type:**
  - **Source Serif 4** for headlines and article text.
  - **Poppins** for the interface, labels and the logo.
  - **Cairo** for Arabic headlines and interface text, and **Noto Naskh Arabic** for Arabic long-form reading.
- **Motion:** gentle headline underline, a 3% image zoom, fade-ins and a sticky-nav shadow. All motion is turned off for users who set reduced motion.
- **Where to find things:**
  - Design tokens: `src/index.css`.
  - Reusable components (logo, cards, kicker, byline, avatar, chips, media card, social links, share buttons): `src/components/ui.tsx`.
  - Site chrome: `src/components/layout.tsx`.

## Editing content

- **Stories:** `src/articles.ts`. Each story is translated into all 4 languages. A story's body is a list of blocks:
  - a plain string (a paragraph)
  - `{ h }` (a heading)
  - `{ quote, cite }`
  - `{ figure, caption }`
  - `{ chart }`
  
  An optional `why` list renders the **Why this matters** box. A table of contents appears automatically when a story has 3 or more headings.
- **Photos:** add `image: { src, credit }` to a story to replace the generated illustration.
- **Contributors, multimedia, contact email, social URLs:** `src/data.ts` (`AUTHORS`, `MEDIA`, `SITE`).
- **Interface text and policy pages:** `src/i18n.tsx`.
- **Forms:** the newsletter and contact forms only validate in the browser. Connect them to a provider (see the `TODO`s).

## SEO & accessibility

- The page title, description and Open Graph tags change for each page and language.
- Articles include `NewsArticle` / `AnalysisNewsArticle` structured data (JSON-LD); other pages describe the organisation.
- The page uses semantic landmarks, includes a skip link, and supports focus-visible styles, Esc to close dialogs and full keyboard navigation.
- The site uses hash routing so it works on any static host. For per-language indexing (hreflang), move to path-based routes on a server or a static-site generator.
