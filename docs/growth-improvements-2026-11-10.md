# Reader acquisition and return visits — 2026-11-10

## Changes

- Strengthen the existing English ST-3100001 guide with comparison conditions, sync-result branches, a screenshot checklist and explicit limits on player reports. Extend Wilds comparison records. Only these edited English articles receive `updatedAt: 2026-11-10`; source-review dates and unedited translations retain their dates.
- Preserve anonymous result submission and existing D1 aggregates. Localized step navigation now exposes the step's detailed follow-up guide without requiring a successful submission, and counts next-check navigation using public editorial metadata only. Japanese navigation retains its existing result branches.
- Add optional CPU/GPU model, RAM and GPU-driver fields to structured reports in four interface languages. Validate both form input and server payloads, retain absent legacy fields and pending-request hashes, show fields in the existing preview/review UI, and redact them by default with other optional details. Publication still requires the existing editorial review. No invented cases or independent hardware-test claims were added; no D1 migration, retention change or live test submission is needed.
- Provide six authored 1200px PNG quick-check diagrams (ST-3100001, Wilds crash and Steam launch; Japanese and English) and matching post drafts at `/tools/share-guides`. Images are editorial diagrams, not game screenshots or measured successes. X links open drafts; image attachment and external publishing remain manual. Campaign tags identify the asset and link directly to the matching language article.
- Add separate editorial guide updates on My Games and My Page. Only actual article edit/source-review dates are used. Official announcements remain separate. Read state has its own storage key; unread filtering, marking as read and links work independently of saved game choices and notes. Corrupt state is not overwritten. Article-end Save Game entries and saved-game update links make the return route visible.

## Validation

- Typecheck, lint, 370-page localization parity, full production build and SEO/AIO output checks.
- `node --test tests/growth-20261110.test.mjs tests/reader-navigation.test.mjs` covers legacy report equivalence, server validation/redaction, language-specific dates, read-state isolation, navigation when reporting is unavailable, campaign links and PNG dimensions.
- Inspect all six PNGs together for text overflow. Generator fails on excessive text lines.
- Managed local preview cannot start because the runtime's `uv_interface_addresses` call fails; Cloudflare preview is the browser QA path. No network or security configuration is changed to work around it.

## Measurement

Existing `related_article_opened` and `my_game_added` counts remain intact. New aggregate events: `step_next_opened`, `game_guide_update_opened`, `social_guide_asset_downloaded`, `social_guide_draft_copied`. My Games click events use fixed metadata and do not include saved game choices, private notes or PC configuration. Campaign: `utm_campaign=quick_checks_202611`, with one `utm_content` per image.

Compare acquisition channels, users and pages per session over equal complete periods after release. Downloads/copies do not establish that a post was published or that it produced visits. Indexing, rankings, AI citations and traffic growth are not guaranteed by this change.
