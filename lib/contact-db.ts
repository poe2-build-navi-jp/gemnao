import { env } from 'cloudflare:workers';

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

export type ContactSubmissionStatus = 'new' | 'reviewing' | 'resolved';

export type AdminContactSubmission = {
  id: number;
  category: string;
  page_url: string;
  message: string;
  reply_email: string;
  status: ContactSubmissionStatus;
  created_at: string;
};

export async function saveContactSubmission(input: {
  category: string;
  pageUrl: string;
  message: string;
  replyEmail: string;
}) {
  await database()
    .prepare(
      `INSERT INTO contact_submissions
        (category, page_url, message, reply_email, status, created_at)
       VALUES (?, ?, ?, ?, 'new', ?)`,
    )
    .bind(
      input.category,
      input.pageUrl,
      input.message,
      input.replyEmail,
      new Date().toISOString(),
    )
    .run();
}

export async function listContactSubmissions() {
  const result = await database()
    .prepare(
      `SELECT id, category, page_url, message, reply_email, status, created_at
       FROM contact_submissions
       ORDER BY CASE status WHEN 'new' THEN 0 WHEN 'reviewing' THEN 1 ELSE 2 END,
                created_at DESC`,
    )
    .all<AdminContactSubmission>();
  return result.results;
}

export async function updateContactSubmissionStatus(
  id: number,
  status: ContactSubmissionStatus,
) {
  const result = await database()
    .prepare(
      `UPDATE contact_submissions SET status = ?
       WHERE id = ? AND status IN ('new', 'reviewing', 'resolved')`,
    )
    .bind(status, id)
    .run();
  return result.meta.changes > 0;
}
