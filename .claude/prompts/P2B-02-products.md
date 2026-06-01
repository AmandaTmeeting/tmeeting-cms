# P2B-02 — Products: Markdown → Strapi

## Goal

Replace the Products markdown data layer with Strapi fetches. Refactor the product listing and detail components to render Strapi data including Blocks content.

## Load context

Read:
- `claude-config/CTX-01-phase2b.md`
- `claude-config/CTX-02-types.md`
- `claude-config/CTX-03-data-layer.md`

Then read current state of:
- `src/app/produkter/page.tsx`
- `src/app/produkter/[slug]/page.tsx`
- `src/components/products/ProductsListing.tsx`
- `src/components/product-details/Contents.tsx`
- `src/components/service-details/TableOfContent.tsx`
- `src/lib/strapiClient.ts` (completed in P2B-01)
- `src/types/strapi.ts` (completed in P2B-01)

## Tasks

### Task 1 — Update TableOfContent.tsx

Currently accepts `markdownContent: string` and parses heading lines with regex.

Refactor to accept `blocks: Block[]` and extract headings by filtering the blocks array:

```tsx
import type { Block, HeadingBlock } from '@/types/strapi';

interface TableOfContentProps {
  blocks: Block[];
}

const TableOfContent = ({ blocks }: TableOfContentProps) => {
  const headings = blocks
    .filter((b): b is HeadingBlock => b.type === 'heading')
    .map(h => ({
      text: h.children.map(c => c.text).join(''),
      id: h.children.map(c => c.text).join('').toLowerCase()
        .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      level: h.level,
    }));
  // rest of rendering stays the same
};
```

Keep the existing rendering logic unchanged — only the prop type and heading extraction change.

### Task 2 — Refactor src/components/product-details/Contents.tsx

Currently calls `getMarkDownContent()` internally and renders with `ReactMarkdown`.

Refactor to:
- Accept `product: StrapiProduct` as prop
- Remove `getMarkDownContent` import
- Render `product.description` with `BlocksRenderer` instead of `ReactMarkdown`
- Pass `product.description` (Block[]) to `TableOfContent`

```tsx
'use client';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { StrapiProduct } from '@/types/strapi';
import TableOfContent from '../service-details/TableOfContent';
import RevealAnimation from '../animation/RevealAnimation';

const Contents = ({ product }: { product: StrapiProduct }) => {
  return (
    <section className="pt-32 pb-24 sm:pt-36 md:pt-42 md:pb-36 lg:pb-44 xl:pt-[180px] xl:pb-[200px]">
      <div className="main-container">
        <div className="flex items-start lg:gap-[72px]">
          <div className="w-full max-w-full lg:max-w-[767px]">
            <RevealAnimation delay={0.3}>
              <div className="services-details-content mb-[72px]">
                <BlocksRenderer content={product.description ?? []} />
              </div>
            </RevealAnimation>
          </div>
          <TableOfContent blocks={product.description ?? []} />
        </div>
      </div>
    </section>
  );
};
```

### Task 3 — Refactor src/components/products/ProductsListing.tsx

Currently calls `getMarkDownData()` internally.

Refactor to:
- Remove internal `getMarkDownData` call
- Accept `productsData: StrapiProduct[]` as prop
- Map `product.name` → card title, `product.shortDescription` → card description, `product.slug` → href, `product.icon` → icon class

Keep all existing i18n `t()` calls for labels (h1, description, btnReadMore). Only the per-card data changes from markdown shape to Strapi shape.

The card render changes:
```tsx
// Before (markdown):
product.title, product.description, product.slug, product.icon

// After (Strapi):
product.name, product.shortDescription, product.slug, product.icon
```

### Task 4 — Update src/app/produkter/page.tsx

```tsx
import { fetchProducts } from '@/lib/strapiClient';
import ProductsListing from '@/components/products/ProductsListing';

const ProduktPage = async () => {
  const products = await fetchProducts('sv');
  return (
    <main className="bg-background-1 dark:bg-background-6">
      <ProductsListing productsData={products} />
    </main>
  );
};
```

Remove `getMarkDownData` import.

### Task 5 — Update src/app/produkter/[slug]/page.tsx

```tsx
import { fetchProducts, fetchProductBySlug } from '@/lib/strapiClient';
import Contents from '@/components/product-details/Contents';
import ProductCTA from '@/components/product-details/ProductCTA';

export async function generateStaticParams() {
  const products = await fetchProducts('sv');
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug, 'sv');
  return {
    ...defaultMetadata,
    title: `${product?.name ?? slug} — T-Meeting`,
    ...(product?.seoDescription && { description: product.seoDescription }),
  };
}

const ProduktDetailPage = async ({ params }) => {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug, 'sv');
  if (!product) notFound();
  return (
    <main className="bg-background-3 dark:bg-background-7">
      <Contents product={product} />
      <ProductCTA />
    </main>
  );
};
```

Import `notFound` from `next/navigation`. Remove `getMarkDownContent`, `getMarkDownData` imports.

### Task 6 — Delete markdown product files

After verifying the build passes:
```bash
rm src/data/products/tera.md
rm src/data/products/tm.md
rm src/data/products/tm-pc-flerpart.md
rm src/data/products/tm-alert.md
rm src/data/products/tm-no.md
rm src/data/products/tera-no.md
rmdir src/data/products
```

### Task 7 — Build verification

```bash
pnpm build
```

Must generate all 6 product pages. Check output for:
```
/produkter
/produkter/tera
/produkter/tm
/produkter/tm-pc-flerpart
/produkter/tm-alert
/produkter/tm-no
/produkter/tera-no
```

## Definition of done

- ProductsListing accepts `StrapiProduct[]` prop
- Contents renders Blocks via BlocksRenderer
- TableOfContent accepts `Block[]` and extracts headings correctly
- generateStaticParams() fetches from Strapi
- Markdown product files deleted
- pnpm build passes, all 6 product pages generated

## Output a plan first. Wait for "Approved".
