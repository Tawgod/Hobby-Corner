# Core M9 / V9 Wave 1 — candidate checkpoint — 2026-11-25

**Status:** Implemented and draft PR open; targeted CI in progress, NOT accepted or ready for executable Wave 2 adoption. D0 contract published for reconciliation only. This checkpoint supersedes transition-only status; all history preserved below.
- Exact V8 parent Tawgod/Lightspeed 8848f47b71286e177fd483feb94af37b795fead7; branch feature/core-api-m9-v8-20261125; draft PR #125, head 48689e0084646c42df6e3533f49257d740773ba2. Compare 1 ahead, 0 behind, eight Core-owned files; PR open/draft/mergeable on readback.
- Changed services/lightspeed/localTransactionM7.js and localTransactionM8Internal.js share effect normalization; remoteMutationM7.js and remoteMutationM8Internal.js share effect normalization and validated causal receipt; unused M8 reservation normalization removed, exact M7 preparation retained. Malformed/non-JSON evidence returns unknown; no release or retry. No namespace/fingerprint/authorization policy changes. tests/core-api-m8-postgres.test.mjs adds two tests (72 expected targeted total, NOT verified). .github/workflows/hc-core-api-m9.yml branch-scoped, 8-minute cap, Node22/PG16; one run 45666454626 job 139389784304 in progress at observation; no local test or raw CI result claimed. Exact #121 dependency and three fixture hash checks retained in workflow.
- Candidate HC-CORE-ADOPT/0.1 docs/CORE_API_M9_ADOPTION.md and HC-DRAFT/0.1 docs/HC_DRAFT_WORKSPACE_0_1.md at exact candidate head. D0 only, no draft persistence. Separate Security review #123 comment 7169710276 and Catalog #118 comment 7169710923 posted/read back; no response at checkpoint. Approved #121 ee4e417fcfc1ae4358b0e256ccd8a8dee9073ecd unchanged; no new Security source.
- Wave 2: Catalog M11 remote, Inventory M11 local, Customer & Sales M11 local, Purchasing P-11 local may plan against V8; executable adoption recommended only after Manager accepts exact M9 supplementary pin and coordinates domain-specific scope/effect/revision/receipt tests. Do not independently import unrelated deltas. All four currently design-ready, executable adoption gated.
- Remaining: CI exact-head logs/counts, Security and Catalog D0 agreement, distributed lifetime/revocation fence and independent post-revocation reconciliation (not provided by synthetic #121), real persistence/vendor evidence, related-target projection and service identity separately gated. Full M7/M8 lifecycle consolidation deferred intentionally to preserve distinct auth semantics. No production changes, merges, migrations, live calls, grants or deployments.
- Next: verify targeted CI; reconcile D0 and adoption contract with Manager; D1 storage requires new allocation. No baseline promotion.

---

# Core Shared API Foundation — 2.1 transition checkpoint — 2026-11-25

**Successor:** Core Shared API Foundation 2.1. **Status:** M1–M8 accepted in isolated development baseline; V8 owner-approved; transition only, no M9 release. This header supersedes older pending-reconciliation status, preserves all historical evidence below. Same ownership, no infrastructure move.

## Ownership and authoritative sources
Core owns common Lightspeed transport, bounded reads/pagination, versioned read/error/correlation contracts, mutation/idempotency/audit/readback, local atomic transactions/outbox and shared disposable persistence adapters; proposed shared draft persistence/lifecycle. Domain owners own exact business intent/effects, record schema/revisions, UI and domain admission. Security owns identity, authentication, assurance, registry, roles, individual grants/restrictions, delegation, policy and backend administration; consume approved contracts, no duplicate evaluator. Operations owns only assigned UI/mock paths per SECURITY_OPERATIONS_INTEGRATION_CONTRACT.md; never backend. Manager assigns scope, exclusive paths, shared interface changes, integration, combined validation and promotion. Read FOUNDATION_DEVELOPMENT_BASELINE.md, handoffs/foundation-manager.md, this handoff, HOBBY_CORNER_PROJECT.md, SHARED_TOOL_DEPENDENCIES.md, LIGHTSPEED_SHARED_SERVICES.md, handoffs/lightspeed-shared-services.md, FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md, FOUNDATION_SECURITY_REGISTRY_REVIEW.md, FOUNDATION_SECURITY_CORE_M7_REVIEW.md, handoffs/hc-secure.md, SECURITY_OPERATIONS_INTEGRATION_CONTRACT.md, SHARED_DRAFT_WORKSPACE_RECOVERY_PROPOSAL.md, relevant domain handoffs and handoffs/TEMPLATE.md. Historical records remain evidence, not current release authority.

## Exact accepted source and validation
- V8 Tawgod/Lightspeed:test/hc-foundation-combined-v8-20261125 @ 8848f47b71286e177fd483feb94af37b795fead7, tree df4425988cdc7079f211a9673a2254a99bc9da40, parent V7 73bdb41c1bc1ffb8af23effccc1392f4e9f8f5d6. Baseline management commit 4fde8b9950e9c44e4753c8ddc883d5d85bfad73c, blob 0b3c3bfde5e7395f8e9018687395ec76034465e0; Manager handoff blob b0af4c28a2f77bc078df5acbb8c4fc221b1e24c3. Independently reread combined CI 45651685724 job 139337562874 logs: exact V8 and Security checkouts, three hash checks, 471/471, zero fail/skip/cancel/todo. Manager confirms 52 files, PG16, syntax/gateway isolation. Owner-approved isolated baseline, not production.
- Prior milestones: M1/M2 #83 feature/core-api-m1-20261124 6722414245be56e138566beebcfcb0f19e2eef8e (11 additions, V2 187/187); M3 #85 feature/core-api-m3-v2-20261124 a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7 CI 45425826592 19/19, V3 223/223; M4 #89 feature/core-api-m4-v3-20261124 0fabf06643c17ec5632168ffecf8339aa09279e5 CI 45440458686 12/12, V4 266/266. M5 #95 feature/core-api-m5-v4-20261124 c31c8d660baf81227293e3647df13b8d6ee21d76 CI 45445470092 job 138627907468 20/20, V5 299/299. M6 #100 964b84d084c0224b251b3ecef0bb1af30f9cdf22 CI 45471585160 job 138720647856 35/35, V6 346/346. M7 #109 feature/core-api-m7-v6-20261124 1925c3d5adbaf3a028aa736179e8020e514658cd CI 45623478503 job 139237444886 57/57, V7 409/409. M8 #117 feature/core-api-m8-v7-20261125 f9fe1d66d2c6c6b4ce309d3521e361c5a6714791 CI 45650042202 job 139331746813 70/70 (57+13), exact logs previously independently verified; accepted in V8. Fresh PR reads #95/#100/#109/#117 unchanged, open draft. Earlier exact details and failed checkpoints retained below. No newer Core M9 branch found in name search; latest Manager/baseline no release. Do not interpret search as exhaustive repository audit.
- V8 domain pins #118 Catalog 1920bc6b01cd0741d4e260d6ac4927cd8e3108c9, #119 Customer 7fc4fb3422ffb0fbf40218a06a37e03cd0bc8112, #120 Purchasing 0984d6c13ca7f47fe7dfd1aa95f0992252eb803f, #122 Inventory 725b2d1be2a6b0f81377a7e5123fdb991f6ac969. Manager accepted exact combined deltas. No automatic domain M8 adoption.
- Required Security independent #121 ee4e417fcfc1ae4358b0e256ccd8a8dee9073ecd, HC-AUTHZ/0.1.0, CI 45639484058 job 139293814695 199/199 accepted. Separate read-only checkout .security-source; verify git SHA and fixture blobs hc-secure-s25h-contract.mjs d04a6db6995e982371c2f7ea25a43faf64090279, hc-secure-s25e-role-policy.mjs 79c99f79252f0cc391d0a5c6be7d73f21dd60ff9, hc-secure-s25g-lifecycle.mjs e82a630c567294df0b58d0efc8bac32d3c3a0d73. Security #123 32e2548bffec9ec75db63b6a817e67a3b0e99ee7 217/217 independent accepted, not a replacement; SO-01 independent acceptance limitations and SO-02 gate remain. Never rebase Security/Operations on V8.
- Shared historical source PRs #32 current d2a90b49e0f58104f17391c1f67623c256950326 (open), #33 current 38c6b1fe7e2e623aeefec55ab28aecc896011f1e (draft), #51 199fa0eefee5f27c844ad879ba291e035a4a299d (draft), fresh metadata differs from some historic handoff pins for #32/#33; inspect actual delta before any overlapping work. Existing production baseline integration/hobby-corner-consolidation remains separate. Last Core Railway metadata 2026-11-24 in prior transition; not refreshed now. No Core M1–M8 deployment, mounted gateway, actual permissions, live vendor traffic or applied migration established; private Security readiness is distinct.

## Contracts and cumulative decisions
- Preserve existing GET/HEAD bounds, exact identifiers/leading zeros, complete pagination, safe errors/correlation and read envelopes; no POST-for-read without exact vendor evidence and approval. M4/M5/M6 local atomic claim/domain/audit/outbox/result, typed locks/revisions and unknown commit inspection; no external side effect in local transaction. M7 immutable execution separate from approval and access, original approval retained, actor-bound replay, current execution/approval/access checks, safe flat receipt, multi-target empty projection, independent inspection, postcommit denial not rollback. Remote exact typed target/revision/SKU/UPC/supplier SKU old/new reservation keys, atomic competing holds, no normalization, fresh rederive before dispatch, independent causal event proof, alternate key conflict, unknown hold/no blind retry or release. Catalog agreement #109 7163541966; Manager #109 7163456580.
- M8 additive authorizationM8.js/localTransactionM8Internal.js/remoteMutationM8Internal.js, tests/core-api-m8-postgres.test.mjs, docs/CORE_API_M8_COMPOSITION.md; prior M7 exports unchanged. Security exports createOfflineAuthorization, executionScopeDigest, canonicalRequestBinding, validateOfflineAllow unchanged; trusted evidenceRef and complete exact rich execution/access sets, unique per-stage request, strict bound allow, immediate current policy, same synthetic clock instant as issuedAt, no cache/partial grants. Persist original approval and scope binding (local explicit envelope, remote cryptographic commitment); legacy same-key M7 conflict, no rerun. Employee-only, no service fallback or related-target expansion. Manager #117 7166201365, Security 7166341764, release 7167609001. Limitations: duplicated orchestration flow drift, synthetic scope admission, incomplete edge coverage (approval replacement/multi-target/historical compatibility), no real transport or distributed revocation/expiry fence, no production persistence/vendor evidence. Future exact proof lifetime improvements require renewed Security agreement.
- Preserve owner-approved scoped restriction precedence, no implicit Owner bypass; ordinary authorized active employee product/wholesale cost and customer contact/notes/financial reads per latest Security policy, no blanket export; separate actual catalog master and PO line cost changes, independent high-risk approval and explicit reviewed Owner exception, bounded admin appointment/delegation/revocation, on-site PIN session without repeated factor, stronger offsite authentication and separate sensitive/admin freshness policy. Exact policy defaults, thresholds, role sets, location/data scopes, settings and recovery remain Security/owner-gated; do not infer grant. 218 provisional IDs and 19 conditionally agreed alias occurrences remain unmapped/unfrozen; preserve cumulative inventory below, Security owns registry. data.export, workflow jobs configure/execute/audit, product delete/reference split, sales return/refund conditional provider parity/deposit modify and Inventory semantics require exact scopes. Separate local receipt inspection from remote reconcile-unknown, no retry implied.
- Domain contracts: physical inventory receipt/transfer/count/adjustment effects independent of financial sale/refund/reversal/deposit/credit; Purchasing invoice approval does not authorize physical receipt, remote PO change or catalog cost; preserve exact supplier/PO/line/invoice/product/variant/location, qty/amount/currency/revision, related evidence and purpose/audience. Related-target disclosure and multi-target field map not approved; no silent loosening. Domain ownership and independent current access remain mandatory.

## Pending objectives and gates
Recommended M9 (not assigned): D0 shared draft/workspace recovery coordination from V8. Owner wants named projects, periodic/manual durable snapshots, restore after authenticated interruption, conflict detection, configurable retention, clear save status; Catalog bulk edits first, other domains later. Proposal SHARED_DRAFT_WORKSPACE_RECOVERY_PROPOSAL.md commit 7c37d4be067fdee163d0add50b7c83fbe8f256da; historical V7/M8 status in proposal superseded by V8. Core persistence/lifecycle, domain payload/revision/UI, Security access/assurance; no transactions/approval preservation/post-expiry anonymous writes or unprotected browser storage. Restore current scoped access after reauth, validate actual revisions/effects/current approvals on submission, never auto-submit/retry unknown; acknowledge unsaved changes since last durable snapshot. Proposed HC-DRAFT/0.1, 3s/30s autosave and 14/30 day retention are design suggestions only, not approved. Manager allocate D0/D1, coordinate Security and Catalog before implementation. M8 domain adoption and drift/edge review also pending Manager sequencing. No implementation started for M9.
- After explicit assignment, verify latest baseline/PR/contract and create independent branch from exact approved pin; additive owned paths only, coordinate cross-workstream contracts and avoid overlap; preserve old PRs. Use local checks where possible, capped targeted offline/disposable PG CI, exact-head logs, no gratuitous Actions reruns; Manager alone combined assembly/promotion. No production merges/deployments/routes/settings/grants/real data/vendor calls/shared migrations/outbox dispatch without explicit separate authorization. Report implementation/test/acceptance/deployment separately, exact hashes/jobs, limitations, coordination and next step; update own canonical handoff and readback, notify Manager via GitHub. No background promises; report specific unresolved blockers, not repeated status-only stops when execution is possible.
- Transition ready once readback verified. No new implementation, branch, CI, deployment or actual permissions during transition. Owner may archive old conversation after successor initialized; pending milestone allocation owned by Manager, unfinished Core work by 2.1.

---

# Core M8 — exact targeted validation PASS; ready for Manager reconciliation — 2026-11-25

- Draft PR [#117](https://github.com/Tawgod/Lightspeed/pull/117), branch feature/core-api-m8-v7-20261125, exact tested head f9fe1d66d2c6c6b4ce309d3521e361c5a6714791, base approved V7 73bdb41c1bc1ffb8af23effccc1392f4e9f8f5d6. Fresh readback confirms open/draft/mergeable and exact head. Six implementation additions plus earlier proposal doc. No existing M7 code changed.
- Manager allocation 7166201365 and Security lifetime clarification 7166341764 on #117. Exact unchanged Security #121 ee4e417fcfc1ae4358b0e256ccd8a8dee9073ecd (199/199 separately verified), HC-AUTHZ/0.1.0. Independent checkout verifies exact SHA and three fixture hashes d04a6db6995e982371c2f7ea25a43faf64090279, 79c99f79252f0cc391d0a5c6be7d73f21dd60ff9, e82a630c567294df0b58d0efc8bac32d3c3a0d73. No evaluator copy or newer Security substitution.
- [CI 45650042202](https://github.com/Tawgod/Lightspeed/actions/runs/45650042202), job 139331746813 SUCCESS. Actual logs checked both exact checkouts, three hash checks and TAP totals: 70/70, 57 inherited +13 M8, zero failure/cancel/skip/todo, disposable PG16. One targeted run. Tests cover local complete sets, unique decisions, replay and changed rich scope, missing grant, revoked session, expired approval, malformed response, advancing clock, stale policy, timeout, unavailable authorization, postcommit projection denial; remote complete sets/replay/changed scope, dispatch-stage revocation, inspection denial. No combined V8 run yet.
- Additive Core adapter authorizationM8.js and local/remote M8 internal orchestration reuse M7 command preparation and retain M7 key namespaces; new persistence fingerprint binds original command digest, rich scope and original approval reference. Local envelope retains explicit scope digest and approval reference; remote persistence uses cryptographic commitment and original approval digest, not separate cleartext columns. Same-key legacy M7 records conflict rather than silently rerun. Complete stage-specific execution/access sets, fresh unique decision, same synthetic issuance/consumption clock and current epoch, strict Security validator; fail closed. Domain trusted scope mapper and evaluator evidence remain synthetic. Existing M7 multi-target projection guard retained; no related-target expansion or service fallback.
- Limitations: separate M8 orchestration variants mirror M7 flow rather than refactor inherited engine; review drift before real integration. No distributed atomic revocation/expiry fence, actual identity transport, production policy/admission, remote vendor effects or real database migration. Tests are targeted, not exhaustive for every domain, approval replacement, multi-target or historical compatibility edge. Synthetic dispatch revocation case denies at dispatch-stage check, not proof of revocation after actual network send. Manager should inspect source and regression/combined compatibility before accepting; no production acceptance. Manager owns exact Security checkout in combined validation, avoid collecting the M8 test without its pinned dependency. Expected V8 business total 471 if four domain exact passing pins unchanged and 13 unique Core additions; not yet combined verified.
- Shared draft/workspace recovery proposal in management repo SHARED_DRAFT_WORKSPACE_RECOVERY_PROPOSAL.md commit 7c37d4be067fdee163d0add50b7c83fbe8f256da; design coordination only, no new assignment until Manager allocation. No actual grants/settings, live services, merges or deployments. Stop at M8 milestone and request Manager reconciliation.

---

# Core M8 — Security contract accepted by Core; Manager composition gate — 2026-11-25

**Status:** Security S2.5H exact offline profile reviewed and accepted by Core for isolated composition, subject to explicit Manager allocation. No executable integration yet.
- Security #121 exact head ee4e417fcfc1ae4358b0e256ccd8a8dee9073ecd, independent parent #115 a4b657750adb9b0a24bd7e1c95505df56330cc25. Fresh job 139293814695 CI 45639484058 logs independently confirm exact checkout and 199/199 pass, zero failures/skips/cancellations. Security response #117 comment 7166051314. Failed preliminary pin 091381e0dc2bcadb504914dd0f92a4ee910b36b9 excluded.
- Reviewed exact docs/security/HC_AUTHZ_0_1_0.md and tests/fixtures/hc-secure-s25h-contract.mjs. Accept Security-owned replacement HC-AUTHZ/0.1.0 profile (not earlier Core candidate schema): full execution/access sets, canonicalRequestBinding/executionScopeDigest/validateOfflineAllow/createOfflineAuthorization exports, exact rich typed scopes, trusted evidenceRef, policyVersion and interval, strict boolean response validation. Dependencies same-directory s25e role and s25g lifecycle fixtures plus Node crypto. No copied evaluator or alternate policy engine.
- Core agreement and Manager allocation request [#117 comment 7166139685](https://github.com/Tawgod/Lightspeed/pull/117#issuecomment-7166139685). Retain original approval reference and immutable rich execution scope digest across stages/replay, separate from M7 execution digest; avoid unrelated per-effect decision aggregation. Fresh decisions each stage, no reuse; response lifetime may outlast proof expiry, actual revocation/expiry fence unresolved. Security confirmation requested. Preserve M7 employee-only namespaces and empty multi-target projection; additive service identity or field mapping requires review. Purchasing and Inventory scope requests #117 comments 7165988912 and 7166096326 noted, no new identifiers or permissions.
- Proposed Manager arrangement: Core-only consumer/fixture changes on #117, separate read-only exact Security checkout in isolated CI, verify exact source SHA, no copying into business branch; Manager owns final combined assembly and provenance. Latest Manager handoff still V7 release and does not authorize exact composition arrangement. Stop before executable cross-workstream integration until allocation confirmed. V7 baseline and all existing M4–M7 behavior unchanged. No new CI, production effects, grants, merges or deployments. All previous inventory and limitations retained below.

---

# Core M8 — V7 authorization integration coordination gate — 2026-11-25

**Status:** V7 owner-approved; independent M8 branch and design-only coordination PR established. Await exact Security contract and Manager integration arrangement before executable cross-workstream composition.
- Approved exact V7 Tawgod/Lightspeed:test/hc-foundation-combined-v7-20261125 @ 73bdb41c1bc1ffb8af23effccc1392f4e9f8f5d6; branch compare identical, canonical Manager/baseline record CI 45634424284 job 139275932477 409/409, 46 files, zero fail/skip/cancel/todo. All eight prior Core #109 blobs compared identical to V7; no missing delta. Prior tested pins preserved.
- Independent feature/core-api-m8-v7-20261125, [draft PR #117](https://github.com/Tawgod/Lightspeed/pull/117), exact proposal head 581a702aebda541c02be64b4dc96b7385bf467f7, exact V7 base, one additive documentation path docs/CORE_API_M8_SECURITY_ADAPTER_PROPOSAL.md. Initial mergeability pending. No executable changes, no new tests or CI.
- Reviewed Security handoff and exact accepted #115 a4b657750adb9b0a24bd7e1c95505df56330cc25 S25G_SERVICE_ASSURANCE_LIFECYCLE.md and hc-secure-s25g-lifecycle.mjs. Separate employee assurance and service decision fixture, not a unified Core protocol. Manager reports 167/167 accepted independent offline Security tests; Security not in V7. No S2.5H branch returned by initial branch search. No live transport or actual enforcement established.
- [Security coordination request #115 comment 7165954711](https://github.com/Tawgod/Lightspeed/pull/115#issuecomment-7165954711) asks Security to confirm or replace proposed HC-AUTHZ/0.1 versioned schema, trusted actor/effect/approval/access bindings, full-set stage mapping, policy freshness/expiry, assurance and service delegation, exact Security-owned exports/pin/dependencies. Manager must approve integration arrangement. Proposed names are not accepted wire contract. Core validates trusted responses, does not evaluate grants, identity, assurance or restrictions. No copied evaluator or Security-owned file edits.
- M7 local/remote callbacks differ and authorize per effect; need agreed whole-set decision context and exact scope mapping, no independent partial allow aggregation or silent change to existing exports/digests. M7 service actors denied; new delegated/standing paths require approved additive identity binding. No related-target projection bypass, no historical cross-actor/expired approval disclosure, no blind retry or reservation release. Independent local receipt vs remote reconciliation, master vs PO cost, financial vs physical effects remain distinct.
- Proposed negatives: unavailable/malformed/expired/revoked/stale/wrong-bound response, session/device/site loss, service/job/delegation/standing authority, exact scope/cross-tool, approval/replay/projection/unknown holds. One capped targeted offline/disposable PG run after contract approval, exact tested pin publication; Manager alone assembles integration. No claims of real Security, distributed revocation fencing, production-grade persistence or endpoint coverage.
- All 19 alias directions conditionally agreed but provisional/unmapped; cumulative inventories below preserved. No new grants, registry freeze, credentials, production data, routes, live services, merge, deploy or migrations. No owner business input required now; unresolved Security contract and Manager source composition dependency is the stop gate.

---

# Core M7 — final tested dependency and V7 reconciliation release — 2026-11-25

**Status:** M7 local and remote isolated implementation PASS; ready for Foundation Manager V7 reconciliation. V6 remains approved; V7 combined testing and owner acceptance pending. No production approval.
- Exact passing pin Tawgod/Lightspeed:feature/core-api-m7-v6-20261124 @ 1925c3d5adbaf3a028aa736179e8020e514658cd; PR #109, exact V6 base 0ffe5e3e152174462240021c59f64862af782b03. Fresh PR readback: mergeable=true, draft=true, merged=false, 8 paths.
- Final CI 45623478503 job 139237444886 completed SUCCESS; independently read checkout and TAP logs, 57/57 passed, 0 fail/skip/cancel, including all 12 remote cases, 10 local M7 cases and 35 inherited Core cases. No further CI launched. Supersedes local-only pin a89dd5c482f4a12f55d16e491f5c2fc208816a56 for full M7 reconciliation.
- Remote tests passed atomic competing SKU/UPC/supplier SKU reservations, alternate-key conflict and same-key replay, unknown holds and explicit causal inspection, stale revision/effect and dispatch denial, independent read/inspection, audit failure, malformed typed identity, update revision guard and actor/replacement approval mismatch. Existing Core M4/M5/M6 and Catalog tested heads preserved. Catalog agreement #109 comment 7163541966 and Manager acceptance 7163456580 govern this isolated implementation.
- Expected V7 combined total 409 based on Manager's prior 397 plus 12 remote cases; not combined-tested. Manager owns exact delta reconciliation, overlap review, combined CI and owner approval.
- Limitations unchanged: trusted domain key/effect derivation, synthetic event evidence and policy callbacks, conservative indefinite reservation holds, no real vendor causal proof, actual Security/endpoint enforcement, production-grade persistence, restart/network recovery or distributed revocation fence. No grants, alias activation, live effects, merge, deployment or shared migrations. All historical inventory retained below.
- Next action: Manager independently verify exact pin and reconcile V7. Core stops at tested milestone; no owner input required for reconciliation.

---

# Core M7 remote implementation checkpoint — 2026-11-25

**Status:** Local M7 exact pin passed 45/45; remote synthetic candidate committed, final targeted validation pending. V6 remains approved, V7 not approved.
- Latest Manager follow-up and Catalog #109 comment 7163541966 reread; Manager releases remote test-only implementation. Prior local passing pin a89dd5c482f4a12f55d16e491f5c2fc208816a56, CI 45622074793 job 139232573481. Current #109 head 1925c3d5adbaf3a028aa736179e8020e514658cd, exact V6 base 0ffe5e3e152174462240021c59f64862af782b03, eight changed paths; initial mergeability pending. No changes to M4/M5/M6/local M7 or Catalog #110.
- Added remoteMutationM7.js, disposable coreRemoteM7Pg.mjs reservation ledger and remote PG tests. Typed target/revision/SKU/UPC/canonical supplier SKU keys, atomic all-key reservation and rollback on conflict, persistent hold across alternate keys and revision changes, immutable audit and dispatch marker before synthetic callback, fresh authorization/approval and trusted derivation, independently authorized causal observation, minimal receipt projection, no blind repeat or automatic release. No external callback inside ledger transaction. Distinct actor/replacement proof deny receipt.
- Catalog owns complete domain effect/key derivation, original/changed identifiers and validator semantics; Core validates structural keys, not actual catalog identity completeness. Synthetic event observation is trusted fixture, not real vendor proof. Dedicated remote disposable ledger models different lifecycle from existing local transaction fixture; no runtime store. Conservative permanent holds even after verified/blocked; no production release policy, service delegation, related-target access, actual Security, policy fencing, real network/restart or vendor compatibility established. Actual endpoint bypass coverage remains unverified.
- Added 12 remote cases including competing SKU/UPC/supplier SKU, alternate/same key, unknown hold and causal mismatches, stale revision, denied dispatch, independent access, audit failure, malformed keys, revision guard and actor/proof mismatch; expected targeted total 57 (45 prior +12). Updated existing eight-minute workflow; latest exact-head run not yet visible at initial lookup. Sequential commits may trigger intermediate PR workflows; no manual reruns or combined CI. Do not publish passing pin until exact logs verified. No actual grants/aliases, production changes, merge, deployment, migration or live vendor effects.
- Next verify exact-head CI and address failures if necessary. Manager owns V7 combined assembly; preserve other tested domain heads. All cumulative inventory and prior limitations retained.

---

# Core M7 local tested dependency — 2026-11-25

**Status:** Local M7 implementation PASS; remote M7 implementation outstanding. V6 remains approved, V7 not approved.
- Exact passing local pin Tawgod/Lightspeed @ a89dd5c482f4a12f55d16e491f5c2fc208816a56, PR #109, V6 base 0ffe5e3e152174462240021c59f64862af782b03. CI 45622074793 job 139232573481 completed success; actual checkout and logs independently verified 45/45 (10 new, 35 inherited), zero failed/skipped/cancelled. No additional CI launched.
- Local execution/access separation, approval binding, replay, projection, independent inspection and negative synthetic cross-tool cases passed. M4/M5/M6 unchanged. Conservative restrictions and limitations below remain; actual Security, endpoint enforcement and production durability not demonstrated.
- Catalog agreement #109 comment 7163541966 resolves remote design coordination. Next implement separate synthetic remote reservation/orchestration and causal readback validation; no external calls in local transactions, no blind retry. Local passing pin does not validate remote portion. No production changes, merge, deployment or permission activation.

---

# Core M7 local implementation — 2026-11-25

Status: local candidate committed, exact-head validation pending; remote implementation not yet complete. V6 remains approved. Manager #109 comment 7163456580 and FOUNDATION_SECURITY_CORE_M7_REVIEW.md reread; exact Catalog agreement #109 comment 7163541966 now available, confirms typed canonical reservation tuples, conservative alternate-key conflict, causal evidence and no automatic release. Preserve tested Catalog #110.
- #109 branch feature/core-api-m7-v6-20261124 head a89dd5c482f4a12f55d16e491f5c2fc208816a56, base exact V6 0ffe5e3e152174462240021c59f64862af782b03, five additive paths, mergeable at readback. New localTransactionM7.js, tests/core-api-m7-postgres.test.mjs, docs/CORE_API_M7_LOCAL_CONTRACT.md and capped workflow; M4/M5/M6 and shared fixture unchanged.
- Versioned execution digest separate from access and approval, original proof digest persisted in server-owned receipt envelope; fresh execution/approval checks, independent read/inspection, locked verification, generic undisclosed denial, exact flat receipt projection. Conservative limitations: service/delegation denied; nonempty multi-target projection denied pending field-to-target mapping; no general derived projection or actual Security policy. Amount/quantity facts and complete effects remain trusted domain derivation. No cross-version migration, no actual distributed revocation guarantee. Cross-tool labels synthetic only.
- 10 new tests (one dependency-free digest test, nine PG cases) and 35 inherited expected in capped local suite; exact-head run not yet visible at first lookup. No claimed passing pin. No new permissions or alias changes; cumulative inventory below retained; independent local receipt/remote reconciliation remains provisional. No live calls, deployment, merge, shared migration or production effects.
- Next verify actual CI logs and exact checkout; publish local tested pin only after pass. Implement remote synthetic orchestration separately using Catalog agreement, atomic disposable reservation persistence and separate dispatch/causal evidence/inspection; do not imply local suite verifies remote. Manager owns V7 combined reconciliation.

---

# Core Shared API Foundation — V6 / M7 coordination checkpoint — 2026-11-24

**Status:** V6 approved; independent M7 branch created; design-only proposal submitted. Shared interface coordination gate before executable implementation.

- Exact approved V6 Tawgod/Lightspeed:test/hc-foundation-combined-v6-20261124 @ 0ffe5e3e152174462240021c59f64862af782b03; manager canonical CI 45473105844 job 138726062778 346/346, 40 files, no failures/skips/cancellations. All six #100 M6 blobs compared identical to V6, no missing delta. Prior branches/PRs preserved.
- Independent feature/core-api-m7-v6-20261124, [draft PR #109](https://github.com/Tawgod/Lightspeed/pull/109), exact proposal head 749c7d582f1fd750272581a13eeacac510ef54d2, one additive design file, base exact V6. Initial mergeability pending; no executable changes or new CI. [M7 proposal](https://github.com/Tawgod/Lightspeed/blob/749c7d582f1fd750272581a13eeacac510ef54d2/docs/CORE_API_M7_COORDINATION_PROPOSAL.md).
- Reviewed exact V6 M6 executor, remote mutations.js/idempotency.js and Catalog M8 fixture, latest manager/baseline and Catalog handoff. M6 includes access effects, approval and receipt fields in one fingerprint; changed authorized projection conflicts, approval digest self-reference risk, current approval enforcement delegated to injected callbacks. Remote single-operation policy, payload-only digest, same-key replay returns stored result before readback, no cross-key intent reservation. M8 synthetic wrappers mitigate some gaps but do not prove durable duplicate or causal readback. Preserve M4/M5/M6 and existing remote exports.
- Security S25D_EXECUTION_ACCESS_SCOPE.md read at exact Security #105 1aee4f9f734b221b1c3c5253e8c3466304cd03f5 (application repo docs/security, not management root). Agree proposed separation of immutable execution and independent stage-specific access, current execution/approval required conservatively even for disclosure, denied disclosure never rollback. Propose versioned execution digest separate from approval proof and access; stable internal receipt schema, current scoped projection, independent reconciliation authority. No migration of old digests, no new Security engine. Security S2.5F actual contract and historical inspection policy unresolved.
- Catalog coordination: canonical business-intent reservation across transport keys, tenant/domain uniqueness and revision, actor-bound no disclosure, multi-effect dispatch checks, causal readback, minimal receipts, safe replay and unknown reservation retention; no remote effects inside local DB transaction. Await Catalog/Manager/Security agreement on exact keys, alternate-key conflict vs replay, approval evidence/stages and recovery/release policy.
- Cumulative Security inventory retained. S25D Core dispositions: semantic agreement only with data.export -> domain export plus exact read fields/purpose/dataset/destination/tenant; workflow.jobs.configure -> scoped jobs.configure, exact type/schedule/effects, separate delegation; workflow.jobs.execute -> scoped jobs.execute exact run/current delegated authority/underlying grants, retry not automatic; workflow.audit.read -> scoped Customer domain audit.read event/resource/fields, no Security audit access. Other 15 dispositions domain-owned; no broad alias mapping. Local receipt inspection and remote PO reconciliation separately scoped, IDs not invented. Exact amount/quantity/currency/revision, relationship and purpose/audience scope extensions proposed; ordinary authorized employee cost/customer reads retained, restrictions override. No actual grants, role assignments or registry freeze. Actual endpoint enforcement, policy freshness/approval/projection and revocation fence remain open.
- Testing: inherited V6 result manager-verified; no executable M7 changes or tests yet, no new CI. Targeted negative cross-tool, execution/access, approval/replay, disposable PG and synthetic remote cases specified in proposal. One capped run after coordination. No production access/changes, live vendor writer, merge, deploy or shared migrations.
- Next: Manager, Security S2.5F and Catalog M9 explicitly coordinate proposal; then implement additive test-only contracts and publish exact passing pin. Domain consumers preserve V6 interfaces until approved. No owner business decision required currently.

---

# Core M6 — tested dependency release — 2026-11-24

**Status:** M6 isolated implementation and targeted validation PASS; ready for Inventory M8/Purchasing P-08 dependency adoption and Foundation Manager reconciliation. Not production-approved.

- Exact tested dependency: Tawgod/Lightspeed:feature/core-api-m6-v5-20261124 @ 964b84d084c0224b251b3ecef0bb1af30f9cdf22. PR #100 verified open/draft/mergeable/unmerged, exact V5 base 87f6a94918653a3417ce01205098193eb1ccb35d. Supersedes failed 055a1510 candidate; never adopt failed pin.
- CI 45471585160, job 138720647856, completed SUCCESS. Independently read actual checkout and test logs: exact corrected SHA, 35 tests, 35 pass, 0 fail/skip/cancel. 15 M6 and 20 inherited cases; new frozen receipt/reordered replay regression passed. One capped targeted repair run, no combined CI or rerun.
- Adopt exact tested shared interface and fixture delta, not moving branch or duplicate framework. See docs/CORE_API_M6_ADAPTER_CONTRACT.md at tested SHA. Inventory/Purchasing own typed keys, domain revisions/effects/receipt projections and their own targeted validation. Manager coordinates dependency integration and V6 combined testing.
- Repair uses exact own-key membership/count without mutating frozen allowlist; no shared interface/permission change. Security cumulative inventory and limitations below preserved. Actual authorization, field projection and approval enforcement, distributed revocation atomicity, real network/restart recovery, domain history and outbox delivery remain unverified. No production data, grants, routes, migrations, merge or deployment.
- Next: Manager reconcile exact pin with domain adoption and Security review. Core stops at tested milestone; no further CI needed for unchanged head.

---

# Core M6 repair checkpoint — 2026-11-24

**Status:** Initial CI FAILED; corrected candidate committed, exact-head validation pending. Do not adopt either pin until passing evidence is published.

- Initial head 055a1510acab12e6f35d8e2aee01e0ec23a82635, CI 45470994612 job 138718583006: independently read logs, 25/34 pass, 9 fail, zero skips. Manager comment 7142241073 confirms frozen receipt-field array sort in exact().
- Corrected #100 head 964b84d084c0224b251b3ecef0bb1af30f9cdf22, same exact V5 base, one fast-forward repair commit containing two changed files, preserving existing six-path PR scope. Readback blob pins: executor 52b90d3c1cf113128f5bae2192699d203aeb42da; tests c528409778be52e547f0baa53023d955bad55c8b. Replace mutating sort/join with exact own-key membership and count; immutable binding retained. Focused PG regression covers frozen field arrays, canonical replay order, malformed receipt rejection and no reapplication. No interface or permission change.
- Local Node 22.16.0 isolated helper check reproduced old TypeError and passed 10 assertions for corrected comparison. Local checkout unavailable (GitHub DNS), PostgreSQL tooling absent; not full source/PG validation.
- One batched repair ref update triggers existing eight-minute capped targeted workflow, expected 35 tests (15 M6 + 20 inherited). Exact-head run not yet visible at initial lookup. No manual rerun, no combined CI. Inventory/Purchasing remain gated until exact passing dependency. Security inventory and prior limitations below unchanged. No merge/deploy/live data/production modifications.

---

# Core Shared API Foundation 2.0 — M6 implementation checkpoint

**Last verified:** 2026-11-24
**Status:** Manager/Security conditional acceptance for isolated implementation; candidate committed, targeted CI running; NOT a tested dependency pin yet.
- V5 exact parent 87f6a94918653a3417ce01205098193eb1ccb35d, approved combined 299/299. Manager current reconciliation and FOUNDATION_SECURITY_CORE_M6_REVIEW.md read. Existing #100 branch feature/core-api-m6-v5-20261124, head 055a1510acab12e6f35d8e2aee01e0ec23a82635, verified mergeable draft/unmerged, six changed paths. No merge or deployment.
- Implemented services/lightspeed/localTransactionM6.js, additive typed methods on tests/fixtures/coreDisposablePg.mjs (preserving M5 methods), tests/core-api-m6-postgres.test.mjs, docs/CORE_API_M6_ADAPTER_CONTRACT.md and capped workflow. Original proposal retained. Immutable synthetic actor/tenant/effects/revisions/approval command binding, deterministic declared typed locks including absence, post-lock verification and authorization, precommit check, independent read/reconcile checks, restricted domain transaction callback, minimal receipt, canonical event fingerprint, safe postcommit/unknown classification. Domain supplies trusted effect/approval verifier and projector; no real Security engine.
- Targeted [CI 45470994612](https://github.com/Tawgod/Lightspeed/actions/runs/45470994612), job 138718583006 in progress at exact candidate head; 14 new cases expected plus 20 inherited. No claimed pass yet. Do not adopt until exact test result verified. No combined CI launched by Core.
- Security inventory retained below: no new business grants or registry aliases. Current Security review requires exact per-effect scoped authorization including read and reconciliation, approval and delegation validation, restrictions override grants, no Owner bypass. Separate PO line and master catalog cost effects. Ordinary authorized employee cost/customer contact/notes/financial read defaults preserved. On-site session revalidation does not imply repeated PIN. Fixture callbacks simulate decisions, not actual registry enforcement. No atomic distributed revocation, real network/restart recovery, actual projection/approval enforcement or production isolation established. Domain-owned receipt values and record history remain trusted; no real outbox delivery.
- Next verify CI exact head and logs, address any failures, publish exact tested dependency pin for Inventory M8/Purchasing P-08 and Manager. No production data, shared migrations, grants, routes, deployment or merge.

---

# Core Shared API Foundation 2.0 — V5 / M6 interface coordination gate

**Last verified:** 2026-11-24
**Status:** V5 accepted; M6 branch created; proposed shared interface submitted for coordination before implementation. No M6 runtime/test implementation or deployment yet.
**Active owner:** Core Shared API Foundation 2.0; inherited ownership and all historical checkpoints preserved below.

## Source and implementation
- Approved V5 Tawgod/Lightspeed:test/hc-foundation-combined-v5-20261124 @ 87f6a94918653a3417ce01205098193eb1ccb35d; manager CI 45450851407 verified 299/299, 35 files, no failure/skip/cancellation. Prior M5 PR #95 exact head c31c8d660baf81227293e3647df13b8d6ee21d76; all five file blobs identical to V5, no missing delta. Previous branches/PRs preserved.
- Independent branch feature/core-api-m6-v5-20261124 from exact V5; [draft PR #100](https://github.com/Tawgod/Lightspeed/pull/100), head 53351c692ef47df1534ae2d0a7e6da50f63013e2, one additive documentation file, targeting exact V5. Initial mergeability false/pending calculation; recheck before acceptance.
- [M6 interface proposal](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m6-v5-20261124/docs/CORE_API_M6_COORDINATION_PROPOSAL.md) defines opt-in compatibility-preserving typed domain locks including missing records, revision checks, actor/effect/resource-bound fingerprint, fresh authorization after domain locks and immediately before commit, minimal receipt and fresh projection, canonical outbox fingerprint, uncertain commit inspection and audit limitations. No M4/M5 interface changes or implementation yet. Inventory M8 and Purchasing P-08 should review lock shape, revisions, uniqueness and receipt fields; Catalog M8 retains separate remote mutation seam; Security reviews actor/scope/grant/delegation semantics; manager coordinates acceptance. Do not treat proposal as approved contract.
- Reviewed current baseline/manager, own transition, relevant domain handoff checkpoints, V5 manifest and M5 source/tests/contract; consolidated Security requirements and dependency excerpts. Full longer-document review and exact remote mutation seam review remain before implementation. No cross-workstream code edits.

## Tested / deployed
- Inherited V5 299/299 manager-verified; no new executable changes, no new automated test run at documentation-only coordination gate. Targeted regression plan in proposal; run after interface agreement, not duplicate manager combined CI.
- No merge, deployment, route mounting, live data, shared migration, production mutation or permission activation. Previous Railway metadata checkpoint below remains historical; not freshly inspected for this documentation-only update.

## Security and administration UI dependencies — M6 delta
- Preserve entire cumulative inventory below. No new business operation or role proposed, no aliases renamed or activated. Internal locking and rechecks enforce existing underlying grants, not an additional user permission. Existing proposed audit read/export, reconciliation/inspection, queued dispatch and service delegation remain separate and scoped; never infer approval to execute or disclose from access to tooling.
- Clarify existing scope requirements: immutable actor, tenant/resource/effect binding at claim, post-lock and precommit; replay/read projection must enforce current resource/field permissions; actual Security contract and revocation atomicity unresolved. No real grants or endpoint mapping evidence added. UI must show effective access/restrictions, scope and delegation/expiry; no new Core permission UI. Preserve ordinary active employee wholesale cost visibility and separate modification. Alias groups product/products/catalog.product, cost modification, count/restock/reason, PO/invoice, audit/jobs/export remain provisional; no tool bypass.
- Inventory and Purchasing domain uniqueness, revision/history, receipt allowlists and exact effect grants remain domain-owned. Invoice approval not physical receiving. Catalog remote write readback and uncertainty independent of local rollback.

## Next action / coordination gate
Foundation Manager, Inventory, Purchasing, Catalog and Security review PR #100 proposal; record accepted test-only interface and any changes. Then Core implements additive seam on same branch, runs capped targeted disposable PostgreSQL regression, verifies PR/head and updates handoff. Domain owners may prepare their own fixtures without changing shared interface, but must not assume unapproved M6 contract. No owner business decision required at this point. No production work authorized.

---

# Core Shared API Foundation — 2.0 transition checkpoint

**Last verified:** 2026-11-24
**Status:** Ready for conversation transition; M5 offline deliverable validated; manager V5 candidate review complete, V4 still approved; no new development authorized at this checkpoint.
**Successor:** Core Shared API Foundation 2.0 (same workstream, not a new implementation).

## Purpose and exclusive ownership
Core owns shared Lightspeed transport, version/error/read envelope, pagination, correlation, remote mutation audit/idempotency/readback contracts, local transaction/outbox orchestration and common disposable adapter interfaces. Domain owners retain business semantics, record schemas and consumer workflows. Foundation Manager owns integration, approved baseline and cross-workstream sequencing. Foundational Security exclusively owns identities, authentication, roles, individual grant/restriction precedence, exact operation authorization, delegation and administration UI; Core consumes approved interfaces, never a parallel identity or permission system.

## Transition verification
- Approved V4: Tawgod/Lightspeed:test/hc-foundation-combined-v4-20261124 @ b56d4f69332f768a66987668293088eb51a60ecc; combined CI 45442532299, 266/266. Manager latest handoff blob 67901444dd0d7951ccf9a8be65a92282d1b0eb9d recommends V5 combined validation (299 expected), NOT yet approved in baseline register. Do not branch from an unapproved V5 candidate.
- PR #83 feature/core-api-m1-20261124 @ 6722414245be56e138566beebcfcb0f19e2eef8e, V1 parent 71a1cd6e312ed52efc1e9af9da85db6b02e3756c; M1/M2 11 new tests incorporated in V2 (187/187).
- PR #85 feature/core-api-m3-v2-20261124 @ a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7, V2 parent 2365de8af4e8d69b162f6909d1f78be246e74fdf; M3 CI 45425826592 19/19 targeted (8 new), incorporated V3 (223/223).
- PR #89 feature/core-api-m4-v3-20261124 @ 0fabf06643c17ec5632168ffecf8339aa09279e5, V3 parent 098c9e51ea4c3449605ad6951baa8284e126e8d4; M4 CI 45440458686 12/12 targeted (11 new), five exact blobs included V4.
- PR #95 feature/core-api-m5-v4-20261124 @ c31c8d660baf81227293e3647df13b8d6ee21d76, V4 parent as above; exact compare 5 ahead/0 behind, 5 additive paths, no newer deltas after manager review. CI 45445470092 SUCCESS, job 138627907468 previously inspected 20/20 (8 new, 12 regression). All four PRs rechecked open/unmerged/mergeable at exact pins. No rerun. Historical source PRs #32/#33/#51 and manager #78 preserved; do not independently merge or cherry-pick.
- Current architecture: bounded GET/HEAD transport, strict continuation/filter integrity, safe core.v1 internal read envelope and correlation, existing remote idempotency/audit/Postgres candidates, V4 localTransactionCandidate, additive M5 localTransactionM5 and tests/fixtures/coreDisposablePg.mjs. All unmounted/offline candidates; no new production schema or runtime Security integration.
- Railway read-only metadata rechecked 2026-11-24: Hobby Corner project f7e91de7-43f6-472e-b4ca-46b0623f8e0e, production c562fbb2-8431-4beb-834d-6938b3a2ad10, lightspeed-api ed2adc5f-686b-4cc7-98d8-15e50b4efe95 latest deployment 288d5089-62d4-4f22-9c7f-8fdd26d8574d SUCCESS, branch integration/hobby-corner-consolidation commit 014a7a949fe570b756b48d8f59995c1b0a434859. Services listed: special-orders-test, timeclock, store-map, Postgres, Hobby-Corner-Rewards, Hobby-Corner-Discord-Bot. No runtime smoke tests, other service deployment/config inspection, secrets, business data or vendor calls. Legacy feature clients remain production dependencies; no Core milestone deployed. No Railway modifications.
- Manager consolidated Security register FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md blob 1306922eaf8f2a2e0c24e8f179fcc92b402b86db, management commit 8be131af231d04e598be446d90e9f5781ef779a3. Its Core source pin 07302ea7b3a40a5322627a02d54b7eabdb7f132e refers to unchanged cumulative inventory below; transition header only adds verification/coordination. Proposed aliases are not approved runtime mappings. Preserve wholesale cost visibility for all active employees, separate cost modification, all underlying grants across direct/indirect/bulk/automation paths, no service bypass. Security S2.1 separate; use current canonical approved decisions, not historical guesses.
- Inventory #94 @ 0819cb0f33a0b7c9f52446c454899ec3ade0fc92 and Purchasing #96 @ 9be3cf2def313e0ceedf5e07f1163c9eca28bcb5 rechecked open/mergeable/unmerged. Manager records 4 and 6 new PG tests respectively. Both use V4 M4 candidate with minimal domain-specific disposable adapters; actual composition with M5 not yet proven. No competing production adapter. Domain typed locks and revision checks must remain domain-owned.

## Successor next action / coordination gate
1. Verify latest approved baseline, manager and Security handoffs, exact branch pins, CI and Railway metadata before development. V5 candidate review is not approval; if V4 remains current, stop for manager reconciliation rather than duplicate M5 or launch combined CI independently. If a newer baseline is explicitly approved, verify included blobs and compare current workstream head, create independent branch from exact approved commit, carry only missing delta, target approved isolated branch in draft PR.
2. Next proposed scope (not a new approved milestone): coordinated M5 fixture adoption by Inventory/Purchasing, typed domain lock/read/write methods, authorization after domain locks AND immediately before commit, actor/resource/field/environment binding, safe result reprojection, immutable audit, canonical event fingerprint and unknown commit recovery. Manager must assign scope and coordinate interface first. No actual Security implementation or role grants.
3. Preserve distinction between local atomic rollback and remote vendor unknown outcome; no external side effects inside local transactions. Commit-ack tests simulated, no real network failure/restart proof. Scope prefix is not environment isolation. Explicit POST-for-read remains disabled pending exact vendor evidence and approval. Dependency manifest unlocked; coordinate lockfile/pinned Node/npm/npm ci with manager; minimize Actions, local tests where practical and batched remote validation.
4. Do not merge, deploy, mount routes, access live business/employee/customer/vendor/mail data, change grants, apply shared-environment migrations, execute production mutations or activate actual queue dispatch without explicit authorization. No archive action taken. Transition ready; unfinished work remains assigned to successor and manager/Security coordination.

## Canonical sources
- Management main: FOUNDATION_DEVELOPMENT_BASELINE.md, FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md, handoffs/foundation-manager.md, handoffs/TEMPLATE.md, SHARED_TOOL_DEPENDENCIES.md, LIGHTSPEED_SHARED_SERVICES.md, handoffs/lightspeed-shared-services.md, domain handoffs and current Security handoff.
- Application approved baseline source manifest docs/FOUNDATION_COMBINED_V4_SNAPSHOT.md; candidate docs/CORE_API_INTEGRATION_CONTRACT.md, docs/CORE_API_M3_SECURITY_COORDINATION.md, docs/CORE_API_M4_TRANSACTION_CONTRACT.md and [M5 adapter contract](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m5-v4-20261124/docs/CORE_API_M5_ADAPTER_CONTRACT.md).
- Preserve full existing implementation detail, permission register and historical evidence below.

# Core Shared API Foundation — V4 / M5 handoff

**Last verified:** 2026-11-24
**Status:** M5 additive offline contract and reusable disposable PG fixture validated (20/20); Security/UI inventory recorded; ready for manager reconciliation.

## Source
- Approved V4: Tawgod/Lightspeed:test/hc-foundation-combined-v4-20261124 @ b56d4f69332f768a66987668293088eb51a60ecc. Manager verified CI 45442532299, 266/266 passed.
- Prior PR #89 unchanged at 0fabf06643c17ec5632168ffecf8339aa09279e5; five blobs identical in V4; no newer delta; all branches/PRs preserved.
- Independent branch feature/core-api-m5-v4-20261124; draft [PR #95](https://github.com/Tawgod/Lightspeed/pull/95) targets V4; head c31c8d660baf81227293e3647df13b8d6ee21d76. Five additive files/commits; GitHub now reports mergeable, draft, open, unmerged.
- Added services/lightspeed/localTransactionM5.js, tests/fixtures/coreDisposablePg.mjs, tests/core-api-m5-postgres.test.mjs, docs/CORE_API_M5_ADAPTER_CONTRACT.md, .github/workflows/hc-core-api-m5.yml. Existing V4 interfaces unchanged.

## Implemented / Tested
- Opt-in M5 test-only transaction candidate: actor-bound fingerprint, same key across tools, different actor conflict, mandatory fresh result projection, reauthorization before claim/after claim/before output, exact fingerprint committed inspection after uncertain commit acknowledgement. No actual identity verification or grant registry.
- Reusable disposable PG helper: local hc_test only, random schema, atomic command/domain/outbox/audit, stable event ID deduplication, conflicting event rollback, audit UPDATE/DELETE/TRUNCATE rejection. No production schema/adapter or outbox dispatch.
- Eight new tests plus 12 existing M4/PG regression tests configured in one targeted Node22/PG16 workflow, eight-minute cap, no lifecycle scripts. Exact-head [CI 45445470092](https://github.com/Tawgod/Lightspeed/actions/runs/45445470092), job 138627907468, completed SUCCESS; independently reviewed logs 20/20 pass, zero fail/skip/cancel (eight new M5 and twelve existing regression tests). No additional CI run. Expected V4 + Core M5 alone 274, not combined tested. V4 prior 266 tests verified separately.
- No deployed environment, service change, live data, routes, shared migrations, real grants or mutations. No browser acceptance.
- Shared dependencies F01/F27/F28/F29/F30 and domain F02–F36; Inventory/Purchasing may use V4 offline seam; M5 review before adoption. [Adapter contract](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m5-v4-20261124/docs/CORE_API_M5_ADAPTER_CONTRACT.md).
- Limitations: actor/context and effect derivation trusted caller inputs, not real Security; scope prefix not isolation; projection callback must enforce approved read/field scopes; stored receipts must be minimal; post-commit failure needs safe outcome taxonomy. Commit-ack loss simulated, no actual network failure/restart/unknown record recovery; no automatic retry in same invocation, future retry/reconcile policy unresolved. Fixture outbox trusts server-supplied fingerprint, no delivery worker. Audit trigger not protection from DB owner. Domain row locks and resource-specific records need coordinated adapter methods. Existing dependency manifest unlocked; manager-owned Node/npm pin and lockfile review, no POST-for-read enablement.

## Security and administration UI dependencies (cumulative, proposed registry)
All operation identifiers below are **provisional**, not approved Security grants. Owner-approved rules only: all active employees may view wholesale costs under ordinary product access; modifying costs separately controlled; cross-tool underlying restrictions apply everywhere. Security owns roles, individual grant/deny precedence, identities, delegation, final naming and UI. Role suggestions are groupings, not assigned roles. Default R = suggested ordinary active employee read for job-relevant data; W = separately assigned operational capability, not automatically granted; M = restricted reviewer/manager; A = restricted technical administrator/operator; S = narrowly delegated service, never a bypass. Each listed identifier is independently assignable/restrictable except wholesale cost read must not be separately elevated. All rows inherit tenant and environment scope, direct API/server-side enforcement, all applicable indirect effects, bulk/import and queued/automation execution-time recheck. Approval is distinct from execution; exact approval thresholds/segregation owned by Security/business domain review. All entries need searchable UI label, description, role grouping, individual grant/restriction, scope selector, effective grant source, prerequisite/conflict warnings, expiry/revocation, audit/history and confirmed permission changes. No live enforcement inferred.

| Proposed canonical operation | UI label / description | Consumers including indirect flows | Suggested role/default; individual control | Additional scope and prerequisites/approval | Evidence / gaps |
|---|---|---|---|---|---|
| products.read | View/search products, identifiers and wholesale cost | Product Manager, Scanner, Special Orders, Ordering, Preorders/GW, PO Companion, Consignment, Inventory Count, Backroom, labels, Repairs, Waitlist, Store Map, RMS lookup | R; all active employees cost view; no elevated cost read grant | Product/variant/outlet, public/customer projection excludes wholesale; no anonymous access | M3/M4 synthetic; legacy routes unmapped |
| products.create | Create new product/variant | Product Manager, Scanner, Special Orders, Purchasing when applicable, Consignment, Preorders, Repairs, RMS imports | W; individually restrict across all tools | Exact identity, supplier and duplicate evidence; cost modify if setting cost, approval/execute as required | M4 seven representative paths; V4 Catalog fixtures; actual writers not converged |
| products.update | Edit existing item metadata | Same catalog consumers, Invoice Updates, RMS | W; separate from create | Target/version, allowed fields; cost/media/supplier changes require respective effects | V4 Catalog fixtures; live enforcement pending |
| products.delete | Delete/archive product (separate archive semantics to review) | Product Manager, migration/admin, indirect cleanup if ever supported | M; default off | Exact product/variant, dependent records, approval, no implicit update grant | Planned/unsupported; no writer |
| products.cost.modify | Modify wholesale cost | Product Manager, Scanner, Special Orders, Purchasing, Invoice Updates, RMS, Consignment if supported | M/W; separate individual restriction | Product/variant/supplier/outlet/currency, product update/create as applicable, reviewed changes | M4 synthetic deny; actual cost writer pending |
| products.price.modify; products.tax.modify | Edit retail/MSRP; edit tax classification | Product Manager, Special Orders, Scanner, Invoice Updates, migration | W/M; each separately controlled | Product/outlet/price list/tax field; product update and approval as applicable | Planned effect grants; actual coverage unverified |
| catalog.references.read; catalog.references.configure | View; maintain suppliers/brands/categories/tags/departments | Catalog, Ordering, Scanner, PO Companion, labels, RMS | R; M configure | Reference type/ID; separate create/update/archive decisions by Catalog | Domain evidence; registry unapproved |
| catalog.supplier-links.read; catalog.supplier-links.modify | View; manage supplier-product relationships | Catalog, Purchasing, Scanner, Special Orders, Preorders, PO Companion, Invoice Updates, RMS | R/W separately | Supplier/product/variant; exact IDs; product update if actual product changed | V4 domain fixtures; actual write absent |
| products.media.read; products.media.modify | View; manage product media/docs | Product Manager, Scanner, Special Orders, Consignment, Repairs, Preorders | R/W separately | Asset/product, approved file provenance; update grant where applicable | Domain projections; file integration pending |
| inventory.read; inventory.events.read | View stock; view stock-event history | Catalog, Scanner, Ordering, Special Orders, Inventory Count, Backroom, Returns, Repairs, Waitlist, Labels | R; event access job-scoped | Outlet/product, time interval, no raw customer info | M3 inventory fixture; vendor coverage unknown |
| count.observe; count.session.manage; count.review; count.adjust.approve; inventory.adjust.execute | Record count; open/close sessions; review variance; approve adjustment; execute stock adjustment | Inventory Count, Scanner, Backroom, Product Manager review, Priority Review, initial stock cutover | W/W/M/M/M each independent | Session/outlet/location/product, assignment/revision, reviewed evidence, execute fresh grant and approval | V4 Inventory synthetic; no live stock writer |
| restock.confirm; restock.task.manage; inventory.location.configure; reason.revise | Confirm restock; manage tasks; maintain shelf locations; revise reason registry | Backroom, Inventory Count, Scanner, Product Manager, Store Map, labels, review queue | W/W/M/M independently | Task/outlet/shelf/reason revision; zero moved reason; no stock/cost effect implied | M4 local PG and Inventory M6 fixtures; M5 adapter pending |
| inventory.review.read; inventory.review.resolve | View discrepancy; resolve review | Inventory, Backroom, Priority Review, Product Manager | R/M separately | Outlet/task/review; resolution not stock execution | Synthetic/planned |
| inventory.reserve; inventory.release; inventory.receive; inventory.transfer | Reserve; release; receive; transfer stock | Special Orders, Ordering, Preorders, PO Companion context, Repairs, Inventory, Backroom | W/M separate | Outlet/product/order/PO; verified physical evidence and applicable approval; invoice not receipt | Existing workflow fragments; no shared enforcement |
| customers.read; customers.contact.read | View minimal customer identity; view contact details | Special Orders, Preorders, Consignment, Repairs, Reservations, Rewards, Back-in-Stock, Split/Recall | R job-scoped; contact separately restricted | Customer/field/purpose/audience; no raw public data | M3 minimal projection; actual contact grant unapproved |
| customers.create; customers.update; customers.link; customers.consent.modify | Create; edit; link accounts; maintain consent | Same customer tools, Discord/Rewards sync, portal | W separately, linkage/consent sensitive | Exact customer/identity provider, verified consent; no auto-link | Domain evidence only; actual writes not approved |
| sales.read; sales.create; sales.update; sales.return; sales.void | View; create; edit; return; void sales/work orders | Special Orders, Preorders, Split/Recall, Consignment, Repairs, Rewards, Inventory evidence | R/W/W/M/M separate | Sale/customer/outlet, payment and stock effects need distinct grants and evidence, approval for return/void | M3 sales projection; domain evidence; real mutation pending |
| payments.collect; payments.refund; deposits.modify | Collect/refund payments; manage deposits | Special Orders, Preorders, Split/Recall, Repairs, Reservations if paid | W/M/W separately | Amount/currency/sale/outlet, approval/financial evidence; no implied inventory effect | Planned/legacy fragments; domain review |
| fulfillments.read; fulfillments.update | View; record pickup/fulfillment | Special Orders, Preorders, Split/Recall, Consignment, Repairs, notification workers | R/W | Sale/line/outlet, separate receiving/stock grants if effects | Domain evidence; no real writer |
| store-credit.read; store-credit.post; store-credit.reverse | View balance; post credit; reverse credit | Consignment, Split/Recall, Special Orders, Rewards context, customer portal | R job-scoped/M/M | Customer/amount/currency, original transaction, approval, distinct financial effects | Domain evidence; live posting absent |
| purchase-orders.read; purchase-orders.create; purchase-orders.update; purchase-orders.approve; purchase-orders.execute | View; create; edit OPEN PO; approve; execute approved PO change | Product Manager, Special Orders, Ordering, Preorders, PO Companion, Scanner, Invoice Updates, Repairs, labels, Consignment sourcing | R/W/W/M/W restricted individually | Supplier/outlet/PO/status/revision, identity, approval and fresh execution; no receiving or product-create by implication | M3 PO projection; V4 Purchasing workflow tests; real writer absent |
| invoices.read; invoices.ingest; invoices.review; invoices.approve | View; ingest supplier document; review; approve reconciliation | Invoice Updates, Purchasing, Scanner, Ordering, PO Companion, Product Manager, Preorders | R job-scoped/S or W/W/M | Supplier/document/mailbox/revision, file provenance, no receiving, actual PO/cost/product effects separately granted | V4 synthetic workflow; P-07 durable fixture pending |
| notifications.read; notifications.send; notifications.configure | View delivery status; send; configure notifications | Discord, Rewards, Special Orders, Preorders, Consignment, Waitlist, Repairs, Reservations, Priority Review | R/W or S/M individually | Channel/customer/consent/template, delegated grant; no arbitrary recipient | Existing bot fragments; shared outbox delivery pending |
| labels.print; labels.configure | Print labels; configure templates | Avery, Scanner, PO Companion, Inventory, Backroom, Catalog, Special Orders, Consignment | W/M independently | Printer/template/outlet, underlying data reads; no stock mutation | Existing print backend; shared grant unverified |
| files.read; files.attach; files.delete | View; attach; remove evidence documents | Product Manager, Scanner, Invoice Updates, Consignment, Repairs | R/W/M separately | File/resource/type/size/provenance, underlying record grant; approval for deletion | F35 planned; no shared enforcement |
| workflows.read; workflows.create; workflows.update; workflows.approve; workflows.execute; workflows.assign | View/create/edit/review/execute/assign drafts and work queues | All workflow tools, Priority Review, dashboard, imports, automation | R/W/W/M/W/M individually | Workflow/assignment/revision, all underlying effect grants, approval not execution | M4 synthetic workflow.execute cannot replace product create; actual registry pending |
| jobs.read; jobs.configure; jobs.execute; jobs.cancel | View jobs; configure schedules; run; cancel jobs | Workers, Discord, Rewards, Preorders, Invoice Updates, Backroom, dashboard | R limited/A/S or W/A separately | Job type/service/environment, narrow delegated underlying grants, cancellation semantics | Planned shared jobs; no dispatch |
| outbox.inspect; outbox.retry; outbox.cancel | Inspect event; retry approved delivery; cancel pending event | All persistent tools, notifications, dashboard, technical operator | A/S restricted separately | Event/channel/tenant, fresh underlying grants and dedupe; retry not arbitrary mutation replay | M5 dedupe fixture, no actual dispatch |
| transactions.inspect; transactions.reconcile | Inspect uncertain operation metadata; reconcile outcome | All business tools via authorized support/admin, Inventory/Purchasing, remote mutations | A/M separately | Operation/key/actor/resource, no raw payload or lease; verified readback, dual review proposed | Existing PG inspect; M5 exact commit fixture; recovery policy pending |
| audit.read; audit.export | Read audit metadata; export authorized history | Manager/admin, Security review, all tool incident workflows | M/A restricted separately | Actor/operation/date/resource, redacted fields; export purpose/approval | Existing append-only PG and M5 fixture; no public reader/export |
| data.export; imports.preview; imports.approve; imports.execute | Export approved business data; preview/approve/execute import | RMS migration, Product Manager CSV, Scanner bulk, Inventory, Purchasing, admin | M/W/M/M separately | Source manifest, data type, fields, environment, all underlying operations and approval, no bypass | F33 existing migration special safeguards; shared mapping unverified |
| integrations.configure; integrations.sync; integrations.health.read | Configure connectors; sync; view integration health | Vendor portals, Scanner, Ordering, Invoice Updates, Rewards, Discord, dashboard | A/S/R limited separately | Connector/source/tenant, no secrets display, underlying data/effect grants; approval for activation | F30/F34 planned, legacy connectors not mapped |
| reservations.read; reservations.create; reservations.update; reservations.cancel; reservations.configure | View/create/edit/cancel bookings; configure venues | Game Room/Events, future pickup scheduling | R/W/W/W/M separately | Venue/resource/date/customer; payment grants if needed | F36 planned; domain owner to confirm |
| dashboard.read; dashboard.configure | View authorized aggregate issues; configure dashboard | All tools, Store Operations/Admin | R/M | Only authorized underlying records and links; no expanded access by aggregate | F32 partial legacy; shared projection pending |

### Administration UI and enforcement dependencies
- Group by business capability, not separate permission per tool. Search names/descriptions/aliases, list consuming tools and indirect effects, show proposed vs approved registry status, explain why access allowed/denied and role/individual source. Role bundles (employee, operational staff, reviewer/manager, technical operator, delegated service) suggestions only; Security decides assignments and precedence.
- Individually configurable grants/restrictions per operation and scopes (tenant/environment, outlet/location, product/variant/supplier, customer/record, fields, workflow revision/assignment, service/connector, amount/date when applicable). UI must show inherited access, explicit restrictions, expiry/revocation and conflicts; preview effective access across every consumer, confirm and audit changes; do not expose credentials or raw sensitive audit data.
- Prerequisite/effect graph: create/update cost requires separate modification; import/automation/approval cannot replace underlying effects; approval vs execute separate; invoice not receiving; refund/credit vs physical stock independent; label print and aggregate read no mutation implication; outbox retry requires fresh delegated grant. Security decides exact operation names and approval rules. Backend denies unavailable/ambiguous decisions; UI disabling only complementary.
- Core internal primitives transport, pagination, automatic audit append, idempotency claim/complete and outbox insert are not independently user-grantable bypasses; inherit authorized parent effect. Audit mutation/delete should not be a normal permission. Security role/admin/identity management operations owned entirely by Security, not duplicated. Public/customer scopes isolated from employee data.
- Release evidence required per actual endpoint: allow/deny, revoked/expired, resource/field/environment mismatch, cross-tool/direct/bulk/automation and delegated bypass tests, fresh result projection, audit outcome and UI effective-access consistency. M3/M4 and V4 combined tests are synthetic/disposable only. M5 fixture evidence validated in CI 45445470092; actual enforcement remains unverified. Actual legacy route mapping incomplete, notably migration, Rewards Python client, Discord workers, existing server routes, planned Consignment/Repairs/Reservations and future tools; domain owners expand inventory and manager deduplicates names. No actual role/grant/UI changes.

## Next coordination gate
Manager/Inventory/Purchasing review M5 additive adapter and shared domain locking methods before adoption; Security reviews cumulative inventory, actor binding, approved operation/role/scope/field/expiry semantics. PR #95 exact-head CI and mergeability verified. Inventory M7 PR #94 @ 0819cb0f33a0b7c9f52446c454899ec3ade0fc92 reports 4/4 disposable PG tests, using V4 contract and domain-specific locks. Inventory explicitly identifies missing reauthorization after domain row locks: M5 currently rechecks after command claim, not after domain locks, so coordinate an explicit execution-boundary callback/check before consumer adoption. Do not claim M5 solves this. Inventory proposes inventory.snapshot.read alias vs Core inventory.read; manager/Security deduplicate. Purchasing canonical handoff still at V3 P-06 at inspection; P-07 integration not yet verified, no claim of compatibility. Reconcile domain adapters against M5 without competing durable implementation. Combined regression manager-owned. STOP at coordination gate; no further independent changes or CI needed for current assignment. No production adapter, live migration, gateway, POST-for-read, queue delivery, role assignment or deployment authorized.

## Historical handoff
# Core Shared API Foundation — V3 / M4 handoff

**Last verified:** 2026-11-24
**Status:** M4 offline local transaction and cross-tool capability candidate validated; targeted disposable PostgreSQL CI 12/12 PASS; ready for Foundation Manager reconciliation.

## Source
- Approved V3: Tawgod/Lightspeed:test/hc-foundation-combined-v3-20261124 @ 098c9e51ea4c3449605ad6951baa8284e126e8d4. Combined CI 45436836762 verified by manager: 223/223 passed.
- PR #85 unchanged at a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7; all three included blobs identical in V3. No newer work to carry; previous PRs/branches preserved.
- Independent branch feature/core-api-m4-v3-20261124, draft [PR #89](https://github.com/Tawgod/Lightspeed/pull/89) targets V3. Head 0fabf06643c17ec5632168ffecf8339aa09279e5; compare verified 5 ahead/0 behind, five additive files, zero modified/deleted inherited paths. GitHub now reports mergeable, draft, open, unmerged at exact head.
- Added services/lightspeed/localTransactionCandidate.js, tests/core-api-m4-capabilities.test.mjs, tests/core-api-m4-postgres.test.mjs, docs/CORE_API_M4_TRANSACTION_CONTRACT.md, .github/workflows/hc-core-api-m4.yml.

## Implemented
- Proposed test-scope-only local transaction orchestration with injected transaction/authorize/auditDenied adapters, stable operation+payload fingerprint, authorization before transaction and after claim/lock including replay, transactional domain/outbox/audit/result contract; denial audit outside rollback. No actual Security implementation or production adapter. Required operations and context must be derived by trusted server code. Existing remote vendor mutation audit/idempotency unchanged.
- Four disposable PG fixture tests: concurrent duplicate/replay and conflict; rollback of domain/outbox/claim/audit; denial after claim; revoked grant cannot replay. Fixture schemas created/dropped in explicitly local hc_test only; no migration or live database.
- Seven synthetic capability tests: representative Product Manager, Scanner, Special Orders, Purchasing, direct API, bulk import and automation share product-create restriction; tool grant not substitute; composed grants; unavailable/ambiguous/missing/expired synthetic verdict; all active employees ordinary product cost read, separate cost modify; anonymous/inactive denied; production scope rejected. No actual registry or live endpoint enforcement implied.
- [M4 proposed transaction contract](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m4-v3-20261124/docs/CORE_API_M4_TRANSACTION_CONTRACT.md) defines Inventory count/restock/reason revision seam, atomic review/outbox/audit, transaction locks, no remote side effects; Inventory may use test-only injected interface pending review. Domain state and record shapes remain Inventory-owned.
- Reproducibility remains manager-coordinated lockfile review; no manifest/lockfile change. POST-for-read remains disabled.

## Testing and limitations
- One targeted PR workflow, 8-minute cap, Node 22 and disposable PostgreSQL 16, existing manifest installation without lifecycle scripts. Verified exact-head [CI 45440458686](https://github.com/Tawgod/Lightspeed/actions/runs/45440458686), job 138609809777, completed SUCCESS. Actual logs: 12 tests, 12 pass, 0 fail/skip/cancel; 7 capability tests, 4 disposable local PG tests, 1 existing PG regression. No extra rerun launched. Combined V3 223/223 remains separate baseline evidence; 234 expected with Core M4 alone, not combined-tested.
- Candidate limitations: trusted callback/operations supplied by server, test-only scope guard is not actual environment isolation, no approved Security actor/resource/field binding, no real durable transaction adapter or immutable local audit schema, no outbox delivery worker, commit acknowledgement uncertainty and replay safe projections require design review. Fixture denial audit demonstrates metadata only; actual actor attribution and durable audit are pending. No verified live endpoint coverage, no actual expiration evaluation outside synthetic Security decisions.
- No merge, deployment, route mounting, production data, live vendor calls, migrations, stock effects or real grants.

## Next coordination gate
1. Manager and Inventory review adapter interface before consumer adoption. PR #89 exact-head CI and mergeability verified. Inventory M6 handoff reviewed: PR #91 @ 7eecb5d2fd92f896402398d36167bd3779d95c0e reports 7/7 local synthetic tests and only additive tests. Core and Inventory align on count.observe/restock.confirm/reason.revise candidate operations, atomic domain/review/outbox/audit and fresh replay authorization. Inventory's task/session/reason locks, actor-bound replay, task closure replay, immutable audit, idempotent consumer and unknown commit recovery remain contract decisions; no actual consumer adapter or competing durable implementation. Manager should reconcile both exact heads.
2. Security approves canonical operation registry, actor/resource/field/environment binding and execution-time expiry/revocation; align all consumer entrypoints (including indirect imports, automation and queued work), ordinary employee wholesale cost viewing and separate modification. No tool-level bypass.
3. Review immutable audit, commit uncertainty, outbox dispatch semantics, safe replay and reproducible dependencies before actual durable integration. No production or public gateway activation.
4. STOP: targeted tests verified, assigned offline deliverable complete and ready for manager reconciliation. Full combined regression remains manager-owned. No further application edits or CI runs required at this gate.

## Historical handoff
# Core Shared API Foundation — Current Handoff

**Last verified:** 2026-11-24
**Status:** V2 reconciled; M3 offline integration fixtures and coordination proposal validated (19/19); ready for Foundation Manager reconciliation; actual admission blocked on Security.

## Source
- Approved V2 Tawgod/Lightspeed:test/hc-foundation-combined-20261124 @ 2365de8af4e8d69b162f6909d1f78be246e74fdf.
- Previous PR #83 head 6722414245be56e138566beebcfcb0f19e2eef8e unchanged; all five file blobs identical in V2; no newer delta to carry. Previous branches and PR preserved.
- Fresh branch feature/core-api-m3-v2-20261124; draft [PR #85](https://github.com/Tawgod/Lightspeed/pull/85) targets V2, head a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7. Compare verified 3 ahead, 0 behind, exactly three additive files; PR reports mergeable.
- Added tests/core-api-m3-integration.test.mjs (8 test cases), docs/CORE_API_M3_SECURITY_COORDINATION.md, .github/workflows/hc-core-api-m3.yml. No runtime/domain/security/database edits.

## Implementation and testing
- V2 CI 45423638373 verified by manager 187/187 including real disposable PostgreSQL; PR #83 included and accepted internally.
- M3 fixtures compose existing executor, transport and domain readers for customer search/sales, product exact lookup, inventory observation and purchase order details; test-only per-call trace closure; synthetic deny and malformed-response tests; concurrent correlation isolation. Catalog allowlist is test-only; no new production projection policy.
- Targeted Node 22 workflow runs existing 11 Core tests plus 8 M3 tests (19 expected) without npm install; capped at 3 minutes. Verified exact-head CI [45425826592](https://github.com/Tawgod/Lightspeed/actions/runs/45425826592), job 138557429650: completed SUCCESS, log summary 19 tests, 19 pass, 0 fail/cancelled/skipped. PR #85 remains mergeable, draft, unmerged at a50822f2d0a8b6ec7184d54487ef9b0c9a01e9a7.
- No live vendor traffic, deployment, route mounting, migration, production records or changes, actual permission grants or feature activation.

## Coordination gates
- Review [M3 Security coordination proposal](https://github.com/Tawgod/Lightspeed/blob/feature/core-api-m3-v2-20261124/docs/CORE_API_M3_SECURITY_COORDINATION.md). Security exclusively owns active actor, exact grants, resource/field scope, expiry and revocation; boolean seam insufficient for conveying restrictions, no actual adapter yet. Synthetic fixtures are not Security decisions.
- Domain owners must agree safe field projections and correlation propagation; no public contract edits. Inventory plain error with code vs typed incomplete error requires coordinated taxonomy decision.
- POST-for-read remains proposal only, candidate path/schema unverified. Obtain exact official API evidence from Inventory before considering implementation; default POST denial unchanged.
- Dependency reproducibility: V2 has no lockfile; propose pinned Node/npm and reviewed generated lockfile, npm ci and manager-controlled deployment compatibility review. No manifest or lock changes made.
- Next: Foundation Manager reconcile exact PR #85 head (three additive files, no runtime changes) with other V2 workstream heads. Security review resource and field constraints before actual integration. M3 offline deliverable complete; M3 actual admission and M4 acceptance not authorized. No further CI rerun or code change needed at this gate. Stop for reconciliation; no merge/deploy without authorization.

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
