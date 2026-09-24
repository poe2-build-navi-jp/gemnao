import application from '../dist/server/index.js';

const staticFiles = new Set([
  '/ads.txt',
  '/favicon.svg',
  '/robots.txt',
  '/sitemap.xml',
]);

const worker = {
  async fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/feedback') {
      const count = Number(new URL(request.headers.get('Referer') || 'https://test/').searchParams.get('qa') || 0);
      if (request.method !== 'GET') return Response.json({error:'Preview QA: writes disabled'}, {status:503});
      const topic = new URL(request.url).searchParams.get('game')?.startsWith('discord-') ? 'discord-connection' : 'display';
      return Response.json({rows: count ? [{topic, resolved:count, struggling:0}] : [], methods:count ? [{methodId:'step-1',methodLabel:'QA fixture',responses:count === 10 ? 5 : count}, ...(count === 10 ? [{methodId:'step-2',methodLabel:'QA fixture',responses:5}] : [])] : []});
    }

    if (pathname.startsWith('/_next/static/') || staticFiles.has(pathname)) {
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
