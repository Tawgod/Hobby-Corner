## Nov 23 second recovery approved for development/testing ONLY — draft PR #76

**User approval scope:** User answered 'approved' to *preparing and testing* a second, tightly controlled isolated Owner staging recovery. This is NOT authorization to apply migrations, issue any replacement activation, deploy, merge PRs, modify production, or alter recovery audit records.

**Verified starting facts:** Owner staging digest hotfix deployed at commit 977f63b267f226a29b731541386d492bb537c312 / Railway deploy b3951f2f-77df-43f7-aa94-8c3fc9708ad3 SUCCESS. Last restricted read-only staging SQL: HC_OWNER_ACTIVATION_STATE=EXPIRED_UNUSED, HC_OWNER_RECOVERY_RECORDS=1, HC_OWNER_REGISTERED_OWNERS=0, READ_ONLY=true.

**Development changes prepared (NOT run/applied to live DB):** Git branch Tawgod/Lightspeed:feature/owner-stage-second-recovery-20261123 based on earlier recovery feature branch. Draft PR https://github.com/Tawgod/Lightspeed/pull/76 (unmerged). New db/hc_owner_stage_second_failed_enrollment_recovery.sql: exact isolated DB/role guards; separate append-only single-row second recovery audit linking existing immutable first reissue to current expired untouched activation; no Owner/passkey/activation event; exactly employee 1; advisory lock, narrow non-login definer, operator-only EXECUTE, no runtime privilege; 10-minute DB-controlled expiry. Private scripts/issue-owner-stage-activation.mjs adds explicit --second-recover-expired-staging-owner requiring I_REVIEWED_SECOND_FAILED_ENROLLMENT_RECOVERY and exact canonical Timeclock employee verification. tests/owner-expired-activation-recovery.test.mjs now covers positive path, negative paths and privilege, audit, replay and rollback in disposable PG18. New scripts/test-owner-second-recovery-disposable.sh invokes existing isolated docker test runner and outputs HC_OWNER_SECOND_RECOVERY_DISPOSABLE_TESTS_PASSED=true.

**TESTING STATUS: PENDING actual Codespaces execution.** No local/remote PostgreSQL test engine accessible to chat. Next Codespaces command should use a separate worktree (no disruption to existing project branch):
```bash
cd /workspaces/Lightspeed-owner-migration
git fetch origin feature/owner-stage-second-recovery-20261123
git worktree add --detach /workspaces/Lightspeed-owner-second-recovery origin/feature/owner-stage-second-recovery-20261123
cd /workspaces/Lightspeed-owner-second-recovery
npm install --ignore-scripts --no-audit --no-fund
bash scripts/test-owner-second-recovery-disposable.sh
```
Do not set HC_TEST_DATABASE_URL to Railway; disposable runner handles fresh PG18 localhost. If all pass, gather exact output. If tests fail, fix on new branch without touching real database.

**Next after tests:** review separate operator-only migration execution script and fresh backup/restore before any request to approve staging SQL, then stage-only readback. The code-only draft PR is not the deployed app source. No activation may be issued without its own explicit approval and device readiness. Never rewrite original first-reissue audit or alter token expiry by hand.

**Status:** second-recovery proposal In Development; not yet tested or deployed, migration not applied, token not issued.

---

## Nov 23 Owner staging recovery exhausted: EXPIRED_UNUSED, one reissue, zero owners

**Fresh read-only operator output after deployed digest hotfix:**
```
HC_OWNER_ACTIVATION_STATE=EXPIRED_UNUSED
HC_OWNER_RECOVERY_RECORDS=1
HC_OWNER_REGISTERED_OWNERS=0
READ_ONLY=true
```
**Interpretation:** Existing single-use 10-minute recovery has expired **without first Owner appointment**. One immutable first-Owner reissue audit already exists; current recovery SQL function is intentionally one-time and must not be called again or bypassed. The SHA-256 issuer/verifier mismatch was fixed and deployed only after the recovery had already been issued. Actual browser passkey enrollment and TOTP are not completed.

**Next decision required:** Design a separate, versioned, audited second-recovery procedure for **isolated Owner staging only**. Inspect existing SQL and tests to define strict eligibility (exact employee 1, first reissue recorded, both grants expired and unused, zero Owners, zero passkeys/activation events; canonical Timeclock recheck, restricted operator-only access, short expiry, one extra recovery maximum, independent backup and restore), test disposable PostgreSQL before approval, and seek explicit user approval for any new database migration or issuance. Do not extend token expiry, edit existing reissue audit, weaken origin/PIN/activation checks, or touch production. Full source+Railway deployment readback commit remains 977f63b267f226a29b731541386d492bb537c312, deployment b3951f2f-77df-43f7-aa94-8c3fc9708ad3 SUCCESS.

**Status:** Staging digest fix deployed; first Owner enrollment BLOCKED; recovery exhausted, no Owner. Next action review and approve a new narrowly scoped recovery, not reissue via old script.

---

## Nov 23 Owner staging activation digest hotfix deployed successfully

**Approval and tests:** User explicitly authorized this isolated staging deployment after tests pass, and reported HC_OWNER_DIGEST_HOTFIX_TESTS_PASSED=true from Codespaces disposable PostgreSQL hotfix suite. The two code changes are raw-byte SHA-256 activation verification and updated database regression fixture, plus a disposable test runner, on Tawgod/Lightspeed branch fix/owner-staging-activation-digest-20261123, exact commit 977f63b267f226a29b731541386d492bb537c312.

**Live Railway verification:** Before update, no staged changes. The staged patch contained exactly two source fields (branch and commit) for hc-owner-staging only; no other service, database, environment variable, networking or destructive changes. Patch 8ca3c332-d8e1-4eab-a58a-da01011ccf2f committed via accept_deploy using explicit user staging approval. Railway deployment b3951f2f-77df-43f7-aa94-8c3fc9708ad3 SUCCESS, one replica running, zero crash/warning/critical, settled November 23 2026 15:46:02 UTC. Read-back confirms source commit 977f63b and existing /health healthcheck. Other services hc-foundation-pr63, Postgres-x8Ui and Postgres remained online and untouched; no production changes.

**Outstanding:** Browser passkey/TOTP enrollment and sign-out/re-login have NOT been verified. Prior read-only activation state was ACTIVE_UNUSED, reissues=1, Owners=0, but single 10-minute token may have expired while staging rolled out. One reissue is already recorded: DO NOT rerun recovery issuer, reset/delete audit or approval, or pretend a new code can be issued. Verify current activation state using existing read-only Codespaces script diagnose-owner-stage-activation-state.mjs via restricted operator loopback tunnel and Railway DB variable injection. If expired, design and approve separate audited recovery path. Only request user to use same code if read-only check establishes ACTIVE_UNUSED. Staging URL https://hc-owner-staging-staging.up.railway.app/owner-setup/ .

**Status:** Implementation done; focused disposable tests operator-reported PASS; staging deployment independently verified SUCCESS; live enrollment pending / possible expiry blocker.

---

## Nov 23 Owner digest hotfix deployment approved; disposable test gate

**Explicit user approval:** In response to a request to approve deployment of the narrowly scoped raw-byte activation digest fix **only to isolated Owner staging after tests pass**, the user replied **"Yes deploy."** Approval includes changing only the Owner staging application's source/deployment after successful focused tests. It does **not** include production, gateway, DNS, extension, unrelated Railway services, migration, role edits, database reset, or new recovery issuance.

**Fix:** `Tawgod/Lightspeed:fix/owner-staging-activation-digest-20261123` based on the existing deployed staging source branch. Changed `services/security/operatorFirstOwnerPasskeyCandidate.js` to decode canonical 43-character base64url into 32 bytes before SHA-256, exactly matching `scripts/issue-owner-stage-activation.mjs`. Updated `tests/operator-first-owner-postgres.test.mjs` to model true issuer hashing. Additive `scripts/test-owner-digest-hotfix-disposable.sh` at commit `977f63b267f226a29b731541386d492bb537c312` invokes disposable PostgreSQL 18 (localhost-only), three focused tests, syntax checks and removes test Docker container. **Codespaces focused tests have NOT YET RUN**. Private local Node check of raw token digest compatibility passed 200/200, but does not substitute for integration tests.

**Deployment gate:** User runs in existing remote Codespace:
```bash
cd /workspaces/Lightspeed-owner-migration
git fetch origin fix/owner-staging-activation-digest-20261123
git show origin/fix/owner-staging-activation-digest-20261123:scripts/test-owner-digest-hotfix-disposable.sh > /tmp/test-owner-digest-hotfix-disposable.sh
bash -n /tmp/test-owner-digest-hotfix-disposable.sh
```
**Important:** This runner `cd`s to its own script directory; it must be run from a checkout of the hotfix branch, not via /tmp. Prefer `git worktree add /workspaces/Lightspeed-owner-digest-hotfix origin/fix/owner-staging-activation-digest-20261123`, `cd` there, `npm install --ignore-scripts --no-audit --no-fund` if needed, then `bash scripts/test-owner-digest-hotfix-disposable.sh`. Do not run disposable tests against Railway DB. Require `HC_OWNER_DIGEST_HOTFIX_TESTS_PASSED=true` and all tests PASS **before** staging deploy. Tool connector cannot execute user's Codespace commands, and no environment fork sandbox exists; therefore deployment not yet triggered.

**Post-test approved deploy method:** Read fresh staging environment and ensure no pending changes or source drift. Stage only `hc-owner-staging` `connect_service_source({repo:'Tawgod/Lightspeed',branch:'fix/owner-staging-activation-digest-20261123',commitSha:<tested-exact-SHA>,staged:true,environmentId:'46b93c76-3085-4e76-a37d-90dfdd250dd2'})`, review staged diff for exact service only, then `accept_deploy` after successful gate using existing user approval. Monitor deployment health; do not change database. **Potential incidental deploy of other staged changes is prohibited; check staged inventory before commit.** If user cannot do tests, mark testing/deployment BLOCKED rather than infer pass.

**Activation state warning:** At last read-only DB check, `ACTIVE_UNUSED`, `HC_OWNER_RECOVERY_RECORDS=1`, `HC_OWNER_REGISTERED_OWNERS=0`. That 10-minute window is time sensitive; a code fix deployment does not extend it. Once expired, single recovery policy forbids issuing a replacement without separate reviewed new recovery capability; do not rewrite grants.

---

## Nov 23 activation issued, setup options 403: confirmed issuer/enrollment digest incompatibility

**Operator evidence:** After the interactive owner recovery ceremony, owner reported having the private activation code but browser showed `Setup authorization denied or expired.` Actual staging HTTP logs on Nov 23 15:32 UTC showed successful Timeclock PIN session POST 200 followed by two `/owner-setup/registration/options` POST 403. The owner executed fresh restricted **read-only** SQL state script and reported `HC_OWNER_ACTIVATION_STATE=ACTIVE_UNUSED`, `HC_OWNER_RECOVERY_RECORDS=1`, `HC_OWNER_REGISTERED_OWNERS=0`, `READ_ONLY=true` (at time of check). **Single recovery has now been ISSUED and consumed in the audit**, even though no Owner account/passkey has been created. Do not run a second issuer or alter/delete audit rows.

**Verified root cause in deployed source:** `scripts/issue-owner-stage-activation.mjs` computes SHA-256 over the original 32 **raw random bytes** (`createHash('sha256').update(secret)`) then prints the 43-character base64url representation. Existing deployed `services/security/operatorFirstOwnerPasskeyCandidate.js` computes SHA-256 over the **UTF-8 bytes of the 43-character base64url string** (`createHash('sha256').update(value,'utf8')`), which can never match the stored digest for the correct token. This is an application logic bug and a sufficient explanation for the authorization 403, distinct from Timeclock identity success. Existing PostgreSQL test fixture had wrongly used hashing over text, masking the incompatibility.

**Code-only fix prepared, NOT deployed:** New development branch `Tawgod/Lightspeed:fix/owner-staging-activation-digest-20261123` based on current deployed staging branch `feature/owner-staging-locked-preview-20261112`. Commit `48f3467` fixes verifier to decode the activation's canonical 43-character base64url into 32 raw bytes before hashing, matching issuer; rejects noncanonical encodings. Commit `3a55a80` updates actual disposable PostgreSQL integration test `tests/operator-first-owner-postgres.test.mjs` fixture digest to hash the raw bytes, so this mismatch will be caught. **Tests not yet executed in Codespaces; staging deployed commit unchanged** `60cefaf71d7b737753728f95f8474df17e99912c`. No production/gateway/DNS/extension changes.

**Critical next action:** Tests must run in a disposable environment (do not point any HC_TEST_DATABASE_URL at real Railway). Any staging deployment needs explicit user approval, despite code being prepared. After patch is tested and approved, inspect fresh database authorization state privately; if the 10-minute issued grant expires before the safe staging deployment, the originally approved **single reissue cannot be repeated**, and a separately reviewed audited owner recovery mechanism will be needed. Never bypass with raw DB UPDATE/DELETE, remove audit, disclose private code or change production settings. The previously advised retry will not work against unpatched deployed verifier; stop retrying.

---

## Nov 23 Owner setup rejected registration options after PIN success; read-only diagnosis

**User reported after private code issuance:** Owner staging browser displayed **`Setup authorization denied or expired.`** They have not reported successful passkey registration. Do not rerun one-time recovery or manually edit/delete staging DB authorization.

**Read-only Railway HTTP logs actually inspected:** On **2026-11-23 15:32 UTC**, staging `/api/staff-auth/session` POST returned **HTTP 200** (real PIN session accepted), followed by two `/owner-setup/registration/options` POSTs at 15:32:19 and 15:32:48 UTC returning **HTTP 403**. Neither browser WebAuthn registration nor verification is shown. The deployed client maps all HTTP 403 errors to the same generic authorization-denied message. Source `routes/firstOwnerActivation.js` shows the 403 could arise from Origin/Fetch-Metadata/content-type guard, missing/invalid 43-character activation header, signed session, digest, expiry, or other candidate denial; HTTP metadata alone cannot distinguish. Do not paste HTTP client IP, PIN or activation code in chat.

**Additive diagnostic (prepared, not yet operator-run):** `scripts/diagnose-owner-stage-activation-state.mjs` at source commit `c286ccfc1220dce63171badd11d2a6ccb27194ee`. It uses the previously verified loopback port 15439 and restricted `hc_owner_stage_operator` login with password injected privately by Railway, sets transaction_read_only, and reports only `HC_OWNER_ACTIVATION_STATE` (ACTIVE_UNUSED/EXPIRED_UNUSED/CONSUMED/... ), reissue count, Owner count. Does not print tokens, digests, employee names, timestamps or credentials, and cannot consume recovery.

**Next Codespaces command, tunnel in Terminal 1 must remain open:**
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
node --check scripts/diagnose-owner-stage-activation-state.mjs
railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local env HC_OWNER_OPERATOR_TUNNEL_CHECK=READ_ONLY node scripts/diagnose-owner-stage-activation-state.mjs
```
Do not issue another token based only on the generic UI message. Interpret state before deciding safe follow-up; if one reissue exists and expired, single-recovery policy means no automatic reset/reissue. Also investigate whether browser sent expected same-origin headers, without logging activation value, only if DB state was active at moment of failed requests.

---

## Nov 23 combined private ceremony preflight PASSED; interactive launcher prepared

**Latest operator evidence (Nov 23):** In existing Codespaces with the private PostgreSQL SSH loopback tunnel open, two nested `railway run` calls successfully combined exact DB and Owner-app variables. Actual operator output:
```
HC_OWNER_CEREMONY_ENV=PASS
HC_OWNER_CEREMONY_TTY=PASS
HC_OWNER_CEREMONY_OPERATOR_DB=PASS
HC_OWNER_CEREMONY_TIMECLOCK=PASS
HC_OWNER_CEREMONY_PREFLIGHT_OK=true; ACTIVATION_NOT_ISSUED=true
```
**Both actual live integrations are confirmed reachable simultaneously**; one-time recovery **still unspent** at this read-only checkpoint.

**New source preparation:** draft PR #75 branch commit `6e117f756fad518fd223955d51f9d93655ab9b23`, `scripts/launch-owner-stage-recovery-ceremony.mjs`. This is an interactive, operator-only Codespaces launcher; enforces isolated staging, canonical Timeclock employee ID 1, exact HTTPS staging URL, existing password/secret present, no operator pre-override, runs combined read-only preflight, checks live HTTPS `/health` and `/owner-setup/`, then **requires exact interactive phrase `ISSUE STAGING OWNER RECOVERY`** before handing operator-only loopback database URL to reviewed `scripts/issue-owner-stage-activation.mjs --reissue-expired-staging-owner` with pre-approved local acknowledgment env and human confirmation of canonical employee ID. It prints the one-time activation only to the trusted Codespaces TTY. New launcher is **not yet executed or integration-tested**; no secrets copied into repo, Railway environment, or chat, no public TCP proxy or production changes.

**When operator physically has phone/passkey and PIN ready, and confirms they want to consume the one-time replacement:** keep Terminal 1 existing SSH tunnel open. In Terminal 2:
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
node --check scripts/launch-owner-stage-recovery-ceremony.mjs
railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local \
 railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service hc-owner-staging --no-local \
 node scripts/launch-owner-stage-recovery-ceremony.mjs
```
Only if the launcher prints ready and device/session available should they type `ISSUE STAGING OWNER RECOVERY`, then independently confirm `1` at the issuer's employee prompt. The token is valid **10 minutes only**; immediately open https://hc-owner-staging-staging.up.railway.app/owner-setup/ and complete signed Timeclock PIN session + real passkey registration; then enroll Google Authenticator TOTP, sign-out/in test. Never share token, PIN, passkey/TOTP secret or QR in chat. Any nonzero process/failure needs state inspection **before retry**, since the issuance could have committed even if output was interrupted. If one-time opportunity expires after committed issuance, **do not manually UPDATE/DELETE** records. Status is still **activation unissued**, no device credential enrolled, no production changes.

---

## Nov 23 combined private ceremony preflight prepared after operator tunnel PASS

**Latest operator result confirmed:** `HC_OWNER_OPERATOR_TUNNEL_PREFLIGHT_OK=true` and `READ_ONLY=true; ACTIVATION_NOT_ISSUED=true` from exact restricted staging PostgreSQL login over local-only SSH tunnel using existing DB password injected by `railway run`. Deployed app's `HC_OWNER_TIMECLOCK_PREFLIGHT_OK` was also independently reported. Both standalone checks PASS; no actual one-time token has been issued.

**Prepared newly (not yet executed in Codespaces):** `scripts/preflight-owner-ceremony.mjs` commit `1c6e9f77fee233a2d49e8d2b36b6f5feded573e0`, strictly read-only combined environment test. It is designed to run inside Codespaces with the existing local-only PG tunnel and two nested `railway run` calls that inject variables from `Postgres-x8Ui` and `hc-owner-staging`, respectively, then performs local `hc_owner_stage_operator` restricted DB read-only check, direct canonical Timeclock `authorize('1')`, and TTY readiness. No sensitive values or identity names printed. The nesting and network reachability are **not yet independently verified**; it may fail if Railway local variable merge drops env, if Timeclock origin is private-only, or if TTY isn't propagated. DO NOT issue recovery until these are resolved. No production changes.

**Next operator command** (leave existing Terminal 1 Railway SSH PostgreSQL loopback tunnel open):
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
node --check scripts/preflight-owner-ceremony.mjs
railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local \
  railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service hc-owner-staging --no-local \
  node scripts/preflight-owner-ceremony.mjs
```
Look for `HC_OWNER_CEREMONY_ENV=PASS`, `HC_OWNER_CEREMONY_TTY=PASS`, `HC_OWNER_CEREMONY_OPERATOR_DB=PASS`, `HC_OWNER_CEREMONY_TIMECLOCK=PASS`, `HC_OWNER_CEREMONY_PREFLIGHT_OK=true; ACTIVATION_NOT_ISSUED=true`. Only then construct explicit operator-only issuance with separate approval, private terminal, physical device and known 10-minute window. Otherwise report only markers, do not send PIN, TOTP, SSH passphrase or activation secrets.

---

## Nov 23 restricted operator tunnel read-only preflight PASSED

**Operator Codespaces success:** Existing SSH tunnel into dedicated isolated `Postgres-x8Ui` was already open. After pulling new source `5359588`, the operator executed `railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local env HC_OWNER_OPERATOR_TUNNEL_CHECK=READ_ONLY node scripts/preflight-owner-operator-tunnel.mjs`. Output: **`HC_OWNER_OPERATOR_TUNNEL_PREFLIGHT_OK=true`** and **`READ_ONLY=true; ACTIVATION_NOT_ISSUED=true`**. The test used **actual restricted** `hc_owner_stage_operator` login via loopback 127.0.0.1:15439 tunnel, checked operator function execute/deny privileges, exact staging DB, original activation expired/unconsumed, no recovery record and zero Owner. This confirms an eligible *still-unspent* first-Owner recovery on Nov 23. Password came from Railway's supported variable injection and was not exposed.

**Also already passed:** `HC_OWNER_TIMECLOCK_PREFLIGHT_OK` from deployed staging app using server-side canonical Timeclock `authorize('1')`. Both essential prerequisites now verified individually. Next is integrating a **private operator ceremony** that can reach both live Timeclock and restricted PG without ever giving public app the operator password or issuing prematurely. The one-shot 10-minute recovery MUST only be invoked after final readiness with phone available; no one-time activation was generated, no passkey/TOTP enrolled, and no production changes.

---

## Nov 23 operator password accessible via Railway run; private tunnel preflight ready

**New operator evidence:** In existing Codespaces branch `feature/owner-expired-activation-recovery-20261113`, explicit `railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local node -e '...'` returned **`HC_OWNER_OPERATOR_DB_PASSWORD: SET`**. This establishes that the *existing* Railway PostgreSQL operator secret can be securely injected into a local subprocess without recreating it. Its value was never displayed or sent in chat. Earlier SSH remote shell / PID1 missing value is now superseded as an access method; don't repeat those attempts.

**Prepared safe operator connectivity:** Added `scripts/preflight-owner-operator-tunnel.mjs` on draft PR #75 branch, commit `5359588cf6d0e1d207c611b96014c657405e4fa4`. It connects **only** via `127.0.0.1:15439` to `hc_owner_stage_test` using fixed restricted role `hc_owner_stage_operator` and password from environment injected with Railway run; never uses root/runtime DB URL, and forces a read-only session. It verifies current user, narrow privileges, original employee-1 activation expired and unused, no reissue or Owner, and recovery function executable. Prints PASS/BLOCKED only. **New helper not yet executed by operator.**

**Private tunnel operator procedure** (two Codespaces terminals; exact isolated DB target):
Terminal A:
```bash
railway ssh config --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --alias hc-owner-stage-db --identity-file "$HOME/.ssh/hc_owner_railway_20261123"
ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:15439:127.0.0.1:5432 hc-owner-stage-db
```
Leave tunnel terminal open. Terminal B:
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
node --check scripts/preflight-owner-operator-tunnel.mjs
railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local env HC_OWNER_OPERATOR_TUNNEL_CHECK=READ_ONLY node scripts/preflight-owner-operator-tunnel.mjs
```
Success marker `HC_OWNER_OPERATOR_TUNNEL_PREFLIGHT_OK=true`. SSH local forwarding is officially supported and confined to the container loopback/private network; no public TCP proxy, no live service deployment. If the SSH tunnel fails, check alias and host/port before doing anything else; if client returns BLOCKED, do not issue the one permitted reissue. No new activation executed.

**Current verified status:** Timeclock canonical employee 1 auth `HC_OWNER_TIMECLOCK_PREFLIGHT_OK`; DB password availability via Railway run SET; restricted operator actual TCP auth pending; offsite encrypted backup/restorable and isolated SQL migration completed Nov 13; recovery unspent based on latest operator evidence. Production untouched.

---

## Nov 23 remote PID1 environment also lacks operator password; use supported Railway local variable injection next

**Operator evidence:** The corrected `scripts/preflight-owner-stage-activation-live.sh` at `b2a6ee4` passed `HC_OWNER_TIMECLOCK_PREFLIGHT_OK` in deployed `hc-owner-staging` using the registered new Railway SSH key. Dedicated `Postgres-x8Ui` SSH succeeded but reported `HC_OWNER_OPERATOR_PREFLIGHT_BLOCKED: password unavailable to Railway SSH` after both the remote shell and read-only PID1 environment fallback could not find `HC_OWNER_OPERATOR_DB_PASSWORD`. The preflight stopped before any DB verification was run; **no reissue, Owner, passkey, migration, deployment or production change**. Railway service metadata still lists the operator password variable name, but this does not guarantee it is injected into SSH shells.

**Next supported, safe diagnosis:** Railway CLI `railway run` fetches variables for a selected service into a *Codespaces-local subprocess*; sealed variables are not available this way. Test only presence, **never print the value**:
```bash
cd /workspaces/Lightspeed-owner-migration
railway run --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui --no-local node -e 'console.log("HC_OWNER_OPERATOR_DB_PASSWORD: "+(process.env.HC_OWNER_OPERATOR_DB_PASSWORD?"SET":"NOT SET"))'
```
If SET, use separate approved, **loopback-only Railway SSH port-forwarding** (https://docs.railway.com/cli/ssh#forward-a-port-with-ssh--l) to reach private PG for restricted operator auth; this requires careful verification, must not leak credentials via CLI arguments, logs or chat. Before any reissue, use a read-only SQL state check on exact isolated DB and separately authorize issuance with real device and 10 minutes reserved. If NOT SET, stop and investigate sealed variable access via trusted private operator workflow (do not shift operator secrets to public app or expose DB TCP proxy). The original database bootstrap, migration, offsite backup, and Timeclock identity success remain intact.

---

## Nov 23 live Timeclock passes; DB operator password hidden from SSH shell

**Fresh operator output:** After `git pull` to `262e0e3` and explicit new Railway key, `scripts/preflight-owner-stage-activation-live.sh` connected into actual Owner staging app and returned **`HC_OWNER_TIMECLOCK_PREFLIGHT_OK`**, independently checking real canonical Timeclock employee 1 through deployed owner-staging integration. A second authenticated SSH connection to exact isolated `Postgres-x8Ui` succeeded, but exited at `HC_OWNER_OPERATOR_PREFLIGHT_BLOCKED: DB password missing`. **No activation, DB write, passkey or TOTP happened.**

**Read-only Railway connector recheck:** dedicated PostgreSQL `Postgres-x8Ui` still has live deployed variable name `HC_OWNER_OPERATOR_DB_PASSWORD`, deployment SUCCESS and no staged changes; this does **not** establish value visibility inside SSH's sanitized shell. The existing app/DB remain deployed and unchanged.

**Code-only correction (not yet operator-tested):** PR #75 branch commit `b2a6ee47372dc09c973ffbe177ff2e1ccc42ee04` adds a narrowly scoped fallback in the operator preflight: if the SSH shell lacks `HC_OWNER_OPERATOR_DB_PASSWORD`, extract that one variable only from the **running PostgreSQL container's own `/proc/1/environ`**, keep it in the remote shell, then attempt local-loopback login as the existing restricted operator role and verify function permissions and unspent recovery. Never echo/archive/transmit the password. If PID1 env lacks it or can't be read, fail closed. No production changes or redeploy.

**Next operator command:**
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/preflight-owner-stage-activation-live.sh
HC_OWNER_RAILWAY_SSH_KEY="$HOME/.ssh/hc_owner_railway_20261123" bash scripts/preflight-owner-stage-activation-live.sh
```
Expected `HC_OWNER_PRIVATE_ACTIVATION_PREFLIGHT_OK=true`. If absent, stop with sanitized error. This read-only check doesn't consume the single-use 10-minute token; do not trigger a reissue without separately approved, fully ready private ceremony. Timeclock is now verified PASS.

---

## SSH fixed; Railpack Node PATH missing in remote login shell (2026-11-23)

**Latest operator result:** Codespaces downloaded commit `17a1792`, new Railway SSH key worked and connected to Owner staging, but the read-only activation preflight's first remote `sh -lc` command returned **`sh: 8: node: not found`** and then `STOP: Timeclock lookup unavailable. No recovery issued.` This is a **remote Node executable PATH failure**, not proof of failed canonical Timeclock identity or wrong credentials. There was **no mutation**.

**Read-only deployment inspection:** Staging app continues to run successfully from Railpack V3 builder, source commit `60cefaf71d7b737753728f95f8474df17e99912c`, start command `node staging/owner-security-server.js`; thus Node exists in running service context even though SSH login shell could not locate it.

**Code-only fix on draft PR #75:** Updated `scripts/preflight-owner-stage-activation-live.sh` to use a non-login `sh -c` remotely, restore only PID1's `PATH` locally within the remote container when necessary without printing environment data, and check limited known Node executable paths. Commits `56c6692` and `262e0e3`. This update is not yet operator-run; no production or staging deployment. Existing isolated DB preflight/activation state remains unmodified.

**Next operator Codespaces command (uses registered working key):**
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/preflight-owner-stage-activation-live.sh
HC_OWNER_RAILWAY_SSH_KEY="$HOME/.ssh/hc_owner_railway_20261123" bash scripts/preflight-owner-stage-activation-live.sh
```
Success requires `HC_OWNER_PRIVATE_ACTIVATION_PREFLIGHT_OK=true`. If it does not pass, stop without reissue and preserve sanitized error. The one-use activation has not been generated; passkey/TOTP enrollment pending. Never change production or public networking to debug this.

---

## Nov 23 Railway SSH authentication restored with separate key; read-only preflight rerun pending

**Operator evidence:** Existing Codespaces `~/.ssh/id_ed25519` private key could not be unlocked (incorrect passphrase); previous read-only Railway SSH activation preflight stopped before contacting Timeclock. Operator created/registered an independent public key and successfully ran `railway ssh -i ~/.ssh/hc_owner_railway_20261123 --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service hc-owner-staging -- node -e "console.log('RAILWAY_SSH_OK')"` with result `RAILWAY_SSH_OK` and clean SSH close. New key is authorized; old key was not overwritten. Passphrases/private keys never shared. No staging data changed.

Updated only `scripts/preflight-owner-stage-activation-live.sh` on development PR #75 branch, commit `17a17927ba1632c13fc9543af1457337920705f3`, to allow optional `HC_OWNER_RAILWAY_SSH_KEY`, passed as `-i` on both Railway SSH calls. **Not yet tested in Codespaces.** Next operator command:
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/preflight-owner-stage-activation-live.sh
HC_OWNER_RAILWAY_SSH_KEY="$HOME/.ssh/hc_owner_railway_20261123" bash scripts/preflight-owner-stage-activation-live.sh
```
Expected `HC_OWNER_PRIVATE_ACTIVATION_PREFLIGHT_OK=true`. Stop and report sanitized output if Timeclock or restricted operator DB fails. One-time 10-minute activation is still **unissued**; no WebAuthn/TOTP enrolled. No production or staging deploy.

---

## Nov 23 activation preflight stopped by Railway SSH key authentication — no reissue

**New operator output:** Codespaces fetched `scripts/preflight-owner-stage-activation-live.sh` from commit `5cec5f2` successfully and started the read-only Railway SSH request to `hc-owner-staging`. Railway repeatedly prompted for passphrase on `/home/codespace/.ssh/id_ed25519`, then returned `You need an SSH key so Railway can recognise you`, and the script printed `STOP: Timeclock lookup unavailable. No recovery issued.` **This is an SSH-authentication failure before the remote Timeclock check executed**, not a failed real Timeclock identity lookup or application fault. No staging write, reissue, WebAuthn or TOTP occurred.

**Safest next step:** in the same Codespaces shell use `eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519 && ssh-add -l`, entering only the SSH private-key passphrase locally. Then validate non-sensitive Railway SSH with `railway ssh --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service hc-owner-staging -- node -e "console.log('RAILWAY_SSH_OK')"` before rerunning `bash scripts/preflight-owner-stage-activation-live.sh`. If SSH still fails, check registered keys through `railway ssh keys` and compare fingerprints locally; never send private keys, passphrases or other credentials in chat. Railway docs: https://docs.railway.com/cli/ssh. Do not regenerate/replace keys unless necessary, and do not open database ports or issue an activation to diagnose connectivity.

**Current security state unchanged:** isolated staging recovery migration is applied and previously verified, offsite encrypted backup exists, but the one-time 10-minute activation is **not issued**, and no Owner passkey/TOTP enrolled. Production untouched.

---

## Resume activation: read-only live operator and Timeclock preflight prepared (2026-11-23)

**Owner explicitly requested "Resume Owner activation."** This authorizes continuing investigation and read-only preparation; it does **not** by itself approve consuming the one permitted 10-minute recovery or any deployment/production changes.

**Fresh connector checks, November 23:** `HC PR63 Isolated Staging` / `staging`: exact `Postgres-x8Ui` and `hc-owner-staging` deployments still SUCCESS, same IDs as Nov 13, **no Railway staged changes**. The staging Owner app still runs `node staging/owner-security-server.js` on `hc-owner-staging-staging.up.railway.app`; separate PG has no public TCP proxy. GitHub draft recovery PR #75 remains OPEN/DRAFT, branch `feature/owner-expired-activation-recovery-20261113`; no new web deploy. The Nov 13 operator-observed SQL success `HC_OWNER_STAGE_SQL_MIGRATED_VERIFIED=true` remains the last DB write evidence; a fresh live reissue-state check is required.

**New prepared, additive, read-only script:** `scripts/preflight-owner-stage-activation-live.sh`, commit `5cec5f22a7d24e5caab3fb63f150cc937f234d28` on PR #75 branch. It uses Railway SSH directly into the existing **staging app** container to call the already-deployed `createTimeclockScannerIdentity({mode:'owner-staging'}).authorize('1')` with the app's **existing** Timeclock service secret, verifying canonical active employee 1 provenance and permissions without showing any personal data or exporting a secret. Then Railway SSH directly into isolated `Postgres-x8Ui` to check that the original activation remains expired/unconsumed, no Owner/passkey/reissue exists, the migrated one-use function exists, and an **actual restricted operator LOGIN role** can authenticate using the existing operator DB password already scoped to PostgreSQL with only operator privileges. It checks the operator is not simultaneously a runtime login. All outputs are status markers; **no activation or DB mutation**, no public proxy or environment variable/config changes. This is **prepared only**; operator has not executed it yet, and no Codespaces test evidence for this newly added script. Bash syntax check required.

**Single next Codespaces command:**
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/preflight-owner-stage-activation-live.sh
bash scripts/preflight-owner-stage-activation-live.sh
```
Look for **`HC_OWNER_PRIVATE_ACTIVATION_PREFLIGHT_OK=true`**. If Timeclock check blocks, troubleshoot true deployed Timeclock endpoint/service access rather than issuing a token; if operator login blocks, check restricted role/password within DB container, not the public web app. No need to repeat the backup/migration. Do not paste Timeclock PIN, codes, or any secrets in chat. If both pass, prepare a private-only execution path for the already reviewed issuer (no app runtime operator credentials) and separately ask for issuance authorization when physical device and signed Timeclock PIN session are ready. Reissue is single-use and expires 10 minutes after creation.

**Status:** Backup Deployed/offsite verified; isolated SQL migration applied/privileges verified Nov 13; live Timeclock/DB operator preflight pending; **activation unused**; passkey/TOTP not enrolled; production untouched.

---

## Departure checkpoint — Owner activation not issued (2026-11-13)

**Immediate operator-facing summary:** Owner reports imminent departure and serious frustration after repeated configuration checks. Do not make them repeat completed steps. **Verified complete:** dedicated Owner staging deployment healthy; isolated `hc_owner_stage_test` database present; expired unused employee-1 first activation; hardened one-time recovery code tested 4/4 disposable PostgreSQL 18; encrypted staging backup `hc-owner-stage-20261113T204750Z-64857.dump.age` (37,741 bytes) successfully restored from the encrypted archive to disposable PostgreSQL 18; exact private offsite Google Drive [archive](https://drive.google.com/file/d/1pLRPMwAU1f0Xn8pCnWv5BO5SEjBZUbqW/view?usp=drivesdk) confirmed; user specifically approved and operator ran `db/hc_owner_stage_expired_activation_recovery.sql`, which returned `HC_OWNER_STAGE_SQL_MIGRATED_VERIFIED=true` in isolated staging. No production changes, no PR merge/deploy.

**Still NOT completed:** no restricted operator-only execution environment in Codespaces, no private live Timeclock verification of canonical employee, **no recovery activation generated**, no hardware-backed Owner WebAuthn passkey registered, no TOTP. Codespaces terminal had none of the operator environment variables; Railway variable-name inspection confirms Timeclock identity settings on `hc-owner-staging` and separate `HC_OWNER_OPERATOR_DB_PASSWORD` on isolated `Postgres-x8Ui`, but `HC_OWNER_OPERATOR_DATABASE_URL` and `HC_OWNER_OPERATOR_REF` have not been privately assembled. Don't retrieve/echo secrets to ChatGPT. **No public PostgreSQL TCP proxy was configured**, so don't assume a Railway `run` inside Codespaces can reach private-only Postgres.

**Critical safety:** one-time recovery SQL was applied but its function has **not been invoked**; the single permitted recovery issuance remains available. Its token expires in 10 minutes and cannot simply be renewed if unused. Do NOT issue now without enough time for same-origin signed Timeclock PIN session + real device passkey. Do NOT reset/delete activation rows or move restricted operator secrets to public web runtime. A five-minute departure window is not a reason to bypass the gate. This is recoverable and resumable exactly where it stands.

**When user has adequate time:** Reuse existing remote Codespace `/workspaces/Lightspeed-owner-migration`, feature branch `feature/owner-expired-activation-recovery-20261113`, private encrypted backup and migration. Establish private operator-only execution *inside Railway private network or reviewed secure tunnel* without changing app runtime privileges. Obtain operator DB URL using only restricted `hc_owner_stage_operator` identity (not postgres/runtime) and separately configured Timeclock secrets, check required environment variable presence without printing values, verify canonical employee 1 via existing trusted `createTimeclockScannerIdentity().authorize` in owner-staging mode. Confirm the staging URL `https://hc-owner-staging-staging.up.railway.app/owner-setup/` works on intended phone/browser, then run the reviewed interactive `node scripts/issue-owner-stage-activation.mjs --reissue-expired-staging-owner` with both operator acknowledgements (see `docs/OWNER_STAGING_EXPIRED_ACTIVATION_RECOVERY.md`). Never share the code; complete device passkey within 10 min and TOTP enrollment on the same employee identity. Verify login/audit afterward.

**User experience:** Do not ask for another generic environment check and do not imply that staged migration equals an Owner account. Have one consolidated, preflighted execution plan that handles credentials privately, protects the sole recovery, and does not introduce production changes.

---

## Operator variables are stored in Railway, not Codespaces shell — 2026-11-13

**Owner-supplied Codespaces shell check:** `process.env` reported `NOT SET` for `HC_OWNER_OPERATOR_DATABASE_URL`, `HC_OWNER_OPERATOR_REF`, `HC_OWNER_TIMECLOCK_ORIGIN`, `HC_OWNER_TIMECLOCK_SERVICE_SECRET`, and `HC_OWNER_TIMECLOCK_EMPLOYEE_ID`. This only inspects the active Codespaces shell; it is not a Railway variable read and does **not** mean earlier Railway service values were lost.

**Independent Railway connector read-only verification:** `HC PR63 Isolated Staging / staging / hc-owner-staging` lists variable names `HC_OWNER_TIMECLOCK_ORIGIN`, `HC_OWNER_TIMECLOCK_SERVICE_SECRET`, and `HC_OWNER_TIMECLOCK_EMPLOYEE_ID` (plus existing secret/session/HTTPS/DB configuration); `Postgres-x8Ui` lists `HC_OWNER_OPERATOR_DB_PASSWORD`. Actual secret **values were not retrieved or revealed**. `HC_OWNER_OPERATOR_DATABASE_URL` and `HC_OWNER_OPERATOR_REF` are operator-only invocation context, not web app variables; their absence from the app is expected. The dedicated PostgreSQL has no public TCP proxy according to Railway inventory, and direct Codespaces pg TCP access for the operator has **not been revalidated**; do not assume `railway run` by itself creates DB networking.

**Next action:** safely assemble a temporary private operator-only Codespaces invocation from the separate Railway service settings and validate connection/Timeclock identity without revealing secrets; preserve operator/runtime separation and avoid creating public DB TCP proxy. Do not invoke `--reissue-expired-staging-owner` until all prerequisites and device presence are confirmed. **This invocation is limited to one 10-minute recovery total** and has NOT been executed. If unable to establish a safe connection before user's travel, stop and resume from this handoff—previous migration/backup stay intact.

---

## Owner staging recovery SQL migration successfully applied and privilege verified — 2026-11-13

**Operator-supplied Codespaces execution evidence:** User explicitly approved only `db/hc_owner_stage_expired_activation_recovery.sql` for isolated Railway `HC PR63 Isolated Staging/staging/Postgres-x8Ui`, DB `hc_owner_stage_test`. Operator ran guarded `scripts/apply-owner-recovery-staging-sql.sh --apply-approved-staging-sql` with private acknowledgement and manually typed `APPLY OWNER STAGING SQL`. The script ran a second read-only preflight and printed `HC_OWNER_STAGING_RECOVERY_PREFLIGHT_OK`, uploaded the exact SQL file to `/tmp/hc-owner-recovery-migration-88282.sql`, then executed it via Railway SSH/psql with ON_ERROR_STOP. PostgreSQL logged a benign `DROP TRIGGER IF EXISTS` NOTICE on line 94: trigger did not yet exist. **Critical post-migration readback passed**: `HC_OWNER_STAGE_SQL_MIGRATED_VERIFIED=true`, followed by `No activation token, Owner account or passkey was created.` This confirms the preflight, migration transaction, the dedicated restricted recovery function owner/ACL, unconsumed original activation, zero new reissue events, and no new Owner.

**Trailing terminal prompt** (`Enter passphrase for key /home/codespace/.ssh/id_ed25519`) is likely for the script's cleanup SSH connection to remove the ephemeral uploaded SQL from `/tmp`. Do not paste SSH passphrase; enter locally. Cleanup completion not yet independently confirmed.

**Independent connector evidence:** Railway read-only inventory after reported migration still shows both `hc-owner-staging` and isolated `Postgres-x8Ui` deployments successful, no pending config/deploy changes. This connector does not expose direct SQL, so actual SQL migration and function-readback results are operator-provided terminal evidence, not independently run SQL.

**Backup before migration:** `hc-owner-stage-20261113T204750Z-64857.dump.age` (37,741 bytes) was restored to disposable PostgreSQL 18 with success marker, and its exact name and size were confirmed in private [Google Drive](https://drive.google.com/file/d/1pLRPMwAU1f0Xn8pCnWv5BO5SEjBZUbqW/view?usp=drivesdk). Local backup SHA-256 `2342d2443084c4c432a05d81532953acb7acf5d2f6d3fc66ddfcde70f9049bee`. No plaintext or credentials disclosed in chat.

**Updated status:** Migration **Applied to isolated staging (operator-observed) and post-verified**. Recovery function is available, but **the one permitted reissue has NOT been invoked**; the original expired activation remains unusable. Next step is a *separately private, interactive* Timeclock-verified issuance to canonical employee ID 1 with restricted **operator** database login (never postgres or runtime DB), while user has physical phone ready. This replacement code has only a **10-minute lifetime** and may be reissued **once total**; do not invoke prematurely. Complete staging WebAuthn passkey and then TOTP; neither is yet verified. Production, deployment, gateway, chrome extension and other business systems remain untouched.

**Current reference:** [draft PR #75](https://github.com/Tawgod/Lightspeed/pull/75), source branch `feature/owner-expired-activation-recovery-20261113`; [fast-finish runbook](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/docs/OWNER_STAGING_FAST_FINISH.md). Next action: validate availability of private operator CLI environment without printing values; issue only when device/session ready. If user leaves town, this handoff plus the verified offsite backup preserves resumable state.

---

## Owner explicitly approved isolated staging SQL migration; operator execution pending — 2026-11-13

**Explicit user authorization received:** "I approve the migration" as a direct reply to the specific question asking permission to apply **only** `db/hc_owner_stage_expired_activation_recovery.sql` to the isolated `hc_owner_stage_test` database in `HC PR63 Isolated Staging/staging/Postgres-x8Ui`. This is limited to the staging SQL migration. **It is not authorization to issue a replacement 10-minute code, create an Owner account, merge PR #75, deploy a web app or change production.**

**Independent pre-execution checks:** Railway connector read staging project `5b46096d-3178-47ec-ba88-d5037696346a`, environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`: `Postgres-x8Ui` and `hc-owner-staging` deployed successfully; no pending changes. Drive metadata confirms encrypted staging archive `hc-owner-stage-20261113T204750Z-64857.dump.age` (37,741 bytes) exists in private backups folder. Previously operator's disposable PostgreSQL 18 restore of local archive passed; local hash `2342d2443084c4c432a05d81532953acb7acf5d2f6d3fc66ddfcde70f9049bee`, Git SQL blob `b27bd4a162c8337b1e969c3ad9a3bf464d3872f1`. Draft branch `feature/owner-expired-activation-recovery-20261113`, current head before operator run `40609e176f0ed3cab674588e09a8ebe0df03aba8`.

**Execution status: NOT YET APPLIED.** ChatGPT cannot invoke the user's GitHub Codespaces terminal directly; Railway connector has no SQL/terminal execution action. Operator must run this approved-only, guarded sequence from Codespaces and report sanitized output. Script `scripts/apply-owner-recovery-staging-sql.sh` performs a fresh read-only preflight, interactive confirmation, upload of exact reviewed SQL to exact staging Postgres service, transactional SQL, and post-migration privilege readback. It refuses wrong branch, SQL blob, encrypted backup hash and approvals.

```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/preflight-owner-recovery-staging.sh
bash -n scripts/apply-owner-recovery-staging-sql.sh
bash scripts/preflight-owner-recovery-staging.sh
# Only if the preflight printed HC_OWNER_STAGING_RECOVERY_PREFLIGHT_OK:
HC_OWNER_STAGING_MIGRATION_APPROVAL=APPROVED_ISOLATED_STAGE_SQL_ONLY \
  bash scripts/apply-owner-recovery-staging-sql.sh --apply-approved-staging-sql
```

At the prompt, operator types `APPLY OWNER STAGING SQL`; never paste credentials or private secrets into chat. Expected final success is `HC_OWNER_STAGE_SQL_MIGRATED_VERIFIED=true`. If SQL partially applies or post-readback fails, **do not blindly rerun**; inspect the exact state privately first. Only after confirmed migration can a separately approved private Timeclock-verified operator issue the one-time activation, with phone/passkey ready within its 10-minute expiry. No production effects.

---

## Owner staging archive confirmed in Google Drive; migration preflight prepared (2026-11-13)

**Offsite archive VERIFIED by direct Google Drive folder readback:** The user reported upload and the Drive connector confirmed exact private [backup file](https://drive.google.com/file/d/1pLRPMwAU1f0Xn8pCnWv5BO5SEjBZUbqW/view?usp=drivesdk) in [HC Backups → Railway → Railway backups](https://drive.google.com/drive/folders/1FClPbgzdZljQzjqENdoK88omJC000Zom), named `hc-owner-stage-20261113T204750Z-64857.dump.age`, **37,741 bytes**, created Nov 13 21:12 UTC. This matches the archive the operator previously decrypted and successfully restored to isolated Docker PostgreSQL 18, checksum `2342d2443084c4c432a05d81532953acb7acf5d2f6d3fc66ddfcde70f9049bee` on the Codespaces copy. The **Google Drive copy's own hash is not independently measured**. The sensitive password document was not opened, credentials not accessed. Offsite archive existence criterion now satisfied.

**Independent Railway verification:** `HC PR63 Isolated Staging / staging` has no pending Railway changes; `hc-owner-staging` and dedicated `Postgres-x8Ui` both have SUCCESS deployments. The reviewed recovery SQL blob in GitHub remains `b27bd4a162c8337b1e969c3ad9a3bf464d3872f1`, with historic user-supplied hardened disposable PostgreSQL 18 suite **4/4 pass**.

**Prepared new development-only tooling, NOT EXECUTED against staging:**
- `scripts/preflight-owner-recovery-staging.sh` commit `6f2329d`: read-only exact staging Postgres-x8Ui DB checks with only OK/BLOCKED output. Requires current expired/unused employee-1 grant, no Owner/passkey/event/reissue and restricted operator/runtime role groups.
- `scripts/apply-owner-recovery-staging-sql.sh` commits `5b86dea`, `58c9149`: guarded, separate **write** helper. Requires explicit in-chat approval of only `db/hc_owner_stage_expired_activation_recovery.sql` on `hc_owner_stage_test`, interactive TTY, exact SQL blob + encrypted local backup SHA, new preflight, local approval environment acknowledgement and typed phrase. Uploads SQL via temporary Railway link to exact service UUID, executes transactional SQL, reads back non-superuser NOLOGIN definer function ACL/Owner and no new activation. **Do not run until the user explicitly approves**. Scripts have not been end-to-end executed in Codespaces; require `bash -n` on current branch.
- [Updated fast-finish guide](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/docs/OWNER_STAGING_FAST_FINISH.md) includes steps.

**Next owner command (no writes):**
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/preflight-owner-recovery-staging.sh
bash scripts/preflight-owner-recovery-staging.sh
```
Once `HC_OWNER_STAGING_RECOVERY_PREFLIGHT_OK` returned, separately obtain owner's explicit staging-only SQL approval. The user saying "backup uploaded" is **not authorization** to apply SQL. Even when migration succeeds, no one-time activation automatically issued; physical passkey+TOTP must still be enrolled privately by user before travel. No production effect.

**Status:** Backup/restorable: PASS; Drive offsite exists: PASS (metadata); code recovery tests: PASS; staging migration: **Not applied, awaiting explicit approval**; Owner passkey and TOTP: not enrolled. No release/deploy/production change.

---

## Owner staging backup — expose encrypted file in Codespaces Explorer (Nov 13, 2026)

**Current blocker:** Operator successfully restored encrypted backup locally on disposable PostgreSQL 18 (see prior handoff) but cannot locate the `.dump.age` file in Codespaces Explorer. Its verified path is `/home/codespace/hc-owner-private-backups/hc-owner-stage-20261113T204750Z-64857.dump.age`; the default VS Code Explorer likely only shows `/workspaces/Lightspeed-owner-migration`. Latest Drive connector search for `hc-owner-stage` found no staging archive, so an offsite copy is **not confirmed**.

**Immediate safe workaround:** In Codespaces run `cd /workspaces/Lightspeed-owner-migration && mkdir -p Owner-Staging-Backup-Download && printf '\\n/Owner-Staging-Backup-Download/\\n' >> .git/info/exclude && cp /home/codespace/hc-owner-private-backups/hc-owner-stage-20261113T204750Z-64857.dump.age Owner-Staging-Backup-Download/ && sha256sum Owner-Staging-Backup-Download/hc-owner-stage-20261113T204750Z-64857.dump.age`. Expected SHA-256 `2342d2443084c4c432a05d81532953acb7acf5d2f6d3fc66ddfcde70f9049bee`. Only the already encrypted file is copied; local `.git/info/exclude` ensures the folder is not staged in Git. VS Code Explorer now displays `Owner-Staging-Backup-Download` under repo. Right-click the `.dump.age` → Download; upload to private [Railway backups folder](https://drive.google.com/drive/folders/1FClPbgzdZljQzjqENdoK88omJC000Zom) or USB. **Do not commit or publish any backup; do not open `Backup password.rtf`.** Keep decryption passphrase separately.

Do not apply the staging SQL migration until offsite backup presence is verified and owner explicitly approves the named staging-only migration. Owner's `please continue` requested progress but not explicit SQL authorization. No Railway DB changes, credential issuance, passkey/TOTP enrollment or production deploy have been made by assistant.

---

## Owner staging encrypted backup restored successfully — external copy pending (2026-11-13)

**Operator Codespaces results:** Fast-forward to development commit `5defde1`, then ran `scripts/verify-owner-staging-archive.sh --verify-encrypted-staging-dump "$HOME/hc-owner-private-backups/hc-owner-stage-20261113T204750Z-64857.dump.age"`. The helper successfully decrypted the exact encrypted file into a throwaway PostgreSQL 18 container (no network), restored it and verified owner-staging schema and expected expired/unused employee-1 activation state; the user terminal reported **`BACKUP_AND_RESTORE_VERIFIED=true`**. File `hc-owner-stage-20261113T204750Z-64857.dump.age` is **37,741 bytes**, SHA-256 `2342d2443084c4c432a05d81532953acb7acf5d2f6d3fc66ddfcde70f9049bee`. The original remote source was verified as dedicated `Postgres-x8Ui`, database `hc_owner_stage_test`, via CLI. This demonstrates on-Codespaces archive recoverability; no direct external offsite copy or exact Drive upload has yet been confirmed.

**IMMEDIATE ACTION:** From Codespaces file explorer locate `/home/codespace/hc-owner-private-backups/hc-owner-stage-20261113T204750Z-64857.dump.age` and download it, then upload to [private Railway backup Drive folder](https://drive.google.com/drive/folders/1FClPbgzdZljQzjqENdoK88omJC000Zom) or store on USB; keep `age` passphrase separately. Verify file size/hash or Drive metadata and do NOT upload a plaintext dump. Once offsite encrypted backup confirmed, inspect `db/hc_owner_stage_expired_activation_recovery.sql` and request separate **explicit approval to migrate only `hc_owner_stage_test`**. The user is leaving town for a week, so prioritize clear handoff and avoid issuing a 10-minute code until the physical device and Timeclock secrets are ready. **No migration has yet been run, no Owner passkey/TOTP enrolled, and no production code deployed.**

**Feature status:** Recovery code In Development / Testing **4/4 PASS** (disposable PG); backup created and isolated restore **PASS**; external copy **pending**; staging migration **not applied**; production unchanged.

---

## Owner staging backup downloaded and encrypted; standalone restore verification next (2026-11-13)

**Operator's latest Codespaces evidence:** After `git pull --ff-only` to commit `51a7977`, backup helper reached **step 4/5**. SSH to dedicated `HC PR63 Isolated Staging / staging / Postgres-x8Ui` verified `hc_owner_stage_test` and printed `HC_OWNER_STAGING_DUMP_READY`. CLI downloaded the dump to `/home/codespace/hc-owner-private-backups/hc-owner-stage-20261113T204750Z-64857.dump`; `age -p` encryption and immediate decrypt+SHA-256 equality checks passed (script entered 4/5). Docker restore was blocked because the script contained a literal trailing `$` in the `CONTAINER` name. Exit cleanup attempted to remove local plaintext and remote temp file; no independent post-cleanup readback. **No disposable restore or independently copied offsite encrypted archive yet, so backup gate remains BLOCKED.**

**Development response only, draft PR #75:** Fixed unique Docker container name from `hc-owner-restore-check-$` to `hc-owner-restore-check-$$` in `scripts/backup-owner-staging-verified.sh` (commit `77a9c6e`). Added stand-alone `scripts/verify-owner-staging-archive.sh` (commit `7cc01dc`), which uses an existing `.dump.age` backup, decrypts only into `--network none` disposable PostgreSQL 18 container, validates archive source DB name, restores database, confirms expected staging tables and first Owner activation state, outputs integrity metadata only, then destroys container. Updated [fast-finish runbook](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/docs/OWNER_STAGING_FAST_FINISH.md). **New verification script has passed shell syntax reasoning, but not yet real operator execution.** No Railway deploy/SQL changes, no production writes.

**Next owner command** (in existing remote Codespace, with the original age passphrase ready):
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/verify-owner-staging-archive.sh
bash scripts/verify-owner-staging-archive.sh --verify-encrypted-staging-dump "$HOME/hc-owner-private-backups/hc-owner-stage-20261113T204750Z-64857.dump.age"
```
Once it emits **`BACKUP_AND_RESTORE_VERIFIED=true`**, externally copy the encrypted file to private [Drive backup folder](https://drive.google.com/drive/folders/1FClPbgzdZljQzjqENdoK88omJC000Zom) or USB; keep passphrase in password manager, never in chat. Then separately approve staging-only migration `db/hc_owner_stage_expired_activation_recovery.sql`; issuance must be restricted to operator login with device present and 10-minute expiry. If user leaves before that step, pause; preserve all evidence via this handoff.

**Status:** Recovery integration tests 4/4 PASS on last changed recovery SQL; backup created and encrypted but **restore verification pending**; staging migration not applied; Owner activation not issued; physical passkey/TOTP untested.

---

## Owner staging backup script v2 — Railway CLI file download corrected, Nov 13, 2026

**Operator Codespaces run (user supplied):** On feature branch after fast-forward to `086a501`, installed `age` successfully from Ubuntu 24.04 packages, and ran new staging backup helper. Railway SSH to isolated `HC PR63 Isolated Staging / staging / Postgres-x8Ui` succeeded with user's local SSH-key unlock. Exact `hc_owner_stage_test` database validated, then a `pg_dump -Fc` was created on remote service and verified with `pg_restore --list`: output **`HC_OWNER_STAGING_DUMP_READY`**. The subsequent local download failed at CLI parsing: `error: unexpected argument '--project' found` for `railway service files download`. Thus **no local encrypted backup, disposable restore, Drive/USB archive or migration was completed**. Existing cleanup trap attempted remote temp removal; removal not independently verified.

**Fix committed only in development branch**: [`51a7977`](https://github.com/Tawgod/Lightspeed/commit/51a79779b83723f23ab6e4cc9a097688e35d1fef) updates `scripts/backup-owner-staging-verified.sh` to use a temporary isolated working directory with `railway link --project <exact project UUID> --environment <exact staging UUID> --service <exact Postgres-x8Ui UUID>`; then invokes flagless `railway service files download` in that context. Temporary link removed on exit, existing repository Railway link unchanged. No production or DB migration performed; download/encryption/restore **remain untested** until operator reruns script.

**Immediate next command in same remote Codespace**:
```bash
cd /workspaces/Lightspeed-owner-migration
git pull --ff-only
bash -n scripts/backup-owner-staging-verified.sh
bash scripts/backup-owner-staging-verified.sh --backup-owner-staging-only
```
The passphrase is entered locally and must not be pasted into chat. Require `BACKUP_AND_RESTORE_VERIFIED=true` and private external archive before SQL migration. If another failure occurs, stop and report **only sanitized error**. Time-sensitive user travel in ~1h, leave [fast finish guide](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/docs/OWNER_STAGING_FAST_FINISH.md).

**Status:** Backup: remote dump successfully attempted but **not verified externally**; recovery migration draft PR #75 still unmerged/undeployed, 4/4 disposable PostgreSQL security tests PASS; Owner enrollment not started.

---

## Time-sensitive Owner staging finish — backup helper prepared, not executed (Nov 13, 2026)

**Goal:** user leaving for one week shortly; preserve current code, exact steps and blockers to avoid restarting. No staging/production migration, new activation, passkey, admin grant or deployment is authorized or performed in this update.

**Prepared only (developer-source writes, draft PR #75 branch):**
- [Operator-only staging backup script](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/scripts/backup-owner-staging-verified.sh), commit `0746b96`. It is constrained to isolated Railway project `5b46096d-3178-47ec-ba88-d5037696346a` / staging / **Postgres-x8Ui**, database `hc_owner_stage_test`; uses Railway SSH to create a temporary restricted custom `pg_dump`, Railway service file download, `age -p` encrypted output, disposable PostgreSQL 18 full restore validation, cleans remote temp and plaintext. Encrypted output remains in Codespaces `~/hc-owner-private-backups`; user must separately download and move to private Drive/USB. Script **shell syntax linted only; has NOT executed against Railway**, therefore DO NOT say a backup has been made or validated.
- [Fast finish/resume checklist](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/docs/OWNER_STAGING_FAST_FINISH.md) with exact SSH read-only preflight, backup, external encrypted copy, migration review/approval, private 10-minute activation and device TOTP sequence.
- Railway current CLI docs confirm SSH with `--project`, `--service`, `--environment` and `railway service files download` command families. Codespaces CLI authorization and exact operator connectivity are **not yet verified**. User asked to run read-only:
  `railway ssh --project 5b46096d-3178-47ec-ba88-d5037696346a --environment staging --service Postgres-x8Ui -- sh -lc 'psql -U postgres -d hc_owner_stage_test -tAc "SELECT current_database(), current_user"'`
  Never paste secrets/URLs/activation codes to chat.
- If SSH probe succeeds: `cd /workspaces/Lightspeed-owner-migration && git pull --ff-only && bash -n scripts/backup-owner-staging-verified.sh && bash scripts/backup-owner-staging-verified.sh --backup-owner-staging-only` (**age** must be installed). Look for explicit `BACKUP_AND_RESTORE_VERIFIED=true`, encrypted file SHA, verify private Drive or USB copy. If any step fails, do not apply SQL.
- The existing 4/4 passing regression tests apply to migration source commit `2b716f7`; adding this separate backup helper/docs does **not** mean any backup or staging migration was tested/applied. Draft PR #75 remains unmerged. Never issue a new 10-minute activation until phone/passkey is ready and explicit SQL approval confirmed.
- Existing [Drive Railway backups folder](https://drive.google.com/drive/folders/1FClPbgzdZljQzjqENdoK88omJC000Zom) only contains production-labeled encrypted files, not a verified staging dump; `Backup password.rtf` deliberately unopened.

**Status:** Implementation In Development (backup helper pending operator run); recovery candidate Testing/PASS (disposable PostgreSQL); deployment recovery NONE; blocking: verified encrypted staging backup & restore + external copy, explicit staging-only SQL approval, operator-only activation and physical passkey/TOTP enrollment. All steps are resumable via the linked runbook.

---

## Drive backup inventory — production dumps found; Owner staging recovery still unverified (2026-11-13)

User reports no backups visible in Railway, but has manual USB and Google Drive backup workflow. Drive connector verified folder chain **HC Backups → Railway → Railway backups**, at [Drive folder](https://drive.google.com/drive/folders/1FClPbgzdZljQzjqENdoK88omJC000Zom). It contains two opaque encrypted files:
- `hc-production-20261113T150210Z.dump.age` (1,442,672 bytes; created Nov 13) [Drive file](https://drive.google.com/file/d/1S4342V0jOJnuexqavuq7W7JmO-tk-ljC/view?usp=drivesdk)
- `hc-production-20261110T213753Z.dump.age` (1,442,494 bytes; created Nov 11) [Drive file](https://drive.google.com/file/d/1LfrJnfBjFzXZLJhXwGwhEdCb_LU5zRoH/view?usp=drivesdk)

A separate `Backup password.rtf` exists in the folder. **Do not open, expose, transmit or quote credential contents.** Neither `.age` blob was decrypted or restored; metadata only. Filename `hc-production` points to a production-labeled backup and **does not establish coverage of Owner staging database `hc_owner_stage_test` in separate Railway `Postgres-x8Ui`**. A Drive search for Owner/staging PostgreSQL backup identifiers did not locate an additional candidate. Another unrelated folder called `Backups` is empty. USB files are not mounted or verified.

**Next gate:** confirm the manual backup source (which Railway service/database) and locate/create a protected, timestamped **Owner staging** dump from `Postgres-x8Ui`, retaining encrypted external copy and validating a restore to an isolated disposable database before migration. Do not substitute the `hc-production` backups for staging, presume USB backup contents, edit Railway, perform a restore over live data, or open password files. Existing draft PR #75 has 4/4 disposable tests passing; staging migration remains **blocked** until dedicated recoverability and explicit separate approval.

---

## Final hardened Owner recovery regression PASS — backup gate next (2026-11-13)

**Operator Codespaces result (latest):** On branch `feature/owner-expired-activation-recovery-20261113`, after fast-forward to `2b716f7564194e1e9a632f844aefbc0154c8b63c`, owner ran `bash scripts/test-owner-recovery-disposable.sh`. Docker PostgreSQL 18 test suite **4 passed / 0 failed / 0 skipped**, ~1.04s; runner reported disposable container removed. This test covers the dedicated NOLOGIN/NOINHERIT non-superuser `SECURITY DEFINER` function-owner changes, operator/runtime privilege separation, expiry/consumption denial, immutable audit and one-time recovery/rollback. Evidence is owner-supplied terminal output, not a direct Codespaces shell result.

**Independent Railway read-only inventory:** Project `HC PR63 Isolated Staging` `5b46096d-3178-47ec-ba88-d5037696346a`, environment `staging` `46b93c76-3085-4e76-a37d-90dfdd250dd2` has **no staged changes**. Dedicated Owner DB service `Postgres-x8Ui` `5c4498e4-cffb-4224-916a-af57391d1cd9` PostgreSQL 18 deployment `51d04bf4-0f3e-4716-ba17-8e756a1bc1be` SUCCESS with separate volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`. Web service `hc-owner-staging` `3a8f9555-90e5-4bc2-bb63-4f48d8c852d0` deployment `7d682a97-0b62-4e49-a4c8-af83d03d8e08` SUCCESS, app source pinned to `60cefaf71d7b737753728f95f8474df17e99912c` and `node staging/owner-security-server.js`. Recovery source draft [PR #75](https://github.com/Tawgod/Lightspeed/pull/75) is **not** deployed.

**Blocking next gate:** Railway connector lists Owner DB persistent volume but **cannot establish a verified backup, PITR coverage, or restore drill**. A volume is not a backup. User needs a read-only Backups view for **Postgres-x8Ui** specifically, or an approved independent protected staging logical dump + disposable restore. Staging migration `db/hc_owner_stage_expired_activation_recovery.sql` must receive **separate explicit approval** after backup verification and preflight. Do not apply it, issue replacement token, grant Owner privileges, or change production by default.

**Status:** Implemented: proposed code in draft PR #75. Tested: PASS (latest hardened recovery candidate on disposable PostgreSQL). Deployed: only the preexisting Owner staging app/DB, no recovery migration. Next: verify recoverable staging backup, review target/source and private employee-1 state, then seek explicit staging-only SQL approval. Preserve old expired activation and audit.

---

## Owner staging recovery — PostgreSQL tests passed; definer hardening pending retest — 2026-11-13

**Operator Codespaces success:** latest supplied terminal output from `/workspaces/Lightspeed-owner-migration` on `feature/owner-expired-activation-recovery-20261113` fast-forwarded to `0d7b995`, then successfully ran `bash scripts/test-owner-recovery-disposable.sh`: **4/4 passed, 0 failed, 0 skipped** against a disposable PostgreSQL 18 container. Previous `terminating connection due to administrator command` was not observed, and runner reported container cleanup. This is user-supplied CLI evidence; no independent ChatGPT Codespaces shell access. No actual Railway staging migration or Owner activation was run.

**Security review of draft [PR #75](https://github.com/Tawgod/Lightspeed/pull/75):** after that success, reviewed PostgreSQL 18 `ALTER FUNCTION` / `SECURITY DEFINER` guidance and identified that creating recovery function under a privileged migration operator could otherwise allow broad definer execution privileges. On the development branch, commit `3bc7bb3` adds a dedicated `hc_owner_stage_recovery_definer` NOLOGIN NOINHERIT non-superuser DB role with exact SELECT, INSERT and four-column UPDATE grants; ownership of the recovery function is transferred to it and temporary schema CREATE revoked, all within migration transaction. Commit `2b1cdf5` adds regression assertions for actual function owner, privilege restrictions and runtime/operator denial. Runbook/CHANGELOG and PR comment updated. These hardening changes **were made after** the operator's 4/4 result and must be retested against disposable PostgreSQL before any migration approval.

**Status:** Implementation: draft reviewed candidate; Testing: **pass on earlier revision, latest SQL pending retest**; Deployed: no recovery code/SQL. Keep production Timeclock and existing staging running without further changes. Next owner command in existing Codespace: `git pull --ff-only && bash scripts/test-owner-recovery-disposable.sh`; never run against Railway DB. If successful, review staging backup and exact migration + role privileges and request explicit separate staging-only authorization. No code, activation token, passkey or TOTP is in production.

---

## PR #75 Codespaces recovery test failed — retest required, 2026-11-13

**Observed from operator terminal:** `bash scripts/test-owner-recovery-disposable.sh` on branch `feature/owner-expired-activation-recovery-20261113` pulled Docker `postgres:18` and executed 4 tests: 3 passed, 1 failed. Failing database test `one expired unused activation can be reissued with immutable audit, never twice` returned `terminating connection due to administrator command`. No successful disposable recovery migration or token reissue was verified. Local Node source tests and non-TTY checks passed; no Railway/database production/staging mutation occurred.

**Development response in draft [PR #75](https://github.com/Tawgod/Lightspeed/pull/75):** commit `5b3d14b` replaces readiness detection of the transient Docker initialization server with stable published TCP checks; `03496be` adds per-phase SQL failure diagnostics, preserves original errors, and removes force-drop teardown of a still-connected disposable DB. Runbook updated. Root cause is not conclusively established until the next test. Exact command to rerun in existing Codespace after `git pull --ff-only`: `bash scripts/test-owner-recovery-disposable.sh` (remote disposable PostgreSQL only).

**Status:** Implementation: code candidate; Testing: **failed, retest pending**; Deployed: **no recovery changes**. Keep existing Owner staging instance untouched and do not issue activation until PostgreSQL test passes, security review is completed, staging backup is checked, and separate explicit staging migration approval is given.

---

## Owner staging expired activation recovery PR #75 — code only, 2026-11-13

**Operator Codespaces HTTP results:** `GET /health` returned `{"service":"owner-security-staging","ready":true}`; `GET /owner-setup/` HTTP 200; `GET /owner-setup/client.js` HTTP 200; cross-site registration POST HTTP 403; same-origin registration POST missing activation HTTP 403. These are user-provided HTTP checks (five successful probes), **not** independently verified physical WebAuthn, signed Timeclock authorization, Authenticator, complete authentication, or recovery.

**Development milestone:** New [draft Lightspeed PR #75](https://github.com/Tawgod/Lightspeed/pull/75) on `feature/owner-expired-activation-recovery-20261113`, based on existing `feature/owner-staging-locked-preview-20261112` (PR #68). Includes `db/hc_owner_stage_expired_activation_recovery.sql` (additive audit and narrowly operator-executable one-time expired authorization recovery function, keeping old digest/timestamps/issuer), explicit operator-only `--reissue-expired-staging-owner` CLI flag with independent Timeclock identity and interactive confirmation, negative/disposable PostgreSQL tests, and `scripts/test-owner-recovery-disposable.sh` for Codespaces. Source overview: [runbook](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/docs/OWNER_STAGING_EXPIRED_ACTIVATION_RECOVERY.md); [changelog](https://github.com/Tawgod/Lightspeed/blob/feature/owner-expired-activation-recovery-20261113/CHANGELOG.md). Existing initial issuance remains restricted and fail-closed.

**Implementation / Testing / Deployed:** Development source on GitHub **implemented as unmerged draft**; JS source syntax reviewed, but **disposable PG recovery integration test not executed yet**. HTTP negative probes passed by operator on existing app. **No recovery migration applied, no recovery CLI invoked, no new activation issued, no Owner passkey/TOTP registered, and no recovery source deployed**. Railway app remains pinned to previous deployed source until separately verified; previous staging authorization remains expired/unused per operator SQL. Previous entries about absent activation are superseded by that newer operator evidence. No production Timeclock, Lightspeed, Chrome extension, central gateway, or employee record changes in this milestone.

**Next:** Owner runs `bash scripts/test-owner-recovery-disposable.sh` in their *remote Codespace* on the draft branch; report test results (no secret values). Review SQL and staging backup, then seek **separate explicit approval** to apply exactly the isolated staging recovery migration. A trusted independent operator then may privately reissue *one* 10-minute activation using restricted operator DB identity, same canonical Timeclock employee 1 and physical device. Never bypass expiry with raw `DELETE/UPDATE`, use `postgres` for issuance, or send the PIN/activation/QR/TOTP to chat.

---

## Expired staging first-Owner authorization — operator readback, 2026-11-13

**Latest operator-supplied Codespaces read-only SQL output:** isolated `hc_owner_stage_test` is reachable as `postgres`; staging activation row for employee **1** reports `expired=true`, `used=false`, `passkey_recorded=false`, and active Owner count **0**. This is an **operator-observed SQL result**, not independently read back through ChatGPT's Railway connection. No passkey enrollment or Owner grant is evidenced. Compared with the earlier handoff ("no operator activation issued"), the existence of this expired row is newer evidence and supersedes that earlier statement. The exact issuance time and issuer have not been independently verified.

**Newly confirmed source limitation at deployed `60cefaf71d7b737753728f95f8474df17e99912c`:** `scripts/issue-owner-stage-activation.mjs` refuses to issue when **any** existing activation row exists, including an expired unused row (`previous.rowCount!==0`). `hc_first_owner_activations` has `employee_id` as primary key, and `hc_owner_stage_operator_privs` has only `SELECT, INSERT` on this table—not `UPDATE` or `DELETE`. Consequently, rerunning the existing issuer cannot renew this authorization; manually deleting, truncating, overriding, or changing DB grants would bypass the reviewed one-time controls and is **not authorized**.

**Safest next step:** use a trusted Codespace for no-credential HTTPS `/health`, `/owner-setup/` and explicit cross-origin denial probes, followed by a separately reviewed and approved **staging-only, audited expired-authorization recovery** if a new 10-minute physical Owner ceremony is needed. Reissue design should require independent canonical Timeclock employee-1 verification, separate restricted operator identity, proof of expiry and non-consumption and zero existing Owner, transactional locking, an append-only evidence record preserving the prior digest/timestamps/issuer, and no runtime/web issuance path. Current source/DB privileges do **not** implement this recovery. An alternative isolated DB rebuild would be a separate destructive authorization and is not implied.

**Execution boundary:** no new token issued; no database changes, source changes, Railway changes, Timeclock changes, live HTTP acceptance, production Owner privilege or WebAuthn/TOTP enrollment performed in this review. Railway read access through this connector returned insufficient permission, and public URL could not be independently reached from available network clients.

---

# First Owner Login — Current Handoff

## Isolated first Owner enrollment service deployed — 2026-11-13

**Scope:** Existing `HC PR63 Isolated Staging/staging` `hc-owner-staging` only; existing protected Timeclock service secret, independent Owner PG18 and HTTPS hostname reused. Deployed already-pinned Lightspeed source `60cefaf71d7b737753728f95f8474df17e99912c` with no source/branch switch. Staged Railway patch `3e5b6e49-e282-47b0-806e-700b9d42ac88` contained **exactly four non-destructive service-only changes**: start command `node staging/owner-locked-preview.js` → `node staging/owner-security-server.js`, set `HC_OWNER_STAGING_ENABLED=true`, `HC_OWNER_TIMECLOCK_EMPLOYEE_ID=1`, and `HC_OWNER_TIMECLOCK_ORIGIN=https://timeclock-production-2bfa.up.railway.app`. No other app, DB, volume, shared setting or production service was part of the patch.

**Result:** Railway `accept_deploy` committed patch. New staging deployment **`7d682a97-0b62-4e49-a4c8-af83d03d8e08` SUCCESS/online**, 1/1 replica, zero warnings or critical issues; service health check remains `/health`, new start command verified. Isolated Owner PostgreSQL `Postgres-x8Ui` remained online. Owner server's startup is fail-closed on exact HTTPS origin, independent secrets, restricted runtime DB privileges, selected canonical employee ID and synthetic login flags.

**Verification boundary:** No independently successful authenticated Timeclock verifier request; public HTTPS route content could not be read through available external browser/network clients. Railway platform health alone does not establish passkey registration/CSRF/real WebAuthn function. No operator first-Owner one-use token issued, no actual Owner created, passkey enrolled, TOTP attached, production role granted or Timeclock PIN altered. First activation must come from **separate trusted local interactive operator** using `scripts/issue-owner-stage-activation.mjs --issue-staging-owner` and operator-specific restricted DB identity, 10-minute one-use code, never through assistant/CI/logging. Live public enrollment page may now be present; advise user **not to enter PIN or activation before the one-use private operator step and browser/security acceptance are confirmed**.

**Next:** Read-only HTTP/security/negative probe from a trusted client, confirm exact Owner-staging login URL and same-origin requirements in actual browser, independently check allowed employee 1 auth and disabled employee 13, then private operator bootstrap and physical passkey/TOTP. Staging passkey is bound to staging hostname, not automatically the future production hostname. No public Timcorp gateway or production Owner privileges modified.

---


## Dedicated Timeclock Owner verifier enabled — 2026-11-13

**Exact authorization:** User explicitly approved changing only production Timeclock `OWNER_STAGING_IDENTITY_ENABLED` to `true` for canonical employee **1** with existing dedicated service secret and rate limiter; no Owner role or other-service changes.

**Read-only preflight:** Existing production Timeclock `0c75bbb3-1cd5-49a0-b1b8-98dbf5e5d379` SUCCESS/online, PostgreSQL SUCCESS/online; four `OWNER_STAGING_*` variable names present (values OAuth-redacted). A one-variable Timeclock-only patch `75c1aab4-77cc-4f99-bffc-12f84550d2e4` was already staged. Explicitly set `OWNER_STAGING_IDENTITY_ENABLED=true` **staged**, then re-reviewed the patch: exactly one non-destructive Timeclock variable change, no shared variables or other services.

**Action:** Railway `accept_deploy` committed patch and triggered replacement Timeclock deployment **`6364db6d-6ca5-4c89-a317-4870454e6995`** at 2026-11-13 16:20 UTC; subsequent readback confirmed **SUCCESS/online** (2026-11-13 16:21:35 UTC), 1/1 replica running, zero warnings or critical alerts, PG online, staged patch cleared. Exact deployment's runtime logs show `Timeclock listening on port 8080`. No authenticated Owner-verifier HTTP probe was performed. This action enabled code's dedicated authentication endpoint with scoped credential but **does not prove** a successful authorized Timeclock HTTP authentication, table SQL existence by direct tool readback, or credential equivalence (operator separately verified). No Owner credential enrolled, production Admin permission granted, PIN reset, or staging site unlock.

**Remaining:** verify new production service health, review protected cross-project server-to-server HTTPS routing and exact staging origin/RP ID and JWT/cookie contract, then explicitly review and deploy existing `staging/owner-security-server.js` with `HC_OWNER_TIMECLOCK_EMPLOYEE_ID=1` and `HC_OWNER_TIMECLOCK_ORIGIN` only after same-origin/security tests. Current `hc-owner-staging` remains locked. Operator-only first Owner activation token is a separate interactive step.

---


## Owner-scoped Timeclock environment configuration — 2026-11-13

**User-authorized production configuration-only deployment:** Railway `Hobby Corner / production`, Timeclock service `dd3469bd-5fce-43bc-b9f9-7aa2a7806457`. Reviewed staged patch `76bf178c-bcb8-4983-99e6-35e0d10e17c3` (exactly four **added** variables, only Timeclock service, non-destructive): `OWNER_STAGING_EMPLOYEE_ID`, `OWNER_STAGING_IDENTITY_ENABLED`, `OWNER_STAGING_SERVICE_SECRET`, `OWNER_STAGING_THROTTLE_SECRET`. Operator independently confirmed employee ID 1, enabled flag exactly `false`, and matching value with staging `HC_OWNER_TIMECLOCK_SERVICE_SECRET`. Connector redacts values; no secret values were read or disclosed.

**Action:** `accept_deploy` committed the four-variable patch; workflow `commitChanges/c562fbb2-8431-4beb-834d-6938b3a2ad10/76bf178c-bcb8-4983-99e6-35e0d10e17c3`. New Timeclock deployment **`0c75bbb3-1cd5-49a0-b1b8-98dbf5e5d379` SUCCESS/online** (readback status updated 2026-11-13 16:13:57 UTC), 1/1 running replica, 0 warnings and 0 critical issues; no pending work. Variable names now appear live and environment staged patch is null. Production PostgreSQL remains online. This verifies platform health, not private Owner credential matching or a live Owner login.

**Scope:** No Owner identity endpoint activation (flag remains disabled by owner-confirmed value), Owner role grant, staging preview unlock, PIN change, DB write or other-service intentional change. Next: verify Timeclock deployment SUCCESS and health, then separately review and approve enabling scoped verifier with full staging origin/proxy security tests; existing isolated Owner preview remains locked.

---


## Production Owner PIN-throttle SQL applied — operator verification, 2026-11-13

**Authorization / execution:** Owner previously expressly authorized applying only `timeclock/db/hc_owner_stage_login_limits.sql` after verified backup; user ran the reviewed exact `CREATE TABLE IF NOT EXISTS` in a transaction through Codespaces Railway production PostgreSQL SSH tunnel. User's preflight showed `current_database=railway`, `current_user=postgres`, `public.employees` present, `public.hc_owner_stage_login_limits` absent. User subsequently reported post-migration table/existing-row verification **“Verified.”** No independent SQL readback by ChatGPT; treat migration as **operator-verified**, not connector-confirmed.

**Backup recovery:** Nov 13 fresh `hc-production-20261113T150210Z.dump.age` full age decryption exit 0; operator reported disposable PostgreSQL 18 restore drill PASS, then USB file SHA-256 exactly matched Codespaces original: `DE1335403CBE76E77F09F7C60456CBA30F3F28A95FC8E86944D4FE3B365DE75B`. External USB copy confirmed by operator, cloud copy not independently verified. Passphrase is retained separately per prior owner report. No passwords/seeds/employee data disclosed.

**Read-only after-migration Railway check:** Timeclock service remains SUCCESS/online `06ca0840-cbb8-4eb4-85f7-481050e5420e`; production PostgreSQL SUCCESS/online `e2f7330b-dc79-4d29-b0bb-8003d349f109`, no staged changes. **No** `OWNER_STAGING_*` environment variable names on production Timeclock. Existing `HC PR63 Isolated Staging/staging` `hc-owner-staging` and separate Owner PG remain SUCCESS/online, but Owner app variable inventory still lacks `HC_OWNER_TIMECLOCK_ORIGIN` and `HC_OWNER_TIMECLOCK_EMPLOYEE_ID`; web runtime is still locked-preview. These require separately reviewed secure changes before physical enrollment.

**Status:** Production throttle-table migration **operator-verified applied**, not directly verified by connector; passkey/TOTP **not enrolled**, production Owner permission **not granted**, Timeclock Owner verifier **disabled**. Next: private issuance and reconciliation of independent Timeclock service/throttle credentials, allowlist employee 1, cross-project HTTPS endpoint review, then isolated staging deployment of actual enrollment server with previously tested DB roles and fresh device verification. Never reuse Discord/Scanner/admin secret.

---


## Reconciled existing Codespaces production backup evidence — 2026-11-12

**Correction to previous backup blocker:** A recoverable production logical backup was in fact performed **November 10–11, 2026** in a private Codespace, not archived in GitHub source. Evidence in `docs/POSTGRES_BACKUP_WITHOUT_RAILWAY_TIER.md`, commit `07e9889136d2c8e82e3fc8f8fef798db7acffe72`, records operator-reported full decrypt, `pg_restore --list`, and disposable PostgreSQL 18 **54-public-table restore PASS** for `hc-production-20261110T213753Z.dump.age`. Git history `3a89ee6b02c0124b9a4a71b28aa5fdf611d25ac0` records matching SHA-256 for encrypted copy on operator's external USB G: drive (`55a0b85cea20ebc0fc42e97aecd20d3ebb8368f0752d0e0d2158294592314b81`); commit `c6fddbeb9df48a3d6aa9a6c5efa899e2b5b42b12` records operator confirmation of passphrase custody in password manager. Operator reported a further Google Drive upload, but its file/checksum were **not independently verified** (`c6922617b3316efd4ef7383992ac5a35db76a0f9`).

This is a **tested point-in-time logical backup** of the shared production PostgreSQL instance, including Timeclock, not continuous PITR or a verified current Railway-native volume snapshot. It proves historical recovery to November 10, not that all changes up to the upcoming SQL migration are backed up. Earlier handoff entry claiming backup evidence absent is superseded; it specifically meant no native Railway backup visibility. **The authorized production migration remains unapplied.** Before applying, owner/operator should decide whether a fresh pre-migration logical backup is required, verify protected archive accessibility/custody and exact live target schema, and use a reviewed private SQL execution channel. No database or service changes were made while reconciling the record.

---


## Production Timeclock throttle migration authorization and backup gate — 2026-11-12

**Authorization received:** User authorizes verifying recoverable production Timeclock backup and applying **only** the reviewed `timeclock/db/hc_owner_stage_login_limits.sql` if all safeguards pass; explicitly forbids employee-record and other-service changes.

**Read-only Railway verification:** `Hobby Corner/production` project `f7e91de7-43f6-472e-b4ca-46b0623f8e0e`, environment `c562fbb2-8431-4beb-834d-6938b3a2ad10`: Timeclock service `dd3469bd-5fce-43bc-b9f9-7aa2a7806457`, deployed pinned source `a595fd336c5a38dcc5ab5423a8967698777c0929` (default-disabled Owner endpoint). Production PostgreSQL service `9a4660e3-766c-46cf-adbb-4d2c8e341c44`, `postgres-ssl:18`, volume `f50e8013-7ada-4dd4-ba1e-0f933fb0e17b` on `/var/lib/postgresql/data` size 5000 MB, successful service deployment `e2f7330b-dc79-4d29-b0bb-8003d349f109`. No pending Railway environment patch.

**SQL source check:** `timeclock/db/hc_owner_stage_login_limits.sql` adds only `CREATE TABLE IF NOT EXISTS hc_owner_stage_login_limits (scope_key char(64) PRIMARY KEY CHECK hex format, count integer NOT NULL with nonnegative bound, window_start timestamptz NOT NULL)`. No employee, Timeclock entry, existing permission, credential, or existing table DML in reviewed SQL. Existing Owner verifier routes are disabled until separately configured. Database presence does not establish table absence or migration state; a privileged `to_regclass` query is still required.

**Blocking backup gate:** Available Railway connector exposes service/volume/deployment status but **does not expose volume backup inventory, latest verified recovery point, PITR status, snapshot creation, SQL console, or restore drill**. Railway docs describe `railway postgres pitr status --service postgres`, `railway postgres pitr backup create --service postgres --name pre-migration`, and backup restore procedures; none were run here. A persistent volume is **not** evidence of a backup. Also no live DB SQL execution was performed. Accordingly the user authorization's prerequisite is **not satisfied**: no migration applied, no secret read, no variables or services changed. Require operator to verify healthy backup/restoration (and preferably fresh pre-migration snapshot), then use an approved private migration runner with the exact SQL; confirm table and old operations afterward. Do not enable Owner login as a side effect.

**Status:** Planned/Blocked, backup unverified; database migration NOT implemented in production, NOT tested against live database, NOT deployed.

---


## Source-controlled gated activation review — 2026-11-12

**Code/documentation milestone:** Created draft [Lightspeed PR #74](https://github.com/Tawgod/Lightspeed/pull/74) from the **deployed** Owner-staging Timeclock code SHA `a595fd336c5a38dcc5ab5423a8967698777c0929`, new doc `docs/FIRST_OWNER_STAGING_ENABLEMENT_GATES_20261112.md`, head `ff059e331b05e8afccd902b99b126ac9ae35d3a9`. The plan maps the exact production throttle table, independent Owner-only service credentials, canonical employee 1 allowlist, HTTPS cross-Railway-project connectivity, reuse of existing `hc-owner-staging` locked preview + `Postgres-x8Ui` database, mobile WebAuthn acceptance and human-only one-use activation. Clarifies employee 13 must be added later through authenticated Admin grant.

**Important verification:** Timeclock production already has source `timeclock/ownerStagingIdentity.js` (default-disabled) but variable inventory lacks `OWNER_STAGING_*` credentials/allowlist. Its additive `timeclock/db/hc_owner_stage_login_limits.sql` was not verified as installed or backed up. Existing Owner staging web app uses `node staging/owner-locked-preview.js` and also lacks real employee 1 and Timeclock origin configuration. Since staging and Timeclock are in different Railway projects, no cross-project private DNS reachability can be assumed; approved HTTPS service endpoint requires security review.

**Status:** PR #74 documents gates only. No live login enablement, SQL migration, staging unlock, service deploy, production role grant, passkey, TOTP, activation issuance, or secret reads. **Next:** Independent approval of production Timeclock backup + additive throttle schema, restricted credentials and network route, then exact staged application switch and physical phone enrollment.

---


## Requested Owner staging enrollment enablement — 2026-11-12 late evening

User explicitly requested **enable isolated staging passkey enrollment for canonical employee 1**, while sending the URL to their personal phone. Scope excludes production Owner role grant or gateway/DNS changes. Rechecked Railway **read only**: locked preview `HC PR63 Isolated Staging/staging` service `hc-owner-staging` (deployment `c97a3939-8372-4412-b2b7-c89ec8c9e610`, pinned `60cefaf71d7b737753728f95f8474df17e99912c`) still starts `node staging/owner-locked-preview.js`, with HTTPS hostname, staging origin/RP ID and independent secrets present by variable name. It does **not** expose passkey registration. Production Timeclock service `dd3469bd-5fce-43bc-b9f9-7aa2a7806457`, code `a595fd336c5a38dcc5ab5423a8967698777c0929`, **does not have** any `OWNER_STAGING_IDENTITY_ENABLED`, `OWNER_STAGING_EMPLOYEE_ID`, `OWNER_STAGING_SERVICE_SECRET` or `OWNER_STAGING_THROTTLE_SECRET` variable names. Required Timeclock throttle schema `timeclock/db/hc_owner_stage_login_limits.sql` remains unconfirmed/unapplied. Staging `hc-owner-staging` also lacks `HC_OWNER_TIMECLOCK_EMPLOYEE_ID` and `HC_OWNER_TIMECLOCK_ORIGIN` variable names. Railway connector redacts secret values, so variable presence alone cannot confirm correct values. Staging environment had **no pending patch**.

**Decision:** Approval to enable is noted but prerequisites for safe enablement are **not met**. Do not simply replace the locked start command, toggle a flag, apply production SQL, or issue activation token. No changes deployed or staged in this review. Next, separately review backup/schema migration and Owner-specific independent credentials/allowlist before an exact, staged, tested transition to the real enrollment app. First Owner activation remains an interactive trusted-operator step. User must register passkey on personal phone and TOTP afterward, with no secrets in chat.

---


## First Owner identity and current staging readiness — 2026-11-12 evening

**Identity selection (user-confirmed through restored Discord Hobby Bot Timeclock employee list):** canonical Timeclock employee **1** is the intended first Owner; employee **13** is the intended second Owner **later**. This is an operator selection, **not** proof of a server-side active-employee recheck or an Owner grant. No PIN, Authenticator seed, activation token or customer record was shared. Employee 13 must only be added later through strong-authenticated, audited Admin delegation, never through first-Owner bootstrap.

**Live production connection:** Hobby Bot and Timeclock redeployed after the operator aligned the existing Timeclock admin secret with Railway shared configuration. Railway on 2026-11-12 21:41 CST showed bot deployment `a972688e-e6c7-4eea-9ca4-aef8021b314a` and Timeclock `06ca0840-cbb8-4eb4-85f7-481050e5420e`, both SUCCESS/online; Discord bot connected and command group synchronized. User reports Discord employee lookup works. The credential value was not read or recorded, and the existing shared admin credential must **not** be reused as the separate Owner staging service credential.

**Authoritative isolated staging reuse:** Read-only Railway check of `HC PR63 Isolated Staging/staging` (project `5b46096d-3178-47ec-ba88-d5037696346a`, environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`) confirms **hc-owner-staging** locked preview deployment `c97a3939-8372-4412-b2b7-c89ec8c9e610` SUCCESS/online, **Postgres-x8Ui** Owner DB `51d04bf4-0f3e-4716-ba17-8e756a1bc1be` SUCCESS/online, and **no staged changes**. Locked preview is not an active Owner enrollment screen. Separate old `HC Owner Security Staging/test` patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` still has 55 STAGED changes for another app, PG and volume; **do not apply**.

**Blocked next gates:** (1) approved additive Timeclock per-account throttle schema and independent `OWNER_STAGING_*` credential/active employee 1 allowlist; (2) isolated staging locked-preview-to-real-enrollment source/HTTPS origin/proxy review and physical WebAuthn test; (3) separately authorized interactive operator-only first activation with restricted operator DB identity, no code issuance by chat/CI; (4) owner physically registers passkey, then Google Authenticator TOTP on that same employee identity; (5) recovery/revocation acceptance; (6) separate, approved production Owner permission commissioning. **No actual Owner created or TOTP/passkey enabled.** Never send PIN, activation, QR seed or six-digit code to ChatGPT.

**Implementation:** Owner passkey and TOTP draft candidates exist; automated staging contract tests historically passed. **Tested in current check:** Railway health and Discord employee lookup reported by operator; real owner passkey and Authenticator untested. **Deployed:** only locked preview, separate restricted DB and default-disabled Timeclock identity endpoint.

---


## Railway Owner staging patch reconciled read-only — 2026-11-12

**Status: STAGED, not applied.** Inspected Railway pending patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` in `HC Owner Security Staging` (project `2b350cde-048e-4402-bd92-4e8ba6c9f877`, test environment `db9d6e8c-bb03-441b-a154-80c11536dfbb`). The 55 entries consist of **three staged CREATE resources**: the `owner-security-staging` app (repo `Tawgod/Lightspeed`, pinned candidate commit `6b6498a01d0cfca42db273f00e97680d140a6ccb`, start command `node staging/owner-security-server.js`), `Postgres` (PostgreSQL 18 SSL image), and a dedicated `postgres-volume`. Some variables are staged but encrypted values are not available for approval. Railway marks patch **non-destructive**, but that is not proof it is complete or secure. **Not deployed:** no committed runtime for this project; the patch remains unapplied.

**Decision:** Preserve the patch but **do not commit** until its owner-specific source, environment values, secret availability, first-Owner commissioning authority, backend Timeclock contract, WebAuthn origin/RP ID, and database/migration+role separation have been independently verified. The code-only canonical employee preview PR #73 is **not** this staged service. Existing `HC PR63 Isolated Staging` locked Owner preview is separate and unchanged. Owner/password/PII values were not retrieved or disclosed.

---

## Canonical staff identity candidate must not bypass first real Owner — 2026-11-12

Draft [Lightspeed PR #73](https://github.com/Tawgod/Lightspeed/pull/73) adds code-only real-Timeclock *self identity* preview on top of the separately accepted synthetic pilot, not real Owner commissioning. Existing `ownerSecurityStagingMount`, unified Owner passkey/activation candidate and independent approver checks are reused **as future dependencies**, not duplicated. Scanner `role` and `canApprove` are explicitly stripped from the employee preview. A genuine independent Owner assignment reader is mandatory; no browser/PIN/synthetic 901 self-appointment or TOTP/passkey QR may be activated.

**Live Railway readback:** separate `HC Owner Security Staging` project `2b350cde-048e-4402-bd92-4e8ba6c9f877` has **55 STAGED changes** in `test`, not committed. Do not apply or deploy this patch without inventory/reconciliation and explicit approval. The existing locked Owner preview in `HC PR63 Isolated Staging` remains untouched. [Combined CI 43356076149](https://github.com/Tawgod/Lightspeed/actions/runs/43356076149) **73 PASS, 0 failed** on synthetic/fake Timeclock and disposable PostgreSQL. Real first Owner identity/device attestation and real role appointment remain **Blocked**, pending independent secure commissioning.

---

## Owner staging identities, secrets and locked HTTPS preview — 2026-11-12 (latest)

**System/feature:** Hobby Corner first Owner login pre-enrollment. **Status:** Database and app **Deployed in isolated staging**; restricted-credential and HTTP/denial tests **PASS**; **real Owner login not enabled / not commissioned**.

**Actual Railway source of truth:** `HC PR63 Isolated Staging` project `5b46096d-3178-47ec-ba88-d5037696346a`, `staging` environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`.
- Owner database: new PG18 `Postgres-x8Ui` service `5c4498e4-cffb-4224-916a-af57391d1cd9`, volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`, deployment `51d04bf4-0f3e-4716-ba17-8e756a1bc1be` **SUCCESS**, private network only, `hc_owner_stage_test` with nine reviewed tables, no Owner activations.
- Owner runtime/operator NOLOGIN groups prepared by [PR #65](https://github.com/Tawgod/Lightspeed/pull/65). Separate *password-locked* LOGIN identities `hc_owner_stage_runtime` and `hc_owner_stage_operator` created through [draft PR #66](https://github.com/Tawgod/Lightspeed/pull/66) code `87d180ebb9f0cd7f5e7e7bf96b284b53d108f99d`, one-off deployment `dd1982ec-11af-4e0a-9c32-3edd812b4061` **SUCCESS**. At that step, both passwords were NULL, zero activations.
- **Secrets:** Verified Railway `secret(48)` variable generation and same secret fingerprint across **two** isolated redeploys, then deleted the disposable probe. Generated independent 48-character runtime password and Owner app signing/session/throttle/passkey/approval/MFA and dedicated Timeclock stage secrets on the `hc-owner-staging` service. Generated **separate operator password only on the Postgres-x8Ui service**, not on the web app. A distinct 32-byte Base64 TOTP encryption key was generated. No credential value was printed in logs, chat or committed to Git.
- Credentials commissioned by [draft PR #67](https://github.com/Tawgod/Lightspeed/pull/67), pinned code `c66876dda8d2b93b5e806d61305f1f458d911120`, one-off private Railway deployment `d6893a1f-29a1-4df8-9199-819a65f87bee` **SUCCESS**. Exact success log `HC_OWNER_DB_CREDENTIALS_OK runtime=true operator=true wrong_password_denied=true activations=0`: actual SCRAM-SHA-256 role login, the production-equivalent read-only DB privilege preflight under the restricted runtime, forbidden operator TOTP/consume and forbidden runtime grant writes, incorrect-password rejection. Focused CI [43305401275](https://github.com/Tawgod/Lightspeed/actions/runs/43305401275) **SUCCESS**. Privileged one-off runner **deleted** after verifying source, SQL and logs.
- Owner web preview service `hc-owner-staging` `3a8f9555-90e5-4bc2-bb63-4f48d8c852d0`, Railway deployment `c97a3939-8372-4412-b2b7-c89ec8c9e610` **SUCCESS**, pinned [draft PR #68](https://github.com/Tawgod/Lightspeed/pull/68) source `60cefaf71d7b737753728f95f8474df17e99912c`. Preview URL **`https://hc-owner-staging-staging.up.railway.app/owner-setup/`**. Same origin/RPID reserved for future stage passkey. Runtime connects only as `hc_owner_stage_runtime` via generated reference URL, performs live DB privilege preflight before serving. The page explicitly does not accept login. `/health` returns `ready:false,locked:true`; PIN/passkey/Owner routes HTTP **423**. No production Timeclock calls, public role grants, activation token, PIN or factor.
- CI [43306590232](https://github.com/Tawgod/Lightspeed/actions/runs/43306590232) **SUCCESS** for locked app source/preflight; [43307211049](https://github.com/Tawgod/Lightspeed/actions/runs/43307211049) **SUCCESS** for actual Railway HTTPS read-only smoke (locked UI, health, fake PIN/passkey/Owner header 423, unknown route 404). Supporting bootstrap CI [43307210828](https://github.com/Tawgod/Lightspeed/actions/runs/43307210828) SUCCESS. Latest test-only source head `6bdee3564bd2487ce1affec6680908b7872da845`, deployed runtime stays pinned to `60cefaf7...`.
- Railway read-back: Owner web service, Owner PG, foundation Store Operations and its separate PG **online**, no pending patch; the original obsolete `HC Owner Security Staging/test` 55-change patch remains **staged/unapplied**. Production Timeclock continues approved default-disabled `a595fd3` deployment `5c08d15e`, no production DB migration or Owner variables/role activated.

**Remaining Owner-presence/approval gates (not included in staging scope):** Review and expressly approve `timeclock/db/hc_owner_stage_login_limits.sql` additive production Timeclock throttle schema against backup; commission matching dedicated server-to-server secret and exact canonical active employee allowlist privately in Timeclock, leaving Owner permissions narrow; switch isolated Owner staging app from **locked preview** to existing real `staging/owner-security-server.js` only after DB/identity/preflight and URL/CSRF tests; issue first Owner single-use 10-minute activation from an interactive private operator terminal; have owner use existing PIN on trusted staging HTTPS, physically register passkey and Google Authenticator, then acceptance of revocation/replay and recovery. Passkeys are RP-ID-specific: staging enrollment cannot be treated as a credential on the future `timcorp-projects.com` origin; production requires separately authorized enrollment.

**Safety:** No actual Owner created, no PIN collected, no activation issued, no employee/customer records copied, no real Lightspeed/Discord operations, no Chrome extension change, no production schema/Timeclock enablement, no central gateway/DNS change. The Owner preview does **not** imply that sign-in is available. Secret values must stay in protected Railway configuration/private operator control.

---


## Dedicated Owner database / privilege bootstrap complete — 2026-11-12

**Owner-approved scope:** Isolated Owner database provisioning and restrictive access groups, without deploying Owner web login or touching production.

**Status:** Database **Deployed**, initial schema & NOLOGIN privilege groups **Testing PASS**; real Owner login **In Development / not deployed**.

- **Database:** New independent Railway PostgreSQL 18 `Postgres-x8Ui` service `5c4498e4-cffb-4224-916a-af57391d1cd9`, deployment `51d04bf4-0f3e-4716-ba17-8e756a1bc1be` **SUCCESS**, isolated `HC PR63 Isolated Staging/staging` project `5b46096d-3178-47ec-ba88-d5037696346a`, environment `46b93c76-3085-4e76-a37d-90dfdd250dd2`, separate durable volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`, **no public domain/TCP proxy**, no production data. Separate from the existing Store Operations staging database.
- **One-shot migration:** [draft PR #65](https://github.com/Tawgod/Lightspeed/pull/65), source `feature/owner-db-isolated-bootstrap-20261112@81d23862428ceb3e35dafa32f575e7ab9135e2b5`. Its safety CI [43297855881](https://github.com/Tawgod/Lightspeed/actions/runs/43297855881) SUCCESS. A disposable private-network Railway runner pinned to exact source/environment applied six reviewed Owner schema files + `db/hc_owner_staging_privilege_groups.sql` under `hc_owner_stage_test`, verified **9 required tables, 2 NOLOGIN privilege groups, 0 activations**. Exact read-back success log `HC_OWNER_DB_BOOTSTRAP_OK tables=9 nonlogin_groups=2 owner_activations=0`, deployment `bf0cde18-9384-4d20-8ffe-577dcdea4bb2` SUCCESS.
- **Privilege separation:** The runtime group cannot create/delete an activation, alter employee/digest/expiry, or read operator secret; it can read/consume approved activation columns. The operator group can issue a first activation but cannot read TOTP or consume it. Both groups have NOLOGIN, no SUPERUSER, no CREATEROLE, no CREATEDB. PUBLIC DB CONNECT and schema CREATE revoked; no real employee account data, PIN, passkey or seed in DB. No LOGIN role or reusable password created yet.
- **Cleanup:** The temporary DB provisioner `hc-owner-db-bootstrap` service `6d29f944-e322-44c6-ac72-74904b3153cc` was deleted after confirming success, removing its temporary root database URL reference. The database and volume remain SUCCESS; existing Store Operations staging deployment `4cae33bf-1569-4b2d-90a0-2aee9e5de55e` unchanged and healthy. No staged patch remains in the active foundation staging project.
- **Old Owner staging patch:** The separate original `HC Owner Security Staging/test` project still has the **55-change STAGED patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28`**, containing a not-configured app and another proposed Postgres. Not committed. **Do not apply or duplicate it**; future Owner app can join the now-ready staging project and access the new Owner DB over private networking, after resolving protected runtime/operator credentials.
- **Remaining:** Separate private LOGIN roles/password custody, exact canonical real Timeclock employee ID, independently protected integration credentials, production Timeclock **additive throttle SQL** (still unapplied), staging app HTTPS/RP ID and data-role preflight, operator-only 10-minute activation, real device passkey and Authenticator. The production Timeclock Owner-verifier code remains deployed **disabled** as previously authorized. No production DB migration, live Owner permission or Timcorp gateway changes.

**Manager next:** Prepare private LOGIN role/secret handoff and run read-only runtime/issuer permission tests using those logins. Request approval for the distinct production Timeclock rate-limit SQL only when staging ID/secret path is ready. Owner activation must be performed interactively by the owner on their own device and verified employee account. Details: [PR #65](https://github.com/Tawgod/Lightspeed/pull/65) `docs/OWNER_STAGING_DB_ISOLATED_BOOTSTRAP.md`.

---


## Timeclock code-only release completed — 2026-11-12

**Verified:** **Deployed (production Timeclock code only)**; Owner endpoint intentionally **Disabled**; Owner staging application and real Owner account **Not Deployed / Not Commissioned**.

- **Approval and exact scope:** Owner explicitly approved default-disabled Timeclock PR #59 code-only production release. Railway `Hobby Corner / production` staged patch `20177311-bc46-41cb-b9c6-05b6760a9a6f` was rechecked before commit: exactly **two** changes, both on Timeclock `dd3469bd-5fce-43bc-b9f9-7aa2a7806457` source, branch to `feature/owner-timeclock-scoped-credential-20261110` and pinned SHA `a595fd336c5a38dcc5ab5423a8967698777c0929`. No destructive patch, no other resources.
- **Action performed:** Railway `accept_deploy` committed that patch. **New production Timeclock deployment `5c08d15e-7341-43d9-83bb-a1d495df9e16` SUCCESS**, exact git SHA `a595fd336c5a38dcc5ab5423a8967698777c0929`; runtime log reports `Timeclock listening on port 8080`. Railway health overview Timeclock **online**, 0 warnings and 0 critical alerts. Deployment rollback currently available.
- **Unchanged production:** `special-orders-test` deployment `201d651f-62b6-43c5-aba3-59fd97f6fe09` and `lightspeed-api` deployment `288d5089-62d4-4f22-9c7f-8fdd26d8574d` remain SUCCESS on consolidated git `014a7a949fe570b756b48d8f59995c1b0a434859`. Production patch is now **null/empty**, no pending work. Previous Timeclock commit `014a7a9` is available as rollback deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557` (now REMOVED, `canRollback=true`).
- **Deliberately not activated:** All `OWNER_STAGING_*` environment variable names remain **absent** on Timeclock; `OWNER_STAGING_IDENTITY_ENABLED` is not `true`. New routes are installed in code but return 403 for missing config even before DB. No `hc_owner_stage_login_limits` SQL was applied, no credentials or real employee ID were set, no Owner role/passkey/Authenticator was enrolled. Existing Scanner/PIN endpoints and credentials unchanged.
- **Automated tests:** GitHub [Owner Timeclock 42885171115](https://github.com/Tawgod/Lightspeed/actions/runs/42885171115) and [Scanner regression 42885171145](https://github.com/Tawgod/Lightspeed/actions/runs/42885171145) SUCCESS on the deployed exact commit. Railway health/readiness PASS. No authenticated live Scanner or Timeclock employee integration test was performed after deployment, and that is a separate verification boundary.
- **Pending next gate:** Owner staging database/schema and dedicated least-privilege runtime/operator PostgreSQL credentials + HTTPS origin and own security secrets; later **separately authorized** additive production throttle schema migration and default-off dedicated Timeclock credentials/employee binding; final private first Owner one-use passkey and Authenticator enrollment. Review existing 55 staged changes on `HC Owner Security Staging / test` before any commit. No production Owner access or Timcorp gateway change.

---


**Last verified:** 2026-11-12  
**Status:** Timeclock code Deployed; Owner login In Development / Testing — real account not commissioned

## Source
- **Repository:** `Tawgod/Lightspeed`.
- **Timeclock first-Owner verifier:** [draft PR #59](https://github.com/Tawgod/Lightspeed/pull/59), `feature/owner-timeclock-scoped-credential-20261110@a595fd336c5a38dcc5ab5423a8967698777c0929` (seven changed paths, 12 commits ahead/0 behind consolidated production).
- **Owner staging setup:** [draft PR #60](https://github.com/Tawgod/Lightspeed/pull/60), `feature/owner-staging-scoped-timeclock-adapter-20261110@6b6498a01d0cfca42db273f00e97680d140a6ccb` (original tested implementation). New docs-only runbook commit `64abf052c35bcb3f4aa766eef29e04dfd698e52f`.
- **Shared web/security base:** [draft PR #63](https://github.com/Tawgod/Lightspeed/pull/63), active isolated zero-grant staging guard; **does not include Owner login**.
- **Coordinating handoffs:** `handoffs/employee-admin-security.md`, `handoffs/shared-web-foundation.md`, `handoffs/hobby-bot-security-enrollment.md`.

## Implemented
- Default-disabled additive Timeclock Owner staging identity API with **independent server-to-server secret**, exact real active employee allowlist, no synthetic 901, PIN unchanged, persistent global throttle and separated Scanner auth.
- Standalone Owner staging server, exact origin/WebAuthn relying-party check, restricted signed staff session, first Owner operator-only one-time activation issuer, actual passkey enrollment and Authenticator/TOTP candidate using existing encrypted factor stack, no automatic owner role from browser flags or user PIN alone.
- Source-reviewed schema to create an isolated owner staging database and separate NOLOGIN runtime/operator groups, with read-only privilege preflight. Migration and credential issuance **not run**.
- New release checklist: `Tawgod/Lightspeed:feature/owner-staging-scoped-timeclock-adapter-20261110/docs/OWNER_SETUP_EXECUTION_CHECKLIST_20261112.md`.

## Tested
- **Automated:** PR #59 GitHub Actions Owner Timeclock `42885171115` and Scanner regression `42885171145` SUCCESS. PR #60 Owner scoped Timeclock adapter `42885210169` and Scanner `42885210127` SUCCESS. Existing synthetic DB tests include PostgreSQL 16/18, signed mock staff, factor and operator approval boundaries. They do not commission actual Owner identity.
- **Real-timeclock/browser/hardware:** Not done. Actual real Timeclock employee ID and passkey hardware not used; no actual Owner factor stored.
- **Database recovery evidence:** Prior operator reported a successful disposable PG18 restore (54 tables) from encrypted production archive, and exact matching external USB SHA-256. Passphrase custody reported in password manager. Google Drive copy was user-reported, not independently confirmed by file metadata/checksum; do not claim cloud copy verified.

## Deployed
- **Production Timeclock:** Existing running deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557`, consolidated source commit `014a7a949fe570b756b48d8f59995c1b0a434859`, deployed November 4, 2026, still **SUCCESS**, `canRollback=true`.
- **Timeclock source patch:** Railway `Hobby Corner/production`, `20177311-bc46-41cb-b9c6-05b6760a9a6f` remains **STAGED, NOT APPLIED**, exactly two changes: Timeclock source branch -> PR #59 and pinned source commit `a595fd3`. No destructive changes, no changed secrets, database, other services or deployment in this run. Current production Timeclock variable names contain no `OWNER_STAGING_*` settings; Owner route must remain disabled.
- **Owner dedicated isolated staging:** Railway `HC Owner Security Staging/test`, project `2b350cde-048e-4402-bd92-4e8ba6c9f877`, environment `db9d6e8c-bb03-441b-a154-80c11536dfbb`. `55` staged non-destructive changes (Owner app/PG18/volume), **zero deployed instances**. Applying entire patch without separate DB roles/schema/secrets would deliberately fail app startup. No Owner staging HTTPS link exists yet.
- **Public Timcorp:** `timcorp-projects.com/HobbyCorner` remains inactive; no Owner hostname configured.

## Shared dependencies
- Real existing active canonical Timeclock employee identity and unchanged PIN (never ask for PIN in chat); authenticated independent scoped server integration from production Timeclock only after approved code and dedicated schema/credentials.
- New isolated HTTPS staging hostname and exact WebAuthn RP ID, independent signing/session/MFA/TOTP keys and approved least-privilege runtime/operator DB roles. The Owner staging app expects **root-origin** routes; the `/HobbyCorner` path is a separate future integration. WebAuthn credential enrolled on Railway staging hostname **will not automatically work on** `timcorp-projects.com`.
- Owner private operator terminal, independent single-use 10-minute activation, real device passkey and Google Authenticator, recovery plan.
- Preserve production Timeclock/Scanner, Lightspeed, Discord and Store Operations while isolated Owner is tested.

## Remaining blockers
- Production Timeclock release is still stage-only, despite earlier narrowly scoped code-only approval discussion. **No action to apply production changes without deployment-specific explicit confirmation**, verified backup/rollback and a one-service patch preflight.
- PR #59 additive global-login-throttle table is unapplied; enabling Owner identity requires separately authorized SQL on production Timeclock with backup/recovery.
- Owner staging project patch is not deployable as currently configured: no isolated database/runtime-role/grants, HTTPS origin, private secrets or verified canonical employee binding.
- No actual physical passkey/TOTP enrollment; first Owner not yet established; no production Owner permission.
- No shared Timcorp path integration for Owner sign-in; RP ID and cookie/CSRF same-origin review pending.

## Decisions needed
1. Confirm **Timeclock-only code-only release** of exactly PR #59 at pinned SHA `a595fd3`, leaving Owner endpoint disabled and applying **no** SQL or Owner secrets/roles. Production change with backup/rollback boundary.
2. Independently approve isolated Owner staging database/schema/privilege/secrets setup, then app deployment.
3. Privately select exact canonical active Timeclock employee ID and physical passkey/Authenticator; no PIN, ID or activation token in public chat or source logs.
4. Owner-presence ceremony / recovery procedure and future production Owner commissioning approved independently.

## Recommended next action
- Ask for the specific code-only Timeclock deployment confirmation; then apply only the two-field staged patch and read back Timeclock health, deployed commit, Scanner behavior and unchanged Special Orders/Labels deployments. The existing rollback candidate is deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557`.
- After that, provision Owner isolated DB independently of the app and coordinate the private real identity/device setup, never activating fake Owner credentials or production Owner permissions.

## Restrictions / safety
No production deployment, SQL migration, employee identity read, PIN change, fake Owner assignment, passkey/TOTP enrollment, service credential issuance, Railway patch commit, web gateway/DNS or Chrome release occurred during this read-only preflight.

## Documentation
- `docs/OWNER_LOGIN_STAGING_RELEASE_PLAN.md` and `docs/OWNER_STAGING_SETUP_READINESS.md` on PR #60.
- `docs/OWNER_SETUP_EXECUTION_CHECKLIST_20261112.md` on PR #60.
