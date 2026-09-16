/**
 * seed-legal-pages.ts — creates `integritetspolicy` and `tillganglighet` entries
 * in the generic Page content-type, sourced from the current i18n text in
 * tmeeting.com/public/locales/sv/common.json. Idempotent (dedupes by slug).
 * Run with the Strapi HTTP server STOPPED (SQLite is single-writer):
 *   npx tsx scripts/migrate/seed-legal-pages.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

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

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    for (const p of PAGES) {
      const existing = await app.documents('api::page.page').findMany({ filters: { slug: p.slug } });
      if (existing.length) {
        console.log(`  [skip] page:${p.slug} (already exists)`);
        continue;
      }
      await app.documents('api::page.page').create({
        data: {
          title: p.title,
          slug: p.slug,
          body: p.body as any,
          seoDescription: p.seoDescription,
          locale: 'sv',
        },
        status: 'published',
      });
      console.log(`  [ok] page:${p.slug} (${p.body.length} blocks)`);
    }
    console.log('\nLegal pages seed complete.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
