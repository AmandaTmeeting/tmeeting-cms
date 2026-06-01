# P2B-03 — Services/Tjanster: Markdown → Strapi

## Goal

Same pattern as P2B-02 but for Services/Tjanster. Replace tjanster markdown with Strapi fetches.

## Load context

Read:
- `claude-config/CTX-01-phase2b.md`
- `claude-config/CTX-02-types.md`
- `claude-config/CTX-03-data-layer.md`

Then read:
- `src/app/tjanster/page.tsx`
- `src/app/tjanster/[slug]/page.tsx`
- `src/components/tjanster/TjansterListing.tsx`
- `src/components/tjanster-details/Contents.tsx`
- `src/components/service-details/TableOfContent.tsx` (already updated in P2B-02)

## Tasks

### Task 1 — Refactor src/components/tjanster-details/Contents.tsx

Same refactor as product-details/Contents.tsx in P2B-02, but for services.

- Accept `service: StrapiService` as prop
- Remove `getMarkDownContent` import
- Render `service.description` with `BlocksRenderer`
- Pass `service.description` to `TableOfContent`

Keep the existing section layout identical — only the data source and rendering changes.

### Task 2 — Refactor src/components/tjanster/TjansterListing.tsx

Same refactor as ProductsListing in P2B-02.

- Accept `tjansterData: StrapiService[]` as prop
- Remove internal `getMarkDownData` call
- Map `service.name`, `service.shortDescription`, `service.slug`, `service.icon`
- Keep all existing `t()` calls for labels

### Task 3 — Update src/app/tjanster/page.tsx

```tsx
import { fetchServices } from '@/lib/strapiClient';
import TjansterListing from '@/components/tjanster/TjansterListing';

const TjansterPage = async () => {
  const services = await fetchServices('sv');
  return (
    <main className="bg-background-1 dark:bg-background-6">
      <TjansterListing tjansterData={services} />
    </main>
  );
};
```

### Task 4 — Update src/app/tjanster/[slug]/page.tsx

Same pattern as produkter/[slug]/page.tsx. Use `fetchServices` for `generateStaticParams()` and `fetchServiceBySlug` for the page data. Use `service.name` for metadata title, `service.seoDescription` if available.

Import `notFound` from `next/navigation`. Remove markdown utils imports.

### Task 5 — Delete markdown tjanster files

After build passes:
```bash
rm src/data/tjanster/ringdirekt-se.md
rm src/data/tjanster/ringdirekte.md
rm src/data/tjanster/distanstolken.md
rm src/data/tjanster/tillganglig-kundtjanst.md
rmdir src/data/tjanster
```

### Task 6 — Build verification

```bash
pnpm build
```

Must generate all 4 tjanster pages:
```
/tjanster
/tjanster/ringdirekt-se
/tjanster/ringdirekte
/tjanster/distanstolken
/tjanster/tillganglig-kundtjanst
```

## Definition of done

- TjansterListing accepts `StrapiService[]` prop
- tjanster-details/Contents renders Blocks via BlocksRenderer
- generateStaticParams() fetches from Strapi
- Markdown tjanster files deleted
- pnpm build passes, all 4 service pages generated

## Output a plan first. Wait for "Approved".
