# VALORANT JA/EN editorial candidate — 2026-10-24

Base: `d637523949e770434e35246f30f1de5ad2e617b7`. Draft only; no production publication in this change.

## Routes and scope

- Update `/games/valorant/van9003` and `/en/games/valorant/van9003`.
- Update `/games/valorant/not-launching-no-van` and its `/en` equivalent.
- Add `/games/valorant/stuck-loading` and its `/en` equivalent.
- Update JA/EN hub wording and reciprocal article links. No duplicate VAN9003 or launch URLs.
- Keep existing STEP IDs, ZH/ES article content and their review dates. An optional per-copy review date prevents marking untouched translations newly reviewed.
- New loading article is JA/EN only, as requested; no invented ZH/ES routes. Existing translations remain available.

## Official evidence and limits

Read Riot's VAN9003, Secure Boot, Vanguard security requirements, full repair and launch-error guides. VAN9003 is a requirement message, not a newly established patch defect. Existing Windows-state-first branches, manufacturer instructions, private BitLocker recovery preparation and stop conditions remain intact.

The general loading page is dated September 21, 2026:
https://support.riotgames.com/en-us/riot/performance/stuck-on-infinite-loading-screen

The older loading/login/agent-selection URL redirects to a page dated July 8, 2024, despite differing search snippets. Its phrase about a recent update is not presented as a current incident:
https://support.riotgames.com/en-us/riot/client/stuck-at-loading-screen-can-t-log-in-can-t-select-championagent-lolval

The official updates index listed 13.08 as the newest patch note during this review. Its October 13 notes describe a specific Practice Range queue-state issue and a separate Team MVP display issue; neither proves the cause of all loading stalls:
https://playvalorant.com/en-us/news/game-updates/valorant-patch-notes-13-08/

No guaranteed repair or hands-on success claim. No generic advice to disable protection, clear TPM, convert disks, reset Secure Boot keys, delete AppData or use third-party repair tools. Recovery keys must not be shared in chat. No private analytics or user data.

## Validation

- `npm run build`: passed; 634 editorial snapshots, 618 sitemap URLs.
- `node_modules/.bin/tsc --noEmit`: passed.
- Scoped `oxlint` and `git diff --check`: passed.
- `node scripts/check-valorant-pages.mjs`: passed; six rendered pages, unique routes, STEP/source/date parity, retained translation content/dates, canonical, reciprocal hreflang, sitemap, OG files, hub and article links.
- OG generation: four cards rendered (two new articles and two changed hubs). Both new article cards visually inspected.
- Global `node scripts/run-localized-check.mjs`: fails on the pre-existing FAQ count assertion `3 !== 5`, also reproduced against the unchanged base tree `bcf41c4aed9b6e179475a011af430751797f1a4d`. No check disabled.
- Browser layout, live HTML/CSS/JS and real game behavior not verified. Prior live-fetch restriction was not bypassed. Static HTML checks are not browser screenshots.

No GA configuration, database, diagnostic intake, notification or infrastructure changes. Production merge requires separate approval; preview CI is not proof of publication.
