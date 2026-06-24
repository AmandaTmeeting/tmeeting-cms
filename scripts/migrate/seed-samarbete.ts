/**
 * seed-samarbete.ts — populates the Samarbete single-type (sv) from i18n content.
 * Idempotent (updates if already present).
 * Run with Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-samarbete.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

async function main() {
  const app = await createStrapi(await compileStrapi()).load();

  try {
    const existing = await app.documents('api::samarbete.samarbete').findFirst({ locale: 'sv' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      heroH1: 'Samarbete',
      heroIntro1: 'När alla ska inkluderas måste alla kunna välja tillgänglighet och hänga med i kommunikationen. Vi har genom åren byggt en solid produktfamilj och går gärna in i större projekt som partners. Vi driver också utvecklingen framåt själva, med vår vision om Komplett Kommunikation som ledstjärna.',
      heroIntro2: 'Vi erbjuder tillgängliga och säkra lösningar för telefoni, fjärrmöten, möten på plats och tolkning. Vi bryr oss om hela kommunikationskedjan, därför är tillgänglighet avgörande. Att kunna märka när någon försöker nå dig, eller att kunna kontakta vem som helst med den utrustning som finns till hands, är nyckeln. Detta kräver öppna standarder och kunskap om människor. Där kommer vi in.',
      heroContactLink: 'Kontakta oss gärna när ett samarbete med oss låter lockande.',
      projektH2: 'Exempel på tidigare projekt',
      projektItems: [
        { text: 'Voxeyes: Videobesök på Tudorkliniken' },
        { text: 'PTS Innovations tävling: TERA Nästa generation' },
        { text: 'PTS Innovations tävling: Fritt Fram' },
        { text: 'PTS Innovations tävling: T-Möte för utbildning och arbete' },
      ],
      produktvisningarH2: 'Produktvisningar och föreläsningar',
      produktvisningarBody: 'Vi kommer gärna och visar våra produkter eller föreläser om våra erfarenheter. Vi publicerar information om detta och andra nyheter primärt på Facebook – följ oss där för att hålla dig uppdaterad.',
      konferenserH2: 'Våra konferenser',
      konferenserBody: 'Vi har arrangerat konferenser sedan 2015. Sedan 2018 har detta skett i samarbete med Lidol. Från att ha varit rena T-Möteskonferenser gick vi sedan över till att sponsra en allmän konferens om Komplett Kommunikation under en dag. Vid sidan av detta hålls en T-Mötesdag för våra användare och andra intresserade av våra produkter.',
      socialaMedierH2: 'Sociala medier',
      socialaMedierBody: 'Vi finns på flera sociala medieplattformar och det är också våra primära kanaler för nyheter om våra produkter och tjänster samt olika evenemang. Sociala medier är också kanaler som vi använder för att delta i och driva samhällsutvecklingen.',
    };

    if (existing) {
      await app.documents('api::samarbete.samarbete').update({
        documentId: existing.documentId,
        locale: 'sv',
        data,
        status: 'published',
      });
      console.log('[seed-samarbete] Updated existing Samarbete entry.');
    } else {
      await app.documents('api::samarbete.samarbete').create({ data, status: 'published' });
      console.log('[seed-samarbete] Created new Samarbete entry.');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error('[seed-samarbete] Error:', err);
  process.exit(1);
});
