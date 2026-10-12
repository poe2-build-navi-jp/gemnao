import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { QaEnv, QaWindow } from '../../lib/diagnosis/qa';
export const origin = 'https://gemnao.pages.dev';
export const testAdmin = 'synthetic-local-admin-only';
export const adminCookie = 'gemnao_discord_admin=' + testAdmin;
export const hash = (v: string) => createHash('sha256').update(v).digest('hex');
export function fixtureDatabase(path: string, clock: { now: number }) {
  const sql = new DatabaseSync(':memory:');
  sql.function('unixepoch', () => Math.floor(clock.now / 1000));
  sql.exec(readFileSync(path, 'utf8'));
  const control: {
    calls: number;
    beforeRun?: (query: string) => Promise<void>;
    fail?: boolean;
  } = { calls: 0 };
  const wrap = (query: string, args: unknown[] = []) => ({
    bind(...values: unknown[]) {
      return wrap(query, values);
    },
    async first(column?: string) {
      control.calls++;
      if (control.fail) throw new Error('D1 private SQL not to expose');
      const row = sql.prepare(query).get(...(args as never[]));
      return column ? (row?.[column] ?? null) : (row ?? null);
    },
    async all() {
      control.calls++;
      if (control.fail) throw new Error('D1 private SQL not to expose');
      return {
        success: true,
        results: sql.prepare(query).all(...(args as never[])),
        meta: { rows_written: 0, changed_db: false },
      };
    },
    async run() {
      control.calls++;
      await control.beforeRun?.(query);
      if (control.fail) throw new Error('D1 private SQL not to expose');
      const result = sql.prepare(query).run(...(args as never[]));
      return { success: true, meta: { changes: Number(result.changes) } };
    },
  });
  const db = {
    prepare: (query: string) => wrap(query),
    async batch(statements: { run(): Promise<unknown> }[]) {
      sql.exec('BEGIN');
      try {
        const out = [];
        for (const s of statements) out.push(await s.run());
        sql.exec('COMMIT');
        return out;
      } catch (e) {
        sql.exec('ROLLBACK');
        throw e;
      }
    },
  } as unknown as D1Database;
  return { sql, db, control };
}
export function setup() {
  const clock = { now: Math.floor(Date.now() / 1000) * 1000 };
  const diagnosis = fixtureDatabase(
    'migrations/diagnosis/0001_diagnosis.sql',
    clock,
  );
  const feedback = fixtureDatabase(
    'migrations/diagnostic-feedback/0001.sql',
    clock,
  );
  diagnosis.sql
    .prepare("INSERT INTO diagnosis_operations VALUES ('cleanup_success',?,?)")
    .run(String(clock.now), clock.now + 7200000);
  feedback.sql
    .prepare('INSERT INTO diagnostic_retention_health VALUES(1,?)')
    .run(clock.now / 1000);
  const window: QaWindow = {
    enabled: true,
    runId: 'synthetic-local-20261012',
    startsAt: clock.now - 60000,
    expiresAt: clock.now + 3000000,
  };
  const env: QaEnv = {
    DIAGNOSIS_DB: diagnosis.db,
    FEEDBACK_DB: feedback.db,
    DIAGNOSIS_LOCAL_BETA: 'true',
    DIAGNOSIS_STORAGE_ENABLED: 'true',
    DIAGNOSIS_ENABLED: 'false',
    DIAGNOSIS_SHARING_ENABLED: 'false',
    DIAGNOSIS_WRITES_ENABLED: 'false',
    DIAGNOSIS_METRICS_ENABLED: 'false',
    FEEDBACK_ENABLED: 'false',
    DISCORD_ADMIN_TOKEN_HASH: hash('gemnao-discord-admin:' + testAdmin),
  };
  return { clock, diagnosis, feedback, env, window };
}
export function request(
  body?: unknown,
  cookie = adminCookie,
  path = '/api/admin/diagnosis-qa',
  method = body === undefined ? 'GET' : 'POST',
) {
  return new Request(origin + path, {
    method,
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'X-Diagnosis-Request': '1',
      'CF-Connecting-IP': '192.0.2.45',
      Cookie: cookie,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
export function feedbackCredentials(now: number, key = 'b'.repeat(64)) {
  return {
    receiptId:
      Math.floor(now / 1000)
        .toString(16)
        .padStart(8, '0') + hash(key).slice(0, 24),
    deleteKey: key,
  };
}
