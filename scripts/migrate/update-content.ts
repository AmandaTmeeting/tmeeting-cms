/**
 * update-content.ts — overwrites product & service descriptions in Strapi (sv)
 * with the full content captured from the old site (scripts/migrate/rich-content.ts).
 * Run with the Strapi HTTP server STOPPED (uses its own bootstrap; SQLite is single-writer):
 *   npx tsx scripts/migrate/update-content.ts
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';
import { markdownToBlocks } from '../lib/markdownToBlocks';
import { products, services, type RichItem } from './rich-content';

async function updateItems(strapi: any, uid: string, items: RichItem[], label: string) {
  console.log(`\nUpdating ${label}...`);
  for (const item of items) {
    const [doc] = await strapi.documents(uid).findMany({ filters: { slug: item.slug }, locale: 'sv' });
    if (!doc) {
      console.warn(`  ! ${label} not found: ${item.slug}`);
      continue;
    }
    await strapi.documents(uid).update({
      documentId: doc.documentId,
      locale: 'sv',
      data: {
        shortDescription: item.shortDescription,
        description: markdownToBlocks(item.descriptionMd),
      },
      status: 'published',
    });
    const blocks = markdownToBlocks(item.descriptionMd).length;
    console.log(`  [ok] ${item.slug} (${blocks} blocks)`);
  }
}

async function main() {
  console.log('Bootstrapping Strapi...');
  const app = await createStrapi(await compileStrapi()).load();
  try {
    await updateItems(app, 'api::product.product', products, 'products');
    await updateItems(app, 'api::service.service', services, 'services');
    console.log('\nContent update complete.');
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
