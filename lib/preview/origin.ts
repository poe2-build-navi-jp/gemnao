import { isWorkerPreviewOrigin } from './worker-origin';

/** Existing Pages previews retain their explicit runtime origin gate. */
export function isPagesPreviewOrigin(value: string): boolean {
  return /^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.gemnao\.pages\.dev$/.test(value);
}

/** A Workers preview additionally requires a verified, build-pinned origin. */
export function isApprovedPreviewOrigin(value: string): boolean {
  return isPagesPreviewOrigin(value) || isWorkerPreviewOrigin(value);
}

export function previewRequestAllowed(
  request: Request,
  flag: string | undefined,
  origin: string | undefined,
): boolean {
  return flag === 'true' && typeof origin === 'string' &&
    isApprovedPreviewOrigin(origin) && new URL(request.url).origin === origin;
}
