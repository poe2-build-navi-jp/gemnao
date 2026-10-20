// Reuse existing checks; record results without claiming these are browser tests.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const out = 'test-results/quality/checks';
mkdirSync(out, { recursive: true });
/** @type {Array<[string, string, string[]]>} */
const checks = [
  [
    'typecheck',
    process.execPath,
    ['node_modules/typescript/bin/tsc', '--noEmit', '--incremental', 'false'],
  ],
  [
    'lint-quality',
    process.execPath,
    [
      'node_modules/oxlint/bin/oxlint',
      'playwright.quality.config.ts',
      'tests/quality',
      'scripts/quality',
      'scripts/check-english-home.mjs',
    ],
  ],
  ['lint-project', process.execPath, ['node_modules/oxlint/bin/oxlint']],
  [
    'local-policy',
    process.execPath,
    ['--test', 'tests/quality/local-policy.test.mjs'],
  ],
  ['contrast-pixels', 'python3', ['tests/quality/contrast-pixels.test.py']],
  ['feedback-stats-synthetic', process.execPath, ['--test', 'tests/feedback-stats-d1/control.test.mjs']],
  ['english-search', process.execPath, ['scripts/check-english-search.mjs']],
  [
    'english-reference-data',
    process.execPath,
    ['scripts/check-english-reference-data.mjs'],
  ],
  ['localized', process.execPath, ['scripts/run-localized-check.mjs']],
  [
    'reading-component-and-storage',
    process.execPath,
    ['scripts/run-reading-experience-check.mjs'],
  ],
];
const results = [];
for (const [name, command, args] of checks) {
  const start = Date.now();
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    timeout: 240000,
    maxBuffer: 16 * 1024 * 1024,
  });
  writeFileSync(
    `${out}/${name}.log`,
    `${result.stdout || ''}${result.stderr || ''}${result.error ? String(result.error) : ''}`,
  );
  const status = result.status === 0 ? 'passed' : 'failed';
  results.push({
    name,
    status,
    exitCode: result.status,
    signal: result.signal,
    durationMs: Date.now() - start,
  });
  console.log(`${status}: ${name}`);
}
writeFileSync(
  `${out}/results.json`,
  JSON.stringify(
    {
      node: process.version,
      kind: 'static/data/component checks — not real-browser verification',
      results,
    },
    null,
    2,
  ),
);
if (results.some((r) => r.status !== 'passed')) process.exitCode = 1;
