# Shared Hobby Corner AI Gateway Contract

This folder defines the central, versioned configuration for the Hobby Corner AI gateway, shared by Hobby Bot, Notes & Tasks and future Hobby Corner services. The file `hobby_ai_config.json` is an integration contract, **not** a running service and **not** a credential store.

## Task integration (first consumer)
- `task.extract`: propose structured task title, description, priority, tags and candidate owner from supplied authorized text. Never assign automatically without policy-approved action.
- `task.summarize`: summarize an authorized task thread and its progress; do not mark complete.
- `task.suggest`: suggest next steps, checklist or delegation.
- `knowledge.answer`: answer questions only from authorized scoped store knowledge; identify missing sources rather than inventing facts.

## Request
`POST /v1/ai/execute` with an authenticated caller and a server-verified actor context:
```json
{
  "capability": "task.summarize",
  "scope": "professional",
  "task_id": "task-id",
  "request_id": "unique-idempotency-id",
  "input": {"text": "Authorized, bounded task discussion"}
}
```
The gateway must derive caller identity and permissions from authenticated service and user information, not trust a client-claimed `scope`, actor or task ID. Response: `{"request_id":"...","output":{"text":"..."},"usage":{...}}`.

## Credential, privacy, and spend boundaries
- Keep AI provider keys only in private Railway environment variables within the appropriate project. Do not store keys in Git, Discord posts, or JSON configuration.
- Hobby Bot uses `HOBBY_AI_GATEWAY_URL` and a narrowly scoped `HOBBY_AI_SERVICE_TOKEN` to call the gateway; the gateway authenticates and authorizes it. The configuration documents variable names, never values.
- Personal data must be inaccessible to Hobby Bot by design; server-side access control and separate scopes prevent accidental leakage.
- Configure provider model, per-consumer rate/usage ceilings and usage logs in the backend before enabling live AI. The JSON cap is a target; only the running gateway can enforce it.
- No automatic database mutations from generated content. Tasks can be proposed; an authorized workflow action performs the actual write.
- Protect against prompt injection from Discord threads: treat posts and attachments as untrusted data.
- No public AI endpoint without authentication, audit logs, request bounding and reasonable throttling.

## Integration path
1. Review this configuration and GitHub branch.
2. Implement the gateway endpoint and authorization checks using the preexisting cross-platform AI architecture where suitable; keep Torn services/credentials isolated.
3. Implement read-only `/hc ai task-summary` in Hobby Bot for linked professional tasks.
4. Connect Notes & Tasks and add task-extraction suggestions.
5. Stage end-to-end tests and separately approve production deployment.

## Discord app checklist
Token rotation alone does not change scopes or intents. Verify OAuth scopes `bot` and `applications.commands`. To use the staff forum confirm View Channel, Read Message History, Send Messages, Send Messages in Threads, Create Public Threads (if necessary), and Manage Threads (only if bot will archive threads). Existing Hobby Bot uses Message Content and Members privileged intents; keep the portal toggles consistent with actual bot needs. Grant least-privilege permissions in the designated channel and do not enable Administrator.

Forum channel: `1471589727441260759`.
