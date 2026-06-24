/**
 * seed-contact-page.ts — populates the Contact Page single-type (sv) from i18n content.
 * Idempotent (updates if already present).
 * Run with Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-contact-page.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

async function main() {
  const app = await createStrapi(await compileStrapi()).load();

  try {
    const existing = await app.documents('api::contact-page.contact-page').findFirst({ locale: 'sv' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      heading: 'Kontakta vårt supportteam för hjälp.',
      subtitle: 'Oavsett om du har en fråga, behöver teknisk hjälp eller bara vill ha lite vägledning, finns vårt supportteam här för att hjälpa dig.',
      addressTitle: 'Vår adress',
      addressContent: 'Amiralsgatan 20, Malmö, Sverige',
      emailTitle: 'Mejla oss',
      emailContent: 'mail@tmeeting.se',
      phoneTitle: 'Ring oss',
      phoneContent: '+46 (0)40 661 41 80',
    };

    if (existing) {
      await app.documents('api::contact-page.contact-page').update({
        documentId: existing.documentId,
        locale: 'sv',
        data,
        status: 'published',
      });
      console.log('[seed-contact-page] Updated existing Contact Page entry.');
    } else {
      await app.documents('api::contact-page.contact-page').create({ data, status: 'published' });
      console.log('[seed-contact-page] Created new Contact Page entry.');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error('[seed-contact-page] Error:', err);
  process.exit(1);
});
