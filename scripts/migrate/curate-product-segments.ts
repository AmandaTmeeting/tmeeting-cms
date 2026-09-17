/**
 * curate-product-segments.ts — applies the client's curation of the two product
 * listing pages, and fills the new per-segment copy on the Produkter Page.
 *
 * Requested by the client:
 *   PRIVAT  -> TERA, TM-produktfamilj, TM-Alert
 *   FORETAG -> five categories she will create herself in the admin
 *
 * So: tm-alert moves FORETAG -> PRIVAT, and the two Norwegian variants get
 * their segment cleared. Clearing (rather than unpublishing or deleting) keeps
 * every entry and all its content intact and is one click to undo in the admin.
 * Note their detail pages were already unreachable — middleware.ts strips a
 * trailing `-no` from /produkter/* — so nothing a visitor can reach is lost.
 *
 * This mirrors, for local dev, the edits made in the Strapi Cloud admin.
 * Run with the Strapi HTTP server STOPPED (SQLite is single-writer):
 *   npx tsx scripts/migrate/curate-product-segments.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

const SEGMENT_BY_SLUG: Record<string, 'PRIVAT' | 'FORETAG' | 'BOTH' | null> = {
  tera: 'PRIVAT',
  tm: 'PRIVAT',
  'tm-alert': 'PRIVAT',
  'tm-no': null,
  'tera-no': null,
};

const PRODUKTER_PAGE_COPY = {
  privatH1: 'Produkter för privatpersoner',
  privatLead:
    'Våra kommunikationslösningar för dig som är döv, har en hörselnedsättning, är dövblind eller har talsvårigheter.',
  privatEmptyText: 'Inga produkter är publicerade här ännu. Kom gärna tillbaka snart.',
  foretagH1: 'Produkter för företag',
  foretagLead: 'Lösningar för arbetsplatsen, myndigheter och organisationer.',
  foretagEmptyText:
    'Våra företagslösningar publiceras här inom kort. Kontakta oss gärna under tiden så berättar vi mer.',
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
      console.log(`  [ok] product:${slug} -> segment=${segment ?? 'null (hidden)'} (${existing.length} row(s))`);
    }

    const page = await app.documents('api::produkter-page.produkter-page').findFirst();
    if (!page) {
      console.log('  [skip] produkter-page (not found — run seed-produkter-page.ts first)');
    } else {
      await app.documents('api::produkter-page.produkter-page').update({
        documentId: page.documentId,
        data: PRODUKTER_PAGE_COPY,
      });
      await app.documents('api::produkter-page.produkter-page').publish({
        documentId: page.documentId,
      });
      console.log('  [ok] produkter-page -> listing headings, intros and empty-state text');
    }

    console.log('\nProduct segment curation complete.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
