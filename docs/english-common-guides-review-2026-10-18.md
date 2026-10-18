# English common guides and ST-3100001 review — 2026-10-18

Status: prepared locally; publication requires approval. Base: `929e9bf2cfaefbb1eccfc0abfc59a55c6520a9d5`.

## Scope and demand

Added English editions of existing Japanese guides:

- `/en/guide/steam-game-not-launching` (priority): distinguish no response, missing executable, immediate exit and an external launcher login; reversible checks, save protection and a next action for each result.
- `/en/guide/stutter-fix` (second topic to evaluate): same-route comparisons, one frame limiter, first versus repeat visits and session/loading differences. Does not promise a universal FPS target or a guaranteed shader-cache fix.

Parent-provided GSC sample (55 disclosed queries) contained no English launch/stutter/FPS queries. Three Japanese Steam launch queries each had one impression and no clicks. Parent-provided GA for the Japanese Steam guide, September 20–October 17: 44 page views, 23 active users, 2m03s engagement per active user. This supports testing complementary English navigation, not a claim of proven English demand or high search volume.

The existing English Wilds article and crash guide link to both additions. English home cards and local search include them. Canonical, reciprocal Japanese/English hreflang, sitemap, article schema, static snapshots and two generated OG images are included. No Chinese or Spanish translation is invented. STEP IDs match the Japanese originals (four and three respectively); anonymous result contexts and topics remain shared.

## Sources checked

Procedures were checked against official documentation; symptom grouping and comparison order are editorial guidance. No hardware success testing is claimed.

- [Steam launch failures](https://help.steampowered.com/en/faqs/view/5814-D9A3-BE42-62DF)
- [Steam file verification](https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB)
- [Steam download cache](https://help.steampowered.com/en/faqs/view/6AD7-820D-8BE5-E51F)
- [Steam performance monitor](https://help.steampowered.com/en/faqs/view/3462-CD4C-36BD-5767)
- [Microsoft system tools](https://support.microsoft.com/en-us/windows/experience/system-configuration-tools-in-windows)
- [Microsoft protection history](https://support.microsoft.com/en-us/windows/security/windows-security/protection-history-in-the-windows-security-app)
- [Microsoft refresh rate](https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows)
- [NVIDIA 3D settings](https://www.nvidia.com/content/Control-Panel-Help/vLatest/en-us/mergedProjects/nv3d/Manage_3D_Settings_(reference).htm)
- [AMD graphics settings](https://www.amd.com/en/resources/support-articles/faqs/dh3-012.html)

## Validation

An isolated copy excluded the pre-existing collector proposal and its two modified files.

- Production flags, full prerender build: passed. Pages preparation: 440 editorial snapshots, 419 sitemap URLs, 21 image-sitemap pages.
- TypeScript full validation: passed, using the environment's installed Playwright type mapping.
- Changed-file lint and diff whitespace: passed.
- Existing localized renderer/parity check: 192 translated pages passed; extended to check both guides' STEP IDs, symptom links and real language alternates.
- English generated-HTML check: seven English/Japanese pairs and 345 internal links/anchors passed. Corrected the checker to recognize the existing locale-validated dynamic reports route; no application route was changed for this correction.
- Static search assets and OG freshness: passed; 359 OG cards, two new cards generated.
- Local production browser: both new guides and both ST article languages at 375px and 1440px: HTTP 200, one H1, no horizontal overflow, no broken fragment links or page exceptions. English result submission failure, retry and next-step links passed with intercepted synthetic requests.
- ST additional state checks at 375px: small-sample counts and unavailable counts behaved as expected in both languages. Japanese failed submission and retry used the same request ID. All external traffic and real API calls were blocked/intercepted; no live votes or GA events were generated.

## ST-3100001 audit and analytics interpretation

The current Japanese/English article source separates the publisher's general connection-loss explanation, first clock-sync check, player reports and dated announcement history. This review checked that presentation and local interaction, not a new complete audit of the publisher's announcements. No concrete ST article defect was reproduced, so its text and UI were left unchanged.

`step_result_saved` already existed in `beca489` (October 14). `cabe45d` added the STEP dimension to saved events and introduced `step_result_controls_viewed` and `step_result_failed`. Do not describe all three as newly introduced on October 18. Historical saved totals have no STEP dimension; there is no earlier viewed-event denominator for a before/after conversion comparison. GA event users and D1 anonymous response counts are different measures.

The parent reported one Japanese saved event/user and one related-article-opened event/user during October 11–17. The absence of current-day STEP event rows at 18:08 JST can reflect processing delay, small samples and time before rollout. It does not establish zero participants or ineffective content. No further event taxonomy or UI change was made based on those samples.

## Publication boundary

No push, deployment, IndexNow submission, GSC resubmission, credentials, D1 writes or unrelated collector changes are included in this work. Review and approve publication of these two guides before pushing the commit to the production branch.
