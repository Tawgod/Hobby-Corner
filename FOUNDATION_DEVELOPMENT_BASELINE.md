# Shared business foundation — approved development baseline V2

**Last verified:** 2026-11-24
**Owner:** Foundation Manager
**Status:** Accepted for isolated development and offline tests only. NOT approved for merge, deployment, live vendor traffic or database migration.

## Canonical source pin
- Repository: Tawgod/Lightspeed
- V2 branch: test/hc-foundation-combined-20261124
- Exact approved V2 commit: 2365de8af4e8d69b162f6909d1f78be246e74fdf
- [Combined validation run 45423638373](https://github.com/Tawgod/Lightspeed/actions/runs/45423638373): SUCCESS at exact V2 commit, 187/187 passed, zero failures, skipped or cancelled; real disposable PostgreSQL concurrency, replay and immutable audit passed. 19 test files, syntax and unmounted gateway checks passed.
- V1 remains PR #78 @ 71a1cd6e312ed52efc1e9af9da85db6b02e3756c, CI 45414393938 (51/51), unchanged.
- Production-connected integration baseline remains integration/hobby-corner-consolidation @ 014a7a949fe570b756b48d8f59995c1b0a434859 (last verified previous review).
- V2 contains 38 nonoverlapping exact workstream file deltas plus combined workflow and source manifest. No existing PR merged. See docs/FOUNDATION_COMBINED_TEST_SNAPSHOT.md on V2.

## Included workstream heads (historical pins, not moving refs)
| PR | Owner | Exact included commit |
|---|---|---|
| #79 | Product & Catalog | ba2d2f4d8f8e355f1c4465a57067f7fc1edf6859 |
| #80 | Inventory | 1d6187e01241c3e47c8fc3167d085dca9386a41f |
| #81 | Customer & Sales | 1c979a7d6a02d8e974b7f8af1a3591a3c2835028 |
| #82 | Purchasing & Suppliers | a2096345709ac1a4a1113362d6bf8123a71227ad |
| #83 | Core API | 6722414245be56e138566beebcfcb0f19e2eef8e |

## Rules for next workstream milestones
1. Read this file, SHARED_TOOL_DEPENDENCIES.md, your current handoff and V2 source manifest. Create a fresh independent next-milestone branch from exact V2 SHA; compare any newer existing work against the included head and selectively carry forward only changes not already present. Preserve old branches/PRs; do not force-push, rebase or duplicate already included work.
2. New draft PRs target test/hc-foundation-combined-20261124 for manager review; not production or old V1. Manager alone coordinates baseline changes. No merges without explicit authorization.
3. Keep existing exported interfaces compatible; coordinate any breaking change first. Core owns transport, readCollection, coreReadContract, audit/idempotency and shared integration surfaces. Domain owners retain their files. Security exclusively owns identity, authentication, exact operation grants and permission decisions.
4. Adopt core.v1 read envelope as internal integration candidate, not public release or Security acceptance. Use explicit injected authorization seam, safe projections and correlation where supported; no implicit grants or raw customer/cost data exposure. Mutation outcome contracts separate.
5. Offline fixtures and tests only. No live vendor traffic, actual feature switches, route mounting, migrations, production data, grants, deploys or production writes. Synthetic mutation harnesses remain non-executable in production. Minimize CI by testing changed suites locally where practical and batching remote validation. Update canonical handoff with exact branch/head, tests, dependencies, deployment and next action.
6. Original PRs #32/#33/#51/#78–#83 remain intact, pending manager disposition. Management PR #4 requires reconciliation with canonical handoff before eventual authorized merge.

## Next assignments
| Owner | Authorized next scope (offline only) | Stop gate |
|---|---|---|
| Core API | M3: coordinate Security-owned exact-grant adapter, safe read envelope/correlation integration fixtures across domains; document precise POST-for-read proposal only; evaluate reproducible dependencies | Security acceptance before actual admission; manager review before changing shared public interfaces or enabling POST |
| Product & Catalog | M5 follow-through: Product Manager shadow parity fixtures, field-level cost/PII projection and supplier mapping compatibility with Purchasing; no live switch | M6 actual create/update execution requires separate authorization |
| Inventory | M5: persistent count/restock session and configurable reason registry design, transaction/outbox/idempotency and review queue fixtures; independent shelf IDs, Store Map optional future feature; zero moved requires reason and shortage/surplus review flags | No migrations or stock effects; trusted task and event evidence required |
| Customer & Sales | M5: reusable customer identity/linkage/consent read model and offline Special Orders adapter parity; preserve first-page and paginated search for future features, resolve malformed-response behavior with Core | No automatic linking, creation, actual route change or credit posting |
| Purchasing & Suppliers | P-05: provider-neutral invoice/mail document evidence adapter contracts and fixtures; exact supplier links with Catalog, no physical receipt inference, preserve P-04 synthetic harness | No live mailbox or vendor reads/writes; actual durable or vendor mutation execution requires separate approval |

## Remaining gates
- Combined regression passes, but full cross-domain workflow scenarios, real vendor shapes/coverage, browser acceptance, exact Security grants and deployment readiness remain unverified.
- Core/Security must coordinate approved identity and grant contract before mounted gateway or controlled test tenant acceptance. Test environment preparation requires verifying isolation from existing production and unrelated staged Railway changes; no deploy authorized by this baseline.
- Existing dependency manifest has no lockfile; test installation not fully reproducible.
- Manager handoff: handoffs/foundation-manager.md.
