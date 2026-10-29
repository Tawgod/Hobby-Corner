# Hobby Corner Development Chat Transition — Pre-Archive Checklist

**Last verified:** 2026-10-29  
**Status:** In Development — not ready to archive all old feature chats.

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

## Central handoff inventory (GitHub records created 2026-10-29)

| Feature/chat | Stable handoff | Readiness | Outstanding pre-archive action |
| --- | --- | --- | --- |
| Hobby Corner Manager / Cross-project coordination | `handoffs/hobby-corner-manager.md` | **Final audit complete 2026-10-29** | Safe to transition to a new manager chat using the stable manager handoff and current matrix |
| Shared Lightspeed services | `handoffs/lightspeed-shared-services.md` | Exists | Keep current with PR #32/#33 and invoice create/update plan; consumer acceptance pending |
| Core Operations / Special Orders | `handoffs/core-operations.md` | **Feature-owner archival audit complete 2026-10-29** | Safe to archive this Core Operations chat; remaining runtime, notification and Invoice Reconciliation work is fully recorded in Git |
| Shared UI / UX Coordination | `handoffs/shared-ui.md` | Exists, merged status corrected | Keep the UI coordination chat; reconcile extension package state |
| Product Manager | `handoffs/product-manager.md` | Exists | Head CI/staff profiles and invoice dropdown requirements require feature-owner signoff |
| Scanner / Toolkit | `handoffs/product-scanner.md` | **Created, verified PR/CI** | Real Chrome PIN/supplier/scan acceptance and future invoice sender/price bridge owner review |
| Timeclock / Split Recall | `handoffs/timeclock-split-recall.md` | **Final audit expanded 2026-10-29** | Fix verified missed-entry/entry-filter backend defects; accept PTO/shifts/non-Discord onboarding; rebase 7-behind PR #22 and complete real Chrome Split/Recall acceptance |
| PO Companion | `handoffs/po-companion.md` | **Created, verified PR/CI** | Live read-only PO auth, pagination and invoice context; employee Chrome tests |
| Consignment | `handoffs/consignment.md` | **Feature-owner audited 2026-10-29; Git verified** | Current PR #30 7 commits behind; beta on old branch; real employee/DB/customer/store-credit acceptance remains future work, all requirements preserved in handoff |
| Avery PO Labels | `handoffs/avery-labels.md` | **Created, verified PR/CI** | Physical Avery 5960 print/native Chrome acceptance |
| Rewards / Customer Sync | `handoffs/rewards.md` | **Created, source+Railway checked** | Read-only job/customer sync verification with owner |
| RMS migration | `handoffs/rms-migration.md` | **Created, branch inventory checked** | Real data dry-run/collision and cutover owner review |
| Deployment Coordination | `handoffs/deployment-coordination.md` | **Created, source+Railway checked** | Release order, test and production approval gates |
| Railway Security / Config | `handoffs/railway-security.md` | **Created, source+Railway checked** | Secret reference and backup review, no credential values accessed |

**All nine previously missing stable handoff files have now been created**, from verified available GitHub source/PR/CI evidence and Railway topology where relevant. These are coordination snapshots, not proof that every old-chat requirement has been transferred, tested or deployed. Feature owners should review their own handoffs for unique outstanding requirements before archiving previous chats. No missing handoff file remains in this inventory.

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

## Archive checkpoint

Do not archive the previous tool chats until:
- Every active feature has a current verified Git handoff with branch, PR, implemented/tested/deployed separation, blockers and dependencies.
- Current requirements unique to the old feature chat have been checked against source/docs/handoff.
- The cross-chat Chrome extension release queue and open feature PRs have been reconciled.
- A fresh-chat startup prompt points each feature to its stable handoff and current code.
- No outstanding tool-specific implementation tasks exist **only** as uncommitted old-chat discussion.

**No production merge, deployment or extension publishing is implied by any handoff update.**
