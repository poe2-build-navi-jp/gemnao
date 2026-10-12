// lib/diagnosis/cleanup.ts
var TTL = 30 * 864e5;
async function cleanupDiagnosis(db, now = Date.now()) {
  const results = await db.batch([
    db.prepare(
      "DELETE FROM diagnosis_shared WHERE expires_at <= ? OR revoked_at IS NOT NULL"
    ).bind(now),
    db.prepare("DELETE FROM diagnosis_rate_limits WHERE expires_at <= ?").bind(now),
    db.prepare(
      "DELETE FROM diagnosis_operations WHERE key LIKE 'salt:%' AND expires_at <= ?"
    ).bind(now),
    db.prepare("DELETE FROM diagnosis_metrics WHERE day <= ?").bind(new Date(now - TTL).toISOString().slice(0, 10))
  ]);
  if (results.length !== 4 || results.some((result) => !result.success))
    throw new Error("Diagnosis retention cleanup failed");
  const heartbeat = await db.prepare(
    "INSERT INTO diagnosis_operations (key,value,expires_at) VALUES ('cleanup_success',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, expires_at=excluded.expires_at"
  ).bind(String(now), now + 2 * 36e5).run();
  if (!heartbeat.success)
    throw new Error("Diagnosis retention heartbeat failed");
}

// cloudflare/diagnosis-cleanup.ts
var cleanupWorker = {
  async scheduled(_controller, env, _ctx) {
    if (!env.DIAGNOSIS_DB) throw new Error("DIAGNOSIS_DB binding is required");
    try {
      await cleanupDiagnosis(env.DIAGNOSIS_DB);
    } catch {
      console.error("diagnosis_cleanup_failed");
      throw new Error("Diagnosis retention cleanup failed");
    }
    console.log("diagnosis_cleanup_success");
  },
  fetch() {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" }
    });
  }
};
var diagnosis_cleanup_default = cleanupWorker;
export {
  diagnosis_cleanup_default as default
};
