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
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    console.log(
      'COMMUNITY_REPORTS_HEALTH ' +
        JSON.stringify(await publicHealthCheck(process.env)),
    );
  } catch {
    console.error('PUBLIC_HEALTH_CHECK_FAILED');
    process.exitCode = 1;
  }
}
