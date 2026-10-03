'use client';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { useState } from 'react';
import { Check, Gamepad2 } from 'lucide-react';
import { useMyGames } from '@/components/use-my-pc';
import { MY_GAMES_KEY } from '@/lib/my-pc';
import { trackMyGameAdded } from '@/lib/analytics';

export function SaveGame({ slug }: { slug: string }) {
  const [myGames, saveGames, ready] = useMyGames();
  const [message, setMessage] = useState('');
  const saved = myGames.includes(slug);
  return (
    <div className="save-game my-pc-actions">
      <button
        type="button"
        aria-pressed={saved}
        disabled={!ready}
        onClick={() => {
          try {
            // Read at click time so another component/tab's latest choices survive.
            const value: unknown = JSON.parse(
              localStorage.getItem(MY_GAMES_KEY) || '[]',
            );
            if (
              !Array.isArray(value) ||
              !value.every((item) => typeof item === 'string')
            )
              throw new Error(
                '保存データを読み取れません。マイページで確認してください。',
              );
            const current = [...new Set(value as string[])];
            const removing = current.includes(slug);
            if (!removing && current.length >= 10) {
              setMessage(
                '最大10本です。マイページで選択を減らしてから追加してください。',
              );
              return;
            }
            if (
              !saveGames(
                removing
                  ? current.filter((item) => item !== slug)
                  : [...current, slug],
              )
            )
              throw new Error(
                '保存できませんでした。ブラウザの保存設定を確認してください。',
              );
            if (!removing) trackMyGameAdded();
            setMessage(
              removing
                ? 'マイゲームから外しました。'
                : 'このブラウザのマイゲームに保存しました。',
            );
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : '保存できませんでした。',
            );
          }
        }}
      >
        {saved ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Gamepad2 size={18} aria-hidden="true" />
        )}
        {saved ? 'マイゲームに保存済み（外す）' : '遊ぶゲームとして保存'}
      </button>
      <a href="/my#my-feed">マイゲームを見る →</a>
      <output>{message}</output>
    </div>
  );
}
