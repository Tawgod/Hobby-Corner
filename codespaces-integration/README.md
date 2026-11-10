# Hobby Corner Codespaces Integration

Status: **In Development / not deployed**

This directory contains the first controlled integration layer for managing Hobby Corner GitHub Codespaces from an AI tool surface.

## Architecture decision

The existing ChatGPT GitHub plugin remains the source-control integration. It can read/write repositories, PRs, issues, and CI, but the connected tool surface does not expose GitHub Codespaces lifecycle or terminal execution.

GitHub itself provides supported Codespaces REST endpoints for list/create/start/stop, while GitHub CLI provides `gh codespace ssh` for command execution. The intended final ChatGPT integration is therefore a small custom MCP server exposing only Codespaces operations, backed by GitHub-supported user authorization and short-lived credentials.

Do **not** add a broad replacement GitHub API proxy.

## Security boundary

Initial allowlist:
- Repository: `Tawgod/Lightspeed`
- Initial test branch: `feature/first-owner-passkey-registration-integration-20261110`
- Development/test Codespaces only
- No Railway, Lightspeed production, employee, PIN, customer, or production database credentials
- No public forwarded ports
- No arbitrary shell in Milestone 2
- No deploy, secret change, destructive command, or production mutation

The bridge must run with an ephemeral GitHub user token that has only the Codespaces permissions required for the operation. Never commit a token or store one in this repository.

## Milestone 2 smoke probe

`scripts/codespace-smoke.mjs` is a dependency-free control-plane probe intended to be run only from an authorized bridge host with GitHub CLI installed and authenticated through `GH_TOKEN`.

Supported actions:

```bash
node scripts/codespace-smoke.mjs list
node scripts/codespace-smoke.mjs create
node scripts/codespace-smoke.mjs start <codespace-name>
node scripts/codespace-smoke.mjs test <codespace-name>
node scripts/codespace-smoke.mjs stop <codespace-name>
node scripts/codespace-smoke.mjs smoke <codespace-name>
```

The `test` action executes exactly `node --version` in the selected Codespace. The `smoke` action starts an existing Codespace, waits for it to become Available, runs that fixed command, and stops the Codespace in a `finally` cleanup path.

Creating a Codespace uses the exact allowlisted repository and branch and requests a 30-minute idle timeout.

## Current limitation

This ChatGPT conversation cannot invoke the probe because the installed GitHub connector exposes no Codespaces/SSH/terminal action. The probe is therefore **implemented but not runtime-tested against GitHub Codespaces**. Connecting it to ChatGPT requires deploying or tunneling a reviewed remote MCP server and authorizing that plugin in ChatGPT.

Do not interpret source implementation as a deployed integration.
