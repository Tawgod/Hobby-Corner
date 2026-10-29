# Deployment and Release Coordination — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing / Maintenance — source reconciliation in progress; no new release initiated.

## Source
- Application source: `Tawgod/Lightspeed:integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- Project master: `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`, `ROADMAP.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `BRANCH_AND_DEPLOYMENT_POLICY.md`.
- PR #24 and #27 are **MERGED**; do not repeat merge. Other current candidates: #22, #26, #28, #29, #30, #31, #32 and stacked #33, with differing release gates.

## Implemented
- Central consolidated integration branch and common Railway deployment source; central extension queue, shared UI/navigation and PR compatibility rules.
- Source recovery refs for 57 pre-Phase 1 branches across six repos; source-derived SQL reference for 52 table names preserved privately, **not** live database rows or a full backup.
- Shared-services PR #32 Phase 1 ready for review, not merged; PR #33 Phase 2 read/auth candidate **draft stacked on #32**, not merged. No new production API writer enabled.
- Invoice Reconciliation added as **Planned cross-tool feature**, no new release: approved invoice may eventually create/update OPEN supplier PO but never receive inventory; supplier sender aliases/tracking will show On the way in Special Orders.

## Tested
- GitHub PR statuses, current consolidated SHA and Railway production service sources verified 2026-10-29.
- Current Railway `timeclock`, `lightspeed-api`, `special-orders-test`, Discord Bot, Rewards, Postgres and migration-test function show latest deployment status SUCCESS. **Exact deployed commit, endpoint health under user sessions and cross-tool Chrome acceptance not verified.**
- PR #32 CI `40911078591` PASS, PR #33 CI `40920253500` PASS at last verified head; feature PR-specific CI tracked in their own stable handoffs.

## Deployed
- Production Lightspeed app services follow `integration/hobby-corner-consolidation`; latest deployments SUCCESS.
- PR #32/#33 and pending extension/feature PRs **not merged or deployed**, except PR #24/#27 source already merged.
- No separate Chrome extension package/version release verified by this handoff.
- Railway integration test beta Consignment service is separate and not proven promoted to PR #30.

## Shared dependencies
- Release order: source review/feature acceptance; shared service PR #32; PR #33 test-tenant read validation and gated consumer conversion; feature-specific PRs; release branch; Chrome queue reconciliation; staff Chrome acceptance; then explicit deployment/extension release approval.
- Active shared surfaces: `extension/popup.html`, `popup.js`, `manifest.json`, `extension/content.js`, `server.js`, `shared-ui/*`, staff session and PO read APIs.
- New invoice feature belongs to Product Manager/Scanner/Special Orders, not a standalone app; no PO receive/stock mutation.

## Remaining blockers
- Test tenant vendor API parity, production Postgres full backup/recovery gap, controlled DB migration planning.
- PR #22 and #26 real extension acceptance; PR #31 secure live PO load and branch overlap; #28 Product Manager live read/auth; #29 physical Avery print; #30 isolated Consignment test.
- Chrome release queue READY/QUEUED/BLOCKED full reconciliation before any build.

## Decisions needed
- Explicit integration merge/automatic Railway deployment approval; Chrome version/package/release approval; isolated test service promotion vs production.
- Which suppliers and invoice mailbox may later support the planned invoice feature (not a release prerequisite).

## Recommended next action
- Reconfirm active PR heads/CI and Railways before approved integration; do **not** merge PR #32/#33 or make a new extension release as a side effect of documentation/handoffs.

## Restrictions / safety
- Never auto-merge production-connected consolidated code, run production schema migrations, remove volumes, alter secrets or publish extension without explicit authorization.

## Documentation
- `HOBBY_CORNER_PROJECT.md`, `CHROME_EXTENSION_INTEGRATION.md`, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `HOBBY_CORNER_CHAT_TRANSITION.md`, `FEATURE_INVOICE_RECONCILIATION.md`.
