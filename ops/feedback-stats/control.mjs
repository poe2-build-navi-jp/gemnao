// Operator-only aggregate read through the existing protected D1 Environment.
import { appendFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gate as existingGate } from '../d1/github-gate.mjs';
import { target, Blocked, cloudflareClient, pagesProjection, assertBinding } from '../d1/control.mjs';
export const workflow = 'Gemnao anonymous feedback aggregate read';
export const confirmation = 'READ_FEEDBACK_TOTALS_ONLY';
const check = (condition, code) => { if (!condition) throw new Blocked(code); };
// One SELECT, one snapshot; no identifiers, labels, receipts, IPs or text rows.
export const sql = `SELECT strftime('%Y-%m-%dT%H:%M:%fZ','now') AS observed_at,
 (SELECT COUNT(*) FROM issue_feedback) AS issue_rows,
 (SELECT COUNT(DISTINCT game_slug) FROM issue_feedback) AS issue_contexts,
 (SELECT COALESCE(SUM(resolved_count),0) FROM issue_feedback) AS issue_resolved,
 (SELECT COALESCE(SUM(struggling_count),0) FROM issue_feedback) AS issue_struggling,
 (SELECT COUNT(*) FROM solution_method_feedback) AS method_rows,
 (SELECT COUNT(DISTINCT context_slug) FROM solution_method_feedback) AS method_contexts,
 (SELECT COALESCE(SUM(response_count),0) FROM solution_method_feedback) AS method_resolved,
 (SELECT COALESCE(SUM(not_resolved_count),0) FROM solution_method_feedback) AS method_not_resolved,
 (SELECT COUNT(*) FROM issue_feedback WHERE typeof(resolved_count) != 'integer' OR resolved_count < 0 OR typeof(struggling_count) != 'integer' OR struggling_count < 0) AS invalid_issue_rows,
 (SELECT COUNT(*) FROM solution_method_feedback WHERE typeof(response_count) != 'integer' OR response_count < 0 OR typeof(not_resolved_count) != 'integer' OR not_resolved_count < 0) AS invalid_method_rows`;
const numericKeys = ['issue_rows','issue_contexts','issue_resolved','issue_struggling','method_rows','method_contexts','method_resolved','method_not_resolved','invalid_issue_rows','invalid_method_rows'];
export function assertContext(env, mode) {
  check(['gate','read'].includes(mode), 'INVALID_MODE');
  check(env.GITHUB_WORKFLOW === workflow && env.GITHUB_RUN_ATTEMPT === '1', 'FIRST_MANUAL_WORKFLOW_REQUIRED');
  check(env.FEEDBACK_STATS_CONFIRMATION === confirmation, 'EXPLICIT_READ_CONFIRMATION_REQUIRED');
  check(/^[a-f0-9]{40}$/.test(env.FEEDBACK_STATS_SOURCE_SHA || '') && env.FEEDBACK_STATS_SOURCE_SHA === env.GITHUB_SHA, 'REVIEWED_SOURCE_SHA_REQUIRED');
  if (mode === 'read') check(env.FEEDBACK_STATS_PROTECTED_ENVIRONMENT === target.environment, 'PROTECTED_ENVIRONMENT_REQUIRED');
}
export async function gate(env, fetcher = fetch) {
  assertContext(env, 'gate');
  // Same existing reviewer and production-only policy, without changing settings.
  return existingGate({ ...env, D1_OPERATION: 'settings' }, fetcher);
}
export function summarize(result, deploymentCommit, sourceCommit) {
  check(Array.isArray(result) && result.length === 1 && result[0].success === true && result[0].meta?.changed_db === false && Array.isArray(result[0].results) && result[0].results.length === 1, 'READ_ONLY_SINGLE_RESULT_REQUIRED');
  const row = result[0].results[0];
  check(row && Object.keys(row).length === numericKeys.length + 1 && Object.keys(row).every(k => k === 'observed_at' || numericKeys.includes(k)), 'UNEXPECTED_RESULT_FIELDS');
  check(numericKeys.every(k => Number.isSafeInteger(row[k]) && row[k] >= 0), 'INVALID_AGGREGATE_COUNTS');
  check(row.invalid_issue_rows === 0 && row.invalid_method_rows === 0, 'INVALID_STORED_COUNTERS');
  check(typeof row.observed_at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.observed_at) && Number.isFinite(Date.parse(row.observed_at)), 'INVALID_SNAPSHOT_TIME');
  return {
    schema: 1, complete: true, observed_at: row.observed_at, sourceCommit, deploymentCommit,
    database: target.database, scope: 'all stored rows in the two fixed aggregate tables, including legacy contexts',
    measurement: 'cumulative anonymous responses, not people or daily votes',
    issue_feedback: { stored_rows: row.issue_rows, contexts: row.issue_contexts, resolved: row.issue_resolved, struggling: row.issue_struggling },
    solution_method_feedback: { stored_rows: row.method_rows, contexts: row.method_contexts, resolved: row.method_resolved, not_resolved: row.method_not_resolved },
    combine_tables: false,
    comparison: 'No previous snapshot supplied. Differences require same database, scope and schema, no reset/restore, and nondecreasing counters; never add snapshots or the two tables.',
    retention: 'Aggregate counters have no scheduled TTL in current application code; persistence is not guaranteed. Receipt expiry of 30 days is separate. This artifact requests 7 days; workflow logs/summary follow repository retention, not verified here.',
  };
}
export async function read(env, fetcher = fetch) {
  assertContext(env, 'read');
  await gate(env, fetcher); // Recheck protection after the owner's Environment approval.
  const api = cloudflareClient(env.CLOUDFLARE_API_TOKEN, fetcher);
  const base = `/accounts/${target.account}`;
  const pages = pagesProjection(await api(`${base}/pages/projects/${target.project}`));
  assertBinding(pages);
  const database = await api(`${base}/d1/database/${target.database}`);
  assertBinding(pages, database);
  const result = await api(`${base}/d1/database/${target.database}/query`, sql);
  return summarize(result, pages.deploymentCommit, env.GITHUB_SHA);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv[2] === 'gate') {
      const environment = await gate(process.env);
      check(Boolean(process.env.GITHUB_OUTPUT), 'OUTPUT_REQUIRED');
      await appendFile(process.env.GITHUB_OUTPUT, `environment=${environment}\n`);
      console.log('Existing reviewer protection verified; no Cloudflare request made.');
    } else {
      check(process.argv[2] === 'read', 'INVALID_MODE');
      const report = await read(process.env);
      const json = JSON.stringify(report, null, 2);
      await writeFile('feedback-stats.json', json+'\n', { flag: 'wx', mode: 0o600 });
      console.log(json);
      if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `\n### Anonymous feedback cumulative aggregates\n\n\`\`\`json\n${json}\n\`\`\`\n`);
    }
  } catch (error) {
    console.error(JSON.stringify({ complete: false, code: error instanceof Blocked ? error.code : 'AGGREGATE_READ_FAILED' }));
    process.exitCode = 1;
  }
}
