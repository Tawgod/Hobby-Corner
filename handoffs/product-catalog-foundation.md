# Product & Catalog Foundation — Current Handoff

**Last verified:** 2026-11-23  
**Status:** Source audited / read-only contract design; implementation not started in this workstream  
**Owner:** Product & Catalog Foundation development conversation  
**Coordinator:** Hobby Corner Foundation Manager  
**Safety:** No production product writes, deploys, merges, or DB migrations authorized.

## Source

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
