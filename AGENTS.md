# Hobby Corner — AI and CI Usage Rules

**Effective:** November 9, 2026. These apply to all Hobby Corner repositories, branches, and AI-assisted development. See the full Lightspeed audit and policy in the proposed `Tawgod/Lightspeed` CI optimization PR #46 (`docs/GITHUB_ACTIONS_AUDIT_20261109.md` and `AGENTS.md`).

## Testing levels
1. **Routine development:** Run fast local syntax/lint/type/targeted unit tests. Batch logical commits and avoid unnecessary GitHub pushes, documentation-only commits that retrigger full CI, and uninvestigated reruns.
2. **PR readiness:** Preserve integration, browser, database and security validation for relevant changes. Keep required check/job names and path triggers intact unless equivalent check coverage is verified with repository protection settings. Cancel superseded PR runs.
3. **Production release:** Complete full regression, authentication, authorization, security, migration, audit and deployment checks even when Actions minutes are scarce. No production/Chrome extension release, schema mutation, credential change or destructive action without explicit owner authorization.

## Workflow implementation requirements
- Use PR-scoped concurrency with cancellation of outdated **development** runs; do not cancel production deploy jobs.
- Avoid running the same workflow on `push` and `pull_request` for the same development commit when the PR already provides mandatory coverage.
- Set reasonable job timeouts; cache dependency/download archives safely and never cache secrets, mutable installed module trees or unreviewed artifacts.
- Apply narrow `paths` filters only where validated. Keep the workflow's own YAML path included, and never leave a required status permanently pending.
- Keep schedules rare and justified; no new periodic workflows without documented value, cadence and cost.
- Look up current workflow runs and failure logs before rerunning; do not repeatedly rerun known-bad commits. Reuse prior successful checks only for the **exact unchanged code/dependency commit**.
- Review GitHub billing metrics for actual included minutes; workflow wall time, run counts and estimates are not invoices.
- Lockfile introduction and associated `npm ci` / setup-node caching requires separate dependency-review approval when a repository currently lacks a lockfile.

## Coordination
- `Tawgod/Lightspeed` workflow definitions diverge by branch. Coordinate the separate review PRs #46 (Phase 1), #47 (Navigation) and #48 (Admin) before branch consolidation.
- Preserve the official extension release queue `CHROME_EXTENSION_RELEASE_QUEUE.md` and authoritative `Tawgod/Lightspeed:integration/hobby-corner-consolidation` prior to extension packaging, release or deployment.
- Keep a standard handoff under `handoffs/` after a CI policy milestone and include source branch, test/run results, risks, next steps and verified release status.
- No documentation policy or CI optimization PR is authorization to deploy, merge, bypass identity verification, or relax financial/security/permission controls.
