import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const out = new URL('./.inbox-notify-test.mjs', import.meta.url);
const built = await build({
  entryPoints: ['lib/private-inbox-notifications.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
await writeFile(out, built.outputFiles[0].contents);
try {
  const { handleInboxNotifications: handle, INBOX_METADATA_SQL: sql } =
    await import(out.href);
  // Public synthetic fixture only; never an operational credential.
  const token = 'a'.repeat(64),
    verifier = createHash('sha256').update(token).digest('hex');
  let calls = 0,
    fail = false,
    contacts = [1, 2],
    servers = [1];
  const db = {
    prepare(statement) {
      assert.equal(statement, sql);
      calls++;
      return {
        bind(c, s) {
          return {
            async first() {
              if (fail) throw Error('PRIVATE BODY NEVER RETURN');
              return {
                contact_max: Math.max(0, ...contacts),
                server_max: Math.max(0, ...servers),
                contact_count: contacts.filter((i) => i > c).length,
                server_count: servers.filter((i) => i > s).length,
              };
            },
          };
        },
      };
    },
  };
  const env = {
    DB: db,
    INBOX_NOTIFY_ENABLED: 'true',
    INBOX_NOTIFY_READ_TOKEN_HASH_V2: verifier,
  };
  const request = (
    cursor,
    extra = {},
    url = 'https://gemnao.pages.dev/api/private-inbox/notifications',
    method = 'GET',
  ) =>
    new Request(url, {
      method,
      headers: {
        Authorization: 'Bearer ' + token,
        ...(cursor ? { 'X-Inbox-Cursor': cursor } : {}),
        ...extra,
      },
    });
  assert.equal((await handle(request(), {})).status, 404);
  // Legacy-only configuration must fail closed; it is never an auth fallback.
  const legacyOnly = {
    DB: db,
    INBOX_NOTIFY_ENABLED: 'true',
    INBOX_NOTIFY_TOKEN_SHA256: verifier,
  };
  assert.equal((await handle(request(), legacyOnly)).status, 401);
  assert.equal(
    (
      await handle(request(), {
        ...legacyOnly,
        INBOX_NOTIFY_READ_TOKEN_HASH_V2: 'b'.repeat(64),
      })
    ).status,
    401,
  );
  assert.equal(
    calls,
    0,
    'Missing or invalid V2 verifier must not reach D1, even with a valid old setting',
  );

  assert.equal(
    (
      await handle(
        request(undefined, { Authorization: 'Bearer ' + 'b'.repeat(64) }),
        env,
      )
    ).status,
    401,
  );
  assert.equal(
    (await handle(request(undefined, { Cookie: 'admin=fixture' }), env)).status,
    400,
  );
  assert.equal(
    (
      await handle(
        request(undefined, { Origin: 'https://gemnao.pages.dev' }),
        env,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handle(
        request(
          undefined,
          {},
          'https://preview.invalid/api/private-inbox/notifications',
        ),
        env,
      )
    ).status,
    400,
  );
  assert.equal(
    (await handle(request(undefined, {}, undefined, 'POST'), env)).status,
    405,
  );
  assert.equal(
    (
      await handle(
        request(
          undefined,
          {},
          'https://gemnao.pages.dev/api/private-inbox/notifications?key=fixture',
        ),
        env,
      )
    ).status,
    400,
  );
  assert.equal((await handle(request('broken'), env)).status, 400);
  assert.equal(calls, 0, 'No unauthenticated DB read');
  let response = await handle(request(), {
    ...env,
    INBOX_NOTIFY_TOKEN_SHA256: 'b'.repeat(64),
  });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('access-control-allow-origin'), null);
  const first = await response.json();
  assert.deepEqual(Object.keys(first).sort(), [
    'baseline',
    'counts',
    'cursor',
    'version',
  ]);
  assert.deepEqual(first.counts, { contact: 0, discord_listing: 0 });
  assert.equal(first.baseline, true);
  const same = await (await handle(request(first.cursor), env)).json();
  assert.equal(same.cursor, first.cursor);
  assert.equal(same.baseline, false);
  contacts.push(3, 4);
  servers.push(2);
  const next = await (await handle(request(first.cursor), env)).json();
  assert.deepEqual(next.counts, { contact: 2, discord_listing: 1 });
  assert.notEqual(next.cursor, first.cursor);
  assert.deepEqual(
    (await (await handle(request(next.cursor), env)).json()).counts,
    { contact: 0, discord_listing: 0 },
  );
  // A repeat with the old cursor repeats the batch: consumer checkpoint/intent is required.
  assert.deepEqual(
    (await (await handle(request(first.cursor), env)).json()).counts,
    next.counts,
  );
  contacts = [];
  servers = [];
  assert.equal(
    (await (await handle(request(next.cursor), env)).json()).cursor,
    next.cursor,
    'Deletion never rewinds cursor',
  );
  const altered = (next.cursor[0] === 'A' ? 'B' : 'A') + next.cursor.slice(1);
  assert.equal((await handle(request(altered), env)).status, 400);
  fail = true;
  response = await handle(request(next.cursor), env);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'unavailable' });
  // Execute the exact SQL against synthetic SQLite with writes forbidden after setup.
  const proof = execFileSync(
    'python',
    [
      '-c',
      `import sqlite3,sys,json
c=sqlite3.connect(':memory:')
c.executescript('CREATE TABLE contact_submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,message TEXT); CREATE TABLE discord_server_submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,reply_email TEXT); INSERT INTO contact_submissions(message) VALUES ("synthetic"),("synthetic"); INSERT INTO discord_server_submissions(reply_email) VALUES ("fixture@example.invalid");')
c.set_authorizer(lambda action,*args: sqlite3.SQLITE_OK if action in (sqlite3.SQLITE_SELECT,sqlite3.SQLITE_READ,sqlite3.SQLITE_FUNCTION) else sqlite3.SQLITE_DENY)
print(json.dumps(c.execute(sys.stdin.read(),(1,0)).fetchone()))
`,
    ],
    { input: sql, encoding: 'utf8' },
  );
  assert.deepEqual(JSON.parse(proof), [2, 1, 1, 1]);
  console.log(
    'PASS: default OFF, independent auth, origin/method/query guards, zero DB before auth, opaque authenticated cursor, baseline, counts, replay semantics, deletion, malformed/error redaction, no CORS/cache, exact SQLite SELECT under write-denying authorizer.',
  );
} finally {
  await unlink(out);
}
