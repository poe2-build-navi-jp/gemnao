/** Only one explicitly selected HTTPS Pages preview may collect QA data. */
export function isPagesPreviewOrigin(value: string): boolean {
  return /^https:\/\/[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.gemnao\.pages\.dev$/.test(value);
}

export function previewRequestAllowed(
  request: Request,
  flag: string | undefined,
  origin: string | undefined,
): boolean {
  return flag === 'true' && typeof origin === 'string' &&
    isPagesPreviewOrigin(origin) && new URL(request.url).origin === origin;
}
