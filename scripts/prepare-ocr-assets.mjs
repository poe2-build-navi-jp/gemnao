import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { mkdir, copyFile, readdir, writeFile, stat } from 'node:fs/promises';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
const tess = dirname(require.resolve('tesseract.js/package.json'));
const tessRequire = createRequire(join(tess, 'package.json'));
const core = dirname(tessRequire.resolve('tesseract.js-core/package.json'));
const target = 'public/ocr/v7';
await mkdir(target, { recursive: true });
await copyFile(join(tess, 'dist/worker.min.js'), `${target}/worker.min.js`);
await copyFile(join(tess, 'LICENSE.md'), `${target}/TESSERACT-LICENSE`);
await copyFile(join(core, 'LICENSE'), `${target}/CORE-LICENSE`);
for (const file of await readdir(core)) {
  if (/\.wasm(?:\.js)?$/.test(file)) await copyFile(join(core, file), join(target, file));
}
for (const lang of ['eng', 'jpn', 'chi_sim', 'spa']) {
  const source = dirname(require.resolve(`@tesseract.js-data/${lang}/package.json`));
  await copyFile(join(source, `4.0.0_best_int/${lang}.traineddata.gz`), `${target}/${lang}.traineddata.gz`);
}
await build({ entryPoints: ['ocr/runner.ts'], outfile: `${target}/runner.js`, bundle: true, platform: 'browser', minify: true });
await writeFile(`${target}/runner.html`, '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Local OCR worker</title></head><body><script src="/ocr/v7/runner.js"></script></body></html>');
for (const file of await readdir(target)) {
  if ((await stat(join(target, file))).size > 25 * 1024 * 1024) throw new Error(`Pages asset too large: ${file}`);
}
console.log('Same-origin OCR assets prepared from locked npm packages.');
