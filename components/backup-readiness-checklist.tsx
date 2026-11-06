'use client';
/* oxlint-disable next/no-html-link-for-pages -- Explicit existing guide anchors. */
import { useState } from 'react';
import {
  backupCheckIds,
  backupReadiness,
  type BackupCondition,
} from '@/lib/backup-readiness';
import type { MyGamesLocale } from '@/lib/my-games-copy';
const copy = {
  ja: {
    title: 'Steam・PCゲームのバックアップ確認リスト',
    intro:
      '実際に確認した項目だけ選んでください。ファイルの検査やコピーは行いません。入力はこの表示中だけで、再読み込みすると消えます。',
    condition: 'いまのセーブの状態',
    choose: '選んでください',
    normal: '正常な進行をバックアップしたい',
    conflict: '同期エラー・競合が出ている',
    missing: '進行が消えた・壊れた疑いがある',
    items: [
      'ゲームを終了し、必要な保存・通常の同期が終わった',
      'ゲーム・ストア・アカウントに合う保存先を確認した',
      '元を残し、同期先とは別の日時付きフォルダーへコピーした',
      'コピーのエラーがなく、必要なファイル・数・サイズを照合した',
      '元の保存と過去の正常なコピーを残し、版と確認方法を記録した',
    ],
    checking: '確認済み',
    reviewed:
      '確認項目をすべて選択しました。コピーの完全性やゲームでの読み込み成功を自動判定した結果ではありません。',
    preserve:
      '通常の移行手順より、残った候補の保全を優先してください。新規起動・上書き・同期のやり直しを先に行わず、各端末のデータを分けて残します。',
    restore: '復元前の条件と手順を読む',
    cloud: '同期エラー・競合の保全手順へ',
    reset: 'チェックをやり直す',
  },
  en: {
    title: 'Steam and PC save-backup checklist',
    intro:
      'Select only checks you actually completed. This does not inspect or copy files. Answers last only for this view and clear on reload.',
    condition: 'Current save condition',
    choose: 'Choose a condition',
    normal: 'I want to back up healthy progress',
    conflict: 'There is a sync error or conflict',
    missing: 'Progress is missing or may be corrupt',
    items: [
      'The game is closed and required saving and normal sync have finished',
      'I confirmed the location for the game, store and account',
      'I kept the original and copied to a separate dated folder outside active sync',
      'I checked copy errors, required files, file counts and sizes',
      'I kept the original and older healthy copies and recorded the build and checks',
    ],
    checking: 'Checks completed',
    reviewed:
      'All checks are selected. This is not an automatic test of copy integrity or a successful in-game load.',
    preserve:
      'Preserve available candidates before a normal migration. Do not start the game, overwrite progress or retry sync first; keep each device’s files separately.',
    restore: 'Read restoration conditions and steps',
    cloud: 'Preserve files before resolving Cloud errors',
    reset: 'Start the checklist again',
  },
  zh: {
    title: 'Steam 与 PC 游戏存档备份检查表',
    intro:
      '只勾选自己实际确认的项目。本表不会检查或复制文件；答案仅在当前页面显示，刷新后清除。',
    condition: '当前存档状态',
    choose: '请选择状态',
    normal: '备份正常进度',
    conflict: '存在同步错误或冲突',
    missing: '进度丢失或疑似损坏',
    items: [
      '游戏已关闭，必要保存及正常同步已完成',
      '已核对游戏、商店、账号对应的存档路径',
      '保留原件，复制到同步范围外的独立日期文件夹',
      '已核对复制错误、必要文件、数量及大小',
      '保留原存档与较早的正常副本，并记录版本和核对方法',
    ],
    checking: '已确认项目',
    reviewed: '已选中全部项目。这不是自动验证副本完整性或游戏成功载入的结果。',
    preserve:
      '应先保全现有候选文件，再考虑正常迁移。不要先启动、覆盖或重试同步；分别保留各设备的数据。',
    restore: '阅读恢复条件与步骤',
    cloud: '查看云错误与冲突的保全步骤',
    reset: '重新检查',
  },
  es: {
    title: 'Lista de comprobación de copias de partidas de Steam y PC',
    intro:
      'Marca solo lo que hayas comprobado. No inspecciona ni copia archivos. Las respuestas duran solo en esta vista y se borran al recargar.',
    condition: 'Estado actual de la partida',
    choose: 'Elige el estado',
    normal: 'Quiero copiar progreso que funciona',
    conflict: 'Hay un error o conflicto de sincronización',
    missing: 'Falta progreso o puede estar dañado',
    items: [
      'El juego está cerrado y terminaron el guardado y la sincronización normal',
      'Confirmé la ruta del juego, tienda y cuenta correctos',
      'Conservé el original y copié a otra carpeta fechada fuera de la sincronización activa',
      'Comprobé errores, archivos necesarios, cantidades y tamaños',
      'Conservé originales y copias anteriores sanas y anoté la versión y las comprobaciones',
    ],
    checking: 'Comprobaciones realizadas',
    reviewed:
      'Has seleccionado todas las comprobaciones. No es una validación automática de integridad ni de carga correcta en el juego.',
    preserve:
      'Conserva los candidatos antes de una migración normal. No inicies el juego, sobrescribas ni reintentes sincronizar antes; guarda aparte los datos de cada dispositivo.',
    restore: 'Leer condiciones y pasos de restauración',
    cloud: 'Conservar archivos ante errores y conflictos Cloud',
    reset: 'Reiniciar la lista',
  },
};
export function BackupReadinessChecklist({
  locale = 'ja',
}: {
  locale?: MyGamesLocale;
}) {
  const t = copy[locale];
  const [condition, setCondition] = useState<BackupCondition>('');
  const [checked, setChecked] = useState<string[]>([]);
  const result = backupReadiness(condition, checked);
  const prefix = locale === 'ja' ? '' : `/${locale}`;
  return (
    <section
      className="backup-readiness"
      id="backup-readiness"
      aria-labelledby="backup-readiness-title"
    >
      <h2 id="backup-readiness-title">{t.title}</h2>
      <p>{t.intro}</p>
      <label>
        {t.condition}
        <select
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value as BackupCondition);
            setChecked([]);
          }}
        >
          <option value="">{t.choose}</option>
          <option value="normal">{t.normal}</option>
          <option value="conflict">{t.conflict}</option>
          <option value="missing">{t.missing}</option>
        </select>
      </label>
      {condition === 'normal' && (
        <fieldset>
          <legend>{t.checking}</legend>
          {backupCheckIds.map((id, index) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={checked.includes(id)}
                onChange={(e) =>
                  setChecked((previous) =>
                    e.target.checked
                      ? [...new Set([...previous, id])]
                      : previous.filter((value) => value !== id),
                  )
                }
              />
              <span>{t.items[index]}</span>
            </label>
          ))}
        </fieldset>
      )}
      <output aria-live="polite">
        {result.state === 'choose'
          ? t.choose
          : result.state === 'preserve'
            ? t.preserve
            : result.state === 'reviewed'
              ? t.reviewed
              : `${t.checking}: ${result.completed} / ${result.total}`}
      </output>
      {result.state === 'preserve' ? (
        <p>
          <a href={`${prefix}/guide/steam-cloud-sync-error`}>{t.cloud} →</a>
        </p>
      ) : condition === 'normal' ? (
        <p>
          <a href={locale === 'ja' ? '#save-restore' : '#safe-restore'}>
            {t.restore} →
          </a>
        </p>
      ) : null}
      {condition && (
        <button
          type="button"
          onClick={() => {
            setCondition('');
            setChecked([]);
          }}
        >
          {t.reset}
        </button>
      )}
    </section>
  );
}
