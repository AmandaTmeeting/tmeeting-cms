# CTX-03 — Current Frontend Data Layer (To Replace)

What currently exists and what replaces it in each prompt.

---

## Files being replaced

### Products

| Current | Replacement |
|---|---|
| `src/data/products/*.md` (6 files) | Strapi Product collection |
| `src/utils/getMarkDownData('src/data/products')` | `fetchProducts(locale)` |
| `src/utils/getMarkDownContent('src/data/products/', slug)` | `fetchProductBySlug(slug, locale)` |
| `src/components/product-details/Contents.tsx` uses `getMarkDownContent` internally | Refactored to accept `StrapiProduct` as prop |
| `src/components/products/ProductsListing.tsx` uses `getMarkDownData` internally | Refactored to accept `StrapiProduct[]` as prop |

### Services/Tjanster

| Current | Replacement |
|---|---|
| `src/data/tjanster/*.md` (4 files) | Strapi Service collection |
| `src/utils/getMarkDownData('src/data/tjanster')` | `fetchServices(locale)` |
| `src/utils/getMarkDownContent('src/data/tjanster/', slug)` | `fetchServiceBySlug(slug, locale)` |
| `src/components/tjanster-details/Contents.tsx` uses `getMarkDownContent` | Refactored to accept `StrapiService` as prop |
| `src/components/tjanster/TjansterListing.tsx` uses `getMarkDownData` | Refactored to accept `StrapiService[]` as prop |

### Blog/Nyheter

| Current | Replacement |
|---|---|
| `src/data/blogs/*.md` (3 files) | Strapi NewsArticle collection |
| `src/utils/getMarkDownData('src/data/blogs')` | `fetchNewsArticles(locale)` |
| `src/utils/getMarkDownContent('src/data/blogs/', slug)` | `fetchNewsArticleBySlug(slug, locale)` |
| Blog components receive `IBlogPost[]` prop | Refactored to accept `StrapiNewsArticle[]` prop |

### Support

| Current | Replacement |
|---|---|
| `src/data/system-status.ts` (hardcoded TS) | Strapi SystemStatus single type |
| `getStatusPageData()` from system-status.ts | `fetchSystemStatus()` |
| DocsContent.tsx has hardcoded manuals array | Refactored to accept `StrapiSupportDocument[]` prop |
| Download/Content.tsx has hardcoded content | Refactored to accept `StrapiSupportDocument[]` prop |

---

## Key component changes needed

### Contents.tsx (product-details and tjanster-details)

Currently calls `getMarkDownContent()` internally and renders with `ReactMarkdown`.

After refactor:
- Accepts `product: StrapiProduct` (or `service: StrapiService`) as prop
- Renders `description` (Blocks array) with `@strapi/blocks-react-renderer`'s `BlocksRenderer`
- `TableOfContent` receives the Blocks array (not markdown string) — needs updating too

### TableOfContent.tsx

Currently parses a markdown string for headings.

After refactor:
- Accepts `blocks: Block[]` instead of `markdownContent: string`
- Extracts headings by filtering `block.type === 'heading'`
- Each heading: `{ id: slugify(heading text), text: heading text }`

### FeaturedBlog.tsx and BlogShowcase.tsx

Currently accept `IBlogPost[]`.

After refactor: accept `StrapiNewsArticle[]`. Map fields:
- `IBlogPost.title` → `StrapiNewsArticle.title`
- `IBlogPost.description` → `StrapiNewsArticle.excerpt`
- `IBlogPost.thumbnail` → `StrapiNewsArticle.coverImage?.url` (or placeholder if null)
- `IBlogPost.tag` → `StrapiNewsArticle.tag`
- `IBlogPost.author` → `StrapiNewsArticle.author`
- `IBlogPost.readTime` → `StrapiNewsArticle.readTime`
- `IBlogPost.featured` → `StrapiNewsArticle.featured`
- `IBlogPost.publishDate` → `StrapiNewsArticle.publishDate`
- `IBlogPost.slug` → `StrapiNewsArticle.slug`

### DocsContent.tsx

Currently has a hardcoded `manuals` array.

After refactor: accepts `documents: StrapiSupportDocument[]` as prop. Maps `docType === 'manual'` filter externally in page.tsx.

---

## Rendering Blocks

Install: `@strapi/blocks-react-renderer`

Usage in a client component:
```tsx
'use client';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { Block } from '@/types/strapi';

const ProductBody = ({ content }: { content: Block[] }) => {
  return (
    <div className="services-details-content mb-[72px]">
      <BlocksRenderer content={content} />
    </div>
  );
};
```

The `BlocksRenderer` handles all block types (headings, paragraphs, lists, bold, links) automatically. No custom renderers needed for Phase 2b — default rendering matches what `ReactMarkdown` was producing.

---

## Static export compatibility

`output: 'export'` means ALL data fetching happens at build time. The pattern for every page:

```tsx
// page.tsx (server component — no 'use client')
import { fetchProducts } from '@/lib/strapiClient';

export async function generateStaticParams() {
  const products = await fetchProducts('sv');
  return products.map(p => ({ slug: p.slug }));
}

const ProduktPage = async () => {
  const products = await fetchProducts('sv');
  return <ProductsListing productsData={products} />;
};
```

The locale is hardcoded to `'sv'` for now — Phase 2c adds locale routing.

---

## Error handling for build

If Strapi is unreachable during `pnpm build`, the build will fail. This is intentional — the site cannot build without content. Document in README: "Strapi must be running during build."

For `generateStaticParams()` specifically: if it throws, Next.js will abort the build with a clear error. Do not catch and swallow errors silently.
