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
ChatGPT tool approval & authenticated connection
          |
Authenticated MCP remote adapter (NOT BUILT)
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
