import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const dir = 'docs/evidence-coverage-2026-10-25';
const prior = JSON.parse(
  readFileSync('docs/evidence-batch2-2026-10-25/coverage.json'),
);
const audits = ['games-a', 'games-b', 'guides-pc', 'discord'].flatMap(
  (name) => JSON.parse(readFileSync(`${dir}/audit-${name}.json`)).articles,
);
const replacements = JSON.parse(readFileSync(`${dir}/replacements.json`));
const pending = prior.articles.filter(
  (a) => a.status === 'pending-individual-audit',
);
assert.equal(audits.length, 181);
assert.equal(new Set(audits.map((a) => a.path)).size, 181);
assert.deepEqual(
  audits.map((a) => a.path).sort((a, b) => a.localeCompare(b)),
  pending.map((a) => a.path).sort((a, b) => a.localeCompare(b)),
);
const normalizePath = (p) => p.replace(/^\/(en|zh|es)(?=\/)/, '');
for (const r of replacements) {
  const source = readFileSync(r.file, 'utf8');
  assert(source.includes(r.new), `Missing correction in ${r.file}: ${r.paths}`);
  assert(
    !source.replaceAll(r.new, '').includes(r.old),
    `Old assertion still present in ${r.file}: ${r.paths}`,
  );
}
const rows = prior.articles.map((previous) => {
  const audit = audits.find((a) => a.path === previous.path);
  if (!audit)
    return {
      path: previous.path,
      category: previous.family,
      disposition: 'inherited-scoped-record',
      basis: 'PR145/146の個別説明を継承。今回の181件に含めない。',
      languages: previous.languages,
    };
  const fixes = replacements.filter((r) =>
    r.paths.some((p) => normalizePath(p) === previous.path),
  );
  assert(
    ['existing-sufficient', 'needs-specific-edit', 'blocked-evidence'].includes(
      audit.classification,
    ),
    previous.path,
  );
  if (audit.classification === 'needs-specific-edit')
    assert(fixes.length, `Unresolved required edit: ${previous.path}`);
  return {
    path: previous.path,
    category: previous.family,
    languages: previous.languages,
    disposition: fixes.length ? 'changed' : audit.classification,
    reason: audit.reason,
    assessment: audit,
    corrections: fixes.map(({ file, reason, paths }) => ({
      file,
      reason,
      paths,
    })),
    sharedDisplay:
      previous.family === 'pc'
        ? '既存の公式情報確認日・対象表示を維持'
        : '資料の確認記録という日付見出しへ限定。日付値は変更しない',
    verificationBoundary:
      '読者向けの根拠・手順・対象・結果の区別を既存公開記録で監査。外部全仕様の再調査や実機試験の合格ではない。',
  };
});
const summary = Object.fromEntries(
  [
    'changed',
    'existing-sufficient',
    'blocked-evidence',
    'inherited-scoped-record',
  ].map((k) => [k, rows.filter((r) => r.disposition === k).length]),
);
assert.equal(
  Object.values(summary).reduce((a, b) => a + b, 0),
  191,
);
writeFileSync(
  `${dir}/coverage.json`,
  JSON.stringify(
    {
      base: 'ce784c0eaa4dc191fec3acf75d3a3821bd4a7dc9',
      scope:
        '先行10件を継承、残181件を内容と共通テンプレートに照らして監査。無内容な一律ブロック追加なし。',
      summary,
      pending: 0,
      articles: rows,
    },
    null,
    2,
  ) + '\n',
);
writeFileSync(
  `${dir}/coverage.tsv`,
  'path\tcategory\tdisposition\treason\n' +
    rows
      .map((r) =>
        [
          r.path,
          r.category,
          r.disposition,
          (r.reason || r.basis).replaceAll('\t', ' ').replaceAll('\n', ' '),
        ].join('\t'),
      )
      .join('\n') +
    '\n',
);
console.log(JSON.stringify({ total: 191, audited: 181, summary, pending: 0 }));
