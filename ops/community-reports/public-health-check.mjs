// Fixed public GET only: no credentials, Cloudflare API, SQL, guard writes or cleanup.
import { inspectHealth } from './readiness-inspection.mjs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function publicHealthCheck(
  env,
  fetcher = fetch,
  now = Date.now(),
) {
  if (!/^[a-f0-9]{40}$/.test(env.GITHUB_SHA || ''))
    throw Error('SOURCE_SHA_REQUIRED');
  const health = await inspectHealth(fetcher, now);
  return {
    operation: 'community-reports-public-health',
    sourceSha: env.GITHUB_SHA,
    capturedAt: new Date(now).toISOString(),
    healthy: health.reachable && health.validSchema && health.status === 200,
    health,
    productionChanged: false,
    notificationDeliveryVerified: false,
  };
}
// The CLI exit status is the GitHub standard notification trigger.
// A failed job is not evidence that its notification was delivered.
export async function runPublicHealthCheck(
  env,
  fetcher = fetch,
  now = Date.now(),
  logger = console,
) {
  try {
    const result = await publicHealthCheck(env, fetcher, now);
    logger.log('COMMUNITY_REPORTS_HEALTH ' + JSON.stringify(result));
    if (!result.healthy) {
      logger.error('PUBLIC_HEALTH_UNHEALTHY');
      return 1;
    }
    return 0;
  } catch {
    logger.error('PUBLIC_HEALTH_CHECK_FAILED');
    return 1;
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  process.exitCode = await runPublicHealthCheck(process.env);
}
