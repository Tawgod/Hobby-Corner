# Codespaces Integration Architecture

**Last verified:** 2026-11-10  
**Status:** In Development

## Verified capabilities

### Existing ChatGPT GitHub connection
The currently connected GitHub tool surface supports repository contents, branches, commits, PRs/issues and GitHub Actions inspection/mutations. It does **not** expose Codespaces lifecycle, SSH, terminal, or arbitrary command execution.

### GitHub-supported Codespaces control
GitHub documents supported APIs for listing, creating, starting and stopping a user's Codespaces. Fine-grained/user access can be limited to Codespaces read/write and lifecycle permissions.

GitHub CLI supports listing, creating, stopping and SSH access to Codespaces. SSH is the supported path for running commands in a Codespace.

### ChatGPT extension path
ChatGPT supports custom remote MCP servers as plugins with read/write tools. That is the intended connection layer for the missing Codespaces operations.

## Recommended final design

1. Keep the existing GitHub plugin for normal Git repository/PR/Actions work.
2. Add a narrow Codespaces MCP bridge with tools such as:
   - `list_codespaces`
   - `create_codespace`
   - `start_codespace`
   - `run_test_profile`
   - `stop_codespace`
   - later, reviewed `run_command`
3. Authenticate the bridge with GitHub-supported user authorization and short-lived credentials. Do not use repository-stored PATs.
4. Bind every Codespace operation to an explicit repository/branch allowlist.
5. Default forwarded ports to private and do not expose a public port without explicit approval.
6. Log AI-initiated lifecycle/command events without logging tokens, secrets, customer data, employee data or command output known to contain secrets.
7. Require explicit approval before destructive commands, credential changes, deployments, production operations, git pushes, or commits.
8. Stop idle Codespaces aggressively. Prefer reusing an existing matching Codespace.

## Milestone 2 boundary

The initial implementation intentionally supports only the fixed command `node --version`. Arbitrary command execution is deferred until the MCP authorization/approval layer and command policy are reviewed.

The first runtime target is PR #50's development branch, which already contains Node.js 22 plus an isolated PostgreSQL 16 devcontainer and no production credential wiring.

## Required user/setup action before live use

A reviewed MCP bridge must be made reachable to ChatGPT (remote HTTPS MCP endpoint or Secure MCP Tunnel where supported) and connected as a custom plugin with the minimum required permissions.

This is a user/workspace authorization step. No access token should be pasted into chat or committed to Git.
