# Shared Tool Dependencies Foundation — Current Handoff

**Last verified:** 2026-11-23  
**Status:** Planned (architecture mapped); no runtime implementation or release from this workstream

## Source

- Repository: `Tawgod/Hobby-Corner`
- Authoritative management branch: `main`
- Canonical application: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Shared services candidates: `Tawgod/Lightspeed` PR #32 Phase 1 and stacked PR #33 Phase 2, neither merged or deployed at review.
- Current architecture document: [SHARED_TOOL_DEPENDENCIES.md](../SHARED_TOOL_DEPENDENCIES.md)
- Current PR: none; management documentation commit only.
- Existing feature candidates remain owned by their feature branches and handoffs; no competing foundation branch created.

## Implemented

- Verified production-connected source modules, Phase 2 candidate service filenames and Railway production/HC Secure status.
- Authored common dependency catalog **F01–F36** covering product creation/matching, inventory, counts, locations, customers, POs, receiving, credits, staff/security integration seam, notifications, labels, workflow state and cross-tool services.
- Mapped actual/current versus candidate/planned tool consumers and unique responsibilities.
- Defined critical count timestamp/stock event requirements, positive/negative cost variance, and post-migration inventory initialization.
- Defined backroom shelf/on-hand assumption, batch employee confirmation, no total-stock mutation and dual floor/storage labels.
- Preserved Invoice Updates strict separation from PO receiving and stock adjustments.
- No application code changed.

## Tested

- Source/document inspection: GitHub current baseline and Phase 2 shared inventory/PO/product/customer read contracts; reviewed tool owner handoffs and roadmap.
- Railway inspection: `Hobby Corner/production` seven existing services with latest deployment SUCCESS; separate `HC Secure/staging` has staged patch only and no deployed general identity service.
- Automated tests: **Not run**; documentation only.
- Browser/employee acceptance: **Not performed**.

## Deployed

- Shared Tool Dependencies foundation: **No runtime/production/staging deployment**.
- Existing Railway production sources are not evidence of the future shared module conversion.
- No Chrome release, database migration, permission activation or Lightspeed writes performed.

## Shared dependencies

- Existing shared architecture in [LIGHTSPEED_SHARED_SERVICES.md](../LIGHTSPEED_SHARED_SERVICES.md) remains the technical base.
- Foundational Security/HC Secure **owns authentication and authorization**, this workstream consumes exact-operation access contracts.
- Shared UI/UX owns navigation and common interface shell; Chrome extension release queue governs packaging.
- Feature owners own Special Orders/Preorders/Ordering, Scanner, Product Manager, PO Companion, Consignment, Labels, Timeclock, Rewards, RMS migration, Inventory Count and Backroom workflows.
- [FEATURE_INVOICE_RECONCILIATION.md](../FEATURE_INVOICE_RECONCILIATION.md) governs invoice no-receiving/no-stock-change boundaries.

## Shared files / integration surfaces affected

- Created `SHARED_TOOL_DEPENDENCIES.md` in management repo.
- Created this handoff. Existing application source untouched.

## Remaining blockers

1. Shared Phase 1/Phase 2 PR #32/#33 remain unmerged/unmounted; feature consumers still use a mixture of direct HTTP and shared legacy client.
2. No verified X-Series complete stock event timeline for time-of-scan reconciliation; must validate with controlled read-only source/tenant evidence before inventory adjustment design.
3. No integrated shared product writer or universal customer/PO/stock gateway cutover yet.
4. Security identity/grant delegation requires coordination with separately owned HC Secure; production default deny.
5. Actual outlet, cost, category/supplier UUID, shelf map and initial stock data require read-only validation.
6. New tools need dedicated feature handoffs, tested requirements, and release boundaries before use.

## Decisions needed

- Confirm preferred integration order (recommended: identity/product/catalog/inventory reads, customer/PO reads, inventory event ledger and count/restock, then audited writes).
- Confirm stock event source and count cutoff strategy after X-Series capability audit.
- Confirm shelf location identification and how floor/storage label target quantities are represented.
- Exact tool-specific operation grant matrix remains with Foundational Security workstream.

## Recommended next action

1. In this development conversation, inventory already-written common code in PR #32/#33 and production routes, define stable read API response schemas.
2. Prioritize read-only Product/Catalog/Inventory foundation and stock change timeline discovery, while Foundational Security independently supplies verified service/staff identity.
3. Use one low-risk consumer first and maintain parity tests; record results and hand off to manager.
4. Keep [SHARED_TOOL_DEPENDENCIES.md](../SHARED_TOOL_DEPENDENCIES.md) updated as tool requirements are discovered.

## Restrictions / safety

- Do not merge, redeploy, publish extension, activate security grants or mutate production Lightspeed/customer/employee/stock data without explicit authorization.
- Do not treat a proposed dependency as already operational, or infer data event completeness.
- No duplicate product creation, inventory authority, customer master or staff identity system.

## Documentation

- [SHARED_TOOL_DEPENDENCIES.md](../SHARED_TOOL_DEPENDENCIES.md)
- [LIGHTSPEED_SHARED_SERVICES.md](../LIGHTSPEED_SHARED_SERVICES.md)
- [HOBBY_CORNER_PROJECT.md](../HOBBY_CORNER_PROJECT.md)
- [handoffs/lightspeed-shared-services.md](lightspeed-shared-services.md)
