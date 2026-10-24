# Planet Zoo 2 JA/EN update review — 2026-10-24

Base: `7acc9239faf11a6e897dc1c5ed94764a6504ed56`. Candidate only; no production merge.

## Scope

New articles: 0. Updated articles: 2, keeping `/games/planet-zoo-2/crashing-autosave` and `/en/games/planet-zoo-2/crashing-autosave`. Update both hub descriptions and four OG cards. The existing article already covers saved-progress concerns; a separate Resume article would duplicate the update/status and save-protection flow. Preserve all four STEP IDs. The unrelated ACE COMBAT data in the same file is unchanged.

## Verified evidence

Primary source read successfully on October 24:
https://steamcommunity.com/app/3219030/allnews/

- October 23 update 1.0.6: fixes the Planet Hub autosave timer resetting before autosave triggers, and a crash releasing animals into Franchise wildlife reserves. Announced for all platforms. These are specific fixes, not every crash or every lost-progress case.
- October 23 hotfix 1.0.7: fixes a connection error after Resume on a Franchise save that prevents loading into any mode. Steam availability confirmed by the announcement. The assurance that saves were not lost and the instruction not to delete the saves folder concern this incident.
- Temporary workaround explicitly limited to users who installed 1.0.6 but cannot download 1.0.7: restart, then use a mode button rather than Resume. The update notice also flags VPN-related connectivity as a separate consideration; do not prescribe changing a required managed connection.
- The retrieved news feed placed 1.0.7 above 1.0.6. No later release was verified. An older Under Investigation entry still calls 1.0.6 latest; the later release notice takes precedence for the Resume fix. Do not treat old testing language as current unresolved status.

Official site URLs `/2/updates`, `/2/updates/1-0-6` and `/2/updates/1-0-7` returned 403. No retry or bypass. They are not represented as successfully read; article evidence comes from the accessible official Steam publication.

No claim that unsaved progress or unrelated save incidents are recoverable. No save deletion, reinstall, sync reset or destructive overwrite instructions. No invented save path or translated UI name. No real game test claimed.

## Validation

- Build, TypeScript, scoped lint and whitespace checks passed.
- `scripts/check-planet-zoo-update.mjs`: unchanged URLs and STEP IDs, unchanged unrelated ACE data, JA/EN sources, conditional workaround and limited assurance, generated canonical/hreflang/sitemap/OG, hub and guide links.
- Four OG cards regenerated; both article cards visually inspected.
- Global localization check retains the pre-existing FAQ count `3 !== 5` failure already reproduced on the base source. No check disabled.
- Live browser layout, live delivery and actual game behavior are unverified. Existing EN hub noindex policy is preserved, not silently changed.

No VALORANT, diagnostic intake, GA, DB, notification, credentials or private analytics changes. A separate authorization is required for production publication.
