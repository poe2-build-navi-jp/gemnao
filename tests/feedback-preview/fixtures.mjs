import assert from 'node:assert/strict';
import { createPreparedAdapter, PLAN_HASH, FEATURES } from '../../ops/feedback-preview/adapter.mjs';
import { TARGET, ARTIFACTS, sha256 } from '../../ops/feedback-preview/controller.mjs';
const now = Date.parse('2026-10-07T07:00:00Z');
const account = `/accounts/${TARGET.accountId}`;
const repo = `/repos/${TARGET.repository}`;
const workflow = 'feedback-preview-control.yml';
const dbIds = ['10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002'];
const workerIds = ['1'.repeat(32), '2'.repeat(32)];
const versionIds = ['20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002'];
export function fixtureRecord() {
  return { mode: 'create-empty-preview-pairs', operation: 'create-two-preview-pairs-20261007', planHash: PLAN_HASH, accountId: TARGET.accountId,
    ref: 'refs/heads/synthetic-reviewed', commit: 'a'.repeat(40), runId: 12345, approvedAt: now,
    reviewerPolicy: 'owner-manual', reviewers: [123], requireOwnerInitiator: false,
    claimArtifact: { archiveBytes: 8192, retentionDays: 1, access: 'existing-repository', storageBudgetReviewSha256: 'a'.repeat(64) },
    cleanupApproval: 'both-pinned-hourly-crons', cronTargeting: 'name-after-id-recheck-residual-rename-risk-accepted',
    alert: { destinationChoiceSha256: 'b'.repeat(64), deliveryStatus: 'pending', reviewedAt: now },
    costEvidence: { kind: 'owner-ui-reviewed', accountId: TARGET.accountId, operation: 'create-two-preview-pairs-20261007',
      planHash: PLAN_HASH, workersPlan: 'workers-free', maximumChargeUSD: 0,
      assessment: 'within-reviewed-zero-charge-envelope', screenshotSha256: 'd'.repeat(64), reviewEvidenceSha256: 'e'.repeat(64),
      capturedAt: now, reviewedAt: now, validUntil: Date.parse('2026-10-08T00:00:00Z'),
      quotaDateUTC: '2026-10-07', resetAt: Date.parse('2026-10-08T00:00:00Z'),
      planBasis: 'enforced-free-cap-pattern', unchangedPlanReviewSha256: 'f'.repeat(64),
      databaseLimit: 10, workerLimit: 100, cronLimit: 5,
      interveningUsageAllowance: { d1RowsRead: 1, d1RowsWritten: 1, storageBytes: 1, workerRequests: 1 },
      remaining: { databaseSlots: 2, workerSlots: 2, cronSlots: 2, d1RowsRead: 1001, d1RowsWritten: 1001, storageBytes: 1_000_001, workerRequests: 49 },
      reserve: { databaseSlots: 2, workerSlots: 2, cronSlots: 2, d1RowsRead: 1000, d1RowsWritten: 1000, storageBytes: 1_000_000, workerRequests: 48 } },
    reconciledNoWriteRuns: [] };
}
export function mock(record, mutate = () => {}, failureWrite = 0) {
  const calls = []; const databases = []; const workers = []; const versions = new Map(); let writes = 0;
  const run = { id: record.runId, workflow_id: 88, run_attempt: 1, event: 'workflow_dispatch',
    head_sha: record.commit, head_branch: record.ref.slice('refs/heads/'.length), path: `.github/workflows/${workflow}`,
    repository: { full_name: TARGET.repository }, status: 'in_progress', actor: { id: 456 }, triggering_actor: { id: 456 } };
  const transport = async (url, options) => {
    const parsed = new URL(url); const path = parsed.pathname.replace(/^\/client\/v4/, '');
    const query = parsed.search; const body = options.body ? JSON.parse(options.body) : undefined;
    const call = { url, method: options.method, path, query, body }; calls.push(call);
    assert.equal(options.redirect, 'error'); assert.ok(options.signal);
    const isCF = parsed.hostname === 'api.cloudflare.com'; let value;
    if (!isCF) {
      assert.equal(options.method, 'GET');
      if (path === `${repo}/actions/runs/${record.runId}`) value = structuredClone(run);
      else if (path === `${repo}/git/ref/heads/${record.ref.slice('refs/heads/'.length)}`) value = { ref: record.ref, object: { sha: record.commit } };
      else if (path === `${repo}/actions/workflows/${workflow}/runs`) value = { total_count: 1, workflow_runs: [structuredClone(run)] };
      else if (path === `${repo}/actions/runs/${record.runId}/approvals`) value = [{ state: 'approved', user: { id: 123 }, environments: [{ id: 1, name: TARGET.environment }] }];
      else {
        const index = FEATURES.findIndex(f => path.startsWith(`${repo}/environments/${f.environment}`)); assert.ok(index >= 0);
        const f = FEATURES[index];
        value = path.endsWith('/deployment-branch-policies') ? { total_count: 1, branch_policies: [{ type: 'branch', name: record.ref.slice('refs/heads/'.length) }] }
          : { id: index + 1, name: f.environment, can_admins_bypass: false,
            deployment_branch_policy: { protected_branches: false, custom_branch_policies: true },
            protection_rules: [{ type: 'required_reviewers', prevent_self_review: record.reviewerPolicy === 'independent', reviewers: [{ type: 'User', reviewer: { id: 123 } }] }] };
      }
    } else {
      let result;
      if (options.method !== 'GET' && ++writes === failureWrite) throw new Error('SYNTHETIC_SECRET_DO_NOT_LOG');
      if (path === account) result = { id: TARGET.accountId };
      else if (path === `${account}/d1/database` && options.method === 'GET') result = databases;
      else if (path === `${account}/workers/workers` && options.method === 'GET') result = workers;
      else if (path === `${account}/d1/database`) {
        const i = FEATURES.findIndex(f => f.database === body.name); assert.ok(i >= 0);
        result = { uuid: dbIds[i], name: body.name, created_at: new Date(now).toISOString() }; databases.push(result);
      } else if (path.endsWith('/query')) {
        const i = dbIds.findIndex(id => path.includes(id)); assert.ok(i >= 0);
        assert.equal(sha256(body.sql), ARTIFACTS[FEATURES[i].schema]);
        result = Array.from({ length: FEATURES[i].statements }, () => ({ success: true }));
      } else if (path.startsWith(`${account}/d1/database/`)) result = databases.find(d => path.endsWith(d.uuid));
      else if (path === `${account}/workers/workers`) {
        const i = FEATURES.findIndex(f => f.worker === body.name); assert.ok(i >= 0);
        result = { ...body, id: workerIds[i], created_on: new Date(now).toISOString() }; workers.push(result);
      } else if (path.endsWith('/versions')) {
        const i = workerIds.findIndex(id => path.includes(id)); assert.ok(i >= 0); assert.equal(query, '?deploy=true');
        assert.deepEqual(body.bindings, [{ name: FEATURES[i].binding, type: 'd1', database_id: dbIds[i] }]);
        assert.equal(body.modules.length, 1); assert.equal(sha256(Buffer.from(body.modules[0].content_base64, 'base64')), ARTIFACTS[FEATURES[i].module]);
        result = { ...body, id: versionIds[i] }; versions.set(versionIds[i], result);
      } else if (path.includes('/versions/')) { assert.equal(query, '?include=modules'); result = versions.get(path.split('/').at(-1)); }
      else if (path.endsWith('/schedules') && options.method === 'GET') result = [];
      else if (path.endsWith('/schedules')) {
        const f = FEATURES.find(f => path.includes(f.worker)); assert.ok(f); assert.deepEqual(body, [{ cron: f.cron }]); result = body;
      } else result = workers.find(w => path.endsWith(w.id) || path.endsWith(w.name));
      assert.notEqual(result, undefined, path);
      value = { success: true, errors: [], result: structuredClone(result) };
      if (options.method === 'GET' && [account + '/d1/database', account + '/workers/workers'].includes(path))
        value.result_info = { page: 1, per_page: 100, total_count: result.length };
    }
    mutate(call, value);
    const response = new Response(JSON.stringify(value), { status: 200, headers: { 'content-type': 'application/json' } });
    Object.defineProperty(response, 'url', { value: url }); return response;
  };
  return { transport, calls };
}
export function claimStore() {
  const rows = new Map();
  return { async createExclusive(name, payload) {
    if (rows.has(name)) throw new Error('already claimed');
    rows.set(name, structuredClone(payload)); return { id: name };
  }, async read(id) { return { name: id, payload: structuredClone(rows.get(id)) }; } };
}
export async function prepare(record = fixtureRecord(), mutate, failWrite, durableClaims = claimStore()) {
  const network = mock(record, mutate, failWrite); const recordBytes = JSON.stringify(record);
  const adapter = await createPreparedAdapter({ ...network, durableClaims, recordBytes, trustedRecordHash: sha256(recordBytes), now: () => now });
  return { adapter, ...network };
}

export { now, account, repo, workflow, dbIds, workerIds, versionIds };
