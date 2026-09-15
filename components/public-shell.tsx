/* oxlint-disable next/no-html-link-for-pages -- Native navigation avoids a vinext client-link runtime failure. */
import { Sparkles } from '@/components/icons';

export function PublicHeader() {
  return (
    <header className="public-header">
      <a className="public-brand" href="/">
        <span>
          <Sparkles size={16} />
        </span>
        <div>
          <strong>ARCANA LINK</strong>
          <small>22種カード交換所</small>
        </div>
      </a>
      <nav aria-label="メインナビゲーション">
        <a href="/">マッチング</a>
        <a href="/genshin-arcana">原神アルカナ</a>
        <a href="/guide">交換ガイド</a>
        <a href="/arcana">22種一覧</a>
        <a href="/about">このサイトについて</a>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div>
        <strong>ARCANA LINK</strong>
        <p>
          22種類のコレクションカード交換を、安全で探しやすくする独立運営のサイトです。
        </p>
      </div>
      <nav aria-label="フッターナビゲーション">
        <a href="/genshin-arcana">原神アルカナ解説</a>
        <a href="/guide">交換ガイド</a>
        <a href="/arcana">アルカナ一覧</a>
        <a href="/about">運営情報</a>
        <a href="/privacy">プライバシーポリシー</a>
        <a href="/terms">利用規約</a>
      </nav>
      <small>© 2026 ARCANA LINK</small>
    </footer>
  );
}

export function ArticleShell({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="article-page">
        <header className="article-hero">
          <span>{kicker}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
        </header>
        <article className="article-body">{children}</article>
      </main>
      <PublicFooter />
    </>
  );
}
