# Shared business foundation — approved development baseline V7

**Last verified:** 2026-11-25
**Owner:** Foundation Manager
**Status:** Explicit owner approval recorded. Isolated development and offline/disposable tests only. No production merge, deployment, live service effects or shared environment migration.

## Canonical pin
- Tawgod/Lightspeed:test/hc-foundation-combined-v7-20261125 @ 73bdb41c1bc1ffb8af23effccc1392f4e9f8f5d6
- Parent V6 0ffe5e3e152174462240021c59f64862af782b03; tree bd3ee5470aa365922fe20ed870eabb21ef4ace8f.
- CI 45634424284 job 139275932477 independently exact-checkout verified 409/409, 46 files, zero fail/skip/cancel/todo; disposable PG16, syntax and gateway isolation passed. 22 exact workstream deltas plus workflow and docs/FOUNDATION_COMBINED_V7_SNAPSHOT.md.
- Included #109 Core 1925c3d5adbaf3a028aa736179e8020e514658cd; #110 Catalog e4ec32fdee589ed6b5c11b28e60fa90284eb3f63; #111 Customer 1289e2ee08e4b9f6996699dc2f122492bd80a18d; #112 Purchasing 6eb7e11334900fa4ea09c8ca202847a6c57bca59; #114 Inventory 7d0c8e45ae8af535a22a347c5a5963e3a6a8df75. Original PRs preserved.
- Independent Security accepted #115 a4b657750adb9b0a24bd7e1c95505df56330cc25 167/167; SO-01 #116 d8b9eccf97410074981fb536dc0bba67e6f2e1a9 20/20 implementation/offline accepted only; neither included in V7.

## V8 assignments and integration gates
Five business owners branch independently from exact V7 and target V7 with draft PRs; preserve prior pins, no duplicated deltas, shared interface changes require coordination. Preserve M4/M5/M6/M7 compatibility. Security-to-Core integration is priority: first agree versioned exact contract and ownership, then offline/disposable synthetic integration using Security-owned implementation at reviewed exact pin; Manager alone assembles integration branch after verified evidence. No live transport, real identity/grants, shared environment deployment, production routes or automatic promotion. No assumption that actual Security enforcement has been achieved. All 19 alias directions conditionally agreed, not mapped/frozen; preserve owner policies and cumulative inventories. One capped targeted CI where practical.
- Core M8: coordinate versioned Security-facing decision adapter, trusted provenance, execution/approval/access binding, fresh policy/assurance, exact effects/scopes, deny on malformed/unavailable/stale; test local/remote M7 composition and cross-tool negative cases. No duplicate Security evaluator or changes to Security-owned files; wait for approved contract before executable cross-workstream integration.
- Catalog M10: adopt M7 remote orchestration in isolated domain fixtures, trusted exact SKU/UPC/supplier/variant keys, old/new identity guards, revision, causal evidence and independent receipt access; retain uncertain holds, no blind retry. No duplicate shared orchestration or live writes.
- Inventory M10: opt-in M7 local composition for multi-line/session/task/location fixtures, execution/access separation and scoped receipts; extend physical receipt/transfer/adjustment evidence and atomic concurrency, coordinate Purchasing/Customer. No real stock effects.
- Customer M10: opt-in M7 compatible authorization/receipt evidence and narrower source/projection contracts, Special Orders parity, cumulative financial/pickup/reversal evidence, distinct physical effects. No live linking/payments/credit/refund/notification.
- Purchasing P-10: opt-in M7 local composition; durable competing PO-line billed quantity reservation, multi-line cumulative evidence, expiry/revision and safe independent inspection; local receipt vs remote PO reconciliation and physical receiving distinct. No vendor/mail/PO/stock effects.
- Security: continue S2.5H independently from accepted #115 or newer verified own checkpoint; compose assurance/employee and service decisions, strengthen exact scope schema, coordinate Core M8 versioned consumer contract and offline integration plan; review SO-01 mock compliance. S2.1 commissioning/Timeclock gates unchanged. No actual grant, registry activation, live transport or deployment.
- Security Operations: continue SO-01 acceptance checks from #116 exact accepted offline pin, browser/accessibility evidence where available, request-specific failure tests, exact-head validation and Security mock review. SO-02 remains gated by Manager acceptance review; exclusive paths/HC-ADMIN mock v0.1.0 per SECURITY_OPERATIONS_INTEGRATION_CONTRACT.md. No backend imports, real data or shared files.
All report exact commits, tests, gaps, conflicts and deployment state in own canonical handoffs. Historical rules below apply except superseded pins/assignments and admin UI ownership (contract v0.1 controls). No production authorization.

---

## Historical V6 and earlier baseline records (retained)

# Shared business foundation — approved development baseline V6

**Last verified:** 2026-11-24
**Owner:** Foundation Manager
**Status:** Owner authorized promotion conditional on passing tests; condition satisfied. Approved for isolated development and offline/disposable database testing ONLY. No production release, merge, deployment, live vendor traffic or shared-environment migration.

## Canonical source pin
- Repository: Tawgod/Lightspeed
- Branch: test/hc-foundation-combined-v6-20261124
- Exact approved commit: 0ffe5e3e152174462240021c59f64862af782b03
- Parent V5: 87f6a94918653a3417ce01205098193eb1ccb35d
- Combined CI 45473105844, job 138726062778: exact checkout independently verified; 346/346 tests, 40 test files, zero failure/skip/cancel/todo. Disposable PostgreSQL 16, syntax and gateway isolation passed. 19 workstream deltas plus manifest and workflow; Core included once. No original PR merged.
- Manifest: docs/FOUNDATION_COMBINED_V6_SNAPSHOT.md. V5 and earlier pins preserved in historical section below.
- Included exact workstream heads: #100 Core 964b84d084c0224b251b3ecef0bb1af30f9cdf22; #101 Catalog 0c4a28d72b5ee3ebb1d664395dc359fad09f9511; #106 Inventory d714bab43f66592efec70aff07bf09e38435e006; #103 Customer 8654430fb458be10cf7a8c47969d7bd238c091db; #107 Purchasing 698e2b7c772dd333399d1c2dba0871ea0a79f9a8 (four domain-only paths beyond Core).
- Security remains independent: #108 2b909ce63ca2b440d6cb3a5859ee09c39e004adf, 97/97 offline tests, not integrated into V6.

## Active V6 rules and next assignments (supersede historical V5 assignments)
All five business owners create independent branches from exact V6, compare prior heads and carry only missing changes; new draft PRs target V6 branch. No duplicate Core adapter, no merges, no runtime activation. Preserve inherited M4/M5/M6 compatibility and all prior tests. Security exclusively owns actual identity/authorization/registry; no actual grants. Each workstream reviews relevant proposed alias dispositions and scope extensions in Security #105 docs/security/S25D_EXECUTION_ACCESS_SCOPE.md at 1aee4f9f734b221b1c3c5253e8c3466304cd03f5, documents explicit semantic agreement or conflict in handoff and coordinates before any registry change. Maintain cumulative inventory; no automatic alias mapping. Minimize CI, one capped targeted run where practical. All assignments test-only; no live data, external effects, or production routes. No duplicate historical deltas.

| Owner | Next milestone | Scope and stop gate |
|---|---|---|
| Core | M7 | Coordinate separate immutable execution versus access/inspection effects with Security S2.5D/F; review M6 fingerprint, replay and receipt boundary; propose additive compatibility seam and test negative cross-tool cases after coordination. Review remote mutation multi-effect, safe replay, cross-key duplicate and uncertainty contracts with Catalog. No runtime authorization or vendor writer; no uncoordinated shared interface edits. |
| Catalog | M9 | Offline remote mutation hardening: cross-key duplicate reservation, fresh revision/readback causality, exact product/variant/supplier and cost effects, independent projection/inspection. Review products.delete and catalog.references.configure aliases. Coordinate Core seam first; no live vendor writer. |
| Inventory | M9 | Expand M8 disposable composition to multi-line/task/location/session evidence, competing batches, stale revisions and atomic rollback, immutable history, explicit physical receiving versus financial evidence. Confirm inventory alias dispositions and scopes; no actual stock changes or new shared adapter. |
| Customer & Sales | M9 | Offline legacy consumer parity and narrower source/read projection admission, partial pickup and cumulative reversal eligibility evidence, explicit financial vs physical effects. Confirm customer/sales/workflow aliases with Core/Inventory; no real writes, notifications or route switch. |
| Purchasing | P-09 | Expand M6 invoice fixture to competing invoice identity races, multi-line and cumulative billed evidence, approval expiry at precommit and safe historical projection; separate local receipt inspection from remote PO reconciliation, coordinate receipt/stock boundary with Inventory. No live vendor/mail/PO/stock effects. |
| Security | S2.5F | Compose accepted S2.5D/E role/decision fixtures, policy freshness, separate authorized explanations, delegation and assurance lifecycle; reconcile 19 alias occurrences with domain owners and Core. Independent branch from exact tested #108; S2.1 separate Timeclock owner review and private commissioning gates. No actual grants, deployment or registry freeze. |

Actual Security integration, durable production adapters, vendor compatibility, dependency reproducibility, employee acceptance, revocation fencing and endpoint bypass coverage remain gated. All historical requirements below remain applicable except superseded baseline pins, assignments and M5 adoption direction.

---

## Historical V5 baseline and requirements (retained; V6 rules above prevail)

# Shared business foundation — approved development baseline V5

**Last verified:** 2026-11-24
**Owner:** Foundation Manager
**Status:** Accepted for isolated development and offline/disposable database tests only. NOT approved for merge, deployment, live vendor traffic or shared-environment database migration.

## Canonical source pin
- Repository: Tawgod/Lightspeed
- V5 branch: test/hc-foundation-combined-v5-20261124
- Exact approved V5 commit: 87f6a94918653a3417ce01205098193eb1ccb35d
- [Combined CI 45450851407](https://github.com/Tawgod/Lightspeed/actions/runs/45450851407), exact V5 head SUCCESS. Job 138647208385 logs verified 299/299 passed, zero failed, skipped or cancelled. 35 test files; syntax and gateway isolation; disposable PostgreSQL, concurrent operations, replay, rollback, revoked authorization fixtures and simulated lost commit acknowledgement recovery. Domain M7/P-07 fixtures still compose M4, not M5.
- V4 remains test/hc-foundation-combined-v4-20261124 @ b56d4f69332f768a66987668293088eb51a60ecc, CI 45442532299 (266/266).
- V3 remains test/hc-foundation-combined-v3-20261124 @ 098c9e51ea4c3449605ad6951baa8284e126e8d4, CI 45436836762 (223/223).
- V2 remains test/hc-foundation-combined-20261124 @ 2365de8af4e8d69b162f6909d1f78be246e74fdf, CI 45423638373 (187/187).
- V1 remains PR #78 @ 71a1cd6e312ed52efc1e9af9da85db6b02e3756c, CI 45414393938 (51/51).
- Production integration/hobby-corner-consolidation last manager-verified @ 014a7a949fe570b756b48d8f59995c1b0a434859; no production change by manager.
- V5 includes 18 exact nonoverlapping workstream deltas plus workflow and docs/FOUNDATION_COMBINED_V5_SNAPSHOT.md. No existing PR merged.

## Included V5 workstream heads (historical pins)
| PR | Owner | Exact included commit |
|---|---|---|
| #94 | Shared Inventory | 0819cb0f33a0b7c9f52446c454899ec3ade0fc92 |
| #95 | Core Shared API | c31c8d660baf81227293e3647df13b8d6ee21d76 |
| #96 | Purchasing & Supplier | 9be3cf2def313e0ceedf5e07f1163c9eca28bcb5 |
| #97 | Product & Catalog | 090fec0d833e626364c2b72d66903a99ddeddc29 |
| #99 | Customer & Sales | bb11757bfef5a54c28d27f72647ec2f4c3586d2d |

## Active conversation ownership
Owner reports all five business conversations transitioned. Canonical transition checkpoints verified for Core Shared API Foundation 2.0, Product & Catalog Foundation 2.0, Shared Inventory Foundation 2.0, Customer & Sales Foundation 2.0, Purchasing & Supplier Foundation 2.0. These inherit the same workstreams and handoff files, not new implementations. Security Foundation 2.0 retains its independent source and commissioning milestones. Foundation Manager remains permanent. Successors must acknowledge current ownership and verify source before changes. Preserve predecessor chats/branches/PRs; only owner archives chats.

## Rules for next milestones
1. Read this file, FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md, SHARED_TOOL_DEPENDENCIES.md, handoffs/TEMPLATE.md, manager and own handoffs, V5 manifest and relevant Security-approved contracts. Create independent branches from exact V5 SHA. Compare newer work against included head, carry forward only missing deltas; preserve previous branches/PRs, no reset, force-push, rebase or duplicate cherry-picks.
2. New draft PRs target test/hc-foundation-combined-v5-20261124, never production or older baselines. Manager alone coordinates baseline integration; no merges without explicit approval.
3. Core owns transport, readCollection, coreReadContract, localTransactionCandidate, localTransactionM5, shared audit/idempotency/transaction/outbox contracts and reusable disposable PG adapter. Domains own their records/effects. Coordinate changes to shared interfaces first. Security exclusively owns identities, authentication, roles, operation registry, authorization and administration UI. No parallel system.
4. Adopt V5 Core M5 as shared offline integration candidate, not approved production adapter. Preserve M4 compatibility. Use trusted injected synthetic decisions, actor-bound replay, safe result reprojection, exact operation/effect sets, fresh checks after domain locks and at execution/commit boundary, and fail-closed outcome handling. Coordinate any seam extensions with Core; do not fork a common persistence framework. Wholesale cost visibility is ordinary employee access, modification separate.
5. Offline synthetic fixtures and disposable PostgreSQL only. No live feature switches, route mounts, vendor/mail/employee/customer data, actual mutations, shared-environment migrations or deployment. No external/vendor side effects inside local DB transactions. Minimize Actions usage with targeted tests and batched validation; record exact source/test evidence and limitations.
6. Maintain cumulative Security inventory in canonical handoff, explicitly flag changes relative to consolidated register, unresolved aliases and actual endpoint gaps. No code-wide grant renames or assignments until Security approves exact semantics and Manager coordinates migration.
7. Preserve PRs #32/#33/#51/#78–#99, including independent Security PRs; management PR #4 needs reconciliation before authorized merge.

## Next assignments (isolated development)
| Owner | Next scope | Stop gate |
|---|---|---|
| Core Shared API Foundation 2.0 | M6: coordinate reusable M5 adapter adoption by Inventory/Purchasing; extend test-only adapter seam for typed domain locks, authorization after locks and immediately before commit, actor/resource binding, minimal receipts and safe reprojection, unknown commit inspection and immutable audit/outbox deduplication; coordinate Security contract and remote mutation fixture compatibility | No production adapter, real grants, gateway mounting or POST-for-read activation; coordinate common interface changes before use |
| Product & Catalog Foundation 2.0 | M8: compose controlled product mutation candidates with existing Core remote mutation/audit/idempotency seam using synthetic vendor fixtures; exact create/update/cost effects, fresh snapshot/revision, actor-bound approval, duplicate prevention, readback and unknown-outcome reconciliation | No actual vendor writer, live traffic or automatic retry of ambiguous writes; coordinate Core/Security/Catalog contracts |
| Shared Inventory Foundation 2.0 | M8: migrate test-only M7 fixtures to Core M5 shared disposable adapter, typed session/task/reason locks, actor-bound replay and safe projection, post-lock and precommit checks, immutable audit/review/outbox and stock-effect separation | Coordinate Core before seam changes; no independent runtime adapter, stock adjustments, live schema or actual delivery |
| Customer & Sales Foundation 2.0 | M8: offline integrated customer identity/search/consent, sale/deposit/work-order/fulfillment/return/void/credit workflow compatibility fixtures; independent grants for composite I/O and projections, partial pickup and financial/physical effects, legacy consumer parity | No actual account linking, posting credit/refund/payment, stock effects or live route change |
| Purchasing & Supplier Foundation 2.0 | P-08: adopt Core M5 disposable adapter for invoice review, duplicate reservation, actor/revision-bound approval, immutable history and safe receipt projection; post-lock/precommit authorization, uncertain commit/replay and outbox deduplication fixtures | Coordinate Core seam; no actual provider, PO writer, receipt/stock effect, live database or delivery |
| Security Foundation 2.0 | Continue independent S2.1 milestones and consolidate permission registry using FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md; reconcile aliases by effect, role/individual policy, scopes and UI requirements; coordinate identity-only Timeclock design and Core authorization interface | Existing credential commissioning and Timeclock deployment gates retained; no actual assignments, activation or production changes under this baseline |

## Mandatory cross-tool capability enforcement (owner-approved, 2026-11-24)
- Every tool must support centrally assignable Security roles and canonical operation grants. A restriction on a business operation applies to every tool, API, bulk/import flow, automation and indirect workflow that can perform that operation, not merely its originating UI.
- Product creation is the reference case: an actor denied product creation must be denied through Product Manager, Scanner, Special Orders, Purchasing and future consumers wherever creation is supported. A tool-specific grant must never override a denied underlying operation. Separate read, create, update, approve and execute permissions; composed operations require all applicable grants.
- Security owns role assignment, verified actor identity, exact operation/resource/field/environment scope, expiration and revocation. Core and domain services consume the approved contract; no independent permission system, client-supplied grant, service-account bypass or stale authorization reuse. Server-side enforcement is mandatory; UI hiding/disabling is complementary. Missing, unavailable or ambiguous decisions deny protected operations. Recheck authorization at execution, including queued/delegated actions; audit authorization outcomes without exposing sensitive data.
- All active employees may view wholesale costs under ordinary employee product access; no elevated cost-view role required. Cost modification is separately controlled. No anonymous/public cost disclosure.
- Release gate: each consumer must map its capabilities to the Security-owned operation registry and demonstrate allow/deny, revoked/expired grants, direct API and indirect/bulk/automation bypass rejection, and consistent results across tools. Synthetic fixtures do not constitute actual Security acceptance. Existing production functionality stays unchanged until migration is authorized.
- Security consolidation continues separately; no real grants, security deployment or commissioning authorized by this requirement.

## Security and administration UI dependencies (mandatory for foundation workstreams)

Maintain a cumulative inventory of capabilities that the Security service and eventual Security administration UI must support. Review both existing and planned functionality, not only this milestone. For each capability record:

| Proposed canonical operation | UI label and description | Tools / direct and indirect entrypoints | Suggested role grouping / default access | Individual grant or restriction | Resource / field / environment scope | Prerequisite grants and approval requirements | Enforcement evidence / gaps |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

- Identify read, create, update, delete, approve, execute, configuration, export and automated operations separately where applicable. Include bulk imports, queued/delegated actions, API entrypoints and indirect effects. Record unsupported or unmapped entrypoints explicitly.
- Recommend role bundles and ordinary employee defaults, plus independently assignable permissions and restrictions. All active employees may view wholesale costs; modifying them is separately controlled. Do not invent approved roles, grant precedence or actual assignments.
- Identify UI needs: grouping, searchable operation labels and descriptions, role membership, individual exceptions, effective access and source of grants, scope selectors, expiry/revocation, prerequisite/conflict warnings, service/automation delegation, audit/history and permission-change confirmation. Distinguish required domain needs from proposed UI design.
- Identify approved versus provisional operation identifiers, cross-domain ownership/dependencies, shared enforcement point and negative bypass tests. Link source paths/tests and list unresolved Security decisions. Security owns final registry, role/individual grant semantics, identity, authorization and administration UI implementation. Do not create a duplicate security system.
- Maintain this section in the canonical workstream handoff at each milestone; manager consolidates/deduplicates inventories for Security review. No actual grant changes or UI activation authorized.

## Remaining gates
- [Consolidated permission requirements](FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md) preserve V4 workstream inventories (213 source rows, not unique permissions) and alias review queue. Security review underway per owner; provisional until accepted. Actual endpoint mapping, bypass testing and approved authorization adapter pending.
- Exact vendor API contracts, controlled read-only tenant testing, feature/browser acceptance, physical stock-event evidence, production durable adapters and safe outbox delivery remain pending. V5 proves compatibility of current fixtures, not full domain M5 integration or production durability.
- No live environment change authorized. Avoid unrelated staged Railway changes. Dependency manifest lacks lockfile; reproducibility remains under review.
- Manager handoff: handoffs/foundation-manager.md.
