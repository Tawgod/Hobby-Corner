# Ring Camera Integration — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Planned (research and architecture; no implementation)

## Source
- Management repository: `Tawgod/Hobby-Corner`
- Authoritative documentation branch: `main`
- Application integration baseline, if future shared UI is required: `Tawgod/Lightspeed:integration/hobby-corner-consolidation` (registry records `f50c3309824986633c3ba37a95e6eb43aae15a3c` on 2026-10-29).
- Ring-specific repository, branch, PR, and implementation commit: **none found or assigned**.
- Superseded Ring branches/PRs: none identified.
- No Ring-specific deployed Railway service has been established or verified.

## Ownership and requirements preserved from this conversation
- Explore integration for several Ring cameras, particularly newer motorized pan/tilt models.
- Base design on current official/sustainable Ring/Amazon developer interfaces rather than brittle reverse-engineered consumer-account APIs.
- Assess device discovery/status, browser/server live video, recorded events/clips/snapshots, signed webhooks, motion/person notifications, authentication, native pan/tilt, auto tracking, external PTZ commands, patrol automation, and subscriptions/device compatibility.
- Plan a staff-friendly Hobby Corner camera interface and authorized Discord security alerts; consider store opening/closing rules, after-hours motion, offline devices, incident review and multi-camera event correlation.
- Keep exploratory until explicitly approved; do not modify Ring accounts, cameras, credentials or production systems.

## Implemented
- No code implementation identified. Prior chat delivered conceptual architecture, API research and a simulated dashboard mockup only.
- Recommended design: Ring cloud -> server-side OAuth and signed webhook intake -> isolated Railway backend with deduplication, event rules, stream-session management and audit -> authorized staff dashboard/Discord/store systems.
- Use Ring native application for pan/tilt, home position, privacy shutter and any camera-native auto tracking unless an official control API is established.
- Prefer event-driven/on-demand viewing over an assumed continuous multi-camera CCTV wall.

## Tested
- Automated: no Ring tests identified.
- Browser/employee acceptance: none.
- Ring developer account/device/OAuth/webhook/live-stream proof of concept: none.
- Runtime/deployment verification: no Ring runtime verified.
- Prior research findings are design inputs, **not device-specific acceptance evidence**. Revalidate official documentation, product models, subscription/encryption restrictions, developer eligibility, endpoint permissions and streaming limits before coding.

## Deployed
- Environment/service/deployment: none for Ring.
- Production status: not deployed; no Ring production account/camera changes.

## Shared dependencies
- Timeclock PIN/employee identity and `services/staffAuthGateway.js` for staff authentication; enforce separate camera viewing, history and security-admin permissions server-side.
- `SHARED_STAFF_AUTH_PERMISSIONS.md`: new shared operations require explicit authorization; Ring permissions should be separate from Lightspeed product/inventory writes.
- Railway hosting, PostgreSQL durable event metadata, secure token/secret storage, retries, audit and retention; use existing infrastructure conventions, but do not couple camera operations to Lightspeed writes.
- Discord notification infrastructure and existing store-hours/scheduling context, without assuming direct Ring arming/disarming API.
- Shared UI/navigation only if a future approved staff-facing integration is added; do not duplicate Chrome extension navigation or release outside the coordinated queue.
- Invoice Reconciliation, Product Manager, Scanner, PO Companion, Consignment, Rewards, Special Orders and customer sync have **no direct Ring dependency identified**. Do not add one or duplicate their shared matching/API clients.

## Shared files / integration surfaces affected
- Documentation only: this handoff.
- Potential future surfaces: dedicated Ring backend module/service, Railway PostgreSQL tables for devices/events/rules/audit, Timeclock-authenticated camera UI, Discord notification adapter.
- No current application source, Chrome extension, Lightspeed record, database schema or credential modified.

## API capabilities and limitations to revalidate
- Prior chat research identified official OAuth 2.0, device discovery/status/capabilities, signed event webhooks, event history, media and on-demand WHEP/WebRTC or RTSPS viewing as promising supported surfaces; exact endpoint/permission/model eligibility remains to be tested.
- External PTZ/patrol commands are **not established as publicly supported**. Native Ring app movement and auto tracking must not be confused with developer API control.
- Live-session duration, recording availability, subscription and encryption mode may limit dashboard use; verify against current official Ring/Amazon docs and actual purchased models.
- Two-way audio, automatic arm/disarm and uninterrupted multi-camera viewing are not promised through this integration.
- Avoid unofficial session-token scraping or unsupported reverse-engineered motor commands as a production dependency.

## Remaining blockers
- Exact camera model/SKU, power source, firmware and purchased quantities unknown.
- Official developer registration/app access, subscription, OAuth scopes and real-device API capability matrix unverified.
- No camera account/test environment authorized; no live test evidence.
- Staff role policy, incident/media retention, privacy signage, alert destinations and after-hours schedule rules undecided.
- PTZ API support unavailable/unverified; continuous CCTV requirements may require a different camera platform.

## Decisions needed
- Exact Ring camera models and whether programmable patrol/PTZ is mandatory or native tracking is sufficient.
- Whether owner approves a private Ring developer app and isolated non-production proof of concept.
- Which employees may view live feeds, clips and event history; who receives Discord alerts.
- Media retention, audio/privacy policy, notification thresholds and whether Ring-native viewing remains the primary fallback.
- Whether camera dashboard should be standalone or linked from existing authenticated staff UI.

## Recommended next action
1. Confirm camera model numbers and Ring developer eligibility against current official documentation.
2. Produce a per-model capabilities/permissions matrix and explicit API endpoint inventory.
3. Design read-only, mock-event proof of concept with signed webhook verification, idempotency, secure OAuth lifecycle, durable audit, Timeclock-backed access and Discord dry-run.
4. Seek separate explicit approval before connecting real accounts, enabling live alerts, deploying, or introducing any camera control.
5. Revisit project registry/roadmap when the workstream is scheduled.

## Restrictions / safety
- No production deployment, Ring account/camera modification, credential rotation, real customer/employee data mutation, Lightspeed write, PR merge or Chrome extension release without explicit approval.
- Never embed Ring tokens in the Chrome extension or frontend. Treat media and event data as sensitive; enforce least privilege, retention and revocation.
- Do not claim Ring implementation, testing or deployment based on research or mockups.

## Documentation
- `HOBBY_CORNER_PROJECT.md`, `HOBBY_CORNER_CHAT_TRANSITION.md`, `handoffs/README.md`, `handoffs/TEMPLATE.md`, `ROADMAP.md`
- `LIGHTSPEED_SHARED_SERVICES.md`, `SHARED_STAFF_AUTH_PERMISSIONS.md`, `FEATURE_INVOICE_RECONCILIATION.md`
- Official references: https://developer.amazon.com/docs/ring/api-documentation.html ; https://developer.amazon.com/docs/ring/developer-faq.html ; https://developer.ring.com/
- Prior Ring integration conversation: exploratory research and conceptual dashboard, no implementation.
