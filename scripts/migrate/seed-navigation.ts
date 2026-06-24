/**
 * seed-navigation.ts — populates the Navigation single-type (sv) from the
 * menu structure that previously lived in navbar-data.ts + i18n.
 * Idempotent (updates if present). Run with the Strapi HTTP server STOPPED.
 *   npx tsx scripts/migrate/seed-navigation.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

const items = [
  {
    label: 'Nyheter',
    href: '/nyheter',
    children: [],
  },
  {
    label: 'Produkter',
    href: null,
    children: [
      { label: 'TERA', href: '/produkter/tera', openInNewTab: false },
      { label: 'TM', href: '/produkter/tm', openInNewTab: false },
      { label: 'TM-PC Flerpart', href: '/produkter/tm-pc-flerpart', openInNewTab: false },
      { label: 'TM-Alert', href: '/produkter/tm-alert', openInNewTab: false },
      { label: 'TM-NO', href: '/produkter/tm-no', openInNewTab: false },
      { label: 'TERA-NO', href: '/produkter/tera-no', openInNewTab: false },
    ],
  },
  {
    label: 'Tjänster',
    href: null,
    children: [
      { label: 'RingDirekt SE', href: '/tjanster/ringdirekt-se', openInNewTab: false },
      { label: 'RingDirekte (NO)', href: '/tjanster/ringdirekte', openInNewTab: false },
      { label: 'Distanstolken', href: '/tjanster/distanstolken', openInNewTab: false },
      { label: 'Tillgänglig kundtjänst', href: '/tjanster/tillganglig-kundtjanst', openInNewTab: false },
    ],
  },
  {
    label: 'Samarbete',
    href: '/samarbete',
    children: [],
  },
  {
    label: 'Om oss',
    href: null,
    children: [
      { label: 'Om T-Meeting', href: '/om-oss', openInNewTab: false },
      { label: 'Vision', href: '/om-oss/vision', openInNewTab: false },
    ],
  },
  {
    label: 'Support',
    href: null,
    children: [
      { label: 'Kontakta support', href: '/support/kontakta-support', openInNewTab: false },
      { label: 'Driftstatus', href: '/support/driftstatus', openInNewTab: false },
      { label: 'Manualer', href: '/support/manualer', openInNewTab: false },
      { label: 'Nedladdning', href: '/support/nedladdning', openInNewTab: false },
    ],
  },
];

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const existing = await app.documents('api::navigation.navigation').findFirst({ locale: 'sv' });
    const data = { items, locale: 'sv' };
    if (existing) {
      await app.documents('api::navigation.navigation').update({
        documentId: existing.documentId,
        locale: 'sv',
        data,
        status: 'published',
      });
      console.log('Navigation updated (sv).');
    } else {
      await app.documents('api::navigation.navigation').create({ data, status: 'published' });
      console.log('Navigation created (sv).');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
