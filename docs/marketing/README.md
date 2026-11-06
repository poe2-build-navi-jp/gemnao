# Gemnao Cards, game alerts and Steam guide distribution

## Gemnao Cards

`/tools/gemnao-cards`: Series 01 has three finishes (mint/gold/violet), deterministic design numbers, a user-reported outcome, date and brand mark. The numbering identifies the finish, not rarity or repair success. No copyrighted game art or invented validation badges are used. PNG export and text copy are explicit actions. A separate localStorage key holds up to 100 cards; bad existing data is not overwritten. Inputs are not posted to the server, embedded into share URLs, or sent in analytics. A reference link contains only a real public article path. Images need a browser; collection storage is not cross-device backup.

## Game alerts

`/tools/game-alerts`: loads supported games from My Games only on request, accepts up to 10 known Steam-backed games, and exposes a canonical RSS URL at `/api/game-updates-feed?games=...`. It uses the existing validated official Steam news fetcher (last 30 days, latest three per game, cached for five minutes). Editorial correction notices and all upstream patches are not promised: the feed is official announcements, including non-patch news. RSS alert delivery depends on a reader's features and settings and may require payment. Copying/subscribing shares the selected game slugs with that reader. Changing selection creates a different feed; old subscriptions must be removed in the reader.

Browser notifications are separately opt-in, require browser permission, establish a baseline, compare announcement IDs and publication time, and poll about every five minutes only while the page is open. Closing the page, stopping alerts or changing games stops polling. This is not background Web Push or email; neither a mailing service nor credentials were provisioned. No subscriptions or personal endpoints are stored server-side.

## Steam

`/tools/steam-guides`: three original, standalone guides, in Japanese and English, derived from the site's existing reviewed articles. Six BBCode files in `steam/` preserve source review dates and caution text. Regenerate with `node scripts/generate-steam-guides.mjs` after article edits, then review. Links use fixed source/medium/campaign parameters, with no user identifier. The publisher must own/access the game in Steam and verify current game conditions, language, layout and links before publication. Having a draft or copying it does not mean it has been published on Steam. No Steam credentials are collected by Gemnao.

## Measurement and verification

Aggregate events: `gemnao_card_exported`, `gemnao_card_saved`, `game_alert_feed_copied`, `steam_guide_copied`. Fixed page metadata excludes card input, game selection, account data, notes or custom IDs. Events are disabled outside the production origin through the existing analytics guard. Source UTM values identify Steam-origin visits. These are counts of actions, not evidence of a successful subscription, unique people, repairs or growth.

Test: `node --test tests/gemnao-growth.test.mjs`. Run typecheck, lint and production build. Test browser PNG download, local collection persistence, invalid storage retention, unsupported notification state, URL copy, draft language switching and small-width layout before claiming browser verification. New tools are noindex and link through `/tools`, My Games, and article sharing controls; user-generated card records must not be indexed as public pages.
