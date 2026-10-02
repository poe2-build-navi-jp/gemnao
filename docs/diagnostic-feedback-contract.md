# Gemnao voluntary diagnostic feedback v1 (proposed implementation contract)

Page: https://gemnao.pages.dev/diagnostic-feedback (NOT LIVE; native link stays disabled until parent verifies publication). POST /api/diagnostic-feedback. Native never sends network requests. Export sanitized JSON, user previews/saves locally, manually selects file on page, reviews, then separately consents. No URL query/hash payload. UTF-8 JSON max 4096 bytes. Reject every unknown field, malformed value, duplicate action ID, and >8 actions. No free text, raw logs, ZIP, paths, names, emails, precise timestamps, stable device identifiers or DLL names.

Export object (all fields required except os_family/gpu_vendor/driver_version):
{
  "schema_version": 1,
  "game_id": "monster-hunter-wilds",
  "symptom": "launch-crash",
  "source": "native-windows",
  "tool_version": "0.4.0",
  "rule_version": "0.4.0",
  "os_family": "windows-11",
  "gpu_vendor": "nvidia",
  "driver_version": "32.0.15.0000",
  "actions": [{"action_id":"wilds-steam-client-review","outcome":"resolved","evidence":"self-report"}]
}

symptom: launch-crash | black-screen | graphics-error | shader-preparation | in-game-crash | unknown.
source: native-windows | web-manual.
Versions: 1–4 numeric dot-separated components, each 1–5 digits; total <=23 chars. No prose/branch/hostname. Manual form uses 1.0.0 for both.
os_family optional: windows-10 | windows-11 | other | unknown.
gpu_vendor optional: nvidia | amd | intel | other | unknown.
actions: 1–8; action_id allowlist: wilds-files, wilds-driver, wilds-capture, wilds-admin-flag, wilds-compatibility, wilds-mods, wilds-traces, wilds-textures, wilds-security, wilds-requirements, wilds-records, wilds-stop, wilds-steam-client-review.
outcome: resolved | improved | unchanged | worse | not-tried | unknown.
evidence: self-report only in v1. Observation changes remain LOCAL in native report, never promoted to cause or transmitted in this small v1. Future observed fields need a reviewed schema increment.

Web transport wraps export as {report, consent_version: 1, receipt_id, delete_key}. Browser generates per-submission receipt_id (8 hex UTC creation seconds + 24 random lowercase hex) and delete_key (64 lowercase hex) BEFORE send; not stable device identifiers. Retry reuses both. New insertion requires receipt time within 24 hours (5-minute future tolerance). Deletion leaves a 30-day receipt-only tombstone to prevent retry resurrection. Server stores hash of key only. Delete via DELETE /api/diagnostic-feedback JSON {receipt_id, delete_key}; no secrets in URLs. No public read/list API. Receipt key remains in page memory and downloadable text only, no localStorage.

Initial retention 30 days. Reporting remains disabled until isolated DB, independent hourly cleanup Worker, successful cleanup heartbeat, rate/cost limits, and owner-reviewed launch are verified. Owner review is offline export with authorized D1 access, no new unauthenticated admin endpoint. Curated rule changes and tests, never automatic ranking or causal success rates.
