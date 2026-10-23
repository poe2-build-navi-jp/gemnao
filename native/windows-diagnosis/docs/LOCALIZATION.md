# English / Japanese display contract — 0.6.0

## Resources and fallback

`Resources/Strings.en.resx` and `Strings.ja.resx` contain 695 paired application-owned text resources. Both are compiled into the main EXE with explicit manifest names and `WithCulture=false`; distribution does not depend on a satellite DLL or network translation. `Localization.cs` uses `ResourceManager`. Missing Japanese keys fall back to English; an entirely missing key renders a visible `[key]` marker and the source audit rejects missing keys. The neutral fallback is English.

At startup `CurrentUICulture.Name` selects Japanese for `ja`/`ja-*`; all other language names select English. This does not change number parsing, numeric serialization or the process's culture. The language selector is in-memory and does not create settings or persistent access.

## What changes and what does not

The selected language affects app-owned controls/choice labels, rule explanations, caveats, instructions, local detail labels, history summaries, TXT report narratives, prompts and JSON-save instructions. Actual raw local CPU/GPU/module names remain original values with an explicit notice. No raw content is sent to a translation service. This app has no network client.

Enums, rule IDs, game/symptom scope, query strings, known filenames, exception hex values, numeric versions, timestamps, event match strength and parser outcomes are language-independent. `NumericVersionValue` uses null for unavailable/rejected values; `VendorCode` uses a fixed `other` code. The Windows collector stores these invariant values. `NumericVersion` and `Vendor` are display wrappers. No rule compares a localized unknown label.

History schema 2 and feedback schema 1 do not change. The tool/rule version identifies 0.6.0, but JSON property names/outcome tokens/action IDs are not translated. Given the same typed evidence, language changes produce identical serialized history/JSON bytes. Per-history salt and binding remain private and absent from exports.

## Switching an existing session

The selector is disabled during reads and timed ranges; its handler also checks those states. Fixed UI choice indices are retained under the updating guard. It does not fire game/symptom/store change handlers or record an action. Switching does not modify current/baseline snapshots, target/session/attempt IDs, the target path, consent, the restart latch, or the journal.

App-owned static labels and choices are looked up as complete resource values, never with substring translation of arbitrary content. Raw text boxes and the path label are excluded. The original path is redisplayed separately without transformation. Elapsed text changes only its app-owned prefix. Dynamic results and history summaries regenerate from the typed evidence. The selected action ID and history draft indices stay the same. Nested result/action redraws preserve the preexisting updating guard.

Do not translate raw evidence in place or move diagnostic logic into resource strings. A localized catalog is rebuilt on access so static initialization cannot freeze the first language. Callers identify a step by `Id`, not object-reference identity.

## Link policy

English has an explicit three-route allowlist: common PC-game crashes, Wilds launch failure, and the English Wilds hub's `#requirements` section. Japanese article fragments are not carried to a differently structured translated article. Other Gemnao URLs remain Japanese and are labeled `(Japanese)` when shown in English. Steam/Microsoft official locale counterparts are used for the existing source URLs. Opening a browser still requires explicit confirmation, and the URL contains no diagnostic data.

## Automated checks and remaining QA

The synthetic suite validates resource coverage, English text without Japanese leakage, all game/symptom plans in both languages, unknown/error states, rule order/IDs, history byte/scope invariance, cross-game/path/symptom rejection, JSON byte/privacy invariance, null/malformed/IP-shaped numeric-version rejection, original raw-value preservation, safety-stop retention, link mapping and language round trips.

`tools/verify-source.py` checks paired resources and source references, no hardcoded Japanese application text (apart from the bilingual selector), idle switch guards, excluded raw controls, preserved draft/guard behavior, invariant collector usage and the original no-network/no-repair/consent/source-safety rules.

These are synthetic/runtime-independent checks and static source inspection. The actual WinForms switch, layout, screen readers, DPI, native dialogs and Windows collection must still be exercised using `WINDOWS-VALIDATION.en.md`. Compile success is not a native UI test.
