import { writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const distDir = join(rootDir, 'dist');

const fallbackSiteUrl = 'https://fstates.vercel.app';
const siteEnv = process.env.VITE_SITE_URL;
const apiEnv = process.env.VITE_API_BASE_URL;
const siteUrl = (siteEnv || fallbackSiteUrl).replace(/\/$/, '');
const apiUrl = apiEnv ? apiEnv.replace(/\/$/, '') : '';

const staticRoutes = ['/', '/cart', '/checkout', '/auth', '/account', '/account/orders', '/admin'];

const nowIso = new Date().toISOString();

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

async function fetchDynamicProductRoutes() {
  if (!apiUrl) return [];
  try {
    const response = await fetch(`${apiUrl}/products`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      console.warn(`Skipping product routes: received ${response.status} from ${apiUrl}/products`);
      return [];
    }
    const payload = await response.json();
    const productList = Array.isArray(payload) ? payload : payload?.products;
    if (!Array.isArray(productList)) {
      return [];
    }
    return productList
      .map((product) => product?.id || product?._id || product?.slug)
      .filter(Boolean)
      .map((id) => `/products/${id}`);
  } catch (error) {
    console.warn(`Skipping product routes: ${(error && error.message) || error}`);
    return [];
  }
}

function buildSitemapXml(routes) {
  const urlEntries = routes
    .map((route) => {
      const loc = `${siteUrl}${route}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(nowIso)}</lastmod>\n  </url>`;
    })
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urlEntries}\n` +
    `</urlset>`
  );
}

async function buildRobotsTxt() {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /account',
    'Disallow: /account/orders',
    'Disallow: /checkout',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ''
  ];
  return lines.join('\n');
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const dynamicRoutes = await fetchDynamicProductRoutes();
  const uniqueRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

  const sitemapXml = buildSitemapXml(uniqueRoutes);
  const robotsTxt = await buildRobotsTxt();

  await Promise.all([
    writeFile(join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8'),
    writeFile(join(publicDir, 'robots.txt'), robotsTxt, 'utf8')
  ]);

  try {
    await access(distDir);
    await Promise.all([
      writeFile(join(distDir, 'sitemap.xml'), sitemapXml, 'utf8'),
      writeFile(join(distDir, 'robots.txt'), robotsTxt, 'utf8')
    ]);
    console.log('✓ Also wrote sitemap.xml and robots.txt to dist/');
  } catch {
    // dist not present in dev; ignore
  }

  console.log(`Generated sitemap with ${uniqueRoutes.length} URLs and robots.txt at ${publicDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
