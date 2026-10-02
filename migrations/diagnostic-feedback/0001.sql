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

CREATE TABLE diagnostic_report_tombstones(receipt_id TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
CREATE INDEX diagnostic_tombstone_expiry ON diagnostic_report_tombstones(expires_at);
