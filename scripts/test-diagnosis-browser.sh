#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
export DIAGNOSIS_LOCAL_STATE="${DIAGNOSIS_LOCAL_STATE:-$ROOT/.wrangler/diagnosis-test-state-$(date +%s)}"
export WRANGLER_SEND_METRICS=false WRANGLER_LOG_PATH="$ROOT/.wrangler/logs" MINIFLARE_REGISTRY_PATH="$ROOT/.wrangler/registry" XDG_CONFIG_HOME="$ROOT/.wrangler/tool-config"
export NODE_OPTIONS="${NODE_OPTIONS:-} --import=$ROOT/scripts/diagnosis-test-bootstrap.mjs"
mkdir -p .wrangler/diagnosis-preview test-results
node - <<'JS'
const fs=require('fs');const c=JSON.parse(fs.readFileSync('wrangler.diagnosis-local.json'));c.pages_build_output_dir='../../dist/client';c.d1_databases[0].migrations_dir='../../.openai/drizzle';fs.writeFileSync('.wrangler/diagnosis-preview/wrangler.json',JSON.stringify(c,null,2));
JS
node_modules/.bin/wrangler d1 migrations apply gemnao-diagnosis-local --local --config wrangler.diagnosis-local.json --persist-to "$DIAGNOSIS_LOCAL_STATE" > .wrangler/diagnosis-preview/migrations.log 2>&1
# Staged feature DDL is deliberately outside the production migration directory.
node_modules/.bin/wrangler d1 execute gemnao-diagnosis-local --local --config wrangler.diagnosis-local.json --persist-to "$DIAGNOSIS_LOCAL_STATE" --file migrations/diagnosis/0001_diagnosis.sql >> .wrangler/diagnosis-preview/migrations.log 2>&1
node_modules/.bin/wrangler dev --config wrangler.diagnosis-cleanup-local.json --test-scheduled --ip 127.0.0.1 --port 8789 --persist-to "$DIAGNOSIS_LOCAL_STATE" > .wrangler/diagnosis-preview/cleanup-server.log 2>&1 &
CLEANUP=$!
(cd .wrangler/diagnosis-preview && ../../node_modules/.bin/wrangler pages dev ../../dist/client --ip 127.0.0.1 --port 8788 --persist-to "$DIAGNOSIS_LOCAL_STATE" --binding DIAGNOSIS_ENABLED=true --binding DIAGNOSIS_STORAGE_ENABLED=true --binding DIAGNOSIS_SHARING_ENABLED=true --binding DIAGNOSIS_METRICS_ENABLED=true --d1 DB=00000000-0000-4000-8000-000000000004) > .wrangler/diagnosis-preview/pages-server.log 2>&1 &
PAGES=$!
trap 'kill "$CLEANUP" "$PAGES" 2>/dev/null || true' EXIT
for i in $(seq 1 60); do if curl --noproxy '*' -fsS http://127.0.0.1:8788/api/diagnosis/config > .wrangler/diagnosis-preview/config-before-cleanup.json 2>/dev/null; then break; fi; sleep 1; done
curl --noproxy '*' -fsS 'http://127.0.0.1:8789/cdn-cgi/handler/scheduled?cron=17+*+*+*+*' > .wrangler/diagnosis-preview/scheduled-response.txt
curl --noproxy '*' -fsS http://127.0.0.1:8788/api/diagnosis/config > .wrangler/diagnosis-preview/config-after-cleanup.json
node scripts/test-diagnosis-http.mjs
if [[ "${DIAGNOSIS_SKIP_BROWSER:-false}" != "true" ]]; then node_modules/.bin/playwright test --config playwright.diagnosis.config.ts; fi
