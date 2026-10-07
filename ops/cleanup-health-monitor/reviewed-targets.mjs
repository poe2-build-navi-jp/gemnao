// Live targets require a reviewed commit. Do not accept URLs or expected modes
// from dispatch inputs, environment variables, remote documents or redirects.
// See README.md for the exact configuration shape and activation checklist.
export const REVIEWED_TARGETS = Object.freeze({
  preview: null,
  production: null,
});
