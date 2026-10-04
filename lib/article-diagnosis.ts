// Deliberate symptom allowlists: categories also contain HDR, launchers,
// security requirements and other issues the Windows tool does not diagnose.
const gameSymptoms = new Set([
  'not-launching', 'crash', 'crash-on-startup', 'crash-performance',
  'crash-report', 'black-screen', 'fps', 'low-fps', 'performance',
  'gtx10-rtx20-low-fps', 'stutter', 'stutter-windowed',
  'shader-compilation-crash', 'video-memory-error',
]);
const guideSymptoms = new Set([
  'steam-game-not-launching', 'pc-game-crash', 'pc-game-freezes',
  'low-fps', 'stutter-fix',
]);

export function hasWindowsDiagnosisEntry(path: string) {
  const parts = path.split('/').filter(Boolean);
  return (parts.length === 3 && parts[0] === 'games' && gameSymptoms.has(parts[2])) ||
    (parts.length === 2 && parts[0] === 'guide' && guideSymptoms.has(parts[1]));
}
