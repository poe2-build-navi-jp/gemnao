const xAccount = (process.env.NEXT_PUBLIC_X_ACCOUNT || '').replace(/^@/, '');

export const siteConfig = {
  name: 'ゲムなお',
  description:
    'ゲムなおは、オカピ研究所が運営する日本語のPCゲーム・Discord・Windowsのトラブル解決サイトです。症状別の確認手順、設定画面、結果に応じた次の対処を案内します。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev',
  operatorName: 'オカピ研究所',
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    'okapi.researchinstitute@gmail.com',
  // X (Twitter) handle without "@". Empty until the site has an account.
  xAccount: /^\w{1,15}$/.test(xAccount) ? xAccount : '',
};
