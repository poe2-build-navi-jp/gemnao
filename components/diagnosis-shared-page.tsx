'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids third-party scripts persisting onto diagnostics. */
import { useCallback, useEffect, useState } from 'react';
import { DiagnosisResultView, DiagnosisSummary } from './diagnosis-result';
import { ShareControls } from './diagnosis-share';
import { diagnosisRequest, readLocal } from '@/lib/diagnosis/local';
import { statuses, type ActionStatus } from '@/lib/diagnosis/model';
import { actions } from '@/lib/diagnosis/rules';
import type { Snapshot } from '@/lib/diagnosis/validation';
type Shared = {
  id: string;
  snapshot: Snapshot;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  revision: number;
  inactive?: boolean;
  expired?: boolean;
  revoked?: boolean;
};
export function DiagnosisSharedPage({
  id,
  manage = false,
}: {
  id: string;
  manage?: boolean;
}) {
  const [data, setData] = useState<Shared | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [key, setKey] = useState(''),
    [removed, setRemoved] = useState(false);
  const [draft, setDraft] = useState<Record<string, ActionStatus>>({}),
    [operation, setOperation] = useState<'update' | 'revoke' | 'delete' | null>(
      null,
    ),
    [message, setMessage] = useState('');
  const load = useCallback(
    () =>
      diagnosisRequest<Shared>(`/${id}${manage ? '/owner' : ''}`)
        .then((d) => {
          setData(d);
          setDraft(d.snapshot?.results || {});
          setError('');
        })
        .catch((e) => {
          setError(e.message);
          setData(null);
        }),
    [id, manage],
  );
  useEffect(() => {
    void load();
  }, [load]);
  async function recover() {
    setBusy(true);
    setError('');
    try {
      await diagnosisRequest(`/${id}/recover`, { key });
      setKey('');
      await load();
      setMessage('このブラウザで管理できるようになりました。');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function apply() {
    if (busy || !operation) return;
    setBusy(true);
    setError('');
    try {
      if (operation === 'update') {
        await diagnosisRequest(
          `/${id}`,
          { results: draft, revision: data!.revision },
          'PATCH',
        );
        await load();
        setMessage('確認した実施結果を共有ページへ反映しました。');
      } else {
        await diagnosisRequest(
          `/${id}${operation === 'revoke' ? '/revoke' : ''}`,
          {},
          operation === 'delete' ? 'DELETE' : 'POST',
        );
        if (operation === 'delete') setRemoved(true);
        else await load();
        setMessage(
          operation === 'delete'
            ? '共有ページを稼働DBから削除しました。'
            : '共有ページを即時失効させました。',
        );
      }
      setOperation(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (removed)
    return (
      <section>
        <output className="diag-notice">{message}</output>
        <p>
          他の場所への転載や基盤のバックアップまですぐ消えることを保証するものではありません。
        </p>
        <a href="/diagnose">診断トップへ戻る</a>
      </section>
    );
  return (
    <section>
      {message && <output className="diag-notice">{message}</output>}
      {error && (
        <p role="alert" className="diag-error">
          {error}
        </p>
      )}
      {!data && !error && <output>共有結果を確認しています…</output>}
      {!data && error && (
        <button onClick={() => void load()}>再読み込み</button>
      )}
      {manage && !data && (
        <div className="diag-card">
          <h2>復元用管理キーを持っている場合</h2>
          <p>
            作成したブラウザで開くか、発行時に控えた管理キーを入力します。共有URLだけでは管理できません。
          </p>
          <label htmlFor="recovery-key">管理キー</label>
          <div className="diag-field">
            <input
              id="recovery-key"
              type="password"
              autoComplete="off"
              maxLength={64}
              value={key}
              onChange={(e) => setKey(e.target.value.trim())}
            />
          </div>
          <button
            disabled={busy || !/^[a-f0-9]{64}$/.test(key)}
            onClick={recover}
          >
            管理権限を復元する
          </button>
        </div>
      )}
      {data && (
        <>
          {data.inactive ? (
            <p className="diag-warning">
              この共有は{data.expired ? '期限切れ' : '失効済み'}
              で、回答内容を閲覧できません。
            </p>
          ) : (
            <>
              <p className="diag-small">
                作成：{new Date(data.createdAt).toLocaleString('ja-JP')}
                <br />
                最終更新：{new Date(data.updatedAt).toLocaleString('ja-JP')}
                <br />
                有効期限：{new Date(data.expiresAt).toLocaleString('ja-JP')}
                （更新しても延長しません）
              </p>
              <DiagnosisSummary answers={data.snapshot.answers} />
              <DiagnosisResultView
                result={data.snapshot.result}
                records={{
                  ...data.snapshot.tried,
                  ...(manage ? draft : data.snapshot.results),
                }}
                onRecord={
                  manage
                    ? (action, status) => {
                        setDraft((d) => ({ ...d, [action]: status }));
                        setMessage(
                          '変更はまだ共有ページに反映されていません。下の「共有内容を更新」から確認してください。',
                        );
                      }
                    : undefined
                }
              />
              {Object.keys(data.snapshot.tried).length > 0 && (
                <details>
                  <summary>診断前に試した対処</summary>
                  <ul>
                    {Object.entries(data.snapshot.tried)
                      .filter(([, s]) => s !== 'untried')
                      .map(([a, s]) => (
                        <li key={a}>
                          {actions[a]?.title || a}：{statuses[s]}
                        </li>
                      ))}
                  </ul>
                </details>
              )}
              {!manage ? (
                <>
                  <p className="diag-notice">
                    このページは閲覧専用です。回答と実施結果は作成者の自己申告で、原因や改善を保証するものではありません。
                  </p>
                  <ShareControls id={id} />
                  <a href="/diagnose">自分の症状を無料診断する →</a>
                  <p>
                    <a href={`/diagnosis/manage/${id}`}>
                      作成した本人が共有を管理する
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      const local = readLocal();
                      if (local?.shareId === id) {
                        setDraft(local.results);
                        setMessage(
                          '端末内の実施結果を読み込みました。まだ共有ページには反映していません。',
                        );
                      } else
                        setMessage(
                          'このブラウザに対応する診断の記録がありません。上のボタンで実施結果を選べます。',
                        );
                    }}
                  >
                    この端末の実施結果を読み込む
                  </button>
                  <button
                    className="diag-primary"
                    onClick={() => setOperation('update')}
                  >
                    共有内容を更新
                  </button>
                  <a href={`/diagnosis/${id}`}>閲覧用ページを開く</a>
                </>
              )}
            </>
          )}
          {manage && (
            <div className="diag-share">
              <h2>共有を終了する</h2>
              <p>
                失効するとすぐ閲覧できなくなります。削除すると、この共有の回答と管理情報を稼働DBから削除します。転載や基盤のバックアップは別です。
              </p>
              {!data.inactive && (
                <button onClick={() => setOperation('revoke')}>
                  今すぐ共有を失効させる
                </button>
              )}
              <button onClick={() => setOperation('delete')}>
                共有データを削除する
              </button>
            </div>
          )}
          {operation && (
            <section className="diag-card" aria-labelledby="confirm-title">
              <h2 id="confirm-title">
                {operation === 'update'
                  ? '更新する実施結果を確認'
                  : operation === 'revoke'
                    ? 'この共有を失効させますか？'
                    : 'この共有を削除しますか？'}
              </h2>
              {operation === 'update' ? (
                <>
                  <ul>
                    {Object.entries(draft).map(([a, s]) => (
                      <li key={a}>
                        {actions[a]?.title || a}：{statuses[s]}
                      </li>
                    ))}
                  </ul>
                  <p>
                    診断時の回答・ルール・推奨順は変わりません。再診断は新しい共有として作成してください。
                  </p>
                </>
              ) : (
                <p>
                  元に戻せません。作成から30日の期限を待たずに、リンクから回答を見られなくします。
                </p>
              )}
              <button className="diag-primary" disabled={busy} onClick={apply}>
                {busy
                  ? '処理しています…'
                  : operation === 'update'
                    ? '確認して更新'
                    : operation === 'revoke'
                      ? '確認して失効'
                      : '確認して削除'}
              </button>
              <button disabled={busy} onClick={() => setOperation(null)}>
                キャンセル
              </button>
            </section>
          )}
        </>
      )}
    </section>
  );
}
