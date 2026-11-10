# Hobby Corner Codespaces — Private MCP Tunnel Setup

**Status:** Documented, not activated. No tunnel or Codespace has been created.

This uses OpenAI's supported Secure MCP Tunnel to launch the project's **stdio MCP server directly** on an authorized developer machine or isolated private host. No public inbound port, public Railway service, custom OAuth HTTP server, or repository-stored token is required for this initial private integration.

## Preflight: owner-controlled setup

1. Use a private, trusted host with Node.js 22+, `npm`, and GitHub CLI `gh`. Do not use the production Railway environment.
2. Check out only the reviewed draft PR branch `Tawgod/Hobby-Corner:feature/codespaces-integration-foundation-20261110`. Verify the selected source and branch before running it.
3. From `codespaces-integration/`, install Node dependencies with `npm install --ignore-scripts --no-audit --no-fund`, then run `npm test` and `npm run check`.
4. Sign in to GitHub CLI interactively via browser with `gh auth login --web --expiring --scopes codespace` where supported. Use the account authorized to access `Tawgod/Lightspeed`. GitHub's support for expiring tokens depends on the host and OAuth app; inspect `gh auth status` **without** `--show-token`. Never paste a token into ChatGPT or commit it.
5. Set a private audit file path using an absolute path on the trusted host: `export HC_CODESPACE_AUDIT_PATH="$HOME/.local/state/hobby-corner/codespaces-audit.jsonl"`. This should be on a user-private filesystem (0700 parent folder, 0600 file). No secrets or test output are intentionally recorded in audit events.
6. Use the official OpenAI Platform **tunnel settings** to create a Secure MCP Tunnel and obtain a `tunnel_id`. Download the official current `tunnel-client` release using the provided platform link. The `tunnel-client` runtime API credential stays on this host only, never in the repository.
7. Initialize an stdio profile using the official `tunnel-client init --profile ... --tunnel-id ... --mcp-command ...` process, pointing `--mcp-command` to the absolute Node executable and `codespaces-integration/scripts/mcp-stdio.mjs`. Use `tunnel-client doctor --profile ... --explain` before `tunnel-client run --profile ...`. Refer to the current [Secure MCP Tunnel guide](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) for the exact platform-specific command sequence.
8. In ChatGPT Plugins, create a **custom MCP server** with connection type **Tunnel**, select the tunnel ID, review permissions, and complete the owner-controlled install/approval. Tunnel privileges and ChatGPT workspace plugin privileges are separate.
9. Run **read-only** `list_codespaces` first. Do not authorize any create/start until repository, branch and Codespaces identity are verified. Then separately approve a single PR #50 development smoke operation.
10. Stop the tunnel process when not in use; revoke the connection in ChatGPT and GitHub authorization if access should be disabled. Stop any development Codespace created for the test.

## Exact first ChatGPT request after connecting

> Use the Hobby Corner Codespaces plugin to list the allowlisted PR #50 development Codespaces **read-only**. Do not create, start, or run anything yet. Report the names, branches, and states for approval.

After confirming the result, the owner may authorize a create/start or the `smoke_codespace` operation explicitly.

## Boundaries and known limitations

- The controller hardcodes only `Tawgod/Lightspeed` / `feature/first-owner-passkey-registration-integration-20261110`.
- A test profile requires an already-running Codespace; fixed commands enter `/workspaces/Lightspeed`.
- GitHub CLI authentication is managed on the private bridge host; the MCP server does not require a pasted PAT or `GH_TOKEN`.
- The bridge provides no arbitrary shell, direct repository write, production deployment, or public port forwarding.
- ChatGPT tool arguments containing an "approval" phrase are **not** independent verification of human consent. Review/approval must be enforced by the plugin/tunnel host policy and the owner in the ChatGPT UI.
- GitHub Codespaces runtime behavior has not yet been live-tested; the first action should be read-only inventory.
- Resource use: choose a small supported Codespace machine, reuse existing environments, stop after tests; the owner-reported 180 hours was not independently verified.

## References

- [OpenAI Secure MCP Tunnel](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)
- [OpenAI Add Custom MCP Server](https://developers.openai.com/api/docs/guides/custom-mcp-server)
- [GitHub CLI auth login](https://cli.github.com/manual/gh_auth_login)
- [GitHub CLI Codespaces](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli)
