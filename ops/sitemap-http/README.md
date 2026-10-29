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
