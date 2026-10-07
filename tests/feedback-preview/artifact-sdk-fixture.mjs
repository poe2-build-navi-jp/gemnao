// Offline contract test: run the pinned SDK's real ZIP/upload/get/download logic.
// Only backend I/O is replaced. No credential or runtime token is required.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { loadPinnedArtifactClient } from '../../ops/feedback-preview/live.mjs';
import { createArtifactClaims, artifactClaimName } from '../../ops/feedback-preview/artifact-claim.mjs';
import { canonical, PLAN_HASH } from '../../ops/feedback-preview/adapter.mjs';
import { sha256 } from '../../ops/feedback-preview/controller.mjs';

const require = createRequire(new URL('../../ops/feedback-preview/runtime/package.json', import.meta.url));
const client = await loadPinnedArtifactClient();
const backend = require('@actions/artifact/lib/internal/shared/artifact-twirp-client.js');
const util = require('@actions/artifact/lib/internal/shared/util.js');
const blob = require('@actions/artifact/lib/internal/upload/blob-upload.js');
const http = require('@actions/http-client');
const core = require('@actions/core');
const changes = [];
function replace(object, key, value) { changes.push(() => { object[key] = value.old; }); value.old = object[key]; object[key] = value; }
const dir = await mkdtemp(join(tmpdir(), 'gemnao-sdk-fixture-'));
let row; let archive; let creates = 0;
try {
  replace(globalThis, 'fetch', () => assert.fail('network forbidden'));
  for (const name of ['node:http', 'node:https']) replace(require(name), 'request', () => assert.fail('network forbidden'));
  replace(util, 'getBackendIdsFromToken', () => ({ workflowRunBackendId: 'fixture-run', workflowJobRunBackendId: 'fixture-job' }));
  for (const name of ['info', 'debug', 'warning']) replace(core, name, () => {});
  replace(backend, 'internalArtifactTwirpClient', () => ({
    async CreateArtifact(request) {
      creates++;
      if (row) throw new Error('synthetic duplicate artifact name');
      assert.equal(request.version, 4);
      row = { name: request.name, databaseId: '777', workflowRunBackendId: 'fixture-run', workflowJobRunBackendId: 'fixture-job' };
      return { ok: true, signedUploadUrl: 'https://fixture.invalid/upload' };
    },
    async FinalizeArtifact(request) {
      assert.equal(request.name, row.name); assert.equal(request.hash.value, `sha256:${sha256(archive)}`);
      row.size = request.size; row.digest = request.hash;
      return { ok: true, artifactId: '777' };
    },
    async ListArtifacts(request) {
      assert.equal(request.workflowRunBackendId, 'fixture-run');
      assert.equal(request.workflowJobRunBackendId, 'fixture-job');
      if (request.nameFilter) assert.equal(request.nameFilter.value, row.name);
      if (request.idFilter) assert.equal(request.idFilter.value, row.databaseId);
      return { artifacts: [row] };
    },
    async GetSignedArtifactURL(request) { assert.equal(request.name, row.name); return { signedUrl: 'https://fixture.invalid/archive' }; },
  }));
  replace(blob, 'uploadZipToBlobStorage', async (url, stream) => {
    assert.equal(url, 'https://fixture.invalid/upload');
    const chunks = []; for await (const chunk of stream) chunks.push(chunk);
    archive = Buffer.concat(chunks);
    return { uploadSize: archive.length, sha256Hash: sha256(archive) };
  });
  replace(http.HttpClient.prototype, 'get', async url => {
    assert.equal(url, 'https://fixture.invalid/archive');
    const message = Readable.from([archive]); message.statusCode = 200; return { message };
  });

  if (process.argv[2]) {
    // The incident archive stays outside the repository and is never printed.
    archive = await readFile(process.argv[2]);
    assert.equal(sha256(archive), '5d612ac292b3eeb702b2afb032d7c34c49c248a2b8ff1b3f860fce07c86d2c56');
    row = { databaseId: '777', name: artifactClaimName(37636762355), size: String(archive.length),
      workflowRunBackendId: 'fixture-run', workflowJobRunBackendId: 'fixture-job', digest: { value: `sha256:${sha256(archive)}` } };
    const bare = await client.downloadArtifact(777, { path: join(dir, 'bare'), expectedHash: sha256(archive) });
    assert.equal(bare.digestMismatch, true);
    const matched = await client.downloadArtifact(777, { path: join(dir, 'matched'), expectedHash: `sha256:${sha256(archive)}` });
    assert.equal(matched.digestMismatch, false);
    assert.deepEqual(await readdir(matched.downloadPath), ['claim.json']);
    const text = await readFile(join(matched.downloadPath, 'claim.json'), 'utf8');
    const claim = JSON.parse(text); assert.equal(text, canonical(claim));
    const replayClient = {
      async uploadArtifact(name, files) {
        assert.equal(name, row.name); assert.equal(await readFile(files[0], 'utf8'), text);
        return { id: 777, size: archive.length, digest: sha256(archive) };
      },
      getArtifact: client.getArtifact.bind(client), downloadArtifact: client.downloadArtifact.bind(client),
    };
    const claims = createArtifactClaims({ client: replayClient, clientVersion: '2.3.2', runId: claim.payload.runId });
    const receipt = await claims.createExclusive(claim.name, claim.payload);
    assert.deepEqual(await claims.read(receipt.id), claim);
    console.log('Actual archive: bare hash mismatches; prefixed hash and exact claim readback pass. No network calls.');
  } else {
    const payload = { runId: 12345, repository: 'poe2-build-navi-jp/gemnao', planHash: PLAN_HASH,
      recordHash: 'a'.repeat(64), nonce: 'synthetic-test-nonce' };
    const name = artifactClaimName(payload.runId);
    const claims = createArtifactClaims({ client, clientVersion: '2.3.2', runId: payload.runId });
    const receipt = await claims.createExclusive(name, payload);
    assert.equal(receipt.id, '777'); assert.equal(creates, 1);
    const bare = await client.downloadArtifact(777, { path: join(dir, 'bare'), expectedHash: sha256(archive) });
    assert.equal(bare.digestMismatch, true);
    const mismatch = await client.downloadArtifact(777, { path: join(dir, 'wrong'), expectedHash: `sha256:${'0'.repeat(64)}` });
    assert.equal(mismatch.digestMismatch, true);
    assert.deepEqual(await claims.read(receipt.id), { name, payload });
    const second = createArtifactClaims({ client, clientVersion: '2.3.2', runId: payload.runId });
    await assert.rejects(second.createExclusive(name, payload), /ARTIFACT_CREATE_UNCERTAIN_OR_CONFLICT/);
    assert.equal(creates, 2);
    console.log('Pinned SDK upload/get/download, digest format, exact readback and duplicate denial pass. No network calls.');
  }
} finally {
  for (const restore of changes.reverse()) restore();
  await rm(dir, { recursive: true, force: true });
}
