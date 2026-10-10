# Game request metadata inventory (prepared, not executed)

This independent manual workflow prepares a read-only inventory for the dormant game request feature. It does not extend the existing step-result `0004` controller, change its approval, run a migration, activate intake, configure a consumer, or claim operational readiness.

## Scope and safeguards

- Fixed repository `poe2-build-navi-jp/gemnao`, branch `gemunao`, Pages project `gemnao`, and existing `gemnao-db` identity.
- Only `workflow_dispatch`, first attempt; no schedule, pull-request trigger, arguments, alternate targets, arbitrary SQL or apply mode.
- First verifies that the existing `gemnao-d1-production` Environment requires reviewers and allows only the production branch. Missing/inaccessible protection stops the run. No environment or permission settings are created or changed.
- The inventory job then waits for the existing GitHub Environment approval and rechecks protection immediately before any Cloudflare call. The owner performs any approval; preparing this workflow is not permission to approve, merge or execute it.
- Uses the existing `CLOUDFLARE_API_TOKEN` only inside the protected job. No new credential is created or requested; missing credentials or insufficient scope stop the run. Do not widen access automatically.
- Checks the current Pages source, successful production deployment, production D1 binding, preview isolation, and D1 identity before queries.
- Fixed metadata queries inspect only three game-request tables, their indexes/foreign keys/triggers, and the migration registry structure and id/name history. No request names, visitor submissions, salts, fingerprints, rate-accounting rows or other application rows are read.
- There is no database mutation. D1 query HTTP POST is the provider's query transport; the statements are fixed SELECT/PRAGMA reads. Each response must explicitly say `changed_db: false`.
- Public logs contain fixed labels, numeric counts, booleans, deployment SHA and metadata fingerprints. Raw DDL/defaults, arbitrary identifiers, migration filenames, provider error bodies and credentials are not printed. No artifact contains raw metadata.
- Uses the existing production D1 concurrency group without canceling an in-progress job. Does not approve, retry, cancel or replace existing runs.

## Validation before proposing a run

From the repository root:

```
node scripts/check-game-request-inventory.mjs
pnpm exec oxlint ops/game-request-inventory/control.mjs scripts/check-game-request-inventory.mjs
```

The test uses local in-memory SQLite and synthetic HTTP responses, never Cloudflare. It checks fixed queries, source/binding/preview identity, reviewer protection, branch policy, rerun rejection, missing credentials/registry, fail-closed changed-db responses, and report redaction. It prints local staged-schema fingerprints for comparison only. Fingerprints are sensitive to schema representation and SQLite metadata version; a mismatch is a review signal, not authorization to migrate.

The queries are sequential, not an atomic schema snapshot. Existing reviewer presence does not establish independent approval or secret provenance. Results are diagnostic only.

## Owner-controlled use after separate review and publication

1. Review the exact commit and merge/deploy only with the required authorization. Preparing a draft PR does not execute this workflow.
2. When a one-time run is explicitly approved, select `Gemnao game request metadata inventory` on branch `gemunao`. There are no inputs. Do not run the unrelated D1 apply workflow.
3. The owner reviews GitHub's protected-Environment approval if requested. Never approve on their behalf. Gate access denial requires review, not a weaker gate or a replacement credential.
4. Read the sanitized job summary. A missing table, unexpected trigger/index/column, unreadable registry or fingerprint mismatch requires investigation and an exact separately approved forward-only plan; do not replay staged SQL or invent a migration-history entry.
5. Stop after the inventory. Acceptance flags, consumer credentials, user-submission tests and sustained activation remain unapproved and unchanged.

If the run is denied, canceled or incomplete, do not dispatch or rerun automatically. Report the blocker and request direction. A failed preparation or inventory does not establish that any production data changed or that intake can safely open.
