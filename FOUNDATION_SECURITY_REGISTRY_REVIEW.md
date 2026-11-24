# HC Secure registry reconciliation — S2.5A (proposal)
2026-11-24. Security-owned design, not approved grants or runtime mapping. Source FOUNDATION_SECURITY_PERMISSION_REQUIREMENTS.md blob 1306922eaf8f2a2e0c24e8f179fcc92b402b86db (213 source rows across five domains), manager V4/V5 reconciliation. S2.1 PR #98 and all commissioning gates unchanged.

## Naming adjudication (first pass)
Use stable domain.resource.action identifiers, consistent with domain-owned semantics; aliases are documentation only until reviewed migration. Exact matching only, no wildcard grants or implicit prefix inheritance. The following covers the manager alias queue, not every individual row; remaining detailed source rows remain proposed and must be individually normalized with scopes and evidence before registry freeze.

| Group | Proposed canonical direction | Do not collapse / open issue |
|---|---|---|
| Product read | catalog.product.read | includes wholesale cost for active employees with ordinary authorized product access; exact search and export may be narrower/separate; customer/public projection excludes cost |
| Product create/edit | catalog.product.create, catalog.product.update | proposal vs execution explicitly distinct; create/update.approve and .execute; identity/variant fields separate effects; archive vs hard delete |
| Cost | catalog.product.cost.modify | actual catalog cost only; propose purchasing.po.line.cost.modify for actual PO line cost; invoice evidence correction is purchasing.invoice.review, not actual cost mutation; owner decision whether PO cost permission additionally requires catalog cost grant |
| Retail/tax | catalog.product.price.modify, catalog.product.tax.modify | discounts and price-list scope review; do not bundle tax |
| Reference | catalog.reference.read/create/update/delete | configure is not alias for all; archive distinct from delete |
| Supplier link | catalog.supplier.link.read/modify | alias modify, approvals, execution separate; resource exact supplier and product |
| Media | catalog.asset.read/modify | source.configure separate; file access and underlying product scope both apply |
| Inventory read | inventory.snapshot.read | events/allocation/location separately scoped |
| Count | inventory.count.observe | session create/close/cancel, correction, reconciliation separate |
| Restock | inventory.restock.confirm | task create/assign/cancel separate; no vendor stock adjustment implied |
| Reason | inventory.reason.revise | create/deactivate separate |
| Adjustment | inventory.adjustment.execute | propose/approve/readback separate; old adjust meaning ambiguous, no automatic mapping |
| Allocation | inventory.allocation.create/release | reserve vs commitment semantics require Inventory review |
| Receiving | inventory.receipt.read; inventory.receipt.confirm vs inventory.receipt.execute | confirm physical evidence vs actual vendor stock effect; require Inventory review, no automatic equivalence |
| Contacts | customers.contacts.read | search, minimal profile, notes, custom fields, export separate |
| Customer linkage | customers.identity.link | verify/unlink distinct; customer realm separate |
| Consent | customers.consent.update | purpose/channel, withdrawal, history; no implication of send authorization |
| Payment | sales.payments.collect; sales.payments.reverse | refund vs reversal semantics review; generic modify never implies financial execution |
| Deposit | sales.deposit.collect/reverse/convert | broad modify rejected; conversion also credit issue if effect applies |
| Return | sales.returns.execute | approval, payments, store credit, inventory stock effects separately required |
| Credit | store-credit.issue | approval/redeem/reverse/reconcile distinct |
| PO | purchasing.po.read/create/update/approve/execute | OPEN only; dispatch/cancel/delete, export/import separately scoped; actual line cost effect separate |
| Invoice | purchasing.invoice.read/review/approve/execute; purchasing.document.ingest | document vs invoice lifecycle; actual PO/cost/product effects separately checked; never implies receipt |
| Notifications | notifications.history.read | preview/send/configure distinct; consent and audience |
| Jobs | jobs.configure/execute | domain job restrictions plus delegated effects; configure/run/retry/cancel separate, delegation separate; domain aliases not automatic |
| Audit | audit.read/export | business domain scope and security audit distinct (security.audit.read/export proposed); no audit edit permission |
| Import/export | domain-specific import/export, imports.preview/approve/execute | generic import/export is workflow gate not authority for underlying effects or fields |

## Proposed effective authorization policy
- Default deny for new operations; existing production access not altered. Actor active and session valid; service realm separate. Role grants additive union of explicit scoped grants, plus individual grants. Individual restrictions and applicable role restrictions override matching grants; mandatory policy constraints cannot be overridden. Recommend grant-only ordinary roles and individual restrictions for exceptions, avoiding accidental broad role denies. No implicit Owner bypass at business entrypoints; recovery/break-glass separate reviewed policy.
- Evaluate complete operation+resource+field+location+environment tuple per grant. Never union unrelated dimensions into a new scope (role A outlet A, role B outlet B does not grant cross-outlet fields). Unknown scope/actor/effect denies. All required effects must pass; multi-resource operations require each target; authorization server-derived not browser-supplied. Explicit deny matches only its scoped tuple; expiry/revocation and inactive employee rechecked at execution. Field projection on read/replay; reject unauthorized write fields rather than silently drop. No automatic scope expansion for export or aggregate.
- Tool access is separate optional navigation/entrypoint gate; no override of operation restriction. Approval binds exact actor/request revision/effects/resources/expiry; execution rechecks current authority, approval validity and resource revision, including queued operations and retries. Recommend independent reviewer for designated high-risk actions, with explicit owner-approved exception workflow for small staff. Fresh MFA for privilege changes, recovery, service credential issuance and designated high-risk business actions; thresholds and freshness window TBD.
- Delegation: service principal has own audience/operations/scopes/expiry, intersect with delegator authority and job's approved exact scope; no borrowing human session or widening access. Revalidate delegator and service at execution for user-delegated jobs; separately approved standing service jobs have independent accountable owner and lifecycle. Revocation blocks future execution; already committed effects are reconciled not undone automatically.
- Audit decision IDs, actor/service/delegation, operation, scope, policy version, outcome, reason code, correlation, approval and revision; no secrets or unnecessary PII. Immutable security history; scoped read/export distinct. Fail closed if decision unavailable or stale; define transaction-bound grant/version seam with Core before implementation; no claim of atomic revocation across distributed systems without evidence.

## Suggested reusable bundles (not assigned)
Ordinary employee: job-relevant catalog read including cost, reference and stock snapshot, minimal customer search/profile only as needed, PO read and task reads only if job requires; no blanket contact/notes/export/financial/admin access. Optional separately assignable employee operational capabilities: count observation, restock confirmation, labels, fulfillment/pickup, customer/order entry.
Catalog specialist: product proposals, metadata/reference/supplier/media maintenance as scoped; cost, identity, archive, execution and approval separate.
Inventory specialist: counts/tasks/location/receiving evidence; stock adjustment/transfer/receiving execution separately controlled.
Customer service specialist: customer/order/fulfillment and payment collection as scoped; contact/notes, merge/link, refunds, voids, credit and exports separately controlled.
Purchasing specialist: PO/invoice/document review and supplier links as scoped; actual product/PO cost, order dispatch, approval and execution separate.
Reviewer/manager: selectable domain approval/review permissions, no automatic security administration or execution.
Security administrator: narrowly assigned identity, role, grant, restriction and audit administration; no automatic business writes or self-escalation. Technical operator: deployment/health/connector access independent from employee administration and business grants. Service identities: separate nonhuman scoped grants.
Owner: explicit accountable highest administration authority; no silent bypass of mandatory policy; recovery and emergency process needs owner approval.

## Administration UI design
Employees (active status from Timeclock), roles (reusable editable bundles, multi-role assignment), permissions catalog (search labels, stable IDs, aliases, business domain, consumers, scopes, prerequisites, proposed/approved/deployed/enforced status), individual grants/restrictions (expiry, exact scopes, reason), effective access simulator (employee, tool, operation, resource/field/location/environment, allowed/denied, sources and conflicting rules), approvals (revision, reviewer, expiry), devices/factors/sessions, services/delegation, audit/history. Separate domain configuration screens. Preview before sensitive changes, show impacted employees and gained/lost scopes, require step-up and confirmation, reject self-escalation and stale policy revision, audit and readback. No secret display. UI never substitutes for server authorization.

## Owner decision queue
D1 deny precedence: recommend matching restrictions override any role/individual grant, no automatic Owner bypass; mandatory constraints always apply.
D2 ordinary employee baseline: recommend basic catalog/stock reads and job-relevant minimal customer access; select ordinary operational rights separately (count/restock/labels/pickup/order entry/payment collection). No default export, contact notes or financial reversal.
D3 approvals: recommend separate approval/execution for high-risk actions (cost edits, stock adjustments, refunds/voids/credit, hard deletes, sensitive access changes); decide when single authorized Owner may self-approve given staffing, monetary thresholds and routine operational exceptions.
D4 wholesale cost boundary: recommend separate PO line cost and catalog master cost permissions; invoice evidence editing does not change actual cost. Confirm whether PO line change also requires catalog-cost permission or independently controlled cost permission. Cost viewing remains approved.
D5 role administration: recommend Owner-only authority initially to appoint security administrators, delegate grants within explicitly bounded authority, no self-escalation; decide whether trusted manager may assign preapproved roles/temporary permissions.
D6 temporary/delegated permissions: recommend explicit expiry for temporary grants and jobs, immediate future-operation revocation, no default standing employee delegation; owner chooses standard/max durations and review cadence.
D7 high-risk MFA and recovery: recommend fresh step-up for security administration and defined sensitive operations, emergency recovery independent and audited; decide assurance windows and owner recovery custody before activation.
D8 location and data restrictions: recommend all assigned store outlets only, no automatic future locations; separately scope customer contact/notes/export and financial amounts, confirm employee baseline needs. No field-level restriction that contradicts approved ordinary employee cost viewing.
Decisions D1-D8 are recommendations, not approvals. Naming semantics require domain review; technical registry implementation can proceed with synthetic fixtures after policy agreement; no actual role assignment, grant migration or deployment.

## Remaining work and evidence
First-pass design only. All 213 source rows retained in manager register; no exhaustive per-operation normalized machine-readable manifest yet. Need split grouped rows, confirm aliases with owners, exact scope schema, grant/approval matrix, historical permission migration inventory, legacy endpoint mapping and tests including cross-tool bypass, revoked/expired scope, replay, conflicting roles, multi-scope and delegated job paths. Coordinate Core trusted effect derivation and atomic/revalidation seam. No runtime implementation, test run, production access, Railway changes or secrets. Existing S2.1 readiness/commissioning and #77/#98 untouched. Registry work independent of V5.
