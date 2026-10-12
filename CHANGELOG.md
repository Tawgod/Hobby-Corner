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
