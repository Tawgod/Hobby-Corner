# Shared business foundation — approved development baseline V3

**Last verified:** 2026-11-24
**Owner:** Foundation Manager
**Status:** Accepted for isolated development and offline tests only. NOT approved for merge, deployment, live vendor traffic or database migration.

## Canonical source pin
- Repository: Tawgod/Lightspeed
- V3 branch: test/hc-foundation-combined-v3-20261124
- Exact approved V3 commit: 098c9e51ea4c3449605ad6951baa8284e126e8d4
- [Combined CI 45436836762](https://github.com/Tawgod/Lightspeed/actions/runs/45436836762), exact V3 commit, SUCCESS. Job 138596828874 logs verified 223/223 pass, zero failure, skip or cancellation. 24 test files, syntax and gateway isolation checks, real disposable PostgreSQL concurrency, verified replay, unknown write and immutable audit passed.
- V2 remains test/hc-foundation-combined-20261124 @ 2365de8af4e8d69b162f6909d1f78be246e74fdf, CI 45423638373 (187/187), unchanged.
- V1 remains PR #78 @ 71a1cd6e312ed52efc1e9af9da85db6b02e3756c, CI 45414393938 (51/51), unchanged.
- Production integration/hobby-corner-consolidation last verified @ 014a7a949fe570b756b48d8f59995c1b0a434859; no production changes made by manager.
- V3 includes 16 exact nonoverlapping workstream deltas and two manager files (workflow and docs/FOUNDATION_COMBINED_V3_SNAPSHOT.md). No existing PR merged.

## Included V3 workstream heads (historical pins)
| PR | Owner | Exact included commit |
|---|---|---|
| #84 | Purchasing & Suppliers | f2666ca31b053f4fd5c8864ccbacd7db95d7d60c |
| #85 | Core API | a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7 |
| #86 | Product & Catalog | 777bdd3c0e5c380328275a1931efcd4b5fce51a2 |
| #87 | Inventory | e108da9691ada86ada73b90cfb36552df8368fab |
| #88 | Customer & Sales | 2f2750ee703556c1ea2eab60f3d6edd14bbe82ea |

## Rules for next milestones
1. Read this file, SHARED_TOOL_DEPENDENCIES.md, manager and own handoffs, and V3 manifest. Create independent branches from exact V3 SHA. Compare newer work against included head, carry forward only missing deltas, preserve all original branches/PRs; no reset, force-push, rebase or duplicate cherry-picks.
2. New draft PRs target test/hc-foundation-combined-v3-20261124, never production or old baselines. Manager alone coordinates integration. No merges without explicit approval.
3. Core owns transport, readCollection, coreReadContract, shared audit/idempotency/transaction/outbox contracts. Domain owners retain their modules. Coordinate interface changes before implementation. Security exclusively owns identities, authentication, roles and operation grants. No independent authorization implementation.
4. core.v1 remains internal candidate. Use explicit injected authorization fixtures, safe field projections and correlation. No raw customer data or unauthorized disclosure. Wholesale costs available to all active employees; modifications separately controlled. No actual grant or public interface approval inferred.
5. Offline synthetic fixtures and disposable database tests only; no actual feature switches, route mounts, live vendor/mail/employee/customer data, production mutations, shared-environment migrations or deployment. Synthetic mutation harnesses must remain non-executable in production. Minimize Actions usage with local targeted tests and batched remote validation; record exact source/test evidence and limitations in canonical handoffs.
6. Preserve PRs #32/#33/#51/#78–#88. Management PR #4 still needs reconciliation before authorized merge.

## Next assignments (isolated development)
| Owner | Next scope | Stop gate |
|---|---|---|
| Core API | M4: shared local transaction/audit/idempotency/outbox contract and disposable PG concurrency/replay/rollback fixtures; map canonical operation checks across tool entrypoints using synthetic Security adapters; coordinate Inventory requirements and dependency reproducibility | Coordinate interface before consumer adoption; no real grants, public gateway or POST-for-read activation |
| Product & Catalog | M6 preparation: offline Product Manager parity and canonical product-create/update denial fixtures across consumer entrypoints; align ordinary employee cost viewing; preserve exact product/variant/supplier identity | No actual create/update execution, live writes or feature switch; separate authorization required |
| Inventory | M6: count/restock/reason revision transaction and discrepancy queue fixtures; prepare domain persistence adapter against coordinated Core contract, including duplicate/replay and atomic rollback | If Core contract unavailable, use test-only injected interface and stop before competing durable implementation; no live migrations or stock adjustments |
| Customer & Sales | M6: sales/deposit/work-order/fulfillment evidence and coverage fixtures; preserve reusable customer search and consent boundaries, separate financial and physical events | No credit posting, payment collection, automatic linkage, actual route switch or live mutations |
| Purchasing & Suppliers | P-06: offline cross-tool supplier document-to-invoice-to-OPEN PO review workflow; coordinate Catalog identity/coverage and Inventory receipt boundary, duplicate/approval checks and canonical operation denial fixtures | No real provider activation, PO writes, receiving or durable production execution |
| Foundational Security | Continue existing employee/owner environment consolidation independently; coordinate approved operation/role/resource/field contract through handoff when ready | Existing commissioning and deployment approvals retained; no manager interference |

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
- Actual Security acceptance, including uniform backend cross-tool authorization and negative bypass tests; synthetic tests are not evidence of real permission enforcement.
- Exact vendor API contracts, controlled read-only tenant environment, full feature/browser acceptance, physical stock-event evidence and domain durable transaction integration remain pending.
- No live environment change authorized. Avoid unrelated staged Railway changes. Existing npm dependency manifest has no lockfile; reproducibility requires review.
- Manager handoff: handoffs/foundation-manager.md.
