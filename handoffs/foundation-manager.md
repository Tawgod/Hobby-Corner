# Foundation Manager — Current Handoff
**Last verified:** 2026-11-24
**Status:** In Development — reconciled source candidate; validation pending.

## Source
- Management repository: Tawgod/Hobby-Corner:main.
- Coordination register proposal: [management PR #4](https://github.com/Tawgod/Hobby-Corner/pull/4), unmerged; this canonical handoff supersedes its older proposed handoff text only.
- Application: Tawgod/Lightspeed:integration/hobby-corner-consolidation @ 014a7a949fe570b756b48d8f59995c1b0a434859.
- Reconciliation branch: feature/hc-foundation-reconcile-20261124.
- Draft [PR #78](https://github.com/Tawgod/Lightspeed/pull/78), exact head bc1a9374cfb9eda411262f08603fa796a931612a.
- Source PR #32 d2a90b49e0f58104f17391c1f67623c256950326, #33 38c6b1fe7e2e623aeefec55ab28aecc896011f1e, #51 199fa0eefee5f27c844ad879ba291e035a4a299d. All remain open; do not close or merge until verified.

## Implemented
- GitHub compares: #32 302 ahead/3 behind production, #33 288 ahead/3 behind, #33 vs #32 258 ahead/272 behind. Selective reconciliation avoids mass security overlap.
- 25 additive files, 18 business service modules, four test files, inert SQL, unmounted gateway, reconciliation documentation. Existing production files untouched.
- Identical Phase 1/2 transport, audit, idempotency, PostgreSQL, mutations and product identity blobs verified. Phase 2 paginated customer/catalog versions selected.
- Incorporated exact PR #51 client Content-Length regex fix and inserted its two targeted tests without replacing other existing test cases. See core-api-foundation.md for original workstream finding.
- No security implementation or broad canLookup permission matrix copied; generic legacy adapter/router retained unmounted for tests only.

## Tested
- Latest GitHub compare: PR #78 head two commits ahead, zero behind; 25 added files, no changed/deleted baseline files. GitHub reports mergeable, draft, open.
- Automated tests: NOT RUN; local checkout blocked by DNS resolution. No fresh CI, no live tenant or browser acceptance. Existing test files must run offline; PostgreSQL tests only disposable DB.
- Production/staging runtime not changed; no current runtime smoke test.

## Deployed
- None. Production-connected branch unchanged; no database schema applied, no service/permission change, no live data reads or writes.

## Shared dependencies
- Core API owns subsequent transport/version/envelope integration; Security exclusively owns actual actor/grant decisions.
- PR #78 can serve as common proposed development source pin after validation; no domain workstream should independently import #32/#33.
- Domain owners retain product/catalog, inventory, customer/sales, supplier/PO semantics.
- No gateway mounting: old adapter promotes omitted active to true, and old router needs exact grants and sensitive response projection.
- Remaining API gaps: pagination coverage, inactive exact match completeness, stock event/outlet definitions, sales pagination, PO line identity, contract schema.

## Decisions / next actions
1. Core API validates PR #78 exact head with offline unit/reader/adapter tests and disposable PG tests; coordinate minimal CI to avoid wasting minutes. Preserve PR #51 regression.
2. Core and Security agree explicit active identity and exact grants; review proposed core.v1 error envelope with manager before freeze. Keep gateway unmounted until accepted.
3. Domain workstreams may audit against pinned candidate, then submit nonoverlapping additive changes once validated; Inventory event-source investigation can proceed independently.
4. Update management PR #4 to avoid collision with this new canonical handoff prior to eventual authorized merge. Do not treat #78 as accepted or close source PRs yet.

## Restrictions
No merges, deploys, live vendor mutations, migration, staff grants, production records, or duplicate identity systems without explicit approval.
