# GitHub-only D1 control for Gemnao

Prepared code, not an executed migration. This branch is separate from feature PR #75. It adds no website endpoint, startup migration, credential, database, or deployment permission.

## What already exists vs what is unverified

Cloudflare Pages already publishes this repository through Git integration. That does not establish a reusable Actions credential with D1 write permission. The existing production repository workflow only expands a source archive; it has no D1 migration job. The available assistant GitHub connection does not expose Secrets APIs, so secret names/presence/scopes have not been verified. Absence of evidence is not evidence that no token exists.

This implementation requires an **already configured**, reviewer-protected GitHub Environment named `gemnao-d1-production`, restricted to branch `gemunao`, and a usable `CLOUDFLARE_API_TOKEN` available to its approved job. The workflow first verifies that Environment using GitHub's read-only API. A missing/unverifiable Environment stops the run; it is not created or repaired. No permission or secret setting is changed by this PR.

A new token, moving/copying an existing token into Secrets, expanding token permissions, or creating/changing Environment protection needs the owner's separate approval. Never paste a token into chat, commit it, dump environment values, or run `wrangler auth token` for this process.

If setup is missing, the smallest setup to request is:

1. An existing suitable Cloudflare token, or owner-created scoped token if none exists. Preflight needs Pages Read (to verify the current production binding) and D1 Read; applying requires D1 Edit/Write. Scope to the intended Cloudflare account. Do not claim database-level token restriction without verifying provider support. Broad Workers/Pages edit permissions are not needed for this runner.
2. Owner-approved placement as `CLOUDFLARE_API_TOKEN` in the protected GitHub Environment, or explicitly approved reuse of its existing location. The account/DB IDs are fixed non-secret target expectations in the reviewed code, not editable dispatch inputs.
3. Owner-configured required reviewers and exactly one allowed deployment branch, `gemunao`. These settings are not silently added by a workflow run. Disable administrative bypass where supported; don't use a bypass to run this job.

The website can continue using Pages Git integration; the migration job does not deploy or merge code.

## Operator sequence in GitHub

Only after code review and any separately approved setup:

1. Merge this control-only PR with the owner's approval. Do not merge the QA fixture branch. The separate feature PR remains on hold. A workflow-only repository change can still trigger the existing Pages build, but contains no new application feature or automatic DB action.
2. Open Actions → **Gemnao D1 controlled migration** → Run workflow on `gemunao`, operation `settings`. The gate verifies existing environment restrictions. Its protected job checks only whether the configured token is present; it never outputs the value or calls Cloudflare in this mode.
3. Run a new dispatch with operation `preflight` and approve the protected job. Review the metadata-only job summary. It verifies the current Pages project/source/production branch, the currently configured production `DB` UUID and D1 name/UUID. A shared production/preview DB, mismatch, or inability to verify the production deployment blocks the run. The historical IDs in the repository are expectations, not proof.
4. Review the real table schemas and migration registry. The runner accepts either the original canonical history or the separately reviewed exact forward-only baseline documented below, with the corresponding complete before/after schema checks. Missing registry, a history differing from both reviewed baselines, partial schema, altered keys/defaults/constraints, or hash mismatch stops the process. It never invents a baseline, replays historical DDL, or reconciles data destructively.
5. After explicit approval of this exact target and migration, use a **new** `apply` dispatch. Copy `preflightSHA256` from the reviewed report and type `APPLY_0004_TO_GEMNAO`. The protected job repeats the live checks and requires the same schema/target fingerprint. Ordinary answer-count changes do not change the fingerprint. It records a fresh provider restore bookmark immediately before applying, outside the fingerprint.
6. Only the hash-pinned `0004_step_result_reports.sql` is in the runner's isolated migration directory. It invokes repository-pinned Wrangler 4.92.0 once with an isolated generated config pointing to the verified database and existing `d1_migrations` table. No arbitrary SQL, database selector, preview environment, or file path can be supplied at dispatch.
7. Require metadata readback to show complete 0004 schema plus its migration record. A lost/failed command or incomplete readback is an **unknown outcome**, not a reason to click Re-run jobs. Do not retry automatically. Run a fresh metadata-only preflight and review the result; a complete applied state is reported as a no-op. Apply reruns (`GITHUB_RUN_ATTEMPT > 1`) are rejected.
8. After the database is verified, obtain publication approval for feature PR #75, merge only that feature PR, and check production HTML/assets/API capability read-only. No synthetic votes against a real binding.

## Safety boundaries

- `workflow_dispatch` only; exact repository + production ref. No push, PR, schedule, public HTTP, or first-visitor trigger. A fixed concurrency group never cancels an in-flight migration for a newer run.
- Existing Environment protection is checked before the protected job becomes eligible. An absent Environment never becomes an excuse to run without reviewers. The job has no permission to modify repository settings or create secrets.
- Actions are pinned to official commit SHAs. Dependency installation has no Cloudflare secret and disables lifecycle scripts and pnpmfile hooks. The Cloudflare credential is passed only to the fixed control step after approval.
- Pages project metadata may include unrelated fields. The runner projects only project/source/deployment/binding identifiers in memory. It never reads those unrelated fields for use, serializes `env_vars`, stores a raw provider response, prints headers, or promises provider-side response redaction.
- D1 preflight queries are fixed PRAGMA/SELECT statements on known schemas and migration names. No contact/report content or data export is read. Unknown default values and SQL definitions are not printed; only metadata/classification/hashes are reported.
- The fresh restore bookmark is recorded separately. The runner never restores a database. Prefer reverting application code while retaining additive schema/data. A restore could discard later legitimate answers and requires a separate, consequential recovery decision.
- This code cannot prove a token's permissions merely from its name. Missing credentials, insufficient Pages/D1 access, shared preview binding, or missing protection rules remain real execution blockers. No setup is performed automatically.

## Local verification (no external calls)

    node scripts/check-d1-control.mjs
    node_modules/.bin/oxlint ops/d1/control.mjs ops/d1/github-gate.mjs scripts/check-d1-control.mjs

Fixtures use ephemeral Miniflare D1 and mocked GitHub/Cloudflare responses. They test migration preservation, schema/history/hash gates, preview/ref/reviewer refusal, no-write preflight, same-fingerprint apply, already-applied no-op, unknown outcome/readback failure, restore metadata, safe error projection and a mocked official Wrangler invocation. Real credentials, Environment configuration, target binding and live D1 execution remain unverified until an approved run.

## Official references

- [Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Wrangler in GitHub Actions: authentication](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [D1 HTTP writes require D1 Edit permission](https://developers.cloudflare.com/d1/platform/release-notes/#2025-05-02)
- [Pages project API: current deployment configuration](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/get/)
- [D1 migration command behavior](https://developers.cloudflare.com/d1/wrangler-commands/#d1-migrations-apply)
- [D1 current restore bookmark](https://developers.cloudflare.com/api/resources/d1/subresources/database/subresources/time_travel/methods/get_bookmark/)
- [GitHub deployment protection and secret gating](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub secret names can be listed without values, with separate Secrets read permission](https://docs.github.com/en/rest/actions/secrets#list-repository-secrets)

## Blocked preflight diagnostics

A preflight stopped by schema/history validation emits a bounded diagnostic with `applyAllowed: false` and no approval fingerprint. It reports known migration-name counts, unknown-name fingerprints (at most 20, plus a full-set hash), duplicates, and matches/missing fields for the fixed expected columns, keys, defaults, index and CHECK expressions. Arbitrary migration/column names, SQL text, default values and provider responses are not logged. The diagnostic does not authorize baselining, replaying migrations or repairing history.

Target/binding/read-only response checks still stop unsafe collection. When the migration registry lacks the fixed columns needed to read its history, preflight skips that query but collects the remaining fixed schema metadata. Apply retains the original strict checks and cannot use a diagnostic as approval.

A blocked preflight also includes a narrowly scoped forward-migration inventory. Only `solution_method_feedback`, `d1_migrations` and the two planned object names are inspected. Fixed `table_xinfo`, foreign-key and index PRAGMAs are compared to known definitions; the registry definition comes from pinned Wrangler 4.92.0. Raw names, CREATE SQL and defaults stay in memory. Related trigger/FK counts, planned-name collisions across object types, known-structure match flags and full id/name history fingerprints are reported. The inventory itself does not authorize a write: its `applyAllowed` remains false. The separately reviewed forward-only baseline below is the only additional acceptance path; past migration records must not be rewritten or replayed.

## Reviewed forward-only baseline: gemnao-forward-0004-2026-10-06

Read-only run `37528819087` verified the exact current method and migration-registry definitions, all columns (including hidden-column absence), keys, indexes, binary collations, no related triggers or foreign keys, and no planned-name collisions. Existing `issue_feedback` also passes the original strict check. The opaque history has four rows: known 0000–0002 once each and one unidentified name; 0003 is absent. This is **not** evidence that 0003 ran, and no history record is renamed, replaced or fabricated.

`reviewed-baseline.mjs` pins the reviewed inventory, full existing id/name history, both table structures and unknown-name fingerprints. All known-structure predicates must still pass: hashes alone do not approve unknown SQL. Only this exact state can obtain a fresh preflight approval fingerprint. The report includes the baseline identity and complete fixed inventory; unknown names remain hashed. Apply recollects the metadata and requires the approval fingerprint to match, then records a fresh restore bookmark before running only the unchanged hash-pinned 0004 SQL via pinned Wrangler.

Post-readback must retain the registry definition and all four old id/name pairs, add exactly one new 0004 row with a new positive ID, preserve the original method columns/keys/constraints plus only the new default-zero column, and verify the complete receipt table, CHECK literals, PK, time index and absence of extra objects/FKs/triggers. The reviewed path cannot switch to canonical history after applying. A partial or unknown outcome stops without retry. A new dispatch may report `already_applied_no_write` only after these same full postconditions pass; rerunning an apply attempt remains forbidden.

The migration adds no update/delete statements for existing answers or old history. It creates the receipt table/index and adds the method failure-count column. The only intended insert into an existing table is Wrangler's single new migration-history record. Independent fixtures exercise the reviewed controller end-to-end using a temporary module copy with synthetic pins; no dispatch option or environment variable can supply or replace production pins.
