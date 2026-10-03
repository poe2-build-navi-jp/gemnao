# English content and diagnosis release — 2026-10-03

## Scope

Complete English editions, with the original Japanese pages retained:

- `/en/gear/save-backup-storage-guide`
- `/en/gear/discord-microphone-guide`
- `/en/guide/pc-game-crash`
- `/en/games/monster-hunter-wilds/not-launching`
- `/en/games/ace-combat-8/error-st-3100001`

English tool entry points:

- `/en/tools`
- `/en/tools/windows-diagnosis`

The existing 54 translated routes remain available. Five complete articles and two tool pages bring the localized total to 61. ACE COMBAT 8 has an English error article but no invented English hub: its Japanese hub is explicitly labelled. There are no placeholder Chinese/Spanish versions of the new English-only pages.

## Editorial and safety details

- Source URLs, step IDs, action counts, risk levels and FAQ coverage are checked against the Japanese originals for the two game articles. Both buyer guides retain source URLs, section IDs, setup, pre-purchase and FAQ coverage.
- The Wilds recovery is one anonymous user report dated October 3, 2026 Japan time. It distinguishes file presence from module loading, Steam from the game process, a candidate from proof, and a reported successful launch from long-term stability. It preserves System32 exclusions, reversible changes, backup/redirected-save checks, privacy cautions and stop conditions. No re-enable-to-provoke-crash instruction was added.
- ACE clock instructions use the reader's correct local timezone; dated official notices and player reports are identified separately.
- The microphone example retains the existing Amazon Japan ASIN and affiliate destination, with clear advertising disclosure. It is a conditional specification-based example, not a hands-on review or ranking. No product was added to the storage guide.
- Japanese originals keep their title, description, canonical and body. Reciprocal language alternates are added only where English content exists.
- Each new English article has English metadata, structured data, a generated English social image, sitemap inclusion, same-page language switching, and English-home discovery. Remaining Japanese links are labelled.

## Native download

Version 0.6.0 is the bilingual build supplied by the native project. It remains an unsigned prototype for Windows 11 x64 with .NET Framework 4.8 or later.

- File: `gemnao-game-diagnosis-0.6.0-windows-x64.zip`
- Bytes: `299650`
- SHA-256: `34719ffa93fe31143dcd392b383831fdf8f3f3ecc98d64f2d9e68d9405126b77`

The final native source audit reports 386 synthetic tests and 695 paired English/Japanese resources.

The older 0.5.0 and 0.4.0 download URLs remain intact. The website does not claim real-Windows runtime validation: native build and synthetic tests do not replace a real Windows smoke test.

## Verification

Run from the repository root:

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm check:localized` (59 rendered content pages; tools checked below)
- `pnpm og:cards` (seven new English cards, including both tool pages)
- `pnpm build`
- `node scripts/check-english-articles.mjs`
- `node scripts/check-english-tools.mjs`
- `node scripts/check-editorial-snapshots.mjs`
- `node scripts/check-windows-download.mjs`
- `node scripts/check-static-pages-http.mjs`
- `node scripts/check-gear-guides.mjs`
- `node scripts/check-editorial-safety.mjs`
- `node scripts/check-contact-quality.mjs`

The combined build produced 252 public editorial snapshots and 247 sitemap URLs. Article checks cover 206 internal links/anchors; tool checks cover 64. The isolated local Pages test verifies all 252 HTML routes, HEAD behavior, dynamic/query/RSC exclusions, 404 handling, contact validation, static assets and all three native ZIPs byte-for-byte. That test uses copied assets outside the repository and has no D1 binding or cloud credentials.

English social cards were visually inspected. Cloud-browser access to the local preview was blocked with `net::ERR_BLOCKED_BY_CLIENT`, so no desktop/mobile browser visual pass is claimed. Live deployment, live cache/assets and a real Windows smoke test remain separate checks.

## English proofreading

The five new articles and two tool pages were proofread, followed by the seven existing English articles, ten English hubs and shared interface copy. Corrections include natural phrasing, grammar, correct technical terminology, Discord mic-test behavior, the literal Baldur’s Gate 3 folder path, and matching native UI labels.

Existing English safety wording now avoids blanket antivirus/firewall shutdown, automatic whole-folder exclusions and unsupported “fully reversible” claims. Newly generated profiles and identifiable mod files are preserved. Existing source-check dates, URLs and step IDs were not refreshed for copyediting. Regression checks cover these safety requirements and the correct .NET Framework 4.8 requirement. The English microphone link retains the existing affiliate destination and uses the existing privacy-bounded click event, accepting only its exact new public path.
