# Optional report context and game report counts — 2026-10-17

## Behavior

Two optional, single-choice fields are included in form validation, local drafts, preview, owner edits/history, review and public rendering in JA/EN/ZH/ES: whether the game worked before, and the last change before the issue (game/driver/OS update, settings, no change, unknown). Missing keys remain missing, displayed as not recorded rather than unknown. This preserves legacy stored JSON and pending-request hashes; no schema migration. The existing optional-field redaction also removes these fields, using one helper shared by staff preview and publication.

Game hubs with report-eligible articles reuse the existing entry card. An explicit “check published report count” action shows the count and check time. There is no request on page load or polling: the existing general API budget is only 128/day across the application. One check uses the existing protected public-read route (`count=true`), admission, health and rate gates. No cached HTML, CDN count or persistent browser count is used. Results are labeled as checked-time snapshots, expire after 60 seconds, and errors/stale responses never display zero or retain a previous count. Each new check reads current state, so deletion is reflected without cache invalidation. This is an on-demand count, not an automatically populated number on every page view.

Counts include report IDs, not unique owners, and are independent of anonymous votes. Only current approved revisions with a public snapshot, unexpired at the check time, and known/unblocked by the deletion ledger count. Same-owner separate reports count separately; idempotent retries do not add records. IDs-only reads are bounded by the existing 200-row store cap; overflow fails closed rather than truncating. The 20-report list limit does not truncate counts.

## Verification

- Real local SQLite and local deletion ledger: legacy retry hash, optional enums and invalid combinations, owner editing/history, redacted/unredacted publication, same-owner reports, retry stability, pending/hidden/deleted/expired/old-revision/missing-snapshot/other-game exclusion, restored deleted D1 row exclusion, and 21 reports beyond the list limit.
- Existing 32 security/persistence groups, 7 admission groups, binding/private-cache/analytics integration checks pass.
- Chromium in four languages: optional draft save/reload/preview, count interaction, stale/error/expiry handling, no automatic requests/polling, existing links and 360/1280px layout. All HTTP synthetic; no production reports submitted.
- Changed-file lint and whitespace checks pass. TypeScript passes with only the two pre-existing unavailable Playwright-package files excluded. Full production build chain passes, including static search assets and OG check (357 pages).
- Existing acceptance, monitoring, protection, cron and binding configuration unchanged. Unrelated local collector proposal files preserved and excluded.

Production deployment result is reported in the task handoff. Parent browser must verify `/reports`, localized forms and a game hub count via the usual public origin, plus referenced CSS/JS HTTP 200. Previously blocked production access from this environment is not circumvented. No test posting or deletion in production is needed.
