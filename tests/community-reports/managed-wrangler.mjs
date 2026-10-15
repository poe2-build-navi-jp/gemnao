// Exercise the pinned real Wrangler uploader against a loopback-only fake API.
// Synthetic credentials and resources only; never authenticates to Cloudflare.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import {
  persistedConfig,
  configProjection,
} from '../../ops/community-reports/managed-config.mjs';
import { TARGET, FLAGS } from '../../ops/community-reports/closed-setup.mjs';
const baseline = JSON.parse(
  execFileSync('git', ['show', TARGET.base + ':wrangler.json'], {
    encoding: 'utf8',
  }),
);
const record = {
  version: 1,
  accountId: TARGET.account,
  databaseName: TARGET.database,
  databaseId: '11111111-1111-4111-8111-111111111111',
  guardName: TARGET.guard,
  guardNamespaceId: 'f'.repeat(32),
  cleanupName: TARGET.cleanup,
  provisionedSourceSha: 'a'.repeat(40),
  provisionedRunId: '123',
  recovery: {
    deploymentId: '22222222-2222-4222-8222-222222222222',
    sourceSha: 'b'.repeat(40),
    productionConfigSha256: 'c'.repeat(64),
  },
};
const desired = persistedConfig(baseline, record, TARGET, FLAGS);
const deploymentId = '33333333-3333-4333-8333-333333333333';
const basePath =
  '/client/v4/accounts/' + TARGET.account + '/pages/projects/gemnao';
const { vars, ...projection } = configProjection(baseline);
const project = {
  name: TARGET.pages,
  production_branch: TARGET.branch,
  deployment_configs: {
    production: {
      ...projection,
      wrangler_config_hash: 'synthetic-existing-managed',
      env_vars: {
        ...Object.fromEntries(
          Object.entries(vars).map(([name, value]) => [
            name,
            { type: 'plain_text', value },
          ]),
        ),
        EXISTING_SECRET: {
          type: 'secret_text',
          value: 'SYNTHETIC_SECRET_NOT_IN_UPLOAD',
        },
      },
    },
    preview: {},
  },
};
const envelope = (result) => ({
  success: true,
  errors: [],
  messages: [],
  result,
});
const requests = [],
  uploads = [];
let handlerError = null;
const server = createServer(async (req, res) => {
  try {
    const parts = [];
    for await (const part of req) parts.push(part);
    const bytes = Buffer.concat(parts),
      path = req.url.split('?')[0];
    requests.push({ method: req.method, path });
    const reply = (result) => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(envelope(result)));
    };
    if (req.method === 'GET' && path === basePath) return reply(project);
    if (path === basePath + '/upload-token')
      return reply({
        jwt:
          'e30.' +
          Buffer.from(
            JSON.stringify({
              exp: Math.floor(Date.now() / 1000) + 3600,
              max_file_count_allowed: 20000,
            }),
          ).toString('base64url') +
          '.synthetic',
      });
    if (path === '/client/v4/pages/assets/check-missing') return reply([]);
    if (path === '/client/v4/pages/assets/upsert-hashes') return reply(null);
    if (req.method === 'POST' && path === basePath + '/deployments') {
      const form = await new Request('http://local.test', {
        method: 'POST',
        body: bytes,
        headers: { 'content-type': req.headers['content-type'] },
      }).formData();
      const bundle = Buffer.from(
        await form.get('_worker.bundle').arrayBuffer(),
      );
      const boundary = bundle
        .subarray(0, bundle.indexOf('\r\n'))
        .toString()
        .slice(2);
      const nested = await new Response(bundle, {
        headers: {
          'content-type': 'multipart/form-data; boundary=' + boundary,
        },
      }).formData();
      const metadata = nested.get('metadata');
      const upload = {
        branch: form.get('branch'),
        metadata: JSON.parse(
          typeof metadata === 'string' ? metadata : await metadata.text(),
        ),
        configHash: form.get('wrangler_config_hash'),
        output: form.get('pages_build_output_dir'),
        secretValuePresent: bytes.includes(
          Buffer.from('SYNTHETIC_SECRET_NOT_IN_UPLOAD'),
        ),
      };
      uploads.push(upload);
      return reply({ id: deploymentId, url: 'https://synthetic.invalid' });
    }
    if (
      req.method === 'GET' &&
      path === basePath + '/deployments/' + deploymentId
    )
      return reply({
        id: deploymentId,
        latest_stage: { name: 'deploy', status: 'success' },
        aliases: [],
      });
    res.statusCode = 400;
    reply(null);
  } catch (error) {
    handlerError = error;
    res.statusCode = 500;
    res.end('{}');
  }
});
const directory = await mkdtemp(join(tmpdir(), 'managed-wrangler-'));
try {
  await mkdir(join(directory, 'dist/client'), { recursive: true });
  await writeFile(
    join(directory, 'dist/client/index.html'),
    '<!doctype html><title>Synthetic</title>',
  );
  await writeFile(
    join(directory, 'dist/client/_worker.js'),
    "export default {fetch(){return new Response('synthetic')}};",
  );
  const configuration = JSON.stringify(desired, null, 2) + '\n';
  await writeFile(join(directory, 'wrangler.json'), configuration);
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  assert.equal(typeof address, 'object');
  const api = 'http://127.0.0.1:' + address.port + '/client/v4';
  try {
    for (const branch of [TARGET.branch, TARGET.branch, 'synthetic-preview'])
      await promisify(execFile)(
        process.execPath,
        [
          resolve('node_modules/wrangler/bin/wrangler.js'),
          'pages',
          'deploy',
          'dist/client',
          '--project-name',
          TARGET.pages,
          '--branch',
          branch,
          '--commit-hash',
          'a'.repeat(40),
          '--commit-message',
          'Synthetic local only',
          '--commit-dirty=true',
        ],
        {
          cwd: directory,
          timeout: 30000,
          maxBuffer: 1000000,
          env: {
            ...process.env,
            CLOUDFLARE_API_BASE_URL: api,
            CLOUDFLARE_ACCOUNT_ID: TARGET.account,
            CLOUDFLARE_API_TOKEN: 's'.repeat(30),
            WRANGLER_SEND_METRICS: 'false',
            XDG_CONFIG_HOME: join(directory, 'xdg'),
            WRANGLER_LOG_PATH: join(directory, 'wrangler.log'),
            CI: 'true',
          },
        },
      );
  } catch {
    throw Error(
      'Loopback Wrangler failed; observed paths: ' + JSON.stringify(requests),
    );
  }
  assert.equal(handlerError, null);
  assert.equal(uploads.length, 3);
  const upload = uploads[0];
  assert.deepEqual(uploads[1].metadata.bindings, upload.metadata.bindings);
  assert.ok(
    !uploads[2].metadata.bindings.some((binding) =>
      binding.name.startsWith('REPORTS_'),
    ),
  );
  assert.ok(uploads.every((item) => !item.secretValuePresent));
  assert.equal(
    upload.configHash,
    createHash('sha256').update(configuration).digest('hex'),
  );
  assert.equal(upload.output, 'dist/client');
  assert.equal(upload.secretValuePresent, false);
  const bindings = upload.metadata.bindings;
  assert.ok(Array.isArray(bindings));
  for (const db of desired.d1_databases)
    assert.ok(
      bindings.some(
        (binding) =>
          binding.type === 'd1' &&
          binding.name === db.binding &&
          binding.id === db.database_id,
      ),
    );
  assert.ok(
    bindings.some(
      (binding) =>
        binding.type === 'service' &&
        binding.name === 'REPORTS_GUARD' &&
        binding.service === TARGET.guard &&
        binding.entrypoint === 'ReportsGuardService',
    ),
  );
  assert.ok(
    FLAGS.every((flag) =>
      bindings.some(
        (binding) =>
          binding.name === flag &&
          binding.type === 'plain_text' &&
          binding.text === 'false',
      ),
    ),
  );
  assert.ok(!requests.some((request) => request.method === 'PATCH'));
  console.log(
    JSON.stringify({
      realWranglerVersion: '4.92.0',
      api: 'loopback synthetic only',
      configurationHashVerified: true,
      outputDirectoryPreserved: true,
      existingAndNewBindingsInUpload: true,
      normalRedeployRetainsBindings: true,
      previewDoesNotInheritReportBindings: true,
      allReportFlagsOff: true,
      secretValuesUploaded: false,
      projectPatchRequests: 0,
      requests: requests.length,
    }),
  );
} finally {
  await new Promise((done) => server.close(done));
  await rm(directory, { recursive: true, force: true });
}
