# Codespaces Integration System — Current Handoff

**Last verified:** 2026-11-10  
**Status:** In Development

## Source

- Repository: `Tawgod/Hobby-Corner`
- Authoritative branch: `feature/codespaces-integration-foundation-20261110`
- Current PR: pending creation in this development pass
- Current commit: branch created from `main`; implementation commits pending
- Superseded PRs / branches: none

## Implemented

- Audited connected GitHub capabilities: no Codespaces lifecycle, SSH, terminal or arbitrary command action is exposed.
- Verified GitHub-supported Codespaces lifecycle APIs and GitHub CLI SSH path.
- Selected narrow custom MCP bridge architecture rather than replacing the existing GitHub connector.
- Added dependency-free Milestone 2 smoke probe with allowlisted repo/branch lifecycle control and a fixed non-destructive `node --version` remote test.
- Added architecture and security documentation.

## Tested

- Automated: local syntax validation planned in this pass; no GitHub Actions required for the initial probe.
- Browser / employee acceptance: not applicable.
- Runtime / deployment verification: **not yet tested against a real Codespace** because this ChatGPT connection cannot invoke Codespaces/SSH.

## Deployed

- Environment: none
- Service / extension version: none
- Deployment reference: none
- Production status: not deployed

## Shared dependencies

- GitHub Codespaces
- GitHub CLI / Codespaces SSH
- Existing ChatGPT GitHub plugin
- Future custom MCP plugin connection
- Initial test fixture: `Tawgod/Lightspeed` PR #50 branch and its isolated Node 22/PostgreSQL 16 devcontainer

## Shared files / integration surfaces affected

- New project-only `codespaces-integration/` source/documentation
- No Chrome extension files
- No Railway services or credentials
- No Lightspeed production source

## Remaining blockers

- Connect a reviewed custom MCP server or Secure MCP Tunnel to ChatGPT.
- Obtain minimum GitHub user authorization for Codespaces through supported short-lived credentials.
- Runtime-test list/start/SSH/stop against a development Codespace.
- Add controlled test profiles for Node, PostgreSQL and Playwright.
- Add arbitrary command support only after approval policy and injection defenses are reviewed.

## Decisions needed

- Choose remote HTTPS MCP deployment vs Secure MCP Tunnel for the bridge once account/workspace support is confirmed.
- Decide whether the bridge should be hosted on an isolated Railway test service or another dedicated non-production host.

## Recommended next action

- Finish local syntax checks and open the draft PR.
- Then connect the bridge in a supported ChatGPT plugin environment and run Milestone 2 against PR #50's Codespace configuration.

## Restrictions / safety

- No production credentials, employee/PIN/customer data, or production database access.
- No public forwarded ports.
- No deployment, destructive command, secret change, production operation, git push or commit without explicit authorization.
- Reuse matching Codespaces and stop them after work.

## Documentation

- `codespaces-integration/README.md`
- `codespaces-integration/ARCHITECTURE.md`
- PR #50: `docs/FIRST_OWNER_CODESPACES_TESTING.md`
