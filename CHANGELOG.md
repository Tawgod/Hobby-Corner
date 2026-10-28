# Hobby Corner Project Changelog

## 2026-10-28 — Core operations PR #24 reconciliation
- Rebuilt PR #24 on consolidated `24e9834a6`, preserving the current Timeclock-backed employee PIN/header authentication.
- Reconciled PR #21 shared UI adoption and PR #23 navigation into the current coordinated core-operations candidate.
- Added original Hobby Corner wordmark navigation, responsive More menu, active-page state, and shared navy/gray-blue hierarchy without changing Special Orders/Ordering/Preorders/GW workflow logic.
- Added auth/session regression coverage and headless Chromium layout/focus/100-125-200% zoom smoke.
- Core Operations UI run `40731326832` PASSED; Scanner integration regression `40731338520` PASSED on head `cc07823df01a04ccb96a677ba08e8beb70f165cf`.
- PR #21 and PR #23 can be closed as superseded after manager acknowledgement; no production deployment performed.


## 2026-10-28 — Timeclock identity unified across employee tool logins

### Audited
- Reviewed the authoritative `Tawgod/Lightspeed:integration/hobby-corner-consolidation` employee-facing authentication paths and current Railway service configuration.
- Product Scanner was already using Timeclock PIN verification, server-only service credentials, short-lived signed sessions, login rate limiting, and server-side employee reauthorization.
- Special Orders, Ordering, Preorder Campaigns, and GW Preorders were still using the shared `SPECIAL_ORDERS_ADMIN_KEY` as their normal browser login.
- Embedded Lightspeed tools such as Split / Recall, labels, and ZIP/USPS helpers do not have a separate Hobby Corner employee login; they operate inside the existing Lightspeed session.

### Changed
- Added a shared Timeclock-backed staff-auth gateway and browser client.
- Special Orders, Ordering, Preorder Campaigns, and GW Preorders now use the employee's existing 4-digit Timeclock PIN as the normal sign-in.
- The four web tools share the same short-lived employee session within the same browser tab and display the signed-in employee identity in the shared header.
- Protected Special Orders API routes accept the signed employee session and reauthorize the employee against Timeclock.
- Legacy workbook upload now follows the same employee-authenticated request path.
- The legacy Special Orders admin key remains accepted server-side as a transitional/emergency fallback but is no longer the normal staff login UI.
- Product Scanner remains on its existing Timeclock-backed scanner session path.

### Verification
- Static JavaScript syntax checks passed for the shared auth client, all four web clients, staff-auth gateway, Special Orders router, and server entrypoint.
- Railway startup logs confirm both `[staff-auth] Timeclock PIN employee authentication enabled` and the existing scanner authentication gateway initialize successfully.
- Final browser acceptance with a real employee PIN remains required for cross-page session restoration, sign-out, expiry/re-login, invalid-PIN rate limiting, and employee deactivation/revocation.

### Architecture rule
- New employee-facing Hobby Corner tools, including Purchase Order Companion, Product Manager, and Consignment Manager, should reuse the shared Timeclock employee identity/session contract when they need Hobby Corner authentication instead of adding a separate password or PIN system.

## 2026-10-28 — Chrome extension shared integration contract
- Added `CHROME_EXTENSION_INTEGRATION.md` as the shared cross-system architecture/integration contract for the Hobby Corner Toolkit Chrome extension.
- Defined shared ownership rules for manifest, popup, content script, navigation, UI/UX, backend destinations, employee authorization, messaging, permissions and regression testing.
- Updated `CHROME_EXTENSION_RELEASE_QUEUE.md` so all extension development/release work must read and reconcile the integration contract in addition to the release queue.
- Documented current coordination hotspots: Purchase Order Companion, Product Scanner, Consignment Manager launcher, Shared Addon UI/UX, Split/Recall, Timeclock-backed permissions and packaging/release work.


## 2026-10-20 — RMS migration disposition cleanup
- v67: conditional Horizon Hobby Rockets routing (in-stock Estes -> ESTES, otherwise Other), removed stale supplier UUID cache, and explicitly routed five low-volume ambiguous category groups to General > Other / Toys > Other Toys.

## 2026-10-19 — RMS migration controlled-test fixes
- v66: routed blank/unmapped suppliers to live `Other`, added full supplier/brand UUID reconciliation, constrained repair of migration-created failures, pre-selection SKU validation, full-path category creation, category pagination, and mapping cleanup to five remaining ambiguous category pairs.
- v65: restored automatic `Other <parent>` fallback leaf routing for mappings that stop at a parent category and have no explicit level-3 target.
- v64: repaired inventory tracking immediately after create, blocked parent-category product writes, added live supplier UUID reconciliation/near-name audit, and added pre-write SKU character validation.
- v63: centralized migration review/test/history output tabs in the Flagged Migration workbook; removed stale operational copies from LS: importer while preserving mapping/reference authorities and durable history.
- v60: made `Mapping` the explicit category-routing source and added a `Trains + HO Scale` regression probe after live UUID reconciliation.
- v55: added live Lightspeed category/UUID reconciliation, safe creation of truly missing mapped leaf categories, Cat ID refresh from live data, and alternate-hierarchy protection to avoid duplicate categories under the wrong Level 1.
- v54: legacy product creates now preserve inventory tracking, earlier test products are repaired before reorder writes, and reorder/product test sizing both follow TEST_BATCH_SIZE without fixed helper caps.
- Raised the default controlled product test batch to 50 and removed lingering 20-item helper defaults; setup now reports eligibility and prior-success exclusions.
- Fixed reorder testing for newly created zero-stock products by allowing the 2026-04 reorder upsert to materialize the outlet inventory row, then verifying on-hand remains unchanged and MIN_MAX values read back correctly.

## 2026-10-16 — RMS migration notebook audit and safety hardening

### Private migration flags, category recovery, and PAM correction
- Notebook v52 adds a fail-closed regression check for the known GW48-111/Tenfold Dungeon stale-export signature before migration setup continues.
- Replaced Lightspeed item-tag usage with hidden product custom field `migration_flags`; aging and picture-maintenance annotations no longer block migration.
- Added unique category-name recovery for department/category mismatches such as RMS `3D` under the wrong department.
- Corrected HQ PAM relationship: core product data remains from the connected RMS Item database/tables, and WebDescription is sourced from `HQcorp.dbo.nitroasl_pamtable` by joining `PAM.ItemID` to the store Item's `HQID` rather than its local `ID`. GW48-111 verified the mismatch (store ID 57014, HQID/HQ item ID 57155).

### Supplier/category/GW/aging policy corrections
- Named unmapped suppliers now fall back to `Other`; blank primary suppliers remain review-only.
- Removed the blanket Games Workshop REVIEW rule.
- Added `Aging Stock` migration tagging for positive-quantity inventory with no reliable sale in 12 months; aging alone does not create a review flag.
- Added explicit mappings for blank-category Outdoor Toys and Other > Clothing.
- Added explicit review text for zero-stock/reorder rows that age into REVIEW so correctly mapped supplier/category fields are not mistaken for the cause.

### Live product API adapter
- Fixed batch-wide 404 failures caused by calling `/api/2026-10/products` on the live retailer before that endpoint is available there.
- Controlled writes now adapt the internal product-family payload to legacy `POST /api/2.0/products`, use legacy read-back and image upload, and preserve the newer internal model for later 2026-10 migration.
- ERROR rows from failed runs no longer count as previously migrated SKUs.

### Configurable randomized migration batches
- Removed the obsolete absolute 20-product write cap. `MAX_TEST_WRITES` now follows `TEST_BATCH_SIZE`.
- Replaced deterministic SKU tie-breaking with randomized selection among equally strong coverage candidates, while preserving category/supplier/image/web-title/reorder/special-state diversity.

### Authoritative RMS Web Description titles
- Removed the word-overlap / 50%-similarity requirement for Web Description after confirming it is intentionally the expanded product title used to bypass the RMS Item Description character limit.
- Nonblank RMS Web Description is now preferred as the Lightspeed family name; hard barcode/source-code identity conflicts still force REVIEW and prevent writes.

### Audited
- Reviewed the full RMS-to-Lightspeed Colab notebook plus `analysis.py`, `rules.py`, `test_harness.py`, and the live category/supplier/brand mapping tabs in `LS: importer`.
- Verified the current Lightspeed 2026-10 family/product field split against the official API model.
- Verified 151 nonblank RMS category mappings all resolve to `Cat ID` paths with no conflicting source keys or duplicate category paths.
- Verified supplier and brand UUID maps contain no missing UUIDs or duplicate names.

### Fixed / hardened
- Consolidated later notebook cells around the authoritative ONE-CLICK setup so stale legacy-source reloads and stale UUID-map rebuilds no longer bypass setup safety.
- Restored the absolute controlled product-write cap of 20 and enforced it inside the helper code.
- Unmapped categories, blank suppliers, unresolved supplier UUIDs, unresolved brands, barcode/source-code collisions, and strong source-identity conflicts remain REVIEW and cannot enter a controlled write batch.
- Exact retained/current supplier names now override stale blank-disposition mappings to `Other`; unresolved names are reviewed rather than guessed.
- Supplier cost now prefers the primary-supplier `RMS_SupplierListCost` before legacy item-level cost fields.
- Controlled read-back verifies name, long description, category, brand, codes, supplier/code/cost, retail price, weight, active state, and requested image persistence.
- Cleanup refuses identity-conflicted RMS source rows.
- Dedicated flagged-item review workbook remains the primary human review queue while the legacy `Migration Review` tab remains available for compatibility.
- Legacy-source fallback is disabled by default, so the notebook fails closed when the fresh Drive CSV is missing.
- Cross-row source product-code collisions are detected and forced to REVIEW before batch selection.
- Current audited notebook version is `2026-10-16-v51`.

### No production deployment
No Railway service was repointed or deployed and no Lightspeed product was created, modified, or deleted as part of this audit.

This file tracks meaningful project-wide development and management changes. Service-specific commit history remains in each owning repository.


### Brand alias resolution and optional creation
- Added just-in-time brand creation: a missing brand is created only when a product using it is actually selected into the live write batch; brands with no selected migrating product are not created.
- Converted high-confidence duplicate/new rows into aliases of existing canonical brands: Atlas, Mantic Entertainment, Palladium Books, Studio 2 Publishing Inc., The Op Games, and Wow Toyz; consolidated the two Breaking Games spellings.
- Audited the live `Brands` tab and confirmed `Combine` is the source/RMS alias column for `Clean Brand Name`.
- Removed 28 accidental duplicate canonical additions because those warning names were already aliases; retained only 35 genuinely absent brand names for manual review/mapping.
- Notebook v44 resolves aliases to canonical brands before UUID lookup.
- Added paginated exact Lightspeed brand lookup and create/read-back/Brand ID Map synchronization tied by default to the explicit live product-create switch.

## 2026-10-16 — RMS migration notebook and mapping audit

### Audited
- Reviewed the full `product-migration-colab` notebook, `analysis.py`, `rules.py`, `test_harness.py`, the live `LS: importer` category/supplier/brand mapping tabs, the new 54,255-row RMS CSV, and the dedicated flagged-item workbook.
- Verified all 151 nonblank category mappings resolve to `Cat ID` and found no conflicting RMS category keys or duplicate category UUID paths.
- Verified `Supplier ID Map` has no missing UUIDs or duplicate supplier names.
- Identified five retained supplier names missing from `Supplier ID Map` and 21 named legacy supplier mappings to `Other` without explicit approval.
- Verified Brand ID Map has complete UUIDs and no duplicate brand names; three spelling aliases intentionally share the Leanin' Tree UUID.
- Found one duplicate SKU and six colliding product-code values among migration candidates in the fresh export.
- Found that zero SupplierList costs frequently coexist with positive item costs, requiring positive-value rather than literal-field precedence.

### Fixed
- Consolidated the notebook to one authoritative setup path.
- Made the Drive CSV authoritative and fail-closed by default; the legacy candidate sheet now requires explicit `ALLOW_LEGACY_SOURCE_FALLBACK=True`.
- Added full current bridge-schema validation plus blank Item ID/SKU/Description and duplicate RMS Item ID checks.
- Removed stale standalone reload/reanalysis paths that could bypass setup safeguards or reproduce indentation errors.
- Enforced an absolute 20-write limit in product/reorder helpers.
- Changed unmapped category fallback behavior so `General > No Category` is review-only and never satisfies the category-mapped gate.
- Added a category-UUID gate so explicitly mapped paths without `Cat ID` are routed to review.
- Prevented blank suppliers and unapproved named supplier-to-`Other` rows from becoming write-eligible.
- Added exact retained-supplier resolution with read-only Lightspeed UUID lookup and review routing when unresolved.
- Added brand UUID review gating and a separate `Migration Unmapped Brands` output.
- Changed Web Description handling to use the web title only when corroborated; otherwise migration falls back to RMS Description with a non-blocking warning.
- Added hard barcode identity checks and source-wide SKU/UPC/alias collision detection before batch selection.
- Changed supplier-price mapping to use the first positive SupplierList/LastCost/Cost/ReplacementCost value so zero placeholders cannot hide a real cost.
- Corrected barcode code types: 12-digit UPC, 8/13-digit EAN, 14-digit ITF, otherwise CUSTOM.
- Moved exact-SKU duplicate lookup and cleanup ID recovery to the current Lightspeed `2026-10` product endpoint.
- Expanded controlled create read-back verification to name, description, category, brand, codes, supplier, price, weight, active flags and image.
- Blocked cleanup from modifying products when the current RMS source row has a hard identity conflict.
- Added/expanded the dedicated `Flagged Migration Items` review workflow while preserving manual review fields and column positions used by validation.
- Changed category/supplier/brand/UUID map builders to reject conflicting duplicate rows instead of silently taking the last row.
- Fixed reorder-cell credential/config isolation and output-sheet sizing.

### Version / references
- Colab notebook: `2026-10-16-v42`.
- Key audit commits include `7bcd1fcc65958eb7ed087a620ace47aa8871b104`, `a59ea235e8976473f2f05d61b445756c5a8478bf`, `5ee22e2df64dc52755e6acb68f5c8d55573ea100`, `e5b724e6bb4553e6f1126e3c935a32b4a74d43e7`, `bedf4ea1ba22ea173f106f8e1867eef8b7a52610`, `8de17b9e437bd3b8bbcf074334eaf39d0bb981ac`, `e7a6535138ace0b2195824d411d6565ea106b4c0`, `18750d0a19d080a5c574cabc897b5fb23f99c652`, `3c8c8fd5160de867ce7b022624f501f893431c17`, and `2caff4564bd0923426d14a48d18e56ae3a3202df`.
- README synchronized to v42 in `f0f7e20f1ff9838e06f3c1c304c3271318091a2f`.

### Not changed
- No Railway service was deployed or repointed.
- No production Lightspeed products, inventory quantities, categories, suppliers, or other records were changed by this audit.
- The known incorrectly created controlled-test Model Railroader product was not automatically deleted or modified.

### Remaining decisions
- Whether RMS inactive state should set migrated Lightspeed products inactive; current controlled payloads use `active.in_store=True`.
- Whether any migrated products should be enabled for the Ecwid/online channel; current payloads use `active.ecwid=False`.
- Tags are not currently migrated.
- `DEFAULT_RMS_WEIGHT_UNIT='LB'` is still an explicit migration assumption because the source has no weight-unit column.
- Full existing-Lightspeed product-code collision preflight beyond exact SKU remains a final-cutover gate.

## 2026-10-09 — Project audit and registry established

### Added
- Established `Tawgod/Hobby-Corner` as the project-wide management/documentation repository.
- Added `HOBBY_CORNER_PROJECT.md`, `ROADMAP.md`, and `CHANGELOG.md`.
- Documented verified GitHub repositories, active Lightspeed branches, Railway production services, Google Drive operational data sources and major dependencies.

### Verified
- Railway project `Hobby Corner` has live Discord bot, rewards, Lightspeed API, timeclock, special-orders test, PostgreSQL and migration-test services.
- `lightspeed-api` and `timeclock` deploy from `Tawgod/Lightspeed:feature/order-split-poc`.
- Special orders deploy from `special-orders-foundation-livebase-2026-10-02`.
- Rewards and Discord bot deploy from `Tawgod/Hobby-Corner-Discord-Bot:main`.
- Existing special-order database schema and UI are substantially implemented.
- Existing importer covers products, updates, suppliers, brands, categories, customers, images, gift cards, backups and UUID reconciliation.

### Risks identified
- Plaintext Discord credential present in an operational Google Sheet.
- Lightspeed credential stored in source in the private importer repository.
- Production-facing services deploy from feature branches.
- Shared PostgreSQL usage requires explicit migration/schema coordination.

### No production changes
This audit did not deploy, restart, redeploy, or modify any Railway service and did not change Lightspeed records.

## 2026-10-12 — First infrastructure cleanup

### Removed
- Deleted the unused Railway `capable-trust/Lightspeed` service after verifying zero HTTP requests over the previous seven days and confirming the active Chrome extension targets the main Hobby Corner Railway domains.
- Verified the `capable-trust` Railway project is now empty and has no volumes.

### Held for verification
- Did not remove `enthusiastic-rebirth/Lightspeed`. The active extension, visible HC Preorders configuration, and reviewed preorder repository scripts do not reference its Railway domain, but the live bound Apps Script cannot be verified through the current connectors.

### GitHub branch cleanup
- Confirmed `Tawgod/Lightspeed:V1.2` has no unique commits.
- Confirmed `Tawgod/Lightspeed:Apps-script-importer` and `Importer` are identical.
- Confirmed `Tawgod/Hobby-Corner:Lightspeed` has no unique commits.
- Branch deletion is not available through the connected GitHub action set, so these remain documented manual cleanup candidates rather than being rewritten or force-moved.

## 2026-10-12 — Special-orders branch reconciliation

### Reconciled
Reviewed the five commits unique to `Tawgod/Lightspeed:special-orders-foundation-2026-10-02` against the deployed `special-orders-foundation-livebase-2026-10-02` branch.

The five unique commits were the original special-orders foundation:
- initial PostgreSQL schema
- initial special-orders API/router
- initial dashboard shell
- PostgreSQL dependency
- server mount/routing

All five functions are already present and materially expanded in the deployed live-base branch. No unique functionality needs to be cherry-picked. The old `special-orders-foundation-2026-10-02` branch is now classified as a safe archival/deletion candidate.

No runtime code, Railway service, or deployment was changed during reconciliation.

## 2026-10-12 — enthusiastic-rebirth runtime investigation

### Verified
- `enthusiastic-rebirth/Lightspeed` and `Hobby Corner/lightspeed-api` deploy the same `feature/order-split-poc` commit stream.
- The prior seven days of `enthusiastic-rebirth` HTTP logs contain only `/extension` and `/favicon.ico` requests.
- The current extension manifest authorizes the main Hobby Corner `lightspeed-api` and `timeclock` domains, not the `enthusiastic-rebirth` domain.
- Installed extension code routes general Lightspeed/order-split functions to `Hobby Corner/lightspeed-api`, Timeclock to `Hobby Corner/timeclock`, and the Special Orders button directly to `Hobby Corner/special-orders-test`.

### Conclusion
`enthusiastic-rebirth` is a duplicate extension landing/download host, not the active Timeclock or Special Orders backend. Keep it temporarily until any staff bookmarks/download instructions are moved to the duplicate `/extension` endpoint on the authoritative `Hobby Corner/lightspeed-api` service; then it can be retired safely.

No Railway services or deployments were changed during this investigation.

## 2026-10-12 — Railway consolidation

### Removed
- Retired the duplicate `enthusiastic-rebirth/Lightspeed` Railway service after confirming its source and extension distribution endpoint were duplicated by `Hobby Corner/lightspeed-api`.
- No attached volumes or unique runtime configuration required migration.
- The `enthusiastic-rebirth` Railway project is now empty.

### Verified after removal
- Main `Hobby Corner` Railway project remains intact with `lightspeed-api`, `timeclock`, `special-orders-test`, `Postgres`, `Hobby-Corner-Discord-Bot`, `Hobby-Corner-Rewards`, and `migration-test-bsi117` present.
- No staged Railway changes remain from the cleanup.

## 2026-10-12 — Lightspeed active-branch consolidation

### Created
- Created non-deployed `integration/hobby-corner-consolidation` from the deployed Special Orders live-base branch.

### Merged / reconciled
- Merged the seven commits unique to `feature/order-split-poc` into the integration branch via clean PR #3.
- Reconciled the ten scanner-foundation commits. PR #4 had overlapping popup/manifest changes, so the scanner versions of all eight affected files were applied directly and verified byte-identical to `feature/product-scanner-foundation`.
- Closed PR #4 as superseded by the verified direct conflict resolution.

### Verification
- Consolidated branch contains Special Orders backend/schema.
- Consolidated branch contains order split and customer ZIP/USPS functionality.
- Consolidated branch contains the complete current scanner foundation.
- No Railway source branch or deployment was changed.

## 2026-10-12 — Consolidated Lightspeed test pass

### Tests run
- Parsed all consolidated server, route, Timeclock, Special Orders client, Chrome extension, and scanner JavaScript for syntax.
- Parsed top-level, Timeclock, and extension JSON manifests.
- Verified local module import targets and declared npm dependencies.
- Verified Chrome extension popup/content-script references and scanner permissions.
- Verified consolidated server has one ZIP route, one USPS verification route, one Special Orders mount, one database initialization, and one listener.
- Verified scanner files remained byte-identical to the scanner foundation after conflict resolution.
- Checked Railway runtime health for the source services; all seven main Hobby Corner services are currently online with no active Railway health alerts.

### Bugs found and fixed on integration branch only
- Made `preorder_products_gw_post_disposition_chk` schema creation idempotent so repeated startup does not fail when the constraint already exists.
- Fixed Special Orders product reconciliation query limit handling; the previous code passed a PostgreSQL bind parameter without a matching placeholder.
- Fixed the preorder campaign-type query placeholder; the previous SQL compared a text column directly to an integer literal.

### Runtime finding
The deployed `special-orders-test` service logs confirmed all three failure modes before the fixes: duplicate-constraint startup errors, reconciliation bind-count errors, and a text-vs-integer campaign query error. These fixes have NOT been deployed.

### Result
`integration/hobby-corner-consolidation` passes the available non-deployed structural/static test suite. Status remains **Testing** pending isolated/live database smoke testing and employee workflow testing. No Railway deployment was changed.

## 2026-10-12 — Isolated consolidated-branch Railway smoke test started

### Isolated infrastructure
- Created private Railway project `Hobby Corner Integration Test` with environment `test`.
- Added a dedicated PostgreSQL service/volume; this database is separate from Hobby Corner production Postgres.
- Added `lightspeed-integration-test` from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Test app uses only the isolated PostgreSQL database. `SPECIAL_ORDERS_LIVE_MODE`, migration, and product writes are disabled.
- Production Lightspeed credentials were not copied into the test project.
- Generated temporary test domain `lightspeed-integration-test-test.up.railway.app`.

### Smoke-test findings
- First integration deployment reproduced a schema syntax problem in the new idempotency fix; no production service was affected.
- Corrected the schema on the integration branch to use `DROP CONSTRAINT IF EXISTS` followed by re-adding the check constraint.
- Corrected integration commit deployed successfully.
- Special Orders logged `database schema ready`, `database initialization result: true`, and `Server listening on port 8080`.
- Redeployed the same build against the same isolated database with Railway health check `/`; deployment succeeded and schema initialization succeeded again, verifying restart-safe schema behavior.
- External HTTP smoke tests remain limited because the current tool environment cannot resolve the newly generated Railway hostname. Railway's own deployment health check succeeded.

### Production impact
None. Existing Hobby Corner Railway project/services and production database were not changed or repointed.

## 2026-10-12 — Isolated functional smoke-test phase

### Special Orders
- Ran an internal Railway smoke runner against `lightspeed-integration-test` over the isolated project's private network.
- Final result: **8/8 passed**.
- Verified:
  - public Special Orders health route
  - Special Orders UI route
  - admin-key authentication
  - preorder campaign list
  - `GW_WEEKLY` campaign filter (covers repaired SQL placeholder)
  - dry product reconciliation on isolated database (covers repaired reconciliation query)
  - migration remains locked when disabled
  - Lightspeed product creation remains locked when product writes/live mode are disabled

### Timeclock
- Created `timeclock-integration-test` from the exact consolidated source commit with root `/timeclock`, isolated Postgres, and test-only secrets.
- Verified correct Timeclock startup and Railway `/health` health check.
- Added reusable `scripts/integration-timeclock-smoke.js`.
- Functional result: **8/8 passed**.
- Verified:
  - health
  - employee status
  - clock in
  - duplicate clock-in protection
  - clock out
  - duplicate clock-out protection
  - admin review
  - manual time entry with audit reason
- Added reusable auto-close seed/check regression scripts.
- Seeded a 15-hour-open test shift, restarted only the isolated Timeclock service, and observed `Auto-closed 1 time entry at the 14-hour limit.`
- Database verification passed: resulting entry is `AUTO_CLOSED`, has `needs_review=true`, and has a matching `AUTO_CLOCK_OUT` event.
- Repeated the auto-close sequence successfully a second time.

### Test-environment notes
- Railway initially bootstrapped new GitHub services from the repository default branch before settling onto the requested branch. Timeclock was explicitly pinned to consolidated commit `74316d74ed99679ed28da5e4ee034dd7cdba3e1c` before accepting results.
- No production Hobby Corner Railway service or production database was repointed.
- Root application dependency installation currently reports two high-severity npm audit findings. These require dependency/security review but did not prevent the isolated functional smoke tests.

## 2026-10-12 — Consolidated Railway source cutover started

### Source mappings changed
The following Hobby Corner production-environment services were repointed from old feature branches to `Tawgod/Lightspeed:integration/hobby-corner-consolidation`:
- `special-orders-test`
- `timeclock`
- `lightspeed-api`

### Current state
- Railway replacement deployments are currently queued/initializing on consolidated commit `c49f0e99d6f1a550696e52d3646fa6ab38ef7e70`.
- Previous successful deployments remain active while Railway prepares the replacements.
- No current Railway health failures were reported at the time of the source change.
- `Postgres`, `Hobby-Corner-Rewards`, `Hobby-Corner-Discord-Bot`, and `migration-test-bsi117` were not changed.
- Do not retire the old GitHub deployment branches until these replacement deployments reach SUCCESS and post-cutover health is verified.

## 2026-10-12 — Consolidated Railway cutover verified

### Verified live
- `lightspeed-api` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation` -> SUCCESS deployment `c1b79bca-fa91-4f11-9c8c-e774b4dc8b5e`
- `timeclock` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation` -> SUCCESS deployment `cb99e0c3-0f84-4dd8-9e44-da6c7057ae97`
- `special-orders-test` -> `Tawgod/Lightspeed:integration/hobby-corner-consolidation` -> SUCCESS deployment `00348c2f-7747-46f1-b862-72abf3b533e7`

### Health
- All seven main Hobby Corner Railway services are online.
- Railway reports zero current service failures.
- New Special Orders logs show schema ready and successful database initialization.
- The prior duplicate-constraint, reconciliation bind-count, and campaign text/integer errors are absent from the consolidated deployment logs.
- Timeclock starts cleanly on port 8080.
- Old Special Orders and Timeclock deployments have been removed from active service by Railway after successful replacement.

## 2026-10-12 — Post-cutover cleanup phase

### Railway test environment retirement
- Began retiring the temporary `Hobby Corner Integration Test` project after the consolidated production cutover was verified.
- Deletion requested for:
  - `integration-smoke-runner`
  - `timeclock-integration-test`
  - `lightspeed-integration-test`
  - isolated test `Postgres`
  - isolated `postgres-volume`
- Railway is applying these removals asynchronously. The smoke runner is already removed and Timeclock is offline/removing; remaining test resources are still settling.
- No resources in the main `Hobby Corner` project were changed by this cleanup.

### GitHub branch retirement
The connected GitHub tool still does not expose branch deletion, so no refs were force-moved or otherwise altered as a substitute.

Verified retirement candidates:
- `feature/order-split-poc`
- `feature/product-scanner-foundation`
- `special-orders-foundation-2026-10-02`
- `special-orders-foundation-livebase-2026-10-02`

Next legacy candidates after those:
- `V1.2`
- one of the identical `Apps-script-importer` / `Importer` branches, followed by final legacy-importer reconciliation.

## 2026-10-12 — Superseded Lightspeed branches deleted

Verified the following retired branches were deleted from `Tawgod/Lightspeed`:
- `feature/order-split-poc`
- `feature/product-scanner-foundation`
- `special-orders-foundation-2026-10-02`
- `special-orders-foundation-livebase-2026-10-02`

Remaining branches are:
- `integration/hobby-corner-consolidation`
- `LivBranch`
- `V1.2`
- `Apps-script-importer`
- `Importer`


## 2026-10-12 — Consolidated Railway cutover and product-migration reorder validation

### Railway / branch consolidation
- Verified `lightspeed-api`, `timeclock`, and `special-orders-test` are all live from `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Latest deployments for all three services were successful and no staged Railway changes were present.
- `feature/order-split-poc`, `feature/product-scanner-foundation`, `special-orders-foundation-2026-10-02`, and `special-orders-foundation-livebase-2026-10-02` are retired and marked SAFE TO DELETE.
- New Lightspeed development must build from the consolidated branch unless project management explicitly changes the architecture.

### Product migration reorder validation
- Ran a controlled five-product Lightspeed reorder/restock batch against already-created migration test products.
- Used `MIN_MAX` reorder configuration with RMS proposed reorder point mapped to minimum and proposed restock level mapped to target.
- Verified values:
  - ULP81126: 11 / 12
  - ULP81156: 1 / 2
  - TES1103TT: 3 / 9
  - TES1104TT: 1 / 2
  - TES1108TT: 0 / 1
- Every product reported on-hand inventory 0 before and after the update.
- All five read-backs matched the requested reorder settings.
- Recorded the batch in `LS: importer` tab `Migration Reorder Test Results`.
- Returned the temporary `migration-test-bsi117` Railway function to read-only verification behavior after the test.

## 2026-10-12 — Timeclock non-Discord onboarding

### Added
- Timeclock PIN assignment can now target an employee record directly by Employee ID; a Discord account is no longer required to provision or reset a PIN.
- The production Discord control-panel source was updated so `Set / Reset PIN` loads the Lightspeed-backed employee list by name and shows whether each employee already has a PIN or Discord link.
- Existing Discord-linked PIN resets remain supported by the backend for compatibility.

### Safeguards
- PINs remain unique 4-digit credentials stored only as keyed hashes.
- Duplicate PIN assignments are rejected.
- PIN assignment/reset changes are written to the timeclock audit log.

### Deployment
- Railway `timeclock` successfully deployed commit `8157a9051d908e675069254b82339fc005704d37` from `integration/hobby-corner-consolidation`.
- Discord bot production is currently sourced from `Tawgod/Hobby-Corner-Discord-Bot:main`; commit `7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9` contains the matching employee-name PIN picker and was queued for deployment at verification time.

## 2026-10-12 — GW preorders moved to dedicated Special Orders web workflow

### Changed
- Removed the embedded GW weekly-preorder controls from the main Special Orders page.
- Added a dedicated `/gw-preorders` page linked from the main `/special-orders` dashboard.
- Preserved GW Outlook/Graph intake, form scraping, draft import, campaign review, case-pack/single-item decisions, and Discord preview on the dedicated page.
- Made the Special Orders web application the staff control point for GW Discord publication; Discord slash commands are no longer the intended publishing workflow.

### Discord publication safeguards
- Added server-side Discord publishing through the existing Hobby Corner bot token supplied to `special-orders-test` by Railway variable reference.
- Publishing remains restricted to GW test channel `1336092698935033917` during acceptance testing.
- Added `preorder_discord_publications` to record campaign/channel publication status and Discord message IDs.
- Added a unique campaign/channel constraint to prevent accidental duplicate whole-campaign publication.
- Partial or failed sends are recorded for review rather than blindly retried.
- The web Publish button remains disabled until a fresh Discord preview reports that the campaign is ready.
- Returned the production Discord bot service to `Tawgod/Hobby-Corner-Discord-Bot:main`.

### References
- Web workflow implementation: `Tawgod/Lightspeed@5b6a6ab8f66d131ddb386fd5b2ae206071d1d921`
- Fresh-preview publish gate: `Tawgod/Lightspeed@89622f98c2466fb6cfc8e187fd2d83b02778ac08`

### Testing status
- Special Orders schema/startup and the initial web-publishing deployment reached Railway SUCCESS.
- No GW customer-facing/test-channel publication was triggered during implementation.
- Browser acceptance and the first controlled test-channel publish remain to be completed.

## 2026-10-12 — GW customer cutoff buffer and auto-submit failure alerting

- GW customer order cutoff now defaults to **30 minutes before** the supplier deadline parsed from the Games Workshop email.
- The original GW supplier deadline is stored separately on the campaign as `gw_supplier_deadline_at`.
- Planned auto-submit timing is **15 minutes after the customer cutoff**, which is therefore **15 minutes before the GW supplier deadline**.
- The actual external Google Form submission worker remains safety-disabled pending dedicated submission testing; this change does not falsely mark vendor submission as active.
- Added auto-submit failure alert plumbing for the employee Discord channel `1334937694895083580` with role mention `1308203405021286400`.
- Failure alert state is stored on the campaign so one failed campaign will not repeatedly ping staff every scheduler cycle; if Discord delivery itself fails, the alert claim is released so a later retry can notify.
- Railway `special-orders-test` now has the employee-channel and employee-role IDs configured as service variables.
- Implementation commit: `Tawgod/Lightspeed@c00e02b50e9b9d177fa0a9eb10854e28ffd5843d`.

## 2026-10-12 — GW form URL normalization and timing controls

- Fixed GW campaign creation so Games Workshop tracking URLs from the source email are accepted and resolved through the existing scraper to the final Google Form URL before saving the campaign.
- Corrected the GW draft-sync SQL parameter mismatch introduced during the cutoff-buffer update.
- GW draft import now stores the canonical resolved form URL.
- Auto-submit is enabled by default for newly created/imported GW campaigns; the actual external submission worker remains safety-disabled pending submission testing.
- Added an adjustable GW timing side panel opened by an `Adjust cutoff / submit timing` checkbox.
- The timing panel exposes:
  - GW supplier deadline
  - customer order cutoff
  - auto-submit time
- Email-derived defaults remain supplier deadline, customer cutoff = −30 minutes, auto-submit = −15 minutes, while allowing manual overrides.
- Campaign Review now shows a prominent submission-status indicator and, when available, the submitted timestamp.
- Added `gw_auto_submit_at` to the preorder campaign schema.
- Implementation commit: `Tawgod/Lightspeed@4ede6772df6655c8d480f3cdaf27056c548d93eb`.
- Railway `special-orders-test` deployment `9c9ada32-9de8-4f2a-8e48-dc934603bd93` reached SUCCESS with database schema initialization successful.


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

## 2026-10-14 — Scanner v0.3.21 / Lightspeed order detection rollout

**System:** Hobby Corner Toolkit Chrome extension, Timeclock scanner identity, Special Orders scanner gateway.
**Status:** **Testing** — implemented, CI tested and deployed. Browser/UI acceptance remains outstanding.

- Repository: `Tawgod/Lightspeed`, authoritative branch `integration/hobby-corner-consolidation`. Merged PR #6; deployment commit `f5202d5ea8ebd1dea88f1566ae3a0493c586d155`.
- Scanner popup now provides **Scan Open Supplier Page** with an open-tab selector and explicit per-site permission request; scanner capture is shared between toolbar action and review popup. Staff can scan another supplier product while keeping the review window open.
- Lightspeed order recognition handles more invoice labels, headings, UUID sale URLs and query parameters; selects an open Lightspeed tab even if another window is focused. The extension distinguishes Purchase Order context from customer sales/invoices and offers manual entry when a reference isn't identifiable.
- Timeclock PIN authentication now resolves existing `lightspeed_user_id` through Lightspeed users, with role catalog lookup when records only expose a role ID. Verified Admins/Managers/Account Owners have scanner approval entitlement automatically; unknown/inactive/unverified roles remain read-only. Existing Timeclock approval grants remain. Product writes stay disabled.
- Supplier scanner includes ACD UPC/SKU/MSRP/weight capture, editable suggested supplier, optional local screenshot and non-writing **Prepare Create Item** proposal. Shared supplier template backend groundwork exists but remains unmounted; templates do not sync across PCs.
- Automated scanner UI, capture, supplier template, role and sale-detection tests passed: GitHub Actions `38622351874` (includes follow-up order detector checks from `38622040997`).
- Railway successful deploys on commit `f5202d5`:
  - `lightspeed-api`: `d85d84de-6506-48ec-ab66-ebcff2b01f6c`;
  - `timeclock`: `a883ba2a-e81d-4986-8924-7734b227f890`;
  - `special-orders-test`: `6fe63052-8881-4f53-af98-036dd60c0510` (startup log: authenticated read-only scanner gateway enabled).
- Auth-denial smoke test after redeployment: GitHub Actions run `38300384359`, third attempt SUCCESS. This does not validate a real Manager PIN or a live Lightspeed match.
- Extension v0.3.21 is served from `https://lightspeed-api-production-c087.up.railway.app/extension` (unpacked ZIP). Chrome Web Store listing remains unpublished/on hold pending browser testing and privacy review.

**Next:** Have a manager install/reload v0.3.21 and test (1) order auto-detection on actual Lightspeed URL, (2) scanning selected open supplier tab, (3) ACD UPC and supplier-specific reorder code, (4) PIN showing role-based approval eligibility, (5) no-match Create Item proposal. Record any failure and correct without enabling product writes. Validate true Lightspeed role response, custom-role permission rules and Chrome optional permission prompt. Do not activate actual create/update writes without separate authorization.

## 2026-10-14 — GW preorder workflow restructured around Sync & Scrape

### Workflow
- Replaced the split "create campaign" / "import draft" flow with **Sync & Scrape** as the primary GW action.
- Sync & Scrape now creates or refreshes the GW campaign and persists scraped products immediately.
- Moved Discord preview/post controls into the same cleanup area as the scraped items.
- Campaign Status remains separate for response/submission monitoring.

### Cleanup model
- GW cleanup rows now use:
  - Item Description
  - Short Code
  - MSRP
  - Cost
  - Post Y/N
- Cost is retained internally and is not included in Discord posts.
- Post defaults to false for French/Québec products, fixtures/retailer display material, and detected case packs requiring review.
- Detected case packs store pack size and receive suggested single-item description and MSRP based on the pack MSRP divided by pack quantity.
- Legacy disposition fields remain only for compatibility with older campaigns.

### Passive responses and confirmations
- Added Discord message-to-GW-product mapping.
- Added passive Discord reaction event storage.
- Added Special Orders endpoint for GW ADD/REMOVE reaction capture.
- Matched customers receive a confirmation queue that waits 10 minutes after their latest change before sending the current order summary by Discord DM.
- If an item is removed after a confirmation was already sent, an immediate updated-order DM is queued showing the removed item and the customer's current order.
- The production Discord bot was not changed; the reaction bridge was added only to `Tawgod/Hobby-Corner-Discord-Bot:gw-preorder-test-publisher` at commit `fe6402f36c07c74c763e9596a7f606d71fe137a3`.

### References
- Cleanup model: `Tawgod/Lightspeed@c85e9dac74e788487b47150b6b28456e8f6c896f`
- Web workflow: `Tawgod/Lightspeed@4d378cdeea813f33cb13731cdc9eee06233e09a0`
- Passive responses / delayed confirmations: `Tawgod/Lightspeed@848cc75099fb51cc70fa87bcdbbb6d27d869a93e`
- Auto-submit setting propagation: `Tawgod/Lightspeed@98bc43229bc13dd4b491b05756c6d781df894eb4`
- Timing query fix: `Tawgod/Lightspeed@979352329e356e1454579d9e9deafe43e8d8769a`

### Remaining
- Deploy and verify the bot reaction bridge before passive GW reactions are considered live.
- Validate Short Code / MSRP / Cost extraction against the current real GW form and adjust parsing patterns as needed.
- Build and test the actual Google Form order-submission worker. The current auto-submit schedule/alerts exist, but external GW form submission remains safety-disabled.

## Scanner v0.3.23 / preorder staging rollout — 2026-10-14

**Status: Testing — implemented and merged, Railway rollout in progress pending final service verification.** 
- Authoritative source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; scanner PR #7 merged commit `d13f58f8a96c40466a6b47b753ef0ea866134205`. Follow-up hotfix PR #8 merged commit `4614a11d162472ba47d4d670bea2152b355fc198`.
- Scanner review now auto-checks product matches after PIN sign-in and new scan, displays SKU/description and missing UPC/weight/picture when source supports those checks, puts compact Timeclock sign-in in header and removes raw supplier JSON and employee-visible product IDs.
- Supplier matching uses authenticated read-only supplier-list lookup from existing Special Orders `suppliers` database; ACD name aliases supported, unmatched supplier warning shown. Cost, MSRP and MAP kept separate; MAP only captured from explicitly labeled sources, not inferred from advertised price.
- Added **Add to preorder campaign** checkbox: when checked, a dropdown shows existing open preorder campaigns. Verified manager/admin can stage multiple scanned items into a separate `scanner_preorder_staged_items` table linked to the campaign and supplier, with idempotent uniqueness and `PENDING_REVIEW` status. Scanner lists staged names/SKUs by campaign.
- **Safety boundary:** Scanner staging is stored in Hobby Corner database but **does not yet insert into live preorder_products**, create/update Lightspeed items or post to Discord. Future review/promotion step will move approved items into the publication workflow. Existing preorder campaigns and Discord GW publisher unchanged.
- Scanner permission failure investigated: previous Timeclock logs showed repeated Lightspeed role API lookup errors. Added documented X-Series single-user API read and safe role diagnostics to explain why PIN is read-only when role verification fails. Actual manager PIN needs live verification; no manual privilege override.
- CI successful: scanner UI regression `38629569978`, integration regression `38629576895`, and v0.3.23 Chrome artifact build `38629594665`. GW parser hotfix syntax CI `38629960382` passed.
- During simultaneous consolidated-branch rollout, a separate GW preorder parser regex error from commit `979352329e356e1454579d9e9deafe43e8d8769a` crashed `special-orders-test`. Hotfix in PR #8 corrected escaped regex syntax; awaiting Railway health verification.
- Next: verify Railway three service deployment statuses and logs, install v0.3.23 Chrome extension, validate actual manager PIN, automatic lookup, campaign staging for multiple products, duplicate safeguards, and future staged-to-live preorder approval flow. Chrome Web Store remains unpublished.

### Deployment verification addendum — 2026-10-14

- Railway consolidated commit `4614a11d162472ba47d4d670bea2152b355fc198` confirmed **SUCCESS** on `lightspeed-api`, `timeclock`, and `special-orders-test`.
- Special Orders startup verified: database schema ready, startup success, and authenticated read-only scanner gateway enabled. GW parser syntax crash fixed by PR #8.
- Post-deployment scanner security smoke test: GitHub Actions `38300384359`, attempt 4, **SUCCESS**. This confirms authorization denial checks, not a real employee PIN or a product write.
- Latest extension v0.3.23 can be obtained from the consolidated API's `/extension/download` endpoint for unpacked browser acceptance.
- **Still Testing:** Validate Admin/Manager PIN role, default product match results, chosen campaign list, staging multiple products, duplicated UPC conflict, and proper review/promotion of pending items. No Discord publication, Lightspeed product writes, or Chrome Web Store publication was performed.


## 2026-10-14 — Cross-chat Chrome extension release queue

- Added `CHROME_EXTENSION_RELEASE_QUEUE.md` to `Tawgod/Hobby-Corner:main` as the required shared release log for all Chrome extension development conversations.
- Extension releases must now reconcile queued work before version bump/package/deployment and must record explicit defer/block reasons for anything not included.
- Release completion requires updating the queue with version, consolidated commit, test result and release date.
- Seeded Purchase Order Companion as a `QUEUED` item so it cannot be silently omitted by another extension-focused chat.

## 2026-10-14 — Special Orders navigation split and Ordering work queue

### Changed
- Removed Preorder Allocations from the main Special Orders dashboard.
- Added dedicated `/preorders` page for preorder campaign demand, allocation suggestions, fair-share allocation, and queue allocation.
- Added navigation links between Special Orders, Preorder Campaigns, GW Preorders, and Ordering.
- Added dedicated `/ordering` page for supplier-order operations.

### Ordering page
- General, supplier-grouped, and category/department-grouped views.
- Displays customer, item, SKU/supplier SKU, quantity, supplier, category, supplier cost, supplier-order linkage, and line status.
- Supports line-by-line status updates using the existing status-history endpoint.
- Default active statuses: `OOS`, `READY_TO_ORDER`, `ORDERED`, `BACKORDERED`.
- Includes filters for needs-ordering-only and ordered/backordered work.

### Backend
- Added `GET /api/special-orders/ordering/work-queue`.
- Work queue reuses existing Special Orders, supplier, sourcing-department, supplier-product, and supplier-order relationships.
- No new parallel order-status store was introduced.

### Reference
- `Tawgod/Lightspeed@1f039469710fc5a6f6633ed42fafefa93071a4d7`

### Testing
- Code committed to `integration/hobby-corner-consolidation`.
- Railway build is in progress; browser acceptance is still pending.

## 2026-10-14 — Ordering supplier-draft workspace

### Added
- Supplier-grouped work queue selection on `/ordering`.
- Per-line floor-stock quantity entry before creating a supplier order.
- Local supplier-order draft creation from selected Special Order lines.
- Draft supplier-order listing and reopening.
- Add selected lines to an existing open draft for the same supplier.
- Draft line editing for customer quantity, floor quantity, total quantity, and unit cost.
- Draft metadata editing for supplier order number, expected date, and notes.
- Draft-line removal that preserves the underlying customer Special Order.
- Preferred supplier assignment directly from the Ordering queue for unattached lines.
- Product-category grouping with sourcing-department fallback.

### Supplier-order safety
- Backend prevents a Special Order line from being attached to multiple supplier orders.
- Routing changes are blocked after supplier-order attachment.
- Draft edits/removals are blocked once a supplier order is no longer `DRAFT`.
- Placeholder or unmatched products block Lightspeed PO push.
- Already-synced/linked supplier orders are blocked from a second Lightspeed push.
- Lightspeed consignment ID is persisted immediately after PO creation and before bulk line upload to protect against duplicate retries after partial failures.
- Successful explicit Lightspeed push marks the supplier order and linked Special Order lines `ORDERED` and records Special Order status history.

### References
- `Tawgod/Lightspeed@97425fa333860ad2b73a4572b775a4375dc58f34`
- `Tawgod/Lightspeed@a998c64468ec611f8a15b79c475475649e06933d`
- `Tawgod/Lightspeed@02c1bc395a2d9304f5746befd2e12ef08eb265f1`
- `Tawgod/Lightspeed@ebae33fa4c9a74948d6b7fbfea12601fe89b8a09`
- `Tawgod/Lightspeed@b1649ae2e8c1790a9c075c676ee6a13d7e133b1f`
- `Tawgod/Lightspeed@50b296feb52efc48ed1f543f9f11dcd550f68f05`
- `Tawgod/Lightspeed@597a9d8375e73cf35b514a3aea0446450a5fe649`

### Ordering workspace follow-up
- Added preferred-supplier routing directly in the Ordering queue.
- Locked supplier-draft customer quantity to the underlying Special Order line; only floor quantity and cost remain editable.
- Added server-side duplicate attachment prevention when creating or appending supplier drafts.
- Added duplicate/partial Lightspeed PO push protection by blocking already-linked orders and persisting the consignment ID before bulk line upload.
- Follow-up commits: `7be1ba90e53fc009616c81dfaef07793fdf17ccb`, `50b296feb52efc48ed1f543f9f11dcd550f68f05`, `597a9d8375e73cf35b514a3aea0446450a5fe649`, `f45543c7a870e662c798137ff3884035e74b219c`, `7463c424c8ee7f143cd7e8a9f8f3a809cd537688`, `723bd06fdb59689c3d3ab663f9fd564aeff31d2b`.

## 2026-10-15 — Ordering pivot to Lightspeed-first PO review

### Changed
- Replaced the Ordering page's local supplier-draft workflow with a Lightspeed-first review/check workflow.
- Lightspeed remains the authoritative PO workspace; Hobby Corner Ordering is now used to organize demand, verify current POs, choose suppliers, track status, and catch missing/duplicate ordering.

### Lightspeed reads
- Supplier list now comes from the live Lightspeed supplier endpoint and is synchronized only to maintain local routing IDs/history.
- Added current Lightspeed purchase-order and purchase-order-line reads.
- Added open fulfillment + sale reads to expose Lightspeed customer demand that may not exist in the local Special Orders table.

### Ordering checklist
- Added supplier filter.
- Added category filter.
- Added status filter with `All`.
- Added sorting by oldest, supplier, category, status, or customer.
- No supplier/category filter displays the full checklist.
- Local lines show current Lightspeed PO references when the linked product is already present on a current PO.
- Added optional expandable line notes with save support.

### Supplier recommendations
- Added advisory supplier suggestions using direct product mappings, existing preferred-supplier choices, explicit routing history, and category history.
- New choices are written to `supplier_routing_history` so recommendations improve with continued use.
- Recommendations do not automatically change supplier routing.

### Safety
- Lightspeed unfulfilled demand is read-only and is not automatically imported or converted into customer orders.
- Existing local supplier-draft/PO-write backend remains for compatibility but is no longer presented as the normal Ordering workflow.
- Customer-order creation in Lightspeed remains deferred pending duplicate-safe design.

### References
- `Tawgod/Lightspeed@842459dd3951f4e42b04769a57a4109f5479c783`
- `Tawgod/Lightspeed@0751837c8fb7d715a79bfd17cdb47338ceaade45`
- `Tawgod/Lightspeed@54170a4e04cf592aae44cf4f920ff86a331a4848`

## 2026-10-15 — Enrich Lightspeed unfulfilled ordering details

- Resolved real Lightspeed customers from sale/customer IDs for unfulfilled fulfillment demand.
- Added expandable customer contact details (email/phone when returned by Lightspeed).
- Resolved product names, SKU/UPC, and product image from Lightspeed product records.
- Renamed `Current Lightspeed PO` column to `LS PO#`.
- Added `Ordering Check` action on unfulfilled rows.
- Added local Special Order match count on unfulfilled demand.
- Added Special Order line count and customer-unit count to current Lightspeed Purchase Order rows.
- References:
  - `Tawgod/Lightspeed@6a8bdf6f32810b356955a404058df64abb2becf1`
  - `Tawgod/Lightspeed@f2d6ba6f78826b5ec087726151b36b99e0bd52ca`

## 2026-10-15 — Ordering activity log and aging colors

- Added `special_order_item_activity` for timestamped note and supplier-routing history.
- Ordering line Log view combines legacy status history with new note/supplier activity.
- New note saves record exact timestamp and source.
- Existing pre-history notes are shown as snapshots with best-available item update time.
- Added Age column and color-coded ordering rows:
  - 0–2 days green
  - 3–6 days yellow
  - 7–13 days orange
  - 14+ days red
- Added visible aging legend.
- Reference: `Tawgod/Lightspeed@96ca09dfbf0876b0e96e744dbcca32089b8da53d`.

## 2026-10-20 — Discord preorder watch

- Added a separate preorder watch queue for customer interest before products become orderable.
- Added WATCHING / AVAILABLE / CONVERTED / DISMISSED lifecycle.
- Stores original Discord message/link, customer identity when matched, item text, capture mode, confidence, notes, and timestamps.
- Added Discord Preorder Watch panel to the dedicated Preorder page.
- Added bot development support for:
  - conservative informal preorder-intent capture in configured chat channels,
  - `/hc preorder_watch` formal customer capture,
  - staff message context action **Add to Preorder Watch**.
- Duplicate captures from the same Discord message are deduplicated and manual staff capture can upgrade an informal capture.
- Production Discord bot remains unchanged on `main`.
- References:
  - `Tawgod/Lightspeed@b4768268e8240a202c0c75c3aa653ba755c85e2a`
  - `Tawgod/Lightspeed@08b5bcdc5b4e1e709da8aa6277c0ae635634cabd`
  - `Tawgod/Lightspeed@c61d382fbb95c90d7d2b4b985cfe589469f29c81`
  - `Tawgod/Hobby-Corner-Discord-Bot@f423a8490fb87fef308b3fb08d98014c0e1475d4`
  - `Tawgod/Hobby-Corner-Discord-Bot@084a0f23ad1414923c476a188f25c53393f39af6`



## 2026-10-22 — Railway variable consolidation/security audit
- Completed read-only audit of Hobby Corner production Railway services and `consignment-beta` test service.
- Added `RAILWAY_VARIABLE_SECURITY_AUDIT.md` with variable inventory, proposed shared/reference topology, code changes, migration/rotation plan, test order, and residual risks.
- No Railway configuration, deployments, secrets, or databases were changed.


## 2026-10-22 — Railway variable consolidation implementation started
- Created production Shared Variable references for Lightspeed, Timeclock admin, scanner service, and customer/Rewards authentication.
- Converted four application `DATABASE_URL` variables to `${{Postgres.DATABASE_URL}}`.
- Converted internal Discord/Timeclock/Rewards and scanner/Timeclock endpoints to Railway private-network references.
- No credential values were exposed or rotated.
- Controlled activation began with Timeclock; new deployment remained queued at last verification while the previous healthy deployment continued serving.


## 2026-10-26 — Shared addon UI/UX coordination planned
- Added a planned cross-project UI/UX workstream for employee-facing Hobby Corner tools.
- Scope is interface consistency only: visual language, controls, terminology, navigation, interaction patterns, and reusable components.
- Underlying service/business logic remains owned by each feature area.
- Future frontend changes should coordinate through this shared UI/UX workstream to avoid conflicting interface patterns.

## 2026-10-27 — Lightspeed-first receiving and customer notification acceptance

### Receiving
- Added duplicate-safe Lightspeed PO receiving review for Special Orders.
- Added `lightspeed_po_receipt_allocations` cumulative PO-to-Special-Order allocation tracking.
- Repeated confirmation cannot double allocate.
- Receiving verifies product membership on the selected Lightspeed PO.
- Customer allocation is capped to Lightspeed-reported received quantity when Lightspeed reports a positive received quantity.
- Fully received Special Order lines move to `RECEIVED`, record history, and generate one notification-review record.

### Customer notifications
- Added employee Customer Notification Review panel.
- Approved notifications route Discord → email → SMS based on available contact information.
- Added Approved Delivery Queue panel.
- Added duplicate-safe Discord delivery claim/send/complete API.
- Successful Discord send moves the Special Order to `CUSTOMER_NOTIFIED`.
- Discord sender implemented on bot development branch only; production bot unchanged.
- Email/SMS delivery remain pending.

### Reliability
- Scanner configuration now fails closed at the scanner gateway rather than crashing Special Orders.
- Missing scanner config names are logged without secret values.

### Split/Recall
- Reviewed current consolidated Split/Recall routes; no receiving/status dependency conflict identified and no changes made.

### References
- `Tawgod/Lightspeed@dcab50d141cec5496834f7a225b53e201d5b569b`
- `Tawgod/Lightspeed@337ff74e73a2be9952c9d20276d6098ce2dffc78`
- `Tawgod/Lightspeed@6a54990294ca7728af0114524394d51ab84dd011`
- `Tawgod/Lightspeed@6da50041a0e8c2877af9e33049c50e90c3b7c784`
- `Tawgod/Lightspeed@74a71456beb98d258bf063830f3590ad5b45f6a5`
- `Tawgod/Lightspeed@27b6cfe5369a9a3ad8cd7e31eb9dac3258f034b2`
- `Tawgod/Lightspeed@d87b18ae7d3f06feb4b0e98323136718369ac294`
- `Tawgod/Lightspeed@c1e42f5ff6b779ea87ea0e13a2d432bd7f7a6e52`
- `Tawgod/Hobby-Corner-Discord-Bot@fb9efaca20496cd20ce84798b219b5cc2b94ff47`

## 2026-10-27 — Add Messenger and WhatsApp notification options

- Added customer-level Facebook Messenger and WhatsApp contact fields.
- Added Special Orders UI fields for new and existing customers.
- Added Messenger and WhatsApp to employee notification-destination selection.
- Added `MESSENGER_READY` and `WHATSAPP_READY` delivery queues.
- Delivery queue now displays Discord, Facebook Messenger, WhatsApp, email, and SMS distinctly.
- Messenger/WhatsApp are queue-only until Meta delivery integrations are configured and tested.
- References:
  - `Tawgod/Lightspeed@f9cb4d9c2d7407df6c27e89db2b16523dc15a933`
  - `Tawgod/Lightspeed@b4dc4f4b4c4f63e29713b96c2efb909dcebb7a41`

## 2026-10-27 — Scanner integrated beta and shaded Hobby Corner UI
- Merged Lightspeed PR #14 duplicate fail-closed validation and PR #17 scanner integrated beta into `integration/hobby-corner-consolidation` at `61016a92971bceead57f07f1a09aa47461d1d343`.
- New backend scanner proposal inbox and active Timeclock employee review permissions; sandbox-only opt-in product creation route with explicit confirmation, server-side duplicate recheck and one-attempt audit. Production product writes remain disabled.
- Adopted the approved shaded navy/blue branded Scanner and Chrome toolbar popup UI; preserved existing scanner, preorder, and Lightspeed tools.
- GitHub Actions regression passed; unpacked v0.3.25 beta artifact built in [run 40549569151](https://github.com/Tawgod/Lightspeed/actions/runs/40549569151). No Chrome Web Store release.
- Railway three-service deployments succeeded at `61016a9`, but the scanner gateway log indicated missing/empty `SCANNER_SERVICE_SECRET` at runtime. Browser/PIN acceptance blocked until secure Railway secret repair. No test tenant credentials were configured; test product creation remains off.
- Shared Chrome release queue reconciled; PO/Consignment and shared UI foundation draft items carried forward.

## 2026-10-27 — Shared UI foundation for Special Orders core operations

- Adopted the coordinated Hobby Corner shared beta UI foundation on:
  - Special Orders
  - Ordering
  - Preorders
  - GW Preorders
- Added scoped `shared-ui/hc.css` and `shared-ui/core-ops-compat.css`.
- Added explicit server routes for shared stylesheets.
- Applied navy/blue shared navigation, shaded surfaces, shared controls/focus states, and current-page navigation while preserving existing workflow logic and IDs.
- No Chrome extension package/release was prepared.
- Reference: `Tawgod/Lightspeed@53b4508821319c1ab33b4d44c8b2c8bfca81880d`.



## 2026-10-27 — Planned store-operations expansion
- Added planned **Back Room Inventory** workflow for overflow stock tracking, floor capacity, and daily replenishment reminders.
- Added planned **Service Requests / Repairs / Warranty / Commissions** system tied to Lightspeed, Special Orders, Timeclock employee identity, service fees, parts ordering, and commission reporting.
- Added planned **Game Room Reservations & Events** system with configurable table/area maps, reservations, blackout dates, events, capacity and conflict handling.
- All three are planned only; no production functionality or deployment was created.
- Future implementations should reuse existing Hobby Corner infrastructure and the shared UI/UX design system.

## 2026-10-28 — Timeclock PIN sign-in for Special Orders core tools

- Replaced the normal employee-facing Special Orders access-key login with existing 4-digit Timeclock employee PIN authentication.
- Reused the signed staff-auth session gateway; PINs are verified by Timeclock and are not stored by Special Orders.
- Added shared session restoration across Special Orders, Ordering, Preorders and GW Preorders.
- Moved PIN/sign-in identity controls into the shared navy header.
- Standardized all four core navigation links across those pages.
- Kept the admin key as a server-side fallback rather than the primary employee workflow.
- Added Enter-to-sign-in and employee identity display/sign-out controls.
- Latest Railway builds were queued at final verification.



## 2026-10-28 — Manager record consolidation
- Updated `HOBBY_CORNER_PROJECT.md` with a current authoritative development matrix, supersession map, and coordination order.
- Updated `ROADMAP.md` from stale retired-branch guidance to the current consolidated development/release sequence.
- Added a current coordinated Chrome release snapshot to `CHROME_EXTENSION_RELEASE_QUEUE.md` so active PRs #22/#24/#26/#27/#30/#31 are distinguished from historical/superseded work.
- Historical entries remain preserved for audit/change history; superseded PRs should be closed only after their owning feature chats verify all unique work has been carried forward.
- No production deployment, extension packaging, version bump, or destructive repository cleanup was performed.


## 2026-10-28 — Central Git development handoffs
- Added `handoffs/README.md` and `handoffs/TEMPLATE.md` as the standard cross-chat coordination location.
- Future feature chats should update one stable handoff file per workstream on `Tawgod/Hobby-Corner:main` instead of requiring manual copy/paste into the manager conversation.
- Git history preserves prior snapshots; handoff files should contain the latest verified state.
- Extension chats must still update `CHROME_EXTENSION_RELEASE_QUEUE.md` in addition to their handoff file.
