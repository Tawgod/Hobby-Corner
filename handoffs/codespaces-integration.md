# Codespaces Integration System — Current Handoff

**Last verified:** 2026-11-10  
**Status:** In Development / Testing (not deployed)

## Source

- Repository: `Tawgod/Hobby-Corner`
- Authoritative development branch: `feature/codespaces-integration-foundation-20261110`
- Draft PR: [#3](https://github.com/Tawgod/Hobby-Corner/pull/3), unmerged
- Latest implementation branch commit: `b762e6c4e15367eaa9c44e2bc1156f2dd917b655`
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
- Preferred: OpenAI Secure MCP Tunnel launching the existing private stdio MCP server directly (no public HTTP adapter)
- Lightspeed PR #50 Node 22 / disposable Postgres 16 devcontainer

## Shared files / integration surfaces affected

- `codespaces-integration/` source/tests/docs in draft PR #3
- `.github/workflows/codespaces-foundation.yml`
- `CHANGELOG.md` (PR branch)
- `handoffs/codespaces-integration.md` (canonical project main only; removed duplicate from PR branch to prevent add/add conflict)
- `HOBBY_CORNER_PROJECT.md` (project main)
- No Chrome extension release queue change required because no extension surface touched.

## Remaining blockers

1. Provide a trusted bridge host with Node 22 and GitHub CLI; sign in with GitHub's browser-based `gh auth login --expiring --scopes codespace` when supported, without copying tokens into ChatGPT.
2. Create and authorize an OpenAI Secure MCP Tunnel and ChatGPT custom plugin, both owner-controlled. The tunnel can launch the existing stdio server directly; no additional public HTTP adapter is required. Preserve host-side approval/revocation.
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

- Draft At latest verification PR #3 reports `mergeable=false` after main advanced with coordination updates. Reconcile branch against latest main before any merge decision; no merge was attempted. Diff shows only 8 expected files (controller/MCP/docs/CI/CHANGELOG). Reconcile current main into the feature branch before future merge review; no force updates or production changes.

## Current next execution gate — 2026-11-10

- Source checks: 13 controller tests PASS, real stdio MCP handshake PASS in CI; no live Github Codespaces commands performed.
- Live connection is still blocked on the user-controlled OpenAI Secure MCP Tunnel and plugin creation, a private bridge host with `gh`, and appropriately scoped interactive GitHub authorization. Source instructions: `codespaces-integration/TUNNEL_SETUP.md`. Model-supplied approval strings do not constitute trusted user consent.
- First allowed step after setup is **read-only** `list_codespaces` / exact branch view. Require explicit human approval before any start or creation. Initial fixture remains Lightspeed draft PR #50.
- Do not confuse this source-level integration with a deployed ChatGPT plugin.

## Last verification — 2026-11-10

- Draft PR #3 current head `5236529e6e47b5215e835661e4dcbc2091d2dfc2`; latest head [Actions run 42843015907](https://github.com/Tawgod/Hobby-Corner/actions/runs/42843015907) SUCCESS.
- No live Codespaces or network-connected remote MCP operation attempted. GitHub's current mergeability flag is false; handle separately during branch sync and review.

## Security architecture simplification — 2026-11-10

- Confirmed OpenAI Secure MCP Tunnel supports directly launching the reviewed `mcp-stdio.mjs` server on a private host, so public HTTPS MCP service and extra OAuth implementation are unnecessary for initial private use.
- The controller now uses GitHub CLI's credential store rather than requiring an exported `GH_TOKEN`. Prefer browser sign-in with expiring credentials if supported; never paste a token into chat.
- New `codespaces-integration/TUNNEL_SETUP.md` records exact owner-controlled prerequisites, OpenAI Platform tunnel authorization, private audit path and initial read-only tool check.
- No tunnel created or connected and no real Codespace used. Owner must perform the platform/GitHub authentication steps before live validation.

## Handoff snapshot — final development continuation, 2026-11-10

- Draft PR [#3](https://github.com/Tawgod/Hobby-Corner/pull/3) head `b762e6c4e15367eaa9c44e2bc1156f2dd917b655`; GitHub latest PR metadata reported draft, unmerged and currently non-mergeable against moving main (requires branch sync prior to any merge). No merge requested or performed.
- Seven MCP tools, 13 controller tests and real stdio handshake verified in GitHub Actions. Latest current-head [GitHub Actions 42843661982](https://github.com/Tawgod/Hobby-Corner/actions/runs/42843661982) **SUCCESS**, covering token-free stdio startup, controller unit tests, SDK imports and client/server handshake. No live GitHub Codespaces tested.
- **Next owner action:** follow `codespaces-integration/TUNNEL_SETUP.md` from draft PR #3. Create/authorize an OpenAI Secure MCP Tunnel, install/authorize ChatGPT custom plugin, and sign GitHub CLI in interactively on a trusted private host. Then ask this chat to perform the first read-only Codespaces list; do not send secrets.
- No production deployment, Codespace creation, new public service, Chrome extension release or Lightspeed write.
