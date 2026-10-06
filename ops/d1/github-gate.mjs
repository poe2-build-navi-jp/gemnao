import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { target, Blocked, assertContext } from './control.mjs';
const check = (value, code) => {
  if (!value) throw new Blocked(code);
};
export function validateEnvironment(environment, policies) {
  check(environment.name === target.environment, 'ENVIRONMENT_MISSING');
  check(
    environment.protection_rules?.some(
      (rule) =>
        rule.type === 'required_reviewers' && rule.reviewers?.length > 0,
    ),
    'ENVIRONMENT_REVIEWER_REQUIRED',
  );
  check(
    environment.deployment_branch_policy?.custom_branch_policies === true &&
      environment.deployment_branch_policy?.protected_branches === false,
    'ENVIRONMENT_BRANCH_POLICY_REQUIRED',
  );
  check(
    policies.total_count === 1 &&
      policies.branch_policies?.length === 1 &&
      policies.branch_policies[0].name === target.branch &&
      policies.branch_policies[0].type === 'branch',
    'ENVIRONMENT_MUST_ALLOW_ONLY_PRODUCTION_BRANCH',
  );
}
export async function gate(env, fetcher = fetch) {
  assertContext(env, env.D1_OPERATION);
  const read = async (suffix) => {
    let response;
    try {
      response = await fetcher(
        `https://api.github.com/repos/${target.repository}/environments/${target.environment}${suffix}`,
        {
          headers: {
            Authorization: `Bearer ${env.GH_TOKEN || ''}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
          redirect: 'error',
          signal: AbortSignal.timeout(30000),
        },
      );
    } catch {
      throw new Blocked('ENVIRONMENT_LOOKUP_FAILED');
    }
    check(
      response.ok,
      response.status === 404
        ? 'ENVIRONMENT_MISSING_SETUP_REQUIRED'
        : `ENVIRONMENT_HTTP_${response.status}`,
    );
    try {
      return await response.json();
    } catch {
      throw new Blocked('ENVIRONMENT_RESPONSE_INVALID');
    }
  };
  validateEnvironment(
    await read(''),
    await read('/deployment-branch-policies?per_page=100'),
  );
  return target.environment;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const environment = await gate(process.env);
    if (process.env.GITHUB_OUTPUT)
      await appendFile(
        process.env.GITHUB_OUTPUT,
        `environment=${environment}\n`,
      );
    console.log(
      'Existing reviewer-protected production Environment verified. No Cloudflare request made.',
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        status: 'blocked',
        code:
          error instanceof Blocked ? error.code : 'ENVIRONMENT_LOOKUP_FAILED',
      }),
    );
    process.exitCode = 1;
  }
}
