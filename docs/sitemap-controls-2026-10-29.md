# Temporary sitemap ingestion controls

This is evidence gathering, not a permanent SEO fix. GSC ingestion still reports
failure despite a successful real Google Inspection fetch and 19 successful
HTTP observations from GitHub Actions. Do not infer a Google-side root cause.

Two stable root-level files are generated **after** Vinext prerendering by
prepare-pages.mjs, alongside the canonical sitemap:

- https://gemnao.pages.dev/sitemap-diagnostic-copy.xml — exact canonical XML bytes.
- https://gemnao.pages.dev/sitemap-diagnostic-minimal.xml — only the existing root
  canonical https://gemnao.pages.dev/; no invented lastmod.

The canonical sitemap registry, its 495 URLs, robots, redirects and headers are
unchanged. Neither control is advertised in robots, sitemap, or article links.
Both paths bypass the Worker through _routes.json, exactly like sitemap.xml;
explicit Worker ASSETS fallback is retained too. No app route, HTML renderer,
custom XML header override, credential, database or security setting is added.
Actual edge response equivalence must still be checked after approved deployment.

Before merging: review the draft PR and run review:index, typecheck, lint, build,
check-locale-indexing.mjs, check-static-search-assets.mjs and
`python3 tests/sitemap-controls/check.py` against the generated output.
Current reference canonical SHA-256:
`d3d0899c8eec0e8aa2501236eaf5508b1c6e030f23c3e9c28e36ed345b85505b`
(52,696 bytes / 495 URLs). Compare this before deployment; do not silently change
article scope to make the experiment pass.

After parent review and approved deployment: confirm both fixed URLs return 200
XML, compare copy hash with the unchanged canonical, record headers and timestamps,
then submit each control once in the same GSC property. Record submission and actual
read times separately. Do not repeatedly submit or remove the existing sitemap.

Interpretation (hypotheses, not proof):
- Copy succeeds: identical XML can be ingested on another path. URL-specific
  state or timing becomes more plausible; this does NOT establish a cache defect.
- Minimal succeeds but copy fails: content/size/URL-set-related behavior merits
  investigation. It does NOT prove malformed XML; scheduling remains a confounder.
- Both fail: source/network/host/ingestion conditions remain unresolved.
- Both succeed or original recovers: compare read times before claiming a fix.

No automatic GSC submission. No new public URL variants per retry. Keep the
canonical unchanged during the observation window. After evidence review, agree
on retirement of only these temporary controls in a separate reviewed change;
no automatic deletion or expiry is installed.

Local validation on base c99085f0aa10fa8ebf189ef51c13eabcf195e6d9:
review:index (no tracked index diff), typecheck, lint, full build, locale indexing,
static assets, and the dedicated Python assertions all passed. Canonical output
retained the reference hash above; copy is byte-identical; minimal is 158 bytes.
Installed dependencies were reused locally. pnpm used
`--config.verify-deps-before-run=false` to avoid its automatic install preflight
failing on this executor's missing pnpm home; no checks were disabled.
No deployed response or GSC ingestion result exists for these controls yet.
