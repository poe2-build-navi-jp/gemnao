// Exact, audited artifact. Never relabel an older game-specific binary.
export const windowsDiagnosisRelease: {
  version: string;
  file: string;
  bytes: number;
  sha256: string;
  languages: readonly ('ja' | 'en')[];
  syntheticTests: number;
} | null = {
  version: '0.6.0',
  languages: ['ja', 'en'],
  syntheticTests: 386,
  file: 'gemnao-game-diagnosis-0.6.0-windows-x64.zip',
  bytes: 299650,
  sha256: '34719ffa93fe31143dcd392b383831fdf8f3f3ecc98d64f2d9e68d9405126b77',
};
