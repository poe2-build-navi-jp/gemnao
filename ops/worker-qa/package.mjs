// Credential-free build packaging only; no upload or Cloudflare call.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {join,dirname,resolve} from 'node:path';
import {sha256} from '../feedback-preview/controller.mjs';
import {validatePins,deploymentConfig,verifyArtifact,need} from './deploy.mjs';
const pins = validatePins(JSON.parse(await readFile(new URL('pins.json',import.meta.url),'utf8')));
const app = resolve('application'), stage = resolve('qa-artifact');
const manifestBytes = await readFile(join(app,'dist/worker-preview/asset-manifest.json'));
const manifest = JSON.parse(manifestBytes);
const config = JSON.stringify(deploymentConfig(JSON.parse(await readFile(join(app,'wrangler.worker-preview.json'),'utf8')),pins.origin),null,2)+'\n';
await writeFile(join(app,'wrangler.qa-deploy.json'),config,{flag:'wx'});
const hashes = {
  manifestSha256:sha256(manifestBytes),
  bundleSha256:sha256(await readFile(join(app,'.wrangler/worker-preview-dry-run/worker-preview.js'))),
  deploymentConfigSha256:sha256(config),
};
await verifyArtifact({...pins,...hashes},app);
const paths = [...manifest.inputs.map(x=>x.path),...manifest.assets.map(x=>'dist/worker-preview/assets/'+x.path),
  'dist/worker-preview/assets/.assetsignore','dist/worker-preview/asset-manifest.json',
  '.wrangler/worker-preview-dry-run/worker-preview.js','wrangler.qa-deploy.json'];
need(new Set(paths).size === paths.length,'DUPLICATE_ARTIFACT_PATH');
await mkdir(stage);
let total=0;
for(const path of paths) { const bytes = await readFile(join(app,path)); total+=bytes.length;
  need(total <= 80*1024*1024,'BUILD_ARTIFACT_SIZE'); await mkdir(dirname(join(stage,path)),{recursive:true}); await copyFile(join(app,path),join(stage,path)); }
console.log(JSON.stringify({artifact:hashes,sourceCommit:pins.sourceCommit,sourceTree:pins.sourceTree,files:paths.length,bytes:total,intakeEnabled:false}));
