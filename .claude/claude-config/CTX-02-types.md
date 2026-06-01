# CTX-02 — Strapi TypeScript Types & API Shapes

Exact types derived from real API responses in API-SHAPE.md. Use these verbatim in `src/types/strapi.ts`.

---

## Blocks types

```typescript
export type TextNode = {
  type: 'text';
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};

export type LinkNode = {
  type: 'link';
  url: string;
  children: TextNode[];
};

export type InlineNode = TextNode | LinkNode;

export type HeadingBlock = {
  type: 'heading';
  level: 2 | 3;
  children: TextNode[];
};

export type ParagraphBlock = {
  type: 'paragraph';
  children: InlineNode[];
};

export type ListItemBlock = {
  type: 'list-item';
  children: InlineNode[];
};

export type ListBlock = {
  type: 'list';
  format: 'unordered' | 'ordered';
  children: ListItemBlock[];
};

export type Block = HeadingBlock | ParagraphBlock | ListBlock;
```

---

## Media type

```typescript
export type StrapiMedia = {
  id: number;
  documentId: string;
  name: string;
  url: string;
  width: number | null;
  height: number | null;
  alternativeText: string | null;
  formats: Record<string, { url: string; width: number; height: number }> | null;
};
```

---

## Product

```typescript
export type StrapiProduct = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: Block[] | null;
  icon: string | null;
  market: 'SE' | 'NO' | 'BOTH' | null;
  heroImage: StrapiMedia | null;
  cardImage: StrapiMedia | null;
  seoTitle: string | null;
  seoDescription: string | null;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type StrapiProductListResponse = {
  data: StrapiProduct[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};

export type StrapiProductSingleResponse = {
  data: StrapiProduct;
  meta: Record<string, never>;
};
```

---

## Service

```typescript
export type StrapiService = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: Block[] | null;
  icon: string | null;
  market: 'SE' | 'NO' | 'BOTH' | null;
  heroImage: StrapiMedia | null;
  seoTitle: string | null;
  seoDescription: string | null;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type StrapiServiceListResponse = {
  data: StrapiService[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};

export type StrapiServiceSingleResponse = {
  data: StrapiService;
  meta: Record<string, never>;
};
```

---

## NewsArticle

```typescript
export type StrapiNewsArticle = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: Block[] | null;
  tag: string | null;
  author: string | null;
  readTime: string | null;
  featured: boolean;
  publishDate: string | null;
  coverImage: StrapiMedia | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type StrapiNewsArticleListResponse = {
  data: StrapiNewsArticle[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};

export type StrapiNewsArticleSingleResponse = {
  data: StrapiNewsArticle;
  meta: Record<string, never>;
};
```

---

## SupportDocument

```typescript
export type StrapiSupportDocument = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  docType: 'manual' | 'download' | 'faq';
  description: string | null;
  version: string | null;
  externalUrl: string | null;
  productName: string | null;
  file: StrapiMedia | null;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type StrapiSupportDocumentListResponse = {
  data: StrapiSupportDocument[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};
```

---

## SiteSettings (single type)

```typescript
export type StrapiSiteSettings = {
  id: number;
  documentId: string;
  companyName: string;
  legalName: string;
  tagline: string | null;
  email: string;
  salesEmail: string;
  phone: string;
  address: string;
  spotifyEmbedUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  footerCopyright: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type StrapiSiteSettingsResponse = {
  data: StrapiSiteSettings;
  meta: Record<string, never>;
};
```

---

## SystemStatus (single type with components)

```typescript
export type StrapiSystemEntry = {
  id: number;
  name: string;
  slug: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  description: string | null;
};

export type StrapiIncident = {
  id: number;
  title: string;
  incidentStatus: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  date: string;
  description: string | null;
};

export type StrapiChangelogEntry = {
  id: number;
  version: string;
  date: string;
  description: string | null;
  entryType: 'feature' | 'fix' | 'maintenance';
};

export type StrapiSystemStatus = {
  id: number;
  documentId: string;
  systems: StrapiSystemEntry[];
  incidents: StrapiIncident[];
  changelog: StrapiChangelogEntry[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
};

export type StrapiSystemStatusResponse = {
  data: StrapiSystemStatus;
  meta: Record<string, never>;
};
```

---

## Fetch helper types

```typescript
// Used internally in strapiClient.ts
type StrapiRequestOptions = {
  locale?: string;
  populate?: string;
  filters?: Record<string, string>;
  sort?: string;
  pageSize?: number;
};
```
