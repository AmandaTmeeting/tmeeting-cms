# Strapi v5 API Shape — T-Meeting CMS

Reference for the Phase 2b Next.js integration. All response examples are real responses captured from the local Strapi instance.

---

## Overview

### v5 flattened response structure

Strapi v5 flattened the API response compared to v4. There is **no `attributes` nesting** — all fields are directly on each data object.

```json
// v4 (OLD — do not use)
{ "data": { "id": 1, "attributes": { "name": "TERA", "slug": "tera" } } }

// v5 (current)
{ "data": { "id": 2, "documentId": "lol6ga8vw3di4ysg3xmdccoe", "name": "TERA", "slug": "tera" } }
```

### `documentId` vs `id`

- `documentId` — stable string identifier, use this for API calls (e.g. `/api/products/lol6ga8vw3di4ysg3xmdccoe`)
- `id` — internal numeric DB row ID, changes across environments; do not use for API calls or URLs

### Locale filtering

Pass `?locale=sv` to get Swedish content. Only Swedish is seeded in Phase 2a.

```
GET /api/products?locale=sv
GET /api/products/lol6ga8vw3di4ysg3xmdccoe?locale=sv
```

Requesting a locale with no content (e.g. `?locale=en`) returns an empty `data` array — this is correct behavior until translations are added in Phase 2d.

### Populate

- `?populate=*` — populates all relations and media fields one level deep
- Without populate, media fields (`heroImage`, `cardImage`) return `null`
- Component fields (SystemStatus `systems`, `incidents`, `changelog`) require populate to be included

### Pagination

Collection type list responses include a `meta.pagination` object:
```json
"meta": {
  "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 6 }
}
```

### Blocks fields

Rich text fields (`description` on Product/Service, `body` on NewsArticle) are arrays of block objects — not strings. See the Product example below for the full shape.

---

## Product

### List: `GET /api/products?locale=sv`

```json
{
  "data": [
    {
      "id": 2,
      "documentId": "lol6ga8vw3di4ysg3xmdccoe",
      "name": "TERA",
      "slug": "tera",
      "shortDescription": "Realtidstexttelefoni för hörselskadade och döva — TERA gör det möjligt att delta i telefonsamtal via text i realtid.",
      "description": [
        { "type": "heading", "level": 2, "children": [{ "type": "text", "text": "TERA — Realtidstexttelefoni" }] },
        { "type": "paragraph", "children": [{ "type": "text", "text": "TERA är T-Meetings app för realtidstexttelefoni..." }] },
        {
          "type": "list",
          "format": "unordered",
          "children": [
            { "type": "list-item", "children": [{ "type": "text", "text": "Realtidstext under pågående samtal" }] },
            { "type": "list-item", "children": [{ "type": "text", "text": "Stöd för vanliga telefonsamtal" }] }
          ]
        }
      ],
      "icon": "ns-shape-20",
      "market": "BOTH",
      "seoTitle": null,
      "seoDescription": null,
      "displayOrder": 1,
      "createdAt": "2026-05-31T19:07:09.782Z",
      "updatedAt": "2026-05-31T19:07:09.782Z",
      "publishedAt": "2026-05-31T19:07:09.786Z",
      "locale": "sv"
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 6 }
  }
}
```

### Single: `GET /api/products/{documentId}?locale=sv&populate=*`

Same as list item, plus media and localizations:
```json
{
  "data": {
    "id": 2,
    "documentId": "lol6ga8vw3di4ysg3xmdccoe",
    "name": "TERA",
    "slug": "tera",
    "shortDescription": "...",
    "description": [ /* blocks array */ ],
    "icon": "ns-shape-20",
    "market": "BOTH",
    "seoTitle": null,
    "seoDescription": null,
    "displayOrder": 1,
    "createdAt": "2026-05-31T19:07:09.782Z",
    "updatedAt": "2026-05-31T19:07:09.782Z",
    "publishedAt": "2026-05-31T19:07:09.786Z",
    "locale": "sv",
    "heroImage": null,
    "cardImage": null,
    "localizations": []
  },
  "meta": {}
}
```

**Fields summary:**

| Field | Type | Notes |
|---|---|---|
| `documentId` | string | Use for API calls |
| `name` | string | Localized |
| `slug` | string | Shared across locales |
| `shortDescription` | string | Localized |
| `description` | Block[] | Localized, see Blocks shape below |
| `icon` | string | CSS class, e.g. `ns-shape-20` |
| `market` | `"SE"` \| `"NO"` \| `"BOTH"` | Not localized |
| `heroImage` | null \| MediaObject | Populated with `?populate=*` |
| `cardImage` | null \| MediaObject | Populated with `?populate=*` |
| `displayOrder` | number | Sort key |
| `seoTitle` | string \| null | |
| `seoDescription` | string \| null | |
| `locale` | string | e.g. `"sv"` |

---

## Service

### Single: `GET /api/services/{documentId}?locale=sv`

```json
{
  "data": {
    "id": 2,
    "documentId": "tbpsz1ex48nva4ktizbkqsiv",
    "name": "Ring Direkte (SE)",
    "slug": "ringdirekt-se",
    "shortDescription": "Direktsamtalstjänst för hörselskadade och döva i Sverige...",
    "description": [ /* blocks array */ ],
    "icon": "ns-shape-17",
    "market": "SE",
    "seoTitle": null,
    "seoDescription": null,
    "displayOrder": 1,
    "createdAt": "2026-05-31T19:07:09.845Z",
    "updatedAt": "2026-05-31T19:07:09.845Z",
    "publishedAt": "2026-05-31T19:07:09.846Z",
    "locale": "sv"
  },
  "meta": {}
}
```

Same field shape as Product except no `heroImage`/`cardImage`.

---

## NewsArticle

### Single: `GET /api/news-articles/{documentId}?locale=sv`

```json
{
  "data": {
    "id": 2,
    "documentId": "ei2njp17329wtxb5irxfh5fp",
    "title": "TERA — tillgänglig realtidstexttelefoni",
    "slug": "tera-tillganglig-realtidstexttelefoni",
    "excerpt": "T-Meeting lanserar den senaste versionen av TERA...",
    "body": [ /* blocks array */ ],
    "tag": "produktnyheter",
    "author": "T-Meeting",
    "readTime": "3 min läsning",
    "featured": true,
    "publishDate": "2026-01-15",
    "seoTitle": null,
    "seoDescription": null,
    "createdAt": "2026-05-31T19:07:09.881Z",
    "updatedAt": "2026-05-31T19:07:09.881Z",
    "publishedAt": "2026-05-31T19:07:09.882Z",
    "locale": "sv"
  },
  "meta": {}
}
```

**Fields summary:**

| Field | Type | Notes |
|---|---|---|
| `title` | string | Localized |
| `slug` | string | Shared across locales |
| `excerpt` | string | Localized |
| `body` | Block[] | Localized |
| `tag` | string | e.g. `"produktnyheter"`, `"tjanster"`, `"nyheter"` |
| `author` | string | Not localized, `"T-Meeting"` |
| `readTime` | string | Localized, e.g. `"3 min läsning"` |
| `featured` | boolean | Not localized |
| `publishDate` | string | ISO date, e.g. `"2026-01-15"` |
| `coverImage` | null \| MediaObject | Populated with `?populate=*` |

---

## SupportDocument

### Single: `GET /api/support-documents/{documentId}?locale=sv`

```json
{
  "data": {
    "id": 2,
    "documentId": "hy309gx1l8cdt2brqh6afeha",
    "title": "TERA — Användarmanual",
    "slug": "tera-anvandarmanual",
    "docType": "manual",
    "description": "Användarmanual för TERA realtidstexttelefoni.",
    "version": "1.0",
    "externalUrl": "#",
    "productName": "TERA",
    "displayOrder": 1,
    "createdAt": "2026-05-31T19:07:09.907Z",
    "updatedAt": "2026-05-31T19:07:09.907Z",
    "publishedAt": "2026-05-31T19:07:09.908Z",
    "locale": "sv"
  },
  "meta": {}
}
```

**Fields summary:**

| Field | Type | Notes |
|---|---|---|
| `docType` | `"manual"` \| `"download"` \| `"faq"` | Not localized |
| `description` | string | Plain text, localized |
| `version` | string | e.g. `"1.0"` |
| `externalUrl` | string | `"#"` placeholder until real URLs added |
| `productName` | string | e.g. `"TERA"` — plain text, not a relation |
| `file` | null \| MediaObject | For PDF uploads (added later) |

---

## SiteSettings (single type)

### `GET /api/site-setting?locale=sv`

```json
{
  "data": {
    "id": 1,
    "documentId": "smcz9exo7dcja8klvep991ek",
    "companyName": "T-Meeting",
    "legalName": "Europea i Malmö AB",
    "tagline": "Teknik som för människor närmare",
    "email": "mail@tmeeting.se",
    "salesEmail": "sales@tmeeting.se",
    "phone": "+46 (0)40 661 41 80",
    "address": "Amiralsgatan 20, 211 55 Malmö, Sweden",
    "spotifyEmbedUrl": "https://open.spotify.com/embed/show/3CbX7Y1V09PMEqpb8ucZTH?utm_source=generator&theme=0",
    "facebookUrl": "https://facebook.com/tmeeting.se",
    "twitterUrl": "https://x.com/T_meeting",
    "instagramUrl": "https://instagram.com/tmeetingsweden",
    "youtubeUrl": "https://www.youtube.com/user/Tmeetingchannel",
    "footerCopyright": "© 2026 T-Meeting",
    "createdAt": "2026-05-31T19:07:09.942Z",
    "updatedAt": "2026-05-31T19:07:09.942Z",
    "publishedAt": "2026-05-31T19:07:09.940Z",
    "locale": "sv"
  },
  "meta": {}
}
```

Note: single type response has `data` as an **object**, not an array.

---

## SystemStatus (single type with components)

### `GET /api/system-status?locale=sv&populate=*`

```json
{
  "data": {
    "id": 1,
    "documentId": "je5593vx9jqx81nnt7rffmvo",
    "createdAt": "2026-05-31T19:07:09.949Z",
    "updatedAt": "2026-05-31T19:07:09.949Z",
    "publishedAt": "2026-05-31T19:07:09.945Z",
    "locale": "sv",
    "systems": [
      { "id": 1, "name": "TERA", "slug": "tera", "status": "operational", "uptime": 99.9, "description": "Realtidstexttelefoni" },
      { "id": 2, "name": "TM", "slug": "tm", "status": "operational", "uptime": 99.8, "description": "Videotelefoni" },
      { "id": 3, "name": "Ring Direkte (SE)", "slug": "ringdirekt-se", "status": "operational", "uptime": 99.9, "description": "Direktsamtal Sverige" },
      { "id": 4, "name": "Ring Direkte (NO)", "slug": "ringdirekte", "status": "operational", "uptime": 99.7, "description": "Direktsamtal Norge" }
    ],
    "incidents": [],
    "changelog": [
      { "id": 1, "version": "1.0", "date": "2026-01-01", "description": "Lansering av T-Meetings nya driftstatussida.", "entryType": "feature" }
    ],
    "localizations": []
  },
  "meta": {}
}
```

Note: component fields (`systems`, `incidents`, `changelog`) **require** `?populate=*` to appear in the response.

**`systems[].status` enum:** `operational` | `degraded` | `down` | `maintenance`

**`incidents[].incidentStatus` enum:** `investigating` | `identified` | `monitoring` | `resolved`

**`changelog[].entryType` enum:** `feature` | `fix` | `maintenance`

---

## Blocks field shape

Rich text fields (`description`, `body`) return an array of block objects. The frontend renders these with `@strapi/blocks-react-renderer`.

```typescript
type TextNode = { type: 'text'; text: string; bold?: true; italic?: true; underline?: true }
type LinkNode = { type: 'link'; url: string; children: TextNode[] }
type InlineNode = TextNode | LinkNode

type HeadingBlock = { type: 'heading'; level: 2 | 3; children: TextNode[] }
type ParagraphBlock = { type: 'paragraph'; children: InlineNode[] }
type ListItemBlock = { type: 'list-item'; children: InlineNode[] }
type ListBlock = { type: 'list'; format: 'unordered' | 'ordered'; children: ListItemBlock[] }
type Block = HeadingBlock | ParagraphBlock | ListBlock
```

---

## Phase 2b setup

### Environment variables

**`tmeeting-cms` (this repo):**
```
HOST=0.0.0.0
PORT=1337
```

**`tmeeting.com` (Next.js frontend):**
```
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
STRAPI_API_TOKEN=<read-only token — see below>
```

### Creating the read-only API token

The Next.js frontend needs a read-only API token to access non-public endpoints (and for future use in Phase 2d when public access may be restricted).

**Steps (done once in the Strapi admin UI):**

1. Start Strapi: `npm run develop`
2. Open `http://localhost:1337/admin`
3. Go to **Settings → API Tokens → + Create new API Token**
4. Fill in:
   - **Name:** `nextjs-frontend-readonly`
   - **Token type:** Read-only
   - **Token duration:** Unlimited
5. Click **Save**
6. Copy the generated token (shown only once)
7. Add to the Next.js project's `.env.local`:
   ```
   STRAPI_API_TOKEN=<paste token here>
   ```

The token is passed as a Bearer header:
```
Authorization: Bearer <STRAPI_API_TOKEN>
```

### Typical Next.js fetch pattern

```typescript
const res = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?locale=${locale}&populate=*`,
  {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 60 },
  }
);
const { data } = await res.json();
// data is Block[] — fields directly on each object, no .attributes
```
