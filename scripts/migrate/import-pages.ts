/**
 * import-pages.ts — imports static pages (om-oss, vision, samarbete) into the
 * generic Page content-type, and the 7 catalogued downloads into Support Documents.
 * Idempotent (dedupes by slug). Run AFTER the Page content-type exists:
 *   npx tsx scripts/migrate/import-pages.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const EXTRACTED = join(process.cwd(), 'scripts', 'migrate', 'extracted');
const MANIFEST = join(process.cwd(), 'scripts', 'migrate', '_index.json');

const PAGES = ['om-oss', 'vision', 'samarbete']; // curated structural pages

function load(type: string, slug: string): any {
  return JSON.parse(readFileSync(join(EXTRACTED, type, `${slug}.json`), 'utf8'));
}

function ensureBody(p: any): any[] {
  if (p.blocks?.length) return p.blocks;
  return [{ type: 'paragraph', children: [{ type: 'text', text: p.ogDescription || p.title }] }];
}

async function importPages(strapi: any) {
  console.log('\nImporting pages...');
  for (const slug of PAGES) {
    let p: any;
    try {
      p = load('page', slug);
    } catch {
      console.warn(`  ! no extracted JSON for page:${slug}`);
      continue;
    }
    const existing = await strapi.documents('api::page.page').findMany({ filters: { slug } });
    if (existing.length) {
      console.log(`  [skip] page:${slug}`);
      continue;
    }
    await strapi.documents('api::page.page').create({
      data: {
        title: p.title || slug,
        slug,
        body: ensureBody(p),
        seoDescription: p.ogDescription ?? undefined,
        locale: 'sv',
      },
      status: 'published',
    });
    console.log(`  [ok] page:${slug} (${ensureBody(p).length} blocks)`);
  }
}

function slugifyLabel(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'download';
}

async function importDownloads(strapi: any) {
  console.log('\nImporting support downloads...');
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const downloads = manifest.flatMap((p: any) => p.downloads ?? []);
  const seen = new Set<string>();
  for (const d of downloads) {
    if (seen.has(d.url)) continue;
    seen.add(d.url);
    const slug = slugifyLabel(d.label);
    const existing = await strapi.documents('api::support-document.support-document').findMany({ filters: { slug } });
    if (existing.length) {
      console.log(`  [skip] download:${slug}`);
      continue;
    }
    const docType = /lathund|felsok|manual|guide/i.test(d.label) ? 'manual' : 'download';
    await strapi.documents('api::support-document.support-document').create({
      data: {
        title: d.label.replace(/\s+/g, ' ').trim().slice(0, 120),
        slug,
        docType,
        description: undefined,
        externalUrl: d.url,
        displayOrder: 99,
        locale: 'sv',
      },
      status: 'published',
    });
    console.log(`  [ok] download:${slug} (${docType})`);
  }
}

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    await importPages(app);
    await importDownloads(app);
    console.log('\nPages + downloads import complete.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
