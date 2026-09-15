import { env } from 'cloudflare:workers';

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

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
