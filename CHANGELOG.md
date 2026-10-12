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
