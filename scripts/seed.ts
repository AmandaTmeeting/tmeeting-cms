import { createStrapi, compileStrapi } from '@strapi/strapi';
import { markdownToBlocks } from './lib/markdownToBlocks';

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const products = [
  {
    name: 'TERA',
    slug: 'tera',
    shortDescription:
      'Realtidstexttelefoni för hörselskadade och döva — TERA gör det möjligt att delta i telefonsamtal via text i realtid.',
    icon: 'ns-shape-20',
    market: 'BOTH',
    displayOrder: 1,
    descriptionMd: `## TERA — Realtidstexttelefoni

TERA är T-Meetings app för realtidstexttelefoni. Appen omvandlar tal till text så att personer med hörselnedsättning eller döva kan delta i telefonsamtal via text i realtid.

TERA uppfyller de krav som ställs på tillgänglig kommunikation och är godkänd som hjälpmedel i Sverige och Norge.

## Vad ingår

- Realtidstext under pågående samtal
- Stöd för vanliga telefonsamtal
- Tillgänglig via mobilapp
- Godkänd som hjälpmedel`,
  },
  {
    name: 'TM',
    slug: 'tm',
    shortDescription:
      'Videotelefonilösning för teckenspråk och text — möjliggör samtal med upp till fem deltagare.',
    icon: 'ns-shape-20',
    market: 'SE',
    displayOrder: 2,
    descriptionMd: `## TM — Videotelefonilösning

TM är T-Meetings videotelefonilösning, speciellt utformad för teckenspråkskommunikation och texttelefoni.

Produkten möjliggör videosamtal med upp till fem deltagare och är tillgänglig för hörselskadade, döva och dövblinda användare.

## Vad ingår

- Videosamtal med upp till fem deltagare
- Stöd för teckenspråk
- Realtidstext
- Dövblinda-anpassning`,
  },
  {
    name: 'TM-PC Flerpart',
    slug: 'tm-pc-flerpart',
    shortDescription:
      'Flerparstelefoni via dator — för gruppmöten med ljud, video och realtidstext.',
    icon: 'ns-shape-20',
    market: 'SE',
    displayOrder: 3,
    descriptionMd: `## TM-PC Flerpart — Gruppmöten med tillgänglighet

TM-PC Flerpart möjliggör gruppmöten via dator med stöd för ljud, video och realtidstext.

Lösningen är anpassad för arbetsplatser och organisationer som behöver tillgänglig kommunikation för fler deltagare.

## Vad ingår

- Gruppmöten via dator
- Ljud, video och realtidstext i kombination
- Anpassad för arbetsplatser och myndigheter`,
  },
  {
    name: 'TM-ALERT',
    slug: 'tm-alert',
    shortDescription:
      'Bärbar larmenhet för hörselskadade — vibrerar och blinkar vid inkommande samtal och notiser.',
    icon: 'ns-shape-20',
    market: 'BOTH',
    displayOrder: 4,
    descriptionMd: `## TM-ALERT — Bärbar notissenhet

TM-ALERT är en bärbar enhet som bärs på handleden. Den vibrerar och blinkar vid inkommande samtal, meddelanden och andra notiser.

Speciellt utformad för döva och hörselskadade personer som inte kan höra vanliga larm eller ringljud.

## Vad ingår

- Vibration och ljusnotiser
- Bärs på handleden
- Koppling till T-Meetings kommunikationssystem
- Lång batteritid`,
  },
  {
    name: 'TM (NO)',
    slug: 'tm-no',
    shortDescription: 'TM-lösningen anpassad för den norska marknaden.',
    icon: 'ns-shape-20',
    market: 'NO',
    displayOrder: 5,
    descriptionMd: `## TM (NO) — For det norske markedet

TM (NO) er den norske varianten av T-Meetings TM-produkt, tilpasset norsk regelverk og det norske hjelpemiddelmarkedet.

Produkten gir tilgang til videokommunikasjon med tegnspråk og tekst for hørselshemmede, døve og døvblinde brukere i Norge.`,
  },
  {
    name: 'TERA (NO)',
    slug: 'tera-no',
    shortDescription: 'TERA anpassad för den norska marknaden.',
    icon: 'ns-shape-20',
    market: 'NO',
    displayOrder: 6,
    descriptionMd: `## TERA (NO) — For det norske markedet

TERA (NO) er den norske varianten av TERA, tilpasset norske krav til tilgjengelig telefoni og godkjent som hjelpemiddel i Norge.`,
  },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

const services = [
  {
    name: 'Ring Direkte (SE)',
    slug: 'ringdirekt-se',
    shortDescription:
      'Direktsamtalstjänst för hörselskadade och döva i Sverige — ring vem som helst utan tolk via realtidstext.',
    icon: 'ns-shape-17',
    market: 'SE',
    displayOrder: 1,
    descriptionMd: `## Ring Direkte (SE) — Direktsamtal via realtidstext

Ring Direkte är en tjänst som gör det möjligt för hörselskadade och döva att ringa direkt till vem som helst utan att behöva anlita en tolk. Samtalet sker via realtidstext, vilket innebär att det du skriver visas direkt hos mottagaren — precis som ett vanligt telefonsamtal, men i textform.

## Hur det fungerar

- Du ringer via T-Meetings app på din telefon eller dator
- Mottagaren svarar i vanlig telefon
- Det du skriver visas i realtid hos mottagaren
- Mottagarens talade ord omvandlas till text hos dig
- Ingen tolk behövs — samtalet sker direkt mellan parterna

## Vem är tjänsten för?

Ring Direkte passar dig som:

- Är hörselskadad eller döv och vill kunna ringa på egen hand
- Vill ha ett mer självständigt och flexibelt kommunikationssätt
- Behöver ringa till exempelvis sjukvård, myndigheter eller arbetsgivare

## Tillgänglighet

Tjänsten är godkänd som hjälpmedel och kan finansieras via Försäkringskassan eller din region. Kontakta din audionommottagning eller hörselrehabiliteringen för mer information om hur du ansöker.`,
  },
  {
    name: 'Ring Direkte (NO)',
    slug: 'ringdirekte',
    shortDescription:
      'Direktsamtalstjeneste for hørselshemmede og døve i Norge — ring hvem som helst uten tolk via sanntidstekst.',
    icon: 'ns-shape-18',
    market: 'NO',
    displayOrder: 2,
    descriptionMd: `## Ring Direkte (NO) — Direktanrop via sanntidstekst

Ring Direkte er en tjeneste som gjør det mulig for hørselshemmede og døve å ringe direkte til hvem som helst uten å måtte bruke tolk. Samtalen skjer via sanntidstekst, som betyr at det du skriver vises umiddelbart hos mottakeren — akkurat som en vanlig telefonsamtale, men i tekstform.

## Slik fungerer det

- Du ringer via T-Meetings app på din telefon eller datamaskin
- Mottakeren svarer i vanlig telefon
- Det du skriver vises i sanntid hos mottakeren
- Mottakerens talte ord konverteres til tekst hos deg
- Ingen tolk er nødvendig — samtalen skjer direkte mellom partene

## Hvem er tjenesten for?

Ring Direkte passer for deg som:

- Er hørselshemmet eller døv og ønsker å ringe på egenhånd
- Vil ha en mer selvstendig og fleksibel kommunikasjonsmåte
- Trenger å ringe til for eksempel helsetjenester, myndigheter eller arbeidsgiver

## Tilgjengelighet

Tjenesten er godkjent som hjelpemiddel og kan finansieres via NAV. Kontakt din audiopedagog eller hørselssentralen for mer informasjon om hvordan du søker.`,
  },
  {
    name: 'Distanstolken',
    slug: 'distanstolken',
    shortDescription:
      'Fjärrtolkning via video med TM-PC Pro — professionell tolkning direkt i ditt möte utan att tolken behöver vara fysiskt närvarande.',
    icon: 'ns-shape-19',
    market: 'SE',
    displayOrder: 3,
    descriptionMd: `## Distanstolken — Fjärrtolkning via video

Med Distanstolken kan du anlita en professionell tolk på distans via videolänk. Tjänsten gör det möjligt att genomföra möten, samtal och konferenser med tolkstöd utan att tolken behöver vara fysiskt på plats — en flexibel och kostnadseffektiv lösning för organisationer och privatpersoner.

Distanstolken bygger på T-Meetings TM-PC Pro-plattform och stödjer ljud, video och realtidstext i samma session.

## Hur det fungerar

- Du startar ett möte via TM-PC Pro
- En auktoriserad tolk ansluter via videolänk
- Tolkning sker i realtid under hela mötet
- Stöd för teckenspråkstolkning och skrivtolkning
- Fungerar med upp till flera deltagare samtidigt

## Användningsområden

Distanstolken används bland annat vid:

- Läkarbesök och vårdmöten
- Arbetsplatssamtal och personalärenden
- Myndighetskontakter
- Utbildningssituationer

## Fördelar

- Sparar restid för tolk och deltagare
- Tillgänglig med kort varsel
- Fungerar var du än befinner dig
- Lika effektivt som tolkning på plats`,
  },
  {
    name: 'Tillgänglig kundtjänst',
    slug: 'tillganglig-kundtjanst',
    shortDescription:
      'Gör er kundtjänst tillgänglig för hörselskadade, döva och personer med talsvårigheter med T-Meetings kommunikationslösningar.',
    icon: 'ns-shape-21',
    market: 'SE',
    displayOrder: 4,
    descriptionMd: `## Tillgänglig kundtjänst — Nå alla dina kunder

T-Meeting hjälper företag och myndigheter att göra sin kundtjänst tillgänglig för hörselskadade, döva och personer med talsvårigheter. Genom att integrera T-Meetings kommunikationslösningar i er kundtjänst kan ni erbjuda likvärdig service till alla, oavsett funktionsförmåga.

## Vad ingår

- Integration av realtidstexttjänst i er kundtjänstkanal
- Stöd för videotelefonkontakt via teckenspråk
- Utbildning av er kundtjänstpersonal
- Teknisk support och driftsuppföljning
- Anpassning efter er verksamhets behov

## För vem

Tillgänglig kundtjänst passar organisationer som:

- Har lagstadgad skyldighet att erbjuda tillgängliga tjänster
- Vill förbättra sin service för alla kundgrupper
- Söker kostnadseffektiva lösningar för kommunikationstillgänglighet

## Lagkrav och standarder

Enligt diskrimineringslagen och EU:s tillgänglighetsdirektiv är många verksamheter skyldiga att erbjuda tillgängliga kommunikationsvägar. T-Meeting hjälper er att uppfylla dessa krav på ett enkelt och effektivt sätt.

## Kom igång

Kontakta oss för en kostnadsfri behovsanalys och ett skräddarsytt förslag för er organisation.`,
  },
];

// ---------------------------------------------------------------------------
// News articles
// ---------------------------------------------------------------------------

const newsArticles = [
  {
    title: 'TERA — tillgänglig realtidstexttelefoni',
    slug: 'tera-tillganglig-realtidstexttelefoni',
    tag: 'produktnyheter',
    author: 'T-Meeting',
    readTime: '3 min läsning',
    featured: true,
    publishDate: '2026-01-15',
    excerpt:
      'T-Meeting lanserar den senaste versionen av TERA, appen för realtidstexttelefoni som gör det möjligt att delta i telefonsamtal via text i realtid.',
    bodyMd: `## TERA — realtidstexttelefoni för alla

TERA är T-Meetings app för realtidstexttelefoni. Appen gör det möjligt för hörselskadade och döva att delta i telefonsamtal via text i realtid, utan behov av tolk.

Texten visas direkt i samtalet, i takt med att den andre personen talar. Det ger en naturlig samtalsupplevelse och ökar tillgängligheten till vanlig telefoni för personer med hörselnedsättning.

## Godkänd som hjälpmedel

TERA uppfyller de krav som ställs på tillgänglig kommunikation och är godkänd som hjälpmedel i Sverige och Norge. Det innebär att den kan förskrivas via landsting, regioner och hjälpmedelsorganisationer.

Appen finns tillgänglig för mobiltelefon och är utformad för att vara enkel att använda, oavsett teknisk vana.

## Vad ingår

- Realtidstext under pågående samtal
- Stöd för vanliga telefonsamtal
- Tillgänglig via mobilapp
- Godkänd som hjälpmedel i Sverige och Norge`,
  },
  {
    title: 'Ring Direkte — ring utan tolk',
    slug: 'ring-direkte-ring-utan-tolk',
    tag: 'tjanster',
    author: 'T-Meeting',
    readTime: '3 min läsning',
    featured: true,
    publishDate: '2026-02-10',
    excerpt:
      'Med Ring Direkte kan hörselskadade och döva ringa direkt till vem som helst utan hjälp av tolk.',
    bodyMd: `## Ring Direkte — direktsamtal utan tolk

Ring Direkte är T-Meetings tjänst för direktsamtal. Med Ring Direkte kan hörselskadade och döva ringa direkt till vem som helst — utan att behöva gå via en tolk.

Tjänsten kombinerar realtidstext med ljud eller video för att ge ett naturligt samtalflöde. Den som ringer och den som tar emot samtalet behöver inte ha samma utrustning eller app.

## Tillgänglig i Sverige och Norge

Ring Direkte finns i två varianter:

- **Ring Direkte (SE)** — anpassad för den svenska marknaden
- **Ring Direkte (NO)** — anpassad för norska krav och regelverk

Båda varianterna är godkända som hjälpmedel och kan förskrivas via relevanta myndigheter.

## Enklare vardag

Tjänsten är utformad för att göra vardagen enklare för hörselskadade och döva. Att kunna ringa direkt — till läkarmottagningen, jobbet eller en vän — utan att behöva boka tolk i förväg, ger ökad frihet och självständighet.`,
  },
  {
    title: 'T-Meeting bidrar till ETSI-standarder',
    slug: 't-meeting-bidrar-till-etsi-standarder',
    tag: 'nyheter',
    author: 'T-Meeting',
    readTime: '4 min läsning',
    featured: false,
    publishDate: '2026-03-05',
    excerpt:
      'Som rådgivande part till ETSI formar T-Meeting internationella standarder för tillgänglig kommunikation.',
    bodyMd: `## T-Meeting och ETSI

T-Meeting är rådgivande part till ETSI (European Telecommunications Standards Institute) och bidrar aktivt till att forma internationella standarder för tillgänglig och säker kommunikation.

ETSI är en av världens ledande standardiseringsorganisationer inom telekommunikation. Genom T-Meetings engagemang säkerställs att behoven hos hörselskadade, döva och dövblinda användare beaktas i de standarder som formar morgondagens kommunikationslösningar.

## Varför standarder spelar roll

Standarder är grunden för att kommunikationslösningar ska fungera sömlöst över gränser, plattformar och enheter. Utan gemensamma standarder riskerar tillgänglighetslösningar att bli isolerade — de fungerar i ett system men inte i ett annat.

Genom att delta i standardiseringsarbetet verkar T-Meeting för att tillgänglighet inte är ett eftertanke, utan en grundförutsättning i moderna kommunikationssystem.

## Öppna standarder för framtiden

T-Meetings produkter bygger på öppna standarder. Det innebär att de är interoperabla, framtidssäkra och oberoende av enskilda leverantörer.

Standarderna vi arbetar mot:

- Tillgänglig realtidstexttelefoni (RTT)
- Tillgänglig videotelefoni för teckenspråk
- Europeiska krav på tillgänglig kommunikation (EN 301 549)`,
  },
];

// ---------------------------------------------------------------------------
// Support documents
// ---------------------------------------------------------------------------

const supportDocuments = [
  {
    title: 'TERA — Användarmanual',
    slug: 'tera-anvandarmanual',
    docType: 'manual',
    description: 'Användarmanual för TERA realtidstexttelefoni.',
    version: '1.0',
    externalUrl: '#',
    productName: 'TERA',
    displayOrder: 1,
  },
  {
    title: 'TM — Användarmanual',
    slug: 'tm-anvandarmanual',
    docType: 'manual',
    description: 'Användarmanual för TM videotelefoni.',
    version: '1.0',
    externalUrl: '#',
    productName: 'TM',
    displayOrder: 2,
  },
  {
    title: 'TM-PC Flerpart — Användarmanual',
    slug: 'tm-pc-flerpart-anvandarmanual',
    docType: 'manual',
    description: 'Användarmanual för TM-PC Flerpart gruppmöten.',
    version: '1.0',
    externalUrl: '#',
    productName: 'TM-PC Flerpart',
    displayOrder: 3,
  },
  {
    title: 'TM-ALERT — Användarmanual',
    slug: 'tm-alert-anvandarmanual',
    docType: 'manual',
    description: 'Användarmanual för TM-ALERT notissenhet.',
    version: '1.0',
    externalUrl: '#',
    productName: 'TM-ALERT',
    displayOrder: 4,
  },
  {
    title: 'TM-PC Pro — Programvara',
    slug: 'tm-pc-pro-programvara',
    docType: 'download',
    description: 'Ladda ner TM-PC Pro för Windows.',
    version: '2.0',
    externalUrl: '#',
    productName: 'TM-PC Flerpart',
    displayOrder: 5,
  },
];

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

const siteSettings = {
  companyName: 'T-Meeting',
  legalName: 'Europea i Malmö AB',
  tagline: 'Teknik som för människor närmare',
  email: 'mail@tmeeting.se',
  salesEmail: 'sales@tmeeting.se',
  phone: '+46 (0)40 661 41 80',
  address: 'Amiralsgatan 20, 211 55 Malmö, Sweden',
  spotifyEmbedUrl:
    'https://open.spotify.com/embed/show/3CbX7Y1V09PMEqpb8ucZTH?utm_source=generator&theme=0',
  facebookUrl: 'https://facebook.com/tmeeting.se',
  twitterUrl: 'https://x.com/T_meeting',
  instagramUrl: 'https://instagram.com/tmeetingsweden',
  youtubeUrl: 'https://www.youtube.com/user/Tmeetingchannel',
  footerCopyright: '© 2026 T-Meeting',
};

// ---------------------------------------------------------------------------
// System status
// ---------------------------------------------------------------------------

const systemStatus = {
  systems: [
    { name: 'TERA', slug: 'tera', status: 'operational', uptime: 99.9, description: 'Realtidstexttelefoni' },
    { name: 'TM', slug: 'tm', status: 'operational', uptime: 99.8, description: 'Videotelefoni' },
    { name: 'Ring Direkte (SE)', slug: 'ringdirekt-se', status: 'operational', uptime: 99.9, description: 'Direktsamtal Sverige' },
    { name: 'Ring Direkte (NO)', slug: 'ringdirekte', status: 'operational', uptime: 99.7, description: 'Direktsamtal Norge' },
  ],
  incidents: [],
  changelog: [
    {
      version: '1.0',
      date: '2026-01-01',
      description: 'Lansering av T-Meetings nya driftstatussida.',
      entryType: 'feature',
    },
  ],
};

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedProducts(strapi: any) {
  console.log('\nSeeding products...');
  for (const p of products) {
    const existing = await strapi.documents('api::product.product').findMany({
      filters: { slug: p.slug },
    });
    if (existing.length > 0) {
      console.log(`  [skip] product: ${p.slug}`);
      continue;
    }
    const { descriptionMd, ...fields } = p;
    await strapi.documents('api::product.product').create({
      data: {
        ...fields,
        description: markdownToBlocks(descriptionMd),
        locale: 'sv',
      },
      status: 'published',
    });
    console.log(`  [ok]   product: ${p.slug}`);
  }
}

async function seedServices(strapi: any) {
  console.log('\nSeeding services...');
  for (const s of services) {
    const existing = await strapi.documents('api::service.service').findMany({
      filters: { slug: s.slug },
    });
    if (existing.length > 0) {
      console.log(`  [skip] service: ${s.slug}`);
      continue;
    }
    const { descriptionMd, ...fields } = s;
    await strapi.documents('api::service.service').create({
      data: {
        ...fields,
        description: markdownToBlocks(descriptionMd),
        locale: 'sv',
      },
      status: 'published',
    });
    console.log(`  [ok]   service: ${s.slug}`);
  }
}

async function seedNewsArticles(strapi: any) {
  console.log('\nSeeding news articles...');
  for (const a of newsArticles) {
    const existing = await strapi.documents('api::news-article.news-article').findMany({
      filters: { slug: a.slug },
    });
    if (existing.length > 0) {
      console.log(`  [skip] article: ${a.slug}`);
      continue;
    }
    const { bodyMd, ...fields } = a;
    await strapi.documents('api::news-article.news-article').create({
      data: {
        ...fields,
        body: markdownToBlocks(bodyMd),
        locale: 'sv',
      },
      status: 'published',
    });
    console.log(`  [ok]   article: ${a.slug}`);
  }
}

async function seedSupportDocuments(strapi: any) {
  console.log('\nSeeding support documents...');
  for (const d of supportDocuments) {
    const existing = await strapi.documents('api::support-document.support-document').findMany({
      filters: { slug: d.slug },
    });
    if (existing.length > 0) {
      console.log(`  [skip] support-doc: ${d.slug}`);
      continue;
    }
    await strapi.documents('api::support-document.support-document').create({
      data: { ...d, locale: 'sv' },
      status: 'published',
    });
    console.log(`  [ok]   support-doc: ${d.slug}`);
  }
}

async function seedSiteSettings(strapi: any) {
  console.log('\nSeeding site settings...');
  const existing = await strapi.documents('api::site-setting.site-setting').findFirst();
  if (existing) {
    console.log('  [skip] site-setting already exists');
    return;
  }
  await strapi.documents('api::site-setting.site-setting').create({
    data: { ...siteSettings, locale: 'sv' },
    status: 'published',
  });
  console.log('  [ok]   site-setting');
}

async function seedSystemStatus(strapi: any) {
  console.log('\nSeeding system status...');
  const existing = await strapi.documents('api::system-status.system-status').findFirst();
  if (existing) {
    console.log('  [skip] system-status already exists');
    return;
  }
  await strapi.documents('api::system-status.system-status').create({
    data: { ...systemStatus, locale: 'sv' },
    status: 'published',
  });
  console.log('  [ok]   system-status');
}

// ---------------------------------------------------------------------------
// Bootstrap and run
// ---------------------------------------------------------------------------

async function main() {
  console.log('Bootstrapping Strapi...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    await seedProducts(app);
    await seedServices(app);
    await seedNewsArticles(app);
    await seedSupportDocuments(app);
    await seedSiteSettings(app);
    await seedSystemStatus(app);
    console.log('\nAll Swedish content seeded successfully.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
