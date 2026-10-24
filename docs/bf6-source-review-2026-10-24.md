# BF6 JA/EN update-crash and revive candidate — 2026-10-24

Base: `6c85bec31c9101d8d60b4076f17981edbc7bcfc4`. Separate from unmerged VALORANT PR134. Draft only; no production publication.

## Routes

Four new pages (two symptoms, Japanese and English):
- `/games/battlefield-6/crash-after-update` and `/en/games/battlefield-6/crash-after-update`
- `/games/battlefield-6/cannot-revive` and `/en/games/battlefield-6/cannot-revive`

Existing `javelin-error-94` and `secure-boot-enabled-not-launching` articles are distinct symptoms, retained with added JA/EN reciprocal links. No replacement or duplicate URL. Their ZH/ES text remains unchanged. JA/EN hub labels now cover the added symptoms. No invented ZH/ES translation routes.

## Primary evidence and limits

The two Steam pages could not be freshly retrieved in this execution: Web open reported inaccessible; ordinary HTTP retrieval returned proxy tunnel 403 Forbidden. No subsequent retrieval or alternate-access bypass was attempted. Previously retrieved official page records were instead supplied and reconciled on October 24. This is not a claim of a successful new live fetch.

- https://steamcommunity.com/app/2807960/discussions/0/572678538884419660/
  - October 22 absolute posting date; time zone unspecified. Client hotfix deployed for stability on Vegas Strip and Area 51. Download needed before playing again. No hotfix version or platform specified; no all-crashes-resolved claim. The inconsistent relative-time label is not used.
- https://steamcommunity.com/app/2807960/discussions/0/564796840407520709/
  - October 16 Season 5 notice: reports of a revive prompt failing to appear or activate over downed squadmates in Battle Royale; investigating at that notice date. No platform/version specified. Later confirmed resolution was not verified; that does not prove it remains unfixed on October 24. Do not extend this to all modes.
- https://www.ea.com/games/battlefield/redsec/news/battlefield-6-game-update-2-1-1-0
  - Read directly: article dated October 12; 2.1.1.0 downloadable October 13 at 08:00 UTC across platforms, content at 12:00 UTC. Revive-animation improvements do not establish a fix for the later BR prompt issue. This is not the October 22 hotfix version.

Articles paraphrase narrowly, distinguishing announcement date, confirmed deployment, scope and unverified later status. No invented workaround, hotfix number, fix deadline, firsthand success or guarantee. Steps focus on official launcher update status, map/mode/error recording and later official announcements. No save deletion, protection disabling or generic firmware changes.

## Validation

- Build passed; dedicated four-page generated-HTML check passed.
- TypeScript, scoped lint and diff whitespace checks passed.
- `scripts/check-bf6-update-pages.mjs`: unique routes, JA/EN STEP/source/date parity, English text, canonical, reciprocal hreflang, sitemap, OG files, hub and existing-guide return links; dated investigation and limited hotfix wording.
- OG generator rendered six cards: four new article cards and two updated hubs. Representative Japanese crash and English revive cards visually inspected.
- Global localization check still fails on the pre-existing FAQ assertion `3 !== 5`, reproduced on production-equivalent base source. No check disabled.
- Browser layout, live HTML/CSS/JS and game behavior unverified. Generated HTML and OG checks are not live browser or game evidence.

No private analytics or user diagnostics; no GA, DB, intake, notification or infrastructure changes. Production merge requires separate approval.
