-- Local candidate only. New, separately reviewed REPORTS_DB; never existing DB/FEEDBACK_DB.
CREATE TABLE community_reports (
 id TEXT PRIMARY KEY, owner_hash TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision BETWEEN 1 AND 20),
 game_slug TEXT NOT NULL, symptom TEXT NOT NULL, content_json TEXT NOT NULL CHECK(length(content_json)<=8192),
 state TEXT NOT NULL CHECK(state IN ('pending','approved','hidden','rejected','deleted')),
 approved_revision INTEGER, public_json TEXT, last_request TEXT NOT NULL,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX community_public ON community_reports(state,game_slug,symptom,updated_at);
CREATE INDEX community_expiry ON community_reports(expires_at);
CREATE TABLE community_revisions (
 report_id TEXT NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
 revision INTEGER NOT NULL, request_id TEXT NOT NULL, payload_hash TEXT NOT NULL,
 content_json TEXT NOT NULL, action TEXT NOT NULL, at INTEGER NOT NULL,
 PRIMARY KEY(report_id,revision), UNIQUE(report_id,request_id)
);
CREATE TABLE community_audit (
 id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
 revision INTEGER NOT NULL, action TEXT NOT NULL, reason TEXT NOT NULL,
 evidence_json TEXT, actor TEXT NOT NULL CHECK(actor='existing-admin'), at INTEGER NOT NULL, request_hash TEXT NOT NULL, details_json TEXT NOT NULL
);
CREATE INDEX community_audit_report ON community_audit(report_id,at);
CREATE TABLE community_flags (
 id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
 reason TEXT NOT NULL, at INTEGER NOT NULL
);
CREATE INDEX community_flags_report ON community_flags(report_id);
CREATE TABLE community_article_refs (
 report_id TEXT NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
 article_path TEXT NOT NULL, revision INTEGER NOT NULL, at INTEGER NOT NULL,
 withdrawal_at INTEGER, completed_at INTEGER, PRIMARY KEY(report_id,article_path)
);
CREATE TABLE community_operations (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT INTO community_operations VALUES ('total','0');
-- No cleanup heartbeat at migration: collection remains closed until verified cleanup.
CREATE TABLE community_rate (
 id TEXT PRIMARY KEY, bucket TEXT NOT NULL, network_hash TEXT NOT NULL, at INTEGER NOT NULL
);
CREATE INDEX community_rate_window ON community_rate(bucket,at);
