# Unified Orders & Preorders 1.0 — January existing-source reconciliation — 2026-11-27

Status: partial source reconciliation, manager ownership review required; no application changes or release authorization. Fresh Tools workstream owns Special Orders, Ordering, general/GW preorder feature workflows and receiving/fulfillment UI, not shared foundation services or Split/Recall register code. Reserved branch feature/tool-unified-orders-january-20261127 not created. Production baseline Tawgod/Lightspeed integration/hobby-corner-consolidation 014a7a949fe570b756b48d8f59995c1b0a434859. Current Railway production special-orders-test deployment 201d651f-62b6-43c5-aba3-59fd97f6fe09 and lightspeed-api 288d5089-62d4-4f22-9c7f-8fdd26d8574d both SUCCESS at baseline; Discord Bot a972688e-e6c7-4eea-9ca4-aef8021b314a SUCCESS main 7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9. Metadata only, no runtime business requests. Never use special-orders-test for mutations/testing.

Exact source inspected: special-orders.js dd432d6737b918e458bd2aefc020f6d0e912cf1a (4285 lines), db/special_orders_schema.sql 8da40b83815821f133f840540c2a3d7fbc17a50e, special-orders-import.js 9af4cd67d491c6219fb214aad908af91a89fc275, routes/specialOrderProducts.js d07ba98ef89c05e622a7f42a6558266632441683, server.js 4b567044e649c1a1600c87604dfe71b93106ed3d, routes/depositConversion.js f6e533895ab5446379e5dacd4b53e7f4d6277ca5. Four HTML/client pairs retrieved: special-orders, ordering, preorders, gw-preorders. Existing schema shares customers/products/suppliers but separate special_order_items/inventory_allocations and preorder_requests/preorder_allocations; retain IDs and histories, propose additive linked lifecycle projection and one downstream fulfillment path rather than replacement tables or duplicate obligations. Exact data cardinalities and live schema not inspected.

Concrete static findings: special-orders.js 2185–2283 allocation selects only REQUESTED rows without existing allocation, marks partial allocation ALLOCATED, so remainder cannot naturally enter next round; caller available_quantity override needs authoritative receipt cap. 2284–2338 pickup actions lack explicit transition/replay guards, accept body changed_by; repeated pickup can append events. 2659–2697 hard deletion with cascading history FK risks historical evidence. 2749–2798 status route accepts any valid status without transition validation, body actor. 3733–3834 receipt route caps only positive reported quantity, conflates zero/unknown; per-item locks do not serialize PO/product total across different items; takes received_by from request; excludes CANCELLED from protected status list, allowing cancelled line resurrection; PO helper filters out RECEIVED/CLOSED, potentially preventing post-receipt allocation; duplicate line product quantity uses max rather than validated line-level aggregation. Source risks, not reproduced in live execution. GET supplier sync writes cache, PO read failures become empty lines. Deposit conversion route exists in separate register integration; do not duplicate credit issuance or modify without Split owner/Customer/Core review. Historical GW Graph scrape, campaign cleanup, publication/reaction endpoints and confirmation worker exist; auto-submit status is not external form submission worker; historical Discord reaction bridge/sender development only, current bot source not independently inspected. Preserve/manual fallback with explicit owner approval, no blind external retries.

Owner January plan 60f202c0e0552f642f3f63dad4da6d7a6f73f6c7: common downstream order lifecycle; payment normally upon receipt, optional configurable MSRP deposit desirable but collection/refund rules unsettled; actual GW automatic form submission P0, GW Discord preferred; general ready notifications P1. Manual Special Orders migration acceptable, GW migration required, general preorder migration if feasible otherwise approved fallback, nonpickup list migration required; GW sheet may coexist briefly only with explicit source-of-truth/cutover and dedupe. Proposed P0: shared linked order/line identity, remaining quantity across repeated receipts and pickups, safe transitions/cancel/exceptions, exact customer/product links, PO evidence, liability continuity, GW form duplicate-safe submission/readback, migration dry run and employee acceptance. No new order DB. Native Lightspeed purchasing remains primary; full standalone ordering enhancement not prerequisite.

Ownership proposal (not allocation): four feature HTML/client pairs, special-orders.js feature handlers, special-orders-import.js and narrowly additive order schema changes after manager review; routes/specialOrderProducts.js shared Product Manager/Catalog dependency, server.js shared mount/labels/Split held, shared-ui and extension held, routes/depositConversion.js and orderSplit* held by separate register owner; bot branch changes need separate coordination. Customer/Sales contract: order identities, outstanding quantity, pickup/cancel, liabilities and migration, exact customer links; Purchasing: complete PO line/received evidence incl closed PO, zero vs unknown, supplier identity; Inventory: receipt/allocation concurrency and durable receipts; Core: shared reads/writes, idempotency and readback; Catalog: exact product/variant, ambiguity; Security/SO: actual scoped operation enforcement, server-derived actor, trusted local PIN, no legacy bypass. Current handoffs retrieved customer-sales-foundation b42147ace1e7c0e5a4983ea3dff402d630aaf661, purchasing-supplier-foundation f56dfddbc0102b7cf3e6ea05b58548cb2b4163b8, inventory-foundation 1a3c84307bf0c53599026a0b3bbf78eec0dc7c62, core-api-foundation ed3ec5a764db2c9ebdc436bdf99d1621b6226878, product-catalog-foundation e84c6021271db6c5a7b9f883175a16a9cc3b8835. V10 frozen; Core/Catalog actual provider admission HOLD, Customer/Purchasing standby pending narrow allocation.

PR #24 merged 69cc608e1bb89f5eb8715cf1b45d9faa5de1d2d7; #72 open draft 13e27d3d153d51bc7a533a2df9b0abc2698e958b synthetic read-only; #73 open draft 6d3d43ffa7e77827797ced6cf27670c0d44b2c1a unmounted fake Timeclock discovery. Existing run 43356076149 job 131658312007 conclusion success independently read; 73/73 reported in PR, raw count not rechecked. No new tests, CI, grants, migrations, publication or deployment. #139 HOLD. Current full test source inventory, bot branch diff, actual database schema/row reconciliation and employee workflow tests remain unfinished. Next: Tools Manager approve exact paths and narrow dependencies with Foundations, then complete source/test reconciliation and isolated regression cases before implementation; no application edits until approved.

---

# Core Operations / Special Orders / Ordering / Preorders / GW — Current Handoff

## Real employee self-discovery preflight prepared — no business permissions (2026-11-12)

On top of accepted synthetic test pilot draft #72, new draft [Lightspeed PR #73](https://github.com/Tawgod/Lightspeed/pull/73) composes existing canonical Timeclock verification and signed staff sessions to permit **only a future read-only employee /self discovery**. No live service mounted; no real Timeclock PIN, live Special Orders, customer data, role grant, Owner authority or 38-route permission activation. Login selector must match the PIN-resolved employee ID; source-IP and account login throttle is persistent and restricted; an actual Owner assignment is checked independently, not inferred. Synthetic 901 rejected. [CI run 43356076149](https://github.com/Tawgod/Lightspeed/actions/runs/43356076149) **73/73 PASS**, source-only. Draft PR #72 synthetic Railway app remains pinned to original code `f023bad` and verified with user physical-browser acceptance. Real operations remain **Blocked**, requiring independent Owner and route matrix approval.

---

## Special Orders employee read pilot — physical-browser acceptance PASS (2026-11-12)

**Status: Testing PASS / Deployed (separate synthetic-only Railway TEST); real operations not deployed.** **Live evidence:** Railway HTTP request logs recorded six 200 successes in the real test deployment on November 12, 2026 (CST): signed synthetic employee login **8:37:19 PM**, one-use workstation registration **8:38:32 PM**, challenge and signed proof **8:38:39 PM**, fixture orders **8:38:44 PM**, fixture stats **8:38:46 PM**. The operator explicitly confirmed browser testing and sign-out. Server logs corroborate the access path; browser sign-out is **user-verified**, not independently demonstrated by HTTP logs. The services are online, zero warnings/criticals, no pending changes.

Positive GET `/HobbyCorner/api/special-orders/orders` and GET `/HobbyCorner/api/special-orders/stats` returned **200** after signed synthetic employee session + one-time Ed25519 workstation verification + exact read-only PostgreSQL grant. Only `synthetic:true` fixtures, no customer/order records or Lightspeed connections. Browser sign-out was confirmed by the user; server logs do not independently prove client-side token clearing. The synthetic registration is consumed and its grant expires after 23 hours; this is **not** a permanent employee grant. Keep [PR #72](https://github.com/Tawgod/Lightspeed/pull/72) draft and real 38-scope permission proposals review-pending. Existing PR63 staging remains pinned zero-grant, no real business writes or production changes.

---

## Synthetic read-only Core Operations pilot has isolated live HTTPS — 2026-11-12

**Status: Testing / isolated test deployment SUCCESS.** Draft [Lightspeed PR #72](https://github.com/Tawgod/Lightspeed/pull/72) now runs a **separate** synthetic staff read test service on Railway. Project `HC Employee Read Pilot` `c528d08e-b835-4b72-95f2-8a05090a2195`, app `hc-employee-pilot` `01f28a7d-b7d4-4659-ae10-4a0bca20ef6b`, Postgres separate `a88faff0-5a0f-4e6d-a054-c947a67e2a43`, deployment `577c4250-dbe3-4746-9841-f92397f1fa39` **SUCCESS**, source pin `f023bad`. Page: `https://hc-employee-pilot-test.up.railway.app/HobbyCorner/`.

**Only** GET `/api/special-orders/orders` and GET `/api/special-orders/stats` return empty `synthetic:true` fixtures following signed test employee session, independently verified Ed25519 station and DB-sourced test grant. Operator enrolment is synthetic one-use test key, not real Owner passkey. Runtime has separate limited auth-table and SELECT-only grant-table roles; admin DB URL removed after one-time setup. No real Lightspeed or Core Operations DB. [CI 43348234139](https://github.com/Tawgod/Lightspeed/actions/runs/43348234139) **70/70 PASS**; [live HTTPS + Chromium 43349242115](https://github.com/Tawgod/Lightspeed/actions/runs/43349242115) **SUCCESS** with four live read-only smoke groups and non-exportable browser Ed25519 validation. Deployed requests verified 200/401/403/404 fail-closed. Positive real-device browser proof is **not yet manually completed**.

**Safety:** The 38 proposed real employee scopes remain review-pending, no production/admin/Owner grants. Existing PR #63 preview still zero-grant at `50fda74b`; no current business handler, extension, Discord, Timcorp gateway or production change. Next: test-only manual user device onboarding, then independent security/owner approval before real Timeclock/passkey and persistent role rollout.

---

## Authenticated read-only Core Operations pilot — disposable PostgreSQL acceptance PASS, 2026-11-12

**Testing / not deployed.** Draft [Lightspeed PR #71](https://github.com/Tawgod/Lightspeed/pull/71), stacked on PR #70. New unmounted test-only composition explicitly permits only GET `/orders` and `/stats` after the **real cryptographic Ed25519 workstation proof** and signed synthetic staff session both validate, and an independently operator-provisioned expiring `special-orders.read` grant exists in SELECT-only PostgreSQL. No grant = 403; PIN alone = 403; false Owner headers = 403; POST order creation = 403; grant revocation immediately denies. Responses are fixture empty records, not customer data; the source never contacts Lightspeed/Discord. The database runtime lacks mutation privileges and its read queries check those privileges again.

**CI evidence:** existing combined GitHub Actions [43345338052](https://github.com/Tawgod/Lightspeed/actions/runs/43345338052) **SUCCESS 68 tests / 68 passed, 0 failed** on `c642c8b`. Latest PR71 doc-only head `f713981`. Separate schema, read gate and test described in `docs/CORE_OPERATIONS_ISOLATED_EMPLOYEE_PILOT.md`.

**Unverified/blocked:** real Timeclock identity, strong Owner/WebAuthn, actual Chrome device, persistent independent staging database/service, approved staff permission matrix beyond the single synthetic pilot read, real Special Orders handlers, browser under gateway. The public PR #63 staging service continues to run default-deny at `50fda74b`; NO pilot deployment, permissions, business writes or PR merge.

---

## Configuration-downgrade prevention for future employee grant drafts — 2026-11-12

Draft [PR #70](https://github.com/Tawgod/Lightspeed/pull/70) adds **review-only** route-operation manifest audit and tests: exact match of 38 proposed routes, required `locked-transition-v1` and `customer-profile-sync-v1` markers, unknown routes, duplicates and wrong employee/service audience. The audit detects accidental `POST /orders` authorization under weaker `special-orders.read` or broad `special-orders.manage`. **It does not grant or enforce anything**; always says `eligibleForActivation:false`. Combined CI [43319291360](https://github.com/Tawgod/Lightspeed/actions/runs/43319291360) **66/66 passed** at code commit `673229a9` (latest `11941dd3` is documentation-only). Security review must still require validated backend route-operation mapping before installing any nonzero route manifest. PR #63 isolated Railway remains pinned to `50fda74b`, zero-grant, unchanged.

---

## All 38 candidate Core Operations employee scopes: synthetic positive-access CI PASS — 2026-11-12

**Status:** **Testing (development-only; no live grants)**. Draft [Lightspeed PR #70](https://github.com/Tawgod/Lightspeed/pull/70), branch `test/core-ops-employee-auth-acceptance-20261112` stacked on PR #63, code/workflow verification at `fa1cfeb95391d05c1b69c9e44b2c55da3b4eb42d` via [GitHub run 43318226550](https://github.com/Tawgod/Lightspeed/actions/runs/43318226550) **SUCCESS**. Latest doc-only source head `8f002b92f7432ecf1064e5bc9a675f21114c48c9`.

**Actual test coverage:** All 38 review-pending per-route employee candidate operations, each installed **only inside a disposable Node test** with signed synthetic employee session, independently signed workstation or simulated strong step-up, explicit per-operation in-memory grant. No grant/no factor/wrong factor/TOTP on protected write/revocation deny. Real `staffMfaSessions` routine ticket verifies employee/session/factor generation. Cross-employee, inactive/expired sessions, dynamic allocation refresh, customer Lightspeed sync and special-order status split deny inappropriate privilege downgrades. Public staging zero-grant factory still denies these synthetic fixtures.

**Unverified:** real Timeclock/registered workstation/real WebAuthn or IdP authentication; granted routes through deployed business HTTP handlers; durable grant persistence and server-derived write audit identity; any live customer, Lightspeed, Discord, GW or supplier operation. A trusted backend could map an incorrect operation to a route unless its manifest is reviewed: add a fail-closed mapping review before ever commissioning grants. None of these pending proposals is an accepted owner policy.

**Railway unchanged:** isolated PR #63 remains deployed at `50fda74b` with all business APIs 403 by default. Draft PR #70 not merged, no staging/prod deploy, no new test employees/services, no gateway/DNS.

---

## Reviewed Core Operations policy deployed to isolated staging, still zero-grant — 2026-11-12

**Status:** **Testing**; combined branch `Tawgod/Lightspeed:feature/shared-foundation-security-web-20261112@50fda74b19a3701d60e992db4850668d6c85b3f1` is deployed **only** to `hc-foundation-pr63` isolated Railway staging, deployment `427f570b-f36d-4040-bf91-e83a0a331721` **SUCCESS**. Scope: source pin change only; no Core Operations production change, database migration or route/employee grant.

**Verified:** Existing staging read-only HTTP and real Chromium browser smoke [43313012592](https://github.com/Tawgod/Lightspeed/actions/runs/43313012592) attempt 2 **SUCCESS**. Prefixed Store Operations, Special Orders, Preorders, GW and Ordering pages/assets and signed-out behavior pass. Protected business endpoints reject anonymous and forged identity with 403. Staging guard still uses `approvedRoutes:[]`, so 38 exact policy candidates are **not live permissions**. GW redirect hardening source is deployed but has not been exercised against real external GW/Google flows in this acceptance.

**Remaining:** Positive employee sign-in/grant and business-route acceptance in isolated staging; separate Owner identity work and future isolated reverse-proxy/gateway verification. No production deploy or Timcorp route activation approved.

---

**Last verified:** 2026-11-12  
**Status:** Testing — exact employee authorization review and combined PR #63 source reconciliation pass; production remains unchanged

## 2026-11-12 security / shared-foundation reconciliation

Core Operations employee mutation review now has **38 exact, review-pending route proposals** and no proposal grants legacy `special-orders.manage` or `ordering.manage`. Hidden supplier-cache GET writes, body-sensitive customer Lightspeed sync, locked-vs-unlocked supplier-order edits, notification staging vs delivery, and GW form redirect validation were separated and tested. The GW form fetch now revalidates every redirect hop and byte-limits response streaming.

The reviewed security parent was merged into PR #63's development branch only. Fresh checks on `50fda74b` all passed, including real-browser read-only staging smoke. The staging guard still has zero approved business routes. No production/vendor/business-record change was made.

## Source

- Repository: `Tawgod/Lightspeed`
- Production/consolidated baseline remains `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`; no production deployment changed in this review.
- Active security parent: `integration/security-all-tools-20261111@b77d7fcabc8876f84fc96c324e68fc4a4a03a479`, draft PR #61.
- Active combined shared-foundation staging candidate: `feature/shared-foundation-security-web-20261112@50fda74b19a3701d60e992db4850668d6c85b3f1`, draft PR #63; development sync PR #69 merged the reviewed security parent into this branch.
- PR #63 is verified **13 commits ahead / 0 behind** its security base; all six fresh combined workflows passed. The isolated Railway staging runtime remains pinned to its earlier approved build and was not redeployed to `50fda74b`.
- Merged Core Ops PR: #24 `feature/core-ops-ui-consistency-nav-20261028@69cc608e1bb89f5eb8715cf1b45d9faa5de1d2d7`
- Merged shared UI PR: #27
- Superseded Core Ops predecessors: PR #21 and PR #23; do not merge them independently
- Historical supplier-draft Ordering UI/API commits remain in Git history, but the current employee workflow is Lightspeed-first PO review rather than a parallel draft-PO authoring system
- Retired/historical branches that are not authoritative include `feature/order-split-poc`, `special-orders-foundation-2026-10-02`, and `special-orders-foundation-livebase-2026-10-02`

## Responsibilities / scope owned by this workstream

This handoff covers the web Core Operations family and its direct workflow integrations:

- Special Orders customer/product intake and line-status workflow
- Ordering / supplier routing / Lightspeed PO cross-check / receiving review
- Generic Preorder Campaigns and allocations
- Games Workshop weekly preorder sync, cleanup, Discord publication and response workflow
- Discord preorder-watch queue for not-yet-orderable customer interest
- customer-ready notification review/delivery queue
- Timeclock-backed employee sign-in for the four web tools
- shared Core Operations UI/navigation
- coordination points with Split/Recall, Product Scanner, Product Manager, PO Companion and Invoice Reconciliation

Split/Recall Chrome content-script development itself remains owned by `handoffs/timeclock-split-recall.md` / PR #22; this chat only verified it remained intact and did not conflict with the new Ordering/receiving status model.

## Implemented

### Shared employee authentication and UI

- Timeclock is the employee/PIN authority.
- Shared staff-auth gateway issues signed short-lived employee sessions and reauthorizes against Timeclock.
- Special Orders, Ordering, Preorders and GW Preorders share the same navy header navigation and employee PIN/session experience.
- Normal employee login uses the existing 4-digit Timeclock PIN; the legacy Special Orders admin key remains a server-side/emergency compatibility path rather than the normal employee UI.
- Shared Hobby Corner UI foundation is active on all four pages.
- PR #24 and PR #27 are merged.
- Current business behavior still allows active employees to use these tools; fine-grained operational write roles have not been introduced.

### Special Orders

- Customer search/intake, customer-local contact fields and Special Order line/status management are preserved.
- New Lightspeed item form uses live Lightspeed supplier/category/brand sources.
- Local customer notification contacts include Discord, Facebook Messenger, WhatsApp, email and phone/SMS.
- Legacy workbook import remains available as an administrative migration utility at the bottom of Special Orders.
- Status changes use the existing status/history model rather than a parallel status store.

### Dedicated Preorders and Ordering pages

- Generic preorder campaign/allocation management is separated at `/preorders`.
- Ordering is separated at `/ordering`.
- Ordering supports full list plus supplier, category and status filtering; `All` status is available.
- Line-by-line status changes reuse `PATCH /items/:id/status` and status history.
- Per-line notes are editable.
- Per-line activity log combines status changes, note submissions and preferred-supplier changes with timestamps/source where available.
- Existing notes predating activity tracking appear as a snapshot with best-available update time rather than a fabricated original note timestamp.
- Aging colors are implemented from line creation date:
  - 0–2 days green
  - 3–6 days yellow
  - 7–13 days orange
  - 14+ days red

### Lightspeed-first Ordering / supplier routing

Owner-approved workflow is:

1. Generate the PO in Lightspeed.
2. Enter/place the order in the supplier system.
3. Use Hobby Corner Ordering to check/update/add Special Orders and catch missing or duplicate demand.
4. Submit the supplier order.
5. After supplier confirmation/receiving, update local customer workflow; customer-order creation in Lightspeed remains a future duplicate-safe step.

Current implementation:

- Live Lightspeed supplier list is authoritative; local supplier rows exist only for routing/history linkage.
- Current Lightspeed POs and line items are read for cross-checking.
- Lightspeed unfulfilled fulfillment/sale demand is displayed separately and enriched with resolved customer/product data.
- Customer rows can expose contact details when returned by Lightspeed.
- Unfulfilled rows show product name, SKU/UPC, image when available, quantity, `LS PO#`, local Special Order match count and an Ordering Check action.
- Current PO table shows PO reference/status/supplier/line count plus count and units of matching local Special Orders.
- Preferred supplier can be selected from Ordering.
- Advisory supplier recommendations use direct mappings, existing preferred-supplier choices, explicit `supplier_routing_history`, exact product history and category history.
- Recommendations never auto-change routing.
- The old local draft-PO UI is not the normal workflow; old draft APIs/history remain only for compatibility.

### Receiving review

- Employee-facing Receiving Review uses a current Lightspeed PO and maps its products to waiting local Special Orders.
- `lightspeed_po_receipt_allocations` records cumulative PO-to-Special-Order allocations.
- Duplicate/replayed confirmation cannot allocate the same quantity twice.
- Previously confirmed targets cannot be silently decreased.
- Product must actually exist on the selected Lightspeed PO.
- When Lightspeed reports a positive received quantity, customer allocations from that PO/product are capped to that quantity.
- Receiving review updates Hobby Corner local allocation/status records only; it does **not** modify Lightspeed inventory-on-hand.
- Fully allocated customer lines can transition to `RECEIVED` and create one employee notification-review item.

### Customer notification review / delivery queue

- Receiving can create `READY_REVIEW` notification items.
- Employees can approve or suppress with a reason.
- Available delivery destinations are selected from customer contact data:
  1. Discord
  2. Facebook Messenger
  3. WhatsApp
  4. Email
  5. SMS
- Employee can override the default with another available destination.
- Approved delivery queue distinguishes review from delivery status.
- Queue channels exist for `DISCORD_READY`, `MESSENGER_READY`, `WHATSAPP_READY`, `EMAIL_READY`, `SMS_READY`.
- Duplicate-safe Discord claim/send/complete API exists; successful completion advances the Special Order to `CUSTOMER_NOTIFIED`.
- **Only the Discord sender is implemented, and only on the Discord bot development branch; it is not deployed on the production bot.**
- Messenger, WhatsApp, email and SMS are queue destinations only; no sender integration is implemented.

### Discord preorder watch

- `preorder_watch_items` stores not-yet-orderable customer interest separately from committed orders.
- Lifecycle: `WATCHING`, `AVAILABLE`, `CONVERTED`, `DISMISSED`.
- Stores customer match, Discord user/display name, requested item text, original message/link, capture mode, confidence, notes and timestamps.
- Duplicate source messages are idempotent by source key.
- Manual/formal capture can upgrade an informal capture without creating a duplicate.
- `/preorders` contains the staff review/edit/status/notes UI.
- Bot development branch `gw-preorder-test-publisher` implements:
  - conservative informal intent capture for configured preorder chat channels
  - formal `/hc preorder_watch`
  - staff message context action **Add to Preorder Watch**
- These bot features are **not** present on production bot `main`.

### Games Workshop weekly preorder workflow

- Outlook / Microsoft Graph email lookup for recent GW Want Number Form messages.
- Safe form URL normalization/following and Google Form scrape preview.
- **Sync & Scrape** is the primary workflow and persists/refreshes campaign products.
- Cleanup model includes customer item description, short code, MSRP, cost (never in Discord), Post Y/N and review notes.
- French/Québec and fixture/display material are suppressible by default.
- Case-pack detection proposes single-item name/MSRP and requires review before publishing.
- GW deadline comes from email; customer cutoff is supplier deadline minus 30 minutes.
- Auto-submit control defaults on; submit lead options are 10/15/20/30/60 minutes with 15 default.
- Failure-alert configuration and de-duplication exist.
- **Actual external GW Google Form submission worker is not implemented.** The stored auto-submit timing/status must not be described as automatic submission.
- Discord preview/publication is protected by a publication record to prevent blind duplicate posting.
- Publication maps each Discord message back to its preorder product.
- Automatic bot-added checkmark reaction was removed.
- Discord embed formatting now uses clean line breaks, shorter release presentation and readable customer-facing title casing.
- Parser recognizes trailing GW short codes such as:
  - `BLOOD OF THE BASTION (HB) - BL3362` → `Blood of the Bastion (HB)` / `BL3362`
  - `NECROMUNDA: ORLOCK CARD PACK - 301-91` → `Necromunda: Orlock Card Pack` / `301-91`
- GW re-sync is duplicate-safe by external entry and short code; ambiguous SKU collisions are preserved/flagged rather than aborting the whole sync.
- Backend reaction endpoint records ADD/REMOVE responses and matches Discord customer IDs.
- ADD creates/refreshes a preorder request and resets initial confirmation to 10 minutes after the latest adjustment.
- REMOVE cancels the request; if a confirmation was already sent, an immediate updated-order notification is queued.
- Special Orders backend contains the GW confirmation/update DM worker.
- **The production Discord bot does not currently forward GW reactions to this endpoint; that bridge exists only on `gw-preorder-test-publisher`.**

## Tested

### Automated

Verified historical Core Operations acceptance:

- Core Operations UI navigation run `40739200019`: PASS
- Scanner integration regression `40739200256`: PASS
- Shared UI reconciliation `40739199988`: PASS
- Final PR #24 layout run `40742593872`: PASS
- Core auth/session tests cover invalid PIN fail-closed, valid session, sign-out, expiry/restoration and deactivated employee clearing.
- GW parser startup regression workflow exists and protected earlier regex/startup failures.

Important limit:

- The later Lightspeed-first Ordering, receiving, delivery-queue, Messenger/WhatsApp, preorder-watch and final GW duplicate-reconciliation changes do **not** have equivalent end-to-end automated acceptance recorded on current head `f50c3309`.
- Railway SUCCESS verifies current code starts; it does not prove every business workflow is correct.

### Browser / employee acceptance

Previously verified during PR #24 acceptance:

- valid Timeclock PIN
- fake PIN rejected
- navigation/buttons
- persistent session after refresh
- explicit sign-out remains signed out after refresh
- native zoom checks

Still pending on current post-PR source:

- browser recheck that Lightspeed supplier/category/brand loading works after Railway credential-reference repair
- real Lightspeed unfulfilled-customer/product enrichment review
- real PO receiving with partial/full received quantities
- supplier recommendation usefulness and route-history behavior
- activity log/aging employee usability
- customer notification review/queue behavior
- Discord preorder watch false-positive/false-negative tuning
- latest GW Sync & Scrape after duplicate-safe `f50c3309`
- latest GW short-code/title/Discord preview formatting

### Runtime / deployment verification

Verified 2026-10-29:

- consolidated GitHub head: `f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Railway `lightspeed-api`: SUCCESS on `f50c3309`, deployment `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2`
- Railway `timeclock`: SUCCESS on `f50c3309`, deployment `16f7d019-9267-4196-b85e-0d4c2b15f121`
- Railway `special-orders-test`: SUCCESS on `f50c3309`, deployment `b327d98a-e178-495b-ad72-2936dccaee0a`
- Railway Discord bot production service: SUCCESS on `Tawgod/Hobby-Corner-Discord-Bot:main@7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9`; production bot does **not** contain the GW reaction bridge, preorder-watch capture, staff watch action or ready-DM worker

## Deployed

- Railway environment: production environment used by project services
- Core services source: `integration/hobby-corner-consolidation`
- Exact deployed commit for all three Core services: `f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Special Orders application service: `special-orders-test` (managed test/acceptance service despite production Railway environment)
- Chrome extension: no new Core Operations Chrome package was released by this chat
- Discord production bot: unchanged on `main@7c3af0e`; development-only Special Orders Discord features are not deployed

## Shared dependencies

- **Timeclock / staff auth:** `SHARED_STAFF_AUTH_PERMISSIONS.md`; use existing Timeclock identity, never create a parallel employee/PIN system.
- **Shared Lightspeed services:** PR #32 Phase 1 is ready for review but unmerged/not deployed; PR #33 Phase 2 is draft, stacked on #32, unmerged/not deployed. Existing Core Operations still use current feature-specific Lightspeed calls.
- **Product Manager:** employee-specific saved profiles/drafts are keyed to verified employee identity; the future Invoice Updates dropdown is shared/global and must not be hidden by an employee profile.
- **Product Scanner:** reuse Scanner/shared product matching and supplier identity proposals; do not create a competing matcher.
- **PO Companion:** future shared PO/invoice context and current read-only PO work must converge on the shared Lightspeed service rather than duplicate API clients.
- **Consignment/store credit:** do not reuse Special Orders notification/receiving paths as a store-credit write path; shared auth/reads only.
- **Railway PostgreSQL:** Special Orders workflow state, activity, routing, preorder watch, receiving allocations and notifications depend on durable Postgres.
- **Discord/customer sync:** customer Discord IDs are required for passive GW reaction matching and Discord ready notifications.
- **Chrome extension:** shared navigation/release ownership remains governed by `CHROME_EXTENSION_INTEGRATION.md` and `CHROME_EXTENSION_RELEASE_QUEUE.md`.
- **Split/Recall:** consolidated routes remain intact; Chrome UI candidate remains PR #22 and has separate real-browser release gates.

## Planned Invoice Reconciliation dependency

Source of truth: `FEATURE_INVOICE_RECONCILIATION.md`.

Requirements that this workstream must preserve:

- Invoice Reconciliation is a feature across existing tools, **not a new standalone tool**.
- It may stage/update a uniquely matched existing PO or, after complete approval, create a **new OPEN supplier PO** when no safe match exists.
- 90%+ product matching means automatic **staging**, never automatic production mutation.
- Add secondary supplier associations without replacing the primary supplier.
- Maintain employee-verifiable supplier shipping-sender aliases.
- Link tracking/shipping evidence to supplier/invoice/PO/lines and show Special Orders **On the way / In transit** with provenance/confidence/last verification.
- **Never receive products, write received quantities, adjust stock-on-hand, mark items READY/RECEIVED, or notify customers from invoice/tracking evidence.**
- Do not add a new raw PO writer, product matcher, authentication system or mail-ingestion credential path in Core Operations.
- Shared Services PR #32/#33 or their accepted successors are prerequisites for the future audited/idempotent writer.

## Shared files / integration surfaces affected

Primary current files:

- `special-orders.js`
- `special-orders-client.js`
- `special-orders.html`
- `ordering-client.js`
- `ordering.html`
- `preorders-client.js`
- `preorders.html`
- `gw-preorders-client.js`
- `gw-preorders.html`
- `db/special_orders_schema.sql`
- `server.js`
- `services/staffAuthGateway.js`
- `services/scannerTimeclockIdentity.js`
- `shared-ui/hc.css`
- `shared-ui/core-ops-compat.css`

Related but separately owned:

- `routes/orderSplit.js`
- `routes/orderSplitExecute.js`
- Discord bot `main.py` on development branch `gw-preorder-test-publisher`
- shared Lightspeed services in PR #32/#33
- extension PR #22/#26/#31 and coordinated release queue

## Known bugs / unfinished work

1. **Manual acceptance of final GW re-sync fix is pending.** User last saw a duplicate campaign+SKU error; `f50c3309` fixes the collision path and is deployed SUCCESS, but a fresh employee Sync & Scrape has not yet been recorded as passed.
2. **Lightspeed supplier/category/brand loading needs browser recheck.** Railway references were repaired to the authoritative `lightspeed-api` credentials and current service starts successfully, but the form has not been manually re-accepted after the repair.
3. **Actual GW auto-submit is not implemented.** Timing/settings/failure alerts must not be mistaken for a submission worker.
4. **Production Discord bot integration is incomplete.** GW reaction bridge, preorder-watch capture/context action and ready-DM delivery worker remain development-branch only.
5. **Email/SMS/Messenger/WhatsApp senders are not implemented.** Those approved messages remain queued.
6. **Receiving review needs real PO acceptance**, especially validation of the actual Lightspeed received-quantity response shape and partial delivery behavior.
7. **Customer Lightspeed order/sale creation after supplier ordering is planned only.** It needs a duplicate-safe design and explicit write authorization.
8. **No fine-grained employee operational write policy yet.** Current active-employee behavior must be preserved until a separate policy decision is approved.
9. **Wrong-host Special Orders behavior:** sibling consolidated services can serve Special Orders assets/routes without owning all Special Orders configuration; a canonical redirect to the managed Special Orders host was recommended but not implemented.
10. **Historical local supplier-draft APIs remain.** They are not the normal employee workflow and should not be revived without an explicit architecture decision.
11. **Preorder-watch detection requires test-channel tuning** before production Discord enablement.
12. **Older note timestamps are not recoverable exactly**; pre-activity-log notes correctly remain snapshot/best-available timestamps.

## Unimplemented user requirements / planned behavior

- Duplicate-safe creation of the eventual customer order/sale in Lightspeed after supplier ordering/confirmation.
- Production activation of informal/formal Discord preorder-watch capture.
- Production activation of GW reaction capture.
- Production-ready Discord ready-item notification worker after test acceptance.
- Messenger, WhatsApp, email and SMS delivery integrations.
- Actual GW supplier-form auto-submission with field mapping, idempotency and verification.
- Invoice Reconciliation / On-the-way shipment visibility described above.
- Future operational permission matrix deciding which employees may perform live product/PO/inventory/sale/credit writes.

## Remaining blockers

- Employee/browser acceptance on the current deployed `f50c3309` source.
- Real GW Sync & Scrape verification after the final collision fix.
- Real Lightspeed PO receiving acceptance.
- Non-production Discord bot test deployment/acceptance before any production bot change.
- Shared Lightspeed Services PR #32/#33 acceptance before migrating Core Operations consumers.
- Explicit approval before any new production Lightspeed write, production Discord bot deployment, or Chrome extension release.

## Decisions needed

- Decide when/how to test the Discord development branch before any production bot cutover.
- Decide sender/provider implementation for email/SMS/Messenger/WhatsApp.
- Decide the duplicate-safe point at which a confirmed Special Order should create/update a customer sale/order in Lightspeed.
- Decide future per-operation employee permissions; do not infer them from current Scanner `canApprove`.
- Decide whether non-owning consolidated Railway services should redirect Core Operations URLs to the canonical Special Orders host.
- GW form auto-submit requires explicit implementation/testing decisions before enablement.

## Recommended next action

1. Run employee acceptance on current `special-orders-test@f50c3309`:
   - supplier/category/brand load
   - GW Sync & Scrape on the existing campaign
   - GW cleanup/preview short codes and readable Discord formatting
   - Ordering unfulfilled demand/PO links
   - activity log/aging
2. Run one controlled real-PO Receiving Review and verify duplicate/partial quantity behavior plus customer Notification Review.
3. Test `gw-preorder-test-publisher` against non-production Discord behavior before considering any production bot deployment.
4. Only after those pass, choose the next integration: notification delivery or duplicate-safe customer Lightspeed order creation.
5. Keep Invoice Reconciliation planned against the shared-services architecture; do not bolt its PO writes directly into current Special Orders routes.

## Restrictions / safety

- Do not merge production-connected branches, deploy production changes, or alter Railway credentials without explicit authorization.
- Do not modify live Lightspeed records as part of handoff/verification.
- Receiving Review must never be confused with Invoice Reconciliation; invoice/tracking evidence never receives stock.
- Do not enable GW form submission merely because auto-submit timing exists.
- Do not deploy the Discord development branch to production without explicit approval and test acceptance.
- Do not package/version/publish the Chrome extension without first reconciling every item in `CHROME_EXTENSION_RELEASE_QUEUE.md` and active extension PRs.
- Preserve Timeclock as the sole employee identity/PIN authority.
- Preserve the current shared UI/navigation; do not create feature-local competing navigation.

## Documentation

Verified/relevant:

- `HOBBY_CORNER_PROJECT.md`
- `HOBBY_CORNER_CHAT_TRANSITION.md`
- `LIGHTSPEED_SHARED_SERVICES.md`
- `SHARED_STAFF_AUTH_PERMISSIONS.md`
- `ROADMAP.md`
- `FEATURE_INVOICE_RECONCILIATION.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `handoffs/timeclock-split-recall.md`
- `handoffs/product-scanner.md`
- `handoffs/po-companion.md`
- `handoffs/product-manager.md`
- `handoffs/lightspeed-shared-services.md`

This file is the stable current snapshot for this conversation. Git history preserves the earlier UI-only handoff.
