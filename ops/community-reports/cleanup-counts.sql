-- READ ONLY. Run ONLY after provider metadata + bindings confirm:
-- gemnao-community-reports-production / 3141aae6-8dc9-47e9-a8a2-7a05f642f94f.
-- Does not inspect guard-only blocked IDs; NOT a complete maintenance dry run.
-- No report IDs, content, owner hashes, IPs or credentials are returned.
WITH clock(t) AS (SELECT unixepoch()),
expired AS (SELECT id FROM community_reports,clock WHERE expires_at<=t),
-- cleanup first marks withdrawal_at NULL references as pending, even if a
-- completed_at value existed. Count deletion eligibility AFTER that marking.
deletable AS (
 SELECT id FROM expired WHERE NOT EXISTS (
  SELECT 1 FROM community_article_refs r WHERE r.report_id=expired.id
  AND (r.withdrawal_at IS NULL OR r.completed_at IS NULL)
 )
)
SELECT
 (SELECT t FROM clock) AS checked_at_utc_seconds,
 (SELECT COUNT(*) FROM community_reports) AS reports_total,
 (SELECT COUNT(*) FROM community_revisions) AS revisions_total,
 (SELECT COUNT(*) FROM community_audit) AS audit_total,
 (SELECT COUNT(*) FROM community_flags) AS flags_total,
 (SELECT COUNT(*) FROM community_article_refs) AS article_refs_total,
 (SELECT COUNT(*) FROM expired) AS expired_reports,
 (SELECT COUNT(*) FROM deletable) AS expiry_delete_reports,
 (SELECT COUNT(*) FROM expired WHERE id NOT IN (SELECT id FROM deletable)) AS expiry_retain_reports,
 (SELECT COUNT(*) FROM community_revisions WHERE report_id IN (SELECT id FROM deletable)) AS expiry_cascade_revisions,
 (SELECT COUNT(*) FROM community_audit WHERE report_id IN (SELECT id FROM deletable)) AS expiry_cascade_audit,
 (SELECT COUNT(*) FROM community_flags WHERE report_id IN (SELECT id FROM deletable)) AS expiry_cascade_flags,
 (SELECT COUNT(*) FROM community_article_refs WHERE report_id IN (SELECT id FROM deletable)) AS expiry_cascade_refs,
 (SELECT COUNT(*) FROM community_article_refs WHERE report_id IN (SELECT id FROM expired) AND withdrawal_at IS NULL) AS expiry_new_withdrawal_refs,
 (SELECT COUNT(*) FROM community_article_refs WHERE withdrawal_at IS NOT NULL AND completed_at IS NULL) AS current_pending_withdrawal_refs,
 (SELECT COUNT(*) FROM community_reports WHERE state='deleted') AS stored_deleted_reports,
 (SELECT COUNT(*) FROM community_rate,clock WHERE at<t-60) AS old_rate_rows,
 (SELECT value FROM community_operations WHERE key='cleanup') AS last_cleanup_receipt;
