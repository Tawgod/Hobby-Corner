# Hobby Corner Project Registry

Last verified: 2026-10-12

This repository is the project-wide management index for Hobby Corner systems. Runtime code remains in the owning repositories. Statuses are: Planned, In Development, Testing, Deployed, Blocked, Maintenance.

## Source-of-truth order

1. GitHub — current source, branches, history, documentation
2. Railway — actually deployed services and environment state
3. Google Drive / Sheets — business data and operational workflows
4. This registry — ownership, status, dependencies, decisions, next steps
5. Project conversations — historical requirements and decisions

## System inventory

### Lightspeed Chrome Extension and Toolkit
Status: Testing

Purpose: Staff-facing enhancements embedded into Lightspeed Retail X-Series.

Repository: `Tawgod/Lightspeed`

Authoritative branch:
- `integration/hobby-corner-consolidation` — current unified development and deployed Railway source for Lightspeed API, Timeclock, Special Orders, Split / Recall, ZIP/USPS tools, extension work, and Product Scanner foundation.

Retired branches (SAFE TO DELETE; do not use for new work):
- `feature/order-split-poc`
- `feature/product-scanner-foundation`
- `special-orders-foundation-2026-10-02`
- `special-orders-foundation-livebase-2026-10-02`

Verified features in `integration/hobby-corner-consolidation`:
- Avery label launcher on purchase-order pages.
- Recall / Split Order launcher on Sell / webregister.
- Split / Partial Pickup launcher on fulfillment pages.
- Embedded order-split overlay.
- Auto-close message path after successful split.
- Employee timeclock UI embedded in the extension.

Known development items:
- Improve Avery button visibility in both light and dark mode.
- Continue staff-facing polish of order recall / split workflow.
- Eligible-order list and customer-oriented recall flow.
- Supplier page capture / physical barcode product scanner.
- Product duplicate checking and missing-data warnings before product creation.

Dependencies:
- Railway `lightspeed-api`
- Railway `timeclock`
- Lightspeed Retail X-Series APIs

Deployment note:
The deployed services do not currently track `LivBranch`; they deploy from `feature/order-split-poc`. Treat branch merges carefully.

### Lightspeed API / Order Split Backend
Status: Testing

Purpose: Backend for Lightspeed extension functions including order split, partial pickup, recall-related operations and other store workflows.

Repository: `Tawgod/Lightspeed`
Deployed branch: `integration/hobby-corner-consolidation`
Railway service: `lightspeed-api`
Environment: production
Last verified deployment: SUCCESS, 2026-10-06

Verified backend areas include order split execution, deposit conversion, work-order combine, and Lightspeed API helpers.

Next:
- Complete end-to-end staff testing.
- Remove testing/debug output before calling the workflow production-ready.
- Establish a stable production branch/release process instead of long-term deployment from a feature branch.

### Legacy Product Importer and Category Mapping
Status: Maintenance

Purpose: Preserve legacy migration tooling and support category mapping while newer direct-connection workflows replace most importer functions.

Repository: `Tawgod/Lightspeed-Importer`
Branch: `main`
Related operational sheet: `LS: importer`

Verified importer modules:
- Products
- Product updates
- Suppliers
- Brands and duplicate-brand cleanup
- Categories
- Customer import/update
- Item image upload
- Gift card export
- Customer/item backup
- Product UUID database and reconciliation
- Reorder-point batch updates

Current management decision:\n- Most importer functions are now legacy because the project is moving toward direct Lightspeed connections.\n- Category mappings remain active work and are still being finalized.\n- Do not invest in broad importer hardening unless a remaining migration task specifically requires it.\n\nKnown issues:\n- Category creation/fallback has produced HTTP 404 errors.\n- A credential remains in legacy source configuration and should be retired/rotated when that legacy path is no longer needed.\n\nNext:\n- Finalize category mappings.\n- Identify the minimum legacy importer functions still required for cutover.\n- Prefer direct-connection implementations for new functionality.\n- Retire and secure legacy credentials when the remaining importer dependency is removed.

### RMS Product Migration
Status: Testing

Purpose: Migrate the RMS product catalog into Lightspeed with validated category, brand, supplier, pricing, identifiers, descriptions, images, and reorder configuration while deliberately not importing RMS on-hand inventory.

Repository: `Tawgod/Hobby-Corner-Discord-Bot`
Branch: `product-migration-colab`
Operational sheet: `LS: importer`

Verified migration behavior:
- Product-family creation with SKU, UPC/aliases, brand, category, supplier, supplier item code, cost, retail, weight, and long description.
- Product images upload separately after product creation.
- Existing/low-quality images may be used while background review flags track cleanup needs.
- Product name now prefers the legacy importer `Web Description` title and falls back to the shorter RMS description.
- RMS on-hand inventory is never sent; physical inventory will establish opening stock.
- Lightspeed reorder configuration uses `MIN_MAX`: RMS proposed reorder point -> minimum, proposed restock level -> target maximum.
- Live single-item test on BSI-117 verified reorder 4/6 with on-hand unchanged at 0.
- Controlled five-product reorder batch on 2026-10-12 verified all five requested values, including a 0/1 minimum/target case, with on-hand unchanged for every product.
- Results are recorded in `Migration Reorder Test Results` in `LS: importer`.

Next:
- Finish image-repair/name verification on the existing controlled test batch.
- Integrate the validated migration write path into a non-production branch based on `integration/hobby-corner-consolidation`.
- Run a larger controlled rehearsal before final catalog cutover.
- Preserve suppliers/categories, then perform full physical inventory after catalog migration.

### Inventory Counting and Reconciliation
Status: Planned

Purpose: Full physical inventory after catalog migration and ongoing reconciliation.

Current scope:
- Multi-person count strategy.
- Prevent duplicate/conflicting counts.
- Reconcile final physical quantities to Lightspeed.
- Use existing UUID mapping/reconciliation assets where possible.

Dependency:
Catalog migration must be substantially complete before final inventory cutover.

### Special Orders and Supplier Tracking
Status: Testing

Purpose: Replace fragmented special-order/preorder tracking with an integrated database-backed workflow tied to Lightspeed.

Repository: `Tawgod/Lightspeed`
Branch: `integration/hobby-corner-consolidation`
Railway service: `special-orders-test`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-08

Verified implementation:
- PostgreSQL special-order schema.
- Supplier and supplier-product relationships.
- Multiple suppliers per item.
- Product identifier mapping.
- Product reconciliation tracking.
- Customer search and new Lightspeed customer creation UI.
- Special-order item search / quick add.
- Statuses including OOS, PREORDER, READY_TO_ORDER, ORDERED and BACKORDERED.
- Ordered-over-seven-days dashboard metric.
- New Lightspeed item creation workflow with duplicate-match checking.
- Supplier/source URL, category, cost, retail, dimensions, weight and reorder-setup data.
- Legacy workbook import UI.
- Existing Google Sheets preorder/customer workflows remain operational data sources and must be preserved during migration.

Planned / not yet fully verified:
- Customer Discord notification when received/held.
- Complete supplier-order workflow.
- Production migration from legacy preorder/special-order sheets.
- Full receive -> held/parked sale -> pickup lifecycle.

### Employee Timeclock
Status: Testing

Purpose: Editable long-term staff time records, reporting, adjustment tracking and employee visibility beyond Lightspeed's built-in clock.

Repository: `Tawgod/Lightspeed`
Branch deployed: `integration/hobby-corner-consolidation`
Railway service: `timeclock`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-12

Requirements established:
- Sunday-Saturday weeks.
- Pay periods 1-15 and 16-end of month.
- Recent daily history and weekly totals for employees.
- Administrative corrections with notes.
- Automatic clock-out after 14 hours.
- Overtime review and pay-period summary.
- Multi-year data retention.
- Employee identity can exist independently of Discord; Discord linking is optional.

Verified:
- A substantial timeclock backend exists and the extension contains a timeclock UI.
- Lightspeed-backed employee records can be assigned a unique 4-digit timeclock PIN directly by Employee ID without requiring a Discord account.
- Existing Discord-linked PIN reset remains compatible with the same backend endpoint.
- PIN changes are audited and duplicate PINs are rejected.
- Railway `timeclock` successfully deployed the non-Discord PIN-assignment backend on 2026-10-12.

Testing / follow-up:
- Verify the production Discord control-panel deployment exposes the employee-name `Set / Reset PIN` picker.
- Run one end-to-end non-Discord employee onboarding test at the store timeclock.
- Production readiness and complete reporting coverage still require validation.

### Discord Bot and Customer Identity
Status: Deployed

Purpose: Customer/Discord identity integration and store communication workflows.

Repository: `Tawgod/Hobby-Corner-Discord-Bot`
Branch: `main`
Railway service: `Hobby-Corner-Discord-Bot`
Last verified deployment: SUCCESS, 2026-10-01

Verified:
- Bot service is deployed.
- Master Customer List is the curated customer/Discord identity source.
- Discord user ID is treated as a durable identity key.
- HC Preorders, GW Preorders and Master Preorder Sheet are documented as related operational data sources.
- Bot reconciles curated customer data on a schedule.

Planned integration:
- Special-order receipt / held-order notifications.
- Continued consolidation with Lightspeed customer identity.

Security:\nAn operational preorder sheet contains a plaintext Discord bot credential. On 2026-10-09 this was explicitly accepted as a temporary risk because access is currently restricted and the sheet is planned for retirement. Rotate the token and remove it from the sheet as part of the special-orders/preorder cutover; do not broaden sheet access in the meantime.

### Customer Rewards
Status: Deployed

Purpose: Calculate rolling customer rewards tiers and synchronize rewards-related fields into Lightspeed.

Repository: `Tawgod/Hobby-Corner-Discord-Bot`
File: `rewards_service.py`
Railway service: `Hobby-Corner-Rewards`
Database: shared Railway PostgreSQL
Last verified deployment: SUCCESS, 2026-10-02

Verified implementation:
- Rolling-sales tier calculation.
- Legacy transaction support.
- Exclusions, manual overrides and special discounts.
- Rewards snapshots and run history.
- Lightspeed customer custom-field synchronization.
- RMS / legacy data bridge tables.

Follow-up:
Verify whether the deployed service is intentionally in dry-run or live-write mode before changing reward rules.

### Image Processing and Product Photos
Status: In Development

Purpose: Validate and normalize product images for Lightspeed while preserving originals.

Drive workflow:
- Source/original images.
- `Lightspeed Ready` folder for valid or repaired copies.
- `Attention` folder for files requiring manual replacement.

Related existing importer capability:
`Item Images.gs` uploads images to Lightspeed.

Planned:
- Resumable batch processing.
- Skip previously completed files.
- Progress/report output.
- Quality threshold for images needing manual replacement.
- Long-running execution outside an interactive ChatGPT session.

### Legacy RMS / Migration Bridge
Status: Maintenance

Purpose: Preserve required legacy customer and transaction data while Lightspeed becomes the primary platform.

Evidence:
- Rewards service contains RMS staging, customer identity mapping, transaction staging and migration-job tables.
- Discord repository contains an `rms_bridge` area and migration assets.

Next:
Document exactly which RMS processes are still authoritative, which are migration-only, and the retirement criteria.

## Railway production map

Verified 2026-10-09 in project `Hobby Corner`:
- `Hobby-Corner-Discord-Bot` -> `Tawgod/Hobby-Corner-Discord-Bot:main`
- `Hobby-Corner-Rewards` -> `Tawgod/Hobby-Corner-Discord-Bot:main`
- `lightspeed-api` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- `timeclock` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation` with root directory `/timeclock`
- `special-orders-test` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- `Postgres` -> persistent shared database volume
- `migration-test-bsi117` -> temporary Railway function used for migration testing

No staged Railway changes were present when audited.

## Important architecture decisions

- PostgreSQL should remain the authoritative datastore for durable operational records such as timeclock, rewards and special orders; Chrome/Discord are interfaces, not primary stores.
- Preserve existing Google Sheets preorder/customer workflows during migration until replacement parity is verified.
- New special-order, purchasing and supplier functions should build on the existing special-order schema rather than creating a parallel system.
- Do not assume default GitHub branches are production. Railway deployment source is authoritative for what is live.
- Keep development/test services distinct from staff-facing production workflows.

## Highest-risk issues

1. Accepted temporary risk: plaintext Discord bot credential in the restricted preorder sheet; rotate/remove at sheet retirement.\n2. Legacy risk: source-controlled Lightspeed credential in the private importer repository; retire/rotate with legacy importer shutdown.
3. Production-facing Railway services deployed directly from feature branches.
4. Multiple systems share the same PostgreSQL database; schema ownership and migrations need explicit coordination.
5. Legacy sheets, new special-order database, Discord identity and rewards identity all touch customer records and require one documented identity strategy.

## Manager workflow

For project updates:
1. Read this registry.
2. Verify relevant GitHub branch and Railway deployment.
3. Verify relevant Drive/Sheet data source when operational state matters.
4. Report implementation, testing and deployment separately.
5. Record blockers and cross-system effects.
6. Update this file, `CHANGELOG.md`, and `ROADMAP.md` after meaningful verified changes.


## Repository and deployment organization audit — 2026-10-12

See `BRANCH_AND_DEPLOYMENT_POLICY.md` for the detailed branch/deployment map and cleanup sequence.

Verified findings:
- The current Chrome extension points to the main Hobby Corner Railway project's `lightspeed-api` and `timeclock` domains.
- Railway projects `capable-trust` and `enthusiastic-rebirth` contain older/duplicate Lightspeed deployments outside the main Hobby Corner project and are retirement candidates pending explicit approval.
- Several GitHub branches have no unique commits and are cleanup candidates; branches with unique work will be reconciled before deletion.
- No branches, services, projects, or deployments were deleted or changed during this audit.


### Railway consolidation update — 2026-10-12
- Duplicate `capable-trust/Lightspeed` and `enthusiastic-rebirth/Lightspeed` services have been retired.
- Both old Railway project containers are now empty.
- The `Hobby Corner` Railway project is the authoritative home for current Hobby Corner runtime services.


### Consolidated Lightspeed candidate branch — 2026-10-12
A non-deployed `Tawgod/Lightspeed:integration/hobby-corner-consolidation` branch now combines the current Special Orders live-base, all seven order-split-only commits, and the complete current product-scanner foundation. It is the preferred candidate for future unified testing. Railway has not been repointed; existing deployed branches remain live until an explicitly approved cutover.


### Consolidated branch test status — 2026-10-12
- Branch: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Status: **Testing**
- Static/syntax/import/reference checks: passed after fixes.
- Three Special Orders defects were identified from live test-service logs and corrected on the integration branch only: non-idempotent schema constraint creation, reconciliation LIMIT parameter binding, and preorder campaign-type SQL parameter binding.
- Railway remains on the existing deployed branches; integration fixes are not live.
- Next gate: isolated/live database smoke test followed by extension workflow acceptance before any Railway repointing.


### Isolated integration test environment — 2026-10-12
- Railway project: `Hobby Corner Integration Test`
- Environment: `test`
- App service: `lightspeed-integration-test`
- Source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Database: dedicated isolated PostgreSQL service and volume
- Temporary domain: `lightspeed-integration-test-test.up.railway.app`
- Safety: Lightspeed live mode, migration, and product writes disabled; production Lightspeed credentials not copied.
- Verified: clean build; database schema initializes on fresh database; second deployment initializes successfully against the same database; Railway root health check passes.
- Remaining: authenticated Special Orders route tests and Lightspeed-dependent workflow tests require test credentials/configuration before they can be exercised.


### Consolidated functional test result — 2026-10-12
- Special Orders isolated HTTP/database smoke suite: **8/8 passed**.
- Timeclock isolated functional smoke suite: **8/8 passed**.
- Timeclock 14-hour automatic close: **passed**, including `AUTO_CLOSED`, review flag, and `AUTO_CLOCK_OUT` event verification.
- Reusable Timeclock integration smoke/auto-close scripts are now committed on `integration/hobby-corner-consolidation`.
- Production Railway services remain unchanged.
- Remaining acceptance gates: Lightspeed-authenticated read/write tests with tightly controlled test records, Chrome extension employee workflow testing, supplier-page scanner browser testing, and dependency/security review.


### Railway consolidated-branch cutover — in progress 2026-10-12
- `special-orders-test`, `timeclock`, and `lightspeed-api` are now configured to source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Railway replacement deployments for consolidated commit `c49f0e99d6f1a550696e52d3646fa6ab38ef7e70` are currently initializing.
- Existing successful deployments remain serving until replacements settle.
- Old deployed branches must remain until post-cutover SUCCESS/health verification.


### Consolidated Railway cutover — verified 2026-10-12
- `lightspeed-api`, `timeclock`, and `special-orders-test` are all live from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- All three replacement deployments reached SUCCESS.
- All seven Hobby Corner Railway services are online with zero current failures.
- The consolidated branch is now the authoritative deployment line for these three services.
- The former deployment branches `feature/order-split-poc` and `special-orders-foundation-livebase-2026-10-02` no longer back active Railway services and are eligible for retirement after branch deletion is performed manually or through a GitHub tool that supports branch deletion.


### Post-cutover cleanup — 2026-10-12
- Temporary `Hobby Corner Integration Test` Railway services/database/volume are being retired; deletions are currently applying.
- Main Hobby Corner production services remain untouched and healthy.
- Four superseded Lightspeed feature branches are ready for deletion, but the connected GitHub tool does not expose branch deletion:
  - `feature/order-split-poc`
  - `feature/product-scanner-foundation`
  - `special-orders-foundation-2026-10-02`
  - `special-orders-foundation-livebase-2026-10-02`
- Do not emulate deletion by force-moving refs.


### Lightspeed branch cleanup complete — 2026-10-12
Verified deletion of the four superseded feature branches used before consolidation. `integration/hobby-corner-consolidation` remains the authoritative deployed branch. Remaining legacy cleanup candidates are `V1.2` and the identical `Apps-script-importer` / `Importer` pair.

### GW preorder web publishing workflow — 2026-10-12
Status: **Testing**

- GW weekly preorder management has been moved out of the main Special Orders dashboard into a dedicated staff page at `/gw-preorders`, linked from `/special-orders`.
- The dedicated page reuses the Special Orders access key and provides GW email/form intake, campaign review, Discord preview, and controlled Discord publishing.
- Discord publishing is initiated from the Special Orders web application rather than Discord slash commands.
- `special-orders-test` receives the existing Discord bot token through a Railway service-variable reference; the token was not copied into source code or exposed in project documentation.
- A database-backed `preorder_discord_publications` record is created before sending posts. Its unique campaign/channel constraint prevents duplicate whole-campaign publication and retains message IDs/status for partial-failure review.
- Publishing remains targeted to the isolated GW test channel `1336092698935033917` while the workflow is being accepted.
- The production `Hobby-Corner-Discord-Bot` service has been returned to `Tawgod/Hobby-Corner-Discord-Bot:main`; slash-command publishing is not the intended staff workflow.
- Initial consolidated implementation commit: `5b6a6ab8f66d131ddb386fd5b2ae206071d1d921`.
- Publish-button safety follow-up: `89622f98c2466fb6cfc8e187fd2d83b02778ac08`, requiring a fresh successful preview before the web Publish button is enabled.

Remaining acceptance:
- Open the dedicated GW page from the Special Orders dashboard and verify the browser workflow.
- Run one reviewed campaign through preview.
- Perform one controlled publish to the GW test channel and verify embeds/images/reactions.
- Wire customer reaction capture into the Special Orders database before replacing the legacy preorder-sheet reaction workflow.


## Product Scanner — verified 2026-10-12

## 2026-10-12 — Product Scanner Timeclock authentication and read-only live smoke test

**Status:** Testing (code implemented and deployed; valid employee sign-in and real product matching not yet end-to-end verified).

- Merged `Tawgod/Lightspeed` PR #5 into authoritative `integration/hobby-corner-consolidation`, commit `ef0b8176763fe788e87ea23543044638e49f6c1e`.
- New scanner PIN sign-in uses existing Timeclock employee credentials. Active staff default to `scanner_can_lookup=true`; `scanner_can_approve=false` by default and can be changed per employee through Timeclock's admin-protected endpoint.
- Scanner gateway in `special-orders-test` reuses the existing Special Orders local/remote match routes. Admin and internal service secrets remain server-only. Login throttling is shared-PostgreSQL-backed; sessions are short-lived.
- Railway deployment SUCCESS: `lightspeed-api` `414cd129-7c71-47e3-99f8-0287bb2ec797`, `timeclock` `bae57489-e0ad-414a-88b7-35799fb500ef`, `special-orders-test` `b4ff34d9-1f17-469b-9fed-f0cf4f063d7a`.
- Activated `SCANNER_ENABLED=true` on `special-orders-test` only; deployment `496b4dd6-f16d-4cc3-9049-d16ace494a4b` reached SUCCESS, with `[scanner] authenticated read-only gateway enabled` in startup logs.
- CI regression/syntax tests passed: GitHub Actions run `38299780733`. Live non-destructive security smoke re-run `38300384359` attempt 2 passed: unauthorized internal Timeclock PIN verification **403**, unauthenticated scanner matching **401**, invalid scanner PIN **401**.
- Chrome extension source/release package on consolidated branch is version `0.3.19`; staff-installed copies do not update automatically. Product Create/Update remains disabled.
- Remaining: verify a real authorized employee PIN from Chrome, confirm read-only Lightspeed and local matching, test permission revocation and login lockout, and review scanner approval/write design before enabling any writes.

No Lightspeed product records were created or updated in this test. The existing Timeclock database gained default scanner-lookup and approval-permission columns on startup.

## Purchase Order Companion — planned requirements (2026-10-13)

**Status: Planned. No implementation or deployment completed.** Owning application: `Tawgod/Lightspeed`, Chrome extension; authoritative development base `integration/hobby-corner-consolidation`.

- On a supplier website, open a very narrow right-side PO companion panel (target about one-quarter of the monitor; adjustable/collapsible) tied to the supplier's open Lightspeed purchase order.
- Present each line compactly with supplier-specific SKU or UPC, product name, and order quantity. Color-code product exceptions needing investigation (missing identifier, mismatches, availability concerns, etc.).
- Allow a **SKU / UPC display-and-copy toggle**, ideally per panel with optional per-item override. Copy the selected identifier to the clipboard with one click or a dedicated copy button; do not require selecting text. Keep the panel compact enough to leave the supplier website's search/quick-add bar accessible. Do not automatically type or submit in the supplier's website without a separately accepted integration.
- **Supplier SKU is per supplier-product relationship, not a single universal Lightspeed SKU.** Products sourced from several suppliers must resolve the SKU for the *currently selected PO supplier*. UPC can serve as an alternate when available. If a supplier SKU is missing or ambiguous, visibly flag it; do not silently substitute another supplier's SKU.
- Each line has a tiny checkbox to reveal compact editable `RP`, `RQ`, `Cost`, and `MSRP` fields. Unchecking only hides these fields; draft changes remain intact when rechecked. Items checked for update are included in a separate review queue.
- **Review Changes** opens a separate popup (not an expanded sidebar) with before/after Lightspeed values, exceptions, and an explicit approval step. The sidebar itself remains narrow.
- Employees authenticate using the existing Timeclock identity; normal staff may search/read by default. Product creation, editing, and price/reorder changes remain gated by individually granted approval permission. Never auto-write values while checking a box.
- Drafts must be recoverable as appropriate to the PO and supplier without mixing data between purchase orders. Review supplier cost vs. global product cost / MSRP carefully and make update scope explicit; never overwrite global pricing just because the supplier's cost differs.
- Reuse existing Special Orders supplier-product identifier mapping, Lightspeed PO integration, and Product Scanner matching/auth infrastructure. Do not create a separate supplier catalog importer or bulk supplier scraper.

Next recommended action: In a dedicated PO Companion development conversation, inspect consolidated extension, PO retrieval endpoints, supplier-product mapping and Railway configuration; sketch a minimal sidebar prototype and data contract. Do not deploy to production or edit Lightspeed products without explicit approval.
