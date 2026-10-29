# Product Manager — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing (prototype and modules); live integration **In Development / not deployed**  
**Workstream owner:** Product Manager / PAM replacement, employee product editing and catalog-cleanup workflows.

## Source
- Application repository: `Tawgod/Lightspeed`.
- Authoritative integration branch: `integration/hobby-corner-consolidation` @ `f50c3309824986633c3ba37a95e6eb43aae15a3c` (current manager registry and Railway deployment evidence).
- Current candidate: draft PR **#28**, `feature/product-manager-current-base-20261028` @ **`e8938dee17718a2d9e30a38b03121cc7893600d0`** (GitHub PR head checked 2026-10-29).
- Superseded: draft PR **#18** `feature/product-manager-shared-ui-20261027`; earlier foundation `feature/product-manager-foundation-2026-10-27`; older standalone prototype ZIPs v0.7–v1.0 are *not* production sources. PR #18 remains open/unmerged and may be closed as superseded after reviewer acknowledgement; do not merge its stale shared assets.
- Shared-service dependencies: PR **#32** `feature/shared-lightspeed-services-phase1-20261029` @ `7c20b3d9f90382b6fafeb5dc3d9a92108f4c14e1` (open, unmerged); stacked draft PR **#33** `feature/shared-lightspeed-services-phase2-reads-20261029` @ `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a` (open, unmerged). PR #33 is based on #32, not consolidated.

## Responsibilities and requirements (retain through migration)
Build ONE unified employee-facing Product Manager (PAM replacement) within the shared Hobby Corner application. Support large searchable/filterable/sortable product grids, configurable employee-specific views/profiles, bulk edits, staged before/after review, detailed product panel, online-store fields and SEO/maximum purchase quantity, categories/brands/suppliers, variants and custom fields, dimensions, original-format descriptions with safe HTML/rich text, product manuals/document links where API permits, pictures with slot ordering and Google Drive image matching (including filtered batch suggestions and optional description/common-code qualifier), inventory/committed/available quantities, aging/discount proposals and existing Avery label printing, new-item creation through Scanner/Special Orders matching, and CSV import with explicit column mapping/validation. Preserve supplier SKU/UPC leading zeros, whitespace, punctuation, multiline and hyperlinks. Employee views, edits, approval rights and backups must be scoped to Timeclock identity; no duplicate employee system.

### Standalone prototype requirements that are NOT feature-complete on PR #28
Historical local browser v0.9 demonstration included: description plain/rich editor preview; demo document URL attachments; aging/discount suggestions and print-label preview; Max Qty label; simple new-item dialog; CSV header mapping/preview (validation only); additional sample records; mock filtered Drive image matching; per-employee-like local layouts; grid column drag/resize; image slot mock. These *demonstrations* have NOT been ported as operational integrations into PR #28. v1.0 was an isolated styling ZIP, not authoritative deployed code. Requirements must be selectively reimplemented using current shared components/services, NOT by merging an obsolete standalone bundle. Current PR #28 only includes a reduced 4-product sample catalog.

## Implemented (code evidence, not a claim of deployment)
- Product Manager `index.html`, `ui.css`, `ui.mjs`: scoped merged `shared-ui/hc.css`, original shared wordmark reference, navy navigation, sample-only table/details panel, search and inactive filter, editable preview for name/retail/online toggle, atomic multi-field staging, per-field undo, reset and review-only feedback. No live catalog, product update or API write function.
- `validation.js`: field source/validation registry, SKU/UPC exact collision helper, category path parsing, optimistic old-value preview and committed reservation helper. The reservation helper deduplicates within source; cross-system hold reconciliation is **not validated**.
- Existing Timeclock-backed `/api/staff-auth/session` consumed by demo login UI; token in tab memory, no browser-persisted credential. The shared `services/staffAuthGateway.js` reauthorizes active employees; feature must use current shared permission contract, never equate scanner `canApprove` to product-write permission.
- `profiles-api.js`: **unmounted** Express router with `initializeProductManagerProfiles(pool)` and PostgreSQL `product_manager_profiles` keyed by verified employee ID + Default/Profile 1/2/3 slot. Per-request server verifier, bounded layout payload, read/write profile endpoints. Grid column visibility, up/down order and numeric width UI; selected employee profile save/load calls. Drag gesture and Product Details field-reorder not implemented.
- **Unapplied** `product_manager_work_drafts` table and authenticated `GET/PUT /work-draft` endpoints keyed by verified employee ID. Manual work backup, 5-minute best-effort autosave while signed in, attempted backup on sign-out (cancel sign-out if it fails), tab-memory freeze on expiry and same-employee restore offer, explicit restore review with old-value conflicts, and stale backup write rejection (409 for older `savedAt`). No inventory/product writes.
- Separate read-only UI, data validation and safety tests. Original project auth/navigation and Scanner/Special Orders functionality remain unchanged on consolidated.

## Tested
- CI for PR #28 head `e8938dee...`: GitHub Actions **40753298705** completed SUCCESS (2026-10-28): Node syntax, validation, profiles/backup schema tests, mocked in-process Express HTTP test for two employees, denied/revoked identities, stale autosave conflict, and existing Playwright Chromium sample UI browser test.
- Earlier passing runs: 40749046354, 40749886006, 40752194410. Earlier failure 40749755479 (missing Express test dependency and obsolete no-network assertion) corrected; another temporary syntax failure 40752098035 corrected before successful run.
- Browser automation checks sample search, inactive filter, no-results, 3-field draft staging, individual undo, validation failure, reset, keyboard Enter selection, narrow layout and CSS visual zoom at 100/125/200%. CSS zoom is **not native browser zoom**.
- NOT tested: genuine Timeclock + Postgres runtime, browser authentication/5-minute timer, expiry/revocation/restore with live service, cross-device backup, employee isolation against actual PostgreSQL, background/tab crash recovery, native 100/125/200% Chrome zoom, full accessibility/screen-reader workflows, actual signed-in profile persistence and navigation, large real catalog, rich descriptions/images/CSV.
- CI passing does not validate API functionality that has not been mounted.

## Deployed
- Product Manager PR #28 **NOT merged**, no Product Manager route mounted, no Product Manager database migration applied, no live product manager deployment.
- Railway project `Hobby Corner` (`f7e91de7-43f6-472e-b4ca-46b0623f8e0e`): latest deployment records 2026-10-28 show SUCCESS for `timeclock`, `lightspeed-api` and `special-orders-test` on consolidated commit **`f50c3309824986633c3ba37a95e6eb43aae15a3c`**. This does **not** mean Product Manager, PR #32 or PR #33 is live. No production changes performed in this audit.

## Shared dependencies and architecture decisions
- **Timeclock:** sole PIN/employee identity authority; `/api/staff-auth/session` and server-side active-status recheck. Read `SHARED_STAFF_AUTH_PERMISSIONS.md`; current active-employee Scanner effective permissions are broad and product changes must use explicit operation permissions, separate approval and backend write gates.
- **Shared Lightspeed API:** PR #32 transport/policy/audit/idempotency and PR #33 Products/Catalog/Inventory/Sales/PO/Store-Credit readers and per-operation auth are future consumers; do not add a competing X-Series/E-Series client, API key, or permission layer in Product Manager. Read `LIGHTSPEED_SHARED_SERVICES.md`.
- **Product Scanner + Special Orders:** reuse existing matching, SKU/UPC/supplier code capture, duplicate controls, product-create approval, supplier associations and outstanding reservation logic. Do not duplicate product matcher or write endpoint. Special Orders and PO Companion/Ordering supply PO/supplier context; consignment and store credit reads from shared services are dependencies rather than Product Manager-owned writes.
- **Shared UI/navigation:** use merged PR #27/#24 foundation and approved original logos, no stale CSS or duplicate menu; respect future current core navigation updates and Timeclock access restrictions. Any extension launcher must be separately queued under `CHROME_EXTENSION_RELEASE_QUEUE.md`; Product Manager PR #28 does not modify extension files.
- **Railway Postgres:** authoritative durable profiles/backups/staged edits when mounted. Implement migrations separately, with restricted access, schema versioning, backups, audit trail and cross-employee tests. Never store PINs/tokens in localStorage or shared profile payloads.
- **Discord, Rewards and customer synchronization:** dependencies via authoritative customer identity shared services; Product Manager should not create duplicate customer sync, rewards/store credit or Discord notification systems.
- **January 2027 migration target:** owner plans Lightspeed cutover at beginning of January 2027; accelerate isolated development/testing, not unsanctioned production writes.

## Invoice Reconciliation — Planned cross-tool feature (NOT implemented)
Read `FEATURE_INVOICE_RECONCILIATION.md` and `HOBBY_CORNER_CHAT_TRANSITION.md`. Product Manager must have a global **Invoice Updates** picker visible to signed-in employees, **separate from personal layout/profile**. Invoices/preorders/tracking arrive through shared email ingestion and PDF extraction; review durable staged suggestions and 90%+ candidate matches, proposed supplier-specific SKU/UPC/cost, quantities, MSRP/cost anomalies, unmatched/new items, verified secondary suppliers (do not replace primary), supplier shipping-sender aliases and invoice/PO/tracking associations. Scanner supplies match and supplier price proposals; PO Companion/Ordering supplies PO context. Full invoice-level resolution/approval precedes shared gateway update to an existing PO or creation of a **new OPEN PO** with audited idempotent readback. Linked tracking appears in Special Orders as **On the way / In transit**. **NEVER receive a PO, change stock-on-hand, or create ghost inventory products.** No independent email, PO write or credential subsystem within Product Manager. Planned feature not required for January cutover absent explicit prioritization.

## Known bugs, gaps and blockers
1. The Product Manager UI is a small sample-data beta; no secured live catalog route or feature-mounted auth/profile/backup API. Existing CI does not establish authenticated end-to-end runtime behavior.
2. Five-minute backup is best effort, not guaranteed at tab close/crash/offline. Sign-out save can fail. Frozen in-tab work survives same-tab reauth only; no cross-device recovery without confirmed durable save. Clarify whether unsaved layout changes also need immediate backups and whether multiple tabs require revision/CAS locking beyond `savedAt`.
3. Current backup restore requires old-value equality but must reconcile against authoritative latest product snapshot when live API arrives; cross-source reservation totals may double count. More tests needed for copy fidelity and large catalogs.
4. Current browser API is scaffold-only: actual per-employee operation authorization, failure states and employee session expiry need full functional testing. Product Manager permissions must be explicitly decided before any writes.
5. Real column drag/resize interactions, Product Details field ordering, presets, per-user profile persistence end-to-end and handling multiple simultaneous tabs are incomplete.
6. No production-grade rich description sanitizer, document attachment capability verification, Drive matching service, labels/aging data provenance, real CSV mapping/import, supplier linking or other v0.9 feature integration.
7. Native browser 100/125/200% zoom, real employee keyboard/accessibility, original logo/host route and hosted navigation acceptance outstanding.
8. PR #28 is based on older consolidated commit `24e9834...` and must be selectively reconciled with **current** consolidated `f50c330...` and upcoming shared-service PRs, without copying libraries or merging unrelated writes.
9. PR #18 still open/draft but superseded. No request to close it within final-handoff audit.

## Recommended next development priorities
1. Refresh PR #28 against current consolidated head and compare with shared API PRs #32/#33; preserve only Product Manager-owned files. Run CI.
2. Test authenticated workflows with mocked Timeclock and disposable PostgreSQL, including autosave every 5 minutes, backup on sign-out, expiry freeze, same-employee restore, wrong-employee isolation, cross-tab stale saves and failure recovery. Implement explicit saving/error/last-success status and robust revisions.
3. Isolated test deployment only with separate authorization: mount Product Manager router, apply reviewed PostgreSQL migrations, secure role-based read-only access; do not touch production tenant records.
4. Connect read-only paginated catalog through approved shared-service consumers, record X/E-Series ownership and variant/supplier relationships; verify inventory/reservation reconciliation. Preserve all source identifier text.
5. Incrementally deliver advanced grid/profile/description/image/manual/CSV/aging/discount/Avery workflows from requirements; reuse Scanner/SO creation and matching; enforce staged review, independent approval, idempotency, audit and readback before any write capability.
6. Coordinate optional Invoice Updates picker/reconciliation queue with cross-tool feature architecture and owner priority, without creating a new standalone tool.

## Decisions needed
- Which employees may **view/edit/stage/approve/apply** product changes when live integration is enabled; Timeclock provides identity but current broad scanner rights do not establish this policy.
- Backup retention, number of snapshots/version history, conflict handling across tabs/devices and acceptable loss window; 5-minute cadence currently best effort.
- Storage/hosting and supported X/E-Series attachment/online formatting semantics; ownership of sale-price/discount vs Lightspeed and E-Series sync.
- Isolated test environment and cutover sequencing toward January 2027.
- Invoice Reconciliation scheduling relative to cutover, not an implicit launch blocker.

## Restrictions / safety
- No merge/deployment/Chrome extension package or release during this audit.
- No live Lightspeed product/order/inventory/credit/customer/employee writes, no credential changes.
- New product creation, PO modifications and inventory adjustments require distinct explicitly authorized and audited paths. Invoice reconciliation may create/update OPEN PO after complete approval but never receive products.
- Do not discard old PR branches or local prototype requirements; preserve them in Git history and this handoff.

## Documentation
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md` (current matrix), `HOBBY_CORNER_CHAT_TRANSITION.md`, `ROADMAP.md`, `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `SHARED_ADDON_UI_UX.md`, `FEATURE_INVOICE_RECONCILIATION.md`.
- `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md` for any Scanner/extension interop.
- `Tawgod/Lightspeed:feature/product-manager-current-base-20261028/product-manager/SHARED_UI_ADOPTION.md`, `INTEGRATION_PLAN.md`, source/tests/workflow.
- Historical local prototype `Hobby_Corner_Product_Manager_v0.9_Review_Interface.zip` and v1.0 beta ZIP are conversational design artifacts, not GitHub authoritative app implementations.
