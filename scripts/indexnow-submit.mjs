import {
  mkdir,
  open,
  readFile,
  rename,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import {
  SITE,
  REPO,
  BRANCH,
  ENDPOINT,
  KEY_FILE,
  digest,
  inspectArticle,
  requireValue,
  validatePlan,
} from './indexnow-content.mjs';

const API = `https://api.github.com/repos/${REPO}`;
const MAX_ATTEMPTS = 3;
const receiptId = (entry) => digest(`${entry.url}\0${entry.afterHash}`);
const finished = new Set(['accepted', 'key_validation_pending']);

async function get(url, fetchFn) {
  const response = await fetchFn(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
    headers: {
      Accept: url.startsWith(API) ? 'application/vnd.github+json' : '*/*',
    },
  });
  requireValue(
    response.status === 200 && !response.redirected,
    `GET did not return 200: ${url.includes(KEY_FILE) ? 'public IndexNow key' : url} (${response.status})`,
  );
  return response;
}
export async function verifyDeployment(head, fetchFn = fetch) {
  const branch = await (await get(`${API}/branches/${BRANCH}`, fetchFn)).json();
  requireValue(
    branch.commit?.sha === head,
    'Production branch moved; rebuild and review the plan',
  );
  const result = await (
    await get(`${API}/commits/${head}/check-runs?per_page=100`, fetchFn)
  ).json();
  const checks =
    result.check_runs?.filter(
      (c) =>
        c.name === 'Cloudflare Pages' &&
        c.app?.id === 85455 &&
        c.app?.slug === 'cloudflare-workers-and-pages' &&
        /^https:\/\/dash\.cloudflare\.com\/\?to=\/[a-f0-9]+\/pages\/view\/gemnao\/[a-f0-9-]+$/.test(
          c.details_url || '',
        ),
    ) || [];
  const latest = checks.sort((a, b) => b.id - a.id)[0];
  requireValue(
    latest &&
      latest.head_sha === head &&
      latest.status === 'completed' &&
      latest.conclusion === 'success' &&
      latest.output?.title === 'Deployed successfully',
    'Exact production commit has no successful latest Cloudflare Pages check',
  );
  return {
    id: latest.id,
    head,
    completedAt: latest.completed_at,
    detailsUrl: latest.details_url,
  };
}

export async function verifyProduction(plan, key, fetchFn = fetch) {
  requireValue(
    /^[A-Za-z0-9-]{8,128}$/.test(key) && `${key}.txt` === KEY_FILE,
    'Existing public IndexNow key file is invalid',
  );
  const deployment = await verifyDeployment(plan.headCommit, fetchFn);
  const keyResponse = await get(`${SITE}/${KEY_FILE}`, fetchFn);
  requireValue(
    (await keyResponse.text()).trim() === key,
    'Public IndexNow key content does not match',
  );
  for (const entry of plan.urls) {
    const response = await get(entry.url, fetchFn);
    requireValue(
      /^text\/html(?:;|$)/i.test(response.headers.get('content-type') || ''),
      `Expected HTML: ${entry.url}`,
    );
    const article = inspectArticle(
      await response.text(),
      entry.url,
      response.headers,
    );
    requireValue(
      article.hash === entry.afterHash,
      `Production content differs from reviewed build: ${entry.url}`,
    );
  }
  const finalDeployment = await verifyDeployment(plan.headCommit, fetchFn);
  requireValue(
    finalDeployment.id === deployment.id,
    'Deployment changed during verification',
  );
  return finalDeployment;
}

async function readState(path) {
  try {
    const data = JSON.parse(await readFile(path, 'utf8'));
    requireValue(
      data.version === 1 &&
        data.origin === SITE &&
        data.entries &&
        typeof data.entries === 'object' &&
        !Array.isArray(data.entries) &&
        Array.isArray(data.events),
      'Invalid receipt state; preserve it for review',
    );
    for (const [id, receipt] of Object.entries(data.entries)) {
      requireValue(
        receipt &&
          typeof receipt === 'object' &&
          /^[a-f0-9]{64}$/.test(receipt.contentHash) &&
          id === digest(`${receipt.url}\0${receipt.contentHash}`) &&
          /^[a-f0-9]{40}$/.test(receipt.commit) &&
          Number.isSafeInteger(receipt.checkId) &&
          receipt.checkId > 0 &&
          Number.isSafeInteger(receipt.attempts) &&
          receipt.attempts >= 1 &&
          receipt.attempts <= MAX_ATTEMPTS &&
          Number.isFinite(receipt.updatedAt) &&
          [
            'accepted',
            'key_validation_pending',
            'retryable',
            'rejected',
            'uncertain',
            'in_flight',
          ].includes(receipt.status) &&
          (receipt.status !== 'accepted' || receipt.httpStatus === 200) &&
          (receipt.status !== 'key_validation_pending' ||
            receipt.httpStatus === 202) &&
          (receipt.status !== 'retryable' ||
            Number.isFinite(receipt.nextAttemptAt)),
        'Invalid receipt entry; preserve it for review',
      );
    }
    return data;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { version: 1, origin: SITE, entries: {}, events: [] };
  }
}
function retryDelay(response, attempt, now) {
  const value = response.headers.get('retry-after');
  if (value) {
    const ms = /^\d+$/.test(value)
      ? Number(value) * 1000
      : Date.parse(value) - now;
    return Number.isFinite(ms) ? Math.max(1000, ms) : 3600000;
  }
  return 1000 * 2 ** (attempt - 1);
}

export async function runIndexNow({
  plan: input,
  mode = 'dry-run',
  key,
  stateDir,
  fetchFn = fetch,
  sleep = delay,
  now = Date.now,
}) {
  const plan = validatePlan(input);
  requireValue(['dry-run', 'verify', 'send'].includes(mode), 'Invalid mode');
  if (mode === 'dry-run')
    return {
      mode,
      head: plan.headCommit,
      count: plan.urls.length,
      urls: plan.urls.map((e) => e.url),
      posts: 0,
    };
  if (!plan.urls.length) return { mode, count: 0, posts: 0 };
  if (mode === 'verify')
    return {
      mode,
      count: plan.urls.length,
      deployment: await verifyProduction(plan, key, fetchFn),
      posts: 0,
    };
  requireValue(stateDir, 'A durable receipt directory is required');
  await mkdir(stateDir, { recursive: true });
  const lockPath = join(stateDir, 'submission.lock');
  const lock = await open(lockPath, 'wx');
  const statePath = join(stateDir, 'receipts.json');
  try {
    const state = await readState(statePath);
    const save = async () => {
      await writeFile(
        statePath + '.tmp',
        JSON.stringify(state, null, 2) + '\n',
      );
      await rename(statePath + '.tmp', statePath);
    };
    const pending = plan.urls.filter(
      (e) => !finished.has(state.entries[receiptId(e)]?.status),
    );
    if (!pending.length)
      return { mode, status: 'already_received', count: 0, posts: 0 };
    for (const entry of pending) {
      const previous = state.entries[receiptId(entry)];
      requireValue(
        !previous ||
          (previous.status === 'retryable' &&
            previous.attempts < MAX_ATTEMPTS &&
            previous.nextAttemptAt <= now()),
        `Receipt blocks automatic resubmission; review status/attempts/retry time: ${entry.url}`,
      );
      const sameUrl = Object.values(state.entries).filter(
        (r) => r.url === entry.url,
      );
      requireValue(
        !sameUrl.some((r) => ['in_flight', 'uncertain'].includes(r.status)),
        `Uncertain prior request needs review: ${entry.url}`,
      );
      requireValue(
        !sameUrl.some(
          (r) => finished.has(r.status) && now() - r.updatedAt < 300000,
        ),
        `Wait at least five minutes between changed versions: ${entry.url}`,
      );
    }
    const selected = { ...plan, urls: pending };
    const deployment = await verifyProduction(selected, key, fetchFn);
    let posts = 0;
    while (true) {
      const check = await verifyDeployment(plan.headCommit, fetchFn);
      requireValue(
        check.id === deployment.id,
        'Deployment changed before submission',
      );
      for (const e of pending) {
        const id = receiptId(e),
          old = state.entries[id];
        state.entries[id] = {
          url: e.url,
          contentHash: e.afterHash,
          commit: plan.headCommit,
          checkId: deployment.id,
          status: 'in_flight',
          attempts: (old?.attempts || 0) + 1,
          updatedAt: now(),
        };
      }
      state.events.push({
        at: now(),
        status: 'in_flight',
        commit: plan.headCommit,
        checkId: deployment.id,
        receiptIds: pending.map(receiptId),
      });
      await save();
      posts++;
      let response;
      try {
        response = await fetchFn(ENDPOINT, {
          method: 'POST',
          redirect: 'manual',
          signal: AbortSignal.timeout(20000),
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host: new URL(SITE).host,
            key,
            keyLocation: `${SITE}/${KEY_FILE}`,
            urlList: pending.map((e) => e.url),
          }),
        });
      } catch {
        for (const e of pending)
          Object.assign(state.entries[receiptId(e)], {
            status: 'uncertain',
            updatedAt: now(),
          });
        state.events.push({
          at: now(),
          status: 'uncertain',
          commit: plan.headCommit,
          receiptIds: pending.map(receiptId),
        });
        await save();
        throw new Error(
          'IndexNow response unknown; do not resend automatically. Preserve receipts for review.',
        );
      }
      const attempts = Math.max(
        ...pending.map((e) => state.entries[receiptId(e)].attempts),
      );
      const retryable =
        response.status === 429 ||
        [500, 502, 503, 504].includes(response.status);
      const status =
        response.status === 200
          ? 'accepted'
          : response.status === 202
            ? 'key_validation_pending'
            : retryable
              ? 'retryable'
              : 'rejected';
      const wait = retryable ? retryDelay(response, attempts, now()) : 0;
      for (const e of pending)
        Object.assign(state.entries[receiptId(e)], {
          status,
          httpStatus: response.status,
          updatedAt: now(),
          nextAttemptAt: now() + wait,
        });
      state.events.push({
        at: now(),
        status,
        httpStatus: response.status,
        commit: plan.headCommit,
        receiptIds: pending.map(receiptId),
      });
      await save();
      if (finished.has(status))
        return {
          mode,
          status,
          httpStatus: response.status,
          count: pending.length,
          posts,
          indexingConfirmed: false,
          deployment,
        };
      if (!retryable || attempts >= MAX_ATTEMPTS || wait > 30000)
        throw new Error(
          `IndexNow ${response.status}; stopped after ${attempts} attempt(s). See durable receipts before retrying.`,
        );
      await sleep(wait);
    }
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}
