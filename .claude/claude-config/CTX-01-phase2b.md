# CTX-01 — Phase 2b Context

## What this phase does

Connects the Next.js frontend (`tmeeting.com`) to the Strapi CMS (`tmeeting-cms`). Replaces all markdown data sources with Strapi API fetches. All work in this phase happens in `tmeeting.com` ONLY — never touch `tmeeting-cms`.

## Phase 2b scope (5 prompts)

- **P2B-01**: Strapi client + TypeScript types (based on real API-SHAPE.md responses)
- **P2B-02**: Replace Products markdown → Strapi (listing + detail + generateStaticParams)
- **P2B-03**: Replace Services/Tjanster markdown → Strapi (same pattern)
- **P2B-04**: Replace Blog/Nyheter markdown → Strapi
- **P2B-05**: Replace Support pages (manualer, nedladdning, driftstatus) → Strapi + final build

## Current frontend state

- All components are i18n-complete (PROMPT-15 to PROMPT-21 done)
- Pages currently read from markdown files in `src/data/products/`, `src/data/tjanster/`, `src/data/blogs/`
- `src/lib/strapiClient.ts` exists but has old EaseAccess24 blog fetch patterns — will be replaced entirely
- `src/data/system-status.ts` is a hardcoded TypeScript data file — will be replaced with a Strapi fetch

## Architecture

- Next.js static export (`output: 'export'`) — all Strapi fetches happen at BUILD TIME
- `cache: 'force-cache'` on all fetches (required for static export)
- API token passed as Bearer header (read-only token from Strapi admin)
- Strapi runs locally at `http://localhost:1337` during development
- Strapi Cloud URL used in production (Phase 2d)
- `generateStaticParams()` fetches slugs from Strapi — replaces `getMarkDownData()`

## Environment variables needed in tmeeting.com

Add to `.env.local` in `tmeeting.com/`:
```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
STRAPI_API_TOKEN=<your read-only token from P2A-05>
```

Add to `.env.example`:
```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
STRAPI_API_TOKEN=
```

## Strapi v5 critical notes

- No `attributes` nesting — fields are directly on data objects
- `documentId` is the stable identifier (string), not `id` (number)
- Blocks fields (`description`, `body`) return JSON arrays — render with `@strapi/blocks-react-renderer`
- Locale passed as `?locale=sv` query param (for now, always `sv` — locale routing comes in Phase 2c)
- `?populate=*` required for media fields and components
- Single types return `data` as object (not array)
- Collection types return `data` as array with `meta.pagination`

## Absolute rules

1. Never touch `next.config.ts` core settings (`output: 'export'`, `trailingSlash`, `unoptimized`)
2. No new npm packages except `@strapi/blocks-react-renderer` (needed for Blocks rendering)
3. All fetches use `cache: 'force-cache'` — never `no-store` or `revalidate` (breaks static export)
4. Keep `src/data/products/*.md`, `src/data/tjanster/*.md`, `src/data/blogs/*.md` in place until the corresponding prompt explicitly removes them
5. Keep `src/data/system-status.ts` until P2B-05 explicitly replaces it
6. Output a plan first, wait for "Approved"
7. After every prompt: `pnpm build` must pass with 0 errors
8. Strapi must be running locally (`npm run develop` in tmeeting-cms) during build
