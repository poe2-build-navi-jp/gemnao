import { createHash } from 'node:crypto';
import { forwardInventory } from './inventory.mjs';

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
// Compare only the exact known generated DDL, ignoring formatting outside
// quoted text. Quoted identifiers and CHECK literals remain byte-for-byte.
const normalize = (sql) => {
  const source = String(sql || '');
  const tokens = source.match(/'(?:''|[^'])*'|"(?:""|[^"])*"|`(?:``|[^`])*`|\[(?:\]\]|[^\]])*\]|[^'"`[]+/g) || [];
  if (tokens.join('') !== source) return 'invalid-sql-quotes';
  return tokens.map((token) => /^['"`[]/.test(token) ? token : token.replace(/\s/g, '')).join('').replace(/;$/, '');
};
const migration = '0004_step_result_reports.sql';
const prior = ['0000_chemical_baron_zemo.sql', '0001_illegal_wrecking_crew.sql', '0002_lying_sheva_callister.sql'];
const methodDefinition = "CREATE TABLE `solution_method_feedback` (\n\t`context_slug` text NOT NULL,\n\t`topic` text NOT NULL,\n\t`method_id` text NOT NULL,\n\t`method_label` text NOT NULL,\n\t`response_count` integer DEFAULT 0 NOT NULL,\n\t`updated_at` text DEFAULT '' NOT NULL,\n\tPRIMARY KEY(`context_slug`, `topic`, `method_id`)\n)";
const receiptDefinition = "CREATE TABLE `step_result_receipts` (\n\t`request_id` text PRIMARY KEY NOT NULL,\n\t`requested_at` text NOT NULL,\n\t`context_slug` text NOT NULL,\n\t`topic` text NOT NULL,\n\t`method_id` text NOT NULL,\n\t`outcome` text NOT NULL,\n\t`report_struggling` integer NOT NULL,\n\tCONSTRAINT \"step_result_receipts_outcome\" CHECK(\"step_result_receipts\".\"outcome\" IN ('resolved', 'not-resolved')),\n\tCONSTRAINT \"step_result_receipts_struggling\" CHECK(\"step_result_receipts\".\"report_struggling\" IN (0, 1))\n);";

// Reviewed read-only run 37528819087, owner approved 2026-10-06.
// This identifies an opaque existing history, NOT proof that 0003 ran.
export const reviewedBaseline = Object.freeze({
  id: 'gemnao-forward-0004-2026-10-06',
  inventorySHA256: '27ea5650b5ed59ff06919292253055aa7d9e7c2b89cfd11c57a74eb3b1373fb4',
  historySHA256: 'ff5e912fa06733d24dee9c388cfec686c213acd9ac42fb056c4d9f5542cb543b',
  methodSHA256: 'a229a66760735c5ed44d12e3ef52cc58c0df005a8dc1b504f098827af951cc8d',
  registrySHA256: 'c215e8feb15e2da80c971f4d49d9fb760583cf40116021e70bdd1ee42418a0b9',
  unknownNameSHA256: '23a63166f5bd80d14ac1ba279619505500a95a6f0323cc056cd7678974cbf111',
});

function receiptMatches(raw) {
  const own = raw.objects.filter((o) => String(o.tbl_name).toLowerCase() === 'step_result_receipts');
  const table = own.find((o) => o.type === 'table' && o.name === 'step_result_receipts');
  const index = own.find((o) => o.type === 'index' && o.name === 'step_result_receipts_requested_at');
  const names = ['request_id', 'requested_at', 'context_slug', 'topic', 'method_id', 'outcome', 'report_struggling'];
  const keysMatch = (rows, name, cid) => rows.length === 2 && rows[0].seqno === 0 && rows[0].cid === cid && rows[0].name === name && rows[0].key === 1 && rows[0].desc === 0 && rows[0].coll === 'BINARY' && rows[1].seqno === 1 && rows[1].cid === -1 && rows[1].name === null && rows[1].key === 0 && rows[1].desc === 0 && rows[1].coll === 'BINARY';
  return normalize(table?.sql) === normalize(receiptDefinition) &&
    normalize(index?.sql) === normalize('CREATE INDEX `step_result_receipts_requested_at` ON `step_result_receipts` (`requested_at`)') &&
    own.length === 3 && own.some((o) => o.name === 'sqlite_autoindex_step_result_receipts_1' && o.type === 'index' && o.sql === null) &&
    raw.receiptColumns.length === 7 && names.every((name, i) => {
      const c = raw.receiptColumns[i];
      return c.name === name && c.cid === i && String(c.type).toUpperCase() === (i === 6 ? 'INTEGER' : 'TEXT') && c.notnull === 1 && c.dflt_value === null && c.pk === (i === 0 ? 1 : 0) && c.hidden === 0;
    }) && raw.receiptForeignKeys.length === 0 && raw.receiptIndexes.length === 2 &&
    raw.receiptIndexes.some((i) => i.name === 'sqlite_autoindex_step_result_receipts_1' && i.unique === 1 && i.origin === 'pk' && i.partial === 0) &&
    raw.receiptIndexes.some((i) => i.name === 'step_result_receipts_requested_at' && i.unique === 0 && i.origin === 'c' && i.partial === 0) &&
    keysMatch(raw.receiptPrimaryIndexColumns, 'request_id', 0) && keysMatch(raw.receiptTimeIndexColumns, 'requested_at', 1);
}

// The injectable pin is for isolated fixtures only. The controller calls the
// one-argument wrapper below; neither dispatch nor environment can select pins.
export function assessForwardBaseline(raw, pin) {
  if (!raw?.history) return null;
  const added = raw.history.filter((r) => r.name === migration);
  const old = raw.history.filter((r) => r.name !== migration);
  if (hash(old.map(({ id, name }) => ({ id, name }))) !== pin.historySHA256) return null;
  const blocked = { state: 'blocked', code: 'REVIEWED_FORWARD_BASELINE_MISMATCH' };
  const unknown = old.filter((r) => !prior.includes(r.name));
  if (old.length !== 4 || unknown.length !== 1 || hash(unknown[0].name) !== pin.unknownNameSHA256 || !prior.every((name) => old.filter((r) => r.name === name).length === 1)) return blocked;
  const inventory = forwardInventory(raw);
  const method = raw.objects.find((o) => o.type === 'table' && o.name === 'solution_method_feedback');
  if (added.length === 0) {
    if (normalize(method?.sql) !== normalize(methodDefinition) || !inventory.structuralPreconditionsSatisfied || inventory.inventorySHA256 !== pin.inventorySHA256 || inventory.tables.solution_method_feedback.structureSHA256 !== pin.methodSHA256 || inventory.tables.d1_migrations.structureSHA256 !== pin.registrySHA256) return blocked;
    return { state: 'ready_for_0004', baseline: pin.id, inventory };
  }
  if (added.length !== 1 || raw.history.length !== 5 || !Number.isSafeInteger(added[0].id) || added[0].id <= Math.max(...old.map((r) => r.id)) || inventory.tables.d1_migrations.structureSHA256 !== pin.registrySHA256 || !receiptMatches(raw)) return blocked;
  const expectedPost = normalize(methodDefinition.replace('PRIMARY KEY(', '`not_resolved_count` integer DEFAULT 0 NOT NULL, PRIMARY KEY('));
  const addedColumn = raw.methodColumns[6];
  if (normalize(method?.sql) !== expectedPost || raw.methodColumns.length !== 7 || addedColumn.name !== 'not_resolved_count' || addedColumn.cid !== 6 || String(addedColumn.type).toUpperCase() !== 'INTEGER' || addedColumn.notnull !== 1 || addedColumn.dflt_value !== '0' || addedColumn.pk !== 0 || addedColumn.hidden !== 0) return blocked;
  // Prove the remaining columns/keys/FKs/triggers still match the old known
  // structure. Substitute only after independently validating the exact new DDL.
  const projected = { ...raw, history: old, methodColumns: raw.methodColumns.slice(0, 6), objects: raw.objects.filter((o) => String(o.tbl_name).toLowerCase() !== 'step_result_receipts').map((o) => o === method ? { ...o, sql: methodDefinition } : o) };
  if (!forwardInventory(projected).structuralPreconditionsSatisfied) return blocked;
  return { state: 'already_applied', baseline: pin.id, inventory, oldHistorySHA256: pin.historySHA256, receiptStructureSHA256: hash({ columns: raw.receiptColumns, indexes: raw.receiptIndexes, primary: raw.receiptPrimaryIndexColumns, time: raw.receiptTimeIndexColumns, foreignKeys: raw.receiptForeignKeys, objects: raw.objects.filter((o) => String(o.tbl_name).toLowerCase() === 'step_result_receipts') }) };
}

export function reviewedForwardState(raw) {
  return assessForwardBaseline(raw, reviewedBaseline);
}
