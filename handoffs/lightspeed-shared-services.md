# Shared Lightspeed Services — Current Handoff

**Last verified:** 2026-10-29  
**Status:** In Development (Phase 2 read services); Phase 1 code complete/automated tests passed; neither PR deployed.

## Authoritative references

- Architecture: `Tawgod/Hobby-Corner:main/LIGHTSPEED_SHARED_SERVICES.md`
- Application integration base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`
- Phase 1 PR #32: https://github.com/Tawgod/Lightspeed/pull/32
  - Branch `feature/shared-lightspeed-services-phase1-20261029`
  - Head `7c20b3d9f90382b6fafeb5dc3d9a92108f4c14e1`
  - **Ready for review; unmerged; un-deployed**
- Phase 2 PR #33: https://github.com/Tawgod/Lightspeed/pull/33
  - Branch `feature/shared-lightspeed-services-phase2-reads-20261029`
  - Head `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a`
  - **Draft, stacked onto Phase 1 branch** (NOT the Railway-connected production branch)
- Recovery record: `backups/2026-10-29-shared-services-phase1.md`
- Private source-only Postgres schema archive: `Tawgod/Lightspeed-Importer:backup/hobby-corner-postgres-source-schema-20261029` (not a live database dump)

## Implemented

**Phase 1 — code implemented, reviewed by automated CI**

- Validated shared transport, Timeclock-backed employee/service policy and staff adapter, Postgres audit/idempotency durable adapters, guarded mutation orchestration and additive **unapplied** migration.
- Initial customer/catalog/product scoring reads and legacy read compatibility adapter.
- Source-level direct-access checker, contract tests and disposable Postgres/Scanner/Core Operations regressions.
- Final Phase 1 CI successful: `40911078591`.

**Phase 2 — read-service candidate implemented in development PR #33**

- Strict X-Series pagination module: version cursors for collection endpoints; offset-based `/search`; bounded pages/rows and fail-closed error behavior.
- `services/lightspeed/products.js`: exact remote SKU/product-code match, leading-zero fidelity, ambiguity and incomplete-verification safeguards.
- `services/lightspeed/inventory.js`: currently used product inventory GET read, no quantity fabrication.
- `services/lightspeed/sales.js`: read-only sale get/invoice/customer/state paths.
- `services/lightspeed/fulfillments.js`: read-only sale fulfillment list contract.
- `services/lightspeed/purchaseOrders.js`: complete PO list+line reads, supplier and SKU/UPC fidelity; no PO writes. PO Companion PR #31 mapping remains feature-owned.
- `services/lightspeed/storeCredit.js`: read-only customer credit balance contract.
- Phase 1 customer search and supplier/brand/tag reads updated to enforce complete pagination.
- `routes/sharedLightspeedRead.js`: **unmounted** read-only authenticated gateway factory, calling existing Timeclock-backed policy for each operation, with no-store and role checks. No `server.js` modification.
- `tests/shared-lightspeed-reads.test.mjs` for pagination, exact product IDs, missing data, PO fidelity and forbidden browser access.
 - Phase 2 now also includes `services/lightspeed/permissions.js`: explicit operation registry, Timeclock-backed employee read gate, independently verified service grants, and separate fail-closed write grants; no current route permissions changed.
- New centralized policy/behavior reference: `Tawgod/Hobby-Corner:main/SHARED_STAFF_AUTH_PERMISSIONS.md`.

- Full contract and migration plan in `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase2-reads-20261029/docs/SHARED_LIGHTSPEED_PHASE2_READS.md`.

## Phase 1 foundation reliability hardening — 2026-10-29 (code/test verified)

- **PR #32** `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029@0082eacc5acde5bde52bdc5e70924f3edaf6d778`, still open/unmerged. Final-head CI [40955180232](https://github.com/Tawgod/Lightspeed/actions/runs/40955180232) **PASS**, including default-deny transport coverage.
- **PR #33** `feature/shared-lightspeed-services-phase2-reads-20261029@b2d97d327f92ec4f42bb3f531d61654c31a8b626`, still draft/stacked on the older Phase 1 base. Phase 2 hardening was synchronized into the stacked branch; it is presently **50 commits ahead / 27 behind** the moving PR #32 base (mergeable reported true; ancestry **not yet reconciled**); final-head CI [40955195986](https://github.com/Tawgod/Lightspeed/actions/runs/40955195986) **PASS**. Before integration, explicitly reconcile its ancestry with finalized PR #32 and preserve Phase 2 read/permission tests.
- **Transport write default:** The canonical HTTP transport now refuses POST/PUT/PATCH/DELETE before network I/O unless a trusted backend explicitly sets `mutationsAllowed:true`. This is defense in depth; it does not replace separate approved mutation policy/audit/idempotency/readback. Current GET/HEAD readers remain permitted by default. A future read-via-POST route requires its own explicitly reviewed safe handling.
- **Writes:** HTTP error responses on a write are now conservatively flagged `mayHaveWritten` (including 4xx/409/429/5xx), without automatic retry; read failures retain bounded safe-read retries.
- **Transport:** strict local API target validation (encoded dot/fragment/control rejection), streamed response byte bounds (2 MiB default), valid UTF-8 and JSON requirements; no raw invalid upstream response exposed.
- **Idempotency:** canonical plain-JSON mutation payloads with depth/node/size limits; reject dates/classes/getters/`toJSON`/undefined/BigInt/sparse or cyclic objects; writer receives a detached approved JSON snapshot, and payload changes before/after execution fail closed.
- **Recovery:** PostgreSQL idempotency now has a backend-only **read-only** `inspect(scope,key)` for fingerprint/state/timestamps, excluding lease, stored receipt and customer payloads. No automatic pending/unknown release/retry/reconciliation was added; manual vendor-side verification and separately approved recovery procedure remain required.
- **Tests additionally prove** the append-only audit blocks UPDATE/DELETE/TRUNCATE; lost terminal audit after a verified operation does not cause a second vendor write; and real PostgreSQL idempotency concurrency/replay remains intact.
- **Implemented:** candidate branch only. **Tested:** new CI passed, no real tenant/browser acceptance. **Deployed:** NO. No Railway DB migration, Lightspeed write, service route, Chrome release or production branch merge.

### Remaining release-quality gates after hardening

1. Code/security review and independent database schema/backup decision before PR #32 integration.
2. Explicit manager + Deployment Coordination authorization before any merge to the Railway-tracked integration branch, production DB migration or deployment.
3. Controlled test-tenant API version/response/employee permission validation; no production write trials.
4. Future mutation consumers must use the detached approved payload, store only minimal non-sensitive verified receipts, and implement a formal reviewed manual-unknown reconciliation runbook before writes can be enabled.
5. Coordinate PR #33 branch ancestry and consumer contract changes after PR #32 reaches approved integration state; never silently rebase onto production or alter live permissions.

## Testing

- Phase 1 foundation + disposable Postgres 16 + Scanner and Core Operations tests passed: `40911078591`.
- Phase 2 read contracts, authenticated HTTP denial/permission checks, and inherited foundation/Scanner/Core Operations tests passed on PR commit `6879bc89447be537bb8f8caa1f9dd3d8d9b829e2`: CI `40913405875`.
- Current Phase 2 PR head `bbfe24fd1d87f1b9dfa29b69df563a7dcf5e1e9a` CI **PASSED**: pull-request workflow `40920253500`, push workflow `40920241898`. Foundation, disposable PostgreSQL, strict read, staff permission matrix and identity-spoof tests, Scanner/Core Operations regressions, source audit and backend parse checks green.
- Current Lightspeed docs confirm version-based PO cursor, offset-based search, SKU filter semantics and 2026-04 inventory API POST read behavior; see Phase 2 docs for URLs. **No actual Lightspeed tenant API calls** and no browser/employee acceptance tests.
- Active PR #22/#24/#26/#28/#30/#31 changes were examined for shared service overlaps; current new shared paths are separate. Recheck at merge time.

## Deployed

- **No Phase 1 or Phase 2 changes deployed or merged.**
- Railway `lightspeed-api`, `timeclock`, `special-orders-test` remain sourced from `integration/hobby-corner-consolidation`; no staged Railway changes.
- No production database/schema change, Lightspeed record write, employee record deletion, credential relocation or Chrome extension release.

## Shared dependencies

- Phase 2 branch contains Phase 1 code and MUST be reconciled/retargeted when PR #32 merges.
- `SHARED_STAFF_AUTH_PERMISSIONS.md` is authoritative for new shared-service operation IDs and staff identity handling; the existing Timeclock Scanner path presently grants `canLookup` and `canApprove` to all active employees, irrespective of persisted flags. New shared production writes are denied by default. No existing feature access changed.
- PO Companion PR #31, Product Manager PR #28, Scanner PR #26, Core Ops PR #24, and Timeclock/Consignment candidate PRs remain independent feature workstreams.
- PO Companion and Ordering should consume the shared PO reader when the gateway is stable; preserve existing supplier-ID mapping, supplier SKUs/UPC leading zeros, review/draft state and Timeclock auth.
- Browser-facing gateway must not be mounted before live test-store read-contract and role authorization acceptance.
- Preserve Scanner's isolated test-store writer and RMS authorized migration boundary.

## Remaining tasks and blockers

1. Phase 1 PR #32 unmerged and production-connected. Requires explicit merge/deployment approval.
2. Phase 2 PR #33 is stacked/draft, with final-head CI passed. Require code review and controlled integration; **not yet a completed migration of consumers**.
3. Current PO/customer/product/inventory read API versions and response/pagination envelopes must be validated against read-only Lightspeed test tenant access before enabling gateway routes.
4. Inventory's documented bulk POST reads must be modeled separately; a POST for a read must not imply write authorization.
5. Feature-level consumer conversions, UI/browser acceptance, and write-service Phase 3 remain ahead.
6. Actual Railway Postgres table data was never dumped; backup consists of Git source refs and source-derived schema reference, not live employee/order rows.
7. The central transition inventory now contains stable handoffs for all currently tracked active workstreams, including the Hobby Corner Manager. Individual feature chats may still have manual acceptance or owner-signoff blockers before archival, but missing handoff files are no longer the blocker.

## Recommended next action

- Keep PR #32 ready for coordinated review and PR #33 draft stacked on it; do not merge production-connected branches automatically.
- Once authorization permits, test the read contracts against the test Lightspeed tenant and convert **one read-only consumer** (prefer PO Companion) with parity tests. Then stage other readers.
- If a current feature changes the relevant API contract, update this central handoff and `LIGHTSPEED_SHARED_SERVICES.md`.
- Keep existing feature handoffs current and start replacement chats from `HOBBY_CORNER_CHAT_TRANSITION.md` and `prompts/NEW_TOOL_CHAT_STARTUP.md`; do not recreate already-established handoff files.

## Safety

Do not deploy production, apply the shared Postgres schema, move credentials, delete records, alter Chrome extension releases, or enable new production writes without explicit approval.

## Planned cross-tool feature — Invoice Reconciliation (intake 2026-10-29)

- `FEATURE_INVOICE_RECONCILIATION.md` is the authoritative plan. No feature PR or implementation exists; **not part of Phase 1 #32 or Phase 2 #33 code scope**.
- Supplier mail + PDF invoice extraction → verified supplier/sender alias and tracking/PO evidence → **match existing PO or stage creation of new OPEN supplier PO** → invoice line/product matching and secondary supplier proposals → shared Railway PostgreSQL review → Product Manager invoice-specific review and Scanner supplier-cost matching → final separate approval → guarded Lightspeed PO create/update. **No physical receiving or stock-on-hand changes.**
- The new Invoice Updates Product Manager dropdown is shared across all logged-in employees, independent of employee-private layout profiles. Final PO write approval is a distinct permission, not inferred from read access or Scanner canApprove.
- 90%+ candidate identity match auto-stages only; cost/MSRP/quantity exceptions and new secondary supplier mappings remain reviewable. Supplier invoice quantity is **not** receiving quantity. Sender aliases from shipping firms/warehouses require verified supplier linking; Special Orders displays **On the way** tracking, never stock receipt.
- Official X-Series PO creation uses `POST /api/2026-07/consignments` with type SUPPLIER/OPEN; existing PO mutation APIs operate on SUPPLIER consignments. Generic bulk count/received operations have accumulation/status transition risks and must not be used to receive in this feature. Test an explicit safe status-aware apply contract and readback before any live write.
- Future Scanner bridge entry is QUEUED in extension release queue; no extension packaging or production deployment was performed.

## Post-archive operating agreement — owner-confirmed 2026-10-29

- This **Shared Lightspeed Services conversation remains open and active**, alongside Hobby Corner Manager, Shared UI/UX Coordination, Deployment Coordination and the separate RMS Item Migration chat. Archived tool-chat handoffs remain authoritative when feature work resumes.
- Maintain canonical Timeclock-backed identity, Lightspeed client/policy, read services and durable audit/idempotency/write gates for future tool consumers; do not create new tool-specific production Lightspeed clients.
- **Migration code reuse:** inspect the current `Tawgod/Hobby-Corner-Discord-Bot` RMS branch/source and `handoffs/rms-migration.md` before adapting any SKU/UPC identity, supplier mapping, category/brand normalization, collision detection, staged extraction or validation utility. Prefer pure shared helpers with fixtures and regression tests; coordinate any extraction with the ongoing RMS chat.
- Never import migration-only writers, RMS historical on-hand inventory values, source credentials or temporary schemas into the shared production adapter. Do not assume migration branch code is merged, deployed or safe for writes.
- Feature-specific development may be restarted in targeted chats from handoffs when approved/prioritized; existing PRs #32/#33 still need their own verification/acceptance/deployment decisions.


## Shared staff security baseline — 2026-10-30

- PR #32 now includes `services/security/staffAccessBaseline.js` and `tests/shared-staff-security.test.mjs`; PR #33 stacked branch contains matching candidate code. **Unmounted/non-deployed**; no existing route or employee PIN changed.
- Access levels: active Timeclock-verified session **plus** server-proven registered device or independent strong sign-in for in-store/normal read/staging; independent recent passkey/security-key/OIDC MFA **plus** exact permission for product/PO/inventory/sale/store-credit/employee-permission operations.
- Mocked security-policy regression CI: PR #32 `41091313029` PASS; PR #33 `41091370610` PASS. Tests reject PIN-only, forged browser role/device headers, inactive employees, unbound/expired MFA, unauthorized operations and failing verifiers. These checks do not establish deployed device enrollment/IdP, live route protection or production pen-test results.
- Source audit uncovered a legacy Timeclock status/clock identification path outside the new Staff Auth session: requires coordinated backend+Chrome employee acceptance, and new rate-limit/abuse controls before system-wide security can be considered established.
- Existing durable login limiter has global/source/PIN buckets but is not a substitute for verified trusted station/strong remote access and per-account controls. Do not change in-store clocking or rotate `TIMECLOCK_PIN_PEPPER` without a signed-off migration.
- Specification, dependencies, acceptance and owner decisions: `STAFF_SECURITY_BASELINE.md`; current operational permissions: `SHARED_STAFF_AUTH_PERMISSIONS.md`. No merge, Railway deployment, DB change, production login/authorization restriction or Chrome release in this milestone.


### Durable anti-guessing foundation — 2026-10-30

- Added **unmounted** `services/security/staffLoginThrottle.js`, separate unapplied `db/hc_staff_auth_throttle.sql`, and disposable PostgreSQL integration tests to PR #32 and stacked #33.
- Uses **independent hashed account and source-IP token buckets** with transaction locks across replicas, no raw PIN/IP storage, fail-closed database errors, controlled refill and non-extending blocked windows. Designed for future employee-selector login, not as an unapproved production replacement for the current PIN-only login.
- PR #32 final full-head CI [41093074109](https://github.com/Tawgod/Lightspeed/actions/runs/41093074109) **PASS**; PR #33 code/test-head CI [41092968743](https://github.com/Tawgod/Lightspeed/actions/runs/41092968743) **PASS** and documentation head to be separately checked.
- **Unverified:** store workstation proof, passkey/IdP provider, actual Railway trusted proxy mapping, account selection, live legacy Timeclock route migration, employee recovery tests and production deployment.
- New staff security scope does not authorize direct production writes, change existing permissions, modify Timeclock PINs, or replace the extension. Prioritize the legacy clock/status authentication gap, then per-route deployment acceptance. Source of truth: `STAFF_SECURITY_BASELINE.md`.


**Final security checkpoint CI:** PR #32 `59fe71f1bf7d9e5f4ca5475c7eb2d9a490bec704` final-head run `41093074109` PASS; stacked PR #33 `6519590b61066732a5b4fabb13d7007cd5327062` final-head run `41093089253` PASS. Neither merged or deployed; both still require security review and controlled Timeclock/Chrome consumer acceptance.


### Dual-access security direction — store Chrome extension and mobile convention login (2026-10-30)

- Owner wants the private Chrome extension to facilitate secondary **store workstation** validation while retaining **phone/tablet access** to the same tools away from the store at conventions.
- Accepted architectural direction for design (not deployed): a *separately registered per-installation key* verified using backend challenge/signature alongside Timeclock PIN session on enrolled store computers; browser WebAuthn passkey or managed IdP MFA on iOS/iPadOS/Android browsers without an extension. Bind both to current Timeclock employee identity and server-side operation grants.
- Extension installation/ID/Origin/headers and private distribution alone do not establish authentication; no bundled static extension secret. High-impact Lightspeed/credit/PO/inventory writes still require recent employee-bound step-up even from a registered store workstation.
- Existing unmounted PR #32/#33 staff assurance policy can express both trusted device and strong user factor, but **no** device enrollment, WebAuthn login, account recovery, staff UI changes or live endpoint gating has been built. Timeclock legacy auth migration remains the blocker.
- Spec: `STAFF_SECURITY_BASELINE.md`; extension work is BLOCKED/Planned in release queue. No code branch, deployment or extension package changed by this design update.


### Optional Google Authenticator integration candidate — 2026-10-30

- Implemented **unmounted** standard six-digit/30s TOTP primitives and encrypted PostgreSQL enrollment/confirmation/one-use-code verification on PR #32, mirrored to stacked PR #33; no Google cloud/API dependency.
- Dedicated `services/security/staffTotp.js`, `staffTotpPostgres.js`, additive-but-unapplied `db/hc_staff_totp.sql`, tests `tests/shared-staff-totp*.test.mjs`; final code tests [Phase 1 41116233000](https://github.com/Tawgod/Lightspeed/actions/runs/41116233000) PASS and [Phase 2 41116244954](https://github.com/Tawgod/Lightspeed/actions/runs/41116244954) PASS.
- Shared policy accepts backend-verified TOTP for routine mobile access but **denies TOTP-only high-risk writes**, which retain stronger authenticator and exact permission requirements. Timeclock identity, throttling, one-time code replay prevention and encrypted server-only seed storage are preserved.
- **Missing before any rollout:** approved enrollment/backup/revocation workflow; real mobile QR/setup UI, signed factor-bound session, trusted-source IP, tested Timeclock browser integration, key rotation/runbook, live employee tests and separate production approval.
- Full architecture: `STAFF_SECURITY_BASELINE.md`. PR #32 remains open/unmerged; PR #33 remains draft/stacked. No existing PIN, live login, database or Railway deployment was changed.


### Employee Security Settings first candidate — 2026-10-30

- Implemented on PR #32; mirrored to stacked PR #33: unmounted `routes/staffSecuritySettings.js`, responsive `staff-security.html/css/client.js`, status-only PostgreSQL method and `tests/shared-staff-settings.test.mjs`.
- Enrolled Authenticator status, pending QR/secret handling, six-digit confirmation and sign-out are designed for store/mobile browsers. QR PNG is rendered **locally on the backend** with existing barcode dependency; no third-party QR service receives the enrollment secret.
- Every factor-management API requires current Timeclock employee session plus **independent** approved enrollment/station/strong-factor verification; spoofed browser role/device/Origin claims are rejected. No automatic reset/recovery route. Sensitive seed/code data is no-store and cleared on browser navigation/hide.
- Actual Authenticator/mobile sign-in, signed MFA step-up, manager-approved recovery, station verification, key custody, live staff acceptance and legacy Timeclock bypass remediation remain unfinished. This page is **not mounted, linked or deployed**.
- Tested: secured route/QR/source checks and encrypted PG metadata with passing development CI. Exact code+test status must be reverified before integration. Contract: `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029/docs/STAFF_SECURITY_SETTINGS.md`.


## Employee security follow-up — verified 2026-11-02

- Reinspected current PR #32 `feature/shared-lightspeed-services-phase1-20261029` and draft stacked PR #33. Source already contains durable employee-bound manager enrollment requests (`staffEnrollmentApprovals.js`), passkey/IdP-strength manager approval adapter hooks, base-session-bound signed TOTP MFA tokens (`staffMfaSessions.js`), and audited backend-only factor revocation (`staffFactorRecovery.js`). All remain **unmounted**.
- Corrected `staff-security-client.js` mobile verification regex for six-digit codes and signed MFA token structure on both branches. Added `tests/shared-staff-settings-client.test.mjs`, exercising the real browser script's six-digit request to `/staff-security/api/mfa/session`, bad-input rejection before network activity, and clearing verification state when hidden.
- Updated both foundation CI workflows. PR #32 latest code/test CI `41456103369` **PASS**; PR #33 `41456127545` **PASS**.
- Remaining critical integration: independently enrolled manager passkey/IdP MFA or registered workstation proof, actual verified manager UI, secure employee identity/session binding and permission integration on live routes, robust recovery and key custody, proxy/IP review, Chrome/Timeclock legacy clock bypass migration, device acceptance and explicit production authorization.
- **No production code merge, database schema, Railway deployment, live staff enrollment, credentials or Chrome release changed.** Never expose this unmounted candidate as if login protection were already active.


## Staff session / MFA policy bridge checkpoint — 2026-11-02

- Implemented the **unmounted** server-only bridge `services/security/staffSecurityBridge.js` and `tests/shared-staff-bridge.test.mjs` on Phase 1 PR #32 branch and mirrored both to stacked draft Phase 2 PR #33. Updated both foundation CI workflows to run the new tests.
- The adapter uses existing Timeclock `verifyBoundEmployee` to recheck signed session binding, active employee and expiry, supplies `verifyBaseSession` to signed `createStaffMfaSessions`, and enforces employee-bound TOTP via `X-HC-MFA-Session` through the exact-operation staff access policy. TOTP authorizes only otherwise-permitted routine reads/staging; high-impact writes require a separate trusted passkey/security-key/OIDC verifier and exact grant.
- All unverified station/strong-factor callbacks default to denial. The bridge does **not** implement actual station credential registration, IdP login, manager trust, live route mounting, legacy Timeclock route hardening or production MFA deployment.
- **Implemented:** development branch only. **Tested:** Phase 1 latest code/test CI `41468102070` **PASS**, including expired-session regression; Scanner `41468102136` and Core Operations `41468102173` also **PASS** on test head `72dc6902aae703ab8881ea8bd7c524bb4d27f96f`. Phase 2 code/test mirrored and CI added; current-head CI not yet independently confirmed. **Deployed:** NO.
- Latest documentation commits: PR #32 `6bd1b71390a932fb9c73a68d6f8669f3f0ecfbd0`; PR #33 `8ab38ea1491b83853067cf6efa58b878d3fe0cbc`. PR #32 still open/unmerged; PR #33 draft/stacked, ancestry still needs coordinated reconciliation. No merge or PR retargeting occurred.
- Railway production inspected 2026-11-02: `lightspeed-api`, `timeclock`, and `special-orders-test` still deploy from `integration/hobby-corner-consolidation`; latest displayed deployments SUCCESS (2026-10-28); **no staged changes**. No new code or security schema live.
- **Next gate:** Independent registered workstation proof and independently verified employee-bound passkey/IdP manager enrollment, recovery and high-impact step-up; trusted proxy/attempt-limit review; legacy Timeclock clock/status remediation; test employee/store/phone acceptance; deliberate release approval. The Chrome extension queue is untouched because no extension code was changed.

## Registered workstation proof and testability checkpoint — 2026-11-02

- Added **backend-only, unmounted** cryptographically registered workstation candidate to Lightspeed PR #32, mirrored in draft stacked PR #33: `services/security/staffWorkstationsPostgres.js`, `db/hc_staff_stations.sql`, `routes/staffStationProof.js`, `tests/shared-staff-workstations-postgres.test.mjs`, `tests/shared-staff-station-http.test.mjs` and `docs/STAFF_STATION_TESTING.md`.
- Unique per-installation Ed25519 PUBLIC key registration requires injected independent strong manager verification and exact backend grant; **test suite's manager passkey is a test double, not real WebAuthn/IdP integration**. No employee self-enrollment route. Device signs a 90-second, one-use challenge bound to a current Timeclock-signed employee session. Backend issues a five-minute signed station claim bound to employee/session/device generation; revocation immediately rejects earlier station claims, with append-only event audit.
- The previous `staffSecurityBridge.js` `verifyWorkstation` injection now has a concrete backend candidate. Store proof permits only specifically authorized routine reads/staging; all high-impact writes still require recent independently verified strong employee factor, exact operation grant and shared mutation safeguards.
- Full disposable PostgreSQL and localhost HTTP tests cover real Ed25519 crypto, forged request headers, invalid/replayed/expired challenges, cross-session proof reuse, manager grant denial, revocation, append-only audit and privileged-write denial.
- **Implemented:** yes on isolated PR #32 branch and mirrored PR #33; no public route mounting. **Tested:** final PR #32 head `2c77d91ded9f9e4ce2c352f208f35b886d19cba5` CI **PASS**: foundation `41470826329` (real station signing + HTTP), Scanner `41470826405`, Core Operations `41470826368`. Phase 2 mirrored code remains current-head CI unverified. **Deployed:** NO. Phase 2 branch CI latest head not verified, and PR #33 remains draft with unreconciled ancestry.
- `Tawgod/Lightspeed` Phase 1 documented candidate head `2c77d91ded9f9e4ce2c352f208f35b886d19cba5`; Phase 2 mirrored/documented head `bbb85211743d4ba1055c1a82769d1f12e5f9e439` (heads may advance with CI/docs). Git documentation `docs/STAFF_STATION_TESTING.md` gives the exact local test command and cryptographic message contract.
- **Pilot blockers:** real manager passkey/IdP verifier, audited real staff/manager permissions, independently verified device key provenance and private-key storage, actual extension signing UX coordinated via release queue, trusted proxy/edge review, legacy Timeclock public clock/status remediation, employee/Chrome/iOS/Android acceptance and separate test environment security controls. No production migration/deployment or extension code/package change authorized.

## Employee passkey process — independent manager approval candidate (2026-11-02)

- Implemented **unmounted** WebAuthn passkey backend with pinned maintained `@simplewebauthn/server@14.0.3` in `Tawgod/Lightspeed` PR #32; mirrored code and tests into stacked draft PR #33. Files: `services/security/staffPasskeysPostgres.js`, `routes/staffPasskey.js`, `db/hc_staff_passkeys.sql`, `staff-passkey.html/client.js/css`, `tests/shared-staff-passkeys-postgres.test.mjs`, `tests/shared-staff-passkey-client.test.mjs`, `docs/STAFF_PASSKEY_TESTING.md`.
- PIN-only enrollment remains **denied**. The backend requires an independent approved enrollment callback at both begin/finish. Registration uses precise RP ID/origin, a 90-second durable session-bound one-use challenge, required user verification, duplicate-credential rejection and stored public keys. Authentication uses real WebAuthn signature verification, monotonic counters, employee/session-bound five-minute proof and per-call credential generation/revocation checks. Credential event audit is append-only.
- An isolated local/VM test now verifies a real P-256/ES256 passkey assertion and signed step-up, denial on wrong origin/replay/forged browser headers, exact permission checks, cross-session binding and revocation. It composes `passkeys.verifyStrongManager` into the existing `staffSecuritySubsystem`; a manager PIN/forged role cannot approve a **different employee's** TOTP request, but an actual signed test WebAuthn assertion + server exact grant can approve and allow enrollment staging.
- Native browser pilot UI is **not mounted** or linked to store tools. Browser credential conversion and proof-clearing are covered by VM regression; **actual hardware passkey registration is not tested** (registration attestation verifier is test-injected). No independently verified first-owner passkey bootstrap, operational backup/recovery, public legacy Timeclock hardening, trusted proxy/WAF validation or actual iOS/Android/Chrome employee acceptance yet.
- **Implemented:** PR development branches only. **Tested:** Phase 1 foundation `41474392635` PASS; Scanner `41474392499` PASS; Core Operations `41474392819` PASS at test head `024fca591618ae7c15c1c4b934527a2ee4a3b589`. Docs changes follow that CI. Phase 2 draft latest-head CI **not independently verified** and stacked ancestry unresolved. **Deployed:** NO.
- Next gate: owner-approved independent bootstrap and backup passkey, live HTTPS test origin/RP ID, staff/manager device testing, tightly scoped server permission grants, employee offboarding/recovery, coordinated Timeclock bypass remediation. Do not merge, apply schema, mount public routes, move secrets or deploy production without manager + Deployment Coordination authorization. No Chrome extension code/package/release was changed.

## Discord Admin/Owner-issued authenticator invitations — 2026-11-02

- Lightspeed PR #32 development-only backend and browser, mirrored onto stacked draft PR #33; Hobby Bot draft PR #3 adds `/hc security_setup` for exact Admin/Owner roles. The bot signs private service requests, checks Timeclock linkage, issues a hashed, 15-minute one-use invitation, then delivers the link privately. The employee logs into Timeclock; only an independently verified manager may approve QR/TOTP enrollment.
- Disposable PostgreSQL HTTP integration covers invite forgery/replay, employee identity, manager-approval fixture, backend QR and six-digit activation. Phase 1 foundation run `41485971503`, Scanner `41485971579` and Core Operations `41485971679` PASS; Bot PR #3 run `41486273875` PASS. The manager in the combined signup test is simulated; separate WebAuthn signature tests exist.
- No actual Discord/phone/staging acceptance and no production deploy, DB migration, bot main merge or Chrome change. Existing Railway Integration Test currently has only a Consignment service, not security API/bot/Postgres. Owner passkey bootstrap and separate HTTPS/test identities remain prerequisites.
- Detailed verified manager handoff: `handoffs/hobby-bot-security-enrollment.md`; developer plans `Tawgod/Lightspeed:docs/STAFF_DISCORD_ENROLLMENT_TESTING.md` and `Tawgod/Hobby-Corner-Discord-Bot:docs/STAFF_SECURITY_ENROLLMENT.md` on their respective feature branches.

## Security development continuation — 2026-11-05

- Owner confirmed this active conversation continues secure shared Lightspeed infrastructure, Timeclock-backed staff identity, passkey/TOTP/station verification, and common exact-operation tool gateway. A test employee PIN is reportedly available, but no PIN value was requested, read, stored, or used in this work.
- Extended existing `tests/shared-staff-bridge.test.mjs` on Phase 1 PR #32, commit `e997ff064b2513b691fcedd8b52f0af3872aad53`, mirrored into stacked Phase 2 PR #33, commit `2c8fc55ddc0e810709565aab4879498f44395514`.
- New fail-closed regression scenarios: unlisted/prototype-like operations; permission provider exceptions/non-boolean approval; future/stale/invalid privileged-factor timestamps; per-operation product-versus-inventory grants; and attempted alternate signed employee session. Existing source modules and live policy were not changed.
- Verified PR #32 commit `e997ff064b2513b691fcedd8b52f0af3872aad53` CI **PASS**: Shared Lightspeed foundation `42084432584`, Scanner regression `42084432186`, Core Operations UI `42084432183`. PR #33 commit `2c8fc55ddc0e810709565aab4879498f44395514` had no pull-request workflow runs returned; its latest-head CI remains **unverified**.
- **Implemented:** additional candidate regression tests in both development branches. **Tested:** Phase 1 automated CI passed; Phase 2 latest-head CI and real device/staff acceptance unverified. **Deployed:** NO. No production service, Postgres schema, Lightspeed records, credential, Timeclock PIN, Chrome extension, or Discord bot changed.
- Next end-to-end pilot needs an isolated HTTPS staging stack with real independent first-owner passkey bootstrap, tested manager authorization, test employee's own consent/session, credential-recovery controls, legacy Timeclock route audit, and exact tool read grants. Do not use a PIN alone to enroll a strong factor or mount public security endpoints.

## Owner clarification — tool access does not require clock-in (2026-11-05)

- Owner explicitly confirmed their existing PIN is linked to an owner account in legacy Timeclock, though not integrated into the newer security architecture. A separate test PIN was described as unlinked. **Do not conflate them or request PIN values.**
- Tool access is independent of clock-in state, shifts, payroll hours and open time entries. Active owner/staff identity + signed session + verified appropriate workstation/MFA + exact operation grant are the relevant security gates; no one needs to clock in merely to use business tools.
- Source inspection of consolidated `services/staffAuthGateway.js` and `services/scannerTimeclockIdentity.js` found no explicit clock-in requirement in the common staff authentication route/bridge. This does not verify every downstream feature route; test those before rollout.
- Next: confirm current owner PIN resolves to the intended stable Timeclock employee ID without exposing/changing credential; add off-clock/owner authorization regressions; continue independent passkey bootstrap and staging acceptance before route exposure.
- **Status:** requirement documented; no production PIN/session, permission, deploy, Railway, or Lightspeed changes.

## Continued off-clock access development and staging audit — 2026-11-05

- Inspected actual consolidated Timeclock `timeclock/server.js` trusted Scanner `verify-pin` and `authorize` handlers: both look up `employees` where `active=TRUE`; neither checks `time_entries` or clock-in status. The consolidated `services/staffAuthGateway.js` and backend `scannerTimeclockIdentity.js` likewise have no clock-in requirement. This verifies **the current shared identity path**, not all feature routes or live Owner PIN mapping.
- Added synthetic off-clock Owner/staff, clocked-in staff, missing clock-state and inactive employee tests to `tests/shared-staff-bridge.test.mjs`: PR #32 `1faf85d89b9c62f2b39b55a72ea42ae1ba3f8a1b` and mirrored PR #33 `205bf27d2ed02d96b79dab602e8d2b9301b69e5c`. Off-clock staff with a verified, authorized session must retain permitted routine reads, but must not gain production-write privilege from clock status.
- Added real signed gateway regression: synthetic Owner signs in using a test PIN, bound session remains valid before clock-in, during clock-in and after clock-out; inactive account revocation denies. File `tests/shared-staff-binding.test.mjs`: PR #32 `ad15402dac4fd5627e14b789b0028af8e439ed46`; mirrored PR #33 `d7786d044170e453d0e1fa50fc84938a65855e0b`. Tests use fixture PIN only; no real account or secret touched.
- Railway read-only audit: project **Hobby Corner Integration Test**, environment **test**, service **staff-security-staging** exists on branch `feature/shared-lightspeed-services-phase1-20261029`, with a SUCCESS deployment dated 2026-11-05 and source config commit pin `49c81533fe2c6bbeb3189319afc039299b95be96`. Later stage patch `43c28c64-63db-436e-b5ce-909f97949a4d` is **STAGED, not applied**, introducing owner passkey/bootstrap/enrollment flags and a proposed source pin. Do not infer those new passkey/enrollment routes are live from branch contents or execute the pending patch without owner authorization.
- Branch also contains isolated synthetic Owner identity/login, one-time staging PIN setup, independently gated first Owner passkey bootstrap and enrollment candidates. Their existence in branch/CI does not mean they are switched on in Railway. Stage uses independent synthetic employee identity, not production Timeclock owner account. Keep these distinct.
- **Implemented:** non-production regression code on both security branches. **Tested:** PR #32 `ad15402dac4fd5627e14b789b0028af8e439ed46` CI **PASS**: Shared Lightspeed foundation `42086923747`, Scanner integration `42086923765`, Core Operations UI `42086923771`; PR #33 latest commit workflow runs not yet confirmed. **Deployed:** only previously approved isolated staging build; this development did not deploy or change production, credentials, employee records, or Railway configuration.
- Next: finish current-head CI check; then obtain explicit staging passkey/bootstrap activation approval and real hardware registration/backup ceremony. Owner's legacy Timeclock PIN should be checked privately through the signed gateway in an approved integration test, never pasted into GitHub/chat/logs. No additional staging/production writes until that decision.

## Isolated owner passkey bootstrap activation — November 5, 2026

- Owner confirmed independently created two new staging security keys. Railway test service variable inventory confirms the names are present; credential values were not read or logged.
- In Hobby Corner Integration Test / test / staff-security-staging, existing pending changes had already been applied externally before this review. A new commit was deploying.
- Explicitly staged and committed **bootstrap-only** configuration for the same isolated test service: PASSKEY enabled, BOOTSTRAP enabled; manager APPROVAL disabled, Authenticator ENROLLMENT disabled; existing isolated PIN store remains database-backed and PIN setup disabled. The staged patch contained only the two passkey/bootstrap additions and no destructive operations. Railway workflow `commitChanges/24b41ef2-e3d8-4c7a-b011-355204ecf075/4ba83d9d-51a1-4507-971c-4c9a9d0d208d` triggered the test deployment.
- Deploy `37f71aca-d0ae-4229-b9c9-cccf06df7d77` was still DEPLOYING at last query; previous deploy `4181eb94-bad3-4dcb-babb-269e0bdcef2d` succeeded. **Do not claim passkey enrollment works until newest deployment is SUCCESS and real browser WebAuthn completes.**
- Production Lightspeed API, Timeclock, live employees and Chrome extension were not changed. Next action: verify latest deploy healthy, then owner completes same-origin synthetic test account PIN + independently stored one-time bootstrap key + device WebAuthn ceremony at `https://staff-security-staging-test.up.railway.app/test-owner-passkey`. Never share keys or PIN in chat.


## Isolated passkey startup diagnosis and guarded recovery — 2026-11-05

- Verified failed Railway deployment `37f71aca-d0ae-4229-b9c9-cccf06df7d77`: build succeeded but startup exited and healthcheck failed; previous successful service remained online. Connector exposes security-variable names only, not values.
- Added **redacted setting-name preflight** to `staging/staff-security-server.js` and regression to `tests/shared-security-isolated-startup.test.mjs` on Phase 1 `1e5918c282c58829cf82ee90c23c927fd7b8c08b`, mirrored Phase 2 `74496fab51297fa65a3e5edf48ad14ad74a21659`. Corrected preflight order after an initial failed test. Latest Phase 1 CI **PASS**: foundation `42094189979`, Scanner `42094189862`, Core Operations `42094189818`. No runtime secret values are printed.
- Deployed diagnostic to isolated test only: `c60fd5c8-16bd-4b2e-9183-137f427ae0e6`. Its logs concretely identify invalid `HC_STAGING_PASSKEY_SIGNING_SECRET` and `HC_STAGING_OWNER_BOOTSTRAP_KEY` values (name/format failure only). Correct secret contents not accessible/read. Do **not** weaken validation or assume keys are ready from their existence.
- Staged and committed the two passkey/bootstrap flags to **false** while retaining Authenticator enrollment/manager approval disabled; triggered protected recovery deploy `46d23628-82f2-4353-a000-bb624ac506cf`. Recovery deployment **SUCCESS verified** on Railway: `46d23628-82f2-4353-a000-bb624ac506cf`; passkey/bootstrap flags remain disabled until independently valid owner-held credentials are provided.
- To continue, Owner must generate **two independent cryptographically random values** privately and replace the corresponding Railway test service variables: passkey signing secret minimum 32 characters; bootstrap key base64url characters `[A-Za-z0-9_-]`, length 43-256. Retain the bootstrap key privately, without pasting in chat. Later activate bootstrap-only flags and test hardware passkey; only retire bootstrap after successful first passkey registration.
- No production deployment, database changes, actual Timeclock PIN, Chrome extension, customer or Lightspeed data touched.


## Owner passkey bootstrap reactivation after corrected keys — 2026-11-05

- Owner reported the two isolated staging credentials had been corrected privately. Railway variable names were confirmed present, values remain redacted and were not retrieved.
- A credential-update deployment `bb463c0d-a4b3-4b82-8a48-7edaef9d9390` reached SUCCESS with passkey/bootstrap flags disabled.
- Explicitly staged and reviewed a non-destructive patch affecting only `staff-security-staging`, enabling `HC_STAGING_OWNER_PASSKEY_ENABLED=true` and `HC_STAGING_OWNER_BOOTSTRAP_ENABLED=true`, while keeping `HC_STAGING_OWNER_ENROLLMENT_ENABLED=false` and `HC_STAGING_OWNER_APPROVAL_ENABLED=false`; existing database-backed PIN mode and one-time PIN setup disabled.
- Committed patch `6e37e8e9-3c12-4d2d-bdee-67b20815552e` to isolated test environment; deployment `0c69a644-3f4e-40e7-8812-f7042665bf1f` was DEPLOYING at last check. Do not report passkey registration ready until latest deploy is SUCCESS. Review failure diagnostics by configuration **name** only if it fails.
- No production deployment, Timeclock employee modification, secret disclosure, or Chrome extension release. When latest deployment is healthy, Owner alone can complete real WebAuthn registration with the private synthetic staging PIN and separately stored bootstrap key at `https://staff-security-staging-test.up.railway.app/test-owner-passkey`, followed by a verification ceremony.
