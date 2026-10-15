// Non-secret, persisted resource identity and Wrangler source-of-truth checks.
import { createHash } from 'node:crypto';
export class ManagedConfigFailure extends Error {}
const requireValue = (ok, code) => {
  if (!ok) throw new ManagedConfigFailure(code);
};
export const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, canonical(value[key])]),
        )
      : value;
export const normalized = (value) => JSON.stringify(canonical(value));
const hash = (value) =>
  createHash('sha256').update(normalized(value)).digest('hex');
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export function productionAnchor(project, deployment) {
  const id = project.canonical_deployment?.id;
  requireValue(
    UUID.test(id || '') &&
      deployment?.id === id &&
      deployment.environment === 'production' &&
      deployment.latest_stage?.name === 'deploy' &&
      deployment.latest_stage.status === 'success' &&
      /^[a-f0-9]{40}$/.test(
        deployment.deployment_trigger?.metadata?.commit_hash || '',
      ),
    'VERIFIED_PRODUCTION_ROLLBACK_ANCHOR_REQUIRED',
  );
  return {
    deploymentId: id,
    sourceSha: deployment.deployment_trigger.metadata.commit_hash,
  };
}
export function validateRecord(record, target) {
  const fields = [
    'version',
    'accountId',
    'databaseName',
    'databaseId',
    'guardName',
    'guardNamespaceId',
    'cleanupName',
    'provisionedSourceSha',
    'provisionedRunId',
    'recovery',
  ];
  requireValue(
    record &&
      normalized(Object.keys(record).sort()) === normalized(fields.sort()) &&
      record.version === 1 &&
      record.accountId === target.account &&
      record.databaseName === target.database &&
      UUID.test(record.databaseId || '') &&
      record.guardName === target.guard &&
      record.cleanupName === target.cleanup &&
      /^[a-f0-9]{32}$/.test(record.guardNamespaceId || '') &&
      /^[a-f0-9]{40}$/.test(record.provisionedSourceSha || '') &&
      /^[1-9][0-9]*$/.test(record.provisionedRunId || '') &&
      normalized(Object.keys(record.recovery || {}).sort()) ===
        normalized(['deploymentId', 'productionConfigSha256', 'sourceSha']) &&
      UUID.test(record.recovery.deploymentId || '') &&
      /^[a-f0-9]{40}$/.test(record.recovery.sourceSha || '') &&
      /^[a-f0-9]{64}$/.test(record.recovery.productionConfigSha256 || ''),
    'PERSISTED_RESOURCE_RECORD_INVALID',
  );
  return record;
}
export function persistedConfig(baseline, record, target, flags) {
  validateRecord(record, target);
  requireValue(
    !baseline.d1_databases.some(
      (db) =>
        db.database_id === record.databaseId || db.binding === 'REPORTS_DB',
    ) &&
      !(baseline.services || []).some(
        (service) => service.binding === 'REPORTS_GUARD',
      ),
    'DEDICATED_BINDING_COLLISION',
  );
  const config = structuredClone(baseline);
  config.d1_databases.push({
    binding: 'REPORTS_DB',
    database_name: target.database,
    database_id: record.databaseId,
  });
  config.services = [
    ...(baseline.services || []),
    {
      binding: 'REPORTS_GUARD',
      service: target.guard,
      environment: 'production',
      entrypoint: 'ReportsGuardService',
    },
  ];
  config.vars = {
    ...baseline.vars,
    ...Object.fromEntries(flags.map((flag) => [flag, 'false'])),
  };
  return config;
}
const map = (array, name, convert) =>
  Object.fromEntries((array || []).map((item) => [item[name], convert(item)]));
export function configProjection(config) {
  return {
    compatibility_date: config.compatibility_date,
    compatibility_flags: config.compatibility_flags || [],
    placement: config.placement || { mode: 'off' },
    limits: config.limits || {},
    d1_databases: map(config.d1_databases, 'binding', (db) => ({
      id: db.database_id,
    })),
    services: map(config.services, 'binding', (service) => ({
      service: service.service,
      environment: service.environment || 'production',
      ...(service.entrypoint ? { entrypoint: service.entrypoint } : {}),
    })),
    kv_namespaces: map(config.kv_namespaces, 'binding', (binding) => ({
      namespace_id: binding.id,
    })),
    r2_buckets: map(config.r2_buckets, 'binding', (binding) => ({
      name: binding.bucket_name,
    })),
    durable_object_namespaces: map(
      config.durable_objects?.bindings,
      'name',
      (binding) => ({
        class_name: binding.class_name,
        service: binding.script_name,
        environment: binding.environment || 'production',
      }),
    ),
    queue_producers: map(config.queues?.producers, 'binding', (binding) => ({
      name: binding.queue,
    })),
    vars: config.vars || {},
  };
}
export function projectProjection(production) {
  return {
    compatibility_date: production.compatibility_date,
    compatibility_flags: production.compatibility_flags || [],
    placement: production.placement || { mode: 'off' },
    limits: production.limits || {},
    d1_databases: production.d1_databases || {},
    services: Object.fromEntries(
      Object.entries(production.services || {}).map(([name, service]) => [
        name,
        {
          service: service.service,
          environment: service.environment || 'production',
          ...(service.entrypoint ? { entrypoint: service.entrypoint } : {}),
        },
      ]),
    ),
    kv_namespaces: production.kv_namespaces || {},
    r2_buckets: production.r2_buckets || {},
    durable_object_namespaces: production.durable_object_namespaces || {},
    queue_producers: production.queue_producers || {},
    vars: Object.fromEntries(
      Object.entries(production.env_vars || {})
        .filter(([, value]) => value?.type === 'plain_text')
        .map(([name, value]) => [name, value.value]),
    ),
  };
}
export function managedBaseline(project, config) {
  const production = project.deployment_configs?.production;
  requireValue(
    production &&
      typeof production.wrangler_config_hash === 'string' &&
      production.wrangler_config_hash.length > 0,
    'EXISTING_WRANGLER_MANAGEMENT_REQUIRED',
  );
  requireValue(
    normalized(projectProjection(production)) ===
      normalized(configProjection(config)),
    'EXISTING_WRANGLER_CONFIG_NOT_ALIGNED',
  );
  // Unknown non-empty binding kinds must be represented explicitly before deploy.
  for (const key of [
    'ai_bindings',
    'analytics_engine_datasets',
    'hyperdrive_bindings',
    'mtls_certificates',
    'vectorize_bindings',
    'browsers',
    'images',
    'workflows',
    'send_email',
  ])
    requireValue(
      !production[key] || Object.keys(production[key]).length === 0,
      'UNREPRESENTED_BINDING_KIND',
    );
  return {
    productionConfigSha256: hash(projectProjection(production)),
    secretNames: Object.entries(production.env_vars || {})
      .filter(([, value]) => value?.type === 'secret_text')
      .map(([name]) => name)
      .sort(),
  };
}
export function verifyManagedDeployment(before, after, desired, target) {
  requireValue(
    after.name === target.pages && after.production_branch === target.branch,
    'PAGES_IDENTITY_MISMATCH',
  );
  const snapshot = managedBaseline(after, desired),
    oldProduction = before.deployment_configs.production;
  const priorSecrets = Object.entries(oldProduction.env_vars || {})
    .filter(([, value]) => value?.type === 'secret_text')
    .map(([name]) => name)
    .sort();
  requireValue(
    normalized(snapshot.secretNames) === normalized(priorSecrets),
    'EXISTING_SECRET_SET_CHANGED',
  );
  requireValue(
    normalized(after.deployment_configs.preview) ===
      normalized(before.deployment_configs.preview),
    'PREVIEW_SETTINGS_CHANGED',
  );
  requireValue(
    normalized(after.build_config) === normalized(before.build_config),
    'EXISTING_BUILD_SETTINGS_CHANGED',
  );
  // Verify original secret descriptors in memory; never persist their values.
  for (const name of priorSecrets)
    requireValue(
      normalized(after.deployment_configs.production.env_vars[name]) ===
        normalized(oldProduction.env_vars[name]),
      'EXISTING_SECRET_DESCRIPTOR_CHANGED',
    );
  return snapshot;
}
