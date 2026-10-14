import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TARGET } from '../../ops/production-resource-inventory/control.mjs';
import { LOG_URL, projectLogs, readDeploymentLog } from '../../ops/production-resource-inventory/pages-deployment-log.mjs';
const env = {
  GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: TARGET.repository,
  GITHUB_REF: `refs/heads/${TARGET.branch}`, GITHUB_EVENT_NAME: 'workflow_dispatch',
  GITHUB_WORKFLOW: TARGET.workflow, GITHUB_RUN_ATTEMPT: '1', GITHUB_RUN_ID: '12345', GITHUB_SHA: 'a'.repeat(40),
  INVENTORY_PROTECTED_ENVIRONMENT: TARGET.environment, GH_TOKEN: 'synthetic_github', CLOUDFLARE_API_TOKEN: 'synthetic_cloudflare',
};
const rows = { total: 4, includes_container_logs: true, data: [
  { line: 'Cloning repository', ts: '2026-10-12T13:00:00Z' },
  { line: 'Error: cannot resolve package vinext synthetic_cloudflare', ts: '2026-10-12T13:00:00Z' },
  { line: 'Error: TOKEN=PRIVATE', ts: '2026-10-12T13:00:00Z' },
  { line: 'Failed: API_KEY=PRIVATE', ts: '2026-10-12T13:00:00Z' },
] };
await test('projects only bounded error lines and removes credentials', () => {
  const report = projectLogs(rows, [env.CLOUDFLARE_API_TOKEN]);
  assert.equal(report.errors.length,1); assert.equal(report.omittedSensitive,2);
  assert.match(report.errors[0].line,/cannot resolve package vinext/);
  assert.doesNotMatch(JSON.stringify(report),/PRIVATE|synthetic_cloudflare|Cloning/);
  assert.equal(report.rawLogsStored,false);
});
await test('protected first run performs exactly one fixed Cloudflare GET with no redirects', async () => {
  const calls=[];
  const fetcher=async(url,options)=>{
    assert.equal(options.method,'GET');assert.equal(options.redirect,'error');calls.push(url);
    if(url.includes('/deployment-branch-policies'))return Response.json({total_count:1,branch_policies:[{name:TARGET.branch,type:'branch'}]});
    if(url.startsWith('https://api.github.com/'))return Response.json({name:TARGET.environment,protection_rules:[{type:'required_reviewers',reviewers:[{id:1}]}],deployment_branch_policy:{custom_branch_policies:true,protected_branches:false}});
    assert.equal(url,LOG_URL); return Response.json({success:true,errors:[],result:rows});
  };
  assert.equal((await readDeploymentLog(env,fetcher)).readOnly,true);
  assert.deepEqual(calls.filter(url=>url.startsWith('https://api.cloudflare.com/')),[LOG_URL]);
});
await test('reruns and unprotected execution stop before Cloudflare access', async () => {
  for(const change of [{GITHUB_RUN_ATTEMPT:'2'},{INVENTORY_PROTECTED_ENVIRONMENT:'wrong'},{GITHUB_REF:'refs/heads/other'}])
    await assert.rejects(readDeploymentLog({...env,...change},()=>{throw Error('must not call');}));
});
