// lib/private-diagnostic/steps.ts
var stepLabels = {
  observe: [
    "\u767A\u751F\u5834\u9762\u3068\u5BFE\u8C61\u3092\u78BA\u8A8D",
    "Check the target and when the problem occurs"
  ],
  files: [
    "\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u306E\u691C\u8A3C\u624B\u9806\u3092\u78BA\u8A8D",
    "Check how to verify the distributed files"
  ],
  graphics: [
    "\u63CF\u753B\u74B0\u5883\u3068\u30C9\u30E9\u30A4\u30D0\u30FC\u7248\u3092\u7167\u5408",
    "Cross-check the graphics environment and driver version"
  ],
  runtime: [
    "\u5FC5\u8981\u30E9\u30F3\u30BF\u30A4\u30E0\u306E\u516C\u5F0F\u8981\u4EF6\u3092\u7167\u5408",
    "Cross-check the official runtime requirements"
  ],
  space: [
    "\u5BFE\u8C61\u30C9\u30E9\u30A4\u30D6\u306E\u7A7A\u304D\u5BB9\u91CF\u3092\u78BA\u8A8D",
    "Check free space on the target drive"
  ],
  memory: [
    "\u4E0D\u8981\u306A\u30A2\u30D7\u30EA\u3092\u9589\u3058\u305F\u6761\u4EF6\u3067\u6BD4\u8F03",
    "Compare with unnecessary applications closed"
  ],
  stop: ["PC\u5168\u4F53\u306E\u7570\u5E38\u306A\u3089\u518D\u73FE\u3092\u4E2D\u6B62", "Stop reproducing system-wide problems"],
  "wilds-steam-client-review": [
    "Steam\u5074\u306E\u8FFD\u52A0\u69CB\u6210\u3092\u5C0E\u5165\u5143\u3068\u7167\u5408",
    "Cross-check Steam-side add-ons with their source"
  ],
  "wilds-stop": [
    "PC\u5168\u4F53\u306E\u7570\u5E38\u304C\u3042\u308B\u306E\u3067\u518D\u73FE\u3092\u6B62\u3081\u308B",
    "Stop reproducing the issue because it affects the whole PC"
  ],
  "wilds-security": [
    "\u30D6\u30ED\u30C3\u30AF\u901A\u77E5\u304C\u3042\u308B\u5834\u5408\u306F\u4FDD\u8B77\u5C65\u6B74\u3092\u78BA\u8A8D",
    "Check Protection history if there is a blocking notification"
  ],
  "wilds-compatibility": [
    "\u4E92\u63DB\u30E2\u30FC\u30C9\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u308B\u304B\u78BA\u8A8D",
    "Check whether compatibility mode is enabled"
  ],
  "wilds-admin-flag": [
    "\u7BA1\u7406\u8005\u5B9F\u884C\u306E\u767B\u9332\u3092\u73FE\u5728\u306E\u753B\u9762\u3067\u7167\u5408",
    "Cross-check the administrator setting in the current UI"
  ],
  "wilds-mods": [
    "\u81EA\u5206\u3067\u5165\u308C\u305FMOD\u30FB\u63CF\u753B\u30C4\u30FC\u30EB\u3092\u78BA\u8A8D",
    "Check mods and graphics tools you installed yourself"
  ],
  "wilds-capture": [
    "\u9332\u753B/\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u3092\u7D42\u4E86\u3057\u305F\u6761\u4EF6\u30681\u56DE\u6BD4\u8F03",
    "Compare once with recording tools/overlays closed"
  ],
  "wilds-traces": [
    "\u898B\u3064\u304B\u3063\u305F\u8FFD\u52A0\u30C4\u30FC\u30EB\u540D\u306E\u75D5\u8DE1\u3092\u78BA\u8A8D",
    "Check the detected traces of add-on tool names"
  ],
  "wilds-files": [
    "Steam\u306E\u6574\u5408\u6027\u78BA\u8A8D\u30921\u56DE\u884C\u3046",
    "Verify file integrity in Steam once"
  ],
  "wilds-textures": [
    "\u9AD8\u89E3\u50CF\u5EA6\u30C6\u30AF\u30B9\u30C1\u30E3DLC\u3092\u78BA\u8A8D",
    "Check the high-resolution texture DLC"
  ],
  "wilds-driver": [
    "\u5B9F\u969B\u306EGPU\u30C9\u30E9\u30A4\u30D0\u30FC\u7248\u3068\u516C\u5F0F\u60C5\u5831\u3092\u7167\u5408",
    "Cross-check the actual GPU driver version with official information"
  ],
  "wilds-requirements": [
    "\u516C\u5F0F\u306E\u5FC5\u8981\u74B0\u5883\u3068\u306E\u672A\u78BA\u8A8D\u70B9\u3092\u7167\u5408",
    "Cross-check unverified points in the official system requirements"
  ],
  "wilds-records": [
    "CrashReport\u3068\u8A66\u3057\u305F\u7D50\u679C\u3092\u4FDD\u7BA1\u3057\u3066\u76F8\u8AC7",
    "Keep CrashReports and test results, then seek support"
  ],
  "game-context": [
    "\u9078\u3093\u3060\u672C\u4F53\u30FB\u767A\u751F\u5834\u9762\u3068\u516C\u5F0F\u60C5\u5831\u3092\u7167\u5408",
    "Cross-check the selected executable and scene with official information"
  ],
  "game-black-screen": [
    "\u9ED2\u753B\u9762\u304C\u30B2\u30FC\u30E0\u5185\u304BPC\u5168\u4F53\u304B\u3092\u5206\u3051\u308B",
    "Determine whether the black screen affects the game or the whole PC"
  ],
  "game-freeze": [
    "\u30B2\u30FC\u30E0\u306E\u5FDC\u7B54\u505C\u6B62\u3068\u51E6\u7406\u5F85\u3061\u3092\u5206\u3051\u308B",
    "Distinguish a game hang from waiting for processing"
  ],
  "game-performance": [
    "\u540C\u3058\u5834\u9762\u30671\u9805\u76EE\u3060\u3051\u753B\u8CEA\u3092\u6BD4\u8F03",
    "Compare one graphics setting in the same scene"
  ],
  "game-stutter": [
    "\u30AB\u30AF\u3064\u304F\u6761\u4EF6\u3068\u51E6\u7406\u5F85\u3061\u3092\u78BA\u8A8D",
    "Check when stuttering occurs and whether processing is still underway"
  ],
  "game-capture": [
    "\u5229\u7528\u4E2D\u306E\u9332\u753B/\u30AA\u30FC\u30D0\u30FC\u30EC\u30A4\u30921\u3064\u305A\u3064\u6BD4\u8F03",
    "Compare recording tools and overlays one at a time"
  ],
  "game-mods": [
    "\u8FFD\u52A0\u30C4\u30FC\u30EB\u306E\u5C0E\u5165\u5143\u3068\u5BFE\u5FDC\u7248\u3092\u78BA\u8A8D",
    "Check the source and supported versions of add-on tools"
  ],
  "game-compatibility": [
    "\u4E92\u63DB\u30E2\u30FC\u30C9/\u7BA1\u7406\u8005\u5B9F\u884C\u306E\u767B\u9332\u3092\u78BA\u8A8D",
    "Check registered compatibility and administrator settings"
  ],
  "game-steam-client": [
    "Steam\u5074\u306E\u8FFD\u52A0\u69CB\u6210\u3092\u5C0E\u5165\u5143\u3068\u7167\u5408",
    "Cross-check Steam-side add-ons with their source"
  ],
  "game-records": [
    "\u8A18\u9332\u3092\u4FDD\u7BA1\u3057\u3066\u30B2\u30FC\u30E0\u306E\u516C\u5F0F\u7A93\u53E3\u3078",
    "Keep the records and consult the game's official support"
  ]
};

// lib/diagnostic-feedback/contract.ts
var MAX_REPORT_BYTES = 4096;
var actionIds = [
  "wilds-files",
  "wilds-driver",
  "wilds-capture",
  "wilds-admin-flag",
  "wilds-compatibility",
  "wilds-mods",
  "wilds-traces",
  "wilds-textures",
  "wilds-security",
  "wilds-requirements",
  "wilds-records",
  "wilds-stop",
  "wilds-steam-client-review"
];
var symptoms = [
  "launch-crash",
  "black-screen",
  "graphics-error",
  "shader-preparation",
  "in-game-crash",
  "unknown"
];
var outcomes = [
  "resolved",
  "improved",
  "unchanged",
  "worse",
  "not-tried",
  "unknown"
];
var object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var hasOnly = (v, keys) => Object.keys(v).every((k) => keys.includes(k));
var oneOf = (v, choices) => typeof v === "string" && choices.includes(v);
var version = (v) => typeof v === "string" && v.length <= 23 && /^\d{1,5}(\.\d{1,5}){0,3}$/.test(v);
function parseReport(value) {
  if (!object(value) || !hasOnly(value, [
    "schema_version",
    "game_id",
    "symptom",
    "source",
    "tool_version",
    "rule_version",
    "os_family",
    "gpu_vendor",
    "driver_version",
    "actions"
  ]) || value.schema_version !== 1 || value.game_id !== "monster-hunter-wilds" || !oneOf(value.symptom, symptoms) || !oneOf(value.source, ["native-windows", "web-manual"]) || !version(value.tool_version) || !version(value.rule_version))
    throw new Error("\u5F62\u5F0F\u307E\u305F\u306F\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093");
  if (value.os_family !== void 0 && !oneOf(value.os_family, ["windows-10", "windows-11", "other", "unknown"]))
    throw new Error("OS\u5206\u985E\u304C\u4E0D\u6B63\u3067\u3059");
  if (value.gpu_vendor !== void 0 && !oneOf(value.gpu_vendor, ["nvidia", "amd", "intel", "other", "unknown"]))
    throw new Error("GPU\u5206\u985E\u304C\u4E0D\u6B63\u3067\u3059");
  if (value.driver_version !== void 0 && !version(value.driver_version))
    throw new Error("\u30C9\u30E9\u30A4\u30D0\u30FC\u7248\u304C\u4E0D\u6B63\u3067\u3059");
  if (!Array.isArray(value.actions) || value.actions.length < 1 || value.actions.length > 8)
    throw new Error("\u624B\u9806\u306F1\u301C8\u4EF6\u3067\u3059");
  const seen = /* @__PURE__ */ new Set();
  for (const action of value.actions) {
    if (!object(action) || !hasOnly(action, ["action_id", "outcome", "evidence"]) || !oneOf(action.action_id, actionIds) || !oneOf(action.outcome, outcomes) || action.evidence !== "self-report" || seen.has(action.action_id))
      throw new Error("\u624B\u9806\u30FB\u7D50\u679C\u304C\u4E0D\u6B63\u3067\u3059");
    seen.add(action.action_id);
  }
  if (new TextEncoder().encode(JSON.stringify(value)).length > MAX_REPORT_BYTES)
    throw new Error("\u30D5\u30A1\u30A4\u30EB\u306F4KB\u4EE5\u5185\u3067\u3059");
  return {
    schema_version: 1,
    game_id: "monster-hunter-wilds",
    symptom: value.symptom,
    source: value.source,
    tool_version: value.tool_version,
    rule_version: value.rule_version,
    ...value.os_family ? { os_family: value.os_family } : {},
    ...value.gpu_vendor ? { gpu_vendor: value.gpu_vendor } : {},
    ...value.driver_version ? { driver_version: value.driver_version } : {},
    actions: value.actions.map((a) => ({
      action_id: a.action_id,
      outcome: a.outcome,
      evidence: "self-report"
    }))
  };
}
function parseEnvelope(value, deletion = false) {
  if (!object(value) || !hasOnly(
    value,
    deletion ? ["receipt_id", "delete_key"] : ["receipt_id", "delete_key", "report", "consent_version"]
  ) || typeof value.receipt_id !== "string" || !/^[a-f0-9]{32}$/.test(value.receipt_id) || typeof value.delete_key !== "string" || !/^[a-f0-9]{64}$/.test(value.delete_key) || !deletion && value.consent_version !== 1)
    throw new Error("\u9001\u4FE1\u5F62\u5F0F\u304C\u4E0D\u6B63\u3067\u3059");
  return {
    receipt_id: value.receipt_id,
    delete_key: value.delete_key,
    report: deletion ? void 0 : parseReport(value.report)
  };
}

// lib/private-diagnostic/contract.ts
var MAX_REPORT_BYTES2 = 4096;
var readStates = [
  "not-read",
  "complete",
  "access-denied",
  "unavailable",
  "timed-out",
  "partial",
  "cancelled"
];
var symptoms2 = [
  "launch",
  "crash",
  "black-screen",
  "freeze",
  "low-fps",
  "stutter",
  "other"
];
function record(value, keys) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length !== keys.length || !keys.every((k) => Object.hasOwn(value, k)))
    throw Error("Unsupported fields");
}
function member(value, values) {
  if (!values.includes(value)) throw Error("Unsupported value");
}
function parseReport2(value) {
  record(value, [
    "next_step",
    "schema_version",
    "kind",
    "tool_version",
    "game",
    "symptom",
    "observed",
    "self_report"
  ]);
  if (value.next_step !== null && (typeof value.next_step !== "string" || !Object.hasOwn(stepLabels, value.next_step)))
    throw Error("Invalid next step");
  member(value.schema_version, [1]);
  member(value.kind, ["private-diagnostic"]);
  if (typeof value.tool_version !== "string" || value.tool_version.length > 23 || !/^\d{1,5}(\.\d{1,5}){0,3}$/.test(value.tool_version))
    throw Error("Invalid version");
  member(value.game, ["general", "wilds"]);
  member(value.symptom, symptoms2);
  record(value.observed, ["application", "system"]);
  const a = value.observed.application, s = value.observed.system;
  record(a, [
    "status",
    "exact_matches",
    "name_matches",
    "other_target_records",
    "examined",
    "unsupported",
    "limit_reached"
  ]);
  record(s, ["status", "restart_record", "display_record"]);
  member(a.status, readStates);
  member(s.status, readStates);
  for (const key of [
    "exact_matches",
    "name_matches",
    "other_target_records",
    "examined",
    "unsupported"
  ])
    if (!Number.isInteger(a[key]) || Number(a[key]) < 0 || Number(a[key]) > 300)
      throw Error("Invalid count");
  if (Number(a.exact_matches) + Number(a.name_matches) + Number(a.other_target_records) + Number(a.unsupported) > Number(a.examined))
    throw Error("Inconsistent counts");
  member(a.limit_reached, [true, false]);
  member(s.restart_record, [true, false]);
  member(s.display_record, [true, false]);
  if (a.status === "complete" && (a.limit_reached || a.unsupported !== 0))
    throw Error("Incomplete evidence");
  record(value.self_report, ["whole_pc_issue", "trial"]);
  member(value.self_report.whole_pc_issue, ["unknown", "yes", "no"]);
  member(value.self_report.trial, [
    "not-tested",
    "better",
    "same",
    "worse",
    "unsure"
  ]);
  if (new TextEncoder().encode(JSON.stringify(value)).length > MAX_REPORT_BYTES2)
    throw Error("Report too large");
  return {
    next_step: value.next_step,
    schema_version: 1,
    kind: "private-diagnostic",
    tool_version: value.tool_version,
    game: value.game,
    symptom: value.symptom,
    observed: {
      application: {
        status: a.status,
        exact_matches: Number(a.exact_matches),
        name_matches: Number(a.name_matches),
        other_target_records: Number(a.other_target_records),
        examined: Number(a.examined),
        unsupported: Number(a.unsupported),
        limit_reached: a.limit_reached
      },
      system: {
        status: s.status,
        restart_record: s.restart_record,
        display_record: s.display_record
      }
    },
    self_report: {
      whole_pc_issue: value.self_report.whole_pc_issue,
      trial: value.self_report.trial
    }
  };
}
function parseEnvelope2(value, deletion = false) {
  if (deletion)
    return { ...parseEnvelope(value, true), report: void 0 };
  record(value, ["receipt_id", "delete_key", "report", "consent_version"]);
  if (value.consent_version !== 1) throw Error("Consent required");
  const identity = parseEnvelope(
    { receipt_id: value.receipt_id, delete_key: value.delete_key },
    true
  );
  return { ...identity, report: parseReport2(value.report) };
}

// lib/diagnostic-feedback/json.ts
function strictJson(text) {
  let i = 0;
  const ws = () => {
    while (/\s/.test(text[i] || "") && i < text.length) i++;
  };
  const str = () => {
    const start = i++;
    while (i < text.length) {
      if (text[i] === "\\") {
        i += 2;
        continue;
      }
      if (text[i++] === '"') return JSON.parse(text.slice(start, i));
    }
    throw new Error("string");
  };
  const value = (depth) => {
    if (depth > 12) throw new Error("depth");
    ws();
    if (text[i] === "{") {
      i++;
      ws();
      const keys = /* @__PURE__ */ new Set();
      if (text[i] === "}") {
        i++;
        return;
      }
      while (true) {
        ws();
        if (text[i] !== '"') throw new Error("key");
        const key = str();
        if (keys.has(key)) throw new Error("duplicate");
        keys.add(key);
        ws();
        if (text[i++] !== ":") throw new Error("colon");
        value(depth + 1);
        ws();
        const c = text[i++];
        if (c === "}") return;
        if (c !== ",") throw new Error("comma");
      }
    } else if (text[i] === "[") {
      i++;
      ws();
      if (text[i] === "]") {
        i++;
        return;
      }
      while (true) {
        value(depth + 1);
        ws();
        const c = text[i++];
        if (c === "]") return;
        if (c !== ",") throw new Error("comma");
      }
    } else if (text[i] === '"') {
      str();
    } else {
      const start = i;
      while (i < text.length && !/[\s,\]}]/.test(text[i])) i++;
      if (start === i) throw new Error("value");
      JSON.parse(text.slice(start, i));
    }
  };
  value(0);
  ws();
  if (i !== text.length) throw new Error("trailing");
  return JSON.parse(text);
}

// lib/diagnostic-feedback/rate-limit.ts
import { isIP } from "node:net";
var encoder = new TextEncoder();
function feedbackNetwork(ip) {
  if (!ip || ip.length > 45 || ip.includes("%")) return null;
  if (isIP(ip) === 4) return `v4:${ip}`;
  if (isIP(ip) !== 6) return null;
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  const halves = canonical.split("::");
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const words = halves.length === 2 ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right] : left;
  const numbers = words.map((word) => parseInt(word, 16));
  if (numbers.slice(0, 5).every((word) => word === 0) && numbers[5] === 65535)
    return `v4:${numbers[6] >> 8}.${numbers[6] & 255}.${numbers[7] >> 8}.${numbers[7] & 255}`;
  return `v6:${numbers.slice(0, 4).map((word) => word.toString(16)).join(":")}/64`;
}

// lib/private-diagnostic/rate-limit.ts
var encoder2 = new TextEncoder();
async function dailySalt(db) {
  const select = () => db.prepare(
    "SELECT day,salt FROM private_diagnostic_rate_salt WHERE singleton=1 AND day=CAST(unixepoch()/86400 AS INTEGER)"
  ).first();
  let row = await select();
  if (!row) {
    const result = await db.prepare(
      `INSERT INTO private_diagnostic_rate_salt(singleton,day,salt)
       VALUES(1,CAST(unixepoch()/86400 AS INTEGER),?)
       ON CONFLICT(singleton) DO UPDATE SET day=excluded.day,salt=excluded.salt
       WHERE private_diagnostic_rate_salt.day<excluded.day`
    ).bind(
      Array.from(
        crypto.getRandomValues(new Uint8Array(32)),
        (v) => v.toString(16).padStart(2, "0")
      ).join("")
    ).run();
    if (!result.success) throw new Error("quota unavailable");
    row = await select();
  }
  if (!row || !/^[a-f0-9]{64}$/.test(row.salt))
    throw new Error("quota unavailable");
  return row;
}
async function takePrivateDiagnosticQuota(db, bucket, ip) {
  const network = feedbackNetwork(ip);
  if (!network) throw new Error("network unavailable");
  const row = await dailySalt(db);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder2.encode(row.salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest2 = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder2.encode(`private-diagnostic-v1:${row.day}:${bucket}:${network}`)
  );
  const fingerprint = Array.from(
    new Uint8Array(digest2),
    (v) => v.toString(16).padStart(2, "0")
  ).join("");
  const results = await db.batch([
    db.prepare(
      "DELETE FROM private_diagnostic_rate_attempts WHERE created_at<unixepoch()-60"
    ),
    db.prepare(
      `INSERT INTO private_diagnostic_rate_attempts(id,bucket,network_hash,created_at)
       SELECT ?,?,?,unixepoch()
       WHERE EXISTS(SELECT 1 FROM private_diagnostic_rate_salt WHERE singleton=1 AND day=?
                    AND salt=? AND day=CAST(unixepoch()/86400 AS INTEGER))
       AND (SELECT count(*) FROM private_diagnostic_rate_attempts WHERE bucket=?)<10
       AND (SELECT count(*) FROM private_diagnostic_rate_attempts WHERE bucket=? AND network_hash=?)<10`
    ).bind(
      crypto.randomUUID(),
      bucket,
      fingerprint,
      row.day,
      row.salt,
      bucket,
      bucket,
      fingerprint
    )
  ]);
  if (results.length !== 2 || results.some((result) => !result.success))
    throw new Error("quota unavailable");
  return results[1].meta.changes === 1;
}

// lib/private-diagnostic/service.ts
var privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "application/json"
};
var reply = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: privateHeaders });
var hash = async (s) => Array.from(
  new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))
  )
).map((v) => v.toString(16).padStart(2, "0")).join("");
async function healthy(env, now) {
  if (env.PRIVATE_DIAGNOSTIC_ENABLED !== "true" || env.PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED !== "true" || !env.PRIVATE_DIAGNOSTIC_DB)
    return false;
  const row = await env.PRIVATE_DIAGNOSTIC_DB.prepare(
    "SELECT last_cleanup FROM private_diagnostic_retention_health WHERE singleton=1"
  ).first();
  return !!row && row.last_cleanup <= now && row.last_cleanup >= now - 7200;
}
async function body(request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    throw new Error("type");
  if (Number(request.headers.get("content-length") || 0) > 6144 || !request.body)
    throw new Error("size");
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 6144) {
      await reader.cancel();
      throw new Error("size");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.length;
  }
  return strictJson(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
async function handlePrivateDiagnostic(request, env, now = Math.floor(Date.now() / 1e3)) {
  try {
    if (!["GET", "POST", "DELETE"].includes(request.method))
      return reply({ error: "method" }, 405);
    if (new URL(request.url).search || request.method !== "GET" && request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") && request.headers.get("sec-fetch-site") !== "same-origin")
      return reply({ error: "origin" }, 403);
    if (!env.PRIVATE_DIAGNOSTIC_DB)
      return request.method === "GET" ? reply({ enabled: false, canDelete: false }) : reply({ error: "\u53D7\u4ED8\u306F\u6E96\u5099\u4E2D\u3067\u3059" }, 503);
    if (env.PRIVATE_DIAGNOSTIC_ENABLED !== "true") {
      if (request.method === "GET")
        return reply({ enabled: false, canDelete: true });
      if (request.method === "POST")
        return reply({ error: "\u53D7\u4ED8\u306F\u6E96\u5099\u4E2D\u3067\u3059" }, 503);
    }
    if (!await takePrivateDiagnosticQuota(
      env.PRIVATE_DIAGNOSTIC_DB,
      request.method === "DELETE" ? "delete" : "intake",
      request.headers.get("cf-connecting-ip")
    ))
      return reply(
        {
          error: "\u6642\u9593\u3092\u7A7A\u3051\u3066\u304F\u3060\u3055\u3044",
          ...request.method === "GET" ? { enabled: false, canDelete: true } : {}
        },
        429
      );
    if (request.method !== "DELETE") {
      const ready = await healthy(env, now).catch(() => false);
      if (request.method === "GET")
        return reply({ enabled: ready, canDelete: true });
      if (!ready) return reply({ error: "\u53D7\u4ED8\u306F\u6E96\u5099\u4E2D\u3067\u3059" }, 503);
    }
    let input;
    try {
      input = parseEnvelope2(await body(request), request.method === "DELETE");
    } catch {
      return reply({ error: "\u5165\u529B\u5F62\u5F0F\u304C\u4E0D\u6B63\u3067\u3059\uFF08\u6700\u59276KB\uFF09" }, 400);
    }
    const db = env.PRIVATE_DIAGNOSTIC_DB;
    const keyHash = await hash(input.delete_key);
    if (input.receipt_id.slice(8) !== keyHash.slice(0, 24))
      return reply({ error: "\u53D7\u4ED8\u756A\u53F7\u3068\u524A\u9664\u30AD\u30FC\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093" }, 409);
    if (request.method === "DELETE") {
      if (await db.prepare(
        "SELECT receipt_id FROM private_diagnostic_report_tombstones WHERE receipt_id=? AND delete_hash=?"
      ).bind(input.receipt_id, keyHash).first())
        return reply({ ok: true });
      const issued2 = parseInt(input.receipt_id.slice(0, 8), 16);
      const existing = await db.prepare(
        "SELECT receipt_id FROM private_diagnostic_reports WHERE receipt_id=? AND delete_hash=?"
      ).bind(input.receipt_id, keyHash).first();
      if (!existing && (issued2 > now + 300 || issued2 < now - 86400))
        return reply(
          { error: "\u30AD\u30E3\u30F3\u30BB\u30EB\u7528\u53D7\u4ED8\u756A\u53F7\u306E\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059" },
          400
        );
      const results = await db.batch([
        db.prepare(
          "INSERT OR IGNORE INTO private_diagnostic_report_tombstones(receipt_id,delete_hash,expires_at) SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM private_diagnostic_reports WHERE receipt_id=? AND delete_hash<>?) AND ((SELECT count(*) FROM private_diagnostic_reports)+(SELECT count(*) FROM private_diagnostic_report_tombstones)<1000 OR EXISTS(SELECT 1 FROM private_diagnostic_reports WHERE receipt_id=? AND delete_hash=?))"
        ).bind(
          input.receipt_id,
          keyHash,
          now + 30 * 86400,
          input.receipt_id,
          keyHash,
          input.receipt_id,
          keyHash
        ),
        db.prepare(
          "DELETE FROM private_diagnostic_reports WHERE receipt_id=? AND delete_hash=? AND EXISTS(SELECT 1 FROM private_diagnostic_report_tombstones WHERE receipt_id=? AND delete_hash=?)"
        ).bind(input.receipt_id, keyHash, input.receipt_id, keyHash)
      ]);
      if (results.length !== 2 || results.some((r) => !r.success))
        throw new Error("storage");
      if (results[0].meta.changes !== 1)
        return reply(
          { error: "Cancellation capacity reached; no deletion confirmed" },
          429
        );
      return reply({ ok: true });
    }
    if (await db.prepare(
      "SELECT receipt_id FROM private_diagnostic_report_tombstones WHERE receipt_id=?"
    ).bind(input.receipt_id).first())
      return reply({ error: "\u524A\u9664\u6E08\u307F\u306E\u53D7\u4ED8\u756A\u53F7\u3067\u3059" }, 409);
    const json = JSON.stringify(input.report);
    const previous = await db.prepare(
      "SELECT delete_hash,report_json,expires_at FROM private_diagnostic_reports WHERE receipt_id=? AND expires_at>?"
    ).bind(input.receipt_id, now).first();
    if (previous)
      return previous.delete_hash === keyHash && previous.report_json === json ? reply({
        ok: true,
        receipt_id: input.receipt_id,
        expires_at: previous.expires_at
      }) : reply({ error: "\u53D7\u4ED8\u756A\u53F7\u304C\u7AF6\u5408\u3057\u3066\u3044\u307E\u3059" }, 409);
    const issued = parseInt(input.receipt_id.slice(0, 8), 16);
    if (issued > now + 300 || issued < now - 86400)
      return reply(
        {
          error: "\u53D7\u4ED8\u756A\u53F7\u306E\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059\u3002\u65B0\u3057\u3044\u9001\u4FE1\u5185\u5BB9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044"
        },
        400
      );
    const values = [
      input.receipt_id,
      keyHash,
      json,
      now,
      now + 30 * 86400,
      Math.floor(now / 86400) * 86400,
      input.receipt_id
    ];
    const result = await db.prepare(
      `INSERT OR IGNORE INTO private_diagnostic_reports(receipt_id,delete_hash,report_json,consent_version,created_at,expires_at) SELECT ?,?,?,1,?,? WHERE (SELECT count(*) FROM private_diagnostic_reports WHERE created_at>=?)<200 AND NOT EXISTS(SELECT 1 FROM private_diagnostic_report_tombstones WHERE receipt_id=?) AND (SELECT count(*) FROM private_diagnostic_reports)+(SELECT count(*) FROM private_diagnostic_report_tombstones)<1000`
    ).bind(...values).run();
    if (!result.success) throw new Error("storage");
    if (result.meta.changes !== 1) {
      const retry = await db.prepare(
        "SELECT delete_hash,report_json,expires_at FROM private_diagnostic_reports WHERE receipt_id=? AND expires_at>?"
      ).bind(input.receipt_id, now).first();
      if (retry?.delete_hash === keyHash && retry.report_json === json)
        return reply({
          ok: true,
          receipt_id: input.receipt_id,
          expires_at: retry.expires_at
        });
      return reply({ error: "\u53D7\u4ED8\u4E0A\u9650\u307E\u305F\u306F\u53D7\u4ED8\u756A\u53F7\u306E\u7AF6\u5408\u3067\u3059" }, 429);
    }
    return reply(
      { ok: true, receipt_id: input.receipt_id, expires_at: now + 30 * 86400 },
      201
    );
  } catch {
    return reply(
      { error: "\u4FDD\u5B58\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u540C\u3058\u53D7\u4ED8\u756A\u53F7\u3067\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044" },
      503
    );
  }
}

// lib/private-diagnostic/admin.ts
async function handlePrivateAdmin(request, env, authorize, now = Math.floor(Date.now() / 1e3)) {
  const reply3 = (body2, status = 200) => new Response(JSON.stringify(body2), { status, headers: privateHeaders });
  if (env.PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED !== "true" || !await authorize().catch(() => false))
    return reply3({ error: "Owner authentication required" }, 401);
  if (request.method !== "GET") return reply3({ error: "method" }, 405);
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return reply3({ error: "origin" }, 403);
  if (!env.PRIVATE_DIAGNOSTIC_DB)
    return reply3({ error: "Private inbox unavailable" }, 503);
  try {
    const url = new URL(request.url);
    if ([...url.searchParams.keys()].some((k) => k !== "id" && k !== "before") || url.searchParams.getAll("id").length > 1 || url.searchParams.getAll("before").length > 1)
      return reply3({ error: "query" }, 400);
    const id = url.searchParams.get("id"), before = url.searchParams.get("before");
    if (id && before) return reply3({ error: "query" }, 400);
    if (id && !/^[a-f0-9]{32}$/.test(id) || before && !/^[a-f0-9]{32}$/.test(before))
      return reply3({ error: "query" }, 400);
    const db = env.PRIVATE_DIAGNOSTIC_DB;
    if (id) {
      const row = await db.prepare(
        "SELECT receipt_id,report_json,created_at,expires_at FROM private_diagnostic_reports WHERE receipt_id=? AND expires_at>?"
      ).bind(id, now).first();
      if (!row) return reply3({ error: "Not found" }, 404);
      return reply3({
        receipt_id: row.receipt_id,
        created_at: row.created_at,
        expires_at: row.expires_at,
        report: parseReport2(JSON.parse(row.report_json))
      });
    }
    const result = await db.prepare(
      "SELECT receipt_id,created_at,expires_at FROM private_diagnostic_reports WHERE expires_at>? AND receipt_id<? ORDER BY receipt_id DESC LIMIT 21"
    ).bind(now, before || "g").all();
    if (!result.success) throw Error("storage");
    return reply3({
      items: result.results.slice(0, 20),
      next: result.results.length > 20 ? result.results[19].receipt_id : null
    });
  } catch {
    return reply3({ error: "Private inbox could not be read" }, 503);
  }
}

// lib/private-diagnostic/notifications.ts
import { timingSafeEqual } from "node:crypto";
async function handleNotificationMetadata(request, env, now = Math.floor(Date.now() / 1e3)) {
  const reply3 = (body2, status = 200) => new Response(JSON.stringify(body2), { status, headers: privateHeaders });
  if (env.PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED !== "true") return reply3({ error: "unavailable" }, 404);
  if (request.method !== "GET") return reply3({ error: "method" }, 405);
  if (new URL(request.url).search || request.headers.has("cookie") || request.headers.has("origin")) return reply3({ error: "request" }, 400);
  const token = request.headers.get("authorization")?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  const expected = env.PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256;
  if (!token || !expected || !/^[a-f0-9]{64}$/.test(expected)) return reply3({ error: "unauthorized" }, 401);
  const actual = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
  const verifier = Uint8Array.from(expected.match(/../g), (b) => parseInt(b, 16));
  if (!timingSafeEqual(actual, verifier)) return reply3({ error: "unauthorized" }, 401);
  if (!env.PRIVATE_DIAGNOSTIC_DB) return reply3({ error: "unavailable" }, 503);
  try {
    const row = await env.PRIVATE_DIAGNOSTIC_DB.prepare("SELECT cursor FROM private_diagnostic_notification_state WHERE singleton=1 AND expires_at>?").bind(now).first();
    if (row && !/^[a-f0-9]{32}$/.test(row.cursor)) throw Error("shape");
    return reply3({ version: 1, cursor: row?.cursor ?? null });
  } catch {
    return reply3({ error: "unavailable" }, 503);
  }
}

// cloudflare/private-diagnostic-cleanup.ts
var cleanup = {
  async scheduled(_event, env) {
    if (!env.PRIVATE_DIAGNOSTIC_DB) throw new Error("PRIVATE_DIAGNOSTIC_DB binding is required");
    const now = Math.floor(Date.now() / 1e3);
    try {
      const results = await env.PRIVATE_DIAGNOSTIC_DB.batch([
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          "DELETE FROM private_diagnostic_rate_attempts WHERE created_at<unixepoch()-60"
        ),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          "DELETE FROM private_diagnostic_rate_salt WHERE day<CAST(unixepoch()/86400 AS INTEGER)"
        ),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          "DELETE FROM private_diagnostic_report_tombstones WHERE expires_at <= ?"
        ).bind(now),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          "DELETE FROM private_diagnostic_reports WHERE expires_at <= ?"
        ).bind(now),
        env.PRIVATE_DIAGNOSTIC_DB.prepare(
          "INSERT INTO private_diagnostic_retention_health(singleton,last_cleanup) VALUES(1,?) ON CONFLICT(singleton) DO UPDATE SET last_cleanup=excluded.last_cleanup"
        ).bind(now)
      ]);
      if (results.length !== 5 || results.some((result) => !result.success))
        throw new Error("Diagnostic retention cleanup failed");
    } catch {
      console.error("private_diagnostic_cleanup_failed");
      throw new Error("Diagnostic retention cleanup failed");
    }
    console.log("private_diagnostic_cleanup_success");
  },
  fetch() {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" }
    });
  }
};
var private_diagnostic_cleanup_default = cleanup;

// ops/private-diagnostic-qa/fixture.json
var fixture_default = {
  schema_version: 1,
  kind: "private-diagnostic",
  tool_version: "0.6.1",
  game: "general",
  symptom: "crash",
  observed: {
    application: { status: "complete", exact_matches: 0, name_matches: 0, other_target_records: 0, examined: 0, unsupported: 0, limit_reached: false },
    system: { status: "unavailable", restart_record: false, display_record: false }
  },
  self_report: { whole_pc_issue: "no", trial: "not-tested" },
  next_step: "game-context"
};

// ops/private-diagnostic-qa/budget.mjs
var limits = Object.freeze({ general: 12, deletion: 8, admin: 8, notification: 4, cleanup: 4 });
var mode = "finite-synthetic-v1";
var deny = () => new Response(null, { status: 503 });
var FiniteQaBudget = class {
  constructor(state, env, clock = () => Math.floor(Date.now() / 1e3)) {
    this.state = state;
    this.env = env;
    this.clock = clock;
  }
  async fetch(request) {
    try {
      if (request.method !== "POST" || new URL(request.url).search) return deny();
      const path = new URL(request.url).pathname;
      if (!["/admit", "/close", "/claim"].includes(path)) return deny();
      if (this.env.PRIVATE_QA_MODE !== mode) return deny();
      const start = Number(this.env.PRIVATE_QA_START), end = Number(this.env.PRIVATE_QA_END), now = this.clock();
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || !Number.isSafeInteger(now) || start <= 0 || end <= start || end - start > 900) return deny();
      const kind = request.headers.get("x-qa-kind");
      if (path === "/admit" && !Object.hasOwn(limits, kind)) return deny();
      return await this.state.storage.transaction(async (store) => {
        let saved = await store.get("finite-qa-v1");
        if (saved && (!valid(saved) || saved.start !== start || saved.end !== end || saved.closed || now < saved.last)) return deny();
        if (!saved) saved = { start, end, last: start, closed: false, used: Object.fromEntries(Object.keys(limits).map((k) => [k, 0])) };
        if (path === "/close" || now >= end) {
          saved.closed = true;
          saved.last = Math.max(now, saved.last);
          await store.put("finite-qa-v1", saved);
          return path === "/close" ? new Response(null, { status: 204 }) : deny();
        }
        if (now < start) return deny();
        if (path === "/claim") {
          if (saved.claimed) return deny();
          saved.claimed = true;
          saved.last = now;
          await store.put("finite-qa-v1", saved);
          return new Response(null, { status: 204 });
        }
        if (saved.used[kind] >= limits[kind]) return new Response(null, { status: 429 });
        saved.used[kind]++;
        saved.last = now;
        await store.put("finite-qa-v1", saved);
        return new Response(null, { status: 204 });
      });
    } catch {
      return deny();
    }
  }
};
function valid(s) {
  return Number.isSafeInteger(s.start) && Number.isSafeInteger(s.end) && s.end > s.start && s.end - s.start <= 900 && Number.isSafeInteger(s.last) && s.last >= s.start && typeof s.closed === "boolean" && (s.claimed === void 0 || typeof s.claimed === "boolean") && s.used && Object.keys(s.used).length === Object.keys(limits).length && Object.entries(limits).every(([k, n]) => Number.isSafeInteger(s.used[k]) && s.used[k] >= 0 && s.used[k] <= n);
}
async function runFiniteQaStep(env, kind, authorize, syntheticOperation) {
  if (env.PRIVATE_QA_MODE !== mode || !env.PRIVATE_QA_GUARD || !Object.hasOwn(limits, kind) || !await authorize().catch(() => false)) throw Error("QA_CLOSED");
  const r = await env.PRIVATE_QA_GUARD.fetch(new Request("https://qa-budget.invalid/admit", { method: "POST", headers: { "x-qa-kind": kind } }));
  if (r.status !== 204) throw Error("QA_CLOSED");
  return syntheticOperation();
}

// ops/private-diagnostic-qa/existing-qa-policy.mjs
import { timingSafeEqual as timingSafeEqual2 } from "node:crypto";
var QA_ACCESS_MAX_WINDOW_MS = 60 * 60 * 1e3;
var QA_ACCESS_DIGEST = /^[a-f0-9]{64}(?![\s\S])/;
var QA_ACCESS_TOKEN = /^[\x21-\x7e]{43,128}(?![\s\S])/;
var QA_ACCESS_TIMESTAMP = /^[1-9][0-9]{12}(?![\s\S])/;
function qaAccessWindow(env, now = Date.now()) {
  if (!env || typeof env !== "object" || !["QA_ACCESS_SHA256", "QA_ACCESS_NOT_BEFORE", "QA_ACCESS_EXPIRES_AT"].every((key) => typeof env[key] === "string") || !QA_ACCESS_DIGEST.test(env.QA_ACCESS_SHA256) || !QA_ACCESS_TIMESTAMP.test(env.QA_ACCESS_NOT_BEFORE ?? "") || !QA_ACCESS_TIMESTAMP.test(env.QA_ACCESS_EXPIRES_AT ?? "")) return false;
  const start = Number(env.QA_ACCESS_NOT_BEFORE), end = Number(env.QA_ACCESS_EXPIRES_AT);
  return Number.isSafeInteger(now) && Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= now && now < end && end > start && end - start <= QA_ACCESS_MAX_WINDOW_MS;
}
async function qaAccessVerifier(passphrase) {
  if (typeof passphrase !== "string" || !QA_ACCESS_TOKEN.test(passphrase))
    throw new Error("QA access credential format is invalid.");
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(passphrase));
  return Array.from(new Uint8Array(bytes), (x) => x.toString(16).padStart(2, "0")).join("");
}

// ops/private-diagnostic-qa/driver.mjs
var tables = ["reports", "report_tombstones", "retention_health", "rate_salt", "rate_attempts", "notification_state"].map((n) => "private_diagnostic_" + n);
var origin = "https://synthetic.invalid";
var digest = async (s) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))), (v) => v.toString(16).padStart(2, "0")).join("");
var need = (ok) => {
  if (!ok) throw Error("QA_STOPPED");
};
var response = (ok, status) => new Response(JSON.stringify({ ok }), { status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
async function runFixedQa(env) {
  let claimed = false;
  const guard = (path) => env.PRIVATE_QA_GUARD.fetch(new Request("https://qa-budget.invalid/" + path, { method: "POST" }));
  const step = (kind, fn) => runFiniteQaStep(env, kind, async () => true, () => fn(env.PRIVATE_DIAGNOSTIC_DB));
  try {
    need(env.PRIVATE_QA_MODE === "finite-synthetic-v1" && env.PRIVATE_QA_GUARD && env.PRIVATE_DIAGNOSTIC_DB);
    need((await guard("claim")).status === 204);
    claimed = true;
    await step("admin", async (db) => {
      for (const t of tables) need(await db.prepare("SELECT count(*) n FROM " + t).first("n") === 0);
    });
    const now = Math.floor(Date.now() / 1e3), key = "1".repeat(64), hash2 = await digest(key);
    const envelope = { receipt_id: now.toString(16).padStart(8, "0") + hash2.slice(0, 24), delete_key: key, consent_version: 1, report: fixture_default };
    const runtime = (db) => ({ PRIVATE_DIAGNOSTIC_DB: db, PRIVATE_DIAGNOSTIC_ENABLED: "true", PRIVATE_DIAGNOSTIC_OWNER_REVIEW_ENABLED: "true" });
    const request = (method, value) => new Request(origin + "/api/private-diagnostic", { method, headers: { origin, "content-type": "application/json", "cf-connecting-ip": "192.0.2.1" }, ...value === void 0 ? {} : { body: JSON.stringify(value) } });
    await step("cleanup", (db) => private_diagnostic_cleanup_default.scheduled({}, runtime(db)));
    await step("general", async (db) => need((await handlePrivateDiagnostic(request("POST", {}), runtime(db))).status === 400));
    await step("general", async (db) => need([200, 201].includes((await handlePrivateDiagnostic(request("POST", envelope), runtime(db))).status)));
    await step("general", async (db) => need((await handlePrivateDiagnostic(request("POST", envelope), runtime(db))).status === 200));
    await step("admin", async (db) => {
      const r = await handlePrivateAdmin(new Request(origin + "/admin"), runtime(db), async () => true);
      need(r.status === 200 && (await r.json()).items.length === 1);
    });
    await step("admin", async (db) => {
      const r = await handlePrivateAdmin(new Request(origin + "/admin?id=" + envelope.receipt_id), runtime(db), async () => true);
      need(r.status === 200 && (await r.json()).report.kind === "private-diagnostic");
    });
    await step("notification", async (db) => {
      const token = "2".repeat(64);
      const r = await handleNotificationMetadata(new Request(origin + "/notification", { headers: { authorization: "Bearer " + token } }), { PRIVATE_DIAGNOSTIC_DB: db, PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED: "true", PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256: await digest(token) });
      need(r.status === 200 && !!(await r.json()).cursor);
    });
    const deletion = { receipt_id: envelope.receipt_id, delete_key: key };
    await step("deletion", async (db) => need((await handlePrivateDiagnostic(request("DELETE", deletion), runtime(db))).status === 200));
    await step("deletion", async (db) => need((await handlePrivateDiagnostic(request("DELETE", deletion), runtime(db))).status === 200));
    await step("general", async (db) => need((await handlePrivateDiagnostic(request("POST", envelope), runtime(db))).status === 409));
    await step("cleanup", async (db) => {
      const caps = [0, 1, 1, 1, 6, 1], snapshots = [];
      for (let i = 0; i < tables.length; i++) {
        const rows = (await db.prepare("SELECT * FROM " + tables[i] + " LIMIT " + (caps[i] + 1)).all()).results;
        need(rows.length <= caps[i]);
        snapshots.push(rows);
      }
      need(snapshots[1].every((r) => r.receipt_id === envelope.receipt_id && r.delete_hash === hash2));
      need(snapshots[2].every((r) => r.last_cleanup === now || Math.abs(r.last_cleanup - now) <= 2));
      need(snapshots[3].length === 1);
      const salt = snapshots[3][0];
      need(salt.singleton === 1 && salt.day === Math.floor(now / 86400));
      const hmac = await crypto.subtle.importKey("raw", new TextEncoder().encode(salt.salt), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const expected = {};
      for (const bucket of ["intake", "delete"]) expected[bucket] = Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", hmac, new TextEncoder().encode(`private-diagnostic-v1:${salt.day}:${bucket}:v4:192.0.2.1`))), (v) => v.toString(16).padStart(2, "0")).join("");
      need(snapshots[4].every((r) => r.network_hash === expected[r.bucket] && r.created_at >= now && r.created_at <= now + 900));
      need(snapshots[5].every((r) => r.singleton === 1 && r.expires_at >= now + 30 * 86400 && r.expires_at <= now + 30 * 86400 + 900));
      for (let i = 0; i < tables.length; i++) for (const row of snapshots[i]) {
        const cols = Object.keys(row);
        need(cols.every((c) => /^[a-z_]+$/.test(c)));
        await db.prepare("DELETE FROM " + tables[i] + " WHERE " + cols.map((c) => c + " IS ?").join(" AND ")).bind(...cols.map((c) => row[c])).run();
      }
    });
    await step("admin", async (db) => {
      for (const t of tables) need(await db.prepare("SELECT count(*) n FROM " + t).first("n") === 0);
    });
    need((await guard("close")).status === 204);
    claimed = false;
    return response(true, 200);
  } catch {
    return response(false, 503);
  } finally {
    if (claimed) await guard("close").catch(() => {
    });
  }
}

// <stdin>
import { timingSafeEqual as timingSafeEqual3 } from "node:crypto";
var reply2 = (s) => new Response(null, { status: s, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
var stdin_default = { async fetch(r, e) {
  try {
    const u = new URL(r.url);
    if (u.origin !== e.QA_PREVIEW_ORIGIN || u.pathname !== "/api/private-qa/run" || u.search || r.method !== "POST") return reply2(404);
    if (!qaAccessWindow(e) || e.PRIVATE_QA_MODE !== "finite-synthetic-v1") return reply2(503);
    if (r.headers.get("origin") !== e.QA_PREVIEW_ORIGIN) return reply2(403);
    const raw = r.headers.get("authorization");
    if (!raw || !/^Basic [A-Za-z0-9+/]+={0,2}$/.test(raw) || raw.length > 256) return reply2(401);
    const decoded = atob(raw.slice(6));
    if (!decoded.startsWith("qa:")) return reply2(401);
    const actual = await qaAccessVerifier(decoded.slice(3));
    if (!timingSafeEqual3(Buffer.from(actual, "hex"), Buffer.from(e.QA_ACCESS_SHA256, "hex"))) return reply2(401);
    if (r.body) {
      const rd = r.body.getReader(), p = await rd.read();
      await rd.cancel();
      if (!p.done) return reply2(400);
    }
    const guard = e.PRIVATE_QA_BUDGET.get(e.PRIVATE_QA_BUDGET.idFromName("finite-private-qa-once-v1"));
    return runFixedQa({ ...e, PRIVATE_QA_GUARD: guard });
  } catch {
    return reply2(503);
  }
} };
export {
  FiniteQaBudget,
  stdin_default as default
};
