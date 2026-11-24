## 2026-11-24 — Both credential variables verified; commissioning-only patch staged

After initial missing-variable discrepancy, live Railway describe_service confirms both HC_SECURE_DB_RUNTIME_PASSWORD and HC_SECURE_DB_OPERATOR_PASSWORD names on private offline service (12 variables total). No values retrieved. Latest deployment d2c2c5f4-050f-414c-978d-fbef6f5a6d99 SUCCESS at tested commit f8ecc09a7eb9ceba3d84eba7c7294b0fa4e3caed, inert start, restart NEVER, no public domain/TCP. Password format and independence will be validated by runtime preflight; not yet verified.

Staged patch 8a1dc924-b17a-4793-a72f-b9b42968fd76 exactly three non-destructive config changes on hc-secure-db-bootstrap-once only: HC_SECURE_CREDENTIAL_COMMISSION_ONLY=true, HC_SECURE_DB_MUTATION_APPROVED=HC_SECURE_CREDENTIALS_ONLY, start node scripts/commission-hc-secure-db-credentials.mjs. Explicitly requested schema and role flags false (unchanged, no diff). No shared changes. Await explicit approval for this patch before deploying. Actual operation sets SCRAM credentials for both previously locked roles, tests separate logins and permissions, denies wrong password, relocks on verified failure; uncertain commit requires manual review. Expected HC_SECURE_CREDENTIALS_OK runtime=true operator=true wrong_password_denied=true activations=0. No new live DB writes, no production/original Owner changes, auth remains disabled. After success disarm provisioner and plan least-privilege secret placement/removal of temporary root access.

---

## 2026-11-24 — Hardened disposable PG18 credential test PASS; secret entry gate

Operator supplied HC_SECURE_DISPOSABLE_CREDENTIALS_OK postcommit_relock=true scram_logins=true bad_password_denied=true final_roles_locked=true owner_activations=0 after 10/10 unit tests. Fresh container ID supplied; cleanup not independently verified. Verified Railway offline service remains inert (ca231cb7-6470-4c82-8d9f-ee9ae43b3c6c SUCCESS), no public domains/TCP, restart NEVER, no new credential variables. Staged ONLY source pin f8ecc09a7eb9ceba3d84eba7c7294b0fa4e3caed, patch e9aac456-41bb-4cc5-bf9d-2f789e002497, one non-destructive change. Inert command and mutation flags unchanged. Next user enters two independently generated 48 ASCII alphanumeric passwords directly in Railway offline service Variables as HC_SECURE_DB_RUNTIME_PASSWORD and HC_SECURE_DB_OPERATOR_PASSWORD; leave pending changes unapplied, never paste values into chat or retrieve rendered variables. Then verify staged names and exact scope, add commissioning-only command/flags and request explicit approval for complete patch. No live credential writes or secret retrieval yet. Root reference temporarily retained. Production and original Owner untouched.

---

## 2026-11-24 — SCRAM hardening unit regression PASS

Operator reports all ten credential commissioning tests passed after syntax correction f8ecc09a7eb9ceba3d84eba7c7294b0fa4e3caed. Real PG18 integration rerun still required with fresh disposable container, synthetic credentials only, localhost port 15489, cluster hc-secure-credentials-disposable-pg18, database hc_owner_stage_test. Existing scripts/test-hc-secure-credentials-disposable.mjs verifies real SCRAM logins, bad password denial, postcommit relock and final locked roles. Offline Railway provisioner last verified inert; no real passwords entered, no new deployment or SQL writes authorized. Next obtain disposable test marker, then prepare controlled credential commissioning. Production untouched.

---

## 2026-11-24 — SCRAM test load failure corrected

Operator reported Node test file failed to load (one failed file, zero individual cases passed). Inspected GitHub source and found assistant-authored replacement string interpreted dollar-apostrophe as JS replacement suffix, duplicating script and corrupting syntax. Rebuilt from prior good source 5877c6e5039bc70325c188489bd1e52574403b66 using function replacement and explicit slices; verified single commissioning export and correct SCRAM return string. Fix commit f8ecc09a7eb9ceba3d84eba7c7294b0fa4e3caed. Retest required; no claim of execution or success. Offline provisioner remains last verified inert; no real credentials entered or deployment changed. Next run syntax checks and ten-case unit suite, then disposable PG18 login/relock verification before credential staging. Production untouched.

---

## 2026-11-24 — Offline provisioner disarmed; SCRAM hardening authored

User approved disarm and confirmed two new passwords prepared privately; no values shared. Applied exact approved three-change patch 6a6326d1-8c01-48e6-be5d-65b6da5aa69b. Deployment ca231cb7-6470-4c82-8d9f-ee9ae43b3c6c SUCCESS, runtime HC_SECURE_OFFLINE_PROVISIONER_DISABLED. No SQL mutation by inert command. Root reference temporarily retained; no new password variables staged.

Development branch feature/hc-secure-staging-readiness-20261123: commission script commit 52dc1e2f27436d290324fcb6e976b70c8e5c99c5 uses random-salted PBKDF2-SHA256 SCRAM verifier construction client-side, never plaintext in ALTER ROLE SQL, transaction-local SQL log suppression before writes. Verifiers still sensitive, no universal guarantee against external logging. Regression tests commit 0165b16fff30d4b9a17bf77fd5f4ccdc8605843c adds three tests (10 total). Not run yet; require node --test tests/hc-secure-credential-commissioning.test.mjs and fresh disposable PG18 real login/relock test before actual secrets entered. Existing disposable test script uses synthetic passwords and checks final roles locked. No deployment of hardening, no actual password writes. Next obtain test results; then safely stage commissioning configuration and user-entered Railway secrets, review and separate explicit deployment approval. Production/original Owner untouched.

---

## 2026-11-24 — Restricted roles SUCCESS; credential preparation and disarm staged

Railway deployment 8d74c988-bda8-4981-94fa-ec60a092d9e0 SUCCESS, verified runtime HC_SECURE_LOCKED_ROLES_OK count=2 passwords_set=false, zero returned build errors. Two restricted LOGIN roles with NULL passwords and separate memberships verified before COMMIT; success marker after COMMIT. No credentials or activations created. Offline service private, restart NEVER, source pin 5877c6e5039bc70325c188489bd1e52574403b66. No independent postcommit catalog read yet.

Staged patch 6a6326d1-8c01-48e6-be5d-65b6da5aa69b, exactly three non-destructive changes on offline service only: HC_SECURE_ROLE_PREPARE_ONLY=false, HC_SECURE_DB_MUTATION_APPROVED=DISABLED, inert start command node -e "console.log('HC_SECURE_OFFLINE_PROVISIONER_DISABLED')". Await explicit approval to apply disarm. Live role-only configuration remains until applied; no restart/redeploy of old command. Root reference retained temporarily for next approved commissioning. No credential inputs yet.

Credential preflight requires two unique 48 ASCII alphanumeric passwords distinct from root; owner should generate in password manager, retain securely, never share in chat, later enter in exact offline service Railway variables. Review/harden commissioning SQL logging risk before any real password writes: current script constructs plaintext ALTER ROLE statements; potential server error statement logs despite sanitized app logs. Prefer verified logging safeguards or client-generated SCRAM verifiers with real disposable tests. No commissioning deployment or secrets staged. Production/original Owner untouched. Next: disarm approval and secure credential preparation, code hardening and tests, separate commissioning approval. 

---

## 2026-11-24 — Approved locked-role deployment triggered

User explicitly approved five staged changes, revalidated exact patch 1cfeb83a-d5e7-4149-a219-f305b64197d9 (non-destructive Railway config, only offline service), accepted committed=true. Deployment 8d74c988-bda8-4981-94fa-ec60a092d9e0 at 5877c6e5039bc70325c188489bd1e52574403b66 BUILDING at last check, no runtime marker yet, zero returned build errors. Schema flag disabled; role-only operation enabled; no passwords configured by operation. Next verify exact runtime HC_SECURE_LOCKED_ROLES_OK count=2 passwords_set=false; if failure inspect before retry. Reviewed credential commissioning preflight: requires independent 48 ASCII alphanumeric runtime/operator passwords distinct from root, exact service/environment and separate sentinel. No password generation, retrieval or staging yet; need secure operator input via Railway without chat disclosure and separate commissioning approval. No production or original Owner modifications. Do not redeploy role command after success; disarm or switch under explicit authorization.

---

## 2026-11-24 — Restricted-role tests operator-reported PASS; role-only patch staged

User reported all tests passed in response to six-case locked-role suite; no raw summary independently collected. Reverified schema deployment ecf6fcd7-16dd-4abd-9d10-2f107502aad9 SUCCESS and runtime HC_SECURE_SCHEMA_BOOTSTRAP_OK tables=9 nonlogin_groups=2 no_logins=true activations=0. Offline service private, restart NEVER. Reviewed corrected role script at 5877c6e5039bc70325c188489bd1e52574403b66.

Staged patch 1cfeb83a-d5e7-4149-a219-f305b64197d9 contains exactly 5 non-destructive config changes exclusively hc-secure-db-bootstrap-once: pin 5877c6e5039bc70325c188489bd1e52574403b66, start node scripts/prepare-hc-secure-locked-roles.mjs, HC_SECURE_DB_BOOTSTRAP_ONLY=false, HC_SECURE_ROLE_PREPARE_ONLY=true, HC_SECURE_DB_MUTATION_APPROVED=HC_SECURE_LOCKED_ROLES_ONLY. Credential commission flag remains disabled; no other resources/shared variables. Applying intentionally creates two restricted LOGIN roles with PASSWORD NULL and separated privileges; no Owner activation or credential commissioning. Await explicit approval to deploy exact five changes. Verify actual commit and runtime HC_SECURE_LOCKED_ROLES_OK count=2 passwords_set=false. If failure or ambiguous COMMIT, inspect state before retry. Previous live schema-only configuration still active until patch applies; do not redeploy old command. No new SQL writes or deployment this checkpoint, no secret retrieval, no production/original Owner modifications.

---

## 2026-11-24 — Corrected live schema initialization SUCCESS; role isolation fix pending tests

User explicitly approved four-change schema retry patch f7ff6ae8-5f69-4373-a96a-f91a767bb69a. Revalidated exact non-destructive Railway config patch only on offline service, accepted committed=true, deployment ecf6fcd7-16dd-4abd-9d10-2f107502aad9 at corrected source 3e60a0950886a1469479b4b99e2f1896bcc6d6ac. Live Railway logs independently show SUCCESS and HC_SECURE_SCHEMA_BOOTSTRAP_OK tables=9 nonlogin_groups=2 no_logins=true activations=0; zero returned build errors. New isolated database and nine tables/two nonlogin groups now provisioned, no runtime/operator login accounts or Owner activation. Success marker emitted after SQL COMMIT; no separate postcommit DB readback yet.

Source-only next milestone: corrected prepare-hc-secure-locked-roles.mjs (9fba23a9041bd597b9c436dd18e9929a4806f96b) to require role-only true, schema-only false, credential-only false; reused schema scope validation on a local copied object only. Updated tests (5877c6e5039bc70325c188489bd1e52574403b66) for conflicting flags and nonmutation of environment. Six tests NOT RUN; run node --test tests/hc-secure-locked-roles.test.mjs in current Codespace branch after git pull --ff-only. No role preparation or credential commissioning executed. Offline service still configured for schema writes with restart NEVER; do not redeploy this command. Next stage disarm or switch to exclusively role-only command/flags after testing and explicit approval. Public auth disabled; original Owner and production untouched. No secrets retrieved.

---

## 2026-11-24 — Recovery read-only PASS; corrected schema retry staged

Recovery deployment 786eb720-67e0-4cc0-b383-810b30db698d SUCCESS, verified runtime HC_SECURE_ROOT_READY=true read_only=true target_absent=true roles_absent=true root_empty=true. Confirms failed bootstrap left no target DB, matching roles or user relations in initial DB. New PG SUCCESS. Production health readback all seven services online/SUCCESS, zero issues/recent failures, no pending work. Auth staging placeholder remains FAILED/intentionally disabled.

Verified corrected source at 3e60a0950886a1469479b4b99e2f1896bcc6d6ac contains both nested array binding fixes; operator reported 7/7 tests. Staged patch f7ff6ae8-5f69-4373-a96a-f91a767bb69a exactly four non-destructive Railway configuration changes exclusively offline bootstrap service: explicit corrected commit pin, schema startup command, schema-only flag true, schema-only approval sentinel. No shared variables or other resources. Applying intentionally executes schema SQL writes; no application of patch yet. Obtain explicit approval to deploy corrected retry, verify actual deployment commit and runtime HC_SECURE_SCHEMA_BOOTSTRAP_OK tables=9 nonlogin_groups=2 no_logins=true activations=0. On failure inspect before retry; no automatic drop/reset. Then disarm or separately authorize locked-role preparation after correcting conflicting flag guard. Original Owner and production untouched; no credentials exposed.

---

## 2026-11-24 — Schema bind regression PASS; recovery read-only deployment triggered

Operator supplied seven passing bootstrap tests, zero failures/skips (166.069108ms). User explicitly approved three disarm/recheck changes. Revalidated exact patch 5f478adf-9a94-4779-872a-2fad2e4f1349, only offline service, non-destructive; applied with committed=true. Current deployment 786eb720-67e0-4cc0-b383-810b30db698d BUILDING; no inspection marker yet. Live config readback shows read-only start command and NEVER restart; no staged changes. Note source config still reports pin 2a337447461b209c66aada04a24cffc062aa6ac3 whereas new deployment metadata reports 3e60a0950886a1469479b4b99e2f1896bcc6d6ac; resolve exact source pin before schema retry, do not assume branch changes are deployed solely from config. No schema retry or additional writes executed. Next verify exact runtime HC_SECURE_ROOT_READY marker, then stage corrected schema-only retry at explicit reviewed source pin and request separate approval. Production and original Owner untouched.

---

## 2026-11-24 — Schema bootstrap failed before database creation; bind fix authored

Approved schema patch 9eada70c-99ed-418f-98bc-bd2de016a927 applied, deployment f8a1b9a2-de36-49c4-b9e2-8d35a22b3845 CRASHED, runtime HC_SECURE_SCHEMA_BOOTSTRAP_BLOCKED, zero returned build errors. New PostgreSQL still SUCCESS. PostgreSQL log 15:01:17.986 UTC identifies ERROR bind message supplies 4 parameters, but prepared statement requires 1, STATEMENT SELECT rolname FROM pg_roles WHERE rolname=ANY($1::text[]). This is the pre-CREATE DATABASE role check; code order strongly indicates failure before any schema writes, but independently recheck root state before retry. Two incorrect flattened arrays corrected in bootstrap script commit e6dee01ea3f71b790e048eecbc6f3da6221989c5; full-path mock regression verifies parameter shape at both checks in commit 3e60a0950886a1469479b4b99e2f1896bcc6d6ac. New tests NOT RUN; previous mock tests missed binding error. Credential commissioning and locked-role scripts use nested arrays correctly in inspected queries. Separate future issue: locked-role script currently requires schema flag true via reused scope guard; refactor before enabling that milestone.

Staged ONLY patch 5f478adf-9a94-4779-872a-2fad2e4f1349, 3 non-destructive changes exclusively offline service: restore tested read-only root probe start command, bootstrap flag false, mutation approval DISABLED. Still pinned prior tested commit 2a337447461b209c66aada04a24cffc062aa6ac3. Await explicit approval to deploy disarm/recheck patch; live crashed service still has old write configuration, restart NEVER; do not redeploy until disarmed. Codespaces run git pull --ff-only and node --test tests/hc-secure-staging-bootstrap.test.mjs (7 expected). No schema retry or role creation authorized/executed this checkpoint, no original Owner or production change. After read-only PASS and regression PASS, prepare corrected schema-only retry for separate explicit approval. No credentials exposed.

---

## 2026-11-24 — Schema-only initialization prepared; approval required

Reviewed bootstrap-hc-secure-staging-db.mjs at exact deployed offline source 2a337447461b209c66aada04a24cffc062aa6ac3. Prior live root read-only inspection PASS; service private, restart NEVER, root connection reference working, no pending work before staging. Staged patch 9eada70c-99ed-418f-98bc-bd2de016a927 with exactly 3 changes exclusively on hc-secure-db-bootstrap-once: start command node scripts/bootstrap-hc-secure-staging-db.mjs, HC_SECURE_DB_BOOTSTRAP_ONLY=true, HC_SECURE_DB_MUTATION_APPROVED=HC_SECURE_FRESH_DB_SCHEMA_ONLY. Railway classifies patch non-destructive, but applying it intentionally executes SQL writes: new hc_owner_stage_test DB, seven fixtures/nine tables/two NOLOGIN privilege groups, no login roles or Owner activation. No deployment or DB write yet. Existing source tests and disposable SQL tests previously passed; actual schema bootstrap not yet run. CREATE DATABASE cannot roll back; failed or ambiguous operation requires inspection, never blind retry/drop. Keep auth disabled, role preparation and commissioning separate. Obtain explicit approval to apply exact three changes, then check runtime marker HC_SECURE_SCHEMA_BOOTSTRAP_OK tables=9 nonlogin_groups=2 no_logins=true activations=0. After execution disarm write flags/start command before unrelated deployment; remove privileged root reference when no longer needed. No changes to original Owner or production.

---

## 2026-11-24 — Live read-only root inspection PASS; production health verified

Railway HC Secure/staging deployment 1074dbfe-3faf-48f7-a98e-95e43bc83b8b SUCCESS, pinned 2a337447461b209c66aada04a24cffc062aa6ac3. Runtime log independently confirms HC_SECURE_ROOT_READY=true read_only=true target_absent=true roles_absent=true root_empty=true. Zero build errors in returned logs. New PG SUCCESS, auth placeholder FAILED (intentionally inactive; exact failure cause not verified), no pending patch. Root reference remains configured in offline service; no schema or roles created by probe.

Production read-only health check: Hobby Corner/production c562fbb2-8431-4beb-834d-6938b3a2ad10, all seven services online/SUCCESS (timeclock, Discord bot, store-map, lightspeed-api, special-orders-test, Rewards, Postgres), zero reported failures in default eight-hour window, zero active warnings/criticals, no pending work. Original HC PR63 Isolated Staging environment 46b93c76-3085-4e76-a37d-90dfdd250dd2: all four latest deployments SUCCESS including hc-owner-staging and Postgres-x8Ui. No new production MFA rollout; deployment health is not application-level acceptance testing.

Next: separate explicit authorization before real HC Secure schema creation. Restore inert offline command/remove root reference unless authorized next step requires it; stage only after scope review. No writes, deployment or secret retrieval performed during this health check.

---

## 2026-11-24 — Approved read-only inspection deployment triggered

User explicitly approved four staged read-only changes. Revalidated exact patch 9b1f4224-3143-448c-b594-f8e1b563f8a9, non-destructive, only hc-secure-db-bootstrap-once source pin, root URL reference, start command and NEVER restart. Accepted deployment; committed=true, deploymentStatus=triggered. New deployment 1074dbfe-3faf-48f7-a98e-95e43bc83b8b, commit 2a337447461b209c66aada04a24cffc062aa6ac3, BUILDING at last check; no runtime marker or build logs yet. No readiness result, no authorization for SQL writes. Auth remains disabled; no original Owner/production change. Next check exact deployment runtime logs for HC_SECURE_ROOT_READY=true read_only=true target_absent=true roles_absent=true root_empty=true; if blocked, diagnose safely without secret output. Restore inert command/remove root reference after inspection unless separately authorized continuation requires it. Do not claim schema created or execute bootstrap yet.

---

## 2026-11-24 — Root readiness tests PASS; private read-only inspection staged

**Testing:** Operator supplied full Node test summary: 5 passed, 0 failed/skipped, 395.624422ms. New root probe mock suite passed; actual Railway database contents NOT inspected yet.

**Railway staged only:** HC Secure/staging patch 9b1f4224-3143-448c-b594-f8e1b563f8a9, 4 non-destructive changes, solely service hc-secure-db-bootstrap-once. Pinned tested commit 2a337447461b209c66aada04a24cffc062aa6ac3; start command node scripts/check-hc-secure-pristine-root.mjs; restart NEVER; new HC_SECURE_BOOTSTRAP_ROOT_URL uses reference to dedicated new PG service POSTGRES_PASSWORD without retrieving value. Existing mutation flags and auth remain disabled; no shared variables or other resources touched. Reference resolution and password format not verified at runtime. No deployment or SQL execution in this checkpoint.

**Next:** Explicitly approve applying exactly these four staged changes for read-only inspection. Then verify deployment/log marker HC_SECURE_ROOT_READY=true read_only=true target_absent=true roles_absent=true root_empty=true. On failure, diagnose without exposing secret or enabling mutation flags. Remove root reference and restore inert command after inspection unless separately authorized next step requires it. Schema bootstrap, role creation, commissioning, Owner activation and public auth remain separate gates. Original Owner and production untouched.

---

# HC Secure — Current Handoff

**Last verified:** 2026-11-24
**Status:** In Development / Testing pending; database infrastructure Deployed

## Source
- Repository: Tawgod/Lightspeed
- Branch: feature/hc-secure-staging-readiness-20261123
- Draft PR: #77
- Current checkpoint commits: db0cad463cc5b8301d2c9180fb8c813cee460324 (read-only root probe), 2a337447461b209c66aada04a24cffc062aa6ac3 (tests).

## Implemented
- Added scripts/check-hc-secure-pristine-root.mjs, inspecting the initial railway database before target database creation. Checks exact project/environment/offline service/private host, PG18, read-only transaction, absent target database, absent HC role prefix, and no user relations in root database. Requires 48-character alphanumeric root password and disabled mutation/auth flags. No credential output.
- Five new mock tests in tests/hc-secure-pristine-root.test.mjs. Not run yet.

## Tested
- Prior disposable PG18 schema and credential suites passed per operator reports, including SCRAM login and relock.
- New root probe tests and actual private DB read-only probe NOT RUN.

## Deployed
- Railway HC Secure/staging PostgreSQL SUCCESS b4f8c17c-d23e-4efc-9e56-2f9265daf5f3, private 5GB mounted volume, no public TCP or domains.
- Offline bootstrap placeholder SUCCESS c4737662-daa6-4a53-8777-f17d9647f3ed; pinned 4484ef6b, inert command, restart NEVER, no root connection variable or public endpoints.
- Auth placeholder FAILED 2ba2ee0c-e188-41be-ac02-2c9c6ffc4ee6; inert start command and /health check coexist, likely healthcheck mismatch but exact failure logs not reviewed. No public endpoints. No pending Railway patch.
- Original Owner staging was last verified online in previous handoff; no changes made in this checkpoint. Fresh original environment lookup in preceding continuation failed due to using name rather than exact environment ID.

## Shared dependencies
- Original Owner passkey/TOTP and Timeclock; eventual new-origin enrollment and per-tool operation grants.
## Shared files / integration surfaces
- Two new source-only files; no extension changes.
## Remaining blockers
- Run five mock tests, review actual read-only connection setup, provide root URL only to offline service via secure reference (no secret in chat), pin new reviewed commit and run read-only probe separately. No DB initialization yet.
- Existing target-DB probe assumes DB already exists; new root probe bridges this gap. Root password length not independently verified. Root database emptiness check is a conservative user-relation check, not exhaustive cluster audit.
## Decisions needed
- Separate explicit authorization for DB mutation after successful read-only inspection. Keep auth disabled.
## Recommended next action
- Codespaces: git switch feature/hc-secure-staging-readiness-20261123; git pull --ff-only; node --test tests/hc-secure-pristine-root.test.mjs. Expect 5 passing. Then prepare isolated private read-only probe invocation; no write flags.
## Restrictions / safety
- No production changes, no original Owner migration, no secret values retrieved, no activation issuance or automatic retries of failed SQL bootstrap. No new Railway changes in this checkpoint.
## Documentation
- Previous handoff history retained below.

---

## 2026-11-24 — Authorized HC Secure staging infrastructure deployed

**Explicit approval:** User authorized `deploying the 44 staged HC Secure staging changes, keeping authentication and database-bootstrap operations disabled`. Fresh preflight of Railway `HC Secure/staging` showed exact 44 staged non-destructive changes, expected 3 service creates + volume create, staged `POSTGRES_PASSWORD` name, inert auth and provisioner start commands. **Executed** `mcp__Railway__accept_deploy` with environment ID `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c` and commit message `Provision isolated HC Secure staging PG18 and volume; auth and offline bootstrap remain disabled`: `committed=true`, `deploymentStatus=triggered`, workflow ID `commitChanges/8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c/60012c69-e526-4778-9422-055d705150f2`.

**Verified after deployment:** `hc-secure-postgres-staging` service `454f4979-6148-4ee5-9857-97bc793dc72d` **online / SUCCESS**, deployment ID `b4f8c17c-d23e-4efc-9e56-2f9265daf5f3`. PostgreSQL logs: `database system is ready to accept connections` on port 5432. Dedicated 5GB `hc-secure-staging-pgdata` volume `468ccb0a-3006-48b1-ac2d-f74293c7c075` **LIVE**, mounted to new PG at `/var/lib/postgresql/data`. Pending patch now `null` (all approved changes committed). Log also included a failed probe `FATAL: role "root" does not exist`; review default healthcheck/probe if persistent, not evidence that database is unhealthy.

**Other service deployment status at latest read:** `hc-secure-db-bootstrap-once` deployment `c4737662-daa6-4a53-8777-f17d9647f3ed` **DEPLOYING**; `hc-secure-auth-staging` deployment `2ba2ee0c-e188-41be-ac02-2c9c6ffc4ee6` **BUILDING**. Both source services remain configured with **inert start commands**, no DB mutation flags enabled, no active auth routes. Even if Railway later reports these as completed/failed due to one-shot processes, they are intentionally not an active authentication rollout. No TLS/DNS/custom domain attached. No security schema, Owner principal, role commissioning, first Owner activation, registered passkey or encrypted authenticator data copied or changed by this infrastructure deployment.

**Original Owner isolation verified after deployment:** old `HC PR63 Isolated Staging` `hc-owner-staging` + `Postgres-x8Ui` both **online / SUCCESS**. Original Owner passkey/TOTP/old RP ID remain undisturbed.

**Next step:** Prepare a secure offline, one-time schema/roles/credential commissioning workflow that targets *only* this new HC Secure DB and verifies actual DB host, empty schema, exact Railway project/env and passwords. Crucial: service has its **own staged disabled env** and does not yet have root connection variable or ability to execute the SQL scripts; creating a DB instance does NOT mean schema or runtime/operator accounts exist. Deploying/operating migration/role credentials requires a separate explicit user authorization and cautious credential handoff. Avoid secret values in chat/tool outputs. Do not activate public auth until new-origin WebAuthn enrolment and complete signing/TOTP secret configuration.

---

## Nov 24 PostgreSQL bootstrap password staged — deployment approval gate

**User reported “password staged”.** Independently read HC Secure Railway `staging` patch `60012c69-e526-4778-9422-055d705150f2`: `POSTGRES_PASSWORD` is now explicitly present as an encrypted-value staged variable on **only** `hc-secure-postgres-staging` (service `454f4979-6148-4ee5-9857-97bc793dc72d`). The password itself was **not retrieved** or logged, and its exact strength/48-character length was **not independently verified**. The normal live environment variable listing omits the staged setting until the patch applies; do not mistake that for missing staged secret or overwrite it.

**Current exact Railway stage:** `44` changes, `STAGED`, `destructive=false`, with 3 create services (`hc-secure-postgres-staging`, `hc-secure-auth-staging`, `hc-secure-db-bootstrap-once`) and 5GB volume. PostgreSQL image `ghcr.io/railwayapp-templates/postgres-ssl:18`, mount `/var/lib/postgresql/data`, PGDATA beneath mount, SCRAM host initialization, independent private network endpoint. Auth and one-time bootstrap services both have **inert start commands**, no live DB secret attached to either, and no operator migration/config approval; they cannot be represented as functioning authentication services even if containers are created. Auth `/health` healthcheck still exists in staged patch although inert process exits. **Do not claim app health** or new-host Owner WebAuthn usability.

**Original Owner safety readback** (HC PR63 Isolated Staging): `hc-owner-staging` and `Postgres-x8Ui` online and latest deployments SUCCESS. No original DB/password/MFA touched.

**Deployment approval gate:** `accept_deploy` applies the **entire** staged patch (not only database), initializing a new isolated PostgreSQL service but also creating disabled app/operator services. User authorized continuing isolated provisioning and subsequently staged DB password; further explicit acknowledgment of **deploying this 44-change patch** is prudent because the user has not yet explicitly approved the complete service deployment with intentionally inactive authentication, and deployment may create paid resources. After acceptance, inspect deployment/PG startup and confirm role/DB readiness without exposing secrets; schema bootstrap is a **separate one-time SQL mutation and independently authorized step**. Never deploy incomplete active auth, provision old Owner database, copy registered WebAuthn credentials or reuse TOTP encryption key.

---

## Nov 24 additional precaution — public HC Secure auth explicitly disabled in staged patch

After initial PG18/offline-service staging, proactively made the still-incomplete `hc-secure-auth-staging` **inert in the staged patch**: staged `HC_OWNER_STAGING_ENABLED=false`, start command `node -e "console.log('HC_SECURE_AUTH_DISABLED_PENDING_SECURITY_READINESS')"`, restart policy `NEVER`. This prevents accidental serving of incomplete login logic if the complete patch is later applied for isolated database setup. The original planned active authentication start `node staging/hc-secure-security-server.js` and its healthcheck are preserved **only in source/docs**, not as current staged service startup. Authentication must be deliberately re-enabled, supplied independent credentials, tested against new-host RP ID and configured with proper healthchecks when ready. The separate offline provisioning service remains inert with mutation flags disabled.

Fresh stage readback: **45 non-destructive pending changes**, 3 service creates + 5 GB volume, no deployment; new PG `POSTGRES_PASSWORD` is still absent. Even an inert service may settle as stopped/unhealthy due to `/health` healthcheck, so a later staging deployment is not yet a validated healthy auth release.

---

## Nov 24 HC Secure isolated Railway staging configuration advanced — 45 staged changes

**User authorized continuing isolated HC Secure staging provisioning.** Read complete pre-existing 23-change patch before altering Railway. Verified exact target: Railway private **HC Secure** project `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, **staging** env `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`. Original Owner production / separate Owner staging not targeted. Verified Railway's specific `ghcr.io/railwayapp-templates/postgres-ssl:18` wrapper REQUIRES volume mount `/var/lib/postgresql/data` and `PGDATA` beneath it; preserved existing 5GB volume mount (do NOT change it to official postgres:18 base image's parent path).

**Actual STAGED-only Railway changes performed (no deployment):**
- On new `hc-secure-postgres-staging` service `454f4979-6148-4ee5-9857-97bc793dc72d`: staged `POSTGRES_USER=postgres`, `POSTGRES_DB=railway`, `PGDATA=/var/lib/postgresql/data/pgdata`, `POSTGRES_INITDB_ARGS=--auth-host=scram-sha-256`, `LOG_TO_STDOUT=true`, and **private network endpoint name** `hc-secure-postgres-staging`. The required **`POSTGRES_PASSWORD` has NOT been set**; don't deploy uninitialized PG. No public TCP proxy/domain created.
- Staged new separate one-shot operator service `hc-secure-db-bootstrap-once`, ID `d0fee7d2-c050-4f67-a864-14c86eb67d2c`, source `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` **pinned commit** `4484ef6b89ed0b871d466840d6543bc192cd84fb`. **Inert, fail-closed by configuration:** startup `node -e "console.log('HC_SECURE_OFFLINE_PROVISIONER_DISABLED')"`, restart policy `NEVER`; `HC_SECURE_DB_BOOTSTRAP_ONLY=false`, `HC_SECURE_ROLE_PREPARE_ONLY=false`, `HC_SECURE_CREDENTIAL_COMMISSION_ONLY=false`, `HC_SECURE_DB_MUTATION_APPROVED=DISABLED`, `HC_OWNER_STAGING_ENABLED=false`, all synthetic login/PIN flags false, isolated-staging env. No root DB URL, roles, password or signing secrets attached. **Does not perform any DB action on boot**.
- Existing `hc-secure-auth-staging` remains staged-create with old pinned `70429b1` source; no DB/machine credentials or Timeclock secrets. Do not start active authentication until full reviewed env and RP-ID/host DNS/TLS authorization.
- Fresh `get_staged_changes` confirms patch `60012c69-e526-4778-9422-055d705150f2`, **45 STAGED, destructive=false**, resources: 3 staged-create services + 1 staged-create 5GB volume; nothing applied. **No real Railway PostgreSQL instance or schema/roles/passwords exist in this project yet.**
- Latest disposable PG18 full credential verification PASS with user-provided `HC_SECURE_DISPOSABLE_CREDENTIALS_OK postcommit_relock=true scram_logins=true bad_password_denied=true final_roles_locked=true owner_activations=0`; keep separate from Railway deployment proof.

**Blockers/next safe action:** Generate new **cryptographically random** `POSTGRES_PASSWORD` (48 ASCII alphanumeric characters to satisfy the HC Secure bootstrap/commissioning preflight), preferably in Railway sealed variables or via a user-owned secret manager; never paste it into chat, GitHub or shell history. After safely staging new DB bootstrap credential, review patch including currently incomplete auth service before any accept-deploy. The Railway accept action commits the **entire staged patch**, not only database; avoid launching incomplete auth without intentionally disabled start config or complete safe env. Stage minimal safe fail-closed auth service if needed, then deploy isolated staging if explicitly approved; **user gave broad authorization to proceed staging provisioning, but do not apply partial config that lacks essential credential bootstrap**. The offline one-shot service is not ready to run actual provisioning until DB is online, a distinct root DB URL and supervised invocation are configured and approval preflight flags are set for a single operation. Backup/secret custody/permissions and fresh new-origin WebAuthn credential enrollment remain pending. Original Owner DB/passkey/TOTP must stay intact.

---

## Nov 24 real disposable PG18 SCRAM commissioning integration PASS

**Operator-supplied exact terminal output** from `bash scripts/run-hc-secure-disposable-credentials-pg18.sh`:
```
HC_SECURE_DISPOSABLE_CREDENTIALS_OK postcommit_relock=true scram_logins=true bad_password_denied=true final_roles_locked=true owner_activations=0
HC_SECURE_CREDENTIAL_CONTAINER_CLEANUP_PENDING=true
```
**Status:** Disposable real PostgreSQL 18 credential integration **Testing PASS** (operator-provided logs). Positive SCRAM runtime/operator login, wrong-password PostgreSQL authentication denial, post-commit failure re-lock, final role PASSWORD NULL, and no Owner activations verified by script's checks. The `CLEANUP_PENDING` line is emitted before Bash `EXIT` trap; actual Docker removal has **not** been separately confirmed with `docker ps -a`, although script contains a mandatory cleanup trap. Previous seven mocked commissioning tests were operator-confirmed PASS.

**Fresh independent Railway readback after test:** New `HC Secure/staging` patch `60012c69-e526-4778-9422-055d705150f2` with 23 changes still `STAGED`; `hc-secure-postgres-staging`, `hc-secure-auth-staging`, and the volume all `staged-create`, **not deployed**. Original `HC PR63 Isolated Staging` Owner app `hc-owner-staging` and database `Postgres-x8Ui` remain **online**, latest app/database deployment **SUCCESS**. No new DB/password set, real Owner credential migration, staging web authentication or production security cutover performed.

**Next milestone / decision gate:** Before provisioning real new Railway database, reconcile staged patch to ensure PG18 service has separate secure bootstrap environment variables/secrets and supported data volume, review Railway actual PostgreSQL bootstrap behavior, provision separate offline operator service without exposing credentials to public auth, verify credentials and backups, configure new hostname DNS/TLS and new-RP-ID WebAuthn continuity. **Explicit owner authorization required before applying staged Railway changes or performing DB mutations.** Preserve existing Owner passkey, encrypted TOTP seed, old-origin authentication and DB intact until new environment is independently verified. Avoid publishing passwords or secret-containing environment listings.

---

## Nov 24 credential safety tests 7/7 PASS; real PG18 result pending

**User reported “pass 7”** following request to execute both the seven-case `tests/hc-secure-credential-commissioning.test.mjs` suite and the separate disposable PostgreSQL 18 credential integration runner. Interpret as **7/7 mock safety tests PASS (operator report)**. **The user did not supply the disposable integration result line**, so do **not** classify real PG18 credential authentication/re-lock as passed based on “pass 7” alone. Await `HC_SECURE_DISPOSABLE_CREDENTIALS_OK postcommit_relock=true scram_logins=true bad_password_denied=true final_roles_locked=true owner_activations=0` or equivalent complete test output.

**Next verification command (Codespaces Terminal 1, disposable PostgreSQL only):**
```bash
cd /workspaces/Lightspeed
bash scripts/run-hc-secure-disposable-credentials-pg18.sh
```
No original Owner database connection, Railway deployment, role/password provisioning or production change approved.

---

## Nov 24 six commissioning tests PASS; disposable real PostgreSQL credential checkpoint ready

**Operator test result:** User reported `Pass 6` after running the six `tests/hc-secure-credential-commissioning.test.mjs` mocked tests. Mark **Testing PASS (6/6, operator report; no raw log)**. Previous four credential preflight tests, 11 schema/role preflight tests and 21 general/disposable-schema tests passed.

**New source-only development** on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77):
- Added `scripts/test-hc-secure-credentials-disposable.mjs` commit `a1a626befbce21ef60f5cf30859318e549f28898`: **real disposable PostgreSQL 18** integration program with synthetic scope and guarded injected localhost adapter. Builds original 7 reviewed SQL fixtures and two PASSWORD NULL roles only in a local container; injects failure after first successful password COMMIT to verify forced re-lock; tests real SCRAM runtime and operator logins, least privileges, real PostgreSQL wrong-password error (28P01), zero Owner activations, and final re-lock.
- Added `scripts/run-hc-secure-disposable-credentials-pg18.sh` commit `66801b68b82d114b4c291dc2204196136200a0bf`: disposable `postgres:18`, tmpfs, localhost `127.0.0.1:15489`, random local root password, cleanup on exit. **No Railway DB or live credentials involved.**
- Updated `scripts/commission-hc-secure-db-credentials.mjs` commit `f23a531a33a393f7bf44de10be76b107e05c43ea`: a network/driver failure during password `COMMIT` can have an *ambiguous committed status*; now explicitly flags manual DB security review, never claims `ROLLBACK` relocked roles. Added a seventh mock test for this in `tests/hc-secure-credential-commissioning.test.mjs` commit `4484ef6b89ed0b871d466840d6543bc192cd84fb`.
- Updated acceptance document in Lightspeed at commit `efa9b6fa09762aecef7b1859e139e80bfc4cfd4e`.
- **New 7th mocked test and real disposable credential integration NOT YET RUN.**

**Next Codespace checkpoint (no real Railway connections):**
```bash
cd /workspaces/Lightspeed
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-credential-commissioning.test.mjs
bash scripts/run-hc-secure-disposable-credentials-pg18.sh
```
Expected **7/7** mocked tests and `HC_SECURE_DISPOSABLE_CREDENTIALS_OK postcommit_relock=true scram_logins=true bad_password_denied=true final_roles_locked=true owner_activations=0`. Docker runner automatically destroys test container. If it fails, do not substitute old Owner database; inspect carefully and correct source-only first.

**Fresh Railway readback:** New HC Secure environment still has **23 STAGED-only** changes; `hc-secure-auth-staging`, `hc-secure-postgres-staging`, 5GB volume all staged-create/not deployed. Original Owner `hc-owner-staging` and `Postgres-x8Ui` online. No real credential commissioning or DB initialization and **no WebAuthn migration**. After real disposable PG integration PASS, next milestone requires independent staging security review of the root bootstrap, secret custody, approved new database setup, and new-host Owner authentication transition.

---

## Nov 24 credential preflight 4/4 PASS; one-shot commissioning and six tests ready

**Latest operator result:** All four `tests/hc-secure-credential-commissioning-preflight.test.mjs` tests passed in Lightspeed Codespaces, per user's confirmation. Classify as **Testing PASS, operator-reported**; no test stdout captured by connector.

**Continued source-only development:** On `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77), created:
- `scripts/commission-hc-secure-db-credentials.mjs` (commit `bfa8afc6104452c55782a622655cd4d36553c744`, plus fix `804a78c3809213694abd38e6e674553e1638e227`): offline one-time HC Secure new-project-only DB role password commissioning. Requires `HC_SECURE_CREDENTIALS_ONLY` and independent new-project root/runtime/operator credentials. Checks PG18, empty Owner/activation rows, role lock and exact disjoint grants; sets role passwords inside SQL transaction with explicitly requested SCRAM; confirms login, nine-table runtime privilege gate and operator-only approval issuance; requires PostgreSQL **28P01** to count wrong-password denial; attempts rollback before commit or re-lock (`PASSWORD NULL`) after failed postcommit checks; error masks secrets. **Not run on any Railway DB.** Before actual staging execution, review ambiguous COMMIT/network failure handling and role-lock remediation and obtain explicit approval.
- `tests/hc-secure-credential-commissioning.test.mjs` (commit `2550bcfe94c4c52f9e8ea7514613c5a9adf94038`): **six** mocked guard/failure-handling tests, **NOT YET EXECUTED**.
- Acceptance checklist documentation updated at `docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md` (commit `85e0092cd61c35235a69f4ef059519b984c9ccd0`).
- **No Railway project deployment, real password set, live database initialization, WebAuthn credential registration, Owner activation or production tool auth cutover occurred.** Original Owner isolation, passkey/TOTP seed stay intact.

**Next Codespace checkpoint:**
```bash
cd /workspaces/Lightspeed
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-credential-commissioning.test.mjs
```
Expected six passing tests, zero failures; tests are fixture-only and do not contact Railway. Following PASS, next critical milestone is disposable PG18 commissioning integration tests (real SQL transactions, SCRAM login and failure relock) and independent reviewer approval before staging database provision/deploy.

---

## Nov 24 database bootstrap 11/11 PASS; credential commissioning preflight ready

**Operator-reported test result:** User confirmed **all 11 passed** from `node --test tests/hc-secure-staging-bootstrap.test.mjs tests/hc-secure-locked-roles.test.mjs` on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123`. Mark schema bootstrap + passwordless-role guard tests **Testing: PASS (operator reported, individual output not supplied)**. Previous 21-test suite and twice-run real disposable PG18 schema/grants were supplied and passed. **No HC Secure Railway DB was initialized by these mock tests.**

**New source-only milestone:** `services/security/hcSecureCredentialCommissioningPreflight.js` commit `ad395c9a39e7cc9c0d065625472a2eade37f2ed8` and `tests/hc-secure-credential-commissioning-preflight.test.mjs` commit `43e0c1b929ba5014a3c6bcf2c4ca15f833ed329d` on draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77). Pure, **no SQL/no I/O** preflight requires exact new HC Secure Railway project `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, staging environment `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`, separate future one-shot service `hc-secure-db-bootstrap-once`, action `HC_SECURE_CREDENTIALS_ONLY`, new PostgreSQL private root host, and three independent 48-character ASCII alphanumeric passwords (root + two logins). Rejects old Owner runtime/operator DB vars and any shared business credentials. Returns only boolean readiness and known role names; never outputs any secret. **Four new tests authored, not yet executed.** Actual password rotation/verification/secret custody code remains unimplemented; do not provision or claim complete credential commissioning.

**Next safe Codespace test:**
```bash
cd /workspaces/Lightspeed
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-credential-commissioning-preflight.test.mjs
```
This uses fixture-only values, makes no real DB/network calls. Expect four passing tests. Then design a separately authorized DB password commissioning run, with positive and negative connection tests and automatic password locking on failure; still no Owner activation or old credential/data copying.

**Railway state last verified:** new `HC Secure/staging` database/app/volume remain 23 staged-create pending changes, **not deployed**. Original Owner authentication and database remain online/SUCCESS; new hostname `secure-hc.timcorp-productions.com` remains selected but has no verified new credential registration. Production-wide staff MFA integration still pending.

---

## Nov 24 next milestone — HC Secure-specific schema and locked-role bootstrap ready for Codespace tests

**User direction:** continue development until next milestone or input required. **Completed source-only preparation; now awaiting Codespace tests.**

**Reused authoritative existing Owner SQL** from `Tawgod/Lightspeed/scripts/bootstrap-owner-stage-database.mjs` (seven reviewed fixtures including two NOLOGIN groups). New HC Secure-specific modules on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` / draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77):
- `scripts/bootstrap-hc-secure-staging-db.mjs` commit `b1821109c574ffd6cabebd15e52f17e84d2fbb0d`: one-time isolated new **HC Secure Railway project only** PG18 bootstrap. Exact project `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, env `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`, prospective offline one-shot service `hc-secure-db-bootstrap-once`, exact private PostgreSQL hostname `hc-secure-postgres-staging.railway.internal`, bootstrap root DB `/railway` with postgres user, independent password; separate explicit operator action `HC_SECURE_FRESH_DB_SCHEMA_ONLY`. Refuses all original Owner DB, business credentials, unexpected projects or existing `hc_owner_stage_test` database/login groups, requires PG18 and **zero Owner/activations**. Creates fresh DB and reviewed schema inside transaction with permission assertions. Does not create any Owner or activation, issue recovery/passkey codes, copy production data or passwords. If root CREATE DATABASE succeeds but following steps fail it refuses automatic retries or destructive cleanup; review partial DB separately.
- `scripts/prepare-hc-secure-locked-roles.mjs` commit `9ea86292181ac7cd345b9c8c50936eb1349168cf`: separately approved `HC_SECURE_LOCKED_ROLES_ONLY` one-shot on the same new project, verifies no existing Owner/activation/login roles, then creates `hc_owner_stage_runtime` / `hc_owner_stage_operator` **PASSWORD NULL** and disjoint NOLOGIN permission group memberships. Fails closed on unexpected permissions; no secret generation, credential activation or deployment.
- `tests/hc-secure-staging-bootstrap.test.mjs` (6 mock-only cases) and `tests/hc-secure-locked-roles.test.mjs` (5 mock-only cases) committed; complete tested branch docs `docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md` updated commit `a65da97a4db8a53407f51838bfb9b321a5ff6780`. **11 NEW TESTS NOT YET RUN**. Previous 21 tests + real PG18 double schema rollback **PASS** per operator output.

**Next Codespace test, no live database:**
```bash
cd /workspaces/Lightspeed
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-staging-bootstrap.test.mjs tests/hc-secure-locked-roles.test.mjs
```
Test success requires 11/11 tests; do not claim pass until output. User can report summary without secrets.

**Independent Railway readback after source commits:** `HC Secure/staging` pending patch `60012c69-e526-4778-9422-055d705150f2` remains **23 staged/unapplied changes**, `hc-secure-auth-staging`, `hc-secure-postgres-staging` and 5GB volume all **staged-create** only. New offline provisioner service has **NOT** been created or deployed. Existing original `HC PR63 Isolated Staging` `hc-owner-staging` and `Postgres-x8Ui` are still ONLINE/SUCCESS. No credentials copied, activation reissued, DNS or domain modified, or production tooling changed.

**After 11 tests PASS:** distinct next task is restricted role password commissioning and real isolated PG18 provisioning readiness review, with user authorization before any live Railway stage deployment, bootstrap SQL or secret changes. Do not accept current staged patch; PG18 service is still missing bootstrap DB config and new-host passkey remains unregistered at new RP ID.

---

## Nov 24 disposable PostgreSQL 18 integration test PASS — 21/21 and double run

**User-supplied Codespace test results:** `node --test` combined security suite: `tests 21, pass 21, fail 0, cancelled 0, skipped 0, todo 0`, duration `1713.433902ms`. Disposable integration runner: first and second real `postgres:18` run each emitted `HC_SECURE_DISPOSABLE_SCHEMA_OK fixtures=7 tables=9 nonlogin_groups=2 rollback=true`, followed by `HC_SECURE_DISPOSABLE_PG18_DOUBLE_PASS=true (no persistent DB or credentials)`. **Classification: Testing PASS, with full user-provided terminal summary; not independently observed executing in the connected Codespace.** Confirms schema creation/privilege assertions and rollback repeatability on disposable PG18. This is not evidence that HC Secure Railway database is provisioned, nor that new-host Owner WebAuthn or production employee security works.

**Next milestone:** Build fresh HC Secure-specific offline PG18 provisioning + role commissioning guarded by approved new Railway project/environment and private DB service. Maintain separate issuer/operator and runtime identities, fresh independent passwords/secret custody, least-privilege grants; avoid original Owner bootstrap scripts, their hard-coded original project, any existing Owner activation code, or database/key copying. Keep service staging patch unapplied until bootstrap and domain/RP-ID handoff are reviewed and deployment expressly approved. **No change was made to the original Owner app/DB or production auth by this test.**

---

## Nov 24 milestone — disposable PG18 schema & privilege integration test ready

**Current milestone: In Development, awaiting operator Codespace test.** Located original Owner schema and provisioner in `Tawgod/Lightspeed`: `scripts/bootstrap-owner-stage-database.mjs` exports the **seven** existing SQL fixture paths and enforces the original Owner Railway scope; `db/hc_owner_staging_privilege_groups.sql` creates **two NOLOGIN grants groups** with deliberately restricted activation issuance/deletion/updates. Reviewed `scripts/prepare-owner-locked-login-roles.mjs`, `scripts/commission-owner-stage-db-credentials.mjs` and the Owner runtime preflight. **No original bootstrap was modified or used on the new Railway project.**

**Source-only implementation:** On `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77):
- `scripts/test-hc-secure-schema-disposable.mjs` — uses exact seven existing Owner schema fixtures on an empty **disposable** PostgreSQL 18 database. Hard guard: no Railway project/environment/service variables, exact `127.0.0.1:15488`, `hc_owner_stage_test`, local `postgres` login, forced `cluster_name=hc-secure-disposable-pg18` and PG18 version. Requires all nine tables and privilege groups absent before test. Runs fixtures and verifies Owner tables, forbidden runtime activation issuance/digest/employee/expiry rewrites, permitted activation consumption/credential, operator-only activation issuance, no operator TOTP SELECT. **Wraps every change in a transaction that ALWAYS ROLLS BACK**, even on success; strips existing `BEGIN/COMMIT` from one reviewed privilege fixture and rejects transaction control in others. Does not create a real Owner, activation token, credential or role password.
- `tests/hc-secure-disposable-schema.test.mjs` — local-only target, origin/Railway rejection, transaction delimiter handling, fail-before-connect and unexpected PG cluster/version refusal (five tests).
- `scripts/run-hc-secure-disposable-pg18.sh` — temp Docker `postgres:18` with **tmpfs**, bound only to loopback `127.0.0.1:15488`; random throwaway password, Docker container removed on exit. Runs complete PG18 SQL/grant test **twice**; second pass catches any failure to roll back first pass.
- Acceptance document updated at `Tawgod/Lightspeed:docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md`. Latest source commit `7047bb79cc516d1aafb8f7049eb04d890d42adf8`.
- **All three new scripts/tests authored but NOT yet run in Codespaces or deployed.**

**User-run next test:**
```bash
cd /workspaces/Lightspeed
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-disposable-schema.test.mjs
bash scripts/run-hc-secure-disposable-pg18.sh
```
Expected two `HC_SECURE_DISPOSABLE_SCHEMA_OK fixtures=7 tables=9 nonlogin_groups=2 rollback=true` messages and `HC_SECURE_DISPOSABLE_PG18_DOUBLE_PASS=true`. Docker may not be available in Codespaces; report that blockage without substituting a real Owner PostgreSQL DB. No live Railway change, DB schema migration, first-Owner activation, hostname/DNS change or production login rollout is part of this test.

**Next after result:** If PG18 tests PASS, design **new HC Secure-specific** provisioner that requires private new Railway project/database/service guards and fresh backup/secret/role provisioning, rather than reusing hard-coded original Owner provisioner. Do not commit/accept staged Railway patch until separate PG credentials and new-host WebAuthn continuity are independently reviewed.

---

## Nov 23 fresh-database preflight test results — operator-confirmed 5/5 PASS

**Codespace test evidence supplied by operator:** In `/workspaces/Lightspeed`, branch `feature/hc-secure-staging-readiness-20261123`, fast-forwarded from `70429b1` to `25d5f5d` and ran `node --test tests/hc-secure-fresh-db-preflight.test.mjs`. Output: **5 tests, 5 pass, 0 fail, 0 skipped, 0 cancelled**, duration `107.122218ms`. Passed cases: exact private target scope; original/wrong DB and unsafe URL rejection; read-only transaction, release and pool cleanup; partial schema/wrong DB/reported read-write rejection; and fail-before-connect on incorrect project ID. Tests are mocked and **do not establish real PG18 connectivity or migrations**.

**Status:** HC Secure fresh DB safety preflight **Testing: PASS (operator-supplied complete stdout)**, no staging deployment. Next: review actual Owner SQL schema and permission model, develop disposable PG18-only bootstrap/least-privilege tests before provisioning the separate HC Secure staging PostgreSQL. Do not copy Owner secrets, data or passkey/TOTP rows; existing staging credential workflow remains authoritative until separately migrated and tested.

---

## Nov 23 next milestone — read-only HC Secure database preflight

**Development milestone (not deployed):** Reviewed actual deployed Owner runtime privilege code `services/security/ownerStagingDatabasePreflight.js`, which requires nine tables and specifically **refuses** Owner activation issuance, deletion, or rewrite authority while permitting only the controlled consume/credential update needed by registered Owner enrollment. A fresh PG18 container alone does not supply this schema/role model.

**Source changes made** on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` (draft [PR #77](https://github.com/Tawgod/Lightspeed/pull/77)):
- New `scripts/check-hc-secure-fresh-db.mjs` at commit `fb1d205fd7e240f2a7e65cace07cd64ccb2bdfcc`: **read-only** preflight before any schema provisioning. Refuses project ID other than `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, env ID other than `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`, DB hostname other than `hc-secure-postgres-staging.railway.internal`, DB name other than `hc_owner_stage_test`, blank DB user/password or same connection URL as `DATABASE_URL` / original `HC_OWNER_STAGING_DATABASE_URL`. Performs only `BEGIN READ ONLY`, SELECT `current_database`, `current_setting('transaction_read_only')` and `to_regclass` for nine security tables, then `ROLLBACK`. Fresh target must have all nine tables absent; existing/partial schema forces a separate reconciliation, **not an automatic reset**. Logs only fixed status boolean; no credentials/rows.
- New `tests/hc-secure-fresh-db-preflight.test.mjs` at commit `25d5f5d8692fc653e2108865a7ed01c290d8bcc9`, five independent mock-only cases checking exact target, original-host/DB refusal, transaction read-only behavior and rollback/cleanup, partial schema rejection, and no connection on wrong project.
- **New tests NOT YET EXECUTED**, not represented as verified passing and not yet deployed; old positive config tests were operator-reported successful.

**Critical current blocker:** Target `HC Secure/staging` PG18 image service + volume are still `staged-create` without bootstrap password, dedicated database, prepared restricted roles or migrated schema. This code is intentionally **not** a schema writer: migration authoring must reuse reviewed Owner SQL and its separation between offline operator and restricted runtime. Do not accept-deploy pending Railway patch `60012c69-e526-4778-9422-055d705150f2` or point its runtime at original Owner DB. Existing original Owner app and DB remain unchanged. Domain/RPID/credential continuity and staff-wide authorization still pending.

**Next focused Codespace command (no live DB):**
```bash
cd /workspaces/Lightspeed
git fetch origin feature/hc-secure-staging-readiness-20261123
git switch feature/hc-secure-staging-readiness-20261123
git pull --ff-only
node --test tests/hc-secure-fresh-db-preflight.test.mjs
```
Run with installed `pg` dependencies. Report only pass/fail, never credentials. After successful tests, independently provision new staging PG credentials and role/schema in a separate reviewed migration then run read-only probe in an authenticated Railway context only for the *new* database.

---

## Nov 23 Codespace security tests — operator-reported success

**User report:** After cloning `Tawgod/Lightspeed` and running `npm install` rather than `npm ci` (no package-lock exists on branch), user reported **“success”** following requested `node --test tests/hc-secure-staging-gate.test.mjs tests/hc-secure-staging-readiness.test.mjs`. **Classification:** operator-reported Tests PASS, full stdout/individual assertion count not independently available via connector. Do not claim independent CI evidence or physical credential verification on new host. The test files remain on `feature/hc-secure-staging-readiness-20261123`, tracked in [draft PR #77](https://github.com/Tawgod/Lightspeed/pull/77). 

**Fresh Railway readback:** `HC Secure/staging` retains patch `60012c69-e526-4778-9422-055d705150f2` of **23 staged changes**; `hc-secure-auth-staging`, `hc-secure-postgres-staging` and its volume remain `staged-create`, none deployed/provisioned. Original `HC PR63 Isolated Staging/hc-owner-staging` and `Postgres-x8Ui` are independently online, latest deployments SUCCESS.

**Next work gate:** use a new, isolated HC Secure PG18 instance with independently provisioned database/admin credentials and reviewed least-privilege roles. The current service was staged from a generic PostgreSQL Docker image and was observed without bootstrap variables; **do not accept-deploy as-is**. Write/test DB schema and privilege bootstrapping in disposable Docker/PG18 first; plan a separate backup and encrypted TOTP/passkey continuity with old-host login and new RP ID, rather than copying existing Owner production records or keys blindly. Never print keys/QR/PIN/TOTP through chat; no live domain/production changes approved. After DB+runtime preflight, independent staging deployment approval is required, followed by physical device browser tests and employee-scoped grants integration.

---

## Nov 23 HC Secure next phase — fail-closed entrypoint and staged safe config

**State:** In Development / Testing pending. Read back HC Secure project `120de974-f2e8-46be-9a00-8eb8b1be4cc4`, `staging` env `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`. The prepared `hc-secure-auth-staging` `8ef9adc0-2a4d-46c0-92cf-ba54834e33b5`, `hc-secure-postgres-staging` `454f4979-6148-4ee5-9857-97bc793dc72d`, and `hc-secure-staging-pgdata` `468ccb0a-3006-48b1-ac2d-f74293c7c075` remain **staged-create only** (no deployment/data/volume provision). Original verified Owner app and DB in `HC PR63 Isolated Staging` still successful and unaffected.

**Actual staging configuration written (STAGED ONLY):** eight nonsecret variables on auth service: `NODE_ENV=test`, `HC_SECURITY_ENV=isolated-staging`, `HC_OWNER_STAGING_ENABLED=true`, `HC_OWNER_TIMECLOCK_EMPLOYEE_ID=1`, `HC_OWNER_STAGING_ORIGIN=https://secure-hc.timcorp-productions.com`, `HC_OWNER_STAGING_RPID=secure-hc.timcorp-productions.com`, `HC_STAGING_TEST_LOGIN_ENABLED=false`, `HC_STAGING_PIN_SETUP_ENABLED=false`. **No credentials, encryption key or database connection injected.** Both target services' Railway variable listings contain *only Railway automatic variables* before this staging patch; PostgreSQL lacks its necessary provisioned database password/roles. **Do not accept pending patch**.

**Source-only implementation:** Created `services/security/hcSecureStagingGate.js` and `staging/hc-secure-security-server.js` on `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123`, commits `43ff760` and `e2d61b9`. The new entrypoint guards the **exact** HC Secure project + environment IDs, approved secure HTTPS origin/RP ID, Owner canonical employee, isolated staging flags, no fake staff logins, no live business/Timeclock admin keys, private DB hostname `hc-secure-postgres-staging.railway.internal` with exact `/hc_owner_stage_test` and nonblank DB user/password, before delegating to existing Owner server preflight. Existing `staging/owner-security-server.js` unchanged. If wrong, server logs only a generic error and refuses to open port. This is extra defense, not proof of full secure DB/Timeclock configuration. Added six negative/positive cases `tests/hc-secure-staging-gate.test.mjs` commit `70429b1880fbc304eaa9246e2a036a32a5961acd` and previously authored `tests/hc-secure-staging-readiness.test.mjs`. **Both unexecuted; do not claim passing tests.**

**Staged source readback:** `hc-secure-auth-staging` now points to EXACT dev branch commit `70429b1880fbc304eaa9246e2a036a32a5961acd`, start command `node staging/hc-secure-security-server.js`; still no live deployment. GitHub **draft PR #77**: https://github.com/Tawgod/Lightspeed/pull/77, base `fix/owner-staging-activation-digest-20261123`; DO NOT MERGE TO PRODUCTION. No custom domain, DNS/gateway change or public route.

**Next safe test:** With working `Tawgod/Lightspeed` Codespace and dependencies installed, on branch `feature/hc-secure-staging-readiness-20261123`, run:

```bash
git fetch origin feature/hc-secure-staging-readiness-20261123
git checkout --detach origin/feature/hc-secure-staging-readiness-20261123
node --check services/security/hcSecureStagingGate.js
node --check staging/hc-secure-security-server.js
node --test tests/hc-secure-staging-gate.test.mjs tests/hc-secure-staging-readiness.test.mjs
```

**Unresolved prerequisites BEFORE live staging deployment:** (1) Configure PostgreSQL template's private password/roles safely and separately provision an empty DB with exact name and required least privilege, *not* a clone of live Owner database; (2) ensure verified HTTPS hostname + DNS/TLS and exact RP ID, with authenticated new-passkey registration/handoff strategy (existing WebAuthn credential cannot sign for different RP); (3) verify trusted Timeclock identity and separately scoped secrets without pasting credentials; (4) run source and disposable DB tests, then isolated auth browser negative and positive tests; (5) separate user approval for domain/gateway changes and later production integration; (6) authorize non-Owner staff enrollment separately, not via Owner-only setup. Current old Owner TOTP fresh 19:58:34Z 200 verified, but no new same-window passkey proof. **Production staff strong MFA still not enforced across tools.**

**Important risk:** Railpack PostgreSQL image service was staged from the PG18 public image, NOT created through Railway's managed Postgres template flow. Its automatic variable name listing lacks POSTGRES_PASSWORD and other bootstrap values. The DB is **not deploy-ready** without explicit safe provisioning, startup test, and DB restore/privilege plan. Do not run accept-deploy to discover missing values.

---

## Nov 23 fresh original-host MFA check — verified Railway 200

**Fresh user report:** “Success, verification accepted” after instructed original-host authentication check. **Live Railway confirmation:** isolated `HC PR63 Isolated Staging/staging/hc-owner-staging` HTTP log shows `POST /api/staff-auth/session` 200 at `2026-11-23T19:58:16.325477Z`, and `POST /staff-security/api/mfa/session` **200 at `2026-11-23T19:58:34.825572Z`** (1:58:34 PM CST); earlier GETs for authenticator/enrollment also 200 at 19:58:12 and 19:58:52 UTC. Server stays online, deployment SUCCESS, 1 running replica, 0 recent failures/warnings/criticals. **This is fresh server confirmation of MFA/TOTP session acceptance**, not evidence that the same latest login session performed fresh WebAuthn; recent HTTP records contain no new `/staff-passkey/authentication/verify` during 19:58 window. Prior independent WebAuthn `/staff-passkey/authentication/verify` 200 at 17:13:06Z remains historical proof. Never misstate this as a verified new-host passkey.

**Still pending:** New HC Secure/staging domain/DNS, separate DB activation/least-privilege migration, no-reset cross-RP passkey registration, complete staff MFA permissions and cross-production tool integration. Current HC Secure staged-only patch remains unapplied; do not copy keys, destroy original DB or enforce production security gates yet.

---
## Nov 23 continued readiness — dedicated database staged and cross-tool auth audit

**User scope:** “Proceed until we can test whether the credentials are still working. Then make sure employee security works correctly across productions so we can work on tools again.” No live production security gates authorized for blind rollout. **Progress:** HC Secure/staging already had staged Owner server `hc-secure-auth-staging` `8ef9adc0-2a4d-46c0-92cf-ba54834e33b5`. Added dedicated **staged-only** `hc-secure-postgres-staging` `454f4979-6148-4ee5-9857-97bc793dc72d` with exact PG18 image `ghcr.io/railwayapp-templates/postgres-ssl:18` and **staged-only** 5GB volume `hc-secure-staging-pgdata` `468ccb0a-3006-48b1-ac2d-f74293c7c075` at `/var/lib/postgresql/data`. Both app + DB and attached volume are part of existing pending patch `60012c69-e526-4778-9422-055d705150f2` in `HC Secure/staging` `120de974-f2e8-46be-9a00-8eb8b1be4cc4 / 8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`. **Nothing committed/applied/deployed/provisioned; no domain, secrets, Owner records, DB backup/restore/migration**. Do not accept-deploy until database secrets/roles/runtime verified, new-host origin/RPID and credential path reviewed.

**New development branch (source-only):** `Tawgod/Lightspeed:feature/hc-secure-staging-readiness-20261123` based on exactly current deployed Owner SHA `977f63b267f226a29b731541386d492bb537c312`. Added `tests/hc-secure-staging-readiness.test.mjs` (commit `b0c426a56b3575ceb58e2b727b85170ffe4b73c4`) for target origin/RP ID, strict dedicated DB, synthetic exclusion, independent signing/encryption key. Added `docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md` (commit `4074d6698ab7b659d6091b19ad682097908be4c3`) recording full Owner+staff acceptance, old/new host/CSRF, protected service callers and no-reset constraints. Tests **created, NOT YET EXECUTED** in Codespace; `node --test tests/hc-secure-staging-readiness.test.mjs` from dev branch. Do not trigger broad GitHub Actions.

**Verified cross-service variable name and deployed source audit (values never requested/disclosed):**
- Production Timeclock: `timeclock` source `Tawgod/Lightspeed@a595fd336c5a38dcc5ab5423a8967698777c0929`, supports Owner-staging separate identity service; remains authoritative for employee PIN identity.
- Production `special-orders-test` source `Tawgod/Lightspeed:integration/hobby-corner-consolidation`: runtime `server.js` `createStaffAuthGateway` with Timeclock PIN session when `SCANNER_ENABLED=true`; `shared-ui/staff-auth.js` still attaches optional `x-hobby-corner-key` legacy header. **No proof** universal staff MFA or exact operation grants on deployed routes.
- Production `lightspeed-api` uses same integration branch but lacks Scanner session secret vars; no proof of central staff MFA.
- Production `store-map` separate branch/service, no central staff auth verification yet.
- Rewards/Discord service identities must remain non-human and scoped, do not require interactive PIN/TOTP for background sync.
- `staff-security-staging` in Integration Test remains synthetic isolated login and is NOT canonical employee authorization for production tools.
- All original production workspaces and original Owner/staff staging services remain intact, no deployment changes.

**Immediate credential smoke request (user device):** Open existing `https://hc-owner-staging-staging.up.railway.app/staff-security/`, perform *fresh* Timeclock PIN session, registered Owner passkey verification, *fresh* 6-digit Authenticator session verification, and use **Check verification status** to get server approval. User should report only PASS/FAIL/nonsecret error, never codes, QR or credentials. Existing historic Nov23 HTTP 200s are not new proof. HTTPS RP ID at original host will remain unchanged, so this test can verify whether original credentials still work without exposing them or requiring transfer.

**Blockers to new-host test:** No custom domain/DNS/gateway, no deployed new HC Secure backend, new DB not provisioned/migrated; registered Owner credential remains bound to `hc-owner-staging-staging.up.railway.app` and cannot sign `secure-hc.timcorp-productions.com` assertions. Need reviewed old-RP authenticated cross-origin handoff or safe new RP registration; no PIN-only reset. Must do real device + negative tests before declaring new-host ready. No staff-wide enforcement until canonical non-Owner enrollment/revocation, grants, fail-closed and service caller compatibility verified.

**Current statuses:** original Owner staging Deployed+verified historically; HC Secure new app/db Staged-create, not deployed/tested; staff integration audit In Development and production strong-MFA across tools NOT verified. **No DNS/gateway/production changes or deletion.**

---

## Confirmed permanent security hostname — 2026-11-23

**Approved hostname decision:** User selected **`secure-hc.timcorp-productions.com`** for the new HC Secure security login service. This replaces earlier suggested `secure.timcorp-productions.com` (which was only a suggestion). Target origin **`https://secure-hc.timcorp-productions.com`**, target WebAuthn RP ID **`secure-hc.timcorp-productions.com`** for *new credentials registered against that host*. Keep both exact values synchronized in `HC_OWNER_STAGING_ORIGIN` and `HC_OWNER_STAGING_RPID` when a **new**, separately configured HC Secure environment becomes deployable, and in CSRF/signed challenge validation, cookie domain rules, allowed redirects and gateway configuration. Do not assume old Owner credentials registered against `hc-owner-staging-staging.up.railway.app` will work under the new RP ID; require an explicitly tested safe credential migration or additional registration with existing strong Owner authentication. For future customer auth, design separate credential audience/policies, not implicit employee/Owner sharing.

**Change scope this turn:** design/documentation decision only. **No public DNS, Timcorp gateway, Railway custom domain attachment, TLS, environmental secrets, Owner data, deployment or production route changed.** Maintain existing working Owner staging URL through test and cutover. Future exact DNS/gateway changes require explicit separately reviewed launch approval after domain ownership verification and hardware/browser passkey tests. New `HC Secure` candidate remains staged-only (10 pending config changes) with no database/domain/secrets and must not be deployed.

---
# HC Secure — Identity & Authenticator Consolidation Handoff

**Last verified:** 2026-11-23  
**Status:** In Development (new project created, deployment staged); Testing (original Owner flow verified, new replacement NOT tested); Deployed (original only, no new HC Secure deployment)

## Goal and ownership

Establish **HC Secure** as the private Railway project containing Hobby Corner's shared security infrastructure for employee, Owner, and eventual customer authentication. This is an organizational and deployment boundary, **not** permission to merge all identities or databases into one trust domain.

- Staff: canonical Timeclock employee identity + Owner/manager-approved enrollment, passkeys, TOTP and exact grants.
- Owner: same secure authentication infrastructure but independent high-impact Owner grants and recovery/audit controls.
- Future customer portal: *separate identity namespace, audience, database permissions, recovery, rate limits and secrets*; no employee/Owner account or claims derived from customer self-registration.
- Production changes, Timesclock / browser / extensions and customer-data access remain out of scope until separately tested/approved.

## Source

- Original deployed Owner app: `Tawgod/Lightspeed:fix/owner-staging-activation-digest-20261123@977f63b267f226a29b731541386d492bb537c312`.
- Original live isolated Railway Owner project: `HC PR63 Isolated Staging` `5b46096d-3178-47ec-ba88-d5037696346a`; environment `staging` `46b93c76-3085-4e76-a37d-90dfdd250dd2`; app `hc-owner-staging` `3a8f9555-90e5-4bc2-bb63-4f48d8c852d0`; dedicated Owner database `Postgres-x8Ui` `5c4498e4-cffb-4224-916a-af57391d1cd9`, volume `04530c8a-cf70-4857-9f9b-0828b47bc54c`. **Preserve** the application URL `https://hc-owner-staging-staging.up.railway.app/`, existing Owner credentials, immutable activation/recovery audit, TOTP encryption key and domain binding; never reinitialize or consume new recovery codes to duplicate.
- Original staff synthetic test: `Hobby Corner Integration Test/test` project `c4586f88-0a5e-4582-8e0f-3861d851567b`, app `staff-security-staging` `5c4e9d67-8ac0-4958-adf6-92387c7cdbca` at source `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106@21a44f4f06ebaacec3d005344faa89f8907feb46`. **Keep until replacement tested and synthetic fixture retention reconciled.** This is not the real canonical employee/Owner gateway.
- Timeclock is a separate active production authentication upstream: `Hobby Corner/production/timeclock` `dd3469bd-5fce-43bc-b9f9-7aa2a7806457`. Do not move it into HC Secure as a side effect.

## Implemented (verified Railway state)

New private project **`HC Secure`** created in same workspace:

- Project ID: `120de974-f2e8-46be-9a00-8eb8b1be4cc4`.
- Environment: `staging` `8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c`; **no production environment is provisioned or deployed**.
- Staged-only service: `hc-secure-auth-staging` `8ef9adc0-2a4d-46c0-92cf-ba54834e33b5`, immutable repo source `Tawgod/Lightspeed@977f63b267f226a29b731541386d492bb537c312`, start command `node staging/owner-security-server.js`, `/health` check and fail-only restart policy.
- Railway pending patch `60012c69-e526-4778-9422-055d705150f2` with **10 staged changes**, `staged-create` service and **no deployment, no domain, no variables, no volumes, no DB, no data/secret duplication**. **DO NOT ACCEPT/DEPLOY pending patch in this state:** the Owner runtime intentionally refuses startup without its dedicated isolated PostgreSQL, exact HTTPS origin/RP ID, canonical Timeclock adapter, independent keys and privileges.
- The existing original Owner app `hc-owner-staging` and original Owner DB each read back **online, 1 running replica**. Old synthetic `staff-security-staging` read back **online, 1 running replica**.

## Verified source and key migration constraints

1. `staging/owner-security-server.js` rejects startup unless `HC_OWNER_STAGING_DATABASE_URL` parses as exact database `/hc_owner_stage_test` and is different from the default `DATABASE_URL`; checks DB runtime role privileges before opening HTTP. This code explicitly does not migrate or provision accounts.
2. `services/security/ownerTimeclockStagingBundle.js` requires `NODE_ENV=test`, `HC_SECURITY_ENV=isolated-staging`, `HC_OWNER_STAGING_ENABLED=true`; canonical non-synthetic Owner employee; `HC_OWNER_STAGING_ORIGIN` must be exact secure origin and `HC_OWNER_STAGING_RPID` exact hostname; Timeclock approved service URL; independent high entropy secrets and AES-256 TOTP key; synthetic test PIN setup forbidden.
3. `services/security/ownerSecurityStagingMount.js` asserts **RP ID equals exact HTTPS host**, and mutating routes enforce exact Origin + same-origin Fetch Metadata. A WebAuthn credential registered for `hc-owner-staging-staging.up.railway.app` **will not authenticate on a new Railway hostname**. Copying its database or TOTP rows alone cannot make passkey assertion valid at new origin. Do not misstate DB duplication as a complete test migration.
4. Existing Owner mounting already serves both `/owner-setup` and `/staff-security` routes, but `ownerPasskeyTotpEnrollmentCandidate.js` restricts eligibility to exact canonical Owner employee and same-owner approval; the existing app **does NOT yet support arbitrary staff MFA enrollment**. Must implement/review a separate employee authorization path; do not expose it by relaxing Owner checks.
5. Original staff-security test `staging/staff-security-server.js` is a synthetic isolated test runtime; its passkey preflight hardcodes old `https://staff-security-staging-test.up.railway.app` origin. Don't blindly move its data/secret/config to real Owner host or weaken its tests.
6. Never cross-wire test-only staff identities into the real Owner DB, and never copy production Timeclock Secrets to the new project until exact security/env scope is approved.

## Tested

- New project readback: correct name and `staging`; one staged-only service at pinned tested source and correct command; zero variables, domains, volumes and deployment; original Owner and old synthetic staff app both unchanged and online.
- The **original** Owner registration, fresh passkey authentication, TOTP enrollment and MFA verification were independently supported by successful Railway HTTP 200 on 2026-11-23 (see `handoffs/owner-login.md`). These are NOT tests of new HC Secure clone.
- No new credentials, privilege escalation, SQL, service data transfer or browser test executed. **New replacement not deployed or runtime-validated.**

## Recommended migration steps / release gates

1. **Security-domain design:** choose a stable HTTPS security hostname and exact RP ID strategy that allows existing Owner credential continuity or separately authorizes a verified, no-reset registration procedure. Don't alter original Railway domain/DNS or reset existing Owner.
2. **Safe database strategy:** create a distinct and backed-up/tested staging PostgreSQL for HC Secure; review whether cloned Owner audit and encrypted TOTP rows should be migrated at all; check access-control/privilege grants, encryption-key custody, replay protections and append-only audits. Prefer an explicitly reviewed migration with readback over reinitialization. Do not duplicate/seal secrets into GitHub or logs.
3. **Staff integration:** reuse underlying staff authenticator components with genuinely authenticated canonical Timeclock session and exact employee permissions; never reuse Owner’s self-approval special case for staff. Keep synthetic regression fixtures isolated. Test approval, revocation, token audience, wrong-user and spoofed-role denial.
4. **Stage config only after protected requirements:** pin exact reviewed source, configure independently scoped runtime variables and database credentials, assign a new HTTPS host; do not apply the currently incomplete 10-change patch yet.
5. **Test replacement independently:** startup/health/DB role check, signed staff session, verified Owner passkey and TOTP enrollment, replay denial, CSRF/Origin and wrong-RP ID, session expiry, audit retention and Windows/phone browser acceptance. Use disposable test identities wherever possible; preserve and compare original service throughout.
6. **Only after verified:** request separate approval for public domain cutover, source/config deployment, identity migration, and original staff synthetic service deletion. Preserve original Owner service/DB as rollback until audited acceptance. Keep a distinct `production` environment and do not auto-promote staging variables and secrets into it.
7. **Future customers:** adopt a separate customer authentication audience and least-privilege principal/data boundary; do not attach customer accounts to Timeclock Owner bootstrap, or let customers gain store permissions through shared middleware.

## Shared dependencies

- Main production Timeclock and Lightspeed store apps must continue to operate unmodified.
- Timcorp gateway integration and Chrome extension queue separate. No DNS, gateway, extension deployment, email or app integration changed here.
- Existing older `HC Owner Security Staging` project is an abandoned never-deployed patch, not the active original Owner stage. Distinguish by project IDs.

## Decisions needed

- Choose stable security domain and verified passkey continuity plan before any live clone testing involving Owner.
- Approve separate DB backup/restore and restricted secret management if real Owner account data is copied. The user's earlier “no more backup” instruction concerned recovery-key ceremony; do not infer permission to move active Owner data without migration backup.
- Determine which employee roles/approval/recovery policy will be active; future customer access strictly separate.

## Restrictions

- No user PIN, TOTP seed, activation code, QR or raw secret sent to ChatGPT or committed to GitHub.
- Never run first Owner activation or second/final recovery ceremony again on existing DB.
- Never deploy `HC Secure` staging while missing migration prerequisites; no production deployment.
- No delete/reset of original Owner service, its DB volume, old synthetic test server or Timeclock app without exact separate approval.
