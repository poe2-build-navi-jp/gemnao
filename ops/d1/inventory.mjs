import { createHash } from 'node:crypto';

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalize = (sql) => String(sql || '').toLowerCase().replace(/[\s"`[\];]/g, '').replace('ifnotexists', '');
const definitions = {
  solution_method_feedback: 'CREATE TABLE solution_method_feedback(context_slug TEXT NOT NULL,topic TEXT NOT NULL,method_id TEXT NOT NULL,method_label TEXT NOT NULL,response_count INTEGER DEFAULT 0 NOT NULL,updated_at TEXT DEFAULT \'\' NOT NULL,PRIMARY KEY(context_slug,topic,method_id))',
  d1_migrations: 'CREATE TABLE d1_migrations(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT UNIQUE,applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)',
};
const columns = {
  solution_method_feedback: [
    ['context_slug', 'TEXT', 1, null, 1], ['topic', 'TEXT', 1, null, 2],
    ['method_id', 'TEXT', 1, null, 3], ['method_label', 'TEXT', 1, null, 0],
    ['response_count', 'INTEGER', 1, '0', 0], ['updated_at', 'TEXT', 1, "''", 0],
  ],
  d1_migrations: [['id', 'INTEGER', 0, null, 1], ['name', 'TEXT', 0, null, 0], ['applied_at', 'TIMESTAMP', 1, 'CURRENT_TIMESTAMP', 0]],
};
const indexes = {
  solution_method_feedback: { name: 'sqlite_autoindex_solution_method_feedback_1', origin: 'pk', columns: ['context_slug', 'topic', 'method_id'] },
  d1_migrations: { name: 'sqlite_autoindex_d1_migrations_1', origin: 'u', columns: ['name'] },
};
export const inventoryQueries = Object.freeze({
  objects: "SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE tbl_name COLLATE NOCASE IN ('solution_method_feedback','d1_migrations','step_result_receipts') OR name COLLATE NOCASE IN ('step_result_receipts','step_result_receipts_requested_at') ORDER BY type, name",
  methodColumns: 'PRAGMA table_xinfo(solution_method_feedback)',
  registryColumns: 'PRAGMA table_xinfo(d1_migrations)',
  methodForeignKeys: 'PRAGMA foreign_key_list(solution_method_feedback)',
  registryForeignKeys: 'PRAGMA foreign_key_list(d1_migrations)',
  methodIndexes: 'PRAGMA index_list(solution_method_feedback)',
  registryIndexes: 'PRAGMA index_list(d1_migrations)',
  methodIndexColumns: 'PRAGMA index_xinfo(sqlite_autoindex_solution_method_feedback_1)',
  registryIndexColumns: 'PRAGMA index_xinfo(sqlite_autoindex_d1_migrations_1)',
  receiptColumns: 'PRAGMA table_xinfo(step_result_receipts)',
  receiptForeignKeys: 'PRAGMA foreign_key_list(step_result_receipts)',
  receiptIndexes: 'PRAGMA index_list(step_result_receipts)',
  receiptPrimaryIndexColumns: 'PRAGMA index_xinfo(sqlite_autoindex_step_result_receipts_1)',
  receiptTimeIndexColumns: 'PRAGMA index_xinfo(step_result_receipts_requested_at)',
  history: 'SELECT id, name FROM d1_migrations ORDER BY id',
});

// Raw identifiers/DDL/defaults stay in memory. Only fixed labels, checks and
// complete fingerprints leave this projection. This never authorizes writes.
export function forwardInventory(raw) {
  const objects = raw.objects;
  const table = (name, prefix) => {
    const expectedIndex = indexes[name];
    const own = objects.filter((o) => String(o.tbl_name).toLowerCase() === name);
    const definition = own.find((o) => o.type === 'table' && o.name === name);
    const actualColumns = raw[`${prefix}Columns`];
    const actualIndexes = raw[`${prefix}Indexes`];
    const indexColumns = raw[`${prefix}IndexColumns`];
    const keys = indexColumns.filter((c) => c.key === 1);
    const auxiliary = indexColumns.filter((c) => c.key === 0);
    return {
      definitionMatchesKnown: normalize(definition?.sql) === normalize(definitions[name]),
      columnCount: actualColumns.length,
      hiddenColumnCount: actualColumns.filter((c) => c.hidden !== 0).length,
      columnChecks: columns[name].map(([expectedName, expectedType, expectedNotnull, expectedDefault, expectedPk], position) => {
        const c = actualColumns.find((column) => column.name === expectedName);
        return { name: expectedName, present: Boolean(c), positionMatches: c?.cid === position,
          typeMatches: Boolean(c && String(c.type).toUpperCase() === expectedType),
          notNullMatches: c?.notnull === expectedNotnull, defaultMatches: c?.dflt_value === expectedDefault,
          primaryKeyMatches: c?.pk === expectedPk, visible: c?.hidden === 0 };
      }),
      columnsMatchKnown: actualColumns.length === columns[name].length && columns[name].every(([n, type, notnull, defaultValue, pk], i) => {
        const c = actualColumns[i];
        return c?.name === n && c.cid === i && String(c.type).toUpperCase() === type && c.notnull === notnull && c.dflt_value === defaultValue && c.pk === pk && c.hidden === 0;
      }),
      foreignKeyCount: raw[`${prefix}ForeignKeys`].length,
      triggerCount: own.filter((o) => o.type === 'trigger').length,
      unexpectedObjectCount: own.filter((o) => !(o.type === 'table' && o.name === name) && !(o.type === 'index' && o.name === expectedIndex.name && o.sql === null)).length,
      indexesMatchKnown: actualIndexes.length === 1 && actualIndexes[0].name === expectedIndex.name && actualIndexes[0].unique === 1 && actualIndexes[0].origin === expectedIndex.origin && actualIndexes[0].partial === 0,
      indexColumnsMatchKnown: keys.length === expectedIndex.columns.length && keys.every((c, i) => c.name === expectedIndex.columns[i] && c.seqno === i && c.cid === columns[name].findIndex((column) => column[0] === c.name) && c.desc === 0 && c.coll === 'BINARY') && auxiliary.length === 1 && auxiliary[0].cid === -1 && auxiliary[0].name === null && auxiliary[0].desc === 0 && auxiliary[0].coll === 'BINARY',
      structureSHA256: hash({ objects: own, columns: actualColumns, indexes: actualIndexes, indexColumns, foreignKeys: raw[`${prefix}ForeignKeys`] }),
    };
  };
  const tables = { solution_method_feedback: table('solution_method_feedback', 'method'), d1_migrations: table('d1_migrations', 'registry') };
  const namesAvailable = ['step_result_receipts', 'step_result_receipts_requested_at'].every((name) => !objects.some((o) => String(o.name).toLowerCase() === name));
  const records = raw.history || [];
  const validHistory = raw.history !== null && records.every((r) => Number.isSafeInteger(r.id) && r.id > 0 && typeof r.name === 'string') && new Set(records.map((r) => r.id)).size === records.length && new Set(records.map((r) => r.name)).size === records.length;
  const report = {
    version: 1,
    applyAllowed: false,
    tables,
    plannedNamesAvailableAcrossObjectTypes: namesAvailable,
    history: { readable: raw.history !== null, validIdNameShape: validHistory, recordCount: records.length, duplicateNameCount: records.length - new Set(records.map((r) => r.name)).size, idNameSHA256: hash(records.map(({ id, name }) => ({ id, name }))) },
    structuralPreconditionsSatisfied: namesAvailable && validHistory && Object.values(tables).every((t) => t.definitionMatchesKnown && t.columnsMatchKnown && t.foreignKeyCount === 0 && t.triggerCount === 0 && t.unexpectedObjectCount === 0 && t.indexesMatchKnown && t.indexColumnsMatchKnown),
  };
  return { ...report, inventorySHA256: hash(report) };
}
