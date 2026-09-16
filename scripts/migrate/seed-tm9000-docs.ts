/**
 * seed-tm9000-docs.ts — creates 3 `support-document` entries (productName:
 * 'TM-9000', docType: 'manual') from the links/text previously hardcoded in
 * tmeeting.com/src/components/documentation/Tm9000Content.tsx. Idempotent
 * (dedupes by slug). Run with the Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-tm9000-docs.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

const DOCS = [
  {
    slug: 'tm-9000-anvandarhandbok',
    title: 'Användarhandbok',
    description: 'Fullständig användarhandbok för TM-9000.',
    externalUrl:
      'https://docs.google.com/document/d/e/2PACX-1vTJxdtf4Mq3TKBGW8mjYrPc9vTIlO7r1ApDGoWUoCxoYcNw8YWIYHmTtUAv8OGmxd0nFcSDioaqnz4G/pub',
    displayOrder: 1,
  },
  {
    slug: 'tm-9000-felsokning',
    title: 'Felsökning',
    description: 'Felsökningsguide för TM-9000.',
    externalUrl:
      'https://docs.google.com/document/d/e/2PACX-1vQR7Sz99tzSGei-OdOahWMdVLgvoKLKzg54stuoyFMr-IUwNAwhnG4jncslV7s7VjiQ_9RivvWPV21a/pub',
    displayOrder: 2,
  },
  {
    slug: 'tm-9000-tillbehor',
    title: 'Tillbehör',
    description: 'Information om tillbehör för TM-9000.',
    externalUrl:
      'https://docs.google.com/document/d/e/2PACX-1vS_yVqRuVfqBYO0rdYJFqhfmay3zX4HL-AJXnYHm5qpHa-YeWDvd56QpQY9CEnnsZ-m1sX670_VjOPu/pub',
    displayOrder: 3,
  },
];

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    for (const d of DOCS) {
      const existing = await app.documents('api::support-document.support-document').findMany({
        filters: { slug: d.slug },
      });
      if (existing.length) {
        console.log(`  [skip] support-document:${d.slug} (already exists)`);
        continue;
      }
      await app.documents('api::support-document.support-document').create({
        data: {
          title: d.title,
          slug: d.slug,
          docType: 'manual',
          description: d.description,
          externalUrl: d.externalUrl,
          productName: 'TM-9000',
          displayOrder: d.displayOrder,
          locale: 'sv',
        },
        status: 'published',
      });
      console.log(`  [ok] support-document:${d.slug}`);
    }
    console.log('\nTM-9000 docs seed complete.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
