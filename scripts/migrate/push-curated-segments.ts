/**
 * push-curated-segments.ts — pushes the curation applied locally by
 * scripts/migrate/curate-product-segments.ts to Strapi Cloud over the REST API.
 *
 * This is the scripted alternative to making the same edits by hand in the
 * Cloud admin (Content Manager → Product, and Single Types → Produkter Page).
 * Either way is fine; the admin needs no token, this needs a temporary one.
 *
 * What it does:
 *   - tm-alert            segment FORETAG -> PRIVAT
 *   - tm-no, tera-no      segment cleared (entries and content untouched, and
 *                         their detail pages were already unreachable because
 *                         middleware.ts strips a trailing -no from /produkter/*)
 *   - produkter-page      fills the six listing copy fields, if still empty
 *
 * Idempotent: re-running it changes nothing once the values already match, and
 * it never overwrites listing copy that someone has since edited in the admin.
 *
 * Run with:
 *   STRAPI_CLOUD_URL=https://celebrated-dream-14e3739304.strapiapp.com \
 *   STRAPI_CLOUD_TOKEN=your_full_access_token \
 *   npx tsx scripts/migrate/push-curated-segments.ts
 *
 * Create the token in the Cloud admin under Settings → API Tokens (type: Full
 * access), and delete it again once this has run.
 *
 * Unlike the local documents()-service scripts (which write only the draft),
 * the public REST API defaults every PUT to status=published, so no separate
 * publish step is needed here.
 */

// Marks this file as a module. Without an import or export, TypeScript treats a
// script as global scope, and its top-level names collide with the identically
// named ones in seed-production-content.ts — which fails `strapi build` for the
// whole project, not just this script.
export {};

const BASE_URL = (process.env.STRAPI_CLOUD_URL ?? '').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_CLOUD_TOKEN ?? '';

if (!BASE_URL || !TOKEN) {
  console.error('ERROR: STRAPI_CLOUD_URL and STRAPI_CLOUD_TOKEN are required');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

const SEGMENT_BY_SLUG: Record<string, 'PRIVAT' | 'FORETAG' | 'BOTH' | null> = {
  tera: 'PRIVAT',
  tm: 'PRIVAT',
  'tm-alert': 'PRIVAT',
  'tm-no': null,
  'tera-no': null,
};

const PRODUKTER_PAGE_COPY = {
  privatH1: 'Produkter för privatpersoner',
  privatLead:
    'Våra kommunikationslösningar för dig som är döv, har en hörselnedsättning, är dövblind eller har talsvårigheter.',
  privatEmptyText: 'Inga produkter är publicerade här ännu. Kom gärna tillbaka snart.',
  foretagH1: 'Produkter för företag',
  foretagLead: 'Lösningar för arbetsplatsen, myndigheter och organisationer.',
  foretagEmptyText:
    'Våra företagslösningar publiceras här inom kort. Kontakta oss gärna under tiden så berättar vi mer.',
};

async function strapiGet(endpoint: string): Promise<{ data: any }> {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as { data: any };
}

async function strapiPut(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function pushProductSegments() {
  console.log('\n📦 Product segments...');
  for (const [slug, segment] of Object.entries(SEGMENT_BY_SLUG)) {
    const found = await strapiGet(`products?locale=sv&filters[slug][$eq]=${slug}`);
    const product = found.data?.[0];
    if (!product) {
      console.log(`   ⏭  ${slug} (not found on production)`);
      continue;
    }
    if (product.segment === segment) {
      console.log(`   ⏭  ${slug} (already ${segment ?? 'cleared'})`);
      continue;
    }
    await strapiPut(`products/${product.documentId}`, { segment });
    console.log(`   ✅ ${slug}: ${product.segment} -> ${segment ?? 'cleared'}`);
  }
}

async function pushProdukterPageCopy() {
  console.log('\n🖼  Produkter Page listing copy...');
  const existing = await strapiGet('produkter-page?locale=sv');
  if (!existing.data) {
    console.log('   ⏭  produkter-page not found');
    return;
  }
  // Only fill fields that are still empty, so admin edits are never clobbered.
  const toWrite = Object.fromEntries(
    Object.entries(PRODUKTER_PAGE_COPY).filter(([key]) => !existing.data[key])
  );
  if (!Object.keys(toWrite).length) {
    console.log('   ⏭  all six fields already filled');
    return;
  }
  await strapiPut('produkter-page', toWrite);
  console.log(`   ✅ filled: ${Object.keys(toWrite).join(', ')}`);
}

async function main() {
  console.log(`🌱 Pushing curated segments to ${BASE_URL}`);
  await pushProductSegments();
  await pushProdukterPageCopy();
  console.log('\n✅ Done. Remember to delete the full-access token in the Cloud admin.');
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
