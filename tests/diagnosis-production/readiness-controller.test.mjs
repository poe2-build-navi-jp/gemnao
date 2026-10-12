import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { TARGET, sha256 } from "../../ops/feedback-preview/controller.mjs";
import {
  createDiagnosisReadinessAdapter,
  createPreparedAdapter,
  validateRecord,
} from "../../ops/feedback-preview/adapter.mjs";
import {
  runGate,
  runProtected,
  credentialTransport,
  SETUP,
} from "../../ops/feedback-preview/live.mjs";
import { createDiagnostics } from "../../ops/feedback-preview/diagnostics.mjs";
import { target } from "../../ops/d1/control.mjs";
import { diagnosisReadinessQueries as queries } from "../../ops/d1/diagnosis-readiness.mjs";
import {
  READINESS_OPERATION as operation,
  READINESS_MODE as mode,
  READINESS_PLAN_HASH as planHash,
  READINESS_PAGES_PATH as pagesPath,
  READINESS_DATABASE_PATH as databasePath,
  readinessTransport,
} from "../../ops/diagnosis-production/readiness-profile.mjs";
import { fixtureRecord, mock, workflow } from "../feedback-preview/fixtures.mjs";
const root = "https://api.cloudflare.com/client/v4";
const marker = "SYNTHETIC_PRIVATE_VALUE";
function setup(mutate = () => {}, failedRequest = 0) {
  const r = { ...fixtureRecord(), ref: SETUP.ref, reviewers: [325773421] };
  const network = mock(r, (call, value) => {
    if (call.path.endsWith(`/environments/${SETUP.environment}`)) {
      value.id = SETUP.environmentId;
      value.protection_rules[0].reviewers[0].reviewer = {
        id: r.reviewers[0],
        login: SETUP.reviewerLogin,
      };
    }
    if (call.path.endsWith("/approvals")) {
      value[0].environments[0].id = SETUP.environmentId;
      value[0].user.id = r.reviewers[0];
    }
    mutate(call, value);
  });
  const calls = [];
  let cfCount = 0;
  const transport = async (url, options) => {
    calls.push({ url, options });
    if (!url.startsWith(root)) return network.transport(url, options);
    const path = url.slice(root.length);
    cfCount++;
    let result;
    if (path === pagesPath && options.method === "GET")
      result = {
        name: target.project,
        production_branch: target.branch,
        source: { config: { owner: "poe2-build-navi-jp", repo_name: "gemnao" } },
        deployment_configs: {
          production: {
            d1_databases: { DB: { id: target.database } },
            env_vars: { PRIVATE: { value: marker } },
          },
          preview: { d1_databases: {} },
        },
        canonical_deployment: {
          id: "deployment-fixture",
          environment: "production",
          latest_stage: { status: "success" },
          deployment_trigger: { metadata: { branch: target.branch, commit_hash: "a".repeat(40) } },
        },
      };
    else if (path === databasePath && options.method === "GET")
      result = { uuid: target.database, name: target.databaseName };
    else {
      assert.equal(path, `${databasePath}/query`);
      assert.equal(options.method, "POST");
      const { sql } = JSON.parse(options.body);
      assert.ok(Object.values(queries).includes(sql));
      result = [
        {
          success: true,
          meta: { rows_written: 0, changed_db: false },
          results:
            sql === queries.tables
              ? [{ name: "diagnosis_shared" }, { name: "diagnostic_reports" }]
              : [{ has_rows: 0 }],
        },
      ];
    }
    const value = { success: true, errors: [], result };
    mutate({ path, method: options.method }, value);
    const response = new Response(JSON.stringify(value), {
      status: cfCount === failedRequest ? 403 : 200,
      headers: { "content-type": "application/json" },
    });
    Object.defineProperty(response, "url", { value: url });
    return response;
  };
  const env = (job = "provision") => ({
    GITHUB_ACTIONS: "true",
    GITHUB_REPOSITORY: TARGET.repository,
    GITHUB_EVENT_NAME: "workflow_dispatch",
    GITHUB_REF: SETUP.ref,
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_RUN_ID: String(r.runId),
    GITHUB_SHA: r.commit,
    GITHUB_WORKFLOW_SHA: r.commit,
    GITHUB_WORKFLOW_REF: `${TARGET.repository}/.github/workflows/${workflow}@${SETUP.ref}`,
    RUNNER_ENVIRONMENT: "github-hosted",
    GITHUB_JOB: job,
    PREVIEW_PROTECTED_ENVIRONMENT: SETUP.environment,
    PREVIEW_OPERATION: operation,
    PREVIEW_OUTSIDE_RECORD_PRESENT: "false",
    PREVIEW_OUTSIDE_DIGEST_PRESENT: "false",
  });
  return {
    r,
    calls,
    transport,
    env,
    context: {
      repository: TARGET.repository,
      ref: r.ref,
      commit: r.commit,
      runId: r.runId,
      reviewerId: r.reviewers[0],
    },
  };
}

test("existing gate + actual owner approval permit only five fixed read calls, with no SDK or old record", async () => {
  const f = setup(),
    env = f.env();
  for (const name of ["PREVIEW_APPROVAL_RECORD", "PREVIEW_APPROVAL_SHA256"])
    Object.defineProperty(env, name, { get: () => assert.fail("old record must not be read") });
  const gate = await runGate({
    env: f.env("gate"),
    checkoutSha: f.r.commit,
    transport: f.transport,
  });
  assert.equal(gate.planHash, planHash);
  assert.ok(f.calls.every((c) => !c.url.startsWith(root)));
  const result = await runProtected({
    env,
    checkoutSha: f.r.commit,
    transport: f.transport,
    loadClient: () => assert.fail("no artifact SDK"),
  });
  assert.equal(result.mode, mode);
  assert.equal(result.readOnly, true);
  assert.equal(result.intakeEnabled, false);
  assert.equal(result.bindingSwitchAuthorized, false);
  assert.equal(result.databaseWrites, 0);
  assert.equal(JSON.stringify(result).includes(marker), false);
  const reads = f.calls.filter((c) => c.url.startsWith(root));
  assert.deepEqual(
    reads.map((c) => c.options.method),
    ["GET", "GET", "POST", "POST", "POST"],
  );
  assert.equal(reads[0].url, root + pagesPath);
});

test("owner, exact run/head, branch and Environment checks still precede every Cloudflare call", async () => {
  for (const mutate of [
    (c, v) => {
      if (c.path.endsWith("/approvals")) v.splice(0);
    },
    (c, v) => {
      if (c.path.endsWith("/approvals")) v[0].user.id = 123;
    },
    (c, v) => {
      if (c.path.endsWith("/approvals")) v[0].state = "rejected";
    },
    (c, v) => {
      if (c.path.endsWith("/approvals")) v[0].environments[0].id = 123;
    },
    (c, v) => {
      if (c.path.includes("/git/ref/")) v.object.sha = "b".repeat(40);
    },
    (c, v) => {
      if (c.path.endsWith("/actions/runs/12345")) v.run_attempt = 2;
    },
    (c, v) => {
      if (c.path.endsWith(`/environments/${SETUP.environment}`)) v.can_admins_bypass = true;
    },
    (c, v) => {
      if (c.path.endsWith(`/environments/${SETUP.environment}`)) v.id = 123;
    },
    (c, v) => {
      if (c.path.endsWith("/deployment-branch-policies")) v.branch_policies[0].name = "*";
    },
  ]) {
    const f = setup(mutate);
    await assert.rejects(
      runProtected({ env: f.env(), checkoutSha: f.r.commit, transport: f.transport }),
      /BLOCKED/,
    );
    assert.ok(f.calls.every((c) => !c.url.startsWith(root)));
  }
});

for (let failureAt = 1; failureAt <= 5; failureAt++)
  test(`HTTP 403 at request ${failureAt} identifies endpoint and never retries`, async () => {
    const f = setup(() => {}, failureAt),
      events = [],
      diagnostic = createDiagnostics((e) => events.push(e));
    await assert.rejects(
      runProtected({
        env: f.env(),
        checkoutSha: f.r.commit,
        transport: diagnostic.transport(f.transport),
        onStage: diagnostic.stage,
        onEnvelope: diagnostic.envelope,
      }),
      (error) => {
        const report = diagnostic.failure(error);
        assert.equal(
          report.stage,
          ["pagesproject", "d1identity", "d1schema", "d1schema", "d1schema"][failureAt - 1],
        );
        assert.equal(report.request.status, 403);
        assert.equal(
          report.request.endpoint,
          ["pages-project", "d1-metadata", "d1-query", "d1-query", "d1-query"][failureAt - 1],
        );
        assert.equal(JSON.stringify(report).includes(marker), false);
        return true;
      },
    );
    assert.equal(f.calls.filter((c) => c.url.startsWith(root)).length, failureAt);
  });

test("both transport boundaries reject mutations, other targets, arbitrary SQL, parameters and repeated queries", async () => {
  let count = 0;
  const inner = () => {
    count++;
    return {};
  };
  const transport = readinessTransport(inner);
  const credential = credentialTransport({
    operation,
    githubToken: () => assert.fail(),
    cloudflareToken: () => "SYNTHETIC",
    fetchImpl: inner,
  });
  const url = root + databasePath + "/query";
  const bad = [
    [url, { method: "POST", body: JSON.stringify({ sql: "DELETE FROM diagnosis_shared" }) }],
    [url, { method: "POST", body: JSON.stringify({ sql: queries.tables, params: [] }) }],
    [url, { method: "DELETE" }],
    [root + pagesPath, { method: "PUT", body: "{}" }],
    [root + `/accounts/${TARGET.accountId}`, { method: "GET" }],
    [url + "?extra=1", { method: "POST", body: JSON.stringify({ sql: queries.tables }) }],
    [
      url.replace(target.database, "72c728f5-1656-4e26-bc11-7c508ae155c3"),
      { method: "POST", body: JSON.stringify({ sql: queries.tables }) },
    ],
  ];
  for (const [u, options] of bad) {
    assert.throws(() => transport(u, options), /TRANSPORT_SCOPE/);
    await assert.rejects(credential(u, options), /TRANSPORT_SCOPE|TRANSPORT_METHOD/);
  }
  assert.equal(count, 0);
  transport(url, { method: "POST", body: JSON.stringify({ sql: queries.tables }) });
  assert.throws(
    () => transport(url, { method: "POST", body: JSON.stringify({ sql: queries.tables }) }),
    /REQUEST_BOUND/,
  );
  assert.equal(count, 1);
});

test("readiness capability has no mutation method and cannot be reused or authorize writes", async () => {
  const f = setup();
  const adapter = await createDiagnosisReadinessAdapter({
    transport: f.transport,
    context: f.context,
  });
  assert.deepEqual(Object.keys(adapter), ["readiness"]);
  await adapter.readiness();
  const count = f.calls.length;
  await assert.rejects(adapter.readiness(), /ATTEMPT_ALREADY_STARTED/);
  assert.equal(f.calls.length, count);
  await assert.rejects(createPreparedAdapter({ operation }), /HEALTH_MODE/);
  const bytes = JSON.stringify(f.context);
  assert.throws(() => validateRecord(bytes, sha256(bytes), Date.now(), operation), /HEALTH_MODE/);
  for (const writeOperation of [
    "preview",
    "production-databases",
    "production-cleanup",
    "production-health-publish",
  ]) {
    const e = f.env();
    e.PREVIEW_OPERATION = writeOperation;
    await assert.rejects(
      runProtected({ env: e, checkoutSha: f.r.commit, transport: f.transport }),
      /ENVIRONMENT_RECORD_MISSING_OR_MISMATCHED/,
    );
  }
  assert.equal(f.calls.length, count);
});

test("registered workflow keeps exact existing branch/Environment, excludes record secrets and installs nothing for readiness", async () => {
  const file = await readFile(".github/workflows/feedback-preview-control.yml", "utf8");
  assert.match(file, /- diagnosis-readiness/);
  assert.match(file, /github.ref == 'refs\/heads\/prepare\/feedback-preview-controller-20261007'/);
  assert.match(file, /PREVIEW_PROTECTED_ENVIRONMENT: gemnao-preview-data/);
  assert.equal(
    (
      file.match(
        /inputs.operation != 'diagnosis-readiness' && secrets.GEMNAO_PREVIEW_APPROVAL_/g,
      ) ?? []
    ).length,
    2,
  );
  assert.equal((file.match(/if: inputs.operation != 'diagnosis-readiness'/g) ?? []).length, 2);
});
