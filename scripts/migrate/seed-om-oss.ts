/**
 * seed-om-oss.ts — populates the Om Oss single-type (sv) from i18n content.
 * Idempotent (updates if already present).
 * Run with Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-om-oss.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

async function main() {
  const app = await createStrapi(await compileStrapi()).load();

  try {
    const existing = await app.documents('api::om-oss.om-oss').findFirst({ locale: 'sv' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      heroH1: 'Varför T-Meeting?',
      heroLead: 'Vi tror på ett socialt hållbart samhälle där jämställdhet och mångfald råder. Vi stärker människor att delta i samhället och använda sina förmågor för att leva ett rikare liv.',
      kundfokusH2: 'Kundfokus – Långsiktighet – Innovation',
      kundfokusBody: 'T-Meetings vision är att överbrygga kommunikationsgap så att alla kan delta – Complete Communication. T-Meetings mission är att erbjuda tillgängliga och säkra ende-to-ende kommunikationslösningar för alla, individer, grupper samt organisationer – såväl på plats som på distans. Företaget har idag en unik produktportfölj som möjliggör för även dövblinda, döva och hörselskadade att delta i välfärdssamhället i alla skeden av livet. Detta innefattar även en egenutvecklad AI/ML-lösning framtagen med personer med hörselnedsättning och talsvårigheter i fokus.',
      innovationH2: 'Innovation',
      innovationIntro: 'Vi är en snabb och innovativ aktör i människans tjänst och utformar lösningar som ingen har sett tidigare. Vi är därför väl rustade för utmaningar i tillgänglig digitalisering. Vi lyckas eftersom vi vet hur man gör detta.',
      innovationItems: [
        { text: 'Svensk kvalitet och europeisk utveckling för säkerhet och integritet.' },
        { text: 'Över 20 års erfarenhet inom elektronisk kommunikation och tillgänglighetslösningar.' },
        { text: 'Vi samarbetar med andra organisationer för att göra världen till en bättre plats.' },
        { text: 'Vi arbetar i nära samarbete med våra användare oavsett funktionsvariation.' },
      ],
      innovationClosing: 'Vår teknik bygger på öppna standarder och fungerar i hela världen. När en standard saknas, sätter vi den.',
      historiaH2: 'T-Meetings historia',
      historiaBody: 'Grundarna började som tolk. För att klara fler uppdrag började de att utveckla videotelefoni. De insåg sedan att detta kunde vara något för döva. "Det har alltid känts naturligt för oss att döva ska ha samma rättigheter som hörande. Därför har T-Meetings videotelefonsvarare alltid haft riktiga telefonnummer. Detta gör att vår teknik heter RingDirekt. Hörande kan på så sätt använda en vanlig telefon för att ringa eller bli uppringda av en person med hörselnedsättning som använder vår teknik." T-Meeting var också först med automatisk GPS-positionering av samtal. Med våra senaste innovationer inom AI-talsyntes och automatisk transkribering har vi nu kommunikationsteknik som efterfrågas av alla. T-Meetings produktkatalog är idag omfattande och tillsammans kan vi uppnå målen kring digitalisering och välfärd. Välkomna att följa med oss på innovationsresan!',
      medarbetareH2: 'Våra medarbetare',
      medarbetareBody: 'T-Meeting har sitt säte i Malmö. All kod utvecklas internt, inklusive TERA och dess AI. Våra medarbetare har mångårig erfarenhet av plattforms- och produktutveckling både inom och utanför Sverige. Vår kunskapsbas består av ett femtiotal medarbetare, bland vilka finns doktorander inom systemutveckling och programmering. Engagemanget är stort och produkterna omhändertas som våra egna barn. Vi lyssnar på våra användare och bygger det de önskar.',
      jobbaH2: 'Jobba hos oss?',
      jobbaBody: 'Vill du arbeta med problemlösning och teknik? Är du driven och engagerad? Känner du för att arbeta på en inspirerande arbetsplats där du hjälper människor i deras vardag genom de lösningar du är med och utvecklar? Då kan T-Meeting vara arbetsplatsen för dig.',
      jobbaContactText: 'Skicka ett intresseanmälan med ditt fullständiga CV till',
      jobbaEmail: 'mail@tmeeting.se',
    };

    if (existing) {
      await app.documents('api::om-oss.om-oss').update({
        documentId: existing.documentId,
        locale: 'sv',
        data,
        status: 'published',
      });
      console.log('[seed-om-oss] Updated existing Om Oss entry.');
    } else {
      await app.documents('api::om-oss.om-oss').create({ data, status: 'published' });
      console.log('[seed-om-oss] Created new Om Oss entry.');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error('[seed-om-oss] Error:', err);
  process.exit(1);
});
