-- STAGED ONLY: explicit PRIVATE_DIAGNOSTIC_DB binding to a reviewed QA target.
-- Creates only private_diagnostic_* tables/indexes; never alters legacy tables.
-- Not applied remotely. Do not run if any private namespace object already exists.
CREATE TABLE private_diagnostic_reports (
 receipt_id TEXT PRIMARY KEY,
 delete_hash TEXT NOT NULL,
 report_json TEXT NOT NULL CHECK(length(report_json)<=4096),
 consent_version INTEGER NOT NULL CHECK(consent_version=1),
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX private_diagnostic_reports_expiry ON private_diagnostic_reports(expires_at);
CREATE INDEX private_diagnostic_reports_created ON private_diagnostic_reports(created_at);
CREATE TABLE private_diagnostic_retention_health (singleton INTEGER PRIMARY KEY CHECK(singleton=1), last_cleanup INTEGER NOT NULL);
-- No initial heartbeat: writes fail closed until the cleanup job actually succeeds.

CREATE TABLE private_diagnostic_report_tombstones(receipt_id TEXT PRIMARY KEY, delete_hash TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX private_diagnostic_tombstone_expiry ON private_diagnostic_report_tombstones(expires_at);

-- Dormant candidate only: no runtime schema creation or ordinary DB fallback.
-- Singleton daily salt; overwritten on UTC rollover and removed by hourly cleanup.
CREATE TABLE private_diagnostic_rate_salt (
 singleton INTEGER PRIMARY KEY CHECK(singleton=1),
 day INTEGER NOT NULL CHECK(day>=0),
 salt TEXT NOT NULL CHECK(length(salt)=64 AND salt NOT GLOB '*[^a-f0-9]*')
);
-- At most 10 admitted attempts per rolling 60 seconds per independent bucket.
-- Raw addresses, receipt IDs, report data and request metadata never enter here.
CREATE TABLE private_diagnostic_rate_attempts (
 id TEXT PRIMARY KEY,
 bucket TEXT NOT NULL CHECK(bucket IN ('intake','delete')),
 network_hash TEXT NOT NULL CHECK(length(network_hash)=64 AND network_hash NOT GLOB '*[^a-f0-9]*'),
 created_at INTEGER NOT NULL
);
CREATE INDEX private_diagnostic_rate_attempts_window ON private_diagnostic_rate_attempts(bucket,created_at);

-- Candidate only, never runtime migration. Independent notification switch stays OFF.
-- Single opaque cursor: no report body, receipt ID, person, count or event history.
CREATE TABLE private_diagnostic_notification_state (
 singleton INTEGER PRIMARY KEY CHECK(singleton=1),
 cursor TEXT NOT NULL CHECK(length(cursor)=32 AND cursor NOT GLOB '*[^a-f0-9]*'),
 expires_at INTEGER NOT NULL
);
-- AFTER INSERT does not run on INSERT OR IGNORE retries. Same transaction as receipt.
CREATE TRIGGER private_diagnostic_notification_insert AFTER INSERT ON private_diagnostic_reports
BEGIN
 INSERT INTO private_diagnostic_notification_state(singleton,cursor,expires_at)
 VALUES(1,lower(hex(randomblob(16))),NEW.expires_at)
 ON CONFLICT(singleton) DO UPDATE SET cursor=excluded.cursor,expires_at=excluded.expires_at;
END;
-- Keep retention atomic with the existing successful cleanup heartbeat transaction.
-- No additional cron, Worker or cleanup flag required once this migration is approved.
CREATE TRIGGER private_diagnostic_notification_cleanup_insert AFTER INSERT ON private_diagnostic_retention_health
BEGIN
 DELETE FROM private_diagnostic_notification_state WHERE expires_at<=NEW.last_cleanup;
END;
CREATE TRIGGER private_diagnostic_notification_cleanup_update AFTER UPDATE OF last_cleanup ON private_diagnostic_retention_health
BEGIN
 DELETE FROM private_diagnostic_notification_state WHERE expires_at<=NEW.last_cleanup;
END;
