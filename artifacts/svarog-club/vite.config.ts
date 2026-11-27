import fs from 'node:fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

function staticSearchFiles(): Plugin {
  const indexable = process.env.SITE_NOINDEX !== '1';
  const rawUrl = process.env.SITE_URL?.trim();
  let canonical: string | undefined;

  if (indexable && rawUrl) {
    const url = new URL(rawUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) {
      throw new Error('SITE_URL must be the public homepage URL without credentials, query or fragment.');
    }
    canonical = url.href;
  }

  return {
    name: 'static-search-files',
    apply: 'build',
    transformIndexHtml(html) {
      if (!indexable) return html.replace('index, follow, max-image-preview:large', 'noindex, nofollow');
      if (!canonical) return html;

      return {
        html,
        tags: [{ tag: 'link', attrs: { rel: 'canonical', href: canonical }, injectTo: 'head' }],
      };
    },
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, 'dist/public');
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const home = fs.readFileSync(indexPath, 'utf8');
      const fallback = home
        .replace(/<link rel="canonical"[^>]*>/, '')
        .replace('index, follow, max-image-preview:large', 'noindex, nofollow');
      fs.writeFileSync(path.join(outDir, '404.html'), fallback);

      if (canonical) {
        const sitemapUrl = new URL('sitemap.xml', canonical.endsWith('/') ? canonical : canonical + '/');
        const location = canonical.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        fs.writeFileSync(path.join(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${location}</loc></url></urlset>\n`,
        );
        if (new URL(canonical).pathname === '/') {
          fs.appendFileSync(path.join(outDir, 'robots.txt'), `\nSitemap: ${sitemapUrl.href}\n`);
        }
      }
    },
  };
}

const rawPort = process.env.PORT ?? '3000';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    staticSearchFiles(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    target: 'es2020',
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});