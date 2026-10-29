# Core Operations / Special Orders / Ordering / Preorders / GW — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — consolidated source and Railway are current; several employee/browser and Discord acceptance gates remain

## Source

- Repository: `Tawgod/Lightspeed`
- Authoritative branch: `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Current PR: no open Core Operations PR for the post-merge work; PR #24 is **MERGED** and PR #27 shared UI is **MERGED**
- Current commit: `f50c3309824986633c3ba37a95e6eb43aae15a3c` — `Make GW re-sync duplicate-safe by SKU and external entry`
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
