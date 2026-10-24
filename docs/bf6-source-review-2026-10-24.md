# BF6 update/crash and revive source review — blocked on primary text

Base: 6c85bec31c9101d8d60b4076f17981edbc7bcfc4.
Candidate branch: content/bf6-update-revive-ja-en. No production or article changes yet.

Existing BF6 routes cover javelin-error-94 and secure-boot-enabled-not-launching in the followups data. No matching update-crash or revive article was found. Proposed additions: two symptoms × JA/EN = four pages; no duplicate security/error article.

Proposed paths (not created/public):
- /games/battlefield-6/crash-after-update (+ /en)
- /games/battlefield-6/cannot-revive (+ /en)

Proposed titles:
- BF6がアップデート後にクラッシュする｜修正範囲と更新後の確認
- Battlefield 6 crashes after an update: fix scope and checks
- BF6で蘇生できない｜モード別の確認と公式対応状況
- Battlefield 6 cannot revive: mode-specific checks and official status

Verified primary text:
https://www.ea.com/games/battlefield/redsec/news/battlefield-6-game-update-2-1-1-0
EA article dated October 12, 2026, says update 2.1.1.0 downloads start October 13 at 08:00 UTC across all platforms, with Season 5 content at 12:00 UTC. The PLAYER section describes third-person revive-animation improvements. That is not evidence that every revive failure was fixed, nor proof that the October 22 hotfix has the same version number.

Missing mandatory primary text:
- https://steamcommunity.com/app/2807960/discussions/0/572678538884419660/
- https://steamcommunity.com/app/2807960/discussions/0/564796840407520709/
Web open returned inaccessible; ordinary public HTTP retrieval returned proxy tunnel 403 Forbidden for each. No further retrieval attempts or alternate access bypass after that denial. The public discussion index shows the hotfix title and a Known Issues title dated October 17, but not the body or reliable issue scope.

Do not infer from titles: exact October 22 map list, platform scope, hotfix version number, whether a deployment is client/server-side, exact Battle Royale revive conditions, current fix/investigation status, or an official workaround. Do not label all modes affected.

Remaining preparation once official body is available:
1. Record announcement date separately from release date/version; retain exact platform/mode/map qualifiers.
2. Write safe JA/EN steps: official launcher update status, record mode/map/error/time, match issue scope, official workaround only if explicitly supported, follow later notices/report unresolved cases. Avoid save deletion, protection disabling or blanket BIOS changes.
3. Add reciprocal links to existing error/security routes and JA/EN hub. Keep all existing URLs and translations intact.
4. Generate OG cards; build/type/lint; verify four routes, source and STEP parity, canonical, reciprocal JA/EN hreflang, sitemap and links. No tests run on articles that do not exist.
5. Draft PR only. No production merge without separate authorization.

No user diagnostics, account data, analytics or private metrics included. No GA/DB/intake changes.
