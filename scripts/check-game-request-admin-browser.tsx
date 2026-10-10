// Local, synthetic-only browser fixture. Never imported by the application.
import { createRoot } from 'react-dom/client';
import { GameRequestAdmin } from '../components/game-request-admin';

const scenarios = [
  'manual',
  'empty',
  'unavailable',
  'automatic',
  'login',
  'conflict',
  'rate-limit',
  'unavailable-on-save',
  'network-error',
  'login-expired',
];
const scenario =
  new URLSearchParams(window.location.search).get('scenario') ?? 'manual';
let authenticated = scenario !== 'login';
let firstMutation = true;
let requests =
  scenario === 'empty'
    ? []
    : [
        {
          id: '11111111-1111-4111-8111-111111111111',
          game_name: 'テストゲーム Alpha',
          locale: 'ja',
          status: 'received',
          reason_code: null,
          created_at: 1_790_000_000_000,
          updated_at: 1_790_000_000_000,
          attempt_count: 0,
        },
        {
          id: '22222222-2222-4222-8222-222222222222',
          game_name: 'Test Game Beta',
          locale: 'en',
          status: 'held',
          reason_code: 'manual_review',
          created_at: 1_790_000_000_001,
          updated_at: 1_790_000_000_001,
          attempt_count: 0,
        },
        {
          id: '33333333-3333-4333-8333-333333333333',
          game_name: '测试游戏 Gamma',
          locale: 'zh',
          status: 'researching',
          reason_code: null,
          created_at: 1_790_000_000_002,
          updated_at: 1_790_000_000_002,
          attempt_count: 0,
        },
        {
          id: '44444444-4444-4444-8444-444444444444',
          game_name: '<img src=x onerror="alert(1)">',
          locale: 'es',
          status: 'validating',
          reason_code: null,
          created_at: 1_790_000_000_003,
          updated_at: 1_790_000_000_003,
          attempt_count: 1,
        },
      ];
const events: { method: string; body: unknown }[] = [];
function record(method: string, body: unknown) {
  events.push({ method, body });
  const diagnostics = document.querySelector('#fixture-requests');
  if (diagnostics) diagnostics.textContent = JSON.stringify(events, null, 2);
}
const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status });
window.fetch = async (input, options) => {
  if (input !== '/api/admin/game-requests')
    throw new Error(
      'Only synthetic queue requests are supported by this fixture.',
    );
  const body: unknown =
    typeof options?.body === 'string' ? JSON.parse(options.body) : null;
  record(options?.method ?? 'GET', body);
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  if (!authenticated) return reply({}, 401);
  if (options?.method !== 'PATCH') {
    return reply({
      requests: structuredClone(requests),
      next: null,
      reviewMode: ['unavailable', 'automatic'].includes(scenario)
        ? scenario
        : 'manual',
    });
  }
  const mutation = body as {
    action?: string;
    id?: string;
    decision?: string;
    expectedUpdatedAt?: number;
  };
  if (
    mutation.action !== 'review' ||
    !['adopt', 'hold'].includes(mutation.decision ?? '')
  )
    return reply({}, 400);
  const target = requests.find((request) => request.id === mutation.id);
  if (!target) return reply({}, 404);
  if (firstMutation) {
    firstMutation = false;
    if (scenario === 'network-error')
      throw new Error('Synthetic offline error');
    if (scenario === 'rate-limit') return reply({}, 429);
    if (scenario === 'unavailable-on-save') return reply({}, 503);
    if (scenario === 'login-expired') {
      authenticated = false;
      return reply({}, 401);
    }
    if (scenario === 'conflict') {
      target.status = 'held';
      target.updated_at++;
      return reply({}, 409);
    }
  }
  if (target.updated_at !== mutation.expectedUpdatedAt) return reply({}, 409);
  target.status = mutation.decision === 'adopt' ? 'researching' : 'held';
  target.updated_at++;
  requests = [...requests];
  return reply({
    request: {
      id: target.id,
      status: target.status,
      updated_at: target.updated_at,
    },
  });
};
document.addEventListener('click', (event) => {
  const target = event.target;
  if (
    !(target instanceof HTMLAnchorElement) ||
    target.getAttribute('href') !== '/admin/discord-servers'
  )
    return;
  event.preventDefault();
  authenticated = true;
  const status = document.querySelector('#fixture-login');
  if (status)
    status.textContent = 'テスト用ログイン完了。一覧を再読み込みしてください。';
});
const root = document.getElementById('root');
if (!root) throw new Error('Missing fixture root');
createRoot(root).render(
  <main>
    <aside className="fixture-banner">
      <strong>Local fixture · Synthetic requests only</strong>
      <p>
        No production APIs, database, credentials or external network calls.
      </p>
      <label>
        Scenario{' '}
        <select
          defaultValue={scenario}
          onChange={(event) => {
            window.location.search = `?scenario=${encodeURIComponent(event.target.value)}`;
          }}
        >
          {scenarios.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <p id="fixture-login" />
    </aside>
    <article>
      <p>PRIVATE ADMIN</p>
      <h1>ゲーム追加リクエスト管理</h1>
      <GameRequestAdmin />
    </article>
    <details>
      <summary>Synthetic request log</summary>
      <pre id="fixture-requests" />
    </details>
  </main>,
);
