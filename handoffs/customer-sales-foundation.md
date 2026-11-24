# Shared Customer & Sales Foundation — Current Handoff

## M5 — Baseline V2 identity/linkage/consent read evidence (2026-11-24)

**Status:** Implemented on isolated V2 branch; targeted reconstructed-source local tests PASS with limitations; manager reconciliation gate. Not deployed or consumer-integrated.

### Source
- Approved V2 parent: Tawgod/Lightspeed:test/hc-foundation-combined-20261124@2365de8af4e8d69b162f6909d1f78be246e74fdf. Manager combined run 45423638373 verified 187/187 at that exact parent, not new-head evidence.
- Read canonical baseline, manager handoff, own handoff, dependency register F17–F19/F22–F24/F28 and V2 source manifest. Old PR #81 head 1c979a7d6a02d8e974b7f8af1a3591a3c2835028 exactly matches V2 included pin; no newer work to carry forward; old branch and PR preserved.
- Independent branch feature/hc-customer-sales-m5-v2-20261124; head 2f2750ee703556c1ea2eab60f3d6edd14bbe82ea.
- Draft [PR #88](https://github.com/Tawgod/Lightspeed/pull/88) targets V2 branch, base 2365de8af4e8d69b162f6909d1f78be246e74fdf; mergeable=true, draft=true, merged=false; 4 changed files. No merge attempted.

### Implemented
- Added services/lightspeed/customerIdentityEvidence.js, pure normalized provider/channel evidence projection and injected read-only adapter. Exact customer IDs, bounded rows, UTC timestamps, link statuses verified/unverified/revoked/conflicting/unknown; multiple accounts or conflicting states require review. Consent opt-in/opt-out/unknown, conflicting flags, conservative opt-out dominance. No chronological re-consent override. No send authorization (canSend always false), no external IDs, evidence IDs, contact addresses or raw records returned. Coverage supplied-evidence-only. This is customer business data, not staff identity or authentication.
- Existing customers.js get/search/searchFirstPage signatures extended compatibly with optional correlationId; previous transport call shape preserved when absent. Reuse Core-owned pagination and executor, no changes to Core/Security/shared routes. Existing reusable search modes remain available to other features.
- Added tests/customer-identity-m5.test.mjs, seven synthetic groups including actual V2 Core executor admission and sanitized error/correlation fixture. Proposed operation customers.identity.read is a fixture name, not approved grant. Existing 20 customer/sales/route-source tests retained and rerun; malformed Special Orders response rejection remains intentional candidate difference, actual HTTP compatibility pending.
- Added docs/CUSTOMER_IDENTITY_M5.md with input/output candidate, provider trust and consumer boundary.

### Tests / evidence
- Local Node.js v22.16.0: node --test tests/customer-identity-m5.test.mjs tests/customer-sales-evidence.test.mjs: **27/27 PASS**, zero failed/skipped/cancelled, TAP duration 165.234274 ms; 7 new + 20 previous. Synthetic dependencies only.
- Reconstructed local files: changed customers.js hash 90b3a03e27be2d8a5d6b94b09dadfab03dfdc202, new customerIdentityEvidence.js a766094fbc6b0505a24ef5d4b7b69aaace12c0e9, new test 0103643efa52279c5c4b2a0473eea4e4625430c7; all match GitHub. V2 coreReadContract.js 43b3b19286a902d07d737c662c10ef3c99d260d3 and readCollection.js c98d0a5ddae5503ba8e332ca90d2f2cd47d16e8d also match.
- LIMITATION: reconstructed client.js local hash 48b2ada178057fbb6b45a0701ea67cc1e51764d4 differs from V2 expected ab2f92df211db041606772ac785b40b764b03bee; injected transport exercised, not actual network client. Local special-orders.js is prior fetched route excerpt only. Do not claim exact-checkout or full suite regression. Manager must run full exact-head suite including new test (expected aggregate 194 if no other changes). No additional CI workflow added; no remote run result asserted.

### Deployment
None. No live reads/writes, account linking, creation, consent changes, notifications, grants, DB migrations, actual route changes, merge or deployment.

### Coordination gate / remaining decisions
- Manager/Core/Security: review candidate operation name, exact grants, approved projections, error mapping and trace; no independent identity/security implementation. Raw vendor search rows still require authorized field allowlist.
- Feature owners: map authoritative Discord/Rewards/local profile/consent providers, verification provenance and freshness, global cross-customer account uniqueness, consent purpose and re-consent policy. Current statuses are supplied evidence only; cannot prove actual identity or current consent. No provider adapters connected. Conservative opt-out dominance and fixed provider/channel set are draft decisions.
- Special Orders first-page route-source parity retained; malformed response now fails instead of empty result in test-only candidate. Actual application route/error and authorized enrichment parity unresolved; no activation.
- Manager review and exact-checkout combined regression before further integration. Next scope after assignment: M6 sales/deposit/work-order/fulfillment evidence, contingent on manager sequencing; M7 returns/store credit remains queued. No automatic linking/creation, credit posting or actual consumer switch.
- No personal user input required now. Stop at reconciliation gate.

---

## Historical milestones (prior baseline; retained)

# Shared Customer & Sales Foundation — Current Handoff

## Current milestone — 2026-11-24: M4 pre-integration route-source compatibility

**Status:** Offline route-source compatibility PASS; ready for manager reconciliation, NOT approved for actual consumer switch, merge or deployment.

### Source
- Approved common baseline: Tawgod/Lightspeed:feature/hc-foundation-reconcile-20261124@71a1cd6e312ed52efc1e9af9da85db6b02e3756c (PR #78).
- Independent branch feature/hc-customer-sales-m1-20261124, head 1c979a7d6a02d8e974b7f8af1a3591a3c2835028.
- [Draft PR #81](https://github.com/Tawgod/Lightspeed/pull/81) remains open/unmerged; 5 changed files; correct base SHA. Immediately after commit GitHub reported mergeable=false (previous head true); recheck after calculation; no merge attempted.
- Core API handoff reviewed: [PR #83](https://github.com/Tawgod/Lightspeed/pull/83) at 6722414245be56e138566beebcfcb0f19e2eef8e proposes core.v1 envelope, authorizeRead seam, stricter pagination/correlation. Core contract and grants NOT frozen. Do not duplicate or import that branch independently.

### Implemented
- Added three offline test groups to tests/customer-sales-evidence.test.mjs. Harness extracts the exact GET /customers/search handler between checked-in route markers from special-orders.js; evaluates only that trusted source with fake router, transport, pool and response. In-memory candidate substitutes only the vendor fetch block with customers.searchFirstPage(q).rows. All other route logic remains original. No actual route or runtime module changes.
- Compares original/candidate name/email/phone initial URLs, one-page behavior, response fields/order, local profile enrichment and exact DB query/IDs. Also covers blank query, empty results, no pool, simulated DB and upstream exceptions. Malformed response explicitly differs: original returns 200 empty, candidate rejects with 502.
- Shared customer search remains feature-independent: existing paginated search and get plus first-page compatibility. Future features consume shared backend reader through approved security and projections; no Special Orders local database dependency.
- Integration guide: docs/SHARED_CUSTOMER_SEARCH.md.

### Tested
- Node.js v22.16.0 local node --test tests/customer-sales-evidence.test.mjs: **20/20 PASS**, zero failed/skipped, duration 249.55 ms. Seven existing local JS files matched prior GitHub hashes; modified test file hash-object matched new GitHub blob 8a26a60d341bcdad9ba9f95d075253afaa2b8f51.
- Local special-orders.js was reconstructed ONLY from GitHub fetched route excerpt (source blob dd432d6737b918e458bd2aefc020f6d0e912cf1a, lines 4000–4045 plus next route marker), not a full checkout or full-file hash verification. Test in GitHub reads the complete checked-in source file and extracts handler. No live app boot or actual Express middleware/auth/browser/real DB acceptance. Remote push CI outcome remains unverified. No full baseline regression rerun.
- Test harness is deliberately source-marker-dependent; future route refactors must update harness after review. Synthetic dependency errors do not establish parity with real HTTP status/error shapes. Raw legacy response contains PII and is not approved as a new public contract.

### Deployment
None. No live vendor traffic, customer/employee data read/write, route mount, actual consumer switch, DB migration, security grants, merge or Railway deployment.

### Manager reconciliation requests — required before actual M4 integration
1. Review PR #81 against approved base and Core PR #83, freeze public read envelope, error taxonomy, operation grant seam and correlation propagation. Verify remote CI, mergeability and combined regressions before authorized integration.
2. Coordinate Special Orders owner: approve exact transport substitution with first-page behavior, retained local enrichment and appropriate PII field allowlist, and resolve stricter malformed-envelope/error response behavior. The proposed substitution is test-only, not a production patch.
3. Security owner must approve active staff/exact customer lookup operation grants and trusted authorization adapter; no raw customer data accessible to unapproved consumers, no new identity system. Core owns correlation and safe error response.
4. Approve whether next domain milestone is customer identity/consent read model or selected actual consumer integration after Core/Security reconciliation. No automatic linking, creation, updates or credit posting.
5. Other consumer parity (Rewards, Split/Recall, Preorders, Consignment), vendor versions/shapes, inactive coverage, deposits, work orders, fulfillment/return line evidence and store-credit history remain open.

### Next action
Stop at coordination gate for this checkpoint. No personal user decision needed before Foundation Manager review. Continue with the manager-approved integration contract and test sequence; do not mount a gateway or modify live routes without coordinated acceptance and authorization.

---

## Previous milestone (historical)

# Shared Customer & Sales Foundation — Current Handoff

## Current milestone — 2026-11-24: M3 reusable customer search and compatibility fixtures

**Status:** Implemented, offline tested, draft manager review; no consumer switched or deployed.

### Source
- Approved common baseline: Tawgod/Lightspeed:feature/hc-foundation-reconcile-20261124@71a1cd6e312ed52efc1e9af9da85db6b02e3756c (PR #78).
- Independent branch feature/hc-customer-sales-m1-20261124, head 5d671f9ce0d49626270c72ae44bb8f53960850d5.
- [Draft PR #81](https://github.com/Tawgod/Lightspeed/pull/81), approved base SHA 71a1cd6e312ed52efc1e9af9da85db6b02e3756c, mergeable=true, draft=true, merged=false; 5 changed files.
- User expressly requires shared customer search usable by future features, not Special Orders-only.

### Implemented
- Existing services/lightspeed/customers.js owns reusable buildCustomerSearchPath(query), existing search(query) paginated array and get(customerId) vendor envelope preserved, additive searchFirstPage(query) returns {rows,coverage,complete:false}; blank returns not-queried and no vendor traffic. First-page errors and malformed envelopes reject.
- Uses existing shared transport and pagination; no separate client or local database dependency. Existing contact candidate evidence layer remains available; matching always requires review. Direct ID lookup is not free-text ID search.
- docs/SHARED_CUSTOMER_SEARCH.md documents methods, consumer examples, PII and access gates, Special Orders enrichment separation.
- No route, grant, transport, security or existing feature modifications. Future authorized consumers include Consignment, Rewards, Preorders, Repairs, Reservations and others.

### Tested
- Local Node.js v22.16.0, node --test tests/customer-sales-evidence.test.mjs: 17/17 PASS, 0 failed/skipped, TAP 113.34 ms.
- Existing 13 tests plus four groups: exact legacy initial URL for names/email/phone, first-page fields/order and synthetic local enrichment, separate first-page versus paginated callers, blank/malformed/error behavior.
- Local modified customers.js and test blob hashes verified against GitHub: 8209eef8769ecc9823fcf66d912838d7e856e614 and c35f0c7c43a843dd9858a490b103f53b2c6c650b. Documentation-only commit after tested code.
- Special Orders enrichment test is a synthetic reproduction, not an actual route execution or complete consumer acceptance. Raw fields preserved for authorized compatibility; malformed envelopes intentionally stricter than legacy. No live tenant or full feature tests. Remote push CI outcome not verified.

### Deployment
None. No merge, deployment, customer data read/write, DB migration, grant or route mount.

### Dependencies / blockers / decisions
- Core API owns transport pagination and public error envelope; Security owns authorization and exact grants. Raw vendor rows contain PII, never expose as an unrestricted endpoint. Feature-specific allowlists and approved grants required.
- Need Manager and Special Orders owner review of first-page substitution, actual route-level fixtures, error mapping, field allowlist, existing local enrichment and response shape; no consumer switched. Need real vendor shape/coverage acceptance separately authorized. No search completeness or automatic duplicate-safe creation guarantee.
- Customer field aliases, international phone handling, inactive customer coverage, linkage/consent, deposit, work order, line pickup, returns, credit history and write acceptance remain outstanding.
- Chose opt-in first-page compatibility preserving existing paginated API instead of silently expanding the production UI result size.

### Next action
Manager review PR #81 and coordinate actual Special Orders route-level integration fixture and authorization seam with Core API and feature owner. Keep all consumers unchanged pending approval. Subsequent consumers use documented common reader rather than creating independent search clients. No production merge/deploy authorization.

---

## Previous milestone (historical)

# Shared Customer & Sales Foundation — Current Handoff

## Current milestone — 2026-11-24: M2 strict association evidence and Special Orders source mapping

**Status:** Association hardening implemented and offline tests PASS; Special Orders source mapping completed for identified paths, full consumer parity still pending. No deployment or consumer switch.

### Source
- Approved baseline: Tawgod/Lightspeed:feature/hc-foundation-reconcile-20261124@71a1cd6e312ed52efc1e9af9da85db6b02e3756c (PR #78).
- Independent branch: feature/hc-customer-sales-m1-20261124, head fa8fe5fd1f40c09e218e2d31e5519c5a5a124192.
- [Draft PR #81](https://github.com/Tawgod/Lightspeed/pull/81) readback confirms exact head/base, open, draft, mergeable, unmerged; three additive files relative to baseline. No shared branch changes.

### Implemented
- Internal customerSalesEvidence.js now rejects non-string/empty/conflicting explicit direct and nested customer/sale references rather than masking malformed fields with a valid fallback.
- Fulfillment projection validates raw fulfillment ID before accepting normalized ID; rejects coercion and conflicting raw sale references.
- Sale state searches require every provided state/status field to exactly match query; missing or conflicting fields reject. Conservative rule pending vendor semantics confirmation.
- Store credit validates direct/nested customer references and distinguishes source-confirmed vs request-scoped association.
- Existing readers, route contracts and Core/Security files unchanged.

### Tested
- Local Node.js v22.16.0, node --test tests/customer-sales-evidence.test.mjs: **13/13 passed**, zero failed/skipped, 79.49 ms TAP duration. Previous nine cases plus four regression groups. All seven JS files' git hash-object values match GitHub source hashes (five inherited readers unchanged). Updated projection blob 22ad0a080647c5ce82a9743b8bc9b884da4a090f, test blob bcc2e5a0d318c20fe09ef78c6b40c99607058a17.
- Synthetic tests only; GitHub push Actions outcome not checked/verified; full baseline or feature suite not rerun.

### Special Orders source map (pinned source at pre-M2 head ba3a5f2f109aa4e8d3c271922a9755bb05b5b637)
- special-orders.js blob dd432d6737b918e458bd2aefc020f6d0e912cf1a; GET /customers/search lines 4000–4045 uses 2026-04/search, email/phone/name heuristic, first page 20, raw customer rows and local PostgreSQL enrichment (local ID, Discord, Messenger, WhatsApp, local phone and notes). Shared customer search uses same initial endpoint but paginates; projection omits PII. Not a drop-in replacement for UI. Preserve local enrichment and response fields under authorized route.
- GET /customers/:lightspeedId/profile lines 4105–4111 is local PostgreSQL lookup, not vendor customer reader. POST create and PATCH profile remain separate mutations.
- lightspeedVersionedFetch default 2026-04 (line 119); getLightspeedCustomer lines 2866–2881 uses versioned customer get and cache, summary at 2857–2864 accepts first_name/firstname, last_name/lastname, name/display_name, email/email_address/contact.email and phone/phone_number/mobile/contact.phone aliases. Existing shared get uses 2.0. Endpoint and shape parity unresolved.
- GET /ordering/lightspeed-context lines 3003 onward uses fulfillment_state=OPEN,STARTED,PICKED,PACKED collection query, then at most 100 sale lookups via versioned fetch, customer cache/fallback, product and local PO demand. Current shared forSale reader is per-sale and not interchangeable with collection search. Keep workflow-owned allocation rules.
- GET /customers/:id/pickup-history lines 769–794 reads customer_pickup_events and preorder joins with 100 most recent events plus all-row summary. Do not infer these from vendor fulfillment status.
- server.js blob 4b567044e649c1a1600c87604dfe71b93106ed3d, GET /api/po/:poId/data lines 436–580: legacy Avery label route queries multiple status/fulfillment filters at /api/2.0/sales, customer details and per-sale fulfillments; combines gross and picked/packed/fulfilled quantities. Not equivalent to shared sales search/PII projection; keep unchanged.
- No actual consumer parity test or route modification yet. Source mapping narrows next candidate to customer search transport substitution with fixture-preserved local enrichment; do not substitute projection for existing UI envelope.

### Remaining blockers / decisions
- Need feature-owned customer search parity fixtures (first-page vs paginated results, field aliases, local enrichment, errors, authorization, PII access). Any change in response size/order requires explicit consumer review.
- Sale state/status may differ semantically in real vendor responses; strict rejection is intentional until verified. Source shapes, exact versions, inactive customer coverage, international phone equivalence and contact ownership remain unverified.
- Credit request-scoped association is not proof of ownership. Deposits/work orders, fulfillment quantities, return/void events and credit history are not implemented; no write methods.
- Core API owns transport/coverage/error envelope and Security owns grants. Manager approval, vendor acceptance and feature regressions required before any mounting/consumer migration.
- Rewards, Split/Recall, Consignment and remaining Preorders parity still pending.

### Deployment / safety
None. No vendor traffic, customer records, database writes/migrations, grants, route mounts, merge or deployment. Existing Special Orders/Rewards behavior unchanged.

### Next recommended action
Build an isolated Special Orders customer-search compatibility fixture preserving legacy first-page behavior and authorized local enrichment, and separately test opt-in paginated candidate behavior; coordinate with feature owner and Core/Security before any real route switch. Do not create a parallel client or modify shared interfaces without approval.

---

## Previous milestone (historical)

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
