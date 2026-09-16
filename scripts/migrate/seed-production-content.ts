/**
 * seed-production-content.ts — pushes the content seeded locally this session
 * (legal pages, TM-9000 docs, product segment values, produkter-page chooser
 * cards) to Strapi Cloud via REST API, mirroring the established
 * scripts/seed-cloud.ts pattern (safe to re-run — checks before creating).
 *
 * Run with:
 *   STRAPI_CLOUD_URL=https://celebrated-dream-14e3739304.strapiapp.com \
 *   STRAPI_CLOUD_TOKEN=your_full_access_token \
 *   npx tsx scripts/migrate/seed-production-content.ts
 *
 * Delete the full-access token in Strapi Cloud admin after this completes.
 */

const BASE_URL = process.env.STRAPI_CLOUD_URL ?? '';
const TOKEN = process.env.STRAPI_CLOUD_TOKEN ?? '';

if (!BASE_URL || !TOKEN) {
  console.error('ERROR: STRAPI_CLOUD_URL and STRAPI_CLOUD_TOKEN are required');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function strapiGet(endpoint: string): Promise<{ data: any }> {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, { headers });
  if (!res.ok) return { data: null };
  return (await res.json()) as { data: any };
}

async function strapiPost(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    throw new Error(`POST ${endpoint} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function strapiPut(endpoint: string, documentId: string, data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/api/${endpoint}/${documentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    throw new Error(`PUT ${endpoint}/${documentId} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Unlike the local documents()-service bootstrap scripts (which default to
// draft), the public REST API defaults every POST/PUT to status=published,
// so no separate publish step is needed here.

const EMAIL = 'mail@tmeeting.se';

const PAGES = [
  {
    slug: 'integritetspolicy',
    title: 'Integritetspolicy',
    body: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'T-Meeting värdesätter din integritet och behandlar dina personuppgifter i enlighet med GDPR och tillämplig svensk dataskyddslagstiftning.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'För frågor om hur vi behandlar dina personuppgifter, kontakta oss på ' },
          { type: 'link', url: `mailto:${EMAIL}`, children: [{ type: 'text', text: EMAIL }] },
          { type: 'text', text: '.' },
        ],
      },
    ],
    seoDescription: 'T-Meetings integritetspolicy.',
  },
  {
    slug: 'tillganglighet',
    title: 'Tillgänglighetsredogörelse',
    body: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'T-Meeting strävar efter att säkerställa att alla användare kan ta del av våra digitala tjänster, oavsett funktionsförmåga. Webbplatsen är utformad för att uppfylla WCAG 2.1 Nivå AA.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Vi arbetar kontinuerligt med att förbättra tillgängligheten och välkomnar feedback. Om du upplever tillgänglighetsproblem, kontakta oss på ' },
          { type: 'link', url: `mailto:${EMAIL}`, children: [{ type: 'text', text: EMAIL }] },
          { type: 'text', text: '.' },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Denna redogörelse är upprättad i enlighet med lagen om tillgänglighet till digital offentlig service (DOS-lagen) och gäller webbplatsen tmeeting.se.',
          },
        ],
      },
    ],
    seoDescription: 'T-Meetings tillgänglighetsredogörelse enligt DOS-lagen.',
  },
];

const TM9000_DOCS = [
  {
    slug: 'tm-9000-anvandarhandbok',
    title: 'Användarhandbok',
    description: 'Fullständig användarhandbok för TM-9000.',
    externalUrl:
      'https://docs.google.com/document/d/e/2PACX-1vTJxdtf4Mq3TKBGW8mjYrPc9vTIlO7r1ApDGoWUoCxoYcNw8YWIYHmTtUAv8OGmxd0nFcSDioaqnz4G/pub',
    displayOrder: 1,
  },
  {
    slug: 'tm-9000-felsokning',
    title: 'Felsökning',
    description: 'Felsökningsguide för TM-9000.',
    externalUrl:
      'https://docs.google.com/document/d/e/2PACX-1vQR7Sz99tzSGei-OdOahWMdVLgvoKLKzg54stuoyFMr-IUwNAwhnG4jncslV7s7VjiQ_9RivvWPV21a/pub',
    displayOrder: 2,
  },
  {
    slug: 'tm-9000-tillbehor',
    title: 'Tillbehör',
    description: 'Information om tillbehör för TM-9000.',
    externalUrl:
      'https://docs.google.com/document/d/e/2PACX-1vS_yVqRuVfqBYO0rdYJFqhfmay3zX4HL-AJXnYHm5qpHa-YeWDvd56QpQY9CEnnsZ-m1sX670_VjOPu/pub',
    displayOrder: 3,
  },
];

const SEGMENT_BY_SLUG: Record<string, 'PRIVAT' | 'FORETAG' | 'BOTH'> = {
  tera: 'PRIVAT',
  tm: 'PRIVAT',
  'tm-no': 'PRIVAT',
  'tera-no': 'PRIVAT',
  'tm-alert': 'FORETAG',
};

async function seedPages() {
  console.log('\n📄 Seeding legal pages...');
  for (const p of PAGES) {
    const existing = await strapiGet(`pages?locale=sv&filters[slug][$eq]=${p.slug}`);
    if (existing.data?.length) {
      console.log(`   ⏭  Skipping page: ${p.slug} (already exists)`);
      continue;
    }
    await strapiPost('pages', {
      title: p.title,
      slug: p.slug,
      body: p.body,
      seoDescription: p.seoDescription,
      locale: 'sv',
    });
    console.log(`   ✅ Created page: ${p.slug}`);
  }
}

async function seedTm9000Docs() {
  console.log('\n📄 Seeding TM-9000 support documents...');
  for (const d of TM9000_DOCS) {
    const existing = await strapiGet(`support-documents?locale=sv&filters[slug][$eq]=${d.slug}`);
    if (existing.data?.length) {
      console.log(`   ⏭  Skipping document: ${d.slug} (already exists)`);
      continue;
    }
    await strapiPost('support-documents', {
      title: d.title,
      slug: d.slug,
      docType: 'manual',
      description: d.description,
      externalUrl: d.externalUrl,
      productName: 'TM-9000',
      displayOrder: d.displayOrder,
      locale: 'sv',
    });
    console.log(`   ✅ Created document: ${d.slug}`);
  }
}

async function backfillProductSegment() {
  console.log('\n📦 Backfilling product segment...');
  for (const [slug, segment] of Object.entries(SEGMENT_BY_SLUG)) {
    const existing = await strapiGet(`products?locale=sv&filters[slug][$eq]=${slug}`);
    const product = existing.data?.[0];
    if (!product) {
      console.log(`   ⏭  Skipping product: ${slug} (not found on production)`);
      continue;
    }
    await strapiPut('products', product.documentId, { segment });
    console.log(`   ✅ product:${slug} -> segment=${segment}`);
  }
}

async function seedProdukterPage() {
  console.log('\n🖼  Seeding produkter-page...');
  const existing = await strapiGet('produkter-page');
  if (existing.data) {
    console.log('   ⏭  Skipping produkter-page (already exists)');
    return;
  }
  // Single types have no POST/create route — PUT creates-or-updates the singleton.
  const res = await fetch(`${BASE_URL}/api/produkter-page`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      data: {
        heroH1: 'Produkter',
        heroLead: 'Välj om du letar efter produkter för privat bruk eller för företag.',
        privatCard: {
          title: 'Privat',
          description: 'Produkter för privatpersoner och pensionärer.',
        },
        foretagCard: {
          title: 'Företag',
          description: 'Lösningar för arbetsplatsen och organisationer.',
        },
        locale: 'sv',
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`PUT produkter-page failed: ${res.status} ${await res.text()}`);
  }
  console.log('   ✅ Created produkter-page');
}

async function main() {
  console.log('🌱 Seeding production content...');
  console.log(`   Target: ${BASE_URL}`);
  await seedPages();
  await seedTm9000Docs();
  await backfillProductSegment();
  await seedProdukterPage();
  console.log('\n✅ Production seed complete.');
  console.log('   Remember to delete the full-access token in Strapi Cloud admin.');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
