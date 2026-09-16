/**
 * backfill-product-segment.ts — sets the new `segment` field on the 5 existing
 * local product entries (scripts/seed.ts only creates missing rows, it never
 * updates existing ones, so a plain re-seed wouldn't backfill this).
 * Mapping confirmed with the user:
 *   tera, tm, tm-no, tera-no -> PRIVAT
 *   tm-alert                -> FORETAG
 * Run with the Strapi HTTP server STOPPED (SQLite is single-writer):
 *   npx tsx scripts/migrate/backfill-product-segment.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

const SEGMENT_BY_SLUG: Record<string, 'PRIVAT' | 'FORETAG' | 'BOTH'> = {
  tera: 'PRIVAT',
  tm: 'PRIVAT',
  'tm-no': 'PRIVAT',
  'tera-no': 'PRIVAT',
  'tm-alert': 'FORETAG',
};

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    for (const [slug, segment] of Object.entries(SEGMENT_BY_SLUG)) {
      const existing = await app.documents('api::product.product').findMany({ filters: { slug } });
      if (!existing.length) {
        console.log(`  [skip] product:${slug} (not found)`);
        continue;
      }
      for (const entry of existing) {
        await app.documents('api::product.product').update({
          documentId: entry.documentId,
          data: { segment },
          locale: entry.locale,
        });
        // draftAndPublish is enabled — update() only touches the draft, so the
        // change wouldn't reach the public API until explicitly published too.
        await app.documents('api::product.product').publish({
          documentId: entry.documentId,
          locale: entry.locale,
        });
      }
      console.log(`  [ok] product:${slug} -> segment=${segment} (${existing.length} row(s))`);
    }
    console.log('\nProduct segment backfill complete.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
