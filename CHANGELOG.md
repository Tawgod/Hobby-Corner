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
