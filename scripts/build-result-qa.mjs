import {build} from 'esbuild';
import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const root=process.cwd();
const dest=root+'/dist/client/images/_qa/result-collection';await mkdir(dest,{recursive:true});
const bundle=await build({entryPoints:['scripts/result-qa-entry.tsx'],absWorkingDir:root,bundle:true,write:false,format:'esm',platform:'browser',jsx:'automatic',minify:true,metafile:true,define:{'process.env.NODE_ENV':'"production"','process.env':'{"NODE_ENV":"production"}'},nodePaths:[root+'/node_modules']});
await writeFile(dest+'/fixture.js',bundle.outputFiles[0].contents);
for(const [from,to]of[['index.html','index.html'],['frame.html','frame.html'],['shell.js','shell.js']])await copyFile(root+'/public/images/_qa/result-collection/'+from,dest+'/'+to);
const cssFiles=(await readdir(root+'/dist/client/_next/static/css')).filter(x=>x.endsWith('.css'));if(cssFiles.length!==1)throw Error('Expected one current CSS asset');await copyFile(root+'/dist/client/_next/static/css/'+cssFiles[0],dest+'/feature.css');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputs={};for(const input of Object.keys(bundle.metafile.inputs)){if(input.includes('node_modules')||input.startsWith('../')||input.startsWith('<'))continue;inputs[input]=hash(await readFile(resolve(root,input)));}
await writeFile(dest+'/source-manifest.json',JSON.stringify({purpose:'Preview-only mock UI QA; never merge this directory into production',builtAt:new Date().toISOString(),sourceCommit:'41af84afff1219810f9c0a81e58a0075d1eb5be9',deploymentCommit:process.env.CF_PAGES_COMMIT_SHA||'local-fixture-build',cssSourceSHA256:hash(await readFile(root+'/app/globals.css')),compiledCSSSHA256:hash(await readFile(dest+'/feature.css')),fixtureBundleSHA256:hash(bundle.outputFiles[0].contents),sourceSHA256:inputs},null,2));
console.log(JSON.stringify({files:await readdir(dest),bundleBytes:bundle.outputFiles[0].contents.length,sourceFiles:Object.keys(inputs).length,css:cssFiles[0]}));
