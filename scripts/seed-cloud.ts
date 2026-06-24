/**
 * seed-cloud.ts — T-Meeting Strapi Cloud Seeder
 *
 * Seeds all Swedish content to Strapi Cloud via REST API.
 * Run with:
 *   STRAPI_CLOUD_URL=https://integral-nest-94429dced1.strapiapp.com \
 *   STRAPI_CLOUD_TOKEN=your_full_access_token \
 *   npx tsx scripts/seed-cloud.ts
 *
 * Safe to re-run — checks for existing entries by slug before creating.
 * Delete the full-access token after seeding is complete.
 */

import { markdownToBlocks } from './lib/markdownToBlocks';

const BASE_URL = process.env.STRAPI_CLOUD_URL ?? 'http://localhost:1337';
const TOKEN = process.env.STRAPI_CLOUD_TOKEN ?? '';

if (!TOKEN) {
  console.error('ERROR: STRAPI_CLOUD_TOKEN is required');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

// ---------------------------------------------------------------------------
// Helper: POST to Strapi REST API
// ---------------------------------------------------------------------------

async function strapiPost(endpoint: string, data: Record<string, unknown>) {
  const url = `${BASE_URL}/api/${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${endpoint} failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function strapiGet(endpoint: string): Promise<unknown[]> {
  const url = `${BASE_URL}/api/${endpoint}?locale=sv&pagination[pageSize]=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const json = await res.json() as { data: unknown[] };
  return json.data ?? [];
}

async function strapiPut(endpoint: string, documentId: string, data: Record<string, unknown>) {
  const url = `${BASE_URL}/api/${endpoint}/${documentId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${endpoint}/${documentId} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Products (6)
// ---------------------------------------------------------------------------

const products = [
  {
    name: 'TERA',
    slug: 'tera',
    shortDescription: 'Realtidstexttelefoni för hörselskadade och döva — TERA gör det möjligt att delta i telefonsamtal via text i realtid.',
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
    shortDescription: 'Videotelefonilösning för teckenspråk och text — möjliggör samtal med upp till fem deltagare.',
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
    shortDescription: 'Flerparstelefoni via dator — för gruppmöten med ljud, video och realtidstext.',
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
    shortDescription: 'Bärbar larmenhet för hörselskadade — vibrerar och blinkar vid inkommande samtal och notiser.',
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
// Services (4)
// ---------------------------------------------------------------------------

const services = [
  {
    name: 'Ring Direkte (SE)',
    slug: 'ringdirekt-se',
    shortDescription: 'Direktsamtalstjänst för hörselskadade och döva i Sverige — ring vem som helst utan tolk via realtidstext.',
    icon: 'ns-shape-17',
    market: 'SE',
    displayOrder: 1,
    descriptionMd: `## Ring Direkte (SE) — Direktsamtal via realtidstext

Ring Direkte är en tjänst som gör det möjligt för hörselskadade och döva att ringa direkt till vem som helst utan att behöva anlita en tolk. Samtalet sker via realtidstext.

## Hur det fungerar

- Du ringer via T-Meetings app på din telefon eller dator
- Mottagaren svarar i vanlig telefon
- Det du skriver visas i realtid hos mottagaren
- Mottagarens talade ord omvandlas till text hos dig

## Vem är tjänsten för?

Ring Direkte passar dig som är hörselskadad eller döv och vill kunna ringa på egen hand.

## Tillgänglighet

Tjänsten är godkänd som hjälpmedel och kan finansieras via Försäkringskassan eller din region.`,
  },
  {
    name: 'Ring Direkte (NO)',
    slug: 'ringdirekte',
    shortDescription: 'Direktsamtalstjeneste for hørselshemmede og døve i Norge — ring hvem som helst uten tolk via sanntidstekst.',
    icon: 'ns-shape-18',
    market: 'NO',
    displayOrder: 2,
    descriptionMd: `## Ring Direkte (NO) — Direktanrop via sanntidstekst

Ring Direkte er en tjeneste som gjør det mulig for hørselshemmede og døve å ringe direkte til hvem som helst uten å måtte bruke tolk.

## Slik fungerer det

- Du ringer via T-Meetings app på din telefon eller datamaskin
- Mottakeren svarer i vanlig telefon
- Det du skriver vises i sanntid hos mottakeren
- Mottakerens talte ord konverteres til tekst hos deg

## Tilgjengelighet

Tjenesten er godkjent som hjelpemiddel og kan finansieres via NAV.`,
  },
  {
    name: 'Distanstolken',
    slug: 'distanstolken',
    shortDescription: 'Fjärrtolkning via video med TM-PC Pro — professionell tolkning direkt i ditt möte utan att tolken behöver vara fysiskt närvarande.',
    icon: 'ns-shape-19',
    market: 'SE',
    displayOrder: 3,
    descriptionMd: `## Distanstolken — Fjärrtolkning via video

Med Distanstolken kan du anlita en professionell tolk på distans via videolänk.

## Hur det fungerar

- Du startar ett möte via TM-PC Pro
- En auktoriserad tolk ansluter via videolänk
- Tolkning sker i realtid under hela mötet
- Stöd för teckenspråkstolkning och skrivtolkning

## Användningsområden

- Läkarbesök och vårdmöten
- Arbetsplatssamtal och personalärenden
- Myndighetskontakter
- Utbildningssituationer`,
  },
  {
    name: 'Tillgänglig kundtjänst',
    slug: 'tillganglig-kundtjanst',
    shortDescription: 'Gör er kundtjänst tillgänglig för hörselskadade, döva och personer med talsvårigheter med T-Meetings kommunikationslösningar.',
    icon: 'ns-shape-21',
    market: 'SE',
    displayOrder: 4,
    descriptionMd: `## Tillgänglig kundtjänst — Nå alla dina kunder

T-Meeting hjälper företag och myndigheter att göra sin kundtjänst tillgänglig för hörselskadade, döva och personer med talsvårigheter.

## Vad ingår

- Integration av realtidstexttjänst i er kundtjänstkanal
- Stöd för videotelefonkontakt via teckenspråk
- Utbildning av er kundtjänstpersonal
- Teknisk support och driftsuppföljning

## Lagkrav och standarder

Enligt diskrimineringslagen och EU:s tillgänglighetsdirektiv är många verksamheter skyldiga att erbjuda tillgängliga kommunikationsvägar.`,
  },
];

// ---------------------------------------------------------------------------
// News Articles (3)
// ---------------------------------------------------------------------------

const articles = [
  {
    title: 'TERA — tillgänglig realtidstexttelefoni',
    slug: 'tera-tillganglig-realtidstexttelefoni',
    tag: 'produktnyheter',
    author: 'T-Meeting',
    readTime: '3 min läsning',
    featured: true,
    publishDate: '2026-01-15',
    excerpt: 'T-Meeting lanserar den senaste versionen av TERA, appen för realtidstexttelefoni som gör det möjligt att delta i telefonsamtal via text i realtid.',
    bodyMd: `## TERA — realtidstexttelefoni för alla

TERA är T-Meetings app för realtidstexttelefoni. Appen gör det möjligt för hörselskadade och döva att delta i telefonsamtal via text i realtid, utan behov av tolk.

## Godkänd som hjälpmedel

TERA uppfyller de krav som ställs på tillgänglig kommunikation och är godkänd som hjälpmedel i Sverige och Norge.

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
    excerpt: 'Med Ring Direkte kan hörselskadade och döva ringa direkt till vem som helst utan hjälp av tolk.',
    bodyMd: `## Ring Direkte — direktsamtal utan tolk

Ring Direkte är T-Meetings tjänst för direktsamtal. Med Ring Direkte kan hörselskadade och döva ringa direkt till vem som helst utan att behöva gå via en tolk.

## Tillgänglig i Sverige och Norge

Ring Direkte finns i två varianter:

- **Ring Direkte (SE)** — anpassad för den svenska marknaden
- **Ring Direkte (NO)** — anpassad för norska krav och regelverk

## Enklare vardag

Att kunna ringa direkt — till läkarmottagningen, jobbet eller en vän — utan att behöva boka tolk i förväg, ger ökad frihet och självständighet.`,
  },
  {
    title: 'T-Meeting bidrar till ETSI-standarder',
    slug: 't-meeting-bidrar-till-etsi-standarder',
    tag: 'nyheter',
    author: 'T-Meeting',
    readTime: '4 min läsning',
    featured: false,
    publishDate: '2026-03-05',
    excerpt: 'Som rådgivande part till ETSI formar T-Meeting internationella standarder för tillgänglig kommunikation.',
    bodyMd: `## T-Meeting och ETSI

T-Meeting är rådgivande part till ETSI (European Telecommunications Standards Institute) och bidrar aktivt till att forma internationella standarder för tillgänglig och säker kommunikation.

## Varför standarder spelar roll

Standarder är grunden för att kommunikationslösningar ska fungera sömlöst över gränser, plattformar och enheter.

## Öppna standarder för framtiden

T-Meetings produkter bygger på öppna standarder. De standarder vi arbetar mot:

- Tillgänglig realtidstexttelefoni (RTT)
- Tillgänglig videotelefoni för teckenspråk
- Europeiska krav på tillgänglig kommunikation (EN 301 549)`,
  },
];

// ---------------------------------------------------------------------------
// Support Documents (5)
// ---------------------------------------------------------------------------

const supportDocs = [
  { title: 'TERA — Användarmanual', slug: 'tera-anvandarmanual', docType: 'manual', description: 'Användarmanual för TERA realtidstexttelefoni.', version: '1.0', externalUrl: '#', productName: 'TERA', displayOrder: 1 },
  { title: 'TM — Användarmanual', slug: 'tm-anvandarmanual', docType: 'manual', description: 'Användarmanual för TM videotelefoni.', version: '1.0', externalUrl: '#', productName: 'TM', displayOrder: 2 },
  { title: 'TM-PC Flerpart — Användarmanual', slug: 'tm-pc-flerpart-anvandarmanual', docType: 'manual', description: 'Användarmanual för TM-PC Flerpart gruppmöten.', version: '1.0', externalUrl: '#', productName: 'TM-PC Flerpart', displayOrder: 3 },
  { title: 'TM-ALERT — Användarmanual', slug: 'tm-alert-anvandarmanual', docType: 'manual', description: 'Användarmanual för TM-ALERT notissenhet.', version: '1.0', externalUrl: '#', productName: 'TM-ALERT', displayOrder: 4 },
  { title: 'TM-PC Pro — Programvara', slug: 'tm-pc-pro-programvara', docType: 'download', description: 'Ladda ner TM-PC Pro för Windows.', version: '2.0', externalUrl: '#', productName: 'TM-PC Flerpart', displayOrder: 5 },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱 Starting T-Meeting cloud seed...');
  console.log(`   Target: ${BASE_URL}\n`);

  // --- Products ---
  console.log('📦 Seeding products...');
  const existingProducts = await strapiGet('products') as Array<{ slug: string }>;
  const existingProductSlugs = existingProducts.map((p) => p.slug);

  for (const p of products) {
    if (existingProductSlugs.includes(p.slug)) {
      console.log(`   ⏭  Skipping product: ${p.name} (already exists)`);
      continue;
    }
    await strapiPost('products', {
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: markdownToBlocks(p.descriptionMd),
      icon: p.icon,
      market: p.market,
      displayOrder: p.displayOrder,
      locale: 'sv',
    });
    console.log(`   ✅ Created product: ${p.name}`);
  }

  // --- Services ---
  console.log('\n🔧 Seeding services...');
  const existingServices = await strapiGet('services') as Array<{ slug: string }>;
  const existingServiceSlugs = existingServices.map((s) => s.slug);

  for (const s of services) {
    if (existingServiceSlugs.includes(s.slug)) {
      console.log(`   ⏭  Skipping service: ${s.name} (already exists)`);
      continue;
    }
    await strapiPost('services', {
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      description: markdownToBlocks(s.descriptionMd),
      icon: s.icon,
      market: s.market,
      displayOrder: s.displayOrder,
      locale: 'sv',
    });
    console.log(`   ✅ Created service: ${s.name}`);
  }

  // --- News Articles ---
  console.log('\n📰 Seeding news articles...');
  const existingArticles = await strapiGet('news-articles') as Array<{ slug: string }>;
  const existingArticleSlugs = existingArticles.map((a) => a.slug);

  for (const a of articles) {
    if (existingArticleSlugs.includes(a.slug)) {
      console.log(`   ⏭  Skipping article: ${a.title} (already exists)`);
      continue;
    }
    await strapiPost('news-articles', {
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      body: markdownToBlocks(a.bodyMd),
      tag: a.tag,
      author: a.author,
      readTime: a.readTime,
      featured: a.featured,
      publishDate: a.publishDate,
      locale: 'sv',
    });
    console.log(`   ✅ Created article: ${a.title}`);
  }

  // --- Support Documents ---
  console.log('\n📄 Seeding support documents...');
  const existingDocs = await strapiGet('support-documents') as Array<{ slug: string }>;
  const existingDocSlugs = existingDocs.map((d) => d.slug);

  for (const d of supportDocs) {
    if (existingDocSlugs.includes(d.slug)) {
      console.log(`   ⏭  Skipping document: ${d.title} (already exists)`);
      continue;
    }
    await strapiPost('support-documents', {
      title: d.title,
      slug: d.slug,
      docType: d.docType,
      description: d.description,
      version: d.version,
      externalUrl: d.externalUrl,
      productName: d.productName,
      displayOrder: d.displayOrder,
      locale: 'sv',
    });
    console.log(`   ✅ Created document: ${d.title}`);
  }

  // --- Site Settings (single type) ---
  console.log('\n⚙️  Seeding site settings...');
  try {
    const existing = await fetch(`${BASE_URL}/api/site-setting?locale=sv`, { headers });
    const existingJson = await existing.json() as { data: unknown };
    if (existingJson.data) {
      console.log('   ⏭  Site settings already exist, skipping');
    }
  } catch {
    await strapiPost('site-setting', {
      companyName: 'T-Meeting',
      legalName: 'Europea i Malmö AB',
      tagline: 'Teknik som för människor närmare',
      email: 'mail@tmeeting.se',
      salesEmail: 'sales@tmeeting.se',
      phone: '+46 (0)40 661 41 80',
      address: 'Amiralsgatan 20, 211 55 Malmö, Sweden',
      spotifyEmbedUrl: 'https://open.spotify.com/embed/show/3CbX7Y1V09PMEqpb8ucZTH?utm_source=generator&theme=0',
      facebookUrl: 'https://facebook.com/tmeeting.se',
      twitterUrl: 'https://x.com/T_meeting',
      instagramUrl: 'https://instagram.com/tmeetingsweden',
      youtubeUrl: 'https://www.youtube.com/user/Tmeetingchannel',
      footerCopyright: '© 2026 T-Meeting',
      locale: 'sv',
    });
    console.log('   ✅ Created site settings');
  }

  // --- Site Settings PUT (update if exists) ---
  try {
    const res = await fetch(`${BASE_URL}/api/site-setting?locale=sv`, { headers });
    const json = await res.json() as { data: { documentId: string } | null };
    if (json.data) {
      await strapiPut('site-setting', json.data.documentId, {
        companyName: 'T-Meeting',
        legalName: 'Europea i Malmö AB',
        tagline: 'Teknik som för människor närmare',
        email: 'mail@tmeeting.se',
        salesEmail: 'sales@tmeeting.se',
        phone: '+46 (0)40 661 41 80',
        address: 'Amiralsgatan 20, 211 55 Malmö, Sweden',
        spotifyEmbedUrl: 'https://open.spotify.com/embed/show/3CbX7Y1V09PMEqpb8ucZTH?utm_source=generator&theme=0',
        facebookUrl: 'https://facebook.com/tmeeting.se',
        twitterUrl: 'https://x.com/T_meeting',
        instagramUrl: 'https://instagram.com/tmeetingsweden',
        youtubeUrl: 'https://www.youtube.com/user/Tmeetingchannel',
        footerCopyright: '© 2026 T-Meeting',
        locale: 'sv',
      });
      console.log('   ✅ Updated site settings');
    }
  } catch (e) {
    console.log('   ⚠️  Could not update site settings:', e);
  }

  // --- System Status (single type) ---
  console.log('\n🟢 Seeding system status...');
  try {
    const res = await fetch(`${BASE_URL}/api/system-status?populate=*`, { headers });
    const json = await res.json() as { data: { documentId: string } | null };
    const statusData = {
      systems: [
        { name: 'TERA', slug: 'tera', status: 'operational', uptime: 99.9, description: 'Realtidstexttelefoni' },
        { name: 'TM', slug: 'tm', status: 'operational', uptime: 99.8, description: 'Videotelefoni' },
        { name: 'Ring Direkte (SE)', slug: 'ringdirekt-se', status: 'operational', uptime: 99.9, description: 'Direktsamtal Sverige' },
        { name: 'Ring Direkte (NO)', slug: 'ringdirekte', status: 'operational', uptime: 99.7, description: 'Direktsamtal Norge' },
      ],
      incidents: [],
      changelog: [
        { version: '1.0', date: '2026-01-01', description: 'Lansering av T-Meetings nya driftstatussida.', entryType: 'feature' },
      ],
      locale: 'sv',
    };

    if (json.data) {
      await strapiPut('system-status', json.data.documentId, statusData);
      console.log('   ✅ Updated system status');
    } else {
      await strapiPost('system-status', statusData);
      console.log('   ✅ Created system status');
    }
  } catch (e) {
    console.log('   ⚠️  Could not seed system status:', e);
  }

  console.log('\n✅ Seed complete!');
  console.log('   Remember to delete the seed-token in Strapi Cloud admin.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
