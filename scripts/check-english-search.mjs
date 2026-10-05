import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const output=new URL('./.english-search-check.mjs',import.meta.url);
const result=await build({stdin:{contents:`export { LocalizedHome } from './components/localized-home'; export { EnglishHomeSearch } from './components/english-home-search'; export { searchEnglishEntries } from './lib/english-search'; export { hasTranslation } from './lib/localized/index'; export { searchArticles } from './lib/site-search'; export { articleBySlug, articleCategoryLabel } from './lib/game-articles';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'esm',packages:'external',write:false});
try {
 await writeFile(output,result.outputFiles[0].contents);
 const {LocalizedHome,EnglishHomeSearch,searchEnglishEntries,hasTranslation,searchArticles,articleBySlug,articleCategoryLabel}=await import(output.href);
 const find=(node)=>Array.isArray(node)?node.flatMap(find):node?.type===EnglishHomeSearch?[node]:node?.props?find(node.props.children):[];
 const [search]=find(LocalizedHome({locale:'en'}));
 const entries=search.props.entries;
 assert.ok(entries.length>30);
 assert.equal(new Set(entries.map(x=>x.href)).size,entries.length);
 for(const e of entries){assert.ok(e.href.startsWith('/en/'));assert.ok(hasTranslation('en',e.href.slice(3)),e.href);}
 for(const query of ['ST-3100001','st-3100001','ST 3100001','ＡＣＥ　ＣＯＭＢＡＴ 8 ST-3100001']) assert.equal(searchEnglishEntries(entries,query)[0].href,'/en/games/ace-combat-8/error-st-3100001');
 for(const query of ['wilds crash','CYBERPUNK launch','Discord upload']) assert.ok(searchEnglishEntries(entries,query).length,query);
 assert.deepEqual(searchEnglishEntries(entries,'no-such-title-qzx'),[]);
 assert.deepEqual(searchEnglishEntries(entries,'wilds no-such-term'),[]);
 assert.equal(searchEnglishEntries(entries,'   ').length,entries.length);
 assert.deepEqual(searchEnglishEntries(entries,'wilds crash'),searchEnglishEntries(entries,' WILDS   CRASH '));
 assert.equal(find(LocalizedHome({locale:'zh'})).length,0);
 assert.equal(find(LocalizedHome({locale:'es'})).length,0);
 const connection=articleBySlug('ace-combat-8','error-st-3100001');
 assert.equal(articleCategoryLabel(connection),'サーバー・接続');
 assert.ok(searchArticles('ST-3100001')[0].label.includes('サーバー・接続'));
 const dedicated=articleBySlug('palworld','dedicated-server-settings');
 assert.equal(articleCategoryLabel(dedicated),'専用サーバー');
 assert.ok(searchArticles('専用サーバー').some(x=>x.href.endsWith('/dedicated-server-settings')&&x.label.includes('専用サーバー')));
 console.log(`PASS: ${entries.length} real English destinations, title/symptom/multi-term/error-code/case/width normalization, empty/no-hit, unchanged zh/es, connection vs dedicated-server labels`);
}finally{await unlink(output);}
