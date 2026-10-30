# Hobby Corner — Shared Staff Authentication and Security Baseline

**Last reviewed:** 2026-10-30  
**Status:** In Development (design + unmounted, tested policy library); **not deployed**.  
**Owners:** Shared Lightspeed Services (policy), Timeclock (employee/PIN authority and clock actions), Shared UI (staff experience), Deployment Coordination (edge, hosting and releases), Hobby Corner Manager (decisions).  
**Existing authorization contract:** `SHARED_STAFF_AUTH_PERMISSIONS.md`.  
**Candidate code:** `Tawgod/Lightspeed` PR #32, `services/security/staffAccessBaseline.js` and `tests/shared-staff-security.test.mjs`; synchronized to stacked PR #33.

## Business goal and guiding boundary

Employees should have easy, reliable access to in-store Timeclock and store tools without creating a second employee database. Someone who discovers a public URL must **not** be able to enter employee names, enumerate 4-digit PINs, access customer/store data, or perform payroll/product/PO/inventory/credit changes.

A four-digit PIN (10,000 combinations, often less entropy if human-chosen) is **not sufficient for independent internet-facing staff authentication**. Retain the existing Timeclock PIN for **approved in-store clocking and low-risk operations on an independently verified store device**, while requiring separate, cryptographically verified strong authentication for remote access and high-impact operations. Do not assume a source IP, hostname, Chrome extension Origin header, browser flag or user-supplied role provides trusted-device identity.

**No employee PIN rotation or forced change is authorized by this design.** Review transition options with staff and do not disrupt a working store terminal.

## Verified existing implementation — 2026-10-30

- `timeclock/server.js`: Timeclock remains the employee authority; 4-digit PINs are HMAC-SHA256 hashed with `TIMECLOCK_PIN_PEPPER`. Active employees are verified in database queries. Legacy clock/status paths accept employee-name or PIN identifiers; **these paths are not secured by the newer signed staff session** and are a priority issue pending coordinated migration. Avoid publishing sensitive exploit/test information in staff-facing pages or public operational logs.
- `services/scannerTimeclockIdentity.js`: trusted server-to-server bridge uses a backend-only service secret, verifies employee and current active state.
- `services/scannerLoginLimiter.js`: persistent PostgreSQL atomic rate limiter runs before PIN verification, currently with global/source/PIN counters. It protects against simple guessing but also can cause store-wide denial of service if malicious requests consume the global bucket. Some limits depend on proxy/IP interpretation; source address trust must be validated before deployment. These counters do not provide true per-employee lockout since the login request identifies a PIN, not a selected employee.
- `services/staffAuthGateway.js` and `services/scannerSessions.js`: server-issued signed 15-minute sessions; Timeclock active-status verification on each privileged request; production browser policy still needs device/remote assurance.
- `server.js` and `timeclock/server.js`: permissive CORS is present; CORS or Chrome-extension Origin checks alone do not authenticate an employee or block direct HTTP clients.
- PR #32 provides fail-closed shared Lightspeed policy/audit/idempotency and a default-read-only transport; PR #33 provides an unmounted exact-operation permission registry. **Neither is live.**
- No current evidence of a production IdP / passkey / managed-station credential gate covering every exposed application route. This is a verification gap, not a claim that no external edge protection exists.

## Target assurance and permission matrix

| Operation category | Minimum proof | Additional gate | Status |
| --- | --- | --- | --- |
| Public information and health | No employee secret | Strictly limited data and rate controls | Audit existing routes |
| Timeclock check/clock in/out | Fresh verified employee session **and** server-verified trusted store station; OR independent strong sign-in | Timeclock employee active; narrow clock permission and event audit | Legacy paths must be migrated |
| Tool read/search (customers, products, PO) | Fresh employee session and trusted station **or** strong remote sign-in | Exact server-side operation grant; minimal customer data | New candidate only |
| Staging and review (Scanner, SO drafts) | Same as tool read, with per-operation grant | Audit, idempotency for state changes, validation | New candidate only |
| Product, supplier PO, inventory, sales, credit and staff-permission changes | Strong independent step-up (passkey or verified IdP MFA), bound to the employee, with recent authentication | Distinct exact-operation authorization, dual approval where appropriate, audit, idempotency, vendor readback | Denied by default |
| Background integrations | Independently authenticated service identity on private service boundaries | Exact service-operation grant, least privilege, audit, no browser-held API secret | Review every service |

A **valid PIN alone cannot satisfy either the trusted-station or independent strong-factor requirement**. Registered station proof must be cryptographically verified by a trusted backend; requests cannot self-label as a station. Strong sign-in should use passkeys/security keys or approved OIDC/MFA, with Timeclock employee IDs bound server-side to a stable IdP subject.

## Layered anti-guessing controls (to implement before public rollout)

1. **At edge:** managed WAF/bot controls, TLS, route allowlisting and identity-aware access to staff tools; do not leave a bypassing raw Railway/public-origin host reachable. Edge protection is supplemental to backend authorization.
2. **Before credential verification:** atomic, durable throttling per source, per selected employee (after migrating to an explicit non-secret employee selector), and per verified device, plus a conservative service-wide circuit breaker. Use gradual backoff/short cooldown, not indefinite staff lockouts. Balance attack resistance against the risk of a malicious user preventing the whole store from clocking in.
3. **On Timeclock backend itself:** apply the same abuse and identity controls, even if the web gateway is rate limited. Ensure internal PIN-verification services cannot be called with browser-originated service secrets; reject missing/invalid credentials.
4. **After login:** short-lived session, secure token handling, recheck employee active state and exact permission on each request, step-up for sensitive operations and server-side revocation/version on PIN reset, employee offboarding or compromise.
5. **Observability:** centralized sanitized login failure/lockout/verification-error events and rate-limit alerts (not PINs, auth headers, signed tokens or raw client identifiers in logs). Review unexpected attempts, failures and staff lockouts without exposing employee enumeration.
6. **Public route audit:** inventory status/clock, login, product, customer, order, pickup, admin and integration endpoints; test direct HTTP access without Origin, with spoofed headers and old signed sessions. Restrict unauthenticated responses to public-safe data only.
7. **Recovery:** documented manager-approved employee access restoration and help desk steps. A failed PIN or invalid device must not become a reason to bypass the new safeguards.

## Proposed incremental rollout (no live changes by this document)

1. **Emergency path:** inventory and test legacy Timeclock identifier routes and their callers; prepare a change that requires authenticated session + server-verified workstation/strong sign-in for clock actions and staff status. Keep the old employee UI working in test. Coordinate the Chrome extension content script through the shared release queue. Do not simply remove endpoints while the store depends on them.
2. **Shared baseline code:** add unmounted `services/security/staffAccessBaseline.js` to PR #32, with explicit operations, fresh staff session, trusted-station/step-up proof and exact backend permission checks. Unit tests cover forged client claims, PIN-only rejection, stale/revoked proofs, missing grants and offline verifiers. PR #33 inherits the same policy.
3. **Durable abuse control update:** design a reusable, database-backed limiter with identity/source/device buckets and resilient store employee recovery. Validate Railway proxy address trust configuration; never derive a trusted client address from arbitrary `X-Forwarded-For`.
4. **Remote access decision:** select an identity provider or passkey solution that works for all authorized staff. Link it to Timeclock records without creating a second source of employee roles. Require MFA for access outside an approved store station.
5. **Route-by-route adoption:** migrate Timeclock first, then Scanner/Special Orders, then Product Manager/PO Companion and future tools. All backend routes must verify, never trust browser-only disable/hide.
6. **Employee and recovery acceptance:** correct/incorrect PIN, network loss, device trust expiry, inactive employee, remote login, step-up, rate limiting, anti-DoS, session revocation, shared workstation sign-out, staff exceptions and alert delivery.
7. **Production release:** obtain explicit owner authorization and coordinate deployment, edge/origin access and extension packaging. No production write privileges are implied by login success.

## PR #32 security review checkpoint

- The foundation's existing policy is fail-closed, and write operations require separately enabled gates and durable audit/idempotency.
- The newly added staff security candidate is **unmounted**; it enforces strong assurance in addition to employee identity, but actual workstation registration, OIDC/passkey enrollment, enterprise device attestation, durable identity-bound lockouts, and endpoint conversion are **not implemented**.
- Existing Timeclock endpoint exposure and name-based operations are a **security blocker** to claiming system-wide secure employee access today.
- CI success proves candidate policy behavior with mocks; it is not a penetration test, production edge review or live Timeclock acceptance.
- Avoid merging PR #32 automatically into Railway-tracked integration until the security review, DB backup, and release approvals are complete.

## Owner decisions to record

- Remote access: permitted for all staff, managers only, or on demand? Recommended: remote access only after verified MFA, with privileges assigned per operation.
- Trusted workstation enrollment: which store devices are managed/registered and who can revoke one?
- Strong factor: preferred passkey/IdP provider, enrollment/recovery and licensing.
- Timeclock continuity: controlled rollout/rollback and emergency offline clock-in policy.
- High-risk write approvals: employee permission matrix, audit retention, and whether inventory/credit/PO mutations require a second employee.

## External reference

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Bot Management and Anti-Automation](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html)
- [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html)

**Deployment status:** no staff baseline route, PIN/IdP configuration, edge firewall, database migration, Chrome extension update or security enforcement change deployed from this work.
