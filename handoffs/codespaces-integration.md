# Codespaces Integration System — Current Handoff

**Last verified:** 2026-11-10  
**Status:** In Development / Testing (not deployed)

## Source

- Repository: `Tawgod/Hobby-Corner`
- Authoritative development branch: `feature/codespaces-integration-foundation-20261110`
- Draft PR: [#3](https://github.com/Tawgod/Hobby-Corner/pull/3), unmerged
- Latest implementation branch commit: `5236529e6e47b5215e835661e4dcbc2091d2dfc2`
- Test fixture: `Tawgod/Lightspeed:feature/first-owner-passkey-registration-integration-20261110`, draft PR #50

## Implemented

- Audited ChatGPT GitHub connector; no Codespaces lifecycle, SSH or terminal action available.
- Reviewed official GitHub CLI Codespaces list/create/view/SSH and Codespaces REST start capabilities.
- Chose a narrow custom MCP bridge rather than replacing the existing GitHub connector.
- Added `codespaces-integration/scripts/codespaces-core.mjs`: allowlisted GitHub CLI controller with list/reuse/create/start/stop/fixed Node smoke, bounded output/timeouts, no shell interpretation, operation audit trail and cleanup preserving preexisting running environments.
- Added `codespaces-integration/scripts/mcp-stdio.mjs`: seven MCP tool definitions including two fixed first Owner test profiles (`owner-source` Node syntax; `owner-postgres` disposable PostgreSQL), with explicit operation intent strings.
- Removed superseded prototype smoke script.
- Added PR-scoped lightweight GitHub Actions verification.

## Tested

- Local Node 22 `node --check` on controller and MCP entrypoint: PASS.
- Local Node built-in suite: **13/13 PASS** with simulated GitHub CLI including wrong-branch denial, unsafe-name rejection, approval gate, reuse and cleanup.
- GitHub Actions workflow [42842879645](https://github.com/Tawgod/Hobby-Corner/actions/runs/42842879645): **SUCCESS**, with 13 controller tests, SDK dependency import and actual isolated MCP stdio client/server handshake (7 tools listed). Subsequent changes were documentation-only.
- MCP SDK dependency installation/stdio handshake: **NOT VERIFIED** (npm registry unavailable from assistant runtime).
- Real Codespaces create/start/SSH/stop: **NOT VERIFIED** (the connected ChatGPT GitHub plugin exposes no Codespaces operations).
- No live browser, PostgreSQL or employee acceptance.

## Deployed

- Environment: none; stdio MCP adapter only, not a remote hosted connection.
- Railway: unchanged.
- Chrome extension: unchanged.
- Production: unchanged.

## Shared dependencies

- GitHub Codespaces / GitHub CLI with signed-in user authorization
- GitHub-connected ChatGPT plugin for existing repo/PR/CI operations
- Future reviewed authenticated remote MCP adapter or approved secure tunnel
- Lightspeed PR #50 Node 22 / disposable Postgres 16 devcontainer

## Shared files / integration surfaces affected

- `codespaces-integration/` source/tests/docs in draft PR #3
- `.github/workflows/codespaces-foundation.yml`
- `CHANGELOG.md` (PR branch)
- `handoffs/codespaces-integration.md` (canonical project main only; removed duplicate from PR branch to prevent add/add conflict)
- `HOBBY_CORNER_PROJECT.md` (project main)
- No Chrome extension release queue change required because no extension surface touched.

## Remaining blockers

1. Provide a trusted bridge host with Node 22 and GitHub CLI plus appropriately scoped, short-lived GitHub user authorization; do **not** paste GitHub tokens into ChatGPT.
2. Review, implement and authorize an authenticated HTTPS remote MCP adapter (or supported secure tunnel), host-side real user approval and revocation. Current stdio source alone cannot be used by ChatGPT remotely.
3. Validate live `gh codespace list/view` branch representation before lifecycle mutation.
4. Perform the first approved dev Codespace smoke and retrieve output.
5. Complete live acceptance of fixed Node/PostgreSQL profiles; add Playwright/browser profiles, resource monitoring, error recovery and stop-idle policy. Keep required Actions release gates.

## Decisions needed

- User authorization and approved isolated bridge hosting approach; production hosting/credentials not authorized.
- Approval mechanism at MCP host boundary, not just model-supplied strings.

## Recommended next action

- Review draft PR #3 and connect an approved remote MCP bridge with minimal GitHub Codespaces scopes.
- Then run read-only list/view against the PR #50 environment before authorizing a start/SSH/stop test.
- Do not merge PR #3 or deploy any service without explicit authorization.

## Restrictions / safety

- No arbitrary shell or git writes; fixed `node --version` only.
- No production API keys, employee/PIN/customer data, production DB connections, public ports, credential changes, Chrome extension package or production deployment.
- Never interpret model-supplied approval phrases as verified human consent.

## Documentation

- `codespaces-integration/README.md`
- `codespaces-integration/ARCHITECTURE.md`
- `codespaces-integration/tests/codespaces-core.test.mjs`
- `Tawgod/Lightspeed` draft PR #50: `docs/FIRST_OWNER_CODESPACES_TESTING.md`

## Latest PR integration note — 2026-11-10

- Draft PR #3 was later rechecked and reported `mergeable=true`; no merge was attempted. Diff shows only 8 expected files (controller/MCP/docs/CI/CHANGELOG). Reconcile current main into the feature branch before future merge review; no force updates or production changes.

## Current next execution gate — 2026-11-10

- Source checks: 13 controller tests PASS, real stdio MCP handshake PASS in CI; no live Github Codespaces commands performed.
- Live connection is still blocked on a reviewed, authenticated remote MCP adapter or supported tunnel, a bridge host with `gh`, and appropriately scoped user authorization. Model-supplied approval strings do not constitute trusted user consent.
- First allowed step after setup is **read-only** `list_codespaces` / exact branch view. Require explicit human approval before any start or creation. Initial fixture remains Lightspeed draft PR #50.
- Do not confuse this source-level integration with a deployed ChatGPT plugin.
