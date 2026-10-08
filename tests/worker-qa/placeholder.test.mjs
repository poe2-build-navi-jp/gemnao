import test from 'node:test';
// Node tracks top-level tests; explicitly discard registration promises without changing scheduling.
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,unlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {restoreBuildPlaceholder} from '../../ops/worker-qa/restore-placeholder.mjs';
async function fixture(content='') {
  const root=await mkdtemp(join(tmpdir(),'qa-placeholder-test-'));
  const git=args=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git(['init']);await mkdir(join(root,'dist/client'),{recursive:true});
  await writeFile(join(root,'dist/client/.gitkeep'),content);await writeFile(join(root,'source.txt'),'original');
  git(['add','.']);git(['-c','user.name=Synthetic Test','-c','user.email=synthetic@example.invalid','commit','-m','Synthetic fixture']);
  return {root,git};
}
void test('restores only known tracked empty placeholder after build deletion',async()=>{
  const {root,git}=await fixture();try {
    await unlink(join(root,'dist/client/.gitkeep'));assert.match(git(['diff','--name-status','HEAD']),/^D\s+dist\/client\/\.gitkeep$/);
    await restoreBuildPlaceholder(root);assert.equal(git(['diff','--name-only','HEAD']),'');
    await writeFile(join(root,'source.txt'),'unreviewed change');await unlink(join(root,'dist/client/.gitkeep'));
    await restoreBuildPlaceholder(root);assert.equal(git(['diff','--name-only','HEAD']),'source.txt');
    assert.equal(await readFile(join(root,'source.txt'),'utf8'),'unreviewed change');
  } finally {await rm(root,{recursive:true,force:true});}
});
void test('nonempty tracked placeholder is not silently restored',async()=>{
  const {root}=await fixture('not the reviewed blob');try {
    await unlink(join(root,'dist/client/.gitkeep'));await assert.rejects(restoreBuildPlaceholder(root),/PLACEHOLDER_IDENTITY/);
  } finally {await rm(root,{recursive:true,force:true});}
});
