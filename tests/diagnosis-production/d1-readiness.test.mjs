import test from "node:test";
import assert from "node:assert/strict";
import { target, Blocked, cloudflareClient } from "../../ops/d1/control.mjs";
import {
  collectDiagnosisReadiness,
  diagnosisReadinessQueries,
} from "../../ops/d1/diagnosis-readiness.mjs";

const prefix = `/accounts/${target.account}`;
const pagesPath = `${prefix}/pages/projects/${target.project}`;
const databasePath = `${prefix}/d1/database/${target.database}`;
const secretMarker = "PRIVATE_TEST_PAYLOAD_MUST_NOT_APPEAR";
function project() {
  return {
    name: target.project,
    production_branch: target.branch,
    source: { config: { owner: "poe2-build-navi-jp", repo_name: "gemnao" } },
    deployment_configs: {
      production: {
        d1_databases: { DB: { id: target.database } },
        env_vars: { PRIVATE: { value: secretMarker } },
      },
      preview: { d1_databases: {} },
    },
    canonical_deployment: {
      id: "deployment-fixture",
      environment: "production",
      latest_stage: { status: "success" },
      deployment_trigger: {
        metadata: { branch: target.branch, commit_hash: "a".repeat(40) },
      },
    },
  };
}
const queryResult = (results) => [
  { success: true, meta: { changed_db: false, rows_written: 0 }, results },
];
function fixture({ rows = {}, failureAt, alterProject, alterResult } = {}) {
  const calls = [];
  const api = async (path, sql) => {
    calls.push({ path, sql });
    if (calls.length === failureAt) throw new Blocked("CLOUDFLARE_HTTP_403");
    if (path === pagesPath && sql === undefined) {
      const value = project();
      alterProject?.(value);
      return value;
    }
    if (path === databasePath && sql === undefined)
      return { uuid: target.database, name: target.databaseName };
    assert.equal(path, `${databasePath}/query`);
    let result;
    if (sql === diagnosisReadinessQueries.tables)
      result = queryResult(Object.keys(rows).map((name) => ({ name })));
    else {
      const table = Object.keys(rows).find((name) => diagnosisReadinessQueries[name] === sql);
      assert.ok(table, "Only an existing approved table gets a fixed EXISTS query");
      result = queryResult([{ has_rows: rows[table], payload: secretMarker }]);
    }
    alterResult?.(result, sql);
    return result;
  };
  return { api, calls };
}

test("absent tables: direct Pages/identity/schema only; no permission to switch or write", async () => {
  const { api, calls } = fixture();
  const result = await collectDiagnosisReadiness(api);
  assert.deepEqual(calls, [
    { path: pagesPath, sql: undefined },
    { path: databasePath, sql: undefined },
    { path: `${databasePath}/query`, sql: diagnosisReadinessQueries.tables },
  ]);
  assert.deepEqual(result.tables, {
    diagnosis_shared: { exists: false, hasRows: false },
    diagnostic_reports: { exists: false, hasRows: false },
  });
  assert.equal(result.applyAllowed, false);
  assert.equal(result.bindingSwitchAuthorized, false);
  assert.equal(result.historicalStorageInventoryComplete, false);
  assert.equal(result.databaseWrites, 0);
  assert.equal(JSON.stringify(result).includes(secretMarker), false);
});

for (const hasRows of [0, 1])
  test(`existing tables: project boolean row presence ${hasRows} only`, async () => {
    const { api, calls } = fixture({
      rows: { diagnosis_shared: hasRows, diagnostic_reports: 0 },
    });
    const result = await collectDiagnosisReadiness(api);
    assert.equal(calls.length, 5);
    assert.equal(result.legacyRowsPresent, hasRows === 1);
    assert.equal(result.tables.diagnosis_shared.exists, true);
    assert.equal(JSON.stringify(result).includes(secretMarker), false);
  });

for (let failureAt = 1; failureAt <= 5; failureAt++)
  test(`403 at request ${failureAt}: report stage and stop without retry`, async () => {
    const { api, calls } = fixture({
      rows: { diagnosis_shared: 0, diagnostic_reports: 0 },
      failureAt,
    });
    await assert.rejects(collectDiagnosisReadiness(api), (error) => {
      assert.equal(error.code, "CLOUDFLARE_HTTP_403");
      assert.equal(
        error.stage,
        ["pagesproject", "d1identity", "d1schema", "d1schema", "d1schema"][failureAt - 1],
      );
      assert.equal(JSON.stringify(error.diagnostic ?? {}).includes(secretMarker), false);
      return true;
    });
    assert.equal(calls.length, failureAt);
  });

test("unverified/mismatched Pages binding stops before any D1 request", async () => {
  const { api, calls } = fixture({
    alterProject: (value) => {
      value.deployment_configs.production.d1_databases.DB.id =
        "72c728f5-1656-4e26-bc11-7c508ae155c3";
    },
  });
  await assert.rejects(collectDiagnosisReadiness(api), {
    code: "CURRENT_PRODUCTION_BINDING_MISMATCH",
    stage: "pagesproject",
  });
  assert.equal(calls.length, 1);
});

for (const meta of [
  {},
  { changed_db: true, rows_written: 0 },
  { changed_db: false, rows_written: 1 },
])
  test(`require explicit read-only D1 metadata ${JSON.stringify(meta)}`, async () => {
    const { api, calls } = fixture({
      alterResult: (result) => {
        result[0].meta = meta;
      },
    });
    await assert.rejects(collectDiagnosisReadiness(api), {
      code: "DIAGNOSIS_INVENTORY_RESPONSE_NOT_READ_ONLY",
      stage: "d1schema",
    });
    assert.equal(calls.length, 3);
  });

test("unexpected table identity or invalid EXISTS result never proves absence", async () => {
  for (const options of [{ rows: { DIAGNOSIS_SHARED: 0 } }, { rows: { diagnosis_shared: null } }]) {
    const { api } = fixture(options);
    await assert.rejects(
      collectDiagnosisReadiness(api),
      (error) => error instanceof Blocked && error.stage === "d1schema",
    );
  }
});

test("HTTP transport makes fixed GET and SELECT POST calls, never an account GET", async () => {
  const { api: source, calls } = fixture({ rows: { diagnosis_shared: 0 } });
  const client = cloudflareClient("local-fixture-not-a-real-credential", async (url, options) => {
    const path = url.replace("https://api.cloudflare.com/client/v4", "");
    const sql = options.body ? JSON.parse(options.body).sql : undefined;
    assert.equal(options.method, sql ? "POST" : "GET");
    if (sql) assert.ok(Object.values(diagnosisReadinessQueries).includes(sql));
    assert.equal(options.redirect, "error");
    return {
      ok: true,
      json: async () => ({ success: true, result: await source(path, sql) }),
    };
  });
  await collectDiagnosisReadiness(client);
  assert.equal(calls.length, 4);
});
