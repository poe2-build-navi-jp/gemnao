// Build removes tracked dist/client/.gitkeep. Restore ONLY that reviewed empty
// placeholder; all other tracked source changes must still fail verification.
import {execFileSync} from 'node:child_process';
import {lstat,mkdir,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {need} from './deploy.mjs';
export async function restoreBuildPlaceholder(app) {
  const target='dist/client/.gitkeep';
  const git=args=>execFileSync('git',['-C',app,...args],{encoding:'utf8'}).trim();
  need(git(['ls-tree','HEAD','--',target]) === `100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391\t${target}`,'PLACEHOLDER_IDENTITY');
  await mkdir(join(app,'dist/client'),{recursive:true});
  const stat=await lstat(join(app,target)).catch(error=>{if(error.code!=='ENOENT')throw error;return null;});
  need(stat === null || stat.isFile() && !stat.isSymbolicLink(),'PLACEHOLDER_TYPE');
  await writeFile(join(app,target),'');
}
if(process.argv[1] === fileURLToPath(import.meta.url)) {
  need(process.argv.length === 3,'PLACEHOLDER_INVOCATION');
  await restoreBuildPlaceholder(resolve(process.argv[2]));
}
