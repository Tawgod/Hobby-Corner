# Core Operations / Special Orders / Ordering / Preorders / GW Preorders — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — implemented, merged and deployed; ongoing operational acceptance and future shared-service conversion remain

## Source

- Repository: `Tawgod/Lightspeed`
- Authoritative branch: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Core UI/navigation PR: #24 — **MERGED** 2026-10-28; feature head `69cc608e1bb89f5eb8715cf1b45d9faa5de1d2d7`; merge commit `d40c1890a250d1d68348fff1377e08c5e190f24e`
- Shared UI foundation PR: #27 — **MERGED** before PR #24
- Superseded predecessor PRs: #21 and #23 remain open/draft for history only. Their valid shared-UI/navigation behavior is represented in consolidated source + PR #24; do not merge them independently.
- Current consolidated head is 5 commits downstream of the PR #24 merge.

## Implemented

### Employee access and shared shell

- Four core employee pages share the Hobby Corner navy/blue navigation/header:
  - Special Orders
  - Ordering
  - Preorders
  - GW Preorders
- Original Hobby Corner wordmark, current-page state, responsive More menu, visible focus treatment and shared `hc-ui` styling.
- Employee-facing login uses the existing Timeclock four-digit PIN and `HCStaffAuth`; no parallel employee/password system.
- Signed staff sessions restore across refresh. Sign-out clears the session and does not silently reauthenticate on refresh.
- Backend privileged requests recheck current employee state through Timeclock.
- Current business policy allows active Core Operations employees to create/edit through existing tools; there is no current per-employee edit/create restriction. Do not silently change this policy while adopting PR #32/#33 shared permissions.
- Legacy admin-key authentication remains a server-side compatibility/fallback path, not the normal employee UI.

### Special Orders

- Customer and item Special Order workflow with current lifecycle/status history.
- Product/customer lookup and matching against existing Lightspeed/Special Orders data.
- New-customer and contact fields including Discord, Facebook Messenger and WhatsApp alongside email/phone.
- USPS/address helper behavior remains part of the consolidated platform.
- Legacy workbook import remains available as an administrative migration utility and was intentionally moved to the bottom of the Special Orders page.
- Durable operational records remain in Railway PostgreSQL, not browser/Chrome storage.

### Ordering and Lightspeed-first purchasing review

- Supplier/category/status work queue for Special Order demand.
- Supplier routing/preferences and routing/activity history.
- Read-only current Lightspeed purchase-order context and open/unfulfilled fulfillment demand for cross-checking.
- Customer/product enrichment for Lightspeed fulfillment demand.
- Current PO references and ordering-check information.
- Lightspeed remains the normal authoritative PO workspace for current Ordering; historical local draft/PO-write compatibility code must not become a second default purchasing system.
- Existing Lightspeed-first receiving review is duplicate-safe and tracks cumulative PO-to-Special-Order allocations. Invoice Reconciliation must remain separate from physical receiving.

### Customer receiving / notification review

- Received Special Order allocation/review flow and notification-review records are implemented.
- Employee notification review can queue supported destinations:
  - Discord
  - Facebook Messenger
  - WhatsApp
  - email
  - SMS
- Approved Delivery Queue is implemented.
- Queueing a notification is not proof that a production sender exists for that channel.
- Current production Discord Bot `main` does **not** contain the later Special Orders ready-delivery / preorder-watch worker markers checked in this audit. Email/SMS/Messenger/WhatsApp production senders are also not verified as implemented. Do not mark a customer notified merely because a queue item exists.

### Preorders

- Dedicated preorder campaign/allocation page separate from normal Special Orders.
- Discord Preorder Watch queue with WATCHING / AVAILABLE / CONVERTED / DISMISSED lifecycle in the Special Orders backend/UI.
- Preorder campaign demand, allocation suggestions and received-inventory review remain separate from normal Special Orders status semantics.
- Bot-side automatic/manual Discord capture support has historical development work, but production Discord Bot `main` did not contain the preorder-watch worker markers at this audit; treat bot capture deployment separately from the web queue.

### GW Preorders

- GW source sync/scrape, campaign status and customer-response workflow.
- Discord preview/publish flow.
- Duplicate-safe GW re-sync by SKU/external entry is in the currently deployed consolidated head.
- Customer-facing GW cleanup includes short-code extraction/readable title formatting from prior work.
- GW-specific Discord customer confirmation processing exists in the Special Orders service when configured.

## Tested

### Automated / source

- PR #24 final Core Operations regression after Legacy workbook placement: GitHub Actions run `40742593872` — **PASS**.
- Earlier final-head Core Operations UI/navigation run `40739200019` — **PASS**.
- Scanner integration regression on the same PR #24 base `40739200256` — **PASS**.
- Shared UI reconciliation `40739199988` — **PASS**.
- Automated auth/session coverage includes:
  - invalid PIN fail-closed
  - valid PIN session creation
  - sign-out
  - expiry
  - restoration
  - denied/deactivated employee session clearing
  - server-side employee reauthorization
- Headless Chromium smoke covers responsive layout, horizontal-overflow checks, More-menu focus/open layout, PIN focus and 100/125/200% CSS zoom simulation.

### Manual browser acceptance recorded in this chat

- Native browser zoom appeared functional at tested zoom levels.
- Valid employee PIN login worked.
- Fake/invalid PIN did not authenticate.
- Core navigation/buttons appeared functional.
- Active session remained signed in after refresh.
- After explicit sign-out, refresh did not automatically sign the employee back in.
- Legacy workbook import was reviewed for placement and moved to the bottom of Special Orders.

### Not freshly re-run in this final audit

- A complete live end-to-end production transaction pass for every Special Orders/Ordering/Preorders/GW workflow.
- Live session-expiry timing and a deactivated employee account were not manually exercised in this chat; fail-closed behavior is covered by automated tests/source contract.
- Production customer-message delivery for every notification channel was not verified.

## Deployed

- Railway project: `Hobby Corner`, production environment.
- `lightspeed-api`:
  - source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
  - latest deployment `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2`
  - commit `f50c3309824986633c3ba37a95e6eb43aae15a3c`
  - status **SUCCESS**
- `timeclock`:
  - same consolidated source, root `/timeclock`
  - latest deployment `16f7d019-9267-4196-b85e-0d4c2b15f121`
  - commit `f50c3309824986633c3ba37a95e6eb43aae15a3c`
  - status **SUCCESS**
- `special-orders-test`:
  - same consolidated source
  - latest deployment `b327d98a-e178-495b-ad72-2936dccaee0a`
  - commit `f50c3309824986633c3ba37a95e6eb43aae15a3c`
  - status **SUCCESS**
- The deployed `f50c330...` commit is 5 commits downstream of PR #24 merge commit `d40c189...`, so the merged Core Operations navigation/auth shell is included in the deployed source.
- No Chrome extension publication is implied by these Railway deployments.

## Shared dependencies

### Timeclock / staff auth

- `SHARED_STAFF_AUTH_PERMISSIONS.md` is the current contract.
- Timeclock remains the PIN/active-employee authority.
- `services/staffAuthGateway.js` issues short-lived signed sessions and privileged requests must reauthorize current employee state.
- Future permissions must be enforced server-side by exact operation; do not infer write authority merely from UI visibility or a role label.
- Existing all-active-employee Core Operations edit/create behavior must remain unchanged unless the owner explicitly approves a policy change.

### Shared Lightspeed services

- PR #32 `feature/shared-lightspeed-services-phase1-20261029@7c20b3d9f90382b6fafeb5dc3d9a92108f4c14e1`: open, ready for review, **unmerged/not deployed**.
- PR #33 `feature/shared-lightspeed-services-phase2-reads-20261029`: open/draft, stacked on #32, **unmerged/not deployed**.
- Core Operations still uses existing deployed feature clients. Future conversion should reuse the shared transport/read/policy services instead of creating another Lightspeed client.
- Preserve tested Special Orders matching logic; extract/reuse rather than rewrite it.

### Product Manager / Product Scanner / PO Companion

- Product Manager PR #28 remains draft/unmerged; employee-specific saved profiles/drafts are keyed to verified employee identity. The planned Invoice Updates selector is **global invoice context**, not part of a personal profile.
- Product Scanner PR #26 remains open/unmerged and owns shared Scanner/Toolkit popup/navigation work. Reuse its product matching/scan proposals; do not add a second matcher.
- PO Companion PR #31 remains draft/unmerged and should consume shared PO reads/auth rather than creating a separate purchasing identity/API.
- Chrome shared navigation is governed by `CHROME_EXTENSION_INTEGRATION.md`; Core Operations web navigation must not become a competing extension registry.

### Consignment / store credit

- Consignment PR #30 remains isolated/draft/unmerged. Store-credit behavior belongs to the shared Lightspeed/Consignment contracts and must not be mutated from Core Operations without explicit operation authorization.
- Do not use Consignment beta state as production customer/product/inventory truth.

### PostgreSQL

- Special Orders operational state is durable in Railway PostgreSQL.
- New invoice/tracking/audit data should use shared durable PostgreSQL staging/adapters rather than browser-only state.
- PR #32's additive audit/idempotency migration is unmerged/unapplied; do not assume it is live.

### Discord / Rewards / customer synchronization

- Production `Hobby-Corner-Discord-Bot` runs `Tawgod/Hobby-Corner-Discord-Bot:main@7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9`, Railway deployment `3a8e9375-aad7-4c47-9721-66790febaeae`, status **SUCCESS**.
- Production `Hobby-Corner-Rewards` runs the same repository `main@ce54862f67d678f8a1cb77302e520c59fb0c7118`, Railway deployment `07c0c365-a8d4-4a2e-a120-2034e4db91fc`, status **SUCCESS**.
- Rewards/customer sync are shared customer-data consumers; avoid parallel customer identity stores and coordinate schema/API changes before modifying shared customer fields.

## Planned shared Invoice Reconciliation dependency

Source of truth: `FEATURE_INVOICE_RECONCILIATION.md`. This is **Planned**, not a new standalone tool and not implemented/deployed by Core Operations.

Core Operations requirements that must be preserved:

- Read supplier emails containing invoices, preorder confirmations, shipping/tracking and related documents through the future shared ingestion layer.
- Match an invoice to one existing Lightspeed PO or stage a new PO proposal when no unique PO exists.
- After the complete invoice is resolved and explicitly approved, the shared backend may:
  - update the approved existing PO, or
  - create a new `SUPPLIER` purchase order in **OPEN** state.
- High-confidence 90%+ product matches may be staged automatically, but must not mutate production before invoice approval.
- Existing products may gain a **secondary/non-primary supplier association** with supplier SKU/cost without replacing the primary supplier.
- Maintain employee-verifiable supplier shipping-sender aliases.
- Link tracking/shipping evidence to supplier + invoice + PO/shipment; ambiguous matches remain review-required.
- Special Orders should display linked shipments as **On the way / In transit**, with carrier/tracking/ETA/source/confidence where known.
- **Invoice Reconciliation must never receive products, write a physical received quantity, change inventory-on-hand, mark a PO RECEIVED, mark a Special Order READY, or notify a customer solely because an invoice/tracking email exists.**
- If an API cannot safely represent invoiced quantity separately, retain that value in Hobby Corner staging instead of writing it to a receiving field.
- Product Manager, Scanner, PO Companion and Core Operations must share this backend/state; no duplicate mailbox ingestion, product matcher, PO writer, authentication system or navigation system.

## Shared files / integration surfaces affected

Primary current Core Operations surfaces:

- `special-orders.html` / `special-orders-client.js` / `special-orders.js`
- `ordering.html` / `ordering-client.js`
- `preorders.html` / `preorders-client.js`
- `gw-preorders.html` / `gw-preorders-client.js`
- `shared-ui/hc.css`
- `shared-ui/core-ops-compat.css`
- `shared-ui/staff-auth.js`
- `services/staffAuthGateway.js`
- `server.js`
- Special Orders PostgreSQL schema/tables and related route/service modules

## Important decisions / architecture

- Consolidated branch is the only authoritative Lightspeed application base.
- GitHub code state, Railway deployed state and Chrome-extension release state are separate facts.
- Timeclock is the employee identity authority; do not add another authentication system.
- PostgreSQL is authoritative for durable Hobby Corner operational/staging records.
- Lightspeed remains authoritative for Lightspeed customer/product/inventory/PO/sale state.
- Current Ordering is Lightspeed-first; do not revive local supplier drafts as a competing normal PO system.
- Invoice/tracking evidence is documentary and must never be treated as physical receiving.
- Shared product matching and shared Lightspeed API modules should be reused rather than copied.
- Chrome extension release coordination is separate from Core Operations web deployment and must use the central release queue.

## Remaining blockers / unfinished work

- Continue real operational acceptance of representative Core Operations workflows on the deployed consolidated source, especially receiving/notification edge cases after later consolidated commits.
- Complete/verify production customer-message delivery integration:
  - ready-order Discord worker is not verified on production Discord Bot `main`
  - email sender pending
  - SMS sender pending
  - Messenger sender pending
  - WhatsApp sender pending
- Decide and implement the production Discord preorder-watch capture path if desired; the web queue/backend exists but production bot capture was not found in `main` during this audit.
- PR #21 and PR #23 may be closed as superseded when desired; do not merge them.
- Migrate future read/write consumers toward PR #32/#33 shared services only after those PRs are approved/merged/tested.
- Invoice Reconciliation remains planned and unimplemented.

## Decisions needed

- Whether/when to complete production notification senders beyond queueing.
- Whether/when production Discord bot should capture Preorder Watch requests.
- Future per-operation permission policy, if the owner wants restrictions beyond the current all-active-employee Core Operations behavior.
- Priority/timing of Invoice Reconciliation relative to January 2027 Lightspeed migration.
- Separate approval is required before any new production Lightspeed writer, shared DB migration, production deployment change or Chrome-extension release.

## Recommended next action

1. Continue Core Operations runtime acceptance against the deployed consolidated `f50c330...` source, focusing on receiving + notification/delivery edge cases rather than more navigation work.
2. Keep current all-active-employee Core Operations behavior unchanged while shared-service PR #32/#33 are reviewed.
3. Then implement the first read-only/staging phase of Invoice Reconciliation using the shared services/product matcher/PostgreSQL plan; do not start with PO writes or receiving.
4. Treat notification sender completion as a separate operational work item with explicit production bot/service testing.

## Restrictions / safety

- Do not merge, deploy, change Railway credentials, modify live employee/customer data, execute Lightspeed writes, apply shared-service database migrations, or publish/package a Chrome extension without explicit authorization.
- Do not independently merge PR #21/#23 or use retired feature branches as a new base.
- Do not create duplicate employee authentication, Lightspeed clients, product matching engines or shared navigation systems.
- Do not let Invoice Reconciliation receive inventory or alter stock-on-hand under any circumstance.

## Documentation

- `HOBBY_CORNER_PROJECT.md`
- `HOBBY_CORNER_CHAT_TRANSITION.md`
- `ROADMAP.md`
- `LIGHTSPEED_SHARED_SERVICES.md`
- `SHARED_STAFF_AUTH_PERMISSIONS.md`
- `FEATURE_INVOICE_RECONCILIATION.md`
- `SHARED_ADDON_UI_UX.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `handoffs/timeclock-split-recall.md`
- `handoffs/product-scanner.md`
- `handoffs/po-companion.md`
- `handoffs/product-manager.md`
- `handoffs/consignment.md`

## Secondary work from this conversation

This conversation also performed coordination work outside the Core Operations web pages:

- Created/established `CHROME_EXTENSION_INTEGRATION.md` as the central shared Chrome-extension architecture contract and linked it into the release queue/project documentation.
- Reconciled PR #22 Timeclock + Split/Recall visual-only `extension/content.js` work and added regression coverage. PR #22 is still open/draft/unmerged and is now 7 commits behind the current consolidated branch; continue from `handoffs/timeclock-split-recall.md`, not from this Core Operations handoff.
- Began Scanner/Toolkit reconciliation discussion around PR #26, but Scanner ownership is in `handoffs/product-scanner.md`. PR #26 remains open/unmerged and is 7 commits behind current consolidated at this audit.
- No Chrome extension version bump, package, Web Store publication or independent extension deployment occurred in this chat.
