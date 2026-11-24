# Shared business foundation — approved development baseline V4

**Last verified:** 2026-11-24
**Owner:** Foundation Manager
**Status:** Accepted for isolated development and offline/disposable database tests only. NOT approved for merge, deployment, live vendor traffic or shared-environment database migration.

## Canonical source pin
- Repository: Tawgod/Lightspeed
- V4 branch: test/hc-foundation-combined-v4-20261124
- Exact approved V4 commit: b56d4f69332f768a66987668293088eb51a60ecc
- [Combined CI 45442532299](https://github.com/Tawgod/Lightspeed/actions/runs/45442532299), exact V4 commit, SUCCESS. Job 138617312237 logs verified 266/266 pass, zero failure, skip or cancellation. 30 test files; syntax and gateway isolation; original real disposable PostgreSQL tests and Core M4 concurrent local transaction, duplicate/replay, rollback and revoked grant fixtures passed.
- V3 remains test/hc-foundation-combined-v3-20261124 @ 098c9e51ea4c3449605ad6951baa8284e126e8d4, CI 45436836762 (223/223).
- V2 remains test/hc-foundation-combined-20261124 @ 2365de8af4e8d69b162f6909d1f78be246e74fdf, CI 45423638373 (187/187).
- V1 remains PR #78 @ 71a1cd6e312ed52efc1e9af9da85db6b02e3756c, CI 45414393938 (51/51).
- Production integration/hobby-corner-consolidation last verified @ 014a7a949fe570b756b48d8f59995c1b0a434859; no production changes by manager.
- V4 includes 20 exact nonoverlapping workstream deltas plus workflow and docs/FOUNDATION_COMBINED_V4_SNAPSHOT.md. No existing PR merged.

## Included V4 workstream heads (historical pins)
| PR | Owner | Exact included commit |
|---|---|---|
| #89 | Core API | 0fabf06643c17ec5632168ffecf8339aa09279e5 |
| #90 | Product & Catalog | 5895dafbd9c63a8359c787afefedcf0ea6b80bbc |
| #91 | Inventory | 7eecb5d2fd92f896402398d36167bd3779d95c0e |
| #92 | Customer & Sales | 518ac1d0e6985852f80d375c9ce922d47fc40296 |
| #93 | Purchasing & Suppliers | 340c6203a48deec3b7da38d37141ceb9f71e2060 |

## Rules for next milestones
1. Read this file, SHARED_TOOL_DEPENDENCIES.md, handoffs/TEMPLATE.md, manager and own handoffs, and V4 source manifest. Create independent branches from exact V4 SHA. Compare newer work against included head; carry forward only missing deltas. Preserve all previous branches/PRs; no reset, force-push, rebase or duplicate cherry-picks.
2. New draft PRs target test/hc-foundation-combined-v4-20261124, never production or old baselines. Manager alone coordinates integration; no merges without explicit approval.
3. Core owns transport, readCollection, coreReadContract, localTransactionCandidate, shared audit/idempotency/transaction/outbox contracts and shared fixture adapter interfaces. Domain owners retain their modules and domain record shapes. Coordinate interface changes before implementation. Security exclusively owns identity, authentication, roles and operation grants; no parallel authorization system.
4. core.v1 and Core M4 local transaction contract remain internal candidates. Use explicit injected authorization fixtures, safe field projections and correlation; no implicit grants. All active employees may view wholesale costs, modification separately controlled. No actual grant or public interface approval inferred. The V4 local transaction candidate may be composed in offline domain fixtures; no actual durable production adapter is approved.
5. Offline synthetic fixtures and disposable PostgreSQL tests only. No actual feature switches, route mounts, live vendor/mail/employee/customer data, production mutations, shared-environment migrations or deployment. Synthetic mutation harnesses must remain non-executable in production. Never perform external/vendor side effects inside local DB transactions. Minimize Actions usage with local targeted tests and batched remote validation; report exact source/test evidence and limitations.
6. Every workstream must complete the cumulative Security and administration UI dependency inventory below in its canonical handoff before next reconciliation. Preserve prior permissions and explicitly flag gaps, conflicts and proposed identifiers. No approved grant assignments invented.
7. Preserve PRs #32/#33/#51/#78–#93. Management PR #4 still needs reconciliation before authorized merge.

## Next assignments (isolated development)
| Owner | Next scope | Stop gate |
|---|---|---|
| Core API | M5: refine shared local transaction/adapter contracts, actor-bound canonical replay, safe result reprojection, immutable audit, commit uncertainty and outbox deduplication fixtures; coordinate a reusable disposable PG adapter interface with Inventory/Purchasing; consolidate cross-tool operation dependency semantics and review reproducibility | Coordinate interface before adoption; Security approves actual actors/grants; no live durable implementation, public gateway, POST-for-read activation or independent auth registry |
| Product & Catalog | M7 preparation: controlled non-executable product creation/update/cost mutation contracts; canonical identity/variant/supplier mapping, server-derived effect grants, duplicate prevention, readback/unknown outcome fixtures and consumer permission mapping | No actual vendor writer execution, live writes, feature switch or unauthorized product creation; coordinate Core remote mutation seam and Security |
| Inventory | M7: compose existing inventoryPersistence planners with Core localTransactionCandidate in disposable PG fixtures, task/session/reason locking, concurrent duplicate/replay, atomic confirmation/review/outbox/audit and revocation; preserve independent shelf IDs and unknown stock evidence | Use coordinated Core seam, no competing durable transaction system; test-only schema/adapter, no shared-environment migrations, stock adjustments or actual outbox delivery |
| Customer & Sales | M7: returns, voids, store credit and reversal evidence contracts, linkage to sale/payment/deposit/work-order and fulfillment, distinguish financial versus physical effects and document permission dependencies | No real return/void/credit posting, automatic linkage, payment or stock effects, live routes; coordinate Inventory and Core |
| Purchasing & Suppliers | P-07: durable invoice review/duplicate/approval record contracts and disposable PG fixtures against Core candidate; actor/revision-bound review, replay, atomic audit/outbox intent; preserve invoice-not-receipt boundary and no automatic product creation | No competing durable transaction adapter; no actual provider activation, PO writer/receiving, shared-environment migration or production execution |
| Foundational Security | Continue existing employee/owner environment consolidation independently; receive cumulative workstream permission inventories for future registry and administration UI coordination | Security owns final role bundles, individual grant/restriction precedence, identity, scopes, registry and UI; existing commissioning approvals retained |

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
- Actual Security acceptance, including uniform backend cross-tool authorization and negative bypass tests; synthetic tests are not evidence of live permission enforcement. Consolidated permission register and Security administration UI requirements must be reviewed before UI implementation/role assignment.
- Exact vendor API contracts, controlled read-only tenant environment, full feature/browser acceptance, physical stock-event evidence, actual durable domain adapters, safe replay and outbox delivery remain pending. V4 validates fixtures, not production durability.
- No live environment change authorized. Avoid unrelated staged Railway changes. Existing npm dependency manifest has no lockfile; reproducibility requires review.
- Manager handoff: handoffs/foundation-manager.md.
