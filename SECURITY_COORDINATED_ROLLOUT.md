# Hobby Corner — Coordinated Security Integration and Rollout

## Production service identity evidence — 2026-11-11

**Verified, no production change:** Read Railway `Hobby Corner/production` bot deployments and their exact GitHub blob refs. `Hobby-Corner-Discord-Bot` SUCCESS at `Tawgod/Hobby-Corner-Discord-Bot@7c3af0e`, `main.py`, and `Hobby-Corner-Rewards` SUCCESS at `@ce54862`, `rewards_service.py`; both deployed entrypoint blobs are identical to inspected main source. Discord bot uses `TIMECLOCK_ADMIN_SECRET` to call Timeclock admin employee/PIN/shift/entry/PTO endpoints and separately uses `CUSTOMER_SYNC_ADMIN_KEY` for an hourly master-customer-sync service call. Rewards has its own `REWARDS_ADMIN_KEY`, direct Lightspeed API token and scheduled sync. They need explicit scoped machine identities and separate audit, not human PIN/passkey authorization for each unattended call. Source does not yet establish which service, if any, calls the 14 Special Orders service/hybrid route candidates. Record pending caller investigation; preserve working jobs.

**Browser call test:** [Tawgod/Lightspeed CI 43050974812](https://github.com/Tawgod/Lightspeed/actions/runs/43050974812) SUCCESS, including four-client callsite drift test, API 87-route drift suite, staff and Lightspeed policy and Special Orders compatibility. Draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61) retains these as code-review-only inventories, not mounted authentication guards.

## Browser caller audit milestone — 2026-11-11

**In Development / Testing, no deployment.** The owner verified Codespace pull to `integration/security-all-tools-20261111@2fb6529`, with **5 of 5** 87-route inventory tests passing. Across earlier separate Codespace runs, **36 local tests** passed without failed assertions (19 shared staff policy, 12 secure Lightspeed HTTP/read permission, 5 route inventory). GitHub [43049915660](https://github.com/Tawgod/Lightspeed/actions/runs/43049915660) SUCCESS on 2fb6529.

Development branch [PR #61](https://github.com/Tawgod/Lightspeed/pull/61) now has a **source-only review inventory for four web clients**: `special-orders-client.js` (37 unique URL fragments), `preorders-client.js` (6), `gw-preorders-client.js` (6), and `ordering-client.js` (10), for 59 per-client literal URL references. All clients use `HCStaffAuth` and existing `/api/special-orders`; none has been converted to the new security gate. Added `services/security/coreOperationsBrowserCallerInventory.js`, source-drift tests, and client-file CI triggers. The inventory does **not** prove full runtime routes/methods or service worker callers; no entry implies an automatic grant. Actual Discord/scheduled worker authentication needs separate audit before enforcement.

## Core Operations security mapping (2026-11-11)

**In Development; route inventory created, no production enforcement.** On [draft PR #61](https://github.com/Tawgod/Lightspeed/pull/61), audited 75 `special-orders.js` and 12 nested `routes/specialOrderProducts.js` endpoints (87 total). Added exact method/path/source classification and source-drift tests in `services/security/coreOperationsRouteInventory.js` and `tests/core-operations-route-inventory.test.mjs`, with [review notes](https://github.com/Tawgod/Lightspeed/blob/integration/security-all-tools-20261111/docs/CORE_OPERATIONS_SECURITY_ROUTE_MAPPING.md).

The 87 endpoint candidates include 14 service/batch/hybrid caller endpoints (not safe to replace with interactive passkey prompts), 3 live Lightspeed-write routes, 4 read-via-POST routes and 2 outbound notification/publish effects. All 87 records remain `review:'pending'`; **no middleware, user permissions or service credentials switched**. Future work: inventory 24 direct `server.js` routes, verify actual client and Discord/scheduled callers, split broad staff `special-orders.manage`/`ordering.manage` into owner-approved exact operations, and test phased default-disabled route guards in staging.

## Latest implementation checkpoint — 2026-11-11

**Testing, not deployed:** Codespace operator confirmed 19/19 shared policy tests and 12/12 secured Lightspeed gateway tests passed (31 total). After a missing `express` package on the first gateway attempt, installing project dependencies resolved the failure. The underlying live Special Orders route still accepts a legacy admin key or Timeclock bearer, not the proposed independently verified workstation/MFA+operation grant.

**Targeted defense-in-depth patch:** draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61) removed key-length disclosures from `special-orders.js` health JSON and logs, retaining existing auth behavior. Added `tests/special-orders-auth-metadata.test.mjs`. [CI 43047954793](https://github.com/Tawgod/Lightspeed/actions/runs/43047954793) SUCCESS for cross-tool, secure-read and new Special Orders compatibility regressions. Only development source changed; no production merge, deployed service or database change.

**Next milestone:** route-by-route classification of Special Orders / Ordering / Preorders operations and service workers; inject actual trusted staff device/MFA and server-side exact grant adapters before mounting the shared gate. Maintain the legacy route during parallel development; never enable strict gating until employee login and background jobs pass acceptance.

**Prepared/verified:** 2026-11-11. **Coordinator:** Employee/Admin Security with Shared Lightspeed Services, Shared UI/Navigation, Timeclock, Deployment Coordination, and Chrome release coordination.  
**Overall status: In Development / Blocked for a single coordinated production release.**  
**Owner direction (2026-11-11):** Update *all applicable Hobby Corner tools* to the shared employee/Owner security model rather than shipping only the new Owner-staging Timeclock code. Owner reports no staff currently using the tools. **Railway services remain online; background jobs and external integrations may still operate.** This direction authorizes investigation and coordinated integration work, not blind database migrations, account privilege grants or unreviewed multi-service deployment.

## Desired shared contract

1. **One Timeclock employee identity.** Keep the real existing 4-digit PIN for verified identity/in-store workflows; no duplicate user table, no synthetic Owner 901, and no requirement to be clocked in to use store tools.
2. **Server-verified assurance.** Store Chrome devices need cryptographically registered workstation challenge proof; remote/mobile use server-verified employee-bound passkey/approved MFA. PIN alone is not internet-facing security. Strong recent factor required for privileged actions. TOTP is an approved additional factor for permitted low-risk access and enrollment subject to policy; do not silently downgrade high-risk write protections.
3. **Backend operation grants.** Authorize each exact operation using active Timeclock identity, signed/revocable session, independently validated assurance, trusted role/grant registry and default-deny writes. Client-side menu visibility is convenience, not authorization.
4. **Central Admin.** Owner role follows a privately verified canonical existing employee. Owner can delegate only reviewed scopes; an Admin link shows only when backend grants permit. New Owner activation, migrations, credentials, passkey/TOTP enrollment and protected grants are separate gated operations.
5. **Safe transition.** Avoid breaking clocking, approved Scanner review, supplier flows, preorder background work or purchases; migrate legacy client/server login together and test revocation/session expiry. No 'everyone is admin' fallback or client-provided role override.
6. **Protected integrations.** Discord, scheduled jobs, Rewards, and RMS migration use separately scoped service authorization; not interactive employee PIN reuse. Keep writes to Lightspeed behind its shared gateway, audit, idempotency and readback.

## Production services and route blast radius (read-only verification 2026-11-11)

- Railway project `Hobby Corner`, environment `production`. `timeclock`, `lightspeed-api`, `special-orders-test` each follow `Tawgod/Lightspeed:integration/hobby-corner-consolidation` with latest successful deploy at `014a7a949fe570b756b48d8f59995c1b0a434859` (2026-11-04). No verified per-path watchers. A merge can redeploy **all three**, even when one file is intended for Timeclock.
- `Hobby-Corner-Discord-Bot`, Rewards, Store Map and database are separate Railway services; do not presume absence of background activity from employee inactivity.
- Production `server.js` and latest Owner candidate `server.js` were read and found identical in the inspected version. Both still mount the existing `/api/staff-auth` PIN session and serve Core Operations; they do **not** mount the new employee-security subsystem or Admin router. They also use broad `cors()`. Shared security modules being present in a branch **is not equivalent to enforcement**.
- `shared-ui/staff-auth.js` is likewise byte-identical between deployed source and Owner candidate: 4-digit PIN session plus a legacy `x-hobby-corner-key` fallback. This needs a coordinated migration, not a blanket switch-on.
- Railway production staged patch `20177311-bc46-41cb-b9c6-05b6760a9a6f` contains *only* Timeclock source branch + immutable PR #59 commit pin; **STAGED, NOT APPLIED**. This is an isolated code release fallback, not the newly requested full-tool rollout. Re-review or discard this patch before committing any production rollout.
- `HC Owner Security Staging/test` has patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` for new app, PG18 and volume: 55 changes, not provisioned; app needs reviewed roles, schema, secrets, origin and real Timeclock identity.

## Auth consumer matrix

| Surface / owner | Verified deployed or candidate state | Work necessary before shared security enforcement | Status |
| --- | --- | --- | --- |
| **Timeclock / Split & Recall** | Production legacy PIN/clock/status, with signed Scanner identity. Default-disabled scoped Owner identity PR #59 is CI-tested only | Preserve in-store clock flow; migrate legacy name/PIN-only endpoints and extension callers; revocation and workstation/mobile assurance; stage independent Owner integration safely | In Development |
| **Special Orders, Ordering, Preorders, GW, dashboard** | `server.js` currently serves Core Operations and `/api/staff-auth`; browser helper still has legacy-key fallback | Unify server session + assurance policy on *each* API read/write and linked background service; preserve ordinary employee access, enforce exact writes; update shared header/nav | In Development |
| **Product Scanner / Toolkit Chrome** | Existing private extension/Scanner workflow, shared Queue entry for security; PR #26 UI, PR #22 Timeclock overlay | Registered workstation challenge/response, signed employee session, remove unsafe headers/legacy-only shortcuts only when backend migration passes; coordinated extension release queue | Blocked |
| **Product Manager** | PR #28 candidate not production released | Reuse verified Timeclock sessions, employee profile identity; privileged product actions require independent grant, fresh strong MFA, audit and readback | Planned / In Development |
| **PO Companion + Avery Labels** | PR #31 PO candidate; label UI PR #29 candidate; existing label routes | Secure PO and label reads by employee/session grant, protect any purchase-order mutation distinctly; migrate extension entry points together | Planned / In Development |
| **Consignment** | PR #30 candidate; separate beta exists, production parity unverified | Strong approval for credit/payout/returns and customer-data access; do not reuse read permissions for writes | Planned / In Development |
| **Admin / Settings / employee roster** | PR #34 candidate, Owner stack PRs #52–#60; not mounted on live server | Mount only with genuine strong-factor verifier, backend employee/grant resolver, private first-Owner activation, delegated roles, session revocation; no synthetic Owner | Testing candidate / Blocked |
| **Store Map / new Store Tools** | Separate `store-map` Railway service, security surface not independently accepted | Inventory its actual endpoints; use shared identity/permission gate where staff/admin data is involved, no second login | Planned |
| **Discord, Rewards, scheduled jobs** | Separate live Railway services | Audit service-to-service credentials, background tasks, and employee-impersonation boundaries; map interactive actions back to verified Timeclock employee | Planned |
| **RMS importer/migration** | Separate owner and controlled migration boundary | Keep independent privileged migration controls; only reuse approved identity/read matching, never bulk-write on generic staff grants | Maintenance / Blocked |
| **Future Repair, Back Room, Game Room tools** | Not deployed | Adopt centrally tested gateway/operation registry at creation; avoid extra auth system | Planned |

## Source ancestry / release blockers (GitHub reverified 2026-11-11)

- [#32 shared foundation](https://github.com/Tawgod/Lightspeed/pull/32) — open, non-draft, `feature/shared-lightspeed-services-phase1-20261029@d2a90b49e0f58104f17391c1f67623c256950326`. Cumulative PR is large (118 files, 302 commits). Last-head Foundation, Scanner and Core Ops workflows SUCCESS. Includes unmounted staff security library and unapplied SQL.
- [#33 shared reads + permissions](https://github.com/Tawgod/Lightspeed/pull/33) — draft `feature/shared-lightspeed-services-phase2-reads-20261029@38c6b1fe7e2e623aeefec55ab28aecc896011f1e`, **mergeable=false**, branch vs current #32 **diverged 258 ahead / 272 behind**. Must reconcile; no latest-head PR-triggered runs observed in current query. Do not merge wholesale.
- [#38 secure-read admission](https://github.com/Tawgod/Lightspeed/pull/38) — stacked on #33, `21aa88d5da926121a4503330e8bd24613113836a`, scoped CI SUCCESS; not mounted on deployed feature routes.
- [#34 Admin security foundation](https://github.com/Tawgod/Lightspeed/pull/34) — stacked on #32, `7b712f8a5c1ed0ccd57e5aed78702923eacd939e`; Admin/Scanner/Foundation CI SUCCESS; routers unmounted.
- [#35 unified navigation](https://github.com/Tawgod/Lightspeed/pull/35) — separate from security ancestry, `7b98767dabdfce9579b5d2ed304632a0f704e167`; nav/UI CI SUCCESS. Admin link must consume backend authorized capabilities, not client role claims.
- [#56–#60 Owner setup stack](https://github.com/Tawgod/Lightspeed/pull/60) — multiple stacked draft PRs; PR #60 head `6b6498a01d0cfca42db273f00e97680d140a6ccb`, Owner+Scanner CI SUCCESS. Compared to production integration it is **585 ahead / 3 behind across 237 changed files**. Its production `server.js` remains unchanged; code is not system-wide mounted or ready for production rollout.
- [#59 dedicated Timeclock Owner identity](https://github.com/Tawgod/Lightspeed/pull/59) — independent from #60 ancestry; `a595fd336c5a38dcc5ab5423a8967698777c0929`, CI SUCCESS, manually migrated throttle table not yet applied; separate server credential and exact canonical Owner ID are not configured in Railway.
- [#51 transport safety](https://github.com/Tawgod/Lightspeed/pull/51) remains a distinct draft bug fix atop #32; do not lose it in integration.
- No strong-factor, workstation enrollment, real browser, mobile and production cross-tool acceptance has been performed. Draft PR checks passing does not establish end-to-end readiness.

## Coordinated integration order — no blanket replacement

1. **Freeze and reconcile source.** Choose latest authoritative production base. Map existing branch ancestry, especially #32/#33/#34/#35/#38/#51/#59/#60 and extension PRs #22/#26/#31. Build a dedicated integration candidate in Codespaces. Preserve working features; cherry-pick small reviewed changes rather than merging diverged 200+ commit stacks blindly. Record exact file ownership and changed API contracts.
2. **Build one backend policy bridge.** All interactive tool APIs use the existing Timeclock staff session, active-employee check, registered-workstation or strong remote factor, and exact operation permission at server boundary. Separate read, staged review and true Lightspeed/financial/admin writes. Make unknown/new operations default-deny. Keep disabled until all consumers work.
3. **Mount Admin/Owner in isolated staging first.** Provision only after explicit database/schema/secret approvals; verify actual existing Owner employee mapping privately. Test real passkey/Windows Hello or phone + Google Authenticator and recovery. Never use synthetic ID 901 or browser-provided Owner role.
4. **Update existing browser tools as one navigation/auth contract.** Core Operations pages, shared header/dashboard, Product Manager, PO Companion, labels and Consignment should use a shared signed-session client, predictable expired-session handling and backend permitted links. Remove legacy key/PIN-only fallbacks only once equivalent secure paths pass.
5. **Coordinate extension alongside backend.** Review `Tawgod/Hobby-Corner:main/CHROME_EXTENSION_RELEASE_QUEUE.md`, open extension PRs and authoritative `Tawgod/Lightspeed:integration/hobby-corner-consolidation` before any extension packaging/versioning/release. Registered station proof and Timeclock content script rollout must be mutually compatible; preserve normal clocking.
6. **Exercise staging tests.** Disposable PG18 schema/role tests, server policy contracts for each tool, denied spoofed identity/role/session, Cross-Site and CORS abuse checks, remembered login expiry and offboarding, no writes on read grants, background worker compatibility, Chrome station and convention-mobile tests, Admin owner/nonowner checks, rollback rehearsal.
7. **Deploy progressively even when all tools are idle.** Coordinate production app version + DB migrations only with separate approvals; capture exact live deployment IDs/commits and health checks. Enable new auth gates *after* each consumer has been tested against them. If a gate breaks workflows, fail closed on privileged writes and use planned rollback—never allow an unrestricted old admin fallback.
8. **Finish strong Owner commissioning.** Private operator activation and production privilege changes are a final separate approval after staging acceptance; no PIN, passphrase, OTP, secret, database URL or raw customer data in chats or repo.

## Existing backup / release gates

- Encrypted PostgreSQL 18 archive `hc-production-20261110T213753Z.dump.age`, successful isolated restore into 54 public tables reported by owner, verified USB SHA-256 `55a0b85cea20ebc0fc42e97aecd20d3ebb8368f0752d0e0d2158294592314b81`, passphrase in password manager.
- Owner confirmed same encrypted file visible in private Drive Railway folder; connector search did **not** return file metadata or verify cloud checksum. This is a remaining independent verification caveat, not reason to re-export.
- Do not treat Codespaces backup as durable, implement production SQL migration, merge development stacks, grant Owner privileges, change secret values or publish Chrome until their own release reviews and authorizations.

## Cross-tool policy implementation started — 2026-11-11

**Implemented in development, not deployed:** Created `Tawgod/Lightspeed:integration/security-all-tools-20261111` from draft Owner PR #60 head and opened stacked [draft PR #61](https://github.com/Tawgod/Lightspeed/pull/61). This makes `services/security/staffAccessBaseline.js` consume the existing `adminPermissionCatalog.js` `TOOL_OPERATIONS` directly, supplying a frozen exact assurance policy for all 25 cataloged tool actions. Routine reads, drafts, Scanner staging/review and Timeclock self clocking require registered-station or validated routine MFA plus exact backend grants. High-impact operations require a fresh passkey/security key/approved IdP MFA plus exact backend grant. Client role/extension headers never count as proof. Previous generic actions remain available only within the same guarded contract. `special-orders.manage` / `ordering.manage` default to strong proof *in this unmounted candidate*; the store owner must accept or refine those actions before enforcement.

Added `tests/security-all-tools-operations.test.mjs` and bounded no-dependency `.github/workflows/security-all-tools-policy.yml`, and `docs/SECURITY_ALL_TOOLS_POLICY.md`. They assert exact policy coverage, worker/passkey/TOTP/registered-station separation, denied spoofing/unknown action/disabled staff, and per-operation backend grant checks. **Verified CI:** [Cross-tool policy run 43040636548](https://github.com/Tawgod/Lightspeed/actions/runs/43040636548) completed SUCCESS, with syntax check and new cross-tool policy + existing staff security/bridge test step SUCCESS. This is limited policy/regression CI, not a multi-service or real-device acceptance test. PR #61 remains draft; no rollout/feature mount performed. Next run these tests in the user's Codespace, then reconcile the shared-service #33 branch and wire actual tool routes.

## Additional security integration milestone — 2026-11-11

**Implemented on development branch [draft PR #61](https://github.com/Tawgod/Lightspeed/pull/61), not deployed:** selectively ported `services/lightspeed/permissions.js`, `routes/sharedLightspeedRead.js` and `services/lightspeed/secureReadPolicy.js` plus their original test suites from PRs #33 and #38. Their existing upstream `staffAdapter.js` and `policy.js` dependencies were verified **byte-identical** in the new Owner-based branch, avoiding a wholesale merge of #33's diverged history. The shared read router remains **unmounted** and individual vendor readers/feature routes have NOT been migrated; this is not a production security cutover.

**CI verified:** [GitHub Actions 43041661174](https://github.com/Tawgod/Lightspeed/actions/runs/43041661174) SUCCESS at code commit `39ae126e91554bc051b079fc7b2f90d93e4007fc`: syntax, 25-operation workstation/TOTP/passkey permission policy tests and original secured Lightspeed permission + denied HTTP read-admission tests all passed. No database migration, feature-route integration, real mobile/Chrome session or Lightspeed tenant call was tested. PR remains draft and source integration must continue.

## Next actionable milestone

**Integrate and test the shared staff access middleware against the actual Core Operations and Scanner backend, then connect Admin/Owner staging on top of a reconciled candidate.** The user has approved pursuing a unified rollout across tools, but no all-tools production deploy is known safe today. Keep previously staged Timeclock-only patch uncommitted while the full-tool release is reconciled.

## Manager handoff

**System:** shared staff/Owner security integration across Hobby Corner tools.  
**What changed:** source/runtime audit and coordinated cross-tool rollout order; no application source or production configuration applied in this checkpoint.  
**Repo/branch:** `Tawgod/Hobby-Corner:main` (this file), implementation distributed across `Tawgod/Lightspeed` draft PRs.  
**Tests:** previously passing isolated PR workflows verified; combined end-to-end tests NOT run.  
**Deployment:** none. Production Timeclock-only source patch remains staged, not deployed.  
**Priority blocker:** large diverged shared security branches and missing live route/extension integration.  
**Next action:** Codespaces integration rehearsal preserving the production baseline and all user workflows; then separate approval for migration and deployment.
