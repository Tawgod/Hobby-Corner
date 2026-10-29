# Avery PO Label Maker — Current Handoff

**Last verified:** 2026-10-29  
**Status:** Testing — source candidate PR #29 unmerged; physical print acceptance pending.

## Source
- Repository: `Tawgod/Lightspeed`; authoritative consolidated base `integration/hobby-corner-consolidation@f50c3309824986633c3ba37a95e6eb43aae15a3c`.
- PR [#29](https://github.com/Tawgod/Lightspeed/pull/29): `feature/labels-shared-ui-reconciled-20261028@a000c084d8d3f3bd818dda6d4ef244885e3bb11e`, **draft/open/unmerged**; supersedes PR #20.
- Existing production label generation code and `Templates/Avery_5960.json` remain authoritative until separately coordinated release.

## Implemented
- Original approved shared visual style and logo added to label interface without altering Avery label geometry or encoded source data.
- Preserve Avery 5960 3×10 template, SKU Code128 barcodes and leading zeros, start row/column selection, customer and special-order fields, PDF server paths `/api/po/:poId/data`, `/api/templates`, `/api/labels/generate`.
- No changed Chrome extension files, template JSON, product PO write semantics or production API contracts in PR #29.

## Tested
- PR-head `40730902857` Avery UI regression PASS: four Node tests; synthetic Chromium keyboard and CSS zoom (100/125/200) PASS; sample backend PDFs verified US Letter/expected page count/barcode images; scanner regression `40730902922` PASS.
- Real native store Chrome zoom at 100/125/200 and **physical Avery 5960 printing, barcode scanning and sheet alignment** have not been verified.

## Deployed
- Existing label system is part of current consolidated service; PR #29 visual candidate **not merged/deployed**.
- No Chrome extension version/package associated with PR #29.

## Shared dependencies
- Merged PR #27 shared UI and PR #24 Core Ops navigation; PO Companion PR #31 read-only PO mapping and Phase 2 shared PO reader PR #33 (unmerged).
- Future Invoice Reconciliation may create a new OPEN PO from an approved invoice; labels should read only the approved/verified PO and must not assume physical receipt from invoice or tracking.

## Shared files / integration surfaces affected
- `index.html` and additive `server.js` asset routing plus label-specific test workflows. The template/PDF geometry are unchanged.

## Remaining blockers
- Native Chrome/keyboard accessibility, representative live read-only PO and physical printer print acceptance at 100% scaling.
- Review shared UI asset routes and backend merge compatibility before approving PR #29.

## Decisions needed
- Store staff must accept physical Avery 5960 output and precise start positions; no label geometry change without explicit testing.

## Recommended next action
- Print selected sample PDFs on real Avery 5960 media, test UPC/SKU scanners and multipage/start positions, record accepted printer settings and then coordinate independent PR review.

## Restrictions / safety
- No production deploy/merge, Chrome release, template geometry change or Lightspeed product/PO writes without explicit authorization.

## Documentation
- `docs/LABEL_SHARED_UI_RECONCILIATION.md` on PR #29; `CHROME_EXTENSION_RELEASE_QUEUE.md`, `FEATURE_INVOICE_RECONCILIATION.md`.
