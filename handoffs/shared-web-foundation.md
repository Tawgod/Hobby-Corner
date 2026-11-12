# Shared Web Foundation — Current Handoff

**Last verified:** 2026-11-12  
**Status:** Testing — isolated Railway staging deployed and HTTPS/Chromium accepted; NOT production-deployed
## Dedicated Railway staging: deployed and read-only acceptance PASS — 2026-11-12

**System and feature:** Hobby Corner shared security/web foundation PR #63 — staging-only deployment and nonproduction HTTP/browser smoke. **Status:** **Testing**, app and fresh DB deployed **only in isolated staging**; five-group HTTPS and real Chromium browser tests passed; NOT production deployed.

- **Railway project/env:** New `HC PR63 Isolated Staging` `5b46096d-3178-47ec-ba88-d5037696346a`, environment `staging` `46b93c76-3085-4e76-a37d-90dfdd250dd2`. This project was created to avoid the **15 unrelated staged changes** already present in existing `Hobby Corner Integration Test/test`.
- **Database:** New Railway PostgreSQL 18 service `Postgres` `257803e5-7352-4113-a4be-f4f6edaddd22` and private 5GB volume, deployed SUCCESS; clean independent schema with no real customer/supplier data. App-only `DATABASE_URL` is a reference to **that project's** Postgres service.
- **Application:** `hc-foundation-pr63` `10540df5-8fab-497b-bd2c-80d4f7f0c702`, source `Tawgod/Lightspeed:feature/shared-foundation-security-web-20261112` **pinned** to the code verified in disposable PostgreSQL, `90e91c9b4d6cd07df1dff3de79100073bb819a72`. Deployment `dcb96ace-fbeb-4eb0-928d-253659b16c64` **SUCCESS**. Startup logs confirmed `database schema ready`, database initialization `true`, port 8080. Railway reports both database/app online, zero alerts and no pending changes.
- **Preview URL:** `https://hc-foundation-pr63-staging.up.railway.app/HobbyCorner/store-operations` (Railway staging only). The **public Timcorp Projects /HobbyCorner route remains unconnected** and unchanged.
- **Safe configuration:** `HC_PUBLIC_BASE_PATH=/HobbyCorner`, `HC_PUBLIC_LANDING_PATH=/store-operations`, `NODE_ENV=staging`; live vendor mode, migration, product writes, Scanner, Admin-nav, scanner test creation all explicitly `false`. **No real Lightspeed, Discord, Timeclock or employee/Owner credentials/grants were supplied.**
- **HTTPS and browser verification:** [GitHub Actions run 43280979877](https://github.com/Tawgod/Lightspeed/actions/runs/43280979877) **SUCCESS**: five HTTP test groups passed including both root/prefix health routes, 302 internal root redirect, five web pages, same-origin CSS/modules, 401 anonymous business reads, 404 disabled Admin/staff-auth and unknown paths. Live Chromium PASS on deployed dashboard and Special Orders with correct grouped links, signed-out state, missing-asset detection and no script errors. No PIN/vendor writes sent. All five other PR CI workflows passed on test-script head `8e3a6c3`.
- **Production read-back:** `special-orders-test` still deployed at `014a7a9...` from `integration/hobby-corner-consolidation`, gateway remained on `Tawgod/timcorp-projects-foundation:main`; no production deploy, DNS, gateway route, staff identity, Chrome extension or vendor mutation. The PR stays **draft**. New source commits are docs/test-only; Railway remains pinned to `90e91c9`.
- **Remaining gate:** Do **not** interpret synthetic/browser signed-out checks as positive employee authentication. The next separate approval is staging-only trusted test Timeclock/station identities, exact operation grant/strong step-up and guarded-route mount; then an isolated reverse-proxy test of `/HobbyCorner/` before any Timcorp gateway activation. Any production rollout requires new explicit authorization. See `docs/SHARED_FOUNDATION_STAGING_CANDIDATE.md` in PR #63.

---



## Combined foundation: real PostgreSQL acceptance PASS — 2026-11-12

**Current status:** **Testing — automated and disposable PostgreSQL PASS; staging not activated; NOT deployed.** This supersedes the earlier failed detached-Git-fetch attempt still retained below for history.

- **Source:** `Tawgod/Lightspeed:feature/shared-foundation-security-web-20261112`, draft [PR #63](https://github.com/Tawgod/Lightspeed/pull/63). The exact tested code was **`90e91c9b4d6cd07df1dff3de79100073bb819a72`**. Later `2d418058...` is documentation-only (acceptance runbook).
- **Owner-executed command:** clean-tree preflight, `git fetch origin feature/shared-foundation-security-web-20261112`, `git switch --detach FETCH_HEAD`, `bash scripts/run-isolated-security-status-postgres.sh`, and EXIT trap returning to `integration/security-all-tools-20261111` in `/workspaces/Lightspeed-security`.
- **Real disposable PostgreSQL 18:** **13 tests / 13 passed / 0 failed / 0 cancelled / 0 skipped**. Test script explicitly printed **`Verified disposable PostgreSQL container removal.`** The PostgreSQL fixture injected intentional Discord history and GW confirmation exceptions; both corresponding rollback assertions passed.
- **Verified 2026-11-12 GitHub CI on tested commit:** all **five SUCCESS**, scanner `43275029874`, combined source `43275029848`, shared UI `43275029856`, security policy `43275029878`, Core Operations Chromium UI `43275029869`.
- **Git warning:** the detached checkout warned that eleven commits were not connected to local branches on returning to the original branch; they are still preserved on GitHub's feature branch. No local branch work was lost or production source switched.
- **Remaining gate:** Existing project/test Railway environments contain unrelated staged changes; do not blindly apply them. Need an explicitly approved *isolated* nonproduction service/config, independent fixture database and test identities, a safe staging proxy, positive/negative staff sessions, denial/step-up/worker checks, and eventual public gateway approval. Exact rollout checklist is in `docs/SHARED_FOUNDATION_STAGING_CANDIDATE.md` on PR #63. **Core Operations security guard remains unmounted and default-deny.**
- **Decision:** Owner previously confirmed hostname `timcorp-projects.com`. Proposed central path `/HobbyCorner/` is still not connected. Direct Railway URLs stay active. **No merge, staging/production deployment, gateway/DNS/variable change, service credentials, real vendor operations, or Chrome release performed.**

---

## Confirmed Timcorp destination — owner decision, 2026-11-12

**Hostname confirmed:** `https://timcorp-projects.com`. This supersedes the previously requested `timcorp-productions.com`; do not treat that other domain as an alias. The connected central gateway's established Hobby Corner reservation is `/HobbyCorner/` (currently HTTP 503/not connected), so the **working** proposed employee path is `https://timcorp-projects.com/HobbyCorner/store-operations`. The owner confirmed the hostname, not a production route activation. Route casing and the gateway upstream mapping must still be accepted through the central integration review.

**Proposed staging-only variables after explicit authorization:** `HC_PUBLIC_BASE_PATH=/HobbyCorner` and `HC_PUBLIC_LANDING_PATH=/store-operations`. Subroutes for Store Map and Labels would need longest-prefix routing under `/HobbyCorner/` and their own service tests. Current direct Railway URLs remain unchanged. **No DNS, Railway configuration, public gateway route, or production deployment was changed.**

**Codespaces test instruction correction:** The remote `git fetch origin feature/shared-foundation-security-web-20261112` succeeds but this particular Codespace does not create `origin/feature/shared-foundation-security-web-20261112` (only `FETCH_HEAD`). The owner's test stopped at `git switch --detach origin/...` with `fatal: invalid reference`. No combined-branch PostgreSQL test ran on that attempt. Use `git switch --detach FETCH_HEAD` after fetch, run the disposable DB launcher, and return to the original branch via an EXIT trap. Combined real-DB acceptance and container cleanup still pending until output is supplied.

---

## Verified cross-tool Railway deployment inventory — 2026-11-12 (read-only)

These are actual **deployed** versions, not latest branch heads; all inspected services were left untouched.

| Tool/service | Railway project/env | Running deployment source | Proposed foundation route | Readiness |
| --- | --- | --- | --- | --- |
| Store Operations/Special Orders/Ordering/Preorders/GW | `Hobby Corner/production`, `special-orders-test` | `Tawgod/Lightspeed:integration/hobby-corner-consolidation@014a7a9`, deployed Nov 4 | Working reserved path `/HobbyCorner/*` (inactive) | Combined PR #63 **CI PASS**, not deployed |
| Labels/Toolkit API | `Hobby Corner/production`, `lightspeed-api` | Same `integration/hobby-corner-consolidation@014a7a9`, deployed Nov 4 | Proposed `/HobbyCorner/labels/*` (inactive) | Existing Timcorp basepath branch prepared, real deployment/proxy acceptance pending |
| Store Map | `Hobby Corner/production`, `store-map` | `store-map-production@c7e76b8`, deployed Nov 4 | Proposed `/HobbyCorner/store-map/*` (inactive) | Separate `feature/timcorp-base-path-store-map-20261111` branch prepared; not deployed |
| Timeclock | `Hobby Corner/production`, `timeclock` | Last **actual deployment** `integration/hobby-corner-consolidation@014a7a9` on Nov 4; Railway service source setting has a newer `feature/owner-timeclock-scoped-credential-20261110` pin | No public Timeclock gateway route in phase 1; backend-to-backend continues | **Source setting differs from deployed commit**; do not assume new scoped credential code is live |
| Discord bot | `Hobby Corner/production`, `Hobby-Corner-Discord-Bot` | `Tawgod/Hobby-Corner-Discord-Bot:main@7c3af0e`, deployed Oct 27 | Not a public web route | Current bot lacks historical Special Orders delivery/GW endpoints; no machine grant based on legacy variables |
| Consignment beta | `Hobby Corner Integration Test/test`, `consignment-beta` | `feature/consignment-layout-foundation`, deployed Oct 27 | Remains external Store Tools link | Separate service, not verified for Timcorp prefix; do not silently route |
| Admin navigation bridge | `Hobby Corner Integration Test/test`, `admin-nav-bridge-test` | `staged-create`, **no deployment** | Not a standalone public gateway destination | Stage-only patch awaiting approval, synthetic read-only grant not equivalent to live Owner |

**Staging caution:** The Railway Hobby Corner production environment also has a staged patch; a staged configuration does not establish deployment. Do not accept/apply staged changes wholesale because they may belong to other development channels. Chrome Toolkit/Scanner source requires release-queue coordination before any version/package/distribution changes.

**Route precedence proposal:** The two separately hosted longest prefixes (Store Map, Labels) must win before the Store Operations catch-all. The current central gateway `/HobbyCorner/` fallback is planned/503; neither these routes nor the requested `/hobby-corner/` aliases are live integrations. No new central routing was configured.

---

## Latest combined foundation milestone — 2026-11-12

**System / feature:** Shared Store Operations web foundation + default-deny employee/service security. **Status:** Testing (automated CI PASS); not staged, not deployed, not released.

- **Authoritative combined review candidate:** `Tawgod/Lightspeed:feature/shared-foundation-security-web-20261112`, [draft PR #63](https://github.com/Tawgod/Lightspeed/pull/63) against `integration/security-all-tools-20261111` (security draft PR #61). Tested head `63f13787ed4451b20bddd304f595d2af6fdaff56`.
- **Source components preserved:** nav/Timcorp [draft PR #62](https://github.com/Tawgod/Lightspeed/pull/62) (based on navigation PR #35) and security PR #61. No parent source branch was overwritten or merged.
- **Implementation:** Ported shared UI/dashboard, six prefixed HTML routes, API/Timeclock/permission-aware navigation, Order Split, Admin read-only helper and tests onto the security source without replacing guarded Special Orders status, verified audit actor, Discord delivery lease, GW reaction or GW submission SQL atomicity. Added the count-only `GET /priority-review` to actual Special Orders router, registered it as **pending** `special-orders.read` in the now 88-entry route inventory and tracked the new browser call. Security middleware remains **unmounted**, employee/machine grants unchanged.
- **Automated CI PASS on latest combined head:** [security policy 43256005235](https://github.com/Tawgod/Lightspeed/actions/runs/43256005235), [combined source contract 43256005415](https://github.com/Tawgod/Lightspeed/actions/runs/43256005415), [Core Operations Chromium/browser 43256005508](https://github.com/Tawgod/Lightspeed/actions/runs/43256005508), [Shared UI reconciliation 43256005397](https://github.com/Tawgod/Lightspeed/actions/runs/43256005397), [Scanner regression 43256005287](https://github.com/Tawgod/Lightspeed/actions/runs/43256005287). One initial test-only omission (the Admin navigation read-only SQL review file) was corrected by `63f13787...`; all five runs on corrected head **SUCCESS**.
- **Prior real PostgreSQL acceptance:** 13/13 passing on security branch for guarded statuses, notification atomicity/lease and GW operations. The combined branch has not been rerun against disposable PostgreSQL; source test green does not substitute for that acceptance.
- **Central route discrepancy:** requested `timcorp-productions.com/hobby-corner` vs current central `Tawgod/timcorp-projects-foundation` documented `timcorp-projects.com/HobbyCorner` (gateway currently 503 for Hobby Corner). Base-path code supports both variants, but real route/domain needs user/gateway-owner reconciliation. No DNS, gateway, environment variables or domain attachment was changed by this work.
- **Next:** One disposable Codespaces PostgreSQL regression run on combined branch, non-production prefixed HTTP/Playwright + employee denial/permission acceptance, exact staging authorization and service caller commissioning. No production deploy or Chrome release until explicit approval.

---


## Source

- Repository: `Tawgod/Lightspeed`
- Authoritative web-only composition branch: `feature/timcorp-unified-nav-integration-20261112` (superseded as staging integration by combined PR #63)
- Web-only draft PR: [#62](https://github.com/Tawgod/Lightspeed/pull/62), stacked against `feature/unified-hierarchical-navigation-20261109` (PR #35).
- Web-only tested commit: `de61f882ca8591253dc37dfa3c92c032b4bd372b`; combined candidate is described above
- Other coordinated branches: `feature/timcorp-base-path-hobby-corner-20261111` (existing base-path source), `feature/timcorp-base-path-store-map-20261111`, `integration/security-all-tools-20261111` (draft PR #61), `feature/unified-hierarchical-navigation-20261109` (PR #35).
- No merge or production deployment.

## Implemented

- Composed already-developed hierarchical Store Operations shell and Timcorp base-path support, rather than creating duplicate systems.
- Preserves Home dashboard / Priority Review, Special Orders > Preorders > GW Preorders, Purchasing/Ordering nested under Special Orders, Store Tools and conditional same-origin `admin.read` link.
- Validated optional `HC_PUBLIC_BASE_PATH` middleware accepts prefixed and existing root URLs, and optional `HC_PUBLIC_LANDING_PATH` redirects the prefixed root.
- Six public HTML entrypoints inject a validated base href; static links/assets, four Store Operations browser clients, shared signed PIN session endpoints, Admin read check, dashboard API fetches and Order Split harness resolve under that base.
- Existing Railway root URLs and separate deployment remain supported; external Consignment / Toolkit links remain on their independent origins pending their gateway work.
- Browser `about:blank` test documents use safe root URL fallback rather than crashing; VM-based legacy session tests still work.
- No new machine identity, employee grant, Owner account or authentication bypass is created.

## Tested

- **Automated:** All six PR #62 commit `de61f882...` GitHub workflows SUCCESS on November 12: Timcorp and unified navigation integration smoke `43253361828`, Unified hierarchical navigation `43253361992`, Shared UI reconciliation `43253361964`, Scanner integration regression `43253361785`, Core Operations UI navigation including Chromium keyboard/layout, dashboard/login/sign-out browser smoke `43253361791`, and Navigation Admin permission contract `43253361824`.
- Standalone Timcorp basepath and Store Map branches were also tested previously; these are separate and are not claims of merged/runtime deployment.
- **Browser / employee acceptance:** Synthetic Playwright smoke passed; real signed employee/station/passkey/permission testing under a gateway and real database is outstanding.
- **Runtime / deployment verification:** No composed branch deployment; no end-to-end same-origin reverse-proxy test. Railway existing source was only inspected read-only.

## Deployed

- Environment: None for PR #62.
- Service / version: No change.
- Deployment reference: None.
- Production status: Existing Railway services unchanged.

## Shared dependencies

- Navigation PR #35's independent Admin navigation read-only grant DB, Timeclock signed employee session and staged-not-deployed Admin read-only bridge.
- Security PR #61 default-deny guard remains **unmounted**; real employee/workstation and service grants not commissioned.
- Chrome extension release queue remains authoritative; no extension package/version or publish action made.
- Store Map and labels are separate Railway services; their own path changes must be tested before the gateway routes them.

## Important central gateway discrepancy

- User-requested destination in project instructions: `https://timcorp-productions.com`.
- Current connected GitHub central gateway source: `Tawgod/timcorp-projects-foundation:main` documents `https://timcorp-projects.com` and `/HobbyCorner/` as **planned**, currently **503/not connected**. Railway `Timcorp Productions Homepage` project currently has the gateway service `timcorp-gateway-git-preview` sourced from that repo; `timcorp-projects.com` is its attached custom domain (verify current DNS/TLS separately).
- Our earlier Lightspeed Timcorp proposal planned `/hobby-corner`. The application base path is configurable and can support the central `/HobbyCorner` contract without source changes, but the proposed URL/host/path **must be reconciled by the central gateway owner before settings or routing are changed**.
- We have not changed central DNS, route registry or gateway deployment. Do not claim `/hobby-corner` or `/HobbyCorner` is publicly routed.

## Shared files / integration surfaces

- `server.js`, `services/publicBasePath.js`, `routes/orderSplit.js`, six HTML entrypoints, four browser clients, `shared-ui/staff-auth.js`, `shared-ui/operations-nav.mjs`, `shared-ui/store-operations.mjs`, and focused tests.
- Integration docs: `Tawgod/Lightspeed:feature/timcorp-unified-nav-integration-20261112/docs/SHARED_WEB_FOUNDATION_COMPOSITION.md`.
- Security handoff: `Tawgod/Hobby-Corner:main/handoffs/employee-admin-security.md`.

## Remaining blockers

1. Agree final central host/prefix: `timcorp-productions.com/hobby-corner` vs current gateway `timcorp-projects.com/HobbyCorner`.
2. Reconcile composition PR #62 with navigation PR #35 and security PR #61 without blindly replacing shared `server.js`, clients or staff-auth.
3. Verify full browser/API/auth/redirect/asset sessions through a **non-production gateway**, including denied Admin and worker routes and independent Railway URL compatibility.
4. Commission independent verified employee/service identities and exact grants in an isolated staging environment before opting into Core Operations guard. Real Owner ceremony is separate.
5. Independently test Store Map and labels paths and Chrome extension compatibility; do not bundle a Chrome release with web migration.
6. Approve staging configuration/deployment explicitly. Do not alter existing Railway production service or central DNS during preliminary testing.

## Decisions needed

- Confirm central hostname and route spelling after gateway source-of-truth reconciliation; retain both as pending, do not infer.
- Owner approval for isolated staging deployment and test identities/configuration once the composition/security review has finished. No production approval requested at this stage.

## Recommended next action

- Keep PR #62 draft while preparing isolated staging deployment and the security guard mount plan, then request explicit approval for staging-only work and credentials.
- Use a Codespaces local proxy or disposable test service to verify prefix and root login/API behavior before production change.

## Restrictions / safety

No production deployment, merge, central DNS/gateway configuration, service credential, employee grant, DB migration, Lightspeed mutation, Discord message, or Chrome extension release occurred.

## Documentation

- `docs/SHARED_WEB_FOUNDATION_COMPOSITION.md` on PR #62.
- `docs/TIMCORP_WEB_FOUNDATION.md` on earlier base-path branch.
- `handoffs/employee-admin-security.md` for security verification and remaining staging gates.
