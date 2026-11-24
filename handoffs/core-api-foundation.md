# Core Shared API Foundation — Current Handoff

**Last verified:** 2026-11-24
**Status:** V2 reconciled; M3 offline integration fixtures and coordination proposal committed; CI verification pending; actual admission blocked on Security.

## Source
- Approved V2 Tawgod/Lightspeed:test/hc-foundation-combined-20261124 @ 2365de8af4e8d69b162f6909d1f78be246e74fdf.
- Previous PR #83 head 6722414245be56e138566beebcfcb0f19e2eef8e unchanged; all five file blobs identical in V2; no newer delta to carry. Previous branches and PR preserved.
- Fresh branch feature/core-api-m3-v2-20261124; draft [PR #85](https://github.com/Tawgod/Lightspeed/pull/85) targets V2, head a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7. Compare verified 3 ahead, 0 behind, exactly three additive files; PR reports mergeable.
- Added tests/core-api-m3-integration.test.mjs (8 test cases), docs/CORE_API_M3_SECURITY_COORDINATION.md, .github/workflows/hc-core-api-m3.yml. No runtime/domain/security/database edits.

## Implementation and testing
- V2 CI 45423638373 verified by manager 187/187 including real disposable PostgreSQL; PR #83 included and accepted internally.
- M3 fixtures compose existing executor, transport and domain readers for customer search/sales, product exact lookup, inventory observation and purchase order details; test-only per-call trace closure; synthetic deny and malformed-response tests; concurrent correlation isolation. Catalog allowlist is test-only; no new production projection policy.
- Targeted Node 22 workflow runs existing 11 Core tests plus 8 M3 tests (19 expected) without npm install; capped at 3 minutes. Latest exact-head run lookup returned none at initial checkpoint; do not claim execution passed.
- No live vendor traffic, deployment, route mounting, migration, production records or changes, actual permission grants or feature activation.

## Coordination gates
- Review [M3 Security coordination proposal](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m3-v2-20261124/docs/CORE_API_M3_SECURITY_COORDINATION.md). Security exclusively owns active actor, exact grants, resource/field scope, expiry and revocation; boolean seam insufficient for conveying restrictions, no actual adapter yet. Synthetic fixtures are not Security decisions.
- Domain owners must agree safe field projections and correlation propagation; no public contract edits. Inventory plain error with code vs typed incomplete error requires coordinated taxonomy decision.
- POST-for-read remains proposal only, candidate path/schema unverified. Obtain exact official API evidence from Inventory before considering implementation; default POST denial unchanged.
- Dependency reproducibility: V2 has no lockfile; propose pinned Node/npm and reviewed generated lockfile, npm ci and manager-controlled deployment compatibility review. No manifest or lock changes made.
- Next: verify exact-head CI and resolve any test failures; manager/Security review resource and field constraints before actual integration. Stop at this coordination gate, no merge/deploy without authorization.

## Historical handoff
# Core Shared API Foundation — Current Handoff

**Last verified:** 2026-11-24
**Status:** M1 narrow CI passed; M2 implementation committed, full regression pending; manager/Security acceptance pending. No merge/deploy.

## Source and verified changes
- Approved source: Tawgod/Lightspeed @ 71a1cd6e312ed52efc1e9af9da85db6b02e3756c (PR #78).
- Branch feature/core-api-m1-20261124; draft [PR #83](https://github.com/Tawgod/Lightspeed/pull/83) targets feature/hc-foundation-reconcile-20261124.
- Latest head 6722414245be56e138566beebcfcb0f19e2eef8e. Compare verified 8 ahead, 0 behind approved pin, 5 files changed. No domain, Security, DB, server or gateway edits.
- M1: additive unmounted coreReadContract.js, core.v1 envelope, literal-true injected admission, safe error mapping, UUID trace; strict collection endpoint/cursor/offset checks.
- M2: readCollection.js preserves non-pagination query filters including duplicate values and leading zeros, rejects contradictory continuation metadata, accepts optional correlationId forwarded on each page. Strict allowlist of pagination keys (page/page_size/offset/after/cursor); vendor-specific alternate links or omitted filters require fixture review. No snapshot consistency guarantee.
- Added three M2 regression cases to existing eight tests. End-to-end synthetic trace through executor, collection and transport; domain readers still need opt-in integration.
- Published [integration contract candidate](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m1-20261124/docs/CORE_API_INTEGRATION_CONTRACT.md), including POST-for-read proposal only; generic POST remains disabled.
- Expanded existing isolated branch PR workflow to full foundation and Core Operations tests with disposable PostgreSQL, 8-minute cap, no lifecycle scripts, no deployment. Existing common workflow untouched.

## Tests
- M1 exact head 14c6150f35247bd7057bbbef6249239119ea646d: [CI 45417133843](https://github.com/Tawgod/Lightspeed/actions/runs/45417133843) completed SUCCESS; PR reported mergeable at that head.
- Prior approved baseline CI 45414393938: 40/40 shared foundation + 11/11 Core Operations, real disposable PostgreSQL passed.
- Latest head full regression configured (11 new tests + baseline 51 = expected 62); workflow lookup initially returned no runs. Do not infer pass or current mergeability. Verify exact head CI and test counts before acceptance.
- No live data, browser, production, or vendor acceptance.

## Manager reconciliation requests
1. Review/freeze core.v1 read envelope, error taxonomy and version policy; approve any public API changes before mounting or consumer adoption. Mutation outcomes separate, not implemented here.
2. Security owns active identity/exact operation grant verifier; review authorizeRead seam, no implicit grants. Domain projection and trusted server-owned callbacks required; no raw PII exposure.
3. Coordinate domain correlation propagation and compatibility of strict pagination; verify vendor fixtures before changing whitelist. Do not overwrite domain work.
4. Inventory/Purchasing/manager review exact documented POST-for-read path and body schema before implementation. Keep generic transport read-only; no write-capable transport for read exception.
5. Verify latest PR #83 full regression, mergeability, dependency reproducibility; integrate only after explicit authorization. Gateway remains unmounted. No merge, deploy, migrations, live vendor calls or changes to production branch.
- Next milestone M3 controlled consumer integration requires manager and Security acceptance. No further independent interface changes recommended until reconciliation.

## Historical handoff
# Core Shared API Foundation — Current Handoff

**Last verified:** 2026-11-24
**Status:** M1 implementation candidate; automated execution pending verification; not merged or deployed.

## Current milestone

- Approved parent: Tawgod/Lightspeed @ 71a1cd6e312ed52efc1e9af9da85db6b02e3756c (PR #78).
- Independent branch: feature/core-api-m1-20261124.
- Draft [PR #83](https://github.com/Tawgod/Lightspeed/pull/83), targeting feature/hc-foundation-reconcile-20261124.
- Head: 14c6150f35247bd7057bbbef6249239119ea646d.
- Compare verified 4 commits ahead, 0 behind approved parent; only 4 files changed. Existing divergent documentation branch retained.
- Added services/lightspeed/coreReadContract.js: unmounted additive core.v1 success/error envelope, server UUID correlation, explicit injected authorizeRead adapter requiring literal true, safe error mapping. Security must approve adapter contract and verify exact operation grants; no new identity or permissions implementation.
- Updated readCollection.js: reject cross-endpoint/invalid continuation, unsafe next offsets, non-scalar cursor; preserve valid relative continuation.
- Added tests/core-api-m1.test.mjs (8 tests) and narrow .github/workflows/hc-core-api-m1.yml. No external npm install in new test job. No changes to existing gateway, transport, domain services, DB or production routes.
- Testing: baseline CI 45414393938 passed (40/40 foundation, 11/11 Core Operations); not evidence for new head. New workflow run not yet returned by GitHub at checkpoint. Local private GitHub checkout inaccessible in container (DNS); do not claim new tests passed. PR creation initially reported mergeable false; recheck after GitHub calculates status. No live vendor calls.
- Deployment: none, no merge, no migration, no production access.
- Outstanding: manager contract freeze, Security-owned grant integration, domain-owned safe data projections, transport correlation propagation through domain readers, full current-head regression, explicit continuation query-filter integrity and conflicting metadata review, POST-for-read separate design, dependency lock reproducibility. Do not mount gateway. New read executor assumes trusted server-owned operation/read callback; not a standalone security boundary.
- Next: verify PR #83 CI and mergeability, coordinate contract with manager and Security, run full regression before integration recommendation. No merge or deployment absent explicit authorization.

---

## Previous source audit (historical)

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
