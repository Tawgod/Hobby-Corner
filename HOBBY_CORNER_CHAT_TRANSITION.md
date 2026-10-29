# Hobby Corner Development Chat Transition — Pre-Archive Checklist

**Last verified:** 2026-10-29  
**Status:** In Development — not ready to archive all old feature chats.

## Source of truth and restart order

1. Read `HOBBY_CORNER_PROJECT.md` **Current Authoritative Development Matrix**.
2. Verify actual GitHub PR state, current integration branch and feature branch head; do not trust historical matrix rows over live GitHub.
3. Check Railway deployed service branch/deployment **separately**; unmerged PR code is not deployed.
4. Read `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md` and the relevant workstream-specific prompt under `prompts/lightspeed-shared-services/`.
5. Read that feature's latest stable `handoffs/<feature>.md` file; if missing, prepare a verified first handoff before archiving its old chat.
6. For Chrome extension work, read `CHROME_EXTENSION_INTEGRATION.md` and `CHROME_EXTENSION_RELEASE_QUEUE.md`; inspect active PRs before any packaging/release.
7. Continue on an isolated feature branch, preserve working workflows, run tests, and write the updated handoff to Git.

## Verified shared foundation

- Consolidated application: `Tawgod/Lightspeed:integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- PR #24 Core Operations navigation and PR #27 shared UI: **merged**.
- PR #32: Phase 1 Shared Lightspeed foundation, code/testing complete, **ready for review, unmerged, not deployed**.
- PR #33: Phase 2 read-service and explicit permissions candidate, **draft stacked on PR #32, unmerged, not deployed**. Current branch `feature/shared-lightspeed-services-phase2-reads-20261029` @ `baef5f654df994e8e1ec23ad950b7d335b345817`. Automated CI `40919331215` PASS.
- The new shared operation matrix `SHARED_STAFF_AUTH_PERMISSIONS.md` does not change current Core Operations or Scanner permissions. All production-capable new shared writes remain denied by default.
- Git recoverable source branches exist; the source-derived Postgres schema is NOT a dump of live database rows.

## Central handoff inventory (verified GitHub file presence)

| Feature/chat | Stable handoff | Readiness | Outstanding pre-archive action |
| --- | --- | --- | --- |
| Shared Lightspeed services (this chat) | `handoffs/lightspeed-shared-services.md` | Exists | Keep current with PR #32/#33; finish permission and consumer acceptance |
| Core Operations / Special Orders | `handoffs/core-operations.md` | Exists, merged status corrected | Feature owner should check remaining real workflow tests and pending change history |
| Shared UI / UX Coordination | `handoffs/shared-ui.md` | Exists, merged status corrected | Keep the UI coordination chat; reconcile extension package state |
| Product Manager | `handoffs/product-manager.md` | Exists; may lag current PR #28 work | Recheck current branch/head, Timeclock profiles/drafts, autosave, implementation/testing/deployment |
| Scanner / Toolkit | `handoffs/product-scanner.md` | **Missing** | Verify PR #26, PIN, supplier, test writer, UI/nav, outstanding browser acceptance, release queue |
| Timeclock / Split Recall | `handoffs/timeclock-split-recall.md` | **Missing** | Verify PR #22, current Timeclock integration, extension, sessions and sale workflow acceptance |
| PO Companion | `handoffs/po-companion.md` | **Missing** | Verify PR #31, shared PO contract, local supplier SKU mapping, draft/review behavior |
| Consignment | `handoffs/consignment.md` | **Missing** | Verify PR #30, isolated beta, test tenant/customer/credit isolation |
| Avery PO Labels | `handoffs/avery-labels.md` | **Missing** | Verify PR #29, template/physical print acceptance and queued extension dependencies |
| Rewards / Customer Sync | `handoffs/rewards.md` | **Missing** | Verify Discord bot main and Railway Rewards, legacy API client, service health |
| RMS migration | `handoffs/rms-migration.md` | **Missing** | Verify separate migration branches, dry-run/reconciliation and secret isolation |
| Deployment Coordination | `handoffs/deployment-coordination.md` | **Missing** | Verify the current active release matrix and merge order |
| Railway Security / Config | `handoffs/railway-security.md` | **Missing** | Confirm deployed secrets names/config ownership only; never copy secret values |

A **missing handoff is not evidence of missing feature work**. It means the old chat's current state has not yet been centrally verified/documented.

## Proposed new chat startup prompt

Use `prompts/NEW_TOOL_CHAT_STARTUP.md`, replacing the workstream placeholder with the actual feature. The feature-specific prompt file and current handoff remain required.

## Archive checkpoint

Do not archive the previous tool chats until:
- Every active feature has a current verified Git handoff with branch, PR, implemented/tested/deployed separation, blockers and dependencies.
- Current requirements unique to the old feature chat have been checked against source/docs/handoff.
- The cross-chat Chrome extension release queue and open feature PRs have been reconciled.
- A fresh-chat startup prompt points each feature to its stable handoff and current code.
- No outstanding tool-specific implementation tasks exist **only** as uncommitted old-chat discussion.

**No production merge, deployment or extension publishing is implied by any handoff update.**
