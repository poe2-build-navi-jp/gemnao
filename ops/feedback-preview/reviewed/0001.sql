-- Apply only to a separately verified FEEDBACK_DB, never existing survey DB.
CREATE TABLE diagnostic_reports (
 receipt_id TEXT PRIMARY KEY,
 delete_hash TEXT NOT NULL,
 report_json TEXT NOT NULL CHECK(length(report_json)<=4096),
 consent_version INTEGER NOT NULL CHECK(consent_version=1),
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX diagnostic_reports_expiry ON diagnostic_reports(expires_at);
CREATE INDEX diagnostic_reports_created ON diagnostic_reports(created_at);
CREATE TABLE diagnostic_retention_health (singleton INTEGER PRIMARY KEY CHECK(singleton=1), last_cleanup INTEGER NOT NULL);
-- No initial heartbeat: writes fail closed until the cleanup job actually succeeds.

CREATE TABLE diagnostic_report_tombstones(receipt_id TEXT PRIMARY KEY, delete_hash TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX diagnostic_tombstone_expiry ON diagnostic_report_tombstones(expires_at);

-- Dormant candidate only: no runtime schema creation or ordinary DB fallback.
-- Singleton daily salt; overwritten on UTC rollover and removed by hourly cleanup.
CREATE TABLE diagnostic_rate_salt (
 singleton INTEGER PRIMARY KEY CHECK(singleton=1),
 day INTEGER NOT NULL CHECK(day>=0),
 salt TEXT NOT NULL CHECK(length(salt)=64 AND salt NOT GLOB '*[^a-f0-9]*')
);
-- At most 10 admitted attempts per rolling 60 seconds per independent bucket.
-- Raw addresses, receipt IDs, report data and request metadata never enter here.
CREATE TABLE diagnostic_rate_attempts (
 id TEXT PRIMARY KEY,
 bucket TEXT NOT NULL CHECK(bucket IN ('intake','delete')),
 network_hash TEXT NOT NULL CHECK(length(network_hash)=64 AND network_hash NOT GLOB '*[^a-f0-9]*'),
 created_at INTEGER NOT NULL
);
CREATE INDEX diagnostic_rate_attempts_window ON diagnostic_rate_attempts(bucket,created_at);
