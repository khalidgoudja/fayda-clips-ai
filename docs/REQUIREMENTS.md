# Book Whispers — Platform Requirement Document

| Field | Value |
| --- | --- |
| Document | Book Whispers Platform Requirements |
| Version | 1.1 |
| Status | Draft for architecture review |
| Owners | Principal Software Architect · Lead UI/UX Designer |
| Revision | Adds Section 11 — Enterprise E-Commerce Engine & Digital Publishing Architecture |

## Table of Contents

| § | Title | Status |
| --- | --- | --- |
| 1 | Product Vision & Positioning | Reserved |
| 2 | Personas & Journey Maps | Reserved |
| 3 | Content Domain — Blog & Editorial | Reserved |
| 4 | Content Domain — Quotes Engine | Reserved |
| 5 | Content Domain — Reviews & Ratings | Reserved |
| 6 | Identity, Accounts & Authorization | Reserved |
| 7 | Content Management & Editorial Workflow | Reserved |
| 8 | Notification & Engagement Layer | Reserved |
| 9 | Analytics, Telemetry & Experimentation | Reserved |
| 10 | Platform Infrastructure & DevOps Baseline | Reserved |
| **11** | **Enterprise E-Commerce Engine & Digital Publishing Architecture** | **Specified — this revision** |

> Sections 1–10 are reserved placeholders. Section 11 is written to be self-contained: where it depends on
> an upstream section it names the contract it expects rather than assuming an implementation.

### Companion documents

| Document | Contents |
| --- | --- |
| [`architecture/data-model.md`](architecture/data-model.md) | Domain entities, ERD, table definitions, indexing and partitioning strategy |
| [`architecture/api-contracts.md`](architecture/api-contracts.md) | Storefront, checkout, reader, admin and vendor API surfaces; webhook and event contracts |
| [`design/design-system.md`](design/design-system.md) | Design tokens, type scale, grid, motion, component inventory, accessibility and RTL rules |

### Conventions

- Requirements are identified as `EC-<subsection>-<n>` and are testable statements.
- **MUST** / **SHOULD** / **MAY** follow RFC 2119.
- Every requirement carries an acceptance criterion or points at the subsection's acceptance table.

---

# Section 11: Enterprise E-Commerce Engine & Digital Publishing Architecture

## 11.0 Scope & Architectural Position

Book Whispers is a **full-funnel literary ecosystem**: editorial content (blog, quotes, reviews) and commerce
(physical fulfilment, instant digital reading) are one product, not two applications sharing a header.

### 11.0.1 Target architecture

A **modular monolith with extraction seams** — not microservices on day one, and not a ball of mud. Each domain
module owns its schema namespace, exposes a typed in-process contract, and emits domain events onto a durable
bus. Any module can be lifted into its own service without callers changing, because callers never touch another
module's tables.

```
                        ┌───────────────────────────────────────┐
   Edge (CDN + WAF)     │  Storefront (RSC/SSR + ISR)           │
   ──────────────────►  │  Reader SPA (offline-first)           │
                        │  Admin Console · Vendor Portal        │
                        └───────────────┬───────────────────────┘
                                        │  typed BFF (tRPC/REST)
                        ┌───────────────▼───────────────────────┐
                        │  Domain modules (one deployable)      │
                        │                                        │
                        │  catalog · pricing · inventory ·       │
                        │  cart · checkout · orders · payments · │
                        │  entitlements · reader-sync · reviews ·│
                        │  search-index · recommendations ·      │
                        │  vendors · payouts · i18n · media      │
                        └───┬────────┬───────────┬───────────┬───┘
                            │        │           │           │
                    ┌───────▼──┐ ┌───▼────┐ ┌────▼─────┐ ┌───▼──────┐
                    │ Postgres │ │ Redis  │ │ Search   │ │ Object   │
                    │ (OLTP)   │ │ cache/ │ │ (Algolia/│ │ storage  │
                    │          │ │ locks  │ │ ES)      │ │ + CDN    │
                    └──────────┘ └────────┘ └──────────┘ └──────────┘
                            │
                    ┌───────▼───────────────────────────────────────┐
                    │ Event bus (outbox → broker) → async workers:  │
                    │ index sync · email · payouts · ML features    │
                    └───────────────────────────────────────────────┘
```

- **EC-11.0-1** Each module **MUST** own a private schema; cross-module reads **MUST** go through the module's
  public contract or a published event, never a foreign table join.
- **EC-11.0-2** All state changes that other modules care about **MUST** be published via the transactional
  outbox pattern — the write and the event are committed in the same database transaction.
- **EC-11.0-3** Every write endpoint **MUST** accept an `Idempotency-Key`; replays return the original result.
- **EC-11.0-4** Every persisted row on a commerce entity **MUST** carry `tenant_id` (see §11.8) from day one,
  defaulting to the first-party tenant. Retrofitting multi-tenancy later is out of scope by design.

### 11.0.2 Reference stack

| Concern | Selection | Rationale |
| --- | --- | --- |
| Web runtime | Next.js (App Router, React Server Components) | Streams HTML at the edge; keeps product pages near-zero JS |
| Language | TypeScript, strict | One type vocabulary across storefront, admin and workers |
| Datastore | PostgreSQL 16 + PgBouncer | Transactional integrity for money; JSONB for flexible metadata |
| Cache / locks | Redis | Cart sessions, rate limits, inventory reservations, hot pricing |
| Search | Algolia (launch) behind a `SearchProvider` port; Elasticsearch (self-host path) | Sub-50 ms facets without operating a cluster on day one |
| Media | Object storage + image CDN | AVIF/WebP derivatives, signed URLs for protected files |
| Payments | Stripe (primary) + PayPal Commerce | Hosted fields keep the platform in PCI-DSS **SAQ-A** scope |
| Async | Outbox → broker (SQS/Kafka-compatible) + worker pool | Search sync, mail, payouts, ML feature builds |

---

## 11.1 Design Philosophy & UX Standards

### 11.1.1 Aesthetic standard

The commerce surface is an **editorial object**, not a marketplace grid. The reference points are the Apple
product page (restraint, one idea per viewport, motion as feedback) and Amazon Books (density where the reader
is actually comparing). Full token set in [`design/design-system.md`](design/design-system.md).

| Principle | Rule in practice |
| --- | --- |
| Ink on paper | Warm paper canvas `#F4F0E9`, near-black ink `#141210`, single terracotta accent `#C0523C`. Accent is reserved for *action and truth* — price deltas, CTAs, live state. Never decoration. |
| Typographic hierarchy | One display serif for titles and quotations, one geometric sans for UI and data. Never a third family. |
| Whitespace as structure | Section rhythm on an 8 pt base scale; page gutters ≥ 24 px mobile / 64 px desktop. Dividers are hairlines (1 px at 12 % ink), never boxes. |
| Imagery leads | The book cover is the hero. Chrome around it stays achromatic so no two covers ever clash with the UI. |
| Micro-interaction, not animation | ≤ 200 ms, ease-out, opacity + 2–8 px translate only. No bounce, no parallax, no scroll-jacking. |
| Honest state | Every async action shows optimistic result, skeleton, or error inline — never a full-page spinner. |

- **EC-11.1-1** The UI **MUST** be built exclusively from tokens in `design/design-system.md`; raw hex, px
  spacing, or ad-hoc durations in component code **MUST** fail CI lint.
- **EC-11.1-2** Colour pairings **MUST** meet WCAG 2.2 AA (4.5:1 body, 3:1 large text and UI boundaries) in
  light and dark themes. Contrast is asserted in CI against the token matrix.
- **EC-11.1-3** All motion **MUST** be disabled to instantaneous state changes under
  `prefers-reduced-motion: reduce`.
- **EC-11.1-4** Every interactive element **MUST** be reachable and operable by keyboard with a visible focus
  ring (2 px accent, 2 px offset), and every dialog **MUST** trap focus and restore it on close.
- **EC-11.1-5** Touch targets **MUST** be ≥ 44 × 44 px.

### 11.1.2 Performance targets

Budgets are **p75, field data (CrUX/RUM), mobile, 4G** — not lab scores.

| Metric | Budget | Surface |
| --- | --- | --- |
| LCP | **< 1.2 s** | Store home, PDP, category |
| INP | < 200 ms | All interactive surfaces |
| CLS | < 0.05 | All |
| TTFB | < 200 ms cached edge / < 500 ms origin | All |
| JS shipped (gzip) | ≤ 120 KB storefront route, ≤ 170 KB checkout, ≤ 220 KB reader | Per route |
| Search-as-you-type | < 100 ms p95 to first suggestion | Discovery |
| Add-to-cart round trip | < 300 ms p95, optimistic UI at 0 ms | Storefront |
| Reader page turn | < 16 ms frame, < 50 ms chapter seek | Reader |

- **EC-11.2-0** *(perf)* Product and category pages **MUST** be statically rendered with incremental
  revalidation; only price, stock and personalised modules hydrate client-side.
- **EC-11.1-6** The LCP element (cover image or hero title) **MUST** be preloaded, `fetchpriority="high"`, and
  **MUST NOT** be inside a client component that blocks on JS.
- **EC-11.1-7** CI **MUST** enforce per-route byte budgets; a PR exceeding budget fails and requires an explicit
  waiver label.
- **EC-11.1-8** Third-party scripts **MUST** load post-interaction or in a worker; no third-party tag may be
  render-blocking. Total third-party budget: 40 KB.

### 11.1.3 Offline-first requirements

- **EC-11.1-9** The Reader (§11.5) **MUST** function with zero network: book content, position, highlights,
  annotations and bookmarks are served from local storage.
- **EC-11.1-10** Reader mutations **MUST** be queued in a local outbox and synced on reconnect with
  last-write-wins per annotation ID plus conflict retention (never silently drop a user's note).
- **EC-11.1-11** Storefront **SHOULD** serve a cached shell and the user's library index offline; cart mutations
  offline are queued and replayed, and prices are **re-validated server-side** before checkout.

---

## 11.2 Storefront Architecture & Discovery Layer

### 11.2.1 Dynamic store homepage

The homepage is a **composition of modules resolved server-side from a merchandising configuration**, not a
hardcoded page. Editors reorder, schedule and target modules without a deploy.

| Module | Source of truth | Cache strategy |
| --- | --- | --- |
| Featured Titles | Editorial pin list | ISR 5 min |
| Global Best Sellers | Rolling 7/30-day order aggregates, per locale | ISR 15 min |
| New Releases | `published_at` window, per locale catalogue | ISR 15 min |
| Staff Picks | Curated list with contributor attribution | ISR 1 h |
| Editor's Choice | Curated, tied to editorial article (§3) | ISR 1 h |
| Weekly Trends | Velocity score = Δ views + Δ carts + Δ orders | ISR 30 min |
| Promotional / Discounted Sets | Active promotion engine rules | ISR 5 min, price re-checked at render |
| Personalised Recommendations | §11.7 recommender | Edge-personalised, streamed after shell |
| Just Added | Newest catalogue entries | ISR 5 min |

- **EC-11.2-1** Module order, visibility window (`starts_at`/`ends_at`), locale targeting and audience segment
  **MUST** be configurable in the admin console and versioned with an audit trail.
- **EC-11.2-2** Modules **MUST** be independently streamable — a slow personalised module **MUST NOT** delay
  first paint of the page shell or the hero.
- **EC-11.2-3** A module returning fewer than its minimum item count **MUST** fall back to a declared substitute
  (or self-hide) rather than render a broken rail.
- **EC-11.2-4** Every module **MUST** emit impression and interaction telemetry with a stable `module_id` and
  slot position for merchandising attribution.
- **EC-11.2-5** Editorial cross-links (blog post, quote, review) **MUST** be attachable to any module item, so a
  book rail can carry "Read the review" without leaving the commerce layer.

### 11.2.2 Product Card component (schema-driven)

One component, one schema, every surface. A card is rendered from a `ProductCardModel` projection — never from a
raw catalogue row — so the same contract serves home, category, search, recommendations and editorial embeds.

```ts
type ProductCardModel = {
  id: string;                       // product id
  slug: string;
  title: string;
  authors: { id: string; name: string; slug: string }[];
  cover: {
    avif: string; webp: string; jpeg: string;   // responsive srcset bases
    width: number; height: number;
    blurhash: string;                            // LQIP placeholder
    alt: string;                                 // localized, never "book cover"
  };
  rating: { average: number; count: number } | null;
  price: {
    currency: string;                 // ISO-4217, matches active selector
    amount: number;                   // minor units
    compareAt: number | null;         // strikethrough regular price
    savingsPercent: number | null;    // derived, server-computed
    priceValidUntil: string | null;   // ISO-8601, for promo + schema.org
    formatted: string;                // locale-formatted by server (Intl)
  };
  availability: 'IN_STOCK' | 'LOW_STOCK' | 'BACKORDER' | 'PREORDER' | 'OUT_OF_STOCK' | 'DIGITAL';
  lowStockThresholdHit: boolean;
  formats: ('HARDCOVER'|'PAPERBACK'|'EBOOK'|'AUDIOBOOK')[];
  badges: ('NEW'|'BESTSELLER'|'STAFF_PICK'|'SIGNED'|'EXCLUSIVE')[];
  inWishlist: boolean;               // resolved client-side post-hydration
  vendor: { id: string; name: string } | null;   // §11.8
};
```

**Imagery**

- **EC-11.2-6** Covers **MUST** be served AVIF → WebP → JPEG via `<picture>`, with `srcset` at 1×/2×/3× for the
  rendered box, `loading="lazy"` below the fold, and explicit `width`/`height` to hold layout (CLS 0).
- **EC-11.2-7** Each cover **MUST** ship a BlurHash/ThumbHash placeholder rendered inline; no grey box, no
  layout shift on decode.
- **EC-11.2-8** `alt` text **MUST** be generated as `"{title} by {authors} — cover"` in the active locale.

**Pricing**

- **EC-11.2-9** Price, `compareAt` and savings **MUST** be computed server-side by the pricing module for the
  active currency and customer segment. The client **MUST NOT** compute discounts.
- **EC-11.2-10** Savings badge **MUST** render only when `compareAt > amount`, showing rounded whole percent, and
  **MUST** be suppressed in jurisdictions where the configured reference-price rule is unmet (EU Omnibus:
  lowest price in prior 30 days).
- **EC-11.2-11** Changing the currency selector **MUST** re-resolve all visible prices from the server within
  400 ms p95 and persist the choice (cookie + account preference) across sessions and devices.

**Availability**

- **EC-11.2-12** Availability **MUST** reflect uncommitted stock (`on_hand − reserved`) at render, with a
  client refresh on tab focus for carts older than 60 s.
- **EC-11.2-13** `LOW_STOCK` **MUST** be driven by the per-SKU threshold in §11.6 — never a hardcoded number —
  and worded as scarcity fact ("3 left"), never manufactured urgency.

**Quick-action matrix**

| Action | Behaviour | Requirement |
| --- | --- | --- |
| Quick View | Modal with gallery, key metadata, format switch, price, ATC. Deep-linkable URL; `Esc`/overlay closes; focus restored. | **EC-11.2-14** |
| One-Click Add to Cart | Optimistic; server reconciles; failure rolls back with inline reason. No page navigation, no modal takeover. | **EC-11.2-15** |
| Wishlist Toggle | Optimistic; anonymous users get a local wishlist that **MUST** merge into the account on sign-in without duplicates. | **EC-11.2-16** |

- **EC-11.2-17** Cards **MUST** emit `Product` + `Offer` + `AggregateRating` JSON-LD matching the rendered
  values exactly.
- **EC-11.2-18** The card **MUST** be a server component; only the three quick actions hydrate (islands), keeping
  a 60-card grid under the route JS budget.

### 11.2.3 Category, collection & browse

- **EC-11.2-19** Category pages **MUST** support the full facet set of §11.7 with URL-encoded state
  (shareable, back-button correct, indexable for whitelisted facet combinations).
- **EC-11.2-20** Pagination **MUST** be cursor-based with `rel="next"/"prev"`; infinite scroll, where used, **MUST**
  keep an accessible "load more" control and restore scroll position on back-navigation.

---

## 11.3 Product Detail Page (PDP) & Rich Content Engine

The PDP is where editorial and commerce fuse: the same page carries the buy box, the review the blog published,
and the quotes readers highlighted.

### 11.3.1 Media & information architecture

**Cover gallery**

- **EC-11.3-1** Multi-angle gallery (front, back, spine, interior spreads, detail shots) with keyboard-navigable
  thumbnails and swipe on touch.
- **EC-11.3-2** Dynamic zoom: hover-lens on pointer devices, pinch-zoom on touch, loading a high-res source
  **only on zoom intent** so it never competes with LCP.
- **EC-11.3-3** A 3D preview toggle **MUST** be available when a `model_3d` asset (GLB/USDZ) exists, lazy-loaded
  on activation, with a static fallback where WebGL is unavailable. Absence of the asset hides the toggle.

**Metadata display**

- **EC-11.3-4** The PDP **MUST** display, per selected format: publisher, imprint, ISBN-10 and ISBN-13 (ISBN-10
  shown only where a valid legacy mapping exists), language, publication date, page count or audio runtime,
  dimensions, weight, edition, and taxonomy chips (BISAC + house categories) that link to filtered browse.
- **EC-11.3-5** Format switching (Hardcover / Paperback / eBook / Audiobook) **MUST** swap price, availability,
  ISBN, delivery expectation and CTA **without a full page load**, updating the URL and canonical variant.
- **EC-11.3-6** ISBNs **MUST** be checksum-validated on ingest (§11.6); invalid identifiers block publication.

**Author profile widget**

- **EC-11.3-7** Biography (rich text, localized), portrait, verified social links (`rel="nofollow ugc"`),
  and a "More by this Author" carousel excluding the current title, sorted by relevance then recency.

**Rich description & sampling**

- **EC-11.3-8** Description **MUST** render sanitized rich text with a clamp + "Read more" that expands in place
  (no modal, no re-layout of the buy box).
- **EC-11.3-9** "Inside the Book" **MUST** surface quotes from the Quotes domain (§4) attributed to this title,
  each linking to its quote page — the commercial page inherits the platform's literary voice.
- **EC-11.3-10** An interactive sample **MUST** open the eBook Excerpt Reader — the same engine as §11.5, scoped
  to a publisher-defined excerpt (percentage or explicit chapter range), with no download and no persistence of
  the full manifest.
- **EC-11.3-11** Excerpt content **MUST** be served through short-lived signed URLs and **MUST NOT** expose the
  full EPUB manifest to the client under any code path.

**Customer sentiment engine**

- **EC-11.3-12** Ratings breakdown (5→1 histogram with percentage bars) computed from a materialised aggregate,
  not an on-request scan.
- **EC-11.3-13** Reviews **MUST** support filter by star, verified-buyer, format, and language; sort by helpful /
  recent / critical; and paginate without losing filter state.
- **EC-11.3-14** Verified-buyer badges **MUST** derive from a fulfilled order containing the product by the
  reviewing account — never self-declared.
- **EC-11.3-15** Q&A: authenticated users ask; staff, vendor (§11.8) and verified owners answer; answers are
  moderated before publication and vote-ranked.
- **EC-11.3-16** All UGC (reviews, answers, annotations shared publicly) **MUST** pass the moderation pipeline of
  §7 before display, with a visible reporting affordance on every item.

### 11.3.2 Primary conversion sticky bar

- **EC-11.3-17** On scroll past the buy box, a sticky bar **MUST** appear containing compact cover, title,
  selected format, live price and the CTA set: **Buy Now**, **Add to Cart**, **Wishlist**, **Share**.
- **EC-11.3-18** *Buy Now* **MUST** create a single-item express checkout, preserving cart contents untouched.
- **EC-11.3-19** Share **MUST** use the Web Share API where available, falling back to a copy-link + social sheet;
  shared URLs carry canonical UTM attribution.
- **EC-11.3-20** The sticky bar **MUST NOT** overlap system UI or the reader's cookie/consent surfaces, **MUST**
  respect safe-area insets, and **MUST** collapse to a single-row layout below 480 px.
- **EC-11.3-21** For digital-only titles the CTA set **MUST** replace shipping language with "Read instantly in
  your browser", and post-purchase **MUST** deep-link into the Reader.

---

## 11.4 Shopping Cart & Dynamic Checkout Pipeline

### 11.4.1 Cart logic

The cart is **server-authoritative**, keyed by an anonymous cart token or account ID, with a client mirror for
optimistic UI. The client never owns price.

- **EC-11.4-1** Quantity adjustment **MUST** be optimistic with server reconciliation, debounced at 300 ms, and
  clamped to available stock with an inline explanation when clamped.
- **EC-11.4-2** Removal **MUST** be a soft delete with a 10 s **Undo** affordance; the line is only purged after
  the window closes.
- **EC-11.4-3** "Save for Later" **MUST** persist per account (and per anonymous token for 30 days), survive
  sign-in merge, and restore into the cart with a re-validated current price.
- **EC-11.4-4** Anonymous carts **MUST** merge into the account cart on sign-in: quantities summed to stock
  ceiling, digital duplicates collapsed, already-owned digital items dropped with a notice.
- **EC-11.4-5** Coupon engine **MUST** support percentage, fixed-amount, free-shipping, BOGO and bundle rules,
  with stacking policy, per-customer and global usage caps, product/collection/vendor scoping, and validity
  windows. Invalid codes fail with a specific reason, never a generic error.
- **EC-11.4-6** Tax **MUST** be computed by a tax provider port (Stripe Tax / Avalara / TaxJar) using destination
  address and product tax class — books carry reduced or zero rates in many jurisdictions, and digital goods use
  **place-of-supply** VAT (EU OSS) rules. Tax **MUST NOT** be estimated client-side.
- **EC-11.4-7** Shipping rates **MUST** be fetched live from the carrier layer (§11.9) using cart weight,
  dimensions, origin warehouse and destination; results cached ≤ 15 min per (destination, basket signature).
- **EC-11.4-8** Estimated delivery **MUST** be presented as a date **window** derived from warehouse cut-off,
  handling time, carrier transit and destination calendar — never a single optimistic date.
- **EC-11.4-9** Mixed carts (physical + digital) **MUST** split presentation into "Ships to you" and "Available
  instantly", with shipping computed on the physical subtotal only.
- **EC-11.4-10** Digital items **MUST** be quantity-locked to 1 and **MUST** be blocked if already owned, with a
  "You own this — open in Reader" link instead of an error.
- **EC-11.4-11** Cart totals **MUST** always render the full breakdown: subtotal, discounts (itemised),
  shipping, tax, and grand total in the active currency.
- **EC-11.4-12** Every cart mutation **MUST** re-validate price and availability server-side; a price change
  since add **MUST** be surfaced explicitly before checkout can proceed.

### 11.4.2 Checkout orchestration

Checkout is a **state machine** persisted per attempt (`session → address → delivery → payment → review →
authorized → captured`), resumable by link, and instrumented at every transition for funnel analysis.

**Dual mode**

- **EC-11.4-13** Guest checkout **MUST** be frictionless: email + shipping only, zero forced account creation, with
  a one-click post-purchase account claim that attaches the order and any digital entitlements.
- **EC-11.4-14** Authenticated checkout **MUST** prefill from the address book and stored payment methods, and
  **MUST** allow one-tap purchase when a default address, delivery option and payment method all exist.
- **EC-11.4-15** Digital-only carts **MUST** skip the address and delivery steps entirely, collecting only what
  tax jurisdiction determination requires.

**Payments**

- **EC-11.4-16** Integrations: **Stripe** (Payment Element — cards, wallets, local methods), **PayPal Commerce
  Platform**, **Apple Pay**, **Google Pay**. Wallet buttons **MUST** appear at the top of checkout *and* on the PDP
  sticky bar when the device supports them.
- **EC-11.4-17** Card data **MUST** be captured exclusively in provider-hosted iframes/elements. The platform
  **MUST NOT** transmit, log or store PAN, CVV or full magnetic data — keeping scope at **PCI-DSS SAQ-A** while
  transacting on a Level 1 compliant processor.
- **EC-11.4-18** 3-D Secure / SCA **MUST** be supported via the provider's challenge flow, including deferred
  authentication outcomes.
- **EC-11.4-19** Order creation **MUST** be idempotent per payment intent; the authoritative order transition is
  driven by the **provider webhook**, never by the browser returning from redirect.
- **EC-11.4-20** Payment failures **MUST** map provider decline codes to human, actionable copy and **MUST** retain
  the cart and entered data intact.
- **EC-11.4-21** Inventory **MUST** be reserved at payment intent creation with a TTL, converted to a commitment
  on capture, and released on expiry/failure — overselling is a defect, not a business decision.
- **EC-11.4-22** Refunds, partial refunds and cancellations **MUST** be supported end-to-end, including
  entitlement revocation for digital goods per the refund policy.

**Address**

- **EC-11.4-23** Address validation/autocomplete **MUST** run through a provider port (Google Places / Loqate)
  with typeahead, normalisation to the destination's postal format, and a "use as entered" override.
- **EC-11.4-24** Shipping and billing addresses **MUST** be separable, with "same as shipping" defaulted on.
- **EC-11.4-25** Address forms **MUST** be locale-aware: field order, labels, required fields and postcode
  validation adapt per country (no "State" for countries without states).
- **EC-11.4-26** Checkout **MUST** function without JavaScript-dependent navigation between steps failing —
  each step is a server-rendered, individually addressable route.

### 11.4.3 Checkout acceptance criteria

| ID | Criterion |
| --- | --- |
| AC-11.4-A | A guest can go from PDP to paid confirmation in ≤ 6 interactions with no account creation. |
| AC-11.4-B | Closing the tab mid-checkout and returning restores the exact step and entered data. |
| AC-11.4-C | Two concurrent purchases of the last unit result in exactly one success and one clear, non-charging failure. |
| AC-11.4-D | A duplicate webhook delivery produces no duplicate order, email, or entitlement. |
| AC-11.4-E | A digital purchase is readable in the Reader within 5 s of capture, without a page refresh. |

---

## 11.5 Customer Account Hub & Native Digital Reader Engine

### 11.5.1 User dashboard

| Area | Requirements |
| --- | --- |
| Order lifecycle | **EC-11.5-1** Timeline UI: Placed → Paid → Processing → Shipped → In Transit → Delivered (+ Cancelled/Refunded/Returned), with carrier tracking number, live carrier events (§11.9) and per-shipment granularity for split orders. |
| Digital library | **EC-11.5-2** All owned digital titles with instant "Read now" (Reader) and, where the licence permits, download of watermarked EPUB/PDF. Downloads **MUST** use short-lived signed URLs and be rate-limited per entitlement. |
| Order history | **EC-11.5-3** Searchable/filterable history with a tax-compliant **PDF invoice** export per order (and CSV export of the full history), generated server-side and archived immutably. |
| Address book | **EC-11.5-4** CRUD with a default shipping and default billing address, validated on save. |
| Payment methods | **EC-11.5-5** Stored as provider tokens only; UI shows brand, last-4, expiry. Add/remove/set-default; no PAN ever reaches the platform. |
| Reviews hub | **EC-11.5-6** All authored reviews and Q&A with edit/delete, moderation status visible, and prompts to review delivered purchases. |
| Wishlist | **EC-11.5-7** Multiple named lists, privacy setting (private/unlisted/public), shareable link, price-drop and back-in-stock notifications, one-tap move to cart. |
| Privacy | **EC-11.5-8** Self-service data export and account deletion request (GDPR/CCPA), with legally-required financial records retained and clearly disclosed. |

### 11.5.2 E-Reader web app

An in-browser reading engine — offline-first, standards-based (EPUB 3 + Web Publications), rendering through a
paginator port so the display engine can be swapped without touching sync, annotations or entitlements.

**Reading experience**

- **EC-11.5-9** Two layout modes: **continuous scroll** and **paginated page-flip** (single or side-by-side
  spread on wide viewports), switchable at runtime with position preserved across the switch.
- **EC-11.5-10** Progress **MUST** persist as an EPUB CFI plus percentage, synced across devices within 5 s
  online and reconciled on reconnect ("furthest position" wins, with an explicit "jump to furthest / stay here"
  prompt on conflict).
- **EC-11.5-11** Text selection **MUST** support highlight (≥ 5 colours), inline note, copy (within licence
  limits), lookup and share-as-quote — a shared highlight becomes a Book Whispers quote card (§4), closing the
  loop back to editorial.
- **EC-11.5-12** Annotations and highlights **MUST** be CFI-anchored, survive reflow at any font size, and be
  exportable (Markdown/CSV).
- **EC-11.5-13** Typography controls: font family (≥ 2 serif, 2 sans, 1 dyslexia-friendly), size, line height,
  margin width, justification, hyphenation — applied instantly, persisted per user.
- **EC-11.5-14** Themes: Paper (light), Sepia, Night (dark), and a high-contrast mode; **MUST** honour system
  theme by default and expose a per-book override.
- **EC-11.5-15** Bookmarks: add/remove at any position, named, listed in a panel alongside chapters, highlights
  and notes; searchable full-text within the book.
- **EC-11.5-16** Reader **MUST** be fully keyboard-operable (arrows/space to turn, `/` to search, `b` bookmark)
  and screen-reader compatible, exposing the book as structured reading content.
- **EC-11.5-17** Session telemetry (time read, pages, completion) **MUST** power "continue reading" and reading
  stats; it **MUST** be excludable by the user in privacy settings.

**Offline & content protection**

- **EC-11.5-18** Book resources **MUST** be cached in IndexedDB/OPFS on first open, encrypted at rest with a
  per-entitlement key delivered on authenticated fetch; the cache **MUST** be purged when the entitlement is
  revoked or the user signs out.
- **EC-11.5-19** Content **MUST** be delivered chunked and streamed, gated by entitlement check on every
  resource request. A user without an entitlement **MUST NOT** be able to assemble the book from any endpoint.
- **EC-11.5-20** Downloadable files **MUST** carry a per-purchase social watermark (buyer reference, order ID);
  a hard-DRM path (Readium LCP) **MUST** be pluggable at the licence layer for publishers who require it.
- **EC-11.5-21** The offline outbox **MUST** replay highlights, notes, bookmarks and progress on reconnect,
  idempotently by client-generated annotation ID.

### 11.5.3 Reader acceptance criteria

| ID | Criterion |
| --- | --- |
| AC-11.5-A | With the network disabled, a previously-opened book opens, turns pages, and accepts new highlights; all changes appear on a second device within 5 s of reconnect. |
| AC-11.5-B | Changing font size does not move any existing highlight off its text. |
| AC-11.5-C | Revoking an entitlement (refund) removes the book from the library and the local cache on next launch. |
| AC-11.5-D | No endpoint returns full book content to a session lacking a valid entitlement. |

---

## 11.6 Back-Office ERP & Admin Operations Dashboard

Role-based (RBAC) admin console: Owner, Catalogue Manager, Inventory Manager, Order Manager, Finance, Support,
Editor, Vendor (§11.8 — scoped to own data). Every mutating action is written to an append-only audit log with
actor, before/after diff, IP and timestamp.

### 11.6.1 Catalogue management

- **EC-11.6-1** Full CRUD on products, variants/SKUs (one per format+edition), authors, publishers, imprints,
  series and taxonomies, with **draft → review → scheduled → published → archived** workflow and preview links.
- **EC-11.6-2** Bulk import/export via CSV, JSON and ONIX 3.0 (the publishing industry standard) with dry-run
  validation, per-row error reporting, partial-commit control and a downloadable error file.
- **EC-11.6-3** Cover uploader with drag-and-drop, multi-file, automatic derivative generation (AVIF/WebP/JPEG at
  defined breakpoints), aspect-ratio validation, and focal-point selection.
- **EC-11.6-4** eBook file manager for `.epub`, `.pdf` (and `.m4b`/`.mp3` for audio) with server-side validation
  (EPUBCheck), virus scan, encryption at rest, versioning with rollback, and **no public URL** — access only via
  entitlement-signed requests.
- **EC-11.6-5** Author and publisher entities **MUST** be first-class relational records (not free-text strings)
  supporting many-to-many product relations, contributor roles (author, translator, illustrator, narrator,
  editor) and merge/deduplicate tooling.
- **EC-11.6-6** Product editing **MUST** be localizable per supported locale (§11.9) with translation status
  indicators and fallback to the default locale.

### 11.6.2 Inventory control system

- **EC-11.6-7** Per-SKU, per-warehouse stock ledger: `on_hand`, `reserved`, `available`, `incoming`, with an
  immutable movement journal (receipt, sale, return, adjustment, transfer, damage) — never a mutable counter.
- **EC-11.6-8** Configurable low-stock thresholds per SKU and per warehouse, with alerts by email/webhook and a
  dashboard queue.
- **EC-11.6-9** Automatic out-of-stock flagging with configurable behaviour: hide, show as backorder, or accept
  pre-orders with a declared release date.
- **EC-11.6-10** Warehouse/location tracking (bin/shelf), stock transfers between locations, and cycle-count
  reconciliation with variance reporting.
- **EC-11.6-11** Barcode/SKU mapping (EAN-13/UPC/GTIN) with barcode-scanner input support in receiving and
  picking screens.
- **EC-11.6-12** ISBN tracking as a first-class identifier with checksum validation and duplicate detection
  across the catalogue.
- **EC-11.6-13** Digital SKUs **MUST** be flagged as non-stocked and excluded from all stock arithmetic.

### 11.6.3 Financial & analytics engine

- **EC-11.6-14** Live sales dashboard: revenue, orders, AOV, conversion rate, refunds, units — with period
  comparison and timezone-correct bucketing.
- **EC-11.6-15** Revenue breakdowns by format, author, publisher, category, channel, vendor, country and
  currency, with drill-through to the underlying orders.
- **EC-11.6-16** Automated sales-tax report generator per jurisdiction and filing period, reconcilable to the
  tax provider's own records, including digital-goods place-of-supply summaries.
- **EC-11.6-17** Exports in CSV, XLSX and PDF, generated asynchronously for large ranges with an emailed/download
  link; exports **MUST** respect the requesting role's data scope.
- **EC-11.6-18** Financial figures **MUST** be computed from immutable order/ledger records in minor units with
  explicit rounding rules — never from floating-point aggregates over mutable rows.
- **EC-11.6-19** Analytics queries **MUST** run against a read replica or warehouse projection; no admin report
  may degrade storefront latency.

### 11.6.4 Operations

- **EC-11.6-20** Order management: search, filter, view, edit pre-fulfilment, cancel, refund (full/partial),
  re-send confirmation, re-issue digital entitlement, add internal notes.
- **EC-11.6-21** Fulfilment: pick lists, packing slips, label purchase via the carrier layer (§11.9), shipment
  splitting, and tracking write-back to the customer timeline.
- **EC-11.6-22** Returns/RMA: request, approve, receive, restock or write off, with refund linkage.
- **EC-11.6-23** Promotion manager for the §11.4 coupon engine, including scheduling, targeting, caps, and a
  live usage/performance view.

---

## 11.7 Advanced Search & Predictive Discovery

### 11.7.1 Search engine

Search sits behind a `SearchProvider` port (Algolia at launch, Elasticsearch/OpenSearch as the self-hosted
path). Index writes are event-driven from the catalogue outbox — never dual-writes from request handlers.

- **EC-11.7-1** Full-text search across title, subtitle, series, author, contributor, publisher, ISBN, description
  and (where licensed) full text, with typo tolerance, synonyms, stemming and a curated stop-word list per language.
- **EC-11.7-2** Facets: category, author, publisher, language, format, price range, rating, availability,
  publication year, series and vendor — with facet counts, multi-select, and URL-encoded state.
- **EC-11.7-3** Instant search-as-you-type returning grouped suggestions (Titles / Authors / Categories /
  Content) in < 100 ms p95, keyboard navigable, with recent and trending searches.
- **EC-11.7-4** An exact ISBN, EAN or SKU query **MUST** rank the exact match first, unconditionally.
- **EC-11.7-5** Merchandising controls in admin: pinned results, boosts/burials, banned queries, synonym
  management, and redirect rules — all versioned and auditable.
- **EC-11.7-6** Zero-result queries **MUST** return graceful recovery (spelling suggestion, relaxed facets,
  related categories) and **MUST** be logged for merchandising review.
- **EC-11.7-7** Index freshness: catalogue and price changes reflected in ≤ 60 s p95; stock state in ≤ 30 s.
- **EC-11.7-8** Search **MUST** cover editorial objects too (blog posts, quotes, reviews) in a separate index
  surfaced as a "Content" group — literary discovery and commerce discovery are one search box.
- **EC-11.7-9** Per-locale indices with locale-appropriate analysers, including Arabic (normalisation,
  diacritic-insensitive matching) and Turkish (dotted/dotless İ/ı casing).

### 11.7.2 AI recommendation engine

- **EC-11.7-10** A hybrid recommender combining: content-based similarity (embeddings over title, description,
  taxonomy, author), item-to-item collaborative filtering, session-based sequence modelling, category affinity,
  and trending/velocity signals — blended per placement.
- **EC-11.7-11** Placements: home personalised rail, PDP "Readers also bought" and "Similar in style", cart
  cross-sell, post-purchase, email, and reader "finish this book → what next".
- **EC-11.7-12** Cold start **MUST** degrade gracefully: popularity within inferred locale/category rather than
  an empty rail. No placement ever renders empty.
- **EC-11.7-13** Telemetry (views, dwell, add-to-cart, purchase, reading completion, highlight density) **MUST**
  feed the feature store via the event bus, pseudonymised, and **MUST** honour consent state and Do-Not-Track
  preference.
- **EC-11.7-14** Recommendations **MUST** exclude already-owned digital titles, out-of-catalogue items, and items
  filtered by the user's content preferences.
- **EC-11.7-15** Every recommendation response **MUST** carry a model/variant ID enabling A/B evaluation on
  CTR and revenue-per-impression, with online serving latency < 80 ms p95.
- **EC-11.7-16** Serving **MUST** fail open: on recommender error or timeout the placement falls back to a
  curated or best-seller rail within the same render.

---

## 11.8 Architecture Readiness: Multi-Vendor Marketplace Infrastructure

The platform launches first-party but is **built multi-tenant**: vendor onboarding is a configuration and
compliance exercise, not a rewrite.

### 11.8.1 Tenancy model

- **EC-11.8-1** Every commerce entity (product, SKU, inventory, order line, payout, media asset) **MUST** carry
  `vendor_id`; the first-party catalogue is vendor zero.
- **EC-11.8-2** Data isolation **MUST** be enforced at the data layer (PostgreSQL row-level security or an
  equivalent enforced repository scope), not only in application filters.
- **EC-11.8-3** Orders **MUST** support multi-vendor baskets, splitting into per-vendor fulfilment groups with
  independent shipments, tracking and status, presented to the customer as one order.
- **EC-11.8-4** Vendor-specific shipping rules, handling times, return policies and tax registrations **MUST** be
  modelled per vendor.

### 11.8.2 Vendor portal

- **EC-11.8-5** Isolated dashboard: sales, orders, payouts, inventory health, catalogue status — scoped strictly
  to the vendor's own data, with no cross-vendor leakage in any list, export, search or error message.
- **EC-11.8-6** Self-service catalogue management with a **platform approval queue** before publication (new
  titles, price changes beyond a threshold, content edits).
- **EC-11.8-7** Order fulfilment pipeline: accept, pick, pack, purchase label, mark shipped, upload tracking,
  handle returns — with SLA timers and breach alerts.
- **EC-11.8-8** Vendor storefront profile: name, logo, bio, policies, and a public vendor page that inherits the
  platform design system (no per-vendor theming — the aesthetic is not negotiable).
- **EC-11.8-9** Commission engine: platform-wide default with per-vendor and per-category overrides, computed
  per order line, with a transparent, auditable statement per period.
- **EC-11.8-10** Payouts via a marketplace payments provider (Stripe Connect), with KYC/AML onboarding, payout
  schedule configuration, reserves/holds, refund clawbacks, and downloadable statements.
- **EC-11.8-11** Vendor analytics: revenue, units, conversion, return rate, review sentiment and payout history,
  exportable in the same formats as §11.6.
- **EC-11.8-12** Vendor API keys/webhooks **MUST** be scoped to the vendor tenant, individually revocable and
  rate-limited.

---

## 11.9 Localization, Currency & Global Logistics

### 11.9.1 Logistics framework

- **EC-11.9-1** Carrier integrations — **FedEx, DHL, UPS** (plus national postal fallback) — behind a
  `CarrierProvider` port covering rating, label purchase, tracking and cancellation.
- **EC-11.9-2** Real-time tracking via carrier **webhooks**, normalised into a canonical event vocabulary
  (`INFO_RECEIVED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED → EXCEPTION → RETURNED`) and pushed to the customer
  timeline and notification layer. Polling exists only as a reconciliation fallback.
- **EC-11.9-3** Dynamic weight- and dimension-based shipping rules: weight brackets, dimensional weight,
  zone-based rates, free-shipping thresholds (per currency), oversized/heavy surcharges, and per-vendor origin.
- **EC-11.9-4** Cross-border support: customs declarations (HS codes for printed matter), duties/DDP or DDU
  election, restricted-destination rules, and country-level catalogue availability.
- **EC-11.9-5** Rate quoting **MUST** degrade gracefully: on carrier timeout, fall back to a configured flat-rate
  table rather than blocking checkout.

### 11.9.2 Multi-currency engine

- **EC-11.9-6** Supported currencies at launch: **USD, EUR, TRY, GBP, AED**, with the model open to more.
- **EC-11.9-7** Rates refreshed from an FX provider on a schedule with a configurable markup buffer, cached, and
  **frozen at order placement** — the order stores the exact rate used, permanently.
- **EC-11.9-8** Manual price overrides per currency **MUST** take precedence over conversion, enabling
  psychological pricing per market.
- **EC-11.9-9** All monetary values **MUST** be stored as integer minor units with an explicit currency; no
  floating-point money anywhere in the stack, including exports and reports.
- **EC-11.9-10** Formatting **MUST** use `Intl.NumberFormat` per locale-currency pair (symbol position, decimal
  and grouping separators, TRY's `₺`, AED's Arabic rendering) and **MUST** be rendered server-side to avoid
  hydration mismatch.
- **EC-11.9-11** Currency selection **MUST** default from geo/`Accept-Language` on first visit and remain
  user-overridable and persistent. Displayed currency and charged currency **MUST** always match.

### 11.9.3 Localization layer (i18n)

- **EC-11.9-12** Launch locales: **English (en), Arabic (ar), French (fr), Turkish (tr)** — with full UI, catalogue,
  editorial, transactional email and error-message translation, and locale fallback chains.
- **EC-11.9-13** Layout direction **MUST** be handled with CSS **logical properties** (`margin-inline-start`,
  `inset-inline-end`) and `dir="rtl"` at the document root — never mirrored stylesheets or `[dir]`-specific hacks.
- **EC-11.9-14** RTL parity is a release gate: every screen (storefront, checkout, account, reader, admin, vendor)
  **MUST** be verified in Arabic, including icon mirroring for directional glyphs, correct bidi handling of
  mixed Latin/Arabic strings (ISBNs, prices), and RTL-correct carousels and progress indicators.
- **EC-11.9-15** Typography **MUST** load locale-appropriate faces (Arabic Naskh with correct line height,
  Turkish-safe Latin with dotted/dotless İ/ı), subset per locale to protect the LCP budget.
- **EC-11.9-16** Localized routing **MUST** use path-prefixed locales (`/ar/...`) with `hreflang` alternates and
  a canonical per locale.
- **EC-11.9-17** Search indices, sort orders and collation **MUST** be locale-aware (§11.7-9).
- **EC-11.9-18** Dates, numbers, addresses, phone formats and name order **MUST** localize; no string
  concatenation for translated sentences (ICU MessageFormat with plurals and gender where required).
- **EC-11.9-19** Untranslated content **MUST** fall back to the default locale with a machine-readable marker for
  the translation queue — never render an empty field or a raw translation key.

---

## 11.10 Cross-Cutting: Security, Compliance & Trust

- **EC-11.10-1** All traffic over TLS 1.3; HSTS preload; strict CSP with nonces (no `unsafe-inline`);
  `Permissions-Policy` and `Referrer-Policy` set; Subresource Integrity for any external script.
- **EC-11.10-2** Authentication with secure session cookies (`HttpOnly`, `Secure`, `SameSite=Lax`), optional
  passkeys/WebAuthn, TOTP 2FA mandatory for admin and vendor roles.
- **EC-11.10-3** Authorization enforced server-side on every request; no admin, vendor or entitlement decision
  may rely on client state.
- **EC-11.10-4** PII encrypted at rest; secrets in a managed vault; no secrets, PAN, tokens or full addresses in
  logs; structured logs with correlation IDs.
- **EC-11.10-5** Rate limiting and bot mitigation on auth, checkout, coupon validation, search and download
  endpoints; CAPTCHA challenge only on risk signal, never by default.
- **EC-11.10-6** GDPR/CCPA/KVKK: consent management before non-essential telemetry, documented lawful basis,
  data-subject export and erasure workflows, processor register, and configurable retention schedules.
- **EC-11.10-7** WCAG 2.2 AA conformance is a release gate for storefront, checkout, account and reader, verified
  by automated axe checks in CI **plus** a manual keyboard and screen-reader pass per release.
- **EC-11.10-8** Dependency and container scanning in CI; SBOM produced per release; critical CVEs block deploy.
- **EC-11.10-9** Financial reconciliation job **MUST** run daily against provider settlement reports, flagging any
  divergence between platform orders, provider charges and payouts.

## 11.11 Observability & Operational Readiness

- **EC-11.11-1** RUM for Core Web Vitals segmented by route, locale, device and country, alerting on p75
  regression against §11.1.2 budgets.
- **EC-11.11-2** Distributed tracing across BFF → modules → providers, with checkout and reader-sync as named
  critical paths.
- **EC-11.11-3** Business SLOs with error budgets: checkout success rate ≥ 99.5 % (excluding legitimate declines),
  reader content availability ≥ 99.9 %, search availability ≥ 99.9 %.
- **EC-11.11-4** Synthetic monitors executing purchase (test mode) and open-a-book flows every 5 minutes from at
  least three regions.
- **EC-11.11-5** Every provider integration **MUST** implement timeout, retry with jitter, circuit breaker and a
  declared degraded-mode behaviour — documented per provider in the runbook.
- **EC-11.11-6** Feature flags for every module in §11.2 and all payment methods, enabling dark launch and
  instant kill-switch.

## 11.12 Delivery Plan

| Phase | Scope | Exit criteria |
| --- | --- | --- |
| **P0 — Foundations** | Domain model, tenancy columns, design system, media pipeline, catalogue admin, search index sync | Design tokens shipped; catalogue CRUD + ONIX import green; search returns catalogue |
| **P1 — Sell physical** | Storefront modules, PDP, cart, guest + auth checkout (Stripe/PayPal/wallets), tax, shipping, orders, invoices | AC-11.4-A…E pass; LCP < 1.2 s p75 on home + PDP |
| **P2 — Sell digital** | Entitlements, secure delivery, Reader v1 (scroll + paginated, highlights, sync, offline), excerpt reader | AC-11.5-A…D pass; reader route ≤ 220 KB JS |
| **P3 — Scale & intelligence** | Recommendations, merchandising controls, analytics/finance reporting, returns/RMA, carrier webhooks | Recommender A/B harness live; tax + revenue reports reconcile |
| **P4 — Marketplace & global** | Vendor portal, commissions, Connect payouts, multi-currency, ar/fr/tr locales with RTL | RTL release gate passes; first external vendor transacts end-to-end |

## 11.13 Definition of Done (Section 11)

A Section 11 capability is done only when all of the following hold:

1. Requirements in its subsection have passing automated tests (unit, integration, and an E2E for each user path).
2. Performance budgets in §11.1.2 are met in field data for affected routes.
3. Accessibility gate (§11.10-7) passes, including a keyboard-only and screen-reader pass.
4. RTL and all launch locales render correctly (§11.9-14), with no untranslated strings in the default paths.
5. Telemetry, tracing and alerts exist for the capability's critical path.
6. Admin/vendor-facing operations for the capability are documented in the runbook, with a rollback path.
7. Money paths reconcile against the provider's own records (§11.10-9).

---

## Architectural Core Vision

Book Whispers operates as one unified, full-funnel digital ecosystem. A reader arrives for a quote, stays for a
review, buys the hardcover, and is reading the eBook thirty seconds later — without ever crossing a seam between
"content site" and "shop". The commerce layer inherits the editorial voice: the same typography, the same
restraint, the same respect for the page.

Four non-negotiables govern every decision in this section:

- **Visual elegance** — the interface disappears behind the book.
- **Zero-latency interaction** — server-rendered by default, optimistic at the edge of every action, offline where it matters.
- **Modular code architecture** — domain modules with private schemas and event-driven seams, extractable without rewrites.
- **Multi-tenant scalability** — every row is tenant-aware from the first migration, so the marketplace is an onboarding step, not a re-platform.
