# Pages tail capability check

Base d43dabe221044c9e558b70cdae21d5c10a9a0178.
No site, sitemap, routing, D1, authentication or permission changes.

Manual workflow `Pages tail access check`, file `pages-tail-access.yml`, branch
`gemunao`, first attempt only, no inputs. Reuses and rechecks existing environment
`gemnao-d1-production` reviewer and branch protections; approval is not automated.
Existing Cloudflare secret is injected only into the protected GitHub job.

After two GitHub protection GETs, checks the fixed Pages project and pinned
production deployment 9f78778f-8f9d-4651-818d-9c550909c5db (72ac318b78183bbc209e8f244e9dbb04003e84ae).
If unchanged, POSTs one deployment tail, then immediately DELETEs that exact tail.
No WebSocket is opened, no log event received. This establishes session permission
only, not stream connectivity, Google requests or static asset log availability.
Tail is a temporary logging session, not a new persistent credential or role.
No automatic expiry duration is assumed; deletion must be confirmed.
On ambiguous create or delete outcome: report unknown and stop, never retry.
If interrupted after creation, cleanup may be unknown; do not claim removal.

Only fixed status/boolean fields are printed. Response URL, session ID, provider
errors, config, cookies, IPs and all raw logs are neither printed nor saved.
No artifact, debug logging or dependency installation. API redirects forbidden.
Cloudflare calls each timeout after 10 seconds, no retries. Pages Write is required
by the official tail API; 403 means stop, not grant permissions or issue tokens.

References:
- https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/subresources/tails/methods/create/
- https://developers.cloudflare.com/pages/functions/debugging-and-logging/

Shared-branch merge and one dispatch require specific approval. Keep
`[CF-Pages-Skip]` in any future push/merge commit and inspect existing triggers;
this marker is not permission to merge. Do not dispatch again after an uncertain outcome.

Test: `node --test tests/pages-tail-access/check.test.mjs`
