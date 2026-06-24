/**
 * seed-vision.ts — populates the Vision single-type (sv) from i18n content.
 * Idempotent (updates if already present).
 * Run with Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-vision.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

async function main() {
  const app = await createStrapi(await compileStrapi()).load();

  try {
    const existing = await app.documents('api::vision.vision').findFirst({ locale: 'sv' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      heroH1: 'Kommunikation på lika villkor – för varje individ',
      heroLead: 'När vi utformar med de mest krävande behoven i åtanke skapar vi produkter som gynnar alla. Det handlar inte bara om rättvisa och mänskliga rättigheter, utan också om inkluderande och universell utformning – och det är framtidens tänk. Lika tillgång till kommunikation för alla innebär Komplett Kommunikation, ett koncept som introducerats av grundarna Max och Faruk Tairi.',
      tillganglighetH2: 'Tillgänglighet för alla – individer och organisationer!',
      tillganglighetBody: 'Många fullt hörande tar det för givet att alla offentliga tjänster är lättillgängliga. Men verkligheten ser annorlunda ut. I Sverige finns idag närmare 2 miljoner människor med hörselnedsättning. För många av dem, inklusive döva, har det varit svårt att direkt ringa tjänster som banken, 1177 eller vårdcentralen. Historiskt sett har kommunikationslösningar inom hjälpmedelssektorn främst fokuserat på kommunikation mellan enskilda användare och deras närmaste kontakter. Men vi anser att det inte räcker. Vi strävar efter full jämlikhet. I ett utvecklat välfärdssamhälle bör även myndigheter och företag vara tillgängliga för alla. Vi ser fram emot den dag då en dövblind person kan arbeta i kundtjänst och assistera varje samtal. Med T-Meetings banbrytande teknik är detta redan verklighet idag.',
      digitaliseringH2: 'Vi leder vägen för smart digitalisering i välfärden',
      digitaliseringBody: 'Genom våra senaste framsteg inom AI-talsyntes och automatisk transkribering – TERA – erbjuder vi kommunikationsteknik som gynnar alla. Vår omfattande produktportfölj möjliggör samarbete för att driva innovation inom välfärden. Med funktioner som GPS-positionering, TERA, Real-time Text, Tillgänglig Video, Grupptelefoni, Växelavläsningar och företagsanpassade lösningar positionerar vi oss som en värdefull partner. Vi anser att välfärdsteknik bör integreras sömlöst. Om en kommun till exempel har en videotjänst bör den vara kompatibel med video/bildtelefonerna som regionen tillhandahåller. Den bör även fungera med nationell teckenspråkstolkning. På så sätt tillgodoser vi bäst medborgarnas behov av tillgänglighet och kommunikation.',
    };

    if (existing) {
      await app.documents('api::vision.vision').update({
        documentId: existing.documentId,
        locale: 'sv',
        data,
        status: 'published',
      });
      console.log('[seed-vision] Updated existing Vision entry.');
    } else {
      await app.documents('api::vision.vision').create({ data, status: 'published' });
      console.log('[seed-vision] Created new Vision entry.');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error('[seed-vision] Error:', err);
  process.exit(1);
});
