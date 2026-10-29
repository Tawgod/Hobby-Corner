# Hobby Corner Manager / Cross-Project Coordination — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Maintenance / In Development — manager records current; multiple feature workstreams remain active.

**Manager chat disposition:** This Hobby Corner Manager conversation remains the active project-management channel. The 2026-10-29 final-audit prompt was used to reconcile and refresh this chat's records, **not** to archive or replace this manager conversation.

## Source

- Management repository: `Tawgod/Hobby-Corner`
- Authoritative management branch: `main`
- Verified management branch head before this handoff update: `c8a31173e5c66b884f7749e2af0a169e173f39c7`
- Authoritative application repository: `Tawgod/Lightspeed`
- Authoritative application branch: `integration/hobby-corner-consolidation`
- Verified consolidated application head: `f50c3309824986633c3ba37a95e6eb43aae15a3c`
- Current manager PR: none; manager coordination is maintained directly in `Tawgod/Hobby-Corner:main`
- Active application PRs at verification: #22, #26, #28, #29, #30, #31, #32, #33
- Merged coordinated baseline PRs: #27 Shared UI and #24 Core Operations UI/navigation
- Historical/superseded PRs remain in Git for audit; do not close/delete merely for cleanup.

## Conversation responsibilities

This manager conversation owns project-wide coordination rather than one feature implementation. Its responsibilities include:

- authoritative project matrix, roadmap, architecture decisions and dependency tracking;
- reconciliation between GitHub source, Railway deployment state, Google/Sheets operational sources and historical chat requirements;
- shared Chrome extension integration/release policy and cross-feature conflict coordination;
- cross-chat handoff protocol and archive/readiness process;
- shared UI/UX coordination records;
- shared Lightspeed service architecture and cross-tool conversion coordination;
- shared Timeclock-backed employee-auth/permission policy coordination;
- Railway deployment/security coordination records;
- registration of planned cross-tool features and future store-operation workstreams;
- preserving manager-ready handoffs so feature chats do not require manual copy/paste.

This manager chat should not become the feature owner for Product Scanner, PO Companion, Consignment, Product Manager, Timeclock/Split Recall, Avery Labels, RMS migration or Rewards. Their stable handoffs remain authoritative for feature-specific implementation.

## Implemented / completed coordination work

### Project registry and roadmap cleanup
- Added and maintained the Current Authoritative Development Matrix in `HOBBY_CORNER_PROJECT.md`.
- Replaced stale roadmap guidance with the current consolidated-branch and coordinated-release model.
- Established explicit separation between **Implemented**, **Tested**, and **Deployed**.
- Preserved historical records rather than deleting old development history.

### Central Git handoff system
- Established `Tawgod/Hobby-Corner:main/handoffs/` with `README.md` and `TEMPLATE.md`.
- Defined one stable, latest-snapshot handoff file per workstream; Git history preserves older snapshots.
- Created/maintained handoffs for Core Operations, Shared UI, Product Manager, Product Scanner, Timeclock/Split Recall, PO Companion, Consignment, Avery Labels, Rewards, RMS migration, Deployment Coordination, Railway Security and Shared Lightspeed Services.
- Development chats are expected to update their handoff directly; Chrome-extension chats also update `CHROME_EXTENSION_RELEASE_QUEUE.md`.

### Chrome extension coordination
- Established `CHROME_EXTENSION_INTEGRATION.md` and `CHROME_EXTENSION_RELEASE_QUEUE.md` as shared authorities.
- Shared extension files are integration-owned: manifest, popup, content script, shared navigation/UI/auth/message contracts and packaging/version files.
- Current extension candidates remain:
  - PR #26 Scanner/Toolkit popup/navigation.
  - PR #22 Timeclock + Split/Recall content-script UI.
  - PR #31 PO Companion.
  - PR #30 Consignment feature; launcher decision still separate.
- PR #24/#27 are merged baseline source and are not Chrome-release events.
- No production Chrome package/version/Web Store release was performed by this manager conversation.

### Shared UI / navigation coordination
- Shared UI reconciliation PR #27 merged.
- Core Operations UI/navigation PR #24 merged.
- PR #21/#23 are predecessor Core Operations work; PR #16 is predecessor shared-UI work.
- Real-browser acceptance for PR #24 included valid/invalid PIN, refresh session restoration, persistent sign-out, navigation/buttons and native zoom.
- Shared UI merge does not certify all extension feature/browser acceptance.

### Shared Lightspeed services architecture
- Added `LIGHTSPEED_SHARED_SERVICES.md`.
- Defined canonical shared domains for transport, policy, audit/idempotency, customers, product identity/matching, products, catalog, media, inventory, sales, fulfillments, purchase orders, store credit and customer custom fields.
- Cross-service production consumers should use the canonical `lightspeed-api` gateway rather than independently holding/implementing production Lightspeed clients.
- Feature orchestration remains feature-owned.
- Scanner isolated-test writer and RMS bulk migration remain explicit isolated exceptions.
- Created per-chat conversion prompts under `prompts/lightspeed-shared-services/`.

### Shared employee authentication / permissions
- Timeclock remains the employee/PIN identity authority.
- Shared staff sessions must be verified server-side and recheck active employee state.
- No parallel feature employee identity system is allowed.
- Existing Scanner/Core Operations current all-active-employee behavior must not be silently restricted.
- New shared production write operations remain denied by default until exact operation grants, write gates, audit/idempotency and readback are approved/tested.
- Source contract: `SHARED_STAFF_AUTH_PERMISSIONS.md`.

### Future store-operations workstreams registered
The following are preserved as **Planned**:
- **Back Room Inventory:** track back-room quantity, floor capacity, and daily floor-restock queue; reuse Product Scanner/Lightspeed identity; do not create a second total-inventory source of truth.
- **Service Requests / Repairs / Warranty / Commissions:** service-ticket lifecycle, parts via Special Orders, Lightspeed customer/product/sale integration, Timeclock employee assignment, service fees, sales-rep mapping and commission reporting.
- **Game Room Reservations & Events:** configurable room/hallway resource map, table size/capacity, reservations, blackouts, events/recurrence, conflict prevention, calendar/floor-map views, shared notifications and optional later Lightspeed fee/payment integration.

### Invoice Reconciliation feature preserved
- Source: `FEATURE_INVOICE_RECONCILIATION.md`.
- This is one future cross-tool feature spanning Product Manager, Product Scanner, Special Orders/Ordering and PO Companion, not a standalone duplicate tool.
- It may:
  - ingest supplier invoice/preorder/shipping/tracking emails;
  - extract PDF invoice evidence;
  - match a uniquely appropriate existing PO or stage creation of a new **OPEN** supplier PO;
  - auto-stage high-confidence 90%+ product candidates for review;
  - propose non-primary/secondary supplier links without replacing the primary supplier;
  - maintain verified shipping-sender aliases;
  - link tracking/shipment evidence to supplier/invoice/PO;
  - display informational **On the way / In transit** status in Special Orders.
- It must **never receive products, write received quantity, mark a PO received/ready, or change stock-on-hand**.
- Full invoice resolution and explicit approval precede any future approved PO create/update.
- Browser clients do not own PO write credentials.

## Current GitHub status

### Merged baseline
- PR #27 Shared UI: merged 2026-10-28.
- PR #24 Core Operations UI/navigation: merged 2026-10-28.
- Consolidated branch now at `f50c3309824986633c3ba37a95e6eb43aae15a3c`.

### Open feature PRs
All of the following have successful existing CI evidence but are currently **7 commits behind** consolidated and therefore require current-base reconciliation before integration:
- PR #22 Timeclock/Split Recall — head `f9e8f0af75306bd17b0ebf9d6d6d36eef7a6b1b2`; CI `40725000899` PASS.
- PR #26 Scanner/Toolkit — head `0b3e6f110932efea94dc23c23903cc97ee20e541`; current-head Scanner CI PASS; real loaded Chrome acceptance pending.
- PR #28 Product Manager — head `e8938dee17718a2d9e30a38b03121cc7893600d0`; CI `40753298705` PASS.
- PR #29 Avery Labels — head `a000c084d8d3f3bd818dda6d4ef244885e3bb11e`; CI `40730902857` and Scanner regression `40730902922` PASS.
- PR #30 Consignment — head `647a8f6cc4b5844c43e07b88cc256fc9ca6623d8`; safety/browser/Scanner CI PASS.
- PR #31 PO Companion — head `a4ef5475cfa4a3cc44e1903898944d4dd8d0d832`; PO regression `40730813762` and Scanner regression `40730814092` PASS.

### Shared-service PRs
- PR #32 Phase 1 — head `7c20b3d9f90382b6fafeb5dc3d9a92108f4c14e1`; 30 ahead / 0 behind consolidated; CI `40911078591` PASS; ready for coordinated review; **not merged/deployed**.
- PR #33 Phase 2 — head `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a`; stacked on #32; 57 ahead / 0 behind consolidated; final CI `40920253500` PASS; **draft, not merged/deployed**.
- No feature consumer has yet been switched to the shared read gateway.
- No Phase 1 database migration has been applied to Railway.

## Tested

### Manager/documentation verification
- Live GitHub PR state, consolidated branch head and current PR head workflow runs were checked on 2026-10-29.
- Current branch divergence from consolidated was checked for #22/#26/#28/#29/#30/#31/#32/#33.
- Central handoff inventory was checked directly in GitHub.

### Railway verification
Production project: `Hobby Corner` (`f7e91de7-43f6-472e-b4ca-46b0623f8e0e`)  
Production environment: `c562fbb2-8431-4beb-834d-6938b3a2ad10`

Verified latest deployment state:
- `lightspeed-api` deployment `6d1d3cd4-dcd1-4827-b07a-8b36bf926df2` — SUCCESS at `f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- `timeclock` deployment `16f7d019-9267-4196-b85e-0d4c2b15f121` — SUCCESS at the same commit.
- `special-orders-test` deployment `b327d98a-e178-495b-ad72-2936dccaee0a` — SUCCESS at the same commit.
- `Hobby-Corner-Rewards` latest deployment `07c0c365-a8d4-4a2e-a120-2034e4db91fc` — SUCCESS at Discord-Bot main commit `ce54862f67d678f8a1cb77302e520c59fb0c7118`.
- `Hobby-Corner-Discord-Bot` deployment `3a8e9375-aad7-4c47-9721-66790febaeae` — SUCCESS at `7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9`.
- Postgres deployment is SUCCESS; persistent volume `f50e8013-7ada-4dd4-ba1e-0f933fb0e17b`, 5000 MB.
- `migration-test-bsi117` latest deployment is SUCCESS.
- No staged Railway changes or pending deployment work existed at verification.

### Important testing limits
- Railway SUCCESS verifies deployment state, not feature workflow acceptance.
- Open feature PR CI was not rerun after current-base reconciliation because those branches have not yet been reconciled.
- Real loaded-extension employee acceptance remains incomplete for #22/#26/#31.
- Product Manager live auth/persistence/native-browser acceptance remains incomplete.
- Avery physical 5960 print acceptance remains incomplete.
- Consignment isolated DB/live read-only matching/store-credit acceptance remains incomplete.
- PR #32/#33 have no live tenant consumer acceptance.
- Source-derived Postgres schema recovery is **not** a dump/backup of live database rows.

## Deployed

- Current production-connected consolidated source is `f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- PR #24/#27 effects are therefore present in the deployed consolidated Railway services.
- PRs #22/#26/#28/#29/#30/#31/#32/#33 are not merged/deployed.
- Historical Consignment isolated beta is not proof that PR #30 is deployed.
- No coordinated Chrome extension production release has been verified from the current candidates.
- No shared-service database migration has been applied.
- Invoice Reconciliation has no implementation/deployment.

## Shared dependencies

- `LIGHTSPEED_SHARED_SERVICES.md`
- `SHARED_STAFF_AUTH_PERMISSIONS.md`
- Timeclock employee identity/session verification
- Railway PostgreSQL durable operational storage
- Product Scanner shared product matching
- Special Orders / Ordering / Preorders
- PO Companion purchase-order reads/mapping
- Product Manager employee profiles/drafts
- Consignment/store-credit safeguards
- Rewards/customer sync
- Discord notifications
- Chrome extension shared navigation/UI/release contract
- Invoice Reconciliation future cross-tool staging

## Shared files / integration surfaces affected by manager decisions

- `HOBBY_CORNER_PROJECT.md`
- `ROADMAP.md`
- `HOBBY_CORNER_CHAT_TRANSITION.md`
- `CHANGELOG.md`
- `LIGHTSPEED_SHARED_SERVICES.md`
- `SHARED_STAFF_AUTH_PERMISSIONS.md`
- `FEATURE_INVOICE_RECONCILIATION.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `handoffs/*`
- `prompts/lightspeed-shared-services/*`
- `prompts/NEW_TOOL_CHAT_STARTUP.md`

The manager chat coordinates these records; it does not own feature-private source files.

## Remaining blockers / unfinished work

1. Review and explicit merge/deployment decision for PR #32; PR #33 must remain stacked/retargeted only after #32 disposition.
2. Read-only live/test-tenant validation of shared customer/product/inventory/PO/sales/fulfillment/store-credit contracts before mounting the shared gateway.
3. Convert one consumer first, preferably PO Companion, then migrate other consumers incrementally.
4. Reconcile #22/#26/#28/#29/#30/#31 from current consolidated before future integration.
5. Complete feature-specific real acceptance:
   - Scanner/Toolkit Chrome employee/supplier workflow.
   - Timeclock/Split Recall Sell/fulfillment workflow.
   - PO Companion real authenticated PO read.
   - Product Manager live auth/persistence/native browser.
   - Avery physical print/native zoom.
   - Consignment isolated DB/auth/matching/store-credit flow.
6. Reconcile one coordinated Chrome release candidate only after feature acceptance and queue disposition; no individual feature packaging.
7. Decide operational production-write permissions for products, inventory, PO writes, sales/work orders and store credit before Phase 3 writes.
8. Establish independent production PostgreSQL backup/restore strategy; current source-derived schema records are not live row backups.
9. Continue Railway credential/security audit and retire/rotate legacy credential paths only through explicit, tested changes.
10. Implement planned Invoice Reconciliation only after shared read/auth dependencies are accepted; preserve no-receiving/no-stock-change invariant.
11. Start future Back Room Inventory, Service Requests and Reservations from shared service/auth contracts rather than new duplicate infrastructure.
12. Feature owners must keep their stable handoffs current as individual development chats are reorganized or archived. This manager chat remains active.

## Known contradictions / stale historical records found in final audit

- Historical project sections previously claimed Railway deployed from retired feature branches; live Railway now verifies the three core services deploy from `integration/hobby-corner-consolidation`.
- Older transition/shared-service notes recorded earlier PR #33 heads/CI; current verified head is `bbfe24fd…`, CI `40920253500`.
- Older shared-services handoff text said most feature handoffs were missing; the central handoff inventory now contains the active feature handoffs.
- Open historical/superseded PRs remain visible in GitHub. They are preserved for history and must not be treated as current integration candidates.

## Decisions requiring explicit owner approval

- Merging any production-connected PR that triggers Railway production deployment, including PR #32.
- Applying shared-service PostgreSQL migrations.
- Enabling any new production Lightspeed write operation.
- Moving/removing production credentials or changing `TIMECLOCK_PIN_PEPPER`.
- Promoting Consignment to production or enabling store-credit posting.
- Creating a coordinated Chrome extension release/version/package/publication.
- Enabling Invoice Reconciliation PO create/update in production.
- Any destructive branch/data/volume cleanup.

## Continuity rule

- Continue using this conversation as the designated Hobby Corner Manager channel.
- Use `handoffs/hobby-corner-manager.md` as the durable Git snapshot for cross-chat continuity and recovery, not as a signal that the manager chat should be replaced.
- Future audit/reorganization prompts in this chat should refresh the manager record unless the user explicitly says this manager chat itself is being retired.

## Recommended next development priorities

1. Review PR #32 as the next shared backend foundation decision; keep PR #33 draft/stacked until #32 is resolved.
2. Validate shared read services against controlled read-only tenant data.
3. Convert PO Companion as the first shared read consumer with parity tests.
4. In parallel, reconcile the six open feature PRs to current consolidated and complete their feature-specific acceptance.
5. Only then assemble the coordinated Chrome extension release candidate.
6. After shared reads/auth are stable, design Phase 3 write permissions and Invoice Reconciliation test-tenant PO apply path.

## Restrictions / safety

- Do not merge or deploy production-connected changes without explicit authorization.
- Do not modify production Lightspeed records, customer/employee data, inventory or store credit as part of coordination.
- Do not change Railway credentials, volumes or production database schema without explicit authorization and rollback/backup plan.
- Do not package/version/publish the Chrome extension outside the full coordinated release process.
- Invoice Reconciliation must never receive products or change stock-on-hand.
- Do not create duplicate employee auth, Lightspeed clients, product matching engines or shared navigation systems.

## Documentation

- `HOBBY_CORNER_PROJECT.md`
- `HOBBY_CORNER_CHAT_TRANSITION.md`
- `handoffs/README.md`
- `handoffs/TEMPLATE.md`
- `LIGHTSPEED_SHARED_SERVICES.md`
- `SHARED_STAFF_AUTH_PERMISSIONS.md`
- `ROADMAP.md`
- `FEATURE_INVOICE_RECONCILIATION.md`
- `CHROME_EXTENSION_INTEGRATION.md`
- `CHROME_EXTENSION_RELEASE_QUEUE.md`
- `RAILWAY_VARIABLE_SECURITY_AUDIT.md`
- `BRANCH_AND_DEPLOYMENT_POLICY.md`

## Post-archive chat topology — owner-confirmed 2026-10-29

- **This manager conversation remains active.** Four other continuing conversations: **Shared Lightspeed Services**, **Shared UI / UX Coordination**, **Deployment Coordination**, **RMS Item Migration**. The owner reports that the prior tool-specific chats have otherwise been archived.
- Archived tool handoffs and source/PR history remain active project records; archiving is not cancellation, implementation, testing, release or deployment. Launch a focused new tool chat only when the next development task justifies it, using `prompts/NEW_TOOL_CHAT_STARTUP.md`.
- RMS Item Migration is a **separate active development workstream**, not a tool to consolidate into Product Manager or Scanner. Other tools may selectively adopt **reviewed source helpers** for exact SKU/UPC/collision handling and supplier/category/brand normalization after verification and testing. Do not adopt RMS-on-hand values, migration credentials, test-only persistence or bulk writes. Preserve migration ownership and record source and consumer references in the two relevant handoffs.
- The project manager remains the authority for cross-tool priority, owner assignments and release decisions; this chat does not acquire ownership of every archived tool.


## Shared Lightspeed foundation hardening milestone — 2026-10-29

- PR #32 candidate head `527d764c1331500a7f43b3874d62e146223eec1f`, final CI `40954269174` **PASS**. PR #33 stacked candidate head `48d3258e37ea749a6541163ba70658577b90a8ad`, code-head CI `40954212260` **PASS**.
- Hardened read/write transport semantics (HTTP write uncertainty, bounded JSON/UTF-8 response handling and stricter API targets); JSON fingerprint/replay safety and mutable payload race prevention; DB-only read-only pending/unknown-key inspection; PostgreSQL audit immutability and post-write audit-failure regression tests.
- Both PRs remain **unmerged, unmounted, no production DB migration and no real tenant verification**. Neither is authorization to enable API writes. PR #33 remains stacked on the former Phase 1 base and requires explicit ancestry reconciliation after PR #32 approval.
- Release coordination: verify independent PostgreSQL backup/restore decision, schema review, vendor/test-tenant read contracts, auth scopes, unknown-key manual reconciliation runbook and browser consumer acceptance; seek explicit approval before any production-connected merge or deployment.

