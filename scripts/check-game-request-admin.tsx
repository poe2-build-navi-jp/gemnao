import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { GameRequestAdmin } from '../components/game-request-admin';

type Element = { type?: unknown; props?: Record<string, unknown> };
type Row = {
  id: string;
  game_name: string;
  locale: string;
  status: string;
  reason_code: string | null;
  created_at: number;
  updated_at: number;
  attempt_count: number;
};
const harness = globalThis as unknown as {
  __states: unknown[];
  __index: number;
  __refs: { current: unknown }[];
  __refIndex: number;
  __effects: (() => void)[];
  __effectIndex: number;
};
function render() {
  harness.__index = 0;
  harness.__refIndex = 0;
  harness.__effectIndex = 0;
  return GameRequestAdmin();
}
function reset() {
  harness.__effects?.forEach((cleanup) => cleanup());
  harness.__states = [];
  harness.__refs = [];
  harness.__effects = [];
}
function findAll(node: unknown, type: string): Element[] {
  if (Array.isArray(node)) return node.flatMap((child) => findAll(child, type));
  if (!node || typeof node !== 'object') return [];
  const element = node as Element;
  return [
    ...(element.type === type ? [element] : []),
    ...findAll(element.props?.children, type),
  ];
}
function textOf(node: unknown): string {
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node === null || node === undefined || typeof node === 'boolean')
    return '';
  if (
    typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'bigint'
  )
    return String(node);
  if (typeof node !== 'object') return '';
  return textOf((node as Element).props?.children);
}
function button(label: string, root: unknown = render()) {
  const found = findAll(root, 'button').find(
    (entry) => textOf(entry) === label,
  );
  assert.ok(found, `Button exists: ${label}`);
  return found;
}
function click(element: Element) {
  const handler = element.props?.onClick;
  assert.equal(typeof handler, 'function');
  (handler as () => void)();
}
function reload() {
  click(findAll(render(), 'button')[0]);
}
function busy() {
  return render().props['aria-busy'];
}
async function settle() {
  for (let i = 0; i < 30 && busy(); i++) {
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
  assert.equal(busy(), false, 'Operation completed');
}
function row(id = 'request-1', status = 'received', updated = 10): Row {
  return {
    id,
    status,
    game_name: '原神',
    locale: 'ja',
    reason_code: null,
    created_at: 1,
    updated_at: updated,
    attempt_count: 0,
  };
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}
function queue(
  requests = [row()],
  mode = 'manual',
  next: string | null = null,
) {
  return json({ requests, next, reviewMode: mode });
}
function deferred() {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
async function loadRows(
  requests = [row()],
  mode = 'manual',
  next: string | null = null,
) {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/admin/game-requests');
    assert.equal(options?.credentials, 'same-origin');
    assert.equal(options?.cache, 'no-store');
    assert.ok(options?.signal instanceof AbortSignal);
    return queue(requests, mode, next);
  };
  reload();
  await settle();
}
const originalFetch = globalThis.fetch;
try {
  reset();
  let html = renderToStaticMarkup(render());
  assert.ok(html.includes('8時間'));
  assert.ok(
    html.includes('ゲーム追加や記事の公開を実行・保証するものではありません'),
  );
  assert.ok(html.includes('非公開のリクエストを読み込む'));
  assert.equal(
    findAll(render(), 'input').length,
    0,
    'No new credential or free-text input',
  );
  assert.equal(
    findAll(render(), 'li').length,
    0,
    'No requests in initial markup',
  );

  await loadRows([]);
  assert.ok(textOf(render()).includes('リクエストはありません。'));
  for (const mode of ['automatic', 'unavailable', 'unknown']) {
    await loadRows([row()], mode);
    assert.equal(findAll(render(), 'fieldset').length, 0);
    assert.ok(textOf(render()).includes('採用・保留を変更できません'));
  }
  await loadRows([
    {
      ...row(),
      game_name: '<img src=x onerror="alert(1)">',
      reason_code: '<script>x</script>',
    },
    row('held', 'held'),
    row('adopted', 'researching'),
    row('in-flight', 'validating'),
    row('published', 'published'),
    row('prototype', '__proto__'),
  ]);
  html = renderToStaticMarkup(render());
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('&lt;script'));
  assert.ok(!html.includes('<img') && !html.includes('<script'));
  assert.equal(
    findAll(render(), 'fieldset').length,
    3,
    'Only manual reviewable rows have decisions',
  );
  const entries = findAll(render(), 'li');
  assert.equal(button('保留', entries[1]).props?.disabled, true);
  assert.equal(button('採用（調査予定）', entries[2]).props?.disabled, true);

  globalThis.fetch = async () => json({}, 401);
  reload();
  await settle();
  assert.equal(findAll(render(), 'li').length, 0);
  assert.equal(findAll(render(), 'a')[0].props?.href, '/admin/discord-servers');
  assert.ok(textOf(render()).includes('有効期限が切れています'));
  await loadRows();
  assert.equal(
    findAll(render(), 'li').length,
    1,
    'Login retry recovers without a page reload',
  );

  const pendingPatch = deferred();
  const pendingRefresh = deferred();
  let mutations = 0;
  let reads = 0;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/admin/game-requests');
    assert.equal(options?.credentials, 'same-origin');
    if (options?.method === 'PATCH') {
      mutations++;
      assert.deepEqual(JSON.parse(options.body as string), {
        action: 'review',
        id: 'request-1',
        expectedUpdatedAt: 10,
        decision: 'adopt',
      });
      assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
      return pendingPatch.promise;
    }
    reads++;
    return pendingRefresh.promise;
  };
  const staleAdoptButton = button('採用（調査予定）');
  click(staleAdoptButton);
  click(staleAdoptButton);
  reload();
  assert.equal(mutations, 1, 'Synchronous duplicate click guard');
  assert.equal(reads, 0, 'Load cannot race a decision');
  assert.ok(
    findAll(render(), 'button').every((entry) => entry.props?.disabled),
  );
  pendingPatch.resolve(
    json({
      request: { id: 'request-1', status: 'researching', updated_at: 11 },
    }),
  );
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(reads, 1, 'Successful decision refreshes the list');
  assert.equal(busy(), true, 'Controls remain disabled through refresh');
  pendingRefresh.resolve(queue([row('request-1', 'researching', 11)]));
  await settle();
  assert.ok(textOf(render()).includes('採用（調査予定）として保存'));
  assert.equal(button('採用（調査予定）').props?.disabled, true);

  let lastDecision: unknown;
  globalThis.fetch = async (_url, options) => {
    if (options?.method === 'PATCH') {
      lastDecision = JSON.parse(options.body as string);
      return json({
        request: { id: 'request-1', status: 'held', updated_at: 12 },
      });
    }
    return queue([row('request-1', 'held', 12)]);
  };
  click(button('保留'));
  await settle();
  assert.deepEqual(lastDecision, {
    action: 'review',
    id: 'request-1',
    expectedUpdatedAt: 11,
    decision: 'hold',
  });
  assert.ok(textOf(render()).includes('保留として保存'));
  assert.equal(button('保留').props?.disabled, true);

  await loadRows();
  mutations = 0;
  globalThis.fetch = async (_url, options) => {
    if (options?.method === 'PATCH') {
      mutations++;
      return json({}, 409);
    }
    return queue([row('request-1', 'held', 30)]);
  };
  click(button('採用（調査予定）'));
  await settle();
  assert.equal(mutations, 1, 'Conflict refresh never resends a decision');
  assert.ok(
    textOf(render()).includes('ほかの処理で状態が変わったか、処理中です'),
  );
  assert.equal(button('保留').props?.disabled, true);

  for (const status of [400, 401, 403, 429, 500, 503]) {
    await loadRows();
    globalThis.fetch = async () => json({}, status);
    click(button('採用（調査予定）'));
    await settle();
    assert.equal(
      findAll(render(), 'fieldset').length,
      0,
      `No stale decisions after ${status}`,
    );
    if (status === 401) assert.equal(findAll(render(), 'li').length, 0);
    else assert.ok(textOf(render()).includes('再読み込み'));
    if (status === 503)
      assert.ok(textOf(render()).includes('手動審査を利用できません'));
    if (status === 429)
      assert.ok(textOf(render()).includes('操作が集中しています'));
  }
  for (const receipt of [
    { request: { id: 'request-1', status: 'researching', updated_at: 10 } },
    {},
    null,
    { request: { id: 'wrong', status: 'researching', updated_at: 11 } },
    { request: { id: 'request-1', status: 'published', updated_at: 11 } },
  ]) {
    await loadRows();
    globalThis.fetch = async () => json(receipt);
    click(button('採用（調査予定）'));
    await settle();
    assert.ok(textOf(render()).includes('変更結果を確認できません'));
    assert.equal(findAll(render(), 'fieldset').length, 0);
  }
  await loadRows();
  globalThis.fetch = async () => {
    throw new Error('offline');
  };
  click(button('採用（調査予定）'));
  await settle();
  assert.ok(textOf(render()).includes('変更結果を確認できません'));
  await loadRows();
  assert.equal(
    findAll(render(), 'fieldset').length,
    1,
    'Refresh safely recovers after ambiguous mutation failure',
  );

  for (const refreshStatus of [401, 503]) {
    await loadRows();
    globalThis.fetch = async (_url, options) =>
      options?.method === 'PATCH'
        ? json({
            request: { id: 'request-1', status: 'researching', updated_at: 11 },
          })
        : json({}, refreshStatus);
    click(button('採用（調査予定）'));
    await settle();
    assert.ok(textOf(render()).includes('変更は保存されました'));
    assert.equal(findAll(render(), 'fieldset').length, 0);
  }
  for (const invalid of [
    null,
    {},
    { requests: [{}], next: null },
    { requests: [{ ...row(), created_at: 1e20 }], next: null },
    { requests: [row()], next: 10 },
  ]) {
    globalThis.fetch = async () => json(invalid);
    reload();
    await settle();
    assert.equal(findAll(render(), 'fieldset').length, 0);
    assert.ok(textOf(render()).includes('一覧を読み込めませんでした'));
  }
  for (const status of [429, 503]) {
    globalThis.fetch = async () => json({}, status);
    reload();
    await settle();
    assert.equal(findAll(render(), 'fieldset').length, 0);
  }

  await loadRows([row('first'), row('second')], 'manual', 'page-2');
  let pages = 0;
  const pendingPage = deferred();
  globalThis.fetch = async (url) => {
    assert.equal(url, '/api/admin/game-requests?after=page-2');
    pages++;
    return pendingPage.promise;
  };
  const nextPage = button('次の50件');
  click(nextPage);
  click(nextPage);
  assert.equal(pages, 1);
  pendingPage.resolve(
    queue([row('second', 'held', 20), row('third')], 'manual', null),
  );
  await settle();
  assert.equal(
    findAll(render(), 'li').length,
    3,
    'Pagination deduplicates IDs',
  );
  assert.equal(
    button('保留', findAll(render(), 'li')[1]).props?.disabled,
    true,
    'Duplicate receives latest state',
  );

  await loadRows([], 'manual', 'page-0');
  for (let page = 0; page < 10; page++) {
    globalThis.fetch = async () =>
      queue(
        Array.from({ length: 50 }, (_value, index) =>
          row(`row-${page * 50 + index}`),
        ),
        'manual',
        `page-${page + 1}`,
      );
    click(button('次の50件'));
    await settle();
  }
  assert.equal(findAll(render(), 'li').length, 500);
  assert.ok(textOf(render()).includes('表示は最大500件'));
  assert.ok(
    !findAll(render(), 'button').some((entry) => textOf(entry) === '次の50件'),
  );
  await loadRows();
  assert.ok(!textOf(render()).includes('表示は最大500件'));

  // Simulate an unmount/remount while an old request ignores AbortSignal.
  // The old response must not clear newer rows or unlock a newer operation.
  const oldLoad = deferred();
  const newLoad = deferred();
  let callIndex = 0;
  globalThis.fetch = async () =>
    ++callIndex === 1 ? oldLoad.promise : newLoad.promise;
  reload();
  harness.__effects[0]();
  reload();
  oldLoad.resolve(json({}, 401));
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(
    busy(),
    true,
    'Stale completion cannot unlock a newer operation',
  );
  newLoad.resolve(queue([row('newest')]));
  await settle();
  assert.ok(textOf(render()).includes('newest'));
  assert.ok(!textOf(render()).includes('有効期限が切れています'));
} finally {
  harness.__effects?.forEach((cleanup) => cleanup());
  globalThis.fetch = originalFetch;
}
console.log(
  'Game request admin: load, empty, manual/automatic/unavailable, untrusted text, login recovery, adopt/hold, duplicate clicks, busy refresh, conflict, HTTP/network/malformed errors, saved-but-refresh-failed, pagination dedupe/cap and stale-response race passed (local shallow hooks).',
);
