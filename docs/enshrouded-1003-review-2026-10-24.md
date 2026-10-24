# Enshrouded 1.0.0.3 editorial review — 2026-10-24

Base: `a5cdb02f4a9ac25476031784c8451532b0b7b763`.

## Scope

Two new articles (Japanese and English), each at `/[en/]games/enshrouded/black-screen-save-migration`, plus two focused hub pages. No existing Enshrouded guide was found. Multiplayer black screen and inability to enter overlap in the named loading failure, so one substantial guide per language separates loading from save conversion instead of creating six thin pages. Existing article URLs are unchanged. The single-article hubs retain the existing noindex policy; articles are indexed. Requested language scope is JA/EN; no invented ZH/ES counterpart.

## Primary evidence

- https://enshrouded.com/en-US/news/changelog-for-hotfix-1003 — read October 24; published October 21, 2026, Version 1273043. Specific multiplayer-loading black screen and rare save-migration crash fixed. Invalid additional backpack entries can be omitted during migration; an out-of-grid Flame Altar correction has an affected-base water limitation. These conditions do not establish general connection failures or universal save loss/recovery.
- https://enshrouded.com/en-US/news/enshrouded-launch-faq-early-access-reward-world — October 13 launch FAQ: Early Access saves convert to the 1.0 format.
- https://enshrouded.com/en-US/news — checked October 24; October 23 Steam Deck news was newer, but no later hotfix was listed in the inspected index. This is not a perpetual latest-version claim.
- https://store.steampowered.com/app/1203620/Enshrouded/ — Windows PC scope confirmed. No unverified game-specific file path or recovery recipe added.

The existing save-data-backup guide supplies conservative copying guidance: confirmed location, game closed, separate dated copy, original preserved. No deletion, sync reset, protection disabling or guaranteed repair instructions.

## Validation

- TypeScript noEmit and production build passed.
- Scoped oxlint and git diff --check passed.
- `node scripts/check-enshrouded-pages.mjs` passed: JA/EN source and STEP parity, English language check, published version/date, generated HTML canonical, bidirectional actual-language hreflang, sitemap, OG assets, hub and safe-guide links.
- Generated JA/EN article OG images visually inspected; titles and steps fit.
- Repository-wide `check:localized` still fails with the existing FAQ count assertion (3 versus 5), also reproduced on the unchanged Planet Zoo 2 production content. No check disabled.
- Actual game behavior and desktop/mobile browser rendering were not tested. Generated HTML and OG inspection are not live-browser evidence.

Candidate only. Production merge, analytics, database and diagnostic intake configuration are outside this change.
