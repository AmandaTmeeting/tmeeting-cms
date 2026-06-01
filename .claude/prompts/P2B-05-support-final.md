# P2B-05 — Support Pages + Final Build Verification

## Goal

Replace the remaining hardcoded data sources (system-status.ts, DocsContent manuals array) with Strapi fetches. Final Phase 2b build verification.

## Load context

Read:
- `claude-config/CTX-01-phase2b.md`
- `claude-config/CTX-02-types.md`
- `claude-config/CTX-03-data-layer.md`

Then read:
- `src/app/support/driftstatus/page.tsx`
- `src/data/system-status.ts`
- `src/components/system-status/StatusHeader.tsx`
- `src/components/system-status/SystemsList.tsx`
- `src/components/system-status/IncidentsSection.tsx`
- `src/components/system-status/ChangelogSection.tsx`
- `src/components/documentation/DocsContent.tsx`
- `src/app/support/manualer/page.tsx`
- `src/app/support/nedladdning/page.tsx`

## Tasks

### Task 1 — Update driftstatus/page.tsx

Currently calls `getStatusPageData()` from the hardcoded `src/data/system-status.ts`.

Refactor to fetch from Strapi:

```tsx
import { fetchSystemStatus } from '@/lib/strapiClient';
import { notFound } from 'next/navigation';

export default async function DrifstatusPage() {
  const status = await fetchSystemStatus();
  if (!status) notFound();

  // systems, incidents, changelog now come from Strapi
  // overall status calculation stays the same (derive from status.systems)
  const overallStatus = status.systems.every(s => s.status === 'operational')
    ? 'operational'
    : status.systems.some(s => s.status === 'down')
    ? 'down'
    : 'degraded';

  const averageUptime = status.systems.length > 0
    ? status.systems.reduce((sum, s) => sum + s.uptime, 0) / status.systems.length
    : 100;

  return (
    <main>
      <StatusHeader
        overallStatus={overallStatus}
        averageUptime={averageUptime}
        lastUpdated={new Date(status.updatedAt)}
      />
      <SystemsList systems={status.systems} />
      <IncidentsSection incidents={status.incidents} />
      <ChangelogSection changelog={status.changelog} />
    </main>
  );
}
```

Check current prop types on StatusHeader, SystemsList, IncidentsSection, ChangelogSection — adapt the Strapi data shape to match what the components expect, or update the component prop types to use the Strapi types directly.

The Strapi types match closely:
- `StrapiSystemEntry` has the same fields as whatever the current System type has
- `StrapiIncident` has `incidentStatus` (not `status`) — check if the component uses `status` and adapt

### Task 2 — Delete src/data/system-status.ts

After the driftstatus page works:
```bash
rm src/data/system-status.ts
```

### Task 3 — Refactor DocsContent.tsx (manualer)

Currently has a hardcoded `manuals` array.

Refactor to accept `documents: StrapiSupportDocument[]` as prop. Remove the hardcoded array. Map fields:
- `document.title` → title
- `document.productName` → product label
- `document.externalUrl` → download link (placeholder `#` for now)
- `document.version` → version badge

Keep all `t()` calls for labels.

### Task 4 — Update src/app/support/manualer/page.tsx

```tsx
import { fetchSupportDocuments } from '@/lib/strapiClient';
import DocsContent from '@/components/documentation/DocsContent';

const ManualerPage = async () => {
  const documents = await fetchSupportDocuments('manual', 'sv');
  return (
    <main className="bg-background-3 dark:bg-background-7">
      <DocsContent documents={documents} />
    </main>
  );
};
```

### Task 5 — Update src/app/support/nedladdning/page.tsx

Read the current nedladdning page and Content component. If it has hardcoded download entries, refactor to fetch from Strapi:

```tsx
import { fetchSupportDocuments } from '@/lib/strapiClient';

const NedladdningPage = async () => {
  const downloads = await fetchSupportDocuments('download', 'sv');
  // pass to content component
};
```

If the nedladdning page has no dynamic content (just static text with no download list), leave it as-is — only add Strapi fetch if there's actual download data to show.

### Task 6 — Final sweep

Check if any other component still imports from `src/data/`:
```bash
grep -r "from '@/data/" src/ --include="*.tsx" --include="*.ts"
grep -r "getMarkDownData\|getMarkDownContent" src/ --include="*.tsx" --include="*.ts"
```

Fix any remaining references.

Also check if `src/data/` directory is now empty and can be removed:
```bash
ls src/data/ 2>/dev/null && echo "data/ still has files" || echo "data/ empty or gone"
```

### Task 7 — Final build

```bash
pnpm build
```

This is the Phase 2b completion build. It must:
- Complete with 0 errors
- Generate pages for all 25 routes
- Show no markdown data reads (all content from Strapi)

Expected static pages generated (confirm these appear in build output):
```
/               /produkter          /produkter/tera
/produkter/tm   /produkter/tm-pc-flerpart  /produkter/tm-alert
/produkter/tm-no /produkter/tera-no
/tjanster       /tjanster/ringdirekt-se /tjanster/ringdirekte
/tjanster/distanstolken /tjanster/tillganglig-kundtjanst
/om-oss         /om-oss/vision       /samarbete
/support        /support/kontakta-support /support/driftstatus
/support/manualer /support/nedladdning
/nyheter        /nyheter/artiklar
/nyheter/artiklar/tera-tillganglig-realtidstexttelefoni
/nyheter/artiklar/ring-direkte-ring-utan-tolk
/nyheter/artiklar/t-meeting-bidrar-till-etsi-standarder
/integritetspolicy /tillganglighet
```

### Task 8 — Update tmeeting.com README

Add a section: "Running locally requires Strapi CMS to be running at http://localhost:1337. Start with `cd ../tmeeting-cms && npm run develop` before running `pnpm build` or `pnpm dev`."

## Definition of done

- driftstatus fetches from Strapi
- DocsContent accepts StrapiSupportDocument[] prop
- system-status.ts deleted
- No remaining getMarkDownData/getMarkDownContent imports
- pnpm build passes with 0 errors, all 25 routes generated
- Phase 2b complete — Next.js fully connected to Strapi

## Output a plan first. Wait for "Approved".
