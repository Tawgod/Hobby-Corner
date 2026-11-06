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
- Committed patch `6e37e8e9-3c12-4d2d-bdee-67b20815552e` to isolated test environment; deployment `0c69a644-3f4e-40e7-8812-f7042665bf1f` reached **SUCCESS**; Railway environment status **Online, 1/1 replicas**, with no observed startup validation errors. Real device WebAuthn registration and verification are still untested. Review failure diagnostics by configuration **name** only if it fails.
- No production deployment, Timeclock employee modification, secret disclosure, or Chrome extension release. When latest deployment is healthy, Owner alone can complete real WebAuthn registration with the private synthetic staging PIN and separately stored bootstrap key at `https://staff-security-staging-test.up.railway.app/test-owner-passkey`, followed by a verification ceremony.


## Real Owner passkey proof and one-time bootstrap retirement — 2026-11-06

- Owner reported **"Verified (five minutes maximum)"** from the synthetic staging Owner passkey pilot. This is **user-reported real-device verification**, consistent with a server-issued five-minute passkey proof; independent server credential audit/real-device test capture has not yet been conducted in this chat. It does not establish production staff enrollment.
- Railway confirmed previous bootstrap-enabled deployment `0c69a644-3f4e-40e7-8812-f7042665bf1f` SUCCESS, and configuration with no staged changes.
- Explicitly staged and committed retirement patch `768ca4c1-6396-4933-8b60-54bb53374d8a`: `HC_STAGING_OWNER_BOOTSTRAP_ENABLED=false` and `HC_STAGING_OWNER_BOOTSTRAP_KEY=""`. Keep `HC_STAGING_OWNER_PASSKEY_ENABLED=true`; manager approval and Authenticator enrollment remain disabled. This closes the one-time bootstrap route without deleting the registered passkey or signing secret.
- Retirement redeploy `95347218-88b1-4ddd-af73-15fd0734312a` was verified **SUCCESS** in Railway. With bootstrap disabled, source routing selects `test-owner-passkey-verify.html` (verification-only mode); a live authenticated UI/HTTP check was not performed in this chat.
- Staging test identity `901` is not the production Timeclock Owner account. Subsequent manager-approved Authenticator enrollment requires separate strong secrets, explicit flag staging, and actual permission/replay verification. Do not enable enrollment automatically.
- No production deploy, real Timeclock PIN, live Lightspeed API, Chrome extension, or employee records changed.


## Owner-approved continued development: passkey-gated Authenticator enrollment (2026-11-06)

**System:** Shared Lightspeed security / isolated staging. **Status:** In Development; automated tests PASS; NOT deployed. User instructed to continue development until real participation required.

**Verified source review:** Existing `staging/isolated-owner-enrollment.js`, `staging/isolated-owner-approval-policy.js`, `services/security/staffSecuritySubsystem.js`, `staff-passkey-client.js`, and `staging/migrate-isolated-test-login.js` already compose invitation-backed, passkey-approved, signed-staff-session-bound TOTP enrollment, with recovery disabled. Enrollment migration additionally confirms a first Owner passkey exists and that the one-time bootstrap was consumed. Source never requires a clock-in status.

**Gap fixed:** Retired-bootstrap `/test-owner-passkey` UI hid manager approval even when enrollment flags would be enabled. Added `staging/test-owner-passkey-approve.html` and gated source selection in `staging/isolated-test-login.js`: only when independently configured `HC_STAGING_OWNER_ENROLLMENT_ENABLED=true` is the approval UI served. Passkey registration remains closed, and an active five-minute proof plus an exact pending request ID is still required. Added regression to `tests/shared-security-isolated-owner-enrollment.test.mjs` for the approval-enabled page versus verify-only disabled state.

**Git branches:** Phase 1 `feature/shared-lightspeed-services-phase1-20261029`, tested feature commit `31d456dcd049828a9544d72fbbd2851c2d6824dc` (subsequent documentation commit `974d532704835902ad3356b5351a8bcaa2f3b60a`); mirrored Phase 2 `feature/shared-lightspeed-services-phase2-reads-20261029`, feature commit `04b5ad724d75b28bda435a043ce882e0b3e267ae`, documentation commit `75f26199fa8a39821715f9efa03284defe9aed74`. New guide `docs/STAFF_SECURITY_STAGING_ENROLLMENT.md`.

**Automated validation:** Phase 1 feature commit CI SUCCESS: Shared Lightspeed foundation `42234670004`, Scanner regression `42234670089`, Core Operations UI `42234670079`. Phase 2 latest-head CI unverified. Actual device/bot/TOTP approval flow not yet acceptance-tested.

**Railway read-only audit:** The isolated `Hobby Corner Integration Test/test/staff-security-staging` variable inventory lacks all five required independent enrollment secrets: `HC_STAGING_APPROVAL_HMAC_SECRET`, `HC_STAGING_MFA_SESSION_SECRET`, `HC_STAGING_INVITE_BOT_SECRET`, `HC_STAGING_INVITE_TOKEN_SECRET`, `HC_STAGING_TOTP_ENCRYPTION_KEY`. Values cannot be read from connector; never request them in chat. Current feature flags remain disabled. No staging redeployment, production changes, database schema writes, bot deployment, or Chrome release in this development step.

**Next action needing owner:** Privately provision four *different* independent 32+-character random strings and one distinct standard-Base64 encoded 32-byte AES TOTP key in the isolated Railway test service; test Bot invitation credentials and restricted staging delivery also need to be established. After verifying keys and exact test-only permissions, stage/verify/activate approval and enrollment flags; then owner performs real passkey-approved Google Authenticator acceptance. Do NOT automatically enable enrollment or production without all prerequisites.


## Isolated Owner-approved Authenticator enrollment activation — 2026-11-06

**Scope:** `Hobby Corner Integration Test` Railway project, `test` environment, `staff-security-staging` service ONLY. No production deployment or real employee migration.

- Owner reported provisioning five unique staging-only enrollment secrets. Verified Railway variable inventory includes `HC_STAGING_APPROVAL_HMAC_SECRET`, `HC_STAGING_MFA_SESSION_SECRET`, `HC_STAGING_INVITE_BOT_SECRET`, `HC_STAGING_INVITE_TOKEN_SECRET`, and `HC_STAGING_TOTP_ENCRYPTION_KEY`. Values were redacted; were not retrieved, logged, or copied. The previously disabled staging build `b53054da-5353-4060-ac18-ba8013b54b4e` succeeded.
- Explicitly staged flags `HC_STAGING_OWNER_APPROVAL_ENABLED=true`, `HC_STAGING_OWNER_ENROLLMENT_ENABLED=true`, while keeping `HC_STAGING_OWNER_PASSKEY_ENABLED=true`, `HC_STAGING_OWNER_BOOTSTRAP_ENABLED=false`, empty bootstrap key, `HC_STAGING_PIN_STORE_MODE=database`, and `HC_STAGING_PIN_SETUP_ENABLED=false`. Reviewed environment patch `6ee4e9e1-c079-4488-a5c9-cc5c5c801e59`: only two flag updates, isolated service only, non-destructive.
- Applied isolated test patch; Railway deployment **`3ee582db-1b94-4542-bfed-760f497a7b0b` SUCCESS**, environment status **Online, 1/1 replicas**, no remaining staged changes. Deployed source commit `974d532704835902ad3356b5351a8bcaa2f3b60a` from Phase 1. This verifies service startup and database gate, not a completed live Discord/Google Authenticator acceptance test.
- Approval-only Owner passkey page is expected at `https://staff-security-staging-test.up.railway.app/test-owner-passkey` when enrollment enabled, with verification-only owner bootstrap restrictions. Direct external web fetch was not accessible from this chat, so HTTP route/page acceptance remains unverified.
- Existing prospective isolated Bot invitation transport is `Tawgod/Hobby-Corner-Discord-Bot:feature/security-enrollment-invites-20261102` draft, not verified as deployed or connected to this staging backend. The invitation-only enrollment request route remains unusable by a real employee until an approved test Bot configuration and private invitation delivery is connected. Never substitute the live production Bot without independent release approval.
- **Implemented:** backend staging enrollment/approval routers, synthetic identity, signed passkey gating, guarded UI. **Automated tested:** Phase 1 CI PASS `42234670004` foundation, `42234670089` Scanner, `42234670079` Core Operations. **Deployed:** isolated staging enrollment backend only. **Remaining testing:** real private test invitation, manager passkey approval of exact pending request, Google Authenticator QR/6-digit confirmation, revocation/replay/negative tests.
- **Next:** review test Bot deployment wiring and share no bot secrets in chat; configure test-only bot service and independently authorized command, or another audited invitation issuing path; complete real-device Authenticator acceptance before wider rollout. No Timeclock PIN or production Lightspeed data changed.


## Malcor test Discord bot discovery and integration boundary — 2026-11-06

- User clarified their *existing second bot* is hosted in Railway **Malcor**. Actual Railway project `Malcor` (`eadb4129-07e1-4599-bf89-21a6fa2583b9`) lists one environment named **staging** (`cf0cd4f3-8125-4123-b59b-d66e4d9bb677`), not production; because it is actively running, treat as LIVE and do not change casually. Service `malcor-discord-bot` (`7f6dd4e8-cb20-407b-b129-afd9971cf0dd`) was **online**, last deployed successfully as `2cd27217-5df8-4e7f-a871-2b2313293ae8` from `Tawgod/Malcor:main`. Runtime logs show Discord Gateway RESUMED.
- Current source is **not** the staged security branch. There is an existing uncommitted Railway staging patch `0d760293-efc3-40bd-87b4-58893b905e31` with 12 changes, including switching source to `Tawgod/Malcor:feature/hobby-corner-owner-security-test-20261103` commit `d876b822ba3d31c72dd4d002ca95c2a0cadaa261`, test security/status flags and core guild/channel/owner variables. No change was applied by this review.
- The existing feature branch implements `modules/hobby-corner-security/owner-invite.ts`, called by `apps/discord-bot/main.ts`. Deterministic mention command `@Malcor hc security setup` is restricted to the exact designated test owner, test guild and channel, and only self-targets. Sends an authenticated POST to `/staff-enrollment-invites/bot/issue`, validates matching HTTPS origin and fragment-only invitation URL, sends the link **privately by Discord DM**, never posts the link to public channels; fail-closed on delivery failure. `modules/hobby-corner-security/status.ts` has a separate read-only `hc security status` command. The backend's isolated `ownerOnlyTest` invitation branch explicitly supports empty `roleIds` for the matching test owner/channel.
- **Integration prerequisites not configured in current Malcor variables:** `MALCOR_HC_SECURITY_BOT_KEY`, `MALCOR_HC_SECURITY_API_ORIGIN`, `MALCOR_HC_SECURITY_PUBLIC_ORIGIN`. The BOT_KEY must equal the isolated security backend's privately stored `HC_STAGING_INVITE_BOT_SECRET`; secrets may only be entered in Railway's private Variables UI and never pasted into chat or code. Both origin variables must be `https://staff-security-staging-test.up.railway.app` (matching backend hardcoded staging origin). The source requires `MALCOR_HC_SECURITY_ENV=isolated-staging`, scoped owner/guild/channel, and an explicit `MALCOR_HC_SECURITY_ENABLED=true` flag.
- Do **not** merge or deploy the feature to the actively running Malcor bot yet: first reconcile all 12 pending staged changes and validate code/tests/source; switching branch/flags may interrupt the live bot or conflict with existing other features. Avoid introducing a duplicate Discord bot or running simultaneous instances with the same Discord bot token.
- **Status:** Candidate source implemented, live service online, integration not configured or deployed, real private invitation not tested. Next: owner privately configures key + origin variables in Malcor Railway staging; then review full patch and obtain explicit deployment approval (production-like live service), test DM + actual passkey approval and Google Authenticator. No Railway writes, bot secrets, production data, or deployments changed by this audit.


## Malcor staged invitation integration review after owner configuration — 2026-11-06

- User reported “Malcor configured.” Read-only Railway inspection shows **three relevant variables are in STAGED changes, not live variables**: `MALCOR_HC_SECURITY_API_ORIGIN`, `MALCOR_HC_SECURITY_BOT_KEY`, and a mistyped `MALCOR_HC_SECURITY_PUBLIC_ORIG`. The bot credential's value cannot be read/compared to backend `HC_STAGING_INVITE_BOT_SECRET`; user must have copied the exact same key privately. The misspelled variable does **not** satisfy code requiring `MALCOR_HC_SECURITY_PUBLIC_ORIGIN`.
- Fixed the **staged config only** by adding correct `MALCOR_HC_SECURITY_PUBLIC_ORIGIN` with `https://staff-security-staging-test.up.railway.app`. Explicitly staged exact approved test-only values for `MALCOR_HC_SECURITY_API_ORIGIN`, `MALCOR_HC_STATUS_API_ORIGIN`, `MALCOR_HC_SECURITY_CHANNEL_ID`, `MALCOR_HC_SECURITY_ENV=isolated-staging`, and enabled security/status flags. No secrets read or overwritten. The misspelled `MALCOR_HC_SECURITY_PUBLIC_ORIG` remains an **extraneous staged variable**, because connector offers no delete-variable action; remove through Railway dashboard before deployment.
- Malcor Railway project `Malcor`, environment **staging** (live running Discord Gateway), service `malcor-discord-bot` is online at successful deployment `2cd27217-5df8-4e7f-a871-2b2313293ae8` from `Tawgod/Malcor:main`. It is **not** running the security branch.
- Reviewed pending patch `0d760293-efc3-40bd-87b4-58893b905e31` with 12 staged fields, including switch to pinned `Tawgod/Malcor:feature/hobby-corner-owner-security-test-20261103` commit `d876b822ba3d31c72dd4d002ca95c2a0cadaa261` and `ALLOWED_CHANNEL_IDS`. Branch implements deterministic owner-only `hc security setup` and read-only `hc security status`. Feature is draft Malcor PR #8; latest staged commit had no PR-triggered workflow runs or commit statuses visible in GitHub connector. No independent build/CI PASS verified for this exact head.
- No Railway accept/deploy or GitHub merge was performed: applying the patch would replace the **running** Malcor Discord bot's source/config, potentially affecting its everyday functions, and must be explicitly approved after reconciliation and preferably a CI/test check. Avoid running duplicate Discord token connections. Other Malcor PRs are in flight and should not be accidentally included.
- **Status:** Invitation code present in development; API/backend staging enrollment deployed; Malcor integration staged not deployed; end-to-end DM/Google Authenticator untested. Next: remove misspelled staged variable, verify exact private key match and channel allowlist/owner/guild intended values in Railway UI without disclosing secrets, secure approval to deploy existing live Malcor bot, then run private invite + Owner passkey approval + TOTP device acceptance. No production Lightspeed/Timeclock changes.


## Malcor Owner security invitation staging deployed — 2026-11-06

- Owner explicitly authorized deployment of the existing Malcor staging security branch. Railway `Malcor` project environment `staging`, service `malcor-discord-bot`.
- Re-reviewed staged patch `0d760293-efc3-40bd-87b4-58893b905e31` on 2026-11-06. It contained **11 non-destructive changes solely to the Malcor bot**: switch to `Tawgod/Malcor:feature/hobby-corner-owner-security-test-20261103`, pin `d876b822ba3d31c72dd4d002ca95c2a0cadaa261`, and intended channel/security/status configuration. The earlier mistyped `MALCOR_HC_SECURITY_PUBLIC_ORIG` had been removed from the patch; correctly named `MALCOR_HC_SECURITY_PUBLIC_ORIGIN` was present. Existing bot key value was never read. Draft PR #8 had no available passing CI status for pinned commit.
- Accepted staged Railway patch with workflow `commitChanges/cf0cd4f3-8125-4123-b59b-d66e4d9bb677/0d760293-efc3-40bd-87b4-58893b905e31`. Deployed Malcor service `ff682637-312f-455d-810c-0855c02445b6` **SUCCESS**. Runtime logs confirmed **`Malcor Gateway READY (no message content logging)`**, with no startup error observed. Previous `main` deployment `2cd27217-5df8-4e7f-a871-2b2313293ae8` was removed.
- **Implemented/deployed:** owner-only `@Malcor hc security setup` branch code and separate `@Malcor hc security status`, exact guild/channel/owner restrictions; private DM link path and backend validation. **Not yet tested:** actual Discord command round-trip, bot key match with backend, DM delivery, one-time invitation redemption, passkey approval of request, Google Authenticator confirmation, ordinary Malcor mention/AI response after switch.
- Important: Staging runtime uses the existing Malcor bot Discord token, not an added parallel bot; no separate Gateway instance was created by us. Production Lightspeed, Timeclock, employee records and Chrome extension untouched.
- **Next user action:** in the designated test guild and channel, mention Malcor with `hc security status` to check the isolated security API and `hc security setup` to issue a private owner-only invitation. Report only generic success/failure messages; never paste invitation URL, bootstrap key, test PIN, QR, or factor codes in chat. If DM arrives, privately redeem using the synthetic staging employee session, then authenticate with the registered Owner passkey on `/test-owner-passkey` to approve the exact request, then complete Google Authenticator setup and negative tests.


## Malcor private invitation real Discord acceptance — 2026-11-06

- Owner reported a real Discord `@Malcor hc security setup` command in the authorized test channel. Malcor replied that a private test invitation was sent, and the owner reported receiving the private DM with the expected `https://staff-security-staging-test.up.railway.app/staff-security/#invite=...` structure and a 15-minute expiry.
- **Status: TESTING, partial real-world acceptance passed**: Discord command routing, backend issuance, and DM delivery are user-confirmed; invitation redemption, session binding, Owner passkey manager approval, TOTP QR setup and six-digit confirmation remain untested.
- **Security handling:** The owner included the one-time bearer invitation token in the chat. Do not reproduce or store the raw token in GitHub docs, logs, handoffs, or further prompts. Treat the shared invitation as exposed; instruct owner to request a fresh private DM and use it only in the browser. Tokens expire after 15 minutes and are one-use.
- No source, deployment, employee, or production configuration was changed for this acceptance update.


## Fix: invited staging employee sign-in unavailable — 2026-11-06

- Owner reported `Staff sign-in is not available.` after opening Malcor DM invitation and signing in on `/staff-security/`.
- **Root cause verified in source:** `staff-security.html` loads `/shared-ui/staff-auth.js`, and `staff-security-client.js` calls `window.HCStaffAuth.signIn`. The isolated `staging/isolated-test-login.js` composition did NOT serve that shared-UI auth script. Browser optional call resolved undefined, producing precisely the reported message. This did **not** indicate a bad test PIN, an invalid real Timeclock identity, or a failure to issue the Discord invitation.
- **Fix:** added `staging/isolated-staff-auth-client.js` with memory-only signed synthetic test session adapter (`signIn`, `verify`, `readSession`, `signOut`). Uses only `/api/staff-auth/session`, requires synthetic employee ID `901` and `permissionSource=synthetic_staging_only`, validates the returned token, refuses other identities, clears session on `pagehide`, and never uses storage/real employee credentials. Mounted as `/shared-ui/staff-auth.js` **only when** isolated Owner enrollment is active; production/shared normal auth routes unchanged.
- Added browser-adapter tests `tests/shared-security-isolated-staff-auth-client.test.mjs` and enrollment route asset assertion in `tests/shared-security-isolated-owner-enrollment.test.mjs`. Fixed one initially malformed regression-test regex after CI identified it.
- **Branch commits:** Phase 1 final fix commit `d3b5e5c837bfc94be268f9d1f1408449f1cd57a1`; mirrored Phase 2 `ad7dc9d3f311d33ea991d51b3363ad4fd6a1987d`. Phase 1 CI **PASS** on final commit: Shared Lightspeed foundation `42247171106`, Scanner `42247171020`, Core Operations UI `42247171435`. Phase 2 tests not separately verified.
- Reviewed a non-destructive, source-commit-only patch `b4eff0b7-70e8-41c5-b1d9-5082732cbd59` for the isolated Railway security service; deployed `6146da26-691d-4b18-aa49-0136970f560d` **SUCCESS**. Environment status **Online, 1/1 replicas, 0 warnings/critical**. No Malcor/bot deployment, no production Timeclock or Lightspeed edits.
- **Remaining acceptance:** user should issue a **new** Malcor test invite privately (previous shared invite token was exposed), visit it promptly, authenticate with synthetic **staging** PIN on the same page, check that invitation is redeemed and pending request ID appears. Then verify Owner passkey at `/test-owner-passkey`, approve exact pending request, and test Google Authenticator QR/6-digit confirmation. Never paste private invite token, PIN, QR, TOTP code or secret.

## Staging Authenticator real-device acceptance — 2026-11-06

- **Testing / positive path passed (user-reported):** On the isolated synthetic Owner identity, a fresh Malcor Discord private invitation was received and redeemed, a pending request ID appeared, independent Owner passkey approval succeeded, Google Authenticator enrolled with status **Enabled**, and a subsequent fresh six-digit code produced **Verified** in Secure convention access. These are user-observed UI results, not an independent audit of the underlying database events.
- **Deployed staging references already verified:** Malcor invitation bot `ff682637-312f-455d-810c-0855c02445b6`; isolated staff-security service `6146da26-691d-4b18-aa49-0136970f560d`. No production Lightspeed, Timeclock, or employee security settings changed.
- **Not yet verified:** incorrect/expired TOTP rejection, replay resistance, invitation replay/expiry, session expiry, cross-employee authorization and recovery behavior. Do not classify employee rollout as ready until these fail-closed tests are completed.
- **Next:** carry out negative-path staging tests, then document independent security review and decide whether to plan production rollout. Never record PINs, invitation links, QR seeds, or OTP codes in GitHub.

## Invalid Authenticator code acceptance — 2026-11-06

- Owner confirmed user-visible **Verified** after correct six-digit Authenticator challenge, then tested deliberately incorrect six-digit code in the isolated staging **Secure convention access** form.
- UI cleared prior proof state to **Not verified** and displayed **“Your session or code was not accepted. Please sign in or try a new six-digit code.”** Owner located error in top-of-page notification. **Result: incorrect code rejected (user-confirmed).**
- Source `staff-security-client.js` calls `discardMfa()` before POST `/staff-security/api/mfa/session`; it only stores ephemeral proof in memory if server returns a signed token with valid shape and expiry. Backend audit/replay/expired-code/unauthorized-access checks remain to do.
- **UX issue:** security failure notification is distant from the convention verification form. Recommend duplicating an accessible inline error adjacent to the code field while preserving generic authentication error wording, throttling and absence of sensitive debug details. No rollout or production deployment authorized by this acceptance report.

## TOTP expiration, replay, and session boundary verification — 2026-11-06

**Status: Testing — automated boundary verification passed, real-device boundary acceptance pending.**

- User requested verification of expired authenticator code behavior, code replay prevention, and session expiration after positive and incorrect-code real-device checks.
- Verified source controls: `services/security/staffTotp.js` uses 30-second TOTP steps and ±1 step tolerance; `staffTotpPostgres.js` atomically serializes account verifications with row locking, refuses a step <= stored `last_used_step`, and persistently reserves accepted step; `staffMfaSessions.js` binds a signed proof to the verified base employee session and enrolled factor generation, with <=300-second TTL; `scannerSessions.js` verifies signed 900-second base-session expiry.
- Added deterministic tests `tests/shared-security-totp-expiry-replay-session.test.mjs`, covering expired out-of-tolerance TOTP codes, repeated use of a previously accepted code (durable adapter simulated), acceptance of a newer step, MFA proof expiry exactly at five minutes, proof rejection after base session binding changes and after factor generation rotates, plus bound synthetic PIN session rejection at fifteen minutes. This test uses generated fixture secrets, not the owner's real Authenticator QR/secret or PIN.
- Test was added explicitly to `.github/workflows/shared-lightspeed-foundation.yml` as a dedicated CI step. GitHub branch `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029` commit `496f533b6b529e73cc39a5519dadd9a3ca75eb26`: **Shared Lightspeed foundation workflow `42258385136` SUCCESS** (including new security boundary test), Scanner integration `42258385101` SUCCESS. Core Operations UI navigation `42258385021` still in progress at report time; verify before citing a final pass. Mirrored boundary test to Phase 2 branch commit `8c25f7435d126266a782382de8fd3fc5a6d56393`.
- **No Railway deployment performed for these tests.** Implementation remains already deployed isolated security service `6146da26-691d-4b18-aa49-0136970f560d`; source change is test-only plus CI definition and does not require service redeploy. No production employees, Timeclock, Discord bot, or Chrome extension modified.
- **Remaining:** optional real-device confirmation that submitting the exact same fresh 6-digit TOTP in the same 30-second step fails after one accepted verification, and an expired OTP submitted after the acceptable clock-skew window fails; verify expiring 5-minute step-up token and 15-minute base session through safe read-only endpoint/UI acceptance if needed. Avoid showing actual OTPs or factors in conversation. Also test concurrent replay and real PostgreSQL transaction behavior; simulated database test is not equivalent to an actual concurrent live DB test.

## Real-device TOTP replay rejection acceptance — 2026-11-06

- **Testing; user-confirmed:** The user verified that an Authenticator code successfully accepted once by the isolated staging Secure convention access form was rejected when submitted a second time. This adds real-device replay rejection evidence beyond the synthetic replay regression.
- Earlier automated checks cover out-of-window code rejection, last-used-step enforcement, MFA proof TTL, base session expiry and factor/session binding. These tests are not substitutes for live concurrent PostgreSQL replay tests.
- Remaining acceptance: real-device five-minute step-up expiry, fifteen-minute base session expiration, cross-session denial, concurrent replay and other unauthorized enrollment paths. No production security rollout authorized or performed.
- No tokens, OTP values, invitation fragments or seeds stored in this handoff.

## Server-checked Authenticator status button — 2026-11-06

**Status: Deployed in isolated staging; automated tests PASS; real-device UI acceptance pending.**

- Added a **Check verification status** button directly under the Secure convention access Authenticator code field in `staff-security.html`, with adjacent accessible `mfaStatusMessage` status text.
- `staff-security-client.js` checks the **existing** memory-only signed MFA proof via same-origin `GET /staff-security/api/mfa/session` (bearer signed base employee session and `x-hc-mfa-session` header). It does not submit another six-digit code or place token/seed in storage or URL.
- On a valid server result, shows **Verified** and a confirmed-server status; on local five-minute expiry or server 401, clears proof and shows **Expired** with re-verification guidance. If no proof (e.g., signing out or leaving tab), shows **Not verified**; on connectivity/503 failure shows an error instead of claiming expired or server verified.
- Added `tests/shared-staff-mfa-status-button.test.mjs` with server-verified, unauthorized, local expiry and service outage cases; mirrored HTML, JS and test to Phase 2. Updated Phase 1/Phase 2 shared foundation CI to run the test. Phase 1 source commit `56f11d40153c3ad48f1b70cefcfa430ad62fd75b`; Phase 2 source commit `b894a0f89484501ec5ff78c185738533a0e77f16`.
- GitHub Actions for Phase 1 commit `56f11d4`: Shared Lightspeed foundation `42263080311` **SUCCESS**, Scanner `42263080232` **SUCCESS**, Core Operations `42263080259` **SUCCESS**.
- Reviewed isolated staging non-destructive, one-field (source commit only) patch `170c51ad-eab0-418c-a19c-d1ea5ad96fce`, then applied to Railway **Hobby Corner Integration Test** / **test** / **staff-security-staging**. New deployment `4f16bfc3-2475-48c2-ad1e-3a87434b2316` **SUCCESS**. No changes to Malcor, Timeclock or other production services, and no employee credential changes.
- **Remaining acceptance:** user opens `https://staff-security-staging-test.up.railway.app/staff-security/`, signs into synthetic employee, verifies a fresh Authenticator code, clicks **Check verification status** before five minutes to see server-confirmed Verified, then after five minutes clicks again to see Expired and verify again. Note existing security policy clears the ephemeral proof when document becomes hidden or unloads, so remain on the same tab for the test.

## Five-minute MFA proof expiration real-device acceptance — 2026-11-06

- Owner tested the newly deployed **Check verification status** button in the isolated staging Employee Security Settings page and reported **the verification expires after five minutes**. This is user-confirmed real-device acceptance of the short-lived MFA proof expiration behavior, complementing the automated five-minute boundary test.
- Previously reported real-device tests also passed: successful initial enrollment, fresh MFA verification, malformed/incorrect code rejection, and same-code replay rejection.
- **Status: Testing, not production-ready.** Remaining independent checks: fifteen-minute synthetic PIN session expiry in live browser, simultaneous replay/concurrent Postgres transaction controls, unauthorized/cross-employee access, and security review. No production configuration changes.
- Deployed MFA status button reference: isolated staff-security-staging deployment `4f16bfc3-2475-48c2-ad1e-3a87434b2316`. No credentials or OTPs captured in this handoff.
