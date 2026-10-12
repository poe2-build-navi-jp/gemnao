import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  handleQa,
  qaShareAllowed,
  configuredWindow,
  liveWindow,
} from '../../lib/diagnosis/qa';
import { handleDiagnosis, cleanupDiagnosis } from '../../lib/diagnosis/server';
import { handleFeedback } from '../../lib/diagnostic-feedback/service';
import { configuredAdmin, configuredAdminToken } from '../../lib/admin-cookie';
import {
  setup,
  request,
  adminCookie,
  testAdmin,
  hash,
  feedbackCredentials,
} from './qa-fixture';
type Setup = ReturnType<typeof setup>;
const count = (s: Setup, which: 'diagnosis' | 'feedback') =>
  Number(
    s[which].sql
      .prepare(
        'SELECT count(*) AS n FROM ' +
          (which === 'diagnosis' ? 'diagnosis_shared' : 'diagnostic_reports'),
      )
      .get()!.n,
  );
async function session(s: Setup) {
  const response = await handleQa(
    request({ op: 'session', slot: 'diagnosis-a' }),
    s.env,
    s.window,
    s.clock.now,
  );
  assert.equal(response.status, 200);
  const owner = response.headers.get('set-cookie')!.split(';')[0];
  assert.match(owner, /^__Host-gemnao-diagnosis=[a-f0-9]{64}$/);
  const data = (await response.json()) as {
    diagnosisIds: Record<string, string>;
  };
  assert.match(data.diagnosisIds['diagnosis-a'], /^[a-f0-9]{32}$/);
  return { cookie: adminCookie + '; ' + owner, planned: data.diagnosisIds };
}
async function qa(s: Setup, body?: unknown, cookie = adminCookie) {
  return handleQa(request(body, cookie), s.env, s.window, s.clock.now);
}

void test('window invalid, disabled, expired, early, wrong origin, and missing admin deny without D1', async () => {
  const s = setup();
  assert.equal(
    configuredWindow({ ...s.window, expiresAt: s.window.startsAt + 3600001 }),
    false,
  );
  assert.equal(liveWindow(s.window, s.window.expiresAt), false);
  assert.equal(liveWindow(s.window, s.window.startsAt), true);
  for (const window of [
    { ...s.window, enabled: false },
    { ...s.window, startsAt: NaN },
    { ...s.window, runId: '../../other' },
    { ...s.window, startsAt: s.clock.now + 1000 },
    { ...s.window, expiresAt: s.clock.now },
    { ...s.window, expiresAt: s.window.startsAt + 3601000 },
  ]) {
    const response = await handleQa(
      request({ op: 'create', slot: 'diagnosis-a' }),
      s.env,
      window,
      s.clock.now,
    );
    assert.ok(response.status >= 400);
  }
  assert.equal((await qa(s, undefined, '')).status, 401);
  assert.equal(
    (
      await handleQa(
        new Request('https://different.example/api/admin/diagnosis-qa', {
          headers: { Cookie: adminCookie },
        }),
        s.env,
        s.window,
        s.clock.now,
      )
    ).status,
    403,
  );
  assert.equal(s.diagnosis.control.calls + s.feedback.control.calls, 0);
  assert.equal(
    await qaShareAllowed(
      request(undefined),
      s.env,
      'a'.repeat(32),
      { ...s.window, enabled: false },
      s.clock.now,
    ),
    false,
  );
});
void test('existing admin verifier preserves percent encoding, hash precedence and constant content checks', async () => {
  const token = 'local:% +日本語';
  const config = { hash: hash('gemnao-discord-admin:' + token).toUpperCase() };
  assert.equal(
    await configuredAdmin(
      request(undefined, 'gemnao_discord_admin=' + encodeURIComponent(token)),
      config,
    ),
    true,
  );
  assert.equal(
    await configuredAdmin(
      request(undefined, 'gemnao_discord_admin=%not-valid'),
      config,
    ),
    false,
  );
  assert.equal(
    await configuredAdminToken(testAdmin, {
      hash: hash('different'),
      token: testAdmin,
    }),
    false,
  );
  assert.equal(
    await configuredAdminToken(testAdmin, { token: testAdmin }),
    true,
  );
});
void test('fixed four payloads, private DTO, general intake OFF, admin/owner separation', async () => {
  const s = setup(),
    { cookie, planned } = await session(s);
  for (const slot of ['diagnosis-a', 'diagnosis-b']) {
    const response = await qa(s, { op: 'create', slot }, cookie);
    assert.equal(response.status, 201);
    const data = (await response.json()) as { id: string };
    assert.equal(data.id, planned[slot]);
    assert.equal('recoveryKey' in data, false);
    assert.equal(
      await qaShareAllowed(
        request(undefined, cookie, '/diagnosis/' + data.id),
        s.env,
        data.id,
        s.window,
        s.clock.now,
      ),
      true,
    );
    assert.equal(
      await qaShareAllowed(
        request(undefined, '', '/diagnosis/' + data.id),
        s.env,
        data.id,
        s.window,
        s.clock.now,
      ),
      false,
    );
    assert.equal(
      (
        await handleDiagnosis(
          request(
            undefined,
            adminCookie,
            '/api/diagnosis/' + data.id + '/owner',
          ),
          s.env,
          s.clock.now,
        )
      ).status,
      403,
    );
  }
  for (const [slot, key] of [
    ['feedback-a', 'b'.repeat(64)],
    ['feedback-b', 'c'.repeat(64)],
  ])
    assert.equal(
      (
        await qa(
          s,
          { op: 'create', slot, ...feedbackCredentials(s.clock.now, key) },
          cookie,
        )
      ).status,
      201,
    );
  assert.equal(count(s, 'diagnosis'), 2);
  assert.equal(count(s, 'feedback'), 2);
  assert.equal(
    (
      await handleDiagnosis(
        request({}, cookie, '/api/diagnosis'),
        s.env,
        s.clock.now,
      )
    ).status,
    503,
  );
  assert.equal(
    (
      await handleFeedback(
        request({}, cookie, '/api/diagnostic-feedback'),
        s.env,
        s.clock.now / 1000,
      )
    ).status,
    503,
  );
  assert.deepEqual(
    await (
      await handleDiagnosis(
        request(undefined, '', '/api/diagnosis/config'),
        s.env,
        s.clock.now,
      )
    ).json(),
    { enabled: true, sharing: false, metrics: false, localOnly: true },
  );
  const state = (await (await qa(s, undefined, cookie)).json()) as {
    records: { present: boolean; owned: boolean }[];
  };
  assert.equal(state.records.length, 4);
  assert.ok(
    state.records.every(
      (r: { present: boolean; owned: boolean }) => r.present && r.owned,
    ),
  );
  assert.equal(
    Number(
      s.diagnosis.sql.prepare('SELECT count(*) n FROM diagnosis_metrics').get()!
        .n,
    ),
    0,
  );
});
void test('parallel requests consume a diagnosis slot once across cookies; arbitrary IDs/bodies rejected', async () => {
  const s = setup(),
    { cookie } = await session(s);
  const other = adminCookie + '; __Host-gemnao-diagnosis=' + 'f'.repeat(64);
  const responses = await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      qa(s, { op: 'create', slot: 'diagnosis-a' }, i % 2 ? cookie : other),
    ),
  );
  assert.equal(responses.filter((r) => r.status === 201).length, 1);
  assert.equal(count(s, 'diagnosis'), 1);
  assert.ok(responses.every((r) => r.status === 201 || r.status === 409));
  for (const body of [
    { op: 'create', slot: 'diagnosis-c' },
    { op: 'create', slot: 'diagnosis-b', snapshot: {} },
    { op: 'create', slot: 'diagnosis-b', requestId: 'f'.repeat(32) },
  ])
    assert.equal((await qa(s, body, cookie)).status, 400);
  assert.equal(count(s, 'diagnosis'), 1);
});
void test('parallel feedback attempts bind each slot to one receipt; cannot expand with a new receipt', async () => {
  const s = setup(),
    { cookie } = await session(s);
  const responses = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      qa(
        s,
        {
          op: 'create',
          slot: 'feedback-a',
          ...feedbackCredentials(s.clock.now, String(i).repeat(64)),
        },
        cookie,
      ),
    ),
  );
  assert.equal(responses.filter((r) => r.status === 201).length, 1);
  assert.equal(count(s, 'feedback'), 1);
  assert.ok(responses.every((r) => r.status === 201 || r.status === 409));
});
void test('delete requires owner proof; deleted slots never create again; feedback duplicate uses same ID', async () => {
  const s = setup(),
    { cookie, planned } = await session(s);
  assert.equal(
    (await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie)).status,
    201,
  );
  assert.equal(
    (
      await handleDiagnosis(
        request(
          {},
          adminCookie,
          '/api/diagnosis/' + planned['diagnosis-a'],
          'DELETE',
        ),
        s.env,
        s.clock.now,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleDiagnosis(
        request(
          {},
          cookie,
          '/api/diagnosis/' + planned['diagnosis-a'],
          'DELETE',
        ),
        s.env,
        s.clock.now,
      )
    ).status,
    200,
  );
  assert.equal(
    (await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie)).status,
    409,
  );
  const creds = feedbackCredentials(s.clock.now);
  assert.equal(
    (await qa(s, { op: 'create', slot: 'feedback-a', ...creds }, cookie))
      .status,
    201,
  );
  assert.equal(
    (await qa(s, { op: 'duplicate', slot: 'feedback-a', ...creds }, cookie))
      .status,
    200,
  );
  assert.equal(count(s, 'feedback'), 1);
  assert.equal(
    (
      await handleFeedback(
        request(
          { receipt_id: creds.receiptId, delete_key: '0'.repeat(64) },
          '',
          '/api/diagnostic-feedback',
          'DELETE',
        ),
        s.env,
        s.clock.now / 1000,
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await handleFeedback(
        request(
          { receipt_id: creds.receiptId, delete_key: creds.deleteKey },
          '',
          '/api/diagnostic-feedback',
          'DELETE',
        ),
        s.env,
        s.clock.now / 1000,
      )
    ).status,
    200,
  );
  assert.equal(
    (await qa(s, { op: 'duplicate', slot: 'feedback-a', ...creds }, cookie))
      .status,
    409,
  );
  assert.equal(
    (
      await qa(
        s,
        {
          op: 'create',
          slot: 'feedback-a',
          ...feedbackCredentials(s.clock.now, 'd'.repeat(64)),
        },
        cookie,
      )
    ).status,
    409,
  );
  assert.equal(count(s, 'diagnosis') + count(s, 'feedback'), 0);
});
void test('ambiguous post-commit failure leaves known deletion ID and consumes slot permanently', async () => {
  const s = setup(),
    { cookie, planned } = await session(s);
  // A committed row with a lost HTTP response is exactly the state exposed to the next request.
  await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie);
  const expired = { ...s.window, expiresAt: s.clock.now };
  assert.equal(
    (
      await handleQa(
        request({ op: 'create', slot: 'diagnosis-a' }, cookie),
        s.env,
        expired,
        s.clock.now,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleDiagnosis(
        request(
          {},
          cookie,
          '/api/diagnosis/' + planned['diagnosis-a'],
          'DELETE',
        ),
        s.env,
        s.clock.now,
      )
    ).status,
    200,
  );
  assert.equal(count(s, 'diagnosis'), 0);
});
void test('close fences in-flight INSERT for diagnosis and feedback; normal owner deletion survives close', async () => {
  for (const kind of ['diagnosis', 'feedback'] as const) {
    const s = setup(),
      { cookie } = await session(s);
    let closed = false;
    s[kind].control.beforeRun = async (query) => {
      if (
        !closed &&
        query.startsWith(
          kind === 'diagnosis'
            ? 'INSERT INTO diagnosis_shared'
            : 'INSERT OR IGNORE INTO diagnostic_reports',
        )
      ) {
        closed = true;
        assert.equal((await qa(s, { op: 'close' }, cookie)).status, 200);
      }
    };
    const response = await qa(
      s,
      kind === 'diagnosis'
        ? { op: 'create', slot: 'diagnosis-a' }
        : {
            op: 'create',
            slot: 'feedback-a',
            ...feedbackCredentials(s.clock.now),
          },
      cookie,
    );
    assert.ok(response.status >= 400);
    assert.equal(count(s, kind), 0);
    assert.equal(
      (await qa(s, { op: 'session', slot: 'diagnosis-a' }, cookie)).status,
      409,
    );
  }
  const s = setup(),
    { cookie, planned } = await session(s);
  await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie);
  await qa(s, { op: 'close' }, cookie);
  assert.equal(
    await qaShareAllowed(
      request(undefined, cookie, '/diagnosis/' + planned['diagnosis-a']),
      s.env,
      planned['diagnosis-a'],
      s.window,
      s.clock.now,
    ),
    false,
  );
  assert.equal(
    (
      await handleDiagnosis(
        request(
          {},
          cookie,
          '/api/diagnosis/' + planned['diagnosis-a'],
          'DELETE',
        ),
        s.env,
        s.clock.now,
      )
    ).status,
    200,
  );
});
void test('database clock expiry fences already admitted INSERTs and prevents renewed reads', async () => {
  for (const kind of ['diagnosis', 'feedback'] as const) {
    const s = setup(),
      { cookie } = await session(s);
    s[kind].control.beforeRun = async (query) => {
      if (
        query.startsWith(
          kind === 'diagnosis'
            ? 'INSERT INTO diagnosis_shared'
            : 'INSERT OR IGNORE INTO diagnostic_reports',
        )
      )
        s.clock.now = s.window.expiresAt;
    };
    const response = await qa(
      s,
      kind === 'diagnosis'
        ? { op: 'create', slot: 'diagnosis-a' }
        : {
            op: 'create',
            slot: 'feedback-a',
            ...feedbackCredentials(s.clock.now),
          },
      cookie,
    );
    assert.ok(response.status >= 400);
    assert.equal(count(s, kind), 0);
  }
});
void test('D1 failure and stale cleanup fail closed; consumed failed attempt is not a fresh slot', async () => {
  const s = setup(),
    { cookie } = await session(s);
  s.diagnosis.sql
    .prepare(
      "UPDATE diagnosis_operations SET value='1' WHERE key='cleanup_success'",
    )
    .run();
  assert.equal(
    (await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie)).status,
    503,
  );
  assert.equal(count(s, 'diagnosis'), 0);
  s.diagnosis.sql
    .prepare(
      "UPDATE diagnosis_operations SET value=? WHERE key='cleanup_success'",
    )
    .run(String(s.clock.now));
  assert.equal(
    (await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie)).status,
    409,
  );
  s.feedback.control.fail = true;
  const result = await qa(
    s,
    { op: 'create', slot: 'feedback-a', ...feedbackCredentials(s.clock.now) },
    cookie,
  );
  assert.equal(result.status, 503);
  assert.doesNotMatch(await result.text(), /private SQL/);
  assert.equal(count(s, 'feedback'), 0);
});
void test('auxiliary ledger expires through existing salt cleanup, preserving unrelated data', async () => {
  const s = setup(),
    { cookie } = await session(s);
  await qa(s, { op: 'close' }, cookie);
  s.diagnosis.sql.exec(
    "INSERT INTO diagnosis_operations VALUES('other-operation','keep',1)",
  );
  await cleanupDiagnosis(s.diagnosis.db, s.window.expiresAt + 86400000);
  assert.equal(
    s.diagnosis.sql
      .prepare(
        "SELECT key FROM diagnosis_operations WHERE key LIKE 'salt:qa:%'",
      )
      .all().length,
    0,
  );
  assert.equal(
    s.diagnosis.sql
      .prepare(
        "SELECT value FROM diagnosis_operations WHERE key='other-operation'",
      )
      .get()!.value,
    'keep',
  );
});

void test('scoped cleanup after expiry rejects substituted receipts and wrong owners, preserves unrelated rows', async () => {
  const s = setup(),
    { cookie, planned } = await session(s);
  await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie);
  const creds = feedbackCredentials(s.clock.now);
  await qa(s, { op: 'create', slot: 'feedback-a', ...creds }, cookie);
  const foreign = feedbackCredentials(s.clock.now, 'e'.repeat(64));
  s.feedback.sql
    .prepare('INSERT INTO diagnostic_reports VALUES (?,?,?,1,?,?)')
    .run(
      foreign.receiptId,
      hash(foreign.deleteKey),
      '{}',
      s.clock.now / 1000,
      s.clock.now / 1000 + 99999,
    );
  s.clock.now = s.window.expiresAt;
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'diagnosis-a' }, adminCookie)).status,
    403,
  );
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'feedback-a', ...foreign }, cookie))
      .status,
    403,
  );
  assert.equal(
    (
      await qa(
        s,
        {
          op: 'delete',
          slot: 'diagnosis-a',
          receiptId: planned['diagnosis-a'],
        },
        cookie,
      )
    ).status,
    400,
  );
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'diagnosis-a' }, cookie)).status,
    200,
  );
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'feedback-a', ...creds }, cookie))
      .status,
    200,
  );
  assert.equal(count(s, 'diagnosis'), 0);
  assert.equal(count(s, 'feedback'), 1);
  assert.equal(
    s.feedback.sql.prepare('SELECT receipt_id FROM diagnostic_reports').get()!
      .receipt_id,
    foreign.receiptId,
  );
  assert.equal(
    (await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie)).status,
    403,
  );
});

void test('QA cleanup fails when ordinary ownership has moved, even for an authenticated admin', async () => {
  const s = setup(),
    { cookie, planned } = await session(s);
  await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie);
  s.diagnosis.sql
    .prepare('UPDATE diagnosis_shared SET owner_hash=? WHERE id=?')
    .run(hash('f'.repeat(64)), planned['diagnosis-a']);
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'diagnosis-a' }, cookie)).status,
    403,
  );
  assert.equal(count(s, 'diagnosis'), 1);
});

void test('retired window permanently rejects intake/shared reads but retains scoped owner cleanup', async () => {
  const s = setup(),
    { cookie, planned } = await session(s);
  await qa(s, { op: 'create', slot: 'diagnosis-a' }, cookie);
  const creds = feedbackCredentials(s.clock.now);
  await qa(s, { op: 'create', slot: 'feedback-a', ...creds }, cookie);
  s.window.enabled = false;
  const before = s.diagnosis.control.calls + s.feedback.control.calls;
  const status = (await (await qa(s, undefined, cookie)).json()) as {
    active: boolean;
    records: unknown[];
  };
  assert.equal(status.active, false);
  assert.deepEqual(status.records, []);
  for (const body of [
    { op: 'session', slot: 'diagnosis-a' },
    { op: 'create', slot: 'diagnosis-b' },
    {
      op: 'create',
      slot: 'feedback-b',
      ...feedbackCredentials(s.clock.now, 'e'.repeat(64)),
    },
    { op: 'duplicate', slot: 'feedback-a', ...creds },
  ])
    assert.equal((await qa(s, body, cookie)).status, 403);
  assert.equal(
    await qaShareAllowed(
      request(undefined, cookie, '/diagnosis/' + planned['diagnosis-a']),
      s.env,
      planned['diagnosis-a'],
      s.window,
      s.clock.now,
    ),
    false,
  );
  assert.equal(s.diagnosis.control.calls + s.feedback.control.calls, before);
  s.clock.now = s.window.expiresAt;
  assert.equal((await qa(s, { op: 'close' }, cookie)).status, 200);
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'diagnosis-a' }, adminCookie)).status,
    403,
  );
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'diagnosis-a' }, cookie)).status,
    200,
  );
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'feedback-a', ...creds }, cookie))
      .status,
    200,
  );
  assert.equal(count(s, 'diagnosis') + count(s, 'feedback'), 0);
  s.clock.now = s.window.expiresAt + 86400000;
  assert.equal(
    (await qa(s, { op: 'delete', slot: 'feedback-a', ...creds }, cookie))
      .status,
    403,
  );
});
