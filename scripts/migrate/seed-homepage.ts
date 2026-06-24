/**
 * seed-homepage.ts — populates the Homepage single-type (sv) from content
 * previously in i18n files. Idempotent (updates if present).
 * Run with the Strapi HTTP server STOPPED:
 *   npx tsx scripts/migrate/seed-homepage.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

const heroButtons = [
  { label: 'Produkter', href: '/produkter' },
  { label: 'Tjänster', href: '/tjanster' },
];

const productCards = [
  {
    name: 'TERA',
    description: 'Texttelefoni i realtid för döva och hörselskadade.',
    href: '/produkter/tera',
  },
  {
    name: 'TM',
    description: 'Videotelefoni för teckenspråk och text.',
    href: '/produkter/tm',
  },
  {
    name: 'TM-ALERT',
    description: 'Bärbar larmanordning – vibrerar och blinkar vid inkommande samtal.',
    href: '/produkter/tm-alert',
  },
  {
    name: 'Förmedlingstjänster',
    description: 'Fjärrtolkning för arbetsplatser och myndigheter.',
    href: '/tjanster/distanstolken',
  },
];

// Rich-text blocks for block1 body (with inline link to 1177.se)
const howToApplyBlock1Body = [
  {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: 'Om du är privatperson eller pensionär kan du kontakta oss så hjälper vi dig att ta reda på vem du ska vända dig till i din region – ansökan sker oftast via webbplatsen ',
      },
      {
        type: 'link',
        url: 'https://www.1177.se',
        children: [{ type: 'text', text: '1177.se' }],
      },
      { type: 'text', text: '.' },
    ],
  },
];

// Rich-text blocks for block2 body (three paragraphs, each with inline links)
const howToApplyBlock2Body = [
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Om du har stöd från ' },
      {
        type: 'link',
        url: 'https://arbetsformedlingen.se',
        children: [{ type: 'text', text: 'Arbetsförmedlingen' }],
      },
      { type: 'text', text: ', kontakta din handläggare där.' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Om du inte har stöd men är anställd ansöker du via ' },
      {
        type: 'link',
        url: 'https://www.forsakringskassan.se/privatperson',
        children: [{ type: 'text', text: 'Försäkringskassan' }],
      },
      { type: 'text', text: ' istället.' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { type: 'text', text: 'Osäker eller har frågor? Kontakta ' },
      {
        type: 'link',
        url: 'mailto:sales@tmeeting.se',
        children: [{ type: 'text', text: 'oss' }],
      },
      { type: 'text', text: ' – vi hjälper dig vidare.' },
    ],
  },
];

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const existing = await app.documents('api::homepage.homepage').findFirst({ locale: 'sv' });

    const data = {
      locale: 'sv',
      // Hero
      heroHeading: 'Teknik som för människor närmare',
      heroBody:
        'Vi erbjuder innovativa kommunikationslösningar som är tillgängliga, säkra och byggda på öppna standarder. T-Meetings produkter möjliggör inkluderande fjärrkommunikation med ljud, video och text i realtid — särskilt för personer som har svårt att höra, är döva, dövblinda eller har talsvårigheter. Som rådgivare till ETSI bidrar vi till att forma internationella standarder för tillgänglig och säker kommunikation. Våra lösningar är framtidssäkra, flexibla och utvecklade för att möta behov i både vardagen och på arbetsplatsen.',
      heroButtons,
      // Products grid
      productsHeading: 'T-Meeting produktfamilj',
      productsReadMore: 'Läs mer',
      productCards,
      // How to apply
      howToApplyHeading: 'Hur ansöker jag om T-Meetings hjälpmedel?',
      howToApplyBlock1Heading: 'Vill du ansöka om våra produkter som hjälpmedel för hemmabruk?',
      howToApplyBlock1Body,
      howToApplyBlock2Heading: 'Vill du använda våra produkter som hjälpmedel på arbetsplatsen?',
      howToApplyBlock2Body,
      // Podcast
      podcastBadge: 'Podcast',
      podcastHeading: 'Pod Trailer',
      podcastBody:
        'Lyssna på introduktionen av Tillgänglig kommunikation för alla. I podden delar vi med oss av insikter, exempel och praktiska tips om hur kommunikation kan bli mer inkluderande i vardagen, utbildning och arbetsliv.',
      podcastEmbedUrl:
        'https://open.spotify.com/embed/show/3CbX7Y1V09PMEqpb8ucZTH?utm_source=generator&theme=0',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = data as any;
    if (existing) {
      await app.documents('api::homepage.homepage').update({
        documentId: existing.documentId,
        locale: 'sv',
        data: payload,
        status: 'published',
      });
      console.log('Homepage updated (sv).');
    } else {
      await app.documents('api::homepage.homepage').create({ data: payload, status: 'published' });
      console.log('Homepage created (sv).');
    }
  } finally {
    await app.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
