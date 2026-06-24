/**
 * crawl.ts — Phase 1 content extraction from the old AirSquare site (tmeeting.se).
 *
 * Fetches the live sitemap, downloads every page, extracts structured content
 * (title, meta, body blocks, images, embeds, downloads) and writes:
 *   scripts/migrate/raw/<slug>.html        — raw HTML (audit trail)
 *   scripts/migrate/extracted/<type>/<slug>.json — structured, reviewable
 *   scripts/migrate/_index.json            — manifest of everything found
 *
 * Read-only against the network; writes only inside scripts/migrate/. Run:
 *   npx tsx scripts/migrate/crawl.ts
 */
import { parseDocument } from 'htmlparser2';
import { findOne, findAll, textContent } from 'domutils';
import type { Element } from 'domhandler';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectBlocks } from './htmlToBlocks';

const SITEMAP = 'https://www.tmeeting.se/sitemap.xml';
const OUT = join(process.cwd(), 'scripts', 'migrate');

type PageType = 'news-article' | 'product' | 'service' | 'support' | 'page';

interface Extracted {
  url: string;
  type: PageType;
  slug: string;
  pathSegments: string[];
  locale: 'sv' | 'no';
  title: string;
  ogDescription: string | null;
  ogImage: string | null;
  publishDate: string | null;
  author: string | null;
  heroAssets: string[];
  blocks: unknown[];
  images: { url: string; alt?: string }[];
  embeds: { provider: string; url: string }[];
  downloads: { url: string; label: string }[];
  bodyTextLength: number;
}

function classifyType(segs: string[]): PageType {
  if (segs[0] === 'article') return 'news-article';
  if (segs[0] === 'produkter' || segs[0] === 'product') return 'product';
  if (decodeURIComponent(segs[0] ?? '') === 'tjänster' || segs[0] === 'tjanster') return 'service';
  if (segs[0] === 'support') return 'support';
  return 'page';
}

function slugify(url: string): string {
  const path = new URL(url).pathname.replace(/\/$/, '');
  const last = path.split('/').filter(Boolean).pop() ?? 'home';
  return decodeURIComponent(last)
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'home';
}

function meta(doc: ReturnType<typeof parseDocument>, prop: string): string | null {
  const el = findOne(
    (e) => e.type === 'tag' && e.name === 'meta' && (e.attribs.property === prop || e.attribs.name === prop),
    doc.children,
    true,
  ) as Element | null;
  return el?.attribs?.content ?? null;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'tmeeting-migration/1.0' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

function extract(url: string, html: string): Extracted {
  const doc = parseDocument(html);
  const segs = new URL(url).pathname.split('/').filter(Boolean).map((s) => decodeURIComponent(s));
  const type = classifyType(segs);
  const locale: 'sv' | 'no' = /(-no|ringdirekte)$/.test(slugify(url)) ? 'no' : 'sv';

  const titleEl = findOne((e) => e.type === 'tag' && e.name === 'title', doc.children, true) as Element | null;
  const h1 = findOne((e) => e.type === 'tag' && e.name === 'h1', doc.children, true) as Element | null;
  const title = (meta(doc, 'og:title') || (h1 && textContent(h1)) || (titleEl && textContent(titleEl)) || '').trim();

  // Main content container in AirSquare templates.
  const contentEl = findOne(
    (e) => e.type === 'tag' && (e.attribs.class ?? '').includes('user-defined-content'),
    doc.children,
    true,
  ) as Element | null;

  const { blocks, media, embeds } = contentEl
    ? collectBlocks(contentEl.children)
    : { blocks: [], media: [], embeds: [] };

  // Downloadable files anywhere on the page.
  const downloads = (findAll(
    (e) => e.name === 'a' && /\.(pdf|docx?|xlsx?|zip|apk|ipa)(\?|$)/i.test(e.attribs.href ?? ''),
    doc.children,
  ) as Element[]).map((a) => ({ url: a.attribs.href, label: textContent(a).trim() || a.attribs.href }));

  // Dates/author live in the JSON-LD blob, not in markup.
  const publishDate = html.match(/"datePublished"\s*:\s*"([^"]+)"/)?.[1] ?? null;
  const authorMatch = html.match(/"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/);
  const author = authorMatch?.[1] ?? null;

  // AirSquare serves responsive variants; keep the highest-res (2000w) of each asset.
  const assetSet = new Map<string, string>();
  for (const m of html.matchAll(/managed\/image\/(product|blog|content)\/([A-Za-z0-9-]+?)-\d+w\.webp/g)) {
    const [, kind, id] = m;
    const base = `managed/image/${kind}/${id}`;
    assetSet.set(base, `https://cdn-asset-stl-2.airsquare.com/tmeetingsweden/${base}-2000w.webp`);
  }
  const heroAssets = [...assetSet.values()];

  const bodyTextLength = blocks.reduce((n, b) => {
    const t = JSON.stringify(b).match(/"text":"([^"]*)"/g)?.join('') ?? '';
    return n + t.length;
  }, 0);

  return {
    url,
    type,
    slug: slugify(url),
    pathSegments: segs,
    locale,
    title,
    ogDescription: meta(doc, 'og:description'),
    ogImage: meta(doc, 'og:image'),
    publishDate,
    author,
    heroAssets,
    blocks,
    images: media.map(({ url, alt }) => ({ url, ...(alt ? { alt } : {}) })),
    embeds: embeds.map(({ provider, url }) => ({ provider, url })),
    downloads: dedupe(downloads, (d) => d.url),
    bodyTextLength,
  };
}

function dedupe<T>(arr: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  return arr.filter((x) => (seen.has(key(x)) ? false : (seen.add(key(x)), true)));
}

async function main() {
  const single = process.argv[2]; // optional: crawl one URL for testing
  console.log('Fetching sitemap…');
  const xml = await fetchText(SITEMAP);
  const allUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = single ? [single] : allUrls;
  console.log(`Found ${allUrls.length} URLs; crawling ${urls.length}.`);

  mkdirSync(join(OUT, 'raw'), { recursive: true });
  for (const t of ['news-article', 'product', 'service', 'support', 'page']) {
    mkdirSync(join(OUT, 'extracted', t), { recursive: true });
  }

  const manifest: Omit<Extracted, 'blocks'>[] = [];
  let ok = 0;
  let fail = 0;

  for (const url of urls) {
    try {
      const html = await fetchText(url);
      const data = extract(url, html);
      const fname = `${data.slug}.html`;
      writeFileSync(join(OUT, 'raw', fname), html);
      writeFileSync(join(OUT, 'extracted', data.type, `${data.slug}.json`), JSON.stringify(data, null, 2));
      const { blocks, ...rest } = data;
      manifest.push({ ...rest });
      ok++;
      console.log(`✓ [${data.type}] ${data.slug} — ${data.title.slice(0, 50)} (${data.blocks.length} blocks, ${data.images.length} imgs)`);
    } catch (err) {
      fail++;
      console.warn(`✗ ${url} — ${(err as Error).message}`);
    }
  }

  writeFileSync(join(OUT, '_index.json'), JSON.stringify(manifest, null, 2));
  const byType = manifest.reduce<Record<string, number>>((a, m) => ((a[m.type] = (a[m.type] ?? 0) + 1), a), {});
  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
  console.log('By type:', byType);
  console.log(`Manifest: scripts/migrate/_index.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
