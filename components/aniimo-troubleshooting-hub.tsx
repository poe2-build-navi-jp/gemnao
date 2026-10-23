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
        <h2>アニモが開けない時は、更新・起動・ログインを分ける</h2>
        <p>{aniimoHubAnswer}</p>
        <p>
          このページの操作手順はWindows
          PC版（公式ランチャー・Steam）が対象です。スマホ・PS5・XboxではPC用の修復やWindows設定を使わず、公式のお知らせとサポートを確認してください。
        </p>
        <p className="source-note">
          2026年10月21日確認。公式PC版FAQと10月16日掲載の更新・既知問題案内を照合しています。下の症状は、現在すべての利用者に発生している障害を示すものではありません。
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
                  <a href={row.href ?? `/games/aniimo/${row.slug}`}>
                    {row.label}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="guide-section" id="aniimo-patch">
        <h2>パッチエラー・更新できない時は、表示全文を確認</h2>
        <p>
          「パッチエラー」という検索語だけでは原因を特定できません。
          <strong>エラーが出ているか、進捗バーだけが止まっているか</strong>
          を分け、公式ランチャー／Steamのどちらで発生したかを控えてください。
        </p>
        <ul>
          <li>
            <strong>進捗だけが止まる：</strong>
            公式FAQでは、更新中や中断後の再開時にローカルファイルを処理することがあると案内しています。
            一時停止だけで失敗と判断せず、処理を待ちます。待ち時間の一律の基準は確認できていません。
          </li>
          <li>
            <strong>更新エラーが出る：</strong>
            エラー全文とインストール先の空き容量を確認。セキュリティソフトにブロック履歴があればファイル名を控えます。
            保護の一括無効化や、正体を確認できないファイルの除外登録はしません。
          </li>
          <li>
            <strong>エラーが続く・更新後に開かない：</strong>
            更新処理中の強制終了を避け、終了できる状態で
            <a href="#aniimo-repair">配布元別の修復先</a>を確認します。
            同じエラーが続けば
            <a href="#aniimo-report">公式サポートへ記録を送る</a>段階です。
          </li>
        </ul>
        <p className="source-note">
          根拠：
          <a
            href="https://aniimo.com/ja/newslist/detail/100091"
            target="_blank"
            rel="noreferrer"
          >
            公式PC版FAQのダウンロード・更新項目
          </a>
          。
          この総合ページでは確認先を案内します。起動後のクラッシュや黒画面の詳しい操作は、それぞれの症状別記事を参照してください。
        </p>
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
            href="https://www.aniimo.com/newslist/detail/100198"
            target="_blank"
            rel="noreferrer"
          >
            10月16日掲載の更新案内
          </a>
          は10月15日のリソース更新を扱っています。コンソール向けのクラッシュ修正を、PCの起動不可が直った根拠にはしません。
          <a
            href="https://www.aniimo.com/newslist/detail/100208"
            target="_blank"
            rel="noreferrer"
          >
            同日掲載の既知問題・修正履歴
          </a>
          にある黒画面向けの案内は、
          <a href="/games/aniimo/black-screen">黒画面の記事</a>
          で条件を確認してください。
          掲載日と各修正日を区別し、現在の障害は公式の最新告知で照合します。
        </p>
      </section>
      <section className="guide-section" id="aniimo-repair">
        <h2>PC版のファイル修復は、公式ランチャーとSteamで異なる</h2>
        <p>
          ゲームを終了してから、自分がインストールした配布元だけで修復します。ログイン待ちや表示倍率の問題に、修復を繰り返す必要はありません。
        </p>
        <ul>
          <li>
            <strong>公式ランチャー版：</strong>
            公式PC版FAQの「ワンクリック修復」を使います。
          </li>
          <li>
            <strong>Steam版：</strong>
            Steamの「ゲームファイルの整合性を確認」を使います。同じ名前の修復ボタンをランチャーで探す必要はありません。
          </li>
        </ul>
        <p>
          <a href="/games/aniimo/not-launching#repair-files">
            配布元別の修復操作と、修復後の結果別判断
          </a>
          は起動・クラッシュの記事へ。Steamの確認結果の読み方は
          <a href="/guide/verify-steam-files">整合性確認ガイド</a>
          も参照できます。
          修復完了の表示だけで解決とせず、以前止まった地点まで進めるか確認してください。
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
