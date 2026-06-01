# P2B-01 — Strapi Client + TypeScript Types

## Goal

Replace the existing `src/lib/strapiClient.ts` (EaseAccess24 patterns) with a complete T-Meeting Strapi client. Create `src/types/strapi.ts` with all TypeScript types. Add environment variable setup.

## Load context

Read:
- `claude-config/CTX-01-phase2b.md`
- `claude-config/CTX-02-types.md`
- `claude-config/CTX-03-data-layer.md`

Then read:
- `src/lib/strapiClient.ts` (current — will be fully replaced)
- `.env.example` if it exists (add Strapi vars to it)

## Tasks

### Task 1 — Install @strapi/blocks-react-renderer

```bash
pnpm add @strapi/blocks-react-renderer
```

This is the only new package allowed in Phase 2b. It renders Strapi v5 Blocks fields in React.

### Task 2 — Create src/types/strapi.ts

Create a new file with all types from CTX-02 verbatim:
- `TextNode`, `LinkNode`, `InlineNode`
- `HeadingBlock`, `ParagraphBlock`, `ListItemBlock`, `ListBlock`, `Block`
- `StrapiMedia`
- `StrapiProduct`, `StrapiProductListResponse`, `StrapiProductSingleResponse`
- `StrapiService`, `StrapiServiceListResponse`, `StrapiServiceSingleResponse`
- `StrapiNewsArticle`, `StrapiNewsArticleListResponse`, `StrapiNewsArticleSingleResponse`
- `StrapiSupportDocument`, `StrapiSupportDocumentListResponse`
- `StrapiSiteSettings`, `StrapiSiteSettingsResponse`
- `StrapiSystemEntry`, `StrapiIncident`, `StrapiChangelogEntry`, `StrapiSystemStatus`, `StrapiSystemStatusResponse`

### Task 3 — Replace src/lib/strapiClient.ts

Replace the entire file with a new T-Meeting Strapi client.

Structure:

```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
  console.warn('[strapiClient] NEXT_PUBLIC_STRAPI_API_URL is not set');
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }
  return headers;
}

async function strapiGet<T>(path: string): Promise<T> {
  if (!STRAPI_URL) throw new Error('[strapiClient] NEXT_PUBLIC_STRAPI_API_URL is not configured');
  const url = `${STRAPI_URL}${path}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    cache: 'force-cache',
  });
  if (!res.ok) throw new Error(`[strapiClient] ${res.status} ${res.statusText} — ${url}`);
  return res.json();
}
```

Implement these exported functions (all locale defaults to `'sv'` for Phase 2b):

```typescript
// Products
export async function fetchProducts(locale = 'sv'): Promise<StrapiProduct[]>
export async function fetchProductBySlug(slug: string, locale = 'sv'): Promise<StrapiProduct | null>

// Services
export async function fetchServices(locale = 'sv'): Promise<StrapiService[]>
export async function fetchServiceBySlug(slug: string, locale = 'sv'): Promise<StrapiService | null>

// News Articles
export async function fetchNewsArticles(locale = 'sv'): Promise<StrapiNewsArticle[]>
export async function fetchNewsArticleBySlug(slug: string, locale = 'sv'): Promise<StrapiNewsArticle | null>
export async function fetchFeaturedNewsArticles(locale = 'sv'): Promise<StrapiNewsArticle[]>

// Support Documents
export async function fetchSupportDocuments(docType: 'manual' | 'download' | 'faq', locale = 'sv'): Promise<StrapiSupportDocument[]>

// Site Settings
export async function fetchSiteSettings(locale = 'sv'): Promise<StrapiSiteSettings | null>

// System Status
export async function fetchSystemStatus(): Promise<StrapiSystemStatus | null>
```

URL patterns to use:
- `fetchProducts`: `/products?locale=${locale}&sort=displayOrder:asc&populate=*`
- `fetchProductBySlug`: `/products?locale=${locale}&filters[slug][$eq]=${slug}&populate=*` → return `data[0] || null`
- `fetchServices`: `/services?locale=${locale}&sort=displayOrder:asc`
- `fetchServiceBySlug`: `/services?locale=${locale}&filters[slug][$eq]=${slug}&populate=*` → return `data[0] || null`
- `fetchNewsArticles`: `/news-articles?locale=${locale}&sort=publishDate:desc&populate=*`
- `fetchNewsArticleBySlug`: `/news-articles?locale=${locale}&filters[slug][$eq]=${slug}&populate=*` → return `data[0] || null`
- `fetchFeaturedNewsArticles`: `/news-articles?locale=${locale}&filters[featured][$eq]=true&sort=publishDate:desc&populate=*`
- `fetchSupportDocuments`: `/support-documents?locale=${locale}&filters[docType][$eq]=${docType}&sort=displayOrder:asc`
- `fetchSiteSettings`: `/site-setting?locale=${locale}` → return `data || null`
- `fetchSystemStatus`: `/system-status?populate=*` → return `data || null`

### Task 4 — Environment variables

Create/update `.env.local` in `tmeeting.com/` (if it doesn't exist) with:
```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
STRAPI_API_TOKEN=
```

NOTE: The actual token value must be entered by the user — Claude Code should NOT put the real token in `.env.local`. Just set `STRAPI_API_TOKEN=` empty. The user pastes their read-only token after.

Update `.env.example` to include both vars.

Verify `.gitignore` includes `.env.local`.

### Task 5 — Smoke test

With Strapi running locally, test the client works:
```bash
node -e "
const { fetchProducts } = require('./src/lib/strapiClient.ts');
fetchProducts('sv').then(p => console.log('Products:', p.length)).catch(console.error);
"
```

Or better — create a small test script `scripts/test-client.ts`:
```typescript
import { fetchProducts, fetchServices, fetchNewsArticles, fetchSystemStatus } from '../src/lib/strapiClient';

async function test() {
  const products = await fetchProducts('sv');
  console.log(`Products: ${products.length}`);
  const services = await fetchServices('sv');
  console.log(`Services: ${services.length}`);
  const articles = await fetchNewsArticles('sv');
  console.log(`Articles: ${articles.length}`);
  const status = await fetchSystemStatus();
  console.log(`SystemStatus systems: ${status?.systems.length}`);
}
test().catch(console.error);
```

Run: `npx tsx scripts/test-client.ts` — should print 6, 4, 3, 4.

## Definition of done

- `src/types/strapi.ts` exists with all types
- `src/lib/strapiClient.ts` has all 10 fetch functions
- `@strapi/blocks-react-renderer` installed
- `.env.local` template created (token value left empty for user to fill)
- Test script confirms Strapi returns correct data counts
- `pnpm build` passes (markdown data still used for products/services/blog at this point)

## Output a plan first. Wait for "Approved".
