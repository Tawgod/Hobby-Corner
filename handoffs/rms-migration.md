# RMS Migration / Legacy Importer — Current Handoff

**Last verified:** 2026-11-23  
**Status:** Testing; v68 source-freshness safeguards implemented. Next verification is a fresh RMS export + manifest and read-only notebook setup. Controlled test execution remains pending. Not a live general-purpose staff importer.

## Source
- Runtime/bridge repository: `Tawgod/Hobby-Corner-Discord-Bot`.
- Active migration branches remain: `product-migration-colab`, `rms-history-read-bridge-20261026`, and `feature/rms-readonly-reporting`.
- 2026-11-23 comparison against Discord-Bot `main`:
  - `product-migration-colab`: diverged, 200 commits ahead / 4 behind.
  - `rms-history-read-bridge-20261026`: diverged, 221 commits ahead / 4 behind.
  - `feature/rms-readonly-reporting`: diverged, 2 commits ahead / 3 behind.
- Legacy Apps Script repo remains `Tawgod/Lightspeed-Importer`; `ChatGPT` is still a distinct diverged history (2 ahead / 2 behind main on 2026-11-23). Do not merge blindly.
- Private recovery/schema-only branch `backup/hobby-corner-postgres-source-schema-20261029` is **not** a dump of live records.

## Implemented / verified in source
- The active `product-migration-colab` notebook is now **v68** (`2026-11-23-v68`).
- v68 adds a bridge-generated `.manifest.json` sidecar with UTC export time, CSV SHA-256, exported row count, and direct RMS counts for items, suppliers, departments, categories, aliases, supplier-list rows, distinct brands, and latest item update.
- Notebook setup requires the matched manifest by default, rejects stale exports older than 6 hours by default, verifies CSV hash and row count, and writes a durable `Source Freshness Audit` for new/unmapped departments, department/category pairs, suppliers, and manufacturers/brands.
- New named suppliers are surfaced even when current migration policy would otherwise fall them back to Lightspeed `Other`.
- The active `product-migration-colab` README documents prior hardening through **v67** plus the new v68 freshness layer.
- Authoritative migration source remains the Drive RMS CSV; legacy candidate-sheet fallback is fail-closed unless explicitly enabled.
- RMS quantity remains selection-only; opening Lightspeed inventory is never imported from RMS.
- Category mapping uses `LS: importer / Mapping`; live category UUID reconciliation, Category UUID Audit, Category Leaf Audit, safe missing-leaf creation, parent-category fallback leaves, pagination, and exact full-path verification are implemented.
- Supplier resolution includes live UUID reconciliation, stale-cache correction, exact-name behavior, `Other` fallback policy, and the special Horizon Hobby Rockets / ESTES rule documented in v67.
- Brand resolution includes canonicalization through `LS: importer / Brands`, live UUID reconciliation, stale-cache correction, and just-in-time creation only for selected controlled writes.
- Product identity hardening includes exact SKU/GTIN checks, source-wide product-code collision detection, invalid Lightspeed SKU routing to REVIEW, and failed-test-product re-verification/repair without modifying unrelated existing products.
- Controlled legacy product writes verify inventory tracking, product fields, codes, supplier, category, brand, price, weight, active flags, images, and reorder behavior.
- Operational review/audit tabs were centralized into the dedicated Flagged Migration workbook in v63; `LS: importer` remains mapping/reference authority.
- The previously ambiguous low-volume category pairs now have explicit v67 fallbacks; future new unmapped pairs remain review-visible.

## Current workbook finding — 2026-11-23
- Read-only inspection of the supplied `LS: importer` workbook found the expected mapping/reference tabs plus `Error Items` (1,653 data rows), `Lightspeed POS Inventory Export` (626 data rows), and related review/export tabs.
- A block of Games Workshop records in `Error Items` is physically split across adjacent spreadsheet rows: the first row contains identity through supplier code and the next row contains price/category/stock/date fields shifted to the left.
- These malformed rows create false duplicate/mapping signals if treated as normal records. They must remain fail-closed / review-only unless reconstructed from an authoritative source. Do not infer product identity from the shifted continuation row.

## Tested
- Source and branch topology reverified 2026-11-23.
- No production write, Railway deployment, branch merge, category/supplier/product mutation, or RMS on-hand import was performed in this verification.
- Current source documentation marks **v67 runtime setup verification and a controlled test batch as still pending**.
- A fresh full-catalog final-cutover collision preflight against all existing Lightspeed product codes remains required.

## Deployed
- Migration branches are not verified deployed as production migration code.
- Main Discord/Rewards deployment status does not establish migration-branch readiness.
- Legacy import scripts are not a new Railway production application.

## Continuing conversation and reuse boundary
- The **RMS Item Migration** conversation remains active and intentionally separate from normal production operations tools.
- Other Hobby Corner tools may reuse reviewed, deterministic product identity/mapping/validation helpers only after source verification and regression tests.
- Never copy migration credentials, source records, RMS on-hand quantities, test-only persistence, or bulk migration writers into standard production features.
- Do not merge, deploy, retire, rename, or delete migration branches as a side effect of helper reuse.

## Remaining blockers / gates
- Generate a fresh RMS product export with the current bridge and copy the CSV **and its `.manifest.json` sidecar together** into the migration Drive location.
- Run the current v68 setup end-to-end and confirm the manifest freshness/hash/row-count checks plus the `Source Freshness Audit` output.
- Review any newly discovered RMS department/category/supplier/manufacturer values before a controlled write batch.
- Re-run source-wide and existing-Lightspeed product-code collision preflight on the final migration dataset.
- Reconcile malformed/split `Error Items` rows against an authoritative export rather than spreadsheet position.
- Execute a bounded controlled test batch only with explicit authorization; verify read-back, inventory tracking, reorder behavior, images, and cleanup/retry handling.
- Complete larger rehearsal, cutover audit, rollback/reconciliation plan, legacy credential retirement, and physical-inventory process before final migration.
- No validated independent PostgreSQL full-data backup is established by this handoff; schema-only recovery material is not a data backup.

## Decisions still open
- Final treatment of RMS inactive state for migrated in-store products.
- Whether/when any migrated products become active on Ecwid/online.
- Whether tags beyond private migration annotations are required.
- Confirm/retain the documented `LB` default RMS weight-unit assumption.
- Which legacy importer functions and credentials remain necessary after cutover.

## Recommended next action
1. Regenerate the authoritative RMS export with the current bridge so the CSV and freshness manifest are produced as a matched pair, then run v68 setup read-only.
2. Compare the generated review/audit outputs with the supplied `LS: importer`, explicitly excluding malformed split continuation rows from normal identity analysis.
3. Resolve any new mapping/UUID/collision failures.
4. Only then prepare an explicitly authorized controlled test batch.

## Restrictions / safety
- No bulk Lightspeed writes, RMS stock quantity imports, branch deletion, secret exposure, production rollout, or destructive cleanup without explicit authorization.

## Documentation
- Migration source: `Tawgod/Hobby-Corner-Discord-Bot:migration/product_migration/README.md`.
- Related project docs: `ROADMAP.md`, `RAILWAY_VARIABLE_SECURITY_AUDIT.md`, `BRANCH_AND_DEPLOYMENT_POLICY.md`, `FEATURE_INVOICE_RECONCILIATION.md`.
