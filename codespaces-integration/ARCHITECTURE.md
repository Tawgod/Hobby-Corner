# GitHub Codespaces — Architecture and Security Decision

**Verified:** 2026-11-10  
**Status:** In Development

## Existing capabilities

- GitHub plugin: repository, branch, file, issue, PR and Actions operations; **no Codespaces lifecycle or remote terminal action**.
- Official GitHub CLI supports Codespaces list/create/view/start/stop (start through REST) and SSH.
- Existing Lightspeed PR #50 includes Node 22 + isolated PostgreSQL 16 devcontainer on a development branch; runtime not yet tested.
- Custom MCP plugin is required to make the new control tools callable within ChatGPT. The current code only implements local stdio transport and has not been installed as a custom plugin.

## Architecture

```
ChatGPT custom plugin / owner approval
          |
OpenAI Secure MCP Tunnel (owner setup REQUIRED)
          |
Private stdio MCP server (IMPLEMENTED, handshake TESTED)
          |
Policy-checked Codespaces controller (IMPLEMENTED)
          |
GitHub CLI/API + SSH on isolated bridge host
          |
Only allowlisted Tawgod/Lightspeed PR #50 Codespace
          |
Private Node 22 / test-only PostgreSQL 16
```

## Non-negotiable controls

1. Do not rely on an LLM-supplied approval phrase as user authorization; enforce user approval in the host/authenticated MCP boundary.
2. Pin the exact repository and branch until a reviewed authorized allowlist expansion.
3. No arbitrary shell, production API keys, customer/employee/PIN data, Railway production secrets, or public forwarded ports.
4. The bridge host must not have unrestricted repo or infrastructure credentials.
5. GitHub-supported short-lived authorization, connection revocation, and per-user audit events before any remote deployment.
6. Process timeout, bounded output, secrets redaction, safe cleanup, and avoid stopping pre-existing active environments.
7. Changes to tested development branches and production workflows remain separately approval-gated.
8. GitHub Actions remains required for PR readiness / production release.

## Test plan

- **Local passed:** 9 Node built-in controller tests checking safe CLI args, branch scope, approval gating, reuse, cleanup, and output filtering.
- **Next:** GitHub CI syntax/unit workflow (PR-scoped, no Codespace/production secrets).
- **Pending runtime:** `gh` list/view with an authorized test identity; verify ref field; start an existing stopped Codespace, execute `node --version`, stop safely.
- **Later:** dedicated Node/PG/Playwright allowlisted profiles, structured logs, quota/resource tracking, timeouts and recovery.

## Private connection decision — 2026-11-10

OpenAI Secure MCP Tunnel supports private **stdio MCP servers** as well as HTTP MCP endpoints. Therefore the preferred initial connection uses the existing stdio server directly, launched by the tunnel-client on an owner-controlled private host. A custom HTTPS/OAuth remote adapter is **not required** for this private test and should not be implemented unless the tunnel is unavailable or a later deployment needs public distribution.

The bridge host should authenticate GitHub CLI with interactive browser authorization and prefer expiring credentials if supported. The controller no longer requires exporting `GH_TOKEN`; it relies on `gh` and its secure credential store. The user must separately authorize the tunnel in their OpenAI Platform organization and the corresponding custom MCP plugin in ChatGPT. No tokens or tunnel runtime keys belong in Git.

See `TUNNEL_SETUP.md` for exact owner-controlled steps. Verified GitHub CI runs a synthetic MCP stdio handshake, but no real tunnel/GitHub Codespace access has been established.
