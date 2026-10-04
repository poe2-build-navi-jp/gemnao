import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const output = new URL('./.support-empty-states.mjs', import.meta.url);
const bundle = await build({
 stdin: {contents: `export { SupportUpdates } from './components/support-workspace'; export { supportUpdates } from './lib/support-updates'; export { supportCopy } from './lib/support-copy';`, resolveDir: process.cwd(), loader: 'ts'},
 bundle:true, platform:'node', format:'esm', packages:'external', write:false,
 plugins:[{name:'saved-note-fixtures', setup(build) {
  build.onResolve({filter:/use-saved-solutions$/},()=>({path:'fixture',namespace:'test'}));
  build.onLoad({filter:/.*/,namespace:'test'},()=>({contents:'export const useSavedSolutions = () => globalThis.__auditSavedNotes; export const announceMyData = () => {};'}));
 }}],
});
try {
 await writeFile(output,bundle.outputFiles[0].contents);
 const {SupportUpdates,supportUpdates,supportCopy}=await import(output.href);
 const item={id:'test',title:'Test symptom',gameSlug:'elden-ring',articlePath:'/games/elden-ring/not-launching',status:'unresolved'};
 for(const locale of ['ja','en','zh','es']) for(const createHref of ['#issue-notebook','#new-solution']) {
  const t=supportCopy[locale];
  const render=(items,ready=true,error='')=>{
   globalThis.__auditSavedNotes={items,ready,error};
   return renderToStaticMarkup(createElement(SupportUpdates,{locale,createHref}));
  };
  const empty=render([]);
  assert.ok(empty.includes(t.noRecords));
  assert.ok(empty.includes(`href="${createHref}"`));
  assert.ok(!empty.includes(t.emptyUpdates));
  assert.ok(!render([],false).includes(t.noRecords));
  assert.ok(!render([],true,'storage blocked').includes(t.noRecords));
  assert.ok(render([item]).includes(t.emptyUpdates));
  assert.ok(render([{...item,status:'investigating'}]).includes(t.emptyUpdates));
  assert.ok(render([{...item,status:'resolved'}]).includes(t.noUnresolved));
  supportUpdates.push({id:'test-update',gameSlug:'elden-ring',symptomPaths:[item.articlePath],kind:'official',sourceUrl:'https://example.invalid/test-only',verifiedOn:'2020-01-01',publishedAt:'2020-01-01',text:{ja:'テスト用の進展',en:'Test-only update',zh:'测试进展',es:'Novedad de prueba'}});
  const withUpdate=render([item]);
  assert.ok(withUpdate.includes('<article>'));
  assert.ok(withUpdate.includes('example.invalid/test-only'));
  assert.ok(!withUpdate.includes(t.emptyUpdates));
  assert.ok(!withUpdate.includes(t.noRecords));
  assert.ok(!render([{...item,status:'resolved'}]).includes('<article>'));
  supportUpdates.length=0;
 }
 console.log('PASS: four-language no-record/loading/error/investigating/unresolved/resolved/update-present UI branches; synthetic updates exist only in this test bundle');
} finally {await unlink(output);delete globalThis.__auditSavedNotes;}
