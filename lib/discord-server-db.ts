import { env } from 'cloudflare:workers';
import type { DiscordServer, DiscordServerStatus } from '@/lib/discord-servers';

type D1Row = {
  id: number;
  slug: string;
  server_name: string;
  description: string;
  invite_url: string;
  game: string;
  purpose: string;
  play_style: string;
  activity_time: string;
  voice_chat: DiscordServer['voiceChat'];
  requirements: string;
  rules: string;
  owner_discord: string;
  reply_email: string;
  status: DiscordServerStatus;
  invite_status: 'unchecked' | 'valid' | 'invalid';
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  last_verified_at: string | null;
};

export type AdminDiscordServerSubmission = D1Row & {
  purposes: string[];
  styles: string[];
  activeTimes: string[];
};

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

function readList(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function slugify(value: string) {
  const base = value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 42);
  return `${base || 'server'}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function createDiscordServerSubmission(input: {
  serverName: string;
  description: string;
  inviteUrl: string;
  game: string;
  purposes: string[];
  styles: string[];
  activeTimes: string[];
  voiceChat: DiscordServer['voiceChat'];
  requirements: string;
  rules: string;
  ownerDiscord: string;
  replyEmail: string;
}) {
  const db = database();
  const duplicate = await db
    .prepare(
      `SELECT id FROM discord_server_submissions
       WHERE invite_url = ? AND status IN ('pending', 'approved') LIMIT 1`,
    )
    .bind(input.inviteUrl)
    .first();
  if (duplicate) return { duplicate: true as const };

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await db
    .prepare(
      `SELECT COUNT(*) AS count FROM discord_server_submissions
       WHERE (reply_email = ? OR owner_discord = ?) AND created_at >= ?`,
    )
    .bind(input.replyEmail, input.ownerDiscord, dayAgo)
    .first<{ count: number }>();
  if ((recent?.count || 0) >= 3) return { rateLimited: true as const };

  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO discord_server_submissions
        (slug, server_name, description, invite_url, game, purpose, play_style,
         activity_time, voice_chat, requirements, rules, owner_discord,
         reply_email, status, invite_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unchecked', ?, ?)`,
    )
    .bind(
      slugify(input.serverName),
      input.serverName,
      input.description,
      input.inviteUrl,
      input.game,
      JSON.stringify(input.purposes),
      JSON.stringify(input.styles),
      JSON.stringify(input.activeTimes),
      input.voiceChat,
      input.requirements,
      input.rules,
      input.ownerDiscord,
      input.replyEmail,
      now,
      now,
    )
    .run();
  return { id: Number(result.meta.last_row_id), duplicate: false as const };
}

export async function listApprovedDiscordServers(): Promise<DiscordServer[]> {
  const result = await database()
    .prepare(
      `SELECT id, slug, server_name, description, invite_url, game, purpose,
              play_style, activity_time, voice_chat, last_verified_at
       FROM discord_server_submissions
       WHERE status = 'approved' AND invite_status = 'valid'
       ORDER BY COALESCE(last_verified_at, updated_at) DESC`,
    )
    .all<Pick<D1Row, 'id' | 'slug' | 'server_name' | 'description' | 'invite_url' | 'game' | 'purpose' | 'play_style' | 'activity_time' | 'voice_chat' | 'last_verified_at'>>();

  return result.results.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.server_name,
    game: row.game,
    gameSlug: '',
    purposes: readList(row.purpose),
    styles: readList(row.play_style),
    voiceChat: row.voice_chat,
    activeTimes: readList(row.activity_time),
    description: row.description,
    inviteUrl: row.invite_url,
    lastVerifiedAt: row.last_verified_at || '',
    status: 'approved',
  }));
}

export async function listDiscordServerSubmissions() {
  const result = await database()
    .prepare(
      `SELECT * FROM discord_server_submissions
       ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC`,
    )
    .all<D1Row>();
  return result.results.map((row) => ({
    ...row,
    purposes: readList(row.purpose),
    styles: readList(row.play_style),
    activeTimes: readList(row.activity_time),
  }));
}

export async function updateDiscordServerStatus(
  id: number,
  status: Exclude<DiscordServerStatus, 'pending'>,
) {
  const now = new Date().toISOString();
  const result = await database()
    .prepare(
      `UPDATE discord_server_submissions
       SET status = ?,
           invite_status = CASE WHEN ? = 'approved' THEN 'valid' ELSE invite_status END,
           reviewed_at = ?, updated_at = ?,
           last_verified_at = CASE WHEN ? = 'approved' THEN ? ELSE last_verified_at END
       WHERE id = ?
         AND ((status = 'pending' AND ? IN ('approved', 'rejected'))
           OR (status = 'approved' AND ? IN ('expired', 'closed')))`,
    )
    .bind(status, status, now, now, status, now, id, status, status)
    .run();
  return result.meta.changes > 0;
}
