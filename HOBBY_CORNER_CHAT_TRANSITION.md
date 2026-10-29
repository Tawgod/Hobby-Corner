# Hobby Corner Development Chat Transition — Active Conversations and Archived Handoffs

**Last verified:** 2026-10-29  
**Status:** User-confirmed legacy chat archival completed 2026-10-29; five coordination/development chats remain active. This document preserves earlier audit results and future restart rules. Archived-chat status is reported by the owner, not independently verifiable through GitHub.

## Current conversation topology — owner confirmed 2026-10-29

The owner reports that **all other development conversations have been archived**. Five conversations intentionally remain open and active:

| Continuing conversation | Ownership and working agreement | Stable Git snapshot |
| --- | --- | --- |
| **This Chat — Shared Lightspeed Services** | Shared X-Series transport, Timeclock-backed access, reusable reads, audited/idempotent mutation architecture, and cross-tool integration contracts. May coordinate future Invoice Reconciliation architecture; does not become a replacement for each feature's own implementation work. | `handoffs/lightspeed-shared-services.md` |
| **Hobby Corner Manager** | Overall project roadmap, priorities, cross-feature decisions, ownership and durable handoff synchronization; **remains the active manager channel**. | `handoffs/hobby-corner-manager.md` |
| **Shared UI / UX Coordination** | Common branding, layouts, navigation, accessibility, shared Chrome-extension UI surfaces, consistency across tools; no business-logic ownership. | `handoffs/shared-ui.md` |
| **Deployment Coordination** | Git branch and PR integration, Railway/deployment verification, Chrome extension release queue, environment and release safety gates. No unapproved deployment or merge. | `handoffs/deployment-coordination.md` |
| **RMS Item Migration** | **Independent, continuing migration development conversation**, separate from day-to-day tools. Owns RMS item/source cleanup, conversion/collision review, migration-specific rehearsals and staged import. | `handoffs/rms-migration.md` |

The archived feature chats remain represented by their existing Git handoffs and GitHub source/PR history. **Archiving a chat does not mean its feature is implemented, tested, deployed, cancelled, or deleted.** Future tool development can resume in a focused new conversation when prioritized, starting with `prompts/NEW_TOOL_CHAT_STARTUP.md`, its stable handoff, and current GitHub/Railway truth; no new conversation is required merely to preserve a handoff.

### RMS migration: separate ownership, reusable code when appropriate

- RMS Item Migration remains isolated from routine Product Manager, Scanner, Special Orders, PO Companion, and shared-services deployment schedules. **Do not force migration-specific writers, credentials, or temporary schemas into production tool code.**
- Other tools **may reuse relevant reviewed migration code or algorithms** for exact SKU/UPC identity (including leading zeros), duplicate/collision detection, supplier/category/brand normalization, validation, and safe staging/preview, when genuinely useful.
- Reuse means **inspect the specific branch/commit and code/tests first**; adapt pure logic or extract a tested shared module/contract when appropriate. Preserve source attribution, provenance and edge-case tests. Never copy hardcoded credentials, historical RMS inventory on-hand, unreviewed direct Lightspeed clients, or live bulk-write behavior.
- Migration remains the owner of migration workflows; shared Lightspeed services own canonical production API policy, Timeclock auth, product matching interfaces, audited operations and runtime writes. Cross-chat code adoption should be recorded in both `handoffs/rms-migration.md` and the consuming feature handoff with relevant PR/commit/tests.
- No migration-branch merge, Railway deployment, live Lightspeed import or schema change is authorized by this ownership decision.

### Archived tool handoff usage

Existing handoffs under `handoffs/` stay discoverable for the archived Product Manager, Scanner, PO Companion, Consignment, Core Operations, Timeclock/Split Recall, Avery Labels, Rewards, Ring Camera research, Railway Security and other recorded workstreams. The earlier pre-archive status table below is **historical audit context**, not a claim that those chats remain open or need to be reopened.

## Shared future feature to carry into existing tool chats — Invoice Reconciliation

On 2026-10-29 the owner requested one new feature spanning **existing** Product Manager, Product Scanner, Special Orders/Ordering and PO Companion. Source of truth: `FEATURE_INVOICE_RECONCILIATION.md`; development intro `prompts/lightspeed-shared-services/invoice-reconciliation-feature.md`. It is **Planned**, not an independent new tool and not merged/deployed.

Every replacement chat for those tools must read the feature specification as a dependency. Product Manager needs a shared invoice-select dropdown (not an employee profile); Scanner must submit supplier UPC/SKU/cost proposals; Special Orders/PO Companion must link verified invoice/PO/tracking context. The shared gateway will stage 90%+ match candidates and eventually **create a new OPEN supplier PO or update an existing PO** after full invoice approval, **without any receiving or stock-on-hand change**. Preserve the primary supplier while proposing secondary supplier links; verified sender aliases connect shipping emails/tracking to the correct supplier, invoice and PO for Special Orders **On the way** status. No feature chat should independently create email ingestion or PO write credentials.

The Scanner bridge is QUEUED for a later Chrome extension release, not part of current extension packaging. **Do not treat this planned item as a blocker to creating new chats after their handoffs are complete**; carry the written requirements forward.

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
- PR #33: Phase 2 read-service and explicit permissions candidate, **draft stacked on PR #32, unmerged, not deployed**. Current branch `feature/shared-lightspeed-services-phase2-reads-20261029` @ `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a`. Final automated CI `40920253500` PASS.
- The new shared operation matrix `SHARED_STAFF_AUTH_PERMISSIONS.md` does not change current Core Operations or Scanner permissions. All production-capable new shared writes remain denied by default.
- Git recoverable source branches exist; the source-derived Postgres schema is NOT a dump of live database rows.

## Historical handoff inventory (snapshots prepared before archive)

| Feature/chat | Stable handoff | Readiness | Outstanding pre-archive action |
| --- | --- | --- | --- |
| Hobby Corner Manager / Cross-project coordination | `handoffs/hobby-corner-manager.md` | **Active manager channel; audit reconciled 2026-10-29** | **Do not archive/replace this chat.** Continue using it as the project-management channel; the handoff is the durable Git snapshot for continuity. |
| Shared Lightspeed services | `handoffs/lightspeed-shared-services.md` | Exists | Keep current with PR #32/#33 and invoice create/update plan; consumer acceptance pending |
| Core Operations / Special Orders | `handoffs/core-operations.md` | **Feature-owner archival audit complete 2026-10-29** | Safe to archive this Core Operations chat; remaining runtime, notification and Invoice Reconciliation work is fully recorded in Git |
| Shared UI / UX Coordination | `handoffs/shared-ui.md` | Exists, merged status corrected | Keep the UI coordination chat; reconcile extension package state |
| Product Manager | `handoffs/product-manager.md` | Exists | Head CI/staff profiles and invoice dropdown requirements require feature-owner signoff |
| Scanner / Toolkit | `handoffs/product-scanner.md` | **Created, verified PR/CI** | Real Chrome PIN/supplier/scan acceptance and future invoice sender/price bridge owner review |
| Timeclock / Split Recall | `handoffs/timeclock-split-recall.md` | **Final audit expanded 2026-10-29** | Fix verified missed-entry/entry-filter backend defects; accept PTO/shifts/non-Discord onboarding; rebase 7-behind PR #22 and complete real Chrome Split/Recall acceptance |
| PO Companion | `handoffs/po-companion.md` | **Created, verified PR/CI** | Live read-only PO auth, pagination and invoice context; employee Chrome tests |
| Consignment | `handoffs/consignment.md` | **Feature-owner audited 2026-10-29; Git verified** | Current PR #30 7 commits behind; beta on old branch; real employee/DB/customer/store-credit acceptance remains future work, all requirements preserved in handoff |
| Avery PO Labels | `handoffs/avery-labels.md` | **Created, verified PR/CI** | Physical Avery 5960 print/native Chrome acceptance |
| Ring Camera Integration | `handoffs/ring-cameras.md` | **Final research handoff committed 2026-10-29** | Requirements and official API uncertainties preserved; no Ring implementation/production changes; old chat can be archived after confirming its final audit response |
| Rewards / Customer Sync | `handoffs/rewards.md` | **Created, source+Railway checked** | Read-only job/customer sync verification with owner |
| RMS migration | `handoffs/rms-migration.md` | **Created, branch inventory checked** | Real data dry-run/collision and cutover owner review |
| Deployment Coordination | `handoffs/deployment-coordination.md` | **Created, source+Railway checked** | Release order, test and production approval gates |
| Railway Security / Config | `handoffs/railway-security.md` | **Created, source+Railway checked** | Secret reference and backup review, no credential values accessed |

**All nine previously missing stable handoff files have now been created**, from verified available GitHub source/PR/CI evidence and Railway topology where relevant. These are coordination snapshots, not proof that every old-chat requirement has been transferred, tested or deployed. Feature owners should review their own handoffs for unique outstanding requirements before archiving previous chats. No missing handoff file remains in this inventory. Ring Camera Integration has a separate research-only handoff, linked above.

## Proposed new chat startup prompt

Use `prompts/NEW_TOOL_CHAT_STARTUP.md`, replacing the workstream placeholder with the actual feature. The feature-specific prompt file and current handoff remain required.

## Handoff creation checkpoint — 2026-10-29

- Created and read-back-checkable Git records for Product Scanner, PO Companion, Timeclock/Split Recall, Consignment, Avery Labels, Rewards, RMS Migration, Deployment Coordination and Railway Security.
- Verified PR head and automated test run evidence for #22, #26, #29, #30 and #31; verified Rewards/Discord app source and deployment status; verified migration branches and Railway production environment.
- These handoffs do not certify live Chrome, real PO/employee, physical printing, migration rehearsal or restore testing. Old chats can be retired **only after** feature owners check uncommitted/historical requirements and release blockers.
- The planned invoice feature includes approved **new OPEN PO creation or existing PO updates**, secondary supplier links, sender aliases, multi-shipment tracking and a separate Special Orders On the way indicator; never physical receipt.

## Timeclock / Split Recall final-chat checkpoint — 2026-10-29

- The stable handoff was expanded after reviewing this conversation's full available history against current source and Railway. It now preserves PTO/payroll-authority decisions, requested PTO hours, PTO eligibility, time off, store hours, shifts/open shifts, role notification, non-Discord onboarding, entry browsing/correction, Central-time behavior, shared staff auth and the complete Split/Recall release gate.
- Current deployed backend is consolidated `f50c330982`; current deployed Discord Timeclock `main.py` is byte-identical to repository `main.py`.
- Two source defects must follow into the replacement chat: undefined `createManualTimeEntry` behind the Admin missed-entry route and malformed employee-filter SQL bind placeholder in `listTimeEntries()`.
- PR #22 remains `f9e8f0af` but is now 2 ahead / 7 behind current consolidated. Its content-script base did not change, but the PR must be reconciled before release integration. GitHub currently reports the PR non-mergeable until that reconciliation is resolved.
- This workstream is documented sufficiently to start a replacement chat without relying on old conversation memory, but it is not feature-complete or release-ready.

### Manager chat exception

The designated **Hobby Corner Manager** conversation is not part of the old-feature-chat archival migration unless the owner explicitly says otherwise. Audit/reorganization prompts entered there are for refreshing its authoritative state and cross-chat records. Its Git handoff exists for durability and coordination, not because the manager conversation should be replaced.

### Ring research handoff checkpoint — 2026-10-29

- Verified `handoffs/ring-cameras.md` on `main` (commit `e10879601d1c`). It preserves researched Ring OAuth/webhooks/live-feed and uncertain PTZ control capabilities, staff Timeclock permissions, Discord notification plans, privacy/retention questions, device-model compatibility and proof-of-concept restrictions. Status is **Planned**, with no implementation, API device testing or deployment.
- Core Operations / Special Orders `handoffs/core-operations.md` was independently read after the old chat encountered a conversation-length limit. The complete current Git snapshot and original outstanding requirements remain present; the feature-owner audit and manager transition matrix mark it safe to archive. Conversation truncation itself does not remove Git-committed source or documentation.
- Other chats still require their own old-history completeness check; a created handoff is not by itself an archive authorization.

## Historical pre-archive checklist (retained for future tool-chat transitions)

Do not archive the previous tool chats until:
- Every active feature has a current verified Git handoff with branch, PR, implemented/tested/deployed separation, blockers and dependencies.
- Current requirements unique to the old feature chat have been checked against source/docs/handoff.
- The cross-chat Chrome extension release queue and open feature PRs have been reconciled.
- A fresh-chat startup prompt points each feature to its stable handoff and current code.
- No outstanding tool-specific implementation tasks exist **only** as uncommitted old-chat discussion.

**No production merge, deployment or extension publishing is implied by any handoff update.**
