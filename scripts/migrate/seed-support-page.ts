/**
 * seed-support-page.ts — populates the Support Page single-type (sv) from i18n content.
 * Idempotent (updates if already present).
 * Run with Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-support-page.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

async function main() {
  const app = await createStrapi(await compileStrapi()).load();

  try {
    const existing = await app.documents('api::support-page.support-page').findFirst({ locale: 'sv' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      heroH1: 'Support',
      heroBody: 'Vi finns här för att hjälpa dig med T-Meetings produkter och tjänster. Välj ett av alternativen nedan.',
      heroBtnLabel: 'Kontakta oss',
      serviceCards: [
        { title: 'Kontakta supporten', description: 'Har du frågor? Kontakta oss via e-post eller telefon.', btnLabel: 'Kontakta oss' },
        { title: 'Driftstatus', description: 'Kontrollera aktuell status för T-Meetings tjänster.', btnLabel: 'Visa status' },
        { title: 'Manualer', description: 'Hitta manualer och guider för T-Meetings produkter.', btnLabel: 'Visa manualer' },
        { title: 'Nedladdningar', description: 'Ladda ner programvara och uppdateringar.', btnLabel: 'Ladda ner' },
      ],
    };

    if (existing) {
      await app.documents('api::support-page.support-page').update({
        documentId: existing.documentId,
        locale: 'sv',
        data,
        status: 'published',
      });
      console.log('[seed-support-page] Updated existing Support Page entry.');
    } else {
      await app.documents('api::support-page.support-page').create({ data, status: 'published' });
      console.log('[seed-support-page] Created new Support Page entry.');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error('[seed-support-page] Error:', err);
  process.exit(1);
});
