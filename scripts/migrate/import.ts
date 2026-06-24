/**
 * import.ts — Phase 1 import of crawled tmeeting.se content into Strapi (sv locale).
 *
 * - Uploads remote images into the Strapi Media Library (cached by URL).
 * - Creates the 43 news articles (title, excerpt, body blocks, cover, date, readTime).
 * - Attaches hero images to existing seeded products/services.
 * Idempotent: dedupes articles by slug, skips already-uploaded media, only sets
 * a product/service heroImage when missing.
 *
 *   npx tsx scripts/migrate/import.ts            # full run
 *   npx tsx scripts/migrate/import.ts --limit 2  # import only 2 articles (smoke test)
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const EXTRACTED = join(process.cwd(), 'scripts', 'migrate', 'extracted');
const TMP = join(tmpdir(), 'tm-media');

const limitArg = process.argv.indexOf('--limit');
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

interface Crawled {
  slug: string;
  title: string;
  ogDescription: string | null;
  ogImage: string | null;
  publishDate: string | null;
  author: string | null;
  heroAssets: string[];
  blocks: any[];
  bodyTextLength: number;
}

const mediaCache = new Map<string, any>();

function mimeFromUrl(url: string): string {
  if (/\.webp/i.test(url)) return 'image/webp';
  if (/\.png/i.test(url)) return 'image/png';
  if (/\.(jpe?g)/i.test(url)) return 'image/jpeg';
  if (/\.gif/i.test(url)) return 'image/gif';
  return 'application/octet-stream';
}

async function uploadImage(strapi: any, url: string | null): Promise<any | null> {
  if (!url) return null;
  if (mediaCache.has(url)) return mediaCache.get(url);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'tmeeting-migration/1.0' } });
    if (!res.ok) throw new Error(`${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const name = decodeURIComponent(url.split('/').pop()!.split('?')[0]);
    const filepath = join(TMP, name);
    writeFileSync(filepath, buf);
    const [file] = await strapi.plugin('upload').service('upload').upload({
      data: {},
      files: { filepath, originalFilename: name, mimetype: mimeFromUrl(url), size: buf.length },
    });
    mediaCache.set(url, file);
    console.log(`    ↑ media: ${name} (#${file.id})`);
    return file;
  } catch (err) {
    console.warn(`    ! media failed ${url} — ${(err as Error).message}`);
    mediaCache.set(url, null);
    return null;
  }
}

function readType(type: string): Crawled[] {
  const dir = join(EXTRACTED, type);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as Crawled);
}

function estimateReadTime(textLen: number): string {
  const words = Math.max(1, Math.round(textLen / 6));
  return `${Math.max(1, Math.round(words / 200))} min läsning`;
}

function ensureBody(a: Crawled): any[] {
  if (a.blocks?.length) return a.blocks;
  const text = a.ogDescription || a.title;
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

async function importArticles(strapi: any) {
  console.log('\nImporting news articles...');
  const articles = readType('news-article').sort((x, y) => (x.publishDate ?? '').localeCompare(y.publishDate ?? ''));
  let created = 0;
  let skipped = 0;
  for (const a of articles.slice(0, LIMIT)) {
    const existing = await strapi.documents('api::news-article.news-article').findMany({ filters: { slug: a.slug } });
    if (existing.length) {
      skipped++;
      continue;
    }
    const cover = await uploadImage(strapi, a.ogImage);
    await strapi.documents('api::news-article.news-article').create({
      data: {
        title: a.title || a.slug,
        slug: a.slug,
        excerpt: a.ogDescription ?? undefined,
        body: ensureBody(a),
        tag: 'nyheter',
        author: a.author || 'T-Meeting',
        readTime: estimateReadTime(a.bodyTextLength),
        featured: false,
        publishDate: a.publishDate ? a.publishDate.slice(0, 10) : undefined,
        coverImage: cover ? cover.id : undefined,
        locale: 'sv',
      },
      status: 'published',
    });
    created++;
    console.log(`  [ok] article: ${a.slug}`);
  }
  console.log(`Articles — created ${created}, skipped ${skipped}.`);
}

async function attachHeroImages(strapi: any, type: 'product' | 'service', uid: string) {
  console.log(`\nAttaching ${type} hero images...`);
  const crawled = readType(type);
  for (const c of crawled) {
    if (!c.heroAssets?.length) continue;
    const [doc] = await strapi.documents(uid).findMany({ filters: { slug: c.slug }, populate: ['heroImage'] });
    if (!doc) continue; // not a canonical product/service (e.g. -no variant, listing page)
    if (doc.heroImage) {
      console.log(`  [skip] ${type}:${c.slug} already has hero`);
      continue;
    }
    const img = await uploadImage(strapi, c.heroAssets[0]);
    if (!img) continue;
    await strapi.documents(uid).update({ documentId: doc.documentId, data: { heroImage: img.id }, status: 'published' });
    console.log(`  [ok] ${type}:${c.slug} hero set`);
  }
}

async function main() {
  mkdirSync(TMP, { recursive: true });
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    await importArticles(app);
    await attachHeroImages(app, 'product', 'api::product.product');
    await attachHeroImages(app, 'service', 'api::service.service');
    console.log(`\nImport complete. Media uploaded: ${[...mediaCache.values()].filter(Boolean).length}.`);
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
