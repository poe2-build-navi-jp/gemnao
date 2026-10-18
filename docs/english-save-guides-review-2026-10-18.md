# Batch A: English save backup and Steam Cloud guides

Base: `054f5ea0345e7f81b7cd96177a0c42944d5317cb`. User authorized tested sequential production publication for this localization backlog on October 18, 2026 through the parent thread.

## Scope

- `/en/guide/save-data-backup`: three canonical Japanese STEP IDs, plus a separate restoration section. Confirmed Cyberpunk 2077 and Stardew Valley locations; dated independent copies; copy counts/size versus content hashes versus actual loading; preservation of the current state before any supported restore.
- `/en/guide/steam-cloud-sync-error`: four canonical STEP IDs. Preserve device-local and available remote candidates before launch/selection, compare actual progress history, conditional choice examples and explicit stopping conditions. No instruction to delete cloud metadata, force a conflict or automatically prefer local/cloud/newer files.
- English guide index grows from seven to nine. English search, launch/crash/file-check links and existing backup-gear links lead to real English pages. Reciprocal Japanese/English alternates, sitemap, two OG cards and static route policy are aligned. Other languages remain untranslated.
- `extraSections` adds the restore section without inventing a new anonymous feedback method. Feedback topics retain the Japanese route’s existing choices (`save` for backup, `launch` for Cloud).
- Baseline inventory: 157 registered Japanese articles across common/Discord/games, no duplicate paths. Detailed CSV and prioritized backlog are separate deliverables. B’s current source model and official documentation were identified independently.

## Source and safety review

Article source lists contain the official Steam Cloud/Steamworks, CD PROJEKT RED, Stardew Valley and Microsoft Get-FileHash URLs checked this session. Remote Storage is an official login-required page; no user cloud data was accessed. Steam’s web body was not exposed by the reader, so official indexed conflict/sync descriptions and the existing Japanese source-backed content were also consulted. Comparison examples and preservation order are identified as editorial guidance.

A copy is not presented as guaranteed recovery. Cloud warning/conflict flow precedes launching or choosing. Healthy-save backup and already-missing/corrupt-save preservation are distinguished. Restoring requires confirmed game/store/account compatibility, preserving the current state, control of Steam and any separate publisher/folder sync, and a publisher-supported procedure. Unknown destination, candidate, overwrite direction or sync behavior is a stopping condition. Autosave risk remains explicit even before manually saving. Hash commands are read-only examples with replaceable paths; no deletion or bulk restore command is supplied.

## Validation

Isolated copy `/tmp/gemnao-save-guides` excludes all three unrelated collector files.

- Production-flag build passed: 447 editorial snapshots, sitemap 426 URLs, image sitemap 21 pages.
- Full TypeScript validation and changed-file lint passed. Localized renderer/parity: 199 pages.
- English generated-HTML regression: 13 paired articles, 615 internal links/anchors; canonical, hreflang, schema, language menus, OG, sitemap and home/index discovery passed.
- Static search assets and OG freshness passed (366 cards, two generated).
- Browser checks cover index and both additions at 375/390/1440px. Initial “save backup” query exposed a missing compound keyword in the backup description; revised the description to use natural “dated backup” and rebuilt before final validation.
- External traffic and API writes are blocked in the browser check; feedback reads use a local fixture. No live votes, saves, cloud operations or GA events are performed by validation.

Final browser validation passed: nine route/viewport combinations, nine index cards, six search checks, no horizontal overflow/broken fragment links/page exceptions, local CSS/JS HTTP 200 and no API writes. Representative untranslated routes return 404. Evidence: `/tmp/gemnao-save-guides-browser.json`; runner: `/tmp/check-save-guides-final.cjs`.

Publication/deployment evidence is reported separately after the final browser result and push. B can proceed without waiting for another publication approval within the authorized localization scope.
