# Japanese home starting points — 2026-11-09

The home page now explains how to choose between a Steam-client failure and a game-launch failure, a game crash and a Windows blue screen, and save backup and Steam Cloud checks. Six links resolve to existing verified common guides. A source-policy note links to the existing Wilds case and clearly describes it as one player's report, without independent replication.

`HomeStart` is a server component passed through the existing client shell. It is shown on the default Japanese home, without expanding the search-result or all-games/all-articles views. The CollectionPage/ItemList describes the same six visible links. Home metadata uses the practical scope description; site name, H1, canonical, language alternates, analytics and advertising remain intact. The latest English-home and operator-identity changes from PR #169 are preserved.

`homeContentUpdatedAt` records this substantial home edit as 2026-11-09 and is shared by the home schema and sitemap. Article/source-review dates and indexing policy are unchanged. No new URLs, game-specific facts, replicated test claims or ranking promises were added.

Local checks: typecheck, full lint and full production build passed. The build generated 700 routes, 672 editorial snapshots and 513 sitemap URLs; SEO/AIO checks passed on 501 indexable snapshots. A separate server render confirmed the six published guide links, the case limitation and matching schema/sitemap dates. The root remains the existing dynamic SSR route; this change does not replace query-aware rendering with an unconditional static response.

Managed preview startup failed in the runtime's network-interface enumeration (`uv_interface_addresses`); no application or security setting was changed to bypass it. Cloudflare preview/public HTML and Google URL-inspection results must be verified separately. An indexing request or live-test pass is not a confirmed Google index entry.
