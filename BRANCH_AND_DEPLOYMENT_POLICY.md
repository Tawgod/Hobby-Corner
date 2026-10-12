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
Contains one `Lightspeed` service deploying `Tawgod/Lightspeed:feature/order-split-poc`, duplicating the source used by `Hobby Corner/lightspeed-api`.
Observed HTTP requests in the 7 days ending 2026-10-12: 10.
The current extension code does not point to this project's domain. The visible `HC Preorders` Config sheet and the reviewed legacy preorder GitHub scripts also do not reference this Railway domain. However, the live bound Apps Script attached to the sheet cannot be independently read with the current connectors, so this project is being retained until that dependency is conclusively ruled out.

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
