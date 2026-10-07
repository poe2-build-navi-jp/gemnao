// Concrete GitHub Artifact v4 claim integration. The official client is injected;
// this module does not load an SDK, read runtime tokens, or upload on import.
import { mkdtemp, writeFile, readFile, readdir, lstat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { canonical, PLAN_HASH } from './adapter.mjs';

export const ARTIFACT_CLIENT_PIN = Object.freeze({
  name: '@actions/artifact', version: '2.3.2',
  integrity: 'sha512-uX2Mr5KEPcwnzqa0Og9wOTEKIae6C/yx9P/m8bIglzCS5nZDkcQC/zRWjjoEsyVecL6oQpBx5BuqQj/yuVm0gw==',
  upstream: 'https://github.com/actions/upload-artifact/tree/v4.6.2',
});
function need(value) { if (!value) throw new Error('BLOCKED:ARTIFACT_CLAIM'); }
export function artifactClaimName(runId) {
  need(Number.isSafeInteger(runId) && runId > 0);
  return `gemnao-preview-data-claim-${runId}-${PLAN_HASH}`;
}
export function createArtifactClaims({ client, clientVersion, runId }) {
  // Future reviewed loader must verify installed package integrity/locked deps;
  // clientVersion alone is not supply-chain proof or authorization.
  need(clientVersion === ARTIFACT_CLIENT_PIN.version && typeof client?.uploadArtifact === 'function'
    && typeof client.getArtifact === 'function' && typeof client.downloadArtifact === 'function');
  const name = artifactClaimName(runId);
  let attempted = false;
  const receipts = new Map();
  return Object.freeze({
    async createExclusive(requestedName, payload) {
      need(!attempted); attempted = true;
      need(requestedName === name && payload.runId === runId && payload.planHash === PLAN_HASH);
      const text = canonical({ name, payload }); need(Buffer.byteLength(text) <= 4096);
      const dir = await mkdtemp(join(tmpdir(), 'gemnao-claim-upload-'));
      try {
        const file = join(dir, 'claim.json'); await writeFile(file, text, { flag: 'wx', mode: 0o600 });
        // uploadArtifact v4 creates a new immutable name; there is no overwrite
        // option in the client API. NEVER call deleteArtifact or adopt getArtifact
        // on conflict. This call occurs in EACH provision process, not a reused step.
        const result = await client.uploadArtifact(name, [file], dir, { retentionDays: 1, compressionLevel: 0 });
        need(Number.isSafeInteger(result?.id) && result.id > 0 && /^[a-f0-9]{64}$/.test(result.digest ?? '')
          && Number.isSafeInteger(result.size) && result.size > 0 && result.size <= 8192);
        receipts.set(String(result.id), { digest: result.digest, text });
        return { id: String(result.id) };
      } catch { throw new Error('BLOCKED:ARTIFACT_CREATE_UNCERTAIN_OR_CONFLICT'); }
      finally { await rm(dir, { recursive: true, force: true }); }
    },
    async read(id) {
      const receipt = receipts.get(id); need(receipt);
      const dir = await mkdtemp(join(tmpdir(), 'gemnao-claim-readback-'));
      try {
        // Default client scope is this run only. No findBy/token/other-run lookup.
        const { artifact } = await client.getArtifact(name);
        need(artifact?.id === Number(id) && artifact.name === name && artifact.size <= 8192);
        const result = await client.downloadArtifact(Number(id), { path: dir, expectedHash: `sha256:${receipt.digest}` });
        need(result?.digestMismatch === false && resolve(result.downloadPath) === resolve(dir));
        const entries = await readdir(dir); need(entries.length === 1 && entries[0] === 'claim.json');
        const path = join(dir, 'claim.json'); const stat = await lstat(path);
        need(stat.isFile() && !stat.isSymbolicLink() && stat.size <= 4096);
        const text = await readFile(path, 'utf8'); need(text === receipt.text);
        return JSON.parse(text);
      } catch { throw new Error('BLOCKED:ARTIFACT_READBACK_UNCERTAIN'); }
      finally { await rm(dir, { recursive: true, force: true }); }
    },
  });
}
