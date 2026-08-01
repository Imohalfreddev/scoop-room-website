# Scoop Room

A premium, fast, SEO-friendly newsroom platform — built standalone with mock data,
architected to connect to your existing news aggregator backend through REST APIs
with no rebuild required.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Three.js / React Three Fiber · Prisma (schema-ready) · PostgreSQL (schema-ready)

---

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The public site, blog, search, and the admin dashboard
at `/admin` all work immediately against bundled mock data — no database or
external API required.

```bash
npm run build   # production build
npm run start   # run the production build
npm run typecheck
npm run lint
```

---

## Architecture: standalone today, aggregator-ready tomorrow

Every piece of data on this site flows through **one layer**: `src/lib/api/*.ts`.
Pages and components never call `fetch` themselves and (with a couple of
documented exceptions — see below) never read mock data directly. They call
functions like `getLatestArticles()`, `getArticleBySlug()`, `searchArticles()`,
`subscribeToNewsletter()`.

```
Page/Component
      │
      ▼
src/lib/api/*.ts        ← the only thing UI code imports
      │
      ├─ server-side + mock mode → src/lib/repository/*.ts (direct, in-process)
      └─ client-side, or live mode → fetch() → src/app/api/*/route.ts
                                                        │
                                                        ▼
                                          src/lib/repository/*.ts (mock data)
```

- **`src/app/api/*/route.ts`** — real Next.js Route Handlers. They define the
  exact REST contract (`GET /api/articles?category=nigeria&page=2`, etc.) your
  aggregator should implement. Point any HTTP client at these today.
- **`src/lib/repository/*.ts`** — the actual query/filter logic against mock
  data, shared by the route handlers and by Server Components (so
  Server Components don't make a network call to themselves during
  build/render — see note below).
- **`src/lib/api/*.ts`** — what the UI actually imports. In mock mode, Server
  Components read the repository directly; the browser always goes through
  the real `/api/*` routes (open DevTools → Network on any page and you'll
  see genuine REST calls for client-side interactions like search, infinite
  scroll, and the admin dashboard).

### Switching to your real aggregator

In `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.your-aggregator.example.com/v1
```

That's it for wiring — `src/lib/api/config.ts` is the single switch. If your
aggregator's JSON doesn't already match the shapes in `src/types/index.ts`,
add a small mapping function inside the relevant `src/lib/api/*.ts` file
(each one has a clear seam for this). No component or page needs to change.

### Why Server Components don't just `fetch('/api/...')`

It's tempting to have Server Components call this app's own API routes over
HTTP. It doesn't work during `next build`'s static generation (no server is
listening yet), and it's an unnecessary network hop at request time. The
`src/lib/repository` layer exists so mock-mode reads happen in-process, while
the real `/api/*` HTTP contract still exists for the browser and for the
future aggregator integration.

---

## Database (Prisma + PostgreSQL)

`prisma/schema.prisma` is the target relational model — `Article`, `Category`,
`Tag`, `User` (authors/editors), `MediaAsset`, `Comment`,
`NewsletterSubscriber`, `PushSubscription`, `AdSlotConfig`. It's not connected
to a live database yet; the app runs entirely on mock data without it.

To activate:

```bash
# 1. Set DATABASE_URL in .env.local to a real Postgres instance
# 2. Create the schema
npx prisma migrate dev --name init
# 3. Seed it with the same content used in mock mode
npm run db:seed
```

From there, swap the bodies of `src/app/api/*/route.ts` to query Prisma
instead of `src/lib/repository/*` (or, more likely, point
`NEXT_PUBLIC_API_BASE_URL` at your aggregator, which owns its own database).

---

## Project structure

```
src/
  app/
    (site)/            Public site — layout adds header/ticker/footer
      page.tsx          Homepage
      category/[slug]/  Category listing pages
      article/[slug]/   Article detail
      author/[slug]/    Author profile
      blog/, blog/[slug]/
      search/, bookmarks/
    admin/              CMS dashboard — separate layout, no public chrome
      articles/, categories/, media/, users/,
      notifications/, homepage-editor/, seo/
    api/                REST route handlers (the aggregator contract)
    sitemap.ts, robots.ts, manifest.ts, feed.xml/route.ts
  components/
    layout/   home/   news/   admin/   search/   three/   seo/   icons/
  lib/
    api/          Service layer — the only thing UI imports for data
    repository/   Shared query logic (mock data today, swap for Prisma later)
    mock/         Sample dataset — articles, authors, categories, tags, media…
    hooks/        useBookmarks / useReadingHistory (localStorage-backed)
    seo/          JSON-LD builders
  types/          Shared domain types (mirrors prisma/schema.prisma)
prisma/
  schema.prisma   Target DB model
  seed.ts         Seeds a real Postgres DB from the same mock dataset
public/
  brand/          Processed logo (light/dark/transparent variants + icons)
  sw.js           Push notification service worker scaffold
```

---

## What's implemented

- **Homepage** — 3D hero slider (ambient React Three Fiber backdrop + real
  story imagery, auto-advancing, pointer parallax, respects
  `prefers-reduced-motion`), breaking news ticker, latest news with infinite
  scroll, trending rail, a showcase section per category (Nigeria, Africa,
  World, Politics, Business, Technology, Entertainment, Sports, Lifestyle,
  AI), sidebar (weather, markets, popular stories, trending searches),
  newsletter signup.
- **Articles** — rich content, image gallery, video, share bar, bookmarks,
  tags, author bio, related stories, optional comments, in-article ad slot,
  full SEO metadata + `NewsArticle`/`BreadcrumbList` JSON-LD.
  Reading history is recorded automatically.
- **Search** — instant header search (⌘K-style overlay) plus a dedicated
  `/search` page with category and date filters and trending suggestions.
  Bookmarks and reading history live at `/bookmarks` (localStorage-backed
  until there's user auth — see below).
- **Blog** — separate section with its own listing, popular posts, related
  posts, comments.
- **Admin dashboard** (`/admin`) — analytics overview (Recharts), articles
  table with search/filter/delete, an article editor (headline, dek, cover
  image, categories, tags, scheduling, featured toggle, SEO fields, and a
  lightweight rich-text editor), categories, media library (with simulated
  upload), users, notifications (+ a push notification composer), a
  homepage/hero-order editor, and an SEO overview.
- **SEO** — `sitemap.xml`, `robots.txt`, `feed.xml` (RSS), Open Graph/Twitter
  cards, canonical URLs, JSON-LD, a web manifest for installability.
- **Monetization** — `AdSlot` component (leaderboard, in-article, sidebar,
  sponsored-post placements) with a brand-consistent house placeholder today
  and a documented integration point for Google AdSense; sponsored-post and
  affiliate-link patterns are supported by the same component and by
  `article.sponsored` in the data model.
- **Dark mode**, responsive layout throughout, `next/image` everywhere for
  optimized loading, `revalidate`-based ISR on data-heavy pages.

## Known simplifications (by design, for a standalone mock build)

These are intentionally simple placeholders with a clear seam to replace —
each is called out with a `TODO(aggregator)` or doc-comment at the relevant
file:

- **Auth** — the admin dashboard has no login; there's no session/user model
  wired up yet. `prisma/schema.prisma`'s `User.role` is ready for it.
- **Writes** (create/update/delete article, newsletter signup, comments,
  media upload) hit in-memory mock routes that reset on server restart —
  they're not persisted to a real database.
- **Rich text editor** is a small `contentEditable` implementation
  (`src/components/admin/RichTextEditor.tsx`) to avoid an extra dependency
  in the demo. Swap for Tiptap or Lexical for production-grade editing.
- **Push notifications** — `public/sw.js` and the opt-in button work, but
  there's no push server sending real notifications yet (needs VAPID keys
  + a backend, see `.env.example`).
- **Weather/markets widgets** return fixed mock data
  (`src/app/api/weather`, `src/app/api/markets`) — swap the handler body for
  a real provider whenever you have an API key.
- **Mock images are generated locally**, not fetched from a third-party
  placeholder service. An earlier version of this dataset used
  `picsum.photos`/`i.pravatar.cc`, which intermittently return 403s to
  server-side requests (Next's Image Optimizer proxies remote images
  through your server, so a flaky third party breaks every image on the
  site). `src/app/api/placeholder` and `src/app/api/avatar` generate
  deterministic branded SVGs with zero external dependency instead — see
  `src/lib/placeholder.ts`.
- A couple of client components (`src/components/news/BookmarksClient.tsx`,
  admin pages) import mock data directly rather than going through
  `src/lib/api`, since bookmarks/admin-table state is inherently local to
  the browser session in this build.

---

## Design system

Brand colors: Signal Red `#e30613`, Ink `#111111`, Paper `#ffffff` (tokens in
`src/app/globals.css`, Tailwind v4 `@theme`). Typography: Space Grotesk for
display/headlines, Inter for body, JetBrains Mono for timestamps/data/ticker
text — a deliberate nod to wire-service typography. The recurring visual
motif ("the Wire") — a slim red vertical rule — is lifted directly from the
divider in the Scoop Room logo mark and reused for section eyebrows, the
hero's slide-progress indicator, and footer dividers.
