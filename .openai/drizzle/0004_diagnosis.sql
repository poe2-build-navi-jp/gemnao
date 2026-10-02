-- ADDITIVE ONLY. Apply explicitly to an identified isolated database before production.
-- Existing feedback/contact tables are not read, altered, or cleared by this migration.
CREATE TABLE IF NOT EXISTS diagnosis_shared (
 id TEXT PRIMARY KEY,
 owner_hash TEXT NOT NULL,
 recovery_hash TEXT NOT NULL,
 request_id TEXT NOT NULL,
 snapshot TEXT NOT NULL,
 rule_version TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 revoked_at INTEGER,
 revision INTEGER NOT NULL DEFAULT 1,
 UNIQUE(owner_hash, request_id)
);
CREATE INDEX IF NOT EXISTS diagnosis_shared_expiry ON diagnosis_shared(expires_at);
CREATE INDEX IF NOT EXISTS diagnosis_shared_owner ON diagnosis_shared(owner_hash);
CREATE TABLE IF NOT EXISTS diagnosis_rate_limits (
 key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS diagnosis_rates_expiry ON diagnosis_rate_limits(expires_at);
CREATE TABLE IF NOT EXISTS diagnosis_operations (
 key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS diagnosis_metrics (
 day TEXT NOT NULL, event TEXT NOT NULL, step TEXT NOT NULL,
 action TEXT NOT NULL, status TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(day,event,step,action,status)
);
