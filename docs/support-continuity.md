# Private troubleshooting continuity

Base: `gemunao` at `7c424d3`. This change does not include draft PR #45.

The existing solution notebook (`gemnao-solutions-v1`) is the source of truth. Its optional `support` field holds bounded, validated per-article/step results, temporary-setting restoration records, and read update IDs. Old records need no rewrite. Existing notes, solution statuses, checked steps, backup/restore, and per-article progress keys remain supported. A separately stored active note ID lets the reader explicitly connect articles to the same problem. The choice is visible on every article; selecting another note does not merge problems automatically. Repeated recording of a step updates its latest result, rather than creating duplicate entries. This is a latest-results notebook, not an immutable audit log.

Japanese staged diagnosis writes into the selected note as well as its existing progress key. English, Simplified Chinese and Spanish articles use the same notebook and explicit step/result controls. PC articles and all four My Games pages expose the same workflow. The existing Japanese My Page retains its notebook editing, deletion, export and import controls and adds summaries, restoration checklists and a separate verified-development section. Private data is stored only in the browser; there is no sync, server action, analysis event, URL parameter, external send, or PC settings operation.

## Support summaries

Only the allowlisted game name is selected initially. Symptoms, saved PC specifications, attempts and notes require individual opt-in. Free text is excluded by default, including note titles, names, paths and account details. When opted in, simple path/email/credential masking is only an aid; the editable preview and explicit review instruction are necessary. Copy uses the clipboard only and has a manual-copy fallback. English output translates headings and structured statuses and explicitly labels user text and step titles as untranslated. No translation service receives private text. Stored PC output is limited to validated GPU/Windows/RAM values already supported by My PC.

## Editorial verified updates

`lib/support-updates.ts` is deliberately empty. No development has been invented and general Steam announcements/article modification dates are not used as evidence of fixes. Add a production entry only after confirming:

- A stable unique ID, game slug and exact canonical symptom article paths.
- Whether it is an official fix or a verified workaround; versions, conditions and remaining limits in the text.
- A direct HTTPS evidence URL, actual verification date and publication timestamp (no future dates).
- Reviewed Japanese, English, Simplified Chinese and Spanish text.

Matching excludes resolved notes and other games/symptoms. Previously read IDs are stored per note; marking a displayed batch as read performs one storage write so quota failure does not partially mark the batch. Give a materially new finding a new ID. Initial visits can show all matching unread records, including records added before the note; the UI does not claim they were published since the reader's last visit. With no applicable evidence the UI clearly says there are no new verified developments and that this does not establish a fix.

## Verification

Run from the repository root:

```sh
node scripts/run-support-check.mjs
node scripts/run-saved-solutions-check.mjs
pnpm exec tsc --noEmit
pnpm lint
pnpm check:localized
pnpm build
node scripts/check-english-articles.mjs
node scripts/check-english-tools.mjs
```

The existing saved-solutions test had an outdated SaveGame button-label expectation. It now checks the current `マイゲーム · 追加` label; its storage and SSR checks are retained.

The browser regression script requires Playwright and Chromium; neither is added to production dependencies:

```sh
# Run the site's local dev server first. External APIs are intercepted by the test.
PLAYWRIGHT_MODULE=/path/to/playwright CHROMIUM_PATH=/path/to/chromium \
  node scripts/check-support-browser.mjs
```

It exercises four languages at 375/390/430px, keyboard disclosure controls, note creation, cross-article attempts, existing staged diagnosis integration, reload/back/forward, double clicks, restoration states, selectable/editable/copyable preview, clipboard denial, storage quota failure, fresh-context persistence and absence of private input in network requests. Screenshots are written to `/tmp/gemnao-support-{ja,en,zh,es}.png`.

Fresh-browser-context restoration simulates reopening after a PC restart; a physical OS reboot has not been performed. Screen-reader output and non-Chromium engines have not been tested. No production deployment, production D1/API test, authentication setup, request-feature flag change, or real private user data access was performed. Before release, review the draft, inspect preview behavior, and verify production HTML/assets after the authorized merge/deployment. Evidence-backed update entries remain an editorial task; the empty state is production behavior until they exist.
