import type { Metadata } from 'next';
/* oxlint-disable next/no-html-link-for-pages -- Native links avoid a vinext client-link runtime issue. */
import { ContactForm } from '@/components/contact-form';
import { WikiFooter, WikiHeader } from '@/components/wiki-header';

export const metadata: Metadata = {
  title: 'お問い合わせ・記事の訂正依頼',
  description:
    'ゲムなおへの記事訂正、権利関係、プライバシー、PC・周辺機器メーカーからの企画相談を受け付けるお問い合わせ窓口です。',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; category?: string }>;
}) {
  const { url = '', category } = await searchParams;
  const initialUrl = typeof url === 'string' && url.startsWith('https://gemnao.pages.dev/') ? url : '';
  return (
    <main>
      <WikiHeader />
      <article className="static-page contact-page">
        <p className="page-kicker">CONTACT</p>
        <h1>お問い合わせ・記事の訂正依頼</h1>
        <p className="page-lead">
          記事の誤り、古くなった手順、権利関係のご連絡を受け付けています。専用フォームのためメールアドレスなしでも送信できます。
        </p>
        <div className="contact-guidance">
          <h2>送信前にご確認ください</h2>
          <ul>
            <li>
              パスワード、住所、電話番号などの機密情報は入力しないでください。
            </li>
            <li>セーブデータや実行ファイルは添付できません。</li>
            <li>
              個別のPC修理やゲーム攻略の依頼には回答できない場合があります。
            </li>
          </ul>
        </div>
        <section className="contact-guidance" id="business">
          <h2>企業・メーカーからの企画相談</h2>
          <p>
            PC・周辺機器の使い方案内、公式情報の訂正、貸出機を用いた検証記事などのご相談は、種別で「企業・メーカーの企画相談」を選んでください。
            <a href="/about#business">対応範囲と広告・編集方針</a>もご確認ください。
          </p>
          <ul>
            <li>会社・担当部署、製品名、企画の目的、希望時期をお知らせください。</li>
            <li>貸出・提供・報酬の有無、想定する検証条件や掲載先も分かる範囲で記載してください。</li>
            <li>返信を希望する場合は業務用メールアドレスを入力してください。未公開資料や秘密情報は、条件確認前に送らないでください。</li>
          </ul>
        </section>
        <ContactForm
          initialUrl={initialUrl}
          initialCategory={category === 'business' ? 'business' : 'correction'}
        />
      </article>
      <WikiFooter />
    </main>
  );
}
