# Article content dates — 2026-11-09

Source review (`checkedAt`) and substantial content edits (`updatedAt`) have separate meanings. Game article metadata, sitemap entries, Japanese Atom entries and visible update labels now use the optional content edit date, falling back to the existing review date for entries without an independently recorded edit.

Two verified historical edits were backfilled from their actual GitHub patches, not from today's build date:

| Page | Content edit | Source review retained | Evidence |
| --- | --- | --- | --- |
| `/games/call-of-duty-modern-warfare-4/crash` | 2026-11-04 | 2026-10-23 | `6c8f97a0b0046b6c2acbfafdd3d5b84dab087ee3`: reproducible crash checks and reporting details |
| `/en/games/ace-combat-8/time-sync-failed` | 2026-11-04 | 2026-10-13 | `863319c48cb05bbd50c8b0cc10d9ac34eb1f3a6b`: English sync-result interpretation and next checks |

The home sitemap entry was still dated 2026-09-30. It now records 2026-11-06, when `73590cc05a0cbf40fbb990de6a870d307b5498e3` added the featured Steam guides to `app/page.tsx` following the same day's search/return-visit improvements (`93229c85d370983409f112503396542fb1675995`). The homepage is not given an article schema or an invented new review date.

The Japanese, Chinese and Spanish time-sync copies were not edited by the November 4 patch, so their dates remain unchanged. No mass historical backfill, URL/title change, indexing-policy change, source recheck or game testing is claimed.

Local verification: typecheck, changed-file lint and full production build passed. The build generated 698 prerendered routes, 671 editorial snapshots and 511 sitemap URLs; its SEO/AIO audit passed for 500 indexable snapshots. Direct checks of generated XML and HTML confirmed matching lastmod, Open Graph modified time and JSON-LD dateModified for both changed pages, with the original review dates still visible. The unchanged Japanese time-sync page remains dated 2026-10-13. The Japanese MW4 Atom entry contains the November 4 edit date. The sitemap still excludes Chinese/Spanish routes.

Full repository lint and the 370-page localization/parity check also passed. Managed browser preview was already occupied (`sites-preview start` returned a lock error), so local visual QA was not performed and the other preview was left running. No layout/CSS or article instructions were changed.

This fixes inaccurate update signals. It does not establish the cause of Google's indexing decisions, guarantee indexing, resolve Search Console's reporting errors, or constitute a new Google indexing submission. Live deployment and Search Console results must be recorded separately.
