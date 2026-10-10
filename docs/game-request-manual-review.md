# Manual game request review and retained intake

This prepares the owner's selected manual workflow: a visitor submits a game title privately, an editor reviews it in the existing administrator screen, and the editor records adoption or a hold. Adoption means **planned research**, not publication, a promise to add the game, or completed coverage. It starts no article generator or unattended consumer.

## Explicit operating mode

Public intake requires all of:

- `GAME_REQUEST_REVIEW_MODE=manual`
- `GAME_REQUEST_MANUAL_REVIEW_READY=true`
- `GAME_REQUESTS_ENABLED=true`
- Existing DB binding and all three request tables

Production explicitly enables these three settings following the owner-approved finite test and retention decision. Preview retains its original overrides and no DB binding; it remains unavailable. `GAME_REQUEST_CONSUMER_READY` is not used to pretend that an automatic consumer exists. Unknown modes and manual mode without readiness fail closed. The old automatic mode remains available only under its prior consumer-readiness requirements; absent mode preserves that compatibility.

In manual mode the dedicated automation endpoint is unavailable even with a valid future consumer token. Owner manual PATCH accepts only the bounded `review` action; automated claims and publication status mutations are not accepted through that mode. Existing cookie login, its eight-hour browser lifetime, permissions and authentication configuration are unchanged.

Turning `GAME_REQUESTS_ENABLED` off stops new intake while allowing the owner to finish reviewing the backlog. Turning manual readiness off disables manual decisions too. Do not switch to automatic mode or configure a credential as a fallback.

## Owner screen and storage

Use `/admin/game-requests`, with the existing administrator login from `/admin/discord-servers`. Do not enter a management key in chat, source files or logs. If the existing login is unavailable, stop and arrange a supported owner sign-in; this change creates no new key or access.

The list is private and uncached. Game titles are untrusted React text, never commands, HTML, public GitHub issues, or publication instructions. Public intake still requests only game title and locale, warns against personal/contact information, rejects common contact/URL formats, uses a honeypot, and stores only daily salted abuse fingerprints rather than raw IP addresses. Validation cannot prove a submitted title contains no personal information; keep it private.

Manual decisions reuse existing schema:

- Adopt → `researching`, displayed as 採用（調査予定）; clears a previous hold reason.
- Hold → `held` with fixed reason `retry_later`.
- Only `received`, `held`, and `researching` rows without an active lease may change. Published/covered/rejected or other pipeline stages cannot be overwritten.
- PATCH contains request ID, selected decision and expected update timestamp only. No title or free-text note is sent.
- The update uses an atomic timestamp comparison. A concurrent/replayed/old-tab decision or live lease returns 409; refresh before deciding again. Timestamps advance even within the same millisecond.
- Thirty authenticated review attempts per minute are admitted atomically. The constant manual namespace is separate from visitor daily quotas and automatic consumer accounting. No schema or migration-history changes are required. Ongoing manual intake preserves requests without automatic deletion. Existing rows count toward a fixed 500-request capacity; admission checks it atomically and returns unavailable (503) when full. Adoption/hold does not free storage; owner review remains available while public intake is full. Existing attempt/salt cleanup after 48 hours stays unchanged, including manual review-rate accounting cleanup. No new stored fields are introduced. Automatic mode retains its legacy 90-day request cleanup.

## Verification

Run existing public/API/consumer tests and the new manual suite:

```
node scripts/check-game-request-manual.mjs
node scripts/check-game-request-api.mjs
node scripts/check-game-request-consumer.mjs
node scripts/run-game-request-client-check.mjs
node scripts/check-game-request-integration.mjs
```

The tests use synthetic local Miniflare/D1 data. They do not prove live owner login, production submission, browser interaction with production data, or operational review capacity. Preview retains no production DB binding; an unavailable form on a DB-less preview is expected. Verify the admin UI separately using local fixtures and review the preview HTML/assets without submitting production requests.

## Proposed finite activation test — requires separate owner approval

The finite test was completed on 2026-10-10 and its temporary settings were restored before ongoing manual intake. No part of this procedure authorizes another production submission. The separate `manual-validation` mode is prepared specifically to avoid any existing retention deletion during the test.

This mode uses the same public route, input rules, origin/IP checks, durable receipt, deduplication, visitor quotas and owner authentication. It is not a hidden endpoint or an authentication bypass. It additionally requires `GAME_REQUEST_VALIDATION_FROM` and `GAME_REQUEST_VALIDATION_UNTIL` as canonical UTC strings (`YYYY-MM-DDTHH:mm:ss.sssZ`), with a positive interval of at most five minutes. Missing, malformed, future, expired or overlong windows fail closed. Both the application and the atomic D1 admission statement check the time. Once the deadline passes, new requests are refused even if a rollback deployment is slow. An operation already admitted during the window may finish afterward.

In `manual-validation`, neither public intake nor manual review-rate accounting includes DELETE statements. Expired existing requests, attempts and salts remain untouched. The test can create its necessary new request, salted daily identifier and accounting records, and update only the exact approved test row through the existing owner screen. Readiness and authentication still gate owner actions after intake expires. Ongoing `manual` mode retains requests subject to the 500-row cap, with existing 48-hour ancillary cleanup; `automatic` mode keeps legacy retention.

1. Verify the exact deployed commit, existing owner login and private queue read, and current schema compatibility. Select a supported configuration path preserving unrelated production settings and preview isolation; a reviewed Wrangler configuration change uses the existing Git-integrated deployment without visiting the Cloudflare dashboard. No new credential, permission change, DB, or unrelated QA workflow is included.
2. Ask the owner to approve the exact destination (`https://gemnao.pages.dev` / existing `gemnao-db`), `GAME_REQUEST_REVIEW_MODE=manual-validation`, `GAME_REQUEST_MANUAL_REVIEW_READY=true`, `GAME_REQUESTS_ENABLED=true`, explicit UTC start/end within five minutes, one normal request for an already covered confirmed game, and adopt/hold decisions for that exact new row. Disclose that real visitors might submit during the public window; those rows remain private and are not processed by the test. No deletion is authorized or performed in this mode.
3. Before opening intake, privately check that the chosen test game has no existing queued request. If present, do not repurpose that row; choose another owner-approved case or stop. Do not add a test-only URL, magic header or exemption.
4. After the reviewed settings reach the expected deployment and the window opens, submit exactly one approved title through normal ingress. Require a durable 201 receipt and locate its exact new row privately. A duplicate, timeout, unexpected response or inability to identify the exact new row stops the test; do not retry the submission automatically. A late deployment may miss the window safely; do not extend it or dispatch another change without approval.
5. Set `GAME_REQUESTS_ENABLED=false` using the separately approved configuration rollback and confirm public GET unavailable; regardless of deployment timing the server deadline closes new intake. With validation-mode manual review still configured, adopt then hold only the exact test row, checking fresh timestamps and persisted states. No article is created or published. Keep the held test row; deletion is excluded.
6. Review evidence and any genuine visitor rows privately with the owner. Only then seek a separate sustained-intake decision covering a named reviewer, practical review cadence and retention policy. No free-tier assumption, constant polling or automatic publishing is introduced.

If a supported configuration path, existing login or required authorization is missing, stop before opening intake. A read-only schema inventory and merged code alone do not establish readiness.
