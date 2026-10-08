import { isPagesPreviewOrigin } from '../preview/origin';
export type DiagnosisConfig = {
  enabled: boolean;
  sharing: boolean;
  metrics: boolean;
  localOnly?: boolean;
  previewSharing?: boolean;
};
export function isDiagnosisConfig(value: unknown): value is DiagnosisConfig {
  if (!value || typeof value !== 'object') return false;
  const config = value as Record<string, unknown>;
  return ['enabled', 'sharing', 'metrics'].every((key) => typeof config[key] === 'boolean') &&
    ['localOnly', 'previewSharing'].every((key) => config[key] === undefined || typeof config[key] === 'boolean');
}
export function clientDiagnosisConfig(
  next: DiagnosisConfig,
  origin: string,
  beta: boolean,
  enabled: boolean,
) {
  const previewSharing = next.previewSharing === true && isPagesPreviewOrigin(origin);
  const localOnly = beta && !previewSharing;
  return {
    enabled: (enabled || beta) && next.enabled === true,
    sharing: (!beta && enabled || previewSharing) && next.enabled === true && next.sharing === true,
    metrics: !beta && !previewSharing && enabled && next.enabled === true && next.metrics === true,
    localOnly,
    previewSharing,
  };
}

export const unconfirmedSharingNotice = '共有機能の受付状況をまだ確認できていません。共有が利用できる場合も、内容と公開範囲を確認して確定するまで共有データは送信しません。';
