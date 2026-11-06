# Hobby Corner — Employee Administration & Security Panel

**Requested:** 2026-11-06
**Status:** Planned — requirements/design only; no admin panel deployed or production settings changed.
**Owner:** Shared Lightspeed Services security and staff permissions, coordinated with Timeclock, Core Operations, Shared UI/UX, Deployment Coordination and Chrome Extension Release Queue.
**Canonical identities:** Timeclock employee IDs linked to Lightspeed users, not a second employee registry.

## Purpose
One browser-accessible administration area for owner and delegated authorized managers to manage staff authentication, security policy, trusted computers, Timeclock-side staff data, and exact tool/operation permissions. Avoid editing attributes owned exclusively by Lightspeed. Responsive for remote administration; reuse shared Hobby Corner UI. All read/write APIs must verify identity and exact grants on the server.

## Admin authentication and authorization
- **Mandatory strong factor on every admin-panel login, whether store or remote:** owner/authorized manager passkey (WebAuthn) OR enrolled Google Authenticator-compatible TOTP, bound to an active Timeclock identity and independently verified signed employee session; a PIN, Discord role, workstation proof or trusted IP alone must NEVER enter admin.
- Separate **panel authentication** from **privileged mutation authorization**. Follow current `staffAccessBaseline.js`: viewing low-risk admin information may be authorized via TOTP after backend permission; PIN reset, permission grants, session security changes, verified workstation approvals/revocations, credential recovery and similarly sensitive operations require fresh *phishing-resistant* factor (passkey/security key/approved managed IdP), precise operation grants, reason, audit, and readback. Do not relax this policy simply because owner requested a passkey-or-TOTP entry path. If TOTP-only privileges are desired, require a separate explicit security policy decision before implementation.
- Manager/owner/admin role access configured server-side. Explicit scopes: employees.view, timeclock.review, timeclock.manage, employees.pin.reset, employees.security.manage, sessions.policy.manage, workstations.register/revoke, permissions.manage, tools.<tool>.<operation>. Default deny and no permission self-escalation; strongest grants require owner-approved change or separately verified dual control as appropriate.
- Recovery and offboarding need separate verified processes. No public admin bootstrap, exposed secret, or hardcoded owner bypass. Revalidate current employee active status, role/grants, factor generation and existing session on every privileged request. Audit actors, target, before/after, reason, timestamp, decision and correlation IDs; protect personal/financial staff records.

## Panel sections / expected UX
1. **Dashboard** — security health, signed-in admin and assurance method, nearing-expiry sessions, pending registration approvals, recent changes, failed attempts and service connectivity, without private tokens/PINs.
2. **Employees** — searchable roster with name, active status, Lightspeed linkage, Discord linkage when present, existing Timeclock settings/eligibility/schedule/time-off, last admin change. Clearly label source authority and sync health.
3. **Employee security** — assign or reset a 4-digit Timeclock PIN through *existing audited Timeclock backend*; never display the current PIN or its keyed hash. Check uniqueness and throttle; validate personnel access; securely communicate newly assigned PIN without email/Discord/public logs. Option for forced reauthentication and session revocation after reset. View authenticator/passkey enrollment metadata (not seeds), approved recovery, reset/revoke factors, lock/unlock if supported and employee offboarding.
4. **Session policies** — independently editable *local approved-workstation* and *remote/unregistered-device* idle timeout and absolute session lifetime, with separate 2FA proof TTL and privileged-action reauthentication window. Server-side bounds and safe defaults; versioned, audited policy, rollout preview, validation and explicit change confirmation. Allow immediate revoke of sessions when policy requires; never make a short-lived proof a long-lived admin grant. Avoid automatic refresh silently defeating absolute expiration. Current staging baseline is 15-minute PIN session and 5-minute TOTP proof; production uses legacy routes that must first migrate.
5. **Verified computers** — inventory of registered station IDs, friendly labels, scope/location, owner/approver, last-seen, key/enrollment status, expiry and revocation with audit. **Download/installation link** for the *canonical reviewed and released Hobby Corner Chrome extension package* or managed setup utility once real distribution is verified. Do not fabricate a URL; show 'Not available — workstation setup not released' until download artifact/release is verified. Registration: admin uses fresh passkey to authorize a per-installation hardware/key enrollment and challenge; computer cannot self-certify and private extension possession alone never constitutes verification. Support replacement/lost/revoked computers and rollback.
6. **Timeclock/workforce** — link to or embed permitted employee time records, manual corrections, missed entries, PTO eligibility and request review, shifts/store hours and scheduled work. Reuse existing Timeclock backend, audit requirements and known bug remediation; do not create a parallel time ledger or own payroll PTO balances.
7. **Tool and operation permissions** — grant/revoke per employee and/or defined group for tool visibility and exact actions (read, draft/stage, approve, create, edit, archive, import, inventory adjust, PO/sale/credit writes, administrative actions). Cover Scanner, Product Manager, Special Orders, Preorders, Ordering, PO Companion, Consignment, Timeclock and other tools as integrated. Clearly distinguish item creation from edit and stock adjustment. Enforce through shared Lightspeed gateway/Timeclock-backed exact-operation policy, not only UI flags or Chrome visibility. Audit grant changes and display effective permissions/why.
8. **Integrations / troubleshooting** — authoritative status of Timeclock and Lightspeed roster sync, permission policy version, service/extension version, read-only error summaries and link to relevant manager/deployment handoff. No secret values.

## Data ownership
- **Timeclock:** employee active state/identity and PIN, shifts, time entries, PTO eligibility and requests. Use its existing admin APIs with explicit authorization and audit; do not overwrite fields based only on synced Lightspeed names.
- **Lightspeed Retail X-Series:** canonical products, inventory, customers, orders and Lightspeed-exclusive employee/account fields. Panel may show links/read-only views and only allow writes through separately approved gateway operations. Do not silently edit Lightspeed-owned employee attributes.
- **Shared security PostgreSQL (new scoped tables):** employee-factor metadata, approved workstation public keys, credential revocation, configurable session-policy versions, explicit operation grants, manager approval/audit. Do not duplicate roster or store raw OTP secrets, passkeys, PINs or bearer tokens in logs.
- **Discord:** invitation/notification surface, not an authorization source.

## Safety and rollout constraints
- Existing production store clocking, Scanner, Chrome Toolkit and Lightspeed operational routes remain unchanged until coordinated acceptance.
- Chrome extension setup/download is a planned *coordinated extension release* item; must reconcile `CHROME_EXTENSION_RELEASE_QUEUE.md`, active branches/PRs and authoritative `integration/hobby-corner-consolidation` before coding/releasing extension. No verified installer/download currently established by this design.
- Local and remote policies must be checked by backend-verifiable registered workstation proof, not employee choice, IP, GPS, or browser header. If workstation proof unavailable, treat request as remote/untrusted.
- Defaults fail closed; audit permission changes and policy migration; avoid disrupting active shifts or locking out entire store. Provide break-glass recovery with independently verified owner and audited controls, never PIN-only fallback.
- Browser responsive and mobile accessible. Avoid staff personal financial/payroll information unless required and explicitly scoped.
- Test with synthetic staging employee and disposable DB before any live record mutations. No production deployment without explicit owner authorization.

## Proposed phased delivery (not started)
1. **Phase A: read-only admin shell** in existing Lightspeed app/shared UI, mandatory independent passkey or TOTP, server-side verified admin.read and session diagnostics; no PIN/permission writes.
2. **Phase B: session policy controls** backed by bounded durable config with audited revision history; isolate local/remote policy and separate idle/absolute/step-up expiry, cross-session revocation and rollback; test active-device impact.
3. **Phase C: employee management** by reusing Timeclock management APIs, including assign/reset PIN, active/offboarding, workforce/timeclock reads and audited corrections only after verified route behavior and known bugs repaired.
4. **Phase D: device management** audited per-installation workstation registration/revocation and approved installer download link. Coordinate extension release queue and real Chrome employee acceptance.
5. **Phase E: permission console** exact-operation effective grants and preview; implement enforcement tool-by-tool with owner-approved migration. Never auto-convert existing Scanner all-active permissions into restrictions without acceptance.
6. **Phase F: full management reports** optional employee metadata and links not exclusively Lightspeed-owned, with least-privilege and documented authoritative source.

## Acceptance checklist
- PIN-only and 'trusted workstation only' admin-entry attempts denied, local and remote; valid passkey and enrolled TOTP admin-entry allowed for authorized manager only.
- Unprivileged employee with valid MFA cannot enter admin; unauthorized manager cannot assign PIN or edit policy.
- Sensitive actions reject TOTP-only assertions unless separately authorized under reviewed policy; stolen/replayed/expired assertions denied.
- Invalid changes to timeout policy rejected. Local workstation status cryptographically verified; no local/remote client-selected bypass. Policy changes audited and don't unexpectedly extend live sessions.
- PIN resets invalidate old PIN, can invalidate outstanding sessions, don't leak credential values and don't change unrelated employees.
- Computer registration requires approved strong manager proof and fresh signed device challenge; revoked key denied, identical extension installation elsewhere not trusted.
- Tool operation permissions enforced end-to-end on server; hidden buttons alone are never authorization. Permission changes audited and reflect effective grants without changing current production behavior prematurely.
- Timeclock data integrity and source ownership preserved, especially disputed legacy endpoints.
- Manual real-browser acceptance + automated browser and disposable PostgreSQL tests + rollback evidence before production.

## Pending decisions
- Proposed initial bounded session defaults: approved local workstation idle timeout 30 minutes and absolute lifetime 8 hours; remote idle timeout 15 minutes and absolute lifetime 1 hour. These are **discussion examples, not live settings**, and must be adjusted by owner.
- Whether managers may approve each other's credential recovery; whether only Owner may alter permissions/session policy or delegate to selected managers.
- Which employee non-Lightspeed attributes should be editable in the panel, and which Timeclock payroll/PTO data should be read-only.
- Distribution mechanism/version/signature for approved workstation installation: extension package/managed installer with verified location and ownership.

## Central Tool Settings catalog and staged foundation — 2026-11-06

**Additional owner requirement:** This panel is the **single management menu for every setting** created in existing or future Hobby Corner tools, not only staff/security preferences. Existing tools are not assumed to expose configurable options without auditing their source and ownership.

### Settings ownership and discovery rules
- Every tool may register source-owned, stable, uniquely keyed descriptors with category, display name, owning service, current implementation state, read operation and write operation. Categories cover Security, Employees, Timeclock, Tool Permissions, Tool Settings and future named modules.
- The admin menu discovers only vetted descriptors; arbitrary client-supplied paths, write targets, role claims, values or code are not allowed. Metadata marked `requires-audit` is a discovery candidate, **not** confirmation the listed setting actually exists.
- Read-only display is the safe initial phase. A future settings adapter for each tool must define a schema, safe bounds, exact admin operation permission, dry-run/impact preview, audited old/new version, atomic write, readback and rollback. Settings affecting Lightspeed business data still go through the shared approved gateway.
- Examples to evaluate through owner review: Scanner behavior; Product Manager item/draft defaults and creation permissions; Ordering and PO processing defaults; Special Orders workflow options; Timeclock schedules/eligibility; Consignment; other future tools. Avoid duplicating settings owned natively by Lightspeed or payroll.
- Distinguish tool-wide defaults from individual employee permission grants and temporary employee-owned preferences; those are not interchangeable. Global settings require stronger reauthentication and review where they can change operational access.
- Display an explicit **Not connected / Planned** state rather than presenting an inert setting as functional.

### Actual source implemented (development only)
- New draft PR: `https://github.com/Tawgod/Lightspeed/pull/34`; branch `feature/employee-admin-security-foundation-20261106` stacked on Phase 1 PR #32. **Not merged, not deployed, no employee data changed.**
- `services/security/adminSettingsRegistry.js`: static, validated source-owned catalog for central settings discovery, with separate read/write operation metadata, no mutation adapter.
- `services/security/employeeAdminAccess.js`: fail-closed admin admission requiring a valid active signed employee session, recent independent passkey or TOTP, exact backend admin permission; stronger proof mandatory for privileged actions. No trusted-device-only or PIN-only admin admission.
- `routes/employeeAdmin.js`: unmouted read-only overview/settings metadata API, no PATCH/POST config writer, HTTP no-store and strong verification gate. Static generic shell requires authenticated backend to display settings.
- `admin/employee-admin.html`, `admin/employee-admin.css`, `admin/employee-admin-client.js`: responsive inert admin UI; never collects or persists raw PIN, QR secret or session proof.
- `services/security/adminSessionPolicy.js`: immutable local/remote timeout policy validation/preview only; defaults remain 900 seconds for both classes. **Not a live policy switch**. A verified workstation credential, not IP/location/browser claim, is the only proposed way to classify a local trusted device.
- Tests `tests/employee-admin-access.test.mjs`, `tests/employee-admin-router.test.mjs`, `tests/employee-admin-client.test.mjs`, `tests/employee-admin-session-policy.test.mjs`; included in the Shared Lightspeed foundation workflow for the draft PR. Confirm CI before marking tested.
- Blocked next stage: connecting actual Timeclock employee/owner grants and verified browser passkey/TOTP proof adapter, then durable audited policy/settings stores and allowed workforce/permissions APIs. No new publicly accessible admin login should be enabled before this is complete.

### Proposed user experience
One navigation route `Employee Administration`, with Employees, Security & Login Windows, Verified Computers, Timeclock, Tool Permissions, Tool Settings and Audit. Each future tool contributes supported settings by registry integration; clear owner, effective value, scope, enforcement status and last update. Workstation download link must use a verified released artifact; current new enrollment package is not yet released.

## Owner designation and per-employee delegated admin permissions — 2026-11-06

Owner-confirmed: the requesting owner must appear as **Owner** in Employee Administration, after securely linking the actual current Timeclock employee ID and a verified passkey/strong factor. This **must not** be inferred from synthetic staging employee 901, a Discord role, the first user to visit the page, or an unverified PIN. The system must preserve an independently approved Owner commissioning/recovery path, with no public registration for Owner.

The Owner can assign or revoke **administrator entry** and individual management permissions to employees. A manager with admin entry is not automatically allowed to view private employee information. Suggested initial manager template: `admin.read`, `employees.onboard`, `tools.settings.read`, `tools.settings.manage`, `permissions.read`, `permissions.manage`, plus only explicitly approved tool-operation and tool-settings scopes. Employee private details, Timeclock records, PIN/security resets, audit history, session-policy edits, computer enrollment and admin delegation remain blocked unless separate Owner-authorized operations (and stronger factor requirements) permit them.

**Current implementation:** [Tawgod/Lightspeed draft PR #34](https://github.com/Tawgod/Lightspeed/pull/34) adds the exact permission catalog, source-owned Owner/delegated-admin tables and scoped grants, server-gated management endpoints, owner/manger-specific UI sections and audit, with disposable PostgreSQL tests. The registration of real Owner identity, real Timeclock employee onboarding, full tool settings writes and production permissions gateway enforcement are **not implemented**. No Owner account, manager grant, PIN or employee record was modified.

Manager onboarding must use a restricted create/invite flow with the minimum identity fields, without granting employee directory/private record browse. Manager per-tool permissions grant operations must be limited to Owner-approved scopes and must never allow self/Owner modification or automatic elevation to Admin. Administrative login must continue requiring enrolled passkey or TOTP everywhere; privileged writes require fresh stronger factor.

Default deny applies if the admin grant is absent, disabled, expired or the Timeclock employee is inactive. A delegated manager must not be able to invite another manager or delegate admin access. Every grant/revocation requires a specific operation, reason, verified actor and immutable audit entry.
