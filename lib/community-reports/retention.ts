import { reportStatement as stmt, reportBatch as batch } from './database';
export async function cleanupReports(
  db: D1Database,
  now = Math.floor(Date.now() / 1000),
) {
  // Proposed new-table policy only. Unfinished article withdrawals retain ONLY
  // reference metadata and deletion tombstones until an operator resolves them.
  await batch(db, [
    stmt(
      db,
      'UPDATE community_article_refs SET withdrawal_at=?,completed_at=NULL WHERE report_id IN(SELECT id FROM community_reports WHERE expires_at<=?) AND withdrawal_at IS NULL',
      now,
      now,
    ),
    stmt(
      db,
      `DELETE FROM community_reports WHERE expires_at<=? AND NOT EXISTS(SELECT 1 FROM community_article_refs WHERE report_id=community_reports.id AND withdrawal_at IS NOT NULL AND completed_at IS NULL)`,
      now,
    ),
    stmt(
      db,
      "UPDATE community_reports SET content_json='{}',public_json=NULL,state='deleted',approved_revision=NULL,owner_hash='' WHERE expires_at<=? AND (content_json!='{}' OR public_json IS NOT NULL OR state!='deleted' OR approved_revision IS NOT NULL OR owner_hash!='')",
      now,
    ),
    stmt(
      db,
      "UPDATE community_revisions SET content_json='{}',payload_hash='' WHERE report_id IN(SELECT id FROM community_reports WHERE expires_at<=?) AND (content_json!='{}' OR payload_hash!='')",
      now,
    ),
    stmt(
      db,
      "UPDATE community_audit SET evidence_json=NULL,request_hash='' WHERE report_id IN(SELECT id FROM community_reports WHERE expires_at<=?) AND (evidence_json IS NOT NULL OR request_hash!='')",
      now,
    ),
    stmt(db, 'DELETE FROM community_rate WHERE at<?', now - 60),
  ]);
  const receipt = await stmt(
    db,
    `INSERT INTO community_operations(key,value) VALUES('cleanup',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    String(now),
  ).run();
  if (!receipt.success) throw Error('storage');
}
