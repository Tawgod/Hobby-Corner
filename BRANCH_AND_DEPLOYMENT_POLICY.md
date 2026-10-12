# Hobby Corner GitHub and Railway Organization Policy

Last verified: 2026-10-12

## Goal

Keep one clearly identifiable production path per deployed system, keep feature branches temporary, and avoid duplicated Railway deployments.

## Current authoritative deployments

### Railway project: Hobby Corner
- `lightspeed-api` -> `Tawgod/Lightspeed:feature/order-split-poc`
- `timeclock` -> `Tawgod/Lightspeed:feature/order-split-poc` (`/timeclock`)
- `special-orders-test` -> `Tawgod/Lightspeed:special-orders-foundation-livebase-2026-10-02`
- `Hobby-Corner-Discord-Bot` -> `Tawgod/Hobby-Corner-Discord-Bot:main`
- `Hobby-Corner-Rewards` -> `Tawgod/Hobby-Corner-Discord-Bot:main`
- `Postgres` -> shared persistent database
- `migration-test-bsi117` -> active migration/direct-connection test function

The Chrome extension source currently points to the `lightspeed-api` and `timeclock` domains in this main Railway project. Those domains are therefore authoritative.

## Railway cleanup candidates

### `capable-trust`
Cleanup status: service retired 2026-10-12.
The duplicate `Lightspeed` service that deployed `Tawgod/Lightspeed:LivBranch` had 0 HTTP requests in the prior 7 days and was deleted after approval. The Railway project now contains no services or volumes. The project container itself remains because the connected Railway tools do not expose project deletion.

### `enthusiastic-rebirth`
Cleanup status: service retired 2026-10-12.
Investigation showed this project duplicated `Hobby Corner/lightspeed-api` from the same `feature/order-split-poc` source. Its observed traffic was limited to `/extension` and `/favicon.ico`; installed extension code already used the main Hobby Corner `lightspeed-api`, `timeclock`, and `special-orders-test` domains. No unique volume, service data, or active GitHub reference to the old Railway domain was found. The duplicate `Lightspeed` service was deleted after approval. The Railway project container is now empty.

Do not delete either project until explicitly approved.

## GitHub branch policy

For active application repositories:
- One stable integration/production branch.
- Short-lived `feature/*` branches only while actively being developed.
- Test/deployment branches should be merged or retired after acceptance.
- Before deleting a historically useful branch, preserve it with a tag or documented commit SHA.
- Railway must never be assumed to follow the repository default branch; deployment source must be recorded here.

## Tawgod/Lightspeed

Current branches:
- `LivBranch`
- `V1.2`
- `Apps-script-importer`
- `Importer`
- `feature/order-split-poc`
- `feature/product-scanner-foundation`
- `special-orders-foundation-2026-10-02`
- `special-orders-foundation-livebase-2026-10-02`

Branch findings:
- `V1.2` is 56 commits behind `LivBranch` with no unique commits. Retirement candidate.
- `Apps-script-importer` and `Importer` are identical. At most one should remain temporarily; because importer work is legacy, both are eventual retirement candidates.
- `feature/order-split-poc` is 115 commits ahead of `LivBranch` and is currently deployed by two production services. It cannot be deleted until its work is integrated into a stable branch and Railway is repointed.
- `feature/product-scanner-foundation` is 10 commits ahead of `feature/order-split-poc`; it is an active development branch and should remain.
- `special-orders-foundation-2026-10-02` and `special-orders-foundation-livebase-2026-10-02` diverge historically, but the five unique commits on the older branch have now been reconciled. They are the original foundation commits for schema, API, dashboard shell, PostgreSQL dependency, and server mounting. Each is fully represented and expanded in the deployed live-base branch. No cherry-pick is required. The older branch is now a safe archival/deletion candidate.
- `special-orders-foundation-livebase-2026-10-02` is the current deployed special-orders branch and must remain until merged into the future stable branch.

Recommended target:
1. Reconcile current order-split/timeclock/special-orders work into one stable branch after testing.
2. Point Railway production services at that stable branch.
3. Keep `feature/product-scanner-foundation` only while scanner work is active.
4. Retire superseded feature branches after merge and deployment verification.

## Tawgod/Lightspeed-Importer

Branches:
- `main`
- `ChatGPT`

`ChatGPT` and `main` have diverged by two commits each.
Because this repository is now legacy except for remaining category-mapping work, do not merge blindly.
Recommended target: finish category-mapping work on one chosen branch, preserve any unique useful changes from the other, then retain only `main` as the maintenance branch.

## Tawgod/Hobby-Corner-Discord-Bot

Branches:
- `main`
- `gw-preorder-test-publisher`
- `product-migration-colab`

Findings:
- `gw-preorder-test-publisher` is one commit ahead of `main`; determine whether the publisher change should be merged or retired with the legacy preorder sheets.
- `product-migration-colab` is 38 commits ahead of `main` and contains migration tooling plus changes to rewards/RMS bridge files. It should remain until product migration/direct-connection work is reconciled; it is not a trivial stale branch.

Recommended target:
- Keep `main` as deployed production.
- Keep migration work isolated while still active.
- Retire the preorder publisher branch with the old preorder workflow unless its one unique commit is still needed.

## Tawgod/Hobby-Corner

Branches:
- `main` — authoritative project-management documentation.
- `Lightspeed` — old ancestor of `main`; retirement candidate.
- `Preorder-Script-GW` — legacy preorder Apps Script branch.
- `TCG-Preorder` — descendant of `Preorder-Script-GW` with three additional commits.

Recommended target:
- Keep `main`.
- Preserve legacy preorder branches until the special-orders replacement is accepted, then archive/tag the final useful state and delete both legacy branches.
- `Lightspeed` can be retired after explicit approval because it has no unique commits.

## Cleanup sequence

1. No production changes during audit.
2. Retire zero-unique-commit GitHub branches first.
3. Reconcile branches with unique commits before deletion.
4. Verify Railway domains and request traffic before service/project retirement.
5. Move deployed services to a stable branch only after feature acceptance.
6. Retire duplicated Railway projects only after confirming no external integration references their domains.
7. Update `HOBBY_CORNER_PROJECT.md` and `CHANGELOG.md` after each cleanup batch.


## Active branch consolidation — 2026-10-12

Created non-deployed branch `Tawgod/Lightspeed:integration/hobby-corner-consolidation` from the current Special Orders live-base.

Consolidation performed:
- Merged PR #3 from `feature/order-split-poc` into the integration branch. GitHub reported the merge clean. This added the seven order-split-only commits, including Lightspeed customer ZIP/USPS helpers and Special Orders launcher/version updates.
- Scanner PR #4 conflicted only because scanner work modified the same popup/manifest files. The conflict was resolved by applying the scanner versions of `extension/manifest.json`, `extension/popup.html`, and `extension/popup.js`, plus all five new `extension/product-scanner/*` files, directly to the integration branch.
- All eight scanner-touched files were verified byte-identical to `feature/product-scanner-foundation` after resolution.
- The integration branch was verified to retain Special Orders backend/schema, order-split support, and USPS/address functionality.

Current recommendation:
- Treat `integration/hobby-corner-consolidation` as the candidate unified code line for testing.
- Do not repoint Railway until consolidated behavior is tested.
- Existing deployed branches remain authoritative for their current services until a controlled cutover.
- `special-orders-foundation-2026-10-02` is superseded and can be retired.
- `feature/product-scanner-foundation` is functionally reconciled into the integration branch; keep only until scanner development resumes from the consolidated base or the old branch is manually removed.
- `feature/order-split-poc` remains deployed and must stay until Railway is deliberately repointed.
- `special-orders-foundation-livebase-2026-10-02` remains deployed and must stay until Railway is deliberately repointed.


## Consolidation test gate — 2026-10-12
`integration/hobby-corner-consolidation` has passed syntax, JSON, module/import, extension-reference, and merge-structure validation. Runtime logs from the deployed Special Orders test service exposed three defects that have been fixed only on the integration branch. Do not repoint Railway yet. Require a database-backed smoke test and core employee workflow acceptance before using this branch as the stable deployment line.


## Isolated Railway test project — 2026-10-12
The consolidated branch now has an independent Railway project, `Hobby Corner Integration Test`, with its own PostgreSQL database. Use this project for database-backed consolidation testing. Do not connect its database to production. Live Lightspeed writes, migration, and product-write flags are disabled. A successful second deployment against the same database verified schema restart safety. Production services remain on their existing branches until acceptance.


## Functional test gate — 2026-10-12
The isolated consolidated environment has passed Special Orders 8/8 HTTP/database smoke tests, Timeclock 8/8 workflow smoke tests, and verified 14-hour automatic clock-out behavior. The branch is still **Testing**, not production-ready, because Lightspeed-authenticated operations and staff Chrome-extension workflows have not yet been exercised from the consolidated deployment. Review the two high-severity npm dependency findings before production promotion.


## Production source consolidation started — 2026-10-12
Railway source mappings for `lightspeed-api`, `timeclock`, and `special-orders-test` now follow `integration/hobby-corner-consolidation`. Replacement deployments are still initializing, so this is not yet a completed cutover. Keep `feature/order-split-poc` and `special-orders-foundation-livebase-2026-10-02` until the consolidated deployments are verified successful.
