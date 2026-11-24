# Product & Catalog Foundation — Current Handoff

**Last verified:** 2026-11-24  
**Status:** M5 offline consumer preparation and combined catalog CI PASS; manager reconciliation gate  
**Owner:** Product & Catalog Foundation development conversation  
**Coordinator:** Hobby Corner Foundation Manager  
**Safety:** No production product writes, deploys, merges, or DB migrations authorized.

## M5 checkpoint — 2026-11-24 (current; manager reconciliation requested)

**Implementation:** offline consumer preparation committed; **combined catalog CI PASS 43/43**; actual consumer integration blocked pending manager/Core/Security and tenant acceptance. **Not deployed.**
- Independent branch `feature/hc-product-catalog-m1-20261124`, [draft PR #79](https://github.com/Tawgod/Lightspeed/pull/79), exact tested head `ba2d2f4d8f8e355f1c4465a57067f7fc1edf6859`, parent M4 `6e3ed12d9d965d703a9b75fd85e2961e96da2d09`, approved common baseline `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`. Compare: 6 ahead, 0 behind, 15 changed files, 0 deleted baseline lines. PR open/draft/unmerged/mergeable=true at check.
- Added services/lightspeed/productCatalogProjection.js with projectCatalogConsumerView composing existing typed identity, supplier links, prices, catalog references and asset inspectors; explicit target product/variant, per-section completeness, unresolved canonical reference checks, no product inferred from ancillary evidence, no raw payload/asset location/provenance passthrough. Added tests/product-catalog-m5.test.mjs and docs/PRODUCT_CATALOG_M5.md. Existing transport, product readers, matcher, feature routes and writer unchanged.
- [CI 45421919643](https://github.com/Tawgod/Lightspeed/actions/runs/45421919643) completed SUCCESS for exact head; job 138543441467 logs independently inspected: 43 tests, 43 pass, 0 fail/cancel/skip. M1 8, M2 8, M3 10, M4 8, M5 9; source syntax passed. Existing branch-only 3-minute workflow updated, no dependency install. Full integrated/feature regression not executed.
- Reviewed Core PR #83, Purchasing PR #82 P-03 and manager handoffs; no protected files changed. No public DTO/permission contract approval inferred. Current output is internal and includes cost amounts and identifiers; do not directly expose to browser. Comment in projection describing exclusion of cost observations refers to detailed observations, not cost amounts. Requires explicit field permission projection. Per-section reference coverage reflects list validation, not all target associations; unresolved associations invalidate overall completeness. Metadata and candidate values can be present while incomplete and must not be treated as authoritative. No tenant/version coherence, authoritative pagination or live vendor mapping proved. No real feature parity comparison performed.
- **Manager reconciliation queue:** review/freeze domain DTOs and Core envelope, agree authoritative coverage and exact grants with Security, review supplier mapping/price scope with Purchasing; reconcile PR #79 with #80/#82/#83 and other domain heads; run integrated suite; obtain explicit test-tenant read scope and feature-owner coordination. Product Manager PR #28 first shadow comparison (exact ID/variant, active state, price, primary supplier, slots), then PO Companion #37 (product/supplier IDs only; never receiving); legacy routes stay unchanged until authorized. Catalog owns canonical supplier links; Purchasing owns PO/invoice evidence. No mutation inference.
- **Stop gate:** M5 offline preparation complete, actual M5 consumer activation and M6 controlled create/update execution require separate approval and accepted Core/Security contracts. No merges, deployments, live reads/writes, migrations, Drive retrieval, permissions or route mounting authorized or performed. User plans to run Foundation Manager reconciliation next.

## M4 checkpoint — 2026-11-24 (historical)

**Implementation:** committed; **combined catalog CI PASS 34/34**; integration acceptance pending; **not deployed**.
- Independent branch `feature/hc-product-catalog-m1-20261124`, [draft PR #79](https://github.com/Tawgod/Lightspeed/pull/79), tested head `6e3ed12d9d965d703a9b75fd85e2961e96da2d09`, parent M3 `d8ccdb60a766b86630944327798235df5035d0c6`. Approved baseline `71a1cd6e312ed52efc1e9af9da85db6b02e3756c` unchanged. Compare: 5 ahead, 0 behind, 12 changed files total, zero deleted lines relative to baseline. PR draft/open/unmerged, mergeable=true at recheck.
- Added inspectProductAssets to catalog.js (explicit product/variant scope, image slots/roles, manual/document references, opaque Drive/storage IDs, source-provenance timestamps, nullable missing/unknown availability, conflict/duplicate/primary diagnostics). HTTPS references require trusted exact host allowlist and canonical URL without credentials/query/fragment/non-default port. No automatic parent fallback or primary promotion. No live fetch, upload, asset assignment, or permission.
- Added tests/product-catalog-m4.test.mjs and docs/PRODUCT_CATALOG_M4.md; updated existing branch-only CI to include M4, no dependency installation.
- [GitHub Actions run 45419652623](https://github.com/Tawgod/Lightspeed/actions/runs/45419652623) completed SUCCESS on exact head; job 138535349889 logs independently verified: 34 tests, 34 passed, 0 failed/cancelled/skipped; M1 8, M2 8, M3 10, M4 8; syntax checks passed. Full shared foundation, Core API, Scanner and consumer integration regression still pending.
- Reviewed approved baseline, manager/Core and Product Manager handoffs. No external contract freeze or Security grant acceptance documented. Existing feature consumers, transport, router, matcher and writer unchanged. No other workstream files modified.
- Limitations/decisions: normalized single-tenant offline metadata only; complete=true is trusted external evidence, not proven by vendor API. No verified real vendor asset shapes, Drive matching, availability probing, content inspection, filename-based matching or asset upload proposals/execution. URL validation is metadata screening only, not SSRF protection or authorization; future fetch requires separate approved resolver with DNS/redirect/content controls. Signed/query-bearing URLs deliberately excluded; no guessed primary or parent inheritance. Missing/unknown availability is evidence, not a network check.
- M5 gate: offline consumer parity preparation may proceed separately, but actual shared consumer integration and test-tenant reads require manager-approved DTO/coverage, Core/Security grant seam acceptance, explicit test-tenant read approval and owning feature coordination. Recommend Product Manager first (read-only, no feature writes), then PO Companion with Purchasing coordination; preserve current feature response shapes and shadow comparison. No merges, deployments, vendor traffic, database migration or production writes authorized.

## M3 checkpoint — 2026-11-24 (historical)

**Implementation:** committed; **combined catalog CI PASS 26/26**; integration acceptance pending; **not deployed**.
- Continued branch `feature/hc-product-catalog-m1-20261124` and [draft PR #79](https://github.com/Tawgod/Lightspeed/pull/79) targeting reconciliation branch, not production. M3 source commit `7366967d47a36d6645c7c051ee217a4c7982543a`; exact tested head `d8ccdb60a766b86630944327798235df5035d0c6` (branch-only CI commit). Approved parent `71a1cd6e312ed52efc1e9af9da85db6b02e3756c` unchanged. Compare: 4 ahead, 0 behind, 10 changed files total, zero deletions. PR open/draft/unmerged, GitHub mergeable=true at verification.
- Added internal pure functions to existing catalog.js: resolveSupplierIdentity (exact source-scoped aliases, verified canonical IDs, ambiguity, provenance), inspectSupplierProductLinks (product/variant/supplier scope, exact supplier SKU, nullable primary, conflict diagnostics, no promotion), inspectCatalogPrices (independent COST/MSRP/RETAIL decimal strings, currency, supplier/outlet scope, evidence timestamps, null unknown, conflict review), inspectCatalogReferences (six explicit flat supplier/brand/manufacturer/department/category/tag reference lists, exact unique IDs, missing/malformed list diagnostics, existing hierarchy inspector reuse).
- Existing catalog readers, legacy product matcher, production writer, shared gateway, transport and other workstream files unchanged. Added tests/product-catalog-m3.test.mjs and docs/PRODUCT_CATALOG_M3.md.
- [GitHub Actions run 45417445330](https://github.com/Tawgod/Lightspeed/actions/runs/45417445330), exact tested head above, job 138527429764 completed SUCCESS; job log independently read: 26 tests, 26 pass, 0 fail, 0 cancelled, 0 skipped; M1 (8), M2 (8), M3 (10), syntax checks PASS. Branch-specific .github/workflows/hc-product-catalog-offline.yml uses Node 22, no npm installation, read-only repository access, 3-minute timeout; one narrow CI run. Full shared foundation, Core API, Scanner and consumer regression suites not executed in this milestone.
- Coordination: reviewed current Purchasing P-01 PR #82 handoff and Core API M1 PR #83 handoff, plus Foundation Manager approved baseline. Purchasing owns shipping alias evidence and PO/invoice workflows; Catalog owns canonical supplier relationships. Current projections are internal drafts, not a frozen shared API DTO. Manager/Purchasing/Core approval still needed for public interfaces.
- Decisions/limitations: trusted single-tenant normalized fixtures, completeness must be explicitly proven externally; no live vendor adapter, actual alias registry/persistence or shipping sender authority. Literal alias matching (including case/spacing) only; no fuzzy or automatic alias linking. Conflicting primary or SKU evidence cannot select a primary. Prices retain decimal text and conservatively conflict on differing textual precision (e.g. 10.0 vs 10.00); no latest-price policy, currency conversion, ISO currency membership verification, tax inference or source precedence. Strict reference diagnostics apply only to flat normalized inputs, not raw vendor pagination/envelopes; tenant coverage, variant field mapping and catalog reference relationships remain unverified. No live reads/writes, product creation, permissions, route mounting, DB migration, merge or deployment.
- Next: M4 offline product media/document evidence projections (ordered roles/slots, source provenance, safe URL/storage references, ambiguity and availability; no uploads/fetches). Keep M3 public contract review and full integrated regressions pending; then M5 controlled read-only consumer parity after approved shared contract and tenant fixture gates.

## M2 checkpoint — 2026-11-24 (historical)

**Implementation:** committed; **targeted M2 tests PASS 8/8**; integration acceptance pending; **not deployed**.
- Continued independent branch `feature/hc-product-catalog-m1-20261124`, [draft PR #79](https://github.com/Tawgod/Lightspeed/pull/79), head `5c26fa76415cbcd0e7abcc86245b2e3b05cfb216`, parent M1 `dabab99738bf914d931ad122bc994959b78ee8ee`. Exact approved base `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`. Compare: 2 ahead, 0 behind, 7 changed files total, zero deletions. PR open/draft/unmerged, GitHub mergeable=true at recheck.
- Added pure `inspectTypedProductIdentity` to existing productIdentity.js; legacy scoring untouched. Typed SKU/UPC/GTIN/SUPPLIER_SKU/MANUFACTURER_PART, exact literal strings, canonical supplier/manufacturer ID scope, separate parent/variant targets, inactive collision retention, provenance dedupe, malformed input and activity conflict diagnostics. No cross-kind UPC/GTIN conversion. Coverage defaults incomplete and requires trusted scope-specific fixture assertion. No vendor read adapter, no authorization decision.
- Added tests/product-catalog-m2.test.mjs and docs/PRODUCT_CATALOG_M2.md. Node v22.16.0: `node --test tests/product-catalog-m2.test.mjs` executed locally against source reconstructed from committed readback, hashes verified with git hash-object: productIdentity.js `32bb1e872c3452be3f5caab6cfb08971a400858b`; M2 test `0e4b581a7ffb69d8da1d3ce975a65c1ec196992b`. 8 passed, zero failures/skips. M1/full integration suite not rerun this turn. No GitHub Actions workflow changes or additional CI minutes requested.
- Reviewed current Purchasing and Core API handoffs. Purchasing assigns canonical product/supplier mapping ownership to Catalog; Purchasing retains shipping alias evidence and PO/invoice workflows. This internal draft requires manager/Purchasing review before shared DTO freeze; no claims of their approval. No shared/protected files outside catalog ownership changed.
- Limitations: no supplier alias resolution, primary/secondary mapping projection or costs yet; no actual vendor variants/active-state/pagination coverage; UPC/GTIN equivalence deferred. Single-tenant normalized fixtures only; no full-catalog duplicate certification or creation permission. Conflicting activity is flagged incomplete; candidate activity is merely the first observed matching state, not authoritative. Category envelope/duplicate-ID/pagination gap from M1 remains open.
- Next: M3 read-only catalog reference/mapping projection, supplier alias ambiguity and primary/secondary provenance, monetary metadata; coordinate Purchasing before final contract; improve category coverage and run combined offline regressions. Do not mount routes, merge, deploy, read live vendor data, write products or migrate DB without explicit authorization.

## M1 checkpoint — 2026-11-24 (supersedes initial branch/blocker status below)

**Implementation:** committed; **targeted offline tests PASS 8/8**, integration acceptance pending; **not deployed**.
- Approved baseline PR #78 commit `71a1cd6e312ed52efc1e9af9da85db6b02e3756c`. Read baseline, dependency register and prior handoff.
- Branch `feature/hc-product-catalog-m1-20261124`, commit `dabab99738bf914d931ad122bc994959b78ee8ee`, [draft PR #79](https://github.com/Tawgod/Lightspeed/pull/79) targets reconciliation branch, not production. Compare: 1 ahead, 0 behind, 4 files, 121 additions, 0 deletions.
- Added inspectProductIdentity in products.js and inspectCategoryHierarchy in catalog.js; existing matcher/readers/route contracts unchanged. Dedicated test and docs/PRODUCT_CATALOG_M1.md.
- Node v22.16.0: node --test tests/product-catalog-m1.test.mjs: 8 passed, 0 failed/skipped. All five source/test files reconstructed from committed readback and verified byte-for-byte with git hash-object against GitHub blob SHAs: products 19d62f2c810d138efebe18f64991e7ffb1cfb818; catalog df4b42a33b7f92543c3a7bdad6dc60f329baff5f; readCollection 0350581541f61799496114cf786459b30819953f; productIdentity ae6ab2bfca9bf3f3e59f71f957d6fdcff39e5bc7; test 6adf0c7627119e500286470ebd1eb119d951cf46.
- Exact-head GitHub Actions query returned zero runs; common workflow is branch-push scoped. No shared CI changes or additional Actions minutes. Full foundation/Scanner/Core Ops regression pending manager-coordinated validation.
- Limitations: fixture-only untyped code pool; supplier scoping, variant coverage, vendor active-state semantics and authoritative remote completeness not established. complete=true must represent trusted fixture coverage only. Category diagnostic does not validate duplicate source IDs, malformed envelopes or pagination. Legacy exact semantics unchanged. No result authorizes creation.
- Core API envelope and Purchasing supplier scope review pending. No protected shared/Core/Security files modified. Draft PR creation reported mergeable=false; compare establishes pinned ancestry, not mergeability. Manager must recheck.
- Next: manager review PR #79, coordinate typed supplier/variant evidence and stronger malformed-envelope/category checks; run combined regression once before merge authorization. No live API traffic, routes mounted, production reads/writes, migrations, merges or deployments.

## Source (initial audit history)

- Management repository: `Tawgod/Hobby-Corner:main`.
- Production-connected application baseline: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`.
- Existing shared service PRs: [#32](https://github.com/Tawgod/Lightspeed/pull/32) (Phase 1), [#33](https://github.com/Tawgod/Lightspeed/pull/33) (Phase 2, stacked on #32); open, unmerged.
- Consumer candidates: Product Manager [#28](https://github.com/Tawgod/Lightspeed/pull/28), Scanner [#26](https://github.com/Tawgod/Lightspeed/pull/26), Consignment [#30](https://github.com/Tawgod/Lightspeed/pull/30), PO Companion [#31](https://github.com/Tawgod/Lightspeed/pull/31).
- Source files reviewed: `routes/specialOrderProducts.js` and `services/lightspeedApi.js` on integration branch; `services/lightspeed/productIdentity.js` on PR #32 branch; `services/lightspeed/products.js`, `catalog.js`, and `docs/SHARED_LIGHTSPEED_PHASE2_READS.md` on PR #33 branch.
- PR #32 extracts the legacy `normalizeMatchText`, `matchTokens`, `scorePotentialMatch` from Special Orders verbatim into `productIdentity.js` (blob `ae6ab2bfca9bf3f3e59f71f957d6fdcff39e5bc7`); legacy route remains active.
- PR #33 product reader blob `4c85751aa251604e94c7e4502308b241f48e245f`; catalog reader blob `6d0867ccdf6755ad29e81e07a22d841a31e99eea`.
- This handoff is the first foundation-specific milestone; no foundation feature branch, implementation commit or PR yet.

## Implemented (existing, not newly implemented here)

- Special Orders handles production-connected product/categorical workflows, local product identifiers and reconciliation, with live business code not yet migrated to shared candidates.
- Phase 1 candidate provides existing score parity and Core API transport, mutation safety, audit/idempotency modules; shared candidate remains unmounted.
- Phase 2 candidate provides product GET by ID, exact identifier lookup (including ambiguous-match error), category hierarchy reconstruction, supplier/brand/tag reference readers and strict pagination helper.
- Scanner and Consignment have feature-specific matching/review adapters; Scanner isolated test writer is NOT a production writer.
- RMS migration v68 uses independent safeguarded identifier collision checks, mapping audits, fresh export manifest and controlled bulk migration. Do not import its bulk writes into this service.

## Audit gaps and risks

1. Phase 2 `findExactLightspeedProducts` treats product-level sku/upc/supplier_code/product_codes as an untyped code pool; no supplier scoped matching, manufacturer part-number distinctness, variant mapping or evidence provenance.
2. It permits numeric-character punctuation removal when length >=6; exact text and canonical GTIN equivalence need explicit separate evidence levels. Never discard leading zeroes or assume a match from 12/13/14-digit code conversion without verified rules/check digit.
3. Phase 2 `exact` returns one product or throws 409 for multiple results, rather than a diagnostic candidate set for human review. Retain fail-closed behavior for automated decisions and add explainable read-only candidate representation.
4. Phase 2 product GET uses legacy 2.0, while SKU lookup uses 2026-07; real tenant scopes, variants, envelopes and source-version consistency are unverified.
5. Category tree reads use a single `page_size=1000` call; completeness and hierarchy missing-parent/cycle indicators must be validated before treating it as authoritative for bulk edits.
6. Shared supplier-product mapping, exact reference aliases, cost/MSRP/retail metadata, variant/media/document read normalization and collision reports lack verified unified implementations.
7. Special Orders has local reconciliation that can update/delete local product rows; do not invoke it as a supposed read-only lookup or alter its scheduling without separate owner review.
8. Product Manager preview, Consignment synthetic beta, Scanner review and RMS migration are not evidence that shared candidate contracts are deployed or accepted.
9. Existing Phase 1 scoring is fuzzy ranking only: a score of 100 does NOT grant identity equality, approval or creation permission.

## Proposed read-only contract registry (v0 draft; not a deployed API)

All identifiers are opaque strings and record the original exact value; never coerce to a number or strip leading zeros.

- `ProductReference`: `source`, `productId`, `variantId|null`, `name`, `active|null`, `identifiers[]`, `supplierMappings[]`, `referenceIds`, `prices`, `media[]`, `documents[]`, `observedAt`, `sourceVersion`, `completeness`. Optional/absent vendor fields remain null or marked unavailable, not invented.
- `ProductIdentifier`: `kind` (SKU | UPC | GTIN | SUPPLIER_SKU | MANUFACTURER_PART | OTHER), `exactValue`, `supplierId|null`, `manufacturerId|null`, `productId`, `variantId|null`, `source`, `provenance`, `verifiedAt|null`.
- `ProductMatchQuery`: `identifierKind|null`, `exactValue`, `supplierId|null`, `manufacturerId|null`, `includeInactive`, `includeVariants`; all query strings strictly validated with bounded size.
- `ProductMatchResult`: `status` (EXACT_UNIQUE | AMBIGUOUS | CANDIDATES | NO_MATCH | INCOMPLETE), `candidates[]` with `matchedOn[]`, `evidence`, `score|null`, `source`, `completeness`. `NO_MATCH` only when all authoritative searches succeeded; partial reads => INCOMPLETE, never safe for auto-create.
- `CatalogReferences`: supplier, manufacturer/brand, category hierarchy + department, tag and source UUID maps with missing-parent/cycle/unmapped reporting.
- `PriceMetadata`: cost, MSRP, retail and currency as exact decimal strings with source, scope (supplier/variant/outlet where supported), observedAt. No prices inferred from each other.
- `ProductAssetReference`: source URL/storage reference, type (image/manual/document), order/role, provenance and availability; attachment uploads explicitly deferred.
- `ProductChangeProposal` (schema only, no mutation): exact product/variant ID, requested field diffs, prior read version, collision preflight result, initiating feature and immutable evidence refs; execution requires separate Core API/Security approval.

## Owner boundaries and consumers

- Product foundation: F02–F09 catalog identities, candidate explanations, reference metadata, mapping validation, read-only adapters.
- Core API: F01 transport/version/pagination/errors/idempotency/audit interface; do not fork these.
- Security workstream: identity/session/operation grants; this foundation consumes approved authorization.
- Purchasing: supplier PO, invoices, receiving and supplier transaction state; catalog shares supplier reference contract only.
- Inventory: stock snapshots/events/count/movement; catalog owns product ID only.
- Customer & Sales: customer/sale relationships; catalog returns product references only.
- Feature owners retain Special Orders lifecycle/writer, Scanner capture/review, Product Manager UI/batch drafts, Preorder campaigns, Consignment unique used-item policies, RMS safeguarded migration.
- First consumers after acceptance: Product Manager and PO Companion read adapters, then Scanner/Special Orders shadow comparisons; no production writer migration until separately approved.

## PC-01 milestone plan

1. Freeze a reviewed v0 JSON schema for identity, variant, typed supplier mappings, completeness, collisions and exact-string prices with Foundation Manager and owners of Core API/Purchasing.
2. Create dedicated branch off the accepted shared foundation baseline only after checking latest PR #32/#33 head/merge lineage; keep changes restricted to product/catalog modules, tests and documentation. Do not edit Core API shared files or `server.js` without coordinated ownership.
3. Implement **pure, read-only** adapters that wrap/reuse Phase 1 `productIdentity.js` and Phase 2 `products.js`/`catalog.js`; expose explainable candidate lists without replacing existing matcher or write workflow.
4. Add fixture tests: exact leading-zero SKU/UPC/supplier SKU, conflicting supplier SKU in two suppliers, multiple variants, duplicate/inactive records, barcode equivalence ambiguity, incomplete pages, category cycles/orphans, unset prices/assets and malformed records.
5. Run targeted unit tests, shared foundation CI, existing Scanner/Core Operations regressions; report exact commit/run and failures. Conserve GitHub Actions minutes with targeted tests first and avoid redundant workflow triggering.
6. Obtain read-only vendor test-tenant approval and representative fixture acceptance. Only then propose one shadow-mode consumer migration, with side-by-side parity, unchanged responses and rollback.
7. Explicit Foundation Manager approval required before any shared API interface breaking change, integration branch merge, Railway staging deployment, production consumer cutover or Lightspeed mutation.

## Tested

- **This milestone:** GitHub source/PR filenames/read-only document verification only; NO new code or test execution.
- **Existing related CI:** PR #32/#33 tests are documented as previously passing in their PRs/handoffs; fresh current-head CI not independently executed here.
- Browser / employee acceptance: not executed.
- Real Lightspeed tenant fixture verification: not executed.

## Deployed

- Product & Catalog shared foundation: **NOT DEPLOYED**.
- Candidate shared gateway: **UNMOUNTED / NOT MERGED**.
- Production existing Special Orders/Ordering routes: unchanged.
- Railway verification: current management dependency register reports production `lightspeed-api` and `special-orders-test` (production Core Operations) and related services running; this milestone did not independently query Railway and must not claim a fresh service health check.

## Dependencies / conflicts

- Blocking: shared PR #32/#33 integration sequencing; approved Core API interface; Security operation permission contract for any future employee route.
- Coordinate supplier SKU scope + manufacturer identities with Purchasing and RMS migration; do not allow unreviewed normalization to collapse codes.
- Shared files potentially affected later: `services/lightspeed/productIdentity.js`, `products.js`, `catalog.js`, new product-specific tests/docs. Coordinate simultaneous modifications to `services/lightspeed/permissions.js`, `readCollection.js`, `client.js`, `routes/sharedLightspeedRead.js` with Core API.
- Do not turn supplier PO `consignments` into customer-owned used-item Consignment records.
- No product creation/update, local reconcile, bulk migration, stock movement, media upload or supplier reference creation during read-only milestone.

## Decisions needed

- Foundation Manager: accept Product & Catalog read v0 shape and the Core API error/envelope expectations.
- Core API owner: shared pagination/version interface for product list/detail; response completeness semantics.
- Purchasing owner: supplier-ID and alias scope, primary vs secondary supplier mapping.
- Product/feature owners: whether variant identifiers are authoritative or require separate vendor read contract.

## Recommended next action

Manager reviews this registry and reserves product/catalog module ownership; then create dedicated implementation branch with read-only fixtures and tests, preserving #32/#33 lineage. No production changes.

## Documentation

- `SHARED_TOOL_DEPENDENCIES.md` (F02–F09), `LIGHTSPEED_SHARED_SERVICES.md`, `handoffs/lightspeed-shared-services.md`, `handoffs/product-manager.md`, `handoffs/product-scanner.md`, `handoffs/consignment.md`, `handoffs/rms-migration.md`, `handoffs/po-companion.md`.
