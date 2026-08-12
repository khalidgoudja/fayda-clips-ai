# Book Whispers — Design System (Commerce Surfaces)

Companion to [`../REQUIREMENTS.md`](../REQUIREMENTS.md) §11.1. The commerce layer does not get its own visual
language — it inherits the editorial one. This document is the single source of truth for tokens, type, grid,
motion and component behaviour across storefront, checkout, account, reader, admin and vendor portal.

## 1. Design principles

1. **The interface disappears behind the book.** Chrome is achromatic so no cover ever fights the UI.
2. **One accent, used for truth.** Terracotta signals action and live state — price deltas, CTAs, stock. Never decoration.
3. **Whitespace is the layout.** Rhythm and hairlines replace boxes, borders and shadows.
4. **Motion is feedback.** ≤ 200 ms, opacity and small translation only. If it can't be justified as feedback, it's removed.
5. **Density where the reader compares.** Editorial airiness on discovery; Amazon-grade information density on the PDP spec table, cart and account.
6. **Every state is designed.** Loading, empty, error, offline, RTL and reduced-motion are part of the component, not an afterthought.

## 2. Tokens

Tokens are the only styling primitive. Raw hex, raw px spacing, and ad-hoc durations fail CI lint (EC-11.1-1).

### 2.1 Colour — light (Paper)

| Token | Value | Use |
| --- | --- | --- |
| `--bw-canvas` | `#F4F0E9` | Page background (warm paper, from the brand mark) |
| `--bw-surface` | `#FBF9F5` | Cards, sheets, modals |
| `--bw-surface-sunken` | `#EBE5DB` | Wells, inactive tabs, skeletons |
| `--bw-ink` | `#141210` | Primary text, brand mark |
| `--bw-ink-secondary` | `#4A443E` | Secondary text, metadata (7.1:1 on canvas) |
| `--bw-ink-muted` | `#6E665E` | Tertiary, captions (4.6:1 on canvas) |
| `--bw-hairline` | `rgb(20 18 16 / 0.12)` | Dividers — 1 px, never a box |
| `--bw-accent` | `#C0523C` | CTA, price delta, live state |
| `--bw-accent-hover` | `#A8442F` | Hover/active |
| `--bw-accent-subtle` | `#F6E7E1` | Accent wash backgrounds |
| `--bw-success` | `#2F6B4F` | In stock, delivered |
| `--bw-warning` | `#8A6212` | Low stock, backorder |
| `--bw-danger` | `#A3321F` | Errors, declines, out of stock |
| `--bw-focus` | `#C0523C` | Focus ring (2 px, 2 px offset) |

### 2.2 Colour — dark (Night)

| Token | Value |
| --- | --- |
| `--bw-canvas` | `#121110` |
| `--bw-surface` | `#1B1917` |
| `--bw-surface-sunken` | `#242120` |
| `--bw-ink` | `#F2EDE5` |
| `--bw-ink-secondary` | `#C3BBB1` |
| `--bw-ink-muted` | `#948B81` |
| `--bw-hairline` | `rgb(242 237 229 / 0.14)` |
| `--bw-accent` | `#E0765C` |
| `--bw-accent-hover` | `#EE8B72` |
| `--bw-accent-subtle` | `#33211C` |
| `--bw-success` | `#5FA37F` · `--bw-warning` `#D8A548` · `--bw-danger` `#E5715C` |

Reader adds two book-only themes on top of Paper/Night: **Sepia** (`#F1E4CE` canvas, `#3A2F22` ink) and
**High Contrast** (`#FFFFFF`/`#000000`), per EC-11.5-14.

Contrast pairings are asserted in CI against this matrix (EC-11.1-2). Dark mode is a token swap only — no
component may branch on theme in its logic.

### 2.3 Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display / editorial | **Newsreader** (serif) | Book titles, quotes, section headers, PDP hero |
| UI / data | **Inter** (geometric-leaning sans) | Buttons, forms, tables, prices, admin |
| Brand lockup | **Jost** | Matches the wordmark; used only in the logo and masthead |
| Arabic | **IBM Plex Sans Arabic** + **Noto Naskh Arabic** (long-form) | Line height +0.15 vs Latin (EC-11.9-15) |
| Mono | **JetBrains Mono** | ISBNs, SKUs, order numbers, admin identifiers |

Scale (1.25 major third, 16 px base, fluid via `clamp()`):

| Token | Size / line height | Use |
| --- | --- | --- |
| `--bw-text-display` | 48–72 / 1.05 | Store hero, PDP title |
| `--bw-text-h1` | 36–44 / 1.15 | Page titles |
| `--bw-text-h2` | 28–32 / 1.2 | Module headers |
| `--bw-text-h3` | 22–24 / 1.3 | Card titles, panel headers |
| `--bw-text-body-lg` | 18 / 1.6 | Descriptions, editorial body |
| `--bw-text-body` | 16 / 1.55 | Default UI |
| `--bw-text-sm` | 14 / 1.45 | Metadata, helper text |
| `--bw-text-xs` | 12 / 1.4 | Badges, legal, table captions |

Rules: measure 60–75 characters for long-form; tabular numerals (`font-variant-numeric: tabular-nums`) for all
prices, quantities and totals; titles never fully uppercase; fonts subset per locale and preloaded `woff2` for
the LCP text only.

### 2.4 Space, radius, elevation, layout

- **Space** on an 8 pt base: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128` → `--bw-space-{1..10}`.
- **Radius**: `--bw-radius-sm 4px`, `-md 8px`, `-lg 12px`, `-full 999px`. Covers render square — a book has corners.
- **Elevation**: three levels only, all low-alpha and diffuse (`0 1px 2px`, `0 4px 16px`, `0 12px 32px` at ≤ 10 % ink). Modals and the sticky bar are the only level-3 surfaces.
- **Grid**: 12 columns; gutters 24 px (< 768 px) / 32 px / 40 px; max content width 1280 px, editorial reading column 720 px.
- **Breakpoints**: `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

### 2.5 Motion

| Token | Value | Use |
| --- | --- | --- |
| `--bw-duration-fast` | 120 ms | Hover, focus, toggle |
| `--bw-duration-base` | 180 ms | Card lift, dropdown, toast |
| `--bw-duration-slow` | 240 ms | Modal, drawer, sticky bar entry |
| `--bw-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entry |
| `--bw-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Movement |

Permitted properties: `opacity`, `transform` (≤ 8 px translate, ≤ 1.02 scale). Forbidden: bounce, spring
overshoot, parallax, scroll-jacking, auto-rotating carousels. All motion collapses to instant under
`prefers-reduced-motion: reduce` (EC-11.1-3).

## 3. Component inventory

| Component | Key behaviour | Requirement |
| --- | --- | --- |
| `ProductCard` | Server component; only quick actions hydrate. Cover, title, authors, rating, price block, availability, badges. | EC-11.2-6…18 |
| `PriceBlock` | Current price, strikethrough compare-at, savings badge, currency-synced, tabular numerals. Suppresses the badge where reference-price rules are unmet. | EC-11.2-9/10/11 |
| `AvailabilityPill` | In Stock / Low Stock ("3 left") / Backorder / Pre-order / Out of Stock / Digital. Colour + text + icon — never colour alone. | EC-11.2-12/13 |
| `QuickViewModal` | Deep-linkable, focus-trapped, `Esc` closes, focus restored, gallery + format switch + ATC. | EC-11.2-14 |
| `AddToCartButton` | Optimistic with rollback and inline error; disabled state explains why. | EC-11.2-15 |
| `WishlistToggle` | Optimistic; anonymous list merges on sign-in. | EC-11.2-16 |
| `CoverGallery` | Thumbnails, swipe, zoom lens on intent, 3D toggle when asset exists. High-res loads only on zoom. | EC-11.3-1/2/3 |
| `FormatSwitcher` | Swaps price/availability/ISBN/CTA without page load; updates URL. | EC-11.3-5 |
| `SpecTable` | Dense metadata table; mono for identifiers; bidi-isolated in RTL. | EC-11.3-4 |
| `AuthorWidget` | Bio, portrait, verified links, "More by this Author" rail. | EC-11.3-7 |
| `QuoteStrip` | "Inside the Book" quotes linking to the Quotes domain. | EC-11.3-9 |
| `ExcerptReader` | Reader engine, excerpt-scoped, no download, no full manifest. | EC-11.3-10/11 |
| `RatingSummary` | Histogram bars from the materialised aggregate; filter chips. | EC-11.3-12/13 |
| `StickyBuyBar` | Appears past the buy box; safe-area aware; single row < 480 px. | EC-11.3-17…21 |
| `CartLine` | Debounced quantity, clamp explanation, soft-delete with 10 s undo, save-for-later. | EC-11.4-1/2/3 |
| `TotalsPanel` | Itemised subtotal, discounts, shipping, tax, grand total; always fully broken down. | EC-11.4-11 |
| `CheckoutStepper` | Server-rendered addressable steps; resumable; wallet buttons first. | EC-11.4-13…26 |
| `AddressForm` | Locale-aware field order, labels and validation; autocomplete with "use as entered". | EC-11.4-23/25 |
| `OrderTimeline` | Canonical shipment states, per-shipment for split orders, live carrier events. | EC-11.5-1, EC-11.9-2 |
| `ReaderShell` | Scroll/paginated modes, typography panel, themes, TOC/bookmarks/notes panel, offline indicator. | EC-11.5-9…16 |
| `HighlightLayer` | CFI-anchored selection, colour picker, note editor, share-as-quote. | EC-11.5-11/12 |
| `SearchOverlay` | Grouped instant suggestions, keyboard nav, recent/trending, zero-result recovery. | EC-11.7-3/6 |
| `FacetPanel` | Multi-select facets with counts, URL-encoded state, mobile bottom-sheet. | EC-11.7-2, EC-11.2-19 |
| `CurrencySelector` | Server re-resolves visible prices; persists to cookie + account. | EC-11.2-11, EC-11.9-11 |
| `LocaleSwitcher` | Path-prefixed locales, sets `dir`, preserves the current route. | EC-11.9-16 |

Every component ships with: default, hover, focus-visible, active, disabled, loading (skeleton), empty, error,
RTL and dark-theme states, plus a Storybook entry used by the visual-regression suite.

## 4. Accessibility rules (release gate — EC-11.10-7)

- WCAG 2.2 AA for storefront, checkout, account and reader.
- Keyboard operability for every control; visible 2 px focus ring at 2 px offset; logical tab order; skip links.
- Dialogs trap focus, close on `Esc`, and restore focus to the invoker.
- Live regions announce cart changes, stock changes, form errors and sync status.
- Status is never conveyed by colour alone — icon and text accompany every state.
- Images: meaningful `alt` (`"{title} by {authors} — cover"`), decorative art marked `aria-hidden`.
- Forms: programmatic labels, inline errors tied by `aria-describedby`, no placeholder-as-label.
- Touch targets ≥ 44 × 44 px; no hover-only affordances.
- Reader exposes the book as structured reading content with heading landmarks and reading-order semantics.
- CI runs axe on every route; each release adds a manual keyboard + screen-reader pass.

## 5. RTL & localization rules (release gate — EC-11.9-14)

- Layout uses **CSS logical properties** exclusively (`margin-inline-start`, `padding-block`, `inset-inline-end`);
  `left`/`right` in component CSS fails lint.
- `dir="rtl"` set at the document root from the locale; no `[dir]`-specific stylesheets.
- Directional icons (back/forward, carousel arrows, progress) mirror; non-directional icons (search, cart, star)
  never mirror.
- Mixed-direction strings (ISBNs, prices, SKUs inside Arabic sentences) are wrapped in bidi isolation
  (`<bdi>` / `unicode-bidi: isolate`).
- Carousels, steppers, sliders and progress bars advance in the reading direction.
- Copy uses ICU MessageFormat with plurals and gendered forms — never concatenated fragments.
- Layouts are tested at +40 % string length (German/French expansion) with no truncation or overflow.
- Numbers, dates, currency and addresses format via `Intl` per locale, server-rendered to avoid hydration
  mismatch.

## 6. Content & voice

- Product copy is editorial, never salesy. Scarcity is stated as fact ("3 left"), never manufactured.
- Errors say what happened, why, and the next action — in the user's language, mapped from a stable code.
- Prices always show currency; totals always show the full breakdown before any commitment.
- The word "buy" appears on the button; the page never nags. No countdown timers, no exit-intent interstitials,
  no dark patterns of any kind — including pre-checked add-ons and disguised subscription opt-ins.
