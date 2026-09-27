'use client';
import { useState } from 'react';
const items = [
  '対象の設定ファイルを見つけた',
  '設定とセーブを別の場所へコピーした',
  '元の保存先と症状を記録した',
];
export function ResetConfigChecklist() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const count = checked.filter(Boolean).length;
  return (
    <section
      className="reset-checklist reset-checklist-interactive"
      id="reset-checklist"
    >
      <h2>作業前チェック</h2>
      <p>各項目をタップして確認できます。</p>
      <fieldset>
        <legend>初期化の準備</legend>
        {items.map((item, i) => (
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
        {count}/3 確認済み{count === 3 ? ' — 次の手順へ進めます' : ''}
      </output>
      <p className="reset-small">
        チェックはこのページを開いている間だけ保持します。
      </p>
    </section>
  );
}
