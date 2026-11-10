# Hobby Corner Codespaces Integration

**Status: In Development — not connected / not deployed.**

This reusable integration is separate from the Lightspeed Chrome extension and all Railway production services.

## Source ownership

- Development branch: `Tawgod/Hobby-Corner:feature/codespaces-integration-foundation-20261110`
- Draft PR: [Hobby-Corner #3](https://github.com/Tawgod/Hobby-Corner/pull/3)
- Test fixture: `Tawgod/Lightspeed:feature/first-owner-passkey-registration-integration-20261110` / draft PR #50
- Installed GitHub plugin continues to handle repository, PR and Actions work. It does **not** expose Codespaces control or terminal commands.

## Current implementation

`scripts/codespaces-core.mjs` is a dependency-free, injection-resistant GitHub CLI controller. `scripts/mcp-stdio.mjs` exposes it as an MCP stdio server using the official JavaScript MCP SDK.

| MCP tool | Behavior |
| --- | --- |
| `list_codespaces` | Read-only list filtered to `Tawgod/Lightspeed` |
| `create_codespace` | Reuse the PR #50 branch environment if available; otherwise create one with 30m idle timeout |
| `start_codespace` | Start only an exact allowlisted repository + branch environment |
| `node_version` | Run exactly `node --version` via Codespaces SSH |
| `stop_codespace` | Stop only an exact allowlisted development environment |
| `smoke_codespace` | Start existing environment, run the fixed test, stop if this operation started it |
| `run_test_profile` | Run one of two audited fixed profiles: `owner-source` (Node syntax) or `owner-postgres` (disposable database tests) |

All lifecycle operations require explicit intent text in their tool arguments. **Those strings are not cryptographic proof of user approval**; the ChatGPT host/MCP connection must independently require real user confirmation for charge-incurring or state-changing operations.

The controller validates the Codespace name against a restricted character class, verifies its repository and branch using a separate view command, never invokes a shell, limits process runtime/output, and can append redacted lifecycle events to a private audit log. It does not implement arbitrary shell, git writes, credential manipulation, deployment or public port forwarding. The fixed test profiles explicitly run from `/workspaces/Lightspeed` and operate only in an already Available Codespace; unlike the smoke operation, they never start or stop an environment. The `owner-postgres` profile depends on PR #50's isolated `hc_test` database; it must not be used with production database credentials.

## Local checks

```bash
cd codespaces-integration
npm test
npm run check
```

The controller unit tests run on Node 22 without installing npm dependencies. CI also installs the MCP SDK and runs an isolated real MCP stdio client/server handshake that enumerates the tool interface without making any GitHub calls. The MCP entrypoint additionally needs `npm install`, a reviewed authentication source, and `gh` installed on the bridge host.

## Running an MCP stdio bridge on a trusted host

```bash
npm install --ignore-scripts --no-audit --no-fund
export HC_CODESPACE_AUDIT_PATH="/private/audit/codespaces.jsonl"
# GH_TOKEN supplied through secure GitHub-supported authorization, not typed into a chat or checked into source.
npm start
```

**Do not use this as a public remotely accessible service.** A stdio server cannot be reached directly from ChatGPT's remote MCP plugin flow. Before live ChatGPT control, implement a reviewed authenticated remote HTTPS MCP endpoint (or supported secure tunnel) with identity binding, per-user approvals, audit/revocation and transport security. No such server is currently deployed.

## Known limitations

- The actual `gh` Codespaces lifecycle and SSH paths have **not** run against GitHub.
- GitHub CLI `gitStatus.ref` representation requires a first read-only live verification before any mutation.
- An isolated PR CI check installs/imports the MCP SDK and exercises a client/server stdio handshake. An authenticated ChatGPT plugin connection is still unverified.
- The original proof-of-concept smoke script has been removed. The policy-checked controller is the single implementation.
- No real database or browser tests, user GitHub authorization, Codespace creation, compute usage, or production work occurred.

## Required next setup

Use an authorized isolated bridge host with Node 22, GitHub CLI, and short-lived scoped GitHub user authorization. Do not paste tokens in ChatGPT. The owner must approve creating/starting a development Codespace and the future ChatGPT plugin connection. No production credentials, real staff data, or port visibility changes are permitted.

## Verified CLI contract and next acceptance gate

The GitHub CLI reference confirms `codespace list --json name,state,repository,gitStatus,displayName`, `codespace view --json name,repository,gitStatus,state,idleTimeoutMinutes`, `codespace create --idle-timeout 30m`, and `codespace ssh --codespace <name> <fixed-command>`. The final branch match must still be checked against the **actual returned data** from the owner's Codespaces identity.

Before the first charged operation, use read-only `list_codespaces` followed by an exact `view` of the chosen Codespace. Only after confirming `Tawgod/Lightspeed`, the PR #50 development branch, and the private devcontainer should the owner explicitly approve start/create. Never transmit the `GH_TOKEN` value into ChatGPT.
