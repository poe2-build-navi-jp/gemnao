#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
FIXTURE="$(mktemp -d /tmp/gemnao-worker-synthetic.XXXXXX)"
trap 'rm -rf "$FIXTURE"' EXIT
git archive HEAD | tar -x -C "$FIXTURE"
# Overlay this candidate's tracked edits and new source files, never ignored
# credentials, dependency directories, build outputs or local provider state.
while IFS= read -r file; do
  [[ -f "$file" ]] || continue
  mkdir -p "$FIXTURE/$(dirname "$file")"
  cp "$file" "$FIXTURE/$file"
done < <({ git diff --name-only HEAD; git ls-files --others --exclude-standard; } | sort -u)
ln -s "$ROOT/node_modules" "$FIXTURE/node_modules"
node - "$FIXTURE" <<'JS'
const fs=require('node:fs'),path=require('node:path');
const root=process.argv[2],origin='https://gemnao-diagnostic-qa.synthetic-test.workers.dev';
const p=path.join(root,'lib/preview/worker-origin.ts'),s=fs.readFileSync(p,'utf8');
const marker=/^export const VERIFIED_WORKER_PREVIEW_ORIGIN: string = '(?:https:\/\/gemnao-diagnostic-qa\.[a-z0-9-]+\.workers\.dev)?';$/m;
if(!marker.test(s))throw Error('Expected exactly one reviewed source origin declaration');
fs.writeFileSync(p,s.replace(marker,`export const VERIFIED_WORKER_PREVIEW_ORIGIN: string = '${origin}';`));
const f=path.join(root,'wrangler.worker-preview.json'),c=JSON.parse(fs.readFileSync(f,'utf8'));
c.account_id='00000000000000000000000000000000';c.workers_dev=false;
c.vars.QA_PREVIEW_ORIGIN=c.vars.DIAGNOSIS_PREVIEW_ORIGIN=c.vars.FEEDBACK_PREVIEW_ORIGIN=origin;
for(const [i,db] of c.d1_databases.entries()){db.database_name='synthetic-local-'+i;db.database_id='00000000-0000-4000-8000-00000000000'+(i+7);}
fs.writeFileSync(f,JSON.stringify(c,null,2)+'\n');
JS
cd "$FIXTURE"
export WRANGLER_WRITE_LOGS=false WRANGLER_SEND_METRICS=false
export WRANGLER_LOG_PATH="$FIXTURE/.wrangler/logs" MINIFLARE_REGISTRY_PATH="$FIXTURE/.wrangler/registry"
export pnpm_config_verify_deps_before_run=warn
pnpm build
node scripts/check-worker-preview-runtime.mjs --synthetic-enabled --skip-browser
