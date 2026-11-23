## November 23 user-authorized safe-moves audit — no cross-project runtime cutover

**User request:** “move anything that is safe to move.” Reverified current sources and documented Railway migration support. No further live service was safe to move automatically without changing source guards, migrating private databases, handling secrets or impacting security boundaries; **no new service, duplicate, deploy, secrets, domain, public route, production workload or database was created, moved or deleted in this phase.** The two approved one-shot services were already retired in the immediately preceding phase.

**Source-grounded blockers and decisions:**

1. `HC Employee Read Pilot/test` app `hc-employee-pilot` at deployed `Tawgod/Lightspeed@f023bad90f269d8c40b50cb9451c881080433182`, file `staging/employee-read-pilot-server.js`: fail-closed `HC_PILOT_PROJECT_ID===c528d08e-b835-4b72-95f2-8a05090a2195`; `NODE_ENV=test`; private `HC_PILOT_DB_HOST` hostname; exact `HC_PILOT_DB_NAME=railway`; exact HTTPS origin; SIX independent high-entropy credentials plus synthetic test PIN hash; two restricted DB accounts (`hc_pilot_auth_runtime` and `hc_pilot_grants_reader`) with startup role/privilege assertions. **Not portable by copying the service**, and must not attach to either existing central test database. Before moving, prepare a small fail-closed source change for new exact project ID and new HTTPS host, initialize a separate synthetic-only DB + restricted principals, test no real business/Owner credentials, maintain old endpoint until smoke/browser/regression passed. Or archive the completed synthetic milestone and separately approve retiring its app and volume.
2. `HC PR63 Isolated Staging/staging` `hc-foundation-pr63` source `Tawgod/Lightspeed@50fda74b`, `server.js` calls `initializeSpecialOrdersDb()` during startup; `coreOperationsStagingActivation.js` validates exact staging env, `DATABASE_URL`, `/HobbyCorner` base-path and a bank of explicit anti-production kill-switches. **Do not point it at either occupied central test DB**, which could introduce/alter tables; separate DB, migrations/data audit and safe tests required to move.
3. `hc-owner-staging` + `Postgres-x8Ui`: **do not move**; registered real Owner passkey/TOTP origin/RPID/session factors, audit records and restrictive security credentials are sensitive and active. Keep as isolated staging until explicit security-specific migration plan and browser/domain acceptance.
4. `Hobby Corner Codespaces Bridge`: source under `Tawgod/Hobby-Corner/codespaces-integration` and separate persisted audit volume; logs reported standby (no tunnel, GitHub access or commands). Not an application test; don't copy/erase audit volume into synthetic test project.
5. `Hobby Corner Integration Test/test` already hosts `staff-security-staging` and `consignment-beta`; no move needed. `admin-nav-bridge-test` still **staged-create** (15 pending changes); don't accept/deploy or discard without navigation workstream coordination.
6. Old `HC Owner Security Staging` has **no live services**, but one unprovisioned staged-only volume; connector cannot delete an unprovisioned volume, leave unchanged for Railway UI patch discard.

**Platform constraint:** As documented in Railway Central Station by Railway staff, cross-project service relocation is manual recreation/configuration/data migration (https://station.railway.com/questions/how-to-move-a-service-from-one-project-t-958291f3). Services cannot be magically dragged into `Hobby Corner Integration Test/test` preserving IDs, volumes and private DNS. Railway's environment isolation and private-networking scopes also matter.

**Next substantive safe action:** Choose between (A) retired synthetic pilot with preserved test evidence (no recreation cost), or (B) source fix + safe parallel reconstruction in central test with its own isolated database and exact scoped secrets, followed by browser tests and later cutover. This choice affects running costs, user test workflows and retention; do not make it implicitly. The static PR63 foundation can be moved in a later isolated test DB migration; Owner must remain separate. Existing production 7 services and primary staging unchanged.

---

## November 23 follow-up — explicit retirement approved and verified

**User approval:** “retire the one time services. if possible can we put all the testing productions for hobby corner into one environment rather than so many separate ones?”

### Actual scoped deletions (complete)

1. **`migration-test-bsi117`** service `826e3b1a-c3b2-4572-b9ba-ea62d362e1a3` permanently deleted from `Hobby Corner/production` `f7e91de7-43f6-472e-b4ca-46b0623f8e0e/c562fbb2-8431-4beb-834d-6938b3a2ad10`. Before deletion: zero running replicas, no domains, no attached volumes, successful historical one-time verifier. `delete_service` responded with exact name/ID and `detachedVolumes:[]`.
2. **`admin-grants-schema-once`** service `b0c1f060-4f33-4073-bf2b-103cd479afb4` permanently deleted from `Hobby Corner Integration Test/test` `c4586f88-0a5e-4582-8e0f-3861d851567b/24b41ef2-e3d8-4c7a-b011-355204ecf075`. Before deletion: zero running replicas, no domains, no attached volumes, historical smoke job passed. `delete_service` responded with exact name/ID and `detachedVolumes:[]`.
3. **Readback:** production now has **7 live services** `timeclock`, `Hobby-Corner-Discord-Bot`, `Hobby-Corner-Rewards`, `lightspeed-api`, `special-orders-test`, `store-map`, `Postgres`; all SUCCESS, primary workloads each one running replica, production volume untouched, zero staged changes. Integration Test now has `staff-security-staging`, `consignment-beta`, `Postgres`, `Postgres-O39p` live, with `admin-nav-bridge-test` still staged-create (15 pending changes) and its two existing Postgres volumes untouched. PR63 Owner environment still 4 live/healthy services with two separate database volumes. No other service/database/domain changed.

### Proposed destination architecture (NOT YET MIGRATED)

**Central testing destination:** Reuse existing `Hobby Corner Integration Test` Railway project (project ID above) and its current `test` environment. Don't create a third new project or clone `Hobby Corner/production` wholesale because environment duplication would copy service configurations/variables, risking production credentials/accidental writes.

| Existing test resource | Migration recommendation | Data / cutover gate |
| --- | --- | --- |
| `staff-security-staging`, `consignment-beta` | Already in target test environment | Keep until consolidation/feature review. Consignment beta currently logs scheduled database-missing errors |
| `hc-employee-pilot` + distinct pilot `Postgres`, `HC Employee Read Pilot/test` | Migrate/recreate test app under central test project only if still needed. Otherwise archive the tested synthetic pilot and retire it | Confirm API test coverage, persisted data and audit retention; never point synthetic pilot at Owner database |
| `hc-foundation-pr63` + foundational `Postgres`, `HC PR63 Isolated Staging/staging` | Later recreate into central test environment after shared gateway/38 grant integration acceptance | Preserve separate least-privilege DB and PR63 staging until replacement health/permissions/domains validated |
| `hc-owner-staging` + `Postgres-x8Ui` | **EXCEPTION: keep isolated** while actual Owner WebAuthn/TOTP records and recovery audits are in use. Could eventually move under a second **`owner-security` environment in the same central test project** (single project, distinct environment isolation) with explicit secrets/DB migration and Owner browser/passkey revalidation. Do not put canonical real Owner credentials in the shared synthetic test environment | WebAuthn RP ID + HTTPS origin/domain continuity, exact signed session secrets, KMS/encryption key custody, DB audit integrity, backup & restore verification, staged permissions, full strong-auth acceptance. No reinitialization or data loss. |
| `admin-nav-bridge-test` (staged-create) | Reconcile existing 15-change test patch with unified-navigation owners; only deploy or discard after decision | Do not accidentally apply pending branch/DB changes |
| `Hobby Corner Codespaces Bridge/development` | Development infrastructure, **not a retail test app**; keep separate or retire if permanently standby. Another same-repo standby bridge exists in Malcor with separate audit volume | Preserve audit data and ownership; never delete Malcor service without Malcor decision |
| Old `HC Owner Security Staging/test` | Service definitions already removed, only 2 staged changes for unprovisioned volume remain | Railway refused volume removal because it never existed live; discard pending patch via dashboard, never deploy it |

**Why not one literal environment for everything?** Railway environments isolate deployments, variables and private networking, but *multiple services in the same environment share that private-network boundary*. Production and real Owner Security must remain separated from fake employee accounts, insecure development fallbacks, or experimental APIs. Consolidate the projects/UI in one **central testing project**, with ordinary synthetic/integration tests in `test` and eventually real Owner Security in a **separate security environment**, if and only if a properly validated migration is requested. In a single shared `test` environment, distinct Postgres services and DB roles still help but do not replace environment-level isolation.

**Railway capabilities verified:** Current connected tools support creating new services, setting sources/config, and environment reads; they do **not** expose a one-step cross-project move preserving service IDs, existing volumes, domain names, private DNS or sealed credentials. Actual consolidation is a parallel-recreate/configure/test/cutover/retire sequence. Current automation must not silently rotate or expose secrets; do not change active domains or databases just to reduce project count.

**Migration sequence when authorized:** (1) map current dependencies and protected database contents for exact target service, including sealed secrets; (2) resolve staged navigation patch; (3) stage a new replacement service with exact repo commit and distinct test-only variables/DB; (4) test HTTP, CSRF, WebAuthn/passkeys where applicable, service-to-service DNS, permissions and real browser flow; (5) preserve old endpoint while replacement is tested; (6) separately approve traffic cutover; (7) separately approve deleting obsolete app and persistent storage. **No cross-project live app migration, DNS change, production deployment, or DB move performed yet.**

---

# Railway Consolidation — Current Handoff

**Last verified:** 2026-11-23
**Status:** Maintenance (inventory and partial cleanup); production consolidation Planned

## Source

- Railway workspace: tawgod's Projects (live connector readback, 2026-11-23).
- Master project: `Hobby Corner` `f7e91de7-43f6-472e-b4ca-46b0623f8e0e`, `production` `c562fbb2-8431-4beb-834d-6938b3a2ad10`.
- Primary repo: `Tawgod/Lightspeed` (several explicit deployed branches, not necessarily merged); `Tawgod/Hobby-Corner-Discord-Bot:main`; `Tawgod/Hobby-Corner:main`.
- Reference: `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`. Active Owner-security handoff: `handoffs/owner-login.md`.
- This inventory is based on actual Railway service/domain/deployment data, not just plans in GitHub.

## Implemented — inventory and partial cleanup

**Before cleanup:** six explicitly Hobby Corner-named Railway projects, **23 service definitions (including 3 never-deployed staged creations)**, alongside the independent Timcorp foundation. Other projects (including Malcor and AI Integration Gateway) were inspected for cross-project overlap; they are not assumed to be Hobby Corner property.

### Keep as authoritative production — `Hobby Corner/production`

| Service | Source / role | Decision |
| --- | --- | --- |
| `timeclock` | `Tawgod/Lightspeed:feature/owner-timeclock-scoped-credential-20261110`; canonical Timeclock authentication | **KEEP**, active and consumed by Owner staging |
| `lightspeed-api` | `Tawgod/Lightspeed:integration/hobby-corner-consolidation`; Lightspeed integration | **KEEP** |
| `special-orders-test` | same consolidated branch; currently deployed public service despite `-test` name | **KEEP**, do not confuse name with disposable test |
| `store-map` | `Tawgod/Lightspeed:store-map-production`, root `store-map` | **KEEP** |
| `Hobby-Corner-Rewards` | `Tawgod/Hobby-Corner-Discord-Bot:main`; Rewards web API | **KEEP** |
| `Hobby-Corner-Discord-Bot` | same repo, separate bot worker | **KEEP**; not a duplicate of Rewards |
| `Postgres` | production persisted DB, 5 GB volume | **PROTECT; never delete or merge without data inventory/migration** |
| `migration-test-bsi117` | one-shot Bun read-only Lightspeed inventory verifier, no domain, zero running replicas; last deployment 2026-10-27 | **CANDIDATE TO RETIRE**, requires named production-service deletion approval; contains production Lightspeed variable names |

Production service status: all service definitions report SUCCESS and 0 recent reported failures; main workloads each 1 running replica, one-shot verifier 0. No staged changes.

### Keep as isolated active Owner and shared-security test — `HC PR63 Isolated Staging/staging`

Project `5b46096d-3178-47ec-ba88-d5037696346a`, environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`:
- `hc-owner-staging`: active real Owner stage; Owner WebAuthn passkey and Authenticator enrollment/server verification independently confirmed from HTTP 200 logs on 2026-11-23. Source `fix/owner-staging-activation-digest-20261123@977f63b`. **KEEP**.
- `Postgres-x8Ui`: dedicated isolated Owner security DB, includes first-Owner activation, immutable recovery audits and protected authentication records. **KEEP STRICTLY ISOLATED**; no reset, deletion or consolidation into production.
- `hc-foundation-pr63`: staged shared foundation test, source `feature/shared-foundation-security-web-20261112` at `50fda74b`. **KEEP** until gateway/permission acceptance.
- `Postgres`: separate staging database for PR63 foundation, different mounted volume than Owner DB. **KEEP** pending data and ownership audit.
- All four live, SUCCESS, no pending patch. Do not mistake two Postgres services as safe duplicates.

### Retain until explicit retirement decision

- `Hobby Corner Integration Test/test`, project `c4586f88-0a5e-4582-8e0f-3861d851567b`: `staff-security-staging` (synthetic employee Authenticator test; older than Owner canonical stage), `consignment-beta` (public beta), independent `Postgres` and `Postgres-O39p` with separate 5 GB volumes, and completed one-shot `admin-grants-schema-once` (0 running replicas). A distinct `admin-nav-bridge-test` is **staged-create, never deployed** with 15 pending changes; its status requires coordination with unified-navigation feature owner before discard.
- `HC Employee Read Pilot/test`, project `c528d08e-b835-4b72-95f2-8a05090a2195`: `hc-employee-pilot` and separate `Postgres`/volume. Synthetic test was successfully browser-tested Nov 12-13; no fresh access observed in available HTTP logs after Nov 13. **Potential retirement only after pilot test evidence and schema recorded**; never merge synthetic identity into canonical Owner database.
- `Hobby Corner Codespaces Bridge/development`, project `84a81c08-5090-4c3f-917c-6ea33ddc0068`: `codespaces-private-bridge` and 256 MB audit volume. Runtime logs say **STANDBY; no tunnel, GitHub access or commands enabled**. Separately, `Malcor/production` contains an identically sourced `codespaces-private-bridge`, also STANDBY with its **own** audit volume. **Potential duplicate**, but cross-project ownership and audit-record retention must be resolved before retiring either. Do not touch Malcor's unrelated bot or database.
- `Timcorp Productions Homepage/production`, project `b33165c4-5ada-4464-934b-75156fdc521c`: `timcorp-homepage`, `timcorp-gateway-git-preview`, `timcorp-proxy-auth-preview` all live. Separate domain/gateway foundation, **keep separate**. Routing Hobby Corner under Timcorp paths does not require physically merging databases or service projects.
- `AI Integration Gateway/test` is an independent candidate-only project with two never-deployed `staged-create` services; scope/ownership unverified, **not changed**.

### Cleanup actually performed this turn

Old `HC Owner Security Staging/test` project `2b350cde-048e-4402-bd92-4e8ba6c9f877`, `db9d6e8c-bb03-441b-a154-80c11536dfbb`, was verified to have **no deployed services**, no domains, no provisioned volume, and an old 55-change pending patch using `feature/owner-staging-scoped-timeclock-adapter-20261110`, superseded by working PR63 Owner staging.

- Removed staged-only `owner-security-staging` service `32566320-229d-4a09-ab3a-9e590c534334`.
- Removed staged-only `Postgres` service `66cbdd3f-39e3-4157-9265-1489523042f0`.
- **Remaining:** staged-create unprovisioned `postgres-volume` `0094a1a8-9490-4fd9-a148-79ead4a02501`, patch now **2 pending changes**, no live resources. Railway API `delete_volume` refused with `Volume postgres-volume is not provisioned in environment test`; no DB was deployed or created to work around this. Remaining cleanup needs Railway dashboard patch discard / project removal or a supported API capability. Do not accept-deploy the patch.
- Readback confirms main `Hobby Corner/production` unchanged (8 live services, zero staged changes), PR63 Owner staging unchanged (4 live services, zero staged changes, two separate mounted DB volumes).
- No other service, deployment, domain, production database, provisioned volume, environment secret or central gateway was changed.

## Tested / observed

- Actual Railway project list, six Hobby Corner project inventories and service source/domain configs, active environment status, staged change diff, and candidate service logs checked.
- Old Owner staging services absent after deletion; old volume is still only `staged-create`, not provisioned.
- `migration-test-bsi117` one-shot reports 0 replicas and no domain; `admin-grants-schema-once` likewise 0 replicas and no domain.
- `consignment-beta` logs contain repeated `scheduled product reconciliation failed` with `Special-order database is not configured yet` (2026-11-23). Do not infer the test app is healthy merely from Railway SUCCESS deployment.
- Historical staging security test and employee read pilot still have public endpoints; no recent usage in retrieved HTTP records is **not** proof of zero consumers.

## Deployed

- No code deployment, data migration, production service deletion, DNS, authentication or Chrome extension change.
- Only old never-deployed staged Owner Security service definitions were discarded.

## Shared dependencies / surfaces

- Owner staging Timeclock identity is backed by canonical `Hobby Corner/production/timeclock`.
- The production `Hobby-Corner-Discord-Bot` exposes service URL variable references to Special Orders, Timeclock and customer sync, hence all backend service URLs must be preserved during consolidation.
- PR63 Owner DB and foundation DB are intentionally distinct.
- Different sources/branches in live production need an explicit merge/release plan before replacing any deployment.
- Shared Timcorp gateway/public routing remains independently managed.

## Remaining blockers

- Connector does not currently remove the unprovisioned old staging volume placeholder; needs dashboard discard, not deployment.
- Validate old pilot, old staff-security-staging and consignment beta owners and whether active users or automation still rely on their URLs.
- Inspect row counts / database ownership / secret consumers before considering either test DB consolidation.
- Verify whether Malcor's standby bridge or the standalone HC bridge owns any retained audit data; do not erase either volume without retention approval.
- The `admin-nav-bridge-test` 15-change patch may contain unreleased unified navigation work; do not discard without that feature owner's reconciliation.
- Confirm a named list of deletions before any *live* service/volume deletion, especially production.

## Decisions needed

1. Approve permanent retirement of exact dormant `migration-test-bsi117` service in `Hobby Corner/production` (currently 0 replicas/no domain), if last-read-only-verification artifact can be archived.
2. Approve retirement of exact `admin-grants-schema-once` service in Integration Test (0 replicas); keep `Postgres-O39p` until all schema dependencies verified.
3. Decide whether to retire/keep synthetic Employee Read Pilot and older staff-security-staging pending employee/security acceptance.
4. Decide whether both Codespaces bridge instances are still needed; prefer one audited enabled bridge if ever commissioned, not two standby copies.
5. Decide whether to discard unprovisioned old Owner Security staging patch/project from Railway dashboard (no running service/data).

## Recommended next action

- Dispose of the 2-change old Owner project patch through the dashboard without provisioning its volume, then remove the empty project if desired.
- Reconcile unified-navigation pending test work and validate backend consumers. Obtain **specific service-level approval** before removing live resources.
- Keep production and Owner staging separate; clean up one-shot services and old synthetic pilots first, **not** by moving or dropping live DBs.

## Restrictions / safety

- Never delete production `Postgres`, either PR63 DB, provisioned test volumes or the Malcor audit volume without verified retention and exact scoped approval.
- Never deploy a stale staging patch, reset Owner credentials, or mix real staff/Owner data into synthetic test DBs.
- Avoid printing Railway variable values; record only names and references.
- No Chrome extension release/package action under this cleanup.
