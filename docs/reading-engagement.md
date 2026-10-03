# Saved articles and return visits

## Reader experience

- Article and supported tool pages offer an explicit, one-click “Save for later”. Translated templates have matching ja/en/zh/es labels and preserve the exact public language path. The existing `/my` page remains Japanese, and translated links say so.
- Up to 50 articles are stored only in this browser. This is separate from browser bookmarks, game selections, and the existing private solution notebook. No login, permission prompt, or subscription is added.
- `/my` leads with saved articles and the existing recent history, followed by selected games' official updates, the game picker, the notebook and optional PC setup. The homepage's existing personal shortcut shows local saved counts and the last saved article.
- Existing related destinations are preserved with symptom-specific conditions. Server/login articles no longer suggest a generic Steam startup guide; they offer official status and conditional Windows/network help. No forced page splitting or extra generic recommendation widget.
- The existing share strip keeps server-rendered X/LINE/Hatena links and adds canonical-URL copying, with a selectable URL fallback if clipboard access is unavailable.

## Private aggregate GA4 events

Use the existing GA4 event report and compare equivalent date ranges after release. Events are prospective; historical data is not backfilled.

- `article_saved`: one newly persisted article, after a successful localStorage write. Duplicate saves, removals, failed writes, SSR and merely opening a page do not count.
- `saved_article_opened`: a click from the reading list or homepage's last-saved article.
- `related_article_opened`: a click on marked contextual links in the game article template. This is a navigation-intent count, not proof the next page loaded.
- Existing `share` remains unchanged for social links. The new copy button emits `method=copy` only after clipboard success. X means opening the X post composer, not completing a post. Copying is not proof the link was sent.

The three new events send only fixed `page_location=https://gemnao.pages.dev/my`, `page_title=Reading list`, and empty `page_referrer`. No saved article title/path, game list, PC, notes, search/query/hash, or custom persistent identity is attached. Counts remain private in the existing analytics account. The canonical site origin is required at GA bootstrap, script-load, and event-dispatch time: preview/local/test hosts do not initialize GA or send events. `/admin` and unavailable/throwing analytics are excluded without breaking the feature.

Local saved counts displayed in UI describe this browser only. Browser-native bookmark additions, completed social posts, and unique people saving across devices cannot be inferred. Return behavior should be assessed through existing GA4 returning-user/session reports; never derive a return rate by subtracting `first_visit` from active users. Changes in PV or return behavior require observation and cannot be promised from shipping this feature.

## Verification

Run `node scripts/run-reading-list-check.mjs`, `node scripts/run-reading-experience-check.mjs`, existing saved-solutions and My Games analytics checks, localized checks, lint, full production build, and English article/tool regression checks. Check save, reload, reopen, remove, denied/full storage, clipboard fallback, and mobile widths in a browser. Existing recent-history keys and notebook/game keys must remain untouched by reading-list mutations.
