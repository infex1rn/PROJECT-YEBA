# Full application audit

What this repo does: PROJECT-YEBA is a design marketplace with a Next.js frontend, an Express/Prisma backend, designer accounts, administration screens, and mobile/offline features. Its intended production workload includes concurrent buyers, designers, and administrators handling purchases and payouts; no measured traffic target was supplied.

Audit date: 2026-10-08. Reviewed application commit: `ba2acf0891a208e979bfe191a67339aeea1f831c`. This is a report, not a certification or an implementation change. Findings distinguish observed failures from consequences inferred from source.

## Must fix

### 1. Critical: the default JWT key allows forged administrator access

**What this is:** Backend authentication uses signed JWTs (`backend/src/config/index.ts:9`, `backend/src/middleware/auth.ts:24`).

**Problem:** An unset `JWT_SECRET` selects the public string `your-secret-key`. A local production-mode HTTP probe signed a token with that key for a nonexistent user and received HTTP 200 from `/api/admin/reports`; unauthenticated requests received 401.

**Fix:** Reject startup without a strong configured secret, rotate any default key that has been used, and invalidate affected sessions. Add a regression check for missing production secrets and forged tokens.

**If we skip it:** Any deployment using the fallback permits attacker-created administrator tokens. The probe does not establish whether a deployed environment currently uses that key.

### 2. High: administrator login is a local browser flag

**What this is:** `frontend/app/admin/login/page.tsx:27` accepts `admin/admin`; `frontend/components/admin-auth-guard.tsx:20` checks local storage.

**Problem:** Login sets `adminAuth` without obtaining a backend authentication token. Anyone can set the flag, and the normal admin login cannot authenticate real dashboard API calls; the flag itself does not bypass backend JWT checks.

**Fix:** Connect login to real authentication and verify administrator authorization on the server. Make the UI reflect the authenticated session and actual API errors.

**If we skip it:** The apparent login protection remains cosmetic and legitimate administrators cannot reliably use protected operations.

### 3. High: backend code, database schema, and setup instructions disagree

**What this is:** Prisma models in `backend/prisma/schema.prisma` underpin the admin routes and database setup.

**Problem:** After Prisma generation, backend type checking and compilation both fail with eight diagnostics. Admin code references absent fields including user `status`, designer `totalEarnings`, buyer `totalSpent`, transaction `status`, and withdrawal `processedAt`; legacy SQL uses different relationships and enum values, there are no committed Prisma migrations, and package migration/seed commands target missing files.

**Fix:** Establish one canonical schema, implement the required domain states, commit migrations, align routes and documented setup, and replace broken scripts. Verify installation on a fresh disposable database and an upgrade from the supported existing schema.

**If we skip it:** The backend cannot pass its build, and following different setup instructions produces incompatible databases. Merely suppressing TypeScript errors would leave invalid queries at runtime.

### 4. High: admin screens report changes to sample data

**What this is:** Users, designs, transactions, reports, and settings pages under `frontend/app/admin/` implement the administration interface.

**Problem:** These pages initialize sample arrays and mutate browser state instead of persisting backend changes; settings simulate saving with a timer. `backend/src/routes/admin.ts:631` also returns a constant empty reports collection rather than stored reports.

**Fix:** Connect every supported action to persisted, authorized server operations and show success only after confirmation. Implement report storage and actual settings enforcement before presenting these workflows as operational.

**If we skip it:** Administrators see apparent moderation, payment, and configuration changes that disappear or never affect the application.

### 5. High: the marketplace has no complete purchase or delivery flow

**What this is:** Cart actions in `frontend/components/marketplace.tsx:149` update a local set; backend route registration is in `backend/src/index.ts:31`.

**Problem:** No complete checkout, payment initiation/webhook, purchase entitlement, or protected download flow was found. Design submission accepts a file URL without an implemented secure upload pipeline, and mobile cart controls have no action handlers.

**Fix:** Implement the complete server-priced purchase lifecycle, verified payment events, durable order records, authorized downloads, and secure asset uploads. Verify the buyer and designer journeys end to end.

**If we skip it:** Customers can browse a marketplace that cannot complete its core transaction and delivery promise.

### 6. High: refunds and payouts lack real money movement

**What this is:** Refund and withdrawal handlers appear in `backend/src/routes/admin.ts:515` and `:608`.

**Problem:** They contain unimplemented provider actions while reporting processed results; their current writes also reference fields absent from Prisma. Even after the schema errors are corrected, changing a database status would not issue a refund or transfer money.

**Fix:** Implement verified provider operations, idempotency, authorization, amount validation, durable ledger updates, and explicit failure/retry states. Use precise monetary representation rather than floating-point ledger amounts.

**If we skip it:** Future successful requests can claim money was refunded or paid without moving it, and retries can become financially unsafe.

### 7. High: resource authorization exposes private or unapproved data

**What this is:** User lookup is in `backend/src/routes/users.ts:8`; public design lookup is in `backend/src/routes/designs.ts:105`.

**Problem:** Any authenticated user can request another numeric user ID and receive its email without an owner/admin check. Public design lookup does not restrict results to approved designs, although the public listing does.

**Fix:** Enforce ownership or administrator access for private profiles and approval checks for public design detail. Provide separate, minimal public designer data and authorized owner/admin previews.

**If we skip it:** Users can enumerate private account information, and visitors can view pending, rejected, or flagged designs by ID.

### 8. High: deleted or demoted accounts retain token privileges

**What this is:** Authentication and administrator authorization in `backend/src/middleware/auth.ts` trust JWT claims until expiration.

**Problem:** Middleware does not check that the account still exists or that its current role permits access. A role change or deletion therefore does not invalidate an otherwise valid token; the default lifetime is 24 hours.

**Fix:** Check current account authorization or use revocable sessions/versioned tokens, including the account states established by the corrected schema. Test deletion, demotion, and logout behavior.

**If we skip it:** Previously authorized users retain access after administrators withdraw it.

### 9. High: purchase history is deleted through cascading relationships

**What this is:** Buyer/design transaction relations in `backend/prisma/schema.prisma:91` use cascading deletion; user and design delete routes perform hard deletes.

**Problem:** Deleting a design or its owning account can cascade into transaction records. This is a schema consequence identified from source, not a destructive database test.

**Fix:** Preserve financial records and purchase snapshots, restrict destructive relationships, and use appropriate account/design deactivation. Define retention and entitlement behavior explicitly.

**If we skip it:** Removing an account or sold design can erase the evidence needed for delivery, refunds, reconciliation, and disputes.

### 10. High: the service worker can cache authenticated responses across sessions

**What this is:** `frontend/public/sw.js:45` applies network-first caching to API requests.

**Problem:** Successful protected GET responses are stored without account partitioning or an explicit public-only allowlist; logout in `frontend/lib/api-client.ts:118` does not clear that cache. Where responses do not vary by authorization, a later offline request to the same URL can receive a previous session's cached data.

**Fix:** Cache only explicitly public GET resources; exclude authentication, user, administrator, and financial endpoints. Clear account-scoped offline storage on session changes and verify two-account offline behavior in a browser.

**If we skip it:** Shared-browser sessions can expose another account's cached information. The cross-session scenario was source-reviewed, not reproduced in a browser.

### 11. High: offline initialization fails and queued actions are discarded unsent

**What this is:** `frontend/lib/indexeddb.ts:51` initializes storage, and `:223` processes queued actions; related sync logic lives in `frontend/lib/sync.ts` and `frontend/public/sw.js`.

**Problem:** The exported `indexedDB` manager shadows the browser API; invoking the implementation produced `TypeError: indexedDB.open is not a function`. After that is fixed, queue processing still logs and deletes actions without sending them, and several sync paths remain unimplemented.

**Fix:** Use the actual browser IndexedDB API, implement authenticated/idempotent synchronization, and delete actions only after durable server acknowledgment. Retain failed actions with visible recovery states.

**If we skip it:** Offline storage cannot initialize, and enabling the existing processor would silently discard pending work. The audit did not establish that every queue path is currently invoked by the UI.

### 12. High: mobile and synchronization consumers read the wrong API shape

**What this is:** `frontend/app/m/marketplace/page.tsx:34` and `frontend/lib/sync.ts:133` consume the API client.

**Problem:** They read `response.designs`, while the client wraps the server payload under `response.data`. Mobile rendering also expects an image array that differs from the backend's preview field.

**Fix:** Define a shared response contract, correct all consumers, and verify rendering against actual backend responses, including empty/error and pagination cases.

**If we skip it:** The mobile marketplace and synchronization can behave as though successful requests returned no designs.

### 13. High: designer deletion calls the administrator endpoint

**What this is:** `frontend/lib/api-client.ts:173` and `:239` define the same `deleteDesign` method twice.

**Problem:** The later administrator implementation replaces the earlier designer implementation in emitted JavaScript. A designer deletion therefore targets `/admin/designs/:id` rather than `/designs/:id`.

**Fix:** Give the operations distinct names and authorization contracts, update callers, and verify both roles against their intended endpoints.

**If we skip it:** Designer deletion fails authorization or uses unintended administrator behavior; disabled type validation hides the duplicate declaration.

### 14. High: CI uses a package manager incompatible with the lockfile

**What this is:** `.github/workflows/deploy-cloudflare.yml:28` installs pnpm 8; the root package pins pnpm 9.15 and the lockfile is version 9.

**Problem:** Reproducing the workflow's frozen install with pnpm 8.15.9 in an isolated copy failed with `ERR_PNPM_LOCKFILE_BREAKING_CHANGE`.

**Fix:** Use the repository's pinned package-manager version consistently in CI and local setup, retaining frozen installation.

**If we skip it:** The deployment pipeline stops before its build and deployment steps.

### 15. High: deployment API configuration targets the wrong URL

**What this is:** The client API base is in `frontend/lib/api-client.ts:3`; deployment supplies it in `.github/workflows/deploy-cloudflare.yml:55`.

**Problem:** The workflow fallback is `http://localhost:5000` without the backend's `/api` prefix; other deployment examples also omit that prefix. In a deployed browser, localhost refers to the customer's machine, and an unprefixed server URL targets nonexistent routes.

**Fix:** Require and validate the deployed HTTPS API base including its route prefix at build time. Verify deployed login and design requests against the actual backend.

**If we skip it:** A successful static build can deploy a site whose authentication and data requests consistently fail.

### 16. High: static deployment does not carry the configured routing and headers

**What this is:** `frontend/next.config.mjs:13` selects static export, while middleware and `headers()` expect server execution.

**Problem:** The build warns that these headers do not apply to exported output, and middleware redirects do not run there. `_headers` and `_redirects` reside outside `public` and were absent from the built `frontend/out`; Wrangler also names a different output directory from the workflow.

**Fix:** Choose and document one deployment architecture, place actual edge configuration into its deployment artifact, and align output paths. Verify mobile routing, service-worker behavior, and security headers on the deployed site.

**If we skip it:** Published behavior differs from development, and the intended redirects and security headers are not delivered by these files.

### 17. High: onboarding and navigation lead to missing pages

**What this is:** Designer authentication, marketplace links, mobile navigation, and footer links route users through the application.

**Problem:** Designer authentication sends users to `/designer/dashboard`, which is absent from the export; registration also does not persist its returned token. Other links point to absent cart/profile, design-detail, designer-profile, signup, and policy routes; homepage search controls do not submit a search.

**Fix:** Complete the intended destinations and authenticated registration transition, connect search/query filters, and verify every visible navigation path against the built route inventory.

**If we skip it:** New designers and shoppers encounter dead ends during basic journeys.

### 18. High: installed dependencies have known security advisories

**What this is:** The workspace's installed dependency versions and lockfile were checked with `pnpm audit --json`.

**Problem:** Audit reported 4 critical, 49 high, 34 moderate, and 4 low entries. These counts are audit-reported entries, not unique exploitable vulnerabilities; Next.js 15.2.4 is among the affected packages, and deployment mode changes exploitability.

**Fix:** Upgrade to supported patched versions, assess reachable runtime/build paths for each advisory, and rerun installation, compilation, application verification, and dependency audit. For example, consult the [official Next.js security advisory](https://nextjs.org/blog/CVE-2025-66478).

**If we skip it:** Known vulnerable dependency versions remain installed. The static export alone does not demonstrate a deployed React Server Components endpoint or prove every advisory is exploitable.

## Should fix

### 19. Quality gates allow broken code to appear successfully built

**What this is:** `frontend/next.config.mjs:3` skips lint and type checks during builds; package scripts and CI provide incomplete verification.

**Problem:** Frontend standalone type checking produced 26 diagnostics despite a successful build. Frontend lint stops at an interactive configuration prompt, backend lint fails for missing ESLint 9 configuration, and no application tests or test scripts were found in the reviewed repository/Graphify coverage.

**Fix:** Resolve the existing diagnostics, configure noninteractive linting, enforce frontend/backend checks in CI, and add meaningful regression tests for the security, financial, and user journeys above.

**If we skip it:** Passing frontend builds continue to conceal failures that users encounter at runtime. Graphify's empty test mappings alone would not prove an absence of tests; repository inspection corroborated the result.

### 20. Important controls lack accessible names and form behavior

**What this is:** Marketplace search/favorite controls, mobile icon controls, and designer authentication inputs comprise core interaction paths.

**Problem:** Source review found unlabeled search inputs and icon buttons without accessible names, including `frontend/components/marketplace.tsx:220` and `:385`, and mobile marketplace controls. Designer authentication uses click handlers without native form submission, weakening keyboard and Enter-key behavior.

**Fix:** Add associated labels and appropriate accessible names, use semantic forms and submit buttons, and verify keyboard and screen-reader operation. Review against the [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines).

**If we skip it:** Screen-reader and keyboard users face avoidable barriers in searching, saving, and signing in. This was a source review; visual contrast and assistive-technology behavior were not tested.

## Verification evidence

| Check | Result |
| --- | --- |
| Graphify authenticated connection, repository, graph metadata | Passed; accessible repository `infex1rn/PROJECT-YEBA`, ready/queryable, 952 nodes; index commit matched reviewed HEAD. |
| Dependency installation | `pnpm install --frozen-lockfile --ignore-scripts` passed using pnpm 9.15.0. |
| Prisma client generation | Passed; no database migration or write performed. |
| Frontend standalone TypeScript check | Failed, 26 diagnostics. |
| Backend type check and build after Prisma generation | Both failed, eight diagnostics. |
| Frontend production static build | Passed with type/lint validation explicitly skipped; export/header/middleware warnings observed. |
| Frontend lint | Failed at interactive ESLint setup. |
| Backend lint | Failed: ESLint configuration missing. |
| Workflow pnpm 8 frozen install reproduction | Failed: incompatible version-9 lockfile. |
| Local HTTP authorization probe | No token: 401; forged default-key ADMIN token: 200; corresponding BUYER token: 403. No production database involved. |
| IndexedDB implementation invocation | Failed: `indexedDB.open is not a function`. |
| Export artifact checks | Service worker present; `_headers` and `_redirects` absent. |
| Dependency audit | 4 critical, 49 high, 34 moderate, 4 low reported entries. |

An additional sensitive-response issue was observed: admin user-detail and transaction-detail queries return full related user records, including the schema's password-hash field (`backend/src/routes/admin.ts:190`, `:475`, `:482`). Replace these responses with explicit field allowlists as part of correcting the administrator API contract in finding 3; hashes should not be delivered to browser clients even when the requester is an administrator.

Verdict: **Not ready for production.** Address authentication first, then the schema/build and deployment blockers, and complete the real financial and buyer/designer workflows before launch. Successful static compilation does not establish application correctness.

Not checked: a deployed environment's actual secrets or headers, a real database and its migration history, payment-provider behavior, real asset storage, browser visual/accessibility/offline execution, load/concurrency behavior, and production monitoring or backups. No database, payment, or production-system writes were performed. No application fixes, commits, pushes, or deployments were made during this audit.
