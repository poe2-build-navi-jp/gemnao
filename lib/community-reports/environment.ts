export const environmentKeys = [
  'cpuModel',
  'gpuModel',
  'ramGb',
  'driverVersion',
] as const;
export type ReportEnvironment = Partial<
  Record<(typeof environmentKeys)[number], string>
>;
export function validEnvironment(value: unknown): value is ReportEnvironment {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([key, field]) =>
      environmentKeys.includes(key as (typeof environmentKeys)[number]) &&
      typeof field === 'string' &&
      field.length <= 60 &&
      (key === 'ramGb'
        ? /^(?:|[1-9][0-9]{0,3})$/.test(field)
        : /^[A-Za-z0-9 .()+_-]*$/.test(field)),
  );
}
export const environmentCopy = {
  ja: {
    title: '比較に使うPC構成（任意）',
    cpuModel: 'CPU型番',
    gpuModel: 'GPU型番',
    ramGb: 'メモリ容量（GB）',
    driverVersion: 'GPUドライバーの版',
    hint: '分かる項目だけ入力。型番・版は半角英数字と記号で60文字以内。氏名・端末名・シリアル番号は入力しないでください。投稿前のプレビューで送信内容を確認できます。',
    error:
      'PC構成の形式を確認してください。メモリ容量は1〜9999の整数、その他は半角英数字・スペース・.()+_-で60文字以内です。',
  },
  en: {
    title: 'PC setup for comparison (optional)',
    cpuModel: 'CPU model',
    gpuModel: 'GPU model',
    ramGb: 'RAM capacity (GB)',
    driverVersion: 'GPU driver version',
    hint: 'Fill in only what you know. Use up to 60 ASCII letters, numbers or permitted symbols. Do not enter names, device names or serial numbers. Review the submission preview before sending.',
    error:
      'Check the PC setup fields. RAM must be an integer from 1 to 9999; other fields allow up to 60 ASCII letters, numbers, spaces and .()+_-.',
  },
  zh: {
    title: '用于比较的电脑配置（可选）',
    cpuModel: 'CPU型号',
    gpuModel: 'GPU型号',
    ramGb: '内存容量（GB）',
    driverVersion: '显卡驱动版本',
    hint: '只填写已知项目。型号与版本使用半角字母、数字及允许的符号，最多60字符。请勿填写姓名、设备名称或序列号。发送前可预览内容。',
    error:
      '请检查电脑配置。内存须为1至9999的整数；其他项目最多60个半角字母、数字、空格及 .()+_-。',
  },
  es: {
    title: 'Configuración del PC para comparar (opcional)',
    cpuModel: 'Modelo de CPU',
    gpuModel: 'Modelo de GPU',
    ramGb: 'Memoria RAM (GB)',
    driverVersion: 'Versión del controlador de GPU',
    hint: 'Rellena solo lo que conozcas, con un máximo de 60 caracteres ASCII por campo. No incluyas nombres personales, nombres del dispositivo ni números de serie. Revisa la vista previa antes de enviar.',
    error:
      'Revisa la configuración: RAM debe ser un entero de 1 a 9999; los otros campos admiten hasta 60 letras ASCII, números, espacios y .()+_-.',
  },
};
