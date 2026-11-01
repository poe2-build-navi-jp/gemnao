# Public sitemap HTTP diagnostic

Manual-only public requests; PR checks use synthetic inputs only. No package install,
credentials, arbitrary URL input, Cloudflare API, deployment, database or GSC writes.
The runner token is contents:read and checkout does not persist it.

At most 19 requests, sequential with a 3-second interval, 20-second curl timeout,
25-second process timeout and 2 MB body cap. curl decodes the transfer encoding;
compare decoded SHA-256 and actual Content-Encoding, not just requested encoding.
GET compares ordinary, Googlebot desktop/mobile and Inspection UA strings over
identity/gzip/br. HEAD, robots (three UAs), image sitemap, and conditional ETag
matching/nonmatching are separate probes. Conditional probes require a valid ETag.
401/403/429 or transport failure stops the experiment without alternate probes.
Redirect status/Location are retained; redirect targets are never followed.
Only allowlisted public response headers are printed; no cookies or raw curl errors.

These are GitHub runner requests with UA strings, NOT real Google traffic. Matching
results cannot establish GSC ingestion or exclude differences in Google source IP,
edge location, historic robots fetch/cache, or Google's processing. HEAD is a
comparison, not an assertion that Google uses HEAD to ingest a sitemap.

Before publication, use `[CF-Pages-Skip]` at the start of both branch and merge
commit messages to omit Cloudflare builds without changing configuration:
https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message
Do not use `[skip ci]`, which would suppress GitHub checks. Existing deployment
workflows are not changed. Dispatch once on gemunao after PR review and merge;
re-runs of the same run are excluded. No schedule or automatic public probe.

Tests: `python3 -m unittest discover -s ops/sitemap-http -p 'test_*.py' -v`
Read `sitemap-http-result.json` in the run artifact and per-observation Actions log.
A successful job establishes only the reported HTTP/body checks; inspect matching
ETag responses (200 can mean validator ignored; 304 has no body to hash).

## Transport follow-up (2026-10-31)

The `transport` choice is the new manual default; the original matrix remains
available explicitly. PR events still run only offline tests. No schedule added.

At most six Desktop GETs to the existing canonical sitemap: IPv4/IPv6 × requested
HTTP/1.1/2, then IPv4/HTTP1.1 matching and nonmatching ETags if the baseline returned
200 plus a safe ETag. Identity encoding keeps compression constant. Every request
has the same 20-second curl/25-second process/2 MB bound and three-second spacing.
No arbitrary inputs, redirects, retries, auth, or extra public control request.
401/403/429 stops the matrix; DNS/connect errors are recorded per address family.
Local IPv6 default-route presence is collected without contacting another host.

The original matrix did collect ETag and Cache-Control when present (allowlisted
case-insensitively), but its raw headers were temporary and not uploaded. Therefore
its recorded 304 omissions require a fresh raw-header comparison, not a claim that
raw historical headers were inspected. The follow-up records header order/casing,
status blocks and duplicates; only sensitive headers/continuations are redacted.
Actual remote IP, HTTP version, TLS verification/handshake timing and CF-Ray accompany
each result. HTTP/2 negotiation fallback and missing IPv6 connectivity are explicitly
measurement limitations. TLS is not marked verified solely because curl reports 0
when no connection occurred. Artifact schema preserves all failed observations.

A successful follow-up job means diagnostic collection completed, NOT that all
network paths passed. Inspect `measurement`, actual protocol, status, raw headers
and hashes. RFC 9110 §15.4.5 requires ETag/Cache-Control on a 304 when they would be
sent on a 200. Reproducing their omission is not proof of the GSC pending cause:
real Google conditional request/response evidence is still missing.
