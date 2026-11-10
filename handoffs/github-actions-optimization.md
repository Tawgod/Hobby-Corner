# GitHub Actions Cost and CI Optimization — Current Handoff

**Last verified:** 2026-11-09
**Status:** Testing (implemented in draft review branches; no merge/deployment)

## Source

- Repository: `Tawgod/Lightspeed`; coordination repo `Tawgod/Hobby-Corner`.
- Authoritative bases: `feature/shared-lightspeed-services-phase1-20261029`, `feature/unified-hierarchical-navigation-20261109`, `feature/employee-admin-security-foundation-20261106`; coordination `Hobby-Corner:main`.
- Current PRs: [Lightspeed #46](https://github.com/Tawgod/Lightspeed/pull/46), [#47](https://github.com/Tawgod/Lightspeed/pull/47), [#48](https://github.com/Tawgod/Lightspeed/pull/48) and [Hobby-Corner #2](https://github.com/Tawgod/Hobby-Corner/pull/2), all draft.
- Current tested heads: Phase1 `bfb2f696ddf16d180736b71427494afd97d5f29d`; Navigation `4006da78f31f134f5b320699806cb96013bd6165`; Admin `10f8614d88bb782f55784995f9385f501a708491`.
- Superseded PRs / branches: none; draft optimization branches are additions to active development.

## Implemented

- Audited GitHub Actions run history on November 1–9, 2026: **1,460 Lightspeed runs**. Approximate summed workflow elapsed time **1,920 wall-clock minutes**. Account's 1,800/2,000 billed included minutes is **user-reported**; GitHub billing and branch-protection settings unavailable to the connected App.
- Largest workloads (runs; rounded wall minutes): Shared Lightspeed foundation **543; ~878**, Core Operations browser **255; ~566**, Scanner **313; ~342**, Navigation **133; ~46**, Navigation Admin **100; ~44**. Repeated full-suite runs and duplicate push/PR triggers are primary optimization targets.
- Phase1 draft: redundant foundation feature push removed where PR covers it, npm download cache, per-PR cancellation, timeout. Core Operations browser and scanner checks gain caching, cancellation, timeout. No test list or check/job name removal.
- Navigation draft: removes duplicate navigation and nav-admin feature pushes; adds concurrency/timeouts/cache to navigation, Admin navigation, shared UI and Core Operations while preserving all tests and PostgreSQL auth gates.
- Admin draft: suppresses redundant full security/Admin feature push runs; maintains PR/manual validation with original job/check names, adds Admin base to PR selector, per-PR cancellation, timeouts and npm download cache.
- Added `AGENTS.md` three-level AI and CI policy on all three development branches; [Hobby-Corner policy PR #2](https://github.com/Tawgod/Hobby-Corner/pull/2) adds a coordination-repository counterpart.
- Audit and forecast report: `Tawgod/Lightspeed:chore/actions-budget-phase1-20261109/docs/GITHUB_ACTIONS_AUDIT_20261109.md`.

## Tested

- Automated: PR #46 reported **SUCCESS**: [Shared foundation 42741292522](https://github.com/Tawgod/Lightspeed/actions/runs/42741292522), [Scanner 42741292523](https://github.com/Tawgod/Lightspeed/actions/runs/42741292523), [Core Operations 42741292608](https://github.com/Tawgod/Lightspeed/actions/runs/42741292608).
- Automated: PR #47 reported **SUCCESS** in Shared UI, Navigation Admin, Unified Navigation [42741297256](https://github.com/Tawgod/Lightspeed/actions/runs/42741297256), [42741297401](https://github.com/Tawgod/Lightspeed/actions/runs/42741297401), [42741297279](https://github.com/Tawgod/Lightspeed/actions/runs/42741297279). Core Operations browser [42741297313](https://github.com/Tawgod/Lightspeed/actions/runs/42741297313) still in progress at last check.
- Automated: PR #48 reported **SUCCESS** [Employee Admin 42741302820](https://github.com/Tawgod/Lightspeed/actions/runs/42741302820) and [Shared foundation 42741302487](https://github.com/Tawgod/Lightspeed/actions/runs/42741302487).
- Browser / employee acceptance: Core Operations browser jobs run in CI where complete; no real employee acceptance involved.
- Runtime / deployment verification: **no deployment**, GitHub config-only.

## Deployed

- Environment: none.
- Service / extension version: unchanged.
- Deployment reference: none.
- Production status: unchanged.

## Shared dependencies

- Required CI check names/branch protection, shared security/Postgres and Timeclock/Scanner code, Core Operations browser acceptance, active Admin/Nav PR branches.
- `package-lock.json` absent on audited branches; no npm ci/native setup-node cache. Cache npm downloads only.

## Shared files / integration surfaces affected

- `AGENTS.md`, branch-specific `.github/workflows/*.yml`, `CHANGELOG.md`, audit report. No production code/DB/extension changed.

## Remaining blockers

- GitHub App reports 403 for branch protection API; repository admin must confirm check contexts and no permanently pending required checks before any merge.
- Only the reviewed development branches contain optimized YAML. Reconciling the divergent integration, Admin, Navigation and production source branches is not complete.
- No direct billed-minute breakdown or cache hit-rate available. Cost savings remain projections.

## Decisions needed

- Owner/admin approval to merge each draft into its appropriate base after required-check review.
- Whether to review further overlapping scanner/navigation test suites under a separate exact-coverage proposal; not removed here.

## Recommended next action

- Finish PR #47 browser job and confirm statuses. Review branch protection required check contexts with repository admin. Merge only with explicit approval. Then measure actual billed runner minutes and cache hits in GitHub billing after a comparable week.
- Savings modeling: roughly 200–400 **elapsed run-minutes per 9 days** avoided at similar high PR activity, equivalent to ~650–1,300 extrapolated elapsed run-minutes per 30 days **not a billed-minute forecast**. Expected avoided-run reduction ~15–35% on optimized branches, with workload variability.

## Restrictions / safety

- Do not weaken security, authentication, permission, financial, migration, production deploy or extension release validation to save CI.
- Do not merge, deploy, alter branch protection or change required status names without separate explicit owner authorization.
- No schedule was found in the audited workflow definitions; do not add any without review.

## Documentation

- `Tawgod/Lightspeed:chore/actions-budget-phase1-20261109/docs/GITHUB_ACTIONS_AUDIT_20261109.md`
- `AGENTS.md` candidates on Lightspeed and Hobby-Corner.
