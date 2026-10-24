# Private form-inbox notification candidate — not deployed

Base: 5af675db9227f5059370f3828b5e0d2e5825e76c. Local preparation only.

## Scope and current state

Only D1 contact form submissions and Discord listing applications. Direct email sent to the public contact address is a separate mailbox and is not covered. No recipient has been selected. No actual credential, OAuth, permission, remote deployment, email, scheduled task, migration or database mutation has been performed. Both configuration keys are absent, so the endpoint defaults to 404.

`GET /api/private-inbox/notifications` uses the existing `DB` binding. It does not import the Discord helper, whose ensureSchema can write DDL. One SELECT reads only COUNT/MAX(id) scalar metadata from the two existing tables. No body, title, owner identifier, email, invite URL, status or row ID is returned. Missing schema/database produces a generic 503, never creates tables. No backend checkpoint/rate/cleanup writes occur. Authentication itself does not access D1.

The server requires the exact production origin, GET, an independent Bearer token (no admin cookie or key fallback), and no query string, browser Origin/Sec-Fetch-Site or Cookie. Responses are no-store/noindex and omit CORS. The optional encrypted and authenticated `X-Inbox-Cursor` header contains private high-water positions. Cursor encryption uses a domain-separated key derived from the server verifier; key rotation invalidates old cursors. Neither cursor nor credential belongs in a URL, public log, email or chat.

First read returns baseline=true, zero counts and a cursor, without notifying historical submissions. Subsequent reads return `{version, baseline, cursor, counts:{contact,discord_listing}}`. New means successful new row insertion, including synthetic tests if they occur after the baseline; it does not mean unread/pending. State changes do not increment counts. Deleted records are not recoverable by polling; IDs rely on the existing AUTOINCREMENT schema. No retention or schema changes are introduced. Intentional restoring/replacing a DB requires re-baselining after review.

## Reuse comparison and realistic delivery path

The unmerged Windows diagnostic candidate already has a private Apps Script design: independent token, hourly fetch, LockService, Script Properties checkpoint, intent-before-send, fixed generic self-email, and a Gmail-event bridge. Reuse that owner-private runner pattern rather than add another notification service. Its existing endpoint cannot simply be reused: it reads diagnostic notification-state tables and requires a migration; these two existing inbox tables can instead be read without any migration.

Current tools provide no established Cloudflare connector or scheduled generic HTTP reader with securely injected per-request Bearer credentials. GitHub fetch is not a general HTTP client. A temporary signed-in admin browser is neither a persistent connection nor a notification credential. Code alone therefore cannot create a reliable ChatGPT task that reads this endpoint. No automation was created.

Concrete proposed route, still requiring approval/setup: one owner-private Apps Script hourly poll -> fixed generic owner email -> connected Gmail event -> this conversation. No mailbox-reading OAuth scope is needed in Apps Script (send_mail plus external_request only); Gmail event access uses the existing connector separately. The public contact mailbox and connected Gmail may differ, so resolve and explicitly approve the intended recipient; do not infer it. Direct contact emails need their own mailbox access and are not covered by this API.

Do not copy the old diagnostic script unchanged: adapt its response validation to the exact keys above and send only a fixed category/count message with static admin links, never cursor or contents. Hold the script lock, baseline first, then on counts>0 persist a PENDING batch before sending. Only after a completed mail call advance LAST_CURSOR and clear PENDING. Any uncertain send or checkpoint failure blocks later sends until the owner verifies delivery; never automatically resend. A repeated old cursor repeats the same logical batch, so the API alone is not a deduplicating delivery service. This favors avoiding duplicates over guaranteed delivery. Hourly polling is not an instant webhook; MailApp completion is not proof of Gmail or ChatGPT delivery. After approval of this route, a separate default-OFF runner candidate was prepared in ops/private-inbox-notify; no project or credentials are configured.

## Exact future setup (approval required)

1. Review and approve deployment of only this endpoint to the existing Gemnao Worker, remaining OFF. No binding, schema, cron or admin-permission changes.
2. Approve a dedicated revocable notification read credential and its storage: raw 32-byte random token encoded as hex only in the owner-private Apps Script `NOTIFY_READ_TOKEN` property; SHA-256 verifier only in the existing Gemnao Worker's encrypted secret `INBOX_NOTIFY_TOKEN_SHA256`. Script Properties are visible to project editors, so keep the project private. Do not use repository vars, URLs, chat or admin keys. No real value is generated by this candidate.
3. Approve the exact owner Gmail recipient, the private Apps Script project, Google send_mail/external_request continuing scopes and hourly trigger. The Google permission itself is not recipient-limited; the reviewed code must fix the recipient. Owner performs OAuth. No custom domain required by this proposed route.
4. Separately approve turning `INBOX_NOTIFY_ENABLED=true`, credential-only metadata baseline, then a bounded synthetic form submission and fixed test email. Test insertions are writes and need separate approval; do not quietly submit them. Verify the same-account Gmail event actually arrives in this conversation before claiming operational notification. Initial baseline excludes existing backlog; reviewing backlog is a separate action.
5. Stop with server flag false; revoke by deleting/changing the verifier. Stop/remove the Apps Script trigger and revoke Google scopes as needed. Uncertain pending batches require owner review rather than automatic replay.

One specific approval-ready next decision: permit the existing Gemnao deployment plus independent read credential/private Apps Script setup described above, after confirming the exact owner recipient. Keep notification sending OFF until the explicitly approved end-to-end test. There is no need to read the management key or grant DB-write access to the consumer.

## Limitations and verification

Read-only means no application DB changes, not zero provider resource usage. Existing DB permission at Worker level remains broader than this SELECT-only handler. A leaked token permits repeated aggregate reads; no persistent rate limiter is added because that would write state. Provider quotas and polling costs still apply. Public metadata is never exposed without the separate credential.

Synthetic tests verify OFF/auth/method/origin/query gates, no DB before auth, opaque authenticated cursor, baseline/deltas/replay, deletion without rewind, redacted errors, no CORS/cache and execution of exact SQL under SQLite's write-denying authorizer. No private records or operational credentials are in tests. Actual Cloudflare D1, Google OAuth, Gmail arrival, conversation delivery and iOS Apps Script editing are unverified.

Local validation completed: production build, TypeScript noEmit, scoped oxlint, synthetic notification checks and git diff --check passed. Initial preparation was local only. Subsequent code publication was approved separately; runtime setup and end-to-end delivery remain pending.
