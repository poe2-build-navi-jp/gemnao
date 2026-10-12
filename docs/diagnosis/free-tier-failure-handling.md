# Free tier failure handling

This change handles service refusal safely. It does **not** measure the remaining
quota of the Cloudflare account or promise uninterrupted access to saved shares.
It does not activate production diagnosis storage/sharing, change a billing plan,
create bindings/credentials, apply migrations, or alter the isolated QA controller.

## Runtime behavior

- D1 daily read/write quota errors return private HTTP 503 with `daily_limit` and
  `Retry-After` until the next 00:00 UTC (09:00 Japan time).
- D1 database/account capacity errors return HTTP 503 with `storage_limit`, without
  promising that waiting until the next day will resolve a capacity problem.
- Other database failures return a generic HTTP 503; provider messages and SQL are
  not returned or logged by this handler.
- The browser rejects non-JSON responses, malformed JSON and malformed success
  DTOs, including HTTP 200 HTML fallbacks. It does not retry automatically.
- Failed save/share requests do not clear input or local storage. New-share UI
  pauses and offers an explicit recheck using the same request ID and original
  snapshot. The user is told not to reload during an ambiguous save. A successful
  but lost response can therefore be reconciled without creating another share.
- A failed runtime configuration request leaves intake disabled and explains that
  existing local data was not cleared. It never silently enables storage.

## The actual free boundary

Before activation, verify that the **account** remains on Workers Free. Under
the current published limits, Workers/Pages Functions share 100,000 daily requests.
D1 shares 5 million daily rows read and 100,000 daily rows written across the
account. Other sites and QA consume the same allowance. D1's daily limit can stop
reads as well as writes; the Workers limit can stop the page before our code runs.
Free's provider-enforced refusal is the final spending boundary, not this UI.

The current create counter already admits at most 200 create attempts per UTC day.
It is not an account quota counter. The other per-operation counters are separate;
even shared GETs currently perform rate-limit writes. A stopped request also still
consumes a Worker invocation. Do not infer a remaining balance from app counters.

Only routes excluded from Pages Functions invocation receive free unlimited
static requests. The current `_routes.json` excludes the three search assets;
`ASSETS.fetch()` inside an already-invoked Worker does not remove that invocation.
This patch does not change routes or project fail-open/fail-closed settings.

## Further admission budget, not yet implemented

A future app-specific daily budget can reuse the existing rate-limit table with
one atomic conditional UPSERT before storage operations. A reservation should
include its own bookkeeping and existing rate-limit/index writes, should not be
refunded after failure, and should leave headroom for other consumers and cleanup.
Rejected requests must not produce more counter/metric writes.

Choose weights only after a finite, authorized isolated D1 QA sample captures
`meta.rows_read` / `meta.rows_written` for each route, failures and cleanup. Local
SQLite `changes` is not D1 billing metadata and does not measure index write cost.
No fixed app budget can guarantee an account-wide advance cutoff when independent
sites share the account. Do not add per-request account polling or persist every
query's usage back into D1 just to measure usage.

## Verification

- `pnpm test:diagnosis`: rules, API failure injection, UTC boundaries, current
  atomic admission limit and client protocol validation.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- `pnpm test:diagnosis:availability:browser`: synthetic loopback-only 375px/1440px
  coverage for daily/capacity refusal, HTML fallback, retained input and explicit
  same-ID recheck after a lost response. It uses no remote D1 or Cloudflare quota.
- Keep this patch separate from QA runtime flags. Passing tests does not deploy or
  enable production. Review integration with the current QA client changes first.

### Isolated browser verification

The `Diagnosis availability checks (synthetic only)` PR job checks out the exact
head commit with read-only repository permission, no persisted Git credentials,
no Environment, no secrets and no deployment steps. Playwright runs the real
components against an in-process loopback fixture. All browser requests outside
that loopback origin are aborted; diagnosis API responses are synthetic. The
fixture server also rejects every mutation and API path as a second boundary.
Service workers are disabled. No production/QA rows or account quota are used.

Only the tested source SHA, browser log and two synthetic screenshots are retained
as a short-lived Actions artifact. The fixture bundle remains under ignored
`.wrangler/`, never `public/` or `dist/`, and is not published. The ordinary Pages
preview is separate: retain its DB-less configuration and all existing closed
diagnosis/feedback gates, and check it using GET/UI only. It cannot exercise a
successful real save and must not be used for synthetic POSTs.

## Integration boundary checked 2026-10-10

The repository default branch is `gemunao`; there is no remote `main` branch.
This patch is based on `dac71d9f32c92d2d646f566846506eb2255538ac`.
The active isolated QA app is separately pinned to
`9eccca4abefae45ae83266e6800dad27e72f44f8` (PR 113), tree
`7fd2bf0f4897290e2d5a8c81d92e85205a1b0c6a`. Neither its branch nor the controller
pins, finite runtime gate, environment, credentials or database were modified.

Do not merge that QA lineage wholesale: the two trees differ in 206 files and
production includes newer repair/safety questions, local schema compatibility,
editorial content, request administration and static-search routing. QA contains
separate storage bindings, origin gates, cleanup monitoring, pending-share
recovery and consent changes absent from this production baseline.

In particular, QA PR 113 changes feedback fetch credentials to `same-origin`
together with an outer QA wrapper that strips cookies only from the exact
feedback API after authentication. Production has no such Basic gate/wrapper and
deliberately omits those credentials. Do not cherry-pick only one side of the pair.
This diagnosis failure patch therefore does not change the feedback transport.

Before any future public storage activation, reconcile and retest QA's complete
consent/pending recovery protocol (including the server owner-binding/resume
contract) with production's newer diagnosis schema, select the authorized storage
topology and verify cleanup. This patch only preserves an ambiguous operation
while its component stays mounted; it does not claim persistent recovery after
reload. The unrelated nine-file English/local work is not part of this branch.
Draft PR and DB-less preview verification do not authorize production activation
or replace the owner's outstanding QA acceptance.

## Official references (checked 2026-10-10)

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/
- https://developers.cloudflare.com/pages/functions/routing/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/
- https://developers.cloudflare.com/d1/observability/debug-d1/
