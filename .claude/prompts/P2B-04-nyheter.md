# P2B-04 — Blog/Nyheter: Markdown → Strapi

## Goal

Replace blog markdown data with Strapi NewsArticle fetches. Refactor blog components to accept StrapiNewsArticle instead of IBlogPost.

## Load context

Read:
- `claude-config/CTX-01-phase2b.md`
- `claude-config/CTX-02-types.md`
- `claude-config/CTX-03-data-layer.md`

Then read:
- `src/app/nyheter/page.tsx`
- `src/app/nyheter/artiklar/page.tsx`
- `src/app/nyheter/artiklar/[slug]/page.tsx`
- `src/components/blog/FeaturedBlog.tsx`
- `src/components/blog/BlogShowcase.tsx`
- Any blog-details components used by the article slug page

## Tasks

### Task 1 — Refactor FeaturedBlog.tsx

Currently accepts `articles: IBlogPost[]`.

Read the file. Refactor to accept `articles: StrapiNewsArticle[]`.

Field mapping per CTX-03:
- `IBlogPost.title` → `StrapiNewsArticle.title`
- `IBlogPost.description` → `StrapiNewsArticle.excerpt`
- `IBlogPost.thumbnail` → `StrapiNewsArticle.coverImage?.url ?? '/images/ns-img-435.png'` (placeholder fallback)
- `IBlogPost.tag` → `StrapiNewsArticle.tag`
- `IBlogPost.author` → `StrapiNewsArticle.author`
- `IBlogPost.readTime` → `StrapiNewsArticle.readTime`
- `IBlogPost.featured` → `StrapiNewsArticle.featured`
- `IBlogPost.publishDate` → `StrapiNewsArticle.publishDate`
- `IBlogPost.slug` → `StrapiNewsArticle.slug`

Keep all `t()` calls and visual layout identical.

### Task 2 — Refactor BlogShowcase.tsx

Same prop refactor as FeaturedBlog — `IBlogPost[]` → `StrapiNewsArticle[]` with same field mapping.

### Task 3 — Check blog-details components

Read the article slug page and its components. They likely use `IBlogPost.content` (markdown string) rendered with `ReactMarkdown`.

Refactor to render `StrapiNewsArticle.body` (Block[]) with `BlocksRenderer`.

If there is a Contents component for blog detail, follow the same pattern as product-details/Contents.tsx — accept `article: StrapiNewsArticle` as prop, render `body` with BlocksRenderer.

### Task 4 — Update src/app/nyheter/page.tsx

```tsx
import { fetchNewsArticles } from '@/lib/strapiClient';
import FeaturedBlog from '@/components/blog/FeaturedBlog';
import BlogShowcase from '@/components/blog/BlogShowcase';

const NyheterPage = async () => {
  const articles = await fetchNewsArticles('sv');
  return (
    <main className="bg-background-3 dark:bg-background-7">
      <FeaturedBlog articles={articles} />
      <BlogShowcase articles={articles} />
    </main>
  );
};
```

Remove `getMarkDownData` and `IBlogPost` imports.

### Task 5 — Update src/app/nyheter/artiklar/page.tsx

Same pattern — fetch from Strapi, pass to components.

### Task 6 — Update src/app/nyheter/artiklar/[slug]/page.tsx

```tsx
import { fetchNewsArticles, fetchNewsArticleBySlug } from '@/lib/strapiClient';

export async function generateStaticParams() {
  const articles = await fetchNewsArticles('sv');
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await fetchNewsArticleBySlug(slug, 'sv');
  return {
    ...defaultMetadata,
    title: `${article?.title ?? slug} — T-Meeting`,
  };
}
```

### Task 7 — Delete markdown blog files

After build passes:
```bash
rm src/data/blogs/tmm-tera-lansering.md
rm src/data/blogs/tmm-ring-direkte.md
rm src/data/blogs/tmm-etsi-samarbete.md
rmdir src/data/blogs
```

If `src/data/` is now empty (products and tjanster already deleted), remove it too:
```bash
rmdir src/data 2>/dev/null || true
```

### Task 8 — Build verification

```bash
pnpm build
```

Must generate:
```
/nyheter
/nyheter/artiklar
/nyheter/artiklar/tera-tillganglig-realtidstexttelefoni
/nyheter/artiklar/ring-direkte-ring-utan-tolk
/nyheter/artiklar/t-meeting-bidrar-till-etsi-standarder
```

## Definition of done

- FeaturedBlog and BlogShowcase accept StrapiNewsArticle[]
- Article detail renders Blocks body
- generateStaticParams() fetches from Strapi
- Markdown blog files deleted
- pnpm build passes, all 3 article pages generated

## Output a plan first. Wait for "Approved".
