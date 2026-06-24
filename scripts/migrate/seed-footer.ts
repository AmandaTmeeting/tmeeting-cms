/**
 * seed-footer.ts — populates the Footer single-type (sv) from the content that
 * previously lived in the frontend's footer-data.ts + i18n. Idempotent (updates
 * if present). Run with the Strapi HTTP server STOPPED.
 *   npx tsx scripts/migrate/seed-footer.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

const columns = [
  {
    title: 'Företag',
    links: [
      { label: 'Om oss', href: '/om-oss' },
      { label: 'Vision', href: '/om-oss/vision' },
      { label: 'Samarbete', href: '/samarbete' },
      { label: 'Kontakta oss', href: '/support/kontakta-support' },
    ],
  },
  {
    title: 'Produkter',
    links: [
      { label: 'TERA', href: '/produkter/tera' },
      { label: 'TM', href: '/produkter/tm' },
      { label: 'TM-PC Flerpart', href: '/produkter/tm-pc-flerpart' },
      { label: 'TM-ALERT', href: '/produkter/tm-alert' },
    ],
  },
  {
    title: 'Tjänster',
    links: [
      { label: 'Ring Direkte (SE)', href: '/tjanster/ringdirekt-se' },
      { label: 'Distanstolken', href: '/tjanster/distanstolken' },
      { label: 'Tillgänglig kundtjänst', href: '/tjanster/tillganglig-kundtjanst' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Kontakta support', href: '/support/kontakta-support' },
      { label: 'Driftstatus', href: '/support/driftstatus' },
      { label: 'Manualer', href: '/support/manualer' },
      { label: 'Nedladdningar', href: '/support/nedladdning' },
    ],
  },
];

const description =
  'På T-Meeting är vi dedikerade till tillgänglig och inkluderande kommunikation. Våra lösningar kombinerar video, ljud och text i realtid för att stödja personer med olika kommunikationsbehov, inklusive de som är döva, hörselskadade eller har talsvårigheter.';

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const existing = await app.documents('api::footer.footer').findFirst({ locale: 'sv' });
    const data = { description, columns, locale: 'sv' };
    if (existing) {
      await app.documents('api::footer.footer').update({ documentId: existing.documentId, locale: 'sv', data, status: 'published' });
      console.log('Footer updated (sv).');
    } else {
      await app.documents('api::footer.footer').create({ data, status: 'published' });
      console.log('Footer created (sv).');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
