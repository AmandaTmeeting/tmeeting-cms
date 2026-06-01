# tmeeting-cms

Strapi v5 CMS backend for [tmeeting.se](https://tmeeting.se) — T-Meeting's website for communication technology for deaf, hard-of-hearing, deafblind, and speech-impaired people.

## Tech stack

- **Strapi v5** with TypeScript template
- **SQLite** (`better-sqlite3`) for local development
- **Strapi Cloud** with Postgres for production (configured in Phase 2d)
- **i18n**: 33 locales, Swedish (`sv`) as default
- **Blocks editor** for all rich text fields (renders via `@strapi/blocks-react-renderer` on the frontend)

## Prerequisites

- Node.js ≥ 20 (≤ 24)
- npm ≥ 6

## Local setup

```bash
npm install
cp .env.example .env
# Edit .env — fill in APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET
npm run develop
```

Admin UI available at `http://localhost:1337/admin`.

## Seeding content

Populate all Swedish content (6 products, 4 services, 3 news articles, 5 support docs, site settings, system status):

```bash
npm run seed
```

The seed script is idempotent — safe to run multiple times. It skips entries that already exist.

## Content types

| Type | Kind | Description |
|---|---|---|
| **Product** | Collection | T-Meeting's hardware/software products (TERA, TM, etc.) |
| **Service** | Collection | Communication services (Ring Direkte, Distanstolken, etc.) |
| **NewsArticle** | Collection | News and product announcements |
| **SupportDocument** | Collection | Manuals, downloads, FAQs |
| **SiteSettings** | Single | Company info, contact details, social links |
| **SystemStatus** | Single | Operational status for each system, incidents, changelog |

## i18n

- 33 locales configured: `ar bg ca cs da de el en es et fa fi fr ga hr hu is it lt lv mk mt nb nl pl pt ro sk sl so sq sr sv`
- Default locale: `sv` (Swedish)
- Phase 2a: only Swedish content is seeded
- Translations added in Phase 2d

## Scripts

| Command | Description |
|---|---|
| `npm run develop` | Start in development mode with hot reload |
| `npm run start` | Start in production mode |
| `npm run build` | Build admin panel |
| `npm run seed` | Seed all Swedish content |

## API reference

See [API-SHAPE.md](./API-SHAPE.md) for the full REST API response shapes, Blocks format, and Phase 2b integration guide (including how to create the read-only API token for the Next.js frontend).

## Phase roadmap

| Phase | Scope |
|---|---|
| **2a (done)** | Strapi setup, all content types, Swedish content seeded |
| **2b** | Next.js Strapi client, replace markdown with Strapi fetches |
| **2c** | Locale routing, language switcher |
| **2d** | Translations, metadata, pipeline, permissions, QA, Strapi Cloud deploy |
