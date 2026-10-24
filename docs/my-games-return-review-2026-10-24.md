# My Games return flow review — 2026-10-24

Base: f954740b7cefe800952ec827d77b3a501f5c004b. Candidate only; no production merge.

## Changes

- Existing saved games render before the add/search form for returning readers. First visits retain the add-first flow; the return view links to the add form. Actual DOM order changes, not CSS-only visual reordering. Existing saved fixes and the per-game next-action plan remain available.
- Each game exposes its open notes, newest first, and the last recorded attempt where available. A native button selects the exact existing note and focuses the existing workspace. It re-reads storage before selection, rejects deleted/resolved/other-game notes and reports storage failures. No note schema, contents or backup format changes; selecting twice cannot create duplicate notes.
- Add reviewed BF6 October 22 stability, Planet Zoo 2 October 23 1.0.7 and Enshrouded October 21 1.0.0.3 cards using the already reviewed editorial sources. Dates, conditions and next checks are explicit. No new source retrieval bypasses earlier access limitations. Unread stays separate from recency and an update is not proof of resolution. Official source language is labeled correctly for the new English sources.
- Return controls are JA/EN/ZH/ES. New editorial cards are JA/EN; ZH/ES explicitly fall back to Japanese cards/articles. Existing Japanese-source Apex/PUBG cards remain unchanged.

## Privacy and scope

Same-browser local storage and existing backup/restore remain. No automatic cross-device or Windows diagnostic sync. Clearing site storage can lose notes. Existing copy explains this. No new analytics events, note fields, identifiers or private text sent; existing saved/reused events remain. No GA, DB, diagnostic intake or notification configuration changes.

## Completed checks

- Production build and TypeScript noEmit passed; scoped oxlint and diff whitespace check passed.
- My Games real-handler tests: four-language initial/return DOM ordering, empty/multiple/other-game/resolved notes, exact selection, stale deletion, failed writes, repeated selection, re-read and focus callback. Existing add/remove/re-add/limit/failure/corruption and aggregate analytics tests passed with the add selector made independent of layout order.
- Four-language SSR, actual/fallback article paths and noindex check passed.
- Official change dates, legacy read state, invalid data, explicit language fallback and three new cards passed.
- Full backup/restore, legacy compatibility, conflict handling, quota/rollback/recovery and private-key exclusion tests passed.
- Support-record tests and 12 detailed-save callback scenarios passed (including repeat save, failure/retry and private analytics).
- No live GA requests or user storage were used. Repository-wide localized validation has an existing FAQ-count failure previously reproduced on base; it was not disabled.

## Remaining manual browser QA

Real browser rendering, hydration, mobile width, 200% zoom/DPI, keyboard tab/Enter/Space and screen-reader focus announcements remain unverified. Unit tests exercise the real handlers with shallow hooks; they are not browser evidence. On an isolated profile, verify add-first on empty storage, saved-first after reload, open either of two notes, delete/resolve it and retry a stale view, storage rejection, and visible focus at the notebook without horizontal clipping. Use synthetic notes; block analytics during browser QA.
