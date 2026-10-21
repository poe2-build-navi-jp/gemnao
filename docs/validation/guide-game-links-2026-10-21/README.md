# Guide game recommendations — 2026-10-21

Base: origin/gemunao `63a5b639e41711ad3c2b44a26109593664d30639` (fetched before implementation and rechecked before publication). Steam Input, Aniimo and Onimusha edits are preserved. AGENTS.md and CLAUDE.md read; this checkout has no .agents/skills directory.

## Cause and scope

The Japanese common-guide template inferred a broad category from the URL, then took the first five articles in that category. Steam Cloud fell into `launch`; stutter/shader/VRAM mixed `display` and `settings`. Even the seven existing symptom-specific lists were padded with unrelated category articles.

`lib/guide-game-links.ts` now owns reviewed, ordered article paths, resolves actual published articles and game hubs, and returns no candidates for unknown guides or absent/draft/thin targets. No category fallback. All 28 Japanese common guides use it; ten without a reviewed match omit the section. Existing seven symptom-specific lists retain their candidates. Other reviewed mappings retain appropriate save, FPS, controller, MOD and configuration navigation. Add new candidates explicitly after reviewing their symptoms.

Requested pages:
- stutter: Monster Hunter Wilds FPS, Elden Ring FPS, Dawnwalker stutter, Ace Combat 8 stutter/audio.
- shader: Onimusha shader.cache rebuild, Dawnwalker shader-compilation crash.
- VRAM: Aniimo video-memory error only.
- Steam Cloud: Stardew Valley save restoration (explicit cloud-overwrite step), Palworld save restoration (local/cloud conflict and progress verification).

Only the Japanese template consumes the selector, so candidates use existing Japanese routes and titles. `/[locale]/guide/[slug]` uses separate translated editorial data/templates and remains unchanged. No body, general next-guide section, URL, reception, database, authentication, billing or deployment configuration edits.

## Verification

- `node scripts/check-guide-game-links.mjs --built`: 28 guide mappings; stable order despite reversed article source; actual published targets; unknown/no candidates/missing/draft/thin cases; built HTML section absence; exact built links; every general next-guide link unchanged.
- `node scripts/check-onimusha-save-answer.mjs --built`: passed, including Japanese/English preserved save navigation and metadata.
- `pnpm --config.verify-deps-before-run=false build`: passed; 609 editorial snapshots, sitemap 591 URLs, search assets and 536 OG cards checked.
- `pnpm --config.verify-deps-before-run=false check:localized`: passed, 340 translated pages.
- `tsc --noEmit`: passed, both change and isolated baseline worktree.
- Full `oxlint`: same ten pre-existing errors on baseline and change (Discord directory hooks/accessibility and feedback-stats-d1 floating promises). Logs are identical. Changed-file lint passed.
- Environment setup: pnpm 11 attempted auto-install into an unavailable home directory; disabling verify-deps-before-run used the installed dependency tree. The preinstalled tree omitted declared @playwright/test; installed exact declared 1.63.0 under /tmp and linked it into ignored node_modules. Re-ran baseline and changed checks after restoring that dependency; no dependency manifests changed.

Browser results and screenshots are recorded alongside this report after completion.

Additional checks: `scripts/check-ranked-steam-guides.mjs` passed. Local production server returned 200 for sitemap, robots, ads.txt and every CSS/JS resource referenced by the VRAM page. The standalone Node server has no D1 binding, so `/api/feedback` cannot be verified there (no API or DB changes were made).

Publication verification limitation observed before publishing: HTTPS requests to gemnao.pages.dev are rejected by the execution environment's proxy (`CONNECT 403 Forbidden`), including an approved elevated read. The web tool also reports this site inaccessible. GitHub connector reads do work, including the Cloudflare Pages check for the baseline commit. This is a network limitation, not an automatic approval rejection and not evidence of a site failure.

The browser script checks all 28 Japanese guides, all 40 published translated guide routes (en/zh/es), home, Onimusha hub and Aniimo launcher display at 375 and 1440 px. It checks exact recommendation URLs against built snapshots, target HTTP 200, canonical/OG/H1, horizontal overflow and page errors. External requests and APIs are stubbed in this UI-only run; it does not exercise production D1. Screenshots of the four requested pages and the empty low-GPU-usage case are included at both widths and were visually inspected. During test development the homepage's canonical trailing-slash convention and exclusion from editorial snapshots required correcting the test expectations; no application change was needed.
