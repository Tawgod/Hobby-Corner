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

## Dual-access model: registered Chrome workstation and mobile convention access — owner proposal, 2026-10-30

**Goal:** Keep low-friction PIN sign-in on Hobby Corner's approved desktop Chrome workstations, while allowing the owner and explicitly approved staff to access the same authorized tools from a phone or tablet at conventions and off-site **without installing a Chrome extension**. This is a design direction, not deployed access or an approved factor provider.

**Path A — store desktop + private extension:**
1. Staff selects their Timeclock identity and enters their existing four-digit PIN (verified server-side with durable throttle), receiving a short-lived identity session.
2. An **independently registered installation/device credential** proves the workstation is trusted. The backend issues a fresh, single-use challenge, verifies a signature from the registered device key, checks scope, expiry and revocation, and binds the assertion to the session. Keys must be unique per installation and must not be hardcoded, shipped in the extension bundle, or accepted merely because an extension ID or Chrome Origin header matches.
3. Only backend-approved actions execute. A device assertion is *device assurance*, not employee identity or general permission. For sensitive financial/inventory/PO/employee-management writes, obtain a recent employee-bound strong factor plus exact operation grants and audit.

**Path B — phone/tablet or off-site laptop (no extension):**
1. Open the same responsive Hobby Corner web tool in a normal mobile browser (optionally installed as a PWA shortcut, not an extension).
2. Sign in using a **registered employee-bound WebAuthn passkey** or an approved managed IdP with MFA, validated on the server (challenge, origin, relying-party ID, authenticator/user verification, employee binding and revocation). Face ID, Touch ID or an Android screen lock can satisfy local passkey user verification when the platform supports it. Do not require a private extension or approve arbitrary mobile devices simply based on an IP address.
3. Authorize the current, active Timeclock employee and the specific operation. Restrict remote access eligibility by policy; recommend owner/approved managers first. High-risk writes still require a *fresh* strong authentication assertion, exact grant and mutation safeguards.
4. Have a secure backup passkey/security key and owner-controlled recovery process for a lost convention phone; **never fall back to four-digit PIN alone**.

**Extension security caveat:** Private/unlisted distribution limits ordinary access to the installation package but does **not** make the extension code or ID a secret. An extension can be copied or imitated, and untrusted web clients can forge request headers. Chromium explicitly notes that an unpacked extension ID can be imitated. Therefore `chrome-extension://...`, manifest ID, `Origin`, `X-Extension-ID`, a bundled API token, and a workstation IP are **not valid secondary factors** by themselves. A challenge signed with a uniquely enrolled key and independently verified by the backend is a stronger proof, but does not itself guarantee uncompromised hardware; consider hardware-backed registration or OS/device-management controls for sensitive shared terminals.

**Shared infrastructure:** Both paths resolve to the *same Timeclock employee ID, session lifecycle, per-operation permissions, audit and Lightspeed gateway*. This does not introduce separate tool accounts or a parallel staff-role directory. Distinguish `employee-authenticated`, `registered-station`, and `strong-employee-factor` claims server-side. Every tool must enforce these claims, rather than only showing/hiding buttons in the extension or mobile UI.

**Deployment/release boundary:** The existing unmounted `services/security/staffAccessBaseline.js` in PRs #32/#33 already permits the architectural split (session + verified workstation for lower-risk operations, or server-validated strong proof; strong proof for high-risk writes). **Actual Chrome key enrollment/challenge service, mobile WebAuthn registration and recovery, Timeclock legacy route conversion, CORS/edge review, real device tests and public access controls are NOT implemented.** Coordinate extension code through `CHROME_EXTENSION_RELEASE_QUEUE.md` and preserve legacy clock-in availability until both flows pass acceptance.

### Minimum acceptance scenarios

- Approved registered store Chrome station + valid Timeclock employee PIN works; unregistered/copycat extension + correct guessed PIN fails.
- Direct HTTP calls with only extension ID/Origin headers, arbitrary forwarded IP, stale/replayed challenges or revoked workstation key fail.
- Approved remote employee on iPhone/iPad/Android browser can use an enrolled passkey without the extension; an unapproved employee or device cannot self-enroll or escalate permissions.
- Lost phone, recovered passkey, removed staff member, rotated PIN and disabled device all revoke the right capability without locking the entire store out of legitimate clocking.
- Product/PO/inventory/store-credit changes always require a recent strong employee assertion, even if the request comes from the registered extension, and preserve durable audit/idempotency protections.
- Network loss, expired signed session, broken extension, multi-device login, shared terminal sign-out, rate-limit cooldown, phone biometrics refusal and backup-factor recovery have explicit, employee-friendly behavior.

**Standards/compatibility:** iOS/iPadOS Safari, Android Chrome, and current Chrome on iOS/iPadOS support browser passkeys subject to device/software/provider availability. See official [Apple browser passkey guidance](https://developer.apple.com/documentation/authenticationservices/passkey-use-in-web-browsers), [Google supported environments](https://developers.google.com/identity/passkeys/supported-environments) and [Chromium extension security FAQ](https://chromium.googlesource.com/chromium/src/+/main/extensions/docs/security_faq.md).

## Optional Google Authenticator codes — implementation candidate, 2026-10-30

**Owner request:** Support Google Authenticator as an additional sign-in choice on phones, tablets and other browsers, **without removing passkeys or the registered Chrome workstation path**. This uses interoperable RFC 6238 TOTP codes; no Google API, account linkage or provider connection is required. Any standard authenticator that supports SHA-1 / six digits / 30 seconds should work.

### Employee workflow (planned, not live)

1. A manager-approved employee starts authenticator enrollment while already strongly authenticated. A trusted staff administrator or existing enrolled strong factor must approve adding or replacing an authenticator; **a guessed four-digit PIN cannot self-enroll**.
2. Hobby Corner generates a unique random 160-bit secret and presents an `otpauth://` enrollment URI (future UI will show a QR code) **once** on a private, no-store setup page. The employee scans it in Google Authenticator, enters the displayed six-digit code and confirms enrollment.
3. At a convention, the employee can sign in through the normal mobile website using their Timeclock identity/PIN **plus their enrolled six-digit authenticator code**, with server-side session binding and independent per-employee/source attempt limits. Passkey/WebAuthn remains another option; the store Chrome extension is not required.
4. Once the code is accepted, the server issues a new short-lived **signed, employee/session-bound MFA claim**. Merely submitting a code or returning a client JSON object is not authorization. Each tool continues to check active Timeclock status and operation grants.
5. High-risk product/PO/inventory/credit/staff-permission writes remain **passkey/security key or trusted IdP MFA only by default**; TOTP is an allowed second factor for routine reads and staging, not an automatic downgrade of protected write permissions. Review specific privileged operation policy separately.
6. Lost phone / app reset requires a manager-controlled, separately verified recovery or pre-enrolled backup authenticator, with audit and notification. **Never fall back to a four-digit PIN alone.**

### Backend candidate added to PRs #32/#33

- `services/security/staffTotp.js`: RFC 6238-compatible TOTP, six-digit SHA-1, 30-second windows with ±1-step clock skew, cryptographically random employee secret, provisioning URI. No external authenticator service.
- `services/security/staffTotpPostgres.js`: unmounted begin/confirm/verify adapter. Requires trusted Timeclock employee-session verification, separate approved-enrollment callback, durable per-employee/source throttle, and a server-only 32-byte encryption key. Each employee's secret is encrypted using AES-256-GCM with random nonce and employee-bound associated data before being saved.
- `db/hc_staff_totp.sql`: **unapplied** PostgreSQL table for encrypted secrets, pending enrollment expiry/attempt count, active status and atomic last-accepted time step. Transaction row locks reject OTP replay across app replicas, even within neighboring time windows.
- `services/security/staffAccessBaseline.js`: accepts only a **backend-verified** `totp` second-factor claim for normal tool access; high-impact mutations remain on the stronger existing proof methods.
- `tests/shared-staff-totp.test.mjs` and `tests/shared-staff-totp-postgres.test.mjs`: RFC vectors, secure enrollment URI, encrypted-at-rest records, failure caps, concurrency and replay checks, and permission downgrade prevention.

**Not implemented:** No staff registration/QR web screen, mobile login route, production secret or encryption key, signed MFA session issuance/binding, backup/recovery workflow, real employee enrollment or Railway schema deployment. Existing Timeclock name-based route remains unchanged and must be fixed before internet-access claims. Production encryption-key custody/rotation and backup/restore handling must be approved by Deployment Coordination before rollout.

**Security distinction:** TOTP codes can be phished or relayed in real time, unlike properly implemented passkeys. Prefer passkeys for highly sensitive and administrative operations. OWASP guidance calls for time-limited single-use OTPs, strict attempt throttling, protected secrets and safe factor recovery: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html.

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

## Durable two-axis login throttle — candidate implementation (2026-10-30)

Unmounted code added to both PR #32 and stacked PR #33:
- `services/security/staffLoginThrottle.js`: token-bucket admissions by **employee ID** and **server-observed IP independently**, using HMAC-hashed bucket keys, deterministic lock ordering, transaction row locks, and PostgreSQL time for consistent refill. A selected employee ID is a login identifier, **not proof of identity**.
- `db/hc_staff_auth_throttle.sql`: **separate, unapplied** additive schema. It stores token balances, updated times and only HMAC hashes (never raw employee/PIN/IP).
- `tests/shared-staff-throttle-postgres.test.mjs`: disposable PostgreSQL concurrency tests, distributed account guessing prevention, per-source cross-account ceilings, denial of service via failing DB, non-extending lock windows, and refill recovery. Test code must not be pointed at live databases.

This candidate uses stronger independent per-account and per-source limits instead of only a global shared bucket, but **it does not replace an edge bot defense, a strong remote factor, registered store device proof, or Timeclock route authentication**. Integrate only after the login screen takes an explicit non-secret employee selector, Railway/proxy source-address handling is verified, staff cooldown/recovery is accepted, and Timeclock's own credential verification is gated. It is not sufficient to connect it only to the web-app login while leaving a separate Timeclock name/PIN path reachable.

**Implementation/tested/deployed:** code implemented in isolated PR branches; dedicated mocked security tests and PostgreSQL CI passed; no production schema, login route or edge policy changed.

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
