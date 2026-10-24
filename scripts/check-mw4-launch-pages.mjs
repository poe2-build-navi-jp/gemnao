import assert from 'node:assert/strict';
import {readFile,writeFile,unlink,access} from 'node:fs/promises';
import {build} from 'esbuild';
const output=new URL('./.mw4-launch-data.mjs',import.meta.url);
const bundle=await build({stdin:{contents:"export {mw4LaunchIssues,mw4LaunchIssuesEn} from './lib/mw4-launch-issues';export {gameArticles} from './lib/game-articles';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'esm',packages:'external',write:false});
let data;
try {await writeFile(output,bundle.outputFiles[0].contents);data=await import(output.href);} finally {await unlink(output);}
const {mw4LaunchIssues:ja,mw4LaunchIssuesEn:en,gameArticles}=data;
assert.equal(ja.length,3);assert.equal(en.length,3);
const manifest=JSON.parse(await readFile('dist/editorial-snapshots.json','utf8'));
const sitemap=await readFile('dist/client/sitemap.xml','utf8');
const game='/games/call-of-duty-modern-warfare-4';
const html=async path=>readFile('dist/client'+manifest[path],'utf8');
for(const a of ja){
 const b=en.find(x=>x.slug===a.slug);assert.ok(b);
 assert.equal(gameArticles.filter(x=>x.gameSlug===a.gameSlug && x.slug===a.slug).length,1);
 assert.deepEqual(a.steps.map(x=>x.id),b.steps.map(x=>x.id));
 assert.deepEqual(a.sources.map(x=>x.url),b.sources.map(x=>x.url));
 assert.equal(a.checkedAt,'2026-10-24');assert.equal(b.checkedAt,a.checkedAt);
 assert.ok(!/[ぁ-んァ-ヶ一-龯]/u.test(JSON.stringify(b)));
 for(const prefix of ['', '/en']){
  const path=prefix+game+'/'+a.slug, page=await html(path),head=page.split('</head>')[0];
  assert.ok(head.includes(`rel="canonical" href="https://gemnao.pages.dev${path}"`),path);
  for(const lang of ['ja','en']) assert.ok(head.includes(`hrefLang="${lang}" href="https://gemnao.pages.dev${lang==='en'?'/en':''}${game}/${a.slug}"`));
  for(const lang of ['zh','es'])assert.ok(!head.includes(`hrefLang="${lang}"`),'No invented translation');
  assert.ok(sitemap.includes(`<loc>https://gemnao.pages.dev${path}</loc>`));
  assert.ok(head.includes('property="og:image"'));await access('public/images/og'+path+'.png');
  assert.ok(page.includes('2026-10-24'));assert.ok(page.includes(a.sources[0].url));
  for(const step of a.steps)assert.ok(page.includes(`id="${step.id}"`));
  for(const other of ja.filter(x=>x.slug!==a.slug))assert.ok(page.includes(`href="${prefix+game}/${other.slug}"`));
  assert.ok(page.includes(`href="${prefix+game}/tpm-secure-boot"`));
  assert.ok((await html(prefix+game)).includes(`href="${path}"`),'Hub must link to article');
  assert.ok((await html(prefix+game+'/tpm-secure-boot')).includes(`href="${path}"`),'TPM return link');
 }
}
assert.match(en.find(x=>x.slug==='stats-not-showing').summary,/tracking continues/);
assert.match(en.find(x=>x.slug==='loadout-not-saving').summary,/under investigation/);
assert.match(en.find(x=>x.slug==='xbox-pc-launch-button').summary,/Xbox PC/);
console.log('PASS MW4: six built pages, unique routes, shared STEP/source/date parity, English text, canonical, reciprocal JA/EN hreflang, sitemap, OG files, hub and TPM reciprocal links; no invented ZH/ES routes.');
