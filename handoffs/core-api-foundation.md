# Core Shared API Foundation — Current Handoff

**Last verified:** 2026-11-23
**Status:** In Development — source audit and documentation-only first milestone. No live gateway acceptance.

## Source

- Management: `Tawgod/Hobby-Corner:main`
- Authoritative deployed business baseline: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Isolated Core API documentation branch: `Tawgod/Lightspeed:docs/core-api-contract-baseline-20261123`
- Current Core API commit: `9e7aac79de7e01bdfe22f0b3aef3f7c2b4e7bbfd`
- Existing dependency PRs: [Phase 1 #32](https://github.com/Tawgod/Lightspeed/pull/32), [stacked Phase 2 #33](https://github.com/Tawgod/Lightspeed/pull/33), [transport fix #51](https://github.com/Tawgod/Lightspeed/pull/51).
- #32 remains open unmerged; #33 open stacked; #51 open draft and stacked on #32. Do not treat any as live.

## Implemented

- Audited existing `services/lightspeedApi.js` on production integration baseline and `services/lightspeed/client.js`, `idempotency.js` in Phase 1/Phase 2 sources.
- Confirmed PR #33 `readCollection.js` cursor versus offset contract and unmounted gateway design from its documentation.
- Inspected PR #51 correction to numeric Content-Length regex; Phase 2 candidate still has stale double-escaped expression, so reconcile PR ancestry before integration.
- Added documentation-only `docs/CORE_SHARED_API_CONTRACT_BASELINE.md` to isolated branch. Proposed versioned public error contract is NOT active.
- No business logic, application code, deployment or production business data changed.

## Tested

- Automated: no new test execution for this documentation-only commit; inherited older CI result is not proof of this new head.
- Historical reported CI: PR #51 full foundation run `42843574975` SUCCESS as of 2026-11-10; PRs #32/#33 historical CI documented in shared-services handoff. Verify latest source/checks again at merge gate.
- Browser / employee acceptance: none for Core gateway.
- Live vendor API acceptance: none.

## Deployed

- Railway `Hobby Corner/production` inspected live on 2026-11-23.
- `lightspeed-api` service `ed2adc5f-686b-4cc7-98d8-15e50b4efe95` tracks `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; latest deployment `288d5089-62d4-4f22-9c7f-8fdd26d8574d` reports SUCCESS (2026-11-04).
- `special-orders-test` tracks the same baseline, latest deployment SUCCESS; `timeclock` currently tracks `feature/owner-timeclock-scoped-credential-20261110` and deployed SUCCESS (2026-11-13).
- Production has no staged patch at audit; shared Core API candidate is NOT deployed.
- No DB migration, route mount or rollout performed.

## Existing versus missing functionality

| Capability | Status | Action |
| --- | --- | --- |
| Common transport / error type | PR #32 candidate | Reuse |
| Timeout, bounded retry, response limit | Candidate; fix PR #51 | Reconcile |
| API versions | Endpoint-specific vendor versions in source | Document compatibility |
| Pagination | Phase 2 readCollection candidate | Inherit and test |
| Durable idempotency and audit | Phase 1 PostgreSQL candidate | Preserve; no new duplicate persistence |
| Write readback and unknown state | Candidate | Keep fail-closed |
| Shared read gateway | Unmounted candidate | Admission test after Security contract |
| Public response envelope / contract registry | Proposed only | Foundation Manager approval before implementation |
| Live tenant acceptance | Missing | Later controlled READ-ONLY tests |

## Shared dependencies and ownership

- **Foundational Security:** sole owner of verified identity, authentication, authorization, operation grants; Core consumes approved principal/grant contract.
- **Core API:** HTTP transport, response/error/version/pagination contract, audit/idempotency wiring, integration safety tests.
- **Product & Catalog:** product identity and catalog semantics; not Core API.
- **Inventory:** stock read/adjustment semantics; not Core API.
- **Customer & Sales:** customer, sales and fulfillment operations; not Core API.
- **Purchasing & Suppliers:** PO and supplier workflows; not Core API.
- Cross-team interfaces must receive Foundation Manager review before any breaking changes.

## Shared files / integration surfaces affected

- Added only `docs/CORE_SHARED_API_CONTRACT_BASELINE.md` on dedicated Lightspeed docs branch.
- Future proposed shared changes: `services/lightspeed/client.js`, `readCollection.js`, audit/idempotency adapters and tests, subject to overlap review.
- No current changes to these shared files or domain modules.

## Remaining blockers

1. PR #32/#33 stack reconciliation and #51 transport fix incorporation without lost tests.
2. Latest-head CI, live read-only vendor contract testing and explicit Foundation Manager contract decisions.
3. Security-owned verified admission contract and exact operation grants.
4. Production database backup/migration approval before durable adapters are introduced to live deployments.
5. Special X-Series POST-for-read inventory API needs a narrowly reviewed read-only transport admission, not general mutation opt-in.
6. Existing production feature adapters cannot be converted until contract parity tested.

## Decisions needed

- Foundation Manager approval of proposed `core.v1` public error envelope and versioning policy.
- Agree shared API error fields, correlation propagation and consumer migration order.
- Agree PR #51 -> #32 -> #33 reconciliation ownership and source/check review.

## Recommended next action

- Foundation Manager reviews this handoff and baseline contract.
- Then add narrowly scoped offline contract tests on the isolated branch (no live calls), reconcile the known PR #51 fix, and verify latest-head CI.
- Only after review, open draft PR; do not merge or deploy without explicit authorization.

## Restrictions / safety

- Read-only development and documentation. No production business mutations, writes, database migration, branch merge, or deployment authorization.
- Do not duplicate Foundational Security or rewrite domain business services.
- Scanner test-tenant writer and RMS migration remain special isolated paths.

## Documentation

- [Core contract candidate](https://github.com/Tawgod/Lightspeed/blob/docs/core-api-contract-baseline-20261123/docs/CORE_SHARED_API_CONTRACT_BASELINE.md)
- `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_TOOL_DEPENDENCIES.md`, `handoffs/lightspeed-shared-services.md`
