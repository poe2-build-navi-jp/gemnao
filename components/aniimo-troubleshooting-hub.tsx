/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ShareButtons } from '@/components/share-buttons';
import {
  aniimoHubAnswer,
  aniimoHubTitle,
  aniimoSymptomRows,
} from '@/lib/aniimo-troubleshooting';

export function AniimoTroubleshootingHub() {
  return (
    <>
      <section className="guide-section" id="aniimo-first">
        <h2>アニモで不具合が起きたら、最初に何をする？</h2>
        <p>{aniimoHubAnswer}</p>
        <p>
          このページの操作手順はWindows
          PC版（公式ランチャー・Steam）が対象です。スマホ・PS5・XboxではPC用の修復やWindows設定を使わず、公式のお知らせとサポートを確認してください。
        </p>
        <p className="source-note">
          2026年9月30日確認。公式FAQ・更新案内を照合した対処ガイドです。下の症状は、現在すべての利用者に発生している障害を示すものではありません。
        </p>
      </section>
      <section
        className="diagnosis-table"
        id="aniimo-symptoms"
        aria-labelledby="aniimo-symptoms-title"
      >
        <h2 id="aniimo-symptoms-title">
          アニモの不具合・エラー：症状別の確認表
        </h2>
        <p>当てはまる行の確認から始め、詳しい記事へ進んでください。</p>
        <table>
          <thead>
            <tr>
              <th scope="col">症状</th>
              <th scope="col">最初に確認すること</th>
              <th scope="col">次の手順</th>
            </tr>
          </thead>
          <tbody>
            {aniimoSymptomRows.map((row) => (
              <tr key={row.symptom}>
                <td data-label="症状">{row.symptom}</td>
                <td data-label="確認">{row.check}</td>
                <td data-label="手順">
                  <a href={`/games/aniimo/${row.slug}`}>{row.label}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="guide-section" id="aniimo-official">
        <h2>公式の不具合情報と、自分のPCで起きる症状を分ける</h2>
        <ol>
          <li>
            <a
              href="https://www.aniimo.com/newslist"
              target="_blank"
              rel="noreferrer"
            >
              公式ニュース
            </a>
            で、対象サーバー・日時・端末・症状を照合する。古い告知のメンテナンス時間を、現在の障害として扱わない。
          </li>
          <li>
            ログイン可能な状態で、自分のPCだけ起動に失敗するなら、下の配布元別の修復へ。ゲーム全体の停止と、ローカルファイルの問題は分けて確認する。
          </li>
          <li>
            更新後も同じ症状が残るなら、変更した設定を一つずつ戻して比較し、再現結果を公式サポートへ渡す。
          </li>
        </ol>
        <p>
          <a
            href="https://aniimo.com/ja/newslist/detail/100102"
            target="_blank"
            rel="noreferrer"
          >
            Intel CPUの安定性に関する公式案内
          </a>
          は、対象の第13・14世代デスクトップCPUでクラッシュを繰り返す場合の確認先です。すべてのクラッシュやVRAMエラーに当てはまる説明ではありません。
        </p>
        <p>
          <a
            href="https://aniimo.com/ja/newslist/detail/100139"
            target="_blank"
            rel="noreferrer"
          >
            9月23日の更新案内
          </a>
          など、修正済みの項目も更新日と一緒に確認してください。ここではリアルタイムの障害発生を判定していません。
        </p>
      </section>
      <section className="guide-section" id="aniimo-repair">
        <h2>PC版のファイル修復は、公式ランチャーとSteamで異なる</h2>
        <p>
          ゲームを終了してから、自分がインストールした配布元だけで修復します。ログイン待ちや表示倍率の問題に、修復を繰り返す必要はありません。
        </p>
        <h3>公式ランチャー版</h3>
        <p>
          ランチャー右上の「設定」→「ワンクリック修復」を実行。完了後に起動し、以前止まった地点まで進めるか確認します。操作の根拠は
          <a
            href="https://aniimo.com/ja/newslist/detail/100091"
            target="_blank"
            rel="noreferrer"
          >
            公式PC版FAQ
          </a>
          です。
        </p>
        <h3>Steam版</h3>
        <p>
          Steam「ライブラリ」→Aniimoを右クリック→「プロパティ」→「インストール済みファイル」→「ゲームファイルの整合性を確認」。完了後、同じ起動操作で比較します。
          <a href="/guide/verify-steam-files">
            再取得された場合・変わらない場合の読み方
          </a>
          も確認できます。
        </p>
        <p>
          <strong>修復後の判断：</strong>
          起動できたら通常の操作で再発を確認。エラー文が変わったら新しい表示に合う記事へ。同じ症状なら
          <a href="/games/aniimo/not-launching">
            発生時点とWindowsの履歴から次の対処を選びます
          </a>
          。
        </p>
      </section>
      <section className="guide-section" id="aniimo-report">
        <h2>直らない場合：公式サポートへ渡す情報</h2>
        <p>
          ゲーム内「メニュー」→「カスタマーサポート」、またはF10で報告できます。ゲームに入れない場合は
          <a href="mailto:support_jp@aniimo.com">support_jp@aniimo.com</a>
          へ。窓口は
          <a
            href="https://aniimo.com/newslist/detail/100117"
            target="_blank"
            rel="noreferrer"
          >
            公式リリース案内
          </a>
          で確認できます。
        </p>
        <ul>
          <li>端末・配布元：Windows PC／Steam版または公式ランチャー版</li>
          <li>発生日時・サーバー名・止まる地点・エラー全文</li>
          <li>再現操作：例「開始を押す→ロゴ表示→ウィンドウが閉じる」</li>
          <li>
            比較結果：例「修復完了後も同じ地点で終了。別のゲームは起動する」
          </li>
          <li>PC構成：Windowsのバージョン、CPU・GPUの型番、メモリ容量</li>
        </ul>
        <p className="source-note">
          設定変更前の値を記録し、効果がない変更は元に戻します。セーブや不明なフォルダーを削除せず、スクリーンショットではメールアドレス・認証コードなどを隠してください。
        </p>
        <ShareButtons
          title={aniimoHubTitle}
          path="/games/aniimo"
          hashtag="アニモ"
          label="困っているフレンドに症状別の確認表を共有"
        />
      </section>
    </>
  );
}
