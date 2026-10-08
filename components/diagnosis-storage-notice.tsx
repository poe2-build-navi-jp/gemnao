'use client';
import { unconfirmedSharingNotice } from '@/lib/diagnosis/client-config';
import { useDiagnosisConfig } from './diagnosis-config';
export function DiagnosisStorageNotice() {
  const config = useDiagnosisConfig();
  if (!config.confirmed) return <>{unconfirmedSharingNotice}</>;
  return <>{config.previewSharing
    ? 'このプレビューでは、内容と公開範囲を確認して任意の共有を確定したときだけ、選択式の回答と対処の記録を専用DBへ保存します。ゲーム名は送信しません。共有は30日で期限切れになり、管理画面から失効・削除できます。診断イベントは計測しません。'
    : '回答と対処の記録は、このブラウザの端末内にだけ保存します。現在のβ版では、診断内容のサーバー送信・結果の共有・診断イベントの計測は行いません。端末内の記録は自分で消せます。'}</>;
}
