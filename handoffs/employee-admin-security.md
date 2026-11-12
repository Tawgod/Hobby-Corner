# Employee Administration & Central Tool Settings — Current Handoff

## Reclaimable Discord delivery lease prepared — 2026-11-12

**System:** Shared Staff Security / notification delivery worker reliability. **Status: In Development / automated CI PASS; disposable PostgreSQL acceptance pending; NOT deployed.** Development branch `Tawgod/Lightspeed:integration/security-all-tools-20261111`, latest head `a7560a0a3a70d9683b9a3b95314dbb9a8b09dfc0`.

**Reliability finding:** `POST /notifications/:id/claim-discord` previously moved a notification from `QUEUED` to `SENDING` with no lease expiry. A worker crash after claim could therefore strand that notification indefinitely. The existing `notifications.not_before` column is now reused compatibly as a five-minute delivery lease while status is `SENDING`; no schema migration is required.

**Implementation:** Commit `2563fb720d421d947452c77a27278293eb43a581` makes the Discord delivery read endpoint return ready QUEUED work plus expired SENDING work, makes claim set `not_before=now()+interval '5 minutes'`, permits reclaim only after that lease expires, and clears `not_before` when completion records SENT or ERROR. Fresh SENDING work cannot be stolen. No route grant/credential/mount change was made.

**Acceptance test:** Commit `a7560a0a3a70d9683b9a3b95314dbb9a8b09dfc0` extends the disposable PostgreSQL 18 harness with exact fixture service grants for delivery-read/claim/complete. The new case requires: initial QUEUED work is visible; first claim succeeds; immediate second claim returns 409; fresh SENDING work is hidden; advancing the lease into the past makes it visible; reclaim succeeds; completion records SENT and clears the lease.

**Automated verification:** GitHub Actions [43245589553](https://github.com/Tawgod/Lightspeed/actions/runs/43245589553) completed **SUCCESS** on the current head. The superseded source-only run was cancelled by workflow concurrency after all substantive policy steps had already completed successfully.

**Next operator command:**

```bash
cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh
```

Expected: all prior 12 cases remain green plus the new Discord delivery lease/reclaim case, parent PASS, zero failures, and verified disposable-container removal. No real Discord message, Railway deployment, employee/service credential, Lightspeed mutation, schema migration or production authorization is involved.

---

## GW mark-submitted corrected PostgreSQL acceptance PASS — 2026-11-12

**System:** Shared Staff Security / GW preorder submission worker integrity. **Status: Testing PASS for corrected disposable PostgreSQL acceptance; NOT deployed.** Owner synced `Tawgod/Lightspeed:integration/security-all-tools-20261111` to `8550d22cd2280baada3e07696c37793045764817` and ran the localhost-only PostgreSQL 18 harness twice.

**Observed result:** Both runs reported **12 tests, 12 pass, 0 fail**, and both ended with `Verified disposable PostgreSQL container removal.` The previously failing GW `mark-submitted` case now passes its injected rollback, clean retry and duplicate-submission protection path on real PostgreSQL.

**Verified behavior:** The injected staff-notification failure rolls campaign/product/notification state back. After removing the trigger, retry commits the GW campaign as ORDERED/SUBMITTED, writes the expected submitted product quantity/value and queues the expected staff/customer notifications. A third duplicate submission is rejected with 409 without adding duplicate notifications. This also verifies the SQL typing fix for `$1::integer` against PostgreSQL 18.

**Related automated verification:** GitHub Actions [43243952519](https://github.com/Tawgod/Lightspeed/actions/runs/43243952519) **SUCCESS** on corrected head, including the regression guard preventing the ambiguous `$1*msrp` form from returning.

**Production boundary:** No Railway deployment, real GW submission, machine credential, employee grant, route approval, database migration, Lightspeed mutation or Chrome extension change occurred.

**Next:** Continue remaining service-worker review: cross-system retry/idempotency around GW auto-submit failure alerts and Discord delivery claim/complete behavior, then reduce the unresolved route list before any staging mount or real service credential commissioning.

---

## GW mark-submitted SQL fix automated verification PASS — 2026-11-12

**Status:** In Development / automated verification PASS; corrected disposable PostgreSQL retest still required; NOT deployed. The corrected branch head is `Tawgod/Lightspeed:integration/security-all-tools-20261111@8550d22cd2280baada3e07696c37793045764817`.

GitHub Actions [43243952519](https://github.com/Tawgod/Lightspeed/actions/runs/43243952519) completed **SUCCESS**, including the exact-service proposal tests and the new regression check requiring explicit INTEGER typing in the GW mark-submitted product update and forbidding the prior ambiguous `$1*msrp` expression. The superseded intermediate source-fix run was cancelled by the newer head as expected.

**Remaining verification:** Rerun the existing localhost-only disposable PostgreSQL 18 harness. The prior manual failure at `abcb6a8` is expected to be resolved only if the clean retry now reaches 200, campaign/product quantities commit correctly, expected notifications are created, duplicate submission remains 409, parent suite reports zero failures, and temporary container removal is verified.

**No production change:** No deployment, real database, GW form submission, service credential, staff grant, Lightspeed data, Railway environment or Chrome extension was touched.

---

## GW mark-submitted PostgreSQL type-inference defect found and fixed — 2026-11-12

**System:** Shared Staff Security / GW preorder submission worker integrity. **Status: In Development / fix committed; corrected manual PostgreSQL retest pending; NOT deployed.** Owner ran the disposable PostgreSQL 18 harness after syncing to `Tawgod/Lightspeed:integration/security-all-tools-20261111@abcb6a8`. The prior 10 nested cases remained green, but the new GW mark-submitted case failed on the clean-retry path. Node reported **12 tests, 10 pass, 2 fail** (the nested case plus parent), with verified disposable-container removal.

**Root cause:** This was a real existing production-source SQL defect, not a malformed test fixture. The mark-submitted product update reused PostgreSQL parameter `$1` both for INTEGER columns (`submitted_quantity`, `ordered_quantity`) and inside multiplication with NUMERIC `msrp`. PostgreSQL rejected the prepared statement with `inconsistent types deduced for parameter $1`. The injected-failure rollback portion had already behaved correctly; the clean retry exposed the typing bug before submission could commit.

**Fix:** Commit `40849c3ba8d42ce640e349ccce783efb4d1bf532` changes the statement to explicitly use `$1::integer` for both quantity columns and `$1::integer*msrp` for the NUMERIC submitted value. This preserves intended quantity/value semantics while making parameter typing unambiguous. Commit `8550d22cd2280baada3e07696c37793045764817` adds a source regression assertion in `tests/core-operations-service-proposals.test.mjs` so ambiguous `$1*msrp` cannot silently return.

**Current verification:** GitHub Actions run for the source fix commit is in progress at this checkpoint. Do not claim corrected-head CI or manual acceptance until observed. The disposable PostgreSQL test must be rerun after syncing to `8550d22c...`; expected behavior is that the injected staff-notification failure rolls back campaign/product/notification changes, the retry succeeds with two submitted units and expected notifications, and a third duplicate submission returns 409 without duplicates.

**Production boundary:** No Railway deployment, real GW submission, employee/service credential, route approval, database migration, Lightspeed mutation or Chrome extension change occurred. The bug was found entirely in isolated development/fixture execution.

---

## GW mark-submitted disposable PostgreSQL acceptance prepared — 2026-11-12

**System:** Shared Staff Security / GW preorder submission worker integrity. **Status: In Development / manual PostgreSQL acceptance pending; NOT deployed.** Development branch `Tawgod/Lightspeed:integration/security-all-tools-20261111`, draft PR #61, latest head `abcb6a80dca556d492eab1afa4f3d3c5039845c5`.

**Source review:** `POST /preorders/gw/campaigns/:id/mark-submitted` already uses one database transaction and row-locks the campaign. It updates per-product submitted/ordered quantities, campaign submission state, staff notification and customer summary notifications together. Duplicate submissions are rejected after the locked campaign is already `SUBMITTED`. No production source change was needed at this checkpoint.

**New disposable PostgreSQL acceptance case:** The manual loopback-only PostgreSQL 18 harness now admits fixture service `gw-submit-worker` only for exact operation `service.preorders.gw.mark-submitted`. The test creates a disposable GW campaign/product/customer request, injects a trigger failure when the staff-submitted notification is inserted, and requires the failed request to leave campaign status `OPEN`, external submission `NOT_SUBMITTED`, no `submitted_at`, product ordered quantity unchanged at zero, submitted quantity/value null and zero campaign notifications. After removing the injected failure, a retry must submit exactly two units, set campaign `ORDERED/SUBMITTED`, set submitted product quantity/value, create exactly the expected staff/customer PENDING notifications, and a third duplicate call must return 409 without adding notifications.

**Why manual:** This test exercises real SQL transaction rollback and remains intentionally excluded from routine GitHub Actions. The prior production-code/service-scope workflows remain green; this commit only extends the isolated acceptance harness.

**Next operator command:**

```bash
cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh
```

Expected: all prior 11 cases remain green plus the new GW mark-submitted rollback/retry/idempotency case, parent PASS, zero failures and explicit disposable-container removal. No Railway, real GW form submission, Discord message, employee/service credential, Lightspeed mutation or production route grant is involved.

---

## GW Discord reaction disposable PostgreSQL acceptance PASS — 2026-11-12

**System:** Shared Staff Security / Core Operations Discord-GW worker integrity. **Status: Testing PASS for disposable PostgreSQL acceptance; NOT deployed.** Owner fast-forwarded `Tawgod/Lightspeed:integration/security-all-tools-20261111` from `47a6045` to `56fac07ff13ab7103ab2e3a3a31b516d52f61ea6` and ran `bash scripts/run-isolated-security-status-postgres.sh` in Codespaces.

**Observed result:** Node reported **11 tests, 11 pass, 0 fail**, followed by `Disposable database verification completed. Temporary container will be removed.` and `Verified disposable PostgreSQL container removal.` Runtime remained about 11 seconds.

**Verified rollback behavior:** The intentionally injected `hc_fixture_reject_gw_confirmation` trigger raised `P0001` during GW Discord ADD processing. The passing test verified that the callback transaction left **zero reaction rows, zero preorder request rows and zero confirmation notification rows** after the failure, then a clean retry created one reaction event, a REQUESTED preorder request and a PENDING confirmation. This confirms the new reaction/request/notification transaction boundary against disposable PostgreSQL 18. Previously verified guarded status and Discord-delivery atomicity cases remained green.

**Related automated verification:** Exact service proposal/security tests [43242961218](https://github.com/Tawgod/Lightspeed/actions/runs/43242961218) **SUCCESS**; transactional GW reaction production-code workflow [43243080651](https://github.com/Tawgod/Lightspeed/actions/runs/43243080651) **SUCCESS**. Latest manual-test head does not add production behavior beyond that source change.

**Production boundary:** No machine credential, employee grant, route approval, `server.js` mount, Railway deployment, schema migration, real Discord/customer/Lightspeed mutation, or Chrome extension change occurred.

**Next:** Continue source review of remaining service/automation callbacks for transactional consistency, idempotency, caller identity and exact scope. Keep all service proposals review-pending and default-deny until real caller ownership/credentials and staging acceptance are separately approved.

---

## Exact service proposals + GW Discord reaction transaction hardening — 2026-11-12

**System:** Shared Staff Security / Core Operations service-worker authorization and integrity. **Status: In Development / automated tests PASS; manual PostgreSQL acceptance pending; NOT deployed.** Development branch `Tawgod/Lightspeed:integration/security-all-tools-20261111`, draft PR #61, latest head `56fac07ff13ab7103ab2e3a3a31b516d52f61ea6`.

**Service-scope review:** Added `services/security/coreOperationsServiceProposals.js` with seven **review-pending, non-authorizing** exact machine-route proposals: Discord preorder-watch capture, GW Discord reaction callback, GW auto-submit failure callback, GW mark-submitted callback, Discord delivery read, Discord delivery claim, and Discord delivery complete. Mixed employee/browser routes are intentionally excluded, including GET preorder-watch review, GET notification delivery queue, and manual POST product reconciliation. Proposals are not imported by `server.js` or route admission and create no credential/grant.

**Tests:** `tests/core-operations-service-proposals.test.mjs` verifies each proposal maps to an existing inventory route, remains pending, uses exact `service.*` scope, authorizes nothing unless explicitly injected into the backend gate, and keeps claim/complete/read grants isolated. GitHub Actions [43242961218](https://github.com/Tawgod/Lightspeed/actions/runs/43242961218) **SUCCESS**.

**Integrity finding/fix:** Source review found `POST /preorders/gw/discord-reaction` wrote reaction history, preorder request changes and confirmation/update notifications as separate autocommit statements. A later failure could leave Discord reaction history persisted while the preorder request/notification state was missing or stale. Commit `d1beb9341ac9b79d45fa82a2c8f52aaa75ccacf2` now runs the callback as one PostgreSQL transaction, including the unmatched-customer event path, with rollback on failure. Security workflow [43243080651](https://github.com/Tawgod/Lightspeed/actions/runs/43243080651) **SUCCESS** for the production-code change.

**Manual acceptance added:** Latest head `56fac07f...` extends the loopback-only disposable PostgreSQL test with an injected confirmation-notification failure. It must prove that a failed GW ADD reaction leaves **zero reaction rows, zero preorder request rows and zero confirmation notifications**, then a clean retry creates exactly one reaction, a REQUESTED preorder request and a PENDING confirmation. This test uses fixture service `gw-discord-events`; no real Discord, customer, Railway or Lightspeed data is touched. The manual test file intentionally does not trigger GitHub Actions.

**Next operator command:**

```bash
cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh
```

Expected: all prior status/Discord-completion cases remain green, one new GW Discord reaction rollback case passes, parent passes, Node reports zero failures, and disposable container removal is verified. No production route/grant/deployment change.

---

## Discord delivery disposable PostgreSQL acceptance PASS — 2026-11-12

**System:** Shared Staff Security / Core Operations service-worker integrity. **Status: Testing PASS for disposable PostgreSQL acceptance; NOT deployed.** Owner fast-forwarded `Tawgod/Lightspeed:integration/security-all-tools-20261111` from `98a9165` to `47a6045e375cd7609073caecf6198938c4a66883` and ran `bash scripts/run-isolated-security-status-postgres.sh` in Codespaces.

**Observed result:** Node reported **10 tests, 10 pass, 0 fail**, followed by `Disposable database verification completed. Temporary container will be removed.` and `Verified disposable PostgreSQL container removal.` Runtime dropped to about 11 seconds, confirming the reconciliation startup timer no longer holds the process open for the prior ~120-second tail.

**Verified database behavior:** All previously accepted guarded status cases remained green. The new scoped Discord service test proved that a verified `service:discord-delivery` completion atomically marks the notification `SENT`, moves the Special Order item to `CUSTOMER_NOTIFIED`, and writes server-derived service audit history. The injected `hc_fixture_reject_discord_history` failure intentionally raised `P0001`; the test then verified the notification remained `SENDING`, item retained its prior status, no history row committed, and a later retry succeeded. This confirms the new transaction rollback behavior against disposable PostgreSQL 18.

**Automated source/HTTP verification:** Security workflow [43242023049](https://github.com/Tawgod/Lightspeed/actions/runs/43242023049) **SUCCESS** at transactional source commit `56ae8857810346d513ec8c97e404b364139fe936`. Latest head `47a6045e...` only added the manual PostgreSQL tests and did not require another GitHub Actions run.

**Production boundary:** No `server.js` guard mount, employee permission, service credential, Railway deployment, schema migration, real customer/order/Lightspeed mutation, or Chrome extension change occurred. Draft PR #61 remains development-only.

**Next:** Continue exact service/automation route classification and service-operation proposals from verified source behavior. Do not treat route inventory/proposals as authorization. Keep actual machine credentials, grants, worker cutover and production deployment behind separate acceptance/approval.

---

## Discord delivery atomicity hardening ready for disposable PostgreSQL acceptance — 2026-11-12

**System:** Shared Staff Security / Core Operations service-worker integrity. **Status: In Development / Testing; NOT deployed.** Development branch `Tawgod/Lightspeed:integration/security-all-tools-20261111`, draft PR #61, latest head `47a6045e375cd7609073caecf6198938c4a66883`.

**Implemented:** Guarded Discord delivery completion no longer records a generic literal actor; guarded mode resolves the independently admitted service principal through `auditActor(req,'discord-bot')`, while legacy/unmounted mode retains `discord-bot`. The `POST /notifications/:id/complete-discord` handler now performs notification completion, row-locked Special Order status update to `CUSTOMER_NOTIFIED`, and status-history insertion inside one PostgreSQL transaction. A failure rolls the whole unit back. No route grant or service credential was enabled.

**Process/test cleanup:** The one-shot product reconciliation startup timer is now explicitly `unref()`ed, matching the recurring timer. This explains the owner's prior ~130-second Node runtime despite sub-second DB assertions: the 120-second startup timer kept the test process alive. The change does not stop reconciliation while the application server is actually running; it only stops the timer from being the sole reason a process/test cannot exit.

**Automated verification:** GitHub Actions security workflow [43242023049](https://github.com/Tawgod/Lightspeed/actions/runs/43242023049) **SUCCESS** at transactional source commit `56ae8857810346d513ec8c97e404b364139fe936`. Earlier intermediate runs were cancelled by newer commits. Latest head `47a6045e...` adds only manual PostgreSQL acceptance coverage and intentionally does not trigger Actions.

**New manual PostgreSQL coverage awaiting owner run:** Existing disposable test now adds two service-worker cases in addition to the already verified status suite: (1) a scoped `service:discord-delivery` completion must atomically mark the notification `SENT`, move the item to `CUSTOMER_NOTIFIED`, and write server-derived service audit history; (2) an injected history-write trigger failure must return failure while leaving the notification `SENDING`, item in its original status and no history row, then a clean retry must succeed. Test remains loopback-only disposable PostgreSQL 18 and uses fixture service identity only.

**Next operator command:**

```bash
cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh
```

Expected: prior seven nested status checks still pass, the two new Discord completion checks pass, parent test passes, Node zero failures, and explicit disposable-container removal is printed. No production DB, Railway service, Lightspeed record, real employee/service credential or Chrome extension is touched.

---

## Corrected PostgreSQL acceptance fully closed + Discord service audit hardening — 2026-11-12

**Status:** Testing / In Development; **NOT deployed**. Owner supplied the complete Codespaces output for `Tawgod/Lightspeed:integration/security-all-tools-20261111@98a9165`: Node reported **8 tests, 8 pass, 0 fail**, followed by `Disposable database verification completed. Temporary container will be removed.` and `Verified disposable PostgreSQL container removal.` The corrected seven nested guarded-status cases plus parent suite therefore have a verified zero-failure exit path and verified disposal of the temporary PostgreSQL 18 container. The earlier rollback-fixture blocker is closed.

**Next source hardening:** Review of the remaining Core Operations service/automation routes found that Discord delivery completion still inserted literal `discord-bot` into `order_status_history.changed_by`. On draft PR #61 branch `integration/security-all-tools-20261111`, commits `a8f09ff4a382b830159dfceffd91ca1a76a06d6d` and `ecc14a51cbcc17c7466f04e4922ae69e6566a506` changed that guarded sink to `auditActor(req,'discord-bot')` and added a regression source assertion. **Legacy mode remains exactly `discord-bot`; guarded mode records the independently admitted `service:<id>` principal.** No service route was approved or mounted.

**Route review findings:** 36 of the 87 inventoried Core Operations routes are straightforward authenticated read/read-via-POST candidates already mapped to existing `special-orders.read` (17), `ordering.read` (9), or `products.read` (10) operations. They are still not a production allowlist. The remaining 49 non-public routes contain 30 local writes, 14 service/automation candidates, 2 external-side-effect routes and 3 direct vendor writes. Source review confirms the service bucket is not harmless read traffic: Discord reaction capture creates/cancels preorder requests and notifications; Discord claim/complete mutates notification state and completion may set Special Order status to `CUSTOMER_NOTIFIED`; product reconciliation and registry endpoints mutate local product state; purchase-metric refresh/import mutates local customer metrics; GW auto-submit-failure can emit an external alert. These require exact scoped service identities/operations or separately approved employee actions rather than generic read permission.

**Testing note:** The new Discord audit change has source regression coverage committed, but do not claim current-head CI success until a workflow result is observed. Production `server.js` still does not mount the guard; no employee grants, machine credentials, Railway configuration, DB migration, Lightspeed record, Chrome extension or production deployment changed.

---

## Corrected disposable PostgreSQL status acceptance — 2026-11-12

**System:** Shared Staff Security / Special Orders guarded status SQL acceptance. **Status: Testing PASS for corrected disposable PostgreSQL transaction suite; NOT deployed.** Owner fast-forwarded `Tawgod/Lightspeed:integration/security-all-tools-20261111` from `e704b58` to `98a9165eb37a28ec8341185bde5459c4789a2818` and ran `bash scripts/run-isolated-security-status-postgres.sh` in Codespaces. The PostgreSQL 18 schema initialized successfully and **all seven nested integration checks passed, with the parent test passing**.

**Verified cases:** routine progress writes one trusted employee history row without notification side effects; routine downgrade from a received item is blocked; completion/cancellation require strong verified proof and suppress pending notification work; completion suppresses PENDING/QUEUED while preserving SENT notices; the corrected forced-notification-failure fixture proves atomic rollback of status/history/timestamps; row locking prevents a stale routine authorization from reopening an item concurrently; and unrecognized targets/static legacy key cannot mutate a row.

**Correction closed:** The prior six-of-seven failure was caused by malformed PL/pgSQL quoting in the injected-failure **test fixture**, not by demonstrated production transaction non-atomicity. The corrected fixture now passes at branch head `98a9165`. This establishes the intended transaction behavior against a disposable real PostgreSQL 18 instance for this isolated test path. The pasted terminal output still ends immediately after the passing parent test, so the launcher’s final explicit container-removal line and shell exit status were not independently observed in chat; do not claim those two details unless separately shown.

**Production boundary:** `server.js` still does not mount the proposed Core Operations admission guard; no production employee grants, Railway database/schema, Lightspeed records, Chrome extension, credentials or deployment changed. Draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61) remains the development integration branch.

**Next:** Continue safe development by reviewing remaining Special Orders status policy edges and the unreviewed Core Operations endpoint/service scope inventory. Physical passkey/Authenticator, staffed browser acceptance, real grant storage/credential provisioning, production deployment, schema migration and permission activation still require separate approval/participation.

---

## Failed rollback fixture and correction — 2026-11-12

**System:** Shared Staff Security / Special Orders guarded status SQL acceptance. **Status: Testing, BLOCKED on corrected manual retest; NOT deployed.** Owner ran `cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh` after syncing `Tawgod/Lightspeed:integration/security-all-tools-20261111@e704b58`. **Six of seven nested PostgreSQL 18 tests passed**, while `forced notification failure rolls back status, history and timestamps atomically` failed and parent test failed. The output did not include a failure stack, final Node summary or verified temporary container cleanup. Do **not** count seven cases as passed.

**Cause found in source:** The simulated SQL trigger used malformed function body quoting `AS $ ... ; PostgreSQL requires valid quoted/dollar-quoted function body. This is a **test fixture defect**, not proof that the live status transaction is non-atomic. The specific test was fixed to a properly escaped single-quoted PL/pgSQL body and now asserts the expected injected database error message before checking rollback, to prevent unrelated 400 responses falsely passing.

**Implementation:** `Tawgod/Lightspeed:integration/security-all-tools-20261111`, draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), latest documentation head `98a9165eb37a28ec8341185bde5459c4789a2818`; corrected test commit `b3c01630bd3b7a8627558f579bd0fd90648a107a`. Only manual test and development doc updated. No branch merge, production auth, staff grants, SQL transaction logic, real database, Chrome extension or Railway change.

**Next:** Automatically continue development after the owner reruns `cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh` and reports complete output. Require all **seven nested checks PASS**, parent PASS, Node no-failure summary, plus `Verified disposable PostgreSQL container removal.` Then proceed to review status policy/permission edge cases and real device acceptance preparation. If still failing, inspect error stack and fix without touching production. Original previously verified [unit/HTTP CI 43226273528](https://github.com/Tawgod/Lightspeed/actions/runs/43226273528) SUCCESS remains valid for its own commit, not proof of the corrected manual test.

---

## Disposable PostgreSQL rollback and cleanup hardening — 2026-11-12

**System/feature:** Staff Security → Special Orders status-transaction integrity. **Status:** In Development / Testing, **not deployed**. **Repo:** `Tawgod/Lightspeed`, branch `integration/security-all-tools-20261111`, draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), head `e704b58767b60074c24774d58328e58d388ef9f3`.

**Verified prior milestone:** User ran `bash scripts/run-isolated-security-status-postgres.sh` in Codespaces after syncing to `f1c8fbb`; console showed PostgreSQL 18 schema loaded and **five nested integration test checks passed, with the parent test passing**. Real isolated SQL covered routine progress/history, received-order downgrade denial, guarded cancellation/notification suppression, a concurrent DB lock, and malformed/legacy-key write denial. **Final Node summary, process exit code and Docker container-removal confirmation were not present in user paste.** These cannot yet be claimed verified. Prior ordinary GitHub Actions [43226273528](https://github.com/Tawgod/Lightspeed/actions/runs/43226273528) SUCCESS at the unit/HTTP security checkpoint.

**New code since that test:** Manual-only `tests/core-operations-status-postgres-isolated.test.mjs` now has **seven nested database checks**, adding (a) `COMPLETED` suppression of both PENDING/QUEUED notifications while retaining already SENT entries, (b) forced DB trigger failure during notification suppression with verification that status/changed timestamps/audit history/notification rows all roll back and later retry succeeds. The disposable shell launcher now verifies and reports destruction of its own temporary PostgreSQL Docker container, with explicit error on cleanup failure. Code-only documentation updated at `docs/CORE_OPERATIONS_AUTHORIZATION_ADMISSION.md`. No new GitHub Actions worker or remote test services added.

**Testing:** 5 old SQL checks observed passing; **the 2 new SQL checks and Docker cleanup reporting remain unverified until the owner runs** `cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh` again. Script checks local Node dependency/syntax, permits only loopback disposable database, and does not access production. Existing `server.js` still does NOT inject any new guard or grant staff permissions.

**Remaining blockers:** Explicit owner approval of routine vs sensitive statuses, staffed-store browser acceptance, actual production-bound signed sessions/MFA devices, back-end grant storage and scoped machine creds, other 73 endpoint reviews, live DB staging/restore and rollback. **No production deployment, migration, or Chrome release.** Continue automatically after verified success; only ask user for essential approval or test output.

---

## Disposable PostgreSQL status security acceptance — 2026-11-12

**System/feature:** Shared staff security → Special Orders guarded status transitions, isolated SQL acceptance. **Status:** In Development / Testing; **not deployed; new integration test NOT RUN yet**.

**Repo/branch:** `Tawgod/Lightspeed:integration/security-all-tools-20261111`, draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), latest commit `f1c8fbbd3df66ea03adabb8718efc90cf6590692` (manual wrapper now also checks JS syntax and local npm dependencies before starting Docker). Existing status-route logic remains default-off in `server.js`, with previously verified source/HTTP/unit CI [43226273528](https://github.com/Tawgod/Lightspeed/actions/runs/43226273528) **SUCCESS**. User asked that once a step passes, development continue automatically to the next safe step or next concrete command, without needing a separate "continue" message.

**Implemented (manual test harness only):** New `scripts/run-isolated-security-status-postgres.sh` starts a **new disposable PostgreSQL 18 Docker container** on a dynamic **127.0.0.1-only** port in the remote Codespace, verifies readiness, strips inherited Railway/DB/other service credential variables, runs `tests/core-operations-status-postgres-isolated.test.mjs`, and removes only its own container on exit/failure. The Node test refuses non-loopback or non-fixture database credentials; it applies the actual `db/special_orders_schema.sql` and supplier seeds only in that fresh database. It verifies real SQL status/history/notifications after routine progression, protected cancellation and blocked reopening, plus a concurrent row lock scenario. Signed-employee/workstation/passkey identities are **fixtures**, not real employee authentication. No external vendor APIs, Railway databases, production staff/customer records or Chrome packages are accessed.

**Testing results:** Owner ran the manual Codespaces launcher at `f1c8fbbd3df66ea03adabb8718efc90cf6590692`; console showed PostgreSQL schema initialized and **five passing nested integration tests plus the passing parent test**, covering real SQL status/history/notification changes, guarded cancellation, locked downgrade refusal, concurrent row lock, forged actor/key, and invalid target. The pasted output stopped before Node's final summary and shell cleanup confirmation, so **process exit code and disposable container removal are not independently verified**. The test is deliberately excluded from GitHub Actions. Prior source/HTTP CI [43226273528](https://github.com/Tawgod/Lightspeed/actions/runs/43226273528) SUCCESS. For further reruns and cleanup confirmation, use:

```bash
cd /workspaces/Lightspeed-security && git pull --ff-only && bash scripts/run-isolated-security-status-postgres.sh
```

**Remaining blockers:** Need output of disposable integration test; fix any discovered schema/transaction/runtime issues; review real employee/Owner role choices and service credentials; verify browser/Chrome flow, physical authenticators, staged Postgres regression and rollback before any production activation. No deployment, DB migration, live permissions or service credentials modified by this work.

---

## Source-and-target-aware Special Orders status transition security — 2026-11-12

**System/feature:** Shared staff security → Core Operations Special Orders `PATCH /items/:id/status`. **Status:** In Development / Testing; **NOT deployed, NOT mounted, permissions NOT granted**. Development repository `Tawgod/Lightspeed`, branch `integration/security-all-tools-20261111`, draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), code/documentation head `09c561fb663d8ca883b778167344d19928d9198e`.

**Prior verified checkpoint:** User's Codespace `git pull --ff-only` to `5a641a6` and 11/11 actor attribution + actual-router tests PASS, repeated output counted once. GitHub Actions [43107480216](https://github.com/Tawgod/Lightspeed/actions/runs/43107480216) **SUCCESS** at that prior commit. No manual Codespaces test has yet been reported for the new 2026-11-12 status transition code.

**New implemented, gated code:** `services/security/coreOperationsStatusTransitions.js` adds conservative, owner-review-pending target classification: `OOS`, `READY_TO_ORDER`, `BACKORDERED` as proposed routine local progress (`special-orders.status.progress`), with `PREORDER`, `ORDERED`, `RECEIVED`, `HELD`, `CUSTOMER_NOTIFIED`, `COMPLETED`, `CANCELLED` sensitive (`special-orders.status.write`). Routine actions still need signed active employee session, independently verified workstation/TOTP and exact grant; sensitive actions require fresh passkey/security key/approved strong IdP MFA and separate exact grant. The *destination cannot prove safety*: after strong/normal action admission, the handler checks the **database-row-locked previous state** before updating. Routine status progression is permitted only between the three routine states; reverting a received/completed/cancelled item via a benign-looking target denies. A permitted target is bound to the admission to prevent middleware/body mutation. Invalid/ambiguous payloads fail closed.

**Opt-in only:** `coreOperationsRouteAdmission.js` accepts conditional routing *only* for an exact server-supplied employee `PATCH /items/:id/status` approval carrying `operation:'special-orders.status.write', statusPolicy:'locked-transition-v1'`. Static `special-orders.status.progress` approvals are disallowed. `TOOL_OPERATIONS` and `staffAccessBaseline.js` added the review-only exact progress permission; `coreOperationsProvisionalScopes.js` flags the status proposal. `server.js` still never supplies any `coreOperationsAdmission` guard. Existing legacy status path remains unchanged.

**Testing:** Added `tests/core-operations-status-transitions.test.mjs` (10 focused cases including all 10 statuses, malformed payloads, spoofed Owner claims, missing grants, station/TOTP/passkey, status-source vs destination under lock, actual isolated Express router/no DB and source ordering); expanded `.github/workflows/security-all-tools-policy.yml` triggers/test step. Cross-tool Actions [43226273528](https://github.com/Tawgod/Lightspeed/actions/runs/43226273528) **SUCCESS**, including all 10 new status-transition cases, original staff policy, secure Lightspeed reads, route inventories, real guarded-router seam, audit actor and legacy Special Orders compatibility. No physical or DB staging validation yet. Real PostgreSQL row transition, actual employee hardware, customer notifications, role approval and Lightspeed data writes were **not tested**.

**Remaining decisions and next actions:** Get owner/store workflow feedback on low-impact vs strong status changes, including ordinary `ORDERED`, receipt, cancellations/completions and authorized reopening. Add trusted server-side grant/storage/identity and real staging Postgres transactional acceptance, service callers and web/Chrome integration with rollback. Do not merge to live consolidated branch or deploy Railway without explicit approval. Production behavior, credentials, DB schema and permissions remain unchanged.

---

## Codespaces audit identity proof — 2026-11-11

**Testing; not deployed.** Owner fast-forwarded cleanly to `Tawgod/Lightspeed:integration/security-all-tools-20261111@5a641a660f1783f1cf85617070bb275daeaa1e10`, then ran `node --test --test-concurrency=1 tests/core-operations-audit-actor.test.mjs tests/core-operations-route-seam.test.mjs`. **11 passing test assertions displayed, 0 failures** (6 actor identity / HTTP/source regressions; 5 actual Special Orders router compatibility cases). The identical terminal output was provided twice: count **one run only**. Total displayed local passes across earlier checkpoints is **72 across seven distinct runs**, not 83. [GitHub Actions run 43107480216](https://github.com/Tawgod/Lightspeed/actions/runs/43107480216) completed **SUCCESS** at this exact branch head, including staff/security policy, secure Lightspeed reads, route/caller drift, granular scopes, independent service admission, guarded actor and legacy compatibility.

**Verified security behavior in isolated tests:** only a server-admitted active employee or service can stamp `employee:<id>` or `service:<id>` audit labels once the new optional guard is supplied; forged body/user role and missing admission deny; a service principal does not need the old static admin key in guarded mode; missing opt-in preserves legacy router behavior. **Not verified** against a real Postgres/Lightspeed transaction, physical passkey/Authenticator/workstation, or full browser/Chrome workflow.

**Remaining gates:** `server.js` still does not mount the optional Core Operations gate; no approved `approvedRoutes`/employee grants or real machine credential validators exist in production. Pending policy review for 14 candidate exact routes and 73 remaining endpoints, body-sensitive status/financial effects, legacy/hardcoded audit sources, consumer UI session changes, Owner commissioning, and staged rollback/acceptance. No Railway deployment, database migrations or production permission changes. Continue development on draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61) without changing the deployed integration branch.

---

## Codespaces 11/11 granular guard tests and trusted actor attribution — 2026-11-11

**Status: Testing; not deployed.** User executed `git pull --ff-only` to `Tawgod/Lightspeed:integration/security-all-tools-20261111@2db2ede` and `node --test --test-concurrency=1 tests/security-all-tools-operations.test.mjs tests/core-operations-provisional-scopes.test.mjs tests/core-operations-route-seam.test.mjs`. User-supplied output showed **11 tests PASS, 0 failures in displayed output** (6 provisional scopes, 5 real router seam). The output did **not** include test results for `tests/security-all-tools-operations.test.mjs`, so do not claim its assertions passed in this local run. Previously recorded 50 local tests passed; therefore **61 individually displayed local test successes** across reported commands. GitHub [Actions 43105622486](https://github.com/Tawgod/Lightspeed/actions/runs/43105622486) completed SUCCESS at `2db2ede`, testing those suites under CI.

**Next hardening (draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), not yet tested or mounted):** source review found browser-provided `changed_by`, `created_by`, `received_by`, `reviewed_by`, `gw_reviewed_by` values were used as audit actors by some Special Orders/preorder/ordering handlers. Added `services/security/coreOperationsAuditActor.js`, and changed identified audit sinks in `special-orders.js`: when explicitly guarded, the audit actor comes from trusted `req.hcCoreOperationsAdmission` (set by admission middleware) as `employee:<id>` or `service:<id>`; missing/malformed admitted principal denies. The current `server.js` does NOT enable the new guard; in legacy mode audit value behavior remains unchanged. Added `tests/core-operations-audit-actor.test.mjs` for spoofed body, signed employee, trusted machine, malformed admission, HTTP middleware and source sinks. Expanded security CI, documentation in `docs/CORE_OPERATIONS_AUTHORIZATION_ADMISSION.md`; newest automated test run pending at checkpoint. Test does not use a real DB and legacy hardcoded system audit annotations still need review.

**Not done:** real credential provisioning, staff/Owner grant approval, schema migration, end-to-end Chrome/mobile, production deployment, vendor-write actions. The Timeclock-only Railway production patch is still understood to be staged/unapplied; no live changes by this milestone. Next test Codespaces updated head and continue granular route/worker audit in staging.

---

## Granular store operations and machine-auth seam — 2026-11-11

**Status: In Development / Testing; not deployed.** Owner ran `node --test --test-concurrency=1 tests/core-operations-route-admission.test.mjs tests/core-operations-route-seam.test.mjs` after a clean `git pull --ff-only` to `Tawgod/Lightspeed:integration/security-all-tools-20261111@dd92530`, reporting **10 PASS, 0 FAIL**. Total user-run isolated tests now **50 PASS in five separate sessions** (19 staff, 12 secured Lightspeed reads, 5 server route inventory, 4 browser caller inventory, 10 admission/real-router compatibility). The same development head had GitHub [workflow 43103441358](https://github.com/Tawgod/Lightspeed/actions/runs/43103441358) **SUCCESS**.

**Subsequent implementation (draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), branch head `2db2ede0ddc6032c421004840a931470a4d59d3f`):** Fixed an important staging-only integration gap: the old admin-key/Timeclock middleware previously rejected independently verified machine credentials before the optional Core Operations guard. With trusted `coreOperationsAdmission` explicitly injected, `special-orders.js` now sends business routes directly through the *new* independently authenticated staff/service guard; `/auth-check` keeps existing legacy behavior. When guard omitted (current `server.js`), ALL existing behavior stays unchanged. Added a real-router HTTP regression asserting that a valid scoped machine can reach the DB-not-configured boundary without the old admin key, and that the legacy key/forged role alone gets 403.

**Provisional exact action split for review:** Added 12 new `TOOL_OPERATIONS` strings (previous 25 now 37), including `special-orders.notes.write`, `special-orders.routing.write`, `special-orders.status.write`, `special-orders.create`, `special-orders.delete`, `special-orders.notifications.send`, `preorders.allocate`, `preorders.publish`, `ordering.draft.write`, `ordering.receive`, `ordering.vendor.push`, and `customers.lightspeed.create`. Three **proposed routine** operations (local notes, sourcing/routing and unsent supplier drafts) allow a verified station/routine factor plus *separate exact grant*; all other new actions require recent strong phishing-resistant proof plus exact grant. `products.create` already exists. Fourteen matching source route candidates are recorded **review-pending** in `services/security/coreOperationsProvisionalScopes.js`, explicitly not imported/auto-approved by the guard. A recognized Owner/Admin operation such as `admin.delegation.manage` is now forbidden as an ordinary Core Operations route approval. Added granular tests and CI, with no actual employee grants assigned.

**Unresolved:** The above 14 classifications are NOT approved staff policy; existing route handlers may trust browser-supplied `changed_by`/`reviewed_by` and must use authenticated server-side actor before real rollout. Status changes include complete/cancel and suppress notifications; receiving/allocating inventory, customer PII, financial/vendor write and Discord publication remain protected candidates. Service workers require independently verified, revocable credentials and a scoped grant registry; current new tests use fixtures only. Additional 73 endpoint candidates, direct server routes, UI/Chrome migration, real passkey/TOTP/device acceptance, and standalone Owner activation remain blocked. The *newest* CI [workflow 43105622486](https://github.com/Tawgod/Lightspeed/actions/runs/43105622486) was in progress at this checkpoint; don't claim the new granular policy is tested until success/owner's Codespace run. Source plan: [CORE_OPERATIONS_AUTHORIZATION_ADMISSION.md](https://github.com/Tawgod/Lightspeed/blob/integration/security-all-tools-20261111/docs/CORE_OPERATIONS_AUTHORIZATION_ADMISSION.md).

**Production:** no deployment, credentials, migration, protected roles or Chrome extension changed. Previous Timeclock-only Railway staged patch remains uncommitted.

---

## Default-off Core Operations employee and service route guard — 2026-11-11

**Status: In Development / Testing, NOT deployed or enabled.** Owner confirmed Codespaces `git pull --ff-only` to `Tawgod/Lightspeed:integration/security-all-tools-20261111@00ffac2` and `node --test tests/core-operations-browser-callers.test.mjs` returned **4 PASS, 0 FAIL, 0 SKIP**. Cumulative user-run local isolated tests: **40 PASS across four runs** (19 staff, 12 Lightspeed secured read, 5 route inventory, 4 browser callers). This is not real physical-device, end-to-end or production validation.

**New development implementation:** Draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), later head `dd92530d7e5797f0313342c0cf4cb9afdc604d80`, now adds `services/security/coreOperationsRouteAdmission.js` and `tests/core-operations-route-admission.test.mjs` plus isolated HTTP compatibility tests `tests/core-operations-route-seam.test.mjs`. The admission factory defaults to **zero approved routes** and requires an explicitly trusted exact source+HTTP method+path+audience+operation declaration. Staff admission delegates to existing bound Timeclock employee + cryptographic station/MFA + independent operation-grant policy; service admission separately requires a verified active machine identity and exact backend service grant. Browser roles, old admin key, unverified service IDs, claimed workstation and PIN-alone never count. Unknown/ambiguous/encoded paths deny. An optional, backend-only `coreOperationsAdmission` middleware argument was added to `createSpecialOrdersRouter` **after the existing session-check and before all business routes**. **Current `server.js` does NOT pass it**, so no existing feature route is newly protected or denied.

**Tests:** The new suites cover zero-default grants, active signed off-clock staff routine reads, strong passkey protected writes (no TOTP-only write), separate service credentials + per-operation grants, forged/untrusted claims, unknown paths, HTTP before-handler denial, unchanged legacy routing without opt-in, main+nested guarded route denial, and malformed guard startup rejection. Expanded bounded GitHub Actions CI is running for latest head at checkpoint; **do not call these new tests passed until the latest run succeeds or the owner tests in Codespaces**. Early runs were superseded/cancelled by later commits; HTTP tests were adjusted to consume response bodies and close disposable loopback sockets.

**Separate ownership decisions pending:** Granular regular `special-orders` and `ordering` staging/editing versus privileged purchaser/financial/vendor writes; exact service callers for 14 automation candidate endpoints; trusted credential adapters, employee workstation enrollment and Owner first activation; browser/Chrome migration and multi-service integration acceptance. See development documentation [CORE_OPERATIONS_AUTHORIZATION_ADMISSION.md](https://github.com/Tawgod/Lightspeed/blob/integration/security-all-tools-20261111/docs/CORE_OPERATIONS_AUTHORIZATION_ADMISSION.md) and [SECURITY_COORDINATED_ROLLOUT.md](../SECURITY_COORDINATED_ROLLOUT.md).

**Production:** no Git merges, Railway deployments, migrations, credentials, employee grants, Owner activation or extension releases performed. Previous Timeclock-only source patch remains staged, unapplied.

---

## Service-identity and browser caller verification — 2026-11-11

**Status: In Development / Testing, NOT deployed.** On `Tawgod/Lightspeed:integration/security-all-tools-20261111` draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), added source-driven browser caller inventory, regressions and CI triggers for four current web clients. Their per-client unique `api +` URL fragments are 37 Special Orders, 6 Preorders, 6 GW Preorders and 10 Ordering (59 references, not independent routes). All web clients share `HCStaffAuth` and are **not** using the new server security gate. GitHub [CI 43050974812](https://github.com/Tawgod/Lightspeed/actions/runs/43050974812) **SUCCESS**, including 87-server-route inventory, four-browser-caller drift suite, staff and secured-read tests, and Special Orders compatibility test. GitHub source documentation at [CORE_OPERATIONS_SECURITY_ROUTE_MAPPING.md](https://github.com/Tawgod/Lightspeed/blob/integration/security-all-tools-20261111/docs/CORE_OPERATIONS_SECURITY_ROUTE_MAPPING.md).

**Production worker/service audit:** Railway project `Hobby Corner` `production` `Hobby-Corner-Discord-Bot` deployed `Tawgod/Hobby-Corner-Discord-Bot:main@7c3af0eee516e52f3e767dbbbb7c03dd3a64d4f9` (deployment `3a8e9375-aad7-4c47-9721-66790febaeae`, SUCCESS). Verified that `main.py` at this exact deployed commit is blob-identical to current main. It uses server-side `TIMECLOCK_ADMIN_SECRET` via `x-timeclock-admin-secret` for Timeclock employee/PIN/shift/PTO admin APIs, plus separate `CUSTOMER_SYNC_ADMIN_KEY` for an hourly customer sync. This is distinct from a browser employee session and must be migrated to narrowly scoped/audited service authorization; verified Discord role alone must not grant Owner passkey privileges.

Railway `Hobby-Corner-Rewards` production deployment `07c0c365-a8d4-4a2e-a120-2034db91fc` SUCCESS at `Tawgod/Hobby-Corner-Discord-Bot:main@ce54862f67d678f8a1cb77302e520c59fb0c7118`. `rewards_service.py` blob matched current main; it runs its own schedule, uses direct Lightspeed API token and `REWARDS_ADMIN_KEY` for admin routes. Neither service should be forced through interactive employee passkey/TOTP to complete unattended work. This source audit does **not** prove those bots call the 14 review-pending Special Orders routes; keep exact caller identity unverified there. No repo source, Railway service, credentials or customer records in those service repositories was changed.

**Next:** map full HTTP method/path and exact employee/worker capabilities against 87 main/nested Special Orders routes; approved split of ordinary staff stage/edit vs high-impact ordering/credit/vendor writes, then default-disabled backend gate with isolated service identity tests. No production deployment, Owner activation or DB changes.

---

## Browser caller source inventory (Codespaces sync + CI) — 2026-11-11

**Status:** In Development/Testing; NOT deployed. Owner's Codespace fast-forwarded cleanly to `Tawgod/Lightspeed:integration/security-all-tools-20261111@2fb6529`, and operator reported **5 route inventory tests PASS, 0 FAIL**. This adds to prior local 19 shared security + 12 Lightspeed policy/read tests, for **36 tests across three runs**. GitHub full security workflow [43049915660](https://github.com/Tawgod/Lightspeed/actions/runs/43049915660) returned SUCCESS at the same 2fb6529 commit (including the corrected 87-route inventory regression). No live auth change was performed.

**Verified code mapping:** `special-orders-client.js`, `preorders-client.js`, `gw-preorders-client.js`, and `ordering-client.js` all call `window.HCStaffAuth` and `/api/special-orders`. Source contains 37/6/6/10 unique `api + '...'` URL literal fragments respectively (**59 per-client source references**, not 59 distinct complete routes or verified runtime invocations). Four web consumers still share legacy-key fallback through `shared-ui/staff-auth.js` and server middleware, so do not remove it in isolation.

**Implemented on draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61):** `services/security/coreOperationsBrowserCallerInventory.js`, `tests/core-operations-browser-callers.test.mjs`, expanded CI triggers for all four client files, and a new section in `docs/CORE_OPERATIONS_SECURITY_ROUTE_MAPPING.md`. This is a **review-only static caller matrix**, with every entry pending; no trusted service identity or employee grant is inferred from URL fragments. GitHub CI on newest browser inventory code was running at checkpoint; verify before labeling tested.

**Next:** reconcile actual full URL/method callsites to the 87 routes and audited service/Discord workers, then build exact permissions with backend verified station/TOTP/passkey and service tokens; staging tests before any production/Owner activation. Timeclock-only Railway patch remains staged, not deployed.

---

## Core Operations route security inventory — 2026-11-11

**Status: In Development / Testing; NOT deployed or mounted.** The user successfully fast-forwarded their clean `/workspaces/Lightspeed-security` Codespace checkout from `747e7d6` to `7f9dae2` via `git pull --ff-only`, confirming synchrony with previously tested PR #61 metadata hardening.

**Source audit:** On `Tawgod/Lightspeed:integration/security-all-tools-20261111` (draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61)), reviewed the actual existing Special Orders router and nested Product routes. **75 + 12 = 87** literal registered API endpoints: 32 ordinary GET reads, 30 local mutations, 14 service/batch or hybrid caller candidates, 4 read-via-POST actions, 3 Lightspeed vendor writes, 2 external notification/publish actions, one public health endpoint and one session-check endpoint. Source examples: `POST /supplier-orders/:id/push-lightspeed`, `POST /customers/create-lightspeed` and `POST /products/create-lightspeed` are three high-impact vendor-write entry points; Discord reaction and notification worker/callback routes require independently authorized **service** identities. Existing router's GW notification interval remains active if initialized; no employee activity does NOT prove worker inactivity.

**Implemented for review ONLY:** `services/security/coreOperationsRouteInventory.js` freezes all 87 exact method/path/source entries with proposed operation/caller and `review:'pending'`. No inventory entry is a grant or mounted middleware. `tests/core-operations-route-inventory.test.mjs` compares all registered routes against source to fail on drift, requires cataloged candidate operations, and checks health, vendor writes, read-via-POST, service callers, and no automatic permission. `docs/CORE_OPERATIONS_SECURITY_ROUTE_MAPPING.md` documents scope, blockers, human/worker split and acceptance plan. CI workflow triggers on changes to both source routers and inventory. Initial test exposed a **test-only source path mistake** for nested reconcile routes; corrected, no source login flow changed. Current workflow on latest head `2fb652940df48bdfb4790e242e32034ad4643bf5` must be checked for final result; at checkpoint CI is queued/pending.

**Not yet implemented:** Actual backend authorization gates for any of 87 endpoints; exact service credentials, strong device/MFA assurance, granular normal vs sensitive staff permissions, same-site mobile/Chrome browser integration, Owner activation, and production deployment. Do not auto-enable broad `ordering.manage` or `special-orders.manage` strong-passkey classification without store policy approval. Also audit 24 separate direct `server.js` routes and other service routers in subsequent work.

**Next action:** Verify latest CI for route inventory, then Codespaces `git pull --ff-only` to the current tested head and run targeted route inventory test. Continue mapping real browser/Discord callers before implementing default-disabled guard.

---

## Special Orders auth metadata hardening — 2026-11-11

**System:** Core Operations / Special Orders backend, shared security rollout. **Status: In Development; test workflow pending; not deployed.**

The owner-reported Codespaces run after nonproduction dependency installation completed **12/12 PASS, 0 failures**, comprising the existing secure Lightspeed read and permission suites. Together with the prior separate 19/19 staff policy tests, 31 test assertions have passed across two local runs. The initial `express` dependency load error was resolved by installing 197 project dependencies; only deprecation warnings surfaced. No production server/database affected.

**Current backend source inspection:** `Tawgod/Lightspeed:integration/security-all-tools-20261111` `server.js` mounts `/api/special-orders` using `createSpecialOrdersRouter`. Existing `special-orders.js` auth accepts a legacy static `x-hobby-corner-key` or signed Timeclock bearer; it is **not yet wired to the new independent device/MFA+exact-operation gate**. `/health` also returned legacy admin-key length metadata and startup/denial logs printed key lengths. This was not previously addressed by the 31 policy/read tests.

**Development changes (no live authentication behavior change):** PR [#61](https://github.com/Tawgod/Lightspeed/pull/61) `integration/security-all-tools-20261111` now removes key length disclosures from `special-orders.js`, adds `tests/special-orders-auth-metadata.test.mjs` for HTTP health/denied/authenticated compatibility, and extends `.github/workflows/security-all-tools-policy.yml` to run the test. [Docs on source branch](https://github.com/Tawgod/Lightspeed/blob/integration/security-all-tools-20261111/docs/SECURITY_ALL_TOOLS_POLICY.md). **Verified GitHub Actions:** [cross-tool policy run 43047954793](https://github.com/Tawgod/Lightspeed/actions/runs/43047954793) **SUCCESS** at documentation head `7f9dae2b330ebc0d3eef0d593438f3f0ded3f102`. The job completed all steps, including the new HTTP Special Orders credential-metadata/legacy-auth compatibility test. This confirms isolated regression behavior, **not** readiness to activate strict staff security on live routes. Legacy key accepted for compatibility and strict access gates remain unmounted. Do not interpret this as global security completed.

**Next:** verify CI, request Codespaces `git pull --ff-only` then local regression; map sensitive Special Orders operations and worker/service callers to trusted exact grants before mounting the new security policy. No production migrations, Owner activation, Chrome extension package or Railway deploy.

---

## Codespaces secure Lightspeed gateway tests — 2026-11-11

**Status: Testing, not deployed.** Owner ran `node --test --test-concurrency=1 tests/shared-lightspeed-permissions.test.mjs tests/shared-lightspeed-secure-read.test.mjs` in `/workspaces/Lightspeed-security`, branch `integration/security-all-tools-20261111`. First run: **6 PASS, 1 test file failed to load** because `express` package was missing from that checkout; this was a dependency setup problem, not a failed assertion. The owner then executed `npm install --ignore-scripts --no-audit --no-fund --no-save --package-lock=false` (197 packages installed, with deprecation warnings for Multer 1.x, crypto-js, jpeg-exif), and reran both test files: **12 tests, 12 PASS, 0 FAIL, 0 SKIP**. Combined with earlier 19 pass: **31 contract tests passed in two independent runs**. These are mock HTTP and policy tests, not real Lightspeed tenant/production/Chrome acceptance. No Railway change, production data write, or migration.

**Source review for next milestone:** actual `server.js` mounts Core Operations `/api/special-orders` through `special-orders.js`; the existing router accepts legacy admin key or signed Timeclock bearer, not the new shared workstation/MFA/operation policy. `shared-ui/staff-auth.js` retains legacy-key fallback. Review also noted that the `special-orders.js` health response currently exposes **key length metadata** and startup/auth-denial diagnostics log **key lengths**. Recommend a narrowly scoped metadata/log hardening patch in development (avoid changing authentication behavior before coordinated cutover), plus explicit authenticated route mapping and regression tests. Do not enable strict security across production routes until trusted proof and permission adapters, data readers and actual store browser workflows are accepted.

---

## Codespaces shared-security regression milestone — 2026-11-11

**Status: Testing; not deployed.** The owner ran the exact command below in the existing clean `/workspaces/Lightspeed-security` checkout on `integration/security-all-tools-20261111@747e7d6`:
```bash
node --test --test-concurrency=1 \
  tests/shared-staff-security.test.mjs \
  tests/shared-staff-bridge.test.mjs \
  tests/security-all-tools-operations.test.mjs
```
**Operator-reported result:** 19 tests, **19 PASS, 0 FAIL, 0 SKIP**, ~306 ms. Tests cover all declared tool operations, signed active employee session and off-clock access, station vs TOTP vs passkey protection, exact backend grants, spoofing denial, inactive employee, and failed backend behavior. This verifies local isolated policy tests (GitHub CI also previously PASS at latest branch head), **not actual existing route integration, device/browser acceptance or production safety**.

**Next local verification:** run `tests/shared-lightspeed-permissions.test.mjs` and `tests/shared-lightspeed-secure-read.test.mjs` in same Codespace; install dependencies only if missing. Then integrate real consumer routes and owners' tool UI contracts on a development branch. Production Timeclock-only source patch remains staged but unapplied; no DB migration or Owner activation authorization.

---

## Shared read enforcement candidate added — 2026-11-11

**Source:** draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61), `integration/security-all-tools-20261111` based on #60. Selectively ported reviewed PR #33 exact Lightspeed permission registry, PR #33 unmounted shared read router, and PR #38 unmounted secure read policy alongside original tests; dependency module blobs matched the Owner branch. The policy requires *both* separately verified Timeclock-session workstation/MFA assurance and per-operation read permission before invoking service data adapters. Existing `server.js` remains unchanged; no actual business tool endpoint switched.

**Tests:** [CI 43041661174](https://github.com/Tawgod/Lightspeed/actions/runs/43041661174) SUCCESS at code head `39ae126e91554bc051b079fc7b2f90d93e4007fc`, including HTTP read-denial test. **Deployed:** NO, no migration/employee/admin/Owner privileges modified. Next: integrate real feature routes and clients, reconcile remaining Phase 2 readers and navigation; then full-stack browser/staging tests.

---

## All-tools security policy candidate — 2026-11-11

**Implemented:** separate `Tawgod/Lightspeed:integration/security-all-tools-20261111`, stacked draft [PR #61](https://github.com/Tawgod/Lightspeed/pull/61) on top of PR #60 (not the deployed integration branch). Expanded existing `staffAccessBaseline` to cover **all 25 `TOOL_OPERATIONS`** from `adminPermissionCatalog`, retaining deny-by-default on unsupported actions, real Timeclock signed-session verification, independent device/strong-factor assurance and exact backend permission checks. Added a targeted Node-only test suite and CI workflow. **Test result:** [GitHub Actions run 43040636548](https://github.com/Tawgod/Lightspeed/actions/runs/43040636548) SUCCESS; source syntax and 3 policy/bridge suites completed successfully, but no full-stack integration, actual employee or physical-device test. **Deployed:** no; `server.js` not wired; no permission settings changed, no production SQL or Owner activation. Store-owner acceptance of high-impact `special-orders.manage`/`ordering.manage` classification needed before enabling.

**Next:** execute Node tests in private Codespace or CI, reconcile #33/#38/#35/#51/#59, wire backend tool routes and shared browser clients, test Admin/Owner in isolated staging, coordinate Chrome queue. See [SECURITY_COORDINATED_ROLLOUT.md](../SECURITY_COORDINATED_ROLLOUT.md).

---

## Coordinated all-tools security request — 2026-11-11

**Status: In Development / Blocked for deploy.** The owner broadened scope from Timeclock-only default-disabled code to a coordinated security update for all tools, while reporting that staff are not currently using the tools. This does **not** prove that Railway/Discord/background tasks are inactive. See authoritative cross-tool release matrix and gates: [SECURITY_COORDINATED_ROLLOUT.md](../SECURITY_COORDINATED_ROLLOUT.md).

**Read-only GitHub verification:** `Tawgod/Lightspeed` PRs #32 (foundation), #33 (shared reads/permissions), #34 (Admin), #35 (unified navigation), #38 (secure-read), #51 (transport fix), #59 (Timeclock scoped Owner), and #60 (Owner staging adapter) remain open. #33 is currently non-mergeable and has diverged 258 ahead/272 behind its #32 base; latest Owner candidate #60 is 585 ahead/3 behind consolidated production and affects 237 files. Although Owner/Scanner tests for PRs #59/#60 and Admin/nav/foundation tests passed individually, **no combined all-tools build or real employee acceptance exists**. `server.js` is unchanged between production and #60; new security/Owner/Admin modules are not mounted on live core routes, and `shared-ui/staff-auth.js` retains its legacy-key fallback. Do not misrepresent staged code as deployed access enforcement.

**Railway:** Production Timeclock-only patch `20177311-bc46-41cb-b9c6-05b6760a9a6f` remains STAGED, **not applied**. It is not the requested full-tool rollout and must be reconciled before any production commit. The dedicated Owner staging app + PG18 patch remains uncommitted. No production data, secrets, role or deployment changed during this broader audit.

**Next actions:** In Codespaces, reconcile the substantial source divergence into one candidate with targeted tests; wire authenticated backend policy and client consumers; verify Admin/Owner in isolated staging; complete Chrome extension queue coordination and mobile/store-device acceptance; then present a scoped multi-service release with migration/activation steps separately approved. The backup's PG18 54-table restore and USB checksum remain verified; cloud copy visibility was confirmed by the owner, not by connector hash.

---

## Owner Timeclock targeted production release staged — 2026-11-11

**Status: Testing / awaiting deployment approval. Implemented in draft PR #59; tests passed; NOT deployed.** The owner requested to proceed toward Owner login deployment after confirming their encrypted archive is present in the private Google Drive Railway folder. The owner previously authorized only the **default-disabled, code-only PR #59 Timeclock production release** conditional on recoverable backup and blast-radius checks. No authorization extends to live Owner identity enablement, DB schema migrations, secret provisioning, Owner permissions or draft PR #60.

**Live verification, GitHub:** `Tawgod/Lightspeed` draft [PR #59](https://github.com/Tawgod/Lightspeed/pull/59) is still open/unmerged, mergeable; base `integration/hobby-corner-consolidation@014a7a949fe570b756b48d8f59995c1b0a434859`, immutable candidate `a595fd336c5a38dcc5ab5423a8967698777c0929`, 7 paths including Timeclock adapter, fail-closed mount, manual SQL, CI/tests. Candidate workflow runs `42885171115` and Scanner `42885171145` both SUCCESS. Draft [PR #60](https://github.com/Tawgod/Lightspeed/pull/60) remains unmerged, CI `42885210169` and Scanner `42885210127` SUCCESS. No actual browser, employee passkey, TOTP, SQL migration or live endpoint acceptance yet.

**Live verification, Railway:** production `timeclock`, `lightspeed-api` and `special-orders-test` all used `Tawgod/Lightspeed:integration/hobby-corner-consolidation` and were **SUCCESS** at the same `014a7a9...` commit since 2026-11-04. No watch patterns visible; merging PR #59 into shared integration can rebuild all three. The production project had **zero staged changes** before this preflight. Production Timeclock has only existing variable names `DATABASE_URL`, `LIGHTSPEED_DOMAIN`, `LIGHTSPEED_TOKEN`, `SCANNER_SERVICE_SECRET`, `TIMECLOCK_ADMIN_SECRET`, `TIMECLOCK_PIN_PEPPER`, `TIMECLOCK_TIMEZONE`; no Owner-stage opt-in flags or new credentials. New identity routes therefore remain default-disabled after code deployment.

**Prepared but NOT applied:** staged Railway patch `20177311-bc46-41cb-b9c6-05b6760a9a6f` in `Hobby Corner / production`, containing **exactly two non-destructive Timeclock-only source changes**: `source.branch` from `integration/hobby-corner-consolidation` to `feature/owner-timeclock-scoped-credential-20261110`, and `source.commitSha` pinned to `a595fd336c5a38dcc5ab5423a8967698777c0929`. Readback confirmed unchanged `rootDirectory=/timeclock`, build, healthcheck, domain, variables and all other services. **No deployment has started.** This isolates the deployment from the two other production services. Preserve this staged patch uncommitted until the owner gives exact approval to apply the **Timeclock-only, default-disabled, code-only** release.

**Recovery evidence:** owner-reported PG18 encrypted export `hc-production-20261110T213753Z.dump.age` restored 54 tables in disposable Docker; external USB Windows copy SHA-256 matched `55a0b85cea20ebc0fc42e97aecd20d3ebb8368f0752d0e0d2158294592314b81`, decryption passphrase in password manager. Owner confirmed same encrypted file visible in their Railway Google Drive folder, but Drive connector file lookup did not independently retrieve file metadata or hash; second-copy existence is user-reported, not checksum-verified.

**Next steps:** obtain deployment-specific approval to commit staged patch (only Timeclock source pin), inspect resulting Railway deployment until terminal SUCCESS, verify `/health`, confirm disabled Owner endpoints reject, verify unchanged Scanner and daily Timeclock functions, and confirm `lightspeed-api` / `special-orders-test` deployment IDs did not change. If failure, roll back Timeclock to prior successful deployment; do not touch the database. Future live Owner staging login requires **separate** production throttle table migration, separate credentials and exact real employee ID privately configured, isolated staging app/PG role/schema provisioning, origin/RPID and physical passkey + Google Authenticator tests before Owner privileges are granted. Staging app patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` (55 changes) remains uncommitted, unprovisioned and not ready to start.

---

## Production PostgreSQL recovery checkpoint — 2026-11-11

**Status: Testing (operator-reported successful recovery drill); external backup custody pending.** Operator used a private GitHub Codespace and authenticated Railway CLI linked to **Hobby Corner / production / Postgres 18**. Railway's secure localhost tunnel forwarded to port 15432, and the existing export script wrote a passphrase-encrypted `age` archive **outside the repository** at `$HOME/hc-private-db-backups/hc-production-20261110T213753Z.dump.age`. No unencrypted backup was saved intentionally; no database mutation, production migration, deployment, schema change or Owner account activation was performed.

**Operator-reported verification evidence:** initial export helper announced archive verification FAILED; standalone complete `age --decrypt --output /dev/null` returned exit 0, `pg_restore --list` exited 0, and `scripts/verify-production-postgres-backup-codespaces.sh` printed **"Restore drill PASS: 54 public tables in disposable PostgreSQL 18."** The disposable Docker restore ran without public ports or persistent volume and script removes its container. The result was supplied by the owner from Codespaces terminal, not independently queried from production. The false failure was consistent with `pg_restore --list` closing stdin and causing upstream SIGPIPE under `pipefail`.

**Script maintenance:** corrected `scripts/backup-production-postgres-codespaces.sh` on `Tawgod/Hobby-Corner:main` (commit `3697d9b62816a9e88dfb9059f3f98e591b5c1f08`) to check full encrypted-file decryption and then archive-list format independently; revised `docs/POSTGRES_BACKUP_WITHOUT_RAILWAY_TIER.md` (commit `07e9889136d2c8e82e3fc8f8fef798db7acffe72`). Existing successful recovery copy does not need re-export solely due to original list-check failure.

**Checksum checkpoint (operator-reported 2026-11-11):** encrypted archive size `1.4M` (as reported by `ls -lh`), mode `0600`, SHA-256 `55a0b85cea20ebc0fc42e97aecd20d3ebb8368f0752d0e0d2158294592314b81`. Off-Codespace transfer, Windows-side checksum match, and second secure copy are **not yet confirmed**.

**Windows custody checkpoint (operator-reported 2026-11-11):** encrypted `.age` archive was downloaded to `G:\\Hobby Corner\\Backup\\hc-production-20261110T213753Z.dump.age` on the operator's Windows machine (drive type and redundancy not verified). PowerShell `Get-FileHash -Algorithm SHA256` reported `55A0B85CEA20EBC0FC42E97AECD20D3EBB8368F0752D0E0D2158294592314B81`, an **exact case-insensitive match** with the Codespaces archive. Thus one external-to-Codespaces encrypted copy is checksum-verified. Independent second storage and private passphrase custody have **not yet been confirmed**. No authorization to deploy/merge/migrate is implied.

**Passphrase custody confirmation (operator-reported 2026-11-11):** owner confirmed the encrypted backup passphrase has been saved in their password manager. No passphrase was shared or accessed. One checksum-verified Windows G: copy exists; a **second independent storage copy remains unconfirmed**. Continue to hold production release pending deployment blast-radius review and remaining backup custody step.

**Storage clarification (operator-reported 2026-11-11):** Windows G: is an external USB drive; owner plans to copy the existing passphrase-encrypted `.age` archive to their own Google Drive. This Google Drive copy is **planned only, not confirmed uploaded, access-restricted, or checksum-verified**. Keep the decryption passphrase separately in the password manager, avoid sharing the Drive file, and ideally download/cloud-copy-verify the SHA-256 against `55a0b85cea20ebc0fc42e97aecd20d3ebb8368f0752d0e0d2158294592314b81`.

**Google Drive upload report (2026-11-11):** owner stated that the encrypted backup was uploaded to a Railway folder in Google Drive. Connector independently found private folders `Railway` and child `Railway backups` (folder `1FClPbgzdZljQzjqENdoK88omJC000Zom`, `shared=false`), but **search by exact archive filename, name fragments, and listing that folder returned no file** at verification time. Treat cloud upload as **user-reported / independently unverified** until it is visible in metadata and ideally a cloud-side downloaded copy hashes to `55a0b85cea20ebc0fc42e97aecd20d3ebb8368f0752d0e0d2158294592314b81`. Do not claim cloud file is verified or the independent copy gate is closed. USB copy and passphrase custody remain confirmed by the operator. No migrations/deployments approved or performed.

**Remaining backup gate:** Verify byte size and SHA-256 checksum, securely copy encrypted `.age` archive **outside Codespaces and GitHub**, confirm the separate encryption passphrase is retained in a password manager, and verify externally stored file checksum matches. Codespaces storage is not durable offsite backup. Only then treat independent recoverability as established; this remains a logical dump, not PITR. Do not expose database credentials, decrypted data or backup passphrase in chat.

**Still blocked:** Owner authorization for *default-disabled PR #59 code-only release* remains noted, but **do not merge/deploy yet**. Review and constrain the multi-service branch-trigger blast radius across production Timeclock, lightspeed-api and special-orders-test; coordinate release and obtain any further approval needed. No authority to apply production Timeclock throttle SQL, Owner roles, secrets, staged Owner activation, or draft PR #60 staging deployment.

---

## Production release preflight — 2026-11-10 (OWNER AUTHORIZED, HOLD pending verification)

**Authorization:** User approved the **controlled production release of PR #59 only**, with the new Owner-staging endpoints **disabled** and subject to backup verification and deployment checks. This does **not** authorize a production DB migration, enabling Owner staging credentials, assigning Owner roles, enrolling factors, or deploying draft PR #60.

**Live Railway evidence:**
- `Hobby Corner / production / timeclock` service `dd3469bd-5fce-43bc-b9f9-7aa2a7806457` remains **online**; latest deployment `eaaa2b25-2ab5-4b14-b712-f7a6d89e8557`, commit `014a7a949fe570b756b48d8f59995c1b0a434859` from `integration/hobby-corner-consolidation`. 1/1 replica running, no active warnings, no recent failures. Last-hour HTTP error metrics had **zero requests** and therefore do not establish live functional acceptance.
- PR #59 head `a595fd336c5a38dcc5ab5423a8967698777c0929` is 12 commits ahead / 0 behind the live integration branch; 7 paths changed (Timeclock adapter, 6-line additive mount, tests, unapplied SQL, workflow, docs). Still draft/unmerged; GitHub recorded no submitted reviews.
- Final-head CI [Owner/PG16 42885171115](https://github.com/Tawgod/Lightspeed/actions/runs/42885171115) and [Scanner 42885171145](https://github.com/Tawgod/Lightspeed/actions/runs/42885171145) both **SUCCESS**.
- Production `timeclock`, `lightspeed-api` and `special-orders-test` all track **the same `integration/hobby-corner-consolidation` branch**. A merge could trigger multiple service deploys, not only the Timeclock. Production environment has **no staged patch**.
- The latest successful Timeclock deployment is rollback-eligible in Railway, but rollback availability is NOT a substitute for a verified, recoverable PostgreSQL backup.
- Production PostgreSQL service is present and live. **Railway connector does not expose database backup/PITR inventory or restore verification. No recent successful backup/restore evidence was obtained.** Do not mistake source-only schema archives or the database volume for an actual data backup.

**Decision / hold:** The code-only PR #59 release was **NOT merged or deployed** because the user's backup-verification condition is not met. No production database migration, secrets, environment variables, employee records, PINs, credentials, Owner roles, or browser setup were changed. Keep PR #59 draft until backup/recovery and multi-service deployment scope are documented and approved.

**Next release gate:** A trusted operator checks `Hobby Corner → production → Postgres` backup/PITR status through Railway or a verified external backup process, records the latest completed backup and restore target (without supplying DB secrets/customer data), and ensures a recoverable restore procedure. Coordinate branch-triggered impact on `timeclock`, `lightspeed-api`, and `special-orders-test` or agree on a Timeclock-only isolated deployment technique with explicit release authorization. Only then release default-off PR #59; confirm deployment health and denial of Owner-specific routes. Follow-on schema migration and Owner enrollment need separate decisions.

---

## Owner login staging — tested release candidate (2026-11-10)

**Status: In Development.** **Implemented:** scoped Owner staging Timeclock identity integration and isolated DB privilege-group candidate. **Tested:** GitHub Actions PASS. **Deployed:** neither Timeclock integration nor staging; no real Owner login or account activation.

- **Timeclock [draft PR #59](https://github.com/Tawgod/Lightspeed/pull/59):** branch `feature/owner-timeclock-scoped-credential-20261110`, latest docs head `a595fd336c5a38dcc5ab5423a8967698777c0929`. Dedicated, default-off `/api/timeclock/integrations/owner-staging` verification, exact employee restriction, independent credential and HMAC throttle secrets, atomic account attempt limiter. **Unapplied** additive production throttle schema. [Final-head Owner/PG16 CI 42885171115](https://github.com/Tawgod/Lightspeed/actions/runs/42885171115) SUCCESS; [Scanner CI 42885171145](https://github.com/Tawgod/Lightspeed/actions/runs/42885171145) SUCCESS.
- **Owner app [draft PR #60](https://github.com/Tawgod/Lightspeed/pull/60):** branch `feature/owner-staging-scoped-timeclock-adapter-20261110@6b6498a01d0cfca42db273f00e97680d140a6ccb`, stacked on #58/#57/#56. Owner staging session and manual private activation issuer use scoped Timeclock header/routes; Scanner default remains unchanged. Fixed inherited test expecting old Scanner header and expanded CI to all Owner/Admin/Timeclock regressions. Added `db/hc_owner_staging_privilege_groups.sql` (UNAPPLIED: separated NOLOGIN runtime and activation-operator groups, no generated secret or login role) and disposable DB role privilege test. [Final-head multi-version workflow 42885210169](https://github.com/Tawgod/Lightspeed/actions/runs/42885210169) **SUCCESS for PostgreSQL 16 AND 18**, [Scanner CI 42885210127](https://github.com/Tawgod/Lightspeed/actions/runs/42885210127) SUCCESS. No real device/browser acceptance.
- **Railway:** isolated private project `HC Owner Security Staging`, environment `test`, app source staged and pinned to exact PR #60 commit `6b6498a01d0cfca42db273f00e97680d140a6ccb`. PostgreSQL 18, app service and volume remain `staged-create`, deployments null, no domain or credentials. Patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28`, 55 changes, no destructive changes reported. **Do not accept/deploy yet:** app intentionally fails startup without role/schema/secret/origin gates.
- **Controlled release plan:** `Tawgod/Lightspeed:feature/owner-staging-scoped-timeclock-adapter-20261110/docs/OWNER_LOGIN_STAGING_RELEASE_PLAN.md`. Separate explicit owner authorizations remain necessary for production Timeclock schema/merge/deploy, limited activation of dedicated staging identity, staging resource deployment/migrations/secret provisioning, and (later) true Owner role granting. Exact existing active canonical Timeclock employee ID must be confirmed privately by an authorized operator. Do not use synthetic employee 901 or paste PIN/activation/OTP secrets in chat.
- **Next owner decision:** approve or defer *specific controlled production Timeclock release* of PR #59's default-off endpoints and additive throttle SQL with reviewed backup/rollback, **not** simultaneous production Owner commissioning. Follow with isolated staging environment provisioning and physical passkey/TOTP acceptance, separately gated. No Chrome extension release needed.

---

## Latest development milestone — 2026-11-10: scoped Timeclock staging credential and adapter

**Status:** In Development. **Implemented:** dedicated Timeclock staging credential endpoints and staged Owner app adapter. **Tested:** CI passed for both PRs. **Deployed:** none, no production migrations or credentials.

- **Timeclock integration:** [draft PR #59](https://github.com/Tawgod/Lightspeed/pull/59), `feature/owner-timeclock-scoped-credential-20261110@d74513a5faf36dadb57163232f7bf7324f8e1123`, stacked directly on production-tracked integration **but unmerged**. Adds `timeclock/ownerStagingIdentity.js`, default-disabled `/api/timeclock/integrations/owner-staging/{verify-pin,authorize}`, distinct header and credential from existing Scanner, exact operator-selected active employee restriction, synthetic ID 901 denial and browser-origin denial. PIN attempts require transactional PostgreSQL account-global throttle (five attempts/15 minutes), with independent authorize scope and fail-closed failures. Unapplied `timeclock/db/hc_owner_stage_login_limits.sql`.
- **Verification:** [CI 42882186621](https://github.com/Tawgod/Lightspeed/actions/runs/42882186621) SUCCESS: **4 tests, 4 passed, 0 failed, 0 skipped**, including real disposable PostgreSQL 16 cross-pool concurrency and route denial tests. [Scanner integration run 42882186162](https://github.com/Tawgod/Lightspeed/actions/runs/42882186162) SUCCESS. No production Timeclock endpoint/security device test.
- **Owner app compatibility:** [draft PR #60](https://github.com/Tawgod/Lightspeed/pull/60) `feature/owner-staging-scoped-timeclock-adapter-20261110@830f56f79b97aea3fc263642cdb0478a6072c2b0`, stacked on PR #58. Existing Scanner identity adapter gains explicit `mode:'owner-staging'` for header/paths; the Owner staging bundle and private activation issuer opt in. Default Scanner mode remains unchanged. [Adapter CI 42882036649](https://github.com/Tawgod/Lightspeed/actions/runs/42882036649) SUCCESS; [Scanner regression 42882036676](https://github.com/Tawgod/Lightspeed/actions/runs/42882036676) SUCCESS.
- **Railway:** separate project `HC Owner Security Staging` app service source is staged and pinned to PR #60 commit `830f56f79b97aea3fc263642cdb0478a6072c2b0`. Both app and Postgres remain **staged-create**, unprovisioned, no domain or deploy. Existing production Timeclock and legacy synthetic staging remain unchanged.
- **Still blocked:** human review of #59/#60, explicit production Timeclock SQL migration and deployment authorization, dedicated protected production Timeclock staging secret + test-service secret handshake, exact private canonical employee ID confirmation, separate least-privilege Owner staging DB/operator roles and migration verification, staging secret configuration, secure HTTPS hostname/RPID, rate-limiter proxy acceptance, real passkey + TOTP recovery acceptance and separately approved production Owner commissioning. **Do not merge/deploy or create real activation from CI/chat.**

---

## Railway resource preparation — 2026-11-10 (staged only, no deployment)

**Status:** In Development. The owner explicitly authorized preparing/configuring isolated Railway staging resources, **not** deploying or commissioning real Owner credentials.

- Created separate private Railway project `HC Owner Security Staging` (`2b350cde-048e-4402-bd92-4e8ba6c9f877`), environment `test` (`db9d6e8c-bb03-441b-a154-80c11536dfbb`). This avoids the unrelated staged changes in existing `Hobby Corner Integration Test`.
- **Staged only:** `owner-security-staging` empty service (`32566320-229d-4a09-ab3a-9e590c534334`), proposed startup `node staging/owner-security-server.js`, restart-on-failure. GitHub source is **not attached** and no domain exists.
- **Staged only:** Railway PostgreSQL template `Postgres` (`66cbdd3f-39e3-4157-9265-1489523042f0`) with `POSTGRES_DB=hc_owner_stage_test`. Template currently targets PostgreSQL **18**; existing automated tests use PostgreSQL **16**, so review compatibility/version pin before applying the staged patch.
- Staged non-secret flags: `NODE_ENV=test`, `HC_SECURITY_ENV=isolated-staging`, `HC_OWNER_STAGING_ENABLED=false`, `HC_STAGING_TEST_LOGIN_ENABLED=false`, `HC_STAGING_PIN_SETUP_ENABLED=false`. No credentials, employee IDs, database URLs or production secrets were staged. No schema migrations or role grants were performed.
- Railway environment verification: both services are `staged-create`, latest deployments **null**, pending patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` (48 staged changes). **Do not use accept-deploy** until source review, database version/role/schema/security prerequisites and separate explicit staging deploy approval.
- Next gates: validate approved read-only Timeclock service contract and real employee mapping through an authorized backend; establish dedicated migration/runtime DB roles, backups and secret custody; configure HTTPS host and RP ID; review dependency stack PRs #56–#58; then request staging deployment and private device acceptance authorization. Keep first activation issuer operator-only and never use real PIN/token in chat.

### Owner staging source wiring and release review — 2026-11-10

- Attached **staged-only** GitHub source `Tawgod/Lightspeed:feature/owner-staging-real-timeclock-preflight-20261110` to the new `owner-security-staging` Railway service; staged `/health` readiness check (15 seconds), startup `node staging/owner-security-server.js`. **Not pinned** to a commit; pin/review an accepted immutable source before deploying.
- Read source entry point, the canonical Timeclock bridge, staging config validator, DB privilege checker and operator activation issuer. Startup rejects incomplete secrets, HTTPS/RP ID, canonical employee mapping, missing schema and overprivileged runtime DB user; it never performs migrations. Operator activation is an interactive manual process with a ten-minute one-use secret, and must never run in chat/CI or captured logs.
- Railway patch `45d1db2e-1f10-4b27-94e0-c0970c5d2d28` now contains **54 staged changes**, creating only the app, PostgreSQL template and volume. `get_staged_changes` reports non-destructive, but **app cannot start** with `HC_OWNER_STAGING_ENABLED=false` and missing credentials/database schema. Do **not** apply this patch as a ready-to-use setup.
- Still unresolved: reviewed PostgreSQL 18 vs tested PostgreSQL 16 compatibility, separate runtime/operator database role provisioning, real Timeclock account verification, a dedicated credential to existing `timeclock` integration, protected seven staging secrets, exact TLS WebAuthn origin/RPID, approved secure activation and physical device acceptance. Production Timeclock service's `SCANNER_SERVICE_SECRET` exists as a variable name but was **not read/copied/reused**.
- Staging project link: https://railway.com/project/2b350cde-048e-4402-bd92-4e8ba6c9f877 . No domain, deployment, account activation, migrations, credentials or live owner role change.


### Additional preflight: Timeclock credential boundary and immutable staging source — 2026-11-10

- Pinned staged Owner application source to verified `Tawgod/Lightspeed:feature/owner-staging-real-timeclock-preflight-20261110@b17f274910145b324462edc2ec2893a99eb0ca2f`. Git branch pushes will not silently change staged source. Staged verified non-secret `HC_OWNER_TIMECLOCK_ORIGIN=https://timeclock-production-2bfa.up.railway.app`; **no authentication request was made**.
- Audited actual production `timeclock/server.js`: Scanner integration `verify-pin` and `authorize` require the **single** `SCANNER_SERVICE_SECRET` header. The current deployed contract **does not support a separately scoped Owner staging credential**. A dedicated credential requires coordinated Timeclock code/deployment change and explicit production approval, or an approved controlled alternative; do NOT copy the production scanner secret into staging without its own separate decision. Existing admin permission endpoint is not a substitute for owner identity proof.
- Database creation/role migration remains blocked until a reviewed operator-only execution path is available; Railway connector exposes template staging but no remote SQL query/run-command tool. The staged PostgreSQL template's default app credentials are privileged and **must not** be used as Owner runtime account. No safe real login link exists yet.
- Outstanding gates: dedicated Timeclock credential design and authorization; isolated DB runtime/operator role provisioning and schema test; real canonical employee ID private verification; independent secrets and HTTPS domain; controlled staging deploy; private interactive Owner activation; real-device passkey + TOTP acceptance.


### Owner login follow-through — scoped Timeclock credential plan (2026-11-10)

- New separate development branch `Tawgod/Lightspeed:feature/owner-timeclock-scoped-credential-20261110` from authoritative integration; design document `docs/OWNER_STAGING_TIMECLOCK_SCOPED_CREDENTIAL.md`, commit `60464fb587c2a00aaad5c671058d32c9f8e78add`. **Documentation/design only, not implemented or deployed**. Proposed independent Owner-staging PIN/authorization endpoints must fail closed, be restricted to exact active employee, and require durable source/account rate limits and separate credential before any production Timeclock rollout. Do not reuse production `SCANNER_SERVICE_SECRET`.
- Owner staging service source is pinned to `b17f274910145b324462edc2ec2893a99eb0ca2f`; approved public Timeclock domain was verified and staged only as `HC_OWNER_TIMECLOCK_ORIGIN`, without invoking the service. Current Owner app source still expects Scanner endpoints and would need an independently tested adapter update when a scoped endpoint is implemented.
- Railway domain generation returned `ServiceInstance not found` because the service is only `staged-create`. No hostname was assigned. No deployment approval; cannot claim a working setup page.
- Next owner authorization gate: production Timeclock modification/deployment for dedicated staging credential **separate from** staging resource setup authorization, plus staging schema/least privilege, credential handling, and approval to deploy isolated staging.


---

## Latest milestone — 2026-11-10, setup-ready staging safeguards (no deployment)

**System:** Hobby Corner Owner security, existing Timeclock employee identity, passkey + Google Authenticator, multi-Owner Admin.

**Status:** In Development; **implemented:** canonical Timeclock staging composition, dedicated staging launcher and operator-only one-use activation issuer. **Automated tests:** passed. **Deployed:** none; no live Owner setup URL.

**Source:** `Tawgod/Lightspeed:feature/owner-staging-real-timeclock-preflight-20261110`, [draft PR #58](https://github.com/Tawgod/Lightspeed/pull/58), stacked on staging route [PR #57](https://github.com/Tawgod/Lightspeed/pull/57), consolidated Owner [PR #56](https://github.com/Tawgod/Lightspeed/pull/56).

**What changed:** Reused the existing `createTimeclockScannerIdentity` and signed `createStaffAuthGateway`, limiting PIN login and all session reauthorizations to one operator-selected **real active canonical Timeclock ID** (explicitly denying synthetic ID 901 and any other employee). Added strict `validateOwnerTimeclockStagingConfig`, separate staging database name `hc_owner_stage_test`, a fail-closed standalone server that **never auto-migrates**, and `verifyOwnerStagingDatabasePrivileges` that forbids runtime insertion/rewriting of first-Owner approval facts. Added an **interactive, non-CI** activation issuer: canonical Timeclock lookup, exact employee confirmation, random 32-byte secret, SHA-256 digest-only storage, ten-minute expiry, one-use global bootstrap, no public issuance API. Issuer and staging launcher were not run against actual systems.

**Verification:** [GitHub Actions 42863206298](https://github.com/Tawgod/Lightspeed/actions/runs/42863206298) **SUCCESS: 36/36 tests passed; 0 failed, 0 skipped**, including previous Owner/Admin/Timeclock/passkey/TOTP disposable PostgreSQL tests, staged HTTPS/origin and new mock Timeclock, DB privilege, server/issuer safety tests. Tested functional commit `c92e8d38475047c8ba7a0efa31a7e2a546707fea`; docs-only edits followed. **No genuine device/WebAuthn or live Timeclock acceptance.**

**Railway validation:** Existing `Hobby Corner Integration Test` `staff-security-staging` still runs older synthetic staging and was not changed. Attempt to inspect main `Hobby Corner` Railway project service metadata was denied for lack of viewer permission; real Timeclock service endpoint and authorized secret remain unverified. **Do not guess hostnames, connect to a synthetic account, request real PIN/OTP/activation tokens in chat, or use production secrets.**

**Release blockers:** Verified actual canonical Owner Timeclock ID, approved Timeclock service origin/server-side credential, isolated HTTPS staging domain, dedicated app/operator database roles and reviewed migrations/backups, separate stored secrets, true phone/security-key WebAuthn acceptance and Google Authenticator QR confirmation, secure recovery, browser reverse-proxy acceptance, PR stack integration/branch checks, explicit staging deployment and later production authorization.

**Docs:** `Tawgod/Lightspeed:feature/owner-staging-real-timeclock-preflight-20261110/docs/OWNER_STAGING_SETUP_READINESS.md`, updated `CHANGELOG.md`. No Chrome extension release involved.

**Recommended next action:** Arrange authorized read-only Timeclock service metadata/identity mapping and dedicated isolated staging DB/HTTPS secrets. After separate staging deployment approval, physically test the actual user's existing Timeclock session, passkey and Google Authenticator under an approved non-production policy. Request further explicit approval for real Owner role assignment and production migration. No changes to live employee account, PIN, passkey, TOTP secret, role, Railway service, or production data.

---

## Latest milestone — 2026-11-10, isolated Owner security staging composition

**System / feature:** Existing Timeclock Owner activation, passkey verification, same-account Google Authenticator and multi-Owner Admin.

**Status:** In Development; **implemented** as unmounted opt-in test-only assembly, **tested** via 29 full combined automated tests, **not deployed** and **not live**.

**Source:** `Tawgod/Lightspeed:feature/owner-staging-wiring-20261110`, [draft PR #57](https://github.com/Tawgod/Lightspeed/pull/57) based on unified Owner [PR #56](https://github.com/Tawgod/Lightspeed/pull/56), which reconciles original Owner stack #50/#53/#54/#55 with multi-Owner Admin #52.

**What changed:** Modified `operatorFirstOwnerPasskeyCandidate.js` and `isolatedFirstOwnerSetup.js` to expose WebAuthn authentication/verification using the **same** credential store, signed session and signing key after first Owner registration. Added `ownerSecurityStagingMount.js` to compose the existing verified Timeclock login adapter, protected one-time owner setup screen, persistent passkey verification and **existing** encrypted staff Google Authenticator settings on one exact HTTPS origin and matching RP ID. Fails closed on missing trusted adapters, production environment, synthetic test employee 901, or unsafe origin. Mutating endpoints check exact Origin and same-origin fetch metadata. Existing security settings UI gets a **memory-only** `HCStaffAuth` bridge instead of inheriting the general shared-ui sessionStorage and legacy API-key handling; other tools' auth client is unchanged. No operator approval issuance or Owner role auto-elevation API added.

**Testing:** [GitHub Actions 42860683805](https://github.com/Tawgod/Lightspeed/actions/runs/42860683805) **SUCCESS — 29 tests passed, 0 failed, 0 skipped**, encompassing prior Owner, Admin, Timeclock, disposable PostgreSQL 16, TOTP and browser HTTP contracts plus new staging mount, synthetic-account denial, shared auth client and registered WebAuthn verification endpoint. Latest functional test commit `e641c7979c298fd029e757955266a711e28de79b`. Browser WebAuthn is **mocked** in integration tests, so no real hardware/mobile passkey acceptance established.

**Verified Railway context:** Existing project `Hobby Corner Integration Test`, environment `test`, service `staff-security-staging` still reports an older success deployment from `feature/employee-admin-security-foundation-20261106` at `21a44f4f06ebaacec3d005344faa89f8907feb46`, not PR #57. Its legacy PIN environment is synthetic-only; never treat it as the actual user's signed Timeclock employee session or promote staging employee 901.

**Documentation:** `docs/OWNER_SECURITY_STAGING_WIRING.md` and `CHANGELOG.md` updated on #57.

**Remaining blockers:** Authorized read-only actual Timeclock employee mapping/session adapter, isolated HTTPS staging origin and WebAuthn RP ID, separate activation token issuer/private delivery and DB privileges, real physical authenticator/passkey testing, employee factor recovery, logging/CSRF/proxy acceptance, staging deployment approval, review of all stacked PRs/branch protection and separately approved live Owner role migration/grant.

**Recommended next:** Validate a real signed Timeclock session through a reviewed read-only backend in a **new isolated** HTTPS staging environment, then perform actual device WebAuthn and Google Authenticator enrollment tests with explicit authorization. Do not reuse or modify the synthetic existing staging account for real employee credentials. No production migrations, deployment, Owner grants, PIN changes, Railway changes or extension releases were made.

---

## Latest verified milestone — 2026-11-10, unified Owner security / Admin integration

**Status:** In Development. **Implemented:** consolidated first Owner + passkey + same-account Authenticator + multi-Owner role delegation in one draft source branch. **Tested:** combined 27/27 automated tests and separate existing Admin integration contract passed. **Deployed:** nothing; all new Owner setup components unmounted/test-only.

**Source:** `Tawgod/Lightspeed:integration/owner-security-unified-20261110`, [draft PR #56](https://github.com/Tawgod/Lightspeed/pull/56), based on first Owner/Authenticator stack #50 → #53 → #54 → #55 and carrying over multiple-Owner Admin changes from #52 (Admin #34). Functional tested commit `b5308cb89d87f986d102e41badd8b9f335ef7cfc`; subsequent docs commits on branch do not alter runtime behavior.

**Resolved divergence:** Admin schema's obsolete single-active-Owner index removed while first Owner bootstrap remains one-time and blocks after any Owner principal exists; later Owners can be appointed only by existing active strongly authenticated Owner to a canonical active Timeclock employee, with no self-elevation, no last-Owner revocation, serial transactions and immutable audit. Active Owners inherit known tool grants, not an exemption from per-operation write/MFA controls. Existing Timeclock account/PIN stays intact; no external business identity verification provider in the requested UX. The old experimental independent-signature alternative is not wired into the new activation route and must not be deployed as an additional bootstrap path.

**CI:** [Unified run 42857873844](https://github.com/Tawgod/Lightspeed/actions/runs/42857873844) **SUCCESS: 27 passed, 0 failed, 0 skipped**, disposable Postgres16, 12 Owner/Timeclock/Admin test files, including rollback, challenge replay, passkey-backed TOTP confirmation, active Owner role and Admin route denial. [Existing Employee Admin integration 42857873617](https://github.com/Tawgod/Lightspeed/actions/runs/42857873617) **SUCCESS**. WebAuthn device verification is mocked within integration tests; real browser/device acceptance remains unverified.

**Acceptance/release blockers:** exact real canonical Timeclock employee mapping via authorized read-only backend; independently protected one-time operator-selected activation and least-privilege DB grants; secure HTTPS origin/CSRF/host review; a real passkey ceremony; TOTP QR and code verification on user's phone; key custody, factor recovery and backup; admin multiple-Owner UI finalization; reconciliation of pending draft PR ancestry and staging/production deployment reviews. New test-only factories throw in production, and no real Owner screen URL currently exists.

**Documentation:** `Tawgod/Lightspeed:integration/owner-security-unified-20261110/docs/UNIFIED_OWNER_SECURITY_HANDOFF.md`. `CHANGELOG.md` updated on the integration branch.

**Safety:** No Timeclock record, employee PIN, live Owner permission, passkey, Authenticator enrollment, Railway service, production migration, Chrome extension or merge was modified.

**Recommended next action:** Build isolated real-browser staging assembly (signed Timeclock + approved private activation + WebAuthn + TOTP) without reusing synthetic staging Owner, then validate actual device acceptance. Request explicit authorization before any production DB migration, deployment or live employee role assignment.

---

## Latest milestone — 2026-11-10, Owner passkey-to-Authenticator self-enrollment

**Status:** In Development. **Implemented:** reusable tested backend composition plus Owner-only browser control in the existing Employee Security Settings. **Testing:** combined Owner HTTP/PostgreSQL/TOTP/UI suite **21 passed, 0 failed, 0 skipped** at [GitHub Actions 42855023414](https://github.com/Tawgod/Lightspeed/actions/runs/42855023414), tested commit `41bf9b235dcf6d49a211329e96f69d26e44190b6`. No real-device browser acceptance. **Deployed:** none.

**User goal:** Attach passkey and Google Authenticator to the **existing active Timeclock employee account** without changing the four-digit PIN or using an external ownership-verification provider. Owner gets full access and can appoint additional Owners through Admin after setup.

**Source:** [Lightspeed draft PR #55](https://github.com/Tawgod/Lightspeed/pull/55), branch `feature/owner-passkey-totp-enrollment-20261110`, stacked on Owner browser [#54](https://github.com/Tawgod/Lightspeed/pull/54), operator activation [#53](https://github.com/Tawgod/Lightspeed/pull/53), first-passkey [#50](https://github.com/Tawgod/Lightspeed/pull/50). Separate Admin multi-Owner [#52](https://github.com/Tawgod/Lightspeed/pull/52) must be reconciled.

**What changed:** Added `services/security/ownerPasskeyTotpEnrollmentCandidate.js` to reuse the existing durable staff TOTP approval/encryption/QR workflow, while allowing an **already active Owner** to approve enrollment of their own employee-bound Authenticator only after a fresh **server-verified registered passkey/security-key**. Denies PIN-only, inactive Owner, wrong employee, stale factor or absent Owner role. Preserves separate factor-recovery controls. The existing `staff-security.html` and `staff-security-client.js` now offer **Approve my setup with passkey (Owner only)**: native browser passkey authentication through existing `staff-passkey/authentication` routes, then short-lived proof to existing `staff-security/api/enrollment-approve`. No new TOTP table, no duplicate account and no persistent storage of factor proofs in browser.

**Verified evidence:** Original backend-specific run [42854055904](https://github.com/Tawgod/Lightspeed/actions/runs/42854055904) **SUCCESS** (disposable PostgreSQL first Owner TOTP enrollment). The preceding combined Owner HTTP + first-passkey suite [42854592617](https://github.com/Tawgod/Lightspeed/actions/runs/42854592617) **SUCCESS**, but its workflow omitted the newly added TOTP tests; this was found and corrected in workflow commit `41bf9b235dcf6d49a211329e96f69d26e44190b6`. The corrected combined run [42855023414](https://github.com/Tawgod/Lightspeed/actions/runs/42855023414) **SUCCESS**, with 21/21 tests passing, including `tests/owner-passkey-totp-enrollment-postgres.test.mjs`, `tests/owner-authenticator-ui-contract.test.mjs` and existing Owner/Timeclock regressions. This verifies automated development contracts, **not real-device UI acceptance or deployment**.

**Release blockers:** None of these services is mounted on an approved real-user HTTPS Railway environment. Operator-configured exact real Timeclock employee ID and short-lived activation issuance/DB privileges, production-safe CSRF/origin, real device WebAuthn sign/verify, full factor recovery, TOTP QR/OTP acceptance, multi-Owner schema reconciliation, explicit rollout approval are still required. Existing synthetic test account 901 must never be promoted as the real Owner. No live PIN, employee, authenticator, database, deployment, or Chrome extension change occurred.

**Next action:** Complete combined CI; reconcile stacked branches and Admin #52; stage an approved secure real-Timeclock browser acceptance path **without** altering production permissions, then request explicit production commissioning permission.

---

## Latest milestone — 2026-11-10, protected first Owner browser candidate

**Status:** In Development; browser/setup route candidate implemented and source tested; **not mounted, not deployed, no live Owner**.

**What changed:** [Draft Lightspeed PR #54](https://github.com/Tawgod/Lightspeed/pull/54), `feature/owner-activation-browser-20261110`, stacked on [operator activation PR #53](https://github.com/Tawgod/Lightspeed/pull/53). Added `owner-setup/index.html`, `styles.css` and `client.js` to sign in with the **existing Timeclock PIN** through the existing signed staff-session endpoint, privately enter a separate one-time activation, then register a native WebAuthn passkey. Added unmounted `routes/firstOwnerActivation.js` enforcing exact TLS origin (test-only localhost), strict same-origin fetch/Origin/JSON, secret header, bounded payloads, sanitized errors and restrictive CSP/no-store headers. `services/security/isolatedFirstOwnerSetup.js` composes the operator-first-Owner passkey candidate and route **only for isolated test environments**, with no approval-secret issuer and no server mount. Client keeps login and activation out of persistent browser storage.

**Tested:** [GitHub Actions 42852751541](https://github.com/Tawgod/Lightspeed/actions/runs/42852751541) **SUCCESS — 7 passed, 0 failed, 0 skipped** on functional commit `c53e6ac846bacc6296f06474e6816cb27392a422`. The test combines protected HTTP route checks, disabled-by-default composer and prior disposable PostgreSQL Owner passkey/transaction tests. **It does not establish real-device browser WebAuthn or real Timeclock identity**, and UI has not been manually accepted.

**Reused existing system:** `staff-security.html`, `staff-security-client.js`, `createPrimaryTimeclockTotpSubsystem` and the existing encrypted/approved `staffTotpPostgres` already support Google Authenticator setup, QR, six-digit confirmation and session MFA. Do not create a duplicate system. Current enrollment request flow requires a separate manager approval; reconcile initial Owner self-enrollment under a *fresh verified new Owner passkey and exact Owner grant* without PIN-only approval, then protect recovery. This is the next implementation blocker.

**Dependencies:** Reconcile #54 → #53 → #50 with **multiple-Owner Admin PR #52**, which lives on a different stacked Admin branch and removes the old one-active-Owner index. Protect first-Owner exclusivity while permitting later Owner appointments. Coordinate real canonical employee mapping and live HTTPS/WebAuthn with the Timeclock security owner. No Chrome extension release was prepared.

**Sources:** `Tawgod/Lightspeed:feature/owner-activation-browser-20261110/docs/FIRST_OWNER_BROWSER_ENROLLMENT.md`; `Tawgod/Lightspeed:feature/admin-multiple-owners-20261110/docs/SIMPLIFIED_OWNER_SETUP.md`.

**No live change:** No production database migration, PIN/Timeclock employee change, passkey, authenticator seed, real activation token, Railway deployment or admin role assignment. The user's existing PIN is unchanged.

**Next action:** Integrate fresh Owner passkey proof into the existing TOTP approval flow, accept a physical device in an authorized isolated HTTPS environment, reconcile multi-Owner schema/branches, and request explicit approval before creating the first live Owner credential.

---

## Latest milestone — 2026-11-10, operator-selected first Owner activation

**Status:** In Development. **Implemented:** one-time bootstrap source candidate. **Tested:** disposable PostgreSQL suite passed. **Deployed:** nothing.

**User's confirmed workflow:** Existing Timeclock account and PIN remain unchanged. Primary Owner receives full Admin and recognized tool permissions and can assign additional Owners through strongly authenticated Admin controls. Add a passkey and Google Authenticator to that same employee account. Do not require third-party business-ownership verification.

**What changed:** Draft [Lightspeed PR #53](https://github.com/Tawgod/Lightspeed/pull/53), branch `feature/first-owner-operator-bootstrap-20261110`, stacked on #50, introduces a separate **operator-selected** Owner enrollment alternative. A deployment operator must confirm the exact real active Timeclock employee ID and provision a single 32-byte activation secret privately; only its SHA-256 digest enters the database. The proposed approval expires in 15 minutes. An unmounted test-only adapter requires both the signed canonical Timeclock employee session and private operator activation, then uses existing WebAuthn registration to atomically create passkey, Owner grant, consumed authorization and append-only audit. No PIN or first-visitor promotion, external ownership provider or live employee selection was introduced.

**Testing:** [GitHub Actions run 42848285658](https://github.com/Tawgod/Lightspeed/actions/runs/42848285658) **SUCCESS**, 4 tests passed / 0 failed / 0 skipped. Tests include missing/wrong secret, wrong employee, first Owner passkey, forced audit-write rollback and challenge replay denial; successful WebAuthn verification uses a fixture, not a physical authenticator. Proposed activation SQL was executed only in disposable `hc_test` PostgreSQL.

**Cross-branch dependencies:** [PR #52](https://github.com/Tawgod/Lightspeed/pull/52) provides tested multi-Owner Admin appointment/revocation and Owner tool permissions, but is stacked on Admin #34 rather than PR #50/#53. Reconcile the old single-Owner index with PR #52 before any actual migration. Retain prior signed-attestation PR #45/#50 as unmounted development alternatives; don't deploy them unchanged or require third-party identity proof. Add the enrollment UI, CSRF and log protections, exactly scoped DB grants, real Timeclock mapping, device WebAuthn, Google Authenticator TOTP/recovery, and approved deployment.

**Source / documentation:** `Tawgod/Lightspeed:feature/first-owner-operator-bootstrap-20261110/docs/FIRST_OWNER_OPERATOR_SETUP.md`; `db/hc_first_owner_operator_activation.sql`; `services/security/operatorFirstOwnerPasskeyCandidate.js`; `tests/operator-first-owner-postgres.test.mjs`; PR head documented via GitHub PR #53.

**Safety:** No activation tokens or actual Timeclock ID generated, exposed or requested in chat. No real PIN, Owner grant, TOTP factor, passkey, production database, Railway service, extension or deployed service changed. Initial Owner enrollment is NOT available for use yet.

**Next:** Reconcile #53 with #52; create protected first Owner passkey enrollment screen in isolated development; verify real HTTPS browser/WebAuthn and TOTP enrollment with a non-production identity; review exact Timeclock employee selection and approval ceremony, then request explicit authorization for a production role assignment.

---

## Revised Owner requirements and implementation — 2026-11-10

**User decision:** The first Owner is the user's **existing real Timeclock employee identity**. Preserve the four-digit PIN and attach Google Authenticator TOTP plus a passkey to **that account**. Primary Owner has full Admin and recognized tool permissions and can appoint additional Owners or delegate granular permissions in the Admin menu. The user does **not** require third-party business-ownership verification. Keep a one-time operator-controlled initial Owner provisioning process, with a protected activation path, rather than permit self-elevation using a PIN or browser-supplied role. **This supersedes the earlier proposal to require an external business identity verifier.**

**Implemented in development:** [Draft Lightspeed PR #52](https://github.com/Tawgod/Lightspeed/pull/52), `feature/admin-multiple-owners-20261110`, stacked on draft Admin PR #34. `db/hc_admin_delegations.sql` drops the restrictive one-active-Owner draft index and adds `owner_appoint` / `owner_revoke` audit events. `adminDelegationsPostgres.js` adds a strongly authenticated current Owner's appointment/revocation of another canonical active employee, serialized in PostgreSQL with no self-appointed Owner, no TOTP-only elevation, no automatic reactivation and final-Owner protection. Active Owners inherit all recognized tool grant-layer permissions **without bypassing authentication, tool write controls or audit**. `routes/employeeAdmin.js` adds an optional unmounted `POST /api/owners` endpoint with backend-only permission validation. The app has **not** set the user's real Owner role.

**Tested:** Initial CI discovered a concurrent DDL collision from separately running PostgreSQL tests; test runner was corrected to `--test-concurrency=1`. Later full route / database suites [GitHub Actions 42846744282](https://github.com/Tawgod/Lightspeed/actions/runs/42846744282) **SUCCESS**, and [Admin integration 42846744279](https://github.com/Tawgod/Lightspeed/actions/runs/42846744279) **SUCCESS** on functional commit `62e1a6037343eae286b273ba5ff9e75d3beebee6`. Synthetic employee IDs in tests are fixtures, not real identity assignments.

**Coordination:** [Draft Owner commissioning/passkey PR #50](https://github.com/Tawgod/Lightspeed/pull/50) has tested passkey/Postgres transaction logic but its external Ed25519 business-verifier dependency is **no longer the desired initial setup workflow**. Do not deploy PR #50 unchanged. Reconcile into a one-time deployment-operator-configured primary Timeclock ID, signed canonical session, protected temporary activation and WebAuthn enrollment transaction. Existing TOTP enrollment needs current Owner strong step-up, verified code, recovery safeguards and real-browser acceptance. Source requirements are documented at `Tawgod/Lightspeed:feature/admin-multiple-owners-20261110/docs/SIMPLIFIED_OWNER_SETUP.md`.

**Status:** In Development; new multiple Owner code implemented, automated tests passed, unmounted, no migrations or role changes deployed. No Timeclock PIN, passkey, TOTP secret, credential, active employee, Railway or Chrome release modified.

**Next recommended action:** Implement and test operator-configured **initial Owner** one-time activation on the user's existing Timeclock employee session, register a real passkey through an authenticated browser, then add TOTP and recovery to the same account. Coordinate PR #52 and #50 with Admin foundation #34 and request explicit approval before any real employee promotion, migration, deployment or credential setup.

---

## Latest first-Owner milestone — 2026-11-10

**System / feature:** Shared staff identity, Employee Administration, first real Owner passkey commissioning, future primary PIN Authenticator enrollment.

**Status:** In Development; **implemented in unmounted test-only source**, **automated tests passed**, **not deployed**, **no live Owner employee verified**.

**Source:** `Tawgod/Lightspeed:feature/first-owner-passkey-registration-integration-20261110`, [draft PR #50](https://github.com/Tawgod/Lightspeed/pull/50), stacked on PRs #39–45. Functional tested commit `71e0ce2647950036bdc46cfa4d9ea16a8b0bc7cc`; latest docs/Codespaces branch commit recorded on PR.

**What changed:** Fixed corrupted/unapplied `db/hc_owner_commissioning.sql`. Added `services/security/firstOwnerPasskeyRegistrationCandidate.js`, an **unmounted test-mode-only** composition of canonical signed Timeclock session, independently signed 30-minute offline approval and existing PostgreSQL passkey ceremony with atomic first Owner+passkey+append-only audit. The app cannot create its own offline approval, derive Owner from a PIN, or copy synthetic employee 901 factors. Added disposable PostgreSQL CI including forced audit-insert failure to prove the Owner, credential and approval consumption all roll back. Added optional Node22/Postgres16 test-only `.devcontainer/` and `docs/FIRST_OWNER_CODESPACES_TESTING.md`; no Codespace was started and its setup has not been manually accepted.

**Testing:** [GitHub Actions 42835416894](https://github.com/Tawgod/Lightspeed/actions/runs/42835416894) **SUCCESS** (20 tests, none skipped). Following fault-injection fixture correction, [GitHub Actions 42835824260](https://github.com/Tawgod/Lightspeed/actions/runs/42835824260) **SUCCESS** (20 tests, none skipped) with real disposable PostgreSQL schema and transactional rollback. New test simulates WebAuthn registration verification; prior suites separately test cryptographic assertions. **No physical-device or real-employee acceptance**.

**Deployed:** Nothing. Railway, production schema, live Timeclock PIN/employee, Owner grant, authenticator seed, Chrome extension and existing synthetic staging remain unchanged.

**Remaining decisions/blockers:** A legitimate independent human Owner identity verifier and auditable offline signer/operator/key custody; production DB grants/privilege review; real read-only Timeclock identity acceptance; origin/CSRF controls and physical-device passkey/recovery tests; PR ancestry/release coordination; explicit approval for any production migration or deployment. Do not infer that passing fixture CI means a real Owner setup URL is ready.

**Next recommended action:** Agree on independent Owner verification authority, then implement its independently controlled issuance/recovery and run real signed Timeclock read-only acceptance in an approved isolated environment. Codespaces can support local disposable DB/browser testing once separately launched by a user; available connectors do not currently control Codespaces.

---

**Last verified:** 2026-11-10  
**Status:** In Development (read-only foundation), Testing (automated); no admin production or staging deployment

## Source

- Repository: `Tawgod/Lightspeed`
- Development branch: `feature/employee-admin-security-foundation-20261106`
- Current PR: [#34 — employee administration foundation](https://github.com/Tawgod/Lightspeed/pull/34), **DRAFT**, stacked on Phase 1 PR #32
- Final development/docs head at verification: `bece86f8c05bee0da423582e4e82122195697512`
- Current runtime source for unrelated isolated security testing: `Tawgod/Lightspeed:feature/shared-lightspeed-services-phase1-20261029`, `staff-security-staging` on Railway (independent; PR #34 NOT deployed)
- Authoritative consolidated production base: `Tawgod/Lightspeed:integration/hobby-corner-consolidation`. Not modified by PR #34.
- Superseded branches/PRs: none; preserve dependency on PRs #32/#33 and extension release queue.

## Requirements

Single protected administration menu for **all configurable settings from current and future Hobby Corner tools**, as well as employees, Timeclock information and settings not exclusively owned by Lightspeed, individually scoped tool/item-create permissions, local/remote login windows, PIN management/recovery and a verified-store-computer installation/download link.

Entry to admin must require independently verified enrolled **passkey OR Authenticator**, even on trusted store devices, plus active employee identity and exact administrator grant. Sensitive changes require fresh stronger cryptographic proof. Central menu must never invent a working setting merely because its category appears in the UI.

## Implemented

- Server-only fail-closed admin authorization gate in `services/security/employeeAdminAccess.js`; blocks PIN-only or device-only admission, checks active employee session, factor freshness/binding via trusted injected verifiers and exact permission.
- Source-owned central tool setting registry in `services/security/adminSettingsRegistry.js`. Supports Security, Employees, Timeclock, Tool Permissions and Tool Settings. Actual values are unconnected; some candidates marked planned or requiring audit.
- Read-only `routes/employeeAdmin.js` APIs (overview, registry listing, registry detail), with strong admin gate, no-store, strict static-page CSP and **no write endpoints**. **Not mounted anywhere in a runtime service.**
- Responsive inert UI `admin/employee-admin.{html,css}`, `admin/employee-admin-client.js`, requiring a future trusted browser admin factor injector; browser without one cannot load protected data. No raw credentials or secrets stored.
- Local versus remote idle/absolute timeout validator and change preview in `services/security/adminSessionPolicy.js`; default 900 seconds each, matching currently tested 15-minute base session; no live policy changes.
- Unapplied, additive `db/hc_admin_session_policies.sql` and `services/security/adminSessionPolicyPostgres.js`: durable policy version guard, explicit fresh strong admin authorization, audited changes and append-only event history. **Not wired into Timeclock/scanner session minting or validated live.**
- `docs/EMPLOYEE_ADMIN_FOUNDATION.md` and branch `CHANGELOG.md` added for integration and release restrictions.

## Tested

- Automated: GitHub Actions [Shared Lightspeed foundation run 42275711630](https://github.com/Tawgod/Lightspeed/actions/runs/42275711630) **SUCCESS** at source/CI commit `cf6689f610c3825306115ae4287cddd6326cbfef`. Tests `tests/employee-admin-access.test.mjs`, `employee-admin-router.test.mjs`, `employee-admin-client.test.mjs`, `employee-admin-session-policy.test.mjs`, `employee-admin-session-policy-postgres.test.mjs`. Disposable PostgreSQL confirmed audited policy writes, expected-version conflict detection and immutable history.
- Browser / employee acceptance: **not started** for new admin panel. Existing independent security staging Owner's passkey and Google Authenticator tests cannot be treated as admin-shell acceptance.
- Runtime / deployment verification: **not applicable** because no service deployment performed.

## Deployed

- Environment: none for admin panel
- Service / extension version: none
- Deployment reference: none for this feature
- Production status: **not deployed**, no production data or authentication policy modified

## Shared dependencies

- Shared Timeclock employee/PIN identity + signed active employee session; independent verified MFA/passkey.
- Shared Lightspeed authorization and audited gateway; per-tool permission contracts.
- Core Operations/Timeclock employee roster, time records, PTO, shifts and existing audited PIN management APIs.
- Shared UI/UX and Deployment Coordination for responsive admin tool and trust boundary.
- Chrome extension queue and authoritative consolidated source for any verified workstation installer/provisioning.
- Hobby Corner Manager for policy/default values, manager roles and rollout decisions.

## Shared files / integration surfaces affected

New development-only `services/security/adminSettingsRegistry.js`, `employeeAdminAccess.js`, `adminSessionPolicy.js`, `adminSessionPolicyPostgres.js`, `routes/employeeAdmin.js`, `admin/employee-admin.{html,css}`, `admin/employee-admin-client.js`, `db/hc_admin_session_policies.sql`, `tests/employee-admin-*.test.mjs`, and Phase 1 branch-derived foundation workflow. No modifications to current production `server.js`, Timeclock, Chrome extension source or Railway deployment.

## Remaining blockers

- Actual trusted admin login integration: passkey/WebAuthn or enrolled TOTP verified for same signed employee session, plus backend owner/manager grants; no safe production admin bootstrap shortcut.
- Backend owner-approved permissions and audit for PIN/security changes, device management, policy edits and employee data reads; existing Timeclock legacy routes must be hardened without breaking clocking.
- Actual server enforcement for configurable session idle/absolute duration, secure revocation, active-session migration, and local workstation proof.
- Genuine tool-specific configurable settings inventory/validators; registry candidates do not confirm exposed values.
- Verified installer/update link and approved unique per-computer key enrollment, requiring Chrome release queue coordination.
- End-to-end security review, browser tests, rollback and owner production authorization before exposure.

## Decisions needed

- Initial approved local/remote idle and absolute session windows (examples in spec are NOT live).
- Owner-only versus delegated manager control for PIN reset, permissions, session policies and device approval; recovery/dual control.
- Exact employee data allowed in admin versus Lightspeed and payroll-owned sources.
- Official signed extension/installer distribution method and device approval workflow.

## Recommended next action

1. Obtain/implement real vetted owner/manager admin authorization and independent factor proof adapter, then stage a **read-only** panel behind those gates.
2. Connect permitted Timeclock roster/status reads and relevant existing settings with safe source ownership.
3. Integrate policy enforcement and revocation in separate controlled staging, run concurrent and timeout acceptance before enabling edits.
4. Integrate PIN/permission/device management with fresh strong factor, exact operation grants, audit and readback; reconcile Chrome release queue before any package.
5. Obtain store-browser acceptance and explicit deployment approval.

## Restrictions / safety

Do not edit production employee PINs, privileged grants, Lightspeed records, Timeclock routes or Chrome source; don't deploy or merge PR #34 without separate review. Do not present future controls or settings registry entries as working configuration. No production-side policy migration or extensions authorized by this handoff.

## Documentation

- `Tawgod/Hobby-Corner:main/EMPLOYEE_ADMIN_SECURITY_PANEL.md`
- `Tawgod/Hobby-Corner:main/HOBBY_CORNER_PROJECT.md`
- `Tawgod/Hobby-Corner:main/SHARED_STAFF_AUTH_PERMISSIONS.md`
- `Tawgod/Hobby-Corner:main/STAFF_SECURITY_BASELINE.md`
- `Tawgod/Hobby-Corner:main/CHROME_EXTENSION_RELEASE_QUEUE.md`
- `Tawgod/Hobby-Corner:main/handoffs/lightspeed-shared-services.md`
- `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106/docs/EMPLOYEE_ADMIN_FOUNDATION.md`

## Owner and delegated manager permissions — 2026-11-06

**Status: In Development; implemented and CI-tested on draft PR #34, no production or staging deployment.**

Owner requirement: Owner must be visible as `Owner` (after real Timeclock identity verified/commissioned). Owner can independently grant/revoke admin-panel access and specific management actions per employee. Delegated managers may be authorized to onboard new employees and modify selected tool settings or per-employee tool permissions **without access to private staff records** or general employee data. Not every manager is an admin; no implicit rights from workstation, role label or PIN.

**Code implemented:** `services/security/adminPermissionCatalog.js` exact admin/tool operation registry; `db/hc_admin_delegations.sql` durable non-auto-provisioned Owner/delegated principals, explicit grants, scoped allowed tool operations and setting IDs, individual employee tool grants, immutable audit history; `services/security/adminDelegationsPostgres.js` active-Timeclock-target validation, Owner-only strong-factor admin delegation and scopes, manager-only scoped tool rights, self/Owner modification denial, revocation; `services/security/adminOwnerCommissioning.js` unmounted one-time owner commission requiring explicitly configured expected real Timeclock employee ID and independently verified dedicated Owner passkey ceremony. No account was actually commissioned. `routes/employeeAdmin.js` protected management APIs under injection and restricted metadata to manager; admin UI now displays `Owner` or `Delegated administrator` from trusted server role and includes scope-dependent permission forms.

**Tests:** Real disposable PostgreSQL delegation regression `tests/employee-admin-delegations-postgres.test.mjs` checks no ungranted admin, restricted manager onboarding capability, disallowed private Timeclock/PIN/role actions, tool-operation and settings scope enforcement, invalid inactive/unverified employee targets, Owner/self denial, fresh strong factor on permission writes, revocation and immutable audit. HTTP regression `tests/employee-admin-delegated-router.test.mjs` verifies sections/settings are filtered and admin escalation denied. `tests/employee-admin-owner-commissioning.test.mjs` checks configured employee identity, dedicated passkey purpose, no TOTP-only claim and no second Owner. GitHub Actions **Shared Lightspeed foundation workflow `42284308898` SUCCESS** for Phase-1-stacked PR #34 at commit `4e31d2af289a0bc4b483ea56fed9c5769da988e3`. Later commits were documentation only.

**Remaining:** Real Owner Timeclock ID and passkey commissioning is not configured; `admin.read`/tool/setting admin grants are not applied to any actual employee; actual Timeclock employee signup and private roster adapters are not built; tool-settings editors and production enforcement are still unconnected; no admin route mounted or released. Current synthetic 901 Owner exists only in disposable tests and prior isolated security test account, not proof of production Owner assignment. No live PIN, Timeclock, Lightspeed, tool permission, Chrome extension or Railway change occurred.

**Next:** Verify actual Owner's Timeclock identity and stronger credential through an approved commissioning process, then mount a **read-only admin interface in isolated staging** using real verified permissions, add minimal employee search/picker and a protected employee-onboarding workflow (not general private data browse), and connect per-tool setting validators and permissions enforcement one tool at a time after owner authorization.

## Isolated read-only admin sign-in candidate — 2026-11-06

**Status:** In Development; coded and automated tests PASS; **not staged or deployed to Railway**.

- Development branch `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106`, draft PR #34, currently at `160fc84e4c2d2478a706222282941def71e5bdce` (documentation-only change after tested commit). Underlying app source tested by Shared Lightspeed foundation GitHub Actions `42293979612` **SUCCESS**, including browser and HTTP behavior.
- Built `staging/isolated-admin-readonly.js` reusing **real existing isolated** signed base employee session, passkey verifier, and enrolled TOTP verifier. Only synthetic test employee 901 may read admin/setting metadata after independent proof; no actual Owner identity is commissioned and no live employee privileges are granted. Test-only synthetic Owner screen label does not imply a production Owner. Server checks base identity, factor freshness and purpose, bound signed proof, exact read operation, and optional same-origin/cross-site checks.
- `staging/isolated-test-login.js` enables the route **only with the explicit new `HC_STAGING_ADMIN_READONLY_ENABLED=true` flag**, and only if existing isolated passkey and TOTP enrollment services are enabled. Flag is absent/off in current deployment; no new public route yet. `staging/isolated-owner-enrollment.js` exports a server-only TOTP proof verifier. Browser `staging/isolated-admin-auth-client.js` allows synthetic PIN + Google Authenticator OR passkey; ephemeral proof stored only in memory, no storage, sign-out/page-hide clearing. `admin/employee-admin.html` and client support new sign-in controls, owner-capability read-only rendering, and denied-access feedback.
- No admin delegation, PIN edit, tool settings edit, employee roster, audit writing or provisioning endpoints are mounted in the isolated preview: `createEmployeeAdminRouter` uses a **read-only capability resolver** instead of the delegated-write adapter. Direct attempt to POST grant endpoint fails 404. Verified HTTP tests cover PIN-only, forged role, cross-origin, no-write and valid MFA/passkey read access.
- **Railway verified unchanged:** project `Hobby Corner Integration Test`, environment `test`, `staff-security-staging` deployment `c0f9ccb3-e076-4ce4-8b4d-62ffd0416a04` **SUCCESS**, deployed source `d2a90b49e0f58104f17391c1f67623c256950326`; no staged changes pending. This new admin preview has **NOT** been deployed.
- **Next:** owner approval of safe isolated-only PR #34 commit deployment/feature flag; review rollback; then real-browser synthetic login + MFA/passkey, admin authorization denial, five-minute proof expiration; only later wire a real Timeclock Owner principal and delegated managers with protected employee directory. Do not deploy production or merge PR #34 without explicit authorization.

The prior staged security page and its current functioning PIN+Authenticator tests remain untouched. The real-device fifteen-minute PIN session expiry acceptance check remains independent.

## Read-only admin isolated staging deployment — 2026-11-06

**Status: Deployed to isolated staging; automated tests passed; real-browser acceptance pending.**

Owner approved proceeding with the isolated-only read-only preview. Rechecked admin branch and test authentication composition (existing signed employee 901, existing WebAuthn passkey and TOTP verification; no admin mutation adapters mounted). GitHub Actions **Shared Lightspeed foundation `42293979612` SUCCESS** for the functional source commit after staging test harness correction; subsequent only documentation changes.

**Railway change scope verified before deploy:** `Hobby Corner Integration Test` / `test` / `staff-security-staging` only, patch `96f9d8e7-f146-404f-b759-a378994f60bc`, exactly source branch, pinned commit, and new `HC_STAGING_ADMIN_READONLY_ENABLED=true` variable; not destructive, no other services, secrets, database or Timeclock changes. Prior deployment `c0f9ccb3-e076-4ce4-8b4d-62ffd0416a04` source `d2a90b49e0f58104f17391c1f67623c256950326` was rollback reference.

**New Railway deployment:** `06537f54-d009-4329-823b-daa444c67eef` **SUCCESS**, source `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` pinned commit `160fc84e4c2d2478a706222282941def71e5bdce`. Railway environment reports `online` with zero warnings/critical issues, no remaining staged patch. Railway-managed staging domain `staff-security-staging-test.up.railway.app` verified as assigned to the service. **The admin page is available at** `https://staff-security-staging-test.up.railway.app/employee-admin/` **based on deployed route/source**, but direct unauthenticated remote HTTP probing was inconclusive because outbound DNS/web fetch was unavailable in this environment; browser manual acceptance remains pending.

**Test next:** User opens the admin page, signs in with the synthetic staging PIN; should remain outside admin after PIN only. They then verify an enrolled Google Authenticator code or registered passkey; server should authorize metadata-only dashboard marked test Owner. Verify a refreshed or expired proof is denied, and that no grant/PIN/tool-setting write endpoint is exposed. Do NOT share codes or security proofs. If errors occur, inspect Railway runtime logs, health status and frontend scripts before assuming a user mistake.

**Rollout safety:** This is NOT production admin Owner commissioning, no real Timeclock employee records are connected. The verified synthetic 901 profile is a staging-only fixture; delegated access, employee onboarding, tool permission grants and actual tool-settings changes are not enabled. Do not conflate staged read-only UI with production authorization.

## Real-browser Authenticator admin sign-in acceptance — 2026-11-09

**Staging testing — user-confirmed:** On 2026-11-09 the Owner opened the isolated staging Employee Administration portal, signed in using the synthetic employee identity and Google Authenticator, and supplied a screenshot showing the authenticated dashboard. The screen displayed `Owner · totp`, all seven navigation tiles (Employees, Security, Verified Computers, Timeclock, Tool Permissions, Tool Settings, Audit), and `14 registered settings and configuration areas` with read-only metadata/status badges. It displayed the notice `Settings metadata loaded. No employee information or configuration values were changed.`

This validates the browser sign-in and verified TOTP-to-read-only-admin-overview path on isolated Railway staging deployment `06537f54-d009-4329-823b-daa444c67eef` (pinned commit `160fc84e4c2d2478a706222282941def71e5bdce`). **Do not conflate the synthetic staging Owner label with real Timeclock Owner commissioning.** The screenshot does not establish passkey sign-in, PIN-only denial, real delegated manager enforcement, session expiry, or permission/settings writes. No employee record or production configuration was changed.

**Next manual acceptance:** test explicit sign-out and an independent passkey sign-in; negative PIN-only admin read and five-minute TOTP proof expiry are further outstanding. Admin edit actions remain unmounted. Continue feature-by-feature rollout only after verified authorization, source-owned settings adapters, and audit tests.

## Admin tab-leave verification message fix — 2026-11-09

**Status: Fixed; automated CI passed; deployed to isolated staging; real-browser recheck pending.** User verified staging Admin Portal `Owner · totp` and successful sign-out, but found that leaving the page for ~1 minute and returning left the stale message `Second factor verified; checking server-side administrator permission…`. On tab visibility loss, the browser intentionally clears the temporary factor; the UI did not replace its prior verification status text.

**Changes:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` commit `1da14532d6568e29f9653b563885097922acf695`: `staging/isolated-admin-auth-client.js` now explains that tab switching clears admin verification, invites re-verification with Authenticator/passkey, clears pending code, and guards against async factor responses arriving after tab leave. `admin/employee-admin-client.js` invalidates pending dashboard/settings fetches on sign-out/tab leave so protected content cannot reappear after proof removal; clears owner identity and sensitive UI panels. Added `tests/employee-admin-visibility-race.test.mjs` and updated browser test for meaningful return message. No authentication TTL, session grant, Owner identity, production system or API privilege changed.

**Test:** GitHub Shared Lightspeed foundation run `42661587540` **SUCCESS**. Earlier run failed on a new syntax typo in WebAuthn options call; fixed before release. **Deploy:** reviewed non-destructive single-field staging source SHA patch `60f1faed-d9bc-4596-9e4d-5d14e500a41f`, then applied ONLY to `Hobby Corner Integration Test/test/staff-security-staging`. Railway deployment `1f0443e9-9eae-425a-b819-4391c66a25ed` **SUCCESS**, online with 0 warnings and 0 critical issues. No remaining staged changes.

**Browser recheck:** Reload `https://staff-security-staging-test.up.railway.app/employee-admin/`, synthetic PIN + TOTP, confirm dashboard, switch tabs for a minute, then return. It should show the admin gate and `Admin verification is not active. Use your Authenticator or passkey to return to the dashboard.` rather than the old checking message. Re-verify a new six-digit code if the signed PIN session remains active. Signing out continues to clear the base session. Never share OTP or PIN.

## Brief tab switching now retains unexpired MFA — 2026-11-09

**Status: Staging deployed; automated regression PASS; real-device recheck pending.** User reported that switching to another browser tab even for a second caused the admin portal to require an entirely new second-factor verification. This was caused by the previous client code intentionally calling `clearFactor()` on every `visibilitychange` to hidden, an overly restrictive UX policy.

**Fix:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` commit `21a44f4f06ebaacec3d005344faa89f8907feb46`. `staging/isolated-admin-auth-client.js` now **retains the existing memory-only proof** across short tab changes; it does **not** extend its original five-minute expiry. `admin/employee-admin-client.js` hides the dashboard immediately when the tab becomes hidden, invalidates pending server fetch results, and **server-revalidates** the same proof via both read-only admin endpoints whenever the tab is visible again. If the factor expired, the UI asks for Authenticator/passkey again, without renewing the employee PIN session. Browser navigation/pagehide and explicit sign-out still clear proof/session. No secrets written to browser storage, no server TTL change and no new authorization bypass.

**Tests:** Shared Lightspeed foundation GitHub Actions run `42663046081` **SUCCESS**. Updated `tests/employee-admin-staging-auth-client.test.mjs` for short tab change/valid proof and after-five-minute expired proof; `tests/employee-admin-visibility-race.test.mjs` confirms a delayed response cannot reveal admin data while hidden. **Railway:** non-destructive patch `9ffea2e0-648e-4c55-ac22-5711d2e70f3d` changed only the source SHA for isolated `Hobby Corner Integration Test/test/staff-security-staging`; deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` **SUCCESS**, service online with no warning/critical issues, no staged changes remaining. No production changes.

**Manual acceptance:** Reload `https://staff-security-staging-test.up.railway.app/employee-admin/`, PIN + TOTP, switch tabs for a few seconds and return: expect server recheck and Owner dashboard without another code. After original five-minute MFA proof expiry, return and expect a fresh factor while the separate employee PIN session remains active (until its own expiry). User must confirm browser behavior before marking this real-device acceptance.

## Minimum employee directory and no-sync Timeclock adapter — 2026-11-09

**Status: In Development; automated tests PASS; NOT deployed.** After real-device confirmation that brief admin tab switching now works better, proceeded to next Employee Administration milestone: permission-gated Timeclock employee-directory integration, with strict separation from manager onboarding and private records.

**Source:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106`, draft PR #34. Functional source/test commit `5fb9606b80cea8a63def3245c1b836cf8ae19317`. Development guide `docs/EMPLOYEE_ADMIN_FOUNDATION.md`.

- **Timeclock source audit:** existing `GET /api/timeclock/admin/employees` triggers `syncLightspeedUsers()`; deliberately **not** used as read-only admin data source because it may mutate business roster on page load. Added `GET /api/timeclock/admin/employees/readonly` to the development copy of `timeclock/server.js`, protected by existing server-only Timeclock admin secret, returns `listEmployees()` without sync. Not deployed to Timeclock.
- **Backend-only adapter:** `services/security/adminTimeclockDirectoryReader.js` allows secure server-side HTTP/HTTPS to the new endpoint with existing admin secret, no redirects, bounded timeout and response validation. Not browser-accessible or configured in deployed services.
- **Projection:** `services/security/adminEmployeeDirectory.js` validates/deduplicates employee identities and strips responses to `id,name,active` for `employees.directory.read`; limited private booleans only with separate `employees.private.read`. Never sends PIN hash, raw Discord/LS IDs, phone or email. The manager's `employees.onboard` alone does NOT allow directory browse.
- **Admin API:** `routes/employeeAdmin.js` conditionally adds `GET /api/employees` only when a verified directory adapter is injected. Requires strong administrator verification and exact directory permission; `?scope=private` requires stronger, independent private-read operation grant. The current synthetic staging preview is NOT supplied this adapter, so the directory API remains 404 and no employee data is fetched.
- **UI:** `admin/employee-admin.html` / `admin/employee-admin-client.js` include a hidden Employee Directory section, automatically queried only when the real server's verified permissions explicitly include `employees.directory.read`, showing minimum identity, active status and Timeclock ID. In current staging the synthetic Owner's capabilities exclude that operation, so no roster load occurs.
- **Tests:** New `tests/employee-admin-directory.test.mjs`, `tests/employee-admin-timeclock-directory-reader.test.mjs`, `tests/employee-admin-directory-client.test.mjs`. GitHub Actions **Shared Lightspeed foundation `42665224213` SUCCESS** and **Scanner integration `42665224227` SUCCESS** at final functional/test commit `5fb9606b80cea8a63def3245c1b836cf8ae19317`. One preceding test-only failure was incorrect simulated DOM `append` argument handling, fixed before passing CI.
- **Deployed:** No new deployment; isolated read-only Admin staging remains on `staff-security-staging` source commit `21a44f4f06ebaacec3d005344faa89f8907feb46` deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` per latest known verification. Production Timeclock, scanner, employee data, PINs, employee permissions, Lightspeed and Chrome extension untouched.

**Next integration gates:** approve and separately deploy the non-sync Timeclock directory endpoint; connect server-side admin HTTP adapter only after independently verified real Owner principal and directory grant; test manager onboarding-only user receives 403 and no directory; audit required workforce/private fields and role permissions. Do not convert legacy employee list into an unguarded browser endpoint. Live Owner commissioning and per-tool settings writes remain pending.

## Short tab-switch behavior owner acceptance — 2026-11-09

**Testing — user feedback:** After isolated staging deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` (source `21a44f4f06ebaacec3d005344faa89f8907feb46`) preserving a five-minute verified factor across brief tab switches and performing server revalidation on return, the Owner reported **“That looks better”** and requested continuation of development. This is positive real-browser UX acceptance for the short tab-switch behavior, though it does not independently prove precise MFA expiry, passkey sign-in, or long-idle session revocation. No production changes.

## Delegated new-hire requests, Owner review, exact tool grants and policy preview — 2026-11-09

**Status: In Development; implementation and regression tests PASS; not deployed.** Owner requested continuing all safe development possible without additional input. This milestone extends Employee Admin draft PR #34 without touching the successful live admin staging preview or actual employee data.

**Source:** `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106`. Final functional/test commit `ef2776400451ce219b8d93d856ced302bde77436`; subsequent documentation-only commits. CI **Shared Lightspeed foundation `42668508441` SUCCESS** and **Scanner integration `42668509091` SUCCESS**.

**Implemented and tested:**
- `db/hc_admin_onboarding_requests.sql`, `services/security/adminOnboardingQueue.js`: persistent new-employee request queue, minimal new-hire name/proposed staff or manager role/reason fields, fresh strong-factor `employees.onboard` permission, idempotent unique request keys including concurrent retry reconciliation, own-request-only manager status, and append-only audit events. Queue does NOT create a Lightspeed/Timeclock identity, reset PIN or grant any tool operation.
- Explicit `employees.onboard.review` **owner-only** permission, separate backend Owner validation callback, strong factor, protected pending-review listing, atomic approve/reject, immutable audit. Approved status is `approved_pending_creation`: an approval does **not** create any account. Delegated manager cannot approve their own/others' requests or list requests for other employees.
- `services/security/adminDelegationsPostgres.js`: `canUseEmployeeTool` checks current active Timeclock employee and exact operation grant (default deny); `listEmployeeToolGrants` requires `permissions.read`, hides Owner target from managers and filters other employee permissions to each manager's Owner-approved operation scopes. Optional admin GET permission view. This is a **candidate** integration interface; Scanner/other production tool enforcement unchanged.
- `services/security/adminSessionPolicyPostgres.js`: `preview()` compares independently authorized local and remote proposed session windows with durable version and validation. Optional `GET /api/session-policy` and `POST /api/session-policy/preview` expose only reads/previews. No public save endpoint, no active-session TTL/policy change.
- Responsive admin development UI contains new-hire intake/own status, Owner review/decision, and local/remote session-window preview. Each section loads only if the **trusted server** explicitly granted corresponding operation. No private staff browse automatically follows onboarding permission.
- Tests `tests/employee-admin-onboarding.test.mjs` (disposable PostgreSQL and gated HTTP), updated `tests/employee-admin-delegations-postgres.test.mjs`, new `tests/employee-admin-policy-preview-http.test.mjs`, plus all inherited shared security and Scanner regressions. Latest CI passed after correcting only a preview test expected read count; no policy writer was called.

**Deployed:** None of this new code. Current isolated staging `Hobby Corner Integration Test/test/staff-security-staging` remains successful deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` at existing source `21a44f4f06ebaacec3d005344faa89f8907feb46` with no pending Railway changes. Production Timeclock, Lightspeed, Scanner, real employee records, PINs and tool permissions unchanged. No Chrome extension release.

**Blockers / decisions requiring coordination:** actual vetted Lightspeed/Timeclock employee provisioning (canonical employee IDs, active state and onboarding workflow), verified real Owner commissioning and admin grants, scoped management adapters, additive migration to a disposable staging DB, real Chrome workstation installer and release queue, tool-by-tool server authorization policy transition, persistent session policy enforcement for idle/absolute windows, security/browser acceptance and explicit authorization before production writes. Avoid treating an approved onboarding request as an employee account or a metadata preview as a saved setting.

**Next recommended action:** independently review these new backend/migrations, then prepare an isolated DB/test-fixture admin manager/Owner flow for real UI acceptance, followed by integrating actual Timeclock onboarding and source-owned tool-setting adapters only after careful source/API review. Keep PR #34 draft/unmerged until coordination.

## Final permission-check hardening and regression verification — 2026-11-09

**Status: In Development, final CI PASS, no new deployment.** Final security review of exact tool operation grant resolver identified that accepting a plain employee ID could make it easy for a future tool integration to mistakenly trust a caller-supplied identity. Corrected `services/security/adminDelegationsPostgres.js` so `canUseEmployeeTool({context,toolOperation})` now requires a trusted injected `verifyToolSession(context)` backend verifier that resolves the employee from an independently authenticated signed session; if no verifier/context, invalid/unknown identity, inactive Timeclock record, missing exact grant, or DB failure, it **denies**. Explicit employee-ID input alone no longer authorizes an operation. It remains unmounted until an individual tool integrates and tests the trusted verifier.

Updated `tests/employee-admin-delegations-postgres.test.mjs` with signed-session fixture and caller-spoof denial. Latest functional/test commit `81a78d933711836b395c0d50e2dabcb118165ee0`; GitHub Actions **Shared Lightspeed foundation `42669190828` SUCCESS** and **Scanner integration `42669190918` SUCCESS**. Later work in this conversation updated documentation only. Previous milestone onboarding/Owner-review/policy-preview checks also passed in this latest security CI.

**Deployment unchanged:** Railway `staff-security-staging` remains successful deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256` pinned to `21a44f4f06ebaacec3d005344faa89f8907feb46`; no pending staged changes at last Railway inspection. Production Timeclock/Scanner/Lightspeed, real employee PINs, grants, tool settings, Chrome extension remain untouched. PR #34 stays DRAFT.

## Cross-project integration registry coordination — 2026-11-09

**In Development; new integration candidate NOT VERIFIED/NOT DEPLOYED.** On `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` (draft PR #34) added `services/security/adminIntegrationCatalog.js` and `GET /api/integrations` to return server-permission-gated read-only metadata about project tool integration status, exact operation IDs and proposed hierarchical navigation ownership. All operations remain `not-integrated` and settings adapters `not-connected`. No employee roles/grants, actual staff data, configuration writes or tool authorizers were changed. The existing validated staging Owner UI is still the previously deployed source, not this candidate.

**Coordination:** `Tawgod/Hobby-Corner:main/HOBBY_CORNER_INTEGRATION_CONTRACT.md`, `handoffs/cross-project-integration.md` and [navigation issue #36](https://github.com/Tawgod/Lightspeed/issues/36) define agreed shared ownership and requested Special Orders > Purchasing/Preorders > GW nesting, Store Tools, and verified `admin.read` nav. The active web nav branch `feature/unified-hierarchical-navigation-20261109` remains separately owned; no shared nav or Chrome extension file was modified by this admin chat.

**CI blocker:** New Shared foundation `42672182306` and Scanner `42672182349` report failure with zero jobs available via GitHub connector; rerun API returned 403 cannot retry. Do not mark new registry tested or stage it until verified green CI. Last successfully tested previous admin code is `81a78d933711836b395c0d50e2dabcb118165ee0`. No production/staging rollout performed.

## Cross-project Admin integration CI validated — 2026-11-09

**Status: In Development; new integration read-only source TESTED; not deployed.** On `Tawgod/Lightspeed:feature/employee-admin-security-foundation-20261106` draft PR #34, read-only `adminIntegrationCatalog` and optional server-gated `GET /api/integrations` list intended tool owners, operation IDs and hierarchy without falsely claiming any live permission grant/settings adapter. New independent `.github/workflows/employee-admin-integration.yml` and Admin branch direct foundation trigger were added after no-job CI startup failures. Source commit `cc433e396545402b1aa32bb442f8a3f5f2dccc38` passed [Admin integration contract `42673992585`](https://github.com/Tawgod/Lightspeed/actions/runs/42673992585) and [full foundation `42673992885`](https://github.com/Tawgod/Lightspeed/actions/runs/42673992885). Scanner had a no-jobs failure on latest run; earlier Admin source Scanner run `42673574765` SUCCESS, no specific regression established. Intermittent no-job GitHub root cause still unverified.

**Related web nav verified** on separate `feature/unified-hierarchical-navigation-20261109` at `17a35003c7b570f9a810000fd4b6ea77ab8e61cb`: all five navigation, Shared UI, Scanner and Core Ops CI suites SUCCESS. Source now has requested Special Orders/Preorders/GW/Purchasing nested structure and an Employee Administration link shown only with fresh trusted same-origin `admin.read` approval; sign-out revokes link. **Backend `/api/admin/navigation-access` is not yet implemented on live core-ops origin, so link remains hidden**. No real production Owner or delegated grants are provisioned.

**Deployed:** No new Admin staging source or production rollout. Previous isolated synthetic Owner staging remains unchanged. Next: create and test a trusted same-origin `admin.read` nav capability adapter on a future reviewed integration branch, separately from current synthetic Owner test identity, then stage cross-project browser acceptance. Details in `handoffs/cross-project-integration.md`.

## Dedicated Admin grants database isolated in Railway — 2026-11-09

**Infrastructure status: Deployed (test-only); Admin authorization status: Planned / Not wired.** A dedicated new PostgreSQL resource `Postgres-O39p` (Railway service `bd807d6a-0d9a-4b33-94a7-6eeff6fe6eb8`, volume `9d60c858-4890-4d96-ade8-e4f2446b574a`) was provisioned in `Hobby Corner Integration Test/test` by non-destructive Railway patch `5ca5f028-a6d4-41b1-a597-72829947d399`. Deployment `118442f5-0663-471c-b9a6-df746f9709bd` SUCCESS; health online, no warnings/criticals; **no public/custom domains**. Existing shared test DB and synthetic Admin staging unchanged. No employee records copied and no production changes.

This new database currently has **no installed `hc_admin_delegations.sql` schema, real Owner principal, manager grants or SELECT-only LOGIN**. New source-only reviewed role setup SQL `Tawgod/Lightspeed:feature/unified-hierarchical-navigation-20261109/db/admin_navigation_reader_isolated_review.sql` intentionally creates a `NOLOGIN` role and cannot grant authorization to anyone; it was not executed. Staff-auth/same-origin Admin hint route remains opt-in and unmounted. Do not use template administrator `DATABASE_URL` in the Admin navigation app; app startup's least-privilege preflight will reject it.

**Tests:** navigation branch function/test commit `bf58e63cc17798921ee0ed6607d8eaf9d8cf2a68` passed Admin Navigation `42680491246`, hierarchical navigation `42680491229`, Scanner `42680490800`, Shared UI `42680490765`, Core Operations `42680491141`. The disposable Postgres owner/manager/ordinary employee matrix and SELECT-only role test passed previously. Railway run did not execute any new migration or auth tests using the dedicated real test DB.

**Next:** separately approved isolated schema migration and dedicated read-only credential provisioning, then isolated same-origin route deployment and synthetic-only browser tests. Real Timeclock Owner commissioning, real employee permission grants and production rollout remain gated. Full cross-project handoff in `handoffs/cross-project-integration.md`.

## Isolated Admin authorization schema and SELECT-only role actually connected — 2026-11-09

**Status:** Isolated test-only PostgreSQL schema Deployed; dedicated restricted reader LOGIN Deployed and connection TESTED; no actual employee or Owner grants; Admin navigation/browser production NOT deployed. In `Hobby Corner Integration Test/test/Postgres-O39p`, the guarded canonical `hc_admin_delegations.sql` migration was executed by pinned one-time Railway job `admin-grants-schema-once` deployment `d39bee4b-14cf-4c8a-ad8b-889c4301362b` SUCCESS, runtime proved six required tables and **zero principals / zero grants**. A second test-only one-shot run `b62b8f3b-6c5c-437c-989e-cd09a02cfd40` SUCCESS provisioned an independently credentialed `hc_admin_nav_reader` role, SELECT-only on two navigation grant tables, with no table modification/schema CREATE privileges. Credential generated separately and retained in Railway, not in repository/docs. Third run `2c1384c3-7080-4921-bad7-674572ed17d0` SUCCESS used only this role to connect over private Railway networking and confirm the full DB preflight, empty principals/grants and denied synthetic test Owner.

**Sources:** Admin branch `scripts/admin-schema-isolated-once.mjs`, `scripts/admin-nav-reader-isolated-once.mjs`, their unit/regression tests; Nav branch `scripts/admin-nav-db-isolated-smoke.mjs` and tests. Foundation, Scanner, Admin integration and all five nav suites passed at respective pinned commits (see `handoffs/cross-project-integration.md`). No production migrations or Timeclock employee records changed.

**Guardrail:** The one-time Railway service was repinned to read-only smoke and its elevated migration URL disabled. Existing `staff-security-staging` deployed source is unchanged. Real Owner commissioning, delegated manager grants, signed employee bearer navigation endpoint and stronger Admin MFA entry have not been enabled using this DB. Browser acceptance remains pending.

**Next:** integrate real active Timeclock session verification and independent `admin.read` grant provider behind opt-in test-only navigation route; commission Owner through independently verified passkey before any real permissions; never seed synthetic `901` into this shared grant DB.

## Signed Timeclock Admin navigation bridge isolated candidate — 2026-11-09

**Status: In Development / CI TESTED / Railway service STAGED, not deployed.** The unified navigation branch `feature/unified-hierarchical-navigation-20261109` now contains a separate, private, test-only `scripts/admin-nav-isolated-bridge.mjs`. Reuses existing signed staff sessions and active Timeclock identity adapter plus the dedicated SELECT-only `Postgres-O39p` Admin permission reader. No new employee identity system, PIN signer, Owner auto-bootstrap, permission writes or settings changes. Without independent Timeclock signing/service secrets the endpoint denies all, even if the Admin database contains a grant. The Admin portal still requires independent fresh enrolled passkey/TOTP on entry.

All five GitHub CI suites passed on `87a9096990af099e085e390639cb312c250a9c5c`, including `tests/admin-nav-isolated-bridge.test.mjs` for valid/invalid signed sessions, active/revoked Timeclock employees, exact grants/revocations and default-deny. **No real employee-browser acceptance** has occurred. Railway test patch `27985da3-a390-44bb-ae3f-00d08a2fa408` is staged for new private service `admin-nav-bridge-test` id `73937ea7-1179-4664-9ec5-324da9352564`; pinned tested commit with internal SELECT-only DB variable references, no Timeclock credentials, no public domain. Patch not applied because activation requires explicit deployment authorization. The working synthetic Admin staging service and shared/staging/production databases remain unchanged.

**Next:** apply ONLY the isolated test service after authorization; verify default-denial and live read-only database health; coordinate independently reviewed Timeclock service credentials and real Owner commissioning before attempting positive real-staff navigation or delegated grants. Cross-project details: `handoffs/cross-project-integration.md`.


## Existing primary Timeclock employee — security commissioning preflight (2026-11-09)

**Status: In Development; candidate implemented and CI TESTED; primary account NOT modified.** Owner requests moving from isolated synthetic test employee `901` (test PIN and Authenticator) toward using their **existing primary Timeclock employee account** as the sole staff identity. A separate draft [PR #39](https://github.com/Tawgod/Lightspeed/pull/39), `Tawgod/Lightspeed:feature/primary-employee-security-readiness-20261109@5b168d6ad22dbe74a38d4c0e5b1034f0b1d12450`, targets Admin development PR #34 and adds an **unmounted/read-only** `services/security/primaryEmployeeSecurityReadiness.js`. The preflight requires a verified current active, signed/bound Timeclock session; independent backend Owner assignment (not Discord role/claimed employee identity); recent independent primary-employee-bound passkey/security-key/IdP proof; and metadata-only factor status for that exact primary employee. No account ID may be chosen through a request field, and an enrolled synthetic `901` factor cannot be re-assigned to a primary employee ID. No clock-in or schedule requirement.

[Primary employee CI 42702068819](https://github.com/Tawgod/Lightspeed/actions/runs/42702068819) **SUCCESS** on the PR head, with focused identity mismatch, expired/inactive, forged role, synthetic-factor, wrong-employee and factor-state negative tests, plus parse check. This is fixture-based contract verification, not live login/device acceptance. No Railway read of live employee records, production identity lookup, PIN/TOTP seed access, new credential enrollment, Owner commissioning, role grant, credential reset, schema change, deployment, Chrome update or migration of test identity has occurred.

**Next gated steps:** using an approved authenticated Timeclock UI/backend flow, privately verify the existing primary employee ID/active state and current signed-session binding without sharing the PIN, TOTP code or raw credential values in chat. Independently verify Owner appointment and recoverable strong-factor enrollment procedure; establish a fresh primary-bound passkey or approved managed proof before a new TOTP enrollment (not a secret copy), with separate user authorization for any changes. Keep isolated synthetic identity `901` untouched for test regressions. Then connect the unmounted verification adapter to a least-privilege test-only route with real employee consent and perform device acceptance; never auto-promote or auto-merge identities.


## Primary employee identity discovery and canonical Timeclock adapter — 2026-11-09

**Status: In Development / CI TESTED / not mounted or deployed.** A stacked draft [PR #40](https://github.com/Tawgod/Lightspeed/pull/40) on existing primary readiness draft PR #39 adds a separate read-only first-step identity check. It resolves the circular prerequisite in PR #39: an employee who has no primary-account passkey can first verify their *existing canonical identity* without an enrolled passkey, while this discovery step **never authorizes Owner commissioning or factor enrollment**.

Source: `Tawgod/Lightspeed:feature/primary-employee-identity-discovery-20261109@c33871e65e2809032ddc3489e11fcae7bc4ac92b`. Modules `services/security/primaryEmployeeIdentityDiscovery.js` and `primaryTimeclockCanonicalReader.js` require an existing active, nonexpired signed/bound employee session; then the trusted backend Timeclock integration's `authorize(employeeId)` must return the exact active record with `permissionSource='timeclock_employee'` and `canLookup=true`. The live Timeclock code's existing scanner authorize endpoint (reviewed in `integration/hobby-corner-consolidation/timeclock/server.js`) already queries `employees WHERE id=$1 AND active=TRUE`, without consulting clock-in status. Its role/canApprove fields do **not** establish Owner authorization. An independent Owner appointment lookup is mandatory, and missing appointment yields a **read-only independent commissioning gate**, not an automatic Owner grant. No employee ID is accepted from request parameters to select a target, and synthetic test-identity provenance fails canonical verification.

Dedicated [CI 42703295374](https://github.com/Tawgod/Lightspeed/actions/runs/42703295374) **SUCCESS** including earlier primary strong factor readiness tests, new signed-session/canonical matching tests, active/revoked/expired Timeclock cases, untrusted role/employee spoof checks, service outage fail-closed and immutable read-only result. All test fixtures use invented employee IDs; **the real Owner Timeclock record and current factors have NOT been inspected**. No server route mounted, actual PIN/session queried, real Owner appointment created, test credential copied, TOTP secret migrated, passkey enrolled, migration executed, Chrome package changed, or Railway/production deployed.

**Next release gate:** coordinate a narrowly scoped test-only authenticated self-identity endpoint using this backend adapter and actual independently trusted Timeclock service credentials; independently commission Owner through an audited approved external/strong proof with recovery, only then enroll the new primary-bound passkey/TOTP. Never use synthetic test PIN/Authenticator as authorization for an existing real employee. Coordinate with Employee Admin PR #34 and Shared Lightspeed/security PR #32/#33/#38 before integration. Preserve existing working store clock-in.


## Initial primary employee account discovery — 2026-11-09 continuation

**Status: In Development / automated CI TESTED / unmounted.** Added stacked draft [Lightspeed PR #40](https://github.com/Tawgod/Lightspeed/pull/40), branch `feature/primary-employee-identity-discovery-20261109`; latest changelog-only head `fcde1721192106d78a1477c522db8a6bc3e9e237`; final functional/CI head `55092098a6daec7a2a731952d27172e7c77c01d3`.

This resolves an enrollment sequencing issue in primary readiness PR #39: a new real employee cannot prove possession of a primary-account passkey before the first credential is commissioned. **Read-only first-stage discovery** now verifies the signed/bound active employee session and independently checks the same ID through the backend-only existing `createTimeclockScannerIdentity.authorize` client. The authoritative Timeclock integration endpoint already queries `employees WHERE id=$1 AND active=TRUE`, without requiring clock-in status, and emits `permissionSource='timeclock_employee'`; this does **not** establish an Owner role or permission grant. Separate Owner appointment verification returns either `independent-owner-commissioning` or `independent-primary-factor-verification`, with `enrollmentAuthorized:false` in all cases.

New source-only modules: `services/security/primaryEmployeeIdentityDiscovery.js`, `primaryTimeclockCanonicalReader.js`, and `routes/primaryEmployeeIdentity.js`. The HTTP router has **disabled-by-default** `GET /self` only and returns allowlisted own identity readiness; no method accepts an employee selector, changes credentials, copies synthetic factor 901 or grants Owner. Nothing is mounted in server routing or Railway. Separate strong-factor readiness from PR #39 still applies **after** independent commissioning.

Dedicated GitHub Actions [primary identity discovery run 42703689898](https://github.com/Tawgod/Lightspeed/actions/runs/42703689898) **SUCCESS** for canonical Timeclock bridge, signed-session/revocation/synthetic identity fail-close, first-factor sequencing and disabled-by-default HTTP/404 tests. All tested with fixtures, **not the owner's live primary account**. No primary PIN/TOTP seed, existing employee record, real Timeclock staff entry, Railway variables, or live authorization grants were queried or changed; no deploy/merge/extension release.

**Next:** separately authorize a narrow environment-specific read-only self-identity acceptance test with real verified primary Timeclock session and trusted backend integration; do not use the synthetic test authenticator for the primary record. Independently establish/audit the first real Owner appointment and strong-factor credential/recovery procedure, then separately approved new primary-account TOTP enrollment. Coordinate with Admin PR #34, shared security PRs #32/#33/#38, and Timeclock legacy-login remediation. Preserve operational store clock workflows.


## Primary account verification integration — 2026-11-09

**Status: In Development / automated CI TESTED / read-only candidate UNMOUNTED / real Owner employee NOT verified.** Draft [Lightspeed PR #41](https://github.com/Tawgod/Lightspeed/pull/41) on child branch `feature/primary-timeclock-verification-wiring-20261109`, stacked on PR #40 and PR #39, adds `services/security/primaryTimeclockVerificationWiring.js`. A trusted backend factory now composes the pre-existing `staffAuth.verifyBoundEmployee` signed session, backend-only `timeclockIdentity.authorize(employeeId)` canonical active Timeclock recheck, independent `checkOwnerAssignment`, and the read-only, self-only `primaryEmployeeIdentityRouter`. The factory refuses any environment other than `test` and its read-only endpoint remains off by default; no operational server mounts it.

Focused tests in [GitHub Actions 42706021754](https://github.com/Tawgod/Lightspeed/actions/runs/42706021754) passed test-only wiring, default-off, active off-clock employee, missing signed session, canonical revocation, synthetic staging negative path, no writes or arbitrary employee target, and production factory refusal. Functional commit `4b6e8e06b57e95fb3db835c38c3688e33e4488c6`; documentation-only head `eb463d7d9ed617e45d52f08da3416ddb3bbd4e4a`.

Read-only Railway inspection confirmed isolated `Hobby Corner Integration Test/test/staff-security-staging` still pins `feature/employee-admin-security-foundation-20261106@21a44f4f06ebaacec3d005344faa89f8907feb46`, successful deployment `41a3ee7d-6fb9-4ac1-9f5f-a27120f95256`, and has **no verified live primary Timeclock integration configured**; synthetic employee 901 continues to be used. The unrelated staged environment-wide `admin-nav-bridge-test` creation patch `27985da3-a390-44bb-ae3f-00d08a2fa408` was not altered or accepted.

**Blocker for actual account verification:** A future explicitly scoped, separately approved isolated real Timeclock-backed read-only acceptance route needs trusted internal Timeclock service credentials and the owner's real signed primary employee session in a secure browser flow, not credentials pasted into ChatGPT. Current primary ID, Owner appointment, passkey/TOTP registration and login behavior were NOT queried or verified. No real employee record, PIN, authenticator seed, grant, DB schema, Railway deployment, staging patch, Chrome extension or production service was changed. Next: coordinate approved private test environment and real-session acceptance first; independently verify/audit Owner commissioning and recovery before enabling any primary-bound factor enrollment.


## Live primary Timeclock PIN → Authenticator preparation — 2026-11-09

**Status: In Development / automated CI TESTED / NOT integrated, deployed or live-account verified.** Owner requested continued development until the primary employee is able to enroll Authenticator against the *existing* Timeclock PIN. Existing prior draft PRs #39/#40/#41 prepare bound primary identity discovery and read-only test verification. New stacked draft [Lightspeed PR #42](https://github.com/Tawgod/Lightspeed/pull/42), `feature/primary-live-totp-enrollment-gate-20261109@60265c9cbab392027708bbbec75ccae532744f33`, adds `services/security/primaryLiveTotpEnrollmentGate.js` and `primaryTimeclockTotpSubsystem.js`. The former enforces a current signed session tied to exactly the active canonical Timeclock employee record before any factor operation, and a recent independent passkey/security-key/managed MFA approver with exact backend grants; the latter connects that assurance to the **existing** durable PostgreSQL enrollment approvals, encrypted Authenticator QR/confirm and signed TOTP MFA session services. Composition is **test-only and unmounted**, with no new employee database, Owner auto-grant or test employee 901 factor copy.

[GitHub Actions 42709757349](https://github.com/Tawgod/Lightspeed/actions/runs/42709757349) **SUCCESS** at functional source/CI SHA `22dc405f02c4e6a4ebca5a258c1f256ec428c986`, including canonical Timeclock, missing/revoked employee, mismatched signed session, synthetic test exclusion, manager factor strength, durable approval preconditions and composed subsystem tests. Later commits add documentation only. Full activation/recovery runbook committed on branch as `docs/PRIMARY_EMPLOYEE_AUTHENTICATOR_ROLLOUT.md`; `CHANGELOG.md` updated.

**Not ready for real setup yet:** The user's actual primary Timeclock employee account, pre-existing Owner appointment and independently verified strong approver are NOT identified or authenticated in the available live runtime. No production Railway source/credentials, encrypted factor key custody, real signed primary session, migrations, approved recovery or browser verification exists for this candidate. The existing `staff-security-staging` service uses isolated synthetic employee 901 and must **not** be repurposed to verify or enroll a production user. Unrelated Railway staged Admin Navigation patch remains untouched. No real PIN, authenticator QR/seed or private employee record was accessed; no DB schema/write, Owner grant, deploy or Chrome release performed.

**Next dependent activities:** independently commission real Owner/strong-factor approver with audited identity/recovery, provision reviewed private Timeclock service identity and dedicated production-ready keys/DB scope, reconcile PR #32/#33/#34/#38/#39-#42, fully test Timeclock/session/rate-limiter, CSRF/proxy/browser and legacy clock routes, deploy only with explicit owner authorization, and run the private device setup flow (primary PIN sign-in → approved enrollment request → new QR scan → six-digit confirmation). No test PIN/OTP/secret should ever be pasted in chat.


## Independent live primary Authenticator approver boundary — 2026-11-09

**System:** Employee Admin / shared staff authentication / primary Timeclock Authenticator onboarding. **Status: In Development; implemented in draft source, automated tests passed; not deployed, not real-user verified.**

- [Lightspeed draft PR #43](https://github.com/Tawgod/Lightspeed/pull/43), `feature/primary-owner-enrollment-preflight-20261109` (functional SHA `2603ef4facdcd3cfc9bab43ca09119bff46e82b2`; later documentation SHA `b68d014187539d57f54744d5510421e5159095f6`) stacks on PR #42. New `services/security/independentPrimaryEnrollmentApproval.js` validates fresh strong approver passkey/security-key/IdP MFA, active canonical Timeclock identity for BOTH parties, distinct approving and enrolling employee IDs, and exact backend enrollment grant. Neither a PIN, Authenticator alone, synthetic 901 Owner, Scanner approval nor the browser's role controls enrollment.
- The test-only **unmounted** `primaryTimeclockTotpSubsystem.js` now uses that gate for the existing durable PostgreSQL enrollment approvals and encrypted TOTP subsystem. Its read-only preflight returns availability of a separately commissioned approver and an explicit next gate, always with `enrollmentAuthorized:false`. It never writes an Owner, resets PIN, changes employee records or displays a secret.
- [GitHub Actions 42711042161](https://github.com/Tawgod/Lightspeed/actions/runs/42711042161) **SUCCESS**, including independent-approver and existing primary Timeclock/TOTP composition tests.
- **Blocking decision:** first real Owner needs a *separately designed and audited secure commissioning ceremony* and recovery authorization to avoid circular self-approval. Current live Owner Timeclock employee ID, independently verified commissioning authority and strong credential have not been established. Do **not** adopt synthetic employee 901 staging self-approval exception. Coordinate with Timeclock/Employee Admin and deployment channels. No production or staging source deployment, DB migration, key change, real employee access, Chrome package or credential enrollment happened. The unrelated staged Admin Navigation Railway patch remains untouched.

**Recommended next action:** design and review an explicit one-time real Owner commissioning process using verifiable independent proof and immutable audit; then complete end-to-end test-environment signed primary Timeclock session acceptance, recovery readiness and real-device enrollment. Do not permit Owner self-approval or deploy until the first-Owner trust anchor is independently established and owner authorizes rollout.


## First real Owner passkey commissioning candidate — 2026-11-09

**System:** Shared staff authentication / Employee Administration / first Owner. **Status: In Development; automated contract TESTED; NOT mounted, migrated, deployed or verified against real employee.** Draft [Lightspeed PR #44](https://github.com/Tawgod/Lightspeed/pull/44), `feature/first-real-owner-commissioning-20261109`, stacked on independent primary enrollment PR #43. Adds **unapplied** `db/hc_owner_commissioning.sql` with short-lived one-use authorization records and append-only commissioning events; `services/security/firstOwnerCommissioning.js` supplies a candidate `commitRegistrationGrant` hook for the EXISTING Postgres verified-WebAuthn registration transaction. It requires canonical signed primary Timeclock identity, a separately issued approval record, independent evidence verification, no pre-existing active Owner, atomic one-use approval consumption + Owner grant + audit. No endpoint can mint the approval from a Timeclock PIN, Discord role or client claim.

Automated source/fixture tests [Actions run 42714947158](https://github.com/Tawgod/Lightspeed/actions/runs/42714947158) passed the Owner commissioning and inherited enrollment policy tests; documentation-only commit `c97f3102b2d03eb3edae0f9eebce97c7259bbb62` adds the on-branch operator runbook `docs/FIRST_OWNER_COMMISSIONING.md`.

**Important blockers:** No real owner identity proofing service/operator or independently issued authorization exists; `verifyIndependentEvidence` and canonical session callbacks are injected contracts, not live provisioned validators. No production DB role separation, schema migration, first-Owner credential, passkey setup page mount, recovery acceptance, protected real Timeclock staging route, real employee lookup, Railway deploy, Chrome release or live factor enrollment. The first-owner write flow is **not ready** until independent trust anchor, test evidence, role privilege, concurrency and browser acceptance are reviewed and authorized. Do not reuse synthetic account 901 self-approval logic. Existing store PIN/Timeclock unaffected.

**Next:** choose/approve a genuinely independent identity-verification and operator trust mechanism, implement its auditable evidence verifier/issuer outside the employee PIN app, verify secure recovery plan, reconcile draft PR stack, test PostgreSQL transaction rollback in disposable environment, then obtain explicit permission for read-only real employee acceptance followed by separately authorized commissioning and deployment.


## Real Owner verification — signed independent commissioning authorization (2026-11-09)

**Status: In Development, source implemented / CI TESTED; no live verification, deployment or credential enrollment.** Draft [Lightspeed PR #45](https://github.com/Tawgod/Lightspeed/pull/45), `feature/first-owner-signed-attestation-20261109` (functional SHA `e721b46a0d4870371715cc69f437e18343063048`, documentation-only latest `b198cf4a1b66d0ec87321d5c13fd79f64229d8c1`) adds `services/security/firstOwnerAttestation.js` as a concrete Ed25519 signature verification adapter. The independent approval signature binds the same real Timeclock employee ID, approved operator reference, digest of independently checked evidence, approval UUID, and <=30-minute validity window. The preexisting unmounted first Owner passkey registration callback passes the signature and original DB-backed facts for verification; the **unapplied** `db/hc_owner_commissioning.sql` adds mandatory `evidence_signature`.

[GitHub Actions 42717728513](https://github.com/Tawgod/Lightspeed/actions/runs/42717728513) **SUCCESS** for valid/malformed/tampered/future/expired/wrong-signing-key approvals and inherited Owner commissioning tests. The first run caught a malformed UUID regex and was corrected before the successful run. No independent signer private key, approval issuance endpoint, identity-verification provider, external operator credential or actual Owner attestation has been established. **A signed record alone is not independent proof of human ownership**; an approved separate verifier/identity-proofing procedure is still mandatory.

**Not verified:** actual primary Timeclock employee ID, first Owner appointment, real WebAuthn passkey and recovery, production DB roles/schema, staff browser acceptance, Timeclock legacy route migration, production Railway connection. No real PIN, OTP, employee row, Owner grant, TOTP secret, test credentials, Railway or Chrome deployment was touched. Do not promote draft PRs #39–45 or convert synthetic employee 901 into a real identity until the independent authority and explicit deployment/security gates are approved.

**Next concrete decision:** choose a legitimate independent first Owner identity authority/operator (e.g. approved offline verifier or managed identity provider with independent account administration) and its recovery method. Then implement its audited authorization issuance, safely provision operator public key with strict privilege separation, connect primary read-only Timeclock identity acceptance in a separately approved environment, perform independent real-owner verification, test transaction rollback in disposable Postgres and WebAuthn device setup, and request explicit deployment authorization.
