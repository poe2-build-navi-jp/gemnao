// Fixed read-only observation through the existing owner-reviewed controller.
import { TARGET, sha256 } from "../feedback-preview/controller.mjs";
import { target } from "../d1/control.mjs";
import { diagnosisReadinessQueries } from "../d1/diagnosis-readiness.mjs";
import { readOnlyTransport } from "../feedback-preview/diagnostics.mjs";
import {
  PRODUCTION_HEALTH_AUTHORIZATION,
  validateProductionHealthContext,
} from "./cleanup-health.mjs";

export const READINESS_OPERATION = "diagnosis-readiness";
export const READINESS_MODE = "observe-diagnosis-storage-readiness";
export const READINESS_PAGES_PATH = `/accounts/${TARGET.accountId}/pages/projects/gemnao`;
export const READINESS_DATABASE_PATH = `/accounts/${TARGET.accountId}/d1/database/${target.database}`;
export const READINESS_PLAN_HASH = sha256(
  JSON.stringify({
    operation: READINESS_MODE,
    pagesPath: READINESS_PAGES_PATH,
    databasePath: READINESS_DATABASE_PATH,
    queries: diagnosisReadinessQueries,
    maximumCloudflareRequests: 5,
    cloudflareWrites: 0,
    artifacts: 0,
    retries: 0,
    intakeEnabled: false,
    authorization: PRODUCTION_HEALTH_AUTHORIZATION,
  }),
);
export function validateReadinessContext(context) {
  return Object.freeze({
    ...validateProductionHealthContext(context),
    mode: READINESS_MODE,
    operation: READINESS_MODE,
    planHash: READINESS_PLAN_HASH,
  });
}
export function readinessRequestAllowed(path, method, body) {
  if (method === "GET")
    return body === undefined && [READINESS_PAGES_PATH, READINESS_DATABASE_PATH].includes(path);
  return (
    method === "POST" &&
    path === `${READINESS_DATABASE_PATH}/query` &&
    Object.values(diagnosisReadinessQueries).some((sql) => body === JSON.stringify({ sql }))
  );
}
export function readinessTransport(transport) {
  const githubReads = readOnlyTransport(transport);
  const seen = new Set();
  return (url, options) => {
    if (url.startsWith(`https://api.github.com/repos/${TARGET.repository}/`))
      return githubReads(url, options);
    const root = "https://api.cloudflare.com/client/v4";
    if (
      !url.startsWith(root) ||
      !readinessRequestAllowed(url.slice(root.length), options?.method, options?.body)
    )
      throw new Error("BLOCKED:TRANSPORT_SCOPE");
    const key = `${options.method}:${url}:${options.body ?? ""}`;
    if (seen.has(key) || seen.size >= 5) throw new Error("BLOCKED:REQUEST_BOUND");
    seen.add(key);
    return transport(url, options);
  };
}
