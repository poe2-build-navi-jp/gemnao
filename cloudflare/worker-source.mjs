import application from '../dist/server/index.js';

const staticFiles = new Set([
  '/ads.txt',
  '/favicon.svg',
  '/gemnao-logo.png',
  '/robots.txt',
  '/sitemap.xml',
  '/image-sitemap.xml',
]);

const worker = {
  async fetch(request, env, context) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/_next/static/') || pathname.startsWith('/images/') || staticFiles.has(pathname)) {
      return env.ASSETS.fetch(request);
    }

    const response = await application.fetch(request, env, context);
    const locale = pathname.match(/^\/(en|zh|es)(?:\/|$)/)?.[1];
    if (locale && response.headers.get('content-type')?.includes('text/html')) {
      return new HTMLRewriter()
        .on('html', {
          element(element) {
            element.setAttribute('lang', locale === 'zh' ? 'zh-CN' : locale);
          },
        })
        .transform(response);
    }
    return response;
  },
};

export default worker;
