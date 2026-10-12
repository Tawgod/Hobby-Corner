# Hobby Corner Project Changelog

This file tracks meaningful project-wide development and management changes. Service-specific commit history remains in each owning repository.

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
