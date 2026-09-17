import application from '../dist/server/index.js';

const staticFiles = new Set([
  '/ads.txt',
  '/favicon.svg',
  '/robots.txt',
  '/sitemap.xml',
]);

const worker = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/_next/static/') || staticFiles.has(pathname)) {
      return env.ASSETS.fetch(request);
    }

    return application.fetch(request, env, context);
  },
};

export default worker;
