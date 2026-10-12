// One fixed failed deployment, GET only; reuse the existing protected runner.
import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { TARGET, gate, Blocked } from './control.mjs';
export const DEPLOYMENT = 'fb3a8300-71e2-44ff-b5ef-d260a44eb0ed';
export const COMMIT = 'ea8f609f1149158a5f93e249924696edd3894ea5';
export const LOG_URL = `https://api.cloudflare.com/client/v4/accounts/${TARGET.account}/pages/projects/${TARGET.project}/deployments/${DEPLOYMENT}/history/logs`;

export function projectLogs(result, secrets = []) {
  if (!Array.isArray(result?.data) || result.data.length > 20000 ||
      !Number.isSafeInteger(result.total) || result.total < result.data.length)
    throw new Blocked('LOG_SHAPE_INVALID');
  const errors = [];
  let omittedSensitive = 0;
  for (const row of result.data) {
    if (typeof row?.line !== 'string' || row.line.length > 32768) continue;
    // Remove terminal escapes/control bytes before publishing untrusted log text.
    // eslint-disable-next-line no-control-regex
    let line = row.line.replace(/\x1b\[[0-9;]*m/g, '').replace(/[\x00-\x1f\x7f]/g, ' ');
    if (!/error|fail|fatal|exceed|limit|invalid|not found|could not|cannot|denied|unsupported|unable|exit code/i.test(line)) continue;
    if (/token|secret|password|authorization|cookie|credential|env_vars|private[_ -]?key|api[_ -]?key/i.test(line)) {
      omittedSensitive++; continue;
    }
    for (const secret of secrets) if (secret) line = line.replaceAll(secret, '[REDACTED]');
    line = line.replace(/https?:\/\/\S+/g, '[URL]')
      .replace(/[A-Za-z0-9_+/=-]{32,}/g, '[OPAQUE]')
      .replace(/([A-Z][A-Z0-9_]{2,})\s*=\s*(?:"[^"]*"|'[^']*'|\S+)/g, '$1=[REDACTED]');
    errors.push({ at: typeof row.ts === 'string' && /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(row.ts) ? row.ts : null, line: line.slice(0,1000) });
  }
  return { deployment: DEPLOYMENT, commit: COMMIT, readOnly: true,
    totalProviderLines: result.total, receivedLines: result.data.length,
    includesContainerLogs: result.includes_container_logs === true,
    omittedSensitive, errors: errors.slice(-100),
    logTextIsUntrusted: true, rawLogsStored: false };
}

export async function readDeploymentLog(env, fetcher = fetch) {
  if (env.INVENTORY_PROTECTED_ENVIRONMENT !== TARGET.environment)
    throw new Blocked('PROTECTED_ENVIRONMENT_REQUIRED');
  await gate(env, fetcher); // preserves first-run, branch, reviewer and workflow checks
  const token = env.CLOUDFLARE_API_TOKEN;
  if (typeof token !== 'string' || !/^[\x21-\x7e]+$/.test(token))
    throw new Blocked('EXISTING_CLOUDFLARE_AUTH_REQUIRED');
  let response;
  try {
    response = await fetcher(LOG_URL, { method: 'GET', redirect: 'error',
      signal: AbortSignal.timeout(30000), headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  } catch { throw new Blocked('PAGES_LOG_REQUEST_FAILED'); }
  if (!response.ok) throw new Blocked(`PAGES_LOG_HTTP_${response.status}`);
  let data;
  try { data = await response.json(); } catch { throw new Blocked('PAGES_LOG_INVALID_JSON'); }
  if (data.success !== true || !Array.isArray(data.errors) || data.errors.length)
    throw new Blocked('PAGES_LOG_RESPONSE_FAILED');
  return projectLogs(data.result, [token, env.GH_TOKEN]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const report = JSON.stringify(await readDeploymentLog(process.env), null, 2);
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `\n\`\`\`json\n${report}\n\`\`\`\n`);
    console.log(report);
  } catch (error) {
    console.error(JSON.stringify({ status: 'blocked', code: error instanceof Blocked ? error.message : 'PAGES_LOG_READ_FAILED' }));
    process.exitCode = 1;
  }
}
