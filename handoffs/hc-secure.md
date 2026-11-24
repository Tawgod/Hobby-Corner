# HC Secure — Foundation Security Current Handoff

**Last verified:** 2026-11-24  
**Status:** In Development / Testing; private staging infrastructure and read-only readiness Deployed. Full authentication and production enforcement are not deployed.  
**Ownership:** Security Foundation 2.0 (owner-designated successor to Foundation — HC Secure 1.6).

## Security Foundation 2.0 — transfer checkpoint (2026-11-24)

- Owner designated this successor conversation Security Foundation 2.0. Existing independent Security branch and commissioning boundaries remain unchanged. No infrastructure move required.
- Fresh GitHub PR #77 read: open, draft, unmerged, head be24458aa6281834591da52f865af8b98c89b366; Railway source pin matches. PR description's early source-only status is stale, superseded by deployment evidence here.
- Fresh Railway status: all three latest deployments SUCCESS; auth and PG each one running replica; inert provisioner zero running replicas; no pending work, warnings or critical notifications. One earlier auth failure in reporting window (2ba2ee0c-e188-41be-ac02-2c9c6ffc4ee6); current auth online. Auth service has no domains or TCP proxies. Names-only inspection confirms six independent application secret variables and independent Timeclock secret are absent. No values retrieved.
- Business V4 approved pin b56d4f69332f768a66987668293088eb51a60ecc; manager's 266/266 CI record is isolated fixture evidence, not Security acceptance. Security does not branch from V4.
- Preliminary dependency review: Core M5 #95, Catalog M7, Inventory M7 #94 have cumulative inventories; Customer and Purchasing handoffs still show V3 checkpoints on this read. Manager consolidation pending. Naming collision: Core proposes products.read/create/cost.modify, Catalog proposes catalog.product.read/create/cost.modify, existing Security handoff uses product.cost.view/modify. These are unresolved aliases, not separate grants. Wholesale cost read is ordinary authorized employee product read; cost mutation separate. Inventory count/restock aliases likewise need review. No role bundles, precedence, operation IDs or grants approved by this checkpoint.
- Next milestone S2.1: independent application secret custody and scoped Timeclock integration preparation. Keep readiness-only runtime, original Owner and provisioner unchanged. Six application secrets privately generated and entered by owner; review exact staging patch before acceptance. Independent Timeclock credential requires source review, compatibility and negative tests, then separate production authorization. No DNS, enrollment, activation or production changes.
- Security integration contract review with Core: trusted actor provenance, exact server-derived effect authorization, all prerequisite grants, resource/field/location/environment scope, execution-time revocation revalidation, actor-bound replay and safe output reprojection, delegated service scope, fail-closed errors and audit correlation. No actual grant or runtime endpoint approved.
- Transfer checkpoint is documentation only; no new code, tests, deployment or actual permissions changed. Further source review and final consolidated registry remain pending.

## S2.1 design coordination gate (2026-11-24)

- Source reviewed at exact deployed pins: HC Secure be24458aa6281834591da52f865af8b98c89b366 (readiness, Owner bundle and Scanner client); Timeclock a595fd336c5a38dcc5ab5423a8967698777c0929 (server and ownerStagingIdentity router).
- Existing private readiness rejects HC_OWNER_TIMECLOCK_SERVICE_SECRET. Existing Owner bundle uses old owner-staging credential namespace and scanner-derived canLookup. Separate identity-only contract must avoid treating Scanner privileges as employment status or Owner authority. Existing validator checks signing/service secret string duplication but not equivalent TOTP encryption key material.
- Design-only independent branch feature/hc-secure-s21-contract-20261124 from exact HC Secure pin, draft PR [#98](https://github.com/Tawgod/Lightspeed/pull/98), head 29fae8645981e0d14770447bd96ac3240ab6b60a, mergeable=true. One additive document [HC_SECURE_S21_IDENTITY_CONTRACT.md](https://github.com/Tawgod/Lightspeed/blob/feature/hc-secure-s21-contract-20261124/docs/HC_SECURE_S21_IDENTITY_CONTRACT.md). Proposes independently disabled endpoint, selected Owner identity only, separate credential and durable throttle, minimal identity projection, no roles, TLS and fail-closed negative cases. No runtime code or automated tests added; no deployment, secret, grant, DNS or database changes.
- Coordination gate: review proposed Timeclock identity semantics and independent credential/throttle namespace with Timeclock owner and Foundation Manager. Separate Timeclock branch from deployed pin, not from business V4. Owner privately commissions six app secrets only, with exact staged patch review; do not add Timeclock service secret to current readiness runtime. No need to share values. Existing Owner and offline provisioner unchanged.
- Next: following design review, implement/test unmounted identity adapter and Timeclock route on independent branches; review key-material independence and activation gate; separate approval for any production Timeclock deployment. Security registry consolidation can proceed independently when Manager supplies cumulative register. No actual grant or role policy approved.

## S2.5A permission registry first-pass reconciliation (2026-11-24)

- Manager consolidated all five workstream inventories, 213 source rows (not unique operations), exact input blob 1306922eaf8f2a2e0c24e8f179fcc92b402b86db; reviewed updated V4/V5 manager checkpoint. This supersedes earlier pending-consolidation notes.
- Security design proposal [FOUNDATION_SECURITY_REGISTRY_REVIEW.md](../FOUNDATION_SECURITY_REGISTRY_REVIEW.md), management commit beef2de7a27282a9c15b6d1293de2e9bd49c7cef, blob e3410818ee5b91c2d5ed1fd56d64adc0b1d73855, exact readback verified. Covers all manager alias groups, proposed domain naming, cost/receipt/payment distinctions, scoped grant and deny precedence, reusable role bundles, execution/approval/delegation rules, administration UI and owner decisions D1-D8. All proposed, not approved or assigned.
- Owner-approved wholesale cost read preserved with ordinary authorized employee product access. Cross-tool effect checks mandatory. Proposed explicit scoped restrictions override grants, no implicit Owner bypass, separate tool visibility and domain permissions. PO line cost versus catalog master cost, independent receiving evidence vs execution, refunds vs reversals, broad legacy aliases require explicit review. No automatic migration.
- Gate: Owner decisions on precedence, ordinary employee defaults, high-risk approvals/self-approval, cost scope, role administration, temporary/delegated permissions, MFA/recovery, location/data scope. Manager/domain review of semantic differences and Core execution-time decision/transaction seam. Next normalize every grouped row into explicit operation/scope manifest and synthetic authorization matrix; no live grant or endpoint coverage claimed.
- S2.1 and existing #77/#98, original Owner and Railway readiness/commissioning state unchanged. No runtime changes, tests, deployment, credentials, production access or role assignments in registry review. No fresh Railway read required for documentation-only milestone; last verified infrastructure checkpoint retained. V5 testing independent.

## Owner policy decision checkpoint — S2.5B entry (2026-11-24)

- Owner accepted D1-D6 for design only: scoped deny precedence; ordinary employee read baseline including wholesale cost; independent high-risk approval with explicit Owner exception; separate master catalog and PO line cost permissions; Owner-controlled Security administrator appointment; scoped expiring delegation and revocation. D7 sensitive authentication and D8 location/sensitive data restrictions remain open.
- Updated [registry review](../FOUNDATION_SECURITY_REGISTRY_REVIEW.md) at management commit 2d4e15eaa850647eca99525c1ed8e1a73b1bd3ca, blob 4984e86faf21457db5f3d7333f1f1cc7706d10b7; exact readback verified. Earlier proposal-only notes are historical. No actual role bundle, assignment, grant, runtime alias, approval threshold or production change authorized.
- D4 design direction: catalog.product.cost.modify and purchasing.po.line.cost.modify independent; require both when both actual effects occur; invoice review evidence correction is neither actual cost write. Coordinate vendor side effects with Catalog/Purchasing/Core.
- D7 discussion proposal: routine active session, authorized workstation for operational actions, recent strong factor for sensitive actions, fresh strong factor and confirmation for security-critical actions; configurable freshness within reviewed maximum, individual session/device binding, no shared MFA or privilege bypass. D8 discussion proposal: ordinary access across authorized store locations by default where operationally appropriate; special restrictions individually configurable; separate customer contacts/notes/export and financial scope. Neither proposal approved. Preserve existing strong-factor and commissioning requirements.
- S2.5B may design normalized manifest and synthetic matrix under approved principles, with unresolved D7/D8 conditions explicitly pending/fail-closed in candidate evaluation. Exact thresholds, temporary grant durations, manager delegation, scope defaults, recovery and assurance remain unresolved. No code or automated tests completed at this decision checkpoint. Existing S2.1 PR #98 and deployed readiness untouched; no fresh Railway audit or deployment.

## Additional Owner policy decisions — S2.5B (2026-11-24)

- D7a remains open (alternative ordinary employee strong-auth initiation/cadence). D7b approved 30 minutes recent strong authentication for sensitive business operations. D7c allows recent strong authentication for security-critical administration; exact administrative freshness limit and exceptional recovery/bootstrap requirements still open. Recommend 30-minute maximum for ordinary administrative changes, not yet approved. Preserve existing Owner MFA/commissioning requirements, actor/session/device binding, approval and confirmation. No automatic privilege or sliding freshness extension.
- D8a approved default access to authorized locations within existing store; no automatic future store/environment access. D8b approved ordinary employee customer phone/email read. D8c approved customer notes and financial information as ordinary authorized customer read. Individual restrictions override defaults. Security interpretation for review: balances/deposits/store-credit/transaction history and safe payment evidence, never raw payment credentials or authentication secrets. Bulk export and all financial mutations remain separately controlled. Field projection and legacy classifications require Customer/Core review.
- Updated [registry review](../FOUNDATION_SECURITY_REGISTRY_REVIEW.md), commit 38962429b4d0ca5a2590c8e06b3d9db9d60ab568, blob 86435e7cdc02d8dd6ec3ae12a6031ecf8bc4013b, exact readback verified. Latest owner decisions supersede conflicting historical D7/D8 proposals; D1-D6 unchanged.
- Next discuss ordinary employee authentication on shared store workstations versus personal devices; normalized registry design can proceed with unresolved D7a and administrative assurance parameters explicitly pending. No implementation, tests, actual grants, roles, credentials or deployment changed. S2.1 PR #98 and readiness/commissioning milestones preserved.

## Owner clarification — on-site PIN and off-site authentication (2026-11-24)

- D7a ordinary login policy clarified: on-site employee login uses canonical Timeclock PIN; additional login security for off-site access only. Easy personal phone authorization on store Wi-Fi requested. Design only. Supersedes earlier shift-start MFA proposals. D7b 30-minute freshness and D7c recent administrative authentication retained; clarify on-site sensitive operation/admin exceptions before final assurance contract. Existing Owner commissioning unchanged.
- Proposed device flow: registered store workstation or individually approved phone, trusted server-side network/site evidence, revocable employee-bound device credential, short-lived one-use administrator-approved enrollment challenge/QR. Revalidate site qualification on protected requests; unknown or lost site qualification cannot use PIN-only access. SSID/client location or untrusted forwarding headers not proof. Off-site permission separate; no automatic role/grant expansion. Review existing device code, site attestation, proxy and dynamic IP handling before implementation.
- Updated [registry review](../FOUNDATION_SECURITY_REGISTRY_REVIEW.md), commit 7fbf2ef7de4eaacb180c03ac9db687152d7093bb; exact readback verified. No runtime code, tests, grants, credentials, Railway changes or deployment. S2.1 and original Owner intact.

## Source

- Repository: Tawgod/Lightspeed
- Active development branch: feature/hc-secure-staging-readiness-20261123
- Draft PR: https://github.com/Tawgod/Lightspeed/pull/77
- Verified auth deployment commit: be24458aa6281834591da52f865af8b98c89b366
- Verified offline provisioner commit: f8ecc09a7eb9ceba3d84eba7c7294b0fa4e3caed
- Original Owner runtime: fix/owner-staging-activation-digest-20261123 @ 977f63b267f226a29b731541386d492bb537c312; preserve.
- Production Timeclock: feature/owner-timeclock-scoped-credential-20261110 @ a595fd336c5a38dcc5ab5423a8967698777c0929; preserve.
- Complete prior handoff history preserved in [archive](archive/hc-secure-through-2026-11-24.md). Historical statuses are superseded by this snapshot.

## Implemented

- Dedicated private PostgreSQL 18, 5 GB persistent volume, database hc_owner_stage_test, nine security tables, two NOLOGIN privilege groups and separate restricted runtime/operator LOGIN roles.
- Tables: hc_admin_principals, hc_staff_passkeys, hc_staff_passkey_challenges, hc_staff_passkey_events, hc_staff_auth_throttle, hc_staff_factor_approvals, hc_staff_totp, hc_first_owner_activations, hc_first_owner_activation_events.
- Separate schema-only, locked-role-only and credential-only offline programs, exact project/environment/service gates, explicit approval sentinels, no automatic retries after ambiguous database commits.
- Both restricted credentials commissioned with SCRAM-SHA-256; client-generated salted verifiers, transaction-local SQL logging suppression; no plaintext password in ALTER ROLE statements. Verifiers themselves remain sensitive; external logging is not universally controlled.
- Private readiness service checks exact runtime role, private host/database, PG18, read-only transaction, role attributes/memberships and nine-table privilege gate; rolls back and serves /health only. No login or registration routes.
- Offline provisioner disarmed; temporary root URL and both temporary role passwords removed. Dedicated database root password retained on database service; auth runtime URL retained on auth service. Operator credential retained privately by owner per intended custody, not inspected.
- Original Owner staging historically completed passkey registration, passkey login, TOTP enrollment and MFA verification. New HC Secure database had zero Owner activations at commissioning; no new Owner enrolled or activation issued.

## Tested

- Operator-reported automated results: 21 initial security tests; real disposable PG18 schema test twice with rollback; 5 pristine-root, 7 schema bootstrap, 6 locked-role, 4 credential preflight, 10 final credential commissioning, 9 final combined runtime/staging readiness tests passed. Suites overlap historical revisions; do not sum as unique tests.
- Real disposable PG18 credential marker: HC_SECURE_DISPOSABLE_CREDENTIALS_OK postcommit_relock=true scram_logins=true bad_password_denied=true final_roles_locked=true owner_activations=0. Container cleanup configured but not independently confirmed.
- Live runtime evidence (Railway logs independently verified):
  - Root probe 1074dbfe-3faf-48f7-a98e-95e43bc83b8b; repeat 786eb720-67e0-4cc0-b383-810b30db698d: HC_SECURE_ROOT_READY=true read_only=true target_absent=true roles_absent=true root_empty=true.
  - Schema ecf6fcd7-16dd-4abd-9d10-2f107502aad9: HC_SECURE_SCHEMA_BOOTSTRAP_OK tables=9 nonlogin_groups=2 no_logins=true activations=0.
  - Roles 8d74c988-bda8-4981-94fa-ec60a092d9e0: HC_SECURE_LOCKED_ROLES_OK count=2 passwords_set=false.
  - Commission bc95c260-a946-4b29-92ec-b18f9a91238b: HC_SECURE_CREDENTIALS_OK runtime=true operator=true wrong_password_denied=true activations=0.
  - Final provisioner 9eb26121-e721-4172-b967-66525e0b0d8a: HC_SECURE_OFFLINE_PROVISIONER_DISABLED; nine variables, no temporary credential names.
  - Final auth redeploy **28f09b0a-6d21-4e12-82b0-cdafccc0511b SUCCESS** after temporary credentials were removed: **HC_SECURE_RUNTIME_READINESS_OK read_only=true restricted_runtime=true login_routes=false**. Independently verifies runtime startup without provisioner secrets. Direct URL representation was owner-reported, not read to avoid secrets.
- Browser acceptance: original Owner HTTP 200 registration/passkey/TOTP/MFA Nov 23; latest fresh MFA accepted, no fresh passkey proof in same latest window. New host browser acceptance NOT started.
- Readiness proves startup, not ongoing DB monitoring or full authentication. Schema and role creation success markers follow commit; no separate privileged catalog readback. No independent external security audit.

## Deployed

Railway project HC Secure: 120de974-f2e8-46be-9a00-8eb8b1be4cc4; staging environment 8c8cd3a9-079f-4fe8-b8f5-a76c79813f0c. Last read: all three latest deployments SUCCESS, no staged patch, no public domains/TCP on these services.

| Service | Service ID | Latest deployment | State |
|---|---|---|---|
| hc-secure-postgres-staging | 454f4979-6148-4ee5-9857-97bc793dc72d | b4f8c17c-d23e-4efc-9e56-2f9265daf5f3 | Private PG18 |
| hc-secure-auth-staging | 8ef9adc0-2a4d-46c0-92cf-ba54834e33b5 | 28f09b0a-6d21-4e12-82b0-cdafccc0511b | Readiness only |
| hc-secure-db-bootstrap-once | d0fee7d2-c050-4f67-a864-14c86eb67d2c | 9eb26121-e721-4172-b967-66525e0b0d8a | Inert, restart NEVER |

- PG image ghcr.io/railwayapp-templates/postgres-ssl:18; volume 468ccb0a-3006-48b1-ac2d-f74293c7c075 at /var/lib/postgresql/data; private host hc-secure-postgres-staging.railway.internal:5432. Root database railway, application database hc_owner_stage_test.
- Roles hc_owner_stage_runtime and hc_owner_stage_operator; separate groups hc_owner_stage_runtime_privs and hc_owner_stage_operator_privs.
- Auth start node staging/hc-secure-runtime-readiness.js; /health timeout 60s; restart NEVER. HC_SECURE_RUNTIME_READINESS_ONLY=true; Owner/synthetic/PIN setup false.
- Offline start node -e "console.log('HC_SECURE_OFFLINE_PROVISIONER_DISABLED')"; mutation approval DISABLED, mutation flags false. Do not re-arm.
- Original Owner project HC PR63 Isolated Staging 5b46096d-3178-47ec-ba88-d5037696346a / staging 46b93c76-3085-4e76-a37d-90dfdd250dd2; app hc-owner-staging 3a8f9555-90e5-4bc2-bb63-4f48d8c852d0; DB Postgres-x8Ui 5c4498e4-cffb-4224-916a-af57391d1cd9. Preserve existing passkey, encrypted TOTP, audit and recovery state.
- Production Hobby Corner project f7e91de7-43f6-472e-b4ca-46b0623f8e0e / production c562fbb2-8431-4beb-834d-6938b3a2ad10; Timeclock service dd3469bd-5fce-43bc-b9f9-7aa2a7806457. Last earlier Nov 24 check seven production services successful; not a fresh production audit at transfer. No production changes in this workstream. No HC Secure production rollout.

## Shared dependencies

- Canonical employee identity comes from Timeclock (PIN verified server-side, canonical employee ID, approved access); Timeclock owns timekeeping, HC Secure owns identity integration and security policy. Current original Owner selected employee ID 1. Production Timeclock has OWNER_STAGING_SERVICE_SECRET and existing owner-staging integration routes; independent HC Secure credential support remains unverified/unimplemented. Do not rotate or reuse original credential as shortcut.
- Approved new hostname secure-hc.timcorp-productions.com; exact HTTPS origin https://secure-hc.timcorp-productions.com and RP ID secure-hc.timcorp-productions.com. DNS/domain/TLS not configured. Original RP ID hc-owner-staging-staging.up.railway.app; old passkeys cannot authenticate at new RP ID. Require reviewed strongly authenticated cross-origin handoff or new enrollment, no PIN-only reset. Preserve original until accepted.
- Foundation shared services/UI/admin navigation consume security contracts; tool chats own business workflows and enforcement integration, not independent security systems. Coordinate with Operations manager and Foundation manager via canonical handoffs.
- Special Orders/scanner has existing Timeclock PIN session, not universal strong MFA; production service named special-orders-test is actually production. Lightspeed API, Store Map, Rewards/Discord, Chrome extension and other tools require route/caller audit. Legacy x-hobby-corner-key cannot be removed globally before compatibility testing. Backend workers use scoped machine identities, not employee PIN/TOTP. Future customer realm separate identity namespace, audience, policy, storage privileges and recovery.
- Shared inventory, printing, labels, purchasing, preorders and all shared tools must submit permission needs and actual entrypoints to Security; no implicit access via navigation visibility.

## Security and administration UI dependencies (mandatory for foundation workstreams)

Security owns the canonical operation registry, role bundles, individual grants/restrictions, resource scopes, effective access/precedence, employee lifecycle, service delegation, audit, and Security administration UI. The following identifiers are **provisional capability groups, not approved grants or final registry identifiers**. Other workstream handoffs must supply exhaustive per-operation inventories; Security consolidates and deduplicates, traces server enforcement and negative bypass tests.

| Proposed canonical operation | UI label / purpose | Tools / entrypoints | Suggested role/default | Individual grant/restriction | Scope | Prerequisites / approvals | Enforcement evidence / gaps |
|---|---|---|---|---|---|---|---|
| identity.session | Sign in / end session | Timeclock PIN, shared auth gateway, browser/extension | Active employee | Restrict disabled identity | employee, audience, env | canonical identity | Original Owner path only; shared session contract pending |
| factor.enroll / approve / revoke / recover | Manage passkey, authenticator and recovery | Owner setup, staff-security, future admin UI | Self enrollment with policy; privileged approver | Separate approval/revocation | employee, realm, factor | strong proof; audited recovery | Original Owner-only path; staff policy and new RP pending |
| access.inspect / grant / restrict / revoke | Effective access and permission administration | Security admin UI, API, role and individual assignment | Authorized administrator, not ordinary staff | Separate read/write/approve permissions | operation, resource, field, location, env | approval/step-up rules TBD | Registry, precedence, assignments, UI not built |
| audit.read / export | View or export security audit | Security UI, security logs | Scoped authorized reviewer | Export independently controlled | realm, actor, event, env | redaction and retention | Existing factor/activation events; consolidated audit pending |
| service.identity / delegate / rotate / revoke | Machine identity and delegated access | Workers, APIs, Discord/Rewards, extensions where appropriate | Service principal; admin lifecycle | Independent service grants | audience, operation, env | scoped credentials, expiry/rotation | Not built as shared contract |
| product.cost.view / modify | Wholesale cost access | Product/Inventory/PO tools, reports, exports, bulk and APIs | All active employees may view; modification separately controlled | Modification grant/restriction, precedence TBD | product, outlet, field, env | canonical identity; update approval TBD | User/project rule in template; actual cross-tool enforcement not established |
| operations.registry | Register tool capabilities and review enforcement | All tool handoffs, API and UI, bulk/queued/delegated entrypoints | Security owns registry | No implicit business grant | tool, resource, operation, env | manager deduplication, Security review | Full inventory and bypass tests pending |

UI must support searchable grouped operation labels/descriptions, role membership, individual exceptions, effective access and source, scoped grants, expiry/revocation, prerequisites/conflicts, service/automation delegation, audit/history and change confirmation. Distinguish UI visibility from server-side permission enforcement. Cover read/create/update/delete/approve/execute/config/export and automation separately, including indirect, bulk and queued effects. Do not invent approved roles, grant precedence, or assignments. Cross-tool permission inventories and final admin UI are still planned.

## Shared files / integration surfaces affected

- staging/hc-secure-runtime-readiness.js and tests/hc-secure-runtime-readiness.test.mjs (deployed readiness; 4 tests).
- tests/hc-secure-staging-readiness.test.mjs (5 tests), staging/owner-security-server.js, services/security/ownerTimeclockStagingBundle.js, ownerStagingDatabasePreflight.js, ownerSecurityStagingMount.js, services/scannerTimeclockIdentity.js, services/staffAuthGateway.js.
- scripts/check-hc-secure-pristine-root.mjs, bootstrap-hc-secure-staging-db.mjs, prepare-hc-secure-locked-roles.mjs, commission-hc-secure-db-credentials.mjs, services/security/hcSecureCredentialCommissioningPreflight.js and corresponding regression/disposable PG18 tests.
- docs/HC_SECURE_AUTH_INTEGRATION_ACCEPTANCE.md contains earlier source-stage statuses; reconcile before using as live state. This handoff and Railway are current authority.

## Remaining blockers

- Full auth server not enabled. Need distinct application secrets: HC_OWNER_SESSION_SECRET, HC_OWNER_THROTTLE_SECRET, HC_OWNER_PASSKEY_SIGNING_SECRET, HC_OWNER_APPROVAL_HMAC_SECRET, HC_OWNER_MFA_SESSION_SECRET (each at least 32 bytes, independent), HC_OWNER_TOTP_ENCRYPTION_KEY (32 random bytes, standard base64), and separately approved HC_OWNER_TIMECLOCK_SERVICE_SECRET. Generate privately; do not share values.
- Need review exact production Timeclock route implementation and build independent scoped integration in development; test before explicit production approval. Preserve original secret and existing callers.
- New HTTPS hostname and RP ID, safe first/new Owner enrollment ceremony, passkey/TOTP/negative tests, staff approvals/recovery, central registry and permission UI, session/revocation and machine auth, separate customer realm, production route inventory and staged rollout are unfinished.
- Need verify backup/restore, ongoing health/security monitoring, incident/rotation policies and browser acceptance; no independent external audit. Startup test is not full security certification.
- Historical issues resolved: incorrect SQL array parameter binding caused first schema attempt to fail before DB creation; read-only pristine recheck then corrected retry succeeded. Conflicting role flags fixed. SCRAM script string-replacement syntax corruption fixed and retested. Initial missing Railway password variables corrected. Historical details preserved in archive.

## Decisions needed

- Foundation manager owns roadmap/dependency coordination; Security chat owns implementation and final permission contract. Confirm chat move/name operationally; no Railway project move needed.
- Approve distinct Timeclock service credential design, role/individual grant precedence, approval/step-up policies and recovery/retention rules before activating corresponding features.
- Separate approval for public DNS/TLS, new Owner enrollment, production changes, destructive operations, and actual grant changes. No automatic promotion.

## Recommended next action

1. Resume from successful independent private runtime readiness; do NOT repeat bootstrap, role creation, commissioning or secret cleanup.
2. Review current source and staged config; configure independent application secrets privately while login stays disabled; preserve runtime-only DB privileges. Verify names and safe startup, not secret values.
3. Review/implement independently scoped Timeclock identity integration in development, negative tests and compatibility with original Owner and active store workflows. Obtain approval before production changes.
4. Plan approved hostname/TLS and safe new RP enrollment; test physical device passkey, TOTP, session expiry/revocation, replay, wrong-user/origin/RP and CSRF. Preserve original.
5. Build canonical staff lifecycle and operation registry/admin UI from all Foundation and Operations workstream inventories. Then test machine identities and route-by-route adoption, separate future customer realm. Production rollout only with explicit approval and rollback evidence.

## Restrictions / safety

- No secret values, raw DB URLs, PINs, QR, TOTP, recovery codes or activation tokens in chat/GitHub/logs. Use private password manager/Railway entry; retrieve names only.
- No production deploy or destructive operation without explicit authorization. Review exact staged patch and scope before approval; independently verify deployed commit and runtime results. Never restart database casually.
- Do not reset original Owner, copy old passkey rows as migration shortcut, repeat old activation/recovery ceremony, or re-arm offline provisioner. Ambiguous DB commit requires inspection before retry. Keep production and test identities separate.
- Preserve working integrations; use small tested changes and server-side authorization. Avoid duplicate security systems. No actual access grant implied by this handoff.

## Documentation

- Canonical handoff: https://github.com/Tawgod/Hobby-Corner/blob/main/handoffs/hc-secure.md
- Full prior history: https://github.com/Tawgod/Hobby-Corner/blob/main/handoffs/archive/hc-secure-through-2026-11-24.md
- Original Owner: handoffs/owner-login.md; master HOBBY_CORNER_PROJECT.md; shared dependency register SHARED_TOOL_DEPENDENCIES.md; template handoffs/TEMPLATE.md.
- Draft PR #77 and Railway service IDs above are authoritative implementation/runtime references. Update current snapshot at milestones, preserve history in Git, coordinate with both managers. Chat relocation itself does not change deployment or ownership permissions.
