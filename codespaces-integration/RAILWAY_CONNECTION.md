# Hobby Corner Codespaces — Railway deployment and connection

**Verified:** 2026-11-10
**Status:** Safe STANDBY deployed; new Malcor production destination pending.

## Owner hosting decision

The owner selected `Malcor` Railway project as the shared cross-project AI utility host. The current Malcor project has only a `staging` environment. Do not attach the bridge there. See [MALCOR_HOSTING_PLAN.md](MALCOR_HOSTING_PLAN.md) for migration steps and the separate undeployed AI Integration Gateway.

## Existing verified safe deployment (temporary)

- Project: [Hobby Corner Codespaces Bridge](https://railway.com/project/84a81c08-5090-4c3f-917c-6ea33ddc0068)
- Service: `codespaces-private-bridge`
- Environment: `development`
- Source: `Tawgod/Hobby-Corner:feature/codespaces-integration-foundation-20261110`, root `/codespaces-integration`
- Dockerfile starts unprivileged `node` via a minimal `gosu` volume bootstrap.
- Private 256 MB volume at `/data` for append-only audit events.
- CPU and RAM caps: 0.5 vCPU / 0.5 GB, one replica.
- No public HTTP domain, GitHub token or OpenAI tunnel credentials.
- Variables: `HC_BRIDGE_ENABLED=false`, `HC_CODESPACE_EXECUTION_ENABLED=false`, `HC_CODESPACE_AUDIT_PATH=/data/audit/codespaces.jsonl`.
- Verified Railway deployment `ca79df74-631d-4f23-8829-1bf8e6ced113`: SUCCESS. Logs confirm `Codespaces bridge STANDBY: no tunnel, GitHub access or commands enabled.`
- CI `42846877784`: SUCCESS, including fail-closed controller tests and MCP handshake.

This service is **not yet connected to ChatGPT or GitHub Codespaces**. Maintaining a stopped/standby Railway service can still incur infrastructure usage; inspect actual Railway billing rather than assuming zero cost.

## Activation safeguards for the future Malcor service

The private tunnel container needs a tunnel ID, an OpenAI platform runtime credential and short-lived GitHub Codespaces user authorization configured through Railway's protected variables. No credentials may be pasted into ChatGPT, committed to Git or shared with existing Malcor services.

- `HC_BRIDGE_ENABLED=false` keeps the service disconnected even if credentials exist.
- `HC_CODESPACE_EXECUTION_ENABLED=false` blocks *all* lifecycle and SSH operations at the controller, independently from model-supplied approval phrases. Read-only list/view can remain permitted after the bridge itself is authenticated.
- `HC_CODESPACE_AUDIT_PATH=/data/audit/codespaces.jsonl` keeps meaningful audit events on a private volume.
- No public domain or forwarded port is needed for outbound Secure MCP Tunnel.
- Do not set `HC_BRIDGE_ENABLED=true` before a real tunnel credential and GitHub user authorization are installed, transport verified, and the user has reviewed the tool permissions.
- Do not set `HC_CODESPACE_EXECUTION_ENABLED=true` before the owner approves a development Codespace test and confirms the exact repository, branch and Codespace.

## Stop point

Create Malcor environment `production` first, leaving its existing `staging` environment untouched. The current Railway plugin lacks environment creation. Once available, ChatGPT can perform isolated service creation, Docker source configuration, volume provision, disabled-variable setup, deploy verification, then provide exact OAuth/plugin linking steps.
