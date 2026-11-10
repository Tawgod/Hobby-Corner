# Shared AI / Codespaces Infrastructure under Malcor — Migration Plan

**Verified:** 2026-11-10
**Status:** Blocked on creation of a Malcor production environment; no changes to Malcor staging.

## Owner architecture decision

Host cross-project AI utilities in the existing `Malcor` Railway project, specifically a separately isolated environment called `production`, with independent services (not combined processes). This replaces the prior plan to keep the Codespaces bridge in a standalone Railway project after migration and validation.

## Verified Railway state

- Malcor project ID: `eadb4129-07e1-4599-bf89-21a6fa2583b9`.
- As of verification `list_services` returns **only staging**, environment ID `cf0cd4f3-8125-4123-b59b-d66e4d9bb677`. No `production` environment exists yet.
- Staging already hosts Malcor Postgres, `malcor-discord-bot`, and `malcor-schema-migrations`; do not alter them for shared AI infrastructure.
- Earlier standalone Codespaces bridge currently deployed **safe STANDBY** (no GitHub/OpenAI credentials) in project `Hobby Corner Codespaces Bridge`, project ID `84a81c08-5090-4c3f-917c-6ea33ddc0068`, development environment `5e19983e-055c-4d1c-bfcf-0c39eeda5e17`. Service `6d53fcb0-3892-4a0c-8e93-a5e25e1ef2e9` and 256 MB audit volume; latest SUCCESS deployment `ca79df74-631d-4f23-8829-1bf8e6ced113`. It must not be destroyed before the new Malcor service is verified.
- Separate `AI Integration Gateway` Railway project ID `4f37a0a2-566f-441e-9322-cf2d95f89ff8`: only a STAGED (never deployed) patch in `test` environment, ID `30a2ba2f-d538-4458-b9e3-a3069a7d978f`. The staged services are `gemini-gateway-test` and `gemini-postgres-test`. Variables `GATEWAY_ENABLE`, `GLOBAL_DAILY_REQUEST_LIMIT` and `GLOBAL_DAILY_TOKEN_LIMIT` are staged (values not inspected here). **This is not a running gateway application.**

## Migration sequence

1. Create the missing `production` environment in Malcor. The current connected Railway tools cannot create environments; a workspace owner must do this through the Railway dashboard or an authorized CLI.
2. Re-enumerate Malcor environments and confirm the new production ID and that it has no accidental inherited production credentials or database connections.
3. Create independent `codespaces-private-bridge` service **only in Malcor production** with source `Tawgod/Hobby-Corner:feature/codespaces-integration-foundation-20261110`, root `/codespaces-integration`, Dockerfile, 0.5 vCPU / 0.5 GB cap, separate 256 MB audit volume `/data`; no public domain, `HC_BRIDGE_ENABLED=false` and `HC_CODESPACE_EXECUTION_ENABLED=false`.
4. Verify actual Railway deployment SUCCESS and log line indicating STANDBY before touching credentials. Never allow production Lightspeed/Malcor secrets into the bridge.
5. Create a separate gateway candidate in Malcor production only **after reviewing the gateway's missing source/entrypoint**. Recreate the staged gateway definitions; **do not apply the old project's staged patch to the old environment**. Preserve staged variables without copying or revealing values. If gateway source cannot be verified, retain status Planned/Blocked and do not deploy an empty, misleading service.
6. Configure private service-to-service networking only when concrete API contracts, scoped authentication, and consumers are approved. Hosting under the same Railway project does not itself provide permission to share secrets or databases across independent systems.
7. Preserve the old standalone Codespaces bridge and gateway projects for reconciliation. Retire them only after the Malcor deployments are verified and explicit cleanup approval is obtained. This avoids accidental downtime and deletion of staged work.

## Required human action

Open [Malcor on Railway](https://railway.com/project/eadb4129-07e1-4599-bf89-21a6fa2583b9) and add a new environment named **production**. Do not rename or delete staging. No other settings or keys are necessary yet. Then return to this chat.

## Safety

- Zero Malcor staging mutations during preparation.
- No production GitHub Codespaces execution, token handling or public forwarding.
- No shared PostgreSQL credentials between Malcor and Hobby Corner AI tools.
- Do not run existing staged gateway service definitions or assume a database was provisioned when its state is staged-create.
