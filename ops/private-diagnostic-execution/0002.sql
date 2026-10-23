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
