# Book Whispers — API & Event Contracts

Companion to [`../REQUIREMENTS.md`](../REQUIREMENTS.md) §11. Defines the storefront, checkout, reader, admin and
vendor surfaces, plus the async event vocabulary that binds the modules.

## 1. Conventions

| Aspect | Rule |
| --- | --- |
| Transport | HTTPS only, JSON. Storefront reads are served through server components/BFF; these routes are the contract behind them and the public surface for apps. |
| Versioning | Path-versioned `/api/v1/...`. Breaking changes ship a new version; fields are added, never repurposed. |
| Idempotency | All `POST`/`PATCH`/`DELETE` accept `Idempotency-Key`; replays return the original response with `Idempotent-Replay: true` (EC-11.0-3). |
| Money | `{ "amount": 2499, "currency": "USD", "formatted": "$24.99" }` — integer minor units, server-formatted (EC-11.9-9/10). |
| Context | `Accept-Language`, `X-Currency`, `X-Vendor-Scope` (optional) resolve locale, currency and tenant. Server echoes the resolved values in `X-Resolved-*`. |
| Pagination | Cursor-based: `?cursor=&limit=` → `{ "items": [], "next_cursor": null }`. |
| Errors | RFC 9457 Problem Details: `{ "type", "title", "status", "detail", "code", "errors": [{ "field", "code", "message" }] }`. `code` is stable and machine-actionable; `detail` is localized. |
| Auth | Session cookie (web) or `Authorization: Bearer` (apps, vendor API). Every request re-authorizes server-side (EC-11.10-3). |
| Rate limits | Per-identity token bucket; `429` returns `Retry-After`. Auth, coupon, search and download endpoints carry stricter buckets (EC-11.10-5). |

## 2. Storefront & discovery

```http
GET  /api/v1/storefront/home                      → { modules: StorefrontModule[] }
GET  /api/v1/storefront/modules/{moduleId}        → { module: StorefrontModule }   # streamed/personalized
GET  /api/v1/products?cursor=&limit=&facets=...   → { items: ProductCardModel[], facets, next_cursor }
GET  /api/v1/products/{slug}                      → ProductDetailModel
GET  /api/v1/products/{slug}/reviews?star=&verified=&sort=
GET  /api/v1/products/{slug}/questions
GET  /api/v1/products/{slug}/related?placement=pdp_similar
GET  /api/v1/authors/{slug}                       → AuthorProfileModel
```

`StorefrontModule` (EC-11.2-1/2/3):

```jsonc
{
  "module_id": "best_sellers_global",
  "kind": "PRODUCT_RAIL",
  "title": "Global Best Sellers",
  "subtitle": null,
  "layout": "CAROUSEL",           // CAROUSEL | GRID | EDITORIAL_SPLIT | HERO
  "personalized": false,          // true → streamed after shell, never blocks LCP
  "min_items": 4,
  "fallback_module_id": "new_releases",
  "editorial_link": { "kind": "REVIEW", "id": "rev_...", "label": "Read the review" },
  "items": [ /* ProductCardModel[] — schema in REQUIREMENTS.md §11.2.2 */ ]
}
```

`ProductDetailModel` extends `ProductCardModel` with: `variants[]` (per-format price, availability, ISBN,
delivery expectation), `gallery[]`, `model_3d`, `metadata` (publisher, imprint, language, pub date, page count,
dimensions, edition), `contributors[]` with roles, `description_html`, `quotes[]` (§4 links, EC-11.3-9),
`sample` (`{ available, kind: "EXCERPT", excerpt_scope }`), `rating_histogram`, `taxonomies[]`, `vendor`.

### Search

```http
GET /api/v1/search?q=&type=products|content|all&facet[category]=&facet[format]=
                  &price_min=&price_max=&rating_min=&sort=&cursor=
GET /api/v1/search/suggest?q=          # < 100 ms p95, grouped suggestions (EC-11.7-3)
```

Response carries `query_id` — every downstream click/add-to-cart reports it for relevance attribution, and
`applied_rules[]` exposes which merchandising rule fired (EC-11.7-5).

## 3. Cart

```http
POST   /api/v1/cart                                  # create (anonymous or authed)
GET    /api/v1/cart
POST   /api/v1/cart/lines            { variant_id, quantity }
PATCH  /api/v1/cart/lines/{lineId}   { quantity }                       # debounced, clamped
DELETE /api/v1/cart/lines/{lineId}                                      # soft delete, 10s undo
POST   /api/v1/cart/lines/{lineId}/restore                              # undo (EC-11.4-2)
POST   /api/v1/cart/lines/{lineId}/save-for-later
POST   /api/v1/cart/coupons          { code }
DELETE /api/v1/cart/coupons/{code}
POST   /api/v1/cart/shipping-options { address }                        # live carrier rates (EC-11.4-7)
POST   /api/v1/cart/merge            { anonymous_token }                # sign-in merge (EC-11.4-4)
```

Every cart response returns the fully re-validated state (EC-11.4-12):

```jsonc
{
  "id": "cart_...",
  "currency": "EUR",
  "groups": [
    { "kind": "PHYSICAL", "label": "Ships to you", "lines": [ /* ... */ ] },
    { "kind": "DIGITAL",  "label": "Available instantly", "lines": [ /* ... */ ] }
  ],
  "totals": {
    "subtotal": {}, "discounts": [{ "code": "SPRING", "label": "...", "amount": {} }],
    "shipping": {}, "tax": {}, "grand_total": {}
  },
  "delivery_estimate": { "from": "2026-08-18", "to": "2026-08-21" },
  "notices": [
    { "code": "PRICE_CHANGED", "line_id": "cl_...", "old": {}, "new": {} },
    { "code": "ALREADY_OWNED", "line_id": "cl_...", "reader_url": "/reader/ent_..." },
    { "code": "QUANTITY_CLAMPED", "line_id": "cl_...", "available": 3 }
  ]
}
```

Coupon rejection codes (EC-11.4-5, never a generic failure): `COUPON_NOT_FOUND`, `COUPON_EXPIRED`,
`COUPON_NOT_STARTED`, `COUPON_MIN_SUBTOTAL`, `COUPON_SCOPE_MISMATCH`, `COUPON_USAGE_LIMIT`,
`COUPON_CUSTOMER_LIMIT`, `COUPON_NOT_STACKABLE`.

## 4. Checkout & payments

```http
POST  /api/v1/checkout                    { cart_id, mode: "GUEST"|"AUTHENTICATED" } → CheckoutSession
GET   /api/v1/checkout/{id}                                                  # resumable (AC-11.4-B)
PATCH /api/v1/checkout/{id}/contact       { email }
PATCH /api/v1/checkout/{id}/addresses     { shipping, billing, same_as_shipping }
GET   /api/v1/checkout/{id}/delivery-options
PATCH /api/v1/checkout/{id}/delivery      { option_id }
POST  /api/v1/checkout/{id}/payment-intent { provider: "STRIPE"|"PAYPAL", method }
POST  /api/v1/checkout/{id}/confirm        { provider_token }               # may return 3DS action
GET   /api/v1/checkout/{id}/status                                          # poll for webhook-driven state
POST  /api/v1/addresses/validate           { address } → { normalized, suggestions[], status }
```

`CheckoutSession.state`: `SESSION → ADDRESS → DELIVERY → PAYMENT → REVIEW → AUTHORIZED → CAPTURED` (+ `FAILED`,
`EXPIRED`). Each transition emits a funnel event.

**Authority rule (EC-11.4-19):** `confirm` returns `AUTHORIZED` at most; the order becomes `PAID` only when the
provider webhook is processed. The browser never finalises an order.

```http
POST /webhooks/stripe          # signature-verified, deduped on provider_event_id
POST /webhooks/paypal
```

Webhook handling is exactly-once via `payments.webhook_event` (AC-11.4-D): verify signature → insert event row
(unique constraint) → process in a transaction → emit domain events via the outbox.

## 5. Account, entitlements & reader

```http
GET    /api/v1/account/orders?cursor=
GET    /api/v1/account/orders/{id}                       # timeline + shipments + tracking
GET    /api/v1/account/orders/{id}/invoice.pdf           # server-rendered, archived (EC-11.5-3)
GET    /api/v1/account/library                           # entitlements + reading progress
GET    /api/v1/account/addresses  · POST · PATCH · DELETE
GET    /api/v1/account/payment-methods · POST(token) · DELETE
GET    /api/v1/account/wishlists  · POST · PATCH · DELETE
GET    /api/v1/account/reviews
POST   /api/v1/account/data-export        # GDPR (EC-11.10-8 / EC-11.5-8)
POST   /api/v1/account/deletion-request
```

### Reader

```http
GET  /api/v1/reader/{entitlementId}/manifest       → Web Publication manifest + short-lived resource tokens
GET  /api/v1/reader/{entitlementId}/resource/{href}  # entitlement-checked, streamed, chunked
GET  /api/v1/reader/{entitlementId}/download         # 302 → signed URL, watermarked, rate-limited
POST /api/v1/reader/{entitlementId}/sync             # offline outbox replay (EC-11.5-21)
GET  /api/v1/reader/{entitlementId}/state            # position + annotations + bookmarks since cursor
POST /api/v1/reader/annotations/{id}/share-as-quote  # highlight → public quote (EC-11.5-11)
GET  /api/v1/reader/sample/{variantId}/manifest      # excerpt-scoped (EC-11.3-10/11)
```

Sync payload — idempotent by client-generated annotation ID:

```jsonc
{
  "device_id": "dev_...",
  "since": "2026-08-12T09:14:00Z",
  "position": { "cfi": "epubcfi(/6/14!/4/2/2[c02]/1:120)", "percent": 0.412, "updated_at": "..." },
  "annotations": [
    { "id": "an_01J...", "kind": "HIGHLIGHT", "cfi_range": "...", "selected_text": "...",
      "note_text": null, "color": "amber", "updated_at": "...", "deleted": false }
  ],
  "bookmarks": [ { "id": "bm_01J...", "cfi": "...", "label": "Chapter 3", "deleted": false } ]
}
```

Response returns the reconciled server state plus `conflicts[]` (position conflicts surface the
"jump to furthest / stay here" prompt of EC-11.5-10; annotation conflicts retain both versions — a user's note
is never silently dropped, EC-11.1-10).

**Every reader route re-checks the entitlement** (`revoked_at IS NULL`) before returning a single byte
(EC-11.5-19, AC-11.5-D). Revocation invalidates outstanding resource tokens.

## 6. Admin & vendor

```http
# Catalogue (EC-11.6-1..6)
GET|POST|PATCH|DELETE /api/v1/admin/products[/{id}]
POST /api/v1/admin/products/import          { format: "CSV"|"JSON"|"ONIX", dry_run: true } → ImportReport
GET  /api/v1/admin/products/export?format=CSV|JSON|ONIX
POST /api/v1/admin/media                    # multipart → derivative generation job
POST /api/v1/admin/digital-assets           # EPUBCheck + virus scan + encrypt at rest

# Inventory (EC-11.6-7..12)
GET  /api/v1/admin/inventory?low_stock=true
POST /api/v1/admin/inventory/adjustments    { variant_id, warehouse_id, delta, reason, note }
POST /api/v1/admin/inventory/transfers
GET  /api/v1/admin/inventory/movements?variant_id=

# Orders & fulfilment (EC-11.6-20..22)
GET  /api/v1/admin/orders?state=&q=
POST /api/v1/admin/orders/{id}/refund       { lines[], amount, restock, revoke_entitlements }
POST /api/v1/admin/orders/{id}/shipments    { lines[], carrier, service_level } → label
POST /api/v1/admin/returns/{id}/receive

# Finance & analytics (EC-11.6-14..19)
GET  /api/v1/admin/analytics/sales?from=&to=&group_by=format|author|category|vendor|country
POST /api/v1/admin/reports/tax              { period, jurisdiction, format: "CSV"|"XLSX"|"PDF" } → job
GET  /api/v1/admin/reports/{jobId}          # async, emailed/download link

# Merchandising
PUT  /api/v1/admin/storefront/modules       # order, schedule, targeting — versioned + audited
PUT  /api/v1/admin/search/rules             # pins, boosts, synonyms, redirects
```

Vendor endpoints mirror the admin surface under `/api/v1/vendor/...`, hard-scoped to the caller's `vendor_id`
by row-level security (EC-11.8-2/5). A vendor request for another tenant's resource returns `404`, never `403` —
existence itself is not disclosed.

```http
GET  /api/v1/vendor/dashboard
GET  /api/v1/vendor/orders          · POST /{id}/fulfil
GET  /api/v1/vendor/inventory       · PATCH
POST /api/v1/vendor/products                       # → platform approval queue (EC-11.8-6)
GET  /api/v1/vendor/payouts         · GET /{id}/statement.pdf
```

## 7. Domain events

Published via the transactional outbox (EC-11.0-2). Envelope: `{ id, type, version, occurred_at, tenant_id,
aggregate_id, actor, payload, correlation_id }`. Consumers must be idempotent on `id`.

| Event | Primary consumers |
| --- | --- |
| `catalog.product.published` / `.updated` / `.archived` | search index, sitemap, recommender, cache purge |
| `pricing.price.changed` | search index, cart re-validation, price-drop notifications |
| `inventory.level.changed` | search index, back-in-stock notifications, low-stock alerts |
| `cart.item.added` / `.removed` | recommender features, abandonment workflow |
| `checkout.session.transitioned` | funnel analytics |
| `order.placed` / `.paid` / `.cancelled` / `.refunded` | inventory commit/release, entitlements, email, ledger, payouts, analytics |
| `entitlement.granted` / `.revoked` | reader access, library projection, local cache purge |
| `shipment.created` / `tracking.event.received` | customer timeline, notifications |
| `review.published` | rating aggregate, search index, PDP cache purge |
| `reader.session.completed` | reading stats, recommender features |
| `vendor.payout.settled` | vendor statements, finance reconciliation |

## 8. Provider ports

Each external dependency sits behind an interface with a declared degraded mode (EC-11.11-5).

| Port | Implementations | Degraded mode |
| --- | --- | --- |
| `PaymentProvider` | Stripe, PayPal | Disable the failing method via flag; other methods stay live |
| `TaxProvider` | Stripe Tax, Avalara, TaxJar | Block checkout for affected jurisdictions rather than guess tax |
| `CarrierProvider` | FedEx, DHL, UPS, postal | Fall back to configured flat-rate table (EC-11.9-5) |
| `SearchProvider` | Algolia, Elasticsearch | Degrade to Postgres full-text on the catalogue projection |
| `RecommendationProvider` | Internal hybrid recommender | Curated/best-seller rail, same render (EC-11.7-16) |
| `AddressValidationProvider` | Google Places, Loqate | Accept as entered with a soft warning |
| `FxRateProvider` | ECB / commercial feed | Use last cached rate; alert on staleness > 24 h |
| `MediaPipeline` | Image CDN + transcoder | Serve last-generated derivative; queue regeneration |
