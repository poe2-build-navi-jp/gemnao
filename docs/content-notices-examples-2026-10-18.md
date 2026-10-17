# Official notice history and reading examples

## Scope and evidence

ST-3100001 JA/EN now separates announcement dates, symptoms, stated status and source links. The parent researcher reviewed 37 official Steam announcements via `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2288340&count=100&maxlength=0&feeds=steam_community_announcements` on 2026-10-18 JST:

- September 30, 18:31 JST / 09:31 UTC: code meaning and Windows clock synchronization; no penalty text. https://steamcommunity.com/ogg/2288340/announcements/detail/695399726270382124
- October 9, 16:46 JST: matchmaking in some environments, Windows 11/SSD guidance and update preparation. Not proof of ST resolution or penalty clearance. https://steamcommunity.com/ogg/2288340/announcements/detail/695400360681933547
- October 16, 20:10 JST: memory-related crash interim guidance, a separate symptom. https://steamcommunity.com/games/2288340/announcements/detail/667253496651711938
- September 29 PROJECT_ACES X: author/date/mission-end-error heading rechecked, full text unavailable. The prior penalty-plan description is identified as prior coverage, not a new confirmation of completion or non-completion. https://x.com/PROJECT_ACES/status/2104739973396373623

The conclusion is limited to the reviewed official Steam announcements: no completed ST fix or affected penalty-clearance announcement was confirmed. This does not prove an issue remains unfixed. The former October 2 notice-review date and October 13 clock-procedure update are explained separately; JA/EN page review dates now show October 18 JST.

Three shared JA/EN reading cards appear on crash guides and Windows diagnosis pages. They explicitly use fictional illustrative samples, not screenshots or actual incidents. They cover matching game/time, another app's error and no matching record, with fields to inspect, limits of inference, privacy reminders and existing localized next-step links. Microsoft event interpretation was checked against https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior . No download artifacts, hashes or diagnosis executable behavior changed.

## Validation and release

Synthetic Chromium checks JA/EN sample cards and four-row histories at 390/1165px, with no horizontal overflow and no image/form/network input. Existing localized checks cover 190 pages; Windows download/artifact/routing/privacy checks pass. Changed-file lint, whitespace, TypeScript (excluding only the two existing unavailable Playwright-package files), and the full production build chain passed. Generated snapshots contain the new sections on all six target JA/EN pages. Screenshots: `/tmp/gemnao-crash-examples/`.

The user approved normal commit/push/deployment after evidence confirmation and testing. Parent browser performs final public verification. Existing reporting, protection and runtime settings remain untouched; no production synthetic submissions. Unrelated collector proposal files remain outside this change.
