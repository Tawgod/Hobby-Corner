# Timcorp Productions Shared Web Foundation — Hobby Corner

**Status:** In Development / Prepared for gateway staging verification  
**Last verified:** 2026-11-11  
**Production deployment:** No  
**DNS/gateway changed:** No

## Purpose

Integrate Hobby Corner web surfaces with the Timcorp Productions shared host while preserving current Railway URLs, independent deployment, existing security, databases and environment variables.

Target host: `https://timcorp-productions.com`.

The central Timcorp gateway repository/path registry was not available through connected project sources and the public hostname/path contract could not be independently resolved from the current tool environment. The path plan below is therefore the **proposed Hobby Corner assignment pending gateway-owner confirmation**.

## Proposed route contract

Use longest-prefix routing:

| Timcorp path | Existing Railway upstream | Function |
| --- | --- | --- |
| `/hobby-corner/store-map/*` | `store-map-production.up.railway.app` | Store Map |
| `/hobby-corner/labels/*` | `lightspeed-api-production-c087.up.railway.app` | Avery/label web/API |
| `/hobby-corner/*` | `special-orders-test-production.up.railway.app` | Employee Store Operations |

Expected primary employee URL after approval: `https://timcorp-productions.com/hobby-corner/special-orders`.

Timeclock remains an internal Railway dependency in this first migration. Do not expose its integration/admin routes through the public Timcorp gateway merely to make the Store Operations pages work.

## Prepared source

### Main web/API service

- Repository: `Tawgod/Lightspeed`
- Branch: `feature/timcorp-base-path-hobby-corner-20261111`
- Base: `integration/hobby-corner-consolidation@014a7a949fe570b756b48d8f59995c1b0a434859`
- PR: intentionally not opened yet to avoid triggering unrelated Playwright/Scanner workflows before the central path is confirmed.

Changes:
- validated `HC_PUBLIC_BASE_PATH` support while preserving root routes;
- optional `HC_PUBLIC_LANDING_PATH` only for requests arriving through the configured prefix;
- prefix-aware HTML `<base href>`;
- relative Core Operations navigation/assets/API calls;
- prefix-safe staff-auth session calls;
- prefix-safe Avery label UI API calls;
- prefix-safe Order Split test harness;
- extension download page no longer hardcodes the Special Orders Railway hostname;
- focused source/helper regression tests;
- no cookie/session model change.

### Store Map

- Repository: `Tawgod/Lightspeed`
- Branch: `feature/timcorp-base-path-store-map-20261111`
- Base: `store-map-production@c7e76b8cad6f6c740d5bc3d9c3c96a7f36ae0475`
- Adds validated `HC_PUBLIC_BASE_PATH` stripping while preserving existing root and `/health` paths.
- Separate branch is required because Railway Store Map deploys from `store-map-production`.

## Expected Railway variables after approval

Do not set these in production yet.

```
special-orders-test:
  HC_PUBLIC_BASE_PATH=/hobby-corner
  HC_PUBLIC_LANDING_PATH=/special-orders

lightspeed-api:
  HC_PUBLIC_BASE_PATH=/hobby-corner/labels
  HC_PUBLIC_LANDING_PATH=/index.html

store-map:
  HC_PUBLIC_BASE_PATH=/hobby-corner/store-map
```

Existing security, database, Lightspeed, Discord, Scanner and Timeclock variables remain unchanged.

## Sessions / cookies / WebSockets

- Core Operations staff sessions are signed bearer tokens in browser `sessionStorage`, not cookies. No cookie Domain/Path/SameSite change is required.
- The Timcorp hostname is a different browser origin from Railway, so a fresh employee sign-in on Timcorp is expected. Do not copy session tokens between origins.
- No WebSocket/SSE path was found in the current consolidated Store Operations or Store Map implementation. No WebSocket gateway rule is currently required.
- Existing server-to-server Timeclock/Lightspeed/USPS/Microsoft/Discord calls remain direct backend integrations and are not rewritten to the Timcorp hostname.

## Railway verification / safety

Production Hobby Corner Railway remains independently deployed. Existing public service domains remain active.

At verification, Timeclock has an **unrelated staged Railway source change** to `feature/owner-timeclock-scoped-credential-20261110@a595fd336c5a38dcc5ab5423a8967698777c0929`. Do not overwrite, accept or combine that staged patch as part of Timcorp routing.

No Timcorp work changed Railway configuration, variables, domains, databases, credentials or deployments.

## Active-source conflicts to reconcile before merge

- PR #35 hierarchical navigation overlaps `server.js`, Core Operations HTML and `shared-ui/staff-auth.js`.
- PR #59 changes `timeclock/server.js`; Timeclock is intentionally excluded from first public-path code.
- PR #61 changes Core Operations security routes/policy and must remain authoritative for exact permissions.
- Chrome extension backend URL migration is deferred until the Timcorp gateway is verified; it must use the coordinated extension release process.

## Verification completed

- Base-path normalization/middleware helper tests passed locally.
- Store Map base-path helper test passed locally.
- GitHub read-back static scan found no remaining root-absolute internal `href/src` values in the five current web entry pages and no root-absolute `/api/` browser fetches in the converted Core Operations clients/staff-auth/Order Split harness.
- Two minimal branch-only GitHub workflows were added for exact-source syntax + focused tests, with no dependency install/browser/database/full-suite work. Record their final run IDs/status in the handoff when available.

## Remaining staging acceptance

1. Confirm the central gateway's actual Hobby Corner path assignment.
2. Reconcile overlapping active navigation/security branches.
3. Use a non-production gateway/proxy to forward prefixes unchanged.
4. Apply the proposed base-path variables in staging only.
5. Test employee PIN sign-in/session restore, navigation/assets, API reads and permitted writes, labels/PDFs, Store Map, direct Railway URLs and error isolation.
6. Verify forwarded HTTPS/host behavior.
7. Only after approval: configure central gateway/DNS and production Railway variables/deployment.

## Restrictions

No central DNS/gateway change, production Railway variable/config change, production deploy, production-connected merge, Lightspeed/customer/employee/database mutation, or Chrome extension release is authorized by this work.
