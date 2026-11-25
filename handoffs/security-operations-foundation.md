# Security Operations Foundation — Current Handoff

**Last verified:** 2026-11-25
**Status:** Planned; Security ownership contract proposed, awaiting Foundation Manager acceptance. No application implementation started.
**Owner:** Security Operations Foundation conversation (upon owner creation); subordinate UI-only workstream. Security Foundation 2.0 retains backend/policy authority.

## Source
- Repository: Tawgod/Lightspeed.
- Exact starting commit: a4b657750adb9b0a24bd7e1c95505df56330cc25 (Security #115, feature/hc-secure-s25g-lifecycle-20261125).
- Assigned initial branch: feature/hc-security-operations-so01-20261125; create only after Manager accepts contract, from exact SHA; target the exact baseline branch in a draft PR. No branch or PR created for Operations yet.
- Security baseline: Manager accepted 167/167 offline CI 45622153223, job 139232842442. Not Operations test evidence, not production acceptance.
- Management source: Tawgod/Hobby-Corner:main; [ownership and integration contract](../SECURITY_OPERATIONS_INTEGRATION_CONTRACT.md), management commit ca301548c50e0dc10fe28f925e12813d99aba06d, blob 827b4ae5f6f44daee695e139f4e54f5ffdc78392.

## Implemented / tested / deployed
- Ownership and initial logical mock consumer profile HC-ADMIN v0.1.0 documented by Security. Security-approved synthetic design only, Manager acceptance pending. No actual endpoints or schema published.
- No Operations code, UI tests, browser acceptance, runtime or deployment. Existing Security test evidence applies only to its own fixtures.
- No new credentials, roles, grants, real records, production access or environment changes.

## Shared dependencies and file ownership
- Read SECURITY_OPERATIONS_INTEGRATION_CONTRACT.md, handoffs/foundation-manager.md, handoffs/hc-secure.md, FOUNDATION_DEVELOPMENT_BASELINE.md, FOUNDATION_SECURITY_REGISTRY_REVIEW.md, FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md, SHARED_TOOL_DEPENDENCIES.md, HOBBY_CORNER_PROJECT.md, LIGHTSPEED_SHARED_SERVICES.md, handoffs/TEMPLATE.md and relevant feature handoffs.
- Writable application paths ONLY ui/security-operations/**, tests/security-operations/**, docs/security-operations/**, .github/workflows/hc-security-operations-*.yml. New directories checked absent at baseline; recheck exact branch and diff before edits. Security owns services/security/**, existing auth/enrollment/settings routes/assets, databases/migrations, docs/security/** and backend/contract tests. Shared root files, navigation, routes, Timeclock, package config, deployments require Manager allocation. No direct backend or DB work.
- Operations edits only its own management handoff; Security owns its handoff, registry/policy and ownership contract; Manager owns baseline and integration. Request changes via docs/security-operations/requests/SO-<id>.md, PR comment linking exact request and handoff. Stop affected edits at overlap; Manager assigns one writer.
- HC-ADMIN mock v0.1.0 logical method and safe envelope contract in ownership document. Mock only; no HTTP paths or real grants. No Security evaluator imports, independent permission engine, authentication, credential handling or actual side effects. Security publishes exact versioned real administration API later and owns contract tests. Operations owns UI/consumer tests. Integration and acceptance Manager coordinated.

## Security and administration UI dependencies (cumulative initial inventory)
| Proposed capability (logical mock, not canonical operation) | UI / consumers | Required scope and boundary |
|---|---|---|
| Employee search/detail | Employee list, employee detail | Backend-admitted active status/name/opaque identity/location; canonical Timeclock identity, no PIN/private record |
| Role and operation browsing | Role catalog, searchable grouped registry | Backend-supplied role/operation descriptions, revision, status, exact typed scope and prerequisites; unresolved aliases remain provisional |
| Role and individual access configuration | Memberships, grant/restriction editor, preview/confirm | Explicit employee/role/operation/resource/field/location/environment, expiry, approval, recent strong admin proof, no self-escalation or client evaluation |
| Effective access explanation | Employee permission detail | Independently authorized backend explanation, exact target/scope; no ordinary decision source leakage |
| Session/device/service management | Authorized status lists and revoke intents | Exact subject/device/session/service/job/audience/scope, separate privilege and confirmation; no credentials or real revoke |
| Audit and approvals | Dashboards, search, detail, pending approval/status | Authorized event/resource/field/time/purpose, safe projection, no payload/secret; distinct read/export/approval/execution |
| Change preview/confirm/status | Administrative forms and confirmation | Immutable intended change, revision, expiry, policy version, server-derived effect/impact, idempotency, safe readback; no auto retry or optimistic success |
- Preserve owner-approved ordinary employee PIN session, off-site additional security, recent strong admin assurance, ordinary cost/customer read with restrictions, separate cost writes. No final role names, grant IDs, registry freeze. All 19 alias directions conditionally agreed; 218 provisional identifiers, separate Purchasing receipt inspection candidate. Show all domains/consumers and scope/prerequisites without hardcoding tool visibility as access.

## Milestones / next
1. SO-01 after Manager acceptance: static standalone mock UI navigation, employee search/list/detail, role/registry browsing, effective access explanation, loading/empty/denied/stale/unsupported/error states. Native browser controls/ES modules, responsive/accessibility, no root dependency edits. Synthetic data only.
2. SO-02: mock role configuration and individual grants/restrictions, scope/expiry, preview/confirmation, approval/step-up/stale/unknown states and readback.
3. SO-03: mock device/session/service views, revoke intents, audit and approval dashboards.
4. SO-04: consume Security-approved exact versioned schema and test adapter compatibility; real integration remains disabled.
5. SO-05: Manager-controlled isolated integration and browser acceptance after Security negative tests; separate owner production authorization.
- At each milestone publish exact branch/commit/PR, changed-path verification, targeted UI test evidence and actual browser coverage, unresolved requests and blockers, implementation/testing/deployment separately. No live network or test credentials. One capped read-only branch-specific offline CI where practical. Stop at milestone or required policy/contract/shared-path decision; no merge/deploy.
- Backend S2.5H and S2.1 proceed independently in Security; no dependency on Operations for backend progress. No manual chat history transfer needed. Initial Operations activation requires Foundation Manager acceptance of proposed ownership and mock contract; Owner creates conversation.
