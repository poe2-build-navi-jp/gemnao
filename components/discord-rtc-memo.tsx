'use client';

import { useRef, useState } from 'react';

export const rtcMemoTemplate = `Discord「RTC接続中」の相談メモ
※分からない項目・試せない項目は「未確認」。秘密情報は書かない。
発生日時・タイムゾーン：
画面のエラー表示（個人情報を除く）：
OS／Discordアプリ版／ブラウザ名・版：
Discord公式障害情報の確認時刻・結果：
同じ通話先での比較（接続可／不可／未確認）：
・PCアプリ：
・同じPC・回線のブラウザ版：
・同じWi-Fiの別端末：
・同じPCの別回線：
DMと別チャンネルでの違い（名前・招待URLは不要）：
VPNの利用有無／個人・学校・職場など回線の区分：
1つずつ変更した設定・変更前の状態・結果・元に戻したか：
再起動後の結果／その後の再発（確認した範囲のみ）：`;

const example = `【架空の記入例・実際の障害／改善報告ではありません】
発生日時：20XX年X月X日 20:00（日本時間）
表示：RTC接続中のまま。追加エラーなし
環境：Windows 11／Discordアプリ版は未確認／ブラウザ名・版は未確認
公式障害情報：20:05確認、その時点で音声障害の掲載を見つけられず
同じ通話先：PCアプリ＝不可、同じPC・回線のブラウザ＝可
同じWi-Fiの別端末＝未確認、同じPCの別回線＝未確認
通話先：DM・別チャンネルともアプリでは不可（名前は省略）
VPN：利用なし／自宅回線
変更：QoSをオン→オフにしても変化なし。オンへ戻した
再起動後：アプリでは不可。ブラウザでは短い会話ができた
その後：長時間の利用・再発状況は未確認`;

export function DiscordRtcMemo() {
  const memo = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(rtcMemoTemplate);
      setMessage(
        '相談メモをコピーしました。手元のメモアプリなどで記入してください。',
      );
    } catch {
      memo.current?.focus();
      memo.current?.select();
      setMessage(
        'コピーできませんでした。選択されたメモを手動でコピーしてください（Ctrl+C／長押し）。',
      );
    }
  }
  return (
    <section className="discord-rtc-memo" aria-labelledby="rtc-memo-title">
      <h2 id="rtc-memo-title">相談用メモをコピーする</h2>
      <p>
        比較結果をまとめて、管理者や公式サポートへ相談するときに使えます。空欄のひな形をコピーして手元で記入してください。この欄は入力・送信フォームではありません。
      </p>
      <p className="safety-note">
        パスワード、認証トークン、二要素認証コード、公開IP、メールアドレス、招待URLは記載しないでください。画像やログを添える場合も個人情報を隠します。
      </p>
      <label htmlFor="rtc-memo-template">
        相談メモのひな形（手動でも選択・コピーできます）
      </label>
      <textarea
        id="rtc-memo-template"
        ref={memo}
        readOnly
        value={rtcMemoTemplate}
        rows={18}
      />
      <button type="button" className="copy-button" onClick={copy}>
        相談メモをコピー
      </button>
      <output aria-live="polite">{message}</output>
      <h3>架空の記入例</h3>
      <p>
        書き方だけを示す架空例です。ブラウザで通話できても原因の確定にはならず、長期的に直ったことも示しません。
      </p>
      <pre>{example}</pre>
    </section>
  );
}
