import { target, Blocked, pagesProjection, assertBinding } from "./control.mjs";
const requireThat = (value, code) => {
  if (!value) throw new Blocked(code);
};
// No free-form SQL, row payloads, migration or restore action in this mode.
export const diagnosisReadinessQueries = Object.freeze({
  tables:
    "SELECT name FROM sqlite_schema WHERE type='table' AND name COLLATE NOCASE IN ('diagnosis_shared','diagnostic_reports') ORDER BY name",
  diagnosis_shared: "SELECT EXISTS(SELECT 1 FROM diagnosis_shared LIMIT 1) AS has_rows",
  diagnostic_reports: "SELECT EXISTS(SELECT 1 FROM diagnostic_reports LIMIT 1) AS has_rows",
});
export async function collectDiagnosisReadiness(api) {
  let pages;
  let stage = "pagesproject";
  try {
    const project = await api(`/accounts/${target.account}/pages/projects/${target.project}`);
    pages = pagesProjection(project);
    const bindings = (environment) =>
      Object.entries(project?.deployment_configs?.[environment]?.d1_databases || {})
        .map(([binding, value]) => {
          requireThat(
            /^[A-Za-z_][A-Za-z0-9_]{0,127}$/.test(binding) &&
              /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(value?.id || ""),
            "PAGES_BINDING_METADATA_INVALID",
          );
          return { binding, id: value.id };
        })
        .sort((a, b) => a.binding.localeCompare(b.binding));
    pages = {
      ...pages,
      productionBindings: bindings("production"),
      previewBindings: bindings("preview"),
    };
    assertBinding(pages);
    stage = "d1identity";
    const database = await api(`/accounts/${target.account}/d1/database/${target.database}`);
    assertBinding(pages, database);
    stage = "d1schema";
    const query = async (sql) => {
      const result = await api(
        `/accounts/${target.account}/d1/database/${target.database}/query`,
        sql,
      );
      requireThat(
        Array.isArray(result) &&
          result.length === 1 &&
          result[0]?.success === true &&
          result[0]?.meta?.changed_db === false &&
          result[0]?.meta?.rows_written === 0 &&
          Array.isArray(result[0]?.results),
        "DIAGNOSIS_INVENTORY_RESPONSE_NOT_READ_ONLY",
      );
      return result[0].results;
    };
    const names = (await query(diagnosisReadinessQueries.tables)).map((row) => row?.name);
    const tableNames = ["diagnosis_shared", "diagnostic_reports"];
    requireThat(
      names.every((name) => tableNames.includes(name)) && new Set(names).size === names.length,
      "DIAGNOSIS_TABLE_IDENTITY_UNRECOGNIZED",
    );
    const tables = {};
    for (const name of tableNames) {
      const exists = names.includes(name);
      let hasRows = false;
      if (exists) {
        const rows = await query(diagnosisReadinessQueries[name]);
        requireThat(
          rows.length === 1 && [0, 1].includes(rows[0]?.has_rows),
          "DIAGNOSIS_ROW_EXISTENCE_UNVERIFIED",
        );
        hasRows = rows[0].has_rows === 1;
      }
      tables[name] = { exists, hasRows };
    }
    return {
      operation: "diagnosis-readiness",
      target: {
        account: target.account,
        project: target.project,
        database: target.database,
      },
      pages,
      tables,
      legacyRowsPresent: Object.values(tables).some((table) => table.hasRows),
      historicalStorageInventoryComplete: false,
      bindingSwitchAuthorized: false,
      applyAllowed: false,
      databaseWrites: 0,
    };
  } catch (error) {
    if (error instanceof Blocked) {
      error.stage ||= stage;
      error.message = `BLOCKED:${error.code}`;
      // Retain only the approved metadata projection if a later stage fails.
      if (pages)
        error.diagnostic = {
          operation: "diagnosis-readiness",
          pages,
          applyAllowed: false,
        };
    }
    throw error;
  }
}
