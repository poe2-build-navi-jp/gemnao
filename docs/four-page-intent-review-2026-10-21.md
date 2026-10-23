# Four-page intent and safe troubleshooting review

Base: `e1121179f48c2646e48ae469bb38569321d6b238` fetched from `origin/gemunao`; initial work tree clean. Read AGENTS.md and CLAUDE.md. Isolated branch `improve-four-pages`; no quality-kit changes imported.

## Initial findings and plan

GSC 2026-10-12–18 versus 10-05–11: Steam 39.2→43.7 (13 impressions/0 clicks); crash 10.8→32.2 (5/0); directory 22.9→34.1 (19/1); mic 9.6→12.3 (7/0). Samples do not establish a cause; ranking or traffic gains are not guaranteed.

Existing symptom tables, internal links, titles and H1 already match the intended topics. Preserve them and shared templates. Shorten Steam/crash conclusions, make safe first attempts clearer, avoid blanket optional framework updates, clarify mic test controls and support escalation, and distinguish the site's approved listings from Discord's directory. Preserve step IDs/order, URLs, metadata wiring, translations, diagnostics, saving and feedback.

Directory query only exposes approved submissions with valid invites. Empty/error states already differ. Live listing count cannot be inferred: GET https://gemnao.pages.dev/api/discord-servers failed with CONNECT proxy 403. Do not manufacture listings or assert zero. No DB or settings changes.

## Source review

Reviewed 2026-10-21 (documentation review, not physical device testing):
- https://help.steampowered.com/en/faqs/view/5814-D9A3-BE42-62DF — official search extract confirms restart first. Direct web extraction has only an image; shell retrieval CONNECT 403, so full current text unverified.
- https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB — official search extract confirms Installed Files / Verify integrity. Direct extraction only image.
- https://help.steampowered.com/en/faqs/view/3A2A-BF2D-15FF-7963 — official search extract confirms missing/blocked executable, restart then verify. Direct extraction only image.
- https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows — current Windows tools and event details.
- https://support.microsoft.com/en-us/windows/hardware/drivers/fix-microphone-problems — Windows 11 test/playback/input volume and Windows 10 level settings.
- https://support.discord.com/hc/en-us/articles/360020641332-Mic-Testing — Voice section, Let's Check / Stop Testing, desktop/browser, test mutes call audio.
- https://support.discord.com/hc/en-us/articles/360045138471-Discord-Voice-and-Video-Troubleshooting-Guide — input/output selection, individual volume, processing and support.
- https://support.discord.com/hc/en-us/articles/25323248535319-Discover-Tab — conditional availability, desktop search/mobile categories. Different from the ended Server Discovery experiment at https://support.discord.com/hc/en-us/articles/360023968311-Server-Discovery .

Publication was subsequently authorized for these four pages via the parent transcript. Existing production branch flow is push to gemunao → Pages. No configuration changes or URL submissions authorized.

## Validation and boundaries

- Final package-equivalent production build PASS: 609 HTML snapshots, 591 sitemap URLs, static search checks and 536 OG cards. Titles were retained; no OG regeneration needed. Literal `pnpm build` could not start (existing ENOENT `/home/agent/.local/share/pnpm`); used installed vinext and exact package post-build scripts without installing/upgrading dependencies.
- Changed-file oxlint and diff whitespace checks PASS. Localization PASS: 340 translations with source/step parity. An added Discord support source initially failed source-array parity and was removed; the final sources retain existing parity.
- Repository-wide tsc: 19 existing diagnostics from missing `@playwright/test` and dependent implicit-any browser-test parameters. Repository-wide lint: 29 existing diagnostic lines (unchanged directory hooks/accessibility and test types/promises), matching the prior ST review environment. No diagnostics in the four edited application files.
- Local production Chromium, three articles × 375/1440: HTTP 200, single H1, canonical/OG metadata, fragment targets, saving, no overflow or JS exceptions. APIs intercepted locally; no actual answer submissions. Final viewport captures after the final build PASS.
- Directory cannot render in Node (`cloudflare:workers` D1 import, HTTP 500, existing limitation). Bundled the actual full page for local SSR with only its DB reader replaced by empty/error fixtures; both states at 375/1440 PASS. These screenshots do not verify live listings or D1. No fabricated server fixture or DB mutation.
- Preserved behavior regression: 14 diagnosis/weekly scenarios (loading, running, stopped, network/HTTP/invalid/late timeout, JST weekly rollover in four languages); STEP result UI and feedback deadline tests PASS.
- A supplemental ST browser run overlapped a build that replaced assets and failed an overflow assertion. Restarted production preview after final build and repeated it; see final result below.
- Screenshots visually inspected: Steam mobile, crash mobile, microphone desktop, directory empty mobile. Full page plus viewport captures and local directory HTML: `/workspace/scratch/four-page-evidence/`.
- Existing URL/title/H1/canonical/hreflang, shared conclusion/CTA templates, STEP identities, diagnosis, saving, feedback, weekly date logic, DB, settings, external services and dependencies unchanged. English/zh/es source files unchanged.

Logs: `/tmp/four-build-final.log`, `/tmp/four-types.log`, `/tmp/four-lint.log`, `/tmp/four-localized.log`, `/tmp/four-browser-viewport-final.log`, `/tmp/four-directory-viewport-final.log`, `/tmp/four-preserve.log`, `/tmp/four-st-final.log`.

## Publication verification limitations

The previous published SHA's Cloudflare Pages check was independently confirmed through the GitHub connector: success, deployment `c07ba150-b141-4658-b3f8-8ec8981f5a48`. Shell GitHub REST returns Forbidden; connector GET succeeds. Public Pages HTTP access from this execution environment returns CONNECT proxy 403. New deployment status and public rendering must be reported separately; neither successful build nor push proves public rendering.

Final ST regression PASS: Japanese/English × 375/390/430/1440, first-action CTA, saved state, cumulative count fixtures, SEO, references and no horizontal overflow.
