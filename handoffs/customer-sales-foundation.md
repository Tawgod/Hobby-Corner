# Shared Customer & Sales Foundation — Current Handoff

## Current milestone — 2026-11-24: M1 internal read evidence projections

**Status:** Implemented; targeted offline automated tests PASS; draft manager review; NOT deployed or consumer-integrated.

### Source
- Approved baseline: Tawgod/Lightspeed:feature/hc-foundation-reconcile-20261124@71a1cd6e312ed52efc1e9af9da85db6b02e3756c ([PR #78](https://github.com/Tawgod/Lightspeed/pull/78)).
- Independent branch: feature/hc-customer-sales-m1-20261124; exact head ba3a5f2f109aa4e8d3c271922a9755bb05b5b637.
- Draft [PR #81](https://github.com/Tawgod/Lightspeed/pull/81) targets reconciliation branch, not production; creation response confirms approved base SHA, 3 added files, 190 additions, zero deletions. Mergeability not established (creation response false). No merge requested.
- Read approved FOUNDATION_DEVELOPMENT_BASELINE.md, SHARED_TOOL_DEPENDENCIES.md (F17–F19/F22–F24/F27–F30) and previous handoff. No separate cherry-pick of original PRs #32/#33/#51.

### Implemented
- Added services/lightspeed/customerSalesEvidence.js (blob b9d727805ccaacd7c5b864bfe416e048cacce69a), opt-in internal projections over existing injected customer, sales, fulfillment and credit readers. No new transport or public route.
- Exact string customer and sale IDs, minimal customer reference, email/phone candidate matching through existing paginated search, duplicate row rejection, ambiguity and mandatory review even on zero/one match. No auto-link/create eligibility.
- Sale projections retain invoice zeros and customer associations, reject tested mismatches/duplicate rows. Sale search explicitly single-page/incomplete. Deposit, partial pickup and return events unknown.
- Fulfillment distinguishes request-scoped versus explicit source association; single-page/incomplete, pickup quantity unknown. Credit preserves decimal strings including zero; missing/numeric amounts unknown, no transaction history or writes.
- New files only: services/lightspeed/customerSalesEvidence.js, tests/customer-sales-evidence.test.mjs, .github/workflows/customer-sales-m1.yml. Branch-specific CI chosen to avoid broad CI usage; no dependency install or credentials.
- Existing readers, envelopes, production routes, Core transport and Security files unchanged.

### Tested
- Local Node.js v22.16.0, node --test tests/customer-sales-evidence.test.mjs: **9/9 passed, 0 failed, 0 skipped**. All seven source/test files reconstructed from GitHub content and independently verified using git hash-object against repository blob SHA; test blob 13f2abb95aa9fc1097dd0c8294cec2fe02e90107. Synthetic injected transport only.
- Coverage: exact IDs, omitted contact fields, multi-page duplicate matches, phone formatting, no auto-create on absence, malformed/duplicate records, legacy sale envelope and invoice zeros, sale association mismatch, fulfillment uncertainty, missing versus zero credit, no write methods and upstream error propagation.
- Branch-scoped Actions workflow added; push-run result not accessible through available PR-run listing; remote CI outcome unverified. Full baseline regression not rerun here; manager's prior 40+11 tests separate evidence. No browser, live tenant or consumer acceptance.

### Deployment
- None. No production reads/writes, route mount, credentials, DB migration, merge, deployment, customer/employee changes or notifications.

### Remaining blockers / decisions
- Internal evidence projections are not public API/authorization boundary; IDs remain sensitive. Core API envelope and Security operation grants require approval.
- Contact matching is not identity proof, exhaustive duplicate absence, international phone equivalence or consent. Name matching, linkage, contact ownership and inactive customer coverage not verified.
- Sale/fulfillment single-page coverage intentionally incomplete. State filtering and conflicting/malformed source IDs (especially direct/nested fulfillment IDs and numeric coercion) require further hardening before consumer use. Credit only accepts string decimal pending real source shape confirmation.
- Core API owns continuation scope and shared error handling; do not interpret search candidates as complete vendor evidence.
- Full consumer route parity (Special Orders, Rewards, Split/Recall, Preorders, Consignment) outstanding. Deposits, work orders, line quantities, pickup/returns, consent and credit transaction history not implemented. No consumer switched. All writes require separate authorization, idempotency, audit and readback.
- Live vendor evidence, complete feature regression, grants and manager review remain required.

### Next action
Manager review draft #81 and coordinate coverage/error/auth seam with Core API. Harden conflicting/malformed association evidence and state filtering, map actual consumer read paths, and test parity of one selected consumer. No route mounting or writes.

---

## Historical audit (2026-11-23; superseded baseline/status)

# Shared Customer & Sales Foundation — Current Handoff

**Last verified:** 2026-11-23  
**Status:** Source audit / read-only contract planning; no new runtime implementation or deployment

## Source
- Management repository: `Tawgod/Hobby-Corner:main`
- Authoritative application baseline: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Shared core candidate: [PR #32](https://github.com/Tawgod/Lightspeed/pull/32), `feature/shared-lightspeed-services-phase1-20261029` — open, not merged/deployed
- Shared read candidate: [PR #33](https://github.com/Tawgod/Lightspeed/pull/33), `feature/shared-lightspeed-services-phase2-reads-20261029` — stacked/draft, not merged/deployed
- Relevant handoffs: `handoffs/lightspeed-shared-services.md`, `handoffs/core-operations.md`, `handoffs/consignment.md`, `handoffs/product-scanner.md`
- Register: `SHARED_TOOL_DEPENDENCIES.md` F17–F19, F22–F24, F27–F30; `LIGHTSPEED_SHARED_SERVICES.md`

## Verified source audit (2026-11-23)
- On the production-connected integration branch, `services/lightspeedApi.js` exposes `getCustomer`, `getSale`, `searchSalesByInvoiceNumber`, `searchSalesByCustomer`, `searchSalesByState`, `getFulfillmentsForSale`, and `getStoreCredit`. The same module exposes `createSale`, `updateSale` and `createStoreCreditTransaction`; mere existence does not establish safe permission/idempotency or authorize calling them.
- Phase 1 `services/lightspeed/customers.js` provides `createLightspeedCustomersRead({transport})` with `get` and search by email, phone or name. Phase 2 documents hardened pagination; require real shape/completeness tests before adoption.
- Phase 2 `services/lightspeed/sales.js` provides `createLightspeedSalesRead` with `get`, `byInvoice`, `byCustomer`, and `byState`.
- Phase 2 `services/lightspeed/fulfillments.js` provides `createLightspeedFulfillmentsRead.forSale` with normalized ID/sale ID/status and raw evidence. This does not yet establish line-level partial pickup.
- Phase 2 `services/lightspeed/storeCredit.js` provides `createLightspeedStoreCreditRead.get`; no shared credit transaction writer.
- Phase 2 `routes/sharedLightspeedRead.js` is explicitly unmounted. No shared customer/sales read gateway in production was verified.
- `SHARED_TOOL_DEPENDENCIES.md` identifies production feature customer handling in Special Orders; Rewards/customer sync; Split/Recall; Preorders; and draft Consignment. Consumer-by-consumer route and parity verification remains outstanding. Do not mark any of these consumers migrated.
- Consignment handoff specifies customer-first submission, manual review of ambiguous customer matches and explicit approval for new customer creation. Its proposed credit is 80% of verified sale proceeds after 72 hours, return/void reconciliation and durable deduplication; beta is synthetic only.
- Core Operations handoff documents separately isolated synthetic read acceptance, NOT authorization for live customer data or general production scopes.
- PR #32 and PR #33 were examined; overlapping foundation readers exist and must be reused rather than rewritten. Review of current branch head/checks and all downstream PR conflicts is still a release gate.

## First milestone — read-only contract specification (proposed, NOT implemented)
- **CustomerRef v1:** canonical `lightspeedCustomerId` as exact string; `source`, optional external identity links with verification provenance, `updatedAt`/`observedAt`, record source and `dataCompleteness`. Employee and customer identities remain distinct.
- **CustomerMatch v1:** exact-ID > verified email/phone where permitted > name/contact candidate; return `matches[]`, evidence, `ambiguous`, `complete`, and explicit `requiresReview`; never choose a customer solely by first search hit. Preserve source identifiers and avoid storing unneeded contact PII.
- **CustomerRead v1:** get by Lightspeed ID; paginated search with explicit cursor/page metadata and failure on uncertain pagination; normalized contact fields with consent provenance; no implicit create/update.
- **SaleRead v1:** get by ID, search by invoice/customer/state; line references, quantities, totals/currency, customer link, state, source timestamps and complete/raw metadata. Treat outstanding deposit, work-order and partial pickup data as nullable until vendor/feature mapping is verified.
- **FulfillmentRead v1:** sale-level and line-level received/ready/picked-up quantities and timestamps only when source evidence supports them; never invent fulfillment quantity from sale status.
- **ReturnVoidEvent v1:** normalized event type, sale/line reference, quantity, amount, source event ID, event timestamp, observation time, and reversal relation; source availability is NOT verified.
- **StoreCreditRead v1:** source-confirmed balance, currency, transaction evidence where available, as-of/freshness, and completeness; read response must not imply permission to post credit.
- **ConsentNotificationRead v1:** channel, permission/opt-out source, verified linkage, provenance and last-updated timestamps; sending and delivery providers remain owned outside this foundation.
- Contract responses must carry stable errors for ambiguous, incomplete, unauthorized, stale, and upstream-unavailable results; transport/error semantics owned by Core API.

## Safe first integration plan
1. Confirm with Foundation Manager and Core API ownership of F17/F18/F19/F22/F23/F24 and exact operation IDs, and reconcile PR #32/#33 ancestry before changing shared modules.
2. Audit exact Special Orders customer/sale routes, Rewards sync, Split/Recall, Preorders and Consignment candidate; inventory request/response shapes, privacy and existing mutation points.
3. Add read-only normalization functions and fixtures on a dedicated customer-sales branch, consuming existing Core transport and Phase 1/2 readers. No new vendor HTTP transport, identity system or production route mount.
4. Automated fixture/parity tests: duplicate email/phone, ambiguous match, incomplete pages, leading-zero/exact IDs, customer-sale association, deposits missing, partial pickup/returns, store credit absent, safe error envelopes and no mutation calls.
5. Only after source parity, security operation grant agreement and separately authorized read-only acceptance should a feature consumer opt in behind a controlled switch with rollback.

## Implemented
- Documentation-only source audit and first proposed read-contract milestone. No application code changed.

## Tested
- Source files and published handoffs inspected with GitHub connector. No automated tests executed in this milestone.
- No browser/employee or live tenant acceptance performed.

## Deployed
- No new deployment. No production customer, sale, store-credit, employee or consent records changed.

## Shared dependencies
- Core API: existing transport, pagination/error contracts, versioning, audit and idempotency infrastructure.
- Foundational Security: approved staff/session identity and exact read/write operation grants; distinct customer auth audience.
- Product/Inventory: stable sale line/product/outlet refs, fulfillment and returns events.
- Purchasing/Suppliers: special-order/PO linking only; no ownership of supplier mutations.
- Feature owners: Special Orders, Rewards, Split/Recall, Preorders, Consignment, Repairs, notifications.

## Shared files / integration surfaces affected
- This handoff only: `Tawgod/Hobby-Corner:main/handoffs/customer-sales-foundation.md`.
- Future proposed code surfaces: `services/lightspeed/customers.js`, `sales.js`, `fulfillments.js`, `storeCredit.js` and additive normalizers; no modifications yet.

## Remaining blockers
- Full consumer route audit and exact existing semantics, particularly customer duplicate handling, Rewards sync, deposits, partial pickup, Split/Recall and return/void evidence.
- Current PR #32/#33 branch checks/merge conflicts and real tenant API compatibility.
- Verified sale/fulfillment/credit API source event shapes and timestamps.
- Canonical security operation grants; no implicit auth from an employee lookup or customer linkage.
- Any write proposal requires separate explicit authorization, audited durable idempotency, readback verification and retry/uncertain-result handling.

## Decisions needed
- Foundation Manager to approve read contract registry names, service owner boundaries, and sequencing against Core API.
- Feature owners to confirm sale/order/deposit states and the intended customer-linkage/consent ownership.
- No request to authorize production writes or deployment at this milestone.

## Recommended next action
Complete the remaining per-feature read-path audit; prepare a tiny, isolated normalization-and-contract-test PR based on the **approved** shared Core reader ancestry, not production branch code copied into a competing client. Report implementation, tests and deployment independently.

## Restrictions / safety
- Preserve Special Orders and Rewards behavior; no production writes, merges, deployment, gateway mount or security interface changes without explicit authorization.
- Do not silently merge duplicate customer identities or post/reverse store credit.
- Customer identities and consent are not staff security identities or permissions.
