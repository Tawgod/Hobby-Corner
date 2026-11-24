## M9 — V6 scoped source and cumulative evidence checkpoint — 2026-11-24

**Status:** Implemented, targeted exact-checkout validation passed 60/60 (11 new); ready for Foundation Manager reconciliation as isolated candidate; no production acceptance. V6 is approved for isolated development, M1–M8 accepted in V6.

- Exact approved V6 parent 0ffe5e3e152174462240021c59f64862af782b03, manager CI 45473105844 346/346. Reviewed baseline blob 195715bc7093d482410564ec762934a5492519d4 and manager blob 206db8c8ad3c088a2dcfb04e153e6971997f6204. Previous #103 unchanged at included 8654430fb458be10cf7a8c47969d7bd238c091db; no missing historical deltas.
- New independent feature/hc-customer-sales-m9-v6-20261124, draft [PR #111](https://github.com/Tawgod/Lightspeed/pull/111) head 1289e2ee08e4b9f6996699dc2f122492bd80a18d, exact V6 base, six ahead/zero behind, open draft mergeable unmerged. Five paths: new services/lightspeed/customerSalesM9.js, tests/customer-sales-m9.test.mjs, docs/CUSTOMER_SALES_M9.md, branch-targeted workflow; append-only tests/customer-sales-evidence.test.mjs. No existing runtime source or shared interfaces edited.
- Narrow test-only projected source admission by actor/tenant/outlet/purpose/field; contact-match permission separate even without disclosure; exact candidate scope and final source projection recheck. Reject extra fields, duplicates, malformed results. Ordinary authorized employee customer contact/notes/financial access retained, restrictions override. M8 raw vendor admission remains conservative and unchanged; actual source filtering, trusted context, independent output authority and atomic freshness semantics require Core/Security coordination.
- Actual Special Orders handler VM compatibility expanded for 20-row first page, enrichment, name/email/phone and later-page failure independence. Existing consumers unchanged. Exact decimal cumulative pickup/return and financial reversal evidence, chronological sequence, original pickup reversal linkage, independent payment/deposit/credit limits, remaining only for explicitly complete matching synthetic revision. No financial eligibility approval, refund/credit/stock effects, settlement, cross-ledger allocation or real completeness implied.
- Tests: 11 new cases (9 new M9 suite +2 existing suite additions). One capped targeted PR validation with inherited customer suites, exact head checkout; [CI 45474142163](https://github.com/Tawgod/Lightspeed/actions/runs/45474142163), job 138729725675, SUCCESS; exact head 1289e2ee08e4b9f6996699dc2f122492bd80a18d independently verified in logs, syntax passed, 60/60 tests, zero failures/skips/cancellations/todo, including all 11 new cases. Test duration 260.256786 ms. No local full checkout or live testing. Manager should add 11 distinct tests (including two appended to existing suite) to next combined candidate; no duplicate historical suites.

### Security and Administration UI inventory / coordination request
Preserve all 66 provisional rows below. Read Security #105 docs/security/S25D_EXECUTION_ACCESS_SCOPE.md exact 1aee4f9f734b221b1c3c5253e8c3466304cd03f5. Customer domain agrees proposed semantic split of sales.return into sales.returns.execute plus actual independent refund/credit/physical effects; payments.refund to sales.payments.reverse only if provider semantics equivalent, otherwise distinct; deposits.modify into collect/reverse/convert, not broad grant; data.export into domain export plus actual field reads; workflow.jobs.configure/execute into domain-scoped jobs.configure/execute candidates; workflow.audit.read into Customer-scoped audit.read candidate, not Security audit. No alias activation, registry changes or role assignments. Exact scopes: customer/sale/line/product/outlet/revision/quantity, original payment/deposit/credit/amount/currency/provider state, export purpose/dataset/destination/fields/tenant, jobs type/schedule/exact run/effects/delegation, audit event/resource/field. UI needs separate source/projection scopes, actual effect dependencies, restriction precedence, scope selectors, independent read/inspection, no raw payment credentials. No new proposed operation ID.
Core coordination: request independent read/disclosure/inspection and trusted related-target derivation contract; preserve M4/M5/M6, no new persistence or execution interface. Inventory coordination: merchandise return and pickup evidence do not authorize physical receipt, allocation or stock adjustment; any financial reversal does not imply physical movement. Domain confirmation recorded here and docs/CUSTOMER_SALES_M9.md; reciprocal acceptance not yet verified. Actual vendor scope, evidence provenance/settlement, cross-ledger caps, current Security enforcement, full endpoint/browser parity and approval policy remain gates.
No merges, deployments, production changes, data access, route switch, real linking/notification/financial or stock effects. Railway metadata not freshly inspected. Next manager reconciliation and reciprocal Core/Inventory/Security scope review, not runtime adoption.

---

## V6 integration hold — manager reconciliation acknowledged, 2026-11-24

**Status:** Assigned M8 complete; preserve exact tested head for V6 integration. V5 remains approved. No further Customer & Sales implementation assigned.

- Reviewed latest manager reconciliation (blob 3dfd2875c46128b821f64f7f170825c11bc9dddf) and Security S2.5C Core M6 review (blob a4b4b01c674e81d1ffb0b275228726f347adf362). Manager independently verified M8 exact-head job 138705062468, 8/8 passing, no changed-path overlap in reviewed candidates.
- Fresh PR #103 read confirms open, draft, mergeable, unmerged, head 8654430fb458be10cf7a8c47969d7bd238c091db, base V5 87f6a94918653a3417ce01205098193eb1ccb35d; six ahead/zero behind, four additive files unchanged. Preserve this pin and all predecessor branches. No new code or CI run required.
- Core M6 conditional acceptance concerns isolated test-only transaction implementation, not runtime authorization. Customer M8 is read-only and does not adopt M6 in this hold. Future financial mutations must consume the coordinated exact tested Core interface, independent current read/reconciliation permissions, immutable actor/tenant/realm/delegation/effect/revision binding, approval where required, safe replay/receipt and unknown outcome handling; no distributed revocation atomicity claim. Actual read adapter, actor namespace, source/output scopes, safe Core envelopes and legacy consumer parity remain outstanding. No new permission identifiers or grant assignments; retain 66-row inventory below, Security-owned registry and owner policy.
- Manager holds V6 assembly pending Core M6 and Inventory M8/Purchasing P-08 adoption and validation. Customer contributes eight tests to next combined suite. V6 not assembled or approved. No merge, deployment, production access, live routes, migrations or mutations. No fresh Railway inspection. Await next manager assignment after combined integration; no owner input required.

---

# Shared Customer & Sales Foundation — M8 V5 checkpoint

**Last verified:** 2026-11-24. **Owner:** Customer & Sales Foundation 2.0. **Status:** M8 implemented, targeted exact-checkout CI passed 8/8; ready for Foundation Manager reconciliation, not production-ready. This checkpoint supersedes the historical V4 transition below.

## Source / baseline
- Approved V5 Tawgod/Lightspeed:test/hc-foundation-combined-v5-20261124@87f6a94918653a3417ce01205098193eb1ccb35d, manager CI 45450851407 299/299 exact checkout. M1–M7 accepted for isolated development. Prior PRs #81/#88/#92/#99 freshly verified open, draft, unmerged at recorded historical pins; #99 unchanged, no missing deltas.
- M8 branch feature/hc-customer-sales-m8-v5-20261124, draft [PR #103](https://github.com/Tawgod/Lightspeed/pull/103), head 8654430fb458be10cf7a8c47969d7bd238c091db; exact V5 base, 6 ahead/0 behind, four additive files, mergeable/open/unmerged. No shared interface, legacy route or production file edits.

## Implemented
- services/lightspeed/offlineCustomerSales.js composes existing M5/M6/M7 projectors and shared search; test-only explicit environment, injected actor/tenant verifier, literal true before source I/O and recheck before output, fixed minimal projections, request correlation. Conservative broad source admission for unsplit raw feeds, exact customer scope for balance/output, no implicit tool grant. Search first-page order/20-item URL preserved; local profile enrichment and actual legacy route array parity not proven.
- Purpose-specific consent, channel status and minimal linkage evidence, no automatic link or notification. Explicit partial pickup events and original reversal linkage, no net quantity, cumulative eligibility, stock or financial effect. Existing payment/deposit/work-order/fulfillment/reversal/credit evidence reused; no real writer or inferred balance.
- docs/CUSTOMER_SALES_M8.md; tests/customer-sales-m8.test.mjs eight targeted cases; one capped PR-only workflow .github/workflows/hc-customer-sales-m8.yml. Core M5 transaction adapter not applicable to pure reads; no competing persistence.

## Testing
- [Targeted CI 45467171632](https://github.com/Tawgod/Lightspeed/actions/runs/45467171632), exact head checkout configured, job 138705062468; SUCCESS; job logs independently verified exact checkout 8654430fb458be10cf7a8c47969d7bd238c091db, Node 22.23.5, syntax check passed, 8/8 tests passed, zero failed/cancelled/skipped/todo, 99.630768 ms test duration. Local Git checkout unavailable (DNS); no reconstructed dependency doubles used. No other CI initiated. Manager should include M8 test file in next combined run (V5 +8 customer cases).
- No actual Security, provider, browser or feature acceptance; no full route parity verified.

## Security and administration UI inventory — delta from consolidated 66-row Customer inventory
- Preserve all 66 provisional rows below unchanged. No new identifier, alias, grant, role or assignment. Existing customers.search/read/contacts.read/custom-fields.read/notes.read require broad source scope for raw unsplit search; customer-specific search/read checks before output. This deliberately over-restricts basic search and must not be treated as approved default. UI must distinguish minimal search, raw source access, per-result/field scope, export and ordinary employee policy.
- customers.identity.read provider scope; customers.consent.read purpose/channel scope; raw provider filtering and provenance not proved. sales.read, customers.read, sales.payments.read, sales.deposit.read, sales.work-orders.read, fulfillments.read, sales.reversals.read, sales.returns.read, store-credit.read independently required in composite fixture; all relevant source grants before unsplit I/O, exact customer scope before balance, rechecks before projection. This is conservative even for guest workflows; narrow source adapters and exact all-of semantics require Security/Core coordination. No tool-specific bypass.
- Pickup evidence currently uses fulfillments.read; Security to decide independently scoped pickup read versus shared fulfillment read. Existing confirm/reverse operations remain separate; no new ID. Preserve aliases contact(s), consent update/modify, refund/reverse, credit issue/post and other manager reconciliation queue; no automatic mapping. All active employees may view wholesale cost through ordinary authorized product access; modification separate.
- Administration UI needs source-vs-output scopes, actor/tenant/outlet/customer/sale/line, channel/purpose/provider, dependency/conflict warnings and denied/expired/revoked handling; actual Security adapter, trusted server context, atomic/current multi-grant decision semantics, Core safe envelope mapping, per-field source filtering and endpoint/bulk/delegated bypass tests remain unresolved. Synthetic test-only verifier does not establish actual enforcement or audit durability.

## Deployment / remaining gates
None. No merge, deploy, live data, grant, route mounting, schema, stock, payment, credit or notification effect. Railway metadata inherited from previous checkpoint, not freshly inspected. Next: manager reconciliation for isolated candidate only; source filtering, exact legacy parity, authorization contract and provider semantics remain gates. No production acceptance.

---

# Shared Customer & Sales Foundation — Transition checkpoint

**Last verified:** 2026-11-24. **Successor:** Customer & Sales Foundation 2.0. **Status:** M7 implemented, manager reviewed, V5 combined validation/approval pending. Transition only; no new development authorized or performed.

## Purpose and ownership
Own reusable business-domain customer search/matching, customer records and duplicate-safe creation/update design, customer external-account linkage and consent evidence, customer-sale association, sales/work orders/deposits/payments, fulfillment and partial pickup, returns/voids and store-credit/reversal evidence and eventual authorized domain mutation contracts. Preserve Special Orders, Rewards and all current consumers. Customer business linkage is not employee or customer authentication. Security exclusively owns identities/authentication/roles/grants/authorization/admin UI; Core owns transport, pagination, envelopes, audit/idempotency/transactions/outbox and shared fixture adapters; Inventory owns physical stock effects; Catalog owns product and supplier identity/cost effects; Purchasing owns PO/invoice/receipt boundary; feature owners retain workflow-specific data and policies. Manager coordinates cross-domain contracts and sequencing.

## Exact baseline and reconciliation
- Canonical approved V4: Tawgod/Lightspeed:test/hc-foundation-combined-v4-20261124@b56d4f69332f768a66987668293088eb51a60ecc; manager CI 45442532299, 266/266, exact checkout. V5 is NOT approved at transition. Manager handoff blob 67901444dd0d7951ccf9a8be65a92282d1b0eb9d records reviewed V5 candidate #94/#95/#96/#97/#99, 299 expected tests, not combined validated yet.
- Verified all four PRs open, draft, mergeable, unmerged:
  - #81 feature/hc-customer-sales-m1-20261124 @ 1c979a7d6a02d8e974b7f8af1a3591a3c2835028 (V1 parent 71a1cd6e312ed52efc1e9af9da85db6b02e3756c).
  - #88 feature/hc-customer-sales-m5-v2-20261124 @ 2f2750ee703556c1ea2eab60f3d6edd14bbe82ea (V2 parent 2365de8af4e8d69b162f6909d1f78be246e74fdf).
  - #92 feature/hc-customer-sales-m6-v3-20261124 @ 518ac1d0e6985852f80d375c9ce922d47fc40296 (V3 parent 098c9e51ea4c3449605ad6951baa8284e126e8d4).
  - #99 feature/hc-customer-sales-m7-v4-20261124 @ bb11757bfef5a54c28d27f72647ec2f4c3586d2d (V4 parent above). Exactly matches manager reviewed candidate. No newer deltas.
- M1–M6 already included in V4, M7 pending V5 acceptance; do not cherry-pick duplicated changes or rebuild. Preserve original #32/#33/#51 and all foundation branches/PRs. No new branch until next approved baseline/assignment verified. Next proposed M8 controlled offline consumer integration/scoped read admission, NOT yet assigned or authorized for actual route switch. If V5 remains pending, stop at manager gate; if approved, follow new assignment and exact pin, compare newer work before branching.

## Current architecture and evidence
- Existing domain readers customers.js, sales.js, fulfillments.js, storeCredit.js under services/lightspeed; shared customer get/search/searchFirstPage for all future tools, optional correlation. customerSalesEvidence.js M1/M2 strict association/minimal projections; M3/M4 search compatibility and actual route-source test-only in-memory Special Orders substitution; customerIdentityEvidence.js M5 linkage/consent statuses; saleWorkflowEvidence.js M6 separates payment/deposit/work-order/physical evidence; reversalEvidence.js M7 separates return/void/payment/deposit/credit events, validates references, source-confirmed balance only. All internal candidates, no production wiring. Legacy raw readers require field authorization; no automatic linking/creation or sending. core.v1 and localTransactionCandidate are Core-owned internal candidates. No vendor side effects inside local transactions.
- V1 51/51; V2 187/187 (20 Customer tests); V3 223/223 (+7 Customer M5); V4 266/266 (+7 Customer M6). Combined exact checkout resolved earlier reconstruction limitations. M7 reported 7/7 local with five verified blobs and two minimal inherited error-class doubles; latest PR-run lookup at #99 returned empty, not proof of no other runs. No full exact-checkout M7 result; next manager combined run must include tests/customer-sales-m7.test.mjs. Do not claim 299 passed until verified. No additional CI workflow.
- Read-only Railway metadata freshly checked: Hobby Corner production project f7e91de7-43f6-472e-b4ca-46b0623f8e0e, environment c562fbb2-8431-4beb-834d-6938b3a2ad10; lightspeed-api latest SUCCESS deployment 288d5089-62d4-4f22-9c7f-8fdd26d8574d; special-orders-test latest SUCCESS 201d651f-62b6-43c5-aba3-59fd97f6fe09. Both metadata report integration/hobby-corner-consolidation@014a7a949fe570b756b48d8f59995c1b0a434859, Nov 4. Existing Rewards/Discord/Postgres/Timeclock services listed, not runtime tested. No production data accessed, no staged changes applied, no runtime health or current config acceptance asserted. No foundation deployment.
- Legacy dependencies: special-orders.js customer routes, profile/pickup history and ordering context; server.js Avery PO labels; routes/orderSplit.js, workOrderCombine.js, depositConversion.js; services/lightspeedApi.js; Rewards Python client in Hobby-Corner-Discord-Bot; Consignment draft #30 and Preorders/GW, future Repairs/Reservations, notification and caller-ID consumers. Keep feature local enrichment outside shared reader. Existing first-page array shape/order and local profile fields must be reviewed with feature owner; malformed responses fail rather than false empty. Other consumer parity, actual endpoint inventory and vendor versions/shapes remain unresolved.

## Policy and coordination
- User explicitly requires reusable customer search available across tools. Ordinary active employees can view wholesale costs with product access; separate cost mutation grant. Restriction applies across all direct/indirect/bulk/import/automation paths; all actual effects require grants, current verified actor, scopes, execution-time recheck, audit and no service/tool bypass. No assumed role/grant or automatic alias mapping. Keep cumulative 66-row inventory below, all provisional. Manager consolidated it in FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md (blob 1306922eaf8f2a2e0c24e8f179fcc92b402b86db), source inventory pin remains prior blob 3921bebe4deb02eec7087662d1ff306b512b043b; transition adds no permission changes. Security Foundation 2.0 owns final decisions, separately based; consult current Security handoff, do not assume later chat decisions are canonical until verified. Resolve aliases (contact(s), consent update/modify, payment refund/reverse, credit issue/post, jobs/audit, product and inventory operations) through manager/Security, never runtime automatic aliases. Current inventory suggested employee defaults/approval thresholds are proposals only, not approved policy.
- Consignment existing documented business policy: 80% of verified sale proceeds after 72h, reconcile returns/voids before posting; preserve per-category return policies and uncertain cases for owner review. No calculation or actual issuance. Payment is not automatically deposit; picked/packed/fulfilled not pickup; financial reversal not physical stock movement; missing data is unknown, not zero. Opt-out dominates conflicting supplied consent in draft, no permission to send; re-consent/authoritative provenance pending.
- Remaining blockers: actual Security scoped all-of read admission before corresponding I/O/output; composite reversal label alone insufficient. Actual consumer parity, source authenticity, chronological/aggregate quantity/amount caps, global uniqueness, refund/settlement, credit history, partial pickup, cross-customer link uniqueness, consent purpose/freshness, durable mutation execution/readback/replay/unknown recovery, reproducible dependencies and controlled tenant isolation. Core M5 seam under candidate review, not approved production adapter. No actual grants, route mounting, merges, deployment, live business data, shared-environment migrations or production mutations absent explicit authorization. No unrelated development during transition.

## Canonical documents and continuation references
- Tawgod/Hobby-Corner:main FOUNDATION_DEVELOPMENT_BASELINE.md, FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md, handoffs/foundation-manager.md, handoffs/TEMPLATE.md, handoffs/customer-sales-foundation.md, SHARED_TOOL_DEPENDENCIES.md (F17–F19,F22–F24,F27–F30), LIGHTSPEED_SHARED_SERVICES.md, handoffs/lightspeed-shared-services.md, handoffs/core-api-foundation.md, handoffs/consignment.md and relevant feature/Security handoffs.
- Tawgod/Lightspeed approved baseline docs/FOUNDATION_COMBINED_V4_SNAPSHOT.md, docs/SHARED_CUSTOMER_SEARCH.md, docs/CUSTOMER_IDENTITY_M5.md, docs/CUSTOMER_SALES_M6.md, docs/CORE_API_M3_SECURITY_COORDINATION.md, docs/CORE_API_M4_TRANSACTION_CONTRACT.md; #99 docs/CUSTOMER_SALES_M7.md. Recheck latest source manifest and manager assignments.
- Transition completion: handoff preserves M7 detail and full inventory/history below. No unfinished ownership ambiguity: successor owns all Customer/Sales open work, manager owns baseline acceptance, Security/Core/Inventory/feature owners retain boundaries. Ready to retire old chat after successor verifies this handoff and manager records outstanding V5 gate; do not treat M7 as accepted baseline or start M8 without assignment.

---

# Shared Customer & Sales Foundation — Current Handoff

## M7 — V4 return, void and credit evidence (2026-11-24)

**Status:** Implemented on independent V4 branch; seven targeted offline tests pass with dependency-double limitations; ready for manager reconciliation, not production acceptance.

### Source
- V4 exact parent Tawgod/Lightspeed:test/hc-foundation-combined-v4-20261124@b56d4f69332f768a66987668293088eb51a60ecc; combined CI 45442532299 266/266 at parent, not new head.
- Reviewed baseline, manager, TEMPLATE, own handoff, shared dependencies F17–F19/F22–F24/F27–F30, shared service architecture, V4 manifest, Core M4 contract, Consignment handoff and legacy deposit conversion/client source.
- #92 head 518ac1d0e6985852f80d375c9ce922d47fc40296 exactly equals included V4 pin. No newer deltas. Previous branches and PRs preserved.
- Branch feature/hc-customer-sales-m7-v4-20261124; head bb11757bfef5a54c28d27f72647ec2f4c3586d2d; draft [PR #99](https://github.com/Tawgod/Lightspeed/pull/99), exact V4 base b56d4f69332f768a66987668293088eb51a60ecc, mergeable=true, unmerged; 4 changed files.

### Implemented
- services/lightspeed/reversalEvidence.js: normalized read-only merchandise returns separated from void/payment/deposit/credit financial events. Exact sale/customer/line/product/payment/deposit/work-order/fulfillment references, duplicate rejection, original credit event same customer/sale/currency, explicit snapshot ownership; no derived refund, net credit, inventory movement or execution authority. Guest skips credit read. Existing M6 and reusable customer/consent readers unchanged.
- storeCredit.js optional correlationId, existing path/envelope preserved. docs/CUSTOMER_SALES_M7.md contract. No provider adapter or financial writer.
- Legacy deposit conversion modifies sale payment and posts credit; Consignment requires 80% verified proceeds after 72h and return/void reconciliation. Neither workflow changed nor eligibility calculated.

### Tested
- Actual local Node v22.16.0 node --test tests/customer-sales-m7.test.mjs: **7/7 PASS**, zero failed/skipped/cancelled, 133.185344 ms. Tests cover physical vs financial effects, reference/currency consistency, duplicates, snapshot ownership/privacy, synthetic denial across Consignment/Special Orders/Split-Recall/API/import/automation, revocation, correlation, guest.
- Five local files matched GitHub blobs: reversalEvidence.js 06c5f3d0efb80d68902cc5ff54b20a9d88f7affb; test c0b01a707e05d71d632689bce6c33e90c062f094; storeCredit.js 81e7c8537af2b9426fbdb2d25d3325d52eccadad; inherited saleWorkflowEvidence.js faeea7c48f8b8274a0554cf985cf6ad913a641a1; coreReadContract.js 43b3b19286a902d07d737c662c10ef3c99d260d3. Local client.js/readCollection.js minimal error-class doubles, not full checkout. No prior-suite rerun, PG needed for this pure read model, or remote CI. Add test to combined run (273 if only this delta). No additional workflow.
- No browser, live data, runtime or production acceptance.

### Deployment
None. No merge, deployment, live data, real grants, route mount, account link, notification, payment/credit/stock effect or migration.

## Cumulative Security and administration UI dependencies

All identifiers and suggested roles below are **provisional**, not approved Security contracts or assignments. Only the owner-approved ordinary employee wholesale cost viewing policy is established; cost modification separate. Security exclusively owns final roles, grants, precedence, identity, scope, authorization and administration UI. Each operation independently assignable/restrictable; defaults are recommendations, not enacted grants. Every row applies to direct API, indirect workflows, bulk/import and queued/delegated automation whenever supported; listed tools are known/planned consumers, not a verified exhaustive live endpoint map. Unsupported/unmapped paths must remain denied or unchanged pending migration review. Roles such as staff, service lead, cashier, finance, manager are suggested bundles only. Scope is always tenant and environment bound; outlet/location applies where data has such association. No cross-outlet access inferred; customer portal self-service requires verified customer identity distinct from employee identity. No broad tool grant or service actor may bypass denied underlying operation.

| Proposed canonical operation | UI label / description | Consumers and entrypoints | Suggested grouping / ordinary default | Individual grants/restrictions | Resource/field/location/environment scope | Prerequisites / approval | Evidence / gap |
|---|---|---|---|---|---|---|---|---|
| customers.search | Find customers / match candidates | Special Orders, Preorders, Consignment, Repairs, Reservations, Rewards, Back-in-Stock, Split/Recall, caller-ID lookup; direct API, indirect, bulk/import and automation if supported | Staff: allow scoped basic search | Independently grant/restrict this operation; Customer/outlet; minimal name/contact match; no export | Customer/outlet; minimal name/contact match; no export; tenant/environment explicit | None; exact-ID review before linking | M3/M4/M5; search fixture, no actual auth |
| customers.read | View customer profile | All customer-facing workflows above, portal self-service; direct API, indirect, bulk/import and automation if supported | Staff: basic operational; customer: own verified record only | Independently grant/restrict this operation; Customer, contact field allowlist; notes restricted | Customer, contact field allowlist; notes restricted; tenant/environment explicit | Search not required for known ID | M1/M5; raw vendor reader not public |
| customers.contacts.read | View customer contact details | Special Orders, Preorders, Repairs, Reservations, Consignment, notification workflows; direct API, indirect, bulk/import and automation if supported | Staff: operational need; no bulk | Independently grant/restrict this operation; Customer; email/phone/address/social fields; redact unnecessary fields | Customer; email/phone/address/social fields; redact unnecessary fields; tenant/environment explicit | customers.read; consent separate | M5 excludes raw PII; field grant unimplemented |
| customers.notes.read | View restricted customer notes | Special Orders, customer service, Repairs; direct API, indirect, bulk/import and automation if supported | Restricted service lead | Independently grant/restrict this operation; Customer; note classification | Customer; note classification; tenant/environment explicit | customers.read | Legacy local enrichment; no field enforcement proved |
| customers.create | Create customer / duplicate review | Special Orders, Rewards, Consignment, Repairs, Reservations, Preorders, imports; direct API, indirect, bulk/import and automation if supported | Restricted customer-service staff | Independently grant/restrict this operation; Outlet, tenant, allowed fields | Outlet, tenant, allowed fields; tenant/environment explicit | customers.search; verified duplicate checks; review ambiguity | Legacy create route; no canonical writer |
| customers.update | Edit customer data | Same; profile sync and imports; direct API, indirect, bulk/import and automation if supported | Restricted customer-service staff | Independently grant/restrict this operation; Customer, editable fields; sensitive notes separate | Customer, editable fields; sensitive notes separate; tenant/environment explicit | customers.read; reviewed diff; contact changes reverify | Legacy PATCH; writer gap |
| customers.notes.update | Edit customer notes | Special Orders, Repairs, service workflows; direct API, indirect, bulk/import and automation if supported | Restricted service staff | Independently grant/restrict this operation; Customer, note category | Customer, note category; tenant/environment explicit | customers.update if same operation modifies profile | Legacy local notes; no scoped enforcement |
| customers.merge | Merge duplicate customer records | Customer admin, Rewards sync, migration; direct API, indirect, bulk/import and automation if supported | Manager only | Independently grant/restrict this operation; Both customer IDs; sale/credit/link effects | Both customer IDs; sale/credit/link effects; tenant/environment explicit | customers.read/update; explicit reviewed approval, financial and linkage effects separately granted | Planned; no implementation |
| customers.archive | Archive customer (not hard delete) | Customer admin, migration; direct API, indirect, bulk/import and automation if supported | Manager only | Independently grant/restrict this operation; Exact customer; retention/legal holds | Exact customer; retention/legal holds; tenant/environment explicit | Reviewed approval; linked obligations checked | Planned; delete semantics undecided |
| customers.export | Export customer data | Reporting, admin, migrations, bulk download; direct API, indirect, bulk/import and automation if supported | Restricted manager/privacy lead | Independently grant/restrict this operation; Purpose, field list, row count, outlet, destination | Purpose, field list, row count, outlet, destination; tenant/environment explicit | Underlying read grants; explicit export approval | Planned; no export path audit |
| customers.identity.read | View linkage status | Rewards, Discord, Special Orders, Consignment, portal, notifications; direct API, indirect, bulk/import and automation if supported | Scoped service staff | Independently grant/restrict this operation; Customer/provider, no external IDs by default | Customer/provider, no external IDs by default; tenant/environment explicit | customers.read; provider ID access separately scoped | M5 synthetic Core read; no provider |
| customers.identity.verify | Verify external identity evidence | Same; staff review; direct API, indirect, bulk/import and automation if supported | Restricted identity-review staff | Independently grant/restrict this operation; Customer/provider/external account | Customer/provider/external account; tenant/environment explicit | customers.identity.read; authoritative proof | Planned, no identity/auth implementation |
| customers.identity.link | Link external customer account | Same; Rewards synchronization; direct API, indirect, bulk/import and automation if supported | Restricted reviewer; customer self-service only through approved Security | Independently grant/restrict this operation; Customer/provider/account; uniqueness | Customer/provider/account; uniqueness; tenant/environment explicit | verify; approval when ambiguous; recheck | No writer; M5 conflicts only |
| customers.identity.unlink | Revoke customer account linkage | Same; account removal; direct API, indirect, bulk/import and automation if supported | Restricted reviewer; own account subject to policy | Independently grant/restrict this operation; Customer/provider/account | Customer/provider/account; tenant/environment explicit | identity.read; verify actor; reviewed impact | No writer |
| customers.consent.read | View communication preferences | Notifications, Rewards, Special Orders, Consignment, Preorders, Back-in-Stock, Repairs, Reservations; direct API, indirect, bulk/import and automation if supported | Scoped service staff | Independently grant/restrict this operation; Customer/channel/purpose | Customer/channel/purpose; tenant/environment explicit | customers.read | M5 synthetic; unknown/opt-out |
| customers.consent.update | Record consent or withdrawal | Same; customer portal; imports; direct API, indirect, bulk/import and automation if supported | Restricted service staff or verified self-service | Independently grant/restrict this operation; Customer/channel/purpose/evidence source | Customer/channel/purpose/evidence source; tenant/environment explicit | Consent read; authoritative evidence; withdrawal must not require marketing opt-in | No writer; re-consent policy pending |
| customers.custom-fields.read | Read customer custom fields | Rewards, Discord, customer admin; direct API, indirect, bulk/import and automation if supported | Scoped service/rewards | Independently grant/restrict this operation; Customer; named fields | Customer; named fields; tenant/environment explicit | customers.read | Existing Rewards Python client; unmapped |
| customers.custom-fields.update | Edit customer custom fields | Rewards sync, customer admin/imports; direct API, indirect, bulk/import and automation if supported | Restricted Rewards operator | Independently grant/restrict this operation; Customer; field allowlist | Customer; field allowlist; tenant/environment explicit | customers.update where applicable; idempotency | Existing feature client; canonical gap |
| customers.custom-fields.configure | Configure customer field definitions | Rewards, admin; direct API, indirect, bulk/import and automation if supported | Manager/configuration role | Independently grant/restrict this operation; Tenant, field definition | Tenant, field definition; tenant/environment explicit | Reviewed schema change; Security owns grants | Planned; no shared adapter |
| sales.read | View sales and line items | Special Orders, Preorders, Split/Recall, Consignment, Repairs, Rewards, Inventory reconciliation; direct API, indirect, bulk/import and automation if supported | Staff: scoped operational | Independently grant/restrict this operation; Sale/customer/outlet; restricted financial fields | Sale/customer/outlet; restricted financial fields; tenant/environment explicit | customers.read only if customer details exposed | M1/M6; single-page, no actual auth |
| sales.create | Create sale / customer order | Special Orders, Preorders, Repairs, Split/Recall, POS integrations; direct API, indirect, bulk/import and automation if supported | Restricted sales operator | Independently grant/restrict this operation; Outlet, sale type, customer, product | Outlet, sale type, customer, product; tenant/environment explicit | Customer/product read; create customer/product separately; approval for exceptional effects | Legacy client; no canonical writer |
| sales.update | Modify sale / order lines | Same, combine/split, imports; direct API, indirect, bulk/import and automation if supported | Restricted sales operator | Independently grant/restrict this operation; Sale/outlet/line/status/fields | Sale/outlet/line/status/fields; tenant/environment explicit | sales.read; separate payment, price/cost, stock grants when affected | Legacy update; no canonical writer |
| sales.approve | Approve sale change proposal | Special Orders, Split/Recall, Preorders, Repairs; direct API, indirect, bulk/import and automation if supported | Manager/lead | Independently grant/restrict this operation; Sale/revision/effect limits | Sale/revision/effect limits; tenant/environment explicit | Read and reviewed diff; approval not execution | Planned; Core candidate |
| sales.split | Split order | Split/Recall, partial pickup, Special Orders; direct API, indirect, bulk/import and automation if supported | Restricted sales lead | Independently grant/restrict this operation; Original/new sales, exact line IDs/outlet | Original/new sales, exact line IDs/outlet; tenant/environment explicit | sales.read/create/update, payment/deposit/credit/fulfillment grants if affected; reviewed approval | Legacy orderSplit route; no shared enforcement |
| sales.recall | Recall order | Split/Recall, Special Orders; direct API, indirect, bulk/import and automation if supported | Restricted sales lead | Independently grant/restrict this operation; Sale/outlet/state | Sale/outlet/state; tenant/environment explicit | sales.read/update; payment/fulfillment grants if effects; approval | Legacy workflow; mapping incomplete |
| sales.combine | Combine orders | WorkOrderCombine, Special Orders, Repairs; direct API, indirect, bulk/import and automation if supported | Restricted sales lead | Independently grant/restrict this operation; All source/target sales; same customer/outlet policy | All source/target sales; same customer/outlet policy; tenant/environment explicit | sales.read/create/update; payment/fulfillment grants if affected; approval | Legacy preview; no execution proof |
| sales.void | Void sale | POS, Split/Recall, Consignment reconciliation; direct API, indirect, bulk/import and automation if supported | Manager/financial lead | Independently grant/restrict this operation; Sale/outlet/amount limits | Sale/outlet/amount limits; tenant/environment explicit | sales.read/update; payment/credit/stock effects separately; approval and readback | M7 evidence only; legacy state semantics unresolved |
| sales.export | Export sale/order history | Reporting, Rewards, reconciliation, imports/exports; direct API, indirect, bulk/import and automation if supported | Restricted finance/reporting | Independently grant/restrict this operation; Outlet/date/fields/row limit | Outlet/date/fields/row limit; tenant/environment explicit | sales.read and relevant financial/customer field grants; approval | Planned |
| sales.work-orders.read | View work orders | Special Orders, Repairs, Preorders, Split/Recall; direct API, indirect, bulk/import and automation if supported | Staff: scoped | Independently grant/restrict this operation; Work order/customer/outlet | Work order/customer/outlet; tenant/environment explicit | sales.read if linked sale exposed | M6 supplied evidence |
| sales.work-orders.create | Create work order | Special Orders, Repairs, Preorders; direct API, indirect, bulk/import and automation if supported | Restricted service staff | Independently grant/restrict this operation; Customer/outlet/type | Customer/outlet/type; tenant/environment explicit | sales.create if creates sale; product/customer create separate | Planned |
| sales.work-orders.update | Edit work order | Same; combine/recall; direct API, indirect, bulk/import and automation if supported | Restricted service staff | Independently grant/restrict this operation; Work order/revision/status | Work order/revision/status; tenant/environment explicit | sales.update if sale effects; approval for exceptional changes | Planned |
| sales.work-orders.close | Close/cancel work order | Same; pickups; direct API, indirect, bulk/import and automation if supported | Restricted service lead | Independently grant/restrict this operation; Work order/outlet/state | Work order/outlet/state; tenant/environment explicit | Update; pickup/payment/void grants if effects | Planned |
| sales.payments.read | View payment evidence | Split/Recall, Special Orders, Preorders, finance, Consignment review; direct API, indirect, bulk/import and automation if supported | Restricted financial/operational need | Independently grant/restrict this operation; Sale/outlet/payment; no card details | Sale/outlet/payment; no card details; tenant/environment explicit | sales.read | M6/M7; no settlement proof |
| sales.payments.collect | Collect payment | POS, Preorders, Special Orders, Repairs; direct API, indirect, bulk/import and automation if supported | Restricted cashier | Independently grant/restrict this operation; Sale/outlet/currency/amount | Sale/outlet/currency/amount; tenant/environment explicit | sales.read/update if affected; payment provider rules | No shared writer |
| sales.payments.modify | Modify payment record | Deposit conversion, Split/Recall, finance; direct API, indirect, bulk/import and automation if supported | Restricted finance lead | Independently grant/restrict this operation; Payment/sale/outlet/amount | Payment/sale/outlet/amount; tenant/environment explicit | payments.read; sales.update; approval/reconciliation | Legacy depositConversion; no actual shared auth |
| sales.payments.reverse | Reverse/refund payment | Returns, voids, deposit conversion, POS; direct API, indirect, bulk/import and automation if supported | Restricted finance lead | Independently grant/restrict this operation; Original payment, amount/currency/outlet | Original payment, amount/currency/outlet; tenant/environment explicit | payments.read/modify as applicable; approval and readback | M7 evidence only |
| sales.deposit.read | View deposit evidence | Special Orders, Preorders, Split/Recall, Repairs; direct API, indirect, bulk/import and automation if supported | Scoped cashier/service staff | Independently grant/restrict this operation; Sale/customer/outlet/amount | Sale/customer/outlet/amount; tenant/environment explicit | sales.read; payments.read if payment details exposed | M6; source adapter missing |
| sales.deposit.collect | Collect deposit | Same; POS; direct API, indirect, bulk/import and automation if supported | Restricted cashier | Independently grant/restrict this operation; Sale/customer/outlet/amount | Sale/customer/outlet/amount; tenant/environment explicit | payments.collect, sales.update when effect; policy | M6 synthetic denial only |
| sales.deposit.reverse | Reverse deposit | Same; cancellations/returns; direct API, indirect, bulk/import and automation if supported | Restricted finance lead | Independently grant/restrict this operation; Original deposit/payment/outlet/amount | Original deposit/payment/outlet/amount; tenant/environment explicit | payments.reverse or modify as effect; approval | M7 evidence only |
| sales.deposit.convert | Convert deposit to store credit | Split/Recall, Special Orders, cancellations; direct API, indirect, bulk/import and automation if supported | Restricted finance lead | Independently grant/restrict this operation; Sale/customer/payment/credit amount/currency | Sale/customer/payment/credit amount/currency; tenant/environment explicit | deposit.read/reverse or modify, payments.modify, sales.update, store-credit.issue; explicit approval, readback/unknown state | Legacy depositConversion; M7 no execution |
| fulfillments.read | View fulfillment and pickup evidence | Special Orders, Preorders, Split/Recall, Consignment, Repairs, notifications, Inventory; direct API, indirect, bulk/import and automation if supported | Staff: scoped | Independently grant/restrict this operation; Sale/line/outlet/location | Sale/line/outlet/location; tenant/environment explicit | sales.read when sale data exposed | M1/M6 single-page |
| fulfillments.update | Mark pick/pack/ready state | Special Orders, Preorders, Repairs, Backroom; direct API, indirect, bulk/import and automation if supported | Scoped fulfillment staff | Independently grant/restrict this operation; Assigned outlet/location/line | Assigned outlet/location/line; tenant/environment explicit | fulfillments.read; Inventory grants if actual effects; no automatic stock | Planned |
| fulfillments.pickup.confirm | Confirm full/partial customer pickup | Special Orders, Preorders, Repairs, Split/Recall; direct API, indirect, bulk/import and automation if supported | Scoped fulfillment staff | Independently grant/restrict this operation; Sale/line/quantity/outlet | Sale/line/quantity/outlet; tenant/environment explicit | fulfillments.read/update if affected; verified customer/event; financial/stock grants separately | Local pickup history exists; no common writer |
| fulfillments.pickup.reverse | Correct/reverse pickup | Same; discrepancy review; direct API, indirect, bulk/import and automation if supported | Restricted fulfillment lead | Independently grant/restrict this operation; Original pickup/line/quantity/outlet | Original pickup/line/quantity/outlet; tenant/environment explicit | Pickup read; approval and inventory effects separately | Planned |
| sales.reversals.read | View return and reversal evidence | Consignment, Split/Recall, Special Orders, Preorders, Repairs, finance, Inventory; direct API, indirect, bulk/import and automation if supported | Restricted financial/operations read | Independently grant/restrict this operation; Sale/customer/outlet, event types and fields | Sale/customer/outlet, event types and fields; tenant/environment explicit | sales.read plus payments/deposit/fulfillments/store-credit.read according to actual I/O | M7 composite fixture only; all-of gap |
| sales.returns.read | View merchandise return evidence | Same; POS, Inventory; direct API, indirect, bulk/import and automation if supported | Scoped service staff | Independently grant/restrict this operation; Sale/line/outlet/return event | Sale/line/outlet/return event; tenant/environment explicit | sales.read; fulfillment read if exposed | M7 physical evidence only |
| sales.returns.approve | Approve return request | POS, Consignment, Repairs, Special Orders; direct API, indirect, bulk/import and automation if supported | Manager/service lead | Independently grant/restrict this operation; Sale/line/quantity, policy/time window, outlet | Sale/line/quantity, policy/time window, outlet; tenant/environment explicit | returns.read; reviewed evidence and policy exception approval | Planned |
| sales.returns.execute | Record merchandise return | Same; direct API, bulk correction; direct API, indirect, bulk/import and automation if supported | Restricted returns operator | Independently grant/restrict this operation; Original sale/line/quantity/outlet | Original sale/line/quantity/outlet; tenant/environment explicit | returns.approve when policy requires; sales.update; payment/credit/Inventory operations separately | M7 no physical effects |
| store-credit.read | View balance / transaction evidence | Consignment, Special Orders, Split/Recall, Rewards, portal self-service; direct API, indirect, bulk/import and automation if supported | Restricted operational/finance read; own verified portal balance | Independently grant/restrict this operation; Customer, currency, balance vs history fields | Customer, currency, balance vs history fields; tenant/environment explicit | customers.read as needed; scoped ownership | M1/M7; request-scoped unknown; no ledger |
| store-credit.approve | Approve credit proposal | Consignment 72h workflow, deposit conversion, returns; direct API, indirect, bulk/import and automation if supported | Finance/manager | Independently grant/restrict this operation; Customer/sale/reason/amount/currency; policy/revision | Customer/sale/reason/amount/currency; policy/revision; tenant/environment explicit | store-credit.read; verified sale/return evidence; approval cannot issue | Planned |
| store-credit.issue | Issue store credit | Consignment worker, deposit conversion, returns, POS; direct API, indirect, bulk/import and automation if supported | Restricted finance executor or delegated job | Independently grant/restrict this operation; Customer/sale/amount/currency/reason/outlet | Customer/sale/amount/currency/reason/outlet; tenant/environment explicit | Approval/policy; canonical sale/financial reads; durable idempotency/readback; execution-time grant | M7 denial fixture only; legacy client POST |
| store-credit.reverse | Reverse credit transaction | Consignment returns/voids, finance; direct API, indirect, bulk/import and automation if supported | Restricted finance executor | Independently grant/restrict this operation; Original transaction/customer/currency/amount | Original transaction/customer/currency/amount; tenant/environment explicit | store-credit.read/approve; original linkage; idempotency/readback | M7 evidence only |
| store-credit.redeem | Redeem customer credit | POS, Special Orders, Preorders; direct API, indirect, bulk/import and automation if supported | Restricted cashier | Independently grant/restrict this operation; Customer/sale/amount/currency/outlet | Customer/sale/amount/currency/outlet; tenant/environment explicit | store-credit.read, sales.payments.collect or modify as effect; verified customer | Planned; vendor semantics pending |
| store-credit.reconcile | Review unknown/duplicate credit outcome | Finance, Consignment worker, deposit conversion; direct API, indirect, bulk/import and automation if supported | Restricted finance reviewer | Independently grant/restrict this operation; Original operation/transaction/customer | Original operation/transaction/customer; tenant/environment explicit | Read and immutable audit; separate issue/reverse if correction needed | Planned; Core unknown-outcome contract |
| notifications.preview | Preview transactional message | Special Orders, Preorders, Consignment, Rewards, Repairs, Reservations, Back-in-Stock; direct API, indirect, bulk/import and automation if supported | Scoped service staff | Independently grant/restrict this operation; Customer/channel/template/purpose | Customer/channel/template/purpose; tenant/environment explicit | Consent read; contact field grant as needed | M5 no send; provider absent |
| notifications.send | Send transactional notification | Same; Discord/email/SMS workers; direct API, indirect, bulk/import and automation if supported | Restricted service staff or delegated worker | Independently grant/restrict this operation; Customer/channel/purpose/template/outlet | Customer/channel/purpose/template/outlet; tenant/environment explicit | Consent and verified destination; execution-time grant, dedupe | Existing partial feature senders; shared gap |
| notifications.configure | Configure templates/channel rules | Same; admin; direct API, indirect, bulk/import and automation if supported | Manager/configuration role | Independently grant/restrict this operation; Tenant/channel/template/purpose | Tenant/channel/template/purpose; tenant/environment explicit | Reviewed change; no provider credential access implied | Planned; coordinate notification owner |
| notifications.history.read | View delivery status | Same; staff support; direct API, indirect, bulk/import and automation if supported | Scoped service staff | Independently grant/restrict this operation; Customer/job/channel, redacted payload | Customer/job/channel, redacted payload; tenant/environment explicit | Consent/contact scopes where exposed | Planned |
| workflow.jobs.configure | Configure customer/sale automation | Consignment delayed credit, Rewards sync, preorder/notification jobs; direct API, indirect, bulk/import and automation if supported | Manager/configuration role | Independently grant/restrict this operation; Job/schedule/tenant/outlet/allowed effects | Job/schedule/tenant/outlet/allowed effects; tenant/environment explicit | Underlying effect grants not inherited; Security delegation approval | Core/feature ownership; shared gap |
| workflow.jobs.execute | Run delegated customer/sale job | Same; imports/queued automation; direct API, indirect, bulk/import and automation if supported | No default; explicit delegated service actor | Independently grant/restrict this operation; Job/resource/environment/expiry/effect list | Job/resource/environment/expiry/effect list; tenant/environment explicit | Every underlying effect grant rechecked, no broad bypass | Core V4 synthetic; actual mapping missing |
| workflow.audit.read | Review customer/sale operation audit | Finance, manager, support, reconciliation; direct API, indirect, bulk/import and automation if supported | Restricted reviewer | Independently grant/restrict this operation; Operation/outlet/date; no raw sensitive payload | Operation/outlet/date; no raw sensitive payload; tenant/environment explicit | Underlying resource scope; audit immutable | Core owns audit; no domain integration |
| products.read | View products including wholesale costs | All employee tools incl Special Orders, Consignment, Repairs, Preorders; direct API, indirect, bulk/import and automation if supported | All active employees ordinary product access | Independently grant/restrict this operation; Outlet/tenant; no anonymous disclosure | Outlet/tenant; no anonymous disclosure; tenant/environment explicit | No elevated cost-view role | Owner approved policy; Catalog/Security implementation pending |
| products.create | Create product (cross-domain) | Special Orders, Consignment, Repairs, Preorders, Scanner, imports; direct API, indirect, bulk/import and automation if supported | Restricted product operator | Independently grant/restrict this operation; Product/variant/supplier/outlet | Product/variant/supplier/outlet; tenant/environment explicit | Catalog duplicate review; other effects separate | Catalog-owned; no domain writer |
| products.update | Edit product (cross-domain) | Same; Consignment deactivation; direct API, indirect, bulk/import and automation if supported | Restricted product operator | Independently grant/restrict this operation; Product/variant/fields | Product/variant/fields; tenant/environment explicit | Catalog identity; cost modification separate | Catalog-owned |
| products.cost.update | Change wholesale cost (cross-domain) | Same; Consignment, Purchasing, imports; direct API, indirect, bulk/import and automation if supported | Restricted cost editor | Independently grant/restrict this operation; Product/supplier/cost fields | Product/supplier/cost fields; tenant/environment explicit | products.update when actual update; review | Proposed label coordinate Catalog |
| inventory.adjust | Adjust stock (cross-domain) | Returns, voids, fulfillment, Consignment, Repairs; direct API, indirect, bulk/import and automation if supported | Restricted inventory operator | Independently grant/restrict this operation; Product/outlet/location/quantity/reason | Product/outlet/location/quantity/reason; tenant/environment explicit | Inventory authoritative physical evidence; approval; no financial inference | Inventory-owned; M7 no stock effect |

### Administration UI dependencies (requirements, not UI implementation)
- Searchable canonical operation catalog with human labels, descriptions, domain/financial/physical/privacy grouping, status (proposed/approved), affected tools, direct/indirect/import/automation effects and shared permission reuse. Show operations not tool-specific duplicates. Display ordinary employee product read including wholesale costs; cost modification separately selectable.
- Role membership and proposed bundles, individually assignable allows/restrictions, effective permissions and source, conflict/precedence explanation (Security determines semantics), per-operation resource/field scopes, tenant/outlet/location/environment selectors, amount/currency thresholds, customer self vs staff audience, channel/purpose, provider, job identity and expiry/revocation. Default deny protected effects when missing/ambiguous/unavailable.
- Dependency and all-of warnings, e.g. deposit conversion needs payment modification, sale update, credit issue and applicable deposit grant; split/combine needs sale create/update plus financial/fulfillment effects; return may require payment refund, credit reversal, Inventory adjustment independently. No blanket approval substitutes for execution. Configuration and export independently assignable. Show approvals vs execution status and approval revision/amount scope.
- Delegated job identity and allowed effect list; grant expiry, revocation, execution-time recheck, actor/audience and environment binding; no enqueue-time or service-account bypass. Show effective restrictions for each job and linked tools. Record audit/history of permission changes, actor, reason, before/after, change confirmation and revocation. Security implements controls, not this domain.
- No duplicate permissions for Special Orders vs Repairs/Consignment/etc. Reconcile label conventions with Core/Catalog/Inventory/Purchasing/notification owners; product and stock operations cross-domain references, not owned here. Customer deletion/retention, portal audience, export retention, provider credentials, job configuration, privacy exceptions, approval thresholds/precedence and exact resource grants require Security/owner review.
- Actual enforcement gaps: M5/M6/M7 Core read fixtures only; M7 composite read needs independently authorized financial, fulfillment and credit I/O/field scopes, not one broad read label. V4 Core local transaction all-of fixtures not proof of domain mutation enforcement. No actual grant contract accepted; legacy routes, Rewards Python client, provider workers, POS and bulk/import paths not fully mapped or tested. Before migration require allow/deny, expired/revoked, wrong resource/field/environment, composed effects, direct/indirect/import/automation and safe replay tests at actual backend entrypoints. UI hiding not sufficient.

### Coordination gate / remaining blockers
- Core/Security scoped all-of read admission, actor-bound replay/audit and eventual remote mutation contract; no duplicate authorization or persistence implementation.
- Inventory owns physical stock changes; return evidence does not authorize receiving or adjustment. Consignment owner verifies 80%/72h policy, eligible proceeds, returns/voids and reversal policy before any financial execution.
- Normalized provider provenance, timestamps, global uniqueness, cumulative reversal/return limits and amount/currency precision, actual vendor history/settlement, real partial returns and authoritative credit ledger remain unresolved. Evidence can contain reversal above original amount; no eligibility or total inference. Conservative explicit ownership and required original credit event are candidate decisions. Composite read scope unresolved.
- Next manager exact-checkout combined regression and permission register deduplication; no actual integration until approved. No personal input needed now. Stop at manager reconciliation gate.

---

## Historical milestones (retained)

# Shared Customer & Sales Foundation — Current Handoff

## M6 — Baseline V3 sale workflow evidence (2026-11-24)

**Status:** Implemented on isolated V3 branch; 7 targeted local tests passed with dependency-double limitations; stop at manager/Core/Security coordination gate. Not deployed or consumer-integrated.

### Source
- Approved V3 parent: Tawgod/Lightspeed:test/hc-foundation-combined-v3-20261124@098c9e51ea4c3449605ad6951baa8284e126e8d4. Manager combined CI 45436836762 verified 223/223 at V3 parent, including M5, not new-head evidence.
- Read canonical baseline, manager and own handoffs, dependency register, V3 manifest and Core M3 coordination document. Old PR #88 head 2f2750ee703556c1ea2eab60f3d6edd14bbe82ea exactly matches V3 included pin, no newer deltas; PRs #81/#88 and branches preserved.
- Independent branch feature/hc-customer-sales-m6-v3-20261124; head 518ac1d0e6985852f80d375c9ce922d47fc40296.
- Draft [PR #92](https://github.com/Tawgod/Lightspeed/pull/92) targets V3 branch, base 098c9e51ea4c3449605ad6951baa8284e126e8d4; mergeable=true, draft=true, merged=false; 5 changed files. No merge attempted.

### Implemented
- Added services/lightspeed/saleWorkflowEvidence.js: normalized read-only sale, payment, deposit, work-order and fulfillment evidence. Exact IDs, decimal strings, distinct unknown versus supplied empty collections, conflict/duplicate rejection, orphaned fulfillment line flag. Financial payment is not proof of deposit; picked/packed/fulfilled stages are distinct, customer pickup stays unknown. No deposit balance, stock effects, execution eligibility or raw PII/payment details inferred. Coverage explicitly incomplete; fulfillment single page, deposit/work-order supplied evidence only. Optional trusted injected feature readers unconnected.
- Extended sale detail and fulfillment per-sale readers with optional correlationId, preserving prior calls/envelopes when omitted. Existing customer search, identity and consent interfaces unchanged. No Core, Security, routes, DB or other workstream files changed.
- Added tests/customer-sales-m6.test.mjs and docs/CUSTOMER_SALES_M6.md. Source audit of pinned routes/orderSplit.js (inspect route, payment/line aliases and orphan evidence), routes/workOrderCombine.js (pending/parked summaries), routes/depositConversion.js (payment modification and credit posting). Actual consumer parity remains unverified; legacy routes untouched.
- Documented proposed cross-tool operation map, not a Security registry: separate read/create/update/approve/execute, product/customer operations, payment modification, sale update/split/recall/combine, deposit collection/reversal, pickup, return/void and credit posting/reversal. Deposit conversion requires all applicable grants before effects, recheck on execution; no UI/tool/import/automation/service-account bypass. All active employees may view wholesale costs under ordinary product access, cost change separate; Catalog/Security own implementation.

### Tested
- Local Node.js v22.16.0: node --test tests/customer-sales-m6.test.mjs: **7/7 PASS**, 0 failures/skips/cancellations, TAP duration 140.049104 ms. Six simulated entrypoint labels (Special Orders, Preorders, Split/Recall, direct API, import, automation) deny proposed deposit collection via synthetic exact-operation verifier; granted read and subsequent revoked read checked. This is a Core read-executor fixture only, not actual route enforcement or mutation admission. No mutation callback.
- Five reconstructed files independently matched fetched GitHub blob hashes: saleWorkflowEvidence.js faeea7c48f8b8274a0554cf985cf6ad913a641a1; tests/customer-sales-m6.test.mjs 6792bb1ce5764d845c0a23c26207d31cb4176c2a; sales.js cbf787b08201c174f780c705c7eb74ad1bbc7e0a; fulfillments.js 100cdd1babd607581510c8fa29809df058612f3b; coreReadContract.js 43b3b19286a902d07d737c662c10ef3c99d260d3.
- LIMITATION: inherited client.js and readCollection.js locally replaced with minimal dependency doubles (error class and list unwrap); no exact-checkout/full prior regression or real transport/pagination test. New tests in GitHub import real inherited files. No new CI workflow or remote validation claim. Manager should add new suite to next exact-checkout combined run (230 total if only this delta; other workstreams add further tests).

### Deployment
None. No live vendor/business data, grant changes, route mounts, actual feature switch, payments, credit, linking, stock effects, database migrations, merge or deploy.

### Coordination / open risks
- Real grant names, resource/field scope, expiry/revocation/environment, composed all-of checks, execution reauthorization, durable audit/replay/atomicity belong to Security and Core. Synthetic boolean adapter cannot prove actual cross-tool enforcement. No separate security implementation.
- Deposit/work-order source adapters, provenance, timestamps, reversals, financial currency/amount precision, vendor numeric representation, partial pickup and real event completeness remain unverified. Current decimal-string only rule, simultaneous alias rejection, strict state/status match and bounded rows are conservative candidate decisions, not production vendor contract. Per-sale fulfillment only, no pagination guarantee; no financial/physical sums. Current source-confirmed line association is limited to supplied evidence.
- Legacy Split/Recall invoice fallback, missing-as-zero payment summaries and deposit conversion semantics require owner parity review before any substitution; no modifications. Actual payment collection and credit posting prohibited. M7 returns/void/store-credit evidence is next proposed scope, contingent on manager sequencing and separate authorization for any execution.
- Manager exact-checkout combined regression, Security contract and feature owner agreement before consumer activation. No user decision needed now; ready for reconciliation.

---

## Historical milestones (retained)

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
