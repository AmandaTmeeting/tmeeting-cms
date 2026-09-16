/**
 * seed-produkter-page.ts — creates the singleton `produkter-page` entry
 * (hero + Privat/Företag chooser cards) from the current i18n text in
 * tmeeting.com/src/components/products/ProductSegmentChooser.tsx. No images
 * are seeded (left null -> StrapiImage renders its on-brand placeholder,
 * ready for a client to upload real photos in the CMS). Idempotent (skips if
 * an entry already exists). Run with the Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-produkter-page.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const existing = await app.documents('api::produkter-page.produkter-page').findMany({});
    if (existing.length) {
      console.log('  [skip] produkter-page (already exists)');
      return;
    }
    await app.documents('api::produkter-page.produkter-page').create({
      data: {
        heroH1: 'Produkter',
        heroLead: 'Välj om du letar efter produkter för privat bruk eller för företag.',
        privatCard: {
          title: 'Privat',
          description: 'Produkter för privatpersoner och pensionärer.',
        },
        foretagCard: {
          title: 'Företag',
          description: 'Lösningar för arbetsplatsen och organisationer.',
        },
        locale: 'sv',
      },
      status: 'published',
    });
    console.log('  [ok] produkter-page created');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
