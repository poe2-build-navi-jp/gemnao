'use client';
import { useState } from 'react';
const items = [
  '対象の設定ファイルを見つけた',
  '設定とセーブを別の場所へコピーした',
  '元の保存先と症状を記録した',
];
export function ResetConfigChecklist({ english = false }: { english?: boolean }) {
  const labels = english ? ['I identified the exact configuration file', 'I copied configuration and saves to independent locations', 'I recorded the original path and symptom'] : items;
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const count = checked.filter(Boolean).length;
  return (
    <section
      className="reset-checklist reset-checklist-interactive"
      id="reset-checklist"
    >
      <h2>{english ? 'Before you begin' : '作業前チェック'}</h2>
      <p>{english ? 'Check each completed preparation. These checks do not guarantee a successful reset.' : '各項目をタップして確認できます。'}</p>
      <fieldset>
        <legend>{english ? 'Configuration reset preparation' : '初期化の準備'}</legend>
        {labels.map((item, i) => (
          <label key={item} className={checked[i] ? 'is-checked' : ''}>
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) =>
                setChecked((v) =>
                  v.map((old, j) => (j === i ? e.target.checked : old)),
                )
              }
            />
            <span>{item}</span>
          </label>
        ))}
      </fieldset>
      <output aria-live="polite">
        {count}/3 {english ? 'checked' : '確認済み'}{count === 3 ? (english ? ' — Ready to review the next steps' : ' — 次の手順へ進めます') : ''}
      </output>
      <p className="reset-small">
        {english ? 'Checks are kept only while this page remains open.' : 'チェックはこのページを開いている間だけ保持します。'}
      </p>
    </section>
  );
}
