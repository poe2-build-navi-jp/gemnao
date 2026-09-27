const xAccount = (process.env.NEXT_PUBLIC_X_ACCOUNT || '').replace(/^@/, '');

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gemnao.pages.dev',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  // X (Twitter) handle without "@". Empty until the site has an account.
  xAccount: /^\w{1,15}$/.test(xAccount) ? xAccount : '',
};
