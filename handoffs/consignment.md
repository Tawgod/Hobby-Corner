# Consignment Management — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — isolated beta and selective consolidated PR #30, not production-integrated.

## Source
- Repository: `Tawgod/Lightspeed`; authoritative application base `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- Current integration candidate: [PR #30](https://github.com/Tawgod/Lightspeed/pull/30), `feature/consignment-consolidated-v2-20261028@647a8f6cc4b5844c43e07b88cc256fc9ca6623d8`; **draft/open/unmerged**.
- Predecessors: PR #11 and #25 selectively preserved/superseded. Do not restore obsolete direct `extension/popup.html` launcher or old server rewrites.

## Implemented
- Isolated staff/customer Consignment intake, forms, staff review, product matching/preview, prototype credit eligibility, local beta route and separate SQL schema. Navigation reuses current Core Ops destinations and established shared design.
- Pure read-only `services/consignmentSaleReconciliation.js` deduplicates events and rejects voided/returned/conflicting sales; existing 72-hour credit eligibility planner is not a live credit posting worker.
- Test database writes require independently configured `CONSIGNMENT_BETA_DATABASE_URL`, staff key and explicit `CONSIGNMENT_BETA_ALLOW_DB_WRITES=true` opt-in. No production customer/product/inventory/store credit writes.

## Tested
- Exact head `647a8f6c...` CI: consolidated safety `40730699554` PASS, Scanner integration `40730699508` PASS, Chromium synthetic browser acceptance `40730699557` PASS (desktop, 900px/125%, 390px/200%, keyboard More, staff/customer forms).
- Real employee Timeclock authentication, test DB persistence, live read-only customer/product matching and real sale/credit reconciliation remain **unverified**.
- Existing isolated Railway beta previously documented on old feature branch; branch promotion to PR #30 has **not** been verified or authorized. Current main Railway production topology shows no PR #30 deployment.

## Deployed
- Existing isolated beta: historically deployed separately, current exact test-service health not rechecked in this pass.
- PR #30: **not merged, not deployed**, no production Lightspeed/credit writes, no extension package.

## Shared dependencies
- PR #24 Core Ops navigation and PR #27 shared UI merged; PR #26 Scanner and PR #31 extension popup/manifest alignment; PR #32/#33 shared product/customer/sales/store-credit readers are unmerged.
- Existing staff PIN gateway; isolate consignment customer data and product/credit permissions from normal operations.
- Invoice Reconciliation is a separate planned PO/product review feature; no consignment-specific invoice writer should be introduced.

## Shared files / integration surfaces affected
- `consignment-beta.html`/`.css`/`.js`, `consignment-customer.html`/`.js`, `db/consignment_schema.sql`, `routes/consignmentBeta.js`, pure `services/consignment*`, additive `server.js` beta route and scoped CSS. **No extension popup or manifest changed** in PR #30.

## Remaining blockers
- Separate safe test service and isolated PostgreSQL, verified Timeclock auth, read-only live matching, product dedupe, sale-return audit, delayed credit idempotency and real browser signoff.
- Do not present a beta-only route as a stable production launcher. Future `/consignment` URL only after authenticated production approval.

## Decisions needed
- Approval for an **isolated test deployment only**; eventual production launcher, permissions and delayed-credit policy require separate approval.

## Recommended next action
- Verify isolated Railway service/test DB permissions, then promote PR #30 **only in a separately approved test environment**, run real employee/live read-only matches and sale-credit reconciliation.

## Restrictions / safety
- Do not touch production customer/product/inventory/credit data, post credit, merge PR #30 into Railway-connected integration or publish extension without explicit authorization.

## Documentation
- `docs/consignment-consolidation-20261028.md` on PR #30, `CHROME_EXTENSION_RELEASE_QUEUE.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`.
